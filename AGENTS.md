# AGENTS.md

- The MSK atlas 3D viewer uses vanilla three (pinned to the version Vanta backgrounds need) with GLTFLoader/DRACOLoader/OrbitControls rather than React Three Fiber — upgrading three for R3F/drei would risk breaking the Vanta backgrounds.
- Anatomy GLBs and the Draco decoder are self-hosted under `public/anatomy-models/` and `public/draco/` — the meshes are Draco-compressed and must never be hotlinked.
- Mesh names must be read from the glTF JSON node names (GLTFLoader sanitizes object names); mesh→study-card reconciliation lives in `src/data/msk/meshMap.ts`.
