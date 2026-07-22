# Hypothesis Evaluation — Evidence Only
**Standard:** ✅ Correct · ⚠ Partially Correct · ❌ Incorrect  
**Rule:** Do not agree unless website / GSC / HTML evidence supports it.  
**Date:** 22 July 2026

---

# Hypothesis 1
## “The blogs are good enough but not unique.”

### Classification: ⚠ Partially Correct

### WHY
“Good enough” and “not unique” are different claims. Evidence supports **both, but only for subsets of the blog**, not the whole library.

### What is unique (examples)

| Page | Unique / first-party material |
|------|-------------------------------|
| `science-shade-drying-vs-sun-drying-moringa` | Claims Truganina shade-dry process (~7–8 days under mesh) — competitor blogs rarely have operator process detail |
| `moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025` | Claims they bought Rosabella, opened capsules, observed brown/oxidised powder; dose maths vs clinical range |
| `moringa-patches-australia-review-do-they-work` | AU-specific ARTG/TGA framing + Glorenda/Healrize/Clearena brand cards + patches vs powder cost table |
| `is-moringa-banned-in-australia` | Recall timeline tied to Rosabella / CW / FSANZ (distinct angle from generic “is X banned”) |

### What is “good enough but not unique”

| Page | Evidence |
|------|----------|
| `moringa-vs-ashwagandha-comparison-2026` | ~1,350 words; Quick Answer is competent; **zero science outbound links** (only fonts/redditstatic). Paragraph: *“Both are ancient plants with modern wellness followings…”* — interchangeable with any wellness site. GSC: **0 clicks / 406 impr** |
| Many template posts | Shared shell: Quick Answer box → Key Takeaways → FAQ schema → soft product line. Structure is fine; differentiation is thin when the body lacks proprietary data |
| Duplicate banned pair | Two pages both answer “is it banned?” with overlapping legality paragraphs — uniqueness diluted by self-competition |

### How they should change (only where uniqueness is the actual gap)
- Keep unique operator pages; **stop publishing more generic “vs” explainers** until each has either (a) primary measurement, (b) cited trials, or (c) AU retail fieldwork.
- For ashwagandha-class pages: add citations + a decision artifact you alone own (e.g. “what we tell customers who ask for stress vs iron”).
- Do **not** rewrite unique pages into longer generic encyclopedias.

---

# Hypothesis 2
## “The pages don't prove their claims.”

### Classification: ⚠ Partially Correct

### WHY
Some pages prove claims; some assert without verifiable proof. Blanket “the pages don’t prove claims” is false.

### Claims that ARE supported on-site

| Claim | Proof present | Where |
|-------|---------------|-------|
| NMI batch screening | PDF `documents/nutrithrive-lab-report-summary.pdf` linked; batch note `NT042024` | PDP + patches table/product cards |
| Kids dosage / research framing | Multiple NCBI/DOI hrefs | `is-moringa-safe-for-children-kids-dosage-2026` |
| CW stocks Rosabella / Indus Farms | Stated with disclaimer ranges change; FAQ schema | CW article (price freshness not independently re-verified this session) |

### Claims that are NOT adequately proven

| Claim (quote / paraphrase) | Page | Missing proof | Where it should appear |
|----------------------------|------|---------------|------------------------|
| “zero published peer-reviewed studies examining the transdermal bioavailability of moringa leaf compounds in humans” | Patches | No PubMed/DOI links; no description of search method (databases/dates) | Immediately under that sentence: link to search or key papers on oral moringa + note on absence of transdermal hits |
| “Australian searches for moringa patches increased by over 4,000%” | Patches (§ What Are Moringa Patches?) | No Google Trends screenshot, no source, no date range graphic | Under the sentence: Trends embed or cited export image |
| “multiple well-designed human trials” for ashwagandha cortisol | Ashwagandha comparison | **No external research links at all** | Under ashwagandha definition H2 |
| “Moringa Is Perfect for Adrenal Health” (H2) | Coffee page | Strong physiological claim; page is promotional/lifestyle | Either cite or **remove/rename** H2 — “adrenal” language overreaches |
| Opened Rosabella powder was brown/oxidised | CW article | Text claims first-hand test; hero is a **smoothie bowl**, not the opened capsule photo | Beside the test section: original photo of bottle + opened powder + date purchased |
| AggregateRating `4.9` / `reviewCount: 47` | PDP schema | Only **3** reviews rendered in `#reviews` | Either show 47 reviews or align schema to visible count (integrity issue) |

