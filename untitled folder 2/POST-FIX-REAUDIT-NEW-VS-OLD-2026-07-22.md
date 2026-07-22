# Post-Fix Re-Audit: New vs Old
**Site:** nutrithrive.com.au  
**Report date:** 22 July 2026  
**Baseline:** `MASTER-SEO-AI-EEAT-AUDIT-REPORT-2026-07-22.md` + GSC 28d exports (pre-fix)  
**Re-audit method:** Live HTML, `_redirects`, `sitemap.xml`, `llms.txt`, internal-link crawl (codebase). **No new GSC window** — CTR/position outcomes need 2–4 weeks post-deploy.

---

## Executive verdict

| Question | Answer |
|----------|--------|
| Did fixes create **new** cannibalization? | **One serious IA bug was introduced, then fixed in this re-audit:** brands-comparison was set to `index` while still **301 → how-to-choose**. That is now corrected. Residual soft risk remains (CW ↔ Rosabella; taste ↔ how-to-add). |
| Has internal linking improved? | **Yes — materially.** Patches ~3→11 files; substitute 0→7; brands 0→10; CW still strongest commercial hub. |
| Does every page have its own purpose? | **Core commercial cluster: mostly yes now.** Full blog library: **no** (80+ low-traffic pages untouched). |
| Duplicate intents left? | **Fewer hard duplicates.** Banned merged. Greens 410→301. Soft overlaps remain (see scorecard). |
| Can Google tell which URL should rank? | **Much clearer for ops-fixed intents** (banned, greens, CW equity, patches brands). **Still ambiguous** until deploy + crawl for brands ranking URL; Rosabella title no longer steals “CW verdict.” |

**One-liner:** Ops + EEAT + link-graph work largely succeeded; commercial IA is clearer; do not confuse “high-ROI pages fixed” with “entire site perfect.”

---

## 1. New vs old — master issue table

| # | Issue (old audit) | Old state | New state | Status |
|---|-------------------|-----------|-----------|--------|
| 1 | Greens **410** still ranking | 410 + ~1,005 impr | **301 →** spirulina/matcha + `#best-greens` H2 | **Fixed** (await drop of old URL in GSC) |
| 2 | Two **banned** URLs | Both indexable | Truth URL **301 + noindex + canonical** → survivor; sitemap entry removed; self-links cleaned | **Fixed** |
| 3 | CW investigation URLs → **PDP** | Wrong intent | **301 → CW article** | **Fixed** |
| 4 | Patches **0 research cites** / unsourced Trends | Weak EEAT | Citations, search log, ARTG table, FAQ sync | **Fixed** |
| 5 | Patches **~3 inlinks** | Under-linked #1 page | **15 linking files / 27 hrefs** | **Improved** |
| 6 | Curry substitute **orphan** (0 inlinks, 0 clicks) | Orphan | **10 linking files**; title/SERP package improved | **Improved** |
| 7 | PDP `reviewCount: 47` vs 3 visible | Integrity risk | **`reviewCount: 3` + 3 Review objects**; other PDPs matched | **Fixed** |
| 8 | Patches title brands buried | Soft brand CTR | **Glorenda & Healrize** front-loaded | **Fixed** |
| 9 | CW Rosabella duplication | Heavy overlap | CW trimmed; points to Rosabella canonical | **Improved** |
| 10 | Coffee sprawl / 0.18% CTR | ~26 H2s | Lean caffeine comparison + FAQ | **Improved** |
| 11 | PDP thin vs transactional | Pos ~22 | CoA explainer + CW vs powder table + guide links | **Improved** (ranking TBD) |
| 12 | Brands cluster cannibalization | Orphan + noindex + mega-guides | Ranking owner live; legacy → brands-comparison; choose = checklist | **Mostly fixed*** |
| 13 | Shelf-life CTR anomaly | 0.33% CTR | Title/meta + merged answers | **Packaging fixed**; CTR TBD |
| 14 | Patches promo density | Sticky + 2 cards | One CTA at verdict; sidebar checklist | **Fixed** |

