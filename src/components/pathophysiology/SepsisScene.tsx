import { STRUCTURES, sceneState, type StructureId } from '@/data/pathophysiology/sepsisShock';
import { Label, Meter, makeHit, pv, rnd } from './sceneKit';

type Props = { time: number; normal?: boolean; showLabels: boolean; selected: StructureId | null; onSelect: (id: StructureId) => void; compact?: boolean; title?: string };

// Capillaries in the bed: y position and whether they become stagnant under heterogeneity.
const CAPS = [{ y: 300, stop: false }, { y: 330, stop: true }, { y: 360, stop: false }, { y: 390, stop: true }, { y: 420, stop: false }];

export default function SepsisScene({ time, normal = false, showLabels, selected, onSelect, compact, title }: Props) {
  const s = sceneState(time, normal);
  const hit = makeHit(STRUCTURES, selected, onSelect, compact);
  const sel = (id: StructureId) => selected === id;
  const R = 34 + 26 * s.dilation; // arteriole lumen radius
  const smTh = 18 - 8 * s.dilation; // smooth-muscle ring thickness (relaxing)
  const cx = 150, cy = 150;
  const nRbc = 10;
  const leakDots = Array.from({ length: 40 }, (_, i) => i / 40 < s.leak ? { x: 300 + rnd(i, 1) * 460, y: 445 + rnd(i, 2) * 35 } : null).filter(Boolean) as { x: number; y: number }[];

  return (
    <svg viewBox="0 0 800 500" role="img" aria-label={title ?? 'Conceptual microcirculation schematic: arteriole, capillary bed and tissue in sepsis'} className="block h-auto w-full rounded-lg patho-scene" style={{ background: pv('bg') }}
      data-dilation={s.dilation.toFixed(2)} data-leak={s.leak.toFixed(2)} data-hetero={s.hetero.toFixed(2)} data-glycocalyx={s.glycocalyx.toFixed(2)}>
      <text x="20" y="24" fontSize="11" fill={pv('ink', 0.7)}>Conceptual schematic · not to scale · not patient data</text>

      {/* Infection focus with PAMPs and innate cells */}
      <g {...hit('pathogen')}>
        <rect x="300" y="40" width="200" height="150" rx="10" fill={pv('panel')} stroke={pv('ink', sel('pathogen') ? 1 : 0.2)} strokeWidth={sel('pathogen') ? 3 : 1} />
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={315 + rnd(i, 5) * 170} y={55 + rnd(i, 6) * 120} width="12" height="5" rx="2.5" fill={pv('contents', 0.4 + 0.6 * s.pamp)} transform={`rotate(${rnd(i, 7) * 180 + time * 10} ${321 + rnd(i, 5) * 170} ${57 + rnd(i, 6) * 120})`} />)}
        <Label show={showLabels} x={400} y={205} anchor="middle">Infection focus · PAMPs</Label>
      </g>
      <g {...hit('innate-cell')}>
        {[0, 1, 2].map(i => { const x = 340 + i * 60, y = 120 + Math.sin(time * 1.5 + i) * 6; return <g key={i}>
          <circle cx={x} cy={y} r={14} fill={pv('membrane', 0.5)} stroke={pv('ink', sel('innate-cell') ? 1 : 0.4)} strokeWidth={sel('innate-cell') ? 2.5 : 1} />
          {Array.from({ length: 6 }, (_, k) => { const a = (k / 6) * Math.PI * 2 + time; const r = 18 + 40 * s.immune * ((time * 0.6 + k / 6) % 1); return <circle key={k} cx={x + Math.cos(a) * r} cy={y + Math.sin(a) * r} r={2} fill={pv('inflame', s.immune * 0.9)} />; })}
        </g>; })}
        <Label show={showLabels} x={600} y={90}>Innate cells · mediators</Label>
        {showLabels && <line x1={596} y1={86} x2={470} y2={115} stroke={pv('ink', 0.35)} />}
      </g>

      {/* Arteriole cross-section */}
      <g {...hit('smooth-muscle')}>
        <circle cx={cx} cy={cy} r={R + 8 + smTh / 2} fill="none" stroke={pv('wall', 0.85)} strokeWidth={smTh} strokeDasharray="10 4" strokeWidth-opacity="1" />
        <Label show={showLabels} x={cx} y={cy + 100} anchor="middle">Smooth muscle (relaxes)</Label>
      </g>
      <g {...hit('endothelium')}>
        <circle cx={cx} cy={cy} r={R + 4} fill="none" stroke={s.dilation > 0.1 ? pv('inflame', 0.4 + 0.5 * s.immune) : pv('mucosa')} strokeWidth={sel('endothelium') ? 6 : 4} />
      </g>
      <g {...hit('glycocalyx')}>
        {Array.from({ length: 36 }, (_, i) => { if (rnd(i, 9) > s.glycocalyx) return null; const a = (i / 36) * Math.PI * 2; return <line key={i} x1={cx + Math.cos(a) * (R + 2)} y1={cy + Math.sin(a) * (R + 2)} x2={cx + Math.cos(a) * (R - 6)} y2={cy + Math.sin(a) * (R - 6)} stroke={pv('fluid', sel('glycocalyx') ? 1 : 0.75)} strokeWidth="2" />; })}
      </g>
      <g {...hit('arteriole')}>
        <circle cx={cx} cy={cy} r={R - 7} fill={pv('vessel', 0.35)} />
        {Array.from({ length: 5 }, (_, i) => <circle key={i} cx={cx + Math.cos(i * 1.3 + time) * (R - 20) * 0.6} cy={cy + Math.sin(i * 1.3 + time) * (R - 20) * 0.6} r={5} fill={pv('rbc')} />)}
        {s.dilation > 0.05 && <text x={cx} y={cy + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={pv('ink')} opacity={s.dilation}>NO ↑</text>}
        <Label show={showLabels} x={cx} y={cy - R - 32} anchor="middle">Resistance arteriole</Label>
      </g>

      {/* Feeder vessel into capillary bed */}
      <path d={`M ${cx + 40} 250 Q 240 300 280 360`} fill="none" stroke={pv('vessel', 0.6)} strokeWidth={10 + 8 * s.dilation} aria-hidden />

      {/* Capillary bed */}
      <g {...hit('capillaries')}>
        {CAPS.map((c, i) => {
          const stopped = c.stop && s.hetero > 0.4;
          const speed = stopped ? 0.05 : 1 + (c.stop ? 0 : 0.6 * s.hetero);
          return <g key={i} data-capillary={i} data-stopped={stopped ? 'true' : 'false'}>
            <line x1="280" y1={c.y} x2="760" y2={c.y} stroke={pv(stopped ? 'alert' : 'vessel', stopped ? 0.55 : 0.45)} strokeWidth={sel('capillaries') ? 12 : 9} strokeLinecap="round" />
            {Array.from({ length: nRbc }, (_, k) => { const p = ((k / nRbc) + time * 0.12 * speed) % 1; return <ellipse key={k} cx={290 + p * 460} cy={c.y} rx={6} ry={3.5} fill={pv('rbc', stopped ? 0.55 : 1)} />; })}
            {stopped && <circle cx={500 + i * 20} cy={c.y} r={6} fill={pv('membrane', 0.9)} aria-hidden />}
          </g>;
        })}
        <Label show={showLabels} x={520} y={285} anchor="middle">Capillary bed — flow becomes heterogeneous</Label>
      </g>
      {/* Leak to interstitium */}
      <g {...hit('interstitium')}>
        <rect x="280" y="440" width="490" height="45" rx="6" fill={pv('fluid', 0.06 + 0.25 * s.leak)} />
        {leakDots.map((d, i) => <circle key={i} cx={d.x} cy={d.y + Math.sin(time * 2 + i) * 2} r={2.5} fill={pv('fluid', 0.9)} />)}
        <Label show={showLabels} x={290} y={478}>Interstitium · oedema</Label>
      </g>
      <g {...hit('tissue-cell')}>
        {[60, 140].map((x, i) => <g key={x}>
          <rect x={x} y={330} width="70" height="60" rx="14" fill={pv('panel')} stroke={pv('ink', sel('tissue-cell') ? 1 : 0.35)} strokeWidth={sel('tissue-cell') ? 2.5 : 1} />
          {[0, 1].map(k => <ellipse key={k} cx={x + 22 + k * 26} cy={360} rx={10} ry={5} fill={pv(s.dysfunction > 0.3 ? 'alert' : 'serosa', 0.5 + 0.5 * (i ? 1 - s.dysfunction : 1))} />)}
        </g>)}
        <Label show={showLabels} x={60} y={410}>Tissue cells · mitochondria</Label>
      </g>

      {/* Conceptual meters */}
      <g transform="translate(20 440)">
        <Meter x={0} y={0} w={110} label="Vascular tone" value={1 - 0.8 * s.dilation} color={pv('wall')} />
        <Meter x={130} y={0} w={110} label="Uniform flow" value={1 - 0.75 * s.hetero} color={pv('fluid')} />
        <Meter x={0} y={34} w={240} label="Effective O₂ delivery/use (concept)" value={1 - 0.3 * s.hetero - 0.4 * s.dysfunction} color={pv('alert')} />
      </g>
    </svg>
  );
}
