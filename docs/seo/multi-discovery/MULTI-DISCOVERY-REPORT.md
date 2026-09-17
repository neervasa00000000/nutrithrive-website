# NutriThrive multi-discovery audit

Audit date: 15 September 2026 (Australia/Melbourne)  
Mode: research and validation only; no production changes were made.  
Canonical commercial fact used throughout: free Australian shipping starts at **$79**.

## Executive finding

NutriThrive is crawlable and already performs strongly for several Bing queries. In the single, non-personalised-looking Australian Bing sample, NutriThrive ranked approximately #1 for “dried curry leaves Australia” and “how to choose moringa powder Australia”, #2 for “fresh vs dried curry leaves”, “curry leaves vs curry powder”, and “moringa powder shelf life”, #3 for “curry leaf substitute”, “Darjeeling tea Australia”, and “buy Darjeeling tea Australia”, and #4 for “moringa powder Australia” and “Darjeeling tea caffeine”. Rankings are volatile and location/device dependent, so these are observations, not promises.

The site does not need mass page creation, mass deletion, or “AI SEO” files. It needs better index freshness, verified Bing ownership, a deliberate Anthropic crawler policy, repair of Article date markup, and careful validation of the moringa Product rating markup.

## Method and limits

- Read-only inspection of the production source in `site/`, routing in `site/_redirects` and `netlify.toml`, and relevant scripts.
- Local validators: 151 sitemap URLs passed the structural SEO audit and sitemap generator check; storefront verification passed; the blog duplicate scan found zero pairs at or above 70% similarity.
- Live browser verification of the moringa product page confirmed the $79 threshold and current product content.
- Bing and DuckDuckGo query checks were made on 15 September 2026 from an Australian locale. Results can differ by geography, device, history, and time.
- A third-party text snapshot returned older $49.50 copy for several product pages while the live browser and Bing snippets showed $79. This is evidence of stale external caching, not evidence that the live site is wrong.
- Bing Webmaster Tools, DNS, GA4, Google Business Profile, Merchant Center, CDN/WAF, and Claude account data were not available. Those states are labelled **MANUAL ACCOUNT CHECK REQUIRED**.

## Current technical discovery

| Area | Finding | Status |
|---|---|---|
| Robots | `Bingbot` and `DuckDuckBot` are explicitly allowed; general rules allow public content. | PASS |
| Sitemap | One sitemap is declared in robots; 151 URLs match the generator and local files. | PASS |
| Canonicals/indexability | Local audit found no structural errors on sitemap URLs. | PASS |
| Redirects | Storefront verification passed routing, cart, PayPal and ranking-page metadata guards. | PASS |
| Blog duplication | No ≥70% duplicate pairs were detected. | PASS |
| Bing verification | No `BingSiteAuth.xml` or `msvalidate.01` marker was found in the repository. DNS/CNAME verification cannot be checked locally. | MANUAL ACCOUNT CHECK REQUIRED |
| IndexNow | No key file or submission integration was found. | NOT IMPLEMENTED |
| Anthropic rules | The file names `Claude-Web` and `anthropic-ai`, but Anthropic’s current documented agents are `ClaudeBot`, `Claude-User`, and `Claude-SearchBot`. All three are presently allowed only through the broad `User-agent: *` rule. | NEEDS POLICY DECISION |
| Claude training | Because the general rule allows public content, `ClaudeBot` is not explicitly blocked. Do not change this automatically; training access is a founder privacy/policy decision. | FOUNDER DECISION |
| `llms.txt` | Present and linked, but no authoritative evidence was found that it changes Claude citations or ranking. | NEUTRAL / NO CLAIM |
| JSON-LD syntax | 171 HTML files were inspected; all detected JSON-LD blocks parsed successfully. | PASS |
| Article dates | Of 122 Article records, 42 lack `datePublished` and 36 lack `dateModified`; all had an author name. | NEEDS VALIDATION |
| Product schema | Six Product records have offers. Only moringa has `aggregateRating`; the page itself says the 12 Google reviews are business-wide, not product-specific. | HIGH-RISK MISMATCH |
| Open Graph | Priority curry, Darjeeling and moringa pages have OG/Twitter titles, descriptions, canonical URLs and images. | PASS WITH IMAGE QA |
| Entity | NutriThrive, ABN 32 639 442 616, Truganina address, phone/email, Facebook and Instagram are consistently repeated in LocalBusiness markup. | PASS / ACCOUNT VERIFY |

## Shipping-threshold classification

The production source has no detected “free shipping” statements tied to $49, $49.50, or $80. Current $79 free-shipping language appears across 160 production HTML/JS files. The remaining `$80` occurrences inspected were comparison prices, not shipping thresholds; an `$800` occurrence was a personal narrative amount.

