# NutriThrive Digital Marketing Audit — Complete Report

**Website:** https://nutrithrive.com.au  
**Industry:** Moringa powder / superfood supplements, Australia  
**Product:** Lab-tested moringa powder, $11/100g, Melbourne-based (Truganina), ships Australia-wide  
**Audit date:** 21 May 2026  
**Method:** Full static analysis of workspace `/Users/neervasa/Desktop/Website` (68 production HTML pages), `robots.txt`, `sitemap.xml`, `_redirects`, `audit/content-audit-data.json`, `audit/issue-summary.tsv`, automated Node scans  
**Limitations:** No live Google Search Console, GA4 dashboard, PageSpeed API, or backlink index access — items marked **verify manually** where external data is required.

**Recent context (included):** Phase 1 redirects deployed; 9 duplicate blog posts deleted; **42** live blog posts; sitemap regenerated (`lastmod` 2026-05-20).

---

## Executive snapshot

| Metric | Value |
|--------|--------|
| **Overall health score** | **72 / 100** |
| **Production HTML pages scanned** | **68** |
| **URLs in `sitemap.xml`** | **61** |
| **Live blog articles** | **42** (+ `blog/index.html`) |
| **301 redirect rules** | ~95 active paths in `_redirects` |
| **404 retired URLs** | ~35 explicit rules |
| **GA4 property (in HTML)** | `G-WH21SW75WP` on 63/68 pages |
| **GSC verification in HTML** | **None found** |

**Score rationale:** Strong product story, deep comparison content, rich schema on homepage/PDP, and Phase 1 cannibalization cleanup lift the score. Deductions for sitemap pollution, broken meta on 3 posts, thin buyer guides, remaining keyword overlap, and inability to confirm live Core Web Vitals without API access.

---

# PART 1: Technical SEO

## 1. CURRENT STATUS

| Area | Status |
|------|--------|
| Site speed (static signals) | ⚠️ |
| Mobile readiness | ✅ |
| robots.txt | ✅ |
| sitemap.xml | ⚠️ |
| URL structure & redirects | ✅ |
| HTTPS / mixed content | ✅ |
| Structured data | ✅ |
| Canonical tags | ⚠️ |

## 2. PRIORITY ISSUES

| Issue | Rating |
|-------|--------|
| Sitemap lists internal/script URLs not meant for indexing | 🔴 |
| Large asset payload (~281 MB under `assets/`) | 🟡 |
| PageSpeed / CWV not measured live in this audit | 🟡 |
| `nutrithrive_labs/` tools indexed at priority 0.3 | 🟢 |
| Decorative images: lazy-load present on many pages; not universal | 🟢 |
| Legacy audit referenced wrong canonicals — **mostly fixed in repo** | ⚪ (monitor in GSC) |

## 3. EXACT ACTIONS

| Action | Target | File / Page | How | Time | Cost |
|--------|--------|-------------|-----|------|------|
| Remove non-public URLs from sitemap | Crawl budget | `scripts/build-sitemap.js` | Add `scripts/quit-sugar-article-body.html`, `scripts/templates/v2/pages/moringa-powder-test.html` to `PATH_BLOCKLIST`; run `node scripts/build-sitemap.js` | 30 min | $0 |
| Confirm CWV after deploy | Mobile LCP/INP | Live URLs | Run PageSpeed Insights on `/`, `/products/moringa-powder/`, longest blog — **verify manually** | 1 hr | $0 |
| Preload LCP hero image | Homepage LCP | `index.html` | Add `<link rel="preload" as="image" href="/assets/images/general/GC.webp">` for hero | 15 min | $0 |
| Audit largest images | CLS / weight | `assets/images/` | Compress any PNG >200 KB; prefer WebP (already dominant) | 2–4 hr | $0 |
| Keep GA deferred pattern | TBT | `index.html`, blogs | `DeferLoader` + interaction-triggered gtag — already in `index.html` lines 11–24 | — | $0 |
| Submit clean sitemap | Indexing | GSC | After rebuild, resubmit `https://nutrithrive.com.au/sitemap.xml` — **verify manually** | 15 min | $0 |
| Review labs in sitemap | Crawl focus | `nutrithrive_labs/` | If tools are not SEO targets, add to blocklist or `noindex` | 30 min | $0 |

### Site speed (static analysis)

| Asset bucket | Files | Approx. size |
|--------------|-------|----------------|
| `assets/` | 225 | **~281 MB** |
| `styles/` | 21 | ~719 KB |
| `shared/` | 24 | ~341 KB |
| `shared/js` (via scripts) | 16 | ~206 KB |

- **Render-blocking:** Homepage defers GA via injected script (`index.html` ~lines 11–24). Product pages use `/scripts/global/defer-loader.js` + async gtag pattern.
- **Lazy-load:** Present on contact map iframe and many `<img loading="lazy">` patterns; **33 blog pages** still have 3/5 images without meaningful `alt` (likely decorative sidebars).
- **Live PageSpeed:** Not run in this session — **verify manually** at https://pagespeed.web.dev/

