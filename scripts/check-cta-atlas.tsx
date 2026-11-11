import React from 'react';
import { strict as assert } from 'node:assert';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { readFileSync, writeFileSync } from 'node:fs';
import Diagram from '../src/components/cta/CtaLearningDiagram';
import Page from '../src/pages/CtaLearningAtlas';
import { FINDINGS, PATH, VIEWS, type View, type Finding } from '../src/data/ctaLearningAtlas';
const modes:Record<View,Finding[]>={'brain-map':['normal','left-m1'],'head-axial':['normal','left-m1'],'brain-tissue':['normal','left-infarct'],'neck-coronal':['normal'],'neck-sagittal':['normal'],'chest-axial':['normal','right-pe'],'chest-coronal':['normal','right-pe']};
let count=0;
for(const view of Object.keys(VIEWS) as View[])for(const finding of modes[view]){
 const html=renderToStaticMarkup(<Diagram view={view} finding={finding} labels selected={null} onSelect={()=>{}}/>);
 assert.ok(!/NaN|undefined|Infinity/.test(html));assert.ok(html.includes('NOT A CT SCAN'));if(view!=='neck-sagittal'){assert.ok(html.includes('R (patient)'));assert.ok(html.includes('L (patient)'));}else{assert.ok(html.includes('Anterior'));assert.ok(html.includes('Posterior'));}assert.ok(html.includes('role="button"'));
 if(finding==='left-m1'){assert.ok(html.includes('Left M1 cutoff'));assert.ok(html.includes('data-structure="mca-left"'));}
 if(finding==='right-pe'){assert.ok(html.includes('R PA'));assert.ok(html.includes('data-structure="rpa"'));}
 if(process.argv.includes('--snapshots'))writeFileSync(`/tmp/cta-${view}-${finding}.svg`,html);
 count++;
}
assert.match(FINDINGS['left-m1'].limitations,/cannot define the infarct core/);
assert.match(FINDINGS['right-pe'].limitations,/Motion/);
assert.ok(readFileSync('src/App.tsx','utf8').includes(`path="${PATH}"`));assert.ok(readFileSync('public/sitemap.xml','utf8').includes(PATH));
const old=console.error;console.error=(...v:unknown[])=>{if(!String(v[0]).includes('useLayoutEffect does nothing on the server'))old(...v);};
try{const page=renderToStaticMarkup(<HelmetProvider><MemoryRouter><Page/></MemoryRouter></HelmetProvider>);assert.match(page,/noncontrast/i);assert.match(page,/not real or simulated patient CT images/i);}finally{console.error=old;}
console.log(`Validated ${count} diagrams, side markers, normal and abnormal examples, links and stroke imaging limitations.`);
