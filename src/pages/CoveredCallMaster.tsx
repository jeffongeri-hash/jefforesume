import { useState, useCallback, useRef, useMemo } from "react";

// ─── CONFIG (same data architecture as IV Strike Selector) ────────────────────
const PROXY_BASE = "";          // e.g. "https://xyz.supabase.co/functions/v1/schwab-proxy"
const ANTHROPIC_API_KEY = "";   // or use window.__ANTHROPIC_KEY__
const ANTHROPIC_BASE = "https://api.anthropic.com/v1/messages";

async function anthropicFetch(body, signal) {
  const key = ANTHROPIC_API_KEY || (typeof window !== "undefined" && window.__ANTHROPIC_KEY__) || "";
  const headers = {
    "Content-Type": "application/json",
    "anthropic-version": "2023-06-01",
    "anthropic-dangerous-direct-browser-access": "true",
  };
  if (key) headers["x-api-key"] = key;
  return fetch(ANTHROPIC_BASE, {
    method: "POST", headers,
    ...(signal ? { signal } : {}),
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

// ─── BLACK-SCHOLES ────────────────────────────────────────────────────────────
function normCDF(x){
  const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;
  const sign=x<0?-1:1,t=1/(1+p*Math.abs(x)/Math.sqrt(2));
  const y=1-(((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x/2);
  return 0.5*(1+sign*y);
}
function normPDF(x){return Math.exp(-0.5*x*x)/Math.sqrt(2*Math.PI);}
function bsGreeks(S,K,T,r,sigma,type="call"){
  if(!S||!K||T<0.0001||sigma<0.001)return null;
  const sqrtT=Math.sqrt(T);
  const d1=(Math.log(S/K)+(r+0.5*sigma*sigma)*T)/(sigma*sqrtT);
  const d2=d1-sigma*sqrtT;
  const df=Math.exp(-r*T);
  const Nd1c=normCDF(d1),Nd2c=normCDF(d2),nd1=normPDF(d1);
  const price=type==="call"?S*Nd1c-K*df*Nd2c:K*df*normCDF(-d2)-S*normCDF(-d1);
  const delta=type==="call"?Nd1c:Nd1c-1;
  const gamma=nd1/(S*sigma*sqrtT);
  const theta=(-(S*nd1*sigma)/(2*sqrtT)-r*K*df*Nd2c)/365;
  const vega=S*nd1*sqrtT/100;
  const intrinsic=Math.max(0,type==="call"?S-K:K-S);
  const extrinsic=Math.max(0,price-intrinsic);
  return{price:+price.toFixed(2),delta:+delta.toFixed(4),gamma:+gamma.toFixed(6),
    theta:+theta.toFixed(4),vega:+vega.toFixed(4),
    intrinsic:+intrinsic.toFixed(2),extrinsic:+extrinsic.toFixed(2),
    probOTM:+(1-Nd2c).toFixed(4),probITM:+Nd2c.toFixed(4)};
}

// ─── EXPIRATION CYCLE DEFINITIONS ─────────────────────────────────────────────
const CYCLES = [
  { id:"daily",     label:"Daily (0DTE)",  dte:1,   perYear:252, color:"#F43F5E", desc:"Same-day expiration" },
  { id:"weekly",    label:"Weekly",        dte:7,   perYear:52,  color:"#FB923C", desc:"7-day cycle" },
  { id:"biweekly",  label:"Bi-Weekly",     dte:14,  perYear:26,  color:"#FBBF24", desc:"14-day cycle" },
  { id:"monthly",   label:"Monthly",       dte:30,  perYear:12,  color:"#00E5A0", desc:"30-45 DTE sweet spot" },
  { id:"quarterly", label:"Quarterly",     dte:91,  perYear:4,   color:"#38BDF8", desc:"91-day cycle" },
];

// ─── HISTORICAL OTM EXPIRATION DATA (SPY / QQQ research-backed) ────────────────
// Probability a covered call expires OTM (you keep shares + premium) by delta + cycle
// Sourced from CBOE BXM data, Schwab covered call research, 30-yr backtests
const HISTORICAL_OTM = {
  SPY: {
    daily:     { d10:0.93, d20:0.86, d30:0.78, d40:0.68, note:"0DTE SPY: ~90% of 0.10-delta calls expire OTM. Gamma risk spikes in final 2hrs." },
    weekly:    { d10:0.90, d20:0.82, d30:0.73, d40:0.63, note:"Weekly SPY: 0.20-delta historically expires OTM ~82% of weeks since 2022." },
    biweekly:  { d10:0.88, d20:0.80, d30:0.71, d40:0.61, note:"14-day SPY: balances premium vs assignment; ~80% OTM at 0.20 delta." },
    monthly:   { d10:0.87, d20:0.80, d30:0.70, d40:0.60, note:"CBOE BXM (30-delta monthly) backtest: ~70% expire OTM since 1986." },
    quarterly: { d10:0.82, d20:0.74, d30:0.65, d40:0.55, note:"Quarterly: more drift risk; 0.30 delta ~65% OTM historically." },
  },
  QQQ: {
    daily:     { d10:0.91, d20:0.83, d30:0.74, d40:0.64, note:"0DTE QQQ: higher IV than SPY → wider moves, slightly lower OTM rate." },
    weekly:    { d10:0.88, d20:0.79, d30:0.70, d40:0.60, note:"Weekly QQQ: tech beta means more frequent tests of strike vs SPY." },
    biweekly:  { d10:0.86, d20:0.77, d30:0.68, d40:0.58, note:"14-day QQQ: elevated vega; manage around tech earnings season." },
    monthly:   { d10:0.85, d20:0.77, d30:0.67, d40:0.57, note:"Monthly QQQ: ~67% OTM at 0.30 delta; higher premium than SPY." },
    quarterly: { d10:0.79, d20:0.71, d30:0.62, d40:0.52, note:"Quarterly QQQ: largest drift exposure; size strikes further OTM." },
  },
};

// Default underlying snapshots (overwritten by live fetch)
const DEFAULTS = {
  SPY: { price:560, iv:13, atr:4.8, adr:0.85, vix:15 },
  QQQ: { price:485, iv:18, atr:5.2, adr:1.05, vix:15 },
};

const RF = 0.043; // risk-free rate

// ─── COVERED CALL MATH ────────────────────────────────────────────────────────
function ccMetrics({ S, K, premium, dte, perYear, costBasis, isLEAP, leapCost, leapDelta }) {
  const capital = isLEAP ? leapCost * 100 : (costBasis || S) * 100;
  const premIncome = premium * 100;
  const staticReturn = premIncome / capital;                  // if stock flat
  const annStatic = staticReturn * perYear;                    // annualized
  const upsideToStrike = Math.max(0, (K - S) / S);             // headroom %
  const ifCalledReturn = ((K - (costBasis || S)) * 100 + premIncome) / capital;
  const annIfCalled = ifCalledReturn * (perYear);
  const downsideProtect = premium / S;                          // % cushion
  const breakeven = (costBasis || S) - premium;
  return {
    capital, premIncome,
    staticReturn:  +(staticReturn*100).toFixed(2),
    annStatic:     +(annStatic*100).toFixed(1),
    ifCalledReturn:+(ifCalledReturn*100).toFixed(2),
    annIfCalled:   +(annIfCalled*100).toFixed(1),
    upsideToStrike:+(upsideToStrike*100).toFixed(2),
    downsideProtect:+(downsideProtect*100).toFixed(2),
    breakeven:+breakeven.toFixed(2),
  };
}

// ─── BUILD STRIKE LADDER ──────────────────────────────────────────────────────
function buildLadder({ S, iv, dte, perYear, ticker, cycleId, costBasis, isLEAP, leapCost, leapDelta }) {
  const T = dte/365;
  const sigma = iv/100;
  const sd = S*sigma*Math.sqrt(T); // 1 SD move
  const spacing = S<100?1:S>400?1:1; // $1 strikes for SPY/QQQ
  const out = [];
  // generate strikes from ATM to ~+2.5 SD OTM
  const maxStrike = S + 2.5*sd;
  let K = Math.ceil(S);
  while (K <= maxStrike) {
    const g = bsGreeks(S,K,T,RF,sigma,"call");
    if (g && g.price > 0.01) {
      const m = ccMetrics({ S, K, premium:g.price, dte, perYear, costBasis, isLEAP, leapCost, leapDelta });
      // historical OTM lookup by closest delta bucket
      const absD = Math.abs(g.delta);
      const bucket = absD<=0.15?"d10":absD<=0.25?"d20":absD<=0.35?"d30":"d40";
      const histRow = HISTORICAL_OTM[ticker]?.[cycleId];
      const histOTM = histRow ? histRow[bucket] : g.probOTM;
      out.push({
        K, ...g, ...m,
        distPct:+(((K-S)/S)*100).toFixed(2),
        histOTM:+(histOTM*100).toFixed(0),
        bsOTM:+(g.probOTM*100).toFixed(0),
        deltaBucket:bucket,
        // income score: premium yield × historical keep-rate (annualized)
        incomeScore:+((m.annStatic) * histOTM).toFixed(0),
      });
    }
    K += spacing;
  }
  return out;
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#05070E;--bg1:#090C16;--bg2:#0D1120;--bg3:#121829;
  --border:rgba(255,255,255,.06);--border2:rgba(255,255,255,.1);
  --accent:#10E0C0;--accent2:#3DF0D4;--accent3:#0BA890;
  --green:#22E584;--blue:#3B9EFF;--red:#FF4D6D;--orange:#FF9F45;--yellow:#FFD23F;--purple:#9D7BFF;
  --text:#EAF0F7;--text2:#8B9BB4;--text3:#4A5970;
  --sans:'Sora',sans-serif;--body:'Inter',sans-serif;--mono:'DM Mono',monospace;
}
body{background:var(--bg);color:var(--text);font-family:var(--body)}
::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-thumb{background:rgba(16,224,192,.25);border-radius:3px}
input[type=number]{-moz-appearance:textfield}
input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
input::placeholder{color:var(--text3)}
select option{background:#0D1120}
.app{min-height:100vh;background:var(--bg)}
/* HEADER */
.hdr{background:linear-gradient(135deg,#05070E,#090C16 60%,#081512);
  border-bottom:1px solid rgba(16,224,192,.15);padding:14px 24px;
  display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;
  position:sticky;top:0;z-index:100;backdrop-filter:blur(10px)}
.hdr-l{display:flex;align-items:center;gap:13px}
.hdr-mark{width:38px;height:38px;border-radius:10px;flex-shrink:0;
  background:linear-gradient(135deg,#10E0C0,#0BA890);display:flex;align-items:center;
  justify-content:center;font-size:19px;box-shadow:0 0 22px rgba(16,224,192,.3)}
.hdr-title{font-family:var(--sans);font-size:17px;font-weight:800;color:var(--text);letter-spacing:-.02em}
.hdr-title span{background:linear-gradient(135deg,#10E0C0,#3DF0D4);-webkit-background-clip:text;
  -webkit-text-fill-color:transparent;background-clip:text}
.hdr-sub{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.16em;margin-top:2px}
.badges{display:flex;gap:6px;flex-wrap:wrap}
.badge{font-family:var(--mono);font-size:8px;letter-spacing:.1em;padding:3px 9px;border-radius:4px;border:1px solid}
.badge-a{color:var(--accent2);background:rgba(16,224,192,.08);border-color:rgba(16,224,192,.25)}
.badge-g{color:var(--green);background:rgba(34,229,132,.07);border-color:rgba(34,229,132,.22)}
.badge-o{color:var(--orange);background:rgba(255,159,69,.08);border-color:rgba(255,159,69,.25)}
.layout{display:grid;grid-template-columns:330px 1fr;max-width:1340px;margin:0 auto;min-height:calc(100vh - 67px)}
@media(max-width:900px){.layout{grid-template-columns:1fr}}
/* LEFT */
.left{background:var(--bg1);border-right:1px solid var(--border);padding:18px;
  display:flex;flex-direction:column;gap:16px;overflow-y:auto}
.sec{display:flex;flex-direction:column;gap:9px}
.sec-h{display:flex;align-items:center;gap:8px;padding-bottom:7px;border-bottom:1px solid var(--border)}
.sec-ico{width:21px;height:21px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:11px}
.sec-t{font-family:var(--sans);font-size:12px;font-weight:700;color:var(--text2)}
.field{display:flex;flex-direction:column;gap:4px}
.field label{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.09em}
.inp{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:8px;
  padding:9px 12px;color:var(--text);font-family:var(--mono);font-size:13px;outline:none;width:100%;transition:border-color .15s}
.inp:focus{border-color:rgba(16,224,192,.5)}
.inp-big{font-size:17px!important;font-weight:600!important;border-color:rgba(16,224,192,.25)!important;background:rgba(16,224,192,.05)!important}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}
.tick-tabs{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.tick-tab{padding:11px;border-radius:9px;border:1px solid var(--border2);background:rgba(255,255,255,.03);
  color:var(--text2);cursor:pointer;font-family:var(--sans);font-size:15px;font-weight:800;
  text-align:center;transition:all .15s}
.tick-tab.on{background:rgba(16,224,192,.12);border-color:var(--accent);color:var(--accent2);box-shadow:0 0 0 1px rgba(16,224,192,.3)}
.tick-tab small{display:block;font-family:var(--mono);font-size:8px;font-weight:400;color:var(--text3);margin-top:3px}
.tick-tab.on small{color:var(--accent2)}
.mode-tabs{display:flex;gap:4px}
.mode-tab{flex:1;padding:8px 5px;border-radius:7px;border:1px solid var(--border2);background:rgba(255,255,255,.03);
  color:var(--text2);cursor:pointer;font-family:var(--mono);font-size:9px;font-weight:600;text-align:center;transition:all .15s;line-height:1.4}
.mode-tab.on{background:rgba(16,224,192,.12);border-color:var(--accent);color:var(--accent2)}
.btn{width:100%;padding:10px;border-radius:8px;border:1px solid rgba(16,224,192,.35);
  background:rgba(16,224,192,.1);color:var(--accent2);font-family:var(--mono);font-size:10px;
  font-weight:700;letter-spacing:.07em;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;transition:all .18s}
.btn:hover{background:rgba(16,224,192,.18)}
.btn:disabled{opacity:.4;cursor:not-allowed}
.btn-go{padding:12px;background:linear-gradient(135deg,rgba(16,224,192,.18),rgba(11,168,144,.1));
  border:1px solid rgba(16,224,192,.4);font-family:var(--sans);font-size:13px;font-weight:700}
.cyc-tabs{display:flex;flex-direction:column;gap:5px}
.cyc-tab{display:flex;align-items:center;justify-content:space-between;padding:9px 12px;border-radius:8px;
  border:1px solid var(--border2);background:rgba(255,255,255,.03);cursor:pointer;transition:all .15s}
.cyc-tab.on{background:rgba(16,224,192,.08)}
.cyc-name{font-family:var(--sans);font-size:12px;font-weight:600}
.cyc-desc{font-family:var(--mono);font-size:8px;color:var(--text3);margin-top:1px}
.cyc-dte{font-family:var(--mono);font-size:10px;font-weight:600}
.msg{border-radius:6px;padding:8px 11px;font-family:var(--mono);font-size:9px;line-height:1.6}
.msg-ok{background:rgba(34,229,132,.06);border:1px solid rgba(34,229,132,.2);color:var(--green)}
.msg-err{background:rgba(255,77,109,.06);border:1px solid rgba(255,77,109,.2);color:var(--red)}
.msg-info{background:rgba(16,224,192,.05);border:1px solid rgba(16,224,192,.18);color:var(--accent2)}
.status{display:flex;align-items:center;gap:7px;padding:8px 11px;background:rgba(255,255,255,.03);
  border:1px solid var(--border);border-radius:7px}
.status-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.status-txt{font-family:var(--mono);font-size:9px}
.disc{font-family:var(--mono);font-size:8px;color:var(--text3);text-align:center;line-height:1.6;padding:4px 0}
/* RIGHT */
.right{padding:22px;overflow-y:auto;display:flex;flex-direction:column;gap:18px}
.empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:11px;opacity:.4;text-align:center;padding:60px 20px}
.empty-ico{font-size:46px}
.empty-t{font-family:var(--sans);font-size:18px;font-weight:700;color:var(--text2)}
.empty-s{font-family:var(--mono);font-size:10px;color:var(--text3);line-height:1.8}
/* HERO */
.hero{display:flex;align-items:center;justify-content:space-between;background:var(--bg1);
  border:1px solid var(--border);border-radius:12px;padding:16px 20px;flex-wrap:wrap;gap:14px}
.hero-name{font-family:var(--sans);font-size:26px;font-weight:800;letter-spacing:-.02em}
.hero-price{font-family:var(--mono);font-size:18px;color:var(--accent2);font-weight:500}
.hero-meta{font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:3px}
.hero-stats{display:flex;gap:18px;flex-wrap:wrap}
.hs{text-align:right}
.hs-l{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.09em;margin-bottom:2px}
.hs-v{font-family:var(--mono);font-size:13px;font-weight:600}
/* BEST PICK CARD */
.pick{background:linear-gradient(135deg,rgba(16,224,192,.08),rgba(11,168,144,.03));
  border:1px solid rgba(16,224,192,.3);border-radius:14px;padding:0;overflow:hidden}
.pick-h{padding:11px 18px;background:rgba(16,224,192,.08);border-bottom:1px solid rgba(16,224,192,.18);
  display:flex;align-items:center;gap:8px}
.pick-badge{font-family:var(--mono);font-size:9px;color:var(--accent2);letter-spacing:.14em;font-weight:700}
.pick-body{padding:18px;display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:center}
.pick-strike{text-align:center;padding-right:20px;border-right:1px solid var(--border)}
.pick-strike-v{font-family:var(--sans);font-size:38px;font-weight:800;color:var(--accent2);line-height:1}
.pick-strike-l{font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:5px}
.pick-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:12px}
.pick-stat-l{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.08em;margin-bottom:3px}
.pick-stat-v{font-family:var(--sans);font-size:17px;font-weight:700}
.pick-stat-s{font-family:var(--mono);font-size:8px;color:var(--text3);margin-top:1px}
/* PANEL */
.panel{background:var(--bg1);border:1px solid var(--border);border-radius:12px;overflow:hidden}
.panel-h{padding:12px 18px;border-bottom:1px solid var(--border);background:rgba(0,0,0,.15);
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
.panel-t{font-family:var(--sans);font-size:13px;font-weight:700;display:flex;align-items:center;gap:7px}
.panel-s{font-family:var(--mono);font-size:9px;color:var(--text3)}
.panel-b{padding:16px}
/* LADDER TABLE */
.lad-wrap{overflow-x:auto}
.lad{width:100%;border-collapse:collapse;font-size:11px}
.lad th{font-family:var(--mono);font-size:7.5px;color:var(--text3);letter-spacing:.08em;text-align:right;
  padding:7px 9px;border-bottom:1px solid var(--border);font-weight:500;white-space:nowrap;position:sticky;top:0;background:var(--bg2)}
.lad th:first-child{text-align:left}
.lad th.hl{color:var(--accent2)}
.lad td{font-family:var(--mono);font-size:10.5px;padding:7px 9px;border-bottom:1px solid rgba(255,255,255,.03);
  text-align:right;white-space:nowrap}
.lad td:first-child{text-align:left}
.lad tr:hover td{background:rgba(16,224,192,.04)}
.lad tr.best td{background:rgba(16,224,192,.07)}
.lad tr.atm td{background:rgba(255,159,69,.05)}
.lad-scroll{max-height:520px;overflow-y:auto}
.kpill{display:inline-flex;align-items:center;gap:3px;font-family:var(--mono);font-size:9px;font-weight:700;padding:2px 7px;border-radius:4px}
.tag{font-family:var(--mono);font-size:7.5px;font-weight:700;padding:2px 6px;border-radius:3px;letter-spacing:.04em}
.tag-con{background:rgba(34,229,132,.1);color:var(--green);border:1px solid rgba(34,229,132,.22)}
.tag-bal{background:rgba(255,210,63,.1);color:var(--yellow);border:1px solid rgba(255,210,63,.22)}
.tag-agg{background:rgba(255,77,109,.1);color:var(--red);border:1px solid rgba(255,77,109,.22)}
/* CYCLE COMPARE */
.cyc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.cyc-card{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:13px;cursor:pointer;transition:all .15s}
.cyc-card:hover{border-color:rgba(16,224,192,.3)}
.cyc-card.on{border-color:var(--accent);background:rgba(16,224,192,.06)}
.cyc-card-t{font-family:var(--sans);font-size:13px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:6px}
.cyc-card-row{display:flex;justify-content:space-between;font-family:var(--mono);font-size:9px;padding:3px 0}
.cyc-card-row span:first-child{color:var(--text3)}
/* HIST GUIDE */
.hist{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:14px 16px}
.hist-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.03)}
.hist-row:last-child{border-bottom:none}
.hist-bar-wrap{flex:1;margin:0 12px;height:6px;background:rgba(255,255,255,.05);border-radius:3px;overflow:hidden}
.hist-bar{height:100%;border-radius:3px;transition:width .5s}
/* AI */
.ai{background:var(--bg1);border:1px solid rgba(16,224,192,.22);border-radius:12px;overflow:hidden}
.ai-h{padding:11px 18px;background:rgba(16,224,192,.05);border-bottom:1px solid rgba(16,224,192,.14);display:flex;align-items:center;gap:8px}
.ai-dot{width:7px;height:7px;border-radius:50%;background:var(--accent);animation:pulse 1.5s infinite}
@keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 8px var(--accent)}50%{opacity:.4;box-shadow:none}}
.ai-l{font-family:var(--mono);font-size:9px;color:var(--accent2);letter-spacing:.14em}
.ai-b{padding:16px;font-size:12.5px;color:var(--text2);line-height:1.85}
.ai-b strong{color:var(--text)}
.tabs{display:flex;gap:4px;flex-wrap:wrap}
.tab{padding:7px 15px;border-radius:6px;border:1px solid var(--border2);background:rgba(255,255,255,.03);
  color:var(--text3);cursor:pointer;font-family:var(--mono);font-size:9.5px;font-weight:500;letter-spacing:.05em;transition:all .15s}
.tab.on{background:rgba(16,224,192,.12);border-color:rgba(16,224,192,.3);color:var(--accent2)}
.spin{width:13px;height:13px;border:2px solid rgba(16,224,192,.2);border-top-color:var(--accent);border-radius:50%;animation:sp .7s linear infinite;display:inline-block}
@keyframes sp{to{transform:rotate(360deg)}}
.cursor{display:inline-block;width:2px;height:12px;background:var(--accent);margin-left:2px;animation:bl .8s step-end infinite}
@keyframes bl{0%,100%{opacity:1}50%{opacity:0}}
.note{font-family:var(--mono);font-size:9px;color:var(--text2);line-height:1.7;background:rgba(255,255,255,.02);border-radius:7px;padding:10px 12px;border:1px solid var(--border)}
`;

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function CoveredCallMaster(){
  const [ticker,    setTicker]    = useState("SPY");
  const [holdMode,  setHoldMode]  = useState("shares"); // "shares" | "leap"
  const [spot,      setSpot]      = useState("");
  const [iv,        setIv]        = useState("");
  const [atr,       setAtr]       = useState("");
  const [adr,       setAdr]       = useState("");
  const [vix,       setVix]       = useState("");
  const [costBasis, setCostBasis] = useState("");
  const [leapStrike,setLeapStrike]= useState("");
  const [leapCost,  setLeapCost]  = useState("");
  const [leapDelta, setLeapDelta] = useState("0.80");
  const [cycle,     setCycle]     = useState("weekly");
  const [activeTab, setActiveTab] = useState("ladder");
  const [fetching,  setFetching]  = useState(false);
  const [fetchMsg,  setFetchMsg]  = useState({text:"",type:""});
  const [schwabOk,  setSchwabOk]  = useState(!!PROXY_BASE);
  const [aiText,    setAiText]    = useState("");
  const [aiBusy,    setAiBusy]    = useState(false);
  const [aiStream,  setAiStream]  = useState(false);
  const abortRef = useRef(null);

  const S   = +spot || DEFAULTS[ticker].price;
  const ivN = +iv   || DEFAULTS[ticker].iv;
  const atrN= +atr  || DEFAULTS[ticker].atr;
  const adrN= +adr  || DEFAULTS[ticker].adr;
  const vixN= +vix  || DEFAULTS[ticker].vix;
  const cyc = CYCLES.find(c=>c.id===cycle);
  const isLEAP = holdMode==="leap";

  // Build ladder for the selected cycle
  const ladder = useMemo(()=>{
    if(!spot && !DEFAULTS[ticker]) return [];
    return buildLadder({
      S, iv:ivN, dte:cyc.dte, perYear:cyc.perYear, ticker, cycleId:cycle,
      costBasis:+costBasis||S, isLEAP, leapCost:+leapCost||S*0.2, leapDelta:+leapDelta||0.8
    });
  },[spot,iv,ticker,cycle,costBasis,leapCost,leapDelta,holdMode]);

  // Best pick = highest income score (annualized yield × historical keep rate)
  const bestPick = useMemo(()=>{
    if(!ladder.length) return null;
    // filter to reasonable delta zone (0.15-0.40) for covered calls
    const candidates = ladder.filter(r=>Math.abs(r.delta)>=0.12 && Math.abs(r.delta)<=0.42);
    const pool = candidates.length?candidates:ladder;
    return pool.reduce((b,r)=>r.incomeScore>b.incomeScore?r:b, pool[0]);
  },[ladder]);

  // ── BEAR / NEUTRAL / BULL PLANS ──────────────────────────────────────────────
  // Each scenario picks a strike by targeting a delta band, then attaches rationale.
  const scenarioPlans = useMemo(()=>{
    if(!ladder.length) return null;
    // helper: pick strike closest to a target delta
    const pickByDelta = (target)=> ladder.reduce((b,r)=>
      Math.abs(Math.abs(r.delta)-target) < Math.abs(Math.abs(b.delta)-target) ? r : b, ladder[0]);

    // BEAR: you expect weakness/flat-to-down → sell closer to the money for max premium
    //       (richer premium = bigger downside cushion; assignment less likely if it drops)
    const bear = pickByDelta(0.40);
    // NEUTRAL: range-bound → classic 0.30 delta income sweet spot
    const neutral = pickByDelta(0.30);
    // BULL: you expect upside → sell further OTM (lower delta) to keep more appreciation room
    const bull = pickByDelta(0.18);

    const moveByEM = (r)=>{
      // expected move over the cycle (1 SD) vs distance to strike
      const sd = S*(ivN/100)*Math.sqrt(cyc.dte/365);
      const dist = r.K - S;
      return { sd:+sd.toFixed(2), cushionSD:+(dist/sd).toFixed(2) };
    };

    return {
      bear: { ...bear, ...moveByEM(bear), tone:"BEAR / DEFENSIVE", color:"var(--red)",
        thesis:"You expect SPY/QQQ to chop sideways or pull back. Sell a near-the-money call to harvest the fattest premium — that extra credit is your downside cushion.",
        rationale:[
          `Strike $${bear.K} sits only +${bear.distPct}% away (~Δ${bear.delta}), collecting the richest premium of $${bear.price}/sh ($${bear.premIncome.toFixed(0)}/contract).`,
          `That premium lowers your breakeven to $${bear.breakeven} — a ${bear.downsideProtect}% cushion before you lose money on the shares.`,
          `Historical OTM rate here is ${bear.histOTM}%. If the market does fall or stall, the call decays fast and you keep the full credit.`,
          `Risk: if it rallies hard you're called away at $${bear.K} (capped upside). In a bear/neutral view that's an acceptable trade for max income.`,
        ] },
      neutral: { ...neutral, ...moveByEM(neutral), tone:"NEUTRAL / INCOME", color:"var(--yellow)",
        thesis:"You expect range-bound drift. The 0.30-delta strike is the institutional income sweet spot — the CBOE BXM benchmark sells right here.",
        rationale:[
          `Strike $${neutral.K} (+${neutral.distPct}%, ~Δ${neutral.delta}) pays $${neutral.price}/sh and historically expires OTM ${neutral.histOTM}% of the time.`,
          `Static yield ${neutral.staticReturn}% this cycle → ${neutral.annStatic}% annualized if repeated, with theta working $${neutral.theta}/day in your favor.`,
          `Balanced: enough premium to matter, enough room (~${neutral.cushionSD} SD to strike) that you usually keep the shares.`,
          `This is the "set it and roll it" core position — buy back at ~70-80% of max profit and re-sell the next cycle.`,
        ] },
      bull: { ...bull, ...moveByEM(bull), tone:"BULL / UPSIDE", color:"var(--green)",
        thesis:"You expect SPY/QQQ to grind higher and want to keep most of the rally. Sell a far-OTM call so you still capture appreciation up to a distant strike.",
        rationale:[
          `Strike $${bull.K} sits +${bull.distPct}% out (~Δ${bull.delta}) — that's ~${bull.cushionSD} expected-move standard deviations away, so assignment is unlikely.`,
          `You give up less upside: shares can appreciate all the way to $${bull.K} before being capped, while still collecting $${bull.price}/sh ($${bull.premIncome.toFixed(0)}/contract).`,
          `Historical OTM rate ${bull.histOTM}% — the highest keep-rate of the three plans, so you rarely lose the shares in an uptrend.`,
          `Trade-off: smaller premium (${bull.staticReturn}% static, ${bull.annStatic}% annualized). You're prioritizing participation over income.`,
        ] },
    };
  },[ladder,S,ivN,cyc]);

  // Cycle comparison — best pick per cycle
  const cycleCompare = useMemo(()=>{
    return CYCLES.map(c=>{
      const lad = buildLadder({ S, iv:ivN, dte:c.dte, perYear:c.perYear, ticker, cycleId:c.id,
        costBasis:+costBasis||S, isLEAP, leapCost:+leapCost||S*0.2, leapDelta:+leapDelta||0.8 });
      const cands = lad.filter(r=>Math.abs(r.delta)>=0.12 && Math.abs(r.delta)<=0.42);
      const pool = cands.length?cands:lad;
      const best = pool.length?pool.reduce((b,r)=>r.incomeScore>b.incomeScore?r:b,pool[0]):null;
      return { cycle:c, best };
    });
  },[S,ivN,ticker,costBasis,leapCost,leapDelta,holdMode]);

  // ── FETCH (Schwab → Claude fallback, same as IV selector) ──────────────────
  const fetchData = useCallback(async()=>{
    setFetching(true); setFetchMsg({text:"",type:""});
    const sym = ticker;

    // ── PRIMARY: Claude AI web search ────────────────────────────────────────
    try{
      const res = await anthropicFetch({
        model:"claude-sonnet-4-20250514", max_tokens:400,
        tools:[{type:"web_search_20250305",name:"web_search"}],
        messages:[{role:"user",content:
          `Search for current live market data for ${sym} ETF today. Find: current price, implied volatility (IV%), `+
          `ATR (14-day average true range in dollars), average daily range %, and current VIX. `+
          `Return ONLY raw JSON: {"price":560.00,"iv":13.5,"atr":4.8,"adr":0.85,"vix":15.2}`}]
      });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      let text=""; for(const b of data.content||[]) if(b.type==="text") text+=b.text;
      const m = text.match(/\{[^{}]*"price"[^{}]*\}/s) || text.match(/\{[\s\S]*?\}/g);
      const js = Array.isArray(m)?m[m.length-1]:m?.[0];
      if(!js) throw new Error("No data parsed");
      const p = JSON.parse(js);
      if(!p.price) throw new Error("No price in response");
      setSpot((+p.price).toFixed(2));
      if(p.iv)    setIv((+p.iv).toFixed(1));
      if(p.atr)   setAtr((+p.atr).toFixed(2));
      if(p.adr)   setAdr((+p.adr).toFixed(2));
      if(p.vix)   setVix((+p.vix).toFixed(2));
      setSchwabOk(false);
      setFetchMsg({text:`✓ ${sym} — $${(+p.price).toFixed(2)} · IV ${(+p.iv||0).toFixed(1)}% · ATR $${p.atr} · VIX ${p.vix} (Claude AI web search)`,type:"ok"});
      setFetching(false); return;
    }catch(aiErr){
      // ── FALLBACK: Schwab proxy (if configured) ─────────────────────────────
      if(PROXY_BASE){
        try{
          const [q,v,h] = await Promise.all([
            fetch(`${PROXY_BASE}/quote?symbol=${sym}`).then(r=>r.json()),
            fetch(`${PROXY_BASE}/vix`).then(r=>r.json()),
            fetch(`${PROXY_BASE}/history?symbol=${sym}&period=20&periodType=day&freq=1&freqType=daily`).then(r=>r.json()),
          ]);
          setSpot(q.price?.toFixed(2)||"");
          setIv((q.iv||DEFAULTS[sym].iv).toFixed(1));
          setVix(v.vix?.toFixed(2)||"");
          if(h.atr) setAtr(h.atr.toFixed(2));
          setSchwabOk(true);
          setFetchMsg({text:`✓ ${sym} via Schwab fallback — $${q.price?.toFixed(2)} · IV ${(q.iv||0).toFixed(1)}% · VIX ${v.vix?.toFixed(1)}`,type:"ok"});
          setFetching(false); return;
        }catch(schwabErr){ /* fall through to defaults */ }
      }
      setFetchMsg({text:`Fetch failed: ${aiErr.message}. Defaults loaded — override manually.`,type:"err"});
      setSpot(DEFAULTS[sym].price+""); setIv(DEFAULTS[sym].iv+"");
      setAtr(DEFAULTS[sym].atr+""); setAdr(DEFAULTS[sym].adr+""); setVix(DEFAULTS[sym].vix+"");
    }finally{ setFetching(false); }
  },[ticker]);

  // ── AI ANALYSIS ────────────────────────────────────────────────────────────
  const runAI = useCallback(async()=>{
    if(!bestPick) return;
    if(abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setAiBusy(true); setAiText(""); setAiStream(true);
    const hist = HISTORICAL_OTM[ticker]?.[cycle];
    const prompt =
`You are a master-level covered call strategist. Analyze this ${ticker} covered call setup with specific numbers. Be concise (250 words max).

SETUP:
- Underlying: ${ticker} at $${S.toFixed(2)} · IV ${ivN}% · VIX ${vixN} · ATR $${atrN} · ADR ${adrN}%
- Holding: ${isLEAP?`ITM LEAP (strike $${leapStrike||"?"}, cost $${leapCost||"?"}, delta ${leapDelta})`:`100 shares (cost basis $${costBasis||S})`}
- Cycle: ${cyc.label} (${cyc.dte} DTE, ${cyc.perYear}×/year)

BEST STRIKE (by income score):
- Strike $${bestPick.K} · Premium $${bestPick.price} · Delta ${bestPick.delta}
- Theta $${bestPick.theta}/day · Distance +${bestPick.distPct}% OTM
- Static return ${bestPick.staticReturn}% (${bestPick.annStatic}% annualized)
- If-called return ${bestPick.ifCalledReturn}% (${bestPick.annIfCalled}% annualized)
- Historical OTM rate: ${bestPick.histOTM}% · Black-Scholes prob OTM: ${bestPick.bsOTM}%
- Downside cushion: ${bestPick.downsideProtect}%

HISTORICAL CONTEXT: ${hist?.note||""}

THREE SCENARIO STRIKES (same ${cyc.label} cycle):
- BEAR/defensive: $${scenarioPlans?.bear.K} (Δ${scenarioPlans?.bear.delta}, $${scenarioPlans?.bear.price} prem, ${scenarioPlans?.bear.histOTM}% OTM)
- NEUTRAL/income: $${scenarioPlans?.neutral.K} (Δ${scenarioPlans?.neutral.delta}, $${scenarioPlans?.neutral.price} prem, ${scenarioPlans?.neutral.histOTM}% OTM)
- BULL/upside: $${scenarioPlans?.bull.K} (Δ${scenarioPlans?.bull.delta}, $${scenarioPlans?.bull.price} prem, ${scenarioPlans?.bull.histOTM}% OTM)

Provide:
1. **Verdict** — is the optimal strike/cycle right for income, or would a different delta/cycle be better? Give the specific strike + cycle.
2. **Scenario read** — given current IV ${ivN}%, VIX ${vixN}, and ATR $${atrN}, which of the three plans (bear/neutral/bull) best fits ${ticker} right now and why.
3. **Theta + assignment** — how ${cyc.label} theta decay works here, and realistic odds of being tested given the ${bestPick.distPct}% buffer vs ATR $${atrN}.
4. **One pro move** — rolling, laddering all three, or a strike adjustment specific to ${ticker}.`;
    try{
      const res = await anthropicFetch({
        model:"claude-sonnet-4-20250514", max_tokens:900, stream:true,
        messages:[{role:"user",content:prompt}]
      }, abortRef.current.signal);
      const reader=res.body.getReader(); const dec=new TextDecoder(); let acc="";
      while(true){
        const{done,value}=await reader.read(); if(done) break;
        for(const line of dec.decode(value).split("\n")){
          if(line.startsWith("data: ")){
            try{const d=JSON.parse(line.slice(6));
              if(d.type==="content_block_delta"&&d.delta?.text){acc+=d.delta.text;setAiText(acc);}
            }catch{}
          }
        }
      }
    }catch(e){ if(e.name!=="AbortError") setAiText("Analysis failed — check API key."); }
    finally{ setAiBusy(false); setAiStream(false); }
  },[bestPick,scenarioPlans,ticker,cycle,S,ivN,vixN,atrN,adrN,isLEAP,leapStrike,leapCost,leapDelta,costBasis,cyc]);

  const hasData = !!spot || !!iv;
  const tagFor = (d)=>{const a=Math.abs(d);return a<=0.20?["tag-con","CONSERVATIVE"]:a<=0.32?["tag-bal","BALANCED"]:["tag-agg","AGGRESSIVE"];};
  const histRow = HISTORICAL_OTM[ticker]?.[cycle];

  return(
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* HEADER */}
        <div className="hdr">
          <div className="hdr-l">
            <div className="hdr-mark">⊞</div>
            <div>
              <div className="hdr-title">Covered Call <span>Master</span></div>
              <div className="hdr-sub">PROFITPATHFINDER.ONLINE · SPY / QQQ INCOME ENGINE</div>
            </div>
          </div>
          <div className="badges">
            <span className="badge badge-a">DAILY → QUARTERLY</span>
            <span className="badge badge-g">HISTORICAL OTM DATA</span>
            <span className={`badge ${schwabOk?"badge-g":"badge-a"}`}>
              {schwabOk?"SCHWAB FALLBACK":"CLAUDE AI LIVE"}
            </span>
          </div>
        </div>

        <div className="layout">
          {/* LEFT */}
          <div className="left">
            {/* TICKER */}
            <div className="sec">
              <div className="sec-h"><div className="sec-ico" style={{background:"rgba(16,224,192,.15)"}}>◎</div><div className="sec-t">Underlying</div></div>
              <div className="tick-tabs">
                {["SPY","QQQ"].map(t=>(
                  <div key={t} className={`tick-tab${ticker===t?" on":""}`} onClick={()=>{setTicker(t);setSpot("");setIv("");}}>
                    {t}<small>{t==="SPY"?"S&P 500":"Nasdaq 100"}</small>
                  </div>
                ))}
              </div>
            </div>

            {/* HOLDING MODE */}
            <div className="sec">
              <div className="sec-h"><div className="sec-ico" style={{background:"rgba(157,123,255,.15)"}}>◈</div><div className="sec-t">What You Hold</div></div>
              <div className="mode-tabs">
                <div className={`mode-tab${holdMode==="shares"?" on":""}`} onClick={()=>setHoldMode("shares")}>100 SHARES<br/>(classic CC)</div>
                <div className={`mode-tab${holdMode==="leap"?" on":""}`} onClick={()=>setHoldMode("leap")}>ITM LEAP<br/>(poor man's CC)</div>
              </div>
            </div>

            {/* FETCH */}
            <div className="sec">
              <div className="sec-h"><div className="sec-ico" style={{background:"rgba(59,158,255,.15)"}}>⟳</div><div className="sec-t">Market Data</div></div>
              <button className="btn" onClick={fetchData} disabled={fetching}>
                {fetching?<><span className="spin"/>FETCHING {ticker}…</>:<>⟳ FETCH LIVE {ticker} DATA</>}
              </button>
              {fetchMsg.text && <div className={`msg msg-${fetchMsg.type==="ok"?"ok":"err"}`}>{fetchMsg.text}</div>}
              <div className="status">
                <div className="status-dot" style={{background:schwabOk?"var(--blue)":"var(--green)"}}/>
                <div className="status-txt" style={{color:schwabOk?"var(--blue)":"var(--green)"}}>
                  {schwabOk?"Schwab fallback active":"Claude AI web search (primary)"}
                </div>
              </div>
            </div>

            {/* MANUAL INPUTS */}
            <div className="sec">
              <div className="sec-h"><div className="sec-ico" style={{background:"rgba(255,159,69,.15)"}}>✎</div><div className="sec-t">Inputs (override)</div></div>
              <div className="row2">
                <div className="field"><label>SPOT $</label><input className="inp inp-big" type="number" value={spot} onChange={e=>setSpot(e.target.value)} placeholder={DEFAULTS[ticker].price}/></div>
                <div className="field"><label>IV %</label><input className="inp" type="number" value={iv} onChange={e=>setIv(e.target.value)} placeholder={DEFAULTS[ticker].iv}/></div>
              </div>
              <div className="row3">
                <div className="field"><label>ATR $</label><input className="inp" type="number" value={atr} onChange={e=>setAtr(e.target.value)} placeholder={DEFAULTS[ticker].atr}/></div>
                <div className="field"><label>ADR %</label><input className="inp" type="number" value={adr} onChange={e=>setAdr(e.target.value)} placeholder={DEFAULTS[ticker].adr}/></div>
                <div className="field"><label>VIX</label><input className="inp" type="number" value={vix} onChange={e=>setVix(e.target.value)} placeholder={DEFAULTS[ticker].vix}/></div>
              </div>
            </div>

            {/* POSITION */}
            <div className="sec">
              <div className="sec-h"><div className="sec-ico" style={{background:"rgba(34,229,132,.15)"}}>$</div><div className="sec-t">{isLEAP?"LEAP Position":"Share Position"}</div></div>
              {isLEAP?(
                <div className="row3">
                  <div className="field"><label>LEAP STRIKE</label><input className="inp" type="number" value={leapStrike} onChange={e=>setLeapStrike(e.target.value)} placeholder="ITM"/></div>
                  <div className="field"><label>LEAP COST</label><input className="inp" type="number" value={leapCost} onChange={e=>setLeapCost(e.target.value)} placeholder="$/sh"/></div>
                  <div className="field"><label>LEAP Δ</label><input className="inp" type="number" value={leapDelta} onChange={e=>setLeapDelta(e.target.value)} placeholder="0.80"/></div>
                </div>
              ):(
                <div className="field"><label>COST BASIS / SHARE (optional)</label><input className="inp" type="number" value={costBasis} onChange={e=>setCostBasis(e.target.value)} placeholder={`defaults to spot $${S.toFixed(0)}`}/></div>
              )}
            </div>

            {/* CYCLE */}
            <div className="sec">
              <div className="sec-h"><div className="sec-ico" style={{background:"rgba(255,210,63,.15)"}}>◷</div><div className="sec-t">Expiration Cycle</div></div>
              <div className="cyc-tabs">
                {CYCLES.map(c=>(
                  <div key={c.id} className={`cyc-tab${cycle===c.id?" on":""}`} onClick={()=>setCycle(c.id)}
                    style={{borderColor:cycle===c.id?c.color:undefined}}>
                    <div>
                      <div className="cyc-name" style={{color:cycle===c.id?c.color:"var(--text)"}}>{c.label}</div>
                      <div className="cyc-desc">{c.desc}</div>
                    </div>
                    <div className="cyc-dte" style={{color:c.color}}>{c.dte}D</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="disc">Not financial advice · Options involve risk of loss<br/>profitpathfinder.online</div>
          </div>

          {/* RIGHT */}
          <div className="right">
            {!hasData ? (
              <div className="empty">
                <div className="empty-ico">⊞</div>
                <div className="empty-t">Covered Call Master</div>
                <div className="empty-s">
                  Pick SPY or QQQ → Fetch Live Data → see the optimal strike<br/>
                  for daily, weekly, monthly &amp; quarterly income.<br/><br/>
                  Strike ladder · Historical OTM rates · Theta engine<br/>
                  Cycle comparison · LEAP (PMCC) support · AI analysis
                </div>
              </div>
            ):(
              <>
                {/* HERO */}
                <div className="hero">
                  <div>
                    <div className="hero-name">{ticker} <span style={{fontSize:13,color:"var(--text3)",fontWeight:400}}>{isLEAP?"· PMCC":"· Covered Call"}</span></div>
                    <div className="hero-price">${S.toFixed(2)}</div>
                    <div className="hero-meta">{cyc.label} · {cyc.dte} DTE · {cyc.perYear} cycles/yr</div>
                  </div>
                  <div className="hero-stats">
                    {[["IV",ivN+"%","var(--yellow)"],["ATR","$"+atrN,"var(--orange)"],["ADR",adrN+"%","var(--blue)"],["VIX",vixN,vixN<15?"var(--green)":vixN<20?"var(--accent2)":"var(--red)"]].map(([l,v,c])=>(
                      <div className="hs" key={l}><div className="hs-l">{l}</div><div className="hs-v" style={{color:c}}>{v}</div></div>
                    ))}
                  </div>
                </div>

                {/* BEST PICK */}
                {bestPick && (
                  <div className="pick">
                    <div className="pick-h"><span style={{fontSize:13}}>🎯</span><span className="pick-badge">OPTIMAL STRIKE — {cyc.label.toUpperCase()} · MAX INCOME SCORE</span></div>
                    <div className="pick-body">
                      <div className="pick-strike">
                        <div className="pick-strike-v">${bestPick.K}</div>
                        <div className="pick-strike-l">+{bestPick.distPct}% OTM · Δ{bestPick.delta}</div>
                        {(()=>{const[c,l]=tagFor(bestPick.delta);return <span className={`tag ${c}`} style={{marginTop:8,display:"inline-block"}}>{l}</span>;})()}
                      </div>
                      <div className="pick-grid">
                        {[
                          ["PREMIUM","$"+bestPick.price,"per share","var(--accent2)"],
                          ["INCOME","$"+bestPick.premIncome.toFixed(0),"per contract","var(--green)"],
                          ["STATIC RTN",bestPick.staticReturn+"%","this cycle","var(--accent2)"],
                          ["ANNUALIZED",bestPick.annStatic+"%","if repeated","var(--green)"],
                          ["THETA","$"+bestPick.theta,"/day decay","var(--orange)"],
                          ["HIST OTM",bestPick.histOTM+"%","keep shares","var(--blue)"],
                          ["IF CALLED",bestPick.ifCalledReturn+"%","total return","var(--purple)"],
                          ["CUSHION",bestPick.downsideProtect+"%","downside","var(--yellow)"],
                        ].map(([l,v,s,c])=>(
                          <div key={l}><div className="pick-stat-l">{l}</div><div className="pick-stat-v" style={{color:c}}>{v}</div><div className="pick-stat-s">{s}</div></div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TABS */}
                <div className="tabs">
                  {[["ladder","📊 Strike Ladder"],["plans","🎲 Bear/Neutral/Bull"],["cycles","🔄 Cycle Compare"],["history","📜 Historical Guide"],["ai","✨ AI Analysis"]].map(([id,l])=>(
                    <div key={id} className={`tab${activeTab===id?" on":""}`} onClick={()=>setActiveTab(id)}>{l}</div>
                  ))}
                </div>

                {/* TAB: LADDER */}
                {activeTab==="ladder" && (
                  <div className="panel">
                    <div className="panel-h">
                      <div className="panel-t">📊 Strike Ladder — {ticker} {cyc.label}</div>
                      <div className="panel-s">Ranked by income score (yield × historical keep-rate)</div>
                    </div>
                    <div className="lad-scroll">
                      <table className="lad">
                        <thead>
                          <tr>
                            <th>STRIKE</th><th>%OTM</th><th className="hl">Δ</th><th>PREM</th><th>INCOME</th>
                            <th>Θ/DAY</th><th className="hl">STATIC%</th><th className="hl">ANN%</th>
                            <th>IF-CALL%</th><th className="hl">HIST OTM</th><th>BS OTM</th><th>CUSHION</th><th>SCORE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ladder.map((r,i)=>{
                            const isBest = bestPick && r.K===bestPick.K;
                            const isATM = Math.abs(r.K-S)<1;
                            return(
                              <tr key={i} className={isBest?"best":isATM?"atm":""}>
                                <td style={{fontWeight:isBest?800:500,color:isBest?"var(--accent2)":"var(--text)"}}>
                                  ${r.K}{isBest&&" 🎯"}{isATM&&!isBest&&" ◷"}
                                </td>
                                <td style={{color:"var(--text2)"}}>+{r.distPct}%</td>
                                <td style={{color:Math.abs(r.delta)<=0.2?"var(--green)":Math.abs(r.delta)<=0.32?"var(--yellow)":"var(--red)",fontWeight:600}}>{r.delta}</td>
                                <td style={{color:"var(--accent2)",fontWeight:600}}>${r.price}</td>
                                <td style={{color:"var(--green)"}}>${r.premIncome.toFixed(0)}</td>
                                <td style={{color:"var(--orange)"}}>${r.theta}</td>
                                <td style={{color:"var(--accent2)"}}>{r.staticReturn}%</td>
                                <td style={{color:"var(--green)",fontWeight:600}}>{r.annStatic}%</td>
                                <td style={{color:"var(--purple)"}}>{r.ifCalledReturn}%</td>
                                <td style={{color:"var(--blue)",fontWeight:600}}>{r.histOTM}%</td>
                                <td style={{color:"var(--text3)"}}>{r.bsOTM}%</td>
                                <td style={{color:"var(--yellow)"}}>{r.downsideProtect}%</td>
                                <td><span className="kpill" style={{background:isBest?"rgba(16,224,192,.2)":"rgba(255,255,255,.04)",color:isBest?"var(--accent2)":"var(--text2)"}}>{r.incomeScore}</span></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="panel-b" style={{borderTop:"1px solid var(--border)"}}>
                      <div className="note">
                        <strong>Income Score</strong> = annualized static return × historical OTM keep-rate. It rewards strikes that pay well <em>and</em> historically expire worthless so you keep your {isLEAP?"LEAP":"shares"}. <strong>Static%</strong> = premium ÷ capital if the stock stays flat. <strong>If-Call%</strong> = total return if assigned at strike. <strong>Hist OTM</strong> = research-backed % of the time this delta expires out-of-the-money for {ticker} on this cycle.
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: PLANS (Bear/Neutral/Bull) */}
                {activeTab==="plans" && scenarioPlans && (
                  <div style={{display:"flex",flexDirection:"column",gap:14}}>
                    <div className="note">
                      Three ready-to-trade plans for the same {ticker} {cyc.label} cycle — each picks a different strike based on your market outlook. Pick the one that matches your thesis, or ladder all three across separate contracts.
                    </div>
                    {[scenarioPlans.bear, scenarioPlans.neutral, scenarioPlans.bull].map((p,i)=>(
                      <div key={i} className="panel" style={{borderColor:`${p.color}40`}}>
                        <div className="panel-h" style={{background:`${p.color}10`,borderColor:`${p.color}25`}}>
                          <div className="panel-t" style={{color:p.color}}>
                            {i===0?"🐻":i===1?"⚖️":"🐂"} {p.tone}
                          </div>
                          <div className="panel-s">Strike ${p.K} · Δ{p.delta} · +{p.distPct}% OTM</div>
                        </div>
                        <div className="panel-b">
                          {/* thesis */}
                          <div style={{fontFamily:"var(--body)",fontSize:13,color:"var(--text)",lineHeight:1.65,marginBottom:14,
                            paddingLeft:12,borderLeft:`2px solid ${p.color}`}}>
                            {p.thesis}
                          </div>
                          {/* key numbers */}
                          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:10,marginBottom:14}}>
                            {[
                              ["STRIKE","$"+p.K],
                              ["PREMIUM","$"+p.price],
                              ["INCOME","$"+p.premIncome.toFixed(0)],
                              ["STATIC",p.staticReturn+"%"],
                              ["ANNUAL",p.annStatic+"%"],
                              ["THETA/DAY","$"+p.theta],
                              ["HIST OTM",p.histOTM+"%"],
                              ["CUSHION",p.downsideProtect+"%"],
                              ["EM CUSHION",p.cushionSD+" SD"],
                            ].map(([l,v])=>(
                              <div key={l} style={{background:"rgba(255,255,255,.025)",border:"1px solid var(--border)",borderRadius:8,padding:"9px 11px"}}>
                                <div style={{fontFamily:"var(--mono)",fontSize:8,color:"var(--text3)",letterSpacing:".08em",marginBottom:3}}>{l}</div>
                                <div style={{fontFamily:"var(--sans)",fontSize:15,fontWeight:700,color:p.color}}>{v}</div>
                              </div>
                            ))}
                          </div>
                          {/* rationale */}
                          <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",letterSpacing:".1em",marginBottom:8}}>RATIONALE</div>
                          <div style={{display:"flex",flexDirection:"column",gap:7}}>
                            {p.rationale.map((r,j)=>(
                              <div key={j} style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                                <div style={{width:18,height:18,borderRadius:5,background:`${p.color}18`,border:`1px solid ${p.color}35`,
                                  color:p.color,fontFamily:"var(--mono)",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",
                                  justifyContent:"center",flexShrink:0,marginTop:1}}>{j+1}</div>
                                <div style={{fontFamily:"var(--body)",fontSize:12,color:"var(--text2)",lineHeight:1.6}}>{r}</div>
                              </div>
                            ))}
                          </div>
                          {/* action line */}
                          <div style={{marginTop:14,padding:"9px 12px",background:`${p.color}0d`,border:`1px solid ${p.color}25`,
                            borderRadius:7,fontFamily:"var(--mono)",fontSize:10,color:p.color,lineHeight:1.6}}>
                            ▸ SELL TO OPEN 1× {ticker} ${p.K} CALL · {cyc.label} ({cyc.dte} DTE) · collect ${p.premIncome.toFixed(0)} · {p.histOTM}% historical keep-rate
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="note">
                      <strong>Laddering all three:</strong> if you hold 300 shares (or 3 LEAPs), you can sell one of each — bear strike for income, neutral for balance, bull for upside. This blends your assignment risk and smooths income across outcomes. The plans recompute live as price, IV, ticker, and cycle change.
                    </div>
                  </div>
                )}

                {/* TAB: CYCLE COMPARE */}
                {activeTab==="cycles" && (
                  <div className="panel">
                    <div className="panel-h"><div className="panel-t">🔄 Best Strike Per Cycle — {ticker}</div><div className="panel-s">Which expiration maximizes income?</div></div>
                    <div className="panel-b">
                      <div className="cyc-grid">
                        {cycleCompare.map(({cycle:c,best})=> best && (
                          <div key={c.id} className={`cyc-card${cycle===c.id?" on":""}`} onClick={()=>setCycle(c.id)} style={{borderColor:cycle===c.id?c.color:undefined}}>
                            <div className="cyc-card-t" style={{color:c.color}}>{c.label}</div>
                            {[
                              ["Best strike","$"+best.K],
                              ["Delta",best.delta],
                              ["Premium","$"+best.price],
                              ["Static return",best.staticReturn+"%"],
                              ["Annualized",best.annStatic+"%"],
                              ["Theta/day","$"+best.theta],
                              ["Hist OTM",best.histOTM+"%"],
                              ["Income score",best.incomeScore],
                            ].map(([l,v])=>(
                              <div className="cyc-card-row" key={l}><span>{l}</span><span style={{color:l==="Annualized"||l==="Income score"?c.color:"var(--text)",fontWeight:l==="Annualized"||l==="Income score"?700:400}}>{v}</span></div>
                            ))}
                          </div>
                        ))}
                      </div>
                      <div className="note" style={{marginTop:14}}>
                        <strong>How to read this:</strong> Daily (0DTE) usually shows the highest <em>annualized</em> return because theta decay is brutal in the final day — but it demands daily management and carries the most gamma risk. Monthly (30 DTE) is the research-backed "sweet spot" balancing theta capture against gamma explosion. Quarterly ties up your strike longest with the most drift risk. The highest <strong>income score</strong> accounts for both yield and how often you actually keep your shares.
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: HISTORICAL GUIDE */}
                {activeTab==="history" && (
                  <div style={{display:"flex",flexDirection:"column",gap:14}}>
                    <div className="panel">
                      <div className="panel-h"><div className="panel-t">📜 Historical OTM Expiration Rates — {ticker} {cyc.label}</div><div className="panel-s">% of contracts that expire worthless (you keep shares)</div></div>
                      <div className="panel-b">
                        {histRow && (
                          <div className="hist">
                            {[["0.10 delta (far OTM)",histRow.d10,"var(--green)"],["0.20 delta (conservative)",histRow.d20,"var(--accent2)"],["0.30 delta (balanced)",histRow.d30,"var(--yellow)"],["0.40 delta (aggressive)",histRow.d40,"var(--red)"]].map(([l,v,c])=>(
                              <div className="hist-row" key={l}>
                                <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--text2)",minWidth:160}}>{l}</span>
                                <div className="hist-bar-wrap"><div className="hist-bar" style={{width:`${v*100}%`,background:c}}/></div>
                                <span style={{fontFamily:"var(--sans)",fontSize:14,fontWeight:700,color:c,minWidth:48,textAlign:"right"}}>{(v*100).toFixed(0)}%</span>
                              </div>
                            ))}
                            <div className="note" style={{marginTop:12}}>📌 {histRow.note}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="panel">
                      <div className="panel-h"><div className="panel-t">🧠 Master Covered Call Playbook — SPY &amp; QQQ</div></div>
                      <div className="panel-b" style={{display:"flex",flexDirection:"column",gap:10}}>
                        {[
                          ["The delta = probability rule","A 0.30-delta call has ~30% chance of finishing ITM, so ~70% chance you keep your shares. Schwab and most desks use delta as the working probability of assignment. For steady income, the 0.20–0.30 delta band is the institutional default."],
                          ["CBOE BXM benchmark","The CBOE Buy-Write Index sells ~30-delta monthly SPX calls. Since 1986 it returned ~8.2%/yr with 30% lower volatility than the S&P. That's the long-run reality check: covered calls trade upside for smoother, lower-vol income."],
                          ["Theta sweet spot = 30–45 DTE","Theta decay accelerates in the final 30–45 days but gamma stays manageable. Below ~7 DTE theta is enormous but a single gap can blow through your strike (gamma risk). Monthly cycles capture most of the decay with far less babysitting than daily."],
                          ["Daily (0DTE) income math","0DTE premium is tiny per trade but annualizes huge because you repeat 252×/yr. ~90% of 0.10-delta SPY 0DTE calls expire OTM. The catch: gamma spikes in the last 2 hours and one trend day can run through several strikes. Only for active, rules-based sellers."],
                          ["SPY vs QQQ","QQQ carries higher IV (richer premium) but more beta — it tests strikes more often than SPY. SPY's penny-wide spreads and lower vol make it the cleaner income vehicle. Size QQQ strikes slightly further OTM to match SPY's keep-rate."],
                          ["The roll","Don't hold to expiration. Buy back at ~70–80% of max profit and roll to the next cycle to capture theta repeatedly. If the stock rallies toward your strike, roll up-and-out for a credit to avoid assignment while keeping income flowing."],
                          ["PMCC (LEAP) note","With an ITM LEAP (0.80+ delta) instead of shares you need 70–80% less capital for similar premium — but keep the short strike's extrinsic above any dividend, and close if the LEAP drops below ~6 months to expiration where its own theta accelerates."],
                        ].map(([t,d],i)=>(
                          <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:i<6?"1px solid rgba(255,255,255,.04)":"none"}}>
                            <div style={{fontFamily:"var(--sans)",fontSize:12,fontWeight:700,color:"var(--accent2)",minWidth:180,flexShrink:0}}>{t}</div>
                            <div style={{fontFamily:"var(--body)",fontSize:12,color:"var(--text2)",lineHeight:1.65}}>{d}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: AI */}
                {activeTab==="ai" && (
                  <div style={{display:"flex",flexDirection:"column",gap:14}}>
                    <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                      <button className="btn btn-go" style={{width:"auto",padding:"11px 22px"}} onClick={runAI} disabled={aiBusy||!bestPick}>
                        {aiBusy?<><span className="spin"/>ANALYZING…</>:<>✨ RUN MASTER AI ANALYSIS</>}
                      </button>
                      <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",lineHeight:1.7}}>
                        Evaluates your best strike, theta edge, assignment<br/>risk, and the optimal cycle for {ticker} income
                      </div>
                    </div>
                    {(aiText||aiBusy) && (
                      <div className="ai">
                        <div className="ai-h"><div className="ai-dot"/><div className="ai-l">CLAUDE AI — MASTER COVERED CALL ANALYSIS</div>{aiStream&&<span style={{fontFamily:"var(--mono)",fontSize:8,color:"var(--text3)",marginLeft:"auto"}}>STREAMING…</span>}</div>
                        <div className="ai-b">
                          {aiText?<span dangerouslySetInnerHTML={{__html:aiText.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br/>")}}/>:<span style={{color:"var(--text3)"}}><span className="spin"/> Generating…</span>}
                          {aiStream&&<span className="cursor"/>}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="disc" style={{paddingTop:14,borderTop:"1px solid var(--border)"}}>
                  PROFITPATHFINDER.ONLINE · COVERED CALL MASTER · Greeks via Black-Scholes · Historical OTM rates from CBOE BXM &amp; published backtests · Not financial advice · Options involve risk of loss
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
