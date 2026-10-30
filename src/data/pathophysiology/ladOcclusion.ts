// Pure lesson data + conceptual state: LAD occlusion → ischemia → possible infarction. 0–1 intensities only.
import { ramp, clampTime, type GenericPhase } from './timeline';
export * from './timeline';

export const LAD_PATH = '/pathophysiology-atlas/lad-occlusion-myocardial-infarction';

export type StructureId = 'aorta' | 'lad' | 'diagonal' | 'circumflex' | 'rca' | 'plaque' | 'territory' | 'subendocardium' | 'myocyte' | 'ecg' | 'ra' | 'rv' | 'la' | 'lv' | 'pulmonary' | 'pda' | 'acuteMarginal' | 'inferior' | 'dominance' | 'preload';

export const STRUCTURES: Record<StructureId, { label: string; explanation: string }> = {
  aorta: { label: 'Aortic root', explanation: 'Coronary arteries arise from the aortic sinuses. Left ventricular perfusion occurs mostly in diastole.' },
  lad: { label: 'Left anterior descending (LAD)', explanation: 'Runs in the anterior interventricular groove, supplying much of the anterior LV wall, the anterior two-thirds of the septum (septal perforators) and often the apex. Some LADs “wrap” around the apex to the inferior wall.' },
  diagonal: { label: 'Diagonal branches', explanation: 'Supply the anterolateral wall. Whether they are affected depends on occlusion level relative to their origin.' },
  circumflex: { label: 'Left circumflex', explanation: 'Supplies the lateral/posterolateral wall. Shown for orientation; may provide collaterals.' },
  rca: { label: 'Right coronary artery', explanation: 'Supplies the right ventricle and, in most people (right dominance), the inferior wall. May supply collaterals to an occluded LAD territory.' },
  plaque: { label: 'Plaque / thrombus', explanation: 'Rupture or erosion of an atherosclerotic plaque can trigger thrombus that partially or totally occludes the lumen (type 1 MI). Other mechanisms — supply–demand mismatch (type 2), spasm, dissection, embolism — exist.' },
  territory: { label: 'LAD territory (variable)', explanation: 'Myocardium at risk downstream of the occlusion. Its size depends on occlusion site (proximal vs distal), vessel length/wraparound, branching and collateral supply.' },
  subendocardium: { label: 'Subendocardium', explanation: 'Inner myocardium, most vulnerable because of high wall stress and the end of the perfusion path. Irreversible injury classically begins here and may extend outward (the “wavefront”).' },
  myocyte: { label: 'Myocyte energetics (concept)', explanation: 'Without oxygen, oxidative phosphorylation stops; ATP falls, anaerobic glycolysis produces lactate and H⁺, ion pumps fail and contraction stops within moments. Prolonged severe ischemia causes irreversible injury (membrane disruption, calcium overload).' },
  ra: { label: 'Right atrium', explanation: 'Receives systemic venous return (SVC/IVC). The RCA usually supplies it and, in roughly 60% of people, the sinoatrial node.' },
  rv: { label: 'Right ventricle', explanation: 'Forms most of the anterior (sternocostal) surface. Thin-walled; pumps venous return through the lungs to fill the left heart. Supplied mainly by RCA branches (conus, acute marginals) with some LAD contribution to the anterior wall and septum.' },
  la: { label: 'Left atrium / appendage', explanation: 'The left atrial appendage is seen at the upper left heart border; the left main coronary emerges beneath it and divides into LAD and circumflex.' },
  lv: { label: 'Left ventricle', explanation: 'Forms the left border and apex. Its anterior wall and apex are usually LAD territory, lateral wall circumflex/diagonals, and inferior wall the dominant artery (usually RCA via the PDA).' },
  pulmonary: { label: 'Pulmonary trunk', explanation: 'Leaves the RV anterior and to the left of the aorta. Everything the LV ejects must first cross the lungs from the RV — the anatomical basis of RV-dependent LV filling.' },
  pda: { label: 'Posterior descending artery (PDA)', explanation: 'Runs in the inferior (posterior) interventricular groove on the diaphragmatic surface (dashed: hidden from the anterior view). Supplies the inferior wall and inferior septum. Arises from the RCA in right-dominant hearts, the circumflex in left-dominant, or both in co-dominant hearts.' },
  acuteMarginal: { label: 'RV (acute marginal) branches', explanation: 'Arise from the proximal–mid RCA and supply the RV free wall. Occlusion proximal to them can add RV ischemia to an inferior MI; occlusion distal to them usually spares the RV.' },
  inferior: { label: 'Inferior (diaphragmatic) wall', explanation: 'The LV wall resting on the diaphragm. Supplied by the dominant artery’s PDA and posterolateral branches — usually the RCA, sometimes the circumflex. The posteromedial papillary muscle often has single-vessel supply.' },
  dominance: { label: 'Coronary dominance', explanation: '“Dominance” names the artery that gives the PDA: right-dominant in most people, left-dominant (circumflex) in a minority, co-dominant in some. It changes which occlusion produces an inferior MI and how large territories are.' },
  preload: { label: 'Preload chain (RV → lungs → LV)', explanation: 'LV filling depends on RV output. If an ischemic RV fails to pump, less blood reaches the LV, so cardiac output and blood pressure can fall even if the LV itself is little affected. A dilated RV can also shift the septum and, within the pericardium, constrain LV filling.' },
  ecg: { label: 'ECG territory concept', explanation: 'Anterior/anteroseptal ischemia classically appears in precordial leads (around V1–V4, plus I/aVL with high lateral involvement). Patterns vary; a normal ECG does not exclude MI. Schematic only — not a tracing.' },
};

