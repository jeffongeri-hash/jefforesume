import { useEffect, useState } from "react";
import { NavLink, Route, Routes, Navigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LayoutGrid, ShieldCheck, UserRound, Users, Radar, LogOut } from "lucide-react";
import VaultLogin from "./pa-vault/VaultLogin";
import VaultDashboard from "./pa-vault/VaultDashboard";
import VaultCredentials from "./pa-vault/VaultCredentials";
import VaultProfile from "./pa-vault/VaultProfile";
import VaultReferences from "./pa-vault/VaultReferences";
import VaultSources from "./pa-vault/VaultSources";

const NAV = [
  { to: "/pa-vault", end: true, label: "Job Feed", icon: LayoutGrid },
  { to: "/pa-vault/credentials", label: "Credential Vault", icon: ShieldCheck },
  { to: "/pa-vault/profile", label: "Profile / Auto-fill", icon: UserRound },
  { to: "/pa-vault/references", label: "References", icon: Users },
  { to: "/pa-vault/sources", label: "Sources", icon: Radar },
];

export default function PAVault() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>PA Per Diem Vault — Sacramento &amp; Placer County | Jefney Ongeri</title>
        <meta
          name="description"
          content="Private job tracker and credential vault for per-diem and local PA opportunities in the Sacramento and Placer County region."
        />
        <link rel="canonical" href="https://jefneyongeri.com/pa-vault" />
      </Helmet>
      <Header />
      <main id="main-content">
        {loading ? (
          <div className="min-h-[60vh] flex items-center justify-center text-sm text-muted-foreground">
            Loading…
          </div>
        ) : !session ? (
          <VaultLogin />
        ) : (
          <div>
            <div className="border-b border-border bg-card">
              <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-semibold text-foreground">
                    PA Per Diem Vault
                  </h1>
                  <p className="text-xs text-muted-foreground tracking-wide uppercase mt-0.5">
                    Sacramento &amp; Placer County
                  </p>
                </div>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md px-2 py-1"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </div>
              <nav className="max-w-6xl mx-auto px-6 flex gap-1 -mb-px overflow-x-auto">
                {NAV.map(({ to, end, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 text-sm px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
                        isActive
                          ? "border-primary text-primary font-medium"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`
                    }
                  >
                    <Icon size={15} /> {label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="max-w-6xl mx-auto px-6 py-8">
              <Routes>
                <Route index element={<VaultDashboard />} />
                <Route
                  path="credentials"
                  element={<VaultCredentials userId={session.user.id} />}
                />
                <Route path="profile" element={<VaultProfile userId={session.user.id} />} />
                <Route
                  path="references"
                  element={<VaultReferences userId={session.user.id} />}
                />
                <Route path="sources" element={<VaultSources userId={session.user.id} />} />
                <Route path="*" element={<Navigate to="/pa-vault" replace />} />
              </Routes>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}