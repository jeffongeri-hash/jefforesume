import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cardiacState, ecgPattern, preloadChain, asVariant, DOMINANCE } from '@/data/pathophysiology/ladOcclusion';
import type { CompanionProps } from './PathoLessonPage';
import { pv } from './sceneKit';

const NODES = [
  { x: 60, label: 'Systemic veins', sub: 'venous return' },
  { x: 205, label: 'RA → RV', sub: 'RV output' },
  { x: 350, label: 'Lungs', sub: 'transit' },
  { x: 495, label: 'LA → LV', sub: 'LV filling' },
  { x: 640, label: 'Aorta', sub: 'cardiac output / BP' },
];

/** Qualitative RV → LV preload chain with an optional venodilator concept toggle. Not a pharmacologic model. */
export default function CardiacPreloadPanel({ time, variant }: CompanionProps) {
  const v = asVariant(variant);
  const [veno, setVeno] = useState(false);
  const s = cardiacState(v, time);
  const c = preloadChain(s.rvIschemia, s.contractility, veno);
  const vals = [c.venousReturn, c.rvOutput, c.rvOutput, c.lvFilling, c.cardiacOutput];
  const ecg = ecgPattern(v);
  const rvActive = s.rvIschemia > 0.3;
  return (
    <div>
      <p className="mt-1 text-sm text-muted-foreground">Everything the left ventricle ejects must first be pumped through the lungs by the right ventricle. This panel follows the current phase; toggle the venodilator concept to compare a well-functioning RV with an ischemic, preload-dependent RV.</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button size="sm" variant={veno ? 'secondary' : 'outline'} aria-pressed={veno} onClick={() => setVeno(x => !x)}>{veno ? 'Venodilator concept: on' : 'Show venodilator concept (e.g., nitroglycerin)'}</Button>
        <span className="text-xs text-muted-foreground">RV involvement in this phase: {s.rvIschemia < 0.05 ? 'none modelled' : rvActive ? 'present (possible scenario)' : 'emerging'}</span>
      </div>
      <svg viewBox="0 0 700 170" role="img" aria-label={`Preload chain: venous return ${Math.round(c.venousReturn * 100)}%, RV output ${Math.round(c.rvOutput * 100)}%, LV filling ${Math.round(c.lvFilling * 100)}%, cardiac output ${Math.round(c.cardiacOutput * 100)}% of reference (qualitative)`} className="mt-3 block h-auto w-full rounded" style={{ background: pv('bg') }} data-co={c.cardiacOutput.toFixed(2)} data-lvfill={c.lvFilling.toFixed(2)}>
        {NODES.slice(0, -1).map((n, i) => {
          const w = 2 + 12 * vals[i + 1];
          return <g key={n.label}>
            <line x1={n.x + 45} y1={60} x2={NODES[i + 1].x - 45} y2={60} stroke={pv(i < 1 ? 'vein' : i < 2 ? 'vein' : 'vessel', 0.8)} strokeWidth={w} strokeLinecap="round" />
            {Array.from({ length: 3 }, (_, k) => { const f = ((k / 3) + time * 0.3 * vals[i + 1]) % 1; return <circle key={k} cx={n.x + 45 + f * (NODES[i + 1].x - n.x - 90)} cy={60} r={2.5} fill={pv('ink', 0.9)} />; })}
          </g>;
        })}
        {NODES.map((n, i) => <g key={n.label}>
          <rect x={n.x - 45} y={38} width={90} height={44} rx={8} fill={pv(i === 1 && rvActive ? 'membrane' : 'panel', i === 1 && rvActive ? 0.55 : 1)} stroke={pv('ink', 0.3)} />
          <text x={n.x} y={57} textAnchor="middle" fontSize="11" fill={pv('ink')}>{n.label}</text>
          <text x={n.x} y={73} textAnchor="middle" fontSize="9" fill={pv('ink', 0.7)}>{n.sub}</text>
          <rect x={n.x - 40} y={100} width={80} height={8} rx={4} fill={pv('panel')} stroke={pv('ink', 0.25)} />
          <rect x={n.x - 40} y={100} width={80 * vals[i]} height={8} rx={4} fill={pv(i === 4 ? 'alert' : 'fluid')} />
        </g>)}
        {veno && <text x={60} y={28} textAnchor="middle" fontSize="10" fill={pv('alert')}>venodilation ↓ return</text>}
        <text x={14} y={140} fontSize="10" fill={pv('ink', 0.7)}>Bars = qualitative fraction of the normal reference, not measured values. No dose, threshold or eligibility is implied.</text>
        <text x={14} y={158} fontSize="10" fill={pv('ink', 0.7)}>LV filling sensitivity to venous return (concept): {s.rvIschemia > 0.3 ? 'high — preload-dependent' : 'modest'}</text>
      </svg>
      <p className="mt-3 text-sm" aria-live="polite">{veno
        ? (rvActive
          ? 'With an ischemic RV, LV filling tracks venous return closely, so the same venodilation produces a larger fall in LV filling and cardiac output — the mechanism behind possible marked hypotension in preload-dependent patients. It is not seen in every RCA or inferior MI.'
          : 'With a well-functioning RV, venodilation reduces preload more modestly; output and pressure fall less in this conceptual model. Individual responses still vary.')
        : 'Toggle the venodilator concept to see how reduced venous return propagates through the chain.'}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">{DOMINANCE.map(d => <div key={d.title} className="rounded border border-border p-3"><p className="text-sm font-semibold">{d.title}</p><p className="mt-1 text-xs text-muted-foreground">{d.text}</p></div>)}</div>
      <p className="mt-3 text-xs text-muted-foreground"><strong>ECG concept for this occlusion:</strong> {ecg.note} Lead groups map loosely to anatomy; a normal or non-diagnostic ECG does not exclude occlusion MI.</p>
      <p className="mt-2 text-xs text-muted-foreground">Clinical assessment context (high level only): hypotension, suspected RV involvement and recent phosphodiesterase-5 inhibitor use are among the recognised cautions for nitrates in guidelines; decisions are individual and made by the treating team.</p>
    </div>
  );
}
