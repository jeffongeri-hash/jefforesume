// Pure lesson data + conceptual state: MCA occlusion → ischemic core and penumbra. 0–1 intensities only.
import { ramp, clampTime, type GenericPhase } from './timeline';
export * from './timeline';

export const MCA_STROKE_PATH = '/pathophysiology-atlas/mca-ischemic-stroke';

export type StructureId = 'ica' | 'mca' | 'clot' | 'aca' | 'pca' | 'collaterals' | 'core' | 'penumbra' | 'oligemia' | 'imaging' | 'basilar' | 'frontal' | 'parietal' | 'temporal' | 'occipital' | 'cerebellum' | 'brainstem' | 'thalamus' | 'motorStrip' | 'territories' | 'callosum';

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
  basilar: { label: 'Vertebrobasilar system', explanation: 'The two vertebral arteries join to form the basilar artery on the ventral pons. It supplies the brainstem (via perforators), cerebellum (SCA, AICA; PICA usually from the vertebral) and ends by dividing into both PCAs. Posterior communicating arteries can connect it to the carotid circulation; their size varies.' },
  frontal: { label: 'Frontal lobe', explanation: 'Includes the precentral (primary motor) gyrus just in front of the central sulcus, the frontal eye fields and, in the language-dominant hemisphere, Broca’s area in the inferior frontal gyrus.' },
  parietal: { label: 'Parietal lobe', explanation: 'Postcentral (primary sensory) gyrus and association cortex for spatial attention. Non-dominant parietal injury classically produces hemispatial neglect.' },
  temporal: { label: 'Temporal lobe', explanation: 'Below the Sylvian (lateral) fissure. Wernicke’s area (dominant posterior superior temporal gyrus) supports language comprehension; the optic radiation (Meyer’s loop) passes through it. Inferomedial temporal lobe is often PCA territory.' },
  occipital: { label: 'Occipital lobe', explanation: 'Primary visual cortex lines the calcarine sulcus on the medial surface (usually PCA territory). Injury causes a contralateral homonymous visual field defect.' },
  cerebellum: { label: 'Cerebellum', explanation: 'Posterior circulation territory (SCA, AICA, PICA). Injury can cause ataxia, vertigo, nystagmus and vomiting; cerebellar swelling can compress the brainstem or fourth ventricle.' },
  brainstem: { label: 'Brainstem (midbrain, pons, medulla)', explanation: 'Supplied by basilar and vertebral perforators. Contains cranial nerve nuclei, long motor/sensory tracts and arousal systems, so lesions can cause crossed or bilateral signs, eye-movement problems, dysarthria and reduced consciousness.' },
  thalamus: { label: 'Thalamus', explanation: 'Deep relay nucleus supplied mainly by perforators from the PCA and posterior communicating arteries. Thalamic infarcts can cause sensory loss, memory or arousal changes.' },
  motorStrip: { label: 'Motor homunculus (concept)', explanation: 'Along the precentral gyrus the leg is represented near the vertex and continues onto the medial surface (ACA territory); the arm and face lie on the lateral convexity (MCA territory). This is why MCA strokes classically affect face/arm more than leg, and ACA strokes the leg more.' },
  territories: { label: 'Vascular territories (variable)', explanation: 'Coloured regions follow published average territory atlases. Boundaries vary between individuals, overlap at watershed zones, and shift with collateral supply, fetal-type PCAs and other variants. They are illustrations, not segmentation of any brain.' },
  callosum: { label: 'Corpus callosum', explanation: 'The large commissure seen on the medial surface. Its anterior part and body are ACA territory (pericallosal artery); the splenium is often PCA territory.' },
  imaging: { label: 'Imaging concept panel', explanation: 'Conceptual NCCT / CTA / CT perfusion comparison. CTA shows where a vessel is occluded; perfusion imaging estimates core and hypoperfused tissue. These icons are not scans and do not represent any patient.' },
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
  { title: 'Language dominance', text: 'Language is left-hemisphere dominant in most right-handed and many left-handed people, but not all; the dominance selector here is a teaching assumption.' },
  { title: 'Territory variants', text: 'Fetal-type PCA, an azygos or hypoplastic A1, and variable Pcomm size change which artery supplies a region and which collaterals exist.' },
  { title: 'Symptoms are not vessel diagnosis', text: 'Classic syndromes overlap, can be partial and are mimicked by other conditions. Vessel occlusion is shown by vascular imaging, not inferred from symptoms.' },
  { title: 'Mimics and chameleons', text: 'Seizure, hypoglycaemia, migraine and others can mimic stroke; posterior circulation and subtle strokes can be missed.' },
  { title: 'Reperfusion limits', text: 'Large-vessel recanalisation does not guarantee tissue reperfusion (no-reflow), and reperfusion carries haemorrhage risk.' },
];

