// Tiny helpers for quadratic-segment paths so flow particles can follow drawn vessels.
export type Pt = [number, number];
export type QPath = { start: Pt; segs: [Pt, Pt][] };

export const qd = (p: QPath) => `M ${p.start[0]} ${p.start[1]} ` + p.segs.map(([c, e]) => `Q ${c[0]} ${c[1]} ${e[0]} ${e[1]}`).join(' ');

/** Point at fraction f (0–1) along the path, splitting time evenly between segments. */
export function qAt(p: QPath, f: number): Pt {
  const n = p.segs.length;
  const x = Math.max(0, Math.min(0.9999, f)) * n;
  const i = Math.floor(x), t = x - i;
  const s = i === 0 ? p.start : p.segs[i - 1][1];
  const [c, e] = p.segs[i];
  const u = 1 - t;
  return [u * u * s[0] + 2 * u * t * c[0] + t * t * e[0], u * u * s[1] + 2 * u * t * c[1] + t * t * e[1]];
}

export const polar = (cx: number, cy: number, r: number, deg: number): Pt => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];

/** Annular sector between radii r1<r2 from a0 to a1 degrees (clockwise in SVG space). */
export function sector(cx: number, cy: number, r1: number, r2: number, a0: number, a1: number) {
  const [x1, y1] = polar(cx, cy, r2, a0), [x2, y2] = polar(cx, cy, r2, a1), [x3, y3] = polar(cx, cy, r1, a1), [x4, y4] = polar(cx, cy, r1, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r2} ${r2} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 ${large} 0 ${x4} ${y4} Z`;
}
