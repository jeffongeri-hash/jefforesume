import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '@/drone/types';

interface FeaturedCarouselProps {
  projects: Project[];
}

/**
 * Expand-on-hover carousel for featured projects
 * Supports cover videos that autoplay on hover (muted)
 */
export function FeaturedCarousel({ projects }: FeaturedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative w-full max-w-7xl mx-auto px-4 md:px-6"
    >
      {/* Desktop: expand-on-hover */}
      <div className="hidden md:flex w-full items-center justify-center gap-1.5">
        {projects.map((project, index) => (
          <CarouselItem
            key={project.id}
            project={project}
            index={index}
            isActive={activeIndex === index}
            onActivate={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {/* Mobile / narrow: horizontal scroll-snap carousel of folder tiles */}
      <div className="md:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-3 pb-2">
          {projects.map((project, index) => (
            <div key={project.id} className="snap-start shrink-0 w-[78%] xs:w-[68%]">
              <MobileCard project={project} index={index} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function CarouselItem({
  project,
  index,
  isActive,
  onActivate,
}: {
  project: Project;
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleHoverStart = () => {
    onActivate();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleHoverEnd = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <motion.div
      className="relative cursor-pointer overflow-hidden rounded-2xl"
      initial={{ width: '5rem', height: '28rem' }}
      animate={{
        width: isActive ? '28rem' : '5rem',
        height: '28rem',
      }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      onClick={onActivate}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      {/* Gradient overlay on active */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
          />
        )}
      </AnimatePresence>

      {/* Project info overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="absolute bottom-0 left-0 right-0 z-20 p-6"
          >
            <Link to={`/drone/gallery/${project.slug}`} className="block group">
              <h3 className="text-white text-xl md:text-2xl font-light tracking-wide mb-1 group-hover:underline underline-offset-4">
                {project.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-white/70 font-light tracking-wide">
                <span className="capitalize">{project.category}</span>
                <span>•</span>
                <span>{project.year}</span>
                {project.location && (
                  <>
                    <span>•</span>
                    <span>{project.location}</span>
                  </>
                )}
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Number badge on collapsed */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-end justify-center pb-4"
          >
            <span className="text-white/50 text-xs font-light tracking-widest writing-vertical">
              {String(index + 1).padStart(2, '0')}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video layer (plays on hover when active) */}
      {project.coverVideo && (
        <video
          ref={videoRef}
          src={project.coverVideo}
          muted
          loop
          playsInline
          preload="metadata"
          poster={project.coverImage}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Fallback image */}
      <img
        src={project.coverImage}
        className="size-full object-cover"
        alt={project.title}
        loading={index < 3 ? 'eager' : 'lazy'}
      />
    </motion.div>
  );
}

function MobileCard({ project, index }: { project: Project; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTap = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to={`/drone/gallery/${project.slug}`}
        className="group block relative overflow-hidden rounded-xl"
        onClick={(e) => {
          if (project.coverVideo) {
            e.preventDefault();
            handleTap();
          }
        }}
        onDoubleClick={() => {
          window.location.href = `/drone/gallery/${project.slug}`;
        }}
      >
        <div className="aspect-[3/4] relative overflow-hidden bg-muted rounded-xl">
          {project.coverVideo && (
            <video
              ref={videoRef}
              src={project.coverVideo}
              muted
              loop
              playsInline
              preload="metadata"
              poster={project.coverImage}
              className={`absolute inset-0 w-full h-full object-cover z-[1] transition-opacity duration-500 ${
                isPlaying ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading={index < 2 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-[2]" />
          <div className="absolute bottom-0 left-0 right-0 p-5 z-[3]">
            <h3 className="text-white text-lg font-light tracking-wide mb-1">
              {project.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-white/70 font-light">
              <span className="capitalize">{project.category}</span>
              <span>•</span>
              <span>{project.year}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
