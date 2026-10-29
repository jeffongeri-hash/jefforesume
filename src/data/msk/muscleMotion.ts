import { ANATOMY, phaseAt, type Mechanic, type Phase } from './movementMechanics';
export type Activation = 'agonist'|'eccentric'|'synergist'|'stabilizer'|'risk'|'reference';
export const MOTION_LAYERS = {bone:false,muscle:true,joint:true,nerve:false,vessel:false};
export function activation(role: Phase['roles'][number]): Activation {
 if(role.role==='At-risk structure')return 'risk';
 if(/eccentric|brak/i.test(role.note))return 'eccentric';
 if(role.role==='Prime mover')return 'agonist';
 if(role.role==='Synergist')return 'synergist';
 return 'stabilizer';
}
export function meshActivations(m:Mechanic,time:number) {
 const map=new Map<string,Activation>();
 for(const r of m.phases[phaseAt(m,time)].roles)for(const n of ANATOMY.find(a=>a.id===r.anatomy)?.meshes??[])map.set(n,activation(r));
 return map;
}
/** Smooth attachment weighting: proximal attachment stays with parent, distal with child. */
export function attachmentWeight(y:number,pivotY:number,band:number) {
 const t=Math.max(0,Math.min(1,(pivotY+band-y)/(2*Math.max(band,0.00001))));return t*t*(3-2*t);
}
