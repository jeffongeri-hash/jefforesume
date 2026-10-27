import { expect, test } from 'bun:test';
import { WRIST_HAND_PATH, WH_GROUPS, wristHandSpecialist as wh, isRightWristHandMesh, matchWristHandMesh } from '../src/data/msk/wristHandSpecialist';

test('route and right-sided, knuckle-limited membership', () => {
  expect(WRIST_HAND_PATH).toBe('/msk-anatomy-atlas/upper-extremity/wrist-hand');
  expect(isRightWristHandMesh('Scaphoid bone.r')).toBe(true);
  expect(isRightWristHandMesh('Scaphoid bone.l')).toBe(false);
  expect(isRightWristHandMesh('Humerus.r')).toBe(false);
  for (const n of ['Proximal phalanx of third finger of hand.r', 'Distal phalanx of first finger of hand.r', 'Synovial sheaths of digits of hand.r']) expect(isRightWristHandMesh(n)).toBe(false);
});
test('index has 65-80 entries across the six groups', () => {
  expect(wh.structures.length).toBeGreaterThanOrEqual(65);
  expect(wh.structures.length).toBeLessThanOrEqual(80);
  for (const g of WH_GROUPS) expect(wh.structures.some((s) => (s as { group?: string }).group === g)).toBe(true);
});
test('real meshes map; unsegmented structures are labelled index only', () => {
  expect(matchWristHandMesh('Flexor retinaculum of wrist.r')?.id).toBe('flexor-retinaculum');
  expect(matchWristHandMesh('Deep palmar arch.r')?.id).toBe('deep-arch');
  expect(matchWristHandMesh('Oblique head of adductor pollicis.r')?.id).toBe('adp');
  for (const n of ['Scapholunate ligament.r', 'Carpal tunnel.r', 'Hook of hamate.r']) expect(matchWristHandMesh(n)).toBeNull();
  const mapped = new Set(['Radius.r','Scaphoid bone.r','Flexor retinaculum of wrist.r'].map((n) => matchWristHandMesh(n)!.id));
  for (const id of ['scapholunate', 'lunotriquetral', 'carpal-tunnel', 'guyon', 'hook-hamate', 'comp-3', 'comp-5', 'comp-6', 'recurrent-motor', 'snuffbox']) {
    expect(mapped.has(id)).toBe(false);
    expect(wh.structures.find((s) => s.id === id)?.relations).toContain('no separate mesh in this reference model');
  }
});
test('every mapped id exists; every muscle has origin, insertion and innervation', () => {
  const ids = new Set(wh.structures.map((s) => s.id));
  expect(ids.size).toBe(wh.structures.length);
  for (const n of ['Hamate bone.r', 'Pronator quadratus.r', 'Superficial branch of ulnar nerve.r', 'Cephalic vein.r', 'Lumbrical muscles of hand.r']) expect(ids.has(matchWristHandMesh(n)!.id)).toBe(true);
  for (const s of wh.structures.filter((s) => s.tissue.startsWith('muscle'))) expect(Boolean(s.origin && s.insertion && s.innervation)).toBe(true);
});