export type Phase = GenericPhase<StructureId>;

export const PHASES: Phase[] = [
  { id: 'normal', name: 'Normal coronary flow and myocardial energetics', short: 'Normal flow',
    explanation: 'Oxygenated blood flows from the aorta into the LAD and its branches. Myocytes rely on continuous oxidative phosphorylation to make ATP for contraction and ion pumps; the heart extracts most delivered oxygen even at rest, so supply must rise with demand.',
    focus: ['lad', 'territory', 'myocyte'],
    bedside: ['Reference state: no ischemia modelled.'],
    labs: [{ name: 'Troponin', trend: 'Reference', mechanism: 'No acute myocyte injury modelled.', limit: 'Some people have chronically detectable troponin (e.g., kidney disease, heart failure).' }] },
  { id: 'occlusion', name: 'Plaque disruption and thrombotic occlusion', short: 'Occlusion',
    explanation: 'A plaque ruptures or erodes; platelets and fibrin form a thrombus that can narrow or occlude the LAD. Distal flow falls sharply. The site of occlusion determines how much territory is downstream; collaterals may partially supply it.',
    focus: ['plaque', 'lad', 'diagonal'],
    bedside: ['Chest pressure or discomfort, possibly radiating to arm, neck or jaw, with dyspnoea, sweating or nausea.', 'Atypical or absent pain is more common in some women, older adults and people with diabetes.'],
    labs: [{ name: 'Troponin', trend: 'May not yet be ↑', mechanism: 'Troponin is released after myocyte injury; very early samples may precede a detectable rise.', limit: 'An early normal value does not exclude MI — serial testing over time is used.' }] },
  { id: 'ischemia', name: 'Ischemia: ATP falls and contractility is lost', short: 'Ischemia',
    explanation: 'In the hypoperfused territory, oxidative metabolism stops, ATP falls and lactate/H⁺ accumulate. Contraction in that segment stops (regional hypokinesis/akinesis) while myocytes are still viable — this stage is reversible if flow returns. Electrical changes appear.',
    focus: ['territory', 'myocyte', 'ecg'],
    bedside: ['Ongoing pain; possible hypotension or pulmonary congestion if a large area stops contracting.', 'Arrhythmias can occur at any stage, including ventricular fibrillation.'],
    labs: [{ name: 'ECG (concept)', trend: 'Ischemic changes may appear', mechanism: 'Ischemic myocytes depolarise partially and repolarise abnormally, producing ST/T changes in leads facing the territory; transmural ischemia classically causes ST elevation.', limit: 'ECG can be normal or non-diagnostic; findings evolve and repeat ECGs matter. Not every ST elevation is MI.' }] },
  { id: 'wavefront', name: 'Persistent ischemia: injury spreads subendocardium → outward', short: 'Injury wavefront',
    explanation: 'If severe ischemia persists, irreversible injury begins in the subendocardium and can progress toward the epicardium. Speed varies with collateral flow, demand, preconditioning and completeness of occlusion — there is no universal minute-by-minute clock.',
    focus: ['subendocardium', 'territory'],
    bedside: ['Symptoms may persist, wax and wane, or ease — symptom change is not a reliable sign of reperfusion.'],
    labs: [{ name: 'Troponin (high-sensitivity)', trend: 'Rising', mechanism: 'Injured myocyte membranes release cytosolic and structural troponin into blood.', limit: 'Elevation shows myocardial injury, not its cause; MI requires a rise and/or fall plus clinical evidence of ischemia (Fourth Universal Definition).' }] },
  { id: 'infarct', name: 'Variable infarct and threatened border; reperfusion concept', short: 'Infarct / variability',
    explanation: 'The final infarct may be subendocardial or transmural and smaller than the territory at risk. Restoring flow can salvage still-viable myocardium but cannot revive tissue already dead; reperfusion itself can add injury and microvascular obstruction may persist.',
    focus: ['territory', 'subendocardium', 'ecg'],
    bedside: ['Possible complications include heart failure, arrhythmia, cardiogenic shock and mechanical complications — risks, not an inevitable course.'],
    labs: [
      { name: 'Troponin', trend: 'Rise then fall over time', mechanism: 'Release continues while injury evolves, then clears; the curve shape helps distinguish acute from chronic injury.', limit: 'Peak does not precisely measure infarct size; kidney dysfunction, myocarditis, PE, sepsis and others also raise troponin.' },
      { name: 'Other trends', trend: 'Contextual', mechanism: 'Natriuretic peptides may rise with ventricular stress; lactate may rise if cardiogenic shock develops.', limit: 'Nonspecific; never diagnostic alone.' },
    ] },
];

