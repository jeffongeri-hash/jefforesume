// Pure lesson data + conceptual state: hemorrhagic stroke — intracerebral (ICH) vs subarachnoid (SAH). 0–1 intensities only.
import { ramp, clampTime, type GenericPhase } from './timeline';
export * from './timeline';

export const HEMORRHAGIC_STROKE_PATH = '/pathophysiology-atlas/hemorrhagic-stroke';

export type StructureId = 'skull' | 'dura' | 'subarachnoid' | 'cortex' | 'ventricles' | 'basalGanglia' | 'thalamus' | 'perforator' | 'aneurysm' | 'hematoma' | 'edema' | 'midline' | 'cisterns' | 'brainstem' | 'icp' | 'ncct';

export const STRUCTURES: Record<StructureId, { label: string; explanation: string }> = {
  skull: { label: 'Skull (fixed volume)', explanation: 'The adult skull is rigid. Brain, blood and CSF share a fixed volume (Monro–Kellie concept), so a new mass is first buffered by displacing CSF and venous blood; once that reserve is used, pressure can rise steeply.' },
  dura: { label: 'Dura and falx', explanation: 'Tough outer meningeal layer. The falx cerebri separates the hemispheres in the midline; shift of structures under it is “subfalcine” displacement.' },
  subarachnoid: { label: 'Subarachnoid space', explanation: 'CSF-filled space between arachnoid and pia, around the brain surface and sulci. Major arteries of the circle of Willis run in it, so a ruptured aneurysm bleeds here.' },
  cortex: { label: 'Cerebral cortex / white matter', explanation: 'Brain parenchyma. Intracerebral haemorrhage bleeds into the tissue itself; subarachnoid haemorrhage surrounds it.' },
  ventricles: { label: 'Lateral and third ventricles', explanation: 'CSF spaces. They can be compressed by mass effect, receive blood (intraventricular extension) or enlarge if CSF flow or absorption is obstructed (hydrocephalus).' },
  basalGanglia: { label: 'Basal ganglia (putamen)', explanation: 'Deep grey matter supplied by small lenticulostriate perforators from the MCA. A common site of hypertension-related ICH; others include thalamus, pons and cerebellum.' },
  thalamus: { label: 'Thalamus', explanation: 'Deep nucleus beside the third ventricle; thalamic haemorrhage can extend into the ventricles.' },
  perforator: { label: 'Penetrating (perforating) artery', explanation: 'Small arteries damaged by chronic hypertension (arteriolosclerosis) can rupture into deep tissue. Lobar ICH in older adults is often associated with cerebral amyloid angiopathy. Anticoagulation, vascular malformations, tumours and other causes exist.' },
  aneurysm: { label: 'Saccular (berry) aneurysm', explanation: 'Outpouchings at branch points of the circle of Willis. Rupture releases arterial blood into the subarachnoid space. Non-aneurysmal causes of SAH (e.g., trauma, perimesencephalic pattern) also occur.' },
  hematoma: { label: 'Haematoma (ICH)', explanation: 'Blood collecting within brain tissue. In a proportion of patients it enlarges in the first hours (haematoma expansion), which is associated with worse outcomes; expansion is not universal and cannot be predicted reliably for an individual from appearance alone.' },
  edema: { label: 'Perihaematomal oedema', explanation: 'Swelling around the haematoma from clot-derived thrombin, inflammation and blood breakdown products. It typically develops over days and adds to mass effect. Extent varies widely.' },
  midline: { label: 'Midline shift (mass effect)', explanation: 'A large mass can push brain across the midline under the falx and compress ventricles. Severe mass effect can progress to herniation — a possible outcome, not an inevitable one.' },
  cisterns: { label: 'Basal cisterns', explanation: 'Larger CSF spaces at the brain base around the circle of Willis and brainstem. Aneurysmal SAH typically fills these and spreads into Sylvian fissures and sulci.' },
  brainstem: { label: 'Brainstem', explanation: 'Contains arousal and vital autonomic centres. Downward pressure on it is one mechanism of reduced consciousness and the Cushing response (hypertension, bradycardia, irregular breathing) — a late, not universal, sign.' },
  icp: { label: 'Intracranial pressure (concept)', explanation: 'ICP rises when added volume (blood, oedema, CSF) exceeds compensation. Rising ICP reduces cerebral perfusion pressure. The meter is qualitative, not a measured value.' },
  ncct: { label: 'Non-contrast CT concept', explanation: 'Acute blood appears hyperdense (bright) on NCCT. ICH appears within tissue; SAH appears in cisterns and sulci. Icons here are drawings, not scans.' },
};

