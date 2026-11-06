import { ramp } from '@/data/pathophysiology/timeline';
import { STRUCTURES, type Structure } from '@/data/pathophysiology/mesentericIschemia';
import { makeHit } from './sceneKit';
type Props = {time:number;normal?:boolean;compact?:boolean;showLabels:boolean;selected:Structure|null;onSelect:(id:Structure)=>void;title?:string};
export default function MesentericIschemiaScene({time,normal,compact,showLabels,selected,onSelect,title}:Props) {
 const t=normal?0:time, block=ramp(t,5,9), injury=ramp(t,10,15), wall=ramp(t,15,20), complication=ramp(t,20,24);
 const hit=makeHit(STRUCTURES,selected,onSelect,compact);
 return <svg viewBox="0 0 720 440" className="w-full" role="group" aria-label={title ?? 'Conceptual mesenteric arterial supply and bowel wall inset'}>
  <rect width="720" height="440" rx="18" fill="#101b2b"/>
  <text x="20" y="28" fill="#e2ebf4" fontSize="15">Abdominal arterial supply · conceptual anterior view</text>
  <path d="M222 60 L222 350" stroke="#dc777b" strokeWidth="25" fill="none" {...hit('aorta')}/>
  <path d="M222 108 C250 112 281 123 310 152" stroke="#e97879" strokeWidth="15" fill="none" {...hit('sma')}/>
  <path d="M304 146 C340 170 386 187 407 254 M326 165 C318 210 300 240 280 270 M355 181 C361 220 355 256 344 294" stroke="#e97879" strokeWidth="8" fill="none" opacity={1-.65*block} {...hit('branches')}/>
  <circle cx="303" cy="148" r={9*block} fill="#542b3e" stroke="#ffd08b" strokeWidth="2" {...hit('occlusion')}/>
  <path d="M167 249 C120 207 116 303 165 292 C218 280 193 334 153 325 M279 263 C222 226 206 319 268 306 C322 294 306 350 260 337 M378 253 C321 230 315 327 371 306 C425 286 422 340 378 339" stroke="#c27c88" strokeWidth="24" strokeLinecap="round" fill="none" opacity={1-.2*injury} {...hit('wall')}/>
  <rect x="460" y="56" width="238" height="318" rx="12" fill="#182a3c" stroke="#8298aa"/>
  <text x="475" y="79" fill="#dce8f4" fontSize="13">Enlarged bowel-wall inset</text>
  <text x="475" y="100" fill="#a9bac8" fontSize="11">Not to scale or in continuity</text>
  <rect x="486" y="132" width="190" height="135" rx="8" fill="#ab6f7a" {...hit('wall')}/>
  <rect x="486" y="151" width="190" height="42" fill={wall>.5?'#81505a':'#d5a591'} {...hit('wall')}/>
  <path d="M486 132 Q501 96 516 132 Q531 96 546 132 Q561 96 576 132 Q591 96 606 132 Q621 96 636 132 Q651 96 666 132 L676 151 L486 151Z" fill={injury>.5?'#b96465':'#f1c5aa'} {...hit('mucosa')}/>
  <path d="M487 267 L676 267" stroke="#f0c3bd" strokeWidth="5" {...hit('peritoneum')}/>
  <circle cx="580" cy="267" r={complication*12} fill="#ffb081" opacity={complication}/>
  {showLabels&&<g fill="#e5eef7" fontSize="12"><text x="137" y="68">Abdominal aorta</text><text x="230" y="106">SMA</text><text x="290" y="140">Embolus</text><text x="230" y="382">Small-bowel loops</text><text x="484" y="121">Lumen</text><text x="492" y="178">Mucosa / submucosa</text><text x="492" y="228">Muscular wall</text><text x="488" y="294">Serosa / peritoneal surface</text></g>}
  <text x="20" y="418" fill="#a9bac8" fontSize="11">Anatomy and progression simplified · not an image of a patient</text>
 </svg>;
}
