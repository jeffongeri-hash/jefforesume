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
  destination: "Costa Rica",
  region: "Guanacaste → Arenal → Manuel Antonio",
  dates: "Mar 14 – Mar 22, 2026",
  travelers: 2,
  nights: 8,
  status: "Confirmed",
};

const DAYS = [
  { day: 1, date: "Mar 14", phase: "arrival",   region: "Liberia (LIR)",      title: "Arrival + Transfer",        lodging: "Andaz Papagayo",        notes: "Land 14:20. Pick up rental SUV. Light dinner at resort." },
  { day: 2, date: "Mar 15", phase: "coast",     region: "Papagayo Peninsula", title: "Beach + Reset",             lodging: "Andaz Papagayo",        notes: "Playa Blanca morning. Spa block 3pm. Sunset at Prieta Beach Club." },
  { day: 3, date: "Mar 16", phase: "coast",     region: "Papagayo / Coco",    title: "Catamaran + Snorkel",       lodging: "Andaz Papagayo",        notes: "Half-day catamaran charter. Open bar, snorkel two reefs." },
  { day: 4, date: "Mar 17", phase: "transit",   region: "Drive to Arenal",    title: "Transfer Day",              lodging: "Nayara Tented Camp",    notes: "~3.5 hr drive via Liberia. Lunch stop in Cañas. Check-in by 4pm." },
  { day: 5, date: "Mar 18", phase: "jungle",    region: "Arenal Volcano",     title: "Hanging Bridges + Springs", lodging: "Nayara Tented Camp",    notes: "Mistico bridges AM. Tabacón hot springs PM. Volcano-view dinner." },
  { day: 6, date: "Mar 19", phase: "jungle",    region: "La Fortuna",         title: "Waterfall + Sloth Trek",    lodging: "Nayara Tented Camp",    notes: "La Fortuna waterfall hike. Bogarín sloth trail at dusk." },
  { day: 7, date: "Mar 20", phase: "transit",   region: "Drive to M. Antonio",title: "Cross-Country Drive",       lodging: "Hotel Si Como No",      notes: "~4.5 hr drive. Pacific coast route. Crocodile bridge stop." },
  { day: 8, date: "Mar 21", phase: "coast",     region: "Manuel Antonio NP",  title: "National Park + Beach",     lodging: "Hotel Si Como No",      notes: "Park entry 7am with guide. Capuchin + howler monkeys. Espadilla beach PM." },
  { day: 9, date: "Mar 22", phase: "departure", region: "SJO Airport",        title: "Departure",                 lodging: "—",                     notes: "Drive to SJO ~3 hr. Return rental. Flight 16:40." },
];

const PHASE_META: Record<string, { label: string; color: string }> = {
  arrival:   { label: "Arrival",   color: C.blue },
  coast:     { label: "Coast",     color: C.teal },
  transit:   { label: "Transit",   color: C.amber },
  jungle:    { label: "Jungle",    color: C.green },
  departure: { label: "Departure", color: C.violet },
};

const LODGING = [
  { id: "andaz",  name: "Andaz Papagayo",     nights: 3, region: "Guanacaste",     type: "Resort",     conf: "AND-2X9F-441", price: 1840, status: "Confirmed" },
  { id: "nayara", name: "Nayara Tented Camp", nights: 3, region: "Arenal",          type: "Eco-Lodge",  conf: "NYR-77QX-018", price: 2310, status: "Confirmed" },
  { id: "sicomo", name: "Hotel Si Como No",   nights: 2, region: "Manuel Antonio",  type: "Boutique",   conf: "SCN-4413-AA",  price: 980,  status: "Confirmed" },
];

const FLIGHTS = [
  { id: "out",  leg: "Outbound", route: "IAH → LIR", carrier: "United 1438", dep: "Mar 14 · 09:55", arr: "Mar 14 · 14:20", seats: "12A / 12B", status: "Ticketed" },
  { id: "back", leg: "Return",   route: "SJO → IAH", carrier: "United 1467", dep: "Mar 22 · 16:40", arr: "Mar 22 · 21:05", seats: "8C / 8D",   status: "Ticketed" },
];

