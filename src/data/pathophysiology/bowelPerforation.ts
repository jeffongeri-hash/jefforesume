// Pure, React-free lesson data and conceptual state for the bowel perforation lesson.
// All values are 0–1 qualitative animation intensities — never patient values.

export const PATHO_HUB_PATH = '/pathophysiology-atlas';
export const BOWEL_PERFORATION_PATH = '/pathophysiology-atlas/bowel-perforation';
export const PHASE_SECONDS = 5;
export const PHASE_COUNT = 5;
export const LESSON_DURATION = PHASE_SECONDS * PHASE_COUNT;
export const SPEEDS = [0.5, 1, 1.5, 2] as const;

export type StructureId =
  | 'mucosa' | 'bowel-wall' | 'serosa' | 'perforation' | 'enteric-contents'
  | 'visceral-peritoneum' | 'parietal-peritoneum' | 'peritoneal-fluid' | 'microcirculation';

export const STRUCTURES: Record<StructureId, { label: string; explanation: string }> = {
  mucosa: { label: 'Mucosa', explanation: 'Innermost epithelial lining of the lumen. Together with tight junctions and mucus it normally helps keep luminal contents and microbes inside the bowel.' },
  'bowel-wall': { label: 'Bowel wall (submucosa & muscularis)', explanation: 'Layered wall providing structure and peristalsis. Full-thickness disruption of every layer is what defines a perforation.' },
  serosa: { label: 'Serosa', explanation: 'Outer covering of intraperitoneal bowel, continuous with the visceral peritoneum. A breach must cross it for contents to reach the peritoneal cavity.' },
  perforation: { label: 'Perforation site', explanation: 'A full-thickness defect. Its size, location and whether adjacent tissue walls it off (contained) or not (free) strongly influence how much material escapes.' },
  'enteric-contents': { label: 'Enteric contents', explanation: 'Luminal material. Upper GI contents are often more chemically irritant (acid, bile, enzymes) with lower bacterial load; colonic contents carry a much higher, mixed bacterial load.' },
  'visceral-peritoneum': { label: 'Visceral peritoneum', explanation: 'Serous membrane covering organs. Visceral pain fibres produce poorly localised, often midline discomfort.' },
  'parietal-peritoneum': { label: 'Parietal peritoneum', explanation: 'Lines the abdominal wall with somatic innervation. When it becomes inflamed, pain can become sharper and better localised, and guarding or rigidity may occur.' },
  'peritoneal-fluid': { label: 'Peritoneal fluid / exudate', explanation: 'A small normal volume lubricates surfaces. Inflammation increases capillary permeability, so protein-rich exudate can accumulate — a form of “third spacing.”' },
  microcirculation: { label: 'Microcirculation (perfusion inset)', explanation: 'Arterioles, capillaries and venules delivering oxygen. In a dysregulated host response, vasodilation, capillary leak and heterogeneous flow can reduce effective tissue perfusion.' },
};

export type Phase = {
  id: string; name: string; short: string; explanation: string; focus: StructureId[];
  bedside: string[]; labs: { name: string; trend: string; mechanism: string; limit: string }[];
};

