import React from 'react';
import { strict as assert } from 'node:assert';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { readFileSync, writeFileSync } from 'node:fs';
import Scene, { type Tone } from '../src/components/dermatology/DermatologyScene';
import Page from '../src/pages/DermatologyAtlas';
import { LESSONS, PATH, STRUCTURES, phaseText, state, pick, type Section } from '../src/data/dermatologyAtlas';
let frames=0,pages=0;
const render=(section:Section,id:string,time:number,normal=false,tone:Tone='medium')=>renderToStaticMarkup(<Scene lesson={pick(section,id)} section={section} time={time} normal={normal} tone={tone} labels selected={null} onSelect={()=>{}}/>);
const oldError=console.error;
// React Router emits expected useLayoutEffect warnings in server-only render checks.
console.error=(...args:unknown[])=>{if(!String(args[0]).includes('useLayoutEffect does nothing on the server'))oldError(...args);};
try{
 for(const section of Object.keys(LESSONS) as Section[]){
  const ids=new Set();
  for(const c of LESSONS[section]){
   assert.ok(!ids.has(c.id));ids.add(c.id);
   assert.equal(phaseText(section,c,4).length,2);
   assert.ok(c.source.url.startsWith('https://'));
   assert.equal(render(section,c.id,0,true),render(section,c.id,24.9,true),'normal reference does not change during playback');
   assert.notEqual(render(section,c.id,0),render(section,c.id,19.9),'mechanism changes across timeline');
   for(const tone of ['light','medium','deep'] as Tone[])for(const t of [0,4.9,9.9,14.9,19.9,24.9])for(const normal of [false,true]){
    const html=render(section,c.id,t,normal,tone);assert.ok(!/NaN|Infinity|undefined/.test(html));
    for(const id of Object.keys(STRUCTURES))assert.ok(html.includes(`data-structure="${id}"`));frames++;
   }
   const html=renderToStaticMarkup(<HelmetProvider><MemoryRouter initialEntries={[`${PATH}/${section}?lesson=${c.id}`]}><Page section={section}/></MemoryRouter></HelmetProvider>);
   assert.ok(html.includes(c.title.replace(/&/g,'&amp;')));assert.ok(html.includes('Animation timeline'));assert.ok(html.includes(c.source.url.replace(/&/g,'&amp;')));pages++;
  }
 }
 const hub=renderToStaticMarkup(<HelmetProvider><MemoryRouter><Page/></MemoryRouter></HelmetProvider>);
 for(const section of Object.keys(LESSONS) as Section[])for(const c of LESSONS[section])assert.ok(hub.includes(`${PATH}/${section}?lesson=${c.id}`));
 const retinol=pick('skincare','retinol');assert.deepEqual(retinol.pathway,['Retinol','Retinal','Retinoic acid → RAR']);
 assert.match(pick('conditions','phytophoto').mechanism,/not a sensitization-dependent/);
 assert.match(pick('conditions','lipoma').layer,/Subcutaneous/);
 assert.match(pick('medications','dupilumab').mechanism,/IL-4 receptor alpha/);
 assert.match(pick('medications','il23').mechanism,/p19/);
 assert.match(pick('skincare','sunscreen').mechanism,/Both organic and mineral filters primarily absorb UV/);
 for(const section of Object.keys(LESSONS) as Section[]){assert.equal(state(section,24.9,true).activity,0);assert.equal(state(section,24.9,true).benefit,0);}
 for(const path of [PATH,...Object.keys(LESSONS).map(s=>`${PATH}/${s}`)])assert.ok(readFileSync('public/sitemap.xml','utf8').includes(path));
 if(process.argv.includes('--snapshots'))for(const [section,id] of [['conditions','psoriasis'],['conditions','lipoma'],['conditions','phytophoto'],['medications','jak'],['medications','antifungal'],['skincare','retinol']] as const)writeFileSync(`/tmp/dermatology-${id}.svg`,render(section,id,19.9,false,'deep'));
 console.log(`Passed ${frames} rendered animation states, ${pages} lesson pages, hub links and mechanism distinctions.`);
}finally{console.error=oldError;}
