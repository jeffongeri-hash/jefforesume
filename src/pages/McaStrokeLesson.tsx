import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import McaStrokeScene from '@/components/pathophysiology/McaStrokeScene';
import * as data from '@/data/pathophysiology/mcaStroke';

export default function McaStrokeLesson() {
  return <PathoLessonPage config={{
    path: data.MCA_STROKE_PATH, lessonNo: 5, crumb: 'MCA ischemic stroke',
    title: 'Acute Ischemic Stroke: MCA Occlusion, Collaterals, Core and Penumbra',
    metaTitle: 'MCA Ischemic Stroke: Core & Penumbra | Emergency Pathophysiology Atlas',
    metaDescription: 'Interactive conceptual stroke lesson: MCA occlusion, leptomeningeal collaterals, ischemic core vs potentially salvageable penumbra, and a conceptual NCCT/CTA/CT perfusion comparison with imaging limits and sources.',
    ogDescription: 'Phase-by-phase conceptual MCA stroke lesson with collateral, core/penumbra and imaging-limit content.',
    intro: 'Conceptual visual education for clinicians. A code-drawn lateral-hemisphere schematic with conceptual imaging icons — not CT, CTA or perfusion output. Core and penumbra boundaries are estimates and progression varies widely.',
    variationsIntro: 'Collateral quality is a major reason two people with the same occlusion can have very different tissue fates over the same time.',
    normalTitle: 'Normal reference: patent MCA',
    extra: [{ title: 'Imaging concept and limits', items: data.IMAGING_CONCEPT }],
    data, Scene: McaStrokeScene,
  }} />;
}
