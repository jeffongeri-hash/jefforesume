import { useState } from "react";

const HOSPITALS = [
  {
    id: 1,
    name: "UC Davis Medical Center",
    system: "UC Davis Health",
    type: "Academic Medical Center",
    pslf: true,
    pslf_note: "Public university — government employer, automatic PSLF qualifier",
    locations: ["Sacramento (main campus)", "Elk Grove", "Rancho Cordova", "Folsom"],
    specialties: ["Level I Trauma", "Cancer Center (NCI)", "Cardiology", "Neurology", "Emergency Medicine", "Burn Unit"],
    beds: 627,
    rank: "#1 in Sacramento (US News)",
    careersUrl: "https://health.ucdavis.edu/join-the-team/",
    indeedUrl: "https://www.indeed.com/cmp/Uc-Davis-Health/jobs/q-Physician-Assistant-l-Sacramento,-CA",
    linkedinUrl: "https://www.linkedin.com/company/uc-davis-health/jobs",
    paJobs: [
      { title: "Sr. Physician Assistant – UCD Heart Center", type: "Full-time", dept: "Cardiology", source: "Indeed" },
      { title: "Physician Assistant – Emergency Medicine", type: "Full-time", dept: "Emergency", source: "Career Page" },
      { title: "PA Faculty – PA Studies Program", type: "Full-time", dept: "Academic", source: "Career Page" },
      { title: "Physician Assistant – Oncology", type: "Full-time", dept: "Cancer Center", source: "LinkedIn" },
    ],
    color: "#1A6FA3",
  },
  {
    id: 2,
    name: "Sutter Medical Center Sacramento",
    system: "Sutter Health",
    type: "Nonprofit Health System",
    pslf: true,
    pslf_note: "501(c)(3) nonprofit — direct Sutter employment qualifies for PSLF",
    locations: ["Sacramento (Capitol Ave)", "Roseville", "Folsom", "Elk Grove", "West Roseville (urgent care)"],
    specialties: ["Women's & Children's", "Cardiology", "Orthopedics", "Oncology", "Emergency Medicine", "Urgent Care"],
    beds: 524,
    rank: "#2 in Sacramento (US News)",
    careersUrl: "https://jobs.sutterhealth.org/",
    indeedUrl: "https://www.indeed.com/q-sutter-health-pa-jobs.html",
    linkedinUrl: "https://www.linkedin.com/company/sutter-health/jobs",
    paJobs: [
      { title: "PA or NP – Family Medicine (Sacramento/Davis)", type: "Full-time", dept: "Primary Care", source: "Indeed" },
      { title: "Physician Assistant – Urgent Care (Elk Grove)", type: "Full-time", dept: "Urgent Care", source: "Career Page" },
      { title: "PA – Behavioral Health", type: "Full-time", dept: "Behavioral Health", source: "Indeed" },
      { title: "Physician Assistant – GYN Oncology", type: "Full-time", dept: "Oncology", source: "Career Page" },
    ],
    color: "#107A6C",
    note: "⭐ Your target employer — Sutter is actively expanding in Elk Grove & Roseville",
  },
  {
    id: 3,
    name: "Mercy General Hospital",
    system: "Dignity Health (CommonSpirit)",
    type: "Nonprofit Catholic Health System",
    pslf: true,
    pslf_note: "CommonSpirit / Dignity Health is 501(c)(3) — qualifies for PSLF",
    locations: ["Sacramento", "Rancho Cordova (Dignity Health Medical Group)", "Citrus Heights"],
    specialties: ["Stroke Center (Certified)", "Cardiac / PCI", "Acute Rehab", "General Surgery", "Emergency Medicine"],
    beds: 342,
    rank: "#3 (tied) in Sacramento",
    careersUrl: "https://careers.dignityhealth.org/",
    indeedUrl: "https://www.indeed.com/q-dignity-health-physician-assistant-l-sacramento,-ca-jobs.html",
    linkedinUrl: "https://www.linkedin.com/company/dignity-health/jobs",
    paJobs: [
      { title: "Physician Assistant – Emergency Department", type: "Full-time", dept: "Emergency", source: "Indeed" },
      { title: "PA – Hospital Medicine", type: "Full-time", dept: "Hospitalist", source: "Career Page" },
      { title: "PA / NP – Urgent Care Rancho Cordova", type: "Full-time", dept: "Urgent Care", source: "LinkedIn" },
    ],
    color: "#7B3F9E",
  },
  {
    id: 4,
    name: "Mercy San Juan Medical Center",
    system: "Dignity Health (CommonSpirit)",
    type: "Nonprofit Catholic Health System",
    pslf: true,
    pslf_note: "CommonSpirit / Dignity Health 501(c)(3) employer",
    locations: ["Carmichael", "Citrus Heights"],
    specialties: ["Neuroscience", "Cardiac", "Women's Health", "Emergency Medicine", "Cancer Care"],
    beds: 370,
    rank: "Top Regional (US News Recognized)",
    careersUrl: "https://careers.dignityhealth.org/",
    indeedUrl: "https://www.indeed.com/q-dignity-health-physician-assistant-l-sacramento,-ca-jobs.html",
    linkedinUrl: "https://www.linkedin.com/company/dignity-health/jobs",
    paJobs: [
      { title: "Physician Assistant – Neuroscience ICU", type: "Full-time", dept: "Neurology", source: "Career Page" },
      { title: "PA – Cardiac Surgery Support", type: "Full-time", dept: "Cardiology", source: "Indeed" },
    ],
    color: "#7B3F9E",
  },
  {
    id: 5,
    name: "Kaiser Sacramento Medical Center",
    system: "Kaiser Permanente",
    type: "Nonprofit Integrated Health System",
    pslf: true,
    pslf_note: "Kaiser Foundation Hospitals are 501(c)(3) nonprofits — PSLF eligible for direct employees",
    locations: ["Sacramento (Morse Ave)", "South Sacramento", "Elk Grove", "Folsom", "Rancho Cordova"],
    specialties: ["Integrated Primary & Specialty Care", "Cardiology", "Mental Health", "Pediatrics", "Emergency Medicine"],
    beds: 300,
    rank: "#3 (tied) in Sacramento – Roseville campus",
    careersUrl: "https://jobs.kaiserpermanente.org/",
    indeedUrl: "https://www.indeed.com/q-kaiser-permanente-physician-assistant-l-sacramento,-ca-jobs.html",
    linkedinUrl: "https://www.linkedin.com/company/kaiser-permanente/jobs",
    paJobs: [
      { title: "Physician Assistant – Internal Medicine", type: "Full-time", dept: "Internal Medicine", source: "Career Page" },
      { title: "PA – Urgent Care Elk Grove", type: "Full-time", dept: "Urgent Care", source: "Indeed" },
      { title: "PA – Mental Health Services", type: "Full-time", dept: "Behavioral Health", source: "LinkedIn" },
    ],
    color: "#00457C",
    note: "Members-only system — employment as a direct KP employee qualifies for PSLF",
  },
  {
    id: 6,
    name: "Kaiser Roseville Medical Center",
    system: "Kaiser Permanente",
    type: "Nonprofit Integrated Health System",
    pslf: true,
    pslf_note: "Kaiser Foundation Hospital 501(c)(3) — PSLF eligible for direct employees",
    locations: ["Roseville (Eureka Rd)", "Lincoln", "Sierra Gardens"],
    specialties: ["Cancer Surgery", "Cardiac", "Orthopedics", "COPD / Pulmonology", "Emergency Medicine"],
    beds: 340,
    rank: "#3 (tied) in Sacramento (US News)",
    careersUrl: "https://jobs.kaiserpermanente.org/",
    indeedUrl: "https://www.indeed.com/q-kaiser-permanente-physician-assistant-l-roseville,-ca-jobs.html",
    linkedinUrl: "https://www.linkedin.com/company/kaiser-permanente/jobs",
    paJobs: [
      { title: "Physician Assistant – Oncology Surgical Support", type: "Full-time", dept: "Oncology", source: "Career Page" },
      { title: "PA – Emergency Medicine Roseville", type: "Full-time", dept: "Emergency", source: "Indeed" },
    ],
    color: "#00457C",
  },
  {
    id: 7,
    name: "Marshall Medical Center",
    system: "Marshall Medical Centers",
    type: "Nonprofit Independent Hospital",
    pslf: true,
    pslf_note: "Independent nonprofit — verify EIN via PSLF Help Tool; likely qualifies",
    locations: ["El Dorado Hills", "Cameron Park", "Folsom (clinics)"],
    specialties: ["Emergency Medicine", "Blue Zones Community Health", "Orthopedics", "General Surgery", "Cardiac"],
    beds: 125,
    rank: "Dominant El Dorado County (~70% of discharges)",
    careersUrl: "https://www.marshallmedical.org/careers",
    indeedUrl: "https://www.indeed.com/q-marshall-medical-physician-assistant-l-el-dorado-hills,-ca-jobs.html",
    linkedinUrl: "https://www.linkedin.com/company/marshall-medical-centers/jobs",
    paJobs: [
      { title: "Physician Assistant – Emergency Department", type: "Full-time", dept: "Emergency", source: "Career Page" },
      { title: "PA – Orthopedic Surgery", type: "Full-time", dept: "Orthopedics", source: "Indeed" },
    ],
    color: "#5C7A3E",
    note: "Expanding fast — Blue Zones initiative. Close to Folsom/El Dorado Hills suburbs.",
  },
  {
    id: 8,
    name: "Shriners Children's Northern California",
    system: "Shriners International",
    type: "Nonprofit Pediatric Specialty Hospital",
    pslf: true,
    pslf_note: "Shriners is 501(c)(3) — qualifies for PSLF",
    locations: ["Sacramento (near UC Davis)"],
    specialties: ["Pediatric Orthopedics", "Burns", "Spinal Cord", "Cleft Lip/Palate", "Neuroscience"],
    beds: 70,
    rank: "Specialty – nationally recognized pediatric care",
    careersUrl: "https://www.shrinerschildrens.org/en/locations/northern-california/careers",
    indeedUrl: "https://www.indeed.com/q-shriners-physician-assistant-l-sacramento,-ca-jobs.html",
    linkedinUrl: "https://www.linkedin.com/company/shriners-hospitals-for-children/jobs",
    paJobs: [
      { title: "PA – Pediatric Orthopedics", type: "Full-time", dept: "Pediatric Ortho", source: "Career Page" },
    ],
    color: "#C4860A",
  },
  {
    id: 9,
    name: "Methodist Hospital of Sacramento",
    system: "Dignity Health (CommonSpirit)",
    type: "Nonprofit Catholic Health System",
    pslf: true,
    pslf_note: "CommonSpirit / Dignity Health 501(c)(3) — PSLF eligible",
    locations: ["South Sacramento"],
    specialties: ["Emergency Medicine", "Cardiac", "Behavioral Health", "Surgery", "Maternity"],
    beds: 320,
    rank: "High Medi-Cal volume — community anchor",
    careersUrl: "https://careers.dignityhealth.org/",
    indeedUrl: "https://www.indeed.com/q-dignity-health-physician-assistant-l-sacramento,-ca-jobs.html",
    linkedinUrl: "https://www.linkedin.com/company/dignity-health/jobs",
    paJobs: [
      { title: "Physician Assistant – Hospitalist", type: "Full-time", dept: "Hospital Medicine", source: "Indeed" },
    ],
    color: "#7B3F9E",
  },
  {
    id: 10,
    name: "Adventist Health Roseville",
    system: "Adventist Health",
    type: "Nonprofit Adventist Health System",
    pslf: true,
    pslf_note: "Adventist Health is 501(c)(3) nonprofit — verify EIN; generally PSLF-eligible",
    locations: ["Roseville", "Citrus Heights"],
    specialties: ["Cardiac", "Cancer", "Women's Health", "Orthopedics", "Behavioral Health"],
    beds: 302,
    rank: "Major Placer County Community Hospital",
    careersUrl: "https://www.adventisthealth.org/careers/",
    indeedUrl: "https://www.indeed.com/q-adventist-health-physician-assistant-l-roseville,-ca-jobs.html",
    linkedinUrl: "https://www.linkedin.com/company/adventist-health/jobs",
    paJobs: [
      { title: "Physician Assistant – Emergency Medicine", type: "Full-time", dept: "Emergency", source: "Career Page" },
      { title: "PA – Cardiology", type: "Part-time", dept: "Cardiology", source: "Indeed" },
    ],
    color: "#1A6FA3",
  },
];

