import { useState, useMemo } from "react";

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#0A0C10", surface: "#161B22", surfaceAlt: "#0d1117",
  border: "#30363D", border2: "#21262d",
  text: "#C9D1D9", muted: "#8B949E", dim: "#484f58",
  blue: "#58A6FF", amber: "#D29922", green: "#3FB950",
  red: "#F85149", violet: "#A371F7", teal: "#39C5BB",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const TRIP = {
  destination: "Sacramento + Lake Tahoe",
  region: "Sacramento (base) · Lake Tahoe day trip",
  dates: "May 30 – Jun 4, 2026",
  travelers: 2,
  nights: 5,
  status: "Confirmed",
};

const DAYS = [
  { day: 1, date: "May 30", phase: "arrival",   region: "Sacramento (SMF)",         title: "Arrival + Old Sac",     lodging: "Kimpton Sawyer", notes: "Land SMF mid-day. Pick up rental SUV. Check in at Kimpton Sawyer. Walk Old Sacramento waterfront. Dinner at The Firehouse." },
  { day: 2, date: "May 31", phase: "city",      region: "Downtown Sacramento",      title: "Capitol + Midtown",     lodging: "Kimpton Sawyer", notes: "CA State Capitol tour AM. Crocker Art Museum. Midtown food crawl + craft cocktails on R St." },
  { day: 3, date: "Jun 1",  phase: "city",      region: "Sacramento River + Land Park", title: "River + Land Park", lodging: "Kimpton Sawyer", notes: "Tower Bridge + riverwalk AM. Lunch in Land Park. Afternoon at Sacramento Zoo / Fairytale Town. Evening Kings/River Cats game or Golden 1 area." },
  { day: 4, date: "Jun 2",  phase: "alpine",    region: "Lake Tahoe (day trip)",    title: "Tahoe Day Trip",        lodging: "Kimpton Sawyer", notes: "Early start ~6 AM. ~2 hr drive via US-50 to South Lake Tahoe. Emerald Bay / Eagle Falls hike. Lunch lakeside. Sand Harbor (NV) swim + paddleboard PM. Drive back to Sacramento for late dinner." },
  { day: 5, date: "Jun 3",  phase: "city",      region: "Old Sugar Mill + Davis",   title: "Wine + Davis",          lodging: "Kimpton Sawyer", notes: "Old Sugar Mill wineries in Clarksburg AM. Lunch in Davis. UC Davis arboretum stroll. Return to Sac for farm-to-fork dinner." },
  { day: 6, date: "Jun 4",  phase: "departure", region: "Sacramento → SMF",         title: "Departure",             lodging: "—",              notes: "Coffee at Temple. Quick Midtown stroll. Return rental at SMF. Evening flight home." },
];

const PHASE_META: Record<string, { label: string; color: string }> = {
  arrival:   { label: "Arrival",   color: C.blue },
  city:      { label: "City",      color: C.teal },
  transit:   { label: "Transit",   color: C.amber },
  alpine:    { label: "Alpine",    color: C.green },
  departure: { label: "Departure", color: C.violet },
};

const LODGING = [
  { id: "sawyer",   name: "Kimpton Sawyer Hotel",  nights: 5, region: "Downtown Sacramento", type: "Boutique",   conf: "KMP-3318-SAC", price: 1350, status: "Confirmed" },
];

const FLIGHTS = [
  { id: "out",  leg: "Outbound", route: "IAH → SMF", carrier: "United 2214", dep: "May 30 · 08:10", arr: "May 30 · 10:35", seats: "14A / 14B", status: "Ticketed" },
  { id: "back", leg: "Return",   route: "SMF → IAH", carrier: "United 1827", dep: "Jun 4 · 19:25",  arr: "Jun 5 · 00:50",  seats: "11C / 11D", status: "Ticketed" },
];

const ACTIVITIES = [
  { id: "capitol", title: "CA State Capitol Tour",     day: 2, status: "Open",    cost: 0,   vendor: "Self-guided" },
  { id: "crocker", title: "Crocker Art Museum",        day: 2, status: "Booked",  cost: 30,  vendor: "Crocker Museum" },
  { id: "zoo",     title: "Sacramento Zoo",            day: 3, status: "Booked",  cost: 40,  vendor: "Sacramento Zoo" },
  { id: "eagle",   title: "Eagle Falls / Emerald Bay", day: 4, status: "Open",    cost: 10,  vendor: "CA State Parks" },
  { id: "sand",    title: "Sand Harbor Paddleboard",   day: 4, status: "Booked",  cost: 80,  vendor: "Tahoe Adventure Co." },
  { id: "wine",    title: "Old Sugar Mill Tasting",    day: 5, status: "Booked",  cost: 60,  vendor: "Old Sugar Mill" },
];

const BUDGET = [
  { cat: "Flights",    planned: 780,  actual: 742, color: C.blue },
  { cat: "Lodging",    planned: 1350, actual: 1350, color: C.green },
  { cat: "Rental Car", planned: 480,  actual: 442,  color: C.amber },
  { cat: "Activities", planned: 320,  actual: 290,  color: C.teal },
  { cat: "Food",       planned: 700,  actual: 0,    color: C.violet },
  { cat: "Misc",       planned: 250,  actual: 0,    color: C.red },
];

const PACKING = [
  { cat: "Documents",  items: ["Driver's license / REAL ID", "Insurance card", "Rental car confirmation", "Hotel confirmations", "Printed itinerary"] },
  { cat: "Tech",       items: ["Phone + charger", "Power bank", "Car USB-C adapter", "GoPro + mounts", "Kindle"] },
  { cat: "Apparel",    items: ["T-shirts ×5", "Hiking pants ×2", "Swimsuit ×2", "Trail runners", "Light puffer (Tahoe nights)", "Rain shell"] },
  { cat: "Health",     items: ["Sunscreen SPF 50", "Lip balm SPF", "Electrolytes (altitude)", "Ibuprofen", "Bandaids + moleskin"] },
];

// Tahoe day-trip specific packing (rendered separately in Packing tab)
const TAHOE_PACKING = [
  { cat: "Layers",         items: ["Base layer long-sleeve ×2", "Mid-layer fleece", "Light puffer jacket", "Wool beanie", "Sun hat / cap", "Lightweight gloves"] },
  { cat: "Waterproof",     items: ["Rain shell (packable)", "Dry bag 10L for phone/wallet", "Quick-dry towel ×2", "Waterproof phone pouch", "Zip-loc bags for wet swimwear"] },
  { cat: "Swim + Water",   items: ["Swimsuit ×2 (each)", "Rash guard / UPF top", "Water shoes", "Goggles", "Microfiber beach towel", "Reef-safe sunscreen"] },
  { cat: "Cables + Power", items: ["USB-C car charger (dual port)", "20K mAh power bank", "Lightning + USB-C cables ×2", "GoPro charging cable", "Spare GoPro batteries ×2", "MicroSD card backup"] },
  { cat: "Vehicle",        items: ["Tire chains (rental — check trunk)", "Ice scraper", "Jumper cables / portable jump pack", "Roadside emergency kit", "Paper map of Tahoe basin (no signal areas)", "Cash for tolls/parking ($40)"] },
  { cat: "Trail + Snacks", items: ["2L water per person", "Electrolyte tabs (altitude)", "Trail bars ×6", "Trail mix + jerky", "Daypack 20L", "Trekking poles (optional)", "Headlamp (return after dark)"] },
];