export type HemVariant = 'ich' | 'sah';
export const VARIANTS: { id: HemVariant; label: string; hint: string }[] = [
  { id: 'ich', label: 'Intracerebral (ICH)', hint: 'Bleeding into brain tissue — here a deep putaminal bleed from a penetrating artery.' },
  { id: 'sah', label: 'Subarachnoid (SAH)', hint: 'Bleeding into the subarachnoid space — here from a ruptured saccular aneurysm at the circle of Willis.' },
];
export const asHem = (v: string): HemVariant => (v === 'sah' ? 'sah' : 'ich');

export type Phase = GenericPhase<StructureId>;

export const ICH_PHASES: Phase[] = [
  { id: 'normal', name: 'Normal intracranial compartments and deep perforators', short: 'Normal',
    explanation: 'Brain, blood and CSF fill a rigid skull. Deep grey matter is supplied by small penetrating arteries; chronic hypertension or other vasculopathy can weaken their walls.',
    focus: ['skull', 'perforator', 'basalGanglia'], bedside: ['Reference state: no haemorrhage modelled.'],
    labs: [{ name: 'Labs', trend: 'Reference', mechanism: 'No haemorrhage modelled.', limit: '—' }] },
  { id: 'rupture', name: 'Vessel rupture: blood enters brain tissue', short: 'Rupture',
    explanation: 'A weakened penetrating artery ruptures and blood dissects into the putamen. Neurons are injured directly by the mass and by blood products. Symptoms usually begin suddenly and may worsen over minutes to hours.',
    focus: ['perforator', 'hematoma', 'basalGanglia'],
    bedside: ['Sudden focal deficit (e.g., contralateral weakness or numbness, speech or gaze change) — clinically not reliably distinguishable from ischemic stroke without imaging.', 'Headache, vomiting and reduced consciousness are more common than in ischemic stroke but are not universal.', 'Blood pressure is often markedly elevated.'],
    labs: [
      { name: 'Coagulation tests / platelets', trend: 'Checked early', mechanism: 'Anticoagulant exposure, coagulopathy or thrombocytopenia increase bleeding and expansion risk.', limit: 'Normal results do not exclude haemorrhage; some anticoagulants are not well reflected by routine tests.' },
      { name: 'Glucose', trend: 'Checked early', mechanism: 'Hypoglycaemia mimics focal deficits; hyperglycaemia is associated with worse outcomes.', limit: 'Does not diagnose stroke type.' },
    ] },
  { id: 'expansion', name: 'Haematoma expansion risk', short: 'Expansion risk',
    explanation: 'In a proportion of patients the haematoma keeps growing during the first hours as bleeding continues. Expansion is a major modifiable predictor of outcome but is not inevitable; it is most often seen early and with anticoagulation.',
    focus: ['hematoma', 'ncct'],
    bedside: ['Early neurologic worsening can reflect expansion, but also oedema, hydrocephalus or seizure.'],
    labs: [{ name: 'Repeat imaging (concept)', trend: 'Used to detect growth', mechanism: 'Comparison over time shows whether the haematoma enlarges.', limit: 'Imaging “spot” and density signs are associated with expansion but do not predict it with certainty.' }] },
  { id: 'edema', name: 'Perihaematomal oedema, mass effect and possible ventricular extension', short: 'Oedema & mass effect',
    explanation: 'Over hours to days oedema forms around the clot. The mass compresses the ipsilateral ventricle and can shift midline structures. Blood may break into the ventricles (intraventricular haemorrhage), which can obstruct CSF flow and cause hydrocephalus.',
    focus: ['edema', 'midline', 'ventricles'],
    bedside: ['Possible delayed decline in consciousness or new deficits.'],
    labs: [{ name: 'Sodium', trend: 'Monitored', mechanism: 'Sodium shifts alter brain water and can worsen oedema.', limit: 'Not a measure of oedema volume.' }] },
  { id: 'icp', name: 'Possible raised intracranial pressure and herniation risk', short: 'Raised ICP',
    explanation: 'If added volume exceeds compensation, ICP can rise and cerebral perfusion pressure fall; severe mass effect can displace brain past dural boundaries (herniation). Many patients never reach this stage, and course varies with haematoma size, location and oedema.',
    focus: ['icp', 'brainstem', 'midline'],
    bedside: ['Possible late signs: declining consciousness, pupillary asymmetry, Cushing response (hypertension, bradycardia, irregular breathing) — insensitive and late, not universal.'],
    labs: [{ name: 'Blood gas / CO₂ (context)', trend: 'Contextual', mechanism: 'CO₂ affects cerebral blood volume and therefore ICP.', limit: 'No blood test measures ICP.' }] },
];

