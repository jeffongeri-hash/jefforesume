import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Animated explainers for core personal-finance terms.
 * Each visual is driven by a 0..1 loop that only runs while the card is on screen.
 */

const DURATION = 9000; // ms per loop

const useLoop = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [t, setT] = useState(0);
  const active = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setT(1);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        active.current = entry.isIntersecting;
      },
      { threshold: 0.25 }
    );
    io.observe(el);

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      if (active.current) {
        setT(((now - start) % DURATION) / DURATION);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return { ref, t };
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (t: number, s: number, e: number) => clamp((t - s) / (e - s));
const easeOut = (u: number) => 1 - Math.pow(1 - u, 3);
const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-56 w-full overflow-hidden rounded-lg bg-muted/40 border border-border/60">
    {children}
  </div>
);

/* ---------------- Compound Interest ---------------- */
const CompoundVisual = ({ t }: { t: number }) => {
  const u = easeOut(seg(t, 0.05, 0.85));
  const years = 30 * u;
  const value = 500 * ((Math.pow(1 + 0.08 / 12, 12 * years) - 1) / (0.08 / 12));
  const contributed = 500 * 12 * years;

  const W = 320;
  const H = 150;
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const y = (i / 60) * years;
    const v = 500 * ((Math.pow(1 + 0.08 / 12, 12 * y) - 1) / (0.08 / 12));
    pts.push(`${(i / 60) * W * (years / 30)},${H - (v / 750000) * H}`);
  }

  return (
    <Stage>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-x-0 bottom-10 mx-auto w-[90%]">
        <line x1="0" y1={H} x2={W} y2={H} className="stroke-border" strokeWidth="1" />
        <polyline points={pts.join(' ')} fill="none" className="stroke-primary" strokeWidth="3" strokeLinecap="round" />
        <polyline
          points={`0,${H} ${(W * years) / 30},${H - (contributed / 750000) * H}`}
          fill="none"
          className="stroke-muted-foreground"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
      </svg>
      <div className="absolute left-4 top-3">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Year {Math.round(years)}</p>
        <p className="font-bold text-2xl text-foreground">{money(value)}</p>
        <p className="text-xs text-muted-foreground">You put in {money(contributed)}</p>
      </div>
    </Stage>
  );
};