export const VARIATIONS = [
  { title: 'Coronary anatomy', text: 'Wraparound LAD, dominant circumflex, large diagonals or ramus branches change which walls are at risk.' },
  { title: 'Collaterals and preconditioning', text: 'Pre-existing collaterals or prior brief ischemia can slow injury; their absence can accelerate it.' },
  { title: 'Partial vs total occlusion', text: 'Partial or intermittent occlusion may cause NSTEMI patterns; total occlusion classically STEMI — but correlation is imperfect (“occlusion MI” without ST elevation exists).' },
  { title: 'Non-atherothrombotic causes', text: 'Spontaneous coronary artery dissection, spasm, embolism and supply–demand mismatch can produce MI with different mechanisms.' },
  { title: 'Coronary dominance', text: 'Right-dominant in most people, left-dominant or co-dominant in others; this decides which artery an inferior MI arises from.' },
  { title: 'RV involvement is variable', text: 'Proximal RCA occlusion may involve the RV; distal RCA or circumflex occlusion usually does not. RV involvement does not always cause hypotension, and hypotension after nitrates is not specific to RV infarction.' },
  { title: 'ECG territory is approximate', text: 'Lead groups map loosely to walls; lead placement, conduction disease, prior MI and pacing alter patterns.' },
];

export const CANNOT_DETERMINE = [
  'Whether any individual is having an MI — that requires clinical assessment, serial ECGs and troponin.',
  'The exact size or timing of an infarct; no fixed minutes-to-death threshold is implied.',
  'The extent of anyone’s LAD or RCA territory, dominance, collaterals or RV involvement.',
  'Whether a specific person can safely receive any medication, including nitrates.',
  'Treatment choice or urgency for an individual.',
];

export const ESCALATION_NOTE = 'Educational note: chest pain or pressure, breathlessness, sweating, fainting or other possible heart attack symptoms warrant calling emergency services immediately. This lesson gives no patient-specific advice, medication or dosing.';

