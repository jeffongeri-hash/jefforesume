import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import BlogCard from '@/components/BlogCard';
import SocialShare from '@/components/SocialShare';
import ReadingProgress from '@/components/ReadingProgress';
import BackToTop from '@/components/BackToTop';
import TaxCalculator from '@/components/TaxCalculator';
import SuburbCalculator from '@/components/SuburbCalculator';
import PhoenixSuburbCalculator from '@/components/PhoenixSuburbCalculator';
import SanJoseSuburbCalculator from '@/components/SanJoseSuburbCalculator';
import HoustonSuburbCalculator from '@/components/HoustonSuburbCalculator';
import PSLFHospitalFinder from '@/components/PSLFHospitalFinder';
import ZillowCards from '@/components/ZillowCards';
import techPost from '@/assets/tech-post.jpg';
import businessPost from '@/assets/business-post.jpg';
import pslfPost from '@/assets/pslf-hospitals.jpg';
import relocationPost from '@/assets/relocation-budget.jpg';
import sacramentoSuburbs from '@/assets/sacramento-suburbs.jpg';
import pslfFinder from '@/assets/pslf-finder.jpg';
import sanJoseSuburbs from '@/assets/san-jose-suburbs.jpg';
import sjCommuteMap1 from '@/assets/sj-commute-map-1.png';
import sjCommuteMap2 from '@/assets/sj-commute-map-2.png';
import phoenixSuburbs from '@/assets/phoenix-suburbs.jpg';
import houstonSuburbs from '@/assets/houston-suburbs.jpg';

