# Website audit — 4 October 2026

## Scope and measurements

- Reviewed the live homepage and product page at a mobile viewport, then checked the updated product layout in a local preview.
- Audited 142 sitemap URLs for titles, descriptions, canonicals, headings, image metadata, JSON-LD, and redirecting links.
- Scanned all 173 local HTML files for duplicate IDs and missing same-page hash targets.
- Ran the blog body overlap scanner; it found no pairs at or above 70%. Its 13 skipped files are redirect stubs, not article bodies.
- [PageSpeed Insights report](https://pagespeed.web.dev/analysis/https-nutrithrive-com-au/0ak2x0l42d?form_factor=mobile) for the live homepage, captured before these local changes: mobile performance 99, accessibility 100, best practices 100, SEO 100; LCP 1.8 s, TBT 50 ms, CLS 0. Desktop performance 92, LCP 1.5 s, TBT 130 ms, CLS 0. These are lab results for one page; no field data was available in the report.

## Fixes

- Removed eight duplicate HTML IDs that made article hash navigation ambiguous. Added duplicate ID and missing hash target checks to the SEO audit.
- Replaced tracked internal links to retired blog URLs with their canonical destinations. Excluded three forced-redirect article URLs from the sitemap, journal cards, search index, and journal ItemList. Generators and verifiers now respect those redirects.
- Corrected an article that described one NutriThrive lab-summary PDF as a full certificate for every batch. The linked PDF identifies batch NT042024 and says it is a customer summary, not the official NMI certificate.
- Changed free Australian shipping copy from “over $79” to “from $79” in the published pages and shipping scripts. The checkout code applies free AU shipping at a subtotal of $79 or more; the boundary was checked at $78.99 and $79.
- Added responsive card images for three homepage products and one journal card. The four original files total about 729 KiB; their 960-pixel versions total about 238 KiB and 640-pixel versions about 130 KiB. Browser selection varies by viewport and pixel density.
- Added spacing to the product page review row after a mobile visual check showed the rating, count, and “See all” link running together. The local preview showed them separated.
- Updated the migration verifier's stale exact-copy and narrow description-length checks. It now checks substantial article prose and the current default product variant, and passes on the local site.

## Verification and remaining limits

- `npm run seo:audit`: passed on 142 URLs.
- `node scripts/verify-sitemap-locs.mjs`: passed.
- `node scripts/verify-blog-itemlist.mjs`: passed with 115 live article URLs.
- `node scripts/verify-storefront-migration.mjs`: passed.
- `node scripts/blog-duplicate-scan.mjs`: no duplicate article bodies at its 70% threshold.
- Full local HTML scan: zero duplicate IDs and zero missing same-page hash targets.
- A full CI build was not run because the worktree contains untracked article drafts and build generation rewrites article files. The PageSpeed scores above describe the live site before the local fixes; measure again after deployment.
