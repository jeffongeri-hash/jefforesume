import { STRUCTURES, sceneState, type StructureId } from '@/data/pathophysiology/mcaStroke';
import { Label, makeHit, pv } from './sceneKit';

type Props = { time: number; normal?: boolean; showLabels: boolean; selected: StructureId | null; onSelect: (id: StructureId) => void; compact?: boolean; title?: string };

const C = { x: 290, y: 250 }; // lesion centre in lateral hemisphere

export default function McaStrokeScene({ time, normal = false, showLabels, selected, onSelect, compact, title }: Props) {
  const s = sceneState(time, normal);
  const hit = makeHit(STRUCTURES, selected, onSelect, compact);
  const sel = (id: StructureId) => selected === id;
  const branches = ['M 230 300 Q 260 220 250 150', 'M 230 300 Q 300 230 330 160', 'M 230 300 Q 330 270 400 230', 'M 230 300 Q 320 320 390 330'];
  const coreR = 10 + 70 * s.core, penR = coreR + 75 * s.penumbra * (1 - 0.6 * s.core / 0.6 * 0.5);
  const ripple = 1 + 0.03 * Math.sin(time * 2.5);
  const dot = (i: number, n: number, sp: number) => ((i / n) + time * 0.2 * sp) % 1;

  // Conceptual imaging tiles
  const tile = (x: number, name: string, body: JSX.Element, note: string) => <g transform={`translate(${x} 395)`}>
    <rect width="150" height="95" rx="8" fill={pv('panel')} stroke={pv('ink', sel('imaging') ? 1 : 0.2)} strokeWidth={sel('imaging') ? 2.5 : 1} />
    <text x="8" y="15" fontSize="11" fontWeight="700" fill={pv('ink')}>{name}</text>
    <ellipse cx="75" cy="52" rx="42" ry="30" fill={pv('membrane', 0.18)} stroke={pv('ink', 0.3)} />
    {body}
    <text x="8" y="88" fontSize="9" fill={pv('ink', 0.7)}>{note}</text>
  </g>;
  const k = 0.35; // tile scale for lesion

  return (
    <svg viewBox="0 0 800 500" role="img" aria-label={title ?? 'Conceptual lateral brain schematic: MCA occlusion, collaterals, ischemic core and penumbra, with conceptual imaging panel'} className="block h-auto w-full rounded-lg patho-scene" style={{ background: pv('bg') }}
      data-core={s.core.toFixed(2)} data-penumbra={s.penumbra.toFixed(2)} data-collateral={s.collateral.toFixed(2)} data-flow={s.flow.toFixed(2)}>
      <text x="20" y="24" fontSize="11" fill={pv('ink', 0.7)}>Conceptual lateral-hemisphere schematic · not a scan · not patient data</text>
      <path d="M 90 260 Q 90 110 260 80 Q 470 60 540 200 Q 570 300 480 350 Q 380 390 250 370 Q 120 360 90 260 Z" fill={pv('membrane', 0.2)} stroke={pv('ink', 0.35)} aria-hidden />
      <text x="110" y="70" fontSize="11" fill={pv('ink', 0.6)}>Frontal</text><text x="540" y="180" fontSize="11" fill={pv('ink', 0.6)}>Occipital</text>

      <g {...hit('oligemia')}><circle cx={C.x} cy={C.y} r={(penR + 40 * s.oligemia) * ripple} fill={pv('fluid', 0.12 * s.oligemia)} stroke={pv('fluid', 0.4 * s.oligemia)} strokeDasharray="4 4" />{s.oligemia > 0.3 && <Label show={showLabels} x={C.x + penR + 20} y={C.y - penR - 10}>Benign oligaemia</Label>}</g>
      <g {...hit('penumbra')}><circle cx={C.x} cy={C.y} r={penR * ripple} fill={pv('alert', 0.45 * s.penumbra)} stroke={pv('alert', sel('penumbra') ? 1 : 0.6 * s.penumbra)} strokeWidth={sel('penumbra') ? 3 : 1.5} />{s.penumbra > 0.3 && <Label show={showLabels} x={C.x} y={C.y - penR + 16} anchor="middle">Penumbra</Label>}</g>
      <g {...hit('core')}>{s.core > 0.01 && <circle cx={C.x} cy={C.y} r={coreR} fill={pv('inflame', 0.9)} stroke={pv('ink', sel('core') ? 1 : 0.3)} strokeWidth={sel('core') ? 3 : 1} />}{s.core > 0.05 && <Label show={showLabels} x={C.x} y={C.y + 4} anchor="middle">Core</Label>}</g>

      <g {...hit('ica')}><path d="M 200 470 Q 210 380 230 300" fill="none" stroke={pv('vessel')} strokeWidth={sel('ica') ? 10 : 7} /><Label show={showLabels} x={215} y={385} anchor="end">ICA</Label></g>
      <g {...hit('aca')}><path d="M 230 300 Q 160 220 170 110" fill="none" stroke={pv('vessel', 0.85)} strokeWidth={sel('aca') ? 7 : 4} /><Label show={showLabels} x={150} y={150} anchor="end">ACA</Label></g>
      <g {...hit('pca')}><path d="M 260 380 Q 400 380 500 280" fill="none" stroke={pv('vessel', 0.85)} strokeWidth={sel('pca') ? 7 : 4} /><Label show={showLabels} x={470} y={355}>PCA</Label></g>
      <g {...hit('mca')}>
        {branches.map((d, i) => <path key={i} d={d} fill="none" stroke={pv('vessel', 0.25 + 0.75 * s.flow)} strokeWidth={sel('mca') ? 6 : 3.5} />)}
        {Array.from({ length: 4 }, (_, b) => Array.from({ length: 4 }, (_, i) => { const p = dot(i, 4, 1); const ends = [[250, 150], [330, 160], [400, 230], [390, 330]][b]; return <circle key={`${b}-${i}`} cx={230 + (ends[0] - 230) * p} cy={300 + (ends[1] - 300) * p} r={2.6} fill={pv('rbc', s.flow)} />; }))}
        <Label show={showLabels} x={410} y={225}>MCA branches</Label>
      </g>
      <g {...hit('collaterals')}>
        {[['M 175 140 Q 215 140 250 155', 0], ['M 180 120 Q 270 110 330 160', 1], ['M 480 290 Q 440 250 400 232', 2], ['M 470 305 Q 430 330 392 330', 3]].map(([d, i]) => <path key={i as number} d={d as string} fill="none" stroke={pv('fluid', 0.25 + 0.75 * s.collateral)} strokeWidth={sel('collaterals') ? 4 : 1.5 + 2 * s.collateral} strokeDasharray="3 4" strokeDashoffset={-time * 12 * s.collateral} />)}
        <Label show={showLabels} x={340} y={105}>Leptomeningeal collaterals</Label>
      </g>
      <g {...hit('clot')}>
        <ellipse cx={236} cy={296} rx={4 + 7 * s.clot} ry={4 + 5 * s.clot} fill={pv('contents', 0.25 + 0.75 * s.clot)} stroke={pv('ink', sel('clot') ? 1 : 0.3)} strokeWidth={sel('clot') ? 2.5 : 1} />
        {s.clot > 0.2 && <Label show={showLabels} x={250} y={318}>Occlusion (M1)</Label>}
      </g>

      {/* Conceptual imaging comparison */}
      <g {...hit('imaging')}>
        <text x="610" y="385" fontSize="11" fill={pv('ink', 0.85)} textAnchor="end">Imaging concept — icons, not scans</text>
        {tile(140, 'NCCT', s.core > 0.3 ? <ellipse cx={75 + 8} cy={50} rx={coreR * k * 0.6} ry={coreR * k * 0.5} fill={pv('ink', 0.18)} /> : <></>, 'Often subtle early; excludes bleed')}
        {tile(300, 'CTA', <><path d="M 50 70 Q 60 55 75 52 L 110 40" fill="none" stroke={pv('vessel')} strokeWidth="2.5" strokeDasharray={s.clot > 0.5 ? '40 200' : undefined} />{s.clot > 0.5 && <circle cx={73} cy={53} r={4} fill={pv('contents')} />}</>, 'Locates occlusion; not core size')}
        {tile(460, 'CT perfusion', <>{s.penumbra > 0.05 && <ellipse cx={85} cy={50} rx={penR * k} ry={penR * k * 0.8} fill={pv('alert', 0.55)} />}{s.core > 0.02 && <ellipse cx={85} cy={50} rx={coreR * k} ry={coreR * k * 0.8} fill={pv('inflame', 0.9)} />}</>, 'Estimate; timing & software vary')}
      </g>
    </svg>
  );
}
