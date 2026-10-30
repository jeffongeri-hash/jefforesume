// Pure, React-free lesson data and conceptual state for the retropharyngeal abscess lesson.
// All scene values are 0–1 qualitative animation intensities — never patient values or measurements.
import type { Phase as BasePhase } from './bowelPerforation';

export const RETROPHARYNGEAL_PATH = '/pathophysiology-atlas/retropharyngeal-abscess';
export const PHASE_SECONDS = 5;
export const PHASE_COUNT = 5;
export const LESSON_DURATION = PHASE_SECONDS * PHASE_COUNT;

export type StructureId =
  | 'pharynx' | 'airway' | 'buccopharyngeal-fascia' | 'retropharyngeal-space' | 'lymph-nodes'
  | 'alar-fascia' | 'danger-space' | 'prevertebral-fascia' | 'cervical-spine' | 'mediastinum' | 'collection';

export const STRUCTURES: Record<StructureId, { label: string; explanation: string }> = {
  pharynx: { label: 'Posterior pharyngeal wall', explanation: 'Mucosa and constrictor muscles forming the back wall of the naso-, oro- and hypopharynx. Swelling behind it can push it forward into the airway.' },
  airway: { label: 'Pharyngeal airway', explanation: 'Shared air and food passage. Its calibre depends on surrounding soft tissue; forward displacement of the posterior wall may narrow it in some patients, but not all.' },
  'buccopharyngeal-fascia': { label: 'Buccopharyngeal fascia (visceral layer)', explanation: 'Covers the posterior surface of the pharyngeal constrictors and forms the anterior boundary of the retropharyngeal space.' },
  'retropharyngeal-space': { label: 'Retropharyngeal space', explanation: 'Potential space between buccopharyngeal fascia (anterior) and alar fascia (posterior), from the skull base to roughly the upper thoracic level, where the two layers fuse. A midline raphe divides it into two lateral compartments.' },
  'lymph-nodes': { label: 'Retropharyngeal lymph nodes', explanation: 'Drain the nasopharynx, adenoids, sinuses, middle ear and pharynx. They are prominent in young children and typically regress with age — one reason this infection is more common in early childhood, though adults are affected too (e.g., after trauma, foreign body or instrumentation).' },
  'alar-fascia': { label: 'Alar fascia', explanation: 'Layer of deep cervical fascia forming the posterior boundary of the retropharyngeal space and the anterior boundary of the danger space.' },
  'danger-space': { label: 'Danger space', explanation: 'Between alar and prevertebral fascia, extending from the skull base to the posterior mediastinum near the diaphragm. Loose areolar tissue offers little barrier, so infection that breaches here is a recognised route toward the mediastinum.' },
  'prevertebral-fascia': { label: 'Prevertebral fascia', explanation: 'Covers the prevertebral muscles and vertebral bodies; posterior boundary of the danger space. The prevertebral space lies behind it.' },
  'cervical-spine': { label: 'Cervical spine', explanation: 'Vertebral bodies and discs posterior to the fascial spaces. Inflammation of adjacent prevertebral tissues may cause pain with neck movement, especially extension; spinal infection is a separate differential.' },
  mediastinum: { label: 'Posterior mediastinum', explanation: 'Thoracic compartment reached via the danger space (and less often other routes). Mediastinitis is an uncommon but serious complication shown here as a risk only.' },
  collection: { label: 'Phlegmon / abscess', explanation: 'Phlegmon: diffuse inflammatory oedema and cellulitis without a discrete pus cavity. Abscess: a localised pus collection, often with an enhancing rim on contrast imaging. The two lie on a spectrum and imaging cannot always separate them.' },
};

export type Phase = BasePhase & { focus: StructureId[] };

