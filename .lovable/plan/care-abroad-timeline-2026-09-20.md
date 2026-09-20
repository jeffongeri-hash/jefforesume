# Care Abroad Timeline

## Goal
Add a dedicated Care Abroad timeline page that shows when each planning and care step occurs, with direct links from the matching guide sections.

## What will change
- Add a new `/care-abroad/timeline` page using the Care Abroad visual style.
- Organize the timeline into practical phases: early planning, provider confirmation, booking, pre-travel preparation, care abroad, return handoff, and follow-up.
- Include clear timing ranges, key actions, dependencies, and links back to the relevant guide sections.
- Add “View timeline” links inside the guide’s Route, Treatment Calendar, Safety Net, Budget, and Checklist sections.
- Add a Timeline item to the guide’s section navigation.
- Preserve the guide’s existing interactive tools and saved checklist progress.

## Technical details
- Register the timeline as a lazy-loaded route in the existing app router.
- Build the timeline as a responsive React page with the site header and semantic theme tokens.
- Use guide anchors such as `/care-abroad#route`, `/care-abroad#course`, and `/care-abroad#checklist` for cross-navigation.
- Verify the new page and guide links on desktop and mobile, then confirm the preview builds without errors.
