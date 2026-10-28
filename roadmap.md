# Roadmap

## Back & Spine specialist module (/msk-anatomy-atlas/axial/back)
- [x] Inspect existing neck module + GLB node names for spine/back anatomy
- [x] Create `src/data/msk/backSpineSpecialist.ts` (103 entries, 3 levels × 4 subgroups)
- [x] Wire viewer: specialistBack prop, 3-level crop/framing (cervical/thoracic/lumbar + whole-back), posterior default camera
- [x] Wire page: route, hub card #6, level tabs, nav links (Neck↔Back), search, disclaimers
- [x] Route in App.tsx, sitemap + generate-sitemap script, metadata
- [x] Tests: `tests/backSpineSpecialist.test.ts` — 30/30 pass, build clean
- [x] Playwright desktop/phone: multifidus real-mesh select, lumbar facet index-only, level switching, label tracking after camera change, no overflow/errors; Neck regression + hub cards verified
- [ ] Security scan check + publish
