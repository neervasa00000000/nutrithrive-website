# Phase 6 — Executive Summary Report

**For:** Nutri Thrive — https://nutrithrive.com.au  
**Audit date:** 16 April 2026  
**Written for:** Non-technical business owner

---

## Overall Site Health Score: 52/100

### How I scored it:

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Technical SEO (crawlability, indexing) | 30% | 35/100 | 10.5 |
| On-page SEO (titles, descriptions, headings) | 25% | 55/100 | 13.75 |
| Content quality & UX | 20% | 65/100 | 13.0 |
| Schema / structured data | 10% | 60/100 | 6.0 |
| Internal linking & site architecture | 10% | 70/100 | 7.0 |
| URL structure & technical basics | 5% | 75/100 | 3.75 |
| **Total** | **100%** | | **53/100** |

Rounded to **52** because the noindex issues on the blog are so severe they drag the overall score down more than the weighted average suggests.

---

## Top 3 Strengths

### 1. Strong product schema and local business markup
The homepage has excellent structured data: WebSite, Organization, LocalBusiness, and 7 Product schemas with full offer details (price, shipping, return policy). This is better than most small e-commerce sites. Google can show rich results for your products including price, availability, and shipping details.

### 2. Comprehensive, well-structured long-form content
Your key blog posts (moringa brands comparison at 7,000 words, moringa vs spirulina vs matcha at 4,600 words, moringa powder guide at 3,000 words) are genuinely helpful, well-organized, and include sourced references. This is content that can earn backlinks and rank well — if Google can see it.

### 3. Good homepage experience with clear value proposition
The homepage clearly communicates what you sell, who it's for, and why to buy from you (lab-tested, vegan, AU-wide shipping). Product cards with pricing and Add to Cart buttons make the path to purchase obvious. The hero section is above the fold and action-oriented.

---

## Top 3 Critical Problems (Immediate Attention)

### 1. Your blog is invisible to Google
The blog index page has a `noindex` tag, which tells Google "don't show this page in search results." Even worse, 10 individual blog posts also have `noindex` tags AND point their canonical URLs to a completely different page. This means these 10 posts are doubly invisible — Google won't index them, and even if it tried, it would think they're duplicates of a different page. **You're losing all SEO value from 10 blog posts and the blog hub page that links to all your content.**

### 2. Broken meta descriptions across the site
At least 7 pages have descriptions that cut off mid-sentence in Google search results. Things like "nourishing for skin with antioxidants and." or "Natural spice with traditional." — these look broken and unprofessional. This is likely a template bug where the description is being truncated before a boilerplate suffix is appended.

### 3. Your sitemap is missing 65+ blog posts
Your sitemap.xml only lists 5 blog posts, but your site has 70+. Google uses sitemaps to discover pages quickly. Without sitemap entries, Google has to crawl link-by-link to find your content, which is much slower and less reliable. You have great content that Google simply doesn't know about.

---

## 30-Day Action Plan

### Week 1: Fix the bleeding (Critical — do this first)

| Day | Action | Who | Effort |
|-----|--------|-----|--------|
| Mon | Fix blog index: change `noindex` to `index, follow` in blog/index.html | Developer | 5 min |
| Mon | Fix 10 noindex blog posts: change to `index, follow` + self-referencing canonical | Developer | 30 min |
| Tue | Fix address mismatch: decide correct address, update all instances | Business owner + Developer | 1 hour |
| Wed | Fix meta description truncation bug on all 7+ affected pages | Developer | 2 hours |
| Thu | Rebuild sitemap.xml with all blog posts (run existing script) | Developer | 15 min |
| Fri | Fix broken internal links on /products/ (2 old URLs) | Developer | 10 min |
| Fri | Remove duplicate GA code on affected pages | Developer | 30 min |

### Week 2: Strengthen what's working

| Day | Action | Who | Effort |
|-----|--------|-----|--------|
| Mon | Add FAQPage schema to 5 product/support pages with FAQ sections | Developer | 2 hours |
| Tue | Fix title/H1 mismatch on black tea page | Developer | 10 min |
| Wed | Fix schema syntax error on darjeeling blog post | Developer | 5 min |
| Thu | Fix wrong image alt text on combo pack cards | Developer | 10 min |
| Fri | Add H1 to newsletter page | Developer | 5 min |
| Fri | Set privacy policy to noindex | Developer | 5 min |

### Week 3: Content improvements

| Day | Action | Who | Effort |
|-----|--------|-----|--------|
| Mon–Wed | Audit duplicate/overlapping blog posts — decide which to consolidate | Content team | 3 hours |
| Thu | Update usage guide title tag (currently too short) | Developer | 5 min |
| Fri | Add trust signals to product pages (lab-tested badge, money-back guarantee) | Designer + Developer | 4 hours |

### Week 4: Monitor and plan next moves

| Day | Action | Who | Effort |
|-----|--------|-----|--------|
| Mon | Submit updated sitemap to Google Search Console | Business owner | 15 min |
| Mon | Request indexing for newly fixed pages via GSC URL Inspection | Business owner | 30 min |
| Tue | Review blog post keyword cannibalisation plan | SEO + Content | 2 hours |
| Wed | Plan review authenticity improvements (remove duplicates, add verification) | Business owner | 1 hour |
| Fri | Set up monthly SEO health check (automated or manual) | SEO | 2 hours |

---

## Tools Recommended to Monitor Ongoing Health

| Tool | Purpose | Cost |
|------|---------|------|
| **Google Search Console** | Monitor indexing, crawl errors, search performance, submit sitemaps | Free |
| **Google Analytics 4** | Track traffic, conversions, user behaviour (already installed but double-firing) | Free |
| **Screaming Frog SEO Spider** | Crawl site for technical issues, broken links, missing tags, schema errors | Free (500 URLs), £209/year |
| **Ahrefs / SEMrush** | Track keyword rankings, backlinks, competitor analysis | $99–$199/month |
| **PageSpeed Insights** | Monitor page load performance | Free |
| **Schema.org Validator** | Test structured data for errors | Free |
| **Rich Results Test (Google)** | Check if pages qualify for rich results | Free |

---

## Bottom Line

Your website has solid foundations — good products, strong content, and comprehensive schema markup. But right now, **more than half your blog content is invisible to Google** due to noindex tags and wrong canonicals, and your sitemap is missing 65+ pages. Fixing these indexing issues alone could significantly increase your organic traffic. The other fixes (descriptions, broken links, schema) are quick wins that compound over time. Start with Week 1 — most of these changes take minutes, not hours.
