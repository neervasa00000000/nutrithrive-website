# COMMERCIAL SEO AUDIT — NutriThrive

**Date:** 10 September 2026  
**Scope:** Repository + live HTTP + live moringa PDP scrape  
**GSC window:** user-supplied recent ~28 days (plus 7 Sep 2026 GSC workbook already in repo)  
**Not done:** no new blogs, no mass deletes, no payment changes, no medical claims, no implementation of high-risk items

## Diagnosis

NutriThrive already ranks. The business problem is **intent mix**, not total clicks.

Recent ~28-day Google clicks ≈ **548**. Australia ≈ **364 (66%)**. Mobile ≈ **82%+**.

The patches article alone ≈ **225 clicks / 8,862 impressions (~41% of clicks)**.  
The moringa powder product page ≈ **7 clicks / 941 impressions / 0.74% CTR / position ~19.3**.

`moringa powder` as a query ≈ **199 impressions / 6 clicks / 3.02% CTR / position ~17.86**. People click when the result is relevant. The PDP is too far down the SERP, and too much organic traffic lands on informational URLs.

Success metric is **Australian commercial impressions → product-page clicks → add to cart → checkout → purchase → repeat**, not total traffic.

---

# 1. Money pages

GSC clicks/impressions/CTR/position below are **only filled where this GSC extract provided them**. Other SKUs: not in the supplied extract — do not invent.

## 1.1 Moringa Powder PDP — PRIORITY 1

| Field | Evidence |
|---|---|
| CURRENT URL | `https://nutrithrive.com.au/products/moringa-powder/` |
| CURRENT TITLE | `Moringa Powder Australia — NMI Lab-Tested, Shade-Dried \| From $11` |
| CURRENT META | `Buy moringa powder Australia from $11/100g. NMI lab-tested, shade-dried leaf, packed in Truganina Melbourne. Free AU shipping at $79.` |
| CURRENT H1 | `Moringa Powder` |
| CANONICAL | self, correct |
| INDEXABILITY | `index, follow` |
| TARGET QUERY | `moringa powder` |
| SECONDARY | `buy moringa`, `moringa powder australia`, size/value queries |
| GSC CLICKS | ~7 |
| GSC IMPRESSIONS | ~941 |
| GSC CTR | ~0.74% |
| GSC POSITION | ~19.3 (query `moringa powder` ~17.86) |
| PRODUCT SCHEMA | Yes. Name, images, brand, 3 Offers (100g $11 / 200g $21.50 / 400g $35), AUD, InStock |
| OFFER SCHEMA | Yes. Offer `url` on this SKU includes trailing slash |
| PRICE | $11 / $21.50 / $35 visible and in schema |
| AVAILABILITY | In stock on page and schema |
| REVIEWS | Visible: “4.9 from 12 Google reviews”. **Not in Product JSON-LD.** Count disagrees with blog cards (11) and `google-reviews-data.js` (scraped 11 on 26 Jul 2026) |
| BREADCRUMBS | Visible + BreadcrumbList |
| INTERNAL LINKS IN | Chrome (nav/footer) on almost every HTML page. Contextual body links exist on buyer/comparison/storage pages. Blog chrome also uses `?v=moringa-powder` |
| INTERNAL LINKS OUT | Guides (choose, use, taste, shelf-life), lab PDF, related SKUs |
| MOBILE UX | Image → name → price → size → ATC exists in DOM order. **CSS `.pdp` stays two-column (`minmax(420px, .9fr)`) at all breakpoints.** 320–430px cannot fit that min column. No sticky ATC |
| PAGE SPEED RISKS | Large editorial webps below fold; fonts preloaded; not the ranking bottleneck |
| TRUST SIGNALS | Lab PDF, farm, Truganina pack, dispatch, returns, Google reviews — reviews are **below** FAQs |
| CTA | Add to cart + Buy now. Dual primary actions on mobile after 860px stack to one column for buttons, not for the whole PDP |
| CRO PROBLEMS | (1) two-column grid on mobile (2) reviews not in first viewport (3) `#reviews` fragment from top articles is **dead** (4) compare-at `$14` needs confirmation it is a real was-price (catalog `was: 14`) (5) combo option inside the size select can confuse the powder intent |
| RECOMMENDED | See DO NOW 1 and 2. Do **not** retitle. Title already matches commercial AU intent. Ranking, not snippet wording, is the main gap |

**Do not change this title without a new SERP test.** It already contains product + Australia + proof + price.

