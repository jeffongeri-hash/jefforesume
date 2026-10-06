import { NavLink } from 'react-router-dom';
import { projects } from '@/drone/projects';

const cls = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap px-3 py-1.5 text-xs uppercase tracking-[0.2em] rounded-sm transition-colors ${isActive ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`;

export default function DroneNav() {
  return (
    <nav aria-label="Drone section" className="border-b border-border bg-background/95">
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2">
        <NavLink to="/drone" end className={cls}>Overview</NavLink>
        <NavLink to="/drone/gallery" end className={cls}>All galleries</NavLink>
        {projects.map((p) => (
          <NavLink key={p.slug} to={`/drone/gallery/${p.slug}`} className={cls}>{p.title}</NavLink>
        ))}
      </div>
    </nav>
  );
}
