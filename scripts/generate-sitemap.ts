// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"

const BASE_URL = "https://jeffongeri.com"

const staticPaths = [
  "/", "/about", "/professional", "/resume", "/accolades", "/contact",
  "/posts", "/investments", "/finance-guides", "/podcast", "/care-abroad", "/care-abroad/timeline", "/msk-anatomy-atlas", "/privacy", "/terms",
]

const postsSrc = readFileSync(resolve("src/pages/AllPosts.tsx"), "utf8")
const slugs = new Set<string>(["finance-retirement", "finance-stocks", "finance-fire"])
for (const m of postsSrc.matchAll(/slug:\s*['"]([a-z0-9-]+)['"]/g)) slugs.add(m[1])

const upperPaths = ["shoulder", "arm", "elbow-forearm"].map(s => `/msk-anatomy-atlas/upper-extremity/${s}`);
const paths = [...staticPaths, ...upperPaths, ...[...slugs].map((s) => `/blog/${s}`)]
const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...paths.map((p) => `  <url><loc>${BASE_URL}${p}</loc></url>`),
  `</urlset>`,
].join("\n")

writeFileSync(resolve("public/sitemap.xml"), xml + "\n")
console.log(`sitemap.xml written (${paths.length} entries)`)
