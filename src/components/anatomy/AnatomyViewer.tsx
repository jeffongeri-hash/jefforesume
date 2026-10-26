import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { baseName } from "@/data/msk/meshMap";

export type Sys = "bone" | "muscle" | "joint" | "nerve" | "vessel";
export type FocusRegion = "full" | "shoulder" | "knee" | "lumbar";
export type Preset = "anterior" | "posterior" | "lateral" | "superior";
export type DimMode = "none" | "dim" | "isolate";

// Anatomical illustration palette (content colours, not UI chrome)
export const SYSTEMS: { id: Sys; file: string; label: string; color: string }[] = [
  { id: "bone", file: "skeletal", label: "Bone", color: "#e9dfc8" },
  { id: "muscle", file: "muscular", label: "Muscle", color: "#b4463e" },
  { id: "joint", file: "joints", label: "Joints & ligaments", color: "#d9c58a" },
  { id: "nerve", file: "nervous", label: "Nerves", color: "#e6b81c" },
  { id: "vessel", file: "cardiovascular", label: "Vessels", color: "#c62a30" },
];
const VEIN = "#3c5ca8", CART = "#bcdbe6", FASCIA = "#d8c9a6";
const HILITE = new THREE.Color("#12a4c9");

const ANCHORS: Record<Exclude<FocusRegion, "full">, { names: string[]; pad: number }> = {
  shoulder: { names: ["Scapula.r", "Clavicle.r", "Articular capsule of glenohumeral joint.r", "Glenoid labrum.r"], pad: 0.35 },
  knee: { names: ["Patella.r", "Articular capsule of knee joint.r", "Medial meniscus.r", "Lateral meniscus.r", "Fibular collateral ligament.r"], pad: 0.9 },
  lumbar: { names: ["Vertebra L1", "Vertebra L2", "Vertebra L3", "Vertebra L4", "Vertebra L5", "Sacrum"], pad: 0.45 },
};

type Item = { mesh: THREE.Mesh; sys: Sys; name: string; mat: THREE.MeshStandardMaterial; box: THREE.Box3; orig: THREE.Vector3; delta: THREE.Vector3 };

export interface ViewerProps {
  layers: Record<Sys, boolean>;
  opacity: Record<Sys, number>;
  region: FocusRegion;
  dimMode: DimMode;
  explode: number;
  isolateSelected: boolean;
  selected: string | null;
  onSelect: (meshName: string | null) => void;
  onLoaded?: (names: string[]) => void;
}
export interface ViewerHandle {
  preset: (p: Preset) => void;
  reset: () => void;
  frameNames: (names: string[]) => void;
  meshNames: () => string[];
}

function colorFor(sys: Sys, name: string) {
  const n = name.toLowerCase();
  if (sys === "vessel") return /vein|venous|sinus|vena/.test(n) ? VEIN : SYSTEMS[4].color;
  if (sys === "muscle" && /fascia|bursa|retinacul|septum|aponeur|sheath|tendon/.test(n)) return FASCIA;
  if (sys === "joint" && /disc|menisc|labrum|cartilage|symphysis|nucleus|fat pad/.test(n)) return CART;
  return SYSTEMS.find((s) => s.id === sys)!.color;
}
const ROUGH: Record<Sys, number> = { bone: 0.78, muscle: 0.55, joint: 0.6, nerve: 0.38, vessel: 0.32 };

const hasWebGL = () => {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
};

