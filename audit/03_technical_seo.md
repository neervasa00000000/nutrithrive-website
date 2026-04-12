# Phase 3 — Technical SEO audit

**Scope:** 24 URLs from `sitemap.xml`, scraped live via Firecrawl (see `02_raw_pages.md`).  
**Score context:** Previous audit **72**/100 → Current (v2) **73**/100 — same live site; see `06_executive_summary.md` and `AUDIT_INSTRUCTIONS.md` (“Score history”).

This file follows the Phase 3 checklist in `AUDIT_INSTRUCTIONS.md` (titles, meta descriptions, headings, images, internal linking, content quality, URLs, schema).

---

## Title tags

**Strengths**

- Most commercial URLs use clear, keyword-aware titles under ~60 characters (e.g. homepage, product URLs, `/contact`, `/faq`).

**Issues**

1. **Title vs on-page brand mismatch risk (About)**  
   - Page: https://nutrithrive.com.au/about  
   - The visible hero/title text extracted as “NutriThrive” in one field differs from the strong narrative H1 (“Pure moringa…”). Ensure the `<title>` and H1 tell one coherent story (they currently can feel disconnected).

2. **Emoji in H1 (blog pillar)**  
   - Page: https://nutrithrive.com.au/blog/moringa-brands-comparison-australia-2026.html  
   - H1 begins with an emoji. Not a hard error, but it can affect how snippets render; monitor Search Console CTR.

**Missing titles**

- None observed on sampled pages (all returned HTTP 200 with a `metadata.title`).

**Length checks (rule-of-thumb)**

- **Under 30 characters:** Labs tool pages use short browser titles by design; acceptable for utilities, but they compete in SERPs with your commerce pages if indexed.

**Duplicate titles**

- No exact duplicate `<title>` tags detected across the 24 URLs in scope.
- **Near-duplication risk:** several pages reuse “NutriThrive” patterns; still distinct enough in metadata.

**Title vs content**

- **Products index** (`/products/`): `<title>` promises “Shop Moringa, Curry Leaves & Black Tea” while H1 is “Shop Premium Wellness” — aligned thematically but not lexically; consider tightening.

---

## Meta descriptions

**Missing or weak**

| URL | Observation |
|-----|-------------|
| https://nutrithrive.com.au/privacy-policy | Extracted meta description empty; Open Graph description exists — add a real `<meta name="description">`. |
| https://nutrithrive.com.au/pages/shipping/shipping-returns | Same pattern (OG present, meta description missing in extraction). |
| https://nutrithrive.com.au/nutrithrive_labs/ | No meta description in extraction. |
| https://nutrithrive.com.au/nutrithrive_labs/dedup-lines.html | No meta description in extraction. |
| https://nutrithrive.com.au/nutrithrive_labs/time-converter.html | No meta description in extraction. |
| https://nutrithrive.com.au/blog/dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html | Meta description empty in extraction; social descriptions present. |

**Length**

- **Products index** meta reads like a shipping promo only (“Free shipping…”) — accurate but under-uses the chance to describe *what* shoppers will find. Consider expanding toward 120–155 characters with product categories.

**Duplicates**

- No duplicate meta descriptions found across the 24 URLs.

---

## Heading structure

1. **Single H1:** All audited pages showed a single primary H1 in extraction — good.

2. **FAQ accordion duplication**  
   - https://nutrithrive.com.au/faq  
   - The same question strings appear as both H2 and H3. For users of assistive tech and for semantic outline clarity, prefer **one** heading level for questions (typically H2) and non-heading markup for accordion panels.

3. **Usage guide: heading-like text in H2 list**  
   - https://nutrithrive.com.au/pages/usage-guide/how-to-use-moringa.html  
   - Extracted H2 list includes strings prefixed with `###` (markdown artefact) — suggests heading markup or TOC generation worth cleaning in HTML.

4. **Keyword intent**  
   - Product pages: H1s are clean (“Moringa Powder”, “Dried Curry Leaves”) — strong.

---

## Images

1. **Empty alt on map tiles**  
   - https://nutrithrive.com.au/contact  
   - Many Google Maps raster tiles have `alt=""`. For accessibility, hide decorative tiles from screen readers consistently or provide one textual map summary.

2. **External hero/product imagery**  
   - Homepage product grid uses **`i.imgur.com`** for at least one product image.  
   - Several blogs use `i.imgur.com` for Open Graph images. Risks: hotlink reliability, brand consistency, and page-speed (third-party). Prefer self-hosted WebP on your CDN.

3. **Product card alt consistency**  
   - Homepage: multiple images reuse file names with different `alt` text — good for uniqueness, but verify each `alt` matches the visible card intent (avoid confusing repeat assets).