export const CANNOT_DETERMINE = [
  'Whether a person is having a stroke, or its type — haemorrhage must be excluded by imaging.',
  'Exact core or penumbra volumes; drawings are not segmentation outputs.',
  'Treatment eligibility, timing windows or outcomes.',
  'A fixed rate of tissue loss — it varies widely between people.',
  'Which vessel is occluded from symptoms alone — the symptom figure shows classic associations, not a diagnosis.',
];

export const ESCALATION_NOTE = 'Educational note: sudden face drooping, arm or leg weakness, speech difficulty, vision loss or loss of balance are reasons to call emergency services immediately and note the time last known well. This lesson gives no patient-specific advice, eligibility criteria or dosing.';

export const SOURCES = [
  { name: 'Powers WJ, et al. 2019 Update to the 2018 Guidelines for the Early Management of Acute Ischemic Stroke (AHA/ASA). Stroke', url: 'https://doi.org/10.1161/STR.0000000000000211' },
  { name: 'AHA/ASA guideline document cited in the Physiology Animation Lab (Stroke, STR.0000000000000513)', url: 'https://www.ahajournals.org/doi/10.1161/STR.0000000000000513' },
  { name: 'Albers GW, et al. Thrombectomy for Stroke at 6 to 16 Hours with Selection by Perfusion Imaging (DEFUSE 3). N Engl J Med 2018', url: 'https://doi.org/10.1056/NEJMoa1713973' },
  { name: 'Campbell BCV, et al. Ischaemic stroke. Nat Rev Dis Primers 2019', url: 'https://doi.org/10.1038/s41572-019-0118-8' },
  { name: 'Tatu L, et al. Arterial territories of the human brain: cerebral hemispheres. Neurology 1998', url: 'https://doi.org/10.1212/WNL.50.6.1699' },
  { name: 'Mattle HP, et al. Basilar artery occlusion. Lancet Neurol 2011', url: 'https://doi.org/10.1016/S1474-4422(11)70229-0' },
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

// ---------- Selectable occlusion site, hemisphere and symptom associations ----------
export type StrokeVariant = 'mca' | 'aca' | 'pca' | 'basilar';
export const VARIANTS: { id: StrokeVariant; label: string; hint: string }[] = [
  { id: 'mca', label: 'MCA', hint: 'Lateral convexity, insula and (via M1 perforators) deep structures.' },
  { id: 'aca', label: 'ACA', hint: 'Medial frontal and parietal cortex and a parasagittal strip of the convexity.' },
  { id: 'pca', label: 'PCA', hint: 'Occipital lobe, inferomedial temporal lobe and thalamic perforators.' },
  { id: 'basilar', label: 'Basilar (posterior circulation)', hint: 'Brainstem, cerebellum, thalami and both PCA territories — bilateral by nature.' },
];
export const asStroke = (v: string): StrokeVariant => (['aca', 'pca', 'basilar'].includes(v) ? (v as StrokeVariant) : 'mca');

const OCCLUSION_TEXT: Record<StrokeVariant, { name: string; explanation: string; bedside: string[] }> = {
  mca: { name: PHASES[1].name, explanation: PHASES[1].explanation, bedside: PHASES[1].bedside },
  aca: { name: 'ACA occlusion and abrupt hypoperfusion', explanation: 'An embolus or thrombus occludes the ACA (often distal to the anterior communicating artery). Flow falls to the medial frontal and parietal cortex, including the leg area of the motor strip. If the ACoA is distal to the clot, the other ACA may partly compensate.', bedside: ['Classic associations: contralateral leg weakness or sensory loss greater than arm, with face often spared.', 'Possible abulia (reduced initiative), urinary incontinence or frontal behavioural change; transcortical motor aphasia if dominant — not always present.'] },
  pca: { name: 'PCA occlusion and abrupt hypoperfusion', explanation: 'An embolus (often from the heart or vertebrobasilar system) or in-situ thrombus occludes the PCA. Flow falls to the occipital lobe and inferomedial temporal lobe; proximal occlusions can also affect thalamic perforators.', bedside: ['Classic association: contralateral homonymous hemianopia, which patients may not notice themselves.', 'Possible memory disturbance, alexia without agraphia (dominant) or visual agnosia; thalamic involvement can add sensory loss.', 'Posterior strokes are more often missed by anterior-weighted screening tools.'] },
  basilar: { name: 'Basilar artery occlusion and posterior-circulation hypoperfusion', explanation: 'Thrombus or embolus in the basilar artery reduces flow to brainstem perforators, cerebellum, thalami and both PCAs. Onset may be sudden or stuttering, sometimes with preceding transient symptoms. Posterior communicating arteries can supply collateral flow from the carotids.', bedside: ['Possible features: reduced consciousness, vertigo, nausea/vomiting, diplopia or abnormal eye movements, dysarthria, dysphagia, ataxia, and unilateral, crossed or bilateral weakness.', 'Severe cases can produce coma or a locked-in state; milder or fluctuating presentations occur and are easily mistaken for other conditions.'] },
};
const COLLATERAL_TEXT: Record<StrokeVariant, string> = {
  mca: PHASES[2].explanation,
  aca: 'Leptomeningeal collaterals from MCA and PCA branches, and cross-filling through the anterior communicating artery, can partially perfuse the ACA territory. Their contribution varies widely.',
  pca: 'Leptomeningeal collaterals from MCA (and ACA) branches can perfuse parts of the PCA territory; a large posterior communicating artery or fetal-type PCA changes which circulation supplies it.',
  basilar: 'Collateral supply can arrive from the carotid circulation through the posterior communicating arteries and from cerebellar anastomoses. Pcomm size varies greatly, which partly explains very different courses.',
};
export const phasesFor = (v: string): Phase[] => {
  const k = asStroke(v);
  return PHASES.map((p, i) => i === 1 ? { ...p, name: OCCLUSION_TEXT[k].name, explanation: OCCLUSION_TEXT[k].explanation, bedside: OCCLUSION_TEXT[k].bedside, focus: ['clot', k === 'basilar' ? 'basilar' : k, 'territories'] }
    : i === 2 ? { ...p, explanation: COLLATERAL_TEXT[k], focus: k === 'basilar' ? ['collaterals', 'basilar', 'brainstem'] : ['collaterals', 'territories', 'oligemia'] }
    : i === 0 ? { ...p, name: 'Normal perfusion, territories and collateral network', focus: ['territories', 'motorStrip', 'collaterals'] }
    : p);
};

export type Deficit = { face: number; arm: number; leg: number; bilateral: boolean; hemianopia: number; language: number; neglect: number; brainstem: number };
/** Classic symptom associations (0–1 emphasis) for the lesion side. Educational only — symptoms do not establish which vessel is occluded. */
export function deficits(v: string, lesionSide: 'left' | 'right', dominant: 'left' | 'right' = 'left'): Deficit {
  const k = asStroke(v), dom = lesionSide === dominant;
  switch (k) {
    case 'mca': return { face: 1, arm: 1, leg: 0.4, bilateral: false, hemianopia: 0.5, language: dom ? 1 : 0, neglect: dom ? 0 : 1, brainstem: 0 };
    case 'aca': return { face: 0, arm: 0.35, leg: 1, bilateral: false, hemianopia: 0, language: dom ? 0.3 : 0, neglect: 0, brainstem: 0 };
    case 'pca': return { face: 0, arm: 0, leg: 0, bilateral: false, hemianopia: 1, language: dom ? 0.3 : 0, neglect: dom ? 0 : 0.3, brainstem: 0 };
    default: return { face: 0.5, arm: 0.6, leg: 0.6, bilateral: true, hemianopia: 0.4, language: 0, neglect: 0, brainstem: 1 };
  }
}

export const SYMPTOM_NOTES: Record<StrokeVariant, string[]> = {
  mca: ['Contralateral face and arm weakness/numbness greater than leg', 'Dominant hemisphere: aphasia (expressive, receptive or global)', 'Non-dominant hemisphere: neglect, anosognosia', 'Gaze deviation toward the lesion; possible contralateral homonymous hemianopia'],
  aca: ['Contralateral leg weakness/numbness greater than arm; face usually spared', 'Possible abulia, urinary incontinence, frontal release signs', 'Bilateral ACA territory infarcts can occur when both arise from one A1'],
  pca: ['Contralateral homonymous hemianopia (often macular-sparing)', 'Dominant hemisphere: possible alexia without agraphia', 'Possible memory impairment; thalamic involvement can add sensory loss'],
  basilar: ['Bilateral or crossed signs (cranial nerve on one side, limbs on the other)', 'Diplopia, gaze palsies, dysarthria, dysphagia, ataxia, vertigo', 'Reduced consciousness; locked-in state in severe pontine involvement', 'Bilateral visual loss if both PCAs are affected'],
};
