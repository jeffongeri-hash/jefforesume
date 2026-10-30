import type { KeyboardEvent } from 'react';

export const pv = (n: string, a = 1) => `hsl(var(--patho-${n}) / ${a})`;
export const rnd = (i: number, k: number) => { const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s); };

export function makeHit<S extends string>(structures: Record<S, { label: string }>, selected: S | null, onSelect: (id: S) => void, compact?: boolean) {
  return (id: S) => ({
    role: 'button', tabIndex: compact ? -1 : 0, 'aria-label': `${structures[id].label}: show explanation`, 'aria-pressed': selected === id,
    onClick: () => onSelect(id), onKeyDown: (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(id); } },
    className: 'patho-hit cursor-pointer outline-none', 'data-structure': id,
  });
}

export function Label({ show, x, y, children, anchor = 'start', size = 12 }: { show: boolean; x: number; y: number; children: string; anchor?: 'start' | 'end' | 'middle'; size?: number }) {
  if (!show) return null;
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={pv('ink')} className="pointer-events-none" style={{ paintOrder: 'stroke', stroke: pv('bg', 0.85), strokeWidth: 3 }}>{children}</text>;
}

export function Meter({ x, y, w, label, value, color }: { x: number; y: number; w: number; label: string; value: number; color: string }) {
  return <g aria-hidden>
    <text x={x} y={y - 4} fontSize="11" fill={pv('ink', 0.85)}>{label}</text>
    <rect x={x} y={y} width={w} height={8} rx={4} fill={pv('panel')} stroke={pv('ink', 0.25)} />
    <rect x={x} y={y} width={Math.max(0, w * value)} height={8} rx={4} fill={color} />
  </g>;
}
