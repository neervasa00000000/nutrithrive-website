# Phase 5 — Quick wins (top 15)

Ranked by **impact × feasibility**. All URLs are on https://nutrithrive.com.au unless noted.

---

**[Priority #1] — Fix incorrect canonicals that point to the homepage**

- **Page affected:** `/about`, `/melbourne/`, `/pages/newsletter/`, `/products/`  
- **Problem:** Canonical tags tell search engines these URLs are duplicates of `/`, collapsing rankings for local, about, newsletter, and shop landing pages.  
- **Fix:** Set `<link rel="canonical">` to each page’s own clean URL (or deliberately choose one URL pattern and 301 the rest).  
- **Impact:** High | **Effort:** Easy  
- **Why it matters:** Without correct canonicals, Google may not rank these URLs for their intended queries.

---

**[Priority #2] — Align product canonicals with the URLs customers actually share**

- **Page affected:** `/products/black-tea/`, `/products/combo-pack/`, `/products/curry-leaves/`  
- **Problem:** Canonical slugs (`premium-black-tea`, `premium-wellness-combo-pack`, `dried-curry-leaves`) do not match the live folder URLs.  
- **Fix:** Either (a) change canonical to the folder URL, or (b) 301 folder URL → canonical slug and update internal links to match **one** system.  
- **Impact:** High | **Effort:** Medium  
- **Why it matters:** Prevents duplicate product URLs and protects Product rich-result consistency.

---

**[Priority #3] — Repair broken / risky Open Graph image on the usage guide**

- **Page affected:** `/pages/usage-guide/how-to-use-moringa.html`  
- **Problem:** `og:image` appears malformed (concatenated path/URL in scrape metadata).  
- **Fix:** Set `og:image` to a valid absolute WebP/JPG on your domain; re-test with a social debugger.  
- **Impact:** High | **Effort:** Easy  
- **Why it matters:** Broken previews reduce clicks from shares (SMS, Facebook, Slack).

---

**[Priority #4] — Add real meta descriptions on policy, shipping, and key labs pages**

- **Page affected:** `/privacy-policy`, `/pages/shipping/shipping-returns`, `/nutrithrive_labs/`, `/nutrithrive_labs/dedup-lines.html`, `/nutrithrive_labs/time-converter.html`, `/blog/dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html`  
- **Problem:** `<meta name="description">` missing or empty in extraction while some OG descriptions exist.  
- **Fix:** Write 1–2 sentence descriptions (unique, non-keyword-stuffed) for each URL.  
- **Impact:** Medium | **Effort:** Easy  
- **Why it matters:** Google often rewrites, but good descriptions still influence snippets and internal tooling.

---

**[Priority #5] — Audit internal links that point to URLs outside `sitemap.xml`**

- **Page affected:** `/contact` (primary offender), plus `/melbourne/` and product pages linking to extra blog slugs  
- **Problem:** Links may 404 or send users/crawlers to unpublished/off-topic content (e.g. gym guide from a moringa contact page).  
- **Fix:** Crawl with a link checker; remove/replace with live, on-topic URLs; ensure redirects for renamed posts.  
- **Impact:** High | **Effort:** Medium  
- **Why it matters:** Broken links waste crawl budget and harm trust.

---

**[Priority #6] — Standardise privacy URL (`/privacy-policy` vs `privacy-policy.html`)**

- **Page affected:** Sitewide footer/navigation  
- **Problem:** Mixed internal linking patterns increase duplicate URL risk.  
- **Fix:** Pick one canonical privacy URL;301 the other; update templates.  
- **Impact:** Medium | **Effort:** Easy  
- **Why it matters:** Consolidates signals to one policy URL.

---

**[Priority #7] — Replace Imgur-dependent product imagery on money pages**

- **Page affected:** `/products/` (and any other pages using `i.imgur.com`)  
- **Problem:** Third-party image hosting can break, looks less premium, and complicates performance tuning.  
- **Fix:** Host optimised WebP/AVIF under `/assets/...` and update references.  
- **Impact:** Medium | **Effort:** Medium  
- **Why it matters:** More reliable UX and better control of Core Web Vitals.

---

**[Priority #8] — Fix Labs dedup tool canonical**

- **Page affected:** `/nutrithrive_labs/dedup-lines.html`  
- **Problem:** Canonical points to `/nutrithrive_labs/` instead of the tool.  
- **Fix:** Self-canonicalise the tool URL or intentionally noindex the tool and remove from sitemap.  
- **Impact:** Medium | **Effort:** Easy  
- **Why it matters:** Prevents the wrong URL representing the tool in search results.

---

**[Priority #9] — Tidy FAQ heading semantics**

- **Page affected:** `/faq`  
- **Problem:** Duplicate question strings as both H2 and H3.  
- **Fix:** Use H2 for questions; keep answers in panels without extra heading duplication.  
- **Impact:** Medium | **Effort:** Medium  
- **Why it matters:** Cleaner accessibility + clearer topical structure for search parsers.

---

**[Priority #10] — Strengthen thin indexable pages**

- **Page affected:** `/pages/newsletter/`, `/pages/shipping/shipping-returns`  
- **Problem:** Very low word count for pages that look indexable.  
- **Fix:** Add concise FAQs, delivery table, and newsletter value props (what emails contain, frequency, privacy).  
- **Impact:** Medium | **Effort:** Easy  
- **Why it matters:** Thin pages struggle to rank and convert.

---

**[Priority #11] — Fix combo pack social sharing metadata**

- **Page affected:** `/products/combo-pack/`  
- **Problem:** Relative `og:image` path in head.  
- **Fix:** Use absolute HTTPS image URL.  
- **Impact:** Medium | **Effort:** Easy  
- **Why it matters:** Reliable share cards increase referral traffic.

---

**[Priority #12] — Align products index title and H1 language**

- **Page affected:** `/products/`  
- **Problem:** Title emphasises specific SKUs; H1 is generic (“Shop Premium Wellness”).  
- **Fix:** Make H1 match inventory (“Shop moringa, tea, curry leaves & bundles”) or adjust title to match H1 — but stay consistent.  
- **Impact:** Low–Medium | **Effort:** Easy  
- **Why it matters:** Reduces bounce from expectation mismatch.

---

**[Priority #13] — Decide indexing strategy for Labs**

- **Page affected:** `/nutrithrive_labs/*`  
- **Problem:** Utilities are indexable and may compete with core landing pages for branded queries.  
- **Fix:** Either lean into Labs as marketing (add copy + schema) or `noindex` + remove from sitemap.  
- **Impact:** Low–Medium | **Effort:** Easy  
- **Why it matters:** Focuses Google on revenue URLs.

---

**[Priority #14] — Add visible author module on flagship health articles**

- **Page affected:** Major blog URLs (brands comparison, powder guide, superfood comparison)  
- **Problem:** Strong content benefits from visible expertise cues.  
- **Fix:** Author box with credentials, review policy, and “last updated” prominently on-page.  
- **Impact:** Medium | **Effort:** Medium  
- **Why it matters:** Supports trust for health-adjacent queries (E-E-A-T).

---

**[Priority #15] — Normalise trailing slash policy**

- **Page affected:** Product canonicals vs directory URLs sitewide  
- **Problem:** Mix of slash and non-slash canonical patterns.  
- **Fix:** Choose one convention; enforce via server + canonical tags.  
- **Impact:** Low–Medium | **Effort:** Medium  
- **Why it matters:** Avoids duplicate URL clusters.
