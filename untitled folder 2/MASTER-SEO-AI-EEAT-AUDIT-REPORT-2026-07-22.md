# NutriThrive Master SEO + AI Search + EEAT + Content Audit
**Site:** https://nutrithrive.com.au  
**Audit date:** 22 July 2026  
**Data sources:** Google Search Console exports (Last 24 hours / Last 7 days / Last 28 days), live HTML of Priority pages, `_redirects`, `robots.txt`, `sitemap.xml`, `llms.txt`, competitor SERPs (Australia)

---

# EXECUTIVE VERDICT (READ THIS FIRST)

NutriThrive is **not failing because of thin content volume**. It is failing to convert visibility into clicks, citations, and customers for five concrete reasons:

1. **CTR collapse on already-ranking pages** — Top commercial pages sit at positions 4–8 with 1–2% CTR when expected CTR is ~3.5–6%. Estimated missed clicks on top pages alone: **~200+/month** at current impression levels.
2. **Dead URL still ranking** — `/blog/best-greens-powder-australia-2026` is **410 Gone** but still received **~1,005 impressions / 15 clicks** in 28 days. Google is showing a corpse.
3. **Commercial cannibalization** — Chemist Warehouse / Rosabella / “best brand” intent is split across **4–5 live pages**.
4. **Money pages underperform** — Product page `/products/moringa-powder/` averages position **~22** for “moringa powder” demand; Product snippets show **1,804 impressions / 0.44% CTR / pos 21.3**.
5. **AI/SERP packaging is weak on the pages that already win impressions** — Titles are too long (truncated), intros sometimes bury the answer, and several high-impression pages have **0 clicks**.

**Site trajectory is positive:** first 7 days of the 28-day window = 34 clicks / 2,641 impressions → last 7 days = 109 clicks / 8,386 impressions. The problem is not growth stall — it is **capture inefficiency**.

**Brand search is almost nonexistent:** ~5 brand clicks / ~29 brand impressions in the query export vs thousands of non-brand impressions. Growth depends almost entirely on non-brand commercial investigation queries.

---

# PHASE 0 — SEARCH CONSOLE OPPORTUNITY ANALYSIS

## 0.1 Data windows analysed

| Export file | Window | Role in analysis |
|-------------|--------|------------------|
| `…2026-07-22 (1).xlsx` | Last **28 days** | Primary opportunity scoring, page/query inventory |
| `…2026-07-22 (2).xlsx` | Last **7 days** | Trend (Growing / Stable / Declining) |
| `…2026-07-22.xlsx` | Last **24 hours** | Near-term pulse (incomplete / volatile) |

## 0.2 Site-level performance (28 days)

| Metric | Value | Interpretation |
|--------|-------|----------------|
| Total clicks (Pages sheet) | **331** | Small absolute traffic; every CTR point matters |
| Total impressions | **28,216** | Healthy discovery for a young niche brand |
| Blended CTR | **1.17%** | Far below expected for avg positions often in 5–10 |
| Australia | 243 clicks / 13,989 impr / **1.74% CTR** / pos 9.33 | Core market |
| United States | 17 clicks / 4,159 impr / **0.41% CTR** / pos 11.19 | Visibility without relevance/CTR |
| Mobile | 257 clicks / 19,172 impr / **1.34% CTR** / pos 7.03 | Dominant device |
| Desktop | 73 clicks / 8,051 impr / **0.91% CTR** / pos **14.76** | Worse positions + worse CTR |
| Product snippets | 8 clicks / **1,804** impr / **0.44% CTR** / pos **21.31** | Critical commercial failure surface |
| Review snippets | 0 / 4 | Negligible |
| Brand queries (export) | ~5 clicks / ~29 impr | Brand moat not yet built |

### Trend (Growing)

| Period | Clicks | Impressions |
|--------|--------|-------------|
| First 7 days of 28d window | 34 | 2,641 |
| Last 7 days of 28d window | 109 | 8,386 |
| Change | **+221%** | **+218%** |

**Seasonal behaviour:** Insufficient multi-month history in these three files to claim seasonality. Do **not** treat short-window spikes as seasonal. Re-export 3–6 months for true seasonality.

## 0.3 Brand vs non-brand

From the Queries sheet (partial query coverage — GSC anonymises low-volume queries):

| Type | Clicks | Impressions |
|------|--------|-------------|
| Brand (nutrithrive / nutri thrive / nutra thrive) | ~5 | ~29 |
| Non-brand (classified in export) | ~118+ | ~9,000+ |

**Business implication:** You are winning attention as a *reviewer/comparison publisher*, not yet as a *brand people type*. That makes title/meta CTR and comparison EEAT existential.

## 0.4 Query intent distribution (28d Queries sheet)

| Intent class | Queries | Clicks | Impressions | Business value |
|--------------|---------|--------|-------------|----------------|
| Commercial investigation (CW, Rosabella, patches, reviews, vs) | 221 | **72** | 3,942 | **Highest** — this is the money funnel |
| Navigational / other | 412 | 32 | 3,152 | Mixed |
| Informational (how/what/safe/benefits) | 232 | 6 | 1,077 | AI citation + mid-funnel |
| Local informational (Australia/cities) | 65 | 9 | 663 | Medium |
| Transactional (buy/price/near me) | 70 | 4 | 430 | High value, **under-captured** |

## 0.5 Opportunity Score methodology (0–100)

For each URL:

| Component | Weight | What it measures |
|-----------|--------|------------------|
| Traffic potential | 25% | log-scaled impressions |
| Ranking potential | 20% | Positions 4–20 (movable) score highest |
| Conversion potential | 20% | Commercial URL signals / product URLs |
| AI citation potential | 15% | Comparison, science, how/what structure |
| Business value | 20% | Product, CW, Rosabella, choose/buy guides |
| + CTR underperformance boost | up to +25 | High impressions + CTR far below expected |

**Priority buckets:**
- **P1 Fix immediately:** Opp ≥75 OR (impr ≥500 & CTR <3%) OR (impr ≥300 & stuck page 2)
- **P2:** Opp ≥55 or impr ≥150
- **P3:** Opp ≥35 or modest traffic
- **Leave unchanged:** Low traffic, low commercial value, already adequate

**Deduped inventory:** 151 unique content paths after collapsing `#fragment` and `.html` variants. **P1 = 35**, P2 = 58, P3 = 54, Leave = 4.

## 0.6 Pattern findings (whole site)

### A. High impressions + low CTR (fix titles/metas first)

| Page (canonical path) | Impr | Clicks | CTR | Pos | Est. missed clicks* |
|-----------------------|------|--------|-----|-----|---------------------|
| `/blog/moringa-patches-australia-review-do-they-work` | 4,469 | 81 | 1.81% | ~6.1 | ~40–80 |
| `/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025` | 2,023 | 33 | 1.63% | 5.1 | ~68 |
| `/blog/moringa-and-berberine-australia-what-science-says-2026` | 1,668 | 25 | 1.50% | ~6.7 | ~31 |
| `/blog/rosabella-moringa-reviews-legit-or-overhyped-2026` | 1,522 | 33 | 2.17% | ~6.5 | ~15–25 |
| `/blog/how-long-does-moringa-powder-last-storage-shelf-life-2026` | 923 | 3 | **0.33%** | 6.6 | ~29 |
| `/blog/science-shade-drying-vs-sun-drying-moringa` | 918 | 12 | 1.31% | 6.8 | ~20 |
| `/blog/moringa-vs-coffee-melbourne-energy-hack` | 1,123 | 2 | **0.18%** | 8.3 | ~25 |
| `/blog/is-moringa-safe-for-children-kids-dosage-2026` | 1,288 | 6 | **0.47%** | 6.5 | ~30+ |
| `/blog/curry-leaves-substitute-what-to-use-2026` | 1,221 | **0** | **0%** | 10.1 | ~18 |

