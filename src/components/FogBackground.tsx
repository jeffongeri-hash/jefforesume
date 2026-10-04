import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-expect-error vanta has no types
import FOG from 'vanta/dist/vanta.fog.min';

const FogBackground = ({ className = '' }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let effect: { destroy: () => void } | null = null;
    try {
      effect = FOG({
        el: ref.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        highlightColor: 0xd200ff,
        midtoneColor: 0x0ffb3,
      });
    } catch (e) {
      console.error('Fog background failed to start', e);
    }
    return () => effect?.destroy();
  }, []);

  return <div ref={ref} aria-hidden="true" className={className} />;
};

export default FogBackground;
