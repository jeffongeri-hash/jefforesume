// @ts-nocheck
import { useState, useCallback, useRef, useEffect, useMemo } from "react";

// Edge function endpoint (Anthropic primary, OpenAI fallback)
const IV_AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/iv-ai`;
const IV_AI_HEADERS = {
  "Content-Type": "application/json",
  apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
};

async function ai(prompt, maxTokens = 900) {
  const r = await fetch(IV_AI_URL, {
    method: "POST", headers: IV_AI_HEADERS,
    body: JSON.stringify({ mode: "json", prompt, maxTokens, webSearch: true }),
  });
  if (!r.ok) throw new Error(`API ${r.status}`);
  const d = await r.json();
  return d.text || "";
}
async function aiSearch(prompt, maxTokens = 1200) { return ai(prompt, maxTokens); }

async function aiStream(a, b, c, d) {
  // Supports both signatures: (prompt, onChunk, signal) and (systemPrompt, userPrompt, onChunk, signal)
  let prompt, onChunk, signal;
  if (typeof b === "function") { prompt = a; onChunk = b; signal = c; }
  else { prompt = `${a}\n\n${b}`; onChunk = c; signal = d; }
  const r = await fetch(IV_AI_URL, {
    method: "POST", headers: IV_AI_HEADERS, signal,
    body: JSON.stringify({ mode: "stream", prompt, maxTokens: 1500 }),
  });
  const reader = r.body.getReader();
  const dec = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of dec.decode(value).split("\n")) {
      if (line.startsWith("data: ")) {
        try {
          const ev = JSON.parse(line.slice(6));
          if (ev.type === "content_block_delta" && ev.delta?.text) onChunk(ev.delta.text);
        } catch {}
      }
    }
  }
}


function parseJSON(text) {
  const m = text.match(/\{[\s\S]*?\}/g);
  if (!m) return null;
  for (let i = m.length - 1; i >= 0; i--) {
    try { return JSON.parse(m[i]); } catch {}
  }
  return null;
}

// ─── MOVE TARGET DATE ─────────────────────────────────────────────────────────
// September 1, 2027 — adjustable
const MOVE_TARGET = new Date("2027-09-01T00:00:00");

function getCountdown() {
  const now  = new Date();
  const diff = MOVE_TARGET - now;
  if (diff <= 0) return { days:0, hours:0, minutes:0, seconds:0, past:true };
  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000)  / 60000);
  const seconds = Math.floor((diff % 60000)    / 1000);
  const months  = Math.floor(days / 30.44);
  const weeks   = Math.floor((days % 30.44) / 7);
  return { days, hours, minutes, seconds, months, weeks, remainDays: days % 7, past:false };
}

// ─── MOVERS DATA (Waterloo IA → Sacramento CA, ~1,850 miles) ─────────────────
const MOVERS = [
  {
    name: "PODS (Container)",
    type: "Container",
    website: "pods.com",
    rating: 4.2,
    reviews: "40K+",
    est_3br_low: 3200, est_3br_high: 4800,
    est_2br_low: 2600, est_2br_high: 3800,
    transit_days: "7–14 days",
    pros: ["You pack at your own pace", "Can store in PODS facility if needed", "No weight limits", "Insurance available"],
    cons: ["You do all the packing/loading", "Delivery window can vary", "Limited access during transit"],
    best_for: "Flexible timelines; downsizing from 3BR",
    deposit: "$0 upfront",
    insurance: "Coverage up to $10,000 included",
  },
  {
    name: "U-Pack ReloCube",
    type: "Container",
    website: "upack.com",
    rating: 4.3,
    reviews: "25K+",
    est_3br_low: 2900, est_3br_high: 4200,
    est_2br_low: 2400, est_2br_high: 3400,
    transit_days: "3–7 business days",
    pros: ["Faster than PODS", "Only pay for space used", "ABF freight carrier reliability", "Great for midwest→CA routes"],
    cons: ["You pack and load everything", "Must be ready by pickup window", "No mid-transit access"],
    best_for: "Best value container option for Iowa→CA",
    deposit: "Small deposit at booking",
    insurance: "Additional coverage available",
  },
  {
    name: "International Van Lines",
    type: "Full-Service",
    website: "internationalvanlines.com",
    rating: 4.5,
    reviews: "15K+",
    est_3br_low: 5800, est_3br_high: 8500,
    est_2br_low: 4200, est_2br_high: 6500,
    transit_days: "7–21 days",
    pros: ["Full pack + load + unload", "Licensed & insured", "Binding estimates available", "Good midwest reviews"],
    cons: ["Most expensive option", "Delivery window not guaranteed", "Items weighed after load"],
    best_for: "Stress-free move if budget allows",
    deposit: "10–25% deposit",
    insurance: "Full value protection available",
  },
  {
    name: "American Van Lines",
    type: "Full-Service",
    website: "americanvanlines.com",
    rating: 4.4,
    reviews: "12K+",
    est_3br_low: 5400, est_3br_high: 8000,
    est_2br_low: 3800, est_2br_high: 5800,
    transit_days: "7–14 days",
    pros: ["Flat-rate pricing option", "Specialty item handling (piano, art)", "Binding quote available", "Experienced long-haul crews"],
    cons: ["May use partner carriers", "Deposit required", "Pricing varies by season"],
    best_for: "Flat-rate pricing certainty",
    deposit: "10–20% deposit",
    insurance: "Released value + full value options",
  },
  {
    name: "U-Haul (DIY Truck)",
    type: "DIY Truck",
    website: "uhaul.com",
    rating: 3.8,
    reviews: "100K+",
    est_3br_low: 1800, est_3br_high: 2800,
    est_2br_low: 1400, est_2br_high: 2200,
    transit_days: "You drive (~26 hrs nonstop)",
    pros: ["Cheapest option by far", "Total control of schedule", "26ft truck fits full 3BR", "One-way rates competitive"],
    cons: ["You drive ~1,850 miles yourself", "Add gas ($400–$600 for 26ft truck)", "Physically exhausting", "Must return or leave truck in CA"],
    best_for: "Maximum savings if you're willing to drive",
    deposit: "$0 for reservation",
    insurance: "SafeMove coverage available",
    gas_extra: "$420–$560",
  },
  {
    name: "HireAHelper (Movers Only)",
    type: "Hybrid",
    website: "hireahelper.com",
    rating: 4.4,
    reviews: "30K+",
    est_3br_low: 2200, est_3br_high: 3600,
    est_2br_low: 1700, est_2br_high: 2800,
    transit_days: "Depends on container/truck choice",
    pros: ["Hire local movers in Waterloo + Sacramento", "Combine with PODS or U-Haul truck", "Vetted pros handle loading/unloading", "Background-checked workers"],
    cons: ["You still arrange transport separately", "Coordination between 2 companies", "Labor only, not transport"],
    best_for: "Best of both — local pros load, you choose transport",
    deposit: "Pay on day of service",
    insurance: "Labor guarantee included",
  },
];

// ─── SAVESETTINGS KEY ─────────────────────────────────────────────────────────
const MOVER_TYPES = ["All","Container","Full-Service","DIY Truck","Hybrid"];

// ─── STATIC BASELINES (Jeff's actual Waterloo, IA expenses) ──────────────────
// Updated June 2026 with real numbers Jeff provided
const IOWA_BASE = {
  rent_2br:    2000,  // Jeff's actual rent (3BR but using as baseline)
  rent_3br:    2000,  // Jeff's actual current rent
  groceries:   500,   // Jeff's actual monthly groceries
  gas_gal:     3.15,  // Iowa average gas price
  gas_monthly: 300,   // Jeff's actual gas + water + WiFi combined
  electric:    95,    // Estimated — included in Jeff's $300 utilities bundle
  internet:    60,    // Estimated within $300 bundle
  water:       45,    // Estimated within $300 bundle
  utilities_bundle: 300, // Jeff's actual: gas + water + WiFi combined
  shopping:    90,    // Jeff's actual monthly shopping
  income_tax:  6.0,
  sales_tax:   7.0,
  car_reg_yr:  90,
  sdi_pct:     0,
  label: "Waterloo, IA (Jeff's actual)",
  // Jeff's actual total known monthly
  actual_total: 2000 + 300 + 500 + 90, // = $2,890/mo known expenses
};

// Sacramento region suburbs data (research-backed 2026)
const SACTO_SUBURBS = [
  { name:"Sacramento (City)",   zip:"95814", rent_2br:1850, rent_3br:2400, gas:4.90, electric:280, groceries:730, commute_min:15 },
  { name:"Elk Grove",            zip:"95624", rent_2br:2100, rent_3br:2600, gas:4.85, electric:270, groceries:720, commute_min:30 },
  { name:"Roseville",            zip:"95678", rent_2br:2300, rent_3br:2750, gas:4.95, electric:265, groceries:725, commute_min:35 },
  { name:"Folsom",               zip:"95630", rent_2br:2400, rent_3br:2900, gas:4.98, electric:270, groceries:730, commute_min:32 },
  { name:"Rancho Cordova",       zip:"95670", rent_2br:1950, rent_3br:2300, gas:4.88, electric:268, groceries:715, commute_min:20 },
  { name:"Rocklin",              zip:"95765", rent_2br:2250, rent_3br:2725, gas:4.92, electric:260, groceries:718, commute_min:38 },
  { name:"Citrus Heights",       zip:"95610", rent_2br:1900, rent_3br:2250, gas:4.87, electric:265, groceries:712, commute_min:22 },
  { name:"Carmichael",           zip:"95608", rent_2br:1875, rent_3br:2200, gas:4.86, electric:266, groceries:710, commute_min:18 },
  { name:"Fair Oaks",            zip:"95628", rent_2br:2050, rent_3br:2500, gas:4.91, electric:268, groceries:720, commute_min:24 },
  { name:"Antelope",             zip:"95843", rent_2br:1920, rent_3br:2350, gas:4.89, electric:262, groceries:715, commute_min:28 },
  { name:"Lincoln",              zip:"95648", rent_2br:2100, rent_3br:2600, gas:4.90, electric:258, groceries:710, commute_min:45 },
  { name:"El Dorado Hills",      zip:"95762", rent_2br:2500, rent_3br:3100, gas:4.99, electric:275, groceries:735, commute_min:40 },
];

// CA hidden costs
const CA_HIDDEN = [
  { item:"State Income Tax (CA vs IA differential)", type:"annual",    impact:"HIGH",   color:"#EF4444", desc:"CA top rates: 9.3–13.3%. Iowa flat 6% (2026). On a $75K salary: ~$2,100–$4,200 more/year." },
  { item:"CA State Disability Insurance (SDI)",       type:"paycheck", impact:"HIGH",   color:"#EF4444", desc:"1.3% of ALL wages, no cap in 2026. Iowa has no SDI. On $75K salary = $975/yr deducted from your check." },
  { item:"Vehicle Registration (year 1)",             type:"one-time", impact:"HIGH",   color:"#F97316", desc:"CA VLF = 0.65% of vehicle value + $65 base + $32 CHP fee + county fees + smog. ~$400–$800 first year vs Iowa ~$90." },
  { item:"Smog Check (every 2 years)",                type:"biennial", impact:"MED",    color:"#F59E0B", desc:"Required in Sacramento County. $30–$80 every 2 years. Iowa has no smog check requirement." },
  { item:"CA Sales Tax",                              type:"ongoing",  impact:"MED",    color:"#F59E0B", desc:"Sacramento County: 8.75% combined. Iowa: 7.0%. Difference adds up on large purchases." },
  { item:"Renter's/Homeowner's Insurance",            type:"annual",   impact:"MED",    color:"#F59E0B", desc:"CA premiums run 20–40% higher than Iowa due to wildfire risk. Budget $1,200–$2,400/yr vs $800–$1,200 in Iowa." },
  { item:"Wildfire Insurance / Zone Risk",            type:"annual",   impact:"HIGH",   color:"#EF4444", desc:"Sacramento suburbs near foothills (El Dorado Hills, Folsom) may require separate wildfire riders $500–$1,500/yr. Some insurers have left CA entirely." },
  { item:"Moving Truck (Waterloo → Sacramento)",      type:"one-time", impact:"HIGH",   color:"#EF4444", desc:"~1,800 miles. Full-service movers: $6,500–$9,500. POD/container: $3,500–$5,500. DIY truck: $1,800–$2,800 + gas." },
  { item:"Security Deposit (CA)",                     type:"one-time", impact:"MED",    color:"#F59E0B", desc:"CA law: max 2 months rent. On a $2,200/mo apartment = up to $4,400 deposit. Iowa: typically 1 month." },
  { item:"First + Last Month Rent",                   type:"one-time", impact:"MED",    color:"#F59E0B", desc:"Many CA landlords require first + last + security deposit upfront. Budget $6,000–$9,000 move-in on arrival." },
  { item:"CA Driver's License",                       type:"one-time", impact:"LOW",    color:"#10B981", desc:"$36 fee. Must be obtained within 10 days of establishing CA residency. Also need to update voter registration." },
  { item:"Utility Setup Fees",                        type:"one-time", impact:"LOW",    color:"#10B981", desc:"PG&E (electric/gas) deposit for new residents: $100–$300. Internet setup: $50–$150. Typically waived after 12 months of on-time payment." },
  { item:"Prop 13 (if buying)",                       type:"annual",   impact:"HIGH",   color:"#EF4444", desc:"CA property tax capped at 1% of assessed value + 2%/yr. GOOD NEWS: locks in low increases after you buy. But Sacramento median home $560K → $5,600/yr base tax." },
  { item:"Mental Health Tax (income > $1M)",          type:"annual",   impact:"LOW",    color:"#10B981", desc:"1% surcharge on CA income above $1M. Does not apply to most residents but worth knowing as a PA-C with future income growth." },
  { item:"Paid Family Leave (CA PFL)",                type:"benefit",  impact:"POS",    color:"#10B981", desc:"POSITIVE: CA's SDI funds PFL — up to $1,765/week for 8 weeks for qualifying family events. Iowa has no equivalent paid benefit." },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#040B18;--bg1:#080E1E;--bg2:#0D1530;--bg3:#111E3A;
  --border:#1A2744;--border2:#243258;
  --purple:#7C3AED;--purple2:#9B5DE5;--purple3:#6D28D9;
  --cyan:#00D4FF;--green:#10B981;--red:#EF4444;--orange:#F97316;--yellow:#F59E0B;
  --text:#EEF2FF;--text2:#94A3B8;--text3:#475569;
  --mono:'DM Mono',monospace;--sans:'Syne',sans-serif;--body:'Inter',sans-serif;
}
body{background:var(--bg);color:var(--text);font-family:var(--body);line-height:1.5}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}

/* NAV */
.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 28px;
  background:var(--bg1);border-bottom:1px solid var(--border);
  position:sticky;top:0;z-index:100;flex-wrap:wrap;gap:8px}
.nav-brand{display:flex;align-items:center;gap:10px}
.nav-dot{width:8px;height:8px;border-radius:50%;background:var(--purple);
  box-shadow:0 0 12px var(--purple);animation:glow 2s infinite}
@keyframes glow{0%,100%{opacity:1;box-shadow:0 0 12px var(--purple)}50%{opacity:.5;box-shadow:0 0 6px var(--purple)}}
.nav-sub{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.2em}
.nav-title{font-family:var(--sans);font-size:16px;font-weight:800;color:var(--text)}
.nav-title span{color:var(--purple2)}
.nav-badges{display:flex;gap:6px;flex-wrap:wrap}
.nbadge{font-family:var(--mono);font-size:8px;letter-spacing:.1em;padding:3px 8px;
  border-radius:3px;border:1px solid}
.nbadge-p{color:var(--purple2);background:rgba(124,58,237,.08);border-color:rgba(124,58,237,.25)}
.nbadge-c{color:var(--cyan);background:rgba(0,212,255,.07);border-color:rgba(0,212,255,.2)}
.nbadge-g{color:var(--green);background:rgba(16,185,129,.07);border-color:rgba(16,185,129,.2)}

/* HERO */
.hero{background:linear-gradient(135deg,#060E22 0%,#0A1535 60%,#0D0B2E 100%);
  border-bottom:1px solid var(--border);padding:48px 28px 40px;text-align:center;
  position:relative;overflow:hidden}
.hero::before{content:"";position:absolute;top:-80px;left:50%;transform:translateX(-50%);
  width:600px;height:300px;border-radius:50%;
  background:radial-gradient(ellipse,rgba(124,58,237,.18) 0%,transparent 70%);pointer-events:none}
.hero-label{font-family:var(--mono);font-size:10px;color:var(--purple2);letter-spacing:.25em;
  margin-bottom:12px;text-transform:uppercase}
.hero-h1{font-family:var(--sans);font-size:clamp(28px,5vw,48px);font-weight:800;
  line-height:1.1;color:var(--text);letter-spacing:-.02em;margin-bottom:16px}
.hero-h1 span{color:var(--purple2)}
.hero-sub{font-size:15px;color:var(--text2);max-width:580px;margin:0 auto 28px;line-height:1.7}
.hero-route{display:inline-flex;align-items:center;gap:10px;
  background:rgba(124,58,237,.12);border:1px solid rgba(124,58,237,.3);
  border-radius:8px;padding:10px 20px;font-family:var(--mono);font-size:12px;color:var(--purple2)}
.hero-arrow{font-size:18px}

/* MAIN LAYOUT */
.main{max-width:1200px;margin:0 auto;padding:28px;display:flex;flex-direction:column;gap:24px}

/* CARD */
.card{background:var(--bg1);border:1px solid var(--border);border-radius:12px;overflow:hidden}
.card-head{padding:14px 20px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;
  background:rgba(0,0,0,.15)}
.card-title{font-family:var(--sans);font-size:14px;font-weight:700;color:var(--text);
  display:flex;align-items:center;gap:8px}
.card-title-icon{font-size:16px}
.card-sub{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.1em}
.card-body{padding:20px}

/* INPUTS */
.input-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
.field{display:flex;flex-direction:column;gap:5px}
.field label{font-family:var(--mono);font-size:9px;color:var(--text2);letter-spacing:.1em;font-weight:500}
.field input,.field select{background:var(--bg2);border:1px solid var(--border2);
  color:var(--text);font-family:var(--mono);font-size:13px;
  padding:9px 12px;border-radius:7px;outline:none;width:100%;transition:border-color .15s}
.field input:focus,.field select:focus{border-color:var(--purple)}
.field input::placeholder{color:var(--text3)}
.field-note{font-family:var(--mono);font-size:8px;color:var(--text3);line-height:1.5;margin-top:2px}

/* SUBURB GRID */
.suburb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}
.suburb-card{background:var(--bg2);border:2px solid var(--border);border-radius:10px;
  padding:14px;cursor:pointer;transition:all .18s}
.suburb-card:hover{border-color:var(--purple);background:rgba(124,58,237,.06)}
.suburb-card.selected{border-color:var(--purple);background:rgba(124,58,237,.1);
  box-shadow:0 0 0 1px rgba(124,58,237,.4)}
.suburb-name{font-family:var(--sans);font-size:13px;font-weight:700;color:var(--text);margin-bottom:6px}
.suburb-zip{font-family:var(--mono);font-size:9px;color:var(--purple2);margin-bottom:8px}
.suburb-stats{display:grid;grid-template-columns:1fr 1fr;gap:4px}
.ss-item{display:flex;flex-direction:column}
.ss-label{font-family:var(--mono);font-size:7.5px;color:var(--text3);letter-spacing:.08em}
.ss-val{font-family:var(--mono);font-size:11px;font-weight:500;color:var(--cyan)}
.suburb-tag{display:inline-block;margin-top:6px;font-family:var(--mono);font-size:7.5px;
  padding:2px 6px;border-radius:3px;background:rgba(0,212,255,.08);
  border:1px solid rgba(0,212,255,.2);color:var(--cyan)}
.live-badge{display:inline-flex;align-items:center;gap:4px;font-family:var(--mono);
  font-size:7.5px;color:var(--green);background:rgba(16,185,129,.08);
  border:1px solid rgba(16,185,129,.2);border-radius:3px;padding:2px 6px;margin-top:4px}
.live-dot{width:5px;height:5px;border-radius:50%;background:var(--green);animation:glow 1.5s infinite}

/* COMPARISON TABLE */
.cmp-table{width:100%;border-collapse:collapse}
.cmp-table th{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.12em;
  text-align:right;padding:8px 14px;border-bottom:1px solid var(--border);font-weight:500;white-space:nowrap}
.cmp-table th:first-child{text-align:left}
.cmp-table td{padding:9px 14px;border-bottom:1px solid rgba(26,55,92,.4);
  font-family:var(--mono);font-size:11px;vertical-align:middle}
.cmp-table tr:last-child td{border-bottom:none}
.cmp-table tr:hover td{background:rgba(255,255,255,.015)}
.cmp-cat{font-family:var(--sans);font-size:12px;font-weight:600;color:var(--text)}
.cmp-cat-sub{font-size:10px;color:var(--text3);font-weight:400;font-family:var(--mono)}
.cmp-iowa{color:var(--green)}
.cmp-ca{color:var(--cyan)}
.delta-pill{display:inline-flex;align-items:center;gap:3px;font-family:var(--mono);
  font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;white-space:nowrap}
.delta-bad{background:rgba(239,68,68,.1);color:var(--red);border:1px solid rgba(239,68,68,.2)}
.delta-good{background:rgba(16,185,129,.1);color:var(--green);border:1px solid rgba(16,185,129,.2)}
.delta-neutral{background:rgba(148,163,184,.08);color:var(--text2);border:1px solid rgba(148,163,184,.15)}

/* DELTA METER */
.delta-meter{background:linear-gradient(135deg,var(--bg2),var(--bg3));
  border:1px solid var(--border);border-radius:12px;padding:24px;
  display:flex;flex-direction:column;align-items:center;gap:12px;position:relative;overflow:hidden}
.delta-meter::before{content:"";position:absolute;top:-40px;right:-40px;width:150px;height:150px;
  border-radius:50%;background:radial-gradient(ellipse,rgba(124,58,237,.12),transparent 70%)}
.delta-label{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.15em}
.delta-val{font-family:var(--sans);font-size:40px;font-weight:800;
  background:linear-gradient(135deg,var(--red),var(--orange));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;line-height:1;transition:all .3s}
.delta-val.positive{background:linear-gradient(135deg,var(--green),var(--cyan));
  -webkit-background-clip:text;background-clip:text}
.delta-sub{font-family:var(--mono);font-size:10px;color:var(--text2);text-align:center;line-height:1.6}
.delta-bar-wrap{width:100%;height:8px;background:var(--bg3);border-radius:4px;overflow:hidden}
.delta-bar-fill{height:100%;border-radius:4px;transition:width .6s ease;
  background:linear-gradient(90deg,var(--purple),var(--red))}

/* SALARY BLOCK */
.salary-block{background:var(--bg2);border:1px solid var(--border2);border-radius:10px;
  padding:16px;display:flex;flex-direction:column;gap:10px}
.salary-row{display:flex;justify-content:space-between;align-items:center}
.sal-label{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.08em}
.sal-val{font-family:var(--mono);font-size:13px;font-weight:600}
.sal-divider{height:1px;background:var(--border)}
.take-home-box{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px}
.th-card{background:var(--bg3);border-radius:7px;padding:10px 12px;border:1px solid var(--border)}
.th-label{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.08em;margin-bottom:4px}
.th-val{font-family:var(--mono);font-size:15px;font-weight:600}

/* HIDDEN COSTS */
.hc-list{display:flex;flex-direction:column;gap:8px}
.hc-item{display:flex;align-items:flex-start;gap:12px;
  background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:12px 14px}
.hc-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:3px}
.hc-body{flex:1}
.hc-name{font-family:var(--sans);font-size:12px;font-weight:600;color:var(--text);margin-bottom:3px}
.hc-desc{font-size:12px;color:var(--text2);line-height:1.6}
.hc-badge{display:inline-block;font-family:var(--mono);font-size:7.5px;font-weight:700;
  padding:1px 6px;border-radius:3px;margin-left:8px;vertical-align:middle}
.hc-badge-high{background:rgba(239,68,68,.12);color:var(--red);border:1px solid rgba(239,68,68,.2)}
.hc-badge-med{background:rgba(245,158,11,.1);color:var(--yellow);border:1px solid rgba(245,158,11,.2)}
.hc-badge-low,.hc-badge-pos{background:rgba(16,185,129,.08);color:var(--green);border:1px solid rgba(16,185,129,.2)}

/* LIVE DATA PANEL */
.live-panel{background:linear-gradient(135deg,rgba(0,212,255,.05),rgba(124,58,237,.05));
  border:1px solid rgba(0,212,255,.18);border-radius:10px;padding:16px;
  display:flex;flex-direction:column;gap:8px}
.live-row{display:flex;justify-content:space-between;align-items:center;
  padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)}
.live-row:last-child{border-bottom:none}
.live-item-label{font-family:var(--mono);font-size:10px;color:var(--text2)}
.live-item-val{font-family:var(--mono);font-size:12px;font-weight:600;color:var(--cyan)}
.live-item-src{font-family:var(--mono);font-size:8px;color:var(--text3);margin-top:1px}

/* PROPERTY SEARCH */
.property-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}
.prop-card{background:var(--bg2);border:1px solid var(--border);border-radius:10px;overflow:hidden}
.prop-head{padding:12px 14px;background:rgba(124,58,237,.07);border-bottom:1px solid var(--border)}
.prop-name{font-family:var(--sans);font-size:13px;font-weight:700;color:var(--text)}
.prop-type{font-family:var(--mono);font-size:9px;color:var(--purple2);margin-top:2px}
.prop-body{padding:12px 14px;display:flex;flex-direction:column;gap:8px}
.prop-row{display:flex;justify-content:space-between;align-items:center}
.prop-row-label{font-family:var(--mono);font-size:9px;color:var(--text3)}
.prop-row-val{font-family:var(--mono);font-size:11px;color:var(--text)}
.prop-price{font-family:var(--sans);font-size:18px;font-weight:800;color:var(--cyan)}
.prop-amenity{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}
.amenity-tag{font-family:var(--mono);font-size:8px;padding:2px 7px;border-radius:3px;
  background:rgba(124,58,237,.1);border:1px solid rgba(124,58,237,.2);color:var(--purple2)}

/* TIMELINE */
.timeline{display:flex;flex-direction:column;gap:0;position:relative;padding-left:28px}
.timeline::before{content:"";position:absolute;left:10px;top:12px;bottom:12px;
  width:2px;background:linear-gradient(180deg,var(--purple),rgba(124,58,237,.2))}
.tl-item{position:relative;padding-bottom:20px}
.tl-dot{position:absolute;left:-22px;top:4px;width:10px;height:10px;
  border-radius:50%;border:2px solid var(--bg1);box-shadow:0 0 8px currentColor}
.tl-title{font-family:var(--sans);font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px}
.tl-desc{font-size:12px;color:var(--text2);line-height:1.6}
.tl-cost{font-family:var(--mono);font-size:11px;font-weight:600;margin-top:4px}

/* AI ANALYSIS */
.ai-panel{background:var(--bg1);border:1px solid rgba(124,58,237,.25);border-radius:12px;overflow:hidden}
.ai-head{padding:12px 18px;background:rgba(124,58,237,.06);border-bottom:1px solid rgba(124,58,237,.18);
  display:flex;align-items:center;gap:8px}
.ai-pulse{width:7px;height:7px;border-radius:50%;background:var(--purple2);animation:glow 1.5s infinite}
.ai-lbl{font-family:var(--mono);font-size:9px;color:var(--purple2);letter-spacing:.15em}
.ai-body{padding:18px;font-size:13px;color:var(--text2);line-height:1.85}
.ai-body strong{color:var(--text)}

/* BTNS */
.btn-primary{display:inline-flex;align-items:center;gap:7px;padding:11px 20px;
  border-radius:8px;border:1px solid rgba(124,58,237,.45);
  background:linear-gradient(135deg,rgba(124,58,237,.2),rgba(109,40,217,.12));
  color:var(--purple2);font-family:var(--mono);font-size:10px;font-weight:600;
  letter-spacing:.08em;cursor:pointer;transition:all .2s}
.btn-primary:hover{background:linear-gradient(135deg,rgba(124,58,237,.3),rgba(109,40,217,.2));
  box-shadow:0 0 20px rgba(124,58,237,.2)}
.btn-primary:disabled{opacity:.4;cursor:not-allowed}
.btn-secondary{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;
  border-radius:6px;border:1px solid var(--border2);background:var(--bg2);
  color:var(--text2);font-family:var(--mono);font-size:10px;cursor:pointer;transition:all .15s}
.btn-secondary:hover{border-color:var(--purple);color:var(--purple2)}

.spin{width:14px;height:14px;border:2px solid rgba(124,58,237,.2);
  border-top-color:var(--purple2);border-radius:50%;
  animation:spin .7s linear infinite;display:inline-block}
@keyframes spin{to{transform:rotate(360deg)}}
.cursor{display:inline-block;width:2px;height:12px;background:var(--purple2);
  margin-left:2px;vertical-align:middle;animation:blink .8s step-end infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

.msg-ok{background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.2);
  border-radius:6px;padding:8px 12px;font-family:var(--mono);font-size:9px;color:var(--green);line-height:1.6}
.msg-err{background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.2);
  border-radius:6px;padding:8px 12px;font-family:var(--mono);font-size:9px;color:var(--red);line-height:1.6}
.msg-info{background:rgba(0,212,255,.06);border:1px solid rgba(0,212,255,.2);
  border-radius:6px;padding:8px 12px;font-family:var(--mono);font-size:9px;color:var(--cyan);line-height:1.6}

.sec-divider{display:flex;align-items:center;gap:10px;margin:4px 0}
.sec-divider-line{flex:1;height:1px;background:var(--border)}
.sec-divider-text{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.16em;white-space:nowrap}

.tabs{display:flex;gap:4px;flex-wrap:wrap}
.tab{padding:7px 14px;border-radius:6px;border:1px solid var(--border2);background:var(--bg2);
  color:var(--text2);cursor:pointer;font-family:var(--mono);font-size:10px;
  font-weight:500;letter-spacing:.06em;transition:all .15s}
.tab.on{background:rgba(124,58,237,.12);border-color:var(--purple);color:var(--purple2)}

.total-box{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-top:4px}
.total-card{background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:12px 14px}
.total-label{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.1em;margin-bottom:4px}
.total-val{font-family:var(--sans);font-size:20px;font-weight:800}
.total-sub{font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:2px}

.disc{font-family:var(--mono);font-size:8.5px;color:var(--text3);
  text-align:center;padding:20px 0;border-top:1px solid var(--border);margin-top:8px}

/* COUNTDOWN */
.countdown-banner{background:linear-gradient(135deg,#080B22,#0C0828,#080B22);
  border-bottom:1px solid rgba(124,58,237,.3);padding:20px 28px;
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;
  position:relative;overflow:hidden}
.countdown-banner::after{content:"";position:absolute;inset:0;
  background:radial-gradient(ellipse at 50% 50%,rgba(124,58,237,.08),transparent 70%);pointer-events:none}
.cd-label{font-family:var(--mono);font-size:9px;color:var(--purple2);letter-spacing:.2em;margin-bottom:6px}
.cd-date{font-family:var(--sans);font-size:14px;font-weight:700;color:var(--text2)}
.cd-units{display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap}
.cd-unit{display:flex;flex-direction:column;align-items:center;gap:3px;
  background:rgba(124,58,237,.1);border:1px solid rgba(124,58,237,.25);
  border-radius:8px;padding:10px 14px;min-width:64px}
.cd-unit-val{font-family:var(--sans);font-size:28px;font-weight:800;
  color:var(--purple2);line-height:1;transition:all .3s}
.cd-unit-lbl{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.1em}
.cd-sep{font-family:var(--sans);font-size:24px;font-weight:800;color:rgba(124,58,237,.4);
  padding-bottom:6px;line-height:1}
.cd-right{text-align:right}
.cd-progress-wrap{margin-top:8px;width:200px}
.cd-progress-bar{height:4px;background:var(--bg3);border-radius:2px;overflow:hidden}
.cd-progress-fill{height:100%;border-radius:2px;
  background:linear-gradient(90deg,var(--purple),var(--purple2));transition:width .5s}
.cd-months{font-family:var(--mono);font-size:10px;color:var(--text2);margin-top:4px}

/* MOVER CARDS */
.mover-filters{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
.mover-filter{font-family:var(--mono);font-size:9px;padding:4px 12px;border-radius:5px;
  border:1px solid var(--border2);background:var(--bg2);color:var(--text2);
  cursor:pointer;transition:all .14s}
.mover-filter.on{background:rgba(124,58,237,.12);border-color:var(--purple);color:var(--purple2)}
.mover-grid{display:flex;flex-direction:column;gap:12px}
.mover-card{background:var(--bg2);border:1px solid var(--border);border-radius:10px;overflow:hidden;
  transition:border-color .2s}
.mover-card:hover{border-color:rgba(124,58,237,.4)}
.mover-card.selected-mover{border-color:var(--purple);box-shadow:0 0 0 1px rgba(124,58,237,.3)}
.mover-head{display:flex;align-items:flex-start;justify-content:space-between;
  padding:14px 16px;background:rgba(0,0,0,.15);border-bottom:1px solid var(--border);gap:12px;flex-wrap:wrap}
.mover-name{font-family:var(--sans);font-size:15px;font-weight:800;color:var(--text)}
.mover-type-tag{font-family:var(--mono);font-size:8px;padding:2px 8px;border-radius:3px;
  background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.2);color:var(--cyan)}
.mover-site{font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:3px}
.mover-rating{display:flex;align-items:center;gap:5px}
.mover-stars{color:var(--yellow);font-size:12px}
.mover-rat-val{font-family:var(--mono);font-size:12px;font-weight:600;color:var(--yellow)}
.mover-rat-ct{font-family:var(--mono);font-size:9px;color:var(--text3)}
.mover-body{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;padding:0}
.mover-section{padding:12px 16px;border-right:1px solid var(--border)}
.mover-section:last-child{border-right:none}
.mover-section-title{font-family:var(--mono);font-size:8px;color:var(--text3);
  letter-spacing:.12em;margin-bottom:8px}
.est-price-wrap{display:flex;flex-direction:column;gap:6px}
.est-price-row{display:flex;justify-content:space-between;align-items:center}
.est-price-label{font-family:var(--mono);font-size:9px;color:var(--text2)}
.est-price-val{font-family:var(--sans);font-size:14px;font-weight:800;color:var(--purple2)}
.mover-pro-con{display:flex;flex-direction:column;gap:4px}
.mover-pro{display:flex;gap:6px;font-size:11px;color:var(--green);align-items:flex-start}
.mover-con{display:flex;gap:6px;font-size:11px;color:var(--red);align-items:flex-start}
.mover-foot{padding:10px 16px;background:rgba(0,0,0,.1);border-top:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.mover-best{font-family:var(--mono);font-size:9px;color:var(--purple2)}
.mover-transit{font-family:var(--mono);font-size:9px;color:var(--text3)}
.mover-select-btn{font-family:var(--mono);font-size:9px;padding:5px 12px;border-radius:5px;
  border:1px solid rgba(124,58,237,.35);background:rgba(124,58,237,.1);
  color:var(--purple2);cursor:pointer;transition:all .15s}
.mover-select-btn:hover,.mover-select-btn.picked{background:rgba(124,58,237,.2);border-color:var(--purple)}
.mover-select-btn.picked{color:var(--green);border-color:var(--green);background:rgba(16,185,129,.1)}

/* MOVER ESTIMATOR */
.estimator-box{background:var(--bg3);border:1px solid rgba(124,58,237,.2);
  border-radius:10px;padding:18px;margin-top:4px}
.est-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-bottom:14px}
.est-result{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;margin-top:12px}
.est-result-card{background:var(--bg1);border:1px solid var(--border);border-radius:7px;padding:10px 12px}
.est-result-label{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.1em;margin-bottom:3px}
.est-result-val{font-family:var(--sans);font-size:18px;font-weight:800;color:var(--purple2)}
.est-result-sub{font-family:var(--mono);font-size:8px;color:var(--text3);margin-top:2px}

/* LIVE QUOTE PANEL */
.quote-panel{background:rgba(0,212,255,.04);border:1px solid rgba(0,212,255,.18);
  border-radius:8px;padding:14px 16px;margin-top:12px}
.quote-row{display:flex;justify-content:space-between;align-items:center;
  padding:5px 0;border-bottom:1px solid rgba(255,255,255,.04);
  font-family:var(--mono);font-size:10px}
.quote-row:last-child{border-bottom:none}


/* CHECKLIST */
.checklist{display:flex;flex-direction:column;gap:6px}
.chk{display:flex;align-items:flex-start;gap:9px;background:var(--bg2);
  border:1px solid var(--border);border-radius:6px;padding:9px 12px}
.chk-check{font-size:12px;flex-shrink:0;margin-top:1px}
.chk-text{font-size:12px;color:var(--text2);line-height:1.6}
.chk-text strong{color:var(--text)}

@media(max-width:768px){.layout-2col{grid-template-columns:1fr!important}}
`;

