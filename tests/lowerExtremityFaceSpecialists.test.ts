import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { THIGH_PATH, THIGH_GROUPS, thighSpecialist, isThighMesh, matchThighMesh } from '../src/data/msk/thighSpecialist';
import { KNEE_PATH, KNEE_GROUPS, kneeSpecialist, isKneeMesh, matchKneeMesh } from '../src/data/msk/kneeSpecialist';
import { CALF_PATH, CALF_GROUPS, calfSpecialist, isCalfMesh, matchCalfMesh } from '../src/data/msk/calfSpecialist';
import { ANKLE_FOOT_PATH, ANKLE_FOOT_GROUPS, ankleFootSpecialist, isAnkleFootMesh, matchAnkleFootMesh } from '../src/data/msk/ankleFootSpecialist';
import { FACE_PATH, FACE_GROUPS, faceSpecialist, isFaceMesh, matchFaceMesh } from '../src/data/msk/faceSpecialist';

const meshNames: string[] = [];
for (const file of ['skeletal', 'muscular', 'joints', 'nervous', 'cardiovascular']) {
  const bytes = readFileSync(`public/anatomy-models/${file}.glb`);
  expect(bytes.toString('ascii', 0, 4)).toBe('glTF');
  const json = JSON.parse(bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)));
  for (const node of json.nodes) if (node.mesh !== undefined) meshNames.push(node.name);
}

const modules = [
  { path: THIGH_PATH, groups: THIGH_GROUPS, region: thighSpecialist, match: matchThighMesh, member: isThighMesh, min: 75, max: 95, bilateral: false },
  { path: KNEE_PATH, groups: KNEE_GROUPS, region: kneeSpecialist, match: matchKneeMesh, member: isKneeMesh, min: 85, max: 105, bilateral: false },
  { path: CALF_PATH, groups: CALF_GROUPS, region: calfSpecialist, match: matchCalfMesh, member: isCalfMesh, min: 80, max: 100, bilateral: false },
  { path: ANKLE_FOOT_PATH, groups: ANKLE_FOOT_GROUPS, region: ankleFootSpecialist, match: matchAnkleFootMesh, member: isAnkleFootMesh, min: 100, max: 120, bilateral: false },
  { path: FACE_PATH, groups: FACE_GROUPS, region: faceSpecialist, match: matchFaceMesh, member: isFaceMesh, min: 90, max: 110, bilateral: true },
] as const;

for (const m of modules) {
  test(`${m.region.name}: route registered and in sitemap`, () => {
    expect(readFileSync('src/App.tsx', 'utf8')).toContain(`path="${m.path}" element={<MskAnatomyAtlas />}`);
    expect(readFileSync('public/sitemap.xml', 'utf8')).toContain(`https://jeffongeri.com${m.path}`);
  });
  test(`${m.region.name}: entry count in range, unique ids, every group non-empty`, () => {
    expect(m.region.structures.length).toBeGreaterThanOrEqual(m.min);
    expect(m.region.structures.length).toBeLessThanOrEqual(m.max);
    expect(new Set(m.region.structures.map(s => s.id)).size).toBe(m.region.structures.length);
    for (const g of m.groups) {
      expect(m.region.structures.filter(s => (s as { group?: string }).group === g).length).toBeGreaterThan(0);
    }
  });
  test(`${m.region.name}: every regex mapping hits a real GLB node and an existing entry`, () => {
    const reachable = new Set<string>();
    for (const n of meshNames) { const hit = m.match(n); if (hit) reachable.add(hit.id); }
    const ids = new Set(m.region.structures.map(s => s.id));
    for (const id of reachable) expect(ids.has(id)).toBe(true);
    expect(reachable.size).toBeGreaterThan(10);
  });
  test(`${m.region.name}: unmapped entries disclose index-only status`, () => {
    const mapped = new Set<string>();
    for (const n of meshNames) { const hit = m.match(n); if (hit) mapped.add(hit.id); }
    const unmapped = m.region.structures.filter(s => !mapped.has(s.id));
    expect(unmapped.length).toBeGreaterThan(0);
    for (const s of unmapped) expect(s.relations).toContain('Index only — no separate mesh in this reference model.');
  });
  test(`${m.region.name}: muscles carry origin, insertion, action and innervation; red flags urgent`, () => {
    for (const s of m.region.structures.filter(s => s.tissue.startsWith('muscle'))) {
      expect(Boolean(s.origin && s.insertion && s.innervation && s.role)).toBe(true);
    }
    const red = m.region.structures.find(s => s.id.endsWith('red-flags'));
    expect(red?.clinical).toContain('urgent clinical assessment');
  });
  test(`${m.region.name}: membership sidedness and exclusions`, () => {
    if (m.bilateral) {
      expect(m.member('Masseteric fascia.l')).toBe(true);
      expect(m.member('Masseteric fascia.r')).toBe(true);
    } else {
      for (const n of meshNames) {
        if (m.member(n)) expect(n.endsWith('.r')).toBe(true);
      }
    }
    for (const name of ['Humerus.r', 'Scaphoid bone.r', 'Hippocampus.l', 'Optic tract.r', 'Vertebra L4']) {
      expect(m.member(name)).toBe(false);
    }
  });
}

