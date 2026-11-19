# Money-blog CTR and duplicate cleanup — local review

**Review status:** originally local-only; the user authorized publication after reviewing this report on 19 November 2026. The seven pages were rebuilt from editable sources through `storefront/build.mjs`. No URL, redirect, noindex rule, homepage, product price, Meta Pixel, bundle card or subscription/waitlist was changed by this cleanup.

## What changed

- Kept one short answer and one primary sales CTA per article. Removed duplicate summary boxes and repeated sales blocks; kept the kids GP disclaimer above its short answer.
- Kept the original kids dosage table and its amounts verbatim. Its nutrition table is separate and remains; there is only one dosage table.
- Removed full price-per-100g comparison tables from the seven pages. Format, nutrition and storage tables remain where useful; every page links to the best-brands comparison.
- Every page has a body link to the moringa product page. Taste has exactly one product link and exactly one capsules-vs-powder link, and is shorter.
- Rosabella and Coles title fixes were already present and were retained, including the ranking how-to-choose slug.
- Capsules title, H1 and meta include the full requested worked example. This makes the title unusually long; it follows the supplied wording rather than silently shortening it.
- Blog prices remain 100g $11, 200g $22, 400g $40 / $10 per 100g. Blog copy uses “pouch”, not “bundle”, for 400g. A stale hardcoded best-brands source sentence now reads these values from the existing product catalogue; the best-brands page itself was not rebuilt.
- Preserved the competitor checks as 9 Nov 2026: Rosabella $52 / about $217 per 100g; Chemist Warehouse $79 / about $132 per 100g. No new price-check or publication dates were invented.
- Removed the Ashwagandha page’s promotional recommendations to choose products for symptoms and its unqualified claim that combining them is generally safe. The comparison now focuses on formats, label checks and GP/pharmacist advice. Safety reference: [NCCIH](https://www.nccih.nih.gov/health/ashwagandha).

## Shelf-life and kids metadata: old → new

### Shelf life

**Title — old:** How Long Does Moringa Powder Last? Shelf Life, Expiry & Storage in Australia

**Title — new:** How Long Does Moringa Powder Last? 1 Year Once Opened, Shelf Life & Storage Australia

**H1 — old:** How long does moringa powder last?

**H1 — new:** How Long Does Moringa Powder Last? 1 Year Once Opened

**Meta description — old:** Does moringa powder expire? Yes. Use the best-before date unopened, and about a year once opened if you know how to store it cool, dry and dark.

**Meta description — new:** How long does moringa powder last? NutriThrive keeps for 1 year once opened, sealed cool and dry. Shelf life and storage in Australia; 100g $11.

### Kids

**Title — old:** Is Moringa Safe for Children? Kids Dosage & Safety Guide Australia

**Title — new:** Is Moringa Safe for Children? Kids Dosage & Safety Guide Australia *(unchanged)*

**H1 — old:** Is moringa safe for kids? Amounts by age and when to ask your GP

**H1 — new:** Is Moringa Safe for Children? Kids Dosage & Safety Guide Australia

**Meta description — old:** Is moringa safe for children? Keep it to small amounts of leaf powder in food, and talk to your GP before you give it. A parent guide for Australia.

**Meta description — new:** Is moringa safe for children? Talk to your GP before using leaf powder. Kids dosage and safety guide for Australia; product details from $11/100g.

## Counts and checks

| Blog | Visible $11 mentions before | After | Short answers after |
|---|---:|---:|---:|
| Shelf life | 7 | 3 | 1 |
| Kids | 2 | 1 | 1 |
| Rosabella | 16 | 8 | 1 |
| Coles | 12 | 4 | 1 |
| Capsules vs powder | 19 | 7 | 1 |
| Taste | 4 | 2 | 1 |
| Ashwagandha | 3 | 2 | 1 |

Passed:

- `STOREFRONT_PRODUCTION=1 STOREFRONT_MONEY_BLOGS_ONLY=1 node storefront/build.mjs`
- `node scripts/verify-money-blogs.mjs` — metadata, keyword coverage, one answer, CTA limits, internal links, price language, unchanged dosage table, shelf-life anchors, JSON-LD and local images.
- Scoped rebuild hash comparison: no writes outside the seven article outputs. Repeated scoped builds are idempotent.
- `node scripts/verify-storefront-migration.mjs` — updated only the explicit seven-page metadata approval set.
- `npm run seo:audit` — no structural errors across the current 90 sitemap URLs, including the other chat’s new hair article.
- Browser checks on all seven at 390px: no horizontal overflow, no broken images, no console errors observed.
- Original Article/BlogPosting publication and modification dates remain unchanged on all seven.
- Whitespace checks on this task’s files pass. Unrelated generated changes from the other publishing chat are kept separate.

Shelf-life anchors retained: `#how-long`, `#signs-expired`, `#fridge-or-cupboard`, `#store-au`, `#does-moringa-powder-expire`.

## Requested yes/no status

| Check | Yes/No | Evidence |
|---|---|---|
| Patches page still live | **Yes** | Read-only HTTP check returned 200; index/follow remains. |
| Patches page completely unchanged live | **No** | The separate hair-growth release added one autogenerated related-guide link. Title, H1 and editorial prose are unchanged. This cleanup did not publish that change; its local protected file has been restored to the task-start bytes. |
| Homepage still has the old hero | **Yes** | Homepage is byte-identical to the start of this task. |
| Product page still has no bundle cards or waitlist | **Yes** | Product HTML is byte-identical to task start; no bundle-card or subscription/waitlist block is present. |
| Protected noindexed blogs and Diwali hampers untouched by this cleanup | **Yes** | Restored incidental output from the other job; all protected files now match task-start bytes. The current generator lists 41 noindex slugs, so all 41 were preserved, covering the requested 12. |

## Coordination with the other blog chat

The user authorized coordination with **Add moringa hair growth blog**. That chat confirmed its release used an isolated directory and excluded this seven-blog cleanup. Its new hair article, shared article catalogue, search/index/category and sitemap changes were preserved. Incidental generated changes on protected pages were restored after coordination. These unrelated files are not included in the task file list below. `storefront/build.mjs` is shared: its hair-article metadata entry was preserved alongside this task’s changes.

## Every file changed by this task

19 files, including this report:

- [storefront/build.mjs](/Users/neervasa/Desktop/Website/storefront/build.mjs)
- [storefront/content/money-blogs.json](/Users/neervasa/Desktop/Website/storefront/content/money-blogs.json)
- [scripts/verify-money-blogs.mjs](/Users/neervasa/Desktop/Website/scripts/verify-money-blogs.mjs)
- [scripts/verify-storefront-migration.mjs](/Users/neervasa/Desktop/Website/scripts/verify-storefront-migration.mjs)
- [storefront/content/money-blogs/how-long-does-moringa-powder-last-storage-shelf-life-2026.html](/Users/neervasa/Desktop/Website/storefront/content/money-blogs/how-long-does-moringa-powder-last-storage-shelf-life-2026.html)
- [storefront/content/money-blogs/is-moringa-safe-for-children-kids-dosage-2026.html](/Users/neervasa/Desktop/Website/storefront/content/money-blogs/is-moringa-safe-for-children-kids-dosage-2026.html)
- [storefront/content/money-blogs/rosabella-moringa-reviews-legit-or-overhyped-2026.html](/Users/neervasa/Desktop/Website/storefront/content/money-blogs/rosabella-moringa-reviews-legit-or-overhyped-2026.html)
- [storefront/content/money-blogs/how-to-choose-moringa-powder-australia-2026.html](/Users/neervasa/Desktop/Website/storefront/content/money-blogs/how-to-choose-moringa-powder-australia-2026.html)
- [storefront/content/money-blogs/moringa-capsules-vs-powder-which-is-better-2026.html](/Users/neervasa/Desktop/Website/storefront/content/money-blogs/moringa-capsules-vs-powder-which-is-better-2026.html)
- [storefront/content/money-blogs/what-does-moringa-powder-taste-like-honest-guide-2026.html](/Users/neervasa/Desktop/Website/storefront/content/money-blogs/what-does-moringa-powder-taste-like-honest-guide-2026.html)
- [storefront/content/money-blogs/moringa-vs-ashwagandha-comparison-2026.html](/Users/neervasa/Desktop/Website/storefront/content/money-blogs/moringa-vs-ashwagandha-comparison-2026.html)
- [site/blog/how-long-does-moringa-powder-last-storage-shelf-life-2026.html](/Users/neervasa/Desktop/Website/site/blog/how-long-does-moringa-powder-last-storage-shelf-life-2026.html)
- [site/blog/is-moringa-safe-for-children-kids-dosage-2026.html](/Users/neervasa/Desktop/Website/site/blog/is-moringa-safe-for-children-kids-dosage-2026.html)
- [site/blog/rosabella-moringa-reviews-legit-or-overhyped-2026.html](/Users/neervasa/Desktop/Website/site/blog/rosabella-moringa-reviews-legit-or-overhyped-2026.html)
- [site/blog/how-to-choose-moringa-powder-australia-2026.html](/Users/neervasa/Desktop/Website/site/blog/how-to-choose-moringa-powder-australia-2026.html)
- [site/blog/moringa-capsules-vs-powder-which-is-better-2026.html](/Users/neervasa/Desktop/Website/site/blog/moringa-capsules-vs-powder-which-is-better-2026.html)
- [site/blog/what-does-moringa-powder-taste-like-honest-guide-2026.html](/Users/neervasa/Desktop/Website/site/blog/what-does-moringa-powder-taste-like-honest-guide-2026.html)
- [site/blog/moringa-vs-ashwagandha-comparison-2026.html](/Users/neervasa/Desktop/Website/site/blog/moringa-vs-ashwagandha-comparison-2026.html)
- [docs/reports/money-blogs-ctr-review-2026-11-19.md](/Users/neervasa/Desktop/Website/docs/reports/money-blogs-ctr-review-2026-11-19.md)

## Local review

[Shelf-life preview](http://localhost:4182/blog/how-long-does-moringa-powder-last-storage-shelf-life-2026) · [Kids preview](http://localhost:4182/blog/is-moringa-safe-for-children-kids-dosage-2026)

![Shelf-life mobile opening](/Users/neervasa/.codex/visualizations/2026/10/17/01a1483e-de83-77c3-a865-9195d4db3a96/money-shelf-life-mobile.jpg)

![Kids mobile opening](/Users/neervasa/.codex/visualizations/2026/10/17/01a1483e-de83-77c3-a865-9195d4db3a96/money-kids-mobile.jpg)

**Publication update:** After review, the user authorized pushing to main. The combined release passed full CI. It preserves the other chat’s hair article. Five protected stored snapshots were synchronized to that already-live release, and the production build now preserves protected blog snapshots. All 54 protected published outputs compare byte-for-byte equal with the existing live release; the seven reviewed blogs are the intended editorial changes. The original local-review file list above excludes the other chat’s publishing files and these publication-preservation snapshots.
