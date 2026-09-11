import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp } from 'lucide-react';
import imgFinanceRetirement from '@/assets/blog/finance-retirement.jpg';
import imgFinanceStocks from '@/assets/blog/finance-stocks.jpg';
import imgFinanceFire from '@/assets/blog/finance-fire.jpg';

const guides = [
  {
    title: 'Retirement Accounts, Explained — 401(k), IRA & the Employer Match',
    excerpt:
      'Animated walk-through of how retirement accounts actually grow, why the first decade of contributions matters most, and how to capture every dollar of an employer match.',
    image: imgFinanceRetirement,
    slug: 'retirement-accounts-401k-ira-explained',
  },
  {
    title: 'Stock Market Basics — Owning a Piece, Not Placing a Bet',
    excerpt:
      'What a share actually is, why daily price swings are noise, and an animated look at what diversification does to your downside.',
    image: imgFinanceStocks,
    slug: 'stock-market-basics-owning-a-piece',
  },
  {
    title: 'The Four Types of FIRE — Financial Independence on Your Terms',
    excerpt:
      'Your savings rate sets the clock. An animated breakdown of Lean, Coast, Barista, and Fat FIRE, and how to pick the one that fits your life.',
    image: imgFinanceFire,
    slug: 'four-types-of-fire-explained',
  },
];

const FinanceGuides = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Finance Guides | Jefney Ongeri</title>
        <meta
          name="description"
          content="Animated guides to retirement accounts, stock market basics, and the four types of FIRE — plain-language personal finance for clinicians."
        />
        <link rel="canonical" href="https://jeffongeri.com/finance-guides" />
      </Helmet>
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <TrendingUp className="h-3.5 w-3.5 mr-1" /> Investments
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Finance Guides
          </h1>
          <p className="text-lg text-muted-foreground">
            Short, animated explainers on the money decisions that matter most — built to be
            understood in a few minutes, not a semester.
          </p>
          <Link
            to="/investments"
            className="inline-flex items-center gap-1 text-secondary hover:underline mt-6"
          >
            Back to portfolio <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {guides.map((g) => (
            <Link key={g.slug} to={`/blog/${g.slug}`} className="group">
              <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={g.image}
                    alt={g.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors">
                    {g.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{g.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-secondary mt-4">
                    Read guide <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FinanceGuides;
