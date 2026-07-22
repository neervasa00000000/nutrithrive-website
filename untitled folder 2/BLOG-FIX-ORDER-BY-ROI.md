# Blog Fix Order by ROI
**Date:** 22 July 2026  
**Scope:** `/blog/*` only · GSC Last 28 days · ignore blogs with &lt;80 impressions  

---

## Formula (transparent)

```
ROI ∝ SearchVolume × CurrentImpressions × CTRPotential × BusinessValue × ConversionPotential
```

| Factor | How we measured it (no guessing from unpaid keyword tools) |
|--------|--------------------------------------------------------------|
| **Search Volume** | **Proxy = log(GSC impressions)**. We do **not** have a separate keyword-volume export. Impressions = observed demand Google already assigns to your URL. |
| **Current Impressions** | Same 28-day impression total (absolute opportunity size). |
| **CTR Potential** | Gap between a rough position-based CTR band and your actual CTR, plus boosts for **0-click / ultra-low CTR** at mid positions. *Relative scoring only — not Google’s expected CTR.* |
| **Business Value** | Commercial investigation / brand-battle pages score highest (CW, Rosabella, patches, best/choose). Pure lifestyle/grow/tea score lower. |
| **Conversion Potential** | How directly the intent routes to powder purchase (retail comparison & buyer guides &gt; safety YMYL &gt; hobby grow). |

**Excluded:** 88 blogs under 80 impr — little opportunity.

---

## Fix order (highest ROI first)

| Order | ROI | Blog | 28d Impr | Clicks | CTR | Pos | Why fix this next |
|------:|----:|------|--------:|-------:|----:|----:|-------------------|
| **1** | 288 | **moringa-patches-australia-review-do-they-work** | 4,469 | 81 | 1.81% | 6.3 | Largest impression pool on the site + max business/conversion value. Citations + brand-front title + inlinks. Highest $ per hour. |
| **2** | 283 | **moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025** | 2,023 | 33 | 1.63% | 5.1 | Already near top for commercial queries; CTR soft; proof photo + less Rosabella overlap → sales path. |
| **3** | 280 | **how-long-does-moringa-powder-last-storage-shelf-life-2026** | 923 | 3 | **0.33%** | 6.6 | Same position band as patches but ~7× worse CTR. Huge CTR upside if SERP package fixed (diagnose Page×Query first, then one change). |
| **4** | 226 | **moringa-brands-comparison-australia-2026** | 669 | 7 | 1.05% | 8.0 | High biz value “best brand” intent; currently **orphan**. Reposition as brand-ranking pillar, not another Rosabella essay. |
| **5** | 213 | **what-does-moringa-powder-taste-like-honest-guide-2026** | 220 | 0 | **0%** | 7.9 | Zero clicks at a workable position — cheap win if snippet/title packaging fails; high convert assist (taste objection). |
| **6** | 210 | **rosabella-moringa-reviews-legit-or-overhyped-2026** | 1,522 | 33 | 2.17% | 7.0 | Strong commercial traffic already; differentiate from CW page; kill `.html` leakage. |
| **7** | 193 | **ag1-alternative-australia-moringa-comparison-2026** | 295 | 2 | 0.68% | 7.5 | High-ticket comparison intent; page-2 adjacent queries in GSC; clear path to powder as “enough.” |
| **8** | 183 | **best-greens-powder-australia-2026** | 1,005 | 15 | 1.49% | 9.3 | **410 Gone** but still earning demand. Formula ranks #8; **execution override → treat as #1 ops task** when scheduling (broken result). |
| **9** | 161 | **science-shade-drying-vs-sun-drying-moringa** | 918 | 12 | 1.31% | 6.8 | Unique EEAT asset under-clicked; feeds choose-guide + PDP trust. |
| **10** | 151 | **moringa-vs-coffee-melbourne-energy-hack** | 1,123 | 2 | **0.18%** | 8.4 | Huge impr, catastrophic CTR; sprawl fix unlocks caffeine query (`does moringa have caffeine`). |
| **11** | 145 | **moringa-and-berberine-australia-what-science-says-2026** | 1,668 | 25 | 1.50% | 7.5 | Supports patches cluster; YMYL cite potential; add images + tighten. |
| **12** | 139 | **moringa-vs-ashwagandha-comparison-2026** | 406 | 0 | 0% | 9.3 | Demand without clicks; needs citations or merge — don’t expand fluff. |
| **13** | 130 | **moringa-vs-spirulina-vs-matcha-comparison-australia** | 334 | 0 | 0% | 11.4 | Superfood pillar; natural 301/restore target for greens demand. |
| **14** | 130 | **curry-leaves-substitute-what-to-use-2026** | 1,221 | 0 | 0% | 10.1 | Massive impr + **orphan**; body already good — link cluster first, then SERP package. |
| **15** | 98 | **moringa-vs-whey-protein-comparison-2026** | 229 | 6 | 2.62% | 4.3 | High position, thin page — deepen only if it stays thin vs competitors (verify first). |
| **16** | 96 | **is-moringa-safe-for-children-kids-dosage-2026** | 1,288 | 6 | 0.47% | 6.5 | High impr; CTR poor; citations already good — SERP packaging / trust chrome, not a rewrite. |
| **17** | 93 | **how-to-add-moringa-to-diet** | 852 | 2 | 0.23% | 9.8 | Mid-funnel usage; convert assist; CTR terrible. |
| **18** | 85 | **best-protein-powder…** (legacy redirect target noise) | 399 | 3 | 0.75% | 9.8 | Confirm redirect/canonical health before content work — may be equity leak not a content ROI. |

