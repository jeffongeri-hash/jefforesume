import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token")?.trim() || "";
    if (token.length < 24 || token.length > 128) {
      return json({ error: "Invalid token" }, 404);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: link } = await supabase
      .from("pav_share_links")
      .select("user_id, kind")
      .eq("token", token)
      .eq("kind", "licenses")
      .maybeSingle();

    if (!link) return json({ error: "Not found" }, 404);

    const { data: licenses } = await supabase
      .from("pav_licenses")
      .select(
        "id, kind, name, number, issuer, state, issue_date, expiration_date, notes",
      )
      .eq("user_id", link.user_id)
      .order("expiration_date", { ascending: true, nullsFirst: false });

    return json({ licenses: licenses ?? [] }, 200);
  } catch (e) {
    return json({ error: "Server error" }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}