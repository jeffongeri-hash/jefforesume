import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Video = {
  id: string;
  title: string;
  publishedAt: string;
};

type VideosPage = {
  videos: Video[];
  nextPageToken: string | null;
};

async function fetchVideos(pageToken?: string): Promise<VideosPage> {
  const { data, error } = await supabase.functions.invoke("youtube-videos", {
    body: { pageToken },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data as VideosPage;
}

function VideoCard({ video }: { video: Video }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [inView, setInView] = useState(false);
  const [muted, setMuted] = useState(true);

  // Play when ~60% visible, unload when scrolled away (saves bandwidth)
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) setMuted(true);
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggleSound = () => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: muted ? "unMute" : "mute",
        args: [],
      }),
      "*"
    );
    setMuted(!muted);
  };

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: video.id, // required for looping a single video
    controls: "0",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    enablejsapi: "1", // lets the sound button work
  });

  return (
    <div
      ref={cardRef}
      className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-foreground shadow-lg"
    >
      {/* Thumbnail shows instantly and stays as the fallback if autoplay is blocked */}
      <img
        src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
        alt={video.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Player only exists while the card is on screen */}
      {inView && (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube-nocookie.com/embed/${video.id}?${params}`}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      )}

      {inView && (
        <button
          onClick={toggleSound}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="absolute bottom-3 right-3 z-10 rounded-full bg-foreground/70 px-3 py-1.5 text-sm text-background backdrop-blur hover:bg-foreground/90"
        >
          {muted ? "🔇 Tap for sound" : "🔊 Sound on"}
        </button>
      )}

      <div className="pointer-events-none absolute left-0 right-0 top-0 bg-gradient-to-b from-foreground/70 to-transparent p-3">
        <p className="line-clamp-2 text-sm font-medium text-background">
          {video.title}
        </p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="aspect-[9/16] w-full animate-pulse rounded-xl bg-muted" />
  );
}

export default function VideoGallery() {
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["youtube-videos"],
    queryFn: ({ pageParam }) => fetchVideos(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken ?? undefined,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const videos = data?.pages.flatMap((p) => p.videos) ?? [];
  if (error || (!isLoading && videos.length === 0)) return null;

  return (
    <section className="py-12 md:py-16 border-t border-border"><div className="max-w-7xl mx-auto px-6 lg:px-8">
      <h2 className="text-2xl md:text-3xl font-light tracking-wide">Video work</h2><p className="text-sm text-muted-foreground font-light mt-1 mb-8">Latest uploads from YouTube</p>

      {error && (
        <p className="rounded-lg border border-destructive/40 p-4 text-sm text-destructive">
          Couldn't load videos right now. Please try again later.
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={`more-${i}`} />
          ))}
      </div>

      {hasNextPage && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div></section>
  );
}
