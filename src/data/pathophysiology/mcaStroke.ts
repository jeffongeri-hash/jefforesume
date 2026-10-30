// Pure lesson data + conceptual state: MCA occlusion → ischemic core and penumbra. 0–1 intensities only.
import { ramp, clampTime, type GenericPhase } from './timeline';
export * from './timeline';

export const MCA_STROKE_PATH = '/pathophysiology-atlas/mca-ischemic-stroke';

export type StructureId = 'ica' | 'mca' | 'clot' | 'aca' | 'pca' | 'collaterals' | 'core' | 'penumbra' | 'oligemia' | 'imaging';

export const STRUCTURES: Record<StructureId, { label: string; explanation: string }> = {
  ica: { label: 'Internal carotid artery', explanation: 'Gives rise to the MCA and ACA at its terminus. Shown for orientation.' },
  mca: { label: 'Middle cerebral artery (M1 → branches)', explanation: 'Supplies most of the lateral hemisphere (motor/sensory cortex for face and arm, language areas in the dominant hemisphere) and, via lenticulostriate perforators from M1, deep structures. Territory varies between people.' },
  clot: { label: 'Occluding thrombus / embolus', explanation: 'Commonly embolic (cardiac, e.g., atrial fibrillation, or artery-to-artery) or in-situ atherothrombotic. Occlusion site (e.g., M1 vs M2) changes the size of the territory at risk.' },
  aca: { label: 'Anterior cerebral artery', explanation: 'Its distal branches can supply MCA territory through leptomeningeal (pial) collaterals.' },
  pca: { label: 'Posterior cerebral artery', explanation: 'Also a leptomeningeal collateral donor to the posterior MCA territory.' },
  collaterals: { label: 'Leptomeningeal collaterals', explanation: 'Small pial anastomoses that can partially perfuse the territory beyond an occlusion. Collateral quality varies widely between people and over time, and strongly influences how fast the core grows.' },
  core: { label: 'Ischemic core (concept)', explanation: 'Tissue with severe hypoperfusion that is very likely irreversibly injured. Imaging “core” is an estimate (e.g., CTP CBF threshold or MRI diffusion), not a direct histological boundary; it can be over- or under-estimated.' },
  penumbra: { label: 'Penumbra (potentially salvageable)', explanation: 'Hypoperfused tissue that has lost function (causing deficits) but may survive if flow is restored. Its survival depends on collaterals and time; it is not guaranteed to be saved or to be lost.' },
  oligemia: { label: 'Benign oligaemia', explanation: 'Mildly hypoperfused tissue that usually survives even without reperfusion. Perfusion maps can include it in a “mismatch” region, depending on thresholds.' },
  imaging: { label: 'Imaging concept panel', explanation: 'Conceptual NCCT / CTA / CT perfusion comparison. These icons are not scans and do not represent any patient.' },
};

export type Phase = GenericPhase<StructureId>;

export const PHASES: Phase[] = [
  { id: 'normal', name: 'Normal MCA perfusion and collateral network', short: 'Normal perfusion',
    explanation: 'Blood flows from the ICA into the MCA and out to cortical branches. Leptomeningeal collaterals between ACA, MCA and PCA branches are present but carry little flow while the MCA is patent. Brain has minimal energy reserve and depends on continuous flow.',
    focus: ['ica', 'mca', 'collaterals'],
    bedside: ['Reference state: no ischemia modelled.'],
    labs: [{ name: 'Labs', trend: 'Reference', mechanism: 'No ischemia modelled.', limit: '—' }] },
  { id: 'occlusion', name: 'MCA occlusion and abrupt hypoperfusion', short: 'Occlusion',
    explanation: 'A thrombus or embolus lodges in the MCA. Flow beyond it drops; neurons lose function within seconds to minutes as ATP falls, ion gradients fail and synaptic transmission stops. Symptoms begin abruptly.',
    focus: ['clot', 'mca'],
    bedside: ['Sudden contralateral face/arm > leg weakness or numbness, gaze deviation toward the lesion, aphasia (dominant hemisphere) or neglect (non-dominant).', 'Deficits can fluctuate; mimics include hypoglycaemia, seizure/post-ictal state, migraine and functional disorders.'],
    labs: [{ name: 'Point-of-care glucose', trend: 'Checked early', mechanism: 'Hypoglycaemia (and marked hyperglycaemia) can mimic or worsen focal deficits.', limit: 'A normal glucose does not confirm stroke; it removes one mimic.' }] },
  { id: 'collaterals', name: 'Collateral recruitment shapes the territory', short: 'Collaterals',
    explanation: 'Pial collaterals from ACA and PCA begin to perfuse the edges of the MCA territory. Good collaterals limit severe hypoperfusion to a small region; poor collaterals leave a large area severely ischemic.',
    focus: ['collaterals', 'aca', 'pca', 'oligemia'],
    bedside: ['Severity scales (e.g., NIHSS) describe deficits but do not measure collaterals or tissue viability.'],
    labs: [{ name: 'Coagulation / platelets', trend: 'Contextual', mechanism: 'Relevant to bleeding risk and anticoagulant exposure.', limit: 'Do not diagnose stroke; results are interpreted by the treating team.' }] },
  { id: 'core-penumbra', name: 'Core forms; penumbra is threatened but potentially salvageable', short: 'Core & penumbra',
    explanation: 'Where flow is lowest, cells depolarise irreversibly (core). Around it, the penumbra is electrically silent but structurally intact. Imaging can estimate these regions, with method- and timing-dependent error.',
    focus: ['core', 'penumbra', 'imaging'],
    bedside: ['Clinical deficit reflects both core and penumbra, so deficits can be larger than final injury.'],
    labs: [{ name: 'Troponin / ECG', trend: 'Contextual', mechanism: 'Cardiac evaluation looks for embolic sources (e.g., atrial fibrillation) and co-existing cardiac injury.', limit: 'Not a measure of brain injury.' }] },
  { id: 'evolution', name: 'Variable evolution: growth into penumbra or preservation with reperfusion', short: 'Evolution',
    explanation: 'Without reperfusion, the core usually grows into the penumbra at a rate set mainly by collaterals (“fast” vs “slow” progressors). Reperfusion may preserve penumbral tissue but does not reverse established core; haemorrhagic transformation and oedema are possible risks.',
    focus: ['core', 'penumbra', 'collaterals'],
    bedside: ['Neurologic worsening can reflect core growth, oedema, haemorrhagic transformation, seizure or systemic factors.'],
    labs: [{ name: 'Biomarkers', trend: 'None measures core/penumbra', mechanism: 'No blood test defines infarct or salvageable tissue.', limit: 'Imaging plus clinical assessment are used; both carry uncertainty.' }] },
];