// ─── SALARY CALCULATOR ────────────────────────────────────────────────────────
function calcTakeHome(grossAnnual, state, selectedSuburb) {
  const g = grossAnnual;
  if (!g || g <= 0) return null;

  let fedTax, stateTax, fica, sdi, netMonthly;

  // Simplified federal tax (2026 MFJ or single brackets)
  if (g <= 11600) fedTax = g * 0.10;
  else if (g <= 47150) fedTax = 1160 + (g - 11600) * 0.12;
  else if (g <= 100525) fedTax = 5426 + (g - 47150) * 0.22;
  else if (g <= 191950) fedTax = 17168 + (g - 100525) * 0.24;
  else if (g <= 243725) fedTax = 39110 + (g - 191950) * 0.32;
  else fedTax = 55678 + (g - 243725) * 0.35;

  fica = Math.min(g, 168600) * 0.062 + g * 0.0145; // SS + Medicare

  if (state === "IA") {
    // Iowa flat 6% (2026)
    stateTax = g * 0.06;
    sdi = 0;
  } else {
    // California — simplified 9.3% effective for $70-100K range
    if (g <= 10099) stateTax = g * 0.01;
    else if (g <= 23942) stateTax = 100 + (g - 10099) * 0.02;
    else if (g <= 37788) stateTax = 377 + (g - 23942) * 0.04;
    else if (g <= 52455) stateTax = 931 + (g - 37788) * 0.06;
    else if (g <= 66295) stateTax = 1811 + (g - 52455) * 0.08;
    else if (g <= 338639) stateTax = 2918 + (g - 66295) * 0.093;
    else stateTax = 28283 + (g - 338639) * 0.103;
    sdi = g * 0.013; // 1.3% no cap
  }

  const net = g - fedTax - stateTax - fica - sdi;
  netMonthly = net / 12;

  return {
    gross: g,
    fedTax: Math.round(fedTax),
    stateTax: Math.round(stateTax),
    fica: Math.round(fica),
    sdi: Math.round(sdi),
    net: Math.round(net),
    netMonthly: Math.round(netMonthly),
    effectiveRate: ((fedTax + stateTax + fica + sdi) / g * 100).toFixed(1),
  };
}

