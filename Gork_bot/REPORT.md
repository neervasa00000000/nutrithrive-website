# NutriThrive site audit — 29 Aug 2026

**For:** Neer Vasa / NutriThrive (15 Europe Street, Truganina VIC 3029)  
**Site:** https://nutrithrive.com.au/  
**When:** Saturday 29 August 2026, ~12:15pm AEST (UTC+10)  
**Method:** live `curl` GET/HEAD of sitemap, robots, llms.txt, homepage, all 6 PDPs, FAQ, city pages, 171 URL status checks, 8 full blog HTML samples. Firecrawl CLI was not on PATH; `npx firecrawl` was blocked by auto-review, so this audit used curl + WebFetch/WebSearch only.  
**Host:** Netlify static site. GA `G-WH21SW75WP`.

Lists live in `/workspace/site-audit/` (`url-inventory.md`, `sitemap-urls.txt`, `blog-inventory.md`, `leftover-urls.txt`).

---

## Fixes applied (29 Aug 2026, repo)

| Issue | Fix |
|---|---|
| New Father's Day buyer post | Published `/blog/fathers-day-gift-under-40` from draft; sitemap + ItemList + redirects + llms.txt |
| llms.txt wrong prices | 200g → $21.50; curry → $7/30g; tea → $7.50/100g |
| llms.txt banned → Rosabella | Replaced with whey comparison URL |
| llms.txt retired stress-weight slug | Pointed at calm-mind / cortisol pillar |
| Protein-powder leftover 301 | Retargeted to `/blog/moringa-vs-whey-protein-comparison-2026` |
| `/pages/homepage/melbourne` leftover | 301 → `/melbourne/` |
| Pre-workout canonical ↔ `.html` loop | Canonical is extensionless; Twitter meta matches real description |
| Capsules vs powder missing H1 | Restored corrupted `<h1>` |
| Homepage featured guides (non-buyer) | Swapped to how-to-choose, CW vs NT, capsules vs powder, Father's Day gift |
| Homepage `id="about"` on guides | Renamed to `id="featured-guides"` |
| Homepage “Rosabella vs NT” mislabel | Label now Chemist Warehouse vs NutriThrive |
| Homepage products missing PDP / gift / curry / tea | Titles + images link to PDPs; gift, curry, tea cards added |
| Lab PDF blocked in robots | `Allow: /documents/nutrithrive-lab-report-summary.pdf` |

Still open (not done this pass): thin category hubs, thin city templates, `.html`/slash duplicate 200s for about/faq/contact, near-duplicate vitamin D / iron pairs, full llms.txt buyer-intent catch-up for all 39 missing posts.

---

## 1. URL inventory

Live sitemap `https://nutrithrive.com.au/sitemap.xml` is **200**, 30,886 bytes, **149** `<loc>`. Every `<lastmod>` is `2026-08-23` (build stamp, not per-URL). robots.txt points only at this sitemap.

WebFetch of the sitemap URL returned HTTP 500; curl GET is consistently 200. Treat Googlebot-style GET as healthy; the 500 is a client/tool issue worth watching.

| Type | Count | Pattern |
|---|---:|---|
| Home | 1 | `/` |
| Core | 4 | `/about` `/contact` `/faq` `/privacy-policy` (no trailing slash) |
| Blog index | 1 | `/blog/` |
| **Blog posts** | **124** | `/blog/{slug}` (no slash, no `.html`) |
| Blog categories | 5 | `/blog/category/{guides,health,pets,recipes,tea}/` |
| Products index | 1 | `/products/` |
| Product PDPs | 6 | `/products/{moringa-powder,curry-leaves,black-tea,moringa-soap,combo-pack,gift-pack}/` |
| City | 5 | `/melbourne/` `/moringa-{sydney,brisbane,adelaide,perth}/` |
| Other pages | 2 | `/pages/newsletter/` `/pages/shipping/shipping-returns` |
| **Sitemap total** | **149** | |

`llms.txt` is 200 (24,067 bytes) with **104 unique URLs**. `llms-full.txt` is **404**.

Homepage unique hrefs: **36** (see `homepage-urls.txt`). Internal money links on the homepage: `/products/`, `/products/moringa-powder/`, `/products/curry-leaves/`, `/products/black-tea/`. No homepage `<a>` to soap, combo, or gift PDPs.

