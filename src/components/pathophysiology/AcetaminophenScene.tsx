import { ramp } from '@/data/pathophysiology/timeline';
import { STRUCTURES, type Structure } from '@/data/pathophysiology/toxicology';
import { makeHit, pv } from './sceneKit';

type Props = { time:number; normal?:boolean; compact?:boolean; showLabels:boolean; selected:Structure|null; onSelect:(id:Structure)=>void; title?:string };

/** Qualitative pathways, synchronized to the lesson scrubber, not pharmacokinetic curves. */
export default function AcetaminophenScene({time,normal=false,compact,showLabels,selected,onSelect,title}:Props) {
  const t=normal?0:time, exposure=ramp(t,5,10), napqi=ramp(t,10,15), injury=ramp(t,15,20), nac=ramp(t,20,24), hit=makeHit(STRUCTURES,selected,onSelect,compact);
  const reserve=Math.max(.18,1-.82*napqi+.52*nac), danger=injury*(1-.45*nac);
  return <svg viewBox="0 0 900 510" role="img" aria-label={title ?? 'Conceptual acetaminophen metabolism, NAPQI injury, and N-acetylcysteine support'} className="block h-auto w-full rounded-lg patho-scene" style={{background:pv('bg')}}>
    <text x="22" y="27" fill={pv('ink')} fontSize="15">Acetaminophen toxicity · conceptual pathways, not measured concentrations</text>
    <g {...hit('agent')}><rect x="25" y="89" width="140" height="82" rx="20" fill={pv('panel')} stroke={pv('ink',.5)}/><text x="95" y="120" textAnchor="middle" fill={pv('ink')} fontSize="13">Acetaminophen</text><text x="95" y="144" textAnchor="middle" fill={pv('ink',.7)} fontSize="11">exposure</text></g>
    <path d="M166 130 H228" stroke={pv('fluid',.5)} strokeWidth="4"/>
    {[0,1,2].map(i=><circle key={i} cx={166+((Math.max(0,t-5)*28+i*20)%62)} cy="130" r="4" fill={pv('fluid')} opacity={exposure}/>) }
    <g {...hit('liver')}><path d="M245 84 C306 49 398 58 432 100 C433 125 407 146 371 152 C345 158 324 148 301 170 C270 192 229 165 228 136 C226 117 232 96 245 84Z" fill={pv('serosa',.8)} stroke={pv('ink',.75)} strokeWidth="2"/><text x="330" y="113" textAnchor="middle" fill={pv('ink')} fontSize="14">Liver metabolism</text><text x="330" y="135" textAnchor="middle" fill={pv('ink',.8)} fontSize="11">CYP pathway → NAPQI</text></g>
    <path d="M432 125 H530" stroke={pv('alert',.25+.65*napqi)} strokeWidth="5"/>
    {[0,1,2,3].map(i=><circle key={i} cx={432+((Math.max(0,t-10)*30+i*24)%98)} cy="125" r={4+2*napqi} fill={pv('alert')} opacity={napqi}/>) }
    <g {...hit('receptor')}><rect x="535" y="75" width="325" height="125" rx="18" fill={pv('panel')} stroke={pv('alert',.3+.6*danger)} strokeWidth="2"/><text x="555" y="100" fill={pv('ink')} fontSize="13">Hepatocyte inset · enlarged</text><circle cx="650" cy="149" r="38" fill={pv('serosa',.55)} stroke={pv('ink',.6)} strokeWidth="2"/><circle cx="650" cy="149" r="11" fill={pv('contents',.8)}/><path d="M621 128 l12 11 -8 13 14 7 -5 16 M674 122 l-12 15 9 10 -13 12 9 17" fill="none" stroke={pv('alert',danger)} strokeWidth="3"/><text x="710" y="145" fill={pv('ink',.85)} fontSize="11">Protein binding</text><text x="710" y="164" fill={pv('ink',.85)} fontSize="11">and oxidative injury</text></g>
    <g {...hit('blood')}><text x="35" y="247" fill={pv('ink')} fontSize="13">Glutathione reserve · qualitative</text><rect x="35" y="263" width="300" height="20" rx="10" fill={pv('panel')} stroke={pv('ink',.4)}/><rect x="37" y="265" width={296*reserve} height="16" rx="8" fill={pv('fluid',.8)}/><text x="35" y="306" fill={pv('ink',.7)} fontSize="11">Depletion reduces NAPQI detoxification.</text></g>
    <g {...hit('antidote')}><rect x="390" y="235" width="190" height="75" rx="14" fill={pv('panel')} stroke={pv('fluid',.4+.6*nac)} strokeWidth="2"/><text x="485" y="263" textAnchor="middle" fill={pv('ink')} fontSize="13">N-acetylcysteine</text><text x="485" y="285" textAnchor="middle" fill={pv('ink',.75)} fontSize="11">supports glutathione</text></g>
    <path d="M390 275 H345" stroke={pv('fluid',.8*nac)} strokeWidth="4"/><path d="M350 269 l-10 6 10 6" fill="none" stroke={pv('fluid',.8*nac)} strokeWidth="3"/>
    {[0,1,2].map(i=><circle key={i} cx={390-((Math.max(0,t-20)*25+i*15)%45)} cy="275" r="4" fill={pv('fluid')} opacity={nac}/>) }
    <g {...hit('kidney')}><rect x="615" y="235" width="245" height="75" rx="14" fill={pv('panel')} stroke={pv('ink',.35)}/><text x="630" y="262" fill={pv('ink')} fontSize="12">Detoxified conjugates</text><text x="630" y="285" fill={pv('ink',.7)} fontSize="11">processed and excreted</text></g>
    {showLabels&&<g fill={pv('ink',.8)} fontSize="12"><text x="25" y="367">The moving particles are conceptual: the timeline is not clock time or a dose-response prediction.</text><text x="25" y="391">NAC can prevent or lessen injury; the diagram does not imply immediate reversal of existing damage.</text><text x="25" y="415">Early treatment matters. Serial labs and poison-center / toxicology guidance remain essential.</text></g>}
  </svg>;
}
