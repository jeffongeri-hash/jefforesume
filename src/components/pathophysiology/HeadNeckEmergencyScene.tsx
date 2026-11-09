import { HEAD_NECK_LESSONS, headNeckState, type HeadNeckKind, type HeadNeckStructure } from '@/data/pathophysiology/headNeckEmergencies';
import { Label, Meter, makeHit, pv } from './sceneKit';
import FlowParticles from './FlowParticles';

type Props={kind:HeadNeckKind;time:number;normal?:boolean;compact?:boolean;showLabels:boolean;selected:HeadNeckStructure|null;onSelect:(id:HeadNeckStructure)=>void};
type State=ReturnType<typeof headNeckState>;
type Hit=ReturnType<typeof makeHit<HeadNeckStructure>>;
const blue='#74bfed',red='#ef8c8b',gold='#f2ce6e';

function Eye({s,hit,showLabels}:{s:State;hit:Hit;showLabels:boolean}) {
  const retina=s.kind==='retina', lifted=65*s.active;
  return <>
    <Label show={showLabels} x={32} y={48} size={13}>Sagittal eye section · front at left</Label>
    <ellipse cx="257" cy="204" rx="190" ry="135" fill={pv('panel')} stroke={pv('ink',.7)} strokeWidth="5"/>
    <path d="M83 142Q36 204 83 266" fill="none" stroke={blue} strokeWidth="8"/>
    <g {...hit('flow')}><ellipse cx="143" cy="204" rx="49" ry="86" fill={pv('fluid',.18)}/>
      {!retina&&<><FlowParticles from={[192,184]} to={[139,198]} time={s.time} strength={1-.6*s.active} color={blue}/><FlowParticles from={[139,198]} to={[104,146]} time={s.time} strength={1-s.active} color={blue}/></>}
      {retina&&<path d={`M407 125Q${407-lifted} 205 407 282`} fill="none" stroke={blue} strokeWidth={8+12*s.active} opacity={s.active*.7}/>}
      <Label show={showLabels} x={retina?316:55} y={retina?315:295} size={11}>{retina?'Subretinal fluid':'Aqueous flow'}</Label>
    </g>
    <ellipse cx="207" cy="204" rx="31" ry="68" fill={pv('ink',.22)} stroke={pv('ink',.65)} strokeWidth="3"/>
    <g {...hit('trigger')}>
      {!retina&&<path d={`M178 126Q${160-25*s.active} 163 177 191M178 282Q${160-25*s.active} 245 177 216`} fill="none" stroke={red} strokeWidth="9"/>}
      {retina&&<><path d="M392 127L410 141M402 125L415 141" stroke={gold} strokeWidth="5" opacity={s.onset}/><path d="M290 112Q350 105 401 135" fill="none" stroke={pv('ink',.45)} strokeWidth="2" strokeDasharray="5 4"/></>}
      <Label show={showLabels} x={retina?287:100} y={retina?103:121} size={12}>{retina?'Vitreous traction / tear':'Iris'}</Label>
    </g>
    <g {...hit('anatomy')}>
      {!retina&&<><path d="M91 144L119 155M91 264L119 253" stroke={gold} strokeWidth={4+8*s.active}/><Label show={showLabels} x={36} y={131} size={11}>Drainage angle</Label></>}
      {retina&&<><path d="M392 92Q450 202 392 314" fill="none" stroke={red} strokeWidth="7"/><path d={`M386 94Q${437-lifted} 202 386 312`} fill="none" stroke={gold} strokeWidth="5"/><Label show={showLabels} x={462} y={250} size={11}>RPE</Label><Label show={showLabels} x={462} y={272} size={11}>Neurosensory retina</Label></>}
    </g>
    <g {...hit('injury')}><path d="M438 197H499" stroke={gold} strokeWidth="25"/><circle cx="438" cy="203" r="13" fill={red} opacity={s.residual*.7}/><Label show={showLabels} x={477} y={191} size={12}>Optic nerve</Label></g>
    <g aria-hidden><rect x="525" y="105" width="192" height="130" rx="14" fill={pv('panel')} stroke={pv('ink',.3)}/><Meter x={540} y={150} w={160} label={retina?'Retinal separation':'Outflow resistance'} value={s.active} color={gold}/><Meter x={540} y={203} w={160} label={retina?'Photoreceptor stress':'Relative eye pressure'} value={s.injury} color={red}/></g>
  </>;
}

