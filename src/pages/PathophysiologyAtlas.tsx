import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BOWEL_PERFORATION_PATH, PATHO_HUB_PATH } from '@/data/pathophysiology/bowelPerforation';
import { RETROPHARYNGEAL_PATH } from '@/data/pathophysiology/retropharyngealAbscess';
import { SEPSIS_PATH } from '@/data/pathophysiology/sepsisShock';
import { LAD_PATH } from '@/data/pathophysiology/ladOcclusion';
import { MCA_STROKE_PATH } from '@/data/pathophysiology/mcaStroke';
import { HEMORRHAGIC_STROKE_PATH } from '@/data/pathophysiology/hemorrhagicStroke';
import { UPPER_AIRWAY_PATH } from '@/data/pathophysiology/upperAirway';
import { RESPIRATORY_LESSONS } from '@/data/pathophysiology/respiratory';
import { ECTOPIC_PATH } from '@/data/pathophysiology/ectopicPregnancy';
import { HEMORRHAGIC_SHOCK_PATH } from '@/data/pathophysiology/hemorrhagicShock';
import { MESENTERIC_PATH } from '@/data/pathophysiology/mesentericIschemia';
import { LESSONS as SURGICAL_ABDOMEN } from '@/data/pathophysiology/surgicalAbdomen';
import { DKA_PATH } from '@/data/pathophysiology/diabeticKetoacidosis';
import { SPINAL_CORD_PATH } from '@/data/pathophysiology/spinalCord';
import { STATUS_EPILEPTICUS_PATH } from '@/data/pathophysiology/statusEpilepticus';
import { THYROID_STORM_PATH } from '@/data/pathophysiology/thyroidStorm';
import { ADRENAL_CRISIS_PATH } from '@/data/pathophysiology/adrenalCrisis';
import { PATHS as ENDOCRINE_PATHS } from '@/data/pathophysiology/endocrineEmergencies';
import { PATHS as RENAL_PATHS } from '@/data/pathophysiology/renalElectrolytes';
import { PATHS as TOX_PATHS } from '@/data/pathophysiology/toxicology';
import { DIC_PATH } from '@/data/pathophysiology/disseminatedCoagulation';
import { HEMOSTASIS_PATH } from '@/data/pathophysiology/hemostasis';
import { VASCULAR_FLOW_PATH } from '@/data/pathophysiology/vascularFlow';
import { BLOOD_CELLS_PATH } from '@/data/pathophysiology/bloodCells';
import { INHERITED_HEMOSTASIS_PATH } from '@/data/pathophysiology/inheritedHemostasis';
import { GU_LESSONS, GU_PATHS, type GuKind } from '@/data/pathophysiology/genitourinary';
import { PEDIATRIC_LESSONS } from '@/data/pathophysiology/pediatricEmergencies';
import { DIGESTIVE_LESSONS } from '@/data/pathophysiology/pediatricDigestiveEmergencies';
import { PEDIATRIC_CONGENITAL_HEART_PATH } from '@/data/pathophysiology/pediatricCongenitalHeart';
import { TRAUMA_LESSONS } from '@/data/pathophysiology/traumaEmergencies';
import { TRAUMA_DETAIL_LESSONS } from '@/data/pathophysiology/traumaDetails';
import { PATHS as HEENT_PATHS } from '@/data/pathophysiology/heentAtlas';
import { PATHS as FINAL_PATHS, TITLES as FINAL_TITLES } from '@/data/pathophysiology/finalSystems';
import { HEAD_NECK_LESSONS } from '@/data/pathophysiology/headNeckEmergencies';
import { DERM_LESSONS } from '@/data/pathophysiology/dermatologicEmergencies';
import { CARDIOGENIC_PATH } from '@/data/pathophysiology/cardiogenicShock';
import { OBSTRUCTIVE_PATH } from '@/data/pathophysiology/obstructiveShock';
import { ANAPHYLACTIC_PATH } from '@/data/pathophysiology/anaphylacticShock';

