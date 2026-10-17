# Storefront page refinement — 17 October 2026

This pass applies to the home, shop, product, city and service pages. Blog HTML is unchanged relative to `b87839b9`. New CSS is scoped to `.storefront-refined`, which is absent from blog layouts.

## What changed

- Home: one primary hero action, a short price-led introduction, four distinct featured products instead of all ten catalog entries, one farm story and one seasonal section. Removed the hero's repeated product list, duplicated trust strip, large article teasers and final repeated sales banner. Existing blog articles are untouched; a buyer-guide link remains on home.
- Products: one main size/delivered-price comparison. Shorter buy-box copy and fewer repeated proof/shipping statements. Batch, ingredients, origin, storage and additional product photography use native expandable details. Purchase controls and the existing mobile add-to-cart behavior remain available.
- City pages: shorter lead copy, alternate-city links moved after the current city's information, repeated final sales banners removed. Melbourne's tea/curry headings live with the corresponding products, rather than in extra keyword sections.
- Shared non-blog shell: a short $49 shipping announcement; a compact footer with a link to the dedicated newsletter page instead of a form on every page. Typography, spacing, imagery and surfaces use a quieter, consistent system.
- Free Australian shipping still requires an order subtotal of **$49 or more**. Product prices, shipping bands and checkout logic are unchanged in this refinement commit.

## Reading burden

Counts are main-content words visible by default, excluding hidden blocks, SVG content and the contents of closed details. They are content measurements, not rendered page heights.

| Page | Before | After |
| --- | ---: | ---: |
| Home | 595 | 261 |
| Moringa PDP | 808 | 480 |
| Curry leaves PDP | 779 | 549 |
| Melbourne | 566 | 363 |
| Sydney | 295 | 220 |

The offer, starting price and primary shopping action are in the home hero, before supporting sections. On product pages the image is compact on mobile, followed by the title, short description, selected price and buying controls. Supporting detail no longer has to be read before choosing a product.

Exact scroll counts depend on viewport size, browser chrome, text size and actual rendering. Browser inspection of the local preview was rejected by the browser URL policy earlier in this session. No exact viewport or scroll-count claim is made; mobile visual QA remains pending.

## Validation

Built with `STOREFRONT_PAGES_ONLY=1 npm run build` so the generator and asset-reference patcher skip blog HTML. Existing growth checks verify protected metadata, shipping rates, gift links and HOLD pages. Existing checkout/payment checks verify the purchasing path. Structural SEO audit, sitemap/ItemList checks and whitespace checks also pass. A direct diff confirms no blog files changed in this pass.

No deployment performed. This pass belongs to the existing draft PR.
