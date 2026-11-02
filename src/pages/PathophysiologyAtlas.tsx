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
import { POSTPARTUM_PATH } from '@/data/pathophysiology/postpartumEndometritis';
import { OB_EMERGENCIES } from '@/data/pathophysiology/obEmergencies';
import { PEDIATRIC_CONGENITAL_HEART_PATH } from '@/data/pathophysiology/pediatricCongenitalHeart';

export const PATHO_LESSONS = [
  { path: PEDIATRIC_CONGENITAL_HEART_PATH, system: 'Pediatric · Congenital cardiology', title: 'Critical Congenital Heart Disease', blurb: 'Anatomically oriented duct-dependent systemic flow and d-TGA mixing physiology from transition to decompensation.' },
  { path: OB_EMERGENCIES['postpartum-hemorrhage'].path, system: 'OB/GYN · Hemorrhage', title: 'Postpartum Hemorrhage', blurb: 'Tone, trauma, tissue and thrombin mechanisms, circulatory compensation and coagulopathy risk.' },
  { path: OB_EMERGENCIES['preeclampsia-eclampsia'].path, system: 'OB/GYN · Hypertension', title: 'Preeclampsia & Eclampsia', blurb: 'Placental signaling, endothelial dysfunction, organ injury and seizure risk.' },
  { path: OB_EMERGENCIES['placental-abruption'].path, system: 'OB/GYN · Obstetric hemorrhage', title: 'Placental Abruption', blurb: 'Maternal–placental interface hemorrhage, concealed loss, fetal-maternal risk and coagulopathy.' },
  { path: OB_EMERGENCIES['chorioamnionitis'].path, system: 'OB/GYN · Infection', title: 'Intraamniotic Infection', blurb: 'Ascending infection, fetal-maternal inflammation and possible systemic deterioration.' },
  { path: OB_EMERGENCIES['amniotic-fluid-embolism'].path, system: 'OB/GYN · Critical care', title: 'Amniotic Fluid Embolism', blurb: 'Rare abrupt cardiopulmonary collapse and consumptive coagulopathy in a conceptual immune-mediated model.' },
  { path: POSTPARTUM_PATH, system: 'OB/GYN · Infection', title: 'Postpartum Endometritis', blurb: 'Postpartum uterine infection, inflammatory findings and possible systemic deterioration.' },
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
