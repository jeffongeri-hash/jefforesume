import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { AnimatedSection } from '@/hooks/useScrollAnimation';
import { EditorialHero } from '@/components/EditorialPage';
import profileHeadshot from '@/assets/headshot.jpeg';

const focus = [
  { index: '01', label: 'Emergency medicine', body: 'High-acuity, undifferentiated patients — the front door of the hospital.' },
  { index: '02', label: 'Clinical research', body: 'Pharmacogenetics and human subjects research, with peer-reviewed work.' },
  { index: '03', label: 'Patient-centered care', body: 'Clear explanations, shared decisions, dignity at every bedside.' },
  { index: '04', label: 'Evidence-based practice', body: 'Guidelines read closely, then translated into usable reference material.' },
];

const glance = [
  { value: '2025', label: 'PA program graduate' },
  { value: 'PA-C', label: 'Board certified' },
  { value: 'EM', label: 'Primary focus' },
  { value: '300+', label: 'Illustrated atlases' },
];

const About = () => {
  return (
    <div className="min-h-screen bg-paper">
      <Helmet>
        <title>About Jefney Ongeri, PA-C | Physician Assistant & Emergency Medicine</title>
        <meta
          name="description"
          content="Learn about Jefney Ongeri — a Physician Assistant specializing in emergency medicine, clinical research, and patient-centered care. PA graduate, Class of 2025."
        />
        <link rel="canonical" href="https://jeffongeri.com/about" />
      </Helmet>
      <Header />

      <main id="main-content">
        <EditorialHero
          kicker="Physician Assistant · Emergency Medicine · Researcher"
          title="About me"
          intro="Emergency care at the bedside, research behind it, and a reference library built from both."
        />

        {/* Portrait band */}
        <section className="bg-ink-deep">
          <div className="container-blog pb-16">
            <img
              src={profileHeadshot}
              alt="Jefney Ongeri, PA-C"
              className="aspect-[4/5] w-full max-w-sm object-cover object-top"
            />
          </div>
        </section>

        {/* Stats */}
        <section className="bg-ink text-ink-foreground">
          <div className="container-blog grid grid-cols-2 gap-y-10 py-12 md:grid-cols-4">
            {glance.map((s) => (
              <div key={s.label} className="px-2">
                <p className="font-serif text-4xl md:text-5xl">{s.value}</p>
                <p className="kicker mt-2 text-ink-foreground/60">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Journey */}
        <section className="bg-paper">
          <div className="container-blog py-20 md:py-28">
            <AnimatedSection>
              <div className="grid gap-12 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-20">
                <div>
                  <div className="editorial-rule mb-6" />
                  <p className="kicker text-ink/50">01 / The journey</p>
                  <h2 className="mt-4 font-serif text-3xl leading-tight text-ink md:text-4xl">
                    Why emergency medicine
                  </h2>
                </div>
                <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-ink/70">
                  <p>
                    I'm Jefney Ongeri, a Physician Assistant who graduated in July 2025 with a
                    passion for emergency medicine. My path into healthcare came from a simple
                    desire: to matter in someone's life at the moment it counts most.
                  </p>
                  <p>
                    Training taught me that the emergency department is where medicine is at its
                    broadest — immediate, undifferentiated, and open to everyone. That pace, and
                    the range of people who walk through the door, is what keeps me here.
                  </p>
                  <p>
                    Outside of shifts, I write. Evidence-based practice only helps patients if the
                    evidence is findable, so I build illustrated atlases and guideline summaries
                    for the moment they're actually needed.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Focus areas */}
        <section className="bg-paper-alt">
          <div className="container-blog py-20 md:py-28">
            <AnimatedSection>
              <div className="editorial-rule mb-6" />
              <p className="kicker text-ink/50">02 / Areas of focus</p>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-ink md:text-4xl">
                Where the work lives
              </h2>

              <div className="mt-12 grid gap-px bg-ink/15 sm:grid-cols-2">
                {focus.map((f) => (
                  <div key={f.index} className="bg-paper-alt p-8">
                    <span className="kicker text-editorial">{f.index}</span>
                    <h3 className="mt-4 font-serif text-2xl text-ink">{f.label}</h3>
                    <p className="mt-3 leading-relaxed text-ink/70">{f.body}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-ink text-ink-foreground">
          <div className="container-blog py-20 md:py-24">
            <AnimatedSection>
              <div className="editorial-rule mb-8 bg-ink-foreground/20" />
              <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                <div>
                  <p className="kicker text-ink-foreground/60">03 / Get in touch</p>
                  <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
                    Let's connect
                  </h2>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-foreground/70">
                    Emergency medicine, research collaborations, or just a conversation — the door
                    is open.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 bg-ink-foreground px-6 py-3 text-sm font-medium uppercase tracking-widest text-ink transition-colors hover:bg-editorial hover:text-on-media"
                  >
                    Get in touch
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/professional"
                    className="group inline-flex items-center gap-2 border border-ink-foreground/40 px-6 py-3 text-sm font-medium uppercase tracking-widest transition-colors hover:border-ink-foreground"
                  >
                    View portfolio
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
