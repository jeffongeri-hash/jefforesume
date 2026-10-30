import { useEffect, useRef, useState, type ComponentType } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { PATHO_HUB_PATH, SPEEDS, type Phase as BowelPhase } from '@/data/pathophysiology/bowelPerforation';

export type SceneExtraProps = { variant?: string; side?: 'left' | 'right' };
export type CompanionProps = { time: number; normal: boolean; variant: string; side: 'left' | 'right'; phaseIndex: number; reduced: boolean };
export type LessonConfig = { variants?: { param: string; legend: string; options: { id: string; label: string; hint: string }[] }; sides?: { param: string; legend: string; hideFor?: string[] }; Companion?: ComponentType<CompanionProps>; companionTitle?: string; path: string; lessonNo: number; title: string; metaTitle: string; metaDescription: string; ogDescription: string; crumb: string; normalTitle?: string; intro: string; variationsIntro: string; variationsTitle?: string; extra?: { title: string; items: string[] }[]; data: { phasesFor?: (variant: string) => (Omit<BowelPhase, 'focus'> & { focus: string[] })[]; LESSON_DURATION: number; PHASES: (Omit<BowelPhase, 'focus'> & { focus: string[] })[]; STRUCTURES: Record<string, { label: string; explanation: string }>; VARIATIONS: { title: string; text: string }[]; CANNOT_DETERMINE: string[]; ESCALATION_NOTE: string; SOURCES: { name: string; url: string }[]; clampTime: (t: number) => number; phaseAt: (t: number) => number; phaseStart: (i: number) => number; tick: (t: number, dt: number, s: number) => { time: number; playing: boolean } }; Scene: ComponentType<{ time: number; normal?: boolean; compact?: boolean; showLabels: boolean; selected: any; onSelect: (id: any) => void; title?: string } & SceneExtraProps> };

