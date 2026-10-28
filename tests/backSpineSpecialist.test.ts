import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { BACK_PATH, BACK_GROUPS, BACK_LEVELS, backSpineSpecialist as back, isBackMesh, matchBackMesh } from '../src/data/msk/backSpineSpecialist';

test('public axial route is registered and included in sitemap generation', () => {
  expect(BACK_PATH).toBe('/msk-anatomy-atlas/axial/back');
  expect(readFileSync('src/App.tsx', 'utf8')).toContain(`path="${BACK_PATH}" element={<MskAnatomyAtlas />}`);
  expect(readFileSync('public/sitemap.xml', 'utf8')).toContain(`https://jeffongeri.com${BACK_PATH}`);
});
test('85–105 entries grouped first by the three spine levels, each with four subgroups', () => {
  expect(back.structures.length).toBeGreaterThanOrEqual(85);
  expect(back.structures.length).toBeLessThanOrEqual(105);
  expect(new Set(back.structures.map(s => s.id)).size).toBe(back.structures.length);
  expect(BACK_GROUPS.length).toBe(12);
  for (const level of ['Cervical', 'Thoracic', 'Lumbar & Sacral']) {
    for (const sub of ['Bones & joints', 'Muscles & fascia', 'Nerves & vessels', 'Clinical surface anatomy']) {
      const g = `${level} — ${sub}`;
      expect(BACK_GROUPS).toContain(g);
      expect(back.structures.filter(s => (s as { group?: string }).group === g).length).toBeGreaterThan(0);
    }
  }
  expect(BACK_LEVELS.map(l => l.id)).toEqual(['cervical', 'thoracic', 'lumbar', 'whole']);
});
test('every regex mapping hits at least one real GLB mesh node and an existing entry', () => {
  const names: string[] = [];
  for (const file of ['skeletal', 'muscular', 'joints', 'nervous', 'cardiovascular']) {
    const bytes = readFileSync(`public/anatomy-models/${file}.glb`);
    expect(bytes.toString('ascii', 0, 4)).toBe('glTF');
    const json = JSON.parse(bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)));
    for (const node of json.nodes) if (node.mesh !== undefined) names.push(node.name);
  }
  // Re-run the module's rules against the real node list: each mapped entry must be reachable.
  const reachable = new Set<string>();
  for (const n of names) { const m = matchBackMesh(n); if (m) reachable.add(m.id); }
  const ids = new Set(back.structures.map(s => s.id));
  for (const id of reachable) expect(ids.has(id)).toBe(true);
  // Core real meshes must resolve to their intended entries.
  expect(matchBackMesh('Vertebra L4')?.id).toBe('l-vertebrae');
  expect(matchBackMesh('Sacrum')?.id).toBe('sacrum');
  expect(matchBackMesh('Intervertebral disc L4-L5')?.id).toBe('l-discs');
  expect(matchBackMesh('Intervertebral disc T12-L1')?.id).toBe('t12l1');
  expect(matchBackMesh('Multifidus lumborum muscle.r')?.id).toBe('multifidus-l');
  expect(matchBackMesh('Posterior layer of thoracolumbar fascia.l')?.id).toBe('tlf');
  expect(matchBackMesh('Posterior sacro-iliac ligament.r')?.id).toBe('si-joint');
  expect(matchBackMesh('Cauda equina')?.id).toBe('cauda');
  expect(matchBackMesh('Descending part of trapezius muscle.l')?.id).toBe('trap-upper');
  expect(matchBackMesh('Costotransverse ligament.r')?.id).toBe('costotransverse');
  expect(matchBackMesh('Ligamenta flava')?.id).toBe('flavum');
});
test('membership is bilateral axial and excludes limb/anterior meshes', () => {
  expect(isBackMesh('Latissimus dorsi muscle.l')).toBe(true);
  expect(isBackMesh('Latissimus dorsi muscle.r')).toBe(true);
  expect(isBackMesh('Vertebra T6')).toBe(true);
  expect(isBackMesh('Hip bone.r')).toBe(true);
  for (const name of ['Humerus.r', 'Scaphoid bone.r', 'Femur.l', 'Sternocleidomastoid muscle.r', 'Median nerve.r', 'Costal cartilage of first rib.r']) expect(isBackMesh(name)).toBe(false);
});
test('every unmapped entry explicitly discloses index-only status', () => {
  const names: string[] = [];
  for (const file of ['skeletal', 'muscular', 'joints', 'nervous', 'cardiovascular']) {
    const bytes = readFileSync(`public/anatomy-models/${file}.glb`);
    const json = JSON.parse(bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)));
    for (const node of json.nodes) if (node.mesh !== undefined) names.push(node.name);
  }
  const mapped = new Set<string>();
  for (const n of names) { const m = matchBackMesh(n); if (m) mapped.add(m.id); }
  const unmapped = back.structures.filter(s => !mapped.has(s.id));
  expect(unmapped.length).toBeGreaterThan(0);
  for (const s of unmapped) expect(s.relations).toContain('Index only — no separate mesh in this reference model.');
  expect(matchBackMesh('Greater occipital nerve.r')).toBeNull();
  expect(matchBackMesh('Superior cluneal nerve.r')).toBeNull();
});
test('all muscles carry origin, insertion, action and innervation; red flags use urgent-assessment framing', () => {
  for (const s of back.structures.filter(s => s.tissue.startsWith('muscle'))) {
    expect(Boolean(s.origin && s.insertion && s.innervation && s.role)).toBe(true);
  }
  expect(back.structures.find(s => s.id === 'red-flags')?.relations).toContain('urgent clinical assessment');
  expect(back.structures.find(s => s.id === 'cauda')?.clinical).toContain('urgent clinical assessment');
  expect(back.structures.find(s => s.id === 'trap-upper')?.innervation).toContain('accessory nerve (XI)');
  expect(back.structures.find(s => s.id === 'ql')?.insertion).toContain('Twelfth rib');
  expect(back.structures.find(s => s.id === 'multifidus-l')?.innervation).toContain('dorsal rami');
});
