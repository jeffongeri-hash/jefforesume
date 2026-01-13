import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    // Fetch portfolio data from Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [holdingsRes, tradesRes] = await Promise.all([
      supabase.from("holdings").select("*").order("symbol"),
      supabase.from("trades").select("*").order("trade_date", { ascending: false }).limit(20),
    ]);

    const holdings = holdingsRes.data || [];
    const trades = tradesRes.data || [];

    // Calculate portfolio metrics
    const totalValue = holdings.reduce((sum: number, h: any) => {
      const price = h.current_price || h.average_cost;
      return sum + h.shares * price;
    }, 0);

    const totalCost = holdings.reduce((sum: number, h: any) => sum + h.shares * h.average_cost, 0);
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent = totalCost > 0 ? ((totalGainLoss / totalCost) * 100).toFixed(2) : "0";

    // Build sector allocation
    const sectorMap: Record<string, number> = {};
    holdings.forEach((h: any) => {
      const price = h.current_price || h.average_cost;
      const value = h.shares * price;
      const sector = h.sector || "Other";
      sectorMap[sector] = (sectorMap[sector] || 0) + value;
    });

    const sectorAllocation = Object.entries(sectorMap)
      .map(([sector, value]) => `${sector}: $${value.toFixed(2)} (${((value / totalValue) * 100).toFixed(1)}%)`)
      .join(", ");

    // Build holdings summary
    const holdingsSummary = holdings
      .map((h: any) => {
        const currentPrice = h.current_price || h.average_cost;
        const value = h.shares * currentPrice;
        const gainLoss = value - h.shares * h.average_cost;
        const gainLossPercent = ((gainLoss / (h.shares * h.average_cost)) * 100).toFixed(2);
        return `${h.symbol} (${h.name}): ${h.shares} shares at $${currentPrice.toFixed(2)}, value $${value.toFixed(2)}, gain/loss ${gainLoss >= 0 ? "+" : ""}$${gainLoss.toFixed(2)} (${gainLossPercent}%), sector: ${h.sector || "N/A"}`;
      })
      .join("\n");

    // Build recent trades summary
    const recentTradesSummary = trades
      .slice(0, 10)
      .map((t: any) => `${t.trade_date}: ${t.trade_type} ${t.shares} shares of ${t.symbol} (${t.name}) at $${t.price.toFixed(2)}, total $${t.total_value.toFixed(2)}`)
      .join("\n");

    const systemPrompt = `You are Jefney Ongeri's personal investment portfolio assistant. You have access to real-time portfolio data and can answer questions about holdings, performance, sector allocation, and trade history.

PORTFOLIO OVERVIEW:
- Total Portfolio Value: $${totalValue.toFixed(2)}
- Total Cost Basis: $${totalCost.toFixed(2)}
- Total Gain/Loss: ${totalGainLoss >= 0 ? "+" : ""}$${totalGainLoss.toFixed(2)} (${totalGainLossPercent}%)
- Sector Allocation: ${sectorAllocation || "No holdings"}

CURRENT HOLDINGS:
${holdingsSummary || "No holdings in portfolio"}

RECENT TRADES:
${recentTradesSummary || "No recent trades"}

INVESTMENT PHILOSOPHY:
Jefney's approach blends trend-following strategies with fundamental analysis. Key ratios analyzed include P/E Ratio, Debt-to-Equity, ROE (Return on Equity), ROA (Return on Assets), and P/S Ratio.

GUIDELINES:
- Answer questions about the portfolio clearly and concisely
- Provide specific numbers when asked about values, returns, or allocations
- If asked about stocks not in the portfolio, clarify they are not currently held
- For investment advice questions, remind users this is informational only and not financial advice
- Be friendly and professional`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Portfolio assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
