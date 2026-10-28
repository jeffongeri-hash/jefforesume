# Roadmap

## Back & Spine specialist module (/msk-anatomy-atlas/axial/back)
- [ ] Inspect existing neck module + GLB node names for spine/back anatomy
- [ ] Create `src/data/msk/backSpineSpecialist.ts` (85–105 entries, 3 levels × subgroups)
- [ ] Wire viewer: specialistBack prop, 3-level crop/framing (cervical/thoracic/lumbar + whole-back)
- [ ] Wire page: route, hub card #6, level tabs, nav links (Neck↔Back), search, disclaimers
- [ ] Route in App.tsx, sitemap + generate-sitemap script, metadata
- [ ] Tests: `tests/backSpineSpecialist.test.ts`
- [ ] Run full test suite + build
- [ ] Playwright desktop/phone: real mesh select, index-only item, level switching, label tracking, no overflow; regression Neck + prior modules
- [ ] Security scan check + publish
