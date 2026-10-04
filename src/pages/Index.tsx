import Header from '@/components/Header';
import FogBackground from '@/components/FogBackground';
import { Spotlight } from '@/components/ui/spotlight';
import Footer from '@/components/Footer';
import { AnimatedSection } from '@/hooks/useScrollAnimation';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Linkedin, Mail } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import headshot from '@/assets/headshot.jpeg';
import heroImageAsset from '@/assets/home/hero-investing-hand.png.asset.json';

const heroImage = heroImageAsset.url;
import sectionInvestmentsAsset from '@/assets/home/section-investments.jpg.asset.json';
import sectionAtlas from '@/assets/home/section-atlas.jpg';

const sectionInvestments = sectionInvestmentsAsset.url;

const chapters = [
  {
    index: '01',
    label: 'Clinical',
    title: 'Emergency medicine, at the bedside',
    body:
      'Certified Physician Assistant with a neuroscience background and training across high-volume emergency departments. Case logs, procedures, education, and publications in one place.',
    href: '/professional',
    cta: 'View the portfolio',
    image: heroImage,
  },
  {
    index: '02',
    label: 'Capital',
    title: 'A portfolio built the slow way',
    body:
      'Holdings, trade history, and the thinking behind them — plus plain-language finance guides on retirement accounts, market basics, and financial independence.',
    href: '/investments',
    cta: 'Open the portfolio',
    image: sectionInvestments,
  },
  {
    index: '03',
    label: 'Atlas',
    title: 'A reference library that keeps growing',
    body:
      'Hundreds of illustrated clinical atlases — cardiology to imaging, guideline changes to procedures — written for the moment you actually need them.',
    href: '/posts',
    cta: 'Browse the atlases',
    image: sectionAtlas,
  },
];

