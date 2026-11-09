import { makeHit, Label, Meter, pv } from './sceneKit';
import FlowParticles from './FlowParticles';
import { PEDIATRIC_LESSONS, pediatricState, type PediatricKind, type PediatricStructure } from '@/data/pathophysiology/pediatricEmergencies';

type State = ReturnType<typeof pediatricState>;
type Hit = ReturnType<typeof makeHit<PediatricStructure>>;
type Props = { kind: PediatricKind; time: number; normal?: boolean; compact?: boolean; showLabels: boolean; selected: PediatricStructure | null; onSelect: (id: PediatricStructure) => void };
const blue = '#69baf2', red = '#ef8c8b', amber = '#f6ca64';

function Tetralogy({ state: s, hit, showLabels }: { state: State; hit: Hit; showLabels: boolean }) {
  const defect = 24 * s.onset;
  return <>
    <Label show={showLabels} x={34} y={52} size={13}>Anterior cutaway · patient right is on the left</Label>
    <path d="M171 112C115 153 127 262 260 350C393 262 405 153 348 112C319 86 291 105 260 129C229 105 200 86 171 112Z" fill={pv('serosa', .4)} stroke={pv('ink', .65)} strokeWidth="3"/>
    <g {...hit('source')}>
      <ellipse cx="190" cy="160" rx="38" ry="29" fill={pv('fluid', .55)} stroke={blue} strokeWidth="3"/>
      <path d="M157 201Q164 181 203 190Q244 205 250 303Q210 295 183 268Q154 240 157 201Z" fill={pv('fluid', .48)} stroke={blue} strokeWidth={3+5*s.onset}/>
      <FlowParticles from={[190, 167]} to={[203, 257]} time={s.time} color={blue} count={5}/>
      <Label show={showLabels} x={172} y={164}>RA</Label><Label show={showLabels} x={184} y={235}>RV</Label>
      {s.onset > .1 && <Label show={showLabels} x={83} y={295} size={11}>RV hypertrophy</Label>}
    </g>
    <g {...hit('effect')}>
      <ellipse cx="326" cy="160" rx="38" ry="29" fill={pv('serosa', .8)} stroke={red} strokeWidth="3"/>
      <path d="M266 303Q272 209 306 192Q344 179 361 201Q365 253 328 278Q299 299 266 303Z" fill={pv('serosa', .7)} stroke={red} strokeWidth="4"/>
      <FlowParticles from={[326, 167]} to={[312, 258]} time={s.time} color={red} count={5}/>
      <Label show={showLabels} x={310} y={164}>LA</Label><Label show={showLabels} x={310} y={235}>LV</Label>
    </g>
    <g {...hit('flow')}>
      <path d={`M258 187V${238-defect/2} M258 ${238+defect/2}V308`} stroke={pv('ink', .85)} strokeWidth="7"/>
      <path d={s.onset > .01 ? 'M258 200C265 143 267 90 281 81V44' : 'M307 194C300 150 289 106 281 81V44'} stroke={red} strokeWidth="24" fill="none"/>
      <FlowParticles from={[239, 238]} to={[278, 238]} time={s.time} strength={s.shunt} color={blue} count={5}/>
      <FlowParticles from={[282, 92]} to={[282, 43]} time={s.time} color={s.shunt>.2 ? '#c98fae' : red} count={5}/>
      <Label show={showLabels} x={300} y={61} size={13}>{s.onset>.1?'Overriding aorta':'Aorta'}</Label>
      {s.onset>.1 && <Label show={showLabels} x={266} y={256} size={11}>VSD</Label>}
    </g>
    <g {...hit('anatomy')}>
      <path d="M205 200Q205 132 177 100Q161 84 151 71" fill="none" stroke={blue} strokeWidth="19"/>
      <path d="M195 161Q205 153 215 161" fill="none" stroke={amber} strokeWidth={3+8*s.obstruction}/>
      <FlowParticles from={[201, 188]} to={[172, 95]} time={s.time} strength={1-.82*s.obstruction} color={blue} count={7}/>
      <Label show={showLabels} x={57} y={81} size={12}>Pulmonary artery</Label>
      {s.onset>.1 && <Label show={showLabels} x={46} y={139} size={11}>RV outflow obstruction</Label>}
    </g>
    <g aria-hidden><rect x="432" y="106" width="278" height="185" rx="14" fill={pv('panel')} stroke={pv('ink', .3)}/>
      <Label show={showLabels} x={450} y={133} size={13}>Flow and pressure · qualitative</Label>
      <Meter x={451} y={173} w={235} label="Pulmonary outflow" value={1-.82*s.obstruction} color={blue}/>
      <Meter x={451} y={216} w={235} label="Right-to-left shunt" value={s.shunt} color={red}/>
      <Meter x={451} y={259} w={235} label="Systemic oxygen content" value={1-.7*s.shunt} color={amber}/>
    </g>
  </>;
}

