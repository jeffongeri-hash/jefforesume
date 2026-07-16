import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function VaultLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"sign_in" | "sign_up">("sign_in");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } =
      mode === "sign_in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/pa-vault` },
          });
    setBusy(false);
    if (error) setError(error.message);
  }

  return (
    <div className="min-h-[70vh] bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-semibold text-foreground mb-1">
          PA Per Diem Vault
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Sacramento &amp; Placer County · private, single-user access
        </p>
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-md p-6 space-y-4 shadow-sm"
        >
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-primary text-primary-foreground rounded-md py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "sign_in" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "sign_in" ? "sign_up" : "sign_in")}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "sign_in"
            ? "First time here? Create your account"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}