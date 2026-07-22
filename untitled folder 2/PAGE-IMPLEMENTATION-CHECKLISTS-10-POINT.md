# NutriThrive — Page Implementation Checklists
**Format:** Your 10-point framework → Cursor-ready tasks  
**Date:** 22 July 2026  
**Use with:** `MASTER-SEO-AI-EEAT-AUDIT-REPORT-2026-07-22.md`

How to use: each page has a **numbered checklist**. Every item follows:

`Current Problem → Why Google cares → Exact change → Where → Suggested wording → Priority → Expected benefit`

---

# PAGE 1 — Moringa Patches Review
**URL:** `/blog/moringa-patches-australia-review-do-they-work`  
**GSC 28d:** 81 clicks · 4,469 impr · **1.81% CTR** · pos ~6.1

---

## 1. Search Intent

| Question | Answer |
|----------|--------|
| What is the user trying to achieve? | Decide whether Glorenda / Healrize / Clearena patches are worth buying (and whether they work for weight loss). |
| Answer in first 30–60 seconds? | **Yes** — red BLUF + Quick Answer already say unproven / use oral powder. |
| Title expectations | “Scam or not?” + brand reviews + Australia 2026 |
| Content fulfills? | Mostly yes — science, brands, table, TGA. Title over-promises “scam” while body softens to “unregulated marketing, not proven fraud” — slight expectation mismatch. |

**Hidden intents from GSC:** weight-loss patches at Chemist Warehouse; Glorenda/Healrize named reviews; “are patches safe.”

---

## 2. Why Google Is Hesitating (actual reasons)

1. **Better competitor SERP formats for brand queries** — YouTube/Trustpilot win “Glorenda/Healrize review” with video + review-entity results; your page is a text science review.
2. **Weak first-hand product handling proof** — Strong science claims, but no original photo of an opened Glorenda/Healrize pack you purchased.
3. **Missing named H2s for brand queries** — Brands appear in cards/FAQ, but SERP/AI prefer explicit H2s: “Do Glorenda patches work?”
4. **Too much product promotion relative to investigation intent** — Soft CTA + **2 product cards** + sidebar + **sticky mobile CTA**. For “do they work?” that can look commercially skewed.
5. **Fragment URL dilution** — GSC shows `#tga`, `#science`, `#brands` etc. as separate impression rows (0 clicks).
6. **Title truncated before brand names** — Glorenda/Healrize sit after the fold of the SERP title.

Not the issue: topical thinness, missing comparison table, missing FAQ schema (those are already strong).

---

## 3. Why Users Don't Click

| | |
|--|--|
| **Head queries** | moringa patches · moringa patches reviews · glorenda · healrize · weight loss patches CW |
| **Current title** | `Moringa Patches Australia 2026: Do They Work or Is It a Scam? (Glorenda, Healrize Review)` — **89 chars** |
| **Current meta** | 183 chars — truncates mid-sentence |
| **Competing titles** | YouTube: “Do Weight Loss Patches Actually Work?” · “Glorenda… Real Weight Loss Results” — shorter, outcome-led, brand-first |
| **Mismatch** | Searcher types a **brand or “do they work”**; SERP shows a long AU/year/scam title that truncates **before** Glorenda/Healrize |

**One-word / structural CTR fix:** Put **Glorenda & Healrize** in the first 45–55 characters. Drop “Australia 2026” from the front.

---

## 4. Why Users Don't Buy (after click)

| Factor | Finding |
|--------|---------|
| Trust | Strong science BLUF. Sticky “Shop Now” before finish reading can feel pushy. |
| Pitch timing | Product card appears mid-article + again at verdict + sticky mobile — **early for skeptical readers**. |
| Objections | Handled well (TGA, berberine interactions, placebo). |
| Proof | Dose maths + table good; **missing your own purchased-patch photo / receipt date**. |
| Reviews | One buyer quote for powder — OK; not for patches (correct — you didn’t sell patches). |

---

## 5. Why AI May Not Prefer It as #1 source

| Check | Status |
|-------|--------|
| Direct extractable answer? | **Yes** — BLUF is citation-ready |
| Unique evidence? | Partial — science synthesis strong; **no primary patch lab test of your own** |
| Retrieval structure? | Good (H2s, FAQ, table) |
| Original vs recycled? | Better than affiliate spam; still needs **primary photo/test** to beat YouTube anecdotes |

---

## 6. What to Remove

