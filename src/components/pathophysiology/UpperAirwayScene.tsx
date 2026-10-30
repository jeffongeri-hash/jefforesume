import { useSearchParams } from 'react-router-dom';
import { STRUCTURES, sceneState, levelFor, type StructureId } from '@/data/pathophysiology/upperAirway';
import { Label, makeHit, Meter, pv } from './sceneKit';

type Props = { time: number; variant?: string; normal?: boolean; showLabels: boolean; selected: StructureId | null; onSelect: (id: StructureId) => void; compact?: boolean; title?: string };

// Anterior at left; midline sagittal airway above, separate branching/chest inset below.
export default function UpperAirwayScene({ time, variant, normal = false, showLabels, selected, onSelect, compact, title }: Props) {
  const [params] = useSearchParams();
  const s = sceneState(time, variant, normal, levelFor(params.get('level')), params.get('degree') === 'near-complete' ? 'near-complete' : 'partial');
  const hit = makeHit(STRUCTURES, selected, onSelect, compact);
  const label = (x: number, y: number, text: string, anchor: 'start' | 'end' | 'middle' = 'start') => <Label show={showLabels} x={x} y={y} anchor={anchor}>{text}</Label>;
  const line = (x1: number, y1: number, x2: number, y2: number) => showLabels && <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={pv('ink', 0.45)} />;
  const objectY = s.level === 'larynx' ? 278 : 372;
  const airPath = 'M 149 125 Q 222 105 275 132 L 301 162 L 301 223 Q 303 246 282 264 L 252 297 L 252 424';
  return <svg viewBox="0 0 720 650" role="group" aria-label={title ?? 'Illustrative sagittal airway: anterior left, posterior right; separate lungs inset'} className="patho-scene block h-auto w-full rounded-lg"
    data-condition={s.condition} data-patency={s.patency.toFixed(3)} data-subglottic={s.subglottic.toFixed(3)} data-supraglottic={s.supraglottic.toFixed(3)} data-object={s.object.toFixed(3)} data-level={s.level}>
    <title>{title ?? 'Conceptual upper-airway anatomy and obstruction'}</title>
    <desc>Not a scan, measurement or patient simulation. Swelling is shown at the subglottis in croup and supraglottis in epiglottitis. The generic foreign body can be placed at three levels.</desc>
    <rect width="720" height="650" fill={pv('bg')} />
    <text x="20" y="27" fontSize="12" fill={pv('ink')}>← Anterior · sagittal slice · Posterior →</text>
    <text x="20" y="47" fontSize="11" fill={pv('ink', 0.7)}>Illustrative pediatric proportions · not to scale</text>
    {/* Face profile and neck with an open cut surface, rather than a generic pipe. */}
    <path d="M 307 68 Q 201 58 158 95 L 157 117 L 111 147 Q 107 158 139 163 L 139 179 L 157 187 L 141 199 L 145 215 L 166 229 Q 165 257 191 271 L 205 305 L 193 430 L 390 430 L 386 116 Q 359 69 307 68 Z" fill={pv('serosa', 0.17)} stroke={pv('serosa', 0.65)} strokeWidth="2" />
    <g {...hit('nose')}><path d="M 143 139 L 166 123 Q 226 110 272 134 L 281 164 L 163 158 Z" fill={pv('fluid', 0.14)} stroke={pv('membrane')} strokeWidth="2" />{label(22, 102, 'Nasal cavity')}{line(114, 106, 183, 135)}</g>
    {/* Hard and soft palate divide the nasal and oral cavities. */}
    <path d="M 160 170 L 243 171 Q 270 171 275 195" fill="none" stroke={pv('serosa')} strokeWidth="7" strokeLinecap="round" />
    <g {...hit('tongue')}><path d="M 161 221 Q 179 184 229 193 Q 265 197 273 228 L 274 255 Q 231 273 209 248 L 178 236 Z" fill={pv('wall', 0.8)} stroke={pv('mucosa')} strokeWidth="2" />{label(24, 252, 'Tongue')}{line(87, 248, 219, 224)}</g>
    <g {...hit('pharynx')}><path d="M 286 122 Q 306 140 321 157 L 319 251 L 298 282" fill="none" stroke={pv('mucosa')} strokeWidth="7" /><path d="M 277 137 L 301 164 L 300 228 L 278 258" fill="none" stroke={pv('fluid', 0.2)} strokeWidth="27" />{label(449, 123, 'Pharynx')}{line(439, 119, 313, 190)}</g>
    <g {...hit('oesophagus')}><path d="M 308 279 Q 326 313 315 346 L 313 428" fill="none" stroke={pv('mucosa', 0.65)} strokeWidth="12" /><path d="M 308 279 Q 326 313 315 346 L 313 428" fill="none" stroke={pv('lumen')} strokeWidth="4" />{label(449, 403, 'Oesophagus (posterior)')}{line(439, 399, 316, 378)}</g>
    {/* Epiglottis rises from the anterior inlet behind the tongue; swelling broadens it. */}
    <g {...hit('epiglottis')}><path d={`M 247 288 Q ${274 + 17 * s.supraglottic} 264 ${286 + 14 * s.supraglottic} 230 Q ${278 + 10 * s.supraglottic} 214 274 230 Q ${259 - 14 * s.supraglottic} 260 247 288 Z`} fill={s.supraglottic > 0.02 ? pv('inflame', 0.8) : pv('mucosa')} stroke={pv('ink', 0.7)} strokeWidth="2" />
      <path d="M 306 250 L 286 284" stroke={s.supraglottic > 0 ? pv('inflame') : pv('mucosa')} strokeWidth={6 + 12 * s.supraglottic} strokeLinecap="round" />
      {label(449, 211, 'Epiglottis / supraglottis')}{line(439, 207, 281, 244)}</g>
    {/* Laryngeal framework outside the lumen; glottis is a level marker. */}
    <path d="M 218 277 L 208 301 L 220 321 M 280 282 L 285 308 L 279 322" stroke={pv('membrane')} strokeWidth="8" fill="none" />
    <g {...hit('glottis')}><path d="M 224 303 L 236 305 M 269 303 L 260 305" stroke={pv('mucosa')} strokeWidth="5" />{label(22, 300, 'Glottic level')}{line(118, 296, 226, 304)}</g>
    <g {...hit('trachea')}><path d="M 226 347 L 226 430 M 278 347 L 278 430" stroke={pv('mucosa')} strokeWidth="6" />
      {[358, 379, 400, 421].map(y => <path key={y} d={`M 219 ${y} L 229 ${y} M 274 ${y} L 283 ${y}`} stroke={pv('membrane')} strokeWidth="6" />)}
      {label(22, 403, 'Trachea')}{line(89, 399, 221, 394)}</g>
    <g {...hit('subglottis')}><path d="M 219 328 L 230 328 M 272 328 L 283 328" stroke={pv('membrane')} strokeWidth="12" />
      <path d={`M 229 318 Q ${231 + 16 * s.subglottic} 330 229 345 M 274 318 Q ${272 - 16 * s.subglottic} 330 274 345`} stroke={s.subglottic > 0.02 ? pv('inflame') : pv('mucosa')} strokeWidth={6 + 8 * s.subglottic} fill="none" />
      {label(449, 325, 'Subglottis / cricoid')}{line(439, 321, 282, 330)}</g>
    {/* Flow moves along a fixed anatomical route, with reduced downstream transport. */}
    <path d={airPath} fill="none" stroke={pv('fluid', 0.65)} strokeWidth="3" strokeDasharray="5 10" strokeDashoffset={-time * 13 * s.flow} aria-hidden />
    {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M 246 ${358 + ((time * 32 * s.flow + i * 14) % 62)} l 6 6 l 6 -6`} stroke={pv('fluid', s.level === 'bronchus' ? 0.9 : s.flow)} strokeWidth="2" fill="none" aria-hidden />)}
    {s.object > 0 && s.level !== 'bronchus' && <g {...hit('object')}><ellipse cx="253" cy={objectY} rx={8 + 15 * (1 - s.patency)} ry="12" fill={pv('contents')} stroke={pv('alert')} strokeWidth="2" opacity={s.object} />{label(449, objectY - 20, 'Object: selected level')}{line(439, objectY - 24, 267, objectY)}</g>}
    <line x1="20" y1="448" x2="700" y2="448" stroke={pv('membrane', 0.3)} />
    <text x="20" y="469" fontSize="11" fill={pv('ink', 0.8)}>Separate branching / breathing-effort inset · not sagittal anatomy</text>
    <g {...hit('chest')}>
      <path d="M 192 485 L 192 508 L 153 536 M 192 508 L 232 536" stroke={pv('membrane')} strokeWidth="13" fill="none" />
      <path d="M 153 509 Q 100 509 91 578 Q 112 616 170 594 L 170 544 Z M 232 509 Q 284 509 293 578 Q 271 616 215 594 L 215 544 Z" fill={pv('fluid', 0.15)} stroke={pv('membrane')} strokeWidth="2" />
      <path d="M 193 486 L 193 508 L 153 540 M 193 508 L 232 540" stroke={pv('fluid', s.flow)} strokeWidth="3" strokeDasharray="5 6" strokeDashoffset={-time * 20 * s.flow} fill="none" />
      <path d={`M 81 550 l ${13 * s.effort} 8 l ${-13 * s.effort} 8 M 302 550 l ${-13 * s.effort} 8 l ${13 * s.effort} 8`} stroke={pv('alert', s.effort)} strokeWidth="3" fill="none" />
      {label(20, 630, s.risk > 0.1 ? 'Possible fatigue ≠ improvement' : 'Retractions reflect pressure cost')}
    </g>
    {s.object > 0 && s.level === 'bronchus' && <g {...hit('object')}><ellipse cx="221" cy="529" rx="10" ry="8" fill={pv('contents')} stroke={pv('alert')} strokeWidth="2" /><path d="M 231 541 L 260 577" stroke={pv('fluid', s.flow)} strokeWidth="3" strokeDasharray="3 8" />{label(332, 496, 'Bronchial object: regional effect')}{line(322, 492, 224, 529)}</g>}
    <Meter x={350} y={535} w={310} label="Selected lumen patency · qualitative, not measured" value={s.patency} color={pv('fluid')} />
    <Meter x={350} y={574} w={310} label="Increased effort / regional ventilation burden" value={s.effort} color={pv('alert')} />
    <text x="350" y="610" fontSize="11" fill={pv('ink', 0.85)}>Normal saturation does not exclude deterioration.</text>
    <text x="350" y="629" fontSize="11" fill={pv('ink', 0.7)}>Risk branch only · not inevitable complete obstruction.</text>
  </svg>;
}