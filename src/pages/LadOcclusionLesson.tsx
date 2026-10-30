import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import LadScene from '@/components/pathophysiology/LadScene';
import * as data from '@/data/pathophysiology/ladOcclusion';

export default function LadOcclusionLesson() {
  return <PathoLessonPage config={{
    path: data.LAD_PATH, lessonNo: 4, crumb: 'LAD occlusion & MI',
    title: 'LAD Occlusion → Myocardial Ischemia → Possible Infarction',
    metaTitle: 'LAD Occlusion & Myocardial Infarction Pathophysiology | Emergency Pathophysiology Atlas',
    metaDescription: 'Interactive conceptual cardiac lesson: plaque disruption and LAD thrombosis, ATP and contractility loss, subendocardial wavefront, variable territory, troponin rise/fall and ECG territory concepts, with limits and sources.',
    ogDescription: 'Phase-by-phase conceptual LAD occlusion lesson with heart schematic, clinical signals and sources.',
    intro: 'Conceptual visual education for clinicians. A code-drawn anterior heart and short-axis schematic — not an angiogram, echocardiogram or ECG. Territory and timing vary; infarction is not inevitable and there is no universal fixed clock.',
    variationsIntro: 'Reversible ischemia and irreversible infarction are distinct. How much myocardium is lost depends on anatomy, collaterals, demand and how long and how completely flow is reduced.',
    normalTitle: 'Normal reference: patent LAD',
    data, Scene: LadScene,
  }} />;
}
