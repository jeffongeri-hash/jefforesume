import { useState, useCallback } from "react";

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#0A0C10", surface: "#161B22", surfaceAlt: "#0d1117",
  border: "#30363D", border2: "#21262d",
  text: "#C9D1D9", muted: "#8B949E", dim: "#484f58",
  blue: "#58A6FF", amber: "#D29922", green: "#3FB950",
  red: "#F85149", violet: "#A371F7",
};

const lngToX = (lng: number) => ((lng - (-90.68)) / ((-90.42) - (-90.68))) * 760 + 20;
const latToY = (lat: number) => ((42.54 - lat) / (42.54 - 42.37)) * 460 + 20;

const STOPS = [
  { id: "grant-home",  label: "Grant Home",        caption: "1865 Italianate mansion",      phase: "morning",   lat: 42.4190, lng: -90.4290, color: C.red,   time: "9:00 AM",  duration: "1.5 hr",  cost: "Free" },
  { id: "horseshoe",   label: "Horseshoe Mound",   caption: "3-state panoramic views",      phase: "morning",   lat: 42.4270, lng: -90.4520, color: C.red,   time: "10:30 AM", duration: "1 hr",    cost: "Free" },
  { id: "ottos",       label: "Otto's Place",      caption: "Upscale brunch café",          phase: "morning",   lat: 42.4168, lng: -90.4303, color: C.amber, time: "12:00 PM", duration: "1.5 hr",  cost: "~$55" },
  { id: "arboretum",   label: "Arboretum",         caption: "Japanese Garden + hostas",     phase: "afternoon", lat: 42.4956, lng: -90.6549, color: C.green, time: "2:00 PM",  duration: "1.5 hr",  cost: "Free" },
  { id: "mines-spain", label: "Mines of Spain",    caption: "Limestone bluffs + monument",  phase: "afternoon", lat: 42.4630, lng: -90.6391, color: C.green, time: "3:30 PM",  duration: "1.25 hr", cost: "Free" },
  { id: "eagle-point", label: "Eagle Point",       caption: "Lock & dam river vistas",      phase: "afternoon", lat: 42.5175, lng: -90.6487, color: C.green, time: "4:45 PM",  duration: "45 min",  cost: "Free" },
  { id: "brazen",      label: "Brazen Kitchen",    caption: "Progressive American dinner",  phase: "evening",   lat: 42.5008, lng: -90.6643, color: C.amber, time: "6:00 PM",  duration: "2 hr",    cost: "~$140" },
  { id: "timmermans",  label: "Timmerman's",       caption: "Bluffside supper club",        phase: "evening",   lat: 42.4891, lng: -90.6426, color: C.amber, time: "6:00 PM",  duration: "2 hr",    cost: "~$130" },
];

const PHASE_META: Record<string, { label: string; color: string; range: string }> = {
  morning:   { label: "Morning",   color: C.red,   range: "9:00 AM – 1:30 PM" },
  afternoon: { label: "Afternoon", color: C.green, range: "2:00 PM – 5:30 PM" },
  evening:   { label: "Evening",   color: C.amber, range: "6:00 PM – 8:30 PM" },
};

const TIMELINE_ITEMS = [
  { time: "7:00 AM",  label: "Depart home",             phase: "morning",   stopId: null as string | null },
  { time: "8:30 AM",  label: "Arrive Galena, IL",       phase: "morning",   stopId: null },
  { time: "9:00 AM",  label: "Ulysses S. Grant Home",   phase: "morning",   stopId: "grant-home" },
  { time: "10:30 AM", label: "Horseshoe Mound Preserve",phase: "morning",   stopId: "horseshoe" },
  { time: "12:00 PM", label: "Lunch — Otto's Place",    phase: "morning",   stopId: "ottos" },
  { time: "1:30 PM",  label: "Cross Mississippi",       phase: "afternoon", stopId: null },
  { time: "2:00 PM",  label: "Dubuque Arboretum",       phase: "afternoon", stopId: "arboretum" },
  { time: "3:30 PM",  label: "Mines of Spain",          phase: "afternoon", stopId: "mines-spain" },
  { time: "4:45 PM",  label: "Eagle Point Park",        phase: "afternoon", stopId: "eagle-point" },
  { time: "5:45 PM",  label: "Pre-dinner buffer",       phase: "evening",   stopId: null },
  { time: "6:00 PM",  label: "Dinner",                  phase: "evening",   stopId: "brazen" },
  { time: "8:00 PM",  label: "Return home",             phase: "evening",   stopId: null },
];

const MEALS = [
  {
    id: "ottos", time: "12:00 PM", label: "Lunch", name: "Otto's Place",
    location: "Historic District, Galena, IL", type: "Café / Brunch", status: "Assigned",
    note: "Upscale brunch near the Grant Home. Smash Burger and house-cured pork belly are must-orders. Arrive by noon — weekends fill quickly.",
    highlights: ["Otto's Smash Burger", "House-Cured Pork Belly", "Artisanal local vibe"],
    res: "Walk-in, arrive early",
  },
  {
    id: "brazen", time: "6:00 PM", label: "Dinner — Option A", name: "Brazen Open Kitchen",
    location: "Millwork District, Dubuque, IA", type: "Progressive American", status: "Assigned",
    note: "Chef-driven with an open kitchen. Seasonal, locally sourced ingredients and technical prep. Industrial-modern room. Bold choice for a culinary experience.",
    highlights: ["Seasonal tasting menu", "Locally sourced ingredients", "Open kitchen theater"],
    res: "Reservation strongly recommended",
  },
  {
    id: "timmermans", time: "6:00 PM", label: "Dinner — Option B", name: "Timmerman's Supper Club",
    location: "East Dubuque, IL (Bluffside)", type: "Steak & Seafood / Supper Club", status: "Pending",
    note: "Classic bluffside institution. Hand-cut steaks, prime rib, fresh seafood. The dining room overlooks the Mississippi — spectacular for a sunset dinner.",
    highlights: ["Hand-cut steaks", "Prime rib", "Mississippi sunset views"],
    res: "Reservation recommended for window seating",
  },
];

