# Phase 2 — Raw page data (Firecrawl `firecrawl_scrape`)

**Site:** https://nutrithrive.com.au  
**Pages scraped:** 50 (JSON extraction + HTML metadata where noted)  
**Date:** 2026-05-11  

Fields: title tag (extracted), meta description, H1, word count (visible/main estimate), canonical, schema `@type` list. Full H2/H3 lists are abbreviated here for length; see Phase 3 for heading/SEO issues.

---

## Summary table (50 URLs)

| # | URL | Status | Title (extracted) | Meta description (short) | H1 | Words | Canonical | Schema types |
|---|-----|--------|-------------------|--------------------------|-----|-------|-----------|--------------|
| 1 | https://nutrithrive.com.au/ | 200 | Australia's freshest moringa. Shade-dried. Lab-tested… | We dry leaves in the shade… (long) | Same as title line | 567 | https://nutrithrive.com.au/ | Organization, Product, Article |
| 2 | https://nutrithrive.com.au/about | 200 | NutriThrive \| Pure Moringa, Crafted for Real Australian Life | NutriThrive offers high-quality moringa… | Pure moringa, crafted for real Australian life. | 473 | **https://nutrithrive.com.au/** ⚠️ | Organization, Product, WebSite |
| 3 | https://nutrithrive.com.au/blog | 200 | NutriThrive - Natural Wellness Products… *(differs from og:title)* | Explore a range of natural wellness… | Blog | 1868 | https://nutrithrive.com.au/blog/ | Blog, WebSite |
| 4 | https://nutrithrive.com.au/contact | 200 | Contact NutriThrive Australia - Moringa Powder Support | Get in touch… Truganina, Melbourne | Contact NutriThrive Australia - Moringa Powder Support | 314 | https://nutrithrive.com.au/contact | ContactPage, LocalBusiness |
| 5 | https://nutrithrive.com.au/faq | 200 | *(extract empty; HTML title present)* | *(extract empty)* | Frequently Asked Questions | 614 | *(empty in extract)* | FAQPage |
| 6 | https://nutrithrive.com.au/melbourne | 200 | NutriThrive \| Moringa & Superfoods Delivered Across Melbourne | 100% natural, vegan… free delivery $80+ | Moringa & Superfoods, Delivered Across Melbourne. | 1031 | **https://nutrithrive.com.au/** ⚠️ | Product, Organization |
| 7 | https://nutrithrive.com.au/products | 200 | Shop Premium Wellness Products \| NutriThrive | Discover our 100% natural… | Shop Premium Wellness | 448 | **https://nutrithrive.com.au/** ⚠️ | Product, Organization |
| 8 | https://nutrithrive.com.au/products/moringa-powder | 200 | Moringa Powder \| 100% Pure… | Discover the benefits of 100% pure… | Moringa Powder | 1260 | https://nutrithrive.com.au/products/moringa-powder | Product, Organization |
| 9 | https://nutrithrive.com.au/products/curry-leaves | 200 | Dried Curry Leaves \| Premium Quality… | Discover premium quality dried curry… | Dried Curry Leaves | 698 | **https://nutrithrive.com.au/products/dried-curry-leaves** ⚠️ | Product, Organization, FAQPage |
| 10 | https://nutrithrive.com.au/products/black-tea | 200 | Premium Black Tea \| Rich Aroma… | Discover the rich aroma… | Darjeeling Black Tea | 677 | **https://nutrithrive.com.au/products/premium-black-tea** ⚠️ | Product, Review |
| 11 | https://nutrithrive.com.au/pages/shipping/shipping-returns | 200 | Shipping & Returns - NutriThrive | Dispatch times, free shipping… | Shipping & Returns | 439 | self | FAQPage, Organization, ContactPoint |
| 12 | https://nutrithrive.com.au/privacy-policy | 200 | Privacy Policy, Terms & Conditions | Last Updated: January 19, 2026… | Privacy Policy, Terms & Conditions | 679 | self | WebPage, FAQPage |
| 13 | https://nutrithrive.com.au/products/combo-pack | 200 | Premium Wellness Combo Pack \| NutriThrive | Discover our Premium Wellness Combo Pack… | Premium Combo Pack | 856 | **https://nutrithrive.com.au/products/premium-combo-pack** ⚠️ | Product, Review |
| 14 | https://nutrithrive.com.au/buy-moringa-powder-australia/index.html | 200 | Buy Fresh Moringa Powder — Shipped from Melbourne | Lab-tested organic… | Buy Fresh Moringa Powder — Shipped from Melbourne | 754 | https://nutrithrive.com.au/products/moringa-powder/ | *(none reported)* |
| 15 | https://nutrithrive.com.au/pages/usage-guide/how-to-use-moringa | 200→ | How to Add Moringa to Your Diet: Easy Ways | Discover effective strategies… | How to Add Moringa to Your Diet: Ideas That Actually Taste Good (2026) | 10338 | https://nutrithrive.com.au/blog/how-to-add-moringa-to-diet.html | Article, BlogPosting |
| 16 | https://nutrithrive.com.au/blog/moringa-melbourne-complete-guide-2026.html | 200 | Moringa in Melbourne: Honest Guide (2026) | Discover the real story… | The Real Story Behind Moringa in Melbourne | 5217 | self | *(empty)* |
| 17 | https://nutrithrive.com.au/blog/where-to-buy-moringa-in-australia-online-vs-stores-2026-guide.html | 200 | Where to Buy Moringa in Australia: Online vs Stores (2026 Guide) | Discover the best options… | Matches title | 1949 | self | Article, BlogPosting |
| 18 | https://nutrithrive.com.au/blog/moringa-vs-coffee-melbourne-energy-hack.html | 200 | The $7 Latte Is Over: Why Melbourne Is Switching… | Discover the benefits of Moringa as a coffee alternative… | Matches long title | 5353 | **https://nutrithrive.com.au/blog/** ⚠️ | Article, BlogPosting |
| 19 | https://nutrithrive.com.au/products/moringa-soap/ | 200 | Moringa Soap by NutriThrive Melbourne Australia | Experience the natural goodness… | Moringa Soap | 654 | **https://nutrithrive.com.au/** ⚠️ | Product, Organization |
| 20 | https://nutrithrive.com.au/pages/newsletter/ | 200 | Subscribe to Our Newsletter | Join thousands… | Subscribe to Our Newsletter | 303 | **https://nutrithrive.com.au/newsletter** ⚠️ | Newsletter, Health, Subscription |
| 21 | https://nutrithrive.com.au/nutrithrive_labs/ | 200 | Useful daily tools, right in your browser | Open any tool below… | Useful daily tools, right in your browser | 213 | **https://nutrithrive.com.au/nutrithrive_labs/converter** ⚠️ | *(empty)* |
| 22 | https://nutrithrive.com.au/blog/moringa-brands-comparison-australia-2026.html | 200 | Complete Guide to Moringa Powder in Australia 2026 | Discover detailed reviews… | **What You'll Learn in This Complete Guide** ⚠️ | 2926 | self | Product, Article, WebPage |
| 23 | https://nutrithrive.com.au/blog/is-moringa-legit-what-science-and-real-users-say-2026.html | 200 | Moringa Powder: Benefits, Usage, and Buying Guide | Discover the benefits… | Yes—moringa is legit. | 1199 | **https://nutrithrive.com.au/products/moringa-powder/** ⚠️ | Product, FAQ, Article |
| 24 | https://nutrithrive.com.au/blog/best-protein-energy-bars-australia-2026-supermarket-guide.html | **404** | 404 Page Not Found | Broken link message | Page not found | 38 | — | WebPage |
| 25 | https://nutrithrive.com.au/blog/best-superfoods-australia-comparison-health-conscious-adults.html | 200 | The Australian Wellness Renaissance of 2026 | Explore the superfood landscape… | The Australian Wellness Renaissance of 2026 | 2220 | **https://nutrithrive.com.au/blog/australian-wellness-renaissance-2026** ⚠️ | Article, BlogPosting |
| 26 | https://nutrithrive.com.au/blog/does-moringa-have-caffeine-truth-about-energy-focus-side-effects-2026.html | 200 | Caffeine-Free Moringa Powder | Discover the benefits of caffeine-free… | Does Moringa Have Caffeine? | 1941 | **https://nutrithrive.com.au/products/moringa-powder/** ⚠️ | HowTo, FAQPage |
| 27 | https://nutrithrive.com.au/blog/moringa-vs-spirulina-vs-matcha-comparison-australia.html | 200 | Moringa vs Spirulina vs Matcha: A Comprehensive Guide | Explore the differences… | Moringa vs Spirulina vs Matcha: The Ultimate Comparison | 16851 | self | EducationalArticle, Product |
| 28 | https://nutrithrive.com.au/blog/best-protein-powder-australia.html | 200 | Best Protein Powder Australia - 2026 Review | Discover the best protein powders… | Best Protein Powder Australia 2026 | 6403 | self | BlogPosting, Product, Organization |
| 29 | https://nutrithrive.com.au/blog/10-dollar-superfood-replaced-200-supplement-stack-australia-2026.html | 200 | Discover How Moringa Powder Replaced My $200 Supplement Stack | Explore my journey… | My $200 Monthly Supplement Stack Replaced by Moringa Powder | 3168 | self | BlogPosting, WebPage |
| 30 | https://nutrithrive.com.au/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025.html | 200 | Quick Test Results: Comparing Rosabella and NutriThrive Moringa | Discover the quality comparison… | Quick Test Results: Rosabella vs NutriThrive | 4843 | **https://nutrithrive.com.au/blog/rosabella-vs-nutrithrive** ⚠️ | Article, Product, Review |
| 31 | https://nutrithrive.com.au/blog/moringa-powder-vs-capsules-which-one-actually-works-better-2026.html | 200 | Moringa Powder vs Capsules: Which is Right for You? | Discover the pros and cons… | Moringa Powder vs Capsules: Which is Right for You? | 1118 | **https://nutrithrive.com.au/blog/moringa-powder-vs-capsules** ⚠️ | Article, Product |
| 32 | https://nutrithrive.com.au/blog/why-i-built-nutrithrive-moringa-real-story-finest-moringa-powder.html | 200 | Why I Build NutriThrive: A Melbourne Moringa Story, Told Plainly | Discover the inspiring founder story… | Matches | 1589 | self | BlogPosting, WebPage |
| 33 | https://nutrithrive.com.au/blog/science-shade-drying-vs-sun-drying-moringa.html | 200 | Shade-Dried Moringa: The Best Choice for Nutrition | Discover the benefits of shade-dried… | Why Shade-Dried Moringa is Superior | 1233 | **https://nutrithrive.com.au/products/moringa-powder/** ⚠️ | Article, FAQPage |
| 34 | https://nutrithrive.com.au/blog/how-to-read-moringa-batch-codes-freshness.html | 200 | Fresh Moringa Powder \| NutriThrive | Discover fresh, batch-dated… | Fresh, Batch-Dated Moringa — Packed in Victoria | 1677 | **https://nutrithrive.com.au/products/moringa-powder/** ⚠️ | Product, BlogPosting |
| 36 | https://nutrithrive.com.au/blog/smart-moringa-daily-intake-australia-visual-guide-2026.html | 200 | Moringa Powder Guide: Benefits, Dosing, and Safety Tips | Explore the benefits… | Moringa Powder Guide: Benefits and How to Use | 1231 | **https://nutrithrive.com.au/blog/moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026** ⚠️ | Article, Product |
| 37 | https://nutrithrive.com.au/blog/nutrithrive-delivers-across-victoria-is-your-town-eligible-hint-yes.html | 200 | NutriThrive \| Premium Superfoods Delivered Across Victoria | Discover premium moringa… | NutriThrive Delivers Across Victoria | 1235 | **https://nutrithrive.com.au/** ⚠️ | WebPage, Product, LocalBusiness |
| 38 | https://nutrithrive.com.au/blog/rosabella-moringa-reviews-legit-or-overhyped-2026.html | 200 | Moringa Capsules vs. Powder: Which is Better? | Discover the differences… | Moringa Capsules vs. Powder: The Ultimate Comparison Guide | 2151 | **https://nutrithrive.com.au/blog/moringa-powder-vs-capsules-which-one-actually-works-better-2026** ⚠️ | Article, Product, FAQ |
| 39 | https://nutrithrive.com.au/blog/affordable-superfoods-organic-tax-marketplace-wellness-vic-nsw-qld-2026.html | 200 | Affordable Moringa 2026: Beat the Organic Tax in Australia | Discover how to beat the organic tax… | Affordable Moringa 2026: Beat the Organic Tax in Australia | 1033 | self | Article, BlogPosting |
| 40 | https://nutrithrive.com.au/blog/moringa-quality-test-shade-dried-vs-retail-australia-2026.html | 200 | Moringa Quality Test: Shade-Dried vs Retail 2026 | Discover the quality differences… | Moringa Quality Test: Shade-Dried vs Retail | 3762 | self | BlogPosting, Product, Review |
| 41 | https://nutrithrive.com.au/blog/moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html | 200 | Moringa Powder: A Comprehensive Guide for Australian Consumers | Discover everything you need… | The Ultimate Guide to Moringa Powder in Australia | 2053 | **https://nutrithrive.com.au/blog/honest-australians-guide-moringa-powder-2026** ⚠️ | Article, Product |
| 42 | https://nutrithrive.com.au/blog/melbourne-body-burden-report-2026.html | 200 | Melbourne Body Burden Report: Health Costs and Solutions | Explore the Melbourne Body Burden Report… | The Melbourne Body Burden Report: What Living in This City Actually Costs Your Health | 4784 | **https://nutrithrive.com.au/blog/melbourne-body-burden-report-2026** *(no .html)* | Article, Report, Research |
| 43 | https://nutrithrive.com.au/blog/growing-moringa-australia-honest-frost-pots-2026.html | 200 | Growing Moringa in Australia - A Practical Guide | Discover how to grow… | Growing Moringa in Australia Frosts, Overwatering & the 6–8 Month Wait | 10943 | **https://nutrithrive.com.au/growing-moringa-in-australia** ⚠️ | Article, FAQPage |
| 44 | https://nutrithrive.com.au/blog/how-to-use-moringa-powder-daily-without-the-bad-taste-2026.html | 200 | Best Ways to Take Moringa Powder | Discover tips and recipes… | Best Ways to Take Moringa Powder | 896 | **https://nutrithrive.com.au/blog/how-to-add-moringa-to-diet.html** ⚠️ | Article, FAQPage |
| 45 | https://nutrithrive.com.au/blog/moringa-brands-comparison-australia-chinese-review.html | 200 | 2026 澳洲辣木粉避坑指南：NutriThrive vs Rosabella 深度测评 | 深入分析… | Same as title (Chinese) | 1413 | self | Article, Product, Review |
| 46 | https://nutrithrive.com.au/blog/plant-based-functional-foods-australia-wellness-nutrithrive-2026.html | 200 | Top 5 Australian Plant-Based Superfoods You Are Missing | Discover the top 5… | Top 5 Australian Plant-Based Superfoods You Are Missing | 6406 | self | Article |
| 47 | https://nutrithrive.com.au/blog/moringa-powder-complete-buyers-guide-australia-2026.html | 200 | Complete Buyer’s Guide to Moringa Powder in Australia (2026) | Discover the best moringa powder… | Moringa Powder: The Complete Buyer’s Guide Australia 2026 | 1185 | self | Article, FAQPage |
| 48 | https://nutrithrive.com.au/blog/moringa-powder-victoria-seniors-joint-health.html | 200 | Natural Joint Pain Relief with Moringa \| NutriThrive | Explore the benefits… | Stop Living with Stiffness: Discover Moringa for Joint Pain Relief | 5617 | **https://nutrithrive.com.au/products/moringa-powder/** ⚠️ | Product, Article |
| 49 | https://nutrithrive.com.au/blog/healthy-snack-melbourne-why-everyone-switching-to-moringa-2026.html | 200 | Melbourne Wellness Trend · Functional Snack Shift · 2026 | Discover why Melbourne is embracing Moringa… | Healthy Snack in Melbourne? Why Everyone Is Quietly Switching to Moringa in 2026 | 5155 | **https://nutrithrive.com.au/blog/melbourne-wellness-trend-functional-snack-shift-2026** ⚠️ | BlogPosting, Article, WebPage |
| 50 | https://nutrithrive.com.au/blog/melbourne-food-as-medicine-map-cafes-organic-stores-healthspan-eating-2026.html | 200 | Melbourne Food as Medicine Map (2026): Cafes and Organic Stores… | Discover the best cafes… | Melbourne Food as Medicine Map (2026): Cafes and Organic Stores for Healthspan Eating | 1407 | self | Article, WebPage |

**Legend:** ⚠️ = canonical or title/H1 mismatch flagged in Phase 3.

---

## FAQ page — metadata fallback (extractor missed `<title>` / description)

From HTML `metadata` on scrape:  
- **Title:** `Moringa & Superfoods FAQ | NutriThrive, Melbourne`  
- **Description:** `NutriThrive FAQ: moringa, curry leaves, tea, orders & shipping — answers for Australians, with dispatch from Truganina, Melbourne.`

---

## Images & internal links

Per-page image `alt` lists were captured in depth for homepage, about, blog index, contact, melbourne, products, moringa powder (generally good descriptive alts on product/home). Several pages only surfaced logo alt in extract. Lazy-loading was not verified in JSON mode.

Internal link counts vary widely: pillar posts (e.g. how-to-add) link heavily to products; some posts link to **broken paths** (e.g. `…/blog/benefits-moringa-powder/` from coffee article extract).

---

## End of Phase 2 raw export

For programmatic reuse, the table above is the canonical scrape summary for the 50 URLs.