### Documents / images / data needed (by type)
- **Documents:** full CoA (or clear summary of limits for Pb/Cd/microbes), not only a short summary PDF if making “every batch” claims.
- **Images:** opened competitor capsule; patch packaging if reviewed; shade-dry racks; warehouse pack line.
- **Data:** Trends screenshot; dose maths spreadsheet assumptions; lab numeric table on-page (not only PDF).

---

# Hypothesis 3
## “Commercial content appears too early.”

### Classification: ⚠ Partially Correct

### WHY
True on **some** high-traffic review pages; false as a sitewide rule.

### Pages where commercial appears early / heavy

**`moringa-patches-australia-review-do-they-work`**
1. BLUF + Quick Answer first — **good** (non-commercial).
2. Comparison table includes NutriThrive column with NMI link — commercial entity in evidence table (acceptable if labelled).
3. **`nt-soft-cta` immediately after that table** (“Compare NutriThrive powder”) — **early relative to science/brands sections still below**.
4. Later: **two** `nt-blog-product-card` blocks + sidebar Shop + **`nt-sticky-mobile-cta`**.

Disclosure (`nt-disclosure`) appears **after** the first product card — late relative to first soft CTA.

### Pages where commercial is NOT too early

| Page | Evidence |
|------|----------|
| `moringa-vs-ashwagandha-comparison-2026` | Product mention near end: “If daily nutrients… See product details” |
| `curry-leaves-substitute-what-to-use-2026` | Shop signals ≈ 0 in HTML audit |
| Kids safety | Disclosure early; citations heavy; product not the lead |

### Where CTAs should move (patches only — evidenced problem page)
- Keep BLUF / science / brand cards **CTA-free**.
- Soft text link OK after `#science` or `#berberine-risk`.
- Single product card at `#verdict` only.
- Sticky mobile CTA: remove or gate until scroll past science (trust-before-sell).
- Move disclosure **above** first product recommendation.

**Ranking harm from early CTAs:** Not enough evidence (page ranks ~6 with most clicks). **Trust/CRO risk:** observable structure issue.

---

# Hypothesis 4
## “The blogs lack first-hand experience.”

### Classification: ⚠ Partially Correct

### WHY
Several posts claim experience; fewer **show** it. Some posts have none.

### Pages WITH claimed experience

| Page | Claimed experience | Gap |
|------|-------------------|-----|
| CW quality test | Bought & opened Rosabella | Missing dated photo of that test |
| Shade-drying | Operator process in Truganina | Could add process photos / drying-day notes |
| Patches | Disclosure: daily experience with powder quality, not patches | No “we purchased Glorenda/Healrize on [date]” fieldwork |
| Banned truth page | Emails after viral posts; TGA/FSANZ review for labelling | Stronger as narrative; still light on artifacts |

### Pages LACKING first-hand experience

| Page | Evidence |
|------|----------|
| Ashwagandha comparison | No “we tried both for N weeks”; no customer-ops anecdotes; generic mechanisms |
| Coffee “Adrenal Challenge” | Challenge format without measured before/after data |
| Many symptom posts (anxiety, cholesterol, etc.) | Literature-style; fine if cited — currently often thin on both experience *and* citations |

### What could realistically be added (and where)
- **CW page:** photo block under “What We Found When We Opened…”
- **Patches:** one purchased pack photo under each brand card OR state clearly “we did not purchase; evaluation is regulatory/science-only”
- **Shade-dry:** 2–3 process photos in “From tree to tub”
- **Do not fake** first-hand patch trials if they weren’t done.

---

# Hypothesis 5
## “Trust is weak.”

### Classification: ⚠ Partially Correct (leaning unfair as a blanket)

### WHY
Trust signals exist and are stronger than a typical thin affiliate site. Gaps remain — especially visual proof and review integrity.

### Trust signals PRESENT

| Signal | Evidence |
|--------|----------|
| Lab testing | NMI summary PDF; PDP lab card; linked from blogs |
| Author | “By Neer, NutriThrive Truganina”; `author-bio.js` injects bio + TGA disclaimer on v2 blogs |
| Business location | Truganina / Melbourne repeated; geo meta on PDP |
| Shipping / returns | Schema OfferShippingDetails + returnPolicyUrl |
| Disclosure | Explicit on patches, CW, kids |
| Visible reviews | 3 named reviews on PDP |

### Trust signals WEAK or MISSING

