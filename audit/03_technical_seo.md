# Phase 3 — Technical SEO Audit

**Site:** https://nutrithrive.com.au  
**Audit date:** 16 April 2026  
**Scope:** All discovered URLs (59 from Firecrawl map + local repo analysis)

---

## A. Title Tags

### Missing Title Tags
None found — every page has a title tag.

### Titles Over 60 Characters (will be cut off in Google)

| Page | Title | Length |
|------|-------|--------|
| /products/moringa-powder/ | Moringa Powder – 100% Pure Moringa Oleifera \| Nutri Thrive, Melbourne | 68 |
| /about | About NutriThrive Australia – Superfoods \| Nutri Thrive, Melbourne | 66 |
| /nutrithrive_labs/dedup-lines.html | NutriThrive Labs \| Remove Duplicate Lines \| Nutri Thrive, Melbourne | 67 |
| /nutrithrive_labs/sitemap-generator.html | NutriThrive Labs \| Sitemap Generator \| Nutri Thrive, Melbourne | 62 |

### Titles Under 30 Characters
None found.

### Duplicate Titles
No exact duplicates found.

### Title Doesn't Match H1 / Page Content

| Page | Title | H1 | Issue |
|------|-------|----|-------|
| /products/black-tea/ | Premium Black Tea \| Rich Aroma & Taste | Darjeeling Black Tea | Title says "Black Tea", H1 says "Darjeeling" |
| /blog/moringa-vs-spirulina-vs-matcha-comparison-australia.html | Moringa vs Spirulina vs Matcha \| Greens Compared (48 chars) | Moringa vs spirulina vs matcha: the complete Australian comparison 2026 | Title too short, missing year/location |
| /blog/moringa-soap-skin-science-australia-2026.html | Moringa Soap & Skin Science 2026 \| Barrier & Glow, AU | The Death of Ordinary Soap: Why Moringa-Powered Cleansing Is Rewriting Skin Science | H1 is editorial clickbait, title is different tone |
| /blog/darjeeling-black-tea-melbourne-muscatel-marvel.html | What Is Darjeeling Tea? Champagne of Teas Explained \| AU | Understanding Darjeeling: The Unique Muscatel Flavour Profile | H1 doesn't match title focus |
| /blog/how-to-use-moringa-powder-daily-without-the-bad-taste-2026.html | Use Moringa Daily Without Bitterness \| AU Tips for 2026 | How to Use Moringa Powder Daily (Without the Bad Taste) | "Bitterness" vs "Bad Taste" |
| /pages/usage-guide/how-to-use-moringa.html | How to Use Moringa Powder \| Practical Guide (43 chars) | How to Use Moringa Powder: The Complete Australian Guide | Title too short, missing brand |

---

## B. Meta Descriptions

### Missing Meta Descriptions
None found — every page has a meta description.

### Truncated / Broken Meta Descriptions (most critical issue)

| Page | Description | Issue |
|------|-------------|-------|
| /products/moringa-powder/ | "...Naturally packed with antioxidants, vitamins. Nutri Thrive..." | Cuts off mid-sentence ("vitamins" without "& minerals") |
| /products/curry-leaves/ | "...Natural spice with traditional. Nutri Thrive..." | Cuts off: "with traditional" is incomplete |
| /products/moringa-soap/ | "...nourishing for skin with antioxidants and. Nutri Thrive..." | Cuts off: "antioxidants and" is incomplete |
| /pages/usage-guide/how-to-use-moringa.html | "...Practical guidance for. Nutri Thrive..." | Cuts off: "guidance for" is incomplete |
| /blog/moringa-powder-vs-capsules-which-one-actually-works-better-2026.html | "...why quality +. Nutri Thrive..." | Broken: "quality +" makes no sense |
| /blog/darjeeling-black-tea-melbourne-muscatel-marvel.html | "...what 'Champagne of Teas'. Nutri Thrive..." | Broken: incomplete sentence |
| /blog/moringa-soap-skin-science-australia-2026.html | "...cold-process. Nutri Thrive..." | Broken: incomplete sentence |

