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
  { day: 1, date: "Sat May 30", phase: "city", region: "Downtown / Midtown Sacramento", title: "Floral Highlights + Central Parks", lodging: "Kimpton Sawyer", notes: "Weather: Sunny · High 82°F / Low 54°F. 10:00 AM — State Capitol Park World Peace Rose Garden (650+ roses, free, 1h). 11:30 AM — McKinley Rose Garden (1,200 bushes, featured in Lady Bird, free, 1h). 1:00 PM — Midtown lunch near Fremont Park (Ink Eats & Drinks / Burgers and Brew / Cafe Bernardo, $15–30 pp). 2:30 PM — John C. Fremont Park 'Fremont Park Bloom' installation (6–9 ft illuminated poppy sculptures, free, 1h)." },
  { day: 2, date: "Sun May 31", phase: "city", region: "Old Sacramento Waterfront", title: "Waterfront + Historic Exploration", lodging: "Kimpton Sawyer", notes: "Weather: Sunny · High 87°F / Low 56°F. 10:00 AM — Old Sacramento Waterfront (28-acre historic district, free, ~$1.50–3/hr street parking, 2h). 12:15 PM — Waterfront lunch: Rio City Cafe ($20–45) OR Delta King Hotel Pilothouse on 1927 paddlewheeler ($18–40). 2:00 PM — California State Railroad Museum (vintage steam locomotives, A/C escape, $12 adult, 2h). 6:30 PM — Dinner at The Firehouse Restaurant (1850s firehouse, ivy courtyard, $35–65+)." },
  { day: 3, date: "Mon Jun 1",  phase: "alpine", region: "Lake Tahoe (day trip)", title: "Tahoe Mountain + High-Flying Adventure", lodging: "Kimpton Sawyer", notes: "Weather: Crisp alpine · High 62°F / Low 38°F · 25% light rain — pack layers + rain jacket. Depart Sac 7:00 AM via US-50 E (~2h, 100 mi, sea level → 6,200 ft). 9:15 AM Emerald Bay overlook ($10 parking, 1h). 10:15 AM Vikingsholm Castle tour (1mi steep downhill, $18 adult, 1.5–2h). 12:30 PM lunch Zephyr Cove Restaurant ($15–25 pp). 2:00 PM M.S. Dixie II paddlewheel cruise to Emerald Bay (heated cabins, $99 adult, 2h). 4:30 PM choose: parasailing 400/800/1000 ft ($100.70–$127.20) OR Tahoe Treetop Adventure Parks (27 ziplines, from $75, 2.5h, +45min drive). 6:30 PM dinner near marina / S. Lake Tahoe then 2h drive back to Sacramento." },
  { day: 4, date: "Tue Jun 2",  phase: "city", region: "Sacramento River + Land Park", title: "River + Land Park", lodging: "Kimpton Sawyer", notes: "Weather: Sunny · High 93°F / Low 60°F — hottest day, hydrate. Tower Bridge + riverwalk AM. Lunch in Land Park. Afternoon at Sacramento Zoo / Fairytale Town. Evening Kings/River Cats game or Golden 1 area." },
  { day: 5, date: "Wed Jun 3",  phase: "city", region: "Old Sugar Mill + Davis", title: "Wine + Davis", lodging: "Kimpton Sawyer", notes: "Weather: Sunny · High 85°F / Low 56°F. Old Sugar Mill wineries in Clarksburg AM. Lunch in Davis. UC Davis arboretum stroll. Return to Sac for farm-to-fork dinner." },
  { day: 6, date: "Thu Jun 4",  phase: "departure", region: "Sacramento → SMF", title: "Departure", lodging: "—", notes: "Coffee at Temple. Quick Midtown stroll. Return rental at SMF. Evening flight home." },
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
  { id: "peace-rose",  title: "World Peace Rose Garden (Capitol Park)", day: 1, status: "Open",   cost: 0,   vendor: "CA State Parks" },
  { id: "mckinley",    title: "McKinley Rose Garden",                   day: 1, status: "Open",   cost: 0,   vendor: "City of Sacramento" },
  { id: "fremont",     title: "Fremont Park Bloom Installation",        day: 1, status: "Open",   cost: 0,   vendor: "Public Art Sac" },
  { id: "oldsac",      title: "Old Sacramento Waterfront Walk",         day: 2, status: "Open",   cost: 0,   vendor: "Self-guided" },
  { id: "railroad",    title: "California State Railroad Museum",       day: 2, status: "Open",   cost: 12,  vendor: "CA State Railroad Museum" },
  { id: "firehouse",   title: "Dinner — The Firehouse Restaurant",      day: 2, status: "Booked", cost: 130, vendor: "The Firehouse (OpenTable)" },
  { id: "emerald",     title: "Emerald Bay Overlook + Parking",         day: 3, status: "Open",   cost: 10,  vendor: "CA State Parks" },
  { id: "vikingsholm", title: "Vikingsholm Castle Tour",                day: 3, status: "Booked", cost: 36,  vendor: "CA State Parks (Visitor Ctr)" },
  { id: "dixie",       title: "M.S. Dixie II Scenic Cruise",            day: 3, status: "Booked", cost: 198, vendor: "Zephyr Cove Marina" },
  { id: "parasail",    title: "Parasailing (Action Watersports)",       day: 3, status: "Open",   cost: 222, vendor: "Timber Cove Marina" },
  { id: "treetop",     title: "Tahoe Treetop Adventure Parks (alt.)",   day: 3, status: "Open",   cost: 150, vendor: "Tahoe Treetop, Tahoe City" },
  { id: "zoo",         title: "Sacramento Zoo",                         day: 4, status: "Booked", cost: 40,  vendor: "Sacramento Zoo" },
  { id: "wine",        title: "Old Sugar Mill Tasting",                 day: 5, status: "Booked", cost: 60,  vendor: "Old Sugar Mill" },
];