| Signal | Evidence of gap |
|--------|-----------------|
| Full certificate readability | Summary PDF only (3.5KB file — short); no on-page numeric limits table |
| Warehouse / packing photos | Claimed Truganina packing; few/no dedicated warehouse images on PDP hero path |
| Manufacturing / farm chain | Sourcing story lighter than lab claim |
| Review integrity | Schema `reviewCount: 47` vs **3** on-page reviews — mismatch undermines trust if noticed by users or systems |
| Author credentials | Explicitly “not a health professional” (honest) — fine for food; weak for YMYL medical-adjacent pages unless citations carry the load |
| AI-named image assets in repo | Files like `ChatGPT Image…`, `Gemini_Generated_Image…` exist under `assets/images/blog/` — even if not linked in current HTML, stock/AI imagery in the library is a trust smell if used |

### Exact missing items (priority)
1. Align review count in schema with visible reviews **or** publish the full set.  
2. On-page lab numbers (Pb/Cd/etc.) + PDF.  
3. Real process/warehouse photos on PDP and shade-dry article.  
4. Dated competitor-test photos on CW page.

---

# Hypothesis 6
## “The content sounds AI generated.”

### Classification: ⚠ Partially Correct

### WHY
Not every page. Pattern templates + some lifestyle pages show generic AI/marketing cadence. Top investigation pages are more specific.

### Paragraphs / passages that sound generic (with WHY)

**1. Ashwagandha page**
> “Both are ancient plants with modern wellness followings. Both get recommended for energy and stress.”  
**Why:** Bilateral parallel structure, no concrete observation, could introduce any two herbs.

**2. Ashwagandha Quick Answer mechanics**
> “Many people take both because the mechanisms do not conflict.”  
**Why:** Smooth, hedged, citation-free; typical LLM safety phrasing without naming a study.

**3. Coffee page H2s**
> “Why Moringa Is Perfect for Adrenal Health” / “Creamy Moringa Adrenal Latte” / “7-Day Adrenal Challenge”  
**Why:** Absolute “Perfect”, branded ritual naming, challenge funnel — marketing-LLM hybrid, not measured experience.

**4. Shared template chrome (sitewide)**
Repeated “Quick Answer” / “Key Takeaways” / “Last updated” blocks — **not automatically AI**, but when body underneath is thin, the whole page reads mass-produced.

### What does NOT sound AI (counter-evidence)
- Patches BLUF distinguishing “unregulated marketing” vs “proven fraud”
- CW dose maths ($0.22 vs $2.08/day)
- Substitute table “Never use” curry powder row
- Kids page with DOI links + commercial disclosure

### Rewrite strategy only (do not rewrite yet)
1. Delete parallel “Both are… Both…” openers; replace with a single concrete decision.  
2. Ban absolute medical marketing H2s (“Perfect for Adrenal”) unless cited.  
3. Require ≥1 primary artifact per commercial comparison (photo, receipt date, CoA row, Trends capture).  
4. Keep template Quick Answer only if the answer contains a number, entity, or falsifiable claim.

---

# Hypothesis 7
## “Internal linking is weak.”

### Classification: ⚠ Partially Correct

### WHY
**Product linking is strong. Topical cluster linking is uneven. Several important URLs are orphans.**

### Hard graph evidence (from HTML href crawl)
- Blog pages analysed: **98**
- **Orphans (0 inbound links from other site pages): 22**
- `/products/moringa-powder` inbound ≈ **90** → **not weak**
- `/blog/how-to-choose-moringa-powder-australia-2026` inbound **34** → solid hub
- `/blog/moringa-patches-australia-review-do-they-work` inbound only **3** → **weak for the #1 traffic page**
- `/blog/curry-leaves-substitute-what-to-use-2026` inbound **0** → orphan **and** 1,221 GSC impr / 0 clicks

### Sample orphans (high relevance)
- `curry-leaves-substitute-what-to-use-2026`
- `moringa-brands-comparison-australia-2026`
- `best-rated-moringa-capsules-powders-australia-2026-ultimate-guide`
- `is-moringa-safe-for-dogs-…`
- `where-to-buy-moringa-in-australia-…`
- Multiple darjeeling / lifestyle posts

---

## Topical cluster map

### Cluster A — Buy / Quality (commercial core)
| Role | URL |
|------|-----|
| **Parent (hub)** | `/blog/how-to-choose-moringa-powder-australia-2026` |
| **Money parent** | `/products/moringa-powder/` |
| Children | shade-drying · heavy-metals lab testing · shelf-life · powder vs capsules · taste · how-to-add-to-diet · worth-it cost |
| Related retail | CW comparison · Rosabella review |
| **Missing / broken** | Live “best greens” URL (410) · single “best brand” owner (brands-comparison currently orphan) |
| **Linking fix** | Every child → choose-guide + PDP; patches/CW/Rosabella → choose-guide |