export const PHASES: Phase[] = [
  {
    id: 'intact', name: 'Intact bowel / normal containment', short: 'Containment',
    explanation: 'The mucosa, wall and serosa keep luminal contents inside the bowel. Peritoneal surfaces are smooth with only a thin film of lubricating fluid. Peristalsis moves contents forward.',
    focus: ['mucosa', 'bowel-wall', 'serosa', 'visceral-peritoneum'],
    bedside: ['Reference state: no peritoneal irritation in this conceptual model.', 'Normal bowel activity is represented by peristaltic motion.'],
    labs: [{ name: 'Labs', trend: 'Reference', mechanism: 'No injury is modelled in this phase.', limit: 'Normal labs never exclude early or contained pathology in real patients.' }],
  },
  {
    id: 'breach', name: 'Wall disruption and escape of luminal contents', short: 'Breach',
    explanation: 'A full-thickness defect forms (causes include peptic ulcer, diverticulitis, ischaemia, obstruction, trauma, malignancy or instrumentation). Luminal material — gas, fluid, enzymes and bacteria — can now pass into the peritoneal cavity.',
    focus: ['perforation', 'enteric-contents', 'serosa'],
    bedside: ['Pain may begin abruptly (classically with some upper GI perforations) or more gradually, depending on cause and location.', 'Early findings can be subtle, especially in older, immunosuppressed or steroid-treated patients.'],
    labs: [{ name: 'Labs', trend: 'May be unremarkable early', mechanism: 'Inflammatory and perfusion changes take time to develop.', limit: 'A normal early result does not exclude perforation.' }],
  },
  {
    id: 'local', name: 'Local peritoneal inflammatory response', short: 'Local inflammation',
    explanation: 'Contents irritate the peritoneum (chemical and/or bacterial peritonitis). Resident macrophages and mesothelium release mediators, neutrophils are recruited, and fibrin may deposit. Omentum and adjacent loops may wall off the area — sometimes containing the leak.',
    focus: ['parietal-peritoneum', 'visceral-peritoneum', 'peritoneal-fluid'],
    bedside: ['Pain may become more localised as the parietal peritoneum is involved; tenderness and voluntary or involuntary guarding can develop.', 'Fever and tachycardia may appear as possible systemic signs, but can be absent.'],
    labs: [{ name: 'White cell count / neutrophils', trend: '↑ may occur', mechanism: 'Marrow release and demargination of neutrophils in response to inflammatory mediators and stress hormones.', limit: 'Variable and nonspecific: may be normal, elevated or low (low counts can occur in overwhelming infection or immunosuppression).' }],
  },
  {
    id: 'spread', name: 'Peritoneal contamination, fluid shifts and ileus concept', short: 'Fluid shifts / ileus',
    explanation: 'If contamination is not contained, it can disperse across peritoneal surfaces. Inflamed, leaky capillaries move protein-rich fluid into the peritoneal cavity and bowel wall (third spacing), which may contribute to intravascular volume depletion. Inflammation and reflex pathways can reduce peristalsis — an ileus concept with distension.',
    focus: ['peritoneal-fluid', 'enteric-contents', 'bowel-wall'],
    bedside: ['Diffuse tenderness, rigidity or distension may develop with reduced bowel activity (ileus concept).', 'Signs of volume depletion may emerge as fluid shifts out of the circulation.'],
    labs: [
      { name: 'Renal function / electrolytes', trend: 'Possible derangement', mechanism: 'Third-space losses, vomiting or reduced intake can lower effective circulating volume and kidney perfusion.', limit: 'Direction and degree vary; baseline kidney disease and medications confound interpretation.' },
      { name: 'Acid–base', trend: 'Context dependent', mechanism: 'Vomiting can cause a metabolic alkalosis; hypoperfusion can contribute to a metabolic acidosis; mixed disorders are common.', limit: 'Acid–base findings describe physiology, not the cause or location of a perforation.' },
    ],
  },
  {
    id: 'systemic', name: 'Potential systemic deterioration: sepsis physiology / reduced effective perfusion', short: 'Systemic risk',
    explanation: 'In some patients, the host response becomes dysregulated and organ dysfunction develops — the Sepsis-3 definition of sepsis. Vasodilation, capillary leak, volume depletion and microcirculatory dysfunction may combine to reduce effective tissue perfusion. This is a possible progression, not an inevitable one, and not every peritonitis is sepsis.',
    focus: ['microcirculation', 'peritoneal-fluid'],
    bedside: ['Perfusion concern: altered mentation, hypotension, mottling, prolonged capillary refill or reduced urine output may appear.', 'Tachycardia and tachypnoea may worsen; fever may be absent or replaced by hypothermia.'],
    labs: [
      { name: 'Lactate', trend: '↑ may occur', mechanism: 'Possible contributors: tissue hypoperfusion, adrenergic (β2-mediated) aerobic glycolysis, reduced hepatic clearance and microcirculatory dysfunction.', limit: 'Cannot independently diagnose bowel injury or perforation; a normal lactate does not exclude it. Elevations are nonspecific.' },
      { name: 'Acid–base', trend: 'Metabolic acidosis may develop', mechanism: 'Lactate and other unmeasured anions, plus reduced kidney acid excretion, may lower bicarbonate.', limit: 'Respiratory compensation and mixed disorders modify the picture.' },
      { name: 'Organ function markers', trend: 'May worsen', mechanism: 'Creatinine, bilirubin, platelets and coagulation tests can reflect evolving organ dysfunction.', limit: 'Trends must be interpreted against baseline and the whole clinical picture.' },
    ],
  },
];

export const VARIATIONS = [
  { title: 'Contained vs free perforation', text: 'Omentum, adjacent bowel or prior inflammation may wall off a leak (e.g., a localised abscess or phlegmon), limiting spread. Free perforation allows wider contamination.' },
  { title: 'Upper vs lower GI material', text: 'Gastroduodenal contents are often initially more chemical (acid, bile, enzymes) with lower bacterial load; colonic contents carry a much higher, polymicrobial load.' },
  { title: 'Timing', text: 'Findings evolve over time. Early presentations may be subtle; delay generally allows more contamination and host response.' },
  { title: 'Host factors', text: 'Age, immunosuppression, corticosteroids, analgesia, comorbidity and frailty can blunt pain, fever and guarding, and change the reserve to tolerate fluid shifts.' },
  { title: 'Source control context', text: 'Clinicians consider how the source of contamination is identified and controlled; the approach (non-operative, drainage, endoscopic or surgical) is individualised and not determined by this mechanism alone.' },
];

