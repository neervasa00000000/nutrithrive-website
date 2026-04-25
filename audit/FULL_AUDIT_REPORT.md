# NutriThrive (nutrithrive.com.au) — Full website audit

**Date:** April 2026  
**Method:** Firecrawl map and scrape (MCP) against the live site; `sitemap.xml` from the repository; spot-check of HTML/JSON-LD in the repo.  
**Template note:** The original brief used `https://YOURWEBSITE.com` — this report targets **[https://nutrithrive.com.au](https://nutrithrive.com.au)**.

---

## Table of contents

1. [How to read this report](#how-to-read-this-report)  
2. [Scope and mapping](#scope-and-mapping)  
3. [High-level health score and verdict](#high-level-health-score-and-verdict)  
4. [Phase 1 — Site map](#phase-1--site-map)  
5. [Phase 2 — Page-level data (50 URLs)](#phase-2--page-level-data-50-urls)  
6. [Phase 3 — Technical SEO](#phase-3--technical-seo)  
7. [Phase 4 — Content and UX](#phase-4--content-and-ux)  
8. [Phase 5 — 15 quick wins](#phase-5--15-quick-wins)  
9. [Phase 6 — Executive summary (non-technical)](#phase-6--executive-summary-non-technical)  
10. [Appendix — File index](#appendix--file-index)

---

## How to read this report

- **Product owner:** Read **Section 3** and **Phase 6** first, then **Phase 5** for a ranked fix list.  
- **Editor / copy:** **Phase 4** and the **E-E-A-T** and **trust** items in **Phase 3** (headings, thin content, tone).  
- **Developer / SEO:** **Phase 1–3**, **sitemap**, **canonical/redirects**, **schema**, and **`noindex`**.

Each phase has a **dedicated** markdown file in this folder with **full** tables and evidence.

---

## Scope and mapping

- **Sitemap (repo):** **55** `<loc>` entries — see [sitemap.xml](../sitemap.xml).  
- **Crawl / map:** The live site and internal linking expose **more** article URLs than the current sitemap lists — **sitemap is incomplete** relative to the full public blog.  
- **Phases 1–2 files:** [01_site_map.md](./01_site_map.md) · [02_raw_pages.md](./02_raw_pages.md)  
- **Sample size:** **50** URLs processed in the raw sheet (rows 1–43 detailed scrape, 44–50 sitemap/utility follow-up notes).

## High-level health score and verdict

| Score | Rationale (short) |
|------:|-------------------|
| **72 / 100** | Strong **content** and **product** foundation; main deductions for **sitemap gaps**, some **`noindex`** on valuable posts, **meta** duplication/bugs, **URL** inconsistency for usage guide, and **policy** number mismatches. |

**Verdict:** The site is **not** starting from zero — the priority is **operational SEO hygiene** and **one source of truth** for shipping, URLs, and indexation.

---

## Phase 1 — Site map

**File:** [01_site_map.md](./01_site_map.md)

**Contents:** Target URL, mapping method, **sitemap** count (**55**), **grouping** of URLs (home, **products**, **blog** index + posts, **about/contact/faq**, **Melbourne**, **legal**, **pages** shipping/newsletter/usage, **nutrithrive_labs** tools), **URL pattern** notes, and **gaps** (sitemap vs crawl, `.html` vs clean paths, privacy **variants**).

---

## Phase 2 — Page-level data (50 URLs)

**File:** [02_raw_pages.md](./02_raw_pages.md)

**Contents:** A **table** of **50** URLs with: title, meta (abridged), H1, heading counts, approximate word count, internal link count, image notes, canonical / `og:url` habit, `robots`, and schema where observed. **Cross-cutting** notes: **i.imgur** `og` images, **duplicate** `BlogPosting` on blog index, **broken** internal path risk for `usage-guide`.

---

## Phase 3 — Technical SEO

**File:** [03_technical_seo.md](./03_technical_seo.md)

**Checklist cover:** Titles, meta, headings, images, **internal** links, **content** (thin, duplicate, CTA, E-E-A-T), **URLs**, **schema** (Product, **LocalBusiness** repetition, **BlogPosting** on index), **`noindex`**, sitemap, **og** best practices.

---

## Phase 4 — Content and UX

**File:** [04_content_ux.md](./04_content_ux.md)

**Covers:** **Home** value, CTAs, trust, review variety; **blog** depth, structure, internal links, **one** CTA, language guides and **number** consistency; **products** clarity and **objection** handling; **contact/about**; **NutriThrive** Labs (tools indexability and intro copy).

---

## Phase 5 — 15 quick wins

**File:** [05_quick_wins.md](./05_quick_wins.md)

**Format:** 15 items with **URL**, **problem**, **fix**, **impact/effort**, and **one-line “why it matters”**. Top items: **full sitemap**, **meta** fixes, **noindex** review, **one** usage-guide URL, remove **public SEO meta-jargon** from a tea article, **LocalBusiness/JSON-LD** deduplication, **$80** policy consistency, **og** self-hosting, **H1** on tools, FAQ dedup on `how-to-add`, typos.

**Suggested timing:** **This week** = priorities 1–5, **this month** = 6–12, **this quarter** = 13–15 (adjust as needed).

---

## Phase 6 — Executive summary (non-technical)

**File:** [06_executive_summary.md](./06_executive_summary.md)

**Includes:** **72/100** score with **reasons**, top **3 strengths**, top **3 problems**, a **30-day** week-by-week plan, and a **short** list of **free** tools (Search Console, Bing, PageSpeed, rich results, analytics).

---

## Appendix — File index

| File | Description |
|------|-------------|
| [01_site_map.md](./01_site_map.md) | Map, counts, **grouping**, URL **patterns** |
| [02_raw_pages.md](./02_raw_pages.md) | **50** URL **table** and scrape notes |
| [03_technical_seo.md](./03_technical_seo.md) | **Technical** SEO **checklist** |
| [04_content_ux.md](./04_content_ux.md) | **Content** and **UX** by page type |
| [05_quick_wins.md](./05_quick_wins.md) | **15** ranked **actions** |
| [06_executive_summary.md](./06_executive_summary.md) | **Owner** summary, **30-day** plan |
| [FULL_AUDIT_REPORT.md](./FULL_AUDIT_REPORT.md) | **This** master report |

---

*End of full audit. For questions, extend this folder with a `07_follow_up_checklist.md` when fixes ship — not included unless you request a re-audit pass.*
