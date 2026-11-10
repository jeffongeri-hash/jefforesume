import React from 'react';
import { strict as assert } from 'node:assert';
import { readFileSync, writeFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import Scene from '../src/components/pathophysiology/FinalSystemsScene';
import { CASES, PATHS, phasesFor, sceneState, STRUCTURES, type System } from '../src/data/pathophysiology/finalSystems';

const render=(system:System,variant:string,time:number,normal=false)=>renderToStaticMarkup(<Scene system={system} variant={variant} time={time} normal={normal} showLabels selected={null} onSelect={()=>{}}/>);
let count=0;
const app=readFileSync('src/App.tsx','utf8'),sitemap=readFileSync('public/sitemap.xml','utf8');
for(const system of Object.keys(CASES) as System[]){
 assert.ok(app.includes(PATHS[system]));assert.ok(sitemap.includes(PATHS[system]));
 for(const c of CASES[system]){
  assert.equal(phasesFor(system,c.id).length,5);
  for(const p of phasesFor(system,c.id)) for(const focus of p.focus) assert.ok(STRUCTURES[focus]);
  assert.equal(render(system,c.id,0,true),render(system,c.id,24,true),'normal anatomy remains constant');
  assert.notEqual(render(system,c.id,0),render(system,c.id,19),'injury produces a visual change');
  for(const time of [0,4.9,9.9,14.9,19.9,24.9])for(const normal of [false,true]){
   const html=render(system,c.id,time,normal);assert.ok(!/NaN|Infinity|undefined/.test(html));
   for(const focus of Object.keys(STRUCTURES))assert.ok(html.includes(`data-structure="${focus}"`));
   count++;
  }
 }
}
assert.equal(sceneState(24,true).injury,0);
assert.equal(sceneState(24).injury,1,'response preserves the accumulated injury state');
assert.match(CASES.vascular.find(c=>c.id==='dvt')!.response,/do not instantly dissolve/);
assert.match(CASES.ob.find(c=>c.id==='previa')!.response,/Avoid digital vaginal examination/);
assert.match(CASES.derm.find(c=>c.id==='bradykinin')!.response,/unreliable/);
if(process.argv.includes('--snapshots'))for(const [system,id] of [['derm','abscess'],['ob','abruption'],['vascular','pe'],['vascular','aaa']] as const)writeFileSync(`/tmp/final-systems-${id}.svg`,render(system,id,19.9));
console.log(`Passed: ${count} scene states, normal comparisons, route/sitemap checks and clinical distinctions.`);
