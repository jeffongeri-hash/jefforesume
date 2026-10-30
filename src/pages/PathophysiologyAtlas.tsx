import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BOWEL_PERFORATION_PATH, PATHO_HUB_PATH } from '@/data/pathophysiology/bowelPerforation';
import { RETROPHARYNGEAL_PATH } from '@/data/pathophysiology/retropharyngealAbscess';

export const PATHO_LESSONS = [
  { path: BOWEL_PERFORATION_PATH, system: 'Gastrointestinal · Surgical abdomen', title: 'Bowel Perforation → Peritonitis → Systemic Deterioration', blurb: 'Five scrubbable phases from intact containment to possible sepsis physiology, with synchronized clinical signals and limits.' },
  { path: RETROPHARYNGEAL_PATH, system: 'Head & neck · Airway', title: 'Retropharyngeal Abscess', blurb: 'Sagittal fascial-space anatomy, node infection, phlegmon vs abscess, possible airway narrowing and mediastinal spread risk.' },
];

export default function PathophysiologyAtlas() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Emergency Pathophysiology Atlas | Jefney Ongeri, PA-C</title>
        <meta name="description" content="Interactive, source-cited conceptual animations of emergency pathophysiology for clinicians, starting with bowel perforation and peritonitis." />
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
