# Nutri Thrive — Full website audit (SEO & UX)

**Target website:** [https://nutrithrive.com.au](https://nutrithrive.com.au)  
**Audit date:** 24 April 2026  
**Method:** [Firecrawl](https://www.firecrawl.dev/) (MCP) — `firecrawl_map` for URL discovery, `firecrawl_crawl` (50 pages) for content/meta/headings/links/images.

*Your brief referenced `https://YOURWEBSITE.com`; the production domain above was used from the live site and repository canonicals.*

---

## Table of contents

1. [Executive summary](#1-executive-summary)  
2. [Site map (72 URLs)](#2-site-map-72-urls)  
3. [Raw page data (50 pages)](#3-raw-page-data-50-pages)  
4. [Technical SEO findings](#4-technical-seo-findings)  
5. [Content & UX findings](#5-content--ux-findings)  
6. [Top 15 quick wins](#6-top-15-quick-wins)  
7. [Appendix: files in this folder](#7-appendix-files-in-this-folder)  

---

## 1. Executive summary

- **Health score: 72 / 100** — Strong niche focus and content depth; main gaps are **duplicate URLs**, **long/non-unique metas**, and **policy/URL** consistency.  
- **This week’s focus:** One URL per page (redirects), one privacy URL, fix homepage meta, add links to [Melbourne](https://nutrithrive.com.au/melbourne) and [Chinese VIC moringa guide](https://nutrithrive.com.au/blog/buy-moringa-powder-melbourne-victoria-chinese-guide.html), fix **double H1** on the [Musashi](https://nutrithrive.com.au/blog/musashi-protein-powder-australia-comprehensive-guide-2026.html) post, verify homepage carousel **blog** URLs return **200**.

**Full non-technical write-up:** [audit/06_executive_summary.md](06_executive_summary.md)

---

## 2. Site map (72 URLs)

- **Map tool:** `firecrawl_map` with `limit: 500`  
- **Total discovered:** **72** URLs (grouped: homepage, blog, products, Melbourne landing, about/contact/FAQ, legal/shipping, newsletter, usage guide, **NutriThrive Labs** tools, cart, `sitemap.xml`).

**Full list and grouping:** [audit/01_site_map.md](01_site_map.md)

**Duplicate-route highlights:** same article with/without **`.html`** (e.g. moringa grower report); **Labs** tools with `.html` mirrors; `how-to-use-moringa` with and without extension.

---

## 3. Raw page data (50 pages)

- **Crawl tool:** `firecrawl_crawl` — **50** pages, status **completed**  
- **Per-page fields:** URL, title, meta description (length + excerpt), H1 / H2 / H3 samples, **word count** (HTML vs markdown), **internal link** count, **inlink estimate** (within the 50-page batch, normalised URLs), **image** sample with `alt` and `loading`, **JSON-LD** types found in **body** fragment (if any)

**Note:** The crawl HTML fragment may **omit** `<head>`-only `link rel="canonical"` and some JSON-LD. Confirm in “View page source” on the live site.

**Full table:** [audit/02_raw_pages.md](02_raw_pages.md) (~70k characters)

---

## 4. Technical SEO findings

| Area | Snapshot |
| --- | --- |
| **Title tags** | No missing in sample; **1 duplicate title** across two grower’s-report URLs |
| **Meta** | **12/50** over 160 characters; **11/50** share boilerplate “NutriThrive Australia. Explore practical guidance…” |
| **H1** | All pages had ≥1 H1; **1 page** (Musashi) had **multiple** H1s |
| **Schema (body)** | **0/50** with JSON-LD in parsed body — **verify in `<head>`** (your templates may still output it) |
| **Internal links** | **2** URLs in the batch with **0** inlinks from others (after normalising `.html`) — [Melbourne](https://nutrithrive.com.au/melbourne), [Chinese moringa Melbourne guide](https://nutrithrive.com.au/blog/buy-moringa-powder-melbourne-victoria-chinese-guide.html) |
| **Thin &lt;300 words (sample)** | Labs tools, cart, contact, shop index (borderline), etc. — see `02` |

**Full analysis:** [audit/03_technical_seo.md](03_technical_seo.md)

---

## 5. Content & UX findings

- **Homepage:** Clear **H1** (“Premium Moringa Powder from Melbourne…”), value prop, product grid, long testimonial list, CTA to products and blog.  
- **Blog:** several articles are **substantive** (e.g. [dried curry leaves guide](https://nutrithrive.com.au/blog/dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html)) with **date** and **internal links** to [products](https://nutrithrive.com.au/products/).  
- **Risk:** a few **off-niche** articles (e.g. **CBD gyms**) may dilute topical authority unless clearly tied to your brand.

**Full narrative:** [audit/04_content_ux.md](04_content_ux.md)

---

## 6. Top 15 quick wins

Ranked with **page URLs**, **problem**, **fix**, **impact/effort**, and **word count**-style time buckets:

**Full list:** [audit/05_quick_wins.md](05_quick_wins.md)

**Highest impact this week (summary):**  
(1) **301** duplicate content URLs, (2) **fix homepage meta** length/garble, (3) **single privacy URL**, (4) **replace boilerplate** metas, (5) **internal links** to under-linked landings, (6) **one H1** on Musashi, (7) **verify** carousel / blog slugs.

---

## 7. Appendix: files in this folder

| File | Role |
| --- | --- |
| `01_site_map.md` | All mapped URLs, grouped by type |
| `02_raw_pages.md` | 50-page scrape detail |
| `03_technical_seo.md` | Titles, metas, headings, images, links, schema, URLs |
| `04_content_ux.md` | Homepage, blog, product, contact, trust |
| `05_quick_wins.md` | 15 fixes with priorities |
| `06_executive_summary.md` | Owner-friendly summary, score, 30-day plan, tools |
| `parse_crawl.py` | Helper to re-parse a local **`.firecrawl/crawl-50-nutrithrive.json`** if you re-run a crawl (file is **gitignored**; regenerate locally if needed) |
| `FULL_AUDIT_REPORT.md` | This document |

---

*Deliverable: combine this file with the phase files above for a complete PDF or client packet.*
