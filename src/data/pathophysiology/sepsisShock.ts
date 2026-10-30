// Pure lesson data + conceptual state: sepsis → distributive shock. Scene values are 0–1 intensities, never patient values.
import { ramp, clampTime, type GenericPhase } from './timeline';
export * from './timeline';

export const SEPSIS_PATH = '/pathophysiology-atlas/sepsis-distributive-shock';

export type StructureId = 'pathogen' | 'innate-cell' | 'endothelium' | 'glycocalyx' | 'smooth-muscle' | 'arteriole' | 'capillaries' | 'interstitium' | 'tissue-cell';

export const STRUCTURES: Record<StructureId, { label: string; explanation: string }> = {
  pathogen: { label: 'Pathogen / PAMPs', explanation: 'Microbial components (e.g., lipopolysaccharide, lipoproteins, nucleic acids) are pathogen-associated molecular patterns. Damaged host cells also release DAMPs. The source, organism and host determine the response; many infections never become sepsis.' },
  'innate-cell': { label: 'Innate immune cells', explanation: 'Macrophages, neutrophils and monocytes sense PAMPs/DAMPs through pattern-recognition receptors such as Toll-like receptors, releasing mediators (TNF, IL-1, IL-6 are examples). Pro- and anti-inflammatory/immunosuppressive responses coexist; sepsis is not universally a “cytokine storm”.' },
  endothelium: { label: 'Endothelium', explanation: 'Activated endothelium expresses adhesion molecules, becomes procoagulant and loses barrier integrity. Endothelial dysfunction links inflammation, coagulation and capillary leak.' },
  glycocalyx: { label: 'Endothelial glycocalyx', explanation: 'A luminal gel of proteoglycans and glycosaminoglycans that limits leak, adhesion and thrombosis. Shedding during sepsis is associated with permeability and microvascular dysfunction.' },
  'smooth-muscle': { label: 'Vascular smooth muscle', explanation: 'Inducible nitric oxide synthase raises NO, which via cGMP relaxes smooth muscle. Opening of K-ATP channels, relative vasopressin deficiency and adrenergic receptor hyporesponsiveness also contribute to vasoplegia (vasodilatory shock).' },
  arteriole: { label: 'Resistance arteriole', explanation: 'Arteriolar dilation lowers systemic vascular resistance. Arterial pressure depends on resistance and cardiac output; output may be high, normal or low and can fall with septic cardiomyopathy or hypovolaemia.' },
  capillaries: { label: 'Capillary bed (heterogeneous flow)', explanation: 'Some capillaries flow briskly, others are sluggish or stopped (leukocyte plugging, microthrombi, red-cell stiffening, shunting). Restored blood pressure does not guarantee restored microcirculatory flow (“loss of haemodynamic coherence”).' },
  interstitium: { label: 'Interstitium (oedema)', explanation: 'Fluid and protein leak across a damaged barrier, increasing interstitial oedema and diffusion distance while reducing effective circulating volume.' },
  'tissue-cell': { label: 'Tissue cell / mitochondria', explanation: 'Organ dysfunction can reflect reduced delivery and also impaired cellular oxygen use (mitochondrial dysfunction, “cytopathic hypoxia”). Organ injury is variable and often reversible.' },
};

export type Phase = GenericPhase<StructureId>;

