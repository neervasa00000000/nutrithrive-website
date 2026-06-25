# GSC Day 0 Baseline — NutriThrive SEO Sprint

**Date:** 25 June 2026  
**Property:** https://nutrithrive.com.au  
**Sprint start:** Before on-site SEO implementation

## How to export from Google Search Console

1. **Performance → Search results** → Date range: last 28 days → Export CSV.
2. Filter queries where **Average position** is 11–30 (quick-win band).
3. **Pages** tab → export pages with impressions > 0, position > 10.
4. **Indexing → Pages** → note "Not indexed" and "Crawled – currently not indexed" counts.
5. **Sitemaps** → confirm `sitemap.xml` last read date.

Store exports as `audit/gsc-exports/performance-YYYY-MM-DD.csv` for Day 7 comparison.

## Pre-sprint SERP visibility (Firecrawl AU search, June 2026)

NutriThrive does **not** appear in top 15 for these commercial queries:

| Query | Who ranks instead |
|-------|-------------------|
| moringa powder australia buy benefits | Propel Health, Forever Foods, Herb Cottage, WebMD |
| rosabella moringa chemist warehouse | TikTok, Chemist Warehouse, Instagram |
| AG1 alternative australia | Reddit, US review sites, drinkag1.com |
| is moringa banned australia 2026 | FDA, FSANZ, CDC, DAFF |
| moringa capsules vs powder australia | Kuli Kuli, Plant Doctor, Forest Super Foods |

**Branded:** `nutrithrive moringa review` — only homepage (position 1) ranks; no third-party reviews.

## Known crawl/index issues (fixed in this sprint)

| Issue | Status |
|-------|--------|
| `/buy-moringa-powder-australia/` indexable but 301 to PDP | → noindex |
| Blog index ItemList schema `numberOfItems: 12` | → regenerate to live count |
| 5 noindexed posts in public blog grid | → exclude from `blog-articles.js` |
| Stale robots.txt Allow paths | → cleaned |

## Day 7 comparison checklist

- [ ] Total impressions (28d) vs Day 0
- [ ] Clicks (28d) vs Day 0
- [ ] New URLs indexed: heavy-metals, pregnancy, smoothie posts
- [ ] Position change on: `is moringa banned australia`, `how to choose moringa powder australia`
- [ ] Indexing errors on buy-moringa URL resolved

## GSC actions after deploy

1. **Sitemaps** → Resubmit `https://nutrithrive.com.au/sitemap.xml`
2. **URL Inspection** → Request indexing for:
   - `/blog/moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026`
   - `/blog/moringa-pregnancy-safe-australia-trimester-guide-2026`
   - `/blog/moringa-smoothie-recipes-australia-easy-2026`
   - `/blog/is-moringa-banned-in-australia` (after refresh)
3. **Removals** — not needed if buy-moringa is noindex only
