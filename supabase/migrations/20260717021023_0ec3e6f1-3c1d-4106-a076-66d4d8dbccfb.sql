
CREATE TABLE public.pav_share_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, kind)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pav_share_links TO authenticated;
GRANT ALL ON public.pav_share_links TO service_role;

ALTER TABLE public.pav_share_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage own share links"
  ON public.pav_share_links
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_pav_share_links_updated_at
  BEFORE UPDATE ON public.pav_share_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
