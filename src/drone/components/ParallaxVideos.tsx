import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import type { ProjectImage } from '@/drone/types';

type Item = { media: ProjectImage; index: number };

/** Three columns that drift in opposite directions as the page scrolls. */
export function ParallaxVideos({ items, onOpen }: { items: Item[]; onOpen: (index: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const up = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const down = useTransform(scrollYProgress, [0, 1], [-120, 120]);

  const third = Math.ceil(items.length / 3);
  const cols = [items.slice(0, third), items.slice(third, 2 * third), items.slice(2 * third)];
  const motions: MotionValue<number>[] = [up, down, up];

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-6xl mx-auto gap-8 py-24 px-6">
      {cols.map((col, c) => (
        <div key={c} className="grid gap-8">
          {col.map(({ media, index }) => (
            <motion.button
              key={media.id}
              style={{ y: motions[c] }}
              onClick={() => onOpen(index)}
              aria-label={`Play ${media.alt || 'drone video'} full screen`}
              className="block w-full overflow-hidden rounded-lg border border-border bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <video
                src={media.videoSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="h-80 w-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      ))}
    </div>
  );
}
