# Phase 2 SEO fixes — 21 May 2026

Applied after `nutrithrive-seo-diagnostic-report-2026-05-21.md`. **Canonical blog URLs are now extensionless** (Phase 2 prompt; reverses prior `.html`-canonical setup).

## FIX #1 — Duplicate blog URLs

- **`_redirects`**: Merger targets retargeted to extensionless URLs; removed same-slug `extensionless → .html` 301s; added per-post pairs (`.html` → clean **301**, clean → `.html` file **200**) for all 42 live posts at end of file.
- **`scripts/build-sitemap.js`**: Blog URLs in sitemap omit `.html`.
- **`sitemap.xml`**: Regenerated (60 URLs).
- **All `blog/*.html`**: `rel=canonical`, `og:url`, hreflang, JSON-LD `@id`, internal `href="/blog/..."` updated.
- **`shared/js/blog-articles.js`**, **`scripts/sync-blog-index-itemlist.mjs`**, site-wide **`scripts/strip-blog-html-urls.mjs`**: Extensionless blog links.

## FIX #2 — Broken links

- **`llms.txt`**: Created at site root (TGA-safe, factual contact).
- **`/blog/melbourne-food-as-medicine-map-*`**: **301** → `/blog/moringa-melbourne-complete-guide-2026` (both extensionless and `.html`).
- **In-content**: `budget-greens-powder` → `best-greens-powder`; malformed `/https://...` href fixed; melbourne-food links → melbourne guide; **`products/index.html`** product paths corrected.
- **Usage guide redirects**: Now point to `/blog/how-to-add-moringa-to-diet` (extensionless).

## FIX #3 — Broken images

- **`blog/moringa-powder-victoria-seniors-joint-health.html`**: `vic-seniors-720.jpg` → `moringa-seniors-720.jpg`.

## FIX #4 — Structured data

- Product page (`products/moringa-powder/index.html`) already had full Product/Offer schema — no change.
- Blog `mainEntityOfPage` `@id` aligned to extensionless URLs site-wide.

## FIX #5 & #6 — H1 vs title; title length

- **14+ posts**: Distinct H1 via `scripts/seo-phase2-fix.mjs` (`H1_OVERRIDES`).
- **11 posts**: Titles shortened to ≤60 chars where possible (`TITLE_SHORTEN`); remaining long titles include `| NutriThrive` suffix (62–77 chars) — trim suffix in a follow-up if needed.

## FIX #9 — Hreflang

- Single-language posts: all hreflang URLs match canonical (extensionless).
- **Chinese Melbourne guide**: `zh-CN`, `en-AU`, `x-default` all point to same canonical URL.

## FIX #12 — Anchor text

- **`pages/homepage/index.html`**: “click here” → “go to nutrithrive.com.au”.

## FIX #13 — Cart/payment noindex

- **No change** (intentional).

## Deferred (not in this pass)

- **FIX #7**: Thin pages (<300 words) — expand or consolidate separately.
- **FIX #8**: Text/HTML ratio — needs content expansion, not markup-only.
- **FIX #10**: Minify 991 CSS/JS files — high blast radius; add build pipeline later.
- **FIX #11**: Orphan internal links — batch codes page already has many inbound links via redirects; add more contextual links incrementally.
- **BlogPosting** `publisher.logo` / `Person` author — optional Rich Results enhancement.

## Scripts added

| Script | Purpose |
|--------|---------|
| `scripts/seo-phase2-fix.mjs` | Main Phase 2 batch (re-runnable for H1/title maps) |
| `scripts/strip-blog-html-urls.mjs` | Normalize `/blog/*.html` links in HTML/JS |

## Post-deploy tests

```bash
# Extensionless canonical serves 200 (via rewrite)
curl -I https://nutrithrive.com.au/blog/is-moringa-banned-australia-truth-2026

# .html redirects 301 to extensionless
curl -I https://nutrithrive.com.au/blog/is-moringa-banned-australia-truth-2026.html

# llms.txt
curl -I https://nutrithrive.com.au/llms.txt

# Retired melbourne-food map
curl -I https://nutrithrive.com.au/blog/melbourne-food-as-medicine-map-cafes-organic-stores-healthspan-eating-2026.html
```

**Critical:** Manually test PayPal checkout after deploy.
