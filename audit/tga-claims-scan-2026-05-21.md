# TGA Claims Scan — NutriThrive (21 May 2026)

**Scope:** 42 live blog posts + key product pages  
**Standard:** Therapeutic Goods Advertising Code; food-supplement positioning (no treat/cure/prevent/diagnose); no invented enforcement stories or customer outcomes  
**Method:** Pattern scan for medicinal claims, drug comparisons, guaranteed outcomes, dosing advice, unverified TGA fines

---

## Executive summary

| Severity | Count | Status |
|----------|------:|--------|
| CRITICAL | 5 | Remediated in this pass |
| HIGH | 3 | Remediated in this pass |
| MEDIUM | 12+ | Ongoing (YMYL lifestyle cluster, comparison posts) |

**Top risks found:** Accutane-alternative / skin-cure framing; NSAID replacement ("Stop Voltaren"); arthritis superiority (DAS28, "fights arthritis"); guaranteed weight-loss numbers; "fixed" fatigue with thyroid dosing narrative; curry-leaves prevent/treat disease claims; unverified "TGA fined May 2026" specificity.

**Remediation pattern:** Soften titles/meta/schema; personal diary + results vary; GP/dermatologist referral; prominent TGA disclaimer (body + `author-bio.js` global block); food-nutrition language only; remove drug superiority tables; generalise enforcement anecdotes unless publicly sourced.

---

## Priority remediation table

| P | File | Issue class | Action |
|---|------|-------------|--------|
| 1 | `blog/cystic-acne-gut-healing-what-actually-cleared-skin-2026.html` | Drug alternative, cure % | Remove Accutane framing; dermatologist + TGA disclaimer; founder note |
| 2 | `blog/moringa-powder-victoria-seniors-joint-health.html` | NSAID replace, arthritis treat | Food nutrition; GP for arthritis/meds; remove DAS28 superiority |
| 3 | `blog/cant-lose-weight-broken-gut-what-actually-worked-2026.html` | Guaranteed kg loss | Diary framing; soften 18kg/82→64 in meta/schema/body |
| 4 | `blog/chronic-fatigue-what-actually-fixed-it-2026.html` | "Fixed", thyroid dosing | "What helped my energy"; GP for thyroid/iron; anecdote disclaimers |
| 5 | `blog/nutrithrive-dried-curry-leaves-tradition-health.html` | prevent/treat Yes claims | Food-standard language; TGA disclaimer |
| 6 | `blog/cortisol-belly-fat-couldnt-lose-stomach-melbourne-2026.html` | 6cm/8wk, adaptogen | Personal "may help"; soften measurements |
| 7 | `blog/best-superfoods-australia-comparison-health-conscious-adults.html` | diabetes breakthrough, galactagogue | Food/traditional framing; fix dead internal links |
| 8 | `blog/is-moringa-banned-australia-truth-2026.html` | Unverified fine detail | Generalise to "enforcement for false claims" |
| 9 | `products/moringa-powder/index.html` | celiac disease claim | "gluten-free diet" wording |

---

## Representative findings (sample rows)

See `audit/tga-claims-scan-2026-05-21.tsv` for machine-readable rows.

| File | Excerpt / pattern | Severity | Fix |
|------|-------------------|----------|-----|
| cystic-acne… | H1 "(Not Accutane)", "90% clear", "You don't need Accutane" | CRITICAL | Diary + dermatologist; remove cure % |
| seniors-joint… | "Stop Taking Voltaren", "Fights Arthritis", DAS28 superiority | CRITICAL | Nutrition support; GP for pain meds |
| cant-lose-weight… | "18kg in 6 months", 82→64 schema | CRITICAL | "significant weight change"; results vary |
| chronic-fatigue… | "Fixed It", low-dose thyroid medication | CRITICAL | "What helped"; GP-only thyroid |
| curry-leaves… | "prevent anaemia/night blindness/infection" | CRITICAL | "contains iron/vitamin A"; food only |
| cortisol-belly… | "lost 6cm in 8 weeks", adaptogen claims | HIGH | Personal anecdote; no guaranteed cm |
| best-superfoods… | "Diabetes Management Breakthrough", galactagogue | HIGH | Traditional/food framing |
| is-moringa-banned… | "One brand fined May 2026" (unsourced) | HIGH | Generic TGA advertising enforcement |

---

## Humanization batch (posts #4–10)

| Post | Founder note | Dead links |
|------|:------------:|:----------:|
| moringa-side-effects | Done | Fixed |
| what-does-moringa-do | Done | Fixed |
| verify-moringa-quality | Done | Fixed |
| moringa-capsules-vs-powder | Done | Fixed |
| where-to-buy | Done | Fixed |
| how-to-choose-moringa | Done | Fixed |
| moringa-melbourne-complete-guide | Done | Fixed (brands → how-to-choose) |

---

*Generated: 21 May 2026. Re-scan after bulk content edits.*
