import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';

const SumerlinTrails = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Sumerlin Trails Home Project Guide | Jefney Ongeri</title>
      <meta
        name="description"
        content="A practical Sumerlin Trails home project guide covering Fishers contractors, project costs, HOA rules, planning checklists, and local property resources."
      />
      <link rel="canonical" href="https://jeffongeri.com/sumerlin-trails" />
      <meta property="og:title" content="Sumerlin Trails Home Project Guide | Jefney Ongeri" />
      <meta
        property="og:description"
        content="Plan Sumerlin Trails home projects with local contractor research, cost estimates, HOA guidance, and an interactive checklist."
      />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary" />
    </Helmet>

    <Header />
    <main id="main-content" className="bg-background">
      <iframe
        src="/embeds/sumerlin-trails-guide.html?v=2"
        title="Sumerlin Trails home projects, contractors, and HOA guide"
        className="block h-[calc(100vh-4rem)] min-h-[48rem] w-full border-0 md:h-[calc(100vh-5rem)]"
      />
    </main>
  </div>
);

export default SumerlinTrails;