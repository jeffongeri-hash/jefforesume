import { useId } from 'react';
import { GU_LESSONS, guScenario, guState, type GuKind, type GuStructure } from '@/data/pathophysiology/genitourinary';
import FlowParticles from './FlowParticles';
import { Label, makeHit, Meter, pv } from './sceneKit';

type State = ReturnType<typeof guState>;
type Hit = ReturnType<typeof makeHit<GuStructure>>;
type Point = readonly [number, number];
type SceneProps = {
  kind: GuKind;
  variant?: string;
  time: number;
  normal?: boolean;
  compact?: boolean;
  showLabels: boolean;
  selected: GuStructure | null;
  onSelect: (id: GuStructure) => void;
};

const urine = pv('fluid');
const microbes = pv('alert');
const tissue = pv('serosa');
const artery = '#fb817b';
const vein = '#9aa8ff';

function Stream({ path, time, strength = 1, color }: { path: Point[]; time: number; strength?: number; color: string }) {
  const count = 8;
  return <g aria-hidden pointerEvents="none">
    {Array.from({ length: count }, (_, i) => {
      const travel = ((time * 0.44 + i / count) % 1) * (path.length - 1);
      const segment = Math.floor(travel);
      const fraction = travel - segment;
      const from = path[segment], to = path[segment + 1];
      return <circle key={i} cx={from[0] + (to[0] - from[0]) * fraction} cy={from[1] + (to[1] - from[1]) * fraction}
        r="3.6" fill={color} opacity={Math.max(0, Math.min(1, strength * count - i))}/>;
    })}
  </g>;
}

function Kidney({ transform, dilation = 0, inflammation = 0 }: { transform: string; dilation?: number; inflammation?: number }) {
  return <g transform={transform}>
    <path d="M-37-67C-10-76 16-54 19-35C21-19 3-9 7 6C11 21 24 23 19 44C14 68-12 77-35 61C-59 43-67 16-63-14C-60-41-52-60-37-67Z"
      fill={pv('serosa', .68)} stroke={tissue} strokeWidth="2"/>
    <path d="M-34-57C-10-62 8-47 9-33C10-21-4-13-4 3C-4 19 10 25 9 40C5 55-14 62-31 49C-50 34-55 12-52-12C-49-36-43-52-34-57Z"
      fill={pv('serosa', .26)} stroke={pv('ink', .28)} strokeWidth="1.3"/>
    <g fill={pv('ink', .16)}>
      <path d="M-39-39L-19-17L-52-13Z"/><path d="M-52-6L-21 4L-48 23Z"/><path d="M-43 28L-20 21L-28 49Z"/>
    </g>
    <g fill={artery} opacity={inflammation}>
      <path d="M-47-41Q-39-56-29-50L-16-26L-35-17Q-49-20-47-41Z"/>
      <path d="M-51 16L-30 9L-18 29Q-27 49-35 43Q-49 35-51 16Z" opacity=".66"/>
    </g>
    <path d="M8 7L-12 0L-22-22M-12 0L-36 1M-12 0L-23 25" fill="none" stroke={urine} strokeWidth={4 + 8 * dilation} strokeLinecap="round" strokeLinejoin="round"/>
    <ellipse cx="3" cy="5" rx={8 + 10 * dilation} ry={9 + 13 * dilation} fill={pv('fluid', .82)} />
    <g fill={microbes} opacity={inflammation}>
      <circle cx="-40" cy="-28" r="3"/><circle cx="-29" cy="26" r="3"/><circle cx="-12" cy="13" r="2.6"/>
    </g>
  </g>;
}

function SystemicInset({ state, showLabels, hit }: { state: State; showLabels: boolean; hit: Hit }) {
  const vesselHeight = 32 + 35 * state.systemic;
  return <g {...hit('vessels')}>
    <rect x="544" y="94" width="211" height="258" rx="18" fill={pv('panel')} stroke={pv('ink', .28)}/>
    <Label show={showLabels} x={559} y={120} size={13}>Systemic response inset</Label>
    <Label show={showLabels} x={559} y={141} size={11}>Separate from urinary drainage</Label>
    <FlowParticles from={[568, 162]} to={[730, 162]} time={state.time} strength={state.systemicSignaling} color={microbes} count={5}/>
    <rect x="560" y={205 - vesselHeight / 2} width="178" height={vesselHeight} rx="15" fill={pv('serosa', .22)} stroke={artery}/>
    <FlowParticles from={[569, 205]} to={[729, 205]} time={state.time} strength={1 - 0.55 * state.systemic} color={artery}/>
    {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={577 + i * 28}
      cy={229 + 37 * ((state.time * .4 + i / 6) % 1)} r="3.4" fill={urine} opacity={state.systemic}/>)}
    <Label show={showLabels} x={559} y={277} size={11}>{state.systemic > .08 ? 'Vasodilation + capillary leak' : state.systemicSignaling > .08 ? 'Endothelial activation' : 'Baseline vascular tone'}</Label>
    <Meter x={560} y={307} w={178} label="Effective perfusion · qualitative" value={1 - .67 * state.systemic} color={artery}/>
  </g>;
}