---

## 2. Existing topics — do not duplicate

Full table: `blog-inventory.md` (124 rows: slug, H1, URL, 1-line topic, llms.txt yes/no).

**Every cluster you listed is already covered.** Several have two live URLs.

| Cluster | Live slug(s) | Note |
|---|---|---|
| moringa vs CW | `moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025` | Homepage CTA mislabels this “Rosabella vs NutriThrive” |
| moringa vs Rosabella | `rosabella-moringa-reviews-legit-or-overhyped-2026` | Also wrongly used in llms.txt as “Is moringa banned?” |
| moringa vs AG1 | `ag1-alternative-australia-moringa-comparison-2026` | |
| iron | `iron-deficiency-australian-women-symptoms-plant-based-sources-2026` **and** `iron-deficiency-australian-women-abs-real-numbers-2026` | Duplicate pair |
| vitamin D | `vitamin-d-deficiency-australia-sunny-country-paradox-2026` **and** `vitamin-d-deficiency-australia-abs-sunny-country-2026` | Duplicate pair |
| AUST L | `what-does-aust-l-mean-supplement-label-australia-2026` | Featured on homepage (not buyer-intent) |
| caffeine / FSANZ | `how-much-caffeine-safe-per-day-australia-fsanz-2026`, `how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026`, `caffeine-cutoff-time-sleep-black-tea-2026` | |
| PCOS | `moringa-for-pcos-polycystic-ovary-syndrome-2026` | |
| blood pressure | `moringa-for-high-blood-pressure-hypertension-2026` | |
| sleep | `moringa-for-sleep-quality-insomnia-2026` | |
| period/PMS | `moringa-for-period-pain-pms-menstrual-health-2026` | |
| capsules vs powder | `moringa-capsules-vs-powder-which-is-better-2026` | **No H1** |
| taste | `what-does-moringa-powder-taste-like-honest-guide-2026` | |
| cholesterol | `moringa-for-cholesterol-heart-health-research-2026` | |
| vitamin C/iron | `moringa-with-vitamin-c-iron-absorption-guide-2026` | |
| energy timeline | `moringa-energy-what-happens-week-by-week-2026` | |
| workout timing | `moringa-before-after-workout-timing-guide-2026`, `natural-pre-workout-moringa-australia-2026` | Pre-workout has canonical loop |
| anxiety | `moringa-for-anxiety-stress-evidence-2026` | |
| curry vs powder | `curry-leaves-vs-curry-powder-difference-explained-2026` | |
| curry substitutes | `curry-leaves-substitute-what-to-use-2026` | |
| fresh vs dried curry | `fresh-vs-dried-curry-leaves-cooking-comparison-2026` | |
| curry heart | `curry-leaves-heart-health-cholesterol-evidence-2026` | |
| Darjeeling vs English breakfast | `darjeeling-tea-vs-english-breakfast-comparison-2026` | |
| Darjeeling vs coffee | `darjeeling-tea-coffee-replacement-honest-assessment-2026` | |
| daily Darjeeling | `can-you-drink-darjeeling-tea-every-day-2026` | |
| moringa soap vs regular | `moringa-soap-vs-regular-soap-comparison-2026` | |
| cost-per-nutrient | `is-moringa-worth-it-cost-value-australia-2026`, `why-premium-moringa-costs-11-not-25-value-vs-markup-2026` | Second not in llms.txt |
| UPF / 30 days UPF | `ultra-processed-food-australia-what-it-means-how-much-you-eat-2026`, `stop-eating-ultra-processed-food-30-days-what-happens-2026` | |
| magnesium | `signs-magnesium-deficiency-australia-what-to-eat-2026` | |
| morning routine | `morning-routine-health-tips-australia-2026` | |
| anti-inflammatory | `best-anti-inflammatory-foods-australia-daily-guide-2026`, `moringa-for-inflammation-anti-inflammatory-research-2026` | |
| blood sugar spikes | `blood-sugar-spikes-how-to-avoid-through-food-2026` | |
| always tired | `why-always-tired-nutritional-deficiencies-australia-2026`, `chronic-fatigue-what-actually-fixed-it-2026` | |
| eat more veg | `how-to-eat-more-vegetables-practical-guide-australia-2026` | |
| plant iron | `best-plant-based-iron-foods-australia-absorption-guide-2026` | |
| water | `how-much-water-per-day-australians-honest-guide-2026` | |
| fibre | `fibre-deficiency-australia-bowel-cancer-risk-2026` | |
| protein women | `how-much-protein-australian-women-need-honest-guide-2026` | |
| gut-brain | `gut-brain-connection-digestion-mood-mental-health-2026` | |
| stress weight | retired `stress-weight-gain-cortisol-mechanism-what-to-do-2026` **301s** to `moringa-calm-mind-stress-brain-fog-cortisol-science-2026` | llms.txt still lists the retired slug |
| seed oils | `seed-oils-bad-for-you-honest-research-australia-2026` | |
| strength training 35+ | `strength-training-women-over-35-why-it-matters-2026` | |
| balanced plate | `how-to-build-balanced-plate-no-calorie-counting-2026` | |
| omega-3 | `omega-3-deficiency-australia-inflammation-food-sources-2026` | |
| 30 plants | `30-different-plants-per-week-gut-health-microbiome-2026` | |
| perimenopause | `what-to-eat-perimenopause-diet-australia-2026`, `moringa-for-menopause-symptoms-hormones-2026` | |
| longevity foods | `longevity-foods-australia-what-to-eat-live-longer-2026` | |
| hormones | `how-to-balance-hormones-naturally-food-australia-2026` | |
| immune | `how-to-strengthen-immune-system-naturally-australia-2026` | |
| ageing 40s | `how-to-age-well-in-your-40s-healthy-ageing-australia-2026` | |
| wellness shot / dal / chai / energy bites / avocado toast | all four recipe slugs exist | |
| banned/recall | **no live “banned” article** | `/blog/is-moringa-banned-in-australia` **410**; `…-2026` **404**; llms.txt maps the topic onto the Rosabella URL |
| heavy metals | `moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026` | |
| pregnancy / dogs / breastfeeding / GLP-1 / berberine / cortisol cocktail / patches | all exist | |
| city landings | `/melbourne/` plus 4 `moringa-{city}/` | Sydney/Brisbane/Adelaide/Perth are thin templates (~12 KB) |

