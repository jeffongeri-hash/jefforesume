import { ectopicState, STRUCTURES, type StructureId } from '@/data/pathophysiology/ectopicPregnancy';
import { Label, makeHit, pv } from './sceneKit';
type Props = { time: number; normal?: boolean; compact?: boolean; showLabels: boolean; selected: StructureId | null; onSelect: (id: StructureId) => void; title?: string };

export default function EctopicPregnancyScene({ time, normal = false, compact, showLabels, selected, onSelect, title }: Props) {
  const s = ectopicState(time, normal);
  const hit = makeHit(STRUCTURES, selected, onSelect, compact);
  const label = (x: number, y: number, text: string) => <Label show={showLabels} x={x} y={y}>{text}</Label>;
  const radius = 10 + s.distension * 10;
  return <svg viewBox="0 0 800 760" className="patho-scene block h-auto w-full rounded-lg" role="group" aria-label={title ?? 'Illustrative frontal pelvic cutaway: tubal ectopic pregnancy and possible hemorrhage'} data-implant={s.implant.toFixed(3)} data-invasion={s.invasion.toFixed(3)} data-rupture={s.rupture.toFixed(3)} data-blood={s.blood.toFixed(3)} data-flow={s.forwardFlow.toFixed(3)}>
    <title>{title ?? 'Ectopic pregnancy: pelvic anatomy and a possible rupture branch'}</title>
    <desc>Frontal uterine cutaway, patient right at image left. Paired ovaries remain separate from fimbriae. One ampulla is opened to illustrate implantation. Separate wall and diaphragm insets are enlarged and not anatomically continuous. Shapes and blood extent are conceptual, not scans or patient measurements. Motion follows the controlled timeline.</desc>
    <rect width="800" height="760" fill={pv('bg')} />
    <text x="24" y="29" fontSize="14" fill={pv('ink')}>Frontal pelvis · patient R ← → patient L</text>
    <text x="24" y="50" fontSize="12" fill={pv('ink', 0.75)}>Illustrative cutaway · ampullary example · not to scale</text>
    <g {...hit('peritoneum')}>
      <path d="M 96 107 Q 400 57 704 107 Q 749 224 697 342 Q 610 430 400 445 Q 190 430 103 342 Q 51 224 96 107 Z" fill={pv('serosa', 0.08)} stroke={pv('serosa', 0.7)} strokeWidth="2" strokeDasharray="5 6" />
      {s.blood > 0 && <path d={`M ${142 - s.blood * 25} ${373 - s.blood * 50} Q 248 ${365 - s.blood * 20} 319 384 Q 395 402 462 382 Q 565 ${365 - s.blood * 25} ${658 + s.blood * 25} ${373 - s.blood * 50} Q 614 431 400 440 Q 186 431 ${142 - s.blood * 25} ${373 - s.blood * 50} Z`} fill={pv('rbc', 0.3 + s.blood * 0.25)} stroke={pv('rbc')} strokeWidth="2" />}
      {label(34, 401, 'Peritoneal cavity')}
    </g>
    <g {...hit('uterus')}>
      <path d="M 319 169 Q 400 130 481 169 Q 514 214 475 278 Q 436 325 424 363 L 424 391 Q 400 413 376 391 L 376 363 Q 364 325 325 278 Q 286 214 319 169 Z" fill={pv('wall', 0.7)} stroke={pv('wall')} strokeWidth="3" />
      <path d="M 388 352 L 388 390 Q 400 401 412 390 L 412 352" fill={pv('mucosa', 0.25)} stroke={pv('mucosa')} strokeWidth="2" />
      {label(473, 307, 'Uterus / cervix')}
    </g>
    <g {...hit('endometrium')}>
      <path d="M 340 186 Q 400 201 460 186 Q 437 225 410 248 L 406 350 L 394 350 L 390 248 Q 363 225 340 186 Z" fill={pv('mucosa', 0.6)} stroke={pv('mucosa')} strokeWidth="5" />
      <path d="M 347 188 Q 400 216 453 188 M 400 215 L 400 350" stroke={pv('bg')} strokeWidth="5" fill="none" />
      {label(365, 289, 'Endometrium')}
    </g>
    <g {...hit('tube')}>
      {['M 337 187 C 301 146 290 107 245 132 S 139 182 159 224', 'M 463 187 C 499 146 510 107 555 132 S 661 182 641 224'].map((d, i) => <g key={d}>
        <path d={d} fill="none" stroke={pv('wall')} strokeWidth={i === 0 ? 22 + s.distension * 8 : 22} strokeLinecap="round" />
        <path d={d} fill="none" stroke={pv('mucosa')} strokeWidth="12" strokeLinecap="round" />
        <path d={d} fill="none" stroke={pv('bg')} strokeWidth="5" />
      </g>)}
      {[0, 1, 2, 3, 4].map(i => <g key={i}><path d={`M 159 216 Q ${136 + i * 9} 222 ${133 + i * 12} ${239 + (i % 2) * 7}`} fill="none" stroke={pv('mucosa')} strokeWidth="4" /><path d={`M 641 216 Q ${664 - i * 9} 222 ${667 - i * 12} ${239 + (i % 2) * 7}`} fill="none" stroke={pv('mucosa')} strokeWidth="4" /></g>)}
      {label(71, 92, 'Tube: ampulla → isthmus')}
      {label(55, 264, 'Fimbriae (open end)')}
      {label(552, 92, 'Opposite tube')}
    </g>
    <g {...hit('ovary')}>
      {[[193, 266], [607, 266]].map(([x, y]) => <g key={x}><ellipse cx={x} cy={y} rx="35" ry="22" transform={`rotate(${x < 400 ? -25 : 25} ${x} ${y})`} fill={pv('serosa', 0.4)} stroke={pv('serosa')} strokeWidth="3" />{[0, 1, 2].map(i => <circle key={i} cx={x - 17 + i * 15} cy={y + (i % 2) * 5} r={5 + i} fill={pv('fluid', 0.25)} stroke={pv('membrane')} />)}</g>)}
      <path d="M 226 259 L 321 234 M 574 259 L 479 234" stroke={pv('membrane', 0.6)} strokeWidth="3" />
      {label(145, 313, 'Ovary (separate from tube)')}
      {label(579, 313, 'Ovary')}
    </g>
    <g {...hit('vessels')}>
      <path d="M 281 324 Q 279 207 306 171 Q 280 128 231 153 M 281 260 L 331 249 M 519 324 Q 521 207 494 171 Q 520 128 569 153 M 519 260 L 469 249" fill="none" stroke={pv('vessel')} strokeWidth="5" />
      <path d="M 278 316 Q 276 207 300 171 Q 274 135 230 159" fill="none" stroke={pv('rbc')} strokeWidth="2" strokeDasharray="6 10" strokeDashoffset={-time * 22 * s.forwardFlow} />
      {label(42, 345, 'Tubal vascular branches')}
    </g>
    <g {...hit('site')}>
      <g opacity={s.normalImplant}><circle cx="421" cy="223" r="10" fill={pv('contents')} stroke={pv('alert')} strokeWidth="2" />{[0, 1, 2, 3].map(i => <circle key={i} cx={417 + i % 2 * 6} cy={220 + Math.floor(i / 2) * 6} r="2" fill={pv('mucosa')} />)}</g>
      <ellipse cx="239" cy="142" rx={radius * 1.5} ry={radius} fill={pv('bg')} stroke={pv('inflame', s.implant)} strokeWidth={2 + s.invasion * 4} opacity={s.implant} />
      <circle cx="239" cy="141" r={6 + s.invasion * 5} fill={pv('contents')} stroke={pv('alert')} strokeWidth="2" opacity={s.implant} />
      {[0, 1, 2, 3, 4].map(i => { const a = i * Math.PI / 3; return <path key={i} d={`M ${239 + Math.cos(a) * 8} ${141 + Math.sin(a) * 8} L ${239 + Math.cos(a) * (12 + s.invasion * 11)} ${141 + Math.sin(a) * (12 + s.invasion * 11)}`} stroke={pv('inflame')} strokeWidth="3" opacity={s.invasion} />; })}
      {label(316, 108, s.implant > 0 ? 'Tubal implantation site' : 'Endometrial implantation')}
      {s.rupture > 0 && <><path d="M 228 158 L 233 165 L 242 159 L 249 165" fill="none" stroke={pv('bg')} strokeWidth={s.rupture * 8} /><path d="M 239 166 Q 213 258 261 371" fill="none" stroke={pv('rbc', s.rupture)} strokeWidth="4" strokeDasharray="4 10" strokeDashoffset={-time * 28} /></>}
    </g>
    <text x="24" y="476" fontSize="13" fill={pv('ink')}>Separate enlarged tubal wall inset</text>
    <g {...hit('site')}>
      <path d="M 28 524 Q 153 498 323 523 L 323 623 Q 153 602 28 625 Z" fill={pv('wall', 0.45)} stroke={pv('wall')} strokeWidth="2" />
      <path d="M 28 528 Q 153 510 323 527" stroke={pv('mucosa')} strokeWidth="9" fill="none" />
      <path d="M 37 594 C 109 562 204 609 314 578" fill="none" stroke={pv('vessel')} strokeWidth="7" />
      <ellipse cx="166" cy={518 - s.distension * 6} rx={20 + s.distension * 15} ry={11 + s.distension * 6} fill={pv('contents')} opacity={s.implant} />
      {[0, 1, 2, 3, 4].map(i => <path key={i} d={`M ${143 + i * 11} 525 Q ${155 + i * 6} ${538 + s.invasion * 22} ${138 + i * 14} ${534 + s.invasion * (55 + i % 2 * 15)}`} fill="none" stroke={pv('inflame')} strokeWidth={3 + s.invasion * 3} opacity={s.invasion} />)}
      {s.rupture > 0 && <path d="M 175 540 L 161 559 L 179 580 L 163 604 L 176 620" fill="none" stroke={pv('bg')} strokeWidth={2 + s.rupture * 10} opacity={s.rupture} />}
      {label(28, 657, s.rupture > 0 ? 'Possible wall / vessel breach' : s.invasion > 0 ? 'Trophoblast invades tissue / vessels' : 'Lumen → mucosa → muscular wall')}
    </g>
    <text x="405" y="476" fontSize="13" fill={pv('ink')}>Separate diaphragm / shoulder inset</text>
    <g {...hit('diaphragm')}>
      <path d="M 410 558 Q 455 506 510 517 Q 553 504 599 558" fill="none" stroke={pv('membrane')} strokeWidth="5" />
      <path d="M 425 577 Q 503 543 584 577" stroke={pv('rbc', s.blood)} strokeWidth={3 + s.blood * 8} fill="none" />
      <path d="M 553 517 Q 578 487 611 521 Q 623 540 660 531" stroke={pv('nerve', s.blood)} strokeWidth="3" fill="none" strokeDasharray="4 5" strokeDashoffset={-time * 10} />
      <path d="M 676 493 Q 651 509 659 532 Q 689 550 711 527 L 721 576 M 676 493 L 687 487" stroke={pv('serosa')} strokeWidth="5" fill="none" />
      {label(407, 612, 'Blood may irritate diaphragm')}
      {label(587, 648, 'C3–C5 → shoulder tip')}
    </g>
    <text x="24" y="701" fontSize="12" fill={pv('ink')}>{normal || s.implant === 0 ? 'Normal implantation reference' : s.rupture === 0 ? 'Tubal ectopic example · rupture is not inevitable' : 'Possible complication branch · blood extent is not a volume estimate'}</text>
    <text x="24" y="728" fontSize="12" fill={pv('ink', 0.75)}>{s.perfusionRisk > 0 ? 'Volume loss may reduce venous return → cardiac output → tissue perfusion' : 'Teaching phases are not a disease clock or an ultrasound'}</text>
  </svg>;
}