function UpperTract({ state, kind, hit, showLabels }: { state: State; kind: 'stones' | 'infection'; hit: Hit; showLabels: boolean }) {
  const ascending = kind === 'infection';
  const nephrostomy = state.nephrostomy;
  const leftUpstream: Point[] = [[385, 140], [359, 174], [348, 218], [329, 260], [303, 295]];
  const leftDownstream: Point[] = [[303, 295], [282, 308]];
  const rightUreter: Point[] = [[140, 140], [160, 175], [176, 219], [199, 267], [237, 308]];
  const pelvisInfection = state.id === 'infected' ? state.bacteria : 0;
  const spreading = state.onset * (1 - .86 * state.response);
  return <>
    <Label show={showLabels} x={107} y={63} size={13}>Patient right</Label>
    <Label show={showLabels} x={355} y={63} size={13}>Patient left</Label>
    <g {...hit('ureter')}>
      <path d="M140 140C171 169 162 235 197 264L237 308" fill="none" stroke={pv('fluid', .4)} strokeWidth="7" strokeLinecap="round"/>
      <path d="M385 140C349 169 357 235 329 260L303 295" fill="none" stroke={pv('fluid', .44)} strokeWidth={7 + 10 * state.dilation} strokeLinecap="round"/>
      <path d="M303 295L282 308" fill="none" stroke={pv('fluid', .4)} strokeWidth="7" strokeLinecap="round"/>
      <Stream path={rightUreter} time={state.time} color={urine}/>
      <Stream path={leftUpstream} time={state.time} strength={1 - .72 * state.blocked} color={urine}/>
      <Stream path={leftDownstream} time={state.time} strength={1 - state.blocked} color={urine}/>
      {ascending && <Stream path={[[260, 325], ...leftDownstream.slice().reverse(), ...leftUpstream.slice(0, -1).reverse()]} time={state.time}
        color={microbes} strength={spreading}/>}
      {kind === 'stones' && <path d="M-8-3L-3-8L6-7L10 0L4 8L-5 7Z" transform={`translate(${303 - (state.id === 'stone' ? state.response * 46 : 0)} ${295 + (state.id === 'stone' ? state.response * 38 : 0)})`}
        fill={microbes} stroke={pv('bg')} strokeWidth="2" opacity={state.onset}/>}
      <Label show={showLabels} x={352} y={236} size={13}>Left ureter</Label>
      {state.blocked > .06 && <Label show={showLabels} x={330} y={289} size={12}>Distal stone</Label>}
    </g>
    <g {...hit('kidney')}>
      <Kidney transform="translate(132 135)"/>
      <Kidney transform="translate(393 135) scale(-1 1)" dilation={state.dilation} inflammation={ascending ? state.bacteria : 0}/>
      <Label show={showLabels} x={45} y={223} size={12}>Right kidney</Label>
      <Label show={showLabels} x={366} y={213} size={12}>{ascending && state.bacteria > .08 ? 'Inflamed parenchyma' : 'Left collecting system'}</Label>
      <g fill={microbes} opacity={pelvisInfection} pointerEvents="none">
        {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={391 + 14 * Math.sin(i * 2 + state.time)} cy={139 + 18 * Math.cos(i * 2 + state.time)} r="3.4"/>)}
      </g>
      {state.id === 'infected' && <g opacity={nephrostomy}>
        <path d="M391 141C442 150 449 123 487 123H511V177" fill="none" stroke={pv('ink', .9)} strokeWidth="5"/>
        <rect x="493" y="176" width="37" height="46" rx="7" fill={pv('fluid', .25)} stroke={urine}/>
        <Stream path={[[392, 142], [440, 143], [488, 123], [511, 123], [511, 210]]} time={state.time} color={urine} strength={nephrostomy}/>
        <Label show={showLabels} x={486} y={249} size={12} anchor="middle">Nephrostomy</Label>
      </g>}
    </g>
    <g {...hit('bladder')}>
      <path d="M222 303Q258 281 298 303C315 317 305 348 260 355C215 347 206 316 222 303Z"
        fill={pv('fluid', .2)} stroke={tissue} strokeWidth="2"/>
      <circle cx="237" cy="308" r="4" fill={urine}/><circle cx="282" cy="308" r="4" fill={urine}/>
      <Label show={showLabels} x={260} y={333} anchor="middle" size={13}>Bladder</Label>
    </g>
    <g {...hit('outlet')}>
      <path d="M260 355V390" stroke={pv('fluid', .55)} strokeWidth="8" strokeLinecap="round"/>
      <Label show={showLabels} x={275} y={380} size={12}>Urethra</Label>
    </g>
    {ascending && <SystemicInset state={state} showLabels={showLabels} hit={hit}/>}
    {!ascending && <g aria-hidden>
      <rect x="548" y="243" width="202" height="125" rx="14" fill={pv('panel')} stroke={pv('ink', .28)}/>
      <circle cx="566" cy="264" r="4" fill={urine}/>
      <Label show={showLabels} x={578} y={268} size={13}>Urine movement</Label>
      <Meter x={565} y={297} w={167} label={showLabels ? 'Collecting-system dilation' : ''} value={state.dilation} color={urine}/>
      <circle cx="566" cy="328" r="4" fill={microbes}/>
      <Label show={showLabels} x={578} y={332} size={12}>{state.id === 'infected' ? 'Calculus / trapped bacteria' : 'Calculus'}</Label>
      {state.id === 'infected' && state.complication > .05 && <Label show={showLabels} x={565} y={352} size={11}>
        {nephrostomy > .1 ? 'New drainage path opens' : 'Undrained source can drive sepsis'}
      </Label>}
    </g>}
  </>;
}

