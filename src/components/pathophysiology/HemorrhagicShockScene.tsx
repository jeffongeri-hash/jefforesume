import { useId } from 'react';
import { STRUCTURES, hemorrhagicState, type StructureId } from '@/data/pathophysiology/hemorrhagicShock';
import { Label, Meter, makeHit, pv } from './sceneKit';

type Props = { time: number; normal?: boolean; showLabels: boolean; selected: StructureId | null; onSelect: (id: StructureId) => void; compact?: boolean; title?: string };
const organStroke = (selected: boolean) => selected ? 3 : 1.5;

export default function HemorrhagicShockScene({ time, normal = false, showLabels, selected, onSelect, compact, title }: Props) {
  const s = hemorrhagicState(time, normal);
  const hit = makeHit(STRUCTURES, selected, onSelect, compact);
  const uid = useId().replace(/:/g, '');
  const pulse = Math.sin(time * 5 * s.pulseRate) * 0.025;
  const oxygen = pv('rbc');
  const venous = pv('fluid');
  const outlined = (id: StructureId) => ({ stroke: pv('ink', selected === id ? 1 : 0.55), strokeWidth: organStroke(selected === id) });
  return <svg viewBox="0 0 800 680" role="img" aria-label={title ?? 'Illustrative anterior circulation and separate tissue inset in hemorrhagic shock'} className="block h-auto w-full rounded-lg patho-scene" style={{ background: pv('bg') }}
    data-filling={s.filling.toFixed(3)} data-flow={s.forwardFlow.toFixed(3)} data-tone={s.vesselTone.toFixed(3)} data-bleeding={s.hemorrhage.toFixed(3)} data-dysfunction={s.dysfunction.toFixed(3)} data-pressure-support={s.pressureSupport.toFixed(3)}>
    <defs>
      <marker id={`${uid}-red`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10Z" fill={oxygen} /></marker>
      <marker id={`${uid}-blue`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10Z" fill={venous} /></marker>
    </defs>
    <text x="20" y="25" fontSize="12" fill={pv('ink', 0.8)}>Illustrative anterior anatomy · not to scale · no patient values</text>
    <text x="20" y="46" fontSize="11" fill={pv('ink', 0.65)}>Patient’s right ←  |  → Patient’s left</text>
    {/* Torso orientation, with organs intentionally simplified. */}
    <path d="M182 134 Q125 149 105 195 L82 310 Q105 348 114 426 L134 543 Q243 566 357 543 L375 422 Q382 343 408 310 L390 195 Q370 149 315 134 L299 115 L199 115Z" fill={pv('panel', 0.4)} stroke={pv('ink', 0.18)} strokeWidth="2" />
    <g {...hit('brain')}>
      <path d="M209 77 C195 67 186 89 194 102 C180 122 194 145 211 143 C221 159 245 150 249 141 C264 153 287 146 288 130 C307 124 306 99 292 94 C292 75 271 68 257 78 C244 62 222 63 209 77Z" fill={pv(s.dysfunction > 0.1 ? 'alert' : 'membrane', 0.45)} {...outlined('brain')} />
      <path d="M249 79 L249 142 M208 96 Q224 88 237 103 M203 125 Q222 109 237 128 M263 98 Q285 96 284 113 M259 127 Q274 113 288 128" fill="none" stroke={pv('ink', 0.35)} strokeWidth="2" />
      <Label show={showLabels} x={325} y={98}>Brain</Label>
    </g>
    <g {...hit('lungs')}>
      <path d="M217 158 C192 153 153 183 139 227 C130 257 131 291 152 300 L205 293 C215 285 218 251 217 158Z" fill={pv('serosa', 0.32)} {...outlined('lungs')} />
      <path d="M275 158 C302 153 340 183 351 226 C363 258 364 286 342 300 L293 295 C280 283 275 246 275 158Z" fill={pv('serosa', 0.32)} {...outlined('lungs')} />
      <path d="M246 154 L246 194 M246 194 L181 244 M246 194 L315 244" fill="none" stroke={pv('mucosa', 0.65)} strokeWidth="6" />
      <Label show={showLabels} x={112} y={182}>Lungs</Label>
    </g>
    {/* Closed systemic return and outflow; arrows show direction, dots show changing flow. */}
    <g {...hit('veins')}>
      <path d="M220 136 L220 202 M159 480 L159 369 Q159 345 216 294" fill="none" stroke={venous} strokeWidth={8 * s.filling + 4} markerEnd={`url(#${uid}-blue)`} opacity="0.8" />
      {[0, 1, 2, 3].map(i => <circle key={i} cx="159" cy={475 - ((i / 4 + time * 0.14 * s.forwardFlow) % 1) * 105} r="3" fill={pv('ink', 0.8)} />)}
      <Label show={showLabels} x={32} y={389}>Venous return ↑</Label>
    </g>
    <g {...hit('arteries')}>
      <path d="M284 282 Q286 224 312 240 Q329 251 329 292 L329 492 M314 242 L278 150" fill="none" stroke={oxygen} strokeWidth={12 - s.vesselTone * 4} markerEnd={`url(#${uid}-red)`} opacity="0.85" />
      {[0, 1, 2, 3, 4].map(i => <circle key={i} cx="329" cy={315 + ((i / 5 + time * 0.14 * s.forwardFlow) % 1) * 158} r="3" fill={pv('ink', 0.8)} />)}
      <Label show={showLabels} x={349} y={334}>Aorta ↓</Label>
      <path d="M329 495 Q245 533 159 480" fill="none" stroke={pv('vessel', 0.6)} strokeWidth={9 - s.vesselTone * 4} />
      <Label show={showLabels} x={244} y={553} anchor="middle">Systemic resistance vessels</Label>
    </g>
    {/* Pulmonary circuit is separate from systemic circulation. */}
    <path d="M235 270 Q238 238 194 222 M237 239 Q278 211 310 220" fill="none" stroke={venous} strokeWidth="5" markerEnd={`url(#${uid}-blue)`} />
    <path d="M184 267 Q229 241 265 258 M314 266 L283 257" fill="none" stroke={oxygen} strokeWidth="5" markerEnd={`url(#${uid}-red)`} />
    <g {...hit('heart')} transform={`translate(255 290) scale(${1 + pulse}) translate(-255 -290)`}>
      <path d="M246 245 C225 222 198 246 202 275 C194 306 220 334 271 365 C291 347 310 305 302 279 C300 250 279 237 264 249Z" fill={pv('wall', 0.75)} {...outlined('heart')} />
      <path d="M213 253 Q230 240 244 253 L242 276 L214 279Z" fill={venous} opacity={s.filling} />
      <path d="M213 286 L244 284 L254 342 Q215 320 213 286Z" fill={venous} opacity={s.filling} />
      <path d="M263 259 Q285 245 291 272 L264 276Z" fill={oxygen} opacity={s.filling} />
      <path d="M264 285 L289 283 Q298 310 272 349 L258 294Z" fill={oxygen} opacity={s.filling} />
      <path d="M248 254 L252 283 L260 343" fill="none" stroke={pv('mucosa', 0.8)} strokeWidth="4" />
      <text x="221" y="268" fontSize="10" fill={pv('ink')}>RA</text><text x="224" y="310" fontSize="10" fill={pv('ink')}>RV</text><text x="273" y="271" fontSize="10" fill={pv('ink')}>LA</text><text x="270" y="315" fontSize="10" fill={pv('ink')}>LV</text>
    </g>
    <Label show={showLabels} x={245} y={386} anchor="middle">Heart · symbolic filling</Label>
    <g {...hit('kidneys')}>
      <path d="M193 406 C167 398 173 447 191 450 C214 454 216 433 200 431 C188 429 211 413 193 406Z" fill={pv(s.dysfunction > 0.1 ? 'alert' : 'contents', 0.5)} {...outlined('kidneys')} />
      <path d="M291 406 C317 398 311 447 293 450 C270 454 268 433 284 431 C296 429 273 413 291 406Z" fill={pv(s.dysfunction > 0.1 ? 'alert' : 'contents', 0.5)} {...outlined('kidneys')} />
      <path d="M329 419 L304 425 M181 425 L159 419" stroke={pv('vessel')} strokeWidth={5 - s.vesselTone * 2} />
      <Label show={showLabels} x={239} y={468} anchor="middle">Kidneys</Label>
    </g>
    <g {...hit('bleed')}>
      <path d="M330 356 Q393 360 425 390" fill="none" stroke={oxygen} strokeWidth="7" />
      <path d="M425 381 L425 399" stroke={pv('bg')} strokeWidth={2 + s.hemorrhage * 5} />
      {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={432 + (i % 3) * 13} cy={406 + Math.floor(i / 3) * 17 + Math.sin(time + i) * 3} rx="5" ry="7" fill={oxygen} opacity={s.hemorrhage} />)}
      <ellipse cx="448" cy="467" rx={28 * s.hemorrhage} ry={9 * s.hemorrhage} fill={pv('rbc', 0.65)} />
      <Label show={showLabels} x={390} y={494}>Vessel breach</Label>
    </g>
    {/* Separate microscopic inset: avoids implying real anatomic continuity. */}
    <g {...hit('tissue')}>
      <rect x="506" y="82" width="274" height="367" rx="6" fill={pv('panel', 0.65)} {...outlined('tissue')} />
      <text x="520" y="106" fontSize="12" fontWeight="600" fill={pv('ink')}>Separate tissue / capillary inset</text>
      <text x="520" y="125" fontSize="11" fill={pv('ink', 0.7)}>Conceptual · not a microscopic image</text>
      {[0, 1, 2].map(i => <g key={i}>
        <path d={`M524 ${160 + i * 72} Q645 ${143 + i * 72} 760 ${160 + i * 72}`} fill="none" stroke={pv('vessel', 0.6)} strokeWidth={10 - 4 * s.vesselTone} />
        {Array.from({ length: 6 }, (_, k) => <ellipse key={k} cx={527 + ((k / 6 + time * 0.12 * s.forwardFlow) % 1) * 227} cy={160 + i * 72} rx="6" ry="3" fill={pv('rbc', 0.45 + s.oxygenDelivery * 0.55)} />)}
        {[0, 1, 2, 3].map(k => <g key={k}>
          <ellipse cx={548 + k * 58} cy={197 + i * 72} rx="21" ry="17" fill={pv(s.dysfunction > 0.1 ? 'alert' : 'membrane', 0.18 + s.dysfunction * 0.35)} stroke={pv('ink', 0.35)} />
          <ellipse cx={548 + k * 58} cy={197 + i * 72} rx="7" ry="4" fill={pv('serosa', 0.65)} />
          <circle cx={548 + k * 58} cy={175 + i * 72 + ((time * 0.3 + k / 4) % 1) * 16} r="2" fill={pv('fluid')} opacity={s.oxygenDelivery} />
        </g>)}
      </g>)}
      <text x="521" y="393" fontSize="12" fill={pv('ink')}>Flow × arterial O₂ content → delivery</text>
      <text x="521" y="415" fontSize="11" fill={pv('ink', 0.7)}>Extraction reserve varies; ATP failure is possible</text>
      <text x="521" y="434" fontSize="11" fill={pv('ink', 0.7)}>Preserved saturation ≠ adequate delivery</text>
    </g>
    <text x="510" y="480" fontSize="12" fill={pv('ink')}>{s.sympathetic > 0.2 ? 'Sympathetic drive: pulse / vascular tone ↑' : 'Venous return supports cardiac filling'}</text>
    <text x="510" y="503" fontSize="12" fill={pv('ink')}>{s.dysfunction > 0.1 ? 'Possible loss of perfusion reserve' : 'Pressure can remain supported despite lower flow'}</text>
    <text x="510" y="527" fontSize="11" fill={pv('ink', 0.7)}>Selected deterioration branch · not inevitable</text>
    <line x1="20" y1="575" x2="780" y2="575" stroke={pv('ink', 0.2)} />
    <text x="20" y="596" fontSize="11" fill={pv('ink', 0.7)}>Relative teaching indicators — not measured values, percentages or clinical thresholds</text>
    <Meter x={20} y={625} w={165} label="Ventricular filling" value={s.filling} color={venous} />
    <Meter x={215} y={625} w={165} label="Stroke volume" value={s.strokeVolume} color={oxygen} />
    <Meter x={410} y={625} w={165} label="Vascular tone increase" value={s.vesselTone} color={pv('wall')} />
    <Meter x={605} y={625} w={165} label="Tissue O₂ delivery" value={s.oxygenDelivery} color={pv('serosa')} />
    <text x="20" y="663" fontSize="11" fill={pv('ink', 0.7)}>Phases separate overlapping mechanisms; animation seconds are not a clinical clock.</text>
  </svg>;
}