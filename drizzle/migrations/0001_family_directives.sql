CREATE TABLE public.family_directives (
  id uuid primary key default gen_random_uuid(),
  person_name text not null,
  relationship text,
  date_of_birth date,
  primary_care_physician text,
  emergency_contacts jsonb default '[]'::jsonb,
  medications text,
  allergies text,
  cpr jsonb, ventilation jsonb, nutrition_hydration jsonb, dialysis jsonb, coma_pvs jsonb, stroke_paralysis jsonb,
  dementia jsonb, pain_vs_alertness jsonb, care_setting jsonb, financial_burden jsonb, organ_donation jsonb,
  surrogate_decision_maker text,
  additional_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT ALL ON public.family_directives TO service_role;
ALTER TABLE public.family_directives ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_family_directives_updated_at BEFORE UPDATE ON public.family_directives
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();