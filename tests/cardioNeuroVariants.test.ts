import { describe, it, expect } from 'bun:test';
import * as lad from '../src/data/pathophysiology/ladOcclusion';
import * as mca from '../src/data/pathophysiology/mcaStroke';
import * as hem from '../src/data/pathophysiology/hemorrhagicStroke';

const json = (x: unknown) => JSON.stringify(x);
const noNumbers = (phases: { labs: { trend: string; mechanism: string }[] }[]) => {
  for (const p of phases) for (const l of p.labs) expect(`${l.trend} ${l.mechanism}`).not.toMatch(/\d+(\.\d+)?\s*(mmol|mg|ng|%|mmHg|×10|mL)/);
};

describe('coronary LAD vs RCA', () => {
  it('RCA phases are five with valid focus ids', () => {
    expect(lad.phasesFor('rca')).toHaveLength(5);
    for (const p of lad.phasesFor('rca')) for (const f of p.focus) expect(lad.STRUCTURES).toHaveProperty(f);
    noNumbers(lad.RCA_PHASES);
  });
  it('LAD variant keeps the original timing', () => {
    expect(lad.cardiacState('lad', 24).injury).toBe(lad.sceneState(24).injury);
    expect(lad.cardiacState('lad', 24).rvIschemia).toBe(0);
  });
  it('RCA: inferior ischemia precedes RV involvement, which precedes injury; normal stays at reference', () => {
    expect(lad.cardiacState('rca', 13).inferiorIschemia).toBe(1);
    expect(lad.cardiacState('rca', 13).rvIschemia).toBe(0);
    expect(lad.cardiacState('rca', 19).rvIschemia).toBeGreaterThan(0.5);
    expect(lad.cardiacState('rca', 24).injury).toBeLessThan(1);
    expect(lad.cardiacState('rca', 24, true)).toMatchObject({ rvIschemia: 0, inferiorIschemia: 0, injury: 0 });
  });
  it('venodilation lowers cardiac output more when the RV is ischemic (preload dependence)', () => {
    const drop = (rv: number) => 1 - lad.preloadChain(rv, 1, true).cardiacOutput / lad.preloadChain(rv, 1, false).cardiacOutput; // relative fall
    expect(drop(0.85)).toBeGreaterThan(drop(0) * 1.5);
    expect(lad.preloadChain(0.85, 1, false).lvFilling).toBeLessThan(lad.preloadChain(0, 1, false).lvFilling);
  });
  it('ECG lead groups: inferior for RCA, precordial for LAD', () => {
    expect(lad.ecgPattern('rca').elevated).toEqual(['II', 'III', 'aVF']);
    expect(lad.ecgPattern('lad').elevated).toContain('V2');
  });
  it('RV involvement is qualified as possible and not universal; no dosing', () => {
    const t = json(lad.RCA_PHASES);
    expect(t).toMatch(/not every RCA or inferior MI|many inferior MIs have no meaningful RV involvement/);
    expect(t).toMatch(/nitroglycerin/);
    expect(t).not.toMatch(/\bmg\b|mcg|sublingual dose/i);
    expect(json(lad.SOURCES)).toMatch(/CIR\.0000000000001309/);
  });
});

describe('ischemic stroke territories', () => {
  it('every vessel variant has five phases with valid focus ids', () => {
    for (const v of ['mca', 'aca', 'pca', 'basilar']) {
      const ph = mca.phasesFor(v);
      expect(ph).toHaveLength(5);
      for (const p of ph) for (const f of p.focus) expect(mca.STRUCTURES).toHaveProperty(f);
    }
  });
  it('MCA: face/arm > leg contralateral; aphasia when dominant, neglect when not', () => {
    const d = mca.deficits('mca', 'left', 'left');
    expect(d.arm).toBeGreaterThan(d.leg);
    expect(d.language).toBe(1);
    expect(mca.deficits('mca', 'right', 'left').neglect).toBe(1);
  });
  it('ACA: leg > arm, face spared; PCA: hemianopia; basilar: bilateral brainstem signs', () => {
    const a = mca.deficits('aca', 'left');
    expect(a.leg).toBeGreaterThan(a.arm);
    expect(a.face).toBe(0);
    expect(mca.deficits('pca', 'left').hemianopia).toBe(1);
    expect(mca.deficits('basilar', 'left')).toMatchObject({ bilateral: true, brainstem: 1 });
  });
  it('states symptoms do not establish occlusion and keeps CTA vs perfusion distinction', () => {
    expect(json(mca.VARIATIONS)).toMatch(/not inferred from symptoms/);
    expect(mca.IMAGING_CONCEPT.join(' ')).toMatch(/CTA.*does not by itself measure core or penumbra/);
  });
});

describe('hemorrhagic stroke ICH vs SAH', () => {
  it('two distinct variants with five phases each and https sources', () => {
    expect(hem.phasesFor('ich')).toHaveLength(5);
    expect(hem.phasesFor('sah')).toHaveLength(5);
    expect(hem.phasesFor('ich')[1].name).not.toBe(hem.phasesFor('sah')[1].name);
    for (const v of ['ich', 'sah']) for (const p of hem.phasesFor(v)) for (const f of p.focus) expect(hem.STRUCTURES).toHaveProperty(f);
    for (const s of hem.SOURCES) expect(s.url).toMatch(/^https:\/\//);
    noNumbers(hem.ICH_PHASES); noNumbers(hem.SAH_PHASES);
  });
  it('ICH: haematoma grows, oedema later, shift and ICP rise; normal is zero', () => {
    expect(hem.hemState('ich', 9).hematoma).toBeGreaterThan(hem.hemState('ich', 6).hematoma);
    expect(hem.hemState('ich', 13).edema).toBe(0);
    expect(hem.hemState('ich', 24).shift).toBeGreaterThan(hem.hemState('ich', 9).shift);
    expect(hem.hemState('ich', 24).icp).toBeGreaterThan(hem.hemState('ich', 9).icp);
    expect(hem.hemState('ich', 24, true).icp).toBe(0);
  });
  it('SAH: no parenchymal haematoma, blood spreads in subarachnoid space, hydrocephalus possible', () => {
    expect(hem.hemState('sah', 24).hematoma).toBe(0);
    expect(hem.hemState('sah', 14).sahSpread).toBeGreaterThan(0.9);
    expect(hem.hemState('sah', 19).hydro).toBe(1);
  });
  it('NCCT concept states declining SAH sensitivity; outcomes framed as possible', () => {
    expect(hem.NCCT_CONCEPT.join(' ')).toMatch(/falls with time/);
    expect(json(hem.VARIATIONS)).toMatch(/possible outcomes/);
  });
});