const BUDGET = [
  { cat: "Flights",    planned: 780,  actual: 742, color: C.blue },
  { cat: "Lodging",    planned: 1350, actual: 1350, color: C.green },
  { cat: "Rental Car", planned: 480,  actual: 442,  color: C.amber },
  { cat: "Activities", planned: 720,  actual: 0,    color: C.teal },
  { cat: "Food",       planned: 900,  actual: 0,    color: C.violet },
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

type DayItem = {
  day: number; date: string; phase: string; region: string; title: string; lodging: string; notes: string;
};
type LodgingItem = { id: string; name: string; nights: number; region: string; type: string; conf: string; price: number; status: string };
type FlightItem = { id: string; leg: string; route: string; carrier: string; dep: string; arr: string; seats: string; status: string };
type ActivityItem = { id: string; title: string; day: number; status: string; cost: number; vendor: string };
type BudgetItem = { cat: string; planned: number; actual: number; color: string };
type PackingGroup = { cat: string; items: string[] };
type ChecklistItem = { label: string; note: string };
type Reminder = { label: string; text: string; color: string };

type TripData = {
  days: DayItem[];
  lodging: LodgingItem[];
  flights: FlightItem[];
  activities: ActivityItem[];
  budget: BudgetItem[];
  packing: PackingGroup[];
  checklist: ChecklistItem[];
  reminders: Reminder[];
};

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
  data: TripData;
};