### Mobile

- **Viewport:** Present on all 68 scanned pages (`width=device-width, initial-scale=1.0`).
- **Tap targets:** `shared/css/style.css` line ~199 sets `min-height: 44px` on interactive elements — good baseline.
- **Responsive CSS:** Tailwind-style utility classes + `shared/css/v2-extra.css` breakpoints.

### robots.txt

- **Path:** `/robots.txt`
- **Status:** `Allow: /` for major bots + AI crawlers (GPTBot, Claude-Web, PerplexityBot, etc.).
- **Sitemap declaration:** `Sitemap: https://nutrithrive.com.au/sitemap.xml` ✅
- **No accidental blocks** on `/blog/`, `/products/`, `/pages/`.

### sitemap.xml validity

- **61 `<loc>` entries** (generated 2026-05-20).
- **Problems found:**
  1. `https://nutrithrive.com.au/scripts/quit-sugar-article-body.html` — fragment/body file, not a page.
  2. `https://nutrithrive.com.au/scripts/templates/v2/pages/moringa-powder-test.html` — test template.
- **Includes:** `nutrithrive_labs/` (low priority 0.3) — acceptable if intentional lead-gen; otherwise deprioritize.
- **Aligned with live blog count:** 42 blog `.html` files match sitemap blog URLs (deleted Phase 1 posts correctly absent).

### URL structure & `_redirects`

- **HTTPS + apex:** Lines 187–190 force `https://nutrithrive.com.au` (www → non-www 301) ✅
- **Pretty URLs:** 200 rewrites for `/about`, `/contact`, `/cart`, `/products/moringa-powder/`, `/melbourne/` ✅
- **Phase 1 (May 2026):** Duplicate buyer guides, dosage, safety, and mega-guide posts → canonical targets (301), e.g.:
  - `smart-moringa-daily-intake…` → `how-much-moringa-powder-per-day-dosage-guide-2026.html`
  - `honest-australians-guide…` → `verify-moringa-quality-premium-buyers-checklist-2026.html`
  - Deleted competitor comparison posts → product or buyer guides
- **404 hygiene:** Off-topic posts (protein gyms, hiking, etc.) return explicit 404 — good for crawl clarity.
- **Risk:** Long redirect map (~230 lines) — **verify manually** with Screaming Frog for chains >1 hop after deploy.

### HTTPS / mixed content

- **0** `http://` references to third-party assets on production pages (scan of 68 HTML files).
- All canonicals use `https://nutrithrive.com.au`.

### Schema (key pages)

| Page | Types detected |
|------|----------------|
| `index.html` | WebSite, Organization, LocalBusiness, Product (multi-SKU), BreadcrumbList, AggregateRating |
| `products/moringa-powder/index.html` | Product, Offer, Shipping, MerchantReturnPolicy, Brand |
| Blog samples | Article, FAQPage, BreadcrumbList (e.g. `blog/chronic-fatigue-…`, `blog/how-much-moringa…`) |
| `pages/contact/contact.html` | LocalBusiness + `hasMap` Google Maps URL |
| `pages/faq/faq.html` | FAQ-oriented content (confirm FAQPage JSON-LD — **verify manually** on live render) |

### Canonical tags (current repo state)

**Fixed since earlier audits:** `pages/about/about.html` → `https://nutrithrive.com.au/about`; `pages/homepage/melbourne.html` → `https://nutrithrive.com.au/melbourne/`; `products/moringa-soap/index.html` → self URL.

**Remaining watch items:**

| Page | Canonical | Note |
|------|-----------|------|
| `buy-moringa-powder-australia/index.html` | `https://nutrithrive.com.au/buy-moringa-powder-australia/` | Mid-funnel; may compete with PDP — decide one primary URL in GSC |
| `pages/benefits/moringa-benefits.html` | Self path under `/pages/benefits/` | Redirects in `_redirects` send legacy URLs to `how-to-add-moringa-to-diet.html` — ensure no index bloat |

---

# PART 2: On-Page SEO

## 1. CURRENT STATUS

| Area | Status |
|------|--------|
| Title tags | ⚠️ |
| Meta descriptions | ⚠️ |
| H1 / heading hierarchy | ⚠️ |
| Word count / thin content | ⚠️ |
| Image alt text | ⚠️ |
| Internal links | ⚠️ |
| Orphan pages | 🟡 |

## 2. PRIORITY ISSUES

| Issue | Rating |
|-------|--------|
| 3 posts share broken duplicate meta (`meta_len` 26) | 🔴 |
| 32 titles exceed ~60 display characters | 🟡 |
| 28 pages under 1,000 words (incl. 12 blogs) | 🟡 |
| 4 pages with multiple H1 | 🟡 |
| 33 pages with 3+ images missing/empty alt | 🟡 |
| 0 duplicate titles across 68 pages | ✅ |
| 1 duplicate meta description string | 🔴 |

