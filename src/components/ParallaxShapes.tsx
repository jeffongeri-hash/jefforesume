import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxShape {
  className: string;
  speed: number;
  initialX?: string;
  initialY?: string;
}

interface ParallaxShapesProps {
  className?: string;
}

const shapes: ParallaxShape[] = [
  {
    className: 'w-40 h-40 rounded-full bg-primary/5 blur-3xl',
    speed: 0.15,
    initialX: '-5rem',
    initialY: '25%',
  },
  {
    className: 'w-56 h-56 rounded-full bg-accent/10 blur-3xl',
    speed: 0.25,
    initialX: 'calc(100% - 3rem)',
    initialY: '60%',
  },
  {
    className: 'w-32 h-32 rounded-full bg-secondary/20 blur-2xl',
    speed: 0.1,
    initialX: '30%',
    initialY: '10%',
  },
  {
    className: 'w-24 h-24 rounded-full border-2 border-primary/10',
    speed: 0.2,
    initialX: '70%',
    initialY: '20%',
  },
  {
    className: 'w-3 h-3 rounded-full bg-accent/40',
    speed: 0.3,
    initialX: '20%',
    initialY: '80%',
  },
  {
    className: 'w-2 h-2 rounded-full bg-primary/30',
    speed: 0.35,
    initialX: '80%',
    initialY: '70%',
  },
];

const ParallaxShapes = ({ className }: ParallaxShapesProps) => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if element is in view
      if (rect.top < windowHeight && rect.bottom > 0) {
        setIsInView(true);
        // Calculate scroll progress relative to the section
        const sectionProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
        setScrollY(sectionProgress);
      } else {
        setIsInView(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
    >
      {shapes.map((shape, index) => {
        const yOffset = isInView ? (scrollY - 0.5) * 200 * shape.speed : 0;
        
        return (
          <div
            key={index}
            className={cn(
              shape.className,
              'absolute transition-transform duration-100 ease-out'
            )}
            style={{
              left: shape.initialX,
              top: shape.initialY,
              transform: `translateY(${yOffset}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

export default ParallaxShapes;
