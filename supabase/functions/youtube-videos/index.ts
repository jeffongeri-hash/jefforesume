// Supabase Edge Function: supabase/functions/youtube-videos/index.ts
//
// Secrets required (Supabase → Edge Functions → Secrets):
//   YOUTUBE_API_KEY  - your YouTube Data API v3 key
//   YOUTUBE_CHANNEL  - your channel ID (starts with "UC") OR your @handle (e.g. "@yourname")

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
const _unusedCors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PAGE_SIZE = 12;

// Remembered between requests while the function instance is warm,
// so we only look up the uploads playlist once.
let cachedUploadsPlaylistId: string | null = null;

async function getUploadsPlaylistId(apiKey: string, channel: string) {
  if (cachedUploadsPlaylistId) return cachedUploadsPlaylistId;

  // Accept full URLs, @handles, bare handles or UC... ids
  let c = channel.trim();
  const idMatch = c.match(/channel\/(UC[\w-]+)/);
  const handleMatch = c.match(/youtube\.com\/(@[\w.-]+)/);
  if (idMatch) c = idMatch[1];
  else if (handleMatch) c = handleMatch[1];
  c = c.replace(/[/?#].*$/, "");
  const lookup = /^UC[\w-]{20,}$/.test(c)
    ? `id=${encodeURIComponent(c)}`
    : `forHandle=${encodeURIComponent(c.startsWith("@") ? c : "@" + c)}`;

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&${lookup}&key=${apiKey}`
  );
  const data = await res.json();
  const uploads = data?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploads) {
    throw new Error(
      data?.error?.message
        ? `YouTube said: ${data.error.message}`
        : "Could not find channel. Check the YOUTUBE_CHANNEL secret (channel ID or @handle)."
    );
  }
  cachedUploadsPlaylistId = uploads;
  return uploads as string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("YOUTUBE_API_KEY");
    const channel = Deno.env.get("YOUTUBE_CHANNEL");
    if (!apiKey || !channel) {
      // Not configured yet: return an empty list so the page stays quiet.
      return new Response(JSON.stringify({ videos: [], nextPageToken: null, configured: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const pageToken: string | undefined = body?.pageToken;

    const playlistId = await getUploadsPlaylistId(apiKey, channel);

    const params = new URLSearchParams({
      part: "snippet,contentDetails",
      maxResults: String(PAGE_SIZE),
      playlistId,
      key: apiKey,
    });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?${params}`
    );
    const data = await res.json();
    if (res.status === 404) {
      // Channel has no uploads yet — the uploads playlist doesn't exist.
      return new Response(JSON.stringify({ videos: [], nextPageToken: null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!res.ok) {
      throw new Error(data?.error?.message ?? "YouTube API request failed.");
    }

    const videos = (data.items ?? [])
      .filter(
        (item: any) =>
          item.snippet?.title !== "Private video" &&
          item.snippet?.title !== "Deleted video"
      )
      .map((item: any) => ({
        id: item.contentDetails.videoId as string,
        title: item.snippet.title as string,
        publishedAt: (item.contentDetails.videoPublishedAt ??
          item.snippet.publishedAt) as string,
      }));

    return new Response(
      JSON.stringify({ videos, nextPageToken: data.nextPageToken ?? null }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