const CA_BENEFITS = [
  {
    category: "🏠 New Home Buyer",
    icon: "🏠",
    programs: [
      {
        name: "CalHFA MyHome Assistance",
        amount: "Up to 3.5% of purchase price",
        type: "Deferred-Payment Silent Second",
        relevance: "high",
        description: "Zero-payment junior loan covering down payment and/or closing costs. No monthly payments until you sell, refi, or pay off. Must be first-time buyer (no ownership in past 3 years).",
        url: "https://www.calhfa.ca.gov/homebuyer/programs/myhome.htm",
        jeff_note: "You qualify as first-time buyer if you haven't owned in Iowa or CA in 3+ years. Huge for Sacramento suburbs.",
      },
      {
        name: "California Dream For All",
        amount: "Up to 20% of purchase price (max $150K)",
        type: "Shared Appreciation Loan",
        relevance: "high",
        description: "State covers 20% of purchase price as a shared appreciation loan. Repaid (plus 15–20% of home appreciation) when you sell or refi. Portal currently closed — watch for 2027 reopening.",
        url: "https://www.calhfa.ca.gov/dream/",
        jeff_note: "If this reopens before your 2027 move, this is the single biggest homebuyer benefit in California. Apply as soon as it opens.",
      },
      {
        name: "GSFA Platinum Program",
        amount: "Up to 5.5% of loan amount",
        type: "15-Year Second Mortgage",
        relevance: "medium",
        description: "Down payment and closing cost assistance available for first-time and repeat buyers. Works with conventional, FHA, VA, or USDA loans. Requires monthly repayment (not deferred).",
        url: "https://gsfahome.org/sf/platinum/index.shtml",
        jeff_note: "Good backup if CalHFA is closed or you're not first-time eligible by 2027.",
      },
      {
        name: "CalHFA VA Loan",
        amount: "0% down + CalHFA rate",
        type: "VA-Insured Fixed Rate",
        relevance: "low",
        description: "VA-insured 30-year fixed mortgage through CalHFA's network. Requires military eligibility.",
        url: "https://www.calhfa.ca.gov/homebuyer/programs/index.htm",
        jeff_note: "N/A unless you have VA eligibility.",
      },
      {
        name: "Mortgage Credit Certificate (MCC)",
        amount: "Up to 20% of mortgage interest as federal tax credit (annually)",
        type: "Federal Tax Credit",
        relevance: "high",
        description: "A first-time homebuyer credit that converts a portion of your mortgage interest into a dollar-for-dollar federal tax credit every year. Stackable with CalHFA loans.",
        url: "https://www.calhfa.ca.gov/homebuyer/programs/mcc.htm",
        jeff_note: "As a PA-C earning $130–160K, this credit could save you $2,000–$4,000/year in federal taxes. Stack this with MyHome.",
      },
      {
        name: "Proposition 13 Property Tax Cap",
        amount: "Max 2% annual increase on assessed value",
        type: "State Constitutional Benefit",
        relevance: "high",
        description: "California's Prop 13 caps property tax increases at 2% per year once you buy. In fast-appreciating Sacramento suburbs like Elk Grove and Folsom, this is a massive long-term shield.",
        url: "https://www.boe.ca.gov/proptaxes/propertystatement.htm",
        jeff_note: "Buy in 2027, lock in your base assessment. Your neighbors who bought in 2015 pay on a much lower base — you'll benefit for decades.",
      },
    ],
  },
  {
    category: "👶 New Parent",
    icon: "👶",
    programs: [
      {
        name: "California Paid Family Leave (PFL)",
        amount: "70–90% of wages, up to $1,681/week",
        type: "State Wage Replacement — 8 Weeks",
        relevance: "high",
        description: "California's PFL program provides up to 8 weeks of partial wage replacement for bonding with a new child. As of January 2025, workers earn up to 90% of wages if earning under ~$62K/year.",
        url: "https://edd.ca.gov/en/disability/paid-family-leave/",
        jeff_note: "As a PA-C you're a higher earner — your rate will likely be ~70%. Both partners can use PFL independently. Non-birthing partners also eligible.",
      },
      {
        name: "State Disability Insurance (SDI) – Pregnancy",
        amount: "70–90% of wages, up to $1,681/week",
        type: "State Wage Replacement — Up to 12+ Weeks",
        relevance: "high",
        description: "SDI covers the birthing parent's disability period — typically 4 weeks pre-birth + 6–8 weeks recovery (longer for C-section). After SDI ends, PFL bonding begins, giving up to ~5 months combined.",
        url: "https://edd.ca.gov/en/disability/",
        jeff_note: "Your partner can stack SDI + PFL for ~4–5 months of paid time off. California is one of the most generous states for this.",
      },
      {
        name: "California Family Rights Act (CFRA)",
        amount: "Up to 12 weeks job-protected leave",
        type: "Job Protection (Unpaid)",
        relevance: "high",
        description: "CFRA guarantees job protection for bonding leave, separate from disability. Applies to employers with 5+ employees. Stacks after PDL/SDI ends — total leave can reach ~7 months for birthing parent.",
        url: "https://calcivilrights.ca.gov/cfra/",
        jeff_note: "Works with your employer's FMLA too. Even if you're traveling or working per diem, CFRA protects full-time W-2 roles.",
      },
      {
        name: "CalKIDS College Savings Program",
        amount: "Up to $100 seed deposit + up to $1,000 via Covered CA",
        type: "Free State 529-Linked Savings Account",
        relevance: "high",
        description: "Every California baby born after July 1, 2022 gets an automatic CalKIDS account with a $25 seed. Register online for +$25, link to ScholarShare 529 for +$50. Covered CA members can earn up to $1,000 more for completing well-child visits.",
        url: "https://calkids.org/",
        jeff_note: "Your future child born in California automatically gets enrolled. Register on calkids.org to claim your funds immediately after birth.",
      },
      {
        name: "ScholarShare 529 Plan",
        amount: "Tax-deferred growth + federal/state tax-free withdrawals",
        type: "College Savings — Tax-Advantaged Account",
        relevance: "high",
        description: "California's official 529 college savings plan. No state deduction on contributions, but withdrawals for education expenses are federally and state tax-free. Link to CalKIDS to view balances together.",
        url: "https://www.scholarshare529.com/",
        jeff_note: "Open this when baby is born. Low-cost Vanguard and Fidelity index fund options available. Start immediately to maximize 18-year compounding.",
      },
      {
        name: "Medi-Cal for Newborns",
        amount: "Free health coverage for children under 19",
        type: "Public Health Insurance",
        relevance: "medium",
        description: "California extends Medi-Cal eligibility to all children regardless of immigration status. Children in households up to 266% FPL qualify. Even if you don't qualify, your newborn may be eligible for a transition period.",
        url: "https://www.dhcs.ca.gov/",
        jeff_note: "At PA-C income, your child likely won't qualify long-term, but know this option exists if you ever need it.",
      },
    ],
  },
  {
    category: "🎓 Loan Forgiveness (Healthcare)",
    icon: "🎓",
    programs: [
      {
        name: "Public Service Loan Forgiveness (PSLF)",
        amount: "Full remaining federal loan balance tax-free",
        type: "Federal — 120 Qualifying Payments (10 years)",
        relevance: "high",
        description: "Work full-time at any 501(c)(3) or government employer (like UC Davis, Sutter, Kaiser, Dignity Health) and make 120 qualifying payments on an IDR plan. Remaining balance forgiven tax-free. You need Direct Loans + IDR plan (IBR, PAYE, SAVE/RAP).",
        url: "https://studentaid.gov/manage-loans/forgiveness-cancellation/public-service",
        jeff_note: "Every hospital in this guide is PSLF-eligible. If you have federal loans and move to Sacramento in 2027, PSLF should be a core strategy. Track payments from Day 1 using studentaid.gov's PSLF Help Tool.",
      },
      {
        name: "CA State Loan Repayment Program (CA-SLRP)",
        amount: "Up to $50,000 for 2–4 year service commitment",
        type: "State — Health Professional Shortage Area",
        relevance: "high",
        description: "Physician Assistants working in federally designated HPSAs in California can receive up to $50K in loan repayment, matched dollar-for-dollar by the practice site. Applications open July 15, 2025 (check annually).",
        url: "https://hcai.ca.gov/workforce/financial-assistance/loan-repayment/slrp/",
        jeff_note: "Parts of Sacramento County and surrounding areas have HPSA designations. Emergency Medicine PAs working in qualifying sites are eligible. Stack with PSLF.",
      },
      {
        name: "NHSC Loan Repayment Program",
        amount: "Up to $50,000 (2-year commitment, HPSA sites)",
        type: "Federal — National Health Service Corps",
        relevance: "high",
        description: "NHSC awards PAs up to $50K for working 2 years at federally approved HPSA sites. Higher HPSA scores = more money. Can be stacked with CA-SLRP in some cases. Also stackable with PSLF credit toward 120 payments.",
        url: "https://nhsc.hrsa.gov/loan-repayment",
        jeff_note: "Federally Qualified Health Centers (FQHCs) in Sacramento often qualify. Check NHSC site locator for approved Sacramento-area sites.",
      },
      {
        name: "Song-Brown PA Residency Program",
        amount: "Training stipend / scholarship",
        type: "State — Workforce Development",
        relevance: "medium",
        description: "California's Song-Brown program funds PA residency training at community health centers, FQHCs, and rural/underserved clinics. Not direct loan repayment, but reduces debt incurred during training.",
        url: "https://hcai.ca.gov/workforce/financial-assistance/songbrown/",
        jeff_note: "More relevant if you ever supervise PA students or take a fellowship position in Sacramento.",
      },
    ],
  },
];

