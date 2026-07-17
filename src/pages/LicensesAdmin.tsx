import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import VaultLicenses from "./pa-vault/VaultLicenses";

export default function LicensesAdmin() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s),
    );
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!session) {
    return (
      <Navigate
        to={`/auth?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Licenses</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-lg font-semibold">Licenses Admin</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md px-2 py-1"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </div>
      <main className="max-w-3xl mx-auto px-6 py-8">
        <VaultLicenses userId={session.user.id} />
      </main>
    </div>
  );
}