import { makeHit, Label, pv } from '@/components/pathophysiology/sceneKit';
import { VESSELS, type View, type Vessel, type Finding } from '@/data/ctaLearningAtlas';
type Props={view:View;finding:Finding;labels:boolean;selected:Vessel|null;onSelect:(v:Vessel)=>void};
const vessel='#e8f1f4',dim='#99adb5',clot='#503343';
export default function CtaLearningDiagram({view,finding,labels,selected,onSelect}:Props){
 const hit=makeHit(VESSELS,selected,onSelect),head=view==='head-axial',map=view==='brain-map',tissue=view==='brain-tissue',neck=view==='neck-coronal',sag=view==='neck-sagittal',ax=view==='chest-axial',chest=view==='chest-coronal',leftM1=finding==='left-m1',pe=finding==='right-pe';
 const line=(id:Vessel,d:string,width=9,color=vessel)=><g {...hit(id)}><path d={d} fill="none" stroke="transparent" strokeWidth={Math.max(width+18,24)}/><path d={d} fill="none" stroke={selected===id?'#e8c36c':color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"/></g>;
 const label=(x:number,y:number,text:string,size=13)=><Label show={labels} x={x} y={y} size={size}>{text}</Label>;
 const node=(id:Vessel,x:number,y:number,rx:number,ry:number,color=vessel)=><g {...hit(id)}><ellipse cx={x} cy={y} rx={rx+7} ry={ry+7} fill="transparent"/><ellipse cx={x} cy={y} rx={rx} ry={ry} fill={selected===id?'#e8c36c':color}/></g>;
 return <svg viewBox="0 0 800 520" role="group" aria-label={`${view} schematic ${finding}`} className="block h-auto w-full rounded-xl border border-border patho-scene" style={{background:pv('bg')}}>
  <text x="23" y="31" fill={vessel} fontSize="14">SCHEMATIC · {map?'INFERIOR':sag?'SAGITTAL':neck||chest?'CORONAL / ANTERIOR':'AXIAL'} · NOT A CT SCAN</text>
  <text x="35" y="68" fill="#dce6ee" fontSize="15">{sag?'Anterior':'R (patient)'}</text><text x="686" y="68" fill="#dce6ee" fontSize="15">{sag?'Posterior':'L (patient)'}</text>
  {(head||map)&&<>
   <ellipse cx="400" cy="275" rx="285" ry="204" fill="#27343e" stroke="#74838b" strokeWidth="5"/><path d="M400 75V475" stroke="#657982" strokeWidth="2" strokeDasharray="4 7"/>
   {label(370,105,'Anterior',12)}{label(368,460,'Posterior',12)}
   {line('rica','M290 335C273 302 280 263 315 245',12)}{line('lica','M510 335C527 302 520 263 485 245',12)}
   {line('mca-right','M315 245C275 240 237 226 192 214',10)}
   {leftM1?<>{line('mca-left','M485 245C496 244 505 241 514 239',10)}<path d="M528 236C557 230 587 220 608 214" stroke={dim} strokeWidth="5" strokeDasharray="5 7" fill="none"/><circle cx="520" cy="237" r="8" fill="#e58f89"/>{label(548,190,'Left M1 cutoff',12)}</>:line('mca-left','M485 245C525 240 563 226 608 214',10)}
   {line('aca','M315 245C334 221 360 206 381 198M485 245C466 221 440 206 419 198M381 198L419 198M381 198L381 145M419 198L419 145',8)}
   {line('vertebral','M329 425L400 374L471 425',9)}{line('basilar','M400 374L400 313',12)}{line('pca','M400 313C375 302 345 300 322 318M400 313C425 302 455 300 478 318',9)}
   <path d="M315 245L322 318M485 245L478 318" stroke={dim} strokeWidth="4" strokeDasharray="6 4"/>
   {label(124,207,'R MCA',12)}{label(621,207,'L MCA',12)}{label(370,135,'ACA',12)}{label(373,340,'Basilar',11)}{label(300,447,'Vertebral arteries',11)}
   {map&&label(250,493,'Arteries are schematic; communicating vessels vary.',11)}
   {head&&label(207,493,'Level is illustrative; not a reconstructed image.',11)}
  </>}
  {tissue&&<>
   <ellipse cx="400" cy="270" rx="270" ry="202" fill="#344049" stroke="#9aabb1" strokeWidth="5"/><path d="M400 77V462" stroke="#87969b" strokeWidth="3"/><ellipse cx="353" cy="277" rx="21" ry="43" fill="#202930"/><ellipse cx="447" cy="277" rx="21" ry="43" fill="#202930"/>
   <g {...hit('mca-left')}><path d="M560 152Q646 180 659 269Q651 352 568 387Q534 356 527 301Q552 227 560 152Z" fill="#d89b8d" opacity={finding==='left-infarct'?.8:0} stroke="#edc57e" strokeWidth="3"/><path d="M560 152Q646 180 659 269Q651 352 568 387" fill="none" stroke="transparent" strokeWidth="28"/></g>
   {label(368,107,'Anterior',12)}{label(364,447,'Posterior',12)}{finding==='left-infarct'&&label(505,413,'Possible left lateral injury',12)}
  </>}
  {neck&&<>
   <path d="M165 84Q400 20 635 84L586 453H214Z" fill="#27343e" stroke="#74838b" strokeWidth="3"/><path d="M367 91H433V448H367Z" fill="#59666a" stroke="#95a2a7" strokeWidth="3"/>{label(372,278,'Spine',12)}
   {line('cca','M250 445L260 298M550 445L540 298',15)}
   {line('rica','M260 298C277 257 287 200 292 107',12)}{line('lica','M540 298C523 257 513 200 508 107',12)}
   {line('eca','M260 298C235 264 217 215 202 151M540 298C565 264 583 215 598 151M222 222L184 200M578 222L616 200',9)}
   {line('vertebral','M334 439C336 335 335 204 340 102M466 439C464 335 465 204 460 102',8)}
   {label(155,331,'R CCA',12)}{label(560,331,'L CCA',12)}{label(270,100,'R ICA',12)}{label(489,100,'L ICA',12)}{label(140,170,'ECA branches',11)}{label(303,466,'Vertebral arteries · posterior',11)}
  </>}
  {sag&&<>
   <path d="M260 89Q386 33 516 92L565 427H226Z" fill="#27343e" stroke="#74838b" strokeWidth="3"/><path d="M433 102V433" stroke="#97a2a6" strokeWidth="41" strokeDasharray="31 10"/>{label(457,265,'Cervical spine',12)}
   {line('cca','M309 445L310 317',15)}{line('lica','M310 317Q335 280 343 226L365 105',12)}{line('eca','M310 317Q277 273 244 229L205 205M254 240L202 252',9)}{line('vertebral','M421 442Q409 339 413 235L414 104',8)}
   {label(247,379,'Common carotid',12)}{label(335,95,'Cervical ICA',12)}{label(138,199,'ECA branches',12)}{label(438,116,'Vertebral artery',12)}{label(224,477,'Structures combined across nearby sagittal planes',11)}
  </>}
  {ax&&<>
   <ellipse cx="400" cy="272" rx="318" ry="204" fill="#39454b" stroke="#9aabb1" strokeWidth="4"/><ellipse cx="220" cy="285" rx="110" ry="143" fill="#10191e" stroke="#63747b" strokeWidth="3"/><ellipse cx="577" cy="285" rx="110" ry="143" fill="#10191e" stroke="#63747b" strokeWidth="3"/>
   {node('aorta',315,227,41,37,'#b6c6ce')}{node('trunk',410,287,44,41)}{line('rpa','M385 276Q320 248 262 257',32)}{line('lpa','M437 274Q500 237 538 238',32)}
   {node('bronchus',258,316,23,20,'#0a1014')}{node('bronchus',545,308,23,20,'#0a1014')}
   {pe&&<g pointerEvents="none"><ellipse cx="300" cy="259" rx="23" ry="9" fill={clot} stroke="#c999a3" strokeWidth="2"/>{label(189,197,'R PA filling defect',12)}</g>}
   {label(265,183,'Aorta',12)}{label(367,349,'PA trunk',12)}{label(138,262,'R PA',12)}{label(568,230,'L PA',12)}{label(174,356,'Bronchus · air',11)}{label(369,467,'Posterior',12)}
  </>}
  {chest&&<>
   <path d="M210 112Q100 139 114 330Q124 425 303 434L361 366L350 157Q290 88 210 112ZM590 112Q700 139 686 330Q676 425 497 434L439 366L450 157Q510 88 590 112Z" fill="#18252b" stroke="#71828a" strokeWidth="3"/>
   <path d="M322 315Q354 259 404 300Q447 255 491 308Q497 367 406 417Q321 369 322 315Z" fill="#7b7074" stroke="#b1b2b0" strokeWidth="3"/>{label(382,372,'Heart',12)}
   {line('trunk','M405 318L405 224',22)}{line('rpa','M405 224Q346 191 279 213L217 261M279 213L231 176M279 213L261 301',15)}{line('lpa','M405 224Q466 191 522 213L587 259M522 213L570 176M522 213L542 301',15)}
   {line('aorta','M460 300V158Q460 126 430 126H390',12,'#abbcc4')}
   {pe&&<g pointerEvents="none"><ellipse cx="329" cy="211" rx="19" ry="6" transform="rotate(-7 329 211)" fill={clot} stroke="#c999a3" strokeWidth="2"/>{label(190,145,'R PA intraluminal defect',12)}</g>}
   {label(165,345,'Right lung',12)}{label(549,345,'Left lung',12)}{label(407,204,'PA trunk',12)}{label(470,140,'Aorta',12)}
  </>}
  <text x="28" y="512" fill="#c5d1d6" fontSize="11">Schematic structures are selectable; distributions and anatomic variants are simplified.</text>
 </svg>;
}
