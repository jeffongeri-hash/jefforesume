import { ramp } from '@/data/pathophysiology/timeline';
type Props={time:number; normal?:boolean; showLabels:boolean; selected:string|null; onSelect:(id:string)=>void; variant?:string; title?:string};
export default function ObEmergencyScene({time,normal,showLabels,selected,onSelect,variant,title}:Props){
 const t=normal?0:time, a=ramp(t,5,10), b=ramp(t,10,15), c=ramp(t,15,20), d=ramp(t,20,24);
 const key=variant||'postpartum-hemorrhage', hemorrhage=key==='postpartum-hemorrhage'||key==='placental-abruption', hypertensive=key==='preeclampsia-eclampsia', infection=key==='chorioamnionitis', afe=key==='amniotic-fluid-embolism';
 const hit=(id:string,label:string)=>({role:'button' as const,tabIndex:0,'aria-label':label,'aria-pressed':selected===id,onClick:()=>onSelect(id),onKeyDown:(e:React.KeyboardEvent<SVGElement>)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(id)}});
 return <svg viewBox="0 0 680 420" className="w-full" role="group" aria-label={title||'Conceptual obstetric emergency animation'}>
   <rect width="680" height="420" rx="18" fill="#101b2b"/><text x="24" y="29" fill="#dce8f4" fontSize="15">Conceptual pelvic orientation · not to scale</text>
   <g {...hit('uterus','Uterus')}><path d="M155 105 C155 44 425 44 425 105 C425 210 365 244 337 270 L327 330 L253 330 L243 270 C215 244 155 210 155 105Z" fill="#925268" stroke="#f1b8ad" strokeWidth="6"/><path d="M193 111 C200 76 380 76 387 111 C380 180 334 226 290 247 C246 226 200 180 193 111Z" fill="#efaea0" opacity=".9"/></g>
   <g {...hit('placenta','Placenta / placental bed')}><path d="M214 114 Q290 62 366 114 Q348 153 290 167 Q232 153 214 114Z" fill={hemorrhage?'#bd6570':'#d78a78'} stroke="#ffd0ac" strokeWidth="4"/>{hemorrhage&&<ellipse cx="290" cy="133" rx={20+a*62} ry={10+a*27} fill="#d8293f" opacity={.3+.45*b}/>}</g>
   <g {...hit('myometrium','Myometrium')}><path d="M178 116 C184 55 398 55 404 116" fill="none" stroke={hemorrhage?'#f27b78':'#c98794'} strokeWidth={10-(hemorrhage?6*a:0)} opacity=".9"/></g>
   {infection&&Array.from({length:10},(_,i)=><circle key={i} cx={230+(i%5)*28+Math.sin(t+i)*6} cy={192-Math.floor(i/5)*26-a*62} r="5" fill="#f5dc72" opacity={a}/>) }
   {hypertensive&&<g {...hit('endothelium','Endothelium')}><path d="M478 106 Q526 142 490 194 T510 306" stroke="#df6d7f" strokeWidth={7+7*b} fill="none"/><path d="M520 106 Q568 142 532 194 T552 306" stroke="#6daee8" strokeWidth="7" fill="none"/>{[0,1,2,3].map(i=><circle key={i} cx={500+i*12} cy={150+i*30} r={3+3*c} fill="#ebd0ff" opacity={b}/>)}</g>}
   <g {...hit('vessels','Maternal circulation')}><path d="M460 114 Q500 132 475 205 T488 321" stroke="#e36f78" strokeWidth={8+(hemorrhage?0:3*c)} fill="none"/><path d="M498 114 Q538 132 513 205 T526 321" stroke="#67a8dc" strokeWidth="7" fill="none"/></g>
   <g {...hit('lungs','Pulmonary circulation')}><path d="M570 160 C544 128 524 157 536 203 C545 232 565 247 580 250 L580 160Z" fill="#7da6bb" opacity=".8"/><path d="M590 160 C616 128 636 157 624 203 C615 232 595 247 580 250 L580 160Z" fill="#7da6bb" opacity=".8"/>{afe&&<circle cx="580" cy="180" r={8+15*b} fill="#ff6d76" opacity={.35+.4*c}/>}</g>
   <g {...hit('coagulation','Coagulation system')}>{[0,1,2,3,4].map(i=><circle key={i} cx={455+i*31} cy={350+Math.sin(t+i)*5} r={4+((hemorrhage||afe)?5*c:0)} fill="#f2c4d4" opacity={.55+.35*d}/>)}</g>
   {showLabels&&<g fill="#edf4fb" fontSize="13"><text x="26" y="120">Uterus / myometrium</text><text x="25" y="153">Placental interface</text><text x="443" y="337">Maternal vessels</text><text x="535" y="276">Pulmonary inset</text><text x="442" y="383">Coagulation inset</text></g>}
 </svg>;
}