function Measles({ state: s, hit, showLabels }: { state: State; hit: Hit; showLabels: boolean }) {
  return <>
    <Label show={showLabels} x={32} y={51} size={13}>Respiratory tract and separate tissue insets</Label>
    <g {...hit('source')}>
      <path d="M140 91Q140 71 160 71Q180 71 180 91V179M160 110V190" fill="none" stroke={pv('ink', .65)} strokeWidth="6"/>
      <path d="M159 187Q107 158 91 197Q71 241 103 286Q140 301 160 258Q180 301 217 286Q249 241 229 197Q213 158 160 187Z" fill={pv('serosa', .55)} stroke={pv('ink', .6)} strokeWidth="2"/>
      <FlowParticles from={[45, 95]} to={[158, 95]} time={s.time} strength={s.onset} color={amber}/>
      <Label show={showLabels} x={73} y={320}>Respiratory entry</Label>
    </g>
    <g {...hit('anatomy')}>
      <ellipse cx="307" cy="179" rx="43" ry="51" fill={pv('panel')} stroke={pv('serosa')} strokeWidth="4"/>
      {Array.from({length: 7},(_,i)=><circle key={i} cx={285+(i%3)*20} cy={151+Math.floor(i/3)*22} r="6" fill={amber} opacity={s.onset}/>) }
      <Label show={showLabels} x={258} y={250} size={12}>Lymphoid tissue</Label>
    </g>
    <g {...hit('flow')}>
      <path d="M214 168H259M353 179H407" fill="none" stroke={pv('ink', .45)} strokeWidth="4"/>
      <FlowParticles from={[216,168]} to={[260,168]} time={s.time} strength={s.onset} color={amber}/>
      <FlowParticles from={[354,179]} to={[407,179]} time={s.time} strength={s.progression} color={amber}/>
      <Label show={showLabels} x={347} y={209} size={12}>Systemic spread</Label>
    </g>
    <g {...hit('effect')}>
      <rect x="410" y="75" width="328" height="252" rx="15" fill={pv('panel')} stroke={pv('ink', .3)}/>
      <path d="M488 137Q464 115 448 145Q432 180 451 213Q470 224 488 193Q506 224 525 213Q544 180 528 145Q512 115 488 137Z" fill={pv('serosa', .5)} stroke={pv('ink', .5)} strokeWidth="2"/>
      <path d="M452 176Q470 153 485 172M492 189Q511 157 527 180" stroke={red} strokeWidth="8" fill="none" opacity={s.injury}/>
      <Label show={showLabels} x={445} y={238} size={12}>Possible pneumonia</Label>
      <path d="M603 135Q589 109 612 98Q627 78 648 98Q673 95 676 118Q686 137 668 149H611Q590 155 603 135Z" fill={pv('serosa', .65)} stroke={red} strokeWidth="2"/>
      <circle cx="641" cy="124" r="20" fill={red} opacity={s.injury*.4}/>
      <Label show={showLabels} x={595} y={178} size={12}>Possible encephalitis</Label>
      <Label show={showLabels} x={590} y={217} size={12}>Immune memory</Label>
      {Array.from({length: 6},(_,i)=><circle key={i} cx={601+i*19} cy="243" r="6" fill={blue} opacity={Math.max(.18,1-s.memoryLoss*(i+1)/6)}/>) }
      <Label show={showLabels} x={586} y={276} size={11}>May be reduced after infection</Label>
    </g>
  </>;
}

