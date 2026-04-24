# Phase 3 — Technical SEO audit

**Data basis:** 50 pages from `firecrawl_crawl` on [https://nutrithrive.com.au](https://nutrithrive.com.au) (see `audit/02_raw_pages.md`) plus `firecrawl_map` (72 URLs).  
**Caveat:** Scrape/crawl returns mainly the **HTML body**; `<head>`-only content (e.g. some `application/ld+json` blocks) may not appear in the tool output. If structured data is present only in the head, validate with **View page source** or Google Rich Results Test.

---

## 1. Title tags

| Issue | Findings |
| --- | --- |
| Missing titles | **None** in the 50-page sample (every page had a `metadata.title` from Firecrawl). |
| Over 60 characters | **None** flagged in the 50-page set (all titles ≤ 60 chars in sample). |
| Under 30 characters | **None** in sample. |
| Duplicate titles | **Yes:** `Moringa Leaves Melbourne \| Grower's Report 2026` for both `.../moringa-melbourne-complete-growers-report-2026` and `...-2026.html` (duplicated content/URL set). |
| Title vs content | Generally aligned. A few listicles (protein, snacks) are broad but still on-brand. |

**Examples (exact):**
- Homepage: `Nutri Thrive | Premium Moringa Powder in Melbourne` — clear, location + product.  
- Shop index: `Shop Moringa, Curry Leaves & Black Tea | Melbourne AU` — product mix clear.

---

## 2. Meta descriptions

| Issue | Findings |
| --- | --- |
| Missing | **None** in the 50-page sample. |
| Over 160 characters (truncation risk) | **12 / 50** pages. Worst: homepage **~343** chars; contact **~325**; Melbourne **~325**; several blog posts **280–315** chars. |
| Under 70 characters | **None** in sample (all metas were substantial). |
| Duplicates / boilerplate | **11 / 50** metas include the same filler: *"from NutriThrive Australia. Explore practical guidance, products, and updates with fast Australia-wide..."* before the real pitch—hurts uniqueness in SERP snippets. |
| Weak / generic | The boilerplate string is **generic**; it does not add page-specific value. |
| Merged / garbled text | **Homepage** meta in crawl combines two ideas awkwardly: *"... fast Australia-wide d., Shop premium..."* (visible in `02_raw_pages` and live metadata) — fix for readability and click-through. |

---

## 3. Heading structure

| Issue | Findings |
| --- | --- |
| Missing H1 | **None** in sample (at least one H1 from main content or markdown `# `). |
| Multiple H1s | **1 page:** [Musashi protein guide](https://nutrithrive.com.au/blog/musashi-protein-powder-australia-comprehensive-guide-2026.html) — more than one `<h1>`/top-level heading; dilutes main topic. |
| H1 vs intent | Mostly strong (e.g. dried curry leaves guide, product PDPs). |
| Broken hierarchy (skip H2) | Blog templates often use **H1 → H3** in places (e.g. “In this guide” with child items as H3) — not fatal but not ideal for accessibility/outline. |
| Vague headings | A few H2s on homepage are good (“Our products”, “What Our Customers Say”); blog sections are specific. |

---

## 4. Images

| Issue | Findings |
| --- | --- |
| Missing alt | **Product/home:** Most product images in the sample have descriptive `alt` (e.g. *“A bag of NutriThrive Moringa Powder next to a vibrant green smoothie...”*). **SVG cart icon** uses `aria-hidden="true"` (appropriate for decorative). |
| Keyword-stuffed alt | Largely **no**; alts are long but read as descriptive (watch length for screen readers; trim where redundant). |
| Lazy loading | **Present** on many non-critical images (`loading="lazy"` in homepage HTML sample); **hero/above-the-fold** uses `eager` + `fetchpriority` where appropriate. |
| Decorative | Logo has meaningful alt; purely decorative carousal icons should stay `alt=""` if ever stripped of text—currently mostly labeled. |

---

## 5. Internal linking

| Issue | Findings |
| --- | --- |
| Orphaned (within 50-page batch) | After **normalising** URLs (strip `.html`, trailing slashes), **2 pages in the batch** had **no inlinks** from the other 49: `/melbourne` and `/blog/buy-moringa-powder-melbourne-victoria-chinese-guide.html`. (Site-wide, more links may exist; this is limited to the crawled 50.) |
| Homepage internal links | **~17** distinct internal `href` targets on homepage (products, blog, legal, contact, etc.) — **reasonable**; could add 1–2 more priority money pages in nav/footer if not already. |
| Blog → related content | Long guides (e.g. [dried curry leaves](https://nutrithrive.com.au/blog/dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html)) include **“Related guides”** and in-body links to products — **good**. |
| CTAs to conversion | In-content CTAs to **moringa / curry / shop** appear on multiple articles. |
| Broken / inconsistent paths | **Possible mismatch:** carousel copy references paths like `how-to-add-moringa-to-diet` while map lists similar routes—verify 404s and use consistent canonical URLs. **Privacy:** footer links to `/pages/legal/privacy-policy` while map lists `privacy-policy.html`—**duplicate route risk** and split signals. |

---

## 6. Content quality (sample of 50)

| Issue | Findings |
| --- | --- |
| Under ~300 words | **Tools:** [dedup-lines](https://nutrithrive.com.au/nutrithrive_labs/dedup-lines) (~73 words), [sitemap generator](https://nutrithrive.com.au/nutrithrive_labs/sitemap-generator) (~91) — **OK for tools**, but add 1 short SEO paragraph + internal link. **Cart** (~127), **Contact** (~187) — add helpful unique copy. **Shop** index (~**281**) is borderline “thin” for a category page—improve with intro copy and links to subcategories. |
| Duplicate / near-duplicate | **Moringa grower’s report** `.html` vs no extension; **several** **same meta/title** patterns. |
| No clear CTA | Most commercial pages have CTAs; **labs tools** and **cart** are lighter—expected but improvable. |
| E-E-A-T (date, author) | **Strong on many blog posts** — e.g. dried curry leaves: *“Published March 31, 2026 • Australian edition”* and *“NutriThrive Research Team / Editorial”* style blocks. **Not all** articles may repeat this—spot-check per template. |

---

## 7. URL structure

| Issue | Findings |
| --- | --- |
| Uppercase letters | **None** seen in map sample (lowercase paths). |
| Underscores vs hyphens | **`nutrithrive_labs`** uses underscores in folder (works but hyphens are preferred for readability). |
| Overlong URLs (75+ chars) | **Several blog URLs** exceed 75 characters, e.g. `.../dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html` — acceptable for SEO if consistent; still heavy for social sharing. |
| Query strings in map | **No** `?id=` / `&ref=` style URLs in the 72-URL map. |

---

## 8. Schema / structured data

| Finding | Detail |
| --- | --- |
| JSON-LD in **body** fragment from crawl | **0 / 50** pages showed `application/ld+json` in the parsed body HTML. |
| Likely in `<head>` | Your **codebase** (e.g. `pages/homepage/index.html`, product templates) often includes `LocalBusiness` / product-style JSON-LD; **live site may still serve it in head**—**confirm in browser**, not in this body-only export. |
| Gaps to consider | **Blog posts:** add or validate **`Article`/`BlogPosting`** (headline, datePublished, author) on posts that have editorial bylines. **Product PDPs:** confirm **`Product`** + offers where applicable. **Local:** `LocalBusiness` + `hasMap` if not already in head. |

---

## 9. Canonical tags

- Crawl’s HTML body often **omits** `<link rel="canonical">` from the fragment; **metadata** provides **`og:url`** (e.g. homepage `https://nutrithrive.com.au` / trailing slash normalisation). **Action:** ensure each template outputs a **single** canonical in `<head>` and matches the preferred URL (with or without trailing slash, and **one** of `.html` vs extensionless).

---

*This audit is actionable but not a substitute for Google Search Console, server logs, or Core Web Vitals field data.*