export const PHASES: Phase[] = [
  { id: 'normal', name: 'Infection meets normal microvascular regulation', short: 'Recognition',
    explanation: 'A focus of infection releases PAMPs. Innate cells recognise them via pattern-recognition receptors. Normally, local inflammation contains the infection while arteriolar tone, an intact glycocalyx and uniform capillary flow keep tissue perfusion matched to demand.',
    focus: ['pathogen', 'innate-cell', 'glycocalyx'],
    bedside: ['Localising symptoms depend on the source (e.g., cough, dysuria, abdominal pain, skin changes) — or may be absent, especially in older or immunocompromised patients.', 'Infection without organ dysfunction is not sepsis (Sepsis-3).'],
    labs: [{ name: 'Labs', trend: 'May be unremarkable', mechanism: 'Localised infection may not yet produce systemic changes.', limit: 'Normal early labs do not exclude evolving sepsis.' }] },
  { id: 'host-response', name: 'Dysregulated host response', short: 'Host response',
    explanation: 'Mediators spread systemically. The response is dysregulated rather than simply “too much inflammation”: pro-inflammatory, anti-inflammatory and immunosuppressive processes coexist and vary by patient, pathogen and time. Endothelium activates; coagulation is triggered.',
    focus: ['innate-cell', 'endothelium'],
    bedside: ['Fever: cytokines (e.g., IL-1, IL-6, TNF) raise the hypothalamic set point via prostaglandin E2. Hypothermia can occur and is associated with worse outcomes; older adults may not mount fever.', 'Tachycardia: fever, pain, sympathetic activation and falling effective volume; may be blunted by beta-blockers or conduction disease.', 'Tachypnoea can be an early sign (metabolic acidosis compensation, lung involvement, mediator effects).'],
    labs: [
      { name: 'White cell count / neutrophils', trend: '↑, normal or ↓', mechanism: 'Marrow release and demargination raise counts; immature forms (“left shift”) may appear. Consumption, marrow suppression or overwhelming infection can lower counts.', limit: 'Variable and nonspecific; leukopenia does not exclude sepsis and leukocytosis does not prove it.' },
      { name: 'CRP / procalcitonin', trend: '↑ may occur', mechanism: 'Acute-phase hepatic response; procalcitonin rises particularly with bacterial infection.', limit: 'Lag the clinical course; neither diagnoses sepsis alone; elevated in non-infectious inflammation.' },
    ] },
  { id: 'vasodilation', name: 'NO-related vasodilation and endothelial dysfunction', short: 'Vasodilation',
    explanation: 'Increased NO and other vasodilator pathways relax arteriolar smooth muscle and blunt vasoconstrictor responses. Systemic vascular resistance falls. Glycocalyx shedding exposes endothelium; leukocytes and platelets adhere.',
    focus: ['smooth-muscle', 'arteriole', 'glycocalyx'],
    bedside: ['Warm peripheries and bounding pulses may be seen in some (“warm” shock), but cool, mottled skin with delayed capillary refill also occurs — phenotype varies.', 'Wide pulse pressure and low diastolic pressure can reflect low vascular tone.', 'Hypotension, when present, reflects resistance, volume and cardiac function together.'],
    labs: [{ name: 'Lactate', trend: 'May begin to ↑', mechanism: 'Adrenergic (β2) stimulation accelerates aerobic glycolysis and Na⁺/K⁺-ATPase activity in muscle — lactate rises even when oxygen is available.', limit: 'An elevated lactate does not by itself prove tissue hypoxia; a normal lactate does not exclude shock.' }] },
  { id: 'leak', name: 'Capillary leak and heterogeneous perfusion', short: 'Leak / heterogeneity',
    explanation: 'A disrupted barrier lets fluid and protein into the interstitium. Effective circulating volume and venous return fall. Within the capillary bed, flow becomes heterogeneous: some vessels flow, others stop, and oedema lengthens diffusion distance.',
    focus: ['capillaries', 'interstitium', 'endothelium'],
    bedside: ['Oedema and weight gain may develop, especially after fluid administration.', 'Reduced urine output, confusion or delirium, and mottling may signal organ hypoperfusion or dysfunction.', 'Hypoxaemia may reflect lung capillary leak (ARDS physiology) in some patients.'],
    labs: [
      { name: 'Platelets / coagulation', trend: 'Platelets may ↓; clotting times may ↑', mechanism: 'Consumption, endothelial activation and microthrombosis (sepsis-induced coagulopathy, possible DIC).', limit: 'Nonspecific; many other causes; interpret against baseline.' },
      { name: 'Albumin', trend: 'Often ↓', mechanism: 'Leak, dilution and reduced synthesis (negative acute-phase reactant).', limit: 'Slow-changing; not a marker of severity on its own.' },
    ] },
  { id: 'shock', name: 'Distributive shock and impaired effective oxygen use', short: 'Shock / organ dysfunction',
    explanation: 'Septic shock is sepsis with circulatory and cellular/metabolic abnormalities severe enough to substantially increase mortality. Low vascular tone, reduced effective volume, possible myocardial depression, microcirculatory heterogeneity and mitochondrial dysfunction together impair effective oxygen delivery and use. Recovery is possible; progression is not inevitable.',
    focus: ['capillaries', 'tissue-cell', 'arteriole'],
    bedside: ['Persistent hypotension, altered mentation, oliguria, rising work of breathing and mottling indicate organ dysfunction.', 'Haemodynamic improvement at the macrocirculation may not mean microcirculatory recovery.'],
    labs: [
      { name: 'Lactate', trend: 'May ↑ (persistent)', mechanism: 'Multiple causes: regional hypoperfusion and microcirculatory shunting, adrenergic aerobic glycolysis, mitochondrial dysfunction, and reduced hepatic/renal clearance.', limit: 'Not specific to hypoxia or sepsis; also raised by liver disease, seizures, drugs (e.g., β-agonists, metformin) and others. A trend is interpreted with the bedside picture.' },
      { name: 'Creatinine / bilirubin / gas exchange', trend: 'May worsen', mechanism: 'Organ dysfunction captured by SOFA components: kidney, liver, lung, coagulation, cardiovascular and CNS.', limit: 'Compare with baseline; changes lag injury and may have other causes.' },
      { name: 'Acid–base', trend: 'Metabolic acidosis may develop', mechanism: 'Lactate, other unmeasured anions, hyperchloraemia and kidney dysfunction can contribute.', limit: 'Context-dependent; mixed disorders are common.' },
    ] },
];

