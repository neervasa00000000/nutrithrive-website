# Storefront reliability audit — 21 October 2026

Baseline: origin/main e9470af1. Public website: https://nutrithrive.com.au.

## Verified on production

- 121 sitemap URLs plus core commerce/support pages and their linked public assets: 198 HTTP requests, all returned 200 after redirects. This checks availability, not the quality of every article or external link.
- Search for “tea” returns relevant products and guides; Escape closes search.
- Product thumbnails select the photograph; enlarged gallery opens and Escape closes it.
- Existing three-item cart totals $49.50; cart and payment agree, with free Australian shipping.
- PayPal and card controls load. No live payment, order creation, form submission or email was performed.
- At 390px viewport width: home, shop, 100g moringa, tea, shipping, contact, cart and payment have no horizontal overflow; no completed image loads were broken. Mobile menu opens and closes.
- Local SEO audit: all 121 sitemap pages pass structural checks. Existing gallery, checkout, payment, metadata and shipping checks pass.

## Fixes in this change

1. Saved carts are validated before use. Malformed JSON/shapes cannot break add/update/remove; bad lines are discarded and totals recalculated. Quantities must be whole numbers within checkout's 99-per-line limit. Adding a product again refreshes its saved price.
2. Browser storage errors preserve the cart for the current page session. Storage blocked across navigation still prevents persistence; this is not a server-side cart.
3. Malformed or blocked optional recently-viewed history cannot interrupt product/cart initialization. Preview-cart cleanup tolerates blocked storage.
4. `npm run verify:commerce` runs cart recovery, mail composition, checkout tracking/totals, gallery, payment and SEO regression checks. Netlify and manual GitHub CI use it after build, before publishing.
5. Production Nodemailer upgraded from 9.0.1 to 10.1.7. Production dependency audit after lockfile update: zero reported vulnerabilities. Node 22 pinned for Netlify to satisfy the patched package's Node >=20 requirement. JSON-transport message composition tested without sending email.

No blog content, design, product prices, shipping thresholds or promotions changed. Assets receive a new cache version.

## Next work, in priority order

- Complete one real checkout with the owner present, including a delivered customer confirmation and owner notification; mocked payment tests cannot establish actual credentials or deliverability.
- Consolidate duplicated frontend/backend product prices and weights into one shared catalog, preserving server-side price authority and legacy product-ID aliases. Add parity tests before replacing either side.
- Add timeouts and deliberate retry/reconciliation behavior to payment-provider calls. Avoid blind capture retries that could create confusing payment outcomes.
- Upgrade build-only dependencies in a separate compatibility pass: npm reports 20 development dependency findings (19 high, 1 moderate). Do not apply a blanket forced upgrade to the deployment toolchain.
- Measure field performance and purchase funnels using actual analytics/Search Console access. This audit does not establish revenue, conversion rate, Core Web Vitals or search ranking trends.
- Product photography: the Diwali box currently uses a tea photograph and 200g uses the texture image because dedicated approved photographs are absent. Add accurate images to product_webp before replacing them.

## Validation

`STOREFRONT_PAGES_ONLY=1 npm run build`, `npm run verify:commerce`, `node scripts/verify-growth-2026-10-17.mjs`, `git diff --check`; production dependency audit and separate patched-library transport smoke test. Blog diff must remain empty. Existing checkout test deliberately simulates missing SMTP credentials; its warning is not evidence of a production email outage.