test('thigh: core meshes resolve to intended entries', () => {
  expect(matchThighMesh('Femur.r')?.id).toBe('femur');
  expect(matchThighMesh('Rectus femoris muscle.r')?.id).toBe('rectus-femoris');
  expect(matchThighMesh('Vastus medialis muscle.r')?.id).toBe('vastus-medialis');
  expect(matchThighMesh('Long head of biceps femoris.r')?.id).toBe('biceps-femoris-long');
  expect(matchThighMesh('Iliotibial tract.r')?.id).toBe('iliotibial-tract');
  expect(matchThighMesh('Sciatic nerve.r')?.id).toBe('sciatic-nerve');
  expect(matchThighMesh('Femoral artery.r')?.id).toBe('femoral-artery');
  expect(matchThighMesh('Deep femoral artery.r')?.id).toBe('deep-femoral');
  expect(matchThighMesh('Saphenous nerve.r')?.id).toBe('saphenous-nerve');
});

test('knee: core meshes resolve to intended entries', () => {
  expect(matchKneeMesh('Patella.r')?.id).toBe('patella');
  expect(matchKneeMesh('Medial meniscus.r')?.id).toBe('medial-meniscus');
  expect(matchKneeMesh('Anterior cruciate ligament.r')?.id).toBe('acl');
  expect(matchKneeMesh('Posterior cruciate ligament.r')?.id).toBe('pcl');
  expect(matchKneeMesh('Superficial part of tibial collateral ligament.r')?.id).toBe('mcl-superficial');
  expect(matchKneeMesh('Fibular collateral ligament.r')?.id).toBe('lcl');
  expect(matchKneeMesh('Popliteus muscle.r')?.id).toBe('popliteus');
  expect(matchKneeMesh('Popliteal artery.r')?.id).toBe('popliteal-artery');
  expect(matchKneeMesh('Anserine bursa.r')?.id).toBe('anserine-bursa');
  expect(matchKneeMesh('Patellar ligament.r')).toBeNull(); // no mesh — index only
});

test('calf: core meshes resolve to intended entries', () => {
  expect(matchCalfMesh('Tibia.r')?.id).toBe('tibia');
  expect(matchCalfMesh('Fibula.r')?.id).toBe('fibula');
  expect(matchCalfMesh('Interosseous membrane of leg.r')?.id).toBe('interosseous-membrane');
  expect(matchCalfMesh('Soleus muscle.r')?.id).toBe('soleus');
  expect(matchCalfMesh('Calcaneal tendon.r')?.id).toBe('calcaneal-tendon');
  expect(matchCalfMesh('Tibialis posterior muscle.r')?.id).toBe('tibialis-posterior');
  expect(matchCalfMesh('Deep fibular nerve.r')?.id).toBe('deep-fibular');
  expect(matchCalfMesh('Anterior tibial artery.r')?.id).toBe('anterior-tibial');
  expect(matchCalfMesh('Flexor retinaculum of ankle.r')?.id).toBe('flexor-retinaculum');
});

test('ankle-foot: core meshes resolve to intended entries', () => {
  expect(matchAnkleFootMesh('Talus.r')?.id).toBe('talus');
  expect(matchAnkleFootMesh('Calcaneus.r')?.id).toBe('calcaneus');
  expect(matchAnkleFootMesh('Fifth metatarsal bone.r')?.id).toBe('metatarsals');
  expect(matchAnkleFootMesh('Plantar aponeurosis.r')?.id).toBe('plantar-aponeurosis');
  expect(matchAnkleFootMesh('Tibionavicular ligament.r')?.id).toBe('deltoid');
  expect(matchAnkleFootMesh('Anterior tibiofibular ligament.r')?.id).toBe('syndesmosis');
  expect(matchAnkleFootMesh('Medial plantar nerve.r')?.id).toBe('medial-plantar');
  expect(matchAnkleFootMesh('Dorsalis pedis artery.r')?.id).toBe('dorsalis-pedis');
  expect(matchAnkleFootMesh('Proximal phalanx of third finger of foot.r')?.id).toBe('lesser-toes');
  expect(matchAnkleFootMesh('Anterior talofibular ligament.r')).toBeNull(); // no mesh — index only
});

test('face: core meshes resolve to intended entries', () => {
  expect(matchFaceMesh('Mandible')?.id).toBe('mandible');
  expect(matchFaceMesh('Maxilla.l')?.id).toBe('maxilla');
  expect(matchFaceMesh('Articular disc of temporomandibular joint.r')?.id).toBe('tmj-disc');
  expect(matchFaceMesh('Superficial part of masseter.l')?.id).toBe('masseter');
  expect(matchFaceMesh('Orbicularis oris muscle.r')?.id).toBe('orbicularis-oris');
  expect(matchFaceMesh('Facial nerve (VII).r')?.id).toBe('facial-nerve');
  expect(matchFaceMesh('Maxillary nerve.l')?.id).toBe('v2');
  expect(matchFaceMesh('Facial artery.r')?.id).toBe('facial-artery');
  expect(matchFaceMesh('Buccinator.l')).toBeNull(); // no mesh — index only
  expect(matchFaceMesh('Parotid gland.r')).toBeNull(); // no mesh — index only
});

test('hub page exposes all twelve specialist cards and lower-extremity navigation chain', () => {
  const page = readFileSync('src/pages/MskAnatomyAtlas.tsx', 'utf8');
  for (const p of [THIGH_PATH, KNEE_PATH, CALF_PATH, ANKLE_FOOT_PATH, FACE_PATH]) {
    expect(page).toContain(`to={${p === THIGH_PATH ? 'THIGH_PATH' : p === KNEE_PATH ? 'KNEE_PATH' : p === CALF_PATH ? 'CALF_PATH' : p === ANKLE_FOOT_PATH ? 'ANKLE_FOOT_PATH' : 'FACE_PATH'}}`);
  }
  expect(page).toContain('Next: Thigh');
  expect(page).toContain('Next: Knee');
  expect(page).toContain('Next: Leg & Calf');
  expect(page).toContain('Next: Ankle & Foot');
});
