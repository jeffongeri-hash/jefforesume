import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, Download, Trash2, ShieldCheck } from "lucide-react";
import type { CredFile } from "./types";

const CATEGORIES = ["license", "certification", "cv", "reference_letter", "other"] as const;

export default function VaultCredentials({ userId }: { userId: string }) {
  const [files, setFiles] = useState<CredFile[]>([]);
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("license");
  const [expiresOn, setExpiresOn] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function load() {
    const { data } = await supabase
      .from("pav_credential_files" as any)
      .select("*")
      .order("uploaded_at", { ascending: false });
    if (data) setFiles(data as unknown as CredFile[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload() {
    const file = fileInput.current?.files?.[0];
    if (!file || !label.trim()) return;
    setUploading(true);
    const path = `${userId}/${Date.now()}-${file.name}`;
    const { error: uploadErr } = await supabase.storage.from("credentials").upload(path, file);
    if (!uploadErr) {
      await supabase.from("pav_credential_files" as any).insert({
        user_id: userId,
        label,
        category,
        storage_path: path,
        file_name: file.name,
        mime_type: file.type,
        expires_on: expiresOn || null,
      });
      setLabel("");
      setExpiresOn("");
      if (fileInput.current) fileInput.current.value = "";
      await load();
    }
    setUploading(false);
  }

  async function handleDownload(f: CredFile) {
    const { data } = await supabase.storage.from("credentials").createSignedUrl(f.storage_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  async function handleDelete(f: CredFile) {
    await supabase.storage.from("credentials").remove([f.storage_path]);
    await supabase.from("pav_credential_files" as any).delete().eq("id", f.id);
    await load();
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck size={20} className="text-primary" />
        <div>
          <h2 className="font-display text-xl font-semibold">Credential Vault</h2>
          <p className="text-sm text-muted-foreground">
            Private storage — only you can access these files.
          </p>
        </div>
      </div>

      <div className="border border-border bg-card rounded-md p-5 mb-8">
        <p className="text-sm font-medium mb-3">Upload a document</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5">
              Label
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder='e.g. "PA License - California"'
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background capitalize"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5">
              Expires on (optional)
            </label>
            <input
              type="date"
              value={expiresOn}
              onChange={(e) => setExpiresOn(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5">
              File
            </label>
            <input
              ref={fileInput}
              type="file"
              className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-border file:bg-background file:text-sm"
            />
          </div>
        </div>
        <button
          onClick={handleUpload}
          disabled={uploading || !label.trim()}
          className="flex items-center gap-2 bg-primary text-primary-foreground text-sm px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          <Upload size={15} /> {uploading ? "Uploading…" : "Upload"}
        </button>
      </div>

      <div className="space-y-2">
        {files.map((f) => (
          <div
            key={f.id}
            className="border border-border bg-card rounded-md p-3.5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <FileText size={18} className="text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{f.label}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {f.category.replace("_", " ")} · {f.file_name}
                  {f.expires_on ? ` · expires ${f.expires_on}` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleDownload(f)}
                className="p-1.5 border border-border rounded-md hover:border-primary hover:text-primary transition-colors"
              >
                <Download size={14} />
              </button>
              <button
                onClick={() => handleDelete(f)}
                className="p-1.5 border border-border rounded-md hover:border-destructive hover:text-destructive transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {files.length === 0 && (
          <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
        )}
      </div>
    </div>
  );
}