const STATUS_COLOR: Record<string, string> = { Confirmed: C.green, Ticketed: C.green, Booked: C.green, Open: C.amber, Pending: C.amber };

// ─── TRIP REGISTRY ────────────────────────────────────────────────────────────
type TripId = "california" | "costa-rica" | "galena";
type TripSummary = {
  id: TripId;
  label: string;            // short label for switcher
  destination: string;
  region: string;
  dates: string;
  travelers: number;
  nights: number;
  status: string;
  flag: string;             // emoji
  color: string;
  headline: string;
  highlights: string[];
  lodging: string;
  budget: number;
  notes: string;
};

const TRIPS: TripSummary[] = [
  {
    id: "california", label: "California",
    destination: "Sacramento + Lake Tahoe",
    region: "Sacramento (base) · Lake Tahoe day trip",
    dates: "May 30 – Jun 4, 2026",
    travelers: 2, nights: 5, status: "Confirmed",
    flag: "🐻", color: C.blue,
    headline: "6-day California capital + alpine day trip",
    highlights: ["Old Sacramento + State Capitol", "Crocker Art Museum", "Lake Tahoe day trip (Emerald Bay + Sand Harbor)", "Old Sugar Mill wine tasting", "Farm-to-fork dinner"],
    lodging: "Kimpton Sawyer Hotel ×5 nights",
    budget: 3880,
    notes: "Full command center active — see tabs below.",
  },
  {
    id: "costa-rica", label: "Costa Rica",
    destination: "Costa Rica · Arenal + Manuel Antonio",
    region: "La Fortuna (Arenal) → Manuel Antonio coast",
    dates: "Feb 14 – Feb 22, 2026",
    travelers: 2, nights: 8, status: "Completed",
    flag: "🌋", color: C.green,
    headline: "8-day rainforest + Pacific coast loop",
    highlights: ["Arenal Volcano + La Fortuna hot springs", "Sky Tram + zipline at Sky Adventures", "Río Celeste hike (Tenorio NP)", "Drive coast via Monteverde cloud forest", "Manuel Antonio NP wildlife + beach", "Sunset catamaran (Quepos)"],
    lodging: "Tabacón Resort ×3 · Hotel Belmar ×2 · Arenas del Mar ×3",
    budget: 5420,
    notes: "Trip archived — for reference only.",
  },
  {
    id: "galena", label: "Galena, IL",
    destination: "Galena + Dubuque",
    region: "Galena, IL (base) · Dubuque, IA day trip",
    dates: "Oct 10 – Oct 13, 2025",
    travelers: 2, nights: 3, status: "Completed",
    flag: "🍂", color: C.amber,
    headline: "3-night Midwest fall-color long weekend",
    highlights: ["Main Street Galena (shops + Ulysses S. Grant home)", "Galena Cellars wine tasting", "Chestnut Mountain overlook of the Mississippi", "Dubuque day trip · National Mississippi River Museum", "Fenelon Place Elevator (4th St)", "Field of Dreams (Dyersville) optional add-on"],
    lodging: "Goldmoor Inn ×3 nights",
    budget: 1640,
    notes: "Trip archived — for reference only.",
  },
];

// ─── TAHOE DAY-TRIP SCHEDULE ──────────────────────────────────────────────────
type TahoeStop = {
  time: string; kind: string; label: string; loc: string; detail: string;
  cost: number; costNote?: string;
  links?: { label: string; url: string }[];
};

