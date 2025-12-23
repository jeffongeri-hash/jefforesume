import { useEffect, useState, useRef } from 'react';

interface UseParallaxOptions {
  speed?: number; // 0.1 = slow, 0.5 = normal, 1 = full scroll speed
  direction?: 'up' | 'down';
}

export const useParallax = ({ speed = 0.3, direction = 'up' }: UseParallaxOptions = {}) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const elementTop = rect.top + scrolled;
      const relativeScroll = scrolled - elementTop + window.innerHeight;
      
      if (relativeScroll > 0) {
        const parallaxOffset = relativeScroll * speed * (direction === 'up' ? -1 : 1);
        setOffset(parallaxOffset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return { ref, offset };
};

// Parallax background component for hero sections
interface ParallaxHeroProps {
  children: React.ReactNode;
  className?: string;
  imageUrl?: string;
  speed?: number;
  overlay?: boolean;
}

export const ParallaxHero = ({ 
  children, 
  className = '',
  imageUrl,
  speed = 0.3,
  overlay = true
}: ParallaxHeroProps) => {
  const { ref, offset } = useParallax({ speed });

  return (
    <section ref={ref} className={`relative overflow-hidden ${className}`}>
      {imageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-75"
          style={{ 
            backgroundImage: `url(${imageUrl})`,
            transform: `translateY(${offset}px) scale(1.1)`,
          }}
        />
      )}
      {/* Gradient overlay effect that moves with parallax */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          transform: `translateY(${offset * 0.5}px)`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_40%)]" />
      </div>
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
};

export default useParallax;
