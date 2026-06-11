import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const SCHWAB_TOKEN_URL = "https://api.schwabapi.com/v1/oauth/token";
const SCHWAB_API_BASE = "https://api.schwabapi.com";

async function getValidAccessToken(supabase: any, clientId: string, clientSecret: string): Promise<string | null> {
  const { data: rows, error } = await supabase
    .from("schwab_tokens")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);
  if (error || !rows || rows.length === 0) return null;
  const row = rows[0];

  const expiresAt = new Date(row.expires_at).getTime();
  if (expiresAt - Date.now() > 120_000) return row.access_token;

  const basic = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch(SCHWAB_TOKEN_URL, {
    method: "POST",
    headers: { "Authorization": `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: row.refresh_token }),
  });
  if (!res.ok) { console.error("Refresh failed:", await res.text()); return null; }
  const tokens = await res.json();
  const newExpiresAt = new Date(Date.now() + (tokens.expires_in ?? 1800) * 1000).toISOString();
  await supabase.from("schwab_tokens").update({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token ?? row.refresh_token,
    expires_at: newExpiresAt,
  }).eq("id", row.id);
  return tokens.access_token;
}

function jsonResp(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Historical Volatility (annualized) from close prices
function calcHV(closes: number[], window = 20): number {
  if (closes.length < window + 1) return 0;
  const slice = closes.slice(-window - 1);
  const rets: number[] = [];
  for (let i = 1; i < slice.length; i++) rets.push(Math.log(slice[i] / slice[i - 1]));
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
  const variance = rets.reduce((a, b) => a + (b - mean) ** 2, 0) / (rets.length - 1);
  // 5-min bars: ~78 per day, 252 days/yr => sqrt(78*252) for 5min, but we use daily-equivalent.
  // Treat each bar as one period; annualize with sqrt(78*252).
  return Math.sqrt(variance) * Math.sqrt(78 * 252) * 100;
}

function transformChain(d: any) {
  const flatten = (map: any) => {
    const rows: any[] = [];
    if (!map) return rows;
    for (const expDate of Object.keys(map)) {
      for (const strikeKey of Object.keys(map[expDate])) {
        const opt = map[expDate][strikeKey][0];
        if (!opt) continue;
        const bid = opt.bid ?? 0, ask = opt.ask ?? 0, mid = +(((bid + ask) / 2) || 0).toFixed(2);
        rows.push({
          strike: Number(strikeKey),
          bid, ask, mid,
          iv: opt.volatility ?? 0,
          oi: opt.openInterest ?? 0,
          dte: opt.daysToExpiration ?? 0,
          inTheMoney: !!opt.inTheMoney,
          classification: opt.inTheMoney ? "ITM" : "OTM",
          greeks: {
            delta: opt.delta ?? 0,
            gamma: opt.gamma ?? 0,
            theta: opt.theta ?? 0,
            vega: opt.vega ?? 0,
            rho: opt.rho ?? 0,
          },
          pnl: {
            long: { profitTarget: +(mid * 2).toFixed(2), stopLoss: +(mid * 0.5).toFixed(2),
                    breakeven: +(Number(strikeKey) + mid).toFixed(2) },
            short: { profitTarget: +(mid * 0.5).toFixed(2), stopLoss: +(mid * 2).toFixed(2) },
          },
        });
      }
    }
    return rows.sort((a, b) => a.strike - b.strike);
  };
  return {
    underlyingSymbol: d.symbol ?? d.underlying?.symbol ?? "",
    underlyingPrice: d.underlyingPrice ?? d.underlying?.last ?? 0,
    volatility: d.volatility ?? d.underlying?.totalVolume ?? 0,
    numberOfContracts: d.numberOfContracts ?? 0,
    calls: flatten(d.callExpDateMap),
    puts: flatten(d.putExpDateMap),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const clientId = Deno.env.get("SCHWAB_CLIENT_ID");
    const clientSecret = Deno.env.get("SCHWAB_CLIENT_SECRET");
    if (!clientId || !clientSecret) return jsonResp({ error: "Schwab credentials not configured" }, 500);

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const accessToken = await getValidAccessToken(supabase, clientId, clientSecret);
    if (!accessToken) return jsonResp({ error: "not_authenticated", message: "Connect Schwab account first." }, 401);

    const url = new URL(req.url);
    const route = url.pathname.split("/").pop();
    const auth = { "Authorization": `Bearer ${accessToken}`, "Accept": "application/json" };

    // ── /quote?symbol=SPY ─────────────────────────────────────────────────────
    if (route === "quote") {
      const symbol = url.searchParams.get("symbol")?.toUpperCase() ?? "";
      const r = await fetch(`${SCHWAB_API_BASE}/marketdata/v1/quotes?symbols=${encodeURIComponent(symbol)}`, { headers: auth });
      const d = await r.json();
      const q = d?.[symbol] ?? Object.values(d ?? {})[0] ?? {};
      const quote = q.quote ?? q;
      return jsonResp({
        symbol,
        price: quote.lastPrice ?? quote.mark ?? quote.closePrice ?? 0,
        iv: (quote.volatility ?? quote.impliedYield ?? 0),
        high52w: quote["52WeekHigh"] ?? 0,
        low52w: quote["52WeekLow"] ?? 0,
      });
    }

    // ── /vix ──────────────────────────────────────────────────────────────────
    if (route === "vix") {
      const sym = "$VIX";
      const r = await fetch(`${SCHWAB_API_BASE}/marketdata/v1/quotes?symbols=${encodeURIComponent(sym)}`, { headers: auth });
      const d = await r.json();
      const q = (d?.[sym] ?? Object.values(d ?? {})[0] ?? {}).quote ?? {};
      return jsonResp({ vix: q.lastPrice ?? q.mark ?? 0 });
    }

    // ── /history?symbol=SPY&period=10&periodType=day&freq=5&freqType=minute ──
    if (route === "history") {
      const symbol = url.searchParams.get("symbol")?.toUpperCase() ?? "";
      const period = url.searchParams.get("period") ?? "10";
      const periodType = url.searchParams.get("periodType") ?? "day";
      const freq = url.searchParams.get("freq") ?? "5";
      const freqType = url.searchParams.get("freqType") ?? "minute";
      const params = new URLSearchParams({
        symbol, periodType, period, frequencyType: freqType, frequency: freq, needExtendedHoursData: "false",
      });
      const r = await fetch(`${SCHWAB_API_BASE}/marketdata/v1/pricehistory?${params}`, { headers: auth });
      const d = await r.json();
      const candles = d?.candles ?? [];
      const closes = candles.map((c: any) => c.close);
      const highs = candles.map((c: any) => c.high);
      const lows = candles.map((c: any) => c.low);
      const hv20 = calcHV(closes, 20);
      // simple S/R: recent 5-day swing
      const recent = candles.slice(-78 * 5);
      const support = recent.length ? Math.min(...recent.map((c: any) => c.low)) : 0;
      const resistance = recent.length ? Math.max(...recent.map((c: any) => c.high)) : 0;
      // intraday range today
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const todays = candles.filter((c: any) => c.datetime >= today.getTime());
      const intradayRange = todays.length
        ? Math.max(...todays.map((c: any) => c.high)) - Math.min(...todays.map((c: any) => c.low))
        : 0;
      return jsonResp({ hv20, support, resistance, intradayRange });
    }

    // ── /chain?symbol=SPY&dte=30&strikes=20&type=ALL ─────────────────────────
    if (route === "chain" || route === "chains") {
      const symbol = url.searchParams.get("symbol")?.toUpperCase() ?? "";
      const strikeCount = url.searchParams.get("strikes") ?? "20";
      const contractType = url.searchParams.get("type") ?? "ALL";
      const dte = Number(url.searchParams.get("dte") ?? "30");
      const from = new Date(); const to = new Date(Date.now() + dte * 86400 * 1000);
      const params = new URLSearchParams({
        symbol, contractType, strikeCount, includeUnderlyingQuote: "true",
        fromDate: from.toISOString().slice(0, 10),
        toDate: to.toISOString().slice(0, 10),
      });
      const r = await fetch(`${SCHWAB_API_BASE}/marketdata/v1/chains?${params}`, { headers: auth });
      const d = await r.json();
      return jsonResp(transformChain(d));
    }

    // POST fallback (legacy action style)
    if (req.method === "POST") {
      const { action, symbol, contractType = "ALL", strikeCount = 20 } = await req.json();
      if (action === "chains") {
        const params = new URLSearchParams({
          symbol, contractType, strikeCount: String(strikeCount), includeUnderlyingQuote: "true",
        });
        const r = await fetch(`${SCHWAB_API_BASE}/marketdata/v1/chains?${params}`, { headers: auth });
        return new Response(await r.text(), { status: r.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    return jsonResp({ error: "Unknown route", routes: ["/quote", "/vix", "/history", "/chain"] }, 404);
  } catch (err) {
    console.error("schwab-proxy error:", err);
    return jsonResp({ error: String(err) }, 500);
  }
});
