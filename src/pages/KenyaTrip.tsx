import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';

const KenyaTrip = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Kenya Trip Guide: UK Stop & Nairobi | Jefney Ongeri</title>
      <meta
        name="description"
        content="An interactive Kenya trip guide covering a UK stop, Nairobi planning, entry and health requirements, safety, money, transportation, and emergency contacts."
      />
      <link rel="canonical" href="https://jeffongeri.com/kenya-trip" />
      <meta property="og:title" content="Kenya Trip Guide: UK Stop & Nairobi | Jefney Ongeri" />
      <meta
        property="og:description"
        content="Plan a UK stop and Nairobi trip with an interactive checklist, timeline, currency converter, safety guidance, and emergency contacts."
      />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary" />
    </Helmet>

    <Header />
    <main id="main-content" className="bg-background">
      <iframe
        src="/embeds/kenya-trip-guide.html"
        title="Kenya trip guide for a UK stop and Nairobi"
        className="block h-[calc(100vh-4rem)] min-h-[48rem] w-full border-0 md:h-[calc(100vh-5rem)]"
      />
    </main>
  </div>
);

export default KenyaTrip;