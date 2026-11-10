import type { ComponentProps } from 'react';
import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import DermatologicEmergencyScene from '@/components/pathophysiology/DermatologicEmergencyScene';
import * as data from '@/data/pathophysiology/dermatologicEmergencies';
type SceneProps=Omit<ComponentProps<typeof DermatologicEmergencyScene>,'kind'>;
const scenes:Record<data.DermKind,(props:SceneProps)=>JSX.Element>={sjs:props=><DermatologicEmergencyScene {...props} kind="sjs"/>,dress:props=><DermatologicEmergencyScene {...props} kind="dress"/>,burn:props=><DermatologicEmergencyScene {...props} kind="burn"/>};
export default function DermatologicEmergencyLesson({kind}:{kind:data.DermKind}){
  const lesson=data.DERM_LESSONS[kind];
  return <PathoLessonPage config={{path:lesson.path,lessonNo:{sjs:73,dress:74,burn:75}[kind],crumb:lesson.title,title:lesson.title,
    metaTitle:`${lesson.title} | Emergency Pathophysiology Atlas`,metaDescription:lesson.intro,ogDescription:lesson.intro,intro:lesson.intro,
    normalTitle:'Intact skin reference',variationsIntro:'Clinical features and severity vary.',
    data:{...data,PHASES:lesson.phases,STRUCTURES:lesson.structures,VARIATIONS:lesson.variations,SOURCES:lesson.sources,ESCALATION_NOTE:lesson.escalation,
      CANNOT_DETERMINE:['The cause of a rash or burn, extent of injury, or individual treatment.']},
    deep:(_variant,id)=>{const phase=lesson.phases.find(item=>item.id===id);return phase?{sections:[{h:'Mechanism and clinical context',t:`${phase.explanation} ${phase.bedside[0]}`}],refs:lesson.sources}:undefined;},
    Scene:scenes[kind],
  }}/>;
}