| Remove | Why |
|--------|-----|
| One of the two near-identical `nt-blog-product-card` blocks (keep final verdict card only) | Reduces promo density on investigation intent |
| Sticky mobile CTA until user scrolls past `#science` (or remove entirely on this URL) | Trust-before-sell |
| “Australia 2026” stacking in title + H1 + meta | Truncation / filler |
| Duplicate “Quick Answer” restating BLUF almost verbatim | Keeps BLUF; merge into one answer block |

---

## 7. What to Add

| Add | Why it helps |
|-----|--------------|
| H2: `Do Glorenda patches work?` | Matches GSC brand queries |
| H2: `Do Healrize patches work?` | Same |
| H2: `Moringa weight loss patches at Chemist Warehouse` | Matches exact GSC query cluster |
| Original photo of purchased pack (even if you conclude “don’t buy”) | First-hand EEAT |
| Short `<ol>` “3 checks before buying any patch” | Snippet + AI |
| FAQ entry: `Are Glorenda moringa patches safe?` | GSC / AI |

---

## 8. Competitor Gap

| What top results share | What none cover well | NutriThrive opportunity |
|------------------------|----------------------|-------------------------|
| Anecdotal “I tried for 4 weeks” | Peer-reviewed transdermal gap stated clearly | **You already own science** |
| Weight-loss hype | TGA/ARTG status in AU | Keep / lead with this |
| Video | Honest “patches vs powder cost/day” table | You have it — surface in title/meta |
| — | Named AU brand comparison with regulatory status | Become the **default AU citation** |

---

## 9. Technical SEO (relevant only)

| Item | Status | Action |
|------|--------|--------|
| Canonical | Correct pretty URL | Keep |
| Schema | BlogPosting + FAQ + Breadcrumb | Keep; add brand FAQ names |
| OG image | Generic moringa OG | Replace with patches-specific or brand-pack shot |
| Internal links | OK to powder / berberine | Add → CW page only if discussing retail patches |
| Fragments | GSC noise | Don’t list fragment URLs in sitemap; prefer in-page anchors only |

---

## 10. Implementation Plan (Cursor checklist)

### P1-A1 — Title rewrite
- **Current Problem:** 89-char title truncates before Glorenda/Healrize; CTR 1.81% at pos ~6.
- **Why Google cares:** CTR is a ranking/engagement signal; truncated titles hide query-matching tokens.
- **Exact change:** Replace `<title>` and mirror in H1 (shorter) + `og:title` + schema `headline`.
- **Where:** `blog/moringa-patches-australia-review-do-they-work.html` head + H1.
- **Suggested wording:**
  - Title: `Do Moringa Patches Work? Glorenda & Healrize (Australia)`
  - H1: `Do Moringa Patches Work? Glorenda, Healrize & Clearena Review`
- **Priority:** Critical  
- **Expected benefit:** CTR lift on brand + “do they work” queries.

### P1-A2 — Meta rewrite
- **Current Problem:** Meta 183 chars truncates.
- **Why Google cares:** Truncated meta loses CTA + brands.
- **Exact change:** Cap ~150–155 chars; lead with verdict + brands.
- **Where:** `<meta name="description">` + og/twitter descriptions.
- **Suggested wording:** `Glorenda & Healrize patches lack human evidence for skin delivery. Compare vs oral powder, TGA/ARTG status, and cost per day — Australia.`
- **Priority:** Critical  
- **Expected benefit:** Higher SERP click-through.

### P1-A3 — Reduce promo density
- **Current Problem:** 2 product cards + sticky CTA on a skepticism query.
- **Why Google cares:** Helpful Content / commercial bias on “review” intent.
- **Exact change:** Keep soft mid CTA text; remove mid-article product card; keep one end card; disable sticky CTA on this page.
- **Where:** Same HTML — `nt-blog-product-card` (first), `#nt-sticky-mobile-cta`.
- **Priority:** High  
- **Expected benefit:** Trust, time-on-page, conversion quality (not spam clicks).

### P1-A4 — Brand H2s + photo
- **Current Problem:** Brand queries underserved in heading structure; weak first-hand proof.
- **Exact change:** Add 2–3 H2s; add one original image with descriptive alt.
- **Where:** After “Main Brands” section.
- **Priority:** High  
- **Expected benefit:** Brand SERP relevance + AI extractability + EEAT.

---

# PAGE 2 — Chemist Warehouse vs NutriThrive
**URL:** `/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025`  
**GSC:** 33c · 2,023i · **1.63% CTR** · pos 5.1 · live SERP ~#3 for “moringa chemist warehouse”

