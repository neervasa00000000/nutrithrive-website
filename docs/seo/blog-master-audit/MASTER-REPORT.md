# NutriThrive Blog Master Audit

Audit date: 2026-09-15  
Live verification: 2026-09-15T10:39:50+00:00  
Latest available Search Console data: 8 September 2026 (filtered exports only)

## 1. Executive Summary

- Root-level blog HTML files: 129 (including blog index)
- Root article files: 128
- Live/indexable local article entities: 122
- Blog ItemList entities: 122
- Sitemap URLs: 151 total
- Redirect variants reviewed: 457
- Live/local redirect discrepancies: 0
- PROTECT: 4
- IMPROVE: 89
- CONSOLIDATE: 6
- RETIRE_CANDIDATE: 0
- LOW_PRIORITY: 29
- REVIEW_REQUIRED: 66
- BLOCKED_PENDING_REVIEW: 34

No page deletion or new consolidation is approved. The current duplicate-body scan found no pairs at or above 70%. Search-intent overlap still needs query-by-page evidence before destructive decisions.

## 2. Repository Architecture

`site/blog/*.html` is tracked content and production input. `storefront/build.mjs` can regenerate wrappers and listings. `site/shared/js/blog-articles.js` is a metadata/listing registry. `.netlify-publish/` is a deployment artifact, not the source of truth. Redirect behavior is configured in `site/_redirects`. The live site remains the final HTTP authority.

## 3. Validation Baseline

- Blog ItemList: PASS, 122 live blog URLs.
- Sitemap parity: PASS, 151 URLs.
- Duplicate-body scan: PASS, zero pairs at or above 70%.

## 4. Live vs Local Reconciliation

The audit attempted one low-concurrency HTTP crawl for every unique current article URL, sitemap blog URL, redirect source and redirect target. Failures and redirect chains are retained in `URL-VARIANTS-AND-REDIRECTS.csv`. Live/local discrepancies found: 0.

## 5. GSC Source Quality

Seven 8 September workbooks were available. Every workbook has a query filter and overlaps the same three- or twelve-month periods. Overlapping exports were not summed. The referenced 14 September workbook was not present at the supplied path. There is no authoritative unfiltered current total-traffic workbook in the available files.

## 6. Query × Page Data Availability

Top queries cannot reliably be assigned to individual pages from current aggregate exports. Query and Page tabs are separate aggregates. `page_query_data_available` is therefore NO unless a future page-filtered export or API join is supplied.

## 7. Strongest Existing Assets

