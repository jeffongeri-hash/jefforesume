import { DERM_LESSONS, dermState, type DermKind, type DermStructure } from '@/data/pathophysiology/dermatologicEmergencies';
import { Label, Meter, makeHit, pv } from './sceneKit';
import FlowParticles from './FlowParticles';

type Props={kind:DermKind;time:number;normal?:boolean;compact?:boolean;showLabels:boolean;selected:DermStructure|null;onSelect:(id:DermStructure)=>void};
const red='#ed8a89',gold='#f2ce6e',blue='#74bfed';
export default function DermatologicEmergencyScene({kind,time,normal,compact,showLabels,selected,onSelect}:Props){
  const s=dermState(kind,time,normal),hit=makeHit(DERM_LESSONS[kind].structures,selected,onSelect,compact);
  const separation=kind==='sjs'?35*s.injury:0;
  return <svg viewBox="0 0 750 380" role="group" aria-label={DERM_LESSONS[kind].title} className="block h-auto w-full rounded-lg patho-scene" style={{background:pv('bg')}}>
    <Label show={showLabels} x={25} y={42} size={13}>Enlarged skin cross-section · surface above</Label>
    <g {...hit('dermis')}>
      <rect x="46" y="172" width="403" height="133" rx="6" fill={pv('serosa',.5)} stroke={pv('ink',.4)} strokeWidth="2"/>
      <path d="M60 261H432" stroke={red} strokeWidth="10"/>
      <FlowParticles from={[65,261]} to={[430,261]} time={s.time} color={red} count={9}/>
      {Array.from({length:7},(_,i)=><circle key={i} cx={100+i*48} cy={250-35*((s.time*.4+i/7)%1)} r="4" fill={kind==='dress'?gold:blue} opacity={s.active}/>) }
      <Label show={showLabels} x={55} y={227} size={12}>Dermis and vessels</Label>
    </g>
    <g {...hit('epidermis')}>
      <path d={`M46 121H147Q205 ${121-separation} 261 ${121-separation}Q326 ${121-separation} 383 121H449V172H383Q326 ${172-separation} 261 ${172-separation}Q205 ${172-separation} 147 172H46Z`} fill={pv('serosa',.9)} stroke={pv('ink',.55)} strokeWidth="2"/>
      {kind==='sjs'&&<path d={`M148 172Q258 ${172-separation} 382 172`} fill="none" stroke={gold} strokeWidth={4+10*s.injury} opacity={s.injury}/>}
      {kind==='dress'&&<rect x="47" y="133" width="401" height="38" fill={red} opacity={s.active*.55}/>}
      {kind==='burn'&&<rect x="112" y="122" width="270" height={30+93*s.progress} fill="#673e4a" opacity={.75*s.onset}/>}
      {Array.from({length:8},(_,i)=><circle key={i} cx={90+i*44} cy={145-separation*.32} r="5" fill={kind==='sjs'?gold:red} opacity={s.progress}/>) }
      <Label show={showLabels} x={55} y={149} size={12}>Epidermis</Label>
    </g>
    <g {...hit('trigger')}>
      {kind==='burn'?<path d="M210 106Q190 83 215 66Q215 81 229 85Q246 62 246 53Q270 78 251 106Z" fill={gold} opacity={s.onset*(1-s.response)}/>:<><rect x="81" y="66" width="95" height="31" rx="15" fill={pv('panel')} stroke={gold}/><text x="94" y="86" fill={pv('ink')} fontSize="12">Medication</text><FlowParticles from={[180,82]} to={[260,122]} time={s.time} strength={s.onset*(1-s.response)} color={gold}/></>}
      <Label show={showLabels} x={kind==='burn'?277:180} y={82} size={12}>{kind==='burn'?'Thermal exposure':'Immune activation'}</Label>
    </g>
    <g {...hit('systemic')}>
      <rect x="482" y="77" width="228" height="232" rx="14" fill={pv('panel')} stroke={pv('ink',.3)}/>
      <Label show={showLabels} x={500} y={104} size={13}>{kind==='sjs'?'Mucosal involvement':kind==='dress'?'Possible organ involvement':'Systemic effects'}</Label>
      {kind==='sjs'&&<><path d="M508 149Q552 121 596 149Q552 176 508 149Z" fill="none" stroke={pv('ink')} strokeWidth="3"/><circle cx="552" cy="149" r="11" fill={blue}/><path d="M520 147Q553 168 583 147" fill="none" stroke={red} strokeWidth="5" opacity={s.injury}/><Label show={showLabels} x={508} y={195} size={12}>Eyes and mucosa</Label></>}
      {kind==='dress'&&<><path d="M523 133Q578 106 630 137Q637 169 607 180Q578 174 554 191Q522 191 515 165Z" fill={pv('serosa',.7)} stroke={red} strokeWidth="2"/><path d="M535 147L567 165L588 140L620 157" fill="none" stroke={gold} strokeWidth="6" opacity={s.injury}/><Label show={showLabels} x={520} y={214} size={12}>Liver · possible hepatitis</Label></>}
      {kind==='burn'&&<><path d="M527 142H660" stroke={red} strokeWidth="22"/><FlowParticles from={[532,142]} to={[655,142]} time={s.time} strength={1-.55*s.injury} color={red}/>{Array.from({length:5},(_,i)=><circle key={i} cx={535+i*26} cy={159+25*((s.time*.4+i/5)%1)} r="4" fill={blue} opacity={s.injury}/>)}<Label show={showLabels} x={520} y={206} size={12}>Capillary leak in major burns</Label></>}
      <Meter x={502} y={266} w={184} label={kind==='dress'?'Organ injury · possible':kind==='sjs'?'Mucosal injury · possible':'Fluid shift · qualitative'} value={s.retained} color={red}/>
    </g>
  </svg>;
}
