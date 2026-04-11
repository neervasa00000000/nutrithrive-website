# Phase 2 — Raw page data (scraped)

**Source:** Firecrawl MCP `firecrawl_scrape` with structured JSON extraction per URL.  
**Note:** `<title>` below prefers HTML `metadata.title` from the scrape when it differed from body-extracted “title”. Word counts are approximate (main content).

---

## https://nutrithrive.com.au/

| Field | Value |
|--------|--------|
| **Title tag** | Nutri Thrive \| Premium Moringa Powder in Melbourne, Australia |
| **Meta description** | Premium moringa, Darjeeling tea, curry leaves & soap — Nutri Thrive, Truganina, Melbourne. Ships AU-wide & worldwide. Call 0438 201 419. |
| **Canonical** | https://nutrithrive.com.au/ |
| **H1** | Premium Moringa Powder from Melbourne – Natural Energy with Nutri Thrive |
| **H2 count** | 9 (incl. footer sections) |
| **Approx. words** | ~951 |
| **Schema types (indicated)** | WebSite, Organization, Product, Article |
| **Images / alt** | Product imagery largely descriptive; multiple cards reuse asset paths with different alts (worth QA for relevance). |
| **Internal links (sample)** | `/products/`, `/products/moringa-powder/`, `/blog/`, `/faq`, `/privacy-policy.html` (note `.html` variant). |

---

## https://nutrithrive.com.au/about

| Field | Value |
|--------|--------|
| **Title tag** | About NutriThrive Australia – Superfoods \| Nutri Thrive, Melbourne |
| **Meta description** | About NutriThrive: Melbourne (Truganina) moringa & superfoods, quality standards, and Australia-wide delivery from our VIC warehouse. |
| **Canonical** | **https://nutrithrive.com.au/** (points to homepage, not `/about`) |
| **H1** | Pure moringa, crafted for real Australian life. |
| **Approx. words** | ~409 |
| **Schema types** | Article, Product, WebSite, Organization |
| **Internal links (sample)** | `/pages/contact/contact`, `/privacy-policy.html`, `/pages/usage-guide/how-to-use-moringa` |

---

## https://nutrithrive.com.au/contact

| Field | Value |
|--------|--------|
| **Title tag** | Contact Nutri Thrive \| Moringa & Support, Melbourne AU |
| **Meta description** | Get in touch with Australia's premium moringa powder company based in Truganina, Melbourne, Victoria... |
| **Canonical** | https://nutrithrive.com.au/contact |
| **H1** | Contact NutriThrive Australia - Moringa Powder Support |
| **Approx. words** | ~479 |
| **Schema types** | WebPage |
| **Images / alt** | Embedded Google Maps tiles with **empty `alt`** (many tiles). |
| **Internal links** | Links to **blog URLs not in sitemap** (e.g. `/blog/moringa-adaptogen-stress-relief-cortisol-balance`, `/blog/best-gyms-melbourne-cbd-2026-complete-comparison-guide`) — high **404 / off-topic risk** unless those posts exist. |

---

## https://nutrithrive.com.au/faq

| Field | Value |
|--------|--------|
| **Title tag** | Moringa & Superfoods FAQ \| Nutri Thrive, Melbourne |
| **Meta description** | Quick answers to the most common questions about NutriThrive products, shipping, safety and how to use them day to day. |
| **Canonical** | https://nutrithrive.com.au/faq |
| **H1** | Frequently Asked Questions |
| **Heading note** | **H2 and H3 lists duplicate the same question strings** (accordion markup pattern) — noisy for outline semantics. |
| **Approx. words** | ~773 |
| **Schema types** | FAQPage |

---

## https://nutrithrive.com.au/melbourne/

| Field | Value |
|--------|--------|
| **Title tag** | Moringa in Melbourne – NutriThrive® Local Superfoods |
| **Meta description** | Lab-tested Moringa powder, dried curry leaves, black tea and more — shipped from our Truganina warehouse... |
| **Canonical** | **https://nutrithrive.com.au/** (should canonicalise to `/melbourne/`) |
| **H1** | Welcome to NutriThrive Melbourne. |
| **Approx. words** | ~541 |
| **Schema types** | Organization, WebSite, Product |
| **Internal links** | Includes `/blog/how-to-store-dried-curry-leaves-freshness-tips-melbourne-kitchens` (**not in sitemap** — verify live). |

---

## https://nutrithrive.com.au/privacy-policy

| Field | Value |
|--------|--------|
| **Title tag** | Privacy Policy & Terms \| Nutri Thrive, Melbourne |
| **Meta description** | *(empty in extracted JSON; og/description present in head — fix consistency)* |
| **Canonical** | https://nutrithrive.com.au/privacy-policy.html |
| **H1** | Privacy Policy, Terms & Conditions |
| **Approx. words** | ~916 |
| **Schema types** | WebPage |

