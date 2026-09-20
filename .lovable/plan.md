# Care Abroad standalone page

## Build
- Add the uploaded interactive Care Abroad guide as a dedicated `/care-abroad` page.
- Preserve its route planner, pricing tools, checklist, sources, and embedded research PDF.
- Wrap the guide with the same Jefney Ongeri site header used on the homepage.
- Add “Care Abroad” to the desktop navigation and the mobile/tablet Career Tools menu.

## Technical details
- Serve the uploaded self-contained guide from the site’s embed directory so its scripts and saved checklist remain functional.
- Add a lightweight page wrapper with search metadata and a responsive full-width guide frame.
- Register the new page in the existing site router.

## Verification
- Confirm the page loads at `/care-abroad`, the homepage-style header appears, and the guide interactions render on desktop and mobile.
