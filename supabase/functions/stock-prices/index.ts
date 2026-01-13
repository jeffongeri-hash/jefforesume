import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StockQuote {
  symbol: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FINNHUB_API_KEY = Deno.env.get("FINNHUB_API_KEY");
    if (!FINNHUB_API_KEY) {
      throw new Error("FINNHUB_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all holdings
    const { data: holdings, error: holdingsError } = await supabase
      .from("holdings")
      .select("id, symbol, current_price");

    if (holdingsError) throw holdingsError;
    if (!holdings || holdings.length === 0) {
      return new Response(JSON.stringify({ prices: [], updated: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch quotes for each symbol
    const quotes: StockQuote[] = [];
    const updates: { id: string; current_price: number }[] = [];

    for (const holding of holdings) {
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${holding.symbol}&token=${FINNHUB_API_KEY}`
        );

        if (!response.ok) {
          console.error(`Failed to fetch quote for ${holding.symbol}`);
          continue;
        }

        const data = await response.json();

        // c = current price, d = change, dp = percent change
        // h = high, l = low, o = open, pc = previous close
        if (data.c && data.c > 0) {
          quotes.push({
            symbol: holding.symbol,
            currentPrice: data.c,
            change: data.d || 0,
            percentChange: data.dp || 0,
            high: data.h || data.c,
            low: data.l || data.c,
            open: data.o || data.c,
            previousClose: data.pc || data.c,
          });

          // Only update if price changed
          if (holding.current_price !== data.c) {
            updates.push({ id: holding.id, current_price: data.c });
          }
        }

        // Rate limiting - Finnhub free tier is 60 calls/minute
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (err) {
        console.error(`Error fetching ${holding.symbol}:`, err);
      }
    }

    // Update prices in database
    if (updates.length > 0) {
      for (const update of updates) {
        await supabase
          .from("holdings")
          .update({ current_price: update.current_price, updated_at: new Date().toISOString() })
          .eq("id", update.id);
      }
    }

    return new Response(
      JSON.stringify({
        prices: quotes,
        updated: updates.length,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Stock prices error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