export const PATHO_LESSONS = [
  { path: FINAL_PATHS.derm, system: 'Dermatologic · Infection and swelling', title: FINAL_TITLES.derm, blurb: 'Cellulitis, abscess, histamine and bradykinin pathways with treatment mechanisms.' },
  { path: FINAL_PATHS.ob, system: 'OB/GYN · Emergencies', title: FINAL_TITLES.ob, blurb: 'Preeclampsia/eclampsia, HELLP, abruption, previa, atony and postpartum endometritis.' },
  { path: FINAL_PATHS.vascular, system: 'Vascular · Emergencies', title: FINAL_TITLES.vascular, blurb: 'Acute limb ischemia, DVT, PE, abdominal aortic aneurysm and dissection.' },
  { path: HEENT_PATHS.eye, system: 'Eye & ENT · Examination', title: 'Eye Anatomy, Inflammation and Fluorescein Examination', blurb: 'Compare abrasion, perforation, keratitis, uveitis, scleritis and retinitis.' },
  { path: HEENT_PATHS.ear, system: 'Eye & ENT · Examination', title: 'Ear Anatomy and Otoscopic Findings', blurb: 'Compare redness, bulging, effusion, otitis externa and mastoiditis.' },
  { path: HEENT_PATHS.nose, system: 'Eye & ENT · Examination', title: 'Nose and Throat Anatomy and Examination', blurb: 'Explore epistaxis, rhinosinusitis and pharyngeal findings.' },
  ...Object.values(TRAUMA_DETAIL_LESSONS).map(lesson => ({ path: lesson.path, system: 'Trauma · Emergencies', title: lesson.title, blurb: lesson.intro })),
  ...Object.values(DIGESTIVE_LESSONS).map(lesson => ({ path: lesson.path, system: 'Pediatric · Digestive emergencies', title: lesson.title, blurb: lesson.intro })),
  { path: CARDIOGENIC_PATH, system: 'Shock & Circulation · Cardiac', title: 'Cardiogenic Shock', blurb: 'Pump dysfunction, reduced forward flow, congestion and systemic perfusion.' },
  { path: OBSTRUCTIVE_PATH, system: 'Shock & Circulation · Obstruction', title: 'Obstructive Shock', blurb: 'Compare pulmonary embolism, tamponade and tension pneumothorax.' },
  { path: ANAPHYLACTIC_PATH, system: 'Shock & Circulation · Allergy', title: 'Anaphylactic Shock', blurb: 'Mediator release, vasodilation, capillary leak and airway effects.' },
  ...Object.values(DERM_LESSONS).map(lesson => ({ path: lesson.path, system: 'Dermatologic · Emergencies', title: lesson.title, blurb: lesson.intro })),
  ...Object.values(HEAD_NECK_LESSONS).map(lesson => ({ path: lesson.path, system: 'Eye & ENT · Emergencies', title: lesson.title, blurb: lesson.intro })),
  ...Object.values(TRAUMA_LESSONS).map(lesson => ({ path: lesson.path, system: 'Trauma · Emergencies', title: lesson.title, blurb: lesson.intro })),
  ...Object.values(PEDIATRIC_LESSONS).map(lesson => ({ path: lesson.path, system: 'Pediatric · Emergencies', title: lesson.title, blurb: lesson.intro })),
  { path: PEDIATRIC_CONGENITAL_HEART_PATH, system: 'Pediatric · Congenital cardiology', title: 'Critical Congenital Heart Disease', blurb: 'Duct-dependent systemic flow and d-transposition physiology during the newborn transition.' },
  ...(Object.keys(GU_PATHS) as GuKind[]).map(kind => ({
    path: GU_PATHS[kind], system: GU_LESSONS[kind].system, title: GU_LESSONS[kind].title, blurb: GU_LESSONS[kind].intro,
  })),
  { path: '/pathophysiology-atlas/immune-response', system: 'Immune · Host response', title: 'Immune Response and Blood Count Changes', blurb: 'Viral neutropenia, reactive leukocytosis and acute-phase proteins.' },
  { path: '/pathophysiology-atlas/antimicrobial-mechanisms', system: 'Infectious · Pharmacology', title: 'How Antimicrobials Work', blurb: 'Visualize the targets of antibiotics, antivirals and antiparasitics.' },
  { path: '/pathophysiology-atlas/bacterial-meningitis', system: 'Infectious · CNS', title: 'Bacterial Meningitis', blurb: 'Bacterial entry into CSF, meningeal inflammation, and edema.' },
  { path: '/pathophysiology-atlas/necrotizing-soft-tissue-infection', system: 'Infectious · Soft tissue', title: 'Necrotizing Soft-Tissue Infection', blurb: 'Deep fascial spread, tissue ischemia, and surgical source control.' },
  { path: '/pathophysiology-atlas/febrile-neutropenia', system: 'Immune · Host defense', title: 'Febrile Neutropenia', blurb: 'Marrow suppression, barrier disruption, and infection risk.' },
  { path: '/pathophysiology-atlas/infective-endocarditis', system: 'Infectious · Cardiac', title: 'Infective Endocarditis and Septic Emboli', blurb: 'Valve seeding, vegetation growth, and systemic versus pulmonary embolization.' },
  { path: BLOOD_CELLS_PATH, system: 'Hematology · Blood cells', title: 'Blood Cell Disorders', blurb: 'Marrow and lymphoid changes in leukemia, lymphoma, reactive leukocytosis, megaloblastic anemia and thrombocytopenia.' },
  { path: INHERITED_HEMOSTASIS_PATH, system: 'Hematology · Hemostasis', title: 'Inherited Bleeding and Clotting', blurb: 'Compare platelet adhesion, fibrin stabilization and inherited venous thrombosis mechanisms.' },
  { path: VASCULAR_FLOW_PATH, system: 'Vascular · Circulation', title: 'Arteries, Veins and AVMs', blurb: 'Vessel wall thickness, pulsatile flow, venous valves and AVM physiology.' },
  { path: HEMOSTASIS_PATH, system: 'Hematology · Hemostasis', title: 'Hemostasis and Antithrombotics', blurb: 'Platelet aggregation, intrinsic and extrinsic cascade, and medication targets.' },
  { path: DIC_PATH, system: 'Hematology · Coagulation', title: 'Disseminated Intravascular Coagulation', blurb: 'Microvascular clotting, platelet and factor consumption, fibrinolysis and bleeding risk.' },
  {path:TOX_PATHS.environmental,system:'Toxicology & Environmental',title:'Environmental Emergencies',blurb:'Heat, cold, drowning and electrical injury with mechanism-linked correction concepts.'},
  {path:TOX_PATHS.envenomation,system:'Toxicology & Environmental · Envenomation',title:'Envenomation & Severe Arthropod Reactions',blurb:'Snake venom, scorpion toxicity, hives, anaphylaxis and antivenom concepts.'},
  {path:TOX_PATHS['carbon-monoxide-cyanide'],system:'Toxicology · Cellular oxygen',title:'Carbon Monoxide & Cyanide',blurb:'Oxygen delivery versus utilization failure.'},
  {path:TOX_PATHS['toxic-alcohols'],system:'Toxicology · Metabolic',title:'Toxic Alcohols',blurb:'Toxic metabolism, acidosis and metabolic blockade.'},
  {path:TOX_PATHS.salicylate,system:'Toxicology · Acid–base',title:'Salicylate Toxicity',blurb:'Mixed acid–base physiology and tissue penetration.'},
  {path:TOX_PATHS.acetaminophen,system:'Toxicology · Hepatic',title:'Acetaminophen Toxicity',blurb:'NAPQI, glutathione depletion and N-acetylcysteine.'},
  {path:TOX_PATHS.opioid,system:'Toxicology · Respiratory',title:'Opioid Toxicity',blurb:'Ventilatory failure, hypercapnia and receptor reversal.'},
  { path: RENAL_PATHS.hypernatremia, system: 'Renal & Electrolyte · Sodium', title: 'Hypernatremia', blurb: 'Water deficit, cellular dehydration, brain adaptation and correction-risk concepts.' },
  { path: RENAL_PATHS.hyponatremia, system: 'Renal & Electrolyte · Sodium', title: 'Hyponatremia', blurb: 'Tonicity, brain water, cerebral edema and correction-risk concepts.' },
  { path: RENAL_PATHS.rhabdomyolysis, system: 'Renal & Electrolyte · Muscle–kidney', title: 'Rhabdomyolysis', blurb: 'Myocyte injury, CK, myoglobin, electrolyte release and acute tubular injury.' },
  { path: RENAL_PATHS['acid-base'], system: 'Renal & Electrolyte · Acid–base', title: 'Acid–Base Disorders', blurb: 'Buffers, respiratory compensation, anion-gap logic, cell shifts and medication-handling limits.' },
  { path: RENAL_PATHS.hyperkalemia, system: 'Renal & Electrolyte · Cardiac', title: 'Hyperkalemia', blurb: 'Intracellular shifts, cardiac membrane potential and conceptual ECG progression.' },
  { path: RENAL_PATHS['acute-kidney-injury'], system: 'Renal & Electrolyte · Kidney', title: 'Acute Kidney Injury', blurb: 'Hemodynamic, intrinsic tubular and postrenal mechanisms through the nephron.' },
  { path: ENDOCRINE_PATHS['myxedema-coma'], system: 'Endocrine · Thyroid emergency', title: 'Myxedema Coma', blurb: 'Severe hypothyroid decompensation: temperature, ventilation, water balance and cardiac slowing.' },
  { path: ENDOCRINE_PATHS.hypoglycemia, system: 'Endocrine · Glucose emergency', title: 'Severe Hypoglycemia', blurb: 'Counterregulation, neuroglycopenia, recurrence and important laboratory limits.' },
  { path: ENDOCRINE_PATHS.hhs, system: 'Endocrine · Glucose emergency', title: 'Hyperosmolar Hyperglycemic State', blurb: 'Hyperglycemia, osmotic diuresis, hyperosmolarity and cerebral dysfunction.' },
  { path: ADRENAL_CRISIS_PATH, system: 'Endocrine · Adrenal emergency', title: 'Adrenal Crisis', blurb: 'Cortisol deficiency, primary vs central disease, electrolytes and circulatory collapse.' },
  { path: THYROID_STORM_PATH, system: 'Endocrine · Thyroid emergency', title: 'Thyroid Storm', blurb: 'Thyroid hormone excess, adrenergic effects, fever and laboratory interpretation.' },
  { path: STATUS_EPILEPTICUS_PATH, system: 'Neurologic · Seizure emergency', title: 'Status Epilepticus', blurb: 'Network recruitment, declining inhibition, systemic stress and secondary-injury risk.' },
  { path: SPINAL_CORD_PATH, system: 'Neurologic · Spinal cord', title: 'Spinal Cord Injury: Tracts, Sensory Patterns & UMN Signs', blurb: 'Normal pathways first, then selectable cord-injury patterns linked to a motor and sensation body map.' },
  {path:DKA_PATH,system:'Endocrine · Metabolic emergency',title:'Diabetic Ketoacidosis',blurb:'Insulin deficiency, ketone formation, fluid losses, potassium shifts and laboratory interpretation.'},
  {path:SURGICAL_ABDOMEN['bowel-obstruction'].path,system:'Gastrointestinal · Surgical abdomen',title:'Small-Bowel Obstruction',blurb:'Mechanical obstruction, distension, fluid loss and possible strangulation.'},
  {path:SURGICAL_ABDOMEN['intra-abdominal-abscess'].path,system:'Gastrointestinal · Infection',title:'Intra-Abdominal Abscess',blurb:'Contained contamination, abscess formation and systemic risk.'},
  { path: MESENTERIC_PATH, system: 'Gastrointestinal · Surgical abdomen', title: 'Acute Mesenteric Ischemia', blurb: 'SMA embolism, mucosal injury, bowel infarction, clinical signals and the limitations of lactate.' },
  { path: HEMORRHAGIC_SHOCK_PATH, system: 'Shock & Circulation · Hemorrhage', title: 'Hemorrhagic Shock', blurb: 'Circulatory filling, blood loss, preload and sympathetic compensation, with possible organ dysfunction and detailed hemoglobin, lactate and coagulation limits.' },
  { path: ECTOPIC_PATH, system: 'OB/GYN · Pregnancy · Hemorrhage', title: 'Ruptured Ectopic Pregnancy', blurb: 'Normal versus tubal implantation, trophoblast invasion, possible hemoperitoneum and shock, with detailed hCG, ultrasound and acute blood-loss limitations.' },
  ...RESPIRATORY_LESSONS.map(l => ({ path: l.path, title: l.title, blurb: l.blurb, system: l.id === 'pulmonary-hypertension' ? 'Pulmonary vascular · Right heart' : 'Respiratory · Lower airway' })),
  { path: UPPER_AIRWAY_PATH, system: 'Pediatric · ENT · Airway', title: 'Upper-Airway Obstruction: Croup, Epiglottitis & Foreign Body', blurb: 'Sagittal airway comparison, subglottic vs supraglottic inflammation, variable object levels, airflow and effort, with phase-specific clinical mechanisms.' },
  { path: SEPSIS_PATH, system: 'Infection · Shock', title: 'Sepsis → Distributive Shock', blurb: 'Innate recognition, NO-related vasodilation, glycocalyx loss, capillary leak and heterogeneous capillary flow, with lactate limits.' },
  { path: LAD_PATH, system: 'Cardiac · Coronary', title: 'Coronary Occlusion: LAD vs RCA', blurb: 'Selectable LAD or RCA occlusion, dominance and territory map, ECG lead groups, troponin, possible RV involvement and the RV→LV preload chain.' },
  { path: MCA_STROKE_PATH, system: 'Neurologic · Stroke', title: 'Ischemic Stroke: MCA, ACA, PCA & Basilar', blurb: 'Lateral and medial territory maps by hemisphere, symptom associations, collaterals, core vs penumbra, and CTA vs perfusion limits.' },
  { path: HEMORRHAGIC_STROKE_PATH, system: 'Neurologic · Haemorrhage', title: 'Hemorrhagic Stroke: ICH vs SAH', blurb: 'Vessel rupture, haematoma expansion risk, oedema, mass effect, hydrocephalus and raised ICP as possible outcomes, with NCCT concept.' },
  { path: BOWEL_PERFORATION_PATH, system: 'Gastrointestinal · Surgical abdomen', title: 'Bowel Perforation → Peritonitis → Systemic Deterioration', blurb: 'Five scrubbable phases from intact containment to possible sepsis physiology, with synchronized clinical signals and limits.' },
  { path: RETROPHARYNGEAL_PATH, system: 'Head & neck · Airway', title: 'Retropharyngeal Abscess', blurb: 'Sagittal fascial-space anatomy, node infection, phlegmon vs abscess, possible airway narrowing and mediastinal spread risk.' },
];