const ACTIVITIES = [
  { id: "grant-home",  title: "Ulysses S. Grant Home",     status: "Go",    phase: "morning",   window: "9:00–10:30 AM",  duration: "~1.5 hrs", cost: "Free", tips: "Arrive at opening. Preserved 1865 Italianate mansion with original furnishings. Quiet grounds ideal for a morning walk.",         backup: "If closed, explore Main Street antiques and architecture instead." },
  { id: "horseshoe",   title: "Horseshoe Mound Preserve",  status: "Go",    phase: "morning",   window: "10:30 AM–12 PM", duration: "~1 hr",    cost: "Free", tips: "Best light before noon. Bring water — trails are uneven. Sweeping 3-state panorama and unique Driftless Area geology.",             backup: "Shorten to 30 min if running close to lunch reservation." },
  { id: "arboretum",   title: "Dubuque Arboretum",         status: "Go",    phase: "afternoon", window: "2:00–3:30 PM",   duration: "~1.5 hrs", cost: "Free", tips: "Japanese Garden is the centerpiece. Extensive hosta collections and intricate water features — high-contrast photography opportunity.", backup: "Skip if energy is low after the Galena hike; proceed to Mines of Spain." },
  { id: "mines-spain", title: "Mines of Spain Rec Area",   status: "Go",    phase: "afternoon", window: "3:30–4:45 PM",   duration: "~1.25 hrs",cost: "Free", tips: "Julien Dubuque Monument trail is short but steep. Limestone bluffs give dramatic Mississippi views distinct from Galena's hills.",  backup: "If trail is muddy, view from the parking overlook only." },
  { id: "eagle-point", title: "Eagle Point Park",          status: "Watch", phase: "afternoon", window: "4:45–5:30 PM",   duration: "~45 min",  cost: "Free", tips: "Golden hour light is excellent here. Lock and dam system from above + long-range river vistas. Great pre-dinner wind-down spot.",     backup: "Skip if running late for dinner — Timmerman's views will substitute." },
];

const EXPENSES_INIT = [
  { id: "gas",    label: "Gas — round trip (~3 hrs driving)", payer: "Shared",  amount: 45,  settled: false },
  { id: "lunch",  label: "Lunch — Otto's Place (est.)",       payer: "Jeff",    amount: 55,  settled: false },
  { id: "dinner", label: "Dinner — Brazen or Timmerman's",    payer: "Jeff",    amount: 140, settled: false },
  { id: "snacks", label: "Road snacks + drinks",              payer: "Partner", amount: 25,  settled: true },
  { id: "misc",   label: "Parking / activity fees",           payer: "Shared",  amount: 10,  settled: true },
];

const TRAVELERS_DATA = [
  { id: "jeff",    name: "Jeff",    role: "Driver · Navigator", status: "Ready", readiness: 94,
    tasks: ["Car fueled up", "Brazen reservation confirmed", "Timmerman's backup reservation", "Camera charged"] },
  { id: "partner", name: "Partner", role: "Co-Pilot",          status: "Ready", readiness: 88,
    tasks: ["Road snacks packed", "Playlist ready", "Sunscreen packed", "Comfortable walking shoes"] },
];

const STATUS_COLOR: Record<string, string> = { Go: C.green, Watch: C.amber, Assigned: C.blue, Pending: C.amber, Ready: C.green };

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

function KV({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 7, alignItems: "flex-start" }}>
      <div style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dim, minWidth: 82, paddingTop: 1, flexShrink: 0 }}>{label}</div>
      <div style={{ fontSize: 11, color: C.text, lineHeight: 1.5, fontFamily: mono ? "monospace" : "inherit", flex: 1 }}>{value || "—"}</div>
    </div>
  );
}

function Hr() { return <div style={{ borderTop: `1px solid ${C.border}`, margin: "10px 0" }} />; }

type Stop = typeof STOPS[number];

