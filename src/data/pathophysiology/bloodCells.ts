import { type GenericPhase, type Lab } from './timeline';
export * from './timeline';

export const BLOOD_CELLS_PATH = '/pathophysiology-atlas/blood-cell-disorders';
export const STRUCTURES = {
  marrow: { label: 'Bone marrow', explanation: 'Hematopoietic stem cells produce myeloid and lymphoid progenitors. Megakaryocytes release platelets, erythroid precursors yield red cells, and leukocytes mature along several lineages.' },
  blood: { label: 'Peripheral blood', explanation: 'A CBC reports circulating cells. The differential, smear, prior counts and clinical context help explain the pattern.' },
  lymph: { label: 'Lymphoid tissue', explanation: 'Normal lymphocytes circulate among blood, lymph and lymphoid tissues. A malignant clone may expand in a node or an extranodal site.' },
  spleen: { label: 'Splenic platelet pool', explanation: 'An enlarged spleen can retain more platelets and lower the circulating count.' },
  clearance: { label: 'Platelet destruction or consumption', explanation: 'Immune clearance, microvascular thrombosis, and other processes can reduce the number of circulating platelets through distinct mechanisms.' },
  smear: { label: 'Peripheral smear', explanation: 'Cell morphology provides clues about maturation and production. A representative teaching drawing cannot establish a diagnosis.' },
};
export type Structure = keyof typeof STRUCTURES;

const lab = (name: string, trend: string, mechanism: string, limit: string): Lab => ({ name, trend, mechanism, limit });
const stage = (id: string, short: string, name: string, explanation: string, focus: Structure[], bedside: string, ...labs: Lab[]): GenericPhase<Structure> =>
  ({ id, short, name, explanation, focus, bedside: [bedside], labs });

const baseline = stage('reference', 'Reference', 'Blood cell production and circulation',
  'Marrow progenitors produce red cells, white cells and platelets. Mature lymphocytes also traffic through lymphoid tissue.',
  ['marrow', 'blood', 'lymph'], 'Compare the affected lineage and compartment.',
  lab('CBC with differential', 'Reference', 'Quantifies circulating cells and white-cell subsets.', 'Counts do not describe all cell functions.'));

const WBC = lab('WBC and differential', 'Variable', 'Cell release, demargination or clonal expansion can change the circulating count.', 'Use absolute counts and morphology. Leukocytosis alone does not establish malignancy.');
const cytopenias = lab('Hemoglobin / platelets / neutrophils', 'May decrease', 'A marrow process can reduce effective production of normal cells.', 'The combination and severity vary.');
const platelet = lab('Platelet count', 'Decreased', 'Reduced production, peripheral loss or redistribution can lower the circulating count.', 'Review the smear for platelet clumps and compare prior counts.');
const macrocytes = lab('Hemoglobin / MCV / smear', 'Hemoglobin ↓, MCV often ↑', 'Ineffective erythropoiesis can produce macro-ovalocytes with hypersegmented neutrophils.', 'Mixed deficiencies can obscure macrocytosis. Morphology alone does not establish cause.');

