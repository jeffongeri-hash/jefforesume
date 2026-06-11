import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SCHWAB_AUTH_URL = "https://api.schwabapi.com/v1/oauth/authorize";
const SCHWAB_TOKEN_URL = "https://api.schwabapi.com/v1/oauth/token";

function getCallbackUrl(req: Request) {
  const url = new URL(req.url);
  // Strip trailing /callback or /start if present, rebuild base
  const base = `${url.protocol}//${url.host}/functions/v1/schwab-auth`;
  return `${base}/callback`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientId = Deno.env.get("SCHWAB_CLIENT_ID");
  const clientSecret = Deno.env.get("SCHWAB_CLIENT_SECRET");

  if (!clientId || !clientSecret) {
    return new Response(
      JSON.stringify({ error: "Schwab credentials not configured. Add SCHWAB_CLIENT_ID and SCHWAB_CLIENT_SECRET secrets." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();
  const callbackUrl = getCallbackUrl(req);

  try {
    // STEP 1: Redirect user to Schwab's authorization page
    if (path === "start" || path === "schwab-auth") {
      const authUrl = new URL(SCHWAB_AUTH_URL);
      authUrl.searchParams.set("client_id", clientId);
      authUrl.searchParams.set("redirect_uri", callbackUrl);
      authUrl.searchParams.set("response_type", "code");
      return Response.redirect(authUrl.toString(), 302);
    }

    // STEP 2: Schwab redirects back with ?code=...
    if (path === "callback") {
      const code = url.searchParams.get("code");
      if (!code) {
        return new Response("Missing authorization code", { status: 400, headers: corsHeaders });
      }

      const basic = btoa(`${clientId}:${clientSecret}`);
      const tokenRes = await fetch(SCHWAB_TOKEN_URL, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: callbackUrl,
        }),
      });

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        console.error("Schwab token exchange failed:", errText);
        return new Response(`Token exchange failed: ${errText}`, {
          status: 500,
          headers: corsHeaders,
        });
      }

      const tokens = await tokenRes.json();
      const expiresAt = new Date(Date.now() + (tokens.expires_in ?? 1800) * 1000).toISOString();

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      // Replace any existing token row
      await supabase.from("schwab_tokens").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      const { error } = await supabase.from("schwab_tokens").insert({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: expiresAt,
      });

      if (error) {
        console.error("DB insert failed:", error);
        return new Response(`DB error: ${error.message}`, { status: 500, headers: corsHeaders });
      }

      return new Response(
        `<!doctype html><html><body style="font-family:system-ui;padding:40px;text-align:center;background:#0f172a;color:#fff">
          <h1>✅ Schwab connected</h1>
          <p>You can close this tab and return to the IV Strike Selector.</p>
          <script>setTimeout(() => window.close(), 1500);</script>
        </body></html>`,
        { headers: { ...corsHeaders, "Content-Type": "text/html" } }
      );
    }

    return new Response("Not found", { status: 404, headers: corsHeaders });
  } catch (err) {
    console.error("schwab-auth error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});