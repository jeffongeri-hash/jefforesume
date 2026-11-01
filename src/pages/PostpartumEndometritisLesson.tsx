import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import PostpartumScene from '@/components/pathophysiology/PostpartumScene';
import * as data from '@/data/pathophysiology/postpartumEndometritis';
export default function PostpartumEndometritisLesson() {
 return <PathoLessonPage config={{path:data.POSTPARTUM_PATH,lessonNo:17,crumb:'Postpartum endometritis',title:'Postpartum Endometritis: Uterine Infection and Systemic Risk',metaTitle:'Postpartum Endometritis | Emergency Pathophysiology Atlas',metaDescription:'Interactive postpartum uterine infection, clinical signals and possible systemic deterioration.',ogDescription:'Conceptual phase-based postpartum infection education.',intro:'A conceptual illustration of one possible progression, not a patient simulation. Not all infections extend or cause sepsis.',variationsIntro:'Symptoms and laboratory findings vary; other postpartum causes of fever require consideration.',data,deep:data.postpartumDeep,Scene:PostpartumScene}} />;
}