\*Missed clicks ≈ (expected CTR for position − actual CTR) × impressions. Directional only.

### B. High position + poor CTR

| Query | Pos | Impr | CTR | Problem |
|-------|-----|------|-----|---------|
| moringa chemist warehouse | 4.9 | 353 | 2.83% | Should be ~6%+ |
| moringa powder chemist warehouse | 5.5 | 320 | 1.25% | Severe under-click |
| chemist warehouse moringa | 4.2 | 60 | **0%** | Title/meta not matching |
| healrize australia | 4.0 | 69 | 1.45% | Patches page not named clearly enough in SERP |
| rosabella moringa chemist warehouse | 3.9 | 48 | 2.08% | Strong position, soft CTR |

### C. Low position + relatively higher CTR (worth pushing)

| Page/Query | Signal |
|------------|--------|
| Homepage pos ~12.4, CTR 2.86% | People click when they see brand; ranking is the bottleneck |
| `/products/moringa-powder/` pos ~17–22 | Transactional intent present; ranking gap |
| `how-to-add-moringa-to-diet` (24h pulse) | Higher CTR when shown — expand support |

### D. Queries stuck on page 2 (positions 11–20)

| Query | Impr | Pos | Dedicated page exists? | Action |
|-------|------|-----|------------------------|--------|
| curry leaves substitute | 112 | 12.0 | YES — but **0 clicks** | CTR + snippet rewrite |
| substitute for curry leaves | 77 | 11.0 | Same page | Same |
| ag1 alternative australia | 70 | 11.9 | YES (`ag1-alternative…`) | Strengthen title/H1 to exact query |
| moringa powder | 267 | 16.3 | Product + many blogs | **Pillar + product** ownership needed |
| moringa powder australia | 102 | 21.7 | Product | Product SEO overhaul |
| best greens powder australia | 57 | 20.0 | Page **410 Gone** | **Restore or 301 to live pillar** |
| best moringa powder | 30 | 19.7 | Multiple competing | Collapse to one buyer guide |
| curry leaves | 31 | 18.2 | Product page | Product SEO |

### E. Pages losing impressions / clicks (7d vs 28d run-rate)

| Page | Issue |
|------|-------|
| `is-moringa-safe-for-children-kids-dosage-2026` | Declining impressions + declining clicks |
| `moringa-vs-ashwagandha-comparison-2026` | Declining impressions, **0 clicks** |
| `moringa-and-berberine…` | Losing clicks while impressions relatively stable |
| `moringa-thyroid-hashimotos-hypothyroidism-2026` | Declining |
| `is-moringa-safe-during-pregnancy-2026` | Stuck page 2 + declining |

### F. Gaining impressions but not clicks

| Page | Impr | Clicks | Diagnosis |
|------|------|--------|-----------|
| `curry-leaves-substitute-what-to-use-2026` | 1,221 | 0 | Title/meta not winning SERP; list snippet opportunity unused |
| `what-does-moringa-powder-taste-like-honest-guide-2026` | 220 | 0 | Curiosity title failing; need sensory answer in meta |
| `moringa-vs-ashwagandha-comparison-2026` | 406 | 0 | Comparison SERP needs sharper “who should pick which” meta |
| `moringa-vs-spirulina-vs-matcha-comparison-australia` | 334 | 0 | Pos 11.4 + weak CTR package |
| `moringa-side-effects-what-happens-take-too-much-2026` | 200 | 0 | Fear/safety SERP — meta must lead with dosage safety |

### G. Pages competing with each other (GSC + content overlap)

See **Cannibalization Matrix** in Phase 1. Highest damage clusters:
1. Chemist Warehouse / Rosabella / Best brand (4–5 pages)
2. Is moringa banned? (**2 live pages**)
3. Moringa vs matcha / spirulina / greens (3+ pages + **410 greens URL still ranking**)
4. Powder vs capsules (2–3 pages)
5. `#fragment` URLs appearing as separate “pages” in GSC for patches & berberine

### H. Queries that need dedicated pages (or clear ownership)

| Query theme | Impr cluster | Recommendation |
|-------------|--------------|----------------|
| glorenda / healrize patch reviews | High within patches cluster | Keep **one** patches hub; add brand-named H2s + FAQ (already partly done — strengthen titles) |
| moringa capsules woolworths / coles / priceline | ~86+ | New section on CW page OR short “where to buy by retailer” page linking to product |
| does moringa have caffeine | 87 impr, 0 clicks | Own with BLUF FAQ block on coffee comparison page |
| can moringa cause miscarriage | 91 impr | Medical-careful FAQ on pregnancy page (not promotional) |
| buy moringa / buy moringa leaf powder | 66+36 | Product page must rank — not blog |

### I. Pages that should become pillar pages

| Pillar | Absorbs / links | Why |
|--------|-----------------|-----|
| **Buyer Quality Pillar** = `how-to-choose-moringa-powder-australia-2026` | brands comparison, heavy metals, shade drying, product | Only 184 impr / pos 9.6 today — under-powered for its role |
| **Retail Comparison Pillar** = Chemist Warehouse article | Rosabella review, brands ranked, product | Highest commercial intent cluster |
| **Safety Pillar** = ONE banned/legal page | pregnancy, kids, dogs, side effects | Stop duplicate banned URLs |
| **Superfood Comparison Pillar** = `moringa-vs-spirulina-vs-matcha…` | coffee, ashwagandha, AG1, (restore greens) | Page-2 stuck + 0 clicks |
| **Product Money Pillar** = `/products/moringa-powder/` | all commercial CTAs | Pos ~22 is the conversion bottleneck |

---

## 0.7 PRIORITY 1 — Fix immediately (deduped)

