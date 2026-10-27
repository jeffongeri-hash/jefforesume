import { expect, test } from 'bun:test';
import { ELBOW_FOREARM_PATH, EF_GROUPS, elbowForearmSpecialist as ef, isRightElbowForearmMesh, matchElbowForearmMesh } from '../src/data/msk/elbowForearmSpecialist';

test('route and right-sided filtering', () => {
  expect(ELBOW_FOREARM_PATH).toBe('/msk-anatomy-atlas/upper-extremity/elbow-forearm');
  expect(isRightElbowForearmMesh('Radius.r')).toBe(true);
  expect(isRightElbowForearmMesh('Radius.l')).toBe(false);
  expect(isRightElbowForearmMesh('Scapula.r')).toBe(false);
  expect(isRightElbowForearmMesh('Scaphoid bone.r')).toBe(false);
});
test('index has 55-70 entries in the six requested groups', () => {
  expect(ef.structures.length).toBeGreaterThanOrEqual(55);
  expect(ef.structures.length).toBeLessThanOrEqual(70);
  for (const g of EF_GROUPS) expect(ef.structures.some((s) => (s as { group?: string }).group === g)).toBe(true);
});
test('exact meshes map; unsegmented structures stay data-only', () => {
  expect(matchElbowForearmMesh('Annular ligament of radius.r')?.id).toBe('annular');
  expect(matchElbowForearmMesh('Ulnar head of flexor carpi ulnaris.r')?.id).toBe('fcu');
  expect(matchElbowForearmMesh('Posterior interosseous nerve of forearm.r')?.id).toBe('pin');
  for (const n of ['Lateral ulnar collateral ligament.r', 'Quadrate ligament.r', 'Cubital fossa.r', 'Radial head.r']) expect(matchElbowForearmMesh(n)).toBeNull();
  for (const id of ['lucl', 'quadrate', 'ucl-anterior', 'capitulum', 'cubital-tunnel']) expect(ef.structures.find((s) => s.id === id)?.relations).toContain('Data-only');
});
test('every mapped id exists and every muscle has origin, insertion and innervation', () => {
  const ids = new Set(ef.structures.map((s) => s.id));
  for (const n of ['Supinator.r', 'Extensor indicis.r', 'Median nerve.r', 'Common interosseous artery.r']) expect(ids.has(matchElbowForearmMesh(n)!.id)).toBe(true);
  for (const s of ef.structures.filter((s) => s.tissue.startsWith('muscle'))) expect(Boolean(s.origin && s.insertion && s.innervation)).toBe(true);
});
