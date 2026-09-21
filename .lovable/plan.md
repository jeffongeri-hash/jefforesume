# Kenya trip guide standalone page

## Build
- Add the uploaded interactive Kenya trip guide as a dedicated `/kenya-trip` page.
- Preserve its UK-to-Nairobi itinerary, safety guidance, countdown, preparation timeline, checklist, currency converter, price comparisons, source links, and emergency call links.
- Present the guide beneath the existing Jefney Ongeri site header.
- Add “Kenya Trip” to the Career Tools section of the responsive Browse menu.

## Technical details
- Serve the self-contained guide from the site’s embed directory so its scripts and saved checklist continue working.
- Add a lightweight full-width page wrapper with page-specific search and sharing metadata.
- Register the page in the existing site router without altering the guide’s content.

## Verification
- Confirm `/kenya-trip` loads on desktop and phone widths without page overflow.
- Confirm the countdown, navigation, checklist persistence, currency conversion, external links, and tap-to-call emergency numbers remain available.
