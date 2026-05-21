# NutriThrive SEO Diagnostic Report

**Generated:** 21 May 2026 (local codebase scan)  
**Site:** nutrithrive.com.au (static HTML, Netlify `_redirects`)  
**Scanner:** `scripts/seo-diagnostic-phase1.mjs` → `audit/seo-diagnostic-phase1-data.json`  
**Mode:** Detect and report only — **no fixes applied**

---

## Executive Summary

| Metric | Count |
|--------|------:|
| HTML files scanned (repo) | 152 |
| Indexable production pages (approx.) | ~67 |
| **Critical issues** | **5 categories** |
| **Warnings** | **6 categories** |
| **Notices** | **4 categories** |

| Severity | Issue | Count (production-focused) |
|----------|--------|---------------------------|
| Critical | Duplicate blog URLs (.html vs extensionless) | **42 pairs** |
| Critical | Broken internal links (live content) | **5+ URLs** |
| Critical | Broken images | **1** |
| Critical | Hreflang / canonical mismatches | **≥1 confirmed** (Semrush: 39) |
| Critical | Invalid structured data (Semrush) | **10** (manual re-test recommended) |
| Warning | Identical `<title>` and `<h1>` | **22 blog posts** |
| Warning | Titles &gt; 60 characters | **20 blog URLs** |
| Warning | Low text-to-HTML ratio | **multiple blog posts** (heavy Tailwind boilerplate) |
| Warning | Unminified CSS/JS (referenced assets) | **19 large files**, **991+ references** (Semrush) |
| Notice | Orphan / weak internal linking | **~35** (Semrush; many posts only on `/blog/` grid) |
| Notice | Non-descriptive anchor text | **7** (production) |
| Notice | Missing `/llms.txt` | **1** |
| Notice | Cart/payment `noindex` | **OK** (intentional) |

**Important:** Your live site’s **canonical convention is `.html` blog URLs** (sitemap, canonical tags, on-disk files). That differs from the sample prompt (“keep URL without .html”) but matches current Netlify rules and GSC setup. Phase 2 should **not flip** canonicals without updating sitemap, canonicals, and `_redirects` together.

---

## 🔴 CRITICAL ISSUES (Must Fix Immediately)

### 1. Duplicate URL problem

**Total duplicate pairs found:** **42** (one per live blog post file)

Each post exists as:

- **URL A (extensionless):** `/blog/{slug}`
- **URL B (with .html):** `/blog/{slug}.html` ← **file on disk, sitemap, canonical**

#### Site configuration today

| Signal | Extensionless `/blog/slug` | `.html` `/blog/slug.html` |
|--------|---------------------------|---------------------------|
| Physical file | No (only `.html` exists) | **Yes** |
| `sitemap.xml` | Not listed | **Listed (all 42 posts)** |
| `<link rel="canonical">` | N/A on file | **Points to `.html`** |
| Explicit `_redirects` 301 → `.html` | **Only 13 slugs** | Target URL |
| **29 slugs** | No explicit redirect rule in `_redirects` | — |

Semrush still reports duplicates because **both URLs can resolve as 200** on Netlify (pretty URLs / implicit `.html` serving). Crawlers see duplicate content.

#### Example: `10-dollar-superfood-replaced-200-supplement-stack-australia-2026`

```
Blog Post: "10-dollar-superfood-replaced-200-supplement-stack-australia-2026"
├─ URL 1: /blog/10-dollar-superfood-replaced-200-supplement-stack-australia-2026
│  └─ In sitemap: NO
│  └─ Explicit 301 → .html in _redirects: NO
│  └─ Status (live): Often 200 (duplicate risk)
├─ URL 2: /blog/10-dollar-superfood-replaced-200-supplement-stack-australia-2026.html
│  └─ In sitemap: YES
│  └─ Canonical: YES (self)
│  └─ Status: 200 (canonical)
└─ RECOMMENDATION: Keep URL 2 (.html). Add blanket rule:
    /blog/:slug  /blog/:slug.html  301
    (for all 42 slugs, or Netlify equivalent)
```

#### Slugs with explicit extensionless → `.html` redirect (13)

Examples already in `_redirects`: `fresh-moringa-leaves-vs-powder-nutrients-2026`, `how-much-moringa-powder-per-day-dosage-guide-2026`, `is-moringa-banned-australia-truth-2026`, `moringa-benefits-for-women-comprehensive-2026`, etc.

#### Phase 2 action

1. Add **catch-all** 301: extensionless → `.html` for every live blog slug (or switch entire site to extensionless and 301 `.html` → extensionless — **pick one strategy, do not mix**).
2. Ensure **internal links** use canonical `.html` hrefs (most already do via `blog-articles.js`).
3. Re-submit `sitemap.xml` after consolidation.

