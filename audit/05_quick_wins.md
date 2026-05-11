# Phase 5 — Top 15 quick wins (ranked)

Format: **Priority #X** — **Issue**  
- **Page:** URL  
- **Problem:** …  
- **Fix:** …  
- **Impact:** High / Medium / Low \| **Effort:** Easy / Medium / Hard  
- **Why it matters:** One sentence.

---

**[Priority #1] — Wrong canonical on About, Melbourne, Shop, Soap**  
- **Page:** https://nutrithrive.com.au/about , https://nutrithrive.com.au/melbourne , https://nutrithrive.com.au/products , https://nutrithrive.com.au/products/moringa-soap/  
- **Problem:** Canonical points to the **homepage** instead of each URL.  
- **Fix:** Set `<link rel="canonical">` to each page’s own clean URL (with chosen slash/.html convention).  
- **Impact:** High \| **Effort:** Easy  
- **Why it matters:** Search engines may **ignore or merge** these URLs and you lose rankings for brand, local, and category terms.

---

**[Priority #2] — Blog post canonicals pointing at homepage, product, or wrong article**  
- **Page:** e.g. https://nutrithrive.com.au/blog/nutrithrive-delivers-across-victoria-is-your-town-eligible-hint-yes.html → `https://nutrithrive.com.au/` ; https://nutrithrive.com.au/blog/moringa-vs-coffee-melbourne-energy-hack.html → `https://nutrithrive.com.au/blog/`  
- **Problem:** High-value articles **don’t self-canonicalize**.  
- **Fix:** Template fix: every article’s canonical = **its own URL** unless there is a true duplicate.  
- **Impact:** High \| **Effort:** Easy–Medium  
- **Why it matters:** Wrong canonical **suppresses** the article in Google or attributes its signals to the wrong page.

---

**[Priority #3] — Product canonical slug mismatches**  
- **Page:** https://nutrithrive.com.au/products/curry-leaves/ , /products/black-tea/ , /products/combo-pack/  
- **Problem:** Canonical uses **different slug** (`dried-curry-leaves`, `premium-black-tea`, `premium-combo-pack`) than the visible URL.  
- **Fix:** Align slug in URL structure **or** 301 redirect visible URL to canonical path and update internal links.  
- **Impact:** High \| **Effort:** Medium  
- **Why it matters:** Split signals, messy analytics, and **doubt** when customers share links.

---

**[Priority #4] — Sitemap lists a URL that 404s**  
- **Page:** https://nutrithrive.com.au/blog/best-protein-energy-bars-australia-2026-supermarket-guide.html  
- **Problem:** HTTP **404** while still in `sitemap.xml` (repo).  
- **Fix:** Deploy the page **or** remove from sitemap and Search Console; fix any internal links.  
- **Impact:** High \| **Effort:** Easy  
- **Why it matters:** Wastes crawl budget and sends **users and bots** to dead pages.

---

**[Priority #5] — Rosabella article: title vs og:title mismatch**  
- **Page:** https://nutrithrive.com.au/blog/rosabella-moringa-reviews-legit-or-overhyped-2026.html  
- **Problem:** Tab title says **Rosabella review**; `og:title` discusses **capsules vs powder**; canonical points at **another article**.  
- **Fix:** Pick one primary topic; align `<title>`, `og:title`, H1, and canonical; split into two posts if both topics are needed.  
- **Impact:** High \| **Effort:** Medium  
- **Why it matters:** Users and algorithms see **inconsistent** page identity — lower CTR and trust.

---

**[Priority #6] — Broken H1 on moringa brands comparison pillar**  
- **Page:** https://nutrithrive.com.au/blog/moringa-brands-comparison-australia-2026.html  
- **Problem:** H1 is **“What You'll Learn in This Complete Guide”** — not the topic.  
- **Fix:** Change H1 to e.g. “Best moringa brands in Australia (2026 comparison)”.  
- **Impact:** High \| **Effort:** Easy  
- **Why it matters:** H1 is the **strongest on-page relevance** signal for readers and search.

---

**[Priority #7] — FAQ page title/description extraction failure**  
- **Page:** https://nutrithrive.com.au/faq  
- **Problem:** Structured extract got empty title/description (metadata exists in head).  
- **Fix:** Ensure a single, early `<title>` and `<meta name="description">` in static HTML; remove duplicates or client-side replacement.  
- **Impact:** Medium \| **Effort:** Easy  
- **Why it matters:** Snippets and social shares rely on **clean meta**.

---

**[Priority #8] — Blog index title vs Open Graph mismatch**  
- **Page:** https://nutrithrive.com.au/blog/  
- **Problem:** `titleTag` extract ≠ `og:title` / `metadata.title` — inconsistent brand message.  
- **Fix:** Single source of truth in template for blog index title.  
- **Impact:** Medium \| **Effort:** Easy  
- **Why it matters:** Consistent naming improves **recognition** in tabs and shares.

---

**[Priority #9] — Homepage `<title>` vs very long meta / hero duplication**  
- **Page:** https://nutrithrive.com.au/  
- **Problem:** Long meta description; possible overlap between `<title>` and hero copy.  
- **Fix:** Shorten meta to ~155 chars with **one** CTA; keep hero persuasive on-page.  
- **Impact:** Medium \| **Effort:** Easy  
- **Why it matters:** Snippets truncate; **front-load** differentiators in the first ~110 chars.

---

**[Priority #10] — Newsletter canonical path**  
- **Page:** https://nutrithrive.com.au/pages/newsletter/  
- **Problem:** Canonical `https://nutrithrive.com.au/newsletter` may not match actual route — risk of chains or soft 404s.  
- **Fix:** Pick one URL; 301 the other; self-referencing canonical.  
- **Impact:** Medium \| **Effort:** Easy  
- **Why it matters:** Clean subscription URL helps **email and analytics** attribution.

---

**[Priority #11] — Invalid JSON-LD types on newsletter**  
- **Page:** https://nutrithrive.com.au/pages/newsletter/  
- **Problem:** Schema types like `Newsletter`, `Health` are not standard **schema.org** types for rich results.  
- **Fix:** Use `WebPage` + `Organization` or valid `WebApplication` if applicable; remove junk types.  
- **Impact:** Low–Medium \| **Effort:** Easy  
- **Why it matters:** Invalid schema can **pollute** Search Console with errors.

---

**[Priority #12] — Internal link to likely missing “benefits” post**  
- **Page:** https://nutrithrive.com.au/blog/moringa-vs-coffee-melbourne-energy-hack.html  
- **Problem:** Extract includes `https://nutrithrive.com.au/blog/benefits-moringa-powder/` — verify 200.  
- **Fix:** Replace with an existing pillar or remove.  
- **Impact:** Medium \| **Effort:** Easy  
- **Why it matters:** Broken internal links **waste** crawl and frustrate users.

---

**[Priority #13] — Labs hub canonical to a single tool**  
- **Page:** https://nutrithrive.com.au/nutrithrive_labs/  
- **Problem:** Canonical points to `/nutrithrive_labs/converter`.  
- **Fix:** Self-canonical for hub; `noindex` low-value tools if not meant to rank.  
- **Impact:** Low \| **Effort:** Easy  
- **Why it matters:** The **hub** should collect equity if you want it discoverable.

---

**[Priority #14] — Add BreadcrumbList schema site-wide**  
- **Page:** All commercial URLs  
- **Problem:** No breadcrumbs reported in extracts.  
- **Fix:** Visible breadcrumb UI + `BreadcrumbList` JSON-LD.  
- **Impact:** Medium \| **Effort:** Medium  
- **Why it matters:** Clarifies **site structure** to Google and can improve snippet presentation.

---

**[Priority #15] — Visible “Updated” date + author on articles**  
- **Page:** All `/blog/*.html` articles  
- **Problem:** Meta `article:modified_time` exists but visible byline not confirmed in scrape.  
- **Fix:** Template: “Updated 10 May 2026 · By [Name/Role]” under H1.  
- **Impact:** Medium \| **Effort:** Easy  
- **Why it matters:** **E-E-A-T** and freshness help YMYL-adjacent wellness content.

---

## This week vs month vs quarter

| Horizon | Items |
|---------|--------|
| **This week** | #1–#7, #12 (canonicals, 404 sitemap, H1, FAQ meta, Rosabella triage start) |
| **This month** | #3, #5, #8–#11, #14–#15 |
| **This quarter** | Full schema strategy (`Offer`, `Review` policy), category taxonomy on blog, performance (Core Web Vitals) on longest posts |
