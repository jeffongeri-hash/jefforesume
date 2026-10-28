import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { AnatomyViewer, SYSTEMS, type LabelMode, type Sys, type ViewerHandle } from '@/components/anatomy/AnatomyViewer';
import { ANATOMY, MECHANICS, MECHANICS_PATH, INDEX_ONLY, PLAYBACK_DEFAULT, SPEEDS, PHASE_SECONDS, STRUCTURED_ENTRY_COUNT, duration, phaseAt } from '@/data/msk/movementMechanics';

export default function MskMovementMechanics() {
 const [kind,setKind]=useState<'movement'|'injury'>('movement');
 const [id,setId]=useState(MECHANICS[0].id);
 const [query,setQuery]=useState('');
 const [region,setRegion]=useState('All regions');
 const [playing,setPlaying]=useState<boolean>(PLAYBACK_DEFAULT.playing);
 const [time,setTime]=useState<number>(PLAYBACK_DEFAULT.time);
 const [speed,setSpeed]=useState<number>(PLAYBACK_DEFAULT.speed);
 const [seek,setSeek]=useState({time:0,revision:0});
 const [reduced,setReduced]=useState(false);
 const [meshNames,setMeshNames]=useState<string[]>([]);
 const [selected,setSelected]=useState<string|null>(null);
 const [cue,setCue]=useState<{name:string;anchor:string}|null>(null);
 const [labels,setLabels]=useState<LabelMode>('selected');
 const [layers,setLayers]=useState<Record<Sys,boolean>>({bone:true,muscle:true,joint:true,nerve:true,vessel:false});
 const [opacity,setOpacity]=useState<Record<Sys,number>>({bone:0.75,muscle:0.45,joint:0.8,nerve:0.85,vessel:0.6});
 const viewer=useRef<ViewerHandle>(null);
 const current=MECHANICS.find(m=>m.id===id)??MECHANICS[0];
 const phase=current.phases[phaseAt(current,time)];
 const list=MECHANICS.filter(m=>m.kind===kind && (region==='All regions'||m.region===region) && `${m.name} ${m.joints} ${m.context}`.toLowerCase().includes(query.toLowerCase()));
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const sync=()=>{setReduced(media.matches);if(media.matches)setPlaying(false);};
  sync();media.addEventListener('change',sync);return()=>media.removeEventListener('change',sync);
 },[]);
 const jump=(value:number)=>{const t=Math.max(0,Math.min(duration(current)-0.001,value));setPlaying(false);setTime(t);setSeek(s=>({time:t,revision:s.revision+1}));};
 const choose=(next:string)=>{setId(next);setPlaying(false);setTime(0);setSeek(s=>({time:0,revision:s.revision+1}));setSelected(null);setCue(null);};
 const selectRole=(aid:string)=>{
  const a=ANATOMY.find(a=>a.id===aid);if(!a)return;
  const mesh=a.meshes.find(n=>meshNames.includes(n));
  if(mesh){setSelected(mesh);setCue(null);const sys=viewer.current?.meshSystem(mesh);if(sys)setLayers(l=>({...l,[sys]:true}));}
  else {setSelected(null);setCue({name:a.name,anchor:a.cue});const sys=viewer.current?.meshSystem(a.cue);if(sys)setLayers(l=>({...l,[sys]:true}));}
 };
 const selectedEntry=ANATOMY.find(a=>a.meshes.includes(selected??''));
 const canonical=`https://jeffongeri.com${MECHANICS_PATH}`;
 return <div className="min-h-screen bg-background text-foreground">
  <Helmet><title>MSK Movement &amp; Injury Mechanics 3D Atlas | Jefney Ongeri, PA-C</title><meta name="description" content="Explore 15 movements and 10 educational injury mechanisms with real 3D reference anatomy, phase-specific muscle roles and controlled illustrative keyframes."/><link rel="canonical" href={canonical}/><meta property="og:title" content="MSK Movement & Injury Mechanics 3D Atlas"/><meta property="og:description" content="Interactive educational movement phases, muscle roles and injury-mechanism anatomy."/><meta property="og:type" content="website"/><meta property="og:url" content={canonical}/></Helmet>
  <Header/>
  <main id="main-content" className="mx-auto max-w-[1500px] px-4 py-8 md:px-6">
   <nav aria-label="Atlas breadcrumb" className="flex flex-wrap gap-2 text-xs text-muted-foreground"><Link to="/professional">Professional</Link><span>/</span><Link to="/msk-anatomy-atlas">MSK Atlas</Link><span>/</span><span>Movement &amp; Injury Mechanics</span></nav>
   <p className="mt-6 text-xs font-semibold uppercase text-primary">Musculoskeletal · Mechanics lab</p>
   <h1 className="mt-2 font-journal text-3xl leading-tight md:text-5xl">MSK Movement &amp; Injury Mechanics 3D Atlas</h1>
   <p className="mt-3 max-w-3xl text-sm text-muted-foreground">Intact reference anatomy · illustrative kinematic sequences · {STRUCTURED_ENTRY_COUNT} structured study records. Anatomy education, not diagnosis, treatment or procedural guidance.</p>
   <div className="mt-6 flex flex-wrap gap-3 border-y border-border py-4">
    <div role="group" aria-label="Mechanics mode" className="flex gap-1 rounded-md border border-border p-1">{(['movement','injury'] as const).map(k=><Button key={k} variant={kind===k?'default':'ghost'} aria-pressed={kind===k} onClick={()=>{setKind(k);setRegion('All regions');setQuery('');const m=MECHANICS.find(m=>m.kind===k);if(m)choose(m.id);}}>{k==='movement'?'Movement':'Injury mechanism'}</Button>)}</div>
    <input aria-label="Search mechanics" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search movements or mechanisms" className="min-h-11 min-w-[180px] flex-1 rounded-md border border-input bg-card px-3 text-sm"/>
    <select aria-label="Filter region" value={region} onChange={e=>setRegion(e.target.value)} className="min-h-11 max-w-full rounded-md border border-input bg-card px-3 text-sm">{['All regions',...new Set(MECHANICS.filter(m=>m.kind===kind).map(m=>m.region))].map(r=><option key={r}>{r}</option>)}</select>
   </div>
   <div className="mt-5 grid items-start gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
    <nav aria-label="Mechanics library" className="max-h-64 overflow-y-auto border-b border-border pb-4 lg:max-h-[760px] lg:border-b-0 lg:border-r lg:pr-3">
     <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{kind==='movement'?'Movement library':'Injury mechanisms'} · {list.length}</p>
     {list.length===0&&<p className="text-sm text-muted-foreground">No matching sequences.</p>}
     {list.map(m=><Button key={m.id} variant={id===m.id?'secondary':'ghost'} aria-pressed={id===m.id} onClick={()=>choose(m.id)} className="mb-1 h-auto min-h-11 w-full justify-start whitespace-normal py-3 text-left text-sm">{m.name}</Button>)}
    </nav>
    <div className="min-w-0">
     <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="font-journal text-2xl">{current.name}</h2><span className="text-xs font-semibold text-primary">{current.phases.length} phases</span></div>
     <p className="mt-2 text-sm font-semibold">{current.kind==='injury'?'Mechanism animation — educational anatomy, not a diagnosis.':'Illustrative kinematic sequence — not a patient-specific simulation.'}</p>
     <div className="mt-4 grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
      <section aria-label="Animation panel" className="min-w-0">
       <div className="h-[500px] min-h-[380px] overflow-hidden rounded-md border border-border bg-card md:h-[620px]">
        <AnatomyViewer ref={viewer} region="full" dimMode="none" explode={0} isolateSelected={false} layers={layers} opacity={opacity} selected={selected} labels={labels} onSelect={n=>{setSelected(n);setCue(null);}} onLoaded={setMeshNames} relationshipCue={cue} mechanics={{mechanic:current,playing,speed,reduced,seek,onTime:setTime}}/>
       </div>
       <p className="mt-2 text-xs text-muted-foreground">Intact bones move as a simplified rigid overlay. Highlighted soft tissues stay at reference position; they do not contract, stretch or tear. Teal means phase involvement, not tissue damage.</p>
       <div className="mt-4 border-y border-border py-3">
        <div className="flex flex-wrap items-center gap-2">
         <Button size="icon" aria-label={playing?'Pause animation':'Play animation'} title={playing?'Pause':'Play'} disabled={reduced||meshNames.length===0} onClick={()=>setPlaying(v=>!v)}>{playing?<Pause/>:<Play/>}</Button>
         <Button size="icon" variant="outline" aria-label="Replay animation" title="Replay" onClick={()=>{jump(0);if(!reduced)setPlaying(true);}} disabled={meshNames.length===0}><RotateCcw/></Button>
         <Button size="icon" variant="outline" aria-label="Step back" title="Previous phase" onClick={()=>jump((phaseAt(current,time)-1)*PHASE_SECONDS)}><SkipBack/></Button>
         <Button size="icon" variant="outline" aria-label="Step forward" title="Next phase" onClick={()=>jump(Math.min(current.phases.length-1,phaseAt(current,time)+1)*PHASE_SECONDS)}><SkipForward/></Button>
         <span className="ml-1 text-xs text-muted-foreground">{time.toFixed(1)} / {duration(current)} s</span>
         <div role="group" aria-label="Playback speed" className="ml-auto flex gap-1">{SPEEDS.map(s=><Button key={s} size="sm" variant={speed===s?'secondary':'ghost'} aria-pressed={speed===s} onClick={()=>setSpeed(s)}>{s}×</Button>)}</div>
        </div>
        <input type="range" aria-label="Animation timeline" min={0} max={duration(current)-0.001} step={0.05} value={time} onChange={e=>jump(Number(e.target.value))} className="mt-3 min-h-8 w-full accent-primary"/>
        {reduced&&<p role="status" className="text-xs font-semibold text-primary">Reduced motion: continuous playback is disabled. Step or scrub to inspect static keyframes.</p>}
       </div>
       <div role="group" aria-label="Camera controls" className="mt-3 flex flex-wrap gap-2">{(['anterior','posterior','lateral','superior'] as const).map(p=><Button variant="outline" size="sm" key={p} onClick={()=>viewer.current?.preset(p)} className="capitalize">{p}</Button>)}<Button variant="outline" size="sm" onClick={()=>viewer.current?.reset()}>Reset framing</Button></div>
       <fieldset className="mt-4 border-t border-border py-3"><legend className="text-xs font-semibold uppercase text-muted-foreground">Labels</legend><div className="flex flex-wrap gap-2">{(['selected','hover','off'] as const).map(l=><Button size="sm" key={l} variant={labels===l?'secondary':'outline'} aria-pressed={labels===l} onClick={()=>setLabels(l)}>{l==='selected'?'Pinned selection':l==='hover'?'Hover + pinned':'Off'}</Button>)}</div></fieldset>
       <fieldset className="mt-2 border-y border-border py-3"><legend className="text-xs font-semibold uppercase text-muted-foreground">Layers &amp; opacity</legend><div className="grid gap-3 sm:grid-cols-2">{SYSTEMS.map(s=><div key={s.id} className="flex min-w-0 items-center gap-3"><label className="flex min-h-11 w-32 shrink-0 items-center gap-2 text-xs"><input type="checkbox" checked={layers[s.id]} onChange={e=>setLayers(l=>({...l,[s.id]:e.target.checked}))}/>{s.label}</label><input aria-label={`${s.label} opacity`} type="range" min={0.2} max={1} step={0.05} value={opacity[s.id]} onChange={e=>setOpacity(o=>({...o,[s.id]:Number(e.target.value)}))} className="min-w-0 w-full accent-primary"/></div>)}</div></fieldset>
      </section>
      <aside className="min-w-0" aria-label="Phase anatomy">
       <div className="border-l-2 border-primary pl-4" aria-live="polite"><p className="text-xs font-semibold uppercase text-primary">Live phase · {phaseAt(current,time)+1}</p><h3 className="mt-1 font-journal text-xl">{phase.name}</h3><p className="mt-2 text-sm">{phase.action}</p><p className="mt-2 text-sm text-muted-foreground"><strong>Joint position:</strong> {phase.position}</p></div>
       <h3 className="mt-6 text-xs font-semibold uppercase text-muted-foreground">{current.kind==='injury'?'At-risk & involved anatomy':'Active structures & roles'}</h3>
       <ul className="mt-2 divide-y divide-border">{phase.roles.map((role,i)=>{const a=ANATOMY.find(a=>a.id===role.anatomy);if(!a)return null;const real=a.meshes.length>0;return <li key={`${a.id}-${i}`} className="py-3"><Button variant="link" onClick={()=>selectRole(a.id)} className="h-auto justify-start whitespace-normal p-0 text-left">{a.name}</Button><p className="mt-1 text-xs font-semibold text-primary">{role.role} · {role.note}</p><p className="mt-1 text-xs text-muted-foreground">{a.relation}</p><p className="mt-1 text-xs text-muted-foreground">{a.nerve}</p><p className="mt-1 text-xs font-semibold">{real?'Real reference mesh':INDEX_ONLY}</p></li>;})}</ul>
       {selected&&<section aria-label="Selected anatomy" className="mt-4 border-t border-border pt-4"><h3 className="font-semibold">Selected 3D structure</h3><p className="mt-1 break-words text-xs">Exact mesh: {selected}</p><p className="mt-2 text-sm">{selectedEntry?.relation??'Identified directly from the reference model.'}</p><Button variant="outline" size="sm" className="mt-2" onClick={()=>viewer.current?.frameNames([selected])}>Frame selected</Button></section>}
       {cue&&<section aria-label="Index-only anatomy" className="mt-4 border-t border-border pt-4"><h3 className="font-semibold">{cue.name}</h3><p className="mt-2 text-xs">{INDEX_ONLY}</p><p className="mt-2 text-xs text-muted-foreground">Connected relationship cue points to {cue.anchor}; it does not represent an independent ligament mesh.</p></section>}
      </aside>
     </div>
     <section className="mt-6 grid gap-6 border-y border-border py-6 md:grid-cols-2"><div><h3 className="font-journal text-xl">Mechanics &amp; surface orientation</h3><p className="mt-2 text-sm text-muted-foreground">{current.context}</p><p className="mt-3 text-sm"><strong>Joints &amp; bones:</strong> {current.joints}</p><p className="mt-2 text-xs text-muted-foreground">{current.orientation}</p></div><div><h3 className="font-journal text-xl">Associated anatomy &amp; limitations</h3><p className="mt-2 text-sm text-muted-foreground">{current.associated}</p>{current.safety&&<p className="mt-3 text-sm font-semibold">{current.safety}</p>}</div></section>
    </div>
   </div>
   <section className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground"><h2 className="font-journal text-xl text-foreground">Educational reference &amp; model limitations</h2><p className="mt-2">No autoplay. This lab uses approximate bone-bound pivots, simplified single-axis poses and intact, unrigged soft-tissue reference meshes. It does not solve joint contact, muscle activation, strain, injury thresholds, balance or patient-specific biomechanics. Angles are illustrative, not normal-range measurements or exercise targets. No animation establishes an injury or guides treatment.</p><p className="mt-3">Local Z-Anatomy / BodyParts3D reference models. Z-Anatomy: CC BY-SA 4.0; BodyParts3D: CC BY-SA 2.1 Japan. <a href="https://www.z-anatomy.com/" target="_blank" rel="noreferrer" className="underline">Z-Anatomy credits</a> · <a href="https://lifesciencedb.jp/bp3d/" target="_blank" rel="noreferrer" className="underline">BodyParts3D credits</a>. Retained model license details: <Link className="underline" to="/msk-anatomy-atlas">full atlas</Link>.</p></section>
   <nav aria-label="Related anatomy" className="mt-6 flex flex-wrap gap-2"><Button variant="outline" asChild><Link to="/msk-anatomy-atlas"><ArrowLeft/>Full atlas</Link></Button>{[['Shoulder','upper-extremity/shoulder'],['Knee','lower-extremity/knee'],['Ankle & Foot','lower-extremity/ankle-foot']].map(([name,path])=><Button variant="outline" asChild key={path}><Link to={`/msk-anatomy-atlas/${path}`}>{name}</Link></Button>)}</nav>
  </main><Footer/>
 </div>;
}