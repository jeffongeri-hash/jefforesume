import { describe, expect, test } from 'bun:test';
import { UPPER_MODULES, matchUpperMesh } from '../src/data/msk/upperExtremity';
import { matchMesh } from '../src/data/msk/meshMap';

describe('upper-extremity reference integrity', () => {
 test('provides all six dedicated modules without replacing old regions', () => {
  expect(UPPER_MODULES.map(m=>m.id)).toEqual(['shoulder','arm','elbow','forearm','wrist-hand','digits']);
  expect(matchMesh('Patella.r','knee')).toEqual({regionId:'knee',id:'patella'});
  expect(matchMesh('Vertebra L3','lumbar')).toEqual({regionId:'lumbar',id:'body'});
 });
 test('exact reference names match only anatomically valid entries', () => {
  expect(matchMesh('Annular ligament of radius.r','elbow')).toEqual({regionId:'elbow',id:'annular'});
  expect(matchMesh('Scaphoid bone.r','wrist-hand')).toEqual({regionId:'wrist-hand',id:'scaphoid'});
  expect(matchMesh('Distal phalanx of first finger of hand.r','digits')).toEqual({regionId:'digits',id:'1-distal'});
  expect(matchMesh('Distal phalanx of first finger of foot.r','digits')).toBeNull();
 });
 test('unsegmented structures are not mapped to fabricated meshes', () => {
  for (const id of ['central-slip','terminal','sagittal','nail']) expect(UPPER_MODULES.find(m=>m.id==='digits')?.structures.some(s=>s.id===id)).toBe(true);
  expect(matchUpperMesh('central slip','digits')).toBeNull();
  expect(matchUpperMesh('lateral ulnar collateral ligament','elbow')).toBeNull();
  expect(matchUpperMesh('triangular fibrocartilage complex','wrist-hand')).toBeNull();
 });
 test('thumb has two phalanges and fingers each have three', () => {
  const entries=UPPER_MODULES.find(m=>m.id==='digits')?.structures ?? [];
  expect(entries.filter(s=>/^1-/.test(s.id)).length).toBe(2);
  for (const i of [2,3,4,5]) expect(entries.filter(s=>s.id.startsWith(`${i}-`)).length).toBe(3);
 });
 test('each unit includes palpation, movement, danger and test associations', () => {
  for (const m of UPPER_MODULES) for (const field of ['palpation','movement','danger','tests'] as const) expect(m.views.some(v=>v.exam[field].length>0)).toBe(true);
 });
});
