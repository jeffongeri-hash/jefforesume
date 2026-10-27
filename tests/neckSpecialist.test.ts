import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { NECK_PATH, NECK_GROUPS, NECK_MESH_MAP, neckSpecialist as neck, isNeckMesh, matchNeckMesh } from '../src/data/msk/neckSpecialist';

test('public axial route is registered and included in sitemap generation', () => {
  expect(NECK_PATH).toBe('/msk-anatomy-atlas/axial/neck');
  expect(readFileSync('src/App.tsx', 'utf8')).toContain(`path="${NECK_PATH}" element={<MskAnatomyAtlas />}`);
  expect(readFileSync('public/sitemap.xml', 'utf8')).toContain(`https://jeffongeri.com${NECK_PATH}`);
});
test('70–85 entries in exactly the six requested groups, with unique identifiers', () => {
  expect(neck.structures.length).toBeGreaterThanOrEqual(70);
  expect(neck.structures.length).toBeLessThanOrEqual(85);
  expect(NECK_GROUPS).toEqual(['Bones & cervical joints', 'Superficial/infrahyoid', 'Deep/posterior cervical muscles', 'Fascial spaces & tunnels', 'Nerves & vessels', 'Clinical surface anatomy']);
  expect(new Set(neck.structures.map(s => s.id)).size).toBe(neck.structures.length);
  for (const group of NECK_GROUPS) expect(neck.structures.filter(s => (s as {group?: string}).group === group).length).toBeGreaterThan(0);
});
test('every mapping is an actual raw GLB mesh node and links an existing entry', () => {
  const names = new Set<string>();
  for (const file of ['skeletal', 'muscular', 'joints', 'nervous', 'cardiovascular']) {
    const bytes = readFileSync(`public/anatomy-models/${file}.glb`);
    expect(bytes.toString('ascii', 0, 4)).toBe('glTF');
    const json = JSON.parse(bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)));
    for (const node of json.nodes) if (node.mesh !== undefined) names.add(node.name);
  }
  const ids = new Set(neck.structures.map(s => s.id));
  for (const [name, id] of Object.entries(NECK_MESH_MAP)) {
    expect(names.has(name)).toBe(true);
    expect(ids.has(id)).toBe(true);
  }
});
test('membership excludes left neck and unrelated limb/back meshes', () => {
  expect(matchNeckMesh('Sternocleidomastoid muscle.r')).toEqual({regionId: 'neck', id: 'scm'});
  expect(matchNeckMesh('Descending part of trapezius muscle.r')?.id).toBe('trapezius');
  expect(isNeckMesh('Atlas (C1)')).toBe(true);
  for (const name of ['Sternocleidomastoid muscle.l', 'Humerus.r', 'Multifidus lumborum muscle.r', 'Rotatores.r']) expect(isNeckMesh(name)).toBe(false);
});
test('every unmapped entry explicitly discloses index-only status', () => {
  const mapped = new Set(Object.values(NECK_MESH_MAP));
  for (const s of neck.structures.filter(s => !mapped.has(s.id))) expect(s.relations).toContain('Index only — no separate mesh in this reference model.');
  expect(matchNeckMesh('Mastoid process.r')).toBeNull();
  expect(matchNeckMesh('Greater occipital nerve.r')).toBeNull();
});
test('all muscles have attachments, action and innervation; SCM and scalene attachments are precise', () => {
  for (const s of neck.structures.filter(s => s.tissue.startsWith('muscle'))) expect(Boolean(s.origin && s.insertion && s.innervation && s.role)).toBe(true);
  expect(neck.structures.find(s => s.id === 'scm')?.insertion).toBe('Lateral mastoid process and lateral half of superior nuchal line.');
  expect(neck.structures.find(s => s.id === 'scalene-a')?.insertion).toBe('Scalene tubercle first rib.');
  expect(neck.structures.find(s => s.id === 'scalene-p')?.insertion).toBe('External surface second rib.');
  expect(neck.structures.find(s => s.id === 'red-flags')?.relations).toContain('seek urgent clinical assessment');
});