| # | Opp | Slug | Clicks | Impr | CTR | Pos | Trend | Why P1 |
|---|-----|------|--------|------|-----|-----|-------|--------|
| 1 | 100 | `moringa-patches-australia-review-do-they-work` | 81 | 4469 | 1.81% | 6.1 | Growing | #1 traffic page; CTR leak; fragment URL noise |
| 2 | 100 | `moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025` | 33 | 2023 | 1.63% | 5.1 | Stable | Core commercial; #3 in live SERP for CW query |
| 3 | 100 | `rosabella-moringa-reviews-legit-or-overhyped-2026` | 33 | 1522 | 2.17% | 6.5 | Growing | `.html` duplicate still impressing |
| 4 | 100 | `best-greens-powder-australia-2026` | 15 | 1005 | 1.49% | 6.5 | — | **410 Gone but still ranking** |
| 5 | 100 | `how-long-does-moringa-powder-last-storage-shelf-life-2026` | 3 | 923 | 0.33% | 6.6 | Growing | Extreme CTR failure |
| 6 | 100 | `science-shade-drying-vs-sun-drying-moringa` | 12 | 918 | 1.31% | 6.8 | Stable | EEAT differentiator under-clicked |
| 7 | 98 | `moringa-and-berberine-australia-what-science-says-2026` | 25 | 1668 | 1.50% | 6.7 | Losing clicks | High AI Overview potential; 0 images |
| 8 | 97 | `moringa-vs-coffee-melbourne-energy-hack` | 2 | 1123 | 0.18% | 8.3 | Growing | Huge impr, near-zero CTR; bloated |
| 9 | 97 | `is-moringa-safe-for-children-kids-dosage-2026` | 6 | 1288 | 0.47% | 6.5 | Declining | YMYL; CTR + trust packaging |
| 10 | 96 | `what-does-moringa-powder-taste-like-honest-guide-2026` | 0 | 220 | 0% | 7.9 | Growing | Zero-click high-pos |
| 11 | 94 | `moringa-vs-whey-protein-comparison-2026` | 6 | 229 | 2.62% | 4.3 | Growing | High pos, thin (~535 words) |
| 12 | 93 | `moringa-vs-ashwagandha-comparison-2026` | 0 | 406 | 0% | 9.3 | Declining | 0 clicks |
| 13 | 88 | `moringa-vs-spirulina-vs-matcha-comparison-australia` | 0 | 334 | 0% | 11.4 | Growing | Page 2 + 0 clicks |
| 14 | 87 | `how-to-choose-moringa-powder-australia-2026` | 2 | 184 | 1.09% | 9.6 | Stable | Should be buyer pillar |
| 15 | 84 | `/products/moringa-powder/` | 9 | 1083 | 0.83% | 22.0 | Growing | Money page buried |
| 16 | 84 | `/products/curry-leaves/` | 0 | 358 | 0% | 19.9 | — | Product + substitute cluster |
| 17 | 77 | `curry-leaves-substitute-what-to-use-2026` | 0 | 1221 | 0% | 10.1 | Growing | 0 clicks on 1.2k impr |
| 18 | 76 | `ag1-alternative-australia-moringa-comparison-2026` | 2 | 295 | 0.68% | 7.5 | — | Page-2 query support |
| 19 | 76 | `is-moringa-safe-during-pregnancy-2026` | 2 | 428 | 0.47% | 13.8 | Declining | YMYL page 2 |
| 20 | 76 | Homepage `/` | 22 | 770 | 2.86% | 12.4 | Stable | Missing canonical; pos 12 |
| 21 | 77 | `moringa-thyroid-hashimotos-hypothyroidism-2026` | 4 | 509 | 0.79% | 8.2 | Declining | Medical; weak CTR |
| 22 | 75 | `is-moringa-safe-for-dogs-…` | 5 | 341 | 1.47% | 8.7 | Losing clicks | Keep; improve CTR |
| — | — | `is-moringa-banned-australia-truth-2026` **AND** `is-moringa-banned-in-australia` | split | split | — | — | — | **Merge immediately** |
| — | — | Brand comparison cluster (3 pages) | — | — | — | — | — | Reposition (see Phase 1) |

## 0.8 Top queries needing action (28d)

| Query | Clicks | Impr | CTR | Pos | Intent | Action |
|-------|--------|------|-----|-----|--------|--------|
| moringa chemist warehouse | 10 | 353 | 2.83% | 4.86 | Commercial | Title rewrite on CW page |
| moringa powder chemist warehouse | 4 | 320 | 1.25% | 5.46 | Commercial | Same + powder vs capsules table in SERP-facing intro |
| moringa patches | 3 | 178 | 1.69% | 5.5 | Commercial | Keep patches hub primary |
| moringa patches reviews | 2 | 159 | 1.26% | 7.6 | Commercial | Lead meta with “do they work? No clinical evidence…” |
| moringa capsules chemist warehouse | 4 | 154 | 2.60% | 4.64 | Commercial | CW page owns this |
| curry leaves substitute | 0 | 112 | 0% | 12.0 | Informational | Meta + list snippet |
| moringa powder australia | 0 | 102 | 0% | 21.7 | Commercial/local | Product page |
| does moringa have caffeine | 0 | 87 | 0% | 9.8 | Informational | Coffee page FAQ BLUF |
| can moringa cause miscarriage | 0 | 91 | 0% | 9.0 | YMYL | Pregnancy page careful FAQ |
| healrize reviews / glorenda patch reviews | 0 | 80+ | 0% | ~6–9 | Commercial | Named in title (already partly); strengthen |
| best greens powder australia | 0 | 57 | 0% | 20 | Commercial | Restore dead URL strategy |
| buy moringa | 0 | 66 | 0% | 20.1 | Transactional | Product |

---

# PHASE 1 — SITE-WIDE ARCHITECTURE & CANNIBALIZATION AUDIT

## 1.1 Architecture snapshot

| Surface | Status | Issue |
|---------|--------|-------|
| Blog | ~100+ HTML articles | Over-production without clear pillar → spoke map |
| Categories | `/blog/category/{guides,health,pets,tea}/` | In sitemap; thin hub risk if not curated |
| Products | moringa, curry leaves, tea, soap, combo | Money pages weak in GSC vs blogs |
| Local pages | melbourne, sydney, brisbane, perth, adelaide | Present; not in top GSC pages — low ROI currently |
| Archives/tags/search | Limited | OK if noindex where appropriate |
| XML sitemap | Present, auto-built | Includes category URLs; verify no 410 URLs remain listed |
| robots.txt | Allows Google + major AI bots; blocks labs/audit/scripts | Good for AI retrieval |
| llms.txt | Strong product + guide index | Good; keep updated when merging pages |
| Canonicals | Mostly present on blogs | **Homepage missing `<link rel="canonical">`** |
| Redirects | Extensive 301/410 cleanup already done | Some 410s still receiving impressions; `.html` still leaking |

## 1.2 Critical technical architecture bugs

