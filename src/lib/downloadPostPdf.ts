// Utility to trigger a print-to-PDF flow for a blog post.
// If the post content includes an embed iframe (/embeds/*.html), we open that
// same-origin embed in a new window and call print() on it so the user can
// save it as a PDF. Otherwise we fall back to printing the current page.
export function extractEmbedUrl(html: string | undefined): string | null {
  if (!html) return null;
  const m = html.match(/\/embeds\/[a-z0-9-]+\.html/i);
  return m ? m[0] : null;
}

export function downloadPostPdf(embedUrl: string | null, title: string) {
  if (embedUrl) {
    const w = window.open(embedUrl, "_blank");
    if (!w) return;
    const onReady = () => {
      try {
        w.document.title = title;
      } catch {
        /* ignore */
      }
      w.focus();
      // Small delay lets fonts/layout settle before the print dialog opens.
      setTimeout(() => w.print(), 400);
    };
    w.addEventListener("load", onReady);
    // Fallback in case load already fired.
    setTimeout(() => {
      if (w.document.readyState === "complete") onReady();
    }, 1200);
    return;
  }
  const prevTitle = document.title;
  document.title = title;
  window.print();
  setTimeout(() => {
    document.title = prevTitle;
  }, 1000);
}