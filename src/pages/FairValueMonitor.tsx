import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export default function FairValueMonitor() {
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    let busy = false;
    const receive = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow ||
          event.data?.type !== 'fair-value-quotes' || busy) return;
      busy = true;
      try {
        const symbols: unknown = event.data.symbols;
        if (!Array.isArray(symbols) || symbols.length > 100) throw new Error('Invalid watchlist');
        const quotes: Record<string, unknown> = {};
        const errors: Record<string, string> = {};
        for (let start = 0; start < symbols.length; start += 20) {
          const batch = symbols.slice(start, start + 20);
          const { data, error } = await supabase.functions.invoke('yahoo-prices', { body: { symbols: batch } });
          if (error) {
            const details = error instanceof FunctionsHttpError ? await error.context.text() : error.message;
            batch.forEach(symbol => { errors[String(symbol)] = details; });
          } else {
            Object.assign(quotes, data?.quotes ?? {});
            Object.assign(errors, data?.errors ?? {});
          }
        }
        frame.current?.contentWindow?.postMessage({ type: 'fair-value-quotes-result', quotes, errors }, window.location.origin);
      } catch (error) {
        frame.current?.contentWindow?.postMessage({ type: 'fair-value-quotes-result', error: error instanceof Error ? error.message : 'Quotes unavailable' }, window.location.origin);
      } finally { busy = false; }
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);
  return <>
    <Helmet>
      <title>Fair Value Monitor | Jefney Ongeri</title>
      <meta name="description" content="Investment research watchlist with valuation targets and timestamped Yahoo Finance prices." />
      <meta name="robots" content="noindex,nofollow" />
    </Helmet>
    <iframe ref={frame} src="/fair-value-monitor.html" title="Fair Value Monitor" className="block h-[100dvh] w-full border-0" />
  </>;
}