## 3. EXACT ACTIONS

| Action | Target | File / Page | How | Time | Cost |
|--------|--------|-------------|-----|------|------|
| Fix escaped meta descriptions | SERP CTR | `blog/chronic-fatigue-what-actually-fixed-it-2026.html`, `blog/cortisol-belly-fat-…`, `blog/quit-sugar-90-days-…` | Replace `\"` in `content="..."` with `&quot;` or rewrite without embedded quotes (line ~40 chronic-fatigue) | 30 min | $0 |
| Shorten long titles | SERP display | 32 URLs in scan output | Trim to ≤60 chars; drop redundant `\| NutriThrive` on blogs | 2 hr | $0 |
| Expand thin buyer guides | Rankings | `how-to-choose-moringa-powder-australia-2026.html` (694 w), `how-to-add-moringa-to-diet.html` (628 w), `how-much-moringa…` (836 w) | Add 400–600 words: tables, FAQ, internal links to PDP | 1 day | $0 |
| Demote extra H1 to H2 | On-page clarity | 4 blogs listed in scan | Single H1 per URL | 1 hr | $0 |
| Add alt to decorative sidebar imgs | Accessibility | Blog template / shared partial | `alt=""` for decorative; descriptive alt for product shots | 2 hr | $0 |
| Strengthen `/products` hub | Category SEO | `products/index.html` (~443 words) | 300+ words + links to shipping, FAQ, top 3 guides | 2 hr | $0 |

### Title tag summary (68 pages)

| Check | Count |
|-------|-------|
| Missing title | **0** |
| Duplicate titles | **0** |
| Length <30 or >60 chars | **32** (mostly >60) |

**Examples needing trim:**
- `blog/best-greens-powder-australia-2026.html` — 81 chars
- `blog/cystic-acne-gut-healing-what-actually-cleared-skin-2026.html` — 89 chars
- `index.html` — 68 chars (acceptable but monitor truncation)

### Meta description summary

| Check | Count |
|-------|-------|
| Missing | **0** |
| Duplicate exact meta | **1** (3 URLs) |
| Length <120 or >160 | **28** |

**Critical duplicate (broken parsing):**

| URL | Problem |
|-----|---------|
| `/blog/chronic-fatigue-what-actually-fixed-it-2026.html` | Meta breaks at `Exhausted for years with \"` → ~26 chars stored |
| `/blog/cortisol-belly-fat-couldnt-lose-stomach-melbourne-2026.html` | Same |
| `/blog/quit-sugar-90-days-honest-diary-melbourne-2026.html` | Same |

### H1 summary

| Check | Count |
|-------|-------|
| Missing H1 | **0** |
| Multiple H1 | **4** |

**Multiple H1 files:**
- `blog/affordable-superfoods-organic-tax-marketplace-wellness-vic-nsw-qld-2026.html`
- `blog/moringa-vs-coffee-melbourne-energy-hack.html`
- `blog/nutrithrive-dried-curry-leaves-tradition-health.html`
- `blog/why-i-built-nutrithrive-moringa-real-story-finest-moringa-powder.html`

**Homepage:** Now **single H1** at `index.html` line 1035 — prior audit’s “4 H1” issue appears **resolved**.

### Thin content (<1,000 words) — full list

**Commercial / utility (expected thinner):**
- `pages/benefits/moringa-benefits.html` (12) — redirect target; consider noindex
- `pages/contact/index.html` (13) — stub
- `pages/products/index.html` (13) — stub
- `pages/homepage/index.html` (19) — stub
- `pages/shop/cart.html` (39)
- `blog/index.html` (106) — listing shell
- `pages/contact/contact.html` (137)
- `pages/newsletter/index.html` (284)
- `pages/shipping/shipping-returns.html` (433)
- `products/index.html` (443)
- `index.html` (885)

**Blog posts under 1,000 words (priority expand):**
| File | Words |
|------|-------|
| `blog/buy-moringa-powder-melbourne-victoria-chinese-guide.html` | 945 |
| `blog/does-moringa-have-caffeine-truth-about-energy-focus-side-effects-2026.html` | 978 |
| `blog/how-much-moringa-powder-per-day-dosage-guide-2026.html` | 844 |
| `blog/how-to-add-moringa-to-diet.html` | 631 |
| `blog/how-to-choose-moringa-powder-australia-2026.html` | 681 |
| `blog/how-to-use-moringa-powder-daily-without-the-bad-taste-2026.html` | 771 |

### Internal linking & orphans

- **Hub pages** link to flagship PDP and major blogs from homepage ✅
- **Weak cross-link:** Secondary PDPs (black tea, soap) — add body links from moringa PDP and 1 relevant blog each
- **Orphan scan:** Static link graph incomplete (relative URL variants); use Screaming Frog **verify manually** for true inlink counts
- **`audit/content-audit-data.json` cannibal map** still lists **deleted** URLs (e.g. `honest-australians-guide…`) — regenerate audit JSON after Phase 1

