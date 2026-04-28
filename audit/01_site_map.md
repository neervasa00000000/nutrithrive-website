# Phase 1 — Site map (NutriThrive)

**Method:** `firecrawl_map` on `https://nutrithrive.com.au` (with sitemap include, query params ignored, limit 500).

**Note:** Your instructions used the placeholder `https://YOURWEBSITE.com`. This audit uses the production site tied to this repository: **https://nutrithrive.com.au**.

## Summary

| Metric | Value |
| --- | --- |
| **URLs returned by map** | **71** |
| **Trailing-slash normalisation** | Map may return both `/path` and `/path/` variants; treat as one page. |

## URLs by type

### Homepage

- `https://nutrithrive.com.au` — *NutriThrive \| Premium Moringa Powder in Melbourne* (map title)

### Shop / product catalogue

- `https://nutrithrive.com.au/products/` — shop index
- `https://nutrithrive.com.au/products/moringa-powder/`
- `https://nutrithrive.com.au/products/curry-leaves/`
- `https://nutrithrive.com.au/products/black-tea/`
- `https://nutrithrive.com.au/products/combo-pack/`
- `https://nutrithrive.com.au/products/moringa-soap/`
- `https://nutrithrive.com.au/cart`

### Landing / locality

- `https://nutrithrive.com.au/melbourne/` (also reachable without trailing slash)

### Blog (index + posts — representative list)

- Index: `https://nutrithrive.com.au/blog/`
- Examples from map (not exhaustive in this table — **full enumeration is the 71 links in Section “Complete URL list” below conceptually via tool output):**  
  comparison / guides such as  
  `.../blog/best-superfoods-australia-comparison-health-conscious-adults.html`,  
  `.../blog/moringa-brands-comparison-australia-2026.html`,  
  `.../blog/moringa-vs-spirulina-vs-matcha-comparison-australia.html`,  
  long-form hubs, Chinese-language comparisons, gut health meal plan, etc.

### About / contact / FAQ

- `https://nutrithrive.com.au/about`
- `https://nutrithrive.com.au/contact`
- `https://nutrithrive.com.au/faq`

### Utility / onboarding

- `https://nutrithrive.com.au/pages/shipping/shipping-returns`
- `https://nutrithrive.com.au/pages/newsletter/`
- `https://nutrithrive.com.au/pages/usage-guide/how-to-use-moringa` (+ legacy `.html` variant referenced in tooling)
- `https://nutrithrive.com.au/privacy-policy.html` (**redirects/canonical align to** `/privacy-policy` in live scrape)

### Legal / policy (single combined page on site)

- Privacy + terms bundled: see privacy URL above (`audit` scrape shows combined “Privacy Policy, Terms & Conditions”).

### Free tools (“NutriThrive Labs”) — ancillary

- `https://nutrithrive.com.au/nutrithrive_labs/`
- `https://nutrithrive.com.au/nutrithrive_labs/pomodoro-timer.html` (also `/pomodoro-timer` style paths in hubs)
- `https://nutrithrive.com.au/nutrithrive_labs/dedup-lines.html`
- `https://nutrithrive.com.au/nutrithrive_labs/password-generator.html`
- `https://nutrithrive.com.au/nutrithrive_labs/quick-notes.html`
- `https://nutrithrive.com.au/nutrithrive_labs/sitemap-generator.html` (+ variant without `.html`)
- `https://nutrithrive.com.au/nutrithrive_labs/time-converter.html`
- Converter / AI tooling paths appear in labs hub (paths like `/nutrithrive_labs/converter`, `/nutrithrive_labs/ai-text-detector` from scrape)

---

## Important: map vs live scrape mismatch

Firecrawl `map` listed URLs including:

- `https://nutrithrive.com.au/blog/top-moringa-companies-australia-2026.html`
- `https://nutrithrive.com.au/blog/moringa-fitness-athletes-australia-2026.html`

Direct `firecrawl_scrape` of those URLs returned **HTTP 404** (Netlify placeholder page). They may exist in SERPs/cached form only, or slug differs on deploy — **treat as crawl/index risk** until the live HTML exists or redirects are added.
