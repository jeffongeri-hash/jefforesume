import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const BASE = "https://jeffongeri.com";

// Head tags for pages that don't set their own title/description/canonical.
const META: Record<string, { title: string; description: string }> = {
  "/podcast": {
    title: "Podcast | Jefney Ongeri, PA-C",
    description: "Conversations from Jefney Ongeri, PA-C on emergency medicine, PA career growth, and personal finance for clinicians.",
  },
  "/iv-strike-selector": {
    title: "IV Strike Selector — Options Strike Calculator | Jefney Ongeri",
    description: "Pick option strikes using implied volatility, expected move, and probability ranges. A free options planning tool.",
  },
  "/covered-call-master": {
    title: "Covered Call Master — Premium & Return Calculator | Jefney Ongeri",
    description: "Compare covered call strikes and expirations by premium, annualized return, and assignment risk.",
  },
  "/paycheck-analyzer": {
    title: "Paycheck Analyzer — Take-Home Pay Breakdown | Jefney Ongeri",
    description: "Break down a paycheck into taxes, retirement contributions, and take-home pay to plan your monthly budget.",
  },
  "/ca-move-planner": {
    title: "California Move Planner for Clinicians | Jefney Ongeri",
    description: "Plan a move to California: cost of living, licensing steps, taxes, and budgeting for healthcare professionals.",
  },
  "/sacramento-healthcare": {
    title: "Sacramento Healthcare Hub | Jefney Ongeri, PA-C",
    description: "A guide to Sacramento-area hospitals, emergency departments, and healthcare employers for physician assistants.",
  },
  "/search": {
    title: "Search | Jefney Ongeri, PA-C",
    description: "Search articles and clinical atlases by Jefney Ongeri, PA-C.",
  },
};

const RouteSeo = () => {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/$/, "") || "/";
  const meta = META[path];
  if (!meta) return null;
  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={`${BASE}${path}`} />
      <link rel="canonical" href={`${BASE}${path}`} />
    </Helmet>
  );
};

export default RouteSeo;
