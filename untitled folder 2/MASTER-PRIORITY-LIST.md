# MASTER PRIORITY LIST
**Role:** Head of SEO · limited budget · biggest impact only  
**Date:** 22 July 2026  
**Excluded on purpose:** sitewide title shortening, homepage canonical-only, fragment URL hygiene, Speakable expansion, generic “add more words,” AI-sounding rewrites without proof gaps.

**Impact scale:** H = high · M = medium · L = low · — = not the primary goal of this task  
**Estimates are directional** (from GSC + page evidence). Not guarantees.

---

## Ranking logic (how this list was cut)

| Kept if… | Dropped if… |
|----------|-------------|
| Proven broken result (410 with clicks) | Cosmetic SEO checklist items |
| Clear IA conflict on one query (2 banned URLs) | “Shorten all titles” (cohort data contradicts) |
| High-impression page with fixable structural defect | Tasks needing Page×Query data before acting |
| Money page integrity / conversion blockers | Low-traffic lifestyle orphans |
| Cluster equity to #1 traffic or orphan high-impr URLs | Speculative AI Overview tweaks on pages that already have BLUF |

---

## MASTER TABLE

| Priority | Issue | Page | Why it matters | SEO | CTR | AI Overview | Gemini cite | Conv | Diff | Time | Who |
|:--------:|-------|------|----------------|:---:|:---:|:-----------:|:-----------:|:----:|:----:|------|-----|
| **1** | **410 URL still ranking & getting clicks** | `/blog/best-greens-powder-australia-2026` (+ `.html`) | Live HTTP **410**; GSC still **~12 clicks / 593+ impr** (plus `.html` variant). Users land on “removed.” Wastes a query cluster competitors own. | H | M | H | H | L | M | **4–16 h** (decide restore vs 301 + ship) | **Content + Developer** |
| **2** | **Two URLs for one question: “Is moringa banned?”** | `…banned-australia-truth-2026` **and** `…banned-in-australia` | Same primary intent; splits authority; confuses retrieval. Both still get impressions. | H | L | H | H | L | L | **2–4 h** | **Content + Developer** |
| **3** | **Wrong redirects: CW/investigation URLs → PDP** | `_redirects` → `/products/moringa-powder/` | Investigation equity dumped on a URL at **pos ~22**. Intent mismatch. | H | L | M | M | M | L | **30–60 min** | **Developer** |
| **4** | **Uncited scientific absolutes on #1 traffic page** | `/blog/moringa-patches-australia-review-do-they-work` | Claims “zero published… studies” / “4,000% search increase” with **0 research hrefs**. Kids page proves you can cite. Hurts EEAT + citability; page already has **81 clicks / 3.4k impr**. | M | L | H | H | M | L | **2–3 h** | **Content** |
| **5** | **#1 traffic page is under-linked (~3 inlinks)** | Patches review | Most clicks on site; graph shows **~3** inbound vs choose-guide **34** / PDP **~90**. Limits crawl/equity reinforcement. | H | — | M | M | M | L | **1–2 h** | **Content** |
| **6** | **High-impression orphan: curry substitute** | `/blog/curry-leaves-substitute-what-to-use-2026` | **1,221 impr / 0 clicks / pos ~10** and **0 internal inlinks**. Content quality is already strong (table/ratios). First job = discoverability + cluster, not a rewrite. | H | M | M | M | M | L | **1–2 h** links; optional SERP test later | **Content** |
| **7** | **PDP review schema vs visible reviews mismatch** | `/products/moringa-powder/` | JSON-LD `reviewCount: 47` vs **3** reviews on page. Trust/integrity risk; Product snippets already weak (**1,804 impr / 0.44% CTR / pos ~21**). | M | M | L | L | H | L | **1–3 h** | **Developer** (± Content if writing real reviews) |
| **8** | **Front-load brand tokens in patches SERP title** | Patches review | GSC: brand queries (`healrize`, `glorenda`) at strong positions with soft CTR; `rosabella…` at pos 3.5 gets **8.43% CTR** when brand leads. Title is **89 chars** — brands sit at the end. *Not* a sitewide title project. | L | H | L | L | L | L | **30–45 min** | **Content** |
| **9** | **CW page: proof photo + trim Rosabella duplication** | CW quality test | Ranks ~**pos 5** / **2k impr** but **1.63% CTR**; claims opened-capsule test while hero is smoothie bowl; overlaps Rosabella URL. Improves EEAT + cluster clarity. | M | M | M | M | H | M | **3–6 h** (needs real photo) | **Content + Design** |
| **10** | **Coffee page: cut mixed-intent sprawl** | `moringa-vs-coffee-melbourne-energy-hack` | **2 clicks / 1,098 impr / 0.18% CTR**; ~26 H2s; “Adrenal” marketing. Extreme outlier vs peers. Trim to caffeine comparison + decision + FAQ (`does moringa have caffeine` has demand). | M | H | H | M | L | M | **4–8 h** | **Content** |
| **11** | **PDP: on-page lab numbers + process proof** | `/products/moringa-powder/` | Lab PDF exists but thin visibility; pos **~22** on transactional demand. Won’t alone beat Coles/Amazon—but raises conversion & differentiation vs thin PDPs. | M | L | M | M | H | M | **4–8 h** | **Content + Design** |
| **12** | **Cannibalization ops: one owner per commercial cluster** | CW + Rosabella + `moringa-brands-comparison` (+ orphan best-rated mega-guide) | Same entities/recall/price maths across URLs; brands-comparison is **orphan**. Reposition > rewrite everything. | H | L | H | H | M | H | **1–2 days** | **Content** |
| **13** | **Shelf-life CTR anomaly (investigate then act)** | `how-long-does-moringa-powder-last-…` | Pos **~6.6** like patches but **0.33% CTR** vs patches **2.34%**. Title already matches intent—**do not guess**. Pull Page×Query + SERP screenshot first; then change the failing element only. | M | H | M | M | L | L–M | **1 h investigate + 0.5–2 h fix** | **Content** (needs GSC export) |
| **14** | **Patches promo density (sticky + duplicate cards)** | Patches review | Soft CTA early + 2 product cards + sticky. Ranking harm unproven; trust/CRO on skepticism intent is the case. Do **after** citations (#4). | L | — | L | L | M | L | **1 h** | **Developer / Content** |

---

## DO THIS WEEK (budget sequence)

```
1 → 2 → 3 → 4 → 5 → 6 → 7 → 8
```

**Stop after #8 unless remaining budget.**  
Items 9–12 are the next sprint.  
Item 13 is blocked on data.  
Item 14 is polish, not strategy.

---

## Explicitly NOT on this list (and why)

| Tempting task | Why cut |
|---------------|---------|
| Shorten all blog titles to 50–60 chars | Your cohort: short titles ≠ higher CTR |
| Homepage canonical only | Hygiene; no evidenced ranking/CTR lever |
| Fragment (`#`) GSC cleanup as priority | Reporting noise; 0 clicks; low ROI |
| “Make everything AI Overview ready” | Best pages already have BLUF/FAQ/tables |
| Expand every thin vs-page | Ashwagandha-class pages need citations or kill/merge—not bulk length |
| Local city page push | Low GSC share vs commercial investigation cluster |

---

## Impact summary (if only top 8 ship)

| Lever | What moves |
|-------|------------|
| **SEO** | Dead URL fixed; banned intent consolidated; redirect equity corrected; patches/substitute enter the link graph |
| **CTR** | Patches brand-front title; (later) shelf-life once diagnosed; coffee after trim |
| **AI / Gemini** | Citable patches claims; one banned canonical; greens query has a live answer again |
| **Conversion** | PDP review integrity; CW proof photo; patches trust-before-sell; PDP lab visibility |

---

## Owner cheat sheet

| Who | Owns priorities |
|-----|-----------------|
| **Developer** | 1 (redirects/410), 2 (301), 3, 7, 14 |
| **Content** | 1 (restore copy if chosen), 2 (merge), 4, 5, 6, 8, 9, 10, 11, 12, 13 |
| **Design** | 9 (test photo), 11 (lab/process visuals) |

---

**Head of SEO one-liner:** Fix broken and conflicting URLs first, then make the #1 page citable and linked, then unlock the orphan with 1.2k impressions—before any broad content refresh.
