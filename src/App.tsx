import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import SkipLink from "@/components/SkipLink";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";

// Lazy load non-critical pages
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const AllPosts = lazy(() => import("./pages/AllPosts"));
const Investments = lazy(() => import("./pages/Investments"));
const Podcast = lazy(() => import("./pages/Podcast"));
const Professional = lazy(() => import("./pages/Professional"));
const Accolades = lazy(() => import("./pages/Accolades"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Admin = lazy(() => import("./pages/Admin"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Resume = lazy(() => import("./pages/Resume"));
const FreedomCountdown = lazy(() => import("./pages/FreedomCountdown"));
const DayTrip = lazy(() => import("./pages/DayTrip"));
const Vacation = lazy(() => import("./pages/Vacation"));
const IVStrikeSelector = lazy(() => import("./pages/IVStrikeSelector"));
const CAMovePlanner = lazy(() => import("./pages/CAMovePlanner"));
const PaycheckAnalyzer = lazy(() => import("./pages/PaycheckAnalyzer"));
const SacramentoHealthcareHub = lazy(() => import("./pages/SacramentoHealthcareHub"));
const CoveredCallMaster = lazy(() => import("./pages/CoveredCallMaster"));
const PAVault = lazy(() => import("./pages/PAVault"));
const PublicLicenses = lazy(() => import("./pages/PublicLicenses"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <SkipLink />
        <Toaster />
        <Sonner />
        <BrowserRouter>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/posts" element={<AllPosts />} />
                <Route path="/investments" element={<Investments />} />
                <Route path="/podcast" element={<Podcast />} />
                <Route path="/professional" element={<Professional />} />
                <Route path="/accolades" element={<Accolades />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/sitemap" element={<Sitemap />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/freedom-countdown" element={<FreedomCountdown />} />
                <Route path="/day-trip" element={<DayTrip />} />
                <Route path="/vacation" element={<Vacation />} />
                <Route path="/iv-strike-selector" element={<IVStrikeSelector />} />
                <Route path="/ca-move-planner" element={<CAMovePlanner />} />
                <Route path="/paycheck-analyzer" element={<PaycheckAnalyzer />} />
                <Route path="/sacramento-healthcare" element={<SacramentoHealthcareHub />} />
                <Route path="/covered-call-master" element={<CoveredCallMaster />} />
                <Route path="/pa-vault/*" element={<PAVault />} />
                <Route path="/my-licenses" element={<PublicLicenses />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
