import { EMERGENCIES, sceneState, type EmergencyKind, type Structure } from '@/data/pathophysiology/immuneEmergencies';
import FlowParticles from './FlowParticles';
import { Label, Meter, makeHit, pv } from './sceneKit';

type Props = {
  kind: EmergencyKind; time: number; normal?: boolean; compact?: boolean;
  selected: Structure | null; onSelect: (id: Structure) => void;
  variant?: string; title?: string; showLabels: boolean;
};
type IllustrationProps = {
  t: number; s: ReturnType<typeof sceneState>; hit: ReturnType<typeof makeHit<Structure>>;
  labels: boolean; right: boolean;
};

function Meninges({t, s, hit, labels}: IllustrationProps) {
  return <>
    <g {...hit('entry')}>
      <rect x="38" y="91" width="157" height="64" rx="25" fill={pv('inflame', .24)} stroke={pv('serosa', .8)} strokeWidth="3"/>
      <Label show={labels} x={116} y={81} anchor="middle">Bloodstream</Label>
      <FlowParticles from={[50,121]} to={[180,121]} time={t} strength={s.entry} color={pv('alert')}/>
      <path d="M195 122 L281 174" stroke={pv('alert', .55*s.entry)} strokeWidth="3" strokeDasharray="6 4"/>
      <FlowParticles from={[197,122]} to={[280,174]} time={t} strength={s.entry} color={pv('alert')}/>
    </g>
    <g {...hit('site')}>
      <path d="M245 259V190C245 54 569 54 569 190V259Z" fill={pv('panel')} stroke={pv('ink', .56)} strokeWidth="11"/>
      <path d="M257 254V191C257 73 557 73 557 191V254Z" fill={pv('fluid', .21)} stroke={pv('serosa', .8)} strokeWidth="3"/>
      <Label show={labels} x={407} y={106} anchor="middle">Dura and arachnoid</Label>
      <Label show={labels} x={407} y={134} anchor="middle">Subarachnoid space · CSF</Label>
    </g>
    <g {...hit('spread')}>
      <path d="M284 250V197C284 116 530 116 530 197V250Z" fill={pv('membrane', .52)} stroke={pv('ink', .76)} strokeWidth="2"/>
      <ellipse cx="411" cy="207" rx={38 + 64*s.spread} ry={13 + 26*s.spread} fill={pv('inflame', .57*s.spread)}/>
      <Label show={labels} x={409} y={213} anchor="middle">Brain tissue</Label>
      <Meter x={288} y={304} w={246} label="Edema burden" value={s.spread} color={pv('inflame')}/>
    </g>
    <g {...hit('injury')}>
      <path d="M268 208V191C268 97 546 97 546 191V208" fill="none" stroke={pv('alert', .7*s.injury)} strokeWidth={2+12*s.injury}/>
      <FlowParticles from={[324,143]} to={[487,143]} time={t} strength={s.injury*(1-.72*s.response)} color={pv('alert')} count={10}/>
      <Label show={labels && s.injury > .1} x={548} y={277} anchor="end">Inflammation in CSF</Label>
    </g>
    <Response hit={hit} s={s} text="Empiric antibiotics target bacteria while complications are assessed."/>
  </>;
}