---

## 1. Search Intent

User wants: **Does CW sell moringa, which brand, is it any good, should I buy there or elsewhere?**  
First 60s: **Yes** (Quick Answer).  
Title expectation: stock answer + comparison.  
Fulfillment: Strong — but slug still says **2025** while title says 2026 (trust friction).

---

## 2. Why Google Is Hesitating

1. **CW product PDPs own navigational “buy at CW”** — you correctly compete for investigation; don’t try to outrank CW for add-to-cart.
2. **Commercial cannibalization** with Rosabella review + brands comparison pages (same entities/recall/price maths).
3. **Hero image is a smoothie bowl**, not CW shelf / Rosabella bottle you tested — weak visual EEAT for a “we bought and tested” claim.
4. **Slug dated 2025** signals stale asset vs 2026 SERP.
5. **CTR far below expected** for position ~5 (expected ~5–6%, actual 1.63%).

---

## 3. Why Users Don't Click

| | |
|--|--|
| Query | `moringa chemist warehouse` / `moringa powder chemist warehouse` / `moringa capsules chemist warehouse` |
| Your title | `Does Chemist Warehouse Sell Moringa? Brand and Quality Comparison (2026)` |
| Competitor titles | CW: product names + price · Your angle is question-led (good) but soft on **price/dose drama** |
| Why CTR low | Title answers “do they sell?” (yes/no) but searchers often want **which brand + is it worth it**; meta is long; doesn’t lead with “Rosabella $24.99 / dose maths” |

**CTR lever:** Lead with **Chemist Warehouse Moringa** + **price/lab** not only the yes/no question.

---

## 4. Why Users Don't Buy

Trust is decent (disclaimer + recall box). Pitch to NutriThrive is clear via dose maths ($0.22 vs $2.08/day) — **this is your best CRO asset**.  
Gap: hero doesn’t show the opened brown powder you describe — readers must trust text alone.

---

## 5. Why AI

Highly citable Quick Answer + FAQ. Split citation risk with Rosabella page (duplicate recall). Prefer **one recall canonical** linked from here.

---

## 6. What to Remove

| Remove / trim | Why |
|---------------|-----|
| Long Rosabella deep-dive that duplicates `/rosabella-…` page | Cannibalization |
| Repeated dose maths paragraphs (keep one table) | Redundancy |
| “Research Guide” badge if page is commercial investigation | Intent clarity |

---

## 7. What to Add

| Add | Why |
|-----|-----|
| Above-fold stock table: Brand · Form · Typical price · Lab public? · Notes | Snippet + CTR after click |
| FAQ: Woolworths / Coles / Priceline capsules (GSC demand) | Query coverage |
| Photo of Rosabella bottle you bought + opened powder | First-hand proof |
| Link-out: “Full Rosabella review →” instead of repeating | Authority consolidation |

---

## 8. Competitor Gap

| Common in top results | Missing elsewhere | Your wedge |
|-----------------------|-------------------|------------|
| Live CW prices | Independent dose-to-clinical-range maths | **Keep & lead** |
| Product specs | Salmonella recall explained without panic | Keep |
| — | Side-by-side powder vs CW capsule for Australians | Own this SERP type |

---

## 9. Technical

| Item | Action |
|------|--------|
| Canonical | Keep pretty URL |
| Redirects | Point old CW blogs **here**, not to PDP (`_redirects`) |
| Slug 2025 | Don’t break URLs; ensure title/H1 never feel outdated |
| Schema | FAQ good; ensure image caption matches real test narrative |

---

## 10. Implementation checklist

### P1-B1 — Title / meta
- **Problem:** CTR 1.63% at pos 5.1.
- **Change title to:** `Chemist Warehouse Moringa: Brands, Price & Lab Reality`
- **Change meta to:** `Yes — CW stocks Rosabella & Indus Farms capsules. 2026 prices, dose maths, recall check, and how lab-tested powder compares.`
- **Where:** `<title>`, H1 (can stay question-form shorter), meta, og.
- **Priority:** Critical · **Benefit:** CTR

### P1-B2 — Redirect fix
- **Problem:** Old CW URLs 301 → product (wrong intent).
- **Change:** 301 → this article.
- **Where:** `_redirects` lines for `moringa-at-chemist-warehouse…`, `where-to-buy-moringa-australia-chemist…`, `top-moringa-companies…`
- **Priority:** Critical · **Benefit:** Equity to ranking URL