function Orbit({s,hit,showLabels}:{s:State;hit:Hit;showLabels:boolean}) {
  return <>
    <Label show={showLabels} x={35} y={49} size={13}>Axial orbital section · anterior above, medial left</Label>
    <path d="M235 112Q350 73 465 112Q481 238 410 304L350 334L290 304Q220 238 235 112Z" fill={pv('panel')} stroke={pv('ink',.5)} strokeWidth="3"/>
    <g {...hit('trigger')}><rect x="101" y="170" width="98" height="88" rx="16" fill={pv('serosa',.2)} stroke={gold} strokeWidth="3"/><circle cx="150" cy="214" r="29" fill={gold} opacity={s.onset*.6}/><path d="M200 176V259" stroke={pv('ink',.6)} strokeWidth="6"/><Label show={showLabels} x={105} y={287} size={12}>Ethmoid sinus</Label></g>
    <g {...hit('flow')}><ellipse cx="350" cy="218" rx={102+8*s.active} ry="96" fill={red} opacity={.12+.38*s.active}/><FlowParticles from={[195,215]} to={[282,215]} time={s.time} strength={s.active} color={gold}/><Label show={showLabels} x={450} y={270} size={12}>Postseptal tissues</Label></g>
    <g {...hit('injury')}><path d="M350 246V329" stroke={gold} strokeWidth="19"/><circle cx="350" cy={188-10*s.active} r="61" fill={pv('fluid',.25)} stroke={pv('ink',.8)} strokeWidth="4"/><circle cx="350" cy={188-10*s.active} r="17" fill={pv('ink',.55)}/><Label show={showLabels} x={369} y={321} size={12}>Optic nerve</Label></g>
    <g {...hit('anatomy')}><path d="M265 118H435" fill="none" stroke={blue} strokeWidth="5" strokeDasharray="8 5"/><Label show={showLabels} x={462} y={121} size={12}>Orbital septum*</Label></g>
    <Label show={showLabels} x={105} y={357} size={11}>*Septum shown schematically between eyelid and deeper orbit.</Label>
  </>;
}

function Tonsil({s,hit,showLabels}:{s:State;hit:Hit;showLabels:boolean}) {
  const displacement=34*s.active;
  return <>
    <Label show={showLabels} x={35} y={48} size={13}>Oropharynx viewed from the front</Label>
    <path d="M98 83Q350 31 602 83Q624 287 350 322Q76 287 98 83Z" fill={pv('serosa',.22)} stroke={pv('serosa')} strokeWidth="4"/>
    <g {...hit('flow')}><ellipse cx="350" cy="214" rx={140-35*s.active} ry="95" fill={pv('bg')}/><Label show={showLabels} x={310} y={287} size={12}>Airway</Label></g>
    <g {...hit('anatomy')}><ellipse cx="226" cy="185" rx={20+43*s.active} ry={20+52*s.active} fill={gold} opacity={.15+.65*s.active}/><Label show={showLabels} x={100} y={240} size={12}>Peritonsillar space</Label></g>
    <g {...hit('trigger')}><ellipse cx={225+18*s.active} cy="193" rx="32" ry="52" fill={pv('serosa',.75)} stroke={red}/><ellipse cx="475" cy="193" rx="32" ry="52" fill={pv('serosa',.75)} stroke={red}/><Label show={showLabels} x={440} y={267} size={12}>Palatine tonsil</Label></g>
    <g {...hit('injury')}><path d={`M${350+displacement} 108Q${342+displacement} 151 ${350+displacement} 167Q${358+displacement} 151 ${350+displacement} 108Z`} fill={pv('serosa')} stroke={red}/><Label show={showLabels} x={370+displacement} y={151} size={12}>Uvula</Label></g>
  </>;
}

export default function HeadNeckEmergencyScene({kind,time,normal,compact,showLabels,selected,onSelect}:Props){
  const s=headNeckState(kind,time,normal),hit=makeHit(HEAD_NECK_LESSONS[kind].structures,selected,onSelect,compact),props={s,hit,showLabels};
  return <svg viewBox="0 0 750 380" role="group" aria-label={HEAD_NECK_LESSONS[kind].title} className="block h-auto w-full rounded-lg patho-scene" style={{background:pv('bg')}}>
    {(kind==='angle'||kind==='retina')&&<Eye {...props}/>}{kind==='orbit'&&<Orbit {...props}/>}{kind==='tonsil'&&<Tonsil {...props}/>}
  </svg>;
}
