import { lazy, Suspense, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FIELD_LABELS, LAYERS, LAYER_OF, REGIONS, ROADMAP, type Region } from "@/data/msk";
import { baseName, matchMesh, sideOf } from "@/data/msk/meshMap";
import { SYSTEMS, type DimMode, type FocusRegion, type Preset, type Sys, type ViewerHandle } from "@/components/anatomy/AnatomyViewer";

const AnatomyViewer = lazy(() => import("@/components/anatomy/AnatomyViewer").then((m) => ({ default: m.AnatomyViewer })));

const BASE = "https://jeffongeri.com/msk-anatomy-atlas";
const TISSUE_LABEL: Record<string, string> = {
  bone: "Bone", cartilage: "Hyaline cartilage", fibrocartilage: "Fibrocartilage / joint", space: "Canal / space",
  muscleSuperficial: "Superficial muscle", muscleDeep: "Deep muscle", ligament: "Ligament", tendon: "Tendon",
  capsule: "Joint capsule", bursa: "Bursa", fascia: "Fascia", nerve: "Nerve", artery: "Artery", vein: "Vein",
};
const PRESETS: Preset[] = ["anterior", "posterior", "lateral", "superior"];
const ALL_ON: Record<Sys, boolean> = { bone: true, muscle: true, joint: true, nerve: true, vessel: true };
const REGION_DEFAULT_LAYERS: Record<string, Record<Sys, boolean>> = {
  shoulder: { bone: true, muscle: true, joint: true, nerve: true, vessel: true },
  knee: { bone: true, muscle: false, joint: true, nerve: true, vessel: true },
  lumbar: { bone: true, muscle: false, joint: true, nerve: true, vessel: false },
};

