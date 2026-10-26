import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FIELD_LABELS, LAYERS, LAYER_OF, REGIONS, ROADMAP, type Layer, type Region, type Shape, type Tissue } from "@/data/msk";

const BASE = "https://jeffongeri.com/msk-anatomy-atlas";

// Illustration palette (anatomical content colours, not UI chrome)
const STYLE: Record<Tissue, { fill: string; line: string; op?: number; key: string }> = {
  bone: { fill: "url(#g-bone)", line: "#a8987a", key: "Bone" },
  cartilage: { fill: "#c7e3ee", line: "#7fb1c6", key: "Hyaline cartilage" },
  fibrocartilage: { fill: "#e9dcbc", line: "#9f8858", key: "Fibrocartilage (labrum, menisci, disc, joints)" },
  space: { fill: "#475569", line: "#475569", op: 0.22, key: "Canal / foramen / space" },
  muscleSuperficial: { fill: "url(#g-msup)", line: "#7d2626", op: 0.8, key: "Superficial muscle" },
  muscleDeep: { fill: "url(#g-mdeep)", line: "#9c4a36", op: 0.85, key: "Deep muscle" },
  ligament: { fill: "#efe2b8", line: "#b39445", key: "Ligament" },
  tendon: { fill: "#f4eedb", line: "#b9a26a", key: "Tendon" },
  capsule: { fill: "none", line: "#8c7a52", key: "Joint capsule" },
  bursa: { fill: "#a9d4ea", line: "#5f9fbf", op: 0.6, key: "Bursa" },
  fascia: { fill: "#cfc5e3", line: "#8a7fb0", op: 0.35, key: "Fascia / band" },
  nerve: { fill: "#e5b823", line: "#d4a514", key: "Nerve" },
  artery: { fill: "#c62828", line: "#c62828", key: "Artery" },
  vein: { fill: "#3d5a9e", line: "#3d5a9e", key: "Vein" },
};
const ORDER: Layer[] = ["skeleton", "deep", "connective", "superficial", "neurovascular"];
const LEFT_X = 40, RIGHT_X = 460;

type Placed = { shape: Shape; name: string; side: "l" | "r"; y: number };

function layoutLabels(items: { shape: Shape; name: string }[]): Placed[] {
  const out: Placed[] = [];
  (["l", "r"] as const).forEach((side) => {
    const col = items.filter((i) => (i.shape.at[0] < 250) === (side === "l")).sort((a, b) => a.shape.at[1] - b.shape.at[1]);
    let prev = -Infinity;
    const ys = col.map((i) => (prev = Math.max(i.shape.at[1], prev + 12, 10)));
    const overflow = (ys[ys.length - 1] ?? 0) - 462;
    if (overflow > 0) for (let k = ys.length - 1, lim = 462; k >= 0; k--, lim -= 12) ys[k] = Math.min(ys[k], lim);
    col.forEach((i, k) => out.push({ ...i, side, y: ys[k] }));
  });
  return out;
}

