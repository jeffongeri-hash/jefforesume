import { state, STRUCTURES, type Lesson, type Section, type Structure } from '@/data/dermatologyAtlas';
import { Label, makeHit, pv, Meter } from '@/components/pathophysiology/sceneKit';
import FlowParticles from '@/components/pathophysiology/FlowParticles';
import DrugTarget from './DrugTarget';
export type Tone='light'|'medium'|'deep';
type Props={lesson:Lesson;section:Section;time:number;normal?:boolean;tone:Tone;labels:boolean;selected:Structure|null;onSelect:(s:Structure)=>void};
const tones={light:{skin:'#efbd9d',inflamed:'#c85b68',pigment:'#90613e'},medium:{skin:'#b47e58',inflamed:'#ad5b78',pigment:'#67442f'},deep:{skin:'#714b38',inflamed:'#895b8e',pigment:'#33271e'}};
const blue='#79c8e8',gold='#e9cc77',red='#e58f9b',purple='#b9a1df';
export default function DermatologyScene({lesson:c,section,time,normal,tone,labels,selected,onSelect}:Props){
 const s=state(section,time,normal),hit=makeHit(STRUCTURES,selected,onSelect),skin=tones[tone];
 const activity=s.activity,condition=section==='conditions',v=c.visual;
 const label=(x:number,y:number,t:string,size=12)=><Label show={labels} x={x} y={y} size={size}>{t}</Label>;
 const scale=v==='psoriasis'?18*activity:v==='seborrheic'?8*activity:0;
 const edema=v==='wheal'?22*activity:0;
 const flow=(a:[number,number],b:[number,number],strength=1,color=blue)=><FlowParticles from={a} to={b} time={s.time} strength={strength} color={color} count={7}/>;
 const damaged=activity*(v==='eczema'?1:0),barrier=section==='skincare'&&c.mode==='barrier';
 return <svg viewBox="0 0 960 500" role="group" aria-label={`${normal?'Normal reference: ':''}${c.title} enlarged skin and mechanism`} className="patho-scene block h-auto w-full rounded-xl border border-border" style={{background:pv('bg')}}>
  {label(24,30,'Skin cross-section · surface above',15)}
  <g {...hit('subcutis')}><rect x="35" y="347" width="455" height="92" rx="4" fill="#b6975a" fillOpacity=".45"/>{Array.from({length:16},(_,i)=><circle key={i} cx={52+(i%8)*59} cy={369+Math.floor(i/8)*43} r="17" fill={gold} fillOpacity=".2" stroke={gold} strokeOpacity=".35"/>)}{v==='lipoma'&&<g opacity={activity}><ellipse cx="254" cy="387" rx={44+53*activity} ry="38" fill={gold} fillOpacity=".65" stroke={gold} strokeWidth="3"/>{Array.from({length:12},(_,i)=><circle key={i} cx={191+(i%6)*25} cy={375+Math.floor(i/6)*23} r="11" fill={gold} fillOpacity=".3" stroke={pv('bg',.6)}/>)}</g>}{label(41,462,'Subcutis · adipose lobules')}</g>
  <g {...hit('dermis')}><rect x="35" y="222" width="455" height="125" fill={skin.skin} fillOpacity=".55"/>{Array.from({length:6},(_,i)=><path key={i} d={`M${50+i*70} 324q18-12 40 0m-40 9q18-12 40 0`} fill="none" stroke={pv('ink',.25)} strokeWidth="2"/>)}<path d="M50 298H475" stroke={red} strokeWidth={10+(v==='rosacea'?8*activity:0)}/>{flow([54,298],[470,298],1,red)}{label(44,277,'Dermis · vessels / collagen')}
   {['eczema','interface','exanthem','psoriasis'].includes(v)&&Array.from({length:10},(_,i)=><circle key={i} cx={90+(i%5)*66} cy={242+Math.floor(i/5)*17+5*Math.sin(s.time+i)} r="4" fill={purple} opacity={activity}/>)}
   {v==='wheal'&&Array.from({length:9},(_,i)=><circle key={i} cx={78+i*43} cy={296-50*((s.time*.2+i/9)%1)} r="4" fill={blue} opacity={activity}/>)}
  </g>
  <g {...hit('epidermis')}><path d={`M35 ${177-scale-edema}H490V222Q470 242 450 222Q430 242 410 222Q390 242 370 222Q350 242 330 222Q310 242 290 222Q270 242 250 222Q230 242 210 222Q190 242 170 222Q150 242 130 222Q110 242 90 222Q70 242 50 222H35Z`} fill={skin.skin} stroke={pv('ink',.4)} strokeWidth="2"/>{Array.from({length:22},(_,i)=><ellipse key={i} cx={48+(i%11)*41} cy={191-scale*.4+Math.floor(i/11)*17} rx="13" ry="5" fill={pv('ink',.12)} stroke={pv('ink',.2)}/>)}
   {Array.from({length:8},(_,i)=><circle key={i} cx={72+i*53} cy="218" r="3" fill={skin.pigment} opacity={.45+(v==='photo'||v==='interface'?.45*(condition?s.outcome:activity):0)}/>)}
   {v==='eczema'&&Array.from({length:12},(_,i)=><circle key={i} cx={82+(i%6)*62} cy={193+Math.floor(i/6)*15} r={2+4*damaged} fill={blue} opacity={damaged}/>)}
   {v==='interface'&&Array.from({length:7},(_,i)=><path key={i} d={`M${90+i*53} 212l7 9-8 7`} fill="none" stroke={red} strokeWidth="4" opacity={activity}/>)}
   {label(41,211,'Living epidermis',11)}{label(41,254,'Basal interface',11)}
  </g>
  <g {...hit('surface')}>
   {Array.from({length:13},(_,i)=><rect key={i} x={37+i*35} y={158-scale-edema} width={31-(barrier?8*(1-s.benefit):7*damaged)} height="17" rx="2" fill={skin.skin} stroke={pv('ink',.65)} strokeWidth="1"/>)}
   {(v==='psoriasis'||v==='seborrheic')&&Array.from({length:13},(_,i)=><path key={i} d={`M${70+i*29} ${148-scale+5*Math.sin(i)}l17-4`} stroke={v==='psoriasis'?pv('ink'):gold} strokeWidth="5" opacity={activity}/>)}
   {v==='eczema'&&<path d="M137 157l8 11-6 10M250 158l8 9-10 10M374 158l-8 11 7 8" fill="none" stroke={red} strokeWidth="4" opacity={damaged}/>}
   {v==='tinea'&&Array.from({length:6},(_,i)=><path key={i} d={`M${82+i*62} 164l18 3 13-5m-13 5 8 6`} fill="none" stroke={gold} strokeWidth="2" opacity={activity}/>)}
   {v==='photo'&&<><path d="M170 163l16 8m54-8 15 9m68-9 17 7" stroke={red} strokeWidth="6" opacity={activity}/>{condition&&<><path d="M205 58l-5 35h16l-10 34M300 58l-5 35h16l-10 34" stroke={gold} strokeWidth="3" fill="none" opacity={s.exposure}/>{label(184,49,'Plant chemical + UVA',11)}</>}</>}
   {barrier&&<><path d="M43 151H480" stroke={blue} strokeWidth={c.id==='petrolatum'?9:4} opacity={s.benefit}/>{flow([118,155],[118,93],1-.85*s.benefit)}{flow([302,155],[302,93],1-.85*s.benefit)}</>}
   {section==='skincare'&&c.mode==='uv'&&<><path d="M45 145H480" stroke={gold} strokeWidth="6" opacity={s.action}/>{flow([180,70],[180,145],1,gold)}{flow([180,147],[180,222],1-.9*s.benefit,gold)}</>}
   {section==='skincare'&&c.mode==='exfoliant'&&Array.from({length:6},(_,i)=><rect key={i} x={66+i*63} y={155-45*s.benefit} width="24" height="7" fill={skin.skin} stroke={pv('ink',.5)} opacity={s.action*(1-.8*s.settle)}/>)}
   {label(41,123,'Stratum corneum · barrier',11)}
  </g>
  <g {...hit('follicle')}><path d="M362 150V197Q332 251 345 323Q357 355 374 325Q391 264 371 198V150" fill={pv('panel')} stroke={pv('ink',.65)} strokeWidth="2"/><path d="M361 326V127" stroke={pv('ink',.75)} strokeWidth="3"/><path d="M374 221Q426 193 433 225Q429 252 378 243Z" fill={gold} fillOpacity=".4" stroke={gold} strokeWidth="2"/>{v==='acne'&&<><ellipse cx="365" cy="186" rx={8+5*activity} ry={6+19*activity} fill={gold} opacity={activity}/><ellipse cx="377" cy="215" rx="30" ry="26" fill={skin.inflamed} opacity={activity*.6}/>{Array.from({length:5},(_,i)=><path key={i} d={`M${352+(i%2)*19} ${219+i*13}l6 3`} stroke={red} strokeWidth="3" opacity={activity}/>)}</>}{label(333,365,'Follicle + sebaceous gland',10)}</g>
  <g {...hit('pathway')}><rect x="516" y="53" width="421" height="388" rx="15" fill={pv('panel')} stroke={pv('ink',.3)}/>{label(535,80,condition?'Surface pattern · separate scale':'Mechanism inset · separate scale',14)}
   {condition?<>
    <rect x="550" y="107" width="352" height="199" rx="40" fill={skin.skin} fillOpacity=".9"/>
    {v==='psoriasis'&&<><path d="M610 138H838V266H610Z" fill={skin.inflamed} opacity={activity}/>{Array.from({length:10},(_,i)=><path key={i} d={`M${621+(i%3)*67} ${154+Math.floor(i/3)*29}l34-4`} stroke={pv('ink')} strokeWidth="5" opacity={activity}/>)}</>}
    {v==='eczema'&&<><path d="M588 176q49-63 97-14q45-41 104 0q81 58 5 111q-59 28-99-13q-92 25-107-30Z" fill={skin.inflamed} opacity={activity*.8}/><path d="M635 171l23 44-12 30m82-79-12 51 18 23" stroke={pv('ink',.6)} strokeWidth="3" fill="none" opacity={activity}/></>}
    {v==='photo'&&<><path d="M628 132l24 111m72-101 18 110m66-112-11 95" stroke={skin.inflamed} strokeWidth="21" opacity={activity}/><path d="M628 132l24 111m72-101 18 110m66-112-11 95" stroke={skin.pigment} strokeWidth="19" opacity={s.outcome*.8}/></>}
    {v==='lipoma'&&<><ellipse cx="724" cy="208" rx={54*activity} ry={30*activity} fill={skin.skin} stroke={pv('ink',.5)} strokeWidth="2"/>{label(596,286,'Often normal overlying skin',12)}</>}
    {v==='tinea'&&<><ellipse cx="724" cy="207" rx={35+62*activity} ry={21+42*activity} fill="none" stroke={skin.inflamed} strokeWidth="10" opacity={activity}/>{Array.from({length:15},(_,i)=><circle key={i} cx={724+92*Math.cos(i*Math.PI*2/15)} cy={207+61*Math.sin(i*Math.PI*2/15)} r="3" fill={pv('ink')} opacity={activity}/>)}</>}
    {v==='wheal'&&<><ellipse cx={665+10*Math.sin(s.time)} cy="183" rx="49" ry="25" fill={pv('ink',.3)} stroke={skin.inflamed} strokeWidth="5" opacity={activity}/><ellipse cx="778" cy="236" rx="60" ry="29" fill={pv('ink',.3)} stroke={skin.inflamed} strokeWidth="5" opacity={activity}/></>}
    {v==='seborrheic'&&Array.from({length:17},(_,i)=><path key={i} d={`M${598+(i%5)*56} ${143+Math.floor(i/5)*40}l20 9`} stroke={gold} strokeWidth="7" opacity={activity}/>)}
    {['acne','rosacea','exanthem','interface'].includes(v)&&Array.from({length:18},(_,i)=><g key={i}><circle cx={590+(i%6)*53} cy={147+Math.floor(i/6)*57} r={v==='interface'?9:6} fill={v==='interface'?purple:skin.inflamed} opacity={activity}/>{v==='acne'&&i%3===0&&<circle cx={590+(i%6)*53} cy={147+Math.floor(i/6)*57} r="3" fill={gold} opacity={activity}/>}</g>)}
    {v==='rosacea'&&<path d="M620 171l28 18-9 34m9-34 35-4m81 31 30-22 15 11" fill="none" stroke={red} strokeWidth="2" opacity={activity}/>}
    {label(535,337,c.layer.length>53?'See sidebar for affected compartment':c.layer,12)}
    <Meter x={540} y={398} w={366} label="Illustrated process · qualitative" value={s.action} color={purple}/>
   </>:<>
    {section==='medications'?<DrugTarget lesson={c} time={s.time} exposure={s.exposure} engagement={s.action} benefit={s.benefit} labels={labels}/>:c.mode==='barrier'?<>
     {Array.from({length:12},(_,i)=><rect key={i} x={562+(i%4)*83} y={143+Math.floor(i/4)*34} width={65+(c.id==='ceramides'?12*s.benefit:0)} height="25" rx="3" fill={skin.skin} stroke={gold} strokeWidth={c.id==='ceramides'?1+2*s.benefit:1}/>)}
     {c.id==='humectants'&&Array.from({length:10},(_,i)=><circle key={i} cx={579+(i%5)*65} cy={156+Math.floor(i/5)*57} r={2+4*s.benefit} fill={blue} opacity={s.action}/>)}
     {c.id==='petrolatum'&&<path d="M555 130H896" stroke={blue} strokeWidth="10" opacity={s.action}/>}
     {flow([610,192],[610,110],1-.85*s.benefit)}{flow([818,192],[818,110],1-.85*s.benefit)}
     {label(548,302,c.id==='humectants'?'Water binding · surface hydration':'Barrier film / lipid support',12)}
    </>:c.mode==='pigment'?<>
     <path d="M606 252l32-67 48 31 38-60 40 50 46-16" fill="none" stroke={skin.pigment} strokeWidth="7"/><circle cx="626" cy="252" r="19" fill={skin.pigment}/>{label(548,287,'Melanocyte → keratinocyte',12)}<rect x="783" y="119" width="75" height="62" rx="15" fill={skin.skin} stroke={pv('ink',.6)}/>{flow([670,200],[820,151],1-.65*s.benefit,skin.pigment)}<path d="M743 160l26 26m0-26-26 26" stroke={blue} strokeWidth="5" opacity={s.action}/>
    </>:c.mode==='antioxidant'?<>
     {Array.from({length:7},(_,i)=><g key={i} opacity={1-.7*s.benefit}><circle cx={589+i*43} cy={150+30*Math.sin(s.time+i)} r="9" fill={red}/><text x={586+i*43} y={154+30*Math.sin(s.time+i)} fontSize="12" fill={pv('bg')}>•</text></g>)}{flow([575,252],[839,186],s.action,blue)}{label(547,283,'Redox support · collagen enzyme cofactor',11)}
    </>:c.mode==='uv'?<>
     <path d="M555 192H898" stroke={gold} strokeWidth="12"/>{Array.from({length:5},(_,i)=><g key={i}>{flow([582+i*68,112],[582+i*68,190],1,gold)}{flow([582+i*68,200],[582+i*68,268],1-.9*s.benefit,gold)}</g>)}{label(546,302,'Absorption by organic AND mineral filters',11)}
    </>:<>
     {c.pathway.map((name,i)=><g key={name}><rect x="561" y={110+i*67} width="322" height="43" rx="10" fill={pv('bg')} stroke={i===c.target&&c.mode==='signal'?blue:pv('ink',.4)} strokeWidth="2"/>{label(574,136+i*67,name,11)}{i<2&&flow([722,156+i*67],[722,175+i*67],c.mode==='signal'&&i>=c.target?1-.85*s.action:1,purple)}</g>)}
     {c.mode==='signal'?<><circle cx={525+34*s.exposure} cy={130+c.target*67} r="8" fill={blue} opacity={s.exposure}/><path d={`M860 ${118+c.target*67}l18 24m0-24-18 24`} stroke={blue} strokeWidth="5" opacity={s.action}/></>:<>{flow([542,295],[892,295],s.action,blue)}{label(548,321,c.mode==='conversion'?'Conversion precedes receptor signaling':c.mode==='exfoliant'?'Superficial cohesion / shedding':'Follicular delivery and response',11)}</>}
    </>}
    <Meter x={540} y={370} w={366} label="Target engagement · illustrative" value={s.action} color={blue}/><Meter x={540} y={413} w={366} label="Possible downstream benefit · gradual" value={s.benefit} color={purple}/>
   </>}
  </g>
  {label(27,491,'Illustrative anatomy, color and time · not a clinical photograph or response clock',11)}
 </svg>;
}
