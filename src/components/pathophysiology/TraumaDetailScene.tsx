import { TRAUMA_DETAIL_LESSONS, traumaDetailState, type TraumaDetailKind, type TraumaDetailStructure } from '@/data/pathophysiology/traumaDetails';
import FlowParticles from './FlowParticles';
import { Label, Meter, makeHit, pv } from './sceneKit';

type Props = {
  kind: TraumaDetailKind;
  time: number;
  variant?: string;
  side?: 'left' | 'right';
  normal?: boolean;
  compact?: boolean;
  showLabels: boolean;
  selected: TraumaDetailStructure | null;
  onSelect: (id: TraumaDetailStructure) => void;
};
type State = ReturnType<typeof traumaDetailState>;
type Hit = ReturnType<typeof makeHit<TraumaDetailStructure>>;
type SceneProps = { state: State; hit: Hit; showLabels: boolean };
const red = '#ed8d8d';
const blue = '#79bff0';
const gold = '#f2d172';

function Head({ state: s, hit, showLabels, side }: SceneProps & { side: 'left' | 'right' }) {
  const subdural = s.variant === 'subdural';
  const flip = side === 'right' ? 'translate(490 0) scale(-1 1)' : undefined;
  const shift = 24 * s.midlineShift;
  const outerCurve = subdural ? 438 : 455;
  const innerCurve = outerCurve - (subdural ? 52 : 78) * s.hematoma;
  const midline = 245 + (side === 'left' ? -shift : shift);
  return <>
    <Label show={showLabels} x={25} y={38} size={13}>Axial schematic · anterior above · patient right on viewer left</Label>
    <g {...hit('anatomy')}>
      <ellipse cx="245" cy="210" rx="177" ry="157" fill={pv('panel')} stroke={pv('ink', .7)} strokeWidth="19"/>
      <ellipse cx="245" cy="210" rx="165" ry="145" fill="none" stroke={pv('serosa')} strokeWidth="4"/>
      <ellipse cx="245" cy="210" rx="157" ry="137" fill="none" stroke={blue} strokeWidth="2"/>
      {showLabels && <><circle cx="62" cy="392" r="4" fill={pv('ink', .7)}/><circle cx="141" cy="392" r="4" fill={pv('serosa')}/><circle cx="210" cy="392" r="4" fill={blue}/></>}
      <Label show={showLabels} x={72} y={396} size={12}>Skull</Label>
      <Label show={showLabels} x={151} y={396} size={12}>Dura</Label>
      <Label show={showLabels} x={220} y={396} size={12}>Arachnoid</Label>
    </g>
    <g {...hit('effect')}>
      <path d={`M245 85C155 80 98 141 103 214C107 285 166 334 245 334Q${midline} 210 245 85Z`}
        fill={pv('serosa', .55)} stroke={pv('ink', .25)} strokeWidth="2"/>
      <path d={`M245 85C335 80 392 141 387 214C383 285 324 334 245 334Q${midline} 210 245 85Z`}
        fill={pv('serosa', .55)} stroke={pv('ink', .25)} strokeWidth="2"/>
      <path d={`M245 86Q${midline} 210 245 334`} fill="none" stroke={pv('ink', .8)} strokeWidth="3"/>
      <path d="M131 154q31-34 63-31m-73 72q35-30 69-23m-61 71q28-18 58-12m118-108q32-3 62 31m-59 18q34-7 69 23m-65 36q30-6 58 12"
        fill="none" stroke={pv('ink', .32)} strokeWidth="3"/>
      <path d="M160 102q15 20 42 14m-76 33q14 13 31 6m-41 56q18 9 35 2m-26 54q22-8 39 3m22 29q18-18 37-10m16-179q-5 20-25 28m-8 43q-13 9-12 29m22 29q-15 17-7 34m79-171q-15 20-42 14m76 33q-14 13-31 6m41 56q-18 9-35 2m26 54q-22-8-39 3m-22 29q-18-18-37-10"
        fill="none" stroke={pv('ink', .27)} strokeWidth="2.5" strokeLinecap="round"/>
      <Label show={showLabels} x={161} y={215} size={12}>Cerebral tissue</Label>
    </g>
    <g {...hit('blood')} transform={flip}>
      <path d={`M365 101Q${outerCurve} 210 365 319Q${innerCurve} 210 365 101Z`}
        fill={red} stroke={red} strokeWidth="2" opacity={s.hematoma}/>
      <path d={`M365 101Q${innerCurve} 210 365 319`} fill="none" stroke={subdural ? blue : pv('serosa')} strokeWidth="4" opacity={s.hematoma}/>
    </g>
    <g {...hit('injury')} transform={flip}>
      <path d={subdural ? 'M345 121Q369 122 389 108' : 'M384 102l14 14-10 12 12 14'} stroke={gold} strokeWidth="4" fill="none" opacity={s.onset}/>
      <FlowParticles from={[386, 132]} to={[385, 210]} time={s.time} strength={s.progression * (1 - .6 * s.response)} color={red} count={5}/>
    </g>
    <g>
      <rect x="475" y="78" width="277" height="241" rx="15" fill={pv('panel')} stroke={pv('ink', .3)}/>
      <Label show={showLabels} x={493} y={108} size={13}>{subdural ? 'Subdural compartment' : 'Epidural compartment'}</Label>
      <Label show={showLabels} x={493} y={133} size={11}>{subdural ? 'Between dura and arachnoid' : 'Between skull and dura'}</Label>
      <Label show={showLabels} x={493} y={159} size={11}>{`Selected side: ${side}`}</Label>
      <Label show={showLabels} x={493} y={178} size={10}>{subdural ? 'Possible bridging-vein injury' : 'Possible meningeal-vessel injury'}</Label>
      <Meter x={494} y={202} w={235} label="Collection · qualitative" value={s.hematoma} color={red}/>
      <Meter x={494} y={251} w={235} label="Possible mass effect" value={s.midlineShift} color={gold}/>
      <Label show={showLabels} x={493} y={293} size={10}>Blood and brain geometry are illustrative.</Label>
    </g>
    <Label show={showLabels} x={25} y={446} size={11}>Select a space and side, then use the timeline. No imaging values are measured.</Label>
  </>;
}

