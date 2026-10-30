import { describe, it, expect } from 'bun:test';
import { RESPIRATORY_LESSONS, respiratoryState, respiratoryDeep, phasesFor, STRUCTURES, scenarioFor } from '../src/data/pathophysiology/respiratory';
describe('respiratory lesson physiology', () => {
  for (const l of RESPIRATORY_LESSONS) {
    it(`${l.id}: five synchronized phases with valid focus and detailed references in every scenario`, () => {
      for (const v of l.scenarios) {
        const phases = phasesFor(l.id, v.id);
        expect(phases.map(p => p.id)).toEqual(['normal', 'trigger', 'obstruction', 'burden', 'risk']);
        for (const p of phases) {
          p.focus.forEach(f => expect(STRUCTURES[f]).toBeDefined());
          expect(p.labs.length).toBeGreaterThan(0);
          const d = respiratoryDeep(l.id, v.id, p.id);
          expect(d?.sections.length).toBeGreaterThanOrEqual(4);
          expect(d?.refs.length).toBe(2);
          expect(d?.sections.every(s => s.t.length > 80)).toBe(true);
        }
      }
    });
    it(`${l.id}: healthy comparison removes pathology in every scenario`, () => {
      for (const v of l.scenarios) {
        const s = respiratoryState(l.id, 24, v.id, true);
        expect(s.airFlow).toBe(1); expect(s.forwardFlow).toBe(1);
        expect(s.airwayNarrowing + s.muscle + s.edema + s.mucus + s.emphysema + s.pvr + s.rvDilation + s.baseline).toBe(0);
      }
    });
  }
  it('bronchiolitis is epithelial small-airway obstruction with trapping and collapse, not muscle spasm', () => {
    const s = respiratoryState('bronchiolitis', 24);
    expect(s.muscle).toBe(0); expect(s.edema).toBeGreaterThan(0); expect(s.mucus).toBeGreaterThan(0);
    expect(s.trapping).toBeGreaterThan(0); expect(s.collapse).toBeGreaterThan(0); expect(s.emphysema).toBe(0);
  });
  it('asthma has active muscle constriction without emphysematous destruction', () => {
    const s = respiratoryState('asthma-exacerbation', 14);
    expect(s.muscle).toBe(1); expect(s.emphysema).toBe(0); expect(s.airFlow).toBeGreaterThan(0);
  });
  it('COPD retains chronic baseline and differentiates emphysema from secretory emphasis', () => {
    expect(respiratoryState('copd-exacerbation', 0, 'bronchitic').baseline).toBeGreaterThan(0);
    expect(respiratoryState('copd-exacerbation', 0, 'emphysema').emphysema).toBeGreaterThan(0);
    expect(respiratoryState('copd-exacerbation', 24, 'bronchitic').emphysema).toBe(0);
    expect(respiratoryState('copd-exacerbation', 24).muscle).toBe(0);
  });
  it('isolated post-capillary example raises downstream pressure without assuming increased PVR', () => {
    const s = respiratoryState('pulmonary-hypertension', 14, 'left-heart');
    expect(s.downstreamPressure).toBe(1); expect(s.pvr).toBe(0); expect(s.vascularLoad).toBe(1);
  });
  it('vascular PH scenarios increase PVR without conflating bronchial narrowing', () => {
    for (const v of ['pah', 'lung-hypoxia', 'cteph']) {
      const s = respiratoryState('pulmonary-hypertension', 14, v);
      expect(s.pvr).toBe(1); expect(s.airwayNarrowing).toBe(0); expect(s.airFlow).toBe(1);
    }
  });
  it('RV adaptation precedes illustrative failure risk and output stays nonzero', () => {
    const adapted = respiratoryState('pulmonary-hypertension', 19, 'pah');
    expect(adapted.rvHypertrophy).toBe(1); expect(adapted.rvDilation).toBe(0); expect(adapted.forwardFlow).toBe(1);
    const risk = respiratoryState('pulmonary-hypertension', 24, 'pah');
    expect(risk.rvDilation).toBeGreaterThan(0); expect(risk.forwardFlow).toBeLessThan(1); expect(risk.forwardFlow).toBeGreaterThan(0);
  });
  it('different scenarios resolve different mechanism detail and invalid choices fall back', () => {
    for (const l of RESPIRATORY_LESSONS) {
      expect(scenarioFor(l.id, 'invalid').id).toBe(l.scenarios[0].id);
      expect(respiratoryDeep(l.id, l.scenarios[0].id, 'trigger')).not.toEqual(respiratoryDeep(l.id, l.scenarios[1].id, 'trigger'));
    }
  });
});