# Internal linking fixes (2026-04-26)

## Task 1 — Pillar posts → orphaned blog posts

Updated each pillar’s “Related guides” block (`nt-related-links-block`) so high-value orphaned posts receive inbound links. Caps respected at **8 links per pillar** (existing site styling; light-theme cards—not the alternate dark `Related Reading` template, which would clash with these pages).

| Pillar | File | Notes |
|--------|------|--------|
| Brands | `blog/moringa-brands-comparison-australia-2026.html` | Eight links: hub guide + Rosabella, clean protein, founder story, shade vs sun drying, batch codes, growing in AU, plant-based functional foods. |
| Powder guide | `blog/moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html` | Eight links: dosing visual, diet ideas, powder vs capsules, taste, legitimacy, seniors, Melbourne body burden, food-as-medicine map. FAQ “grow in Melbourne?” now links to **Melbourne complete grower’s report** and **Australia growing-in-pots** (extra contextual inlinks). |
| Where to buy | `blog/where-to-buy-moringa-in-australia-online-vs-stores-2026-guide.html` | Eight links: Chemist Warehouse comparison, Chinese brand review, Chinese Melbourne buyer guide, Victoria delivery explainer, affordable superfoods marketplace, heavy metals / detox context, brands comparison, shop powder. Removed redundant self-link. |
| Spirulina vs matcha | `blog/moringa-vs-spirulina-vs-matcha-comparison-australia.html` | **New** related block after `</article>`: superfoods shortlist, $10 stack story, moringa vs coffee, 30-day coffee reset, caffeine article, calm/stress science, Melbourne snack piece, high-protein recipes. |
| Curry leaves | `blog/dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html` | No change; already linked `nutrithrive-dried-curry-leaves-tradition-health.html` in Related Guides. |

## Task 2 — Labs

- `nutrithrive_labs/index.html`: Confirmed all six tools are linked: `password-generator.html`, `dedup-lines.html`, `sitemap-generator.html`, `pomodoro-timer.html`, `time-converter.html`, `quick-notes.html`.
- `index.html`: Added primary nav item **Labs** → `/nutrithrive_labs/`.

## Task 3 — Blog index

- `blog/index.html`: All 31 previously orphaned posts already appeared as cards in `.blog-list-section`; **no new cards** were required.

## Orphans with no pillar “Related” slot

None: every listed orphan is covered by at least one pillar Related block and/or the extra FAQ links on the powder guide (grower report + pots guide).

## Summary stats (for changelog)

1. **Pillar with the most new deep links:** `moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html` — eight Related entries plus two FAQ links to orphaned grower content.
2. **Cards added to `blog/index.html`:** **0** (already complete).
3. **Labs index:** all **6** tools confirmed linked from `nutrithrive_labs/index.html`.
4. **Stranded orphans:** **none** identified.