### Bug A — 410 URL still earning impressions
- `/blog/best-greens-powder-australia-2026` → **410** in `_redirects`
- Still: **~1,005 impressions, 15 clicks, avg pos ~6.5–13**
- **Google interpretation:** Soft-404/410 not fully dropped; historical relevance remains
- **AI interpretation:** May still cite stale snapshots; live fetch fails → trust drop
- **Fix (pick one):**
  1. **Preferred:** Restore a real “Best greens powder Australia” article that honestly ranks greens AND positions single-ingredient moringa (not fake #1 spam), OR
  2. 301 to `moringa-vs-spirulina-vs-matcha-comparison-australia` **only if** that page’s H1/intro explicitly answers “best greens powder” with a decision table
- **Priority:** Critical  
- **Impact:** Recovers ~1k impr/mo of demand currently wasted on a dead URL

### Bug B — Fragment URLs in GSC as separate pages
Patches page alone shows 7 URLs (`#tga`, `#science`, `#brands`, etc.) totaling **+1,005 extra impressions with 0 clicks**.
- **Fix:** Ensure `rel=canonical` ignores fragments (already should); add `<!--` no separate indexing — mainly ensure internal links don’t promote fragment-only landing in sitemaps; use GSC URL Removal for non-canonical if needed; prefer `#` links that don’t appear in crawlable menus as standalone
- **Impact:** Cleaner signals, less diluted CTR reporting

### Bug C — `.html` duplicates still impressing
Examples: Rosabella `.html` (382 impr / 2 clicks), best-greens `.html`, coffee `.html`
- Redirects exist (`301!` .html → pretty), but GSC still shows lag
- **Fix:** Request indexing on canonical; monitor 28–56 days; ensure sitemap lists **only** pretty URLs

### Bug D — Wrong historical redirects for retail intent
These 301 to **product** instead of comparison content (intent mismatch):
- `moringa-at-chemist-warehouse-australia-worth-it-2026` → `/products/moringa-powder/`
- `where-to-buy-moringa-australia-chemist-warehouse-…` → product
- `top-moringa-companies-australia-2026` → product
- **Why wrong:** Query intent is investigation/comparison; product page does not answer “does CW sell X / is it worth it?”
- **Fix:** Point these to CW comparison or brands comparison pillars
- **Impact:** Recover retail-investigation equity currently dumped on a transactional URL Google ranks ~pos 22

### Bug E — Homepage missing canonical
- `index.html` has **no** canonical tag in audit extract
- **Fix:** Add `https://nutrithrive.com.au/`

---

## 1.3 COMPLETE CANNIBALIZATION MATRIX

### C1. Keyword cannibalization — “Is moringa banned in Australia?”
| Pages | Severity | Google struggle | AI struggle | Recommendation |
|-------|----------|-----------------|-------------|----------------|
| `is-moringa-banned-australia-truth-2026` | **Critical** | Two near-identical H1s compete | Models may cite conflicting recall details | **Merge** → keep `is-moringa-banned-in-australia` as recall-focused canonical (stronger FSANZ/recall framing) OR keep truth-2026 if fresher; **301 the other** |
| `is-moringa-banned-in-australia` | Critical | Same | Same | One page only |

**Action:** Merge → Redirect → Update llms.txt to single URL.  
**Do not keep separate.**

### C2. Commercial cannibalization — Chemist Warehouse / Rosabella / Best brand
| Page | Role today | Verdict |
|------------------|---------|
| `moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025` | “Does CW sell moringa?” + quality | **KEEP as Retail Comparison Pillar** |
| `rosabella-moringa-reviews-legit-or-overhyped-2026` | Brand review deep-dive | **KEEP** but strip overlapping CW-stock tables; link to CW pillar |
| `moringa-brands-comparison-australia-2026` | 7 brands ranked (~7k words) | **REPOSITION** as “Best moringa brand Australia” pillar; reduce Rosabella duplicate sections to summary + link |
| `moringa-brands-reviewed-australia-2025-verdict` | Sensory bag-opening story | **MERGE or 301** into brands comparison methodology section |
| `best-rated-moringa-capsules-powders-australia-2026-ultimate-guide` | Mega-guide sprawl | **REWRITE/narrow** OR 301 into choose-guide + brands pillar |

**Severity:** Critical  
**Why Google struggles:** Same entities (Rosabella, CW, NutriThrive, lab tests, price/100g) repeated → unclear which URL is authoritative.  
**Why AI struggles:** Conflicting rankings/dates across pages → lower citation confidence.  
**CTA cannibalization:** All hard-sell NutriThrive similarly — OK if each page has a distinct job, harmful if intros are interchangeable.

### C3. Semantic cannibalization — Superfood / greens comparisons
| Pages | Issue | Action |
|-------|-------|--------|
| `moringa-vs-spirulina-vs-matcha-comparison-australia` | Primary 3-way | **KEEP pillar** |
| `best-superfoods-australia-comparison-health-conscious-adults` | Overlaps heavily | Reposition to broader lifestyle OR merge key tables into pillar |
| `moringa-vs-matcha-energy-metabolism-2026` | Already 301’d to 3-way in redirects? (check live) — GSC still shows impr | Ensure 301 complete |
| `spirulina-vs-moringa-vs-matcha-gut-health-…` | Redirect target exists | Confirm 301 |
| `best-greens-powder-australia-2026` | **410 but ranking** | Restore or 301 to pillar with greens H2 |
| `ag1-alternative-australia-moringa-comparison-2026` | Adjacent commercial | **KEEP separate** (different primary keyword) |

### C4. Search-intent cannibalization — Powder vs capsules
| Pages | Action |
|-------|--------|
| `moringa-powder-vs-capsules-comparison-2026` | **KEEP** as form-comparison owner |
| `moringa-capsules-vs-powder-which-is-better-2026` | Already redirects → good |
| Sections inside choose-guide + best-rated + CW page | Trim duplicate “powder vs capsules” essays; keep 1 short table + link |

### C5. Title / H1 cannibalization
| Pattern | Pages | Fix |
|---------|-------|-----|
| “Is Moringa Banned in Australia?” | 2 | Merge |
| “Best Moringa… Australia 2026” | brands comparison + best-rated capsules | Differentiate: Brand ranking vs Capsule/powder shopping guide |
| “Rosabella… Chemist Warehouse” in multiple titles | CW + Rosabella + brands | Rosabella title should drop “Chemist Warehouse Verdict” or CW page should own CW phrase exclusively |

### C6. FAQ / comparison-table / definition duplication
Across patches, berberine, Rosabella, CW, banned pages:
- Repeated Salmonella recall paragraphs
- Repeated “leaf not root” safety lines
- Repeated “shade-dried vs sun-dried” mini-essays
- Repeated NutriThrive price CTAs

**Fix rule:** One **canonical explanation** per entity fact; all other pages get 2–3 sentences + link.  
**Severity:** High for EEAT originality; Medium for rankings alone.

### C7. Internal-link / anchor cannibalization
Many blogs use similar anchors: “lab-tested moringa”, “shop moringa powder”, “Chemist Warehouse”.  
**Fix:** Diversify anchors by intent:
- Quality → “how we read a CoA”
- Price → “$11/100g shade-dried powder”
- Retail → “what Chemist Warehouse actually stocks”
- Safety → “leaf-only, not root/bark”

### C8. Entity cannibalization without new information
Rosabella + recall + CW price appears on ≥4 URLs.  
**AI effect:** Retrieval systems pick a random URL; citation share splits; none become the “default source.”

### C9. AI-content / intro / conclusion sameness (observable patterns)
Common template across many 2026 posts:
- “By Neer, NutriThrive Truganina · Last updated…”
- Quick Answer box
- FAQ schema
- Soft product CTA

Template is good for consistency; **problem** is interchangeable first 100 words on commercial pages. Differentiate hooks with unique primary evidence (photo of opened capsule, CoA screenshot, taste notes, dose maths).

---

# PHASE 2 — PAGE-BY-PAGE TECHNICAL + CONTENT AUDITS (PRIORITY PAGES)

> Format for each page: What’s wrong → Why → Google → AI → Exact fix → Priority → Impact.  
> Title rewrite sets: 10 options + best pick.

---

## PAGE A — `/blog/moringa-patches-australia-review-do-they-work`
**GSC 28d:** 81 clicks / 4,469 impr / 1.81% CTR / pos ~6.1 | **Opp 100 | P1**

### What’s wrong
1. Title **89 characters** — truncates before “Glorenda, Healrize” (the query modifiers that win clicks).
2. Meta **183 characters** — over-long; truncates mid-value.
3. CTR 1.81% at pos ~6 vs ~3.5% expected.
4. 6 fragment URLs collecting impressions with **0 clicks**.
5. Only **1 external** high-authority science link in audit sample — light for a “scientifically unproven” claim page.
6. Competing in SERPs against YouTube/Trustpilot (Firecrawl AU search), not just blogs.

### Why / Google / AI
- Google: Title truncation kills brand-name query CTR (glorenda/healrize).
- AI: Strong BLUF exists (“no published human clinical evidence”) — **quote-worthy**. Weak if evidence links are thin.

### Title — current score: **4/10** (accurate, too long, weak SCR)

**10 rewrites:**
1. Moringa Patches Australia: Do Glorenda & Healrize Work?
2. Do Moringa Patches Work? Glorenda, Healrize Review (AU)
3. Moringa Patches Review AU: Science Says Unproven
4. Glorenda & Healrize Patches: Do They Work in Australia?
5. Moringa Weight Loss Patches AU — Evidence Check 2026
6. Are Moringa Patches a Scam? Australia Review
7. Moringa Patches vs Powder: Why Patches Lack Evidence
8. Healrize & Glorenda Moringa Patches Reviewed (Australia)
9. Transdermal Moringa Patches: What TGA Status Means
10. Moringa Patches Australia — Honest Verdict + Brand Table

**Best:** `#2` or `#8` (names the brands users type; ≤60 chars preferred)  
**Recommended best:** `Do Moringa Patches Work? Glorenda & Healrize (Australia)`

### Meta — rewrite options
1. `Glorenda, Healrize and Clearena patches lack human evidence for moringa delivery through skin. Compare patches vs powder, TGA notes, and safer oral options in Australia.`
2. `Do moringa patches work? We review Glorenda & Healrize claims, transdermal science, and when powder makes more sense. Australia 2026.`
3. `Honest AU review: moringa patches are scientifically unproven for weight loss. Brand table, risks, and powder alternative.`

**Best:** #1 (entities + verdict + comparison)

### H1
Keep one H1; shorten to match best title. Remove duplicate “2026” stacking if title already has year.

### Structure / AI readiness
- Keep BLUF + Patches vs Powder table (high snippet + AI citation value).
- Add: numbered “What happens if you buy anyway” risks; photo of actual patch packaging (original).
- Add FAQ targeting exact GSC queries: “moringa weight loss patches chemist warehouse”, “are moringa patches safe”.

### CRO
Trust before sell is good. CTA should be “Prefer evidence-backed oral leaf powder” not generic Shop Now mid-fear content.

### Priority: Critical | Impact: CTR +20–60% possible on this URL; largest traffic lever on site

---

## PAGE B — `/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025`
**GSC:** 33c / 2023i / 1.63% CTR / pos 5.09 | Live SERP ~#3 for “moringa chemist warehouse”

### What’s wrong
1. Title 72c — starts with question (good) but weak on CTR emotion; year in slug says 2025 while title says 2026.
2. CTR 1.63% at pos ~5 — expected ~5–6%.
3. Overlaps Rosabella + brands pages (commercial cannibalization).
4. Filename/slug still `…2025` — looks stale vs competitors.

### Exact fixes
- **Slug:** Keep (don’t break links) but ensure title/H1 never feel outdated; optionally add 301 from a cleaner alias later.
- Own CW queries exclusively; trim deep Rosabella essay → link to Rosabella page.
- Add comparison table as first screen element: Brand | Form | Price | Lab public? | Dose to clinical range | Verdict.
- Add retailer FAQs: Woolworths/Coles/Priceline capsules (GSC demand).

### Title score: 5/10

**10 rewrites:**
1. Does Chemist Warehouse Sell Moringa? 2026 Stock + Quality
2. Chemist Warehouse Moringa: Brands, Price & Lab Reality
3. Moringa at Chemist Warehouse vs Lab-Tested Powder
4. CW Moringa Capsules Review: Rosabella, Indus Farms & More
5. Chemist Warehouse Moringa Worth It? Price per 100g Test
6. What Moringa Does Chemist Warehouse Actually Stock?
7. Chemist Warehouse Moringa vs NutriThrive (Side-by-Side)
8. Buy Moringa at Chemist Warehouse? Read This First
9. Rosabella at Chemist Warehouse: Dose Maths & Recall Notes
10. Chemist Warehouse Moringa Australia — Honest Comparison

**Best:** `#2` or `#5`  
**Pick:** `Chemist Warehouse Moringa: Brands, Price & Lab Reality`

### Meta best:
`Yes — Chemist Warehouse stocks moringa capsules (e.g. Rosabella, Indus Farms). See 2026 prices, dose maths, recall notes, and how lab-tested powder compares.`

### Priority: Critical | Impact: Highest commercial intent CTR lift on site

---

## PAGE C — `/blog/rosabella-moringa-reviews-legit-or-overhyped-2026`
**GSC:** 33c / 1522i / 2.17% CTR / pos ~6.5 | `.html` variant still 382i

### What’s wrong
- Title 90c — severe truncation.
- Competitor SERPs dominated by Athletic Insight / YouTube / Reddit (Firecrawl) — your AU-local lab angle is differentiator but may not be winning international SERP packaging.
- Overlap with CW + brands pages.

### Title score: 4/10

**Best title:** `Rosabella Moringa Review AU: Recall, Cost & Lab Gaps`  
**Best meta:** `Is Rosabella legit? Real capsules, TikTok hype, Feb 2026 Salmonella recall, cost per month vs powder, and who should skip it.`

### Fix: Force `.html` out of index; differentiate from CW page; keep unique opened-capsule observations (EEAT gold).

### Priority: Critical | Impact: CTR + brand-investigation share

---

## PAGE D — `/blog/best-greens-powder-australia-2026` (**410**)
**GSC:** 15c / 1005i / still ranking

### What’s wrong
Page is **deleted (410)** while Google still shows it for “best greens powder australia”.

### Exact fix
1. Decide within 48 hours: **Restore** or **301**.
2. If restore: publish a real ranked guide with methodology, disclose NutriThrive conflict, include moringa as single-ingredient alternative — match Wallaby Wellness / ABC-style clarity competitors use.
3. If 301: target must answer greens query in H1 + first 100 words + comparison table.
4. Remove from any remaining sitemaps; use GSC “Validate fix”.

### Priority: Critical | Impact: Stop wasting ~1k impressions; recover greens cluster

---

## PAGE E — `/blog/how-long-does-moringa-powder-last-storage-shelf-life-2026`
**GSC:** 3c / 923i / **0.33% CTR** / pos 6.6

### What’s wrong
Extremely low CTR despite solid position and good on-page BLUF (“12 to 24 months unopened…”).  
Title 74c; meta 183c — packaging failure, not content failure.

### Title score: 3/10 (answer buried)

**10 rewrites:**
1. How Long Does Moringa Powder Last? 12–24 Months
2. Moringa Powder Shelf Life: 12–24 Months (Storage Guide)
3. Does Moringa Powder Expire? Pantry Rules That Matter
4. Moringa Powder Expiry: Opened vs Unopened
5. How to Store Moringa Powder in Australian Heat
6. Moringa Going Brown or Musty? When to Replace It
7. Shelf Life of Moringa Powder (AU Storage Guide)
8. How Long Is Moringa Powder Good For Once Opened?
9. Moringa Powder Lasts 6–24 Months — Here’s the Split
10. Moringa Storage Guide: Fridge? Freezer? Pantry?

**Best:** `#1` or `#9`  
**Meta best:** `Unopened moringa powder typically lasts 12–24 months; opened 6–12 months if cool, dark, dry. Signs it’s past peak + Australian humidity tips.`

### Priority: Critical (quick win) | Impact: Potentially 5–10× clicks from same impressions

---

## PAGE F — `/blog/science-shade-drying-vs-sun-drying-moringa`
**GSC:** 12c / 918i / 1.31% CTR / pos 6.8

### What’s wrong
Title soft (“Quality Guide”) — doesn’t promise a verdict. This is your unique EEAT moat (Truganina shade-dry process) under-sold in SERP.

### Best title: `Shade-Dried vs Sun-Dried Moringa: Colour, Taste, Nutrients`  
### Best meta: `Shade-dried moringa usually stays greener and milder; hard sun-drying often browns leaf. What to check on the label before you buy in Australia.`

Add: original process photos + simple nutrient-retention table citing literature (you already have external links — elevate them).

### Priority: High | Impact: CTR + topical authority for buyer guide internal links

---

## PAGE G — `/blog/moringa-and-berberine-australia-what-science-says-2026`
**GSC:** 25c / 1668i / 1.50% CTR / pos ~6.7 | Losing clicks | **0 images**

### What’s wrong
- Strong YMYL/AI Overview topic.
- No images (audit).
- Fragment URL clutter.
- Must visually separate “can take together” vs “berberine drug interactions”.

### Exact fixes
- Add interaction callout table (drug classes).
- Add 1 diagram: pathways side-by-side.
- Title shorten; lead with safety.
- **Best title:** `Moringa and Berberine Together: Safety, Evidence, Interactions`  
- Cite TGA/NPS or peer-reviewed sources more visibly.

### Priority: High | Impact: AI Overview citation + CTR; protect YMYL trust

---

## PAGE H — `/blog/moringa-vs-coffee-melbourne-energy-hack`
**GSC:** 2c / 1123i / **0.18% CTR** / pos 8.3 | 26 H2s | ~4800 words

### What’s wrong
- Massive CTR failure.
- Content bloat / Melbourne coffee-price digressions dilute primary intent “moringa vs coffee energy / caffeine”.
- Slug “energy-hack” feels clickbait vs helpful-content bar.
- Schema includes LocalBusiness geo clutter atypical for a comparison article.

### Exact fixes
- **Rewrite scope:** Cut to decision-first comparison; move Melbourne coffee economics to appendix or separate local post.
- Target GSC query `does moringa have caffeine` in H2 + FAQ.
- **Best title:** `Moringa vs Coffee for Energy: Caffeine, Crash & Nutrients`  
- **Best meta:** `Coffee = caffeine spike. Moringa = caffeine-free nutrients. Side-by-side for energy, sleep, and who should pick which in Australia.`

### Priority: Critical content trim | Impact: CTR recovery on 1k+ impr; better AI chunking

---

## PAGE I — `/blog/is-moringa-safe-for-children-kids-dosage-2026`
**GSC:** 6c / 1288i / 0.47% CTR / pos 6.5 | Declining

### What’s wrong
YMYL page with good schema (HowTo + Speakable) but SERP CTR failure; disclosure is good EEAT.

### Best title: `Is Moringa Safe for Children? Age Dosage & GP Guide`  
### Best meta: `Food-level leaf powder can be used in small amounts for kids; root/bark is different. Age-by-age amounts, iron notes, and when to ask your GP.`

Medical reviewer note: Keep leaf-only emphasis; avoid disease claims; prefer paediatric citations already linked.

### Priority: High | Impact: CTR + trust; stop decline

---

## PAGE J — `/blog/curry-leaves-substitute-what-to-use-2026`
**GSC:** **0c / 1221i / 0% CTR** / pos 10.1

### What’s wrong
Content quality looks solid (ratios, “never curry powder”) but **zero clicks**. Classic SERP packaging miss + page-2.

### Exact fixes
- Title already list-oriented — push into **list snippet** format in first 40 words.
- **Best title:** `Curry Leaves Substitute: 7 Swaps (Avoid Curry Powder)`  
- **Best meta:** `No curry leaves? Use kaffir lime (1 per 4–6 leaves), lemon zest, or dried curry leaves at 1.5×. Why curry powder fails as a substitute.`
- Add HTML `<ol>` of substitutes immediately after BLUF.
- Internal link from product curry leaves page.

### Priority: Critical quick win | Impact: From 0 → measurable clicks on 1.2k impr

---

## PAGE K — `/products/moringa-powder/`
**GSC:** 9c / 1083i / 0.83% CTR / pos **22** | Product snippets sitewide pos 21.3

### What’s wrong
1. Money page buried on page 2+ for head terms.
2. Product snippet CTR 0.44% sitewide — price/availability/review markup or trust signals not winning.
3. ~768 words — thin vs educational competitors ranking for “moringa powder australia”.
4. Blog cluster outranks product for commercial queries (sometimes OK) but product must win “buy/moringa powder australia”.

### Competitor gap (Firecrawl: “moringa powder australia”)
Herb Cottage, Propel Health, Forever Foods, Moringa Products AU, Amazon, Coles outrank you. They win with:
- Clear organic/collection merchandising
- Category depth
- Retail familiarity (Coles/Amazon)

### Exact fixes
- Expand unique PDP content: CoA screenshot, shade-dry story, dose, taste, vs CW capsules table (link out).
- Review schema / AggregateRating accuracy (must be genuine).
- Improve title already decent (`Buy Moringa Powder Australia | $11/100g | NutriThrive`) — keep price in title (CTR asset).
- Fix product snippet eligibility issues (shipping, return, price currency AUD).
- Build internal links FROM all P1 blogs with varied anchors TO this URL (not only soft CTAs).

### Priority: Critical | Impact: Conversion + transactional rankings

---

## PAGE L — Homepage `/`
**GSC:** 22c / 770i / 2.86% CTR / pos 12.4

### What’s wrong
- Missing canonical.
- Pos ~12 for brand-ish discovery; CTR actually OK.
- Needs stronger entity clarity for AI (Organization already in schema — good).

### Fix: Add canonical; tighten hero to brand + one proof (NMI lab) + one CTA; ensure sitelinks targets are clean.

### Priority: High technical | Impact: Brand SERP cleanliness

---

## PAGE M — Banned pair (merge)
See Phase 1 C1. **Do not audit as two long-term pages.**

---

## PAGE N — `/blog/moringa-vs-spirulina-vs-matcha-comparison-australia`
**GSC:** 0c / 334i / pos 11.4

### What’s wrong
0 clicks; page 2; long title (80c); good depth (~4465 words) wasted.

### Best title: `Moringa vs Spirulina vs Matcha: Which Powder Wins?`  
### Fix: Move comparison table above fold; cut Parts 1–2 fluff if “understanding moringa” repeats buyer guide; absorb greens query.

### Priority: High | Impact: Unlock comparison cluster + greens 301 target

---

## PAGE O — `/blog/how-to-choose-moringa-powder-australia-2026`
**GSC:** 2c / 184i / pos 9.6 — **under-powered pillar**

### What’s wrong
This should be the buyer brain of the site but gets less visibility than patch memes. Internal link equity is insufficient.

### Fix: Make this the hub: every commercial article links here for “quality checks”; add 2026 price snapshot table; target “best moringa powder australia” carefully without creating another best-of clone.

### Priority: High | Impact: Structural SEO + conversion assist

---

## Cross-page technical checklist (all audited pages)

| Check | Common finding |
|-------|----------------|
| One H1 | Generally OK on sampled pages |
| Title length | Many 70–90c — **systemic CTR drag** |
| Meta length | Many >160c — **systemic** |
| FAQ schema | Present on most blogs — good; avoid duplicate Qs sitewide |
| Images | Berberine page 0 images; brands comparison 3 missing alt |
| External links | Often 1–6; YMYL pages need more primary sources |
| Video | Generally missing — YouTube competitors win patches/Rosabella SERPs |
| Homepage canonical | Missing |
| Open Graph | Present on many; verify matches rewritten titles after changes |

---

# PHASE 3 — COMPETITOR GAP MATRIX (KEY QUERIES)

## Query: “moringa chemist warehouse”
| Competitor type | What they have | NutriThrive gap |
|-----------------|----------------|-----------------|
| CW product PDPs | Live stock, price, add-to-cart | You can’t beat CW for navigational “buy on CW” — win the **investigation** SERP |
| NutriThrive CW article (#3) | Quality test narrative | CTR package weak; slug dated 2025 |
| Instagram noise | Visual | Need original capsule photos in SERP preview strategy (OG image) |

## Query: “rosabella moringa australia review”
| Competitor | Gap vs you |
|------------|------------|
| Athletic Insight reviews | Long-form experience narrative, ranking globally |
| YouTube / Reddit | First-person video & community proof |
| Your page | Stronger AU recall + lab transparency angle — **under-distributed**; title truncated |

## Query: “moringa patches”
| Competitor | Gap |
|------------|-----|
| YouTube reviews | Video Object / watch time SERP takeover |
| Trustpilot brand pages | Review entity results |
| Your page | Best science-led AU page in set — needs video embed + shorter title + brand names visible in SERP |

## Query: “best greens powder australia”
| Competitor | What they provide |
|------------|-------------------|
| Wallaby Wellness | Ranked list + categories (best overall, wholefood, etc.) |
| ABC News | Expert EEAT |
| ASN / retailers | Shopable collections |
| NutriThrive | **410 page still ranking** — catastrophic gap |

## Query: “moringa powder australia”
| Competitor | Gap |
|------------|-----|
| Herb Cottage / Forever Foods / Organic Moringa AU | Category + organic merchandising |
| Coles / Amazon | Default retail trust |
| NutriThrive PDP | Pos ~22; needs content depth + review volume + links |

---

# PHASE 4 — AI & LLM OPTIMIZATION

## Likelihood of citation (directional)

| Page | AI Overview | Gemini | ChatGPT Search | Perplexity | Bing Copilot |
|------|-------------|--------|----------------|------------|--------------|
| Patches review | **High** if BLUF stays crisp + sources | High | High | High | Medium |
| CW comparison | Medium-High | Medium | Medium | High (AU shopping) | Medium |
| Rosabella review | Medium | Medium | Medium | High | Medium |
| Berberine combo | **High** (safety) | High | High | High | Medium |
| Kids safety | High (with medical caution) | High | Medium | High | Medium |
| Shelf life | High (definitional) | High | High | High | High |
| Coffee vs moringa | Medium (after trim) | Medium | Medium | Medium | Low |
| Product PDP | Low-Medium | Low | Low | Medium | Medium |
| Dead greens URL | Negative | Negative | Negative | Negative | Negative |

## What AI systems want more of (sitewide)
1. **Atomic answer blocks** (40–60 words) immediately under H2 questions matching queries.
2. **Tables** with units (mg, AUD/100g, months shelf life).
3. **Explicit entities:** TGA, FSANZ, NMI, Rosabella, Chemist Warehouse, Glorenda, Healrize, Moringa oleifera leaf.
4. **Primary evidence:** CoA images, batch IDs, photos of opened products.
5. **Clear disagreements with hype** (already a brand strength — keep).
6. **One canonical URL per fact** so retrieval doesn’t split.

## Quote-worthy paragraphs already on site (preserve/tighten)
- Patches: “no published human clinical evidence” for transdermal moringa.
- Shelf life: 12–24 months unopened / 6–12 opened.
- Banned: “Not banned; recall ≠ ban”.
- Choose guide: bright green + leaf-only + shade-dried + batch CoA.

## Sections AI likely ignores
- Melbourne coffee price essays on coffee-vs-moringa page.
- Emoji-heavy TOC blocks on brands mega-guide.
- Repeated CTA paragraphs without new facts.
- Duplicate recall essays after the first canonical explanation.

---

# PHASE 5 — IMPLEMENTATION BLUEPRINTS (NO FULL REWRITE HERE)

## Blueprint 1 — Patches page (developer/content)
**Remove/merge:** Redundant CTA repeats; collapse duplicate “what is a patch” if repeated.  
**Rewrite:** Title, meta, H1; first 80 words to include Glorenda + Healrize + verdict.  
**New H2s:** `Do Glorenda patches work?` / `Do Healrize patches work?` / `Moringa patches at Chemist Warehouse`  
**New table:** Brand | Claim | Evidence | Approx price | Verdict  
**New media:** 1 original packaging photo; 1 optional explainer video embed + VideoObject  
**Schema:** Keep FAQ; add Question entities for brand names  
**Internal links:** → berberine page; → product powder; → CW page (for retail)  
**CRO:** Mid-article “If you want actual moringa compounds, use oral leaf powder” with CoA proof

## Blueprint 2 — CW page
**Rewrite:** Title/meta; slug stays.  
**New table above fold:** CW stock list 2026.  
**Trim:** Long Rosabella duplicate → link.  
**Add FAQs:** Woolworths / Coles / Priceline capsules.  
**Fix redirects:** Point old CW blog URLs here, not to PDP.  
**OG image:** Side-by-side capsule vs powder

## Blueprint 3 — Merge banned pages
**Keep:** `is-moringa-banned-in-australia` (recall timeline)  
**301:** `is-moringa-banned-australia-truth-2026` → keep  
**Port unique TGA advertising clarifications** from truth page into kept page as H2  
**Update:** sitemap, llms.txt, internal links

## Blueprint 4 — Greens 410 recovery
**Option A restore** with methodology + conflict disclosure  
**Option B 301** to spirulina/matcha/moringa pillar after adding H2 `Best greens powder Australia: how to choose` + ranked criteria table

## Blueprint 5 — Shelf life / substitute / taste zero-CTR trio
**Only change:** Title + meta + first list/table for snippets (under 30 min each)

## Blueprint 6 — Coffee page diet
**Remove:** Long Melbourne price narrative (or split to `/blog/melbourne-coffee-prices-2026`)  
**Keep:** Caffeine comparison table, decision tree, FAQ including “does moringa have caffeine”  
**Reduce** H2 count from 26 → ~12

## Blueprint 7 — Product PDP
**Add sections:** Lab testing (with image), how to use, taste, who it’s for, vs CW capsules, storage link, shipping/returns  
**Schema:** Validate Product + Offer + Shipping + Return in Rich Results Test  
**Reviews:** Increase genuine review acquisition (snippet CTR)

## Blueprint 8 — Cannibalization ops
| Cluster | Owner URL | Others |
|---------|-----------|--------|
| CW retail | CW article | Summaries + link |
| Rosabella brand | Rosabella review | Summaries + link |
| Best brand ranking | brands-comparison | 301 sensory review into it |
| Banned/legal | one banned URL | 301 sibling |
| Form powder vs caps | powder-vs-capsules | Trim copies |
| 3-way superfoods | spirulina-matcha-moringa | 301/merge greens |

---

# PHASE 6 — MASTER PRIORITY ROADMAP

## Critical (do this week)

| Task | Type | Pages | Why | Expected benefit | Dependency |
|------|------|-------|-----|------------------|------------|
| Resolve greens **410** (restore or 301) | Technical + Content | best-greens | Dead URL ranking | Recover ~1k impr intent | Decision |
| Merge banned pages | Content + Redirect | 2 banned URLs | Cannibalization | Consolidate legal queries | Pick canonical |
| Rewrite titles/metas for top CTR failures | Content | Patches, CW, shelf life, substitute, coffee, kids, Rosabella | Truncation + weak SERP | CTR | None |
| Fix old CW URLs 301 → CW article not PDP | Technical | `_redirects` | Intent mismatch | Equity to right URL | None |
| Add homepage canonical | Technical | `/` | Index hygiene | Cleaner brand signals | None |
| Product snippet investigation | Technical/CRO | PDP + offers | 0.44% CTR on 1804 impr | Commercial clicks | Schema validate |

## High impact (next 2 weeks)

| Task | Type | Pages | Benefit |
|------|------|-------|---------|
| Reposition brands cluster (1 pillar + 1 Rosabella + 1 CW) | Content IA | 3–5 URLs | Less cannibalization |
| Trim coffee page | Content | coffee vs moringa | CTR + AI chunking |
| Expand PDP unique content + CoA media | Content/Design | product | Rankings + CVR |
| Add images to berberine page | Design | berberine | Engagement + AI |
| Internal link sprint → choose-guide + PDP | Internal linking | All P1 | Pillar strength |
| Record 1 patches explainer video | Content/EEAT | patches | Compete with YouTube SERPs |

## Medium impact

| Task | Pages | Benefit |
|------|-------|---------|
| Strengthen ashwagandha / spirulina-matcha titles | 0-click comparison pages | First clicks |
| Pregnancy page push (YMYL careful) | pregnancy | Page 2 → 1 |
| AG1 page title exact-match | ag1-alternative | Page 2 queries |
| Curry leaves PDP SEO | product curry leaves | Capture substitute → buy |
| Remove emoji TOC patterns on mega guides | brands comparison | Helpful content polish |

## Low impact / later

| Task | Notes |
|------|-------|
| Local city pages push | Low GSC share now |
| Darjeeling cluster expansion | Secondary product line |
| Speakable expansion | Only where voice answers matter |

## Quick wins (<30 minutes each)

1. Shelf life title/meta  
2. Curry substitute title/meta + `<ol>`  
3. Taste page title/meta (220 impr, 0 clicks)  
4. Homepage canonical  
5. Rosabella title shorten  
6. Patches title with Glorenda/Healrize visible in first 50 characters  
7. GSC: inspect canonical patches URL; monitor fragment URLs  
8. Confirm sitemap excludes 410 URLs  

## Task type index

### Content tasks
Title/meta rewrites; banned merge; coffee trim; greens restore; PDP copy; FAQ additions matching GSC queries.

### Technical tasks
Redirect fixes; canonical; sitemap hygiene; rich results validation; fragment/index cleanup; `.html` monitoring.

### Design tasks
OG images for CW/patches/Rosabella; CoA screenshots; process photos; berberine diagram.

### Developer tasks
`_redirects` updates; schema JSON-LD adjustments; optional VideoObject; ensure 301! consistency.

### Schema tasks
Validate Product snippets; keep FAQ unique; avoid MedicalWebPage unless clinically supervised; retain Person/Organization.

### Internal linking tasks
All commercial posts → choose-guide + PDP; safety posts → single banned canonical; comparisons → 3-way pillar.

### EEAT tasks
Original photos; batch CoA; founder packing notes; disclose conflicts (already good on kids page — replicate); medical caution blocks.

### AI search tasks
Answer blocks; tables; entity coverage; one-URL-per-fact; update `llms.txt` after merges.

### CRO tasks
Trust-before-CTA on hype-busting articles; price in PDP title (keep); shipping/returns visibility; review acquisition for snippet CTR.

---

# APPENDIX A — Opportunity score leaderboard (top 35 P1, deduped)

See Phase 0.7 table.

# APPENDIX B — Evidence limits (what we did NOT guess)

1. **No Search Console query→page mapping export** was provided — query ownership inferred from URL themes + SERP checks, not click attribution.
2. **No 3–6 month GSC history** — seasonality not claimed.
3. **No analytics/CRO conversion rates** — conversion impact is directional from commercial intent, not revenue-proven.
4. **Competitor word counts / full on-page audits** limited to SERP presence via Firecrawl search (not full scrapes of every competitor article).
5. **best-greens** content cannot be audited on-page because file is gone (410).
6. Pixel-perfect title width not measured in browser; character counts used as proxy.

---

# APPENDIX C — 30-day success metrics (measure these)

| KPI | Baseline (28d) | 30-day target (directional) |
|-----|----------------|-----------------------------|
| Site CTR | 1.17% | ≥1.8% |
| Patches CTR | 1.81% | ≥3.0% |
| CW page CTR | 1.63% | ≥3.5% |
| Shelf life CTR | 0.33% | ≥2.5% |
| Substitute CTR | 0% | ≥2.0% |
| Product snippet CTR | 0.44% | ≥1.5% |
| `/products/moringa-powder/` avg pos | ~22 | ≤12 |
| Indexed 410 impressions | ~1005 | ~0 |
| Banned URL count live | 2 | 1 |

---

**End of master audit report.**  
**File location:** `untitled folder 2/MASTER-SEO-AI-EEAT-AUDIT-REPORT-2026-07-22.md`

Next implementation step when you want it: execute Critical roadmap items (redirects + title/meta quick wins + banned merge) directly in the repo.
