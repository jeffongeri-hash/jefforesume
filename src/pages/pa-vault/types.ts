export interface Job {
  id: string;
  title: string;
  organization: string | null;
  location: string | null;
  pay_text: string | null;
  posted_text: string | null;
  url: string;
  source_name: string;
  is_per_diem: boolean;
  status: string;
  first_seen_at: string;
}

export interface CredFile {
  id: string;
  label: string;
  category: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  expires_on: string | null;
  uploaded_at: string;
}

export interface Reference {
  id: string;
  full_name: string;
  title: string | null;
  organization: string | null;
  relationship: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  share_token: string;
}

export interface SourceRow {
  id: string;
  name: string;
  category: string;
  platform: string;
  base_url: string;
  config: Record<string, any>;
  active: boolean;
  last_scraped_at: string | null;
  last_status: string | null;
  last_error: string | null;
}

export interface ProfileData {
  full_name: string;
  credentials_suffix: string;
  npi_number: string;
  state_license_number: string;
  state_license_state: string;
  dea_number: string;
  phone: string;
  email: string;
  mailing_address: string;
  specialty: string;
  years_experience: string;
  malpractice_carrier: string;
  malpractice_policy_number: string;
  bls_expiry: string;
  acls_expiry: string;
}