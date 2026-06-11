import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SCHWAB_TOKEN_URL = "https://api.schwabapi.com/v1/oauth/token";
const SCHWAB_API_BASE = "https://api.schwabapi.com";

async function getValidAccessToken(supabase: any, clientId: string, clientSecret: string): Promise<string | null> {
  const { data: rows, error } = await supabase
    .from("schwab_tokens")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error || !rows || rows.length === 0) return null;
  const row = rows[0];

  const expiresAt = new Date(row.expires_at).getTime();
  // Refresh if <2 min remaining
  if (expiresAt - Date.now() > 120_000) {
    return row.access_token;
  }

  // Refresh
  const basic = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch(SCHWAB_TOKEN_URL, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: row.refresh_token,
    }),
  });

  if (!res.ok) {
    console.error("Refresh failed:", await res.text());
    return null;
  }

  const tokens = await res.json();
  const newExpiresAt = new Date(Date.now() + (tokens.expires_in ?? 1800) * 1000).toISOString();

  await supabase
    .from("schwab_tokens")
    .update({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token ?? row.refresh_token,
      expires_at: newExpiresAt,
    })
    .eq("id", row.id);

  return tokens.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientId = Deno.env.get("SCHWAB_CLIENT_ID");
    const clientSecret = Deno.env.get("SCHWAB_CLIENT_SECRET");
    if (!clientId || !clientSecret) {
      return new Response(JSON.stringify({ error: "Schwab credentials not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, symbol, contractType = "ALL", strikeCount = 20 } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const accessToken = await getValidAccessToken(supabase, clientId, clientSecret);
    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: "not_authenticated", message: "Connect Schwab account first." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let upstreamUrl = "";
    if (action === "quote") {
      upstreamUrl = `${SCHWAB_API_BASE}/marketdata/v1/quotes?symbols=${encodeURIComponent(symbol)}`;
    } else if (action === "chains") {
      const params = new URLSearchParams({
        symbol,
        contractType,
        strikeCount: String(strikeCount),
        includeUnderlyingQuote: "true",
      });
      upstreamUrl = `${SCHWAB_API_BASE}/marketdata/v1/chains?${params}`;
    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const upstream = await fetch(upstreamUrl, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/json",
      },
    });

    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("schwab-proxy error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});