This is a **systemic bug** — likely a template truncation issue. The pattern is the same: the description body cuts off mid-phrase before the brand/shipping boilerplate gets appended.

### Over 160 Characters
None found — descriptions stay within character limits.

### Under 70 Characters
None found.

### Duplicate Meta Descriptions
No exact duplicates, but 15+ pages end with the same boilerplate: "Nutri Thrive, Truganina (Melbourne) — ships AU-wide."

### Generic / Weak Descriptions

| Page | Description | Issue |
|------|-------------|-------|
| /nutrithrive_labs/ | "Free browser tools from Nutri Thrive Labs: PDF to text, images to PDF, line dedupe, time zones..." | Lists features but no benefit CTA |
| /products/combo-pack/ | 117 chars — too short, wastes space | Should be 150-160 chars |

---

## C. Heading Structure

### Pages Missing H1 Tag

| Page | Issue |
|------|-------|
| /pages/newsletter/ | No H1 — only H2 "Subscribe to Our Newsletter" |

### Pages with Multiple H1 Tags
None found.

### H1 Doesn't Reflect Main Keyword Intent

| Page | H1 | Issue |
|------|----|-------|
| /blog/ | "Blog" | Too vague — should include "NutriThrive" or "Moringa & Wellness" |
| /melbourne/ | "Welcome to NutriThrive Melbourne." | Weak, doesn't target "buy moringa Melbourne" intent |
| /about | "Pure moringa, crafted for real Australian life." | Brand-tone, missing "About NutriThrive" for branded search |
| /contact | "Contact NutriThrive Australia - Moringa Powder Support" | Keyword-stuffed for a contact page |
| /products/ | "Shop Premium Wellness" | Vague — "Moringa & Superfoods Shop" would be stronger |

### Broken Heading Hierarchy

| Page | Issue |
|------|-------|
| /products/ | H1 → H2 (product names as H2s) — acceptable but product names would work better as H3s under "Our products" H2 |
| /blog/ | 82 H2s (every blog post title is an H2) — excessive, dilutes heading hierarchy |
| /faq | 17 H2s (all FAQ questions as H2s) — FAQ questions should be structured differently |
| /blog/moringa-brands-comparison-australia-2026.html | 23 H2s + 50 H3s — extremely heavy heading count |

### Headings That Are Too Vague or Keyword-Free

| Page | Heading | Issue |
|------|---------|--------|
| /blog/ | H2: "Find and Explore Our Blogs" | Vague, not keyword-targeted |
| /blog/moringa-brands-comparison-australia-2026.html | Multiple emoji-prefixed H2s (🏆, 📚, 📋) | Emojis in headings may not render in SERPs; dilutes keyword signal |

---

## D. Images

### Missing Alt Text

| Page | Missing alt count | Details |
|------|-------------------|---------|
| /contact | 4 | Decorative images with empty alt="" |
| /melbourne/ | 1 | One image missing alt entirely |

### Alt Text That Is Keyword-Stuffed or Misleading

| Page | Image alt | Issue |
|------|-----------|-------|
| /products/combo-pack/ | "Moringa Powder by Nutri Thrive Melbourne Australia" | Wrong — image is combo pack, not moringa powder |
| /products/ (index) | "Moringa Powder by Nutri Thrive Melbourne Australia" (combo card) | Wrong — same issue |

### Images Without Lazy Loading
Homepage hero image uses `loading="eager"` which is correct. All product card images use `loading="lazy"` — good.

### Decorative Images
Contact page has 4 decorative images with `alt=""` — this is acceptable for decorative images.

---

## E. Internal Linking

### Pages with Zero Internal Links Pointing TO Them (Orphaned)
No truly orphaned pages found — the blog index links to all posts, and the nav links to key pages.

