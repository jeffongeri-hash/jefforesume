import { test, expect } from 'bun:test';
import { readFileSync } from 'fs';
import { PHASES, STRUCTURES, SOURCES, CANNOT_DETERMINE, IMAGING_CONCEPT, sceneState, tick } from '../src/data/pathophysiology/retropharyngealAbscess';

test('five phases in order', () => { expect(PHASES.map(p => p.id)).toEqual(['normal', 'seeding', 'phlegmon', 'abscess', 'spread']); });
test('required anatomy is annotated', () => { for (const k of ['pharynx', 'airway', 'retropharyngeal-space', 'buccopharyngeal-fascia', 'alar-fascia', 'danger-space', 'prevertebral-fascia', 'cervical-spine', 'lymph-nodes', 'mediastinum', 'collection']) expect(STRUCTURES).toHaveProperty(k); });
test('scene changes each phase', () => {
  const s = [0, 1, 2, 3, 4].map(i => sceneState(i * 5 + 4.9));
  expect(s[0].node).toBe(0); expect(s[1].node).toBe(1);
  expect(s[2].phlegmon).toBe(1); expect(s[2].abscess).toBe(0); expect(s[3].abscess).toBe(1);
  expect(s[3].airway).toBeLessThan(s[1].airway); expect(s[3].spread).toBe(0); expect(s[4].spread).toBe(1);
});
test('normal comparison and no looping', () => { expect(sceneState(24, true)).toMatchObject({ abscess: 0, airway: 1, spread: 0 }); expect(tick(24.9, 1, 1).playing).toBe(false); });
test('required bedside signals and lab limits, no numbers', () => {
  const txt = JSON.stringify(PHASES);
  for (const w of ['Fever', 'stiffness', 'extension', 'Dysphagia', 'Drooling', 'Voice', 'stridor']) expect(txt).toContain(w);
  const labs = PHASES.flatMap(p => p.labs);
  expect(labs.find(l => l.name === 'CRP')!.limit).toMatch(/nonspecific/i);
  expect(labs.find(l => l.name === 'Lactate')!.limit).toMatch(/nonspecific/i);
  expect(txt + IMAGING_CONCEPT.join()).not.toMatch(/\d+\s?(mm|mmol|mg\/[dL]|%)/);
});
test('safety framing', () => {
  expect(CANNOT_DETERMINE.join(' ')).toMatch(/most patients do not develop airway compromise/);
  expect(CANNOT_DETERMINE.join(' ')).toMatch(/does not automatically mean surgical/);
  expect(PHASES[4].explanation).toMatch(/not an inevitable course/);
  expect(IMAGING_CONCEPT.join(' ')).toMatch(/no simulated scan/);
  SOURCES.forEach(s => expect(s.url).toMatch(/^https:\/\//));
});
test('route, sitemap and hub registered', () => {
  const p = '/pathophysiology-atlas/retropharyngeal-abscess';
  expect(readFileSync('src/App.tsx', 'utf8')).toContain(`path="${p}"`);
  expect(readFileSync('scripts/generate-sitemap.ts', 'utf8')).toContain(`"${p}"`);
  expect(readFileSync('src/pages/PathophysiologyAtlas.tsx', 'utf8')).toContain('RETROPHARYNGEAL_PATH');
});
