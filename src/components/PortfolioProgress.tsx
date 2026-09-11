import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, TrendingDown, Pencil, Check } from 'lucide-react';

interface Holding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  average_cost: number;
  current_price: number | null;
  sector: string | null;
  asset_type: string | null;
}

interface Props {
  holdings: Holding[];
  pricesUpdatedAt?: Date | null;
}

const GOAL_KEY = 'portfolio-goal-target';
const DEFAULT_GOAL = 50000;

const MILESTONES = [0.25, 0.5, 0.75, 1];

const formatCurrency = (value: number, compact = false) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value);

const PortfolioProgress = ({ holdings, pricesUpdatedAt }: Props) => {
  const [goal, setGoal] = useState<number>(DEFAULT_GOAL);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(DEFAULT_GOAL));

  useEffect(() => {
    const stored = localStorage.getItem(GOAL_KEY);
    if (stored && !Number.isNaN(Number(stored))) {
      setGoal(Number(stored));
      setDraft(stored);
    }
  }, []);

  const saveGoal = () => {
    const next = Number(draft.replace(/[^0-9.]/g, ''));
    if (next > 0) {
      setGoal(next);
      localStorage.setItem(GOAL_KEY, String(next));
    }
    setEditing(false);
  };

  const rows = useMemo(() => {
    const list = holdings.map((h) => {
      const price = h.current_price ?? h.average_cost;
      const value = h.shares * price;
      const cost = h.shares * h.average_cost;
      const gain = value - cost;
      return {
        ...h,
        price,
        value,
        cost,
        gain,
        gainPercent: cost > 0 ? (gain / cost) * 100 : 0,
      };
    });
    return list.sort((a, b) => b.value - a.value);
  }, [holdings]);

  const totalValue = rows.reduce((s, r) => s + r.value, 0);
  const totalCost = rows.reduce((s, r) => s + r.cost, 0);
  const totalGain = totalValue - totalCost;
  const goalPercent = goal > 0 ? Math.min((totalValue / goal) * 100, 100) : 0;
  const remaining = Math.max(goal - totalValue, 0);

  const invested = rows.filter((r) => r.asset_type !== 'Money Market');
  const cash = rows.filter((r) => r.asset_type === 'Money Market');
  const cashValue = cash.reduce((s, r) => s + r.value, 0);
  const cashPercent = totalValue > 0 ? (cashValue / totalValue) * 100 : 0;

  const best = invested.reduce<(typeof rows)[number] | null>(
    (top, r) => (!top || r.gainPercent > top.gainPercent ? r : top),
    null
  );

  if (!rows.length) return null;

  return (
    <div className="space-y-6">
      {/* Goal tracker */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-secondary" />
            Progress Toward My Goal
          </CardTitle>
          {editing ? (
            <div className="flex items-center gap-2">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveGoal()}
                className="h-8 w-32"
                inputMode="decimal"
                aria-label="Goal amount"
              />
              <Button size="sm" onClick={saveGoal}>
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="mr-1 h-3.5 w-3.5" /> Set goal
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <p className="text-3xl font-bold text-foreground">{formatCurrency(totalValue)}</p>
            <p className="text-sm text-muted-foreground">
              of {formatCurrency(goal)} — {formatCurrency(remaining)} to go
            </p>
          </div>

          <div className="relative">
            <Progress value={goalPercent} className="h-4" />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              {MILESTONES.map((m) => (
                <span
                  key={m}
                  className={totalValue >= goal * m ? 'font-semibold text-secondary' : ''}
                >
                  {formatCurrency(goal * m, true)}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Goal reached</p>
              <p className="text-lg font-semibold text-foreground">{goalPercent.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Invested</p>
              <p className="text-lg font-semibold text-foreground">{formatCurrency(totalCost)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Unrealized</p>
              <p
                className={`text-lg font-semibold ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {totalGain >= 0 ? '+' : ''}
                {formatCurrency(totalGain)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Cash on hand</p>
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(cashValue)}{' '}
                <span className="text-sm text-muted-foreground">({cashPercent.toFixed(0)}%)</span>
              </p>
            </div>
          </div>

          {pricesUpdatedAt && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
              Live prices as of{' '}
              {pricesUpdatedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </p>
          )}

          {best && (
            <p className="text-sm text-muted-foreground">
              Best performer:{' '}
              <span className="font-semibold text-foreground">{best.symbol}</span> at{' '}
              <span className="font-semibold text-green-600">
                {best.gainPercent >= 0 ? '+' : ''}
                {best.gainPercent.toFixed(1)}%
              </span>{' '}
              since purchase.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Position-by-position tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-secondary" />
            Position Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {rows.map((r) => {
            const weight = totalValue > 0 ? (r.value / totalValue) * 100 : 0;
            const up = r.gain >= 0;
            return (
              <div key={r.id} className="space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="font-bold text-foreground">{r.symbol}</span>
                    <span className="ml-2 text-sm text-muted-foreground">{r.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-foreground">{formatCurrency(r.value)}</span>
                    <span
                      className={`ml-3 inline-flex items-center text-sm font-medium ${up ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {up ? (
                        <TrendingUp className="mr-1 h-3.5 w-3.5" />
                      ) : (
                        <TrendingDown className="mr-1 h-3.5 w-3.5" />
                      )}
                      {up ? '+' : ''}
                      {r.gainPercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress value={weight} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {r.shares.toLocaleString(undefined, { maximumFractionDigits: 4 })} shares @{' '}
                    {formatCurrency(r.average_cost)} avg
                  </span>
                  <span>{weight.toFixed(1)}% of portfolio</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioProgress;
