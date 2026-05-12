# Phase 2 — Raw page data (Firecrawl `firecrawl_scrape`)

**Target:** `https://nutrithrive.com.au`  
**Scope:** **50** URLs scraped with JSON extraction (title, meta description, H1–H3, approximate word count, internal links on `nutrithrive.com.au`, key images/alt flags, canonical, schema `@type` list).  
**Tool:** Firecrawl MCP `firecrawl_scrape` with `formats: ["json"]` and a fixed `jsonOptions.schema`.

**Important scrape failure:**  
- `https://nutrithrive.com.au/blog/30-day-moringa-experiment-replaced-supplements-journal-2026.html` → **HTTP 404** (Netlify default “Page not found”). Replaced in this dataset with a successful scrape of `https://nutrithrive.com.au/blog/how-to-read-moringa-batch-codes-freshness.html` so the row count stays at **50 live pages**.

**Redirect noted:**  
- `https://nutrithrive.com.au/pages/usage-guide/how-to-use-moringa` → final URL `https://nutrithrive.com.au/blog/how-to-add-moringa-to-diet.html` (metadata `url` in response).

---

## Summary table (50 pages)

| # | URL | Title tag (metadata) | Meta description (chars) | H1 count | Canonical (extracted) | Schema types | ~Words |
|---|-----|----------------------|---------------------------|----------|-------------------------|----------------|--------|
| 1 | / | NutriThrive \| Shade-dried moringa from Melbourne | Shade-dried moringa… (~155) | **4** | https://nutrithrive.com.au/ | WebSite, Organization | 520 |
| 2 | /products | Shop Moringa… | Buy moringa… (~120) | 1 | *(empty in extract)* | — | 115 |
| 3 | /products/moringa-powder | Buy Organic Moringa Powder Australia… | $29.95 for 100g… (~120) | 1 | **https://nutrithrive.com.au/moringa-powder** *(differs from path)* | Product, AggregateRating | 1741 |
| 4 | /products/curry-leaves | Dried Curry Leaves \| NutriThrive Melbourne | Buy premium dried… | 1 | **https://nutrithrive.com.au/dried-curry-leaves** | Product, Review, Organization | 733 |
| 5 | /products/black-tea | Premium Black Tea… | Buy premium Darjeeling… | 1 | **https://nutrithrive.com.au/darjeeling-black-tea** | Product, Review, FAQPage | 575 |
| 6 | /products/moringa-soap | Moringa Soap… | Buy premium handmade… | 1 | **https://nutrithrive.com.au/** *(wrong)* | Product, Review | 557 |
| 7 | /products/combo-pack | Premium Wellness Combo Pack… | NutriThrive wellness bundles… | 1 | **https://nutrithrive.com.au/premium-combo-pack** | Product | 708 |
| 8 | /about | About NutriThrive Australia… | About NutriThrive… | 1 | **https://nutrithrive.com.au/** *(wrong)* | — | 543 |
| 9 | /contact | Contact NutriThrive… | Call NutriThrive… | 1 | https://nutrithrive.com.au/contact | Organization, ContactPage | 173 |
| 10 | /faq | Moringa & Superfoods FAQ… | NutriThrive FAQ… | 1 | https://nutrithrive.com.au/faq | FAQPage | 757 |
| 11 | /privacy-policy | Privacy Policy & Terms… | NutriThrive privacy… | 1 | **https://www.nutrithrive.com.au/privacy-policy** *(www host)* | WebPage | 650 |
| 12 | /pages/shipping/shipping-returns | Shipping & Returns Australia… | Shipping & returns… | 1 | **https://nutrithrive.com.au/shipping-returns** | FAQPage (malformed label in extract) | 482 |
| 13 | /melbourne | Moringa Powder Melbourne… | Fresh moringa delivered… | 1 | **https://nutrithrive.com.au/** *(wrong)* | Product, WebSite | 1090 |
| 14 | /blog | NutriThrive Blog… | Moringa, curry leaves… | 1 | https://nutrithrive.com.au/blog | WebSite, Blog, Article | 1694 |
| 15 | /buy-moringa-powder-australia/index.html | Buy Moringa Powder Online Australia… | Premium organic… | 1 | **https://nutrithrive.com.au/products/moringa-powder/** | Product, Organization, Review | 757 |
| 16 | /nutrithrive_labs | NutriThrive Labs \| Home… | Free browser tools… | 1 | https://nutrithrive.com.au/nutrithrive_labs/ | WebPage, Product | 339 |
| 17 | /pages/newsletter | Newsletter Subscription… | Subscribe… | 1 | **https://nutrithrive.com.au** *(homepage)* | WebPage | 318 |
| 18 | /blog/how-to-add-moringa-to-diet.html *(via usage URL)* | How to Add Moringa to Your Diet… | Add moringa to smoothies… | 1 | **https://nutrithrive.com.au/blog/how-to-add-moringa-to-diet** | Article, HowTo | 9316 |
| 19 | /cart | Your Cart \| NutriThrive… | Review your cart… | 1 | https://nutrithrive.com.au/cart | — | 46 |
| 20 | /nutrithrive_labs/sitemap-generator | NutriThrive Labs \| Sitemap Generator | Generate sitemap.xml… | 1 | **https://nutrithrive.com.au/sitemap-generator** | WebPage | 132 |
| 21 | /blog/smart-moringa-daily-intake-australia-visual-guide-2026.html | Moringa Dose Australia 2026… | Moringa dose in Australia… | 1 | **https://nutrithrive.com.au/blog/moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026** *(wrong page)* | Article, BlogPosting | 964 |
| 22 | /blog/moringa-powder-complete-buyers-guide-australia-2026.html | Moringa Powder Buyers Guide… | Complete 2026 moringa… | 1 | self .html | Article | 2315 |
| 23 | /blog/moringa-brands-comparison-australia-2026.html | Best Moringa Brands Australia 2026… | We tested 15 moringa brands… | 1 | self .html | Article, WebPage | ~10000 |
| 24 | /blog/best-protein-powder-australia.html | Best Protein Powder Australia 2026… | 12 protein powders tested… | 1 | self | FAQPage, Article, BreadcrumbList | 5726 |
| 25 | /blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025.html | Rosabella Moringa vs NutriThrive… | Rosabella moringa… | 1 | **https://nutrithrive.com.au/blog/rosabella-vs-nutrithrive** | Article, Product, Comparison | 2633 |
| 26 | /blog/moringa-melbourne-complete-guide-2026.html | Moringa Melbourne: Honest Guide… | Real talk about moringa… | 1 | **https://nutrithrive.com.au/blog/moringa-melbourne-honest-guide-2026** | Article, BlogPosting | 2450 |
| 27 | /blog/science-shade-drying-vs-sun-drying-moringa.html | Shade- vs Sun-Dried Moringa… | Shade- vs sun-dried… | 1 | **https://nutrithrive.com.au/products/moringa-powder/** | Product | 1883 |
| 28 | /blog/moringa-quality-test-shade-dried-vs-retail-australia-2026.html | Moringa Quality Test… | We tested 8 Australian… | 1 | self .html | Article | 1814 |
| 29 | /blog/how-to-use-moringa-powder-daily-without-the-bad-taste-2026.html | How to Use Moringa Powder Daily… | Use moringa powder every day… | **2** | **https://nutrithrive.com.au/blog/how-to-add-moringa-to-diet.html** | Article, BlogPosting | 1043 |
| 30 | /blog/best-superfoods-australia-comparison-health-conscious-adults.html | Australia 2026 Top Superfoods… | Superfoods sell fast… | 1 | **https://nutrithrive.com.au/blog/superfoods-australia-2026** | Article | 3738 |
| 31 | /blog/nutrithrive-delivers-across-victoria-is-your-town-eligible-hint-yes.html | NutriThrive Delivery Across Victoria… | Does NutriThrive deliver… | 1 | **https://nutrithrive.com.au/** | Product, WebPage | 1412 |
| 32 | /blog/moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html | Moringa Powder Australia 2026… | Moringa powder in Australia… | 1 | **https://nutrithrive.com.au/blog/moringa-powder-guide** | Article | 2939 |
| 33 | /blog/affordable-superfoods-organic-tax-marketplace-wellness-vic-nsw-qld-2026.html | Affordable Moringa 2026… | 2026: marketplace superfood… | 1 | self .html | Article, Product, BlogPosting | 1273 |
| 34 | /blog/moringa-brands-comparison-australia-chinese-review.html | 澳洲辣木粉避坑指南 2026… | 2026年澳洲辣木粉避坑指南… | 1 | self .html | Article, BlogPosting | 1395 |
| 35 | /blog/melbourne-body-burden-report-2026.html | Melbourne Body Burden 2026… | City stress, iron drain… | 1 | **https://nutrithrive.com.au/blog/melbourne-body-burden-report-2026** | Article, Report, WebPage | 3260 |
| 36 | /blog/rosabella-moringa-reviews-legit-or-overhyped-2026.html | Rosabella Moringa Review… | Capsules vs powder… | 1 | **https://nutrithrive.com.au/products/moringa-powder/** | Product, Article | 1197 |
| 37 | /blog/moringa-vs-coffee-melbourne-energy-hack.html | Moringa vs Coffee: Melbourne… | Coffee prices hit $7… | 1 | **https://nutrithrive.com.au/blog/the-7-day-adrenal-challenge-2026** | Article, WebPage | 5070 |
| 38 | /blog/does-moringa-have-caffeine-truth-about-energy-focus-side-effects-2026.html | Does Moringa Have Caffeine?… | No caffeine in moringa… | **2** | **https://nutrithrive.com.au/blog/faq-moringa-caffeine** | FAQPage, WebPage | 1032 |
| 39 | /blog/10-dollar-superfood-replaced-200-supplement-stack-australia-2026.html | $10 Moringa Habit vs $200… | One $10 moringa habit… | **2** | self .html | BlogPosting | 1191 |
| 40 | /blog/is-moringa-legit-what-science-and-real-users-say-2026.html | Is Moringa Legit?… | Is moringa legit?… | 1 | **https://nutrithrive.com.au/products/moringa-powder/** | Product, Article | 1038 |
| 41 | /blog/moringa-powder-victoria-seniors-joint-health.html | Moringa for Victorian Seniors… | Moringa for Victorian seniors… | 1 | **https://nutrithrive.com.au/blog/moringa-arthritis-relief** | Article | 5747 |
| 42 | /blog/melbourne-food-as-medicine-map-cafes-organic-stores-healthspan-eating-2026.html | Melbourne Food-as-Medicine Map… | Where to eat and shop… | 1 | self .html | *(none detected)* | 994 |
| 43 | /blog/growing-moringa-australia-honest-frost-pots-2026.html | Growing Moringa in Australia 2026… | Can you grow moringa… | 1 | **https://nutrithrive.com.au/growing-moringa-australia** | Article, WebPage | 2594 |
| 44 | /blog/30-day-moringa-coffee-reset-australia-guide-2026.html | 30-Day Moringa Coffee Reset… | 30 days of moringa in your coffee… | **2** | **https://nutrithrive.com.au/products/moringa-powder/** | WebPage, Product | 1162 |
| 45 | /blog/moringa-powder-vs-capsules-which-one-actually-works-better-2026.html | Moringa Powder vs Capsules… | We tested 12 moringa capsule brands… | 1 | **https://nutrithrive.com.au/products/moringa-powder/** | *(empty)* | 668 |
| 46 | /blog/moringa-vs-spirulina-vs-matcha-comparison-australia.html | Moringa vs Spirulina vs Matcha… | Moringa vs spirulina vs matcha… | **2** | self .html | Article, BlogPosting | 8600 |
| 47 | /blog/why-i-built-nutrithrive-moringa-real-story-finest-moringa-powder.html | Why I Build NutriThrive… | Melbourne: moringa leaf powder… | 1 | self .html | Article, WebPage | 2134 |
| 48 | /blog/where-to-buy-moringa-in-australia-online-vs-stores-2026-guide.html | Where to Buy Moringa Australia 2026… | Where to buy moringa… | 1 | **https://nutrithrive.com.au/blog/where-to-buy-moringa-in-australia** | Article, FAQPage | 2118 |
| 49 | /blog/plant-based-functional-foods-australia-wellness-nutrithrive-2026.html | Top 5 Australian Plant Superfoods… | Five plant-based superfoods… | 1 | self .html | BlogPosting | 3034 |
| 50 | /blog/how-to-read-moringa-batch-codes-freshness.html | Read Moringa Batch Codes… | Read moringa batch and lot codes… | 1 | **https://nutrithrive.com.au/blog/where-to-buy-moringa-in-australia-online-vs-stores-2026-guide** | Article, BlogPost | 907 |