export const SOURCES = [
  { name: 'Thygesen K, et al. Fourth Universal Definition of Myocardial Infarction (2018). Circulation', url: 'https://doi.org/10.1161/CIR.0000000000000617' },
  { name: 'Gulati M, et al. 2021 AHA/ACC Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation', url: 'https://doi.org/10.1161/CIR.0000000000001029' },
  { name: 'Reimer KA, Jennings RB, et al. The wavefront phenomenon of ischemic cell death. Circulation 1977', url: 'https://doi.org/10.1161/01.CIR.56.5.786' },
  { name: 'Rao SV, et al. 2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes. Circulation', url: 'https://doi.org/10.1161/CIR.0000000000001309' },
  { name: 'Byrne RA, et al. 2023 ESC Guidelines for the management of acute coronary syndromes. Eur Heart J', url: 'https://doi.org/10.1093/eurheartj/ehad191' },
  { name: 'Namana V, et al. Right ventricular infarction. Cardiovasc Revasc Med 2018 / Inohara T, et al. Right ventricular myocardial infarction: from pathophysiology to prognosis (PMC review)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3716484/' },
  { name: 'StatPearls: Right Ventricular Myocardial Infarction (NCBI Bookshelf)', url: 'https://www.ncbi.nlm.nih.gov/books/NBK431048/' },
  { name: 'Ferguson JJ, et al. Significance of nitroglycerin-induced hypotension with inferior wall acute myocardial infarction. Am J Cardiol 1989', url: 'https://doi.org/10.1016/0002-9149(89)90525-0' },
  { name: 'American Heart Association: About Heart Attacks', url: 'https://www.heart.org/en/health-topics/heart-attack/about-heart-attacks' },
];

export type SceneState = { thrombus: number; flow: number; ischemia: number; atp: number; contractility: number; injury: number; ecg: number };
/** injury = 0–1 conceptual transmural extent of irreversible injury. */
export function sceneState(t: number, normal = false): SceneState {
  if (normal) return { thrombus: 0, flow: 1, ischemia: 0, atp: 1, contractility: 1, injury: 0, ecg: 0 };
  const x = clampTime(t);
  const thrombus = ramp(x, 5, 9), ischemia = ramp(x, 9, 12);
  const injury = 0.25 * ramp(x, 15, 19) + 0.45 * ramp(x, 19, 23);
  return { thrombus, flow: 1 - 0.92 * thrombus, ischemia, atp: 1 - 0.85 * ischemia, contractility: 1 - 0.9 * ischemia, injury, ecg: ramp(x, 11, 14) };
}

// ---------- Selectable coronary occlusion (LAD vs RCA) ----------
export type CoronaryVariant = 'lad' | 'rca';
export const VARIANTS: { id: CoronaryVariant; label: string; hint: string }[] = [
  { id: 'lad', label: 'LAD occlusion', hint: 'Anterior/anteroseptal territory; classically precordial-lead ECG concepts.' },
  { id: 'rca', label: 'RCA occlusion', hint: 'Proximal RCA in a right-dominant heart: inferior wall with possible RV involvement — not every RCA or inferior MI involves the RV.' },
];
export const asVariant = (v: string): CoronaryVariant => (v === 'rca' ? 'rca' : 'lad');

