import { ramp, type GenericPhase, type Lab } from './timeline';
export { LESSON_DURATION, clampTime, phaseAt, phaseStart, tick } from './timeline';

export type PediatricKind = 'tetralogy' | 'measles' | 'intussusception';
export type PediatricStructure = 'source' | 'anatomy' | 'flow' | 'effect';
type Phase = GenericPhase<PediatricStructure>;
type Lesson = {
  path: string;
  title: string;
  intro: string;
  escalation: string;
  structures: Record<PediatricStructure, { label: string; explanation: string }>;
  phases: [Phase, Phase, Phase, Phase, Phase];
  sources: { name: string; url: string }[];
  variations: { title: string; text: string }[];
};

const lab = (name: string, trend: string, mechanism: string, limit: string): Lab => ({ name, trend, mechanism, limit });
const phase = (id: string, name: string, short: string, explanation: string, focus: PediatricStructure[], bedside: string, ...labs: Lab[]): Phase =>
  ({ id, name, short, explanation, focus, bedside: [bedside], labs });

export const PEDIATRIC_LESSONS: Record<PediatricKind, Lesson> = {
  tetralogy: {
    path: '/pathophysiology-atlas/tetralogy-of-fallot',
    title: 'Tetralogy of Fallot and Hypercyanotic Spells',
    intro: 'Follow blood through the right and left ventricles, then see how right ventricular outflow obstruction changes the direction of shunting through a ventricular septal defect.',
    escalation: 'A cyanotic, lethargic, apneic or poorly perfused infant needs immediate emergency assessment and pediatric specialty support.',
    structures: {
      source: { label: 'Systemic venous return and right ventricle', explanation: 'Systemic venous blood reaches the right atrium and right ventricle. Chronic outflow obstruction contributes to right ventricular hypertrophy.' },
      anatomy: { label: 'Right ventricular outflow obstruction', explanation: 'Obstruction commonly includes narrowing below the pulmonary valve. Its severity varies and can change dynamically.' },
      flow: { label: 'Ventricular septal defect and overriding aorta', explanation: 'A large ventricular septal defect connects the ventricles. The aorta overrides the defect and can receive blood from both sides.' },
      effect: { label: 'Pulmonary and systemic flow', explanation: 'Reduced pulmonary blood flow and right-to-left shunting can reduce systemic arterial oxygen content. The diagram shows relative movement, not measured saturation.' },
    },
    phases: [
      phase('normal','Normal ventricular outflow','Normal','In the reference, the right ventricle ejects toward the pulmonary arteries. The left ventricle ejects oxygenated blood into the aorta, and the ventricular septum is intact.',['source','flow'],'Colors distinguish oxygen-poor and oxygen-rich pathways.'),
      phase('anatomy','Four features of tetralogy','Anatomy','Tetralogy includes right ventricular outflow obstruction, a ventricular septal defect, an overriding aorta and right ventricular hypertrophy. Severity and pulmonary blood flow vary.',['anatomy','flow'],'The obstruction is shown below the pulmonary valve in this example.'),
      phase('shunt','Obstruction changes blood distribution','Shunting','With significant right ventricular outflow obstruction, blood can cross the ventricular septal defect from right to left and enter the overriding aorta.',['flow','effect'],'A murmur may reflect right ventricular outflow obstruction. Cyanosis depends on physiology.',lab('Pulse oximetry','May be low','Deoxygenated blood entering systemic circulation reduces arterial oxygen saturation.','A normal or near-normal reading does not define the underlying anatomy.')),
      phase('spell','A hypercyanotic spell can develop','Tet spell','A sudden increase in right ventricular outflow obstruction or fall in systemic vascular resistance can increase right-to-left shunting and reduce pulmonary blood flow.',['anatomy','effect'],'Increased cyanosis, distress or altered responsiveness are urgent signs.',lab('Blood gas / lactate','Acidosis or lactate may rise','Severe hypoxemia and reduced oxygen delivery can contribute to metabolic acidosis.','Neither value identifies the cause of cyanosis.')),
      phase('response','Support and definitive assessment','Response','Improving systemic vascular resistance and relieving dynamic outflow obstruction are physiologic goals during a spell. Definitive management depends on the child and anatomy.',['anatomy','effect'],'Use immediate pediatric and cardiology support. Echocardiography defines the anatomy.',lab('Echocardiography','Defines anatomy and flow','Imaging identifies the septal defect, outflow obstruction and associated lesions.','This schematic is not an echocardiogram.')),
    ],
    sources: [{ name: 'CDC — Tetralogy of Fallot', url: 'https://www.cdc.gov/heart-defects/about/tetralogy-of-fallot.html' }, { name: 'American Heart Association — Tetralogy of Fallot', url: 'https://www.heart.org/en/health-topics/congenital-heart-defects/about-congenital-heart-defects/tetralogy-of-fallot' }],
    variations: [{ title: 'Severity varies', text: 'Milder outflow obstruction may allow more pulmonary flow and less cyanosis. A spell is a possible complication, not an inevitable sequence.' }],
  },
  measles: {
    path: '/pathophysiology-atlas/measles-complications', title: 'Measles: Spread, Pneumonia and Immune Effects',
    intro: 'Trace measles from the respiratory tract through lymphoid tissue and systemic spread, with separate views of lung injury and immune memory.',
    escalation: 'Suspected measles requires prompt infection-control precautions and public health coordination. Respiratory distress, dehydration or altered mental status needs emergency assessment.',
    structures: {
      source: { label: 'Respiratory entry', explanation: 'Measles spreads through the air. The respiratory tract is the entry site in this conceptual model.' },
      anatomy: { label: 'Regional lymphoid tissue', explanation: 'The virus replicates in immune cells and spreads through lymphoid tissue before systemic dissemination.' },
      flow: { label: 'Bloodstream and systemic spread', explanation: 'Infected immune cells carry infection to multiple tissues. The rash reflects the host immune response and timing varies.' },
      effect: { label: 'Lung, brain and immune memory', explanation: 'Complications can include pneumonia or encephalitis. Measles can also impair pre-existing immune memory after the acute infection.' },
    },
    phases: [
      phase('normal','Respiratory and immune defenses','Reference','Airway barriers and immune memory help defend against pathogens.',['source','effect'],'The lung and immune-cell panels are separate conceptual insets.'),
      phase('entry','Respiratory entry and lymphoid replication','Entry','Inhaled measles virus reaches respiratory immune cells and regional lymphoid tissue, where replication begins.',['source','anatomy'],'The incubation period precedes the typical febrile illness.'),
      phase('spread','Systemic spread and immune response','Spread','Infected immune cells spread virus systemically. Fever, cough, coryza and conjunctivitis can precede the characteristic rash.',['flow'],'Clinical features and exposure history guide suspicion.',lab('Measles testing','RT-PCR and serology', 'Specimen timing and prior immunity affect interpretation.', 'Negative or early tests require interpretation in clinical context.')),
      phase('complications','Pneumonia or neurologic complications','Complications','Measles can injure the respiratory tract and impair host defenses. Pneumonia can be viral or secondary bacterial infection. Encephalitis is another serious complication.',['effect'],'Not every patient develops each complication.',lab('Oxygenation','May fall with pneumonia','Inflammation and airspace disease can impair gas exchange.','Pulse oximetry does not identify the organism.')),
      phase('memory','Recovery and immune memory','Immune effects','Measles can deplete previously established immune memory, increasing vulnerability to other infections after the acute illness. This effect varies among individuals.',['effect'],'Immune amnesia and rare delayed neurologic complications have different time courses.'),
    ],
    sources: [{ name: 'CDC — Clinical overview of measles', url: 'https://www.cdc.gov/measles/hcp/clinical-overview/' }, { name: 'CDC Pink Book — Measles pathogenesis', url: 'https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-13-measles.html' }],
    variations: [{ title: 'Complications are variable', text: 'Pneumonia, encephalitis, dehydration and longer-term immune effects occur with different frequencies and timing.' }],
  },
  intussusception: {
    path: '/pathophysiology-atlas/intussusception', title: 'Pediatric Intussusception',
    intro: 'Watch one bowel segment telescope into another, carrying its mesentery inward and potentially compromising venous drainage and bowel perfusion.',
    escalation: 'A child with episodic severe abdominal pain, lethargy, bilious vomiting, blood in stool or signs of shock needs urgent emergency assessment.',
    structures: {
      source: { label: 'Proximal bowel', explanation: 'The segment that moves inward is the intussusceptum. Bowel contents normally move distally through the lumen.' },
      anatomy: { label: 'Receiving bowel', explanation: 'The outer receiving segment is the intussuscipiens. The ileocolic junction is a common site in young children.' },
      flow: { label: 'Mesentery and vessels', explanation: 'Mesentery and its vessels can be pulled into the narrowed space. Venous congestion may precede arterial compromise.' },
      effect: { label: 'Bowel wall and lumen', explanation: 'Edema can worsen the obstruction. Prolonged ischemia can injure the bowel wall and progress to perforation.' },
    },
    phases: [
      phase('normal','Open bowel and mesenteric flow','Normal','Bowel contents pass along an open lumen. Mesenteric vessels supply and drain the bowel wall.',['source','flow'],'The figure is a longitudinal teaching section.'),
      phase('telescope','Bowel telescopes inward','Telescoping','A proximal segment and its mesentery slide into the distal receiving bowel. The ileocolic pattern is common in children.',['source','anatomy'],'Intermittent pain and pallor or lethargy can occur between episodes.'),
      phase('congestion','Venous drainage becomes restricted','Congestion','Compression of mesenteric veins causes congestion and edema. A swollen wall can worsen luminal obstruction.',['flow','effect'],'Vomiting and abdominal distension can develop.',lab('Ultrasound','May show a target appearance','Concentric bowel layers form the target sign in cross-section.','The animation is not a diagnostic ultrasound.')),
      phase('ischemia','Perfusion can become compromised','Ischemia','Persistent compression can restrict arterial inflow, causing mucosal injury and potentially full-thickness ischemia.',['flow','effect'],'Bloody stool is a late or variable finding and need not be present.',lab('Lactate','May rise with systemic hypoperfusion','Impaired tissue perfusion can increase lactate production.','Normal lactate does not exclude bowel ischemia.')),
      phase('reduction','Reduction or surgery addresses the source','Response','Air or contrast enema can reduce selected stable cases. Peritonitis, perforation or clinical instability changes the approach and requires urgent surgical assessment.',['source','anatomy'],'Reduction is conceptual and does not imply that injured bowel instantly recovers.'),
    ],
    sources: [{ name: 'NIDDK — Intussusception', url: 'https://www.niddk.nih.gov/health-information/digestive-diseases/anatomic-problems-lower-gi-tract/intussusception' }],
    variations: [{ title: 'Presentations vary', text: 'The classic combination of pain, mass and bloody stool is often incomplete. A pathologic lead point is more likely in some age groups.' }],
  },
};

export function pediatricState(kind: PediatricKind, time: number, normal = false) {
  const t = normal ? 0 : time;
  const onset = ramp(t, 5, 10), progression = ramp(t, 10, 15), injury = ramp(t, 15, 20), response = ramp(t, 20, 24.5);
  return { kind, time: t, onset, progression, injury, response,
    obstruction: kind === 'tetralogy' ? Math.min(1, onset * .45 + injury * .45) * (1 - .35 * response) : 0,
    shunt: kind === 'tetralogy' ? progression * (.5 + .5 * injury) * (1 - .3 * response) : 0,
    infection: kind === 'measles' ? progression * (1 - .8 * response) : 0,
    memoryLoss: kind === 'measles' ? response * .65 : 0,
    invagination: kind === 'intussusception' ? onset * (1 - response) : 0,
    congestion: kind === 'intussusception' ? progression * (1 - .4 * response) : 0,
    ischemia: kind === 'intussusception' ? injury : 0,
  };
}
