import { supabase } from "@/drone/droneClient";

type CoverEntry = { url: string; media_type: "image" | "video" };
let cache: Promise<Record<string, CoverEntry>> | null = null;

export function fetchCovers(): Promise<Record<string, CoverEntry>> {
  if (!cache) {
    cache = (async () => {
      const { data } = await supabase
        .from("project_media")
        .select("project_slug, url, media_type, thumbnail_url")
        .eq("is_cover", true);
      const map: Record<string, CoverEntry> = {};
      (data ?? []).forEach((r) => {
        const useThumb = !!r.thumbnail_url;
        map[r.project_slug] = {
          url: useThumb ? r.thumbnail_url! : r.url,
          media_type: useThumb ? "image" : (r.media_type as "image" | "video"),
        };
      });
      return map;
    })();
  }
  return cache;
}

export function invalidateCovers() {
  cache = null;
}
