import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import VaultLicenses from "./pa-vault/VaultLicenses";

export default function LicensesAdmin() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Licenses</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-lg font-semibold">Licenses Admin</h1>
          {session ? (
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md px-2 py-1"
            >
              <LogOut size={15} /> Sign out
            </button>
          ) : (
            <Link
              to="/auth?redirect=/licenses-admin"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md px-2 py-1"
            >
              <LogIn size={15} /> Sign in to save
            </Link>
          )}
        </div>
      </div>
      <main className="max-w-3xl mx-auto px-6 py-8">
        {session ? (
          <VaultLicenses userId={session.user.id} />
        ) : (
          <div className="border border-border bg-card rounded-md p-6 text-sm text-muted-foreground">
            Sign in to add and edit license entries.{" "}
            <Link to="/auth?redirect=/licenses-admin" className="text-primary hover:underline">
              Sign in →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}