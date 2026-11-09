import type { ComponentProps } from 'react';
import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import HeadNeckEmergencyScene from '@/components/pathophysiology/HeadNeckEmergencyScene';
import * as data from '@/data/pathophysiology/headNeckEmergencies';

type SceneProps=Omit<ComponentProps<typeof HeadNeckEmergencyScene>,'kind'>;
const scenes:Record<data.HeadNeckKind,(props:SceneProps)=>JSX.Element>={
  angle:props=><HeadNeckEmergencyScene {...props} kind="angle"/>, retina:props=><HeadNeckEmergencyScene {...props} kind="retina"/>,
  orbit:props=><HeadNeckEmergencyScene {...props} kind="orbit"/>, tonsil:props=><HeadNeckEmergencyScene {...props} kind="tonsil"/>,
};
export default function HeadNeckEmergencyLesson({kind}:{kind:data.HeadNeckKind}){
  const lesson=data.HEAD_NECK_LESSONS[kind];
  return <PathoLessonPage config={{path:lesson.path,lessonNo:{angle:69,retina:70,orbit:71,tonsil:72}[kind],
    crumb:lesson.title,title:lesson.title,metaTitle:`${lesson.title} | Emergency Pathophysiology Atlas`,
    metaDescription:lesson.intro,ogDescription:lesson.intro,intro:lesson.intro,normalTitle:'Reference anatomy',variationsIntro:'Anatomy and presentation can vary.',
    data:{...data,PHASES:lesson.phases,STRUCTURES:lesson.structures,VARIATIONS:lesson.variations,SOURCES:lesson.sources,ESCALATION_NOTE:lesson.escalation,
      CANNOT_DETERMINE:['Diagnosis, visual prognosis, airway stability or individual treatment.']},
    deep:(_variant,id)=>{const phase=lesson.phases.find(item=>item.id===id);return phase?{sections:[{h:'Mechanism and clinical context',t:`${phase.explanation} ${phase.bedside[0]}`}],refs:lesson.sources}:undefined;},
    Scene:scenes[kind],
  }}/>;
}
