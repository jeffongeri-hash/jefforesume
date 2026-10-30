import { describe, it, expect } from 'bun:test';
import { SEPSIS_DEEP, CORONARY_DEEP, strokeDeep, HEM_DEEP } from '../src/data/pathophysiology/deepMechanisms';
import * as sepsis from '../src/data/pathophysiology/sepsisShock';
import * as lad from '../src/data/pathophysiology/ladOcclusion';
import * as stroke from '../src/data/pathophysiology/mcaStroke';
import * as hem from '../src/data/pathophysiology/hemorrhagicStroke';

const ok = (d: any) => { expect(d).toBeTruthy(); expect(d.sections.length).toBeGreaterThanOrEqual(1); expect(d.refs.length).toBeGreaterThanOrEqual(1); d.refs.forEach((r: any) => expect(r.url).toMatch(/^https:\/\//)); };

describe('deep mechanism coverage', () => {
  it('every sepsis phase has detail', () => sepsis.PHASES.forEach(p => ok(SEPSIS_DEEP[p.id])));
  it('every LAD and RCA phase has detail', () => (['lad', 'rca'] as const).forEach(v => lad.phasesFor(v).forEach(p => ok(CORONARY_DEEP[v][p.id]))));
  it('RCA RV phase explains preload chain and nitrate caution', () => {
    const t = CORONARY_DEEP.rca.rv.sections.map(s => s.t).join(' ');
    expect(t).toMatch(/LV end-diastolic volume falls/); expect(t).toMatch(/nitrate/i); expect(t).toMatch(/not always/);
  });
  it('stroke occlusion detail follows selected artery', () => {
    ['mca', 'aca', 'pca', 'basilar'].forEach(v => stroke.phasesFor(v).forEach(p => ok(strokeDeep(v, p.id))));
    expect(strokeDeep('aca', 'occlusion')!.sections.map(s => s.t).join(' ')).toMatch(/leg/);
    expect(strokeDeep('basilar', 'occlusion')).not.toBe(strokeDeep('mca', 'occlusion'));
  });
  it('every ICH and SAH phase has detail', () => (['ich', 'sah'] as const).forEach(v => hem.phasesFor(v).forEach(p => ok(HEM_DEEP[v][p.id]))));
});
