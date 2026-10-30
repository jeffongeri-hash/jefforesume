import { respiratoryState, STRUCTURES, scenarioFor, type RespiratoryCondition, type StructureId } from '@/data/pathophysiology/respiratory';
import { Label, makeHit, Meter, pv } from './sceneKit';
type Props = { condition: RespiratoryCondition; time: number; variant?: string; normal?: boolean; compact?: boolean; showLabels: boolean; selected: StructureId | null; onSelect: (id: StructureId) => void; title?: string };
export default function RespiratoryScene({ condition, time, variant, normal = false, compact, showLabels, selected, onSelect, title }: Props) {
  const s = respiratoryState(condition, time, variant, normal);
  const ph = condition === 'pulmonary-hypertension';
  const hit = makeHit(STRUCTURES, selected, onSelect, compact);
  const label = (x: number, y: number, t: string) => <Label show={showLabels} x={x} y={y}>{t}</Label>;
  const lumen = 37 * (1 - s.airwayNarrowing);
  const breathe = Math.sin(time * 2.7);
  const flowPath = 'M 167 95 L 167 162 Q 161 188 120 217 L 83 265';
  const vascularLumen = 24 * (1 - s.pvr * 0.62);
  return <svg viewBox="0 0 800 780" className="patho-scene block h-auto w-full rounded-lg" role="group" aria-label={title ?? 'Illustrative respiratory anatomy: anterior lungs and magnified airway, alveolar and RV cutaways'} data-condition={condition} data-scenario={s.scenario} data-narrowing={s.airwayNarrowing.toFixed(3)} data-muscle={s.muscle.toFixed(3)} data-trapping={s.trapping.toFixed(3)} data-collapse={s.collapse.toFixed(3)} data-pvr={s.pvr.toFixed(3)} data-downstream={s.downstreamPressure.toFixed(3)} data-rv-dilation={s.rvDilation.toFixed(3)} data-flow={s.airFlow.toFixed(3)}>
    <title>{title ?? 'Conceptual bronchi, bronchioles, alveoli and pulmonary circulation'}</title>
    <desc>Anterior lung orientation; patient right is image left. Magnified cross sections are separate teaching insets, not scans, measurements or an anatomically continuous slice. Motion follows the controlled lesson timeline.</desc>
    <rect width="800" height="780" fill={pv('bg')} />
    <text x="22" y="28" fontSize="13" fill={pv('ink')}>Anterior lungs · patient R ← → patient L</text>
    <text x="22" y="49" fontSize="11" fill={pv('ink', 0.7)}>Illustrative, not to scale · separate magnified cutaways</text>
    {/* Three-lobed right lung and two-lobed left lung with cardiac notch. */}
    <g transform={`translate(0 ${breathe * (1 + s.burden)})`}>
      <path d="M 135 90 Q 84 105 54 185 Q 24 280 41 329 Q 86 348 145 315 L 149 155 Z" fill={pv('serosa', 0.18)} stroke={pv('serosa')} strokeWidth="2" />
      <path d="M 196 90 Q 248 116 271 198 Q 289 269 275 327 Q 239 339 207 314 L 204 275 Q 170 254 188 221 L 185 153 Z" fill={pv('serosa', 0.18)} stroke={pv('serosa')} strokeWidth="2" />
      <path d="M 52 225 L 133 220 M 48 305 Q 87 258 133 198 M 209 185 L 276 301" stroke={pv('membrane', 0.65)} fill="none" />
      <path d={`M 35 ${348 + s.trapping * 15} Q 154 ${320 + s.trapping * 32} 278 ${348 + s.trapping * 15}`} stroke={pv('membrane')} strokeWidth="3" fill="none" />
      <g {...hit('bronchi')}>
        <path d="M 167 82 L 167 164 M 167 164 L 112 212 M 167 164 L 224 212" stroke={pv('mucosa')} strokeWidth="19" fill="none" strokeLinecap="round" />
        <path d="M 167 82 L 167 164 M 167 164 L 112 212 M 167 164 L 224 212" stroke={pv('bg')} strokeWidth={11 * (1 - s.airwayNarrowing * 0.55)} fill="none" />
        {[97, 116, 135, 154].map(y => <path key={y} d={`M 157 ${y} L 177 ${y}`} stroke={pv('membrane')} strokeWidth="2" />)}
        {label(27, 78, 'Trachea → bronchi')}
      </g>
      <g {...hit('bronchiole')}>
        {['M 112 212 L 81 257 L 66 283 M 81 257 L 117 282 M 112 212 L 120 245 L 144 276', 'M 224 212 L 246 254 L 265 280 M 246 254 L 223 282 M 224 212 L 201 241 L 211 264'].map((d, i) => <path key={i} d={d} fill="none" stroke={pv('mucosa')} strokeWidth={7 + s.edema * 4} strokeLinecap="round" />)}
        {label(35, 375, 'Small-airway tree')}
      </g>
      <path d={flowPath} stroke={pv('fluid', s.airFlow)} strokeWidth="3" fill="none" strokeDasharray="5 8" strokeDashoffset={-time * 24 * s.airFlow} />
      {s.cause > 0 && !ph && <g aria-hidden opacity={s.cause}>{[0, 1, 2, 3, 4].map(i => <circle key={i} cx={61 + i * 17} cy={265 + i % 2 * 20} r="4" fill={pv('inflame')} />)}</g>}
    </g>
    <path d="M 289 200 L 328 184" stroke={pv('ink', 0.5)} strokeDasharray="4 4" />
    <text x="332" y="79" fontSize="13" fill={pv('ink')}>{condition === 'bronchiolitis' ? 'Small bronchiole cross-section' : 'Conducting airway cross-section'}</text>
    <g {...hit('muscle')}>
      <circle cx="437" cy="187" r={67 - s.muscle * 8} fill={pv('wall', 0.3)} stroke={pv('wall')} strokeWidth={8 + s.muscle * 7} />
      {Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return <ellipse key={i} cx={437 + Math.cos(a) * 64} cy={187 + Math.sin(a) * 64} rx="7" ry="3" transform={`rotate(${i * 30 + 90} ${437 + Math.cos(a) * 64} ${187 + Math.sin(a) * 64})`} fill={s.muscle ? pv('inflame') : pv('wall')} />; })}
      {label(535, 118, 'Smooth muscle')}
    </g>
    <g {...hit('mucus')}>
      <circle cx="437" cy="187" r="50" fill={pv('mucosa', 0.55)} stroke={pv('inflame', s.edema)} strokeWidth={3 + s.edema * 12} />
      <circle cx="437" cy="187" r={lumen} fill={pv('bg')} stroke={pv('fluid')} strokeWidth="2" />
      {s.mucus > 0 && <path d={`M ${437 - lumen} 187 Q 423 ${173 - s.mucus * 20} 443 184 Q 453 ${183 + s.mucus * 27} ${437 + lumen} 190 Q 438 201 ${437 - lumen} 187`} fill={pv('contents')} opacity={s.mucus} />}
      {label(535, 157, 'Edema / mucus / debris')}
    </g>
    <g {...hit('bronchiole')}><circle cx="437" cy="187" r="76" fill="none" stroke={pv('ink', 0.01)} strokeWidth="10" />{label(535, 200, 'Remaining lumen')}</g>
    <text x="332" y="295" fontSize="11" fill={pv('ink', 0.8)}>{ph ? 'Airway remains patent in this vascular example' : condition === 'bronchiolitis' ? 'Edema + sloughed cells; not muscle spasm' : condition === 'copd-exacerbation' ? 'Baseline limitation + acute change' : 'Contraction + edema + mucus'}</text>
    <line x1="22" y1="397" x2="778" y2="397" stroke={pv('ink', 0.2)} />
    <text x="22" y="421" fontSize="13" fill={pv('ink')}>Alveolar inset</text>
    <text x="22" y="438" fontSize="11" fill={pv('ink', 0.7)}>Separate gas / blood compartments</text>
    <g {...hit('alveoli')}>
      <path d="M 110 443 L 110 474 M 110 474 L 63 514 M 110 474 L 159 514" stroke={pv('mucosa')} strokeWidth="13" fill="none" />
      {[[62, 532], [94, 559], [145, 555], [171, 529]].map(([x, y], i) => {
        const radius = 24 * (i < 2 ? 1 + s.trapping * 0.45 : 1 - s.collapse * 0.55);
        return <g key={i}><circle cx={x} cy={y} r={radius} fill={pv('fluid', 0.1 + (1 - s.mismatch) * 0.16)} stroke={pv('mucosa')} strokeWidth="3" />
          {!s.emphysema && <path d={`M ${x - radius * 0.7} ${y} Q ${x} ${y - 8} ${x + radius * 0.7} ${y}`} stroke={pv('membrane', 0.6)} fill="none" />}
          <path d={`M ${x - radius} ${y + 10} Q ${x} ${y + radius + 13} ${x + radius} ${y + 10}`} stroke={pv('vessel')} strokeWidth={5 * (1 - s.emphysema * 0.6)} fill="none" />
          <circle cx={x + Math.sin(time * s.forwardFlow * 2 + i) * radius * 0.7} cy={y + radius + 5} r="3" fill={pv('rbc')} />
        </g>;
      })}
      {s.emphysema > 0 && <path d="M 79 540 Q 118 501 151 536 Q 164 584 103 589 Q 67 585 79 540" fill={pv('bg', 0.5)} stroke={pv('alert')} strokeWidth="2" />}
      {label(22, 626, s.emphysema > 0 ? 'Recoil / surface loss (baseline)' : s.collapse > 0 ? 'Trapped units + collapsed units' : 'Regional ventilation / perfusion')}
    </g>
    <text x="270" y="421" fontSize="13" fill={pv('ink')}>Pulmonary arteriole cutaway</text>
    <g {...hit('vessel')}>
      <path d="M 272 483 L 456 483 M 272 557 L 456 557" stroke={pv('wall')} strokeWidth={10 + s.pvr * 9} />
      <path d={`M 272 ${520 - vascularLumen} L 456 ${520 - vascularLumen} M 272 ${520 + vascularLumen} L 456 ${520 + vascularLumen}`} stroke={pv('mucosa')} strokeWidth="4" />
      <path d="M 276 520 L 452 520" stroke={pv('vein', s.forwardFlow)} strokeWidth="4" strokeDasharray="8 12" strokeDashoffset={-time * 24 * s.forwardFlow} />
      {ph && s.scenario === 'cteph' && s.cause > 0 && <path d="M 300 488 L 348 512 L 324 542 L 300 552 Z" fill={pv('contents')} opacity={s.cause} />}
      {ph && s.scenario === 'lung-hypoxia' && <path d="M 287 579 L 445 579" stroke={pv('alert', s.cause)} strokeWidth="4" />}
      {label(270, 604, s.downstreamPressure > 0 ? 'Downstream filling pressure ↑' : s.pvr > 0 ? 'Resistance / vascular load ↑' : 'No vascular narrowing modeled')}
    </g>
    {/* Separate short-axis-informed ventricular cutaway: crescent RV wrapping LV. */}
    <text x="512" y="421" fontSize="13" fill={pv('ink')}>Separate ventricular cutaway</text>
    <g {...hit('rv')}>
      <path d={`M 648 461 Q ${516 - s.rvDilation * 18} 447 ${523 - s.rvDilation * 15} 535 Q 540 ${638 + s.rvDilation * 15} 679 600 Q 601 594 592 536 Q 591 482 648 461 Z`} fill={pv('vein', 0.25)} stroke={pv('vein')} strokeWidth={5 + s.rvHypertrophy * 9} />
      {label(515, 661, ph && !normal ? 'RV: pressure load → adaptation' : 'RV: reference chamber')}
    </g>
    <g {...hit('lv')}>
      <path d={`M 670 465 Q 739 492 721 559 Q 702 619 647 592 Q ${582 + s.rvDilation * 22} 560 ${605 + s.rvDilation * 20} 509 Q 626 464 670 465 Z`} fill={pv('wall', 0.35)} stroke={pv('wall')} strokeWidth="17" />
      <path d={`M ${611 + s.rvDilation * 20} 500 Q ${588 + s.rvDilation * 24} 548 642 589`} stroke={pv('mucosa')} strokeWidth="6" fill="none" />
      {label(665, 636, 'LV / septum')}
    </g>
    <path d="M 562 474 L 548 446 L 479 446" stroke={pv('vein')} strokeWidth="5" fill="none" />
    <text x="512" y="685" fontSize="11" fill={pv('ink', 0.8)}>{ph ? (s.risk > 0 ? 'Possible dilation / filling loss / congestion' : 'Chronic remodeling, not an acute clock') : 'RV pathology not assumed in this example'}</text>
    <Meter x={24} y={726} w={200} label={ph ? 'Forward-flow concept' : 'Airflow concept'} value={ph ? s.forwardFlow : s.airFlow} color={pv('fluid')} />
    <Meter x={278} y={726} w={200} label={ph ? 'RV loading concept' : 'Air trapping concept'} value={ph ? s.vascularLoad : s.trapping} color={pv('alert')} />
    <text x="24" y="763" fontSize="11" fill={pv('ink', 0.7)}>Qualitative illustration only · {normal ? 'Healthy reference' : scenarioFor(condition, variant).label} · risk outcomes vary</text>
  </svg>;
}
