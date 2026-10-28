import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Button } from "@/components/ui/button";
import { isRightShoulderMesh } from "@/data/msk/shoulderSpecialist";
import { isRightArmMesh } from "@/data/msk/armSpecialist";
import { isRightElbowForearmMesh } from "@/data/msk/elbowForearmSpecialist";
import { isNeckMesh } from "@/data/msk/neckSpecialist";
import { isRightWristHandMesh } from "@/data/msk/wristHandSpecialist";
import { isBackMesh, type BackLevel } from "@/data/msk/backSpineSpecialist";
import { isHipPelvisMesh, type HipSide } from "@/data/msk/hipPelvisSpecialist";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export type Sys = "bone" | "muscle" | "joint" | "nerve" | "vessel";
export type FocusRegion = "full" | "shoulder" | "knee" | "lumbar" | "arm" | "elbow" | "forearm" | "wrist-hand" | "digits" | "elbow-forearm" | "neck" | "back" | "hip-pelvis";
export type Preset = "anterior" | "posterior" | "lateral" | "superior";
export type LabelMode = "selected" | "hover" | "off";
export type DimMode = "none" | "dim" | "isolate";

// Anatomical illustration palette (content colours, not UI chrome)
export const SYSTEMS: { id: Sys; file: string; label: string; color: string }[] = [
  { id: "bone", file: "skeletal", label: "Bone", color: "#e9dfc8" },
  { id: "muscle", file: "muscular", label: "Muscle", color: "#9e3a33" },
  { id: "joint", file: "joints", label: "Joints & ligaments", color: "#d9c58a" },
  { id: "nerve", file: "nervous", label: "Nerves", color: "#e6b81c" },
  { id: "vessel", file: "cardiovascular", label: "Vessels", color: "#c62a30" },
];
const VEIN = "#3c5ca8", CART = "#bcdbe6", FASCIA = "#d8c9a6";
const HILITE = new THREE.Color("#12a4c9");

const MODEL_CACHE = new Map<string, Promise<GLTF>>();

const ANCHORS: Record<Exclude<FocusRegion, "full">, { names: string[]; pad: number }> = {
  neck: { names: ["Atlas (C1)", "Axis (C2)", "Vertebra C3", "Vertebra C4", "Vertebra C5", "Vertebra C6", "Vertebra C7", "Vertebra T1"], pad: 0.1 },
  back: { names: ["Atlas (C1)", "Vertebra C7", "Vertebra T6", "Vertebra T12", "Vertebra L3", "Vertebra L5", "Sacrum"], pad: 0.25 },
  "hip-pelvis": { names: ["Hip bone.r", "Hip bone.l", "Sacrum", "Coccyx", "Femur.r", "Femur.l"], pad: 0.2 },
  shoulder: { names: ["Scapula.r", "Clavicle.r", "Articular capsule of glenohumeral joint.r", "Glenoid labrum.r"], pad: 0.35 },
  arm: { names: ["Humerus.r"], pad: 0.12 },
  elbow: { names: ["Articular capsule of elbow joint.r"], pad: 0.3 },
  forearm: { names: ["Radius.r", "Ulna.r"], pad: 0.12 },
  "elbow-forearm": { names: ["Radius.r", "Ulna.r"], pad: 0.1 },
  "wrist-hand": { names: ["Scaphoid bone.r", "Hamate bone.r", "First metacarpal bone.r", "Fifth metacarpal bone.r", "Proximal phalanx of third finger of hand.r"], pad: 0.2 },
  digits: { names: ["Proximal phalanx of first finger of hand.r", "Distal phalanx of first finger of hand.r", "Proximal phalanx of fifth finger of hand.r", "Distal phalanx of fifth finger of hand.r", "Distal phalanx of third finger of hand.r"], pad: 0.12 },
  knee: { names: ["Patella.r", "Articular capsule of knee joint.r", "Medial meniscus.r", "Lateral meniscus.r", "Fibular collateral ligament.r"], pad: 0.4 },
  lumbar: { names: ["Vertebra L1", "Vertebra L2", "Vertebra L3", "Vertebra L4", "Vertebra L5", "Sacrum"], pad: 0.45 },
};

