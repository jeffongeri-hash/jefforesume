# Roadmap

## Hip & Pelvis specialist module (/msk-anatomy-atlas/lower-extremity/hip-pelvis)

- [x] Data: 97 entries across 7 groups (pelvic bones/joints/ligaments, hip joint & proximal femur, gluteal & deep rotators, anterior hip & iliopsoas, medial thigh & adductors, neurovascular & pelvic floor, clinical surface anatomy)
- [x] Mesh map: bilateral regex rules verified against real GLB node names; index-only disclosure for landmarks/spaces without meshes
- [x] Wire viewer: specialistHipPelvis prop, hipSide whole/right/left crop, anterior default camera, clipping kept active
- [x] Wire page: route, hub card #7, hip-focus tabs, nav links (Back↔Hip), search, disclaimers
- [x] Tests: 6 new tests, all 36 pass; typecheck fixed
- [ ] Playwright desktop + phone verification (real mesh selection, index-only, side switching, label tracking, overflow, regressions)
- [ ] Publish after checks pass
