import { useEffect, useState } from 'react';
import { projects } from '@/drone/projects';
import { FocusTiltGallery } from '@/drone/components/FocusTiltGallery';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import DroneNav from '@/drone/DroneNav';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { photographerInfo } from '@/drone/photographer';
import { supabase } from '@/drone/droneClient';
import VideoGallery from '@/drone/components/VideoGallery';

const INSTAGRAM_REELS = [
  'https://www.instagram.com/reel/DZQtCNno2zx/',
  'https://www.instagram.com/reel/DZRLZsRIBg9/',
];

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

/**
 * Portfolio page with expand-on-hover carousel
 * Features smooth animations, video hover autoplay, and responsive layout
 */
export default function Portfolio() {
  const nonDroneCategories = new Set(['botanical', 'edits', 'travel']);
  const [otherSlugs, setOtherSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('project_media')
      .select('project_slug, kind')
      .then(({ data }) => {
        if (cancelled || !data) return;
        const map = new Map<string, { drone: number; other: number }>();
        data.forEach((r: { project_slug: string; kind: string | null }) => {
          const cur = map.get(r.project_slug) ?? { drone: 0, other: 0 };
          if (r.kind === 'other') cur.other++;
          else cur.drone++;
          map.set(r.project_slug, cur);
        });
        const others = new Set<string>();
        map.forEach((v, slug) => {
          if (v.other > 0 && v.other >= v.drone) others.add(slug);
        });
        setOtherSlugs(others);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isOther = (slug: string, category: string) =>
    otherSlugs.has(slug) || nonDroneCategories.has(category);

  const droneWork = projects.filter((p) => !isOther(p.slug, p.category));
  const otherWork = projects.filter((p) => isOther(p.slug, p.category));

  // Load Instagram embed script and (re)process embeds on mount
  useEffect(() => {
    const SCRIPT_SRC = 'https://www.instagram.com/embed.js';
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    );
    const process = () => window.instgrm?.Embeds.process();

    if (existing) {
      process();
    } else {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = process;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      <Helmet><title>Drone Galleries | Jefney Ongeri</title><meta name="description" content="Aerial drone photography and videography galleries by Jefney Ongeri from Waterloo, Cedar Falls and across Iowa." /><link rel="canonical" href="https://jeffongeri.com/drone/gallery" /></Helmet>
      <Header />
      <DroneNav />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 px-6 lg:px-8 border-b border-border">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-wide mb-4">
                Iowa Aerial Photography & Videography Portfolio
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide max-w-2xl mx-auto">
                A curated collection of drone work from Waterloo, Cedar Falls, and across Iowa
              </p>
            </motion.div>
          </div>
        </section>

        {/* Drone work */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-light tracking-wide">Drone work</h2>
            <p className="text-sm text-muted-foreground font-light mt-1">
              Aerial photography and videography
            </p>
          </div>
          <FocusTiltGallery projects={droneWork} />
        </section>

        {otherWork.length > 0 && (
          <section className="py-12 md:py-16 border-t border-border">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-light tracking-wide">Other work</h2>
              <p className="text-sm text-muted-foreground font-light mt-1">
                Botanical studies and short-form edits
              </p>
            </div>
            <FocusTiltGallery projects={otherWork} />
          </section>
        )}

        <VideoGallery />

        {/* Instagram Feed CTA */}
        <section className="py-16 md:py-24 px-6 lg:px-8 border-t border-border">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Latest Aerial Work</p>
              <h2 className="text-3xl md:text-5xl font-light tracking-wide">
                Follow on Instagram
              </h2>
              <a
                href={photographerInfo.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-lg md:text-xl text-muted-foreground hover:text-foreground transition-colors font-light tracking-wide"
              >
                @motionfromabove
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 justify-items-center"
            >
              {INSTAGRAM_REELS.map((url) => (
                <blockquote
                  key={url}
                  className="instagram-media w-full max-w-[540px]"
                  data-instgrm-captioned
                  data-instgrm-permalink={url}
                  data-instgrm-version="14"
                  style={{ background: '#FFF', border: 0, margin: 0, padding: 0 }}
                >
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    View this Reel on Instagram
                  </a>
                </blockquote>
              ))}
            </motion.div>

            <a
              href={photographerInfo.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-sm text-sm font-light tracking-wide hover:bg-foreground hover:text-background transition-colors"
            >
              <Instagram className="size-4" />
              View More on Instagram
            </a>
          </div>
        </section>

        {/* Bottom spacing */}
        <div className="h-24" />
      </div>
    </>
  );
}