## 1.2 Dried Curry Leaves PDP — PRIORITY 2

| Field | Evidence |
|---|---|
| CURRENT URL | `https://nutrithrive.com.au/products/curry-leaves/` |
| TITLE | `Dried Curry Leaves Australia — Shade-Dried Kari Leaf \| $7` |
| META | `Buy dried curry leaves Australia $7/30g. Shade-dried kari leaf, packed in Truganina. Free AU shipping at $79.` |
| H1 | Dried Curry Leaves (template) |
| CANONICAL | self |
| INDEXABILITY | index, follow |
| TARGET | `dried curry leaves australia` / `buy dried curry leaves australia` |
| GSC | **Not in this extract** |
| PRODUCT SCHEMA | Yes. SKU `NT-CUR-30G`. Offer url **missing trailing slash**: `.../products/curry-leaves` |
| LISTING SCHEMA | Collection file uses SKU `NT-CL-30G` and a different image — **SKU/image mismatch vs PDP** |
| INTERNAL | Nav/footer ubiquitous. Contextual body links on curry cooking/guide URLs are already present |
| MOBILE / CTA | Same PDP template as powder — same 420px grid issue |
| RECOMMENDED | No new city/product URL. After powder mobile/trust work, fix Offer URL slash + SKU consistency (schema — wait for approval) |

## 1.3 Darjeeling Black Tea PDP — PRIORITY 3

| Field | Evidence |
|---|---|
| CURRENT URL | `https://nutrithrive.com.au/products/black-tea/` |
| TITLE | `Darjeeling Black Tea Australia — First Flush \| $7.50 \| NutriThrive` |
| META | `Buy first-flush Darjeeling black tea Australia $7.50/100g. Packed in Truganina Melbourne. Free AU shipping at $79.` |
| TARGET | `darjeeling tea australia` / `buy darjeeling tea australia` |
| GSC | **Not in this extract** |
| SCHEMA | Offer url missing trailing slash. SKU `NT-TEA-DAR` vs listing `NT-BT-100G` |
| INTERNAL | Guide + brew/comparison articles already link the PDP |
| RECOMMENDED | Keep one commercial URL. Two blog guides exist (`...-guide` and `...-first-flush-second-flush-guide-2026`) — classify, do not merge yet |

## 1.4 Moringa Soap PDP — PRIORITY 4

| Field | Evidence |
|---|---|
| CURRENT URL | `https://nutrithrive.com.au/products/moringa-soap/` |
| TITLE | `Moringa Soap Australia — Handmade $7 \| NutriThrive` |
| META | `Handmade moringa soap $7 from Truganina. Free AU shipping at $79.` |
| GSC | **Not in this extract** |
| SCHEMA | Offer url missing trailing slash |
| INTERNAL | Only **5 blog files** contain soap PDP links vs ~128 for powder/curry/tea chrome. Under-linked commercially |
| CLAIMS | Keep cosmetic/handmade. No therapeutic skin claims |
| RECOMMENDED | Funnel from soap guide / vs-regular / ingredient-label. Do not stuff powder CTAs |

## 1.5 Gift Pack — PRIORITY 5 (AOV / shipping threshold)

| Field | Evidence |
|---|---|
| CURRENT URL | `https://nutrithrive.com.au/products/gift-pack/` |
| TITLE | `Gift Pack \| NutriThrive, Melbourne` — **weak commercial snippet** |
| META | Four products named; $35; packed in Melbourne |
| CONTENTS | 100g moringa + 100g tea + 30g curry + 95g soap. **Not** the two-product combo |
| PRICE | $35. Free ship threshold $79 — gift pack **does not** clear free shipping alone |
| SCHEMA | Offer url missing trailing slash |
| TITLE CHANGE | Reason exists (query mismatch). Not in the first 3 DO NOW because it is not the `moringa powder` ranking gap |

## 1.6 Combo Pack — PRIORITY 6

| Field | Evidence |
|---|---|
| CURRENT URL | `https://nutrithrive.com.au/products/combo-pack/` |
| TITLE | `Combo Pack $17 — 100g Moringa + 30g Curry (No Tea) \| NutriThrive` |
| DISTINGUISH | Explicitly “No Tea” vs four-product gift pack — good |
| INTERNAL | Almost orphaned from blog body (~6 files). Also injected as a size option on the powder PDP |

---

# 2. Top organic assets

28-day figures from this GSC extract unless noted. 7 Sep workbook numbers in parentheses where they differ.

