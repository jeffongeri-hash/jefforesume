import type { ReactNode } from 'react';
import { STRUCTURES, sceneState, asStroke, type StructureId, type StrokeVariant } from '@/data/pathophysiology/mcaStroke';
import { makeHit, pv } from './sceneKit';
import { qAt, qd, type QPath } from './svgPath';

type Props = { time: number; normal?: boolean; showLabels: boolean; selected: StructureId | null; onSelect: (id: StructureId) => void; compact?: boolean; title?: string; variant?: string; side?: 'left' | 'right' };

// All geometry is authored in a "frame" where the frontal pole points LEFT (box x 20–400).
// The lateral and medial views are then placed and mirrored so orientation is anatomically true for the chosen hemisphere.
const OUT = 'M 60 200 Q 48 112 138 72 Q 230 34 320 58 Q 392 84 396 160 Q 400 214 368 242 Q 332 262 296 254 Q 262 288 206 284 Q 152 280 124 256 Q 70 246 60 200 Z';
const LOBES = {
  frontal: 'M 0 0 L 240 0 L 240 46 Q 228 110 208 200 L 128 228 L 0 262 Z',
  parietal: 'M 240 0 L 352 0 L 352 70 Q 345 170 340 238 L 286 168 L 208 200 Q 228 110 240 46 Z',
  temporal: 'M 0 262 L 128 228 Q 200 214 286 168 L 340 238 L 340 420 L 0 420 Z',
  occipital: 'M 352 0 L 420 0 L 420 420 L 340 420 L 340 238 Q 345 170 352 70 Z',
} as const;
const ACA_L = 'M 66 160 Q 64 104 138 72 Q 230 34 320 58 Q 340 64 352 72 L 344 92 Q 300 78 232 66 Q 150 82 104 116 Q 86 136 84 162 Z';
const PCA_L = 'M 352 72 Q 394 90 396 160 Q 400 214 368 242 Q 332 262 296 254 Q 270 270 226 276 L 228 262 Q 290 246 332 212 Q 344 150 340 92 Z';
const ACA_M = 'M 60 200 Q 48 112 138 72 Q 230 34 320 58 L 335 64 Q 318 120 300 170 L 286 160 Q 260 142 210 144 Q 150 146 140 172 Q 120 200 110 225 Q 80 225 60 200 Z';
const PCA_M = 'M 335 64 Q 392 84 396 160 Q 400 214 368 242 Q 332 262 296 254 L 250 236 L 232 198 L 286 160 L 300 170 Q 318 120 335 64 Z';
const CALLOSUM = 'M 120 170 Q 130 132 210 128 Q 290 128 312 160 Q 300 172 286 160 Q 260 142 210 144 Q 150 146 140 172 Z';
const POST_FOSSA = 'M 238 196 L 262 196 L 272 340 L 244 340 Z M 270 278 a 52 30 0 1 0 104 0 a 52 30 0 1 0 -104 0 Z';

const MCA_BR: QPath[] = [
  { start: [150, 232], segs: [[[188, 180], [224, 120]]] }, { start: [152, 230], segs: [[[230, 168], [282, 110]]] },
  { start: [154, 230], segs: [[[250, 200], [322, 190]]] }, { start: [154, 232], segs: [[[250, 238], [312, 242]]] },
];
const ACA_P: QPath = { start: [124, 232], segs: [[[98, 182], [126, 150]], [[160, 116], [232, 114]], [[292, 116], [322, 140]]] };
const PCA_P: QPath = { start: [236, 210], segs: [[[280, 218], [322, 206]], [[360, 196], [390, 174]]] };
const BAS_P: QPath = { start: [238, 372], segs: [[[230, 300], [234, 212]]] };
const OCC: Record<StrokeVariant, { view: 'lat' | 'med'; at: [number, number]; lesion: [number, number]; scale: number }> = {
  mca: { view: 'lat', at: [150, 238], lesion: [232, 180], scale: 1 },
  aca: { view: 'med', at: [104, 196], lesion: [196, 98], scale: 0.8 },
  pca: { view: 'med', at: [270, 216], lesion: [352, 182], scale: 0.8 },
  basilar: { view: 'med', at: [232, 270], lesion: [256, 262], scale: 0.6 },
};
const COLOR = { mca: 'fluid', aca: 'lcx', pca: 'contents', post: 'serosa' } as const;

