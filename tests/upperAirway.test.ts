import { describe, it, expect } from 'bun:test';
import { sceneState, phasesFor, airwayDeep, phaseAt, tick, conditionFor, levelFor } from '../src/data/pathophysiology/upperAirway';

describe('upper-airway mechanisms and qualitative state', () => {
  it('croup swelling remains subglottic, not supraglottic', () => {
    const s = sceneState(14.9, 'croup');
    expect(s.subglottic).toBe(1); expect(s.supraglottic).toBe(0); expect(s.object).toBe(0);
  });
  it('epiglottitis swelling remains supraglottic, not subglottic', () => {
    const s = sceneState(14.9, 'epiglottitis');
    expect(s.supraglottic).toBe(1); expect(s.subglottic).toBe(0); expect(s.object).toBe(0);
  });
  it('aspiration can obstruct at initiating phase without inflammatory swelling', () => {
    const s = sceneState(8, 'foreign-body');
    expect(s.object).toBe(1); expect(s.patency).toBe(0.5); expect(s.subglottic + s.supraglottic).toBe(0);
  });
  it('foreign body levels and degrees independently change the chosen model', () => {
    for (const level of ['larynx', 'trachea', 'bronchus'] as const) {
      const partial = sceneState(19, 'foreign-body', false, level, 'partial');
      const severe = sceneState(19, 'foreign-body', false, level, 'near-complete');
      expect(partial.level).toBe(level); expect(severe.patency).toBeCloseTo(0.08); expect(severe.flow).toBeLessThan(partial.flow);
    }
  });
  it('normal comparison removes all pathology for every condition and level', () => {
    for (const c of ['croup', 'epiglottitis', 'foreign-body']) for (const l of ['larynx', 'trachea', 'bronchus'] as const) {
      const s = sceneState(24, c, true, l, 'near-complete');
      expect(s.patency).toBe(1); expect(s.cause + s.effort + s.risk + s.object + s.subglottic + s.supraglottic).toBe(0);
    }
  });
  it('risk branch never asserts inevitable complete obstruction', () => {
    for (const c of ['croup', 'epiglottitis', 'foreign-body']) expect(sceneState(24.999, c).patency).toBeGreaterThan(0);
  });
  it('five shared phases drive condition-specific mechanism identity', () => {
    for (const c of ['croup', 'epiglottitis', 'foreign-body']) {
      const phases = phasesFor(c); expect(phases.length).toBe(5);
      phases.forEach((p, i) => { expect(phaseAt(i * 5)).toBe(i); expect(airwayDeep(c, p.id)).toBeDefined(); });
    }
    expect(airwayDeep('croup', 'narrowing')).not.toEqual(airwayDeep('epiglottitis', 'narrowing'));
  });
  it('invalid choices fall back safely and playback stops at the final phase', () => {
    expect(conditionFor('unknown')).toBe('croup'); expect(levelFor('unknown')).toBe('larynx');
    expect(tick(24, 2, 1)).toEqual({ time: 24.999, playing: false });
  });
});