| Page | ~Clicks | ~Impr | Class | Why |
|---|---:|---:|---|---|
| `/blog/moringa-patches-australia-review-do-they-work` | 225 (238) | 8,862 (9,995) | **PROTECT + FUNNEL** | 41% of clicks. Unique patch-review intent. Already has powder CTAs. Do not rewrite, delete, or add more powder stuffing. Fix the broken `#reviews` hop (DO NOW 2) |
| Shelf-life `/blog/how-long-does-moringa-powder-last-storage-shelf-life-2026` | 41 (51) | 5,088 (5,486) | **PROTECT + FUNNEL** | Storage intent. Contextual PDP links already exist. Keep |
| Kids `/blog/is-moringa-safe-for-children-kids-dosage-2026` | 37 | 4,816 (7 Sep) | **PROTECT + COMPLIANCE REVIEW** | Medical-adjacent. Do not add dosage/sales claims |
| Chemist Warehouse (capsule test **and/or** greens comparison) | 37 | — | **PROTECT + FUNNEL** | Commercial investigation. Body already links PDP well |
| Homepage `/` | 26 | 518 | **IMPROVE** | CTR 5.02%, pos ~6.42. Keep. Not a blog |
| Grow moringa | 23 | 2,530 | **PROTECT + FUNNEL (light)** | Garden intent. Early “Shop moringa powder” chrome is a weak match. Do not rewrite the ranking body |
| Berberine | 21 | — | **PROTECT + COMPLIANCE REVIEW + FUNNEL** | Keep medically cautious. Already links `#reviews` (broken) |
| Rosabella | 15 | 916 | **PROTECT + FUNNEL** | Same `#reviews` hop |
| Brands comparison | 10 (7 Sep) | 319 | **PROTECT + FUNNEL** | Heavy existing PDP links. Do not add more identical anchors |
| Dogs | 11 | 995 (7 Sep) | **COMPLIANCE REVIEW** | Veterinary. Do not push ATC |
| Taste | listed as protect | — | **PROTECT + FUNNEL** | Body commercial links are mostly template chrome, not unique in-article hops — later, one natural sentence, not a rewrite |
| How-to-add / how-to-choose | 5 clicks / high impr on choose (7 Sep) | — | **FUNNEL + IMPROVE (snippet)** | Buyer-guide intent. Already links PDP. Keep URL |
| Moringa vs coffee | 1,133 impr, 0.53% CTR, pos 8.3 (7 Sep) | — | **IMPROVE** | Caffeine-intent snippet. Not a money page |
| Moringa vs ashwagandha | 187 impr, 0 clicks, pos 8.4 | — | **IMPROVE** | Snippet, not delete |
| Side effects / seniors / pre-workout | impressions, weak CTR | — | **IMPROVE and/or COMPLIANCE** | No deletion |
| City landings `/moringa-sydney/` etc. | not in extract | — | **WATCH** | Already exist. Do not build more. Do not mass-delete. Canonical slash mismatch vs sitemap |

**Patches audit (required):**

1. Queries: Glorenda/Healrize/Clearena patch reviews (plus `glorenda reviews` 309 impr / 0 clicks / pos 8.1 in 7 Sep extract).  
2. Australian share: not broken out in this extract — pull AU vs other in GSC page filter next.  
3. Internal links: nav + several body/verdict CTAs to powder + related berberine/brands/CW. **Verdict card links `/products/moringa-powder/#reviews` — target id does not exist on the PDP.**  
4. Bounce/engagement: no Analytics export in repo.  
5. Natural next step: oral powder vs transdermal patches — already argued on-page. Do not add more CTAs.  
6. Deeper ecosystem: related guides already listed. Preserve ranking intent.

---

# 3. Internal link opportunities

Do **not** add sitewide identical “Shop moringa powder” links. Chrome already does that. The useful work is **repair** and **sparse unique hops**.