export const RCA_PHASES: Phase[] = [
  { id: 'normal', name: 'Normal flow: right dominance and RCA territories', short: 'Normal flow',
    explanation: 'The RCA runs in the right atrioventricular groove, gives branches to the right atrium (often the SA node) and RV free wall (acute marginals), and — in a right-dominant heart — continues onto the diaphragmatic surface to give the PDA, supplying the inferior LV wall and inferior septum. Dominance and branching vary between people.',
    focus: ['rca', 'dominance', 'pda', 'acuteMarginal'],
    bedside: ['Reference state: no ischemia modelled.'],
    labs: [{ name: 'Troponin', trend: 'Reference', mechanism: 'No acute myocyte injury modelled.', limit: 'Chronic low-level elevation exists in some people (e.g., kidney disease, heart failure).' }] },
  { id: 'occlusion', name: 'Proximal RCA thrombotic occlusion', short: 'Occlusion',
    explanation: 'Plaque disruption with thrombus occludes the RCA proximal to its RV branches. Flow falls to the RV free wall and, through the PDA, to the inferior wall. A more distal occlusion — or a left-dominant heart — would produce a different territory.',
    focus: ['plaque', 'rca', 'acuteMarginal'],
    bedside: ['Chest pressure or discomfort; epigastric discomfort, nausea, vomiting or sweating may be prominent.', 'Bradycardia or AV block can occur (AV-nodal supply, vagal reflexes) — possible, not universal.'],
    labs: [{ name: 'Troponin', trend: 'May not yet be ↑', mechanism: 'Release follows myocyte injury; very early samples can precede a detectable rise.', limit: 'An early normal result does not exclude MI; serial testing is used.' }] },
  { id: 'ischemia', name: 'Inferior wall ischemia: contraction fails, ECG changes appear', short: 'Inferior ischemia',
    explanation: 'The inferior LV wall becomes ischemic: ATP falls and the segment stops contracting while still viable. ST changes classically appear in the inferior leads (II, III, aVF) with reciprocal changes in I/aVL. Posterior (inferobasal) extension may show only reciprocal V1–V3 changes on a standard ECG.',
    focus: ['inferior', 'territory', 'ecg'],
    bedside: ['Ongoing pain; bradyarrhythmia or hypotension possible.', 'Clear lung fields with hypotension is one pattern that raises the question of RV involvement — it is not specific.'],
    labs: [{ name: 'ECG (concept)', trend: 'Inferior-lead changes may appear', mechanism: 'Ischemic inferior myocardium repolarises abnormally, so leads facing the inferior wall show ST/T change, and opposite leads show reciprocal change.', limit: 'Inferior patterns also occur with circumflex occlusion; lead groups map loosely to anatomy, and a non-diagnostic ECG does not exclude occlusion MI.' }] },
  { id: 'rv', name: 'Possible RV involvement: RV output, LV filling and cardiac output fall', short: 'RV involvement',
    explanation: 'If RV branches are ischemic, the thin RV free wall contracts poorly and dilates. Less blood is pushed across the lungs, so the LV underfills; septal shift and pericardial constraint add to this. Cardiac output and blood pressure can fall, and the patient becomes preload-dependent — reductions in venous return (venodilators such as nitroglycerin, volume depletion) or loss of atrial contribution (AV block, atrial fibrillation) can then cause marked hypotension. This is possible and context-dependent: many inferior MIs have no meaningful RV involvement, and RV involvement does not always cause hypotension.',
    focus: ['rv', 'preload', 'acuteMarginal'],
    bedside: ['Possible pattern: hypotension with elevated jugular venous pressure and clear lungs — the classic triad is insensitive and not always present.', 'Right-sided leads (e.g., V4R) are part of high-level assessment for RV involvement; findings can be transient.', 'Contraindication context for nitrates is assessed clinically (e.g., hypotension, suspected RV infarction, recent phosphodiesterase-5 inhibitor use) — this lesson gives no treatment algorithm or dosing.'],
    labs: [
      { name: 'Right-sided ECG (concept)', trend: 'ST change in right-sided leads may appear', mechanism: 'Leads placed over the right precordium face the RV free wall.', limit: 'Sensitivity falls with time from onset; absence does not exclude RV involvement. Echocardiography adds information.' },
      { name: 'Troponin', trend: 'Rising', mechanism: 'Injured myocytes release troponin; RV and inferior LV injury both contribute.', limit: 'Troponin does not localise injury or indicate RV involvement.' },
      { name: 'Lactate', trend: 'May ↑ if low output develops', mechanism: 'Falling cardiac output can reduce tissue perfusion; adrenergic glycolysis also contributes.', limit: 'Nonspecific; multiple causes; not diagnostic of RV infarction.' },
    ] },
  { id: 'infarct', name: 'Variable infarct, recovery and possible complications', short: 'Infarct / variability',
    explanation: 'Inferior LV injury evolves from the subendocardium outward, as with any coronary territory, and the final infarct is often smaller than the territory at risk. The RV often recovers more contractile function than the LV (lower oxygen demand, systolic and diastolic perfusion, collaterals), but not always. Restoring flow can salvage still-viable myocardium only.',
    focus: ['inferior', 'subendocardium', 'rv'],
    bedside: ['Possible complications include AV block, persistent hypotension or shock, arrhythmia and, rarely, papillary-muscle rupture with acute mitral regurgitation (the posteromedial papillary muscle often has single supply) — risks, not an inevitable course.'],
    labs: [
      { name: 'Troponin', trend: 'Rise then fall over time', mechanism: 'Release continues while injury evolves, then clears.', limit: 'Peak does not precisely measure infarct size; many non-ischemic conditions raise troponin.' },
      { name: 'Natriuretic peptides', trend: 'May ↑', mechanism: 'Released with ventricular wall stress.', limit: 'Nonspecific; not a measure of RV involvement.' },
    ] },
];
export const phasesFor = (v: string): Phase[] => (asVariant(v) === 'rca' ? RCA_PHASES : PHASES);