export const CANNOT_DETERMINE = [
  'The location or cause of a perforation.',
  'How much contamination has occurred or whether it is contained.',
  'Any individual’s physiology, severity or trajectory.',
  'A diagnosis — which requires clinical assessment with appropriate imaging and laboratory testing.',
  'Treatment urgency or approach. A perforation mechanism does not automatically mean surgery; management is individualised by the treating team.',
];

export const ESCALATION_NOTE = 'Educational note: severe or worsening abdominal pain, a rigid abdomen, fever with abdominal pain, vomiting with distension, fainting, confusion or signs of poor perfusion are reasons to seek emergency care promptly. This lesson does not provide patient-specific advice, management or dosing.';

export const SOURCES = [
  { name: 'Surviving Sepsis Campaign: International Guidelines 2021 (Crit Care Med)', url: 'https://journals.lww.com/ccmjournal/fulltext/2021/11000/surviving_sepsis_campaign__international.21.aspx' },
  { name: 'Singer M, et al. The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3), JAMA 2016', url: 'https://jamanetwork.com/journals/jama/fullarticle/2492881' },
  { name: 'Sartelli M, et al. 2017 WSES guidelines for management of intra-abdominal infections, World J Emerg Surg', url: 'https://wjes.biomedcentral.com/articles/10.1186/s13017-017-0141-6' },
  { name: 'Mazuski JE, et al. Surgical Infection Society guidelines on intra-abdominal infection (2017), Surg Infect', url: 'https://www.liebertpub.com/doi/10.1089/sur.2016.261' },
  { name: 'Tarasconi A, et al. Perforated and bleeding peptic ulcer: WSES guidelines (2020), World J Emerg Surg', url: 'https://wjes.biomedcentral.com/articles/10.1186/s13017-020-00288-4' },
  { name: 'Hall JC, et al. The pathobiology of peritonitis, Gastroenterology 1998', url: 'https://doi.org/10.1016/S0016-5085(98)70391-7' },
  { name: 'Garcia-Alvarez M, Marik P, Bellomo R. Sepsis-associated hyperlactatemia, Crit Care 2014', url: 'https://ccforum.biomedcentral.com/articles/10.1186/s13054-014-0503-3' },
  { name: 'StatPearls: Bowel Perforation (NCBI Bookshelf)', url: 'https://www.ncbi.nlm.nih.gov/books/NBK537224/' },
];

export const clampTime = (t: number) => Math.max(0, Math.min(LESSON_DURATION - 0.001, t));
export const phaseAt = (t: number) => Math.min(PHASE_COUNT - 1, Math.floor(clampTime(t) / PHASE_SECONDS));
export const phaseStart = (i: number) => Math.max(0, Math.min(PHASE_COUNT - 1, i)) * PHASE_SECONDS;
/** Advance playback; stops (returns playing=false) at the end instead of looping. */
export const tick = (t: number, dt: number, speed: number): { time: number; playing: boolean } => {
  const next = t + dt * speed;
  return next >= LESSON_DURATION ? { time: LESSON_DURATION - 0.001, playing: false } : { time: next, playing: true };
};

const ramp = (t: number, a: number, b: number) => Math.max(0, Math.min(1, (t - a) / (b - a)));

export type SceneState = { breach: number; contamination: number; inflammation: number; fluid: number; ileus: number; perfusion: number; peristalsis: number };

/** Conceptual 0–1 intensities used by the scene. `normal` returns the intact reference. */
export function sceneState(t: number, normal = false): SceneState {
  if (normal) return { breach: 0, contamination: 0, inflammation: 0, fluid: 0, ileus: 0, perfusion: 1, peristalsis: 1 };
  const x = clampTime(t);
  const ileus = ramp(x, 15, 19);
  return {
    breach: ramp(x, 5, 7.5),
    contamination: 0.35 * ramp(x, 6, 10) + 0.65 * ramp(x, 15, 20),
    inflammation: ramp(x, 10, 14),
    fluid: 0.15 * ramp(x, 11, 15) + 0.85 * ramp(x, 15, 20),
    ileus,
    perfusion: 1 - 0.7 * ramp(x, 20, 24),
    peristalsis: 1 - 0.85 * ileus,
  };
}