/* ---------------- 50 / 30 / 20 Budget ---------------- */
const BudgetVisual = ({ t }: { t: number }) => {
  const slices = [
    { label: 'Needs', pct: 50, cls: 'stroke-primary' },
    { label: 'Wants', pct: 30, cls: 'stroke-accent' },
    { label: 'Savings', pct: 20, cls: 'stroke-secondary-foreground' },
  ];
  const R = 52;
  const C = 2 * Math.PI * R;
  let acc = 0;

  return (
    <Stage>
      <div className="absolute inset-0 flex items-center justify-center gap-6">
        <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90">
          {slices.map((s, i) => {
            const start = 0.1 + i * 0.22;
            const u = easeOut(seg(t, start, start + 0.22));
            const dash = (s.pct / 100) * C * u;
            const offset = -(acc / 100) * C;
            acc += s.pct;
            return (
              <circle
                key={s.label}
                cx="70"
                cy="70"
                r={R}
                fill="none"
                className={s.cls}
                strokeWidth="18"
                strokeDasharray={`${dash} ${C}`}
                strokeDashoffset={offset}
              />
            );
          })}
        </svg>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Paycheck $4,000</p>
          {slices.map((s, i) => {
            const start = 0.1 + i * 0.22;
            const on = t > start;
            return (
              <div key={s.label} className={`transition-opacity ${on ? 'opacity-100' : 'opacity-25'}`}>
                <span className="font-semibold text-foreground">{s.pct}%</span>{' '}
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <span className="block text-xs text-muted-foreground">{money(4000 * (s.pct / 100))}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Stage>
  );
};

/* ---------------- Emergency Fund ---------------- */
const EmergencyVisual = ({ t }: { t: number }) => {
  const fill = easeOut(seg(t, 0.08, 0.65));
  const months = fill * 6;
  const shock = t > 0.72 && t < 0.86;

  return (
    <Stage>
      <div className="absolute inset-0 flex items-center justify-center gap-8">
        <div className={`relative h-40 w-28 rounded-b-2xl rounded-t-md border-2 border-border bg-card overflow-hidden ${shock ? 'animate-pulse' : ''}`}>
          <div
            className="absolute inset-x-0 bottom-0 bg-primary/70 transition-none"
            style={{ height: `${fill * 100}%` }}
          />
          {[1, 3, 6].map((m) => (
            <div key={m} className="absolute inset-x-0 border-t border-dashed border-border" style={{ bottom: `${(m / 6) * 100}%` }}>
              <span className="absolute -top-4 right-1 text-[10px] text-muted-foreground">{m}mo</span>
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Cushion</p>
          <p className="font-bold text-2xl text-foreground">{months.toFixed(1)} months</p>
          <p className="text-sm text-muted-foreground">{money(months * 3200)} set aside</p>
          <p className={`mt-2 text-sm font-medium ${shock ? 'text-foreground' : 'text-muted-foreground/50'}`}>
            Car repair hits — fund absorbs it
          </p>
        </div>
      </div>
    </Stage>
  );
};

/* ---------------- Debt Snowball ---------------- */
const DEBTS = [
  { name: 'Credit card', amt: 1200 },
  { name: 'Car loan', amt: 4500 },
  { name: 'Student loan', amt: 9000 },
];

const DebtVisual = ({ t }: { t: number }) => {
  const ballU = seg(t, 0.1, 0.9);
  return (
    <Stage>
      <div className="absolute inset-0 flex flex-col justify-center gap-2 px-6">
        {DEBTS.map((d, i) => {
          const s = 0.15 + i * 0.22;
          const u = easeOut(seg(t, s, s + 0.2));
          const left = d.amt * (1 - u);
          return (
            <div key={d.name} className="relative h-12 overflow-hidden rounded-md border border-border bg-card px-3 flex items-center">
              <div className="absolute inset-y-0 left-0 bg-primary/20" style={{ width: `${(1 - u) * 100}%` }} />
              <div className="relative flex w-full items-center justify-between">
                <span className="text-sm text-muted-foreground">{d.name}</span>
                <span className={`font-semibold ${u > 0.98 ? 'text-primary' : 'text-foreground'}`}>
                  {u > 0.98 ? 'PAID OFF' : money(left)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="absolute bottom-3 rounded-full bg-primary/70"
        style={{
          left: `${8 + ballU * 76}%`,
          width: 14 + ballU * 26,
          height: 14 + ballU * 26,
        }}
      />
    </Stage>
  );
};

/* ---------------- Diversification ---------------- */
const DiversifyVisual = ({ t }: { t: number }) => {
  const cracked = t > 0.22 && t < 0.42;
  const spread = t > 0.42;
  return (
    <Stage>
      <div className="absolute inset-0 flex items-center justify-center">
        {!spread ? (
          <div className={`flex flex-col items-center ${cracked ? 'opacity-40' : ''}`}>
            <div className="flex gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`h-5 w-4 rounded-full ${cracked ? 'bg-destructive/60' : 'bg-primary'}`} />
              ))}
            </div>
            <div className="mt-1 h-12 w-32 rounded-b-3xl border-2 border-border bg-card" />
            <p className="mt-3 text-sm text-muted-foreground">
              {cracked ? 'One basket drops — everything breaks' : 'All the eggs, one basket'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex gap-4">
              {['Stocks', 'Bonds', 'Real estate', 'Cash'].map((label, i) => (
                <div key={label} className="flex flex-col items-center">
                  <div className={`h-5 w-4 rounded-full ${i === 1 ? 'bg-destructive/60' : 'bg-primary'}`} />
                  <div className="mt-1 h-8 w-14 rounded-b-2xl border-2 border-border bg-card" />
                  <span className="mt-1 text-[10px] text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">One dips, the rest hold the line</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

/* ---------------- Inflation ---------------- */
const InflationVisual = ({ t }: { t: number }) => {
  const u = easeOut(seg(t, 0.08, 0.75));
  const years = Math.round(u * 10);
  const price = 100 * Math.pow(1.035, u * 10);
  const items = Math.max(1, Math.round(10 / Math.pow(1.035, u * 10)));
  return (
    <Stage>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Same $100 basket, year +{years}</p>
        <p className="font-bold text-3xl text-foreground">{money(price)}</p>
        <div className="flex gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={`h-6 w-5 rounded-sm ${i < items ? 'bg-primary' : 'bg-border'}`} />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {items} of 10 items still affordable
        </p>
      </div>
    </Stage>
  );
};

/* ---------------- Credit Score ---------------- */
const CreditVisual = ({ t }: { t: number }) => {
  const u = easeOut(seg(t, 0.1, 0.7));
  const score = Math.round(560 + u * 200);
  const R = 60;
  const C = Math.PI * R;
  const frac = (score - 300) / 550;
  const tips = ['Pay on time', 'Keep balances low', 'Keep old cards open'];
  return (
    <Stage>
      <div className="absolute inset-0 flex items-center justify-center gap-6">
        <svg viewBox="0 0 160 90" className="h-32 w-44">
          <path d={`M 20 80 A ${R} ${R} 0 0 1 140 80`} fill="none" className="stroke-border" strokeWidth="14" strokeLinecap="round" />
          <path
            d={`M 20 80 A ${R} ${R} 0 0 1 140 80`}
            fill="none"
            className="stroke-primary"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${C * frac} ${C}`}
          />
          <text x="80" y="72" textAnchor="middle" className="fill-foreground" style={{ font: '700 26px Inter, sans-serif' }}>
            {score}
          </text>
        </svg>
        <ul className="space-y-1">
          {tips.map((tip, i) => (
            <li key={tip} className={`text-sm transition-opacity ${t > 0.15 + i * 0.2 ? 'text-foreground' : 'text-muted-foreground/40'}`}>
              • {tip}
            </li>
          ))}
        </ul>
      </div>
    </Stage>
  );
};

/* ---------------- FIRE ---------------- */
const FireVisual = ({ t }: { t: number }) => {
  const u = easeOut(seg(t, 0.1, 0.6));
  const rate = Math.round(u * 50);
  const age = Math.round(65 - easeOut(seg(t, 0.5, 0.9)) * 23);
  return (
    <Stage>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8">
        <div className="w-full">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Savings rate</span>
            <span>{rate}%</span>
          </div>
          <div className="mt-1 h-4 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full bg-primary" style={{ width: `${rate * 2}%` }} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Work-optional at</p>
          <p className="font-bold text-4xl text-foreground">{age}</p>
        </div>
      </div>
    </Stage>
  );
};

/* ---------------- Data ---------------- */
type Item = {
  term: string;
  short: string;
  body: string;
  takeaway: string;
  render: (t: number) => JSX.Element;
};

const ITEMS: Item[] = [
  {
    term: 'Compound Interest',
    short: 'The snowball effect',
    body:
      'Compounding is what happens when the returns your money earns start earning returns of their own. Investing $500 a month at an 8% average annual return grows to roughly $745,000 over 30 years — even though you only deposited $180,000. The gap is entirely growth on top of growth.',
    takeaway: 'Time in the market matters more than the size of any single contribution.',
    render: (t) => <CompoundVisual t={t} />,
  },
  {
    term: '50 / 30 / 20 Budgeting',
    short: 'Split your paycheck',
    body:
      'A simple framework for take-home pay: 50% to needs (housing, food, insurance, minimum debt payments), 30% to wants, and 20% to savings and extra debt payoff. It is a starting ratio, not a rule — a high earner in a low-cost city can push savings well past 20%.',
    takeaway: 'Automate the 20% first, then spend what is left without guilt.',
    render: (t) => <BudgetVisual t={t} />,
  },
  {
    term: 'Emergency Fund',
    short: 'Your financial shock absorber',
    body:
      'Cash held in a high-yield savings account, separate from investments, covering three to six months of essential expenses. Its job is not to earn a return — it is to keep a car repair, a job loss, or a medical bill from becoming credit card debt or a forced sale of investments.',
    takeaway: 'Build one month first, then keep going until you hit six.',
    render: (t) => <EmergencyVisual t={t} />,
  },
  {
    term: 'Debt Snowball',
    short: 'Crush your debt',
    body:
      'Pay minimums on everything, then throw every extra dollar at the smallest balance. When it clears, roll that payment into the next-smallest. The avalanche method targets the highest interest rate instead and saves more mathematically, but the snowball wins on momentum.',
    takeaway: 'The best payoff plan is the one you actually stick with.',
    render: (t) => <DebtVisual t={t} />,
  },
  {
    term: 'Diversification',
    short: 'More than one basket',
    body:
      'Spreading money across different assets, sectors, and geographies so that no single failure can sink the whole portfolio. A broad index fund is diversification in one purchase; a portfolio concentrated in a handful of names in one industry is not, no matter how many tickers it holds.',
    takeaway: 'Diversification does not maximize returns — it limits how wrong you can be.',
    render: (t) => <DiversifyVisual t={t} />,
  },
  {
    term: 'Inflation',
    short: 'The silent tax',
    body:
      'The steady rise in prices that shrinks what each dollar buys. At about 3.5% a year, a basket costing $100 today runs roughly $141 in a decade. Cash sitting in a checking account loses purchasing power every year, which is the core argument for investing money you will not need soon.',
    takeaway: 'Your savings need a return above inflation just to stand still.',
    render: (t) => <InflationVisual t={t} />,
  },
  {
    term: 'Credit Score',
    short: 'Your financial report card',
    body:
      'A 300–850 number lenders use to price risk. Payment history and credit utilization drive most of it, with length of history, credit mix, and new inquiries filling in the rest. The difference between a 620 and a 760 on a mortgage can be tens of thousands of dollars over the loan.',
    takeaway: 'Pay on time, stay under 30% of your limits, and let accounts age.',
    render: (t) => <CreditVisual t={t} />,
  },
  {
    term: 'FIRE',
    short: 'Financial independence, retire early',
    body:
      'A movement built on a high savings rate and low fixed costs. The common target is 25 times annual expenses invested, drawn down at roughly 4% a year. Saving 50% of income instead of 10% can move work-optional from the mid-sixties into the early forties.',
    takeaway: 'The savings rate, not the salary, sets the timeline.',
    render: (t) => <FireVisual t={t} />,
  },
];

const ExplainerCard = ({ item }: { item: Item }) => {
  const { ref, t } = useLoop();
  return (
    <Card className="overflow-hidden">
      <div ref={ref}>{item.render(t)}</div>
      <CardContent className="pt-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.short}</p>
        <h3 className="mt-1 text-xl font-semibold text-foreground">{item.term}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
        <p className="mt-3 border-l-2 border-primary pl-3 text-sm font-medium text-foreground">{item.takeaway}</p>
      </CardContent>
    </Card>
  );
};

const FinanceExplainers = () => (
  <section aria-labelledby="finance-explainers" className="mb-12">
    <div className="mb-8 text-center">
      <h2 id="finance-explainers" className="text-3xl font-bold text-foreground">
        Financial Terms, Explained
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
        The concepts behind the portfolio above — each one animated so the idea lands in a few seconds.
      </p>
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {ITEMS.map((item) => (
        <ExplainerCard key={item.term} item={item} />
      ))}
    </div>
  </section>
);

export default FinanceExplainers;
