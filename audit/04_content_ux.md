# Phase 4 — Content & UX audit

**Target:** [https://nutrithrive.com.au](https://nutrithrive.com.au) (Nutri Thrive). Observations are based on the 50-page Firecrawl sample and the homepage HTML/markdown in `audit/02_raw_pages.md`, plus the site map in `audit/01_site_map.md`.

---

## Homepage ([https://nutrithrive.com.au/](https://nutrithrive.com.au/))

- **H1:** *“Premium Moringa Powder from Melbourne – Natural Energy with Nutri Thrive”* — immediately signals **location**, **product**, and **outcome** (energy). **Strong.**
- **Value proposition (above the fold):** Hero paragraph lists **Moringa Oleifera**, **soap**, **curry leaves**, **black tea**; **vegan, gluten-free, non-GMO**; **AU-wide and international** delivery. The offer is clear within seconds.
- **CTAs:** *“Explore Products”* and *“Learn More”* are visible and action-oriented. Product grid uses **“Add to Cart”** repeated per card (standard e-commerce pattern).
- **Audience pain points:** Energy, natural wellness, and convenience (fast delivery) are implied; the **“Premium Natural Superfoods Collection”** block deepens benefits (digestion, joints, skin).
- **Trust:** **“What Our Customers Say”** with many first-name **testimonials** and a **“Winner”** badge on one carousel item support credibility. Stating **“trusted by thousands of Australians”** is a claim to keep accurate and, if possible, back with numbers or third-party proof.

**UX nits:** The testimonial block appears **heavily duplicated** in the HTML (same quotes repeated for carousel effect)—fine visually, but avoid counting duplicate text as *unique* content in audits; for accessibility, ensure one logical testimonial set for screen reader users (e.g. `aria` / reduced motion).

---

## Blog / content pages

**Strengths (examples with evidence):**

- [Dried curry leaves guide](https://nutrithrive.com.au/blog/dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html): Long-form structure (**Introduction → what they are → fresh vs dried → uses → health → storage → where to buy → FAQ**). **Published date** and **“Australian edition”** support freshness. **Internal links** to [curry leaves product](https://nutrithrive.com.au/products/curry-leaves/) and **related moringa articles** show good topical depth.
- [How to add moringa to diet](https://nutrithrive.com.au/blog/how-to-add-moringa-to-diet): Matches **specific intent** (practical how-to).
- Comparison / review content (e.g. chemist warehouse vs Nutri Thrive, brand comparisons) targets **decision-stage** searchers.

**Weaker patterns:**

- **Repetitive meta boilerplate** across many pages (*“from NutriThrive Australia. Explore practical guidance…”) — weakens *per-article* personality in search results*.*
- **Off-niche posts** (e.g. *Melbourne CBD gyms* in the sitemap) can dilute **topical focus** for a superfoods brand — useful only if you have a content strategy that ties them back to health/shopping; otherwise they confuse Google and users.
- **Labs utilities hosted under `/blog/`** (e.g. calendar, size converter) **blur** the line between *tools* and *articles* — consider a consistent **/labs/ or /tools/** experience (you already have `nutrithrive_labs` — align URLs and internal links so users and bots understand the site’s sections.

---

## Product / service pages (sample)

- **Moringa powder, curry leaves, black tea, soap, combo pack** URLs in map each target a **clear product**; PDP copy in crawl emphasises **lab-tested, vegan, Truganina dispatch** — good for AU trust.
- **Objections:** **FAQ** site-wide, **shipping/returns** page, and **usage guide** help objections; ensure each PDP has **1–2 lines on shipping/returns** or links above the fold for anxious buyers.
- **Social proof:** Homepage testimonials help globally; **product pages** can repeat **1–2 short reviews** or “As seen in…” if available.

**Shop index** ([/products](https://nutrithrive.com.au/products/)) — word count in sample was **borderline** for a main category; add **unique** intro and **structured links** to each family (moringa, tea, spices, tools).

---

## Contact / about / local

- **Contact** ([/contact](https://nutrithrive.com.au/contact/)): **Email and phone** appear in **footer** site-wide; contact page itself was **shorter in word count** in the crawl—ensure the page itself states **how to get help** (response time, business hours) without relying only on the footer.
- **About** ([/about](https://nutrithrive.com.au/about)): Use for **founder story**, **why Truganina**, and **quality testing**—check that it’s not a thin restatement of the homepage.
- **Melbourne** ([/melbourne](https://nutrithrive.com.au/melbourne)): **Local intent**—ensure **NAP** (name, address, phone) matches footer and GMB, and that this page is linked from the homepage or footer (it had **low internal inlinks** in the 50-page batch—fix cross-linking).
- **Physical address** appears in **footer:** *15 Europe Street, Truganina VIC 3029* — good for **local** trust; keep consistent everywhere.

---

## Legal / policy

- **Two possible privacy entry points** (`privacy-policy.html` vs `/pages/legal/privacy-policy` referenced in nav)—from a user perspective, **one** clear “Privacy & terms” destination avoids confusion. From SEO, one canonical.

---

*Generated 2026-04-24.*