const ACTIVITIES = [
  { id: "cat",     title: "Catamaran + Snorkel",       day: 3, status: "Booked",  cost: 320, vendor: "Marlin del Rey" },
  { id: "bridge",  title: "Mistico Hanging Bridges",   day: 5, status: "Booked",  cost: 80,  vendor: "Mistico Park" },
  { id: "spring",  title: "Tabacón Hot Springs",       day: 5, status: "Booked",  cost: 160, vendor: "Tabacón Resort" },
  { id: "fall",    title: "La Fortuna Waterfall Hike", day: 6, status: "Open",    cost: 36,  vendor: "Self-guided" },
  { id: "sloth",   title: "Bogarín Sloth Trail",       day: 6, status: "Booked",  cost: 60,  vendor: "Bogarín Trail" },
  { id: "park",    title: "Manuel Antonio + Guide",    day: 8, status: "Booked",  cost: 140, vendor: "Johan Chaves" },
];

const BUDGET = [
  { cat: "Flights",    planned: 1450, actual: 1402, color: C.blue },
  { cat: "Lodging",    planned: 5200, actual: 5130, color: C.green },
  { cat: "Rental Car", planned: 720,  actual: 685,  color: C.amber },
  { cat: "Activities", planned: 900,  actual: 796,  color: C.teal },
  { cat: "Food",       planned: 1100, actual: 0,    color: C.violet },
  { cat: "Misc",       planned: 400,  actual: 0,    color: C.red },
];

const PACKING = [
  { cat: "Documents",  items: ["Passports (6mo validity)", "Driver's license", "Insurance card", "Vaccination record", "Printed itinerary"] },
  { cat: "Tech",       items: ["Phone + charger", "Power bank", "Plug adapter (Type A/B)", "GoPro + housing", "Kindle"] },
  { cat: "Apparel",    items: ["Quick-dry shirts ×5", "Hiking pants ×2", "Swimsuits ×3", "Trail runners", "Sandals", "Light rain shell"] },
  { cat: "Health",     items: ["Sunscreen SPF 50", "DEET repellent", "Electrolytes", "Ibuprofen", "Bandaids + moleskin"] },
];

const STATUS_COLOR: Record<string, string> = { Confirmed: C.green, Ticketed: C.green, Booked: C.green, Open: C.amber, Pending: C.amber };

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
const TABS = ["Overview", "Itinerary", "Lodging", "Activities", "Budget", "Packing"] as const;
type Tab = typeof TABS[number];

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Vacation() {
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
          <div style={{ width: 8, height: 8, background: C.green, borderRadius: 999, boxShadow: `0 0 8px ${C.green}` }} />
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase", color: C.text }}>
            Vacation Command Center
          </div>
        </div>
        <div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {TRIP.destination} · {TRIP.region}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 14, fontSize: 9, color: C.dim, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <span>{TRIP.dates}</span>
          <span>{TRIP.nights} nights</span>
          <span style={{ color: C.green }}>● {TRIP.status}</span>
        </div>
      </div>

      {/* TABS */}
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

      {/* BODY */}
      <div style={{ flex: 1, padding: 18, display: "grid", gap: 14, gridTemplateColumns: "minmax(0, 1fr)" }}>
        {tab === "Overview" && <OverviewTab selectedDay={selectedDay} onSelectDay={setSelectedDay} totals={totals} />}
        {tab === "Itinerary" && <ItineraryTab selectedDay={selectedDay} onSelectDay={setSelectedDay} />}
        {tab === "Lodging" && <LodgingTab />}
        {tab === "Activities" && <ActivitiesTab />}
        {tab === "Budget" && <BudgetTab totals={totals} />}
        {tab === "Packing" && <PackingTab />}
      </div>

      {/* FOOTER */}
      <div style={{
        background: C.surface, borderTop: `1px solid ${C.border}`, padding: "8px 18px",
        display: "flex", gap: 18, fontSize: 7, color: C.dim, letterSpacing: "0.12em", textTransform: "uppercase", flexWrap: "wrap",
      }}>
        <span style={{ color: C.green }}>● System Nominal</span>
        <span>{TRIP.region}</span>
        <span>Vacation Ops</span>
        <span style={{ marginLeft: "auto" }}>Unclassified // Trip Ops</span>
      </div>
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
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
        <SecHead eyebrow="Day Stream" title="9-DAY ITINERARY" color={C.teal} />
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
  );
}