const stats = [
  { value: 'PA-C', label: 'Board certified' },
  { value: '20+', label: 'Clinical systems covered' },
  { value: '300+', label: 'Illustrated atlases' },
  { value: 'EM', label: 'Primary focus' },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-paper">
      <Helmet>
        <title>Jefney Ongeri, PA-C | Emergency Medicine PA, Atlases & Investing</title>
        <meta
          name="description"
          content="Jefney Ongeri, PA-C — emergency medicine physician assistant, author of an illustrated clinical atlas library, and long-term investor. Explore the portfolio, atlases, and finance guides."
        />
        <link rel="canonical" href="https://jeffongeri.com/" />
      </Helmet>
      <Header />

      <main id="main-content">
        {/* ===== Cinematic hero ===== */}
        <section className="relative min-h-[88vh] md:min-h-screen flex flex-col justify-end overflow-hidden bg-ink-deep">
          <FogBackground className="absolute inset-0 h-full w-full" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-deep via-ink-deep/40 to-transparent" />

          <div className="container-blog relative z-10 pb-16 pt-40 md:pb-24">
            <p className="kicker text-on-media/70 reveal-up">
              Physician Assistant &nbsp;·&nbsp; Emergency Medicine &nbsp;·&nbsp; Investor
            </p>

            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-[-50vw] right-[-50vw] h-[100vh] overflow-hidden [mask-image:linear-gradient(to_bottom,black_88%,transparent)]"
              >
                <Spotlight className="left-[calc(50vw+13rem)] top-[calc(100vh-16rem)] !h-[50rem] !w-[70rem] md:!w-[90rem]" fill="white" />
              </div>
              <h1 className="relative z-[2] mt-6 font-serif text-on-media [text-shadow:0_2px_24px_hsl(var(--ink-deep)/0.55)] leading-[0.92] text-[15vw] sm:text-7xl md:text-8xl lg:text-[7.5rem] reveal-up">
                Jefney Ongeri<span className="text-editorial">.</span>
              </h1>
            </div>

            <div className="relative z-[2] mt-8 grid gap-8 md:grid-cols-[minmax(0,34rem)_auto] md:items-end reveal-up">
              <p className="text-on-media/75 text-lg leading-relaxed">
                Patient-centered emergency care, an illustrated clinical reference library, and a
                long-horizon investment portfolio — documented openly, in one place.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/professional"
                  className="group inline-flex items-center gap-2 bg-on-media px-6 py-3 text-sm font-medium uppercase tracking-widest text-ink-deep transition-colors hover:bg-editorial hover:text-on-media"
                >
                  View portfolio
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/posts"
                  className="group inline-flex items-center gap-2 border border-on-media/40 px-6 py-3 text-sm font-medium uppercase tracking-widest text-on-media transition-colors hover:border-on-media"
                >
                  Read the atlases
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Chapter index strip */}
          <div className="relative z-10 border-t border-on-media/15">
            <div className="container-blog grid grid-cols-1 sm:grid-cols-3">
              {chapters.map((c) => (
                <Link
                  key={c.index}
                  to={c.href}
                  className="group flex items-baseline gap-3 border-b border-on-media/10 py-4 sm:border-b-0 sm:border-r sm:border-on-media/10 sm:pr-6 last:border-r-0"
                >
                  <span className="kicker text-editorial">{c.index}</span>
                  <span className="kicker text-on-media/80 transition-colors group-hover:text-on-media">
                    {c.label}
                  </span>
                  <ArrowUpRight className="ml-auto h-4 w-4 text-on-media/50 transition-transform group-hover:-translate-y-0.5 group-hover:text-on-media" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Stats band ===== */}
        <section className="bg-ink text-ink-foreground">
          <div className="container-blog grid grid-cols-2 gap-y-10 py-14 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="px-2">
                <p className="font-serif text-4xl md:text-5xl">{s.value}</p>
                <p className="kicker mt-2 text-ink-foreground/60">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Chapter bands ===== */}
        {chapters.map((c, i) => (
          <section
            key={c.index}
            className={i % 2 === 0 ? 'bg-paper' : 'bg-paper-alt'}
          >
            <div className="container-blog py-20 md:py-28">
              <AnimatedSection>
                <div
                  className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${
                    i % 2 === 1 ? 'lg:[&>figure]:order-2' : ''
                  }`}
                >
                  <figure className="relative overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.title}
                      loading="lazy"
                      width={1280}
                      height={960}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.03]"
                    />
                    <figcaption className="kicker absolute left-0 top-0 bg-ink px-3 py-2 text-ink-foreground">
                      {c.index} / {c.label}
                    </figcaption>
                  </figure>

                  <div>
                    <div className="editorial-rule mb-8" />
                    <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
                      {c.title}
                    </h2>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">{c.body}</p>
                    <Link
                      to={c.href}
                      className="group mt-8 inline-flex items-center gap-2 border-b border-ink/30 pb-1 text-sm font-medium uppercase tracking-widest text-ink transition-colors hover:border-editorial hover:text-editorial"
                    >
                      {c.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </section>
        ))}

        {/* ===== About band ===== */}
        <section className="bg-ink text-ink-foreground">
          <div className="container-blog py-20 md:py-28">
            <AnimatedSection>
              <div className="grid items-center gap-12 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-20">
                <img
                  src={headshot}
                  alt="Jefney Ongeri, PA-C"
                  loading="lazy"
                  className="aspect-[4/5] w-full max-w-xs object-cover grayscale transition-all duration-700 hover:grayscale-0"
                />
                <div>
                  <p className="kicker text-editorial">
                    About M
                    <Link
                      to="/licenses-admin#a4f7c92e6b18d0f34c8b5e21f9d7a6103e5c2b89a0d4f16e7b3c95a218f6d04c"
                      className="text-editorial no-underline cursor-text"
                      aria-hidden="true"
                    >
                      e
                    </Link>
                  </p>
                  <h2 className="mt-6 font-serif text-3xl leading-snug md:text-4xl">
                    Medicine first. Everything else is built around it.
                  </h2>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-foreground/70">
                    I'm a certified Physician Assistant focused on emergency medicine, with a
                    background in neuroscience and experience across leading healthcare
                    institutions. I write clinical atlases to keep my own practice sharp, and I
                    invest with the same long-view discipline I bring to the department. I'm also
                    the co-founder of Medi-Sync Applications.
                  </p>
                  <div className="mt-9 flex flex-wrap gap-3">
                    <a
                      href="https://www.linkedin.com/in/jefney-ongeri/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 bg-ink-foreground px-6 py-3 text-sm font-medium uppercase tracking-widest text-ink transition-colors hover:bg-editorial hover:text-on-media"
                    >
                      <Linkedin className="h-4 w-4" />
                      Connect on LinkedIn
                    </a>
                    <a
                      href="mailto:jeffongeri@gmail.com"
                      className="group inline-flex items-center gap-2 border border-ink-foreground/40 px-6 py-3 text-sm font-medium uppercase tracking-widest text-ink-foreground transition-colors hover:border-ink-foreground"
                    >
                      <Mail className="h-4 w-4" />
                      Get in touch
                    </a>
                  </div>
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

export default Index;
