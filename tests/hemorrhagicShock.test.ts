import { describe, it, expect } from 'bun:test';
import { hemorrhagicState, hemorrhagicDeep, PHASES, STRUCTURES, phaseAt, tick } from '../src/data/pathophysiology/hemorrhagicShock';

describe('hemorrhagic shock conceptual circulation', () => {
  it('starts with normal filling, flow and delivery without blood loss', () => {
    const s = hemorrhagicState(0);
    expect(s.filling).toBe(1); expect(s.forwardFlow).toBe(1); expect(s.oxygenDelivery).toBe(1);
    expect(s.hemorrhage + s.sympathetic + s.dysfunction).toBe(0);
  });
  it('shows hemorrhage before fully developed filling loss', () => {
    const s = hemorrhagicState(9.9);
    expect(s.hemorrhage).toBe(1); expect(s.filling).toBe(1); expect(s.dysfunction).toBe(0);
  });
  it('decreased preload reduces stroke volume and forward flow', () => {
    const s = hemorrhagicState(14.9);
    expect(s.filling).toBeLessThan(hemorrhagicState(9.9).filling);
    expect(s.strokeVolume).toBeLessThan(1); expect(s.forwardFlow).toBeLessThan(1);
    expect(s.dysfunction).toBe(0);
  });
  it('compensation increases pulse and tone while pressure support can mask lower flow', () => {
    const s = hemorrhagicState(19.9);
    expect(s.sympathetic).toBe(1); expect(s.pulseRate).toBeGreaterThan(1); expect(s.vesselTone).toBe(1);
    expect(s.pressureSupport).toBe(1); expect(s.forwardFlow).toBeLessThan(1);
    expect(s.dysfunction).toBe(0);
  });
  it('selected deterioration branch reduces delivery without universal complete flow cessation', () => {
    const s = hemorrhagicState(24.9);
    expect(s.dysfunction).toBe(1);
    expect(s.oxygenDelivery).toBeLessThan(hemorrhagicState(19.9).oxygenDelivery);
    expect(s.oxygenDelivery).toBeGreaterThan(0); expect(s.forwardFlow).toBeGreaterThan(0);
  });
  it('normal comparison never hemorrhages or deteriorates across all five phases', () => {
    for (let i = 0; i < 5; i++) {
      const s = hemorrhagicState(i * 5 + 4.9, true);
      expect(s.hemorrhage + s.sympathetic + s.dysfunction).toBe(0);
      expect(s.filling).toBe(1); expect(s.strokeVolume).toBe(1); expect(s.oxygenDelivery).toBe(1);
    }
  });
  it('interpolates blood loss, filling, tone and organ risk within phases', () => {
    expect(hemorrhagicState(8).hemorrhage).toBeGreaterThan(hemorrhagicState(6).hemorrhage);
    expect(hemorrhagicState(13).filling).toBeLessThan(hemorrhagicState(11).filling);
    expect(hemorrhagicState(18).vesselTone).toBeGreaterThan(hemorrhagicState(16).vesselTone);
    expect(hemorrhagicState(23).dysfunction).toBeGreaterThan(hemorrhagicState(21).dysfunction);
  });
  it('resolves distinct phase mechanisms, valid structures and professional references', () => {
    expect(PHASES).toHaveLength(5);
    const mechanisms = PHASES.map((p, i) => {
      expect(phaseAt(i * 5 + 4.9)).toBe(i);
      p.focus.forEach(f => expect(STRUCTURES[f]).toBeDefined());
      const d = hemorrhagicDeep('', p.id);
      expect(d?.sections.length).toBeGreaterThanOrEqual(2); expect(d?.refs.length).toBeGreaterThanOrEqual(2);
      return d?.sections[0].h;
    });
    expect(new Set(mechanisms).size).toBe(5); expect(hemorrhagicDeep('', 'unknown')).toBeUndefined();
  });
  it('clamps the normal start and stops playback rather than looping a disease course', () => {
    expect(hemorrhagicState(-5).hemorrhage).toBe(0);
    expect(tick(24.9, 1, 2).playing).toBe(false); expect(phaseAt(tick(24.9, 1, 2).time)).toBe(4);
  });
});