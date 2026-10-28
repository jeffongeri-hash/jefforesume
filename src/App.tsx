import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import SkipLink from "@/components/SkipLink";
import RouteSeo from "@/components/RouteSeo";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";

// Lazy load non-critical pages
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const AllPosts = lazy(() => import("./pages/AllPosts"));
const Investments = lazy(() => import("./pages/Investments"));
const FinanceGuides = lazy(() => import("./pages/FinanceGuides"));
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
const CareAbroad = lazy(() => import("./pages/CareAbroad"));
const CareAbroadTimeline = lazy(() => import("./pages/CareAbroadTimeline"));
const SumerlinTrails = lazy(() => import("./pages/SumerlinTrails"));
const KenyaTrip = lazy(() => import("./pages/KenyaTrip"));
const TradingVolatility = lazy(() => import("./pages/TradingVolatility"));
const FamilyDirective = lazy(() => import("./pages/FamilyDirective"));
const PaycheckAnalyzer = lazy(() => import("./pages/PaycheckAnalyzer"));
const SacramentoHealthcareHub = lazy(() => import("./pages/SacramentoHealthcareHub"));
const CoveredCallMaster = lazy(() => import("./pages/CoveredCallMaster"));
const PAVault = lazy(() => import("./pages/PAVault"));
const PublicLicenses = lazy(() => import("./pages/PublicLicenses"));
const LicensesAdmin = lazy(() => import("./pages/LicensesAdmin"));
const DroneLanding = lazy(() => import("./drone/DroneLanding"));
const DroneGallery = lazy(() => import("./drone/DroneGallery"));
const DroneProject = lazy(() => import("./drone/DroneProject"));
const MskAnatomyAtlas = lazy(() => import("./pages/MskAnatomyAtlas"));
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
          <RouteSeo />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/posts" element={<AllPosts />} />
                <Route path="/investments" element={<Investments />} />
                <Route path="/finance-guides" element={<FinanceGuides />} />
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
                <Route path="/care-abroad" element={<CareAbroad />} />
                <Route path="/care-abroad/timeline" element={<CareAbroadTimeline />} />
                <Route path="/sumerlin-trails" element={<SumerlinTrails />} />
                <Route path="/kenya-trip" element={<KenyaTrip />} />
                <Route path="/trading-volatility" element={<TradingVolatility />} />
                <Route path="/family-directive" element={<FamilyDirective />} />
                <Route path="/paycheck-analyzer" element={<PaycheckAnalyzer />} />
                <Route path="/sacramento-healthcare" element={<SacramentoHealthcareHub />} />
                <Route path="/covered-call-master" element={<CoveredCallMaster />} />
                <Route path="/pa-vault/*" element={<PAVault />} />
                <Route path="/my-licenses" element={<PublicLicenses />} />
                <Route path="/licenses-admin" element={<LicensesAdmin />} />
                <Route path="/drone" element={<DroneLanding />} />
                <Route path="/drone/gallery" element={<DroneGallery />} />
                <Route path="/drone/gallery/:slug" element={<DroneProject />} />
                <Route path="/msk-anatomy-atlas" element={<MskAnatomyAtlas />} />
                <Route path="/msk-anatomy-atlas/axial/neck" element={<MskAnatomyAtlas />} />
                <Route path="/msk-anatomy-atlas/axial/back" element={<MskAnatomyAtlas />} />
                <Route path="/msk-anatomy-atlas/upper-extremity/arm" element={<MskAnatomyAtlas />} />
                <Route path="/msk-anatomy-atlas/upper-extremity/elbow-forearm" element={<MskAnatomyAtlas />} />
                <Route path="/msk-anatomy-atlas/upper-extremity/wrist-hand" element={<MskAnatomyAtlas />} />
                <Route path="/msk-anatomy-atlas/upper-extremity/shoulder" element={<MskAnatomyAtlas />} />
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
