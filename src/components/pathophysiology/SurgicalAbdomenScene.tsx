import { ramp } from '@/data/pathophysiology/timeline';
import { STRUCTURES, type Condition } from '@/data/pathophysiology/surgicalAbdomen';
import { makeHit } from './sceneKit';
type Props={time:number;normal?:boolean;compact?:boolean;showLabels:boolean;selected:string|null;onSelect:(id:string)=>void;variant?:string};
export default function SurgicalAbdomenScene({time,normal,compact,showLabels,selected,onSelect,variant}:Props){
 const t=normal?0:time,a=ramp(t,5,10),b=ramp(t,10,15),c=ramp(t,15,20),d=ramp(t,20,24),abscess=variant==='intra-abdominal-abscess';
 const hit=makeHit(STRUCTURES,selected as keyof typeof STRUCTURES|null,onSelect,compact);
 return <svg viewBox="0 0 720 400" className="w-full" role="group" aria-label={abscess?'Conceptual contained intra-abdominal infection':'Conceptual small-bowel obstruction'}>
  <rect width="720" height="400" rx="18" fill="#101b2b"/><text x="24" y="28" fill="#e4edf6" fontSize="15">Conceptual bowel and peritoneal space · not to scale</text>
  <rect x="58" y="62" width="420" height="273" rx="90" fill="#253548" stroke="#7b91a2" strokeWidth="3" {...hit('peritoneum')}/>
  <path d="M115 130 C175 62 242 72 267 126 C289 172 245 190 204 165 C163 140 140 184 178 207 C222 233 278 178 322 208 C365 236 342 285 285 270 C235 257 211 300 276 305 C335 312 401 285 409 245" fill="none" stroke="#d58e92" strokeWidth={38+b*8} strokeLinecap="round" {...hit('bowel')}/>
  <path d="M115 130 C175 62 242 72 267 126 C289 172 245 190 204 165 C163 140 140 184 178 207 C222 233 278 178 322 208 C365 236 342 285 285 270 C235 257 211 300 276 305 C335 312 401 285 409 245" fill="none" stroke="#f2c2ad" strokeWidth={18+b*8} strokeLinecap="round" {...hit('lumen')}/>
  {!abscess&&<g {...hit('obstruction')}><path d="M312 185 Q327 215 346 230" fill="none" stroke="#e7d39c" strokeWidth="9" opacity={a}/><circle cx="328" cy="211" r="13" fill="#8e454d" opacity={a}/></g>}
  {abscess&&<g {...hit('collection')}><ellipse cx="366" cy="144" rx={10+55*b} ry={8+35*b} fill="#d6c174" stroke="#f6dd9d" strokeWidth="4" opacity={a}/><circle cx="351" cy="139" r="5" fill="#8d653e" opacity={b}/><circle cx="379" cy="152" r="6" fill="#8d653e" opacity={b}/></g>}
  <path d="M492 80 C531 130 518 215 556 280" stroke="#d57379" strokeWidth="8" fill="none" opacity={1-.55*c} {...hit('mesentery')}/><circle cx="560" cy="280" r={8+15*d} fill="#e38a80" opacity={d*.7}/>
  {showLabels&&<g fill="#e5eef7" fontSize="13"><text x="78" y="359">Bowel loops and peritoneal space</text><text x="490" y="306">Perfusion inset</text><text x="485" y="325">Separate from bowel view</text><text x="292" y="76">{abscess?'Localized collection':'Adhesion / transition'}</text></g>}
 </svg>;
}