**Stop after #14 for the first content sprint** unless greens (#8) and banned-merge (below) are already done.

---

## Parallel infrastructure (not ranked by blog ROI, but do anyway)

These have **lower blog-level ROI** (less impression mass) but **high system ROI**:

| Task | Why outside the ROI table |
|------|---------------------------|
| Merge the two **banned** URLs | Low impr each; high IA / AI-canonical value; ~2–4h |
| Fix **CW→PDP wrong redirects** | Not a blog page score — unlocks equity to #2 ROI page |
| **Internal links → patches + substitute + brands-comparison** | Multiplies ROI of #1, #4, #14 without rewriting |

---

## Recommended execution sequence (budget reality)

```
A. Ops overrides (same day)
   1. Restore or 301 best-greens (broken #8)
   2. Merge banned pair
   3. Fix CW investigation redirects → CW article

B. Highest ROI content (this week)
   4. Patches (#1): citations + brand-front title + inlinks + CTA trim
   5. CW (#2): proof photo + trim overlap
   6. Shelf-life (#3): Page×Query diagnose → one SERP fix
   7. Rosabella (#6): differentiate from CW
   8. Brands-comparison (#4): un-orphan + reposition as pillar

C. High CTR / zero-click wave
   9. Taste (#5), Coffee (#10), Ashwagandha (#12), Spirulina-matcha (#13), Substitute (#14)

D. Only then
   Berberine polish, kids CTR packaging, diet guide, whey depth check
```

---

## Why this order (plain English)

1. **Patches & CW** = most eyes × most commercial intent. Fixing them moves revenue-capable traffic first.  
2. **Shelf-life** = rare “same position, broken CTR” anomaly → outsized CTR ROI per hour once diagnosed.  
3. **Brands / Rosabella / AG1** = money comparisons still leaving clicks on the table.  
4. **Greens 410** = formula mid-pack but **must jump the queue** because the result is broken.  
5. **Zero-click mid-rankers** (taste, ashwagandha, substitute, 3-way) = cheap packaging/linking wins before writing new posts.  
6. **Grow-moringa (1.3k impr)** and similar **score low on business/conversion** — ignore for now despite impressions.

---

## Explicitly ignored (low opportunity / low ROI)

- All blogs **&lt;80 impr** (88 URLs)  
- High-impr but low convert: **grow-moringa-tree** (ROI ~35) — hobby intent  
- Duplicate banned variants beyond the merge task  
- Tea/lifestyle posts until commercial cluster is fixed  

---

**Bottom line:** Fix **patches → CW → shelf-life**, while **greens 410 + banned merge + redirects** run in parallel. That is the highest-ROI path on current evidence.