### Homepage Linking
Homepage links to: Products, About, Contact, Blog, FAQ, Shipping, Usage Guide, Privacy, individual product pages, Cart. This is good coverage (16 internal links).

### Broken / Stale Internal Links

| Page | Broken link | Expected target |
|------|-------------|-----------------|
| /products/ | product-black-tea.html | /products/black-tea/ |
| /products/ | product-moringa-soap.html | /products/moringa-soap/ |
| /products/moringa-soap/ | Logo href points to /products/ instead of / | Should link to homepage |
| /about | Contact nav link → /pages/contact/contact.html | Should be /contact |
| /blog/ | /pages/shop/cart | Should be /cart |
| Multiple pages | /usage-guide/how-to-use-moringa.html | Some link to old path, some to new /pages/ path |

### Blog Posts Not Linking to Related Content
Many blog posts link to only 2-3 other blog posts. Cross-linking between related topics (e.g., moringa vs matcha post linking to moringa benefits post) is weak.

### Missing Calls-to-Action
- Blog posts should have CTAs linking to product pages (some do, some don't)
- Newsletter page has no CTA to products
- Usage guide has CTA to products (good)

---

## F. Content Quality

### Pages Under 300 Words (Thin Content)

| Page | Word count | Issue |
|------|-----------|-------|
| /nutrithrive_labs/dedup-lines.html | ~70 | Extremely thin — unlikely to rank |
| /nutrithrive_labs/sitemap-generator.html | ~87 | Extremely thin |
| /nutrithrive_labs/ | ~185 | Thin |
| /contact | ~250 | Thin — mostly form |
| /products/ | ~400 | Thin for a category page |

### Potential Duplicate Content
- Multiple blog posts on similar topics (5+ moringa vs matcha posts, 4+ curry leaves buying guides, 3+ Chemist Warehouse comparison posts)
- 10 blog posts canonicalise to the same URL, which is technically telling Google they're all the same page
- Duplicate fake reviews across product pages (same review text+author appears twice in carousels)

### Pages with No Clear Call-to-Action
- Newsletter page — no CTA beyond the form itself
- Contact page — no CTA
- Labs pages — no CTA

### Blog Posts Missing E-E-A-T Signals
- Some blog posts have author ("NutriThrive Research Team", "NutriThrive Editorial Team") — good
- Some posts have publish dates — good
- Missing: no author bios, no credentials, no " medically reviewed by" line
- Some posts lack dates entirely

---

## G. URL Structure

### URLs with Uppercase Letters
None found — all URLs are lowercase.

### URLs with Underscores Instead of Hyphens
None found — all URLs use hyphens.

### URLs Over 75 Characters

| URL | Length |
|-----|--------|
| /blog/dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html | ~85 chars path |
| /blog/moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html | ~80 chars path |
| /blog/where-to-buy-moringa-in-australia-online-vs-stores-2026-guide.html | ~75 chars path |
| Multiple other blog post URLs | 70-90+ chars |

Many blog post URLs are excessively long. While not a direct ranking penalty, shorter URLs are easier to share and look cleaner in SERPs.

### Dynamic URLs with Parameters
None found.

### URL Inconsistencies
- Some pages end with `/` (products, melbourne), some don't (about, faq, contact)
- Blog posts use `.html` extension, other pages use clean paths
- Sitemap lists `/pages/usage-guide/how-to-use-moringa.html` but canonical is `/pages/usage-guide/how-to-use-moringa` (no .html)
- Privacy policy sitemap URL: `/privacy-policy.html` but also accessible at `/pages/legal/privacy-policy`

---

## H. Schema / Structured Data

### Pages WITH Schema Markup

| Page | Schema types |
|------|-------------|
| / | WebSite, Organization, LocalBusiness, Product (×7) |
| /about | LocalBusiness |
| /blog/ | BreadcrumbList, Blog, ItemList, LocalBusiness |
| /products/moringa-powder/ | Product, BreadcrumbList, FAQPage, LocalBusiness |
| /products/black-tea/ | Product, LocalBusiness |
| /products/curry-leaves/ | Product, BreadcrumbList, LocalBusiness |
| /products/moringa-soap/ | Product, BreadcrumbList, LocalBusiness |
| /products/combo-pack/ | Product, BreadcrumbList, LocalBusiness |
| /products/ | LocalBusiness, CollectionPage (ItemList) |
| /contact | LocalBusiness |
| /faq | FAQPage, LocalBusiness |
| /melbourne/ | LocalBusiness |
| /blog/moringa-vs-spirulina-vs-matcha-comparison-australia.html | BlogPosting, FAQPage, BreadcrumbList, LocalBusiness |
| /blog/moringa-soap-skin-science-australia-2026.html | BlogPosting, BreadcrumbList, FAQPage, LocalBusiness |
| /blog/moringa-calm-mind-stress-brain-fog-cortisol-science-2026.html | Organization, Product (with reviews), FAQPage, Recipe, HowTo, BlogPosting, LocalBusiness |
| /blog/darjeeling-black-tea-melbourne-muscatel-marvel.html | Article, FAQPage, BreadcrumbList, LocalBusiness |

### Pages MISSING Schema That Should Have It

| Page | Missing schema | Why it matters |
|------|---------------|----------------|
| /products/black-tea/ | BreadcrumbList, FAQPage | Other product pages have both |
| /products/curry-leaves/ | FAQPage | Has FAQ section on page |
| /products/moringa-soap/ | FAQPage | Has FAQ section on page |
| /products/combo-pack/ | FAQPage | Has FAQ section on page |
| /pages/shipping/shipping-returns | FAQPage | Has FAQ-style content |
| /pages/usage-guide/how-to-use-moringa.html | Article, HowTo, BreadcrumbList | og:type is "article" but no Article schema |
| /pages/newsletter/ | Any schema | No structured data at all |
| /nutrithrive_labs/* | Any schema | No structured data at all |
| /about | Organization, BreadcrumbList | About page benefits from Organization schema |
| /privacy-policy | No need for schema | OK to skip |

### Schema Errors / Issues

| Page | Issue |
|------|-------|
| /blog/darjeeling-black-tea-melbourne-muscatel-marvel.html | mainEntityOfPage has syntax error: trailing `}` inside the @id URL |
| /blog/moringa-calm-mind-stress-brain-fog-cortisol-science-2026.html | Product schema with fake reviews (Sarah M., James K.) — Google policy violation risk |
| /blog/moringa-calm-mind-stress-brain-fog-cortisol-science-2026.html | Schema is extremely heavy (88 @type instances) — excessive |
| /products/curry-leaves/ | ShippingDetails uses unitCode "d" instead of "DAY" |
| /products/moringa-soap/ | Missing itemCondition on Product schema; ShippingDetails unitCode "d" |
| Multiple product pages | Duplicate/fake reviews (same review+author appears twice) — potential Google policy violation |

---

## Summary: Critical Technical SEO Issues

1. **Blog index is noindex** — entire blog hub excluded from Google indexing
2. **10 blog posts are noindex + wrong canonical** — completely invisible to search engines
3. **Systemic meta description truncation bug** — 7+ pages have broken mid-sentence descriptions
4. **Address mismatch** — Schema says "Ridley Place", privacy policy & melbourne page say "15 Europe Street"
5. **Missing FAQPage schema** on 5 product/support pages that have FAQ content
6. **Broken internal links** on products index (2 old .html URLs)
7. **Wrong image alt text** on combo pack product cards
8. **Newsletter page missing H1**
9. **65+ blog posts not in sitemap.xml**
10. **Brand name inconsistency**: "Nutri Thrive" (with space) vs "NutriThrive" (no space)
