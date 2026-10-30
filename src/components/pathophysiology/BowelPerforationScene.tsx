import type { KeyboardEvent } from 'react';
import { STRUCTURES, sceneState, type StructureId } from '@/data/pathophysiology/bowelPerforation';

type Props = { time: number; normal?: boolean; showLabels: boolean; selected: StructureId | null; onSelect: (id: StructureId) => void; compact?: boolean; title?: string };

const CX = 330, CY = 250;
const v = (name: string, a = 1) => `hsl(var(--patho-${name}) / ${a})`;
// deterministic pseudo-random
const rnd = (i: number, k: number) => { const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s); };

export default function BowelPerforationScene({ time, normal = false, showLabels, selected, onSelect, compact, title }: Props) {
  const s = sceneState(time, normal);
  const wobble = Math.sin(time * 2.4) * 4 * s.peristalsis;
  const R = 92 + 22 * s.ileus; // distension
  const gapDeg = 26 * s.breach; // opening on right side
  const hit = (id: StructureId) => ({
    role: 'button', tabIndex: compact ? -1 : 0, 'aria-label': `${STRUCTURES[id].label}: show explanation`, 'aria-pressed': selected === id,
    onClick: () => onSelect(id),
    onKeyDown: (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(id); } },
    className: 'patho-hit cursor-pointer outline-none',
    'data-structure': id,
  });
  const ring = (r: number) => {
    // ring arc leaving a gap centred at angle 0 (right side)
    const g = (gapDeg / 2) * Math.PI / 180;
    if (g < 0.005) return `M ${CX + r} ${CY} A ${r} ${r} 0 1 1 ${CX + r - 0.01} ${CY - 0.5}`;
    const x1 = CX + r * Math.cos(g), y1 = CY + r * Math.sin(g), x2 = CX + r * Math.cos(-g), y2 = CY + r * Math.sin(-g);
    return `M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`;
  };
  const sel = (id: StructureId) => selected === id ? 1 : 0;
  const lumenDots = Array.from({ length: 26 }, (_, i) => {
    const a = rnd(i, 1) * Math.PI * 2 + time * 0.3 * s.peristalsis, rr = rnd(i, 2) * (R - 40);
    return { x: CX + Math.cos(a) * rr, y: CY + Math.sin(a) * rr, r: 2 + rnd(i, 3) * 3 };
  });
  const escaped = Array.from({ length: 46 }, (_, i) => {
    const share = i / 46; if (share > s.contamination) return null;
    const spread = Math.min(1, s.contamination * 1.4 - share * 0.6);
    const ang = (rnd(i, 4) - 0.5) * (0.6 + 4.6 * spread), dist = R + 8 + rnd(i, 5) * (40 + 230 * spread);
    return { x: Math.min(700, Math.max(50, CX + Math.cos(ang) * dist)), y: Math.min(440, Math.max(50, CY + Math.sin(ang) * dist * 0.8)), r: 2 + rnd(i, 6) * 2.5 };
  }).filter(Boolean) as { x: number; y: number; r: number }[];
  const neutrophils = Array.from({ length: 18 }, (_, i) => i / 18 < s.inflammation ? { x: 70 + rnd(i, 7) * 560, y: i % 2 ? 52 : 448 } : null).filter(Boolean) as { x: number; y: number }[];
  const fluidTop = 448 - 120 * s.fluid;
  const flowSpeed = 0.3 + 1.7 * s.perfusion;
  const rbcs = Array.from({ length: 9 }, (_, i) => ({ x: 560 + (((i / 9) + time * 0.12 * flowSpeed) % 1) * 200, stalled: s.perfusion < 0.6 && i % 3 === 0 }));
  const leak = Array.from({ length: 10 }, (_, i) => i / 10 < 1 - s.perfusion + s.inflammation * 0.2 ? { x: 570 + i * 18, y: 116 + rnd(i, 9) * 22 } : null).filter(Boolean) as { x: number; y: number }[];
  const label = (x: number, y: number, text: string, anchor: 'start' | 'end' | 'middle' = 'start') => showLabels && <text x={x} y={y} textAnchor={anchor} className="patho-label" fill={v('ink')} fontSize="13">{text}</text>;

  return (
    <svg viewBox="0 0 800 500" role="img" aria-label={title ?? 'Conceptual abdominal cross-section showing bowel, peritoneal cavity and a microcirculation inset'} className="block h-auto w-full rounded-lg patho-scene" style={{ background: v('bg') }} data-phase-breach={s.breach.toFixed(2)} data-contamination={s.contamination.toFixed(2)} data-fluid={s.fluid.toFixed(2)} data-perfusion={s.perfusion.toFixed(2)}>
      <defs>
        <radialGradient id={`lumen-${normal ? 'n' : 'a'}`}><stop offset="0%" stopColor={v('lumen')} /><stop offset="100%" stopColor={v('lumen', 0.6)} /></radialGradient>
        <radialGradient id={`inflame-${normal ? 'n' : 'a'}`} cx="50%" cy="50%" r="60%"><stop offset="60%" stopColor={v('inflame', 0)} /><stop offset="100%" stopColor={v('inflame', 0.55 * s.inflammation)} /></radialGradient>
      </defs>
      {/* Parietal peritoneum / abdominal wall */}
      <g {...hit('parietal-peritoneum')}>
        <rect x="30" y="30" width="600" height="440" rx="70" fill={`url(#inflame-${normal ? 'n' : 'a'})`} stroke={s.inflammation > 0.1 ? v('inflame', 0.4 + 0.6 * s.inflammation) : v('membrane')} strokeWidth={4 + 6 * s.inflammation + 3 * sel('parietal-peritoneum')} />
        {label(46, 22, 'Parietal peritoneum')}
      </g>
      {/* Peritoneal fluid */}
      <g {...hit('peritoneal-fluid')}>
        <path d={`M 40 ${fluidTop} Q 330 ${fluidTop - 14 + Math.sin(time) * 3 * s.peristalsis} 620 ${fluidTop} L 620 460 Q 330 470 40 460 Z`} fill={v('fluid', 0.18 + 0.4 * s.fluid)} stroke={v('fluid', sel('peritoneal-fluid') ? 1 : 0.5)} strokeWidth={1 + 2 * sel('peritoneal-fluid')} />
        {label(60, Math.min(fluidTop + 22, 452), s.fluid > 0.2 ? 'Peritoneal exudate (third space)' : 'Thin lubricating peritoneal fluid')}
      </g>
      {neutrophils.map((n, i) => <circle key={i} cx={n.x} cy={n.y} r="5" fill={v('inflame', 0.85)} stroke={v('ink', 0.6)} strokeWidth="1" aria-hidden />)}
      {/* Bowel loop */}
      <g transform={`translate(${wobble} 0)`}>
        <g {...hit('visceral-peritoneum')}><path d={ring(R + 8)} fill="none" stroke={s.inflammation > 0.1 ? v('inflame', 0.5 + 0.5 * s.inflammation) : v('membrane')} strokeWidth={3 + 2 * sel('visceral-peritoneum')} strokeDasharray="6 4" />{label(CX - R - 14, CY - R - 4, 'Visceral peritoneum', 'end')}</g>
        <g {...hit('serosa')}><path d={ring(R)} fill="none" stroke={v('serosa')} strokeWidth={8 + 3 * sel('serosa')} strokeLinecap="round" />{label(CX - 20, CY + R + 26, 'Serosa', 'end')}</g>
        <g {...hit('bowel-wall')}><path d={ring(R - 14)} fill="none" stroke={v('wall', 0.9 - 0.3 * s.ileus)} strokeWidth={18 - 6 * s.ileus + 3 * sel('bowel-wall') + 4 * s.fluid} strokeLinecap="round" />{label(CX - R - 10, CY + 4, 'Bowel wall', 'end')}</g>
        <g {...hit('mucosa')}><path d={ring(R - 30)} fill="none" stroke={v('mucosa')} strokeWidth={6 + 3 * sel('mucosa')} strokeDasharray="10 5" strokeLinecap="round" />{label(CX, CY - R + 50, 'Mucosa', 'middle')}</g>
        <g {...hit('enteric-contents')}>
          <circle cx={CX} cy={CY} r={R - 36} fill={`url(#lumen-${normal ? 'n' : 'a'})`} />
          {lumenDots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={v('contents')} />)}
          {label(CX, CY + 6, 'Enteric contents', 'middle')}
        </g>
        {s.breach > 0.02 && (
          <g {...hit('perforation')}>
            <circle cx={CX + R - 12} cy={CY} r={10 + 16 * s.breach} fill="transparent" stroke={v('alert', 0.9)} strokeWidth={2 + 2 * sel('perforation')} strokeDasharray="4 3" />
            {label(CX + R + 34, CY - 30, 'Perforation site')}
          </g>
        )}
      </g>
      {escaped.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={v('contents', 0.9)} aria-hidden />)}
      {s.ileus > 0.2 && showLabels && <text x={CX} y={CY - R - 34} textAnchor="middle" fontSize="12" fill={v('ink', 0.8)}>Ileus concept: distension, reduced peristalsis</text>}
      {/* Microcirculation inset */}
      <g {...hit('microcirculation')}>
        <rect x="548" y="60" width="226" height="130" rx="12" fill={v('panel')} stroke={sel('microcirculation') ? v('ink') : v('membrane', 0.6)} strokeWidth={1.5 + sel('microcirculation')} />
        <text x="560" y="82" fontSize="12" fill={v('ink')} fontWeight="600">Microcirculation inset</text>
        <path d="M 560 128 C 600 108, 640 148, 680 128 S 740 108, 762 128" fill="none" stroke={v('vessel', 0.35 + 0.65 * s.perfusion)} strokeWidth={14 + 6 * (1 - s.perfusion)} strokeLinecap="round" />
        {rbcs.map((c, i) => <ellipse key={i} cx={c.stalled ? 560 + (i / 9) * 200 : c.x} cy={128 + Math.sin((c.x - 560) / 30) * 8} rx="5" ry="3.5" fill={c.stalled ? v('alert', 0.8) : v('rbc')} />)}
        {leak.map((l, i) => <circle key={i} cx={l.x} cy={l.y + 30} r="2.5" fill={v('fluid', 0.9)} />)}
        <text x="560" y="180" fontSize="11" fill={v('ink', 0.85)}>{s.perfusion > 0.85 ? 'Reference flow' : s.perfusion > 0.55 ? 'Flow becoming heterogeneous; leak' : 'Reduced effective perfusion concept'}</text>
      </g>
      <text x="548" y="230" fontSize="11" fill={v('ink', 0.7)}>Conceptual schematic — not a CT scan,</text>
      <text x="548" y="246" fontSize="11" fill={v('ink', 0.7)}>not one patient, not to scale.</text>
    </svg>
  );
}
