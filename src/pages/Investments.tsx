import { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import PortfolioAssistant from '@/components/PortfolioAssistant';
import PerformanceChart from '@/components/PerformanceChart';
import StockPriceUpdater from '@/components/StockPriceUpdater';
import FinanceExplainers from '@/components/FinanceExplainers';
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

interface Trade {
  id: string;
  symbol: string;
  name: string;
  trade_type: string;
  shares: number;
  price: number;
  total_value: number;
  trade_date: string;
  notes: string | null;
}

const Investments = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [holdingsRes, tradesRes] = await Promise.all([
      supabase.from('holdings').select('*').order('symbol'),
      supabase.from('trades').select('*').order('trade_date', { ascending: false })
    ]);

    if (holdingsRes.data) setHoldings(holdingsRes.data);
    if (tradesRes.data) setTrades(tradesRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalValue = holdings.reduce((sum, h) => {
    const price = h.current_price || h.average_cost;
    return sum + (h.shares * price);
  }, 0);

  const totalCost = holdings.reduce((sum, h) => sum + (h.shares * h.average_cost), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? ((totalGainLoss / totalCost) * 100) : 0;

  // Calculate sector allocation for pie chart
  const CHART_COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];
  
  const sectorAllocation = useMemo(() => {
    const sectorMap: Record<string, number> = {};
    holdings.forEach((h) => {
      const price = h.current_price || h.average_cost;
      const value = h.shares * price;
      const sector = h.sector || 'Other';
      sectorMap[sector] = (sectorMap[sector] || 0) + value;
    });
    return Object.entries(sectorMap).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }));
  }, [holdings]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Jefney Ongeri — Investment Portfolio | Stock Holdings & Performance</title>
        <meta name="description" content="Jefney Ongeri's investment portfolio tracker with real-time stock holdings, performance charts, and trade history." />
        <meta name="keywords" content="Jefney Ongeri, investments, portfolio, stock market, financial planning" />
        <link rel="canonical" href="https://jefneyongeri.com/investments" />
      </Helmet>
      <Header />
      <main id="main-content" className="container-blog py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Investment Portfolio
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A transparent look at Jefney Ongeri's personal investment journey. View current holdings and recent trades.
          </p>
          <Badge variant="outline" className="mt-4">
            <Calendar className="h-3 w-3 mr-1" />
            Retirement Account Portfolio as of Q4 2024
          </Badge>
        </div>

        {/* Stock Price Updater */}
        <div className="max-w-4xl mx-auto mb-8">
          <StockPriceUpdater onPricesUpdated={fetchData} />
        </div>

        {/* Investment Philosophy */}
        <div className="max-w-4xl mx-auto mb-12 p-6 bg-card rounded-lg border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-3">Investment Philosophy</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            My approach blends trend-following strategies with fundamental analysis. I focus on identifying companies 
            with favorable financial ratios while riding bullish market trends. This combination of momentum and value 
            helps balance growth potential with risk management in my long-term portfolio.
          </p>
          
          <h3 className="text-lg font-medium text-foreground mb-3">Key Ratios I Analyze</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-semibold text-foreground">P/E Ratio</p>
              <p className="text-sm text-muted-foreground">Price-to-Earnings: Measures stock price relative to earnings. I look for reasonable valuations compared to industry peers.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-semibold text-foreground">Debt-to-Equity</p>
              <p className="text-sm text-muted-foreground">Assesses financial leverage. I prefer companies with manageable debt levels relative to shareholder equity.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-semibold text-foreground">ROE</p>
              <p className="text-sm text-muted-foreground">Return on Equity: Measures profitability. Higher ROE indicates efficient use of shareholder capital.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-semibold text-foreground">ROA</p>
              <p className="text-sm text-muted-foreground">Return on Assets: Shows how efficiently a company uses its assets to generate profit.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-semibold text-foreground">P/S Ratio</p>
              <p className="text-sm text-muted-foreground">Price-to-Sales: Useful for evaluating growth companies that may not yet be profitable.</p>
            </div>
          </div>
        </div>

        {/* Animated financial term explainers */}
        <FinanceExplainers />

        {/* Portfolio Allocation Chart */}
        {!loading && sectorAllocation.length > 0 && (
          <Card className="max-w-4xl mx-auto mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-secondary" />
                Portfolio Allocation by Sector
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorAllocation}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {sectorAllocation.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)} 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Performance Chart */}
        {!loading && (
          <div className="max-w-4xl mx-auto mb-12">
            <PerformanceChart trades={trades} holdings={holdings} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-foreground">
                    {loading ? '—' : formatCurrency(totalValue)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost Basis</p>
                  <p className="text-2xl font-bold text-foreground">
                    {loading ? '—' : formatCurrency(totalCost)}
                  </p>
                </div>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <PieChartIcon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
                  <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {loading ? '—' : formatCurrency(totalGainLoss)}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${totalGainLoss >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {totalGainLoss >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Return %</p>
                  <p className={`text-2xl font-bold ${totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {loading ? '—' : formatPercent(totalGainLossPercent)}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${totalGainLossPercent >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {totalGainLossPercent >= 0 ? (
                    <ArrowUpRight className="h-5 w-5 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Holdings and Trades */}
        <Tabs defaultValue="holdings" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="holdings">Current Holdings</TabsTrigger>
            <TabsTrigger value="trades">Trade History</TabsTrigger>
          </TabsList>

          <TabsContent value="holdings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-secondary" />
                  Current Holdings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center text-muted-foreground py-8">Loading holdings...</p>
                ) : holdings.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No holdings to display yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Symbol</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Shares</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Avg Cost</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Current</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Value</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Gain/Loss</th>
                        </tr>
                      </thead>
                      <tbody>
                        {holdings.map((holding) => {
                          const currentPrice = holding.current_price || holding.average_cost;
                          const value = holding.shares * currentPrice;
                          const cost = holding.shares * holding.average_cost;
                          const gainLoss = value - cost;
                          const gainLossPercent = cost > 0 ? ((gainLoss / cost) * 100) : 0;

                          return (
                            <tr key={holding.id} className="border-b border-border/50 hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <span className="font-bold text-foreground">{holding.symbol}</span>
                                {holding.sector && (
                                  <Badge variant="outline" className="ml-2 text-xs">{holding.sector}</Badge>
                                )}
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">{holding.name}</td>
                              <td className="py-3 px-4 text-right text-foreground">{holding.shares.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right text-muted-foreground">{formatCurrency(holding.average_cost)}</td>
                              <td className="py-3 px-4 text-right text-foreground">{formatCurrency(currentPrice)}</td>
                              <td className="py-3 px-4 text-right font-medium text-foreground">{formatCurrency(value)}</td>
                              <td className={`py-3 px-4 text-right font-medium ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(gainLoss)}
                                <span className="block text-xs">{formatPercent(gainLossPercent)}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trades">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-secondary" />
                  Trade History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center text-muted-foreground py-8">Loading trades...</p>
                ) : trades.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No trades to display yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Symbol</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Shares</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Price</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trades.map((trade) => (
                          <tr key={trade.id} className="border-b border-border/50 hover:bg-muted/50">
                            <td className="py-3 px-4 text-muted-foreground">
                              {new Date(trade.trade_date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={trade.trade_type === 'BUY' ? 'default' : 'secondary'} className={trade.trade_type === 'BUY' ? 'bg-green-600' : 'bg-red-600'}>
                                {trade.trade_type}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 font-bold text-foreground">{trade.symbol}</td>
                            <td className="py-3 px-4 text-muted-foreground">{trade.name}</td>
                            <td className="py-3 px-4 text-right text-foreground">{trade.shares.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right text-muted-foreground">{formatCurrency(trade.price)}</td>
                            <td className="py-3 px-4 text-right font-medium text-foreground">{formatCurrency(trade.total_value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Disclaimer:</strong> This portfolio is shared for educational and transparency purposes only. 
            Nothing here constitutes financial advice. Past performance does not guarantee future results. 
            Always consult with a <Link to="/iv-strike-selector" className="text-muted-foreground hover:text-muted-foreground no-underline cursor-text">qualified</Link> financial advisor before making investment decisions.
          </p>
        </div>
      </main>
      <Footer />
      <PortfolioAssistant />
    </div>
  );
};

export default Investments;
