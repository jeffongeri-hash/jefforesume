
-- Table to persist freedom countdown progress
CREATE TABLE public.countdown_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_key text NOT NULL UNIQUE,
  marked_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.countdown_progress ENABLE ROW LEVEL SECURITY;

-- Only admin can write
CREATE POLICY "Admins can insert countdown_progress"
ON public.countdown_progress FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Admins can delete countdown_progress"
ON public.countdown_progress FOR DELETE
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- Publicly readable (it's a hidden page anyway)
CREATE POLICY "Countdown progress is publicly readable"
ON public.countdown_progress FOR SELECT
USING (true);
