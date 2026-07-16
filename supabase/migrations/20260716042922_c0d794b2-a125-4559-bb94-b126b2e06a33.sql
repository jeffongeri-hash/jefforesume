
CREATE TABLE public.pav_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL,
  platform text NOT NULL,
  base_url text NOT NULL,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  active boolean NOT NULL DEFAULT true,
  last_scraped_at timestamptz,
  last_status text,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pav_sources TO authenticated;
GRANT ALL ON public.pav_sources TO service_role;
ALTER TABLE public.pav_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pav_sources owner all" ON public.pav_sources FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.pav_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_id uuid REFERENCES public.pav_sources(id) ON DELETE SET NULL,
  source_name text NOT NULL,
  external_id text,
  title text NOT NULL,
  organization text,
  location text,
  is_per_diem boolean DEFAULT false,
  is_local boolean DEFAULT true,
  pay_text text,
  posted_text text,
  url text NOT NULL,
  raw jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'new',
  notes text,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, source_name, external_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pav_jobs TO authenticated;
GRANT ALL ON public.pav_jobs TO service_role;
ALTER TABLE public.pav_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pav_jobs owner all" ON public.pav_jobs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX pav_jobs_user_status_idx ON public.pav_jobs(user_id, status);
CREATE INDEX pav_jobs_first_seen_idx ON public.pav_jobs(user_id, first_seen_at DESC);

CREATE TABLE public.pav_scrape_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_id uuid REFERENCES public.pav_sources(id) ON DELETE SET NULL,
  source_name text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running',
  jobs_found int DEFAULT 0,
  jobs_new int DEFAULT 0,
  error text
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pav_scrape_runs TO authenticated;
GRANT ALL ON public.pav_scrape_runs TO service_role;
ALTER TABLE public.pav_scrape_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pav_scrape_runs owner all" ON public.pav_scrape_runs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.pav_profile (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  credentials_suffix text,
  npi_number text,
  state_license_number text,
  state_license_state text,
  dea_number text,
  phone text,
  email text,
  mailing_address text,
  specialty text,
  years_experience int,
  malpractice_carrier text,
  malpractice_policy_number text,
  bls_expiry date,
  acls_expiry date,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pav_profile TO authenticated;
GRANT ALL ON public.pav_profile TO service_role;
ALTER TABLE public.pav_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pav_profile owner all" ON public.pav_profile FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER pav_profile_updated_at BEFORE UPDATE ON public.pav_profile FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.pav_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  title text,
  organization text,
  relationship text,
  phone text,
  email text,
  notes text,
  share_token uuid DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pav_references TO authenticated;
GRANT ALL ON public.pav_references TO service_role;
ALTER TABLE public.pav_references ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pav_references owner all" ON public.pav_references FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.pav_credential_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  category text NOT NULL,
  storage_path text NOT NULL,
  file_name text NOT NULL,
  mime_type text,
  expires_on date,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pav_credential_files TO authenticated;
GRANT ALL ON public.pav_credential_files TO service_role;
ALTER TABLE public.pav_credential_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pav_credential_files owner all" ON public.pav_credential_files FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "credentials owner read" ON storage.objects FOR SELECT USING (bucket_id = 'credentials' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "credentials owner insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'credentials' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "credentials owner update" ON storage.objects FOR UPDATE USING (bucket_id = 'credentials' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "credentials owner delete" ON storage.objects FOR DELETE USING (bucket_id = 'credentials' AND (storage.foldername(name))[1] = auth.uid()::text);
