// @ts-nocheck
import { useState, useCallback, useRef, useEffect } from "react";

// Edge function endpoint for AI calls (Anthropic primary, OpenAI fallback)
const IV_AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/iv-ai`;
const IV_AI_HEADERS = {
  "Content-Type": "application/json",
  apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
};

// ─── CONFIG — swap this to your Supabase project URL ─────────────────────────
// Once your Edge Functions are deployed, set this to:
//   https://<your-project-ref>.supabase.co/functions/v1
// Leave as empty string to use Claude AI web search fallback
const PROXY_BASE = "";  // e.g. "https://xyzabc.supabase.co/functions/v1/schwab-proxy"

// ─── BLACK-SCHOLES (pure JS fallback when live Greeks not available) ──────────
function normCDF(x) {
  const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;
  const sign=x<0?-1:1, t=1/(1+p*Math.abs(x)/Math.sqrt(2));
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
  const Nd1c=normCDF(d1),Nd2c=normCDF(d2),Nd1p=normCDF(-d1),Nd2p=normCDF(-d2),nd1=normPDF(d1);
  const price=type==="call"?S*Nd1c-K*df*Nd2c:K*df*Nd2p-S*Nd1p;
  const delta=type==="call"?Nd1c:Nd1p-1;
  const gamma=nd1/(S*sigma*sqrtT);
  const theta=(-(S*nd1*sigma)/(2*sqrtT)-r*K*df*(type==="call"?Nd2c:Nd2p))/365;
  const vega=S*nd1*sqrtT/100;
  const rho=type==="call"?K*T*df*Nd2c/100:-K*T*df*Nd2p/100;
  const intrinsic=Math.max(0,type==="call"?S-K:K-S);
  const extrinsic=Math.max(0,price-intrinsic);
  return{price:+price.toFixed(2),delta:+delta.toFixed(4),gamma:+gamma.toFixed(6),
    theta:+theta.toFixed(4),vega:+vega.toFixed(4),rho:+rho.toFixed(4),
    intrinsic:+intrinsic.toFixed(2),extrinsic:+extrinsic.toFixed(2),
    breakeven:type==="call"?+(K+price).toFixed(2):+(K-price).toFixed(2)};
}

// ─── POP CALCULATION ──────────────────────────────────────────────────────────
function calcPOP(delta, iv, vix, intradayRangePct, distFromSupportPct, type, side) {
  const absDelta = Math.abs(delta||0);
  // Base: delta as ITM probability proxy (Schwab/TOS standard)
  let pop = side==="long"
    ? (type==="call" ? absDelta : 1-absDelta)
    : (type==="call" ? 1-absDelta : absDelta);

  // IV adjustment — elevated IV widens distribution
  const ivN = (iv||20)/100;
  const ivAdj = ivN > 0.35 ? 0.04 : ivN < 0.15 ? -0.03 : 0;
  pop += side==="short" ? ivAdj : -ivAdj;

  // VIX regime adjustment
  const vixN = vix||20;
  const vixAdj = vixN > 30 ? -0.04 : vixN < 15 ? 0.02 : 0;
  pop += vixAdj;

  // Intraday move adjustment — if stock already moved >60% of EM, momentum favor
  if(intradayRangePct > 0.6 && side==="long") pop += 0.03;
  if(intradayRangePct > 0.6 && side==="short") pop -= 0.03;

  // Support/resistance proximity (tighter = harder to break through for OTM)
  if(distFromSupportPct !== null) {
    if(distFromSupportPct < 0.02) pop += side==="short" ? 0.03 : -0.02;
  }

  return Math.min(0.97, Math.max(0.03, pop));
}

function popLabel(pop){
  if(pop>=0.75)return{label:"HIGH",color:"var(--green)"};
  if(pop>=0.55)return{label:"MOD",color:"var(--yellow)"};
  if(pop>=0.35)return{label:"LOW",color:"var(--orange)"};
  return{label:"POOR",color:"var(--red)"};
}

// ─── EXPECTED MOVE MATH ───────────────────────────────────────────────────────
const RF=0.053;
function emHourly(P,v){return P*(v/100)*Math.sqrt(1/1638);}
function emDaily(P,v) {return P*(v/100)*Math.sqrt(1/252);}
function emWeekly(P,v){return P*(v/100)*Math.sqrt(5/252);}
function emCal(P,v,d) {return P*(v/100)*Math.sqrt(d/365);}
function ivRankCalc(cur,lo,hi){
  if(!lo||!hi||hi===lo)return 50;
  return Math.round(((cur-lo)/(hi-lo))*100);
}
function ivSignal(iv,hv){
  if(!hv||hv<=0)return{label:"—",cls:"sig-na"};
  const r=iv/hv;
  if(r>1.25)return{label:"IV RICH",cls:"sig-rich"};
  if(r<0.80)return{label:"IV CHEAP",cls:"sig-cheap"};
  return{label:"FAIR",cls:"sig-fair"};
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#050810;--bg1:#090D1A;--bg2:#0D1220;--bg3:#111827;
  --border:#1a2340;--border2:#212d45;
  --accent:#00D4FF;--green:#00E5A0;--red:#FF4560;--yellow:#FFB800;
  --purple:#A855F7;--orange:#F97316;
  --text:#E2EAF4;--text2:#7A90B0;--text3:#3D5070;
  --mono:'DM Mono',monospace;--sans:'Syne',sans-serif;
}
body{background:var(--bg);color:var(--text);font-family:var(--sans)}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}

.root{min-height:100vh;background:var(--bg);display:flex;flex-direction:column}
.hdr{display:flex;align-items:center;justify-content:space-between;padding:11px 20px;
  background:var(--bg1);border-bottom:1px solid var(--border);
  position:sticky;top:0;z-index:100;gap:10px;flex-wrap:wrap}
.hdr-left{display:flex;align-items:center;gap:10px}
.brand-dot{width:7px;height:7px;border-radius:50%;background:var(--accent);
  box-shadow:0 0 10px var(--accent);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.brand-sub{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.2em}
.brand-title{font-size:15px;font-weight:800;color:var(--text)}
.brand-title span{color:var(--accent)}
.badges{display:flex;gap:5px;flex-wrap:wrap}
.badge{font-family:var(--mono);font-size:8px;letter-spacing:.1em;padding:2px 8px;
  border-radius:3px;border:1px solid}
.badge-b{color:var(--accent);background:rgba(0,212,255,.07);border-color:rgba(0,212,255,.18)}
.badge-g{color:var(--green);background:rgba(0,229,160,.06);border-color:rgba(0,229,160,.18)}
.badge-o{color:var(--orange);background:rgba(249,115,22,.07);border-color:rgba(249,115,22,.2)}
.layout{display:grid;grid-template-columns:295px 1fr;min-height:calc(100vh - 48px)}
/* LEFT */
.left{background:var(--bg1);border-right:1px solid var(--border);padding:16px;
  overflow-y:auto;display:flex;flex-direction:column;gap:12px}
.sec-title{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.18em;
  padding-bottom:5px;border-bottom:1px solid var(--border)}
.field{display:flex;flex-direction:column;gap:3px}
.field label{font-family:var(--mono);font-size:8px;color:var(--text2);letter-spacing:.08em}
.field input,.field select{background:var(--bg2);border:1px solid var(--border2);color:var(--text);
  font-family:var(--mono);font-size:12px;padding:7px 9px;border-radius:6px;
  outline:none;width:100%;transition:border-color .15s}
.field input:focus,.field select:focus{border-color:var(--accent)}
.field input::placeholder{color:var(--text3)}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px}
.mode-tabs{display:flex;gap:3px}
.mtab{flex:1;padding:6px 3px;border-radius:5px;border:1px solid var(--border2);
  background:var(--bg2);color:var(--text2);cursor:pointer;font-family:var(--mono);
  font-size:10px;font-weight:500;letter-spacing:.05em;transition:all .15s;text-align:center}
.mtab.on{background:rgba(0,212,255,.1);border-color:var(--accent);color:var(--accent)}
.btn-fetch{width:100%;padding:9px;border-radius:6px;border:1px solid rgba(0,212,255,.3);
  background:rgba(0,212,255,.09);color:var(--accent);font-family:var(--mono);
  font-size:10px;font-weight:500;letter-spacing:.08em;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:6px;transition:all .15s}
.btn-fetch:hover{background:rgba(0,212,255,.16)}
.btn-fetch:disabled{opacity:.4;cursor:not-allowed}
.btn-analyze{width:100%;padding:11px;border-radius:7px;
  border:1px solid rgba(0,212,255,.4);
  background:linear-gradient(135deg,rgba(0,212,255,.16),rgba(0,153,187,.1));
  color:var(--accent);font-family:var(--sans);font-size:13px;font-weight:700;
  letter-spacing:.02em;cursor:pointer;transition:all .2s}
.btn-analyze:disabled{opacity:.4;cursor:not-allowed}
.iv-rank-wrap{background:var(--bg2);border:1px solid var(--border);border-radius:7px;padding:9px 11px}
.iv-rank-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px}
.iv-rank-bar{height:4px;border-radius:2px;background:var(--bg3);overflow:hidden}
.iv-rank-fill{height:100%;border-radius:2px;transition:width .4s}
.notice{background:rgba(255,184,0,.05);border:1px solid rgba(255,184,0,.18);border-radius:5px;
  padding:7px 9px;font-family:var(--mono);font-size:9px;color:var(--yellow);line-height:1.7}
.msg-ok{background:rgba(0,229,160,.06);border:1px solid rgba(0,229,160,.18);border-radius:5px;
  padding:7px 9px;font-family:var(--mono);font-size:9px;color:var(--green);line-height:1.6}
.msg-err{background:rgba(255,69,96,.06);border:1px solid rgba(255,69,96,.18);border-radius:5px;
  padding:7px 9px;font-family:var(--mono);font-size:9px;color:var(--red);line-height:1.6}
.schwab-status{display:flex;align-items:center;gap:6px;padding:7px 10px;
  background:var(--bg2);border:1px solid var(--border);border-radius:6px}
.schwab-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.schwab-label{font-family:var(--mono);font-size:9px}
/* RIGHT */
.right{background:var(--bg);padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:16px}
.empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:10px;opacity:.35;text-align:center;padding:60px 20px}
.empty-icon{font-size:42px}
.empty-title{font-size:17px;font-weight:700;color:var(--text2)}
.empty-sub{font-family:var(--mono);font-size:10px;color:var(--text3);line-height:1.8}
.shdr{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.shdr-line{flex:1;height:1px;background:var(--border)}
.shdr-text{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.16em;white-space:nowrap}
/* HERO */
.hero{display:flex;align-items:flex-start;justify-content:space-between;
  background:var(--bg1);border:1px solid var(--border);border-radius:10px;
  padding:14px 18px;gap:12px;flex-wrap:wrap}
.hero-name{font-size:24px;font-weight:800;color:var(--text);letter-spacing:-.02em}
.hero-price{font-family:var(--mono);font-size:19px;font-weight:500;color:var(--accent)}
.hero-meta{font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:2px}
.hero-stats{display:flex;gap:16px;align-items:flex-end;flex-wrap:wrap}
.hstat-label{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.08em;margin-bottom:2px}
.hstat-val{font-family:var(--mono);font-size:12px;font-weight:500;text-align:right}
/* VIX BANNER */
.vix-banner{display:flex;align-items:center;gap:16px;padding:10px 16px;
  background:var(--bg1);border:1px solid var(--border);border-radius:8px;flex-wrap:wrap}
.vix-val{font-family:var(--mono);font-size:20px;font-weight:700}
.vix-regime{font-family:var(--mono);font-size:10px;letter-spacing:.12em;
  padding:3px 9px;border-radius:4px;font-weight:700}
.vix-sr{display:flex;gap:16px;margin-left:auto;flex-wrap:wrap}
.sr-item{text-align:right}
.sr-label{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.08em}
.sr-val{font-family:var(--mono);font-size:12px;font-weight:600}
/* EM TABLE */
.em-wrap{background:var(--bg1);border:1px solid var(--border);border-radius:10px;overflow:hidden}
.em-head{padding:11px 16px;background:rgba(0,212,255,.03);border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:7px}
.em-head-title{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.16em}
.em-table{width:100%;border-collapse:collapse}
.em-table th{font-family:var(--mono);font-size:7.5px;color:var(--text3);letter-spacing:.1em;
  text-align:left;padding:6px 12px;border-bottom:1px solid var(--border);font-weight:500;white-space:nowrap}
.em-table th.r{text-align:right}
.em-table td{padding:7px 12px;border-bottom:1px solid rgba(26,35,64,.4);vertical-align:middle}
.em-table tr:last-child td{border-bottom:none}
.em-table tr:hover td{background:rgba(255,255,255,.01)}
.em-period{font-family:var(--mono);font-size:11px;font-weight:600;color:var(--text);white-space:nowrap}
.em-sub{font-family:var(--mono);font-size:8px;color:var(--text3);margin-top:1px}
.em-val{font-family:var(--mono);font-size:11px;font-weight:500;text-align:right;white-space:nowrap}
.em-range{font-family:var(--mono);font-size:9px;color:var(--text2);text-align:right;
  white-space:nowrap;line-height:1.5}
.em-bar-outer{height:4px;border-radius:2px;background:var(--bg3);position:relative;min-width:50px}
.em-bar-iv{height:100%;border-radius:2px;position:absolute;top:0;left:0;background:var(--accent)}
.em-bar-hv{height:3px;border-radius:1px;position:absolute;top:.5px;left:0;background:var(--green);opacity:.55}
.sig{font-family:var(--mono);font-size:8px;font-weight:600;padding:2px 6px;border-radius:3px;white-space:nowrap}
.sig-rich{background:rgba(255,69,96,.1);color:var(--red);border:1px solid rgba(255,69,96,.22)}
.sig-cheap{background:rgba(0,229,160,.08);color:var(--green);border:1px solid rgba(0,229,160,.22)}
.sig-fair{background:rgba(0,212,255,.07);color:var(--accent);border:1px solid rgba(0,212,255,.18)}
.sig-na{background:rgba(61,80,112,.1);color:var(--text3);border:1px solid rgba(61,80,112,.18)}
.em-footer{padding:10px 16px;border-top:1px solid var(--border);background:rgba(0,0,0,.12);
  display:flex;gap:14px;flex-wrap:wrap;align-items:center}
.em-leg{display:flex;align-items:center;gap:4px;font-family:var(--mono);font-size:8px;color:var(--text3)}
.em-leg-dot{width:9px;height:3px;border-radius:1px}
/* OPTION CHAIN */
.chain-wrap{background:var(--bg1);border:1px solid var(--border);border-radius:10px;overflow:hidden}
.chain-head{padding:12px 16px;background:rgba(0,229,160,.03);border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
.chain-filters{display:flex;gap:6px;flex-wrap:wrap;padding:10px 16px;border-bottom:1px solid var(--border);
  background:rgba(0,0,0,.1)}
.chain-filter-btn{font-family:var(--mono);font-size:9px;padding:4px 10px;border-radius:4px;
  border:1px solid var(--border2);background:var(--bg2);color:var(--text2);cursor:pointer;transition:all .12s}
.chain-filter-btn.on{background:rgba(0,212,255,.1);border-color:var(--accent);color:var(--accent)}
.chain-table{width:100%;border-collapse:collapse;font-size:10px}
.chain-table th{font-family:var(--mono);font-size:7.5px;color:var(--text3);letter-spacing:.08em;
  text-align:right;padding:5px 8px;border-bottom:1px solid var(--border);font-weight:500;
  white-space:nowrap;position:sticky;top:0;background:var(--bg2);z-index:2}
.chain-table th:first-child{text-align:left}
.chain-table th.highlight-col{color:var(--accent)}
.chain-table td{font-family:var(--mono);font-size:10px;padding:5px 8px;
  border-bottom:1px solid rgba(26,35,64,.3);text-align:right;vertical-align:middle;
  white-space:nowrap}
.chain-table td:first-child{text-align:left}
.chain-table tr:hover td{background:rgba(255,255,255,.015)}
.chain-table tr.itm td{background:rgba(0,212,255,.025)}
.chain-table tr.atm td{background:rgba(0,229,160,.04);font-weight:600}
.chain-scroll{max-height:480px;overflow-y:auto}
.pop-pill{display:inline-flex;align-items:center;gap:3px;font-family:var(--mono);
  font-size:9px;font-weight:700;padding:2px 7px;border-radius:3px;white-space:nowrap}
.pnl-cell{display:flex;flex-direction:column;align-items:flex-end;gap:1px}
.pnl-target{font-family:var(--mono);font-size:9px;color:var(--green)}
.pnl-stop{font-family:var(--mono);font-size:9px;color:var(--red)}
.pnl-be{font-family:var(--mono);font-size:9px;color:var(--accent)}
/* GREEKS */
.greeks-wrap{background:var(--bg1);border:1px solid var(--border);border-radius:10px;overflow:hidden}
.greeks-head{padding:12px 16px;background:rgba(168,85,247,.03);border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
.greeks-inputs{display:grid;grid-template-columns:repeat(auto-fill,minmax(85px,1fr));
  gap:7px;padding:12px 16px;border-bottom:1px solid var(--border)}
.gi-field{display:flex;flex-direction:column;gap:3px}
.gi-label{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.07em}
.gi-input{background:var(--bg2);border:1px solid var(--border2);color:var(--text);
  font-family:var(--mono);font-size:12px;padding:5px 7px;border-radius:5px;outline:none;width:100%}
.gi-input:focus{border-color:var(--purple)}
.type-tabs{display:flex;gap:3px}
.ttab{flex:1;padding:5px;border-radius:4px;border:1px solid var(--border2);background:var(--bg2);
  color:var(--text2);cursor:pointer;font-family:var(--mono);font-size:10px;font-weight:600;
  transition:all .15s;text-align:center}
.ttab.on{background:rgba(168,85,247,.1);border-color:var(--purple);color:var(--purple)}
.greeks-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));
  border-top:1px solid var(--border)}
.gcard{padding:12px 14px;border-right:1px solid var(--border);border-bottom:1px solid var(--border)}
.gcard-label{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.1em;margin-bottom:3px}
.gcard-val{font-family:var(--mono);font-weight:600;margin-bottom:2px}
.gcard-sub{font-family:var(--mono);font-size:8px;color:var(--text3);line-height:1.5}
.gcard-bar{height:3px;border-radius:2px;background:var(--bg3);margin-top:5px;overflow:hidden}
.gcard-bar-fill{height:100%;border-radius:2px}
.gm-wrap{overflow-x:auto;padding:0 16px 12px}
.gm-table{width:100%;border-collapse:collapse;margin-top:8px}
.gm-table th{font-family:var(--mono);font-size:7.5px;color:var(--text3);letter-spacing:.08em;
  text-align:right;padding:4px 7px;border-bottom:1px solid var(--border)}
.gm-table th:first-child{text-align:left}
.gm-table td{font-family:var(--mono);font-size:9.5px;color:var(--text2);
  text-align:right;padding:4px 7px;border-bottom:1px solid rgba(26,35,64,.35)}
.gm-table tr:last-child td{border-bottom:none}
.gm-table tr:hover td{background:rgba(255,255,255,.012)}
.gm-table td:first-child{text-align:left;color:var(--text);font-weight:500}
.gm-table tr.rec td{background:rgba(0,229,160,.04)}
.gm-note{font-family:var(--mono);font-size:7.5px;color:var(--text3);margin-top:5px;text-align:right}
/* AI */
.ai-wrap{background:var(--bg1);border:1px solid var(--border);border-radius:10px;overflow:hidden}
.ai-head{padding:11px 16px;background:rgba(0,212,255,.03);border-bottom:1px solid var(--border);
  display:flex;align-items:center;gap:7px}
.ai-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:pulse 2s infinite}
.ai-lbl{font-family:var(--mono);font-size:9px;color:var(--accent);letter-spacing:.14em}
.ai-body{padding:14px;font-size:12.5px;color:var(--text2);line-height:1.8}
.ai-body strong{color:var(--text);font-weight:700}
/* CHECKLIST */
.chk-list{display:flex;flex-direction:column;gap:4px}
.chk-item{display:flex;align-items:flex-start;gap:8px;background:var(--bg2);
  border:1px solid var(--border);border-radius:5px;padding:7px 10px}
.chk-icon{font-size:11px;flex-shrink:0;margin-top:1px}
.chk-text{font-family:var(--mono);font-size:10px;color:var(--text2);line-height:1.6}
.chk-text strong{color:var(--text)}
/* LOADING */
.spin{width:14px;height:14px;border:2px solid rgba(0,212,255,.2);border-top-color:var(--accent);
  border-radius:50%;animation:spin .7s linear infinite;display:inline-block;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}
.cursor{display:inline-block;width:2px;height:12px;background:var(--accent);margin-left:2px;
  vertical-align:middle;animation:blink .8s step-end infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.disc{font-family:var(--mono);font-size:8.5px;color:var(--text3);text-align:center;padding:5px 0}
`;

