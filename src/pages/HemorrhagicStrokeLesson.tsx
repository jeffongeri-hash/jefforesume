import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import HemorrhagicStrokeScene from '@/components/pathophysiology/HemorrhagicStrokeScene';
import * as data from '@/data/pathophysiology/hemorrhagicStroke';

export default function HemorrhagicStrokeLesson() {
  return <PathoLessonPage config={{
    path: data.HEMORRHAGIC_STROKE_PATH, lessonNo: 6, crumb: 'Hemorrhagic stroke: ICH vs SAH',
    title: 'Hemorrhagic Stroke: Intracerebral vs Subarachnoid Haemorrhage',
    metaTitle: 'Hemorrhagic Stroke: ICH vs SAH Pathophysiology | Emergency Pathophysiology Atlas',
    metaDescription: 'Interactive illustrative lesson contrasting intracerebral and subarachnoid haemorrhage: vessel rupture, haematoma expansion risk, oedema, mass effect, hydrocephalus and raised ICP as possible outcomes, with a non-contrast CT concept, clinical signals and sources.',
    ogDescription: 'Phase-by-phase ICH vs SAH lesson with coronal brain drawing, Monro–Kellie concept, NCCT concept and sources.',
    intro: 'Illustrative, anatomically informed coronal drawing for clinicians — not a CT, MRI or 3D model. Choose intracerebral or subarachnoid haemorrhage: they bleed into different compartments and behave differently. Expansion, oedema, hydrocephalus and raised ICP are possible outcomes, not a fixed course.',
    variationsIntro: 'Intracranial haemorrhage is a group of conditions. Compartment, location, cause and anticoagulation change both presentation and course.',
    normalTitle: 'Normal reference: no haemorrhage',
    variants: { param: 'type', legend: 'Haemorrhage type', options: data.VARIANTS },
    extra: [{ title: 'Non-contrast CT concept and limits', items: data.NCCT_CONCEPT }],
    data, Scene: HemorrhagicStrokeScene,
  }} />;
}
