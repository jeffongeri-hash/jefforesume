import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BadgeCheck, Plus, Trash2, Save, X, Pencil, AlertTriangle } from "lucide-react";
import type { LicenseEntry } from "./types";

const KINDS = ["license", "certification", "registration", "dea", "npi", "other"] as const;

type Draft = Omit<LicenseEntry, "id"> & { id?: string };

const EMPTY: Draft = {
  kind: "license",
  name: "",
  number: "",
  issuer: "",
  state: "",
  issue_date: "",
  expiration_date: "",
  notes: "",
};

function daysUntil(date: string | null) {
  if (!date) return null;
  const ms = new Date(date).getTime() - Date.now();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export default function VaultLicenses({ userId }: { userId: string }) {
  const [rows, setRows] = useState<LicenseEntry[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);

  async function load() {
    const { data } = await supabase
      .from("pav_licenses" as any)
      .select("*")
      .order("expiration_date", { ascending: true, nullsFirst: false });
    if (data) setRows(data as unknown as LicenseEntry[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!draft || !draft.name.trim()) return;
    const payload = {
      user_id: userId,
      kind: draft.kind,
      name: draft.name.trim(),
      number: draft.number?.trim() || null,
      issuer: draft.issuer?.trim() || null,
      state: draft.state?.trim() || null,
      issue_date: draft.issue_date || null,
      expiration_date: draft.expiration_date || null,
      notes: draft.notes?.trim() || null,
    };
    if (draft.id) {
      await supabase.from("pav_licenses" as any).update(payload).eq("id", draft.id);
    } else {
      await supabase.from("pav_licenses" as any).insert(payload);
    }
    setDraft(null);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this entry?")) return;
    await supabase.from("pav_licenses" as any).delete().eq("id", id);
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <BadgeCheck size={20} className="text-primary" />
          <div>
            <h2 className="font-display text-xl font-semibold">Licenses & Registrations</h2>
            <p className="text-sm text-muted-foreground">
              Encrypted at rest. Only visible to you when signed in.
            </p>
          </div>
        </div>
        {!draft && (
          <button
            onClick={() => setDraft({ ...EMPTY })}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm px-3 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            <Plus size={15} /> Add entry
          </button>
        )}
      </div>

      {draft && (
        <div className="border border-border bg-card rounded-md p-5 mb-6">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Type">
              <select
                value={draft.kind}
                onChange={(e) => setDraft({ ...draft, kind: e.target.value })}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background capitalize"
              >
                {KINDS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Name / title">
              <Input
                value={draft.name}
                onChange={(v) => setDraft({ ...draft, name: v })}
                placeholder="e.g. California PA License"
              />
            </Field>
            <Field label="Number">
              <Input
                value={draft.number || ""}
                onChange={(v) => setDraft({ ...draft, number: v })}
              />
            </Field>
            <Field label="Issuer">
              <Input
                value={draft.issuer || ""}
                onChange={(v) => setDraft({ ...draft, issuer: v })}
                placeholder="e.g. Medical Board of California"
              />
            </Field>
            <Field label="State">
              <Input
                value={draft.state || ""}
                onChange={(v) => setDraft({ ...draft, state: v })}
                placeholder="CA"
              />
            </Field>
            <Field label="Issue date">
              <input
                type="date"
                value={draft.issue_date || ""}
                onChange={(e) => setDraft({ ...draft, issue_date: e.target.value })}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
              />
            </Field>
            <Field label="Expiration date">
              <input
                type="date"
                value={draft.expiration_date || ""}
                onChange={(e) => setDraft({ ...draft, expiration_date: e.target.value })}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
              />
            </Field>
            <Field label="Notes" full>
              <textarea
                value={draft.notes || ""}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                rows={2}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
              />
            </Field>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={save}
              disabled={!draft.name.trim()}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-60"
            >
              <Save size={15} /> Save
            </button>
            <button
              onClick={() => setDraft(null)}
              className="flex items-center gap-1.5 text-sm px-3 py-2 border border-border rounded-md hover:border-primary"
            >
              <X size={15} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {rows.map((r) => {
          const d = daysUntil(r.expiration_date);
          const expiringSoon = d !== null && d <= 60 && d >= 0;
          const expired = d !== null && d < 0;
          return (
            <div
              key={r.id}
              className="border border-border bg-card rounded-md p-4 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wide bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                    {r.kind}
                  </span>
                  <p className="text-sm font-medium truncate">{r.name}</p>
                  {expired && (
                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">
                      <AlertTriangle size={10} /> Expired
                    </span>
                  )}
                  {expiringSoon && (
                    <span className="text-[10px] uppercase tracking-wide bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded">
                      Expires in {d}d
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {r.number && <>#{r.number}</>}
                  {r.issuer && <> · {r.issuer}</>}
                  {r.state && <> · {r.state}</>}
                  {r.issue_date && <> · Issued {r.issue_date}</>}
                  {r.expiration_date && <> · Expires {r.expiration_date}</>}
                </p>
                {r.notes && (
                  <p className="text-xs text-muted-foreground mt-1 italic">{r.notes}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    setDraft({
                      id: r.id,
                      kind: r.kind,
                      name: r.name,
                      number: r.number || "",
                      issuer: r.issuer || "",
                      state: r.state || "",
                      issue_date: r.issue_date || "",
                      expiration_date: r.expiration_date || "",
                      notes: r.notes || "",
                    })
                  }
                  className="p-1.5 border border-border rounded-md hover:border-primary hover:text-primary transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => remove(r.id)}
                  className="p-1.5 border border-border rounded-md hover:border-destructive hover:text-destructive transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
        {rows.length === 0 && !draft && (
          <p className="text-sm text-muted-foreground">No entries yet. Click “Add entry” to start.</p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
    />
  );
}