---

# PART 3: Off-Page SEO

## 1. CURRENT STATUS

| Area | Status |
|------|--------|
| Backlink profile | ❓ (not measurable from files) |
| Brand mentions | ❓ |
| Local citations | ⚠️ |
| Reviews / social proof on-site | ✅ |

## 2. PRIORITY ISSUES

| Issue | Rating |
|-------|--------|
| No backlink or DA data in repo | ⚪ (tooling) |
| Melbourne local pack not verifiable offline | 🟡 |
| Competitor domains likely stronger (Chemist Warehouse, marketplace sellers) | 🟡 |

## 3. EXACT ACTIONS

| Action | Target | How | Time | Cost |
|--------|--------|-----|------|------|
| Run Ahrefs/Semrush backlink report | nutrithrive.com.au | Export referring domains; compare to Rosabella, generic “moringa australia” rankers — **verify manually** | 2 hr | $99–129/mo |
| Pursue AU health blog guest posts | DR 30+ sites | Pitch shade-drying science, Melbourne supply chain story | Ongoing | $0–500/post |
| Google Business Profile | Truganina address | Ensure NAP matches `index.html` schema (15 Europe St) — **verify manually** | 1 hr | $0 |
| HARO / SourceBottle | PR links | Founder story from `why-i-built-nutrithrive…` blog | Monthly | $0 |

**Limitation statement:** Off-page authority, referring domains, and domain rating **cannot** be measured from the codebase. Recommend Ahrefs, Semrush, or Moz for quarterly tracking.

---

# PART 4: Content Strategy

## 1. CURRENT STATUS

| Area | Status |
|------|--------|
| Blog volume (42 posts) | ✅ |
| Topic depth (comparison, safety, Melbourne) | ✅ |
| Cannibalization post-Phase 1 | ⚠️ |
| E-E-A-T (author, dates) | ⚠️ |
| Content gaps | ⚠️ |

## 2. PRIORITY ISSUES

| Issue | Rating |
|-------|--------|
| 12 keyword clusters still overlap across live URLs | 🔴 |
| Stale entries in `content-audit-data.json` (deleted posts) | 🟡 |
| Thin “how-to” cluster vs one pillar | 🟡 |
| Missing TGA-compliant disclaimer block on some YMYL posts | 🟡 |

## 3. EXACT ACTIONS

| Action | Target | How | Time | Cost |
|--------|--------|-----|------|------|
| Declare pillar + supporting URLs per cluster | SEO architecture | See cannibal table below | 4 hr | $0 |
| Regenerate `content-audit-data.json` | `audit/` | Re-run content audit script after deletions | 1 hr | $0 |
| New content: subscription / refill | Retention | Blog + email: “30-day moringa routine” | 1 week | $0 |
| New content: pregnancy / breastfeeding (careful) | Long-tail | Only with qualified review; high risk | — | Legal review |
| Add author byline + `dateModified` | Trust | Blog header partial | 2 hr | $0 |

### Blog inventory (42 live posts)

**Clusters present:**
- **Comparison:** greens powder, spirulina vs matcha, superfoods list, affordable superfoods
- **Buyer intent:** verify quality, choose moringa, where to buy, Chinese Melbourne guide, $11 vs $25 pricing
- **Safety / science:** banned Australia, side effects, caffeine, shade vs sun drying, batch codes
- **Melbourne / lifestyle:** complete guide, growers report, coffee hack, tired eating, personal stories (fatigue, acne, gut, sugar)
- **Product adjacent:** curry leaves, tea, recipes, seniors joint health
- **Brand:** why I built NutriThrive, 30-day challenge results

**Phase 1 deletions (redirected, files removed from repo):**
- `honest-australians-guide-moringa-powder-2026.html`
- `is-moringa-legit-what-science-and-real-users-say-2026.html`
- `melbourne-premium-buyers-guide-moringa-2026.html`
- `moringa-powder-complete-buyers-guide-australia-2026.html`
- `moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html`
- `nutrithrive-delivers-across-victoria…`
- `plant-based-functional-foods…`
- `signs-of-fresh-vs-old-moringa-powder-2026.html`
- `smart-moringa-daily-intake-australia-visual-guide-2026.html`

### Cannibalization clusters (from `audit/content-audit-data.json`)

| Keyword cluster | Competing live URLs (action: pick 1 pillar) |
|-----------------|---------------------------------------------|
| `moringa vs spirulina matcha` | `moringa-vs-spirulina-vs-matcha-comparison-australia.html` **(pillar)** + best-greens, green-smoothie-recipes, how-to-choose-greens |
| `choose moringa powder` | `verify-moringa-quality-premium-buyers-checklist-2026.html` **(pillar)** + how-to-choose-moringa, science-shade-drying, batch-codes |
| `moringa powder australia buy` | `products/moringa-powder/` **(money)** + where-to-buy guide + buy-moringa-powder-australia landing |
| `moringa melbourne` | `moringa-melbourne-complete-guide-2026.html` **(pillar)** + growers report, Chinese guide, melbourne.html |
| `moringa caffeine energy` | `does-moringa-have-caffeine…` **(pillar)** + moringa-vs-coffee, women benefits |
| `moringa banned australia` | `is-moringa-banned-australia-truth-2026.html` **(pillar)** — redirect handled old “legit” URL |
| `shade dried sun dried` | `science-shade-drying-vs-sun-drying-moringa.html` **(pillar)** + quality-test post |

