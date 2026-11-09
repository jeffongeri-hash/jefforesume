import { ramp, type GenericPhase, type Lab } from './timeline';
export { LESSON_DURATION, clampTime, phaseAt, phaseStart, tick } from './timeline';

export type Structure = 'entry' | 'site' | 'injury' | 'spread' | 'response';
type Scenario = {
  slug: string;
  title: string;
  intro: string;
  normalTitle: string;
  structures: Record<Structure, {label: string; explanation: string}>;
  phases: GenericPhase<Structure>[];
  variations: {title: string; text: string}[];
  escalation: string;
  sources: {name: string; url: string}[];
};
const lab = (name: string, trend: string, mechanism: string, limit: string): Lab => ({name, trend, mechanism, limit});
const phase = (id: string, short: string, name: string, explanation: string, focus: Structure[], bedside: string, ...labs: Lab[]): GenericPhase<Structure> =>
  ({id, short, name, explanation, focus, bedside: [bedside], labs});

const meningitis = {
  slug: 'bacterial-meningitis',
  title: 'Bacterial Meningitis',
  intro: 'Follow bacteria from the bloodstream into cerebrospinal fluid, then see how the inflammatory response can affect the brain.',
  normalTitle: 'Normal meningeal and cerebrospinal fluid compartments',
  structures: {
    entry: {label:'Bloodstream entry', explanation:'Bacteremia is one route to the central nervous system. Contiguous spread, trauma or surgery can provide other routes.'},
    site: {label:'Subarachnoid space and CSF', explanation:'The subarachnoid space lies between the arachnoid and pia and contains cerebrospinal fluid.'},
    injury: {label:'Inflammatory exudate', explanation:'Bacterial products and the host response recruit leukocytes and increase barrier permeability.'},
    spread: {label:'Brain and perfusion', explanation:'Edema, vascular injury or impaired CSF circulation can increase intracranial pressure or compromise cerebral perfusion.'},
    response: {label:'Early treatment', explanation:'Prompt empiric IV antibiotics target the suspected bacteria. Adjunctive dexamethasone depends on age, setting and guideline indications.'},
  },
  phases: [
    phase('reference','Reference','CSF surrounds the brain','The meninges form distinct layers. CSF circulates around the brain within the subarachnoid space.',['site','spread'],'The diagram separates the CSF compartment from brain tissue.'),
    phase('entry','Invasion','Bacteria reach the CSF','In this hematogenous example, circulating bacteria cross a central nervous system barrier and enter CSF.',['entry','site'],'Fever, headache, neck stiffness and altered cognition may occur in different combinations.',
      lab('Blood cultures','May grow the pathogen','Bacteremia can accompany central nervous system invasion.','Prior antibiotics can reduce culture yield.')),
    phase('injury','Inflammation','Bacterial growth provokes a host response','Bacteria and bacterial products activate inflammatory signaling. Neutrophils enter the CSF and barrier permeability increases.',['site','injury'],'A CSF profile supports interpretation alongside history, examination and microbiology.',
      lab('CSF cells, protein and glucose','Often neutrophils ↑, protein ↑, glucose ratio ↓','Inflammation changes cell traffic, barrier permeability and CSF glucose handling.','Early illness, prior antibiotics and host factors can change the pattern.')),
    phase('spread','Complications','Edema and vascular injury threaten the brain','Inflammation can produce edema, impaired CSF flow or vascular complications. Increased intracranial pressure can reduce perfusion.',['injury','spread'],'Seizures, declining consciousness and focal deficits signal possible complications.'),
    phase('response','Response','Treat promptly while pursuing microbiologic diagnosis','Obtain blood samples and CSF when safe and feasible. Suspected bacterial meningitis requires prompt empiric therapy when lumbar puncture or imaging would delay treatment.',['response','site'],'Antibiotic choice depends on age, risk factors and local guidance. Adjunctive corticosteroids have timing and eligibility considerations.',
      lab('CSF culture and pathogen PCR','May identify the cause','Culture and molecular assays detect organisms or their genetic material.','Results depend on sampling, prior therapy and the assay.')),
  ],
  variations: [{title:'Different routes',text:'This animation follows hematogenous entry. Direct or contiguous spread can also occur.'},{title:'CSF patterns overlap',text:'Interpret CSF cell count, protein, glucose and microbiology together.'}],
  escalation: 'Suspected bacterial meningitis requires emergency assessment and time-sensitive treatment.',
  sources: [{name:'WHO guidelines on meningitis diagnosis, treatment and care',url:'https://www.who.int/publications/i/item/9789240108042'},{name:'NICE NG240 bacterial meningitis recommendations',url:'https://www.nice.org.uk/guidance/ng240/chapter/Recommendations'}],
} satisfies Scenario;

