# Phase 6 — Executive summary (for the business owner)

**Website:** [https://nutrithrive.com.au](https://nutrithrive.com.au)  
**What we did:** We mapped the site, read dozens of real pages, and compared what visitors see to what **search engines and customers** need. This is written in **plain language**.

### Remediation status (repo, 2026)

Many items below are **addressed in code** since this document was first written: sitemap is regenerated with `node scripts/build-sitemap.js` (dozens of URLs, including blog); key blog `noindex` issues were fixed; usage-guide path has a 301; Chinese guide and shipping copy were aligned; self-hosted social images; JSON-LD deduping and correct canonicals/Article IDs; a single `LocalBusiness` source at `shared/schema/nutrithrive-local-business.json` with `scripts/sync-local-business-jsonld.js`. **Still manual after deploy:** submit sitemap in Google Search Console, spot-check Rich Results, monitor PageSpeed.

---

## 1. Overall site health score: **72 / 100**

**Why this score:** The shop and blog are **serious** — long guides, product detail, and Melbourne trust signals. Points were lost because: (1) the **sitemap** does not list all the articles that actually exist, (2) some pages may be set to **“don’t show in Google”** when they should rank, and (3) a few **messy** meta descriptions, **duplicate** text patterns, and **inconsistent** shipping details can confuse people before they buy. **Fixing the top few items is not a redesign** — it is mostly **configuration and copy**.

---

## 2. Top 3 strengths

1. **Deep, useful content** — Pillar posts (moringa guide, brand comparison, “is moringa legit”) are **thorough** and show **real work**, not empty filler. That supports **Google** and **buyer trust** together.  
2. **Clear product range** — Moringa, curry leaves, tea, soap, and bundles are **easy** to find from the home page and product hub.  
3. **Local story** — Melbourne / Truganina dispatch and an **“about the brand”** story help Australians choose you over a **generic** overseas listing.

---

## 3. Top 3 problems to fix first

1. **Sitemap and indexing** — Not every published article appears in the **sitemap**; some good pages may also be marked **“do not index”** by mistake. **Result:** less **free Google traffic** than you could have.  
2. **Inconsistent or broken details** — One example: **free shipping** numbers that **don’t match** between a language-specific guide and the main **FAQ**; another: **conflicting** links to the “how to use moringa” page. **Result:** people stop trusting the **next** step to checkout.  
3. **Search-result snippets** — Repeated or **glued-together** short descriptions and **mismatched** social titles on long posts. **Result:** **fewer clicks** from Google even when you rank, because the preview looks **generic** or **strange**.

---

## 4. 30-day action plan (in order)

| Week | What to do | Outcome |
|------|------------|--------|
| **1** | Regenerate the **sitemap** from all live URLs; upload; submit in **Google Search Console**. | Google sees **all** important pages. |
| **1** | Audit **`noindex`** on every blog post; turn **on** indexing for strong guides that should bring customers. | No accidental **hiding** of good pages. |
| **1** | **One** correct URL (and one **shipping** number) in a **checklist**; update Chinese guide + any page with old **$** copy. | Fewer **support** messages and more **checkouts completed**. |
| **2** | Fix **meta description** template: no duplicate ending on every page; fix the **“how to add moringa”** page **description** bug. | Better **click-through** from search. |
| **2** | **301 redirect** and fix internal links for the **usage guide** path. | **No dead ends**; stronger internal linking. |
| **2** | Remove **“SEO / linking strategy”** wording from **public** blog text (e.g. Darjeeling article). | **More trust** from readers. |
| **3** | Move **share images** to your own site instead of a **host** you don’t control. | **Reliable** previews on **social** and **chat** apps. |
| **3** | Clean up **duplicated** FAQ blocks and **repeated** review lines on the home page. | **Shorter, clearer** pages. |
| **4** | Tidy **structured data** on the **blog** home (remove duplicate code blocks) and one **“contact”** line for **local business** in data. | **Fewer** Google errors; clearer **branding** in search features. |
| **4** | Copy-edit high-traffic posts for **typos** and **outdated** claims. | **Stronger** reputation on sensitive topics. |

---

## 5. Tools to monitor ongoing health (simple list)

- **Google Search Console** — See which pages **get clicks**, **coverage** errors, and **sitemap** reads (free, essential).  
- **Bing Webmaster Tools** — Quick extra coverage for **Bing** and **Edge** (free).  
- **PageSpeed Insights** (Google) or **Lighthouse** — Check **loading speed** on **mobile**; fast pages help both **users** and **search**.  
- **Rich Results Test** (Google) — Paste a product or article URL; confirm **no errors** in **structured** data.  
- **A shopping analytics or heatmap** (e.g. your existing e-commerce or **Plausible/GA4**) — Watch where people **drop off** in checkout after SEO fixes.  

You do **not** need every enterprise tool. **Search Console + sitemap** alone catch most **“why did traffic drop”** issues.

---

**Bottom line:** NutriThrive is **closer to “strong” than “weak”** — the main work is **discipline** (one truth for **shipping and URLs**, a **full sitemap**, and **clean** search snippets), not a full rewrite.

*Detail: `01`–`05` in this `audit` folder; combined: `FULL_AUDIT_REPORT.md`.*