export default function PathophysiologyAtlas() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Emergency Pathophysiology Atlas | Jefney Ongeri, PA-C</title>
        <meta name="description" content="Interactive source-cited emergency lessons: hemorrhagic shock, ectopic pregnancy, respiratory, upper-airway, sepsis, cardiac and neurologic emergencies, with detailed mechanisms and clinical signals." />
        <link rel="canonical" href={`https://jeffongeri.com${PATHO_HUB_PATH}`} />
        <meta property="og:title" content="Emergency Pathophysiology Atlas" />
        <meta property="og:description" content="Conceptual, phase-by-phase emergency pathophysiology lessons with clinical signals and sources." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
      </Helmet>
      <Header />
      <main id="main-content" className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-xs"><Link to="/professional">Professional</Link><span>/</span><Link to="/physiology-animation-lab">Physiology Lab</Link><span>/</span><span>Emergency Pathophysiology Atlas</span></nav>
        <p className="mt-6 text-xs font-semibold uppercase text-muted-foreground">Clinician-facing conceptual education</p>
        <h1 className="mt-2 font-journal text-3xl md:text-5xl">Emergency Pathophysiology Atlas</h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">Code-native teaching animations of how emergencies can evolve. Not diagnostic tools, patient simulations or treatment protocols.</p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PATHO_LESSONS.map(l => (
            <li key={l.path}>
              <Link to={l.path} className="dark block h-full rounded-lg border border-border bg-card p-5 text-card-foreground transition-colors hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{l.system}</p>
                <h2 className="mt-2 font-journal text-xl">{l.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{l.blurb}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-primary">Open lesson →</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-muted-foreground">More lessons will be added one at a time.</p>
      </main>
      <Footer />
    </div>
  );
}
