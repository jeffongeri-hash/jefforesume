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
  // (unchanged)
  { cat: "Health",     items: ["Sunscreen SPF 50", "Lip balm SPF", "Electrolytes (altitude)", "Ibuprofen", "Bandaids + moleskin"] },
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