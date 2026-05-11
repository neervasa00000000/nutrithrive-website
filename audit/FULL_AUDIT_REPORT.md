# NutriThrive — Full SEO & UX audit report

**Live site audited:** https://nutrithrive.com.au  
**Audit date:** 2026-05-11  
**Methods:** Firecrawl `firecrawl_map` + **50×** `firecrawl_scrape` (structured JSON extraction), cross-checked with repository `sitemap.xml`.

**Note on brief:** Instructions referenced `https://YOURWEBSITE.com`; this deliverable applies to **NutriThrive** as deployed and mapped above.

---

## Table of contents

1. [Executive summary](#1-executive-summary)  
2. [Site map & URL inventory](#2-site-map--url-inventory)  
3. [Raw scrape data (50 pages)](#3-raw-scrape-data-50-pages)  
4. [Technical SEO findings](#4-technical-seo-findings)  
5. [Content & UX findings](#5-content--ux-findings)  
6. [Quick wins (top 15)](#6-quick-wins-top-15)  
7. [Appendix: evidence highlights](#7-appendix-evidence-highlights)

---

## 1. Executive summary

**Overall health score: 62 / 100** (see `audit/06_executive_summary.md` for reasoning in plain language).

**In one paragraph:** The brand story, Melbourne logistics, and long-form guides are competitive advantages. Technical SEO is held back by **widespread incorrect canonical URLs** (About, Melbourne, shop index, soap, and multiple blog posts canonicalized to the homepage, product page, or wrong article), **product URL vs canonical slug mismatches**, and a **sitemap URL that returns 404**. Resolving canonicals and sitemap integrity is the highest-leverage work before investing in new content.

Full non-technical write-up: **`audit/06_executive_summary.md`**.

---

## 2. Site map & URL inventory

- Final indexable URL list (54), grouped by section, plus blocklist and noindex omissions: **`audit/01_site_map.md`** (aligned with `sitemap.xml` / `node scripts/build-sitemap.js`).

**Critical sitemap note:** `https://nutrithrive.com.au/blog/best-protein-energy-bars-australia-2026-supermarket-guide.html` is in `sitemap.xml` but returned **HTTP 404** when scraped.

---

## 3. Raw scrape data (50 pages)

Per-URL table (title, meta, H1, word count, canonical, schema): **`audit/02_raw_pages.md`**

---

## 4. Technical SEO findings

Detailed checklist (titles, metas, headings, images, internal links, canonical matrix, schema): **`audit/03_technical_seo.md`**

**Highest-severity pattern (abbreviated):**

| Issue | Example |
|-------|---------|
| Canonical → homepage | `/about`, `/melbourne`, `/products`, `/products/moringa-soap/`, `…/nutrithrive-delivers-across-victoria…` |
| Canonical → blog index | `…/moringa-vs-coffee-melbourne-energy-hack.html` |
| Canonical → product | Multiple education posts (`is-moringa-legit`, `does-moringa-have-caffeine`, `science-shade-drying`, `batch-codes`, `seniors-joint`, etc.) |
| Canonical → different article | `rosabella…`, `smart-moringa…`, `moringa-powder-guide…`, `how-to-use-moringa-powder-daily…` |
| Product slug ≠ canonical slug | Curry leaves, black tea, combo pack |

---

## 5. Content & UX findings

Homepage, blog, products, Melbourne, contact, FAQ, newsletter, labs: **`audit/04_content_ux.md`**

**Themes:** Strong differentiation and depth; fix **first-screen clarity** on a few pillars (H1 on brands comparison; Rosabella title stack); reduce **user distrust** from URL/canonical inconsistency when sharing links.

---

## 6. Quick wins (top 15)

Ranked list with impact, effort, and timeline: **`audit/05_quick_wins.md`**

---

## 7. Appendix: evidence highlights

### Exact problematic canonicals (samples)

- **About:** `https://nutrithrive.com.au/about` → canonical `https://nutrithrive.com.au/`  
- **Melbourne:** canonical `https://nutrithrive.com.au/`  
- **Moringa vs coffee article:** canonical `https://nutrithrive.com.au/blog/`  
- **Curry leaves product:** live under `/products/curry-leaves/` → canonical `https://nutrithrive.com.au/products/dried-curry-leaves`

### Exact title / social mismatch

- **Rosabella URL** `…/rosabella-moringa-reviews-legit-or-overhyped-2026.html`: metadata `title` “Rosabella Moringa Review…” vs `og:title` “Moringa Capsules vs Powder…” (scraped 2026-05-11).

### Exact 404

- `https://nutrithrive.com.au/blog/best-protein-energy-bars-australia-2026-supermarket-guide.html` → `Page not found` (status 404).

### Positive control (self-canonical + strong content)

- e.g. `https://nutrithrive.com.au/blog/where-to-buy-moringa-in-australia-online-vs-stores-2026-guide.html` — canonical matches URL; Article + BlogPosting schema reported.

---

## Deliverable file index

| File | Purpose |
|------|---------|
| `audit/01_site_map.md` | Final site map & sitemap exclusions |
| `audit/02_raw_pages.md` | 50-page scrape summary table |
| `audit/03_technical_seo.md` | Technical SEO analysis |
| `audit/04_content_ux.md` | Content & UX analysis |
| `audit/05_quick_wins.md` | Prioritized fix list |
| `audit/06_executive_summary.md` | Owner-friendly summary |
| `audit/FULL_AUDIT_REPORT.md` | This master document |

---

*End of full audit report.*
