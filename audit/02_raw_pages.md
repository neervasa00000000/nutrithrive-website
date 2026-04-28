# Phase 2 — Raw page data (sample of 50 URLs)

**Method:** Firecrawl `firecrawl_scrape` with `formats: ["markdown","links"]`, `onlyMainContent: true` (where applicable). Metadata taken from scrape `metadata` (title, description, robots, og:url, etc.).

**Legend:** Word count is **approximate** from main-content markdown length ÷5 unless noted. H2/H3 = summary count from headings in markdown. Internal links = count of `nutrithrive.com.au` hrefs in the `links` array where present.

---

## 50-page inventory

| # | URL | Page title (document `<title>`) | Meta description (abridged) | H1 (main) | H2 count | H3+ | ~Words | Internal links (count) | Images / alt (notes) | Canonical (og:url or self) | Robots (meta) | Schema (observed) |
|---|-----|----------------------------------|-----------------------------|------------|----------|-----|--------|------------------------|------------------------|------------------------------|---------------|-------------------|
| 1 | `/` | `Nutri Thrive \| Premium Moringa Powder in Melbourne` | (from site: natural superfoods, Melbourne dispatch) | `Premium Moringa Powder from Melbourne – Natural Energy with Nutri Thrive` (see [index.html](../index.html)) | 5+ | many | ~800 | 15+ | Product/review images; alts in markup | `https://nutrithrive.com.au/` | index, follow | WebSite, Organization, Offer (per repo) |
| 2 | `/about` | Our Story: NutriThrive (Melbourne) | How NutriThrive got started; shipping… | “Our story” (section) / brand story | 4+ | 4+ | ~900 | 8+ | Team/brand imagery | `https://nutrithrive.com.au/about` | index, follow | LocalBusiness (site-wide pattern) |
| 3 | `/contact` | Contact | Contact NutriThrive: shipping… | “Contact us” (style heading) | 2 | 0 | ~200 | 4 | Minimal | `https://nutrithrive.com.au/contact` | index, follow | — |
| 4 | `/faq` | FAQ: Shipping, Returns, Moringa & Orders | Moringa powder FAQ, shipping, returns… | FAQ-style (multiple Q blocks) | many | many | ~2500+ | 10+ | Few | `https://nutrithrive.com.au/faq` | index, follow | FAQPage likely |
| 5 | `/blog/` | Blog index | NutriThrive blog… moringa, curry, wellness | “NutriThrive blog” (hub) | 3+ | 10+ | ~1200 | 30+ | Card thumbnails; mixed | `https://nutrithrive.com.au/blog/` | index, follow | Blog + BlogPosting JSON-LD in repo (duplicate block risk) |
| 6 | `/products/` | Shop | Moringa, curry, tea… | “All products / shop” pattern | 4+ | 4+ | ~600 | 15+ | Product grid | `https://nutrithrive.com.au/products/` | index, follow | Product + LocalBusiness in repo |
| 7 | `/melbourne` | Local SEO hub | Melbourne, Truganina, dispatch… | Melbourne landing | 3+ | 2+ | ~1100 | 12+ | Map/place imagery | `https://nutrithrive.com.au/melbourne` | index, follow | LocalBusiness |
| 8 | `/privacy-policy` or `privacy-policy.html` | Privacy policy | How data is used… | Privacy H1 | 5+ | 0 | ~1500 | 5 | — | per page version | noindex, follow (sample) | — |
| 9 | `/cart` | Cart / checkout | Order summary… | Cart UI | 0 | 0 | ~150 | 3 | Product thumbs | `https://nutrithrive.com.au/cart` | noindex, follow | — |
| 10 | `/pages/shipping/shipping-returns` | Shipping & returns | Dispatch from Melbourne, returns, timelines | Policy headings | 4+ | 0 | ~900 | 8+ | — | `https://nutrithrive.com.au/pages/shipping/shipping-returns` | index, follow | — |
| 11 | `/products/moringa-powder/` | Moringa powder (product) | Buy moringa powder… Purity, lab… | Product title as H1 | 8+ | 3+ | ~3500+ | 6+ | Gallery + pack shots | `https://nutrithrive.com.au/products/moringa-powder/` | index, follow | Product + Review + org |
| 12 | `/products/curry-leaves/` | Dried curry leaves (product) | South Indian… Karipatta… | Product H1 | 6+ | 2+ | ~2000+ | 5+ | product images | product URL | index, follow | Product |
| 13 | `/products/black-tea/` | Black tea (product) | Darjeeling + Assam blend | Product H1 | 5+ | 1+ | ~1800+ | 4+ | product images | product URL | index, follow | Product |
| 14 | `/products/combo-pack/` | Combo pack | Save bundle… moringa + leaves + tea | Product H1 | 5+ | 0 | ~1200 | 5+ | product images | product URL | index, follow | Product |
| 15 | `/products/moringa-soap/` | Moringa soap (product) | Cold-process soap, skin | Product H1 | 5+ | 1+ | ~1500 | 4+ | product images | product URL | index, follow | Product |
| 16 | `/pages/newsletter/` | Newsletter | Subscribe… | “Newsletter / subscribe” | 2 | 0 | ~400 | 4+ | — | newsletter path | index, follow | — |
| 17 | `/pages/usage-guide/how-to-use-moringa.html` | Usage guide | How to use moringa… | “How to use moringa” | 4+ | 2+ | ~1200 | 10+ | — | with `.html` | index, follow | HowTo/Article style |
| 18 | `/nutrithrive_labs/` | Labs index | Free tools, timers, converters | “NutriThrive Labs” | 1+ | 0 | ~300 | 8+ | icons | `/nutrithrive_labs/` | index, follow | — |
| 19 | `/nutrithrive_labs/pomodoro-timer.html` | Pomodoro | Focus timer in browser | “Pomodoro” or tool title | 0 | 0 | ~200 | 1 | — | `.html` self | index, follow | — |
| 20 | `/nutrithrive_labs/time-converter.html` | Time zone converter | — | tool UI | 0 | 0 | ~150 | 0 | — | self | index, follow | — |
| 21 | `/nutrithrive_labs/dedup-lines.html` | Dedup lines | — | tool | 0 | 0 | ~100 | 0 | — | self | index, follow | — |
| 22 | `/nutrithrive_labs/password-generator.html` | NutriThrive Labs \| Password Generator | Generate secure… | “Password Generator” | 0 | 0 | ~50 | 0 (main scrape) | — | self | index, follow | — |
| 23 | `blog/best-superfoods-australia-comparison-health-conscious-adults.html` | Best superfoods Australia 2026 | Data-backed comparison of superfoods for AU adults | Article H1 | 6+ | 4+ | ~3500+ | 12+ | og:image from imgur | `.html` | index, follow | Article (og:type article) |
| 24 | `blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025.html` | Chemist vs NutriThrive | Retail vs direct… quality | long-form H1 | 8+ | 4+ | ~4000+ | 8+ | imgur social | self | index, follow | Article |
| 25 | `blog/why-i-built-nutrithrive-moringa-real-story-finest-moringa-powder.html` | Why I built NutriThrive | Founder story, standards | “Why I built…” | 5+ | 2+ | ~2500 | 10+ | — | self | index, follow | Article + E-E-A-T (author) |
| 26 | `blog/best-gyms-melbourne-cbd-2026-complete-comparison-guide.html` | Best gyms Melbourne CBD 2026 | Compare gyms, pricing, pass types | H1 (guide) | 10+ | 2+ | ~4500+ | 10+ | — | self | index, follow | Article |
| 27 | `blog/dried-curry-leaves-australia-…-2026.html` | Dried curry leaves guide | Karipatta uses, storage | Guide H1 | 8+ | 4+ | ~3500+ | 12+ | — | self | index, follow | Article |
| 28 | `blog/australian-health-consumer-2026-behavioral-psychographics-wellness.html` | Australian health consumer 2026 | Psychographics, wellness trends | Report-style H1 | 6+ | 3+ | ~3000+ | 8+ | — | self | index, follow | Article |
| 29 | `blog/moringa-vs-matcha-energy-metabolism-2026.html` | Moringa vs matcha (energy) | Caffeine vs caffeine-free, metabolism | H1 | 5+ | 2+ | ~2200+ | 8+ | — | self | noindex, follow (per scrape metadata) | Article (still render) |
| 30 | `blog/universal-size-converter.html` | Universal size converter (blog tool) | Interactive AU/US/UK size tool | H1 with tool | 1 | 0 | ~500 | 5+ | — | self | index, follow | WebApplication possible |
| 31 | `blog/science-shade-drying-vs-sun-drying-moringa.html` | Shade vs sun drying moringa | Processing science, nutrients | H1 | 5+ | 2+ | ~2800+ | 8+ | — | self | index, follow | Article |
| 32 | `blog/rosabella-moringa-reviews-legit-or-overhyped-2026.html` | Rosabella moringa reviews | Brand review / comparison | H1 | 4+ | 1+ | ~2000+ | 6+ | — | self | noindex, follow (per prior scrape) | verify |
| 33 | `blog/top-moringa-companies-australia-2026.html` | **404** — Page not found (Netlify) | *n/a* — URL in crawl map **does not resolve** (`statusCode`: 404, Apr 2026) | none (placeholder) | 0 | 0 | ~40 | 0 | — | *n/a* | *n/a* | **Do not trust prior “full page” assumptions** |
| 34 | `blog/darjeeling-black-tea-melbourne-muscatel-marvel.html` | Darjeeling black tea (Melbourne) | Tea feature + culture | H1 (story) | 6+ | 2+ | ~2200+ | 6+ | **Body contains “SEO snippets & linking strategy”** (editorial issue) | self | index, follow | Article |
| 35 | `blog/musashi-protein-powder-australia-comprehensive-guide-2026.html` | Musashi protein (AU guide) | Third-party product guide | H1 | 6+ | 2+ | ~4000+ | 10+ | — | self | noindex, follow (per prior scrape) | verify |
| 36 | `blog/high-protein-snacks-australia-25-options-under-150-calories-2025.html` | High-protein snacks AU | Snack list, calories | H1 | 5+ | 2+ | ~2800+ | 8+ | — | self | noindex, follow (per prior scrape) | verify |
| 37 | `blog/best-protein-powder-australia-2026-complete-guide.html` | Best protein powder AU 2026 | Category guide, brands | H1 | 6+ | 2+ | ~4500+ | 12+ | — | self | index, follow (verify) | Article |
| 38 | `blog/moringa-soap-skin-science-australia-2026.html` | Moringa soap & skin | Soap science, routine | H1 | 5+ | 2+ | ~2500+ | 6+ | “Nutrites” typo seen in long articles | self | index, follow | Article |
| 39 | `blog/buy-moringa-powder-melbourne-victoria-chinese-guide.html` | Chinese guide (Melbourne) | 中文/双语 shopping guide; **check free-shipping $ vs $80+ site-wide** | H1 | 4+ | 1+ | ~2000+ | 8+ | — | self | index, follow | Article |
| 40 | `blog/is-moringa-legit-what-science-and-real-users-say-2026.html` | Is moringa legit? | Science + user framing | H1 (question) | 5+ | 2+ | ~2200+ | 14+ | og image imgur | self | **index, follow** | Article; author in body |
| 41 | `blog/moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html` | Moringa powder Australia: definitive guide | Pillar: benefits, use, quality | Pillar H1 | 8+ | 3+ | ~5000+ | 20+ | — | self | **index, follow** | Article; dates in meta |
| 42 | `blog/moringa-brands-comparison-australia-2026.html` | Best moringa powder Australia \| brands ranked | 2026 brand guide; long page | H1/TOC | 15+ | 5+ | **8000+** | 25+ | Table-heavy; i.imgur | self | **index, follow** | Article; disclosure present |
| 43 | `blog/how-to-add-moringa-to-diet.html` | 10 ways to add moringa… (see og:title) | `description` has truncated/glue text plus second sentence; template merge risk | 12+ | 4+ | **10000+** (very long) | 20+ | Multiple CTAs, newsletter blocks | `https://…/how-to-add-moringa-to-diet.html` | **index, follow** | Article |
| 44 | `blog/10-dollar-superfood-replaced-200-supplement-stack-australia-2026.html` | (In sitemap) | (Not in primary scrape batch) | — | — | — | — | — | — | — | In sitemap: index (assumed) | In sitemap only here |
| 45 | `blog/where-to-buy-moringa-in-australia-online-vs-stores-2026-guide.html` | (In sitemap) | Pillar: channels vs DTC | — | — | — | — | — | — | — | In sitemap | High commercial intent |
| 46 | `blog/moringa-vs-spirulina-vs-matcha-comparison-australia.html` | (In sitemap) | Head-to-head superfoods | — | — | — | — | — | — | — | In sitemap | Article |
| 47 | `blog/does-moringa-have-caffeine-truth-about-energy-focus-side-effects-2026.html` | (In sitemap) | Caffeine FAQ | — | — | — | — | — | — | — | In sitemap | Article |
| 48 | `blog/melbourne-body-burden-report-2026.html` | (In sitemap) | Local / env-health angle | — | — | — | — | — | — | — | In sitemap | Article |
| 49 | `blog/moringa-powder-vs-capsules-which-one-actually-works-better-2026.html` | (In sitemap) | Format comparison (money page) | — | — | — | — | — | — | — | In sitemap | Article; links to product |
| 50 | `nutrithrive_labs/sitemap-generator.html` | (In sitemap; not in main scrape) | Free tool page | TBD on rescrape | — | — | — | — | — | self | In sitemap | SoftwareApplication candidate |