### Content gaps (recommended new/expanded)

1. **Moringa for athletes / gym** — underserved vs protein content removed  
2. **Subscription / repeat order** — commercial intent  
3. **Comparison: NutriThrive vs supermarket brands** (table, not deleted aggressive CW posts)  
4. **Video embed or WebPage schema for lab report walkthrough**  
5. **FAQ hub page** linking top 20 questions (already strong at `/faq` — interlink from blogs)

---

# PART 5: Keyword Strategy

## 1. CURRENT STATUS

| Area | Status |
|------|--------|
| Primary money keywords mapped | ✅ |
| Long-tail blog coverage | ✅ |
| Cannibalization control | ⚠️ |
| Rank tracking | ❓ |

## 2. PRIORITY ISSUES

| Issue | Rating |
|-------|--------|
| Cannot confirm rankings without GSC | ⚪ |
| PDP + blog + landing page compete on “buy moringa australia” | 🔴 |
| Long titles dilute primary keyword in SERP | 🟡 |

## 3. EXACT ACTIONS

| Action | Target keyword | Page | How | Time | Cost |
|--------|----------------|------|-----|------|------|
| Own “buy moringa powder australia” | Transactional | `products/moringa-powder/` | Consolidate `buy-moringa-powder-australia/` links to PDP; canonical already on PDP | 1 hr | $0 |
| Own “how much moringa per day” | Informational | `how-much-moringa-powder-per-day-dosage-guide-2026.html` | Expand to 1,200+ words; FAQ schema | 4 hr | $0 |
| Own “is moringa banned australia” | Trust | `is-moringa-banned-australia-truth-2026.html` | Keep updated; link from PDP FAQ | 1 hr | $0 |
| Track 20 keywords in GSC | All | GSC Performance | Filter Australia, export weekly — **verify manually** | 30 min/wk | $0 |

**Target keyword ↔ URL map (recommended primary):**

| Keyword | Primary URL |
|---------|-------------|
| moringa powder australia | `/products/moringa-powder/` |
| buy moringa powder melbourne | `/blog/moringa-melbourne-complete-guide-2026.html` |
| moringa side effects | `/blog/moringa-side-effects-what-happens-take-too-much-2026.html` |
| moringa vs spirulina | `/blog/moringa-vs-spirulina-vs-matcha-comparison-australia.html` |
| lab tested moringa | `/` + `/blog/verify-moringa-quality-premium-buyers-checklist-2026.html` |

---

# PART 6: UX (User Experience)

## 1. CURRENT STATUS

| Area | Status |
|------|--------|
| Navigation / header | ✅ |
| Mobile layout | ✅ |
| Contact / trust (map) | ✅ |
| Blog readability | ✅ |
| Accessibility (alt, H1) | ⚠️ |

## 2. PRIORITY ISSUES

| Issue | Rating |
|-------|--------|
| Stub pages with almost no body copy | 🟡 |
| Blog index generic H1 | 🟢 |
| Font loading via Google Fonts (print trick) | 🟢 |

## 3. EXACT ACTIONS

| Action | Target | File | How | Time | Cost |
|--------|--------|------|-----|------|------|
| Merge or redirect stub contact/products index | UX | `pages/contact/index.html`, `pages/products/index.html` | 301 to real pages or add content | 1 hr | $0 |
| Improve blog index H1 | Discovery | `blog/index.html` | “Moringa & Superfood Guides for Australia (2026)” | 15 min | $0 |
| Add skip link + focus styles audit | a11y | `shared/css/style.css` | Keyboard test checkout flow | 2 hr | $0 |

**Navigation flow (file structure):**
`index.html` → `/products/moringa-powder/` → `/pages/shop/cart.html` → `/pages/shop/payment.html` → thank-you  
Secondary: `/about`, `/faq`, `/pages/shipping/shipping-returns`, `/blog/`

---

# PART 7: CRO (Conversion Rate Optimization)

## 1. CURRENT STATUS

| Area | Status |
|------|--------|
| Product page persuasion | ✅ |
| Cart / PayPal checkout | ✅ |
| Trust signals (lab, reviews, shipping) | ✅ |
| Free shipping threshold messaging | ✅ |
| Email capture | ⚠️ |

## 2. PRIORITY ISSUES

| Issue | Rating |
|-------|--------|
| Homepage word count low for cold traffic | 🟡 |
| Newsletter value prop generic | 🟡 |
| No visible urgency on PDP (ethical) | 🟢 |
| A/B testing not evidenced in repo | ⚪ |

