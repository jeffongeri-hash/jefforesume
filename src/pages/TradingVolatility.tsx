import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';

const TradingVolatility = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Trading Volatility: Illustrated Ebook | Jefney Ongeri</title>
      <meta
        name="description"
        content="An illustrated online ebook on trading volatility: options, variance swaps, exotics, relative value, skew and term structure, with glossary and formula map."
      />
      <link rel="canonical" href="https://jeffongeri.com/trading-volatility" />
      <meta property="og:title" content="Trading Volatility: Illustrated Ebook | Jefney Ongeri" />
      <meta
        property="og:description"
        content="Seven chapters and 35 illustrated sections on options and volatility trading."
      />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary" />
    </Helmet>

    <Header />
    <main id="main-content" className="bg-background">
      <iframe
        src="/embeds/trading-volatility/index.html"
        title="Trading Volatility illustrated ebook"
        className="block h-[calc(100vh-4rem)] min-h-[48rem] w-full border-0 md:h-[calc(100vh-5rem)]"
      />
    </main>
  </div>
);

export default TradingVolatility;