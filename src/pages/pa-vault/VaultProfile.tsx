import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, Copy, Check } from "lucide-react";
import type { ProfileData } from "./types";

const EMPTY: ProfileData = {
  full_name: "",
  credentials_suffix: "",
  npi_number: "",
  state_license_number: "",
  state_license_state: "CA",
  dea_number: "",
  phone: "",
  email: "",
  mailing_address: "",
  specialty: "Emergency Medicine",
  years_experience: "",
  malpractice_carrier: "",
  malpractice_policy_number: "",
  bls_expiry: "",
  acls_expiry: "",
};

const FIELDS: [keyof ProfileData, string][] = [
  ["full_name", "Full name"],
  ["credentials_suffix", "Credentials (e.g. MSPAS, PA-C)"],
  ["npi_number", "NPI number"],
  ["state_license_number", "State license number"],
  ["state_license_state", "License state"],
  ["dea_number", "DEA number"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["mailing_address", "Mailing address"],
  ["specialty", "Specialty"],
  ["years_experience", "Years of experience"],
  ["malpractice_carrier", "Malpractice carrier"],
  ["malpractice_policy_number", "Malpractice policy #"],
  ["bls_expiry", "BLS expiry"],
  ["acls_expiry", "ACLS expiry"],
];

export default function VaultProfile({ userId }: { userId: string }) {
  const [data, setData] = useState<ProfileData>(EMPTY);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase
      .from("pav_profile" as any)
      .select("*")
      .maybeSingle()
      .then(({ data: row }: any) => {
        if (row) {
          setData({
            ...EMPTY,
            ...Object.fromEntries(
              Object.entries(row).map(([k, v]) => [k, v == null ? "" : String(v)])
            ),
          } as ProfileData);
        }
      });
  }, []);

  async function handleSave() {
    await supabase.from("pav_profile" as any).upsert({
      user_id: userId,
      ...data,
      years_experience: data.years_experience ? Number(data.years_experience) : null,
      bls_expiry: data.bls_expiry || null,
      acls_expiry: data.acls_expiry || null,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function copyAll() {
    const text = FIELDS.map(([key, label]) => `${label}: ${data[key] || "—"}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold">Profile / Auto-fill</h2>
          <p className="text-sm text-muted-foreground">
            Kept here once so you can copy it into any application form.
          </p>
        </div>
        <button
          onClick={copyAll}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-border rounded-md hover:border-primary hover:text-primary transition-colors"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}{" "}
          {copied ? "Copied" : "Copy all as text"}
        </button>
      </div>

      <div className="border border-border bg-card rounded-md p-5 grid sm:grid-cols-2 gap-4">
        {FIELDS.map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5">
              {label}
            </label>
            <input
              type={key.includes("expiry") ? "date" : "text"}
              value={data[key]}
              onChange={(e) => setData((d) => ({ ...d, [key]: e.target.value }))}
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="mt-5 flex items-center gap-2 bg-primary text-primary-foreground text-sm px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
      >
        {saved ? <Check size={15} /> : <Save size={15} />} {saved ? "Saved" : "Save profile"}
      </button>
    </div>
  );
}