// ─── EXPECTED MOVE TABLE ──────────────────────────────────────────────────────
function EMTable({spot,iv,hv}){
  const S=+spot,ivN=+iv,hvN=+hv;
  if(!S||!ivN)return null;
  const sig=ivSignal(ivN,hvN);
  const ratio=hvN>0?(ivN/hvN).toFixed(2):null;
  const rows=[
    {period:"1 Hour",  sub:"Intraday/0DTE",    ivEM:emHourly(S,ivN),hvEM:hvN?emHourly(S,hvN):0},
    {period:"1 Day",   sub:"0DTE/next session", ivEM:emDaily(S,ivN), hvEM:hvN?emDaily(S,hvN):0},
    {period:"1 Week",  sub:"Weekly cycle",      ivEM:emWeekly(S,ivN),hvEM:hvN?emWeekly(S,hvN):0},
    {period:"1 Month", sub:"30-day cycle",      ivEM:emCal(S,ivN,30),hvEM:hvN?emCal(S,hvN,30):0},
    {period:"90 Days", sub:"Quarterly",         ivEM:emCal(S,ivN,90),hvEM:hvN?emCal(S,hvN,90):0},
    {period:"1 Year",  sub:"LEAPS horizon",     ivEM:emCal(S,ivN,365),hvEM:hvN?emCal(S,hvN,365):0},
  ];
  const maxEM=Math.max(...rows.map(r=>Math.max(r.ivEM,r.hvEM||0)));
  return(
    <div className="em-wrap">
      <div className="em-head">
        <div>
          <div className="em-head-title">EXPECTED MOVE — IV vs HV · ALL TIMEFRAMES</div>
          <div style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",marginTop:2}}>
            ±1 SD · sqrt-of-time scaling from annualized vol
          </div>
        </div>
        <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
          {ratio&&<span style={{fontFamily:"var(--mono)",fontSize:"10px",color:"var(--text2)"}}>
            IV/HV:<strong style={{color:+ratio>1.25?"var(--red)":+ratio<.8?"var(--green)":"var(--accent)",marginLeft:4}}>{ratio}×</strong>
          </span>}
          <span className={`sig ${sig.cls}`}>{sig.label}</span>
        </div>
      </div>
      <table className="em-table">
        <thead>
          <tr>
            <th>TIMEFRAME</th>
            <th className="r">IV ±</th>
            {hvN>0&&<th className="r">HV ±</th>}
            <th>BAR</th>
            <th className="r">IV RANGE</th>
            {hvN>0&&<th className="r">HV RANGE</th>}
            <th>SIGNAL</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i)=>{
            const ivW=maxEM>0?(r.ivEM/maxEM)*100:0;
            const hvW=maxEM>0?(r.hvEM/maxEM)*100:0;
            return(
              <tr key={i}>
                <td><div className="em-period">{r.period}</div><div className="em-sub">{r.sub}</div></td>
                <td>
                  <div className="em-val" style={{color:"var(--accent)"}}>±${r.ivEM.toFixed(2)}</div>
                  <div style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",textAlign:"right"}}>{((r.ivEM/S)*100).toFixed(2)}%</div>
                </td>
                {hvN>0&&<td>
                  <div className="em-val" style={{color:"var(--green)"}}>±${r.hvEM.toFixed(2)}</div>
                  <div style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",textAlign:"right"}}>{((r.hvEM/S)*100).toFixed(2)}%</div>
                </td>}
                <td style={{minWidth:60}}>
                  <div className="em-bar-outer">
                    <div className="em-bar-iv" style={{width:`${ivW}%`}}/>
                    {hvN>0&&<div className="em-bar-hv" style={{width:`${hvW}%`}}/>}
                  </div>
                </td>
                <td><div className="em-range">${(S-r.ivEM).toFixed(2)}<br/><span style={{fontSize:"7px",color:"var(--text3)"}}>to</span><br/>${(S+r.ivEM).toFixed(2)}</div></td>
                {hvN>0&&<td><div className="em-range" style={{color:"var(--green)"}}>${(S-r.hvEM).toFixed(2)}<br/><span style={{fontSize:"7px",color:"var(--text3)"}}>to</span><br/>${(S+r.hvEM).toFixed(2)}</div></td>}
                <td><span className={`sig ${sig.cls}`}>{sig.label}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="em-footer">
        <div className="em-leg"><div className="em-leg-dot" style={{background:"var(--accent)"}}/>IV (implied)</div>
        {hvN>0&&<div className="em-leg"><div className="em-leg-dot" style={{background:"var(--green)",opacity:.65}}/>HV (realized)</div>}
        <span style={{marginLeft:"auto",fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)"}}>
          IV {ivN}%{hvN>0?` · HV ${hvN}%`:""}
        </span>
      </div>
      {ratio&&hvN>0&&(
        <div style={{padding:"8px 16px 10px",borderTop:"1px solid var(--border)",
          fontFamily:"var(--mono)",fontSize:"9px",color:"var(--text2)",lineHeight:1.7,
          background:"rgba(0,0,0,.1)"}}>
          <strong style={{color:"var(--text2)"}}>IV/HV: </strong>
          {+ratio>1.25?`IV is pricing ${((+ratio-1)*100).toFixed(0)}% more movement than realized vol — premium is RICH → credit spreads/condors have statistical edge.`
           :+ratio<.8?`IV is pricing ${((1-+ratio)*100).toFixed(0)}% LESS than realized vol — premium CHEAP → long straddles/debit spreads have edge.`
           :`IV and HV are balanced (${ratio}×) — no structural premium bias.`}
        </div>
      )}
    </div>
  );
}

// ─── OPTION CHAIN TABLE ───────────────────────────────────────────────────────
function OptionChainTable({chainData,spot,vix,hv,intradayRange,support,resistance,mode}){
  const [activeType, setActiveType]=useState("call");
  const [activeDTE,  setActiveDTE] =useState("all");
  const [activeRange,setActiveRange]=useState("all"); // all, itm, otm, ntm

  if(!chainData)return null;
  const legs=activeType==="call"?chainData.calls:chainData.puts;
  const spotN=+spot, vixN=+vix||20, hvN=+hv||0;
  const dailyEM=emDaily(spotN,+chainData.volatility||20);
  const intradayRangePct=intradayRange?intradayRange/dailyEM:0;

  // Filter by DTE
  const dteGroups=[...new Set(legs.map(l=>l.dte))].sort((a,b)=>a-b);
  const filteredByDTE= activeDTE==="all"?legs:legs.filter(l=>l.dte===+activeDTE);

  // Filter by range
  const filtered = filteredByDTE.filter(l=>{
    if(activeRange==="all")return true;
    if(activeRange==="itm")return l.inTheMoney;
    if(activeRange==="otm")return !l.inTheMoney;
    if(activeRange==="ntm"){
      const dist=Math.abs(l.strike-spotN)/spotN;
      return dist<=0.05;
    }
    return true;
  });

  // Determine ATM strike
  const atmStrike=legs.length>0?legs.reduce((prev,curr)=>
    Math.abs(curr.strike-spotN)<Math.abs(prev.strike-spotN)?curr:prev
  ,legs[0])?.strike:spotN;

  return(
    <div className="chain-wrap">
      <div className="chain-head">
        <div>
          <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--text3)",letterSpacing:".16em"}}>
            {chainData.dataSource?.includes("AI")?"⚡ AI OPTION CHAIN":"📊 LIVE OPTION CHAIN"} — {chainData.underlyingSymbol}
          </div>
          <div style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",marginTop:2}}>
            {chainData.numberOfContracts} contracts · IV {chainData.volatility?.toFixed(1)}%
            · {chainData.dataSource?.includes("AI")
                ?<span style={{color:"var(--yellow)"}}>Black-Scholes Greeks · AI prices</span>
                :"Live Schwab Greeks"}
          </div>
        </div>
        <div style={{display:"flex",gap:5}}>
          {["call","put"].map(t=>(
            <button key={t} className={`chain-filter-btn${activeType===t?" on":""}`}
              onClick={()=>setActiveType(t)} style={{textTransform:"uppercase"}}>
              {t}S
            </button>
          ))}
        </div>
      </div>

      <div className="chain-filters">
        <span style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",marginRight:4,
          alignSelf:"center",letterSpacing:".1em"}}>DTE:</span>
        {["all",...dteGroups.slice(0,6).map(String)].map(d=>(
          <button key={d} className={`chain-filter-btn${activeDTE===d?" on":""}`}
            onClick={()=>setActiveDTE(d)}>{d==="all"?"ALL":d+"d"}</button>
        ))}
        <span style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",marginLeft:8,marginRight:4,
          alignSelf:"center",letterSpacing:".1em"}}>RANGE:</span>
        {[["all","ALL"],["ntm","NTM"],["itm","ITM"],["otm","OTM"]].map(([v,l])=>(
          <button key={v} className={`chain-filter-btn${activeRange===v?" on":""}`}
            onClick={()=>setActiveRange(v)}>{l}</button>
        ))}
      </div>

      <div className="chain-scroll">
        <table className="chain-table">
          <thead>
            <tr>
              <th>STRIKE</th>
              <th>CLASS</th>
              <th>BID</th>
              <th>ASK</th>
              <th>MID</th>
              <th className="highlight-col">Δ DELTA</th>
              <th>Γ GAMMA</th>
              <th>Θ THETA</th>
              <th>V VEGA</th>
              <th>IV%</th>
              <th>OI</th>
              <th className="highlight-col">% PROFIT</th>
              <th>P&L LONG</th>
              <th>P&L SHORT</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((leg,i)=>{
              const isATM=leg.strike===atmStrike;
              const isITM=leg.inTheMoney;
              const distFromSupport=support?(leg.strike-support)/spotN:null;
              const distFromRes=resistance?(resistance-leg.strike)/spotN:null;

              // POP calculation using all contextual signals
              const popLong =calcPOP(leg.greeks.delta,leg.iv,vixN,intradayRangePct,distFromSupport,activeType,"long");
              const popShort=calcPOP(leg.greeks.delta,leg.iv,vixN,intradayRangePct,distFromSupport,activeType,"short");
              const popL=popLabel(popLong);
              const popS=popLabel(popShort);

              // P&L parameters
              const pnl=leg.pnl||{};
              const long_=pnl.long||{};
              const short_=pnl.short||{};

              // Support/resistance proximity indicator
              const nearSupport=support&&Math.abs(leg.strike-support)/spotN<0.015;
              const nearResist= resistance&&Math.abs(leg.strike-resistance)/spotN<0.015;

              return(
                <tr key={i} className={isATM?"atm":isITM?"itm":""}>
                  <td>
                    <div style={{fontFamily:"var(--mono)",fontSize:"11px",
                      fontWeight:isATM?"800":"500",
                      color:isATM?"var(--green)":isITM?"var(--accent)":"var(--text)"}}>
                      ${leg.strike}
                    </div>
                    {nearSupport&&<div style={{fontFamily:"var(--mono)",fontSize:"7px",color:"var(--green)"}}>▲ SUPPORT</div>}
                    {nearResist&&<div style={{fontFamily:"var(--mono)",fontSize:"7px",color:"var(--red)"}}>▼ RESIST</div>}
                    {isATM&&<div style={{fontFamily:"var(--mono)",fontSize:"7px",color:"var(--green)"}}>◆ ATM</div>}
                  </td>
                  <td><span style={{fontFamily:"var(--mono)",fontSize:"8px",color:
                    leg.classification?.includes("Deep ITM")?"var(--green)":
                    leg.classification?.includes("Far OTM")?"var(--red)":"var(--text2)"}}>
                    {leg.classification}
                  </span></td>
                  <td style={{color:"var(--text2)"}}>${leg.bid}</td>
                  <td style={{color:"var(--text2)"}}>${leg.ask}</td>
                  <td style={{color:"var(--accent)",fontWeight:600}}>${leg.mid}</td>
                  <td style={{color:Math.abs(leg.greeks.delta)>=0.6?"var(--green)":
                    Math.abs(leg.greeks.delta)>=0.4?"var(--yellow)":"var(--text2)",fontWeight:600}}>
                    {leg.greeks.delta.toFixed(3)}
                  </td>
                  <td style={{color:"var(--yellow)"}}>{leg.greeks.gamma.toFixed(5)}</td>
                  <td style={{color:"var(--red)"}}>${leg.greeks.theta.toFixed(3)}</td>
                  <td style={{color:"var(--purple)"}}>${leg.greeks.vega.toFixed(3)}</td>
                  <td style={{color:"var(--text2)"}}>{leg.iv.toFixed(1)}%</td>
                  <td style={{color:"var(--text3)"}}>{leg.oi?.toLocaleString()}</td>

                  {/* % PROFIT OF CLOSE */}
                  <td>
                    <div style={{display:"flex",flexDirection:"column",gap:2,alignItems:"flex-end"}}>
                      <div className="pop-pill" style={{background:`${popL.color}18`,
                        border:`1px solid ${popL.color}30`,color:popL.color}}>
                        L {(popLong*100).toFixed(0)}% {popL.label}
                      </div>
                      <div className="pop-pill" style={{background:`${popS.color}18`,
                        border:`1px solid ${popS.color}30`,color:popS.color}}>
                        S {(popShort*100).toFixed(0)}% {popS.label}
                      </div>
                    </div>
                  </td>

                  {/* P&L LONG */}
                  <td>
                    <div className="pnl-cell">
                      <div className="pnl-target">🎯 ${long_.profitTarget||((leg.mid*2).toFixed(2))}</div>
                      <div className="pnl-stop">🛑 ${long_.stopLoss||((leg.mid*0.5).toFixed(2))}</div>
                      <div className="pnl-be">BE ${long_.breakeven||(activeType==="call"?+(leg.strike+leg.mid).toFixed(2):+(leg.strike-leg.mid).toFixed(2))}</div>
                    </div>
                  </td>

                  {/* P&L SHORT */}
                  <td>
                    <div className="pnl-cell">
                      <div className="pnl-target">🎯 ${short_.profitTarget||((leg.mid*0.5).toFixed(2))}</div>
                      <div className="pnl-stop">🛑 ${short_.stopLoss||((leg.mid*2).toFixed(2))}</div>
                      <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--text3)"}}>
                        Max ${(leg.mid*100).toFixed(0)}/ct
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* LEGEND */}
      <div style={{padding:"8px 16px",borderTop:"1px solid var(--border)",
        background:"rgba(0,0,0,.1)",display:"flex",gap:16,flexWrap:"wrap",alignItems:"center"}}>
        {[["var(--green)","◆ ATM"],["var(--accent)","ITM row"],
          ["▲ SUPPORT","Support"],["▼ RESIST","Resistance"]].map(([c,l])=>(
          <div key={l} style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",
            display:"flex",alignItems:"center",gap:4}}>
            <span style={{color:c.startsWith("var")?c:"var(--text3)"}}>{c.startsWith("var")?"●":c}</span>
            {l}
          </div>
        ))}
        <div style={{marginLeft:"auto",fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)"}}>
          % PROFIT = probability of profiting by expiry · L=Long · S=Short
        </div>
      </div>
    </div>
  );
}

