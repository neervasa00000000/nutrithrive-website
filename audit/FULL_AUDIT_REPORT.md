# Nutri Thrive — Full website audit report

**Domain:** https://nutrithrive.com.au  
**Audit date:** 12 April 2026  
**Scope:** All URLs in `sitemap.xml` (**24** live pages). Discovery cross-checked with Firecrawl `firecrawl_map` (`sitemap: "only"`). Page data collected with Firecrawl `firecrawl_scrape` (structured extraction).

---

## Table of contents

1. [Executive summary](06_executive_summary.md)  
2. [Site map & URL inventory](01_site_map.md)  
3. [Raw page extracts](02_raw_pages.md)  
4. [Technical SEO findings](03_technical_seo.md)  
5. [Content & UX findings](04_content_ux.md)  
6. [Prioritised quick wins](05_quick_wins.md)  
7. [Consolidated recommendations (this file)](#7-consolidated-recommendations)

---

## 7) Consolidated recommendations

### A. Canonical & URL governance (highest priority)

Multiple high-value pages currently canonicalise to the **homepage**, which tells search engines those URLs are not authoritative:

- `/about`  
- `/melbourne/`  
- `/pages/newsletter/`  
- `/products/`

Separately, several **product** pages use canonical slugs that do not match the **folder URLs** users browse:

- `/products/black-tea/` vs canonical `.../products/premium-black-tea`  
- `/products/combo-pack/` vs canonical `.../products/premium-wellness-combo-pack`  
- `/products/curry-leaves/` vs canonical `.../products/dried-curry-leaves`

**Recommendation:** Pick one URL system (folders vs slugs), enforce with **301 redirects**, and align `<link rel="canonical">` + internal links + sitemap to that single system.

### B. Metadata completeness

Add or repair `<meta name="description">` on:

- Privacy / terms hub  
- Shipping & returns  
- Labs hub + individual tools (or `noindex` tools if not meant to rank)  
- Dried curry leaves blog (ensure meta description matches social copy)

### C. Social / Open Graph hygiene

- Fix **`og:image`** on `/pages/usage-guide/how-to-use-moringa.html` (malformed absolute URL in scrape).  
- Replace **relative** `og:image` on `/products/combo-pack/` with an absolute URL.

### D. Internal linking integrity

Remove or update internal links that target URLs **outside** the published sitemap until verified live—starting with `/contact` (highest concentration of “extra” blog URLs in the scrape).

### E. Content & UX

- Expand **newsletter** and **shipping** pages (currently thin for indexable templates).  
- Reduce **FAQ** heading duplication (accordion semantics).  
- Prefer **self-hosted** images for product grids and primary blog art (reduce Imgur dependency).

### F. Labs & indexation strategy

Decide whether Labs tools are:

- **Marketing assets** (then add descriptions + intentional internal linking), or  
- **Operational utilities** (then `noindex`, tighten sitemap, avoid competing with revenue URLs).

---

## Appendix — Files in this audit folder

| File | Purpose |
|------|---------|
| `AUDIT_INSTRUCTIONS.md` | Master prompt + scope note |
| `01_site_map.md` | URL inventory grouped by page type |
| `02_raw_pages.md` | Per-URL title/meta/canonical/headings/schema notes |
| `03_technical_seo.md` | Technical SEO deep dive |
| `04_content_ux.md` | Content & UX review |
| `05_quick_wins.md` | Top 15 prioritised fixes |
| `06_executive_summary.md` | Owner-friendly summary +30-day plan |
| `FULL_AUDIT_REPORT.md` | This consolidated report |

---

_End of report._
