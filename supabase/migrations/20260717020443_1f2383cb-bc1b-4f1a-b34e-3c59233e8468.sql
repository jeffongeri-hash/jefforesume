
CREATE TABLE public.pav_licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'license',
  name TEXT NOT NULL,
  number TEXT,
  issuer TEXT,
  state TEXT,
  issue_date DATE,
  expiration_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pav_licenses TO authenticated;
GRANT ALL ON public.pav_licenses TO service_role;

ALTER TABLE public.pav_licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage own licenses"
  ON public.pav_licenses
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_pav_licenses_updated_at
  BEFORE UPDATE ON public.pav_licenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX pav_licenses_user_id_idx ON public.pav_licenses(user_id);
CREATE INDEX pav_licenses_expiration_idx ON public.pav_licenses(expiration_date);
