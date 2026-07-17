import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

const allowedKinds = new Set([
  "license",
  "certification",
  "registration",
  "dea",
  "npi",
  "other",
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token")?.trim() || "";
    if (token.length < 24 || token.length > 128) {
      return json({ error: "Invalid link" }, 404);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: link } = await supabase
      .from("pav_share_links")
      .select("user_id, kind")
      .eq("token", token)
      .eq("kind", "licenses-admin")
      .maybeSingle();

    if (!link) return json({ error: "Not found" }, 404);

    if (req.method === "GET") {
      const { data: licenses, error } = await supabase
        .from("pav_licenses")
        .select(
          "id, kind, name, number, issuer, state, issue_date, expiration_date, notes",
        )
        .eq("user_id", link.user_id)
        .order("expiration_date", { ascending: true, nullsFirst: false });

      if (error) return json({ error: "Unable to load licenses" }, 500);
      return json({ licenses: licenses ?? [] }, 200);
    }

    if (req.method === "POST" || req.method === "PUT") {
      const body = await req.json().catch(() => null);
      const parsed = parseLicense(body, req.method === "PUT");
      if ("error" in parsed) return json({ error: parsed.error }, 400);

      const payload = { ...parsed.value, user_id: link.user_id };
      const query = req.method === "PUT"
        ? supabase
            .from("pav_licenses")
            .update(payload)
            .eq("id", parsed.id)
            .eq("user_id", link.user_id)
            .select(
              "id, kind, name, number, issuer, state, issue_date, expiration_date, notes",
            )
            .maybeSingle()
        : supabase
            .from("pav_licenses")
            .insert(payload)
            .select(
              "id, kind, name, number, issuer, state, issue_date, expiration_date, notes",
            )
            .maybeSingle();

      const { data, error } = await query;
      if (error || !data) return json({ error: "Unable to save license" }, 500);
      return json({ license: data }, 200);
    }

    if (req.method === "DELETE") {
      const id = url.searchParams.get("id")?.trim() || "";
      if (!isUuid(id)) return json({ error: "Invalid license" }, 400);
      const { error } = await supabase
        .from("pav_licenses")
        .delete()
        .eq("id", id)
        .eq("user_id", link.user_id);
      if (error) return json({ error: "Unable to delete license" }, 500);
      return json({ ok: true }, 200);
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (_e) {
    return json({ error: "Server error" }, 500);
  }
});

function parseLicense(body: unknown, requireId: boolean) {
  if (!body || typeof body !== "object") return { error: "Invalid entry" };
  const record = body as Record<string, unknown>;
  const id = clean(record.id, 80);
  if (requireId && !isUuid(id)) return { error: "Invalid license" };

  const kind = clean(record.kind, 40) || "license";
  const name = clean(record.name, 160);
  if (!allowedKinds.has(kind)) return { error: "Invalid type" };
  if (!name) return { error: "Name is required" };

  const value = {
    kind,
    name,
    number: nullable(clean(record.number, 160)),
    issuer: nullable(clean(record.issuer, 200)),
    state: nullable(clean(record.state, 80)),
    issue_date: nullableDate(record.issue_date),
    expiration_date: nullableDate(record.expiration_date),
    notes: nullable(clean(record.notes, 500)),
  };

  return requireId ? { id, value } : { value };
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function nullable(value: string) {
  return value || null;
}

function nullableDate(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}