const TAHOE_SCHEDULE: TahoeStop[] = [
  { time: "05:30", kind: "prep",   label: "Wake + Coffee",          loc: "Kimpton Sawyer, Sacramento",   detail: "Quick breakfast at hotel. Fill water bottles. Load car: hiking shoes, swimsuits, towels, GoPro, snacks.",
    cost: 0, costNote: "Included with hotel",
    links: [
      { label: "Hotel Map",   url: "https://maps.google.com/?q=Kimpton+Sawyer+Hotel+Sacramento" },
      { label: "Hotel Site",  url: "https://www.sawyerhotel.com/" },
    ] },
  { time: "06:15", kind: "drive",  label: "Depart Sacramento",      loc: "I-80 E → US-50 E",             detail: "Head east on US-50. Beat the weekend Tahoe traffic. ETA South Lake Tahoe ~08:30. Drive time ~2h 15m, ~100 mi.",
    cost: 32, costNote: "Fuel leg 1 (~$32)",
    links: [
      { label: "Route on Maps",  url: "https://maps.google.com/?saddr=Sacramento,CA&daddr=South+Lake+Tahoe,CA" },
      { label: "Caltrans US-50", url: "https://quickmap.dot.ca.gov/" },
    ] },
  { time: "07:30", kind: "stop",   label: "Pit Stop · Placerville", loc: "Placerville, CA (US-50)",      detail: "Gas + restroom + coffee top-up. ~15 min. Optional pastry at Sweetie Pie's.",
    cost: 18, costNote: "Coffee + pastries (~$18)",
    links: [
      { label: "Map",            url: "https://maps.google.com/?q=Placerville+CA" },
      { label: "Sweetie Pie's",  url: "https://sweetiepiesplacerville.com/" },
    ] },
  { time: "08:45", kind: "arrive", label: "Arrive South Lake Tahoe", loc: "Stateline / Heavenly Village", detail: "First lake view at Echo Summit overlook. Park near Heavenly Village for orientation photos.",
    cost: 8, costNote: "Heavenly Village parking (~$8/hr)",
    links: [
      { label: "Heavenly Village", url: "https://www.theshopsatheavenly.com/" },
      { label: "Map",              url: "https://maps.google.com/?q=Heavenly+Village+South+Lake+Tahoe" },
    ] },
  { time: "09:15", kind: "drive",  label: "Drive to Emerald Bay",   loc: "CA-89 N (Emerald Bay Rd)",     detail: "~25 min along the west shore. Pull off at Inspiration Point for the iconic Emerald Bay shot.",
    cost: 0,
    links: [
      { label: "Inspiration Pt Map", url: "https://maps.google.com/?q=Inspiration+Point+Emerald+Bay" },
    ] },
  { time: "09:45", kind: "hike",   label: "Eagle Falls Trailhead",  loc: "Eagle Falls, Emerald Bay SP",  detail: "Short 1-mile out-and-back to Lower Eagle Falls. Day-use parking lot fills early — arrive before 10. Bring layers.",
    cost: 10, costNote: "CA State Parks day-use ($10)",
    links: [
      { label: "Emerald Bay SP",  url: "https://www.parks.ca.gov/?page_id=506" },
      { label: "Trail Map (AllTrails)", url: "https://www.alltrails.com/trail/us/california/eagle-falls-trail" },
      { label: "Google Maps",     url: "https://maps.google.com/?q=Eagle+Falls+Trailhead" },
    ] },
  { time: "11:30", kind: "stop",   label: "Vikingsholm Overlook",   loc: "Emerald Bay viewpoint",        detail: "Photo stop above Vikingsholm castle. Skip the full 1,000-ft descent to save time.",
    cost: 0, costNote: "Free overlook",
    links: [
      { label: "Vikingsholm info", url: "https://www.parks.ca.gov/?page_id=507" },
      { label: "Map",              url: "https://maps.google.com/?q=Vikingsholm" },
    ] },
  { time: "12:15", kind: "meal",   label: "Lakeside Lunch",         loc: "The Beacon Bar & Grill, Camp Richardson", detail: "Lakeside patio. Order the Rum Runner. ~1h 15m. Reservation at 12:30 (party of 2).",
    cost: 78, costNote: "Lunch for 2 + drinks (~$78)",
    links: [
      { label: "The Beacon",  url: "https://www.camprichardson.com/the-beacon-bar-grill/" },
      { label: "Reservation", url: "https://www.opentable.com/r/the-beacon-bar-and-grill-south-lake-tahoe" },
      { label: "Map",         url: "https://maps.google.com/?q=The+Beacon+Bar+%26+Grill+Camp+Richardson" },
    ] },
  { time: "13:45", kind: "drive",  label: "Drive to Sand Harbor",   loc: "NV-28 N (East Shore)",         detail: "~50 min around the lake into Nevada. Stop at Logan Shoals Vista for east-shore views.",
    cost: 14, costNote: "Fuel leg 2 (~$14)",
    links: [
      { label: "Route on Maps",      url: "https://maps.google.com/?saddr=Camp+Richardson,CA&daddr=Sand+Harbor,NV" },
      { label: "Logan Shoals Vista", url: "https://maps.google.com/?q=Logan+Shoals+Vista+Point" },
    ] },
  { time: "14:45", kind: "swim",   label: "Sand Harbor SP",         loc: "Sand Harbor, Lake Tahoe NV",   detail: "Paddleboard rental (pre-booked, Tahoe Adventure Co.). Swim the boulder coves. NV park entry $15/car (out-of-state).",
    cost: 95, costNote: "$15 park entry + $80 SUP rental",
    links: [
      { label: "Sand Harbor SP",     url: "https://parks.nv.gov/parks/sand-harbor" },
      { label: "Tahoe Adventure Co.", url: "https://tahoeadventurecompany.com/" },
      { label: "Map",                url: "https://maps.google.com/?q=Sand+Harbor+State+Park" },
    ] },
  { time: "17:00", kind: "depart", label: "Depart Sand Harbor",     loc: "NV-28 S → US-50 W",            detail: "Change into dry clothes. Last lake photos. Head back via Spooner Summit.",
    cost: 0,
    links: [
      { label: "Spooner Summit", url: "https://maps.google.com/?q=Spooner+Summit" },
    ] },
  { time: "17:45", kind: "stop",   label: "Dinner Pickup · Tahoe",  loc: "Burger Lounge, Stateline",     detail: "Quick grab-and-go burgers + fries for the drive back. ~20 min stop.",
    cost: 36, costNote: "Dinner for 2 (~$36)",
    links: [
      { label: "Burger Lounge", url: "https://www.burgerlounge.com/locations/" },
      { label: "Map",           url: "https://maps.google.com/?q=Burger+Lounge+Stateline+NV" },
    ] },
  { time: "18:15", kind: "drive",  label: "Return Drive to Sac",    loc: "US-50 W → I-80 W",             detail: "~2h 15m back to Sacramento. Watch for fog through the foothills. Sunset over the Sierras.",
    cost: 32, costNote: "Fuel leg 3 (~$32)",
    links: [
      { label: "Caltrans QuickMap", url: "https://quickmap.dot.ca.gov/" },
    ] },
  { time: "20:45", kind: "arrive", label: "Arrive Kimpton Sawyer",  loc: "Downtown Sacramento",          detail: "Unload car. Hot shower. Quick nightcap at Revival rooftop bar if energy permits.",
    cost: 24, costNote: "Optional nightcap (~$24)",
    links: [
      { label: "Revival Bar", url: "https://www.revivalsacramento.com/" },
      { label: "Map",         url: "https://maps.google.com/?q=Kimpton+Sawyer+Hotel+Sacramento" },
    ] },
  { time: "22:00", kind: "rest",   label: "Lights Out",             loc: "Kimpton Sawyer",               detail: "Recharge phones + GoPro. Set 08:30 alarm for Day 5 (wine country).",
    cost: 0,
    links: [] },
];

type ContingencyNote = { label: string; text: string };
const TAHOE_CONTINGENCY: ContingencyNote[] = [
  { label: "Traffic",   text: "If US-50 closed/slow, reroute via I-80 → CA-89 S to Tahoe City (adds ~30m)." },
  { label: "Weather",   text: "If snow on US-50 (late spring storm possible), carry chains; swap Sand Harbor for Heavenly gondola." },
  { label: "Fatigue",   text: "Cutoff: depart Tahoe NLT 18:00 to guarantee safe return before midnight." },
  { label: "Altitude",  text: "Sand Harbor ~6,225 ft. Hydrate aggressively; electrolytes packed." },
];

const TAHOE_KIND_COLOR: Record<string, string> = {
  prep: C.muted, drive: C.amber, stop: C.dim, arrive: C.blue,
  hike: C.green, meal: C.violet, swim: C.teal, depart: C.amber, rest: C.dim,
};

const TAHOE_STATS = {
  totalDriveMi: 235,
  totalDriveHr: "4 h 45 m",
  departSac: "06:15",
  returnSac: "20:45",
  parkFees: 25,
  elevationGain: "650 ft (Eagle Falls)",
};

// ─── TINY COMPONENTS ──────────────────────────────────────────────────────────
function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", padding: "2px 7px", background: color + "28", color, borderRadius: 1 }}>
      {label}
    </span>
  );
}

function Eyebrow({ children, color = C.blue }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase", color, marginBottom: 5 }}>
      {children}
    </div>
  );
}

function SecHead({ eyebrow, title, meta, color }: { eyebrow: string; title: string; meta?: string; color?: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <Eyebrow color={color || C.blue}>{eyebrow}</Eyebrow>
      <div style={{ fontSize: 12, fontWeight: 900, color: C.text, textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</div>
      {meta && <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{meta}</div>}
    </div>
  );
}

function Box({ children, selected, onClick, style = {} }: { children: React.ReactNode; selected?: boolean; onClick?: () => void; style?: React.CSSProperties }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `1px solid ${selected ? C.blue : (hov && onClick) ? C.blue + "55" : C.border}`,
        background: selected ? C.blue + "0d" : C.surfaceAlt,
        padding: 14, transition: "border-color .12s, background .12s",
        cursor: onClick ? "pointer" : "default", ...style,
      }}
    >
      {children}
    </div>
  );
}

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 7, alignItems: "flex-start" }}>
      <div style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dim, minWidth: 82, paddingTop: 1, flexShrink: 0 }}>{label}</div>
      <div style={{ fontSize: 11, color: C.text, lineHeight: 1.5, flex: 1 }}>{value || "—"}</div>
    </div>
  );
}

function Hr() { return <div style={{ borderTop: `1px solid ${C.border}`, margin: "10px 0" }} />; }

