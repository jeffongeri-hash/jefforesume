import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  BadgeCheck,
  Plus,
  Trash2,
  Save,
  X,
  Pencil,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import type { LicenseEntry } from "./pa-vault/types";

const EDIT_TOKEN_STORAGE_KEY = "pav_license_editor_token";
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

export default function LicensesAdmin() {
  const [token] = useState(() => getInitialEditorToken());
  const [rows, setRows] = useState<LicenseEntry[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callEditor = async (method: string, body?: unknown, id?: string) => {
    if (!token) throw new Error("Open this page from the hidden About Me link.");
    const params = new URLSearchParams({ token });
    if (id) params.set("id", id);
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pav-license-editor?${params.toString()}`;
    const response = await fetch(url, {
      method,
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || "Request failed");
    return data;
  };

  async function load() {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        setRows([]);
        setError("Open this page from the hidden About Me link.");
        return;
      }
      const data = await callEditor("GET");
      setRows(data.licenses || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load licenses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "").trim();
    if (hash) {
      localStorage.setItem(EDIT_TOKEN_STORAGE_KEY, hash);
      window.history.replaceState(null, "", window.location.pathname);
    }
    load();
  }, []);

  async function save() {
    if (!draft || !draft.name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        id: draft.id,
        kind: draft.kind,
        name: draft.name.trim(),
        number: draft.number?.trim() || null,
        issuer: draft.issuer?.trim() || null,
        state: draft.state?.trim() || null,
        issue_date: draft.issue_date || null,
        expiration_date: draft.expiration_date || null,
        notes: draft.notes?.trim() || null,
      };
      await callEditor(draft.id ? "PUT" : "POST", payload);
      setDraft(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save license");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this entry?")) return;
    setError(null);
    try {
      await callEditor("DELETE", undefined, id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to delete license");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Licenses</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <BadgeCheck size={22} className="text-primary" />
            <div>
              <h1 className="font-display text-2xl font-semibold">Licenses &amp; Registrations</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <ShieldCheck size={14} /> Private hidden editor
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

        {error && (
          <div className="border border-destructive/30 bg-destructive/5 rounded-md p-4 text-sm text-destructive flex items-start gap-2 mb-6">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <p>{error === "Not found" ? "This private editor link is not active." : error}</p>
          </div>
        )}

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
                disabled={!draft.name.trim() || saving}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-60"
              >
                <Save size={15} /> {saving ? "Saving…" : "Save"}
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

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
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
                    {r.notes && <p className="text-xs text-muted-foreground mt-1 italic">{r.notes}</p>}
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
                      aria-label="Edit license"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => remove(r.id)}
                      className="p-1.5 border border-border rounded-md hover:border-destructive hover:text-destructive transition-colors"
                      aria-label="Delete license"
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
        )}
      </main>
    </div>
  );
}

function getInitialEditorToken() {
  const hash = window.location.hash.replace(/^#/, "").trim();
  const stored = localStorage.getItem(EDIT_TOKEN_STORAGE_KEY) || "";
  return hash || stored;
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