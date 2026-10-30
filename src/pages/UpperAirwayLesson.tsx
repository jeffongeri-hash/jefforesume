import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import UpperAirwayScene from '@/components/pathophysiology/UpperAirwayScene';
import AirwayObjectPanel from '@/components/pathophysiology/AirwayObjectPanel';
import * as data from '@/data/pathophysiology/upperAirway';

export default function UpperAirwayLesson() {
  return <PathoLessonPage config={{
    path: data.UPPER_AIRWAY_PATH, lessonNo: 7,
    title: 'Upper-Airway Obstruction: Croup, Epiglottitis & Foreign Body',
    metaTitle: 'Upper-Airway Emergency Comparison | Jefney Ongeri, PA-C',
    metaDescription: 'Interactive clinician education comparing croup, epiglottitis and aspirated foreign body: airway anatomy, airflow, work of breathing, detailed phase mechanisms and clinical limits.',
    ogDescription: 'Source-linked conceptual sagittal airway comparison with five controlled phases and detailed clinical mechanisms.',
    crumb: 'Upper-airway obstruction', normalTitle: 'Normal sagittal airway reference',
    intro: 'Clinician-facing, illustrative airway physiology: subglottic croup, supraglottic epiglottitis and location-dependent aspiration. Teaching phases are not a disease clock, diagnosis or treatment protocol.',
    variants: { param: 'condition', legend: 'Airway condition', options: [
      { id: 'croup', label: 'Croup', hint: 'Viral laryngotracheitis with prominent subglottic mucosal oedema; barky cough and hoarseness are characteristic, not diagnostic.' },
      { id: 'epiglottitis', label: 'Epiglottitis', hint: 'Supraglottic inflammation: epiglottis and adjacent tissues. Drooling, dysphagia and voice change vary; stridor may be absent early.' },
      { id: 'foreign-body', label: 'Foreign body', hint: 'Mechanical obstruction may be immediate. Select laryngeal, tracheal or bronchial examples and partial versus near-complete obstruction below.' },
    ] },
    deep: data.airwayDeep, Companion: AirwayObjectPanel, companionTitle: 'Location and obstruction context',
    variationsIntro: 'Overlapping sounds and symptoms cannot establish the condition. Airway assessment considers trajectory and reserve, not a mandatory sequence or reassuring oxygen reading.',
    data, Scene: UpperAirwayScene,
  }} />;
}