## 3. EXACT ACTIONS

| Action | Target | File | How | Time | Cost |
|--------|--------|------|-----|------|------|
| Above-fold CTA test | PDP | `products/moringa-powder/index.html` | Sticky “Add to cart” on mobile scroll | 2 hr | $0 |
| Add lab PDF link near price | Trust | PDP | Link `documents/nutrithrive-lab-report-summary.pdf` (redirect exists for old PDF path) | 30 min | $0 |
| Post-purchase email sequence | LTV | Newsletter / ESP | 3-email welcome: how to use, dosage, reorder — **verify manually** in FormSubmit/Sheets | 1 day | $0 |
| Track add-to-cart in GA4 | Measurement | GTM or gtag events | `add_to_cart`, `begin_checkout` — **verify manually** in GA4 | 2 hr | $0 |

**Checkout path:** Cart (`pages/shop/cart.html`) → Payment (`pages/shop/payment.html`) with PayPal SDK (`paypal-create-order`, `paypal-capture-order` Netlify functions).

---

# PART 8: Social Media Marketing (SMM)

## 1. CURRENT STATUS

| Area | Status |
|------|--------|
| OG / Twitter cards | ✅ (67/68 pages) |
| Social profile links | ✅ |
| Reddit pixel | ✅ |
| Consistent posting | ❓ |

## 2. PRIORITY ISSUES

| Issue | Rating |
|-------|--------|
| Cannot audit posting cadence from repo | ⚪ |
| Instagram handle in schema: `nutri__thrive` | 🟢 |
| No TikTok/YouTube links in contact schema sample | 🟡 |

## 3. EXACT ACTIONS

| Action | Channel | How | Time | Cost |
|--------|---------|-----|------|------|
| Repurpose top blog into carousel | Instagram | `moringa-vs-spirulina` comparison table | 2 hr | $0 |
| Pin Melbourne delivery post | Facebook | Link `/melbourne/` | 30 min | $0 |
| UTM on all bio links | Analytics | `?utm_source=instagram&utm_medium=social` | 15 min | $0 |
| Verify Reddit pixel fires | `scripts/global/reddit-pixel.js` | Reddit Events Manager — **verify manually** | 30 min | $0 |

**Detected profiles (`pages/contact/contact.html`):**
- Facebook: `https://www.facebook.com/nutrithrive`
- Instagram: `https://www.instagram.com/nutri__thrive/`

---

# PART 9: Email Marketing

## 1. CURRENT STATUS

| Area | Status |
|------|--------|
| Newsletter signup page | ✅ |
| Form backend | ⚠️ |
| Post-signup thank-you | ✅ |
| Automation | ❓ |

## 2. PRIORITY ISSUES

| Issue | Rating |
|-------|--------|
| FormSubmit / Google Sheets — deliverability not visible in repo | 🟡 |
| No visible double opt-in | 🟡 |
| Newsletter page thin (284 words) | 🟢 |

## 3. EXACT ACTIONS

| Action | Target | File | How | Time | Cost |
|--------|--------|------|-----|------|------|
| Migrate to Klaviyo/Mailchimp | Deliverability | `pages/newsletter/index.html` | AU-friendly ESP; SPF/DKIM on domain | 1 day | $0–50/mo |
| Lead magnet | Signups | Newsletter | PDF: “7-day moringa starter plan” | 1 week | $0 |
| Welcome 3-email series | CRO | ESP | Link top 3 blogs + 10% first order | 1 day | $0 |

**Technical note:** `pages/newsletter/index.html` uses `formsubmit.co` preconnect; setup docs in `pages/newsletter/GOOGLE_SHEETS_SETUP.md`.

---

# PART 10: SEM (Paid Search)

## 1. CURRENT STATUS

| Area | Status |
|------|--------|
| Landing pages for ads | ✅ |
| Conversion tracking (GA + Reddit) | ⚠️ |
| Google Ads tags in HTML | ❌ |
| Negative keyword list in repo | ❌ |

## 2. PRIORITY ISSUES

| Issue | Rating |
|-------|--------|
| No Google Ads gtag in codebase | ⚪ (may be in GTM) |
| Competitors bid on “moringa powder” (Chemist Warehouse, Amazon) | 🟡 |
| High CPC health category | 🟡 |

## 3. EXACT ACTIONS

| Action | Campaign | How | Time | Cost |
|--------|----------|-----|------|------|
| Brand campaign | “nutrithrive” | Exact match; sitelinks to PDP, FAQ, blog | 2 hr setup | $5–15/day |
| Non-brand test | “buy moringa powder australia” | Landing: `/products/moringa-powder/`; monitor CPA | Ongoing | $20–40/day test |
| Shopping feed | Merchant Center | Product schema already rich — **verify manually** | 1 day | $0 |
| Exclude “free”, “recipe only” | Waste | Shared negative list | 30 min | $0 |

**Limitation:** No access to historical Ads account — **verify manually** for spend, ROAS, Quality Score.