// ── CALIFORNIA DATA (uses existing globals) ──
const CA_DATA: TripData = {
  days: DAYS, lodging: LODGING, flights: FLIGHTS, activities: ACTIVITIES, budget: BUDGET, packing: PACKING,
  checklist: [
    { label: "Online Check-In", note: "United 24h prior — May 29 @ 08:10" },
    { label: "Rental Car Confirm", note: "Verify SUV category + snow-chain policy" },
    { label: "Hotel Check-In", note: "Kimpton Sawyer digital key / early check-in request" },
    { label: "Dining Reservations", note: "The Firehouse, The Beacon Bar — confirm OpenTable" },
    { label: "Activity Confirm", note: "Crocker Museum, Zoo, Sugar Mill, Tahoe Adventure Co." },
    { label: "Weather Check", note: "Sacramento + Tahoe 7-day forecast — pack layers" },
    { label: "Download Offline Maps", note: "Tahoe basin has dead zones on US-50 / NV-28" },
    { label: "Cash Withdrawal", note: "$40 for tolls / parking / tips" },
  ],
  reminders: [
    { label: "Chain Carry Requirement", color: C.amber, text: "California requires chain carry in controlled zones through June. Rental SUV must have chains in trunk even if not used." },
    { label: "Altitude Prep",           color: C.teal,  text: "Sand Harbor is ~6,225 ft. Start hydration 24h before Day 4. Pack electrolytes and avoid alcohol the night before." },
    { label: "Tahoe Day Cutoff",        color: C.green, text: "Depart Tahoe NLT 18:00 to guarantee safe return. If weather or traffic worsens, swap Sand Harbor for Heavenly Village." },
    { label: "Rental Return",           color: C.violet, text: "Return SUV at SMF by 17:00 on Jun 4. Fill gas near airport. Allow 30 min for shuttle to terminal." },
  ],
};