type Day = typeof DAYS[number];

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = ["Overview", "Plans", "Itinerary", "Tahoe Day", "Lodging", "Activities", "Budget", "Packing"] as const;
type Tab = typeof TABS[number];

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Vacation() {
  const [tripId, setTripId] = useState<TripId>("california");
  const activeTrip = TRIPS.find(t => t.id === tripId)!;
  const [tab, setTab] = useState<Tab>("Overview");
  const [selectedDay, setSelectedDay] = useState<Day | null>(DAYS[0]);

  const totals = useMemo(() => {
    const planned = BUDGET.reduce((s, b) => s + b.planned, 0);
    const actual = BUDGET.reduce((s, b) => s + b.actual, 0);
    return { planned, actual, delta: planned - actual };
  }, []);

  return (
    <div style={{
      background: C.bg, color: C.text, minHeight: "100vh",
      fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
      display: "flex", flexDirection: "column",
    }}>
      {/* TOP BAR */}
      <div style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "10px 18px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, background: activeTrip.color, borderRadius: 999, boxShadow: `0 0 8px ${activeTrip.color}` }} />
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase", color: C.text }}>
            Vacation Command Center
          </div>
        </div>
        <div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {activeTrip.destination} · {activeTrip.region}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 14, fontSize: 9, color: C.dim, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <span>{activeTrip.dates}</span>
          <span>{activeTrip.nights} nights</span>
          <span style={{ color: activeTrip.color }}>● {activeTrip.status}</span>
        </div>
      </div>

      {/* TRIP SWITCHER */}
      <div style={{
        background: C.bg, borderBottom: `1px solid ${C.border2}`,
        padding: "8px 18px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
      }}>
        <div style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase", color: C.dim, marginRight: 4 }}>
          Trips
        </div>
        {TRIPS.map(t => {
          const active = t.id === tripId;
          return (
            <button
              key={t.id}
              onClick={() => { setTripId(t.id); setTab("Overview"); }}
              style={{
                background: active ? t.color + "1a" : C.surfaceAlt,
                border: `1px solid ${active ? t.color : C.border}`,
                color: active ? C.text : C.muted,
                cursor: "pointer", padding: "6px 10px", fontFamily: "inherit",
                fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
                display: "flex", alignItems: "center", gap: 6,
                transition: "border-color .12s, background .12s, color .12s",
              }}
            >
              <span style={{ fontSize: 12 }}>{t.flag}</span>
              <span>{t.label}</span>
              <span style={{ fontSize: 8, color: C.dim, letterSpacing: "0.1em" }}>· {t.dates}</span>
            </button>
          );
        })}
      </div>

      {/* TABS */}
      {tripId === "california" && (
      <div style={{ background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, padding: "0 18px", display: "flex", gap: 0, overflowX: "auto" }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              padding: "12px 16px", fontFamily: "inherit",
              fontSize: 10, fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase",
              color: tab === t ? C.text : C.muted,
              borderBottom: `2px solid ${tab === t ? C.blue : "transparent"}`,
              transition: "color .12s, border-color .12s",
            }}
          >
            {t}
          </button>
        ))}
      </div>
      )}

      {/* BODY */}
      <div style={{ flex: 1, padding: 18, display: "grid", gap: 14, gridTemplateColumns: "minmax(0, 1fr)" }}>
        {tripId !== "california" && <TripArchiveTab trip={activeTrip} />}
        {tripId === "california" && tab === "Overview" && <OverviewTab selectedDay={selectedDay} onSelectDay={setSelectedDay} totals={totals} />}
        {tripId === "california" && tab === "Plans" && <PlansTab totals={totals} />}
        {tripId === "california" && tab === "Itinerary" && <ItineraryTab selectedDay={selectedDay} onSelectDay={setSelectedDay} />}
        {tripId === "california" && tab === "Tahoe Day" && <TahoeDayTab />}
        {tripId === "california" && tab === "Lodging" && <LodgingTab />}
        {tripId === "california" && tab === "Activities" && <ActivitiesTab />}
        {tripId === "california" && tab === "Budget" && <BudgetTab totals={totals} />}
        {tripId === "california" && tab === "Packing" && <PackingTab />}
      </div>

      {/* FOOTER */}
      <div style={{
        background: C.surface, borderTop: `1px solid ${C.border}`, padding: "8px 18px",
        display: "flex", gap: 18, fontSize: 7, color: C.dim, letterSpacing: "0.12em", textTransform: "uppercase", flexWrap: "wrap",
      }}>
        <span style={{ color: activeTrip.color }}>● {activeTrip.status}</span>
        <span>{activeTrip.region}</span>
        <span>Vacation Ops</span>
        <span style={{ marginLeft: "auto" }}>Unclassified // Trip Ops</span>
      </div>
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
function TripArchiveTab({ trip }: { trip: TripSummary }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
      <Box>
        <SecHead eyebrow={`${trip.flag} ${trip.label}`} title={trip.destination.toUpperCase()} meta={trip.region} color={trip.color} />
        <KV label="Dates"     value={trip.dates} />
        <KV label="Travelers" value={`${trip.travelers} adults`} />
        <KV label="Nights"    value={`${trip.nights}`} />
        <KV label="Status"    value={<span style={{ color: trip.color }}>● {trip.status}</span>} />
        <KV label="Lodging"   value={trip.lodging} />
        <KV label="Budget"    value={`$${trip.budget.toLocaleString()}`} />
        <Hr />
        <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.6 }}>{trip.headline}</div>
        <div style={{ marginTop: 8, fontSize: 9, color: C.dim, fontStyle: "italic" }}>{trip.notes}</div>
      </Box>
      <Box>
        <SecHead eyebrow="Highlights" title="TRIP HIGHLIGHTS" meta={`${trip.highlights.length} stops`} color={trip.color} />
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {trip.highlights.map((h, i) => (
            <li key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: `1px dashed ${C.border2}`, fontSize: 11, color: C.text, lineHeight: 1.5 }}>
              <span style={{ color: trip.color, fontWeight: 900, minWidth: 18 }}>{String(i + 1).padStart(2, "0")}</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </Box>
    </div>
  );
}