| Value/context | Classification | Evidence | Conclusion |
|---|---|---|---|
| `$79` near free AU shipping/delivery | CURRENT_SHIPPING_THRESHOLD | Source data, shipping logic, live PDP, Bing snippets | Correct |
| `$90` international free shipping | INTERNATIONAL_SHIPPING | Shipping logic and published explanations | Separate rule; do not rewrite to $79 |
| `$80` in competitor/capsule price tables | COMPARISON_PRICE | High-protein and how-to-choose articles | Not a shipping issue |
| `$800` blood tests | OTHER | Personal narrative article | Not a shipping issue |
| `$49` / `$49.50` in external cached extraction | HISTORICAL | Third-party crawl snapshot, not current live DOM/source | Request recrawl after ownership verification; do not edit correct live copy |

## Bing findings

Bing’s published guidance prioritises canonical URLs, accurate sitemaps and `lastmod`, crawlable links, useful page structure, accurate structured data, verifiable facts, and IndexNow for changed URLs. It explicitly says these practices can improve discovery and grounding eligibility but do not guarantee visibility.

Strengths:

- Bing already surfaces multiple NutriThrive URLs for brand and several product/informational terms.
- Curry and moringa clusters have strong exact-intent pages.
- Current Bing snippets observed the correct $79 threshold.
- The sitemap and canonical checks pass locally.

Weaknesses:

- No repository evidence of Bing ownership verification; account/DNS status is unknown.
- No IndexNow integration, so Bing/DDG freshness depends on crawling and sitemap pickup.
- Some target intents did not show NutriThrive in the sampled top 10: “buy curry leaves Australia”, “how to brew Darjeeling tea”, and broad “Darjeeling vs English breakfast”.
- For “how to choose moringa powder Australia”, both choose and brands pages rank together. That is useful coverage, but role lines and internal anchors should continue to keep the checklist informational and the brands page comparative.

## DuckDuckGo findings

DuckDuckGo says its traditional links and images are largely sourced from Bing while it also operates DuckDuckBot and other sources. Therefore Bing crawl/index freshness is the primary controllable lever; there is no separate DuckDuckGo submission console documented for this use case.

Observed strengths:

- Curry PDP appeared around #1 for “dried curry leaves Australia” and around #3 for “buy curry leaves Australia”.
- Branded “NutriThrive moringa” strongly returned the PDP, shop, city pages, FAQ and comparison content.
- The choose/verify cluster was visible for “how to choose moringa powder Australia”.

Observed weaknesses:

- Several informational curry and Darjeeling queries did not surface NutriThrive in the sampled top 10 even where Bing did.
- DuckDuckGo showed stale titles for the curry PDP (“Lab-Tested”) and verify guide (“5-Point”) rather than the current source. That is a freshness issue.
- Shopping modules can displace organic results for commercial queries.

## Claude and AI-answer findings

Anthropic documents three distinct crawler purposes:

- `Claude-SearchBot`: search discovery and result quality.
- `Claude-User`: user-requested retrieval of a URL or web answer.
- `ClaudeBot`: model training/development.

The current robots file does not name any of them. Because the general rule allows the site, they are not blocked by robots, but the explicit Claude section is stale and cannot express a deliberate training-vs-search policy. Search discovery, user retrieval and training must be treated separately.

Claude citation quality is strongest on pages with a short direct answer, clear author, dates, first-party evidence, consistent entity/product facts, accessible primary sources, and restrained commercial claims. The detailed page scores are in `AI-CITATION-AUDIT.csv`. Highest-priority gaps are missing Article dates, limited external/primary sourcing on several cooking guides, and irrelevant business-wide testimonials repeated on individual PDPs.

No authoritative Anthropic source was found saying `llms.txt` improves Claude citations. Keep it only if it is cheap to maintain and factually accurate; do not treat it as a ranking lever.

## Entity and factual consistency

Verified in source:

- Business name: NutriThrive.
- ABN: 32 639 442 616.
- Address: 15 Europe Street, Truganina VIC 3029.
- Business description: farmer/manufacturer; grows moringa and curry leaves; sources Darjeeling tea from a family farm; makes moringa soap in Australia; packs in Truganina.
- Social links: Facebook and Instagram included in `sameAs`.
- Product is **not certified organic**; this disclosure appears on reviewed pages.
- Moringa PDP has a visible NMI lab-summary link.

Risks:

- A customer quote says “organic”, although the business disclosure correctly says the product is not certified organic. Because the quote is clearly attributed and disclaimed, it is not the same as a company claim, but repeating it on unrelated PDPs can confuse retrieval systems and users.
- Business-wide Google reviews are displayed on individual product pages. The pages disclose that they are not product-specific. Only the moringa Product JSON-LD nevertheless marks a 4.9/12 aggregate rating. That should be validated against product-review rules before it remains.
- Claimed opening hours of 09:00–23:00 every day are repeated in LocalBusiness schema; confirm these are real customer-facing hours in Google Business Profile.
- Forty-two Article records are missing `datePublished`; a visible date may exist on some pages, but JSON-LD should not invent one. Recover dates from source control or publishing records.

## Schema assessment

