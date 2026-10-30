import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import RetropharyngealScene from '@/components/pathophysiology/RetropharyngealScene';
import * as data from '@/data/pathophysiology/retropharyngealAbscess';

export default function RetropharyngealAbscessLesson() {
  return <PathoLessonPage config={{
    path: data.RETROPHARYNGEAL_PATH, lessonNo: 2, crumb: 'Retropharyngeal abscess',
    title: 'Retropharyngeal Abscess: Nodes → Phlegmon → Abscess → Spread Risk',
    metaTitle: 'Retropharyngeal Abscess Pathophysiology | Emergency Pathophysiology Atlas',
    metaDescription: 'Interactive conceptual sagittal neck lesson: retropharyngeal and danger spaces, lymph node infection, phlegmon vs abscess, airway narrowing and mediastinal spread risk, with clinical signals and sources.',
    ogDescription: 'Phase-by-phase conceptual deep neck infection lesson with fascial anatomy, clinical signals and sources.',
    intro: 'Conceptual visual education for clinicians. A code-drawn sagittal schematic of one possible progression — not a CT or radiograph, not a model of any individual. Most patients do not develop airway compromise or mediastinal spread.',
    variationsIntro: 'The retropharyngeal space, danger space and prevertebral space are distinct compartments. Infection usually begins in retropharyngeal nodes or after pharyngeal injury; spread through fascial planes is possible but not the usual course.',
    extra: [{ title: 'Imaging concept and limits', items: data.IMAGING_CONCEPT }],
    data, Scene: RetropharyngealScene,
  }} />;
}