---

### 2. Broken links (404s)

#### Production 404 targets (content missing or retired)

| 404 URL | Linked from (production) | Clicks (your note) | Action |
|---------|--------------------------|--------------------|--------|
| `/llms.txt` | None in HTML (crawler discovery) | 0 | **Create** `llms.txt` at site root |
| `/blog/melbourne-food-as-medicine-map-cafes-organic-stores-healthspan-eating-2026.html` | `blog/affordable-superfoods-organic-tax-marketplace-wellness-vic-nsw-qld-2026.html`, `pages/homepage/melbourne.html` | 2 | **301** to similar live post OR restore article. `_redirects` already maps this URL → **404** (intentionally removed) |
| `/blog/budget-greens-powder-australia-under-20-2026.html` | `blog/how-to-choose-greens-powder-australia-2026.html` (related card) | — | **Fix link** → `best-greens-powder-australia-2026.html` or create post |

#### Malformed / wrong-path links (production)

| Source | Bad href | Issue |
|--------|----------|--------|
| `blog/moringa-melbourne-complete-growers-report-2026.html` | `/https://nutrithrive.com.au/blog/how-to-grow-moringa-in-australia-complete-guide-2026.html` | Leading `/https://` — broken |
| `pages/shipping/shipping-returns.html` | `/shipping-returns.html` | Should be `/pages/shipping/shipping-returns` or pretty URL per `_redirects` |
| `products/index.html` | `/curry-leaves/`, `/black-tea/`, etc. | Missing `/products/` prefix |
| `pages/homepage/index.html` | `click here` → `https://nutrithrive.com.au` | OK external; anchor text issue (see §13) |

**Note:** 80+ additional “broken” hits in the raw scan are from **`scripts/templates/v2/*-test.html`** (preview only) — not deployed.

---

### 3. Broken images

```
BROKEN IMAGES
=============
Image: /assets/images/blog/vic-seniors-720.jpg
├─ Used on pages: blog/moringa-powder-victoria-seniors-joint-health.html
├─ File exists: NO (glob found 0 files)
└─ ACTION: Add image asset OR replace src with existing product/blog image
```

No other broken **production** blog image paths detected in this pass.

---

### 4. Hreflang conflicts

**Pages with hreflang tags (production):** **48**

Typical pattern (OK in isolation):

```html
<link rel="alternate" hreflang="en-AU" href="https://nutrithrive.com.au/blog/...">
<link rel="alternate" hreflang="x-default" href="https://nutrithrive.com.au/blog/...">
<link rel="canonical" href="https://nutrithrive.com.au/blog/...">
```

#### Confirmed conflict example

**Page:** `/blog/buy-moringa-powder-melbourne-victoria-chinese-guide.html`

| Tag | URL |
|-----|-----|
| `canonical` | `.../buy-moringa-powder-melbourne-victoria-chinese-guide.html` |
| `hreflang="zh-CN"` | `.../buy-moringa-powder-melbourne-victoria-chinese-guide.html` |
| `hreflang="en-AU"` | `.../where-to-buy-moringa-in-australia-online-vs-stores-2026-guide.html` ❌ |
| `hreflang="x-default"` | `.../where-to-buy-moringa-in-australia-online-vs-stores-2026-guide.html` ❌ |

**Issue:** Alternate language URLs do not match the canonical page — Semrush flags as hreflang conflict.

**Recommendation:** Point all hreflang variants to the same URL as canonical, or use separate URLs per language with matching reciprocals.

---

### 5. Invalid structured data

**Automated JSON parse check:** 0 syntax errors on sampled Product pages (offers present on moringa product).

**Semrush reports 10 invalid items** — likely FAQ/Product/Article field-level issues (e.g. duplicate FAQ, missing `image` on Article, `HealthFoodStore` + `Product` overlap). 