type Item = { mesh: THREE.Mesh; sys: Sys; name: string; mat: THREE.MeshStandardMaterial; box: THREE.Box3; orig: THREE.Vector3; delta: THREE.Vector3; sheet: boolean };

export interface ViewerProps {
  layers: Record<Sys, boolean>;
  opacity: Record<Sys, number>;
  region: FocusRegion;
  dimMode: DimMode;
  explode: number;
  isolateSelected: boolean;
  selected: string | null;
  labels?: LabelMode;
  specialistShoulder?: boolean;
  specialistArm?: boolean;
  specialistElbowForearm?: boolean;
  specialistWristHand?: boolean;
  specialistNeck?: boolean;
  specialistBack?: boolean;
  backLevel?: BackLevel;
  specialistHipPelvis?: boolean;
  hipSide?: HipSide;
  onSelect: (meshName: string | null) => void;
  onLoaded?: (names: string[]) => void;
}
export interface ViewerHandle {
  preset: (p: Preset) => void;
  reset: () => void;
  frameNames: (names: string[]) => void;
  meshNames: () => string[];
  meshSystem: (name: string) => Sys | null;
}

function colorFor(sys: Sys, name: string) {
  const n = name.toLowerCase();
  if (sys === "vessel") return /vein|venous|sinus|vena/.test(n) ? VEIN : SYSTEMS[4].color;
  if (sys === "muscle" && /fascia|bursa|retinacul|septum|aponeur|sheath|tendon/.test(n)) return FASCIA;
  if (sys === "joint" && /disc|menisc|labrum|cartilage|symphysis|nucleus|fat pad/.test(n)) return CART;
  return SYSTEMS.find((s) => s.id === sys)?.color ?? SYSTEMS[0].color;
}
const ROUGH: Record<Sys, number> = { bone: 0.78, muscle: 0.55, joint: 0.6, nerve: 0.38, vessel: 0.32 };

const hasWebGL = () => {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
};

