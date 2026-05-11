# Phase 3 — Technical SEO audit (https://nutrithrive.com.au)

Evidence base: **50 Firecrawl scrapes** (2026-05-11) + site map. Where HTML `metadata` disagreed with body extract (e.g. FAQ), both are noted.

---

## 1. Title tags

### Missing or failed extraction

- **https://nutrithrive.com.au/faq** — JSON extract returned empty `titleTag`; live HTML metadata shows `Moringa & Superfoods FAQ | NutriThrive, Melbourne`. Verify `<title>` is present in first bytes and not duplicated/overwritten by scripts.

### Over ~60 characters (risk of truncation in SERP)

Count includes spaces; Google uses pixel width — treat as “likely truncated”.

- Homepage visible headline-style title in extract: **~95 characters** (“Australia's freshest moringa. Shade-dried. Lab-tested. Delivered from Melbourne.”) — HTML `metadata.title` is shorter: `NutriThrive | Shade-dried moringa from Melbourne` (~48 chars). **Resolve inconsistency** between `<title>` and on-page hero/H1 duplication.
- **https://nutrithrive.com.au/blog/moringa-vs-coffee-melbourne-energy-hack.html** — Title tag text ~100+ chars in extract.
- **https://nutrithrive.com.au/blog/healthy-snack-melbourne-why-everyone-switching-to-moringa-2026.html** — `Melbourne Wellness Trend · Functional Snack Shift · 2026` plus longer variants in metadata — align one concise `<title>`.

### Under ~30 characters (weak / generic)

- **https://nutrithrive.com.au/products** — Extract: `Shop Premium Wellness Products | NutriThrive` (~44 chars) OK; still fairly generic vs “Moringa, tea & curry leaves | NutriThrive”.

### Duplicate / inconsistent titles (same or competing intent)

- **Blog index:** `metadata.title` = `NutriThrive Blog | Moringa, Curry Leaves & AU Wellness` but extract `titleTag` = `NutriThrive - Natural Wellness Products, Moringa and Superfoods` — **two different positioning statements** for one URL.
- **Rosabella review post:** HTML `title` = `Rosabella Moringa Review: Is It Worth It? 2026` vs `og:title` about **capsules vs powder** — **serious mismatch** between SERP snippet stack and social stack.

### Title does not match page content

- **https://nutrithrive.com.au/blog/moringa-brands-comparison-australia-2026.html** — H1 extracted as **“What You'll Learn in This Complete Guide”** (TOC language, not the article topic). Title says “Complete Guide to Moringa Powder in Australia 2026” — closer, but H1 fails intent.
- **https://nutrithrive.com.au/blog/is-moringa-legit-what-science-and-real-users-say-2026.html** — Title extract `Moringa Powder: Benefits, Usage, and Buying Guide` vs H1 **“Yes—moringa is legit.”** — misaligned.
- **https://nutrithrive.com.au/blog/how-to-read-moringa-batch-codes-freshness.html** — Title `Fresh Moringa Powder | NutriThrive` vs article topic (batch codes).

---

## 2. Meta descriptions

### Missing (extract)

- **FAQ** — empty in JSON extract; metadata description present — fix DOM order or extraction; confirm `<meta name="description">` in HTML.

### Over ~160 characters

- Homepage meta in extract is **very long** (multiple sentences) — trim to one clear value prop + CTA (~150–160 chars).

### Under ~70 characters (thin)

- **Contact:** “Get in touch with Australia's premium moringa powder company based in Truganina, Melbourne, Victoria.” — borderline short; add phone, response time, or “order help” hook (still <160).

### Duplicate / generic

- Several posts reuse patterns like “Discover the benefits…” — varies by page but **batch codes**, **shade drying**, **caffeine** articles overlap with **product-page** messaging while canonicals point at product (see below) — duplicates risk in index.

### Weak for clicks

- Meta for **10-dollar superfood** article: “Explore my journey…” — less specific than the H1’s dollar comparison; add numbers from H1.

---

## 3. Heading structure

### Missing H1

- None of the 50 scraped pages lacked an H1 entirely.

### Multiple H1s

- Not systematically counted; **brands comparison** page’s first H1 behaving like a section label suggests template error — verify single H1.

### H1 does not reflect main keyword intent

- **moringa-brands-comparison-australia-2026.html** — H1 = “What You'll Learn in This Complete Guide”.
- **how-to-read-moringa-batch-codes-freshness.html** — H1 leans sales (“Fresh, Batch-Dated Moringa — Packed in Victoria”) vs “How to read batch codes”.

### Broken hierarchy (H1 → H3)

- **Blog index** lists many article titles as **H2** — acceptable for a listing **if** each card doesn’t skip to H3 inside snippets; verify article cards don’t use H3 before H2 in DOM.
- **How-to-add / usage guide** page: many H2s prefixed with emoji — not a hierarchy break but screen reader noise.

### Vague headings

- Footer column headings repeat (“About NutriThrive”, “Shopping”) across pages as H2/H3 — common pattern; consider **footer navigation not using H2–H6** (use lists only) to reserve headings for main content.

---

## 4. Images

### Missing alt

- Not exhaustive on all 50; extracts often returned **logo only**. Manual spot-check recommended on blog hero images.

### Keyword stuffing

- Alts on homepage product images are **long but descriptive** (“NutriThrive 3+1 moringa powder bundle (400g) — Melbourne, Australia”) — acceptable; avoid repeating “Melbourne Australia” on every thumbnail if decorative.

### Lazy loading

- Not detected in JSON scrape — verify `loading="lazy"` on below-fold images.

### Decorative images

- Icons / dividers should use `alt=""` — not verified.

---

## 5. Internal linking

### Orphaned pages (few inlinks)

- **Labs tools** (`/nutrithrive_labs/sitemap-generator`) — linked from map; few commercial internal links — low PageRank flow (acceptable for tools).

### Homepage links to “too few” money pages

- Homepage extract shows links to **melbourne**, **product URLs**, **several blog posts**, **cart**, **legal** — reasonable breadth; **newsletter** under-linked from home (appears in blog footer more).

### Blog posts — related content

- Strong on **moringa Melbourne guide** and **where to buy** (good internal links to product + comparisons).
- **Coffee article** includes link to `https://nutrithrive.com.au/blog/benefits-moringa-powder/` — **likely broken** (verify; not in sitemap list).

### CTAs to conversion

- Many posts link `/products/moringa-powder/` — good.  
- **Canonical consolidation errors** effectively tell Google a post “is” the product or home — undermines internal linking equity (see §7).

---

## 6. Content quality

### Under 300 words

- **404 page** — 38 words (expected).
- **Newsletter** — ~303 words — OK as utility page.

### Thin / duplicate feel

- **Buy moringa landing** vs **product page** + **canonical to product** — intentional funnel or duplicate; clarify strategy.

### No clear CTA

- **Labs home** — tool list; low commercial CTA (fine).

### E-E-A-T signals

- Many posts: `author` in metadata (`NutriThrive`, `NutriThrive Research Team`, `NutriThrive Founder`) — good.  
- **Visible byline / date** on page not verified in scrape — recommend visible “Updated May 2026” + author on article template.

---

## 7. URL structure

### Uppercase

- None critical in paths.

### Underscores

- **`/nutrithrive_labs/`** — underscore in segment; hyphenated `nutrithrive-labs` would be more conventional (optional, low priority vs canonical mess).

### Long URLs (>75 chars)

- Several blog filenames exceed 75 characters — acceptable for SEO if content matches; monitor **crawl budget** (not a major issue at this site size).

### Dynamic parameters

- No `?id=` issues observed on core pages.

### Trailing slash vs `.html` inconsistency

- Internal links mix `…/blog/foo` and `…/blog/foo.html` — standardize redirects + canonical.

---

## 8. Canonical tags — **critical cluster**

These **hurt indexing** if wrong: Google may drop URLs or merge wrong signals.

| Page | Canonical observed | Problem |
|------|-------------------|---------|
| /about | https://nutrithrive.com.au/ | Points to **homepage**, not /about |
| /melbourne | https://nutrithrive.com.au/ | Points to **homepage** |
| /products | https://nutrithrive.com.au/ | Points to **homepage** |
| /products/moringa-soap/ | https://nutrithrive.com.au/ | Points to **homepage** |
| /products/curry-leaves/ | …/products/dried-curry-leaves | **Slug mismatch** vs live URL |
| /products/black-tea/ | …/products/premium-black-tea | **Slug mismatch** |
| /products/combo-pack/ | …/products/premium-combo-pack | **Slug mismatch** |
| /blog/moringa-vs-coffee-melbourne-energy-hack.html | https://nutrithrive.com.au/blog/ | Points to **blog index** |
| /blog/is-moringa-legit… | …/products/moringa-powder/ | Article → **product** |
| /blog/does-moringa-have-caffeine… | …/products/moringa-powder/ | Article → **product** |
| /blog/science-shade-drying… | …/products/moringa-powder/ | Article → **product** |
| /blog/how-to-read-moringa-batch-codes… | …/products/moringa-powder/ | Article → **product** |
| /blog/smart-moringa-daily-intake… | …/blog/moringa-powder-guide… | **Different article URL** |
| /blog/moringa-powder-guide… | …/blog/honest-australians-guide-moringa-powder-2026 | **Different article** |
| /blog/nutrithrive-delivers-across-victoria… | https://nutrithrive.com.au/ | **Homepage** |
| /blog/rosabella-moringa-reviews… | …/moringa-powder-vs-capsules-which-one-actually-works-better-2026 | **Wrong article** |
| /blog/moringa-chemist-warehouse… | …/blog/rosabella-vs-nutrithrive | Verify path exists 200 |
| /blog/best-superfoods… | …/blog/australian-wellness-renaissance-2026 | Verify path |
| /blog/30-day-moringa-coffee-reset… | …/blog/moringa-coffee | Verify path |
| /blog/how-to-use-moringa-powder-daily… | …/how-to-add-moringa-to-diet.html | **Different URL** |
| /blog/growing-moringa-australia… | …/growing-moringa-in-australia | **Non-/blog path** |
| /blog/healthy-snack-melbourne… | …/melbourne-wellness-trend-functional-snack-shift-2026 | Verify |
| /pages/newsletter/ | https://nutrithrive.com.au/newsletter | May not match served URL |
| /nutrithrive_labs/ | …/nutrithrive_labs/converter | **Labs hub → single tool** |

**Pages with self-referencing canonical (good examples):**  
`where-to-buy…`, `affordable-superfoods…`, `moringa-quality-test…`, `complete-buyers-guide…`, `plant-based…`, `chinese-review…`, `best-protein-powder-australia.html`, `privacy-policy`, `shipping-returns`, `contact`, `moringa-vs-spirulina…`, `10-dollar-superfood…`, `why-i-built…`, `melbourne-food-as-medicine-map…`.

---

## 9. Schema / structured data

### Present

- **Homepage:** Organization, Product, Article.  
- **FAQ:** FAQPage.  
- **Contact:** ContactPage, LocalBusiness.  
- **Shipping:** FAQPage, Organization, ContactPoint.  
- **Privacy:** WebPage, FAQPage.  
- **Many blogs:** Article, BlogPosting, Product, FAQPage, HowTo, Review (varies).

### Invalid or dubious types

- **Newsletter page:** `Newsletter`, `Health`, `Subscription` as schema types — **not standard schema.org @types** for Google rich results; likely invalid JSON-LD.

### Missing recommended types

- **Product pages:** ensure `Product` + `Offer` + `AggregateRating` (only if real reviews policy-compliant).  
- **Blog:** add `BreadcrumbList` site-wide.  
- **LocalBusiness** on homepage (Melbourne entity) — partial via contact; consider **LocalBusiness** on `/melbourne` with `areaServed`.

### Article schema on posts with product canonical

- **High risk:** Article JSON-LD on a URL canonicalized to **product** or **home** sends **conflicting signals**.

---

## 10. Indexation / sitemap integrity

- **https://nutrithrive.com.au/blog/best-protein-energy-bars-australia-2026-supermarket-guide.html** returns **404** but is listed in repo `sitemap.xml` — **remove from sitemap until live**, or deploy the page.

---

## Priority order for dev fixes

1. Fix **canonical tags** sitewide (template-level).  
2. Fix **H1** on pillar posts (brands comparison, batch codes, is-moringa-legit).  
3. Align **title / og:title / H1** on Rosabella post.  
4. Remove **404** from sitemap + fix internal links to missing URLs.  
5. Validate **FAQ** `<title>` and description in HTML source.
