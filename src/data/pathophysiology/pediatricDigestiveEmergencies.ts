import { ramp, type GenericPhase, type Lab } from './timeline';
export { LESSON_DURATION, clampTime, phaseAt, phaseStart, tick } from './timeline';

export type DigestiveKind = 'pyloric' | 'volvulus' | 'dehydration';
export type DigestiveStructure = 'source' | 'anatomy' | 'flow' | 'effect';
export type RehydrationRoute = 'oral' | 'intravenous';
type Phase = GenericPhase<DigestiveStructure>;
type Source = { name: string; url: string };
type Lesson = {
  path: string;
  title: string;
  intro: string;
  normalTitle: string;
  escalation: string;
  structures: Record<DigestiveStructure, { label: string; explanation: string }>;
  phases: [Phase, Phase, Phase, Phase, Phase];
  sources: Source[];
  variations: { title: string; text: string }[];
};

const lab = (name: string, trend: string, mechanism: string, limit: string): Lab => ({ name, trend, mechanism, limit });
const phase = (id: string, name: string, short: string, explanation: string, focus: DigestiveStructure[], bedside: string, ...labs: Lab[]): Phase =>
  ({ id, name, short, explanation, focus, bedside: [bedside], labs });

export const DIGESTIVE_LESSONS: Record<DigestiveKind, Lesson> = {
  pyloric: {
    path: '/pathophysiology-atlas/infantile-pyloric-stenosis',
    title: 'Infantile Hypertrophic Pyloric Stenosis',
    intro: 'Follow a feed from the stomach through the pylorus and compare normal gastric emptying with obstruction, vomiting, electrolyte losses and pyloromyotomy.',
    normalTitle: 'Normal gastric outlet and duodenal flow',
    escalation: 'An infant with persistent forceful vomiting, lethargy, signs of dehydration or green vomit needs prompt medical assessment. Bilious vomiting requires urgent evaluation for intestinal obstruction.',
    structures: {
      source: { label: 'Stomach and gastric contents', explanation: 'The stomach receives feeds and secretes hydrochloric acid. Repeated vomiting loses water, chloride and hydrogen ions.' },
      anatomy: { label: 'Pyloric muscle and channel', explanation: 'Hypertrophy of the pyloric circular muscle narrows and elongates the gastric outlet. The duodenal mucosa continues through the channel.' },
      flow: { label: 'Duodenum and bile entry', explanation: 'The common bile duct generally enters the duodenum distal to the pylorus. Vomiting from isolated pyloric obstruction is typically nonbilious.' },
      effect: { label: 'Volume, chloride and acid–base effects', explanation: 'Gastric losses can produce volume depletion and chloride-responsive metabolic alkalosis. Potassium can also fall, especially with persistent losses.' },
    },
    phases: [
      phase('reference', 'Normal gastric emptying', 'Normal', 'A feed moves from the stomach through the pyloric channel into the duodenum. Bile enters the duodenum distal to the pylorus.', ['source', 'anatomy', 'flow'], 'This is a conceptual anterior cutaway with an enlarged pyloric channel.'),
      phase('hypertrophy', 'Pyloric muscle thickens', 'Muscle thickens', 'Hypertrophy of the pyloric muscle narrows the gastric outlet and makes it harder for stomach contents to pass into the duodenum.', ['anatomy', 'flow'], 'The onset and severity of obstruction vary.'),
      phase('vomiting', 'Gastric outlet obstruction and vomiting', 'Vomiting', 'Retained gastric contents can be vomited after feeds. In isolated pyloric obstruction, emesis is typically nonbilious because the obstruction is proximal to bile entry.', ['source', 'anatomy'], 'Nonbilious vomiting has multiple causes. Green emesis needs evaluation for a distal obstruction.', lab('Ultrasound', 'Can show a thickened and elongated pylorus', 'Ultrasound assesses pyloric anatomy and passage of gastric contents.', 'Measurements and interpretation depend on technique and clinical context.')),
      phase('electrolytes', 'Gastric and volume losses', 'Electrolyte loss', 'Loss of gastric hydrochloric acid and chloride, with volume depletion and renal potassium losses, can produce hypochloremic metabolic alkalosis and hypokalemia.', ['source', 'effect'], 'Earlier diagnosis may occur before the classic laboratory pattern develops.', lab('Chloride and bicarbonate', 'Chloride may fall; bicarbonate may rise', 'Gastric acid and chloride losses plus renal conservation can maintain alkalosis.', 'Normal early values do not exclude pyloric stenosis.'), lab('Potassium', 'May fall', 'Poor intake, vomiting and renal potassium losses contribute.', 'Serum values and the degree of depletion vary.')),
      phase('repair', 'Stabilization and pyloromyotomy', 'Response', 'Fluid and electrolyte abnormalities are corrected before definitive pyloromyotomy. Dividing the hypertrophied muscle relieves the narrowing without removing the pyloric mucosa.', ['anatomy', 'flow', 'effect'], 'The animation illustrates the physiologic result, not a surgical technique.'),
    ],
    sources: [
      { name: 'MedlinePlus — Pyloric stenosis in infants', url: 'https://medlineplus.gov/ency/article/000970.htm' },
      { name: 'MedlinePlus — Pyloromyotomy', url: 'https://medlineplus.gov/ency/presentations/100095_4.htm' },
      { name: 'PubMed — Hypertrophic pyloric stenosis', url: 'https://pubmed.ncbi.nlm.nih.gov/34599053/' },
    ],
    variations: [{ title: 'Laboratory timing', text: 'The classic hypochloremic, hypokalemic metabolic alkalosis is not universal, especially with earlier evaluation.' }],
  },
  volvulus: {
    path: '/pathophysiology-atlas/malrotation-midgut-volvulus',
    title: 'Intestinal Malrotation and Midgut Volvulus',
    intro: 'Follow the small bowel and mesenteric vessels as a malrotated midgut twists around its narrow mesenteric root and can lose perfusion.',
    normalTitle: 'Reference bowel and mesenteric blood supply',
    escalation: 'Bilious vomiting in an infant or a child with acute abdominal pain and signs of shock needs immediate emergency and surgical evaluation.',
    structures: {
      source: { label: 'Stomach and duodenum', explanation: 'The duodenum carries gastric contents and bile into the small intestine. A distal obstruction can cause bilious vomiting.' },
      anatomy: { label: 'Midgut and mesenteric root', explanation: 'Malrotation can leave a narrow mesenteric attachment, allowing the midgut to twist around the superior mesenteric vessels.' },
      flow: { label: 'Superior mesenteric vessels', explanation: 'Twisting can compromise mesenteric venous drainage and then arterial inflow, threatening a broad length of bowel.' },
      effect: { label: 'Bowel wall and perfusion', explanation: 'Persistent impaired perfusion can produce edema, ischemia, necrosis and perforation. The amount of injury varies.' },
    },
    phases: [
      phase('reference', 'Normal intestinal passage and blood supply', 'Normal', 'Contents pass through the duodenum and small bowel. The superior mesenteric vessels supply and drain the midgut.', ['source', 'anatomy', 'flow'], 'The abdomen is viewed from the front. The vessel inset is schematic.'),
      phase('malrotation', 'A narrow mesenteric attachment', 'Malrotation', 'Abnormal intestinal rotation or fixation can leave a narrow mesenteric base. Fibrous bands may also obstruct the duodenum.', ['anatomy', 'source'], 'Malrotation does not always progress to volvulus.'),
      phase('twisting', 'The midgut twists', 'Volvulus', 'The small bowel and its mesentery rotate around the mesenteric root, obstructing the intestine and compressing the mesenteric vessels.', ['anatomy', 'flow'], 'Bilious vomiting is a time-sensitive warning sign, particularly in an infant.', lab('Imaging', 'Upper GI contrast study may show malrotation or obstruction', 'Imaging can show the position and course of the duodenum and passage through the upper intestine.', 'Imaging choices depend on stability and local expertise.')),
      phase('ischemia', 'Perfusion can be compromised', 'Ischemia', 'Venous congestion and reduced arterial inflow can injure bowel. Prolonged ischemia can progress to necrosis and perforation.', ['flow', 'effect'], 'Pain, distension, bloody stool, lethargy or shock may occur. The presentation can be variable.', lab('Lactate', 'May rise with systemic hypoperfusion', 'Impaired oxygen delivery and shock can contribute to lactate elevation.', 'A normal lactate does not exclude early intestinal ischemia.')),
      phase('response', 'Urgent surgical source control', 'Untwist', 'Urgent surgical assessment addresses the twist, obstruction and bowel viability. Reperfusion after detorsion does not automatically reverse established tissue injury.', ['anatomy', 'flow', 'effect'], 'The scene illustrates untwisting and retained injury without showing an operative technique.'),
    ],
    sources: [{ name: 'NIDDK — Intestinal malrotation', url: 'https://www.niddk.nih.gov/health-information/digestive-diseases/anatomic-problems-lower-gi-tract/malrotation' }],
    variations: [{ title: 'Malrotation versus volvulus', text: 'Malrotation describes an anatomic arrangement. Volvulus is twisting that may obstruct bowel or its blood supply.' }],
  },
  dehydration: {
    path: '/pathophysiology-atlas/pediatric-dehydration',
    title: 'Pediatric Gastroenteritis and Dehydration',
    intro: 'Follow gastrointestinal water and electrolyte loss into reduced circulating volume, then compare conceptual oral and intravenous rehydration pathways.',
    normalTitle: 'Reference intestinal absorption and circulating volume',
    escalation: 'A child with lethargy, poor perfusion, markedly reduced urine output, inability to drink or persistent vomiting needs urgent medical assessment.',
    structures: {
      source: { label: 'Intestinal lumen and losses', explanation: 'Vomiting and diarrhea can remove water and electrolytes. Losses and oral intake vary during an illness.' },
      anatomy: { label: 'Intestinal epithelium and SGLT1', explanation: 'Sodium–glucose cotransport at the luminal surface promotes absorption of sodium and glucose. Water follows the resulting osmotic gradients.' },
      flow: { label: 'Circulating volume and renal perfusion', explanation: 'Loss of extracellular fluid can reduce effective circulating volume and renal perfusion. Heart rate and vascular tone may compensate initially.' },
      effect: { label: 'Kidney, urine and clinical response', explanation: 'Reduced renal perfusion can reduce urine output. Continued volume loss can progress from compensated to decompensated shock.' },
    },
    phases: [
      phase('reference', 'Fluid absorption and circulation', 'Normal', 'Intestinal absorption replaces routine fluid losses while circulation delivers blood to the kidneys and tissues.', ['anatomy', 'flow', 'effect'], 'The intestine, epithelial inset and circulation are shown separately.'),
      phase('losses', 'Vomiting and diarrhea increase losses', 'Fluid loss', 'Gastrointestinal illness can cause water and electrolyte losses while nausea, vomiting or reduced intake limits replacement.', ['source', 'anatomy'], 'Fluid losses can accumulate quickly in infants and young children.'),
      phase('volume', 'Effective circulating volume falls', 'Volume falls', 'When losses exceed intake, extracellular volume can fall. Sympathetic compensation may maintain blood pressure despite reduced circulating volume.', ['flow', 'effect'], 'Dry mucosa, decreased tears, delayed capillary refill and reduced urine output can occur.', lab('Serum sodium', 'May be normal, low or high', 'Water and sodium losses and replacement determine the concentration.', 'Serum sodium alone does not measure the degree of dehydration.')),
      phase('perfusion', 'Renal and tissue perfusion can fall', 'Perfusion', 'Continued losses can reduce renal perfusion and urine output. Severe hypovolemia can progress to shock.', ['flow', 'effect'], 'Tachycardia and cool extremities can precede hypotension.', lab('Bicarbonate / creatinine', 'May be abnormal', 'Diarrheal bicarbonate loss or reduced renal perfusion may alter laboratory values.', 'Findings depend on the cause, severity and timing.')),
      phase('rehydration', 'Rehydration supports recovery', 'Rehydration', 'Fluid and electrolytes replace losses. Select a route to compare oral sodium–glucose absorption with intravenous delivery to the circulation.', ['anatomy', 'flow', 'effect'], 'The choice and pace of rehydration depend on clinical severity, tolerance and assessment.'),
    ],
    sources: [
      { name: 'CDC — Managing acute gastroenteritis among children', url: 'https://www.cdc.gov/mmwr/preview/mmwrhtml/rr5216a1.htm' },
      { name: 'CDC Yellow Book — Infants and children', url: 'https://www.cdc.gov/yellow-book/hcp/family-travel/traveling-safely-with-infants-and-children.html' },
    ],
    variations: [
      { title: 'Route depends on the child', text: 'Oral or enteral rehydration is appropriate for many children. Severe shock or inability to use the gut can require intravenous therapy.' },
      { title: 'Sodium concentration and total deficit', text: 'Serum sodium can be low, normal or high. A concentration does not by itself quantify total-body water or electrolyte losses.' },
    ],
  },
};