### Cluster B — Retail investigation
| Role | URL |
|------|-----|
| **Parent** | `/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025` |
| Children | Rosabella review · banned/recall explainer (ONE page) · where-to-buy |
| **Problem** | brands-comparison + best-rated capsules compete / orphaned |
| **Missing** | Woolworths/Coles/Priceline stock notes as H2s or short child |

### Cluster C — Patches / berberine hype
| Role | URL |
|------|-----|
| **Parent** | patches review |
| Child | berberine science |
| **Problem** | Parent has only ~3 inbound — cluster not reinforced from rest of site |
| **Missing** | Glorenda-only / Healrize-only are better as H2s than new URLs |

### Cluster D — Safety / YMYL
| Role | URL |
|------|-----|
| **Parent (should be ONE)** | banned/legal canonical |
| Children | pregnancy · kids · dogs · side-effects · thyroid |
| **Problem** | Two banned parents; dogs orphan |

### Cluster E — Superfood comparisons
| Role | URL |
|------|-----|
| **Parent** | moringa vs spirulina vs matcha |
| Children | ashwagandha · coffee · AG1 · whey |
| **Problem** | Several children orphan/weak; coffee overgrown; greens 410 |

### Cluster F — Curry leaves
| Role | URL |
|------|-----|
| **Parent** | `/products/curry-leaves/` + culinary hub (tradition-health) |
| Children | substitute · fresh vs dried · vs curry powder · storage · cooking |
| **Problem** | **substitute is orphan** despite demand; product curry-leaves 0 clicks @ pos ~20 |

### Orphan handling rule
Orphans are not automatically “bad content”; they are **undiscoverable internally**. Priority orphans to link first: substitute, brands-comparison, patches (inbound), dogs, where-to-buy.

---

# Hypothesis 8
## “CTR is poor because titles do not match search intent.”

### Classification: ⚠ Partially Correct

### WHY
Intent mismatch explains **some** query-level CTR failures. It does **not** explain the sitewide CTR story, and **title length ≠ CTR** on your own cohort (see prior Search Quality investigation).

### Cases that SUPPORT the hypothesis

| Query (GSC) | Pos | CTR | Current title (page) | Why title/snippet can lose |
|-------------|-----|-----|----------------------|----------------------------|
| `chemist warehouse moringa` | 4.17 | **0%** | `Does Chemist Warehouse Sell Moringa? Brand and Quality Comparison (2026)` | Query is retail-nav; title is a long question; CW’s own PDPs likely dominate the attractive SERP row |
| `healrize australia` | 4.01 | 1.45% | Patches title 89 chars — **Healrize near the end** | Brand token may truncate in SERP |
| `rosabella moringa australia` | 3.53 | **8.43%** | Rosabella title leads with Rosabella | **Counter-example proving match helps when brand is front-loaded** |

### Cases that DO NOT support “titles don’t match intent”

| Page | Pos | CTR | Why title-intent is a weak explanation |
|------|-----|-----|----------------------------------------|
| Shelf life | 6.56 | 0.33% | Title literally matches “how long does moringa powder last” + includes 12–24 months |
| Shade-drying | 6.75 | 1.31% | Short, clear title (49 chars) — still middling CTR |
| Substitute | 10.10 | 0% | Title matches substitute intent; **position ~10** is the larger factor |
| Patches | 6.37 | 2.34% | Best CTR in cohort despite longest title |

### Competing titles (observed via Firecrawl, not claimed as full SERP)

| Query | Competitor-style titles | Ours |
|-------|-------------------------|------|
| Shelf life | “Does Moringa Powder Expire?” | “How Long Does Moringa Powder Last? 12 to 24 Months Shelf Life Guide (2026)” |
| Substitute | “The Best Simple Curry Leaves Substitutes” (Stonesoup) | “7 Best Curry Leaves Substitutes (What to Use and What to Avoid) (2026)” |
| Patches-related | YouTube outcome/brand titles | Long AU/scam/brands stack |

### Improvements justified only where match is evidenced weak
- Front-load **Healrize/Glorenda** on patches title (query evidence).  
- For CW inverted query `chemist warehouse moringa`, test title starting with **Chemist Warehouse Moringa**.  
- Do **not** run a sitewide “shorten all titles” project as a CTR fix — cohort data contradicts that mechanism.

**Still required:** Page × Query export before declaring more title winners.

---

# Hypothesis 9
## “The pages are not structured well for AI Overview.”

### Classification: ⚠ Partially Correct (often ❌ for the best pages)