// ─── SVG MAP ──────────────────────────────────────────────────────────────────
function CommandMap({ selectedStop, onSelectStop, activePhase }: { selectedStop: Stop | null; onSelectStop: (s: Stop) => void; activePhase: string }) {
  const W = 800, H = 500;

  const roads = [
    "M 610,390 L 590,360 L 570,330 L 550,300 L 535,275 L 520,250",
    "M 520,250 L 490,230 L 460,215 L 430,205 L 390,200",
    "M 390,200 L 370,185 L 350,170",
    "M 430,205 L 420,240 L 415,280 L 410,310",
    "M 520,250 L 510,280 L 505,310 L 500,340 L 498,370 L 495,400",
    "M 460,215 L 455,250 L 450,285 L 445,315",
    "M 535,275 L 555,270 L 575,265 L 600,260 L 630,255",
    "M 495,400 L 520,405 L 545,410 L 570,415",
  ];

  const mississippi = "M 500,30 C 505,80 510,130 508,180 C 506,230 500,270 495,310 C 490,350 488,390 490,440 C 491,460 493,480 495,500";

  const routePts = STOPS.map(s => [lngToX(s.lng), latToY(s.lat)]);
  const routePath = routePts.map((p, i) => (i === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`)).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%", display: "block", background: "#0b0f14" }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={"gx" + i} x1={i * 100} y1={0} x2={i * 100} y2={H} stroke={C.border} strokeWidth={0.4} opacity={0.5} />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={"gy" + i} x1={0} y1={i * 100} x2={W} y2={i * 100} stroke={C.border} strokeWidth={0.4} opacity={0.5} />
      ))}

      <rect x={0} y={0} width={W} height={H} fill="#0b0f14" />

      <path d={mississippi} fill="none" stroke="#0e2133" strokeWidth={14} />
      <path d={mississippi} fill="none" stroke={C.blue} strokeWidth={1} opacity={0.25} />
      <text x={510} y={120} fill={C.blue} fontSize={8} fontStyle="italic" opacity={0.45} transform="rotate(85,510,120)">Mississippi River</text>

      {roads.map((d, i) => (
        <path key={"road" + i} d={d} fill="none" stroke="#1f2a34" strokeWidth={3} strokeLinecap="round" />
      ))}
      {roads.map((d, i) => (
        <path key={"roadc" + i} d={d} fill="none" stroke="#24313d" strokeWidth={1.5} strokeLinecap="round" opacity={0.6} />
      ))}

      <text x={320} y={430} fill={C.dim} fontSize={10} fontWeight={900} letterSpacing={3} opacity={0.5}>ILLINOIS</text>
      <text x={560} y={430} fill={C.dim} fontSize={10} fontWeight={900} letterSpacing={3} opacity={0.5}>IOWA</text>

      <path d={routePath} fill="none" stroke={C.blue} strokeWidth={1.5} strokeDasharray="5,4" opacity={0.4} />

      {STOPS.map((stop) => {
        const x = lngToX(stop.lng);
        const y = latToY(stop.lat);
        const isSelected = selectedStop?.id === stop.id;
        const isVisible = activePhase === "all" || stop.phase === activePhase;
        const opacity = isVisible ? 1 : 0.15;

        return (
          <g key={stop.id} style={{ cursor: "pointer" }} onClick={() => onSelectStop(stop)} opacity={opacity}>
            {isSelected && (
              <circle cx={x} cy={y} r={16} fill={stop.color} opacity={0.15} />
            )}
            <circle cx={x} cy={y} r={isSelected ? 11 : 8} fill={stop.color} opacity={0.18} />
            <circle cx={x} cy={y} r={isSelected ? 7 : 5} fill={stop.color} opacity={0.9} />
            <circle cx={x} cy={y} r={isSelected ? 3 : 2} fill="#ffffff" opacity={0.7} />
            <text
              x={x} y={y - 14}
              textAnchor="middle"
              fill={stop.color}
              fontSize={isSelected ? 9 : 8}
              fontWeight={isSelected ? 900 : 700}
              style={{ textShadow: "0 1px 4px #000, 0 0 8px #000", pointerEvents: "none" }}
            >
              {stop.label}
            </text>
            <text x={x} y={y + 20} textAnchor="middle" fill={C.dim} fontSize={7} style={{ pointerEvents: "none" }}>
              {stop.time}
            </text>
          </g>
        );
      })}

      <g transform="translate(16, 16)">
        <rect x={0} y={0} width={130} height={72} fill={C.surface} opacity={0.9} stroke={C.border} strokeWidth={1} />
        {[
          { color: C.red,   label: "Galena / History" },
          { color: C.amber, label: "Dining" },
          { color: C.green, label: "Dubuque / Nature" },
        ].map((l, i) => (
          <g key={l.label} transform={`translate(10, ${16 + i * 18})`}>
            <circle cx={5} cy={4} r={5} fill={l.color} opacity={0.85} />
            <text x={16} y={8} fill={C.muted} fontSize={8} fontWeight={700} letterSpacing={1}>{l.label.toUpperCase()}</text>
          </g>
        ))}
      </g>

      <text x={W - 12} y={H - 10} textAnchor="end" fill={C.dim} fontSize={7} letterSpacing={1}>GALENA IL → DUBUQUE IA</text>
    </svg>
  );
}

// ─── LEFT SIDEBAR ─────────────────────────────────────────────────────────────
function Sidebar({ selectedStop, onSelectStop, activePhase, setActivePhase }: { selectedStop: Stop | null; onSelectStop: (s: Stop) => void; activePhase: string; setActivePhase: (p: string) => void }) {
  const filteredStops = activePhase === "all" ? STOPS : STOPS.filter(s => s.phase === activePhase);

  return (
    <div style={{ width: 224, flexShrink: 0, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
        <Eyebrow>Current Situation</Eyebrow>
        <div style={{ fontSize: 13, fontWeight: 900, color: C.text, marginBottom: 2 }}>Galena × Dubuque</div>
        <div style={{ fontSize: 9, color: C.muted }}>Day trip · {STOPS.length} stops planned</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 10 }}>
          {[{ l: "Stops", v: STOPS.length, c: C.blue }, { l: "Hrs drive", v: "~3", c: C.green }].map(s => (
            <div key={s.l} style={{ border: `1px solid ${C.border}`, padding: "5px 8px", background: C.surfaceAlt }}>
              <div style={{ fontSize: 7, color: C.dim, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.l}</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: s.c, fontFamily: "monospace" }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}` }}>
        <Eyebrow>Phase Filter</Eyebrow>
        {([["all", "All Phases", C.blue], ["morning", "Morning", C.red], ["afternoon", "Afternoon", C.green], ["evening", "Evening", C.amber]] as const).map(([id, lbl, col]) => (
          <button key={id} onClick={() => setActivePhase(id)}
            style={{
              display: "flex", alignItems: "center", gap: 6, width: "100%",
              background: activePhase === id ? col + "18" : "transparent",
              border: `1px solid ${activePhase === id ? col : "transparent"}`,
              color: activePhase === id ? col : C.muted,
              fontSize: 8, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase",
              padding: "5px 8px", cursor: "pointer", marginBottom: 2, borderRadius: 0, fontFamily: "inherit",
            }}>
            <span>◈</span> {lbl}
          </button>
        ))}
      </div>

      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, flex: 1 }}>
        <Eyebrow>Stop Roster</Eyebrow>
        {filteredStops.map(stop => (
          <div key={stop.id} onClick={() => onSelectStop(stop)}
            style={{
              padding: "7px 8px", border: `1px solid ${selectedStop?.id === stop.id ? stop.color : C.border2}`,
              background: selectedStop?.id === stop.id ? stop.color + "12" : "transparent",
              cursor: "pointer", marginBottom: 4,
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.text, flex: 1, marginRight: 6 }}>{stop.label}</div>
              <Pill label={stop.phase} color={stop.color} />
            </div>
            <div style={{ fontSize: 8, color: C.muted, marginTop: 2, fontFamily: "monospace" }}>{stop.time}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "10px 14px" }}>
        <Eyebrow>Travel Units</Eyebrow>
        {TRAVELERS_DATA.map(t => (
          <div key={t.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: C.text }}>{t.name}</span>
              <Pill label={t.status} color={STATUS_COLOR[t.status]} />
            </div>
            <div style={{ fontSize: 8, color: C.muted, marginBottom: 4 }}>{t.role}</div>
            <div style={{ height: 3, background: C.border }}>
              <div style={{ height: "100%", width: t.readiness + "%", background: C.green }} />
            </div>
            <div style={{ fontSize: 7, color: C.dim, fontFamily: "monospace", marginTop: 2 }}>{t.readiness}% ready</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RIGHT INSPECTOR ──────────────────────────────────────────────────────────
function Inspector({ selectedStop }: { selectedStop: Stop | null }) {
  const [notes, setNotes] = useState("");
  const meal = MEALS.find(m => m.id === selectedStop?.id);
  const activity = ACTIVITIES.find(a => a.id === selectedStop?.id);

  if (!selectedStop) {
    return (
      <div style={{ width: 272, flexShrink: 0, background: C.surface, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ fontSize: 32, color: C.border, marginBottom: 12 }}>◈</div>
        <div style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase", color: C.dim, textAlign: "center", lineHeight: 1.8 }}>
          Select a stop on the map or roster to load intelligence
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: 272, flexShrink: 0, background: C.surface, borderLeft: `1px solid ${C.border}`, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, background: C.surfaceAlt }}>
        <div style={{ fontSize: 7, color: C.dim, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 4 }}>Location</div>
        <div style={{ fontSize: 13, fontWeight: 900, color: C.text, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.2 }}>{selectedStop.label}</div>
        <div style={{ fontSize: 9, color: selectedStop.color, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>{selectedStop.caption}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
          {[{ l: "Time", v: selectedStop.time }, { l: "Phase", v: selectedStop.phase }].map(s => (
            <div key={s.l} style={{ border: `1px solid ${C.border}`, padding: "5px 8px", background: C.bg }}>
              <div style={{ fontSize: 7, color: C.dim, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.l}</div>
              <div style={{ fontSize: 10, fontWeight: 900, color: s.l === "Phase" ? selectedStop.color : C.text, fontFamily: "monospace", textTransform: "uppercase" }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {activity && (
        <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
          <Eyebrow>Activity Intel</Eyebrow>
          <KV label="Window" value={activity.window} />
          <KV label="Duration" value={activity.duration} />
          <KV label="Cost" value={activity.cost} mono />
          <KV label="Status" value={activity.status} />
          <Hr />
          <Eyebrow color={C.muted}>Field Notes</Eyebrow>
          <div style={{ fontSize: 10, color: C.text, lineHeight: 1.6, marginBottom: 10 }}>{activity.tips}</div>
          <div style={{ border: `1px solid ${C.amber}33`, padding: "8px 10px", background: C.amber + "08" }}>
            <div style={{ fontSize: 7, fontWeight: 900, color: C.amber, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>Contingency</div>
            <div style={{ fontSize: 9, color: C.muted, lineHeight: 1.5 }}>{activity.backup}</div>
          </div>
        </div>
      )}

      {meal && (
        <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
          <Eyebrow>Dining Intel</Eyebrow>
          <KV label="Venue" value={meal.name} />
          <KV label="Location" value={meal.location} />
          <KV label="Type" value={meal.type} />
          <KV label="Reservation" value={meal.res} />
          <Hr />
          <Eyebrow color={C.muted}>Signature Items</Eyebrow>
          {meal.highlights.map(h => (
            <div key={h} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
              <div style={{ width: 3, height: 3, background: C.amber, flexShrink: 0 }} />
              <div style={{ fontSize: 10, color: C.text }}>{h}</div>
            </div>
          ))}
          <Hr />
          <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.6 }}>{meal.note}</div>
        </div>
      )}

      <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
        <Eyebrow>Location Intel</Eyebrow>
        <KV label="Lat / Lng" value={`${selectedStop.lat.toFixed(4)}, ${selectedStop.lng.toFixed(4)}`} mono />
        <KV label="Region" value={selectedStop.phase === "morning" ? "Galena, IL" : "Dubuque, IA"} />
      </div>

      <div style={{ padding: "12px 14px", flex: 1 }}>
        <Eyebrow>Decisions & Context</Eyebrow>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Capture planning notes, constraints, or reminders..."
          style={{ width: "100%", minHeight: 80, background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 10, padding: "8px 10px", resize: "vertical", fontFamily: "inherit", lineHeight: 1.5, outline: "none", boxSizing: "border-box" }}
        />
      </div>
    </div>
  );
}

// ─── MAP PAGE ─────────────────────────────────────────────────────────────────
function MapPage({ selectedStop, onSelectStop, activePhase, setActivePhase }: { selectedStop: Stop | null; onSelectStop: (s: Stop) => void; activePhase: string; setActivePhase: (p: string) => void }) {
  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      <Sidebar selectedStop={selectedStop} onSelectStop={onSelectStop} activePhase={activePhase} setActivePhase={setActivePhase} />
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <CommandMap selectedStop={selectedStop} onSelectStop={onSelectStop} activePhase={activePhase} />
        <div style={{ position: "absolute", top: 10, left: 10, background: C.surface + "ee", border: `1px solid ${C.border}`, padding: "4px 10px", display: "flex", alignItems: "center", gap: 6, fontSize: 8, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted }}>
          <span>⬡</span> MAP LAYER · Galena–Dubuque Corridor
        </div>
      </div>
      <Inspector selectedStop={selectedStop} />
    </div>
  );
}

function OverviewPage() {
  const total = EXPENSES_INIT.reduce((s, e) => s + e.amount, 0);
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
      <SecHead eyebrow="Mission Brief" title="Galena × Dubuque Day Trip" meta="One-day culinary & heritage circuit · Illinois → Iowa" />
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 18 }}>
        <Box>
          <div style={{ fontSize: 12, color: C.text, lineHeight: 1.8, marginBottom: 12 }}>
            A single-day circuit through the Illinois–Iowa tri-state corridor. Start in historic Galena for heritage touring and high-rated brunch, cross the Mississippi into Dubuque for afternoon nature exploration along limestone bluffs, then close with one of the region's top-tier dining experiences overlooking the river.
          </div>
          <Hr />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {[{ l: "Stops", v: STOPS.length, c: C.blue }, { l: "Dining", v: "3 venues", c: C.amber }, { l: "Drive", v: "~3 hrs", c: C.green }, { l: "Budget", v: "$" + total, c: C.violet }].map(s => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: s.c, fontFamily: "monospace" }}>{s.v}</div>
                <div style={{ fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </Box>
        <Box>
          <Eyebrow>Traveler Readiness</Eyebrow>
          {TRAVELERS_DATA.map(t => (
            <div key={t.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: C.text }}>{t.name}</span>
                <Pill label={t.status} color={C.green} />
              </div>
              <div style={{ height: 3, background: C.border }}>
                <div style={{ height: "100%", width: t.readiness + "%", background: C.green }} />
              </div>
              <div style={{ fontSize: 8, color: C.dim, fontFamily: "monospace", marginTop: 2 }}>{t.readiness}% ready</div>
            </div>
          ))}
        </Box>
      </div>
      <SecHead eyebrow="Day Arc" title="Phase Overview" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          { phase: "morning",   items: ["9:00 AM — Grant Home Tour", "10:30 AM — Horseshoe Mound", "12:00 PM — Lunch at Otto's"] },
          { phase: "afternoon", items: ["2:00 PM — Dubuque Arboretum", "3:30 PM — Mines of Spain", "4:45 PM — Eagle Point Park"] },
          { phase: "evening",   items: ["6:00 PM — Dinner (Brazen or Timmerman's)", "8:00 PM — Return drive home"] },
        ].map(p => (
          <Box key={p.phase}>
            <Eyebrow color={PHASE_META[p.phase].color}>{PHASE_META[p.phase].label} · {PHASE_META[p.phase].range}</Eyebrow>
            {p.items.map(item => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
                <div style={{ width: 3, height: 3, background: PHASE_META[p.phase].color, marginTop: 4, flexShrink: 0 }} />
                <div style={{ fontSize: 11, color: C.text, lineHeight: 1.4 }}>{item}</div>
              </div>
            ))}
          </Box>
        ))}
      </div>
    </div>
  );
}

function ItineraryPage() {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
      <SecHead eyebrow="Mission Timeline" title="Chronological Schedule" meta="7:00 AM — 9:00 PM" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {TIMELINE_ITEMS.map((item, i) => (
          <Box key={i} style={{ padding: "11px 13px" }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: PHASE_META[item.phase].color, fontFamily: "monospace", marginBottom: 4 }}>{item.time}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{item.label}</div>
            {item.stopId && <div style={{ fontSize: 9, color: C.muted, marginTop: 3 }}>{STOPS.find(s => s.id === item.stopId)?.caption}</div>}
          </Box>
        ))}
      </div>
    </div>
  );
}

function MealsPage() {
  const [sel, setSel] = useState("ottos");
  const m = MEALS.find(x => x.id === sel) || MEALS[0];
  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      <div style={{ width: 290, borderRight: `1px solid ${C.border}`, overflowY: "auto", padding: 18, background: C.surface, flexShrink: 0 }}>
        <SecHead eyebrow="Feeding Plan" title="Dining Stops" meta={MEALS.length + " venues"} />
        {MEALS.map(m2 => (
          <Box key={m2.id} selected={sel === m2.id} onClick={() => setSel(m2.id)} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{m2.time}</span>
              <Pill label={m2.status} color={STATUS_COLOR[m2.status]} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 900, color: C.text }}>{m2.name}</div>
            <div style={{ fontSize: 9, color: C.amber, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 3 }}>{m2.type}</div>
          </Box>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        <SecHead eyebrow="Venue Intelligence" title={m.name} meta={m.location} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <Box>
            <Eyebrow>Details</Eyebrow>
            <KV label="Type" value={m.type} />
            <KV label="Location" value={m.location} />
            <KV label="Timing" value={m.time + " — " + m.label} />
            <KV label="Reservation" value={m.res} />
          </Box>
          <Box>
            <Eyebrow>Signature Items</Eyebrow>
            {m.highlights.map(h => (
              <div key={h} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 7 }}>
                <div style={{ width: 3, height: 3, background: C.amber, flexShrink: 0 }} />
                <div style={{ fontSize: 11, color: C.text }}>{h}</div>
              </div>
            ))}
          </Box>
        </div>
        <Box><Eyebrow>Operational Note</Eyebrow><div style={{ fontSize: 11, color: C.text, lineHeight: 1.7 }}>{m.note}</div></Box>
        {(m.id === "brazen" || m.id === "timmermans") && (
          <Box style={{ marginTop: 12, borderColor: C.amber + "55" }}>
            <Eyebrow color={C.amber}>◈ Commander's Note — Dinner Decision</Eyebrow>
            <div style={{ fontSize: 11, color: C.text, lineHeight: 1.7 }}>
              <strong style={{ color: C.blue }}>Brazen</strong> is the forward-leaning choice — modern, technique-driven, chef's vision.{" "}
              <strong style={{ color: C.green }}>Timmerman's</strong> is the classic Midwest institution — choose for sunset Mississippi views and a memorable steak evening. Recommend booking both and deciding day-of.
            </div>
          </Box>
        )}
      </div>
    </div>
  );
}

