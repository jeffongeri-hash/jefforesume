import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/libre-baskerville/400.css";
import "@fontsource/libre-baskerville/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "./index.css";

// Clean addresses shared with stray trailing line breaks/spaces (e.g. ".../face%0A").
{
  const raw = window.location.pathname;
  const cleaned = raw.replace(/(%0A|%0D|%20|%09|\s)+$/gi, "");
  if (cleaned !== raw && cleaned.length > 0) {
    window.history.replaceState(null, "", cleaned + window.location.search + window.location.hash);
  }
}

createRoot(document.getElementById("root")!).render(<App />);