// ─── GREEKS CALCULATOR ────────────────────────────────────────────────────────
function GreeksCalc({spot,iv}){
  const [strike,setStrike]=useState("");
  const [dte,setDte]=useState("30");
  const [rf,setRf]=useState("5.3");
  const [type,setType]=useState("call");
  const [calcIV,setCalcIV]=useState(iv||"");
  useEffect(()=>{if(iv&&!calcIV)setCalcIV(iv);},[iv]);
  const effIV=calcIV||iv||"";
  const S=+spot,K=+strike||+spot,T=(+dte||30)/365,r=(+rf||5.3)/100,sig=(+effIV||0)/100;
  const g=bsGreeks(S,K,T,r,sig,type);
  const dc=d=>{const a=Math.abs(d||0);if(a>=.7)return"var(--green)";if(a>=.5)return"var(--accent)";if(a>=.3)return"var(--yellow)";return"var(--red)";};
  const matStrikes=spot?[+(S*.80).toFixed(0),+(S*.87).toFixed(0),+(S*.93).toFixed(0),
    +(S*.97).toFixed(0),+S.toFixed(0),+(S*1.03).toFixed(0),+(S*1.07).toFixed(0),
    +(S*1.13).toFixed(0),+(S*1.20).toFixed(0)]:[];
  const matLabels=["Deep ITM","ITM 0.80","ITM 0.70","Slight ITM","ATM ←",
    "Slight OTM","OTM 0.35","OTM 0.25","Far OTM"];
  return(
    <div className="greeks-wrap">
      <div className="greeks-head">
        <div>
          <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--text3)",letterSpacing:".16em"}}>BLACK-SCHOLES GREEK CALCULATOR</div>
          <div style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",marginTop:2}}>Pure JS · live computation · no external libs</div>
        </div>
        <div className="type-tabs" style={{width:110}}>
          {["call","put"].map(t=>(
            <div key={t} className={`ttab${type===t?" on":""}`} onClick={()=>setType(t)}>{t.toUpperCase()}</div>
          ))}
        </div>
      </div>
      <div className="greeks-inputs">
        {[["SPOT",spot,"","var(--accent)",true],["STRIKE",strike,spot||"K","",false],
          ["DTE",dte,"30","",false],["IV%",effIV,"IV%","",false],["RF%",rf,"5.3","",false]].map(([l,v,ph,col,ro])=>(
          <div key={l} className="gi-field">
            <div className="gi-label">{l}</div>
            <input className="gi-input" type={ro?"text":"number"} value={v} readOnly={ro}
              placeholder={ph} style={col?{color:col}:{}}
              onChange={e=>{
                if(l==="STRIKE")setStrike(e.target.value);
                else if(l==="DTE")setDte(e.target.value);
                else if(l==="IV%")setCalcIV(e.target.value);
                else if(l==="RF%")setRf(e.target.value);
              }}/>
          </div>
        ))}
      </div>
      {g?(
        <>
          <div className="greeks-grid">
            {[
              {label:"PRICE",val:`$${g.price}`,sub:`Intrinsic $${g.intrinsic} + Extrinsic $${g.extrinsic}`,color:"var(--accent)",bar:null},
              {label:"DELTA Δ",val:g.delta.toFixed(4),sub:type==="call"?"$ per $1 up":"$ per $1 down",color:dc(g.delta),bar:Math.abs(g.delta)},
              {label:"GAMMA Γ",val:g.gamma.toFixed(6),sub:"Delta change per $1",color:+dte<=1?"var(--red)":"var(--yellow)",bar:Math.min(g.gamma*500,1)},
              {label:"THETA Θ/day",val:`$${g.theta.toFixed(4)}`,sub:"Daily time decay",color:"var(--red)",bar:Math.min(Math.abs(g.theta)*2,1)},
              {label:"VEGA V/1%",val:`$${g.vega.toFixed(4)}`,sub:"P&L per 1% IV",color:"var(--purple)",bar:Math.min(g.vega,1)},
              {label:"RHO ρ/1%",val:`$${g.rho.toFixed(4)}`,sub:"P&L per 1% rate",color:"var(--text2)",bar:null},
              {label:"BREAKEVEN",val:`$${g.breakeven}`,sub:`${((Math.abs(g.breakeven-S)/S)*100).toFixed(2)}% from spot`,
                color:Math.abs(g.breakeven-S)/S<0.05?"var(--green)":"var(--yellow)",bar:null},
              {label:"POP (LONG)",val:`${((type==="call"?Math.abs(g.delta):1-Math.abs(g.delta))*100).toFixed(0)}%`,
                sub:"Delta-based ITM prob",color:Math.abs(g.delta)>.5?"var(--green)":"var(--yellow)",bar:null},
            ].map((c,i)=>(
              <div key={i} className="gcard">
                <div className="gcard-label">{c.label}</div>
                <div className="gcard-val" style={{color:c.color,fontSize:c.label==="PRICE"||c.label.includes("BREAK")||c.label.includes("POP")?"16px":"15px"}}>{c.val}</div>
                <div className="gcard-sub">{c.sub}</div>
                {c.bar!=null&&<div className="gcard-bar"><div className="gcard-bar-fill" style={{width:`${c.bar*100}%`,background:c.color}}/></div>}
              </div>
            ))}
          </div>
          {matStrikes.length>0&&sig>0&&(
            <div className="gm-wrap">
              <div style={{fontFamily:"var(--mono)",fontSize:"8.5px",color:"var(--text3)",letterSpacing:".14em",paddingTop:10}}>
                STRIKE MATRIX — {type.toUpperCase()} · {dte}DTE · IV {effIV}%
              </div>
              <table className="gm-table">
                <thead>
                  <tr>
                    <th style={{textAlign:"left"}}>STRIKE</th>
                    <th>PRICE</th><th>DELTA</th><th>GAMMA</th>
                    <th>THETA/D</th><th>VEGA/1%</th><th>BREAKEVEN</th>
                    <th>POP%</th><th>BE DIST</th>
                  </tr>
                </thead>
                <tbody>
                  {matStrikes.map((mk,i)=>{
                    const mg=bsGreeks(S,mk,T,r,sig,type);
                    if(!mg)return null;
                    const isRec=Math.abs(mg.delta)>=0.68&&Math.abs(mg.delta)<=0.82;
                    const pop=(type==="call"?Math.abs(mg.delta):1-Math.abs(mg.delta))*100;
                    const beDist=((Math.abs(mg.breakeven-S)/S)*100).toFixed(1);
                    return(
                      <tr key={i} className={isRec?"rec":""}>
                        <td style={{color:isRec?"var(--green)":"var(--text)"}}>
                          ${mk} <span style={{color:"var(--text3)",fontSize:"8px"}}>{matLabels[i]}{isRec?" ★":""}</span>
                        </td>
                        <td style={{color:"var(--accent)"}}>${mg.price}</td>
                        <td style={{color:dc(mg.delta)}}>{mg.delta.toFixed(3)}</td>
                        <td style={{color:"var(--yellow)"}}>{mg.gamma.toFixed(5)}</td>
                        <td style={{color:"var(--red)"}}>${mg.theta.toFixed(3)}</td>
                        <td style={{color:"var(--purple)"}}>${mg.vega.toFixed(3)}</td>
                        <td>${mg.breakeven}</td>
                        <td style={{color:pop>55?"var(--green)":pop>35?"var(--yellow)":"var(--red)"}}>{pop.toFixed(0)}%</td>
                        <td style={{color:"var(--text3)"}}>{beDist}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="gm-note">★ Recommended stock-replacement delta zone (0.68–0.82)</div>
            </div>
          )}
        </>
      ):(
        <div style={{padding:"18px",textAlign:"center",fontFamily:"var(--mono)",fontSize:"10px",color:"var(--text3)"}}>
          Enter spot price and IV% to compute Greeks
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function IVStrikeSelector(){
  const [ticker,   setTicker  ]=useState("");
  const [spot,     setSpot    ]=useState("");
  const [iv,       setIv      ]=useState("");
  const [hv,       setHv      ]=useState("");
  const [vix,      setVix     ]=useState("");
  const [ivLow,    setIvLow   ]=useState("");
  const [ivHigh,   setIvHigh  ]=useState("");
  const [support,  setSupport ]=useState("");
  const [resist,   setResist  ]=useState("");
  const [intRange, setIntRange]=useState("");
  const [mode,     setMode    ]=useState("BOTH");
  const [intCond,  setIntCond ]=useState("Range Day");
  const [leapsYrs, setLeapsYrs]=useState("1.5");
  const [lStrike,  setLStrike ]=useState("");
  const [lPrem,    setLPrem   ]=useState("");
  const [chainDTE, setChainDTE]=useState("30");
  const [chainStrikes,setChainStrikes]=useState("20");

  const [fetching,  setFetching ]=useState(false);
  const [analyzing, setAnalyzing]=useState(false);
  const [fetchMsg,  setFetchMsg ]=useState({text:"",ok:false});
  const [hasResult, setHasResult]=useState(false);
  const [aiText,    setAiText   ]=useState("");
  const [streaming, setStreaming ]=useState(false);
  const [chainData, setChainData]=useState(null);
  const [schwabOk,  setSchwabOk ]=useState(!!PROXY_BASE);
  const [loadingChain,setLoadingChain]=useState(false);
  const abortRef=useRef(null);

  const ivRank=ivLow&&ivHigh&&iv?ivRankCalc(+iv,+ivLow,+ivHigh):50;
  const rankColor=ivRank<30?"var(--green)":ivRank<60?"var(--yellow)":"var(--red)";
  const vixN=+vix||20;
  const vixRegime=vixN<15?"CALM":vixN<20?"NORMAL":vixN<30?"ELEVATED":vixN<40?"STRESSED":"PANIC";
  const vixColor=vixN<15?"var(--green)":vixN<20?"var(--accent)":vixN<30?"var(--yellow)":vixN<40?"var(--orange)":"var(--red)";

  // ── FETCH — Schwab proxy first, Claude fallback ────────────────────────────
  const fetchData=useCallback(async()=>{
    if(!ticker.trim())return;
    setFetching(true);
    setFetchMsg({text:"",ok:false});
    const sym=ticker.trim().toUpperCase();

    // ── Path A: Schwab proxy ─────────────────────────────────────────────────
    if(PROXY_BASE){
      try{
        const [quoteRes,vixRes,histRes]=await Promise.all([
          fetch(`${PROXY_BASE}/quote?symbol=${sym}`),
          fetch(`${PROXY_BASE}/vix`),
          fetch(`${PROXY_BASE}/history?symbol=${sym}&period=10&periodType=day&freq=5&freqType=minute`),
        ]);
        const [q,v,h]=await Promise.all([quoteRes.json(),vixRes.json(),histRes.json()]);

        setSpot(q.price?.toFixed(2)||"");
        setIv((q.iv||0).toFixed(1));
        setIvLow(Math.max(10,(q.iv||20)-20)+"");
        setIvHigh(Math.min(120,(q.iv||20)+30)+"");
        if(!hv)setHv((h.hv20||0).toFixed(1));
        setVix(v.vix?.toFixed(2)||"");
        setSupport(h.support?.toFixed(2)||"");
        setResist(h.resistance?.toFixed(2)||"");
        setIntRange(h.intradayRange?.toFixed(2)||"");
        setSchwabOk(true);
        setFetchMsg({text:`✓ ${sym} — $${q.price?.toFixed(2)} · IV ${(q.iv||0).toFixed(1)}% · VIX ${v.vix?.toFixed(2)} · HV ${(h.hv20||0).toFixed(1)}% · S/R computed from 5-min bars (live Schwab data)`,ok:true});
        setFetching(false);
        return;
      }catch(e){
        setSchwabOk(false);
        // fall through to Claude
      }
    }

    // ── Path B: Claude AI web search ─────────────────────────────────────────
    try{
      const res=await fetch(IV_AI_URL,{
        method:"POST",headers:IV_AI_HEADERS,
        body:JSON.stringify({
          mode:"json", maxTokens:512, webSearch:true,
          prompt:
            `Search for current market data for stock ticker ${sym}. Find: current price, 52-week high, 52-week low, company name, current implied volatility percentage. Also find the current VIX level. ` +
            `Respond ONLY with a raw JSON object, no markdown, no explanation: ` +
            `{"price":123.45,"high52w":150.00,"low52w":90.00,"name":"Company Name","iv":25.5,"vix":18.2}`
        })
      });
      if(!res.ok)throw new Error(`HTTP ${res.status}`);
      const data=await res.json();
      const text=data.text||"";
      const m=text.match(/\{"price"\s*:\s*[\d.]+[^}]*\}/s)||text.match(/\{[^{}]+\}/g);
      const jsonStr=Array.isArray(m)?m[m.length-1]:m?m[0]:null;
      if(!jsonStr)throw new Error("No JSON in response");
      const p=JSON.parse(jsonStr);
      const price=+p.price;
      if(!price||price<=0)throw new Error("Invalid price");
      setSpot(price.toFixed(2));
      const high=+p.high52w||price*1.35, low=+p.low52w||price*0.7;
      const ivEst=p.iv&&+p.iv>0?Math.round(+p.iv):Math.min(120,Math.max(10,Math.round(((high-low)/price)*80)));
      setIv(ivEst+"");
      setIvLow(Math.max(10,ivEst-20)+"");
      setIvHigh(Math.min(120,ivEst+30)+"");
      if(!hv)setHv(Math.round(ivEst*0.85)+"");
      if(p.vix&&+p.vix>0)setVix((+p.vix).toFixed(2));
      setFetchMsg({text:`✓ ${sym} — ${p.name||sym} · $${price.toFixed(2)} · IV ${ivEst}% (${p.iv?"live":"estimated from 52W"}). Override with exact broker IV.`,ok:true});
    }catch(err){
      setFetchMsg({text:`Fetch failed: ${err.message}. Manual entry: SPY $560 IV 13% | NVDA $135 IV 52% | QQQ $480 IV 18%`,ok:false});
    }finally{setFetching(false);}
  },[ticker,hv]);

  // ── LOAD OPTION CHAIN — Schwab proxy first, Claude AI fallback ────────────
  const loadChain=useCallback(async()=>{
    if(!ticker||!spot||!iv)return;
    setLoadingChain(true);
    setFetchMsg({text:"",ok:false});
    const sym=ticker.trim().toUpperCase();
    const S=+spot, ivN=+iv;

    // ── Path A: Schwab proxy ─────────────────────────────────────────────────
    if(PROXY_BASE&&schwabOk){
      try{
        const res=await fetch(`${PROXY_BASE}/chain?symbol=${sym}&dte=${chainDTE}&strikes=${chainStrikes}&type=ALL&range=ALL`);
        if(!res.ok)throw new Error(`Schwab chain ${res.status}`);
        const data=await res.json();
        setChainData(data);
        setFetchMsg({text:`✓ Live Schwab option chain loaded — ${data.calls?.length+data.puts?.length||0} contracts · Schwab Greeks`,ok:true});
        setLoadingChain(false);
        return;
      }catch(e){
        setSchwabOk(false);
        // fall through to Claude
      }
    }

    // ── Path B: Claude AI web search — build synthetic chain with real Greeks ─
    // Ask Claude to fetch: ATM IV, key strikes, real bid/ask if available,
    // then we fill in Greeks via Black-Scholes from the live IV data
    try{
      setFetchMsg({text:"⟳ Schwab unavailable — fetching chain data via AI web search…",ok:true});

      const dteN=+chainDTE||30;
      const strikesN=Math.min(+chainStrikes||16,16); // cap at 16 per type for token budget

      const res=await fetch(IV_AI_URL,{
        method:"POST",headers:IV_AI_HEADERS,
        body:JSON.stringify({
          mode:"json", maxTokens:2000, webSearch:true,
          prompt:
            `Search for the current options chain data for ${sym} stock. ` +
            `Find the ${dteN}-day expiration options (or nearest available). ` +
            `I need: current implied volatility (IV%), VIX level, 52-week high/low, ` +
            `and if available the ATM bid/ask prices for calls and puts. ` +
            `The stock is currently at $${S.toFixed(2)}. ` +
            `Return ONLY a raw JSON object with no markdown or explanation: ` +
            `{"iv":25.5,"vix":18.2,"hv":22.0,"high52w":150.00,"low52w":90.00,` +
            `"atm_call_bid":3.20,"atm_call_ask":3.40,"atm_put_bid":3.10,"atm_put_ask":3.30,` +
            `"support":${(S*0.97).toFixed(2)},"resistance":${(S*1.03).toFixed(2)}}`
        })
      });

      if(!res.ok)throw new Error(`API ${res.status}`);
      const data=await res.json();
      const text=data.text||"";

      // Parse whatever JSON Claude returned
      const m=text.match(/\{\s*"iv"\s*:[^}]+\}/s)||text.match(/\{[^{}]+\}/g);
      const jsonStr=Array.isArray(m)?m[m.length-1]:m?m[0]:null;
      let aiData={};
      if(jsonStr){try{aiData=JSON.parse(jsonStr);}catch{}}

      // Use AI-fetched IV if better than what we have, else use current iv state
      const liveIV=aiData.iv&&+aiData.iv>0?+aiData.iv:ivN;
      const liveHV=aiData.hv&&+aiData.hv>0?+aiData.hv:0;
      const liveVix=aiData.vix&&+aiData.vix>0?+aiData.vix:+vix||20;
      const liveSupport=aiData.support&&+aiData.support>0?+aiData.support:+support||S*0.97;
      const liveResist=aiData.resistance&&+aiData.resistance>0?+aiData.resistance:+resist||S*1.03;

      // Update state with any new data
      if(liveIV!==ivN){setIv(liveIV.toFixed(1));}
      if(liveHV>0&&!hv){setHv(liveHV.toFixed(1));}
      if(liveVix>0&&!vix){setVix(liveVix.toFixed(2));}
      if(!support&&liveSupport>0)setSupport(liveSupport.toFixed(2));
      if(!resist&&liveResist>0)setResist(liveResist.toFixed(2));

      // Now BUILD the synthetic chain using Black-Scholes
      // Generate strikes from Deep ITM to Far OTM
      const T=dteN/365;
      const r=RF;
      const sigma=liveIV/100;

      // Determine strike spacing based on price level
      const spacing=S<20?0.5:S<50?1:S<100?2:S<200?5:S<500?5:10;
      const atmStrike=Math.round(S/spacing)*spacing;

      // Generate N strikes each side of ATM
      const halfN=Math.floor(strikesN/2);
      const strikeList=[];
      for(let i=-halfN;i<=halfN;i++){
        strikeList.push(+(atmStrike+i*spacing).toFixed(2));
      }

      const buildLegs=(type)=>strikeList.map(K=>{
        const g=bsGreeks(S,K,T,r,sigma,type);
        if(!g)return null;

        // Use AI-fetched ATM bid/ask if available for ATM strike, scale others
        let bid=g.price*0.95, ask=g.price*1.05;
        if(Math.abs(K-S)<spacing*0.5){
          if(type==="call"&&aiData.atm_call_bid){bid=+aiData.atm_call_bid;ask=+aiData.atm_call_ask||bid*1.05;}
          if(type==="put" &&aiData.atm_put_bid) {bid=+aiData.atm_put_bid; ask=+aiData.atm_put_ask||bid*1.05;}
        }
        const mid=+((bid+ask)/2).toFixed(2);
        const inTheMoney=type==="call"?K<S:K>S;
        const distFromSupport=liveSupport?(K-liveSupport)/S:null;

        // POP
        const popL=calcPOP(g.delta,liveIV,liveVix,+intRange?+intRange/emDaily(S,liveIV):0,distFromSupport,type,"long");
        const popS=calcPOP(g.delta,liveIV,liveVix,+intRange?+intRange/emDaily(S,liveIV):0,distFromSupport,type,"short");

        const nearSupport=liveSupport&&Math.abs(K-liveSupport)/S<0.015;
        const nearResist =liveResist &&Math.abs(K-liveResist)/S<0.015;

        return{
          type,
          expDate:`+${dteN}d`,
          dte:dteN,
          strike:K,
          bid:+bid.toFixed(2),
          ask:+ask.toFixed(2),
          mid,
          mid_ai:K===atmStrike,// flag AI-sourced ATM price
          spread:+(ask-bid).toFixed(2),
          iv:liveIV,
          oi:0,
          volume:0,
          inTheMoney,
          greeks:{
            delta:g.delta,
            gamma:g.gamma,
            theta:g.theta,
            vega:g.vega,
          },
          pnl:{
            long:{
              maxLoss:+(mid*100).toFixed(2),
              breakeven:g.breakeven,
              profitTarget:+(mid*2).toFixed(2),
              stopLoss:+(mid*0.5).toFixed(2),
              riskReward:"2.0R",
              pop:+(popL*100).toFixed(1),
              popLabel:popL>=0.65?"HIGH":popL>=0.5?"MOD":"LOW",
            },
            short:{
              maxProfit:+(mid*100).toFixed(2),
              stopLoss:+(mid*2).toFixed(2),
              profitTarget:+(mid*0.5).toFixed(2),
              riskReward:"0.5R",
              pop:+(popS*100).toFixed(1),
              popLabel:popS>=0.65?"HIGH":popS>=0.5?"MOD":"LOW",
            },
          },
          classification:classifyStrike(K,S,type),
          nearSupport,
          nearResist,
          symbol:`${sym}_AI_${type.toUpperCase()[0]}${K}`,
          dataSource:"AI",
        };
      }).filter(Boolean);

      const syntheticChain={
        underlyingSymbol:sym,
        underlyingPrice:S,
        calls:buildLegs("call"),
        puts:buildLegs("put"),
        numberOfContracts:strikeList.length*2,
        volatility:liveIV,
        hv20:liveHV,
        dataSource:"Claude AI Web Search + Black-Scholes Greeks",
        disclaimer:"Greeks computed via Black-Scholes. Bid/ask estimated from mid ±5% except ATM from web search.",
        timestamp:new Date().toISOString(),
      };

      setChainData(syntheticChain);
      setFetchMsg({
        text:`✓ AI chain built — ${strikeList.length} strikes · ${dteN}DTE · IV ${liveIV}% · Greeks via Black-Scholes · ATM prices from web search${aiData.atm_call_bid?" (ATM bid/ask found)":""}`,
        ok:true
      });
    }catch(err){
      setFetchMsg({text:`Chain failed: ${err.message}. Try entering spot + IV% manually and clicking Analyze.`,ok:false});
    }finally{setLoadingChain(false);}
  },[ticker,chainDTE,chainStrikes,spot,iv,hv,vix,support,resist,intRange,schwabOk]);

  // ── Helper used by loadChain AI path ──────────────────────────────────────
  function classifyStrike(K,S,type){
    const d=(K-S)/S;
    if(type==="call"){
      if(d<-0.08)return"Deep ITM";if(d<-0.03)return"ITM";
      if(d<0.01)return"ATM";if(d<0.04)return"Slight OTM";
      if(d<0.08)return"OTM";return"Far OTM";
    }else{
      if(d>0.08)return"Deep ITM";if(d>0.03)return"ITM";
      if(d>-0.01)return"ATM";if(d>-0.04)return"Slight OTM";
      if(d>-0.08)return"OTM";return"Far OTM";
    }
  }

  // ── ANALYZE ────────────────────────────────────────────────────────────────
  const analyze=useCallback(async()=>{
    if(!spot||!iv)return;
    if(abortRef.current)abortRef.current.abort();
    abortRef.current=new AbortController();
    setAnalyzing(true);setAiText("");setStreaming(true);setHasResult(true);
    const S=+spot,ivN=+iv,hvN=+hv||0;
    const dEM=emDaily(S,ivN).toFixed(2),mEM=emCal(S,ivN,30).toFixed(2);
    const hEM=emHourly(S,ivN).toFixed(2),em90=emCal(S,ivN,90).toFixed(2);
    const ratio=hvN>0?(ivN/hvN).toFixed(2):"N/A";
    const g_atm=bsGreeks(S,S,1/365,RF,ivN/100,"call");
    const g_leaps=bsGreeks(S,+(S*.87).toFixed(0),+leapsYrs||1.5,RF,ivN/100,"call");

    const prompt=`You are an expert options strategist on Profit Pathfinder (jeffongeri.com). Analyze this setup concisely with specific numbers.

LIVE DATA${schwabOk?" (Schwab API)":"(estimated)"}:
- Ticker: ${ticker||"STOCK"} · Spot: $${spot}
- IV: ${iv}% · HV: ${hv||"N/A"}% · IV/HV: ${ratio}× · IV Rank: ${ivRank}%
- VIX: ${vix||"N/A"} (${vixRegime})
- Support: $${support||"N/A"} · Resistance: $${resist||"N/A"}
- Intraday Range so far: $${intRange||"N/A"}

EXPECTED MOVES:
- Hourly: ±$${hEM} | Daily: ±$${dEM} | Monthly: ±$${mEM} | 90D: ±$${em90}

GREEKS (0DTE ATM): Δ=${g_atm?.delta||"N/A"} Γ=${g_atm?.gamma||"N/A"} Θ=${g_atm?.theta||"N/A"}/day V=${g_atm?.vega||"N/A"}/1%
GREEKS (LEAPS K=$${(S*.87).toFixed(0)}): Δ=${g_leaps?.delta||"N/A"} Θ=${g_leaps?.theta||"N/A"}/day V=${g_leaps?.vega||"N/A"}/1%

MODE: ${mode}${mode!=="LEAPS"?` · ${intCond}`:""}
${lStrike?`LEAPS: K=$${lStrike}, Prem=$${lPrem||"?"}, BE=$${(+lStrike+(+lPrem||0)).toFixed(2)}`:""}

Provide in 200 words max:
1. **PRIMARY** — exact strike, delta, structure, target/stop in $ terms
2. **IV edge** — rich/cheap, impact on structure (debit vs credit vs spread)
3. **Key risk** — the one number to watch with a specific $ level
4. **S/R context** — how support $${support||"?"} and resistance $${resist||"?"} affect strike selection`;

    try{
      const res=await fetch(IV_AI_URL,{
        method:"POST",headers:IV_AI_HEADERS,
        signal:abortRef.current.signal,
        body:JSON.stringify({mode:"stream",maxTokens:800,prompt})
      });
      const reader=res.body.getReader();const dec=new TextDecoder();let acc="";
      while(true){
        const{done,value}=await reader.read();if(done)break;
        for(const line of dec.decode(value).split("\n")){
          if(line.startsWith("data: ")){
            try{const d=JSON.parse(line.slice(6));
              if(d.type==="content_block_delta"&&d.delta?.text){acc+=d.delta.text;setAiText(acc);}
            }catch{}
          }
        }
      }
    }catch(e){if(e.name!=="AbortError")setAiText("Analysis failed. Check connection.");}
    finally{setAnalyzing(false);setStreaming(false);}
  },[spot,iv,hv,vix,ivRank,vixRegime,mode,intCond,leapsYrs,lStrike,lPrem,
     ticker,schwabOk,support,resist,intRange]);

  return(
    <>
      <style>{CSS}</style>
      <div className="root">
        {/* HEADER */}
        <div className="hdr">
          <div className="hdr-left">
            <div className="brand-dot"/>
            <div>
              <div className="brand-sub">JEFFONGERI.COM</div>
              <div className="brand-title">IV Strike <span>Selector</span></div>
            </div>
          </div>
          <div className="badges">
            <span className="badge badge-b">LEAPS + 0DTE</span>
            <span className="badge badge-g">LIVE GREEKS</span>
            <span className="badge badge-o">P&L + POP</span>
            <span className={`badge ${schwabOk&&PROXY_BASE?"badge-g":"badge-b"}`}>
              {schwabOk&&PROXY_BASE?"SCHWAB LIVE":"AI FETCH"}
            </span>
          </div>
        </div>

        <div className="layout">
          {/* LEFT */}
          <div className="left">
            {/* SCHWAB STATUS */}
            <div className="schwab-status">
              <div className="schwab-dot" style={{background:schwabOk&&PROXY_BASE?"var(--green)":"var(--yellow)"}}/>
              <div className="schwab-label" style={{color:schwabOk&&PROXY_BASE?"var(--green)":"var(--yellow)"}}>
                {PROXY_BASE
                  ?(schwabOk?"Schwab API Connected":"Schwab API Error — Using AI Fallback")
                  :"Schwab Proxy Not Configured — Using AI Fetch"}
              </div>
            </div>

            {!PROXY_BASE&&(
              <div className="notice">
                ⚡ Set PROXY_BASE to your Supabase Edge Function URL to enable live Schwab data, live Greeks, and real option chains. See setup guide.
              </div>
            )}

            {/* FETCH */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div className="sec-title">Market Data</div>
              <div className="field">
                <label>TICKER</label>
                <input value={ticker} onChange={e=>setTicker(e.target.value.toUpperCase())}
                  placeholder="SPY, NVDA, AAPL…" onKeyDown={e=>e.key==="Enter"&&fetchData()}/>
              </div>
              <button className="btn-fetch" onClick={fetchData} disabled={!ticker||fetching}>
                {fetching?<><span className="spin"/>FETCHING…</>:<>⟳ FETCH LIVE DATA</>}
              </button>
              {fetchMsg.text&&<div className={fetchMsg.ok?"msg-ok":"msg-err"}>{fetchMsg.text}</div>}
            </div>

            {/* MANUAL */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div className="sec-title">Manual Override</div>
              <div className="row2">
                <div className="field"><label>SPOT ($)</label>
                  <input type="number" value={spot} onChange={e=>setSpot(e.target.value)} placeholder="560.00"/></div>
                <div className="field"><label>IV %</label>
                  <input type="number" value={iv} onChange={e=>setIv(e.target.value)} placeholder="13"/></div>
              </div>
              <div className="row3">
                <div className="field"><label>HV %</label>
                  <input type="number" value={hv} onChange={e=>setHv(e.target.value)} placeholder="11"/></div>
                <div className="field"><label>VIX</label>
                  <input type="number" value={vix} onChange={e=>setVix(e.target.value)} placeholder="18"/></div>
                <div className="field"><label>IV RANK %</label>
                  <input type="number" readOnly value={ivRank} style={{color:rankColor}}/></div>
              </div>
              <div className="row2">
                <div className="field"><label>52W IV LOW</label>
                  <input type="number" value={ivLow} onChange={e=>setIvLow(e.target.value)} placeholder="10"/></div>
                <div className="field"><label>52W IV HIGH</label>
                  <input type="number" value={ivHigh} onChange={e=>setIvHigh(e.target.value)} placeholder="60"/></div>
              </div>
              {iv&&ivLow&&ivHigh&&(
                <div className="iv-rank-wrap">
                  <div className="iv-rank-row">
                    <span style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",letterSpacing:".1em"}}>IV RANK</span>
                    <span style={{fontFamily:"var(--mono)",fontSize:"11px",color:rankColor,fontWeight:600}}>
                      {ivRank}% — {ivRank<30?"LOW":ivRank<60?"MODERATE":"HIGH"}
                    </span>
                  </div>
                  <div className="iv-rank-bar">
                    <div className="iv-rank-fill" style={{width:`${ivRank}%`,background:rankColor}}/>
                  </div>
                </div>
              )}
              <div className="row2">
                <div className="field"><label>SUPPORT ($)</label>
                  <input type="number" value={support} onChange={e=>setSupport(e.target.value)} placeholder="auto"/></div>
                <div className="field"><label>RESISTANCE ($)</label>
                  <input type="number" value={resist} onChange={e=>setResist(e.target.value)} placeholder="auto"/></div>
              </div>
              <div className="field"><label>INTRADAY RANGE ($)</label>
                <input type="number" value={intRange} onChange={e=>setIntRange(e.target.value)} placeholder="auto from history"/></div>
            </div>

            {/* MODE */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div className="sec-title">Mode</div>
              <div className="mode-tabs">
                {["LEAPS","0DTE","BOTH"].map(m=>(
                  <div key={m} className={`mtab${mode===m?" on":""}`} onClick={()=>setMode(m)}>{m}</div>
                ))}
              </div>
              {(mode==="0DTE"||mode==="BOTH")&&(
                <div className="field"><label>INTRADAY CONDITION</label>
                  <select value={intCond} onChange={e=>setIntCond(e.target.value)}>
                    {["Trend Day Up","Trend Day Down","Range Day","Event / Unknown"].map(c=><option key={c}>{c}</option>)}
                  </select></div>
              )}
              {(mode==="LEAPS"||mode==="BOTH")&&(
                <>
                  <div className="row3">
                    <div className="field"><label>YEARS</label>
                      <input type="number" step=".25" value={leapsYrs} onChange={e=>setLeapsYrs(e.target.value)} placeholder="1.5"/></div>
                    <div className="field"><label>STRIKE</label>
                      <input type="number" value={lStrike} onChange={e=>setLStrike(e.target.value)} placeholder="K"/></div>
                    <div className="field"><label>PREMIUM</label>
                      <input type="number" value={lPrem} onChange={e=>setLPrem(e.target.value)} placeholder="$"/></div>
                  </div>
                  {lStrike&&lPrem&&spot&&(
                    <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:6,padding:"8px 10px",display:"flex",flexDirection:"column",gap:3}}>
                      {[["BE",`$${(+lStrike+(+lPrem)).toFixed(2)}`,"var(--accent)"],
                        ["EXTRINSIC",`$${(+lPrem-Math.max(0,+spot-+lStrike)).toFixed(2)}`,"var(--text)"],
                        ["ANN BURDEN",`$${((+lPrem-Math.max(0,+spot-+lStrike))/(+leapsYrs||1.5)/+spot*100).toFixed(1)}%/yr`,(+lPrem-Math.max(0,+spot-+lStrike))/(+leapsYrs||1.5)/+spot*100>8?"var(--red)":"var(--green)"],
                      ].map(([l,v,c])=>(
                        <div key={l} style={{display:"flex",justifyContent:"space-between"}}>
                          <span style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)"}}>{l}</span>
                          <span style={{fontFamily:"var(--mono)",fontSize:"11px",color:c,fontWeight:600}}>{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* CHAIN LOADER — always available, uses Schwab or AI fallback */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div className="sec-title">Option Chain</div>
              <div className="row2">
                <div className="field"><label>DTE</label>
                  <input type="number" value={chainDTE} onChange={e=>setChainDTE(e.target.value)} placeholder="30"/></div>
                <div className="field"><label>STRIKES</label>
                  <input type="number" value={chainStrikes} onChange={e=>setChainStrikes(e.target.value)} placeholder="16"/></div>
              </div>
              <button className="btn-fetch" onClick={loadChain}
                disabled={!ticker||!spot||!iv||loadingChain}>
                {loadingChain
                  ?<><span className="spin"/>{schwabOk&&PROXY_BASE?"LOADING SCHWAB CHAIN…":"BUILDING AI CHAIN…"}</>
                  :<>{schwabOk&&PROXY_BASE?"📊 LOAD LIVE SCHWAB CHAIN":"🤖 BUILD AI OPTION CHAIN"}</>
                }
              </button>
              <div style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",lineHeight:1.6,
                padding:"5px 8px",background:"rgba(0,0,0,.15)",borderRadius:5,border:"1px solid var(--border)"}}>
                {schwabOk&&PROXY_BASE
                  ?"Live Schwab Greeks (Δ Γ Θ V from broker chain)"
                  :"Schwab unavailable → AI fetches IV/VIX/ATM prices · Greeks via Black-Scholes · all timeframes computed"
                }
              </div>
            </div>

            <button className="btn-analyze" onClick={analyze} disabled={!spot||!iv||analyzing}>
              {analyzing?<span style={{display:"flex",alignItems:"center",gap:7,justifyContent:"center"}}><span className="spin"/>ANALYZING…</span>:"⚡ GENERATE FULL ANALYSIS"}
            </button>
            <div className="disc">Not financial advice · Options involve risk of loss · jeffongeri.com</div>
          </div>

          {/* RIGHT */}
          <div className="right">
            {!spot&&!iv&&(
              <div className="empty">
                <div className="empty-icon">◎</div>
                <div className="empty-title">IV Strike Selector</div>
                <div className="empty-sub">
                  Enter ticker → Fetch → Analyze<br/>
                  Live Schwab data when proxy configured<br/><br/>
                  Expected Move · Live Greeks · Option Chain<br/>
                  P&L Parameters · % Profit by Close · AI Analysis
                </div>
              </div>
            )}

            {spot&&iv&&(
              <>
                {/* HERO */}
                <div className="hero">
                  <div>
                    <div className="hero-name">{ticker||"STOCK"}</div>
                    <div className="hero-price">${(+spot).toFixed(2)}</div>
                    <div className="hero-meta">{new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}</div>
                  </div>
                  <div className="hero-stats">
                    {[
                      ["IV",""+iv+"%","var(--yellow)"],
                      hv?["HV",""+hv+"%","var(--green)"]:null,
                      hv?["IV/HV",(iv/hv).toFixed(2)+"×",+iv/+hv>1.25?"var(--red)":+iv/+hv<.8?"var(--green)":"var(--accent)"]:null,
                      ["IV RNK",""+ivRank+"%",rankColor],
                      ["MODE",mode,"var(--accent)"],
                    ].filter(Boolean).map(([l,v,c])=>(
                      <div key={l} style={{textAlign:"right"}}>
                        <div className="hstat-label">{l}</div>
                        <div className="hstat-val" style={{color:c}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* VIX + S/R BANNER */}
                {(vix||support||resist)&&(
                  <div className="vix-banner">
                    {vix&&(
                      <>
                        <div>
                          <div style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",letterSpacing:".1em",marginBottom:2}}>VIX</div>
                          <div className="vix-val" style={{color:vixColor}}>{(+vix).toFixed(2)}</div>
                        </div>
                        <div className="vix-regime" style={{background:`${vixColor}18`,border:`1px solid ${vixColor}35`,color:vixColor}}>{vixRegime}</div>
                      </>
                    )}
                    <div className="vix-sr">
                      {support&&(
                        <div className="sr-item">
                          <div className="sr-label">▲ SUPPORT</div>
                          <div className="sr-val" style={{color:"var(--green)"}}>${(+support).toFixed(2)}</div>
                        </div>
                      )}
                      {resist&&(
                        <div className="sr-item">
                          <div className="sr-label">▼ RESISTANCE</div>
                          <div className="sr-val" style={{color:"var(--red)"}}>${(+resist).toFixed(2)}</div>
                        </div>
                      )}
                      {intRange&&(
                        <div className="sr-item">
                          <div className="sr-label">INTRADAY RANGE</div>
                          <div className="sr-val" style={{color:"var(--accent)"}}>${(+intRange).toFixed(2)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* EM TABLE */}
                <div>
                  <div className="shdr"><div className="shdr-text">EXPECTED MOVE — ALL TIMEFRAMES</div><div className="shdr-line"/></div>
                  <EMTable spot={spot} iv={iv} hv={hv}/>
                </div>

                {/* OPTION CHAIN — Schwab live or AI-generated */}
                {chainData?(
                  <div>
                    <div className="shdr">
                      <div className="shdr-text">
                        {chainData.dataSource?.includes("AI")
                          ?"AI OPTION CHAIN — P&L · % PROFIT BY CLOSE · B-S GREEKS"
                          :"LIVE SCHWAB CHAIN — P&L · % PROFIT BY CLOSE · LIVE GREEKS"
                        }
                      </div>
                      <div className="shdr-line"/>
                    </div>
                    {chainData.dataSource?.includes("AI")&&(
                      <div style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--yellow)",
                        background:"rgba(255,184,0,.06)",border:"1px solid rgba(255,184,0,.15)",
                        borderRadius:5,padding:"5px 10px",marginBottom:10,lineHeight:1.7}}>
                        ⚡ AI chain — Greeks via Black-Scholes · ATM prices from web search · bid/ask ±5% of mid · Configure Schwab proxy for exact broker values
                      </div>
                    )}
                    <OptionChainTable chainData={chainData} spot={spot} vix={vix} hv={hv}
                      intradayRange={+intRange||0} support={+support||0} resistance={+resist||0} mode={mode}/>
                  </div>
                ):(
                  <div style={{background:"var(--bg1)",border:"1px solid var(--border)",
                    borderRadius:10,padding:"18px",textAlign:"center",
                    fontFamily:"var(--mono)",fontSize:"10px",color:"var(--text3)",lineHeight:1.8}}>
                    Enter ticker + spot + IV%, then click<br/>
                    <strong style={{color:"var(--accent)"}}>
                      {schwabOk&&PROXY_BASE?"📊 Load Live Schwab Chain":"🤖 Build AI Option Chain"}
                    </strong><br/>
                    to see Greeks, P&amp;L, and % Profit by Close for every strike
                  </div>
                )}

                {/* GREEKS CALCULATOR */}
                <div>
                  <div className="shdr"><div className="shdr-text">BLACK-SCHOLES GREEK CALCULATOR</div><div className="shdr-line"/></div>
                  <GreeksCalc spot={spot} iv={iv}/>
                </div>

                {/* AI ANALYSIS */}
                {(aiText||analyzing)&&(
                  <div className="ai-wrap">
                    <div className="ai-head">
                      <div className="ai-dot"/>
                      <div className="ai-lbl">CLAUDE AI — FRAMEWORK ANALYSIS</div>
                      {streaming&&<span style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",marginLeft:"auto"}}>STREAMING…</span>}
                    </div>
                    <div className="ai-body">
                      {aiText
                        ?<span dangerouslySetInnerHTML={{__html:aiText.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br/>")}}/>
                        :<span style={{color:"var(--text3)"}}><span className="spin"/> Generating…</span>
                      }
                      {streaming&&<span className="cursor"/>}
                    </div>
                  </div>
                )}

                {/* PRE-TRADE CHECKLIST */}
                <div>
                  <div className="shdr"><div className="shdr-text">PRE-TRADE CHECKLIST</div><div className="shdr-line"/></div>
                  <div className="chk-list">
                    {[
                      {ok:ivRank<50,text:<><strong>IV Rank {ivRank}%</strong> — {ivRank<30?"✓ Low: outright call efficient":ivRank<50?"Moderate: debit spread viable":"⚠ High: debit spread or diagonal preferred"}</>},
                      {ok:vixN<25,text:<><strong>VIX {vix||"unknown"} ({vixRegime})</strong> — {vixN<20?"✓ Normal regime, standard sizing":vixN<30?"⚠ Elevated — reduce size 20-30%":"⚠ STRESSED — small size only, defined risk mandatory"}</>},
                      {ok:!!support&&!!resist,text:<><strong>S/R Levels:</strong> {support&&resist?`Support $${support} · Resistance $${resist} · Place stops beyond these levels`:"Enter support/resistance for optimal strike selection"}</>},
                      {ok:true,text:<><strong>Same-day EM:</strong> ±${emDaily(+spot,+iv).toFixed(2)} · confirm with ATM straddle on your broker chain</>},
                      {ok:true,text:<><strong>VWAP:</strong> Calls need price above VWAP · Puts need price below — never trade against VWAP reclaim</>},
                      {ok:true,text:<><strong>Hard exits:</strong> Define profit target, invalidation level, AND time stop before entering</>},
                      {ok:!!chainData,text:<>{chainData?<><strong>Chain loaded</strong> — {chainData.dataSource?.includes("AI")?"AI-generated Greeks (Black-Scholes)":"Live Schwab Greeks"} · {chainData.calls?.length||0} calls, {chainData.puts?.length||0} puts</>:<><strong>No chain loaded</strong> — click Build AI Option Chain to see per-strike P&L and POP</>}</>},
                    ].map((it,i)=>(
                      <div key={i} className="chk-item">
                        <div className="chk-icon">{it.ok?"✓":"⚠"}</div>
                        <div className="chk-text" style={{color:it.ok?"var(--text2)":"var(--yellow)"}}>{it.text}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="disc">JEFFONGERI.COM · IV STRIKE SELECTOR · NOT FINANCIAL ADVICE · OPTIONS INVOLVE RISK OF LOSS</div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
