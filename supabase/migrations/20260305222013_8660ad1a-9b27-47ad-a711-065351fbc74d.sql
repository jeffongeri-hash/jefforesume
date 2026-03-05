
-- Drop restrictive admin-only policies for insert and delete
DROP POLICY IF EXISTS "Admins can insert countdown_progress" ON public.countdown_progress;
DROP POLICY IF EXISTS "Admins can delete countdown_progress" ON public.countdown_progress;

-- Allow anyone (anon + authenticated) to insert
CREATE POLICY "Anyone can insert countdown_progress"
ON public.countdown_progress FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone (anon + authenticated) to delete
CREATE POLICY "Anyone can delete countdown_progress"
ON public.countdown_progress FOR DELETE
TO anon, authenticated
USING (true);
