CREATE TABLE public.schwab_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  expires_at timestamptz NOT NULL,
  account_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.schwab_tokens TO service_role;

ALTER TABLE public.schwab_tokens ENABLE ROW LEVEL SECURITY;

-- No policies = no anon/authenticated access. Only service_role (edge functions) can touch this.

CREATE TRIGGER update_schwab_tokens_updated_at
BEFORE UPDATE ON public.schwab_tokens
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();