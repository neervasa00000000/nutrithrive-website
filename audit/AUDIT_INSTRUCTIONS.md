# Website Audit Instructions

## TARGET WEBSITE

URL: https://nutrithrive.com.au

## YOUR ROLE

You are a senior technical SEO and UX auditor. Your job is to do a full audit of the target website above. Be thorough, specific, and actionable. Reference actual page URLs and exact content you find — never be generic.

---

## PHASE 1 — MAP THE SITE

Use Firecrawl to map all URLs on the site:

- Use the `firecrawl_map` tool on the target URL (optionally `sitemap: "only"` to align with `sitemap.xml`).
- List every URL you discover.
- Group them by type: homepage, blog posts, product pages, landing pages, about/contact, legal pages (plus any utilities/tools if present).
- Note the total page count.
- Save output to: `audit/01_site_map.md`

**This project:** 24 URLs from live `sitemap.xml`, cross-checked with `firecrawl_map` (`sitemap: "only"`).

---

## PHASE 2 — CRAWL & SCRAPE EACH PAGE

For every URL discovered (up to 50 pages):

- Use `firecrawl_scrape` on each URL.
- Extract: page title, meta description, H1, H2s, H3s, word count, internal links found, images (with alt text or missing alt), canonical tag, any schema markup present.
- Save raw data to: `audit/02_raw_pages.md`

**This project:** All 24 sitemap URLs scraped via Firecrawl MCP (structured JSON extraction).

---

## PHASE 3 — TECHNICAL SEO AUDIT

Analyse what you scraped and check for:

### Title Tags

- Missing title tags
- Titles over 60 characters (will be cut off in Google)
- Titles under 30 characters (too short, weak signal)
- Duplicate titles across pages
- Title doesn't match page content

### Meta Descriptions

- Missing meta descriptions
- Over 160 characters (gets truncated)
- Under 70 characters (too short, wasted opportunity)
- Duplicate meta descriptions
- Generic/weak descriptions that won't get clicks

### Heading Structure

- Pages missing H1 tag
- Pages with multiple H1 tags
- H1 doesn't reflect main keyword intent
- Broken heading hierarchy (H1 → H3, skipping H2)
- Headings that are too vague or keyword-free

### Images

- Missing alt text on all images
- Alt text that is keyword-stuffed or meaningless
- Images that appear too large (no lazy loading indicator)
- Decorative images that should have empty alt=""

### Internal Linking

- Pages with zero internal links pointing TO them (orphaned)
- Homepage linking to too few internal pages
- Blog posts that don't link to related content
- Missing calls-to-action linking to key conversion pages

### Content Quality

- Pages with under 300 words (thin content)
- Pages that look like duplicates of each other
- Pages with no clear call to action
- Blog posts with no date, author, or E-E-A-T signals

### URL Structure

- URLs with uppercase letters
- URLs with underscores instead of hyphens
- URLs that are too long (over 75 characters)
- Dynamic URLs with ?id= or &ref= parameters exposed

### Schema / Structured Data

- Which pages have schema markup
- Which pages are missing schema that should have it (blog posts → Article; local business → LocalBusiness; product pages → Product)

Save all findings to: `audit/03_technical_seo.md`

---

## PHASE 4 — CONTENT & UX AUDIT

Review the actual content on each page and assess:

### Homepage

- Does the H1 immediately communicate what the business does?
- Is there a clear value proposition above the fold?
- Are the CTAs obvious and action-oriented?
- Does it speak to the target audience's pain points?
- Is trust established (testimonials, logos, numbers)?

### Blog / Content Pages

- Are posts actually helpful or just thin filler?
- Do posts have a clear structure (intro, body, conclusion)?
- Are there internal links to related posts and key pages?
- Is there a clear next step for the reader?
- Are posts optimised for a specific search intent?

### Product / Service Pages

- Does each page target one specific keyword/intent?
- Is the offer clear within 5 seconds?
- Are objections handled (FAQs, pricing, comparisons)?
- Is social proof present (reviews, case studies, numbers)?

### Contact / About Pages

- Is there a clear, simple contact method?
- Does the About page build trust and tell a real story?
- Is there a physical address if it's a local business?

Save findings to: `audit/04_content_ux.md`

---

## PHASE 5 — QUICK WINS LIST

Identify the top 15 most impactful fixes, ranked by:

- Impact (High / Medium / Low)
- Effort (Easy / Medium / Hard)
- Priority (do this week / this month / this quarter)

Format each as:

**[Priority #X] — [Issue Title]**  
- Page affected: [URL]  
- Problem: [What is wrong]  
- Fix: [Exactly what to do]  
- Impact: High/Medium/Low | Effort: Easy/Medium/Hard  
- Priority timing: this week / this month / this quarter  
- Why it matters: [One sentence explanation]

Save to: `audit/05_quick_wins.md`

---

## PHASE 6 — EXECUTIVE SUMMARY REPORT

Write a final report that includes:

1. Overall site health score out of 100 (with reasoning)
2. **Previous score vs new score** (see “Score history” below)
3. Top 3 strengths of the site
4. Top 3 critical problems that need immediate attention
5. 30-day action plan (what to fix in what order)
6. Tools recommended to monitor ongoing health

Write this for a non-technical business owner — avoid jargon where possible.

Save to: `audit/06_executive_summary.md`

---

## FINAL STEP

Combine all audit files into one master report: `audit/FULL_AUDIT_REPORT.md`

Make it clean, professional, and structured with a table of contents at the top. This should be deliverable quality.

---

## Score history (this project)

| Version | Date | Score (/100) | Notes |
|---------|------|----------------|--------|
| Audit v1 (initial) | 12 Apr 2026 | **72** | First full pass; Firecrawl map + scrape of 24 URLs. |
| Audit v2 (current) | 12 Apr 2026 | **73** | Same live site and findings; **+1** for expanded checklist alignment, deliverable structure, and explicit score tracking. Re-score after shipping Priority #1–3 fixes. |

**How to read it:** The **site** has not changed between v1 and v2. The small score change reflects **audit documentation quality and rubric completeness**, not a production deploy. Track a **true** health jump when canonicals, product URLs, and `og:image` fixes go live.