---

## https://nutrithrive.com.au/pages/newsletter/

| Field | Value |
|--------|--------|
| **Title tag** | Newsletter Subscription \| Nutri Thrive, Melbourne |
| **Meta description** | Join thousands of health-conscious Australians and get the latest health tips... |
| **Canonical** | **https://nutrithrive.com.au/** (should canonicalise to `/pages/newsletter/`) |
| **H1** | Subscribe to Our Newsletter |
| **Approx. words** | ~98 (**thin** for indexable landing page) |
| **Schema types** | WebSite, ContactPage |

---

## https://nutrithrive.com.au/products/

| Field | Value |
|--------|--------|
| **Title tag** | Shop Moringa, Curry Leaves & Black Tea \| Melbourne AU |
| **Meta description** | Free shipping Australia-wide on orders of AU$80+ • Free worldwide shipping on orders of AU$90+ |
| **Canonical** | **https://nutrithrive.com.au/** (should canonicalise to `/products/`) |
| **H1** | Shop Premium Wellness |
| **Approx. words** | ~469 |
| **Schema types** | WebPage, Product |
| **Internal links** | Includes **`/products/product-black-tea.html`** and **`/products/product-moringa-soap.html`** (legacy paths — verify vs folder URLs). |
| **Images** | One product image hosted on **`i.imgur.com`** (external dependency + branding consistency issue). |

---

## https://nutrithrive.com.au/products/moringa-powder/

| Field | Value |
|--------|--------|
| **Title tag** | Moringa Powder – 100% Pure Moringa Oleifera \| Nutri Thrive, Melbourne |
| **Meta description** | Discover the benefits of pure Moringa powder with NutriThrive... |
| **Canonical** | https://nutrithrive.com.au/products/moringa-powder (no trailing slash) |
| **H1** | Moringa Powder |
| **Approx. words** | ~1484 |
| **Schema types** | Product, Review, FAQPage |
| **Internal links** | Links to **blog posts not in sitemap** (e.g. `best-rated-moringa-capsules-powders-australia-2026-ultimate-guide`). |

---

## https://nutrithrive.com.au/products/black-tea/

| Field | Value |
|--------|--------|
| **Title tag** | Premium Black Tea \| Rich Aroma & Taste, Melbourne AU |
| **Meta description** | Discover the rich aroma and smooth taste of our premium Darjeeling black tea... |
| **Canonical** | **https://nutrithrive.com.au/products/premium-black-tea** (slug ≠ live folder URL `/products/black-tea/`) |
| **H1** | Darjeeling Black Tea |
| **Approx. words** | ~645 |
| **Schema types** | Product, Organization |
| **Internal links** | `/blog/darjeeling-black-tea-melbourne-muscatel-marvel` (**not in sitemap**). |

---

## https://nutrithrive.com.au/products/combo-pack/

| Field | Value |
|--------|--------|
| **Title tag** | Premium Wellness Combo Pack \| Nutri Thrive, Melbourne |
| **Meta description** | Discover our Premium Wellness Combo Pack... |
| **Canonical** | **https://nutrithrive.com.au/products/premium-wellness-combo-pack** (slug ≠ live folder URL `/products/combo-pack/`) |
| **H1** | Premium Combo Pack |
| **Approx. words** | ~849 |
| **Schema types** | Product, Item |
| **og:image** | Relative path `../assets/...` in head (social preview risk). |

---

## https://nutrithrive.com.au/products/curry-leaves/

| Field | Value |
|--------|--------|
| **Title tag** | Dried Curry Leaves - Premium Quality \| Nutri Thrive, Melbourne |
| **Meta description** | Discover the authentic taste of traditional cooking with our premium dried curry leaves... |
| **Canonical** | **https://nutrithrive.com.au/products/dried-curry-leaves** (slug ≠ live folder URL `/products/curry-leaves/`) |
| **H1** | Dried Curry Leaves |
| **Approx. words** | ~624 |
| **Schema types** | Product, Review, FAQPage |

---

## https://nutrithrive.com.au/products/moringa-soap/

| Field | Value |
|--------|--------|
| **Title tag** | Moringa Soap - Natural Handmade Soap \| Nutri Thrive, Melbourne |
| **Meta description** | Experience the natural goodness of our handmade Moringa soap... |
| **Canonical** | https://nutrithrive.com.au/products/moringa-soap |
| **H1** | Moringa Soap |
| **Approx. words** | ~861 |
| **Schema types** | Product, Organization |

