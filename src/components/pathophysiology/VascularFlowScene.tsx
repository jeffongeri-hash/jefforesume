import { STRUCTURES, sceneState, type Structure } from '@/data/pathophysiology/vascularFlow';
import FlowParticles from './FlowParticles';
import { makeHit, pv } from './sceneKit';

type Props = {time: number; normal?: boolean; compact?: boolean; showLabels: boolean; selected: Structure | null; onSelect: (id: Structure) => void; title?: string};

export default function VascularFlowScene({time, normal, compact, showLabels, selected, onSelect, title}: Props) {
  const t = normal ? 0 : time;
  const s = sceneState(t);
  const hit = makeHit(STRUCTURES, selected, onSelect, compact);
  const pulse = Math.sin(t*4)*s.artery;
  const squeeze = Math.max(0,Math.sin(t*3))*s.vein;
  const open = 12*squeeze;

  return <svg viewBox="0 0 800 520" role="group" aria-label={title ?? 'Artery and vein walls, venous return and AVM flow'} className="block h-auto w-full rounded-lg patho-scene" style={{background:pv('bg')}}>
    <text x="24" y="29" fill={pv('ink')} fontSize="15">Vessel structure and flow · illustrative cross-sections</text>
    <g {...hit('artery')}>
      <circle cx="107" cy="119" r={63+2*pulse} fill={pv('serosa',.82)} stroke={pv('ink',.8)} strokeWidth="2"/>
      <circle cx="107" cy="119" r={34+2*pulse} fill={pv('inflame',.34)} stroke={pv('ink',.5)}/>
      <text x="107" y="123" textAnchor="middle" fill={pv('ink')} fontSize="12">Lumen</text>
      <text x="107" y="201" textAnchor="middle" fill={pv('ink')} fontSize="13">Artery · thicker media</text>
    </g>
    <g {...hit('vein')}>
      <circle cx="290" cy="119" r="63" fill={pv('serosa',.7)} stroke={pv('ink',.8)} strokeWidth="2"/>
      <ellipse cx="290" cy="119" rx="51" ry={51-9*squeeze} fill={pv('fluid',.28)} stroke={pv('ink',.5)}/>
      <text x="290" y="123" textAnchor="middle" fill={pv('ink')} fontSize="12">Lumen</text>
      <text x="290" y="201" textAnchor="middle" fill={pv('ink')} fontSize="13">Vein · thinner media</text>
    </g>
    <g {...hit('muscle')}>
      <text x="30" y="230" fill={pv('ink',.8)} fontSize="12">Both vessel walls contain smooth muscle.</text>
      <text x="30" y="249" fill={pv('ink',.8)} fontSize="12">The arterial pressure wave comes from the heart.</text>
      <path d={'M31 274 Q202 '+(274-5*pulse)+' 373 274 M31 297 Q202 '+(297+5*pulse)+' 373 297'} fill="none" stroke={pv('serosa',.8)} strokeWidth="3"/>
      <FlowParticles from={[42,285]} to={[363,285]} time={t} strength={.65+.22*pulse} color={pv('inflame')} speed={.5} count={9}/>
    </g>
    <g {...hit('valve')}>
      <text x="427" y="65" fill={pv('ink')} fontSize="13">Peripheral vein · skeletal-muscle pump</text>
      <path d={'M420 110 Q560 '+(110+23*squeeze)+' 640 110 H762 M420 194 Q560 '+(194-23*squeeze)+' 640 194 H762'} fill="none" stroke={pv('fluid',.82)} strokeWidth="5"/>
      <path d={'M632 110 Q659 127 682 '+(150-open)+' M632 194 Q659 177 682 '+(154+open)} fill="none" stroke={pv('ink',.85)} strokeWidth="3"/>
      <FlowParticles from={[432,152]} to={[749,152]} time={t} color={pv('fluid')} strength={.35+.63*squeeze} speed={.4} count={7}/>
      <text x="429" y="225" fill={pv('ink',.8)} fontSize="12">External compression promotes forward flow.</text>
      <text x="429" y="244" fill={pv('ink',.8)} fontSize="12">Valve leaflets limit backward flow.</text>
    </g>
    <g {...hit('capillary')}>
      <text x="30" y="348" fill={pv('ink')} fontSize="13">Normal artery → capillary bed → vein</text>
      <path d="M31 408 H116 L176 382 H247 L307 408 H373 M116 408 L176 434 H247 L307 408" stroke={pv('fluid',.65)} strokeWidth="3" fill="none"/>
      <FlowParticles from={[32,408]} to={[114,408]} time={t} color={pv('inflame')} count={3}/>
      <FlowParticles from={[177,382]} to={[247,382]} time={t} color={pv('fluid')} count={3}/>
      <FlowParticles from={[177,434]} to={[247,434]} time={t} color={pv('fluid')} count={3}/>
    </g>
    <g {...hit('avm')}>
      <text x="427" y="348" fill={pv('ink')} fontSize="13">{normal ? 'Normal artery → capillary bed → vein' : 'AVM · direct arterial-to-venous shunt'}</text>
      {normal ? <path d="M425 408 H510 L553 382 H630 L674 408 H761 M510 408 L553 434 H630 L674 408" stroke={pv('fluid',.64)} strokeWidth="3" fill="none"/> :
        <path d="M425 408 H761 M510 408 Q556 371 592 408 M580 408 Q621 445 669 408" stroke={pv('alert',.3+.65*s.avm)} strokeWidth={3+4*s.avm} fill="none"/>}
      {!normal && <FlowParticles from={[427,408]} to={[760,408]} time={t} color={pv('alert')} strength={s.avm} count={9} speed={.6}/>}
    </g>
    {!normal && s.bleed > .01 && <g {...hit('bleed')}>
      <circle cx="669" cy="411" r={12+14*s.bleed} fill={pv('inflame',.5)} />
      <FlowParticles from={[669,410]} to={[718,454]} time={t} color={pv('inflame')} strength={s.bleed} count={4}/>
      <text x="572" y="475" fill={pv('ink')} fontSize="12">Example of possible rupture</text>
    </g>}
    {showLabels && <text x="24" y="503" fill={pv('ink',.73)} fontSize="11">Colors identify pathways. Sizes and motion are qualitative.</text>}
  </svg>;
}
