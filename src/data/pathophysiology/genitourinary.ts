import { phaseStart, ramp, type GenericPhase, type Lab } from './timeline';

export const GU_PATHS = {
  stones: '/pathophysiology-atlas/ureteral-stones',
  retention: '/pathophysiology-atlas/acute-urinary-retention',
  infection: '/pathophysiology-atlas/pyelonephritis-urosepsis',
  scrotum: '/pathophysiology-atlas/scrotal-pathophysiology',
} as const;

export type GuKind = keyof typeof GU_PATHS;
export type GuStructure = 'kidney' | 'ureter' | 'bladder' | 'outlet' | 'vessels' | 'cord' | 'testis' | 'tunica' | 'plexus';
type Phase = GenericPhase<GuStructure>;
type Source = { name: string; url: string };
type Scenario = {
  id: string;
  label: string;
  hint: string;
  phases: [Phase, Phase, Phase, Phase, Phase];
  sources: Source[];
};
type Lesson = {
  number: number;
  title: string;
  system: string;
  intro: string;
  normal: string;
  escalation: string;
  structures: Partial<Record<GuStructure, { label: string; explanation: string }>>;
  variations: { title: string; text: string }[];
  cases: Scenario[];
};

const stonesSource = { name: 'EAU Guidelines on Urolithiasis', url: 'https://uroweb.org/guidelines/urolithiasis/chapter/guidelines' };
const utiSource = { name: 'EAU Guidelines on Urological Infections', url: 'https://uroweb.org/guidelines/urological-infections/chapter/the-guideline' };
const torsionSource = { name: 'EAU Paediatric Urology — Acute Scrotum', url: 'https://uroweb.org/guidelines/paediatric-urology/chapter/acute-scrotum' };
const hydroceleSource = { name: 'EAU Paediatric Urology — Hydrocele', url: 'https://uroweb.org/guidelines/paediatric-urology/chapter/hydrocele' };
const pediatricVaricocele = { name: 'EAU Paediatric Urology — Varicocele', url: 'https://uroweb.org/guidelines/paediatric-urology/chapter/varicocele-in-children-and-adolescents' };
const varicoceleSource = { name: 'EAU Guidelines on Male Infertility — Varicocele', url: 'https://uroweb.org/guidelines/sexual-and-reproductive-health/chapter/male-infertility' };
const retentionSource = { name: 'NIDDK — Urinary retention causes', url: 'https://www.niddk.nih.gov/health-information/urologic-diseases/urinary-retention/symptoms-causes' };
const catheterSource = { name: 'NIDDK — Treatment of urinary retention', url: 'https://www.niddk.nih.gov/health-information/urologic-diseases/urinary-retention/treatment' };
const sepsisSource = { name: 'Surviving Sepsis Campaign — Adult guidelines', url: 'https://www.sccm.org/clinical-resources/surviving-sepsis-campaign-guidelines-2021' };

const phase = (id: string, name: string, short: string, explanation: string, focus: GuStructure[], bedside: string, ...labs: Lab[]): Phase =>
  ({ id, name, short, explanation, focus, bedside: [bedside], labs });
const lab = (name: string, trend: string, mechanism: string, limit: string): Lab =>
  ({ name, trend, mechanism, limit });

const urinaryStructures = {
  kidney: { label: 'Kidney and collecting system', explanation: 'The renal parenchyma makes urine. Calyces collect it into the renal pelvis. Dilation of the calyces and pelvis is hydronephrosis.' },
  ureter: { label: 'Ureter and ureterovesical junction', explanation: 'Peristalsis transports urine from the renal pelvis to the bladder. The ureter enters the bladder at the ureterovesical junction.' },
  bladder: { label: 'Bladder and detrusor', explanation: 'The detrusor is the smooth muscle in the bladder wall. It relaxes to store urine and contracts during voiding.' },
  outlet: { label: 'Bladder neck and urethra', explanation: 'The bladder outlet and urethra carry urine out of the body. Voiding requires outlet relaxation and adequate detrusor contraction.' },
};
const renalRef = phase('reference', 'Normal upper urinary tract drainage', 'Normal flow',
  'Urine passes from the calyces through the renal pelvis, then travels down each ureter to the bladder.',
  ['kidney', 'ureter'], 'The diagram shows an anterior view. The patient’s left is on the viewer’s right.');
