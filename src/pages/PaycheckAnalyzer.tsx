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


// ─── TAX ENGINE (2026 brackets, single filer) ─────────────────────────────────
const FED_BRACKETS = [
  [11600, 0.10], [47150, 0.12], [100525, 0.22],
  [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37]
];

function calcFedTax(annual) {
  let tax = 0, prev = 0;
  for (const [cap, rate] of FED_BRACKETS) {
    if (annual <= prev) break;
    tax += (Math.min(annual, cap) - prev) * rate;
    prev = cap;
  }
  return tax;
}

// State tax rates (2026 estimates) by state code
const STATE_TAX = {
  AL:5.0,AK:0,AZ:2.5,AR:4.4,CA:9.3,CO:4.4,CT:5.0,DE:6.6,FL:0,GA:5.49,
  HI:8.25,ID:5.8,IL:4.95,IN:3.15,IA:6.0,KS:5.58,KY:4.5,LA:3.0,ME:7.15,MD:5.75,
  MA:5.0,MI:4.25,MN:9.85,MS:5.0,MO:4.95,MT:6.75,NE:6.64,NV:0,NH:0,NJ:8.97,
  NM:5.9,NY:10.9,NC:4.75,ND:2.5,OH:3.99,OK:4.75,OR:9.9,PA:3.07,RI:5.99,
  SC:6.5,SD:0,TN:0,TX:0,UT:4.85,VT:8.75,VA:5.75,WA:0,WV:6.5,WI:7.65,WY:0,DC:10.75
};

const SDI_STATES = { CA: 1.3, NJ: 0.47, NY: 0.5, HI: 0.5 };

function calcStateTax(annual, stateCode) {
  const rate = (STATE_TAX[stateCode] || 0) / 100;
  return annual * rate;
}

function calcSDI(annual, stateCode) {
  return annual * ((SDI_STATES[stateCode] || 0) / 100);
}

function calcFICA(annual) {
  const ss = Math.min(annual, 168600) * 0.062;
  const med = annual * 0.0145;
  const addMed = annual > 200000 ? (annual - 200000) * 0.009 : 0;
  return { ss, med, addMed, total: ss + med + addMed };
}

// Standard deduction 2026
const STD_DEDUCTION = { single: 14600, married: 29200, hoh: 21900 };

function runTaxEngine({ gross, payPeriod, state, filingStatus, preTrax401k, preTaxHSA, preTaxOther, extraWithholding }) {
  const periods = { weekly:52, biweekly:26, semimonthly:24, monthly:12, annual:1 };
  const freq = periods[payPeriod] || 26;
  const annualGross = gross * freq;

  // Pre-tax deductions
  const total401k      = (preTrax401k || 0) * freq;
  const totalHSA       = (preTaxHSA || 0) * freq;
  const totalPreOther  = (preTaxOther || 0) * freq;
  const totalPreTax    = total401k + totalHSA + totalPreOther;

  // Taxable income for federal
  const stdDed = STD_DEDUCTION[filingStatus] || STD_DEDUCTION.single;
  const federalTaxable = Math.max(0, annualGross - totalPreTax - stdDed);
  const annualFed  = calcFedTax(federalTaxable);

  // State (no std deduction simplification — uses gross minus pretax)
  const stateTaxable = Math.max(0, annualGross - totalPreTax);
  const annualState = calcStateTax(stateTaxable, state);
  const annualSDI   = calcSDI(annualGross, state);
  const fica        = calcFICA(annualGross);

  // Per-paycheck
  const fedPer    = annualFed   / freq;
  const statePer  = annualState / freq;
  const sdiPer    = annualSDI   / freq;
  const ficaPer   = fica.total  / freq;
  const extraPer  = extraWithholding || 0;
  const totalTaxPer = fedPer + statePer + sdiPer + ficaPer + extraPer;

  return {
    gross, freq, annualGross,
    totalPreTax: totalPreTax / freq,
    totalPreTaxAnnual: totalPreTax,
    fedPer, statePer, sdiPer, ficaPer, extraPer, totalTaxPer,
    annualFed, annualState, annualSDI, ficaAnnual: fica.total,
    fica, federalTaxable, stdDed,
    totalTaxAnnual: annualFed + annualState + annualSDI + fica.total,
    effectiveRate: annualGross > 0 ? ((annualFed + annualState + fica.total) / annualGross * 100) : 0,
    marginalRate: federalTaxable > 100525 ? 22 : federalTaxable > 47150 ? 12 : 10,
  };
}

