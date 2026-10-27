import { expect, test } from 'bun:test';
import { ARM_PATH, armSpecialist, isRightArmMesh, matchArmMesh } from '../src/data/msk/armSpecialist';
test('Arm is the only next route and filters right-arm named anatomy',()=>{
 expect(ARM_PATH).toBe('/msk-anatomy-atlas/upper-extremity/arm');
 expect(isRightArmMesh('Humerus.r')).toBe(true);
 expect(isRightArmMesh('Humerus.l')).toBe(false);
 expect(isRightArmMesh('Scapula.r')).toBe(false);
 expect(isRightArmMesh('Radius.r')).toBe(false);
 expect(matchArmMesh('Long head of biceps brachii.r')?.id).toBe('biceps-long');
 expect(matchArmMesh('Short head of biceps brachii.r')?.id).toBe('biceps-short');
 expect(matchArmMesh('Deep brachial artery.r')?.id).toBe('profunda');
});
test('Each individual arm muscle has origin insertion innervation action',()=>{
 const muscles=armSpecialist.structures.filter(s=>s.tissue==='muscleDeep');
 expect(muscles.length).toBe(7);
 for(const s of muscles){expect(Boolean(s.origin&&s.insertion&&s.innervation&&s.role)).toBe(true);}
});
test('Humeral landmarks and compartment spaces are data-only, not fake mesh matches',()=>{
 expect(armSpecialist.structures.some(s=>s.id==='radial-groove')).toBe(true);
 expect(matchArmMesh('Radial groove.r')).toBeNull();
 expect(matchArmMesh('Anterior and posterior arm compartments.r')).toBeNull();
});