---

## Internal links — patterns (from extracts)

- **Homepage** linked to `/melbourne`, `/products/`, product PDPs, multiple `/blog/…` guides, `#about` fragment.  
- **Shop `/products`** linked only to **five** product URLs (no blog, no shipping, no contact in extract).  
- Several PDPs linked heavily to **external** `.gov`/PubMed (good for E-E-A-T) but **sparse** cross-links to other NutriThrive products except moringa powder hub pattern.  
- **Blog index** internal links sample: `/products/`, shipping page, `/contact`.  
- Broken / risky: `/cart` scrape showed link to **`https://nutrithrive.com.au/payment`** (verify live).  
- **404:** map listed journal URL; not deployed.

---

## Images / alt (high-signal samples)

| Page | Issue |
|------|--------|
| Homepage | Product imagery: descriptive alts present on sampled hero/thumbs. |
| Contact | Map image `src` reported as `https://example.com/map-image.jpg` — **placeholder / wrong host**. |
| FAQ | Image paths like `/images/moringa-powder.jpg` — verify exist vs 404 in production. |
| Moringa buyers guide | One `img` `src` appeared as a **page URL** (`…/products/moringa-powder/`) in extract — likely markup error or extractor confusion; **flag for HTML QA**. |

---

## H2 / H3 samples (content structure)

- Long guides (e.g. how-to-add-moringa) return **many** H2s (TOC-style): good for UX, watch for duplicate heading text and keyword cannibalisation vs other guides.  
- Some articles use **marketing H1** (“What You'll Learn in This Complete Guide”) instead of the question in the URL — weak query–H1 match on `moringa-brands-comparison-australia-2026.html`.

---

*End of Phase 2 raw capture. Character counts for meta/titles and full H2/H3 lists are available per URL in scrape JSON; this file stores audit-ready summaries.*
