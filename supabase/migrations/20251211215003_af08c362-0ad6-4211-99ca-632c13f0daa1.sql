-- Create holdings table for current portfolio positions
CREATE TABLE public.holdings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  shares DECIMAL(12, 4) NOT NULL,
  average_cost DECIMAL(12, 2) NOT NULL,
  current_price DECIMAL(12, 2),
  sector TEXT,
  asset_type TEXT DEFAULT 'Stock',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trades table for trade history
CREATE TABLE public.trades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  trade_type TEXT NOT NULL CHECK (trade_type IN ('BUY', 'SELL')),
  shares DECIMAL(12, 4) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  total_value DECIMAL(14, 2) GENERATED ALWAYS AS (shares * price) STORED,
  trade_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table to track who can manage investments
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for holdings and trades (visitors can view)
CREATE POLICY "Holdings are publicly readable"
ON public.holdings
FOR SELECT
USING (true);

CREATE POLICY "Trades are publicly readable"
ON public.trades
FOR SELECT
USING (true);

-- Admin-only write access for holdings
CREATE POLICY "Admins can insert holdings"
ON public.holdings
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can update holdings"
ON public.holdings
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can delete holdings"
ON public.holdings
FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Admin-only write access for trades
CREATE POLICY "Admins can insert trades"
ON public.trades
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can update trades"
ON public.trades
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can delete trades"
ON public.trades
FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Admin users can only see their own record
CREATE POLICY "Admin users can view their own record"
ON public.admin_users
FOR SELECT
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on holdings
CREATE TRIGGER update_holdings_updated_at
BEFORE UPDATE ON public.holdings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();