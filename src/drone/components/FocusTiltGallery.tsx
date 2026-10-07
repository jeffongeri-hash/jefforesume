import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { Project } from '@/drone/types';

/**
 * Focus cards + 3D tilt: hovering a card tilts it toward the cursor and
 * pops its title forward, while the other cards blur and shrink.
 */
function TiltCard({
  project,
  index,
  hovered,
  setHovered,
}: {
  project: Project;
  index: number;
  hovered: number | null;
  setHovered: (i: number | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const active = hovered === index;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / 20;
    const y = -(e.clientY - r.top - r.height / 2) / 20;
    el.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };
  const onLeave = () => {
    setHovered(null);
    if (ref.current) ref.current.style.transform = 'rotateY(0deg) rotateX(0deg)';
  };

  return (
    <div
      style={{ perspective: '1000px' }}
      className={cn(
        'transition-all duration-300 ease-out',
        hovered !== null && !active && 'blur-sm scale-[0.98] opacity-80'
      )}
    >
      <Link
        to={`/drone/gallery/${project.slug}`}
        aria-label={`Open ${project.title} gallery`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={onLeave}
        onFocus={() => setHovered(index)}
        onBlur={() => setHovered(null)}
      >
        <div
          ref={ref}
          onMouseMove={onMove}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative h-72 md:h-96 w-full rounded-xl border border-border bg-muted transition-transform duration-200 ease-linear shadow-sm hover:shadow-2xl"
        >
          <div
            className="absolute inset-0 overflow-hidden rounded-xl transition-transform duration-200"
            style={{ transform: active ? 'translateZ(40px)' : 'translateZ(0px)' }}
          >
            {project.coverVideo && active ? (
              <video
                src={project.coverVideo}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={project.coverImage}
                alt={`${project.title} — aerial drone photography`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 p-5 transition-transform duration-200"
            style={{ transform: active ? 'translateZ(90px)' : 'translateZ(0px)' }}
          >
            <p className="text-xs uppercase tracking-[0.25em] text-background/80">
              {project.location ?? project.category} · {project.year}
            </p>
            <h3 className="mt-1 text-xl md:text-2xl font-light tracking-wide text-background">
              {project.title}
            </h3>
            <span
              className={cn(
                'mt-3 inline-block text-xs tracking-wide text-background/90 transition-opacity duration-300',
                active ? 'opacity-100' : 'opacity-0'
              )}
            >
              View gallery →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function FocusTiltGallery({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 lg:px-8">
      {projects.map((p, i) => (
        <TiltCard key={p.id} project={p} index={i} hovered={hovered} setHovered={setHovered} />
      ))}
    </div>
  );
}
