# Fixes applied (audit quick wins)

Record of changes made in this pass. Status reflects the repository after edits.

| Fix # | File edited | What changed | Status |
|-------|-------------|--------------|--------|
| 1 | `pages/usage-guide/how-to-use-moringa.html` | Replaced malformed `og:image` and `twitter:image` URLs with absolute `https://nutrithrive.com.au/assets/images/homepage/product-showcase/Moringa.webp`. | Done |
| 2 | `products/combo-pack/index.html` | Set `og:image` and `twitter:image` to absolute `https://nutrithrive.com.au/assets/images/homepage/product-showcase/combo.webp` (was relative `../assets/...`). | Done |
| 3 | `pages/about/about.html` | Canonical, `og:url`, `twitter:url`, and `hreflang` alternates updated to `https://nutrithrive.com.au/about/` (trailing slash). *Note: `about/index.html` is not present in this repo; newsletter and products pages already had correct self-canonicals; Melbourne hub HTML already used `/melbourne/`.* | Done |
| 4 | `pages/legal/privacy-policy.html` | New `meta name="description"` and matching `og:description` (120–155 chars, policy-specific). | Done |
| 4 | `pages/shipping/shipping-returns.html` | No edit — already had a valid meta description in range. *Audit referred to `pages/shipping/shipping-returns/index.html`; this repo uses `shipping-returns.html`.* | N/A |
| 4 | `nutrithrive_labs/index.html` | Rewrote `meta name="description"` and `og:description` (length + clarity). | Done |
| 4 | `nutrithrive_labs/dedup-lines.html` | Rewrote `meta name="description"` and `og:description` (fixed broken sentence). | Done |
| 4 | `nutrithrive_labs/time-converter.html` | Rewrote `meta name="description"` and `og:description` (fixed broken sentence). | Done |
| 4 | `blog/dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html` | Rewrote `meta name="description"`; completed `og:description` (was truncated). | Done |
| 5 | `nutrithrive_labs/dedup-lines.html` | Canonical already `https://nutrithrive.com.au/nutrithrive_labs/dedup-lines.html` — no change. | Already correct |
| 6 | `*.html` (site-wide footers) | **Chosen pattern:** `/privacy-policy.html` — matches the policy page canonical and was already used on every in-scope HTML link; no `privacy-policy/` links found. | Verified |
| 6 | `sitemap.xml` | `<loc>` for privacy updated from `https://nutrithrive.com.au/privacy-policy` to `https://nutrithrive.com.au/privacy-policy.html` so sitemap matches canonicals and internal links. | Done |
| 6 | `scripts/build-sitemap.js` | Privacy URL output updated to `${BASE}/privacy-policy.html` for consistency with the same pattern. | Done |

## FIX 6 — Pattern choice

**`/privacy-policy.html`** (root-absolute, with `.html`) is the single pattern for privacy in navigation and discovery:

- It matches `<link rel="canonical">` on `pages/legal/privacy-policy.html`.
- All footer and content links in HTML already pointed here; there were no `privacy-policy/` directory-style links in `.html` files.
- Sitemap and the sitemap build script previously used the extensionless `/privacy-policy`; those were aligned to remove mixed signals.
