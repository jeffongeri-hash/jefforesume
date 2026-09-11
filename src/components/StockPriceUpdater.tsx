import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface StockPriceUpdaterProps {
  onPricesUpdated: (updatedAt?: Date) => void;
}

const StockPriceUpdater = ({ onPricesUpdated }: StockPriceUpdaterProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const { toast } = useToast();

  const fetchPrices = async (silent = false) => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stock-prices`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch prices');
      }

      const data = await response.json();
      setQuotes(data.prices || []);
      const at = new Date();
      setLastUpdated(at);
      onPricesUpdated(at);

      if (!silent) {
        toast({
          title: data.updated > 0 ? 'Prices Updated' : 'Prices Current',
          description:
            data.updated > 0
              ? `Updated ${data.updated} price${data.updated > 1 ? 's' : ''}.`
              : 'All prices are up to date.',
        });
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
      if (!silent) toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update prices',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Live tracking: refresh on load, then every 2 minutes while the US market is open
  useEffect(() => {
    const isMarketOpen = () => {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      }).formatToParts(new Date());
      const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
      const weekday = get('weekday');
      if (['Sat', 'Sun'].includes(weekday)) return false;
      const minutes = Number(get('hour')) * 60 + Number(get('minute'));
      return minutes >= 9 * 60 + 30 && minutes < 16 * 60;
    };

    fetchPrices(true);
    const interval = setInterval(() => {
      if (isMarketOpen()) fetchPrices(true);
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchPrices()}
            disabled={isUpdating}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Updating...' : 'Refresh Prices'}
          </Button>
          {lastUpdated && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              Updated {formatTime(lastUpdated)}
            </Badge>
          )}
        </div>
      </div>

      {quotes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {quotes.slice(0, 8).map((quote) => (
            <Badge
              key={quote.symbol}
              variant="outline"
              className={`gap-1 py-1.5 ${
                quote.change >= 0 
                  ? 'border-green-500/30 text-green-600 dark:text-green-400' 
                  : 'border-red-500/30 text-red-600 dark:text-red-400'
              }`}
            >
              <span className="font-bold">{quote.symbol}</span>
              <span>${quote.currentPrice.toFixed(2)}</span>
              {quote.change >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{quote.percentChange >= 0 ? '+' : ''}{quote.percentChange.toFixed(2)}%</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockPriceUpdater;
