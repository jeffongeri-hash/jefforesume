import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import FlowParticles from '@/components/pathophysiology/FlowParticles';
import { makeHit, pv } from '@/components/pathophysiology/sceneKit';
import * as data from '@/data/pathophysiology/immuneMechanisms';

const labels: Record<string, [string,string,string]> = {
  neutropenia:['Viral illness','Bone marrow precursors','Circulating neutrophils ↓'],
  leukocytosis:['Stress / inflammation','Vessel margin + marrow','Circulating neutrophils ↑'],
  'acute-phase':['Innate immune cells · IL-6','Hepatocytes','CRP, SAA and fibrinogen ↑'],
  wall:['Beta-lactam','PBPs / wall cross-links','Peptidoglycan weakened'],
  ribosome:['Macrolide','Bacterial 50S subunit','Peptide elongation stalls'],
  dna:['Activated acyclovir','Viral DNA polymerase','DNA extension stops'],
  release:['Oseltamivir metabolite','Influenza neuraminidase','Virion release decreases'],
  tubulin:['Albendazole','Helminth beta-tubulin','Microtubule assembly falls'],
  mitochondria:['Atovaquone','Parasite complex bc1','Electron transport falls'],
};

function MechanismScene({time, normal, compact, selected, onSelect, variant = ''}:{
  time:number; normal?:boolean; compact?:boolean; selected:keyof typeof data.STRUCTURES|null;
  onSelect:(id:keyof typeof data.STRUCTURES)=>void; variant?:string;
}) {
  const t = normal ? 0 : time;
  const effect = data.ramp(t, 10, 19);
  const label = labels[variant] ?? labels.neutropenia;
  const hit = makeHit(data.STRUCTURES, selected, onSelect, compact);
  const immune = data.immuneCases.some(c=>c.id===variant);
  const increasing = variant==='leukocytosis' || variant==='acute-phase';
  const strength = increasing ? .25+.75*effect : 1-.84*effect;
  return <svg viewBox="0 0 760 360" role="group" aria-label={label.join(', ')} className="block h-auto w-full rounded-lg patho-scene" style={{background:pv('bg')}}>
    <g {...hit('signal')}>
      <text x="27" y="48" fill={pv('ink')} fontSize="17">{label[0]}</text>
      <path d="M30 76 H690" stroke={pv('ink',.4)} strokeWidth="2"/>
      <FlowParticles from={[33,76]} to={[687,76]} time={t} color={pv('alert')} strength={data.ramp(t,5,13)} count={8}/>
    </g>
    <g {...hit('target')}>
      <rect x="26" y="108" width="708" height="132" rx="18" fill={pv('panel')} stroke={pv('ink',.45)}/>
      <text x="45" y="138" fill={pv('ink')} fontSize="17">{label[1]}</text>
      {variant==='wall' && Array.from({length:12},(_,i)=><g key={i}>
        <path d={`M${65+54*i} 177h48 m-48 39h48`} stroke={pv('fluid')} strokeWidth="5"/>
        <path d={`M${85+54*i} 180v33`} stroke={pv('alert')} strokeWidth="4" opacity={1-effect*(i%3===0?.3:1)}/>
      </g>)}
      {variant==='ribosome' && <>
        <path d="M48 211H697" stroke={pv('fluid')} strokeWidth="3"/>
        <ellipse cx={165+155*(1-effect)*((t*.33)%1)} cy="189" rx="63" ry="26" fill={pv('serosa')}/>
        <text x="82" y="231" fill={pv('ink')} fontSize="11">mRNA</text>
        <FlowParticles from={[260,181]} to={[680,181]} time={t} strength={strength} color={pv('alert')} count={9}/>
      </>}
      {(variant==='dna' || variant==='tubulin' || variant==='mitochondria') &&
        Array.from({length:12},(_,i)=><rect key={i} x={58+i*55} y="178" width="45" height="26" rx="5" fill={pv('fluid')} opacity={Math.max(.14,Math.min(1,(1-.74*effect)*13-i))}/>)}
      {variant==='release' && <>
        <path d="M47 216 H710" stroke={pv('fluid')} strokeWidth="5"/>
        {[0,1,2,3,4,5].map(i=><circle key={i} cx={95+i*111} cy={205-44*((t*.44+i*.17)%1)*(1-effect)} r="9" fill={pv('alert')}/>)}
      </>}
      {immune && Array.from({length:10},(_,i)=><circle key={i} cx={68+i*68} cy={191} r={variant==='acute-phase'?7:14} fill={pv('serosa')} opacity={Math.max(.13,Math.min(1,(.45+strength*.55)*10-i))}/>)}
    </g>
    <g {...hit('output')}>
      <text x="27" y="277" fill={pv('ink')} fontSize="16">{t<10?'Reference output':label[2]}</text>
      <path d="M30 310 H710" stroke={pv('ink',.4)} strokeWidth="3"/>
      <FlowParticles from={[33,310]} to={[707,310]} time={t} strength={strength} color={pv('fluid')} count={14} radius={5}/>
    </g>
    <text x="28" y="343" fill={pv('ink',.72)} fontSize="11">Qualitative mechanism · symbols show direction of change</text>
  </svg>;
}

const immune = {...data, ...data.lessonData(data.immuneCases)};
const drugs = {...data, ...data.lessonData(data.drugCases)};
export default function ImmuneMechanismLesson({antimicrobial = false}:{antimicrobial?:boolean}) {
  const title = antimicrobial ? 'How Antimicrobials Work' : 'Immune Response and Blood Count Changes';
  const cases = antimicrobial ? data.drugCases : data.immuneCases;
  const description = antimicrobial ? 'Compare antibiotic, antiviral and antiparasitic targets.' : 'Follow viral neutropenia, reactive leukocytosis and the hepatic acute-phase response.';
  return <PathoLessonPage config={{
    path:antimicrobial ? data.ANTIMICROBIAL_PATH : data.IMMUNE_PATH, lessonNo:antimicrobial ? 54 : 53,
    crumb:title, title, metaTitle:title+' | Emergency Pathophysiology Atlas', metaDescription:description,
    ogDescription:description, intro:description, variationsIntro:'Select a case to compare mechanisms.',
    variants:{param:'mechanism',legend:'Mechanism',options:cases.map(c=>({id:c.id,label:c.label,hint:c.steps[1]}))},
    data:antimicrobial ? drugs : immune, Scene:MechanismScene,
  }}/>;
}
