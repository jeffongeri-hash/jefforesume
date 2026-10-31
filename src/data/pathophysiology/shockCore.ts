// Pure dimensionless teaching states: never patient hemodynamics or diagnostic cutoffs.
import { clampTime, ramp, type GenericPhase, type Lab } from './timeline';
import type { Deep } from './deepMechanisms';
export { LESSON_DURATION, clampTime, phaseAt, phaseStart, tick } from './timeline';
export type ShockMechanism = 'cardiogenic' | 'pe' | 'tamponade' | 'tension' | 'anaphylaxis';
export const STRUCTURES = {
  heart: { label: 'Heart / ventricles', explanation: 'Illustrative anterior four-chamber cutaway: patient right is viewer left. Right-heart output supplies pulmonary flow and then left-heart filling. Chamber shading and motion are qualitative, not echocardiography.' },
  pulmonary: { label: 'Pulmonary artery / RV afterload', explanation: 'The right ventricle ejects venous blood into pulmonary arteries. Acute embolic obstruction and pulmonary vasoconstriction can increase RV afterload; a clot does not block the systemic aorta. RV reserve and obstruction distribution vary.' },
  pericardium: { label: 'Pericardial space', explanation: 'Fluid under pressure within the pericardial sac can constrain diastolic filling. Rate of accumulation, compliance and baseline filling pressure matter more than volume alone; an effusion is not automatically tamponade.' },
  pleura: { label: 'Pleural space / lung', explanation: 'Pleural air is outside the lung, between visceral and parietal pleura. A selected right tension mechanism shows rising pressure, lung compression and impaired venous return. Not every pneumothorax develops tension; mediastinal displacement and classic signs may be absent.' },
  veins: { label: 'Systemic veins / venous return', explanation: 'Venous return depends on upstream filling pressure, right atrial pressure and resistance. External thoracic or pericardial pressure can impede return despite venous congestion; vasodilation and capillary leak can reduce effective filling without external blood loss.' },
  arteries: { label: 'Aorta / systemic vascular tone', explanation: 'LV output supplies systemic arterial flow. Pressure reflects both flow and vascular resistance. Compensatory vasoconstriction may maintain pressure despite inadequate perfusion; anaphylaxis can reduce vascular tone despite sympathetic activation.' },
  airway: { label: 'Airway / bronchi', explanation: 'Anaphylaxis can cause bronchial smooth-muscle constriction and mucosal edema, including upper-airway swelling. Airway involvement is variable and can occur independently of visible rash. These are separate enlarged conceptual airway insets, not continuous anatomy or diagnostic imaging.' },
  tissue: { label: 'Capillary / tissue delivery', explanation: 'Separate magnified inset. Oxygen delivery depends on cardiac output and arterial oxygen content. Endothelial leak moves plasma into interstitium in anaphylaxis. Preserved saturation does not establish adequate perfusion; organ injury is possible, not inevitable.' },
};
export type StructureId = keyof typeof STRUCTURES;
export function shockState(time: number, mechanism: ShockMechanism, normal = false) {
  const t = clampTime(time), event = normal ? 0 : ramp(t, 5, 9), consequence = normal ? 0 : ramp(t, 10, 14), compensation = normal ? 0 : ramp(t, 15, 19), dysfunction = normal ? 0 : ramp(t, 20, 24);
  const pump = mechanism === 'cardiogenic', pe = mechanism === 'pe', tamponade = mechanism === 'tamponade', tension = mechanism === 'tension', allergy = mechanism === 'anaphylaxis';
  return { event, consequence, compensation, dysfunction,
    contractility: 1 - (pump ? 0.45 * event + 0.2 * dysfunction : pe ? 0.2 * consequence + 0.15 * dysfunction : 0),
    filling: 1 - (pump ? 0 : 0.45 * consequence + 0.15 * dysfunction),
    strokeVolume: 1 - 0.45 * consequence - 0.2 * dysfunction,
    forwardFlow: 1 - 0.35 * consequence - 0.3 * dysfunction,
    oxygenDelivery: 1 - 0.35 * consequence - 0.4 * dysfunction,
    pulmonaryResistance: pe ? event : 0, pericardialPressure: tamponade ? event : 0, pleuralPressure: tension ? event : 0,
    congestion: pump ? consequence : pe || tamponade || tension ? 0.7 * consequence : 0,
    leak: allergy ? consequence : 0, vasodilation: allergy ? event : 0, airwayNarrowing: allergy ? 0.65 * consequence : 0,
    sympathetic: compensation, pulseRate: 1 + 0.35 * compensation,
    vascularTone: allergy ? 1 - 0.5 * event : 1 + 0.3 * compensation,
    pressureSupport: 1 - (allergy ? 0.3 * event : 0) - 0.45 * dysfunction,
  };
}
export const lactate: Lab = { name: 'Lactate / acid–base', trend: 'May rise; early or mixed results vary', mechanism: 'Low delivery can limit oxidative metabolism. Adrenergic glycolysis and impaired hepatic clearance also raise lactate; ventilation and renal function modify acid–base patterns.', limit: 'Lactate does not prove hypoxia or identify shock type. Normal lactate or pH cannot exclude early compromise; no thresholds are supplied.' };
export const renal: Lab = { name: 'Urine output / creatinine', trend: 'Output may fall; creatinine may lag', mechanism: 'Lower renal flow and sympathetic/neurohormonal responses reduce filtration and conserve water; sustained hypoperfusion may injure kidneys.', limit: 'Baseline disease, obstruction and medications alter findings. Neither alone establishes shock.' };
export const troponin: Lab = { name: 'Troponin', trend: 'May rise with myocardial injury', mechanism: 'Cardiomyocyte injury from ischemia, wall stress or supply–demand imbalance can release troponin; acute PE can injure the pressure-loaded RV.', limit: 'Elevation is not specific for coronary occlusion, MI or a shock mechanism; early samples may be normal. MI requires compatible evidence of ischemia, not troponin alone.' };
export const bnp: Lab = { name: 'BNP / NT-proBNP', trend: 'May rise with chamber wall stress', mechanism: 'Myocardial stretch from pressure or volume loading stimulates natriuretic peptide release.', limit: 'Age, renal function, obesity, rhythm and chronic disease affect results. A level does not define shock or localize its cause.' };
export const PHASE_IDS = ['normal', 'event', 'consequence', 'compensation', 'deterioration'] as const;
export type PhaseSpec = { name: string; short: string; chain: string; cellular: string; findings: string; limits: string; focus: StructureId[]; labs: Lab[] };
export function makePhases(specs: PhaseSpec[]): GenericPhase<StructureId>[] {
  return specs.map((s, i) => ({ id: PHASE_IDS[i], name: s.name, short: s.short, explanation: s.chain, focus: s.focus, bedside: [s.findings, s.limits], labs: s.labs }));
}
export function makeDeep(specs: PhaseSpec[], refs: { name: string; url: string }[], id: string): Deep | undefined {
  const i = PHASE_IDS.findIndex(p => p === id), s = specs[i];
  if (!s) return undefined;
  return { sections: [{ h: 'Initiating mechanism → circulation', t: s.chain }, { h: 'Cellular, vascular and organ consequences', t: s.cellular }, { h: 'Why bedside findings and tests can change', t: s.findings + ' ' + s.labs.map(l => `${l.name}: ${l.mechanism} ${l.limit}`).join(' ') }, { h: 'Variation and interpretive limits', t: s.limits }], refs };
}
export const CANNOT_DETERMINE = ['A patient’s pressure, cardiac output, oxygen delivery, severity or prognosis from relative indicators.', 'A shock diagnosis or mechanism from any single sign, biomarker or image.', 'A fixed clinical timetable or inevitable deterioration; phases separate overlapping processes.', 'Patient-specific treatment, dosing, procedures or a management algorithm.'];
export const ESCALATION_NOTE = 'Suspected circulatory collapse, severe breathlessness, altered responsiveness or rapidly evolving airway swelling warrants immediate emergency evaluation and emergency services. A reassuring early pressure, saturation or laboratory result does not exclude deterioration. This is clinician education, not a patient-specific treatment protocol.';