export const AnatomyViewer = forwardRef<ViewerHandle, ViewerProps>(function AnatomyViewer(props, ref) {
  const wrap = useRef<HTMLDivElement>(null);
  const cube = useRef<HTMLDivElement>(null);
  const hoverBadge = useRef<HTMLDivElement>(null);
  const selectedBadge = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props); propsRef.current = props;
  const eng = useRef<any>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [noGL, setNoGL] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [orient, setOrient] = useState({ ant: 1, right: -1 });
  const [attempt, setAttempt] = useState(0);

  // ---------- setup ----------
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (!hasWebGL()) { setNoGL(true); return; }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: true, powerPreference: "high-performance" }); }
    catch { setNoGL(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.setAttribute("aria-label", "Interactive 3D anatomy model. Drag to rotate, scroll or pinch to zoom.");
    el.prepend(renderer.domElement);
    renderer.localClippingEnabled = true;
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
    const loadSys = async (s: (typeof SYSTEMS)[number]) => {
      const url = `/anatomy-models/${s.file}.glb`;
      try {
        let pending = MODEL_CACHE.get(url);
        if (!pending) {
          pending = new Promise<GLTF>((resolve, reject) => loader.load(url, resolve,
            (ev) => { if (!cancelled && ev.total) setProgress(p => ({...p,[s.file]:ev.loaded/ev.total})); }, reject));
          MODEL_CACHE.set(url, pending);
        }
        const gltf = await pending;
        if (cancelled) return;
        const orig = new Map<string, string>();
        for (const n of gltf.parser.json.nodes ?? []) if (n.name && n.mesh !== undefined) orig.set(THREE.PropertyBinding.sanitizeNodeName(n.name), n.name);
        const instance = gltf.scene.clone(true);
        instance.traverse((o) => {
          const m = o as THREE.Mesh;
          if (!m.isMesh) return;
          const name = orig.get(m.name) ?? orig.get(m.parent?.name ?? "") ?? m.name;
          const mat = new THREE.MeshStandardMaterial({ color: colorFor(s.id, name), roughness: ROUGH[s.id], metalness: 0, side: THREE.DoubleSide });
          m.material = mat; m.userData.anat = name; m.userData.sys = s.id;
          e.items.push({ mesh: m, sys: s.id, name, mat, box: new THREE.Box3(), orig: m.position.clone(), delta: new THREE.Vector3(), sheet: /fascia|septum|retinacul|aponeur|tract$/i.test(name) && !/iliotibial/i.test(name) });
        });
        root.add(instance); root.updateMatrixWorld(true);
        for (const it of e.items) if (it.box.isEmpty()) it.box.setFromObject(it.mesh);
        setProgress(p => ({...p,[s.file]:1}));
        if (s.id === "bone") detectOrientation();
        if (s.id === "bone" || s.id === "joint") applyRegion(true);
        apply(); propsRef.current.onLoaded?.(e.items.map((i: Item) => i.name));
      } catch {
        MODEL_CACHE.delete(url);
        if (!cancelled) setErrors(x => [...x,s.label]);
      }
    };
    loadSys(SYSTEMS[0]).then(() => Promise.all(SYSTEMS.slice(1).map(loadSys)));

    // picking
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const pick = (cx: number, cy: number): string | null => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects(e.pickables, false);
      const visibleHits = hits.filter(h => {
        const mat = (h.object as THREE.Mesh).material as THREE.MeshStandardMaterial;
        return mat.opacity > 0.2 && !(mat.clippingPlanes ?? []).some(p => p.distanceToPoint(h.point) < 0);
      });
      const hit = visibleHits[0];
      if (hit) e.hoverPoint = hit.object.worldToLocal(hit.point.clone());
      return (hit?.object.userData.anat as string) ?? null;
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
        if (n !== e.hover) { e.hover = n; apply(); }
        setHover(n);
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
      const updateBadge = (badge: HTMLDivElement | null, name: string | null, hovering: boolean) => {
        if (!badge || !name) return;
        const item = find(name);
        if (!item || !item.mesh.visible || (hovering && name === propsRef.current.selected)) { badge.style.visibility = "hidden"; return; }
        const point = hovering && e.hoverPoint ? item.mesh.localToWorld(e.hoverPoint.clone()) : new THREE.Box3().setFromObject(item.mesh).getCenter(new THREE.Vector3());
        if (e.regionBox && propsRef.current.dimMode === "isolate") point.clamp(e.regionBox.min, e.regionBox.max);
        point.project(camera);
        if (point.z < -1 || point.z > 1) { badge.style.visibility = "hidden"; return; }
        const x = (point.x + 1) * el.clientWidth / 2, y = (1 - point.y) * el.clientHeight / 2;
        const bx = Math.max(8, Math.min(el.clientWidth - badge.offsetWidth - 8, x + 24));
        const by = Math.max(80, Math.min(el.clientHeight - badge.offsetHeight - 90, y - 36));
        badge.style.visibility = "visible"; badge.style.left = `${bx}px`; badge.style.top = `${by}px`;
        const line = badge.firstElementChild as HTMLElement | null;
        if (line) {
          const dx = x-bx, dy = y-by;
          line.style.width = `${Math.hypot(dx,dy)}px`;
          line.style.transform = `rotate(${Math.atan2(dy,dx)}rad)`;
        }
      };
      updateBadge(selectedBadge.current, propsRef.current.selected, false);
      updateBadge(hoverBadge.current, e.hover, true);
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
      root.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { (m.material as THREE.Material).dispose(); } });
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
    const dist = propsRef.current.specialistShoulder || propsRef.current.specialistArm || propsRef.current.specialistElbowForearm || propsRef.current.specialistWristHand || propsRef.current.specialistNeck || propsRef.current.specialistBack || propsRef.current.specialistHipPelvis
      ? Math.max(size.y, size.x / e.camera.aspect) / (2 * Math.tan(fov / 2)) * 1.15 + size.z * 0.5
      : (r / Math.sin(fit / 2)) * 1.02;
    const p1 = center.clone().add(dirFor(e.view).multiplyScalar(dist));
    e.camera.near = dist / 100; e.camera.far = dist * 20; e.camera.updateProjectionMatrix();
    e.controls.minDistance = r * 0.15; e.controls.maxDistance = dist * 6;
    if (instant || e.reduced) { e.camera.position.copy(p1); e.controls.target.copy(center); e.tween = null; e.dirty = true; }
    else e.tween = { t: 0, p0: e.camera.position.clone(), p1, t0: e.controls.target.clone(), t1: center };
  }
  function regionBox(r: FocusRegion): THREE.Box3 | null {
    if (r === "full") return null;
    const a = ANCHORS[r]; const b = unionOf(a.names);
    if (r === "neck" && propsRef.current.specialistNeck && !b.isEmpty()) {
      // Vertebral anchors set inferior extent; skull is cropped, never used whole as a camera anchor.
      const cervical = b.getSize(new THREE.Vector3());
      const occiput = find("Occipital bone");
      const atlas = find("Atlas (C1)");
      if (occiput && atlas) b.max.y = Math.min(occiput.box.max.y, atlas.box.max.y + cervical.y * 0.38);
      const h = b.max.y - b.min.y;
      b.min.x -= h * 0.48; b.max.x += h * 0.48;
      b.min.z -= h * 0.24; b.max.z += h * 0.32;
      b.min.y -= h * 0.04;
      return b;
    }
    if (r === "back" && propsRef.current.specialistBack) {
      // Posterior axial column, framed per selected level; skull is cropped, never used whole as an anchor.
      const level = propsRef.current.backLevel ?? "whole";
      const C = ["Atlas (C1)", "Axis (C2)", "Vertebra C3", "Vertebra C4", "Vertebra C5", "Vertebra C6", "Vertebra C7", "Vertebra T1"];
      const T = ["Vertebra T1", "Vertebra T2", "Vertebra T3", "Vertebra T4", "Vertebra T5", "Vertebra T6", "Vertebra T7", "Vertebra T8", "Vertebra T9", "Vertebra T10", "Vertebra T11", "Vertebra T12"];
      const L = ["Vertebra T12", "Vertebra L1", "Vertebra L2", "Vertebra L3", "Vertebra L4", "Vertebra L5", "Sacrum", "Coccyx", "Hip bone.r", "Hip bone.l"];
      const bb = level === "cervical" ? unionOf(C) : level === "thoracic" ? unionOf(T) : level === "lumbar" ? unionOf(L) : unionOf([...C, ...T, ...L]);
      if (bb.isEmpty()) return null;
      const occiput = find("Occipital bone"); const atlas = find("Atlas (C1)");
      if ((level === "cervical" || level === "whole") && occiput && atlas) {
        const cv = bb.getSize(new THREE.Vector3()).y;
        bb.max.y = Math.min(occiput.box.max.y, atlas.box.max.y + cv * 0.38);
      }
      const h = bb.max.y - bb.min.y;
      bb.min.x -= h * 0.5; bb.max.x += h * 0.5;
      bb.min.z -= h * 0.3; bb.max.z += h * 0.3;
      bb.min.y -= h * 0.05; bb.max.y += h * 0.05;
      return bb;
    }
    if (r === "hip-pelvis" && propsRef.current.specialistHipPelvis) {
      // Bilateral pelvis + proximal femora; side tabs crop to one hip, keeping the sacral midline.
      const side = propsRef.current.hipSide ?? "whole";
      const bones = (suffix: string) => [`Hip bone.${suffix}`, `Femur.${suffix}`];
      const names = side === "whole" ? ["Hip bone.r", "Hip bone.l", "Sacrum", "Coccyx", "Femur.r", "Femur.l"] : ["Sacrum", "Coccyx", ...bones(side === "right" ? "r" : "l")];
      const bb = unionOf(names);
      if (bb.isEmpty()) return null;
      // Keep only the proximal ~45% of the femur(a) by raising the box bottom.
      for (const n of names.filter((n) => n.startsWith("Femur"))) {
        const it = find(n);
        if (it) bb.min.y = Math.max(bb.min.y, it.box.max.y - (it.box.max.y - it.box.min.y) * 0.45);
      }
      const h = bb.max.y - bb.min.y;
      bb.min.y -= h * 0.06; bb.max.y += h * 0.08;
      bb.min.z -= h * 0.22; bb.max.z += h * 0.22;
      if (side === "whole") { bb.min.x -= h * 0.18; bb.max.x += h * 0.18; }
      else {
        // Side view: crop just past the sacral midline toward the focused hip.
        const sacrum = find("Sacrum");
        const midX = sacrum ? sacrum.box.getCenter(new THREE.Vector3()).x : (bb.min.x + bb.max.x) / 2;
        const rightSign = e.right; // +1 or -1 depending on model orientation
        if ((side === "right") === (rightSign > 0)) { bb.min.x = Math.max(bb.min.x, midX - h * 0.12); bb.max.x += h * 0.2; }
        else { bb.max.x = Math.min(bb.max.x, midX + h * 0.12); bb.min.x -= h * 0.2; }
      }
      return bb;
    }
    if (r === "shoulder" && propsRef.current.specialistShoulder) {
      const humerus = find("Humerus.r");
      if (humerus) { const proximal = humerus.box.clone(); proximal.min.y = proximal.max.y - (proximal.max.y-proximal.min.y)*0.35; b.union(proximal); }
      return b.isEmpty() ? null : b.expandByScalar(b.getSize(new THREE.Vector3()).length()*0.045);
    }
    if (r === "elbow-forearm" && propsRef.current.specialistElbowForearm && !b.isEmpty()) {
      const humerus = find("Humerus.r");
      if (humerus) { const distal = humerus.box.clone(); distal.max.y = distal.min.y + (distal.max.y-distal.min.y)*0.22; b.union(distal); }
      const t = (b.max.y-b.min.y)*0.1;
      b.min.x -= t; b.max.x += t; b.min.z -= t; b.max.z += t;
      return b;
    }
    if (r === "wrist-hand" && propsRef.current.specialistWristHand) {
      const hand = unionOf(["Scaphoid bone.r", "Lunate bone.r", "Triquetrum bone.r", "Pisiform bone.r", "Trapezium bone.r", "Trapezoid bone.r", "Capitate bone.r", "Hamate bone.r", "First metacarpal bone.r", "Second metacarpal bone.r", "Third metacarpal bone.r", "Fourth metacarpal bone.r", "Fifth metacarpal bone.r"]);
      if (hand.isEmpty()) return null;
      const h = hand.max.y - hand.min.y;
      for (const n of ["Radius.r", "Ulna.r"]) { const it = find(n); if (it) { const d = it.box.clone(); d.max.y = d.min.y + (d.max.y - d.min.y) * 0.2; hand.union(d); } }
      hand.min.y -= h * 0.04; // just past the metacarpal heads (knuckles); digits stay for a later module
      const t = h * 0.12; hand.min.x -= t; hand.max.x += t; hand.min.z -= t; hand.max.z += t;
      return hand;
    }
    if (r === "arm" && propsRef.current.specialistArm && !b.isEmpty()) {
      const height = b.max.y-b.min.y;
      b.max.y -= height*0.09;
      const transverse = height*0.12;
      b.min.x -= transverse; b.max.x += transverse; b.min.z -= transverse; b.max.z += transverse;
      return b;
    }
    if (b.isEmpty()) return null;
    const s = b.getSize(new THREE.Vector3()); const m = Math.max(s.x, s.y, s.z) * a.pad;
    return b.expandByVector(new THREE.Vector3(m, m, m));
  }
  function wholeBox() { const b = new THREE.Box3(); for (const it of (eng.current.items ?? []) as Item[]) if (it.sys === "bone") b.union(it.box); return b; }
  function applyRegion(instant = false) {
    const e = eng.current; if (!e.items) return;
    const r = propsRef.current.region;
    e.regionBox = regionBox(r);
    const tight = propsRef.current.specialistShoulder || propsRef.current.specialistArm || propsRef.current.specialistElbowForearm || propsRef.current.specialistWristHand || propsRef.current.specialistNeck || propsRef.current.specialistBack ? e.regionBox?.clone() : r === "full" ? null : unionOf(ANCHORS[r].names);
    if (tight && !tight.isEmpty()) { const s = tight.getSize(new THREE.Vector3()); const m = Math.max(s.x, s.y, s.z) * 0.12; tight.expandByVector(new THREE.Vector3(m, m, m)); }
    const box = tight && !tight.isEmpty() ? tight : e.regionBox ?? wholeBox();
    e.frame = box;
    e.clip = e.regionBox ? [
      new THREE.Plane(new THREE.Vector3(1,0,0),-e.regionBox.min.x),new THREE.Plane(new THREE.Vector3(-1,0,0),e.regionBox.max.x),
      new THREE.Plane(new THREE.Vector3(0,1,0),-e.regionBox.min.y),new THREE.Plane(new THREE.Vector3(0,-1,0),e.regionBox.max.y),
      new THREE.Plane(new THREE.Vector3(0,0,1),-e.regionBox.min.z),new THREE.Plane(new THREE.Vector3(0,0,-1),e.regionBox.max.z),
    ] : [];
    if (r === "full" && e.view === "lateral") e.view = "anterior";
    if ((r === "lumbar" || r === "back") && (e.view === "anterior")) e.view = "posterior";
    frameBox(box, undefined, instant);
    // explode vectors relative to the focus centre, converted into each mesh's parent space
    const c = box.getCenter(new THREE.Vector3()); const span = box.getSize(new THREE.Vector3()).length();
    const tmp = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3();
    for (const it of e.items as Item[]) {
      it.box.getCenter(tmp); const dir = tmp.clone().sub(c);
      const world = dir.multiplyScalar(span * 0.6 / Math.max(dir.length(), span * 0.1));
      const par = it.mesh.parent;
      if (!par) continue;
      a.copy(tmp); b.copy(tmp).add(world); par.worldToLocal(a); par.worldToLocal(b);
      it.delta.copy(b).sub(a);
    }
  }
  function apply() {
    const e = eng.current; if (!e.items) return;
    const P = propsRef.current; const rb: THREE.Box3 | null = e.regionBox;
    const picks: THREE.Object3D[] = [];
    for (const it of e.items as Item[]) {
      const upper = /arm|elbow|forearm|wrist-hand|digits/.test(P.region);
      const unrelated = /pectoralis|serratus|latissimus|trapezius|rib|sternum|vertebra|intercostal|thoracic|abdominal/.test(it.name.toLowerCase());
      const inR = (!rb || rb.intersectsBox(it.box)) && (!upper || (!it.name.endsWith(".l") && !unrelated)) && (!P.specialistShoulder || isRightShoulderMesh(it.name)) && (!P.specialistArm || isRightArmMesh(it.name)) && (!P.specialistElbowForearm || isRightElbowForearmMesh(it.name)) && (!P.specialistWristHand || isRightWristHandMesh(it.name)) && (!P.specialistNeck || isNeckMesh(it.name)) && (!P.specialistBack || isBackMesh(it.name));
      it.mat.clippingPlanes = (P.specialistNeck || P.specialistBack || (P.dimMode === "isolate" && !P.isolateSelected)) ? e.clip : [];
      const isSel = it.name === P.selected;
      let vis = P.layers[it.sys] && (P.dimMode !== "isolate" || inR);
      if (P.isolateSelected && P.selected) vis = isSel && (!P.specialistNeck || inR);
      it.mesh.visible = vis;
      if (!vis) continue;
      picks.push(it.mesh);
      const op = P.isolateSelected ? 1 : P.opacity[it.sys] * (it.sheet && !isSel ? 0.12 : 1) * (P.dimMode === "dim" && !inR ? 0.08 : 1);
      it.mat.opacity = op; it.mat.transparent = op < 0.995; it.mat.depthWrite = op >= 0.995;
      it.mat.emissive.copy(isSel || it.name === e.hover ? HILITE : new THREE.Color(0));
      it.mat.emissiveIntensity = isSel ? 0.6 : 0.28;
      it.mesh.renderOrder = it.mat.transparent ? 1 : 0;
      const k = inR ? P.explode : 0;
      it.mesh.position.copy(it.orig).addScaledVector(it.delta, k);
    }
    e.pickables = picks; e.dirty = true;
  }

  useEffect(() => { applyRegion(); apply(); }, [props.region, props.specialistShoulder, props.specialistArm, props.specialistElbowForearm, props.specialistWristHand, props.specialistNeck, props.specialistBack, props.backLevel]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { apply(); }, [props.layers, props.opacity, props.dimMode, props.explode, props.isolateSelected, props.selected, props.labels]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { eng.current.dirty = true; });

  useImperativeHandle(ref, () => ({
    preset: (p) => { eng.current.view = p; frameBox(eng.current.frame ?? wholeBox(), p); },
    reset: () => { eng.current.view = propsRef.current.region === "lumbar" || propsRef.current.region === "back" ? "posterior" : "anterior"; applyRegion(); },
    frameNames: (names) => {
      const b = unionOf(names); if (b.isEmpty()) return;
      if (eng.current.regionBox && propsRef.current.dimMode === "isolate") b.intersect(eng.current.regionBox);
      if (b.isEmpty()) return;
      const s = b.getSize(new THREE.Vector3()); const m = Math.max(s.x, s.y, s.z) * 0.25;
      frameBox(b.expandByVector(new THREE.Vector3(m, m, m)));
    },
    meshSystem: (name) => find(name)?.sys ?? null,
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
          <Button variant="link" className="font-semibold text-primary underline" onClick={() => { setErrors([]); setProgress({}); setAttempt((a) => a + 1); }}>Retry</Button>
        </div>
      )}
      {props.labels !== "off" && props.selected && (
        <div ref={selectedBadge} data-testid="selected-mesh-label" className="pointer-events-none absolute z-20 max-w-[min(260px,75%)] rounded border border-primary bg-card/95 px-3 py-2 text-xs text-foreground shadow-md">
          <span aria-hidden className="absolute left-0 top-0 origin-left border-t border-primary" />
          <span className="block text-[10px] font-semibold uppercase text-primary">Selected</span>
          <span className="relative break-words font-semibold">{props.selected}</span>
        </div>
      )}
      {props.labels === "hover" && hover && hover !== props.selected && (
        <div ref={hoverBadge} data-testid="hover-mesh-label" className="pointer-events-none absolute z-10 max-w-[min(260px,75%)] rounded border border-border bg-card/95 px-3 py-2 text-xs font-semibold text-foreground shadow-md">
          <span aria-hidden className="absolute left-0 top-0 origin-left border-t border-primary" />
          <span className="relative break-words">{hover}</span>
        </div>
      )}
      {/* Orientation cube */}
      <div className="absolute right-3 top-3 h-[64px] w-[64px]" style={{ perspective: 400 }} aria-label="Orientation cube">
        <div ref={cube} className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
          {faces.map(([l, tr, p]) => (
            <Button variant="outline" key={l} disabled={!p} onClick={() => p && (eng.current.view = p as Preset, frameBox(eng.current.frame ?? wholeBox(), p as Preset))}
              aria-label={p ? `${p} view` : undefined} tabIndex={-1}
              className="absolute inset-0 h-full w-full p-0 flex items-center justify-center border border-primary/60 bg-card/85 text-sm font-bold text-foreground"
              style={{ transform: `${tr} translateZ(32px)`, backfaceVisibility: "hidden" }}>{l}</Button>
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
