# Phase 4 — Content & UX audit

**Scope:** Live pages scraped on `https://nutrithrive.com.au` (50 URLs). Qualitative review against first-party copy returned in Firecrawl JSON and headings.

---

## Homepage (`/`)

- **H1 overload:** Four separate H1-level strings (“Our products”, “Premium Natural Superfoods Collection”, etc.) read like **section chrome**, not one clear promise. A visitor scanning with assistive tech hears **four competing “titles”**.  
- **Value proposition:** Copy leans on **shade-dried, lab-tested, Melbourne dispatch** — strong, differentiated.  
- **CTAs:** Product cards and internal blog links exist; ensure primary CTA (“Shop moringa”) is visually dominant above the fold on mobile.  
- **Trust:** Customer block present (“What Our Customers Say”); good. Consider **ABN**, **dispatch address**, or “Packed in Truganina” badge near footer for AU shoppers.

---

## Blog / content hub (`/blog`)

- **Helpfulness:** Listing uses long, specific H2-style titles (protein tests, Victoria delivery, Rosabella vs NutriThrive) — reads **editorial**, not filler.  
- **UX issue:** Single H1 “Find and Explore Our Blogs” is **generic**; consider “Moringa & Superfood Guides for Australia (2026)” to match brand SEO.  
- **Meta:** Blog index meta is **template-y** — wasted SERP opportunity for a high-crawl page.

---

## Representative blog articles

### Strengths
- **Depth:** `moringa-brands-comparison-australia-2026.html`, `moringa-vs-spirulina-vs-matcha-comparison-australia.html`, `best-protein-powder-australia.html` show **long-form, comparison intent** — matches how Australians research supplements.  
- **Safety / compliance tone:** Melbourne guide mentions TGA/FSANZ-adjacent framing in copy — good for **trust** (not medical claims).  
- **Internal links:** Most posts loop readers back to `/products/moringa-powder/` and related guides — good funnel.

### Issues
- **H1/content drift:** `rosabella-moringa-reviews-legit-or-overhyped-2026.html` behaves like **capsules vs powder** + product pitch — **confusing** if someone clicked for “Rosabella reviews”.  
- **Journalism vs sales:** Some H2s on comparison pages read like **course outlines** (“What You'll Learn”) rather than answers — tighten for skim readers.  
- **E-E-A-T:** Many posts credit **“NutriThrive”** or **“Research Team”** — add **named author + date + “reviewed”** microcopy at top for YMYL-adjacent health content.

---

## Product / service pages

### `/products/moringa-powder`
- **Offer clarity:** Price, dispatch, reviews, FAQs — **strong**.  
- **Objections:** Chemist Warehouse comparison linked — excellent for AU buyers.  
- **Canonical oddity:** Canonical slug `/moringa-powder` vs folder URL — ensure user-visible breadcrumbs match.

### Other PDPs
- **Soap canonical → homepage** is a **hard UX/SEO bug** (users sharing soap URL may pass equity to home).  
- **Black tea / curry leaves:** thinner internal linking to sibling products — cross-sell “complete morning ritual” (tea + moringa) in body copy.

### `/products` hub
- **Too thin** (~115 words in extract) to rank or to reassure; expand with **buying criteria**, links to **lab testing**, **shipping**, and **top 3 use cases**.

---

## Landing pages

### `/melbourne`
- **Strong local story** (suburbs, delivery FAQ, product grid).  
- **Canonical → homepage** makes this page **invisible as a distinct Melbourne landing** — fix before investing in local PPC/SEO.

### `/buy-moringa-powder-australia/index.html`
- Good **mid-funnel** narrative; canonical merges to PDP — decide if you want this URL as **indexed** thought leadership or purely **paid landing** (current setup favours PDP).

---

## Contact / About / FAQ

### `/contact`
- **Phone number** in meta and body — excellent for AU audience.  
- **Map image** pointing at `example.com` — **unprofessional** and breaks trust.

### `/about`
- **Story quality:** “Pure moringa, crafted for real Australian life” + values H3s — **authentic**, founder-led tone.  
- **Canonical → homepage** — undermines standalone About rankings and shared links.

### `/faq`
- **Excellent UX:** Many specific H2 questions — matches how people search.  
- Ensure images load; broken images would **hurt** perceived quality.

---

## Newsletter (`/pages/newsletter`)

- Clear H1, three H2 reassurance blocks — good **consent UX**.  
- Canonical to homepage — if you want newsletter signups as **searchable** entry, point canonical to self.

---

## NutriThrive Labs

- **Positioning:** “Useful daily tools” — clear.  
- **SEO:** Fine as `noindex` utilities; keep **separate** from commerce sitemap if brand dilution is a concern.

---

## Cart

- Empty state with links to `/products/` and shipping — good **recovery path**.  
- Link to `/payment` must exist and work when cart has items (not verified in this audit).

---

## Cross-cutting UX

- **404:** `30-day-moringa-experiment-replaced-supplements-journal-2026.html` still advertised in map — **dead end** if linked from blog index cards.  
- **Redirect:** Usage guide URL sends users to the mega **how-to-add-moringa** article — OK if intentional; otherwise add a **short bridge page** so visitors expecting a short “usage card” are not dropped into 9k+ words without warning.

---

*Content is generally strong; the main UX risks are trust defects (placeholder assets), indexation/canonical strategy for key landings, and a few articles whose titles do not match the article body.*