---

# PART 11: Analytics & Tracking

## 1. CURRENT STATUS

| Area | Status |
|------|--------|
| GA4 snippet | ✅ |
| Deferred loading | ✅ |
| Reddit pixel | ✅ |
| GSC verification meta | ❌ |
| Enhanced ecommerce events | ❓ |

## 2. PRIORITY ISSUES

| Issue | Rating |
|-------|--------|
| No `google-site-verification` in HTML | 🟡 |
| GA on interaction may undercount bounces | 🟢 |
| Cannot confirm conversions in GA4 | ⚪ |

## 3. EXACT ACTIONS

| Action | Tool | How | Time | Cost |
|--------|------|-----|------|------|
| Add GSC HTML tag | GSC | Meta tag in `index.html` `<head>` or DNS TXT | 15 min | $0 |
| Link GA4 ↔ GSC | Both | Same Google account | 5 min | $0 |
| Define 5 key events | GA4 | `purchase`, `add_to_cart`, `newsletter_signup`, `click_phone`, `click_email` | 2 hr | $0 |
| Weekly report Looker Studio | Reporting | GSC + GA4 blended dashboard | 4 hr | $0 |

**GA4 ID:** `G-WH21SW75WP` (found in `index.html`, product pages, majority of blogs).

---

# PART 12: Competitor Landscape (Australia)

## 1. CURRENT STATUS

| Area | Status |
|------|--------|
| On-site comparison content | ✅ |
| Live SERP positions | ❓ |
| Competitor site benchmarks | ⚠️ (desk research only) |

## 2. PRIORITY ISSUES

| Issue | Rating |
|-------|--------|
| Marketplaces dominate “buy moringa” SERPs | 🔴 |
| D2C brands (e.g. Rosabella) win on reviews ads | 🟡 |
| Chemist Warehouse / supermarket listings for price shoppers | 🟡 |

## 3. EXACT ACTIONS

| Action | Competitor type | How | Time | Cost |
|--------|-----------------|-----|------|------|
| SERP snapshot top 10 | “moringa powder australia” | GSC + manual incognito — **verify manually** | 1 hr | $0 |
| Price/value matrix update | CW, Amazon, D2C | Table in `verify-moringa-quality…` | 2 hr | $0 |
| Monitor Rosabella branded terms | Defence | Optional small brand SEM | Ongoing | $5/day |

**Typical AU competitors (cannot verify live rankings without GSC):**

| Competitor | Strength | NutriThrive counter |
|------------|----------|---------------------|
| Chemist Warehouse / supermarkets | Price, availability | Lab tests, freshness, Melbourne dispatch story |
| Amazon / eBay sellers | Reviews volume | Batch transparency, AU business trust |
| Rosabella (D2C) | Brand ads, capsules | Powder quality, $11/100g value post |
| Generic greens brands (Athletic Greens style) | Bundle marketing | Single-ingredient purity, no filler |
| Loving Earth / health food brands | Retail distribution | Direct freshness, shade-dried narrative |

---

# TOP 20 PRIORITY ISSUES (RANKED)

| Rank | Issue | Rating | Section |
|------|-------|--------|---------|
| 1 | Sitemap includes script/test URLs | 🔴 | Technical |
| 2 | Broken meta descriptions on 3 Melbourne story blogs | 🔴 | On-page |
| 3 | 12 keyword cannibalization clusters remain | 🔴 | Content/Keywords |
| 4 | Thin buyer-intent blogs (<1,000 words) | 🔴 | On-page |
| 5 | `buy-moringa-powder-australia` vs PDP overlap | 🔴 | Keywords/CRO |
| 6 | No GSC verification / rank data in audit | 🟡 | Analytics |
| 7 | 32 titles over 60 characters | 🟡 | On-page |
| 8 | 33 pages with repeated missing image alts | 🟡 | On-page |
| 9 | 4 blogs with multiple H1 | 🟡 | On-page |
| 10 | `products/index.html` hub too thin | 🟡 | Content/CRO |
| 11 | `content-audit-data.json` stale post-Phase 1 | 🟡 | Content |
| 12 | Large `assets/` folder (~281 MB) | 🟡 | Technical |
| 13 | CWV not validated live | 🟡 | Technical |
| 14 | Secondary PDPs weak internal links | 🟡 | On-page |
| 15 | Email on FormSubmit vs dedicated ESP | 🟡 | Email |
| 16 | No enhanced ecommerce events confirmed | 🟡 | Analytics |
| 17 | `nutrithrive_labs` in sitemap | 🟢 | Technical |
| 18 | Chinese Melbourne guide thin (945 words) | 🟢 | Content |
| 19 | Reddit pixel without documented KPI | 🟢 | SMM |
| 20 | Competitor SERP pressure unquantified | 🟢 | Competitors |

---

# 10 QUICK WINS (24 HOURS)

