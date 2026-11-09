import { type GenericPhase } from './timeline';
export * from './timeline';

export const INHERITED_HEMOSTASIS_PATH = '/pathophysiology-atlas/inherited-bleeding-and-clotting';
export const STRUCTURES = {
  adhesion: {label: 'Platelet adhesion', explanation: 'At an injured vessel, von Willebrand factor links exposed subendothelium to platelet GPIb. It also carries and stabilizes factor VIII.'},
  aggregation: {label: 'Platelet aggregation', explanation: 'Activated platelet integrin αIIbβ3 binds fibrinogen, creating bridges between platelets.'},
  fibrin: {label: 'Fibrin stabilization', explanation: 'Thrombin cleaves fibrinogen and promotes fibrin formation. Activated factor XIII cross-links the fibrin mesh.'},
  brakes: {label: 'Natural anticoagulant pathways', explanation: 'Activated protein C with protein S inactivates Va and VIIIa. Antithrombin inhibits thrombin and factor Xa among other activated factors.'},
  vessel: {label: 'Vessel and clot', explanation: 'Bleeding or thrombosis depends on the underlying mechanism and context. The depicted clot size has no clinical scale.'},
};
export type Structure = keyof typeof STRUCTURES;
type Case = {
  label: string; target: Structure; mode: 'adhesion' | 'aggregation' | 'fibrin' | 'venous';
  mechanism: string; result: string; finding: string; test: string; limit: string;
};
const cases = {
  vwd: {label: 'Von Willebrand disease', target: 'adhesion', mode: 'adhesion', mechanism: 'Reduced quantity or altered function of von Willebrand factor can impair platelet adhesion and sometimes lower factor VIII activity.', result: 'Fewer platelets are tethered to the injured wall in this example, weakening the primary plug.', finding: 'Epistaxis, heavy menstrual bleeding and bleeding after dental work are common patterns.', test: 'vWF antigen, vWF activity and factor VIII', limit: 'vWF can rise during stress, illness or pregnancy. Subtyping may require additional tests.'},
  glanzmann: {label: 'Glanzmann thrombasthenia', target: 'aggregation', mode: 'aggregation', mechanism: 'Deficient or dysfunctional platelet αIIbβ3 prevents effective fibrinogen bridging between activated platelets.', result: 'Platelets can adhere, but they do not aggregate effectively. This differs from a low circulating platelet count.', finding: 'Mucocutaneous bleeding can occur with a normal platelet count.', test: 'Platelet aggregation and receptor studies', limit: 'Routine CBC and coagulation tests do not measure this platelet function.'},
  hemophiliaA: {label: 'Hemophilia A', target: 'fibrin', mode: 'fibrin', mechanism: 'Factor VIII deficiency reduces intrinsic tenase activity and limits thrombin generation.', result: 'Platelet adhesion and aggregation can occur, but fibrin stabilization is impaired.', finding: 'Joint, muscle and delayed post-procedure bleeding are characteristic patterns, particularly in more severe disease.', test: 'Factor VIII activity', limit: 'aPTT can be normal in mild disease depending on the assay. Low factor VIII also has other causes.'},
  hemophiliaB: {label: 'Hemophilia B', target: 'fibrin', mode: 'fibrin', mechanism: 'Factor IX deficiency reduces intrinsic tenase activity and limits thrombin generation.', result: 'The platelet plug may form, but reduced fibrin makes it less stable.', finding: 'Deep tissue bleeding can resemble hemophilia A. Factor testing distinguishes them.', test: 'Factor IX activity', limit: 'Routine clotting times do not reliably detect all mild cases.'},
  leiden: {label: 'Factor V Leiden', target: 'brakes', mode: 'venous', mechanism: 'Factor Va resists inactivation by activated protein C, so the prothrombinase complex can sustain thrombin generation longer.', result: 'A clot can propagate in a vein when other conditions favor thrombosis. Many carriers never develop a clot.', finding: 'The predisposition primarily concerns venous thromboembolism, including DVT and PE.', test: 'APC resistance or targeted F5 testing', limit: 'Risk varies by genotype and exposures. Testing is selective and depends on whether the result changes management.'},
  prothrombin: {label: 'Prothrombin G20210A', target: 'fibrin', mode: 'venous', mechanism: 'The F2 G20210A variant can increase circulating prothrombin and predispose to venous thromboembolism.', result: 'More substrate for thrombin generation can favor clot growth in susceptible circumstances.', finding: 'Many carriers remain asymptomatic. Pregnancy, estrogen and other risk factors can affect the clinical picture.', test: 'Targeted F2 genetic testing', limit: 'PT/INR is not a test for this variant. Clinical utility of testing is context dependent.'},
  anticoagulants: {label: 'Protein C, S or antithrombin deficiency', target: 'brakes', mode: 'venous', mechanism: 'Deficiency of protein C or S weakens regulation of Va and VIIIa. Antithrombin deficiency weakens inhibition of Xa and thrombin.', result: 'Reduced endogenous anticoagulant activity can increase venous thrombosis risk.', finding: 'Personal and family VTE history help determine when evaluation may be appropriate.', test: 'Selected activity and antigen assays', limit: 'Acute illness, thrombosis, pregnancy and anticoagulants can affect interpretation.'},
} satisfies Record<string, Case>;
export function inheritedCase(value: string): Case {
  return Object.prototype.hasOwnProperty.call(cases, value) ? cases[value as keyof typeof cases] : cases.vwd;
}
export const VARIANTS = Object.entries(cases).map(([id, c]) => ({id, label: c.label, hint: c.mechanism}));
export function phasesFor(value: string): GenericPhase<Structure>[] {
  const c = inheritedCase(value);
  const assay = {name: c.test, trend: 'Selected by history', mechanism: 'Assesses the specific defect or predisposition.', limit: c.limit};
  return [
    {id:'reference', short:'Reference', name:'Balanced hemostasis', explanation:'A localized platelet plug and fibrin mesh limit bleeding. Natural anticoagulant pathways help constrain coagulation.', focus:['adhesion','aggregation','fibrin','brakes'], bedside:['Compare the normal pathway with the selected inherited mechanism.'], labs:[assay]},
    {id:'target', short:'Inherited change', name:c.label, explanation:c.mechanism, focus:[c.target], bedside:[c.finding], labs:[assay]},
    {id:'effect', short:'Clot response', name:c.mode === 'venous' ? 'Increased venous clotting tendency' : 'Impaired hemostasis at injury', explanation:c.result, focus:[c.target,'vessel'], bedside:[c.finding], labs:[assay]},
    {id:'pattern', short:'Clinical pattern', name:'Recognize the pattern', explanation:c.finding, focus:['vessel',c.target], bedside:['History includes bleeding sites, prior clots, medications, procedures and affected relatives.'], labs:[assay]},
    {id:'assessment', short:'Assessment', name:'Use targeted assessment', explanation:c.limit, focus:[c.target], bedside:['The clinical question determines which tests are appropriate.'], labs:[assay]},
  ];
}
export const PHASES = phasesFor('vwd');
export const VARIATIONS = [
  {title:'Primary hemostasis', text:'von Willebrand disease and inherited platelet disorders often present with mucocutaneous bleeding.'},
  {title:'Secondary hemostasis', text:'Hemophilia A and B impair fibrin stabilization and may cause joint or deep muscle bleeding.'},
  {title:'Inherited thrombophilia', text:'Factor V Leiden, prothrombin G20210A and deficiencies of protein C, protein S or antithrombin increase venous clotting risk.'},
  {title:'Acquired patterns', text:'ITP primarily affects platelet count. DIC can produce both thrombosis and bleeding through systemic coagulation and consumption. Antiphospholipid syndrome is an acquired thrombophilia.'},
];
export const CANNOT_DETERMINE = ['Individual bleeding or clotting risk, diagnosis or inheritance probability.', 'Whether to test, give factor replacement or use anticoagulation.'];
export const ESCALATION_NOTE = 'Major bleeding, new neurologic symptoms, or sudden chest pain or shortness of breath requires emergency evaluation.';
export const SOURCES = [
  {name:'CDC: von Willebrand disease',url:'https://www.cdc.gov/von-willebrand/about/index.html'},
  {name:'CDC: hemophilia',url:'https://www.cdc.gov/hemophilia/about/index.html'},
  {name:'NIH NLM: Glanzmann thrombasthenia',url:'https://www.ncbi.nlm.nih.gov/mesh/D013915'},
  {name:'GeneReviews: Factor V Leiden',url:'https://www.ncbi.nlm.nih.gov/books/NBK1368/'},
  {name:'GeneReviews: prothrombin thrombophilia',url:'https://www.ncbi.nlm.nih.gov/books/NBK1148/'},
  {name:'ASH guidelines: thrombophilia testing',url:'https://www.hematology.org/Resources/Clinical-Practice-Guidelines/Venous-Thromboembolism-Guidelines/Thrombophilia'},
];
