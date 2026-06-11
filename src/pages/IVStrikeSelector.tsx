// @ts-nocheck
import { useState, useCallback, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const PROJECT_ID = (import.meta as any).env.VITE_SUPABASE_PROJECT_ID as string;
const PROXY_BASE = `https://${PROJECT_ID}.supabase.co/functions/v1/schwab-proxy`;
const AUTH_START_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/schwab-auth/start`;

// ─── BLACK-SCHOLES ───────────────────────────────────────────────────────────
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

function calcPOP(delta, iv, vix, intradayRangePct, distFromSupportPct, type, side) {
  const absDelta = Math.abs(delta||0);
  let pop = side==="long"
    ? (type==="call" ? absDelta : 1-absDelta)
    : (type==="call" ? 1-absDelta : absDelta);
  const ivN = (iv||20)/100;
  const ivAdj = ivN > 0.35 ? 0.04 : ivN < 0.15 ? -0.03 : 0;
  pop += side==="short" ? ivAdj : -ivAdj;
  const vixN = vix||20;
  const vixAdj = vixN > 30 ? -0.04 : vixN < 15 ? 0.02 : 0;
  pop += vixAdj;
  if(intradayRangePct > 0.6 && side==="long") pop += 0.03;
  if(intradayRangePct > 0.6 && side==="short") pop -= 0.03;
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

const RF=0.053;
function emHourly(P,v){return P*(v/100)*Math.sqrt(1/1638);}
function emDaily(P,v) {return P*(v/100)*Math.sqrt(1/252);}
function emWeekly(P,v){return P*(v/100)*Math.sqrt(5/252);}
function emCal(P,v,d) {return P*(v/100)*Math.sqrt(d/365);}
function ivRankCalc(cur,lo,hi){ if(!lo||!hi||hi===lo)return 50; return Math.round(((cur-lo)/(hi-lo))*100); }
function ivSignal(iv,hv){
  if(!hv||hv<=0)return{label:"—",cls:"sig-na"};
  const r=iv/hv;
  if(r>1.25)return{label:"IV RICH",cls:"sig-rich"};
  if(r<0.80)return{label:"IV CHEAP",cls:"sig-cheap"};
  return{label:"FAIR",cls:"sig-fair"};
}

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
.ivs *,.ivs *::before,.ivs *::after{box-sizing:border-box;margin:0;padding:0}
.ivs{
  --bg:#050810;--bg1:#090D1A;--bg2:#0D1220;--bg3:#111827;
  --border:#1a2340;--border2:#212d45;
  --accent:#00D4FF;--green:#00E5A0;--red:#FF4560;--yellow:#FFB800;
  --purple:#A855F7;--orange:#F97316;
  --text:#E2EAF4;--text2:#7A90B0;--text3:#3D5070;
  --mono:'DM Mono',monospace;--sans:'Syne',sans-serif;
  background:var(--bg);color:var(--text);font-family:var(--sans);min-height:100vh;
}
.ivs ::-webkit-scrollbar{width:4px;height:4px}
.ivs ::-webkit-scrollbar-track{background:transparent}
.ivs ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}
.ivs .root{min-height:100vh;background:var(--bg);display:flex;flex-direction:column}
.ivs .hdr{display:flex;align-items:center;justify-content:space-between;padding:11px 20px;background:var(--bg1);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;gap:10px;flex-wrap:wrap}
.ivs .hdr-left{display:flex;align-items:center;gap:10px}
.ivs .brand-dot{width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 10px var(--accent);animation:ivspulse 2s infinite}
@keyframes ivspulse{0%,100%{opacity:1}50%{opacity:.4}}
.ivs .brand-sub{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.2em}
.ivs .brand-title{font-size:15px;font-weight:800;color:var(--text)}
.ivs .brand-title span{color:var(--accent)}
.ivs .badges{display:flex;gap:5px;flex-wrap:wrap}
.ivs .badge{font-family:var(--mono);font-size:8px;letter-spacing:.1em;padding:2px 8px;border-radius:3px;border:1px solid}
.ivs .badge-b{color:var(--accent);background:rgba(0,212,255,.07);border-color:rgba(0,212,255,.18)}
.ivs .badge-g{color:var(--green);background:rgba(0,229,160,.06);border-color:rgba(0,229,160,.18)}
.ivs .badge-o{color:var(--orange);background:rgba(249,115,22,.07);border-color:rgba(249,115,22,.2)}
.ivs .layout{display:grid;grid-template-columns:295px 1fr;min-height:calc(100vh - 48px)}
@media (max-width:900px){.ivs .layout{grid-template-columns:1fr}}
.ivs .left{background:var(--bg1);border-right:1px solid var(--border);padding:16px;overflow-y:auto;display:flex;flex-direction:column;gap:12px}
.ivs .sec-title{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.18em;padding-bottom:5px;border-bottom:1px solid var(--border)}
.ivs .field{display:flex;flex-direction:column;gap:3px}
.ivs .field label{font-family:var(--mono);font-size:8px;color:var(--text2);letter-spacing:.08em}
.ivs .field input,.ivs .field select{background:var(--bg2);border:1px solid var(--border2);color:var(--text);font-family:var(--mono);font-size:12px;padding:7px 9px;border-radius:6px;outline:none;width:100%;transition:border-color .15s}
.ivs .field input:focus,.ivs .field select:focus{border-color:var(--accent)}
.ivs .field input::placeholder{color:var(--text3)}
.ivs .row2{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.ivs .row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px}
.ivs .mode-tabs{display:flex;gap:3px}
.ivs .mtab{flex:1;padding:6px 3px;border-radius:5px;border:1px solid var(--border2);background:var(--bg2);color:var(--text2);cursor:pointer;font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:.05em;transition:all .15s;text-align:center}
.ivs .mtab.on{background:rgba(0,212,255,.1);border-color:var(--accent);color:var(--accent)}
.ivs .btn-fetch{width:100%;padding:9px;border-radius:6px;border:1px solid rgba(0,212,255,.3);background:rgba(0,212,255,.09);color:var(--accent);font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:.08em;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .15s}
.ivs .btn-fetch:hover{background:rgba(0,212,255,.16)}
.ivs .btn-fetch:disabled{opacity:.4;cursor:not-allowed}
.ivs .btn-analyze{width:100%;padding:11px;border-radius:7px;border:1px solid rgba(0,212,255,.4);background:linear-gradient(135deg,rgba(0,212,255,.16),rgba(0,153,187,.1));color:var(--accent);font-family:var(--sans);font-size:13px;font-weight:700;letter-spacing:.02em;cursor:pointer;transition:all .2s}
.ivs .btn-analyze:disabled{opacity:.4;cursor:not-allowed}
.ivs .iv-rank-wrap{background:var(--bg2);border:1px solid var(--border);border-radius:7px;padding:9px 11px}
.ivs .iv-rank-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px}
.ivs .iv-rank-bar{height:4px;border-radius:2px;background:var(--bg3);overflow:hidden}
.ivs .iv-rank-fill{height:100%;border-radius:2px;transition:width .4s}
.ivs .notice{background:rgba(255,184,0,.05);border:1px solid rgba(255,184,0,.18);border-radius:5px;padding:7px 9px;font-family:var(--mono);font-size:9px;color:var(--yellow);line-height:1.7}
.ivs .msg-ok{background:rgba(0,229,160,.06);border:1px solid rgba(0,229,160,.18);border-radius:5px;padding:7px 9px;font-family:var(--mono);font-size:9px;color:var(--green);line-height:1.6}
.ivs .msg-err{background:rgba(255,69,96,.06);border:1px solid rgba(255,69,96,.18);border-radius:5px;padding:7px 9px;font-family:var(--mono);font-size:9px;color:var(--red);line-height:1.6}
.ivs .schwab-status{display:flex;align-items:center;gap:6px;padding:7px 10px;background:var(--bg2);border:1px solid var(--border);border-radius:6px}
.ivs .schwab-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.ivs .schwab-label{font-family:var(--mono);font-size:9px}
.ivs .right{background:var(--bg);padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:16px}
.ivs .empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;opacity:.35;text-align:center;padding:60px 20px}
.ivs .empty-icon{font-size:42px}
.ivs .empty-title{font-size:17px;font-weight:700;color:var(--text2)}
.ivs .empty-sub{font-family:var(--mono);font-size:10px;color:var(--text3);line-height:1.8}
.ivs .shdr{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.ivs .shdr-line{flex:1;height:1px;background:var(--border)}
.ivs .shdr-text{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.16em;white-space:nowrap}
.ivs .hero{display:flex;align-items:flex-start;justify-content:space-between;background:var(--bg1);border:1px solid var(--border);border-radius:10px;padding:14px 18px;gap:12px;flex-wrap:wrap}
.ivs .hero-name{font-size:24px;font-weight:800;color:var(--text);letter-spacing:-.02em}
.ivs .hero-price{font-family:var(--mono);font-size:19px;font-weight:500;color:var(--accent)}
.ivs .hero-meta{font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:2px}
.ivs .hero-stats{display:flex;gap:16px;align-items:flex-end;flex-wrap:wrap}
.ivs .hstat-label{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.08em;margin-bottom:2px}
.ivs .hstat-val{font-family:var(--mono);font-size:12px;font-weight:500;text-align:right}
.ivs .vix-banner{display:flex;align-items:center;gap:16px;padding:10px 16px;background:var(--bg1);border:1px solid var(--border);border-radius:8px;flex-wrap:wrap}
.ivs .vix-val{font-family:var(--mono);font-size:20px;font-weight:700}
.ivs .vix-regime{font-family:var(--mono);font-size:10px;letter-spacing:.12em;padding:3px 9px;border-radius:4px;font-weight:700}
.ivs .vix-sr{display:flex;gap:16px;margin-left:auto;flex-wrap:wrap}
.ivs .sr-item{text-align:right}
.ivs .sr-label{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.08em}
.ivs .sr-val{font-family:var(--mono);font-size:12px;font-weight:600}
.ivs .em-wrap,.ivs .chain-wrap,.ivs .greeks-wrap,.ivs .ai-wrap{background:var(--bg1);border:1px solid var(--border);border-radius:10px;overflow:hidden}
.ivs .em-head,.ivs .chain-head,.ivs .greeks-head,.ivs .ai-head{padding:11px 16px;background:rgba(0,212,255,.03);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
.ivs .em-head-title{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.16em}
.ivs .em-table,.ivs .chain-table,.ivs .gm-table{width:100%;border-collapse:collapse}
.ivs .em-table th,.ivs .chain-table th,.ivs .gm-table th{font-family:var(--mono);font-size:7.5px;color:var(--text3);letter-spacing:.1em;text-align:left;padding:6px 12px;border-bottom:1px solid var(--border);font-weight:500;white-space:nowrap}
.ivs .em-table th.r,.ivs .chain-table th,.ivs .gm-table th{text-align:right}
.ivs .chain-table th:first-child,.ivs .gm-table th:first-child{text-align:left}
.ivs .em-table td,.ivs .chain-table td,.ivs .gm-table td{padding:7px 12px;border-bottom:1px solid rgba(26,35,64,.4);vertical-align:middle;font-family:var(--mono);font-size:10px;text-align:right}
.ivs .em-table td:first-child,.ivs .chain-table td:first-child,.ivs .gm-table td:first-child{text-align:left}
.ivs .chain-table tr.itm td{background:rgba(0,212,255,.025)}
.ivs .chain-table tr.atm td{background:rgba(0,229,160,.04);font-weight:600}
.ivs .chain-scroll{max-height:480px;overflow-y:auto}
.ivs .chain-filters{display:flex;gap:6px;flex-wrap:wrap;padding:10px 16px;border-bottom:1px solid var(--border);background:rgba(0,0,0,.1)}
.ivs .chain-filter-btn{font-family:var(--mono);font-size:9px;padding:4px 10px;border-radius:4px;border:1px solid var(--border2);background:var(--bg2);color:var(--text2);cursor:pointer;transition:all .12s}
.ivs .chain-filter-btn.on{background:rgba(0,212,255,.1);border-color:var(--accent);color:var(--accent)}
.ivs .pop-pill{display:inline-flex;align-items:center;gap:3px;font-family:var(--mono);font-size:9px;font-weight:700;padding:2px 7px;border-radius:3px;white-space:nowrap}
.ivs .pnl-cell{display:flex;flex-direction:column;align-items:flex-end;gap:1px}
.ivs .pnl-target{font-family:var(--mono);font-size:9px;color:var(--green)}
.ivs .pnl-stop{font-family:var(--mono);font-size:9px;color:var(--red)}
.ivs .pnl-be{font-family:var(--mono);font-size:9px;color:var(--accent)}
.ivs .em-period{font-family:var(--mono);font-size:11px;font-weight:600;color:var(--text);white-space:nowrap}
.ivs .em-sub{font-family:var(--mono);font-size:8px;color:var(--text3);margin-top:1px}
.ivs .em-val{font-family:var(--mono);font-size:11px;font-weight:500;text-align:right;white-space:nowrap}
.ivs .em-range{font-family:var(--mono);font-size:9px;color:var(--text2);text-align:right;white-space:nowrap;line-height:1.5}
.ivs .em-bar-outer{height:4px;border-radius:2px;background:var(--bg3);position:relative;min-width:50px}
.ivs .em-bar-iv{height:100%;border-radius:2px;position:absolute;top:0;left:0;background:var(--accent)}
.ivs .em-bar-hv{height:3px;border-radius:1px;position:absolute;top:.5px;left:0;background:var(--green);opacity:.55}
.ivs .sig{font-family:var(--mono);font-size:8px;font-weight:600;padding:2px 6px;border-radius:3px;white-space:nowrap}
.ivs .sig-rich{background:rgba(255,69,96,.1);color:var(--red);border:1px solid rgba(255,69,96,.22)}
.ivs .sig-cheap{background:rgba(0,229,160,.08);color:var(--green);border:1px solid rgba(0,229,160,.22)}
.ivs .sig-fair{background:rgba(0,212,255,.07);color:var(--accent);border:1px solid rgba(0,212,255,.18)}
.ivs .sig-na{background:rgba(61,80,112,.1);color:var(--text3);border:1px solid rgba(61,80,112,.18)}
.ivs .em-footer{padding:10px 16px;border-top:1px solid var(--border);background:rgba(0,0,0,.12);display:flex;gap:14px;flex-wrap:wrap;align-items:center}
.ivs .em-leg{display:flex;align-items:center;gap:4px;font-family:var(--mono);font-size:8px;color:var(--text3)}
.ivs .em-leg-dot{width:9px;height:3px;border-radius:1px}
.ivs .greeks-inputs{display:grid;grid-template-columns:repeat(auto-fill,minmax(85px,1fr));gap:7px;padding:12px 16px;border-bottom:1px solid var(--border)}
.ivs .gi-field{display:flex;flex-direction:column;gap:3px}
.ivs .gi-label{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.07em}
.ivs .gi-input{background:var(--bg2);border:1px solid var(--border2);color:var(--text);font-family:var(--mono);font-size:12px;padding:5px 7px;border-radius:5px;outline:none;width:100%}
.ivs .type-tabs{display:flex;gap:3px}
.ivs .ttab{flex:1;padding:5px;border-radius:4px;border:1px solid var(--border2);background:var(--bg2);color:var(--text2);cursor:pointer;font-family:var(--mono);font-size:10px;font-weight:600;transition:all .15s;text-align:center}
.ivs .ttab.on{background:rgba(168,85,247,.1);border-color:var(--purple);color:var(--purple)}
.ivs .greeks-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));border-top:1px solid var(--border)}
.ivs .gcard{padding:12px 14px;border-right:1px solid var(--border);border-bottom:1px solid var(--border)}
.ivs .gcard-label{font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:.1em;margin-bottom:3px}
.ivs .gcard-val{font-family:var(--mono);font-weight:600;margin-bottom:2px}
.ivs .gcard-sub{font-family:var(--mono);font-size:8px;color:var(--text3);line-height:1.5}
.ivs .gcard-bar{height:3px;border-radius:2px;background:var(--bg3);margin-top:5px;overflow:hidden}
.ivs .gcard-bar-fill{height:100%;border-radius:2px}
.ivs .gm-wrap{overflow-x:auto;padding:0 16px 12px}
.ivs .ai-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:ivspulse 2s infinite}
.ivs .ai-lbl{font-family:var(--mono);font-size:9px;color:var(--accent);letter-spacing:.14em}
.ivs .ai-body{padding:14px;font-size:12.5px;color:var(--text2);line-height:1.8;white-space:pre-wrap}
.ivs .spin{width:14px;height:14px;border:2px solid rgba(0,212,255,.2);border-top-color:var(--accent);border-radius:50%;animation:ivsspin .7s linear infinite;display:inline-block;flex-shrink:0}
@keyframes ivsspin{to{transform:rotate(360deg)}}
.ivs .disc{font-family:var(--mono);font-size:8.5px;color:var(--text3);text-align:center;padding:5px 0}
`;

// ─── EM TABLE ────────────────────────────────────────────────────────────────
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
          <div style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",marginTop:2}}>±1 SD · sqrt-of-time scaling</div>
        </div>
        <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
          {ratio&&<span style={{fontFamily:"var(--mono)",fontSize:"10px",color:"var(--text2)"}}>
            IV/HV:<strong style={{color:+ratio>1.25?"var(--red)":+ratio<.8?"var(--green)":"var(--accent)",marginLeft:4}}>{ratio}×</strong>
          </span>}
          <span className={`sig ${sig.cls}`}>{sig.label}</span>
        </div>
      </div>
      <table className="em-table">
        <thead><tr><th>TIMEFRAME</th><th>IV ±</th>{hvN>0&&<th>HV ±</th>}<th>BAR</th><th>IV RANGE</th>{hvN>0&&<th>HV RANGE</th>}<th>SIGNAL</th></tr></thead>
        <tbody>
          {rows.map((r,i)=>{
            const ivW=maxEM>0?(r.ivEM/maxEM)*100:0;
            const hvW=maxEM>0?(r.hvEM/maxEM)*100:0;
            return(
              <tr key={i}>
                <td><div className="em-period">{r.period}</div><div className="em-sub">{r.sub}</div></td>
                <td><div className="em-val" style={{color:"var(--accent)"}}>±${r.ivEM.toFixed(2)}</div></td>
                {hvN>0&&<td><div className="em-val" style={{color:"var(--green)"}}>±${r.hvEM.toFixed(2)}</div></td>}
                <td style={{minWidth:60}}>
                  <div className="em-bar-outer">
                    <div className="em-bar-iv" style={{width:`${ivW}%`}}/>
                    {hvN>0&&<div className="em-bar-hv" style={{width:`${hvW}%`}}/>}
                  </div>
                </td>
                <td><div className="em-range">${(S-r.ivEM).toFixed(2)} – ${(S+r.ivEM).toFixed(2)}</div></td>
                {hvN>0&&<td><div className="em-range" style={{color:"var(--green)"}}>${(S-r.hvEM).toFixed(2)} – ${(S+r.hvEM).toFixed(2)}</div></td>}
                <td><span className={`sig ${sig.cls}`}>{sig.label}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── OPTION CHAIN ────────────────────────────────────────────────────────────
function OptionChainTable({chainData,spot,vix,intradayRange,support,resistance}){
  const [activeType, setActiveType]=useState("call");
  const [activeDTE,  setActiveDTE] =useState("all");
  const [activeRange,setActiveRange]=useState("all");
  if(!chainData)return null;
  const legs=activeType==="call"?chainData.calls:chainData.puts;
  const spotN=+spot, vixN=+vix||20;
  const dailyEM=emDaily(spotN,+chainData.volatility||20);
  const intradayRangePct=intradayRange?intradayRange/dailyEM:0;
  const dteGroups=[...new Set(legs.map(l=>l.dte))].sort((a,b)=>a-b);
  const filteredByDTE= activeDTE==="all"?legs:legs.filter(l=>l.dte===+activeDTE);
  const filtered = filteredByDTE.filter(l=>{
    if(activeRange==="all")return true;
    if(activeRange==="itm")return l.inTheMoney;
    if(activeRange==="otm")return !l.inTheMoney;
    if(activeRange==="ntm"){const dist=Math.abs(l.strike-spotN)/spotN; return dist<=0.05;}
    return true;
  });
  const atmStrike=legs.length>0?legs.reduce((prev,curr)=>
    Math.abs(curr.strike-spotN)<Math.abs(prev.strike-spotN)?curr:prev,legs[0])?.strike:spotN;
  return(
    <div className="chain-wrap">
      <div className="chain-head">
        <div>
          <div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--text3)",letterSpacing:".16em"}}>
            LIVE OPTION CHAIN — {chainData.underlyingSymbol}
          </div>
          <div style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",marginTop:2}}>
            {chainData.numberOfContracts} contracts · Live Schwab Greeks
          </div>
        </div>
        <div style={{display:"flex",gap:5}}>
          {["call","put"].map(t=>(
            <button key={t} className={`chain-filter-btn${activeType===t?" on":""}`} onClick={()=>setActiveType(t)} style={{textTransform:"uppercase"}}>{t}S</button>
          ))}
        </div>
      </div>
      <div className="chain-filters">
        <span style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",marginRight:4,alignSelf:"center"}}>DTE:</span>
        {["all",...dteGroups.slice(0,6).map(String)].map(d=>(
          <button key={d} className={`chain-filter-btn${activeDTE===d?" on":""}`} onClick={()=>setActiveDTE(d)}>{d==="all"?"ALL":d+"d"}</button>
        ))}
        <span style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)",marginLeft:8,marginRight:4,alignSelf:"center"}}>RANGE:</span>
        {[["all","ALL"],["ntm","NTM"],["itm","ITM"],["otm","OTM"]].map(([v,l])=>(
          <button key={v} className={`chain-filter-btn${activeRange===v?" on":""}`} onClick={()=>setActiveRange(v)}>{l}</button>
        ))}
      </div>
      <div className="chain-scroll">
        <table className="chain-table">
          <thead><tr>
            <th>STRIKE</th><th>BID</th><th>ASK</th><th>MID</th>
            <th>Δ</th><th>Γ</th><th>Θ</th><th>V</th><th>IV%</th><th>OI</th>
            <th>% PROFIT</th><th>P&L L</th><th>P&L S</th>
          </tr></thead>
          <tbody>
            {filtered.map((leg,i)=>{
              const isATM=leg.strike===atmStrike;
              const isITM=leg.inTheMoney;
              const distFromSupport=support?(leg.strike-support)/spotN:null;
              const popLong =calcPOP(leg.greeks.delta,leg.iv,vixN,intradayRangePct,distFromSupport,activeType,"long");
              const popShort=calcPOP(leg.greeks.delta,leg.iv,vixN,intradayRangePct,distFromSupport,activeType,"short");
              const popL=popLabel(popLong);
              const popS=popLabel(popShort);
              const pnl=leg.pnl||{};
              const long_=pnl.long||{}, short_=pnl.short||{};
              return(
                <tr key={i} className={isATM?"atm":isITM?"itm":""}>
                  <td><div style={{fontFamily:"var(--mono)",fontSize:"11px",fontWeight:isATM?800:500,color:isATM?"var(--green)":isITM?"var(--accent)":"var(--text)"}}>${leg.strike}</div></td>
                  <td style={{color:"var(--text2)"}}>${leg.bid}</td>
                  <td style={{color:"var(--text2)"}}>${leg.ask}</td>
                  <td style={{color:"var(--accent)",fontWeight:600}}>${leg.mid}</td>
                  <td style={{color:Math.abs(leg.greeks.delta)>=0.6?"var(--green)":Math.abs(leg.greeks.delta)>=0.4?"var(--yellow)":"var(--text2)",fontWeight:600}}>{leg.greeks.delta.toFixed(3)}</td>
                  <td style={{color:"var(--yellow)"}}>{leg.greeks.gamma.toFixed(5)}</td>
                  <td style={{color:"var(--red)"}}>${leg.greeks.theta.toFixed(3)}</td>
                  <td style={{color:"var(--purple)"}}>${leg.greeks.vega.toFixed(3)}</td>
                  <td style={{color:"var(--text2)"}}>{leg.iv.toFixed(1)}%</td>
                  <td style={{color:"var(--text3)"}}>{leg.oi?.toLocaleString()}</td>
                  <td>
                    <div style={{display:"flex",flexDirection:"column",gap:2,alignItems:"flex-end"}}>
                      <div className="pop-pill" style={{background:`${popL.color}18`,border:`1px solid ${popL.color}30`,color:popL.color}}>L {(popLong*100).toFixed(0)}%</div>
                      <div className="pop-pill" style={{background:`${popS.color}18`,border:`1px solid ${popS.color}30`,color:popS.color}}>S {(popShort*100).toFixed(0)}%</div>
                    </div>
                  </td>
                  <td><div className="pnl-cell">
                    <div className="pnl-target">🎯 ${long_.profitTarget}</div>
                    <div className="pnl-stop">🛑 ${long_.stopLoss}</div>
                    <div className="pnl-be">BE ${long_.breakeven}</div>
                  </div></td>
                  <td><div className="pnl-cell">
                    <div className="pnl-target">🎯 ${short_.profitTarget}</div>
                    <div className="pnl-stop">🛑 ${short_.stopLoss}</div>
                  </div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── GREEKS CALC ─────────────────────────────────────────────────────────────
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
  return(
    <div className="greeks-wrap">
      <div className="greeks-head">
        <div><div style={{fontFamily:"var(--mono)",fontSize:"9px",color:"var(--text3)",letterSpacing:".16em"}}>BLACK-SCHOLES GREEK CALCULATOR</div></div>
        <div className="type-tabs" style={{width:110}}>
          {["call","put"].map(t=>(<div key={t} className={`ttab${type===t?" on":""}`} onClick={()=>setType(t)}>{t.toUpperCase()}</div>))}
        </div>
      </div>
      <div className="greeks-inputs">
        {[["SPOT",spot,"",true],["STRIKE",strike,String(spot)||"K",false],["DTE",dte,"30",false],["IV%",effIV,"IV%",false],["RF%",rf,"5.3",false]].map(([l,v,ph,ro])=>(
          <div key={l} className="gi-field">
            <div className="gi-label">{l}</div>
            <input className="gi-input" type={ro?"text":"number"} value={v as any} readOnly={ro as any} placeholder={ph as any}
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
        <div className="greeks-grid">
          {[
            {label:"PRICE",val:`$${g.price}`,sub:`Intr $${g.intrinsic} + Ext $${g.extrinsic}`,color:"var(--accent)"},
            {label:"DELTA Δ",val:g.delta.toFixed(4),sub:type==="call"?"$/+1":"$/-1",color:dc(g.delta)},
            {label:"GAMMA Γ",val:g.gamma.toFixed(6),sub:"Δ change/$1",color:"var(--yellow)"},
            {label:"THETA Θ/d",val:`$${g.theta.toFixed(4)}`,sub:"daily decay",color:"var(--red)"},
            {label:"VEGA V/1%",val:`$${g.vega.toFixed(4)}`,sub:"per 1% IV",color:"var(--purple)"},
            {label:"BREAKEVEN",val:`$${g.breakeven}`,sub:`${((Math.abs(g.breakeven-S)/S)*100).toFixed(2)}%`,color:"var(--yellow)"},
            {label:"POP",val:`${((type==="call"?Math.abs(g.delta):1-Math.abs(g.delta))*100).toFixed(0)}%`,sub:"Δ proxy",color:"var(--green)"},
          ].map((c,i)=>(
            <div key={i} className="gcard">
              <div className="gcard-label">{c.label}</div>
              <div className="gcard-val" style={{color:c.color,fontSize:"15px"}}>{c.val}</div>
              <div className="gcard-sub">{c.sub}</div>
            </div>
          ))}
        </div>
      ):(
        <div style={{padding:"18px",textAlign:"center",fontFamily:"var(--mono)",fontSize:"10px",color:"var(--text3)"}}>Enter spot price and IV% to compute Greeks</div>
      )}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function IVStrikeSelector(){
  const [ticker,setTicker]=useState("");
  const [spot,setSpot]=useState("");
  const [iv,setIv]=useState("");
  const [hv,setHv]=useState("");
  const [vix,setVix]=useState("");
  const [ivLow,setIvLow]=useState("");
  const [ivHigh,setIvHigh]=useState("");
  const [support,setSupport]=useState("");
  const [resist,setResist]=useState("");
  const [intRange,setIntRange]=useState("");
  const [mode,setMode]=useState("BOTH");
  const [chainDTE,setChainDTE]=useState("30");
  const [chainStrikes,setChainStrikes]=useState("20");
  const [fetching,setFetching]=useState(false);
  const [analyzing,setAnalyzing]=useState(false);
  const [fetchMsg,setFetchMsg]=useState({text:"",ok:false});
  const [aiText,setAiText]=useState("");
  const [chainData,setChainData]=useState(null);
  const [schwabOk,setSchwabOk]=useState(false);
  const [loadingChain,setLoadingChain]=useState(false);
  const abortRef=useRef(null);

  const ivRank=ivLow&&ivHigh&&iv?ivRankCalc(+iv,+ivLow,+ivHigh):50;
  const rankColor=ivRank<30?"var(--green)":ivRank<60?"var(--yellow)":"var(--red)";
  const vixN=+vix||20;
  const vixRegime=vixN<15?"CALM":vixN<20?"NORMAL":vixN<30?"ELEVATED":vixN<40?"STRESSED":"PANIC";
  const vixColor=vixN<15?"var(--green)":vixN<20?"var(--accent)":vixN<30?"var(--yellow)":vixN<40?"var(--orange)":"var(--red)";

  const connectSchwab = () => window.open(AUTH_START_URL, "_blank", "width=600,height=700");

  const fetchData=useCallback(async()=>{
    if(!ticker.trim())return;
    setFetching(true); setFetchMsg({text:"",ok:false});
    const sym=ticker.trim().toUpperCase();
    try{
      const [qR,vR,hR]=await Promise.all([
        fetch(`${PROXY_BASE}/quote?symbol=${sym}`),
        fetch(`${PROXY_BASE}/vix`),
        fetch(`${PROXY_BASE}/history?symbol=${sym}&period=10&periodType=day&freq=5&freqType=minute`),
      ]);
      if(qR.status===401){ setSchwabOk(false); setFetchMsg({text:"Not connected to Schwab. Click Connect Schwab.",ok:false}); return; }
      const [q,v,h]=await Promise.all([qR.json(),vR.json(),hR.json()]);
      setSpot(q.price?q.price.toFixed(2):"");
      const ivVal = q.iv || 0;
      setIv(ivVal.toFixed(1));
      setIvLow(Math.max(10,(ivVal||20)-20)+"");
      setIvHigh(Math.min(120,(ivVal||20)+30)+"");
      if(!hv && h.hv20) setHv(h.hv20.toFixed(1));
      setVix(v.vix?v.vix.toFixed(2):"");
      setSupport(h.support?h.support.toFixed(2):"");
      setResist(h.resistance?h.resistance.toFixed(2):"");
      setIntRange(h.intradayRange?h.intradayRange.toFixed(2):"");
      setSchwabOk(true);
      setFetchMsg({text:`✓ ${sym} $${q.price?.toFixed(2)} · IV ${ivVal.toFixed(1)}% · VIX ${v.vix?.toFixed(2)} · live Schwab data`,ok:true});
    }catch(e){
      setSchwabOk(false);
      setFetchMsg({text:`Fetch failed: ${(e as any).message}. Use manual entry below.`,ok:false});
    }finally{setFetching(false);}
  },[ticker,hv]);

  const loadChain=useCallback(async()=>{
    if(!ticker)return;
    setLoadingChain(true);
    try{
      const res=await fetch(`${PROXY_BASE}/chain?symbol=${ticker.toUpperCase()}&dte=${chainDTE}&strikes=${chainStrikes}&type=ALL`);
      if(!res.ok)throw new Error(`Chain error ${res.status}`);
      setChainData(await res.json());
    }catch(e){ setFetchMsg({text:`Chain failed: ${(e as any).message}`,ok:false}); }
    finally{setLoadingChain(false);}
  },[ticker,chainDTE,chainStrikes]);

  const analyze=useCallback(()=>{
    if(!spot||!iv)return;
    setAnalyzing(true); setAiText("");
    const S=+spot,ivN=+iv,hvN=+hv||0;
    const dEM=emDaily(S,ivN).toFixed(2),mEM=emCal(S,ivN,30).toFixed(2);
    const ratio=hvN>0?(ivN/hvN).toFixed(2):"N/A";
    const g_atm=bsGreeks(S,S,30/365,RF,ivN/100,"call");
    const out =
`SUMMARY — ${ticker||"STOCK"} @ $${spot}
IV ${iv}% · HV ${hv||"—"} · IV/HV ${ratio}× · IV Rank ${ivRank}% · VIX ${vix||"—"} (${vixRegime})

EXPECTED MOVE: ±$${dEM}/day · ±$${mEM}/month
S/R: support $${support||"?"} · resistance $${resist||"?"}

ATM 30DTE CALL Greeks:
  Δ ${g_atm?.delta} · Γ ${g_atm?.gamma} · Θ $${g_atm?.theta}/day · V $${g_atm?.vega}/1%

EDGE: ${+ratio>1.25?"IV RICH — favor credit spreads / iron condors.":+ratio<.8?"IV CHEAP — favor long premium / debit spreads.":"IV fair — directional or calendar plays."}
MODE: ${mode}`;
    setAiText(out); setAnalyzing(false);
  },[spot,iv,hv,vix,ivRank,vixRegime,mode,ticker,support,resist]);

  return(
    <div className="ivs">
      <Helmet><title>IV Strike Selector</title><meta name="robots" content="noindex,nofollow"/></Helmet>
      <style>{CSS}</style>
      <div className="root">
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
            <span className={`badge ${schwabOk?"badge-g":"badge-b"}`}>{schwabOk?"SCHWAB LIVE":"DISCONNECTED"}</span>
            <button onClick={connectSchwab} className="badge badge-b" style={{cursor:"pointer",background:"transparent"}}>↗ CONNECT</button>
          </div>
        </div>

        <div className="layout">
          <div className="left">
            <div className="schwab-status">
              <div className="schwab-dot" style={{background:schwabOk?"var(--green)":"var(--yellow)"}}/>
              <div className="schwab-label" style={{color:schwabOk?"var(--green)":"var(--yellow)"}}>
                {schwabOk?"Schwab API Connected":"Not connected — click ↗ CONNECT above"}
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div className="sec-title">Market Data</div>
              <div className="field">
                <label>TICKER</label>
                <input value={ticker} onChange={e=>setTicker(e.target.value.toUpperCase())} placeholder="SPY, NVDA, AAPL…" onKeyDown={e=>e.key==="Enter"&&fetchData()}/>
              </div>
              <button className="btn-fetch" onClick={fetchData} disabled={!ticker||fetching}>
                {fetching?<><span className="spin"/>FETCHING…</>:<>⟳ FETCH LIVE DATA</>}
              </button>
              {fetchMsg.text&&<div className={fetchMsg.ok?"msg-ok":"msg-err"}>{fetchMsg.text}</div>}
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div className="sec-title">Manual Override</div>
              <div className="row2">
                <div className="field"><label>SPOT ($)</label><input type="number" value={spot} onChange={e=>setSpot(e.target.value)} placeholder="560.00"/></div>
                <div className="field"><label>IV %</label><input type="number" value={iv} onChange={e=>setIv(e.target.value)} placeholder="13"/></div>
              </div>
              <div className="row3">
                <div className="field"><label>HV %</label><input type="number" value={hv} onChange={e=>setHv(e.target.value)} placeholder="11"/></div>
                <div className="field"><label>VIX</label><input type="number" value={vix} onChange={e=>setVix(e.target.value)} placeholder="18"/></div>
                <div className="field"><label>IV RANK %</label><input type="number" readOnly value={ivRank as any} style={{color:rankColor}}/></div>
              </div>
              <div className="row2">
                <div className="field"><label>52W IV LOW</label><input type="number" value={ivLow} onChange={e=>setIvLow(e.target.value)} placeholder="10"/></div>
                <div className="field"><label>52W IV HIGH</label><input type="number" value={ivHigh} onChange={e=>setIvHigh(e.target.value)} placeholder="60"/></div>
              </div>
              {iv&&ivLow&&ivHigh&&(
                <div className="iv-rank-wrap">
                  <div className="iv-rank-row">
                    <span style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)"}}>IV RANK</span>
                    <span style={{fontFamily:"var(--mono)",fontSize:"11px",color:rankColor,fontWeight:600}}>{ivRank}% — {ivRank<30?"LOW":ivRank<60?"MODERATE":"HIGH"}</span>
                  </div>
                  <div className="iv-rank-bar"><div className="iv-rank-fill" style={{width:`${ivRank}%`,background:rankColor}}/></div>
                </div>
              )}
              <div className="row2">
                <div className="field"><label>SUPPORT</label><input type="number" value={support} onChange={e=>setSupport(e.target.value)} placeholder="auto"/></div>
                <div className="field"><label>RESISTANCE</label><input type="number" value={resist} onChange={e=>setResist(e.target.value)} placeholder="auto"/></div>
              </div>
              <div className="field"><label>INTRADAY RANGE</label><input type="number" value={intRange} onChange={e=>setIntRange(e.target.value)} placeholder="auto"/></div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div className="sec-title">Mode</div>
              <div className="mode-tabs">{["LEAPS","0DTE","BOTH"].map(m=>(<div key={m} className={`mtab${mode===m?" on":""}`} onClick={()=>setMode(m)}>{m}</div>))}</div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div className="sec-title">Option Chain</div>
              <div className="row2">
                <div className="field"><label>DTE</label><input type="number" value={chainDTE} onChange={e=>setChainDTE(e.target.value)}/></div>
                <div className="field"><label>STRIKES</label><input type="number" value={chainStrikes} onChange={e=>setChainStrikes(e.target.value)}/></div>
              </div>
              <button className="btn-fetch" onClick={loadChain} disabled={!ticker||loadingChain}>
                {loadingChain?<><span className="spin"/>LOADING…</>:"📊 LOAD CHAIN"}
              </button>
            </div>

            <button className="btn-analyze" onClick={analyze} disabled={!spot||!iv||analyzing}>
              {analyzing?<span style={{display:"flex",alignItems:"center",gap:7,justifyContent:"center"}}><span className="spin"/>ANALYZING…</span>:"⚡ GENERATE ANALYSIS"}
            </button>
            <div className="disc">Not financial advice · Options involve risk of loss</div>
          </div>

          <div className="right">
            {!spot&&!iv&&(
              <div className="empty">
                <div className="empty-icon">◎</div>
                <div className="empty-title">IV Strike Selector</div>
                <div className="empty-sub">Connect Schwab → Enter ticker → Fetch → Analyze<br/><br/>Expected Move · Live Greeks · Option Chain · POP</div>
              </div>
            )}
            {spot&&iv&&(<>
              <div className="hero">
                <div>
                  <div className="hero-name">{ticker||"STOCK"}</div>
                  <div className="hero-price">${(+spot).toFixed(2)}</div>
                  <div className="hero-meta">{new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}</div>
                </div>
                <div className="hero-stats">
                  {[["IV",iv+"%","var(--yellow)"],
                    hv?["HV",hv+"%","var(--green)"]:null,
                    hv?["IV/HV",(+iv/+hv).toFixed(2)+"×",+iv/+hv>1.25?"var(--red)":+iv/+hv<.8?"var(--green)":"var(--accent)"]:null,
                    ["IV RNK",ivRank+"%",rankColor],
                    ["MODE",mode,"var(--accent)"],
                  ].filter(Boolean).map((arr:any)=>{
                    const [l,v,c]=arr;
                    return(<div key={l} style={{textAlign:"right"}}>
                      <div className="hstat-label">{l}</div>
                      <div className="hstat-val" style={{color:c}}>{v}</div>
                    </div>);
                  })}
                </div>
              </div>

              {(vix||support||resist)&&(
                <div className="vix-banner">
                  {vix&&(<>
                    <div>
                      <div style={{fontFamily:"var(--mono)",fontSize:"8px",color:"var(--text3)"}}>VIX</div>
                      <div className="vix-val" style={{color:vixColor}}>{(+vix).toFixed(2)}</div>
                    </div>
                    <div className="vix-regime" style={{background:`${vixColor}18`,border:`1px solid ${vixColor}35`,color:vixColor}}>{vixRegime}</div>
                  </>)}
                  <div className="vix-sr">
                    {support&&<div className="sr-item"><div className="sr-label">▲ SUPPORT</div><div className="sr-val" style={{color:"var(--green)"}}>${(+support).toFixed(2)}</div></div>}
                    {resist&&<div className="sr-item"><div className="sr-label">▼ RESIST</div><div className="sr-val" style={{color:"var(--red)"}}>${(+resist).toFixed(2)}</div></div>}
                    {intRange&&<div className="sr-item"><div className="sr-label">RANGE</div><div className="sr-val" style={{color:"var(--accent)"}}>${(+intRange).toFixed(2)}</div></div>}
                  </div>
                </div>
              )}

              <div>
                <div className="shdr"><div className="shdr-text">EXPECTED MOVE</div><div className="shdr-line"/></div>
                <EMTable spot={spot} iv={iv} hv={hv}/>
              </div>

              {chainData&&(
                <div>
                  <div className="shdr"><div className="shdr-text">OPTION CHAIN</div><div className="shdr-line"/></div>
                  <OptionChainTable chainData={chainData} spot={spot} vix={vix} intradayRange={+intRange} support={+support} resistance={+resist}/>
                </div>
              )}

              <div>
                <div className="shdr"><div className="shdr-text">GREEKS CALCULATOR</div><div className="shdr-line"/></div>
                <GreeksCalc spot={spot} iv={iv}/>
              </div>

              {aiText&&(
                <div className="ai-wrap">
                  <div className="ai-head"><div className="ai-dot"/><div className="ai-lbl">ANALYSIS</div></div>
                  <div className="ai-body">{aiText}</div>
                </div>
              )}
            </>)}
          </div>
        </div>
      </div>
    </div>
  );
}
