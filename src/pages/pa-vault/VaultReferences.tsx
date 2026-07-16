import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Link2, Check } from "lucide-react";
import type { Reference } from "./types";

const EMPTY = {
  full_name: "",
  title: "",
  organization: "",
  relationship: "",
  phone: "",
  email: "",
  notes: "",
};

export default function VaultReferences({ userId }: { userId: string }) {
  const [refs, setRefs] = useState<Reference[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from("pav_references" as any)
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setRefs(data as unknown as Reference[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd() {
    if (!form.full_name.trim()) return;
    await supabase.from("pav_references" as any).insert({ user_id: userId, ...form });
    setForm(EMPTY);
    await load();
  }

  async function handleDelete(id: string) {
    await supabase.from("pav_references" as any).delete().eq("id", id);
    await load();
  }

  function copyShareLink(ref: Reference) {
    const url = `${window.location.origin}/pa-vault/references/shared/${ref.share_token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(ref.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-xl font-semibold mb-1">Professional References</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Store contacts once. The link icon copies a shareable link for a recruiter.
      </p>

      <div className="border border-border bg-card rounded-md p-5 mb-6 grid sm:grid-cols-2 gap-3">
        {[
          ["full_name", "Full name"],
          ["title", "Title"],
          ["organization", "Organization"],
          ["relationship", "Relationship (e.g. Supervising Physician)"],
          ["phone", "Phone"],
          ["email", "Email"],
        ].map(([key, placeholder]) => (
          <input
            key={key}
            placeholder={placeholder}
            value={(form as any)[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="border border-border rounded-md px-3 py-2 text-sm bg-background"
          />
        ))}
        <button
          onClick={handleAdd}
          className="sm:col-span-2 flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus size={15} /> Add reference
        </button>
      </div>

      <div className="space-y-2">
        {refs.map((r) => (
          <div
            key={r.id}
            className="border border-border bg-card rounded-md p-3.5 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">{r.full_name}</p>
              <p className="text-xs text-muted-foreground">
                {[r.title, r.organization, r.relationship].filter(Boolean).join(" · ")}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {[r.phone, r.email].filter(Boolean).join(" · ")}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => copyShareLink(r)}
                title="Copy shareable link"
                className="p-1.5 border border-border rounded-md hover:border-primary hover:text-primary transition-colors"
              >
                {copiedId === r.id ? <Check size={14} /> : <Link2 size={14} />}
              </button>
              <button
                onClick={() => handleDelete(r.id)}
                className="p-1.5 border border-border rounded-md hover:border-destructive hover:text-destructive transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {refs.length === 0 && (
          <p className="text-sm text-muted-foreground">No references added yet.</p>
        )}
      </div>
    </div>
  );
}