function SoftTissue({t, s, hit, labels}: IllustrationProps) {
  const end = 202+406*s.injury;
  const cut = 85*s.response;
  return <>
    <g {...hit('entry')}>
      <rect x="50" y="101" width="661" height="31" rx="9" fill={pv('serosa', .75)} stroke={pv('ink', .45)}/>
      <path d="M166 102 l17 18 14-18" fill={pv('bg')} stroke={pv('alert', s.entry)} strokeWidth={3} opacity={s.entry}/>
      <Label show={labels} x={64} y={120}>Skin</Label>
      <FlowParticles from={[183,122]} to={[199,207]} time={t} strength={s.entry} color={pv('alert')}/>
    </g>
    <rect x="50" y="133" width="661" height="66" fill={pv('contents', .39)}/>
    <Label show={labels} x={64} y={165}>Subcutaneous tissue</Label>
    <g {...hit('site')}>
      <rect x="50" y="199" width="661" height="26" fill={pv('fluid', .53)}/>
      <Label show={labels} x={64} y={217}>Deep fascia</Label>
      <path d={`M${202+cut} 212 H${Math.max(202+cut,end)}`} stroke={pv('alert', .91*s.injury)} strokeWidth={4+13*s.injury}/>
      <FlowParticles from={[202+cut,212]} to={[Math.max(202+cut,end),212]} time={t} strength={s.injury*(1-.74*s.response)} color={pv('ink')} count={9}/>
    </g>
    <rect x="50" y="225" width="661" height="61" fill={pv('serosa', .3)}/>
    <Label show={labels} x={64} y={252}>Muscle</Label>
    <g {...hit('injury')}>
      <path d={`M${243+cut} 237 H${Math.max(243+cut,end-35)}`} stroke={pv('inflame', s.spread*.89)} strokeWidth={4+9*s.spread} strokeDasharray="12 5"/>
      <Label show={labels && s.spread > .1} x={end-14} y={267} anchor="end">Ischemic tissue</Label>
    </g>
    <g {...hit('spread')}>
      <Meter x={460} y={317} w={243} label="Local perfusion reserve" value={1-.76*s.spread} color={pv('fluid')}/>
    </g>
    {s.response > .02 && <path d={`M202 197 H${202+cut} V257 H202Z`} fill={pv('bg')} stroke={pv('ink', .67)} strokeDasharray="4 3"/>}
    <Response hit={hit} s={s} text="Debridement removes nonviable tissue. Antibiotics and resuscitation support source control."/>
  </>;
}

function Neutrophils({t, s, hit, labels}: IllustrationProps) {
  const supply = 1-.84*s.entry;
  return <>
    <g {...hit('site')}>
      <rect x="32" y="74" width="196" height="121" rx="15" fill={pv('panel')} stroke={pv('ink', .5)}/>
      <Label show={labels} x={130} y={105} anchor="middle">Bone marrow</Label>
      {[0,1,2,3,4,5].map(i=><g key={i} opacity={Math.max(0,Math.min(1,6*supply-i))}>
        <circle cx={68+i*25} cy="146" r="10" fill={pv('fluid')}/>
        <circle cx={68+i*25} cy="146" r="4" fill={pv('panel')}/>
      </g>)}
      <FlowParticles from={[130,178]} to={[130,260]} time={t} strength={supply} color={pv('fluid')}/>
    </g>
    <g {...hit('entry')}>
      <Label show={labels} x={560} y={94} anchor="middle">Mucosal barrier</Label>
      <path d={`M406 155H${553-29*s.injury} M${553+29*s.injury} 155H700`} stroke={pv('serosa')} strokeWidth="16" strokeLinecap="round"/>
      <FlowParticles from={[551,111]} to={[551,269]} time={t} strength={s.injury} color={pv('alert')} count={8}/>
    </g>
    <g {...hit('injury')}>
      <rect x="31" y="243" width="696" height="65" rx="25" fill={pv('inflame', .18)} stroke={pv('serosa', .8)} strokeWidth="2"/>
      <FlowParticles from={[50,267]} to={[710,267]} time={t} strength={supply} color={pv('fluid')} count={14} radius={6} speed={.28}/>
      <Label show={labels} x={35} y={232}>Circulating neutrophils</Label>
    </g>
    <g {...hit('spread')}>
      <FlowParticles from={[550,290]} to={[710,290]} time={t} strength={s.spread*(1-.72*s.response)} color={pv('alert')} count={9}/>
      <Label show={labels && s.spread > .1} x={723} y={333} anchor="end">Organisms can spread despite subtle local signs</Label>
    </g>
    <Response hit={hit} s={s} text="Empiric therapy targets infection. Marrow recovery follows its own course."/>
  </>;
}

