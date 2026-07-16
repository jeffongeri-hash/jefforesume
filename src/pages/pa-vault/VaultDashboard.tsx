import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Radar, ExternalLink, Loader2, CheckCircle2, XCircle, Archive } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Job } from "./types";

interface ScanResult {
  source: string;
  status: string;
  jobs_found?: number;
  error?: string;
  url?: string;
}

const STATUS_FILTERS = ["new", "viewed", "applied", "ignored", "all"] as const;

export default function VaultDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[] | null>(null);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("new");
  const [perDiemOnly, setPerDiemOnly] = useState(false);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("pav_jobs" as any)
      .select("*")
      .order("first_seen_at", { ascending: false });
    if (statusFilter !== "all") query = query.eq("status", statusFilter);
    if (perDiemOnly) query = query.eq("is_per_diem", true);
    const { data, error } = await query;
    if (!error && data) setJobs(data as unknown as Job[]);
    setLoading(false);
  }, [statusFilter, perDiemOnly]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  async function scanNow() {
    setScanning(true);
    setScanResults(null);
    try {
      const { data, error } = await supabase.functions.invoke("pav-scan-jobs", { body: {} });
      if (error) throw error;
      setScanResults(
        data?.results ?? [{ source: "Scan", status: "error", error: data?.error ?? "Unknown error" }]
      );
      await loadJobs();
    } catch (e: any) {
      setScanResults([{ source: "Scan", status: "error", error: String(e?.message ?? e) }]);
    } finally {
      setScanning(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
    await supabase.from("pav_jobs" as any).update({ status }).eq("id", id);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-md border capitalize transition-colors ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
          <button
            onClick={() => setPerDiemOnly((v) => !v)}
            className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
              perDiemOnly
                ? "bg-destructive text-destructive-foreground border-destructive"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Per diem only
          </button>
        </div>
        <button
          onClick={scanNow}
          disabled={scanning}
          className="flex items-center gap-2 bg-primary text-primary-foreground text-sm px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {scanning ? <Loader2 size={16} className="animate-spin" /> : <Radar size={16} />}
          {scanning ? "Scanning sources…" : "Scan Now"}
        </button>
      </div>

      {scanResults && (
        <div className="mb-6 border border-border rounded-md bg-card p-4 text-sm">
          <p className="font-medium mb-2">Scan results</p>
          <ul className="space-y-1">
            {scanResults.map((r, i) => (
              <li key={i} className="flex items-center gap-2">
                {r.status === "ok" ? (
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                ) : r.status === "manual_review" ? (
                  <ExternalLink size={14} className="text-muted-foreground shrink-0" />
                ) : (
                  <XCircle size={14} className="text-destructive shrink-0" />
                )}
                <span className="font-medium">{r.source}:</span>
                {r.status === "ok" ? (
                  <span className="text-muted-foreground">{r.jobs_found} listings found</span>
                ) : r.status === "manual_review" ? (
                  <span className="text-muted-foreground">
                    Manual review needed{r.url ? " · " : ""}
                    {r.url && (
                      <a href={r.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        Open source
                      </a>
                    )}
                  </span>
                ) : (
                  <span className="text-destructive">{r.error}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading listings…</p>
      ) : jobs.length === 0 ? (
        <div className="border border-dashed border-border rounded-md p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No listings here yet. Click <span className="font-medium text-foreground">Scan Now</span> to pull
            current per-diem / local PA openings from your configured sources.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border border-border bg-card rounded-md p-4 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-semibold text-base">{job.title}</h3>
                  {job.is_per_diem && (
                    <span className="text-[10px] uppercase tracking-wide bg-destructive/10 text-destructive px-1.5 py-0.5 rounded font-medium">
                      Per diem
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {job.organization} {job.location ? `· ${job.location}` : ""}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  {job.source_name} · seen {formatDistanceToNow(new Date(job.first_seen_at))} ago
                  {job.pay_text ? ` · ${job.pay_text}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs px-3 py-1.5 border border-border rounded-md hover:border-primary hover:text-primary transition-colors"
                >
                  View <ExternalLink size={12} />
                </a>
                {job.status !== "applied" && (
                  <button
                    onClick={() => updateStatus(job.id, "applied")}
                    title="Mark applied"
                    className="p-1.5 border border-border rounded-md hover:border-primary hover:text-primary transition-colors"
                  >
                    <CheckCircle2 size={14} />
                  </button>
                )}
                {job.status !== "ignored" && (
                  <button
                    onClick={() => updateStatus(job.id, "ignored")}
                    title="Ignore"
                    className="p-1.5 border border-border rounded-md hover:border-destructive hover:text-destructive transition-colors"
                  >
                    <XCircle size={14} />
                  </button>
                )}
                <button
                  onClick={() => updateStatus(job.id, "archived")}
                  title="Archive"
                  className="p-1.5 border border-border rounded-md hover:text-foreground transition-colors"
                >
                  <Archive size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}