import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SHOULDER_PATH, shoulderSpecialist, matchShoulderSpecialist } from "@/data/msk/shoulderSpecialist";
import { ARM_PATH, armSpecialist, matchArmMesh } from "@/data/msk/armSpecialist";
import { ELBOW_FOREARM_PATH, elbowForearmSpecialist, matchElbowForearmMesh } from "@/data/msk/elbowForearmSpecialist";
import { NECK_PATH, neckSpecialist, matchNeckMesh } from "@/data/msk/neckSpecialist";
import { WRIST_HAND_PATH, wristHandSpecialist, matchWristHandMesh } from "@/data/msk/wristHandSpecialist";
import { BACK_PATH, BACK_LEVELS, backSpineSpecialist, matchBackMesh, type BackLevel } from "@/data/msk/backSpineSpecialist";
import { HIP_PELVIS_PATH, HIP_SIDES, hipPelvisSpecialist, matchHipPelvisMesh, type HipSide } from "@/data/msk/hipPelvisSpecialist";
import { THIGH_PATH, thighSpecialist, matchThighMesh } from "@/data/msk/thighSpecialist";
import { KNEE_PATH, kneeSpecialist, matchKneeMesh } from "@/data/msk/kneeSpecialist";
import { CALF_PATH, calfSpecialist, matchCalfMesh } from "@/data/msk/calfSpecialist";
import { ANKLE_FOOT_PATH, ankleFootSpecialist, matchAnkleFootMesh } from "@/data/msk/ankleFootSpecialist";
import { FACE_PATH, faceSpecialist, matchFaceMesh } from "@/data/msk/faceSpecialist";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FIELD_LABELS, LAYERS, LAYER_OF, REGIONS, ROADMAP, type Region } from "@/data/msk";
import { baseName, matchMesh, sideOf } from "@/data/msk/meshMap";
import { SYSTEMS, type LabelMode, type DimMode, type FocusRegion, type Preset, type Sys, type ViewerHandle } from "@/components/anatomy/AnatomyViewer";

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
  neck: { bone: true, muscle: true, joint: true, nerve: true, vessel: true },
  shoulder: { bone: true, muscle: true, joint: true, nerve: true, vessel: true },
  arm: { bone: true, muscle: true, joint: false, nerve: true, vessel: true },
  elbow: { bone: true, muscle: false, joint: true, nerve: true, vessel: false },
  forearm: { bone: true, muscle: true, joint: true, nerve: true, vessel: true },
  "wrist-hand": { bone: true, muscle: true, joint: true, nerve: true, vessel: true },
  "elbow-forearm": { bone: true, muscle: true, joint: true, nerve: true, vessel: true },
  digits: { bone: true, muscle: false, joint: true, nerve: true, vessel: true },
  knee: { bone: true, muscle: false, joint: true, nerve: true, vessel: true },
  lumbar: { bone: true, muscle: false, joint: true, nerve: true, vessel: false },
  back: { bone: true, muscle: true, joint: true, nerve: true, vessel: true },
  "hip-pelvis": { bone: true, muscle: true, joint: true, nerve: true, vessel: true },
  thigh: { bone: true, muscle: true, joint: true, nerve: true, vessel: true },
  calf: { bone: true, muscle: true, joint: true, nerve: true, vessel: true },
  "ankle-foot": { bone: true, muscle: true, joint: true, nerve: true, vessel: true },
  face: { bone: true, muscle: true, joint: true, nerve: true, vessel: true },
};

