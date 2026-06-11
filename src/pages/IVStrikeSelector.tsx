import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ExternalLink } from "lucide-react";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID as string;
const AUTH_START_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/schwab-auth/start`;

type OptionRow = {
  symbol: string;
  strike: number;
  bid: number;
  ask: number;
  mid: number;
  iv: number;
  delta: number;
  pop: number; // probability of profit estimate
  dte: number;
};

// Normal CDF approximation (Abramowitz & Stegun)
function normCdf(x: number): number {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}

function calcPOP(strike: number, spot: number, iv: number, dte: number, isCall: boolean): number {
  // For short OTM options: POP ≈ 1 - |delta| ≈ 1 - N(d2)  (for calls)
  const T = dte / 365;
  if (T <= 0 || iv <= 0 || spot <= 0) return 0;
  const r = 0.05;
  const d2 = (Math.log(spot / strike) + (r - 0.5 * iv * iv) * T) / (iv * Math.sqrt(T));
  const itmProb = isCall ? normCdf(d2) : normCdf(-d2);
  return (1 - itmProb) * 100;
}

export default function IVStrikeSelector() {
  const [symbol, setSymbol] = useState("SPY");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [underlying, setUnderlying] = useState<{ price: number } | null>(null);
  const [calls, setCalls] = useState<OptionRow[]>([]);
  const [puts, setPuts] = useState<OptionRow[]>([]);

  const connectSchwab = () => window.open(AUTH_START_URL, "_blank", "width=600,height=700");

  const fetchChain = async () => {
    setLoading(true);
    setError(null);
    setNeedsAuth(false);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("schwab-proxy", {
        body: { action: "chains", symbol: symbol.toUpperCase(), strikeCount: 16 },
      });
      if (fnErr) throw fnErr;
      if (data?.error === "not_authenticated") {
        setNeedsAuth(true);
        return;
      }
      if (data?.error) throw new Error(data.message || data.error);

      const spot = data?.underlyingPrice ?? data?.underlying?.last ?? 0;
      setUnderlying({ price: spot });

      const parseMap = (map: any, isCall: boolean): OptionRow[] => {
        if (!map) return [];
        const rows: OptionRow[] = [];
        for (const expDate of Object.keys(map)) {
          for (const strikeKey of Object.keys(map[expDate])) {
            const opt = map[expDate][strikeKey][0];
            if (!opt) continue;
            const strike = Number(strikeKey);
            const iv = (opt.volatility ?? 0) / 100;
            const dte = opt.daysToExpiration ?? 0;
            rows.push({
              symbol: opt.symbol,
              strike,
              bid: opt.bid ?? 0,
              ask: opt.ask ?? 0,
              mid: ((opt.bid ?? 0) + (opt.ask ?? 0)) / 2,
              iv,
              delta: opt.delta ?? 0,
              pop: calcPOP(strike, spot, iv, dte, isCall),
              dte,
            });
          }
        }
        return rows.sort((a, b) => a.strike - b.strike);
      };

      setCalls(parseMap(data?.callExpDateMap, true));
      setPuts(parseMap(data?.putExpDateMap, false));
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (rows: OptionRow[], label: string) => (
    <Card>
      <CardHeader><CardTitle>{label}</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground border-b">
            <tr>
              <th className="text-left p-2">Strike</th>
              <th className="text-right p-2">Bid</th>
              <th className="text-right p-2">Ask</th>
              <th className="text-right p-2">Mid</th>
              <th className="text-right p-2">IV</th>
              <th className="text-right p-2">Δ</th>
              <th className="text-right p-2">DTE</th>
              <th className="text-right p-2">POP</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.symbol} className="border-b hover:bg-muted/40">
                <td className="p-2 font-medium">${r.strike}</td>
                <td className="text-right p-2">{r.bid.toFixed(2)}</td>
                <td className="text-right p-2">{r.ask.toFixed(2)}</td>
                <td className="text-right p-2">{r.mid.toFixed(2)}</td>
                <td className="text-right p-2">{(r.iv * 100).toFixed(1)}%</td>
                <td className="text-right p-2">{r.delta.toFixed(2)}</td>
                <td className="text-right p-2">{r.dte}</td>
                <td className="text-right p-2 font-medium">{r.pop.toFixed(0)}%</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={8} className="p-4 text-center text-muted-foreground">No data</td></tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <Helmet><title>IV Strike Selector</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">IV Strike Selector</h1>
            <p className="text-sm text-muted-foreground">Live options chain via Schwab API · estimated POP from Black-Scholes</p>
          </div>
          <Button variant="outline" onClick={connectSchwab}>
            <ExternalLink className="mr-2 h-4 w-4" /> Connect Schwab
          </Button>
        </header>

        {needsAuth && (
          <Alert>
            <AlertDescription>
              You're not connected to Schwab yet. Click <strong>Connect Schwab</strong> above, sign in, then retry.
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
        )}

        <Card>
          <CardContent className="pt-6 flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="sym">Symbol</Label>
              <Input
                id="sym"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="SPY"
              />
            </div>
            <Button onClick={fetchChain} disabled={loading || !symbol}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Fetch Chain
            </Button>
            {underlying && (
              <div className="text-sm">
                <span className="text-muted-foreground">Spot: </span>
                <span className="font-semibold">${underlying.price?.toFixed(2)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {renderTable(calls, "Calls")}
          {renderTable(puts, "Puts")}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Estimate, not a guarantee. Real POP = normCDF(d2) from Black-Scholes. Not financial advice.
        </p>
      </div>
    </div>
  );
}