4. **Broken social image URL**  
   - https://nutrithrive.com.au/pages/usage-guide/how-to-use-moringa.html  
   - `og:image` appears malformed (path concatenated with another URL). This hurts sharing previews on WhatsApp, iMessage, Facebook, LinkedIn.

---

## Internal linking

**High-risk pattern: links to URLs outside the current sitemap**

- **Contact** page links to blog posts such as `/blog/moringa-adaptogen-stress-relief-cortisol-balance` and `/blog/best-gyms-melbourne-cbd-2026-complete-comparison-guide`. If unpublished, these are **404 traps** and dilute crawl quality.  
- **Melbourne** page links to `/blog/how-to-store-dried-curry-leaves-freshness-tips-melbourne-kitchens` (not in sitemap).  
- **Product** pages link to multiple blog slugs not listed in `sitemap.xml`.

**URL inconsistency (`privacy-policy` vs `privacy-policy.html`)**

- Internal links use `https://nutrithrive.com.au/privacy-policy.html` from several templates while the sitemap uses `https://nutrithrive.com.au/privacy-policy`. If both resolve, pick a **single canonical** and redirect the other.

**Legacy product paths**

- `/products/` links include `product-black-tea.html` / `product-moringa-soap.html` style paths while sitemap uses directory URLs — verify redirects and internal link hygiene.

**Orphan risk (within sitemap set)**

- Labs hub pages link to `/nutrithrive_labs/converter` which is **not** in `sitemap.xml` — either add to sitemap or `noindex` if experimental.

---

## Content quality (thin pages)

| URL | Approx. words | Note |
|-----|----------------|------|
| https://nutrithrive.com.au/pages/newsletter/ | ~98 | Thin if indexed; add trust copy (frequency, sample topics, privacy reassurance). |
| https://nutrithrive.com.au/nutrithrive_labs/dedup-lines.html | ~39 | Utility page; consider `noindex` or richer explanatory copy. |
| https://nutrithrive.com.au/pages/shipping/shipping-returns | ~262 | Borderline; expand with clear AU delivery table + returns steps. |

**Strong content**

- Pillar blogs (brands comparison, powder guide, superfood comparison) show **very high** word counts and clear H2 structure — excellent for informational intent.

---

## URL structure

- No uppercase paths observed in sitemap.  
- Blog filenames are long but descriptive (good for intent).  
- Mix of trailing slashes (`/products/`) and canonicals without slash (`/products/moringa-powder`) — pick one convention site-wide to avoid duplicate signals.

---

## Canonical tags (critical)

**Points to wrong URL (consolidation to homepage incorrectly)**

- https://nutrithrive.com.au/about → canonical is homepage  
- https://nutrithrive.com.au/melbourne/ → canonical is homepage  
- https://nutrithrive.com.au/pages/newsletter/ → canonical is homepage  
- https://nutrithrive.com.au/products/ → canonical is homepage  

**Product URL slug mismatch (canonical ≠ user-facing folder)**

- https://nutrithrive.com.au/products/black-tea/ → canonical `.../products/premium-black-tea`  
- https://nutrithrive.com.au/products/combo-pack/ → canonical `.../products/premium-wellness-combo-pack`  
- https://nutrithrive.com.au/products/curry-leaves/ → canonical `.../products/dried-curry-leaves`  

**Labs**

- https://nutrithrive.com.au/nutrithrive_labs/dedup-lines.html → canonical is the Labs hub, not the tool page.

These issues can cause **wrong URL in index**, **diluted rankings**, and **rich-result validation** headaches for Product schema.

---

## Schema / structured data

**Positive**

- **FAQ** page exposes `FAQPage` — matches intent.  
- **Product** pages generally indicate `Product` (some add `Review`, `FAQPage`).  
- **Blog** content indicates `Article` / `BlogPosting`.  
- Homepage indicates `WebSite` / `Organization` / `Product` mix — typical for SMB ecommerce.

**Gaps / risks**

1. **Newsletter** page shows `ContactPage` in extraction — likely incorrect type; use `WebPage` or a dedicated `SubscribeAction` pattern if you keep advanced markup.  
2. **LocalBusiness:** Melbourne/local intent pages could use more explicit local schema if you want map pack adjacency (evaluate with your legal NAP consistency).  
3. **Canonical conflicts** (above) can invalidate or confuse Google’s parsing of Product offers.

---

## Summary verdict (technical)

The site has **strong content depth** and a **sensible IA**, but **canonicalization and URL slug consistency** are the stand-out technical risks. Fixing those plus **meta descriptions on policy/Labs pages** and **cleaning risky internal links** will yield the fastest measurable gains.
