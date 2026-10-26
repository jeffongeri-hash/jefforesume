export type Layer = "skeleton" | "superficial" | "deep" | "connective" | "neurovascular";

/** Tissue drives colour; layer is derived from tissue. */
export type Tissue =
  | "bone" | "cartilage" | "fibrocartilage" | "space"
  | "muscleSuperficial" | "muscleDeep"
  | "ligament" | "tendon" | "capsule" | "bursa" | "fascia"
  | "nerve" | "artery" | "vein";

export interface StructureInfo {
  id: string;
  name: string;
  tissue: Tissue;
  // Muscles
  origin?: string;
  insertion?: string;
  innervation?: string;
  // Bones / joints / ligaments
  attachments?: string;
  articulation?: string;
  nv?: string;
  // Nerves / vessels
  course?: string;
  supplies?: string;
  // All
  role: string;
  relations: string;
  clinical: string;
}

export interface Shape {
  s: string; // structure id
  d: string; // SVG path
  at: [number, number]; // leader-line anchor
  w?: number; // render as a cord/band of this stroke width
  dash?: boolean;
}

export interface Exam {
  palpation: string[];
  movement: string[];
  danger: string[];
  tests: string[];
}

export interface View {
  id: string;
  name: string;
  caption: string;
  orientation: [string, string]; // [left edge, right edge] of the drawing
  shapes: Shape[];
  exam: Exam;
}

export interface Region {
  id: string;
  name: string;
  structures: StructureInfo[];
  views: View[];
}

export const ell = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx},${cy} a${rx},${ry} 0 1,0 ${rx * 2},0 a${rx},${ry} 0 1,0 ${-rx * 2},0Z`;

/** Build a path for both sides of a midline at x=250. */
export const both = (f: (m: (x: number) => number) => string) => f((x) => x) + " " + f((x) => 500 - x);

export const LAYERS: { id: Layer; label: string }[] = [
  { id: "skeleton", label: "Skeleton & articular surfaces" },
  { id: "deep", label: "Deep muscles" },
  { id: "connective", label: "Ligaments, tendons & capsule" },
  { id: "superficial", label: "Superficial muscles" },
  { id: "neurovascular", label: "Nerves & vessels" },
];

export const LAYER_OF: Record<Tissue, Layer> = {
  bone: "skeleton", cartilage: "skeleton", fibrocartilage: "skeleton", space: "skeleton",
  muscleSuperficial: "superficial", muscleDeep: "deep",
  ligament: "connective", tendon: "connective", capsule: "connective", bursa: "connective", fascia: "connective",
  nerve: "neurovascular", artery: "neurovascular", vein: "neurovascular",
};

export const FIELD_LABELS: [keyof StructureInfo, string][] = [
  ["origin", "Origin"],
  ["insertion", "Insertion"],
  ["innervation", "Innervation"],
  ["attachments", "Attachments"],
  ["articulation", "Articulation"],
  ["course", "Course"],
  ["supplies", "Supplies / drains"],
  ["role", "Action / biomechanical role"],
  ["nv", "Neurovascular relationships"],
  ["relations", "Key relationships"],
  ["clinical", "High-yield clinical relevance"],
];
