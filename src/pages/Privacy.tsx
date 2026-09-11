import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { EditorialHero } from '@/components/EditorialPage';

const sections: { title: string; body?: string; list?: string[]; body2?: string }[] = [
  {
    title: 'Information we collect',
    body: 'This site collects information you provide directly — for example when you subscribe, leave a comment, or send a message. Limited technical information about your device is collected automatically.',
    list: [
      'Email address for newsletter subscriptions',
      'Name and contact details when you reach out',
      'Comments and feedback left on articles',
      'Any other information you choose to provide',
    ],
  },
  {
    title: 'How the information is used',
    body: 'Collected information is used to:',
    list: [
      'Provide, maintain, and improve the site',
      'Send updates you have asked to receive',
      'Respond to your questions and comments',
      'Understand how the site is used',
      'Detect and prevent abuse',
      'Meet legal obligations',
    ],
  },
  {
    title: 'Information sharing',
    body: 'Personal information is never sold or traded. It may be shared only:',
    list: [
      'With your explicit consent',
      'To comply with a valid legal process',
      'To protect the rights, property, or safety of the site and its readers',
      'With service providers who help operate the site, under confidentiality obligations',
    ],
  },
  {
    title: 'Cookies and tracking',
    body: 'Cookies and similar technologies are used to keep the site working, remember preferences, and understand traffic. You can control cookies in your browser, though some features may stop working if you disable them.',
  },
  {
    title: 'Data security',
    body: 'Reasonable technical and organizational measures protect personal information against unauthorized access, alteration, or disclosure. No internet service can promise absolute security.',
  },
  {
    title: 'Your rights',
    body: 'Depending on where you live, you may have the right to:',
    list: [
      'Access a copy of your personal information',
      'Correct or update it',
      'Delete it',
      'Restrict or object to processing',
      'Receive it in a portable format',
      'Withdraw consent at any time',
    ],
  },
  {
    title: "Children's privacy",
    body: 'This site is not intended for children under 13, and information is not knowingly collected from them. If you believe otherwise, please get in touch and it will be removed.',
  },
  {
    title: 'Changes to this policy',
    body: 'This policy may be updated from time to time. Any changes appear on this page with a revised date below.',
  },
  {
    title: 'Contact',
    body: 'Questions about privacy? Email jeffongeri@gmail.com or use the contact form.',
  },
];

const Privacy = () => {
  return (
    <div className="min-h-screen bg-paper">
      <Helmet>
        <title>Privacy Policy | Jefney Ongeri, PA-C</title>
        <meta
          name="description"
          content="How jefneyongeri.com collects, uses, and protects your information."
        />
        <link rel="canonical" href="https://jefneyongeri.com/privacy" />
      </Helmet>
      <Header />

      <main id="main-content">
        <EditorialHero
          kicker="Legal · Policies"
          title="Privacy policy"
          intro="What is collected on this site, why it is collected, and the control you have over it."
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

export default Privacy;
