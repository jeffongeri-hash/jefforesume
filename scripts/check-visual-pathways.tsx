import React from 'react';
import { strict as assert } from 'node:assert';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { readFileSync, writeFileSync } from 'node:fs';
import Scene from '../src/components/neurology/VisualPathwayScene';
import Fields from '../src/components/neurology/VisualFieldDiagram';
import Page from '../src/pages/VisualPathwaysAtlas';
import { LESIONS, REGIONS, PATH, type Lesion } from '../src/data/visualPathways';
const expected:Record<Lesion,[string,string]>={normal:['none','none'],'right-nerve':['all','none'],chiasm:['right-half','left-half'],'left-tract':['right-half','right-half'],'left-meyer':['upper-right','upper-right'],'left-parietal':['lower-right','lower-right'],'left-occipital':['right-half','right-half']};
for(const id of Object.keys(LESIONS) as Lesion[]){const c=LESIONS[id];assert.deepEqual([c.rightEye,c.leftEye],expected[id]);assert.ok(REGIONS[c.region]);
 for(const field of ['both','left-field','right-field'] as const)for(const motion of [false,true]){const s=renderToStaticMarkup(<Scene lesion={id} field={field} selected={c.region} onSelect={()=>{}} motion={motion}/>);assert.ok(!/NaN|undefined|Infinity/.test(s));assert.equal(s.includes('animateMotion'),motion);for(const key of Object.keys(REGIONS))assert.ok(s.includes(`data-structure="${key}"`));}
 const vf=renderToStaticMarkup(<Fields rightEye={c.rightEye} leftEye={c.leftEye}/>);assert.ok(vf.includes(`right eye ${c.rightEye}`));assert.ok(vf.includes(`left eye ${c.leftEye}`));
}
assert.match(REGIONS.chiasm.detail,/Nasal retinal.*cross/);assert.match(REGIONS.midbrain.detail,/not an obligatory second crossing/);
const old=console.error;console.error=(...v:unknown[])=>{if(!String(v[0]).includes('useLayoutEffect does nothing on the server'))old(...v);};try{const html=renderToStaticMarkup(<HelmetProvider><MemoryRouter><Page/></MemoryRouter></HelmetProvider>);assert.ok(html.includes('Choose a lesion'));assert.ok(html.includes('Predicted visual fields'));}finally{console.error=old;}
assert.ok(readFileSync('src/App.tsx','utf8').includes(PATH));assert.ok(readFileSync('public/sitemap.xml','utf8').includes(PATH));
if(process.argv.includes('--snapshots')){writeFileSync('/tmp/visual-pathway.svg',renderToStaticMarkup(<Scene lesion="left-meyer" field="both" selected="temporal" onSelect={()=>{}} motion={false}/>));writeFileSync('/tmp/visual-fields.svg',renderToStaticMarkup(<Fields rightEye="upper-right" leftEye="upper-right"/>));}
console.log('Validated 42 pathway states, seven lesion patterns, crossing descriptions, normal references and routing.');
