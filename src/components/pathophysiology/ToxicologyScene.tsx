import { STRUCTURES, state, type ToxKind, type Structure } from '@/data/pathophysiology/toxicology';
import FlowParticles from './FlowParticles';
import { makeHit, Meter, pv } from './sceneKit';

export type ToxSceneProps = {
  time: number; normal?: boolean; compact?: boolean; showLabels: boolean; selected: Structure | null;
  onSelect: (id: Structure) => void; title?: string; kind: ToxKind; variant?: string;
};

function Lungs({x, y, scale = 1}: {x: number; y: number; scale?: number}) {
  return <g transform={'translate('+x+' '+y+') scale('+scale+')'}>
    <path d="M-8 -33 Q-41 -54 -54 18 Q-50 45 -9 25Z M8 -33 Q41 -54 54 18 Q50 45 9 25Z" fill={pv('serosa', .64)} stroke={pv('ink', .8)} strokeWidth="2"/>
    <path d="M0 -52 V-20 L-22 3 M0 -20 L22 3" fill="none" stroke={pv('ink', .7)} strokeWidth="3"/>
  </g>;
}

export default function ToxicologyScene({time, normal, compact, showLabels, selected, onSelect, title, kind, variant}: ToxSceneProps) {
  const t = normal ? 0 : time;
  const s = state(t);
  const hit = makeHit(STRUCTURES, selected, onSelect, compact);
  const activeToxin = s.agent*(1-.8*s.reversal);
  const respiratorySuppression = s.injury*(1-.72*s.reversal);
  const label = {
    opioid:'Opioids · receptor binding and ventilation',
    acetaminophen:'Acetaminophen · hepatic toxicity',
    salicylate:'Salicylates · two simultaneous acid–base processes',
    'toxic-alcohols':'Toxic alcohols · parent compound versus metabolites',
    'carbon-monoxide-cyanide':'Carbon monoxide and cyanide · delivery versus utilization',
    envenomation:'Envenomation and allergic reactions',
    environmental:'Environmental injury · four separate examples',
  }[kind];
  const venom = variant === 'anaphylaxis' ? 'Allergen' : variant === 'scorpion' ? 'Scorpion venom' : 'Snake venom';
  const scorpion = variant === 'scorpion';
  const allergy = variant === 'anaphylaxis';

  return <svg viewBox="0 0 760 410" role="group" aria-label={title ?? label} className="block h-auto w-full rounded-lg patho-scene" style={{background:pv('bg')}}>
    <text x="24" y="30" fill={pv('ink')} fontSize="15">{label}</text>
    {kind === 'opioid' && <>
      <g {...hit('receptor')}>
        <rect x="24" y="62" width="296" height="148" rx="15" fill={pv('panel')} stroke={pv('ink',.35)}/>
        <text x="45" y="90" fill={pv('ink')} fontSize="14">Brainstem μ-opioid receptor</text>
        <path d="M129 154 Q155 202 182 154" fill="none" stroke={pv('serosa')} strokeWidth="9"/>
        <FlowParticles from={[56,126]} to={[155,159]} time={t} color={pv('alert')} strength={activeToxin}/>
        <circle cx="155" cy="163" r="10" fill={pv('alert',activeToxin)}/>
        <circle cx={246-91*s.reversal} cy={125+38*s.reversal} r="10" fill={pv('fluid',s.reversal)}/>
        <text x="208" y="113" fill={pv('fluid',.65+.35*s.reversal)} fontSize="11">Naloxone</text>
      </g>
      <g {...hit('lungs')}>
        <Lungs x={530} y={142} scale={1 + Math.sin(t*(3.5-2.5*respiratorySuppression))*(.13-.09*respiratorySuppression)}/>
        <text x="436" y="214" fill={pv('ink')} fontSize="13">Ventilation falls, then may recover</text>
        <Meter x={408} y={267} w={286} label="Ventilatory drive" value={1-.78*respiratorySuppression} color={pv('fluid')}/>
      </g>
      <g {...hit('blood')}>
        <rect x="25" y="295" width="709" height="57" rx="14" fill={pv('inflame',.19)} stroke={pv('ink',.4)}/>
        <text x="45" y="328" fill={pv('ink')} fontSize="12">CO₂ retention</text>
        <FlowParticles from={[175,325]} to={[706,325]} time={t} color={pv('alert')} strength={.12+.86*respiratorySuppression} count={11}/>
      </g>
    </>}
    {kind === 'salicylate' && <>
      <g {...hit('lungs')}>
        <Lungs x={122} y={139} scale={1+.15*Math.sin(t*(3+3*s.agent))}/>
        <FlowParticles from={[120,92]} to={[120,54]} time={t} color={pv('fluid')} strength={.3+.7*s.agent}/>
        <text x="37" y="204" fill={pv('ink')} fontSize="13">Respiratory drive increases</text>
        <Meter x={38} y={251} w={256} label="PaCO₂ trend ↓" value={.85-.57*s.agent} color={pv('fluid')}/>
      </g>
      <g {...hit('blood')}>
        <ellipse cx="521" cy="133" rx="74" ry="38" fill={pv('serosa',.4)} stroke={pv('ink',.65)} strokeWidth="2"/>
        <path d="M470 133 q16-29 32 0t32 0t32 0" stroke={pv('ink',.76)} fill="none" strokeWidth="3"/>
        <text x="417" y="203" fill={pv('ink')} fontSize="13">Mitochondrial uncoupling</text>
        <Meter x={418} y={251} w={275} label="Metabolic acid burden ↑" value={.12+.78*s.injury} color={pv('alert')}/>
      </g>
      <g {...hit('kidney')}>
        <text x="38" y="312" fill={pv('ink')} fontSize="13">Alkalinization can increase renal salicylate excretion</text>
        <path d="M42 340 H693" stroke={pv('fluid', .3)} strokeWidth="3"/>
        <FlowParticles from={[45,340]} to={[695,340]} time={t} color={pv('fluid')} strength={s.reversal} speed={.25}/>
      </g>
    </>}
    {kind === 'toxic-alcohols' && <>
      <g {...hit('agent')}>
        <text x="42" y="98" fill={pv('ink')} fontSize="14">Methanol or ethylene glycol</text>
        <path d="M47 141 H308" stroke={pv('ink',.5)} strokeWidth="3"/>
        <FlowParticles from={[48,141]} to={[307,141]} time={t} color={pv('alert')} strength={s.agent}/>
      </g>
      <g {...hit('liver')}>
        <rect x="310" y="100" width="133" height="81" rx="14" fill={pv('serosa',.45)} stroke={pv('ink',.65)}/>
        <text x="376" y="135" textAnchor="middle" fill={pv('ink')} fontSize="15">ADH</text>
        <text x="376" y="158" textAnchor="middle" fill={pv('ink',.8)} fontSize="10">Alcohol dehydrogenase</text>
      </g>
      <g {...hit('blood')}>
        <text x="500" y="99" fill={pv('ink')} fontSize="14">Toxic metabolites</text>
        <path d="M446 141 H709" stroke={pv('ink',.5)} strokeWidth="3"/>
        <FlowParticles from={[447,141]} to={[706,141]} time={t} color={pv('inflame')} strength={s.injury*(1-.9*s.reversal)}/>
        <Meter x={493} y={217} w={204} label="Acid burden already generated" value={.12+.72*s.danger} color={pv('alert')}/>
      </g>
      <g {...hit('antidote')}>
        <path d="M374 306 V182" stroke={pv('fluid',.25+.65*s.reversal)} strokeWidth="3"/>
        <FlowParticles from={[374,306]} to={[374,182]} time={t} color={pv('fluid')} strength={s.reversal}/>
        <path d="M325 184 H423" stroke={pv('fluid',s.reversal)} strokeWidth="5"/>
        <text x="42" y="329" fill={pv('ink')} fontSize="13">Fomepizole blocks new metabolite formation. Existing metabolites may still require removal.</text>
      </g>
    </>}
    {kind === 'carbon-monoxide-cyanide' && <>
      <g {...hit('blood')}>
        <text x="36" y="74" fill={pv('ink')} fontSize="14">CO · hemoglobin binding limits oxygen delivery</text>
        <rect x="35" y="89" width="685" height="78" rx="28" fill={pv('inflame',.18)} stroke={pv('ink',.5)}/>
        {[0,1,2,3,4].map(i => <g key={i}>
          <ellipse cx={60+(t*29+i*132)%630} cy="128" rx="19" ry="12" fill={pv('inflame',.78)} stroke={pv('ink',.55)}/>
          <circle cx={60+(t*29+i*132)%630} cy="128" r="5" fill={pv(i < Math.round(4*activeToxin) ? 'alert' : 'fluid')}/>
        </g>)}
        <text x="36" y="195" fill={pv('ink',.8)} fontSize="12">Oxygen therapy accelerates CO clearance</text>
      </g>
      <g {...hit('receptor')}>
        <text x="36" y="238" fill={pv('ink')} fontSize="14">Cyanide · mitochondrial oxygen utilization fails</text>
        <FlowParticles from={[48,288]} to={[468,288]} time={t} color={pv('fluid')} strength={.9}/>
        <ellipse cx="525" cy="288" rx="60" ry="33" fill={pv('serosa',.62)} stroke={pv('ink',.7)}/>
        <path d="M488 288 q13-24 26 0t26 0t24 0" fill="none" stroke={pv('ink',.68)} strokeWidth="3"/>
        <circle cx="551" cy="278" r="10" fill={pv('alert',activeToxin)}/>
        <Meter x={595} y={290} w={112} label="ATP production" value={1-.9*activeToxin} color={pv('fluid')}/>
        <text x="36" y="347" fill={pv('ink',.8)} fontSize="12">Hydroxocobalamin binds cyanide in appropriate cases</text>
      </g>
    </>}
    {kind === 'envenomation' && <>
      <g {...hit('skin')}>
        <text x="38" y="75" fill={pv('ink')} fontSize="14">{venom} enters tissue</text>
        <path d={'M32 136 Q124 '+(136-60*s.injury)+' 216 136 T411 136 H716'} fill="none" stroke={pv('serosa')} strokeWidth="7"/>
        <FlowParticles from={[113,102]} to={[218,222]} time={t} color={pv('alert')} strength={activeToxin}/>
        <text x="37" y="178" fill={pv('ink',.8)} fontSize="12">Local edema may develop</text>
      </g>
      <g {...hit(allergy ? 'lungs' : scorpion ? 'receptor' : 'blood')}>
        <rect x="33" y="224" width="688" height={92+28*s.danger*(1-.62*s.reversal)} rx="25" fill={pv('inflame',.17)} stroke={pv('ink',.55)} strokeWidth="2"/>
        <text x="52" y="252" fill={pv('ink')} fontSize="13">{allergy ? 'Mediator release · vascular leak and bronchospasm' : scorpion ? 'Neurotoxic excitation · abnormal firing and autonomic effects' : 'Circulating venom · systemic effects vary by species'}</text>
        <FlowParticles from={[65,281]} to={[692,281]} time={t} color={pv('alert')} strength={s.injury*(1-(allergy ? 0 : .74*s.reversal))} speed={scorpion ? .75 : .3}/>
        <FlowParticles from={[660,302]} to={[94,302]} time={t} color={pv('fluid')} strength={s.reversal} speed={.34}/>
      </g>
      <g {...hit('antidote')}><text x="38" y="366" fill={pv('ink',.9)} fontSize="12">{allergy ? 'Epinephrine supports vascular tone and bronchodilation.' : 'Species-appropriate antivenom can bind free venom where indicated.'}</text></g>
    </>}
    {kind === 'environmental' && <>
      <g {...hit('skin')}>
        <text x="36" y="83" fill={pv('ink')} fontSize="14">Heat stroke</text>
        <Meter x={37} y={125} w={298} label="Heat load rises · cooling removes heat" value={.38+.57*s.injury-.46*s.reversal} color={pv('alert')}/>
        <text x="36" y="184" fill={pv('ink')} fontSize="14">Hypothermia</text>
        <Meter x={37} y={224} w={298} label="Core heat falls · rewarming adds heat" value={.88-.59*s.injury+.44*s.reversal} color={pv('fluid')}/>
      </g>
      <g {...hit('lungs')}>
        <text x="416" y="83" fill={pv('ink')} fontSize="14">Drowning · impaired gas exchange</text>
        <Lungs x={555} y={159} scale={.85+.1*Math.sin(t*3)*(1-.7*s.injury+.6*s.reversal)}/>
        <FlowParticles from={[581,156]} to={[708,156]} time={t} color={pv('fluid')} strength={1-.83*s.injury+.64*s.reversal}/>
        <text x="418" y="232" fill={pv('ink',.8)} fontSize="12">Ventilatory support can restore oxygen delivery</text>
      </g>
      <g {...hit('heart')}>
        <text x="37" y="277" fill={pv('ink')} fontSize="14">Electrical injury · current can disrupt cardiac rhythm</text>
        <path d={s.danger > .15 ? 'M38 330 l22-8 19 17 23-38 23 47 25-28 21 12 27-33 22 40 30-21 24 8 H699' : 'M38 330 h45 l11-7 10 7 h12 l12-31 11 41 13-10 H699'} fill="none" stroke={pv('alert', .85)} strokeWidth="3"/>
        <FlowParticles from={[42,330]} to={[695,330]} time={t} color={pv('ink')} strength={.2+.6*s.danger}/>
        <text x="37" y="364" fill={pv('ink',.8)} fontSize="12">Rhythm and associated trauma guide emergency care</text>
      </g>
    </>}
    {showLabels && <text x="24" y="392" fill={pv('ink',.7)} fontSize="11">Qualitative physiology. Correction phases illustrate mechanisms and do not predict recovery.</text>}
  </svg>;
}
