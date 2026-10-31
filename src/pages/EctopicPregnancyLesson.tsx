import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import EctopicPregnancyScene from '@/components/pathophysiology/EctopicPregnancyScene';
import * as data from '@/data/pathophysiology/ectopicPregnancy';

export default function EctopicPregnancyLesson() {
  return <PathoLessonPage config={{
    path: data.ECTOPIC_PATH, lessonNo: 12,
    title: 'Ruptured Ectopic Pregnancy: Implantation, Hemorrhage & Perfusion',
    metaTitle: 'Ectopic Pregnancy Pathophysiology | Jefney Ongeri, PA-C',
    metaDescription: 'Interactive ectopic pregnancy lesson: pelvic anatomy, trophoblast invasion, possible tubal rupture, hemoperitoneum and shock, with hCG, ultrasound and hemoglobin limitations.',
    ogDescription: 'Source-linked conceptual pelvic animation with normal implantation comparison and detailed phase-specific clinical mechanisms.',
    crumb: 'Ectopic pregnancy', normalTitle: 'Normal endometrial implantation reference',
    intro: 'Clinician-facing OB/GYN education: an ampullary ectopic implantation and a possible rupture branch. Illustrative anatomy, not an ultrasound, gestational clock, diagnostic tool or treatment protocol. Many ectopic pregnancies do not rupture.',
    deep: data.ectopicDeep,
    variationsIntro: 'Pregnancy location, tubal integrity and circulatory risk require clinical interpretation. No hormone result, symptom or initially normal blood count settles these questions alone.',
    data, Scene: EctopicPregnancyScene,
  }} />;
}