function PlansTab({ totals }: { totals: { planned: number; actual: number; delta: number } }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
      {/* Executive Summary */}
      <Box>
        <SecHead eyebrow="Executive Summary" title={TRIP.destination.toUpperCase()} meta={TRIP.region} color={C.blue} />
        <KV label="Dates" value={TRIP.dates} />
        <KV label="Travelers" value={`${TRIP.travelers} adults`} />
        <KV label="Nights" value={`${TRIP.nights}`} />
        <KV label="Status" value={<Pill label={TRIP.status} color={C.green} />} />
        <Hr />
        <KV label="Base Lodging" value={LODGING[0].name} />
        <KV label="Confirmation" value={<span style={{ fontFamily: "monospace" }}>{LODGING[0].conf}</span>} />
        <KV label="Total Budget" value={`$${totals.planned.toLocaleString()} planned · $${totals.actual.toLocaleString()} actual`} />
      </Box>

      {/* Key Bookings */}
      <Box>
        <SecHead eyebrow="Transport" title="FLIGHTS & CONFIRMATIONS" color={C.amber} />
        {FLIGHTS.map(f => (
          <div key={f.id} style={{ padding: "8px 0", borderBottom: `1px solid ${C.border2}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: C.text, letterSpacing: "0.1em" }}>{f.leg.toUpperCase()} · {f.route}</span>
              <Pill label={f.status} color={STATUS_COLOR[f.status] || C.muted} />
            </div>
            <div style={{ fontSize: 9, color: C.muted }}>{f.carrier} · Seats {f.seats}</div>
            <div style={{ fontSize: 9, color: C.dim, marginTop: 2 }}>{f.dep} → {f.arr}</div>
          </div>
        ))}
        <Hr />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 900, color: C.dim, letterSpacing: "0.1em", textTransform: "uppercase" }}>Lodging</span>
          <span style={{ fontSize: 10, color: C.text, fontWeight: 900 }}>{LODGING[0].conf}</span>
        </div>
        <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{LODGING[0].name} · {LODGING[0].nights} nights</div>
      </Box>

      {/* Pre-Trip Checklist */}
      <Box>
        <SecHead eyebrow="Before Departure" title="PRE-TRIP CHECKLIST" color={C.violet} />
        {[
          { label: "Online Check-In", note: "United 24h prior — May 29 @ 08:10" },
          { label: "Rental Car Confirm", note: "Verify SUV category + snow-chain policy" },
          { label: "Hotel Check-In", note: "Kimpton Sawyer digital key / early check-in request" },
          { label: "Dining Reservations", note: "The Firehouse, The Beacon Bar — confirm OpenTable" },
          { label: "Activity Confirm", note: "Crocker Museum, Zoo, Sugar Mill, Tahoe Adventure Co." },
          { label: "Weather Check", note: "Sacramento + Tahoe 7-day forecast — pack layers" },
          { label: "Download Offline Maps", note: "Tahoe basin has dead zones on US-50 / NV-28" },
          { label: "Cash Withdrawal", note: "$40 for tolls / parking / tips" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderBottom: `1px solid ${C.border2}` }}>
            <span style={{ width: 10, height: 10, border: `1px solid ${C.border}`, display: "inline-block", flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 900, color: C.text, letterSpacing: "0.04em" }}>{item.label}</div>
              <div style={{ fontSize: 9, color: C.muted, lineHeight: 1.4 }}>{item.note}</div>
            </div>
          </div>
        ))}
      </Box>

      {/* Day-at-a-Glance */}
      <Box style={{ gridColumn: "1 / -1" }}>
        <SecHead eyebrow="Master Schedule" title="6-DAY PLAN AT A GLANCE" color={C.teal} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
          {DAYS.map(d => {
            const phase = PHASE_META[d.phase];
            return (
              <Box key={d.day} style={{ padding: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.12em", color: C.dim }}>DAY {d.day} · {d.date.toUpperCase()}</span>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: phase.color }} />
                </div>
                <div style={{ fontSize: 10, fontWeight: 900, color: C.text, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>{d.title}</div>
                <div style={{ fontSize: 8, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{d.region}</div>
                <div style={{ fontSize: 9, color: C.text, lineHeight: 1.5 }}>{d.notes}</div>
                <div style={{ marginTop: 6, fontSize: 8, color: C.dim, letterSpacing: "0.08em" }}>🏨 {d.lodging}</div>
              </Box>
            );
          })}
        </div>
      </Box>

      {/* Critical Reminders */}
      <Box style={{ gridColumn: "1 / -1" }}>
        <SecHead eyebrow="Alerts" title="CRITICAL REMINDERS" color={C.red} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
          <div style={{ border: `1px solid ${C.border}`, padding: 10, background: C.surfaceAlt }}>
            <div style={{ fontSize: 9, fontWeight: 900, color: C.amber, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Chain Carry Requirement</div>
            <div style={{ fontSize: 10, color: C.text, lineHeight: 1.5 }}>California requires chain carry in controlled zones through June. Rental SUV must have chains in trunk even if not used.</div>
          </div>
          <div style={{ border: `1px solid ${C.border}`, padding: 10, background: C.surfaceAlt }}>
            <div style={{ fontSize: 9, fontWeight: 900, color: C.teal, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Altitude Prep</div>
            <div style={{ fontSize: 10, color: C.text, lineHeight: 1.5 }}>Sand Harbor is ~6,225 ft. Start hydration 24h before Day 4. Pack electrolytes and avoid alcohol the night before.</div>
          </div>
          <div style={{ border: `1px solid ${C.border}`, padding: 10, background: C.surfaceAlt }}>
            <div style={{ fontSize: 9, fontWeight: 900, color: C.green, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Tahoe Day Cutoff</div>
            <div style={{ fontSize: 10, color: C.text, lineHeight: 1.5 }}>Depart Tahoe NLT 18:00 to guarantee safe return. If weather or traffic worsens, swap Sand Harbor for Heavenly Village.</div>
          </div>
          <div style={{ border: `1px solid ${C.border}`, padding: 10, background: C.surfaceAlt }}>
            <div style={{ fontSize: 9, fontWeight: 900, color: C.violet, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Rental Return</div>
            <div style={{ fontSize: 10, color: C.text, lineHeight: 1.5 }}>Return SUV at SMF by 17:00 on Jun 4. Fill gas near airport. Allow 30 min for shuttle to terminal.</div>
          </div>
        </div>
      </Box>
    </div>
  );
}

function OverviewTab({ selectedDay, onSelectDay, totals }: { selectedDay: Day | null; onSelectDay: (d: Day) => void; totals: { planned: number; actual: number; delta: number } }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
      <Box>
        <SecHead eyebrow="Mission Brief" title={TRIP.destination.toUpperCase()} meta={TRIP.region} />
        <KV label="Dates" value={TRIP.dates} />
        <KV label="Travelers" value={`${TRIP.travelers} adults`} />
        <KV label="Nights" value={`${TRIP.nights}`} />
        <KV label="Status" value={<Pill label={TRIP.status} color={C.green} />} />
        <Hr />
        <KV label="Lodging" value={`${LODGING.length} properties`} />
        <KV label="Activities" value={`${ACTIVITIES.length} planned`} />
        <KV label="Budget" value={`$${totals.planned.toLocaleString()} planned`} />
      </Box>

      <Box>
        <SecHead eyebrow="Flights" title="AIR TRANSPORT" color={C.amber} />
        {FLIGHTS.map(f => (
          <div key={f.id} style={{ padding: "8px 0", borderBottom: `1px solid ${C.border2}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: C.text, letterSpacing: "0.1em" }}>{f.leg.toUpperCase()} · {f.route}</span>
              <Pill label={f.status} color={STATUS_COLOR[f.status] || C.muted} />
            </div>
            <div style={{ fontSize: 9, color: C.muted }}>{f.carrier} · Seats {f.seats}</div>
            <div style={{ fontSize: 9, color: C.dim, marginTop: 2 }}>{f.dep} → {f.arr}</div>
          </div>
        ))}
      </Box>

      <Box>
        <SecHead eyebrow="Today's Focus" title={selectedDay ? `DAY ${selectedDay.day} · ${selectedDay.title.toUpperCase()}` : "—"} color={selectedDay ? PHASE_META[selectedDay.phase].color : C.blue} />
        {selectedDay ? (
          <>
            <KV label="Date" value={selectedDay.date} />
            <KV label="Region" value={selectedDay.region} />
            <KV label="Phase" value={<Pill label={PHASE_META[selectedDay.phase].label} color={PHASE_META[selectedDay.phase].color} />} />
            <KV label="Lodging" value={selectedDay.lodging} />
            <Hr />
            <div style={{ fontSize: 11, color: C.text, lineHeight: 1.6 }}>{selectedDay.notes}</div>
          </>
        ) : (
          <div style={{ fontSize: 10, color: C.muted }}>Select a day from the itinerary.</div>
        )}
      </Box>

      <Box style={{ gridColumn: "1 / -1" }}>
          <SecHead eyebrow="Day Stream" title="6-DAY ITINERARY" color={C.teal} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
          {DAYS.map(d => {
            const sel = selectedDay?.day === d.day;
            const phase = PHASE_META[d.phase];
            return (
              <Box key={d.day} selected={sel} onClick={() => onSelectDay(d)} style={{ padding: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.12em", color: C.dim }}>DAY {d.day} · {d.date.toUpperCase()}</span>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: phase.color }} />
                </div>
                <div style={{ fontSize: 10, fontWeight: 900, color: C.text, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>{d.title}</div>
                <div style={{ fontSize: 8, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{d.region}</div>
              </Box>
            );
          })}
        </div>
      </Box>
    </div>
  );
}

function ItineraryTab({ selectedDay, onSelectDay }: { selectedDay: Day | null; onSelectDay: (d: Day) => void }) {
  return (
    <Box>
      <SecHead eyebrow="Schedule" title="DAY-BY-DAY" meta={`${DAYS.length} days · ${TRIP.nights} nights`} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {DAYS.map(d => {
          const sel = selectedDay?.day === d.day;
          const phase = PHASE_META[d.phase];
          return (
            <Box key={d.day} selected={sel} onClick={() => onSelectDay(d)}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ minWidth: 70 }}>
                  <div style={{ fontSize: 8, fontWeight: 900, color: C.dim, letterSpacing: "0.14em" }}>DAY</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: phase.color, lineHeight: 1 }}>{d.day}</div>
                  <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{d.date}</div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: C.text, letterSpacing: "0.08em", textTransform: "uppercase" }}>{d.title}</span>
                    <Pill label={phase.label} color={phase.color} />
                  </div>
                  <div style={{ fontSize: 9, color: C.muted, marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>{d.region} · {d.lodging}</div>
                  <div style={{ fontSize: 10, color: C.text, lineHeight: 1.5 }}>{d.notes}</div>
                </div>
              </div>
            </Box>
          );
        })}
      </div>
    </Box>
  );
}

const LS_SCHEDULE = "vacation.tahoe.schedule.v1";
const LS_CONTINGENCY = "vacation.tahoe.contingency.v1";

function loadLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T : fallback; } catch { return fallback; }
}