// ── COSTA RICA DATA ──
const CR_DAYS: DayItem[] = [
  { day: 1, date: "Feb 14", phase: "arrival",   region: "San José (SJO)",         title: "Arrive + Drive to Arenal",  lodging: "Tabacón Resort",   notes: "Land SJO ~13:00. Pick up 4×4. Drive ~3h to La Fortuna. Sunset hot springs + dinner at Tabacón." },
  { day: 2, date: "Feb 15", phase: "alpine",    region: "Arenal Volcano NP",      title: "Volcano + Hot Springs",     lodging: "Tabacón Resort",   notes: "1968 Trail hike AM. Lunch in La Fortuna. Sky Tram + zipline PM. Hot springs at sunset." },
  { day: 3, date: "Feb 16", phase: "alpine",    region: "Tenorio NP",             title: "Río Celeste Day Hike",      lodging: "Tabacón Resort",   notes: "Early start. 4 mi RT to the turquoise waterfall. Lunch at Soda La Tica. Return to Arenal." },
  { day: 4, date: "Feb 17", phase: "transit",   region: "Arenal → Monteverde",    title: "Cloud Forest Transfer",     lodging: "Hotel Belmar",     notes: "Boat-taxi-boat across Lake Arenal. Check in at Belmar. Night walk in Monteverde." },
  { day: 5, date: "Feb 18", phase: "alpine",    region: "Monteverde Cloud Forest", title: "Hanging Bridges + Quetzal", lodging: "Hotel Belmar",    notes: "Selvatura hanging bridges AM. Coffee + chocolate tour PM. Sunset cocktails at Belmar." },
  { day: 6, date: "Feb 19", phase: "transit",   region: "Monteverde → Manuel Antonio", title: "Drive to Pacific",     lodging: "Arenas del Mar",   notes: "~4h drive south. Beach check-in at Arenas del Mar. Sunset swim." },
  { day: 7, date: "Feb 20", phase: "city",      region: "Manuel Antonio NP",      title: "Wildlife + Beach",          lodging: "Arenas del Mar",   notes: "Guided park tour AM (sloths, capuchins, scarlet macaws). Beach + lunch at Playa Manuel Antonio." },
  { day: 8, date: "Feb 21", phase: "city",      region: "Quepos / Pacific",       title: "Sunset Catamaran",          lodging: "Arenas del Mar",   notes: "Spa morning. Catamaran sunset cruise from Quepos (snorkel + dinner)." },
  { day: 9, date: "Feb 22", phase: "departure", region: "Manuel Antonio → SJO",   title: "Departure",                 lodging: "—",                notes: "Drive 3h back to SJO. Return rental. Evening flight home." },
];
const CR_DATA: TripData = {
  days: CR_DAYS,
  lodging: [
    { id: "tabacon",  name: "Tabacón Thermal Resort",   nights: 3, region: "La Fortuna / Arenal",    type: "Resort",     conf: "TBC-22841-CR", price: 1380, status: "Confirmed" },
    { id: "belmar",   name: "Hotel Belmar",             nights: 2, region: "Monteverde Cloud Forest", type: "Boutique",  conf: "BLM-7733-CR",  price: 720,  status: "Confirmed" },
    { id: "arenas",   name: "Arenas del Mar Beachfront", nights: 3, region: "Manuel Antonio",         type: "Beachfront", conf: "ARN-99021-CR", price: 1620, status: "Confirmed" },
  ],
  flights: [
    { id: "out",  leg: "Outbound", route: "IAH → SJO", carrier: "United 1018", dep: "Feb 14 · 07:15", arr: "Feb 14 · 11:48", seats: "9A / 9B",   status: "Ticketed" },
    { id: "back", leg: "Return",   route: "SJO → IAH", carrier: "United 1421", dep: "Feb 22 · 18:55", arr: "Feb 22 · 23:30", seats: "10C / 10D", status: "Ticketed" },
  ],
  activities: [
    { id: "skytram",   title: "Sky Tram + Zipline",        day: 2, status: "Booked",  cost: 175, vendor: "Sky Adventures Arenal" },
    { id: "rio",       title: "Río Celeste Guided Hike",   day: 3, status: "Booked",  cost: 130, vendor: "Tenorio Tours" },
    { id: "bridges",   title: "Selvatura Hanging Bridges", day: 5, status: "Booked",  cost: 90,  vendor: "Selvatura Park" },
    { id: "coffee",    title: "Coffee + Chocolate Tour",   day: 5, status: "Booked",  cost: 70,  vendor: "Don Juan Tours" },
    { id: "mapark",    title: "Manuel Antonio NP Guide",   day: 7, status: "Booked",  cost: 110, vendor: "Iguana Tours" },
    { id: "cat",       title: "Sunset Catamaran",          day: 8, status: "Booked",  cost: 220, vendor: "Planet Dolphin" },
  ],
  budget: [
    { cat: "Flights",    planned: 920,  actual: 912,  color: C.blue },
    { cat: "Lodging",    planned: 3720, actual: 3720, color: C.green },
    { cat: "Rental 4×4", planned: 540,  actual: 510,  color: C.amber },
    { cat: "Activities", planned: 795,  actual: 795,  color: C.teal },
    { cat: "Food",       planned: 850,  actual: 770,  color: C.violet },
    { cat: "Misc",       planned: 300,  actual: 240,  color: C.red },
  ],
  packing: [
    { cat: "Documents",  items: ["Passport (6mo validity)", "Travel insurance card", "Hotel + rental confirmations", "Yellow fever proof (if applicable)"] },
    { cat: "Tech",       items: ["Phone + charger", "Power bank", "Type-A/B plug adapter (CR is Type A/B)", "GoPro + dive housing", "Dry bag for electronics"] },
    { cat: "Apparel",    items: ["Quick-dry shirts ×6", "Hiking pants ×2", "Swimsuit ×2", "Trail runners", "Sandals", "Light rain shell", "Long sleeves (mosquitoes)"] },
    { cat: "Health",     items: ["DEET 30%+ insect repellent", "Reef-safe sunscreen SPF 50", "Anti-diarrheal", "Electrolytes", "Motion sickness pills (catamaran)"] },
  ],
  checklist: [
    { label: "Passport Validity", note: "Confirm 6+ months from Feb 22 return date" },
    { label: "Travel Insurance",  note: "Medical + evacuation coverage (~$80/pp)" },
    { label: "Notify Card Issuers", note: "Travel alert: Costa Rica Feb 14–22" },
    { label: "Colones Cash",      note: "Get ~$200 USD in colones at SJO ATM on arrival" },
    { label: "Driver's License",  note: "Bring physical license for rental pickup" },
    { label: "Download Maps",     note: "Offline Google Maps for Arenal + Monteverde" },
    { label: "Reef-Safe Sunscreen", note: "Required at Manuel Antonio NP" },
    { label: "Confirm Catamaran", note: "Planet Dolphin pickup at Quepos marina 14:00" },
  ],
  reminders: [
    { label: "Rainy Season Tail", color: C.amber, text: "Mid-Feb is dry season but afternoon showers possible in Monteverde — pack rain shell on top." },
    { label: "4×4 Required",      color: C.teal,  text: "Monteverde access roads are gravel/mountain. Decline downsell to compact at counter." },
    { label: "NP Entry Cash",     color: C.green, text: "Manuel Antonio caps daily visitors. Buy tickets online 48h ahead or arrive at 07:00." },
    { label: "Wildlife Distance", color: C.violet, text: "Do not feed monkeys. Fines up to $500. Keep food sealed at Arenas del Mar." },
  ],
};