function Bladder({ state, hit, showLabels }: { state: State; hit: Hit; showLabels: boolean }) {
  const lumen = useId();
  const effort = .5 + .5 * Math.sin(state.time * 3);
  const isContracting = .25 + .75 * state.impact;
  const contraction = state.detrusor * effort * isContracting * (1 - state.response);
  const volume = state.bladderVolume;
  const rx = 90 + 36 * volume - 7 * contraction;
  const ry = 67 + 40 * volume - 6 * contraction;
  const surface = 213 + (1 - 2 * volume) * ry;
  const orificeY = 213 + ry * .59;
  const lumenFlow = (1 - .92 * state.outletNarrowing) * state.detrusor * (1 - state.response);
  const width = 15 - 12 * state.outletNarrowing;
  return <>
    <g {...hit('bladder')}>
      <path d={`M164 86Q174 200 260 ${orificeY}M456 86Q446 200 360 ${orificeY}`}
        fill="none" stroke={pv('fluid', .45)} strokeWidth="7" strokeLinecap="round"/>
      <ellipse cx="310" cy="213" rx={rx} ry={ry} fill={pv('panel')} stroke={tissue} strokeWidth={8 + 3 * contraction}/>
      <defs><clipPath id={lumen}><ellipse cx="310" cy="213" rx={rx - 4} ry={ry - 4}/></clipPath></defs>
      <path d={`M${310 - rx} ${surface}Q310 ${surface + 5} ${310 + rx} ${surface}V330H${310 - rx}Z`}
        fill={pv('fluid', .42)} clipPath={`url(#${lumen})`}/>
      <path d={`M260 ${orificeY}L310 ${213 + ry * .86}L360 ${orificeY}Z`}
        fill="none" stroke={pv('ink', .36)} strokeWidth="1.5" strokeDasharray="5 4"/>
      <circle cx="260" cy={orificeY} r="4" fill={urine}/><circle cx="360" cy={orificeY} r="4" fill={urine}/>
      <Label show={showLabels} x={126} y={orificeY + 6} size={12}>Ureteral orifices</Label>
      <path d={`M${275 - rx} 212h24m-8-7 8 7-8 7 M${345 + rx} 212h-24m8-7-8 7 8 7`} fill="none" stroke={tissue} strokeWidth="3" opacity={contraction}/>
      <Label show={showLabels} x={310} y={201} anchor="middle" size={16}>Detrusor and bladder lumen</Label>
    </g>
    <g {...hit('outlet')}>
      <path d={`M310 ${209 + ry}V388`} fill="none" stroke={pv('ink', .42)} strokeWidth="23" strokeLinecap="round"/>
      <path d={`M310 ${209 + ry}V388`} fill="none" stroke={pv('fluid', .7)} strokeWidth={width} strokeLinecap="round"/>
      <FlowParticles from={[310, 213 + ry]} to={[310, 393]} time={state.time} strength={lumenFlow} color={urine}/>
      <Label show={showLabels} x={335} y={348} size={13}>{state.outletNarrowing > .08 ? 'Narrowed outlet' : 'Open outlet'}</Label>
      {state.response > 0 && <g opacity={state.response}>
        <path d={`M310 238V390Q310 403 330 403H417`} fill="none" stroke={pv('ink')} strokeWidth="4"/>
        <path d="M296 253Q310 243 324 253Q310 263 296 253Z" fill={pv('ink', .42)} stroke={pv('ink')}/>
        <Stream path={[[310, 239], [310, 389], [327, 403], [417, 403]]} time={state.time} strength={1 - .65 * state.response} color={urine}/>
        <Label show={showLabels} x={350} y={389} size={12}>Catheter drainage</Label>
      </g>}
    </g>
    <g aria-hidden>
      <rect x="503" y="122" width="245" height="161" rx="16" fill={pv('panel')} stroke={pv('ink', .28)}/>
      <Label show={showLabels} x={520} y={146} size={13}>Emptying mechanics · qualitative</Label>
      <Meter x={521} y={179} w={207} label="Bladder filling" value={volume} color={urine}/>
      <Meter x={521} y={216} w={207} label="Detrusor contraction capacity" value={state.detrusor} color={tissue}/>
      <Meter x={521} y={253} w={207} label="Pressure against a narrowed outlet" value={state.pressure} color={microbes}/>
    </g>
  </>;
}