### P1-B3 — Trim Rosabella duplication + add stock table
- **Priority:** High · **Benefit:** Less cannibalization, better AI canonical clarity

### P1-B4 — Replace hero with proof photo
- **Priority:** High · **Benefit:** EEAT / conversion trust

---

# PAGE 3 — Shelf life
**URL:** `/blog/how-long-does-moringa-powder-last-storage-shelf-life-2026`  
**GSC:** 3c · 923i · **0.33% CTR** · pos 6.6

---

## 1. Search Intent

User wants a **number** (months/years) + storage rules.  
On-page answer exists immediately.  
Title creates expectation of a guide — OK — but competitors ask **“Does it expire?”** which matches how people search.

---

## 2. Why Google Is Hesitating

Not depth. **CTR failure** despite position. Competitors lead with “expire” language and concrete “2–3 years” in titles. Your title is long and guide-shaped; body answer is excellent.

---

## 3. Why Users Don't Click

| Yours | Competitors (Firecrawl) |
|-------|-------------------------|
| `How Long Does Moringa Powder Last? 12 to 24 Months Shelf Life Guide (2026)` (74c) | `Does Moringa Powder Expire?: Unveiling Its Shelf Life…` |
| Meta buries numbers behind clauses | `…stay fresh for somewhere around 2 to 3 years…` |

**Fix:** Put **12–24 months** in the first half of the title; consider “expire” synonym.

---

## 4. Why Users Don't Buy

Informational page — soft CTA only is correct. Don’t hard-sell. Trust = storage honesty (fridge = no) — good.

---

## 5. Why AI

Already excellent extractable answer. Prefer shorter title so the cited source looks like the direct answer page.

---

## 6. What to Remove

- Duplicate “Quick Answer” vs “The short answer” H2s (merge).
- Year in title if it causes truncation.
- `keywords` meta (irrelevant).

---

## 7. What to Add

- One photo: bright green vs browned powder (original).
- Table already good — ensure first screen.
- FAQ already covers fridge/freeze — good.

---

## 8. Competitor Gap

| They all say | None say well | You |
|--------------|---------------|-----|
| “Years if stored well” (vague) | Opened vs unopened + AU humidity | **You already differentiate — surface in SERP** |
| Don’t refrigerate (sometimes) | Condensation explanation | Keep |

---

## 9. Technical

Breadcrumb schema lists Journal + Guides oddly — simplify to Home > Blog > Page. Low impact vs title.

---

## 10. Implementation checklist

### P1-C1 — Title/meta only (quick win)
- **Title:** `How Long Does Moringa Powder Last? 12–24 Months`
- **Meta:** `Unopened: 12–24 months. Opened: 6–12 months if cool, dark, dry. Fridge tip, spoilage signs, Australian heat storage.`
- **Priority:** Critical · **Benefit:** Potentially several× clicks from same impressions
- **Where:** title, H1 can stay slightly longer, meta, og, schema headline

### P1-C2 — Merge duplicate short-answer sections
- **Priority:** Medium

### P1-C3 — Add green-vs-brown photo
- **Priority:** Medium · **Benefit:** Snippet/EEAT

---

# PAGE 4 — Curry leaves substitute
**URL:** `/blog/curry-leaves-substitute-what-to-use-2026`  
**GSC:** **0 clicks · 1,221 impr · 0% CTR** · pos 10.1

---

## 1. Search Intent

Mid-recipe: “what can I use instead?”  
Content answers in Quick Answer + table — **excellent**.  
Title: “7 Best… (2026)” — listicle expectation fulfilled.

---

## 2. Why Google Is Hesitating

1. **Position ~10–12** (page 1 edge / page 2) — need CTR + stronger exact-match title.
2. **Stonesoup ranks #1** with simpler title: `The Best Simple Curry Leaves Substitutes`.
3. Reddit threads dominate for “best substitute” discussion intent.
4. Hero is product Curry.webp — looks like a **sales page**, not a cooking substitute guide.

---

## 3. Why Users Don't Click

| Query | `curry leaves substitute` / `substitute for curry leaves` |
| Your title | `7 Best Curry Leaves Substitutes (What to Use and What to Avoid) (2026)` |
| Winner title | `The Best Simple Curry Leaves Substitutes` |
| Why 0 CTR | Double “(2026)”; “7 Best” + “What to Avoid” is long; doesn’t lead with **kaffir lime** (the answer people want to preview); meta is good but title loses the auction |

