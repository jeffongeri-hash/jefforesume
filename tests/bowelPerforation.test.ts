import { test, expect } from 'bun:test';
import { readFileSync } from 'fs';
import { PHASES, STRUCTURES, SOURCES, CANNOT_DETERMINE, sceneState, phaseAt, tick, LESSON_DURATION } from '../src/data/pathophysiology/bowelPerforation';

test('five phases in required order', () => { expect(PHASES.map(p => p.id)).toEqual(['intact', 'breach', 'local', 'spread', 'systemic']); });
test('all nine required structures are annotated', () => { expect(Object.keys(STRUCTURES).sort()).toEqual(['bowel-wall', 'enteric-contents', 'microcirculation', 'mucosa', 'parietal-peritoneum', 'perforation', 'peritoneal-fluid', 'serosa', 'visceral-peritoneum']); });
test('scene changes visibly across phases', () => {
  const s = [0, 1, 2, 3, 4].map(i => sceneState(i * 5 + 4.9));
  expect(s[0].breach).toBe(0); expect(s[1].breach).toBe(1);
  expect(s[3].contamination).toBeGreaterThan(s[1].contamination);
  expect(s[2].inflammation).toBeGreaterThan(s[1].inflammation);
  expect(s[3].fluid).toBeGreaterThan(s[2].fluid); expect(s[3].ileus).toBeGreaterThan(0.9);
  expect(s[4].perfusion).toBeLessThan(s[3].perfusion);
});
test('normal comparison is the intact reference', () => { expect(sceneState(24, true)).toMatchObject({ breach: 0, contamination: 0, fluid: 0, perfusion: 1 }); });
test('playback stops at end, never loops', () => { expect(tick(24.9, 1, 1).playing).toBe(false); expect(tick(1, 0.1, 2).time).toBeCloseTo(1.2); expect(phaseAt(LESSON_DURATION + 3)).toBe(4); });
test('lactate and leukocytosis carry limits; no invented numbers', () => {
  const labs = PHASES.flatMap(p => p.labs);
  expect(labs.find(l => l.name === 'Lactate')!.limit).toMatch(/cannot independently diagnose/i);
  expect(labs.find(l => /white cell/i.test(l.name))!.limit).toMatch(/nonspecific/i);
  expect(JSON.stringify(PHASES)).not.toMatch(/\d+(\.\d+)?\s?(mmol|mg\/dL|×10|%)/);
});
test('safety: never says surgery is automatic, sepsis framed as possible', () => {
  expect(CANNOT_DETERMINE.join(' ')).toMatch(/does not automatically mean surgery/);
  expect(PHASES[4].explanation).toMatch(/possible progression, not an inevitable/);
  expect(SOURCES.length).toBeGreaterThanOrEqual(5); SOURCES.forEach(s => expect(s.url).toMatch(/^https:\/\//));
});
test('routes and sitemap registered', () => {
  const app = readFileSync('src/App.tsx', 'utf8'), map = readFileSync('scripts/generate-sitemap.ts', 'utf8');
  for (const p of ['/pathophysiology-atlas', '/pathophysiology-atlas/bowel-perforation']) { expect(app).toContain(`path="${p}"`); expect(map).toContain(`"${p}"`); }
  expect(readFileSync('src/pages/PhysiologyAnimationLab.tsx', 'utf8')).toContain('to="/pathophysiology-atlas"');
});