| SOURCE | TARGET | CURRENT | PROPOSED | ANCHOR | WHY |
|---|---|---|---|---|---|
| `/blog/moringa-patches-australia-review-do-they-work` | `/products/moringa-powder/#reviews` | Link exists; **fragment missing** | Add `id="reviews"` on PDP review section | keep “See reviews” | Highest-traffic page already chose this hop. Repair, don’t add CTAs |
| Same (berberine, Rosabella, kids) | same | same dead fragment | same PDP id | keep | Four ranking URLs depend on it |
| Blog chrome (`storefront/build.mjs` `shopHref`) | `/products/moringa-powder/?v=moringa-powder` | Parameterized default variant | `/products/moringa-powder/` for 100g | keep existing CTA copy | Consolidates commercial URL Google must rank. Keep `?v=` only for 200g/400g |
| Soap guide / vs-regular / ingredient-label | `/products/moringa-soap/` | Already contextual | no extra links | — | Already correct |
| Curry cooking cluster | `/products/curry-leaves/` | Already contextual on the pillar | no extra links | — | Already correct |
| Grow-moringa early chrome | powder PDP | “Shop moringa powder” above a grow-tree article | **later** change chrome product/CTA to a farm-story hop, not more exact-match | — | Not DO NOW; protected URL |
| Vitamin D / iron / water / UPF articles | powder PDP | Forced early “Shop moringa powder” | **later** retarget chrome to a relevant SKU or drop early CTA | — | Weak commercial relationship (bucket D) |

---

# 4. Mobile CRO

CSS source: `site/assets/css/storefront-system.css`.  
`.pdp { grid-template-columns: minmax(0, 1fr) minmax(420px, .9fr); }`  
No later rule sets `.pdp` to one column. At `max-width: 860px` gallery unsticks; at `600px` gap/padding change only.

Live scrape (mobile UA) confirms buy-box content order: image, H1, stock, **$11 ~~$14~~**, size select, ATC, proof, then long copy, then reviews.

This is CSS analysis plus live DOM order, not a device lab. First viewport at 320/375/390/430 will still be governed by that 420px min column.

| Width | What breaks |
|---|---|
| **320** | 32px side padding → ~288px content. Second column min 420px **overflows**. Horizontal scroll or crushed image. ATC may sit off-screen beside the gallery |
| **375** | Same overflow. iPhone-class default |
| **390** | Same |
| **430** | Same until ~860px. Dual ATC+Buy now becomes 1-col only at 860px for `.pdp-actions`, which does not fix the parent grid |
| All four | Sticky header 56px + announce bar eat first-screen. Reviews, shipping details, lab PDF are below long FAQ copy. **No sticky ATC** |
| Cookie banner | Fixed bottom on ≤680px — can cover ATC if user has not dismissed |

**Sticky ATC:** architecture exists (`#pdp-buy`, `#variant`, `data-add`, `applyPdpVariant` in `storefront/js/site.js`). A sticky bar is feasible. **Do not implement yet.** Requirements if approved: hide until `#pdp-buy` leaves view; reuse live variant/price; `padding-bottom` on `body` to avoid CLS; 44px min target; do not cover cookie banner; no fake urgency.

---

# 5. Technical SEO

| Item | Finding |
|---|---|
| Canonicals | Money pages self-canonical. City pages canonical **without** trailing slash; sitemap **with** slash (`/moringa-sydney` vs `/moringa-sydney/`) |
| Duplicates | `/buy-moringa-powder-australia/` **live 301 → PDP** (file still in repo, `noindex`, self-canonical in source — redirect wins). `/journal/*` 301 → `/blog/*` |
| Query params | `?v=` is a real variant selector (`site.js`). Blog `shopHref()` adds `?v=moringa-powder` even for the default 100g. Canonical on PDP is clean. robots.txt does not block `?v=` |
| Sitemap | Products + large blog set present. Retired slugs generally absent. Priority 0.8 on almost every blog URL (including low-commercial) vs 0.9 products |
| Robots | Allows `/` and products/blog. Disallows labs/scripts/audit. Sitemap declared |
| Schema | Product+Offer+Breadcrumb on PDPs. **No** `aggregateRating`, **no** `shippingDetails`, **no** `hasMerchantReturnPolicy`, **no** FAQPage despite visible FAQs. Listing JSON SKUs/images disagree with PDP. Offer URLs missing trailing slash on non-powder SKUs |
| Redirects | Large, generally one-hop in `_redirects`. Live HEAD: soap duplicate, iron ABS, vitamin-D paradox, Father’s Day, buy-moringa all 301 as configured |
| 404/410 | Many retired posts 410. Keep using 410 only when no replacement |
| Internal broken | `#reviews` on powder PDP is the confirmed commercial-path break. Not a 404 |
| Orphans | Combo pack weakly linked. Soap weakly linked vs powder |
| hreflang | `en-AU` + `x-default` on money pages |

Schema / canonical-architecture changes: **propose only, wait for approval.**

---

# 6. Commercial ranking opportunities (positions ~8–30)

Prioritise **existing URLs**, transactional/commercial queries.