export default function PathoLessonPage({ config }: { config: LessonConfig }) {
  const [params, setParams] = useSearchParams();
  const vOpts = config.variants?.options ?? [];
  const variant = (config.variants && vOpts.find(o => o.id === params.get(config.variants!.param))?.id) ?? vOpts[0]?.id ?? '';
  const side: 'left' | 'right' = config.sides && params.get(config.sides.param) === 'right' ? 'right' : 'left';
  const setParam = (k: string, v: string) => { const n = new URLSearchParams(params); n.set(k, v); setParams(n, { replace: true }); };
  const showSides = !!config.sides && !(config.sides.hideFor ?? []).includes(variant);
  const { LESSON_DURATION, STRUCTURES, VARIATIONS, CANNOT_DETERMINE, ESCALATION_NOTE, SOURCES, clampTime, phaseAt, phaseStart, tick } = config.data; const Scene = config.Scene; const PHASES = config.data.phasesFor ? config.data.phasesFor(variant) : config.data.PHASES; const Companion = config.Companion;
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [reduced, setReduced] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [compare, setCompare] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const timeRef = useRef(0);
  timeRef.current = time;

  useEffect(() => { const m = matchMedia('(prefers-reduced-motion: reduce)'); if (m.matches) setReduced(true); }, []);
  useEffect(() => { if (reduced) setPlaying(false); }, [reduced]);
  useEffect(() => {
    if (!playing || reduced) return;
    let raf = 0, last = performance.now();
    const run = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      const r = tick(timeRef.current, dt, speed);
      setTime(r.time);
      if (!r.playing) { setPlaying(false); return; }
      raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [playing, reduced, speed]);

  const index = phaseAt(time), phase = PHASES[index];
  const seek = (t: number) => { setPlaying(false); setTime(clampTime(t)); };
  const goPhase = (i: number) => seek(phaseStart(i) + 4.9); // land on the fully developed state of each phase
  const togglePlay = () => { if (time >= LESSON_DURATION - 0.01) setTime(0); setPlaying(p => !p); };
  const info = selected ? STRUCTURES[selected] : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{config.metaTitle}</title>
        <meta name="description" content={config.metaDescription} />
        <link rel="canonical" href={`https://jeffongeri.com${config.path}`} />
        <meta property="og:title" content={config.title} />
        <meta property="og:description" content={config.ogDescription} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary" />
      </Helmet>
      <Header />
      <main id="main-content" className="dark patho-theme bg-background text-foreground">
        <div className="mx-auto max-w-[1450px] px-4 py-8 md:px-6">
          <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-xs text-muted-foreground"><Link className="hover:text-foreground" to="/physiology-animation-lab">Physiology Lab</Link><span>/</span><Link className="hover:text-foreground" to={PATHO_HUB_PATH}>Emergency Pathophysiology Atlas</Link><span>/</span><span className="text-foreground">{config.crumb}</span></nav>
          <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Emergency Pathophysiology Atlas · Lesson {config.lessonNo}</p>
          <h1 className="mt-2 font-journal text-3xl md:text-5xl">{config.title}</h1>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">{config.intro}</p>

          <div className="mt-6 grid items-start gap-7 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
            <section aria-label="Animated conceptual scene" className="min-w-0">
              {(config.variants || showSides) && <div className="mb-3 flex flex-wrap gap-x-6 gap-y-3 rounded-lg border border-border bg-card p-3">
                {config.variants && <fieldset><legend className="text-xs font-semibold uppercase text-muted-foreground">{config.variants.legend}</legend><div role="radiogroup" aria-label={config.variants.legend} className="mt-1 flex flex-wrap gap-1">{vOpts.map(o => <Button key={o.id} size="sm" role="radio" aria-checked={variant === o.id} variant={variant === o.id ? 'secondary' : 'outline'} title={o.hint} onClick={() => setParam(config.variants!.param, o.id)} className="min-h-9">{o.label}</Button>)}</div><p className="mt-1 max-w-xl text-xs text-muted-foreground">{vOpts.find(o => o.id === variant)?.hint}</p></fieldset>}
                {showSides && <fieldset><legend className="text-xs font-semibold uppercase text-muted-foreground">{config.sides!.legend}</legend><div role="radiogroup" aria-label={config.sides!.legend} className="mt-1 flex gap-1">{(['left', 'right'] as const).map(sd => <Button key={sd} size="sm" role="radio" aria-checked={side === sd} variant={side === sd ? 'secondary' : 'outline'} onClick={() => setParam(config.sides!.param, sd)} className="min-h-9 capitalize">{sd} hemisphere</Button>)}</div></fieldset>}
              </div>}
              <div className={compare ? 'grid gap-3 md:grid-cols-2' : ''}>
                {compare && <figure><figcaption className="mb-1 text-xs font-semibold text-muted-foreground">Normal reference</figcaption><Scene variant={variant} side={side} time={time} normal compact showLabels={showLabels} selected={selected} onSelect={setSelected} title={config.normalTitle ?? "Normal reference: intact bowel and peritoneum"} /></figure>}
                <figure><figcaption className={compare ? 'mb-1 text-xs font-semibold text-muted-foreground' : 'sr-only'}>Phase {index + 1}: {phase.short}</figcaption><Scene variant={variant} side={side} time={time} showLabels={showLabels} selected={selected} onSelect={setSelected} /></figure>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Tap or press Enter on any structure to pin its explanation.</p>

              <div className="mt-4 rounded-lg border border-border bg-card p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="icon" aria-label={playing ? 'Pause' : 'Play'} disabled={reduced} onClick={togglePlay}>{playing ? <Pause /> : <Play />}</Button>
                  <Button size="icon" variant="outline" aria-label="Restart" onClick={() => seek(0)}><RotateCcw /></Button>
                  <Button size="icon" variant="outline" aria-label="Previous phase" disabled={index === 0} onClick={() => goPhase(index - 1)}><SkipBack /></Button>
                  <Button size="icon" variant="outline" aria-label="Next phase" disabled={index === PHASES.length - 1} onClick={() => goPhase(index + 1)}><SkipForward /></Button>
                  <span className="text-xs tabular-nums text-muted-foreground">Phase {index + 1}/5 · {time.toFixed(1)}s / {LESSON_DURATION}s</span>
                  <div role="group" aria-label="Playback speed" className="ml-auto flex gap-1">{SPEEDS.map(sp => <Button key={sp} size="sm" variant={speed === sp ? 'secondary' : 'ghost'} aria-pressed={speed === sp} onClick={() => setSpeed(sp)}>{sp}×</Button>)}</div>
                </div>
                <input type="range" aria-label="Lesson timeline" min={0} max={LESSON_DURATION - 0.001} step={0.05} value={time} onChange={e => seek(Number(e.target.value))} className="mt-3 min-h-9 w-full accent-primary" />
                <div className="grid grid-cols-5 gap-1 text-[10px] text-muted-foreground sm:text-xs">{PHASES.map((p, i) => <button key={p.id} type="button" onClick={() => goPhase(i)} aria-current={i === index ? 'step' : undefined} className={`min-h-9 rounded px-1 text-left ${i === index ? 'bg-secondary font-semibold text-secondary-foreground' : 'hover:text-foreground'}`}>{i + 1}. {p.short}</button>)}</div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  <label className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={showLabels} onChange={e => setShowLabels(e.target.checked)} />Show labels</label>
                  <label className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={compare} onChange={e => setCompare(e.target.checked)} />Compare with normal</label>
                  <label className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={reduced} onChange={e => setReduced(e.target.checked)} />Reduced motion</label>
                </div>
                {reduced && <p role="status" className="text-xs font-semibold">Reduced motion on: playback disabled. Use phase steps or the scrubber to view each static state.</p>}
              </div>

              {Companion && <section aria-label={config.companionTitle ?? 'Linked demonstration'} className="mt-6 rounded-lg border border-border bg-card p-4"><h2 className="font-journal text-2xl">{config.companionTitle ?? 'Linked demonstration'}</h2><Companion time={time} normal={false} variant={variant} side={side} phaseIndex={index} reduced={reduced} /></section>}
              <section aria-label="Clinical signals" className="mt-6 rounded-lg border border-border bg-card p-4" aria-live="polite">
                <h2 className="font-journal text-2xl">Clinical Signals — phase {index + 1}</h2>
                <h3 className="mt-3 text-xs font-semibold uppercase text-muted-foreground">Bedside context</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{phase.bedside.map(b => <li key={b}>{b}</li>)}</ul>
                <h3 className="mt-4 text-xs font-semibold uppercase text-muted-foreground">Lab trends — mechanism and limits</h3>
                <div className="mt-2 grid gap-3 md:grid-cols-2">{phase.labs.map(l => <div key={l.name} className="rounded border border-border p-3"><p className="text-sm font-semibold">{l.name} <span className="font-normal text-muted-foreground">· {l.trend}</span></p><p className="mt-1 text-xs"><strong>Why:</strong> {l.mechanism}</p><p className="mt-1 text-xs text-muted-foreground"><strong>Limit:</strong> {l.limit}</p></div>)}</div>
                <p className="mt-3 text-xs text-muted-foreground">Directional trends only — no thresholds or patient values. No single lab proves or excludes a diagnosis.</p>
              </section>
            </section>

            <aside className="min-w-0 space-y-5">
              <div aria-live="polite" className="border-l-2 border-primary pl-4">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Phase {index + 1} / 5</p>
                <h2 className="mt-1 font-journal text-xl">{phase.name}</h2>
                <p className="mt-2 text-sm leading-relaxed">{phase.explanation}</p>
                <p className="mt-2 text-xs text-muted-foreground">Focus: {phase.focus.map(f => STRUCTURES[f].label).join(', ')}</p>
              </div>
              <section aria-label="Pinned structure" className="rounded-lg border border-border bg-card p-4">
                {info ? <><div className="flex items-start justify-between gap-2"><h2 className="font-semibold">{info.label}</h2><Button size="sm" variant="ghost" onClick={() => setSelected(null)} aria-label="Clear pinned structure">Clear</Button></div><p className="mt-2 text-sm">{info.explanation}</p></> : <p className="text-sm text-muted-foreground">No structure pinned. Select one in the scene or below.</p>}
                <div className="mt-3 flex flex-wrap gap-1">{Object.keys(STRUCTURES).map(id => <Button key={id} size="sm" variant={selected === id ? 'secondary' : 'outline'} aria-pressed={selected === id} onClick={() => setSelected(id)} className="h-auto min-h-9 whitespace-normal text-xs">{STRUCTURES[id].label}</Button>)}</div>
              </section>
              <section aria-label="What this model cannot determine" className="rounded-lg border-2 border-dashed border-border p-4">
                <h2 className="font-journal text-lg">What this model cannot determine</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{CANNOT_DETERMINE.map(c => <li key={c}>{c}</li>)}</ul>
              </section>
              <section aria-label="Emergency escalation note" className="rounded-lg border border-destructive/60 bg-destructive/10 p-4"><h2 className="text-sm font-semibold">Emergency escalation</h2><p className="mt-1 text-sm">{ESCALATION_NOTE}</p></section>
            </aside>
          </div>

          <section className="mt-8 border-t border-border pt-6"><h2 className="font-journal text-2xl">{config.variationsTitle ?? "Variations and limitations"}</h2><p className="mt-2 max-w-3xl text-sm text-muted-foreground">{config.variationsIntro}</p><dl className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{VARIATIONS.map(x => <div key={x.title} className="rounded border border-border p-3"><dt className="text-sm font-semibold">{x.title}</dt><dd className="mt-1 text-sm text-muted-foreground">{x.text}</dd></div>)}</dl></section>
          {config.extra?.map(x => <section key={x.title} aria-label={x.title} className="mt-8 border-t border-border pt-6"><h2 className="font-journal text-2xl">{x.title}</h2><ul className="mt-3 max-w-4xl list-disc space-y-2 pl-5 text-sm">{x.items.map(i => <li key={i}>{i}</li>)}</ul></section>)}
          <section className="mt-8 border-t border-border py-6"><h2 className="font-journal text-2xl">Sources</h2><ul className="mt-3 space-y-2 text-sm">{SOURCES.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="underline hover:text-primary">{s.name} ↗</a></li>)}</ul><p className="mt-3 text-xs text-muted-foreground">Source-informed educational synthesis by Jefney Ongeri, PA-C. Simplified; omits clinical heterogeneity.</p></section>
          <nav aria-label="Related" className="flex flex-wrap gap-3 pb-6"><Button asChild variant="outline"><Link to={PATHO_HUB_PATH}>All pathophysiology lessons</Link></Button><Button asChild variant="outline"><Link to="/physiology-animation-lab">Physiology Animation Lab</Link></Button></nav>
        </div>
      </main>
      <Footer />
    </div>
  );
}
