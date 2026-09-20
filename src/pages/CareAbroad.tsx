import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';

const CareAbroad = () => (
  <div className="min-h-screen bg-paper">
    <Helmet>
      <title>Care Abroad Guide | Jefney Ongeri</title>
      <meta
        name="description"
        content="A practical guide to planning diagnostic care, screening, and treatment abroad, including routes, advertised prices, safety planning, and budgeting."
      />
      <link rel="canonical" href="https://jeffongeri.com/care-abroad" />
      <meta property="og:title" content="Care Abroad Guide | Jefney Ongeri" />
      <meta
        property="og:description"
        content="Plan international diagnostic care with route comparisons, pricing, safety guidance, and budgeting tools."
      />
      <meta property="og:type" content="article" />
    </Helmet>

    <Header />
    <main id="main-content" className="bg-paper">
      <iframe
        src="/embeds/care-abroad-guide.html"
        title="Care Abroad international diagnostic care guide"
        className="block h-[calc(100vh-4rem)] min-h-[48rem] w-full border-0 md:h-[calc(100vh-5rem)]"
      />
    </main>
  </div>
);

export default CareAbroad;