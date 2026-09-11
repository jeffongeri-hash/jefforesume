import { useEffect, useRef, useState } from 'react';

/**
 * Shared animated visuals for the personal-finance articles.
 * Each visual is driven by a 0..1 loop that only advances while on screen.
 */

const DURATION = 10000;

const useLoop = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [t, setT] = useState(0);
  const active = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
      if (active.current) setT(((now - start) % DURATION) / DURATION);
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
  <div className="relative h-60 w-full overflow-hidden rounded-lg border border-border/60 bg-muted/40">
    {children}
  </div>
);

const Panel = ({
  title,
  caption,
  takeaway,
  children,
}: {
  title: string;
  caption: string;
  takeaway: string;
  children: (t: number) => React.ReactNode;
}) => {
  const { ref, t } = useLoop();
  return (
    <div ref={ref} className="not-prose my-8 rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-1 text-lg font-bold text-foreground">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{caption}</p>
      {children(t)}
      <p className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-foreground">
        {takeaway}
      </p>
    </div>
  );
};

/* ============ Retirement accounts ============ */

const RetirementTimeline = ({ t }: { t: number }) => {
  const u = easeOut(seg(t, 0.05, 0.85));
  const ages = [25, 35, 45, 55, 65];
  const targets = [8000, 45000, 130000, 280000, 480000];
  const max = 480000;
  const balance = max * u;

  return (
    <Stage>
      <div className="absolute inset-x-0 bottom-14 flex h-36 items-end justify-center gap-6 px-6">
        {ages.map((age, i) => {
          const bu = easeOut(clamp((u - i * 0.16) / 0.32));
          const h = (targets[i] / max) * 100 * bu;
          return (
            <div key={age} className="flex w-14 flex-col items-center">
              <div
                className={`w-full rounded-t-md ${i === ages.length - 1 ? 'bg-primary' : 'bg-primary/50'}`}
                style={{ height: `${h}%`, minHeight: 2 }}
              />
              <span className="mt-2 text-xs text-muted-foreground">Age {age}</span>
            </div>
          );
        })}
      </div>
      <div className="absolute inset-x-0 bottom-3 text-center">
        <div className="text-2xl font-bold text-foreground">{money(balance)}</div>
        <div className="text-xs text-muted-foreground">projected balance at retirement</div>
      </div>
    </Stage>
  );
};