// ── GALENA, IL DATA ──
const GA_DAYS: DayItem[] = [
  { day: 1, date: "Oct 10", phase: "arrival",   region: "Dubuque (DBQ) → Galena",  title: "Arrive + Main Street",     lodging: "Goldmoor Inn",  notes: "Land DBQ. Pick up rental. ~30 min drive to Galena. Check in at Goldmoor. Dinner on Main Street at Fried Green Tomatoes." },
  { day: 2, date: "Oct 11", phase: "city",      region: "Galena, IL",             title: "Galena Historic District",  lodging: "Goldmoor Inn",  notes: "Ulysses S. Grant Home tour AM. Main Street shops. Galena Cellars tasting. Sunset at Chestnut Mountain overlook." },
  { day: 3, date: "Oct 12", phase: "transit",   region: "Dubuque, IA (day trip)", title: "Dubuque Day Trip",          lodging: "Goldmoor Inn",  notes: "Drive across Mississippi to Dubuque. National Mississippi River Museum AM. Fenelon Place Elevator. Lunch on the riverfront. Optional Field of Dreams in Dyersville. Back to Galena for dinner." },
  { day: 4, date: "Oct 13", phase: "departure", region: "Galena → DBQ",           title: "Departure",                 lodging: "—",             notes: "Breakfast at the Goldmoor. Drive back to DBQ. Return rental. Mid-day flight home." },
];
const GA_DATA: TripData = {
  days: GA_DAYS,
  lodging: [
    { id: "goldmoor", name: "Goldmoor Inn",  nights: 3, region: "Galena, IL", type: "Country Inn", conf: "GMI-4421-IL", price: 690, status: "Confirmed" },
  ],
  flights: [
    { id: "out",  leg: "Outbound", route: "IAH → DBQ", carrier: "American 4118", dep: "Oct 10 · 09:40", arr: "Oct 10 · 13:20", seats: "6A / 6B", status: "Ticketed" },
    { id: "back", leg: "Return",   route: "DBQ → IAH", carrier: "American 4119", dep: "Oct 13 · 14:05", arr: "Oct 13 · 18:00", seats: "5C / 5D", status: "Ticketed" },
  ],
  activities: [
    { id: "grant",    title: "Ulysses S. Grant Home Tour",        day: 2, status: "Booked", cost: 10,  vendor: "IL Historic Sites" },
    { id: "cellars",  title: "Galena Cellars Wine Tasting",       day: 2, status: "Booked", cost: 40,  vendor: "Galena Cellars" },
    { id: "chestnut", title: "Chestnut Mountain Overlook",        day: 2, status: "Open",   cost: 0,   vendor: "Self-guided" },
    { id: "rivmus",   title: "Nat'l Mississippi River Museum",    day: 3, status: "Booked", cost: 45,  vendor: "River Museum" },
    { id: "fenelon",  title: "Fenelon Place Elevator",            day: 3, status: "Open",   cost: 8,   vendor: "Fenelon Elevator Co." },
    { id: "dreams",   title: "Field of Dreams (optional)",        day: 3, status: "Open",   cost: 0,   vendor: "Self-guided" },
  ],
  budget: [
    { cat: "Flights",    planned: 520, actual: 498, color: C.blue },
    { cat: "Lodging",    planned: 690, actual: 690, color: C.green },
    { cat: "Rental Car", planned: 180, actual: 165, color: C.amber },
    { cat: "Activities", planned: 110, actual: 103, color: C.teal },
    { cat: "Food",       planned: 380, actual: 340, color: C.violet },
    { cat: "Misc",       planned: 120, actual: 90,  color: C.red },
  ],
  packing: [
    { cat: "Documents",  items: ["Driver's license / REAL ID", "Hotel + rental confirmations", "Printed itinerary"] },
    { cat: "Tech",       items: ["Phone + charger", "Power bank", "Camera for fall foliage"] },
    { cat: "Apparel",    items: ["Flannel + sweaters", "Light jacket (50s°F)", "Comfortable walking shoes", "Scarf + beanie (early AM)", "Rain shell"] },
    { cat: "Health",     items: ["Allergy meds (corn harvest dust)", "Hand warmers", "Lip balm"] },
  ],
  checklist: [
    { label: "Confirm Goldmoor",    note: "Country inn — confirm early check-in" },
    { label: "Grant Home Tickets",  note: "Time-slot ticketed; book 09:30 slot" },
    { label: "River Museum",        note: "Book combo ticket online for $5 off" },
    { label: "Fall Foliage Check",  note: "Peak color in NW IL is typically Oct 10–18" },
    { label: "Mississippi Bridge",  note: "Julien Dubuque Bridge — check construction status" },
    { label: "Cash for Elevator",   note: "Fenelon Place is cash-only, $8 RT" },
  ],
  reminders: [
    { label: "Peak Foliage Window", color: C.amber, text: "Visiting at peak fall color — book dinner reservations 1 week ahead, Main Street fills up." },
    { label: "Two-State Day Trip",  color: C.teal,  text: "Day 3 crosses IL → IA. Confirm rental agreement allows multi-state travel." },
    { label: "Mississippi Weather", color: C.green, text: "River-valley fog common AM. Add 20m buffer for Dubuque morning drive." },
    { label: "Goldmoor Dining",     color: C.violet, text: "Inn restaurant requires reservation by 16:00 — book at check-in." },
  ],
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
    highlights: ["Capitol Park & McKinley rose gardens", "Old Sacramento + CA State Railroad Museum", "Dinner at The Firehouse (1850s)", "Lake Tahoe day trip — Emerald Bay + Vikingsholm Castle", "M.S. Dixie II paddlewheel cruise", "Parasailing or Treetop ziplines", "Old Sugar Mill wine tasting"],
    lodging: "Kimpton Sawyer Hotel ×5 nights",
    budget: 3880,
    notes: "Full command center active — see tabs below.",
    data: CA_DATA,
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
    data: CR_DATA,
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
    data: GA_DATA,
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

type Day = DayItem;

// ─── TABS ─────────────────────────────────────────────────────────────────────
const ALL_TABS = ["Overview", "Plans", "Itinerary", "Tahoe Day", "Lodging", "Activities", "Budget", "Packing"] as const;
type Tab = typeof ALL_TABS[number];

type CompletenessCheck = {
  tripId: TripId;
  tripLabel: string;
  missing: string[];
  score: number; // 0-100
};

function checkTripCompleteness(trip: TripSummary): CompletenessCheck {
  const d = trip.data;
  const missing: string[] = [];
  if (!d.days || d.days.length === 0) missing.push("Days");
  if (!d.lodging || d.lodging.length === 0) missing.push("Lodging");
  if (!d.flights || d.flights.length === 0) missing.push("Flights");
  if (!d.activities || d.activities.length === 0) missing.push("Activities");
  if (!d.budget || d.budget.length === 0) missing.push("Budget");
  if (!d.packing || d.packing.length === 0) missing.push("Packing");
  if (!d.checklist || d.checklist.length === 0) missing.push("Checklist");
  if (!d.reminders || d.reminders.length === 0) missing.push("Reminders");
  const total = 8;
  const score = Math.round(((total - missing.length) / total) * 100);
  return { tripId: trip.id, tripLabel: trip.label, missing, score };
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Vacation() {
  const [tripId, setTripId] = useState<TripId>("california");
  const activeTrip = TRIPS.find(t => t.id === tripId)!;
  const data = activeTrip.data;
  const TABS = useMemo<readonly Tab[]>(() => (
    tripId === "california"
      ? ALL_TABS
      : ALL_TABS.filter(t => t !== "Tahoe Day") as Tab[]
  ), [tripId]);
  const [tab, setTab] = useState<Tab>("Overview");
  const [selectedDay, setSelectedDay] = useState<Day | null>(data.days[0]);

  const totals = useMemo(() => {
    const planned = data.budget.reduce((s, b) => s + b.planned, 0);
    const actual = data.budget.reduce((s, b) => s + b.actual, 0);
    return { planned, actual, delta: planned - actual };
  }, [data]);

  // Completeness checks for ALL trips
  const completeness = useMemo(() => TRIPS.map(checkTripCompleteness), []);
  const incompleteTrips = completeness.filter(c => c.missing.length > 0);
  const activeCompleteness = completeness.find(c => c.tripId === tripId)!;

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
        {tab === "Overview" && <OverviewTab trip={activeTrip} data={data} selectedDay={selectedDay} onSelectDay={setSelectedDay} totals={totals} />}
        {tab === "Plans" && <PlansTab trip={activeTrip} data={data} totals={totals} />}
        {tab === "Itinerary" && <ItineraryTab trip={activeTrip} data={data} selectedDay={selectedDay} onSelectDay={setSelectedDay} />}
        {tripId === "california" && tab === "Tahoe Day" && <TahoeDayTab />}
        {tab === "Lodging" && <LodgingTab data={data} />}
        {tab === "Activities" && <ActivitiesTab data={data} />}
        {tab === "Budget" && <BudgetTab data={data} totals={totals} />}
        {tab === "Packing" && <PackingTab trip={activeTrip} data={data} />}
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
function PlansTab({ trip, data, totals }: { trip: TripSummary; data: TripData; totals: { planned: number; actual: number; delta: number } }) {
  const baseLodging = data.lodging[0];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
      {/* Executive Summary */}
      <Box>
        <SecHead eyebrow="Executive Summary" title={trip.destination.toUpperCase()} meta={trip.region} color={trip.color} />
        <KV label="Dates" value={trip.dates} />
        <KV label="Travelers" value={`${trip.travelers} adults`} />
        <KV label="Nights" value={`${trip.nights}`} />
        <KV label="Status" value={<Pill label={trip.status} color={STATUS_COLOR[trip.status] || trip.color} />} />
        <Hr />
        <KV label="Base Lodging" value={baseLodging?.name || "—"} />
        <KV label="Confirmation" value={<span style={{ fontFamily: "monospace" }}>{baseLodging?.conf || "—"}</span>} />
        <KV label="Total Budget" value={`$${totals.planned.toLocaleString()} planned · $${totals.actual.toLocaleString()} actual`} />
      </Box>

      {/* Key Bookings */}
      <Box>
        <SecHead eyebrow="Transport" title="FLIGHTS & CONFIRMATIONS" color={C.amber} />
        {data.flights.map(f => (
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
          <span style={{ fontSize: 10, color: C.text, fontWeight: 900 }}>{baseLodging?.conf || "—"}</span>
        </div>
        <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{baseLodging ? `${baseLodging.name} · ${baseLodging.nights} nights` : "—"}</div>
      </Box>

      {/* Pre-Trip Checklist */}
      <Box>
        <SecHead eyebrow="Before Departure" title="PRE-TRIP CHECKLIST" color={C.violet} />
        {data.checklist.map((item, i) => (
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
        <SecHead eyebrow="Master Schedule" title={`${data.days.length}-DAY PLAN AT A GLANCE`} color={C.teal} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
          {data.days.map(d => {
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
          {data.reminders.map((r, i) => (
            <div key={i} style={{ border: `1px solid ${C.border}`, padding: 10, background: C.surfaceAlt }}>
              <div style={{ fontSize: 9, fontWeight: 900, color: r.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{r.label}</div>
              <div style={{ fontSize: 10, color: C.text, lineHeight: 1.5 }}>{r.text}</div>
            </div>
          ))}
        </div>
      </Box>
    </div>
  );
}

function OverviewTab({ trip, data, selectedDay, onSelectDay, totals }: { trip: TripSummary; data: TripData; selectedDay: Day | null; onSelectDay: (d: Day) => void; totals: { planned: number; actual: number; delta: number } }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
      <Box>
        <SecHead eyebrow="Mission Brief" title={trip.destination.toUpperCase()} meta={trip.region} color={trip.color} />
        <KV label="Dates" value={trip.dates} />
        <KV label="Travelers" value={`${trip.travelers} adults`} />
        <KV label="Nights" value={`${trip.nights}`} />
        <KV label="Status" value={<Pill label={trip.status} color={STATUS_COLOR[trip.status] || trip.color} />} />
        <Hr />
        <KV label="Lodging" value={`${data.lodging.length} ${data.lodging.length === 1 ? "property" : "properties"}`} />
        <KV label="Activities" value={`${data.activities.length} planned`} />
        <KV label="Budget" value={`$${totals.planned.toLocaleString()} planned`} />
      </Box>

      <Box>
        <SecHead eyebrow="Flights" title="AIR TRANSPORT" color={C.amber} />
        {data.flights.map(f => (
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
          <SecHead eyebrow="Day Stream" title={`${data.days.length}-DAY ITINERARY`} color={C.teal} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
          {data.days.map(d => {
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

function ItineraryTab({ trip, data, selectedDay, onSelectDay }: { trip: TripSummary; data: TripData; selectedDay: Day | null; onSelectDay: (d: Day) => void }) {
  return (
    <Box>
      <SecHead eyebrow="Schedule" title="DAY-BY-DAY" meta={`${data.days.length} days · ${trip.nights} nights`} color={trip.color} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.days.map(d => {
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

function LodgingTab({ data }: { data: TripData }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
      {data.lodging.map(l => (
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

function ActivitiesTab({ data }: { data: TripData }) {
  return (
    <Box>
      <SecHead eyebrow="Bookings" title="ACTIVITY ROSTER" meta={`${data.activities.length} entries`} color={C.teal} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
        {data.activities.map(a => (
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

function BudgetTab({ data, totals }: { data: TripData; totals: { planned: number; actual: number; delta: number } }) {
  const max = Math.max(...data.budget.map(b => b.planned));
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
        {data.budget.map(b => {
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

function PackingTab({ trip, data }: { trip: TripSummary; data: TripData }) {
  const isCA = trip.id === "california";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <div style={{ marginBottom: 10 }}>
          <Eyebrow color={C.violet}>{trip.flag} {trip.label} · Full Trip</Eyebrow>
          <div style={{ fontSize: 12, fontWeight: 900, color: C.text, letterSpacing: "0.08em", textTransform: "uppercase" }}>{trip.destination} Packing</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {data.packing.map(p => (
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

      {isCA && <div>
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
      </div>}
    </div>
  );
}