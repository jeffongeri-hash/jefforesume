import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Camera, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import DroneNav from '@/drone/DroneNav';
import { ScrollReveal } from '@/drone/components/ScrollReveal';
import { getProjectBySlug } from '@/drone/projects';
import { ImageWithLightbox } from '@/drone/components/ImageWithLightbox';
import { Lightbox } from '@/drone/components/Lightbox';
import { supabase } from '@/drone/droneClient';
import type { ProjectImage } from '@/drone/types';
import { fetchCovers } from '@/drone/projectCovers';

/**
 * Project detail page with hero image, gallery, and full-screen lightbox
 * Features smooth animations and immersive image viewing experience
 */
export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<ProjectImage[]>([]);
  const [coverOverride, setCoverOverride] = useState<{ url: string; isVideo: boolean } | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!slug) return;
    fetchCovers().then((map) => {
      const c = map[slug];
      setCoverOverride(c ? { url: c.url, isVideo: c.media_type === 'video' } : null);
    });
  }, [slug, reloadKey]);

  // Live-refresh when admin curates this gallery
  useEffect(() => {
    if (!slug) return;
    const channel = supabase
      .channel(`project_media_${slug}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'project_media', filter: `project_slug=eq.${slug}` },
        () => {
          // invalidate cover cache and bump key
          import('@/drone/projectCovers').then((m) => m.invalidateCovers());
          setReloadKey((k) => k + 1);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      const collected: ProjectImage[] = [];
      const seen = new Set<string>();

      // 1. Files uploaded directly to this gallery's folder
      const { data: files } = await supabase.storage
        .from('media')
        .list(slug, { limit: 200, sortBy: { column: 'created_at', order: 'asc' } });
      (files ?? [])
        .filter((f) => f.name && !f.name.startsWith('.'))
        .forEach((f) => {
          const { data: pub } = supabase.storage
            .from('media')
            .getPublicUrl(`${slug}/${f.name}`);
          if (seen.has(pub.publicUrl)) return;
          seen.add(pub.publicUrl);
          const isVideo = /\.(mp4|mov|webm|m4v)$/i.test(f.name);
          const baseAlt = `${project?.title ?? slug} — aerial ${isVideo ? 'drone video' : 'drone photograph'} by Jefney Ongeri`;
          collected.push({
            id: `up-${f.name}`,
            src: pub.publicUrl,
            alt: baseAlt,
            aspectRatio: 'landscape',
            ...(isVideo ? { videoSrc: pub.publicUrl } : {}),
          });
        });

      // 2. Media explicitly assigned via the admin "Assign to gallery" action
      const { data: assigned } = await supabase
        .from('project_media')
        .select('id, url, media_type')
        .eq('project_slug', slug)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });
      (assigned ?? []).forEach((m) => {
        if (seen.has(m.url)) return;
        seen.add(m.url);
        const isVideo = m.media_type === 'video';
        collected.push({
          id: `assigned-${m.id}`,
          src: m.url,
          alt: '',
          aspectRatio: 'landscape',
          ...(isVideo ? { videoSrc: m.url } : {}),
        });
      });

      setUploadedImages(collected);
    };
    load();
  }, [slug, reloadKey]);

  // 404 if project not found
  if (!project) {
    return <Navigate to="/drone/gallery" replace />;
  }

  const allImages = [...project.images, ...uploadedImages];
  const heroSrc = coverOverride?.url ?? project.coverImage;
  const heroIsVideo = coverOverride?.isVideo ?? false;

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <>
      <Helmet><title>{`${project.title} | Drone Gallery | Jefney Ongeri`}</title><meta name="description" content={project.description} /><link rel="canonical" href={`https://jeffongeri.com/drone/gallery/${project.slug}`} /></Helmet>
      <Header />
      <DroneNav />
      
      <div className="min-h-screen">
        {/* Hero Image - 70vh */}
      <motion.div
        className="relative w-full h-[70vh] overflow-hidden bg-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {heroIsVideo ? (
          <video
            src={heroSrc}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={heroSrc}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        )}
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </motion.div>

      {/* Project Info Section */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Title and Category */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground font-light">
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>{project.year}</span>
              </div>
              <div className="flex items-center gap-2 capitalize">
                <span>•</span>
                <span>{project.category}</span>
              </div>
              {project.location && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    <span>{project.location}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-4">
            <p className="text-lg md:text-xl font-light leading-relaxed text-foreground">
              {project.description}
            </p>
          </div>

          {/* Technical Details */}
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            {project.camera && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-light tracking-wide uppercase text-muted-foreground">
                  <Camera className="size-4" />
                  <span>Camera</span>
                </div>
                <p className="font-light text-foreground">{project.camera}</p>
              </div>
            )}
            {project.client && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-light tracking-wide uppercase text-muted-foreground">
                  <User className="size-4" />
                  <span>Client</span>
                </div>
                <p className="font-light text-foreground">{project.client}</p>
              </div>
            )}
          </div>
        </motion.div>
      </section>

        {/* Image Gallery - Edge to edge */}
        <section className="py-12 md:py-16">
          <div className="space-y-8 md:space-y-12">
            {allImages.map((image, index) => (
              <ScrollReveal key={image.id} delay={index * 0.1}>
                <ImageWithLightbox
                  image={image}
                  onClick={() => openLightbox(index)}
                  priority={index === 0}
                  index={0}
                  className="w-full"
                />
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Lightbox */}
        <Lightbox
          images={allImages}
          currentIndex={currentImageIndex}
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          onNavigate={setCurrentImageIndex}
        />
      </div>
    </>
  );
}
