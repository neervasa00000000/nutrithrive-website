# Phase 3 — Technical SEO audit

**Site:** [https://nutrithrive.com.au](https://nutrithrive.com.au)  
**Source:** Scrape batch (`02_raw_pages.md`), [sitemap.xml](../sitemap.xml) (55 `loc` entries), and static HTML in repo (JSON-LD, duplicate scripts).

---

## 1. Title tags

| Check | Finding |
|--------|--------|
| **Missing** | None observed in sampled 200-OK pages. |
| **&gt; 60 characters (truncation risk)** | Homepage vs social: `og:title` can be **longer** than `<title>`; align primary keyword in `<title>` first 60 chars. Pillar pages (e.g. moringa guide) are **long** but generally within a reasonable range — verify in SERP simulator. **How to add moringa:** page title is shorter than `og:title` (“How to Add Moringa to Your Diet (10 Easy Daily Ideas + Dosage Guide)”) — **mismatch** between browser tab title and share title. |
| **&lt; 30 characters (weak)** | `Contact` is very short; acceptable for a utility page if brand is appended in template — **confirm** format `Contact \| NutriThrive` or similar. |
| **Duplicates** | No full duplicate &lt;title&gt; in the sample, but many titles share the **“Australia 2026”** pattern — differentiate by **primary entity** in first half of title. |
| **Title vs content** | Largely aligned; one article (`darjeeling-black-tea…`) contains a visible **“SEO snippets & linking strategy”** line in the body, which can confuse both users and classifiers. |

**Actions:** Unify `title` and `og:title` where they diverge; lengthen “Contact” with brand; remove internal SEO-strategy phrasing from public copy.

---

## 2. Meta descriptions

| Check | Finding |
|--------|--------|
| **Missing** | None on major templates sampled. |
| **&gt; 160 characters** | Long pillars may exceed; check **how-to-add** which shows **concatenated / garbled** description text in metadata (`…Australi.,` plus a second sentence) — **template bug**. |
| **&lt; 70 characters (weak)** | `Contact` and some utility pages: short; add **specific value** (response time, location, hours). |
| **Duplicates** | **Repeated** ending: “from NutriThrive Australia. Explore practical guidance…” appears across multiple pages — **duplicate meta** risk in search results. |
| **Generic/weak** | Descriptions that list “blog, products, updates” without a **hook** underperform — tighten with **outcome** + **proof** (Melbourne dispatch, lab-tested). |

**Actions:** Fix description merge bug on **how-to-add**; write **unique** 140–155 char descriptions; remove stock suffix across templates.

---

## 3. Heading structure

| Check | Finding |
|--------|--------|
| **Missing H1** | Tool pages (pomodoro, password generator) are UI-heavy: ensure **one** visible H1 for accessibility and SEO. |
| **Multiple H1s** | Not flagged strongly in markdown, but some blog pages have very long **TOC** areas — **validate** in DOM. |
| **H1 vs intent** | Product pages: good (product name). Blog: long questions/s titles match **informational** intent. |
| **Skips (H1 → H3)** | **how-to-add** and **brands** pages have deep TOC; verify no skipped levels in the **main** article region. |
| **Vague headings** | Avoid duplicate “Frequently asked questions” blocks with **same** heading level repeated; use unique FAQ subheads or schema-only FAQ. |

---

## 4. Images

| Check | Finding |
|--------|--------|
| **Missing alt** | Product and blog rely on `img` in HTML — **spot-check** all templates; marketing screenshots in articles need descriptive alt, not only filenames. |
| **Keyword-stuffed alt** | Moringa product long-form: dense keyword lists in comparison blocks — can read as **stuffed**; use **natural** phrases. |
| **Large / lazy load** | Not measured in scrape; add **width/height**, **loading="lazy"** below fold, **srcset** for hero and product images. |
| **Decorative** | Icons and repeated decorative graphics should use `alt=""` and `aria-hidden` as appropriate. |
| **Third-party `og` images (imgur)** | Many metas use **i.imgur.com** — if imgur throttles or changes URLs, **social previews break**; self-host on `nutrithrive.com.au`. |

---

## 5. Internal linking

| Check | Finding |
|--------|--------|
| **Orphans (nothing links in)** | **Extra blog URLs** not in sitemap and not linked from hub risk low discovery — add from **blog index** and **topic clusters** (e.g. “Protein & fitness” block). **Labs** tools: must link from `/nutrithrive_labs/` and optional footer. |
| **Homepage** | Good paths to **products** and **blog**; re-check that **key money pages** (moringa powder, brand comparison) appear **above the fold** or in a stable module. |
| **Blog** | Strong **related guides** and **in-body** links on pillars (e.g. `is-moringa`, moringa guide) — good. |
| **CTAs to conversion** | Product CTAs are frequent on commercial posts; **non-commercial** local posts (e.g. Melbourne gyms) should still link to **1 relevant product** to pass equity without feeling spammy. |
| **Broken / inconsistent paths** | Example: `…/usage-guide/how-to-use-moringa.html` vs `…/pages/usage-guide/how-to-use-moringa.html` — **one canonical** + fix internal links. |

---

## 6. Content quality

| Check | Finding |
|--------|--------|
| **Thin (&lt; 300 words)** | Contact, some Labs tool shells — **acceptable** for intent; add short intro for tools if indexed. |
| **Duplicates** | Overlapping “best moringa / brands / where to buy” set — you’ve started **merging** into one hub; keep **canonical** choice clear between legacy URLs. |
| **No CTA** | Some articles end in newsletter/related only — add **one** primary CTA to **moringa powder** or **combo** where relevant. |
| **E-E-A-T** | **Why I built** and **is moringa legit** include **author/team** lines — good. YMYL-adjacent posts (protein, health consumer) need **date updated**, **byline**, and **citations** (partially present). **Internal “SEO strategy”** text on Darjeeling post **hurts** trust. |
| **noindex, follow** | Several long articles were observed with **noindex** (e.g. matcha vs moringa energy, some brand-review style posts) — if intentional, document **why**; if not, this **suppresses** valuable traffic. |

---

## 7. URL structure

| Check | Finding |
|--------|--------|
| **Uppercase** | Not an issue in sample. |
| **Underscores vs hyphens** | `nutrithrive_labs` uses underscores in **path** — minor vs hyphen; consistent internal linking matters more. |
| **Length** | Some blog URLs **&gt; 75** characters (acceptable for long-tail; ensure canonical is stable). |
| **Query parameters** | Cart/checkout may use query strings — keep **indexable** pages parameter-free. |

---

## 8. Schema / structured data

| Finding | Detail |
|--------|--------|
| **Present** | `WebSite`, `Organization`, `Product` (with reviews on PDP), `LocalBusiness` (repeated in repo across templates — **dedupe** to avoid GSC “duplicate field” noise), `Blog`/`BlogPosting` on blog. |
| **Gaps** | **Article** on blog posts: confirm **Article** or **BlogPosting** per post with `dateModified`, not only blog index. **FAQ** on `/faq`: ensure **FAQPage** matches on-page Q&amp;A. **BreadcrumbList** is used in places — ensure full trail on PDP and articles. |
| **Issues** | [blog/index.html](../blog/index.html) contains **two identical** `BlogPosting` JSON-LD blocks for the same blog main page — **remove duplicate script**. **Blog index** is not a single blog *post*; using `BlogPosting` for the listing may be **semantically wrong** — use `WebPage` + `Blog` or `ItemList` for cards. |
| **Product** | Moringa and line extensions should have `Product` + `Offer` + `AggregateRating` where reviews are real and shown — **align** with visible content. |

---

## Priority technical fixes (condensed)

1. **Sitemap** — include **all** published posts (match crawl); automate in CI from content manifest.  
2. **noindex** — review each URL set to `noindex`; flip to **index** when content is the marketing asset.  
3. **Meta** — remove duplicate template suffix; fix **how-to-add** description **glue** bug.  
4. **Canonicals & paths** — one URL for usage guide; 301/redirect loose paths.  
5. **JSON-LD** — delete duplicate `BlogPosting` on blog index; consider `ItemList` for post grid.  
6. **og images** — host on own domain.  
7. **Internal** — add hub links to **sitemap-missing** articles.

---

*Content and UX nuance: `04_content_ux.md`.*
