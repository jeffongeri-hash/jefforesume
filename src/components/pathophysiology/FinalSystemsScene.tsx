import { pick, sceneState, STRUCTURES, type System, type Structure } from '@/data/pathophysiology/finalSystems';
import { Label, Meter, makeHit, pv } from './sceneKit';
import FlowParticles from './FlowParticles';
type Props={system:System;variant?:string;time:number;normal?:boolean;compact?:boolean;showLabels:boolean;selected:Structure|null;onSelect:(id:Structure)=>void};
const red='#ed8b89',blue='#79c5eb',gold='#edd576',purple='#b7a0d9';
export default function FinalSystemsScene({system,variant='',time,normal,compact,showLabels,selected,onSelect}:Props){
 const c=pick(system,variant),id=c.id,s=sceneState(time,normal),hit=makeHit(STRUCTURES,selected,onSelect,compact);
 const swelling=s.injury*(1-.45*s.response),active=s.onset*(1-.75*s.response);
 const label=(x:number,y:number,t:string,size=12)=><Label show={showLabels} x={x} y={y} size={size}>{t}</Label>;
 const dots=(x:number,y:number,color:string,amount:number)=>Array.from({length:10},(_,i)=><circle key={i} cx={x+(i%5)*26} cy={y+Math.floor(i/5)*24+8*Math.sin(s.time+i)} r="4" fill={color} opacity={amount}/>);
 const blood=(from:[number,number],to:[number,number],strength=1,color=red)=><FlowParticles from={from} to={to} time={s.time} strength={strength} color={color} count={9}/>;
 const postpartum=id==='atony'||id==='endometritis',vascularAorta=id==='aaa'||id==='dissection';
 return <svg viewBox="0 0 840 450" role="group" aria-label={`${c.title}: conceptual anatomy and treatment mechanism`} className="block h-auto w-full rounded-lg patho-scene" style={{background:pv('bg')}}>
 {label(24,30,system==='derm'?'Enlarged skin and mucosa':system==='ob'?'Opened frontal uterine schematic':'Vascular anatomy and flow',15)}
 {system==='derm'?<>
  <g {...hit('anatomy')}><rect x="42" y="183" width="414" height="142" rx="5" fill={pv('serosa',.45)} stroke={pv('ink',.4)}/><path d="M42 182V145H456V182" fill={pv('serosa',.9)} stroke={pv('ink',.65)} strokeWidth="3"/>{label(49,131,'Epidermis')}{label(49,221,'Dermis')}{label(49,349,'Subcutaneous tissue below')}
   <path d="M70 284H430" stroke={red} strokeWidth="14"/>{blood([75,284],[425,284])}
  </g>
  <g {...hit('lesion')}>
   {id==='cellulitis'&&<><path d="M222 145l12 24-10 19" fill="none" stroke={gold} strokeWidth="5" opacity={s.onset}/><ellipse cx="260" cy="222" rx={28+118*s.injury} ry={15+58*s.injury} fill={red} opacity={.38*active}/>{dots(195,204,gold,active)}</>}
   {id==='abscess'&&<><ellipse cx="260" cy="220" rx={12+65*s.injury} ry={8+42*s.injury} fill={gold} opacity={s.onset*(1-.7*s.response)} stroke={red} strokeWidth="6"/><path d="M242 146Q260 122 279 146" fill="none" stroke={red} strokeWidth={5*s.injury}/><path d="M260 146V185" stroke={blue} strokeWidth="5" opacity={s.response}/>{blood([260,204],[260,110],s.response,gold)}</>}
   {(id==='histamine'||id==='bradykinin')&&<><path d={`M150 145Q235 ${145-35*swelling} 345 145V183H150Z`} fill={red} opacity={.7*s.onset}/>{dots(170,220,id==='histamine'?gold:purple,active)}{Array.from({length:6},(_,i)=><circle key={i} cx={180+i*37} cy={280-45*((s.time*.25+i/6)%1)} r="4" fill={blue} opacity={active}/>)}</>}
  </g>
  <g {...hit('flow')}>{label(70,312,'Dermal microvessel')}{label(82,382,id==='abscess'?'Drainage evacuates the collection':id==='cellulitis'?'Inflammation spreads through tissue':id==='histamine'?'Histamine → superficial / deeper leak':'Bradykinin → deeper tissue leak')}</g>
  <g {...hit('effect')}><rect x="495" y="85" width="320" height="300" rx="14" fill={pv('panel')} stroke={pv('ink',.4)}/>{label(512,111,id==='histamine'||id==='bradykinin'?'Separate airway cross-section':'Treatment mechanism',14)}
   {(id==='histamine'||id==='bradykinin')?<><ellipse cx="650" cy="211" rx="84" ry="65" fill={pv('serosa',.7)} stroke={pv('ink',.6)}/><ellipse cx="650" cy="211" rx={50-32*swelling} ry={43-25*swelling} fill={pv('bg')} stroke={red} strokeWidth={3+10*swelling}/>{label(550,305,'Submucosal edema narrows lumen')}</>:<><path d="M542 187H755" stroke={red} strokeWidth="14"/>{blood([545,187],[750,187])}{dots(579,240,gold,active)}{label(521,303,id==='abscess'?'Source control + selected antibiotics':'Antibiotics reduce bacterial burden')}</>}
   <Meter x={515} y={351} w={275} label="Response pathway · qualitative" value={s.response} color={blue}/>
  </g>
 </>:system==='ob'?<>
  <g {...hit('anatomy')}><path d="M110 108Q234 48 367 108Q406 157 370 260L286 335V368H222V335L137 260Q86 169 110 108Z" fill={pv('serosa',.7)} stroke={pv('ink',.65)} strokeWidth="4"/><path d="M144 128Q234 88 333 128Q366 168 337 244L271 313V354H237V313L169 244Q128 170 144 128Z" transform={id==='atony'?`translate(${254*.2*s.response} ${200*.12*s.response}) scale(${1-.2*s.response} ${1-.12*s.response})`:undefined} fill={pv('panel')} stroke={pv('ink',.4)} strokeWidth="2"/>{label(76,395,'Myometrium · cervix inferior')}
   {!postpartum&&<><path d="M221 184Q194 162 210 143Q234 124 255 146Q262 163 244 178Q287 173 302 201Q311 244 274 272Q239 283 220 255Q208 235 231 224Q251 221 257 238" fill={pv('serosa',.45)} stroke={pv('ink',.55)} strokeWidth="3"/>{label(190,300,'Fetal schematic')}</>}
   {label(217,377,'Cervical os',11)}
  </g>
  <g {...hit('lesion')}>
   {!postpartum&&<><path d={`M147 ${135+22*s.injury*(id==='abruption'?1:0)}Q177 166 156 222L141 230Q160 167 130 140Z`} fill={purple} stroke={gold} strokeWidth="3" opacity={id==='previa'?1-s.onset:1}/>{id==='previa'&&<path d="M208 300Q252 327 297 300L302 319Q253 349 204 319Z" fill={purple} stroke={gold} strokeWidth="3" opacity={s.onset}/>}</>}
   {id==='abruption'&&<path d="M135 139Q170 178 148 228" fill="none" stroke={red} strokeWidth={20*s.injury} opacity={s.onset}/>}
   {id==='endometritis'&&<><path d="M144 128Q234 88 333 128Q366 168 337 244L271 313H237L169 244Q128 170 144 128Z" fill={red} opacity={.3*active}/>{dots(186,175,gold,active)}{blood([250,319],[250,205],active,gold)}</>}
   {id==='atony'&&<><path d="M145 145Q171 171 151 214" stroke={red} strokeWidth="12" fill="none"/>{blood([150,206],[247,314],s.injury*(1-.75*s.response))}<path d={`M${139+18*s.response} 164H${185-12*s.response}M${139+18*s.response} 193H${185-12*s.response}`} stroke={gold} strokeWidth={3+5*s.response}/></>}
   {label(80,76,postpartum?'Postpartum uterus · cavity shown open':id==='previa'?'Placenta overlies internal os':'Placenta at uterine wall',12)}
  </g>
  <g {...hit('flow')}>{(id==='previa'||id==='abruption')&&blood([245,311],[245,389],s.injury*(1-.6*s.response))}{label(24,423,'Maternal anatomy and inset are at different scales',11)}</g>
  <g {...hit('effect')}><rect x="463" y="76" width="352" height="315" rx="14" fill={pv('panel')} stroke={pv('ink',.35)}/>{label(480,102,id==='preeclampsia'?'Maternal endothelial effects':id==='hellp'?'Maternal microvascular injury':'Maternal tissue / response inset',14)}
   <path d="M493 161H783M493 209H783" stroke={red} strokeWidth={4+4*s.injury}/>{blood([500,185],[775,185],1-.55*s.injury+.3*s.response)}
   {(id==='preeclampsia'||id==='endometritis')&&Array.from({length:6},(_,i)=><circle key={i} cx={520+43*i} cy={218+35*((s.time*.3+i/6)%1)} r="4" fill={blue} opacity={active}/>)}
   {id==='hellp'&&<>{dots(550,175,gold,s.injury)}<path d="M610 179l13-9-4 18 14 7" stroke={red} strokeWidth="4" opacity={s.injury} fill="none"/></>}
   {label(480,275,id==='hellp'?'RBC fragmentation · platelet consumption':id==='preeclampsia'?'Vasoconstriction + permeability increase':id==='atony'?'Contraction compresses placental vessels':id==='endometritis'?'Inflammation → possible systemic spread':'Hemorrhage reduces circulating volume',12)}
   <Meter x={484} y={321} w={303} label="Possible injury / complication" value={s.effect} color={red}/><Meter x={484} y={365} w={303} label="Treatment pathway · injury may persist" value={s.response} color={blue}/>
  </g>
 </>:<>
  {vascularAorta?<>
   <g {...hit('anatomy')}><path d={id==='aaa'?'M210 75V139L185 175M185 288L151 354M260 75V139L285 175M285 288L319 354':'M210 75V139L185 175V288L151 354M260 75V139L285 175V288L319 354'} fill="none" stroke={red} strokeWidth="12"/><path d="M208 117H120M262 117H350" stroke={red} strokeWidth="16"/>{label(74,100,'Renal branches')}{label(133,390,'Iliac bifurcation')}{label(186,56,'Abdominal aorta')}</g>
   <g {...hit('lesion')}>{id==='aaa'?<><path d={`M185 175Q${185-65*s.injury} 224 185 288M285 175Q${285+65*s.injury} 224 285 288`} stroke={red} strokeWidth="12" fill="none"/><path d="M180 238l-37 15-35-10" stroke={red} strokeWidth="9" fill="none" opacity={s.effect}/>{blood([175,241],[102,270],s.effect*(1-.6*s.response))}</>:<><path d={`M${226+12*s.injury} 147Q${255+10*s.injury} 220 234 300`} stroke={gold} strokeWidth="5" opacity={s.injury} fill="none"/>{blood([265,181],[266,275],s.injury,purple)}</>}{label(105,419,id==='aaa'?'Infrarenal dilation · possible rupture':'Abdominal segment · dissection can extend here',11)}</g>
   <g {...hit('flow')}>{blood([235,80],[235,290],1-.65*s.effect)}</g>
  </>:<>
   <g {...hit('anatomy')}><path d="M122 74Q70 125 98 233L119 354H212L238 232Q268 126 218 74Z" fill={pv('serosa',.2)} stroke={pv('ink',.5)} strokeWidth="3"/><path d="M155 94V339" stroke={red} strokeWidth="25"/><path d="M193 339V94" stroke={blue} strokeWidth="20"/>{label(72,382,'Leg vessels · schematic')}{label(78,58,'Artery → distal; vein → heart',11)}</g>
   <g {...hit('lesion')}><ellipse cx={id==='limb'?155:193} cy="218" rx={id==='limb'?12:9} ry={8+30*s.injury} fill={gold} stroke={purple} strokeWidth="2" opacity={s.onset}/>{id==='dvt'&&<ellipse cx="180" cy="248" rx={58+12*s.injury} ry="87" fill={blue} opacity={.18*s.injury}/>}{id==='pe'&&blood([193,184],[386,99],s.injury,purple)}</g>
   <g {...hit('flow')}>{blood([155,100],[155,179])}{blood([155,252],[155,330],id==='limb'?1-.95*s.injury+.7*s.response:1)}{blood([193,330],[193,252],id==='dvt'?1-.7*s.injury:1)}{blood([193,178],[193,102],id==='dvt'?1-.7*s.injury:1)}</g>
  </>}
  <g {...hit('effect')}><rect x="420" y="64" width="395" height="343" rx="14" fill={pv('panel')} stroke={pv('ink',.4)}/>{label(438,91,id==='pe'?'Separate right-heart / lung circuit':id==='dissection'?'Enlarged aortic wall section':id==='aaa'?'Repair / hemorrhage mechanism':'Distal tissue / treatment mechanism',14)}
   {id==='pe'?<><path d="M450 142H505V201H564V142H661V177M661 142H752V177" fill="none" stroke={blue} strokeWidth="13"/>{blood([452,142],[499,142],1,blue)}{blood([511,200],[558,200],1,blue)}{blood([564,147],[653,147],1-.7*s.injury,blue)}<circle cx="692" cy="143" r={5+11*s.injury} fill={gold} opacity={s.onset}/>{label(456,127,'RA',11)}{label(517,230,'RV',11)}{label(597,125,'Pulmonary artery',11)}{label(636,210,'Lung branches',11)}{label(439,275,'Venous embolus → RA → RV → pulmonary artery',11)}</>:id==='dissection'?<><rect x="455" y="124" width="325" height="105" fill={pv('serosa',.6)} stroke={pv('ink',.6)}/><path d="M459 160H775" stroke={red} strokeWidth="31"/><path d="M492 181Q620 199 775 195" stroke={purple} strokeWidth={22*s.injury} fill="none"/><path d="M492 177Q620 181 775 181" stroke={gold} strokeWidth="3" opacity={s.injury} fill="none"/>{label(466,149,'True lumen',11)}{label(556,222,'False lumen within media',11)}{label(440,272,'Intima flap separates the channels',12)}</>:<><path d="M456 166H777M456 207H777" stroke={red} strokeWidth="5"/>{blood([461,185],[773,185],id==='limb'?1-.9*s.injury+.7*s.response:id==='aaa'?1-.7*s.effect:1-.4*s.injury)}{id==='aaa'&&<path d="M550 163H690V209H550Z" stroke={blue} strokeWidth="4" fill="none" opacity={s.response}/>}<path d="M502 246h55v38h-55zM580 246h55v38h-55zM658 246h55v38h-55z" fill={pv('serosa',.6)} stroke={gold}/>{label(440,319,id==='limb'?'Nerve / muscle oxygen delivery falls':id==='dvt'?'Outflow obstruction → interstitial edema':'Repair excludes the weakened segment',12)}</>}
   <Meter x={441} y={378} w={349} label="Treatment mechanism · no instant tissue recovery" value={s.response} color={blue}/>
  </g>
 </>}
 </svg>;
}