\*During the sprint, brands-comparison was briefly `index` **while still 301→how-to-choose** (new cannibalization / dead-end). **Corrected in this re-audit:** page now self-serves; `brands-reviewed` + `best-rated` 301 → brands-comparison.

---

## 2. Has fixing these pages created new cannibalization?

### Introduced then fixed (this re-audit)

| Risk | What happened | Resolution |
|------|---------------|------------|
| **Brands URL conflict** | Un-noindexed + linked heavily while `_redirects` still sent users/Google to `how-to-choose` | Brands-comparison now **200**; legacy brand lists 301 here |
| **PDP → brands dead-end** | PDP linked “ranking table” to a 301ing URL | Same fix — link now reaches live ranking page |

### Remaining / soft risks (not new, or mild)

| Cluster | Risk | Notes |
|---------|------|-------|
| **CW ↔ Rosabella** | **Med** | Shared entity (Rosabella) + recall/dose. Mitigated: CW = stock/test; Rosabella title no longer ends in “Chemist Warehouse Verdict.” Still some body overlap. |
| **AG1 ↔ spirulina “greens”** | **Low–Med** | Greens equity rolled into spirulina; AG1 stays cost/stack. Soft bleed only. |
| **Taste ↔ how-to-add** | **Med** | Both teach “hide bitterness.” Distinct should-rank still clear if titles stay sensory vs recipes. |
| **Berberine ↔ patches** | **Low** | Supporting: oral science vs patch review; cross-linked. |
| **Curry substitute ↔ vs-powder** | **Low–Med** | Vs-powder still answers “what if I don’t have leaves” briefly. |
| **PDP CW table** | **Low–Med** | PDP now competes lightly for CW commercial queries — acceptable if CW blog remains the investigation URL. |

### Net cannibalization judgment

| | Old | New |
|--|-----|-----|
| Hard duplicates | Banned ×2, greens 410 corpse, CW→PDP wrong, brands orphaned/noindex mess | **Mostly eliminated** |
| Soft commercial stack | CW + Rosabella + brands + best-rated fighting | **Clearer owners**; Rosabella/CW titles differentiated |
| New hard cannibalization from sprint | — | **One bug (brands 301)** — **fixed today** |

---

## 3. Has internal linking improved?

### Inlink counts (unique HTML files linking in / total `href` matches)

| URL | Old (audit) | New (crawl) | Delta |
|-----|-------------|-------------|-------|
| Patches review | **~3** | **15 files / 27 hrefs** | Strong ↑ |
| Curry substitute | **0** | **10 / 22** | Strong ↑ |
| Brands comparison | **0** (+ noindex) | **12 / 27** (+ live URL) | Strong ↑ |
| CW quality test | Already strong | **44 / 73** | ↑ (redirects + new donors) |
| Rosabella | Present | **14 / 34** | Stable/healthy |
| Spirulina/matcha | Strong | **40 / 87** | Hub (greens 301 target) |
| PDP moringa | ~90 cited | **186 / 915** | Dominant money-page graph |
| Choose guide | ~34 | **82 / 186** | Still checklist hub |

### Link-graph quality notes

- **Good:** Patches, substitute, brands no longer orphans; CW equity no longer dumped on PDP.
- **Watch:** Choose-guide still has huge inlink mass — fine as *checklist* hub, not as *brand ranking* owner (redirects now respect that).
- **Cleanup done:** Banned survivor no longer links to redirected truth slug; truth URL removed from sitemap.

**Verdict:** Internal linking **clearly improved** for the pages that mattered most.

---

## 4. Does every page have its own purpose?

### Commercial should-rank map (Google’s intended owner)