export const SAH_PHASES: Phase[] = [
  { id: 'normal', name: 'Normal subarachnoid space and circle of Willis', short: 'Normal',
    explanation: 'The major cerebral arteries run within the CSF-filled subarachnoid space at the brain base. Saccular aneurysms form at branch points and are often silent until rupture.',
    focus: ['subarachnoid', 'cisterns', 'aneurysm'], bedside: ['Reference state: no haemorrhage modelled.'],
    labs: [{ name: 'Labs', trend: 'Reference', mechanism: 'No haemorrhage modelled.', limit: '—' }] },
  { id: 'rupture', name: 'Aneurysm rupture: arterial blood enters the subarachnoid space', short: 'Rupture',
    explanation: 'Rupture releases blood at arterial pressure into the basal cisterns. ICP can surge abruptly, briefly reducing cerebral perfusion — one reason for transient loss of consciousness. Unlike ICH, the blood surrounds rather than enters brain tissue (though both can coexist).',
    focus: ['aneurysm', 'cisterns', 'icp'],
    bedside: ['Sudden, severe (“thunderclap”) headache, often maximal at onset; possible vomiting, syncope, seizure.', 'Focal deficits are often absent early, unlike many ICHs.', 'Smaller “sentinel” bleeds can cause headache before a major rupture.'],
    labs: [{ name: 'ECG / troponin', trend: 'May change', mechanism: 'A catecholamine surge can cause ECG changes and myocardial stunning (neurogenic stress cardiomyopathy).', limit: 'Can be mistaken for primary cardiac disease; abnormal results do not diagnose SAH.' }] },
  { id: 'spread', name: 'Blood spreads through cisterns and sulci; meningeal irritation', short: 'Spread',
    explanation: 'Blood tracks through basal cisterns, Sylvian fissures and cortical sulci. Breakdown products irritate the meninges over hours. Rebleeding of the unsecured aneurysm is a recognised early risk.',
    focus: ['subarachnoid', 'cisterns', 'ncct'],
    bedside: ['Neck stiffness and photophobia may develop over hours and can be absent early.'],
    labs: [{ name: 'CSF (concept)', trend: 'Blood products', mechanism: 'Red cells and, after some hours, bilirubin (xanthochromia) appear in CSF.', limit: 'Traumatic taps confound red-cell counts; xanthochromia takes time to develop and testing methods vary.' }] },
  { id: 'hydro', name: 'Possible hydrocephalus and raised ICP', short: 'Hydrocephalus',
    explanation: 'Blood can obstruct CSF flow or absorption, so the ventricles enlarge (acute hydrocephalus) and ICP can rise. This is common after aneurysmal SAH but not universal.',
    focus: ['ventricles', 'icp'],
    bedside: ['Possible declining consciousness or headache worsening.'],
    labs: [{ name: 'Sodium', trend: 'May ↓ over days', mechanism: 'Natriuresis or inappropriate ADH can occur after SAH.', limit: 'Variable and time-dependent; not diagnostic.' }] },
  { id: 'delayed', name: 'Possible delayed complications: vasospasm and delayed cerebral ischaemia', short: 'Delayed risks',
    explanation: 'Over the following days, some patients develop arterial vasospasm and delayed cerebral ischaemia, driven by blood breakdown products, microvascular dysfunction and cortical spreading depolarisation. Timing and severity vary; many patients do not develop it.',
    focus: ['subarachnoid', 'icp', 'cortex'],
    bedside: ['Possible new focal deficit or reduced consciousness days after the bleed.'],
    labs: [{ name: 'Glucose / sodium / temperature (context)', trend: 'Monitored', mechanism: 'Systemic derangements can worsen secondary brain injury.', limit: 'None specifically identifies delayed ischaemia.' }] },
];
export const PHASES = ICH_PHASES;
export const phasesFor = (v: string): Phase[] => (asHem(v) === 'sah' ? SAH_PHASES : ICH_PHASES);

export const NCCT_CONCEPT = [
  'Acute blood is hyperdense (bright) on non-contrast CT, which is the usual first test to distinguish haemorrhage from ischaemic stroke.',
  'ICH appears as a hyperdense collection within brain tissue, sometimes with surrounding hypodense oedema, ventricular extension or midline shift.',
  'SAH appears as hyperdensity in basal cisterns, Sylvian fissures and sulci. Sensitivity is highest soon after headache onset and falls with time, so a normal CT later on does not exclude SAH; guidelines describe further testing pathways.',
  'CTA can show aneurysms, vascular malformations and a “spot sign” associated with ICH expansion; MRI has its own sensitivities for blood age.',
  'All imaging icons in this lesson are drawings, not scans, and imply no thresholds or eligibility rules.',
];

