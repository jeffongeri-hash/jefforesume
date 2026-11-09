import {STRUCTURES,sceneState,type Structure} from '@/data/pathophysiology/disseminatedCoagulation';
import {makeHit,pv} from './sceneKit';
type Props={time:number;normal?:boolean;compact?:boolean;showLabels:boolean;selected:Structure|null;onSelect:(id:Structure)=>void;title?:string};
export default function DicScene({time,normal=false,compact,showLabels,selected,onSelect,title}:Props){
 const t=normal?0:time,s=normal?{activation:0,clot:0,consumption:0,response:0}:sceneState(t),hit=makeHit(STRUCTURES,selected,onSelect,compact);
 return <svg viewBox="0 0 900 490" role="img" aria-label={title??'Conceptual DIC showing microvascular clot formation, factor consumption and bleeding'} className="block h-auto w-full rounded-lg patho-scene" style={{background:pv('bg')}}>
  <text x="20" y="27" fill={pv('ink')} fontSize="15">DIC · microcirculation and separate hemostasis inset</text>
  <g {...hit('trigger')}><rect x="24" y="56" width="180" height="68" rx="12" fill={pv('panel')} stroke={pv('alert',.4+.6*s.activation)}/><text x="114" y="84" textAnchor="middle" fill={pv('ink')} fontSize="13">Systemic trigger</text><text x="114" y="106" textAnchor="middle" fill={pv('ink',.7)} fontSize="11">sepsis · trauma · obstetric</text></g>
  <path d="M115 126 V155" stroke={pv('alert',.3+.7*s.activation)} strokeWidth="4"/>
  <g {...hit('vessel')}><rect x="28" y="160" width="520" height="118" rx="48" fill={pv('inflame',.22)} stroke={pv('serosa',.9)} strokeWidth="5"/><text x="44" y="181" fill={pv('ink',.75)} fontSize="11">Conceptual small vessel · flow →</text></g>
  <g {...hit('platelet')}>{[0,1,2,3,4,5,6].map(i=>{const x=48+((t*42+i*70)%460);return <ellipse key={i} cx={x} cy={205+(i%3)*19} rx="8" ry="5" fill={pv('alert',.8)} opacity={1-.65*s.consumption}/>})}</g>
  <g {...hit('fibrin')} opacity={s.clot}><path d="M290 182 Q320 205 294 250 M312 181 Q340 205 315 258 M334 185 Q360 205 337 254 M284 207 L352 218 M282 234 L349 227" stroke={pv('ink',.85)} strokeWidth="3" fill="none"/><circle cx="315" cy="221" r={8+14*s.clot} fill={pv('alert',.6)}/></g>
  <g {...hit('organ')}><path d="M560 183 C615 151 695 168 703 220 C707 266 625 285 568 254 Z" fill={pv('serosa',.35+.35*s.clot)} stroke={pv('ink',.6)} strokeWidth="2"/><text x="630" y="214" textAnchor="middle" fill={pv('ink')} fontSize="13">Downstream tissue</text><text x="630" y="237" textAnchor="middle" fill={pv('ink',.75)} fontSize="11">perfusion may fall</text></g>
  <g {...hit('fibrinolysis')}><path d="M360 255 C390 300 445 305 485 314" stroke={pv('fluid',.3+.6*s.consumption)} strokeWidth="3" fill="none"/><text x="405" y="335" fill={pv('ink',.8)} fontSize="12">Fibrin breakdown → D-dimer</text>{[0,1,2].map(i=><circle key={i} cx={370+((t*25+i*28)%100)} cy={287+i*6} r="4" fill={pv('fluid')} opacity={s.consumption}/>)}</g>
  <g {...hit('bleed')}><rect x="598" y="304" width="245" height="92" rx="12" fill={pv('panel')} stroke={pv('alert',.25+.7*s.consumption)} strokeWidth="2"/><text x="614" y="329" fill={pv('ink')} fontSize="13">Hemostasis inset</text><text x="614" y="351" fill={pv('ink',.75)} fontSize="11">platelets / clotting factors consumed</text><text x="614" y="374" fill={pv('alert',.4+.6*s.consumption)} fontSize="12">Bleeding risk may increase</text></g>
  {showLabels&&<text x="25" y="455" fill={pv('ink',.7)} fontSize="11">Particles, clot and consumption are qualitative; treat the underlying cause and assess bleeding individually.</text>}
 </svg>;
}
