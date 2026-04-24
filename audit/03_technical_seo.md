# Technical SEO audit — https://nutrithrive.com.au

**Based on:** 50 live scrapes in `02_raw_pages.md` and full map (73 URLs).

## Title tags

- No issues flagged in sample.

## Meta descriptions

- **https://nutrithrive.com.au/products/** — Meta description 181 chars (likely truncated; aim ~150–160 max)
- **https://nutrithrive.com.au/contact** — Meta description 325 chars (likely truncated; aim ~150–160 max)
- **https://nutrithrive.com.au/melbourne** — Meta description 313 chars (likely truncated; aim ~150–160 max)
- **https://nutrithrive.com.au/blog/how-to-add-moringa-to-diet** — Meta description 311 chars (likely truncated; aim ~150–160 max)
- **https://nutrithrive.com.au/blog/moringa-brands-reviewed-australia-2025-verdict.html** — Meta description 306 chars (likely truncated; aim ~150–160 max)
- **https://nutrithrive.com.au/blog/moringa-vs-matcha-energy-metabolism-2026.html** — Meta description 306 chars (likely truncated; aim ~150–160 max)
- **https://nutrithrive.com.au/blog/high-protein-snacks-australia-25-options-under-150-calories-2025.html** — Meta description 311 chars (likely truncated; aim ~150–160 max)
- **https://nutrithrive.com.au/blog/best-protein-energy-bars-australia-2026-supermarket-guide.html** — Meta description 274 chars (likely truncated; aim ~150–160 max)
- **https://nutrithrive.com.au/blog/spirulina-vs-moringa-vs-matcha-gut-health-2026-scientific-review.html** — Meta description 280 chars (likely truncated; aim ~150–160 max)
- **https://nutrithrive.com.au/blog/natural-heavy-metal-detox-moringa-cleanse-body.html** — Meta description 288 chars (likely truncated; aim ~150–160 max)
- **https://nutrithrive.com.au/blog/musashi-protein-powder-australia-comprehensive-guide-2026.html** — Meta description 303 chars (likely truncated; aim ~150–160 max)

## Heading structure

- **https://nutrithrive.com.au/blog/musashi-protein-powder-australia-comprehensive-guide-2026.html** — Multiple H1 elements (2)
- **https://nutrithrive.com.au/products/** — Title tag (*“Shop Moringa, Curry Leaves & Black Tea | Melbourne AU”*) and visible **H1** (*“Shop Premium Wellness”*) don’t share the same primary keywords; align for clearer intent (keep one primary keyword phrase in both where possible).

## Images & performance hints

(none)

## Internal linking

(none)

- **Orphan / low-discoverability note:** Map shows duplicate paths for the same content (e.g. `moringa-melbourne-complete-growers-report-2026` and `.html`). In-links should consolidate on one **canonical** URL.

## URL structure

- **https://nutrithrive.com.au/nutrithrive_labs/** — Canonical uses underscores: https://nutrithrive.com.au/nutrithrive_labs/
- **https://nutrithrive.com.au/nutrithrive_labs/dedup-lines** — Canonical uses underscores: https://nutrithrive.com.au/nutrithrive_labs/dedup-lines.html
- **https://nutrithrive.com.au/nutrithrive_labs/sitemap-generator** — Canonical uses underscores: https://nutrithrive.com.au/nutrithrive_labs/sitemap-generator.html
- **https://nutrithrive.com.au/blog/dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html** — URL path length 87 (often cited comfort zone under ~75 path chars for readability)
- **https://nutrithrive.com.au/blog/australian-health-consumer-2026-behavioral-psychographics-wellness.html** — URL path length 77 (often cited comfort zone under ~75 path chars for readability)
- **https://nutrithrive.com.au/nutrithrive_labs/time-converter** — Canonical uses underscores: https://nutrithrive.com.au/nutrithrive_labs/time-converter.html

- **Duplicate paths:** e.g. `https://nutrithrive.com.au/blog/…` vs `…html` and `/blog/how-to-add-moringa-to-diet` (clean URL) — ensure 301/rel=canonical to one version.

## Content quality (sample)

- **https://nutrithrive.com.au/products/** — Body word count 245 (under 300 — thin for commercial/blog unless intentional)

## Schema / structured data (JSON-LD)

**Automated detection in this audit:** The Firecrawl `html` payload used for `02_raw_pages.md` **does not include `<script type="application/ld+json">` blocks** (they are stripped or omitted in the returned document), so the local parser reported **no** JSON-LD for all 50 URLs. This is a **limitation of the extraction step**, not proof that live pages lack schema.

**Spot-check on live HTML:** Use [Google Rich Results Test](https://search.google.com/test/rich-results) on [moringa powder](https://nutrithrive.com.au/products/moringa-powder/), a [long blog post](https://nutrithrive.com.au/blog/dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html), and the [homepage](https://nutrithrive.com.au/). Repository source for many posts includes `BlogPosting`, `Article`, `FAQPage`, `BreadcrumbList`, and `LocalBusiness`—validate they still match what is deployed.

**Codebase risk:** Some templates emit **both** `Article` and `BlogPosting` for one URL; use **one** primary article type to avoid conflicting signals.

**Recommendations:** Keep a coherent `Product` + `Offer` graph on PDPs; on articles use **`BlogPosting` or `Article`** (not both), add `BreadcrumbList`, and add `FAQPage` only when visible FAQ content matches. Add or keep **LocalBusiness** / **Organization** on the homepage if local visibility matters.