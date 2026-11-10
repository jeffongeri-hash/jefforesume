import { ramp, type GenericPhase, type Lab } from './timeline';
export { LESSON_DURATION, clampTime, phaseAt, phaseStart, tick } from './timeline';

export type TraumaKind = 'compartment' | 'vascular' | 'pneumothorax';
export type TraumaStructure = 'injury' | 'space' | 'flow' | 'tissue';
type Phase = GenericPhase<TraumaStructure>;
type Lesson = { path: string; title: string; intro: string; escalation: string; phases: [Phase, Phase, Phase, Phase, Phase]; structures: Record<TraumaStructure, {label: string; explanation: string}>; sources: {name: string; url: string}[]; variations: {title: string; text: string}[] };
const lab = (name: string, trend: string, mechanism: string, limit: string): Lab => ({name, trend, mechanism, limit});
const phase = (id: string, name: string, short: string, explanation: string, focus: TraumaStructure[], bedside: string, ...labs: Lab[]): Phase => ({id, name, short, explanation, focus, bedside:[bedside], labs});

export const TRAUMA_LESSONS: Record<TraumaKind, Lesson> = {
  compartment: {
    path: '/pathophysiology-atlas/acute-compartment-syndrome', title: 'Acute Compartment Syndrome',
    intro: 'Watch swelling raise pressure inside an enclosed muscle compartment and reduce capillary perfusion, followed by a conceptual fasciotomy.',
    escalation: 'Suspected acute compartment syndrome requires immediate surgical assessment. An intact distal pulse does not exclude the diagnosis.',
    structures: {
      injury:{label:'Traumatic insult',explanation:'Fracture, crush injury, reperfusion or constriction can initiate swelling or bleeding.'},
      space:{label:'Fascial compartment',explanation:'Relatively noncompliant fascia surrounds muscle, vessels and nerves. A fasciotomy opens the fascia to relieve pressure.'},
      flow:{label:'Microvascular perfusion',explanation:'Rising interstitial pressure reduces the pressure gradient across capillaries and can impair muscle perfusion.'},
      tissue:{label:'Muscle and nerve',explanation:'Prolonged ischemia can injure muscle and nerves. Nerve dysfunction and muscle injury can persist after pressure is relieved.'},
    },
    phases:[
      phase('normal','Normal tissue pressure','Reference','Fascia encloses muscle, nerves and small vessels. Capillary pressure is adequate to maintain tissue perfusion.',['space','flow'],'A cross-section emphasizes one compartment rather than the entire leg.'),
      phase('swelling','Bleeding and swelling','Swelling','Trauma causes bleeding and edema inside a limited space. The fascia resists expansion.',['injury','space'],'Severe pain, especially with passive stretch, can raise concern.'),
      phase('pressure','Pressure rises and flow falls','Pressure','Interstitial pressure rises relative to capillary pressure. Venous drainage and the microvascular perfusion gradient can fall.',['space','flow'],'An arterial pulse can remain present despite inadequate tissue perfusion.',lab('Compartment pressures','May support assessment','Pressure measurements can help when the examination is unclear.','Values depend on perfusion pressure and clinical context.')),
      phase('ischemia','Muscle and nerve ischemia','Ischemia','Reduced perfusion can injure muscle and nerve. Prolonged ischemia increases the risk of irreversible damage.',['flow','tissue'],'Paresthesias, weakness or escalating pain require urgent reassessment.',lab('Creatine kinase','May rise','Injured myocytes release CK.','CK is nonspecific and can lag behind tissue injury.')),
      phase('release','Surgical fascial release','Fasciotomy','Fasciotomy opens the fascia and allows swollen tissue to expand, reducing pressure. Existing muscle or nerve injury may persist.',['space','tissue'],'The scene is conceptual and does not demonstrate a surgical approach.'),
    ],
    sources:[{name:'MedlinePlus — Compartment syndrome',url:'https://medlineplus.gov/ency/article/001224.htm'}],
    variations:[{title:'Perfusion and pulses',text:'Compartment pressure and systemic blood pressure both influence tissue perfusion. Distal arterial pulsation can be preserved.'}],
  },
  vascular: {
    path: '/pathophysiology-atlas/traumatic-vascular-injury', title: 'Traumatic Arterial Injury and Limb Ischemia',
    intro: 'Follow an arterial wall injury through local thrombosis, reduced distal flow and possible reperfusion after vascular repair.',
    escalation: 'Active uncontrolled hemorrhage, an expanding hematoma, or a cold, pale or neurologically impaired limb requires immediate trauma and vascular assessment.',
    structures:{
      injury:{label:'Arterial wall injury',explanation:'Blunt or penetrating trauma can lacerate, compress or disrupt the vessel wall.'},
      space:{label:'Fracture and surrounding tissues',explanation:'The bone and soft tissue are shown to orient the injured vessel; a vascular injury may occur with or without fracture.'},
      flow:{label:'Arterial lumen and thrombus',explanation:'Intimal injury can activate clot formation and narrow or occlude the lumen. Distal perfusion depends on the injury and collateral circulation.'},
      tissue:{label:'Distal muscle and nerve',explanation:'Reduced blood delivery threatens downstream muscle, nerve and skin. Tissue viability depends on severity and duration.'},
    },
    phases:[
      phase('normal','Arterial flow to the limb','Reference','The artery supplies blood to distal muscle and nerve. Collateral vessels provide alternate pathways of variable capacity.',['flow','tissue'],'The artery is shown as a longitudinal cutaway.'),
      phase('injury','Trauma damages the artery','Injury','A fracture or penetrating injury can injure the vessel wall. Intimal disruption can trigger platelet adhesion and local thrombus.',['injury','space'],'Examination includes bleeding, limb color, pulses, motor function and sensation.'),
      phase('thrombus','Thrombus narrows the lumen','Occlusion','A developing thrombus or vessel disruption can reduce downstream flow. The mechanism shown is intimal injury with thrombosis.',['injury','flow'],'A palpable pulse does not reliably exclude every vascular injury.'),
      phase('ischemia','Distal tissue delivery falls','Ischemia','Inadequate blood flow can cause pain, pallor, sensory change and weakness. Severity depends on obstruction, collateral flow and time.',['flow','tissue'],'Progressive neurologic deficit or threatened viability is an emergency.',lab('Lactate','May increase with major ischemia or shock','Poor tissue perfusion can contribute.','Normal lactate cannot exclude an ischemic limb.')),
      phase('repair','Hemorrhage control and revascularization','Reperfusion','Hemorrhage control and vascular intervention address bleeding and restore blood flow when indicated. Reperfusion can also produce swelling or metabolic consequences.',['flow','tissue'],'The animation does not imply that preexisting tissue damage resolves immediately.'),
    ],
    sources:[{name:'Society for Vascular Surgery — Vascular trauma',url:'https://vascular.org/your-vascular-health/vascular-conditions/vascular-trauma'}],
    variations:[{title:'Mechanism varies',text:'Laceration, spasm, intimal injury, thrombosis and external compression have different appearances and treatment needs.'}],
  },
  pneumothorax: {
    path: '/pathophysiology-atlas/tension-pneumothorax', title: 'Tension Pneumothorax and Obstructive Shock',
    intro: 'Trace air entering the pleural space, compression of the lung and impaired venous return to the heart.',
    escalation: 'Suspected tension pneumothorax with respiratory or circulatory compromise requires immediate emergency treatment.',
    structures:{
      injury:{label:'Air leak',explanation:'A lung or chest-wall injury can allow air to enter the pleural space.'},
      space:{label:'Pleural space',explanation:'Air accumulates between the visceral and parietal pleura. Elevated pleural pressure compresses the affected lung.'},
      flow:{label:'Venous return and heart',explanation:'High intrathoracic pressure can impede venous return, reduce cardiac filling and lower cardiac output.'},
      tissue:{label:'Lung ventilation',explanation:'The affected lung compresses as pleural air and pressure increase. Decompression can improve ventilation and circulation.'},
    },
    phases:[
      phase('normal','Normal pleural mechanics','Reference','Both lungs expand within the thorax. The heart receives venous return and fills during diastole.',['space','flow'],'Anterior thoracic orientation is labeled.'),
      phase('leak','Air enters the pleural space','Air leak','An injury allows air to escape from lung or chest wall into the pleural cavity.',['injury','space'],'Chest pain and dyspnea may develop.'),
      phase('pressure','Pressure compresses the lung','Compression','In a tension physiology, pleural pressure rises and the affected lung becomes progressively compressed.',['space','tissue'],'Breath sounds may diminish on the affected side.',lab('Oxygen saturation','May fall','Reduced ventilation can worsen gas exchange.','A normal early measurement does not exclude a serious pneumothorax.')),
      phase('shock','Venous return and cardiac filling fall','Obstructive shock','High intrathoracic pressure can reduce venous return and cardiac output. Mediastinal shift can occur but is not required for a clinical emergency.',['flow','tissue'],'Hypotension, altered mentation or severe respiratory distress are urgent signs.',lab('Lactate','May rise','Reduced systemic perfusion can contribute.','A normal value does not exclude tension physiology.')),
      phase('release','Pleural decompression','Decompression','Emergency decompression relieves pressure. A pleural drain can provide ongoing evacuation; residual lung injury may persist.',['space','flow'],'A clinically suspected unstable tension pneumothorax needs prompt intervention.'),
    ],
    sources:[{name:'NHLBI — Pleural disorders',url:'https://www.nhlbi.nih.gov/health/pleural-disorders/types'},{name:'NHLBI — Pleural treatment',url:'https://www.nhlbi.nih.gov/health/pleural-disorders/treatment'}],
    variations:[{title:'Pneumothorax and tension physiology',text:'Pleural air does not always cause tension. Hemodynamic consequences vary with the leak, pressure and patient.'}],
  },
};

export function traumaState(kind: TraumaKind, time: number, normal = false) {
  const t = normal ? 0 : time;
  const onset = ramp(t,5,10), progression = ramp(t,10,15), injury = ramp(t,15,20), response = ramp(t,20,24.5);
  return { time:t, onset, progression, injury, response, pressure:progression*(1-.8*response), perfusion:1-(.45*progression+.35*injury)*(1-.65*response), retainedInjury:injury };
}