const MskAnatomyAtlas = () => {
  const { pathname } = useLocation();
  const neckUnit = pathname === NECK_PATH;
  const armUnit = pathname === ARM_PATH;
  const efUnit = pathname === ELBOW_FOREARM_PATH;
  const whUnit = pathname === WRIST_HAND_PATH;
  const backUnit = pathname === BACK_PATH;
  const hipUnit = pathname === HIP_PELVIS_PATH;
  const thighUnit = pathname === THIGH_PATH;
  const kneeUnit = pathname === KNEE_PATH;
  const calfUnit = pathname === CALF_PATH;
  const ankleUnit = pathname === ANKLE_FOOT_PATH;
  const faceUnit = pathname === FACE_PATH;
  const specialist = pathname === SHOULDER_PATH || armUnit || efUnit || whUnit || neckUnit || backUnit || hipUnit || thighUnit || kneeUnit || calfUnit || ankleUnit || faceUnit;
  const module = neckUnit ? neckSpecialist : backUnit ? backSpineSpecialist : hipUnit ? hipPelvisSpecialist : thighUnit ? thighSpecialist : kneeUnit ? kneeSpecialist : calfUnit ? calfSpecialist : ankleUnit ? ankleFootSpecialist : faceUnit ? faceSpecialist : whUnit ? wristHandSpecialist : efUnit ? elbowForearmSpecialist : armUnit ? armSpecialist : specialist ? {...shoulderSpecialist,intro:"The right shoulder girdle: clavicle, scapula and proximal humerus, rotator cuff, joint stabilizers and axillary neurovascular relationships."} : undefined;
  const STUDY_REGIONS = neckUnit ? [neckSpecialist] : backUnit ? [backSpineSpecialist] : hipUnit ? [hipPelvisSpecialist] : thighUnit ? [thighSpecialist] : kneeUnit ? [kneeSpecialist] : calfUnit ? [calfSpecialist] : ankleUnit ? [ankleFootSpecialist] : faceUnit ? [faceSpecialist] : whUnit ? [wristHandSpecialist] : efUnit ? [elbowForearmSpecialist] : armUnit ? [armSpecialist] : specialist ? [shoulderSpecialist, ...REGIONS.filter(r=>r.id!=="shoulder")] : REGIONS;
  const match = (name: string, prefer?: string) => neckUnit && prefer === "neck" ? matchNeckMesh(name) : backUnit && prefer === "back" ? matchBackMesh(name) : hipUnit && prefer === "hip-pelvis" ? matchHipPelvisMesh(name) : thighUnit && prefer === "thigh" ? matchThighMesh(name) : kneeUnit && prefer === "knee" ? matchKneeMesh(name) : calfUnit && prefer === "calf" ? matchCalfMesh(name) : ankleUnit && prefer === "ankle-foot" ? matchAnkleFootMesh(name) : faceUnit && prefer === "face" ? matchFaceMesh(name) : whUnit && prefer === "wrist-hand" ? matchWristHandMesh(name) : efUnit && prefer === "elbow-forearm" ? matchElbowForearmMesh(name) : armUnit && prefer === "arm" ? matchArmMesh(name) : specialist && prefer === "shoulder" ? (matchShoulderSpecialist(name) !== undefined ? matchShoulderSpecialist(name) : matchMesh(name,prefer)) : matchMesh(name,prefer);
  const [labelMode,setLabelMode] = useState<LabelMode>("selected");
  const [backLevel, setBackLevel] = useState<BackLevel>("whole");
  const [hipSide, setHipSide] = useState<HipSide>("whole");
  const LOWER_TITLE = (m: { name: string }) => `${m.name} — Lower Extremity 3D Anatomy Atlas`;
  const title = neckUnit ? "Neck & Cervical Region — 3D Anatomy Atlas" : backUnit ? "Back & Spine — Cervical, Thoracic & Lumbar 3D Anatomy Atlas" : faceUnit ? "Face — 3D Anatomy Atlas" : hipUnit ? "Hip & Pelvis 3D Anatomy Atlas" : thighUnit || kneeUnit || calfUnit || ankleUnit ? LOWER_TITLE(module as { name: string }) : module ? `${module.name} — Upper Extremity 3D Anatomy Atlas` : "MSK Anatomy Atlas — Interactive 3D Study Hub";
  const description = module ? `${module.intro} Real reference meshes with focused structure notes and clinical examination landmarks.` : "Interactive 3D reference anatomy of the shoulder, knee and lumbar spine, with clinical study notes and examination landmarks.";
  const canonical = neckUnit ? `https://jeffongeri.com${NECK_PATH}` : backUnit ? `https://jeffongeri.com${BACK_PATH}` : hipUnit ? `https://jeffongeri.com${HIP_PELVIS_PATH}` : thighUnit ? `https://jeffongeri.com${THIGH_PATH}` : kneeUnit ? `https://jeffongeri.com${KNEE_PATH}` : calfUnit ? `https://jeffongeri.com${CALF_PATH}` : ankleUnit ? `https://jeffongeri.com${ANKLE_FOOT_PATH}` : faceUnit ? `https://jeffongeri.com${FACE_PATH}` : module ? `${BASE}/upper-extremity/${module.id}` : BASE;
  const viewer = useRef<ViewerHandle>(null);
  const [focus, setFocus] = useState<FocusRegion>((module?.id ?? "shoulder") as FocusRegion);
  const [studyId, setStudyId] = useState(module?.id ?? REGIONS[0].id);
  const region: Region = STUDY_REGIONS.find((r) => r.id === studyId) ?? REGIONS[0];
  const [layers, setLayers] = useState<Record<Sys, boolean>>(REGION_DEFAULT_LAYERS.shoulder);
  const [opacity, setOpacity] = useState<Record<Sys, number>>({ bone: 1, muscle: 1, joint: 1, nerve: 1, vessel: 1 });
  const [dimMode, setDimMode] = useState<DimMode>(module ? "isolate" : "dim");
  const [explode, setExplode] = useState(0);
  const [isolateSel, setIsolateSel] = useState(false);
  const [selectedMesh, setSelectedMesh] = useState<string | null>(null);
  const [structure, setStructure] = useState<{ r: string; id: string } | null>(null);
  const [meshNames, setMeshNames] = useState<string[]>([]);
  const [indexFilter, setIndexFilter] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const id = module?.id ?? "shoulder";
    setFocus(id as FocusRegion); setStudyId(id); setLayers(REGION_DEFAULT_LAYERS[id]);
    setOpacity({bone:1,muscle:specialist ? 0.4 : 1,joint:1,nerve:1,vessel:1});
    setDimMode(module ? "isolate" : "dim"); setSelectedMesh(null); setStructure(null);
    setIndexFilter(""); setQuery(""); setIsolateSel(false); setExplode(0); setBackLevel("whole"); setHipSide("whole");
  }, [pathname]);

  const studyRegion = STUDY_REGIONS.find((r) => r.id === structure?.r) ?? region;
  const current = structure ? STUDY_REGIONS.find((r) => r.id === structure.r)?.structures.find((s) => s.id === structure.id) : undefined;

  const meshesFor = (rid: string, id: string) => meshNames.filter((n) => { const m = match(n, rid); return m?.regionId === rid && m.id === id; })
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
    const m = match(n, focus === "full" ? studyId : focus);
    setStructure(m ? { r: m.regionId, id: m.id } : null);
  };
  const choose = (rid: string, id: string) => {
    setIsolateSel(false); setExplode(0);
    if (focus !== rid) { setFocus(rid as FocusRegion); setLayers(REGION_DEFAULT_LAYERS[rid]); }
    setStudyId(rid); setStructure({ r: rid, id });
    const ms = meshesFor(rid, id);
    setSelectedMesh(ms[0] ?? null);
    if (ms[0]) {
      const sys = guessSys(ms[0]);
      if (sys) setLayers((p) => ({ ...p, [sys]: true }));
      setTimeout(() => viewer.current?.frameNames([ms[0]]), 50);
    }
  };
  const guessSys = (n: string): Sys | null => {
    const actual = viewer.current?.meshSystem(n); if (actual) return actual;
    const m = match(n, studyId); if (!m) return null;
    const st = STUDY_REGIONS.find((r) => r.id === m.regionId)?.structures.find((s) => s.id === m.id);
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
    return (module ? [module] : STUDY_REGIONS).flatMap((r) => r.structures.filter((s) => Object.values(s).join(" ").toLowerCase().includes(q)).map((s) => ({ r, s })))
      .sort((a, b) => Number(!a.s.name.toLowerCase().includes(q)) - Number(!b.s.name.toLowerCase().includes(q)))
      .slice(0, 40);
  }, [query, specialist, armUnit, efUnit, whUnit, neckUnit, hipUnit]);

  const mappedIds = useMemo(() => {
    const set = new Set<string>();
    for (const n of meshNames) { const m = match(n, studyId); if (m?.regionId === studyId) set.add(m.id); }
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
        <title>{title} | Jefney Ongeri, PA-C</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${title} | Jefney Ongeri, PA-C`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <Header />
      <main id="main-content" className="mx-auto w-full max-w-[1500px] px-4 py-10 md:px-6">
        <nav aria-label="Atlas breadcrumb" className="mb-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <Link to="/professional" className="hover:text-primary">Professional</Link><span>/</span>
          <Link to="/msk-anatomy-atlas" className="hover:text-primary">MSK Atlas</Link>
          {module && <><span>/</span><span>{neckUnit || backUnit ? "Axial" : hipUnit ? "Lower Extremity" : "Upper Extremity"}</span><span>/</span><span className="text-foreground">{module.name}</span></>}
        </nav>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Unit 01 · Musculoskeletal{module && ` · Specialist ${module.name}`}</p>
        <h1 className="mt-2 font-journal text-4xl leading-tight text-foreground md:text-5xl">{module ? module.name : "MSK Anatomy Atlas"}</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">{module ? module.intro : "An interactive 3D anatomy viewer built from real anatomical meshes, with shoulder, knee and lumbar study notes, clinical relationships and examination landmarks."}</p>
        {!specialist && <section className="mt-6 max-w-xl" aria-label="Specialist shoulder unit">
          <Link to={SHOULDER_PATH} className="block rounded-md border border-border bg-card p-4 hover:border-primary focus-visible:ring-2 focus-visible:ring-ring">
            <span className="text-xs font-semibold uppercase text-primary">Specialist unit · Shoulder</span>
            <h2 className="mt-2 flex items-center justify-between font-journal text-xl text-foreground">Right shoulder anatomy<ArrowRight className="h-4 w-4" /></h2>
            <p className="mt-2 text-sm text-muted-foreground">Focused 3D anatomy, rotator cuff, joint stabilizers and clinical examination landmarks.</p>
          </Link>
          <Link to={ARM_PATH} className="mt-3 block rounded-md border border-border bg-card p-4 hover:border-primary focus-visible:ring-2 focus-visible:ring-ring">
            <span className="text-xs font-semibold uppercase text-primary">Specialist unit · Arm</span>
            <h2 className="mt-2 flex items-center justify-between font-journal text-xl text-foreground">Right arm anatomy<ArrowRight className="h-4 w-4" /></h2>
            <p className="mt-2 text-sm text-muted-foreground">Brachial compartments, humeral landmarks and arm neurovascular relationships.</p>
          </Link>
          <Link to={ELBOW_FOREARM_PATH} className="mt-3 block rounded-md border border-border bg-card p-4 hover:border-primary focus-visible:ring-2 focus-visible:ring-ring">
            <span className="text-xs font-semibold uppercase text-primary">Specialist unit · Elbow & Forearm</span>
            <h2 className="mt-2 flex items-center justify-between font-journal text-xl text-foreground">Right elbow & forearm anatomy<ArrowRight className="h-4 w-4" /></h2>
            <p className="mt-2 text-sm text-muted-foreground">Elbow joints and stabilizers, flexor and extensor compartments, and median, ulnar and radial nerve courses.</p>
          </Link>
          <Link to={WRIST_HAND_PATH} className="mt-3 block rounded-md border border-border bg-card p-4 hover:border-primary focus-visible:ring-2 focus-visible:ring-ring">
            <span className="text-xs font-semibold uppercase text-primary">Specialist unit · Wrist & Hand</span>
            <h2 className="mt-2 flex items-center justify-between font-journal text-xl text-foreground">Right wrist & hand anatomy<ArrowRight className="h-4 w-4" /></h2>
            <p className="mt-2 text-sm text-muted-foreground">Carpal bones and ligaments, carpal tunnel and Guyon canal, extensor compartments, intrinsic hand groups and palmar arches.</p>
          </Link>
          <Link to={NECK_PATH} className="mt-3 block rounded-md border border-border bg-card p-4 hover:border-primary focus-visible:ring-2 focus-visible:ring-ring">
            <span className="text-xs font-semibold uppercase text-primary">Axial specialist unit · Neck</span>
            <h2 className="mt-2 flex items-center justify-between font-journal text-xl text-foreground">Neck & Cervical Region<ArrowRight className="h-4 w-4" /></h2>
            <p className="mt-2 text-sm text-muted-foreground">Skull base through C7–T1, deep neck muscles, fascial relations and educational pain anatomy.</p>
          </Link>
          <Link to={BACK_PATH} className="mt-3 block rounded-md border border-border bg-card p-4 hover:border-primary focus-visible:ring-2 focus-visible:ring-ring">
            <span className="text-xs font-semibold uppercase text-primary">Axial specialist unit · Back & Spine</span>
            <h2 className="mt-2 flex items-center justify-between font-journal text-xl text-foreground">Back & Spine — Cervical, Thoracic & Lumbar<ArrowRight className="h-4 w-4" /></h2>
            <p className="mt-2 text-sm text-muted-foreground">Occiput to sacrum in three switchable levels: vertebrae and discs, deep back muscles, thoracolumbar fascia and dorsal rami.</p>
          </Link>
          <Link to={HIP_PELVIS_PATH} className="mt-3 block rounded-md border border-border bg-card p-4 hover:border-primary focus-visible:ring-2 focus-visible:ring-ring">
            <span className="text-xs font-semibold uppercase text-primary">Lower extremity specialist unit · Hip & Pelvis</span>
            <h2 className="mt-2 flex items-center justify-between font-journal text-xl text-foreground">Hip & Pelvis<ArrowRight className="h-4 w-4" /></h2>
            <p className="mt-2 text-sm text-muted-foreground">Bilateral pelvis and proximal femora with left/right hip focus: hip joint and ligaments, gluteals and deep rotators, iliopsoas, adductors and lumbosacral plexus relations.</p>
          </Link>
        </section>}
        {specialist && <Button variant="outline" asChild className="mt-5 rounded-md"><Link to="/msk-anatomy-atlas"><ArrowLeft />Full MSK overview</Link></Button>}

        <div className="relative mt-6 max-w-xl">
          <label htmlFor="atlas-search" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{specialist ? `Search ${module?.name.toLowerCase()} structures` : "Search all structures"}</label>
          <input id="atlas-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder={neckUnit ? "e.g. SCM, C2, greater occipital" : backUnit ? "e.g. multifidus, SI joint, L4–L5 disc" : hipUnit ? "e.g. piriformis, sciatic nerve, acetabular labrum" : whUnit ? "e.g. scaphoid, Guyon canal, compartment I" : efUnit ? "e.g. supinator, PIN, annular ligament" : armUnit ? "e.g. radial nerve, brachialis, profunda" : specialist ? "e.g. supraspinatus, labrum, axillary nerve" : "e.g. axillary nerve, L5, pes anserinus, Lachman"}
            className="mt-1 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          {query.trim().length >= 2 && (
            <ul className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-lg" aria-label="Search results">
              {results.length === 0 && <li className="px-3 py-2 text-sm text-muted-foreground">No matches</li>}
              {results.map(({ r, s }) => (
                <li key={r.id + s.id}>
                  <Button variant="outline" onClick={() => { choose(r.id, s.id); setQuery(""); }}
                    className="flex w-full items-center justify-between gap-3 rounded px-3 py-2 text-left text-sm text-foreground hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none">
                    <span>{s.name}</span><span className="shrink-0 text-xs text-muted-foreground">{r.name}</span>
                  </Button>
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
              {(neckUnit ? ["neck"] as FocusRegion[] : backUnit ? ["back"] as FocusRegion[] : hipUnit ? ["hip-pelvis"] as FocusRegion[] : module ? [module.id, "full"] as FocusRegion[] : ["shoulder", "knee", "lumbar", "full"] as FocusRegion[]).map((f) => (
                <Button variant="outline" key={f} aria-pressed={focus === f} onClick={() => changeFocus(f)} className={btn(focus === f)}>
                  {f === "full" ? "Full body" : STUDY_REGIONS.find((r) => r.id === f)?.name ?? f}
                </Button>
              ))}
            </div>
          </div>
          {backUnit && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Spine level</p>
              <div role="group" aria-label="Spine level" className="flex flex-wrap gap-2">
                {BACK_LEVELS.map((l) => (
                  <Button variant="outline" key={l.id} aria-pressed={backLevel === l.id} onClick={() => setBackLevel(l.id)} className={btn(backLevel === l.id)}>
                    {l.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {hipUnit && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Hip focus</p>
              <div role="group" aria-label="Hip focus" className="flex flex-wrap gap-2">
                {HIP_SIDES.map((s) => (
                  <Button variant="outline" key={s.id} aria-pressed={hipSide === s.id} onClick={() => setHipSide(s.id)} className={btn(hipSide === s.id)}>
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Camera</p>
            <div role="group" aria-label="Camera view" className="flex flex-wrap gap-1 rounded-md border border-border bg-card p-1">
              {PRESETS.map((p) => (
                <Button variant="outline" key={p} onClick={() => viewer.current?.preset(p)} className="min-h-[34px] rounded px-3 text-sm capitalize text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{p}</Button>
              ))}
              <Button variant="outline" onClick={() => viewer.current?.reset()} className="min-h-[34px] rounded px-3 text-sm font-semibold text-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Reset</Button>
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Other structures</p>
            <div role="group" aria-label="Other structures" className="flex flex-wrap gap-1 rounded-md border border-border bg-card p-1">
              {([["none", "Show"], ["dim", "Dim"], ["isolate", "Hide"]] as [DimMode, string][]).map(([m, l]) => (
                <Button variant="outline" key={m} aria-pressed={dimMode === m} onClick={() => setDimMode(m)} disabled={focus === "full" || neckUnit || backUnit || hipUnit}
                  className={cn("min-h-[34px] rounded px-3 text-sm disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", dimMode === m ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground hover:text-foreground")}>{l}</Button>
              ))}

            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(340px,1fr)]">
          <div className="flex min-w-0 flex-col gap-3">
            <div className="h-[62vh] min-h-[380px] rounded-xl border border-border bg-card p-1.5 shadow-sm md:h-[74vh]">
              <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-muted-foreground" role="status">Preparing 3D viewer…</div>}>
                <AnatomyViewer ref={viewer} layers={layers} opacity={opacity} region={focus} specialistShoulder={pathname === SHOULDER_PATH && focus === "shoulder"} specialistArm={armUnit && focus === "arm"} specialistElbowForearm={efUnit && focus === "elbow-forearm"} specialistWristHand={whUnit && focus === "wrist-hand"} specialistNeck={neckUnit} specialistBack={backUnit} backLevel={backLevel} specialistHipPelvis={hipUnit} hipSide={hipSide} dimMode={focus === "full" ? "none" : dimMode}
                  explode={explode} isolateSelected={isolateSel} selected={selectedMesh} labels={labelMode} onSelect={onSelectMesh} onLoaded={setMeshNames} />
              </Suspense>
            </div>
            <p className="px-1 text-xs text-muted-foreground">Interactive 3D anatomy · drag to orbit · right-drag / two-finger drag to pan · scroll or pinch to zoom · click or tap a structure to identify it. Region focus frames the area and {dimMode === "isolate" ? "hides" : "dims"} structures outside its bounding region — an approximate crop, not exact segmentation.</p>

            <fieldset className="flex flex-wrap items-center gap-2 border-y border-border py-3">
              <legend className="text-xs font-semibold uppercase text-muted-foreground">Labels</legend>
              {([["selected","Selected only"],["hover","Hover + selected"],["off","Off"]] as [LabelMode,string][]).map(([value,label])=><Button key={value} variant={labelMode===value ? "default" : "outline"} aria-pressed={labelMode===value} onClick={()=>setLabelMode(value)} className="rounded-md">{label}</Button>)}
            </fieldset>
            {/* Layers */}
            <fieldset className="min-w-0 rounded-lg border border-border bg-card p-4">
              <legend className="px-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Layers & transparency</legend>
              <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {SYSTEMS.map((s) => (
                  <div key={s.id} className="flex min-w-0 items-center gap-3">
                    <label className="flex min-h-[38px] w-40 shrink-0 cursor-pointer items-center gap-2 text-sm text-foreground">
                      <input type="checkbox" className="h-4 w-4 accent-primary" checked={layers[s.id]} onChange={(e) => setLayers((p) => ({ ...p, [s.id]: e.target.checked }))} />
                      <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: s.color }} />{s.label}
                    </label>
                    <input type="range" min={0.1} max={1} step={0.05} value={opacity[s.id]} disabled={!layers[s.id]} aria-label={`${s.label} opacity`}
                      onChange={(e) => setOpacity((p) => ({ ...p, [s.id]: Number(e.target.value) }))} className="min-w-0 w-full accent-primary disabled:opacity-40" />
                  </div>
                ))}
                <div className="flex min-w-0 items-center gap-3">
                  <label htmlFor="explode" className="w-40 shrink-0 text-sm text-foreground">Explode region</label>
                  <input id="explode" type="range" min={0} max={1} step={0.02} value={explode} onChange={(e) => setExplode(Number(e.target.value))} className="min-w-0 w-full accent-primary" />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                <Button variant="outline" onClick={() => setIsolateSel((v) => !v)} disabled={!selectedMesh} aria-pressed={isolateSel} className={cn(btn(isolateSel), "disabled:opacity-40")}>
                  {isolateSel ? "Show all again" : "Isolate selected"}
                </Button>
                {selectedMesh && <Button variant="outline" onClick={() => viewer.current?.frameNames([selectedMesh])} className={btn(false)}>Frame selected</Button>}
                {selectedMesh && <Button variant="outline" onClick={() => onSelectMesh(null)} className={btn(false)}>Clear selection</Button>}
              </div>
            </fieldset>
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            <aside aria-live="polite" className="rounded-xl border border-border bg-card p-6 shadow-sm">
              {selectedMesh ? (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Selected 3D structure · {sideOf(selectedMesh)}</p>
                  <h2 className="mt-1 font-journal text-2xl text-foreground">{current?.name ?? baseName(selectedMesh)}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Normalized clinical name: {current?.name ?? baseName(selectedMesh)}</p>
                  <Button variant="outline" className="mt-3 rounded-md" onClick={()=>viewer.current?.frameNames([selectedMesh])}>Frame selected structure</Button>
                  <p className="mt-1 break-words font-mono text-[11px] text-muted-foreground">Exact mesh: {selectedMesh}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Layer: {SYSTEMS.find(s=>s.id===viewer.current?.meshSystem(selectedMesh))?.label ?? "Reference model"} · Matched study entry: {current?.name ?? "No matching clinical entry"}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Click or tap any structure in the 3D model, or pick one from the index below.</p>
              )}
              {current ? (
                <div className={cn(selectedMesh && "mt-4 border-t border-border pt-4")}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Study notes · {studyRegion.name} · {TISSUE_LABEL[current.tissue]}</p>
                  <h3 className="mt-1 font-journal text-xl text-foreground">{current.name}</h3>
                  {specialist && !current.origin && <p className="mt-3 text-xs text-muted-foreground">Origin / insertion / motor innervation: not applicable to this non-muscle structure; see attachments, articulation or course below.</p>}
                  <dl className="mt-3 space-y-3 text-sm">
                    {FIELD_LABELS.filter(([k]) => current[k]).map(([k, label]) => (
                      <div key={k}><dt className="font-semibold text-foreground">{label}</dt><dd className="mt-0.5 text-muted-foreground">{current[k]}</dd></div>
                    ))}
                  </dl>
                  {!selectedMesh && linked.length === 0 && meshNames.length > 0 && (
                    <p className="mt-3 text-xs text-muted-foreground">{neckUnit ? "Index only — no separate mesh in this reference model." : "No separate mesh in this reference model."} This is an indexed educational structure, not a separately selectable 3D part.</p>
                  )}
                </div>
              ) : selectedMesh ? (
                <p className="mt-4 text-sm text-muted-foreground">No atlas study card for this structure yet — the name above comes directly from the anatomical model.</p>
              ) : null}
            </aside>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-md border border-primary px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {region.name}: clinical landmarks & exam
                </Button>
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
                {(("groups" in region ? (region.groups as string[]).map((g) => ({ id: g, label: g })) : LAYERS) as { id: string; label: string }[]).map((l) => {
                  const items = indexList.filter((s) => "groups" in region ? (s as { group?: string }).group === l.id : LAYER_OF[s.tissue] === l.id);
                  if (!items.length) return null;
                  return (
                    <div key={l.id} className="mt-2">
                      <p className="text-[11px] font-semibold text-foreground">{l.label}</p>
                      <ul className="mt-1 space-y-0.5">
                        {items.map((s) => {
                          const on = structure?.r === region.id && structure.id === s.id;
                          return (
                            <li key={s.id}>
                              <Button variant="outline" onClick={() => choose(region.id, s.id)} aria-pressed={on}
                                className={cn("flex h-auto min-h-9 w-full items-center justify-between whitespace-normal rounded px-2 py-1.5 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                  on ? "bg-primary/10 font-semibold text-foreground" : "text-muted-foreground hover:bg-secondary")}>
                                <span>{s.name}</span>
                                {meshNames.length > 0 && <span className="ml-2 shrink-0 text-[10px] uppercase tracking-wide">{mappedIds.has(s.id) ? "3D" : "Index only"}</span>}
                              </Button>
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

        {specialist && <nav aria-label="Atlas specialist modules" className="mt-6 flex flex-wrap gap-3 border-y border-border py-4">
          {armUnit && <Button variant="outline" asChild><Link to={SHOULDER_PATH}><ArrowLeft />Previous: Shoulder</Link></Button>}
          {efUnit && <Button variant="outline" asChild><Link to={ARM_PATH}><ArrowLeft />Previous: Arm</Link></Button>}
          {whUnit && <Button variant="outline" asChild><Link to={ELBOW_FOREARM_PATH}><ArrowLeft />Previous: Elbow & Forearm</Link></Button>}
          {efUnit && <Button variant="outline" asChild><Link to={WRIST_HAND_PATH}><ArrowRight />Next: Wrist & Hand</Link></Button>}
          {!neckUnit && !armUnit && !efUnit && !whUnit && !backUnit && <Button variant="outline" asChild><Link to={ARM_PATH}><ArrowRight />Next: Arm</Link></Button>}
          {armUnit && <Button variant="outline" asChild><Link to={ELBOW_FOREARM_PATH}><ArrowRight />Next: Elbow & Forearm</Link></Button>}
          {neckUnit && <Button variant="outline" asChild><Link to={BACK_PATH}><ArrowRight />Next: Back & Spine</Link></Button>}
          {backUnit && <Button variant="outline" asChild><Link to={NECK_PATH}><ArrowLeft />Previous: Neck & Cervical Region</Link></Button>}
          {backUnit && <Button variant="outline" asChild><Link to={HIP_PELVIS_PATH}><ArrowRight />Next: Hip & Pelvis</Link></Button>}
          {hipUnit && <Button variant="outline" asChild><Link to={BACK_PATH}><ArrowLeft />Previous: Back & Spine</Link></Button>}
          <Button variant="outline" asChild><Link to={neckUnit || backUnit || hipUnit ? "/msk-anatomy-atlas" : NECK_PATH}>{neckUnit || backUnit || hipUnit ? "Full atlas / specialist hub" : "Axial: Neck & Cervical Region"}</Link></Button>
        </nav>}
        {neckUnit && <p className="mt-4 text-sm text-muted-foreground"><strong className="text-foreground">Reference limitations.</strong> Occipital bone, C1/C2 and C3–C7 are whole meshes: nuchal lines, mastoid, dens and processes are index-only landmarks. Cervical facets, uncovertebral joints, small cervical plexus/occipital branches, phrenic nerve, most fascial spaces, semispinalis capitis and cervical-specific rotatores have no independent mesh. Long muscles, nerves and vessels are clipped to this region; cut ends are not natural terminations. Left-sided soft tissues and the full-body view are excluded.</p>}
        {backUnit && <p className="mt-4 text-sm text-muted-foreground"><strong className="text-foreground">Reference limitations.</strong> Vertebrae, sacrum and hip bones are whole meshes: spinous/transverse processes, pedicles, laminae, pars, facet joints and uncovertebral joints are index-only landmarks on them. Discs are whole-disc meshes (annulus/nucleus not separated). Dorsal rami, medial branches, cluneal nerves, costovertebral joint capsules and segmental vessels have no independent mesh. The spine-level tabs crop and frame the same bilateral model; cut edges of long muscles, nerves and vessels are not natural terminations. Semispinalis capitis is represented by the semispinalis colli mesh.</p>}
        {hipUnit && <p className="mt-4 text-sm text-muted-foreground"><strong className="text-foreground">Reference limitations.</strong> Hip bone, sacrum and femur are whole meshes: ilium/ischium/pubis, the acetabulum, ASIS/AIIS, PSIS/PIIS, ischial spine and tuberosity, pubic tubercle, obturator foramen, femoral head/neck and both trochanters are index-only landmarks on them. Articular cartilage, the femoral triangle, sciatic foramina, pelvic-floor fascia and the inferior gluteal nerve have no independent mesh. The hip-focus tabs crop and frame the same bilateral model; cut edges of long muscles, nerves and vessels (hamstrings, quadriceps, femoral and iliac vessels) are not natural terminations.</p>}
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
