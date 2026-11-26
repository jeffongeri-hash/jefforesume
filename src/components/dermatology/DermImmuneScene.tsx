import { Label, makeHit, pv } from '@/components/pathophysiology/sceneKit';
import FlowParticles from '@/components/pathophysiology/FlowParticles';
import { STAGES, sceneState, type Scenario, type Stage, type Target } from '@/data/dermImmunePathways';
type Props={item:Scenario;time:number;normal?:boolean;target:Target|null;selected:Stage|null;onSelect:(s:Stage)=>void;labels:boolean};
const blue='#79c7e8',gold='#efce73',pink='#e5919d',violet='#c0a3dc';
export default function DermImmuneScene({item:c,time,normal,target,selected,onSelect,labels}:Props){
 const s=sceneState(time,normal),hit=makeHit(c.stages,selected,onSelect),p=[s.signal,s.effector,s.tissue,s.treatment];
 const drug=target&&!normal?s.treatment:0,activity=s.tissue,kind=c.drawing;
 const label=(x:number,y:number,t:string,size=12)=><Label show={labels} x={x} y={y} size={size}>{t}</Label>;
 const spots=(y:number,color:string,amount:number)=>Array.from({length:7},(_,i)=><circle key={i} cx={74+i*53} cy={y+7*Math.sin(s.time*.5+i)} r="5" fill={color} opacity={amount}/>);
 return <svg viewBox="0 0 960 520" role="group" aria-label={`${c.title} conceptual immune pathway and skin cross-section`} className="patho-scene block h-auto w-full rounded-xl border border-border" style={{background:pv('bg')}}>
  {label(25,31,'SKIN · ENLARGED CROSS-SECTION',14)}{label(508,31,'SIGNAL PATHWAY · SELECT A STEP',14)}
  <rect x="35" y="345" width="420" height="104" fill={gold} fillOpacity=".18"/>{Array.from({length:14},(_,i)=><circle key={i} cx={53+(i%7)*61} cy={370+Math.floor(i/7)*50} r="18" fill={gold} fillOpacity=".18" stroke={gold} strokeOpacity=".3"/>)}
  {kind==='fat'&&<ellipse cx="240" cy="391" rx={64*activity} ry="35" fill={gold} fillOpacity=".55" stroke={gold} opacity={activity}/>}
  <rect x="35" y="220" width="420" height="125" fill={pv('serosa',.45)}/><path d="M48 302H440" stroke={pink} strokeWidth="11"/><FlowParticles from={[54,302]} to={[435,302]} time={s.time} color={pink} count={8}/>
  <path d={`M35 ${174-(kind==='plaque'?16*activity:0)}H455V220H35Z`} fill={pv('serosa',.9)} stroke={pv('ink',.45)} strokeWidth="2"/><path d={`M35 ${174-(kind==='plaque'?16*activity:0)}H455`} stroke={pv('ink',.7)} strokeWidth="7"/>
  {kind==='plaque'&&Array.from({length:8},(_,i)=><path key={i} d={`M${70+i*42} ${160-16*activity}l24-5`} stroke={pv('ink')} strokeWidth="5" opacity={activity}/>)}
  {c.id==='gpp'&&Array.from({length:8},(_,i)=><circle key={i} cx={80+i*45} cy="172" r="6" fill={gold} opacity={activity}/>)}
  {kind==='barrier'&&<><path d="M116 171l8 14-6 10M233 171l7 14-7 10M354 171l7 14-7 10" fill="none" stroke={pink} strokeWidth="4" opacity={activity}/>{spots(198,blue,activity)}</>}
  {kind==='phototoxic'&&<><path d="M150 67l-9 42h16l-10 33M249 67l-9 42h16l-10 33" stroke={gold} strokeWidth="4" fill="none" opacity={s.signal}/><path d="M116 176l16 12m71-12 17 12m70-12 16 12" stroke={pink} strokeWidth="7" opacity={activity}/>{spots(212,violet,s.treatment)}</>}
  {kind==='pigment'&&Array.from({length:8},(_,i)=><g key={i}><circle cx={65+i*50} cy="217" r="6" fill={violet} opacity={1-.85*activity}/><path d={`M${65+i*50} 217l-7-7m7 7 7-7`} stroke={violet} strokeWidth="2" opacity={1-.85*activity}/></g>)}
  {kind==='interface'&&<>{spots(219,pink,activity)}{spots(245,violet,s.effector)}</>}
  {c.id==='sjsten'&&<>{spots(185,pink,activity)}{spots(203,pink,activity)}<path d="M78 220H402" stroke={blue} strokeWidth={12*activity} opacity={activity}/></>}
  {kind==='wheal'&&<>{spots(249,blue,activity)}<path d={`M130 174Q225 ${174-31*activity} 319 174`} fill="none" stroke={pink} strokeWidth="8" opacity={activity}/></>}
  {(kind==='blister-basal'||kind==='blister-suprabasal')&&<><path d={kind==='blister-basal'?'M100 220Q240 220 380 220':'M100 195Q240 195 380 195'} stroke={blue} strokeWidth={4+15*activity} opacity={activity} fill="none"/>{Array.from({length:5},(_,i)=><g key={i} opacity={s.effector}><path d={`M${125+i*52} ${kind==='blister-basal'?239:213}v-10m0 3-7-7m7 7 7-7`} stroke={gold} strokeWidth="3" fill="none"/></g>)}{label(49,128,c.id==='dh'?'IgA / TG3 · dermal papillae':kind==='blister-basal'?'BP180 / BP230 · basement membrane':'Desmogleins · between keratinocytes',11)}</>}
  <path d="M350 165V220Q324 259 337 320Q349 353 363 321Q377 270 357 220V165" fill={pv('panel')} stroke={pv('ink',.6)} strokeWidth="2"/><path d="M350 165V314" stroke={pv('ink',.75)} strokeWidth="3"/>
  {(kind==='follicle'||kind==='abscess'||kind==='papule')&&<><ellipse cx="350" cy={kind==='abscess'?252:300} rx={kind==='abscess'?30:20} ry={kind==='abscess'?26:17} fill={pink} opacity={activity*.7}/>{spots(272,violet,s.effector)}</>}
  {label(44,205,'Epidermis',11)}{label(44,277,'Dermis · vessel',11)}{label(43,469,'Subcutis · hair follicle',11)}
  {STAGES.map((stage,i)=>{const y=55+i*105;const node=c.stages[stage];return <g key={stage} {...hit(stage)}><rect x="505" y={y} width="416" height="74" rx="12" fill={pv('panel')} stroke={selected===stage?gold:pv('ink',.35)} strokeWidth={selected===stage?3:1}/><circle cx="529" cy={y+36} r="12" fill={[blue,gold,violet,pink][i]} opacity={.2+.8*p[i]}/>{label(550,y+30,`${i+1}. ${node.label}`,13)}{label(550,y+53,stage==='trigger'?'Initiation':stage==='signal'?'Mediator / antibody':stage==='effector'?'Cell or downstream effect':'Tissue outcome',11)}{target?.stage===stage&&drug>0&&<><path d={`M873 ${y+20}l25 29m0-29-25 29`} stroke={blue} strokeWidth="5" opacity={drug}/>{label(761,y+65,'Selected intervention',10)}</>}{i<3&&<><path d={`M712 ${y+75}V${y+103}`} stroke={pv('ink',.35)} strokeWidth="2"/><FlowParticles from={[712,y+77]} to={[712,y+101]} time={s.time} color={[blue,gold,violet][i]} strength={p[i]*(target?.stage===stage?1-.7*drug:1)} count={3}/></>}</g>;})}
  {label(23,502,'Illustrative cells and structures · different scales · not a biopsy or laboratory result',11)}
 </svg>;
}