const bladderRef = phase('reference', 'Coordinated bladder emptying', 'Normal void',
  'The detrusor contracts while the bladder outlet relaxes. The pressure gradient drives urine through the urethra.',
  ['bladder', 'outlet'], 'Urine production and bladder emptying are separate processes.');
const scrotalRef = phase('reference', 'Normal left testis and spermatic cord', 'Normal anatomy',
  'The testicular artery carries blood down the spermatic cord. The pampiniform plexus drains blood upward and helps with countercurrent heat exchange. The tunica vaginalis is a serous covering around the testis.',
  ['testis', 'plexus', 'tunica'], 'The scene enlarges one hemiscrotum. Arterial inflow, venous drainage and fluid outside the testis are shown separately.');
const hematuria = lab('Urinalysis — RBCs', 'May be present', 'A moving calculus can irritate the urothelium.', 'Absent hematuria does not exclude a ureteral stone.');
const creatinine = lab('Serum creatinine', 'May rise', 'Obstruction can reduce filtration, particularly with bilateral obstruction or a solitary functioning kidney.', 'Unilateral obstruction can occur with a normal serum creatinine.');
const pyuria = lab('Urinalysis — WBCs / nitrite', 'Pyuria may be present; nitrite varies', 'Local inflammation recruits leukocytes. Some bacteria convert urinary nitrate to nitrite.', 'Pyuria also occurs without infection. Negative nitrite does not exclude infection.');
const cultures = lab('Urine and blood cultures', 'May identify a pathogen', 'Cultures sample bacteria at the site collected or circulating in blood.', 'Prior antibiotics can reduce yield. Bladder urine can fail to reflect organisms trapped above an obstruction.');
const lactate = lab('Serum lactate', 'May rise', 'Hypoperfusion, accelerated glycolysis and altered clearance can contribute.', 'An elevated lactate is nonspecific. A normal lactate does not exclude sepsis.');