**Near-duplicate pairs (both 200, both in sitemap):**

- Vitamin D (2), iron deficiency (2), moringa soap benefits (`moringa-soap-benefits-skin-guide` vs `…-for-skin-2026`), Darjeeling buying guides (`darjeeling-black-tea-australia-guide` vs first-flush/second-flush 2026).

**39 live posts are missing from llms.txt**, including buyer-intent pages (ashwagandha, whey, quality checklist, $11 vs $25, batch codes, Diwali gift guide). The July generic-explainer batch *is* in llms.txt. That is backwards for AI discovery.

---

## 3. What is not working

### Actual failing URLs (404 / 410)

Sitemap URLs: **none failed**. All 149 HEAD/GET as **200**.

Off-sitemap failures found:

| URL | Status |
|---|---|
| https://nutrithrive.com.au/llms-full.txt | **404** |
| https://nutrithrive.com.au/sitemap_index.xml | **404** (expected; only `/sitemap.xml` exists) |
| https://nutrithrive.com.au/blog/is-moringa-banned-in-australia | **410** |
| https://nutrithrive.com.au/blog/is-moringa-banned-in-australia-2026 | **404** |
| https://nutrithrive.com.au/blog/why-australians-cant-sleep-moringa-midnight-reset.html | **404** (still surfaces in Google snippets) |
| https://nutrithrive.com.au/blog/chia | **404** |
| https://nutrithrive.com.au/blog/chia-seeds-benefits-australia | **404** |
| https://nutrithrive.com.au/blog/chia-seeds.html | **404** |
| https://nutrithrive.com.au/products/chia | **404** |
| https://nutrithrive.com.au/faq/chia | **404** |
| https://nutrithrive.com.au/chia | **404** |
| https://nutrithrive.com.au/blog/moringa-for-weight-loss.html | **404** |
| https://nutrithrive.com.au/blog/moringa-benefits.html | **404** |
| https://nutrithrive.com.au/privacy.html | **404** |