const cases = {
  leukemia: {
    label: 'Acute leukemia', hint: 'Abnormal precursors expand in marrow and may enter peripheral blood.',
    phases: [
      stage('origin', 'Clone', 'An abnormal precursor expands', 'A malignant myeloid or lymphoid precursor expands in marrow. Acute leukemia commonly involves impaired maturation and accumulation of blasts.', ['marrow'], 'AML and ALL are distinct diseases.', WBC),
      stage('process', 'Marrow crowding', 'Normal production falls', 'Clonal expansion and altered marrow function suppress normal blood-cell production.', ['marrow', 'blood'], 'Anemia, infection and bleeding can occur together.', cytopenias),
      stage('effect', 'Blood findings', 'Blasts may enter circulation', 'Blasts may circulate, but the total white count can be elevated, normal or low. High counts do not imply competent immune function.', ['blood', 'smear'], 'Dyspnea or neurologic changes with suspected acute leukemia can signal leukostasis.', WBC, cytopenias),
      stage('interpretation', 'Workup', 'Characterize the clone', 'Smear, flow cytometry, marrow studies and genetic testing help classify suspected leukemia. APL is a distinct emergency when suspected because severe coagulopathy can occur.', ['marrow', 'smear'], 'Fever with possible neutropenia or significant bleeding needs urgent evaluation.', lab('Flow cytometry / genetics', 'Classification', 'Identify lineage and molecular features.', 'Interpret with hematology and morphology.')),
    ],
  },
  lymphoma: {
    label: 'Lymphoma', hint: 'A malignant lymphocyte clone expands in lymphoid tissue or at an extranodal site.',
    phases: [
      stage('origin', 'Clone', 'A lymphocyte acquires malignant changes', 'Lymphomas arise from lymphoid cells. This example starts in a lymph node, while some lymphomas present outside nodes.', ['lymph'], 'A persistent or enlarging node has several possible causes.', WBC),
      stage('process', 'Node growth', 'The clone expands within tissue', 'Clonal accumulation can enlarge a node or infiltrate tissue. Blood counts can remain normal when disease is largely tissue based.', ['lymph'], 'An enlarging mass may produce local pressure symptoms.', WBC),
      stage('effect', 'Systemic effects', 'Disease may extend beyond the first site', 'Other lymphoid sites, extranodal tissues, marrow and sometimes blood may be involved. Marrow involvement can contribute to cytopenias.', ['lymph', 'marrow', 'blood'], 'Some patients have fever, drenching night sweats or weight loss.', cytopenias),
      stage('interpretation', 'Workup', 'Tissue establishes the subtype', 'Tissue pathology with immunophenotyping and selected molecular studies classifies lymphoma. Blood tests and imaging provide complementary information.', ['lymph'], 'Airway compromise or neurologic deficits with a suspected mass require urgent evaluation.', lab('Tissue pathology', 'Subtype-specific', 'Assesses architecture and cell identity.', 'CBC alone cannot rule lymphoma in or out.')),
    ],
  },
  leukocytosis: {
    label: 'Reactive leukocytosis', hint: 'Stress or inflammation increases circulating mature white cells.',
    phases: [
      stage('origin', 'Stimulus', 'Stress or inflammation signals a response', 'Infection, inflammation, physiologic stress and medications can raise circulating white cells through different pathways.', ['marrow', 'blood'], 'Interpret the differential in context of symptoms and medication exposures.', WBC),
      stage('process', 'Mobilization', 'Release and demargination', 'Neutrophils can move from vessel margins into circulation. Inflammation can also increase marrow release, including less mature forms.', ['marrow', 'blood'], 'A left shift may support increased marrow release.', WBC),
      stage('effect', 'High count', 'Circulating white cells increase', 'A neutrophilic response is common in acute stress or bacterial inflammation. Other differential patterns have different causes.', ['blood', 'smear'], 'A high count is a finding, and its cause guides evaluation.', WBC),
      stage('interpretation', 'Workup', 'Compare count, differential and smear', 'Clinical trajectory and repeat counts help distinguish transient responses from persistent abnormalities. Blasts or accompanying cytopenias change the differential.', ['blood', 'smear'], 'Escalate concerning findings based on the overall presentation.', WBC, cytopenias),
    ],
  },
  megaloblastic: {
    label: 'Megaloblastic anemia', hint: 'Impaired DNA synthesis disrupts maturation and reduces effective red-cell output.',
    phases: [
      stage('origin', 'DNA synthesis', 'B12 or folate deficiency disrupts maturation', 'Vitamin B12 or folate deficiency can impair DNA synthesis in dividing marrow precursors. Some medicines can also produce megaloblastic changes.', ['marrow'], 'B12 deficiency can cause neurologic symptoms even when anemia is mild or absent.', macrocytes),
      stage('process', 'Marrow loss', 'Ineffective erythropoiesis', 'Delayed nuclear maturation and precursor loss reduce effective red-cell output despite ongoing marrow activity.', ['marrow', 'blood'], 'Other cell lineages can also be affected.', lab('Reticulocyte response', 'Often inappropriately low', 'Fewer precursors complete maturation.', 'Interpret relative to the degree of anemia.')),
      stage('effect', 'Smear pattern', 'Macro-ovalocytes and hypersegmentation', 'Large oval red cells and hypersegmented neutrophils may appear on the peripheral smear. Severe deficiency can produce multiple cytopenias.', ['blood', 'smear'], 'Paresthesia, gait changes and cognitive symptoms raise concern for B12 deficiency.', macrocytes),
      stage('interpretation', 'Workup', 'Distinguish B12 and folate mechanisms', 'History, B12 and folate testing, and selected metabolites can help establish the cause. B12 deficiency needs assessment before attributing this pattern to folate alone.', ['smear', 'marrow'], 'Assess neurologic symptoms separately from the CBC.', lab('Methylmalonic acid', 'May rise with B12 deficiency', 'B12 is required for methylmalonyl-CoA metabolism.', 'Kidney impairment can also increase MMA.')),
    ],
  },
  thrombocytopenia: {
    label: 'Thrombocytopenia', hint: 'Compare reduced production, peripheral loss and splenic sequestration as separate mechanisms.',
    phases: [
      stage('origin', 'Low output', 'Reduced platelet production', 'Marrow suppression, infiltration or ineffective production can reduce megakaryocyte output. Other lineages may also fall.', ['marrow', 'blood'], 'Compare other cell counts, exposures and prior CBCs.', platelet, cytopenias),
      stage('process', 'Peripheral loss', 'Destruction or consumption', 'Immune thrombocytopenia can involve accelerated immune clearance and reduced production. DIC and thrombotic microangiopathy consume platelets through different mechanisms.', ['clearance', 'blood'], 'Thrombocytopenia with thrombosis, hemolysis or organ injury requires urgent assessment.', platelet),
      stage('effect', 'Sequestration', 'Redistribution into an enlarged spleen', 'Splenomegaly can enlarge the splenic platelet pool, reducing the circulating platelet count. Multiple mechanisms can coexist in conditions such as liver disease.', ['spleen', 'blood'], 'Review liver disease, splenic findings and prior counts.', platelet),
      stage('interpretation', 'Workup', 'Confirm the count and identify the mechanism', 'Platelet clumping can create a falsely low automated count. Consider true production, destruction, consumption, sequestration and dilution in clinical context.', ['smear', 'blood'], 'Major bleeding, neurologic changes or suspected thrombotic microangiopathy needs urgent evaluation.', platelet),
    ],
  },
} satisfies Record<string, {label: string; hint: string; phases: GenericPhase<Structure>[]}>;

