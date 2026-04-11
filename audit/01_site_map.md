# Phase 1 — Site map

**Target:** https://nutrithrive.com.au  
**Method:** Canonical list taken from repo `sitemap.xml` (live URLs). Cross-check: Firecrawl `firecrawl_map` with `sitemap: "only"` returned the same set (24 URLs; trailing-slash variants normalised in map output).

**Total indexed URLs in scope:** 24

## URLs by type

### Homepage (1)

- https://nutrithrive.com.au/

### Core marketing / support (6)

- https://nutrithrive.com.au/about
- https://nutrithrive.com.au/contact
- https://nutrithrive.com.au/faq
- https://nutrithrive.com.au/melbourne/
- https://nutrithrive.com.au/privacy-policy
- https://nutrithrive.com.au/pages/newsletter/

### Blog posts (5)

- https://nutrithrive.com.au/blog/dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html
- https://nutrithrive.com.au/blog/moringa-brands-comparison-australia-2026.html
- https://nutrithrive.com.au/blog/moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html
- https://nutrithrive.com.au/blog/moringa-vs-spirulina-vs-matcha-comparison-australia.html
- https://nutrithrive.com.au/blog/where-to-buy-moringa-in-australia-online-vs-stores-2026-guide.html

### Product hub + product detail (6)

- https://nutrithrive.com.au/products/
- https://nutrithrive.com.au/products/black-tea/
- https://nutrithrive.com.au/products/combo-pack/
- https://nutrithrive.com.au/products/curry-leaves/
- https://nutrithrive.com.au/products/moringa-powder/
- https://nutrithrive.com.au/products/moringa-soap/

### Guides & policy detail (2)

- https://nutrithrive.com.au/pages/shipping/shipping-returns
- https://nutrithrive.com.au/pages/usage-guide/how-to-use-moringa.html

### Utility / Labs (4)

- https://nutrithrive.com.au/nutrithrive_labs/
- https://nutrithrive.com.au/nutrithrive_labs/dedup-lines.html
- https://nutrithrive.com.au/nutrithrive_labs/sitemap-generator.html
- https://nutrithrive.com.au/nutrithrive_labs/time-converter.html

## Notes

- **Crawl budget / relevance:** Labs tools are indexable and share sitewide navigation; consider `noindex` or clearer separation if you want the brand site to stay tightly “commerce + content”.
- **URL consistency:** Live pages mix pretty URLs (`/contact`), `.html` blog filenames, and paths like `/pages/...` — not wrong, but increases redirect/canonical cleanup work.