function ActivitiesPage() {
  const [sel, setSel] = useState("grant-home");
  const a = ACTIVITIES.find(x => x.id === sel) || ACTIVITIES[0];
  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      <div style={{ width: 270, borderRight: `1px solid ${C.border}`, overflowY: "auto", padding: 18, background: C.surface, flexShrink: 0 }}>
        <SecHead eyebrow="Activity Board" title="Day Missions" meta={ACTIVITIES.length + " tracked"} />
        {ACTIVITIES.map(a2 => (
          <Box key={a2.id} selected={sel === a2.id} onClick={() => setSel(a2.id)} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 8, color: PHASE_META[a2.phase].color, textTransform: "uppercase", letterSpacing: "0.1em" }}>{a2.phase}</span>
              <Pill label={a2.status} color={STATUS_COLOR[a2.status]} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 900, color: C.text }}>{a2.title}</div>
            <div style={{ fontSize: 8, color: C.muted, marginTop: 3 }}>{a2.window}</div>
          </Box>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        <SecHead eyebrow="Activity Intelligence" title={a.title} meta={a.window} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <Box>
            <Eyebrow>Logistics</Eyebrow>
            <KV label="Window" value={a.window} />
            <KV label="Duration" value={a.duration} />
            <KV label="Cost" value={a.cost} mono />
          </Box>
          <Box><Eyebrow>Field Notes</Eyebrow><div style={{ fontSize: 11, color: C.text, lineHeight: 1.6 }}>{a.tips}</div></Box>
        </div>
        <Box style={{ borderColor: C.amber + "44" }}>
          <Eyebrow color={C.amber}>Contingency</Eyebrow>
          <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>{a.backup}</div>
        </Box>
      </div>
    </div>
  );
}

