import { STRUCTURES, state, type EndocrineKind, type Structure } from '@/data/pathophysiology/endocrineEmergencies';
import FlowParticles from './FlowParticles';
import { makeHit, Meter, pv } from './sceneKit';

export type EndocrineSceneProps = {
  time: number; normal?: boolean; compact?: boolean; showLabels: boolean;
  selected: Structure | null; onSelect: (id: Structure) => void; title?: string; kind: EndocrineKind;
};

export default function EndocrineEmergencyScene({time, normal, compact, showLabels, selected, onSelect, title, kind}: EndocrineSceneProps) {
  const t = normal ? 0 : time;
  const s = state(kind, t);
  const hit = makeHit(STRUCTURES, selected, onSelect, compact);
  const hhs = kind === 'hhs';
  const hypo = kind === 'hypoglycemia';
  const label = hhs ? 'Hyperosmolar hyperglycemic state' : hypo ? 'Severe hypoglycemia' : 'Myxedema coma';
  const glucose = hhs ? .32 + .67*s.signal : .74 - .64*s.signal;
  const breathing = Math.sin(t*2.8)*(.11-.08*s.volume);
  return <svg viewBox="0 0 760 402" role="group" aria-label={title ?? label} className="block h-auto w-full rounded-lg patho-scene" style={{background:pv('bg')}}>
    <text x="24" y="28" fill={pv('ink')} fontSize="16">{label} · conceptual physiology</text>
    <g {...hit('blood')}>
      <rect x="25" y="66" width="710" height="92" rx="28" fill={pv('inflame', .2)} stroke={pv('serosa', .8)} strokeWidth="3"/>
      <text x="45" y="92" fill={pv('ink')} fontSize="14">{hhs || hypo ? 'Circulating glucose' : 'Circulating water relative to solute'}</text>
      <FlowParticles from={[49,126]} to={[708,126]} time={t} color={pv(hhs || hypo ? 'alert' : 'fluid')} strength={hhs || hypo ? glucose : .36+.55*s.brain} count={13} radius={5} speed={.26}/>
    </g>
    {hhs && <>
      <g {...hit('kidney')}>
        <path d="M148 197 C96 179 89 252 124 277 C155 300 188 264 167 246 C150 233 182 214 148 197Z" fill={pv('serosa', .65)} stroke={pv('ink')} strokeWidth="2"/>
        <path d="M166 247 Q201 268 184 321" fill="none" stroke={pv('fluid', .7)} strokeWidth="4"/>
        <text x="90" y="348" fill={pv('ink')} fontSize="13">Glucosuria and osmotic diuresis</text>
        <FlowParticles from={[174,257]} to={[184,322]} time={t} strength={s.volume} color={pv('fluid')}/>
      </g>
      <g {...hit('brain')}>
        <ellipse cx="559" cy="244" rx={57-16*s.brain} ry={43-12*s.brain} fill={pv('serosa', .52)} stroke={pv('ink')} strokeWidth="2"/>
        <circle cx="559" cy="244" r="10" fill={pv('bg', .7)}/>
        <FlowParticles from={[580,244]} to={[691,244]} time={t} strength={s.brain} color={pv('fluid')}/>
        <text x="468" y="312" fill={pv('ink')} fontSize="13">Hypertonicity pulls water out of cells</text>
        <Meter x={486} y={347} w={215} label="Circulating volume reserve" value={1-.58*s.volume-.18*s.collapse} color={pv('fluid')}/>
      </g>
    </>}
    {hypo && <>
      <g {...hit('signal')}>
        <path d="M74 221 C129 185 230 193 276 222 C253 266 191 268 160 254 C134 265 85 271 74 221Z" fill={pv('serosa', .65)} stroke={pv('ink')} strokeWidth="2"/>
        <FlowParticles from={[176,216]} to={[177,158]} time={t} strength={s.volume} color={pv('alert')}/>
        <text x="66" y="291" fill={pv('ink')} fontSize="13">Counterregulation supports hepatic output</text>
        <text x="66" y="315" fill={pv('ink', .76)} fontSize="12">A persistent driver can cause recurrence.</text>
      </g>
      <g {...hit('brain')}>
        <ellipse cx="551" cy="230" rx="67" ry="41" fill={pv('serosa', .52)} stroke={pv('ink')} strokeWidth="2"/>
        <FlowParticles from={[550,157]} to={[551,222]} time={t} strength={glucose} color={pv('alert')}/>
        <text x="551" y="237" textAnchor="middle" fill={pv('ink')} fontSize="13">Brain</text>
        <Meter x={454} y={309} w={228} label="Glucose available to brain (conceptual)" value={.86-.66*s.brain} color={pv('alert')}/>
      </g>
    </>}
    {!hhs && !hypo && <>
      <g {...hit('heat')}>
        <g transform={'translate(185 241) scale('+(1+breathing)+' '+(1+breathing)+')'}>
          <path d="M-10 -43 Q-59 -43 -62 28 Q-32 60 -10 27Z M10 -43 Q59 -43 62 28 Q32 60 10 27Z" fill={pv('serosa', .6)} stroke={pv('ink')} strokeWidth="2"/>
        </g>
        <text x="82" y="324" fill={pv('ink')} fontSize="13">Reduced ventilatory drive</text>
        <Meter x={80} y={349} w={218} label="Thermogenesis reserve" value={1-.68*s.volume} color={pv('alert')}/>
      </g>
      <g {...hit('kidney')}>
        <path d="M570 187 C515 173 499 247 542 269 C579 285 608 252 581 230 C563 219 593 203 570 187Z" fill={pv('serosa', .65)} stroke={pv('ink')} strokeWidth="2"/>
        <path d="M577 252 Q610 269 603 303" fill="none" stroke={pv('fluid', .7)} strokeWidth="3"/>
        <FlowParticles from={[584,264]} to={[603,306]} time={t} strength={.72-.6*s.brain} color={pv('fluid')}/>
        <text x="475" y="327" fill={pv('ink')} fontSize="13">Reduced free-water clearance</text>
        <Meter x={475} y={349} w={220} label="Cardiopulmonary reserve" value={1-.4*s.volume-.28*s.collapse} color={pv('fluid')}/>
      </g>
    </>}
    {showLabels && <text x="24" y="383" fill={pv('ink', .72)} fontSize="11">Particle density, cell size and reserve bars show direction of change on the lesson timeline.</text>}
  </svg>;
}
