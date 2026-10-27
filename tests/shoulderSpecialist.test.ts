import { expect, test } from 'bun:test';
import { isRightShoulderMesh, matchShoulderSpecialist, shoulderSpecialist, SHOULDER_PATH } from '../src/data/msk/shoulderSpecialist';

test('dedicated route and right-sided shoulder membership', () => {
 expect(SHOULDER_PATH).toBe('/msk-anatomy-atlas/upper-extremity/shoulder');
 for (const name of ['Clavicle.r','Scapula.r','Humerus.r','Articular capsule of glenohumeral joint.r','Acromioclavicular ligament.r']) expect(isRightShoulderMesh(name)).toBe(true);
 for (const name of ['Clavicle.l','Femur.r','Vertebra L3','Rib 1.r']) expect(isRightShoulderMesh(name)).toBe(false);
});
test('long head study card does not pretend the short head is the same selected structure', () => {
 expect(matchShoulderSpecialist('Short head of biceps brachii.r')).toBeNull();
 expect(shoulderSpecialist.structures.find(s=>s.id==='biceps-lh')?.name).toBe('Biceps brachii — long head');
 expect(matchShoulderSpecialist('Brachial artery.r')).toEqual({regionId:'shoulder',id:'brachial-a'});
});