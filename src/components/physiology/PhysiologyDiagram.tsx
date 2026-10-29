import { physiologyState, type LessonId } from '@/data/physiologyLessons';
interface Props{id:LessonId;time:number;reperfused:boolean;onSelect:(name:string)=>void;}
export default function PhysiologyDiagram({id,time,reperfused,onSelect}:Props){
 const s=physiologyState(id,time,reperfused),cursor=(time*32)%480;
 const clickable=(name:string)=>({role:'button' as const,tabIndex:0,'aria-label':name,onClick:()=>onSelect(name),onKeyDown:(e:React.KeyboardEvent)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(name);}}});
 const panel=(title:string,children:React.ReactNode)=><section className="physio-view min-w-0"><h3 className="px-3 pt-3 text-xs font-semibold uppercase text-muted-foreground">{title}</h3>{children}</section>;
 if(id==='sepsis')return <div data-testid="physiology-diagram" data-lumen={s.lumenRadius} data-leak={s.leak} data-flow={s.flow} className="grid gap-3">
 {panel('Organism → vessel: distributive circulation',<svg viewBox="0 0 640 215" aria-label="Arteriolar lumen and heterogeneous capillary network" className="w-full">
  <path d={`M30 ${110-s.lumenRadius} H290 V${110+s.lumenRadius} H30Z`} className="vessel-wall"/>
  <path d={`M30 ${110-s.lumenRadius+8} H290 V${110+s.lumenRadius-8} H30Z`} className="vessel-lumen" {...clickable('Smooth muscle / NO')}/>
  <text x="35" y="30">Arteriole · lumen enlarges with NO</text>
  {[0,1,2,3].map((n)=><g key={n} {...clickable('Tissue oxygen delivery')}><path d={`M285 110 Q345 ${28+n*43} 590 ${28+n*43}`} className="capillary"/><circle cx={320+(cursor+n*75)%250} cy={28+n*43} r="5" className={n%2&&s.heterogeneity>.5?'tissue-dim':'blood-cell'} opacity={n%2?1-s.heterogeneity*.8:1}/>{n%2&&s.heterogeneity>.5&&<path d={`M420 ${20+n*43}l15 16m-15 0l15 -16`} className="microthrombus"/>}</g>)}
  <text x="345" y="202">Uneven red-cell transit ≠ even oxygen exchange</text>
  <circle cx={40+cursor%235} cy="110" r="9" className="blood-cell"/>
 </svg>)}
 <div className="grid gap-3 md:grid-cols-2">{panel('Cellular zoom: barrier & interstitium',<svg viewBox="0 0 320 245" className="w-full" aria-label="Endothelial glycocalyx damage and protein fluid leak">
  <text x="15" y="25">Blood</text><text x="15" y="226">Interstitium</text>
  {[0,1,2,3,4].map(n=><g key={n} {...clickable('Endothelium / glycocalyx')}><rect x={10+n*61} y="90" width={58-s.leak*12} height="42" rx="8" className="endothelium"/>{Array.from({length:5},(_,i)=><path key={i} d={`M${15+n*61+i*9} 90v${-23*(1-s.leak)}`} className="glycocalyx"/>)}</g>)}
  {Array.from({length:9},(_,i)=><circle key={i} cx={30+i*30} cy={45+s.leak*(45+(i%3)*45)} r={i%2?4:7} className={i%2?'fluid-particle':'protein-particle'} opacity={.25+.75*s.leak}/>)}
  <text x="12" y="175">Protein + fluid leak through barrier gaps</text>
 </svg>)}{panel('Immune signaling & tissue exchange',<svg viewBox="0 0 320 245" className="w-full" aria-label="Immune mediators and reduced effective oxygen delivery">
  <g {...clickable('Innate immune signaling')}><circle cx="64" cy="62" r="33" className="immune-cell"/><text x="37" y="65">Innate</text><text x="120" y="48">TNF / IL-1 / IL-6</text><path d="M102 62h65" className="signal-arrow"/><text x="125" y="89">Example mediators</text></g>
  {[0,1,2,3,4,5].map(n=><g key={n}><circle cx={45+n%3*90} cy={150+Math.floor(n/3)*55} r="22" className={n%2&&s.heterogeneity>.5?'tissue-threatened':'tissue-viable'}/><text x={31+n%3*90} y={155+Math.floor(n/3)*55}>O₂</text></g>)}
 </svg>)}</div></div>;
 if(id==='lad')return <div data-testid="physiology-diagram" data-flow={s.flow} data-core={s.core} className="grid gap-3 lg:grid-cols-2">
 {panel('Coronary artery: longitudinal + cross-section',<svg viewBox="0 0 380 455" className="w-full" aria-label="LAD thrombus and reduced distal coronary flow">
  <text x="15" y="28">Proximal LAD → distal myocardial supply</text><path d="M20 65H360V135H20Z" className="vessel-wall"/><path d="M20 77H360V123H20Z" className="vessel-lumen" {...clickable('Distal LAD flow')}/>
  <path d={`M150 124Q180 ${124-40*s.dilation} 211 124Z`} className="plaque" {...clickable('Plaque / thrombus')}/><ellipse cx="182" cy="96" rx={24*s.dilation} ry={30*s.dilation} className="thrombus"/>
  {[0,1,2,3].map(n=><circle key={n} cx={30+(cursor+n*80)%320} cy="100" r="6" className="blood-cell" opacity={(30+(cursor+n*80)%320)>210?s.flow:1}/>)}
  <circle cx="190" cy="265" r="85" className="vessel-wall"/><circle cx="190" cy="265" r="65" className="vessel-lumen"/><ellipse cx="190" cy="283" rx={60*s.dilation} ry={55*s.dilation} className="thrombus" {...clickable('Plaque / thrombus')}/><text x="100" y="380">Conceptual vessel cross-section</text><text x="35" y="417">Distal flow: {s.flow>.6?'preserved':s.flow>.2?'reduced':'markedly reduced'}</text>
 </svg>)}
 {panel('Linked myocardial territory & myocyte energy',<svg viewBox="0 0 380 455" className="w-full" aria-label="Variable anterior anteroseptal territory with ischemia and infarction">
  <path d="M190 340C155 306 32 201 46 111C56 43 144 38 190 97C244 34 328 56 336 119C346 196 241 305 190 340Z" className="myocardium"/>
  <path d={`M190 100Q155 185 ${185+14*(1-s.injury)*Math.sin(time*2)} 328Q240 246 248 158Z`} className={s.injury>.1?'tissue-threatened':'tissue-viable'} {...clickable('Viable ischemic myocardium')}/>
  <path d="M190 99Q182 180 201 292" className="coronary" {...clickable('Distal LAD flow')}/>
  {s.core>.01&&<ellipse cx="215" cy="218" rx={s.core*65} ry={s.core*120} className="tissue-core" {...clickable('Irreversible injury')}/>}
  <text x="22" y="25">Anterior / anteroseptal example · extent varies</text><text x="22" y="378">O₂ / ATP: {s.injury<.4?'available':reperfused?'viable border may recover':'reduced'}</text><text x="22" y="402">Contractility: {s.injury<.3?'preserved':'reduced in affected tissue'}</text><text x="22" y="428">Dark region: established injury stays injured</text>
 </svg>)}</div>;
 const brain=(mode:string)=><svg viewBox="0 0 300 240" className="w-full" aria-label={`${mode} synthetic schematic`} {...clickable(mode==='CTA'?'Arterial occlusion':'Core / threatened region')}>
  <ellipse cx="150" cy="112" rx="115" ry="92" className="brain-outline"/><path d="M150 23v180" className="brain-midline"/>
  {mode!=='CTA'&&<><ellipse cx="204" cy="109" rx={mode==='NCCT'?35:45+s.threatened*22} ry="65" className={mode==='NCCT'?'ncct-change':'tissue-threatened'} opacity={mode==='NCCT'?s.injury*.45:s.dilation}/><ellipse cx="204" cy="106" rx={8+s.core*37} ry={15+s.core*55} className="tissue-core" opacity={mode==='NCCT'?s.injury*.45:s.dilation}/></>}
  {mode==='CTA'&&<><path d="M150 197V131L215 79m-15 15l38 6m-35-8l10-43" className="coronary"/><circle cx="181" cy="111" r={9*s.dilation} className="thrombus"/><path d="M140 45Q246 12 245 85" className="collateral"/></>}
  <text x="12" y="228">{mode==='NCCT'?'Early changes may be subtle / absent':mode==='CTA'?'Vessels & collaterals, NOT viability map':mode==='CTP'?'CBF ↓ · CBV variable · Tmax delayed':'DWI restriction: acute injury-sensitive'}</text>
 </svg>;
 return <div data-testid="physiology-diagram" data-core={s.core} data-flow={s.flow} data-threatened={s.threatened} className="grid gap-3">
 {panel('Linked tissue: proximal MCA & collateral supply',<svg viewBox="0 0 640 260" className="w-full" aria-label="MCA occlusion linked to core and threatened viable tissue">
  <ellipse cx="190" cy="130" rx="150" ry="108" className="brain-outline"/><ellipse cx="250" cy="129" rx={45+s.threatened*55} ry="76" className="tissue-threatened" opacity={s.dilation}/><ellipse cx="245" cy="125" rx={s.core*72} ry={s.core*100} className="tissue-core" opacity={s.dilation} {...clickable('Core / threatened region')}/>
  <path d="M180 232V153L268 75" className="coronary" {...clickable('Arterial occlusion')}/><circle cx="215" cy="122" r={12*s.dilation} className="thrombus"/><path d="M175 40Q318 0 310 95" className="collateral" {...clickable('MCA / collaterals')}/>
  <text x="368" y="55">Core: established injury</text><text x="368" y="90">Border: threatened viable tissue</text><text x="368" y="125">Collateral support is variable</text><text x="368" y="160">Reperfusion preserves viable tissue</text><text x="368" y="195">It does not revive infarct</text>
 </svg>)}<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{['NCCT','CTA','CTP','DWI'].map(mode=><div key={mode}>{panel(`${mode==='CTP'?'CT perfusion (CBF / CBV / Tmax)':mode} · SYNTHETIC`,brain(mode))}</div>)}</div></div>;
}