### Redirects that look wrong

| From | To | Why it is wrong |
|---|---|---|
| `/blog/best-protein-powder-australia.html` (and no-.html) | `/blog/how-to-choose-moringa-powder-australia-2026` | Google still shows the old “Best Protein Powder Australia 2026” title on this URL. Redirect target is a moringa *buying* guide, not protein powder. |
| `/blog/stress-weight-gain-cortisol-mechanism-what-to-do-2026` | `/blog/moringa-calm-mind-stress-brain-fog-cortisol-science-2026` | llms.txt still advertises the retired stress-weight title. Destination H1 is “Moringa, Cortisol & Brain Fog”. |
| `/pages/homepage/melbourne` | `/` | Indexed leftover. Should 301 to `/melbourne/` not the homepage. |
| `/blog/natural-pre-workout-moringa-australia-2026` (200) | canonical = `…2026.html`, and `.html` **301s back** | Canonical ↔ redirect loop. |

Expected/fine redirects: `www` → apex, `http` → `https`, `/blog` → `/blog/`, `/products` → `/products/`, `/blog/{slug}/` → no slash, `/blog/how-to-add-moringa-to-diet.html` → extensionless.

### Duplicate 200s (no redirect)

These all return **200** alongside the canonical, so they compete with themselves:

- `/faq.html`, `/about.html`, `/contact.html`, `/index.html`
- `/about/`, `/faq/`, `/contact/`, `/privacy-policy/` (canonicals are slashless)
- `/melbourne` vs `/melbourne/` (canonical has slash)

`/faq.html` is the **same 25,997-byte body as `/faq`** — not a chia leftover, just a duplicate URL.

### Chia FAQ leftover

**Not present on the live FAQ or homepage.** FAQ H2s are moringa / curry / tea / shipping / taste / lab-test only. Zero “chia” matches in `/faq`, homepage, or `llms.txt`. Guessed chia URLs 404. Chia only appears as a recipe ingredient inside some blog posts (e.g. coconut chia pudding in `how-to-add-moringa-to-diet`). If an old chia FAQ existed, it is already gone; no leftover copy to delete.

### Thin / weak pages

