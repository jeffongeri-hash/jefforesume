# Mobile-friendly finance tools

## What will change
- Make IV Strike Selector stack its controls above results on phones.
- Make Covered Call Master’s tabs, strike tables, recommendation card, and long text sections fit phone screens cleanly.
- Make Paycheck Analyzer stack its input and results areas, remove horizontal page overflow, and simplify dense rows on phones.
- Increase touch target and form-field sizing where needed while preserving desktop layouts and all calculations.

## Verification
- Check all three pages at a 390 × 844 phone viewport.
- Confirm no page-level horizontal scrolling, clipped controls, overlapping text, or unavailable tables/tabs.
- Confirm the current preview builds without errors.

## Technical details
- Add focused responsive CSS within each existing page.
- Add only small class hooks where inline desktop styles need phone overrides.
- Keep wide financial tables horizontally scrollable inside their own panels rather than compressing values beyond readability.
