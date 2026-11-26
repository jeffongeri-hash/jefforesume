import React from 'react';
import { strict as assert } from 'node:assert';
import { readFileSync, writeFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Scene from '../src/components/dermatology/DermImmuneScene';
import Page from '../src/pages/DermImmunePathwaysAtlas';
import { CASES, STAGES, PATH, phasesFor, sceneState, pick } from '../src/data/dermImmunePathways';
const old=console.error;console.error=(...v:unknown[])=>{if(!String(v[0]).includes('useLayoutEffect does nothing on the server'))old(...v);};
let frames=0,pages=0;
try{
 for(const c of CASES){assert.equal(phasesFor(c).length,5);assert.ok(c.autoimmune&&c.antigen&&c.mediators);assert.ok(c.sources.length);
  for(const t of c.targets)assert.ok(STAGES.includes(t.stage));
  const render=(time:number,normal:boolean,target=(c.targets[0]??null))=>renderToStaticMarkup(<Scene item={c} time={time} normal={normal} target={target} selected={null} labels onSelect={()=>{}}/>);
  assert.equal(render(0,true),render(24,true));assert.notEqual(render(0,false),render(24,false));
  for(const time of [0,4.9,9.9,14.9,19.9,24.9])for(const normal of [true,false])for(const target of [null,...c.targets]){const s=render(time,normal,target);assert.ok(!/NaN|Infinity|undefined/.test(s));for(const key of STAGES)assert.ok(s.includes(`data-structure="${key}"`));frames++;}
  const html=renderToStaticMarkup(<HelmetProvider><MemoryRouter initialEntries={[`${PATH}?condition=${c.id}`]}><Page/></MemoryRouter></HelmetProvider>);assert.ok(html.includes(c.title.replace(/&/g,'&amp;')));assert.ok(html.includes('Autoantigen / antibody'));pages++;
 }
 assert.match(pick('pemphigus').antigen,/Desmoglein 3/);assert.match(pick('pemphigoid').antigen,/BP180/);assert.match(pick('dh').antigen,/transglutaminase 3/);assert.match(pick('vitiligo').mediators,/IFN-γ/);assert.match(pick('psoriasis').mediators,/IL-23.*IL-17/);assert.match(pick('photo').classification,/not a classic autoimmune/);
 assert.equal(sceneState(24,true).tissue,0);assert.equal(sceneState(24).tissue,1);
 assert.ok(readFileSync('src/App.tsx','utf8').includes(PATH));assert.ok(readFileSync('public/sitemap.xml','utf8').includes(PATH));
 if(process.argv.includes('--snapshots'))for(const id of ['psoriasis','atopic','pemphigus','pemphigoid','dh']){const c=pick(id);writeFileSync(`/tmp/derm-immune-${id}.svg`,renderToStaticMarkup(<Scene item={c} time={24} normal={false} target={c.targets[0]??null} selected="signal" labels onSelect={()=>{}}/>));}
 console.log(`Validated ${pages} pathway lessons, ${frames} scene states, immunologic distinctions and lesion levels.`);
}finally{console.error=old;}