export const VARIATIONS = [
  { title: 'Cardiac output phenotype', text: 'Classic “high-output, low-resistance” shock is common but not universal. Septic cardiomyopathy, hypovolaemia or pre-existing heart disease can produce low output.' },
  { title: 'Not all sepsis is a cytokine storm', text: 'Immune responses range from hyperinflammatory to immunosuppressed, and can shift over time. Many patients have features of both.' },
  { title: 'Host factors', text: 'Age, frailty, immunosuppression, chronic disease and medications alter fever, heart rate response, white cell response and presentation.' },
  { title: 'Lactate interpretation', text: 'Hyperlactataemia reflects production and clearance. It is a marker of risk and of physiologic stress, not a direct measure of tissue oxygen debt.' },
  { title: 'Other distributive states', text: 'Anaphylaxis, neurogenic shock, adrenal insufficiency and some drug effects also lower vascular tone, through different mechanisms.' },
];

export const CANNOT_DETERMINE = [
  'Whether a particular patient has sepsis — that requires clinical assessment of infection and organ dysfunction.',
  'Cardiac output, vascular resistance or microcirculatory flow in any individual.',
  'Whether a raised lactate reflects hypoxia, adrenergic glycolysis, reduced clearance or another cause.',
  'Prognosis, timing or treatment choices; this is a conceptual sequence, not a clock.',
];

export const ESCALATION_NOTE = 'Educational note: suspected infection with confusion, fast breathing, low blood pressure, mottled or cold skin, or markedly reduced urine is a medical emergency — seek emergency care immediately. This lesson gives no patient-specific advice, fluid or vasopressor instructions, or dosing.';

export const SOURCES = [
  { name: 'Singer M, et al. The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). JAMA 2016', url: 'https://jamanetwork.com/journals/jama/fullarticle/2492881' },
  { name: 'Evans L, et al. Surviving Sepsis Campaign: International Guidelines 2021. Crit Care Med 2021', url: 'https://doi.org/10.1097/CCM.0000000000005337' },
  { name: 'Landry DW, Oliver JA. The pathogenesis of vasodilatory shock. N Engl J Med 2001', url: 'https://doi.org/10.1056/NEJMra002709' },
  { name: 'Garcia-Alvarez M, Marik P, Bellomo R. Sepsis-associated hyperlactatemia. Crit Care 2014', url: 'https://doi.org/10.1186/s13054-014-0503-3' },
  { name: 'Ince C. Hemodynamic coherence and the rationale for monitoring the microcirculation. Crit Care 2015', url: 'https://doi.org/10.1186/cc14726' },
  { name: 'PMC review cited in the Physiology Animation Lab (PMC4884305)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4884305/' },
];

export type SceneState = { pamp: number; immune: number; dilation: number; glycocalyx: number; leak: number; hetero: number; dysfunction: number };
export function sceneState(t: number, normal = false): SceneState {
  if (normal) return { pamp: 0, immune: 0, dilation: 0, glycocalyx: 1, leak: 0, hetero: 0, dysfunction: 0 };
  const x = clampTime(t);
  return { pamp: ramp(x, 0.5, 4), immune: ramp(x, 5, 9), dilation: ramp(x, 10, 14), glycocalyx: 1 - 0.85 * ramp(x, 9, 15), leak: ramp(x, 15, 19), hetero: ramp(x, 15.5, 20), dysfunction: ramp(x, 20, 24) };
}
