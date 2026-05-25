# Quick Wins — nutrithrive.com.au

**Date:** 2026-05-21

**[Priority #1] — Submit updated sitemap in Google Search Console**
- Page affected: https://nutrithrive.com.au/sitemap.xml
- Problem: Post Phase 2 extensionless blog URL migration — Google needs fresh crawl signals.
- Fix: Submit sitemap.xml; request indexing for homepage, moringa product, top 5 blog posts.
- Impact: High | Effort: Easy
- Why it matters: Faster recovery and fewer duplicate URL errors after canonical change.

**[Priority #2] — Boost orphan blog inbound links**
- Page affected: Multiple /blog/*
- Problem: 5 sitemap pages have ≤1 inbound internal link.
- Fix: Add 2–3 contextual links from related posts and homepage featured guides.
- Impact: High | Effort: Medium
- Why it matters: Orphan pages crawl poorly and rank weakly.

**[Priority #6] — Shorten remaining long meta descriptions**
- Page affected: Blog/product pages
- Problem: 12 pages have meta descriptions over 160 characters.
- Fix: Trim to 140–155 chars with primary keyword + CTA hook.
- Impact: Medium | Effort: Easy
- Why it matters: Truncated snippets reduce click-through in search results.

**[Priority #7] — Restore Google Maps embed on Contact (optional)**
- Page affected: https://nutrithrive.com.au/contact
- Problem: OpenStreetMap embed used instead of Google Maps iframe (Dec 2025 had Google embed).
- Fix: Re-add Google embed iframe + keep OSM as fallback; use 301-safe canonical.
- Impact: Medium | Effort: Easy
- Why it matters: Users expect Google Maps for local business verification.

**[Priority #8] — Clean up Firecrawl legacy URLs**
- Page affected: Various /blog/*.html in map
- Problem: Google still discovers old .html URLs; most 301 correctly but add to GSC as resolved.
- Fix: Monitor Coverage report; ensure sitemap only lists extensionless URLs.
- Impact: Medium | Effort: Easy
- Why it matters: Prevents duplicate URL confusion in Search Console.

**[Priority #9] — BlogPosting publisher logo in schema**
- Page affected: All blog posts
- Problem: Some posts lack full BlogPosting fields (publisher logo, Person author).
- Fix: Add Neer as Person author + Organization publisher with logo URL.
- Impact: Medium | Effort: Medium
- Why it matters: Rich Results eligibility and E-E-A-T in structured data.

**[Priority #10] — Fix images missing alt on content pages**
- Page affected: 33 pages
- Problem: 33 pages have at least one image without alt text.
- Fix: Audit img tags in blog prose and product galleries; add descriptive alt.
- Impact: Medium | Effort: Medium
- Why it matters: Accessibility and image search visibility.

**[Priority #11] — Consolidate /buy-moringa-powder-australia/**
- Page affected: https://nutrithrive.com.au/buy-moringa-powder-australia/
- Problem: Extra landing page in map but not in sitemap — potential duplicate intent with /products/moringa-powder/.
- Fix: 301 to product page or add unique content + canonical.
- Impact: Medium | Effort: Easy
- Why it matters: Avoids keyword cannibalization.

**[Priority #12] — Submit updated sitemap in GSC**
- Page affected: https://nutrithrive.com.au/sitemap.xml
- Problem: Post Phase 2 URL changes need re-crawl.
- Fix: Submit sitemap.xml and request indexing for top 10 URLs.
- Impact: High | Effort: Easy
- Why it matters: Faster recovery after canonical URL migration.

**[Priority #13] — Expand thin pages if any remain**
- Page affected: https://nutrithrive.com.au/blog/, https://nutrithrive.com.au/contact
- Problem: 2 page(s) under 300 words.
- Fix: Add FAQ section or merge into related post with 301.
- Impact: Medium | Effort: Medium
- Why it matters: Thin pages struggle to rank for competitive queries.

**[Priority #14] — PayPal checkout smoke test after each deploy**
- Page affected: https://nutrithrive.com.au/cart → /payment
- Problem: SEO/redirect changes can break checkout paths.
- Fix: Manual test add-to-cart → PayPal → thank-you after every major deploy.
- Impact: High | Effort: Easy
- Why it matters: Revenue-critical path must never break.

**[Priority #15] — Monitor hreflang on single-language site**
- Page affected: Blog posts
- Problem: en-AU + x-default on single-language pages can trigger GSC hreflang notices.
- Fix: Keep all hreflang URLs identical to canonical OR remove hreflang if no translations.
- Impact: Low | Effort: Easy
- Why it matters: Cleaner international targeting signals.

