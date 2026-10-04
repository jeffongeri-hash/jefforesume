import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import { cn } from '@/lib/utils';
import headshot from '@/assets/headshot.jpeg';

const caseMix = [
  { name: 'Cardiovascular', value: 60 },
  { name: 'Infectious Disease', value: 55 },
  { name: 'MSK / Trauma', value: 50 },
  { name: 'Abdominal / GI', value: 50 },
  { name: 'Psychiatric', value: 35 },
  { name: 'Neurologic', value: 30 },
];

const credentials = [
  { short: 'PA-C', long: 'NCCPA Board Certified' },
  { short: 'ATLS', long: 'American College of Surgeons' },
  { short: 'ACLS', long: 'American Heart Association' },
  { short: 'PALS', long: 'American Heart Association' },
  { short: 'DEA', long: 'Controlled substance registration' },
  { short: 'CCRA', long: 'Clinical research associate' },
];

const tilts = [-6, 4, -3, 7, -5, 3];

export default function ProfessionalFeatures() {
  const features = [
    {
      title: 'Emergency medicine, at the bedside',
      description: 'High-volume ED rotations across every major system — the case mix below is from my logged encounters.',
      skeleton: <CaseMixSkeleton />,
      className: 'col-span-1 lg:col-span-4 border-b lg:border-r border-border',
    },
    {
      title: 'Certified & credentialed',
      description: 'Board certified with current life-support and trauma credentials.',
      skeleton: <CredentialSkeleton />,
      className: 'col-span-1 lg:col-span-2 border-b border-border',
    },
    {
      title: 'Research & publications',
      description: 'Pharmacogenetics research at Indiana University School of Medicine, with peer-reviewed work.',
      skeleton: <ResearchSkeleton />,
      className: 'col-span-1 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-border',
    },
    {
      title: 'Trained across the Midwest',
      description: 'From Indianapolis research labs to Des Moines emergency departments — open to opportunities nationwide.',
      skeleton: <GlobeSkeleton />,
      className: 'col-span-1 lg:col-span-3',
    },
  ];

  return (
    <section className="py-16 lg:py-24" aria-labelledby="features-heading">
      <div className="container-blog">
        <h2 id="features-heading" className="mx-auto max-w-4xl text-center font-serif text-3xl leading-tight text-ink lg:text-5xl">
          Clinician, researcher, builder
        </h2>
        <p className="mx-auto my-4 max-w-2xl text-center text-sm text-muted-foreground lg:text-base">
          A snapshot of the work — bedside emergency care, credentials, research, and where I've trained.
        </p>
        <div className="mt-12 grid grid-cols-1 rounded-md border border-border bg-card lg:grid-cols-6">
          {features.map((f) => (
            <div key={f.title} className={cn('relative overflow-hidden p-4 sm:p-8', f.className)}>
              <p className="max-w-5xl text-left font-serif text-xl tracking-tight text-ink md:text-2xl md:leading-snug">{f.title}</p>
              <p className="my-2 max-w-sm text-left text-sm text-muted-foreground">{f.description}</p>
              <div className="h-full w-full">{f.skeleton}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const CaseMixSkeleton = () => (
  <div className="relative flex h-full px-2 py-8">
    <div className="mx-auto w-full bg-background p-5 shadow-2xl">
      <p className="kicker mb-4 text-muted-foreground">EM case log · top systems</p>
      <div className="space-y-3">
        {caseMix.map((c) => (
          <div key={c.name}>
            <div className="mb-1 flex justify-between text-xs font-medium text-foreground">
              <span>{c.name}</span>
              <span>{c.value}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(c.value / 60) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent" />
  </div>
);

const CredentialSkeleton = () => (
  <div className="relative flex h-full flex-wrap content-start gap-y-2 overflow-hidden px-2 py-8">
    {credentials.map((c, i) => (
      <div
        key={c.short}
        style={{ transform: `rotate(${tilts[i]}deg)` }}
        className="-mr-3 w-28 shrink-0 rounded-xl border border-border bg-background p-3 shadow-sm transition-transform duration-200 hover:z-10 hover:!rotate-0 hover:scale-110"
      >
        <p className="font-serif text-2xl text-primary">{c.short}</p>
        <p className="mt-1 text-[10px] leading-tight text-muted-foreground">{c.long}</p>
      </div>
    ))}
  </div>
);

const ResearchSkeleton = () => (
  <a href="#publications-heading" className="group/image relative mt-6 block h-full">
    <img
      src={headshot}
      alt="Jefney Ongeri"
      width={800}
      height={600}
      loading="lazy"
      className="aspect-[4/3] h-full w-full rounded-sm object-cover object-top transition-all duration-200 group-hover/image:blur-sm"
    />
    <span className="absolute inset-0 m-auto flex h-fit w-fit items-center rounded-full bg-background/90 px-4 py-2 text-sm font-semibold text-foreground opacity-0 transition-opacity group-hover/image:opacity-100">
      View publications ↓
    </span>
  </a>
);

const GlobeSkeleton = () => (
  <div className="relative mt-10 flex h-60 flex-col items-center">
    <Globe className="absolute -bottom-80 -right-10 md:-bottom-72 md:-right-10" />
  </div>
);

const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    let phi = 0;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1200,
      height: 1200,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 4000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.11, 0.61, 0.71],
      glowColor: [1, 1, 1],
      markers: [
        { location: [41.5868, -93.625], size: 0.1 }, // Des Moines
        { location: [39.7684, -86.1581], size: 0.07 }, // Indianapolis
        { location: [39.9568, -86.0134], size: 0.04 }, // Fishers
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.01;
      },
    });
    return () => globe.destroy();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ width: 600, height: 600, maxWidth: '100%', aspectRatio: 1 }}
      className={className}
    />
  );
};