export type BloodCase = keyof typeof cases;
export function bloodCase(value: string): BloodCase {
  return Object.prototype.hasOwnProperty.call(cases, value) ? value as BloodCase : 'leukemia';
}
export const VARIANTS = Object.entries(cases).map(([id, {label, hint}]) => ({id, label, hint}));
export const phasesFor = (value: string) => [baseline, ...cases[bloodCase(value)].phases];
export const PHASES = phasesFor('leukemia');
export const VARIATIONS = [
  {title: 'Acute versus chronic leukemia', text: 'The animation uses acute leukemia as an example. Chronic leukemias can involve more differentiated cells and have different patterns.'},
  {title: 'Overlapping compartments', text: 'Some lymphoid malignancies involve blood, marrow and tissue. Classification depends on the specific disease.'},
  {title: 'Counts and function', text: 'Cell counts and morphology describe different aspects of blood. A normal count can coexist with dysfunctional cells.'},
];
export const CANNOT_DETERMINE = ['A diagnosis, malignancy subtype or cause of a blood-count abnormality.', 'An individual treatment or transfusion decision.'];
export const ESCALATION_NOTE = 'Significant bleeding, fever with suspected neutropenia, severe shortness of breath, or new neurologic symptoms require emergency evaluation.';
export const SOURCES = [
  {name: 'NCI: acute myeloid leukemia', url: 'https://www.cancer.gov/types/leukemia/patient/adult-aml-treatment-pdq'},
  {name: 'NCI: non-Hodgkin lymphoma', url: 'https://www.cancer.gov/types/lymphoma/patient/adult-nhl-treatment-pdq'},
  {name: 'NCI SEER: hematologic examination', url: 'https://training.seer.cancer.gov/abstracting/procedures/clinical/hematologic/'},
  {name: 'NIH MedGen: hypersegmented neutrophils', url: 'https://www.ncbi.nlm.nih.gov/medgen/443272'},
  {name: 'NHLBI: thrombocytopenia', url: 'https://www.nhlbi.nih.gov/health/thrombocytopenia'},
];