// ─── COMPARISON CALCULATOR ────────────────────────────────────────────────────
function buildComparison(suburb, bedroomType, salary) {
  const caRent = bedroomType === "3br" ? suburb.rent_3br : suburb.rent_2br;
  // Jeff's actual Iowa numbers as the baseline
  const rows = [
    { cat:"Rent",        sub:"Monthly (3BR Iowa actual → CA target)", ia: IOWA_BASE.rent_3br,        ca: caRent },
    { cat:"Utilities",   sub:"Gas + Water + WiFi bundle",             ia: IOWA_BASE.utilities_bundle, ca: 380 },
    { cat:"Groceries",   sub:"Monthly groceries",                     ia: IOWA_BASE.groceries,        ca: suburb.groceries },
    { cat:"Shopping",    sub:"Monthly discretionary shopping",        ia: IOWA_BASE.shopping,         ca: Math.round(IOWA_BASE.shopping * 1.15) },
    { cat:"Gas (car)",   sub:"Monthly (~1,200 mi/mo)",                ia: 252,                        ca: +(suburb.gas * 80).toFixed(0) },
    { cat:"Electricity", sub:"Monthly avg (PG&amp;E in CA)",          ia: IOWA_BASE.electric,         ca: suburb.electric },
    { cat:"Car Insurance",sub:"Monthly estimate",                     ia: 110,                        ca: 155 },
    { cat:"Healthcare",  sub:"Monthly (insurance + copays)",          ia: 350,                        ca: 380 },
    { cat:"Renter's Ins",sub:"Monthly",                               ia: 15,                         ca: 22 },
  ];

  if (salary) {
    const iaTax = calcTakeHome(salary, "IA", null);
    const caTax = calcTakeHome(salary, "CA", suburb);
    if (iaTax && caTax) {
      rows.push({
        cat:"State Taxes + SDI",
        sub:"Monthly (state income + SDI)",
        ia: Math.round((iaTax.stateTax + iaTax.sdi) / 12),
        ca: Math.round((caTax.stateTax + caTax.sdi) / 12),
      });
    }
  }
  return rows;
}

