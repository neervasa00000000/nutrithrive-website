# Phase 3 — Technical SEO audit

**Evidence base:** Firecrawl map of `https://nutrithrive.com.au` + **50** structured scrapes (see `audit/02_raw_pages.md`).

---

## 1. Title tags

### Missing or weak
- **`/products`:** In-body extracted title **“Shop Premium Wellness”** vs browser title **“Shop Moringa, Curry Leaves & Black Tea | Melbourne AU”** — **mismatch** between visible H1/title treatment and `<title>` hurts relevance signals and accessibility.

### Length (selected checks vs Google ~60 char display)
- **Within range:** `Moringa Powder Melbourne - Next-Day Delivery from Truganina` (~58).  
- **Risk of truncation:** Several blog `<title>` strings in map are long (e.g. comparison guides); confirm live SERP preview for top money pages.

### Duplicates / near-duplicates
- **`/blog/rosabella-moringa-reviews-legit-or-overhyped-2026.html`:** URL and SERP snippet say “Rosabella review”, but OG/title alternate toward **capsules vs powder** — **intent collision** with `moringa-powder-vs-capsules-which-one-actually-works-better-2026.html`.

### Title vs content
- **`/blog/moringa-brands-comparison-australia-2026.html`:** H1 extracted as **“What You'll Learn in This Complete Guide”** — does not contain “moringa brands Australia” style language; **title/H1/query misalignment**.

---

## 2. Meta descriptions

### Missing
- None on core scraped set (all had `description` or `og:description`).

### Length
- **Too short (<70):** `https://nutrithrive.com.au/contact` — “Get in touch with Australia's premium moringa powder company based in Truganina.” (~85 chars — borderline; still generic).  
- **Generic / low-CTR:** `https://nutrithrive.com.au/blog` — “Discover insightful blogs covering various health topics…” — **does not differentiate** NutriThrive vs any health blog.

### Duplicates / reuse
- Many articles share the same **OG image** asset (`moringa-social-1200.png` / `moringa-article-1200.jpg`) — fine for social, but **meta descriptions** on several posts read like template filler (“Discover… Explore… comprehensive guide”).

---

## 3. Heading structure

### Multiple H1 (scraped)
| URL | H1s |
|-----|-----|
| https://nutrithrive.com.au/ | **4** (“Our products”, “Premium Natural…”, “Latest Moringa…”, “What Our Customers Say”) |
| https://nutrithrive.com.au/blog/how-to-use-moringa-powder-daily-without-the-bad-taste-2026.html | **2** |
| https://nutrithrive.com.au/blog/does-moringa-have-caffeine-truth-about-energy-focus-side-effects-2026.html | **2** |
| https://nutrithrive.com.au/blog/10-dollar-superfood-replaced-200-supplement-stack-australia-2026.html | **2** (and H2 repeats same phrase as H1) |
| https://nutrithrive.com.au/blog/30-day-moringa-coffee-reset-australia-guide-2026.html | **2** |
| https://nutrithrive.com.au/blog/moringa-vs-spirulina-vs-matcha-comparison-australia.html | **2** |

**Fix:** One H1 per URL; demote section labels to H2.

### Missing H1
- None of the 50 scraped pages lacked an H1.

### Skipped levels
- Some mega-guides use H2 for TOC then jump to content blocks — verify no **H1 → H3** skip in source HTML on key landings.

### Vague H1
- **`/blog/moringa-vs-spirulina-vs-matcha-comparison-australia.html`:** First H1 **“This Guide Has 3 Main Parts”** — poor keyword intent.

---

## 4. Images

- **Placeholder:** Contact page map image `https://example.com/map-image.jpg` — broken trust + broken UX.  
- **FAQ:** `/images/moringa-powder.jpg` style paths — verify **200** responses.  
- **Buyers guide:** possible **`img src` = HTML page URL** — invalid image, hurts Lighthouse and rich results.  
- **Decorative vs informative:** Product PDPs generally had meaningful alts on sampled images; good.

---

## 5. Internal linking

### Near-orphans / low inlinks (from extracts)
- **`/products/black-tea`**, **`/products/moringa-soap`:** extracts showed **only** link to homepage — **weak hub** connectivity.  
- **`/products`** hub: only product URLs, **no** FAQ/shipping/blog — missed topical authority flow.

### Homepage
- Links to multiple blogs + Melbourne + products — **reasonable** depth; still add `/faq`, `/pages/shipping/shipping-returns`, `/about` in main content if not only footer.

### Blog → commerce
- Strong CTAs to `/products/moringa-powder/` on many posts — good.

### Broken discovery
- Map listed **`…/blog/30-day-moringa-experiment-replaced-supplements-journal-2026.html`** → **404** — any internal links to this URL are **dead**.

