import type { KeyboardEvent } from 'react';
import { STRUCTURES, sceneState, type StructureId } from '@/data/pathophysiology/retropharyngealAbscess';

type Props = { time: number; normal?: boolean; showLabels: boolean; selected: StructureId | null; onSelect: (id: StructureId) => void; compact?: boolean; title?: string };
const v = (n: string, a = 1) => `hsl(var(--patho-${n}) / ${a})`;
const rnd = (i: number, k: number) => { const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s); };

// Sagittal layout (anterior = left). x positions of fixed layers.
const TOP = 50, FUSION = 380, BOTTOM = 470;
const WALL0 = 262, ALAR = 318, PREV = 344, SPINE = 362;
const ys = Array.from({ length: 34 }, (_, i) => TOP + (i * (FUSION - TOP)) / 33);
const profile = (y: number) => Math.exp(-(((y - 190) / 75) ** 2)); // bulge peak behind oropharynx

export default function RetropharyngealScene({ time, normal = false, showLabels, selected, onSelect, compact, title }: Props) {
  const s = sceneState(time, normal);
  const pulse = 1 + Math.sin(time * 3) * 0.03 * s.abscess;
  const wallX = (y: number) => WALL0 - 70 * s.bulge * profile(y) * pulse; // posterior pharyngeal wall moves anteriorly
  const bpX = (y: number) => wallX(y) + 12;
  const bpPts = ys.map(y => `${bpX(y) + (y > 330 ? ((y - 330) / 50) * (ALAR - bpX(y) - 1) : 0)},${y}`);
  const hit = (id: StructureId) => ({
    role: 'button', tabIndex: compact ? -1 : 0, 'aria-label': `${STRUCTURES[id].label}: show explanation`, 'aria-pressed': selected === id,
    onClick: () => onSelect(id), onKeyDown: (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(id); } },
    className: 'patho-hit cursor-pointer outline-none', 'data-structure': id,
  });
  const sw = (id: StructureId, base: number) => base + (selected === id ? 2.5 : 0);
  const label = (x: number, y: number, t: string, a: 'start' | 'end' | 'middle' = 'start') => showLabels && <text x={x} y={y} textAnchor={a} fontSize="12" fill={v('ink')} className="pointer-events-none">{t}</text>;
  const wallPath = `M 140 ${TOP} ` + ys.map(y => `L ${wallX(y)} ${y}`).join(' ') + ` L 200 ${FUSION + 40} L 140 ${FUSION + 40} Z`;
  const rpPath = `M ${bpPts[0]} ` + bpPts.slice(1).map(p => `L ${p}`).join(' ') + ` L ${ALAR} ${FUSION} L ${ALAR} ${TOP} Z`;
  const minAir = Math.min(...ys.map(wallX)) - 150; // airway width at narrowest (schematic)
  const spreadDots = Array.from({ length: 18 }, (_, i) => i / 18 < s.spread ? { x: ALAR + 6 + rnd(i, 1) * (PREV - ALAR - 12), y: 220 + (i / 18) * 240 * s.spread + rnd(i, 2) * 10 } : null).filter(Boolean) as { x: number; y: number }[];
  const microbes = Array.from({ length: 14 }, (_, i) => i / 14 < s.node ? { x: 280 + rnd(i, 3) * 30, y: 110 + rnd(i, 4) * 60 + Math.sin(time + i) * 2 } : null).filter(Boolean) as { x: number; y: number }[];

  return (
    <svg viewBox="0 0 800 500" role="img" aria-label={title ?? 'Conceptual sagittal neck schematic: pharynx, fascial spaces and cervical spine'} className="block h-auto w-full rounded-lg patho-scene" style={{ background: v('bg') }}
      data-node={s.node.toFixed(2)} data-abscess={s.abscess.toFixed(2)} data-airway={s.airway.toFixed(2)} data-spread={s.spread.toFixed(2)}>
      <text x="20" y="28" fontSize="11" fill={v('ink', 0.7)}>← Anterior</text>
      <text x="520" y="28" fontSize="11" fill={v('ink', 0.7)} textAnchor="end">Posterior →</text>
      <rect x="40" y={TOP - 18} width="460" height="14" rx="4" fill={v('membrane', 0.25)} aria-hidden />
      {label(270, TOP - 22, 'Skull base', 'middle')}
      {/* oral cavity / tongue for orientation */}
      <path d="M 40 120 Q 110 100 150 150 Q 160 210 120 240 L 40 240 Z" fill={v('wall', 0.35)} aria-hidden />
      {label(50, 260, 'Tongue / oral cavity (orientation)')}
      {/* airway */}
      <g {...hit('airway')}>
        <path d={`M 150 ${TOP} ` + ys.map(y => `L ${wallX(y) - 2} ${y}`).join(' ') + ` L 200 ${BOTTOM} L 160 ${BOTTOM} L 150 ${TOP} Z`} fill={v('fluid', 0.12)} stroke={v('fluid', selected === 'airway' ? 1 : 0.4)} strokeWidth={sw('airway', 1)} />
        {label(175, 330, 'Airway', 'middle')}
      </g>
      {/* posterior pharyngeal wall */}
      <g {...hit('pharynx')}>
        <path d={wallPath.replace('M 140', `M ${WALL0 - 2}`).split(' L 200')[0]} fill="none" stroke={v('mucosa')} strokeWidth={sw('pharynx', 10)} strokeLinecap="round" />
        {label(wallX(120) - 14, 115, 'Posterior pharyngeal wall', 'end')}
      </g>
      {/* retropharyngeal space */}
      <g {...hit('retropharyngeal-space')}>
        <path d={rpPath} fill={s.phlegmon > 0.02 ? v('inflame', 0.12 + 0.4 * s.phlegmon) : v('panel')} stroke="none" />
        {label(ALAR + 6, FUSION + 14, 'Retropharyngeal space ends (fascial fusion)')}
      </g>
      <g {...hit('buccopharyngeal-fascia')}><polyline points={bpPts.join(' ')} fill="none" stroke={v('membrane')} strokeWidth={sw('buccopharyngeal-fascia', 2)} strokeDasharray="5 3" /></g>
      <g {...hit('lymph-nodes')}>
        {[130, 165].map((y, i) => <ellipse key={y} cx={bpX(y) + 22} cy={y} rx={8 + 6 * s.node} ry={6 + 4 * s.node} fill={s.node > 0.1 ? v('inflame', 0.4 + 0.5 * s.node) : v('membrane', 0.55)} stroke={v('ink', selected === 'lymph-nodes' ? 1 : 0.3)} strokeWidth={selected === 'lymph-nodes' ? 2 : 1} data-node-index={i} />)}
        {label(560, 140, 'Retropharyngeal lymph nodes')}
        {showLabels && <line x1={556} y1={136} x2={bpX(140) + 32} y2={140} stroke={v('ink', 0.35)} />}
      </g>
      {microbes.map((m, i) => <circle key={i} cx={m.x} cy={m.y} r="2" fill={v('contents')} aria-hidden />)}
      {(s.phlegmon > 0.02 || s.abscess > 0.02) && (
        <g {...hit('collection')}>
          <ellipse cx={(wallX(190) + ALAR) / 2 + 6} cy={195} rx={Math.max(4, (ALAR - wallX(190)) / 2 - 8) * (0.4 + 0.6 * s.abscess) * pulse} ry={30 + 55 * s.abscess} fill={v('contents', 0.15 + 0.6 * s.abscess)} stroke={v('alert', 0.3 + 0.7 * s.abscess)} strokeWidth={sw('collection', 1 + 3 * s.abscess)} strokeDasharray={s.abscess < 0.5 ? '3 4' : undefined} />
          {label(560, 200, s.abscess > 0.5 ? 'Abscess (walled collection)' : 'Phlegmon (diffuse oedema)')}
          {showLabels && <line x1={556} y1={196} x2={ALAR - 4} y2={196} stroke={v('ink', 0.35)} />}
        </g>
      )}
      <g {...hit('alar-fascia')}><line x1={ALAR} y1={TOP} x2={ALAR} y2={BOTTOM} stroke={s.spread > 0.05 ? v('alert', 0.6) : v('membrane')} strokeWidth={sw('alar-fascia', 2)} strokeDasharray={s.spread > 0.3 ? '2 8' : undefined} />{label(560, 250, 'Alar fascia')}{showLabels && <line x1={556} y1={246} x2={ALAR} y2={246} stroke={v('ink', 0.35)} />}</g>
      <g {...hit('danger-space')}><rect x={ALAR + 1} y={TOP} width={PREV - ALAR - 2} height={BOTTOM - TOP} fill={s.spread > 0.02 ? v('inflame', 0.1 + 0.35 * s.spread) : v('panel', 0.6)} stroke={selected === 'danger-space' ? v('ink') : 'none'} strokeWidth="2" />{label(560, 300, 'Danger space (to mediastinum)')}{showLabels && <line x1={556} y1={296} x2={PREV - 6} y2={296} stroke={v('ink', 0.35)} />}</g>
      {spreadDots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r="3" fill={v('contents', 0.9)} aria-hidden />)}
      <g {...hit('prevertebral-fascia')}><line x1={PREV} y1={TOP} x2={PREV} y2={BOTTOM} stroke={v('membrane')} strokeWidth={sw('prevertebral-fascia', 2)} />{label(560, 340, 'Prevertebral fascia')}{showLabels && <line x1={556} y1={336} x2={PREV} y2={336} stroke={v('ink', 0.35)} />}</g>
      <g {...hit('cervical-spine')}>
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x={SPINE} y={TOP + 6 + i * 52} width="78" height="42" rx="6" fill={v('serosa', 0.75)} stroke={v('ink', selected === 'cervical-spine' ? 1 : 0.2)} strokeWidth={selected === 'cervical-spine' ? 2 : 1} />)}
        {label(SPINE + 39, TOP + 32, 'C2', 'middle')}{label(SPINE + 39, TOP + 32 + 52 * 5, 'C7', 'middle')}
        {label(SPINE + 90, 110, 'Cervical spine')}
      </g>
      <g {...hit('mediastinum')}>
        <rect x={150} y={FUSION + 44} width={340} height={BOTTOM - FUSION - 46} rx="8" fill={v('vessel', 0.08 + 0.3 * s.spread)} stroke={s.spread > 0.5 ? v('alert', 0.8) : v('membrane', 0.5)} strokeWidth={sw('mediastinum', 1.5)} strokeDasharray="6 4" />
        {label(160, BOTTOM - 10, s.spread > 0.3 ? 'Posterior mediastinum — possible spread (risk, not inevitable)' : 'Toward posterior mediastinum')}
      </g>
      {s.bulge > 0.2 && showLabels && <text x="20" y="200" fontSize="11" fill={v('alert')}>{s.airway < 0.75 ? 'Airway may narrow (varies)' : 'Posterior wall bulging'}</text>}
      <rect x="560" y="390" width="220" height="80" rx="10" fill={v('panel')} stroke={v('membrane', 0.5)} aria-hidden />
      <text x="572" y="410" fontSize="11" fontWeight="600" fill={v('ink')}>Relative airway patency (concept)</text>
      <rect x="572" y="420" width="196" height="10" rx="5" fill={v('membrane', 0.25)} />
      <rect x="572" y="420" width={196 * s.airway} height="10" rx="5" fill={s.airway > 0.8 ? v('fluid') : v('alert')} data-airway-bar />
      <text x="572" y="450" fontSize="10" fill={v('ink', 0.75)}>Schematic only — not a measurement,</text>
      <text x="572" y="463" fontSize="10" fill={v('ink', 0.75)}>not a CT, not one patient. ({minAir > 0 ? 'patent' : 'narrowed'})</text>
    </svg>
  );
}