function ExpensesPage() {
  const [exps, setExps] = useState(EXPENSES_INIT);
  const total = exps.reduce((s, e) => s + e.amount, 0);
  const settled = exps.filter(e => e.settled).reduce((s, e) => s + e.amount, 0);
  const toggle = (id: string) => setExps(p => p.map(e => e.id === id ? { ...e, settled: !e.settled } : e));
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
      <SecHead eyebrow="Budget Tracker" title="Trip Expenses" meta="Estimated day-trip spend" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 18 }}>
        {[{ l: "Total", v: "$" + total, c: C.blue }, { l: "Settled", v: "$" + settled, c: C.green }, { l: "Outstanding", v: "$" + (total - settled), c: total - settled > 0 ? C.amber : C.green }].map(s => (
          <Box key={s.l}>
            <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{s.l}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.c, fontFamily: "monospace" }}>{s.v}</div>
          </Box>
        ))}
      </div>
      <Box style={{ padding: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 90px 90px", padding: "7px 14px", borderBottom: `1px solid ${C.border}`, background: C.surface }}>
          {["Line Item", "Payer", "Amount", "Status"].map(h => <div key={h} style={{ fontSize: 7, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: C.dim }}>{h}</div>)}
        </div>
        {exps.map((e, i) => (
          <div key={e.id} style={{ display: "grid", gridTemplateColumns: "1fr 110px 90px 90px", padding: "9px 14px", borderBottom: i < exps.length - 1 ? `1px solid ${C.border}` : "none", background: i % 2 ? C.border + "12" : "transparent" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{e.label}</div>
            <div style={{ fontSize: 10, color: C.muted }}>{e.payer}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.blue, fontFamily: "monospace" }}>${e.amount}</div>
            <button onClick={() => toggle(e.id)}
              style={{ fontSize: 7, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", padding: "2px 7px", border: "none", cursor: "pointer", borderRadius: 0, fontFamily: "inherit", background: e.settled ? C.green + "22" : C.amber + "22", color: e.settled ? C.green : C.amber }}>
              {e.settled ? "Settled" : "Pending"}
            </button>
          </div>
        ))}
      </Box>
    </div>
  );
}

function TravelersPage() {
  const [travelers, setTravelers] = useState(
    TRAVELERS_DATA.map(t => ({ ...t, checklist: t.tasks.map((task, i) => ({ id: t.id + i, label: task, done: i < 2 })) }))
  );
  const [sel, setSel] = useState("jeff");
  const liveT = travelers.find(x => x.id === sel) || travelers[0];

  const toggle = (tid: string, cid: string) => {
    setTravelers(prev => prev.map(tr => {
      if (tr.id !== tid) return tr;
      const newList = tr.checklist.map(c => c.id === cid ? { ...c, done: !c.done } : c);
      return { ...tr, checklist: newList, readiness: Math.round((newList.filter(c => c.done).length / newList.length) * 100) };
    }));
  };

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      <div style={{ width: 256, borderRight: `1px solid ${C.border}`, overflowY: "auto", padding: 18, background: C.surface, flexShrink: 0 }}>
        <SecHead eyebrow="Party Roster" title="Travelers" meta={travelers.length + " confirmed"} />
        {travelers.map(tr => (
          <Box key={tr.id} selected={sel === tr.id} onClick={() => setSel(tr.id)} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: C.text }}>{tr.name}</span>
              <Pill label={tr.status} color={C.green} />
            </div>
            <div style={{ fontSize: 9, color: C.muted, marginBottom: 7 }}>{tr.role}</div>
            <div style={{ height: 3, background: C.border }}>
              <div style={{ height: "100%", width: tr.readiness + "%", background: C.green, transition: "width .3s" }} />
            </div>
            <div style={{ fontSize: 7, color: C.dim, fontFamily: "monospace", marginTop: 2 }}>{tr.readiness}% ready</div>
          </Box>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        <SecHead eyebrow="Traveler Dossier" title={liveT.name} meta={liveT.role} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Box>
            <Eyebrow>Assignment</Eyebrow>
            <KV label="Role" value={liveT.role} />
            <KV label="Status" value={liveT.status} />
            <KV label="Readiness" value={liveT.readiness + "%"} mono />
          </Box>
          <Box>
            <Eyebrow>Pre-Departure Checklist</Eyebrow>
            {liveT.checklist.map(item => (
              <div key={item.id} onClick={() => toggle(liveT.id, item.id)}
                style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", padding: "5px 0", borderBottom: `1px solid ${C.border}44` }}>
                <div style={{ width: 12, height: 12, border: `1.5px solid ${item.done ? C.green : C.border}`, background: item.done ? C.green + "22" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {item.done && <div style={{ width: 5, height: 5, background: C.green }} />}
                </div>
                <div style={{ fontSize: 10, color: item.done ? C.dim : C.text, textDecoration: item.done ? "line-through" : "none" }}>{item.label}</div>
              </div>
            ))}
          </Box>
        </div>
      </div>
    </div>
  );
}

function TimelineBar({ selectedStop, onSelectStop, activePhase, setActivePhase }: { selectedStop: Stop | null; onSelectStop: (s: Stop) => void; activePhase: string; setActivePhase: (p: string) => void }) {
  const TOTAL = 14;
  const HOURS = ["7A","8A","9A","10A","11A","12P","1P","2P","3P","4P","5P","6P","7P","8P","9P"];
  const BLOCKS = [
    { start: 2, span: 1.5, color: C.red,   label: "Grant Home" },
    { start: 3.5, span: 1.5, color: C.red, label: "Horseshoe" },
    { start: 5, span: 1.5, color: C.amber, label: "Otto's Lunch" },
    { start: 7, span: 1.5, color: C.green, label: "Arboretum" },
    { start: 8.5, span: 1.25, color: C.green, label: "Mines of Spain" },
    { start: 9.75, span: 0.75, color: C.green, label: "Eagle Point" },
    { start: 11, span: 2, color: C.amber, label: "Dinner" },
  ];

  const timeToHour = (t: string) => {
    const [hm, ap] = t.split(" ");
    const [h, m] = hm.split(":").map(Number);
    let hr = h + (m || 0) / 60;
    if (ap === "PM" && h !== 12) hr += 12;
    if (ap === "AM" && h === 12) hr = 0;
    return hr;
  };

  return (
    <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", height: 82, flexShrink: 0 }}>
      <div style={{ width: 128, borderRight: `1px solid ${C.border}`, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "space-around", padding: "4px 10px" }}>
        {([["morning", "GALENA", C.red], ["afternoon", "DUBUQUE", C.green], ["evening", "DINNER", C.amber]] as const).map(([id, lbl, col]) => (
          <div key={id} onClick={() => setActivePhase(activePhase === id ? "all" : id)}
            style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
            <div style={{ width: 3, height: 3, background: (activePhase === "all" || activePhase === id) ? col : C.dim, flexShrink: 0 }} />
            <span style={{ fontSize: 7, fontWeight: 900, color: (activePhase === "all" || activePhase === id) ? col : C.dim, letterSpacing: "0.14em" }}>{lbl}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", height: 16, borderBottom: `1px solid ${C.border}` }}>
          {HOURS.map(h => <div key={h} style={{ flex: 1, fontSize: 7, color: C.dim, letterSpacing: "0.06em", fontWeight: 700, display: "flex", alignItems: "center", paddingLeft: 3, fontFamily: "monospace" }}>{h}</div>)}
        </div>

        <div style={{ flex: 1, position: "relative" }}>
          {BLOCKS.map((b, i) => (
            <div key={i} style={{ position: "absolute", left: `${(b.start / TOTAL) * 100}%`, width: `${(b.span / TOTAL) * 100}%`, top: 3, bottom: 3, background: b.color + "18", borderLeft: `2px solid ${b.color}`, display: "flex", alignItems: "center", padding: "0 5px", overflow: "hidden" }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: b.color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.label}</span>
            </div>
          ))}

          {STOPS.map(stop => {
            const hr = timeToHour(stop.time);
            const pos = ((hr - 7) / TOTAL) * 100;
            if (pos < 0 || pos > 100) return null;
            return (
              <div key={stop.id} onClick={() => onSelectStop(stop)} title={stop.label}
                style={{ position: "absolute", left: `${Math.min(pos, 98)}%`, bottom: 5, width: 7, height: 7, borderRadius: "50%", background: stop.color, cursor: "pointer", zIndex: 10, boxShadow: selectedStop?.id === stop.id ? `0 0 0 2px ${stop.color}66` : "none" }} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

const TABS = ["map", "overview", "itinerary", "meals", "activities", "expenses", "travelers"];
const TAB_ICON: Record<string, string> = { map: "⬡", overview: "◈", itinerary: "▦", meals: "◉", activities: "◐", expenses: "▣", travelers: "◫" };

function TopBar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (t: string) => void }) {
  return (
    <div style={{ height: 40, background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 14px", gap: 0, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 18 }}>
        <div style={{ width: 20, height: 20, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: C.bg }}>P</div>
        <div>
          <div style={{ fontSize: 7, fontWeight: 900, color: C.muted, textTransform: "uppercase", letterSpacing: "0.18em" }}>UNCLASSIFIED // TRIP OPS</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.07em" }}>DAY TRIP COMMAND CENTER</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 1, flex: 1 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ background: activeTab === t ? C.blue + "18" : "transparent", border: `1px solid ${activeTab === t ? C.blue : "transparent"}`, color: activeTab === t ? C.blue : C.muted, fontSize: 8, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit", borderRadius: 0 }}>
            <span>{TAB_ICON[t]}</span>{t}
          </button>
        ))}
      </div>
      {Object.entries(PHASE_META).map(([id, p]) => (
        <div key={id} style={{ marginLeft: 14, textAlign: "right" }}>
          <div style={{ fontSize: 6, color: C.dim, textTransform: "uppercase", letterSpacing: "0.1em" }}>{p.label}</div>
          <div style={{ fontSize: 8, fontWeight: 700, color: p.color }}>72°F · Sunny</div>
        </div>
      ))}
    </div>
  );
}

export default function DayTrip() {
  const [activeTab, setActiveTab] = useState("map");
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [activePhase, setActivePhase] = useState("all");

  const handleSelectStop = useCallback((stop: Stop) => {
    setSelectedStop(prev => prev?.id === stop.id ? null : stop);
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case "map":        return <MapPage selectedStop={selectedStop} onSelectStop={handleSelectStop} activePhase={activePhase} setActivePhase={setActivePhase} />;
      case "overview":   return <OverviewPage />;
      case "itinerary":  return <ItineraryPage />;
      case "meals":      return <MealsPage />;
      case "activities": return <ActivitiesPage />;
      case "expenses":   return <ExpensesPage />;
      case "travelers":  return <TravelersPage />;
      default:           return <OverviewPage />;
    }
  };

  return (
    <div style={{ fontFamily: "'IBM Plex Mono','Courier New',monospace", background: C.bg, color: C.text, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontSize: 12 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700;900&display=swap'); .day-trip-root *{box-sizing:border-box} .day-trip-root ::-webkit-scrollbar{width:4px} .day-trip-root ::-webkit-scrollbar-track{background:${C.bg}} .day-trip-root ::-webkit-scrollbar-thumb{background:${C.border}} .day-trip-root button{font-family:inherit} .day-trip-root textarea:focus{outline:1px solid ${C.blue}}`}</style>

      <div className="day-trip-root" style={{ display: "contents" }}>
        <TopBar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {renderPage()}
        </div>

        <TimelineBar selectedStop={selectedStop} onSelectStop={handleSelectStop} activePhase={activePhase} setActivePhase={setActivePhase} />

        <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: "4px 14px", display: "flex", alignItems: "center", gap: 18, fontSize: 7, color: C.dim, letterSpacing: "0.12em", textTransform: "uppercase", flexShrink: 0 }}>
          <span style={{ color: C.green }}>● System Nominal</span>
          <span>Galena, IL → Dubuque, IA</span>
          <span>Day Trip Command Center</span>
          {selectedStop && <span style={{ color: selectedStop.color }}>■ {selectedStop.label}</span>}
          <span style={{ marginLeft: "auto" }}>Unclassified // Trip Ops</span>
        </div>
      </div>
    </div>
  );
}
