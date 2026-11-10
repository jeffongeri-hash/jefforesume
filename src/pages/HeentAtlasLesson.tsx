import type { ComponentProps } from 'react';
import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import HeentAtlasScene from '@/components/pathophysiology/HeentAtlasScene';
import * as data from '@/data/pathophysiology/heentAtlas';

type SceneProps = Omit<ComponentProps<typeof HeentAtlasScene>, 'kind'>;
const scenes: Record<data.HeentKind, (props: SceneProps) => JSX.Element> = {
  ear: props => <HeentAtlasScene {...props} kind="ear"/>,
  eye: props => <HeentAtlasScene {...props} kind="eye"/>,
  nose: props => <HeentAtlasScene {...props} kind="nose"/>,
};
const titles = { ear: 'Ear Anatomy and Otoscopic Findings', eye: 'Eye Anatomy, Inflammation and Fluorescein Examination', nose: 'Nose and Throat Anatomy and Examination' };
export default function HeentAtlasLesson({kind}:{kind:data.HeentKind}) {
  const cases=data.CASES[kind];
  const sources=Array.from(new Map(cases.map(item=>[item.source,{name:`${item.label} — clinical reference`,url:item.source}])).values());
  const structures = data.structuresFor(kind);
  return <PathoLessonPage config={{
    path:data.PATHS[kind],lessonNo:{ear:82,eye:83,nose:84}[kind],crumb:titles[kind],title:titles[kind],
    metaTitle:`${titles[kind]} | Emergency Pathophysiology Atlas`,
    metaDescription:`Interactive, source-linked anatomy, mechanisms and examination findings for ${kind === 'nose' ? 'nose and throat conditions' : `${kind} conditions`}.`,
    ogDescription:'Explore anatomy and examination findings using an interactive phase-based illustration.',
    intro:'Select a condition, play or step through the timeline, and compare its illustrated findings with normal anatomy. The scenes are conceptual teaching diagrams.',
    normalTitle:'Normal anatomy reference',variationsIntro:'Signs vary by cause and patient. These examples do not establish a diagnosis.',
    variants:{param:'finding',legend:'Choose a condition',options:cases.map(item=>({id:item.id,label:item.label,hint:item.target}))},
    data:{...data,PHASES:data.phasesFor(kind,cases[0].id),phasesFor:variant=>data.phasesFor(kind,variant),STRUCTURES:structures,
      VARIATIONS:cases.map(item=>({title:item.label,text:item.limit})),CANNOT_DETERMINE:['Diagnosis, examination severity, prognosis or individual treatment.'],
      ESCALATION_NOTE:kind==='eye'?'Sudden vision loss, suspected open globe, or a painful red eye needs urgent clinical assessment.':kind==='ear'?'Postauricular swelling, protruding ear, or systemic illness needs urgent clinical assessment.':'Airway symptoms, severe bleeding, orbital signs or neurologic symptoms need urgent clinical assessment.',SOURCES:sources},
    deep:(variant,_phase)=>{const item=data.pick(kind,variant);return {sections:[{h:'Anatomic mechanism',t:item.mechanism},{h:'Physical examination',t:item.findings},{h:'What the finding can and cannot tell you',t:item.limit},{h:'Clinical context',t:item.response}],refs:[{name:`${item.label} — clinical reference`,url:item.source}]};},
    extra:kind==='nose'?[{title:'Related airway lessons',items:['See the atlas index for the existing retropharyngeal and peritonsillar abscess lessons, including deeper spaces and airway effects.']}]:undefined,
    Scene:scenes[kind],
  }}/>;
}