export function digestivePhases(kind: DigestiveKind, variant: string): Phase[] {
  const phases = DIGESTIVE_LESSONS[kind].phases;
  if (kind !== 'dehydration') return phases;
  const intravenous = variant === 'intravenous';
  return phases.map(item => item.id !== 'rehydration' ? item : {
    ...item,
    name: intravenous ? 'Intravenous fluid delivery' : 'Oral sodium–glucose absorption',
    explanation: intravenous
      ? 'Intravenous fluid enters the circulation directly. Its composition, volume and rate depend on the clinical situation and monitoring.'
      : 'Glucose and sodium enter intestinal epithelial cells together through SGLT1. Absorption of solute promotes water absorption and supports circulating volume.',
    focus: intravenous ? ['flow', 'effect'] : ['anatomy', 'flow'],
  });
}

export function digestiveDeep(kind: DigestiveKind, variant: string, phaseId: string) {
  const lesson = DIGESTIVE_LESSONS[kind];
  const current = digestivePhases(kind, variant).find(item => item.id === phaseId);
  if (!current) return undefined;
  const detail = kind === 'pyloric' && phaseId === 'electrolytes'
    ? 'Loss of gastric hydrogen and chloride is paired with extracellular volume depletion. Reduced chloride availability impairs renal bicarbonate excretion. Secondary aldosterone activity can increase distal potassium and hydrogen secretion, sustaining alkalosis. Potassium depletion and aciduria are variable, and serum values can be normal early.'
    : kind === 'volvulus' && phaseId === 'ischemia'
      ? 'Venous compression can cause congestion and edema before arterial inflow is severely reduced. Edema can further impair perfusion. The duration and severity of twisting affect how much bowel is injured.'
      : kind === 'dehydration' && phaseId === 'rehydration'
        ? variant === 'intravenous'
          ? 'Intravenous fluid bypasses the intestinal epithelium. Vascular and interstitial distribution, ongoing losses and electrolyte abnormalities determine the response. Intravenous access does not itself correct the cause of diarrhea.'
          : 'SGLT1 couples luminal sodium and glucose entry into enterocytes. Sodium transport across the basolateral membrane maintains the gradient, and water follows solute through osmotic pathways. The transporter can remain functional during many diarrheal illnesses.'
        : current.bedside[0];
  return { sections: [{ h: 'Mechanism', t: current.explanation }, { h: 'Clinical interpretation', t: detail }], refs: lesson.sources };
}

export function digestiveState(kind: DigestiveKind, time: number, normal = false, variant: string = 'oral') {
  const t = normal ? 0 : time;
  const onset = ramp(t, 5, 10);
  const progression = ramp(t, 10, 15);
  const injury = ramp(t, 15, 20);
  const response = ramp(t, 20, 24.5);
  return {
    kind, variant: variant === 'intravenous' ? 'intravenous' : 'oral', time: t, onset, progression, injury, response,
    narrowedOutlet: kind === 'pyloric' ? onset * (1 - 0.85 * response) : 0,
    gastricLoss: kind === 'pyloric' ? progression * (1 - response) : 0,
    twist: kind === 'volvulus' ? progression * (1 - response) : 0,
    mesentericPerfusion: kind === 'volvulus' ? 1 - (0.5 * progression + 0.35 * injury) * (1 - 0.75 * response) : 1,
    bowelInjury: kind === 'volvulus' ? injury : 0,
    fluidLoss: kind === 'dehydration' ? onset * (1 - 0.65 * response) : 0,
    circulatingVolume: kind === 'dehydration' ? 1 - (0.25 * progression + 0.45 * injury) * (1 - 0.7 * response) : 1,
    therapy: kind === 'dehydration' ? response : 0,
  };
}
