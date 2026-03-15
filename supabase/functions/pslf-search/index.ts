import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return new Response(JSON.stringify({ error: "Query must be at least 2 characters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a PSLF (Public Service Loan Forgiveness) hospital/clinic research assistant. When given a city, zip code, state, or region, return PSLF-qualifying hospitals and clinics in that area.

RULES:
1. Return ONLY hospitals, medical centers, clinics, and health systems that are either:
   - Government employers (federal, state, county, city, tribal) — mark as "government"
   - 501(c)(3) nonprofit organizations — mark as "nonprofit"
2. Do NOT include for-profit hospitals (e.g., HCA Healthcare, Tenet Health, Community Health Systems facilities are typically for-profit — exclude them unless you are confident a specific facility is nonprofit)
3. For each result, provide:
   - name: Full hospital/clinic name
   - city: City
   - state: 2-letter state code
   - zip: ZIP code (best estimate if unsure)
   - type: "government" or "nonprofit"
   - system: Parent health system name
   - confidence: "high" if you are very confident about the nonprofit/government status, "medium" if somewhat confident
   - notes: Brief note about why it qualifies (e.g., "Federal VA hospital", "501(c)(3) nonprofit health system", "County public hospital")
4. Include VA hospitals, Indian Health Service facilities, university/teaching hospitals, county health systems, and major nonprofit systems (Kaiser, Sutter, Banner, Dignity Health/CommonSpirit, Ascension, Trinity, Providence, Intermountain, etc.)
5. Also include nonprofit community health centers (FQHCs) and public health department clinics when relevant.
6. Return 10-20 results maximum, prioritizing the most well-known and clearly qualifying employers.
7. If the query is a zip code, find hospitals near that zip code area.

RESPOND WITH ONLY a valid JSON array of objects. No markdown, no explanation, no code fences. Just the raw JSON array.

Example format:
[{"name":"Example Hospital","city":"Example City","state":"CA","zip":"90001","type":"nonprofit","system":"Example Health","confidence":"high","notes":"501(c)(3) nonprofit health system"}]`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Find PSLF-qualifying hospitals and clinics in or near: ${query.trim()}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Search service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";

    // Parse JSON from the AI response, handling potential markdown fences
    let hospitals;
    try {
      const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      hospitals = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      hospitals = [];
    }

    return new Response(JSON.stringify({ hospitals }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PSLF search error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
