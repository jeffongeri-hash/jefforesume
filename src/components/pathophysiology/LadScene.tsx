import { STRUCTURES, sceneState, type StructureId } from '@/data/pathophysiology/ladOcclusion';
import { Label, Meter, makeHit, pv } from './sceneKit';

type Props = { time: number; normal?: boolean; showLabels: boolean; selected: StructureId | null; onSelect: (id: StructureId) => void; compact?: boolean; title?: string };

const LAD_PATH = 'M 250 120 Q 240 200 245 280 Q 252 350 285 410';
const OCC = { x: 246, y: 175 }; // proximal-mid occlusion site

export default function LadScene({ time, normal = false, showLabels, selected, onSelect, compact, title }: Props) {
  const s = sceneState(time, normal);
  const hit = makeHit(STRUCTURES, selected, onSelect, compact);
  const sel = (id: StructureId) => selected === id;
  const beat = Math.sin(time * 6);
  const squeeze = 1 + 0.025 * beat * 1; // whole heart
  const terrSqueeze = 1 + 0.025 * beat * s.contractility; // akinetic territory stops squeezing
  const flowDots = (path: 'lad' | 'other', n: number, speed: number) => Array.from({ length: n }, (_, i) => ((i / n) + time * 0.25 * speed) % 1);

  // Short-axis inset: ring with LAD sector (anterior/septal) showing wavefront from inner edge.
  const SX = 620, SY = 190, RO = 95, RI = 55;
  const arc = (r1: number, r2: number, a0: number, a1: number) => {
    const p = (r: number, a: number) => `${SX + r * Math.cos(a)} ${SY + r * Math.sin(a)}`;
    return `M ${p(r2, a0)} A ${r2} ${r2} 0 0 1 ${p(r2, a1)} L ${p(r1, a1)} A ${r1} ${r1} 0 0 0 ${p(r1, a0)} Z`;
  };
  const a0 = -Math.PI * 0.95, a1 = -Math.PI * 0.2; // anterior + septal sector (schematic)
  const injR = RI + (RO - RI) * s.injury / 0.7;

  return (
    <svg viewBox="0 0 800 500" role="img" aria-label={title ?? 'Conceptual anterior heart and short-axis schematic: LAD occlusion and myocardial territory'} className="block h-auto w-full rounded-lg patho-scene" style={{ background: pv('bg') }}
      data-flow={s.flow.toFixed(2)} data-injury={s.injury.toFixed(2)} data-contractility={s.contractility.toFixed(2)}>
      <text x="20" y="24" fontSize="11" fill={pv('ink', 0.7)}>Conceptual schematic · anterior view + short-axis slice · not an angiogram or ECG</text>

      <g transform={`translate(260 270) scale(${squeeze}) translate(-260 -270)`}>
        <path d="M 160 120 Q 110 220 170 350 Q 230 450 290 440 Q 380 400 390 270 Q 395 150 330 110 Q 250 80 160 120 Z" fill={pv('wall', 0.55)} stroke={pv('ink', 0.3)} aria-hidden />
      </g>
      {/* LAD territory overlay */}
      <g {...hit('territory')}>
        <g transform={`translate(260 290) scale(${terrSqueeze}) translate(-260 -290)`}>
          <path d="M 250 150 Q 300 160 340 230 Q 360 330 300 420 Q 270 440 245 420 Q 210 330 215 230 Q 220 170 250 150 Z" fill={s.ischemia > 0.02 ? pv('fluid', 0.15 + 0.35 * s.ischemia) : pv('wall', 0.1)} stroke={pv('fluid', sel('territory') ? 1 : 0.3 + 0.5 * s.ischemia)} strokeWidth={sel('territory') ? 3 : 1.5} strokeDasharray="6 4" />
          {s.injury > 0.01 && <path d="M 255 260 Q 300 280 310 350 Q 300 400 270 410 Q 250 360 248 300 Z" fill={pv('inflame', 0.25 + 0.9 * s.injury)} opacity={Math.min(1, s.injury * 2.2)} />}
        </g>
        <Label show={showLabels} x={355} y={395}>LAD territory (variable)</Label>
      </g>
      <g {...hit('aorta')}><path d="M 280 110 Q 280 60 330 40 L 360 40 Q 320 60 315 110 Z" fill={pv('vessel', 0.8)} /><Label show={showLabels} x={365} y={48}>Aorta</Label></g>
      <g {...hit('rca')}><path d="M 285 108 Q 200 130 165 230 Q 150 300 190 380" fill="none" stroke={pv('vessel')} strokeWidth={sel('rca') ? 7 : 4} /><Label show={showLabels} x={105} y={215} anchor="end">RCA</Label></g>
      <g {...hit('circumflex')}><path d="M 300 112 Q 370 120 395 200" fill="none" stroke={pv('vessel')} strokeWidth={sel('circumflex') ? 7 : 4} /><Label show={showLabels} x={400} y={150}>Circumflex</Label></g>
      <g {...hit('lad')}>
        <path d={`M 295 112 Q 260 110 250 120 ${LAD_PATH.slice(LAD_PATH.indexOf('Q'))}`} fill="none" stroke={pv('vessel')} strokeWidth={sel('lad') ? 8 : 5} id="lad-path" />
        {flowDots('lad', 8, 1).map((p, i) => { const distal = p > 0.25; const op = distal ? s.flow : 1; const y = 120 + p * 290; const x = 250 - 8 * Math.sin(p * 3) + (p > 0.6 ? (p - 0.6) * 90 : 0); return <circle key={i} cx={x} cy={y} r={3} fill={pv('rbc', op)} />; })}
        <Label show={showLabels} x={180} y={300} anchor="end">LAD</Label>
      </g>
      <g {...hit('diagonal')}><path d="M 247 230 Q 290 240 330 270" fill="none" stroke={pv('vessel', 0.4 + 0.6 * s.flow)} strokeWidth={sel('diagonal') ? 6 : 3} /><path d="M 246 300 Q 285 315 315 345" fill="none" stroke={pv('vessel', 0.4 + 0.6 * s.flow)} strokeWidth={sel('diagonal') ? 6 : 3} /><Label show={showLabels} x={340} y={270}>Diagonals</Label></g>
      <g {...hit('plaque')}>
        <ellipse cx={OCC.x + 4} cy={OCC.y} rx={9} ry={14} fill={pv('contents', 0.85)} stroke={pv('ink', sel('plaque') ? 1 : 0.3)} strokeWidth={sel('plaque') ? 2.5 : 1} />
        {s.thrombus > 0.02 && <ellipse cx={OCC.x} cy={OCC.y + 2} rx={4 + 6 * s.thrombus} ry={6 + 10 * s.thrombus} fill={pv('rbc', 0.9)} />}
        <Label show={showLabels} x={OCC.x - 16} y={OCC.y - 14} anchor="end">Plaque / thrombus</Label>
      </g>

      {/* Short-axis inset */}
      <text x={SX} y={SY - RO - 14} fontSize="12" fill={pv('ink', 0.85)} textAnchor="middle">Short-axis slice (concept)</text>
      <circle cx={SX} cy={SY} r={(RO + RI) / 2} fill="none" stroke={pv('wall', 0.55)} strokeWidth={RO - RI} aria-hidden />
      <g {...hit('subendocardium')}>
        <path d={arc(RI, RO, a0, a1)} fill={pv('fluid', 0.1 + 0.3 * s.ischemia)} stroke={pv('ink', sel('subendocardium') ? 1 : 0.2)} strokeWidth={sel('subendocardium') ? 2.5 : 1} />
        {s.injury > 0.01 && <path d={arc(RI, Math.min(RO, injR), a0 + 0.12, a1 - 0.12)} fill={pv('inflame', 0.9)} />}
        <Label show={showLabels} x={SX} y={SY + 4} anchor="middle" size={11}>LV cavity</Label>
        <Label show={showLabels} x={SX} y={SY + RO + 20} anchor="middle" size={11}>Injury begins subendocardially</Label>
      </g>

      {/* Energetics + ECG concept */}
      <g {...hit('myocyte')}>
        <rect x="490" y="330" width="290" height="70" rx="8" fill={pv('panel')} stroke={pv('ink', sel('myocyte') ? 1 : 0.2)} strokeWidth={sel('myocyte') ? 2.5 : 1} />
        <Meter x={505} y={355} w={120} label="ATP (concept)" value={s.atp} color={pv('alert')} />
        <Meter x={645} y={355} w={120} label="Contractility" value={s.contractility} color={pv('fluid')} />
        <Meter x={505} y={388} w={260} label="" value={s.injury / 0.7} color={pv('inflame')} />
        <text x="505" y="384" fontSize="11" fill={pv('ink', 0.85)} aria-hidden>Irreversible injury extent (concept)</text>
      </g>
      <g {...hit('ecg')}>
        <rect x="490" y="415" width="290" height="70" rx="8" fill={pv('panel')} stroke={pv('ink', sel('ecg') ? 1 : 0.2)} strokeWidth={sel('ecg') ? 2.5 : 1} />
        <text x="505" y="433" fontSize="11" fill={pv('ink', 0.85)}>ECG territory concept: anterior leads ~V1–V4</text>
        <path d={`M 505 465 l 30 0 l 6 -14 l 6 22 l 6 -8 ${`q 20 ${-22 * s.ecg} 40 ${-6 * s.ecg}`} q 15 -10 30 6 l 120 0`} fill="none" stroke={pv(s.ecg > 0.2 ? 'alert' : 'ink', 0.9)} strokeWidth="2" />
        <text x="770" y="478" fontSize="10" textAnchor="end" fill={pv('ink', 0.6)}>schematic, not a tracing</text>
      </g>
    </svg>
  );
}
