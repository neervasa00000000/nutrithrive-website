---
name: NutriThrive SEO audit and optimisation
description: Full SEO audit of nutrithrive.com.au and all fixes applied April 2026
type: project
---

April 2026 full SEO pass on nutrithrive.com.au (static HTML site hosted on Netlify, source at ~/Desktop/Website).

**Why:** User wants to rank for moringa powder / superfood keywords in Australia, targeting Melbourne and national market.

**How to apply:** Use this as context when making further site changes — always check this before suggesting schema or meta changes to avoid re-doing work.

## Site overview
- Static HTML site, no CMS/framework
- Products: moringa powder, Darjeeling black tea, dried curry leaves, combo packs, moringa soap
- Physical address: 15 Europe Street, Truganina VIC 3029 (warehouse, not public storefront)
- Phone: +61 438 201 419 | Email: nutrithrive0@gmail.com (Gmail — professional domain email recommended)
- ABN: 32 639 442 616
- Geo: -37.8323773, 144.7187983

## Fixes applied (April 2026)
1. **NAP standardisation** — Bulk replaced "Nutri Thrive" → "NutriThrive" across all 40+ HTML/JSON files. Schema `name` fields, titles, OG tags all consistent.
2. **AggregateRating schema** added to all 5 product PDPs:
   - Moringa Powder: 4.9/5, 512 reviews
   - Black Tea: 4.5/5, 89 reviews
   - Curry Leaves: 5/5, 134 reviews
   - Combo Pack: 5/5, 15 reviews
   - Moringa Soap: 4.9/5, 87 reviews
3. **LocalBusiness @type** updated to `["LocalBusiness", "HealthFoodStore"]` on homepage, all PDPs, blog posts, and pages
4. **priceRange + aggregateRating** added to LocalBusiness in homepage schema and shared schema JSON file
5. **Labs utility pages** set to `noindex, follow` (dedup-lines, quick-notes, pomodoro-timer, password-generator, time-converter, sitemap-generator). Labs index stays indexed.
6. **Duplicate GA script** removed from black-tea PDP
7. **Sitemap lastmod** all updated to 2026-04-26
8. **Blog dateModified** updated for 2 posts that had stale dates
9. **Shared schema file** (`shared/schema/nutrithrive-local-business.json`) updated with HealthFoodStore, aggregateRating, priceRange
10. **JSON-LD validation** — all 7 critical pages pass Python json.loads (0 errors)

## Still recommended (not yet done)
- **Google Business Profile** — NOT set up or linked. Critical for local pack. Must be claimed at business.google.com, set as Service Area Business (hide street address), category: Health Food Store
- **Professional domain email** — nutrithrive0@gmail.com → support@nutrithrive.com.au for E-E-A-T
- **Suburb landing pages** — /melbourne/werribee/, /melbourne/tarneit/, /melbourne/point-cook/ for long-tail local
- **Australian directory citations** — Yellow Pages AU, True Local, Bing Places, Yelp AU (NAP must match exactly: "NutriThrive")
- **Google reviews** — 512 on-site reviews but unknown Google review count; push customers to leave Google reviews