function Pelvis({ state: s, hit, showLabels }: SceneProps) {
  const arterial = s.variant === 'arterial';
  const gap = 18 * s.pelvicDisruption;
  return <>
    <Label show={showLabels} x={25} y={38} size={13}>Anterior pelvic view · conceptual unstable-ring example</Label>
    <g {...hit('anatomy')}>
      <path d={`M${225-gap} 91Q${135-gap} 77 ${112-gap} 126Q${110-gap} 171 ${158-gap} 191L${192-gap} 218Q${203-gap} 238 ${218-gap} 245L${228-gap} 262L${246-gap} 251L${224-gap} 213Q${225-gap} 151 ${225-gap} 91Z`}
        fill={pv('serosa', .38)} stroke={pv('ink', .7)} strokeWidth="3"/>
      <path d={`M${265+gap} 91Q${355+gap} 77 ${378+gap} 126Q${380+gap} 171 ${332+gap} 191L${298+gap} 218Q${287+gap} 238 ${272+gap} 245L${262+gap} 262L${244+gap} 251L${266+gap} 213Q${265+gap} 151 ${265+gap} 91Z`}
        fill={pv('serosa', .38)} stroke={pv('ink', .7)} strokeWidth="3"/>
      <path d="M225 91Q245 74 265 91L260 178L245 203L230 178Z" fill={pv('serosa', .55)} stroke={pv('ink', .6)} strokeWidth="3"/>
      <circle cx={177-gap} cy="227" r="22" fill={pv('serosa', .45)} stroke={pv('ink', .7)} strokeWidth="3"/>
      <circle cx={313+gap} cy="227" r="22" fill={pv('serosa', .45)} stroke={pv('ink', .7)} strokeWidth="3"/>
      <Label show={showLabels} x={228} y={120} size={11}>Sacrum</Label>
      <Label show={showLabels} x={99} y={84} size={11}>Ilium</Label>
      <Label show={showLabels} x={135} y={268} size={11}>Proximal femur</Label>
    </g>
    <g {...hit('injury')}>
      <path d={`M${241-gap} 244L${248-gap} 254L${240-gap} 266M${249+gap} 244L${242+gap} 254L${250+gap} 266`} stroke={gold} strokeWidth="4" fill="none" opacity={s.onset}/>
      <Label show={showLabels} x={186} y={303} size={11}>Pubic symphysis</Label>
      {s.response > .01 && <g opacity={s.response}>
        <path d="M117 222Q245 250 373 222" fill="none" stroke={pv('fluid', .75)} strokeWidth="22" strokeLinecap="round"/>
        <Label show={showLabels} x={115} y={339} size={11}>Temporary pelvic stabilization</Label>
      </g>}
    </g>
    <g {...hit('blood')}>
      <path d="M245 141V183M245 183L193 216M245 183L297 216" fill="none" stroke={arterial ? red : blue} strokeWidth="6"/>
      <FlowParticles from={[245, 143]} to={[193, 216]} time={s.time} strength={1 - .6 * s.pelvicBleeding} color={arterial ? red : blue} count={5}/>
      <ellipse cx="184" cy="211" rx={12 + 28 * s.pelvicBleeding} ry={8 + 19 * s.pelvicBleeding} fill={red} opacity={.65 * s.pelvicBleeding}/>
      <FlowParticles from={[192, 214]} to={[145, 249]} time={s.time} strength={s.pelvicBleeding} color={red} count={5}/>
      <Label show={showLabels} x={78} y={361} size={11}>{arterial ? 'Arterial source emphasized' : 'Venous / fracture source emphasized'}</Label>
    </g>
    <g {...hit('effect')}>
      <rect x="457" y="101" width="293" height="222" rx="15" fill={pv('panel')} stroke={pv('ink', .3)}/>
      <Label show={showLabels} x={475} y={129} size={13}>Hemorrhage and circulation</Label>
      <Meter x={477} y={173} w={253} label="Ongoing bleeding · qualitative" value={s.pelvicBleeding} color={red}/>
      <Meter x={477} y={220} w={253} label="Circulating volume" value={s.circulatingVolume} color={blue}/>
      <Label show={showLabels} x={475} y={267} size={11}>Assess other sources of bleeding too.</Label>
      <Label show={showLabels} x={475} y={287} size={11}>Blood location and volume vary.</Label>
    </g>
    <Label show={showLabels} x={25} y={446} size={11}>Temporary stabilization and bleeding control are shown conceptually, not as procedural instructions.</Label>
  </>;
}

