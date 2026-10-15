DROP POLICY IF EXISTS "Holdings are publicly readable" ON public.holdings;
DROP POLICY IF EXISTS "Trades are publicly readable" ON public.trades;
CREATE POLICY "Admins can view holdings" ON public.holdings FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()));
CREATE POLICY "Admins can view trades" ON public.trades FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()));