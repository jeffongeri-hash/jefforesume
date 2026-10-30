# Emergency Pathophysiology Atlas

## Active: Respiratory expansion (preview only)
- [x] Four dedicated respiratory routes and ten scenarios, phase-specific mechanisms/signals and shared conceptual anatomy
- [x] Hub, metadata and 185-entry sitemap; seven source links HTTP 200, ESC/ERS DOI registry verified (publisher 403); current GINA CO2 guidance checked
- [x] 154 automated tests (15 new); eight desktop/phone flows, keyboard/reduced motion, seven prior-lesson regressions; no page errors or horizontal overflow
- [x] Preview only, no deployment; report routes and limitations (platform-managed commit ID and exact request credits unavailable)

## Active: Upper-airway obstruction comparison (preview only)
- [x] Croup / epiglottitis / foreign-body data, sagittal animation and phase-specific mechanisms
- [x] Hub, route, metadata, sitemap and five direct source links verified (HTTP 200)
- [x] 139 automated tests; desktop/phone variants, controls, keyboard, reduced motion and six prior-lesson regressions
- [x] Preview only; report limitations and URL (commit is platform-managed; exact per-request cost unavailable)

- [x] Lesson 1: Bowel perforation → peritonitis → systemic deterioration (/pathophysiology-atlas/bowel-perforation), hub, links, sitemap, tests, desktop/phone checks — not published (user asked to hold)
- [x] Lesson 2: Retropharyngeal abscess (/pathophysiology-atlas/retropharyngeal-abscess) — preview only, not published

# Roadmap — Movement revision and physiology lab

- [x] Muscle-led movement: hidden bones, role colors, synchronized nerves and separate risk overlays, attachment-weighted motion (completed in prior work)
- [x] Three source-checked physiology lessons, interactive diagrams and linked navigation/metadata/sitemap (completed in prior work)
- [x] Automated tests, desktop/phone/reduced-motion checks and regional regressions (completed in prior work)
- [ ] Production release of later physiology revisions — paused for user preview approval; current request explicitly forbids publishing

## Previous movement release

- [x] Separate library: 15 movements, 10 injuries, 113 distinct structured records
- [x] Opt-in real-GLB bone overlays, controls, role cards and index-only connected cues
- [x] Hub/navigation, route, metadata and 172-entry sitemap
- [x] 82 automated tests; desktop/phone playback, reduced motion and anatomy selection checks; Shoulder, Knee, Ankle & Foot regressions
- [x] Fresh security scan: no critical findings, two existing unrelated warnings
- [x] Published release snapshot a301a3ac12a1feae4d7f9155c659308e0b9fbc36; production browser confirmed route H1, real GLBs, injury selection and step control (HTTP 200)

## Previous atlas releases

- [x] 1. Thigh — /msk-anatomy-atlas/lower-extremity/thigh (76 entries, 9 groups) — LIVE (200)
- [x] 2. Knee — /msk-anatomy-atlas/lower-extremity/knee (85 entries, 8 groups) — LIVE (200)
- [x] 3. Leg / Calf — /msk-anatomy-atlas/lower-extremity/calf (80 entries, 9 groups) — LIVE (200)
- [x] 4. Ankle & Foot incl. toes — /msk-anatomy-atlas/lower-extremity/ankle-foot (102 entries, 10 groups) — LIVE (200)
- [x] 5. Face — /msk-anatomy-atlas/axial/face (90 entries, 9 groups) — LIVE (200)
- [x] Gap audit — chains continuous (hip→toes; neck/back/face axial); hand digits release stays gated on explicit request; no bridge unit needed
- [x] Tests: 72/72 pass; build clean; AGENTS.md updated
- [x] Playwright desktop+phone verified; shoulder/hip/neck regressions pass; hub shows 12 cards
- [x] Pages confirmed live on production; second publish requested to ship the regenerated sitemap (live sitemap was stale at 166 entries; local has 171)