function OpenFracture({ state: s, hit, showLabels }: SceneProps) {
  const gap = 17 * s.wound;
  return <>
    <Label show={showLabels} x={25} y={38} size={13}>Longitudinal limb section · skin above, distal limb to the right</Label>
    <g {...hit('anatomy')}>
      <rect x="43" y="124" width="535" height="201" rx="40" fill={pv('serosa', .28)} stroke={pv('ink', .4)} strokeWidth="2"/>
      <path d={`M66 156Q150 128 ${350-gap} 151V210Q172 226 66 200Z`} fill={pv('serosa', .78)}/>
      <path d={`M${350+gap} 151Q460 137 554 156V204Q472 223 ${350+gap} 210Z`} fill={pv('serosa', .78)}/>
      <path d={`M73 227H${349-gap}L${350-gap} 243L${349-gap} 258H73Z`} fill={pv('ink', .8)}/>
      <path d={`M${351+gap} 227H548V258H${351+gap}L${350+gap} 245Z`} fill={pv('ink', .8)}/>
      <Label show={showLabels} x={86} y={183} size={12}>Skeletal muscle</Label>
      <Label show={showLabels} x={92} y={250} size={12}>Bone</Label>
    </g>
    <g {...hit('injury')}>
      <path d={`M46 123H${350-gap}M${350+gap} 123H576`} stroke={pv('serosa')} strokeWidth="12" strokeLinecap="round"/>
      <path d="M341 124L329 154L343 173M357 124L370 154L359 173" fill="none" stroke={red} strokeWidth="4" opacity={s.wound}/>
      {s.response > .01 && <rect x="315" y="101" width="72" height="25" rx="5" fill={pv('ink', .7)} opacity={s.response}/>}
      <Label show={showLabels} x={265} y={95} size={12}>{s.response > .1 ? 'Wound covered · conceptual' : 'Open wound'}</Label>
    </g>
    <g {...hit('blood')}>
      <path d="M73 284H550" stroke={red} strokeWidth="10" strokeLinecap="round"/>
      <path d="M73 305H550" stroke={gold} strokeWidth="6" strokeLinecap="round"/>
      <FlowParticles from={[80, 284]} to={[543, 284]} time={s.time} color={red} count={9}/>
      <Label show={showLabels} x={587} y={288} size={11}>Artery</Label>
      <Label show={showLabels} x={587} y={309} size={11}>Peripheral nerve</Label>
    </g>
    <g {...hit('effect')}>
      <FlowParticles from={[348, 76]} to={[348, 210]} time={s.time} strength={s.contamination} color={gold} count={7}/>
      <rect x="592" y="102" width="170" height="126" rx="14" fill={pv('panel')} stroke={pv('ink', .3)}/>
      <Label show={showLabels} x={604} y={128} size={12}>Contamination</Label>
      <Meter x={605} y={166} w={144} label="Qualitative exposure" value={s.contamination} color={gold}/>
      <Label show={showLabels} x={603} y={204} size={10}>Not proof of infection</Label>
    </g>
    <Label show={showLabels} x={25} y={446} size={11}>The muscle, bone, artery and nerve are separate teaching structures. Injury patterns vary.</Label>
  </>;
}

export default function TraumaDetailScene({ kind, time, variant, side = 'left', normal, compact, showLabels, selected, onSelect }: Props) {
  const state = traumaDetailState(kind, time, normal, variant);
  const hit = makeHit(TRAUMA_DETAIL_LESSONS[kind].structures, selected, onSelect, compact);
  const shared = { state, hit, showLabels };
  return <svg viewBox="0 0 790 465" role="group" aria-label={TRAUMA_DETAIL_LESSONS[kind].title}
    className="block h-auto w-full rounded-lg patho-scene" style={{ background: pv('bg') }} data-variant={variant} data-side={side}>
    {kind === 'head' && <Head {...shared} side={side}/>}
    {kind === 'pelvis' && <Pelvis {...shared}/>}
    {kind === 'openFracture' && <OpenFracture {...shared}/>}
  </svg>;
}
