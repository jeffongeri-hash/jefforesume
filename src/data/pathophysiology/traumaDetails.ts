import { ramp, type GenericPhase, type Lab } from './timeline';
export { LESSON_DURATION, clampTime, phaseAt, phaseStart, tick } from './timeline';

export type TraumaDetailKind = 'head' | 'pelvis' | 'openFracture';
export type TraumaDetailStructure = 'injury' | 'anatomy' | 'blood' | 'effect';
type Phase = GenericPhase<TraumaDetailStructure>;
type Source = { name: string; url: string };
type Lesson = {
  path: string;
  title: string;
  intro: string;
  normalTitle: string;
  escalation: string;
  structures: Record<TraumaDetailStructure, { label: string; explanation: string }>;
  phases: [Phase, Phase, Phase, Phase, Phase];
  sources: Source[];
  variations: { title: string; text: string }[];
};

const lab = (name: string, trend: string, mechanism: string, limit: string): Lab => ({ name, trend, mechanism, limit });
const phase = (id: string, name: string, short: string, explanation: string, focus: TraumaDetailStructure[], bedside: string, ...labs: Lab[]): Phase =>
  ({ id, name, short, explanation, focus, bedside: [bedside], labs });

const headSources: Source[] = [
  { name: 'Brain Trauma Foundation — Surgical management of traumatic brain injury', url: 'https://braintrauma.org/coma/guidelines/surgical' },
  { name: 'NICE — Head injury assessment and early management', url: 'https://www.nice.org.uk/guidance/ng232/chapter/Recommendations' },
  { name: 'CDC — Traumatic brain injury', url: 'https://www.cdc.gov/traumatic-brain-injury/about/' },
];
const pelvisSources: Source[] = [
  { name: 'American College of Surgeons — Orthopaedic trauma best practices', url: 'https://www.facs.org/media/mkbnhqtw/ortho_guidelines.pdf' },
  { name: 'American College of Surgeons — Trauma diagnosis and management', url: 'https://www.facs.org/media/qlylhqyz/trauma_ii.pdf' },
];
const fractureSources: Source[] = [
  { name: 'AAOS — Prevention of infection after major extremity trauma', url: 'https://www.aaos.org/quality/quality-programs/prevention-of-surgical-site-infections-after-major-extremity-trauma/' },
  { name: 'EAST — Open fracture antimicrobial prophylaxis guideline', url: 'https://www.east.org/education-resources/practice-management-guidelines/details/open-fractures-prophylactic-antibiotic-use-in-update' },
];

