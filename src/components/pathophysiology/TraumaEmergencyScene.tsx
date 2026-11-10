import { TRAUMA_LESSONS, traumaState, type TraumaKind, type TraumaStructure } from '@/data/pathophysiology/traumaEmergencies';
import { makeHit, Label, Meter, pv } from './sceneKit';
import FlowParticles from './FlowParticles';

type Props = { kind: TraumaKind; time: number; normal?: boolean; compact?: boolean; showLabels: boolean; selected: TraumaStructure | null; onSelect: (id: TraumaStructure) => void };
type State = ReturnType<typeof traumaState>;
type Hit = ReturnType<typeof makeHit<TraumaStructure>>;
const red = '#ed8a89', blue = '#70b9ed', amber = '#efca69';

function Compartment({s,hit,showLabels}:{s:State;hit:Hit;showLabels:boolean}) {
  const gap = 22*s.response;
  return <>
    <Label show={showLabels} x={35} y={48} size={13}>One limb compartment · cross-section</Label>
    <g {...hit('space')}>
      <path d={`M${249-gap} 83C153 83 113 149 113 210C113 280 170 328 249 328C328 328 385 280 385 210C385 149 345 83 ${249+gap} 83`} fill={pv('serosa', .2)} stroke={pv('ink',.8)} strokeWidth="7"/>
      <Label show={showLabels} x={170} y={360} size={12}>{s.response>.1?'Fascia opened':'Restraining fascia'}</Label>
    </g>
    <g {...hit('tissue')}>
      {[[-48,-32],[40,-40],[-42,48],[44,43]].map(([x,y],i)=><ellipse key={i} cx={249+x} cy={210+y} rx={42+7*s.onset} ry={37+7*s.onset} fill={pv('serosa',.7)} stroke={pv('serosa')} strokeWidth="3"/>) }
      <ellipse cx="249" cy="211" rx="107" ry="92" fill="#4f3043" opacity={s.retainedInjury*.44}/>
      <circle cx="286" cy="225" r="8" fill={amber}/><Label show={showLabels} x={299} y={229} size={11}>Nerve</Label>
      <Label show={showLabels} x={202} y={194} size={12}>Muscle</Label>
    </g>
    <g {...hit('injury')}><path d="M91 108L125 133M100 94L132 118" stroke={amber} strokeWidth="5" opacity={s.onset}/><Label show={showLabels} x={37} y={89} size={12}>Trauma / edema</Label></g>
    <g {...hit('flow')}>
      <circle cx="221" cy="227" r={14-8*s.pressure} fill={red}/><circle cx="248" cy="237" r={12-8*s.pressure} fill={blue}/>
      <FlowParticles from={[196,227]} to={[273,227]} time={s.time} strength={s.perfusion} color={red} count={5}/>
      <Label show={showLabels} x={177} y={274} size={11}>Small vessels</Label>
    </g>
    <g aria-hidden><rect x="449" y="102" width="255" height="160" rx="15" fill={pv('panel')} stroke={pv('ink',.3)}/><Label show={showLabels} x={464} y={127} size={13}>Pressure and flow</Label><Meter x={465} y={169} w={220} label="Compartment pressure" value={s.pressure} color={amber}/><Meter x={465} y={219} w={220} label="Tissue perfusion" value={s.perfusion} color={red}/></g>
  </>;
}

function Vascular({s,hit,showLabels}:{s:State;hit:Hit;showLabels:boolean}) {
  return <>
    <Label show={showLabels} x={35} y={48} size={13}>Longitudinal limb and artery · proximal to distal</Label>
    <g {...hit('space')}><path d="M85 120H310L328 133L346 119H610" fill="none" stroke={pv('ink',.5)} strokeWidth="28"/><Label show={showLabels} x={105} y={102}>Bone</Label></g>
    <g {...hit('flow')}><path d="M72 200H643" stroke={red} strokeWidth="44" strokeLinecap="round"/><path d="M72 200H643" stroke="#5b2834" strokeWidth="28" strokeLinecap="round"/>
      <FlowParticles from={[80,200]} to={[314,200]} time={s.time} color={red} count={9}/><FlowParticles from={[354,200]} to={[643,200]} time={s.time} strength={s.perfusion} color={red} count={9}/>
      <ellipse cx="331" cy="200" rx="19" ry={13*s.progression*(1-.7*s.response)} fill={amber}/><Label show={showLabels} x={91} y={180} size={12}>Arterial lumen</Label></g>
    <g {...hit('injury')}><path d="M313 182L325 193L335 185L350 196" stroke={amber} strokeWidth="4" fill="none" opacity={s.onset}/><Label show={showLabels} x={282} y={257} size={12}>{s.response>.1?'Repair / restoration':'Wall injury / thrombus'}</Label></g>
    <g {...hit('tissue')}><rect x="530" y="264" width="170" height="55" rx="15" fill={pv('serosa',.65)} stroke={red}/><rect x="530" y="264" width="170" height="55" rx="15" fill="#4f3043" opacity={s.retainedInjury*.5}/><Label show={showLabels} x={551} y={297} size={12}>Distal tissue</Label></g>
    <g aria-hidden><Meter x={80} y={317} w={350} label="Distal perfusion · qualitative" value={s.perfusion} color={red}/></g>
  </>;
}

