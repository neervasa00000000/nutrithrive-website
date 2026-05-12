# NutriThrive — Full website audit report

**Domain:** https://nutrithrive.com.au  
**Audit date:** 12 May 2026  
**Prepared with:** Firecrawl MCP (`firecrawl_map`, `firecrawl_scrape` on 50 priority URLs + full site map discovery).

> **Note on the brief:** The instructions referenced `https://YOURWEBSITE.com`. This repository and live `rel=canonical` tags point to **nutrithrive.com.au**, so the audit was executed against that production site.

---

## Table of contents

1. [Executive summary](#1-executive-summary)  
2. [Site map & inventory](#2-site-map--inventory)  
3. [Raw scrape methodology & 50-page dataset](#3-raw-scrape-methodology--50-page-dataset)  
4. [Technical SEO findings](#4-technical-seo-findings)  
5. [Content & UX findings](#5-content--ux-findings)  
6. [Prioritised quick wins](#6-prioritised-quick-wins)  
7. [Deliverable files in `/audit`](#7-deliverable-files-in-audit)

---

## 1. Executive summary

See **`audit/06_executive_summary.md`** for the non-technical version.

**Score: 66 / 100** — Strong Australian positioning and deep editorial content; held back by canonical/host issues, a 404 article still advertised in discovery, placeholder assets on Contact, and heading hygiene on the homepage and select posts.

---

## 2. Site map & inventory

See **`audit/01_site_map.md`** for:

- Full URL list grouped by **homepage**, **blog**, **products**, **landings**, **about/contact/support**, **legal**, **labs/tools**, and **sitemap.xml**.  
- **~66** URLs from map (including path variants and the XML sitemap).  
- Notes on **`.html` vs extensionless** duplicates and the **404** journal URL.

---

## 3. Raw scrape methodology & 50-page dataset

See **`audit/02_raw_pages.md`** for:

- The **50 scraped URLs** in one summary table (title, meta length notes, H1 count, canonical, schema types, approximate word count).  
- Documented **404** on `…/blog/30-day-moringa-experiment-replaced-supplements-journal-2026.html` and the **replacement** scrape used to keep the sample at 50 healthy pages.  
- **Redirect:** `/pages/usage-guide/how-to-use-moringa` → `/blog/how-to-add-moringa-to-diet.html`.  
- Internal link and image QA flags.

---

## 4. Technical SEO findings

See **`audit/03_technical_seo.md`** for full detail. Highest severity themes:

- **Canonical chaos** — About, Melbourne, Newsletter, multiple blogs, and some PDPs point canonicals at the **homepage** or **moringa PDP** instead of self.  
- **`www` vs apex** — `privacy-policy` canonical uses `www.nutrithrive.com.au`.  
- **Multiple H1** on homepage and several posts.  
- **Schema gaps** on About, shop hub, some articles; non-standard `Comparison` type on one post.  
- **Thin** `/products` hub content.  
- **404** still listed in map for a journal post.

---

## 5. Content & UX findings

See **`audit/04_content_ux.md`**. Highlights:

- **Value proposition** and **local proof** (Melbourne / Truganina) are compelling.  
- **Trust risks:** `example.com` map image on Contact; possible broken FAQ images.  
- **Intent mismatch:** Rosabella “reviews” URL vs capsules-first content; generic blog index meta.

---

## 6. Prioritised quick wins

See **`audit/05_quick_wins.md`** for **15** ranked fixes with **impact / effort / priority** and exact URLs.

---

## 7. Deliverable files in `/audit`

| File | Purpose |
|------|---------|
| `audit/01_site_map.md` | URL inventory from `firecrawl_map` |
| `audit/02_raw_pages.md` | 50-page scrape summary table + notes |
| `audit/03_technical_seo.md` | Title, meta, headings, images, links, URLs, schema |
| `audit/04_content_ux.md` | Homepage, blog, PDP, landings, contact, about |
| `audit/05_quick_wins.md` | Top 15 fixes ranked |
| `audit/06_executive_summary.md` | Owner-friendly summary + 30-day plan + tools |
| `audit/FULL_AUDIT_REPORT.md` | This master document |

---

*End of full audit report.*