export const PHASES: Phase[] = [
  {
    id: 'normal', name: 'Normal sagittal anatomy and fascial boundaries', short: 'Normal anatomy',
    explanation: 'Behind the pharynx lie stacked fascial layers: buccopharyngeal fascia, the retropharyngeal space, alar fascia, the danger space, and prevertebral fascia over the cervical spine. Normally these are thin potential spaces with a slim prevertebral soft-tissue band.',
    focus: ['pharynx', 'retropharyngeal-space', 'danger-space', 'cervical-spine'],
    bedside: ['Reference state: no infection modelled.', 'Note the anatomy separately from disease — the spaces are potential, not open cavities.'],
    labs: [{ name: 'Labs', trend: 'Reference', mechanism: 'No infection is modelled in this phase.', limit: 'Normal labs do not exclude early deep neck infection.' }],
  },
  {
    id: 'seeding', name: 'Infection seeds retropharyngeal lymph nodes', short: 'Node involvement',
    explanation: 'Often after an upper respiratory, pharyngeal, dental or ear infection, organisms drain to retropharyngeal nodes, which can become inflamed (reactive or suppurative lymphadenitis). Penetrating pharyngeal injury, foreign body or instrumentation is another route, especially in adults. Common organisms include group A streptococcus, Staphylococcus aureus and oral anaerobes, often mixed.',
    focus: ['lymph-nodes', 'retropharyngeal-space'],
    bedside: ['Fever and sore throat may follow or overlap a recent upper respiratory illness.', 'Early features can mimic common pharyngitis and may be nonspecific, particularly in young children.'],
    labs: [{ name: 'White cell count / neutrophils', trend: '↑ may occur', mechanism: 'Bone-marrow release and demargination of neutrophils driven by inflammatory mediators.', limit: 'Variable and nonspecific; also elevated in simple pharyngitis and other infections; may be normal.' }],
  },
  {
    id: 'phlegmon', name: 'Retropharyngeal cellulitis / phlegmon', short: 'Phlegmon',
    explanation: 'Inflammation spreads into the loose tissue of the retropharyngeal space as diffuse oedema without a discrete pus cavity. The prevertebral soft tissue thickens and the posterior pharyngeal wall begins to bulge. Some phlegmons resolve without forming an abscess.',
    focus: ['collection', 'retropharyngeal-space', 'pharynx'],
    bedside: ['Neck pain and stiffness, often with reluctance or pain on neck extension (prevertebral inflammation) — can mimic meningism.', 'Dysphagia or odynophagia as the posterior wall swells; reduced oral intake.'],
    labs: [{ name: 'CRP', trend: '↑ may occur', mechanism: 'IL-6–driven hepatic acute-phase protein synthesis during inflammation.', limit: 'Nonspecific; lags clinical onset; does not distinguish phlegmon from abscess or locate the infection.' }],
  },
  {
    id: 'abscess', name: 'Abscess formation, swelling and possible airway narrowing', short: 'Abscess / swelling',
    explanation: 'Liquefaction can produce a walled pus collection. The mass effect pushes the posterior pharyngeal wall forward and may narrow the pharyngeal airway. The degree of narrowing varies widely — many patients do not develop airway compromise, but a minority can.',
    focus: ['collection', 'airway', 'pharynx'],
    bedside: ['Drooling may occur when swallowing saliva becomes painful or obstructed.', 'Voice change (muffled or “hot potato”) and noisy breathing; stridor or respiratory distress, when present, signals airway concern.', 'Torticollis or limited neck movement may be seen.'],
    labs: [
      { name: 'White cell count / CRP', trend: 'Often ↑', mechanism: 'Ongoing inflammatory response to a pus collection.', limit: 'Cannot confirm an abscess or its size; levels overlap with phlegmon and other infections.' },
      { name: 'Blood cultures', trend: 'Often negative', mechanism: 'Localised infection may not seed the bloodstream.', limit: 'A negative culture does not exclude a deep neck abscess.' },
    ],
  },
  {
    id: 'spread', name: 'Potential complications: spread toward the mediastinum and systemic illness', short: 'Spread risk',
    explanation: 'In a minority, infection can breach the alar fascia into the danger space and track toward the posterior mediastinum. Other possible complications include airway obstruction, spontaneous rupture with aspiration, internal jugular thrombophlebitis, carotid involvement, epidural abscess and sepsis. These are risks that motivate urgent evaluation, not an inevitable course.',
    focus: ['danger-space', 'mediastinum', 'alar-fascia'],
    bedside: ['Chest or back pain, worsening breathing or systemic toxicity may raise concern for spread — but these signs are neither sensitive nor specific.', 'Perfusion concern: tachycardia, hypotension, altered mentation or poor peripheral perfusion may indicate sepsis physiology.'],
    labs: [
      { name: 'Lactate', trend: '↑ may occur when relevant', mechanism: 'If sepsis develops: tissue hypoperfusion, adrenergic aerobic glycolysis, reduced clearance and microcirculatory dysfunction.', limit: 'Usually not informative for localised neck infection; nonspecific and cannot diagnose mediastinitis or abscess.' },
      { name: 'Organ function markers', trend: 'May worsen', mechanism: 'Creatinine, bilirubin, platelets and coagulation tests can reflect evolving organ dysfunction (Sepsis-3).', limit: 'Interpret against baseline and the overall clinical picture.' },
    ],
  },
];

export const IMAGING_CONCEPT = [
  'Lateral neck radiograph: may show widening of the prevertebral soft tissues or gas. Limits: neck flexion, expiration and crying can falsely widen the shadow; a normal film does not exclude infection. No thresholds are given here.',
  'Contrast-enhanced CT: commonly used to define extent, distinguish phlegmon from a likely drainable collection and look for spread. Limits: rim enhancement does not always mean drainable pus, and early phlegmon may be indistinct. Radiation and contrast are considered, especially in children.',
  'MRI or ultrasound may have selected roles. Imaging must never delay airway assessment in a patient with airway compromise.',
  'This lesson intentionally shows no simulated scan — the scene above is a schematic, not an image of a patient.',
];