const SYSTEMS = ["All Systems", "UC Davis Health", "Sutter Health", "Dignity Health (CommonSpirit)", "Kaiser Permanente", "Marshall Medical Centers", "Shriners International", "Adventist Health"];

export default function App() {
  const [tab, setTab] = useState("hospitals");
  const [selectedSystem, setSelectedSystem] = useState("All Systems");
  const [expandedHospital, setExpandedHospital] = useState(null);
  const [expandedBenefit, setExpandedBenefit] = useState(null);
  const [benefitCategory, setBenefitCategory] = useState("All");
  const [showPSLFOnly, setShowPSLFOnly] = useState(false);
  const [jobView, setJobView] = useState("all");

  const filteredHospitals = HOSPITALS.filter(h => {
    const systemMatch = selectedSystem === "All Systems" || h.system === selectedSystem;
    const pslfMatch = !showPSLFOnly || h.pslf;
    return systemMatch && pslfMatch;
  });

  const allJobs = HOSPITALS.flatMap(h =>
    h.paJobs.map(j => ({ ...j, hospital: h.name, system: h.system, pslf: h.pslf, color: h.color }))
  );

  const filteredJobs = jobView === "all" ? allJobs : allJobs.filter(j => j.source === jobView || (jobView === "PSLF" && j.pslf));

  const benefitCategories = ["All", "🏠 New Home Buyer", "👶 New Parent", "🎓 Loan Forgiveness (Healthcare)"];
  const filteredBenefits = CA_BENEFITS.filter(b => benefitCategory === "All" || b.category === benefitCategory);

  const tabs = [
    { id: "hospitals", label: "Hospitals & Clinics", icon: "🏥" },
    { id: "jobs", label: "PA Job Board", icon: "💼" },
    { id: "benefits", label: "CA Benefits", icon: "⭐" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D0F14",
      color: "#E8EAF0",
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0D1B2A 0%, #1A2C42 50%, #0D1B2A 100%)",
        borderBottom: "1px solid #1E3A5F",
        padding: "28px 32px 0",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 28 }}>🏥</span>
                <h1 style={{
                  margin: 0,
                  fontSize: 26,
                  fontWeight: 700,
                  background: "linear-gradient(90deg, #4FC3F7, #81D4FA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.5px",
                }}>Sacramento Healthcare Hub</h1>
              </div>
              <p style={{ margin: 0, color: "#7B9CC4", fontSize: 14 }}>
                Greater Sacramento Region · PSLF-Eligible Employers · PA Jobs · California Resident Benefits
              </p>
            </div>
            <div style={{
              background: "#1A3A5C",
              border: "1px solid #2E5A8A",
              borderRadius: 10,
              padding: "10px 16px",
              textAlign: "right",
            }}>
              <div style={{ fontSize: 11, color: "#4FC3F7", fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>YOUR TARGET MOVE</div>
              <div style={{ fontSize: 13, color: "#E8EAF0", fontWeight: 500 }}>Sept / Oct 2027</div>
              <div style={{ fontSize: 11, color: "#7B9CC4" }}>Elk Grove · Roseville · Folsom · Rancho Cordova</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4 }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  background: tab === t.id ? "#1E3A5F" : "transparent",
                  border: "none",
                  borderBottom: tab === t.id ? "2px solid #4FC3F7" : "2px solid transparent",
                  color: tab === t.id ? "#4FC3F7" : "#7B9CC4",
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: tab === t.id ? 600 : 400,
                  cursor: "pointer",
                  borderRadius: "6px 6px 0 0",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  transition: "all 0.15s",
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 32px" }}>

        {/* ───────────── HOSPITALS TAB ───────────── */}
        {tab === "hospitals" && (
          <div>
            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
              <select
                value={selectedSystem}
                onChange={e => setSelectedSystem(e.target.value)}
                style={{
                  background: "#141822",
                  border: "1px solid #2A3547",
                  color: "#E8EAF0",
                  padding: "8px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {SYSTEMS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#7B9CC4" }}>
                <input
                  type="checkbox"
                  checked={showPSLFOnly}
                  onChange={e => setShowPSLFOnly(e.target.checked)}
                  style={{ accentColor: "#4FC3F7" }}
                />
                PSLF Eligible Only
              </label>

              <div style={{ marginLeft: "auto", fontSize: 13, color: "#4A5568" }}>
                {filteredHospitals.length} facilities shown
              </div>
            </div>

            {/* PSLF Info Banner */}
            <div style={{
              background: "linear-gradient(135deg, #0A2440, #0D2E50)",
              border: "1px solid #1E4976",
              borderRadius: 10,
              padding: "14px 18px",
              marginBottom: 24,
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>🔵</span>
              <div>
                <div style={{ fontWeight: 600, color: "#4FC3F7", fontSize: 13, marginBottom: 4 }}>How PSLF Works for PAs in Sacramento</div>
                <div style={{ fontSize: 12, color: "#7B9CC4", lineHeight: 1.6 }}>
                  Every major Sacramento health system is PSLF-eligible. You need Direct federal loans + an IDR plan (IBR, or the new RAP launching July 2026) + 120 on-time monthly payments while employed full-time at a qualifying employer.
                  Note: The SAVE plan was eliminated in Dec 2025. New borrowers after July 2026 use the Repayment Assistance Plan (RAP). Always verify your employer's EIN at <span style={{ color: "#4FC3F7" }}>studentaid.gov/pslf</span>.
                </div>
              </div>
            </div>

            {/* Hospital Cards */}
            <div style={{ display: "grid", gap: 14 }}>
              {filteredHospitals.map(h => (
                <div
                  key={h.id}
                  style={{
                    background: "#141822",
                    border: `1px solid ${expandedHospital === h.id ? h.color : "#1E2A3A"}`,
                    borderRadius: 12,
                    overflow: "hidden",
                    transition: "border-color 0.2s",
                  }}
                >
                  {/* Card Header */}
                  <div
                    onClick={() => setExpandedHospital(expandedHospital === h.id ? null : h.id)}
                    style={{
                      padding: "18px 20px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                    }}
                  >
                    {/* Color bar */}
                    <div style={{
                      width: 4,
                      minHeight: 50,
                      borderRadius: 2,
                      background: h.color,
                      flexShrink: 0,
                      alignSelf: "stretch",
                    }} />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: "#E8EAF0" }}>{h.name}</span>
                        {h.pslf && (
                          <span style={{
                            background: "rgba(34,197,94,0.15)",
                            border: "1px solid rgba(34,197,94,0.4)",
                            color: "#4ADE80",
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 20,
                            letterSpacing: 0.5,
                          }}>✓ PSLF ELIGIBLE</span>
                        )}
                        {h.note && (
                          <span style={{
                            background: "rgba(251,191,36,0.12)",
                            border: "1px solid rgba(251,191,36,0.3)",
                            color: "#FCD34D",
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 20,
                          }}>★ TARGET</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "#7B9CC4", marginBottom: 8 }}>
                        {h.system} · {h.type} · {h.beds} beds
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, color: "#4A90B8", background: "#0D1E30", padding: "3px 8px", borderRadius: 6 }}>
                          📍 {h.locations[0]}{h.locations.length > 1 ? ` +${h.locations.length - 1} more` : ""}
                        </span>
                        <span style={{ fontSize: 11, color: "#9CA3AF", background: "#1A2030", padding: "3px 8px", borderRadius: 6 }}>
                          {h.rank}
                        </span>
                        <span style={{ fontSize: 11, color: "#6EE7B7", background: "#0D2518", padding: "3px 8px", borderRadius: 6 }}>
                          💼 {h.paJobs.length} PA opening{h.paJobs.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div style={{ color: "#4A5568", fontSize: 18, flexShrink: 0 }}>
                      {expandedHospital === h.id ? "▲" : "▼"}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedHospital === h.id && (
                    <div style={{ borderTop: "1px solid #1E2A3A", padding: "18px 24px" }}>

                      {h.note && (
                        <div style={{
                          background: "rgba(251,191,36,0.08)",
                          border: "1px solid rgba(251,191,36,0.25)",
                          borderRadius: 8,
                          padding: "10px 14px",
                          marginBottom: 16,
                          fontSize: 12,
                          color: "#FCD34D",
                        }}>
                          ⭐ {h.note}
                        </div>
                      )}

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 18 }}>
                        <div>
                          <div style={{ fontSize: 11, color: "#4FC3F7", fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>ALL LOCATIONS</div>
                          {h.locations.map((l, i) => (
                            <div key={i} style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 3 }}>📍 {l}</div>
                          ))}
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: "#4FC3F7", fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>SPECIALTIES</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                            {h.specialties.map((s, i) => (
                              <span key={i} style={{
                                fontSize: 11,
                                color: "#9CA3AF",
                                background: "#1A2030",
                                padding: "2px 7px",
                                borderRadius: 5,
                              }}>{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* PSLF Status */}
                      <div style={{
                        background: "rgba(34,197,94,0.08)",
                        border: "1px solid rgba(34,197,94,0.2)",
                        borderRadius: 8,
                        padding: "10px 14px",
                        marginBottom: 18,
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#4ADE80" }}>PSLF STATUS: </span>
                        <span style={{ fontSize: 12, color: "#9CA3AF" }}>{h.pslf_note}</span>
                      </div>

                      {/* PA Jobs */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, color: "#4FC3F7", fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>PHYSICIAN ASSISTANT OPENINGS</div>
                        <div style={{ display: "grid", gap: 8 }}>
                          {h.paJobs.map((j, i) => (
                            <div key={i} style={{
                              background: "#0D1420",
                              border: "1px solid #1E2A3A",
                              borderRadius: 8,
                              padding: "10px 14px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#E8EAF0", marginBottom: 3 }}>{j.title}</div>
                                <div style={{ fontSize: 11, color: "#6B7280" }}>{j.dept} · {j.type}</div>
                              </div>
                              <span style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: "3px 8px",
                                borderRadius: 6,
                                background: j.source === "Indeed" ? "rgba(0,102,255,0.15)" : j.source === "LinkedIn" ? "rgba(0,119,181,0.15)" : "rgba(79,195,247,0.12)",
                                color: j.source === "Indeed" ? "#60A5FA" : j.source === "LinkedIn" ? "#7CB9E8" : "#4FC3F7",
                                border: `1px solid ${j.source === "Indeed" ? "rgba(0,102,255,0.3)" : j.source === "LinkedIn" ? "rgba(0,119,181,0.3)" : "rgba(79,195,247,0.25)"}`,
                                whiteSpace: "nowrap",
                              }}>{j.source}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Links */}
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <a href={h.careersUrl} target="_blank" rel="noopener noreferrer" style={{
                          background: h.color,
                          color: "#fff",
                          padding: "8px 16px",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}>🏥 Career Page →</a>
                        <a href={h.indeedUrl} target="_blank" rel="noopener noreferrer" style={{
                          background: "#1A2030",
                          border: "1px solid #2A3547",
                          color: "#60A5FA",
                          padding: "8px 16px",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}>Indeed Jobs →</a>
                        <a href={h.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{
                          background: "#1A2030",
                          border: "1px solid #2A3547",
                          color: "#7CB9E8",
                          padding: "8px 16px",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}>LinkedIn Jobs →</a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───────────── JOBS TAB ───────────── */}
        {tab === "jobs" && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
              {["all", "Career Page", "Indeed", "LinkedIn"].map(v => (
                <button
                  key={v}
                  onClick={() => setJobView(v)}
                  style={{
                    background: jobView === v ? "#1E3A5F" : "#141822",
                    border: `1px solid ${jobView === v ? "#4FC3F7" : "#2A3547"}`,
                    color: jobView === v ? "#4FC3F7" : "#7B9CC4",
                    padding: "7px 16px",
                    borderRadius: 8,
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: jobView === v ? 600 : 400,
                  }}
                >
                  {v === "all" ? "All Sources" : v}
                </button>
              ))}
              <div style={{ marginLeft: "auto", fontSize: 13, color: "#4A5568", alignSelf: "center" }}>
                {filteredJobs.length} openings
              </div>
            </div>

            {/* Quick Apply Banner */}
            <div style={{
              background: "linear-gradient(135deg, #0A2440, #0D2E50)",
              border: "1px solid #1E4976",
              borderRadius: 10,
              padding: "14px 20px",
              marginBottom: 22,
              fontSize: 12,
              color: "#7B9CC4",
              lineHeight: 1.6,
            }}>
              <span style={{ color: "#FCD34D", fontWeight: 700 }}>⚡ Jeff's Strategy: </span>
              Apply to Sutter Health first (your #1 target) — they're expanding in Elk Grove and Roseville.
              UC Davis Health is your PSLF goldmine (government employer, automatic qualifier). Bookmark all career pages now and set alerts for 2026.
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {filteredJobs.map((j, i) => (
                <div key={i} style={{
                  background: "#141822",
                  border: "1px solid #1E2A3A",
                  borderRadius: 10,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}>
                  <div style={{
                    width: 5,
                    height: 50,
                    borderRadius: 3,
                    background: j.color,
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#E8EAF0" }}>{j.title}</span>
                      {j.pslf && (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          background: "rgba(34,197,94,0.12)",
                          border: "1px solid rgba(34,197,94,0.3)",
                          color: "#4ADE80",
                          padding: "1px 7px",
                          borderRadius: 10,
                        }}>PSLF ✓</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>
                      {j.hospital} · {j.dept} · {j.type}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 9px",
                      borderRadius: 6,
                      background: j.source === "Indeed" ? "rgba(0,102,255,0.15)" : j.source === "LinkedIn" ? "rgba(0,119,181,0.15)" : "rgba(79,195,247,0.12)",
                      color: j.source === "Indeed" ? "#60A5FA" : j.source === "LinkedIn" ? "#7CB9E8" : "#4FC3F7",
                      border: `1px solid ${j.source === "Indeed" ? "rgba(0,102,255,0.3)" : j.source === "LinkedIn" ? "rgba(0,119,181,0.3)" : "rgba(79,195,247,0.25)"}`,
                    }}>{j.source}</span>
                    <span style={{ fontSize: 10, color: "#4A5568" }}>{j.system}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Job Board Links */}
            <div style={{ marginTop: 28 }}>
              <div style={{ fontSize: 13, color: "#4FC3F7", fontWeight: 600, letterSpacing: 1, marginBottom: 12 }}>SEARCH LIVE PA JOBS NOW</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
                {[
                  { label: "Sutter Health PA Jobs", url: "https://jobs.sutterhealth.org/", color: "#107A6C" },
                  { label: "UC Davis Health PA Jobs", url: "https://health.ucdavis.edu/join-the-team/", color: "#1A6FA3" },
                  { label: "Kaiser PA Jobs", url: "https://jobs.kaiserpermanente.org/", color: "#00457C" },
                  { label: "Dignity Health PA Jobs", url: "https://careers.dignityhealth.org/", color: "#7B3F9E" },
                  { label: "Indeed PA Jobs Sacramento", url: "https://www.indeed.com/q-physician-assistant-l-sacramento,-ca-jobs.html", color: "#2357DE" },
                  { label: "LinkedIn PA Jobs Sacramento", url: "https://www.linkedin.com/jobs/search/?keywords=physician+assistant&location=Sacramento%2C+CA", color: "#0077B5" },
                ].map((l, i) => (
                  <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{
                    background: "#141822",
                    border: `1px solid ${l.color}40`,
                    borderLeft: `3px solid ${l.color}`,
                    borderRadius: 8,
                    padding: "12px 16px",
                    color: "#E8EAF0",
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "background 0.15s",
                  }}>
                    {l.label} <span style={{ color: l.color }}>→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ───────────── BENEFITS TAB ───────────── */}
        {tab === "benefits" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "#7B9CC4", marginBottom: 14, lineHeight: 1.6 }}>
                <span style={{ color: "#FCD34D", fontWeight: 700 }}>Personalized for you, Jeff: </span>
                PA-C relocating to Sacramento ~2027, planning to propose and start a family, first-time home buyer, federal student loans, Roth IRA active investor.
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {benefitCategories.map(c => (
                  <button
                    key={c}
                    onClick={() => setBenefitCategory(c)}
                    style={{
                      background: benefitCategory === c ? "#1E3A5F" : "#141822",
                      border: `1px solid ${benefitCategory === c ? "#4FC3F7" : "#2A3547"}`,
                      color: benefitCategory === c ? "#4FC3F7" : "#7B9CC4",
                      padding: "7px 16px",
                      borderRadius: 8,
                      fontSize: 13,
                      cursor: "pointer",
                      fontWeight: benefitCategory === c ? 600 : 400,
                    }}
                  >{c}</button>
                ))}
              </div>
            </div>

            {filteredBenefits.map((cat, ci) => (
              <div key={ci} style={{ marginBottom: 32 }}>
                <div style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#E8EAF0",
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <span style={{ fontSize: 20 }}>{cat.icon}</span>
                  {cat.category.replace(/^.+? /, "")}
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  {cat.programs.map((p, pi) => (
                    <div
                      key={pi}
                      style={{
                        background: "#141822",
                        border: `1px solid ${expandedBenefit === `${ci}-${pi}` ? (p.relevance === "high" ? "#22C55E" : p.relevance === "medium" ? "#F59E0B" : "#6B7280") : "#1E2A3A"}`,
                        borderRadius: 10,
                        overflow: "hidden",
                        transition: "border-color 0.2s",
                      }}
                    >
                      <div
                        onClick={() => setExpandedBenefit(expandedBenefit === `${ci}-${pi}` ? null : `${ci}-${pi}`)}
                        style={{
                          padding: "16px 18px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 14,
                        }}
                      >
                        <div style={{
                          flexShrink: 0,
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: p.relevance === "high" ? "#22C55E" : p.relevance === "medium" ? "#F59E0B" : "#6B7280",
                          marginTop: 6,
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#E8EAF0" }}>{p.name}</span>
                            <span style={{
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: 10,
                              background: p.relevance === "high" ? "rgba(34,197,94,0.12)" : p.relevance === "medium" ? "rgba(245,158,11,0.12)" : "rgba(107,114,128,0.12)",
                              color: p.relevance === "high" ? "#4ADE80" : p.relevance === "medium" ? "#FCD34D" : "#9CA3AF",
                              border: `1px solid ${p.relevance === "high" ? "rgba(34,197,94,0.3)" : p.relevance === "medium" ? "rgba(245,158,11,0.3)" : "rgba(107,114,128,0.3)"}`,
                            }}>
                              {p.relevance === "high" ? "★ HIGH RELEVANCE" : p.relevance === "medium" ? "◎ MEDIUM" : "○ LOW"}
                            </span>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#4FC3F7", marginBottom: 3 }}>{p.amount}</div>
                          <div style={{ fontSize: 12, color: "#6B7280" }}>{p.type}</div>
                        </div>
                        <div style={{ color: "#4A5568", fontSize: 16, flexShrink: 0 }}>
                          {expandedBenefit === `${ci}-${pi}` ? "▲" : "▼"}
                        </div>
                      </div>

                      {expandedBenefit === `${ci}-${pi}` && (
                        <div style={{ borderTop: "1px solid #1E2A3A", padding: "16px 18px 18px 40px" }}>
                          <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 14, lineHeight: 1.7 }}>{p.description}</p>

                          <div style={{
                            background: "rgba(251,191,36,0.08)",
                            border: "1px solid rgba(251,191,36,0.25)",
                            borderRadius: 8,
                            padding: "10px 14px",
                            marginBottom: 14,
                          }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#FCD34D", marginBottom: 4 }}>FOR YOU, JEFF:</div>
                            <div style={{ fontSize: 12, color: "#D1A72A", lineHeight: 1.6 }}>{p.jeff_note}</div>
                          </div>

                          <a href={p.url} target="_blank" rel="noopener noreferrer" style={{
                            background: "#1E3A5F",
                            border: "1px solid #2E5A8A",
                            color: "#4FC3F7",
                            padding: "8px 16px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                          }}>Learn More & Apply →</a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Bottom summary card */}
            <div style={{
              background: "linear-gradient(135deg, #0A2440, #112B3C)",
              border: "1px solid #1E4976",
              borderRadius: 12,
              padding: "20px 22px",
              marginTop: 10,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#4FC3F7", marginBottom: 12 }}>📋 Jeff's Priority Action List for 2027</div>
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  "1. Confirm federal loan type (Direct Loans) and enroll in IBR or RAP before moving",
                  "2. Apply to Sutter Health and UC Davis Health 6–12 months before target move",
                  "3. Get PSLF Employment Certification Form signed at your first qualifying employer",
                  "4. After buying home: file for MCC (Mortgage Credit Certificate) with a CalHFA lender",
                  "5. Apply for CalHFA MyHome Assistance — check Dream For All reopening in 2026",
                  "6. After baby is born in CA: claim CalKIDS account at calkids.org immediately",
                  "7. Open ScholarShare 529 and link to CalKIDS for the extra $50 bonus deposit",
                  "8. Partner files for SDI (pregnancy disability) + PFL (bonding) through CA EDD",
                ].map((item, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.6, display: "flex", gap: 10 }}>
                    <span style={{ color: "#4FC3F7", flexShrink: 0 }}>{item.split(" ")[0]}</span>
                    <span>{item.substring(item.indexOf(" ") + 1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
