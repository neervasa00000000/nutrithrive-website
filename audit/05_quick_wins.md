# Phase 5 — Quick Wins (Top 15)

**Site:** https://nutrithrive.com.au  
**Audit date:** 16 April 2026  
**Ranked by impact × effort**

---

**[Priority #1] — Blog index page is noindex — entire blog hub invisible to Google**
- Page affected: https://nutrithrive.com.au/blog/
- Problem: `<meta name="robots" content="noindex,follow">` tells Google NOT to index the blog index page. The entire blog hub is excluded from search results.
- Fix: Change robots meta to `index, follow` in blog/index.html
- Impact: **High** | Effort: **Easy**
- Why it matters: The blog index is the gateway to 70+ content pages — without it indexed, Google can't surface any of that content.

---

**[Priority #2] — 10 blog posts have noindex + wrong canonical — invisible to Google**
- Page affected: 10 blog posts (moringa-powder-benefits-2026, why-i-built-nutrithrive, is-moringa-legit, moringa-benefits-every-day, how-to-use-daily-without-bad-taste, science-shade-drying, moringa-powder-vs-capsules, moringa-soap-skin-science, darjeeling-black-tea-muscatel-marvel, moringa-calm-mind)
- Problem: All have `robots: noindex,follow` AND canonical points to a different page (moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html). These 10 posts are completely invisible to search engines.
- Fix: For each post: (1) Change `noindex` to `index, follow`; (2) Set canonical to self-referencing URL
- Impact: **High** | Effort: **Easy** (search-and-replace in HTML files)
- Why it matters: 10 entire content pages are wasting their SEO potential — they exist but Google can't see them.

---

**[Priority #3] — Meta description truncation bug — 7+ pages have broken descriptions**
- Page affected: /products/moringa-powder, /products/curry-leaves, /products/moringa-soap, /pages/usage-guide/how-to-use-moringa, and 3+ blog posts
- Problem: A systematic bug truncates descriptions mid-sentence before the brand/shipping boilerplate is appended. Examples: "with antioxidants and.", "with traditional.", "Practical guidance for.", "why quality +."
- Fix: Fix the description template/concatenation logic so sentences complete before the boilerplate. Each description should read as a complete sentence.
- Impact: **High** | Effort: **Medium**
- Why it matters: Broken descriptions in search results look unprofessional and reduce click-through rates.

---

**[Priority #4] — 65+ blog posts missing from sitemap.xml**
- Page affected: https://nutrithrive.com.au/sitemap.xml
- Problem: Sitemap only lists 5 blog posts out of 70+. Google discovers URLs faster through sitemaps — missing entries means slower/delayed indexing.
- Fix: Run the build-sitemap script or manually add all blog post URLs to sitemap.xml
- Impact: **High** | Effort: **Easy** (automated script exists)
- Why it matters: Without sitemap entries, Google relies solely on crawl discovery which is slower and less reliable for deep content.

---

**[Priority #5] — Address mismatch across site — Ridley Place vs 15 Europe Street**
- Page affected: Schema on all pages, /privacy-policy, /melbourne/
- Problem: Schema markup (Organization, LocalBusiness) says "Ridley Place, Truganina" but privacy policy body and Melbourne page say "15 Europe Street". Google may see conflicting NAP data.
- Fix: Decide on the correct address and update all instances consistently (schema JSON-LD, privacy policy, Melbourne page, contact page)
- Impact: **High** | Effort: **Easy**
- Why it matters: Inconsistent NAP (Name, Address, Phone) data hurts local SEO and trust signals.

---

**[Priority #6] — Duplicate Google Analytics code on multiple pages**
- Page affected: /products/black-tea, /pages/shipping/shipping-returns, /contact, /melbourne/, and others
- Problem: Two full gtag.js implementations on the same page — one deferred (lines 7-30) and one inline (lines 33-40). This causes double-counting of pageviews and events.
- Fix: Remove the duplicate inline gtag block, keeping only the deferred version
- Impact: **Medium** | Effort: **Easy**
- Why it matters: Inflated analytics data leads to bad business decisions based on inflated traffic numbers.

---

**[Priority #7] — Missing FAQPage schema on product pages with FAQ sections**
- Page affected: /products/black-tea, /products/curry-leaves, /products/moringa-soap, /products/combo-pack, /pages/shipping/shipping-returns
- Problem: These pages have visible FAQ accordion sections but no FAQPage structured data. Google can't show FAQ rich results for them.
- Fix: Add FAQPage schema (JSON-LD) with the Q&A pairs from each page's FAQ section
- Impact: **Medium** | Effort: **Easy**
- Why it matters: FAQPage schema enables FAQ rich results in Google, which increase SERP visibility and CTR.

---

**[Priority #8] — Broken internal links on products index page**
- Page affected: https://nutrithrive.com.au/products/
- Problem: Black tea card links to "product-black-tea.html" (old URL, 404) and moringa soap card links to "product-moringa-soap.html" (old URL, 404). Correct URLs are /products/black-tea/ and /products/moringa-soap/.
- Fix: Update the href values in products/index.html to point to the correct URLs
- Impact: **Medium** | Effort: **Easy**
- Why it matters: Broken links hurt user experience and waste crawl budget on 404 pages.

---

**[Priority #9] — Wrong image alt text on combo pack cards**
- Page affected: /products/combo-pack, /products/ (index)
- Problem: Main product image on combo pack page uses alt="Moringa Powder by Nutri Thrive Melbourne Australia" instead of alt="Combo Pack by Nutri Thrive Melbourne Australia". Same issue on the products index page combo card.
- Fix: Update alt text to correctly describe the combo pack image
- Impact: **Low** | Effort: **Easy**
- Why it matters: Image alt text helps Google Image Search understand and rank images; wrong alt misleads both users and crawlers.

---

**[Priority #10] — Title/H1 mismatch on black tea product page**
- Page affected: https://nutrithrive.com.au/products/black-tea/
- Problem: Title says "Premium Black Tea" but H1 says "Darjeeling Black Tea". Mixed signal about what the product actually is.
- Fix: Align both to "Darjeeling Black Tea" since the product is specifically Darjeeling tea
- Impact: **Medium** | Effort: **Easy**
- Why it matters: Title and H1 should reinforce the same keyword for clear topical signal to Google.

---

**[Priority #11] — Newsletter page missing H1 tag**
- Page affected: https://nutrithrive.com.au/pages/newsletter/
- Problem: No H1 tag on the page — only an H2 "Subscribe to Our Newsletter". Every page should have exactly one H1.
- Fix: Change the H2 to H1 or add an H1 before it
- Impact: **Low** | Effort: **Easy**
- Why it matters: Missing H1 is a basic SEO deficiency — Google uses H1 as a primary relevance signal.

---

**[Priority #12] — Blog post keyword cannibalisation — multiple posts targeting same intent**
- Page affected: 3+ moringa vs matcha posts, 4+ curry leaves buying guides, 3+ Chemist Warehouse comparison posts
- Problem: Multiple blog posts compete for the same search queries, diluting ranking potential. Google won't rank 3 pages for "moringa vs matcha Australia" — it picks one and ignores the rest.
- Fix: (1) Consolidate similar posts into one authoritative guide; (2) 301-redirect old posts to the canonical version; (3) Or differentiate each post to target distinct long-tail variations
- Impact: **Medium** | Effort: **Medium**
- Why it matters: Keyword cannibalisation means you compete with yourself, splitting backlinks and engagement signals across multiple pages instead of concentrating them.

---

**[Priority #13] — Usage guide page title too short and missing brand name**
- Page affected: https://nutrithrive.com.au/pages/usage-guide/how-to-use-moringa.html
- Problem: Title is only 43 chars: "How to Use Moringa Powder | Practical Guide" — missing the brand name, location, and year that other pages include. Doesn't match the H1 which is more descriptive.
- Fix: Update title to something like "How to Use Moringa Powder Australia 2026 | Nutri Thrive Guide"
- Impact: **Low** | Effort: **Easy**
- Why it matters: Title tag is the primary ranking factor — short, generic titles miss ranking opportunities.

---

**[Priority #14] — Schema JSON-LD syntax error on darjeeling blog post**
- Page affected: /blog/darjeeling-black-tea-melbourne-muscatel-marvel.html
- Problem: mainEntityOfPage @id has a trailing `}` character inside the URL string, which will break JSON-LD parsing. Google may ignore the entire schema block.
- Fix: Remove the trailing `}` from the @id URL value in the JSON-LD
- Impact: **Medium** | Effort: **Easy**
- Why it matters: Invalid JSON-LD means Google can't read any of the structured data on that page, losing all rich result eligibility.

---

**[Priority #15] — Privacy policy page should be noindex**
- Page affected: https://nutrithrive.com.au/privacy-policy.html
- Problem: Privacy/legal pages are set to `index, follow` but they shouldn't compete for crawl budget or appear in search results. No one searches for "Nutri Thrive privacy policy" and it doesn't help the business rank.
- Fix: Change robots meta to `noindex, follow` on the privacy policy page
- Impact: **Low** | Effort: **Easy**
- Why it matters: Removing low-value pages from the index conserves crawl budget for pages that actually drive business.

---

## Summary Table

| # | Issue | Impact | Effort | Do When |
|---|-------|--------|--------|---------|
| 1 | Blog index noindex | High | Easy | This week |
| 2 | 10 blog posts noindex + wrong canonical | High | Easy | This week |
| 3 | Meta description truncation bug | High | Medium | This week |
| 4 | 65+ blog posts missing from sitemap | High | Easy | This week |
| 5 | Address mismatch (Ridley Place vs Europe St) | High | Easy | This week |
| 6 | Duplicate GA code | Medium | Easy | This week |
| 7 | Missing FAQPage schema | Medium | Easy | This month |
| 8 | Broken internal links on /products/ | Medium | Easy | This week |
| 9 | Wrong image alt on combo pack | Low | Easy | This month |
| 10 | Title/H1 mismatch on black tea | Medium | Easy | This week |
| 11 | Newsletter missing H1 | Low | Easy | This month |
| 12 | Blog keyword cannibalisation | Medium | Medium | This quarter |
| 13 | Usage guide title too short | Low | Easy | This month |
| 14 | Schema syntax error on darjeeling post | Medium | Easy | This week |
| 15 | Privacy policy should be noindex | Low | Easy | This month |
