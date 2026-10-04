import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore vanta has no types
import CLOUDS from 'vanta/dist/vanta.clouds.min';

const CloudsBackground = ({ className = '' }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let effect: { destroy: () => void } | null = null;
    try {
      effect = CLOUDS({
        el: ref.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        speed: 0.7,
      });
    } catch (e) {
      console.error('Clouds background failed to start', e);
    }
    return () => effect?.destroy();
  }, []);

  return <div ref={ref} aria-hidden="true" className={className} />;
};

export default CloudsBackground;