const MatchVisual = ({ t }: { t: number }) => {
  const u = easeOut(seg(t, 0.1, 0.7));
  const you = 6000 * u;
  const match = 3000 * easeOut(seg(t, 0.35, 0.9));
  const total = you + match;
  return (
    <Stage>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8">
        <div className="w-full max-w-sm">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>You contribute (6%)</span>
            <span>{money(you)}</span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(you / 9000) * 100}%` }} />
          </div>
        </div>
        <div className="w-full max-w-sm">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>Employer match (3%)</span>
            <span>{money(match)}</span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-secondary"
              style={{ width: `${(match / 9000) * 100}%` }}
            />
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{money(total)}</div>
          <div className="text-xs text-muted-foreground">invested this year</div>
        </div>
      </div>
    </Stage>
  );
};

export const RetirementAnimations = () => (
  <>
    <Panel
      title="Starting early does most of the work"
      caption="Steady contributions from age 25, growing at roughly 7% a year."
      takeaway="The first decade of contributions ends up being the largest share of the final balance — time in the market beats timing it."
    >
      {(t) => <RetirementTimeline t={t} />}
    </Panel>
    <Panel
      title="The employer match is free money"
      caption="A typical 401(k) match: your employer adds 50 cents for every dollar you put in, up to 6% of pay."
      takeaway="Contribute at least enough to capture the full match. Leaving it on the table is a guaranteed 50% loss on that portion of your pay."
    >
      {(t) => <MatchVisual t={t} />}
    </Panel>
  </>
);

/* ============ Stock market basics ============ */

const CandleVisual = ({ t }: { t: number }) => {
  const u = seg(t, 0.05, 0.85);
  const seed = [4, 6, 3, 8, 5, 9, 7, 11, 8, 13, 10, 15, 12, 17];
  return (
    <Stage>
      <div className="absolute inset-x-0 bottom-10 flex h-40 items-end justify-center gap-2 px-6">
        {seed.map((v, i) => {
          const bu = easeOut(clamp((u - i / seed.length) * 6));
          const up = v > (seed[i - 1] ?? v);
          return (
            <div
              key={i}
              className={`w-4 rounded-sm ${up ? 'bg-primary' : 'bg-muted-foreground/50'}`}
              style={{ height: `${(v / 17) * 100 * bu}%`, minHeight: 2 }}
            />
          );
        })}
      </div>
      <div className="absolute inset-x-0 bottom-3 text-center text-xs text-muted-foreground">
        Day-to-day noise, long-term direction
      </div>
    </Stage>
  );
};

const OwnershipVisual = ({ t }: { t: number }) => {
  const u = easeOut(seg(t, 0.1, 0.6));
  const R = 60;
  const circ = 2 * Math.PI * R;
  return (
    <Stage>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <svg viewBox="0 0 160 160" className="h-36 w-36 -rotate-90">
          <circle cx="80" cy="80" r={R} className="fill-none stroke-muted" strokeWidth="18" />
          <circle
            cx="80"
            cy="80"
            r={R}
            className="fill-none stroke-primary"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={`${circ * 0.18 * u} ${circ}`}
          />
        </svg>
        <div className="-mt-4 text-center">
          <div className="text-sm font-semibold text-foreground">One share = one slice</div>
          <div className="text-xs text-muted-foreground">
            You own a piece of the company's profits, not a lottery ticket
          </div>
        </div>
      </div>
    </Stage>
  );
};

const BasketVisual = ({ t }: { t: number }) => {
  const spread = seg(t, 0.45, 0.75);
  const crack = t > 0.3 && t < 0.45;
  const single = 1 - spread;
  return (
    <Stage>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex w-full max-w-md items-end justify-center gap-8">
          <div
            className="flex flex-col items-center"
            style={{ opacity: single, transform: `translateX(${crack ? Math.sin(t * 400) * 4 : 0}px)` }}
          >
            <div className="mb-1 grid grid-cols-3 gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className={`block h-4 w-3 rounded-full ${crack ? 'bg-muted' : 'bg-primary/70'}`}
                />
              ))}
            </div>
            <div className="h-10 w-20 rounded-b-xl border-2 border-t-0 border-primary" />
            <span className="mt-2 text-xs text-muted-foreground">One basket</span>
          </div>
          <div className="flex gap-4" style={{ opacity: spread }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="mb-1 block h-4 w-3 rounded-full bg-primary/70" />
                <div className="h-8 w-10 rounded-b-lg border-2 border-t-0 border-primary" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-3 text-center text-xs text-muted-foreground">
        Spreading holdings turns a disaster into a dent
      </div>
    </Stage>
  );
};

export const StockAnimations = () => (
  <>
    <Panel
      title="What the market actually does"
      caption="Prices bounce daily, but broad ownership has trended upward over long stretches."
      takeaway="Judge your portfolio in years, not days. Short-term swings are the price of admission for long-term growth."
    >
      {(t) => <CandleVisual t={t} />}
    </Panel>
    <Panel
      title="A share is a slice of a business"
      caption="Buying stock makes you a part-owner entitled to a share of future earnings."
      takeaway="If you wouldn't want to own the business for ten years, you probably shouldn't own the stock for ten minutes."
    >
      {(t) => <OwnershipVisual t={t} />}
    </Panel>
    <Panel
      title="Diversification in one picture"
      caption="Everything in one company versus the same money spread across many."
      takeaway="Diversification doesn't raise your best-case return — it removes the outcomes that end the game."
    >
      {(t) => <BasketVisual t={t} />}
    </Panel>
  </>
);

/* ============ FIRE ============ */

const SavingsRateVisual = ({ t }: { t: number }) => {
  const u = easeOut(seg(t, 0.05, 0.8));
  const rate = Math.round(10 + 40 * u);
  const years = Math.round(51 - 0.86 * (rate - 10) * 0.98 - (rate >= 50 ? 0 : 0));
  const R = 60;
  const circ = 2 * Math.PI * R;
  return (
    <Stage>
      <div className="absolute inset-0 flex items-center justify-center gap-8">
        <div className="relative">
          <svg viewBox="0 0 160 160" className="h-36 w-36 -rotate-90">
            <circle cx="80" cy="80" r={R} className="fill-none stroke-muted" strokeWidth="16" />
            <circle
              cx="80"
              cy="80"
              r={R}
              className="fill-none stroke-primary"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={`${(circ * rate) / 100} ${circ}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{rate}%</span>
            <span className="text-xs text-muted-foreground">savings rate</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground">{Math.max(years, 17)}</div>
          <div className="text-xs text-muted-foreground">years to financial independence</div>
        </div>
      </div>
    </Stage>
  );
};

const FIRE_TYPES = [
  { name: 'Lean FIRE', desc: 'Bare-bones spending, earliest exit', pct: 0.45 },
  { name: 'Coast FIRE', desc: 'Save hard early, let it compound', pct: 0.6 },
  { name: 'Barista FIRE', desc: 'Part-time work covers the gap', pct: 0.7 },
  { name: 'Fat FIRE', desc: 'Bigger nest egg, no lifestyle cuts', pct: 0.95 },
];

const FireTypesVisual = ({ t }: { t: number }) => (
  <Stage>
    <div className="absolute inset-0 flex flex-col justify-center gap-3 px-6">
      {FIRE_TYPES.map((item, i) => {
        const start = 0.05 + i * 0.15;
        const u = easeOut(seg(t, start, start + 0.25));
        return (
          <div key={item.name} className="flex items-center gap-4" style={{ opacity: u }}>
            <span className="w-24 shrink-0 text-sm font-semibold text-foreground">{item.name}</span>
            <div className="flex-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${item.pct * u * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{item.desc}</span>
            </div>
          </div>
        );
      })}
    </div>
  </Stage>
);

export const FireAnimations = () => (
  <>
    <Panel
      title="Your savings rate sets the clock"
      caption="The share of your take-home pay you keep is the single biggest lever on your retirement date."
      takeaway="Going from a 10% to a 50% savings rate cuts decades off the timeline — spending less does double duty by lowering the target too."
    >
      {(t) => <SavingsRateVisual t={t} />}
    </Panel>
    <Panel
      title="Four flavors of FIRE"
      caption="Relative size of the nest egg each version requires."
      takeaway="FIRE isn't one finish line. Pick the version that matches the life you actually want to fund."
    >
      {(t) => <FireTypesVisual t={t} />}
    </Panel>
  </>
);