const MskAnatomyAtlas = () => {
  const viewer = useRef<ViewerHandle>(null);
  const [focus, setFocus] = useState<FocusRegion>("shoulder");
  const [studyId, setStudyId] = useState(REGIONS[0].id);
  const region: Region = REGIONS.find((r) => r.id === studyId)!;
  const [layers, setLayers] = useState<Record<Sys, boolean>>(REGION_DEFAULT_LAYERS.shoulder);
  const [opacity, setOpacity] = useState<Record<Sys, number>>({ bone: 1, muscle: 0.85, joint: 1, nerve: 1, vessel: 1 });
  const [dimMode, setDimMode] = useState<DimMode>("dim");
  const [explode, setExplode] = useState(0);
  const [isolateSel, setIsolateSel] = useState(false);
  const [selectedMesh, setSelectedMesh] = useState<string | null>(null);
  const [structure, setStructure] = useState<{ r: string; id: string } | null>(null);
  const [meshNames, setMeshNames] = useState<string[]>([]);
  const [indexFilter, setIndexFilter] = useState("");
  const [query, setQuery] = useState("");

  const studyRegion = REGIONS.find((r) => r.id === structure?.r) ?? region;
  const current = structure ? REGIONS.find((r) => r.id === structure.r)?.structures.find((s) => s.id === structure.id) : undefined;

  const meshesFor = (rid: string, id: string) => meshNames.filter((n) => { const m = matchMesh(n, rid); return m?.regionId === rid && m.id === id; })
    .sort((a, b) => Number(!a.endsWith(".r")) - Number(!b.endsWith(".r")));
  const linked = useMemo(() => (structure ? meshesFor(structure.r, structure.id) : []), [structure, meshNames]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeFocus = (f: FocusRegion) => {
    setFocus(f); setIsolateSel(false); setExplode(0);
    if (f !== "full") { setStudyId(f); setLayers(REGION_DEFAULT_LAYERS[f]); setIndexFilter(""); }
    else setLayers(ALL_ON);
  };
  const onSelectMesh = (n: string | null) => {
    setSelectedMesh(n);
    if (!n) { setIsolateSel(false); return; }
    const m = matchMesh(n, focus === "full" ? studyId : focus);
    setStructure(m ? { r: m.regionId, id: m.id } : null);
  };
  const choose = (rid: string, id: string) => {
    if (focus !== rid) { setFocus(rid as FocusRegion); setLayers(REGION_DEFAULT_LAYERS[rid]); }
    setStudyId(rid); setStructure({ r: rid, id });
    const ms = meshesFor(rid, id);
    setSelectedMesh(ms[0] ?? null);
    if (ms[0]) {
      const sys = guessSys(ms[0]);
      if (sys) setLayers((p) => ({ ...p, [sys]: true }));
      setTimeout(() => viewer.current?.frameNames(ms), 50);
    }
  };
  const guessSys = (n: string): Sys | null => {
    const m = matchMesh(n); if (!m) return null;
    const st = REGIONS.find((r) => r.id === m.regionId)?.structures.find((s) => s.id === m.id);
    if (!st) return null;
    const l = LAYER_OF[st.tissue];
    if (st.tissue === "nerve") return "nerve";
    if (st.tissue === "artery" || st.tissue === "vein") return "vessel";
    if (l === "superficial" || l === "deep" || st.tissue === "bursa" || st.tissue === "fascia") return "muscle";
    if (l === "connective" || st.tissue === "fibrocartilage" || /disc|menisc|labrum|nucleus/i.test(n)) return "joint";
    return "bone";
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return REGIONS.flatMap((r) => r.structures.filter((s) => Object.values(s).join(" ").toLowerCase().includes(q)).map((s) => ({ r, s })))
      .sort((a, b) => Number(!a.s.name.toLowerCase().includes(q)) - Number(!b.s.name.toLowerCase().includes(q)))
      .slice(0, 40);
  }, [query]);

  const mappedIds = useMemo(() => {
    const set = new Set<string>();
    for (const n of meshNames) { const m = matchMesh(n, studyId); if (m?.regionId === studyId) set.add(m.id); }
    return set;
  }, [meshNames, studyId]);
  const indexList = region.structures.filter((s) => s.name.toLowerCase().includes(indexFilter.trim().toLowerCase()));
  const exam = useMemo(() => {
    const keys = ["palpation", "movement", "danger", "tests"] as const;
    return keys.map((k) => Array.from(new Set(region.views.flatMap((v) => v.exam[k]))));
  }, [region]);

  const btn = (on: boolean) => cn("min-h-[38px] rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-secondary");

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>MSK Anatomy Atlas — Interactive 3D Shoulder, Knee & Lumbar Spine | Jefney Ongeri, PA-C</title>
        <meta name="description" content="Interactive 3D musculoskeletal anatomy viewer built on open-source Z-Anatomy / BodyParts3D meshes: orbit, layer and isolate the shoulder, knee and lumbar spine with origins, insertions, innervation and exam pearls." />
        <meta property="og:title" content="MSK Anatomy Atlas — Interactive 3D | Jefney Ongeri, PA-C" />
        <meta property="og:description" content="Real 3D anatomy of the shoulder, knee and lumbar spine with clinical study notes and exam landmarks." />
        <meta property="og:url" content={BASE} />
        <link rel="canonical" href={BASE} />
      </Helmet>
      <Header />
      <main id="main-content" className="mx-auto w-full max-w-[1500px] px-4 py-10 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Anatomy Atlas · Unit 01: Musculoskeletal</p>
        <h1 className="mt-2 font-journal text-4xl leading-tight text-foreground md:text-5xl">MSK Anatomy Atlas</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          An interactive 3D anatomy viewer built from real anatomical meshes. Drag to orbit, scroll or pinch to zoom, focus the shoulder, knee or lumbar spine, peel back body systems, and click any structure to see its exact name alongside attachments, innervation, action and clinical relevance.
        </p>

        <div className="relative mt-6 max-w-xl">
          <label htmlFor="atlas-search" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Search all structures</label>
          <input id="atlas-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. axillary nerve, L5, pes anserinus, Lachman"
            className="mt-1 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          {query.trim().length >= 2 && (
            <ul className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-lg" aria-label="Search results">
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

        {/* Focus + camera */}
        <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Region focus</p>
            <div role="group" aria-label="Region focus" className="flex flex-wrap gap-2">
              {(["shoulder", "knee", "lumbar", "full"] as FocusRegion[]).map((f) => (
                <button key={f} aria-pressed={focus === f} onClick={() => changeFocus(f)} className={btn(focus === f)}>
                  {f === "full" ? "Full body" : REGIONS.find((r) => r.id === f)!.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Camera</p>
            <div role="group" aria-label="Camera view" className="flex flex-wrap gap-1 rounded-md border border-border bg-card p-1">
              {PRESETS.map((p) => (
                <button key={p} onClick={() => viewer.current?.preset(p)} className="min-h-[34px] rounded px-3 text-sm capitalize text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{p}</button>
              ))}
              <button onClick={() => viewer.current?.reset()} className="min-h-[34px] rounded px-3 text-sm font-semibold text-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Reset</button>
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Other structures</p>
            <div role="group" aria-label="Other structures" className="flex flex-wrap gap-1 rounded-md border border-border bg-card p-1">
              {([["none", "Show"], ["dim", "Dim"], ["isolate", "Hide"]] as [DimMode, string][]).map(([m, l]) => (
                <button key={m} aria-pressed={dimMode === m} onClick={() => setDimMode(m)} disabled={focus === "full"}
                  className={cn("min-h-[34px] rounded px-3 text-sm disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", dimMode === m ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground hover:text-foreground")}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(340px,1fr)]">
          <div className="flex flex-col gap-3">
            <div className="h-[62vh] min-h-[380px] rounded-xl border border-border bg-card p-1.5 shadow-sm md:h-[74vh]">
              <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-muted-foreground" role="status">Preparing 3D viewer…</div>}>
                <AnatomyViewer ref={viewer} layers={layers} opacity={opacity} region={focus} dimMode={focus === "full" ? "none" : dimMode}
                  explode={explode} isolateSelected={isolateSel} selected={selectedMesh} onSelect={onSelectMesh} onLoaded={setMeshNames} />
              </Suspense>
            </div>
            <p className="px-1 text-xs text-muted-foreground">Interactive 3D anatomy · drag to orbit · right-drag / two-finger drag to pan · scroll or pinch to zoom · click or tap a structure to identify it. Region focus frames the area and {dimMode === "isolate" ? "hides" : "dims"} structures outside its bounding region — an approximate crop, not exact segmentation.</p>

            {/* Layers */}
            <fieldset className="rounded-xl border border-border bg-card p-4">
              <legend className="px-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Layers & transparency</legend>
              <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {SYSTEMS.map((s) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <label className="flex min-h-[38px] w-40 shrink-0 cursor-pointer items-center gap-2 text-sm text-foreground">
                      <input type="checkbox" className="h-4 w-4 accent-primary" checked={layers[s.id]} onChange={(e) => setLayers((p) => ({ ...p, [s.id]: e.target.checked }))} />
                      <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: s.color }} />{s.label}
                    </label>
                    <input type="range" min={0.1} max={1} step={0.05} value={opacity[s.id]} disabled={!layers[s.id]} aria-label={`${s.label} opacity`}
                      onChange={(e) => setOpacity((p) => ({ ...p, [s.id]: Number(e.target.value) }))} className="w-full accent-primary disabled:opacity-40" />
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <label htmlFor="explode" className="w-40 shrink-0 text-sm text-foreground">Explode region</label>
                  <input id="explode" type="range" min={0} max={1} step={0.02} value={explode} onChange={(e) => setExplode(Number(e.target.value))} className="w-full accent-primary" />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                <button onClick={() => setIsolateSel((v) => !v)} disabled={!selectedMesh} aria-pressed={isolateSel} className={cn(btn(isolateSel), "disabled:opacity-40")}>
                  {isolateSel ? "Show all again" : "Isolate selected"}
                </button>
                {selectedMesh && <button onClick={() => viewer.current?.frameNames([selectedMesh])} className={btn(false)}>Frame selected</button>}
                {selectedMesh && <button onClick={() => onSelectMesh(null)} className={btn(false)}>Clear selection</button>}
              </div>
            </fieldset>
          </div>

          <div className="flex flex-col gap-6">
            <aside aria-live="polite" className="rounded-xl border border-border bg-card p-6 shadow-sm">
              {selectedMesh ? (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Selected 3D structure · {sideOf(selectedMesh)}</p>
                  <h2 className="mt-1 font-journal text-2xl text-foreground">{baseName(selectedMesh)}</h2>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">Mesh: {selectedMesh}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Click or tap any structure in the 3D model, or pick one from the index below.</p>
              )}
              {current ? (
                <div className={cn(selectedMesh && "mt-4 border-t border-border pt-4")}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Study notes · {studyRegion.name} · {TISSUE_LABEL[current.tissue]}</p>
                  <h3 className="mt-1 font-journal text-xl text-foreground">{current.name}</h3>
                  <dl className="mt-3 space-y-3 text-sm">
                    {FIELD_LABELS.filter(([k]) => current[k]).map(([k, label]) => (
                      <div key={k}><dt className="font-semibold text-foreground">{label}</dt><dd className="mt-0.5 text-muted-foreground">{current[k]}</dd></div>
                    ))}
                  </dl>
                  {!selectedMesh && linked.length === 0 && meshNames.length > 0 && (
                    <p className="mt-3 text-xs text-muted-foreground">This landmark is part of a larger mesh or not modelled separately in the 3D dataset.</p>
                  )}
                </div>
              ) : selectedMesh ? (
                <p className="mt-4 text-sm text-muted-foreground">No atlas study card for this structure yet — the name above comes directly from the anatomical model.</p>
              ) : null}
            </aside>

            <Sheet>
              <SheetTrigger asChild>
                <button className="rounded-md border border-primary px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {region.name}: clinical landmarks & exam
                </button>
              </SheetTrigger>
              <SheetContent className="w-full overflow-y-auto sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="font-journal">{region.name} — landmarks & exam</SheetTitle>
                  <SheetDescription>Palpation, movement, danger zones and test associations.</SheetDescription>
                </SheetHeader>
                {(["Palpation landmarks", "Movements & actions", "Neurovascular danger zones", "Test associations"]).map((h, i) => (
                  <section key={h} className="mt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{h}</h3>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-foreground">{exam[i].map((t) => <li key={t}>{t}</li>)}</ul>
                  </section>
                ))}
              </SheetContent>
            </Sheet>

            <section aria-labelledby="index-heading" className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h3 id="index-heading" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{region.name} index ({region.structures.length})</h3>
              <input type="search" value={indexFilter} onChange={(e) => setIndexFilter(e.target.value)} aria-label={`Filter ${region.name} structures`}
                placeholder="Filter structures" className="mt-2 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              <div className="mt-2 max-h-96 overflow-y-auto pr-1">
                {LAYERS.map((l) => {
                  const items = indexList.filter((s) => LAYER_OF[s.tissue] === l.id);
                  if (!items.length) return null;
                  return (
                    <div key={l.id} className="mt-2">
                      <p className="text-[11px] font-semibold text-foreground">{l.label}</p>
                      <ul className="mt-1 space-y-0.5">
                        {items.map((s) => {
                          const on = structure?.r === region.id && structure.id === s.id;
                          return (
                            <li key={s.id}>
                              <button onClick={() => choose(region.id, s.id)} aria-pressed={on}
                                className={cn("flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                  on ? "bg-primary/10 font-semibold text-foreground" : "text-muted-foreground hover:bg-secondary")}>
                                <span>{s.name}</span>
                                {meshNames.length > 0 && <span className="ml-2 shrink-0 text-[10px] uppercase tracking-wide">{mappedIds.has(s.id) ? "3D" : "notes"}</span>}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        <p className="mt-6 rounded-md border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Educational use only.</strong> This interactive 3D model and its simplified notes are for orientation and anatomy review, not radiographic interpretation, diagnosis, or procedural planning. The meshes represent a single reference anatomy and will not match every patient.
        </p>

        <section className="mt-8 rounded-xl border border-border bg-card p-5" aria-labelledby="credits-heading">
          <h2 id="credits-heading" className="font-journal text-xl text-foreground">Credits & license</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            3D anatomical meshes: <strong className="text-foreground">Z-Anatomy</strong> — the open source atlas of anatomy (CC BY-SA 4.0), derived from <strong className="text-foreground">BodyParts3D</strong>, © The Database Center for Life Science (CC BY-SA 2.1 Japan). Exported glTF files via the{" "}
            <a className="font-semibold text-primary underline" href="https://github.com/nqwrc/3d-anatomy" target="_blank" rel="noopener noreferrer">nqwrc/3d-anatomy</a> repository, adapted (recoloured, layered and region-framed) for this interactive web viewer. The adapted models are shared under{" "}
            <a className="font-semibold text-primary underline" href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>. See the bundled{" "}
            <a className="font-semibold text-primary underline" href="/anatomy-models/License.txt" target="_blank" rel="noopener noreferrer">License.txt</a>. Clinical study notes are original to this site.
          </p>
        </section>

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
