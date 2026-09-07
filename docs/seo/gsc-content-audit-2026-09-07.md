# NutriThrive Search Console content audit — 7 September 2026

## Decision summary

- Do not mass-delete blogs. The recent data shows a visibility and click-through problem, not proof that the whole library is harmful.
- Protect the ten pages already earning meaningful clicks.
- Improve the 32 pages with useful rankings or impressions but weak click-through.
- Hold new/low-data pages for a full 90-day observation window before deciding whether to consolidate them.
- Remove or redirect a page only after checking its query overlap, backlinks and conversion assists. A zero-click row alone is not enough.

## Site trend

| Window | Clicks | Impressions | Interpretation |
|---|---:|---:|---|
| Last 7 days | 137 | 9,476 | Soft finish to the week; too short for deletion decisions |
| Last 28 days | 576 | 42,679 | Second-half clicks +2.1%; impressions -7.7% |
| Last 3 months | 1,271 | 101,007 | Strong growth from the low June base |
| Last 12 months | 3,530 | 283,443 | Useful baseline, but spans major site/content changes |
| Latest 24 hours | 10 | 919 | Partial/incomplete window; do not compare with complete days |

Mobile produced 476 of 576 clicks in the 28-day export (82.6%). Desktop CTR was 0.89%, compared with 1.48% on mobile, so desktop snippets and commercial intent remain a secondary opportunity.

## Protect — do not merge, delete or substantially retitle

| Page | 28-day clicks | Impressions | CTR | Position | Action |
|---|---:|---:|---:|---:|---|
| Moringa patches review | 238 | 9,995 | 2.38% | 5.7 | Add query-specific sections; retain URL and core title |
| Moringa shelf life | 51 | 5,486 | 0.93% | 4.6 | Test a clearer “expire/go bad” snippet later; keep URL |
| Moringa for children | 32 | 4,816 | 0.66% | 5.8 | Clinical/editorial review before SEO rewriting |
| Chemist Warehouse comparison | 42 | 2,217 | 1.89% | 5.4 | Keep comparison current and evidence-led |
| Grow a moringa tree | 23 | 2,682 | 0.86% | 8.0 | Improve snippet around tree/pot intent |
| Moringa and berberine | 22 | 1,849 | 1.19% | 7.6 | Keep medically cautious and current |
| Rosabella review | 15 | 916 | 1.64% | 7.5 | Refresh facts, not the ranking URL |
| Moringa brands comparison | 10 | 319 | 3.13% | 8.0 | Preserve; strengthen commercial links |
| Shade drying science | 7 | 813 | 0.86% | 7.1 | Improve snippet after query review |
| How to add moringa to food | 5 | 1,180 | 0.42% | 12.1 | Improve title/meta and recipe navigation |

## Highest-priority improvements

1. **Moringa vs coffee:** 1,133 impressions, 0.53% CTR, position 8.3. The leading query cluster asks whether moringa contains caffeine. Reframe the snippet around that direct question without changing the URL.
2. **Moringa for dogs:** 995 impressions, 0.80% CTR, position 6.3. Review medical/veterinary wording and make the snippet answer safety intent without implying a universal dose.
3. **Curry leaf substitutes:** 586 impressions, 0.51% CTR, position 7.8. Keep the useful comparison format and improve freshness/availability context.
4. **Moringa side effects:** 521 impressions, 0.77% CTR, position 8.3. Make contraindications and evidence limits prominent.
5. **Daily caffeine limit:** 519 impressions, 0.19% CTR, position 11.6. Align title and intro to the exact Australian/FSANZ question.
6. **Moringa for seniors:** 440 impressions, 0.91% CTR, position 14.0. Reduce broad joint-health framing and strengthen practical meal-use intent.
7. **Moringa vs ashwagandha:** 187 impressions, no clicks, position 8.4. This is a snippet problem, not a deletion candidate.
8. **Moringa soap benefits:** 167 impressions, no clicks, position 7.5. Link clearly to the handmade Australian soap and avoid unsupported skin claims.
9. **Curry leaf tea:** 138 impressions, no clicks, position 7.2. Lead with brewing method and taste rather than broad benefit claims.
10. **Natural pre-workout:** 101 impressions, no clicks, position 8.6. Reframe away from stimulant-like promises because moringa is not a stimulant.

## Query opportunities found in the 28-day export

- `glorenda reviews` — 309 impressions, 0 clicks, position 8.1
- `is glorenda legit` — 125 impressions, 0 clicks, position 5.6
- `moringa patches reviews` — 273 impressions, 2 clicks, position 7.5
- `does moringa powder expire` — 211 impressions, 1 click, position 4.2
- `how long does moringa powder last` — 59 impressions, 0 clicks, position 3.5
- `does moringa have caffeine` — 123 impressions, 0 clicks, position 10.7
- `moringa powder` — 201 impressions, 6 clicks, position 17.5
- `buy moringa` — 58 impressions, 0 clicks, position 16.3

The commercial `moringa powder` and `buy moringa` terms need stronger internal links into the product page from relevant high-traffic articles. Informational pages should not all use identical sales blocks or exact-match anchors.

## Consolidation review — not approved for deletion yet

Review these groups after the pages have at least 90 days of data:

- **Stress/energy:** anxiety, sleep, cortisol/brain fog, moringa vs coffee, and week-by-week energy.
- **Soap/skin:** soap benefits, soap comparison, ingredient-label guide, face mask, moringa oil, and eating moringa for skin.
- **Curry leaf education:** curry leaf benefits, cholesterol/heart, curry leaf tea, fresh vs dried, storage, and substitutions.
- **Broad personal-result posts:** “what actually fixed it,” “30-day challenge,” “week-by-week,” and first-person skin/gut stories need proof that they describe genuine experience. If not, rewrite as transparent evidence guides or consolidate.
- **Broad wellness posts unrelated to the products:** balanced plate, strength training, ultra-processed food, water, protein and similar topics should remain only if they earn relevant search demand or assist product discovery without forced claims.

## Safe retirement rule

A page becomes a retirement candidate only when all are true:

1. At least 90 days since publication or major rewrite.
2. No meaningful clicks and very low impressions across the full period.
3. No unique query intent compared with another page.
4. No useful backlinks, assisted conversions or important internal-link role.
5. A stronger destination exists for a permanent 301 redirect.

Do not return a 404 for an old ranking article when a close replacement exists. Consolidate the useful material, redirect once to the final canonical URL, update internal links and remove the old URL from the sitemap.

## Work completed in this pass

- Read all five Search Console workbooks and normalized URL fragments so anchors were not miscounted as separate pages.
- Classified current URLs into protect, improve, watch and evidence-needed retirement groups.
- Reframed the moringa-vs-coffee page for the observed `does moringa have caffeine` query cluster while retaining its existing URL.
- Repaired the Journal ItemList regeneration helper so it supports the current CollectionPage JSON-LD structure.
- Fixed a non-idempotent build rule that re-wrapped responsive tables on every build.
- Ran the production build twice to verify idempotence, then passed sitemap, ItemList, duplicate-content and structural SEO checks.

## Next measurement dates

- Check indexing/snippet pickup after 7–14 days.
- Compare page CTR and query mix after 28 complete days.
- Perform the first evidence-based consolidation review after 90 days of stable URLs/content.
- Track add-to-cart and purchase events separately from rankings; traffic growth without product progression is not a sales win.
