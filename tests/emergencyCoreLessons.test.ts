import { describe, it, expect } from 'bun:test';
import * as sep from '../src/data/pathophysiology/sepsisShock';
import * as lad from '../src/data/pathophysiology/ladOcclusion';
import * as mca from '../src/data/pathophysiology/mcaStroke';

const all = [sep, lad, mca] as const;
const text = (m: typeof sep | typeof lad | typeof mca) => JSON.stringify([m.PHASES, m.VARIATIONS, m.CANNOT_DETERMINE, (m as any).IMAGING_CONCEPT ?? []]);

describe('core emergency lessons', () => {
  it('each has five phases with valid focus ids and https sources', () => {
    for (const m of all) {
      expect(m.PHASES).toHaveLength(5);
      for (const p of m.PHASES) for (const f of p.focus) expect(m.STRUCTURES).toHaveProperty(f);
      expect(m.SOURCES.length).toBeGreaterThanOrEqual(4);
      for (const s of m.SOURCES) expect(s.url).toMatch(/^https:\/\//);
    }
  });
  it('contains no invented numeric lab values', () => {
    for (const m of all) for (const p of m.PHASES) for (const l of p.labs) expect(`${l.trend} ${l.mechanism}`).not.toMatch(/\d+(\.\d+)?\s*(mmol|mg|ng|%|mmHg|×10)/);
  });
  it('sepsis states lactate does not by itself prove hypoxia and not all sepsis is cytokine storm', () => {
    expect(text(sep)).toMatch(/does not by itself prove tissue hypoxia/);
    expect(text(sep)).toMatch(/not universally a “cytokine storm”|Not all sepsis is a cytokine storm/);
  });
  it('sepsis scene: vasodilation and leak rise over time, normal stays at reference', () => {
    expect(sep.sceneState(2).dilation).toBe(0);
    expect(sep.sceneState(24).dilation).toBe(1);
    expect(sep.sceneState(24).leak).toBe(1);
    expect(sep.sceneState(24, true)).toMatchObject({ dilation: 0, leak: 0, glycocalyx: 1 });
  });
  it('LAD: ischemia precedes irreversible injury and flow falls with thrombus', () => {
    expect(lad.sceneState(13).ischemia).toBe(1);
    expect(lad.sceneState(13).injury).toBe(0);
    expect(lad.sceneState(24).injury).toBeGreaterThan(0.5);
    expect(lad.sceneState(24).injury).toBeLessThan(1); // not inevitably transmural
    expect(lad.sceneState(10).flow).toBeLessThan(0.2);
    expect(text(lad)).toMatch(/rise and\/or fall/);
  });
  it('MCA: CTA locates occlusion rather than measuring core; perfusion depends on timing/software', () => {
    const img = mca.IMAGING_CONCEPT.join(' ');
    expect(img).toMatch(/CTA.*locates the occlusion.*does not by itself measure core or penumbra/);
    expect(img).toMatch(/timing.*software/);
    expect(mca.sceneState(24).core).toBeGreaterThan(mca.sceneState(18).core);
    expect(mca.sceneState(13).core).toBe(0);
  });
  it('shared timeline stops at end without autoplaying past duration', () => {
    expect(sep.tick(24.9, 1, 2)).toEqual({ time: sep.LESSON_DURATION - 0.001, playing: false });
    expect(sep.phaseAt(12)).toBe(2);
  });
});
