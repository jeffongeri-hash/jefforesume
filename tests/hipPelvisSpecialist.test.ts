import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { HIP_PELVIS_PATH, HIP_GROUPS, HIP_SIDES, hipPelvisSpecialist as hip, isHipPelvisMesh, matchHipPelvisMesh } from '../src/data/msk/hipPelvisSpecialist';

test('public lower-extremity route is registered and included in sitemap generation', () => {
  expect(HIP_PELVIS_PATH).toBe('/msk-anatomy-atlas/lower-extremity/hip-pelvis');
  expect(readFileSync('src/App.tsx', 'utf8')).toContain(`path="${HIP_PELVIS_PATH}" element={<MskAnatomyAtlas />}`);
  expect(readFileSync('public/sitemap.xml', 'utf8')).toContain(`https://jeffongeri.com${HIP_PELVIS_PATH}`);
});
test('90–110 entries across the seven requested groups with unique ids', () => {
  expect(hip.structures.length).toBeGreaterThanOrEqual(90);
  expect(hip.structures.length).toBeLessThanOrEqual(110);
  expect(new Set(hip.structures.map(s => s.id)).size).toBe(hip.structures.length);
  expect(HIP_GROUPS.length).toBe(7);
  for (const g of HIP_GROUPS) {
    expect(hip.structures.filter(s => (s as { group?: string }).group === g).length).toBeGreaterThan(0);
  }
  expect(HIP_SIDES.map(s => s.id)).toEqual(['whole', 'right', 'left']);
});
test('every regex mapping hits at least one real GLB mesh node and an existing entry', () => {
  const names: string[] = [];
  for (const file of ['skeletal', 'muscular', 'joints', 'nervous', 'cardiovascular']) {
    const bytes = readFileSync(`public/anatomy-models/${file}.glb`);
    expect(bytes.toString('ascii', 0, 4)).toBe('glTF');
    const json = JSON.parse(bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)));
    for (const node of json.nodes) if (node.mesh !== undefined) names.push(node.name);
  }
  const reachable = new Set<string>();
  for (const n of names) { const m = matchHipPelvisMesh(n); if (m) reachable.add(m.id); }
  const ids = new Set(hip.structures.map(s => s.id));
  for (const id of reachable) expect(ids.has(id)).toBe(true);
  // Core real meshes must resolve to their intended entries.
  expect(matchHipPelvisMesh('Hip bone.r')?.id).toBe('hip-bone');
  expect(matchHipPelvisMesh('Femur.l')?.id).toBe('femur-proximal');
  expect(matchHipPelvisMesh('Acetabular labrum.r')?.id).toBe('labrum');
  expect(matchHipPelvisMesh('Articular capsule of hip joint.l')?.id).toBe('hip-capsule');
  expect(matchHipPelvisMesh('Descending part of iliofemoral ligament.r')?.id).toBe('iliofemoral');
  expect(matchHipPelvisMesh('Ligament of head of femur.r')?.id).toBe('lig-head-femur');
  expect(matchHipPelvisMesh('Gluteus medius muscle.l')?.id).toBe('gluteus-medius');
  expect(matchHipPelvisMesh('Piriformis muscle.r')?.id).toBe('piriformis');
  expect(matchHipPelvisMesh('Quadratus femoris muscle.l')?.id).toBe('quadratus-femoris');
  expect(matchHipPelvisMesh('Psoas major.r')?.id).toBe('psoas');
  expect(matchHipPelvisMesh('Adductor magnus.l')?.id).toBe('adductor-magnus');
  expect(matchHipPelvisMesh('(Adductor minimus).r')?.id).toBe('adductor-minimus');
  expect(matchHipPelvisMesh('Sciatic nerve.r')?.id).toBe('sciatic');
  expect(matchHipPelvisMesh('Femoral nerve.l')?.id).toBe('femoral-n');
  expect(matchHipPelvisMesh('Posterior branch of obturator nerve.r')?.id).toBe('obturator-n');
  expect(matchHipPelvisMesh('Pudendal nerve.l')?.id).toBe('pudendal');
  expect(matchHipPelvisMesh('Superior gluteal artery.r')?.id).toBe('sup-gluteal-v');
  expect(matchHipPelvisMesh('Medial circumflex femoral artery.l')?.id).toBe('circumflex-femoral');
  expect(matchHipPelvisMesh('Pubococcygeus muscle.r')?.id).toBe('levator-ani');
  expect(matchHipPelvisMesh('Pubic symphysis')?.id).toBe('pubic-symphysis');
  expect(matchHipPelvisMesh('Sacrospinous ligament.l')?.id).toBe('sacro-ligs');
});
test('membership is bilateral pelvis/hip and excludes unrelated meshes', () => {
  expect(isHipPelvisMesh('Gluteus maximus muscle.l')).toBe(true);
  expect(isHipPelvisMesh('Gluteus maximus muscle.r')).toBe(true);
  expect(isHipPelvisMesh('Sacrum')).toBe(true);
  expect(isHipPelvisMesh('Obturator internus.r')).toBe(true);
  for (const name of ['Humerus.r', 'Scaphoid bone.r', 'Sternocleidomastoid muscle.r', 'Median nerve.r',
    'Oblique head of adductor hallucis.r', 'Hippocampus.l', 'Vertebra L4', 'Short head of biceps femoris.r',
    'Optic tract.r', 'Left subclavian artery']) expect(isHipPelvisMesh(name)).toBe(false);
});
test('every unmapped entry explicitly discloses index-only status', () => {
  const names: string[] = [];
  for (const file of ['skeletal', 'muscular', 'joints', 'nervous', 'cardiovascular']) {
    const bytes = readFileSync(`public/anatomy-models/${file}.glb`);
    const json = JSON.parse(bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)));
    for (const node of json.nodes) if (node.mesh !== undefined) names.push(node.name);
  }
  const mapped = new Set<string>();
  for (const n of names) { const m = matchHipPelvisMesh(n); if (m) mapped.add(m.id); }
  const unmapped = hip.structures.filter(s => !mapped.has(s.id));
  expect(unmapped.length).toBeGreaterThan(0);
  for (const s of unmapped) expect(s.relations).toContain('Index only — no separate mesh in this reference model.');
  // Landmarks and spaces known to lack meshes must stay index-only.
  for (const id of ['asis', 'ischial-tuberosity', 'femoral-head', 'greater-trochanter', 'femoral-triangle', 'sciatic-foramina', 'inf-gluteal-n']) {
    expect(mapped.has(id)).toBe(false);
  }
  expect(matchHipPelvisMesh('Inferior gluteal nerve.r')).toBeNull();
});
test('all muscles carry origin, insertion, action and innervation; red flags use urgent-assessment framing', () => {
  for (const s of hip.structures.filter(s => s.tissue.startsWith('muscle'))) {
    expect(Boolean(s.origin && s.insertion && s.innervation && s.role)).toBe(true);
  }
  expect(hip.structures.find(s => s.id === 'hip-red-flags')?.clinical).toContain('urgent clinical assessment');
  expect(hip.structures.find(s => s.id === 'gluteus-medius')?.innervation).toContain('Superior gluteal nerve');
  expect(hip.structures.find(s => s.id === 'gluteus-maximus')?.innervation).toContain('Inferior gluteal nerve');
  expect(hip.structures.find(s => s.id === 'psoas')?.insertion).toContain('Lesser trochanter');
  expect(hip.structures.find(s => s.id === 'adductor-magnus')?.innervation).toContain('sciatic');
  expect(hip.structures.find(s => s.id === 'hamstring-origins')?.origin).toContain('ischial tuberosity');
});