export const VARIATIONS = [
  { title: 'Children vs adults', text: 'Most cases occur in young children with prominent retropharyngeal nodes; in adults, trauma, foreign body, instrumentation, dental sources and immunocompromise are more prominent.' },
  { title: 'Phlegmon vs abscess', text: 'A spectrum; some phlegmons resolve with medical therapy, others progress. The distinction is clinical and radiologic and can change over time.' },
  { title: 'Airway variation', text: 'Many patients maintain a patent airway. Airway compromise occurs in a minority and depends on size, location, age and airway calibre.' },
  { title: 'Differentials', text: 'Epiglottitis, peritonsillar abscess, meningitis, cervical spine infection, calcific tendinitis of longus colli and foreign body can overlap clinically.' },
  { title: 'Treatment context', text: 'Management (antimicrobials, observation, and in selected cases drainage) is individualised by the treating team; this mechanism does not by itself determine the approach.' },
];

export const CANNOT_DETERMINE = [
  'Whether any individual has phlegmon, abscess or neither.',
  'The size, location or extent of a collection, or whether it has spread.',
  'How narrowed a given airway is or will become — most patients do not develop airway compromise.',
  'A diagnosis, which requires clinical assessment, appropriate imaging and laboratory testing.',
  'Treatment urgency or approach; a collection does not automatically mean surgical drainage.',
];

export const ESCALATION_NOTE = 'Educational note: difficulty breathing, noisy breathing or stridor, drooling or inability to swallow, a muffled voice with fever and neck pain, or a child who looks unwell are reasons to seek emergency care immediately. This lesson gives no patient-specific advice, airway or procedural instructions, or dosing.';

export const SOURCES = [
  { name: 'StatPearls: Retropharyngeal Abscess (NCBI Bookshelf)', url: 'https://www.ncbi.nlm.nih.gov/books/NBK441873/' },
  { name: 'Craig FW, Schunk JE. Retropharyngeal abscess in children: clinical presentation, utility of imaging, and current management. Pediatrics 2003', url: 'https://doi.org/10.1542/peds.111.6.1394' },
  { name: 'Merck Manual Professional: Retropharyngeal Abscess', url: 'https://www.merckmanuals.com/professional/ear,-nose,-and-throat-disorders/oral-and-pharyngeal-disorders/retropharyngeal-abscess' },
  { name: 'Vieira F, Allen SM, Stocks RM, Thompson JW. Deep neck infection. Otolaryngol Clin North Am 2008 (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Vieira+Deep+neck+infection+Otolaryngol+Clin+North+Am+2008' },
  { name: 'StatPearls: Anatomy, Head and Neck, Danger Space (NCBI Bookshelf)', url: 'https://www.ncbi.nlm.nih.gov/books/?term=danger+space+anatomy' },
  { name: 'Singer M, et al. Sepsis-3 consensus definitions, JAMA 2016', url: 'https://jamanetwork.com/journals/jama/fullarticle/2492881' },
];

export const clampTime = (t: number) => Math.max(0, Math.min(LESSON_DURATION - 0.001, t));
export const phaseAt = (t: number) => Math.min(PHASE_COUNT - 1, Math.floor(clampTime(t) / PHASE_SECONDS));
export const phaseStart = (i: number) => Math.max(0, Math.min(PHASE_COUNT - 1, i)) * PHASE_SECONDS;
export const tick = (t: number, dt: number, speed: number) => {
  const next = t + dt * speed;
  return next >= LESSON_DURATION ? { time: LESSON_DURATION - 0.001, playing: false } : { time: next, playing: true };
};
const ramp = (t: number, a: number, b: number) => Math.max(0, Math.min(1, (t - a) / (b - a)));

export type SceneState = { node: number; phlegmon: number; abscess: number; bulge: number; airway: number; spread: number };
/** 0–1 conceptual intensities. airway = relative patency (1 = reference). */
export function sceneState(t: number, normal = false): SceneState {
  if (normal) return { node: 0, phlegmon: 0, abscess: 0, bulge: 0, airway: 1, spread: 0 };
  const x = clampTime(t);
  const phlegmon = ramp(x, 10, 14), abscess = ramp(x, 15, 19);
  const bulge = 0.4 * phlegmon + 0.6 * abscess;
  return { node: ramp(x, 5, 8), phlegmon, abscess, bulge, airway: 1 - 0.55 * bulge, spread: ramp(x, 20, 24) };
}
