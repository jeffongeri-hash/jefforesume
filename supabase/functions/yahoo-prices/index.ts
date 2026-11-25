import { corsHeaders } from 'npm:@supabase/supabase-js@2.119.2/cors';
import { normalizeQuote, validateSymbols } from './quote.ts';

const cache = new Map<string, { fetched: number; quote: ReturnType<typeof normalizeQuote> }>();
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

// Public market data only; no account data or provider credentials are accessed.
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'POST required' }, 405);
  let symbols: string[];
  try { symbols = validateSymbols((await req.json()).symbols); }
  catch (error) { return json({ error: error instanceof Error ? error.message : 'Invalid request' }, 400); }
  const quotes: Record<string, ReturnType<typeof normalizeQuote>> = {};
  const errors: Record<string, string> = {};
  // Small batches avoid overwhelming the unofficial Yahoo service.
  for (let start = 0; start < symbols.length; start += 4) {
    await Promise.all(symbols.slice(start, start + 4).map(async symbol => {
      try {
        const saved = cache.get(symbol);
        if (saved && Date.now() - saved.fetched < 60000) { quotes[symbol] = saved.quote; return; }
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1m`, {
          headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' }, signal: AbortSignal.timeout(12000),
        });
        if (!response.ok) {
          const body = await response.text();
          console.error(`Yahoo [${response.status}]: ${body}`);
          throw new Error(`Yahoo [${response.status}]: ${body.slice(0, 300)}`);
        }
        const data = await response.json();
        if (data.chart?.error) throw new Error(JSON.stringify(data.chart.error));
        const quote = normalizeQuote(data.chart?.result?.[0]?.meta ?? {});
        cache.set(symbol, { fetched: Date.now(), quote });
        quotes[symbol] = quote;
      } catch (error) { errors[symbol] = error instanceof Error ? error.message : String(error); }
    }));
  }
  return json({ quotes, errors, fetchedAt: new Date().toISOString() });
});