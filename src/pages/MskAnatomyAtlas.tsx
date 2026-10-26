import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { LAYERS, REGIONS, ROADMAP, type Layer } from "@/data/mskAtlas";

const BASE = "https://jeffongeri.com/msk-anatomy-atlas";

// Illustration palette (anatomical content colours, not UI chrome)
const FILL: Record<Layer, string> = { bone: "url(#g-bone)", muscle: "url(#g-muscle)", ligament: "url(#g-lig)" };
const LINE: Record<Layer, string> = { bone: "#b8a98a", muscle: "#8f2f2f", ligament: "#d9c48a" };

const MskAnatomyAtlas = () => {
  const [regionId, setRegionId] = useState(REGIONS[0].id);
  const region = REGIONS.find((r) => r.id === regionId)!;
  const [layers, setLayers] = useState<Record<Layer, boolean>>({ bone: true, muscle: true, ligament: true });
  const [selected, setSelected] = useState(region.structures[0].id);
  const [hover, setHover] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  useEffect(() => setSelected(region.structures[0].id), [regionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = region.structures.filter((s) => layers[s.layer]);
  const current = region.structures.find((s) => s.id === selected) ?? region.structures[0];

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced.current || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -10, y: ((e.clientX - r.left) / r.width - 0.5) * 14 });
  };
  const keySelect = (id: string) => (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(id); }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>MSK Anatomy Atlas — Shoulder, Knee & Lumbar Spine | Jefney Ongeri, PA-C</title>
        <meta name="description" content="Interactive musculoskeletal anatomy atlas: layered shoulder, knee and lumbar spine illustrations with bone, muscle and ligament toggles and clinical correlations." />
        <meta property="og:title" content="MSK Anatomy Atlas | Jefney Ongeri, PA-C" />
        <meta property="og:description" content="Interactive layered anatomy of the shoulder, knee and lumbar spine with clinical relationships." />
        <meta property="og:url" content={BASE} />
        <link rel="canonical" href={BASE} />
      </Helmet>
      <Header />
      <main id="main-content" className="container-blog py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Anatomy Atlas · Unit 01: Musculoskeletal</p>
        <h1 className="mt-2 font-journal text-4xl leading-tight text-foreground md:text-5xl">MSK Anatomy Atlas</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Explore layered drawings of the shoulder, knee and lumbar spine. Toggle tissue layers, then hover, tap or tab to a structure to read its anatomy and clinical relationships.</p>

        <div role="tablist" aria-label="Region" className="mt-8 flex flex-wrap gap-2">
          {REGIONS.map((r) => (
            <button key={r.id} role="tab" aria-selected={r.id === regionId} onClick={() => setRegionId(r.id)}
              className={cn("rounded-md border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                r.id === regionId ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-secondary")}>
              {r.name}
            </button>
          ))}
        </div>

        <fieldset className="mt-4 flex flex-wrap gap-4">
          <legend className="sr-only">Visible layers</legend>
          {LAYERS.map((l) => (
            <label key={l.id} className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm text-foreground">
              <input type="checkbox" className="h-4 w-4 accent-primary" checked={layers[l.id]}
                onChange={(e) => setLayers((p) => ({ ...p, [l.id]: e.target.checked }))} />
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: LINE[l.id] }} aria-hidden />
              {l.label}
            </label>
          ))}
        </fieldset>

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="rounded-xl border border-border bg-card p-3 shadow-sm" style={{ perspective: 900 }}
            onPointerMove={onMove} onPointerLeave={() => setTilt({ x: 0, y: 0 })}>
            <p className="px-2 pt-1 text-xs text-muted-foreground">{region.view}</p>
            <div style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: "transform 150ms ease-out", transformStyle: "preserve-3d" }}>
              <svg viewBox="0 0 400 400" className="h-auto w-full" role="group" aria-label={`${region.name} illustration`}>
                <defs>
                  <radialGradient id="g-bone" cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#fbf6ea" /><stop offset="1" stopColor="#d6c7a6" /></radialGradient>
                  <linearGradient id="g-muscle" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d1625a" /><stop offset="1" stopColor="#8f2f2f" /></linearGradient>
                  <linearGradient id="g-lig" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6edd0" /><stop offset="1" stopColor="#c9b073" /></linearGradient>
                  <filter id="depth"><feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.25" /></filter>
                </defs>
                <g filter="url(#depth)">
                  {visible.map((s) => {
                    const active = s.id === selected || s.id === hover;
                    const outline = s.id === "lumbosacral";
                    return (
                      <path key={s.id} d={s.d} tabIndex={0} role="button" aria-label={s.name} aria-pressed={s.id === selected}
                        onClick={() => setSelected(s.id)} onKeyDown={keySelect(s.id)}
                        onPointerEnter={() => setHover(s.id)} onPointerLeave={() => setHover(null)}
                        onFocus={() => setHover(s.id)} onBlur={() => setHover(null)}
                        fill={s.stroke || outline ? "none" : FILL[s.layer]}
                        fillOpacity={s.layer === "muscle" ? 0.82 : 1}
                        stroke={active ? "hsl(var(--primary))" : outline ? "#6b7280" : LINE[s.layer]}
                        strokeWidth={s.stroke ? (active ? 9 : 6) : active ? 3 : 1.2}
                        strokeDasharray={outline ? "5 4" : undefined}
                        strokeLinecap="round"
                        className="cursor-pointer outline-none transition-[stroke-width] pointer-events-auto"
                        style={{ pointerEvents: outline ? "stroke" : s.stroke ? "stroke" : "auto" }} />
                    );
                  })}
                </g>
                {visible.filter((s) => s.id === selected || s.id === hover).map((s) => {
                  const w = s.name.length * 6 + 16;
                  const x = Math.min(Math.max(s.label[0] - w / 2, 2), 398 - w);
                  return (
                    <g key={`l-${s.id}`} pointerEvents="none">
                      <rect x={x} y={s.label[1] - 12} width={w} height="20" rx="4" fill="hsl(var(--foreground))" opacity="0.85" />
                      <text x={x + w / 2} y={s.label[1] + 2} textAnchor="middle" style={{ fontSize: 11 }} fill="hsl(var(--background))">{s.name}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <aside aria-live="polite" className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{LAYERS.find((l) => l.id === current.layer)?.label}</p>
            <h2 className="mt-1 font-journal text-2xl text-foreground">{current.name}</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div><dt className="font-semibold text-foreground">Anatomy</dt><dd className="mt-1 text-muted-foreground">{current.term}</dd></div>
              <div><dt className="font-semibold text-foreground">Function</dt><dd className="mt-1 text-muted-foreground">{current.detail}</dd></div>
              <div><dt className="font-semibold text-foreground">Clinical relationship</dt><dd className="mt-1 text-muted-foreground">{current.clinical}</dd></div>
            </dl>
            <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Structures</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {region.structures.map((s) => (
                <li key={s.id}>
                  <button onClick={() => { setSelected(s.id); setLayers((p) => ({ ...p, [s.layer]: true })); }}
                    aria-pressed={s.id === selected}
                    className={cn("rounded-md border px-2.5 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      s.id === selected ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:bg-secondary")}>
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <p className="mt-6 rounded-md border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Educational use only.</strong> These simplified drawings are for orientation and anatomy review, not radiographic interpretation, diagnosis, or procedural planning. The 3D effect is stylised, not real imaging.
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
