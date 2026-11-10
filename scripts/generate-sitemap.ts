// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"

const BASE_URL = "https://jeffongeri.com"

const staticPaths = [
  "/pathophysiology-atlas/traumatic-intracranial-hemorrhage", "/pathophysiology-atlas/pelvic-fracture-hemorrhage", "/pathophysiology-atlas/open-fracture",
  "/pathophysiology-atlas/infantile-pyloric-stenosis", "/pathophysiology-atlas/malrotation-midgut-volvulus", "/pathophysiology-atlas/pediatric-dehydration",
  "/pathophysiology-atlas/cardiogenic-shock", "/pathophysiology-atlas/obstructive-shock", "/pathophysiology-atlas/anaphylactic-shock",
  "/pathophysiology-atlas/stevens-johnson-ten", "/pathophysiology-atlas/dress-syndrome", "/pathophysiology-atlas/thermal-burn-injury",
  "/pathophysiology-atlas/acute-angle-closure", "/pathophysiology-atlas/retinal-detachment", "/pathophysiology-atlas/orbital-cellulitis", "/pathophysiology-atlas/peritonsillar-abscess",
  "/pathophysiology-atlas/acute-compartment-syndrome", "/pathophysiology-atlas/traumatic-vascular-injury", "/pathophysiology-atlas/tension-pneumothorax",
  "/pathophysiology-atlas/tetralogy-of-fallot", "/pathophysiology-atlas/measles-complications",
  "/pathophysiology-atlas/intussusception", "/pathophysiology-atlas/critical-congenital-heart-disease",
  "/pathophysiology-atlas/ureteral-stones", "/pathophysiology-atlas/acute-urinary-retention",
  "/pathophysiology-atlas/pyelonephritis-urosepsis", "/pathophysiology-atlas/scrotal-pathophysiology",
  "/pathophysiology-atlas/immune-response", "/pathophysiology-atlas/antimicrobial-mechanisms",
  "/pathophysiology-atlas/bacterial-meningitis",
  "/pathophysiology-atlas/necrotizing-soft-tissue-infection",
  "/pathophysiology-atlas/febrile-neutropenia",
  "/pathophysiology-atlas/infective-endocarditis",
  "/pathophysiology-atlas/blood-cell-disorders", "/pathophysiology-atlas/inherited-bleeding-and-clotting",
  "/pathophysiology-atlas/arterial-venous-flow-avm",
  "/pathophysiology-atlas/hemostasis-and-antithrombotics",
  "/pathophysiology-atlas/disseminated-intravascular-coagulation",
  "/pathophysiology-atlas/adrenal-crisis",
  "/pathophysiology-atlas/hyperosmolar-hyperglycemic-state",
  "/pathophysiology-atlas/severe-hypoglycemia",
  "/pathophysiology-atlas/myxedema-coma",
  "/pathophysiology-atlas/acute-kidney-injury",
  "/pathophysiology-atlas/hyperkalemia",
  "/pathophysiology-atlas/acid-base-disorders",
  "/pathophysiology-atlas/rhabdomyolysis",
  "/pathophysiology-atlas/hyponatremia",
  "/pathophysiology-atlas/hypernatremia",
  "/pathophysiology-atlas/opioid-toxicity", "/pathophysiology-atlas/acetaminophen-toxicity", "/pathophysiology-atlas/salicylate-toxicity", "/pathophysiology-atlas/toxic-alcohols", "/pathophysiology-atlas/carbon-monoxide-cyanide", "/pathophysiology-atlas/envenomation", "/pathophysiology-atlas/environmental-emergencies",
  "/pathophysiology-atlas/thyroid-storm",
  "/pathophysiology-atlas/status-epilepticus",
  "/pathophysiology-atlas/spinal-cord-pathways-injury",
  "/pathophysiology-atlas/acute-mesenteric-ischemia",
  "/pathophysiology-atlas/bowel-obstruction", "/pathophysiology-atlas/intra-abdominal-abscess",
  "/pathophysiology-atlas/diabetic-ketoacidosis",
  "/pathophysiology-atlas/hemorrhagic-shock",
  "/pathophysiology-atlas/ear-examination", "/pathophysiology-atlas/eye-inflammation-examination", "/pathophysiology-atlas/nose-throat-examination",
  "/pathophysiology-atlas/skin-infection-swelling", "/pathophysiology-atlas/obstetric-emergencies", "/pathophysiology-atlas/vascular-emergencies",
  "/dermatology-atlas", "/dermatology-atlas/conditions", "/dermatology-atlas/medications", "/dermatology-atlas/skincare",
  "/pathophysiology-atlas/ectopic-pregnancy",
  "/pathophysiology-atlas/bronchiolitis", "/pathophysiology-atlas/asthma-exacerbation", "/pathophysiology-atlas/copd-exacerbation", "/pathophysiology-atlas/pulmonary-hypertension",
  "/pathophysiology-atlas/upper-airway-obstruction",
  "/", "/about", "/professional", "/resume", "/accolades", "/contact", "/msk-anatomy-atlas/movement-injury", "/physiology-animation-lab", "/pathophysiology-atlas", "/pathophysiology-atlas/bowel-perforation", "/pathophysiology-atlas/retropharyngeal-abscess", "/pathophysiology-atlas/sepsis-distributive-shock", "/pathophysiology-atlas/lad-occlusion-myocardial-infarction", "/pathophysiology-atlas/mca-ischemic-stroke", "/pathophysiology-atlas/hemorrhagic-stroke",
  "/posts", "/investments", "/finance-guides", "/podcast", "/care-abroad", "/care-abroad/timeline", "/msk-anatomy-atlas", "/privacy", "/terms",
]

const postsSrc = readFileSync(resolve("src/pages/AllPosts.tsx"), "utf8")
const slugs = new Set<string>(["finance-retirement", "finance-stocks", "finance-fire"])
for (const m of postsSrc.matchAll(/slug:\s*['"]([a-z0-9-]+)['"]/g)) slugs.add(m[1])

const upperPaths = ["shoulder", "arm", "elbow-forearm", "wrist-hand"].map(s => `/msk-anatomy-atlas/upper-extremity/${s}`);
const paths = [...staticPaths, "/msk-anatomy-atlas/axial/neck", "/msk-anatomy-atlas/axial/back", "/msk-anatomy-atlas/axial/face", "/msk-anatomy-atlas/lower-extremity/hip-pelvis", "/msk-anatomy-atlas/lower-extremity/thigh", "/msk-anatomy-atlas/lower-extremity/knee", "/msk-anatomy-atlas/lower-extremity/calf", "/msk-anatomy-atlas/lower-extremity/ankle-foot", ...upperPaths, ...[...slugs].map((s) => `/blog/${s}`)]
const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...paths.map((p) => `  <url><loc>${BASE_URL}${p}</loc></url>`),
  `</urlset>`,
].join("\n")

writeFileSync(resolve("public/sitemap.xml"), xml + "\n")
console.log(`sitemap.xml written (${paths.length} entries)`)