export const TRAUMA_DETAIL_LESSONS: Record<TraumaDetailKind, Lesson> = {
  head: {
    path: '/pathophysiology-atlas/traumatic-intracranial-hemorrhage',
    title: 'Traumatic Brain Injury: Epidural and Subdural Hematomas',
    intro: 'Compare bleeding between the skull and dura with bleeding beneath the dura, then follow possible hematoma expansion, mass effect and response.',
    normalTitle: 'Reference: skull, dura and brain without a hematoma',
    escalation: 'Worsening consciousness, repeated vomiting, seizure, new weakness or other neurologic deterioration after head injury requires emergency evaluation.',
    structures: {
      injury: { label: 'Traumatic vessel injury', explanation: 'Impact can injure a meningeal vessel or bridging veins. Arterial and venous sources vary by case.' },
      anatomy: { label: 'Skull, dura and meningeal spaces', explanation: 'An epidural hematoma is between the skull and dura. A subdural hematoma is between the dura and arachnoid membrane.' },
      blood: { label: 'Hematoma', explanation: 'Blood accumulating in the selected space can occupy intracranial volume and exert mass effect.' },
      effect: { label: 'Brain and midline structures', explanation: 'An enlarging hematoma can compress adjacent tissue, displace midline structures and impair perfusion. Findings vary by location and severity.' },
    },
    phases: [
      phase('normal', 'Normal skull and meningeal anatomy', 'Reference', 'The dura lines the inner skull. The arachnoid membrane and brain lie deeper. The illustration is an axial conceptual section, viewed from below.', ['anatomy', 'effect'], 'Patient right appears on the viewer’s left.'),
      phase('injury', 'Impact injures a vessel', 'Impact', 'Trauma can injure a meningeal vessel or bridging veins. Blood enters the selected potential space.', ['injury', 'anatomy'], 'Symptoms and examination may change over time.'),
      phase('bleed', 'Hematoma expands', 'Bleeding', 'Blood collects in the chosen meningeal compartment and can enlarge. The rate and source of bleeding vary.', ['blood', 'anatomy'], 'A reassuring initial examination cannot establish that bleeding will not progress.', lab('Noncontrast head CT', 'Can identify traumatic blood and mass effect', 'CT helps localize hemorrhage and assess brain compression.', 'This animated diagram is not a CT scan.')),
      phase('mass', 'Mass effect can develop', 'Mass effect', 'Increasing hematoma volume can compress adjacent brain and displace midline structures. Intracranial pressure and perfusion can be affected.', ['blood', 'effect'], 'A declining neurologic examination or new focal deficit requires urgent reassessment.', lab('Coagulation tests', 'Context dependent', 'Anticoagulants or coagulopathy can influence bleeding risk and management.', 'A normal INR does not exclude every anticoagulant effect.')),
      phase('response', 'Urgent assessment and directed treatment', 'Response', 'Resuscitation, imaging, serial neurologic assessment and neurosurgical consultation are guided by the patient and the hematoma. Some lesions require evacuation.', ['blood', 'effect'], 'The residual shading represents possible persistent injury after pressure is addressed.'),
    ],
    sources: headSources,
    variations: [
      { title: 'Bleeding source and clinical course vary', text: 'Epidural bleeding is often arterial but can be venous. Subdural bleeding commonly involves bridging veins. A lucid interval is neither universal nor diagnostic.' },
      { title: 'Imaging is an interpretation, not the diagram', text: 'The illustrations emphasize anatomy and mass effect. Shape, suture boundaries and associated injuries vary on actual imaging.' },
    ],
  },
  pelvis: {
    path: '/pathophysiology-atlas/pelvic-fracture-hemorrhage',
    title: 'Pelvic Ring Injury and Hemorrhage',
    intro: 'Follow a pelvic ring disruption through possible bleeding from bone and the pelvic venous plexus or an injured artery, and compare temporary stabilization with definitive hemorrhage control.',
    normalTitle: 'Reference: stable pelvic ring and intact vessels',
    escalation: 'Suspected major pelvic trauma with poor perfusion, altered mental status, major bleeding or hemodynamic instability requires immediate trauma-team assessment.',
    structures: {
      injury: { label: 'Pelvic ring disruption', explanation: 'A pelvic ring injury may involve the pubic symphysis, pubic rami, sacroiliac region or other structures. Patterns and stability vary.' },
      anatomy: { label: 'Pelvic ring and surrounding tissues', explanation: 'The pelvic ring surrounds the lower pelvic organs. The model emphasizes a conceptual ring injury and does not classify the fracture.' },
      blood: { label: 'Pelvic vessels and retroperitoneal bleeding', explanation: 'Bleeding may arise from cancellous bone, venous plexuses or arteries. A retroperitoneal collection can be substantial without obvious external bleeding.' },
      effect: { label: 'Circulating volume and perfusion', explanation: 'Continued hemorrhage can reduce venous return, stroke volume and tissue perfusion. Hemodynamic responses vary with reserve and other injuries.' },
    },
    phases: [
      phase('normal', 'Stable pelvic ring and blood flow', 'Reference', 'The bony pelvis supports the trunk and protects surrounding structures. Blood flows through pelvic vessels without a traumatic leak.', ['anatomy', 'blood'], 'The view is an anterior schematic; the retroperitoneal blood inset is separate.'),
      phase('injury', 'A pelvic ring injury occurs', 'Ring injury', 'A fracture or ligament disruption can destabilize the ring and injure nearby bone, vessels and soft tissues.', ['injury', 'anatomy'], 'Other injuries and sources of bleeding must be assessed in parallel.'),
      phase('bleed', 'Hemorrhage collects around the pelvis', 'Hemorrhage', 'Blood can accumulate in pelvic and retroperitoneal tissues. Venous plexuses, fracture surfaces and arteries are possible sources.', ['blood', 'anatomy'], 'The amount of visible external blood can underestimate internal hemorrhage.', lab('Hemoglobin', 'May initially be near baseline', 'Acute whole-blood loss is not always reflected immediately in a concentration measurement.', 'Serial values and clinical assessment matter.')),
      phase('shock', 'Circulating volume and perfusion can fall', 'Shock risk', 'Ongoing blood loss can reduce preload and tissue perfusion despite early sympathetic compensation.', ['blood', 'effect'], 'Tachycardia, cool extremities, altered mentation or hypotension can accompany major hemorrhage.', lab('Lactate / base deficit', 'May worsen', 'Reduced perfusion and stress physiology can alter these markers.', 'Neither marker alone identifies the bleeding source.')),
      phase('control', 'Stabilization and hemorrhage control', 'Response', 'Pelvic stabilization and resuscitation can be combined with procedures directed at the bleeding source. Arterial and venous bleeding can require different approaches.', ['injury', 'blood', 'effect'], 'A binder is a temporary measure; ongoing bleeding needs reassessment.'),
    ],
    sources: pelvisSources,
    variations: [
      { title: 'More than one source', text: 'Venous, bony and arterial bleeding can coexist. The selector emphasizes one source in each illustration.' },
      { title: 'Associated injury', text: 'Pelvic trauma can also involve the bladder, urethra, bowel, nerves or other body regions.' },
    ],
  },
  openFracture: {
    path: '/pathophysiology-atlas/open-fracture',
    title: 'Open Fracture: Tissue Injury and Infection Risk',
    intro: 'Follow a skin-to-fracture wound through contamination of bone and surrounding muscle, neurovascular assessment, and early infection prevention.',
    normalTitle: 'Reference: intact skin, muscle, bone and vessels',
    escalation: 'A suspected open fracture, uncontrolled bleeding, absent perfusion or progressive neurologic deficit requires immediate emergency assessment.',
    structures: {
      injury: { label: 'Open wound and fracture', explanation: 'An open fracture communicates with the external environment through a skin wound. The wound can be small or distant from the fracture.' },
      anatomy: { label: 'Bone and surrounding muscle', explanation: 'Fracture and soft-tissue injury can compromise tissue viability and expose the fracture site to contamination.' },
      blood: { label: 'Artery and peripheral nerve', explanation: 'The nearby artery and nerve are shown as separate structures. Serial distal pulse, perfusion, motor and sensory assessments help identify associated injury.' },
      effect: { label: 'Contamination and infection prevention', explanation: 'Contaminants and devitalized tissue can increase infection risk. Early antibiotics, wound care, debridement and stabilization address different parts of the problem.' },
    },
    phases: [
      phase('normal', 'Intact protective layers', 'Reference', 'Skin and soft tissues cover the bone. The artery and nerve travel through the surrounding tissue.', ['anatomy', 'blood'], 'This is a longitudinal teaching section of a generic limb.'),
      phase('fracture', 'Fracture communicates with a wound', 'Open injury', 'A fracture and a skin wound create a path between the environment and the fracture site. Muscle and other soft tissues can also be injured.', ['injury', 'anatomy'], 'A small wound can communicate with a deeper fracture.'),
      phase('contamination', 'Contamination reaches injured tissue', 'Contamination', 'Bacteria and debris can enter the wound. Contamination, tissue damage and impaired local blood supply influence infection risk.', ['injury', 'effect'], 'Contamination does not mean an established infection is already present.', lab('Radiographs', 'Identify fracture and may show foreign material', 'Imaging helps assess bony injury and alignment.', 'Imaging does not determine the full extent of soft-tissue contamination.')),
      phase('risk', 'Assess perfusion and associated injury', 'Assess limb', 'Vessels, nerves and compartments may be injured independently. Document distal perfusion, movement and sensation before and after interventions.', ['blood', 'anatomy'], 'A pulse does not exclude every vascular injury or compartment syndrome.'),
      phase('response', 'Early infection prevention and stabilization', 'Response', 'Hemorrhage control, wound coverage, timely antibiotics, tetanus assessment, orthopedic evaluation and debridement address different risks. The definitive plan depends on the injury.', ['injury', 'effect', 'blood'], 'The animation shows reduced contamination and stabilization, not immediate healing.'),
    ],
    sources: fractureSources,
    variations: [{ title: 'Extent is variable', text: 'Wound size alone does not establish the depth of contamination or the amount of muscle, vascular or nerve injury.' }],
  },
};

