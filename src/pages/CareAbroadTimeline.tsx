import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3, Plane, Stethoscope } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const phases = [
  {
    window: '3–6 months before',
    title: 'Define the care question',
    summary: 'Start with the reason for traveling. Screening, a symptom workup, and a known diagnosis require different routes.',
    tasks: [
      'List the exact question each traveler wants answered.',
      'Decide what should happen abroad and what must stay close to home.',
      'Set a medical-only budget and a separate whole-trip ceiling.',
    ],
    links: [
      { label: 'Choose your route', hash: 'route' },
      { label: 'See what travels well', hash: 'fit' },
      { label: 'Build the budget', hash: 'budget' },
    ],
  },
  {
    window: '8–12 weeks before',
    title: 'Compare providers and written offers',
    summary: 'Turn advertised packages into comparable written quotes before choosing a hospital or coordinator.',
    tasks: [
      'Confirm the hospital branch, responsible clinician, and accreditation.',
      'Ask what imaging, scopes, pathology, interpretation, and follow-up are included.',
      'Get deposits, exclusions, cancellation terms, and complication costs in writing.',
    ],
    links: [
      { label: 'Compare advertised prices', hash: 'prices' },
      { label: 'Open the provider directory', hash: 'directory' },
      { label: 'Review additional leads', hash: 'leads' },
    ],
  },
  {
    window: '6–8 weeks before',
    title: 'Build the safety net',
    summary: 'Do not book until responsibility is clear on both sides of the trip.',
    tasks: [
      'Name a home clinician who will receive records and review results.',
      'Verify coverage, exclusions, evacuation options, and emergency contacts.',
      'Agree on how long to remain near the treating hospital after procedures.',
    ],
    links: [
      { label: 'Plan for complications', hash: 'net' },
      { label: 'Use the planning checklist', hash: 'checklist' },
    ],
  },
  {
    window: '4–6 weeks before',
    title: 'Book only after confirmation',
    summary: 'Finalize travel after the clinical plan, timing, and total price are confirmed.',
    tasks: [
      'Check passport, entry, medical visa, and medication requirements.',
      'Book flexible flights and lodging that covers possible extra days.',
      'Send records securely and confirm that the receiving team can open them.',
    ],
    links: [
      { label: 'Recheck the budget', hash: 'budget' },
      { label: 'Complete before-you-book items', hash: 'checklist' },
    ],
  },
  {
    window: '1–2 weeks before',
    title: 'Prepare the handoff',
    summary: 'Carry the information needed for safe care abroad and a smooth return home.',
    tasks: [
      'Prepare a concise history, medication list, allergies, and prior reports.',
      'Confirm interpreter coverage for consent, procedures, and results.',
      'Save local emergency numbers and the hospital’s 24-hour contact.',
    ],
    links: [
      { label: 'Review safety scenarios', hash: 'net' },
      { label: 'Finish the checklist', hash: 'checklist' },
    ],
  },
  {
    window: 'During the trip',
    title: 'Care, results, and recovery',
    summary: 'The stay length depends on the procedure, pathology turnaround, and whether treatment occurs abroad.',
    tasks: [
      'Do not leave before required observation or early follow-up is complete.',
      'Obtain English reports, DICOM images, prescriptions, and pathology materials.',
      'For treatment courses, plan around repeated visits and highest-risk recovery windows.',
    ],
    links: [
      { label: 'See the treatment calendar', hash: 'course' },
      { label: 'Review carry-home items', hash: 'checklist' },
    ],
  },
  {
    window: 'Within 1–2 weeks after return',
    title: 'Close the loop at home',
    summary: 'International care is not finished until the records, results, and next steps reach the home clinician.',
    tasks: [
      'Send all records to the clinician who agreed to receive the handoff.',
      'Arrange repeat testing, wound checks, medication monitoring, or specialty review.',
      'Keep the foreign hospital’s after-hours contact available until recovery is complete.',
    ],
    links: [
      { label: 'Review the return safety net', hash: 'net' },
      { label: 'Check off carry-home records', hash: 'checklist' },
    ],
  },
];

