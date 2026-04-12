# Phase 4 — Content & UX audit

**Target:** https://nutrithrive.com.au  
**Evidence:** Live scrapes (Phase 2) + page structure review.  
**Scores:** Previous **72**/100 → Current **73**/100 (see `06_executive_summary.md`; site unchanged between versions).

---

## Homepage (`/`)

**What works**

- H1 clearly states product category and geography (“Melbourne”, “Moringa”).  
- Product grid exposes multiple SKUs with plain-language labels.  
- Trust cues appear in copy (lab-tested, vegan, shipping scope).

**Friction**

- **Value proposition** is strong in body copy but ensure above-the-fold mobile layout leads with *one* sentence a first-time visitor can quote (“Australian moringa & superfoods shipped from Melbourne”).  
- **Internal links** mix pretty URLs and `privacy-policy.html` — minor trust “polish” issue for detail-oriented shoppers.

---

## Blog / guides

**Representative URLs**

- https://nutrithrive.com.au/blog/moringa-brands-comparison-australia-2026.html  
- https://nutrithrive.com.au/blog/moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html  
- https://nutrithrive.com.au/blog/moringa-vs-spirulina-vs-matcha-comparison-australia.html  

**Strengths**

- Exceptional depth on comparison and buyer-intent queries.  
- Clear sectioning via H2s; good candidate pages for evergreen SEO.

**UX / credibility**

- Heavy use of **third-party image hosts** in social/meta imagery — consider hosting key diagrams locally for perceived quality.  
- **Next-step CTAs** exist on some posts via product links; ensure each long post ends with a *single* primary CTA (“Shop moringa”) plus a secondary (“Read dosage guide”).

**E-E-A-T**

- Author/byline signals appear on some articles in metadata — good. Make **visible** on-page (bio + “why we’re qualified”) for YMYL-adjacent health content.

---

## Product / service pages

**Examples**

- https://nutrithrive.com.au/products/moringa-powder/  
- https://nutrithrive.com.au/products/curry-leaves/  
- https://nutrithrive.com.au/products/black-tea/  

**Strengths**

- Each page has a tight H1 aligned to the SKU.  
- FAQs and reviews sections support objection handling.

**Gaps**

- **Combo pack** Open Graph image uses a **relative** path in head — social previews may break on some platforms.  
- **Canonical slugs** do not match folder URLs (see Phase 3) — users may copy URLs from the bar and share inconsistent links.

---

## Contact / About / policies

**About (`/about`)**

- Story-driven H1 and section headings read authentic — good for brand.  
- Fix canonical pointing home so Google credits this URL properly.

**Contact (`/contact`)**

- Clear phone-led support story for AU customers.  
- Map embed is useful; **empty alts** on tiles are an accessibility nit.

**Privacy / shipping**

- Privacy page content is substantial; add a normal meta description for SERP polish.  
- Shipping page is practical but short — add scannable tables (metro vs regional) to reduce support load.

---

## Melbourne local landing (`/melbourne/`)

**Strengths**

- Local delivery promise and warehouse framing are clear.  
- Product shortcuts are sensible.

**Risks**

- Canonical to homepage **collapses** local landing equity — from a UX/SEO standpoint, shoppers searching “moringa Melbourne” benefit from this URL remaining distinct.

---

## Labs (`/nutrithrive_labs/`)

**UX**

- Tools are clearly labeled; good for power users.

**Brand separation**

- Utilities are co-branded with the ecommerce header/footer. If unintended, consider a lighter chrome so Labs doesn’t compete with money pages in site navigation mental model.

---

## Overall UX takeaway

You already publish **best-in-class long-form guides** for your niche. The biggest UX wins now are **trust polish** (self-hosted assets, consistent URLs), **accessibility on contact**, and **clear CTAs** at the end of every long article.