export const GU_LESSONS: Record<GuKind, Lesson> = {
  stones: {
    number: 59, title: 'Ureteral Stones and Infected Obstruction', system: 'Genitourinary · Upper tract',
    intro: 'Follow urine through the kidney and ureter. Compare a stone without infection with bacteria trapped upstream of the same blockage.',
    normal: 'Normal reference: unobstructed bilateral urinary drainage',
    escalation: 'Suspected infection with obstruction or anuria requires emergency evaluation and urgent urologic assessment for drainage.',
    structures: urinaryStructures,
    variations: [
      { title: 'Hydronephrosis versus obstruction', text: 'Collecting-system dilation is an anatomic finding. Early obstruction may have little visible dilation, and dilation can occur without ongoing obstruction.' },
      { title: 'Upper versus lower tract drainage', text: 'A ureteral stent or nephrostomy drains the obstructed upper tract. A bladder catheter drains the bladder.' },
    ],
    cases: [
      {
        id: 'stone', label: 'Obstructing stone', hint: 'Distal ureteral calculus with upstream dilation and preserved contralateral drainage.', sources: [stonesSource],
        phases: [
          renalRef,
          phase('block', 'Stone lodges in the distal ureter', 'Stone lodges', 'A stone narrows the left ureter near the ureterovesical junction. Peristalsis against the narrowing and ureteral stretch contribute to colicky pain.', ['ureter'], 'Pain can radiate from the flank toward the groin as a stone travels distally.', hematuria),
          phase('dilate', 'Pressure and dilation build upstream', 'Hydronephrosis', 'Reduced outflow raises pressure in the ureter and collecting system above the obstruction. The distal ureter below the stone does not expand from that upstream pressure.', ['kidney', 'ureter'], 'Hydronephrosis localizes to the affected side in this example.', creatinine),
          phase('limits', 'One side obstructs while the other drains', 'Other side drains', 'The right kidney still drains into the bladder. Preserved bladder output can coexist with obstruction of the left kidney.', ['kidney', 'bladder'], 'Assess renal function, symptom control and signs of infection separately from stone size and location.', creatinine),
          phase('relief', 'Outflow is restored in this example', 'Relief', 'If the stone passes into the bladder, flow can resume and pressure can decline. Persistent obstruction or complications may require intervention.', ['ureter'], 'The animation illustrates one possible outcome. Passage and resolution vary.'),
        ],
      },
      {
        id: 'infected', label: 'Infected obstruction', hint: 'Bacteria accumulate above the stone, then a nephrostomy illustrates upper-tract drainage.', sources: [stonesSource, utiSource],
        phases: [
          renalRef,
          phase('block', 'A stone impedes upper-tract drainage', 'Stone lodges', 'A distal left ureteral calculus obstructs flow. Urine produced by the left kidney backs up above the stone.', ['ureter', 'kidney'], 'Urine output from the other kidney can persist.', creatinine),
          phase('infect', 'Infection develops in the obstructed system', 'Trapped infection', 'Organisms proliferate in the poorly drained collecting system. Purulent urine can accumulate under pressure, a finding called pyonephrosis.', ['kidney'], 'Systemic signs in a patient with a suspected stone should prompt evaluation for infected obstruction.', pyuria, cultures),
          phase('systemic', 'An undrained source can drive sepsis', 'Systemic risk', 'Microbial products and the host response can drive organ dysfunction. Antibiotics address susceptible bacteria, while drainage removes infected urine and relieves pressure.', ['kidney', 'ureter'], 'A reassuring bladder urine sample or preserved contralateral drainage cannot establish that the obstructed kidney is uninfected.', lactate, cultures),
          phase('drain', 'Urgent upper-tract decompression', 'Source control', 'A percutaneous nephrostomy creates a drainage path directly from the collecting system. A ureteral stent is another option. Definitive stone treatment is generally deferred until infection is controlled.', ['kidney', 'ureter'], 'Treat infection and obtain urgent urologic source control. The illustration shows the nephrostomy route.', cultures),
        ],
      },
    ],
  },
  retention: {
    number: 60, title: 'Acute Urinary Retention', system: 'Genitourinary · Bladder outlet',
    intro: 'Compare a narrowed outlet with a detrusor that generates too little force. Follow bladder filling, distension, and drainage.',
    normal: 'Normal reference: coordinated detrusor contraction and outlet relaxation',
    escalation: 'Sudden inability to urinate with a painful or distended bladder needs urgent assessment.',
    structures: { bladder: urinaryStructures.bladder, outlet: urinaryStructures.outlet },
    variations: [
      { title: 'Retention versus low urine production', text: 'A large bladder after an attempt to void supports retention. Low measured urine output alone cannot separate reduced renal production from failure to empty.' },
      { title: 'Same residual, different mechanics', text: 'Outlet resistance and weak detrusor contraction can coexist. The animation isolates each mechanism for comparison.' },
    ],
    cases: [
      {
        id: 'outlet', label: 'Bladder outlet obstruction', hint: 'A narrowed bladder outlet limits flow despite a contracting detrusor.', sources: [retentionSource, catheterSource],
        phases: [
          bladderRef,
          phase('narrow', 'Outlet resistance rises', 'Outlet narrows', 'A narrowed bladder neck or urethra increases resistance. An enlarged prostate or urethral stricture are examples of different causes.', ['outlet'], 'The outlet is shown as a schematic narrowing common to multiple causes.'),
          phase('contract', 'Detrusor contracts against resistance', 'Voiding effort', 'The detrusor can generate pressure with little effective flow when outlet resistance is high.', ['bladder', 'outlet'], 'Urgency, suprapubic discomfort, dribbling or a weak stream can accompany incomplete emptying.'),
          phase('retain', 'The bladder distends', 'Retention', 'With ongoing filling and inadequate emptying, residual urine accumulates and the bladder stretches.', ['bladder'], 'Bladder ultrasound can estimate volume. Measure after attempted voiding if reporting a postvoid residual.', creatinine),
          phase('drain', 'Catheter drainage lowers bladder volume', 'Drain bladder', 'A catheter provides a route out of the bladder and relieves distension while the cause of retention is evaluated.', ['bladder', 'outlet'], 'Drainage volume and subsequent urine output can inform monitoring.'),
        ],
      },
      {
        id: 'detrusor', label: 'Detrusor underactivity', hint: 'The outlet is open, but bladder contraction is insufficient to empty it.', sources: [retentionSource, catheterSource],
        phases: [
          bladderRef,
          phase('signal', 'Contraction is weak or too brief', 'Weak contraction', 'Detrusor function depends on parasympathetic signaling and responsive muscle. Neurologic disease, medications and other causes can impair that contraction.', ['bladder'], 'Review medications and neurologic symptoms when considering impaired emptying.'),
          phase('force', 'The pressure gradient is insufficient', 'Low driving force', 'The outlet is open in this comparison. The detrusor generates too little force or stops contracting too soon for effective emptying.', ['bladder', 'outlet'], 'A large residual alone cannot distinguish outlet obstruction from detrusor underactivity.'),
          phase('retain', 'Residual urine accumulates', 'Retention', 'With repeated incomplete emptying, urine accumulates despite an anatomically patent outlet in this model.', ['bladder'], 'New urinary dysfunction with saddle sensory change or leg deficits warrants evaluation for a neurologic emergency.'),
          phase('drain', 'Passive drainage bypasses the weak pump', 'Drain bladder', 'A catheter drains the bladder without requiring a sustained detrusor contraction. The underlying neurologic or muscle dysfunction may persist.', ['bladder', 'outlet'], 'Reassess symptoms and determine the underlying cause after decompression.'),
        ],
      },
    ],
  },
  infection: {
    number: 61, title: 'Pyelonephritis and Urosepsis', system: 'Genitourinary · Infection',
    intro: 'Track bacteria ascending to the kidney and compare renal inflammation with a urinary infection causing systemic organ dysfunction.',
    normal: 'Normal reference: renal parenchyma and unobstructed urinary drainage',
    escalation: 'Suspected urinary infection with hypotension, altered mental status, reduced urine output, or suspected obstruction requires emergency assessment.',
    structures: {
      ...urinaryStructures,
      vessels: { label: 'Systemic vascular response', explanation: 'The host response in sepsis can alter vascular tone, barrier function and tissue perfusion. The inset depicts these effects separately from the urinary tract.' },
    },
    variations: [
      { title: 'Localized source and systemic severity', text: 'Pyelonephritis can cause fever and flank pain. Sepsis requires infection-associated organ dysfunction. Bacteremia is neither required nor sufficient to diagnose sepsis.' },
      { title: 'Evaluate for a drainable source', text: 'An obstructed or abscessed system may need source control alongside antibiotics. The unobstructed example focuses on ascent and host response.' },
    ],
    cases: [
      {
        id: 'pyelonephritis', label: 'Acute pyelonephritis', hint: 'Ascending infection causes focal inflammation in the renal parenchyma.', sources: [utiSource],
        phases: [
          renalRef,
          phase('ascend', 'Bacteria ascend from the bladder', 'Bacterial ascent', 'Organisms can ascend a ureter from the bladder even as urine normally flows toward the bladder. The animated microbial markers travel separately from the urine.', ['bladder', 'ureter'], 'Dysuria or frequency can occur, and upper-tract infection can present without these symptoms.', pyuria),
          phase('renal', 'Inflammation reaches the renal parenchyma', 'Renal inflammation', 'Innate immune recruitment produces inflammation in renal tubules and interstitium. Inflammation of the upper tract can cause flank pain and systemic symptoms such as fever.', ['kidney'], 'Flank pain, costovertebral-angle tenderness and fever support the diagnosis in context.', pyuria, cultures),
          phase('evaluate', 'Assess severity and look for complications', 'Assess severity', 'Persistent or severe symptoms may reflect obstruction, renal or perinephric abscess, or an alternate diagnosis. Imaging can look for complications in selected settings.', ['kidney', 'ureter'], 'Hydronephrosis and parenchymal inflammation are distinct findings.', cultures),
          phase('response', 'Organism burden can fall with effective therapy', 'Response', 'Active antimicrobial therapy can reduce viable bacteria. Inflammatory changes can lag behind microbial clearance.', ['kidney'], 'Culture results and clinical trajectory help guide reassessment.', cultures),
        ],
      },
      {
        id: 'urosepsis', label: 'Urinary-source sepsis', hint: 'A kidney infection triggers a dysregulated host response with organ dysfunction.', sources: [utiSource, sepsisSource],
        phases: [
          renalRef,
          phase('ascend', 'An ascending infection reaches the kidney', 'Urinary source', 'Organisms ascend the ureter and establish an upper-tract infection. The kidney is the source in this example.', ['ureter', 'kidney'], 'Urinary symptoms can be absent in a systemic presentation.', pyuria, cultures),
          phase('renal', 'Host signaling extends beyond the kidney', 'Host response', 'Innate signaling can extend systemically, activating vascular endothelium and changing vascular tone and permeability.', ['kidney', 'vessels'], 'Cultures may help identify the source and organism, with or without bloodstream growth.', cultures),
          phase('organ', 'Dysregulated response can impair organ function', 'Organ dysfunction', 'Vasodilation, capillary leakage and uneven microvascular flow can impair tissue perfusion. Reduced renal filtration, altered mentation or circulatory dysfunction can accompany sepsis.', ['vessels', 'kidney'], 'Organ dysfunction distinguishes sepsis from a febrile urinary infection without organ dysfunction.', lactate, creatinine),
          phase('response', 'Treat infection and support perfusion', 'Early response', 'Antibiotics target the infection. Hemodynamic support addresses perfusion and source control addresses an obstructed or drainable focus when present. Perfusion and renal function can recover at different rates.', ['vessels', 'kidney'], 'Reassess perfusion and search for obstruction or abscess when the clinical course suggests it.', lactate, cultures),
        ],
      },
    ],
  },
  scrotum: {
    number: 62, title: 'Scrotal Pathophysiology: Torsion, Hydrocele and Varicocele', system: 'Genitourinary · Acute scrotum',
    intro: 'Compare spermatic-cord twisting, fluid around the testis, and venous reflux in the pampiniform plexus. Use the normal reference to see which compartment changes.',
    normal: 'Normal reference: left testis, spermatic cord and venous drainage',
    escalation: 'Sudden or severe testicular pain needs emergency assessment for torsion. Preserved arterial Doppler flow, a hydrocele or a varicocele does not independently exclude torsion.',
    structures: {
      cord: { label: 'Spermatic cord', explanation: 'The cord contains the testicular vessels, vas deferens, lymphatics and nerves. Twisting can obstruct venous drainage and eventually arterial inflow.' },
      testis: { label: 'Testis and epididymis', explanation: 'The testis receives arterial inflow through vessels traveling with the cord. The epididymis lies along the posterior testis and is shown at the edge for orientation.' },
      tunica: { label: 'Tunica vaginalis', explanation: 'Hydrocele fluid collects between the parietal and visceral layers of the tunica vaginalis, outside the testicular tissue.' },
      plexus: { label: 'Pampiniform venous plexus', explanation: 'Veins above and behind the testis coalesce into the testicular vein. A varicocele is dilation of these veins with abnormal venous reflux.' },
    },
    variations: [
      { title: 'Acute pain can override an incidental finding', text: 'Hydrocele or varicocele may coexist with another cause of pain. The animation separates mechanisms that can overlap clinically.' },
      { title: 'Doppler is part of the assessment', text: 'Color flow, side-to-side comparison and the appearance of the cord all matter. Early, partial or intermittent torsion can show residual arterial flow.' },
    ],
    cases: [
      {
        id: 'torsion', label: 'Testicular torsion', hint: 'Cord twisting impairs venous drainage first, then can compromise arterial inflow.', sources: [torsionSource],
        phases: [
          scrotalRef,
          phase('twist', 'The spermatic cord twists', 'Cord twists', 'The testis rotates on the cord in this intravaginal example. A twisted cord can appear as a whirlpool on ultrasound.', ['cord'], 'Sudden unilateral pain, nausea, a high-riding testis or an abnormal lie can raise suspicion.'),
          phase('venous', 'Venous outflow becomes restricted', 'Venous congestion', 'Low-pressure veins compress first in this schematic, causing congestion and edema. Some arterial inflow can remain at this stage.', ['plexus', 'testis'], 'Arterial Doppler flow can persist with early, partial or intermittent torsion.'),
          phase('arterial', 'Arterial inflow falls and ischemia develops', 'Ischemia', 'Persistent twisting and congestion can restrict arterial inflow. The affected testis becomes ischemic, with risk of infarction if the twist persists.', ['cord', 'testis'], 'The amount of twist and duration both influence injury. The timeline illustrates sequence only.'),
          phase('surgery', 'Urgent exploration and detorsion', 'Surgical response', 'Exploration can confirm torsion, untwist the cord and assess testicular viability. Fixation reduces recurrence risk, and the contralateral testis is typically fixed as well when torsion is confirmed.', ['cord', 'testis'], 'The scene keeps ischemia visible because viability and reperfusion depend on the injury.'),
        ],
      },
      {
        id: 'hydrocele', label: 'Noncommunicating hydrocele', hint: 'Fluid collects in the tunica vaginalis around a perfused testis.', sources: [hydroceleSource],
        phases: [
          scrotalRef,
          phase('collect', 'Fluid accumulates outside the testis', 'Fluid collects', 'Fluid collects between the visceral and parietal layers of the tunica vaginalis. This example has no open tract to the abdomen.', ['tunica'], 'An acquired hydrocele can be idiopathic or reactive to another process.'),
          phase('expand', 'The surrounding fluid pocket enlarges', 'Sac expands', 'Fluid expands around the testis while the testicular tissue and its blood supply are distinct structures. This simple example preserves blood flow.', ['tunica', 'testis'], 'A simple hydrocele commonly appears as an anechoic peritesticular fluid collection on ultrasound.'),
          phase('compare', 'Examine the testis and its surroundings separately', 'Compare anatomy', 'A fluid pocket can make palpation of the testis difficult. The simple fluid shown here differs from complex fluid, a solid mass or venous dilation.', ['testis', 'tunica'], 'Transillumination is supportive. It does not establish the underlying cause of new swelling.'),
          phase('context', 'The cause and symptoms guide evaluation', 'Clinical context', 'An isolated hydrocele often presents as painless swelling. A painful or acute presentation warrants assessment for an underlying process.', ['tunica', 'testis'], 'A reactive hydrocele can coexist with infection or torsion.'),
        ],
      },
      {
        id: 'communicating', label: 'Communicating hydrocele', hint: 'A patent processus vaginalis connects the peritoneal cavity and scrotal fluid space.', sources: [hydroceleSource],
        phases: [
          scrotalRef,
          phase('patent', 'The processus vaginalis remains patent', 'Open tract', 'A persistent peritoneal extension leaves a connection through the inguinal canal toward the tunica vaginalis.', ['cord', 'tunica'], 'This mechanism is especially relevant in infants and children.'),
          phase('fill', 'Peritoneal fluid enters the tunica vaginalis', 'Fluid enters', 'Fluid travels through the patent connection into the space around the testis.', ['tunica'], 'Swelling can fluctuate with activity or position.'),
          phase('expand', 'The scrotal fluid pocket enlarges', 'Sac expands', 'The pocket expands outside the testis. The arterial inflow and venous outflow are preserved in this isolated example.', ['tunica', 'testis'], 'A patent connection also raises the question of an associated inguinal hernia.'),
          phase('return', 'Some fluid returns through the tract', 'Fluid returns', 'A change in pressure or position can allow fluid to return toward the abdomen, reducing visible swelling.', ['tunica', 'cord'], 'The animation shows fluid passage. Hernia involves passage of abdominal contents.'),
        ],
      },
      {
        id: 'varicocele', label: 'Left varicocele', hint: 'Pampiniform veins enlarge and exhibit reflux with a Valsalva maneuver.', sources: [pediatricVaricocele, varicoceleSource],
        phases: [
          scrotalRef,
          phase('dilate', 'Veins of the pampiniform plexus dilate', 'Veins enlarge', 'Venous dilation develops above and around the testis. On the left, the testicular vein drains into the left renal vein.', ['plexus'], 'Examination while standing can make a varicocele more apparent.'),
          phase('reflux', 'Valsalva accentuates venous reflux', 'Valsalva reflux', 'Incompetent venous drainage allows retrograde flow toward the scrotum during increased abdominal pressure. The artery continues to carry blood toward the testis.', ['plexus', 'cord'], 'Doppler can document venous reflux. Position and the maneuver affect what is seen.'),
          phase('compare', 'Distinguish venous dilation from fluid around the testis', 'Compare anatomy', 'The enlarged structures are veins within the cord region. A hydrocele instead expands the tunica vaginalis fluid space.', ['plexus', 'tunica'], 'Long-standing varicocele can be associated with impaired testicular growth or fertility in some patients.'),
          phase('release', 'Reflux diminishes when straining stops in this example', 'Release strain', 'With release of the maneuver, downward reflux wanes in this schematic. Dilated veins can remain visible.', ['plexus'], 'Symptoms, examination and clinical context determine whether further evaluation is needed.'),
        ],
      },
    ],
  },
};

