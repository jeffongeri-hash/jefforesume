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
const visualLabels: Record<data.MechanismVisual, [string,string,string]> = {
  wall:['Antibacterial agent','Peptidoglycan synthesis','Cell-wall integrity falls'],
  membrane:['Antibacterial agent','Bacterial membrane','Membrane function falls'],
  ribosome30:['Antibacterial agent','Bacterial 30S ribosome','Protein synthesis falls'],
  ribosome50:['Antibacterial agent','Bacterial 50S ribosome','Protein synthesis falls'],
  dna:['Antibacterial agent','Bacterial DNA process','DNA integrity falls'],
  rna:['Antibacterial agent','Bacterial RNA polymerase','RNA synthesis falls'],
  folate:['Antibacterial agent','Bacterial folate pathway','Nucleotide synthesis falls'],
  mycobacterial:['Antimycobacterial agent','Mycobacterial envelope / energy target','Mycobacterial survival falls'],
  viral:['Antiviral agent','Viral replication step','Viral output falls'],
  parasite:['Antiparasitic agent','Parasite target','Parasite function falls'],
};

function MechanismScene({time, normal, compact, selected, onSelect, variant = ''}:{
  time:number; normal?:boolean; compact?:boolean; selected:keyof typeof data.STRUCTURES|null;
  onSelect:(id:keyof typeof data.STRUCTURES)=>void; variant?:string;
}) {
  const t = normal ? 0 : time;
  const effect = data.ramp(t, 10, 19);
  const activeCase = data.drugCases.find(c=>c.id===variant);
  const visual = activeCase?.visual;
  const label = labels[variant] ?? (visual ? visualLabels[visual] : labels.neutropenia);
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
      {visual==='wall' && Array.from({length:12},(_,i)=><g key={i}>
        <path d={`M${65+54*i} 177h48 m-48 39h48`} stroke={pv('fluid')} strokeWidth="5"/>
        <path d={`M${85+54*i} 180v33`} stroke={pv('alert')} strokeWidth="4" opacity={1-effect*(i%3===0?.3:1)}/>
      </g>)}
      {(visual==='ribosome30' || visual==='ribosome50') && <>
        <path d="M48 211H697" stroke={pv('fluid')} strokeWidth="3"/>
        <ellipse cx={165+155*(1-effect)*((t*.33)%1)} cy="189" rx={visual==='ribosome30'?48:63} ry="26" fill={pv('serosa')}/>
        <path d={visual==='ribosome30' ? 'M112 175q53-37 104 0' : 'M102 175q63-44 126 0'} fill="none" stroke={pv('alert')} strokeWidth="5" opacity={.45+.55*effect}/>
        <text x="82" y="231" fill={pv('ink')} fontSize="11">mRNA</text>
        <FlowParticles from={[260,181]} to={[680,181]} time={t} strength={strength} color={pv('alert')} count={9}/>
      </>}
      {(visual==='dna' || visual==='rna' || visual==='folate' || visual==='mycobacterial' || visual==='parasite') &&
        Array.from({length:12},(_,i)=><rect key={i} x={58+i*55} y="178" width="45" height="26" rx="5" fill={pv('fluid')} opacity={Math.max(.14,Math.min(1,(1-.74*effect)*13-i))}/>)}
      {visual==='membrane' && <>
        <path d="M62 163H698 M62 216H698" stroke={pv('fluid')} strokeWidth="7"/>
        {Array.from({length:14},(_,i)=><circle key={i} cx={85+i*43} cy={190} r={3+10*effect*((i%3)+1)/3} fill={pv('alert')} opacity={effect}/>) }
        <FlowParticles from={[84,190]} to={[690,190]} time={t} strength={1-effect} color={pv('serosa')} count={11}/>
      </>}
      {visual==='folate' && <><text x="72" y="170" fill={pv('ink')} fontSize="14">PABA</text><text x="306" y="170" fill={pv('ink')} fontSize="14">DHF</text><text x="548" y="170" fill={pv('ink')} fontSize="14">THF</text><path d="M135 180H290 M370 180H530" stroke={pv('alert')} strokeWidth="5" strokeDasharray={effect>.1?'10 7':'0'} /></>}
      {visual==='mycobacterial' && <><rect x="102" y="148" width="530" height="72" rx="35" fill="none" stroke={pv('serosa')} strokeWidth="16"/><path d="M118 184H618" stroke={pv('alert')} strokeWidth="5" strokeDasharray={effect>.1?'14 8':'0'} /><text x="306" y="192" fill={pv('ink')} fontSize="14">lipid-rich envelope / ATP</text></>}
      {(variant==='release' || visual==='viral') && <>
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
  const description = antimicrobial ? 'Explore the major antibacterial classes by molecular target, alongside antiviral and antiparasitic examples.' : 'Follow viral neutropenia, reactive leukocytosis and the hepatic acute-phase response.';
  return <PathoLessonPage config={{
    path:antimicrobial ? data.ANTIMICROBIAL_PATH : data.IMMUNE_PATH, lessonNo:antimicrobial ? 54 : 53,
    crumb:title, title, metaTitle:title+' | Emergency Pathophysiology Atlas', metaDescription:description,
    ogDescription:description, intro:description, variationsIntro:'Select a case to compare mechanisms.',
    variants:{param:'mechanism',legend:antimicrobial ? 'Drug class / mechanism' : 'Mechanism',options:cases.map(c=>({id:c.id,label:c.label,hint:c.steps[1]}))},
    data:antimicrobial ? drugs : immune, Scene:MechanismScene,
  }}/>;
}