function inputStyle(): React.CSSProperties {
  return {
    background: C.bg, border: `1px solid ${C.border}`, color: C.text,
    padding: "4px 6px", fontSize: 10, fontFamily: "inherit", width: "100%", boxSizing: "border-box",
  };
}

function ToolbarBtn({ children, onClick, color = C.blue, active }: { children: React.ReactNode; onClick: () => void; color?: string; active?: boolean }) {
  return (
    <button onClick={onClick} style={{
      background: active ? color + "28" : "transparent", color: active ? color : C.text,
      border: `1px solid ${active ? color : C.border}`, padding: "5px 10px",
      fontFamily: "inherit", fontSize: 9, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase",
      cursor: "pointer",
    }}>{children}</button>
  );
}

function TahoeDayTab() {
  const tahoeDay = DAYS.find(d => d.phase === "alpine");
  const [editing, setEditing] = useState(false);
  const [schedule, setSchedule] = useState<TahoeStop[]>(() => loadLS(LS_SCHEDULE, TAHOE_SCHEDULE));
  const [contingency, setContingency] = useState<ContingencyNote[]>(() => loadLS(LS_CONTINGENCY, TAHOE_CONTINGENCY));

  const persist = (s: TahoeStop[], c: ContingencyNote[]) => {
    try {
      localStorage.setItem(LS_SCHEDULE, JSON.stringify(s));
      localStorage.setItem(LS_CONTINGENCY, JSON.stringify(c));
    } catch { /* ignore */ }
  };

  const updateStop = (i: number, patch: Partial<TahoeStop>) => {
    const next = schedule.map((s, idx) => idx === i ? { ...s, ...patch } : s);
    setSchedule(next); persist(next, contingency);
  };
  const moveStop = (i: number, dir: -1 | 1) => {
    const j = i + dir; if (j < 0 || j >= schedule.length) return;
    const next = schedule.slice(); [next[i], next[j]] = [next[j], next[i]];
    setSchedule(next); persist(next, contingency);
  };
  const removeStop = (i: number) => {
    const next = schedule.filter((_, idx) => idx !== i);
    setSchedule(next); persist(next, contingency);
  };
  const addStop = () => {
    const next: TahoeStop[] = [...schedule, { time: "00:00", kind: "stop", label: "New Stop", loc: "", detail: "", cost: 0, links: [] }];
    setSchedule(next); persist(next, contingency);
  };
  const resetAll = () => {
    setSchedule(TAHOE_SCHEDULE); setContingency(TAHOE_CONTINGENCY);
    try { localStorage.removeItem(LS_SCHEDULE); localStorage.removeItem(LS_CONTINGENCY); } catch { /* ignore */ }
  };
  const updateContingency = (i: number, patch: Partial<ContingencyNote>) => {
    const next = contingency.map((n, idx) => idx === i ? { ...n, ...patch } : n);
    setContingency(next); persist(schedule, next);
  };
  const addContingency = () => {
    const next = [...contingency, { label: "New", text: "" }];
    setContingency(next); persist(schedule, next);
  };
  const removeContingency = (i: number) => {
    const next = contingency.filter((_, idx) => idx !== i);
    setContingency(next); persist(schedule, next);
  };

  const tahoeTotal = useMemo(() => schedule.reduce((s, x) => s + (x.cost || 0), 0), [schedule]);

  // Budget grouping by kind
  const budgetByKind = useMemo(() => {
    const groups: Record<string, { kind: string; total: number; items: TahoeStop[] }> = {};
    schedule.forEach(s => {
      if (!s.cost) return;
      const key = s.kind;
      if (!groups[key]) groups[key] = { kind: key, total: 0, items: [] };
      groups[key].total += s.cost; groups[key].items.push(s);
    });
    return Object.values(groups).sort((a, b) => b.total - a.total);
  }, [schedule]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 14 }}>
      <Box>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, flexWrap: "wrap", marginBottom: 8 }}>
          <SecHead
            eyebrow="Day 4 · Jun 2"
            title="LAKE TAHOE DAY TRIP"
            meta={tahoeDay ? `${tahoeDay.region} · Base: ${tahoeDay.lodging}` : undefined}
            color={C.green}
          />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <ToolbarBtn onClick={() => setEditing(e => !e)} color={editing ? C.amber : C.blue} active={editing}>
              {editing ? "● Editing" : "✎ Edit Mode"}
            </ToolbarBtn>
            {editing && <ToolbarBtn onClick={addStop} color={C.green}>+ Add Stop</ToolbarBtn>}
            {editing && <ToolbarBtn onClick={resetAll} color={C.red}>↺ Reset</ToolbarBtn>}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 }}>
          <div><Eyebrow color={C.amber}>Depart Sac</Eyebrow><div style={{ fontSize: 16, fontWeight: 900, color: C.text }}>{schedule[1]?.time || TAHOE_STATS.departSac}</div></div>
          <div><Eyebrow color={C.violet}>Return Sac</Eyebrow><div style={{ fontSize: 16, fontWeight: 900, color: C.text }}>{schedule[schedule.length - 2]?.time || TAHOE_STATS.returnSac}</div></div>
          <div><Eyebrow color={C.amber}>Drive Time</Eyebrow><div style={{ fontSize: 16, fontWeight: 900, color: C.text }}>{TAHOE_STATS.totalDriveHr}</div></div>
          <div><Eyebrow color={C.amber}>Distance</Eyebrow><div style={{ fontSize: 16, fontWeight: 900, color: C.text }}>{TAHOE_STATS.totalDriveMi} mi</div></div>
          <div><Eyebrow color={C.green}>Elevation</Eyebrow><div style={{ fontSize: 16, fontWeight: 900, color: C.text }}>{TAHOE_STATS.elevationGain}</div></div>
          <div><Eyebrow color={C.red}>Day Total</Eyebrow><div style={{ fontSize: 16, fontWeight: 900, color: C.text }}>${tahoeTotal}</div></div>
        </div>
      </Box>

      <Box>
        <SecHead
          eyebrow="Timeline"
          title={editing ? "EDITING SCHEDULE" : "MINUTE-BY-MINUTE"}
          meta="Pacific Time · Tue Jun 2, 2026"
          color={editing ? C.amber : C.teal}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {schedule.map((s, i) => {
            const color = TAHOE_KIND_COLOR[s.kind] || C.muted;
            const isLast = i === schedule.length - 1;
            return (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "stretch" }}>
                <div style={{ minWidth: 64, paddingTop: 10, flexShrink: 0 }}>
                  {editing ? (
                    <>
                      <input value={s.time} onChange={e => updateStop(i, { time: e.target.value })} style={{ ...inputStyle(), fontSize: 11, fontWeight: 900 }} />
                      <input value={s.kind} onChange={e => updateStop(i, { kind: e.target.value })} style={{ ...inputStyle(), marginTop: 4, fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color }} />
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 13, fontWeight: 900, color: C.text, letterSpacing: "0.04em" }}>{s.time}</div>
                      <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase", color }}>{s.kind}</div>
                    </>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 14, flexShrink: 0 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 999, background: color, boxShadow: `0 0 0 3px ${C.bg}, 0 0 0 4px ${color}55` }} />
                  {!isLast && <div style={{ width: 1, flex: 1, background: C.border, marginTop: 4, minHeight: 28 }} />}
                </div>
                <div style={{ flex: 1, padding: "8px 0 16px", borderBottom: isLast ? "none" : `1px dashed ${C.border2}`, minWidth: 0 }}>
                  {editing ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <input value={s.label} onChange={e => updateStop(i, { label: e.target.value })} placeholder="Label" style={{ ...inputStyle(), fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase" }} />
                      <input value={s.loc} onChange={e => updateStop(i, { loc: e.target.value })} placeholder="Location" style={inputStyle()} />
                      <textarea value={s.detail} onChange={e => updateStop(i, { detail: e.target.value })} placeholder="Details" rows={2} style={{ ...inputStyle(), resize: "vertical", lineHeight: 1.5 }} />
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ fontSize: 9, color: C.dim, letterSpacing: "0.12em", textTransform: "uppercase" }}>Cost $</span>
                        <input type="number" value={s.cost} onChange={e => updateStop(i, { cost: Number(e.target.value) || 0 })} style={{ ...inputStyle(), width: 70, flex: "0 0 auto" }} />
                        <input value={s.costNote || ""} onChange={e => updateStop(i, { costNote: e.target.value })} placeholder="Cost note" style={inputStyle()} />
                      </div>
                      <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                        <ToolbarBtn onClick={() => moveStop(i, -1)} color={C.muted}>↑</ToolbarBtn>
                        <ToolbarBtn onClick={() => moveStop(i, 1)} color={C.muted}>↓</ToolbarBtn>
                        <ToolbarBtn onClick={() => removeStop(i)} color={C.red}>✕ Remove</ToolbarBtn>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                        <div style={{ fontSize: 11, fontWeight: 900, color: C.text, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</div>
                        {s.cost > 0 && <div style={{ fontSize: 10, fontWeight: 900, color: C.amber }}>${s.cost}</div>}
                      </div>
                      <div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2, marginBottom: 5 }}>{s.loc}</div>
                      <div style={{ fontSize: 10, color: C.text, lineHeight: 1.55 }}>{s.detail}</div>
                      {s.costNote && <div style={{ fontSize: 9, color: C.dim, marginTop: 4, fontStyle: "italic" }}>{s.costNote}</div>}
                      {s.links && s.links.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                          {s.links.map((l, li) => (
                            <a key={li} href={l.url} target="_blank" rel="noopener noreferrer" style={{
                              fontSize: 9, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase",
                              color: C.blue, border: `1px solid ${C.blue}55`, padding: "3px 7px",
                              background: C.blue + "10", textDecoration: "none",
                            }}>↗ {l.label}</a>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Box>

      {/* TAHOE BUDGET BREAKDOWN */}
      <Box>
        <SecHead eyebrow="Tahoe Day Budget" title="ESTIMATED COSTS" meta={`${schedule.filter(s => s.cost > 0).length} line items · Day total $${tahoeTotal}`} color={C.amber} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 14 }}>
          {budgetByKind.map(g => {
            const color = TAHOE_KIND_COLOR[g.kind] || C.muted;
            const pct = tahoeTotal ? Math.round((g.total / tahoeTotal) * 100) : 0;
            return (
              <div key={g.kind} style={{ border: `1px solid ${C.border}`, padding: 10, background: C.surfaceAlt }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", color }}>{g.kind}</span>
                  <span style={{ fontSize: 12, fontWeight: 900, color: C.text }}>${g.total}</span>
                </div>
                <div style={{ height: 4, background: C.bg, marginBottom: 6 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: color }} />
                </div>
                <div style={{ fontSize: 9, color: C.dim, letterSpacing: "0.1em" }}>{pct}% of day</div>
              </div>
            );
          })}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          {schedule.filter(s => s.cost > 0).map((s, i) => {
            const color = TAHOE_KIND_COLOR[s.kind] || C.muted;
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "50px 70px 1fr auto", gap: 10, padding: "7px 0", borderBottom: `1px solid ${C.border2}`, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: C.muted, fontFamily: "inherit" }}>{s.time}</span>
                <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", color }}>{s.kind}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: C.text, fontWeight: 900, letterSpacing: "0.04em" }}>{s.label}</div>
                  {s.costNote && <div style={{ fontSize: 9, color: C.dim }}>{s.costNote}</div>}
                </div>
                <span style={{ fontSize: 11, fontWeight: 900, color: C.amber }}>${s.cost}</span>
              </div>
            );
          })}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", padding: "12px 0 4px", alignItems: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", color: C.text }}>Day Trip Total</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: C.green }}>${tahoeTotal}</span>
          </div>
          <div style={{ fontSize: 9, color: C.dim, marginTop: 4, fontStyle: "italic" }}>Estimates for 2 travelers. Excludes incidentals and tips.</div>
        </div>
      </Box>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        <Box>
          <SecHead eyebrow="Route" title="SAC → TAHOE → SAC" color={C.amber} />
          <KV label="Outbound" value="Sacramento → US-50 E → South Lake Tahoe (~2h 15m)" />
          <KV label="West Shore" value="CA-89 N to Emerald Bay / Eagle Falls (~25m)" />
          <KV label="East Shore" value="CA-89 → US-50 → NV-28 to Sand Harbor (~50m)" />
          <KV label="Return" value="NV-28 S → US-50 W → I-80 W to Sacramento (~2h 15m)" />
        </Box>
        <Box>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 4 }}>
            <SecHead eyebrow="Contingency" title="BACKUP PLAN" color={C.red} />
            {editing && <ToolbarBtn onClick={addContingency} color={C.green}>+ Add</ToolbarBtn>}
          </div>
          {contingency.map((n, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              {editing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <input value={n.label} onChange={e => updateContingency(i, { label: e.target.value })} placeholder="Label" style={{ ...inputStyle(), fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }} />
                  <textarea value={n.text} onChange={e => updateContingency(i, { text: e.target.value })} placeholder="Note" rows={2} style={{ ...inputStyle(), resize: "vertical", lineHeight: 1.5 }} />
                  <div><ToolbarBtn onClick={() => removeContingency(i)} color={C.red}>✕ Remove</ToolbarBtn></div>
                </div>
              ) : (
                <KV label={n.label} value={n.text} />
              )}
            </div>
          ))}
        </Box>
      </div>
    </div>
  );
}

