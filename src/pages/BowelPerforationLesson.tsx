import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import BowelPerforationScene from '@/components/pathophysiology/BowelPerforationScene';
import * as data from '@/data/pathophysiology/bowelPerforation';

export default function BowelPerforationLesson() {
  return <PathoLessonPage config={{
    path: data.BOWEL_PERFORATION_PATH, lessonNo: 1, crumb: 'Bowel perforation',
    title: 'Bowel Perforation → Peritonitis → Systemic Deterioration',
    metaTitle: 'Bowel Perforation → Peritonitis → Systemic Deterioration | Emergency Pathophysiology Atlas',
    metaDescription: 'Interactive conceptual animation of bowel perforation, peritoneal inflammation, fluid shifts, ileus and possible sepsis physiology, with clinical signals, limits and sources.',
    ogDescription: 'Phase-by-phase conceptual pathophysiology lesson with synchronized clinical signals and sources.',
    intro: 'Conceptual visual education for clinicians. This is a code-drawn schematic of one possible progression — not a CT scan, not a model of any individual, and not inevitable.',
    variationsIntro: 'Peritonitis is not synonymous with sepsis, and the host response is not a “cytokine storm” by default. Perforation permits luminal material into the peritoneal cavity; peritoneal inflammation and third spacing may contribute to intravascular volume depletion and systemic derangement.',
    data, Scene: BowelPerforationScene,
  }} />;
}