export function traumaDetailPhases(kind: TraumaDetailKind, variant: string): Phase[] {
  const phases = TRAUMA_DETAIL_LESSONS[kind].phases;
  if (kind === 'head') {
    const subdural = variant === 'subdural';
    return phases.map(item => {
      if (item.id === 'injury') return { ...item, explanation: subdural
        ? 'Trauma can stretch and tear bridging veins. Blood accumulates between the dura and arachnoid membrane in this selected example.'
        : 'A meningeal vessel can be injured by trauma, sometimes with a skull fracture. Blood accumulates between the inner skull and dura in this selected example.' };
      if (item.id === 'bleed') return { ...item, explanation: subdural
        ? 'Subdural blood spreads beneath the dura and can collect over a broad surface. Its rate of expansion and clinical course vary.'
        : 'Epidural blood can strip the dura from the inner skull and form a localized collection. Arterial and venous sources are possible.' };
      return item;
    });
  }
  if (kind === 'pelvis') {
    return phases.map(item => item.id !== 'bleed' ? item : { ...item, explanation: variant === 'arterial'
      ? 'An injured pelvic artery can contribute to hemorrhage. Angiographic evaluation and embolization are possible source-directed measures in selected cases.'
      : 'Fracture surfaces and pelvic venous plexuses can bleed into surrounding tissues. Stabilization and packing can help control selected sources while the patient is resuscitated.' });
  }
  return phases;
}