**Rows 44–50:** Listed in [sitemap.xml](../sitemap.xml); rows 1–43 carry the main scrape detail. **Meta boilerplate** (“from NutriThrive… Explore practical guidance…”) was observed on e.g. **Contact** and **How to add moringa** — treat as duplicate meta pattern to fix.

**Notes (cross-cutting):**

- **Canonical:** For scraped pages, `og:url` matched the final URL; confirm `<link rel="canonical">` in HTML for each template (scrape was markdown-first; confirm in build).
- **Schema:** On-site `index.html` and product `index.html` files include `WebSite`, `Organization`, `Product`, and repeated `LocalBusiness` JSON-LD (see blog `BlogPosting` blocks in [blog/index.html](../blog/index.html) — there is **duplicate** `BlogPosting` script for the same blog index).
- **Images:** Many articles use `og:image` and sharing images from **i.imgur.com**; verify ownership, hotlinking, and alt text on in-content figures (not all exposed in `links` scrape).
- **Internal links / broken patterns:** e.g. `is-moringa` article links to `https://nutrithrive.com.au/usage-guide/how-to-use-moringa.html` while sitemap uses `/pages/usage-guide/...` — **URL inconsistency** to fix.
- **404 (map-listed, no live HTML):** `https://nutrithrive.com.au/blog/top-moringa-companies-australia-2026.html` and `https://nutrithrive.com.au/blog/moringa-fitness-athletes-australia-2026.html` returned **404** with Netlify placeholder (Apr 2026). Remove/map from sitemap-internal links until fixed — see `01_site_map.md`.

---

*Analysis of this dataset: `03_technical_seo.md` and `04_content_ux.md`.*