const MskAnatomyAtlas = () => {
  const [regionId, setRegionId] = useState(REGIONS[0].id);
  const region: Region = REGIONS.find((r) => r.id === regionId)!;
  const [viewId, setViewId] = useState(region.views[0].id);
  const view = region.views.find((v) => v.id === viewId) ?? region.views[0];
  const [layers, setLayers] = useState<Record<Layer, boolean>>({ skeleton: true, deep: true, connective: true, superficial: true, neurovascular: true });
  const [selected, setSelected] = useState(view.shapes[0].s);
  const [hover, setHover] = useState<string | null>(null);
  const [labels, setLabels] = useState(true);
  const [indexFilter, setIndexFilter] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => { setLabels(window.matchMedia("(min-width: 768px)").matches); }, []);

  const info = (id: string) => region.structures.find((s) => s.id === id);
  const current = info(selected) ?? region.structures[0];

  const choose = (rid: string, id: string) => {
    const r = REGIONS.find((x) => x.id === rid)!;
    const st = r.structures.find((s) => s.id === id)!;
    setRegionId(rid);
    const inCurrent = rid === regionId && view.shapes.some((sh) => sh.s === id);
    if (!inCurrent) setViewId((r.views.find((v) => v.shapes.some((sh) => sh.s === id)) ?? r.views[0]).id);
    setLayers((p) => ({ ...p, [LAYER_OF[st.tissue]]: true }));
    setSelected(id);
  };
  const changeRegion = (rid: string) => {
    const r = REGIONS.find((x) => x.id === rid)!;
    setRegionId(rid); setViewId(r.views[0].id); setSelected(r.views[0].shapes[0].s); setIndexFilter("");
  };

  const visible = view.shapes
    .filter((sh) => { const st = info(sh.s); return st && layers[LAYER_OF[st.tissue]]; })
    .sort((a, b) => ORDER.indexOf(LAYER_OF[info(a.s)!.tissue]) - ORDER.indexOf(LAYER_OF[info(b.s)!.tissue]));

  const placed = useMemo(() => {
    const seen = new Set<string>();
    const items = visible.filter((sh) => (labels || sh.s === selected || sh.s === hover) && !seen.has(sh.s) && seen.add(sh.s))
      .map((sh) => ({ shape: sh, name: info(sh.s)!.name }));
    return layoutLabels(items);
  }, [visible, labels, selected, hover]); // eslint-disable-line react-hooks/exhaustive-deps

  const keySelect = (id: string) => (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(id); }
  };

  const viewIds = new Set(view.shapes.map((s) => s.s));
  const tissuesInView = Array.from(new Set(visible.map((s) => info(s.s)!.tissue)));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return REGIONS.flatMap((r) => r.structures.filter((s) => Object.values(s).join(" ").toLowerCase().includes(q)).map((s) => ({ r, s })))
      .sort((a, b) => Number(!a.s.name.toLowerCase().includes(q)) - Number(!b.s.name.toLowerCase().includes(q)))
      .slice(0, 40);
  }, [query]);

  const indexList = region.structures.filter((s) => s.name.toLowerCase().includes(indexFilter.trim().toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>MSK Anatomy Atlas — Shoulder, Knee & Lumbar Spine | Jefney Ongeri, PA-C</title>
        <meta name="description" content="Detailed musculoskeletal anatomy atlas: multi-view shoulder, knee and lumbar spine drawings with tissue layers, origins, insertions, innervation, exam landmarks and clinical correlations." />
        <meta property="og:title" content="MSK Anatomy Atlas | Jefney Ongeri, PA-C" />
        <meta property="og:description" content="Study-quality layered anatomy of the shoulder, knee and lumbar spine with exam landmarks and clinical relationships." />
        <meta property="og:url" content={BASE} />
        <link rel="canonical" href={BASE} />
      </Helmet>
      <Header />
      <main id="main-content" className="container-blog py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Anatomy Atlas · Unit 01: Musculoskeletal</p>
        <h1 className="mt-2 font-journal text-4xl leading-tight text-foreground md:text-5xl">MSK Anatomy Atlas</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Multi-view drawings of the shoulder, knee and lumbar spine. Choose a region and view, peel back tissue layers, then click, tap or tab to any structure for its attachments, innervation, action and clinical relevance.</p>

        {/* Global search */}
        <div className="relative mt-6 max-w-xl">
          <label htmlFor="atlas-search" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Search all structures</label>
          <input id="atlas-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. axillary nerve, L5, pes anserinus, Lachman"
            className="mt-1 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          {query.trim().length >= 2 && (
            <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-lg" aria-label="Search results">
              {results.length === 0 && <li className="px-3 py-2 text-sm text-muted-foreground">No matches</li>}
              {results.map(({ r, s }) => (
                <li key={r.id + s.id}>
                  <button onClick={() => { choose(r.id, s.id); setQuery(""); }}
                    className="flex w-full items-center justify-between gap-3 rounded px-3 py-2 text-left text-sm text-foreground hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none">
                    <span>{s.name}</span><span className="shrink-0 text-xs text-muted-foreground">{r.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Region + view controls */}
        <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Region</p>
            <div role="tablist" aria-label="Region" className="flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <button key={r.id} role="tab" aria-selected={r.id === regionId} onClick={() => changeRegion(r.id)}
                  className={cn("min-h-[40px] rounded-md border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    r.id === regionId ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-secondary")}>
                  {r.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">View</p>
            <div role="tablist" aria-label={`${region.name} view`} className="flex flex-wrap gap-1 rounded-md border border-border bg-card p-1">
              {region.views.map((v) => (
                <button key={v.id} role="tab" aria-selected={v.id === view.id} onClick={() => setViewId(v.id)}
                  className={cn("min-h-[36px] rounded px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    v.id === view.id ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground hover:text-foreground")}>
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <fieldset className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
          <legend className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Layers</legend>
          {LAYERS.map((l) => (
            <label key={l.id} className="flex min-h-[40px] cursor-pointer items-center gap-2 text-sm text-foreground">
              <input type="checkbox" className="h-4 w-4 accent-primary" checked={layers[l.id]}
                onChange={(e) => setLayers((p) => ({ ...p, [l.id]: e.target.checked }))} />
              {l.label}
            </label>
          ))}
          <label className="flex min-h-[40px] cursor-pointer items-center gap-2 border-l border-border pl-5 text-sm text-foreground">
            <input type="checkbox" className="h-4 w-4 accent-primary" checked={labels} onChange={(e) => setLabels(e.target.checked)} />
            Show all labels
          </label>
        </fieldset>

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-1">
              <p className="text-sm font-semibold text-foreground">{view.caption}</p>
              <Sheet>
                <SheetTrigger asChild>
                  <button className="rounded-md border border-primary px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    Clinical landmarks & exam
                  </button>
                </SheetTrigger>
                <SheetContent className="w-full overflow-y-auto sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle className="font-journal">{region.name} — {view.name}</SheetTitle>
                    <SheetDescription>{view.caption}</SheetDescription>
                  </SheetHeader>
                  {([["Palpation landmarks", view.exam.palpation], ["Movements & actions", view.exam.movement], ["Neurovascular danger zones", view.exam.danger], ["Test associations", view.exam.tests]] as const).map(([h, items]) => (
                    <section key={h} className="mt-5">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{h}</h3>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-foreground">{items.map((t) => <li key={t}>{t}</li>)}</ul>
                    </section>
                  ))}
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex justify-between px-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>← {view.orientation[0]}</span><span>{view.orientation[1]} →</span>
            </div>
            <svg viewBox="-180 0 860 470" className="h-auto w-full" role="group" aria-label={`${region.name}, ${view.caption}`}>
              <defs>
                <radialGradient id="g-bone" cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#fbf6ea" /><stop offset="1" stopColor="#d6c7a6" /></radialGradient>
                <linearGradient id="g-msup" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c9534b" /><stop offset="1" stopColor="#8f2f2f" /></linearGradient>
                <linearGradient id="g-mdeep" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e9a083" /><stop offset="1" stopColor="#bb5c43" /></linearGradient>
                <filter id="depth"><feDropShadow dx="1.5" dy="2.5" stdDeviation="2" floodOpacity="0.2" /></filter>
              </defs>
              <g filter="url(#depth)">
                {visible.map((sh, i) => {
                  const st = info(sh.s)!;
                  const sty = STYLE[st.tissue];
                  const active = sh.s === selected || sh.s === hover;
                  const cord = sh.w !== undefined || st.tissue === "capsule";
                  return (
                    <path key={sh.s + i} d={sh.d} tabIndex={0} role="button" aria-label={st.name} aria-pressed={sh.s === selected}
                      onClick={() => setSelected(sh.s)} onKeyDown={keySelect(sh.s)}
                      onPointerEnter={() => setHover(sh.s)} onPointerLeave={() => setHover(null)}
                      onFocus={() => setHover(sh.s)} onBlur={() => setHover(null)}
                      fill={cord ? "none" : sty.fill} fillOpacity={sty.op ?? 1}
                      stroke={active ? "hsl(var(--primary))" : sty.line}
                      strokeOpacity={cord ? 1 : 0.9}
                      strokeWidth={cord ? (sh.w ?? 3) + (active ? 2.5 : 0) : active ? 2.6 : 1}
                      strokeDasharray={sh.dash ? "6 4" : undefined}
                      strokeLinecap="round" strokeLinejoin="round"
                      className="cursor-pointer outline-none"
                      style={{ pointerEvents: cord ? "stroke" : "auto" }} />
                  );
                })}
              </g>
              <g pointerEvents="none">
                {placed.map(({ shape, name, side, y }) => {
                  const on = shape.s === selected || shape.s === hover;
                  const x = side === "l" ? LEFT_X : RIGHT_X;
                  return (
                    <g key={"l" + shape.s} opacity={labels && !on ? 0.85 : 1}>
                      <polyline points={`${shape.at[0]},${shape.at[1]} ${x + (side === "l" ? 8 : -8)},${y} ${x + (side === "l" ? 3 : -3)},${y}`}
                        fill="none" stroke={on ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} strokeWidth={on ? 1.2 : 0.6} />
                      <circle cx={shape.at[0]} cy={shape.at[1]} r={on ? 2.6 : 1.8} fill={on ? "hsl(var(--primary))" : "hsl(var(--foreground))"} />
                      <text x={x} y={y + 3.5} textAnchor={side === "l" ? "end" : "start"}
                        style={{ fontSize: on ? 11 : 10, fontWeight: on ? 700 : 500 }}
                        fill={on ? "hsl(var(--primary))" : "hsl(var(--foreground))"}>{name}</text>
                    </g>
                  );
                })}
              </g>
            </svg>
            <div className="border-t border-border px-2 pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Key</p>
              <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                {tissuesInView.map((t) => (
                  <li key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span aria-hidden className="inline-block h-3 w-3 rounded-sm border" style={{ background: STYLE[t].fill.startsWith("url") ? STYLE[t].line : STYLE[t].fill === "none" ? "transparent" : STYLE[t].fill, borderColor: STYLE[t].line }} />
                    {STYLE[t].key}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <aside aria-live="polite" className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{STYLE[current.tissue].key} · {LAYERS.find((l) => l.id === LAYER_OF[current.tissue])?.label}</p>
              <h2 className="mt-1 font-journal text-2xl text-foreground">{current.name}</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {FIELD_LABELS.filter(([k]) => current[k]).map(([k, label]) => (
                  <div key={k}><dt className="font-semibold text-foreground">{label}</dt><dd className="mt-0.5 text-muted-foreground">{current[k]}</dd></div>
                ))}
              </dl>
              <p className="mt-4 text-xs text-muted-foreground">
                Shown in: {region.views.filter((v) => v.shapes.some((s) => s.s === current.id)).map((v) => v.name).join(", ") || "—"}
              </p>
            </aside>

            <section aria-labelledby="index-heading" className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h3 id="index-heading" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{region.name} index ({region.structures.length})</h3>
              </div>
              <input type="search" value={indexFilter} onChange={(e) => setIndexFilter(e.target.value)} aria-label={`Filter ${region.name} structures`}
                placeholder="Filter structures" className="mt-2 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              <div className="mt-2 max-h-80 overflow-y-auto pr-1">
                {LAYERS.map((l) => {
                  const items = indexList.filter((s) => LAYER_OF[s.tissue] === l.id);
                  if (!items.length) return null;
                  return (
                    <div key={l.id} className="mt-2">
                      <p className="text-[11px] font-semibold text-foreground">{l.label}</p>
                      <ul className="mt-1 space-y-0.5">
                        {items.map((s) => (
                          <li key={s.id}>
                            <button onClick={() => choose(region.id, s.id)} aria-pressed={s.id === selected}
                              className={cn("flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                s.id === selected ? "bg-primary/10 font-semibold text-foreground" : "text-muted-foreground hover:bg-secondary")}>
                              <span>{s.name}</span>
                              {!viewIds.has(s.id) && <span className="ml-2 shrink-0 text-[10px] uppercase tracking-wide">other view</span>}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        <p className="mt-6 rounded-md border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Educational use only.</strong> These simplified drawings are for orientation and anatomy review, not radiographic interpretation, diagnosis, or procedural planning. They are stylised schematic illustrations, not imaging or true 3D models.
        </p>

        <section className="mt-12" aria-labelledby="roadmap-heading">
          <h2 id="roadmap-heading" className="font-journal text-2xl text-foreground">Atlas roadmap</h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
            <li className="rounded-md border border-primary bg-primary/10 p-3 text-sm"><span className="block text-[11px] font-semibold text-primary">Unit 01 · Live</span>Musculoskeletal</li>
            {ROADMAP.map((u, i) => (
              <li key={u} className="rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground">
                <span className="block text-[11px] font-semibold">Unit {String(i + 2).padStart(2, "0")} · Coming</span>{u}
              </li>
            ))}
          </ol>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MskAnatomyAtlas;
