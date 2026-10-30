import { strokeDeep } from '@/data/pathophysiology/deepMechanisms';
import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import McaStrokeScene from '@/components/pathophysiology/McaStrokeScene';
import StrokeSymptomPanel from '@/components/pathophysiology/StrokeSymptomPanel';
import * as data from '@/data/pathophysiology/mcaStroke';

export default function McaStrokeLesson() {
  return <PathoLessonPage config={{ deep: strokeDeep,
    path: data.MCA_STROKE_PATH, lessonNo: 5, crumb: 'Ischemic stroke territories',
    title: 'Acute Ischemic Stroke: MCA, ACA, PCA and Basilar Occlusion — Territories, Core and Penumbra',
    metaTitle: 'Ischemic Stroke Territories: MCA, ACA, PCA, Basilar | Emergency Pathophysiology Atlas',
    metaDescription: 'Interactive illustrative stroke lesson: selectable MCA, ACA, PCA or basilar occlusion, lateral and medial hemisphere territory maps, laterality and dominance, collaterals, core vs penumbra, symptom associations and CTA vs perfusion limits.',
    ogDescription: 'Phase-by-phase ischemic stroke lesson with anatomically oriented territory maps, symptom associations and imaging limits.',
    intro: 'Illustrative, anatomically informed drawings for clinicians — not CT, CTA, perfusion output or a 3D model. Choose the occluded vessel and hemisphere. Territories overlap and vary, core and penumbra are estimates, and progression varies widely; there is no universal timeline.',
    variationsIntro: 'Collateral quality, territory variants and dominance are major reasons two people with the “same” occlusion can look and evolve very differently.',
    normalTitle: 'Normal reference: patent cerebral arteries',
    variants: { param: 'vessel', legend: 'Occluded vessel', options: data.VARIANTS },
    sides: { param: 'side', legend: 'Affected hemisphere', hideFor: ['basilar'] },
    Companion: StrokeSymptomPanel, companionTitle: 'Symptom associations (not diagnostic)',
    extra: [{ title: 'Imaging concept and limits', items: data.IMAGING_CONCEPT }],
    data, Scene: McaStrokeScene,
  }} />;
}
