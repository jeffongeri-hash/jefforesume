import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import HemorrhagicShockScene from '@/components/pathophysiology/HemorrhagicShockScene';
import * as data from '@/data/pathophysiology/hemorrhagicShock';

export default function HemorrhagicShockLesson() {
  return <PathoLessonPage config={{
    path: data.HEMORRHAGIC_SHOCK_PATH, lessonNo: 13,
    title: 'Hemorrhagic Shock: Filling, Compensation & Oxygen Delivery',
    metaTitle: 'Hemorrhagic Shock Pathophysiology | Jefney Ongeri, PA-C',
    metaDescription: 'Interactive hemorrhagic shock lesson: blood loss, venous return, preload, sympathetic compensation and possible organ dysfunction, with hemoglobin, lactate and coagulation limits.',
    ogDescription: 'Source-linked circulation animation with normal comparison, detailed phase mechanisms and clinical signals. Conceptual clinician education, not a treatment protocol.',
    crumb: 'Hemorrhagic shock', normalTitle: 'Normal circulatory filling and tissue oxygen delivery reference',
    intro: 'Shock & Circulation · Clinician-facing conceptual education. An illustrative circulation and separate tissue inset connect blood loss to reduced filling and possible perfusion failure. Compensation can mask hypotension; progression is not inevitable. No patient values, severity scoring or treatment algorithm.',
    deep: data.hemorrhagicDeep,
    variationsIntro: 'Blood loss, physiologic reserve and compensatory responses vary. Phases separate overlapping mechanisms, not a clinical timetable; the final state is a possible complication branch.',
    data, Scene: HemorrhagicShockScene,
  }} />;
}