# Page loading improvements — 26 October 2026

Mobile Lighthouse lab samples, Chrome headless, simulated mobile throttling, performance category only. Baseline is the public production domain; after is Netlify PR #35 preview. Different hosts and network variability mean these are diagnostic samples, not guaranteed field improvements or a claim that every URL was benchmarked.

| Sample | Score before / after | LCP before / after | Transfer before / after |
| --- | --- | --- | --- |
| Homepage | 70 / 97 | 7.21s / 1.87s | 990 / 386 KiB |
| Main moringa product | 99 / 98 | 1.55s / 2.00s | 553 / 376 KiB |
| How-to-choose article | 99 / 97 | 2.06s / 1.80s | 425 KiB / see saved lab report |

All final samples have zero measured cumulative layout shift. Product and article samples were already fast; their score changes should not be presented as improvements. The homepage has the clearest measured gain, with roughly 74% lower LCP and 61% less transferred data in the sampled run.

## What changed

- Smaller product photographs in product_webp (160px/320px plus missing 640px/960px variants). Original photos retained. A reproducible `npm run images:products` command generates missing variants only.
- Responsive source sets and accurate sizes for home tiles, product cards and product galleries. Image preloads use the same candidates as their visible images. Initial variant setup preserves the responsive source instead of forcing the full original again.
- Cart and recommendation thumbnails use 320px product variants; below-the-fold recommendation images load lazily.
- Refined storefront pages stop preloading the unused 70KB Fraunces font. Articles keep their serif font and existing loading order.
- Storefront search downloads its index only on opening search, reuses concurrent/completed loads and supports retry after failure.
- `npm run verify:performance` checks generated pages, responsive assets/preloads, font priority, thumbnail URLs, lazy search caching and failure recovery; Netlify runs it before publishing.

Four homepage tile originals total 392,656 bytes. Their 320px variants total 41,082 bytes (about 90% less). Actual browser selection varies with screen size and pixel density.

## Validation and scope

Performance checks cover all 29 refined storefront pages. SEO audit passes for 115 sitemap URLs. Product gallery, cart/checkout, payment wiring and seven-article SEO baseline tests pass. Preview browser checks cover mobile overflow, actual responsive candidates, search on storefront/articles, and enlarged photo navigation. No live order/payment or customer email was sent.

The committed blog HTML has no diff against the starting main branch. Prices, promotions, shipping rules, article content, headings, structured data and layout were not changed. Existing uncommitted homepage work in the primary checkout was left intact.

Production baseline reports and preview measurements were saved under `/tmp/nt-speed-20261026/`; a compact copy of the results accompanies the chat artifact. PR #35 is the reviewable delivery; measurements do not mean the PR has been deployed to production.
