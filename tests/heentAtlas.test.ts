import { describe, expect, it } from 'bun:test';
import { CASES, PATHS, phasesFor, state, structuresFor, type HeentKind } from '../src/data/pathophysiology/heentAtlas';

describe('HEENT examination lessons', () => {
  const kinds:HeentKind[] = ['ear', 'eye', 'nose'];
  it('covers the requested conditions with sourced phases and valid anatomy targets', () => {
    expect(CASES.ear.map(item => item.id)).toEqual(['redness', 'aom', 'ome', 'externa', 'mastoid']);
    expect(CASES.eye.map(item => item.id)).toEqual(['abrasion', 'perforation', 'keratitis', 'uveitis', 'scleritis', 'retinitis']);
    for (const kind of kinds) for (const item of CASES[kind]) {
      expect(item.source).toMatch(/^https:\/\//);
      const phases = phasesFor(kind, item.id);
      expect(phases).toHaveLength(5);
      for (const phase of phases) for (const id of phase.focus) expect(structuresFor(kind)).toHaveProperty(id);
      expect(PATHS[kind]).toStartWith('/pathophysiology-atlas/');
    }
  });
  it('keeps the normal comparison normal and progresses the finding', () => {
    expect(state(0).injury).toBe(0);
    expect(state(20).injury).toBe(1);
    expect(state(20, true).injury).toBe(0);
  });
  it('distinguishes exam findings from diagnostic certainty', () => {
    expect(CASES.ear.find(item => item.id === 'redness')?.limit).toMatch(/alone does not establish/);
    expect(CASES.ear.find(item => item.id === 'ome')?.limit).toMatch(/does not mean acute bacterial infection/);
    expect(CASES.eye.find(item => item.id === 'perforation')?.limit).toMatch(/negative Seidel test does not exclude/);
    expect(CASES.eye.find(item => item.id === 'retinitis')?.limit).toMatch(/does not visualize retinal inflammation/);
  });
});