**One-word lever:** Drop year; lead with substitute nouns.

---

## 4. Why Users Don't Buy

Pitch to dried curry leaves is appropriate **after** substitutes. Ensure CTA is “buy dried leaves if you’ll cook this often” not generic shop.

---

## 5. Why AI

Table is highly citable. Zero clicks means AI may still fetch you, but humans don’t — fix CTR first.

---

## 6. What to Remove

- Trailing `(2026)` from title/H1.
- Soft marketing tone in hero alt text (“7 Best…2026”).
- Any second CTA before the “what not to use” section.

---

## 7. What to Add

- `<ol>` of top 3 substitutes immediately under Quick Answer (list snippet).
- AU grocery note: “Coles/Woolworths dried curry leaves vs Asian grocer fresh.”
- Link to product curry leaves with anchor `dried curry leaves (same ingredient)`.

---

## 8. Competitor Gap

| Common | Missing | You |
|--------|---------|-----|
| Skip it / basil / mint advice | Exact ratios + “never curry powder” table | **You win on ratios — SERP must show that** |
| Community anecdotes | Structured avoid list | Keep |

---

## 9. Technical

Canonical OK. FAQ OK. Replace OG/hero with cooking-context image (tempering pan), not product pack only.

---

## 10. Implementation checklist

### P1-D1 — Title/meta
- **Title:** `Curry Leaves Substitute: 7 Swaps (Avoid Curry Powder)`
- **Alt title test:** `Best Curry Leaves Substitutes (Kaffir Lime, Zest, Dried)`
- **Meta:** keep current (already strong) or: `No curry leaves? Kaffir lime (1 per 4–6 leaves), lemon zest, or dried curry leaves at 1.5×. Why curry powder fails.`
- **Priority:** Critical · **Benefit:** End the 0-click streak

### P1-D2 — Hero/OG image swap
- **Priority:** High

### P1-D3 — Add `<ol>` top-3 under Quick Answer
- **Priority:** High · **Benefit:** List snippet

---

# PAGE 5 — Moringa vs Coffee (trim target)
**URL:** `/blog/moringa-vs-coffee-melbourne-energy-hack`  
**GSC:** 2c · 1,123i · **0.18% CTR** · pos 8.3 · **26 H2s**

---

## 1. Search Intent

Primary: caffeine-free energy / moringa vs coffee.  
Secondary: Melbourne coffee cost (weak).  
Hidden GSC: `does moringa have caffeine` (87 impr, 0 clicks).  
Title promises “Energy Hack” + Melbourne — **mixed intent**.

---

## 2. Why Google Is Hesitating

1. **Mixed search intent** — comparison + local Melbourne lifestyle + adrenal challenge + matcha/spirulina detour.
2. **Poor information architecture** — 26 H2s; numbered sections skip (1,2,3 then 6…).
3. **Too much product promotion / brand storytelling** mid-comparison.
4. **Thin unique evidence** relative to length — lots of filler vs caffeine table.
5. Slug `energy-hack` undercuts helpful-content tone.

---

## 3. Why Users Don't Click

Title: `Moringa vs Coffee for Energy (Caffeine-Free, No Crash) Australia 2026` — OK conceptually but long; “Hack” vibe in slug/OG; doesn’t preview **no caffeine in moringa** which searchers want confirmed.

---

## 4. Why Users Don't Buy

Pitch appears repeatedly (latte ritual, $2000 savings, Truganina, 7-day challenge ×2). Skeptical coffee drinkers bounce.

---

## 5. Why AI

Hard to chunk. Duplicate FAQ sections (`coffee-faq` and later `Q&A`). AI may quote Quick Answer only and ignore the rest — wasted crawl.

---

## 6. What to Remove (aggressive)

| Delete / split out | Reason |
|--------------------|--------|
| “State of the Cup” Melbourne price essay | Wrong primary intent → optional new URL |
| Second 7-day challenge (duplicate) | Redundancy |
| Second FAQ block | Keep one |
| Matcha/spirulina mega section | Link to 3-way comparison page instead |
| “Adrenal” medical-leaning claims without citations | YMYL risk / fluff |
| “Energy hack” language | Tone |

**Target length:** ~1,500–2,000 words focused comparison (from ~4,800).

---

## 7. What to Add

- H2 FAQ: `Does moringa have caffeine?` → **No.**
- Simple caffeine table: Coffee vs Moringa vs Tea (mg).
- Decision tree keep; move above fold.

