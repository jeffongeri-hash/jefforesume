import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, AlertTriangle, CheckCircle2, Circle, Sparkles } from "lucide-react";
import type { SourceRow } from "./types";
import { DEFAULT_SOURCES } from "./seedSources";

export default function VaultSources({ userId }: { userId: string }) {
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [editingConfig, setEditingConfig] = useState<Record<string, string>>({});
  const [seeding, setSeeding] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("pav_sources" as any)
      .select("*")
      .order("category")
      .order("name");
    if (data) {
      const rows = data as unknown as SourceRow[];
      setSources(rows);
      setEditingConfig(
        Object.fromEntries(rows.map((s) => [s.id, JSON.stringify(s.config, null, 2)]))
      );
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleActive(s: SourceRow) {
    await supabase.from("pav_sources" as any).update({ active: !s.active }).eq("id", s.id);
    await load();
  }

  async function saveConfig(s: SourceRow) {
    try {
      const parsed = JSON.parse(editingConfig[s.id]);
      await supabase.from("pav_sources" as any).update({ config: parsed }).eq("id", s.id);
      await load();
    } catch {
      alert("That config is not valid JSON — fix the syntax and try again.");
    }
  }

  async function seedDefaults() {
    setSeeding(true);
    await supabase
      .from("pav_sources" as any)
      .insert(DEFAULT_SOURCES.map((s) => ({ ...s, user_id: userId })));
    await load();
    setSeeding(false);
  }

  const grouped = sources.reduce<Record<string, SourceRow[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold mb-1">Sources</h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Each source is a small config, not code — if a scraper starts failing (sites change
            markup often), open its config, inspect the live page's HTML, and adjust the selector.
            No redeploy needed.
          </p>
        </div>
        {sources.length === 0 && (
          <button
            onClick={seedDefaults}
            disabled={seeding}
            className="flex items-center gap-2 bg-primary text-primary-foreground text-sm px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-60 shrink-0"
          >
            <Sparkles size={15} /> {seeding ? "Adding…" : "Load default sources"}
          </button>
        )}
      </div>

      {Object.entries(grouped).map(([category, list]) => (
        <div key={category} className="mb-8">
          <h3 className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-2">
            {category.replace("_", " ")}
          </h3>
          <div className="space-y-3">
            {list.map((s) => (
              <div key={s.id} className="border border-border bg-card rounded-md p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(s)} className="rounded-md">
                      {s.active ? (
                        <CheckCircle2 size={16} className="text-primary" />
                      ) : (
                        <Circle size={16} className="text-muted-foreground" />
                      )}
                    </button>
                    <span className="text-sm font-medium">{s.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">{s.platform}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {s.last_status === "error" && (
                      <span className="flex items-center gap-1 text-destructive">
                        <AlertTriangle size={12} /> last run failed
                      </span>
                    )}
                    {s.last_status === "ok" && <span className="text-primary">last run ok</span>}
                    {!s.last_scraped_at && <span>not yet run</span>}
                  </div>
                </div>
                {s.last_error && (
                  <p className="text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-md px-2.5 py-1.5 mb-2">
                    {s.last_error}
                  </p>
                )}
                <textarea
                  value={editingConfig[s.id] ?? ""}
                  onChange={(e) =>
                    setEditingConfig((c) => ({ ...c, [s.id]: e.target.value }))
                  }
                  rows={5}
                  className="w-full border border-border rounded-md px-3 py-2 text-xs font-mono bg-background"
                />
                <button
                  onClick={() => saveConfig(s)}
                  className="mt-2 flex items-center gap-1.5 text-xs px-3 py-1.5 border border-border rounded-md hover:border-primary hover:text-primary transition-colors"
                >
                  <Save size={13} /> Save config
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}