export const VARIATIONS = [
  { title: 'ICH is not SAH', text: 'ICH bleeds into tissue and usually causes focal deficits; SAH bleeds around the brain and classically causes sudden severe headache, often without early focal signs. They can coexist.' },
  { title: 'Location matters', text: 'Deep, lobar, cerebellar and brainstem ICH differ in cause and course; cerebellar haemorrhage can compress the brainstem and fourth ventricle.' },
  { title: 'Cause varies', text: 'Hypertensive arteriolosclerosis, amyloid angiopathy, anticoagulation, vascular malformations, tumours, venous thrombosis and trauma all cause intracranial bleeding.' },
  { title: 'Not all bleeds expand or herniate', text: 'Haematoma expansion, hydrocephalus and herniation are possible outcomes with variable frequency, not a fixed sequence.' },
  { title: 'Non-aneurysmal SAH', text: 'Trauma is the most common cause of SAH overall; perimesencephalic non-aneurysmal SAH has a different pattern and course.' },
];

export const CANNOT_DETERMINE = [
  'Whether a person has a haemorrhage — imaging is required; symptoms overlap with ischaemic stroke.',
  'Haematoma volume, expansion probability or ICP — meters are qualitative.',
  'Timing of any complication; no universal timeline is implied.',
  'Treatment, blood pressure targets, reversal or surgical decisions.',
];

export const ESCALATION_NOTE = 'Educational note: sudden severe headache, sudden weakness or numbness, speech or vision difficulty, confusion or collapse warrant calling emergency services immediately. This lesson gives no patient-specific advice, targets or dosing.';

export const SOURCES = [
  { name: 'Greenberg SM, et al. 2022 Guideline for the Management of Patients With Spontaneous Intracerebral Hemorrhage (AHA/ASA). Stroke', url: 'https://doi.org/10.1161/STR.0000000000000407' },
  { name: 'Hoh BL, et al. 2023 Guideline for the Management of Patients With Aneurysmal Subarachnoid Hemorrhage (AHA/ASA). Stroke', url: 'https://doi.org/10.1161/STR.0000000000000436' },
  { name: 'Brott T, et al. Early hemorrhage growth in patients with intracerebral hemorrhage. Stroke 1997', url: 'https://doi.org/10.1161/01.STR.28.1.1' },
  { name: 'Perry JJ, et al. Sensitivity of CT performed within six hours of onset of headache for diagnosis of SAH. BMJ 2011', url: 'https://doi.org/10.1136/bmj.d4277' },
  { name: 'Qureshi AI, et al. Spontaneous intracerebral hemorrhage. N Engl J Med 2001', url: 'https://doi.org/10.1056/NEJM200105103441907' },
];

export type HemState = { bleed: number; hematoma: number; expansion: number; edema: number; shift: number; icp: number; ivh: number; sahSpread: number; hydro: number; spasm: number };
const ZERO: HemState = { bleed: 0, hematoma: 0, expansion: 0, edema: 0, shift: 0, icp: 0, ivh: 0, sahSpread: 0, hydro: 0, spasm: 0 };
/** Variant-aware conceptual state, 0–1. */
export function hemState(v: string, t: number, normal = false): HemState {
  if (normal) return ZERO;
  const x = clampTime(t);
  if (asHem(v) === 'ich') {
    const bleed = ramp(x, 5, 7), hematoma = 0.55 * ramp(x, 5, 9), expansion = 0.3 * ramp(x, 10, 14);
    const edema = ramp(x, 15, 19), ivh = 0.6 * ramp(x, 17, 20);
    const shift = 0.35 * ramp(x, 11, 14) + 0.45 * edema + 0.2 * ramp(x, 20, 24);
    const icp = 0.15 * bleed + 0.15 * ramp(x, 10, 14) + 0.3 * edema + 0.35 * ramp(x, 20, 24);
    return { ...ZERO, bleed, hematoma: hematoma + expansion, expansion, edema, shift, icp, ivh };
  }
  const bleed = ramp(x, 5, 7), sahSpread = 0.4 * ramp(x, 5, 8) + 0.6 * ramp(x, 10, 14), hydro = ramp(x, 15, 19);
  const surge = Math.max(0, 1 - Math.abs(x - 7) / 2.5); // transient ICP surge at rupture
  const icp = Math.min(1, 0.65 * surge + 0.2 * bleed + 0.4 * hydro);
  return { ...ZERO, bleed, sahSpread, hydro, icp, spasm: ramp(x, 20, 24) };
}