export const AnatomyViewer = forwardRef<ViewerHandle, ViewerProps>(function AnatomyViewer(props, ref) {
  const wrap = useRef<HTMLDivElement>(null);
  const cube = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props); propsRef.current = props;
  const eng = useRef<any>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [noGL, setNoGL] = useState(false);
  const [hover, setHover] = useState<{ name: string; x: number; y: number } | null>(null);
  const [orient, setOrient] = useState({ ant: 1, right: -1 });
  const [attempt, setAttempt] = useState(0);

  // ---------- setup ----------
  useEffect(() => {
    const el = wrap.current!;
    if (!hasWebGL()) { setNoGL(true); return; }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.setAttribute("aria-label", "Interactive 3D anatomy model. Drag to rotate, scroll or pinch to zoom.");
    el.prepend(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 200);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8070, 0.75));
    const key = new THREE.DirectionalLight(0xffffff, 0.9); camera.add(key); key.position.set(1, 1.5, 1);
    const rim = new THREE.DirectionalLight(0xdfe9ff, 0.35); camera.add(rim); rim.position.set(-1.5, 0.5, -1);
    scene.add(camera);
    const root = new THREE.Group(); scene.add(root);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !reduced; controls.dampingFactor = 0.12; controls.screenSpacePanning = true;
    const e = eng.current;
    (window as any).__anat = e;
    Object.assign(e, { renderer, scene, camera, controls, root, items: [] as Item[], pickables: [] as THREE.Object3D[], dirty: true, tween: null, reduced, ant: 1, right: -1, regionBox: null as THREE.Box3 | null, view: "anterior" as Preset });

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false); renderer.domElement.style.width = "100%"; renderer.domElement.style.height = "100%";
      camera.aspect = w / Math.max(h, 1); camera.updateProjectionMatrix(); e.dirty = true;
    };
    const ro = new ResizeObserver(resize); ro.observe(el); resize();
    controls.addEventListener("change", () => (e.dirty = true));

    // loading
    const draco = new DRACOLoader().setDecoderPath("/draco/");
    const loader = new GLTFLoader().setDRACOLoader(draco);
    let cancelled = false;
    const loadSys = (s: (typeof SYSTEMS)[number]) => new Promise<void>((resolve) => {
      loader.load(`/anatomy-models/${s.file}.glb`, (gltf) => {
        if (cancelled) return resolve();
        const orig = new Map<string, string>();
        for (const n of gltf.parser.json.nodes ?? []) if (n.name && n.mesh !== undefined) orig.set(THREE.PropertyBinding.sanitizeNodeName(n.name), n.name);
        gltf.scene.traverse((o) => {
          const m = o as THREE.Mesh;
          if (!m.isMesh) return;
          const name = orig.get(m.name) ?? orig.get(m.parent?.name ?? "") ?? m.name;
          const mat = new THREE.MeshStandardMaterial({ color: colorFor(s.id, name), roughness: ROUGH[s.id], metalness: 0, side: THREE.DoubleSide });
          (m.material as THREE.Material)?.dispose?.();
          m.material = mat; m.userData.anat = name; m.userData.sys = s.id;
          e.items.push({ mesh: m, sys: s.id, name, mat, box: new THREE.Box3(), orig: m.position.clone(), delta: new THREE.Vector3() });
        });
        root.add(gltf.scene);
        root.updateMatrixWorld(true);
        for (const it of e.items) if (it.box.isEmpty()) it.box.setFromObject(it.mesh);
        setProgress((p) => ({ ...p, [s.file]: 1 }));
        if (s.id === "bone") { detectOrientation(); applyRegion(true); }
        apply();
        propsRef.current.onLoaded?.(e.items.map((i: Item) => i.name));
        resolve();
      }, (ev) => { if (ev.total) setProgress((p) => ({ ...p, [s.file]: ev.loaded / ev.total })); },
      () => { setErrors((x) => [...x, s.label]); resolve(); });
    });
    loadSys(SYSTEMS[0]).then(() => Promise.all(SYSTEMS.slice(1).map(loadSys)));

    // picking
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const pick = (cx: number, cy: number): string | null => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects(e.pickables, false);
      const solid = hits.find((h) => ((h.object as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity > 0.2);
      return ((solid ?? hits[0])?.object.userData.anat as string) ?? null;
    };
    let down: { x: number; y: number } | null = null;
    let hoverQueued = false;
    const onDown = (ev: PointerEvent) => { down = { x: ev.clientX, y: ev.clientY }; };
    const onUp = (ev: PointerEvent) => {
      if (down && Math.hypot(ev.clientX - down.x, ev.clientY - down.y) < 6) propsRef.current.onSelect(pick(ev.clientX, ev.clientY));
      down = null;
    };
    const onMove = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse" || ev.buttons || hoverQueued) return;
      hoverQueued = true;
      requestAnimationFrame(() => {
        hoverQueued = false;
        const n = pick(ev.clientX, ev.clientY);
        const r = el.getBoundingClientRect();
        if (n !== e.hover) { e.hover = n; apply(); }
        setHover(n ? { name: n, x: ev.clientX - r.left, y: ev.clientY - r.top } : null);
      });
    };
    const onLeave = () => { e.hover = null; setHover(null); apply(); };
    const cvs = renderer.domElement;
    cvs.addEventListener("pointerdown", onDown); cvs.addEventListener("pointerup", onUp);
    cvs.addEventListener("pointermove", onMove); cvs.addEventListener("pointerleave", onLeave);

    // loop
    const S = new THREE.Matrix4().makeScale(1, -1, 1);
    const rot = new THREE.Matrix4();
    let raf = 0, last = performance.now();
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((t - last) / 1000, 0.05); last = t;
      if (e.tween) {
        const tw = e.tween; tw.t = Math.min(1, tw.t + dt / 0.6);
        const k = 1 - Math.pow(1 - tw.t, 3);
        camera.position.lerpVectors(tw.p0, tw.p1, k); controls.target.lerpVectors(tw.t0, tw.t1, k);
        if (tw.t >= 1) e.tween = null;
        e.dirty = true;
      }
      if (controls.update()) e.dirty = true;
      if (!e.dirty) return;
      e.dirty = false;
      renderer.render(scene, camera);
      if (cube.current) {
        rot.extractRotation(camera.matrixWorldInverse);
        const m = S.clone().multiply(rot).multiply(S);
        cube.current.style.transform = `translateZ(-40px) matrix3d(${m.elements.join(",")})`;
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelled = true; cancelAnimationFrame(raf); ro.disconnect(); controls.dispose(); draco.dispose();
      cvs.removeEventListener("pointerdown", onDown); cvs.removeEventListener("pointerup", onUp);
      cvs.removeEventListener("pointermove", onMove); cvs.removeEventListener("pointerleave", onLeave);
      root.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.geometry.dispose(); (m.material as THREE.Material).dispose(); } });
      renderer.dispose(); cvs.remove();
      eng.current = {};
    };
  }, [attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- helpers (read eng ref) ----------
  const find = (n: string) => (eng.current.items as Item[] | undefined)?.find((i) => i.name === n);
  const unionOf = (names: string[]) => {
    const b = new THREE.Box3();
    for (const n of names) for (const it of (eng.current.items ?? []) as Item[]) if (it.name === n) b.union(it.box);
    return b;
  };
  function detectOrientation() {
    const e = eng.current; const c = new THREE.Vector3(), d = new THREE.Vector3();
    const hr = find("Humerus.r"), hl = find("Humerus.l"), pa = find("Patella.r"), fe = find("Femur.r");
    if (hr && hl) e.right = Math.sign(hr.box.getCenter(c).x - hl.box.getCenter(d).x) || -1;
    if (pa && fe) e.ant = Math.sign(pa.box.getCenter(c).z - fe.box.getCenter(d).z) || 1;
    setOrient({ ant: e.ant, right: e.right });
  }
  function dirFor(p: Preset) {
    const e = eng.current;
    switch (p) {
      case "anterior": return new THREE.Vector3(0, 0, e.ant);
      case "posterior": return new THREE.Vector3(0, 0, -e.ant);
      case "lateral": return new THREE.Vector3(e.right, 0, 0);
      case "superior": return new THREE.Vector3(0, 1, 0.02 * e.ant).normalize();
    }
  }
  function frameBox(box: THREE.Box3, p?: Preset, instant = false) {
    const e = eng.current; if (!e.camera || box.isEmpty()) return;
    if (p) e.view = p;
    const size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
    const r = size.length() / 2;
    const fov = (e.camera.fov * Math.PI) / 180;
    const fit = Math.min(fov, 2 * Math.atan(Math.tan(fov / 2) * e.camera.aspect));
    const dist = (r / Math.sin(fit / 2)) * 1.02;
    const p1 = center.clone().add(dirFor(e.view)!.multiplyScalar(dist));
    e.camera.near = dist / 100; e.camera.far = dist * 20; e.camera.updateProjectionMatrix();
    e.controls.minDistance = r * 0.15; e.controls.maxDistance = dist * 6;
    if (instant || e.reduced) { e.camera.position.copy(p1); e.controls.target.copy(center); e.tween = null; e.dirty = true; }
    else e.tween = { t: 0, p0: e.camera.position.clone(), p1, t0: e.controls.target.clone(), t1: center };
  }
  function regionBox(r: FocusRegion): THREE.Box3 | null {
    if (r === "full") return null;
    const a = ANCHORS[r]; const b = unionOf(a.names);
    if (b.isEmpty()) return null;
    const s = b.getSize(new THREE.Vector3()); const m = Math.max(s.x, s.y, s.z) * a.pad;
    return b.expandByVector(new THREE.Vector3(m, m, m));
  }
  function wholeBox() { const b = new THREE.Box3(); for (const it of (eng.current.items ?? []) as Item[]) if (it.sys === "bone") b.union(it.box); return b; }
  function applyRegion(instant = false) {
    const e = eng.current; if (!e.items) return;
    const r = propsRef.current.region;
    e.regionBox = regionBox(r);
    const box = e.regionBox ?? wholeBox();
    if (r === "full" && e.view === "lateral") e.view = "anterior";
    if (r === "lumbar" && (e.view === "anterior")) e.view = "posterior";
    frameBox(box, undefined, instant);
    // explode vectors relative to the focus centre, converted into each mesh's parent space
    const c = box.getCenter(new THREE.Vector3()); const span = box.getSize(new THREE.Vector3()).length();
    const tmp = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3();
    for (const it of e.items as Item[]) {
      it.box.getCenter(tmp); const dir = tmp.clone().sub(c);
      const world = dir.multiplyScalar(span * 0.6 / Math.max(dir.length(), span * 0.1));
      const par = it.mesh.parent!;
      a.copy(tmp); b.copy(tmp).add(world); par.worldToLocal(a); par.worldToLocal(b);
      it.delta.copy(b).sub(a);
    }
  }
  function apply() {
    const e = eng.current; if (!e.items) return;
    const P = propsRef.current; const rb: THREE.Box3 | null = e.regionBox;
    const picks: THREE.Object3D[] = [];
    for (const it of e.items as Item[]) {
      const inR = !rb || rb.intersectsBox(it.box);
      const isSel = it.name === P.selected;
      let vis = P.layers[it.sys] && (P.dimMode !== "isolate" || inR);
      if (P.isolateSelected && P.selected) vis = isSel;
      it.mesh.visible = vis;
      if (!vis) continue;
      picks.push(it.mesh);
      const op = P.isolateSelected ? 1 : P.opacity[it.sys] * (P.dimMode === "dim" && !inR ? 0.08 : 1);
      it.mat.opacity = op; it.mat.transparent = op < 0.995; it.mat.depthWrite = op >= 0.995;
      it.mat.emissive.copy(isSel || it.name === e.hover ? HILITE : new THREE.Color(0));
      it.mat.emissiveIntensity = isSel ? 0.6 : 0.28;
      it.mesh.renderOrder = it.mat.transparent ? 1 : 0;
      const k = inR ? P.explode : 0;
      it.mesh.position.copy(it.orig).addScaledVector(it.delta, k);
    }
    e.pickables = picks; e.dirty = true;
  }

  useEffect(() => { applyRegion(); apply(); }, [props.region]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { apply(); }, [props.layers, props.opacity, props.dimMode, props.explode, props.isolateSelected, props.selected]); // eslint-disable-line react-hooks/exhaustive-deps

  useImperativeHandle(ref, () => ({
    preset: (p) => { eng.current.view = p; frameBox(eng.current.regionBox ?? wholeBox(), p); },
    reset: () => { eng.current.view = propsRef.current.region === "lumbar" ? "posterior" : "anterior"; applyRegion(); },
    frameNames: (names) => {
      const b = unionOf(names); if (b.isEmpty()) return;
      const s = b.getSize(new THREE.Vector3()); const m = Math.max(s.x, s.y, s.z) * 0.6;
      frameBox(b.expandByVector(new THREE.Vector3(m, m, m)));
    },
    meshNames: () => ((eng.current.items ?? []) as Item[]).map((i) => i.name),
  }));

  const files = SYSTEMS.map((s) => progress[s.file] ?? 0);
  const total = files.reduce((a, b) => a + b, 0) / SYSTEMS.length;
  const boneReady = (progress.skeletal ?? 0) >= 1;
  const faces: [string, string, string][] = [
    [orient.ant > 0 ? "A" : "P", "rotateY(0deg)", orient.ant > 0 ? "anterior" : "posterior"],
    [orient.ant > 0 ? "P" : "A", "rotateY(180deg)", orient.ant > 0 ? "posterior" : "anterior"],
    [orient.right > 0 ? "R" : "L", "rotateY(90deg)", "lateral"],
    [orient.right > 0 ? "L" : "R", "rotateY(-90deg)", ""],
    ["S", "rotateX(90deg)", "superior"],
    ["I", "rotateX(-90deg)", ""],
  ];

  if (noGL) return (
    <div role="alert" className="flex h-full min-h-[360px] items-center justify-center rounded-lg bg-secondary p-6 text-center text-sm text-foreground">
      This interactive 3D anatomy viewer needs WebGL, which is turned off or unsupported in this browser. Try a current version of Chrome, Safari, Edge or Firefox with hardware acceleration enabled.
    </div>
  );

  return (
    <div ref={wrap} className="relative h-full w-full overflow-hidden rounded-lg bg-gradient-to-b from-secondary/60 to-background">
      {!boneReady && errors.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" role="status">
          <p className="text-sm font-semibold text-foreground">Loading 3D anatomy… {Math.round(total * 100)}%</p>
          <div className="h-1.5 w-48 overflow-hidden rounded-full bg-border"><div className="h-full bg-primary transition-all" style={{ width: `${total * 100}%` }} /></div>
        </div>
      )}
      {boneReady && total < 1 && (
        <p className="absolute left-3 top-3 rounded bg-card/90 px-2 py-1 text-xs text-muted-foreground" role="status">Loading remaining systems… {Math.round(total * 100)}%</p>
      )}
      {errors.length > 0 && (
        <div role="alert" className="absolute left-3 top-3 max-w-xs rounded-md border border-destructive bg-card p-3 text-xs text-foreground">
          Could not load: {errors.join(", ")}.{" "}
          <button className="font-semibold text-primary underline" onClick={() => { setErrors([]); setProgress({}); setAttempt((a) => a + 1); }}>Retry</button>
        </div>
      )}
      {hover && (
        <div className="pointer-events-none absolute z-10 rounded bg-foreground px-2 py-1 text-xs font-semibold text-background shadow" style={{ left: hover.x + 14, top: hover.y + 10 }}>{baseName(hover.name)}</div>
      )}
      {/* Orientation cube */}
      <div className="absolute right-3 top-3 h-[64px] w-[64px]" style={{ perspective: 400 }} aria-label="Orientation cube">
        <div ref={cube} className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
          {faces.map(([l, tr, p]) => (
            <button key={l} disabled={!p} onClick={() => p && (eng.current.view = p as Preset, frameBox(eng.current.regionBox ?? wholeBox(), p as Preset))}
              aria-label={p ? `${p} view` : undefined} tabIndex={-1}
              className="absolute inset-0 flex items-center justify-center border border-primary/60 bg-card/85 text-sm font-bold text-foreground"
              style={{ transform: `${tr} translateZ(32px)`, backfaceVisibility: "hidden" }}>{l}</button>
          ))}
        </div>
      </div>
      {/* Legend */}
      <ul className="pointer-events-none absolute bottom-3 left-3 space-y-0.5 rounded-md bg-card/90 px-2.5 py-2 text-[11px] text-foreground shadow-sm">
        {SYSTEMS.map((s) => (
          <li key={s.id} className="flex items-center gap-1.5"><span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />{s.label}{s.id === "vessel" && <><span aria-hidden className="ml-1 h-2.5 w-2.5 rounded-full" style={{ background: VEIN }} />veins</>}</li>
        ))}
      </ul>
    </div>
  );
});
