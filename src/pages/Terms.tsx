import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { EditorialHero } from '@/components/EditorialPage';

const sections: { title: string; body?: string; list?: string[] }[] = [
  {
    title: 'Acceptance of terms',
    body: 'By using jefneyongeri.com you agree to these terms, which govern your use of the site and everything published on it.',
  },
  {
    title: 'Use license',
    body: 'You may view and download one copy of the material here for personal, non-commercial use. Under that license you may not:',
    list: [
      'Modify or redistribute the materials',
      'Use them commercially or for public display',
      'Reverse engineer any software on the site',
      'Remove copyright or proprietary notices',
    ],
  },
  {
    title: 'Not medical advice',
    body: 'The clinical atlases, articles, and reference material on this site are educational. They are not medical advice and do not create a clinician-patient relationship. Always confirm against current guidelines, local protocol, and your own clinical judgment before acting on anything here.',
  },
  {
    title: 'Not financial advice',
    body: 'Portfolio notes, finance guides, and calculators are shared for transparency and education only. They are not investment, tax, or legal advice, and past performance never guarantees future results.',
  },
  {
    title: 'Content guidelines',
    body: 'If you comment or otherwise contribute, you agree to:',
    list: [
      'Avoid harmful, threatening, or inappropriate content',
      'Respect intellectual property rights',
      'Skip spam and unsolicited promotion',
      'Keep the discussion respectful',
    ],
  },
  {
    title: 'Disclaimer',
    body: "Everything on this site is provided on an 'as is' basis, without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.",
  },
  {
    title: 'Limitations',
    body: 'In no event shall the site owner be liable for any damages — including loss of data, profit, or business interruption — arising from the use of, or inability to use, this site.',
  },
  {
    title: 'Revisions',
    body: 'These terms may be revised at any time without notice. Continued use of the site means you accept the current version.',
  },
  {
    title: 'Contact',
    body: 'Questions about these terms? Email jeffongeri@gmail.com or use the contact form.',
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-paper">
      <Helmet>
        <title>Terms of Service | Jefney Ongeri, PA-C</title>
        <meta
          name="description"
          content="Terms of service for jefneyongeri.com, including educational-use and no-medical-advice disclaimers."
        />
        <link rel="canonical" href="https://jefneyongeri.com/terms" />
      </Helmet>
      <Header />

      <main id="main-content">
        <EditorialHero
          kicker="Legal · Policies"
          title="Terms of service"
          intro="The ground rules for using this site, its clinical reference library, and its finance material."
        />

        <section className="bg-paper">
          <div className="container-blog py-16 md:py-24">
            <div className="max-w-3xl">
              {sections.map((s, i) => (
                <article key={s.title} className="border-t border-ink/15 py-10 first:border-t-0 first:pt-0">
                  <div className="flex gap-6">
                    <span className="kicker mt-2 shrink-0 text-editorial">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h2 className="font-serif text-2xl leading-tight text-ink md:text-3xl">
                        {s.title}
                      </h2>
                      {s.body && (
                        <p className="mt-4 text-lg leading-relaxed text-ink/70">{s.body}</p>
                      )}
                      {s.list && (
                        <ul className="mt-5 space-y-2">
                          {s.list.map((item) => (
                            <li key={item} className="flex gap-3 text-ink/70">
                              <span className="mt-2 h-1 w-4 shrink-0 bg-editorial" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </article>
              ))}

              <p className="kicker mt-10 border-t border-ink/15 pt-8 text-ink/50">
                Last updated: September 2026
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
