import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

interface Trade {
  id: string;
  symbol: string;
  name: string;
  trade_type: string;
  shares: number;
  price: number;
  total_value: number;
  trade_date: string;
}

interface Holding {
  symbol: string;
  shares: number;
  average_cost: number;
  current_price: number | null;
}

interface PerformanceChartProps {
  trades: Trade[];
  holdings: Holding[];
}

const PerformanceChart = ({ trades, holdings }: PerformanceChartProps) => {
  const chartData = useMemo(() => {
    if (!trades.length) return [];

    // Sort trades by date
    const sortedTrades = [...trades].sort(
      (a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime()
    );

    // Track portfolio state over time
    const portfolioState: Record<string, { shares: number; avgCost: number }> = {};
    let cumulativeInvested = 0;
    const dataPoints: { date: string; invested: number; value: number; gainLoss: number }[] = [];

    sortedTrades.forEach((trade) => {
      const symbol = trade.symbol;
      
      if (!portfolioState[symbol]) {
        portfolioState[symbol] = { shares: 0, avgCost: 0 };
      }

      if (trade.trade_type === 'BUY') {
        // Calculate new average cost
        const currentValue = portfolioState[symbol].shares * portfolioState[symbol].avgCost;
        const newValue = trade.shares * trade.price;
        const totalShares = portfolioState[symbol].shares + trade.shares;
        
        portfolioState[symbol].avgCost = totalShares > 0 
          ? (currentValue + newValue) / totalShares 
          : 0;
        portfolioState[symbol].shares = totalShares;
        cumulativeInvested += trade.total_value;
      } else if (trade.trade_type === 'SELL') {
        portfolioState[symbol].shares -= trade.shares;
        cumulativeInvested -= trade.shares * portfolioState[symbol].avgCost;
      }

      // Calculate total portfolio value at this point (using trade prices as proxy)
      let totalValue = 0;
      Object.entries(portfolioState).forEach(([sym, state]) => {
        if (state.shares > 0) {
          // Use current holding price if available, otherwise use avg cost
          const holding = holdings.find(h => h.symbol === sym);
          const price = holding?.current_price || state.avgCost;
          totalValue += state.shares * price;
        }
      });

      const gainLoss = totalValue - cumulativeInvested;

      dataPoints.push({
        date: new Date(trade.trade_date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: '2-digit'
        }),
        invested: Math.round(cumulativeInvested * 100) / 100,
        value: Math.round(totalValue * 100) / 100,
        gainLoss: Math.round(gainLoss * 100) / 100,
      });
    });

    // Add current state as final data point
    if (holdings.length > 0) {
      const currentValue = holdings.reduce((sum, h) => {
        const price = h.current_price || h.average_cost;
        return sum + h.shares * price;
      }, 0);

      const currentCost = holdings.reduce((sum, h) => sum + h.shares * h.average_cost, 0);

      dataPoints.push({
        date: 'Now',
        invested: Math.round(currentCost * 100) / 100,
        value: Math.round(currentValue * 100) / 100,
        gainLoss: Math.round((currentValue - currentCost) * 100) / 100,
      });
    }

    return dataPoints;
  }, [trades, holdings]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-foreground mb-2">{label}</p>
        <div className="space-y-1 text-sm">
          <p className="text-primary">
            Value: {formatCurrency(payload[0]?.value || 0)}
          </p>
          <p className="text-muted-foreground">
            Invested: {formatCurrency(payload[1]?.value || 0)}
          </p>
          <p className={payload[2]?.value >= 0 ? 'text-green-500' : 'text-red-500'}>
            Gain/Loss: {formatCurrency(payload[2]?.value || 0)}
          </p>
        </div>
      </div>
    );
  };

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Portfolio Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No trade history available to display performance chart.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Portfolio Performance Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="date" 
                className="text-xs" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
                name="Portfolio Value"
              />
              <Area
                type="monotone"
                dataKey="invested"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1}
                fill="url(#colorInvested)"
                name="Total Invested"
              />
              <Line
                type="monotone"
                dataKey="gainLoss"
                stroke="transparent"
                name="Gain/Loss"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Portfolio Value</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted-foreground/50 border-2 border-dashed border-muted-foreground" />
            <span className="text-muted-foreground">Total Invested</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