export function traumaDetailDeep(kind: TraumaDetailKind, variant: string, phaseId: string) {
  const lesson = TRAUMA_DETAIL_LESSONS[kind];
  const current = traumaDetailPhases(kind, variant).find(item => item.id === phaseId);
  if (!current) return undefined;
  const detail = kind === 'head' && phaseId === 'mass'
    ? 'An expanding collection occupies volume within the skull. Compression can disturb local brain function, shift structures and, in severe cases, threaten herniation. The extent of shift and neurologic findings depend on the lesion and individual anatomy.'
    : kind === 'pelvis' && phaseId === 'shock'
      ? 'Loss of circulating blood lowers venous return and cardiac filling. Sympathetic responses can initially preserve pressure, while tissue perfusion falls. Associated chest, abdominal, extremity and external bleeding must also be considered.'
      : kind === 'openFracture' && phaseId === 'response'
        ? 'Antibiotics reduce bacterial burden, while debridement removes contaminated or nonviable tissue and stabilization supports the injured limb. Choice of antimicrobial coverage and timing depend on the wound, patient and local protocols.'
        : current.bedside[0];
  return { sections: [{ h: 'Mechanism', t: current.explanation }, { h: 'Clinical interpretation', t: detail }], refs: lesson.sources };
}

export function traumaDetailState(kind: TraumaDetailKind, time: number, normal = false, variant = '') {
  const t = normal ? 0 : time;
  const onset = ramp(t, 5, 10);
  const progression = ramp(t, 10, 15);
  const injury = ramp(t, 15, 20);
  const response = ramp(t, 20, 24.5);
  return {
    kind, variant, time: t, onset, progression, injury, response,
    hematoma: kind === 'head' ? progression * (1 - 0.45 * response) : 0,
    midlineShift: kind === 'head' ? injury * (1 - 0.45 * response) : 0,
    pelvicDisruption: kind === 'pelvis' ? onset * (1 - 0.55 * response) : 0,
    pelvicBleeding: kind === 'pelvis' ? progression * (1 - 0.65 * response) : 0,
    circulatingVolume: kind === 'pelvis' ? 1 - 0.65 * injury * (1 - 0.5 * response) : 1,
    wound: kind === 'openFracture' ? onset : 0,
    contamination: kind === 'openFracture' ? progression * (1 - 0.7 * response) : 0,
  };
}
