# Next steps — broken links & Imgur

Static scan of `/Users/neervasa/Desktop/Website`: internal `href` resolution uses on-disk HTML plus `_redirects` `200` rewrites. `sitemap.xml` is from `scripts/build-sitemap.js` (only a subset of blog posts).

---

## 1. Broken links

These internal links target a **`.html` page**, a **trailing-`/`` directory URL**, or a **no-extension pretty URL**, but do **not** resolve to an existing file or rewrite target.

| File | Broken link (`href`) | Resolved path | Suggested fix |
|------|----------------------|---------------|----------------|
| `blog/index.html` | `${post.url}` | `/blog/${post.url}` | Replace with real URLs (remove CMS-style placeholder) or generate this page in a build step |
| `pages/usage-guide/how-to-use-moringa.html` | `..//products/moringa-powder/` | `/pages/products/moringa-powder` (wrong) | Use `/products/moringa-powder/` (fixes double-dot path) |
| `tools/check-paypal-buttons.html` | `${blog.url}` | `/tools/${blog.url}` | Replace placeholder with a real blog URL or remove the link |

### Contact page — unexpected nav target

| File | Issue | Suggested fix |
|------|-------|----------------|
| `pages/contact/contact.html` | Top nav item is the “active” contact tab but `href` points to `https://nutrithrive.com.au/products/` (around line 131) | Point that link to `/contact` (or your canonical contact URL) so the active tab matches the page |

### Nav / footer — blog URLs not in `sitemap.xml`

`build-sitemap.js` only emits a **few** blog URLs. Most footers/nav link to **`/blog/`** (blog index), which is **not** in the sitemap either—so every blog post footer flags that link. That is **not** a404; it is a **coverage gap** if you want the hub indexed.

| File | `href` | Path | Note |
|------|--------|------|------|
| *(38 blog files + `pages/melbourne-page.html`)* | `/blog/index.html` or equivalent | `/blog/index.html` | Valid file; consider adding `/blog/` or `/blog/index.html` to the sitemap if you want it indexed |
| `blog/best-protein-energy-bars-australia-2026-supermarket-guide.html` | `https://nutrithrive.com.au/blog/best-protein-energy-bars-australia-2026-supermarket-guide.html` | `/blog/best-protein-energy-bars-australia-2026-supermarket-guide.html` | Self-canonical link in nav; post exists; optional: add to sitemap build |

---

## 2. Imgur images

Replace with assets under `/assets/images/` (then update `src`, `og:image`, `twitter:image`, JSON-LD `image`, and any `addProductToCart…` image arguments).

| Imgur URL | Role (from usage) | Files (representative) |
|-----------|-------------------|-------------------------|
| `https://i.imgur.com/56hwJfZ.png` | Moringa / article OG, Twitter, Article schema, some grower guides | Many blog posts (e.g. brands comparison, powder guides, Melbourne reports), `scripts/moringa-melbourne-report-head.inc.html` — **~35 HTML files** reference it |
| `https://i.imgur.com/B92giK7.jpg` | Hero / social image for several articles (e.g. Chemist Warehouse, summer trends, blog index) | `blog/index.html`, `blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025.html`, `blog/australia-summer-2026-trends-travel-shopping-wellness-guide.html`, etc. — **~16 files** |
| `https://i.imgur.com/PgvCFY0.png` | Moringa powder thumbnail in cart CTAs, product cards, `products/index.html` | `products/index.html`, many blog “Buy” buttons, comparison tables — **~17 files** |
| `https://i.imgur.com/6HaqWwh.png` | In-article image | `blog/high-protein-snacks-australia-25-options-under-150-calories-2025.html` |
| `https://i.imgur.com/vN0DO4q.jpg` | Product imagery | `products/black-tea/index.html` |

**Also:** `products/combo-pack/index.html` includes `<link rel="preconnect" href="https://i.imgur.com">` — remove or repoint after migration.

For a machine-readable per-file list, run from repo root:

```bash
rg -l 'imgur\.com' --glob '*.html'
```

---

_Last updated: automated audit in Cursor._
