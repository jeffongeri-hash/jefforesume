import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { BadgeCheck, AlertTriangle, KeyRound } from "lucide-react";

const STORAGE_KEY = "pav_license_share_token";

interface License {
  id: string;
  kind: string;
  name: string;
  number: string | null;
  issuer: string | null;
  state: string | null;
  issue_date: string | null;
  expiration_date: string | null;
  notes: string | null;
}

function daysUntil(date: string | null) {
  if (!date) return null;
  const ms = new Date(date).getTime() - Date.now();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export default function PublicLicenses() {
  const [token, setToken] = useState<string>("");
  const [licenses, setLicenses] = useState<License[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Accept token from URL hash on first visit, then persist to localStorage
    const hash = window.location.hash.replace(/^#/, "").trim();
    const stored = localStorage.getItem(STORAGE_KEY) || "";
    const t = hash || stored;
    if (hash) {
      localStorage.setItem(STORAGE_KEY, hash);
      window.history.replaceState(null, "", window.location.pathname);
    }
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pav-public-licenses?token=${encodeURIComponent(token)}`;
    fetch(url, {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
    })
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => {
        if (!ok) {
          setError(j?.error || "Unable to load");
          setLicenses(null);
        } else {
          setLicenses(j.licenses || []);
        }
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [token]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = input.trim();
    if (!t) return;
    localStorage.setItem(STORAGE_KEY, t);
    setToken(t);
  }

  function forget() {
    localStorage.removeItem(STORAGE_KEY);
    setToken("");
    setLicenses(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Licenses</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 mb-8">
          <BadgeCheck size={22} className="text-primary" />
          <h1 className="font-display text-2xl font-semibold">
            Licenses &amp; Registrations
          </h1>
        </div>

        {!token && (
          <form
            onSubmit={handleSubmit}
            className="border border-border bg-card rounded-md p-5 space-y-3"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <KeyRound size={15} /> Paste access token to view.
            </div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="token"
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background font-mono"
              autoFocus
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded-md hover:opacity-90"
            >
              View
            </button>
          </form>
        )}

        {token && loading && (
          <p className="text-sm text-muted-foreground">Loading…</p>
        )}

        {token && error && (
          <div className="border border-destructive/30 bg-destructive/5 rounded-md p-4 text-sm text-destructive flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <div>
              <p>{error === "Not found" ? "Invalid or revoked token." : error}</p>
              <button
                onClick={forget}
                className="underline text-xs mt-2 opacity-80"
              >
                Clear saved token
              </button>
            </div>
          </div>
        )}

        {token && licenses && (
          <>
            <div className="space-y-2">
              {licenses.map((r) => {
                const d = daysUntil(r.expiration_date);
                const expiringSoon = d !== null && d <= 60 && d >= 0;
                const expired = d !== null && d < 0;
                return (
                  <div
                    key={r.id}
                    className="border border-border bg-card rounded-md p-4"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase tracking-wide bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                        {r.kind}
                      </span>
                      <p className="text-sm font-medium">{r.name}</p>
                      {expired && (
                        <span className="text-[10px] uppercase tracking-wide bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">
                          Expired
                        </span>
                      )}
                      {expiringSoon && (
                        <span className="text-[10px] uppercase tracking-wide bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded">
                          Expires in {d}d
                        </span>
                      )}
                    </div>
                    <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      {r.number && (
                        <Row label="Number" value={r.number} mono />
                      )}
                      {r.issuer && <Row label="Issuer" value={r.issuer} />}
                      {r.state && <Row label="State" value={r.state} />}
                      {r.issue_date && (
                        <Row label="Issued" value={r.issue_date} />
                      )}
                      {r.expiration_date && (
                        <Row label="Expires" value={r.expiration_date} />
                      )}
                    </dl>
                    {r.notes && (
                      <p className="text-xs text-muted-foreground italic mt-2">
                        {r.notes}
                      </p>
                    )}
                  </div>
                );
              })}
              {licenses.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No entries yet.
                </p>
              )}
            </div>
            <button
              onClick={forget}
              className="mt-6 text-xs text-muted-foreground hover:text-foreground underline"
            >
              Forget this device
            </button>
          </>
        )}
      </main>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <>
      <dt className="text-muted-foreground uppercase tracking-wide">{label}</dt>
      <dd className={mono ? "font-mono" : ""}>{value}</dd>
    </>
  );
}