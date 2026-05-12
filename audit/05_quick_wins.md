# Phase 5 — Quick wins (top 15)

Ranked by **impact**, with **effort** and **priority** band.

---

**[Priority #1] — Fix wrong canonical tags on money pages**  
- **Page affected:** `https://nutrithrive.com.au/about`, `https://nutrithrive.com.au/melbourne`, `https://nutrithrive.com.au/products/moringa-soap`, `https://nutrithrive.com.au/pages/newsletter`, and multiple blog URLs pointing to `/` or `/products/moringa-powder/` (see `audit/03_technical_seo.md` table).  
- **Problem:** Canonicals tell Google the “real” URL is elsewhere — often the **homepage or PDP** — so landings may not rank for their queries.  
- **Fix:** Set `<link rel="canonical">` to **self URL** (or one deliberate alternate) per page; document a single policy (prefer `https://nutrithrive.com.au` **without** `www`).  
- **Impact:** High | **Effort:** Medium  
- **Why it matters:** Wrong canonicals are one of the fastest ways to **lose indexed pages** and confuse link equity.

---

**[Priority #2] — Unify apex vs `www` host**  
- **Page affected:** `https://nutrithrive.com.au/privacy-policy` (canonical uses `https://www.nutrithrive.com.au/privacy-policy`).  
- **Problem:** Split host signals duplicate site versions.  
- **Fix:** 301 redirect **one** host to the other everywhere; align canonicals, internal links, and Search Console property.  
- **Impact:** High | **Effort:** Easy  
- **Why it matters:** Prevents **divided rankings** and analytics noise.

---

**[Priority #3] — Replace placeholder map image on Contact**  
- **Page affected:** `https://nutrithrive.com.au/contact`  
- **Problem:** Image `src` resolves to `https://example.com/map-image.jpg` — looks broken and unprofessional.  
- **Fix:** Embed real static map image or Google Maps embed for **15 Europe Street, Truganina**; add meaningful `alt`.  
- **Impact:** High (trust) | **Effort:** Easy  
- **Why it matters:** Contact is a **conversion page**; broken assets reduce enquiries.

---

**[Priority #4] — Reduce homepage to a single H1**  
- **Page affected:** `https://nutrithrive.com.au/`  
- **Problem:** **Four** H1 strings detected — confusing for SEO parsers and screen readers.  
- **Fix:** Keep one H1 for the main promise; demote product band headings to H2.  
- **Impact:** Medium | **Effort:** Easy  
- **Why it matters:** Clear **one-topic** signal for the homepage in search.

---

**[Priority #5] — Fix or remove 404 blog URL from navigation/sitemaps**  
- **Page affected:** `https://nutrithrive.com.au/blog/30-day-moringa-experiment-replaced-supplements-journal-2026.html`  
- **Problem:** Listed in site map crawl but returns **404**.  
- **Fix:** Publish the page, **301** to closest live article (`10-dollar-superfood…` or `30-day-moringa-coffee-reset…`), and remove from XML sitemap until live.  
- **Impact:** High | **Effort:** Easy  
- **Why it matters:** Dead links waste crawl budget and **frustrate users**.

---

**[Priority #6] — Repair `smart-moringa-daily-intake` canonical**  
- **Page affected:** `https://nutrithrive.com.au/blog/smart-moringa-daily-intake-australia-visual-guide-2026.html`  
- **Problem:** Canonical points to **`moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026`** — a different URL and topic cluster.  
- **Fix:** Self-canonical; align H1 with “moringa dose Australia / visual guide”.  
- **Impact:** High | **Effort:** Easy  
- **Why it matters:** Prevents **wrong page** winning for dosing queries.

---

**[Priority #7] — Stop pointing article canonicals to the PDP unless intentional**  
- **Page affected:** e.g. `science-shade-drying-vs-sun-drying-moringa.html`, `is-moringa-legit…`, `30-day-moringa-coffee-reset…`, `rosabella-moringa-reviews…`, `moringa-powder-vs-capsules…`  
- **Problem:** Blog URLs canonicalise to **`/products/moringa-powder/`** — blog content may be **excluded** from “informational” rankings.  
- **Fix:** Unless part of a deliberate consolidation, use **self** canonicals; use **internal links** + CTAs for commerce instead.  
- **Impact:** High | **Effort:** Medium  
- **Why it matters:** You risk **losing long-tail blog traffic** while over-weighting one PDP.

---

**[Priority #8] — Add JSON-LD to thin schema pages**  
- **Page affected:** `/about`, `/products`, `/blog/melbourne-food-as-medicine-map-cafes-organic-stores-healthspan-eating-2026.html`, `/blog/moringa-powder-vs-capsules-which-one-actually-works-better-2026.html`  
- **Problem:** Missing or empty structured data where competitors have **Organization**, **ItemList**, **Article**.  
- **Fix:** Add minimal valid JSON-LD blocks matching visible content.  
- **Impact:** Medium | **Effort:** Medium  
- **Why it matters:** Improves **eligibility** for rich results and clarity for crawlers.

---

**[Priority #9] — Expand `/products` hub copy**  
- **Page affected:** `https://nutrithrive.com.au/products`  
- **Problem:** ~115 words — thin for a category page; no links to FAQ/shipping in extract.  
- **Fix:** Add 300–500 words on **how you choose products**, links to **shipping**, **lab testing**, and **2–3 flagship guides**.  
- **Impact:** Medium | **Effort:** Easy  
- **Why it matters:** Strengthens **internal linking** and conversion context.

---

**[Priority #10] — Fix duplicate H1 on taste / caffeine / coffee / spirulina posts**  
- **Page affected:** `how-to-use-moringa-powder-daily-without-the-bad-taste-2026.html`, `does-moringa-have-caffeine…`, `30-day-moringa-coffee-reset…`, `moringa-vs-spirulina-vs-matcha…`  
- **Problem:** Multiple H1s per URL.  
- **Fix:** Merge into one H1; rest H2.  
- **Impact:** Medium | **Effort:** Easy  
- **Why it matters:** Cleaner **outline** for readers and crawlers.

---

**[Priority #11] — Rewrite Rosabella “reviews” article to match URL intent**  
- **Page affected:** `https://nutrithrive.com.au/blog/rosabella-moringa-reviews-legit-or-overhyped-2026.html`  
- **Problem:** Content skews to **powder vs capsules** + product pitch; canonical to PDP.  
- **Fix:** Either rename URL to match capsules guide **or** rewrite opening 300 words as **Rosabella-specific** review with dated evidence table.  
- **Impact:** Medium | **Effort:** Medium  
- **Why it matters:** Reduces **pogo-sticking** and complaint risk from mis-matched SERP snippets.

---

**[Priority #12] — Strengthen blog index meta description**  
- **Page affected:** `https://nutrithrive.com.au/blog`  
- **Problem:** Generic meta (“various health topics…”).  
- **Fix:** Mention **moringa, Melbourne dispatch, lab-tested batches**, and **3 example article titles** in one sentence.  
- **Impact:** Medium | **Effort:** Easy  
- **Why it matters:** Improves **CTR** from brand + category queries.

---

**[Priority #13] — Add cross-links from tea & soap PDPs**  
- **Page affected:** `https://nutrithrive.com.au/products/black-tea`, `https://nutrithrive.com.au/products/moringa-soap`  
- **Problem:** Very few internal NutriThrive links in extracts.  
- **Fix:** Link to **moringa powder**, **combo pack**, and **one relevant blog** each.  
- **Impact:** Medium | **Effort:** Easy  
- **Why it matters:** Distributes **PageRank** and helps shoppers discover bundles.

---

**[Priority #14] — Fix `moringa-brands-comparison` H1 to headline the comparison**  
- **Page affected:** `https://nutrithrive.com.au/blog/moringa-brands-comparison-australia-2026.html`  
- **Problem:** H1 “What You'll Learn in This Complete Guide” is **non-descriptive**.  
- **Fix:** H1 like “Best moringa powder brands in Australia (2026): 15 compared”.  
- **Impact:** Medium | **Effort:** Easy  
- **Why it matters:** Aligns **query → headline** in SERP and on-page.

---

**[Priority #15] — QA FAQ images and buyers-guide image markup**  
- **Page affected:** `https://nutrithrive.com.au/faq`, `https://nutrithrive.com.au/blog/moringa-powder-complete-buyers-guide-australia-2026.html`  
- **Problem:** Suspicious image paths / possible `img` pointing at page URL.  
- **Fix:** Validate in browser Network tab; correct `src` to real CDN assets; add width/height + lazy loading.  
- **Impact:** Low–Medium | **Effort:** Medium  
- **Why it matters:** Faster **LCP** and fewer **broken image** trust hits.

---

*Do #1–#3 this week; #4–#8 this month; remainder this quarter.*