function Intussusception({ state: s, hit, showLabels }: { state: State; hit: Hit; showLabels: boolean }) {
  const advance = 160*s.invagination;
  return <>
    <Label show={showLabels} x={32} y={52} size={13}>Longitudinal bowel section · left to right</Label>
    <g {...hit('anatomy')}>
      <path d="M255 135H680Q706 135 706 161V262Q706 288 680 288H255" fill={pv('serosa', .33)} stroke={pv('serosa')} strokeWidth="12"/>
      <path d="M265 167H680V257H265" fill={pv('panel')} stroke={pv('ink', .35)} strokeWidth="2"/>
      <Label show={showLabels} x={510} y={120}>Receiving bowel</Label>
    </g>
    <g {...hit('source')}>
      <path d={`M56 159H${274+advance}Q${305+advance} 159 ${305+advance} 190V234Q${305+advance} 264 ${274+advance} 264H56`} fill={pv('serosa', .55)} stroke={pv('serosa')} strokeWidth="11"/>
      <path d={`M59 184H${258+advance}V239H59`} fill={pv('panel')} stroke={pv('ink', .3)} strokeWidth="2"/>
      <FlowParticles from={[76, 211]} to={[260+advance, 211]} time={s.time} strength={1-.8*s.invagination} color={pv('fluid')}/>
      <Label show={showLabels} x={62} y={143}>Entering bowel</Label>
    </g>
    <g {...hit('flow')}>
      <path d={`M130 95Q${215+advance*.6} 104 ${265+advance} 160`} fill="none" stroke={red} strokeWidth="6" opacity={1-.75*s.ischemia}/>
      <path d={`M154 90Q${230+advance*.6} 100 ${280+advance} 160`} fill="none" stroke={blue} strokeWidth="6" opacity={1-.8*s.congestion}/>
      <FlowParticles from={[131,96]} to={[265+advance,160]} time={s.time} strength={1-.75*s.ischemia} color={red}/>
      <Label show={showLabels} x={87} y={83} size={12}>Mesenteric vessels</Label>
    </g>
    <g {...hit('effect')}>
      <path d={`M${250+advance} 166Q${300+advance} 165 ${302+advance} 210Q${300+advance} 258 ${250+advance} 260`} fill="none" stroke="#85495c" strokeWidth={8+13*s.congestion} opacity={s.congestion*.85}/>
      <ellipse cx={275+advance} cy="212" rx="15" ry="33" fill="#4b3041" opacity={s.ischemia*.7}/>
      <Label show={showLabels} x={450} y={320} size={12}>{s.ischemia>.1?'Possible persistent wall injury':'Lumen and bowel wall'}</Label>
    </g>
  </>;
}

export default function PediatricEmergencyScene({ kind, time, normal, compact, showLabels, selected, onSelect }: Props) {
  const state = pediatricState(kind, time, normal);
  const hit = makeHit(PEDIATRIC_LESSONS[kind].structures, selected, onSelect, compact);
  const props = { state, hit, showLabels };
  return <svg viewBox="0 0 760 370" role="group" aria-label={PEDIATRIC_LESSONS[kind].title} className="block h-auto w-full rounded-lg patho-scene" style={{background:pv('bg')}}>
    {kind==='tetralogy' && <Tetralogy {...props}/>}
    {kind==='measles' && <Measles {...props}/>}
    {kind==='intussusception' && <Intussusception {...props}/>}
    <Label show={showLabels} x={25} y={355} size={11}>Qualitative conceptual animation</Label>
  </svg>;
}
