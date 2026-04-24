# 05 Quick Wins (Top 15)


**[Priority #1] — Rewrite long SEO titles**
- Page affected: Sitewide high-length URLs
- Problem: Many titles exceed 60 chars and get truncated in results.
- Fix: Rewrite each title to 50-60 chars with primary keyword first and brand second.
- Impact: High | Effort: Easy
- Why it matters: Improves CTR by showing complete, relevant title text.
- Priority: do this week

**[Priority #2] — Shorten overlength meta descriptions**
- Page affected: Sitewide
- Problem: A large share of meta descriptions exceed 160 chars.
- Fix: Trim to 120-155 chars with a benefit + CTA.
- Impact: High | Effort: Easy
- Why it matters: Improves snippet readability and click-through potential.
- Priority: do this week

**[Priority #3] — Align URL shapes with existing canonicals**
- Page affected: Sitewide (e.g. `/about` vs `/about/`, `/products/curry-leaves` vs `.../curry-leaves/`, `/blog` vs `/blog/`)
- Problem: Canonical tags **are** present in HTML, but internal links and sitemap sometimes use a different URL form than the canonical target, which forces search engines to reconcile duplicates.
- Fix: Pick one pattern (trailing slash for sections, consistent product URLs). Update internal links, XML sitemap, and `build-sitemap.js` output to match; 301 only where needed.
- Impact: High | Effort: Medium
- Why it matters: Same as a clean canonical strategy: one clear URL per page and less wasted crawl budget.
- Priority: do this week

**[Priority #4] — Validate and tune existing JSON-LD**
- Page affected: Templates (home, blog, product, FAQ)
- Problem: Rich schema is already on the homepage and at least one major blog post; the risk is **errors, duplicate types, or product pages that under-specify** compared to the homepage graph.
- Fix: Run Rich Results Test on each template; dedupe `Article` vs `BlogPosting` if flagged; ensure each product URL has a complete `Product`+`Offer` block matching on-page price/stock.
- Impact: High | Effort: Medium
- Why it matters: You keep rich-result eligibility without rebuilding what already works.
- Priority: do this week

**[Priority #5] — Fix orphan pages**
- Page affected: Unlinked discovered URLs
- Problem: Some mapped pages have no internal links from audited pages.
- Fix: Add links from homepage/blog hubs and related posts.
- Impact: High | Effort: Easy
- Why it matters: Improves crawl discovery and ranking potential for deep pages.
- Priority: do this week

**[Priority #6] — Add stronger blog CTAs**
- Page affected: Blog articles
- Problem: Several posts lack a clear conversion next-step.
- Fix: Add in-content CTA blocks to product pages and newsletter after first third and at conclusion.
- Impact: High | Effort: Easy
- Why it matters: Turns informational traffic into revenue actions.
- Priority: do this month

**[Priority #7] — Consolidate near-duplicate topic pages**
- Page affected: Moringa comparison/benefit posts
- Problem: Many posts overlap intent and compete with each other.
- Fix: Merge overlapping posts and use 301 redirects to one canonical per keyword intent.
- Impact: High | Effort: Hard
- Why it matters: Reduces cannibalization and improves topical authority.
- Priority: do this month

**[Priority #8] — Strengthen E-E-A-T elements**
- Page affected: Blog templates
- Problem: Author/date/expertise context is inconsistent.
- Fix: Show author bios, credentials, references, and visible publish/update date on every post.
- Impact: High | Effort: Medium
- Why it matters: Builds trust and improves quality signals for YMYL-adjacent topics.
- Priority: do this month

**[Priority #9] — Improve homepage hero specificity**
- Page affected: https://nutrithrive.com.au
- Problem: Hero is broad and product-heavy but less problem-outcome focused.
- Fix: Refine hero copy with one core audience pain point and one proof metric.
- Impact: Medium | Effort: Easy
- Why it matters: Improves first-impression relevance and conversion.
- Priority: do this month

**[Priority #10] — Add FAQ blocks to product pages**
- Page affected: Product URLs
- Problem: Objections like dosage, safety, shipping timing are not fully answered on-page.
- Fix: Embed FAQ accordion with schema on each product page.
- Impact: Medium | Effort: Easy
- Why it matters: Reduces friction and supports long-tail queries.
- Priority: do this month

**[Priority #11] — Tune image loading strategy**
- Page affected: Homepage and content pages
- Problem: Several images are non-lazy (likely intentional but inconsistent).
- Fix: Keep hero eager, set all below-fold images to lazy and confirm dimensions are set.
- Impact: Medium | Effort: Easy
- Why it matters: Improves Core Web Vitals and mobile speed.
- Priority: do this month

**[Priority #12] — Create internal linking SOP**
- Page affected: All new blog content
- Problem: Internal link depth varies by post.
- Fix: Require 3-5 contextual links to related posts and 1-2 links to conversion pages in each new article.
- Impact: Medium | Effort: Easy
- Why it matters: Builds topical clusters and channel authority to money pages.
- Priority: do this month

**[Priority #13] — Standardize URL hygiene**
- Page affected: Long blog URLs
- Problem: Many URLs are long (>75 chars), reducing readability and shareability.
- Fix: Use shorter slugs for new posts and map redirect plan for old long slugs only when safe.
- Impact: Low | Effort: Medium
- Why it matters: Cleaner URLs improve usability and SERP presentation.
- Priority: do this quarter

**[Priority #14] — Add product review snippets**
- Page affected: Product pages
- Problem: Social proof exists broadly but not always tied to product SKU pages.
- Fix: Embed SKU-specific ratings/reviews and highlight verified buyer badges.
- Impact: Medium | Effort: Medium
- Why it matters: Improves conversion confidence at point of purchase.
- Priority: do this quarter

**[Priority #15] — Set monthly technical QA crawl**
- Page affected: Entire site
- Problem: No continuous audit process documented in-page.
- Fix: Schedule monthly crawl checks for titles/meta/canonicals/schema/404s.
- Impact: Medium | Effort: Easy
- Why it matters: Prevents regressions and preserves organic growth.
- Priority: do this quarter