---

## 8. Competitor Gap

Most coffee vs alternative pages are short and table-led. None need Melbourne latte economics. **Win = clearest caffeine/no-crash table + who should not quit coffee.**

---

## 9. Technical

Excess LocalBusiness/Place schema noise on a comparison article — simplify to BlogPosting + FAQ + Breadcrumb.

---

## 10. Implementation checklist

### P1-E1 — Title/meta
- **Title:** `Moringa vs Coffee for Energy: Caffeine, Crash & Nutrients`
- **Meta:** `Coffee = caffeine spike. Moringa = caffeine-free nutrients. Side-by-side for energy, sleep, and who should pick which.`
- **Priority:** Critical

### P1-E2 — Content diet (remove list above)
- **Priority:** Critical · **Benefit:** CTR + rankings + AI

### P1-E3 — Add caffeine FAQ for GSC query
- **Priority:** High

### P1-E4 — Schema cleanup
- **Priority:** Medium

---

# PAGE 6 — Product PDP
**URL:** `/products/moringa-powder/`  
**GSC:** 9c · 1,083i · 0.83% CTR · **pos ~22**  
**Site Product snippets:** 1,804 impr · **0.44% CTR** · pos 21.3

---

## 1. Search Intent

Transactional: buy moringa powder in Australia, price, trust, shipping.  
Title expectations (`Buy… $11/100g`) match.  
Content is thin vs ranking competitors (Herb Cottage, Forever Foods, etc.).

---

## 2. Why Google Is Hesitating

1. **Better competitor coverage** — category depth, organic merchandising, retail familiarity.
2. **Weak topical depth on PDP** (~content light vs blogs).
3. **Weak internal authority** — blogs outrank the money page; internal links often soft CTAs not equity-heavy.
4. **Product rich results not winning** — low CTR at poor positions.

---

## 3. Why Users Don't Click

When shown for `moringa powder australia` at pos ~20+, CTR naturally low. Title is actually **good** (price visible). Problem is **ranking**, not primarily title.

---

## 4. Why Users Don't Buy

Need clearer: CoA screenshot, shade-dry proof, taste expectation, vs CW capsules, shipping/returns, genuine reviews volume. Price $11 is a strength — keep in title.

---

## 5. Why AI

PDPs rarely get cited vs guides. Improve `llms.txt` (already listed) + unique lab explanation block AI can quote.

---

## 6–7. Remove / Add

Remove: generic filler.  
Add: CoA explainer, vs CW table (link to CW article), storage link, taste link, dosage.

---

## 10. Implementation checklist

### P1-F1 — Expand unique PDP sections + CoA image
- **Priority:** Critical · **Benefit:** Rankings + CVR

### P1-F2 — Internal link sprint from all P1 blogs → PDP with varied anchors
- **Priority:** Critical

### P1-F3 — Validate Product / Offer / Shipping schema in Rich Results Test
- **Priority:** Critical · **Benefit:** Snippet CTR

### P1-F4 — Review acquisition plan (real reviews)
- **Priority:** High

---

# CROSS-PAGE CRITICAL (do before more content)

| ID | Task | Where | Priority |
|----|------|-------|----------|
| X1 | Resolve `best-greens-powder-australia-2026` **410** (restore or 301 to 3-way comparison with greens H2) | `_redirects` + content | Critical |
| X2 | Merge two banned pages → one + 301 | blog + `_redirects` + `llms.txt` | Critical |
| X3 | Homepage add `<link rel="canonical" href="https://nutrithrive.com.au/">` | `index.html` | Critical |
| X4 | Reposition brands cluster (CW owns retail, Rosabella owns brand review, brands-comparison owns ranking table) | 3 URLs | High |

---

# SUGGESTED CURSOR EXECUTION ORDER

1. **X1, X2, X3, P1-B2** (technical / redirects)  
2. **P1-C1, P1-D1, P1-A1, P1-A2, P1-B1, P1-E1** (all title/meta quick wins)  
3. **P1-A3, P1-E2** (remove promo/bloat)  
4. **P1-A4, P1-B3, P1-B4, P1-D2, P1-D3** (add proof + structure)  
5. **P1-F1–F3** (money page)  
6. **X4** (cannibalization IA)

---

When you say **“implement”**, start with step 1–2 (redirects + title/meta pack) — highest evidence, lowest risk, measurable in GSC within 2–4 weeks.