export const IMAGING_CONCEPT = [
  'Non-contrast CT (NCCT): primarily excludes haemorrhage and shows established early ischaemic change (loss of grey–white differentiation, sulcal effacement, hyperdense vessel sign). It is often normal or subtle early; it does not show penumbra.',
  'CT angiography (CTA): locates the occlusion and can grade collaterals. It does not by itself measure core or penumbra volume.',
  'CT perfusion (CTP): estimates core (e.g., severely reduced CBF) and hypoperfused tissue (e.g., prolonged Tmax); their difference is a “mismatch”. Results depend on acquisition timing, arterial input, motion, thresholds and vendor software, and may over- or under-call core, especially very early.',
  'MRI diffusion-weighted imaging is another core estimate; diffusion lesions can occasionally partially reverse with early reperfusion.',
  'The panel icons in this lesson are conceptual drawings, not scans, and no thresholds or treatment eligibility rules are implied.',
];

export const VARIATIONS = [
  { title: 'Collateral status', text: 'Good collaterals can sustain penumbra for many hours; poor collaterals can lead to rapid core growth. Time is important but tissue status varies.' },
  { title: 'Occlusion site', text: 'Proximal M1 occlusion threatens cortical and deep territories; distal M2/M3 occlusions threaten smaller areas.' },
  { title: 'Spontaneous recanalisation', text: 'Emboli can fragment or move, changing the territory at risk.' },
  { title: 'Mimics and chameleons', text: 'Seizure, hypoglycaemia, migraine and others can mimic stroke; posterior circulation and subtle strokes can be missed.' },
  { title: 'Reperfusion limits', text: 'Large-vessel recanalisation does not guarantee tissue reperfusion (no-reflow), and reperfusion carries haemorrhage risk.' },
];

export const CANNOT_DETERMINE = [
  'Whether a person is having a stroke, or its type — haemorrhage must be excluded by imaging.',
  'Exact core or penumbra volumes; drawings are not segmentation outputs.',
  'Treatment eligibility, timing windows or outcomes.',
  'A fixed rate of tissue loss — it varies widely between people.',
];

export const ESCALATION_NOTE = 'Educational note: sudden face drooping, arm or leg weakness, speech difficulty, vision loss or loss of balance are reasons to call emergency services immediately and note the time last known well. This lesson gives no patient-specific advice, eligibility criteria or dosing.';

export const SOURCES = [
  { name: 'Powers WJ, et al. 2019 Update to the 2018 Guidelines for the Early Management of Acute Ischemic Stroke (AHA/ASA). Stroke', url: 'https://doi.org/10.1161/STR.0000000000000211' },
  { name: 'AHA/ASA guideline document cited in the Physiology Animation Lab (Stroke, STR.0000000000000513)', url: 'https://www.ahajournals.org/doi/10.1161/STR.0000000000000513' },
  { name: 'Albers GW, et al. Thrombectomy for Stroke at 6 to 16 Hours with Selection by Perfusion Imaging (DEFUSE 3). N Engl J Med 2018', url: 'https://doi.org/10.1056/NEJMoa1713973' },
  { name: 'Campbell BCV, et al. Ischaemic stroke. Nat Rev Dis Primers 2019', url: 'https://doi.org/10.1038/s41572-019-0118-8' },
  { name: 'AANS: Cerebrovascular Imaging', url: 'https://www.aans.org/patients/conditions-treatments/cerebrovascular-imaging/' },
];

export type SceneState = { clot: number; flow: number; collateral: number; core: number; penumbra: number; oligemia: number };
/** core/penumbra = conceptual 0–1 extents. */
export function sceneState(t: number, normal = false): SceneState {
  if (normal) return { clot: 0, flow: 1, collateral: 0.15, core: 0, penumbra: 0, oligemia: 0 };
  const x = clampTime(t);
  const clot = ramp(x, 5, 8), collateral = 0.15 + 0.85 * ramp(x, 10, 14);
  const penumbra = ramp(x, 8, 12), core = 0.25 * ramp(x, 15, 19) + 0.35 * ramp(x, 20, 24);
  return { clot, flow: 1 - 0.95 * clot, collateral, core, penumbra, oligemia: ramp(x, 11, 14) };
}