// ─── MOVE COST TIMELINE ───────────────────────────────────────────────────────
const MOVE_TIMELINE = [
  { month:"3-6 Months Before", title:"Plan & Save", color:"#7C3AED",
    items:[
      { label:"Moving truck (DIY Waterloo→Sacramento)", cost:"$2,200–$3,500", note:"~1,850 miles, 26ft truck + fuel" },
      { label:"OR full-service movers", cost:"$6,500–$9,500", note:"3BR household, includes packing" },
      { label:"Travel costs (flights/gas to scout housing)", cost:"$400–$800", note:"1-2 trips recommended" },
    ]},
  { month:"1-2 Months Before", title:"Secure Housing", color:"#00D4FF",
    items:[
      { label:"Security deposit (up to 2 months rent)", cost:"$3,700–$6,200", note:"CA law max 2 months" },
      { label:"First month + last month rent", cost:"$3,700–$6,200", note:"Many CA landlords require this" },
      { label:"Renters insurance (first year)", cost:"$180–$280", note:"Required by most CA landlords" },
    ]},
  { month:"First 30 Days in CA", title:"Registration & Admin", color:"#10B981",
    items:[
      { label:"CA Driver's License", cost:"$36", note:"Required within 10 days of residency" },
      { label:"Vehicle registration (first year)", cost:"$400–$800", note:"0.65% VLF + base fees + county" },
      { label:"Smog check", cost:"$30–$80", note:"Required for registration" },
      { label:"Utility deposits (PG&E)", cost:"$100–$300", note:"Waived after 12 months good standing" },
    ]},
  { month:"First 3 Months", title:"Settle In", color:"#F59E0B",
    items:[
      { label:"Home essentials / furniture", cost:"$1,000–$3,000", note:"Especially if downsizing from 3BR" },
      { label:"Healthcare provider setup", cost:"$200–$500", note:"New deductible period, copays" },
      { label:"Emergency fund top-up", cost:"$2,000–$5,000", note:"3 months CA expenses vs Iowa expenses" },
    ]},
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function CAMovePlanner() {
  const [selectedSuburb, setSelectedSuburb] = useState(SACTO_SUBURBS[0]);
  const [bedrooms,       setBedrooms]       = useState("2br");
  const [salary,         setSalary]         = useState("");
  const [activeTab,      setActiveTab]      = useState("compare");
  const [liveData,       setLiveData]       = useState(null);
  const [loadingLive,    setLoadingLive]    = useState(false);
  const [liveMsg,        setLiveMsg]        = useState({ text:"", type:"" });
  const [propData,       setPropData]       = useState(null);
  const [loadingProp,    setLoadingProp]    = useState(false);
  const [aiText,         setAiText]         = useState("");
  const [streaming,      setStreaming]      = useState(false);
  const [analyzing,      setAnalyzing]      = useState(false);
  const abortRef = useRef(null);

  // ── COUNTDOWN ──────────────────────────────────────────────────────────────
  const [countdown, setCountdown] = useState(getCountdown());
  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ── MOVERS ─────────────────────────────────────────────────────────────────
  const [moverFilter,    setMoverFilter]    = useState("All");
  const [selectedMover,  setSelectedMover]  = useState(null);
  const [loadingQuote,   setLoadingQuote]   = useState(false);
  const [quoteData,      setQuoteData]      = useState(null);
  // Estimator inputs
  const [estBedrooms,    setEstBedrooms]    = useState("3");
  const [estSpecialty,   setEstSpecialty]   = useState("0");  // specialty items count
  const [estPacking,     setEstPacking]     = useState("self"); // self | partial | full
  const [estStorage,     setEstStorage]     = useState("no");

  // ── MOVER ESTIMATE CALCULATOR ─────────────────────────────────────────────
  const calcMoverEst = (mover, bdrms, packing, specialty, storage) => {
    const brN = +bdrms || 2;
    const baseKey = brN >= 3 ? ["est_3br_low","est_3br_high"] : ["est_2br_low","est_2br_high"];
    let low  = mover[baseKey[0]];
    let high = mover[baseKey[1]];
    if (brN === 1) { low = Math.round(low * 0.65); high = Math.round(high * 0.65); }
    if (brN === 4) { low = Math.round(low * 1.25); high = Math.round(high * 1.25); }
    if (packing === "partial") { low += 350; high += 700; }
    if (packing === "full")    { low += 900; high += 1800; }
    const specCount = +specialty || 0;
    low  += specCount * 150;
    high += specCount * 300;
    if (storage === "yes") { low += 400; high += 800; }
    const gasExtra = mover.type === "DIY Truck" ? 500 : 0;
    return { low: low + gasExtra, high: high + gasExtra, gasExtra };
  };

  const comparison = buildComparison(selectedSuburb, bedrooms, +salary || null);
  const totalIA = comparison.reduce((s, r) => s + r.ia, 0);
  const totalCA = comparison.reduce((s, r) => s + r.ca, 0);
  const monthlyDelta = totalCA - totalIA;
  const annualDelta  = monthlyDelta * 12;
  const iaTH  = salary ? calcTakeHome(+salary, "IA", null) : null;
  const caTH  = salary ? calcTakeHome(+salary, "CA", selectedSuburb) : null;

  // ── FETCH LIVE DATA BY ZIP ─────────────────────────────────────────────────
  const fetchLiveData = useCallback(async () => {
    setLoadingLive(true);
    setLiveMsg({ text: "", type: "" });
    const zip = selectedSuburb.zip;
    const city = selectedSuburb.name;
    try {
      const text = await aiSearch(
        `Search for current live cost of living data for ZIP code ${zip} in ${city}, California. ` +
        `Find the most recent data from 2025 or 2026 for: ` +
        `(1) average rent for 2-bedroom and 3-bedroom apartments or houses with yard, ` +
        `(2) current gas price per gallon, ` +
        `(3) monthly electricity bill average for Sacramento area (PG&E rates), ` +
        `(4) average monthly grocery cost for a household, ` +
        `(5) current California state income tax effective rate for $75,000 salary, ` +
        `(6) current VIX-equivalent stress level (just use consumer confidence index if available). ` +
        `Also find current median home sale price in ${city}. ` +
        `Return ONLY a raw JSON object, no markdown: ` +
        `{"rent_2br":2100,"rent_3br":2600,"gas_gal":4.89,"electric_mo":275,"groceries_mo":720,` +
        `"median_home":650000,"income_tax_eff_pct":7.8,"source":"zillow/redfin/etc","as_of":"Jun 2026"}`,
        1000
      );
      const json = parseJSON(text);
      if (!json || !json.rent_2br) throw new Error("Could not parse live data");
      setLiveData({ ...json, zip, city });
      setLiveMsg({ text: `✓ Live data fetched for ZIP ${zip} (${city}) — source: ${json.source || "web search"} as of ${json.as_of || "Jun 2026"}`, type: "ok" });
    } catch (e) {
      setLiveMsg({ text: `Live fetch failed: ${e.message} — showing research-backed estimates for ${city}`, type: "err" });
    } finally {
      setLoadingLive(false);
    }
  }, [selectedSuburb]);

  // ── FETCH PROPERTY LISTINGS ────────────────────────────────────────────────
  const fetchProperties = useCallback(async () => {
    setLoadingProp(true);
    const city = selectedSuburb.name;
    const zip  = selectedSuburb.zip;
    try {
      const text = await aiSearch(
        `Search for current rental listings in ${city}, CA (ZIP ${zip}) for ${bedrooms === "2br" ? "2-bedroom" : "3-bedroom"} housing. ` +
        `I specifically want: houses with yards OR apartments with pool and gym amenities. ` +
        `Find actual current listings or recent market data from Zillow, Redfin, Apartments.com, or Zumper. ` +
        `Return ONLY a raw JSON array with 3-4 examples, no markdown: ` +
        `[{"name":"Property/Complex Name","type":"house|apartment","bedrooms":2,"bathrooms":2,"rent":2200,` +
        `"sqft":1100,"amenities":["yard","garage"],"address":"123 Example St","listed_on":"Zillow","url":""}]`,
        1500
      );
      const m = text.match(/\[[\s\S]*\]/);
      if (!m) throw new Error("No listings found");
      const arr = JSON.parse(m[0]);
      if (!Array.isArray(arr) || arr.length === 0) throw new Error("Empty listings");
      setPropData(arr);
    } catch (e) {
      // Fallback: synthetic listings based on research data
      const base = bedrooms === "2br" ? selectedSuburb.rent_2br : selectedSuburb.rent_3br;
      setPropData([
        { name:`${city} House w/ Yard`, type:"house", bedrooms: bedrooms==="2br"?2:3, bathrooms:2,
          rent:base+200, sqft:bedrooms==="2br"?1050:1400, amenities:["yard","garage","washer/dryer"],
          address:`${city}, CA ${zip}`, listed_on:"Zillow (est.)", url:"" },
        { name:`${city} Apartment Community`, type:"apartment", bedrooms:bedrooms==="2br"?2:3, bathrooms:2,
          rent:base-100, sqft:bedrooms==="2br"?950:1250, amenities:["pool","gym","gated","in-unit laundry"],
          address:`${city}, CA ${zip}`, listed_on:"Apartments.com (est.)", url:"" },
        { name:`${city} Garden Townhome`, type:"townhouse", bedrooms:bedrooms==="2br"?2:3, bathrooms:2.5,
          rent:base+100, sqft:bedrooms==="2br"?1100:1500, amenities:["yard","attached garage","HOA pool"],
          address:`${city}, CA ${zip}`, listed_on:"Redfin (est.)", url:"" },
      ]);
    } finally {
      setLoadingProp(false);
    }
  }, [selectedSuburb, bedrooms]);

  // ── FETCH LIVE MOVER QUOTE ─────────────────────────────────────────────────
  const fetchMoverQuote = useCallback(async (mover) => {
    setLoadingQuote(true);
    setQuoteData(null);
    try {
      const est = calcMoverEst(mover, estBedrooms, estPacking, estSpecialty, estStorage);
      // Use AI to search for recent pricing data and user reviews on this mover
      const text = await aiSearch(
        `Search for current 2025-2026 pricing and customer reviews for "${mover.name}" for a long-distance move ` +
        `from Iowa to California (approximately 1,850 miles). ` +
        `Find: typical price range for a ${estBedrooms}-bedroom household, ` +
        `any recent complaints or BBB rating, ` +
        `any promotions or discounts currently available, ` +
        `and the best way to get a quote from them. ` +
        `Return ONLY a raw JSON object: ` +
        `{"low":3500,"high":5500,"bbb_rating":"A+","recent_notes":"Any notable recent info","discount":"Any current promo","quote_url":"${mover.website}","tip":"One actionable tip"}`,
        900
      );
      const json = parseJSON(text);
      setQuoteData({
        mover: mover.name,
        our_est: est,
        web_low:  json?.low  || est.low,
        web_high: json?.high || est.high,
        bbb:      json?.bbb_rating || "N/A",
        notes:    json?.recent_notes || "See website for latest pricing",
        discount: json?.discount || "Check website — seasonal discounts often available Sep–Nov",
        tip:      json?.tip || "Get at least 3 quotes and ask for a binding estimate",
        quote_url: json?.quote_url || mover.website,
      });
    } catch (e) {
      const est = calcMoverEst(mover, estBedrooms, estPacking, estSpecialty, estStorage);
      setQuoteData({ mover: mover.name, our_est: est, notes: `Live lookup failed — using calculator estimate. Visit ${mover.website} for official quote.` });
    } finally {
      setLoadingQuote(false);
    }
  }, [estBedrooms, estPacking, estSpecialty, estStorage]);

  // ── AI ANALYSIS ────────────────────────────────────────────────────────────
  const runAnalysis = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setAnalyzing(true); setAiText(""); setStreaming(true);

    const sys = `You are a relocation financial advisor specializing in Iowa-to-California moves. 
You give specific, honest, numbers-based advice. You know Jeff Ongeri is a PA-C at UnityPoint Health 
in Waterloo, IA planning a move to the Sacramento region by late October 2027.
Be direct, use dollar amounts, flag the non-obvious risks. Max 300 words.`;

    const prompt = `Analyze this Iowa→California relocation for Jeff:

PROFILE: PA-C (Physician Assistant) · Waterloo, IA → ${selectedSuburb.name}, CA
HOUSING: Moving from 3BR house (Iowa) to ${bedrooms === "2br" ? "2BR" : "3BR"} (CA)
SALARY: ${salary ? `$${(+salary).toLocaleString()}/yr gross` : "not specified"}
TARGET AREA: ${selectedSuburb.name}, CA ZIP ${selectedSuburb.zip}

MONTHLY COST DELTA: +$${monthlyDelta.toLocaleString()}/mo more in CA (${selectedSuburb.name})
ANNUAL DELTA: +$${annualDelta.toLocaleString()}/yr
${iaTH && caTH ? `TAKE-HOME IMPACT: IA net $${iaTH.netMonthly.toLocaleString()}/mo vs CA net $${caTH.netMonthly.toLocaleString()}/mo (CA SDI: $${Math.round(+salary*0.013/12).toLocaleString()}/mo, CA state tax: $${Math.round(caTH.stateTax/12).toLocaleString()}/mo)` : ""}

LIVE DATA: ${liveData ? `Rent 2BR $${liveData.rent_2br}, Gas $${liveData.gas_gal}/gal` : "Research estimates used"}

Provide:
1. **Financial readiness** — given the delta, what salary range is needed to maintain Iowa standard of living in ${selectedSuburb.name}
2. **Best suburb pick** for Jeff's situation (house w/ yard or apt w/ pool/gym, good for couple)
3. **Top 3 non-obvious hidden costs** most Iowa transplants miss
4. **Best timing** — why October 2027 is realistic or not
5. **PA-C salary context** — Sacramento health systems hiring PAs and approximate range`;

    try {
      await aiStream(sys, prompt, (chunk) => setAiText(p => p + chunk), abortRef.current.signal);
    } catch (e) {
      if (e.name !== "AbortError") setAiText("Analysis failed. Check your API key connection.");
    } finally {
      setAnalyzing(false); setStreaming(false);
    }
  }, [selectedSuburb, bedrooms, salary, monthlyDelta, annualDelta, iaTH, caTH, liveData]);

  const rentVal = liveData
    ? (bedrooms === "2br" ? liveData.rent_2br : liveData.rent_3br)
    : (bedrooms === "2br" ? selectedSuburb.rent_2br : selectedSuburb.rent_3br);

  return (
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <div className="nav">
        <div className="nav-brand">
          <div className="nav-dot"/>
          <div>
            <div className="nav-sub">JEFFONGERI.COM</div>
            <div className="nav-title">CA Move <span>Planner</span></div>
          </div>
        </div>
        <div className="nav-badges">
          <span className="nbadge nbadge-p">IOWA → SACRAMENTO</span>
          <span className="nbadge nbadge-c">LIVE ZIP DATA</span>
          <span className="nbadge nbadge-g">2026 RATES</span>
        </div>
      </div>

      {/* COUNTDOWN BANNER */}
      {(() => {
        const cd = countdown;
        // Total duration from Jun 12 2026 to Sep 1 2027 = ~446 days
        const totalDays = 446;
        const elapsed   = totalDays - cd.days;
        const pct       = Math.min(100, Math.max(0, (elapsed / totalDays) * 100));
        return (
          <div className="countdown-banner">
            <div>
              <div className="cd-label">⏳ MOVE TARGET COUNTDOWN</div>
              <div className="cd-date">September 1, 2027 · Waterloo IA → Sacramento CA</div>
            </div>
            <div className="cd-units">
              {[
                [String(cd.days).padStart(3,"0"), "DAYS"],
                [String(cd.hours).padStart(2,"0"), "HRS"],
                [String(cd.minutes).padStart(2,"0"), "MIN"],
                [String(cd.seconds).padStart(2,"0"), "SEC"],
              ].map(([v,l], i, arr) => (
                <div key={l} style={{display:"flex",alignItems:"flex-end",gap:4}}>
                  <div className="cd-unit">
                    <div className="cd-unit-val">{v}</div>
                    <div className="cd-unit-lbl">{l}</div>
                  </div>
                  {i < arr.length - 1 && <div className="cd-sep">:</div>}
                </div>
              ))}
            </div>
            <div className="cd-right">
              <div className="cd-months" style={{marginBottom:6}}>
                ~{cd.months} months {cd.weeks}w {cd.remainDays}d remaining
              </div>
              <div className="cd-progress-wrap">
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",marginBottom:4}}>
                  <span>Jun 2026</span>
                  <span>{pct.toFixed(0)}% to move date</span>
                  <span>Sep 2027</span>
                </div>
                <div className="cd-progress-bar">
                  <div className="cd-progress-fill" style={{width:`${pct}%`}}/>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* HERO */}
      <div className="hero">
        <div className="hero-label">Relocation Intelligence · Jeff Ongeri</div>
        <h1 className="hero-h1">Waterloo, Iowa →<br/><span>Sacramento, California</span></h1>
        <p className="hero-sub">
          Personalized to your actual Iowa expenses: <strong style={{color:"var(--purple2)"}}>$2,890/mo known spend</strong> (rent $2,000 · utilities $300 · groceries $500 · shopping $90).
          Every ZIP code search pulls live CA rent, gas, and utility rates so the comparison reflects
          what you'd actually pay — not generic national averages.
        </p>
        <div className="hero-route">
          <span>🏥 UnityPoint Health, Waterloo IA</span>
          <span className="hero-arrow">→</span>
          <span>🌴 Sacramento Region, CA</span>
          <span>· Oct 2027 Target</span>
        </div>
      </div>

      <div className="main">

        {/* SETUP */}
        <div className="card">
          <div className="card-head">
            <div className="card-title"><span className="card-title-icon">⚙</span> Your Move Configuration</div>
            <div className="card-sub">Customize to your situation</div>
          </div>
          <div className="card-body">
            <div className="input-grid">
              <div className="field">
                <label>BEDROOM TYPE (CA TARGET)</label>
                <select value={bedrooms} onChange={e=>setBedrooms(e.target.value)}>
                  <option value="2br">2 Bedroom / 2 Bath</option>
                  <option value="3br">3 Bedroom / 2 Bath</option>
                </select>
                <div className="field-note">Currently: 3BR in Waterloo → CA preference</div>
              </div>
              <div className="field">
                <label>ANNUAL SALARY ($)</label>
                <input type="number" value={salary} onChange={e=>setSalary(e.target.value)}
                  placeholder="e.g. 115000"/>
                <div className="field-note">Used for take-home &amp; tax comparison</div>
              </div>
              <div className="field">
                <label>HOUSING PREFERENCE</label>
                <select defaultValue="house_or_apt">
                  <option value="house_or_apt">House w/ yard OR Apt w/ pool+gym</option>
                  <option value="house">House with yard only</option>
                  <option value="apt">Apartment with amenities</option>
                </select>
              </div>
              <div className="field">
                <label>MOVE DATE TARGET</label>
                <select defaultValue="oct2027">
                  <option value="oct2027">October 2027</option>
                  <option value="early2027">Early 2027</option>
                  <option value="late2027">Late 2027</option>
                  <option value="2028">2028</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SUBURB SELECTOR */}
        <div className="card">
          <div className="card-head">
            <div className="card-title"><span className="card-title-icon">📍</span> Select Sacramento Region City</div>
            <div className="card-sub">Click a suburb to compare — fetch live ZIP data below</div>
          </div>
          <div className="card-body">
            <div className="suburb-grid">
              {SACTO_SUBURBS.map(s => (
                <div key={s.zip} className={`suburb-card${selectedSuburb.zip===s.zip?" selected":""}`}
                  onClick={()=>{setSelectedSuburb(s);setLiveData(null);setPropData(null);}}>
                  <div className="suburb-name">{s.name}</div>
                  <div className="suburb-zip">ZIP {s.zip}</div>
                  <div className="suburb-stats">
                    <div className="ss-item">
                      <div className="ss-label">{bedrooms==="2br"?"2BR RENT":"3BR RENT"}</div>
                      <div className="ss-val">${bedrooms==="2br"?s.rent_2br.toLocaleString():s.rent_3br.toLocaleString()}/mo</div>
                    </div>
                    <div className="ss-item">
                      <div className="ss-label">GAS/GAL</div>
                      <div className="ss-val">${s.gas.toFixed(2)}</div>
                    </div>
                    <div className="ss-item">
                      <div className="ss-label">ELECTRIC/MO</div>
                      <div className="ss-val">${s.electric}</div>
                    </div>
                    <div className="ss-item">
                      <div className="ss-label">COMMUTE</div>
                      <div className="ss-val">{s.commute_min} min</div>
                    </div>
                  </div>
                  <div className="suburb-tag">{s.commute_min <= 20 ? "Close-in" : s.commute_min <= 30 ? "Moderate" : "Suburban"}</div>
                </div>
              ))}
            </div>

            <div style={{marginTop:16,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
              <button className="btn-primary" onClick={fetchLiveData} disabled={loadingLive}>
                {loadingLive?<><span className="spin"/>FETCHING LIVE DATA…</>:<>🔍 FETCH LIVE DATA FOR ZIP {selectedSuburb.zip}</>}
              </button>
              <button className="btn-secondary" onClick={fetchProperties} disabled={loadingProp}>
                {loadingProp?<><span className="spin"/>SEARCHING…</>:<>🏠 FIND {bedrooms==="2br"?"2BR":"3BR"} LISTINGS</>}
              </button>
            </div>
            {liveMsg.text && (
              <div style={{marginTop:10}} className={liveMsg.type==="ok"?"msg-ok":"msg-err"}>
                {liveMsg.text}
              </div>
            )}
            {liveData && (
              <div className="live-panel" style={{marginTop:12}}>
                <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--cyan)",letterSpacing:".16em",marginBottom:4}}>
                  LIVE DATA — ZIP {liveData.zip} · {liveData.city} · {liveData.as_of||"Jun 2026"}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>
                  {[
                    ["2BR Rent/mo","$"+liveData.rent_2br?.toLocaleString()],
                    ["3BR Rent/mo","$"+liveData.rent_3br?.toLocaleString()],
                    ["Gas/gallon","$"+liveData.gas_gal?.toFixed(2)],
                    ["Electric/mo","$"+liveData.electric_mo],
                    ["Groceries/mo","$"+liveData.groceries_mo],
                    ["Median Home","$"+(liveData.median_home/1000).toFixed(0)+"K"],
                  ].map(([l,v])=>(
                    <div key={l} className="live-row" style={{flexDirection:"column",alignItems:"flex-start",padding:"5px 8px",borderRadius:6,background:"rgba(0,212,255,.05)"}}>
                      <div className="live-item-src">{l}</div>
                      <div className="live-item-val">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="live-badge"><div className="live-dot"/>{liveData.source||"Web Search"}</div>
              </div>
            )}
          </div>
        </div>

        {/* MAIN TABS */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[["compare","📊 Cost Comparison"],["hidden","⚠ Hidden Costs"],["tax","💸 Tax & Salary"],
            ["move","📦 Move Timeline"],["movers","🚛 Movers & Quotes"],["housing","🏠 Housing Search"],["analysis","🤖 AI Analysis"]].map(([id,lbl])=>(
            <div key={id} className={`tab${activeTab===id?" on":""}`} onClick={()=>setActiveTab(id)}>{lbl}</div>
          ))}
        </div>

        {/* TAB: COMPARE */}
        {activeTab === "compare" && (
          <>
            {/* DELTA METER */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              <div className="delta-meter" style={{gridColumn:"1/2"}}>
                <div className="delta-label">MONTHLY COST DIFFERENCE</div>
                <div className={`delta-val${monthlyDelta<0?" positive":""}`}>
                  {monthlyDelta>=0?"+":""}{monthlyDelta>=0?"$":"-$"}{Math.abs(monthlyDelta).toLocaleString()}
                </div>
                <div className="delta-sub">
                  per month {monthlyDelta>0?"MORE":"LESS"} in {selectedSuburb.name}<br/>
                  vs Waterloo / Cedar Falls
                </div>
                <div className="delta-bar-wrap">
                  <div className="delta-bar-fill" style={{width:`${Math.min((totalCA/totalIA)*50,100)}%`}}/>
                </div>
              </div>
              <div className="delta-meter">
                <div className="delta-label">ANNUAL COST DIFFERENCE</div>
                <div className={`delta-val${annualDelta<0?" positive":""}`}>
                  {annualDelta>=0?"+":""}{annualDelta>=0?"$":"-$"}{Math.abs(annualDelta).toLocaleString()}
                </div>
                <div className="delta-sub">per year more in CA<br/>vs Iowa baseline</div>
              </div>
              <div className="delta-meter">
                <div className="delta-label">CA COST INDEX vs Iowa</div>
                <div className="delta-val">
                  {((totalCA/totalIA)*100).toFixed(0)}%
                </div>
                <div className="delta-sub">of Iowa monthly costs<br/>(100% = equal)</div>
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <div className="card-title"><span className="card-title-icon">📊</span> Monthly Cost Breakdown</div>
                <div style={{display:"flex",gap:10,font:"var(--mono)"}}>
                  <span style={{fontFamily:"var(--mono)",fontSize:"10px",color:"var(--green)"}}>● Iowa (Waterloo)</span>
                  <span style={{fontFamily:"var(--mono)",fontSize:"10px",color:"var(--cyan)"}}>● {selectedSuburb.name}{liveData?" (LIVE)":""}</span>
                </div>
              </div>
              <div style={{overflowX:"auto"}}>
                <table className="cmp-table">
                  <thead>
                    <tr>
                      <th style={{textAlign:"left"}}>CATEGORY</th>
                      <th className="r">IOWA / MO</th>
                      <th className="r">{selectedSuburb.name.toUpperCase()} / MO</th>
                      <th className="r">DIFFERENCE</th>
                      <th className="r">% MORE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((row, i) => {
                      const diff = row.ca - row.ia;
                      const pct = ((diff/row.ia)*100).toFixed(0);
                      return (
                        <tr key={i}>
                          <td>
                            <div className="cmp-cat">{row.cat}</div>
                            <div className="cmp-cat-sub">{row.sub}</div>
                          </td>
                          <td style={{textAlign:"right"}}><span className="cmp-iowa">${row.ia.toLocaleString()}</span></td>
                          <td style={{textAlign:"right"}}><span className="cmp-ca">${row.ca.toLocaleString()}</span></td>
                          <td style={{textAlign:"right"}}>
                            <span className={`delta-pill ${diff>0?"delta-bad":diff<0?"delta-good":"delta-neutral"}`}>
                              {diff>0?"+":""}{diff<0?"-$":"$"}{Math.abs(diff).toLocaleString()}
                            </span>
                          </td>
                          <td style={{textAlign:"right",fontFamily:"var(--mono)",fontSize:"10px",
                            color:+pct>20?"var(--red)":+pct>0?"var(--yellow)":"var(--green)"}}>
                            {diff>0?"+":""}{pct}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="total-box" style={{padding:16}}>
                {[
                  ["Your Iowa Spend/mo", "$2,890", "var(--text2)", "Known expenses (rent+util+groc+shop)"],
                  ["Iowa Model Total/mo", "$"+totalIA.toLocaleString(), "var(--green)", "Full budget model incl. insurance etc."],
                  [selectedSuburb.name+" Total/mo", "$"+totalCA.toLocaleString(), "var(--cyan)", "Same categories in CA"],
                  ["Monthly Difference", (monthlyDelta>=0?"+$":"-$")+Math.abs(monthlyDelta).toLocaleString(), monthlyDelta>0?"var(--red)":"var(--green)", "vs Iowa model total"],
                  ["Annual Difference", (annualDelta>=0?"+$":"-$")+Math.abs(annualDelta).toLocaleString(), annualDelta>0?"var(--red)":"var(--green)", "per year more in CA"],
                ].map(([l,v,c,s])=>(
                  <div key={l} className="total-card">
                    <div className="total-label">{l}</div>
                    <div className="total-val" style={{color:c}}>{v}</div>
                    <div className="total-sub">{s}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TAB: HIDDEN COSTS */}
        {activeTab === "hidden" && (
          <div className="card">
            <div className="card-head">
              <div className="card-title"><span className="card-title-icon">⚠</span> Hidden Costs Most Iowa Transplants Miss</div>
              <div className="card-sub">14 costs that don't appear in standard comparisons</div>
            </div>
            <div className="card-body">
              <div className="hc-list">
                {CA_HIDDEN.map((item, i) => (
                  <div key={i} className="hc-item">
                    <div className="hc-dot" style={{background:item.color}}/>
                    <div className="hc-body">
                      <div className="hc-name">
                        {item.item}
                        <span className={`hc-badge hc-badge-${item.impact.toLowerCase()}`}>
                          {item.impact === "POS" ? "BENEFIT" : item.impact}
                        </span>
                        <span style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",marginLeft:8}}>
                          [{item.type}]
                        </span>
                      </div>
                      <div className="hc-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              {salary && (
                <div style={{marginTop:16,background:"rgba(239,68,68,.06)",border:"1px solid rgba(239,68,68,.18)",
                  borderRadius:8,padding:"14px 16px"}}>
                  <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--red)",letterSpacing:".12em",marginBottom:8}}>
                    YEAR 1 HIDDEN COST ESTIMATE — ${(+salary).toLocaleString()} SALARY
                  </div>
                  {[
                    ["Moving truck (midrange)", "$3,500–$5,500"],
                    ["Security deposit + first+last", "$"+Math.round((bedrooms==="2br"?selectedSuburb.rent_2br:selectedSuburb.rent_3br)*3).toLocaleString()],
                    ["Vehicle registration (yr 1)", "$500–$700"],
                    ["CA SDI year 1", "$"+Math.round(+salary*0.013).toLocaleString()],
                    ["Additional state income tax vs Iowa", "$"+(Math.round((caTH?.stateTax||0)-(iaTH?.stateTax||0))).toLocaleString()+"/yr"],
                    ["Insurance premium increases", "$600–$1,200"],
                    ["Utility deposits & setup", "$200–$500"],
                  ].map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",
                      fontFamily:"var(--mono)",fontSize:"10px",padding:"5px 0",
                      borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                      <span style={{color:"var(--text2)"}}>{l}</span>
                      <span style={{color:"var(--red)",fontWeight:600}}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: TAX & SALARY */}
        {activeTab === "tax" && (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div className="card">
              <div className="card-head">
                <div className="card-title"><span className="card-title-icon">💸</span> Tax &amp; Take-Home Comparison</div>
                <div className="card-sub">Iowa vs California on your actual salary</div>
              </div>
              <div className="card-body">
                {!salary ? (
                  <div className="msg-info">Enter your annual salary in the configuration panel above to see detailed tax comparison.</div>
                ) : (
                  <>
                    <div className="take-home-box">
                      {[[iaTH,"Iowa","var(--green)"],[caTH,"California","var(--cyan)"]].map(([th,label,col])=>(
                        th && (
                          <div key={label} className="th-card">
                            <div className="th-label">{label.toUpperCase()} — ${(+salary).toLocaleString()} GROSS</div>
                            <div className="th-val" style={{color:col}}>${th.netMonthly.toLocaleString()}/mo</div>
                            <div style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",marginTop:4}}>net take-home</div>
                            <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:4}}>
                              {[
                                ["Federal Tax","$"+th.fedTax.toLocaleString()],
                                ["State Income Tax",label==="Iowa"?"$"+th.stateTax.toLocaleString()+" (6% flat)":"$"+th.stateTax.toLocaleString()+" (graduated)"],
                                ["FICA","$"+th.fica.toLocaleString()],
                                ["SDI",label==="Iowa"?"$0":"$"+th.sdi.toLocaleString()+" (1.3%)"],
                                ["Effective Rate",th.effectiveRate+"%"],
                              ].map(([l,v])=>(
                                <div key={l} style={{display:"flex",justifyContent:"space-between",
                                  fontFamily:"var(--mono)",fontSize:"9px",padding:"3px 0",
                                  borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                                  <span style={{color:"var(--text3)"}}>{l}</span>
                                  <span style={{color:l==="SDI"&&label==="California"?"var(--red)":label==="Iowa"?"var(--green)":"var(--cyan)"}}>{v}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                    {iaTH && caTH && (
                      <div style={{marginTop:12,background:"rgba(239,68,68,.06)",border:"1px solid rgba(239,68,68,.2)",
                        borderRadius:8,padding:"12px 14px"}}>
                        <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--red)",letterSpacing:".1em",marginBottom:6}}>
                          ANNUAL PAYCHECK IMPACT OF MOVING TO CA
                        </div>
                        {[
                          ["Additional CA income tax vs Iowa", "$"+(caTH.stateTax-iaTH.stateTax).toLocaleString()+"/yr"],
                          ["CA SDI (no Iowa equivalent)", "$"+caTH.sdi.toLocaleString()+"/yr"],
                          ["Total additional CA tax burden", "$"+(caTH.stateTax-iaTH.stateTax+caTH.sdi).toLocaleString()+"/yr"],
                          ["Monthly take-home difference", "$"+(caTH.netMonthly-iaTH.netMonthly).toLocaleString()+"/mo (CA vs Iowa)"],
                          ["Salary needed in CA to match Iowa lifestyle","≈ $"+(Math.round(+salary*(totalCA/totalIA)*((caTH.stateTax+caTH.sdi)/(iaTH.stateTax+iaTH.sdi+0.001)+1)/2)).toLocaleString()+"–"+Math.round(+salary*(totalCA/totalIA)).toLocaleString()],
                        ].map(([l,v])=>(
                          <div key={l} style={{display:"flex",justifyContent:"space-between",
                            fontFamily:"var(--mono)",fontSize:"10px",padding:"5px 0",
                            borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                            <span style={{color:"var(--text2)"}}>{l}</span>
                            <span style={{color:"var(--red)",fontWeight:600}}>{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
                <div style={{marginTop:16,background:"rgba(0,212,255,.06)",border:"1px solid rgba(0,212,255,.18)",
                  borderRadius:8,padding:"12px 14px"}}>
                  <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--cyan)",letterSpacing:".1em",marginBottom:8}}>
                    CA TAX SNAPSHOT 2026 — KEY NUMBERS FOR PA-C SALARY RANGE
                  </div>
                  {[
                    ["CA Income Tax Brackets","1%–13.3% (9.3% kicks in at $66,295)"],
                    ["Iowa Income Tax (2026)","6.0% flat rate"],
                    ["CA SDI Rate","1.3% of ALL wages, no cap"],
                    ["Sacramento County Sales Tax","8.75% combined"],
                    ["CA Property Tax (if buying)","~0.71% effective (Prop 13 protected)"],
                    ["CA Mental Health Tax","1% surcharge on income > $1M only"],
                    ["CA Paid Family Leave (benefit)","Up to $1,765/week for 8 weeks"],
                  ].map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4,
                      fontFamily:"var(--mono)",fontSize:"9.5px",padding:"5px 0",
                      borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                      <span style={{color:"var(--text2)"}}>{l}</span>
                      <span style={{color:"var(--cyan)",fontWeight:600}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MOVE TIMELINE */}
        {activeTab === "move" && (
          <div className="card">
            <div className="card-head">
              <div className="card-title"><span className="card-title-icon">📦</span> Move Cost Timeline — Waterloo → {selectedSuburb.name}</div>
              <div className="card-sub">One-time costs to budget before + during the move</div>
            </div>
            <div className="card-body">
              <div className="timeline">
                {MOVE_TIMELINE.map((phase, pi) => (
                  <div key={pi} className="tl-item">
                    <div className="tl-dot" style={{color:phase.color,background:phase.color}}/>
                    <div style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",
                      letterSpacing:".1em",marginBottom:4}}>{phase.month.toUpperCase()}</div>
                    <div className="tl-title" style={{color:phase.color}}>{phase.title}</div>
                    <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8}}>
                      {phase.items.map((item, ii) => (
                        <div key={ii} style={{display:"flex",justifyContent:"space-between",
                          alignItems:"flex-start",gap:12,background:"var(--bg2)",
                          borderRadius:7,padding:"9px 12px",border:"1px solid var(--border)"}}>
                          <div>
                            <div style={{fontFamily:"var(--sans)",fontSize:"12px",fontWeight:600,color:"var(--text)"}}>{item.label}</div>
                            <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--text3)",marginTop:2}}>{item.note}</div>
                          </div>
                          <div className="tl-cost" style={{color:phase.color,flexShrink:0}}>{item.cost}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:16,background:"rgba(124,58,237,.07)",border:"1px solid rgba(124,58,237,.2)",
                borderRadius:8,padding:"14px 16px"}}>
                <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--purple2)",letterSpacing:".12em",marginBottom:8}}>
                  TOTAL MOVE COST ESTIMATE — IOWA → {selectedSuburb.name.toUpperCase()}
                </div>
                {[
                  ["Moving (midrange)", "$4,500–$6,500"],
                  ["Move-in costs (deposit + first+last)", "$"+(Math.round((bedrooms==="2br"?selectedSuburb.rent_2br:selectedSuburb.rent_3br)*3)).toLocaleString()],
                  ["Registration + admin + deposits", "$800–$1,300"],
                  ["Travel + scouting trips", "$600–$1,200"],
                  ["Emergency buffer (3 months CA expenses)", "$"+Math.round(totalCA*3).toLocaleString()],
                  ["TOTAL ESTIMATED MOVE BUDGET", "$"+(Math.round((bedrooms==="2br"?selectedSuburb.rent_2br:selectedSuburb.rent_3br)*3)+7000).toLocaleString()+"–$"+(Math.round((bedrooms==="2br"?selectedSuburb.rent_2br:selectedSuburb.rent_3br)*3)+12000).toLocaleString()],
                ].map(([l,v],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",
                    fontFamily:"var(--mono)",fontSize:i===5?"12px":"10px",
                    fontWeight:i===5?"700":"400",padding:"6px 0",
                    borderBottom:i<5?"1px solid rgba(255,255,255,.04)":"none",
                    borderTop:i===5?"1px solid rgba(124,58,237,.3)":"none",marginTop:i===5?"4px":"0"}}>
                    <span style={{color:i===5?"var(--text)":"var(--text2)"}}>{l}</span>
                    <span style={{color:i===5?"var(--purple2)":"var(--cyan)",fontWeight:i===5?"800":"600"}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: MOVERS */}
        {activeTab === "movers" && (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>

            {/* ESTIMATOR */}
            <div className="card">
              <div className="card-head">
                <div className="card-title"><span className="card-title-icon">🧮</span> Move Cost Estimator</div>
                <div className="card-sub">Waterloo, IA → Sacramento Region · ~1,850 miles</div>
              </div>
              <div className="card-body">
                <div className="estimator-box">
                  <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--purple2)",letterSpacing:".14em",marginBottom:10}}>
                    YOUR MOVE DETAILS
                  </div>
                  <div className="est-grid">
                    <div className="field">
                      <label>BEDROOMS (IOWA HOME)</label>
                      <select value={estBedrooms} onChange={e=>setEstBedrooms(e.target.value)}>
                        <option value="1">1 Bedroom</option>
                        <option value="2">2 Bedrooms</option>
                        <option value="3">3 Bedrooms</option>
                        <option value="4">4 Bedrooms</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>PACKING SERVICE</label>
                      <select value={estPacking} onChange={e=>setEstPacking(e.target.value)}>
                        <option value="self">Self pack (cheapest)</option>
                        <option value="partial">Partial packing (+$350–$700)</option>
                        <option value="full">Full packing service (+$900–$1,800)</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>SPECIALTY ITEMS</label>
                      <select value={estSpecialty} onChange={e=>setEstSpecialty(e.target.value)}>
                        <option value="0">None</option>
                        <option value="1">1 item (piano, safe, etc.) +$150–300</option>
                        <option value="2">2 specialty items +$300–600</option>
                        <option value="3">3+ specialty items +$450–900</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>STORAGE NEEDED?</label>
                      <select value={estStorage} onChange={e=>setEstStorage(e.target.value)}>
                        <option value="no">No storage needed</option>
                        <option value="yes">1 month storage (+$400–800)</option>
                      </select>
                    </div>
                  </div>
                  <div className="est-result">
                    {MOVERS.map(m => {
                      const est = calcMoverEst(m, estBedrooms, estPacking, estSpecialty, estStorage);
                      return (
                        <div key={m.name} className="est-result-card"
                          style={{borderColor: selectedMover?.name===m.name?"var(--purple)":undefined}}>
                          <div className="est-result-label">{m.name}</div>
                          <div className="est-result-val">${est.low.toLocaleString()}–${est.high.toLocaleString()}</div>
                          <div className="est-result-sub">{m.type}{m.type==="DIY Truck"?` (+$${est.gasExtra} gas est.)`:""}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--text3)",marginTop:10,lineHeight:1.7}}>
                    ⚡ Estimates include distance surcharges for Iowa→California (~1,850 miles).
                    Full-service movers price by weight — actual cost depends on how much you take.
                    Downsizing from 3BR to 2BR can save $800–$1,500 in moving costs.
                  </div>
                </div>
              </div>
            </div>

            {/* MOVER LIST */}
            <div className="card">
              <div className="card-head">
                <div className="card-title"><span className="card-title-icon">🚛</span> Moving Company Comparison</div>
                <div className="card-sub">Click a company to get a live AI-researched quote estimate</div>
              </div>
              <div className="card-body">
                <div className="mover-filters">
                  {MOVER_TYPES.map(t => (
                    <div key={t} className={`mover-filter${moverFilter===t?" on":""}`}
                      onClick={()=>setMoverFilter(t)}>{t}</div>
                  ))}
                </div>

                <div className="mover-grid">
                  {MOVERS.filter(m => moverFilter==="All" || m.type===moverFilter).map(m => {
                    const est = calcMoverEst(m, estBedrooms, estPacking, estSpecialty, estStorage);
                    const isPicked = selectedMover?.name === m.name;
                    return (
                      <div key={m.name} className={`mover-card${isPicked?" selected-mover":""}`}>
                        <div className="mover-head">
                          <div>
                            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                              <div className="mover-name">{m.name}</div>
                              <div className="mover-type-tag">{m.type}</div>
                            </div>
                            <div className="mover-site">{m.website}</div>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div className="mover-rating">
                              <div className="mover-stars">{"★".repeat(Math.round(m.rating))}</div>
                              <div className="mover-rat-val">{m.rating}</div>
                              <div className="mover-rat-ct">({m.reviews})</div>
                            </div>
                            <div style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",marginTop:3}}>
                              Transit: {m.transit_days}
                            </div>
                          </div>
                        </div>

                        <div className="mover-body">
                          {/* ESTIMATE COLUMN */}
                          <div className="mover-section">
                            <div className="mover-section-title">YOUR ESTIMATE ({estBedrooms}BR)</div>
                            <div className="est-price-wrap">
                              <div className="est-price-row">
                                <div className="est-price-label">Range</div>
                                <div className="est-price-val">${est.low.toLocaleString()}–${est.high.toLocaleString()}</div>
                              </div>
                              <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--text3)",marginTop:4,lineHeight:1.6}}>
                                {m.type==="DIY Truck"?`Incl. est. gas ($${est.gasExtra})`:m.deposit}
                              </div>
                              <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--text3)",lineHeight:1.6}}>
                                {m.insurance}
                              </div>
                            </div>
                          </div>

                          {/* PROS COLUMN */}
                          <div className="mover-section">
                            <div className="mover-section-title">PROS / CONS</div>
                            <div className="mover-pro-con">
                              {m.pros.map((p,i) => <div key={i} className="mover-pro"><span>✓</span><span>{p}</span></div>)}
                              {m.cons.slice(0,2).map((c,i) => <div key={i} className="mover-con"><span>✗</span><span>{c}</span></div>)}
                            </div>
                          </div>

                          {/* BEST FOR COLUMN */}
                          <div className="mover-section">
                            <div className="mover-section-title">BEST FOR</div>
                            <div style={{fontFamily:"var(--body)",fontSize:"12px",color:"var(--text2)",lineHeight:1.6,marginBottom:10}}>
                              {m.best_for}
                            </div>
                            <div style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",lineHeight:1.7}}>
                              {m.cons.slice(2).map((c,i)=><div key={i} className="mover-con"><span>✗</span><span>{c}</span></div>)}
                            </div>
                          </div>
                        </div>

                        <div className="mover-foot">
                          <div>
                            <div className="mover-best">⭐ Best for: {m.best_for}</div>
                            <div className="mover-transit">🕐 Transit: {m.transit_days}</div>
                          </div>
                          <button
                            className={`mover-select-btn${isPicked?" picked":""}`}
                            onClick={() => {
                              setSelectedMover(isPicked ? null : m);
                              setQuoteData(null);
                              if (!isPicked) fetchMoverQuote(m);
                            }}>
                            {isPicked ? (loadingQuote ? "⟳ Fetching…" : "✓ Selected") : "Get Live Quote Est. →"}
                          </button>
                        </div>

                        {/* LIVE QUOTE PANEL — shows when this mover is selected */}
                        {isPicked && (
                          <div style={{padding:"0 16px 16px"}}>
                            {loadingQuote ? (
                              <div className="quote-panel" style={{textAlign:"center",padding:"20px"}}>
                                <span className="spin" style={{marginRight:8}}/><span style={{fontFamily:"var(--mono)",fontSize:"10px",color:"var(--cyan)"}}>Searching live data for {m.name}…</span>
                              </div>
                            ) : quoteData ? (
                              <div className="quote-panel">
                                <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--cyan)",letterSpacing:".14em",marginBottom:10}}>
                                  LIVE RESEARCH — {quoteData.mover.toUpperCase()}
                                </div>
                                {[
                                  ["Calculator Estimate", `$${quoteData.our_est?.low?.toLocaleString()}–$${quoteData.our_est?.high?.toLocaleString()}`,"var(--purple2)"],
                                  ["Web-Sourced Range",   quoteData.web_low ? `$${quoteData.web_low?.toLocaleString()}–$${quoteData.web_high?.toLocaleString()}` : "See website","var(--cyan)"],
                                  ["BBB Rating",         quoteData.bbb||"N/A","var(--yellow)"],
                                  ["Current Discounts",  quoteData.discount||"—","var(--green)"],
                                ].map(([l,v,c])=>(
                                  <div key={l} className="quote-row">
                                    <span style={{color:"var(--text2)"}}>{l}</span>
                                    <span style={{color:c,fontWeight:600}}>{v}</span>
                                  </div>
                                ))}
                                {quoteData.notes && (
                                  <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--text3)",lineHeight:1.7,marginTop:8,paddingTop:8,borderTop:"1px solid rgba(255,255,255,.04)"}}>
                                    📋 {quoteData.notes}
                                  </div>
                                )}
                                {quoteData.tip && (
                                  <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--green)",lineHeight:1.7,marginTop:6}}>
                                    💡 {quoteData.tip}
                                  </div>
                                )}
                                <div style={{marginTop:10}}>
                                  <a href={`https://${m.website}`} target="_blank" rel="noreferrer"
                                    style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--purple2)",
                                      textDecoration:"none",padding:"5px 10px",borderRadius:4,
                                      background:"rgba(124,58,237,.1)",border:"1px solid rgba(124,58,237,.25)"}}>
                                    Get Official Quote → {m.website}
                                  </a>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* PRO TIPS */}
                <div style={{marginTop:16,background:"rgba(124,58,237,.06)",border:"1px solid rgba(124,58,237,.18)",
                  borderRadius:8,padding:"14px 16px"}}>
                  <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--purple2)",letterSpacing:".12em",marginBottom:10}}>
                    💡 IOWA → CALIFORNIA MOVING PRO TIPS
                  </div>
                  {[
                    ["Book early for September", "September is peak moving season — book 6–8 weeks ahead. Rates can be 20–30% lower in Oct–Nov."],
                    ["Get at least 3 binding quotes", "Non-binding estimates can balloon. Demand a binding quote or 'not-to-exceed' price from full-service movers."],
                    ["Weigh your options literally", "Full-service movers charge by weight. Sell or donate heavy furniture before your move — CA has great secondhand stores."],
                    ["PODS + HireAHelper combo", "The best hybrid: ship a PODS container, hire local muscle via HireAHelper for loading/unloading. Often $1,500–$2,500 cheaper than full-service."],
                    ["Check FMCSA licensing", "Verify any mover at protectyourmove.gov — licensed interstate movers must have a USDOT number. Avoid brokers who resell your move."],
                    ["Iowa → CA route timing", "Direct I-80 route is ~1,850 miles (28–30 hrs driving). U-Haul trucks use 40–50% more fuel than cars — budget $450–$600 gas for a 26ft truck."],
                  ].map(([title, desc], i) => (
                    <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom: i<5?"1px solid rgba(255,255,255,.04)":"none"}}>
                      <div style={{fontFamily:"var(--sans)",fontSize:"12px",fontWeight:700,color:"var(--purple2)",minWidth:200,flexShrink:0}}>{title}</div>
                      <div style={{fontFamily:"var(--body)",fontSize:"12px",color:"var(--text2)",lineHeight:1.6}}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: HOUSING SEARCH */}
        {activeTab === "housing" && (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div className="card">
              <div className="card-head">
                <div className="card-title"><span className="card-title-icon">🏠</span> Housing in {selectedSuburb.name}</div>
                <div className="card-sub">
                  {bedrooms==="2br"?"2BR/2BA":"3BR/2BA"} · House w/ yard or Apt w/ pool + gym
                </div>
              </div>
              <div className="card-body">
                {!propData ? (
                  <div style={{textAlign:"center",padding:"24px 0"}}>
                    <button className="btn-primary" onClick={fetchProperties} disabled={loadingProp}>
                      {loadingProp?<><span className="spin"/>SEARCHING LISTINGS…</>
                        :<>🔍 SEARCH LIVE {bedrooms==="2br"?"2BR":"3BR"} LISTINGS IN {selectedSuburb.name.toUpperCase()}</>}
                    </button>
                    <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--text3)",marginTop:10,lineHeight:1.7}}>
                      Searches Zillow, Apartments.com, Redfin for current listings matching:<br/>
                      {bedrooms==="2br"?"2BR/2BA":"3BR/2BA"} · House with yard OR Apt with pool + gym
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="msg-info" style={{marginBottom:12}}>
                      Showing listings for {selectedSuburb.name} · {bedrooms==="2br"?"2BR":"3BR"} · Verify on Zillow/Apartments.com for current availability
                    </div>
                    <div className="property-grid">
                      {propData.map((p, i) => (
                        <div key={i} className="prop-card">
                          <div className="prop-head">
                            <div className="prop-name">{p.name}</div>
                            <div className="prop-type">{p.type?.toUpperCase()} · {p.bedrooms}BD / {p.bathrooms}BA
                              {p.sqft?` · ${p.sqft.toLocaleString()} sqft`:""}</div>
                          </div>
                          <div className="prop-body">
                            <div className="prop-price">${p.rent?.toLocaleString()}/mo</div>
                            <div className="prop-row">
                              <div className="prop-row-label">Address</div>
                              <div className="prop-row-val" style={{fontSize:"10px",textAlign:"right"}}>{p.address}</div>
                            </div>
                            <div className="prop-row">
                              <div className="prop-row-label">Listed on</div>
                              <div className="prop-row-val" style={{color:"var(--purple2)"}}>{p.listed_on}</div>
                            </div>
                            <div className="prop-row">
                              <div className="prop-row-label">vs Iowa {bedrooms==="2br"?"2BR":"3BR"}</div>
                              <div className="prop-row-val" style={{color:"var(--red)"}}>
                                +${((p.rent||0)-(bedrooms==="2br"?IOWA_BASE.rent_2br:IOWA_BASE.rent_3br)).toLocaleString()}/mo
                              </div>
                            </div>
                            <div className="prop-amenity">
                              {(p.amenities||[]).map((a,j)=>(
                                <span key={j} className="amenity-tag">{a}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <div style={{marginTop:16,background:"rgba(0,0,0,.2)",borderRadius:8,padding:"12px 14px"}}>
                  <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--text3)",letterSpacing:".12em",marginBottom:8}}>
                    RESEARCH-BACKED RENT RANGES — {selectedSuburb.name.toUpperCase()} (2026)
                  </div>
                  {[
                    ["2BR Apt (pool + gym)", "$"+(selectedSuburb.rent_2br-200).toLocaleString()+"–$"+selectedSuburb.rent_2br.toLocaleString()],
                    ["2BR House w/ yard", "$"+(selectedSuburb.rent_2br+50).toLocaleString()+"–$"+(selectedSuburb.rent_2br+300).toLocaleString()],
                    ["3BR Apt (pool + gym)", "$"+(selectedSuburb.rent_3br-200).toLocaleString()+"–$"+selectedSuburb.rent_3br.toLocaleString()],
                    ["3BR House w/ yard", "$"+(selectedSuburb.rent_3br+50).toLocaleString()+"–$"+(selectedSuburb.rent_3br+400).toLocaleString()],
                    ["3BR House w/ yard (newer construction)", "$"+(selectedSuburb.rent_3br+300).toLocaleString()+"–$"+(selectedSuburb.rent_3br+700).toLocaleString()],
                  ].map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",
                      fontFamily:"var(--mono)",fontSize:"10px",padding:"5px 0",
                      borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                      <span style={{color:"var(--text2)"}}>{l}</span>
                      <span style={{color:"var(--cyan)",fontWeight:600}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: AI ANALYSIS */}
        {activeTab === "analysis" && (
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
              <button className="btn-primary" onClick={runAnalysis} disabled={analyzing}>
                {analyzing?<><span className="spin"/>ANALYZING…</>:<>⚡ RUN AI RELOCATION ANALYSIS</>}
              </button>
              <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--text3)",lineHeight:1.6}}>
                Analyzes your specific situation: PA-C career, Iowa→CA cost delta,<br/>
                Sacramento housing market, hidden costs, and October 2027 timing
              </div>
            </div>
            {(aiText || analyzing) && (
              <div className="ai-panel">
                <div className="ai-head">
                  <div className="ai-pulse"/>
                  <div className="ai-lbl">CLAUDE AI — RELOCATION ANALYSIS · JEFFONGERI.COM</div>
                  {streaming && <span style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",marginLeft:"auto"}}>STREAMING…</span>}
                </div>
                <div className="ai-body">
                  {aiText
                    ?<span dangerouslySetInnerHTML={{__html:aiText.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br/>")}}/>
                    :<span style={{color:"var(--text3)"}}><span className="spin"/> Generating analysis…</span>
                  }
                  {streaming&&<span className="cursor"/>}
                </div>
              </div>
            )}

            {/* PRE-MOVE CHECKLIST */}
            <div className="card">
              <div className="card-head">
                <div className="card-title"><span className="card-title-icon">✓</span> Pre-Move Checklist</div>
                <div className="card-sub">Before October 2027</div>
              </div>
              <div className="card-body">
                <div className="checklist">
                  {[
                    {ok:true,  text:<><strong>Save move budget:</strong> Target ${Math.round((bedrooms==="2br"?selectedSuburb.rent_2br:selectedSuburb.rent_3br)*3+8000).toLocaleString()} liquid cash before moving date (deposit + first/last + moving costs + 3-month buffer)</>},
                    {ok:false, text:<><strong>Research PA jobs in Sacramento:</strong> UC Davis Medical Center, Kaiser Permanente, Sutter Health, Dignity Health are major hirers. Average PA salary in Sacramento $115K–$145K (2026)</>},
                    {ok:false, text:<><strong>Get CA PA licensure:</strong> Apply to California Medical Board 3–6 months before move. CA license can take 60–120 days to process</>},
                    {ok:true,  text:<><strong>Scouting trip to Sacramento:</strong> Visit {SACTO_SUBURBS.filter(s=>s.commute_min<=30).map(s=>s.name).join(", ")} — these are your best suburbs under 30min commute</>},
                    {ok:false, text:<><strong>Update vehicle insurance to CA:</strong> Notify insurer 30 days before — CA minimum liability increased to 30/60/15 in 2025 (SB 1107)</>},
                    {ok:true,  text:<><strong>Register vehicle within 20 days of establishing CA residency</strong> — don't delay, $200+ penalty for late registration</>},
                    {ok:false, text:<><strong>File partial-year tax returns</strong> for both Iowa AND California in the year you move. Hire a CPA familiar with multi-state returns (~$300–$600)</>},
                    {ok:true,  text:<><strong>October timing advantage:</strong> Sacramento rental market cools in fall — less competition, potentially more negotiating power on rent vs summer moves</>},
                  ].map((item, i) => (
                    <div key={i} className="chk">
                      <div className="chk-check">{item.ok?"✓":"○"}</div>
                      <div className="chk-text" style={{color:item.ok?"var(--text2)":"var(--text2)"}}>{item.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="disc">
          JEFFONGERI.COM · CA MOVE PLANNER · Data sourced via Claude AI web search + BLS/C2ER cost of living indexes.
          Live ZIP lookups performed at time of search. Not financial or legal advice. Verify all figures before making relocation decisions.
          <br/>CPI data: Bureau of Labor Statistics · Rent data: Zillow/Apartments.com/Zumper · Tax rates: CA FTB / Iowa DoR 2026
        </div>
      </div>
    </>
  );
}