const CareAbroadTimeline = () => (
  <div className="min-h-screen bg-paper text-ink">
    <Helmet>
      <title>Care Abroad Timeline | Jefney Ongeri</title>
      <meta name="description" content="A step-by-step timeline for planning diagnostic care or treatment abroad, from early research through follow-up at home." />
      <link rel="canonical" href="https://jeffongeri.com/care-abroad/timeline" />
      <meta property="og:title" content="Care Abroad Planning Timeline | Jefney Ongeri" />
      <meta property="og:description" content="See when to compare providers, secure a safety net, book travel, receive care, and complete follow-up." />
      <meta property="og:type" content="article" />
    </Helmet>

    <Header />
    <main id="main-content">
      <section className="border-b border-border bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-12 sm:px-8 md:pb-20 md:pt-16">
          <Link to="/care-abroad" className="inline-flex items-center gap-2 text-sm font-semibold text-paper/75 transition-colors hover:text-paper">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Care Abroad
          </Link>
          <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_18rem] md:items-end">
            <div>
              <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-paper/65">
                <CalendarDays className="h-4 w-4" aria-hidden="true" /> Planning sequence
              </p>
              <h1 className="max-w-4xl font-serif text-5xl leading-[0.98] tracking-normal sm:text-6xl md:text-7xl">Care Abroad Timeline</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/75">A practical schedule for moving from an idea to safe follow-up. Adjust every window to the procedure, destination, and treating team.</p>
            </div>
            <div className="border-l border-paper/25 pl-5">
              <p className="text-sm leading-relaxed text-paper/70">Start earlier for surgery, cancer care, complex diagnostics, visa requirements, or travel involving older adults.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 md:py-20">
        <div className="mb-12 grid gap-5 border-b border-border pb-8 md:grid-cols-3">
          <div className="flex items-start gap-3"><Clock3 className="mt-1 h-5 w-5 text-primary" /><div><strong className="block font-serif text-xl">Plan backward</strong><span className="text-sm text-muted-foreground">From the treatment or screening date</span></div></div>
          <div className="flex items-start gap-3"><Stethoscope className="mt-1 h-5 w-5 text-primary" /><div><strong className="block font-serif text-xl">Confirm clinically</strong><span className="text-sm text-muted-foreground">Before paying nonrefundable costs</span></div></div>
          <div className="flex items-start gap-3"><Plane className="mt-1 h-5 w-5 text-primary" /><div><strong className="block font-serif text-xl">Leave recovery room</strong><span className="text-sm text-muted-foreground">In both the itinerary and budget</span></div></div>
        </div>

        <ol className="relative ml-3 border-l border-border md:ml-40">
          {phases.map((phase, index) => (
            <li key={phase.title} className="relative pb-14 pl-8 last:pb-0 md:pl-14">
              <span className="absolute -left-4 top-0 grid h-8 w-8 place-items-center rounded-full border border-primary bg-paper text-xs font-bold text-primary">{index + 1}</span>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-primary md:absolute md:-left-40 md:top-2 md:w-32 md:text-right">{phase.window}</p>
              <article className="border-t-2 border-ink pt-5">
                <h2 className="font-serif text-3xl tracking-normal md:text-4xl">{phase.title}</h2>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">{phase.summary}</p>
                <ul className="mt-5 grid gap-3">
                  {phase.tasks.map((task) => (
                    <li key={task} className="flex max-w-3xl gap-3 text-sm leading-relaxed sm:text-base">
                      <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-primary" aria-hidden="true" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                  {phase.links.map((link) => (
                    <Link key={link.label} to={`/care-abroad?section=${link.hash}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline">
                      {link.label}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div><p className="font-serif text-2xl">Ready to work through the details?</p><p className="mt-1 text-sm text-muted-foreground">Return to the guide and save your progress in the checklist.</p></div>
          <Link to="/care-abroad?section=checklist" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
            Open the checklist <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  </div>
);

export default CareAbroadTimeline;