- `LocalBusiness`/`HealthFoodStore`: broadly consistent; verify phone, opening hours and profiles against the live GBP/account.
- `Product` and `Offer`: six products include price, currency, availability and seller. Consider MerchantReturnPolicy and OfferShippingDetails only from verified policy/rates; do not estimate.
- `AggregateRating`: moringa only; high risk because the source reviews are explicitly business-wide, not product-specific.
- `Article`: all detected articles name Neer Vasa, but date coverage is incomplete.
- `BreadcrumbList`: widespread and syntactically valid.
- `FAQPage`: only eight pages have it. FAQ rich results are restricted and not a ranking promise; add only where visible FAQs are stable and the markup exactly matches.
- No JSON parse errors were found. Semantic validation still requires Bing Markup Validator, Schema.org validator and Google Rich Results Test on representative live URLs.

## Facebook/referral discovery

The strongest existing organic-share candidates are:

1. Curry Leaf Substitute: 7 Best Swaps for Australian Kitchens — practical emergency intent.
2. Fresh vs Dried Curry Leaves: Taste, Use & Storage — clear comparison.
3. Dried Curry Leaves Australia: Buy, Store & Use Guide — broad evergreen utility.
4. How to Brew Darjeeling Tea Perfectly — simple, saveable instructions.
5. Does Moringa Powder Expire? Shelf Life in Australia — strong household-use question.

All five have large-image OG/Twitter tags in source. Before any campaign, use Facebook Sharing Debugger to fetch each URL, verify the image is public and uncached, and compare referral landing-page engagement—not just clicks. No posting or outreach was performed.

## Character-length and word-count standards

There is no official Google character limit for `<title>` or meta description. Google says both may be truncated to fit device width. There is also no magic minimum or maximum word count for ranking. Therefore:

- Use concise, unique, descriptive titles; treat roughly 45–65 characters as an internal display heuristic, not a Google rule.
- Use accurate, unique descriptions that state the answer/value; treat roughly 120–160 characters as an internal snippet-writing heuristic, not a guaranteed display limit.
- Match the primary H1 and page intent, but do not mechanically force exact duplication where UX benefits from a shorter on-page H1.
- Add content only when it resolves a real query or purchase objection; do not pad to a word-count target.

## GA4 comparison plan

Create a read-only exploration with source/medium groupings for `google / organic`, `bing / organic`, DuckDuckGo referrers, Claude/Anthropic referrers, and Facebook (`facebook.com`, `m.facebook.com`, `l.facebook.com`, `lm.facebook.com`). Preserve raw source/medium alongside the grouped dimension.

Report by landing page, country (Australia vs non-Australia), and device:

- users, sessions, engaged sessions, engagement rate, average engagement time, views/session;
- product views;
- `blog_product_click`;
- `add_to_cart`, `view_cart`, `begin_checkout`, `purchase`, revenue;
- landing-to-product click rate, product-to-cart rate, cart-to-checkout rate, checkout-to-purchase rate and revenue/session.

Requirements before interpreting results:

- Confirm GA4 events in DebugView and Realtime using one test journey.
- Ensure internal traffic and payment-provider referrals are excluded correctly.
- Preserve UTMs on owned Facebook posts; never add UTMs to internal links.
- Do not infer zero demand from tiny samples. Compare 28 days and 90 days, and annotate deployment dates.
- Claude referral reporting is directional: some app/browser flows may not pass a distinct referrer.

## Recommended implementation order (not performed)

1. Verify or regain Bing Webmaster Tools ownership; inspect crawl, sitemap, URL Inspection and IndexNow reports.
2. Validate the moringa Product rating. Remove it if the 12 ratings cannot be evidenced as reviews of that specific product.
3. Repair missing Article dates from verified publishing history; never fabricate dates.
4. Make an explicit Anthropic crawler policy: normally allow `Claude-SearchBot` and `Claude-User`; decide separately whether to allow `ClaudeBot` training.
5. Pilot IndexNow for genuinely added, updated or deleted canonical URLs and monitor Bing reports before broader automation.

## Authoritative references

- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
- [Bing IndexNow setup](https://www.bing.com/indexnow/getstarted)
- [Bing site verification methods](https://www2.bing.com/webmasters/help/add-and-verify-site-12184f8b)
- [Bing structured-data guidance](https://www.bing.com/webmasters/help/marking-up-your-site-with-structured-data-3a93e731)
- [DuckDuckGo result sources](https://duckduckgo.com/duckduckgo-help-pages/results/sources)
- [Anthropic crawler documentation](https://privacy.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Claude web search and citations](https://support.claude.com/en/articles/10684626-enable-and-use-web-search)
- [Google title-link guidance](https://developers.google.com/search/docs/appearance/title-link)
- [Google snippet/meta-description guidance](https://developers.google.com/search/docs/appearance/snippet)
- [Google Product structured data](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Google review-snippet structured data](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)

## Safety statement

This audit did not alter URLs, redirects, canonicals, robots directives, sitemap entries, shipping thresholds, product copy, blog copy, payment logic, analytics, schema, deployment configuration or production files.
