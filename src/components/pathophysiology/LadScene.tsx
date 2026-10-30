import { STRUCTURES, cardiacState, ecgPattern, ECG_LAYOUT, asVariant, type StructureId } from '@/data/pathophysiology/ladOcclusion';
import { Label, Meter, makeHit, pv } from './sceneKit';
import { qAt, qd, sector, polar, type QPath } from './svgPath';

type Props = { time: number; normal?: boolean; showLabels: boolean; selected: StructureId | null; onSelect: (id: StructureId) => void; compact?: boolean; title?: string; variant?: string };

// Anterior (sternocostal) view, patient facing the viewer: patient's right = viewer's left.
const RA = 'M 150 170 Q 108 205 112 262 Q 118 318 162 338 Q 186 300 186 252 Q 186 196 150 170 Z';
const RV = 'M 186 190 Q 240 178 285 192 Q 300 262 318 332 Q 298 392 272 424 Q 222 386 166 338 Q 186 300 186 252 Z';
const LV = 'M 285 192 Q 342 178 372 212 Q 396 282 362 362 Q 332 422 276 442 Q 272 432 272 424 Q 298 392 318 332 Q 300 262 285 192 Z';
const LAA = 'M 300 186 Q 318 158 346 168 Q 342 188 318 196 Z';
const LAD_TERR = 'M 300 195 Q 335 188 360 215 Q 382 280 350 360 Q 322 412 276 440 Q 296 395 314 332 Q 298 262 300 195 Z';
const INFERIOR_BAND = 'M 166 340 Q 222 392 276 442 Q 262 452 246 446 Q 205 410 160 352 Z';

const LADP: QPath = { start: [305, 192], segs: [[[302, 262], [318, 332]], [[300, 392], [272, 426]]] };
const RCAP: QPath = { start: [206, 182], segs: [[[186, 188], [186, 232]], [[184, 300], [166, 338]]] };
const LAD_OCC = 0.14, RCA_OCC = 0.2; // fraction along path of the occlusion (proximal)

const SEGMENTS = [
  { id: 'anterior', a0: -120, a1: -60, art: 'lad' }, { id: 'anterolateral', a0: -60, a1: 0, art: 'lad', alt: 'lcx' },
  { id: 'inferolateral', a0: 0, a1: 60, art: 'lcx', alt: 'rca' }, { id: 'inferior', a0: 60, a1: 120, art: 'rca', alt: 'lcx' },
  { id: 'inferoseptal', a0: 120, a1: 180, art: 'rca', alt: 'lad' }, { id: 'anteroseptal', a0: 180, a1: 240, art: 'lad' },
] as const;
const ART_COLOR: Record<string, string> = { lad: 'fluid', rca: 'contents', lcx: 'lcx' };
const AT_RISK: Record<'lad' | 'rca', Record<string, number>> = {
  lad: { anterior: 1, anteroseptal: 1, anterolateral: 0.6 },
  rca: { inferior: 1, inferoseptal: 1, inferolateral: 0.5 },
};