| Query / intent family | Should-rank URL | Purpose in one line |
|----------------------|-----------------|---------------------|
| Glorenda / Healrize / “do moringa patches work” | `/blog/moringa-patches-australia-review-do-they-work` | Transdermal evidence + brand checks |
| Oral moringa + berberine safety | `/blog/moringa-and-berberine-australia-what-science-says-2026` | Drug interactions + oral evidence |
| “Moringa Chemist Warehouse” / stock / in-store test | `/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025` | What CW stocks + freshness/dose maths |
| “Rosabella review / recall / legit” | `/blog/rosabella-moringa-reviews-legit-or-overhyped-2026` | Brand deep-dive |
| “Best moringa brand Australia” ranking | `/blog/moringa-brands-comparison-australia-2026` | Multi-brand table |
| “How to choose / quality checklist” | `/blog/how-to-choose-moringa-powder-australia-2026` | Criteria, not ranking essay |
| “Is moringa banned” | `/blog/is-moringa-banned-in-australia` | Recall vs legality |
| “Best greens powder” | `/blog/moringa-vs-spirulina-vs-matcha-comparison-australia` | 3-way nutrient comparison |
| “AG1 alternative / is moringa enough” | `/blog/ag1-alternative-australia-moringa-comparison-2026` | Cost vs stack breadth |
| Shelf life / expire | `…shelf-life-2026` | Months + storage |
| Shade vs sun | `…shade-drying…` | Processing / colour science |
| Taste / hide flavour | taste guide | Sensory |
| Recipes / habit | how-to-add | Usage |
| Buy powder | `/products/moringa-powder/` | Transactional |
| Curry leaf substitute | curry substitute guide | Mid-recipe swaps |

### Purpose clarity score

| Layer | Old | New |
|-------|-----|-----|
| Top commercial cluster | Blurry | **Mostly clear** |
| Ops (banned / greens / redirects) | Broken | **Clear** |
| Full `/blog/*` library (~100+) | Uneven | **Still uneven** (out of sprint scope) |

**Answer:** Every **priority** page now has a defined job. **Not** every page on the website.

---

## 5. Duplicate intents — scorecard

| Intent | Old | New | Risk now |
|--------|-----|-----|----------|
| Banned? | **Duplicate URLs** | Single canonical | **Low** |
| Best greens | **410 corpse** | 301 → 3-way | **Low** |
| CW stock | Split + wrong PDP 301 | CW article owns | **Low–Med** (Rosabella residual) |
| Best brands | Orphan / noindex / mega-guides | Ranking page live; legacies 301 in | **Low** if redirects stay |
| Patches vs berberine | Overlap | Supporting split | **Low** |
| Taste vs add | Soft | Soft | **Med** |
| Curry substitute vs vs-powder | Soft | Soft | **Low–Med** |
| Coffee vs Darjeeling caffeine | Soft | Soft | **Low** |

---

## 6. Can Google clearly understand which page should rank?

### Signals Google can use now

| Signal | Old | New |
|--------|-----|-----|
| Redirects match intent | Fail (CW→PDP, greens 410) | **Pass** for those clusters |
| One canonical banned URL | Fail | **Pass** |
| Title ↔ intent | Weak (patches brands last; CW soft) | **Stronger** |
| Internal links reinforce owner | Weak for patches/substitute/brands | **Stronger** |
| Schema integrity (PDP reviews) | Fail (47 vs 3) | **Pass** |
| Brands ranking URL crawlable | Blocked (noindex/301) | **Pass** (after today’s redirect fix) |
| Sitemap hygiene | Truth URL still listed | **Truth URL removed** |

### What Google still cannot “know” until post-deploy data

- Whether CTR actually rises (titles/meta).
- Whether greens/banned impressions consolidate onto new targets.
- Whether CW and Rosabella stop splitting “moringa chemist warehouse” clicks.
- Whether brands-comparison earns “best brand” queries vs choose-guide historical strength.

**Answer:** **Architecture is clear enough for Google to assign owners.** Ranking confirmation needs crawl + 2–4 weeks of GSC.