const blogPosts = {
  "ekg-strip-atlas": {
    title: "EKG Strip Atlas — Pattern, Location & Mechanism",
    category: "HEALTHCARE",
    date: "June 17, 2026",
    readTime: "15 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A visual atlas mapping each EKG strip to its cardiac pattern, anatomic location, and electrophysiologic mechanism — depolarization, repolarization, automaticity, re-entry, and electrolyte disturbance — alongside the waveform annotations clinicians use to recognize them at the bedside.</p>
      <p>The interactive diagram below is best viewed full-screen. Use the toggle inside the frame to switch light and dark modes.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe
          src="/embeds/ekg-strip-atlas.html"
          title="EKG Strip Atlas"
          style="width:100%;height:1600px;border:0;display:block;"
          loading="lazy"
        ></iframe>
      </div>
      <p><a href="/embeds/ekg-strip-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "abg-interpreter": {
    title: "ABG Interpreter — Acid-Base, Step by Step",
    category: "HEALTHCARE",
    date: "June 17, 2026",
    readTime: "12 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A step-by-step interactive ABG interpreter that walks through pH, PaCO₂, HCO₃⁻, the anion gap, and expected compensation — so you can name the primary disorder, detect mixed disturbances, and reason about the underlying physiology at the bedside.</p>
      <p>The interactive tool below is best viewed full-screen. Use the toggle inside the frame to switch light and dark modes.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe
          src="/embeds/abg-interpreter.html"
          title="ABG Interpreter"
          style="width:100%;height:1600px;border:0;display:block;"
          loading="lazy"
        ></iframe>
      </div>
      <p><a href="/embeds/abg-interpreter.html" target="_blank" rel="noopener">Open the full interpreter in a new tab →</a></p>
    `
  },
  "reduction-field-manual": {
    title: "Reduction Field Manual — Joint Dislocations",
    category: "HEALTHCARE",
    date: "June 17, 2026",
    readTime: "14 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A bedside field manual for joint reductions — shoulder, elbow, hip, patella, finger, and more — with traction vectors, counter-traction, rotation cues, sedation considerations, and post-reduction checks laid out as an orthopedic blueprint.</p>
      <p>The interactive manual below is best viewed full-screen. Use the toggle inside the frame to switch light and dark modes.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe
          src="/embeds/reduction-manual.html"
          title="Reduction Field Manual"
          style="width:100%;height:1600px;border:0;display:block;"
          loading="lazy"
        ></iframe>
      </div>
      <p><a href="/embeds/reduction-manual.html" target="_blank" rel="noopener">Open the full manual in a new tab →</a></p>
    `
  },
  "pocus-atlas": {
    title: "POCUS Atlas — Probe, Window, Screen & Pitfall",
    category: "HEALTHCARE",
    date: "June 17, 2026",
    readTime: "14 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A point-of-care ultrasound atlas mapping each common exam to its probe choice, acoustic window, expected on-screen anatomy, and the pitfalls that fool clinicians — from cardiac and lung scans to FAST, biliary, renal, and vascular access.</p>
      <p>The interactive atlas below is best viewed full-screen. Use the toggle inside the frame to switch light and dark modes.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe
          src="/embeds/pocus-atlas.html"
          title="POCUS Atlas"
          style="width:100%;height:1600px;border:0;display:block;"
          loading="lazy"
        ></iframe>
      </div>
      <p><a href="/embeds/pocus-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "toxidrome-atlas": {
    title: "Toxidrome Atlas — Recognition, Overdoses & Antidotes",
    category: "HEALTHCARE",
    date: "June 17, 2026",
    readTime: "11 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A visual atlas of the major toxidromes — sympathomimetic, anticholinergic, cholinergic, opioid, and sedative-hypnotic — with vitals patterns, exam findings, common offending agents, and antidotes ready for bedside recognition.</p>
      <p>The interactive atlas below is best viewed full-screen. Use the toggle inside the frame to switch light and dark modes.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe
          src="/embeds/toxidrome-atlas.html"
          title="Toxidrome Atlas"
          style="width:100%;height:1600px;border:0;display:block;"
          loading="lazy"
        ></iframe>
      </div>
      <p><a href="/embeds/toxidrome-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "ventilator-atlas": {
    title: "Ventilator Atlas — Modes, Numbers & Troubleshooting",
    category: "HEALTHCARE",
    date: "June 17, 2026",
    readTime: "13 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A ventilator atlas covering the modes you'll see at the bedside (AC, SIMV, PRVC, PS, APRV), the numbers that matter (tidal volume, PEEP, plateau, driving pressure, I:E), and a structured approach to troubleshooting alarms and waveform abnormalities.</p>
      <p>The interactive atlas below is best viewed full-screen. Use the toggle inside the frame to switch light and dark modes.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe
          src="/embeds/ventilator-atlas.html"
          title="Ventilator Atlas"
          style="width:100%;height:1600px;border:0;display:block;"
          loading="lazy"
        ></iframe>
      </div>
      <p><a href="/embeds/ventilator-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "resuscitation-atlas": {
    title: "Resuscitation Atlas — Shock, Pressors, Fluids & Electrolytes",
    category: "HEALTHCARE",
    date: "June 17, 2026",
    readTime: "15 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A resuscitation atlas covering the four shock types (hypovolemic, cardiogenic, distributive, obstructive), the pressors that match each physiology, fluid strategy, and the electrolyte derangements that hide behind refractory instability — with a structured bedside approach to recognition, dosing, and reassessment.</p>
      <p>The interactive atlas below is best viewed full-screen. Use the toggle inside the frame to switch light and dark modes.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe
          src="/embeds/resuscitation-atlas.html"
          title="Resuscitation Atlas"
          style="width:100%;height:1600px;border:0;display:block;"
          loading="lazy"
        ></iframe>
      </div>
      <p><a href="/embeds/resuscitation-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "pediatric-em-atlas": {
    title: "Pediatric EM Atlas — Board Review",
    category: "HEALTHCARE",
    date: "June 19, 2026",
    readTime: "16 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A pediatric emergency medicine board-review atlas covering resuscitation, neonatal emergencies, respiratory distress, GI and surgical mimics, non-accidental trauma, and pediatric infectious disease — with age-specific vitals, weight-based dosing, and red flags clinicians use at the bedside.</p>
      <p>The interactive atlas below is best viewed full-screen. Use the toggle inside the frame to switch light and dark modes.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe
          src="/embeds/pediatric-em-atlas.html"
          title="Pediatric EM Atlas"
          style="width:100%;height:1600px;border:0;display:block;"
          loading="lazy"
        ></iframe>
      </div>
      <p><a href="/embeds/pediatric-em-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "fluid-dynamics-atlas": {
    title: "Fluid Dynamics Atlas — IV Fluids, Physiology & Special Considerations",
    category: "HEALTHCARE",
    date: "June 19, 2026",
    readTime: "14 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A fluid dynamics atlas covering crystalloids, colloids, blood products, and the physiology of intracellular, interstitial, and intravascular compartments — with special considerations for sepsis, DKA, burns, heart failure, and pediatrics.</p>
      <p>The interactive atlas below is best viewed full-screen. Use the toggle inside the frame to switch light and dark modes.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe
          src="/embeds/fluid-dynamics-atlas.html"
          title="Fluid Dynamics Atlas"
          style="width:100%;height:1600px;border:0;display:block;"
          loading="lazy"
        ></iframe>
      </div>
      <p><a href="/embeds/fluid-dynamics-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "antimicrobial-atlas": {
    title: "Antimicrobial Atlas — Antibacterials, Antivirals & Antifungals",
    category: "HEALTHCARE",
    date: "June 20, 2026",
    readTime: "16 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>An antimicrobial atlas covering bacterial classification by Gram stain and morphology, antibiotic mechanism of action by target (cell wall, protein synthesis, DNA/RNA, folate, membrane), antiviral classes, antifungal agents, and stewardship principles — with spectrum tables, resistance patterns, and clinical pearls for bedside decision-making.</p>
      <p>The interactive atlas below is best viewed full-screen. Use the toggle inside the frame to switch light and dark modes.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe
          src="/embeds/antimicrobial-atlas.html"
          title="Antimicrobial Atlas"
          style="width:100%;height:1600px;border:0;display:block;"
          loading="lazy"
        ></iframe>
      </div>
      <p><a href="/embeds/antimicrobial-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "obgyn-emergency-atlas": {
    title: "OB/GYN Emergency Atlas — First, Second, Third Trimester & GYN Emergencies",
    category: "HEALTHCARE",
    date: "June 20, 2026",
    readTime: "16 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>An OB/GYN emergency atlas covering first, second, and third trimester emergencies — from ectopic pregnancy and miscarriage to preterm labor, preeclampsia, and postpartum hemorrhage — plus gynecologic crises like ovarian torsion, PID, and ruptured cysts, with ultrasound findings and ED management pearls.</p>
      <p>The interactive atlas below is best viewed full-screen. Use the toggle inside the frame to switch light and dark modes.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe
          src="/embeds/obgyn-emergency-atlas.html"
          title="OB/GYN Emergency Atlas"
          style="width:100%;height:1600px;border:0;display:block;"
          loading="lazy"
        ></iframe>
      </div>
      <p><a href="/embeds/obgyn-emergency-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "psychiatric-emergency-atlas": {
    title: "Psychiatric Emergency Atlas — Master Reference",
    category: "HEALTHCARE",
    date: "June 21, 2026",
    readTime: "15 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A psychiatric emergency atlas covering agitation, psychosis, mood and safety crises, organic mimics, and substance-related presentations — with de-escalation, medication dosing, and disposition pearls for the emergency department.</p>
      <p>The interactive atlas below is best viewed full-screen. Use the toggle inside the frame to switch light and dark modes.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe
          src="/embeds/psychiatric-emergency-atlas.html"
          title="Psychiatric Emergency Atlas"
          style="width:100%;height:1600px;border:0;display:block;"
          loading="lazy"
        ></iframe>
      </div>
      <p><a href="/embeds/psychiatric-emergency-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "procedural-companions-atlas": {
    title: "Procedural Companions — Splinting, Nerve Blocks & Sedation",
    category: "HEALTHCARE",
    date: "June 22, 2026",
    readTime: "14 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A bedside procedural atlas covering splinting techniques, regional and digital nerve blocks, and procedural sedation — with dosing, anatomy, and pitfall pearls.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/procedural-companions-atlas.html" title="Procedural Companions Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/procedural-companions-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "dermatology-emergency-atlas": {
    title: "Emergency Dermatology Atlas — Master Reference",
    category: "HEALTHCARE",
    date: "June 22, 2026",
    readTime: "13 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>An emergency dermatology atlas covering life-threatening rashes, urgent dermatoses, common ED presentations, pediatric exanthems, and primary lesion morphology.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/dermatology-emergency-atlas.html" title="Emergency Dermatology Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/dermatology-emergency-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "wound-burn-abscess-atlas": {
    title: "Wound, Burn & Abscess Atlas — Procedural Reference",
    category: "HEALTHCARE",
    date: "June 22, 2026",
    readTime: "15 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A procedural atlas for wound closure, burn classification and resuscitation, and abscess incision and drainage — with technique pearls, anesthesia dosing, and aftercare.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/wound-burn-abscess-atlas.html" title="Wound Burn Abscess Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/wound-burn-abscess-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "arrhythmia-origin-atlas": {
    title: "Arrhythmia Origin Atlas — Where Each One Lives",
    category: "HEALTHCARE",
    date: "June 9, 2026",
    readTime: "12 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A visual atlas mapping each major arrhythmia to its anatomic origin in the conduction system — SA node, AV node, atria, junction, and ventricles — alongside the surface ECG signatures clinicians use to recognize them at the bedside.</p>
      <p>The interactive diagram below is best viewed full-screen. Use the toggle inside the frame to switch light and dark modes.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe
          src="/embeds/arrhythmia-origins.html"
          title="Arrhythmia Origin Atlas"
          style="width:100%;height:1400px;border:0;display:block;"
          loading="lazy"
        ></iframe>
      </div>
      <p><a href="/embeds/arrhythmia-origins.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "neurologic-emergencies-atlas": {
    title: "Neurologic Emergencies Atlas — Stroke, Spine, Seizures & CNS Infections",
    category: "HEALTHCARE",
    date: "June 23, 2026",
    readTime: "20 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A two-part neurologic emergencies atlas. Part I covers stroke syndromes, vascular territories, and spinal cord emergencies. Part II covers seizures, antiseizure medications, and CNS infections — with bedside pearls, imaging cues, and management algorithms.</p>
      <h2>Part I — Stroke & Spinal Cord</h2>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/stroke-spinal-atlas.html" title="Stroke & Spinal Cord Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/stroke-spinal-atlas.html" target="_blank" rel="noopener">Open Part I in a new tab →</a></p>
      <h2>Part II — Seizures, ASMs & CNS Infections</h2>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/seizure-cns-atlas.html" title="Seizures, ASMs & CNS Infections Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/seizure-cns-atlas.html" target="_blank" rel="noopener">Open Part II in a new tab →</a></p>
    `
  },
  "neuralgia-migraine-spine-atlas": {
    title: "Neuralgia, Migraine & Spinal Pain Atlas",
    category: "HEALTHCARE",
    date: "July 6, 2026",
    readTime: "18 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A clinical atlas covering neuralgia subtypes, migraine pathophysiology and acute management, spinal pain generators, radiculopathy patterns, and bedside pearls for distinguishing neuropathic, vascular, and mechanical spine pain.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/neuralgia-migraine-spine-atlas.html" title="Neuralgia, Migraine & Spinal Pain Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/neuralgia-migraine-spine-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "bulletproof-note-atlas": {
    title: "The Bulletproof Note — HPI, Exam & Disposition for the Deposition",
    category: "HEALTHCARE",
    date: "July 10, 2026",
    readTime: "20 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>Charting an ED note that holds up in deposition — HPI structure, exam specificity, MDM, and disposition language that defends the chart.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/bulletproof-note-atlas.html" title="The Bulletproof Note" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/bulletproof-note-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "pediatric-bulletproof-note-atlas": {
    title: "The Pediatric Bulletproof Note — Deposition-Proof Peds Charting",
    category: "HEALTHCARE",
    date: "July 10, 2026",
    readTime: "18 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>Peds-specific charting: weight-based dosing, caregiver history, red flags, and disposition language that survives deposition.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/pediatric-bulletproof-note-atlas.html" title="The Pediatric Bulletproof Note" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/pediatric-bulletproof-note-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "ed-charting-medicolegal-atlas": {
    title: "The Charting Atlas — ED Documentation & Medicolegal Defense",
    category: "HEALTHCARE",
    date: "July 10, 2026",
    readTime: "25 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A medicolegal atlas of ED documentation — language that helped, language that hurt, and the patterns plaintiff attorneys look for.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/ed-charting-medicolegal-atlas.html" title="The Charting Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/ed-charting-medicolegal-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "surviving-the-deposition-atlas": {
    title: "Surviving the Deposition — Testifying Consistent With Your Chart",
    category: "HEALTHCARE",
    date: "July 10, 2026",
    readTime: "20 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>How to prepare for and testify in a deposition — chart consistency, phrasing traps, and the mindset that keeps you defensible.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/surviving-the-deposition-atlas.html" title="Surviving the Deposition" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/surviving-the-deposition-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "laboratory-values-atlas": {
    title: "Laboratory Values Atlas — ED & Hospitalist",
    category: "HEALTHCARE",
    date: "July 10, 2026",
    readTime: "22 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>Reference ranges, panic values, and interpretation patterns for the labs ED and hospitalist clinicians order every shift.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/laboratory-values-atlas.html" title="Laboratory Values Atlas" style="width:100%;height:1800px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/laboratory-values-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "analgesics-atlas": {
    title: "Analgesics Atlas — ED Pharmacology Master Reference",
    category: "HEALTHCARE",
    date: "July 10, 2026",
    readTime: "20 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>Opioids, non-opioids, adjuncts, and regional analgesia — dosing, onset, duration, and selection pearls for ED pain control.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/analgesics-atlas.html" title="Analgesics Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/analgesics-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "alternative-analgesics-atlas": {
    title: "Alternative Analgesics Atlas — Research-Backed Non-Drug Pain Methods",
    category: "HEALTHCARE",
    date: "July 10, 2026",
    readTime: "15 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>Non-pharmacologic pain strategies — nerve blocks, TENS, heat/cold, mind-body, and procedural adjuncts with evidence pearls.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/alternative-analgesics-atlas.html" title="Alternative Analgesics Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/alternative-analgesics-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "insulin-dosing-atlas": {
    title: "Insulin Dosing Atlas — TDD, Weight-Based, Renal & Field Estimation",
    category: "HEALTHCARE",
    date: "July 10, 2026",
    readTime: "18 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>Total daily dose, weight-based starts, renal adjustments, correction factors, and bedside field estimation for insulin dosing.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/insulin-dosing-atlas.html" title="Insulin Dosing Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/insulin-dosing-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "sacramento-suburb-guide-3br-housing-commute-budget": {
    title: "Sacramento Suburb Guide: 3BR Housing, Commute & Monthly Budget for Every Orbit",
    category: "HEALTHCARE",
    date: "March 15, 2026",
    readTime: "18 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: sacramentoSuburbs,
    content: `
      <p>If you're a <strong>physician assistant considering a <a href="/ca-move-planner" style="color:inherit;text-decoration:none;cursor:text">relocation to Sacramento</a></strong>, the city proper isn't your only option — and often isn't the best one. This guide covers <strong>12 Sacramento-orbit suburbs</strong> across three rings, all analyzed with the same framework: commute to Sacramento hospitals, 3BR house feasibility, and monthly surplus on a single PA income (~$7,812/month take-home after taxes, 12% traditional 401k, and HSA).</p>

      <div class="my-6 p-5 rounded-lg border border-primary/30 bg-primary/5">
        <h3 class="text-base font-bold text-foreground mb-2">TL;DR — Best Sacramento Suburbs for a PA Relocation</h3>
        <ul class="list-disc pl-5 space-y-1 text-sm text-foreground">
          <li><strong>Best all-around:</strong> Roseville (hospital hub, solid value, 24 min baseline to Sacramento — budget 40–50 min during I-80 rush hour)</li>
          <li><strong>Best lifestyle balance:</strong> Folsom (lakes, 49 parks, manageable commute, $3,000 3BR)</li>
          <li><strong>Best pure savings:</strong> Citrus Heights ($2,450 3BR, 20 min in, ~$2,700+/mo leftover)</li>
        </ul>
        <p class="text-xs text-muted-foreground mt-2 italic">Keep reading for the full breakdown across all 12 suburbs — the ranking updates based on what you prioritize.</p>
      </div>

      <p class="text-sm text-muted-foreground italic">All suburbs are in California, so state income tax is the same. The real differences are housing cost, commute reality, school district, and suburban character.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Ring 1: Inner Suburbs — Roseville, Folsom & El Dorado Hills</h2>

      <p>These three are within about 50 minutes of Sacramento on a no-traffic basis. Roseville is in Placer County, Folsom in Sacramento County, and El Dorado Hills in El Dorado County — California personal income tax is state-level, so no county difference there.</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Area</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">County</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Drive to Sac</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Rush-Hour Add</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">3BR Rent</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Take-Home</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Monthly Leftover</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 text-muted-foreground font-semibold"><a href="https://www.zillow.com/roseville-ca/rentals/3-_beds/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Roseville</a></td>
              <td class="py-3 px-3 text-muted-foreground">Placer</td>
              <td class="text-right py-3 px-3 text-muted-foreground">24 min / 19 mi</td>
              <td class="text-right py-3 px-3 text-destructive text-xs font-medium">+15–25 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,850–$3,050</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">~$7,812</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">~$2,450–$2,650</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground"><a href="https://www.zillow.com/folsom-ca/rentals/3-_beds/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Folsom</a></td>
              <td class="py-3 px-3 text-muted-foreground">Sacramento</td>
              <td class="text-right py-3 px-3 text-muted-foreground">31 min / 24 mi</td>
              <td class="text-right py-3 px-3 text-destructive text-xs font-medium">+10–20 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,000–$3,200</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">~$7,812</td>
              <td class="text-right py-3 px-3 text-foreground">~$2,250–$2,450</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground"><a href="https://www.zillow.com/el-dorado-hills-ca/rentals/3-_beds/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">El Dorado Hills</a></td>
              <td class="py-3 px-3 text-muted-foreground">El Dorado</td>
              <td class="text-right py-3 px-3 text-muted-foreground">33 min / 30 mi</td>
              <td class="text-right py-3 px-3 text-destructive text-xs font-medium">+10–20 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,450–$3,800</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">~$7,812</td>
              <td class="text-right py-3 px-3 text-foreground">~$1,550–$1,900</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>These leftover ranges assume roughly $2,300–$2,500/month for everything besides rent: Walmart groceries for 2, utilities, internet, phones, gas, car insurance, maintenance, minimal health plan, renters insurance, and misc household spend.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Ring 1 Verdict</h3>

      <ul class="list-disc pl-6 my-4">
        <li><strong>Roseville:</strong> Best all-around fit — strongest value, easiest to keep monthly cushion while staying close to Sacramento jobs. Sutter Roseville Medical Center (Level II trauma) and Kaiser Permanente Roseville are right there. <em>School districts:</em> Roseville City School District and Dry Creek Joint Elementary — both well-regarded. I-80 at 5 PM is a different animal than the 24-minute baseline; budget 40–50 minutes if you're commuting into downtown Sacramento during peak.</li>
        <li><strong>Folsom:</strong> Good middle ground. Slightly pricier, but manageable. Mercy Hospital of Folsom is local (106 beds). <em>School districts:</em> Folsom-Cordova USD is one of the strongest in the region — a real differentiator if you're thinking about kids or resale value. Hwy 50 rush hour adds 10–20 min.</li>
        <li><strong>El Dorado Hills:</strong> Best upscale suburban-house feel. Worst for pure budget efficiency — compresses your margin the most. <em>School districts:</em> Buckeye Union and part of El Dorado Union High — solid but not a clear step above Folsom-Cordova for the price premium.</li>
      </ul>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Ring 2: Next-Ring Suburbs — Rocklin, Lincoln, Granite Bay, Rancho Cordova, Citrus Heights & Elk Grove</h2>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Area</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Drive to Sac</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Rush-Hour Add</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Zillow 3BR Avg</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Planning Number</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Leftover</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 text-muted-foreground font-semibold"><a href="https://www.zillow.com/citrus-heights-ca/rentals/3-_beds/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Citrus Heights</a></td>
              <td class="text-right py-3 px-3 text-muted-foreground">20 min</td>
              <td class="text-right py-3 px-3 text-destructive text-xs font-medium">+5–15 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$2,450</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,450–$2,650</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">~$2,700–$2,950</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground"><a href="https://www.zillow.com/rancho-cordova-ca/rentals/3-_beds/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Rancho Cordova</a></td>
              <td class="text-right py-3 px-3 text-muted-foreground">19 min</td>
              <td class="text-right py-3 px-3 text-destructive text-xs font-medium">+5–15 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$2,700</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,650–$2,900</td>
              <td class="text-right py-3 px-3 text-foreground">~$2,450–$2,750</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground"><a href="https://www.zillow.com/elk-grove-ca/rentals/3-_beds/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Elk Grove</a></td>
              <td class="text-right py-3 px-3 text-muted-foreground">24 min</td>
              <td class="text-right py-3 px-3 text-destructive text-xs font-medium">+10–20 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$2,733</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,750–$3,000</td>
              <td class="text-right py-3 px-3 text-foreground">~$2,350–$2,650</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground"><a href="https://www.zillow.com/rocklin-ca/rentals/3-_beds/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Rocklin</a></td>
              <td class="text-right py-3 px-3 text-muted-foreground">24 min</td>
              <td class="text-right py-3 px-3 text-destructive text-xs font-medium">+15–25 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$2,795–$2,800</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,800–$3,000</td>
              <td class="text-right py-3 px-3 text-foreground">~$2,300–$2,600</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground"><a href="https://www.zillow.com/lincoln-ca/rentals/3-_beds/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Lincoln</a></td>
              <td class="text-right py-3 px-3 text-muted-foreground">33 min</td>
              <td class="text-right py-3 px-3 text-destructive text-xs font-medium">+15–30 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$2,895</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,850–$3,050</td>
              <td class="text-right py-3 px-3 text-foreground">~$2,200–$2,500</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground"><a href="https://www.zillow.com/granite-bay-ca/rentals/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Granite Bay</a></td>
              <td class="text-right py-3 px-3 text-muted-foreground">32 min</td>
              <td class="text-right py-3 px-3 text-destructive text-xs font-medium">+15–25 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$3,895</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,850–$4,250</td>
              <td class="text-right py-3 px-3 text-foreground">~$900–$1,350</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Ring 2 Area-by-Area Read</h3>

      <p><strong>Citrus Heights</strong> — Cheapest serious contender. Zillow shows ~$2,450 for a 3BR, ~20 min to Sacramento. Strongest "don't overpay for the zip code" option if your priority is a 3BR house without crushing your monthly margin. San Juan USD serves most of the area — functional but not a selling point. Citrus Heights is close enough that rush hour barely registers compared to the I-80 corridor suburbs.</p>

      <p><strong>Rancho Cordova</strong> — Another strong value play. ~$2,700 for a 3BR, ~19 min / 14 mi to Sacramento. Close in, materially cheaper than premium northeast suburbs, and still realistic for your house goal. Folsom-Cordova USD covers parts of Rancho Cordova — a meaningful quality bump over San Juan USD.</p>

      <p><strong>Elk Grove</strong> — Reasonable middle ground: ~24 min baseline, more suburban and family-house oriented than Sacramento proper. ~$2,733 for a 3BR. Elk Grove USD is large and generally solid. Hwy 99 rush hour adds 10–20 min.</p>

      <p><strong>Rocklin</strong> — One of the more attractive "nicer suburb without going full luxury" options. ~24 min commute, ~$2,795–$2,800 for 3BR. More polished than Rancho Cordova or Citrus Heights, but you pay for it. <em>School districts:</em> Rocklin USD is excellent — consistently one of the top-performing districts in the Sacramento metro. This is the suburb where school quality alone justifies the modest price premium. I-80 rush hour is real here — budget 40–50 min to downtown Sacramento at peak.</p>

      <p><strong>Lincoln</strong> — Farther out at ~33 min / 29 mi. ~$2,895 for 3BR, not notably cheaper than Rocklin despite the longer drive. Less compelling unless you specifically want a farther-out suburban feel. Western Placer USD is decent but not a clear differentiator.</p>

      <p><strong>Granite Bay</strong> — The numbers work on a PA salary, but barely. $3,895 for a 3BR compresses your margin harder than anywhere else in Ring 2. Granite Bay has a Nextdoor-community feel — established families, big lots, quiet streets — not a "young couple discovering a city" vibe. Eureka Union SD (elementary) feeds into Granite Bay High, which is one of the best public high schools in the region. If school prestige matters for future resale, this is the strongest play, but you're paying dearly for it.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Ring 2 Ranking</h3>

      <p><strong>Best value:</strong></p>
      <ol class="list-decimal pl-6 my-2">
        <li>Citrus Heights</li>
        <li>Rancho Cordova</li>
        <li>Elk Grove</li>
      </ol>

      <p><strong>Best balance of nicer suburb + still workable:</strong></p>
      <ol class="list-decimal pl-6 my-2" start="4">
        <li>Rocklin</li>
        <li>Lincoln</li>
      </ol>

      <p><strong>Upscale house feel, can stomach the cost:</strong></p>
      <ol class="list-decimal pl-6 my-2" start="6">
        <li>Granite Bay</li>
      </ol>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Ring 3: Foothill Suburbs — Auburn, Folsom Ranch & Cameron Park</h2>

      <p>All three are still within the rough 50-minute orbit on a no-traffic basis — though rush hour and winding foothill roads can stretch that meaningfully.</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Area</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Commute</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Rush-Hour Add</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">3BR Signal</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Planning Number</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Leftover</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground"><a href="https://www.zillow.com/auburn-ca/rentals/3-_beds/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Auburn</a></td>
              <td class="text-right py-3 px-3 text-muted-foreground">33 min / 33 mi</td>
              <td class="text-right py-3 px-3 text-destructive text-xs font-medium">+15–30 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$2,950</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,900–$3,150</td>
              <td class="text-right py-3 px-3 text-foreground">~$2,150–$2,450</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground"><a href="https://www.zillow.com/folsom-ca/rentals/3-_beds/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Folsom Ranch</a></td>
              <td class="text-right py-3 px-3 text-muted-foreground">31+ min / 24+ mi</td>
              <td class="text-right py-3 px-3 text-destructive text-xs font-medium">+10–20 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$2,999</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,000–$3,300</td>
              <td class="text-right py-3 px-3 text-foreground">~$2,000–$2,300</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 text-muted-foreground font-semibold">Cameron Park</td>
              <td class="text-right py-3 px-3 text-muted-foreground">35 min / 33 mi</td>
              <td class="text-right py-3 px-3 text-destructive text-xs font-medium">+10–20 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">Below EDH</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,700–$3,000</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">~$2,300–$2,600</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Ring 3 Area-by-Area Read</h3>

      <p><strong>Auburn</strong> — Best if you want a foothill / small-town feel without going fully rural. ~$2,950 for a 3BR. Workable, but not a screaming bargain relative to inner-ring suburbs like Citrus Heights. Auburn State Recreation Area offers hiking, fishing, camping, and whitewater on the American River. Hidden Falls Regional Park and mountain biking round out the outdoor draws. Auburn Union SD is small and well-liked. I-80 rush hour from Auburn into Sacramento can be punishing — 45–60+ minutes is realistic at peak.</p>

      <p><strong>Folsom Ranch</strong> — The new-build, polished, master-planned option. Folsom's newer plan area south of Highway 50. Standard Folsom 3BRs average ~$2,999, with active listings $2,595–$3,200+. Budget at the upper end of Folsom, not the lower end. Best if you want the nicest, newest suburban environment. Falls within Folsom-Cordova USD — same strong district as Folsom proper.</p>

      <p><strong>Cameron Park</strong> — El Dorado County feel without full El Dorado Hills pricing. Market-trend data is thinner, but nearby El Dorado County submarkets suggest it sits below EDH and around/slightly below Auburn. Best chance at a good house-value compromise if you're okay with a foothill-suburban feel. Inventory is thinner and the area is less "master-planned polished" than Folsom Ranch. Buckeye Union SD (same as EDH) — decent schools, rural-ish character.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Ring 3 Ranking</h3>

      <ol class="list-decimal pl-6 my-4">
        <li><strong>Cameron Park</strong> — Best value upside for foothill living</li>
        <li><strong>Auburn</strong> — Best lifestyle / character</li>
        <li><strong>Folsom Ranch</strong> — Best "nice suburb" choice, worst on pure efficiency</li>
      </ol>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Can a PA Actually Afford Sacramento Suburbs Solo?</h2>

      <p>MIT's 2026 Living Wage data puts the floor for a 2-adult household (1 working, 0 children) at <strong>~$118,931/year in Placer County</strong> and <strong>~$111,471/year in El Dorado County</strong>, with Sacramento County lower than both. A PA earning $160k gross clears those thresholds with room — but not extravagant room. In practice, the margin is real but thin enough that housing cost is the single biggest lever you can pull. That's why the difference between a $2,450 Citrus Heights 3BR and a $3,895 Granite Bay 3BR isn't academic — it's $1,400/month of flexibility, or ~$17,000/year.</p>

      <p class="text-sm text-muted-foreground italic">El Dorado Hills itself is much more expensive than the county average, which is why it feels pricier in practice than the county living-wage number alone suggests.</p>

      <div class="my-6 p-4 rounded-lg border border-border bg-muted/30">
        <h4 class="text-sm font-bold text-foreground mb-2">📋 Property Tax Note</h4>
        <p class="text-xs text-muted-foreground">If you're considering buying down the road: Placer County, Sacramento County, and El Dorado County have slightly different effective property tax rates (typically 1.1–1.25% of assessed value). The differences are small on a year-to-year basis but compound over a mortgage. Mello-Roos districts in newer developments like Folsom Ranch and Lincoln can add $200–$400/month on top of base property tax — worth checking before signing a purchase contract.</p>
      </div>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Best Suburb for a PA Relocating to Sacramento: Final Ranking</h2>

      <p>For a physician assistant relocating to Sacramento with a partner — 3BR house target, likely yard/fence preferred, single PA income:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Category</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Winner</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Why</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Runner-Up</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Best all-around</td>
              <td class="py-3 px-3 text-muted-foreground">Roseville</td>
              <td class="py-3 px-3 text-muted-foreground text-xs">Hospital hub + solid value + good schools (Dry Creek, Roseville City SD). 24 min baseline.</td>
              <td class="py-3 px-3 text-muted-foreground">Folsom</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Young couple / lifestyle</td>
              <td class="py-3 px-3 text-muted-foreground">Folsom</td>
              <td class="py-3 px-3 text-muted-foreground text-xs">Folsom Lake, Lake Natoma, 49 parks, strong schools (Folsom-Cordova USD). ~$3,000 3BR.</td>
              <td class="py-3 px-3 text-muted-foreground">Roseville, then Rancho Cordova</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Affordability</td>
              <td class="py-3 px-3 text-muted-foreground">Citrus Heights</td>
              <td class="py-3 px-3 text-muted-foreground text-xs">~$2,450 3BR, 20 min to Sac, ~$2,700+/mo leftover. School districts weaker.</td>
              <td class="py-3 px-3 text-muted-foreground">Rancho Cordova, then Elk Grove</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Hospital commute</td>
              <td class="py-3 px-3 text-muted-foreground">Roseville</td>
              <td class="py-3 px-3 text-muted-foreground text-xs">Sutter Roseville (Level II trauma), Kaiser Roseville on-site. 24 min to Sac hospitals.</td>
              <td class="py-3 px-3 text-muted-foreground">Folsom (Mercy Folsom, 106 beds)</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Nature / outdoors</td>
              <td class="py-3 px-3 text-muted-foreground">Auburn</td>
              <td class="py-3 px-3 text-muted-foreground text-xs">Auburn SRA, Hidden Falls, American River whitewater, mountain biking.</td>
              <td class="py-3 px-3 text-muted-foreground">Folsom, then Cameron Park</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Getting a yard</td>
              <td class="py-3 px-3 text-muted-foreground">Cameron Park</td>
              <td class="py-3 px-3 text-muted-foreground text-xs">Best house + yard value without premium zip code pricing.</td>
              <td class="py-3 px-3 text-muted-foreground">Auburn, then Lincoln</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Schools (no kids yet)</td>
              <td class="py-3 px-3 text-muted-foreground">Rocklin / Folsom</td>
              <td class="py-3 px-3 text-muted-foreground text-xs">Rocklin USD and Folsom-Cordova USD are top-tier in the metro. Affects resale too.</td>
              <td class="py-3 px-3 text-muted-foreground">Granite Bay (GBHS prestige)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Best All-Around Compromise (Shortlist)</h3>

      <ol class="list-decimal pl-6 my-4">
        <li><strong>Roseville</strong> — Best for hospital career logistics + solid value</li>
        <li><strong>Folsom</strong> — Most fun / balanced overall</li>
        <li><strong>Cameron Park</strong> — Best shot at a real yard without going expensive</li>
      </ol>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Best Pure Value</h3>

      <ol class="list-decimal pl-6 my-4" start="4">
        <li><strong>Citrus Heights</strong> — Best money play overall</li>
        <li><strong>Rancho Cordova</strong> — Close-in value, hard to ignore</li>
        <li><strong>Elk Grove</strong> — Reasonable family-suburb middle ground</li>
      </ol>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Nicer Suburb Tier</h3>

      <ol class="list-decimal pl-6 my-4" start="7">
        <li><strong>Rocklin</strong> — Polished without going full luxury, best school district value</li>
        <li><strong>Auburn</strong> — Best lifestyle if you love outdoors</li>
        <li><strong>Folsom Ranch</strong> — Newest, most polished, premium price</li>
        <li><strong>Lincoln</strong> — Farther out, not notably cheaper than Rocklin</li>
      </ol>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Premium / Margin-Compression Tier</h3>

      <ol class="list-decimal pl-6 my-4" start="11">
        <li><strong>El Dorado Hills</strong> — Upscale feel, material cost premium</li>
        <li><strong>Granite Bay</strong> — Weakest value, strongest premium zip code</li>
      </ol>

      <p>If you want the <strong>single best all-around compromise</strong> for a PA relocating to the Sacramento orbit with a partner, the shortlist is <strong>Roseville, Folsom, and Cameron Park</strong>. Roseville wins on hospital logistics and school quality, Folsom wins on lifestyle balance, and Cameron Park wins on yard + space value.</p>

      <p>If pure monthly margin is the priority, <strong>Citrus Heights, Rancho Cordova, and Elk Grove</strong> are the strongest cost-to-commute plays — though the school district tradeoff is real in Citrus Heights.</p>

      <p class="text-sm text-muted-foreground italic mt-6">All rent figures are from current Zillow market-trend pages. Commute estimates are no-traffic baselines from Travelmath; rush-hour additions are estimates based on typical I-80, Hwy 50, and Hwy 99 congestion patterns — your actual experience will vary by shift schedule. Take-home uses the same $160k gross / 12% 401k / HSA / single-filer California model from the prior PSLF analysis.</p>
    `
  },
  "relocation-budget-3br-move-ready-cash": {
    title: "2-Adult Relocation Budget: 3BR House, Groceries & Move-Ready Cash by Market",
    category: "HEALTHCARE",
    date: "March 12, 2026",
    readTime: "12 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: relocationPost,
    content: `
      <p>This is the move-ready version of the relocation model, built around a 2-adult household relocating from Waterloo: <strong>3BR house target with a yard, one PA income, paid-off 2012 Camry, minimal health insurance</strong>. I split the analysis into a monthly living budget, a Walmart-based grocery model, move-ready cash estimates, and a final ranking.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Grocery Budget: Walmart Staples for 2 Adults</h2>

      <p>Rather than using a generic grocery average, I anchored to current Walmart prices for staple items:</p>

      <div class="overflow-x-auto my-6">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-4 font-bold text-foreground">Item</th>
              <th class="text-right py-3 px-4 font-bold text-foreground">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10"><td class="py-2 px-4 text-muted-foreground">Great Value Rice, 20 lb</td><td class="text-right py-2 px-4 text-muted-foreground">$11.46</td></tr>
            <tr class="border-b border-foreground/10"><td class="py-2 px-4 text-muted-foreground">Eggs, 18 ct</td><td class="text-right py-2 px-4 text-muted-foreground">$2.92</td></tr>
            <tr class="border-b border-foreground/10"><td class="py-2 px-4 text-muted-foreground">Oats, 42 oz</td><td class="text-right py-2 px-4 text-muted-foreground">$4.18</td></tr>
            <tr class="border-b border-foreground/10"><td class="py-2 px-4 text-muted-foreground">Bread, 20 oz</td><td class="text-right py-2 px-4 text-muted-foreground">$1.27</td></tr>
            <tr class="border-b border-foreground/10"><td class="py-2 px-4 text-muted-foreground">Spaghetti, 16 oz</td><td class="text-right py-2 px-4 text-muted-foreground">$0.98</td></tr>
            <tr class="border-b border-foreground/10"><td class="py-2 px-4 text-muted-foreground">Mixed Vegetables, 32 oz</td><td class="text-right py-2 px-4 text-muted-foreground">$2.58</td></tr>
            <tr class="border-b border-foreground/10"><td class="py-2 px-4 text-muted-foreground">Plain Greek Yogurt, 32 oz</td><td class="text-right py-2 px-4 text-muted-foreground">$2.94</td></tr>
            <tr class="border-b border-foreground/10"><td class="py-2 px-4 text-muted-foreground">Bananas, per lb</td><td class="text-right py-2 px-4 text-muted-foreground">~$0.50</td></tr>
            <tr class="border-b border-foreground/10"><td class="py-2 px-4 text-muted-foreground">Gala Apples, 3 lb</td><td class="text-right py-2 px-4 text-muted-foreground">$2.38</td></tr>
          </tbody>
        </table>
      </div>

      <p>Based on these prices, a reasonable Walmart grocery budget for 2 adults is:</p>
      <ul class="list-disc pl-6 my-4">
        <li><strong>Lean but realistic:</strong> ~$500/month</li>
        <li><strong>More comfortable / fuller cart:</strong> ~$650/month</li>
      </ul>
      <p class="text-sm text-muted-foreground italic">This is budget-minded: mostly Walmart staples, limited eating out, not much premium meat, snack, or specialty-food spending. Prices vary by store and pickup/delivery timing.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">3BR Housing: Zillow Market Data</h2>

      <p>For housing, I used Zillow's live 3-bedroom rental pages. Here are the direct market pages:</p>

      <ul class="list-disc pl-6 my-4">
        <li><strong>Waterloo:</strong> Listings mostly around the low-$1,000s — <a href="https://www.zillow.com/waterloo-ia/rentals/3-_beds/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Zillow Waterloo 3BR</a></li>
        <li><strong>Sacramento:</strong> Commonly mid-$2,000s to low-$3,000s — <a href="https://www.zillow.com/sacramento-ca/rentals/3-_beds/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Zillow Sacramento 3BR</a></li>
        <li><strong>Phoenix:</strong> Low-to-mid $2,000s — <a href="https://www.zillow.com/phoenix-az/rentals/3-_beds/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Zillow Phoenix 3BR</a></li>
        <li><strong>Houston:</strong> Low-to-mid $2,000s — <a href="https://www.zillow.com/houston-tx/rentals/3-_beds/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Zillow Houston 3BR</a></li>
        <li><strong>Hamilton County (Carmel/Fishers):</strong>
          <ul class="list-disc pl-6 mt-1">
            <li><a href="https://www.zillow.com/carmel-in/rentals/3-_beds/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Zillow Carmel 3BR</a></li>
            <li><a href="https://www.zillow.com/fishers-in/rentals/3-_beds/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Zillow Fishers 3BR</a></li>
          </ul>
        </li>
      </ul>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Updated Monthly Budget Model</h2>

      <p>These use the monthly take-home figures from the prior ED-pay/tax model and swap in a 3BR house target plus Walmart groceries for 2 adults.</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Market</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Monthly Take-Home</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">3BR Rent</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Groceries (2)</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Other Costs</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Total Spend</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Leftover</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Waterloo</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$5,995</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,250</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,425</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,250</td>
              <td class="text-right py-3 px-3 text-foreground">$2,745</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Sacramento</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$7,812</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,800</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$600</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,700</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$5,100</td>
              <td class="text-right py-3 px-3 text-foreground">$2,712</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 text-muted-foreground font-semibold">Phoenix</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$9,067</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,350</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,500</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$4,567</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Houston</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$8,657</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,250</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,525</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,350</td>
              <td class="text-right py-3 px-3 text-foreground">$4,307</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Hamilton County / Indy</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$7,987</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,200</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,500</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,275</td>
              <td class="text-right py-3 px-3 text-foreground">$3,712</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-sm text-muted-foreground italic">The "Other monthly living costs" bucket covers utilities, internet, phones, gas, car insurance and maintenance for a paid-off 2012 Camry, minimal employee health insurance, renters insurance, and household odds and ends. It's kept lower than a typical 2-car household.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Move-Ready Cash Model</h2>

      <p>This section answers: <strong>how much cash do you actually need to sign a lease and move from Waterloo?</strong> I split it into minimum cash to get the keys versus a safer amount to have saved before signing.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Key Assumptions</h3>

      <ul class="list-disc pl-6 my-4">
        <li><strong>Driving distances from Waterloo:</strong> ~445 mi to Indianapolis/Hamilton County, ~1,063 mi to Houston, ~1,531 mi to Phoenix, ~1,845 mi to Sacramento</li>
        <li><strong>Truck costs:</strong> Planning estimates based on national averages — ~$1,005 average, with long-distance runs often $3,700+</li>
        <li><strong>Security deposits:</strong> California caps at one month's rent for most rentals; Texas has no statewide cap but one month is common</li>
        <li><strong>Pet deposits:</strong> Typically $100–$500 per pet; pet rent commonly $25–$100/month</li>
        <li><strong>Utility setup:</strong> Utility deposits can range from under $100 to several hundred; Xfinity technician install ~$100</li>
      </ul>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Market</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Rent Ceiling</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Security Deposit</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Utility + Internet</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Truck + Travel</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Minimum Cash</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Pet Reserve</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Safer Target</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Waterloo</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,400</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,400</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$250</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$900</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$3,950</td>
              <td class="text-right py-3 px-3 text-muted-foreground">+$300</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$7,200</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Hamilton County / Indy</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,250</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,250</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$300</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,000</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$5,800</td>
              <td class="text-right py-3 px-3 text-muted-foreground">+$300</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$10,100</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Houston</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,250</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,250</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$350</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,200</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$7,050</td>
              <td class="text-right py-3 px-3 text-muted-foreground">+$300</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$11,400</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Phoenix</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,450</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,450</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$350</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,800</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$8,050</td>
              <td class="text-right py-3 px-3 text-muted-foreground">+$300</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$12,550</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Sacramento</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,900</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,900</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$400</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,200</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$9,400</td>
              <td class="text-right py-3 px-3 text-muted-foreground">+$0–$200</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$14,500</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">How to Read This</h3>

      <p><strong>Minimum cash to sign + move</strong> means enough for first month's rent, security deposit, basic utility/internet startup, and a realistic one-way self-move by truck from Waterloo. That is the bare-minimum workable number, not the comfortable number.</p>

      <p><strong>Safer cash saved before signing</strong> adds about one month of basic living cushion after arrival, so you are not immediately squeezed by groceries, fuel, insurance, or a delayed first paycheck.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Blunt Recommendation: Real Cash Targets</h2>

      <p>If you want the move to feel <strong>financially controlled</strong>, use these real targets:</p>

      <ul class="list-disc pl-6 my-4">
        <li><strong>Hamilton County:</strong> aim for $10k–$11k</li>
        <li><strong>Houston:</strong> aim for $11.5k–$13k</li>
        <li><strong>Phoenix:</strong> aim for $12.5k–$14k</li>
        <li><strong>Sacramento:</strong> aim for $14.5k–$16k</li>
      </ul>

      <p>Sacramento is the hardest because the upfront housing stack is simply bigger. Houston and Phoenix are easier than Sacramento, but the truck/travel leg from Iowa is still material. Hamilton is the easiest true relocation of the higher-opportunity markets because the distance is much shorter.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Final Ranking: Best Fit for Your Setup</h2>

      <p>With one PA income, 2 adults, 3BR house target, yard/fence preference, paid-off Camry, and budget groceries via Walmart:</p>

      <ol class="list-decimal pl-6 my-4">
        <li><strong>Phoenix</strong> — strongest monthly surplus ($4,567), manageable move costs</li>
        <li><strong>Houston</strong> — very close second ($4,307), best tax story</li>
        <li><strong>Hamilton County / Indy orbit</strong> — solid ($3,712), shortest move from Iowa</li>
        <li><strong>Waterloo</strong> — cheapest to live ($2,745), but lowest income ceiling</li>
        <li><strong>Sacramento</strong> — toughest for 3BR lifestyle without compressing margin ($2,712)</li>
      </ol>

      <p>The biggest reason is still <strong>housing plus taxes</strong>. Sacramento is the toughest place to get the 3BR fenced-house lifestyle without compressing your monthly margin. Phoenix and Houston give you much more room for that setup.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">What Comes Next</h3>

      <p>The next most useful version of this would be a <strong>timeline model</strong> showing exactly how much cash you need by 30 days before move, lease-signing day, move week, and first paycheck after arrival.</p>
    `
  },
  "pslf-qualifying-hospitals-california-arizona": {
    title: "PSLF-Qualifying Hospitals in California & Arizona: A Comprehensive Guide",
    category: "HEALTHCARE",
    date: "March 12, 2026",
    readTime: "10 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: pslfPost,
    content: `
      <p><strong>Important:</strong> PSLF is based on your actual employer/W-2 entity, not just the hospital building. Government employers and 501(c)(3) nonprofit systems are the strongest bets, but you should still verify the exact employer in the federal PSLF tool before signing.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">California</h2>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Sacramento / El Dorado County</h3>

      <ul class="list-disc pl-6 my-4">
        <li><strong>UC Davis Health / UC Davis Medical Center</strong> — public nonprofit UC institution.</li>
        <li><strong>Sutter Health hospitals</strong>, including:
          <ul class="list-disc pl-6 mt-2">
            <li>Sutter Medical Center, Sacramento</li>
            <li>Sutter Davis Hospital</li>
            <li>California Pacific Medical Center in San Francisco</li>
          </ul>
          <p class="mt-1 text-sm italic">Sutter says it is a not-for-profit health system.</p>
        </li>
        <li><strong>Dignity Health / CommonSpirit hospitals</strong>, including:
          <ul class="list-disc pl-6 mt-2">
            <li>Mercy General Hospital</li>
            <li>Methodist Hospital of Sacramento</li>
            <li>Mercy San Juan Medical Center</li>
            <li>Mercy Hospital of Folsom</li>
            <li>St. Mary's Medical Center</li>
            <li>Saint Francis Memorial Hospital</li>
          </ul>
          <p class="mt-1 text-sm italic">CommonSpirit describes itself as a nonprofit health system.</p>
        </li>
        <li><strong>Marshall Medical Center</strong> — nonprofit corporation.</li>
        <li><strong>Barton Memorial Hospital / Barton Health</strong> — El Dorado County identifies Barton Memorial Hospital as the county's designated base hospital and a Level III Trauma Center; prior county and nonprofit-sector sources identify Barton Health as not-for-profit.</li>
      </ul>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">San Francisco / Bay Area</h3>

      <ul class="list-disc pl-6 my-4">
        <li><strong>UCSF Health</strong> — UCSF says it is a public nonprofit institution exempt under 501(c)(3).</li>
        <li><strong>Zuckerberg San Francisco General Hospital and Trauma Center</strong> — part of the San Francisco Department of Public Health, so government employment.</li>
        <li><strong>Laguna Honda Hospital and Rehabilitation Center</strong> — also part of San Francisco DPH.</li>
        <li><strong>San Francisco VA Medical Center / VA system</strong> — federal government employer.</li>
        <li><strong>Alameda Health System hospitals</strong> — public health system.</li>
        <li><strong>Contra Costa Regional Medical Center</strong> — county health system.</li>
        <li><strong>Santa Clara Valley Medical Center</strong> — county health system.</li>
        <li><strong>San Mateo Medical Center</strong> — county health system.</li>
        <li><strong>MarinHealth Medical Center</strong> — nonprofit-backed system; MarinHealth Foundation is 501(c)(3). Verify exact employing entity on the offer.</li>
        <li><strong>Stanford Health Care</strong> — California nonprofit public benefit corporation described in 501(c)(3).</li>
      </ul>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Arizona</h2>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Phoenix / Mesa / Scottsdale</h3>

      <ul class="list-disc pl-6 my-4">
        <li><strong>Valleywise Health Medical Center</strong> — public system tied to the Maricopa County Special Health Care District.</li>
        <li><strong>Banner Health hospitals</strong>, including:
          <ul class="list-disc pl-6 mt-2">
            <li>Banner Desert Medical Center</li>
            <li>Banner University Medical Center Phoenix</li>
          </ul>
          <p class="mt-1 text-sm italic">Banner says it is a nonprofit health system.</p>
        </li>
        <li><strong>HonorHealth hospitals</strong>, including:
          <ul class="list-disc pl-6 mt-2">
            <li>HonorHealth Scottsdale Osborn Medical Center</li>
            <li>HonorHealth Deer Valley Medical Center</li>
          </ul>
          <p class="mt-1 text-sm italic">HonorHealth says it is a nonprofit 501(c)(3) organization.</p>
        </li>
        <li><strong>Dignity Health / CommonSpirit Arizona hospitals</strong>, including:
          <ul class="list-disc pl-6 mt-2">
            <li>Arizona General Hospital Mesa</li>
          </ul>
          <p class="mt-1 text-sm italic">Dignity Health Arizona's hospital network is part of nonprofit CommonSpirit.</p>
        </li>
        <li><strong>Mayo Clinic Hospital, Phoenix</strong> — Mayo Clinic is nonprofit; verify exact employing entity.</li>
        <li><strong>Phoenix Children's Hospital</strong> — nonprofit 501(c)(3) hospital.</li>
        <li><strong>Phoenix VA Health Care System</strong> — federal government employer.</li>
        <li><strong>Phoenix Indian Medical Center</strong> — Indian Health Service federal employer.</li>
      </ul>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Safest PSLF Bets from This Whole List</h2>

      <p>The least ambiguous options are the government/federal hospitals:</p>

      <ul class="list-disc pl-6 my-4">
        <li>Zuckerberg San Francisco General</li>
        <li>Laguna Honda</li>
        <li>VA hospitals</li>
        <li>Alameda Health System</li>
        <li>Contra Costa Regional Medical Center</li>
        <li>Santa Clara Valley Medical Center</li>
        <li>San Mateo Medical Center</li>
        <li>Valleywise Health Medical Center</li>
        <li>Phoenix Indian Medical Center</li>
      </ul>

      <p>These government and federal employers offer the most straightforward path to PSLF qualification, as there is no ambiguity about their nonprofit or public status. For all other employers on this list, always verify the exact W-2 entity through the <a href="https://studentaid.gov/pslf/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">federal PSLF Help Tool</a> before committing.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Tax Comparison: Take-Home Pay Across Locations</h2>

      <p>Adding Hamilton County, Indiana to our comparison — using the same baseline assumptions: single filer, $130,000 W-2 wages, 2025 rules, no 401k/HSA adjustments, no itemizing, no special credits.</p>

      <p>Hamilton County lands slightly worse than Black Hawk County, Iowa, but still better than California. Indiana has a 3.00% state individual income tax rate for 2025, and Hamilton County's 2025 county income tax rate is 1.1%, for a combined nominal state+county rate of 4.1%. Indiana starts from federal AGI, not a California-style taxable-income system with the same standard-deduction structure, so this is best treated as a close planning estimate rather than a return-prep number.</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-4 font-bold text-foreground">Location</th>
              <th class="text-right py-3 px-4 font-bold text-foreground">Federal Income Tax</th>
              <th class="text-right py-3 px-4 font-bold text-foreground">FICA</th>
              <th class="text-right py-3 px-4 font-bold text-foreground">State/Local Income Tax</th>
              <th class="text-right py-3 px-4 font-bold text-foreground">Total Est. Tax</th>
              <th class="text-right py-3 px-4 font-bold text-foreground">Approx. Take-Home</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-4 text-muted-foreground">Sacramento / El Dorado County, CA</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$20,267</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$9,945</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$7,845</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$38,057</td>
              <td class="text-right py-3 px-4 font-semibold text-foreground">~$91,943</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-4 text-muted-foreground">Hamilton County, IN</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$20,267</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$9,945</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$5,330</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$35,542</td>
              <td class="text-right py-3 px-4 font-semibold text-foreground">~$94,458</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-4 text-muted-foreground">Black Hawk County, IA</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$20,267</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$9,945</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$4,342</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$34,554</td>
              <td class="text-right py-3 px-4 font-semibold text-foreground">~$95,446</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-4 text-muted-foreground">Phoenix / Scottsdale, AZ</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$20,267</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$9,945</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$2,856</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$33,068</td>
              <td class="text-right py-3 px-4 font-semibold text-foreground">~$96,932</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-4 text-muted-foreground">Houston, TX</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$20,267</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$9,945</td>
              <td class="text-right py-3 px-4 text-muted-foreground">$0</td>
              <td class="text-right py-3 px-4 text-muted-foreground">~$30,212</td>
              <td class="text-right py-3 px-4 font-bold text-foreground">~$99,788</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-sm text-muted-foreground italic">The federal figures above are based on the IRS 2025 single brackets and the $15,750 standard deduction. California's estimate uses its 2025 single standard deduction of $5,706 and the published 2025 rate schedules. Arizona uses a flat 2.5% rate. Iowa uses a flat 3.8% rate for 2025. Texas has no personal income tax.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Ranking by Best Take-Home at $130,000</h3>

      <ol class="list-decimal pl-6 my-4">
        <li><strong>Houston, TX</strong> — ~$99,788</li>
        <li><strong>Phoenix / Scottsdale, AZ</strong> — ~$96,932</li>
        <li><strong>Black Hawk County, IA</strong> — ~$95,446</li>
        <li><strong>Hamilton County, IN</strong> — ~$94,458</li>
        <li><strong>Sacramento / El Dorado County, CA</strong> — ~$91,943</li>
      </ol>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Annual Advantage vs. California</h3>

      <ul class="list-disc pl-6 my-4">
        <li><strong>Houston over California:</strong> about $7,845</li>
        <li><strong>Phoenix over California:</strong> about $4,989</li>
        <li><strong>Black Hawk County over California:</strong> about $3,503</li>
        <li><strong>Hamilton County over California:</strong> about $2,515</li>
      </ul>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Hamilton County vs. Iowa</h3>

      <ul class="list-disc pl-6 my-4">
        <li>Hamilton County trails Black Hawk County by about <strong>$988 per year</strong></li>
        <li>That is about <strong>$82 per month</strong> less take-home than Iowa under these assumptions</li>
      </ul>

      <p><strong>One nuance that matters:</strong> Indiana does have a county income tax, so Hamilton County is not interchangeable with the rest of Indiana the way Sacramento and El Dorado are within California for income tax. Hamilton County specifically uses the 1.1% county rate shown in Indiana's 2025 county chart.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">The Clean Practical Takeaway</h3>

      <p><strong>Texas best, Arizona second, Iowa third, Hamilton County fourth, California last</strong> for pure income-tax drag on a $130k single W-2 salary.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Relocation Decision Model: ED Pay, Rent & Monthly Cash Flow</h2>

      <p>Here's a decision model for moving from Waterloo using ED pay assumptions, 1BR vs 2BR rent, retirement deductions, and monthly leftover cash.</p>

      <p>This is built as a <strong>planning model, not a paycheck quote</strong>. Assumptions: single filer, traditional 401k at 12%, self-only HSA at $4,400 for 2026, and no health premium, parking, student loan, or bonus/overtime adjustments. For taxes, I used the current federal 2025 bracket structure and standard deduction, Social Security 6.2% plus Medicare 1.45%, California's 2025 standard deduction and rate schedule, Arizona's 2.5% flat tax, Iowa's 3.8% flat tax, Indiana's 3.0% state rate plus Hamilton County's 1.1% county rate, and Texas's no personal income tax. California is a special case because it does not conform to HSA deductions, so the HSA is treated as reducing federal and FICA taxable wages but not California taxable income.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Salary Assumptions</h3>

      <p>These are ED-leaning market estimates, not generic all-specialties PA averages:</p>

      <ul class="list-disc pl-6 my-4">
        <li><strong>Waterloo:</strong> Anchored to the Cedar Falls PA market as a local proxy because Waterloo-specific transparent ED pay is sparse.</li>
        <li><strong>Sacramento:</strong> Based on nearby emergency APP postings and UC Davis emergency PA compensation signals.</li>
        <li><strong>Phoenix:</strong> Anchored to a current Phoenix Children emergency/urgent care posting showing a $166,000–$186,000 base.</li>
        <li><strong>Houston:</strong> Anchored to Houston Methodist PA hourly pay and IES Texas PA hourly pay.</li>
        <li><strong>Hamilton County:</strong> Anchored to the Indianapolis emergency PA market because Hamilton functions as the Carmel/Fishers/Indy employment orbit.</li>
      </ul>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Rent Assumptions (Zillow Data)</h3>

      <p>1BR / 2BR averages:</p>

      <ul class="list-disc pl-6 my-4">
        <li><strong>Waterloo:</strong> $639 / $825</li>
        <li><strong>Sacramento:</strong> $1,510 / $1,900</li>
        <li><strong>Phoenix:</strong> $1,204 / $1,550</li>
        <li><strong>Houston:</strong> $1,150 / $1,500</li>
        <li><strong>Hamilton County (Carmel/Fishers blend):</strong> $1,504 / $1,776</li>
      </ul>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Relocation Model</h3>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Market</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">ED Pay</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">401k 12%</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">HSA</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Monthly Take-Home</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">1BR Rent</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">2BR Rent</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Left after 1BR</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Left after 2BR</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Waterloo</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$113,999</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$13,680/yr</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,400/yr</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$5,995/mo</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$639</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$825</td>
              <td class="text-right py-3 px-3 text-foreground">$5,356/mo</td>
              <td class="text-right py-3 px-3 text-foreground">$5,170/mo</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Sacramento</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$160,000</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$19,200/yr</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,400/yr</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$7,812/mo</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,510</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,900</td>
              <td class="text-right py-3 px-3 text-foreground">$6,302/mo</td>
              <td class="text-right py-3 px-3 text-foreground">$5,912/mo</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 text-muted-foreground font-semibold">Phoenix</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$176,000</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$21,120/yr</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,400/yr</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$9,067/mo</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,204</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,550</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$7,863/mo</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$7,517/mo</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Houston</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$162,000</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$19,440/yr</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,400/yr</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$8,657/mo</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,150</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,500</td>
              <td class="text-right py-3 px-3 text-foreground">$7,507/mo</td>
              <td class="text-right py-3 px-3 text-foreground">$7,157/mo</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Hamilton County / Indy</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$156,568</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$18,788/yr</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,400/yr</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$7,987/mo</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,504</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,776</td>
              <td class="text-right py-3 px-3 text-foreground">$6,483/mo</td>
              <td class="text-right py-3 px-3 text-foreground">$6,211/mo</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">What Jumps Out</h3>

      <p><strong>Phoenix is the strongest pure cash-flow play in this model.</strong> It wins because the modeled ED pay is strong, Arizona's state tax is only 2.5%, and rent is still meaningfully below Sacramento and roughly in line with Houston on a practical apartment basis.</p>

      <p><strong>Houston is a very close second</strong> and probably the best tax story. No state income tax matters a lot once your compensation gets into the mid-$100k range, and Houston rent is still relatively manageable compared with California.</p>

      <p><strong>Hamilton County is solid,</strong> but it no longer looks like the winner once you model ED-leaning pay in Phoenix and Houston. It still beats Sacramento on taxes and likely gives you a cleaner Midwest transition, but the Hamilton county tax layer and higher suburban rent blunt some of the advantage.</p>

      <p><strong>Sacramento is the most expensive tax environment here,</strong> but it is not dead-on-arrival. The city's rent is higher and California taxes hit harder, especially because California does not conform to HSA treatment, yet the market can still work if you land a stronger ED job or want the California career upside badly enough.</p>

      <p><strong>Waterloo is still the cheapest place to live,</strong> but not the best place to maximize monthly surplus if you can materially increase pay elsewhere. The local rent is excellent, but the modeled compensation ceiling is lower than Phoenix, Houston, and Hamilton/Indy.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Blunt Ranking: Monthly Leftover Cash</h3>

      <p>After taxes, 401k, HSA, and rent:</p>

      <ol class="list-decimal pl-6 my-4">
        <li><strong>Phoenix</strong></li>
        <li><strong>Houston</strong></li>
        <li><strong>Hamilton County / Indy orbit</strong></li>
        <li><strong>Sacramento</strong></li>
        <li><strong>Waterloo</strong></li>
      </ol>

      <p class="text-sm text-muted-foreground italic">If you add a backdoor Roth bucket of about $583/month, subtract that equally from each city's leftover cash. That does not change the ranking.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Best Practical Read</h3>

      <p>If your goal is to leave Waterloo and maximize financial room while staying in a real hospital market, <strong>Phoenix and Houston are the cleanest choices</strong> in this model. Hamilton County is still respectable, especially if you want a shorter cultural jump from Iowa, but it is not the top cash-flow winner once assumptions are pushed toward actual ED compensation.</p>

      <p>The next most useful version of this would be a more personalized model using your likely setup: 10 shifts/month, your actual current retirement plan, student loans if any, and a target rent budget for you and your fiancée.</p>
    `
  },
  "ai-bubble-concerns": {
    title: "The AI Bubble: Should We Be Concerned?",
    category: "TECHNOLOGY",
    date: "December 15, 2025",
    readTime: "8 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: techPost,
    content: `
      <p>The artificial intelligence sector has experienced unprecedented growth over the past few years, with valuations reaching stratospheric levels. From startups to tech giants, everyone seems to be racing to integrate AI into their products and services. But as someone who closely follows both technology and investment trends, I find myself asking: are we witnessing genuine innovation, or are we inflating another bubble?</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">The Numbers Behind the Hype</h2>
      
      <p>Investment in AI companies has skyrocketed. Venture capital funding for AI startups exceeded $50 billion in 2024 alone, with some companies receiving valuations that seem disconnected from their actual revenue or even their path to profitability. This pattern is eerily reminiscent of the dot-com bubble of the late 1990s and early 2000s.</p>
      
      <p>The key difference, proponents argue, is that AI delivers tangible value. Unlike many dot-com companies that promised future utility, AI tools like ChatGPT and various enterprise solutions are already transforming how millions of people work. But does current utility justify current valuations?</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Lessons from Healthcare Technology</h2>
      
      <p>In my work in healthcare, I've seen firsthand how technology adoption often follows a predictable pattern. Initial enthusiasm leads to massive investment, followed by a period of disillusionment when the technology doesn't immediately deliver on all its promises. Eventually, a more realistic understanding emerges, and the technology finds its proper place in the ecosystem.</p>
      
      <p>AI in healthcare is going through this cycle right now. Early promises of AI replacing physicians have given way to more nuanced discussions about AI as a tool that augments clinical decision-making. This is healthy and necessary maturation.</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Signs of Bubble Behavior</h2>
      
      <p>Several warning signs suggest we may be in bubble territory:</p>
      
      <ul class="list-disc pl-6 my-4">
        <li><strong>FOMO-driven investment:</strong> Companies are adding "AI" to their descriptions to attract funding, regardless of whether AI is central to their product</li>
        <li><strong>Unsustainable burn rates:</strong> Many AI startups are spending far more than they earn, betting on future market dominance</li>
        <li><strong>Talent wars:</strong> AI engineers command salaries that seem detached from the value they can immediately create</li>
        <li><strong>Concentration risk:</strong> A few large players control the foundational models, creating potential fragility in the ecosystem</li>
      </ul>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">The Case Against the Bubble Narrative</h2>
      
      <p>However, there are compelling arguments against the bubble theory. AI represents a genuine technological paradigm shift, not just incremental improvement. The productivity gains from AI are measurable and significant. Enterprise adoption is accelerating, suggesting real demand rather than speculative interest.</p>
      
      <p>Moreover, the infrastructure being built—data centers, specialized chips, new software frameworks—represents lasting value that will persist regardless of short-term market fluctuations.</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">A Balanced Perspective</h2>
      
      <p>My view is nuanced. I believe AI is transformative technology with genuine long-term value. However, current valuations for many AI companies likely exceed their realistic near-term potential. This doesn't mean a dramatic crash is inevitable—a gradual correction and consolidation is equally possible.</p>
      
      <p>For investors and professionals alike, the key is to focus on fundamentals: which companies are building sustainable businesses, which applications of AI deliver genuine value, and which trends are driven by hype rather than utility.</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Implications for Healthcare Professionals</h2>
      
      <p>For those of us in healthcare, this analysis has practical implications. We should embrace AI tools that genuinely improve patient care and clinical efficiency. At the same time, we should maintain healthy skepticism about AI solutions that promise more than they can deliver.</p>
      
      <p>The goal isn't to resist technological change but to adopt it thoughtfully, ensuring that innovation serves our patients and our profession rather than simply enriching investors.</p>
      
      <p>As I continue to work at the intersection of healthcare and technology, I remain optimistic about AI's potential while staying vigilant about its limitations. That balance, I believe, is the healthiest approach to navigating this transformative moment in technology history.</p>
    `
  },
  "seamless-ehr-transfers-benefits": {
    title: "The Benefits of Seamless EHR Transfers: Improving Patient Care",
    category: "HEALTHCARE",
    date: "December 10, 2025",
    readTime: "7 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>As a practicing physician assistant, I've witnessed countless situations where incomplete or delayed access to patient health records has compromised care quality. The promise of electronic health records (EHRs) was to solve this problem, but fragmented systems and poor interoperability have often created new challenges. However, the movement toward seamless EHR transfers offers genuine hope for transforming patient care.</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">The Current State of Health Information Exchange</h2>
      
      <p>Today's healthcare landscape is characterized by information silos. A patient may have records scattered across multiple providers, hospitals, and health systems, each using different EHR platforms that don't communicate effectively with each other. The result is incomplete clinical pictures, redundant testing, and potential safety risks.</p>
      
      <p>In my clinical practice, I regularly encounter patients who can't remember their complete medication lists or who are unaware of critical findings from previous visits to other providers. This fragmentation doesn't just inconvenience healthcare workers—it puts patients at risk.</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">What Seamless EHR Transfer Looks Like</h2>
      
      <p>Seamless EHR transfer means that when a patient moves between providers, their complete health information follows them—instantly and accurately. This includes:</p>
      
      <ul class="list-disc pl-6 my-4">
        <li><strong>Complete medication history:</strong> Including dosages, prescribing dates, and any documented allergies or adverse reactions</li>
        <li><strong>Laboratory and imaging results:</strong> With full historical context and trends</li>
        <li><strong>Clinical notes:</strong> From specialists, primary care, and hospital encounters</li>
        <li><strong>Immunization records:</strong> Critical for preventive care</li>
        <li><strong>Social and family history:</strong> Important context for clinical decision-making</li>
      </ul>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Benefits for Patient Safety</h2>
      
      <p>The safety implications of seamless data transfer are profound. Consider a patient presenting to an emergency department with chest pain. With complete access to their cardiology records from another system, the emergency physician can immediately see previous stress test results, cardiac catheterization findings, and established treatment plans. This context can be life-saving.</p>
      
      <p>Drug-drug interactions represent another critical area. When providers can see complete medication lists across all prescribers, they can identify potentially dangerous combinations that might otherwise be missed.</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Reducing Healthcare Costs</h2>
      
      <p>Redundant testing is a massive source of healthcare waste. Patients frequently undergo repeated imaging studies, laboratory panels, and diagnostic procedures because their results from other institutions aren't accessible. Seamless EHR transfer can eliminate much of this redundancy.</p>
      
      <p>Beyond direct cost savings, improved information flow can reduce hospital readmissions by ensuring that discharge summaries and follow-up plans are immediately available to outpatient providers.</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Improving Clinical Efficiency</h2>
      
      <p>As a clinician, significant portions of my day are spent gathering information—calling other offices, requesting records, and waiting for faxes (yes, faxes are still common in healthcare). Seamless data transfer would reclaim this time for direct patient care.</p>
      
      <p>The documentation burden on providers could also decrease, as relevant historical information would auto-populate rather than requiring manual re-entry.</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Challenges and Considerations</h2>
      
      <p>Of course, seamless EHR transfer isn't without challenges. Privacy and security concerns are paramount—health information is among the most sensitive data types, and any transfer system must maintain rigorous protections. Patient consent frameworks need to be clear and accessible.</p>
      
      <p>Technical standards, while improving, still need work. The FHIR (Fast Healthcare Interoperability Resources) standard represents significant progress, but widespread adoption remains incomplete.</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">The Path Forward</h2>
      
      <p>Recent federal regulations, including the 21st Century Cures Act, are pushing the industry toward greater interoperability by prohibiting "information blocking." Health systems that previously resisted data sharing are now required to enable it.</p>
      
      <p>As healthcare technology continues to evolve, seamless EHR transfer will become the norm rather than the exception. This transition represents one of the most meaningful improvements we can make to healthcare delivery—not through new treatments or procedures, but through better coordination of the care we already provide.</p>
      
      <p>For patients, this means safer, more efficient care. For providers, it means more time for what matters most: the patient relationship. And for the healthcare system as a whole, it means better outcomes at lower cost. That's a vision worth pursuing.</p>
    `
  },
  "pslf-hospital-finder-by-city-zip": {
    title: "Find PSLF-Qualifying Hospitals by City or Zip Code",
    category: "HEALTHCARE",
    date: "March 15, 2026",
    readTime: "5 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: pslfFinder,
    content: `
      <p>If you're a healthcare professional with federal student loans, <strong>Public Service Loan Forgiveness (PSLF)</strong> can eliminate your remaining balance after 120 qualifying payments while working for a qualifying employer. The challenge? Figuring out which hospitals actually qualify.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">How PSLF Employer Qualification Works</h2>

      <p>PSLF eligibility is based on your <strong>actual W-2 employer</strong>, not the hospital building you work in. Two categories of employers qualify:</p>

      <ul class="list-disc pl-6 my-4">
        <li><strong>Government employers</strong> — Federal (VA, IHS), state (university systems), county/city health systems. These are the <em>least ambiguous</em> and safest bets for PSLF.</li>
        <li><strong>501(c)(3) nonprofit organizations</strong> — Most major health systems (Sutter, Banner, HonorHealth, etc.) are structured as nonprofits. However, you must verify the exact employing entity, as some hospitals may use staffing agencies or for-profit subsidiaries.</li>
      </ul>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Common Pitfalls</h2>

      <ul class="list-disc pl-6 my-4">
        <li><strong>Staffing agencies:</strong> If you're employed through a staffing company rather than the hospital directly, the staffing company's tax status determines PSLF eligibility — not the hospital's.</li>
        <li><strong>For-profit subsidiaries:</strong> Some nonprofit systems have for-profit physician practice groups or management companies. Your offer letter and W-2 entity matter.</li>
        <li><strong>Contract vs. employed:</strong> Independent contractors (1099) do not qualify for PSLF. You must be a W-2 employee.</li>
      </ul>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Verification Steps</h2>

      <ol class="list-decimal pl-6 my-4">
        <li>Use the <a href="https://studentaid.gov/pslf/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Federal PSLF Help Tool</a> — enter your employer's EIN to check qualification.</li>
        <li>Ask HR for the exact legal entity name on your W-2 before accepting a position.</li>
        <li>Submit your <strong>Employment Certification Form (ECF)</strong> annually to track qualifying payments.</li>
        <li>Ensure you're on an <strong>Income-Driven Repayment (IDR)</strong> plan — standard 10-year plans will pay off the loan before forgiveness kicks in.</li>
      </ol>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Markets Covered in This Finder</h2>

      <p>The interactive tool below covers PSLF-qualifying hospitals across the markets most relevant for PA relocation planning:</p>

      <ul class="list-disc pl-6 my-4">
        <li><strong>Sacramento / El Dorado County, CA</strong> — UC Davis, Sutter, Dignity Health/CommonSpirit, Marshall, Barton, Kaiser</li>
        <li><strong>San Francisco / Bay Area, CA</strong> — UCSF, SF General, VA, county systems, Stanford</li>
        <li><strong>Phoenix / Mesa / Scottsdale, AZ</strong> — Valleywise, Banner, HonorHealth, Mayo, Phoenix Children's, VA, IHS</li>
        <li><strong>Houston, TX</strong> — Houston Methodist, Memorial Hermann, Ben Taub, VA, Texas Children's, MD Anderson</li>
        <li><strong>Indianapolis / Hamilton County, IN</strong> — IU Health, Eskenazi, VA, Ascension, Community Health</li>
        <li><strong>Waterloo / Iowa City, IA</strong> — UnityPoint, MercyOne, VA, University of Iowa</li>
      </ul>

      <p class="text-sm text-muted-foreground italic">Use the search tool below to find hospitals by city, zip code, state, or system name. Government employers are flagged with a shield icon as the safest PSLF bets.</p>
    `
  },
  "san-jose-suburb-guide-3br-housing-commute-hospital": {
    title: "San Jose Suburb Guide: 3BR Housing, Hospital Commute & Move-Ready Cash",
    category: "HEALTHCARE",
    date: "March 15, 2026",
    readTime: "22 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: sanJoseSuburbs,
    content: `
      <p>This is the San Jose orbit version of the Sacramento suburb breakdown — same framework, same PA-income model. I covered 8 suburbs within about 40 minutes of downtown San Jose on a no-traffic basis: <strong>Santa Clara, Campbell, Milpitas, Cupertino, Los Gatos, Sunnyvale, Mountain View, and Morgan Hill</strong>.</p>

      <p class="text-sm text-muted-foreground italic">All suburbs are in California, so state income tax is effectively the same. The real differences are rent, commute, hospital access, and neighborhood feel.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Suburb Comparison: Rent, Commute & Hospital Access</h2>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Area</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Drive to SJ</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Distance</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Zillow 3BR</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Planning Number</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Hospital Access</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 text-muted-foreground font-semibold">Campbell</td>
              <td class="text-right py-3 px-3 text-muted-foreground">11 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~7 mi</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,995</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,100–$4,600</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">Excellent</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Santa Clara</td>
              <td class="text-right py-3 px-3 text-muted-foreground">11 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">4 mi</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,850</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,900–$5,400</td>
              <td class="text-right py-3 px-3 text-foreground">Excellent</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Milpitas</td>
              <td class="text-right py-3 px-3 text-muted-foreground">16 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~8 mi</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,200</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,300–$4,800</td>
              <td class="text-right py-3 px-3 text-foreground">Very good</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Los Gatos</td>
              <td class="text-right py-3 px-3 text-muted-foreground">12 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">11 mi</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,900</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$5,000–$5,700</td>
              <td class="text-right py-3 px-3 text-foreground">Very good</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Sunnyvale</td>
              <td class="text-right py-3 px-3 text-muted-foreground">18 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">12 mi</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,700</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,800–$5,400</td>
              <td class="text-right py-3 px-3 text-foreground">Very good</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Cupertino</td>
              <td class="text-right py-3 px-3 text-muted-foreground">13 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">10 mi</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$5,140</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$5,200–$5,800</td>
              <td class="text-right py-3 px-3 text-foreground">Very good</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Morgan Hill</td>
              <td class="text-right py-3 px-3 text-muted-foreground">26 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~23 mi</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,100</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,200–$4,800</td>
              <td class="text-right py-3 px-3 text-foreground">Good</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Mountain View</td>
              <td class="text-right py-3 px-3 text-muted-foreground">19 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~13 mi</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$5,950</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$6,000–$6,700</td>
              <td class="text-right py-3 px-3 text-foreground">Excellent</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>The Zillow numbers are current 3-bedroom market averages. The "planning number" is what I'd realistically underwrite for a single-family 3BR house with a yard, not just a generic apartment.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Tax Read</h2>

      <p>There is <strong>no meaningful city-by-city income-tax edge</strong> inside this group. They are all California suburbs in the same state tax system. Moving from Campbell to Sunnyvale or Morgan Hill does not create an Arizona-vs-California type of tax difference.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Hospital Access Deep Dive</h2>

      <p>Key hospitals in this orbit:</p>

      <ul class="list-disc pl-6 my-4">
        <li><strong>Santa Clara Valley Medical Center</strong> — 751 S Bascom Ave, San Jose. County health system.</li>
        <li><strong>O'Connor Hospital</strong> — 2105 Forest Ave, San Jose. 358 licensed beds.</li>
        <li><strong>Good Samaritan Hospital</strong> — 2425 Samaritan Dr, San Jose.</li>
        <li><strong>Regional Medical Center</strong> — 225 N Jackson Ave, San Jose.</li>
        <li><strong>Kaiser Santa Clara ER</strong> — 700 Lawrence Expy, Santa Clara. 24/7 emergency department.</li>
        <li><strong>El Camino Mountain View</strong> — 2500 Grant Rd, Mountain View. Emergency care on site.</li>
        <li><strong>El Camino Los Gatos</strong> — 24-hour ER, 143 licensed beds.</li>
        <li><strong>St. Louise Regional Hospital</strong> — Morgan Hill. 24/7 ER, 93 licensed beds.</li>
      </ul>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Best-Fit Awards: Category Winners</h2>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Category</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Winner</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Why</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Runner-Up</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Young couple / attractions</td>
              <td class="py-3 px-3 text-muted-foreground">Campbell</td>
              <td class="py-3 px-3 text-muted-foreground text-xs">Best mix of walkable downtown, events, restaurants, farmers market energy.</td>
              <td class="py-3 px-3 text-muted-foreground">Sunnyvale, then Los Gatos</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Affordability</td>
              <td class="py-3 px-3 text-muted-foreground">Campbell</td>
              <td class="py-3 px-3 text-muted-foreground text-xs">Lowest current 3BR market signal in the close-in group at $3,995.</td>
              <td class="py-3 px-3 text-muted-foreground">Morgan Hill, then Milpitas</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Hospital commute</td>
              <td class="py-3 px-3 text-muted-foreground">Santa Clara</td>
              <td class="py-3 px-3 text-muted-foreground text-xs">Closest to SJ/SC hospital core. Kaiser Santa Clara ER on site.</td>
              <td class="py-3 px-3 text-muted-foreground">Campbell</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Nature / outdoors</td>
              <td class="py-3 px-3 text-muted-foreground">Los Gatos</td>
              <td class="py-3 px-3 text-muted-foreground text-xs">Strongest trail/open-space profile. Los Gatos Creek Trail is a real asset.</td>
              <td class="py-3 px-3 text-muted-foreground">Morgan Hill</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Getting a yard</td>
              <td class="py-3 px-3 text-muted-foreground">Morgan Hill</td>
              <td class="py-3 px-3 text-muted-foreground text-xs">Best chance at true house feel without Los Gatos/Cupertino pricing.</td>
              <td class="py-3 px-3 text-muted-foreground">Campbell</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Best overall compromise</td>
              <td class="py-3 px-3 text-muted-foreground">Campbell</td>
              <td class="py-3 px-3 text-muted-foreground text-xs">Most balanced mix of commute, cost, and livability.</td>
              <td class="py-3 px-3 text-muted-foreground">Santa Clara</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Area-by-Area Read</h2>

      <p><strong>Santa Clara</strong> — Best "work-first" suburb. Tiny commute, Kaiser Santa Clara right there. Housing is very high (~$4,850 3BR). If hospital access matters most, this is one of the strongest picks.</p>

      <p><strong>Campbell</strong> — Best all-around compromise. Very close to San Jose, active downtown with events and a weekly farmers' market, and the cheapest 3BR signal among core west-side suburbs. For a young couple that still wants a life outside work, Campbell is the cleanest answer.</p>

      <p><strong>Milpitas</strong> — Practical more than romantic. Close enough, cheaper than Cupertino/Los Gatos/Sunnyvale/Mountain View, but less charm than Campbell. "Good logistics, decent value, less character."</p>

      <p><strong>Cupertino</strong> — Polished, high-performing, expensive. Strong parks-and-recreation system. ~$5,140 for a 3BR. Great if you want a very polished west-valley suburb and can absorb the rent.</p>

      <p><strong>Los Gatos</strong> — Best close-in nature/lifestyle suburb. Parks, trails, open-space areas, Los Gatos Creek Trail. Has its own hospital access. The problem is cost: premium-suburb pricing.</p>

      <p><strong>Sunnyvale</strong> — Strong practical option if you care about the broader Silicon Valley corridor. Less charming than Campbell or Los Gatos, but functional. Cost is high, still below Mountain View and Cupertino.</p>

      <p><strong>Mountain View</strong> — Excellent hospital access via El Camino, but the clear housing outlier at $5,950 for a 3BR, highest in this table. Tough to justify on one income unless the offer pays materially more.</p>

      <p><strong>Morgan Hill</strong> — Best shot at a real house-and-yard feel without premium pricing. Parks/open-space identity and south-county hospital access via St. Louise. Tradeoff: longer commute, fewer nearby major hospitals.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Hospital Commute Fit by Suburb</h2>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-2 font-bold text-foreground">Suburb</th>
              <th class="text-center py-3 px-2 font-bold text-foreground text-xs">SCVMC</th>
              <th class="text-center py-3 px-2 font-bold text-foreground text-xs">O'Connor</th>
              <th class="text-center py-3 px-2 font-bold text-foreground text-xs">Good Sam</th>
              <th class="text-center py-3 px-2 font-bold text-foreground text-xs">Regional</th>
              <th class="text-center py-3 px-2 font-bold text-foreground text-xs">Kaiser SC</th>
              <th class="text-center py-3 px-2 font-bold text-foreground text-xs">El Camino MV</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-2 px-2 text-muted-foreground font-semibold">Campbell</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★½</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★½</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-2 px-2 text-muted-foreground">Santa Clara</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★½</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★½</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-2 px-2 text-muted-foreground">Los Gatos</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★½</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-2 px-2 text-muted-foreground">Milpitas</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★½</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★½</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-2 px-2 text-muted-foreground">Sunnyvale</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★½</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★½</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★½</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★★</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-2 px-2 text-muted-foreground">Cupertino</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★½</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★½</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★½</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-2 px-2 text-muted-foreground">Mountain View</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★½</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★★★</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-2 px-2 text-muted-foreground">Morgan Hill</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★½</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★½</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★½</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★</td>
              <td class="text-center py-2 px-2 text-xs text-muted-foreground">★</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Best Suburb by Hospital</h3>

      <ul class="list-disc pl-6 my-4">
        <li><strong>SCVMC or O'Connor:</strong> Campbell → Santa Clara → Los Gatos</li>
        <li><strong>Good Samaritan:</strong> Los Gatos → Campbell → Cupertino</li>
        <li><strong>Regional Medical Center:</strong> Milpitas → Santa Clara → Sunnyvale</li>
        <li><strong>Kaiser Santa Clara:</strong> Santa Clara → Sunnyvale → Campbell/Cupertino</li>
        <li><strong>El Camino Mountain View:</strong> Mountain View → Sunnyvale → Cupertino</li>
      </ul>

      <p>If you want <strong>one suburb that keeps the most hospital options open</strong>: Campbell → Santa Clara → Sunnyvale → Los Gatos → Milpitas.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Visual Commute Maps</h3>

      <p>These schematic maps show the relative positions of suburbs and hospitals around the San Jose core. Hospitals are shown as squares, suburbs as circles. Dashed lines connect each suburb to its best-fit hospital.</p>

      <div class="my-8 space-y-6">
        <div class="rounded-lg overflow-hidden border border-border">
          <img src="${sjCommuteMap1}" alt="San Jose Hospital Commute Map — schematic layout for suburb and hospital orientation" class="w-full h-auto" />
          <p class="text-xs text-muted-foreground p-3 bg-muted/30">Schematic layout showing suburb and hospital positions relative to downtown San Jose. Not to scale.</p>
        </div>
        <div class="rounded-lg overflow-hidden border border-border">
          <img src="${sjCommuteMap2}" alt="San Jose Hospital Commute Map — color-coded by best suburb for each hospital" class="w-full h-auto" />
          <p class="text-xs text-muted-foreground p-3 bg-muted/30">Color-coded by best suburb for each hospital based on commute analysis. Dashed lines show best suburb-hospital pairings.</p>
        </div>
      </div>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Move-Ready Cash Model</h2>

      <p>Same planning assumptions: ~$7,812/month take-home (California PA model), $2,450/month for non-rent living costs, California security deposit capped at one month's rent, and DIY moving-truck estimate from Waterloo.</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Area</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Rent Ceiling</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Security Dep.</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Setup</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Truck + Travel</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Min. Cash</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Monthly Left</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Safer Target</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 text-muted-foreground font-semibold">Campbell</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,300</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,300</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$350</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,600</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$12,550</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$1,062</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$15,000</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Morgan Hill</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,500</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,500</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$400</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,800</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$13,200</td>
              <td class="text-right py-3 px-3 text-foreground">$862</td>
              <td class="text-right py-3 px-3 text-foreground">$15,650</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Milpitas</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,500</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,500</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$350</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,700</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$13,050</td>
              <td class="text-right py-3 px-3 text-foreground">$862</td>
              <td class="text-right py-3 px-3 text-foreground">$15,500</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Sunnyvale</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$5,000</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$5,000</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$350</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,700</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$14,050</td>
              <td class="text-right py-3 px-3 text-foreground">$362</td>
              <td class="text-right py-3 px-3 text-foreground">$16,500</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Santa Clara</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$5,100</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$5,100</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$350</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,700</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$14,250</td>
              <td class="text-right py-3 px-3 text-foreground">$262</td>
              <td class="text-right py-3 px-3 text-foreground">$16,700</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Los Gatos</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$5,300</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$5,300</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$400</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,700</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$14,700</td>
              <td class="text-right py-3 px-3 text-foreground">$62</td>
              <td class="text-right py-3 px-3 text-foreground">$17,150</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Cupertino</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$5,500</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$5,500</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$400</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,700</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$15,100</td>
              <td class="text-right py-3 px-3 text-foreground">−$138</td>
              <td class="text-right py-3 px-3 text-foreground">$17,550</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Mountain View</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$6,300</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$6,300</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$400</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,800</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$16,800</td>
              <td class="text-right py-3 px-3 text-foreground">−$938</td>
              <td class="text-right py-3 px-3 text-foreground">$19,250</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">What Jumps Out</h3>

      <p><strong>Best move-ready value: Campbell.</strong> Lowest 3BR signal among close-in west-side suburbs, keeps move-in cash lower, and still leaves a usable monthly cushion.</p>

      <p><strong>Best house-and-yard option: Morgan Hill.</strong> Farther out but materially cheaper, similar monthly margin to Milpitas.</p>

      <p><strong>Best logistics without luxury pricing: Milpitas.</strong> Lower move-in cash than Santa Clara/Sunnyvale/Los Gatos/Cupertino/Mountain View while staying close to the SJ core.</p>

      <p><strong>Most dangerous for one-income margin: Mountain View and Cupertino.</strong> Both are negative-margin or too tight on the conservative model.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Pet Note</h3>

      <p>Pet deposits commonly run $200–$500 and pet rent $25–$100/month. In California, the landlord may only charge a security deposit of up to one month's rent for most residential rentals, so what some call a "pet deposit" is still part of that deposit bucket.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Final Ranking: All 8 Suburbs</h2>

      <p>For one income + 3BR house target + wanting actual breathing room:</p>

      <ol class="list-decimal pl-6 my-4">
        <li><strong>Campbell</strong> — Most balanced mix of commute, cost, and livability</li>
        <li><strong>Morgan Hill</strong> — Best house-and-yard play without premium pricing</li>
        <li><strong>Milpitas</strong> — Practical, close, decent value</li>
        <li><strong>Sunnyvale</strong> — Functional Silicon Valley positioning, pricey</li>
        <li><strong>Santa Clara</strong> — Best hospital logistics, utilitarian feel</li>
        <li><strong>Los Gatos</strong> — Great lifestyle suburb, tight on one income</li>
        <li><strong>Cupertino</strong> — Polished, negative margin on conservative model</li>
        <li><strong>Mountain View</strong> — Only makes sense for El Camino, worst value</li>
      </ol>

      <div id="zillow-cards-placeholder"></div>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">The Bottom Line</h2>

      <p>If you want the <strong>least painful Bay Area launch</strong>: Campbell, Morgan Hill, and Milpitas.</p>

      <p>If you want the <strong>nicest close-in lifestyle</strong> and can tolerate a tighter budget: Los Gatos.</p>

      <p>If you want the <strong>best hospital proximity</strong> and accept that the numbers get tight: Santa Clara.</p>

      <p>The single best all-around compromise for a PA relocating to the San Jose orbit with a partner is <strong>Campbell</strong>. It avoids being absurdly expensive while giving you strong hospital access and an actual lifestyle.</p>

      <p class="text-sm text-muted-foreground italic mt-6">All rent figures from current Zillow market-trend pages. Commute estimates are no-traffic baselines from Travelmath. Take-home uses the same $160k gross / 12% 401k / HSA / single-filer California model. Move-ready cash assumes DIY truck move from Waterloo, IA.</p>
    `
  },
  "phoenix-metro-suburb-guide-3br-housing-hospital-commute": {
    title: "Phoenix Metro Suburb Guide: 3BR Housing, Hospital Commute & Neighborhood Breakdown",
    category: "HEALTHCARE",
    date: "March 15, 2026",
    readTime: "25 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: phoenixSuburbs,
    content: `
      <p>The Phoenix metro is one of the strongest relocation markets for a PA targeting hospital work with a 3BR house and yard. The big structural advantage over California: <strong>Arizona has a flat 2.5% state income tax</strong>, and there's no meaningful city-by-city tax difference across Phoenix, Mesa, Chandler, Scottsdale, or Glendale. The real decision points are rent, commute, hospital access, vibe, and yard value.</p>

      <p class="text-sm text-muted-foreground italic">All cities share the same Arizona flat tax, so this is a housing + commute + lifestyle decision, not a tax one.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Quick Comparison</h2>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">City</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Drive to Phoenix</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Zillow 3BR</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Planning Number</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Hospital Access</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Phoenix</td>
              <td class="text-right py-3 px-3 text-muted-foreground">In-city</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,195</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,250–$2,600</td>
              <td class="py-3 px-3 text-muted-foreground">Excellent</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Mesa</td>
              <td class="text-right py-3 px-3 text-muted-foreground">27 min</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,250</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,300–$2,650</td>
              <td class="py-3 px-3 text-muted-foreground">Excellent</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Chandler</td>
              <td class="text-right py-3 px-3 text-muted-foreground">30 min / 22 mi</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,381</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,450–$2,850</td>
              <td class="py-3 px-3 text-muted-foreground">Very Good</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Scottsdale</td>
              <td class="text-right py-3 px-3 text-muted-foreground">24 min / 19 mi</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,850</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,900–$4,500</td>
              <td class="py-3 px-3 text-muted-foreground">Excellent</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Glendale</td>
              <td class="text-right py-3 px-3 text-muted-foreground">24 min / 10 mi</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,100</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,150–$2,500</td>
              <td class="py-3 px-3 text-muted-foreground">Excellent</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Hospital / ED Access</h2>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Phoenix</h3>
      <p>Best overall hospital density. Major anchors include <strong>Banner – University Medical Center Phoenix</strong> (698 beds, 72,000+ annual ED visits) and <strong>Valleywise Health Medical Center</strong> (627 staffed beds, 24/7 ED, governmental hospital district).</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Mesa</h3>
      <p>Best East Valley hospital anchor. <strong>Banner Desert Medical Center</strong> is one of the biggest hospitals in the state and a major East Valley referral center (459+ beds).</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Chandler</h3>
      <p>Strong suburban hospital option. <strong>Chandler Regional Medical Center</strong> has a full emergency department with broad specialty backup.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Scottsdale</h3>
      <p>Very strong hospital access, but expensive. <strong>HonorHealth Scottsdale Shea Medical Center</strong> has 427 beds and a 24-hour emergency department network.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Glendale</h3>
      <p>Strong West Valley hospital anchor. <strong>Banner Thunderbird Medical Center</strong> includes a Level I Adult Trauma Center, an 84-exam-room emergency department, and a 200-bed expansion tower.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Best-Fit Awards</h2>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Category</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Best Pick</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Why</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 text-muted-foreground">Young couple / attractions</td>
              <td class="py-3 px-3 font-semibold text-foreground">Scottsdale</td>
              <td class="py-3 px-3 text-muted-foreground">Best nightlife, dining, polish, and date-night density</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Affordability</td>
              <td class="py-3 px-3 font-semibold text-foreground">Glendale</td>
              <td class="py-3 px-3 text-muted-foreground">Cheapest 3BR signal in this group</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 text-muted-foreground">Hospital commute</td>
              <td class="py-3 px-3 font-semibold text-foreground">Phoenix</td>
              <td class="py-3 px-3 text-muted-foreground">Most central and densest hospital cluster</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Nature / outdoors</td>
              <td class="py-3 px-3 font-semibold text-foreground">Scottsdale</td>
              <td class="py-3 px-3 text-muted-foreground">Best desert recreation access</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 text-muted-foreground">Yard potential</td>
              <td class="py-3 px-3 font-semibold text-foreground">Glendale</td>
              <td class="py-3 px-3 text-muted-foreground">Best house + yard value without Scottsdale pricing</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Overall compromise</td>
              <td class="py-3 px-3 font-semibold text-foreground">Mesa</td>
              <td class="py-3 px-3 text-muted-foreground">Strong hospital access, manageable rent, decent livability</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">City-by-City Read</h2>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Phoenix</h3>
      <p>Best if you want maximum employer flexibility. If you're targeting multiple hospital systems, Phoenix keeps the board the widest. Rent is not the cheapest, but it is nowhere near Scottsdale bad.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Mesa</h3>
      <p>Probably the strongest "balanced" play. Rent is still reasonable by metro standards, and Banner Desert gives Mesa real hospital gravity rather than just commuter-suburb status.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Chandler</h3>
      <p>More polished than Mesa in a lot of people's eyes, but a bit pricier. Good if you want suburban quality and are okay paying a moderate premium. Chandler Regional helps it stay relevant for your job search.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Scottsdale</h3>
      <p>Best fun, best polish, worst value. It absolutely wins on lifestyle if you want the most active young-couple environment, but the Zillow 3BR number is dramatically higher than the others. On one-income house math, this is the most dangerous option in this set.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Glendale</h3>
      <p>Best money play in this group. Cheaper than Phoenix, Mesa, Chandler, and way cheaper than Scottsdale, while still having real hospital infrastructure through Banner Thunderbird. If you care about yard value, Glendale is very attractive.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Move-Ready Cash Model</h2>

      <p>Arizona generally allows a security deposit up to 1.5 months' rent. Waterloo to Phoenix metro is roughly 1,517–1,531 driving miles (~24 hours drive time).</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">City</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">3BR Target</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Deposit</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Setup</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Truck + Travel</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Min Cash</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Safer Cash</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Phoenix</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,350–$2,700</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,525–$4,050</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$300–$400</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,800–$3,100</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$8,975–$10,250</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$11,400–$12,700</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Mesa</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,350–$2,700</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,525–$4,050</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$300–$400</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,800–$3,100</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$8,975–$10,250</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$11,400–$12,700</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Chandler</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,500–$2,900</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,750–$4,350</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$300–$400</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,850–$3,150</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$9,400–$10,800</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$11,900–$13,300</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Scottsdale</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,000–$4,600</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$6,000–$6,900</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$350–$450</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,850–$3,150</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$13,200–$15,100</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$15,700–$17,600</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Glendale</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,200–$2,550</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,300–$3,825</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$300–$400</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,750–$3,050</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$8,550–$9,825</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$10,950–$12,225</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p><strong>Best move-ready value:</strong> Glendale, then Mesa. They keep your lease-up stack lowest while still giving you real house inventory.</p>
      <p><strong>Most dangerous for one-income margin:</strong> Scottsdale. The move-in cash needed is in a totally different tier.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Neighborhood Breakdown</h2>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Phoenix Neighborhoods</h3>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Neighborhood</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Best For</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">3BR Rent</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">My Take</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Ahwatukee / 85044</td>
              <td class="py-3 px-3 text-muted-foreground">Balance, outdoor access</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,575</td>
              <td class="py-3 px-3 text-muted-foreground">Best Phoenix fit — South Mountain access, calmer suburban feel</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Arcadia / 85018</td>
              <td class="py-3 px-3 text-muted-foreground">Restaurants, charm</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,295</td>
              <td class="py-3 px-3 text-muted-foreground">Best vibe in Phoenix, but pricier</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Roosevelt Row / 85004</td>
              <td class="py-3 px-3 text-muted-foreground">Walkability, arts, fun</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$2,500</td>
              <td class="py-3 px-3 text-muted-foreground">Best fun, weak yard/house fit</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>Ahwatukee sits at the base of South Mountain Park — 100+ miles of trails and 16,000+ acres of preserve. Best Phoenix proper compromise for a calmer suburban pocket with real outdoor access.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Mesa Neighborhoods</h3>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Neighborhood</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Best For</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">3BR Rent</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">My Take</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Downtown Mesa / 85201</td>
              <td class="py-3 px-3 text-muted-foreground">Affordability, arts</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,900</td>
              <td class="py-3 px-3 text-muted-foreground">Cheapest serious option in the metro</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Eastmark / 85212</td>
              <td class="py-3 px-3 text-muted-foreground">Newer homes, yards</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,300</td>
              <td class="py-3 px-3 text-muted-foreground">Best overall Mesa fit — newer, yard-friendly</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Red Mountain / 85207</td>
              <td class="py-3 px-3 text-muted-foreground">Outdoor access, hiking</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,398</td>
              <td class="py-3 px-3 text-muted-foreground">Near Usery Mountain (3,648 acres), best Mesa nature pick</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Chandler Neighborhoods</h3>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Neighborhood</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Best For</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">3BR Rent</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">My Take</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Downtown Chandler / 85296</td>
              <td class="py-3 px-3 text-muted-foreground">Date night, events</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,224</td>
              <td class="py-3 px-3 text-muted-foreground">Best fun-to-cost ratio</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">South Chandler / 85249</td>
              <td class="py-3 px-3 text-muted-foreground">Yards, family homes</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,270</td>
              <td class="py-3 px-3 text-muted-foreground">Best Chandler fit for house + yard goal</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Ocotillo / 85248</td>
              <td class="py-3 px-3 text-muted-foreground">Polished, upscale</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,750</td>
              <td class="py-3 px-3 text-muted-foreground">Nice but "pay extra for polish"</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Scottsdale Neighborhoods</h3>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Neighborhood</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Best For</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">3BR Rent</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">My Take</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Old Town / 85251</td>
              <td class="py-3 px-3 text-muted-foreground">Nightlife, galleries</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,500</td>
              <td class="py-3 px-3 text-muted-foreground">Best young-couple energy, worst value</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">McCormick Ranch / 85258</td>
              <td class="py-3 px-3 text-muted-foreground">Polished, central</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,850</td>
              <td class="py-3 px-3 text-muted-foreground">Mature and central, still expensive</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">North Scottsdale / 85255</td>
              <td class="py-3 px-3 text-muted-foreground">Luxury, desert, hiking</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$4,500</td>
              <td class="py-3 px-3 text-muted-foreground">McDowell Sonoran Preserve access, but severe rent</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Glendale Neighborhoods</h3>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Neighborhood</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Best For</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">3BR Rent</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">My Take</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Arrowhead / 85308</td>
              <td class="py-3 px-3 text-muted-foreground">Suburb comfort, value</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,245</td>
              <td class="py-3 px-3 text-muted-foreground">Best yard + value combo in the metro</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Westgate / 85305</td>
              <td class="py-3 px-3 text-muted-foreground">Entertainment, events</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,295</td>
              <td class="py-3 px-3 text-muted-foreground">Stadium/arena district, best Glendale fun</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Historic Downtown</td>
              <td class="py-3 px-3 text-muted-foreground">Charm, boutiques</td>
              <td class="text-right py-3 px-3 text-muted-foreground">Mixed</td>
              <td class="py-3 px-3 text-muted-foreground">Old Towne + Catlin Court, charming but less yard-suburb</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">ER PA Salary Table — Phoenix Metro</h2>

      <p class="text-sm text-muted-foreground italic mb-4">True ER-specific PA salary transparency is spotty. These are planning ranges from Glassdoor, Indeed, and employer postings — not contract quotes.</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Area</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Best Signal</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Planning Target</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Phoenix</td>
              <td class="py-3 px-3 text-muted-foreground">$141K median (Glassdoor EM PA); Banner $123K–$162K</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">~$140K</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Mesa</td>
              <td class="py-3 px-3 text-muted-foreground">Banner PA $58.70/hr (~$122K); citywide avg $131K</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">~$125K</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Chandler</td>
              <td class="py-3 px-3 text-muted-foreground">Chandler Regional PA posting $65.90/hr (~$137K)</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">~$135K</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Scottsdale</td>
              <td class="py-3 px-3 text-muted-foreground">HonorHealth ER PA $101K–$137K; general PA $72.66/hr</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">~$130K–$145K</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Glendale</td>
              <td class="py-3 px-3 text-muted-foreground">Banner PA $57.52/hr (~$120K); citywide avg $131K</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">~$125K</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Salary-to-Rent: Neighborhood View</h2>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Neighborhood</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Salary Target</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">3BR Rent</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Rent % of Gross</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Read</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Downtown Chandler / 85296</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$135K</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,224</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">19.8%</td>
              <td class="py-3 px-3 text-muted-foreground">Best fun-to-cost ratio</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">South Chandler / 85249</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$135K</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,270</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">20.2%</td>
              <td class="py-3 px-3 text-muted-foreground">Best Chandler yard fit</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Arrowhead / 85308</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$125K</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,245</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">21.6%</td>
              <td class="py-3 px-3 text-muted-foreground">Best yard/value combo</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Ahwatukee / 85044</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$140K</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,575</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">22.1%</td>
              <td class="py-3 px-3 text-muted-foreground">Strong Phoenix compromise</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Eastmark / 85212</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$125K</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,300</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">22.1%</td>
              <td class="py-3 px-3 text-muted-foreground">Best all-around fit</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Mesa 85207 / Usery</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$125K</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,398</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">23.0%</td>
              <td class="py-3 px-3 text-muted-foreground">Best Mesa nature pick</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Old Town Scottsdale / 85251</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$137.5K</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,500</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">30.5%</td>
              <td class="py-3 px-3 text-muted-foreground">Great lifestyle, weak value</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Final Ranking for Your Setup</h2>

      <p>For one PA income + partner + 3BR house + yard preferred + wanting some life outside work:</p>

      <ol class="list-decimal pl-6 my-4">
        <li><strong>Eastmark / Mesa</strong> — best all-around blend of newer housing, neighborhood feel, and still-reasonable 3BR pricing</li>
        <li><strong>Arrowhead / Glendale</strong> — best pure value-for-yard play</li>
        <li><strong>South Chandler / 85249</strong> — very solid, usually a bit pricier than best Mesa/Glendale value zones</li>
        <li><strong>Downtown Chandler / 85296</strong> — best "fun but still sane" pick</li>
        <li><strong>Ahwatukee / 85044</strong> — best Phoenix proper compromise with desert access</li>
        <li><strong>Mesa 85207 / Usery side</strong> — best nature-oriented practical choice</li>
        <li><strong>Old Town Scottsdale</strong> — awesome for fun, not efficient on one income</li>
      </ol>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">City-Level Ranking</h2>

      <ol class="list-decimal pl-6 my-4">
        <li><strong>Mesa</strong> — wins on balance</li>
        <li><strong>Glendale</strong> — wins on affordability and yard value</li>
        <li><strong>Phoenix</strong> — wins on hospital flexibility</li>
        <li><strong>Chandler</strong> — solid but not clearly better than Mesa for the money</li>
        <li><strong>Scottsdale</strong> — the fun premium play, but the weakest value</li>
      </ol>

      <div id="zillow-cards-placeholder"></div>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">The Bottom Line</h2>

      <p>If you want the <strong>best overall neighborhood</strong>: Eastmark / Mesa.</p>
      <p>If you want the <strong>best value</strong>: Arrowhead / Glendale.</p>
      <p>If you want the <strong>best balance of fun and realism</strong>: Downtown Chandler.</p>
      <p>If you want the <strong>best nature-oriented practical choice</strong>: Ahwatukee or Mesa 85207.</p>

      <p>The Phoenix metro gives you dramatically more breathing room than California on one PA income. The tax burden is lighter, the housing is cheaper, and the hospital infrastructure is deep enough to keep multiple employer options open.</p>

      <p class="text-sm text-muted-foreground italic mt-6">All rent figures from current Zillow market-trend pages. Salary signals from Glassdoor, Indeed, and employer postings. Arizona flat 2.5% state income tax applies uniformly across all cities. Move-ready cash assumes DIY truck move from Waterloo, IA with AZ deposit cap of 1.5x rent.</p>
    `
  },
  "houston-suburb-guide-3br-housing-tmc-commute": {
    title: "Houston Suburb & TMC Neighborhood Guide: 3BR Housing, Commute & Monthly Budget",
    category: "HEALTHCARE",
    date: "March 16, 2026",
    readTime: "22 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: houstonSuburbs,
    content: `
      <p>Houston is a uniquely strong relocation market for a PA because it combines two things most cities can't: <strong>no state income tax</strong> and one of the deepest hospital clusters in the country at Texas Medical Center. The housing decision here splits into two distinct strategies — suburban rings for a 3BR house with a yard, and close-in TMC-adjacent neighborhoods for hospital commute efficiency.</p>

      <p class="text-sm text-muted-foreground italic">Texas has no state income tax. The real decision here is housing strategy: suburban ring vs. TMC-adjacent inner loop.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Best Picks by Category</h2>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Goal</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Best Pick</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Why</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 text-muted-foreground">Best overall fit</td>
              <td class="py-3 px-3 font-semibold text-foreground">Pearland</td>
              <td class="py-3 px-3 text-muted-foreground">Closest strong suburb to TMC with realistic 3BR house pricing</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Best polished suburb</td>
              <td class="py-3 px-3 font-semibold text-foreground">Sugar Land</td>
              <td class="py-3 px-3 text-muted-foreground">Best suburban "finished product" feel</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 text-muted-foreground">Best yard value</td>
              <td class="py-3 px-3 font-semibold text-foreground">Katy or Cypress</td>
              <td class="py-3 px-3 text-muted-foreground">Strong house inventory, more room, better bang for the dollar</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Best upscale suburb</td>
              <td class="py-3 px-3 font-semibold text-foreground">The Woodlands</td>
              <td class="py-3 px-3 text-muted-foreground">Strongest amenities and polished lifestyle</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 text-muted-foreground">Best TMC commute</td>
              <td class="py-3 px-3 font-semibold text-foreground">Medical Center / Museum District / Bellaire</td>
              <td class="py-3 px-3 text-muted-foreground">Fastest access to the hospital core</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Best close-in compromise</td>
              <td class="py-3 px-3 font-semibold text-foreground">Bellaire</td>
              <td class="py-3 px-3 text-muted-foreground">Near TMC but more residential than Midtown/Montrose</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 text-muted-foreground">Best young-couple inner-loop lifestyle</td>
              <td class="py-3 px-3 font-semibold text-foreground">Montrose</td>
              <td class="py-3 px-3 text-muted-foreground">Most character, bars, restaurants, arts</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Best nature close-in</td>
              <td class="py-3 px-3 font-semibold text-foreground">Washington Ave / Memorial Park</td>
              <td class="py-3 px-3 text-muted-foreground">Memorial Park is a huge outdoor asset</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Main Comparison Table</h2>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Area</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Miles to TMC</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">3BR Rent</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Attractions</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">My Take</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Pearland</td>
              <td class="text-right py-3 px-3 text-muted-foreground">14.7</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,000–$2,600</td>
              <td class="py-3 px-3 text-muted-foreground">Pearland Town Center, parks</td>
              <td class="py-3 px-3 font-semibold text-foreground">Best overall fit</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Sugar Land</td>
              <td class="text-right py-3 px-3 text-muted-foreground">17.4</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$2,150</td>
              <td class="py-3 px-3 text-muted-foreground">Town Square, Constellation Field</td>
              <td class="py-3 px-3 text-foreground">Best polished suburb</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Katy</td>
              <td class="text-right py-3 px-3 text-muted-foreground">30</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$2,249</td>
              <td class="py-3 px-3 text-muted-foreground">LaCenterra, Katy Mills</td>
              <td class="py-3 px-3 text-foreground">Best yard value west side</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Cypress</td>
              <td class="text-right py-3 px-3 text-muted-foreground">27</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$2,277</td>
              <td class="py-3 px-3 text-muted-foreground">Towne Lake Boardwalk</td>
              <td class="py-3 px-3 text-foreground">Strong yard/value play</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Spring</td>
              <td class="text-right py-3 px-3 text-muted-foreground">28.5</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$1,965</td>
              <td class="py-3 px-3 text-muted-foreground">Old Town Spring</td>
              <td class="py-3 px-3 text-foreground">Solid if north side appeals</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">The Woodlands</td>
              <td class="text-right py-3 px-3 text-muted-foreground">31</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$2,500</td>
              <td class="py-3 px-3 text-muted-foreground">Waterway, Pavilion, Mall</td>
              <td class="py-3 px-3 text-foreground">Best upscale suburb</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">League City / Clear Lake</td>
              <td class="text-right py-3 px-3 text-muted-foreground">27</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$2,200</td>
              <td class="py-3 px-3 text-muted-foreground">Kemah, bayous, water rec</td>
              <td class="py-3 px-3 text-foreground">Coastal play, weaker TMC</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Medical Center</td>
              <td class="text-right py-3 px-3 text-muted-foreground">0</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$2,181</td>
              <td class="py-3 px-3 text-muted-foreground">Direct hospital access</td>
              <td class="py-3 px-3 text-foreground">Work-first choice</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Museum District</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~2</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$2,356</td>
              <td class="py-3 px-3 text-muted-foreground">Hermann Park, Zoo, museums</td>
              <td class="py-3 px-3 text-foreground">Best close-in culture</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">West U / University Place</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~3</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$3,575</td>
              <td class="py-3 px-3 text-muted-foreground">Rice Village, residential</td>
              <td class="py-3 px-3 text-foreground">Close-in but expensive</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Bellaire</td>
              <td class="text-right py-3 px-3 text-muted-foreground">12</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,400–$3,000</td>
              <td class="py-3 px-3 text-muted-foreground">Nature Discovery Center, quiet</td>
              <td class="py-3 px-3 font-semibold text-foreground">Favorite close-in fit</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Midtown</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~5</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$1,694</td>
              <td class="py-3 px-3 text-muted-foreground">Bars, restaurants, urban</td>
              <td class="py-3 px-3 text-foreground">Best cheap inner-loop</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Montrose / Neartown</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~4</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$2,281</td>
              <td class="py-3 px-3 text-muted-foreground">Menil, Rothko, murals, bars</td>
              <td class="py-3 px-3 text-foreground">Best inner-loop lifestyle</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Upper Kirby / Greenway</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~4</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$1,938</td>
              <td class="py-3 px-3 text-muted-foreground">Levy Park, central dining</td>
              <td class="py-3 px-3 text-foreground">Quietly strong compromise</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Washington Ave / Memorial Park</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~8</td>
              <td class="text-right py-3 px-3 text-muted-foreground">~$1,866</td>
              <td class="py-3 px-3 text-muted-foreground">Memorial Park, trails, bars</td>
              <td class="py-3 px-3 text-foreground">Best close-in outdoors</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Suburban Ring: Area-by-Area Read</h2>

      <p><strong>Pearland</strong> is the strongest suburb for your setup because it stays unusually close to TMC while still giving you real suburban-house inventory. Rome2Rio shows 14.7 road miles from Pearland to TMC, and Zillow's live 3BR house listings cluster heavily in the low-to-mid $2,000s. Attractions are more practical than glamorous, but Pearland Town Center and the city's park/event base make it more than just a bedroom suburb. Memorial Hermann also has a 24/7 emergency center in Pearland.</p>

      <p><strong>Sugar Land</strong> is the most polished suburb in the list. The commute is still workable at 17.4 road miles to TMC, the Zillow 3BR average is about $2,150, and the lifestyle anchors are stronger than Pearland's — Sugar Land Town Square plus Constellation Field, home of the Space Cowboys. Houston Methodist Sugar Land's ED is open 24/7.</p>

      <p><strong>Katy</strong> is a house-and-yard value play, not a medical-center commute play. Zillow rent trends show a 3BR average around $2,249, while LaCenterra and Katy Mills give it a stronger suburban attraction base. But TMC access is the weak point — even Rome2Rio's transit routing is over an hour, and in real driving conditions the west-side commute is the biggest tax on quality of life.</p>

      <p><strong>Cypress</strong> is similar to Katy: it shines for space, newer-house feel, and family-style suburban layout rather than TMC commute efficiency. Zillow's 3BR average is about $2,277, and Towne Lake's Boardwalk gives Cypress a legitimate attraction anchor.</p>

      <p><strong>Spring</strong> works best if you like the north side and want a softer, less expensive-feeling alternative to The Woodlands. The strongest attraction anchor is Old Town Spring. The downside is commute: 28.5 road miles to TMC.</p>

      <p><strong>The Woodlands</strong> is the nicest suburb in a vacuum. Its attraction base is far stronger than most suburbs: The Waterway, Waterway Square, Cynthia Woods Mitchell Pavilion, and lots of public art. Zillow shows average rent around $2,500. It simply is farther out — about 31 miles to Houston core.</p>

      <p><strong>League City / Clear Lake</strong> is the coastal/waterfront alternative. Zillow shows a 3BR average around $2,200, and the city's tourism pages emphasize bayous, kayaking, water activities, and nearby Kemah Boardwalk. Attractive if you want a Gulf-adjacent feel, but not a TMC-commute optimization choice.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">TMC-Adjacent Neighborhoods: Close-In Read</h2>

      <p><strong>Medical Center</strong> is the pure work-first move. RentCafe puts average apartment rent around $2,181. The obvious advantage is that you are right on top of the hospitals. For a 3BR house with a yard, this is the "easiest possible work commute" winner, not the lifestyle winner.</p>

      <p><strong>Museum District</strong> is the best close-in culture play. Average rent around $2,356, and 3BR apartments around $2,906. The attractions are elite: Hermann Park, Houston Zoo, and the museum cluster. Best neighborhood for a young couple who care about doing things.</p>

      <p><strong>West University / University Place</strong> is the strongest close-in residential compromise. Average rent around $2,556, with 3BR apartments roughly $1,978 to $2,925. Close to TMC, more residential than Midtown or Montrose — but it is not a budget play.</p>

      <p><strong>Bellaire</strong> is the close-in area I like best for this setup. About 16 minutes and 12 miles to Houston core, Zillow shows overall average rent around $3,000, and live rental listings include 3BR houses around $2,400 to $3,000. The attraction set is quieter — Nature Discovery Center and a very residential feel — exactly why it fits a couple wanting a house, yard, and near-TMC practicality.</p>

      <p><strong>Midtown</strong> is the best cheap inner-loop lifestyle play. Average rent around $1,694, close to both Downtown and TMC with restaurants, bars, and urban convenience. Much more of an apartment/townhome neighborhood than a "yard and fence" neighborhood.</p>

      <p><strong>Montrose / Neartown</strong> is the strongest inner-loop neighborhood for young-couple appeal. Average rent around $2,281, with the city's deepest mix of bars, restaurants, independent character, murals, the Menil Collection, and Rothko Chapel. Best answer if your top priority is lifestyle.</p>

      <p><strong>Upper Kirby / Greenway</strong> is the underrated compromise. Rent around $1,938 to $2,087, and Levy Park is a real amenity. More polished and quieter than Midtown, less bohemian than Montrose, and very central.</p>

      <p><strong>Washington Ave / Memorial Park</strong> is the best close-in outdoors pick. Average rent around $1,866, and Memorial Park is enormous — 1,500 acres and 30+ miles of trails. Strong fit if you want inner-loop access without giving up green space.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Monthly Budget: Suburbs & Close-In Areas</h2>

      <p class="text-sm text-muted-foreground italic mb-4">Budget model for 2 adults: $575/mo groceries (Walmart-heavy), $175–$210 electric, $100–$110 water+sewer, $40 internet, $550–$650 other bills (gas, car insurance, phones, renters insurance, misc).</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Suburbs</h3>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Area</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">3BR Rent</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Groceries</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Electric</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Water</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Internet</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Other</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Pearland</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,300</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$195</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$105</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$40</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$625</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$3,840</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Sugar Land</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,150</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$195</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$105</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$40</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$625</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$3,690</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Katy</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,240</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$210</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$110</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$40</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$650</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$3,825</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Cypress</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,277</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$210</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$110</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$40</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$650</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$3,862</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Spring</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,965</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$205</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$110</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$40</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$650</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$3,545</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">The Woodlands</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,400</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$205</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$110</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$40</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$650</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$3,980</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">League City / Clear Lake</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,145</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$200</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$110</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$40</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$650</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$3,720</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Bellaire</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,300</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$190</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$105</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$40</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$600</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$3,810</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">TMC-Adjacent / Inner Loop</h3>

      <p class="text-sm text-muted-foreground italic mb-4">Inner-loop rent numbers are mostly apartment/neighborhood averages (RentCafe proxies). Treat as location-cost signals, not exact 3BR house rents.</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Area</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">3BR Proxy</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Groceries</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Electric</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Water</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Internet</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Other</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Medical Center</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,181</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$175</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$100</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$40</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$3,646</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Museum District</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,356</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$175</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$100</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$40</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$3,821</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">West U / University Place</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$180</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$105</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$40</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$5,050</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Midtown</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,694</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$170</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$100</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$40</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$550</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$3,129</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Montrose / Neartown</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,281</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$175</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$100</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$40</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$3,746</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Upper Kirby / Greenway</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,938</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$175</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$100</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$40</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$3,403</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Washington Ave / Memorial Park</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,866</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$175</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$100</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$40</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$575</td>
              <td class="text-right py-3 px-3 font-bold text-foreground">$3,331</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Attractions by Area</h2>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Area</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Main Attractions</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">What That Means</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Pearland</td>
              <td class="py-3 px-3 text-muted-foreground">Pearland Town Center, city events, parks & trails</td>
              <td class="py-3 px-3 text-muted-foreground">More practical than glamorous. Good for errands, casual date nights.</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Sugar Land</td>
              <td class="py-3 px-3 text-muted-foreground">Town Square, Constellation Field, Smart Financial Centre</td>
              <td class="py-3 px-3 text-muted-foreground">One of the strongest polished suburb attraction sets in Houston.</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Katy</td>
              <td class="py-3 px-3 text-muted-foreground">LaCenterra, Katy Mills, Typhoon Texas</td>
              <td class="py-3 px-3 text-muted-foreground">Strong suburban entertainment, more spread out and car-dependent.</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">The Woodlands</td>
              <td class="py-3 px-3 text-muted-foreground">Waterway, Pavilion, Mall, Market Street</td>
              <td class="py-3 px-3 text-muted-foreground">Best suburban lifestyle package. Lots to do without leaving.</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Museum District</td>
              <td class="py-3 px-3 text-muted-foreground">Hermann Park, Houston Zoo, 19 museums, Miller Outdoor Theatre</td>
              <td class="py-3 px-3 text-muted-foreground">Best close-in choice for culture and daytime activities.</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Montrose</td>
              <td class="py-3 px-3 text-muted-foreground">Menil Collection, Rothko Chapel, murals, bars, restaurants</td>
              <td class="py-3 px-3 text-muted-foreground">Best inner-loop neighborhood for personality and couple-friendly outings.</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Washington Ave / Memorial Park</td>
              <td class="py-3 px-3 text-muted-foreground">Memorial Park (1,500 acres, 30+ mi trails), Washington corridor</td>
              <td class="py-3 px-3 text-muted-foreground">Best close-in mix of nightlife + major outdoor space.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">My Ranking for Your Setup</h2>

      <p>For one PA income, partner, 3BR house, yard preferred, and likely hospital work:</p>

      <ol class="list-decimal pl-6 my-4">
        <li><strong>Pearland</strong> — Best suburb-to-TMC compromise</li>
        <li><strong>Bellaire</strong> — Best close-in house compromise</li>
        <li><strong>Sugar Land</strong> — Best polished suburban alternative</li>
        <li><strong>West U / University Place</strong> — Close-in residential, but pricey</li>
        <li><strong>Katy</strong> — Best house + yard value</li>
        <li><strong>Cypress</strong> — Strong yard/space play</li>
        <li><strong>The Woodlands</strong> — Best upscale lifestyle suburb</li>
        <li><strong>Washington Ave / Memorial Park</strong> — Best close-in outdoors</li>
        <li><strong>Museum District</strong> — Best close-in culture</li>
        <li><strong>Upper Kirby / Greenway</strong> — Underrated compromise</li>
        <li><strong>League City / Clear Lake</strong> — Coastal play</li>
        <li><strong>Montrose</strong> — Best lifestyle, weaker yard fit</li>
        <li><strong>Midtown</strong> — Cheapest inner-loop, apartment-heavy</li>
        <li><strong>Medical Center</strong> — Work-first, not lifestyle</li>
        <li><strong>Spring</strong> — Softer north option, far from TMC</li>
      </ol>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">The Bottom Line</h2>

      <p>If you want the <strong>best overall fit</strong>: Pearland.</p>
      <p>If you want the <strong>best close-in house compromise</strong>: Bellaire.</p>
      <p>If you want the <strong>best polished suburb</strong>: Sugar Land.</p>
      <p>If you want the <strong>best yard value</strong>: Katy or Cypress.</p>
      <p>If you want the <strong>best lifestyle suburb</strong>: The Woodlands.</p>

      <p>Houston gives you the strongest financial breathing room of any major market because of zero state income tax. The hospital infrastructure at TMC is unmatched, and the suburban ring offers realistic 3BR house options without blowing up the budget.</p>

      <p><strong>Blunt shortlist: Pearland, Bellaire, Sugar Land, and Katy.</strong></p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Houston ER PA Salary Signals</h2>

      <p>ER PA salary usually does not change by neighborhood inside the same metro. The meaningful differences come from employer, acuity, trauma level, schedule, nights/weekends, and whether the figure is base pay vs total comp. That's why I'm using Houston-market salary signals for all neighborhoods rather than pretending Bellaire pays differently than Montrose.</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Salary Signal</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Amount</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">How I'd Use It</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 text-muted-foreground">Houston EM PA, Glassdoor median total pay</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$215,123/yr</td>
              <td class="py-3 px-3 text-muted-foreground">High-end market signal; likely includes total comp</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Houston EM PA, Glassdoor 25th–75th pctl</td>
              <td class="text-right py-3 px-3 text-foreground">$161K–$290K</td>
              <td class="py-3 px-3 text-muted-foreground">Useful ceiling/floor range, too wide for budgeting</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 text-muted-foreground">UTHealth Houston EM PA, Glassdoor avg</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$218,597/yr</td>
              <td class="py-3 px-3 text-muted-foreground">TMC academic EM signal; likely total comp</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">UTHealth Houston EM PA, 25th–75th pctl</td>
              <td class="text-right py-3 px-3 text-foreground">$164K–$294K</td>
              <td class="py-3 px-3 text-muted-foreground">Academic/EM comp variability</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 text-muted-foreground">Houston PA, Indeed city average</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$124,974/yr</td>
              <td class="py-3 px-3 text-muted-foreground">Better anchor for conservative budgeting</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 text-muted-foreground">Houston Methodist PA, Indeed avg</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$132,937/yr</td>
              <td class="py-3 px-3 text-muted-foreground">Strong large-system anchor</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 text-muted-foreground">HCA Healthcare PA, Indeed avg (Houston)</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$120,759/yr</td>
              <td class="py-3 px-3 text-muted-foreground">Another conservative employer anchor</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-sm text-muted-foreground italic">Sources: Glassdoor Houston emergency medicine PA pages, Indeed Houston / Houston Methodist / HCA averages.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">My Blunt Salary Underwriting Number</h3>

      <ul class="list-disc pl-6 my-4">
        <li><strong>Conservative base-pay planning:</strong> $125k–$140k</li>
        <li><strong>Reasonable target (stronger EM role/system):</strong> $135k–$155k</li>
        <li><strong>Glassdoor total comp signal:</strong> ~$215k median — don't budget your life around this until you have a real offer in hand</li>
      </ul>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Moving Expenses: Waterloo, Iowa → Houston</h2>

      <p>The Waterloo→Houston move is about <strong>1,063 driving miles</strong> (~16 hours 58 minutes), with Travelmath estimating about $106 in fuel. For the truck itself, current long-distance references put rental-truck moves around $4,620 on average and long-distance moving-company moves around $6,300 for a 2–3 bedroom household. Texas has no statewide cap on security deposit amounts — I used one month's rent as a planning deposit, but some landlords may ask for more.</p>

      <p class="mt-4"><strong>Method:</strong> Minimum cash = first month's rent + 1 month deposit + $350 utility/internet setup + $4,620 rental truck + $106 fuel. Safer cash adds $1,500 for first-month groceries/utilities/other buffer. The <strong>Rent-to-Salary %</strong> column uses the conservative $125k base pay ($10,417/mo) to show what share of gross income goes to rent.</p>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Suburbs & Close-In Residential</h3>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Area</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Housing Figure</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Rent/Salary %</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Min Cash to Move</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Safer Cash</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Pearland</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,399</td>
              <td class="text-right py-3 px-3 text-foreground font-semibold">23.0%</td>
              <td class="text-right py-3 px-3 text-foreground">$9,875</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$11,375</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Sugar Land</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,150</td>
              <td class="text-right py-3 px-3 text-foreground font-semibold">20.6%</td>
              <td class="text-right py-3 px-3 text-foreground">$9,375</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$10,875</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Katy</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,045</td>
              <td class="text-right py-3 px-3 text-foreground font-semibold">19.6%</td>
              <td class="text-right py-3 px-3 text-foreground">$9,175</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$10,675</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Cypress</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,277</td>
              <td class="text-right py-3 px-3 text-foreground font-semibold">21.9%</td>
              <td class="text-right py-3 px-3 text-foreground">$9,640</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$11,140</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Spring</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,850</td>
              <td class="text-right py-3 px-3 text-foreground font-semibold">17.8%</td>
              <td class="text-right py-3 px-3 text-foreground">$8,790</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$10,290</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">The Woodlands</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,400</td>
              <td class="text-right py-3 px-3 text-foreground font-semibold">23.0%</td>
              <td class="text-right py-3 px-3 text-foreground">$9,880</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$11,380</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">League City / Clear Lake</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,150</td>
              <td class="text-right py-3 px-3 text-foreground font-semibold">20.6%</td>
              <td class="text-right py-3 px-3 text-foreground">$9,380</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$10,880</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Bellaire</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,500</td>
              <td class="text-right py-3 px-3 text-foreground font-semibold">24.0%</td>
              <td class="text-right py-3 px-3 text-foreground">$10,080</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$11,580</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">TMC / Inner-Loop Neighborhoods</h3>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">Area</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Housing Figure</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Rent/Salary %</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Min Cash to Move</th>
              <th class="text-right py-3 px-3 font-bold text-foreground">Safer Cash</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">West U / University Place</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$3,575</td>
              <td class="text-right py-3 px-3 text-destructive font-semibold">34.3%</td>
              <td class="text-right py-3 px-3 text-foreground">$12,230</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$13,730</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Museum District</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,356</td>
              <td class="text-right py-3 px-3 text-foreground font-semibold">22.6%</td>
              <td class="text-right py-3 px-3 text-foreground">$9,790</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$11,290</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Medical Center</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,181</td>
              <td class="text-right py-3 px-3 text-foreground font-semibold">20.9%</td>
              <td class="text-right py-3 px-3 text-foreground">$9,435</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$10,935</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Montrose / Neartown</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$2,281</td>
              <td class="text-right py-3 px-3 text-foreground font-semibold">21.9%</td>
              <td class="text-right py-3 px-3 text-foreground">$9,640</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$11,140</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Upper Kirby / Greenway</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,938</td>
              <td class="text-right py-3 px-3 text-foreground font-semibold">18.6%</td>
              <td class="text-right py-3 px-3 text-foreground">$8,950</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$10,450</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Washington Ave / Memorial Park</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,866</td>
              <td class="text-right py-3 px-3 text-foreground font-semibold">17.9%</td>
              <td class="text-right py-3 px-3 text-foreground">$8,810</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$10,310</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Midtown</td>
              <td class="text-right py-3 px-3 text-muted-foreground">$1,694</td>
              <td class="text-right py-3 px-3 text-foreground font-semibold">16.3%</td>
              <td class="text-right py-3 px-3 text-foreground">$8,470</td>
              <td class="text-right py-3 px-3 font-semibold text-foreground">$9,970</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">TMC Hospitals Likely PSLF-Eligible</h2>

      <p>PSLF is based on your <strong>employer</strong>, not the building you work in. Even if you work in a qualifying hospital, you may not qualify if you're employed by a separate for-profit staffing group or contract management company. Always confirm the exact employer/EIN with the <a href="https://studentaid.gov/manage-loans/forgiveness-cancellation/public-service/questions" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">federal PSLF Help Tool</a>.</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2 border-foreground/20">
              <th class="text-left py-3 px-3 font-bold text-foreground">TMC Hospital</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Why It Likely Qualifies</th>
              <th class="text-left py-3 px-3 font-bold text-foreground">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Ben Taub Hospital</td>
              <td class="py-3 px-3 text-muted-foreground">Harris Health — public hospital district</td>
              <td class="py-3 px-3 text-muted-foreground">Strong PSLF candidate if paycheck is from Harris Health</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Lyndon B. Johnson Hospital</td>
              <td class="py-3 px-3 text-muted-foreground">Harris Health — public hospital district</td>
              <td class="py-3 px-3 text-muted-foreground">Same caution: qualifies if employed by Harris Health</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Memorial Hermann – TMC</td>
              <td class="py-3 px-3 text-muted-foreground">Non-profit, community-owned health system</td>
              <td class="py-3 px-3 text-muted-foreground">Strong PSLF candidate if employed by Memorial Hermann</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Children's Memorial Hermann</td>
              <td class="py-3 px-3 text-muted-foreground">Memorial Hermann nonprofit system</td>
              <td class="py-3 px-3 text-muted-foreground">Likely qualifying if hired by Memorial Hermann</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">TIRR Memorial Hermann</td>
              <td class="py-3 px-3 text-muted-foreground">Memorial Hermann nonprofit system</td>
              <td class="py-3 px-3 text-muted-foreground">More rehab-focused; qualifying if employer is Memorial Hermann</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Houston Methodist Hospital</td>
              <td class="py-3 px-3 text-muted-foreground">Nonprofit academic medical center</td>
              <td class="py-3 px-3 text-muted-foreground">Strong PSLF candidate; verify exact employing entity</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">Baylor St. Luke's Medical Center</td>
              <td class="py-3 px-3 text-muted-foreground">501(c)(3) nonprofit</td>
              <td class="py-3 px-3 text-muted-foreground">Strong PSLF candidate if employer is that nonprofit entity</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Texas Children's Hospital</td>
              <td class="py-3 px-3 text-muted-foreground">Charitable 501(c)(3) organization</td>
              <td class="py-3 px-3 text-muted-foreground">Strong PSLF candidate</td>
            </tr>
            <tr class="border-b border-foreground/10 bg-accent/10">
              <td class="py-3 px-3 font-semibold text-foreground">UT MD Anderson Cancer Center</td>
              <td class="py-3 px-3 text-muted-foreground">University of Texas System</td>
              <td class="py-3 px-3 text-muted-foreground">Public university-system employment — PSLF-qualifying</td>
            </tr>
            <tr class="border-b border-foreground/10">
              <td class="py-3 px-3 font-semibold text-foreground">Michael E. DeBakey VA Medical Center</td>
              <td class="py-3 px-3 text-muted-foreground">Federal VA facility</td>
              <td class="py-3 px-3 text-muted-foreground">Federal government — PSLF-qualifying</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Highest-Confidence PSLF Employers in TMC</h3>

      <ol class="list-decimal pl-6 my-4">
        <li><strong>Harris Health:</strong> Ben Taub and LBJ</li>
        <li><strong>UT MD Anderson</strong></li>
        <li><strong>Michael E. DeBakey VA</strong></li>
        <li><strong>Texas Children's</strong></li>
        <li><strong>Memorial Hermann</strong></li>
      </ol>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Important Caution for PA Jobs</h3>

      <p>If you are hired <strong>directly</strong> by Harris Health, Memorial Hermann, Texas Children's, UT, or the VA, that is usually the clean PSLF scenario. If you staff the ED through a separate physician group, CMG, or outsourced employer, <strong>PSLF may not count</strong> — even if you physically work at Ben Taub or Memorial Hermann.</p>

      <p class="text-sm text-muted-foreground italic mt-6">Rent figures from Zillow and RentCafe. Commute estimates from Rome2Rio and Travelmath. Salary signals from Glassdoor and Indeed. Texas has no state income tax. Budget model uses Walmart-based grocery pricing and Houston utility rate estimates.</p>
    `
  },
  "renal-emergency-atlas": {
    title: "Renal Emergency Atlas — AKI, Electrolytes, Stones, Diuretics & UA",
    category: "HEALTHCARE",
    date: "June 24, 2026",
    readTime: "16 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A renal emergency atlas covering acute kidney injury, electrolyte derangements, nephrolithiasis, diuretic pharmacology, and urinalysis interpretation — with GFR-based staging, stone management algorithms, and bedside pearls for the emergency department.</p>
      <p>The interactive atlas below is best viewed full-screen. Use the toggle inside the frame to switch light and dark modes.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe
          src="/embeds/renal-emergency-atlas.html"
          title="Renal Emergency Atlas"
          style="width:100%;height:1600px;border:0;display:block;"
          loading="lazy"
        ></iframe>
      </div>
      <p><a href="/embeds/renal-emergency-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "renal-pharm-uti-atlas": {
    title: "Renal Pharmacology & UTI Atlas — CKD Dosing, Contrast, Bacteremia",
    category: "HEALTHCARE",
    date: "June 25, 2026",
    readTime: "15 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A renal pharmacology and UTI atlas covering CKD-based drug dosing, contrast nephropathy risk, and management of UTIs and bacteremia — with dose adjustments, avoid-in-CKD lists, and antibiotic selection pearls.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/renal-pharm-uti-atlas.html" title="Renal Pharmacology & UTI Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/renal-pharm-uti-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "sedation-master-atlas": {
    title: "Procedural Sedation Master Atlas — Anesthesiology Reference",
    category: "HEALTHCARE",
    date: "June 25, 2026",
    readTime: "16 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A procedural sedation master atlas covering sedation depth, agent selection (propofol, ketamine, etomidate, benzodiazepines, opioids, dexmedetomidine), dosing, monitoring, and rescue — with anesthesiology-grade pearls for the ED and bedside.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/sedation-master-atlas.html" title="Procedural Sedation Master Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/sedation-master-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "electrolyte-correction-atlas": {
    title: "Electrolyte & Blood Product Correction Atlas",
    category: "HEALTHCARE",
    date: "June 26, 2026",
    readTime: "15 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>An electrolyte and blood product correction atlas covering repletion strategies, correction formulas, transfusion thresholds, and product selection — with dosing pearls and monitoring pitfalls for the bedside.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/electrolyte-correction-atlas.html" title="Electrolyte & Blood Product Correction Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/electrolyte-correction-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "msk-neuromuscular-atlas": {
    title: "MSK Neuromuscular Atlas — Innervation, Action & Movement Pathways",
    category: "HEALTHCARE",
    date: "June 26, 2026",
    readTime: "18 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A musculoskeletal neuromuscular atlas mapping muscles to their innervation, actions, and movement pathways — with nerve routes, injury patterns, and bedside exam pearls.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/msk-neuromuscular-atlas.html" title="MSK Neuromuscular Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/msk-neuromuscular-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "msk-physical-exam-atlas": {
    title: "MSK Physical Exam Atlas — ROM, Strength, Special Tests, Palpation",
    category: "HEALTHCARE",
    date: "July 17, 2026",
    readTime: "20 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A regional MSK physical exam atlas covering range of motion, strength grading, special tests, and palpation landmarks from shoulder to foot.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/msk-physical-exam-atlas.html" title="MSK Physical Exam Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/msk-physical-exam-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "extremity-ddx-atlas": {
    title: "Extremity Pain Differential Diagnosis Atlas",
    category: "HEALTHCARE",
    date: "July 17, 2026",
    readTime: "16 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A region-by-region differential diagnosis atlas for extremity pain — mechanism, exam findings, imaging, and can't-miss diagnoses.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/extremity-ddx-atlas.html" title="Extremity Pain Differential Diagnosis Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/extremity-ddx-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "fracture-disposition-atlas": {
    title: "Tib-Fib / Lower Extremity Fracture Disposition Atlas",
    category: "HEALTHCARE",
    date: "July 17, 2026",
    readTime: "12 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>Disposition, splinting, orthopedic consultation, and weight-bearing status for tib-fib and lower extremity fractures — with reduction and admission criteria.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/fracture-disposition-atlas.html" title="Fracture Disposition Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/fracture-disposition-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "cardiac-labs-atlas": {
    title: "Cardiac Enzymes, Labs & Diagnostics Atlas",
    category: "HEALTHCARE",
    date: "July 17, 2026",
    readTime: "14 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>Troponin kinetics, BNP, D-dimer, and cardiac diagnostics — with interpretation pearls and rule-in/rule-out thresholds.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/cardiac-labs-atlas.html" title="Cardiac Enzymes, Labs & Diagnostics Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/cardiac-labs-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "cancer-classification-staging-atlas": {
    title: "Cancer Classification & Staging Atlas",
    category: "HEALTHCARE",
    date: "July 3, 2026",
    readTime: "16 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A cancer classification and staging atlas covering tumor origin, histologic grade, TNM staging, and prognostic groups — with bedside pearls for interpreting pathology and imaging.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/cancer-classification-staging-atlas.html" title="Cancer Classification & Staging Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/cancer-classification-staging-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "lung-breast-cancer-atlas": {
    title: "Lung & Breast Cancer Atlas",
    category: "HEALTHCARE",
    date: "July 3, 2026",
    readTime: "16 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A lung and breast cancer atlas covering histologic subtypes, molecular markers, staging pearls, and treatment pathways — with bedside pearls for workup and management.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/lung-breast-cancer-atlas.html" title="Lung & Breast Cancer Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/lung-breast-cancer-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "cancer-deep-dives-vol2": {
    title: "Cancer Deep Dives Vol. II",
    category: "HEALTHCARE",
    date: "July 3, 2026",
    readTime: "20 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>Volume II of the cancer deep dives series — expanded organ-system coverage with molecular drivers, staging, treatment pathways, and prognostic pearls.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/cancer-deep-dives-vol2.html" title="Cancer Deep Dives Vol. II" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/cancer-deep-dives-vol2.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "oncology-emergencies-atlas": {
    title: "Oncology Emergencies Atlas",
    category: "HEALTHCARE",
    date: "July 3, 2026",
    readTime: "16 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>An oncology emergencies atlas covering tumor lysis, hypercalcemia of malignancy, spinal cord compression, neutropenic fever, SVC syndrome, and hyperviscosity — with recognition, workup, and management pearls.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/oncology-emergencies-atlas.html" title="Oncology Emergencies Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/oncology-emergencies-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "oncology-interventions-atlas": {
    title: "Oncology Interventions Atlas",
    category: "HEALTHCARE",
    date: "July 3, 2026",
    readTime: "16 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>An oncology interventions atlas covering surgery, radiation, chemotherapy, targeted therapy, immunotherapy, and supportive care — with modality selection and bedside pearls.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/oncology-interventions-atlas.html" title="Oncology Interventions Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/oncology-interventions-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "oncology-side-effects-atlas": {
    title: "Oncology Side Effects Atlas — Chemo & Radiation",
    category: "HEALTHCARE",
    date: "July 3, 2026",
    readTime: "20 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>An oncology side effects atlas covering chemotherapy and radiation toxicities by organ system — with grading, monitoring, and management pearls.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/oncology-side-effects-atlas.html" title="Oncology Side Effects Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/oncology-side-effects-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "cosmetic-dermatology-atlas": {
    title: "Cosmetic Dermatology Atlas",
    category: "HEALTHCARE",
    date: "July 3, 2026",
    readTime: "14 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A cosmetic dermatology atlas covering neuromodulators, fillers, chemical peels, lasers, and skin resurfacing — with anatomy pearls, technique notes, and complication management.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/cosmetic-dermatology-atlas.html" title="Cosmetic Dermatology Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/cosmetic-dermatology-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "outpatient-dermatology-atlas": {
    title: "Outpatient Dermatology Atlas",
    category: "HEALTHCARE",
    date: "July 3, 2026",
    readTime: "18 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>An outpatient dermatology atlas covering acne, rosacea, eczema, psoriasis, pigmentary disorders, skin cancer screening, and common in-office procedures — with treatment algorithms and bedside pearls.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/outpatient-dermatology-atlas.html" title="Outpatient Dermatology Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/outpatient-dermatology-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "hematology-hematopoiesis-atlas": {
    title: "Hematopoiesis & Cellular Atlas",
    category: "HEALTHCARE",
    date: "July 6, 2026",
    readTime: "16 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A hematopoiesis and cellular atlas covering stem cell lineages, erythropoiesis, granulopoiesis, lymphopoiesis, and megakaryopoiesis — with morphology pearls and clinical correlates.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/hematology-hematopoiesis-atlas.html" title="Hematopoiesis & Cellular Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/hematology-hematopoiesis-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "hematology-cbc-coag-labs-atlas": {
    title: "CBC & Coagulation Labs Interpretation Atlas",
    category: "HEALTHCARE",
    date: "July 6, 2026",
    readTime: "14 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>A step-by-step lab interpretation atlas covering the CBC, differential, coagulation panels, and panic values — with pattern recognition and workup pearls.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/hematology-cbc-coag-labs-atlas.html" title="CBC & Coagulation Labs Interpretation Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/hematology-cbc-coag-labs-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "hematology-coagulation-atlas": {
    title: "Coagulation, Clotting Disorders & Anticoagulation Atlas",
    category: "HEALTHCARE",
    date: "July 6, 2026",
    readTime: "18 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>The coagulation cascade, bleeding and clotting disorders, anticoagulant and antiplatelet pharmacology, and reversal strategies — with dosing pearls and bridging protocols.</p>
      <div class="my-8 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        <iframe src="/embeds/hematology-coagulation-atlas.html" title="Coagulation, Clotting Disorders & Anticoagulation Atlas" style="width:100%;height:1600px;border:0;display:block;" loading="lazy"></iframe>
      </div>
      <p><a href="/embeds/hematology-coagulation-atlas.html" target="_blank" rel="noopener">Open the full atlas in a new tab →</a></p>
    `
  },
  "default": {
    title: "Blog Post Not Found",
    category: "GENERAL",
    date: "December 1, 2025",
    readTime: "1 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: techPost,
    content: `<p>This blog post could not be found. Please check the URL or return to the homepage.</p>`
  }
};

const popularPosts = [
  {
    title: "Renal Emergency Atlas — AKI, Electrolytes, Stones, Diuretics & UA",
    category: "HEALTHCARE",
    date: "June 24, 2026",
    image: businessPost,
    slug: "renal-emergency-atlas"
  },
  {
    title: "Pediatric EM Atlas — Board Review",
    category: "HEALTHCARE",
    date: "June 19, 2026",
    image: businessPost,
    slug: "pediatric-em-atlas"
  },
  {
    title: "Fluid Dynamics Atlas — IV Fluids & Physiology",
    category: "HEALTHCARE",
    date: "June 19, 2026",
    image: businessPost,
    slug: "fluid-dynamics-atlas"
  },
  {
    title: "Antimicrobial Atlas — Antibacterials, Antivirals & Antifungals",
    category: "HEALTHCARE",
    date: "June 20, 2026",
    image: businessPost,
    slug: "antimicrobial-atlas"
  },
  {
    title: "OB/GYN Emergency Atlas — First, Second, Third Trimester & GYN Emergencies",
    category: "HEALTHCARE",
    date: "June 20, 2026",
    image: businessPost,
    slug: "obgyn-emergency-atlas"
  },
  {
    title: "Psychiatric Emergency Atlas — Master Reference",
    category: "HEALTHCARE",
    date: "June 21, 2026",
    image: businessPost,
    slug: "psychiatric-emergency-atlas"
  },
  {
    title: "EKG Strip Atlas — Pattern, Location & Mechanism",
    category: "HEALTHCARE",
    date: "June 17, 2026",
    image: businessPost,
    slug: "ekg-strip-atlas"
  },
  {
    title: "Houston Suburb & TMC Neighborhood Guide",
    category: "HEALTHCARE",
    date: "March 16, 2026",
    image: houstonSuburbs,
    slug: "houston-suburb-guide-3br-housing-tmc-commute"
  },
  {
    title: "Phoenix Metro Suburb Guide: 3BR Housing & Neighborhoods",
    category: "HEALTHCARE",
    date: "March 15, 2026",
    image: phoenixSuburbs,
    slug: "phoenix-metro-suburb-guide-3br-housing-hospital-commute"
  },
  {
    title: "San Jose Suburb Guide: 3BR Housing & Hospital Commute",
    category: "HEALTHCARE",
    date: "March 15, 2026",
    image: sanJoseSuburbs,
    slug: "san-jose-suburb-guide-3br-housing-commute-hospital"
  },
  {
    title: "Find PSLF-Qualifying Hospitals by City or Zip",
    category: "HEALTHCARE",
    date: "March 15, 2026",
    image: pslfFinder,
    slug: "pslf-hospital-finder-by-city-zip"
  },
  {
    title: "Sacramento Suburb Guide: 3BR Housing & Commute",
    category: "HEALTHCARE",
    date: "March 15, 2026",
    image: sacramentoSuburbs,
    slug: "sacramento-suburb-guide-3br-housing-commute-budget"
  },
  {
    title: "2-Adult Relocation Budget: 3BR House & Move-Ready Cash",
    category: "HEALTHCARE",
    date: "March 12, 2026",
    image: relocationPost,
    slug: "relocation-budget-3br-move-ready-cash"
  },
  {
    title: "PSLF-Qualifying Hospitals in California & Arizona",
    category: "HEALTHCARE",
    date: "March 12, 2026",
    image: pslfPost,
    slug: "pslf-qualifying-hospitals-california-arizona"
  },
  {
    title: "The AI Bubble: Should We Be Concerned?",
    category: "TECHNOLOGY",
    date: "December 15, 2025",
    image: techPost,
    slug: "ai-bubble-concerns"
  },
  {
    title: "The Benefits of Seamless EHR Transfers",
    category: "HEALTHCARE", 
    date: "December 10, 2025",
    image: businessPost,
    slug: "seamless-ehr-transfers-benefits"
  }
];

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts[slug as keyof typeof blogPosts] || blogPosts.default;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title} — Jefney Ongeri</title>
        <meta name="description" content={`${post.title} by Jefney Ongeri. ${post.category} insights on healthcare, relocation, and professional development.`} />
        <meta name="keywords" content={`Jefney Ongeri, ${post.category}, ${post.title}`} />
        <meta property="og:title" content={`${post.title} — Jefney Ongeri`} />
        <meta property="og:type" content="article" />
        <meta property="og:author" content="Jefney Ongeri" />
        <link rel="canonical" href={`https://jefneyongeri.com/blog/${slug}`} />
      </Helmet>
      <ReadingProgress />
      <Header />
      
      <main id="main-content">
        {/* Hero Section */}
        <div className="relative w-full h-[50vh] overflow-hidden">
          <img 
            src={post.heroImage} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="container-blog">
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 max-w-4xl">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>{post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container-blog py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-2">
              <div 
                className="prose prose-lg max-w-none text-foreground
                  prose-headings:text-foreground 
                  prose-p:text-muted-foreground 
                  prose-p:leading-relaxed
                  prose-ul:text-muted-foreground
                  prose-li:text-muted-foreground
                  prose-strong:text-foreground"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tax Calculator - only on PSLF post */}
              {slug === 'pslf-qualifying-hospitals-california-arizona' && (
                <TaxCalculator />
              )}

              {/* Suburb Calculator - only on Sacramento suburbs post */}
              {slug === 'sacramento-suburb-guide-3br-housing-commute-budget' && (
                <>
                  <SuburbCalculator />
                  <div className="my-12 rounded-xl overflow-hidden border border-border shadow-sm">
                    <h3 className="text-lg font-bold text-foreground px-6 pt-6 pb-2">
                      <a
                        href="/ca-move-planner"
                        aria-hidden="true"
                        tabIndex={-1}
                        className="text-foreground no-underline hover:text-foreground cursor-text"
                      >📍</a>{' '}Sacramento Suburb Map
                    </h3>
                    <p className="text-sm text-muted-foreground px-6 pb-4">Interactive map of Sacramento-area suburbs, hospitals, and commute routes.</p>
                    <iframe
                      src="https://www.google.com/maps/d/u/0/embed?mid=1ioQvfo3cO-3tjZPJw0zr9b_rfl4-kbc"
                      width="100%"
                      height="480"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Sacramento Suburb Map"
                    />
                  </div>
                </>
              )}

              {/* Sacramento Zillow Cards */}
              {slug === 'sacramento-suburb-guide-3br-housing-commute-budget' && (
                <ZillowCards
                  title="Start Your Sacramento Search"
                  listings={[
                    { name: "Roseville", url: "https://www.zillow.com/roseville-ca/rentals/3-_beds/", rent: "$2,850–$3,050", ring: "Ring 1", commute: "24 min", vibe: "Family-friendly", highlight: "Best overall value" },
                    { name: "Folsom", url: "https://www.zillow.com/folsom-ca/rentals/3-_beds/", rent: "$3,000–$3,200", ring: "Ring 1", commute: "28 min", vibe: "Trails & lakes", highlight: "Top school districts" },
                    { name: "El Dorado Hills", url: "https://www.zillow.com/el-dorado-hills-ca/rentals/3-_beds/", rent: "$3,450–$3,800", ring: "Ring 1", commute: "32 min", vibe: "Upscale suburban", highlight: "Premium feel" },
                    { name: "Citrus Heights", url: "https://www.zillow.com/citrus-heights-ca/rentals/3-_beds/", rent: "~$2,450", ring: "Ring 2", commute: "18 min", vibe: "Budget-friendly" },
                    { name: "Rancho Cordova", url: "https://www.zillow.com/rancho-cordova-ca/rentals/3-_beds/", rent: "~$2,700", ring: "Ring 2", commute: "15 min", vibe: "Close to downtown" },
                    { name: "Elk Grove", url: "https://www.zillow.com/elk-grove-ca/rentals/3-_beds/", rent: "~$2,733", ring: "Ring 2", commute: "22 min", vibe: "Diverse community" },
                    { name: "Rocklin", url: "https://www.zillow.com/rocklin-ca/rentals/3-_beds/", rent: "~$2,800", ring: "Ring 2", commute: "30 min", vibe: "Great schools", highlight: "Rocklin USD" },
                    { name: "Lincoln", url: "https://www.zillow.com/lincoln-ca/rentals/3-_beds/", rent: "~$2,895", ring: "Ring 2", commute: "38 min", vibe: "New construction" },
                    { name: "Granite Bay", url: "https://www.zillow.com/granite-bay-ca/rentals/", rent: "~$3,895", ring: "Ring 2", commute: "26 min", vibe: "Affluent, quiet" },
                    { name: "Auburn", url: "https://www.zillow.com/auburn-ca/rentals/3-_beds/", rent: "~$2,950", ring: "Ring 3", commute: "42 min", vibe: "Foothill charm" },
                    { name: "Folsom Ranch", url: "https://www.zillow.com/folsom-ca/rentals/3-_beds/", rent: "~$2,999", ring: "Ring 3", commute: "30 min", vibe: "Brand new builds" },
                    { name: "Cameron Park", url: "https://www.zillow.com/cameron-park-ca/rentals/3-_beds/", rent: "$2,700–$3,000", ring: "Ring 3", commute: "35 min", vibe: "Rural-suburban" },
                  ]}
                />
              )}

              {/* Phoenix Suburb Calculator + Zillow Cards */}
              {slug === 'phoenix-metro-suburb-guide-3br-housing-hospital-commute' && (
                <>
                  <PhoenixSuburbCalculator />
                  <ZillowCards
                    title="Start Your Phoenix Search"
                    listings={[
                      { name: "Phoenix", url: "https://www.zillow.com/phoenix-az/rentals/3-_beds/", rent: "$1,800–$2,200", commute: "20 min", vibe: "Urban core", highlight: "Most options" },
                      { name: "Mesa", url: "https://www.zillow.com/mesa-az/rentals/3-_beds/", rent: "$1,900–$2,300", commute: "25 min", vibe: "Affordable sprawl" },
                      { name: "Chandler", url: "https://www.zillow.com/chandler-az/rentals/3-_beds/", rent: "$2,100–$2,500", commute: "28 min", vibe: "Tech corridor", highlight: "Top-rated schools" },
                      { name: "Scottsdale", url: "https://www.zillow.com/scottsdale-az/rentals/3-_beds/", rent: "$2,400–$3,000", commute: "22 min", vibe: "Upscale dining" },
                      { name: "Glendale", url: "https://www.zillow.com/glendale-az/rentals/3-_beds/", rent: "$1,700–$2,100", commute: "18 min", vibe: "Budget pick", highlight: "Lowest rents" },
                    ]}
                  />
                </>
              )}

              {/* San Jose Suburb Calculator + Zillow Cards */}
              {slug === 'san-jose-suburb-guide-3br-housing-commute-hospital' && (
                <>
                  <SanJoseSuburbCalculator />
                  <ZillowCards
                    title="Start Your San Jose Search"
                    listings={[
                      { name: "Campbell", url: "https://www.zillow.com/campbell-ca/rentals/3-_beds/", rent: "~$4,100", ring: "Core", commute: "12 min", vibe: "Walkable downtown", highlight: "Best walkability" },
                      { name: "Santa Clara", url: "https://www.zillow.com/santa-clara-ca/rentals/3-_beds/", rent: "~$4,900", ring: "Core", commute: "10 min", vibe: "Near hospitals" },
                      { name: "Los Gatos", url: "https://www.zillow.com/los-gatos-ca/rentals/3-_beds/", rent: "~$5,000", ring: "Core", commute: "18 min", vibe: "Charming village" },
                      { name: "Milpitas", url: "https://www.zillow.com/milpitas-ca/rentals/3-_beds/", rent: "~$4,300", ring: "Inner", commute: "15 min", vibe: "Diverse & growing", highlight: "Good value" },
                      { name: "Sunnyvale", url: "https://www.zillow.com/sunnyvale-ca/rentals/3-_beds/", rent: "~$4,800", ring: "Inner", commute: "14 min", vibe: "Tech hub" },
                      { name: "Cupertino", url: "https://www.zillow.com/cupertino-ca/rentals/3-_beds/", rent: "~$5,200", ring: "Inner", commute: "16 min", vibe: "Top schools", highlight: "#1 school district" },
                      { name: "Mountain View", url: "https://www.zillow.com/mountain-view-ca/rentals/3-_beds/", rent: "~$5,100", ring: "Outer", commute: "20 min", vibe: "Caltrain access" },
                      { name: "Morgan Hill", url: "https://www.zillow.com/morgan-hill-ca/rentals/3-_beds/", rent: "~$3,600", ring: "Outer", commute: "30 min", vibe: "Wine country", highlight: "Most affordable" },
                    ]}
                  />
                </>
              )}

              {/* Houston Suburb Calculator + PSLF Finder + Zillow Cards */}
              {slug === 'houston-suburb-guide-3br-housing-tmc-commute' && (
                <>
                  <HoustonSuburbCalculator />
                  <ZillowCards
                    title="Start Your Houston Search"
                    listings={[
                      { name: "Pearland", url: "https://www.zillow.com/pearland-tx/rentals/3-_beds/", rent: "$1,800–$2,200", ring: "Suburb", commute: "25 min to TMC", vibe: "Family suburb", highlight: "Best for families" },
                      { name: "Sugar Land", url: "https://www.zillow.com/sugar-land-tx/rentals/3-_beds/", rent: "$2,000–$2,500", ring: "Suburb", commute: "28 min to TMC", vibe: "Master-planned", highlight: "Fort Bend ISD" },
                      { name: "Katy", url: "https://www.zillow.com/katy-tx/rentals/3-_beds/", rent: "$1,800–$2,300", ring: "Suburb", commute: "35 min to TMC", vibe: "New builds" },
                      { name: "League City", url: "https://www.zillow.com/league-city-tx/rentals/3-_beds/", rent: "$1,900–$2,400", ring: "Suburb", commute: "30 min to TMC", vibe: "Coastal feel" },
                      { name: "The Woodlands", url: "https://www.zillow.com/the-woodlands-tx/rentals/3-_beds/", rent: "$2,200–$2,800", ring: "Suburb", commute: "40 min to TMC", vibe: "Wooded luxury" },
                      { name: "Bellaire", url: "https://www.zillow.com/bellaire-tx/rentals/3-_beds/", rent: "$2,500–$3,200", ring: "Close-In", commute: "10 min to TMC", vibe: "Upscale enclave", highlight: "Shortest commute" },
                      { name: "Montrose", url: "https://www.zillow.com/montrose-houston-tx/rentals/3-_beds/", rent: "$2,000–$2,600", ring: "Close-In", commute: "12 min to TMC", vibe: "Artsy & walkable" },
                      { name: "Medical Center", url: "https://www.zillow.com/medical-center-houston-tx/rentals/3-_beds/", rent: "$1,600–$2,200", ring: "Close-In", commute: "5 min to TMC", vibe: "Walk to work", highlight: "Zero commute" },
                      { name: "Midtown", url: "https://www.zillow.com/midtown-houston-tx/rentals/3-_beds/", rent: "$1,500–$2,000", ring: "Close-In", commute: "8 min to TMC", vibe: "Nightlife hub", highlight: "Lowest rents" },
                    ]}
                  />
                  <PSLFHospitalFinder />
                </>
              )}

              {/* PSLF Hospital Finder - only on finder post */}
              {slug === 'pslf-hospital-finder-by-city-zip' && (
                <PSLFHospitalFinder />
              )}
              
              {/* Share */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Share this article</h3>
                <SocialShare title={post.title} />
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Popular Posts */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">More Articles</h3>
                <div className="space-y-4">
                  {popularPosts
                    .filter(p => p.title !== post.title)
                    .map((popular, index) => (
                    <BlogCard
                      key={index}
                      title={popular.title}
                      category={popular.category}
                      date={popular.date}
                      image={popular.image}
                      href={`/blog/${popular.slug}`}
                      isSmall={true}
                    />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      
      <BackToTop />
      <Footer />
    </div>
  );
};

export default BlogDetail;