function LodgingTab() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
      {LODGING.map(l => (
        <Box key={l.id}>
          <SecHead eyebrow={l.type} title={l.name.toUpperCase()} meta={l.region} />
          <KV label="Nights" value={`${l.nights}`} />
          <KV label="Conf #" value={<span style={{ fontFamily: "monospace" }}>{l.conf}</span>} />
          <KV label="Total" value={`$${l.price.toLocaleString()}`} />
          <KV label="Status" value={<Pill label={l.status} color={STATUS_COLOR[l.status] || C.muted} />} />
        </Box>
      ))}
    </div>
  );
}

function ActivitiesTab() {
  return (
    <Box>
      <SecHead eyebrow="Bookings" title="ACTIVITY ROSTER" meta={`${ACTIVITIES.length} entries`} color={C.teal} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
        {ACTIVITIES.map(a => (
          <Box key={a.id} style={{ padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 8, fontWeight: 900, color: C.dim, letterSpacing: "0.14em" }}>DAY {a.day}</span>
              <Pill label={a.status} color={STATUS_COLOR[a.status] || C.muted} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 900, color: C.text, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>{a.title}</div>
            <div style={{ fontSize: 9, color: C.muted, marginBottom: 6 }}>{a.vendor}</div>
            <div style={{ fontSize: 10, color: C.amber, fontWeight: 900 }}>${a.cost}</div>
          </Box>
        ))}
      </div>
    </Box>
  );
}