function Pneumothorax({s,hit,showLabels}:{s:State;hit:Hit;showLabels:boolean}) {
  const collapse = s.pressure*.7, shift = s.injury*18*(1-.7*s.response);
  return <>
    <Label show={showLabels} x={35} y={46} size={13}>Anterior chest · patient right on viewer left</Label>
    <g {...hit('space')}><path d="M95 77Q248 40 400 77Q425 188 395 312Q249 342 102 312Q72 190 95 77Z" fill={pv('panel')} stroke={pv('ink',.6)} strokeWidth="3"/><path d="M107 97Q153 70 222 94L222 293Q155 316 110 291Z" fill={pv('fluid',.12+.34*s.pressure)}/><Label show={showLabels} x={90} y={330} size={12}>Patient right pleural space</Label></g>
    <g {...hit('tissue')}>
      <path transform={`translate(${s.pressure*55} ${s.pressure*23}) scale(${1-collapse} ${1-collapse*.35})`} d="M150 107Q107 139 119 266Q142 294 217 275L220 122Q195 96 150 107Z" fill={pv('serosa',.7)} stroke={red} strokeWidth="3"/>
      <path d="M281 122Q305 97 350 107Q394 140 381 265Q356 294 282 275Z" fill={pv('serosa',.7)} stroke={red} strokeWidth="3"/>
      <Label show={showLabels} x={295} y={193}>Left lung</Label>
    </g>
    <g {...hit('flow')}><path d={`M${250+shift} 92V178`} stroke={pv('ink',.65)} strokeWidth="10"/><path d={`M${250+shift} 178Q${222+shift} 182 ${228+shift} 224Q${235+shift} 250 ${260+shift} 269Q${288+shift} 249 ${294+shift} 222Q${296+shift} 191 ${270+shift} 183Z`} fill={red}/>
      <FlowParticles from={[249+shift,93]} to={[249+shift,178]} time={s.time} strength={s.perfusion} color={blue}/><Label show={showLabels} x={244+shift} y={225} size={11}>Heart</Label></g>
    <g {...hit('injury')}><path d="M147 177l12 9-8 10" stroke={amber} strokeWidth="4" fill="none" opacity={s.onset}/><FlowParticles from={[148,181]} to={[111,182]} time={s.time} strength={s.onset*(1-s.response)} color={amber}/><Label show={showLabels} x={95} y={72} size={12}>Air leak</Label></g>
    {s.response>.01 && <g opacity={s.response}><path d="M112 235H65L48 256" fill="none" stroke={pv('ink')} strokeWidth="5"/><FlowParticles from={[108,235]} to={[49,255]} time={s.time} color={blue}/><Label show={showLabels} x={27} y={282} size={11}>Pleural drain</Label></g>}
    <g aria-hidden><rect x="461" y="108" width="249" height="148" rx="15" fill={pv('panel')} stroke={pv('ink',.3)}/><Meter x={480} y={155} w={210} label="Pleural pressure" value={s.pressure} color={amber}/><Meter x={480} y={215} w={210} label="Venous return" value={s.perfusion} color={blue}/></g>
  </>;
}

export default function TraumaEmergencyScene({kind,time,normal,compact,showLabels,selected,onSelect}:Props) {
  const s=traumaState(kind,time,normal), hit=makeHit(TRAUMA_LESSONS[kind].structures,selected,onSelect,compact);
  const props={s,hit,showLabels};
  return <svg viewBox="0 0 750 380" role="group" aria-label={TRAUMA_LESSONS[kind].title} className="block h-auto w-full rounded-lg patho-scene" style={{background:pv('bg')}}>
    {kind==='compartment'&&<Compartment {...props}/>}{kind==='vascular'&&<Vascular {...props}/>}{kind==='pneumothorax'&&<Pneumothorax {...props}/>}
  </svg>;
}
