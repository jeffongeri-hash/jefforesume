import { test,expect } from 'bun:test';
import {readFileSync} from 'node:fs';
import { ANATOMY, MECHANICS, STRUCTURED_ENTRY_COUNT, INDEX_ONLY, PLAYBACK_DEFAULT, SPEEDS, advance, duration, phaseAt, keyframe, phaseHighlights, motionAllowed } from '../src/data/msk/movementMechanics';
import {boneInRig,PIVOT_ANCHOR,FRAME_ANCHORS} from '../src/data/msk/mechanicsRig';
const nodes=new Set<string>();
for(const f of ['skeletal','muscular','joints','nervous','cardiovascular']) {
 const b=readFileSync(`public/anatomy-models/${f}.glb`); const j=JSON.parse(b.toString('utf8',20,20+b.readUInt32LE(12)));
 for(const n of j.nodes)if(n.mesh!==undefined)nodes.add(n.name);
}
test('90–130 unique structured records with 12–16 movements and 8–10 injuries',()=>{
 expect(STRUCTURED_ENTRY_COUNT).toBeGreaterThanOrEqual(90);expect(STRUCTURED_ENTRY_COUNT).toBeLessThanOrEqual(130);
 expect(MECHANICS.filter(m=>m.kind==='movement').length).toBe(15);expect(MECHANICS.filter(m=>m.kind==='injury').length).toBe(10);
 expect(new Set(MECHANICS.map(m=>m.id)).size).toBe(25);expect(new Set(ANATOMY.map(a=>a.id)).size).toBe(36);
});
test('all declared actual anatomy mappings and pivots exist in local GLB nodes',()=>{
 for(const a of ANATOMY){for(const n of a.meshes)expect(nodes.has(n)).toBe(true);expect(nodes.has(a.cue)).toBe(true);}
 for(const n of Object.values(PIVOT_ANCHOR))expect(nodes.has(n)).toBe(true);
 for(const ns of Object.values(FRAME_ANCHORS))for(const n of ns)expect(nodes.has(n)).toBe(true);
});
test('phase records have distinct actions, positions, roles and existing anatomy references',()=>{
 for(const m of MECHANICS){expect(m.context.length).toBeGreaterThan(40);expect(m.associated.length).toBeGreaterThan(40);expect(m.phases.length).toBeGreaterThanOrEqual(2);
 for(const p of m.phases){expect(p.action.length).toBeGreaterThan(20);expect(p.position.length).toBeGreaterThan(20);expect(p.roles.length).toBeGreaterThan(0);for(const r of p.roles)expect(ANATOMY.some(a=>a.id===r.anatomy)).toBe(true);}}
});
test('index-only structures cannot produce pretend highlights',()=>{
 for(const id of ['all','mpfl','atfl'])expect(ANATOMY.find(a=>a.id===id)?.meshes).toEqual([]);
 const inv=MECHANICS.find(m=>m.id==='inversion');if(!inv)throw Error('missing inversion');expect(phaseHighlights(inv,4)).toEqual([]);
 expect(INDEX_ONLY).toBe('Index only — no separate mesh in this reference model');
});
test('no autoplay and reduced-motion continuous animation blocked',()=>{
 expect(PLAYBACK_DEFAULT).toEqual({playing:false,speed:1,time:0});expect(motionAllowed(true,true)).toBe(false);expect(motionAllowed(true,false)).toBe(true);
 expect(advance(2,0.1,1,12,false)).toBe(2);expect(SPEEDS).toEqual([0.5,1,1.5]);
});
test('playback loops, speed changes, clamps dt, phase stepping and finite keyframes',()=>{
 expect(advance(2,0.1,0.5,12,true)).toBeCloseTo(2.05);expect(advance(2,0.1,1.5,12,true)).toBeCloseTo(2.15);expect(advance(11.95,1,1,12,true)).toBeCloseTo(0.05);
 for(const m of MECHANICS){expect(phaseAt(m,3)).toBe(1);for(let t=0;t<duration(m);t+=0.25){const k=keyframe(m,t);expect(Number.isFinite(k.angle)&&Number.isFinite(k.secondary)).toBe(true);expect(k.index).toBeLessThan(m.phases.length);}}
});
test('throw has four detailed phases and eccentric deceleration roles',()=>{
 const m=MECHANICS.find(m=>m.id==='throw');expect(m?.phases.length).toBe(4);expect(m?.phases[3].roles.find(r=>r.anatomy==='infra')?.note).toContain('Eccentric');
 expect(m?.phases[2].roles.map(r=>r.anatomy)).toEqual(['pec','lat','triceps','serratus','pronators']);
});
test('squat descent eccentric versus ascent concentric is explicit',()=>{
 const m=MECHANICS.find(m=>m.id==='squat');expect(m?.phases[0].roles.find(r=>r.anatomy==='quads')?.note).toContain('Eccentric');expect(m?.phases[1].roles.find(r=>r.anatomy==='quads')?.note).toContain('Concentric');
});
test('injury safety is general urgent-assessment anatomy only',()=>{for(const m of MECHANICS.filter(m=>m.kind==='injury')){expect(m.safety).toContain('urgent clinical assessment');expect(m.safety).toContain('neurovascular compromise');expect(m.safety).toContain('acute neurologic deficits');}});
test('rig targets exact right bones without moving soft tissue or opposite limb',()=>{
 expect(boneInRig('Femur.r','hip')).toBe(true);expect(boneInRig('Femur.l','hip')).toBe(false);expect(boneInRig('Soleus muscle.r','ankle')).toBe(false);expect(boneInRig('Radius.r','forearm')).toBe(true);expect(boneInRig('Ulna.r','forearm')).toBe(false);
});