export default function LadScene({ time, normal = false, showLabels, selected, onSelect, compact, title, variant = 'lad' }: Props) {
  const v = asVariant(variant);
  const s = cardiacState(v, time, normal);
  const hit = makeHit(STRUCTURES, selected, onSelect, compact);
  const sel = (id: StructureId) => selected === id;
  const pid = compact ? 'c' : 'm';
  const beat = Math.sin(time * 6);
  const squeeze = 1 + 0.02 * beat;
  const terrSqueeze = 1 + 0.02 * beat * s.contractility;
  const rvSqueeze = 1 + 0.02 * beat * (1 - 0.9 * s.rvIschemia);
  const dots = (n: number, sp: number) => Array.from({ length: n }, (_, i) => ((i / n) + time * 0.22 * sp) % 1);
  const ladFlow = v === 'lad' ? s.flow : 1, rcaFlow = v === 'rca' ? s.flow : 1;
  const ecg = ecgPattern(v);
  const SX = 645, SY = 165, RO = 72, RI = 42;
  const [p1x, p1y] = polar(SX, SY, RO, -125), [p2x, p2y] = polar(SX, SY, RO, 125);
  const rvCrescent = `M ${p1x} ${p1y} A 70 70 0 1 0 ${p2x} ${p2y} A ${RO} ${RO} 0 0 1 ${p1x} ${p1y} Z`;
  const injR = RI + (RO - RI) * s.injury;
  const occ = v === 'lad' ? qAt(LADP, LAD_OCC) : qAt(RCAP, RCA_OCC);
  const vStroke = (id: StructureId, w: number) => (sel(id) ? w + 3 : w);

  return (
    <svg viewBox="0 0 820 560" role="img" aria-label={title ?? `Illustrative anterior heart with coronary arteries, mid-ventricular short-axis territory map and 12-lead territory concept: ${v === 'lad' ? 'LAD' : 'RCA'} occlusion`} className="block h-auto w-full rounded-lg patho-scene" style={{ background: pv('bg') }}
      data-variant={v} data-flow={s.flow.toFixed(2)} data-injury={s.injury.toFixed(2)} data-contractility={s.contractility.toFixed(2)} data-rv={s.rvIschemia.toFixed(2)}>
      <defs>
        {(['lad', 'rca', 'lcx'] as const).map(a => <pattern key={a} id={`${pid}-hatch-${a}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="none" /><rect width="3" height="6" fill={pv(ART_COLOR[a], 0.55)} /></pattern>)}
      </defs>
      <text x="14" y="20" fontSize="11" fill={pv('ink', 0.75)}>Illustrative, anatomically informed drawing · anterior view, patient facing you (patient’s right = your left) · not an angiogram, echo or ECG</text>

      {/* Great vessels */}
      <g aria-hidden>
        <path d="M 165 40 L 167 178" stroke={pv('vein', 0.7)} strokeWidth="24" fill="none" strokeLinecap="round" />
        <path d="M 163 335 L 163 372" stroke={pv('vein', 0.5)} strokeWidth="20" fill="none" strokeDasharray="4 3" />
      </g>
      <g {...hit('aorta')}><path d="M 212 186 L 206 100 Q 210 52 262 48 Q 318 50 334 92" stroke={pv('vessel', 0.85)} strokeWidth={sel('aorta') ? 34 : 30} fill="none" strokeLinecap="round" /><path d="M 236 50 l -4 -22 M 262 47 l 0 -22 M 288 52 l 6 -20" stroke={pv('vessel', 0.7)} strokeWidth="7" aria-hidden /><Label show={showLabels} x={340} y={84}>Aorta</Label></g>
      <g {...hit('pulmonary')}><path d="M 258 192 Q 262 140 292 110 Q 316 96 348 102" stroke={pv('vein', 0.75)} strokeWidth={sel('pulmonary') ? 30 : 26} fill="none" strokeLinecap="round" /><Label show={showLabels} x={352} y={112}>Pulmonary trunk</Label></g>
      <Label show={showLabels} x={140} y={56} anchor="end">SVC</Label>

      {/* Chambers */}
      <g transform={`translate(250 300) scale(${squeeze}) translate(-250 -300)`}>
        <g {...hit('ra')}><path d={RA} fill={pv('wall', 0.4)} stroke={pv('ink', sel('ra') ? 1 : 0.35)} strokeWidth={sel('ra') ? 2.5 : 1} /><Label show={showLabels} x={104} y={250} anchor="end">RA</Label></g>
        <g {...hit('la')}><path d={LAA} fill={pv('wall', 0.45)} stroke={pv('ink', sel('la') ? 1 : 0.35)} strokeWidth={sel('la') ? 2.5 : 1} /><Label show={showLabels} x={352} y={162}>LA appendage</Label></g>
      </g>
      <g {...hit('rv')} transform={`translate(240 300) scale(${rvSqueeze}) translate(-240 -300)`}>
        <path d={RV} fill={pv('wall', 0.5)} stroke={pv('ink', sel('rv') ? 1 : 0.35)} strokeWidth={sel('rv') ? 2.5 : 1} />
        {s.rvIschemia > 0.01 && <path d={RV} fill={pv('membrane', 0.55 * s.rvIschemia)} />}
        <Label show={showLabels} x={228} y={300} anchor="middle">RV</Label>
      </g>
      <g {...hit('lv')} transform={`translate(330 320) scale(${squeeze}) translate(-330 -320)`}><path d={LV} fill={pv('wall', 0.62)} stroke={pv('ink', sel('lv') ? 1 : 0.35)} strokeWidth={sel('lv') ? 2.5 : 1} /><Label show={showLabels} x={400} y={300}>LV</Label></g>
      <g {...hit('territory')} transform={`translate(330 320) scale(${terrSqueeze}) translate(-330 -320)`}>
        <path d={LAD_TERR} fill={pv('membrane', v === 'lad' ? 0.6 * s.anteriorIschemia : 0)} stroke={pv('fluid', sel('territory') ? 1 : 0.45)} strokeWidth={sel('territory') ? 2.5 : 1.2} strokeDasharray="6 4" />
        {v === 'lad' && s.injury > 0.01 && <path d="M 312 262 Q 345 280 350 340 Q 335 392 300 414 Q 312 360 312 300 Z" fill={pv('inflame', 0.9)} opacity={Math.min(1, s.injury * 2)} />}
        <Label show={showLabels} x={392} y={392}>LAD territory (variable)</Label>
      </g>
      <g {...hit('inferior')}>
        <path d={INFERIOR_BAND} fill={pv('membrane', v === 'rca' ? 0.75 * s.inferiorIschemia : 0.08)} stroke={pv('contents', sel('inferior') ? 1 : 0.5)} strokeWidth={sel('inferior') ? 2.5 : 1} strokeDasharray="3 3" />
        {v === 'rca' && s.injury > 0.01 && <path d={INFERIOR_BAND} fill={pv('inflame', 0.85)} opacity={Math.min(1, s.injury * 1.6)} />}
        <Label show={showLabels} x={150} y={420} anchor="end">Inferior wall (under surface)</Label>
      </g>

      {/* Coronary arteries */}
      <g {...hit('circumflex')}><path d="M 305 192 Q 348 186 374 214" stroke={pv('lcx')} strokeWidth={vStroke('circumflex', 4)} fill="none" /><path d="M 374 214 Q 394 245 388 280" stroke={pv('lcx', 0.7)} strokeWidth={vStroke('circumflex', 3)} fill="none" strokeDasharray="5 4" /><Label show={showLabels} x={396} y={232}>Circumflex (wraps behind)</Label></g>
      <g {...hit('diagonal')}>{['M 304 250 Q 335 262 362 292', 'M 314 305 Q 340 325 356 355'].map(d => <path key={d} d={d} stroke={pv('fluid', 0.35 + 0.65 * ladFlow)} strokeWidth={vStroke('diagonal', 2.5)} fill="none" />)}<Label show={showLabels} x={366} y={282}>Diagonals</Label></g>
      <g {...hit('lad')}>
        <path d="M 226 178 Q 262 200 305 192" stroke={pv('fluid', 0.6)} strokeWidth="4" fill="none" strokeDasharray="4 3" />
        <path d={qd(LADP)} stroke={pv('fluid')} strokeWidth={vStroke('lad', 5)} fill="none" />
        <path d="M 272 426 Q 258 446 244 452" stroke={pv('fluid', 0.6)} strokeWidth="3" fill="none" strokeDasharray="4 3" />
        {dots(9, 1).map((f, i) => { const [x, y] = qAt(LADP, f); return <circle key={i} cx={x} cy={y} r={2.8} fill={pv('rbc', f > LAD_OCC ? ladFlow : 1)} />; })}
        <Label show={showLabels} x={238} y={226} anchor="end">LAD (anterior interventricular groove)</Label>
      </g>
      <g {...hit('acuteMarginal')}>{['M 185 268 Q 215 285 240 320', 'M 176 312 Q 206 338 226 368'].map(d => <path key={d} d={d} stroke={pv('contents', 0.35 + 0.65 * rcaFlow)} strokeWidth={vStroke('acuteMarginal', 2.5)} fill="none" />)}<Label show={showLabels} x={246} y={350}>RV branches</Label></g>
      <g {...hit('rca')}>
        <path d={qd(RCAP)} stroke={pv('contents')} strokeWidth={vStroke('rca', 5)} fill="none" />
        {dots(8, 1).map((f, i) => { const [x, y] = qAt(RCAP, f); return <circle key={i} cx={x} cy={y} r={2.8} fill={pv('rbc', f > RCA_OCC ? rcaFlow : 1)} />; })}
        <Label show={showLabels} x={104} y={204} anchor="end">RCA (right AV groove)</Label>
      </g>
      <g {...hit('pda')}><path d="M 166 338 Q 190 372 214 386 Q 246 414 268 438" stroke={pv('contents', 0.35 + 0.65 * rcaFlow)} strokeWidth={vStroke('pda', 3)} fill="none" strokeDasharray="5 4" /><Label show={showLabels} x={150} y={440} anchor="end">→ PDA (dashed: hidden inferior surface)</Label></g>
      <g {...hit('plaque')}>
        <circle cx={occ[0]} cy={occ[1]} r={9} fill={pv('panel', 0.01)} stroke={pv('ink', sel('plaque') ? 1 : 0.4)} strokeWidth={sel('plaque') ? 2.5 : 1} />
        {s.thrombus > 0.02 && <ellipse cx={occ[0]} cy={occ[1]} rx={3 + 5 * s.thrombus} ry={4 + 6 * s.thrombus} fill={pv('rbc', 0.95)} stroke={pv('ink', 0.6)} />}
        <Label show={showLabels} x={occ[0] + (v === 'lad' ? 14 : -14)} y={occ[1] - 10} anchor={v === 'lad' ? 'start' : 'end'}>Plaque / thrombus</Label>
      </g>

      {/* Short-axis territory map (echo convention: anterior up, septum left) */}
      <text x={SX} y={SY - RO - 22} fontSize="12" textAnchor="middle" fill={pv('ink', 0.9)}>Mid-ventricular short axis (viewed from apex)</text>
      <g {...hit('rv')}><path d={rvCrescent} fill={pv('wall', 0.4)} stroke={pv('ink', 0.35)} />{s.rvIschemia > 0.01 && <path d={rvCrescent} fill={pv('membrane', 0.6 * s.rvIschemia)} />}</g>
      <g {...hit('subendocardium')}>
        {SEGMENTS.map(seg => {
          const risk = normal ? 0 : (AT_RISK[v][seg.id] ?? 0);
          const isch = (v === 'lad' ? s.anteriorIschemia : s.inferiorIschemia) * risk;
          const d = sector(SX, SY, RI, RO, seg.a0, seg.a1);
          return <g key={seg.id}>
            <path d={d} fill={pv(ART_COLOR[seg.art], 0.4)} stroke={pv('bg')} strokeWidth="1.5" />
            {'alt' in seg && <path d={d} fill={`url(#${pid}-hatch-${seg.alt})`} />}
            {isch > 0.01 && <path d={d} fill={pv('membrane', 0.75 * isch)} />}
            {risk === 1 && s.injury > 0.01 && <path d={sector(SX, SY, RI, Math.min(RO, injR), seg.a0 + 3, seg.a1 - 3)} fill={pv('inflame', 0.92)} />}
          </g>;
        })}
        <circle cx={SX} cy={SY} r={RI - 1} fill={pv('bg')} />
      </g>
      <circle {...hit('lad')} cx={polar(SX, SY, RO + 2, -122)[0]} cy={polar(SX, SY, RO + 2, -122)[1]} r={5} fill={pv('fluid')} />
      <circle {...hit('pda')} cx={polar(SX, SY, RO + 2, 122)[0]} cy={polar(SX, SY, RO + 2, 122)[1]} r={5} fill={pv('contents')} />
      <Label show={showLabels} x={SX} y={SY - RO - 6} anchor="middle" size={10}>Anterior</Label>
      <Label show={showLabels} x={SX} y={SY + RO + 15} anchor="middle" size={10}>Inferior</Label>
      <Label show={showLabels} x={SX + RO + 6} y={SY + 4} size={10}>Lateral</Label>
      <Label show={showLabels} x={SX - RO - 50} y={SY + 4} anchor="middle" size={10}>RV</Label>
      <Label show={showLabels} x={SX - RI + 4} y={SY + 4} size={9}>Septum</Label>
      <Label show={showLabels} x={SX} y={SY + 4} anchor="middle" size={9}>LV cavity</Label>
      <g {...hit('dominance')} transform="translate(520 262)">
        {[['LAD', 'fluid'], ['RCA', 'contents'], ['LCx', 'lcx']].map(([n, c], i) => <g key={n} transform={`translate(${i * 70} 0)`}><rect width="12" height="12" fill={pv(c, 0.6)} /><text x="16" y="10" fontSize="10" fill={pv('ink', 0.85)}>{n}</text></g>)}
        <rect x="210" width="12" height="12" fill={`url(#${pid}-hatch-lcx)`} stroke={pv('ink', 0.3)} /><text x="226" y="10" fontSize="10" fill={pv('ink', 0.85)}>variable / dominance</text>
        <rect x="0" y="18" width="12" height="12" fill={pv('membrane', 0.8)} /><text x="16" y="28" fontSize="10" fill={pv('ink', 0.85)}>ischemic</text>
        <rect x="70" y="18" width="12" height="12" fill={pv('inflame')} /><text x="86" y="28" fontSize="10" fill={pv('ink', 0.85)}>irreversible injury (from subendocardium)</text>
      </g>

      {/* 12-lead territory concept */}
      <g {...hit('ecg')}>
        <rect x="450" y="300" width="360" height={v === 'rca' ? 190 : 160} rx="8" fill={pv('panel')} stroke={pv('ink', sel('ecg') ? 1 : 0.2)} strokeWidth={sel('ecg') ? 2.5 : 1} />
        <text x="462" y="318" fontSize="11" fill={pv('ink', 0.9)}>Lead-group concept · schematic complexes, not a tracing</text>
        {ECG_LAYOUT.flatMap((row, r) => row.map((lead, c) => {
          const x = 462 + c * 86, y = 352 + r * 42;
          const st = ecg.elevated.includes(lead) ? -10 * s.ecg : ecg.reciprocal.includes(lead) ? 5 * s.ecg : 0;
          const hl = st !== 0 && s.ecg > 0.2;
          return <g key={lead}><text x={x} y={y - 14} fontSize="9" fill={pv(hl ? 'alert' : 'ink', hl ? 1 : 0.65)}>{lead}</text><path d={`M ${x} ${y} h10 l3 3 l4 -20 l4 23 l3 ${-6 + st} h12 q 8 ${-10} 16 ${-st} h20`} fill="none" stroke={pv(hl ? 'alert' : 'ink', hl ? 1 : 0.6)} strokeWidth="1.6" /></g>;
        }))}
        {v === 'rca' && (() => { const x = 462, y = 478, st = -8 * s.rvIschemia, hl = s.rvIschemia > 0.2; return <g><text x={x} y={y - 14} fontSize="9" fill={pv(hl ? 'alert' : 'ink', 0.85)}>V4R (right-sided)</text><path d={`M ${x} ${y} h10 l3 3 l4 -20 l4 23 l3 ${-6 + st} h12 q 8 -10 16 ${-st} h20`} fill="none" stroke={pv(hl ? 'alert' : 'ink', 0.8)} strokeWidth="1.6" /><text x={x + 96} y={y - 2} fontSize="9" fill={pv('ink', 0.7)}>may change with RV involvement; often transient</text></g>; })()}
        <text x="462" y={v === 'rca' ? 502 : 452} fontSize="9" fill={pv('ink', 0.7)}>Highlighted leads face the territory; small downward offsets = reciprocal change</text>
      </g>

      {/* Energetics meters */}
      <g {...hit('myocyte')}>
        <rect x="14" y="478" width="420" height="72" rx="8" fill={pv('panel')} stroke={pv('ink', sel('myocyte') ? 1 : 0.2)} strokeWidth={sel('myocyte') ? 2.5 : 1} />
        <Meter x={26} y={502} w={120} label="ATP in territory (concept)" value={s.atp} color={pv('alert')} />
        <Meter x={164} y={502} w={120} label="Segment contraction" value={s.contractility} color={pv(v === 'lad' ? 'fluid' : 'contents')} />
        <Meter x={302} y={502} w={120} label="RV free-wall function" value={1 - 0.9 * s.rvIschemia} color={pv('wall')} />
        <Meter x={26} y={534} w={396} label="" value={s.injury} color={pv('inflame')} />
        <text x="26" y="530" fontSize="11" fill={pv('ink', 0.85)} aria-hidden>Irreversible injury extent (concept, never automatically transmural)</text>
      </g>
    </svg>
  );
}
