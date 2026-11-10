import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import SurgicalAbdomenScene from '@/components/pathophysiology/SurgicalAbdomenScene';
import * as core from '@/data/pathophysiology/surgicalAbdomen';
export default function SurgicalAbdomenLesson({kind}:{kind:core.Condition}) {
 const lesson=core.LESSONS[kind];
 const data={...core,PHASES:lesson.phases,VARIATIONS:lesson.variations,SOURCES:lesson.sources};
 const Scene=(props:React.ComponentProps<typeof SurgicalAbdomenScene>)=><SurgicalAbdomenScene {...props} variant={kind} />;
 return <PathoLessonPage config={{path:lesson.path,lessonNo:kind==='bowel-obstruction'?25:26,crumb:lesson.title,title:lesson.title,metaTitle:`${lesson.title} | Emergency Pathophysiology Atlas`,metaDescription:'Interactive educational animation of abdominal emergency pathophysiology.',ogDescription:'Source-linked phase-based surgical abdomen education.',intro:'A conceptual illustration of one possible clinical pathway, not a patient simulation or diagnostic image.',variationsIntro:'Causes and patient presentations vary; the sequence shown is not inevitable.',normalTitle:'Normal bowel reference',data,deep:(_v,id)=>core.deepFor(kind,id),Scene}}/>;
}
