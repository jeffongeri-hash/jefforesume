// Pure lesson data + conceptual state: LAD occlusion → ischemia → possible infarction. 0–1 intensities only.
import { ramp, clampTime, type GenericPhase } from './timeline';
export * from './timeline';

export const LAD_PATH = '/pathophysiology-atlas/lad-occlusion-myocardial-infarction';

export type StructureId = 'aorta' | 'lad' | 'diagonal' | 'circumflex' | 'rca' | 'plaque' | 'territory' | 'subendocardium' | 'myocyte' | 'ecg';

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
  { title: 'ECG territory is approximate', text: 'Lead groups map loosely to walls; lead placement, conduction disease, prior MI and pacing alter patterns.' },
];

export const CANNOT_DETERMINE = [
  'Whether any individual is having an MI — that requires clinical assessment, serial ECGs and troponin.',
  'The exact size or timing of an infarct; no fixed minutes-to-death threshold is implied.',
  'The extent of anyone’s LAD territory or collaterals.',
  'Treatment choice or urgency for an individual.',
];

export const ESCALATION_NOTE = 'Educational note: chest pain or pressure, breathlessness, sweating, fainting or other possible heart attack symptoms warrant calling emergency services immediately. This lesson gives no patient-specific advice, medication or dosing.';

export const SOURCES = [
  { name: 'Thygesen K, et al. Fourth Universal Definition of Myocardial Infarction (2018). Circulation', url: 'https://doi.org/10.1161/CIR.0000000000000617' },
  { name: 'Gulati M, et al. 2021 AHA/ACC Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation', url: 'https://doi.org/10.1161/CIR.0000000000001029' },
  { name: 'Reimer KA, Jennings RB, et al. The wavefront phenomenon of ischemic cell death. Circulation 1977', url: 'https://doi.org/10.1161/01.CIR.56.5.786' },
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