function Scrotum({ state, hit, showLabels }: { state: State; hit: Hit; showLabels: boolean }) {
  const fluid = state.hydrocele;
  const lift = 23 * state.twist;
  const cy = 291 - lift;
  const veinSpread = 18 + 29 * state.venousDilation;
  const twistSpread = 15 * state.twist;
  const arterialPath = `M281 78C${281 + twistSpread} 111 ${281 - twistSpread} 124 281 148S${281 + twistSpread} 174 281 189L280 ${cy - 54}`;
  const tractPath: Point[] = [[393, 84], [383, 125], [367, 176], [350, 236], [340, 282]];
  const arterialRoute: Point[] = [[281, 79], [281 + twistSpread * .32, 119], [281 - twistSpread * .28, 154], [281 + twistSpread * .25, 188], [280, cy - 54]];
  const venousRoute: Point[] = [[320, cy - 48], [314 + veinSpread * .5, 193], [314 - veinSpread * .3, 152], [314, 110], [314, 80]];
  return <>
    <Label show={showLabels} x={34} y={62} size={14}>Patient left hemiscrotum · anterior schematic</Label>
    <path d="M223 150C193 181 165 224 168 287C169 365 223 399 283 397C363 396 413 357 412 286C409 222 368 184 343 150"
      fill={pv('serosa', .12)} stroke={pv('serosa', .8)} strokeWidth="2"/>
    <g {...hit('tunica')}>
      <ellipse cx="284" cy={cy + 2} rx={62 + 43 * fluid} ry={72 + 24 * fluid}
        fill={pv('fluid', .07 + .46 * fluid)} stroke={pv('fluid', .65)} strokeWidth="2"/>
      {state.id === 'communicating' && <g opacity={state.patentTract}>
        <path d="M380 84H412M393 84Q392 146 367 176L340 282" fill="none" stroke={pv('fluid', .66)} strokeWidth="7" strokeLinecap="round"/>
        <Stream path={state.response > 0 ? tractPath.slice().reverse() : tractPath} time={state.time}
          strength={state.response > 0 ? state.response : state.impact} color={urine}/>
        <Label show={showLabels} x={405} y={110} size={12}>Patent processus vaginalis</Label>
      </g>}
      <Label show={showLabels} x={157} y={379} size={12}>{fluid > .08 ? 'Fluid within tunica vaginalis' : 'Tunica vaginalis'}</Label>
    </g>
    <g {...hit('testis')}>
      <ellipse cx="284" cy={cy} rx={49 + 5 * (1 - state.venousOutflow)} ry="60"
        transform={`rotate(${-29 * state.twist} 284 ${cy})`} fill={tissue} stroke={pv('ink', .74)} strokeWidth="2"/>
      <path d={`M316 ${cy - 49}Q344 ${cy - 30} 332 ${cy + 17}Q328 ${cy + 36} 315 ${cy + 50}`}
        fill="none" stroke={pv('serosa', .9)} strokeWidth="10" strokeLinecap="round" transform={`rotate(${-29 * state.twist} 284 ${cy})`}/>
      <ellipse cx="284" cy={cy} rx="44" ry="55" fill="#654365" opacity={Math.max(state.ischemicInjury * .94, (1 - state.venousOutflow) * .63)}/>
      <Label show={showLabels} x={283} y={cy + 4} anchor="middle" size={14}>Testis</Label>
      <Label show={showLabels} x={348} y={cy + 42} size={12}>Epididymis</Label>
    </g>
    <g {...hit('cord')}>
      <path d="M262 74Q258 135 265 194L267 236M331 74Q342 129 331 201L326 236" stroke={pv('serosa', .4)} strokeWidth="2" fill="none"/>
      <path d={arterialPath} fill="none" stroke={artery} strokeWidth={5 - 2.6 * state.twist} strokeLinecap="round"/>
      <Stream path={arterialRoute} time={state.time} strength={state.arterialInflow} color={artery}/>
      {state.twist > .02 && <path d="M273 131C258 149 294 168 298 148S275 133 269 156S294 180 301 162" fill="none" stroke={microbes} strokeWidth="3.5" opacity={state.twist}/>}
      <Label show={showLabels} x={135} y={132} size={13}>{state.twist > .08 ? 'Twisted spermatic cord' : 'Spermatic cord'}</Label>
    </g>
    <g {...hit('plexus')}>
      {[0, 1, 2].map(index => <path key={index} d={`M${315 + index * 3} 80C${329 + veinSpread} 110 ${312 - veinSpread} 130 ${314 + index * 5} 148S${324 + veinSpread + index * 6} 182 ${311 + veinSpread * .31 + index * 6} ${cy - 45}`}
        fill="none" stroke={vein} strokeWidth={2.6 + state.venousDilation * 2.2} opacity={.73 + index * .09} strokeLinecap="round"/>)}
      <Stream path={venousRoute} time={state.time} strength={state.venousOutflow * (1 - state.reflux)} color={vein}/>
      {state.reflux > 0 && <Stream path={venousRoute.slice().reverse()} time={state.time} strength={state.reflux} color={vein}/>}
      <Label show={showLabels} x={377} y={200} size={12}>Pampiniform plexus</Label>
      {state.id === 'varicocele' && <g>
        <rect x="518" y="60" width="231" height="73" rx="13" fill={pv('panel')} stroke={pv('ink', .28)}/>
        <path d="M538 85H573M557 85V118" stroke={vein} fill="none" strokeWidth="4" strokeLinecap="round"/>
        <path d={state.reflux > .05 ? 'M552 104L557 110L562 104' : 'M552 106L557 100L562 106'} fill="none" stroke={vein} strokeWidth="2"/>
        <Label show={showLabels} x={584} y={89} size={11}>Left renal vein</Label>
        <Label show={showLabels} x={584} y={114} size={11}>Left testicular vein</Label>
      </g>}
    </g>
    <g aria-hidden>
      <rect x="518" y="151" width="231" height="160" rx="16" fill={pv('panel')} stroke={pv('ink', .28)}/>
      <Label show={showLabels} x={534} y={175} size={13}>Flow and fluid · qualitative</Label>
      <Meter x={535} y={211} w={194} label="Arterial inflow toward testis" value={state.arterialInflow} color={artery}/>
      <Meter x={535} y={250} w={194} label={state.reflux > .05 ? 'Venous reflux toward testis' : 'Venous drainage away from testis'} value={state.reflux > .05 ? state.reflux : state.venousOutflow} color={vein}/>
      <Meter x={535} y={288} w={194} label="Fluid around the testis" value={fluid} color={urine}/>
    </g>
  </>;
}

export default function GenitourinaryScene({ kind, variant = '', time, normal, compact, showLabels, selected, onSelect }: SceneProps) {
  const state = guState(kind, variant, time, normal);
  const lesson = GU_LESSONS[kind];
  const hit = makeHit(lesson.structures as Parameters<typeof makeHit<GuStructure>>[0], selected, onSelect, compact);
  const panels = { hit, showLabels, state };
  const caption = normal ? lesson.normal : guScenario(kind, variant).label;
  return <svg role="group" aria-label={caption} viewBox="0 0 780 428" data-gu-scene={kind}
    className="block h-auto w-full rounded-lg patho-scene" style={{ background: pv('bg') }}>
    <Label show={showLabels} x={30} y={29} size={15}>{caption}</Label>
    {kind === 'scrotum' && <Scrotum {...panels}/>}
    {kind === 'retention' && <Bladder {...panels}/>}
    {(kind === 'stones' || kind === 'infection') && <UpperTract {...panels} kind={kind}/>}
    <Label show={showLabels} x={24} y={414} size={11}>Conceptual anatomy · phase timing and signals are qualitative</Label>
  </svg>;
}
