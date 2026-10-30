// Qualitative educational states only. Animation seconds are not disease time.
import { clampTime, ramp, type GenericPhase } from './timeline';
import type { Deep } from './deepMechanisms';
export { LESSON_DURATION, clampTime, phaseAt, phaseStart, tick } from './timeline';
export const UPPER_AIRWAY_PATH = '/pathophysiology-atlas/upper-airway-obstruction';
export type Condition = 'croup' | 'epiglottitis' | 'foreign-body';
export type Level = 'larynx' | 'trachea' | 'bronchus';
export const conditionFor = (v?: string): Condition => v === 'epiglottitis' || v === 'foreign-body' ? v : 'croup';
export const levelFor = (v: string | null): Level => v === 'trachea' || v === 'bronchus' ? v : 'larynx';
export const STRUCTURES = {
  nose: { label: 'Nasal cavity', explanation: 'Air passes behind the nose into the nasopharynx; anterior is left in this sagittal illustration.' },
  tongue: { label: 'Tongue / oral cavity', explanation: 'The tongue lies anterior to the oropharynx; this is an orientation landmark, not an examination demonstration.' },
  pharynx: { label: 'Pharynx', explanation: 'Nasopharynx, oropharynx and hypopharynx connect the nose and mouth to the laryngeal inlet. The oesophagus continues posterior to the airway.' },
  epiglottis: { label: 'Epiglottis / supraglottis', explanation: 'The epiglottis is a leaf-shaped structure behind the tongue, above the vocal folds. Epiglottitis often involves adjacent supraglottic tissues, not just this leaf.' },
  glottis: { label: 'Glottis (vocal-fold level)', explanation: 'The opening between the vocal folds. This midline slice marks its level; it does not show the true paired folds or measure the opening.' },
  subglottis: { label: 'Subglottis / cricoid level', explanation: 'Below the vocal folds, the airway is encircled by the cricoid cartilage. Croup-related mucosal oedema is especially consequential here in a small pediatric airway.' },
  trachea: { label: 'Trachea', explanation: 'Conducting airway below the cricoid. A mobile or lodged foreign body can cause variable obstruction; a fixed central lesion may cause biphasic noise.' },
  oesophagus: { label: 'Oesophagus', explanation: 'Food passage behind the larynx and trachea. An aspirated object is in the respiratory tract, not here.' },
  object: { label: 'Foreign body (illustrative)', explanation: 'Generic object, not to scale. Its position, shape, mobility and seal determine obstruction; distal bronchial aspiration may cause unilateral wheeze or reduced breath sounds rather than stridor.' },
  chest: { label: 'Breathing effort / downstream lungs', explanation: 'A separate conceptual inset, not part of the sagittal slice. Retractions reflect increased negative inspiratory pressure; less noise or effort with exhaustion need not mean improvement.' },
};
export type StructureId = keyof typeof STRUCTURES;
export const SOURCES = [
  { name: 'Royal Children’s Hospital: Acute upper airway obstruction', url: 'https://www.rch.org.au/clinicalguide/guideline_index/acute_upper_airway_obstruction/' },
  { name: 'Royal Children’s Hospital: Croup (Laryngotracheobronchitis)', url: 'https://www.rch.org.au/clinicalguide/guideline_index/croup_laryngotracheobronchitis/' },
  { name: 'Royal Children’s Hospital: Foreign body inhalation', url: 'https://www.rch.org.au/clinicalguide/guideline_index/Foreign_body_inhalation/' },
  { name: 'Canadian Paediatric Society: Acute management of croup in the emergency department', url: 'https://cps.ca/documents/position/acute-management-of-croup' },
  { name: 'MSD Manual Professional: Epiglottitis (ENT; reviewed June 2026)', url: 'https://www.msdmanuals.com/professional/ear-nose-and-throat-disorders/oral-and-pharyngeal-disorders/epiglottitis' },
];
const common = {
  normal: { name: 'Normal anatomy and quiet airflow', short: 'Normal anatomy' },
  cause: { name: 'Initiating cause at a distinct airway level', short: 'Initiating cause' },
  narrowing: { name: 'Evolving obstruction and disturbed airflow', short: 'Obstruction' },
  effort: { name: 'Pressure cost and work of breathing', short: 'Airflow / effort' },
  risk: { name: 'Possible fatigue and deterioration — not inevitable', short: 'Deterioration risk' },
};
type Content = { explanation: string; bedside: string[]; sections: { h: string; t: string }[] };
const content: Record<Condition, Record<keyof typeof common, Content>> = {
  croup: {
    normal: { explanation: 'Patent supraglottis, glottis and subglottis connect the pharynx to the trachea. A child’s small absolute airway calibre makes mucosal swelling important.', bedside: ['Normal reference: no obstruction modelled.'], sections: [
      { h: 'Anatomy → pressure and flow', t: 'The epiglottis sits above the vocal folds; the subglottis lies below them within the cricoid framework. A normal inspiratory pressure gradient draws air through a patent lumen. Airway geometry, tissue compliance and flow rate all influence resistance; a sagittal width is not a measured cross-sectional area.' },
      { h: 'Why age matters', t: 'In a small pediatric airway, similar absolute mucosal swelling occupies a larger fraction of the lumen. The familiar inverse fourth-power radius relation describes ideal laminar flow through a rigid tube only; real laryngeal flow is irregular and may be turbulent, so it is not a bedside severity calculator.' },
    ] },
    cause: { explanation: 'Usually a viral laryngotracheitis; mucosal inflammation and oedema develop, prominently in the subglottic airway. Not every viral upper respiratory illness becomes croup.', bedside: ['Coryza or fever may precede a barky cough and hoarseness.', 'Clinical course and fever vary; the symptoms are not exclusive to croup.'], sections: [
      { h: 'Viral infection → mucosal oedema', t: 'Respiratory viruses (commonly parainfluenza, but not exclusively) infect airway epithelium. Local inflammatory signalling increases vascular permeability and interstitial fluid, with mucosal oedema and secretions in the larynx and trachea. The comparatively constrained subglottic segment is a characteristic site of consequential narrowing.' },
      { h: 'Why the cough and voice change', t: 'Inflammation alters laryngeal vibration and upper-airway acoustic properties, producing the characteristic bark-like cough and hoarseness. Coryza and fever reflect the associated infection but vary; marked toxicity or drooling suggests an alternative process rather than confirming croup.' },
    ] },
    narrowing: { explanation: 'Subglottic oedema reduces the lumen; faster and more disturbed airflow can generate stridor, often most apparent during inspiration.', bedside: ['Inspiratory stridor may initially occur only with agitation; stridor at rest can accompany greater obstruction.', 'Barky cough and hoarseness commonly accompany croup; sound intensity does not reliably measure severity.'], sections: [
      { h: 'Narrowing → disturbed flow', t: 'To maintain ventilation through a narrower segment requires a greater pressure difference. Higher local velocities and turbulent flow increase energy losses and can excite airway tissue vibration: stridor. Inspiratory negative pressure may accentuate extrathoracic narrowing, although the cricoid itself is a rigid framework; this illustration shows mucosal encroachment, not collapse of cartilage.' },
      { h: 'Stridor is not wheeze', t: 'Stridor generally localizes to upper or central airway narrowing and is often inspiratory in extrathoracic obstruction. Wheeze is usually a musical expiratory sound from lower-airway narrowing. Biphasic stridor, transmitted sounds and coexisting lower-airway disease blur this distinction; the sound alone neither identifies a cause nor grades the obstruction.' },
    ] },
    effort: { explanation: 'Greater inspiratory pressure is required to draw air through the narrowed airway, increasing effort and potentially causing retractions.', bedside: ['Suprasternal or intercostal recession, tachypnea and agitation may occur.', 'Preserved oxygen saturation can coexist with substantial work of breathing.'], sections: [
      { h: 'Pressure burden → retractions', t: 'Respiratory muscles generate more negative intrathoracic pressure to overcome resistive losses. Compliant chest-wall tissues retract, and accessory-muscle recruitment raises oxygen demand. Faster breathing can compensate temporarily, but obstruction may limit tidal volume and effective alveolar ventilation.' },
      { h: 'Compensation is not reserve', t: 'Pulse oximetry reports arterial oxygenation, not effort, airway calibre or carbon-dioxide clearance. Saturation may remain normal while the pressure cost of each breath rises. It cannot exclude impending deterioration; agitation, trajectory, air entry and mental state remain important clinical context.' },
    ] },
    risk: { explanation: 'In severe persistent obstruction, fatigue may reduce effective ventilation and air movement. This is a possible complication, not the typical or inevitable endpoint.', bedside: ['Exhaustion, altered responsiveness, reduced air entry or cyanosis are concerning.', 'Quieter stridor with poor air movement may be deterioration rather than recovery.'], sections: [
      { h: 'Fatigue → ventilation failure risk', t: 'Sustained resistive loading can exceed respiratory-muscle reserve. Falling tidal volume and air entry can reduce alveolar ventilation, with carbon-dioxide retention and respiratory acidosis; inadequate ventilation can later impair oxygenation. No fixed timing or saturation threshold is implied.' },
      { h: 'Why quiet can be dangerous', t: 'A noisy airway requires moving air. Stridor may soften when airflow falls, even while obstruction or exhaustion worsens. Severe croup is uncommon compared with mild illness, and most cases do not progress to complete obstruction; the risk branch shown here is not a prediction.' },
    ] },
  },
  epiglottitis: {
    normal: { explanation: 'The epiglottis lies behind the tongue above the glottis; surrounding supraglottic tissues form the laryngeal inlet.', bedside: ['Normal reference: unobstructed laryngeal inlet.'], sections: [
      { h: 'Supraglottic orientation', t: 'The epiglottis and aryepiglottic region surround the inlet above the true vocal folds. Their swelling affects a different level from the characteristic subglottic narrowing of croup. This midline slice simplifies a three-dimensional inlet and cannot show its true area.' },
      { h: 'Air and swallowing', t: 'The pharynx carries both air and swallowed material, while the larynx protects the respiratory tract during coordinated swallowing. Normal secretions are swallowed comfortably; drooling during illness may reflect painful or difficult swallowing, not necessarily excess saliva production.' },
    ] },
    cause: { explanation: 'Infectious supraglottitis can cause rapidly evolving inflammation of the epiglottis and adjacent tissues; Hib vaccination changes epidemiology but does not eliminate the condition.', bedside: ['Fever, severe sore throat or painful swallowing can occur.', 'Presentation differs by age, organism and vaccination status.'], sections: [
      { h: 'Infection → supraglottic inflammation', t: 'Bacterial infection produces mucosal inflammatory-cell recruitment, hyperemia and vascular leak in the epiglottis and often adjacent supraglottic tissues. Hib was historically prominent in children; vaccination reduced Hib disease, while other organisms and adult cases remain relevant. Not every case is Hib or has a classic pediatric presentation.' },
      { h: 'Pain → swallowing difficulty', t: 'Inflamed supraglottic tissue makes swallowing painful and may impede handling secretions. Fever reflects the host response; severe throat pain can coexist with an unimpressive visible mouth examination. This lesson does not demonstrate examination maneuvers.' },
    ] },
    narrowing: { explanation: 'Epiglottic and adjacent supraglottic oedema can crowd the laryngeal inlet; this is not the subglottic lesion of croup.', bedside: ['Drooling, dysphagia and muffled voice can accompany supraglottic swelling.', 'Barky cough is less characteristic than in croup; stridor may be absent early.'], sections: [
      { h: 'Swollen inlet → airflow loss', t: 'Oedema increases epiglottic thickness and can involve the aryepiglottic folds and arytenoid region, reducing the effective inlet. Resistance rises nonlinearly as geometry changes. The drawing therefore enlarges the leaf and adjacent tissues rather than portraying the epiglottis as a lid that inevitably seals shut.' },
      { h: 'Clinical expression and its limits', t: 'Dysphagia and odynophagia can impair swallowing of saliva, causing drooling. Swollen supraglottic tissues alter resonance and may produce a muffled voice. These findings overlap with other deep-neck illnesses; absence of stridor does not prove a safe airway, and symptoms alone do not establish epiglottitis.' },
    ] },
    effort: { explanation: 'A narrowed inlet may increase inspiratory effort and stridor; some patients adopt a forward-leaning posture to preserve comfortable airflow.', bedside: ['Respiratory distress, stridor or a preferred upright/forward posture may occur.', 'Normal oxygen saturation does not exclude an unstable airway.'], sections: [
      { h: 'Geometry → pressure cost and posture', t: 'Greater negative inspiratory pressure is needed across the restricted inlet. Airflow can become turbulent, with inspiratory stridor and suprasternal retractions. A forward-leaning posture may optimize airway geometry and comfort in some patients; it is neither universal nor a maneuver this lesson instructs users to perform.' },
      { h: 'Airway risk before desaturation', t: 'A patient may maintain oxygenation through increased effort despite marked narrowing. Oximetry does not measure reserve or predict sudden changes. The clinical concern is the combination of symptoms, effort, secretions, air movement and progression, not a single reading or a compulsory sequence of signs.' },
    ] },
    risk: { explanation: 'Severe swelling may compromise ventilation; rapidly changing obstruction and fatigue are potential emergencies, not outcomes in every case.', bedside: ['Reduced air entry, exhaustion, altered responsiveness or cyanosis indicate serious concern.', 'Airway and systemic infection risks can coexist; no staged timeline applies to an individual.'], sections: [
      { h: 'Loss of reserve → possible deterioration', t: 'Further oedema or altered airway mechanics can markedly reduce effective airflow. Respiratory fatigue then lowers ventilation; carbon dioxide may rise and oxygenation may deteriorate. Severe obstruction can develop without all preceding classic features, and this animation deliberately retains a residual lumen rather than asserting complete obstruction in every case.' },
      { h: 'Systemic and assessment limits', t: 'Infection can also cause bacteremia or systemic illness, but these are not inevitable. Airway assessment by an emergency team takes priority over confirming a label through routine tests; provocative throat examination or unnecessary agitation can worsen a threatened airway. No examination, procedure or medication instructions are supplied here.' },
    ] },
  },
  'foreign-body': {
    normal: { explanation: 'The conducting airway is patent; the lower inset shows branching toward both lungs, outside the midline sagittal slice.', bedside: ['Normal reference: no object in the airway.'], sections: [
      { h: 'Airway versus food passage', t: 'The larynx and trachea lie anterior to the oesophagus. Aspiration means material enters the respiratory tract; swallowing an object into the oesophagus is a different mechanism. The lower branching inset is explicitly separate from sagittal anatomy.' },
      { h: 'A location-dependent problem', t: 'A laryngeal, tracheal or bronchial object affects different airway geometry. Central obstruction can threaten airflow to both lungs; a distal bronchial object may cause local air trapping or atelectasis and unilateral findings without upper-airway stridor.' },
    ] },
    cause: { explanation: 'An aspirated object can lodge at the larynx, trachea or a bronchus; the initial obstruction can be immediate, not a slow inflammatory sequence.', bedside: ['Sudden cough or choking during eating or play may be a clue; the event may be unwitnessed.', 'A transient quiet interval does not exclude a retained foreign body.'], sections: [
      { h: 'Mechanical entry → immediate obstruction', t: 'Material passing through the laryngeal inlet can lodge or move along the conducting airway. Size, shape, orientation and mobility determine how much airflow is blocked. Abrupt severe obstruction need not pass through each illustrated phase; the timeline separates mechanisms, not a mandatory clinical sequence.' },
      { h: 'Why history can be missing', t: 'Protective cough may occur at entry, but aspiration is often unwitnessed and symptoms may briefly improve after an object travels distally. Neither absent recalled choking nor a later quieter interval excludes aspiration. Organic material can provoke additional local inflammation over time.' },
    ] },
    narrowing: { explanation: 'The object mechanically reduces available lumen. Partial, near-complete and distal ball-valve patterns differ and can change with object movement.', bedside: ['Laryngeal obstruction may cause stridor or voice change; tracheal obstruction can produce biphasic noise.', 'Bronchial aspiration may produce focal wheeze or asymmetric air entry; findings may also be subtle.'], sections: [
      { h: 'Level and degree → different sounds', t: 'Extrathoracic laryngeal obstruction often produces inspiratory stridor; a fixed central airway lesion may be biphasic. A bronchial object more often produces unilateral wheeze or diminished breath sounds. These are localization clues only, with overlap and variable findings, not proof of location.' },
      { h: 'Partial seal and ball-valve behavior', t: 'An incompletely occluding object may permit some airflow. In a distal bronchus, inspiratory expansion may admit air while expiratory narrowing restricts escape, causing ball-valve air trapping. Other objects obstruct in both directions, allowing downstream gas absorption and atelectasis. These mechanisms are alternatives, not inevitable consecutive stages.' },
    ] },
    effort: { explanation: 'Central resistance may increase work of breathing; distal obstruction can impair one lung region through air trapping or collapse.', bedside: ['Retractions and respiratory distress can accompany substantial central obstruction.', 'Distal obstruction may have localized findings with preserved saturation and relatively little visible distress.'], sections: [
      { h: 'Central loading versus regional ventilation', t: 'A central object increases resistive pressure losses affecting both lungs. With bronchial obstruction, the main problem may instead be uneven regional ventilation and ventilation–perfusion mismatch. Air trapping can overdistend a region; complete distal blockage can lead to resorption atelectasis. The inset demonstrates affected-side airflow, not a radiograph.' },
      { h: 'Why saturation and effort can mislead', t: 'An unaffected lung or increased effort can preserve oxygenation despite retained aspiration. Normal saturation does not exclude impending central deterioration or distal disease. Conversely, loss of effective cough or quieter breath sounds with exhaustion may reflect reduced airflow, not spontaneous object removal.' },
    ] },
    risk: { explanation: 'A mobile central object may worsen abruptly; persistent distal obstruction can cause local complications rather than universal complete airway blockage.', bedside: ['Poor air movement, ineffective cough, altered responsiveness or cyanosis are emergency concerns.', 'Retained distal objects may present later with persistent cough, focal wheeze or recurrent infection.'], sections: [
      { h: 'Different deterioration pathways', t: 'A central object can shift or seal more tightly, sharply reducing ventilation; fatigue, hypercapnia and hypoxemia may follow. A bronchial object can remain partially obstructing, with localized air trapping or collapse and later inflammation or post-obstructive infection. Neither pathway is mandatory, and the displayed degree is a chosen illustration, not a severity prediction.' },
      { h: 'Inflammation and delayed findings', t: 'A retained object irritates mucosa; oedema and granulation can add to the mechanical narrowing. Secondary infection can cause fever and inflammatory-marker elevation, but early aspiration may have no fever or lab abnormality. Assessment is driven by history and clinical concern, not a reassuring test in isolation.' },
    ] },
  },
};
const investigation: Record<Condition, { h: string; t: string }> = {
  croup: { h: 'Labs and imaging: what they cannot settle', t: 'Typical croup is a clinical diagnosis; routine laboratory tests and imaging are generally unnecessary. Viral testing does not grade obstruction. White-cell count and CRP can be variable and nonspecific. A subglottic narrowing sign on a radiograph is neither required nor sufficiently specific to establish the diagnosis; no fake scan is shown.' },
  epiglottitis: { h: 'Labs and imaging: airway assessment first', t: 'Leukocytosis or elevated CRP can reflect inflammatory marrow and hepatic responses but do not confirm supraglottitis or quantify narrowing. Cultures may identify an organism but can be negative. A lateral-neck swelling sign is only a diagnostic concept: imaging is not a prerequisite and must not delay assessment of a threatened airway. Examination and investigation require appropriate clinical expertise; no risky technique is demonstrated.' },
  'foreign-body': { h: 'Labs and imaging: a normal study is not exclusion', t: 'Early mechanical aspiration has no required lab signature. Most inhaled objects are radiolucent; a normal chest radiograph and normal examination do not exclude a retained foreign body. Air trapping or atelectasis are indirect, variable findings. Fever, white-cell count or CRP may rise with secondary inflammation or infection but are nonspecific and do not locate the object.' },
};
export function phasesFor(v: string): GenericPhase<StructureId>[] {
  const condition = conditionFor(v);
  return (Object.keys(common) as (keyof typeof common)[]).map(id => ({ id, ...common[id], explanation: content[condition][id].explanation, bedside: content[condition][id].bedside,
    focus: condition === 'croup' ? ['subglottis', 'trachea'] : condition === 'epiglottitis' ? ['epiglottis', 'glottis'] : ['object', 'trachea', 'chest'],
    labs: [{ name: id === 'risk' ? 'Ventilation / blood gas when clinically relevant' : 'Laboratory context', trend: id === 'risk' ? 'CO₂ may rise if effective ventilation fails' : 'No defining lab pattern', mechanism: id === 'risk' ? 'Reduced alveolar ventilation can cause carbon-dioxide retention and respiratory acidosis; oxygenation may worsen later.' : investigation[condition].t, limit: 'No number, normal saturation or isolated test excludes a threatened airway; tests must not delay emergency assessment.' }],
  }));
}
export const PHASES = phasesFor('croup');
export function airwayDeep(v: string, id: string): Deep | undefined {
  const c = conditionFor(v); const x = content[c][id as keyof typeof common];
  return x ? { sections: [...x.sections, investigation[c]], refs: c === 'croup' ? [SOURCES[1], SOURCES[3], SOURCES[0]] : c === 'epiglottitis' ? [SOURCES[4], SOURCES[0]] : [SOURCES[2], SOURCES[0]] } : undefined;
}
export function sceneState(time: number, v?: string, normal = false, level: Level = 'larynx', degree: 'partial' | 'near-complete' = 'partial') {
  const condition = conditionFor(v); const t = clampTime(time);
  const cause = normal ? 0 : ramp(t, 5, 8);
  const narrowing = normal ? 0 : condition === 'foreign-body' ? cause : ramp(t, 10, 14);
  const effort = normal ? 0 : ramp(t, 15, 19);
  const risk = normal ? 0 : ramp(t, 20, 24);
  const patency = 1 - narrowing * (condition === 'foreign-body' ? (degree === 'near-complete' ? 0.92 : 0.5) : condition === 'epiglottitis' ? 0.68 : 0.57);
  return { condition, level, cause, narrowing, effort, risk, patency, flow: Math.max(0.03, patency * (1 - risk * 0.32)), subglottic: condition === 'croup' ? narrowing : 0, supraglottic: condition === 'epiglottitis' ? narrowing : 0, object: condition === 'foreign-body' ? cause : 0 };
}
export const VARIATIONS = [
  { title: 'Not a disease clock', text: 'Five phases separate teaching mechanisms, not minutes, severity grades or an inevitable progression. Aspiration can cause immediate severe obstruction.' },
  { title: 'Stridor versus wheeze', text: 'Inspiratory stridor suggests extrathoracic obstruction; biphasic noise can occur with fixed central narrowing; wheeze often reflects lower-airway narrowing. Patterns overlap and may be absent.' },
  { title: 'Population differences', text: 'Croup commonly affects young children; epiglottitis is now less often pediatric Hib disease and also occurs in adults. Airway anatomy and presentations vary.' },
  { title: 'Oximetry and quiet breathing', text: 'Normal saturation does not exclude impending deterioration. Less noise or effort with exhaustion and poor air entry is not necessarily improvement.' },
  { title: 'Foreign-body variability', text: 'Level, shape, mobility, degree of seal and associated inflammation vary. Bronchial aspiration is included as a comparison to upper-airway obstruction, not mislabeled as subglottic disease.' },
];
export const CANNOT_DETERMINE = ['A diagnosis or actual airway calibre from these illustrative shapes.', 'An individual’s reserve, oxygen saturation, carbon-dioxide level or future course.', 'The location or absence of an aspirated object from symptoms, a normal examination or a normal radiograph.', 'Treatment, examination maneuvers, procedure choice or drug dosing.'];
export const ESCALATION_NOTE = 'Suspected epiglottitis or airway foreign body, stridor with distress, drooling with difficulty swallowing, poor air movement, exhaustion, altered responsiveness or cyanosis needs prompt emergency assessment; severe breathing difficulty warrants emergency services immediately. Normal oxygen saturation is not reassurance against impending deterioration. No patient-specific treatment or examination instructions are provided.';