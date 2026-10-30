// Shared, React-free 5-phase lesson timeline helpers (qualitative animation time only).
export const PHASE_SECONDS = 5;
export const PHASE_COUNT = 5;
export const LESSON_DURATION = PHASE_SECONDS * PHASE_COUNT;
export const clampTime = (t: number) => Math.max(0, Math.min(LESSON_DURATION - 0.001, t));
export const phaseAt = (t: number) => Math.min(PHASE_COUNT - 1, Math.floor(clampTime(t) / PHASE_SECONDS));
export const phaseStart = (i: number) => Math.max(0, Math.min(PHASE_COUNT - 1, i)) * PHASE_SECONDS;
export const tick = (t: number, dt: number, speed: number) => {
  const next = t + dt * speed;
  return next >= LESSON_DURATION ? { time: LESSON_DURATION - 0.001, playing: false } : { time: next, playing: true };
};
export const ramp = (t: number, a: number, b: number) => Math.max(0, Math.min(1, (t - a) / (b - a)));
export type Lab = { name: string; trend: string; mechanism: string; limit: string };
export type GenericPhase<S extends string> = { id: string; name: string; short: string; explanation: string; focus: S[]; bedside: string[]; labs: Lab[] };