const softTissue = {
  slug: 'necrotizing-soft-tissue-infection',
  title: 'Necrotizing Soft-Tissue Infection',
  intro: 'Compare visible skin findings with deeper spread along fascia. Follow tissue injury, declining perfusion and surgical source control.',
  normalTitle: 'Intact skin, subcutaneous tissue, fascia and muscle',
  structures: {
    entry: {label:'Skin and entry site', explanation:'Inoculation can follow trauma, surgery or a minor skin break. An obvious entry wound may be absent.'},
    site: {label:'Deep fascial plane', explanation:'Infection can spread rapidly along deep tissue planes, extending beyond visible skin changes.'},
    injury: {label:'Microvascular injury and necrosis', explanation:'Inflammation, toxins and microvascular thrombosis can contribute to tissue ischemia and necrosis.'},
    spread: {label:'Systemic effects', explanation:'Deep infection can drive a systemic inflammatory response, organ dysfunction and shock.'},
    response: {label:'Surgical source control', explanation:'Urgent exploration and debridement remove infected and nonviable tissue. Antibiotics and resuscitation support treatment.'},
  },
  phases: [
    phase('reference','Reference','Layered soft tissue','Skin overlies subcutaneous tissue, fascia and muscle. Deep disease can extend farther than superficial changes.',['entry','site'],'Compare the superficial finding with the deeper track.'),
    phase('entry','Entry','Infection reaches deep tissue','A skin breach or another route introduces organisms. The visible entry site may be small or absent.',['entry','site'],'Severe pain out of proportion to visible findings raises concern.'),
    phase('injury','Fascial spread','The front advances along the fascia','Organisms and inflammation spread along tissue planes. Microvascular thrombosis and declining perfusion can contribute to necrosis.',['site','injury'],'Edema beyond erythema, rapidly progressive pain, bullae or skin anesthesia may occur.'),
    phase('spread','Systemic effects','Tissue injury and systemic toxicity progress','Ischemic tissue and an ongoing infectious source can contribute to organ dysfunction. Gas can occur with some organisms.',['injury','spread'],'A lack of gas or reassuring initial labs cannot exclude a necrotizing infection.',
      lab('Lactate','May rise with systemic illness','Hypoperfusion and cellular stress can contribute.','A normal value does not exclude early deep infection.')),
    phase('response','Source control','Surgical assessment and debridement','Urgent surgical evaluation and debridement address the source. Broad empiric IV antibiotics and resuscitation are started alongside this effort.',['response','site'],'When suspicion is high, imaging or a lab score should not delay surgical evaluation.',
      lab('Operative tissue cultures','May identify organisms','Deep samples can guide antimicrobial refinement.','Superficial cultures may not reflect the deep infection.')),
  ],
  variations: [{title:'Different organisms and depths',text:'Infections can be polymicrobial or monomicrobial. The dominant tissue layer, toxin effects and gas formation vary.'}],
  escalation: 'Rapidly progressive pain or swelling with suspected deep infection requires immediate emergency and surgical assessment.',
  sources: [{name:'IDSA skin and soft-tissue infection guideline',url:'https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/'}],
} satisfies Scenario;

const febrileNeutropenia = {
  slug: 'febrile-neutropenia',
  title: 'Febrile Neutropenia',
  intro: 'See how a fall in marrow output and a disrupted barrier can reduce the body’s ability to contain infection.',
  normalTitle: 'Normal marrow output and intact mucosal barrier',
  structures: {
    entry: {label:'Mucosal barrier', explanation:'Chemotherapy can injure mucosa, allowing organisms to translocate. Catheters and other sites can also be sources.'},
    site: {label:'Bone marrow output', explanation:'Cytotoxic chemotherapy can suppress neutrophil production. Timing and depth of the nadir vary.'},
    injury: {label:'Circulating neutrophils', explanation:'A reduced absolute neutrophil count limits innate defense against bacterial and fungal infection.'},
    spread: {label:'Bloodstream infection risk', explanation:'Reduced defense can allow infection to spread. Local inflammatory signs can be subtle, and fever is not always infectious.'},
    response: {label:'Early empiric antibiotics', explanation:'Febrile neutropenia warrants prompt assessment and empiric therapy. Risk assessment guides treatment setting and regimen.'},
  },
  phases: [
    phase('reference','Reference','Marrow maintains circulating neutrophils','Marrow produces neutrophils, and mucosal barriers help keep organisms out of the bloodstream.',['site','entry','injury'],'The absolute neutrophil count is more informative than total WBC alone.'),
    phase('entry','Suppression','Chemotherapy can lower marrow output','Cytotoxic treatment can reduce production of new neutrophils and damage the mucosal barrier.',['site','entry'],'The nadir varies with the regimen and host factors.',
      lab('CBC with differential','ANC falls','Fewer mature neutrophils enter the circulation.','Count and duration both matter.')),
    phase('injury','Barrier breach','Reduced defense and microbial entry','Mucosal injury can allow organisms to translocate while low neutrophil availability impairs local containment. This is one possible source.',['entry','injury'],'Mucositis, catheter sites and other sources warrant focused assessment.'),
    phase('spread','Fever','Infection can progress with few local signs','Fever may be the only early sign. A patient with neutropenia can have invasive infection despite minimal local inflammation.',['injury','spread'],'Hemodynamic instability, confusion or breathing difficulty raises concern for sepsis.',
      lab('Blood cultures','May be positive','Cultures can document bloodstream infection.','Negative cultures do not exclude infection.')),
    phase('response','Response','Prompt empiric therapy while assessing risk','Obtain indicated cultures without delaying empiric antibiotics. Assess severity and risk to determine the appropriate care setting.',['response','spread'],'Clinical stability, anticipated neutropenia duration and other risk factors inform management.'),
  ],
  variations: [{title:'One example of a source',text:'The animation follows mucosal translocation. Infection may arise from a catheter, respiratory tract, skin or another site.'},{title:'Related mechanism',text:'Viral-associated neutropenia is covered in the Immune Response and Blood Count Changes lesson.'}],
  escalation: 'Fever during known or suspected significant neutropenia requires urgent assessment.',
  sources: [{name:'ASCO/IDSA guideline on fever and neutropenia in adults treated for malignancy',url:'https://doi.org/10.1200/JCO.2017.77.6211'}],
} satisfies Scenario;