function BudgetTab({ totals }: { totals: { planned: number; actual: number; delta: number } }) {
  const max = Math.max(...BUDGET.map(b => b.planned));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
      <Box>
        <SecHead eyebrow="Roll-Up" title="TOTALS" color={C.green} />
        <KV label="Planned" value={`$${totals.planned.toLocaleString()}`} />
        <KV label="Actual" value={`$${totals.actual.toLocaleString()}`} />
        <KV label="Remaining" value={<span style={{ color: totals.delta >= 0 ? C.green : C.red }}>${totals.delta.toLocaleString()}</span>} />
      </Box>
      <Box style={{ gridColumn: "span 2", minWidth: 0 }}>
        <SecHead eyebrow="Breakdown" title="BY CATEGORY" color={C.amber} />
        {BUDGET.map(b => {
          const pct = (b.planned / max) * 100;
          const apct = max ? (b.actual / max) * 100 : 0;
          return (
            <div key={b.cat} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted, marginBottom: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                <span>{b.cat}</span>
                <span style={{ color: C.text }}>${b.actual.toLocaleString()} / ${b.planned.toLocaleString()}</span>
              </div>
              <div style={{ height: 8, background: C.surfaceAlt, border: `1px solid ${C.border2}`, position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: b.color + "33" }} />
                <div style={{ position: "absolute", inset: 0, width: `${apct}%`, background: b.color }} />
              </div>
            </div>
          );
        })}
      </Box>
    </div>
  );
}

function PackingTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <div style={{ marginBottom: 10 }}>
          <Eyebrow color={C.violet}>Vacation · Full Trip</Eyebrow>
          <div style={{ fontSize: 12, fontWeight: 900, color: C.text, letterSpacing: "0.08em", textTransform: "uppercase" }}>Sacramento Packing</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {PACKING.map(p => (
            <Box key={p.cat}>
              <SecHead eyebrow="Checklist" title={p.cat.toUpperCase()} meta={`${p.items.length} items`} color={C.violet} />
              {p.items.map((it, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "5px 0", borderBottom: i < p.items.length - 1 ? `1px solid ${C.border2}` : "none" }}>
                  <span style={{ width: 10, height: 10, border: `1px solid ${C.border}`, display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: C.text }}>{it}</span>
                </div>
              ))}
            </Box>
          ))}
        </div>
      </div>

      <div>
        <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <Eyebrow color={C.green}>Day 4 · Jun 2</Eyebrow>
          <div style={{ fontSize: 12, fontWeight: 900, color: C.text, letterSpacing: "0.08em", textTransform: "uppercase" }}>Lake Tahoe Day-Trip Add-Ons</div>
          <Pill label="Alpine" color={C.green} />
        </div>
        <div style={{ fontSize: 10, color: C.muted, marginBottom: 10, maxWidth: 720, lineHeight: 1.5 }}>
          Layered for 35°F dawn → 75°F afternoon swings. Waterproof gear for paddleboarding. Chains required-carry chart for I-80 / US-50 even in early June.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {TAHOE_PACKING.map(p => (
            <Box key={p.cat}>
              <SecHead eyebrow="Tahoe Day" title={p.cat.toUpperCase()} meta={`${p.items.length} items`} color={C.green} />
              {p.items.map((it, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "5px 0", borderBottom: i < p.items.length - 1 ? `1px solid ${C.border2}` : "none" }}>
                  <span style={{ width: 10, height: 10, border: `1px solid ${C.border}`, display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: C.text }}>{it}</span>
                </div>
              ))}
            </Box>
          ))}
        </div>
      </div>
    </div>
  );
}