export function guScenario(kind: GuKind, id: string) {
  const cases = GU_LESSONS[kind].cases;
  return cases.find(scenario => scenario.id === id) ?? cases[0];
}

const deepNotes: Record<string, Record<string, { h: string; t: string }>> = {
  stone: {
    dilate: { h: 'Why creatinine can stay normal', t: 'Back pressure can lower filtration in the affected kidney while the contralateral kidney maintains enough total filtration to keep serum creatinine near baseline.' },
    relief: { h: 'Pressure relief and imaging', t: 'Dilation reflects collecting-system anatomy at the time of imaging. Its presence or absence does not directly measure ureteral patency or filtration.' },
  },
  infected: {
    infect: { h: 'Sampling different compartments', t: 'An obstructed renal pelvis may be poorly connected to the bladder. Urine obtained during decompression samples the upper-tract source directly.' },
    drain: { h: 'Where the drain acts', t: 'A nephrostomy enters the collecting system through the flank. A ureteral stent bridges the obstruction to the bladder. Both create an exit path for upstream urine.' },
  },
  outlet: {
    contract: { h: 'Pressure can rise while flow falls', t: 'Emptying depends on both detrusor-generated pressure and outlet resistance. A narrowed outlet can reduce flow even while the detrusor is contracting strongly.' },
  },
  detrusor: {
    force: { h: 'The same endpoint can have different causes', t: 'A large residual tells you that emptying was incomplete. Distinguishing a weak contraction from outlet resistance may require assessment of both pressure and flow.' },
  },
  pyelonephritis: {
    renal: { h: 'Local inflammation changes the urinalysis', t: 'Leukocytes recruited to inflamed urinary tissue can enter the urine. Culture helps identify the organism. Urinalysis alone cannot localize infection to the renal parenchyma.' },
  },
  urosepsis: {
    organ: { h: 'Renal filtration and tissue perfusion can diverge', t: 'Endothelial leak reduces effective circulating volume. Vasodilation and heterogeneous capillary flow can impair oxygen delivery even when one bedside hemodynamic measure improves.' },
  },
  torsion: {
    venous: { h: 'Why arterial color flow can persist', t: 'Venous obstruction and congestion can develop before arterial inflow disappears. The appearance of the cord and the comparison with the other testis are important parts of the assessment.' },
    arterial: { h: 'Ischemia depends on both degree and duration', t: 'More extensive twisting can interrupt perfusion earlier. Incomplete or intermittent twisting can produce variable Doppler findings and variable tissue injury.' },
  },
  hydrocele: {
    expand: { h: 'Fluid lies outside the testis', t: 'Fluid separates the two layers of the tunica vaginalis. Ultrasound can assess the collection, the testicular parenchyma and its blood flow as separate findings.' },
  },
  communicating: {
    fill: { h: 'Hydrocele and hernia share a potential route', t: 'A patent processus vaginalis can permit fluid passage. A wider connection can also transmit abdominal contents, producing an inguinal hernia.' },
  },
  varicocele: {
    reflux: { h: 'What the maneuver changes', t: 'Straining increases abdominal pressure and can accentuate reverse flow in the testicular veins. Venous Doppler findings depend on position and whether Valsalva is used.' },
  },
};