**Phase 2:** Re-validate each URL in [Google Rich Results Test](https://search.google.com/test/rich-results):

- `/products/moringa-powder/` (Product, FAQPage, LocalBusiness)
- Top traffic blog posts with `Article` / `FAQPage` JSON-LD
- `index.html`, `/blog/index.html`

---

## 🟡 WARNINGS (Should Fix Soon)

### 6. Duplicate H1 and title tags

**Blog posts with identical `<title>` and `<h1>` (case-insensitive):** **22**

| Page | Title (= H1) | Match |
|------|----------------|-------|
| `/blog/best-greens-powder-australia-2026.html` | Best Greens Powder Australia 2026 Compared | 100% ❌ |
| `/blog/best-superfoods-australia-comparison-health-conscious-adults.html` | Australia 2026 Top Superfoods: 10 Picks for Busy Adults | 100% ❌ |
| `/blog/chronic-fatigue-what-actually-fixed-it-2026.html` | I Was Tired for 3 Years Straight. Here's What Helped My Energy (2026) | 100% ❌ |
| `/blog/cortisol-belly-fat-couldnt-lose-stomach-melbourne-2026.html` | I Couldn't Lose My Belly Fat... Cortisol (2026) | 100% ❌ |
| `/blog/green-superfood-smoothie-recipes-australia-2026.html` | Green Superfood Smoothie Recipes Australia 2026 | 100% ❌ |
| `/blog/how-to-add-moringa-to-diet.html` | How to Add Moringa to Your Diet: Easy Ways 2026 | 100% ❌ |
| `/blog/moringa-30-day-challenge-honest-results.html` | I Took Moringa Every Day for 30 Days: My Honest Results | 100% ❌ |
| `/blog/moringa-melbourne-complete-guide-2026.html` | Moringa Melbourne: Honest Guide + Safety Facts (2026) | 100% ❌ |
| `/blog/moringa-quality-test-shade-dried-vs-retail-australia-2026.html` | Moringa Quality Test: Shade-Dried vs Store-Bought | 100% ❌ |
| `/blog/moringa-vs-spirulina-vs-matcha-comparison-australia.html` | Moringa vs Spirulina vs Matcha (Australia 2026) | 100% ❌ |
| `/blog/science-shade-drying-vs-sun-drying-moringa.html` | Shade- vs Sun-Dried Moringa: Colour & Quality Guide (2026) | 100% ❌ |
| `/blog/verify-moringa-quality-premium-buyers-checklist-2026.html` | How to Verify Moringa Quality: 8-Point... (2026) | 100% ❌ |
| …plus 10 more (see `audit/seo-diagnostic-phase1-data.json` → `h1TitleDupes`) | | |

**Recommendation:** Keep SEO title; rewrite H1 as human, specific headline (warehouse testing angle, Melbourne, etc.).

---

### 7. Titles too long (&gt; 60 characters)

**Blog URLs over 60 chars:** **20** (Semrush cited 13 site-wide)

| Page | Length | Title (truncated) |
|------|-------:|-------------------|
| `/blog/cortisol-belly-fat-couldnt-lose-stomach-melbourne-2026.html` | 83 | I Couldn't Lose My Belly Fat No Matter What I Did. Turns Out It Was Cortisol (2026) |
| `/blog/chronic-fatigue-what-actually-fixed-it-2026.html` | 69 | I Was Tired for 3 Years Straight. Here's What Helped My Energy (2026) |
| `/blog/quit-sugar-90-days-honest-diary-melbourne-2026.html` | 78 | I Quit Sugar for 90 Days: Honest Diary (Including the Tim Tam Meltdown) (2026) |
| `/blog/how-to-choose-greens-powder-australia-2026.html` | 76 | How to Choose the Right Greens Powder: Complete Buyer's Guide Australia 2026 |
| `/blog/how-to-choose-moringa-powder-australia-2026.html` | 74 | How to Choose Moringa Powder in Australia (2026 Buyer Guide) \| NutriThrive |
| `/blog/` (index) | 68 | NutriThrive Blog \| Moringa, Superfoods & Melbourne Wellness 2026 |
| …see JSON `longTitles` for full list | | |

**Suggested pattern:** Primary keyword first, brand/year at end, target **≤ 58 characters**.

---

### 8. Low text-HTML ratio

Blog v2 templates embed **large Tailwind config blocks** and repeated CSS links in `<head>`, inflating HTML size vs visible article text.

**Examples (from scan, ratio &lt; 15%):** Multiple long-form posts; exact rows in `audit/seo-diagnostic-phase1-data.json` → `lowRatio`.

**Issue:** Crawlers see heavy markup vs prose (Semrush warning).

**Recommendation (Phase 2):** Deduplicate `<head>` assets, move Tailwind config to one shared file, trim duplicate `blog-v2-prose.css` link repetitions in article HTML (some posts link CSS 8+ times).

---

### 9. Low word count

| Page | Words in main content | Note |
|------|----------------------:|------|
| `/blog/` (index) | **123** | Hub page — OK if supplemented by card titles via JS |
| `/pages/shop/payment.html` | 67 | Checkout — should stay `noindex` |
| `/pages/benefits/moringa-benefits.html` | 12 | Redirect stub to blog |

**Thin blog articles (&lt; 300 words):** None of the 42 main posts flagged; Semrush’s “2 pages” may be hub/utility URLs.

---

### 10. Unminified CSS/JS

**Referenced unminified assets (top by size, used on multiple pages):**

| File | Approx. role | Pages referencing |
|------|----------------|-------------------|
| `/styles/global/style.css` | Global layout | Site-wide |
| `/blog/blog-v2-prose.css` | Blog prose | 42+ blogs |
| `/shared/js/layout-v2.js` | Header/footer | v2 pages |
| `/scripts/global/cart.js` | Cart | Shop pages |
| `/assets/css/design-system.css` | Tokens | Many pages |

**Semrush “991 instances”** counts every HTML reference to non-`.min.` assets across all pages.

**Recommendation:** Build step to minify + bundle, or serve minified copies with same URLs via Netlify build plugin.

---

## 🔵 NOTICES (Nice to Have)

### 11. AI bot blocking (cart / payment)

| Page | robots meta | Status |
|------|-------------|--------|
| `/pages/shop/cart.html` | `noindex, follow` | **OK** ✅ |
| `/pages/shop/payment.html` | `noindex, follow` | **OK** ✅ |
| `/pages/shop/thank-you.html` | `noindex, follow` | **OK** ✅ |

Pretty URLs `/cart`, `/payment` rewrite to these files via `_redirects`.

---

### 12. Orphaned / weak internal linking

**Strict scan (≤1 incoming internal link):** 4 URLs in JSON.

**Semrush “35 orphaned”** aligns with: **42 blog posts** mostly discovered via **JS-rendered blog grid** on `/blog/` plus occasional related-post links — few editorial cross-links between clusters.

**Recommendation:** Add 2–3 contextual internal links per post to pillar pages:

- `what-does-moringa-do-for-your-body-complete-guide-2026.html`
- `how-much-moringa-powder-per-day-dosage-guide-2026.html`
- `verify-moringa-quality-premium-buyers-checklist-2026.html`

---

### 13. Non-descriptive anchor text

| Source | Anchor | Target |
|--------|--------|--------|
| `pages/homepage/index.html` | click here | https://nutrithrive.com.au |
| `products/moringa-powder/index.html` | Learn more (×5) | NIH / NCBI external sources |

Blog posts use “Learn more about …” with trailing keywords — borderline; product page external “Learn more” is the main Semrush hit.

---

### 14. Missing llms.txt

```
MISSING FILES
=============
File: /llms.txt
├─ Status: 404 ❌
├─ Purpose: AI crawler / LLM site summary (emerging standard)
└─ ACTION: Create at repo root with business name, URLs, contact, content policy
```

---

## 🎯 PRIORITIZED FIX LIST

### Week 1 — Critical

1. **Duplicate URLs:** Blanket 301 extensionless → `.html` for all blog slugs (align with sitemap).
2. **Broken links:** Fix melbourne-food links, budget-greens link, malformed `/https://` href, products index paths.
3. **Broken image:** Add or replace `vic-seniors-720.jpg`.
4. **Hreflang:** Fix Chinese guide + audit all 48 hreflang pages.
5. **Structured data:** Rich Results Test on product + top 10 blogs.

### Week 2 — Important

6. Differentiate H1 from title (22 posts).
7. Shorten 20 long titles.
8. Expand internal linking between blog clusters.

### Week 3 — Optimization

9. Minify / dedupe CSS and JS references.
10. Create `llms.txt`.
11. Reduce duplicate Tailwind/CSS in blog `<head>`.

### Week 4 — Verification

12. Full site test (home, product, blog, cart, PayPal).
13. Submit sitemap in GSC.
14. Re-run Semrush crawl.

---

## 📁 FILES TO MODIFY (Phase 2 preview)

| Fix type | Files |
|----------|--------|
| Duplicate URLs | `_redirects`, optionally `scripts/build-sitemap.js` |
| Broken links | `blog/how-to-choose-greens-powder-australia-2026.html`, `blog/affordable-superfoods-...`, `pages/homepage/melbourne.html`, `blog/moringa-melbourne-complete-growers-report-2026.html`, `products/index.html`, `pages/shipping/shipping-returns.html` |
| Broken image | `blog/moringa-powder-victoria-seniors-joint-health.html` + `assets/images/blog/` |
| Hreflang | `blog/buy-moringa-powder-melbourne-victoria-chinese-guide.html` + posts with alternate links |
| H1/title | 22× `blog/*.html` |
| Long titles | 20× `blog/*.html`, `blog/index.html` |
| llms.txt | **New** `/llms.txt` |
| Head bloat | 42× blog HTML or blog build template |
| Minify | `styles/`, `shared/js/`, `scripts/` (build pipeline) |

---

## How to re-run this diagnostic

```bash
cd /Users/neervasa/Desktop/Website
node scripts/seo-diagnostic-phase1.mjs
```

Output: `audit/seo-diagnostic-phase1-data.json`

---

## Next step

**Review this report.** When ready, send **Phase 2 fix prompt** — fixes should be staged (critical → content → optimization) with testing after each deploy.

**Do not run Phase 2 blindly** — especially duplicate URL strategy (must match sitemap + canonicals already on `.html`).
