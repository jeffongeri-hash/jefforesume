import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard = ({ children, className, hover = true }: GlassCardProps) => {
  return (
    <div 
      className={cn(
        "relative backdrop-blur-md bg-card/70 dark:bg-card/50 border border-border/50 rounded-xl shadow-lg",
        "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:pointer-events-none",
        hover && "transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 hover:bg-card/80 dark:hover:bg-card/60",
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlassCard;