1. **Blocklist sitemap polluters** — `scripts/build-sitemap.js` + regenerate XML (30 min).  
2. **Fix 3 broken meta tags** — chronic fatigue, cortisol belly, quit sugar posts (30 min).  
3. **Trim top 5 longest titles** — women benefits, cystic acne, greens powder, spirulina comparison, smoothie recipes (1 hr).  
4. **Add GSC verification meta** to `index.html` (15 min).  
5. **Internal link from PDP to dosage + side effects + banned posts** (30 min).  
6. **Expand `blog/index.html` meta** — already improved; add 2 featured article links in first screen (30 min).  
7. **Cross-link black tea + soap PDPs from moringa PDP** (45 min).  
8. **Regenerate `audit/content-audit-data.json`** after deletions (1 hr).  
9. **Confirm Phase 1 redirects live** — curl 10 retired URLs, expect 301/404 — **verify manually** (30 min).  
10. **Set GA4 custom alert** for 404 spike — **verify manually** in GA4 admin (15 min).

---

# 30-DAY WEEK-BY-WEEK PLAN

| Week | Focus | Deliverables |
|------|-------|--------------|
| **Week 1** | Technical cleanup | Clean sitemap; fix metas; GSC verified; redirect QA |
| **Week 2** | On-page & pillars | Expand 3 thin buyer guides; fix H1s; title trim batch 1 |
| **Week 3** | Content architecture | Pillar/supporting doc per cannibal cluster; internal link audit |
| **Week 4** | CRO + measurement | GA4 events; newsletter ESP decision; PDP CTA test; Month 1 traffic review |

---

# TRAFFIC & REVENUE PROJECTIONS

**Assumptions:** Small AU niche brand; current baseline **~500–1,500 organic sessions/month** (typical pre-optimization for site of this size — **verify manually** in GA4); average order **$25–35** (1–3 bags); conversion **1.5–2.5%**; improvements from technical fixes + content consolidation.

| Period | Organic sessions/mo | Orders/mo (2% conv.) | Revenue/mo (AOV $30) |
|--------|---------------------|----------------------|----------------------|
| **Month 1** | 800 – 1,200 | 16 – 24 | **$480 – $720** |
| **Month 3** | 1,500 – 2,500 | 30 – 50 | **$900 – $1,500** |
| **Month 6** | 2,500 – 4,500 | 50 – 90 | **$1,500 – $2,700** |

**With paid social + SEM (+20–30% traffic):** add **$400–900/mo** revenue at same conversion by Month 3.

**Limitation:** These are conservative modelling ranges, not guarantees. Validate baseline in GA4 before using internally.

---

# ROI FRAMING

| Investment | Est. cost | Expected return (6 mo.) |
|------------|-----------|-------------------------|
| Developer time (sitemap, metas, schema) | 8–12 hrs @ $0 internal | Avoided de-indexing + 10–20% organic lift |
| Content expansion (3 pillars) | 24 hrs or $800 freelance | Rank for 5+ long-tail terms → +30–50 orders |
| Ahrefs/Semrush (3 mo.) | ~$300 | Keyword + link intelligence |
| Klaviyo | ~$45/mo | 5–10% repeat purchase uplift |
| **Total cash (tools)** | **~$500–800** | **Break-even at ~25 extra orders** ($750 revenue) |

**Payback narrative:** Fixing sitemap pollution and meta bugs alone can recover **hundreds of lost impressions/month** within 4–8 weeks (Google re-crawl). One additional **$30 order per day** from organic (~30 extra orders/month) ≈ **$900/mo** — realistic if 2–3 buyer guides reach page 1 for mid-tail AU queries.

---

# APPENDIX A: Pages analyzed

**68 production HTML files** (excluded: `scripts/templates/**`, `*-test.html`, `nutrithrive_labs/**`, `tools/**`).

**42 blog posts** in `/blog/*.html` (excluding `blog/index.html`).

**61 sitemap URLs** in `sitemap.xml`.

---

# APPENDIX B: Data sources

| File | Purpose |
|------|---------|
| `audit/content-audit-data.json` | Per-post titles, metas, words, cannibal clusters (partially stale) |
| `audit/issue-summary.tsv` | Title/meta length flags |
| `audit/on-page-scan-2026-05-21.json` | Generated during this audit (machine-readable) |
| `audit/sitemap-urls.txt` | URL list mirror |
| `_redirects` | Redirect policy |
| `robots.txt`, `sitemap.xml` | Crawl directives |

---

# APPENDIX C: Blockers & manual verification checklist

| Item | Blocker |
|------|---------|
| Live PageSpeed scores | API not run — use PSI |
| Actual organic traffic | Need GA4 login |
| Index coverage / canonical choices | Need GSC |
| Backlink count | Need Ahrefs/Semrush |
| PayPal / checkout error rate | Need production logs |
| Live redirect behavior | Deploy to Netlify/host — curl production |

---

*End of report. Single master deliverable: `audit/COMPLETE-WEBSITE-AUDIT-2026-05-21.md`.*
