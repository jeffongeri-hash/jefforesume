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
const PhysiologyAnimationLab = lazy(() => import("./pages/PhysiologyAnimationLab"));
const PathophysiologyAtlas = lazy(() => import("./pages/PathophysiologyAtlas"));
const BowelPerforationLesson = lazy(() => import("./pages/BowelPerforationLesson"));
const RetropharyngealAbscessLesson = lazy(() => import("./pages/RetropharyngealAbscessLesson"));
const SepsisShockLesson = lazy(() => import("./pages/SepsisShockLesson"));
const LadOcclusionLesson = lazy(() => import("./pages/LadOcclusionLesson"));
const McaStrokeLesson = lazy(() => import("./pages/McaStrokeLesson"));
const HemorrhagicStrokeLesson = lazy(() => import("./pages/HemorrhagicStrokeLesson"));
const UpperAirwayLesson = lazy(() => import("./pages/UpperAirwayLesson"));
const RespiratoryLesson = lazy(() => import("./pages/RespiratoryLesson"));
const EctopicPregnancyLesson = lazy(() => import("./pages/EctopicPregnancyLesson"));
const MesentericIschemiaLesson = lazy(() => import("./pages/MesentericIschemiaLesson"));
const SurgicalAbdomenLesson = lazy(() => import("./pages/SurgicalAbdomenLesson"));
const DiabeticKetoacidosisLesson = lazy(() => import("./pages/DiabeticKetoacidosisLesson"));
const SpinalCordLesson = lazy(() => import("./pages/SpinalCordLesson"));
const StatusEpilepticusLesson = lazy(() => import("./pages/StatusEpilepticusLesson"));
const ThyroidStormLesson = lazy(() => import("./pages/ThyroidStormLesson"));
const AdrenalCrisisLesson = lazy(() => import("./pages/AdrenalCrisisLesson"));
const EndocrineEmergencyLesson = lazy(() => import("./pages/EndocrineEmergencyLesson"));
const RenalElectrolyteLesson = lazy(() => import("./pages/RenalElectrolyteLesson"));
const ToxicologyLesson = lazy(() => import("./pages/ToxicologyLesson"));
const DicLesson = lazy(() => import("./pages/DicLesson"));
const HemostasisLesson = lazy(() => import("./pages/HemostasisLesson"));
const VascularFlowLesson = lazy(() => import("./pages/VascularFlowLesson"));
const BloodCellLesson = lazy(() => import("./pages/BloodCellLesson"));
const ImmuneMechanismLesson = lazy(() => import("./pages/ImmuneMechanismLesson"));
const InheritedHemostasisLesson = lazy(() => import("./pages/InheritedHemostasisLesson"));
const HemorrhagicShockLesson = lazy(() => import("./pages/HemorrhagicShockLesson"));
const MskMovementMechanics = lazy(() => import("./pages/MskMovementMechanics"));
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
                <Route path="/physiology-animation-lab" element={<PhysiologyAnimationLab />} />
                <Route path="/pathophysiology-atlas" element={<PathophysiologyAtlas />} />
                <Route path="/pathophysiology-atlas/hemorrhagic-shock" element={<HemorrhagicShockLesson />} />
                <Route path="/pathophysiology-atlas/ectopic-pregnancy" element={<EctopicPregnancyLesson />} />
                <Route path="/pathophysiology-atlas/acute-mesenteric-ischemia" element={<MesentericIschemiaLesson />} />
                <Route path="/pathophysiology-atlas/bowel-obstruction" element={<SurgicalAbdomenLesson kind="bowel-obstruction" />} />
                <Route path="/pathophysiology-atlas/intra-abdominal-abscess" element={<SurgicalAbdomenLesson kind="intra-abdominal-abscess" />} />
                <Route path="/pathophysiology-atlas/diabetic-ketoacidosis" element={<DiabeticKetoacidosisLesson />} />
                <Route path="/pathophysiology-atlas/spinal-cord-pathways-injury" element={<SpinalCordLesson />} />
                <Route path="/pathophysiology-atlas/status-epilepticus" element={<StatusEpilepticusLesson />} />
                <Route path="/pathophysiology-atlas/thyroid-storm" element={<ThyroidStormLesson />} />
                <Route path="/pathophysiology-atlas/adrenal-crisis" element={<AdrenalCrisisLesson />} />
                <Route path="/pathophysiology-atlas/hyperosmolar-hyperglycemic-state" element={<EndocrineEmergencyLesson kind="hhs" />} />
                <Route path="/pathophysiology-atlas/severe-hypoglycemia" element={<EndocrineEmergencyLesson kind="hypoglycemia" />} />
                <Route path="/pathophysiology-atlas/myxedema-coma" element={<EndocrineEmergencyLesson kind="myxedema-coma" />} />
                <Route path="/pathophysiology-atlas/acute-kidney-injury" element={<RenalElectrolyteLesson kind="acute-kidney-injury" />} />
                <Route path="/pathophysiology-atlas/hyperkalemia" element={<RenalElectrolyteLesson kind="hyperkalemia" />} />
                <Route path="/pathophysiology-atlas/acid-base-disorders" element={<RenalElectrolyteLesson kind="acid-base" />} />
                <Route path="/pathophysiology-atlas/rhabdomyolysis" element={<RenalElectrolyteLesson kind="rhabdomyolysis" />} />
                <Route path="/pathophysiology-atlas/hyponatremia" element={<RenalElectrolyteLesson kind="hyponatremia" />} />
                <Route path="/pathophysiology-atlas/hypernatremia" element={<RenalElectrolyteLesson kind="hypernatremia" />} />
                <Route path="/pathophysiology-atlas/opioid-toxicity" element={<ToxicologyLesson kind="opioid" />} />
                <Route path="/pathophysiology-atlas/acetaminophen-toxicity" element={<ToxicologyLesson kind="acetaminophen" />} />
                <Route path="/pathophysiology-atlas/salicylate-toxicity" element={<ToxicologyLesson kind="salicylate" />} />
                <Route path="/pathophysiology-atlas/toxic-alcohols" element={<ToxicologyLesson kind="toxic-alcohols" />} />
                <Route path="/pathophysiology-atlas/carbon-monoxide-cyanide" element={<ToxicologyLesson kind="carbon-monoxide-cyanide" />} />
                <Route path="/pathophysiology-atlas/envenomation" element={<ToxicologyLesson kind="envenomation" />} />
                <Route path="/pathophysiology-atlas/environmental-emergencies" element={<ToxicologyLesson kind="environmental" />} />
                <Route path="/pathophysiology-atlas/disseminated-intravascular-coagulation" element={<DicLesson />} />
                <Route path="/pathophysiology-atlas/hemostasis-and-antithrombotics" element={<HemostasisLesson />} />
                <Route path="/pathophysiology-atlas/arterial-venous-flow-avm" element={<VascularFlowLesson />} />
                <Route path="/pathophysiology-atlas/blood-cell-disorders" element={<BloodCellLesson />} />
                <Route path="/pathophysiology-atlas/immune-response" element={<ImmuneMechanismLesson />} />
                <Route path="/pathophysiology-atlas/antimicrobial-mechanisms" element={<ImmuneMechanismLesson antimicrobial />} />
                <Route path="/pathophysiology-atlas/inherited-bleeding-and-clotting" element={<InheritedHemostasisLesson />} />
                <Route path="/pathophysiology-atlas/bronchiolitis" element={<RespiratoryLesson condition="bronchiolitis" />} />
                <Route path="/pathophysiology-atlas/asthma-exacerbation" element={<RespiratoryLesson condition="asthma-exacerbation" />} />
                <Route path="/pathophysiology-atlas/copd-exacerbation" element={<RespiratoryLesson condition="copd-exacerbation" />} />
                <Route path="/pathophysiology-atlas/pulmonary-hypertension" element={<RespiratoryLesson condition="pulmonary-hypertension" />} />
                <Route path="/pathophysiology-atlas/bowel-perforation" element={<BowelPerforationLesson />} />
                <Route path="/pathophysiology-atlas/retropharyngeal-abscess" element={<RetropharyngealAbscessLesson />} />
                <Route path="/pathophysiology-atlas/sepsis-distributive-shock" element={<SepsisShockLesson />} />
                <Route path="/pathophysiology-atlas/lad-occlusion-myocardial-infarction" element={<LadOcclusionLesson />} />
                <Route path="/pathophysiology-atlas/mca-ischemic-stroke" element={<McaStrokeLesson />} />
                <Route path="/pathophysiology-atlas/hemorrhagic-stroke" element={<HemorrhagicStrokeLesson />} />
                <Route path="/pathophysiology-atlas/upper-airway-obstruction" element={<UpperAirwayLesson />} />
                <Route path="/msk-anatomy-atlas/movement-injury" element={<MskMovementMechanics />} />
                <Route path="/msk-anatomy-atlas/axial/neck" element={<MskAnatomyAtlas />} />
                <Route path="/msk-anatomy-atlas/axial/back" element={<MskAnatomyAtlas />} />
                <Route path="/msk-anatomy-atlas/lower-extremity/hip-pelvis" element={<MskAnatomyAtlas />} />
                <Route path="/msk-anatomy-atlas/lower-extremity/thigh" element={<MskAnatomyAtlas />} />
                <Route path="/msk-anatomy-atlas/lower-extremity/knee" element={<MskAnatomyAtlas />} />
                <Route path="/msk-anatomy-atlas/lower-extremity/calf" element={<MskAnatomyAtlas />} />
                <Route path="/msk-anatomy-atlas/lower-extremity/ankle-foot" element={<MskAnatomyAtlas />} />
                <Route path="/msk-anatomy-atlas/axial/face" element={<MskAnatomyAtlas />} />
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
