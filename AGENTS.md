# AGENTS.md

- The MSK atlas 3D viewer uses vanilla three (pinned to the version Vanta backgrounds need) with GLTFLoader/DRACOLoader/OrbitControls rather than React Three Fiber — upgrading three for R3F/drei would risk breaking the Vanta backgrounds.
- Anatomy GLBs and the Draco decoder are self-hosted under `public/anatomy-models/` and `public/draco/` — the meshes are Draco-compressed and must never be hotlinked.
- Mesh names must be read from the glTF JSON node names (GLTFLoader sanitizes object names); mesh→study-card reconciliation lives in `src/data/msk/meshMap.ts`.

- The specialist shoulder route shares the atlas page but uses separate shoulder data and an opt-in named-mesh/crop preset; overview framing and original clinical data must remain independent. Keep data-only structures distinct from exact mesh matches to avoid misleading anatomical selection.
- Cache decoded GLB source scenes, clone transforms/materials per viewer and retain shared geometry; navigation must not re-download or re-decode each reference system.
- Viewer badges project selected/hovered real-mesh positions into DOM coordinates on camera changes; exact source names remain separate from normalized study names.
