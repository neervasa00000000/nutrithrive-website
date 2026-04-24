# Fixes applied — blog consolidation (2026-04-24)

## Summary

| Metric | Count |
|--------|------:|
| HTML files removed from `/blog/` | **44** |
| New 301 rules appended to `/_redirects` | **44** |
| `sitemap.xml` | Regenerated via `node scripts/build-sitemap.js` (41 URLs) |

### Breakdown

- **Bucket 2 (duplicate → pillar):** 27 posts deleted; 27 redirects to the closest pillar (`moringa-powder-guide…`, `moringa-brands-comparison…`, `dried-curry-leaves…`, `where-to-buy-moringa…`, or `moringa-vs-spirulina-vs-matcha…`).
- **Bucket 3 (off-topic → homepage):** 17 posts deleted; 17 redirects to `/`.

### Follow-up work

- Internal `href` targets in remaining blog and product pages were updated to match the same destinations (plus `best-clean-protein-powders-moringa-products-australia-2026.html` where the old generic protein guide linked). A one-off pass used `scripts/fix-deleted-blog-links.py` (safe to keep for reference or remove).
- `shared/js/blog-enhancements.js` and `scripts/global/blog-enhancements.js`: protein guide link target updated to the clean protein + moringa post.

---

## STEP 2 — Upgrade order (31 Bucket 1 posts + index)

Highest SEO value first. Use the **STEP 3 upgrade prompt** from the project chat for each file; **item 31** is **`blog/index.html`** (the deleted `australian-superfood-revolution…` post is not upgraded as a post).

**Week 1**

1. `why-i-built-nutrithrive-moringa-real-story-finest-moringa-powder.html`
2. `is-moringa-legit-what-science-and-real-users-say-2026.html`
3. `moringa-powder-vs-capsules-which-one-actually-works-better-2026.html`
4. `does-moringa-have-caffeine-truth-about-energy-focus-side-effects-2026.html`
5. `science-shade-drying-vs-sun-drying-moringa.html`

**Week 2**

6. `moringa-vs-coffee-melbourne-energy-hack.html`
7. `how-to-use-moringa-powder-daily-without-the-bad-taste-2026.html`
8. `smart-moringa-daily-intake-australia-visual-guide-2026.html`
9. `moringa-calm-mind-stress-brain-fog-cortisol-science-2026.html`
10. `growing-moringa-australia-honest-frost-pots-2026.html`

**Week 3**

11. `natural-heavy-metal-detox-moringa-cleanse-body.html`
12. `high-protein-moringa-recipes-australia-2026.html`
13. `30-day-moringa-coffee-reset-australia-guide-2026.html`
14. `moringa-powder-victoria-seniors-joint-health.html`
15. `how-to-add-moringa-to-diet.html`

**Week 4**

16. `best-clean-protein-powders-moringa-products-australia-2026.html`
17. `10-dollar-superfood-replaced-200-supplement-stack-australia-2026.html`
18. `healthy-snack-melbourne-why-everyone-switching-to-moringa-2026.html`
19. `how-to-read-moringa-batch-codes-freshness.html`
20. `moringa-melbourne-complete-growers-report-2026.html`

**Week 5**

21. `nutrithrive-delivers-across-victoria-is-your-town-eligible-hint-yes.html`
22. `nutrithrive-dried-curry-leaves-tradition-health.html`
23. `rosabella-moringa-reviews-legit-or-overhyped-2026.html`
24. `moringa-brands-comparison-australia-chinese-review.html`
25. `buy-moringa-powder-melbourne-victoria-chinese-guide.html`

**Week 6**

26. `best-superfoods-australia-comparison-health-conscious-adults.html`
27. `plant-based-functional-foods-australia-wellness-nutrithrive-2026.html`
28. `melbourne-body-burden-report-2026.html`
29. `melbourne-food-as-medicine-map-cafes-organic-stores-healthspan-eating-2026.html`
30. `affordable-superfoods-organic-tax-marketplace-wellness-vic-nsw-qld-2026.html`
31. `index.html` (blog hub — **replace** former “australian-superfood-revolution” slot)

---

## STEP 3 — Upgrade prompt

Copy from the user’s project instructions: **“The Upgrade Prompt (Use for Every Post)”** block. For each file, substitute `[FILENAME].html` with the target filename, read the file, rewrite per rules, and **wait for approval before saving** (per that workflow).