// ─── MONEY FLOW WATERFALL ─────────────────────────────────────────────────────
function Waterfall({ gross, taxes, pretax, investments, savings, net, customDeductions }) {
  if (!gross || gross <= 0) return null;

  const segments = [
    { label: "Federal Tax",        val: taxes.fedPer,         color: "#E8365D", icon: "⚡" },
    { label: "FICA (SS + Med)",     val: taxes.ficaPer,        color: "#FF6B35", icon: "🏛" },
    { label: "State Tax",          val: taxes.statePer,       color: "#F59E0B", icon: "🏛" },
    taxes.sdiPer > 0 ? { label: "SDI",    val: taxes.sdiPer, color: "#EF4444", icon: "🛡" } : null,
    taxes.extraPer > 0 ? { label: "Extra Withholding", val: taxes.extraPer, color: "#DC2626", icon: "+" } : null,
    taxes.totalPreTax > 0 ? { label: "401(k) / HSA / Pre-tax", val: taxes.totalPreTax, color: "#6366F1", icon: "💼" } : null,
    ...investments.filter(i => i.amount > 0).map(i => ({
      label: i.name || "Investment", val: i.type === "pct" ? gross * i.amount / 100 : i.amount,
      color: "#00C896", icon: "📈"
    })),
    ...savings.filter(s => s.amount > 0).map(s => ({
      label: s.name || "Savings", val: s.type === "pct" ? gross * s.amount / 100 : s.amount,
      color: "#0EA5E9", icon: "🏦"
    })),
    ...customDeductions.filter(d => d.amount > 0).map(d => ({
      label: d.name || "Deduction", val: d.type === "pct" ? gross * d.amount / 100 : d.amount,
      color: "#8B5CF6", icon: "📋"
    })),
  ].filter(Boolean);

  const totalOut = segments.reduce((s, seg) => s + (seg.val || 0), 0);
  const netVal   = Math.max(0, gross - totalOut);

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
      {/* BAR */}
      <div style={{ width: 48, flexShrink: 0, display: "flex", flexDirection: "column", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,.06)" }}>
        {segments.map((seg, i) => {
          const pct = Math.min((seg.val / gross) * 100, 100);
          return (
            <div key={i} style={{ height: `${pct}%`, minHeight: pct > 0.5 ? 6 : 0, background: seg.color,
              transition: "height .5s cubic-bezier(.4,0,.2,1)", position: "relative" }}
              title={`${seg.label}: $${seg.val.toFixed(2)}`}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(255,255,255,.12),transparent)" }} />
            </div>
          );
        })}
        <div style={{ flex: 1, background: "#00C896", minHeight: 8,
          transition: "all .5s cubic-bezier(.4,0,.2,1)", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(255,255,255,.1),transparent)" }} />
        </div>
      </div>

      {/* LEGEND */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        {segments.map((seg, i) => {
          const pct = ((seg.val / gross) * 100).toFixed(1);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px",
              background: `${seg.color}10`, borderRadius: 6,
              border: `1px solid ${seg.color}22`, transition: "all .3s" }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: seg.color, flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#94A3B8", flex: 1 }}>{seg.label}</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: seg.color, fontWeight: 600 }}>-${seg.val.toFixed(2)}</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#475569" }}>{pct}%</span>
            </div>
          );
        })}
        {/* NET */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
          background: "rgba(0,200,150,.1)", borderRadius: 6,
          border: "1px solid rgba(0,200,150,.35)", marginTop: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: "#00C896", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--sans)", fontSize: 11, color: "#E2E8F0", flex: 1, fontWeight: 700 }}>Take-Home Pay</span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: "#00C896", fontWeight: 800 }}>${netVal.toFixed(2)}</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#475569" }}>{((netVal / gross) * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

// ─── ALLOCATION ROW ───────────────────────────────────────────────────────────
function AllocRow({ item, gross, onChange, onRemove, accentColor }) {
  const dollarVal = item.type === "pct"
    ? (gross * (item.amount || 0)) / 100
    : (item.amount || 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 100px 80px 36px",
      gap: 8, alignItems: "center", padding: "8px 0",
      borderBottom: "1px solid rgba(255,255,255,.04)" }}>
      <input value={item.name} onChange={e => onChange({ ...item, name: e.target.value })}
        placeholder="Label…"
        style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 6, padding: "6px 10px", color: "#E2E8F0",
          fontFamily: "var(--body)", fontSize: 12, outline: "none" }} />
      <div style={{ display: "flex", borderRadius: 6, overflow: "hidden",
        border: `1px solid ${item.type === "pct" ? accentColor + "60" : "rgba(255,255,255,.1)"}` }}>
        {["pct", "flat"].map(t => (
          <button key={t} onClick={() => onChange({ ...item, type: t })}
            style={{ flex: 1, padding: "6px 4px", border: "none", cursor: "pointer",
              background: item.type === t ? accentColor + "25" : "rgba(255,255,255,.03)",
              color: item.type === t ? accentColor : "#64748B",
              fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600 }}>
            {t === "pct" ? "%" : "$"}
          </button>
        ))}
      </div>
      <input type="number" value={item.amount || ""} min={0}
        onChange={e => onChange({ ...item, amount: +e.target.value })}
        placeholder={item.type === "pct" ? "%" : "$"}
        style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 6, padding: "6px 10px", color: "#E2E8F0",
          fontFamily: "var(--mono)", fontSize: 12, textAlign: "right", outline: "none", width: "100%" }} />
      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: accentColor, textAlign: "right" }}>
        ${dollarVal.toFixed(2)}
      </span>
      <button onClick={onRemove}
        style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid rgba(239,68,68,.2)",
          background: "rgba(239,68,68,.08)", color: "#E8365D", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>×</button>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, accent, size = "md", prefix = "$" }) {
  return (
    <div style={{ background: "rgba(255,255,255,.025)", border: `1px solid ${accent || "rgba(255,255,255,.07)"}`,
      borderRadius: 12, padding: "14px 16px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg,${color},transparent)` }} />
      <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#475569",
        letterSpacing: ".12em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "var(--sans)", fontSize: size === "lg" ? 28 : size === "sm" ? 16 : 22,
        fontWeight: 800, color: color || "#E2E8F0", lineHeight: 1 }}>
        {prefix}{typeof value === "number" ? value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
      </div>
      {sub && <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#475569", marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

// ─── ZIP LOOKUP MODAL ─────────────────────────────────────────────────────────
function ZipLookup({ onResult, onClose }) {
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  const lookup = async () => {
    if (!zip || zip.length < 5) return;
    setLoading(true); setErr(""); setResult(null);
    try {
      const text = await ai(
        `Search for the state, county, city, and local income tax information for ZIP code ${zip} in the United States. ` +
        `Find: state name, state code (2-letter), city name, county name, ` +
        `state income tax rate for a single filer earning $80,000-$120,000, ` +
        `any local/city income tax rate, state SDI or disability insurance rate, ` +
        `local sales tax rate, average rent for 2BR apartment, and median household income. ` +
        `Return ONLY a JSON object: ` +
        `{"state":"California","state_code":"CA","city":"Sacramento","county":"Sacramento County",` +
        `"state_tax_rate":9.3,"local_tax_rate":0,"sdi_rate":1.3,"sales_tax":8.75,` +
        `"avg_rent_2br":1950,"median_income":65000,"cost_index":118}`,
        700
      );
      const m = text.match(/\{[^{}]*"state_code"[^{}]*\}/s) || text.match(/\{[\s\S]*?\}/g);
      const jsonStr = Array.isArray(m) ? m[m.length - 1] : m?.[0];
      if (!jsonStr) throw new Error("No data returned");
      const d = JSON.parse(jsonStr);
      if (!d.state_code) throw new Error("Invalid response");
      setResult(d);
    } catch (e) {
      setErr(`Lookup failed: ${e.message}`);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#0A0F1E", border: "1px solid rgba(124,110,250,.25)",
        borderRadius: 16, padding: 28, width: 440, maxWidth: "95vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 800, color: "#E2E8F0" }}>
            📍 ZIP Code Tax Lookup
          </div>
          <button onClick={onClose}
            style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid rgba(255,255,255,.1)",
              background: "transparent", color: "#64748B", cursor: "pointer", fontSize: 16 }}>×</button>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input value={zip} onChange={e => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
            onKeyDown={e => e.key === "Enter" && lookup()}
            placeholder="Enter 5-digit ZIP…"
            style={{ flex: 1, background: "rgba(124,110,250,.06)", border: "1px solid rgba(124,110,250,.3)",
              borderRadius: 8, padding: "10px 14px", color: "#E2E8F0",
              fontFamily: "var(--mono)", fontSize: 14, outline: "none" }} />
          <button onClick={lookup} disabled={!zip || loading}
            style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid rgba(124,110,250,.4)",
              background: "rgba(124,110,250,.15)", color: "var(--accent2)",
              fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, cursor: "pointer",
              opacity: !zip || loading ? .4 : 1 }}>
            {loading ? "…" : "SEARCH"}
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "24px 0", fontFamily: "var(--mono)", fontSize: 11, color: "#475569" }}>
            🔍 Searching tax data for ZIP {zip}…
          </div>
        )}

        {err && (
          <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(232,54,93,.08)",
            border: "1px solid rgba(232,54,93,.2)", borderRadius: 6,
            fontFamily: "var(--mono)", fontSize: 10, color: "#E8365D" }}>{err}</div>
        )}

        {result && (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ padding: "10px 14px", background: "rgba(0,200,150,.06)",
              border: "1px solid rgba(0,200,150,.2)", borderRadius: 8,
              fontFamily: "var(--mono)", fontSize: 11, color: "#00C896" }}>
              ✓ {result.city}, {result.state} ({result.county})
            </div>
            {[
              ["State", result.state_code],
              ["State Income Tax", result.state_tax_rate + "%"],
              ["Local/City Tax", result.local_tax_rate ? result.local_tax_rate + "%" : "None"],
              ["SDI Rate", result.sdi_rate ? result.sdi_rate + "%" : "None"],
              ["Sales Tax", result.sales_tax + "%"],
              ["Avg 2BR Rent", "$" + (result.avg_rent_2br || "—").toLocaleString()],
              ["Cost of Living Index", result.cost_index ? result.cost_index + " (US avg = 100)" : "—"],
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between",
                fontFamily: "var(--mono)", fontSize: 11, padding: "5px 0",
                borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                <span style={{ color: "#64748B" }}>{l}</span>
                <span style={{ color: "#E2E8F0", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <button onClick={() => onResult(result)}
              style={{ marginTop: 8, padding: "10px", borderRadius: 8, border: "1px solid rgba(124,110,250,.4)",
                background: "rgba(124,110,250,.15)", color: "var(--accent2)",
                fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              ✓ APPLY TO PAYCHECK — SET STATE TO {result.state_code}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PROJECTION CHART ─────────────────────────────────────────────────────────
function ProjectionChart({ annual, investAnnual, saveAnnual, years = 30, returnRate = 7 }) {
  if (!annual || annual <= 0) return null;
  const data = [];
  let invested = 0, saved = 0, cumInvest = 0, cumSave = 0;
  for (let y = 1; y <= years; y++) {
    cumInvest = (cumInvest + investAnnual) * (1 + returnRate / 100);
    cumSave   = cumSave + saveAnnual;
    data.push({ y, invest: Math.round(cumInvest), save: Math.round(cumSave), net: Math.round(annual - investAnnual - saveAnnual) });
  }
  const maxVal = Math.max(...data.map(d => d.invest));
  const chartH = 140, chartW = 400;

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH + 30}`} style={{ width: "100%", height: "auto" }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(pct => (
        <g key={pct}>
          <line x1={0} y1={chartH * pct} x2={chartW} y2={chartH * pct}
            stroke="rgba(255,255,255,.05)" strokeWidth={1} />
          <text x={chartW - 2} y={chartH * pct - 3}
            fontFamily="monospace" fontSize={8} fill="#334155" textAnchor="end">
            ${(maxVal * (1 - pct) / 1000).toFixed(0)}K
          </text>
        </g>
      ))}
      {/* Investment area */}
      <polyline
        points={data.map((d, i) => `${(i / (years - 1)) * chartW},${chartH - (d.invest / maxVal) * chartH}`).join(" ")}
        fill="none" stroke="#00C896" strokeWidth={2} />
      {/* Savings area */}
      <polyline
        points={data.map((d, i) => `${(i / (years - 1)) * chartW},${chartH - (d.save / maxVal) * chartH}`).join(" ")}
        fill="none" stroke="#0EA5E9" strokeWidth={1.5} strokeDasharray="4,2" />
      {/* Milestone dots */}
      {[4, 9, 19, 29].map(idx => idx < data.length && (
        <g key={idx}>
          <circle cx={(idx / (years - 1)) * chartW} cy={chartH - (data[idx].invest / maxVal) * chartH}
            r={3} fill="#00C896" />
          <text x={(idx / (years - 1)) * chartW} y={chartH - (data[idx].invest / maxVal) * chartH - 6}
            fontFamily="monospace" fontSize={7.5} fill="#00C896" textAnchor="middle">
            ${(data[idx].invest / 1000).toFixed(0)}K
          </text>
        </g>
      ))}
      {/* X axis labels */}
      {[1, 5, 10, 20, 30].filter(y => y <= years).map(y => (
        <text key={y} x={((y - 1) / (years - 1)) * chartW} y={chartH + 14}
          fontFamily="monospace" fontSize={8} fill="#334155" textAnchor="middle">
          yr {y}
        </text>
      ))}
    </svg>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const PERIODS = [
  { id: "weekly",      label: "Weekly",       perYear: 52  },
  { id: "biweekly",   label: "Bi-weekly",    perYear: 26  },
  { id: "semimonthly",label: "Semi-monthly", perYear: 24  },
  { id: "monthly",    label: "Monthly",      perYear: 12  },
  { id: "annual",     label: "Annual",       perYear: 1   },
];

const STATES_LIST = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA",
  "ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK",
  "OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
];

const newItem = (name = "", color) => ({ id: Date.now() + Math.random(), name, type: "pct", amount: "", color });

export default function PaycheckAnalyzer() {
  // ── INPUTS ─────────────────────────────────────────────────────────────────
  const [gross,          setGross]          = useState("");
  const [period,         setPeriod]         = useState("biweekly");
  const [state,          setState_]         = useState("IA");
  const [filingStatus,   setFilingStatus]   = useState("single");
  const [pre401k,        setPre401k]        = useState("");
  const [pre401kType,    setPre401kType]    = useState("flat"); // "flat" | "pct"
  const [preHSA,         setPreHSA]         = useState("");
  const [preHSAType,     setPreHSAType]     = useState("flat");
  const [preOther,       setPreOther]       = useState("");
  const [preOtherType,   setPreOtherType]   = useState("flat");
  const [extraWith,      setExtraWith]      = useState("");
  const [extraWithType,  setExtraWithType]  = useState("flat");
  const [investments,    setInvestments]    = useState([{ id: 1, name: "Brokerage", type: "pct", amount: "", color: "#00C896" }]);
  const [savings,        setSavings]        = useState([{ id: 2, name: "Emergency Fund", type: "pct", amount: "", color: "#0EA5E9" }]);
  const [customDed,      setCustomDed]      = useState([]);
  const [projYears,      setProjYears]      = useState(20);
  const [projReturn,     setProjReturn]     = useState(7);
  const [activeTab,      setActiveTab]      = useState("breakdown");
  const [showZip,        setShowZip]        = useState(false);
  const [aiText,         setAiText]         = useState("");
  const [aiLoading,      setAiLoading]      = useState(false);
  const [aiStreaming,    setAiStreaming]     = useState(false);
  const abortRef = useRef(null);

  // ── TRACKERS ───────────────────────────────────────────────────────────────
  // Pre-built annual limit accounts + generic savings goals
  const [trackers, setTrackers] = useState([
    { id:"roth",   name:"Roth IRA",         icon:"🔵", color:"#7C6EFA", limit:7000,  deposited:0,   type:"annual_limit", note:"2026 limit · $8,000 if 50+" },
    { id:"k401",   name:"401(k) / 403(b)",  icon:"💼", color:"#00E5A0", limit:23000, deposited:0,   type:"annual_limit", note:"2026 limit · $30,500 if 50+ (catch-up $7,500)" },
    { id:"hsa",    name:"HSA",              icon:"🏥", color:"#38BDF8", limit:4150,  deposited:0,   type:"annual_limit", note:"2026 single limit · $8,300 family" },
    { id:"fsa",    name:"Healthcare FSA",   icon:"💊", color:"#C084FC", limit:3300,  deposited:0,   type:"annual_limit", note:"2026 FSA limit (use-it-or-lose-it)" },
    { id:"dep",    name:"Dependent Care FSA",icon:"👶",color:"#FB923C", limit:5000,  deposited:0,   type:"annual_limit", note:"2026 family limit ($2,500 if married filing separately)" },
  ]);
  const [savingsGoals, setSavingsGoals] = useState([
    { id:"ef",   name:"Emergency Fund",  icon:"🛡", color:"#00E5A0", goal:15000, saved:0, note:"Target: 3-6 months expenses" },
    { id:"move", name:"CA Move Budget",  icon:"🌴", color:"#38BDF8", goal:20000, saved:0, note:"Moving costs + deposit + buffer" },
  ]);
  const [editingTracker, setEditingTracker] = useState(null); // id of tracker being edited
  const [editingSGoal,   setEditingSGoal]   = useState(null);

  // ── TAX CALCULATION ────────────────────────────────────────────────────────
  // Resolve pre-tax amounts: % inputs are computed against gross paycheck
  const resolve = (val, type) => {
    const n = +val || 0;
    return type === "pct" ? (+gross || 0) * n / 100 : n;
  };

  const taxes = useMemo(() => {
    const g = +gross;
    if (!g || g <= 0) return null;
    return runTaxEngine({
      gross: g, payPeriod: period, state,
      filingStatus,
      preTrax401k: resolve(pre401k, pre401kType),
      preTaxHSA:   resolve(preHSA,  preHSAType),
      preTaxOther: resolve(preOther, preOtherType),
      extraWithholding: resolve(extraWith, extraWithType),
    });
  }, [gross, period, state, filingStatus,
      pre401k, pre401kType, preHSA, preHSAType,
      preOther, preOtherType, extraWith, extraWithType]);

  const g = +gross || 0;
  const calcAmount = (item) => item.type === "pct" ? g * (item.amount || 0) / 100 : (+item.amount || 0);
  const totalInvest  = investments.reduce((s, i) => s + calcAmount(i), 0);
  const totalSave    = savings.reduce((s, i) => s + calcAmount(i), 0);
  const totalCustom  = customDed.reduce((s, i) => s + calcAmount(i), 0);
  const totalTax     = taxes?.totalTaxPer || 0;
  const totalPretax  = taxes?.totalPreTax || 0;
  const netPay       = Math.max(0, g - totalTax - totalPretax - totalInvest - totalSave - totalCustom);
  const freq         = PERIODS.find(p => p.id === period)?.perYear || 26;

  // Annual projections
  const investAnnual = totalInvest * freq;
  const saveAnnual   = totalSave   * freq;

  // ── AI ANALYSIS ────────────────────────────────────────────────────────────
  const runAI = useCallback(async () => {
    if (!gross || !taxes) return;
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setAiText(""); setAiLoading(true); setAiStreaming(true);

    const prompt =
      `You are a personal finance advisor. Analyze this paycheck and give concise, specific, actionable advice.\n\n` +
      `PAYCHECK DATA:\n` +
      `- Gross per paycheck: $${gross} (${period})\n` +
      `- Annual gross: $${taxes.annualGross.toLocaleString()}\n` +
      `- State: ${state} | Filing: ${filingStatus}\n` +
      `- Federal tax/paycheck: $${taxes.fedPer.toFixed(2)} | Annual: $${taxes.annualFed.toFixed(0)}\n` +
      `- State tax/paycheck: $${taxes.statePer.toFixed(2)} | Annual: $${taxes.annualState.toFixed(0)}\n` +
      `- FICA/paycheck: $${taxes.ficaPer.toFixed(2)} | Annual: $${taxes.ficaAnnual.toFixed(0)}\n` +
      (taxes.sdiPer > 0 ? `- SDI/paycheck: $${taxes.sdiPer.toFixed(2)}\n` : "") +
      `- Pre-tax 401k/paycheck: $${(+pre401k || 0).toFixed(2)}\n` +
      `- Pre-tax HSA/paycheck: $${(+preHSA || 0).toFixed(2)}\n` +
      `- Effective tax rate: ${taxes.effectiveRate.toFixed(1)}%\n` +
      `- Total investments/paycheck: $${totalInvest.toFixed(2)} ($${investAnnual.toFixed(0)}/yr)\n` +
      `- Total savings/paycheck: $${totalSave.toFixed(2)} ($${saveAnnual.toFixed(0)}/yr)\n` +
      `- Take-home per paycheck: $${netPay.toFixed(2)}\n\n` +
      `Provide in 250 words max:\n` +
      `1. **Tax optimization** — one specific action to reduce their tax burden (401k contribution room, HSA, etc.)\n` +
      `2. **Withholding check** — are they over/under withholding based on their rate? What to change on W-4\n` +
      `3. **Savings rate** — is their current savings/investment rate on track? What's the ideal % for their income\n` +
      `4. **One non-obvious tip** — something specific to ${state} residents or this income level`;

    try {
      await aiStream(prompt, c => setAiText(p => p + c), abortRef.current.signal);
    } catch (e) {
      if (e.name !== "AbortError") setAiText("Analysis failed — check your API key.");
    } finally { setAiLoading(false); setAiStreaming(false); }
  }, [gross, taxes, period, state, filingStatus, pre401k, pre401kType, preHSA, preHSAType, extraWith, extraWithType, totalInvest, totalSave, investAnnual, saveAnnual, netPay]);

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#04080F;--bg1:#080D1A;--bg2:#0B1120;--bg3:#0F1628;
      --border:rgba(255,255,255,.06);--border2:rgba(255,255,255,.1);
      --accent:#7C6EFA;--accent2:#9D91FC;--accent3:#5A4ED6;
      --green:#00E5A0;--blue:#38BDF8;--red:#F43F5E;--orange:#FB923C;--purple:#C084FC;
      --text:#EEF2FF;--text2:#94A3B8;--text3:#475569;
      --sans:'Space Grotesk',sans-serif;
      --body:'Inter',sans-serif;
      --mono:'DM Mono',monospace;
    }
    html,body{background:var(--bg);color:var(--text);font-family:var(--body)}
    ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-thumb{background:rgba(124,110,250,.2);border-radius:2px}
    input[type=number]{-moz-appearance:textfield}
    input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
    input::placeholder{color:var(--text3)}
    select option{background:#080D1A}
    .app{min-height:100vh;background:var(--bg);display:flex;flex-direction:column}
    /* HEADER */
    .hdr{
      background:linear-gradient(135deg,#04080F 0%,#080D1A 60%,#0C0F24 100%);
      border-bottom:1px solid rgba(124,110,250,.15);
      padding:0 24px;
      display:grid;grid-template-columns:1fr auto;
      align-items:center;gap:12px;
      position:sticky;top:0;z-index:100;
      backdrop-filter:blur(12px);
    }
    .hdr-inner{display:flex;align-items:center;gap:14px;padding:14px 0}
    .hdr-mark{
      width:36px;height:36px;border-radius:10px;flex-shrink:0;
      background:linear-gradient(135deg,#7C6EFA,#5A4ED6);
      display:flex;align-items:center;justify-content:center;
      font-size:18px;box-shadow:0 0 20px rgba(124,110,250,.35);
    }
    .hdr-title{font-family:var(--sans);font-size:17px;font-weight:800;color:var(--text);letter-spacing:-.02em}
    .hdr-title span{
      background:linear-gradient(135deg,#7C6EFA,#9D91FC);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    }
    .hdr-sub{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.15em;margin-top:2px}
    .hdr-net{text-align:right}
    .hdr-net-label{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.12em}
    .hdr-net-val{font-family:var(--sans);font-size:22px;font-weight:800;color:var(--green);letter-spacing:-.02em}
    /* LEFT */
    .left{background:var(--bg1);border-right:1px solid var(--border);padding:20px;
      overflow-y:auto;display:flex;flex-direction:column;gap:16px}
    .section{display:flex;flex-direction:column;gap:10px}
    .sec-hdr{display:flex;align-items:center;gap:8px;padding-bottom:8px;
      border-bottom:1px solid var(--border)}
    .sec-icon{width:22px;height:22px;border-radius:5px;display:flex;align-items:center;
      justify-content:center;font-size:11px;flex-shrink:0}
    .sec-title{font-family:var(--sans);font-size:12px;font-weight:700;color:var(--text2);letter-spacing:.02em}
    .field{display:flex;flex-direction:column;gap:4px}
    .field label{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.1em}
    .inp{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
      border-radius:8px;padding:9px 12px;color:var(--text);
      font-family:var(--mono);font-size:13px;outline:none;width:100%;
      transition:border-color .15s}
    .inp:focus{border-color:rgba(124,110,250,.5)}
    .inp-accent{
      border-color:rgba(124,110,250,.3)!important;
      background:rgba(124,110,250,.06)!important;
      font-size:18px!important;font-weight:600!important;
    }
    .inp-accent:focus{
      border-color:rgba(124,110,250,.65)!important;
      box-shadow:0 0 0 3px rgba(124,110,250,.1);
    }
    .inp-prefix{position:relative}
    .inp-prefix::before{content:"$";position:absolute;left:12px;top:50%;transform:translateY(-50%);
      font-family:var(--mono);font-size:16px;color:var(--accent2);font-weight:600;pointer-events:none}
    .inp-prefix input{padding-left:26px}
    .row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .period-tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:3px}
    .ptab{padding:5px 3px;border-radius:5px;border:1px solid rgba(255,255,255,.07);
      background:rgba(255,255,255,.03);color:var(--text3);cursor:pointer;
      font-family:var(--mono);font-size:8.5px;font-weight:500;letter-spacing:.04em;
      transition:all .15s;text-align:center}
    .ptab.on{background:rgba(124,110,250,.14);border-color:rgba(124,110,250,.4);color:var(--accent2)}
    .state-select{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end}
    .zip-btn{padding:9px 12px;border-radius:8px;border:1px solid rgba(56,189,248,.3);
      background:rgba(56,189,248,.07);color:var(--blue);font-family:var(--mono);
      font-size:9px;font-weight:700;letter-spacing:.08em;cursor:pointer;
      white-space:nowrap;height:38px;display:flex;align-items:center;gap:5px;transition:all .15s}
    .zip-btn:hover{background:rgba(56,189,248,.14);border-color:rgba(56,189,248,.5)}
    .add-btn{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;
      border:1px dashed rgba(255,255,255,.1);background:transparent;color:var(--text3);
      font-family:var(--mono);font-size:9px;cursor:pointer;transition:all .15s;width:100%;justify-content:center}
    .add-btn:hover{border-color:rgba(124,110,250,.3);color:var(--accent2)}
    /* PRE-TAX ROW */
    .pretax-row{display:flex;flex-direction:column;gap:5px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04)}
    .pretax-row:last-child{border-bottom:none}
    .pretax-label-row{display:flex;align-items:center;justify-content:space-between;gap:8px}
    .pretax-label{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.08em;flex:1}
    .pretax-dollar{font-family:var(--mono);font-size:10px;color:var(--accent2);font-weight:600}
    .pretax-inputs{display:grid;grid-template-columns:80px 1fr;gap:7px;align-items:center}
    .type-toggle{display:flex;border-radius:6px;overflow:hidden;border:1px solid rgba(124,110,250,.25)}
    .type-btn{flex:1;padding:6px 8px;border:none;cursor:pointer;
      font-family:var(--mono);font-size:10px;font-weight:600;transition:all .14s;text-align:center}
    .type-btn.on{background:rgba(124,110,250,.2);color:var(--accent2)}
    .type-btn:not(.on){background:rgba(255,255,255,.03);color:var(--text3)}
    .pretax-note{font-family:var(--mono);font-size:8px;color:var(--text3);line-height:1.5}
    /* RIGHT */
    .right{background:var(--bg);padding:24px;overflow-y:auto;display:flex;flex-direction:column;gap:18px}
    /* TABS */
    .tabs{display:flex;gap:4px;flex-wrap:wrap}
    .tab{padding:7px 16px;border-radius:6px;border:1px solid rgba(255,255,255,.07);
      background:rgba(255,255,255,.03);color:var(--text3);cursor:pointer;
      font-family:var(--mono);font-size:9.5px;font-weight:500;letter-spacing:.06em;transition:all .15s}
    .tab.on{background:rgba(124,110,250,.14);border-color:rgba(124,110,250,.35);color:var(--accent2)}
    /* PANEL */
    .panel{background:var(--bg1);border:1px solid var(--border);border-radius:12px;overflow:hidden}
    .panel-hdr{padding:13px 18px;border-bottom:1px solid var(--border);
      display:flex;align-items:center;justify-content:space-between;
      background:rgba(0,0,0,.15)}
    .panel-title{font-family:var(--sans);font-size:13px;font-weight:700;color:var(--text);
      display:flex;align-items:center;gap:7px}
    .panel-sub{font-family:var(--mono);font-size:9px;color:var(--text3)}
    .panel-body{padding:18px}
    /* STATS GRID */
    .stats-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
    /* TABLE */
    .data-table{width:100%;border-collapse:collapse}
    .data-table th{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.12em;
      text-align:right;padding:7px 12px;border-bottom:1px solid var(--border);font-weight:500}
    .data-table th:first-child{text-align:left}
    .data-table td{font-family:var(--mono);font-size:11px;padding:8px 12px;
      border-bottom:1px solid rgba(255,255,255,.03);vertical-align:middle}
    .data-table tr:last-child td{border-bottom:none}
    .data-table tr:hover td{background:rgba(124,110,250,.04)}
    .data-table td:not(:first-child){text-align:right}
    /* AI */
    .ai-panel{background:var(--bg1);border:1px solid rgba(124,110,250,.22);border-radius:12px;overflow:hidden}
    .ai-hdr{padding:12px 18px;background:rgba(124,110,250,.06);border-bottom:1px solid rgba(124,110,250,.14);
      display:flex;align-items:center;gap:8px}
    .ai-pulse{width:7px;height:7px;border-radius:50%;background:var(--accent2);
      animation:aiGlow 1.5s infinite}
    @keyframes aiGlow{0%,100%{opacity:1;box-shadow:0 0 8px var(--accent2)}50%{opacity:.4;box-shadow:none}}
    .ai-lbl{font-family:var(--mono);font-size:9px;color:var(--accent2);letter-spacing:.15em}
    .ai-body{padding:16px;font-size:12.5px;color:var(--text2);line-height:1.85}
    .ai-body strong{color:var(--text)}
    .ai-btn{padding:10px 20px;border-radius:8px;border:1px solid rgba(124,110,250,.4);
      background:rgba(124,110,250,.12);color:var(--accent2);font-family:var(--mono);
      font-size:10px;font-weight:700;letter-spacing:.08em;cursor:pointer;
      display:flex;align-items:center;gap:7px;transition:all .2s}
    .ai-btn:hover{background:rgba(124,110,250,.22);box-shadow:0 0 24px rgba(124,110,250,.2)}
    .ai-btn:disabled{opacity:.4;cursor:not-allowed}
    /* SPIN */
    .spin{width:13px;height:13px;border:2px solid rgba(124,110,250,.2);
      border-top-color:var(--accent2);border-radius:50%;
      animation:spin .7s linear infinite;display:inline-block;flex-shrink:0}
    @keyframes spin{to{transform:rotate(360deg)}}
    .cursor{display:inline-block;width:2px;height:12px;background:var(--accent2);
      margin-left:2px;vertical-align:middle;
      animation:blink .8s step-end infinite}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
    /* EMPTY */
    .empty{display:flex;flex-direction:column;align-items:center;justify-content:center;
      gap:10px;padding:60px 20px;text-align:center;opacity:.35}
    .empty-icon{font-size:44px}
    .empty-title{font-family:var(--sans);font-size:17px;font-weight:700;color:var(--text2)}
    .empty-sub{font-family:var(--mono);font-size:10px;color:var(--text3);line-height:1.8}
    /* MILESTONE BAR */
    .milestone-bar{display:flex;flex-direction:column;gap:10px;padding:16px 0}
    .milestone-row{display:flex;align-items:center;gap:10px}
    .ms-label{font-family:var(--mono);font-size:9px;color:var(--text3);width:100px;flex-shrink:0}
    .ms-track{flex:1;height:5px;background:rgba(255,255,255,.04);border-radius:3px;overflow:hidden}
    .ms-fill{height:100%;border-radius:3px;transition:width .6s cubic-bezier(.4,0,.2,1)}
    .ms-val{font-family:var(--mono);font-size:10px;font-weight:600;color:var(--text);width:80px;text-align:right;flex-shrink:0}
    /* W-4 */
    .w4-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .w4-card{background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;padding:12px}
    .w4-label{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.08em;margin-bottom:5px}
    .w4-val{font-family:var(--sans);font-size:15px;font-weight:700}
    .w4-sub{font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:4px;line-height:1.5}
    /* TAG */
    .tag{display:inline-block;font-family:var(--mono);font-size:8px;font-weight:700;
      padding:2px 8px;border-radius:4px;letter-spacing:.06em}
    .tag-red{background:rgba(244,63,94,.1);color:var(--red);border:1px solid rgba(244,63,94,.22)}
    .tag-green{background:rgba(0,229,160,.08);color:var(--green);border:1px solid rgba(0,229,160,.22)}
    .tag-accent{background:rgba(124,110,250,.1);color:var(--accent2);border:1px solid rgba(124,110,250,.22)}
    .tag-blue{background:rgba(56,189,248,.08);color:var(--blue);border:1px solid rgba(56,189,248,.2)}
    /* NOTICE */
    .notice{background:rgba(124,110,250,.06);border:1px solid rgba(124,110,250,.18);border-radius:7px;
      padding:9px 12px;font-family:var(--mono);font-size:9px;color:var(--accent2);line-height:1.7}
    /* TRACKER */
    .tracker-grid{display:flex;flex-direction:column;gap:10px}
    .tracker-card{background:var(--bg1);border:1px solid var(--border);border-radius:12px;
      overflow:hidden;transition:border-color .2s}
    .tracker-card:hover{border-color:rgba(124,110,250,.25)}
    .tracker-head{display:flex;align-items:center;gap:10px;padding:13px 16px;
      border-bottom:1px solid var(--border);background:rgba(0,0,0,.12)}
    .tracker-icon{font-size:18px;flex-shrink:0}
    .tracker-name{font-family:var(--sans);font-size:13px;font-weight:700;color:var(--text);flex:1}
    .tracker-pct-badge{font-family:var(--mono);font-size:11px;font-weight:700;
      padding:2px 9px;border-radius:20px}
    .tracker-body{padding:14px 16px;display:flex;flex-direction:column;gap:10px}
    .tracker-amounts{display:flex;justify-content:space-between;align-items:flex-end}
    .tracker-deposited{display:flex;flex-direction:column}
    .tracker-dep-label{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.1em;margin-bottom:3px}
    .tracker-dep-val{font-family:var(--sans);font-size:22px;font-weight:800;line-height:1}
    .tracker-limit{text-align:right}
    .tracker-lim-label{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.1em;margin-bottom:3px}
    .tracker-lim-val{font-family:var(--sans);font-size:14px;font-weight:600;color:var(--text2)}
    .tracker-remain{font-family:var(--mono);font-size:10px;margin-top:2px}
    .tracker-bar{position:relative;height:8px;background:rgba(255,255,255,.05);border-radius:4px;overflow:hidden}
    .tracker-bar-fill{height:100%;border-radius:4px;transition:width .5s cubic-bezier(.4,0,.2,1);position:relative}
    .tracker-bar-fill::after{content:"";position:absolute;inset:0;
      background:linear-gradient(90deg,rgba(255,255,255,.15),transparent)}
    .tracker-note{font-family:var(--mono);font-size:9px;color:var(--text3);line-height:1.5}
    .tracker-edit-row{display:flex;gap:8px;align-items:center}
    .tracker-edit-inp{flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(124,110,250,.3);
      border-radius:7px;padding:7px 11px;color:var(--text);font-family:var(--mono);
      font-size:13px;outline:none}
    .tracker-edit-inp:focus{border-color:var(--accent2)}
    .tracker-save-btn{padding:7px 14px;border-radius:6px;border:1px solid rgba(0,229,160,.3);
      background:rgba(0,229,160,.1);color:var(--green);font-family:var(--mono);
      font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap}
    .tracker-cancel-btn{padding:7px 10px;border-radius:6px;border:1px solid rgba(255,255,255,.08);
      background:transparent;color:var(--text3);font-family:var(--mono);
      font-size:10px;cursor:pointer}
    .tracker-edit-btn{padding:5px 10px;border-radius:5px;border:1px solid rgba(255,255,255,.08);
      background:rgba(255,255,255,.03);color:var(--text3);font-family:var(--mono);
      font-size:9px;cursor:pointer;transition:all .14s}
    .tracker-edit-btn:hover{border-color:rgba(124,110,250,.3);color:var(--accent2)}
    .tracker-section-hdr{font-family:var(--mono);font-size:9px;color:var(--text3);
      letter-spacing:.18em;padding:6px 0;border-bottom:1px solid var(--border);margin-bottom:4px}
    .tracker-milestone{display:flex;justify-content:space-between;margin-top:4px}
    .tracker-ms-dot{display:flex;flex-direction:column;align-items:center;gap:2px}
    .tracker-ms-line{height:3px;border-radius:2px;flex:1;margin:0 2px;margin-top:5px}
    .add-tracker-btn{display:flex;align-items:center;justify-content:center;gap:6px;
      padding:10px;border-radius:8px;border:1px dashed rgba(124,110,250,.2);
      background:rgba(124,110,250,.04);color:var(--accent2);font-family:var(--mono);
      font-size:10px;cursor:pointer;transition:all .15s;width:100%}
    .add-tracker-btn:hover{border-color:rgba(124,110,250,.4);background:rgba(124,110,250,.08)}
    .tracker-2col{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    @media(max-width:700px){.tracker-2col{grid-template-columns:1fr}}
    /* FEDERAL TAX SECTION */
    .tax-section-hdr{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.14em;
      padding:6px 12px;background:rgba(244,63,94,.06);border-bottom:1px solid rgba(244,63,94,.1)}
    .fica-section-hdr{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.14em;
      padding:6px 12px;background:rgba(251,146,60,.05);border-bottom:1px solid rgba(251,146,60,.08)}
    .pretax-section-hdr{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.14em;
      padding:6px 12px;background:rgba(124,110,250,.05);border-bottom:1px solid rgba(124,110,250,.1)}
    .alloc-section-hdr{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.14em;
      padding:6px 12px;background:rgba(0,229,160,.04);border-bottom:1px solid rgba(0,229,160,.08)}
    .net-row td{background:rgba(0,229,160,.04)!important}
    .disc{font-family:var(--mono);font-size:8px;color:var(--text3);
      text-align:center;padding:16px 0;border-top:1px solid var(--border)}
  `;

  const hasData = !!gross && +gross > 0;
  const annualGross = (+gross || 0) * freq;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {/* HEADER */}
        <div className="hdr">
          <div className="hdr-inner">
            <div className="hdr-mark">💸</div>
            <div>
              <div className="hdr-title">Paycheck <span>Analyzer</span></div>
              <div className="hdr-sub">JEFFONGERI.COM · REAL-TIME PAYCHECK INTELLIGENCE</div>
            </div>
          </div>
          {hasData && (
            <div className="hdr-net">
              <div className="hdr-net-label">TAKE-HOME / PAYCHECK</div>
              <div className="hdr-net-val">${netPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            </div>
          )}
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "360px 1fr", minHeight: "calc(100vh - 65px)" }}>

          {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
          <div className="left">

            {/* GROSS PAY */}
            <div className="section">
              <div className="sec-hdr">
                <div className="sec-icon" style={{ background: "rgba(124,110,250,.15)" }}>💸</div>
                <div className="sec-title">Gross Paycheck</div>
              </div>
              <div className="field">
                <label>AMOUNT BEFORE DEDUCTIONS</label>
                <div className="inp-prefix">
                  <input className="inp inp-accent" type="number" value={gross}
                    onChange={e => setGross(e.target.value)} placeholder="0.00" />
                </div>
              </div>
              <div className="field">
                <label>PAY FREQUENCY</label>
                <div className="period-tabs">
                  {PERIODS.map(p => (
                    <div key={p.id} className={`ptab${period === p.id ? " on" : ""}`}
                      onClick={() => setPeriod(p.id)}>{p.label}</div>
                  ))}
                </div>
              </div>
              {hasData && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px",
                  background: "rgba(124,110,250,.07)", border: "1px solid rgba(124,110,250,.18)",
                  borderRadius: 7, fontFamily: "var(--mono)", fontSize: 10 }}>
                  <span style={{ color: "var(--text3)" }}>Annual gross estimate</span>
                  <span style={{ color: "var(--accent2)", fontWeight: 700 }}>
                    ${annualGross.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                  </span>
                </div>
              )}
            </div>

            {/* LOCATION */}
            <div className="section">
              <div className="sec-hdr">
                <div className="sec-icon" style={{ background: "rgba(14,165,233,.12)" }}>📍</div>
                <div className="sec-title">Location &amp; Filing</div>
              </div>
              <div className="state-select">
                <div className="field">
                  <label>STATE</label>
                  <select className="inp" value={state} onChange={e => setState_(e.target.value)}>
                    {STATES_LIST.map(s => (
                      <option key={s} value={s}>{s} {STATE_TAX[s] === 0 ? "✓ No income tax" : `— ${STATE_TAX[s]}%`}</option>
                    ))}
                  </select>
                </div>
                <button className="zip-btn" onClick={() => setShowZip(true)}>
                  📮 ZIP
                </button>
              </div>
              <div className="field">
                <label>FILING STATUS</label>
                <select className="inp" value={filingStatus} onChange={e => setFilingStatus(e.target.value)}>
                  <option value="single">Single</option>
                  <option value="married">Married Filing Jointly</option>
                  <option value="hoh">Head of Household</option>
                </select>
              </div>
            </div>

            {/* PRE-TAX DEDUCTIONS */}
            <div className="section">
              <div className="sec-hdr">
                <div className="sec-icon" style={{ background: "rgba(124,110,250,.15)" }}>🛡</div>
                <div className="sec-title">Pre-Tax Deductions</div>
              </div>
              <div className="notice">Pre-tax reduces your taxable income — saves real money on every paycheck.</div>
              {[
                {
                  label: "401(k) / 403(b)", val: pre401k, setVal: setPre401k,
                  type: pre401kType, setType: setPre401kType,
                  note: `Max $23,000/yr · Current: $${resolve(pre401k, pre401kType).toFixed(2)}/paycheck`,
                  maxPct: Math.min(100, +(g > 0 ? (23000 / (g * freq) * 100).toFixed(1) : 0)),
                },
                {
                  label: "HSA", val: preHSA, setVal: setPreHSA,
                  type: preHSAType, setType: setPreHSAType,
                  note: `Max $4,150 single / $8,300 family (2026) · $${resolve(preHSA, preHSAType).toFixed(2)}/paycheck`,
                  maxPct: null,
                },
                {
                  label: "Other Pre-Tax (FSA, dental, transit)", val: preOther, setVal: setPreOther,
                  type: preOtherType, setType: setPreOtherType,
                  note: `Employer benefits, healthcare FSA, transit · $${resolve(preOther, preOtherType).toFixed(2)}/paycheck`,
                  maxPct: null,
                },
                {
                  label: "Extra Federal Withholding", val: extraWith, setVal: setExtraWith,
                  type: extraWithType, setType: setExtraWithType,
                  note: `W-4 Step 4c · $${resolve(extraWith, extraWithType).toFixed(2)}/paycheck extra withheld`,
                  maxPct: null,
                },
              ].map(({ label, val, setVal, type, setType, note, maxPct }) => {
                const dollarVal = resolve(val, type);
                return (
                  <div key={label} className="pretax-row">
                    <div className="pretax-label-row">
                      <div className="pretax-label">{label.toUpperCase()}</div>
                      {dollarVal > 0 && (
                        <div className="pretax-dollar">−${dollarVal.toFixed(2)}</div>
                      )}
                    </div>
                    <div className="pretax-inputs">
                      <div className="type-toggle">
                        <button className={`type-btn${type === "flat" ? " on" : ""}`}
                          onClick={() => setType("flat")}>$</button>
                        <button className={`type-btn${type === "pct" ? " on" : ""}`}
                          onClick={() => setType("pct")}>%</button>
                      </div>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                          fontFamily: "var(--mono)", fontSize: 12, color: "var(--accent2)", pointerEvents: "none" }}>
                          {type === "flat" ? "$" : "%"}
                        </span>
                        <input className="inp" type="number" value={val}
                          onChange={e => setVal(e.target.value)}
                          placeholder={type === "flat" ? "0.00" : "0.0"}
                          style={{ paddingLeft: 24, paddingTop: 7, paddingBottom: 7 }} />
                      </div>
                    </div>
                    {type === "pct" && val && g > 0 && (
                      <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--accent2)",
                        marginTop: 2, display: "flex", justifyContent: "space-between" }}>
                        <span>{val}% of gross</span>
                        <span>= ${dollarVal.toFixed(2)}/paycheck · ${(dollarVal * freq).toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr</span>
                      </div>
                    )}
                    <div className="pretax-note">{note}</div>
                  </div>
                );
              })}
            </div>

            {/* INVESTMENTS */}
            <div className="section">
              <div className="sec-hdr">
                <div className="sec-icon" style={{ background: "rgba(0,200,150,.12)" }}>📈</div>
                <div className="sec-title">Investments</div>
              </div>
              {investments.map(item => (
                <AllocRow key={item.id} item={item} gross={g}
                  accentColor="#00C896"
                  onChange={updated => setInvestments(prev => prev.map(i => i.id === item.id ? updated : i))}
                  onRemove={() => setInvestments(prev => prev.filter(i => i.id !== item.id))} />
              ))}
              <button className="add-btn" onClick={() => setInvestments(p => [...p, newItem("Investment", "#00C896")])}>
                + Add Investment
              </button>
            </div>

            {/* SAVINGS */}
            <div className="section">
              <div className="sec-hdr">
                <div className="sec-icon" style={{ background: "rgba(14,165,233,.12)" }}>🏦</div>
                <div className="sec-title">Savings</div>
              </div>
              {savings.map(item => (
                <AllocRow key={item.id} item={item} gross={g}
                  accentColor="#0EA5E9"
                  onChange={updated => setSavings(prev => prev.map(i => i.id === item.id ? updated : i))}
                  onRemove={() => setSavings(prev => prev.filter(i => i.id !== item.id))} />
              ))}
              <button className="add-btn" onClick={() => setSavings(p => [...p, newItem("Savings Goal", "#0EA5E9")])}>
                + Add Savings Goal
              </button>
            </div>

            {/* CUSTOM DEDUCTIONS */}
            <div className="section">
              <div className="sec-hdr">
                <div className="sec-icon" style={{ background: "rgba(139,92,246,.12)" }}>📋</div>
                <div className="sec-title">Other Deductions</div>
              </div>
              {customDed.map(item => (
                <AllocRow key={item.id} item={item} gross={g}
                  accentColor="#8B5CF6"
                  onChange={updated => setCustomDed(prev => prev.map(i => i.id === item.id ? updated : i))}
                  onRemove={() => setCustomDed(prev => prev.filter(i => i.id !== item.id))} />
              ))}
              <button className="add-btn" onClick={() => setCustomDed(p => [...p, newItem("Deduction", "#8B5CF6")])}>
                + Add Deduction
              </button>
            </div>

            <div className="disc">Estimates only · Not tax advice · Verify with a CPA</div>
          </div>

          {/* ── RIGHT PANEL ────────────────────────────────────────────────── */}
          <div className="right">
            {!hasData ? (
              <div className="empty">
                <div className="empty-icon">💰</div>
                <div className="empty-title">Enter your gross paycheck</div>
                <div className="empty-sub">
                  Type your gross amount on the left to see<br />
                  your full breakdown — taxes, investments,<br />
                  savings, and real take-home pay in real time.
                </div>
              </div>
            ) : (
              <>
                {/* WATERFALL */}
                <div className="panel">
                  <div className="panel-hdr">
                    <div className="panel-title">💧 Paycheck Flow — ${g.toLocaleString("en-US", { minimumFractionDigits: 2 })} gross</div>
                    <span className="tag tag-accent">{period.toUpperCase()}</span>
                  </div>
                  <div className="panel-body">
                    <Waterfall
                      gross={g} taxes={taxes}
                      pretax={{ total: taxes?.totalPreTax || 0 }}
                      investments={investments}
                      savings={savings}
                      customDeductions={customDed} />
                  </div>
                </div>

                {/* QUICK STATS */}
                <div className="stats-grid">
                  {[
                    { label: "TAKE-HOME / PAYCHECK", value: netPay,    color: "var(--green)", sub: `${((netPay / g) * 100).toFixed(1)}% of gross` },
                    { label: "TOTAL TAX / PAYCHECK",  value: totalTax,  color: "var(--red)",   sub: `Effective rate ${taxes?.effectiveRate.toFixed(1)}%` },
                    { label: "INVESTED / PAYCHECK",   value: totalInvest + (taxes?.totalPreTax || 0), color: "var(--accent2)", sub: `$${((totalInvest + (taxes?.totalPreTax || 0)) * freq).toLocaleString()} /yr` },
                    { label: "SAVED / PAYCHECK",      value: totalSave, color: "var(--blue)",  sub: `$${(totalSave * freq).toLocaleString()} /yr` },
                    { label: "ANNUAL GROSS",          value: annualGross, color: "var(--text)", sub: `${freq} paychecks/year` },
                    { label: "ANNUAL TAX BURDEN",     value: taxes?.totalTaxAnnual || 0, color: "var(--red)", sub: `Fed+State+FICA+SDI` },
                  ].map(s => <StatCard key={s.label} {...s} />)}
                </div>

                {/* TABS */}
                <div className="tabs">
                  {[["breakdown","📊 Breakdown"],["annual","📅 Year-End"],["trackers","🎯 Trackers"],["w4","📝 W-4 Guide"],["projection","📈 Projection"],["ai","✨ AI Advisor"]].map(([id, lbl]) => (
                    <div key={id} className={`tab${activeTab === id ? " on" : ""}`} onClick={() => setActiveTab(id)}>{lbl}</div>
                  ))}
                </div>

                {/* TAB: BREAKDOWN */}
                {activeTab === "breakdown" && taxes && (
                  <div className="panel">
                    <div className="panel-hdr">
                      <div className="panel-title">📊 Full Deduction Breakdown</div>
                      <div className="panel-sub">Per paycheck · {period} · {freq} times/year</div>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th style={{ textAlign: "left" }}>ITEM</th>
                            <th>TYPE</th>
                            <th>PER PAYCHECK</th>
                            <th>ANNUAL</th>
                            <th>% OF GROSS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* ── FEDERAL TAX SECTION ── */}
                          <tr><td colSpan={5} className="tax-section-hdr">FEDERAL TAXES</td></tr>
                          {[
                            { name:"Federal Income Tax",     val:taxes.fedPer,                            ann:taxes.annualFed,                        color:"#F43F5E" },
                            { name:"Social Security (6.2%)", val:taxes.fica.ss/freq,                      ann:taxes.fica.ss,                          color:"#FB923C" },
                            { name:"Medicare (1.45%)",       val:(taxes.fica.med+taxes.fica.addMed)/freq, ann:taxes.fica.med+taxes.fica.addMed,       color:"#FBBF24" },
                            ...(taxes.fica.addMed > 0 ? [{ name:"Add'l Medicare (0.9% >$200K)", val:taxes.fica.addMed/freq, ann:taxes.fica.addMed, color:"#F59E0B" }] : []),
                          ].map((r,i) => (
                            <tr key={`fed-${i}`}>
                              <td><div style={{display:"flex",alignItems:"center",gap:7}}>
                                <div style={{width:7,height:7,borderRadius:2,background:r.color,flexShrink:0}}/>
                                <span style={{color:"var(--text)",fontFamily:"var(--body)",fontSize:12}}>{r.name}</span>
                              </div></td>
                              <td><span className="tag tag-red">Federal</span></td>
                              <td style={{color:r.color,fontWeight:600}}>-${r.val.toFixed(2)}</td>
                              <td style={{color:"var(--text2)"}}>-${r.ann.toLocaleString("en-US",{maximumFractionDigits:0})}</td>
                              <td style={{color:"var(--text3)"}}>{((r.val/g)*100).toFixed(1)}%</td>
                            </tr>
                          ))}

                          {/* ── STATE TAX SECTION ── */}
                          <tr><td colSpan={5} className="fica-section-hdr">STATE TAXES</td></tr>
                          {[
                            { name:`${state} State Income Tax`, val:taxes.statePer, ann:taxes.annualState, color:"#FB923C" },
                            ...(taxes.sdiPer > 0 ? [{ name:"SDI / State Disability", val:taxes.sdiPer, ann:taxes.annualSDI, color:"#FBBF24" }] : []),
                            ...(taxes.extraPer > 0 ? [{ name:"Extra W-4 Withholding", val:taxes.extraPer, ann:taxes.extraPer*freq, color:"#EF4444" }] : []),
                          ].map((r,i) => (
                            <tr key={`st-${i}`}>
                              <td><div style={{display:"flex",alignItems:"center",gap:7}}>
                                <div style={{width:7,height:7,borderRadius:2,background:r.color,flexShrink:0}}/>
                                <span style={{color:"var(--text)",fontFamily:"var(--body)",fontSize:12}}>{r.name}</span>
                              </div></td>
                              <td><span className="tag tag-red">State</span></td>
                              <td style={{color:r.color,fontWeight:600}}>-${r.val.toFixed(2)}</td>
                              <td style={{color:"var(--text2)"}}>-${r.ann.toLocaleString("en-US",{maximumFractionDigits:0})}</td>
                              <td style={{color:"var(--text3)"}}>{((r.val/g)*100).toFixed(1)}%</td>
                            </tr>
                          ))}

                          {/* ── TAX SUBTOTAL ── */}
                          <tr style={{background:"rgba(244,63,94,.04)"}}>
                            <td colSpan={2} style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--red)",fontWeight:700,paddingTop:8,paddingBottom:8}}>
                              TOTAL TAXES
                            </td>
                            <td style={{color:"var(--red)",fontWeight:700}}>-${taxes.totalTaxPer.toFixed(2)}</td>
                            <td style={{color:"var(--red)",fontWeight:700}}>-${taxes.totalTaxAnnual.toLocaleString("en-US",{maximumFractionDigits:0})}</td>
                            <td style={{color:"var(--red)"}}>{((taxes.totalTaxPer/g)*100).toFixed(1)}%</td>
                          </tr>

                          {/* ── PRE-TAX DEDUCTIONS ── */}
                          {(resolve(pre401k,pre401kType)+resolve(preHSA,preHSAType)+resolve(preOther,preOtherType)) > 0 && <>
                            <tr><td colSpan={5} className="pretax-section-hdr">PRE-TAX DEDUCTIONS (reduces taxable income)</td></tr>
                            {[
                              resolve(pre401k,pre401kType) > 0 && { name:"401(k) / 403(b)",     val:resolve(pre401k,pre401kType),  ann:resolve(pre401k,pre401kType)*freq,  color:"#7C6EFA" },
                              resolve(preHSA,preHSAType)   > 0 && { name:"HSA Contribution",    val:resolve(preHSA,preHSAType),    ann:resolve(preHSA,preHSAType)*freq,    color:"#9D91FC" },
                              resolve(preOther,preOtherType)>0 && { name:"Other Pre-Tax",        val:resolve(preOther,preOtherType),ann:resolve(preOther,preOtherType)*freq, color:"#A78BFA" },
                            ].filter(Boolean).map((r,i) => (
                              <tr key={`pt-${i}`}>
                                <td><div style={{display:"flex",alignItems:"center",gap:7}}>
                                  <div style={{width:7,height:7,borderRadius:2,background:r.color,flexShrink:0}}/>
                                  <span style={{color:"var(--text)",fontFamily:"var(--body)",fontSize:12}}>{r.name}</span>
                                </div></td>
                                <td><span className="tag tag-accent">Pre-Tax</span></td>
                                <td style={{color:r.color,fontWeight:600}}>-${r.val.toFixed(2)}</td>
                                <td style={{color:"var(--text2)"}}>-${r.ann.toLocaleString("en-US",{maximumFractionDigits:0})}</td>
                                <td style={{color:"var(--text3)"}}>{((r.val/g)*100).toFixed(1)}%</td>
                              </tr>
                            ))}
                          </>}

                          {/* ── INVESTMENTS & SAVINGS ── */}
                          {(totalInvest+totalSave+totalCustom) > 0 && <>
                            <tr><td colSpan={5} className="alloc-section-hdr">ALLOCATIONS (investments &amp; savings)</td></tr>
                            {[
                              ...investments.filter(i=>calcAmount(i)>0).map(i=>({name:i.name||"Investment",val:calcAmount(i),ann:calcAmount(i)*freq,color:"#00E5A0",type:"Invest"})),
                              ...savings.filter(s=>calcAmount(s)>0).map(s=>({name:s.name||"Savings",val:calcAmount(s),ann:calcAmount(s)*freq,color:"#38BDF8",type:"Save"})),
                              ...customDed.filter(d=>calcAmount(d)>0).map(d=>({name:d.name||"Deduction",val:calcAmount(d),ann:calcAmount(d)*freq,color:"#C084FC",type:"Other"})),
                            ].map((r,i) => (
                              <tr key={`alloc-${i}`}>
                                <td><div style={{display:"flex",alignItems:"center",gap:7}}>
                                  <div style={{width:7,height:7,borderRadius:2,background:r.color,flexShrink:0}}/>
                                  <span style={{color:"var(--text)",fontFamily:"var(--body)",fontSize:12}}>{r.name}</span>
                                </div></td>
                                <td><span className={`tag ${r.type==="Invest"?"tag-green":"tag-blue"}`}>{r.type}</span></td>
                                <td style={{color:r.color,fontWeight:600}}>-${r.val.toFixed(2)}</td>
                                <td style={{color:"var(--text2)"}}>-${r.ann.toLocaleString("en-US",{maximumFractionDigits:0})}</td>
                                <td style={{color:"var(--text3)"}}>{((r.val/g)*100).toFixed(1)}%</td>
                              </tr>
                            ))}
                          </>}

                          {/* ── NET ── */}
                          <tr className="net-row">
                            <td colSpan={2} style={{fontFamily:"var(--sans)",fontWeight:700,color:"var(--text)",paddingTop:12,paddingBottom:12}}>
                              ✓ NET TAKE-HOME PAY
                            </td>
                            <td style={{color:"var(--green)",fontFamily:"var(--sans)",fontWeight:800,fontSize:15}}>${netPay.toFixed(2)}</td>
                            <td style={{color:"var(--green)",fontWeight:700}}>${(netPay*freq).toLocaleString("en-US",{minimumFractionDigits:0})}</td>
                            <td style={{color:"var(--green)"}}>{((netPay/g)*100).toFixed(1)}%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB: TRACKERS */}
                {activeTab === "trackers" && (
                  <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

                    {/* ANNUAL LIMIT TRACKERS */}
                    <div className="panel">
                      <div className="panel-hdr">
                        <div className="panel-title">🎯 Annual Contribution Trackers</div>
                        <div className="panel-sub">Track deposits against IRS limits · 2026</div>
                      </div>
                      <div className="panel-body">
                        <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",lineHeight:1.7,marginBottom:14,
                          padding:"8px 12px",background:"rgba(124,110,250,.05)",border:"1px solid rgba(124,110,250,.12)",borderRadius:7}}>
                          Click <strong style={{color:"var(--accent2)"}}>Edit Deposit</strong> on any account to log what you've contributed so far this year. The tracker shows your remaining room and highlights when you're on pace to max out.
                        </div>
                        <div className="tracker-2col">
                          {trackers.map(tr => {
                            const pct    = Math.min(100, tr.limit > 0 ? (tr.deposited / tr.limit) * 100 : 0);
                            const remain = Math.max(0, tr.limit - tr.deposited);
                            const isMax  = pct >= 100;
                            const isEdit = editingTracker === tr.id;
                            const milestones = [25, 50, 75, 100];
                            // Pace: if paycheck-linked (401k or HSA), estimate paychecks left
                            const payPer401k  = tr.id==="k401" ? resolve(pre401k,pre401kType)*freq : 0;
                            const payPerHSA   = tr.id==="hsa"  ? resolve(preHSA,preHSAType)*freq   : 0;
                            const autoAnnual  = payPer401k||payPerHSA;
                            const onPaceBy    = autoAnnual > 0 ? Math.min(100,(tr.deposited/tr.limit+autoAnnual/tr.limit)*100) : null;

                            return (
                              <div key={tr.id} className="tracker-card" style={{ borderColor: isMax ? tr.color+"60" : undefined }}>
                                <div className="tracker-head">
                                  <div className="tracker-icon">{tr.icon}</div>
                                  <div className="tracker-name">{tr.name}</div>
                                  <div className="tracker-pct-badge" style={{
                                    background: isMax ? tr.color+"25" : "rgba(255,255,255,.06)",
                                    color: isMax ? tr.color : pct>50 ? tr.color : "var(--text3)",
                                    border: `1px solid ${isMax ? tr.color+"50" : "rgba(255,255,255,.08)"}`,
                                  }}>
                                    {pct.toFixed(0)}%
                                  </div>
                                </div>
                                <div className="tracker-body">
                                  {/* AMOUNTS */}
                                  <div className="tracker-amounts">
                                    <div className="tracker-deposited">
                                      <div className="tracker-dep-label">DEPOSITED</div>
                                      <div className="tracker-dep-val" style={{color: tr.color}}>${tr.deposited.toLocaleString()}</div>
                                      {onPaceBy !== null && (
                                        <div style={{fontFamily:"var(--mono)",fontSize:8,color:"var(--text3)",marginTop:3}}>
                                          {onPaceBy >= 100
                                            ? <span style={{color:"var(--green)"}}>✓ On pace to max</span>
                                            : <span>+ auto ${autoAnnual.toLocaleString()}/yr = {onPaceBy.toFixed(0)}% projected</span>
                                          }
                                        </div>
                                      )}
                                    </div>
                                    <div className="tracker-limit">
                                      <div className="tracker-lim-label">LIMIT</div>
                                      <div className="tracker-lim-val">${tr.limit.toLocaleString()}</div>
                                      <div className="tracker-remain" style={{color: isMax?"var(--green)":"var(--text2)"}}>
                                        {isMax ? "✓ Maxed!" : `$${remain.toLocaleString()} remaining`}
                                      </div>
                                    </div>
                                  </div>

                                  {/* PROGRESS BAR */}
                                  <div>
                                    <div className="tracker-bar">
                                      <div className="tracker-bar-fill" style={{
                                        width: `${pct}%`,
                                        background: isMax
                                          ? `linear-gradient(90deg,${tr.color},${tr.color}cc)`
                                          : `linear-gradient(90deg,${tr.color}88,${tr.color})`,
                                      }}/>
                                    </div>
                                    {/* MILESTONES */}
                                    <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                                      {milestones.map(m => (
                                        <div key={m} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                                          <div style={{width:4,height:4,borderRadius:"50%",
                                            background: pct>=m ? tr.color : "rgba(255,255,255,.1)"}} />
                                          <div style={{fontFamily:"var(--mono)",fontSize:7,
                                            color: pct>=m ? tr.color : "var(--text3)"}}>{m}%</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* EDIT DEPOSIT */}
                                  {isEdit ? (
                                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                                      <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)"}}>
                                        Enter total deposited so far this year:
                                      </div>
                                      <div className="tracker-edit-row">
                                        <span style={{fontFamily:"var(--mono)",fontSize:13,color:tr.color,flexShrink:0}}>$</span>
                                        <input
                                          className="tracker-edit-inp"
                                          type="number"
                                          defaultValue={tr.deposited}
                                          id={`tr-inp-${tr.id}`}
                                          placeholder="0"
                                          min={0}
                                          max={tr.limit}
                                          autoFocus
                                        />
                                        <button className="tracker-save-btn" onClick={() => {
                                          const val = Math.min(tr.limit, Math.max(0, +document.getElementById(`tr-inp-${tr.id}`)?.value || 0));
                                          setTrackers(p => p.map(t => t.id===tr.id ? {...t, deposited:val} : t));
                                          setEditingTracker(null);
                                        }}>Save</button>
                                        <button className="tracker-cancel-btn" onClick={() => setEditingTracker(null)}>✕</button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                                      <div className="tracker-note">{tr.note}</div>
                                      <button className="tracker-edit-btn" onClick={() => setEditingTracker(tr.id)}>
                                        Edit Deposit
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* ADD CUSTOM ANNUAL LIMIT TRACKER */}
                        <button className="add-tracker-btn" style={{marginTop:12}} onClick={() => {
                          const colors = ["#7C6EFA","#00E5A0","#38BDF8","#C084FC","#FB923C","#F43F5E"];
                          const icons  = ["💰","📊","🏦","💎","🎯","⭐"];
                          const idx    = trackers.length % colors.length;
                          setTrackers(p => [...p, {
                            id: `custom-${Date.now()}`,
                            name: "Custom Account",
                            icon: icons[idx],
                            color: colors[idx],
                            limit: 5000,
                            deposited: 0,
                            type: "annual_limit",
                            note: "Custom annual limit",
                          }]);
                        }}>
                          + Add Annual Limit Account
                        </button>
                      </div>
                    </div>

                    {/* SAVINGS GOALS */}
                    <div className="panel">
                      <div className="panel-hdr">
                        <div className="panel-title">🏆 Savings Goals</div>
                        <div className="panel-sub">Track progress toward custom financial goals</div>
                      </div>
                      <div className="panel-body">
                        <div className="tracker-2col">
                          {savingsGoals.map(sg => {
                            const pct    = Math.min(100, sg.goal > 0 ? (sg.saved / sg.goal) * 100 : 0);
                            const remain = Math.max(0, sg.goal - sg.saved);
                            const isDone = pct >= 100;
                            const isEdit = editingSGoal === sg.id;
                            // Paycheck contribution pace
                            const matchedSaving = savings.find(s => s.name?.toLowerCase() === sg.name?.toLowerCase());
                            const perPaycheck   = matchedSaving ? calcAmount(matchedSaving) : 0;
                            const perYear       = perPaycheck * freq;
                            const yearsToGoal   = perYear > 0 ? remain / perYear : null;

                            return (
                              <div key={sg.id} className="tracker-card" style={{ borderColor: isDone ? sg.color+"60" : undefined }}>
                                <div className="tracker-head">
                                  <div className="tracker-icon">{sg.icon}</div>
                                  <div className="tracker-name">{sg.name}</div>
                                  <div className="tracker-pct-badge" style={{
                                    background: isDone ? sg.color+"25" : "rgba(255,255,255,.06)",
                                    color: isDone ? sg.color : pct>50 ? sg.color : "var(--text3)",
                                    border: `1px solid ${isDone ? sg.color+"50" : "rgba(255,255,255,.08)"}`,
                                  }}>
                                    {pct.toFixed(0)}%
                                  </div>
                                </div>
                                <div className="tracker-body">
                                  <div className="tracker-amounts">
                                    <div className="tracker-deposited">
                                      <div className="tracker-dep-label">SAVED</div>
                                      <div className="tracker-dep-val" style={{color:sg.color}}>${sg.saved.toLocaleString()}</div>
                                      {yearsToGoal !== null && !isDone && (
                                        <div style={{fontFamily:"var(--mono)",fontSize:8,color:"var(--text3)",marginTop:3}}>
                                          {yearsToGoal < 1
                                            ? <span style={{color:"var(--green)"}}>{Math.round(yearsToGoal*12)}mo at current rate</span>
                                            : <span>{yearsToGoal.toFixed(1)}yr at current rate</span>
                                          }
                                        </div>
                                      )}
                                    </div>
                                    <div className="tracker-limit">
                                      <div className="tracker-lim-label">GOAL</div>
                                      <div className="tracker-lim-val">${sg.goal.toLocaleString()}</div>
                                      <div className="tracker-remain" style={{color:isDone?"var(--green)":"var(--text2)"}}>
                                        {isDone ? "🎉 Goal reached!" : `$${remain.toLocaleString()} to go`}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="tracker-bar">
                                    <div className="tracker-bar-fill" style={{
                                      width: `${pct}%`,
                                      background: `linear-gradient(90deg,${sg.color}88,${sg.color})`,
                                    }}/>
                                  </div>

                                  {perPaycheck > 0 && (
                                    <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",
                                      padding:"5px 8px",background:"rgba(255,255,255,.03)",borderRadius:5}}>
                                      Linked paycheck allocation: <span style={{color:sg.color,fontWeight:600}}>${perPaycheck.toFixed(2)}/check · ${perYear.toLocaleString("en-US",{maximumFractionDigits:0})}/yr</span>
                                    </div>
                                  )}

                                  {isEdit ? (
                                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                                        <div>
                                          <div style={{fontFamily:"var(--mono)",fontSize:8,color:"var(--text3)",marginBottom:4}}>SAVED SO FAR</div>
                                          <div style={{position:"relative"}}>
                                            <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",fontFamily:"var(--mono)",fontSize:12,color:sg.color}}>$</span>
                                            <input className="tracker-edit-inp" type="number"
                                              defaultValue={sg.saved} id={`sg-saved-${sg.id}`}
                                              placeholder="0" min={0} style={{paddingLeft:22}} autoFocus />
                                          </div>
                                        </div>
                                        <div>
                                          <div style={{fontFamily:"var(--mono)",fontSize:8,color:"var(--text3)",marginBottom:4}}>GOAL AMOUNT</div>
                                          <div style={{position:"relative"}}>
                                            <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",fontFamily:"var(--mono)",fontSize:12,color:sg.color}}>$</span>
                                            <input className="tracker-edit-inp" type="number"
                                              defaultValue={sg.goal} id={`sg-goal-${sg.id}`}
                                              placeholder="0" min={0} style={{paddingLeft:22}} />
                                          </div>
                                        </div>
                                      </div>
                                      <div style={{display:"flex",gap:6}}>
                                        <button className="tracker-save-btn" onClick={() => {
                                          const saved = Math.max(0,+document.getElementById(`sg-saved-${sg.id}`)?.value||0);
                                          const goal  = Math.max(1,+document.getElementById(`sg-goal-${sg.id}`)?.value||sg.goal);
                                          setSavingsGoals(p => p.map(s => s.id===sg.id ? {...s,saved,goal} : s));
                                          setEditingSGoal(null);
                                        }}>Save</button>
                                        <button className="tracker-cancel-btn" onClick={()=>setEditingSGoal(null)}>Cancel</button>
                                        <button onClick={() => setSavingsGoals(p=>p.filter(s=>s.id!==sg.id))}
                                          style={{marginLeft:"auto",padding:"6px 10px",borderRadius:5,
                                            border:"1px solid rgba(244,63,94,.2)",background:"rgba(244,63,94,.08)",
                                            color:"var(--red)",fontFamily:"var(--mono)",fontSize:9,cursor:"pointer"}}>
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                                      <div className="tracker-note">{sg.note}</div>
                                      <button className="tracker-edit-btn" onClick={()=>setEditingSGoal(sg.id)}>Edit</button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <button className="add-tracker-btn" style={{marginTop:12}} onClick={() => {
                          const colors = ["#00E5A0","#38BDF8","#7C6EFA","#C084FC","#FB923C"];
                          const icons  = ["🎯","🏖","🚗","🏠","✈","💎","🌴","🎓"];
                          const idx    = savingsGoals.length % colors.length;
                          setSavingsGoals(p => [...p, {
                            id: `sg-${Date.now()}`,
                            name: "New Savings Goal",
                            icon: icons[savingsGoals.length % icons.length],
                            color: colors[idx],
                            goal: 10000,
                            saved: 0,
                            note: "Click Edit to set your goal and current balance",
                          }]);
                          setEditingSGoal(`sg-${Date.now()}`);
                        }}>
                          + Add Savings Goal
                        </button>
                      </div>
                    </div>

                    {/* TRACKER SUMMARY */}
                    {hasData && (
                      <div className="panel">
                        <div className="panel-hdr">
                          <div className="panel-title">📈 Contribution Summary</div>
                          <div className="panel-sub">Total deposited this year across all tracked accounts</div>
                        </div>
                        <div className="panel-body">
                          <div className="stats-grid">
                            {[
                              { label:"TOTAL DEPOSITED (YTD)", value:trackers.reduce((s,t)=>s+t.deposited,0), color:"var(--accent2)" },
                              { label:"401(k) / RETIREMENT",   value:trackers.find(t=>t.id==="k401")?.deposited||0, color:"#00E5A0" },
                              { label:"HSA DEPOSITED",         value:trackers.find(t=>t.id==="hsa")?.deposited||0,  color:"#38BDF8" },
                              { label:"ROTH IRA DEPOSITED",    value:trackers.find(t=>t.id==="roth")?.deposited||0, color:"#7C6EFA" },
                              { label:"SAVINGS GOALS TOTAL",   value:savingsGoals.reduce((s,g)=>s+g.saved,0),       color:"#C084FC" },
                              { label:"AUTO / PAYCHECK (ANN)", value:(totalInvest+totalSave+resolve(pre401k,pre401kType)+resolve(preHSA,preHSAType))*freq, color:"var(--green)", sub:"projected from paycheck allocations" },
                            ].map(s => <StatCard key={s.label} {...s} sub={s.sub} />)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: ANNUAL / YEAR-END */}
                {activeTab === "annual" && taxes && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* KEY YEAR-END NUMBERS */}
                    <div className="stats-grid">
                      {[
                        { label: "FEDERAL TAX — FULL YEAR",   value: taxes.annualFed,         color: "#E8365D", sub: `Bracket: ${taxes.marginalRate}% marginal` },
                        { label: "STATE TAX — FULL YEAR",     value: taxes.annualState,        color: "#F59E0B", sub: `${state} @ ${(STATE_TAX[state] || 0).toFixed(1)}%` },
                        { label: "SS + MEDICARE — FULL YEAR", value: taxes.ficaAnnual,         color: "#FF6B35", sub: "Employee share only" },
                        { label: "TOTAL TAX BURDEN — FULL YR",value: taxes.totalTaxAnnual,     color: "#E8365D", sub: `${taxes.effectiveRate.toFixed(1)}% effective rate`, size: "lg" },
                        { label: "TOTAL INVESTED — FULL YR",  value: investAnnual + (taxes.totalPreTaxAnnual || 0), color: "#00C896", sub: "401k + HSA + brokerage" },
                        { label: "TOTAL SAVED — FULL YR",     value: saveAnnual,               color: "#0EA5E9", sub: "All savings goals combined" },
                        { label: "ANNUAL NET TAKE-HOME",      value: netPay * freq,            color: "#00C896", sub: `$${(netPay * freq / 12).toFixed(0)}/month after all deductions`, size: "lg" },
                        { label: "FEDERAL TAXABLE INCOME",    value: taxes.federalTaxable,     color: "var(--text2)", sub: `After $${taxes.stdDed.toLocaleString()} std deduction` },
                      ].map(s => <StatCard key={s.label} {...s} />)}
                    </div>

                    {/* MILESTONE BARS */}
                    <div className="panel">
                      <div className="panel-hdr">
                        <div className="panel-title">🎯 Where Every Dollar Goes Annually</div>
                      </div>
                      <div className="panel-body">
                        <div className="milestone-bar">
                          {[
                            { label: "Federal Tax",    val: taxes.annualFed,    color: "#E8365D",  max: annualGross },
                            { label: "State Tax",      val: taxes.annualState,  color: "#F59E0B",  max: annualGross },
                            { label: "FICA",           val: taxes.ficaAnnual,   color: "#FF6B35",  max: annualGross },
                            { label: "401k/HSA",       val: taxes.totalPreTaxAnnual, color: "#6366F1", max: annualGross },
                            { label: "Investments",    val: investAnnual,       color: "#00C896",  max: annualGross },
                            { label: "Savings",        val: saveAnnual,         color: "#0EA5E9",  max: annualGross },
                            { label: "Take-Home",      val: netPay * freq,      color: "#00C896",  max: annualGross },
                          ].map(m => (
                            <div key={m.label} className="milestone-row">
                              <div className="ms-label">{m.label}</div>
                              <div className="ms-track">
                                <div className="ms-fill" style={{ width: `${Math.min((m.val / m.max) * 100, 100)}%`, background: m.color }} />
                              </div>
                              <div className="ms-val" style={{ color: m.color }}>
                                ${m.val.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* QUARTERLY ESTIMATES */}
                    <div className="panel">
                      <div className="panel-hdr">
                        <div className="panel-title">📆 Quarterly Tax Estimates</div>
                        <div className="panel-sub">If you have side income or under-withhold</div>
                      </div>
                      <div className="panel-body">
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                          {["Q1 (Apr 15)","Q2 (Jun 15)","Q3 (Sep 15)","Q4 (Jan 15)"].map((q, i) => (
                            <div key={q} style={{ background: "rgba(255,255,255,.03)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                              <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)", marginBottom: 5 }}>{q}</div>
                              <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: "var(--accent2)" }}>
                                ${(taxes.totalTaxAnnual / 4).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </div>
                              <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)", marginTop: 4 }}>est. quarterly</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: 12, fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", lineHeight: 1.7 }}>
                          These are estimates if you pay quarterly taxes. If your employer withholds, this is your total burden for reference. IRS safe harbor: pay 100% of last year's tax or 90% of current year's liability.
                        </div>
                      </div>
                    </div>

                    {/* 401K PROGRESS */}
                    <div className="panel">
                      <div className="panel-hdr">
                        <div className="panel-title">💼 401(k) Contribution Tracker</div>
                      </div>
                      <div className="panel-body">
                        {(() => {
                          const annual401k = (+pre401k || 0) * freq;
                          const limit = 23000;
                          const catchUp = 30500;
                          const pct = Math.min((annual401k / limit) * 100, 100);
                          return (
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 11 }}>
                                <span style={{ color: "var(--text2)" }}>Annual contribution</span>
                                <span style={{ color: "var(--accent2)", fontWeight: 700 }}>${annual401k.toLocaleString()} / ${limit.toLocaleString()} limit</span>
                              </div>
                              <div style={{ height: 10, background: "rgba(255,255,255,.05)", borderRadius: 5, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#6366F1,#8B5CF6)", borderRadius: 5, transition: "width .6s" }} />
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
                                <span>{pct.toFixed(1)}% of annual limit used</span>
                                <span>${(limit - annual401k).toLocaleString()} remaining room</span>
                              </div>
                              {annual401k > 0 && annual401k < limit && (
                                <div style={{ padding: "7px 10px", background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.2)", borderRadius: 6, fontFamily: "var(--mono)", fontSize: 9, color: "#A5B4FC" }}>
                                  💡 Maxing your 401(k) would reduce taxable income by ${(limit - annual401k).toLocaleString()} and save ~${Math.round((limit - annual401k) * (taxes.marginalRate / 100 + (STATE_TAX[state] || 0) / 100)).toLocaleString()} in taxes annually.
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: W-4 GUIDE */}
                {activeTab === "w4" && taxes && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div className="panel">
                      <div className="panel-hdr">
                        <div className="panel-title">📝 W-4 Withholding Diagnosis</div>
                        <div className="panel-sub">Is your withholding correct?</div>
                      </div>
                      <div className="panel-body">
                        {(() => {
                          const withheld  = taxes.fedPer * freq;
                          const owed      = taxes.annualFed;
                          const diff      = withheld - owed;
                          const isOver    = diff > 200;
                          const isUnder   = diff < -200;
                          return (
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                              <div className="w4-grid">
                                <div className="w4-card">
                                  <div className="w4-label">WITHHELD THIS YEAR (EST.)</div>
                                  <div className="w4-val" style={{ color: "var(--text)" }}>${withheld.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
                                  <div className="w4-sub">Based on current federal withholding rate</div>
                                </div>
                                <div className="w4-card">
                                  <div className="w4-label">ESTIMATED TAX OWED</div>
                                  <div className="w4-val" style={{ color: "var(--accent2)" }}>${owed.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
                                  <div className="w4-sub">Based on annual income + filing status</div>
                                </div>
                                <div className="w4-card" style={{ gridColumn: "span 2", borderColor: isOver ? "rgba(0,200,150,.25)" : isUnder ? "rgba(232,54,93,.25)" : "rgba(124,110,250,.25)" }}>
                                  <div className="w4-label">WITHHOLDING STATUS</div>
                                  <div className="w4-val" style={{ color: isOver ? "var(--green)" : isUnder ? "var(--red)" : "var(--accent2)" }}>
                                    {isOver ? `Over-withheld by $${Math.abs(diff).toFixed(0)} → expect refund` : isUnder ? `Under-withheld by $${Math.abs(diff).toFixed(0)} → may owe at filing` : "✓ Roughly on target"}
                                  </div>
                                  <div className="w4-sub">
                                    {isOver ? "You're giving the IRS an interest-free loan. Consider adjusting W-4 to get more per paycheck." : isUnder ? "You may owe a tax bill + possible underpayment penalty. Increase Step 4c on W-4." : "Your current withholding looks about right. Minor differences are normal."}
                                  </div>
                                </div>
                              </div>
                              {/* W-4 STEPS */}
                              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", letterSpacing: ".12em", marginBottom: 4 }}>
                                  W-4 FORM GUIDANCE — 2026
                                </div>
                                {[
                                  { step: "Step 1", title: "Personal Info + Filing Status", action: `Set to "${filingStatus}" — matches your current selection`, color: "var(--text2)" },
                                  { step: "Step 2", title: "Multiple Jobs", action: "Check box if you or spouse have multiple jobs — prevents under-withholding", color: "var(--text2)" },
                                  { step: "Step 3", title: "Dependents / Child Tax Credit", action: "Add qualifying dependents for credits up to $2,000/child under 17", color: "var(--text2)" },
                                  { step: "Step 4a", title: "Other Income", action: "Report other taxable income (freelance, dividends) so employer withholds more", color: isUnder ? "var(--red)" : "var(--text2)" },
                                  { step: "Step 4b", title: "Deductions", action: `${taxes.stdDed.toLocaleString()} standard deduction is auto-applied. Enter here if itemizing more.`, color: "var(--text2)" },
                                  { step: "Step 4c", title: "Extra Withholding", action: isUnder ? `⚠ Add $${Math.ceil(Math.abs(diff) / freq)}/paycheck to avoid owing at filing` : "No extra withholding needed at current pace", color: isUnder ? "var(--red)" : "var(--green)" },
                                ].map((item, i) => (
                                  <div key={i} style={{ display: "flex", gap: 12, padding: "9px 12px", background: "rgba(255,255,255,.02)", border: "1px solid var(--border)", borderRadius: 7 }}>
                                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--accent2)", fontWeight: 700, minWidth: 56, flexShrink: 0, paddingTop: 1 }}>{item.step}</div>
                                    <div>
                                      <div style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>{item.title}</div>
                                      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: item.color, lineHeight: 1.5 }}>{item.action}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: PROJECTION */}
                {activeTab === "projection" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div className="panel">
                      <div className="panel-hdr">
                        <div className="panel-title">📈 Wealth Projection</div>
                        <div className="panel-sub">Investment growth + savings over time</div>
                      </div>
                      <div className="panel-body">
                        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                          {[
                            ["Projection Years", projYears, setProjYears, [5, 10, 15, 20, 25, 30]],
                            ["Annual Return %", projReturn, setProjReturn, [4, 5, 6, 7, 8, 10]],
                          ].map(([label, val, setter, opts]) => (
                            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", letterSpacing: ".1em" }}>{label}</div>
                              <div style={{ display: "flex", gap: 4 }}>
                                {opts.map(o => (
                                  <button key={o} onClick={() => setter(o)}
                                    style={{ padding: "5px 9px", borderRadius: 5, border: "1px solid",
                                      borderColor: val === o ? "rgba(0,200,150,.4)" : "rgba(255,255,255,.07)",
                                      background: val === o ? "rgba(0,200,150,.1)" : "rgba(255,255,255,.03)",
                                      color: val === o ? "var(--green)" : "var(--text3)",
                                      fontFamily: "var(--mono)", fontSize: 10, cursor: "pointer" }}>
                                    {o}{label.includes("%") ? "%" : "yr"}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <ProjectionChart
                          annual={annualGross} investAnnual={investAnnual}
                          saveAnnual={saveAnnual} years={projYears} returnRate={projReturn} />

                        {/* MILESTONE TABLE */}
                        {(() => {
                          const milestones = [];
                          let cumInvest = 0, cumSave = 0;
                          for (let y = 1; y <= projYears; y++) {
                            cumInvest = (cumInvest + investAnnual) * (1 + projReturn / 100);
                            cumSave   = cumSave + saveAnnual;
                            if ([1, 5, 10, 20, 30].includes(y) && y <= projYears) {
                              milestones.push({ y, invest: Math.round(cumInvest), save: Math.round(cumSave), total: Math.round(cumInvest + cumSave) });
                            }
                          }
                          return (
                            <table className="data-table" style={{ marginTop: 16 }}>
                              <thead>
                                <tr>
                                  <th style={{ textAlign: "left" }}>YEAR</th>
                                  <th>INVESTED (w/ returns)</th>
                                  <th>SAVINGS</th>
                                  <th>TOTAL WEALTH</th>
                                </tr>
                              </thead>
                              <tbody>
                                {milestones.map(m => (
                                  <tr key={m.y}>
                                    <td style={{ color: "var(--text)" }}>Year {m.y}</td>
                                    <td style={{ color: "var(--green)" }}>${m.invest.toLocaleString()}</td>
                                    <td style={{ color: "var(--blue)" }}>${m.save.toLocaleString()}</td>
                                    <td style={{ color: "var(--accent2)", fontWeight: 700 }}>${m.total.toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          );
                        })()}
                        <div style={{ marginTop: 10, fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", lineHeight: 1.7 }}>
                          Projection assumes constant income and {projReturn}% annual return on investments. Does not account for inflation, salary growth, or market variability. Past performance does not guarantee future results.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: AI */}
                {activeTab === "ai" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <button className="ai-btn" onClick={runAI} disabled={aiLoading || !hasData}>
                        {aiLoading ? <><span className="spin" />ANALYZING…</> : <>✨ GET AI PAYCHECK ANALYSIS</>}
                      </button>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", lineHeight: 1.7 }}>
                        Tax optimization · W-4 recommendations<br />Savings rate check · {state}-specific tips
                      </div>
                    </div>
                    {(aiText || aiLoading) && (
                      <div className="ai-panel">
                        <div className="ai-hdr">
                          <div className="ai-pulse" />
                          <div className="ai-lbl">CLAUDE AI — PAYCHECK ANALYSIS</div>
                          {aiStreaming && <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)", marginLeft: "auto" }}>STREAMING…</span>}
                        </div>
                        <div className="ai-body">
                          {aiText
                            ? <span dangerouslySetInnerHTML={{ __html: aiText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>") }} />
                            : <span style={{ color: "var(--text3)" }}><span className="spin" style={{ marginRight: 8 }} />Generating analysis…</span>
                          }
                          {aiStreaming && <span className="cursor" />}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="disc">
                  JEFFONGERI.COM · PAYCHECK ANALYZER · Estimates only. Not tax or financial advice. Verify with a CPA or tax professional.
                </div>
              </>
            )}
          </div>
        </div>

        {/* ZIP MODAL */}
        {showZip && (
          <ZipLookup
            onResult={r => { setState_(r.state_code); setShowZip(false); }}
            onClose={() => setShowZip(false)} />
        )}
      </div>
    </>
  );
}