export type CardiacState = SceneState & { rvIschemia: number; inferiorIschemia: number; anteriorIschemia: number };
/** Variant-aware conceptual state (0–1). LAD timing is identical to `sceneState`. */
export function cardiacState(v: string, t: number, normal = false): CardiacState {
  const b = sceneState(t, normal);
  if (asVariant(v) === 'lad') return { ...b, rvIschemia: 0, inferiorIschemia: 0, anteriorIschemia: b.ischemia };
  if (normal) return { ...b, rvIschemia: 0, inferiorIschemia: 0, anteriorIschemia: 0 };
  const x = clampTime(t);
  const rvIschemia = 0.85 * ramp(x, 15, 18); // possible RV involvement (proximal occlusion), shown in phase 4
  const injury = 0.25 * ramp(x, 17, 20) + 0.4 * ramp(x, 20, 24);
  return { ...b, injury, rvIschemia, inferiorIschemia: b.ischemia, anteriorIschemia: 0 };
}

/** Qualitative preload chain. venodilator = conceptual reduction in venous return (e.g., nitroglycerin). */
export function preloadChain(rvIschemia: number, lvContractility: number, venodilator: boolean) {
  const venousReturn = venodilator ? 0.65 : 1;
  const rvOutput = (1 - 0.55 * rvIschemia) * (0.75 + 0.25 * venousReturn);
  const dependence = 0.25 + 0.75 * rvIschemia; // how strongly LV filling tracks venous return
  const lvFilling = rvOutput * (1 - dependence * (1 - venousReturn));
  const cardiacOutput = lvFilling * (0.6 + 0.4 * lvContractility);
  return { venousReturn, rvOutput, lvFilling, cardiacOutput, pressure: cardiacOutput };
}

export const ECG_LAYOUT = [['I', 'aVR', 'V1', 'V4'], ['II', 'aVL', 'V2', 'V5'], ['III', 'aVF', 'V3', 'V6']] as const;
/** Classic lead-group associations (concept only). */
export function ecgPattern(v: string) {
  return asVariant(v) === 'rca'
    ? { elevated: ['II', 'III', 'aVF'], reciprocal: ['I', 'aVL'], note: 'Inferior leads II, III, aVF (classically III ≥ II with RCA); reciprocal I/aVL. Right-sided V4R may show RV involvement.' }
    : { elevated: ['V1', 'V2', 'V3', 'V4'], reciprocal: ['II', 'III', 'aVF'], note: 'Precordial V1–V4 (plus I/aVL with high lateral/diagonal involvement); inferior reciprocal change possible.' };
}

export const DOMINANCE = [
  { title: 'Right-dominant (most people)', text: 'RCA gives the PDA: RCA occlusion threatens the inferior wall and inferior septum.' },
  { title: 'Left-dominant (minority)', text: 'Circumflex gives the PDA: inferior MI can come from the circumflex, and the RCA may be small, supplying mainly the RV.' },
  { title: 'Co-dominant', text: 'Both contribute to the inferior wall; territories overlap.' },
];