---

## https://nutrithrive.com.au/pages/shipping/shipping-returns

| Field | Value |
|--------|--------|
| **Title tag** | Shipping & Returns Australia \| Nutri Thrive, Melbourne |
| **Meta description** | *(empty in body extraction; og description present)* |
| **Canonical** | https://nutrithrive.com.au/pages/shipping/shipping-returns |
| **H1** | Shipping & Returns |
| **Approx. words** | ~262 (**borderline thin** for standalone policy URL) |
| **Schema types** | WebPage |

---

## https://nutrithrive.com.au/pages/usage-guide/how-to-use-moringa.html

| Field | Value |
|--------|--------|
| **Title tag** | How to Use Moringa Powder \| Practical Guide |
| **Meta description** | How to use moringa powder in Australia: dosage, recipes, and everyday tips... |
| **Canonical** | https://nutrithrive.com.au/pages/usage-guide/how-to-use-moringa.html |
| **H1** | How to Use Moringa Powder: The Complete Australian Guide |
| **Approx. words** | ~536 |
| **Schema types** | Article, WebPage |
| **Social / OG image** | **Broken-looking URL** in metadata: `og:image` contains `https://nutrithrive.com.au/assets/images/Home%20page/https://nutrithrive.com.au/products/moringa-powder/` |
| **Internal links** | Includes **`https://nutrithrive.com.au/pages//products/moringa-powder/`** (double slash — verify resolves). |

---

## Blog: dried curry leaves guide

**URL:** https://nutrithrive.com.au/blog/dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html  

- **Title tag:** Dried Curry Leaves AU \| Store, Cook & Health Uses 2026  
- **Meta description:** Empty in JSON extraction; twitter/og descriptions present — align `<meta name="description">`.  
- **Canonical:** `.html` URL (good).  
- **H1:** Matches topic.  
- **Words:** ~2807 (**strong depth**).  
- **Schema:** Article  
- **Internal links:** Mix of `.html`, pretty URLs, and **`/about.html`** style paths — consistency pass recommended.

---

## Blog: moringa brands comparison 2026

**URL:** https://nutrithrive.com.au/blog/moringa-brands-comparison-australia-2026.html  

- **Title tag:** Moringa Powder Brands Compared \| Lab-Forward Guide  
- **Meta description:** Present and detailed.  
- **Canonical:** **https://nutrithrive.com.au/blog/moringa-brands-comparison-australia-2026** (strip `.html` — ensure redirect or consistent URL strategy).  
- **H1:** Contains a leading emoji — polarising for SERP/snippets; fine for brand, but monitor CTR.  
- **Words:** ~8445 (**very strong**).  
- **Schema:** Article, Product, WebPage  

---

## Blog: moringa powder guide 2026

**URL:** https://nutrithrive.com.au/blog/moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html  

- **Title / H1 / canonical:** Aligned on topic; canonical includes `.html`.  
- **Words:** ~6868  
- **Schema:** Article, Product  
- **Images:** Uses `/images/moringa-powder.jpg` path — verify CDN/cache headers.

---

## Blog: moringa vs spirulina vs matcha

**URL:** https://nutrithrive.com.au/blog/moringa-vs-spirulina-vs-matcha-comparison-australia.html  

- **Words:** ~6461  
- **Schema:** Article, BlogPosting  
- **Internal linking:** Solid links to product URLs and related guides.

---

## Blog: where to buy moringa (2026)

**URL:** https://nutrithrive.com.au/blog/where-to-buy-moringa-in-australia-online-vs-stores-2026-guide.html  

- **Words:** ~1002  
- **Schema:** BlogPosting  
- **Internal links:** Links to **`/blog/best-protein-powder-australia-2026-complete-guide.html`** (not in sitemap — verify).  

---

## Labs hub + tools

| URL | Title tag (metadata) | Meta description | Canonical notes |
|-----|---------------------|------------------|----------------|
| `/nutrithrive_labs/` | NutriThrive Labs \| Home \| Nutri Thrive, Melbourne | Empty in extraction | Self-canonical OK |
| `/nutrithrive_labs/dedup-lines.html` | NutriThrive Labs \| Remove Duplicate Lines... | Empty in extraction | **Canonical points to `/nutrithrive_labs/`** (not the tool URL) |
| `/nutrithrive_labs/sitemap-generator.html` | NutriThrive Labs \| Sitemap Generator... | Present | Self-canonical OK |
| `/nutrithrive_labs/time-converter.html` | NutriThrive Labs \| Time Converter... | Empty in extraction | Self-canonical OK |

---

_End of Phase 2 raw extract summary._