- [Glorenda & Healrize Moringa Patches Australia: Do They Work?](https://nutrithrive.com.au/blog/moringa-patches-australia-review-do-they-work) — PROTECT; highest single filtered-view impressions 8849.
- [Best Greens Powder Australia? Moringa vs Spirulina vs Matcha](https://nutrithrive.com.au/blog/moringa-vs-spirulina-vs-matcha-comparison-australia) — PROTECT; highest single filtered-view impressions 1004.
- [Does Moringa Powder Expire? Shelf Life in Australia](https://nutrithrive.com.au/blog/how-long-does-moringa-powder-last-storage-shelf-life-2026) — PROTECT; highest single filtered-view impressions 868.
- [Does Moringa Have Caffeine? Vs Coffee in Melbourne](https://nutrithrive.com.au/blog/moringa-vs-coffee-melbourne-energy-hack) — PROTECT; highest single filtered-view impressions 715.

## 8. Technical URL Issues

Current sitemap and ItemList parity pass. Redirect-source pages should remain absent from the sitemap and internal navigation. Do not replace working one-hop 301s with meta-refresh-only behavior. No new redirect is approved by this audit.

## 9. Structured Data Findings

Structured-data parse/error rows: 0. Schema recommendations are limited to markup that exactly matches visible content. FAQ schema is not recommended as a ranking shortcut.

## 10. Content Quality Findings

Main recurring risks are broad wellness pages with weak commercial alignment, date/year framing, missing first-party evidence, forced product transitions and compliance-sensitive claims. Style alone was not used to label any article as AI-generated.

## 11. Cannibalisation

- HIGH confidence: existing moved/legacy routes that already resolve to a selected winner.
- MEDIUM confidence: comparison/brand clusters with overlapping SERP roles, pending query-by-page evidence.
- LOW confidence: pages sharing “moringa” but solving different user problems.
- INSUFFICIENT DATA: all proposed new mergers without query-by-page and backlink evidence.

## 12. PROTECT Pages

Protect the pages listed in the master map where filtered GSC evidence or strategic first-party value exists. Do not change URL, title, H1 or core intent during the 28-day measurement lock.

## 13. Consolidation Candidates

Only already-moved local stubs are classified CONSOLIDATE. No additional article merge is approved. Backlink data is unavailable, so no 410 is approved.

## 14. SEO Improvement Opportunities

- [Curry Leaf Substitute: 7 Best Swaps for Australian Kitchens](https://nutrithrive.com.au/blog/curry-leaves-substitute-what-to-use-2026) — review after 13 October; score 7.8 (MEDIUM confidence).
- [5 Curry Leaf Recipes Beyond Dal](https://nutrithrive.com.au/blog/curry-leaves-recipes-beyond-dal) — review after 13 October; score 7.7 (MEDIUM confidence).
- [How to Make Moringa Tea (3 Easy Recipes)](https://nutrithrive.com.au/blog/how-to-make-moringa-tea-recipes-2026) — review after 13 October; score 7.7 (MEDIUM confidence).
- [Curry Leaves vs Curry Powder: Not the Same](https://nutrithrive.com.au/blog/curry-leaves-vs-curry-powder-difference-explained-2026) — review after 13 October; score 7.6 (MEDIUM confidence).
- [How to Choose Moringa Powder in Australia | Lab Checklist](https://nutrithrive.com.au/blog/how-to-choose-moringa-powder-australia-2026) — review after 13 October; score 7.6 (MEDIUM confidence).
- [How to Read a Moringa Batch Code | Freshness Check Australia](https://nutrithrive.com.au/blog/how-to-read-moringa-batch-codes-freshness) — review after 13 October; score 7.6 (MEDIUM confidence).
- [Chemist Warehouse Moringa vs NutriThrive Powder](https://nutrithrive.com.au/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025) — review after 13 October; score 7.6 (MEDIUM confidence).
- [Best Moringa Brands Australia 2026 Compared](https://nutrithrive.com.au/blog/moringa-brands-comparison-australia-2026) — review after 13 October; score 7.4 (MEDIUM confidence).
- [Moringa Heavy Metals Lab Testing Australia | What to Look For](https://nutrithrive.com.au/blog/moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026) — review after 13 October; score 7.4 (MEDIUM confidence).
- [What Does Moringa Powder Taste Like? Honest Mix Guide](https://nutrithrive.com.au/blog/what-does-moringa-powder-taste-like-honest-guide-2026) — review after 13 October; score 6.7 (MEDIUM confidence).
- [How to Brew Darjeeling Tea Perfectly](https://nutrithrive.com.au/blog/how-to-brew-darjeeling-tea-perfectly-2026) — review after 13 October; score 6.4 (MEDIUM confidence).
- [Fresh vs Dried Curry Leaves: Taste, Use & Storage](https://nutrithrive.com.au/blog/fresh-vs-dried-curry-leaves-cooking-comparison-2026) — review after 13 October; score 6.2 (MEDIUM confidence).

## 15. Hypothesis-Based Sales Opportunities

These are intent-based opportunities, not measured conversion conclusions. GA4 landing-page-to-purchase data was unavailable. Prioritise commercially relevant CLEAR pages with weak or missing product transitions only after the measurement lock.

## 16. Blog → Product Funnel

Each master-map row records GOOD, WEAK, MISSING or IRRELEVANT based on visible product links and CTA markup. This does not prove conversion performance.

## 17. Commercial Data Issues

One confirmed stale current-policy statement was reported on `https://nutrithrive.com.au/blog/darjeeling-black-tea-australia-guide`: “free shipping over $80 within Australia.” The production source now states “free shipping over $79 within Australia.” This is recorded as a `COMMERCIAL_ACCURACY_EXCEPTION`, approved by the founder for this correction only, implemented 15 September 2026, and scheduled for review on 13 October 2026. Other `$80`, `$49`, and `$49.50` matches remain untouched unless they explicitly describe the current free-shipping threshold.

## 18. Compliance Gates

- CLEAR: 28
- REVIEW_REQUIRED: 66
- BLOCKED_PENDING_REVIEW: 34

Compliance status is separate from SEO lifecycle. High-risk health pages are preserved for evidence review, not expanded for traffic.

## 19. Retirement Candidates

No final retirement is approved. Backlink data is unavailable, and low clicks alone do not justify deletion or 410.

## 20. Missing Data

- Unfiltered recent and twelve-month Search Console Page exports.
- Real query-by-page Search Console data.
- GA4 landing-page funnel and revenue data.
- Search Console Links or third-party backlink export.
- Server logs for historical URL demand.

## 21. First Safe Batch

No new technical consolidation should ship during the current measurement lock. The first five technical candidates are verification-only:

- Verify [https://nutrithrive.com.au/blog/fathers-day-gift-under-40](https://nutrithrive.com.au/blog/fathers-day-gift-under-40) remains a one-hop redirect to `https://nutrithrive.com.au/products/gift-pack` and absent from sitemap/internal links. Do not change it without backlink evidence.
- Verify [https://nutrithrive.com.au/blog/iron-deficiency-australian-women-abs-real-numbers-2026](https://nutrithrive.com.au/blog/iron-deficiency-australian-women-abs-real-numbers-2026) remains a one-hop redirect to `https://nutrithrive.com.au/blog/iron-deficiency-australian-women-symptoms-plant-based-sources-2026` and absent from sitemap/internal links. Do not change it without backlink evidence.
- Verify [https://nutrithrive.com.au/blog/is-moringa-safe-during-pregnancy-2026](https://nutrithrive.com.au/blog/is-moringa-safe-during-pregnancy-2026) remains a one-hop redirect to `https://nutrithrive.com.au/blog/moringa-pregnancy-safe-australia-trimester-guide-2026` and absent from sitemap/internal links. Do not change it without backlink evidence.
- Verify [https://nutrithrive.com.au/blog/moringa-smoothie-recipes-australia-easy-2026](https://nutrithrive.com.au/blog/moringa-smoothie-recipes-australia-easy-2026) remains a one-hop redirect to `https://nutrithrive.com.au/blog/moringa-smoothie-recipes-australia-2026` and absent from sitemap/internal links. Do not change it without backlink evidence.
- Verify [https://nutrithrive.com.au/blog/stress-weight-gain-cortisol-mechanism-what-to-do-2026](https://nutrithrive.com.au/blog/stress-weight-gain-cortisol-mechanism-what-to-do-2026) remains a one-hop redirect to `https://nutrithrive.com.au/blog/moringa-calm-mind-stress-brain-fog-cortisol-science-2026` and absent from sitemap/internal links. Do not change it without backlink evidence.

The first five SEO/sales candidates are review-after-lock opportunities, not approved edits:

- Review [Curry Leaf Substitute: 7 Best Swaps for Australian Kitchens](https://nutrithrive.com.au/blog/curry-leaves-substitute-what-to-use-2026) after 13 October using unfiltered GSC plus GA4; preserve URL and intent.
- Review [5 Curry Leaf Recipes Beyond Dal](https://nutrithrive.com.au/blog/curry-leaves-recipes-beyond-dal) after 13 October using unfiltered GSC plus GA4; preserve URL and intent.
- Review [How to Make Moringa Tea (3 Easy Recipes)](https://nutrithrive.com.au/blog/how-to-make-moringa-tea-recipes-2026) after 13 October using unfiltered GSC plus GA4; preserve URL and intent.
- Review [Curry Leaves vs Curry Powder: Not the Same](https://nutrithrive.com.au/blog/curry-leaves-vs-curry-powder-difference-explained-2026) after 13 October using unfiltered GSC plus GA4; preserve URL and intent.
- Review [How to Choose Moringa Powder in Australia | Lab Checklist](https://nutrithrive.com.au/blog/how-to-choose-moringa-powder-australia-2026) after 13 October using unfiltered GSC plus GA4; preserve URL and intent.

All proposed rows remain `founder_approval = NO` in the action queue.

## 22. Change Lock Strategy

Current indexable articles default to MEASURING until 13 October 2026. Only legal, factual, commercial, broken-link, broken-page, severe UX or technical emergencies bypass the lock.

## 23. Future Content Governance

`UPDATE > CONSOLIDATE > CREATE`. A new URL is the last option after checking the master map, existing intent owner, cannibalisation, business usefulness and compliance.

## 24. What Must Not Be Done

- No bulk deletions, mass redirects or random rewrites.
- No repeated title/H1/intent changes during the measurement lock.
- No assumption that 129 files equals 129 active articles.
- No assumption that low clicks means useless.
- No summing overlapping GSC exports or false query-to-page mapping.
- No automatic `$80` flags or arbitrary title/meta length rules.
- No 410 without backlink evidence.
- No merging different intents, new blogs, aggressive medical expansion or schema tricks.
- No checkout or payment changes.

## 25. Founder Approval Table

All rows in `ACTION-QUEUE.csv` have `founder_approval = NO`. Founder approval and missing evidence are required before implementation.