const endocarditis = {
  slug: 'infective-endocarditis',
  title: 'Infective Endocarditis and Septic Emboli',
  intro: 'Follow vegetation growth and embolization. Switch between left-sided and right-sided infection to compare the downstream routes.',
  normalTitle: 'Heart valves and their downstream circulations',
  structures: {
    entry: {label:'Circulating organisms', explanation:'Organisms in the blood can seed a valve or other endocardial surface. Both abnormal and previously normal valves can be affected.'},
    site: {label:'Valve vegetation', explanation:'Microorganisms can become embedded in a mass of platelets and fibrin. A vegetation can fragment.'},
    injury: {label:'Valve damage', explanation:'Valve or perivalvular destruction can lead to regurgitation, heart failure, or an abscess.'},
    spread: {label:'Septic emboli', explanation:'Infected fragments can travel downstream and cause vascular obstruction and infection at distant sites.'},
    response: {label:'Antimicrobial and procedural evaluation', explanation:'Prolonged pathogen-directed therapy is often needed. Complications such as valve failure, uncontrolled infection or embolic risk can warrant early surgical review.'},
  },
  phases: [
    phase('reference','Reference','Valves direct one-way blood flow','Left-sided valves feed the systemic circulation. Right-sided valves feed the pulmonary circulation.',['site','spread'],'The direction of embolization follows the downstream circulation.'),
    phase('entry','Seeding','Bacteremia can seed the endocardium','Circulating organisms can attach to valvular or other endocardial surfaces. The vegetation can contain microbes, platelets and fibrin.',['entry','site'],'Persistent bacteremia or unexplained fever in an at-risk patient may prompt evaluation.',
      lab('Blood cultures','May repeatedly grow an organism','Blood cultures help establish the microbial cause.','Previous antibiotics and fastidious organisms can reduce yield.')),
    phase('injury','Vegetation','The vegetation grows and valve function may deteriorate','Infection can damage valve tissue, leading to regurgitation. Local extension may produce an abscess.',['site','injury'],'New heart failure or a conduction disturbance can indicate a complication.',
      lab('Echocardiography','May show vegetation or regurgitation','Echo evaluates valve structure, function and some complications.','A single negative study may be insufficient when suspicion remains high.')),
    phase('spread','Embolization','Infected fragments can break free','In the left-sided example, fragments pass into the systemic arterial circulation and can reach the brain, spleen, kidney or other sites.',['site','spread'],'New focal neurologic findings, flank pain or other focal symptoms warrant evaluation.'),
    phase('response','Response','Identify the organism and evaluate complications','Obtain blood cultures before antimicrobial therapy when feasible and use echocardiography to evaluate valves and complications. Treatment depends on the organism, valve type and severity.',['response','injury','spread'],'Heart failure, uncontrolled infection and embolic risk may prompt urgent multidisciplinary evaluation.'),
  ],
  variations: [{title:'Embolic destination depends on valve location',text:'Left-sided infection typically embolizes systemically. Right-sided infection typically embolizes to the lungs.'}],
  escalation: 'Suspected endocarditis with shock, new heart failure, focal neurologic signs or respiratory compromise requires urgent evaluation.',
  sources: [{name:'2023 ESC guidelines for the management of endocarditis',url:'https://doi.org/10.1093/eurheartj/ehad193'}],
} satisfies Scenario;

export const EMERGENCIES = {meningitis, softTissue, febrileNeutropenia, endocarditis};
export type EmergencyKind = keyof typeof EMERGENCIES;

export function phasesFor(kind: EmergencyKind, variant: string) {
  const phases = EMERGENCIES[kind].phases;
  if (kind !== 'endocarditis' || variant !== 'right') return phases;
  return phases.map(p => p.id !== 'spread' ? p : {
    ...p,
    explanation: 'In the right-sided example, fragments enter the pulmonary arteries and can cause infected pulmonary infarcts or nodules.',
    bedside: ['Fever, pleuritic pain, dyspnea or hemoptysis can accompany septic pulmonary emboli.'],
  });
}

export const sceneState = (time: number) => ({
  entry: ramp(time, 5, 10),
  injury: ramp(time, 10, 15),
  spread: ramp(time, 15, 20),
  response: ramp(time, 20, 25),
});