| URL | Size | Problem |
|---|---:|---|
| `/blog/category/pets/` | 2,996 B | H1 “Pets”. **One** post. |
| `/blog/category/recipes/` | 4,049 B | 7 posts; missing several recipe URLs that exist (moringa tea, high-protein recipes, curry tea). |
| `/blog/category/tea/` | 4,088 B | 6 posts; missing chai latte, coffee-replacement, health-benefits, caffeine-cutoff. |
| `/blog/category/guides/` | 6,178 B | Thin hub. |
| `/blog/category/health/` | 8,253 B | Better, still a stub hub. |
| `/moringa-sydney/` `/moringa-brisbane/` `/moringa-adelaide/` `/moringa-perth/` | ~12.2–12.5 KB | Template city pages. Melbourne is 19.9 KB and actually useful. |
| `/documents/nutrithrive-lab-report-summary.pdf` | 3,586 B | Real PDF, but a **nutrition summary stub** (protein/fat/carbs). Homepage links it. **robots.txt Disallow: /documents/** so Google should not index the proof you are pointing shoppers at. |

Smallest *posts* (still 200, not empty): `curry-leaves-recipes-beyond-dal` (19.8 KB HTML), Diwali gift guide (21.0 KB), 15-minute meals (21.2 KB), soap ingredient label (21.3 KB), caffeine cutoff (22.2 KB). These are short, not broken.

### H1 / title mismatches (samples + systematic)

- **87 of 124 posts** have title tag ≠ H1.
- **Missing H1:** `/blog/moringa-capsules-vs-powder-which-is-better-2026` (title exists).
- Homepage: “Rosabella vs NutriThrive test →” points at the **Chemist Warehouse** slug.
- Product title vs H1 is usually close; tea title includes `$7.50`, H1 does not (fine).
- Pre-workout Twitter description is leftover marketing copy (“stimulant-free performance… Australian athletes”) and does not match the honest meta description.

### Homepage: featured guides are not buyer-intent

The four “Featured guides” (badge “Most popular” on the first) are:

1. Vitamin D deficiency (ABS)  
2. What Does AUST L Mean  
3. How Much Caffeine Is Safe (FSANZ)  
4. Iron Deficiency: The Real Numbers  

None of these sell powder / curry / tea / soap. Buyer-intent posts that *do* exist (how-to-choose, CW vs NutriThrive, brands table, capsules vs powder, cost-per-nutrient, Darjeeling first-flush, curry substitute) are not in this grid.

`id="about"` is on the featured-guides section, so `#about` does not go to the about story.

### Missing products on the homepage

Product **cards** (Add to Cart only — **no PDP href**):

- 400g bundle $35  
- Moringa 100g + Soap $17  
- Premium Combo $17  
- Moringa 100g $11  
- Moringa Soap $7  

**Not on the card grid:** dried curry leaves ($7/30g), Darjeeling tea ($7.50/100g), gift pack ($35), 200g moringa ($21.50). Curry and tea exist only as text links in the About paragraph. Gift pack is invisible on the homepage. Combo card image alt says “moringa with dried curry leaves”; live combo PDP is **100g moringa + 100g tea + 30g curry**.

### llms.txt vs live prices (mismatch)

See §6. llms.txt is stale on 200g moringa, curry size/price, and tea size. Several blurbs are concatenated leftovers (`…for Australians.'re getting per dollar.`). “Is moringa banned in Australia?” links to the Rosabella review.

---

## 4. Traffic

**No public traffic number was available. Do not invent one.**

Tried:

- Ahrefs free Website Authority Checker and Traffic Checker — both render a form, **no DR / no visits** without a logged-in session.
- Similarweb `https://www.similarweb.com/website/nutrithrive.com.au/` — **timed out**. The AU nutrition top-sites list for June 2026 does not include nutrithrive.com.au (list is perfectgym, splose, bulknutrients, healthylife, bodyandsoul…).
- `site:nutrithrive.com.au` via WebSearch returned **no result count**. A branded query did return live product/about URLs plus **stale indexed leftovers** (`best-protein-powder-australia.html`, `why-australians-cant-sleep-moringa-midnight-reset.html`, `how-to-add-moringa-to-diet.html`).
- Unrelated nutrithrive.com / NutriThrive.ai hits are other businesses; ignore them.

Internal GA (`G-WH21SW75WP`) is the only real source, and it is not public.

---

## 5. Live title / H1 / meta patterns (8 posts sampled)

There is **no CMS character cap**. These are hand-written. Google will still truncate.

Decoded character counts from live HTML (apostrophes preserved):

| Post | Title chars / words | H1 chars / words | Meta chars / words |
|---|---|---|---|
| How to choose moringa | **79 / 14** | **81 / 14** | 135 / 19 |
| CW vs NutriThrive | 61 / 9 | 61 / 9 | 124 / 20 |
| Capsules vs powder | 49 / 8 | **missing** | 118 / 18 |
| Rosabella review | 68 / 10 | 70 / 10 | **193 / 30** |
| Vitamin D (ABS) | 60 / 9 | **84 / 14** | 116 / 21 |
| AUST L | 50 / 10 | 34 / 8 | 116 / 23 |
| Natural pre-workout | 47 / 8 | 32 / 5 | 108 / 17 |
| Curry leaves vs curry powder | 52 / 8 | 42 / 8 | 125 / 21 |

**Site-wide from 124 title/H1 tags:**

| Field | min | median | max | over typical SERP |
|---|---:|---:|---:|---|
| `<title>` | 31 | 52 | **82** | 28 > 60 chars; 13 > 70 |
| H1 | 30 | 46 | **87** | 24 > 70; 1 missing |

Practical limits for *new* posts on this site (what actually exists, plus SERP reality):

- **Title tag:** write to **50–60 characters** (8–12 words). Current outliers at 79–82 will truncate in Google.
- **H1:** **40–70 characters** (8–14 words). Several 80+ H1s wrap on mobile; they work on-page but do not match the title.
- **Meta description:** **110–155 characters** (18–25 words). 108–135 is the healthy band in the sample. Rosabella at 193 will be cut.
- **og:title** sometimes differs from `<title>` on purpose (how-to-choose og:title is 58, “7 Checks”; capsules og:title is 64). Keep og:title ≤ 60 if you care about social unfurl.

Longest live titles (avoid this length): “Strength Training for Women Over 35…” (82), “Ultra-Processed Food in Australia…” (81), “How to Choose Moringa Powder…” (79).

---

## 6. Live prices to lock (scraped 29 Aug 2026 ~12:05pm AEST)

Confirmed from `/products/` cards + PDP JSON-LD / size selectors. **Last-known 29 Aug list is correct on every SKU it named.** Corrections are size labels in llms.txt, not the dollar amounts you had.

| SKU | Size | Live now | Was (RRP on page) | Last known | llms.txt |
|---|---|---:|---:|---|---|
| Moringa powder | 100g | **$11.00** | $14.00 | $11 | $11/100g — OK |
| Moringa powder | 200g | **$21.50** | — | $21.50 | **$19/200g — WRONG** |
| Moringa 400g bundle (buy 3 get 1) | 4×100g | **$35.00** | $44.00 | $35 | not listed as 400g |
| Dried curry leaves | **30g** | **$7.00** | $8.49 | $7 / 30g | **$5.50/20g — WRONG size and price** |
| Darjeeling black tea | **100g** | **$7.50** | $10.00 | $7.50 | **$7.50/50g — WRONG size** (live pack is 100g ≈ 50 cups) |
| Moringa soap | 95g | **$7.00** | $9.49 | $7 | $7 — OK |
| Premium combo | 100g moringa + **100g tea** + 30g curry | **$17.00** | $22.49 | $17 | listed, no price |
| Moringa 100g + soap 95g | 195g net | **$17.00** | $23.39 | (not in last-known as its own line) | missing |
| Gift pack | 100g moringa + 100g tea + 30g curry + 95g soap | **$35.00** | $41.98 | $35 | $35 — OK |
| Free AU shipping | — | **$80** | — | $80 | $80 — OK |

JSON-LD on the moringa PDP also offers 100g $11, 200g $21.50, 400g $35, plus $17 combos.

---

## 7. Gaps that would actually sell powder / curry / tea / soap

Do **not** write another vitamin D, AUST L, UPF, seed-oil, or “always tired” explainer. Those clusters are full and they are what the homepage is already featuring.

Gaps that still map to a SKU:

1. **Fix the homepage before writing more posts.** Swap featured guides to how-to-choose, CW/Rosabella, capsules vs powder, cost-per-nutrient / $11 vs $25, Darjeeling first-flush, curry substitute or fresh vs dried. Add PDP links + cards for **curry, tea, gift pack, 200g**. Gift pack is a $35 AOV lever that currently has zero homepage presence.
2. **llms.txt price + banned-URL cleanup** — AI crawlers are quoting $19/200g, $5.50/20g curry, $7.50/50g tea. That is live-wrong. Point “banned” at a real 200 page or drop it; do not keep the 410.
3. **Protein-powder leftover** — `/blog/best-protein-powder-australia.html` is still in Google with a spammy title and 301s at a moringa guide. 410 it or retarget to `moringa-vs-whey-protein-comparison-2026` (which exists and is *not* in llms.txt).
4. **Soap:** two near-duplicate benefit posts + a vs-regular post, but homepage soap card has no PDP link. The selling gap is merchandising, not another “benefits of moringa soap” article.
5. **Tea:** first-flush vs second-flush and vs English Breakfast exist; category hub omits chai and coffee-replacement. A “why 100g / $7.50 and how many cups” buyer page is missing (llms still says 50g).
6. **Curry:** culinary cluster is dense. What is missing on the **shop path** is the product on the homepage and a gift/Diwali card (Diwali guide exists, not in llms.txt, not featured).
7. **City landings** outside Melbourne are interchangeable templates. Either thicken with local dispatch times + a product grid, or noindex the four clones.
8. **Canonical / duplicate HTML.** Redirect `.html` and slash variants. Unbreak the pre-workout canonical loop. Stop robots from blocking `/documents/` if the lab PDF is a trust asset, or host a public copy under `/assets/` that is allowed.

Buyer-intent posts that already exist but are buried (not homepage, not llms.txt): ashwagandha comparison, whey comparison, quality checklist, $11 vs $25, batch-code freshness, Diwali gift guide. Those will sell more than a 125th lifestyle explainer.
