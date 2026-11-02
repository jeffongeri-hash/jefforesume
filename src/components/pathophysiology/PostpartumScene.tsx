import { ramp } from '@/data/pathophysiology/timeline';
type Props = { time:number; normal?:boolean; compact?:boolean; showLabels:boolean; selected:string|null; onSelect:(id:string)=>void; title?:string };
export default function PostpartumScene({time,normal,showLabels,selected,onSelect,title}:Props) {
 const t=normal?0:time, infection=ramp(t,5,10), inflammation=ramp(t,10,15), spread=ramp(t,15,20), systemic=ramp(t,20,24);
 const target=(id:string,label:string)=>({role:'button' as const,tabIndex:0,'aria-label':label,'aria-pressed':selected===id,onClick:()=>onSelect(id),onKeyDown:(e:React.KeyboardEvent)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(id);}}});
 return <svg viewBox="0 0 600 400" className="w-full" role="group" aria-label={title || 'Conceptual postpartum uterine infection animation'}>
  <rect width="600" height="400" rx="18" fill="#101b2b"/><text x="24" y="28" fill="#dce8f4" fontSize="15">Conceptual anatomy · not to scale</text>
  <path d="M175 115 C175 48 425 48 425 115 C425 220 360 245 330 275 L320 320 L280 320 L270 275 C240 245 175 220 175 115Z" fill="#9d596c" stroke="#ecc0bc" strokeWidth="6" {...target('uterus','Postpartum uterus')}/>
  <path d="M212 112 C218 78 382 78 388 112 C382 185 337 225 300 246 C263 225 218 185 212 112Z" fill="#f1b3a4" stroke="#f77f6b" strokeWidth={4+inflammation*8} {...target('decidua','Decidua and endometrium')}/>
  <path d="M286 247 L314 247 L315 315 L285 315Z" fill="#7b4258" {...target('cervix','Cervix')}/>
  {Array.from({length:9},(_,i)=><circle key={i} cx={250+(i%3)*45+Math.sin(t*1.3+i)*8} cy={205-Math.floor(i/3)*35-Math.min(1,infection)*36} r="5" fill="#f8dc7c" opacity={infection}/>) }
  <ellipse cx="300" cy="143" rx={88+spread*22} ry={55+spread*18} fill="#e64a52" opacity={inflammation*.18+spread*.12}/>
  <g {...target('vessels','Uterine microcirculation')}><path d="M450 116 Q488 135 468 195 T485 280" stroke="#e97979" strokeWidth={8+systemic*5} fill="none"/><path d="M500 116 Q536 135 516 195 T530 280" stroke="#6aa9dd" strokeWidth="7" fill="none"/>{[0,1,2].map(i=><circle key={i} cx={472+i*11} cy={160+i*30} r={4+systemic*3} fill="#e9c8ff" opacity={systemic}/>)}</g>
  {showLabels&&<g fill="#edf4fb" fontSize="14"><text x="25" y="110">Postpartum uterus</text><text x="25" y="150">Decidual lining</text><text x="26" y="314">Cervical canal</text><text x="426" y="315">Vascular inset</text></g>}
 </svg>;
}