| Opportunity | Evidence | Action |
|---|---|---|
| **PDP for `moringa powder`** | pos ~17.86, 199 impr, 3.02% CTR | Primary. Mobile + review hop + clean default URL. No title rewrite |
| **`buy moringa`** | 58 impr, 0 clicks, pos 16.3 (7 Sep) | How-to-choose currently owns investigation intent. Funnel, don’t clone a second buyer URL |
| Product rich results | ~2,389 impr / 38 clicks / 1.59% CTR / pos ~15 | Schema completeness (reviews/shipping) — **approval required** |
| How-to-choose / brands / CW | already ranking commercially | Keep; repair `#reviews`; stop extra exact-match chrome |
| Curry / tea / soap PDPs | no GSC rows in this extract | Pull page+query report before title tests |
| Gift pack title | weak vs “gift pack australia” / four-product intent | Later title test, after powder |

Do **not** chase `#1` on `moringa powder`. Stages: 18 → 15 → 10 → 5. Measure each.

---

# 7. Deletion review (evidence rule)

**Do not mass-cull.** Live HEAD (10 Sep 2026) shows the queued merges are **already deployed**.

### Soap duplicate — ALREADY DONE

| | |
|---|---|
| URL | `/blog/moringa-soap-benefits-for-skin-2026` |
| Live | **301 →** `/blog/moringa-soap-benefits-skin-guide` (one hop, 200) |
| Source HTML in `site/blog/` | missing (storefront journal copy remains) |
| Intent | same soap-benefits intent |
| Recommendation | **KEEP the 301.** Update remaining journal/internal mentions of the old slug when touched. Do not 410 |

### Iron ABS article — ALREADY 301; user asked to PAUSE

| | |
|---|---|
| URL | `/blog/iron-deficiency-australian-women-abs-real-numbers-2026` |
| Live | **301 →** `/blog/iron-deficiency-australian-women-symptoms-plant-based-sources-2026` |
| 28-day GSC | not in this extract |
| Compliance | **COMPLIANCE REVIEW** (deficiency / women / sources) |
| Recommendation | **Do not reverse blindly.** Diff unique ABS numbers against the destination. If unique tables were dropped, restore them on the winner, keep the 301. If overlap is complete, leave as-is |

### Vitamin D — ALREADY DONE

| | |
|---|---|
| Loser | `/blog/vitamin-d-deficiency-australia-sunny-country-paradox-2026` |
| Winner | `/blog/vitamin-d-deficiency-australia-abs-sunny-country-2026` (200) |
| Live | 301, one hop |
| Recommendation | **KEEP the 301.** COMPLIANCE REVIEW on the winner. Forced powder CTA on a vitamin D article is a later chrome issue, not a merge issue |

### Father’s Day — ALREADY DONE, destination is correct

| | |
|---|---|
| URL | `/blog/fathers-day-gift-under-40` |
| Live | **301 → `/products/gift-pack/`** (four-product $35 pack, not combo) |
| Recommendation | **KEEP.** Do not send to `/products/combo-pack/` |

No further deletions in this batch.

---

# 8. Traffic buckets and scorecard (measurement)

**A — Product / transactional:** powder, curry, tea, soap, gift, combo URLs + queries `moringa powder`, `buy moringa`, `dried curry leaves australia`, etc.  
**B — Commercial investigation:** brands, Chemist Warehouse, Rosabella, worth-it, AG1.  
**C — Informational but relevant:** taste, storage, how-to-use, recipes, grow.  
**D — Low commercial relationship:** patches, berberine-as-drug, kids/dogs/pregnancy/disease, generic deficiency posts.

Report A–D separately. Patches stays in **D** for commercial scoring even though it is a traffic winner.

**Country:** Australia / other commercial markets / other international. KPI = grow qualified **AU commercial** traffic, not cut international.

**Funnel (primary SEO KPI):** AU commercial impressions → AU commercial clicks → product sessions → add to cart → checkout start → purchase → revenue → contribution if data exists.

Wire this in GA4/GSC; the repo does not contain the export.

---

# Regulatory hold

No new AU food-marketing/usage claims for moringa until positioning is confirmed.  
No dosage, disease, treatment, “safe for everyone”, child/pregnancy/medication guidance.  
Technical SEO and non-moringa categories can proceed. Flag, don’t improvise.

---

# Exact implementation batch — 3 DO NOW

High-risk items (schema architecture, sticky ATC, URL deletion, city-page culls, moringa claims) are **not** in this batch.

## DO NOW 1 — Stack the PDP to one column on mobile