---

## 6. Content quality (length / thin)

| URL | ~Words | Note |
|-----|--------|------|
| /cart | 46 | `noindex` — OK |
| /products | 115 | **Thin** for a category hub |
| /blog/moringa-powder-vs-capsules-which-one-actually-works-better-2026.html | 668 | Thin vs title promise “12 brands tested” in OG/title layer |
| /nutrithrive_labs/sitemap-generator | 132 | Utility; `noindex` in metadata — OK |

Long-form pillar content (3k–10k words) is a **strength** on flagship guides.

---

## 7. URL structure

- **Mixed trailing slash** behaviour: requests resolve to `/products/` style final URLs — ensure **one** canonical pattern.  
- **Short marketing slugs** alongside `.html` blogs (e.g. `/blog/moringa-powder-guide`) — risk **duplicate clusters** if both serve 200.  
- **Uppercase:** none observed in map sample.  
- **Underscores:** none in main URLs.  
- **Length:** paths generally OK; avoid stacking redundant tokens in new posts.

---

## 8. Canonical tags & host consistency (critical)

| Page | Canonical | Problem |
|------|-----------|---------|
| /about | `https://nutrithrive.com.au/` | Points to **homepage**, not `/about` |
| /melbourne | `https://nutrithrive.com.au/` | **Melbourne landing de-indexed** to home |
| /products/moringa-powder | `https://nutrithrive.com.au/moringa-powder` | Path ≠ canonical slug |
| /products/moringa-soap | `https://nutrithrive.com.au/` | Points to **homepage** |
| /privacy-policy | `https://www.nutrithrive.com.au/privacy-policy` | **Host mismatch** (www) |
| /pages/newsletter | `https://nutrithrive.com.au` | Homepage |
| /buy-moringa-powder-australia/index.html | `/products/moringa-powder/` | Consolidates acquisition page to PDP |
| /blog/smart-moringa-daily-intake-… | `/blog/moringa-powder-guide-benefits-…` | **Different article** |
| /blog/science-shade-drying-… | `/products/moringa-powder/` | Article → **product** |
| /blog/nutrithrive-delivers-across-victoria-… | `/` | Article → **homepage** |
| /blog/rosabella-moringa-reviews-… | `/products/moringa-powder/` | Review URL → **PDP** |
| /blog/is-moringa-legit-… | `/products/moringa-powder/` | Article → **PDP** |
| /blog/30-day-moringa-coffee-reset-… | `/products/moringa-powder/` | Article → **PDP** |
| /blog/moringa-powder-vs-capsules-… | `/products/moringa-powder/` | Article → **PDP** |
| /blog/moringa-vs-coffee-… | `/blog/the-7-day-adrenal-challenge-2026` | **Alternate slug** |
| /blog/how-to-read-moringa-batch-codes-… | `/blog/where-to-buy-moringa-in-australia-online-vs-stores-2026-guide` | Wrong article |

**Impact:** Google may drop URLs from the index or merge rankings unpredictably; hreflang and reporting in Search Console fragment across hosts/paths.

---

## 9. Schema / structured data

### Present (examples)
- **Homepage:** WebSite, Organization.  
- **FAQ:** FAQPage.  
- **Contact:** Organization, ContactPage.  
- **Many blogs:** Article / BlogPosting / FAQPage combinations.  
- **PDPs:** Product (+ Review / AggregateRating on moringa powder).

### Gaps / issues
- **`/about`:** No schema types detected — add **Organization** + **AboutPage** (or merge with founder story `Person`).  
- **`/products` hub:** No JSON-LD — add **ItemList** of Products or **CollectionPage**.  
- **`/blog/melbourne-food-as-medicine-map-…`:** No types in extract — add **Article** + optional **ItemList** for venues (careful: only if markup is truthful).  
- **`/blog/moringa-powder-vs-capsules-…`:** Empty — add **Article** or **FAQPage**.  
- **Invalid type string:** `Comparison` on chemist warehouse article — not a standard schema.org type; use **Article** + FAQ or **Product** comparisons per Google guidelines.  
- **`BlogPost` vs `BlogPosting`:** batch-codes page — use **`BlogPosting`** consistently.

---

## 10. Indexation / robots

- **`/cart`:** `noindex, follow` — correct.  
- **`/nutrithrive_labs/sitemap-generator`:** `noindex, follow` — correct for utility.  
- **404 journal post** in sitemap/map — **remove** from internal links and XML sitemaps.

---

*Next: align canonical policy, fix host (apex vs www), repair H1/title/meta mismatches, then re-submit sitemap in Google Search Console.*