### WHY
Many Priority pages **already** use AI-friendly patterns (BLUF, FAQ schema, tables). Failures are citation gaps, sprawl, and duplication — not absence of structure.

### What AI CAN extract today (good)
- Patches: “no published human clinical evidence…” in BLUF  
- Shelf life: 12–24 / 6–12 months in Quick Answer + FAQ  
- Substitute: kaffir lime ratio in Quick Answer + table  
- Kids: cited mechanisms (when links resolve)

### What AI cannot reliably extract / trust
| Gap | Evidence |
|-----|----------|
| Verifiable “no studies exist” | Assertion without linked search proof (patches) |
| Which banned URL is canonical | Two competing pages |
| Coffee page’s single answer | Buried under ~26 H2s / duplicate FAQs / adrenal marketing |
| Greens query | 410 page — nothing to extract |
| Ashwagandha trial claims | No sources to ground a citation |

### Structure improvements (only where needed)
- Keep Quick Answer; **attach citations beside scientific absolutes**.  
- Coffee: one comparison spine (caffeine table + decision tree + one FAQ).  
- One URL per fact-cluster (banned, greens).  
- Prefer tables with units already present on patches/substitute — replicate that pattern on weak pages.

**Do not claim** pages “aren’t structured for AI Overview” as a general verdict — patches/shelf/substitute **are**.

---

# Hypothesis 10
## “Product pages don't build enough trust.”

### Classification: ⚠ Partially Correct

### WHY
PDP already includes several strong trust elements. It still fails competitively (GSC pos ~22) and has a **review-count integrity gap**. “Don’t build enough trust” overstates absence; understates **proof visibility + consistency**.

### Proof PRESENT on `/products/moringa-powder/`
- NMI lab card + PDF link + batch `NT042024`
- Shade-dried / pure leaf / serving copy
- Shipping + returns in schema
- 3 visible reviews (James H., Chris L., Lisa K.)
- Link out to CW comparison test
- Price in title ($11/100g) — clear offer

### Proof MISSING or WEAK
| Gap | Detail |
|-----|--------|
| Review schema vs UI | `reviewCount: 47` in JSON-LD vs 3 reviews shown |
| On-page lab numbers | PDF exists; numeric heavy-metal table not in HTML body |
| Process photography | Product pack shots yes; warehouse/shade-dry line rarely shown on PDP |
| Competitive context above fold | CW comparison linked in about section — could be a trust table earlier |
| Breadth vs retailers | Competitors win SERP with category/retail familiarity — trust ≠ only certificates |

### How products should demonstrate quality
1. Show **lab numbers on-page** + PDF.  
2. Show **pack + powder colour** (and optionally vs browned competitor — with disclosure).  
3. Fix **review count honesty**.  
4. Keep food-not-medicine positioning (already good).  

### What to add
- Visible CoA metrics table  
- Process/warehouse image strip  
- Full review list or corrected aggregate  
- “What’s in the bag / what’s not” checklist above the fold  

### What to remove
- Nothing major evidenced as harmful copy  
- Do **not** remove NMI/lab claims — strengthen them  
- Remove or fix inflated aggregate review count if 47 cannot be shown

### Ranking caveat
Pos ~22 is **not proof** that trust copy alone is the blocker. Competition, links, brand, and assortment also matter. **Not enough evidence** that trust fixes alone move the PDP to page 1.

---

# SCOREBOARD

| # | Hypothesis | Verdict |
|---|------------|---------|
| 1 | Blogs good enough but not unique | ⚠ |
| 2 | Pages don’t prove claims | ⚠ |
| 3 | Commercial content too early | ⚠ |
| 4 | Lack first-hand experience | ⚠ |
| 5 | Trust is weak | ⚠ |
| 6 | Sounds AI generated | ⚠ |
| 7 | Internal linking weak | ⚠ |
| 8 | Poor CTR because titles ≠ intent | ⚠ |
| 9 | Not structured for AI Overview | ⚠ (often ❌ on best URLs) |
| 10 | Product pages lack trust | ⚠ |

**None of the ten are ✅ Correct as absolute sitewide statements.**  
**None are ❌ Incorrect as having zero supporting examples** — except Hypothesis 9 is close to ❌ for patches/shelf/substitute specifically.

### Cross-cutting truth the hypotheses understate
The strongest evidenced problems are still: **410 URL in results**, **duplicate banned URLs**, **orphan high-impression pages (substitute)**, **uncited scientific absolutes on patches**, **reviewCount mismatch on PDP**, and **patches under-linked despite being #1 traffic** — not a single slogan like “AI content” or “weak trust.”
