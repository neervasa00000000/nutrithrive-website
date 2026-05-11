# Phase 6 — Executive summary (for the business owner)

**Website audited:** https://nutrithrive.com.au (NutriThrive Australia)  
**Note:** Your brief listed `https://YOURWEBSITE.com`; this report applies to the live NutriThrive site that matches your codebase and sitemap.

---

## 1. Overall site health score: **62 / 100**

**Why not higher?**  
The writing and product story on the site are **strong**—especially the Melbourne angle, lab-tested batches, and long educational articles. But several **behind-the-scenes technical settings** (mainly “canonical” tags that point pages at the wrong address, and one **broken link still listed in your sitemap**) tell Google not to trust or show some of your best pages the way you intend.

**Why not lower?**  
You already have **good content depth**, clear shipping and FAQ pages, product detail with reviews blocks, and a coherent brand. Fixing the technical layer is mostly **editing configuration and templates**, not rewriting the whole site.

---

## 2. Top 3 strengths

1. **Clear niche and story** — Shade-dried moringa from Melbourne, small batches, lab transparency. That is easy for a shopper to remember and repeat to a friend.  
2. **Serious content library** — Long guides (Melbourne safety, where to buy, brand comparisons, spirulina vs matcha) that answer real questions Australians type into Google.  
3. **Practical trust pages** — FAQ, shipping and returns, contact with a phone number, and product pages structured around objections (taste, safety, shipping).

---

## 3. Top 3 critical problems (fix first)

1. **Wrong “canonical” tags on important pages** — In plain English: some pages quietly tell Google, “The real version of this page is the home page” or “is the product page,” even when the reader is reading a **blog article** or the **About** page. That can **hide** those URLs from search or send ranking credit to the wrong place.  
2. **Product URLs don’t match their canonical addresses** — Example: the curry-leaves page lives at one web address but claims its official address is a **different slug**. That confuses shoppers who copy links and splits your marketing data.  
3. **Sitemap promises a page that doesn’t exist** — The protein energy bars article address returns a **“page not found”** error but still appears in your sitemap file. That looks sloppy to Google and wastes effort.

---

## 4. 30-day action plan (in order)

| Week | What to do |
|------|------------|
| **Week 1** | Fix canonical tags for **Homepage, About, Melbourne, Shop directory, Soap**, and any blog post pointing at Home or Shop by mistake. Make each page “claim itself” as the official URL. |
| **Week 1** | Fix product slug mismatches (curry leaves, black tea, combo) so the **link people see** matches the **official canonical** path, with clean redirects if you rename folders. |
| **Week 1** | Remove or publish the **protein energy bars** page so the sitemap never points to a dead link. |
| **Week 2** | Fix the **Rosabella** article so the browser tab title, social preview title, and headline all describe the **same** article; fix its canonical to that article’s own link. |
| **Week 2** | Rewrite the first headline on the **moringa brands comparison** guide so it reads like a real article title, not “What you’ll learn.” |
| **Week 2** | Double-check the **FAQ** page in “View Source” so title and description are definitely present for Google. |
| **Week 3** | Pass through the **top 20 money pages** (home, Melbourne, each product, top 10 blog posts) and shorten meta descriptions to **two crisp sentences** with a reason to click. |
| **Week 3** | Add a visible **“Updated on [date]”** line and author credit on articles—small change, helps trust. |
| **Week 4** | Add simple **breadcrumb navigation** (“Home → Blog → Article”) on posts and product pages for clarity. |
| **Week 4** | Run **Google Search Console** “Page indexing” and fix any new canonical or 404 issues flagged after the above changes. |

---

## 5. Tools to monitor ongoing health

- **Google Search Console** — See which pages Google indexes, what queries show your site, and whether canonicals or mobile issues appear.  
- **Bing Webmaster Tools** — Secondary search engine; quick extra coverage.  
- **Analytics (GA4 or privacy-friendly alternative)** — Track which articles actually send add-to-cart and purchases, not just traffic.  
- **Scheduled technical crawl** (Screaming Frog, Sitebulb, or Ahrefs/Semrush site audit monthly) — Catches **404s**, **redirect chains**, and **missing titles** after each deploy.  
- **Rich Results Test** (Google) — Paste a few product and FAQ URLs after schema changes to confirm structured data is valid.

---

## Closing (plain language)

You are **not** starting from zero. The site already reads like a serious Australian wellness brand with useful guides. The main gap is **housekeeping in the HTML head**: canonical tags and a few mismatched titles. Fixing those is usually **faster than writing one new long article**, but the payoff in **stable Google visibility** can be much larger.
