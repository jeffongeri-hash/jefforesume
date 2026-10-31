import { describe, it, expect } from 'bun:test';
import { ectopicState, PHASES, STRUCTURES, ectopicDeep, phaseAt, tick } from '../src/data/pathophysiology/ectopicPregnancy';

describe('ectopic pregnancy qualitative mechanism sequence', () => {
  it('starts with endometrial implantation and no ectopic pathology', () => {
    const s = ectopicState(0);
    expect(s.normalImplant).toBe(1);
    expect(s.implant + s.invasion + s.rupture + s.blood + s.perfusionRisk).toBe(0);
  });
  it('ectopic implantation precedes invasion and leaves the normal site', () => {
    const s = ectopicState(9.9);
    expect(s.implant).toBe(1); expect(s.normalImplant).toBe(0);
    expect(s.invasion + s.rupture + s.blood).toBe(0);
  });
  it('wall distension and trophoblast invasion can exist without rupture', () => {
    const s = ectopicState(14.9);
    expect(s.distension).toBe(1); expect(s.invasion).toBe(1);
    expect(s.rupture + s.blood + s.perfusionRisk).toBe(0);
  });
  it('rupture branch permits blood loss before modeled perfusion deterioration', () => {
    const s = ectopicState(19.9);
    expect(s.rupture).toBe(1); expect(s.blood).toBeGreaterThan(0);
    expect(s.perfusionRisk).toBe(0); expect(s.forwardFlow).toBe(1);
  });
  it('ongoing blood loss in the complication branch reduces forward-flow concept', () => {
    expect(ectopicState(24.9).blood).toBeGreaterThan(ectopicState(19.9).blood);
    expect(ectopicState(24.9).forwardFlow).toBeLessThan(ectopicState(19.9).forwardFlow);
    expect(ectopicState(24.9).forwardFlow).toBeGreaterThan(0);
  });
  it('normal comparison retains normal implantation at every phase with zero hemorrhage', () => {
    for (let i = 0; i < 5; i++) {
      const s = ectopicState(i * 5 + 4.9, true);
      expect(s.normalImplant).toBe(1); expect(s.forwardFlow).toBe(1);
      expect(s.implant + s.invasion + s.distension + s.rupture + s.blood + s.perfusionRisk).toBe(0);
    }
  });
  it('state actually interpolates within invasion and rupture rather than only switching cards', () => {
    expect(ectopicState(12).invasion).toBeGreaterThan(ectopicState(11).invasion);
    expect(ectopicState(17).rupture).toBeGreaterThan(ectopicState(16).rupture);
    expect(ectopicState(22).forwardFlow).toBeLessThan(ectopicState(21).forwardFlow);
  });
  it('five phases resolve valid structures and distinct detailed mechanisms', () => {
    expect(PHASES).toHaveLength(5);
    const details = PHASES.map((p, i) => {
      expect(phaseAt(i * 5 + 4.9)).toBe(i);
      for (const f of p.focus) expect(STRUCTURES[f]).toBeDefined();
      const d = ectopicDeep('', p.id);
      expect(d?.sections.length).toBeGreaterThanOrEqual(2);
      expect(d?.refs.length).toBeGreaterThanOrEqual(2);
      return d?.sections[0].h;
    });
    expect(new Set(details).size).toBe(5);
    expect(ectopicDeep('', 'unknown')).toBeUndefined();
  });
  it('restart and playback end do not wrap to a false new clinical course', () => {
    expect(ectopicState(-1).implant).toBe(0);
    expect(tick(24.9, 1, 2).playing).toBe(false);
    expect(phaseAt(tick(24.9, 1, 2).time)).toBe(4);
  });
});