function Valves({t, s, hit, labels, right}: IllustrationProps) {
  const embolus = s.spread;
  const embolusX = 324 + 354*embolus;
  const embolusY = 194 + 36*Math.min(1, embolus*3);
  return <>
    <g {...hit('entry')}>
      <Label show={labels} x={42} y={113}>Bacteremia</Label>
      <path d="M40 142 H254" stroke={pv('serosa', .7)} strokeWidth="4"/>
      <FlowParticles from={[43,142]} to={[254,142]} time={t} strength={s.entry} color={pv('alert')}/>
    </g>
    <g {...hit('site')}>
      <rect x="255" y="90" width="198" height="208" rx="36" fill={pv('inflame', .2)} stroke={pv('ink', .53)} strokeWidth="3"/>
      <Label show={labels} x={354} y={122} anchor="middle">{right ? 'Right heart · tricuspid' : 'Left heart · mitral'}</Label>
      <path d={`M262 180 Q307 ${188+22*s.injury} 348 216 M446 180 Q402 192 362 216`} stroke={pv('serosa')} strokeWidth="8" fill="none" strokeLinecap="round"/>
      <ellipse cx="324" cy="194" rx={8+24*s.injury} ry={5+13*s.injury} fill={pv('alert', .88*s.entry)}/>
      <Label show={labels && s.entry > .1} x={275} y={258}>Vegetation</Label>
    </g>
    <g {...hit('injury')}>
      <path d="M355 235 V153" stroke={pv('alert', .65*s.injury)} strokeWidth="3" strokeDasharray="5 5"/>
      <FlowParticles from={[355,235]} to={[355,153]} time={t} strength={.65*s.injury} color={pv('alert')} count={4}/>
      <Label show={labels && s.injury > .1} x={432} y={281} anchor="end">Possible regurgitation</Label>
    </g>
    <g {...hit('spread')}>
      <path d="M452 230 H683" stroke={pv('serosa', .7)} strokeWidth="9"/>
      <Label show={labels} x={569} y={207} anchor="middle">{right ? 'Pulmonary arteries' : 'Systemic arteries'}</Label>
      <FlowParticles from={[463,230]} to={[679,230]} time={t} color={pv('fluid')} strength={.7} speed={.45}/>
      {embolus > 0 && <path d="M-7 -3 L1 -7 L8 -2 L5 5 L-3 7Z" transform={`translate(${embolusX} ${embolusY})`} fill={pv('alert')} stroke={pv('ink',.75)}/>}
      <Label show={labels} x={697} y={272} anchor="end">{right ? 'Lung · septic pulmonary emboli' : 'Brain, spleen, kidney · septic emboli'}</Label>
    </g>
    <Response hit={hit} s={s} text="Culture-directed therapy and evaluation for valve or embolic complications."/>
  </>;
}

function Response({hit, s, text}: {hit: IllustrationProps['hit']; s: IllustrationProps['s']; text: string}) {
  if (s.response <= .01) return null;
  return <g {...hit('response')}>
    <rect x="29" y="356" width="700" height="42" rx="10" fill={pv('panel')} stroke={pv('fluid', .35+.55*s.response)}/>
    <text x="43" y="383" fontSize="13" fill={pv('ink')}>{text}</text>
  </g>;
}

const illustrations = {meningitis: Meninges, softTissue: SoftTissue, febrileNeutropenia: Neutrophils, endocarditis: Valves};
export default function ImmuneEmergencyScene({kind, time, normal, compact, selected, onSelect, variant, title, showLabels}: Props) {
  const t = normal ? 0 : time;
  const lesson = EMERGENCIES[kind];
  const Diagram = illustrations[kind];
  return <svg viewBox="0 0 760 428" role="group" aria-label={title ?? lesson.title} className="block h-auto w-full rounded-lg patho-scene" style={{background:pv('bg')}}>
    <text x="26" y="38" fill={pv('ink')} fontSize="17">{lesson.title} · schematic</text>
    <Diagram t={t} s={sceneState(t)} hit={makeHit(lesson.structures,selected,onSelect,compact)} labels={showLabels} right={variant==='right'}/>
    <Label show={showLabels} x={28} y={416} size={11}>Animation time and symbol counts represent qualitative changes.</Label>
  </svg>;
}
