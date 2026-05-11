# Phase 4 — Content & UX audit

**Site:** https://nutrithrive.com.au  
**Basis:** Live scraped content (Firecrawl) for 50 URLs + qualitative review.

---

## Homepage (`/`)

### H1 and value proposition

- The main promise is **clear and differentiated**: shade-dried moringa, lab-tested batches, Melbourne (Truganina) dispatch, Australia-wide — matches what health-conscious buyers worry about (“stale powder”).
- **UX concern:** The extracted “title tag” length matches the **hero headline** closely — users and Google may see **redundant long strings**; tighten `<title>` for SERP while keeping a bold H1 on page.

### CTAs

- Product cards and links to **`/products/moringa-powder/`**, combo, tea, curry leaves — **visible paths to shop**.  
- **Melbourne** landing is linked — good for local intent.

### Pain points

- Copy addresses **trust** (lab certificates, small batches) and **logistics** (AU delivery) — strong for supplements.

### Trust

- “What Our Customers Say” section present (H2 in extract).  
- Consider adding **numeric proof** above the fold (e.g. batches/year, years in market) if accurate.

---

## Blog index (`/blog/`)

### Helpfulness

- The index is **dense with long-tail titles** (2026, Australia, Melbourne) — good for topical authority.

### UX / structure

- **H1 “Blog”** is utilitarian — acceptable.  
- **Many H2s** mirror article titles — good scanability; ensure mobile layout doesn’t create endless scroll without filters (categories: Melbourne, buying guides, science).

### Internal links & next step

- Links to newsletter, Melbourne, labs — **newsletter** is a sensible next step.  
- **Title/meta inconsistency** (Phase 3) may confuse returning visitors who bookmarked “NutriThrive Blog” vs “Natural Wellness Products”.

---

## Representative blog posts

### High-quality, intent-aligned (examples)

- **`moringa-melbourne-complete-guide-2026.html`** — Long-form (~5200 words), safety and FSANZ context referenced in metadata, internal links to products and related posts — **strong E-E-A-T direction** (verify medical disclaimers remain prominent).  
- **`where-to-buy-moringa-in-australia-online-vs-stores-2026-guide.html`** — Clear commercial investigation + links to product and comparisons — **good funnel**.  
- **`moringa-vs-spirulina-vs-matcha-comparison-australia.html`** — Very deep (~16k words) — **pillar asset**; ensure table of contents and mobile performance.

### Content/UX issues

- **`moringa-brands-comparison-australia-2026.html`** — First H1 reads like a **table-of-contents label**, not a human headline — hurts comprehension in first 3 seconds.  
- **`rosabella-moringa-reviews-legit-or-overhyped-2026.html`** — **Browser tab title** says Rosabella review; **social preview** pushes capsules-vs-powder — readers feel a **bait-and-switch**.  
- **`how-to-use-moringa-powder-daily-without-the-bad-taste-2026.html`** canonicalizes to **`how-to-add-moringa-to-diet.html`** — users bookmarking “taste” URL may land in SEO consolidation confusion; **one page should own “taste” intent** with clear redirect messaging.

### Thin or risky

- **404** on `best-protein-energy-bars…` — anyone arriving from sitemap gets a **dead end**; add helpful 404 body with search + top guides.

---

## Product & shop

### ` /products/moringa-powder/`

- **Offer clear in metadata:** price cues, dispatch, reviews claim — good.  
- **H1** “Moringa Powder” is minimal — consider “Buy moringa powder (Australia)” for intent match without keyword stuffing.  
- **FAQ and reviews** H2s — good objection handling.

### Other products

- **Curry leaves** and **black tea** pages have **canonical slugs that don’t match the URL path** — users sharing links may see redirects or Google may prefer the wrong URL; **fix for trust** (“Is this the official page?”).

### Combo pack

- Benefit blocks and FAQs — **solid**. Canonical slug mismatch as above.

### Moringa soap

- **Canonical to homepage** is severe — as if the product doesn’t exist as its own URL — **urgent**.

---

## Melbourne landing (`/melbourne`)

- **Strong local story:** suburbs, delivery, “why Melbourne loves NutriThrive”.  
- **Canonical to homepage** destroys **local landing** strategy — fix to self-canonical and reinforce **LocalBusiness** + `areaServed`.

---

## Buy landing (`/buy-moringa-powder-australia/index.html`)

- Clear **Melbourne dispatch** angle and comparison tables (internal links to brand comparison + where-to-buy).  
- **No schema** in extract — add `Product` or `WebPage` + `BreadcrumbList`.  
- Canonical to main product — **OK if** this URL is intentionally alternate; otherwise duplicate.

---

## Contact (`/contact`)

- **H1 repeats title** — fine.  
- Phone **0438 201 419** and Truganina appear in metadata description — good.  
- **Word count ~314** — add **hours**, **typical reply time**, **order changes** link to reduce support load.

---

## About (`/about`)

- **Story-driven** H2s (“Our story in a spoonful”, four-step journey) — **excellent brand narrative**.  
- **Canonical to homepage** — undermines the About URL as a standalone trust page in search — **fix immediately**.

---

## FAQ (`/faq`)

- Questions as **H2** — good for accordion SEO and readability.  
- **Extractor missed title/description** — QA HTML; also ensure FAQ schema matches visible Q&A text.

---

## Newsletter (`/pages/newsletter/`)

- Simple subscribe value prop — OK.  
- **Canonical `/newsletter`** vs folder URL — verify single 200 destination and no redirect chain.

---

## NutriThrive Labs (`/nutrithrive_labs/`)

- **Useful tools** positioning — good brand halo.  
- **Canonical to `/converter`** — odd for the hub; either **noindex** tools or self-canonical hub + separate tool URLs.

---

## Contact / About / local summary

- **Physical presence:** Truganina / Melbourne referenced across site — good for AU audience.  
- **About** should rank for “who is Nutrithrive” — **canonical bug blocks that**.

---

## Cross-cutting UX

- **Inconsistent URL patterns** (.html vs none, trailing slashes) — users see different URLs in address bar for “same” content — polish redirects.  
- **Internal link to deleted topics** (e.g. homepage extract still links `dried-curry-leaves…` article per earlier scrape) — audit against current deploy when removing posts.