export function guDeep(kind: GuKind, variant: string, phaseId: string) {
  const scenario = guScenario(kind, variant);
  const section = deepNotes[scenario.id]?.[phaseId];
  return section ? { sections: [section], refs: scenario.sources } : undefined;
}

export function guState(kind: GuKind, variant: string, time: number, normal = false) {
  const id = guScenario(kind, variant).id;
  const t = normal ? 0 : time;
  const onset = ramp(t, phaseStart(1), phaseStart(2));
  const impact = ramp(t, phaseStart(2), phaseStart(3));
  const complication = ramp(t, phaseStart(3), phaseStart(4));
  const response = ramp(t, phaseStart(4), phaseStart(4) + 4.5);
  const blocked = kind === 'stones' ? onset * (1 - (id === 'stone' ? response : 0)) : 0;
  const nephrostomy = id === 'infected' ? response : 0;
  const dilation = kind === 'stones' ? impact * (1 - response * 0.88) : 0;
  const bacteria = id === 'infected' || kind === 'infection' ? impact * (1 - response * 0.78) : 0;
  const systemic = id === 'urosepsis' ? complication * (1 - response * 0.55) : 0;
  const pressure = id === 'outlet' ? impact * (1 - response) : 0;
  const bladderVolume = kind === 'retention' ? (0.25 + 0.22 * onset + 0.28 * impact + 0.2 * complication) * (1 - response * 0.92) : 0.34;
  const hydrocele = id === 'communicating' ? (0.35 * impact + 0.65 * complication) * (1 - 0.72 * response) : id === 'hydrocele' ? 0.35 * onset + 0.65 * impact : 0;
  return {
    id, time: t, onset, impact, complication, response, blocked, dilation, nephrostomy, bacteria, systemic,
    systemicSignaling: id === 'urosepsis' ? impact * (1 - 0.5 * response) : 0,
    pressure, bladderVolume,
    detrusor: id === 'detrusor' ? 1 - 0.86 * onset : 1,
    outletNarrowing: id === 'outlet' ? onset : 0,
    twist: id === 'torsion' ? onset * (1 - response) : 0,
    venousOutflow: id === 'torsion' ? 1 - 0.93 * impact * (1 - 0.55 * response) : 1,
    arterialInflow: id === 'torsion' ? 1 - 0.95 * complication * (1 - 0.45 * response) : 1,
    ischemicInjury: id === 'torsion' ? complication : 0,
    hydrocele,
    patentTract: id === 'communicating' ? onset : 0,
    venousDilation: id === 'varicocele' ? 0.62 * onset + 0.38 * impact * (1 - 0.7 * response) : 0,
    reflux: id === 'varicocele' ? impact * (1 - response) : 0,
  };
}