export default function McaStrokeScene({ time, normal = false, showLabels, selected, onSelect, compact, title, variant = 'mca', side = 'left' }: Props) {
  const v = asStroke(variant);
  const s = sceneState(time, normal);
  const hit = makeHit(STRUCTURES, selected, onSelect, compact);
  const sel = (id: StructureId) => selected === id;
  const pid = `${compact ? 'c' : 'm'}-${v}`;
  const latMirror = side === 'right', medMirror = side === 'left';
  const view = { lat: { off: 0, m: latMirror }, med: { off: 410, m: medMirror } };
  const tf = (k: 'lat' | 'med') => `translate(${view[k].off} 0)${view[k].m ? ' translate(420 0) scale(-1 1)' : ''}`;
  const X = (k: 'lat' | 'med', x: number) => view[k].off + (view[k].m ? 420 - x : x);
  const L = (k: 'lat' | 'med', x: number, y: number, text: string, anchor: 'start' | 'end' | 'middle' = 'middle', size = 11) => {
    if (!showLabels) return null;
    const a = anchor === 'middle' ? 'middle' : (view[k].m ? (anchor === 'start' ? 'end' : 'start') : anchor);
    return <text x={X(k, x)} y={y} textAnchor={a} fontSize={size} fill={pv('ink')} className="pointer-events-none" style={{ paintOrder: 'stroke', stroke: pv('bg', 0.85), strokeWidth: 3 }}>{text}</text>;
  };
  const occ = OCC[v];
  const r = occ.scale;
  const coreR = (8 + 42 * s.core) * r, penR = coreR + 55 * s.penumbra * (1 - 0.6 * s.core) * r;
  const dot = (i: number, n: number) => ((i / n) + time * 0.2) % 1;
  const active = (t: StrokeVariant | 'post') => (v === t || (v === 'basilar' && (t === 'post' || t === 'pca')));
  const terrFill = (t: StrokeVariant | 'post') => pv(COLOR[t], active(t) ? 0.42 : 0.14);
  const hypo = (t: StrokeVariant | 'post') => (active(t) && !normal ? pv('membrane', 0.55 * (1 - s.flow) * (1 - 0.35 * s.collateral)) : 'none');
  const flowFor = (t: StrokeVariant) => (v === t || (v === 'basilar' && t === 'pca') ? s.flow : 1);
  const artery = (p: QPath, t: StrokeVariant, width: number, id: StructureId) => <>
    <path d={qd(p)} fill="none" stroke={pv('vessel', 0.3 + 0.7 * flowFor(t))} strokeWidth={sel(id) ? width + 3 : width} strokeLinecap="round" />
    {Array.from({ length: 4 }, (_, i) => { const [x, y] = qAt(p, dot(i, 4)); return <circle key={i} cx={x} cy={y} r={2.4} fill={pv('rbc', flowFor(t))} />; })}
  </>;
  const lesion = (k: 'lat' | 'med'): ReactNode => occ.view === k && !normal && v !== 'basilar' && <g>
    <g {...hit('oligemia')}>{s.oligemia > 0.05 && <circle cx={occ.lesion[0]} cy={occ.lesion[1]} r={penR + 26 * s.oligemia * r} fill={pv('fluid', 0.12 * s.oligemia)} stroke={pv('fluid', 0.45 * s.oligemia)} strokeDasharray="4 4" clipPath={`url(#${pid}-clip-${k})`} />}</g>
    <g {...hit('penumbra')}>{s.penumbra > 0.02 && <circle cx={occ.lesion[0]} cy={occ.lesion[1]} r={penR} fill={pv('alert', 0.5 * s.penumbra)} stroke={pv('alert', sel('penumbra') ? 1 : 0.7)} strokeWidth={sel('penumbra') ? 3 : 1.2} clipPath={`url(#${pid}-clip-${k})`} />}</g>
    <g {...hit('core')}>{s.core > 0.01 && <circle cx={occ.lesion[0]} cy={occ.lesion[1]} r={coreR} fill={pv('inflame', 0.92)} stroke={pv('ink', sel('core') ? 1 : 0.3)} strokeWidth={sel('core') ? 3 : 1} clipPath={`url(#${pid}-clip-${k})`} />}</g>
  </g>;
  const clot = (k: 'lat' | 'med') => occ.view === k && <g {...hit('clot')}><ellipse cx={occ.at[0]} cy={occ.at[1]} rx={3 + 6 * s.clot} ry={3 + 5 * s.clot} fill={pv('ink', 0.15 + 0.8 * s.clot)} stroke={pv('alert', sel('clot') ? 1 : 0.6)} strokeWidth={sel('clot') ? 2.5 : 1.2} /></g>;
  const clipFor = v === 'mca' ? <path d={OUT} /> : v === 'aca' ? <path d={ACA_M} /> : v === 'pca' ? <path d={PCA_M} /> : <path d={POST_FOSSA} />;
  const hemi = side === 'left' ? 'Left' : 'Right';

  return (
    <svg viewBox="0 0 820 560" role="img" aria-label={title ?? `Illustrative ${hemi.toLowerCase()} cerebral hemisphere, lateral and medial views, with vascular territories: ${v.toUpperCase()} occlusion, collaterals, core and penumbra concept, and conceptual imaging icons`} className="block h-auto w-full rounded-lg patho-scene" style={{ background: pv('bg') }}
      data-variant={v} data-side={side} data-core={s.core.toFixed(2)} data-penumbra={s.penumbra.toFixed(2)} data-collateral={s.collateral.toFixed(2)} data-flow={s.flow.toFixed(2)}>
      <defs>
        <clipPath id={`${pid}-out`}><path d={OUT} /></clipPath>
        <mask id={`${pid}-mca-mask`}><path d={OUT} fill="white" /><path d={ACA_L} fill="black" /><path d={PCA_L} fill="black" /></mask>
        <clipPath id={`${pid}-clip-lat`}><path d={`${OUT} ${ACA_L} ${PCA_L}`} clipRule="evenodd" /></clipPath>
        <clipPath id={`${pid}-clip-med`}>{clipFor}</clipPath>
      </defs>
      <text x="14" y="20" fontSize="11" fill={pv('ink', 0.75)}>Illustrative, anatomically informed drawing · territories from average atlases, variable between people · not a scan or 3D model</text>
      <text x="210" y="36" fontSize="12" textAnchor="middle" fill={pv('ink', 0.9)}>{hemi} hemisphere · lateral surface</text>
      <text x="620" y="36" fontSize="12" textAnchor="middle" fill={pv('ink', 0.9)}>{hemi} hemisphere · medial surface (midline cut)</text>
      {(['lat', 'med'] as const).map(k => <g key={k}>
        <text x={X(k, 40)} y={334} fontSize="10" textAnchor="middle" fill={pv('ink', 0.65)}>◀ anterior</text>
        <text x={X(k, 380)} y={334} fontSize="10" textAnchor="middle" fill={pv('ink', 0.65)}>posterior ▶</text>
      </g>)}

      {/* ---------- Lateral view ---------- */}
      <g transform={tf('lat')}>
        <path d={OUT} fill={pv('brain', 0.35)} stroke={pv('ink', 0.4)} />
        <g clipPath={`url(#${pid}-out)`}>
          {(Object.keys(LOBES) as (keyof typeof LOBES)[]).map(l => <path key={l} {...hit(l)} d={LOBES[l]} fill={sel(l) ? pv('ink', 0.18) : 'transparent'} />)}
          <g {...hit('territories')}>
            <path d={OUT} mask={`url(#${pid}-mca-mask)`} fill={terrFill('mca')} />
            <path d={OUT} mask={`url(#${pid}-mca-mask)`} fill={hypo('mca')} />
            <path d={ACA_L} fill={terrFill('aca')} /><path d={ACA_L} fill={hypo('aca')} />
            <path d={PCA_L} fill={terrFill('pca')} /><path d={PCA_L} fill={hypo('pca')} />
          </g>
          {lesion('lat')}
          {v !== 'mca' && !normal && (v === 'aca' || v === 'pca' || v === 'basilar') && s.core > 0.01 && <path d={v === 'aca' ? ACA_L : PCA_L} fill={pv('inflame', 0.45 * s.core)} />}
          {v !== 'mca' && !normal && s.penumbra > 0.02 && <path d={v === 'aca' ? ACA_L : PCA_L} fill={pv('alert', 0.25 * s.penumbra)} />}
        </g>
        <g aria-hidden fill="none" stroke={pv('ink', 0.55)}>
          <path d="M 128 228 Q 200 214 286 168" strokeWidth="2.5" />
          <path d="M 240 46 Q 228 110 208 200" strokeWidth="2" />
          <path d="M 352 70 Q 345 170 340 238" strokeWidth="1" strokeDasharray="3 4" />
          {['M 110 120 Q 150 110 190 130', 'M 92 170 Q 140 160 180 185', 'M 270 90 Q 300 120 320 110', 'M 170 250 Q 230 245 290 225'].map(d => <path key={d} d={d} strokeWidth="0.8" opacity="0.6" />)}
        </g>
        <g {...hit('motorStrip')}><path d="M 228 50 Q 216 112 198 196" fill="none" stroke={pv('alert', sel('motorStrip') ? 0.9 : 0.35)} strokeWidth={sel('motorStrip') ? 9 : 6} strokeLinecap="round" /></g>
        <g {...hit('cerebellum')}><ellipse cx={330} cy={282} rx={56} ry={27} fill={pv('serosa', active('post') ? 0.45 : 0.22)} stroke={pv('ink', sel('cerebellum') ? 1 : 0.35)} />{[0, 1, 2].map(i => <path key={i} d={`M ${284 + i * 4} ${272 + i * 8} Q 330 ${262 + i * 8} 380 ${274 + i * 6}`} fill="none" stroke={pv('ink', 0.3)} strokeWidth="0.8" />)}</g>
        <g {...hit('brainstem')}><path d="M 244 262 Q 250 300 262 340" stroke={pv('serosa', active('post') ? 0.6 : 0.3)} strokeWidth="24" fill="none" strokeLinecap="round" /></g>
        <g {...hit('ica')}><path d="M 150 330 Q 156 280 150 238" fill="none" stroke={pv('vessel', 0.8)} strokeWidth={sel('ica') ? 9 : 6} strokeDasharray="6 3" /></g>
        <g {...hit('mca')}>{MCA_BR.map((p, i) => <g key={i}>{artery(p, 'mca', 3.2, 'mca')}</g>)}</g>
        <g {...hit('collaterals')}>{['M 120 112 Q 132 128 150 146', 'M 232 70 Q 236 92 240 112', 'M 344 112 Q 326 140 306 172', 'M 352 210 Q 330 220 306 236'].map(d => <path key={d} d={d} fill="none" stroke={pv('fluid', 0.25 + 0.75 * s.collateral)} strokeWidth={sel('collaterals') ? 4 : 1.4 + 2 * s.collateral} strokeDasharray="3 4" strokeDashoffset={-time * 12 * s.collateral} />)}</g>
        {clot('lat')}
      </g>
      {L('lat', 120, 100, 'Frontal')}{L('lat', 296, 92, 'Parietal')}{L('lat', 226, 262, 'Temporal')}{L('lat', 382, 140, 'Occipital', 'middle', 10)}
      {L('lat', 330, 306, 'Cerebellum', 'middle', 10)}{L('lat', 200, 120, 'leg↑ arm face↓', 'start', 9)}
      {L('lat', 286, 160, 'Sylvian fissure', 'start', 9)}{L('lat', 252, 70, 'Central sulcus', 'start', 9)}
      {L('lat', 150, 348, 'ICA (deep)', 'middle', 10)}{L('lat', 300, 214, 'MCA branches', 'start', 10)}
      {showLabels && v === 'mca' && s.clot > 0.2 && L('lat', 134, 250, 'M1 occlusion', 'end', 10)}

      {/* ---------- Medial view ---------- */}
      <g transform={tf('med')}>
        <path d={OUT} fill={pv('brain', 0.35)} stroke={pv('ink', 0.4)} />
        <g clipPath={`url(#${pid}-out)`}>
          <g {...hit('territories')}>
            <path d={ACA_M} fill={terrFill('aca')} /><path d={ACA_M} fill={hypo('aca')} />
            <path d={PCA_M} fill={terrFill('pca')} /><path d={PCA_M} fill={hypo('pca')} />
          </g>
          {lesion('med')}
        </g>
        <g {...hit('callosum')}><path d={CALLOSUM} fill={pv('ink', sel('callosum') ? 0.5 : 0.28)} stroke={pv('ink', 0.4)} /></g>
        <g {...hit('thalamus')}><ellipse cx={226} cy={182} rx={28} ry={15} fill={pv('contents', active('pca') ? 0.5 : 0.2)} stroke={pv('ink', sel('thalamus') ? 1 : 0.35)} /></g>
        <g aria-hidden fill="none" stroke={pv('ink', 0.55)}><path d="M 335 64 Q 318 120 300 170" strokeWidth="2" /><path d="M 392 168 Q 350 170 304 176" strokeWidth="2" /></g>
        <g {...hit('cerebellum')}><ellipse cx={322} cy={278} rx={52} ry={30} fill={pv('serosa', active('post') ? 0.5 : 0.22)} stroke={pv('ink', sel('cerebellum') ? 1 : 0.35)} />{[0, 1, 2, 3].map(i => <path key={i} d={`M 322 278 L ${360 - i * 6} ${252 + i * 16}`} stroke={pv('ink', 0.3)} strokeWidth="0.8" />)}</g>
        <g {...hit('brainstem')}><path d="M 250 196 Q 252 260 258 340" stroke={pv('serosa', active('post') ? 0.65 : 0.32)} strokeWidth="28" fill="none" strokeLinecap="round" /><ellipse cx={248} cy={262} rx={18} ry={26} fill={pv('serosa', active('post') ? 0.5 : 0.25)} /></g>
        {v === 'basilar' && !normal && <g clipPath={`url(#${pid}-clip-med)`}>
          <path d={POST_FOSSA} fill={pv('membrane', 0.5 * (1 - s.flow) * (1 - 0.35 * s.collateral))} />
          <g {...hit('penumbra')}>{s.penumbra > 0.02 && <circle cx={256} cy={262} r={penR} fill={pv('alert', 0.5 * s.penumbra)} />}</g>
          <g {...hit('core')}>{s.core > 0.01 && <circle cx={256} cy={262} r={coreR} fill={pv('inflame', 0.92)} />}</g>
        </g>}
        <g {...hit('ica')}><path d="M 128 262 Q 126 248 124 232" stroke={pv('vessel', 0.8)} strokeWidth={sel('ica') ? 8 : 5} fill="none" /></g>
        <g {...hit('aca')}>{artery(ACA_P, 'aca', 3.4, 'aca')}</g>
        <g {...hit('pca')}>{artery(PCA_P, 'pca', 3.4, 'pca')}</g>
        <g {...hit('basilar')}>{artery(BAS_P, 'basilar', 5, 'basilar')}<path d="M 234 228 Q 280 240 296 254 M 233 288 Q 268 292 286 298" stroke={pv('vessel', 0.3 + 0.7 * flowFor('basilar'))} strokeWidth="2" fill="none" /></g>
        <g {...hit('collaterals')}>
          <path d="M 128 232 Q 180 226 234 212" fill="none" stroke={pv('fluid', 0.25 + 0.75 * s.collateral)} strokeWidth={sel('collaterals') ? 4 : 1.4 + 2 * s.collateral} strokeDasharray="3 4" strokeDashoffset={-time * 12 * s.collateral} />
          <path d="M 322 140 Q 330 155 336 170" fill="none" stroke={pv('fluid', 0.25 + 0.75 * s.collateral)} strokeWidth={sel('collaterals') ? 4 : 1.4 + 2 * s.collateral} strokeDasharray="3 4" strokeDashoffset={-time * 12 * s.collateral} />
        </g>
        {clot('med')}
      </g>
      {L('med', 150, 104, 'ACA territory', 'middle', 10)}{L('med', 372, 120, 'PCA territory', 'middle', 10)}{L('med', 210, 140, 'Corpus callosum', 'middle', 9)}
      {L('med', 226, 186, 'Thalamus', 'middle', 9)}{L('med', 350, 165, 'Calcarine', 'middle', 9)}{L('med', 322, 316, 'Cerebellum', 'middle', 10)}
      {L('med', 270, 236, 'Brainstem', 'start', 9)}{L('med', 226, 326, 'Basilar / vertebral', 'end', 10)}{L('med', 176, 222, 'Pcomm', 'middle', 9)}
      {L('med', 110, 250, 'ICA', 'end', 9)}

      {/* Legend */}
      <g transform="translate(20 356)" {...hit('territories')}>
        {([['MCA', 'fluid'], ['ACA', 'lcx'], ['PCA', 'contents'], ['Posterior fossa (vertebrobasilar)', 'serosa']] as const).map(([n, c], i) => <g key={n} transform={`translate(${[0, 70, 140, 210][i]} 0)`}><rect width="12" height="12" fill={pv(c, 0.6)} /><text x="16" y="10" fontSize="10" fill={pv('ink', 0.85)}>{n}</text></g>)}
        <rect x="440" width="12" height="12" fill={pv('inflame')} /><text x="456" y="10" fontSize="10" fill={pv('ink', 0.85)}>core (concept)</text>
        <rect x="540" width="12" height="12" fill={pv('alert', 0.6)} /><text x="556" y="10" fontSize="10" fill={pv('ink', 0.85)}>penumbra</text>
        <path d="M 630 6 h 18" stroke={pv('fluid')} strokeDasharray="3 3" strokeWidth="2" /><text x="652" y="10" fontSize="10" fill={pv('ink', 0.85)}>collaterals</text>
      </g>

      {/* Conceptual imaging comparison */}
      <g {...hit('imaging')}>
        <text x="20" y="398" fontSize="11" fill={pv('ink', 0.85)}>Imaging concept — icons, not scans. CTA shows occlusion; perfusion estimates tissue state.</text>
        {([
          ['NCCT', 'Often normal/subtle early; key role: exclude haemorrhage', <ellipse key="n" cx={125 + 10} cy={52} rx={coreR * 0.5} ry={coreR * 0.4} fill={pv('ink', s.core > 0.3 ? 0.16 : 0)} />],
          ['CTA', 'Locates the occlusion; does not measure core', <g key="c"><path d="M 70 78 Q 80 60 110 54 L 175 40 M 110 54 L 170 72" fill="none" stroke={pv('vessel')} strokeWidth="2.5" strokeDasharray={s.clot > 0.5 ? '42 300' : undefined} />{s.clot > 0.5 && <circle cx={110} cy={54} r={4} fill={pv('alert')} />}</g>],
          ['CT perfusion', 'Core/hypoperfusion estimates; timing, thresholds & software vary', <g key="p">{s.penumbra > 0.05 && <ellipse cx={130} cy={52} rx={penR * 0.45} ry={penR * 0.35} fill={pv('alert', 0.55)} />}{s.core > 0.02 && <ellipse cx={130} cy={52} rx={coreR * 0.45} ry={coreR * 0.35} fill={pv('inflame', 0.9)} />}</g>],
        ] as const).map(([name, note, body], i) => <g key={name} transform={`translate(${20 + i * 265} 408)`}>
          <rect width="255" height="105" rx="8" fill={pv('panel')} stroke={pv('ink', sel('imaging') ? 1 : 0.2)} strokeWidth={sel('imaging') ? 2.5 : 1} />
          <text x="10" y="17" fontSize="11" fontWeight="700" fill={pv('ink')}>{name}</text>
          <ellipse cx="128" cy="54" rx="56" ry="34" fill={pv('membrane', 0.18)} stroke={pv('ink', 0.3)} />
          {body}
          <text x="10" y="98" fontSize="9" fill={pv('ink', 0.75)}>{note}</text>
        </g>)}
      </g>
      <text x="20" y="540" fontSize="10" fill={pv('ink', 0.65)}>Lesion drawn in the {v === 'mca' ? 'lateral' : 'medial'} view; {v === 'basilar' ? 'basilar occlusion affects both hemispheres and the posterior fossa.' : `the opposite (${side === 'left' ? 'right' : 'left'}) side of the body is affected.`}</text>
    </svg>
  );
}
