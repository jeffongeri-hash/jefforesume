import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

const FIELDS = [
  "person_name","relationship","date_of_birth","primary_care_physician","emergency_contacts","medications","allergies",
  "cpr","ventilation","nutrition_hydration","dialysis","coma_pvs","stroke_paralysis","dementia","pain_vs_alertness",
  "care_setting","financial_burden","organ_donation","surrogate_decision_maker","additional_notes",
];
const clean = (p: Record<string, unknown> = {}) => {
  const o: Record<string, unknown> = {};
  for (const k of FIELDS) if (k in p) o[k] = p[k] === "" && k === "date_of_birth" ? null : p[k];
  return o;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const { action, password, id, payload } = await req.json();
    const expected = Deno.env.get("FAMILY_DIRECTIVE_PASSWORD");
    if (!expected) return json({ error: "No password has been configured yet." });
    if (typeof password !== "string" || password !== expected) return json({ error: "Incorrect password." });

    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const t = db.from("family_directives");
    let r;
    switch (action) {
      case "check": return json({ data: true });
      case "list": r = await t.select("*").order("person_name"); break;
      case "insert": r = await t.insert(clean(payload)).select().single(); break;
      case "update": r = await t.update(clean(payload)).eq("id", id).select().single(); break;
      case "delete": r = await t.delete().eq("id", id); break;
      default: return json({ error: "Unknown action" });
    }
    if (r.error) return json({ error: r.error.message });
    return json({ data: r.data });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