---

## 7. Cluster deep-dive (new vs old)

### A. Patches
- **Old:** #1 traffic, weak cites, promo-heavy, ~3 inlinks, brands buried in title.  
- **New:** Citable BLUF, one CTA, brand-front title, 11 inlinks, FAQ↔schema.  
- **Cannibalization:** Not created; berberine remains support.  
- **Google owner:** Clear.

### B. CW / Rosabella / brands
- **Old:** 4–5 overlapping pages; brands orphan/noindex.  
- **New:** Three live jobs (CW / Rosabella / brands table) + choose checklist; legacies 301 to brands.  
- **Sprint bug:** brands 301→choose while indexed — **fixed in re-audit**.  
- **Residual:** Body overlap CW↔Rosabella; monitor GSC query→page mapping.

### C. Banned
- **Old:** Two ranking URLs.  
- **New:** One.  
- **Google owner:** Clear.

### D. Greens / AG1 / spirulina
- **Old:** 410 greens still ranking.  
- **New:** Equity → spirulina; AG1 separate.  
- **Google owner:** Clear if AG1 titles stay AG1-specific.

### E. Coffee
- **Old:** Sprawl, mixed Melbourne/adrenal intent.  
- **New:** Caffeine comparison focused.  
- **Google owner:** Clear for “moringa vs coffee / caffeine.”

### F. PDP
- **Old:** Schema lie; thin proof.  
- **New:** Honest reviewCount; CoA + CW table + links.  
- **Watch:** Don’t let PDP outrank CW for investigation queries (unlikely at pos ~22, but keep CW blog as the investigation destination).

---

## 8. What improved vs what did not

### Improved (evidence in codebase)
- Redirect intent matching  
- Banned consolidation  
- Greens recovery path  
- Patches EEAT + CTR packaging + links  
- Orphan unlock (substitute, brands)  
- PDP review integrity  
- Coffee focus  
- Cluster cross-links + `llms.txt` updates  

### Not proven yet (needs GSC post-deploy)
- CTR lifts on shelf-life / taste / curry / patches brand title  
- Position gains on PDP  
- Impression consolidation off old greens/banned URLs  

### Still open (non-photo)
- Soft CW↔Rosabella body overlap  
- Taste vs how-to-add recipe duplication  
- 80+ low-traffic blogs not re-audited for quality  
- Optional: coffee LocalBusiness schema noise  
- Real additional reviews (acquisition)  

### Explicitly skipped (per instruction)
- Proof photos / video on patches & CW  

---

## 9. Final answers (short)

1. **New cannibalization?** One serious redirect conflict was created during fixes; **fixed in this re-audit**. Soft overlaps remain but are smaller than the old hard duplicates.  
2. **Internal linking?** **Yes — improved**, especially patches, substitute, brands, CW.  
3. **Own purpose?** **Yes for priority commercial pages**; not for the entire blog corpus.  
4. **Duplicate intents?** **Hard duplicates largely gone**; soft duplicates remain at Med/Low.  
5. **Google clarity?** **Architecture yes; rankings TBD after deploy + crawl.**

---

## 10. Deploy checklist (before celebrating)

1. Deploy `_redirects` (brands self-serve + banned/greens/CW fixes).  
2. Request indexing for: patches, CW, brands-comparison, spirulina, banned survivor, PDP.  
3. In GSC (2–4 weeks): Page×Query for CW vs Rosabella; brands vs choose; greens impressions on spirulina.  
4. Confirm no remaining internal links to `is-moringa-banned-australia-truth-2026` (except redirects).  
5. Optional next content pass: trim Rosabella CW-heavy paragraphs; split taste vs add recipe depth.

---

**Report files**  
- Old baseline: `MASTER-SEO-AI-EEAT-AUDIT-REPORT-2026-07-22.md`  
- This re-audit: `POST-FIX-REAUDIT-NEW-VS-OLD-2026-07-22.md`