**WHY:** ~82% of Google clicks are mobile. The buy grid never collapses. `minmax(420px, .9fr)` cannot fit 320–430px. This is the conversion bottleneck on the URL that must rank for `moringa powder`.

**FILES:** `site/assets/css/storefront-system.css` (and minified sibling used in production), inside the existing `@media (max-width: 860px)` block.

**EXACT CHANGE:**

```css
.pdp {
  grid-template-columns: 1fr;
}
.pdp-gallery-wrap { position: static; }
```

Confirm `.pdp-buy` follows the image in DOM (it already does). Keep ATC full-width (already `.pdp-actions { grid-template-columns: 1fr }` at 860px).

**RISK:** Medium visual. Desktop ≥861px unchanged. Not cart/checkout/schema.

**EXPECTED EFFECT:** First mobile viewport shows image, name, price, size, ATC without horizontal overflow. Higher ATC rate on organic product sessions.

**TEST:** 320 / 375 / 390 / 430 / 768 / 1280 on `/products/moringa-powder/` and one other PDP. No horizontal scroll. ATC visible without sideways drag. Variant select still works.

**ROLLBACK:** Revert the media-query rule.

## DO NOW 2 — Make `#reviews` real and put the rating in the buy box

**WHY:** The #1 organic URL (patches, ~225 clicks) plus berberine, Rosabella, and kids already send people to `/products/moringa-powder/#reviews`. That id **does not exist**. Reviews are genuine Google reviews already on the page, but below FAQs — invisible above the fold on mobile.

**FILES:** PDP template that emits `<section class="pdp-reviews">` (live HTML in `site/products/*/index.html`; generator used for rebuild). Prefer one source so all six PDPs get `id="reviews"`. Buy-box markup on moringa first.

**EXACT CHANGE:**

1. `<section class="pdp-reviews" id="reviews">` on every PDP that already renders reviews.  
2. On moringa buy box only, one line under price, linking to `#reviews`: `4.9 from 12 Google reviews` — **only after counting the live Google profile**, because the page says 12, `google-reviews-data.js` says 11, and blog cards say 11. Use the true current count. Do not invent. Do not add `aggregateRating` JSON-LD in this batch.

**RISK:** Low HTML. Do not quote review text that claims “organic” in the buy box (one GBP quote does; page already discloses NutriThrive is not certified organic).

**EXPECTED EFFECT:** Patch/comparison traffic that already wants proof lands on reviews. First-screen trust without a sticky bar.

**TEST:** Open `/products/moringa-powder/#reviews` — section scrolls into view. Click “See reviews” from the patches verdict card. Screen reader: rating is a link, not a fake button.

**ROLLBACK:** Remove id and buy-box line.

## DO NOW 3 — Stop tagging the default powder URL with `?v=moringa-powder`

**WHY:** Google must rank one commercial URL. `shopHref()` forces `/products/moringa-powder/?v=moringa-powder` on blog chrome and product cards. Canonical is clean, but parameterized copies still get crawled. Default 100g does not need a query string. `?v=` remains valid for 200g/400g preselect (`site.js` `bindPdpVariant`).

**FILES:** `storefront/build.mjs` function `shopHref` (~line 568). Then rebuild blog/PDP HTML that is generated from it.

**EXACT CHANGE:**

```js
function shopHref(p) {
  if (p.id === "moringa-200g" || p.id === "moringa-400g") {
    return `/products/moringa-powder/?v=${encodeURIComponent(p.id)}`;
  }
  return p.href;
}
```

Do not change in-page `history.replaceState` while the shopper picks a size.

**RISK:** Low–medium. Rebuild touches many blog files mechanically. Analytics that keyed on `?v=moringa-powder` for 100g will see the clean path instead (events still have `data-product`).

**EXPECTED EFFECT:** Internal equity concentrates on `/products/moringa-powder/`. Helps the 18 → 15 move for `moringa powder`.

**TEST:** After rebuild, patches/choose/CW early CTA href is `/products/moringa-powder/` with no query. Listing cards for 200g/400g still open with `?v=` and the select matches. Canonical unchanged.

**ROLLBACK:** Restore previous `shopHref`.

---

# Waiting for approval (not in the 3)

- Product schema: trailing-slash Offer URLs, SKU alignment, optional `aggregateRating` only if Google eligible, shipping/returns properties  
- Sticky mobile ATC  
- Gift-pack title test  
- City-page canonical slash  
- Reversing or further merging iron/vitamin D  
- Any moringa health-copy change  
- New articles
