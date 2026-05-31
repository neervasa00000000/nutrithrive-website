#!/usr/bin/env node
/**
 * Publish blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025.html from v2 test template.
 * Run: node scripts/build-chemist-warehouse-blog.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SLUG = 'moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025';
const CANON = `https://nutrithrive.com.au/blog/${SLUG}`;
const testHtml = fs.readFileSync(
  path.join(ROOT, 'scripts/templates/v2/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025-test.html'),
  'utf8'
);

const pricingDisclosure = `
<h2 id="chemist-warehouse-prices">How Chemist Warehouse lists prices (and how we compare)</h2>
<p>On large pharmacy sites, the <strong>price for products displayed</strong> is often shown beside a <strong>recommended retail price</strong> (RRP). Those <strong>savings comparisons</strong> assume the <strong>listed sale price</strong> is below the <strong>supplier's recommended retail</strong> figure. Retailers such as Chemist Warehouse explain that <strong>Australian pharmacy transactions occurred</strong> for a <strong>product within the previous 2 months</strong> when they <strong>show RRP prices</strong> — if no sales <strong>occurred for that product</strong> in that window, an RRP line may not appear (their policy wording: transactions in the <strong>previous 2 months did not occur</strong>).</p>
<p>NutriThrive is different: this <strong>website is the supplier</strong>. Our <strong>products available online</strong> are sold only at nutrithrive.com.au. The <strong>price for the product</strong> at checkout is our actual <strong>listed sale price</strong> — we do not copy third-party <strong>retail price / RRP</strong> maths from pharmacy shelves. For lab PDFs, batch notes, or dosage detail, use the <strong>information</strong> links in this article (no pharmacy-style RRP banner).</p>
<p class="lead" style="font-size:1.1rem;line-height:1.75;margin:1.25rem 0;">If you searched <strong>moringa chemist warehouse</strong> or <strong>moringa capsules chemist warehouse</strong>, you are usually comparing shelf capsules (often Rosabella) with loose leaf powder. We bought a bottle in-store, opened capsules, and ran the same freshness checks we use on our own batches — then compared dose and daily cost at a realistic serving size.</p>
`;

let body = testHtml.match(/<div class="blog-v2-prose[\s\S]*?<\/div>\s*<\/div>\s*<section class="mt-20/s)?.[0];
if (!body) throw new Error('Could not extract blog-v2-prose block');

body = body.replace(/<div class="blog-v2-prose[^>]*>/, '<div class="blog-v2-prose max-w-none">');
body = body.replace(/<section class="mt-20[\s\S]*$/s, '');

const inner = body.match(/<article>[\s\S]*<\/article>/s)?.[0] || '';
let article = inner
  .replace(/<article>\s*<div class="blog-post-content">/, '<article><div class="blog-post-content">')
  .replace(
    /<p class="disclaimer"[\s\S]*?<\/p>\s*/,
    `<p class="disclaimer" style="border-top:0;padding-top:0;margin-top:0;"><strong>Disclaimer:</strong> NutriThrive is not affiliated with Chemist Warehouse or Rosabella. Product ranges change by store. General information only — not medical advice.</p>\n${pricingDisclosure}\n`
  );

const linkFixes = [
  [/href="science-shade-drying-vs-sun-drying-moringa-test\.html"/g, 'href="/blog/science-shade-drying-vs-sun-drying-moringa"'],
  [/href="moringa-powder-vs-capsules-which-one-actually-works-better-2026-test\.html"/g, 'href="/blog/moringa-capsules-vs-powder-which-is-better-2026"'],
  [/href="how-to-read-moringa-batch-codes-freshness-test\.html"/g, 'href="/blog/how-to-read-moringa-batch-codes-freshness"'],
  [/href="moringa-brands-comparison-australia-2026-test\.html"/g, 'href="/blog/best-superfoods-australia-comparison-health-conscious-adults"'],
  [/href="where-to-buy-moringa-in-australia-online-vs-stores-2026-guide-test\.html"/g, 'href="/blog/where-to-buy-moringa-in-australia-online-vs-stores-2026-guide"'],
  [/href="\.\.\/pages\/product-test\.html\?id=moringa-powder"/g, 'href="/products/moringa-powder/"'],
  [/href="where-to-buy-moringa-in-australia-online-vs-stores-2026-guide-test\.html"/g, 'href="/blog/where-to-buy-moringa-in-australia-online-vs-stores-2026-guide"'],
  [/href="smart-moringa-daily-intake-australia-visual-guide-2026-test\.html"/g, 'href="/blog/how-much-moringa-powder-per-day-dosage-guide-2026"'],
  [/href="how-to-add-moringa-to-diet-test\.html"/g, 'href="/blog/how-to-add-moringa-to-diet"'],
  [/href="quit-sugar-90-days-honest-diary-melbourne-2026-test\.html"/g, 'href="/blog/quit-sugar-90-days-honest-diary-melbourne-2026"'],
];

for (const [re, rep] of linkFixes) article = article.replace(re, rep);

article = article.replace(
  /<section class="nt-related-links-block"[\s\S]*?<\/section>/,
  `<section class="nt-related-links-block" style="max-width: 900px; margin: 2rem auto; padding: 1rem 1.25rem; border: 1px solid #e6efe9; border-radius: 12px; background: #f9fcfa;">
  <h2 style="font-size: 1.2rem; margin: 0 0 0.75rem; color: #175c36;">Related guides</h2>
  <ul style="margin: 0; padding-left: 1.1rem; display: grid; gap: 0.35rem;">
    <li><a href="/blog/moringa-capsules-vs-powder-which-is-better-2026">Moringa capsules vs powder</a></li>
    <li><a href="/blog/moringa-quality-test-shade-dried-vs-retail-australia-2026">Shade-dried vs retail quality test</a></li>
    <li><a href="/blog/science-shade-drying-vs-sun-drying-moringa">Shade vs sun drying</a></li>
    <li><a href="/blog/how-to-choose-moringa-powder-australia-2026">How to choose moringa in Australia</a></li>
    <li><a href="/products/moringa-powder/">Shop NutriThrive leaf powder</a></li>
  </ul>
</section>`
);

const title = 'Moringa Chemist Warehouse Capsules: Quality Test 2026 | NutriThrive';
const h1 = 'Moringa Chemist Warehouse &amp; Capsules: What We Found (2026)';
const desc =
  'Bought moringa capsules from Chemist Warehouse and compared them to NutriThrive powder: colour, dose, listed sale price vs RRP context, and lab transparency.';

const html = `<!DOCTYPE html>
<html class="scroll-smooth" lang="en-AU">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${title}</title>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  if (window.DeferLoader) {
    window.DeferLoader.deferUntilInteraction(function() {
      window.DeferLoader.loadScript('https://www.googletagmanager.com/gtag/js?id=G-WH21SW75WP', {
        async: true, crossorigin: 'anonymous'
      }).then(function() {
        gtag('js', new Date());
        gtag('config', 'G-WH21SW75WP', {'anonymize_ip': true, 'allow_google_signals': false});
      }).catch(function(err) { console.warn('[GA] Failed to load:', err); });
    }, { once: true, passive: true });
  }
</script>
<meta name="robots" content="index, follow"/>
<link rel="canonical" href="${CANON}"/>
<link rel="alternate" hreflang="en-AU" href="${CANON}"/>
<link rel="alternate" hreflang="x-default" href="${CANON}"/>
<meta name="description" content="${desc}"/>
<meta name="keywords" content="moringa chemist warehouse, moringa capsules chemist warehouse, Rosabella moringa, Chemist Warehouse moringa, moringa quality test australia"/>
<meta property="og:type" content="article"/>
<meta property="og:url" content="${CANON}"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${desc}"/>
<meta property="og:image" content="https://nutrithrive.com.au/assets/images/og/moringa-social-1200.png"/>
<meta property="article:published_time" content="2025-10-15T00:00:00+11:00"/>
<meta property="article:modified_time" content="2026-05-28T00:00:00+10:00"/>
<script type="application/ld+json">{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Moringa Chemist Warehouse & Capsules: What We Found (2026)",
  "description": ${JSON.stringify(desc)},
  "datePublished": "2025-10-15",
  "dateModified": "2026-05-28",
  "author": {"@type": "Organization", "name": "NutriThrive"},
  "publisher": {"@type": "Organization", "name": "NutriThrive", "logo": {"@type": "ImageObject", "url": "https://nutrithrive.com.au/assets/images/logo/LOGO.webp"}},
  "mainEntityOfPage": {"@type": "WebPage", "@id": "${CANON}"}
}</script>
<link rel="icon" href="/assets/images/logo/LOGO.webp"/>
<link rel="stylesheet" href="/blog/blog-v2-prose.min.css"/>
<link rel="stylesheet" href="/shared/css/author-bio.min.css"/>
<link rel="stylesheet" href="/assets/css/design-system.min.css"/>
<link rel="stylesheet" href="/shared/css/v2-extra.min.css"/>
<link rel="stylesheet" href="/assets/css/tailwind-v2.min.css"/>
<script src="/scripts/global/defer-loader.min.js"></script>
<script src="/scripts/global/reddit-pixel.min.js"></script>
<style>
.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
.recall-box { background:#fff8e6; border:2px solid #e6b800; border-radius:10px; padding:1.25rem 1.5rem; margin:1.5rem 0; }
.reddit-quote { background:#f5f5f5; border-left:4px solid #ff4500; padding:1rem 1.25rem; margin:1rem 0; font-style:italic; }
.reddit-quote cite { display:block; margin-top:0.5rem; font-style:normal; font-size:0.9rem; color:#666; }
.two-col { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin:1.5rem 0; }
@media (max-width:640px) { .two-col { grid-template-columns:1fr; } }
.two-col .card { border:1px solid #e0e0e0; border-radius:10px; padding:1rem 1.25rem; }
.pro { color:#175c36; font-weight:700; }
.con { color:#c0392b; font-weight:700; }
</style>
</head>
<body class="bg-background text-on-background font-body-md overflow-x-hidden nt-blog-article">
<div class="nt-sticky-top">
<div class="nt-promo-bar">⏰ Order before 2pm for same-day Melbourne dispatch • 🚚 Free shipping over $80</div>
<header id="nt-header" class="nt-v2-header"></header>
</div>
<nav class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-4 pb-2 text-label-sm" aria-label="Breadcrumb">
<a class="text-moringa-leaf hover:underline" href="/blog/">← Journal</a>
</nav>
<main class="pt-6 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop nt-blog-main">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
<article class="lg:col-span-8">
<header class="mb-12">
<div class="flex flex-wrap items-center gap-2 mb-4">
<span class="bg-primary-fixed/30 text-moringa-leaf px-3 py-1 rounded-full font-label-sm uppercase tracking-wider font-bold">Research Guide</span>
<span class="text-on-surface-variant text-label-lg">15 October 2025</span>
<span class="text-on-surface-variant text-label-lg">· 14 min read</span>
</div>
<h1 class="font-display text-headline-lg md:text-display text-forest-deep mb-4 leading-tight">${h1}</h1>
<p class="text-on-surface-variant text-body-md mb-8"><strong>Last updated:</strong> 28 May 2026</p>
<div class="w-full aspect-[16/9] rounded-xl overflow-hidden mb-12 shadow-sm bg-surface-container">
<img alt="Moringa chemist warehouse capsules compared to NutriThrive green powder" class="w-full h-full object-cover" src="/assets/images/product_photos/moringa.jpeg" width="1200" height="630" loading="eager" decoding="async" fetchpriority="high"/>
</div>
</header>
<div class="blog-v2-prose max-w-none">
${article}
</div>
</article>
<aside class="lg:col-span-4 space-y-12">
<div class="bg-pure-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
<div class="aspect-square bg-surface-container relative">
<img alt="NutriThrive Moringa Powder" class="w-full h-full object-cover" src="/assets/images/product_photos/moringa.jpeg" loading="lazy"/>
<div class="absolute top-4 right-4 bg-terracotta-clay text-pure-white px-3 py-1 rounded-lg text-label-sm">Best Seller</div>
</div>
<div class="p-6">
<h4 class="font-headline-md text-forest-deep mb-2">Premium Moringa Powder</h4>
<p class="text-on-surface-variant font-body-md mb-6">Shade-dried, lab-tested, Melbourne.</p>
<div class="nt-blog-sidebar-price flex items-baseline gap-1 mb-6">
<span class="text-2xl font-bold text-moringa-leaf leading-none">$11.00</span>
<span class="text-sm text-on-surface-variant">/100g</span>
</div>
<a class="block w-full text-center bg-terracotta-clay text-pure-white py-4 rounded-lg font-label-lg hover:scale-[1.02] transition-transform" href="/products/moringa-powder/">Shop Moringa</a>
</div>
</div>
<div class="space-y-6">
<h3 class="font-headline-md text-forest-deep border-b-2 border-primary-fixed pb-2">Related Guides</h3>
<div class="space-y-4">
<a class="group flex gap-4 items-center" href="/blog/moringa-capsules-vs-powder-which-is-better-2026">
<div class="w-20 h-20 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
<img alt="" class="w-full h-full object-cover" src="/assets/images/product_photos/moringa.jpeg" loading="lazy"/>
</div>
<div><h5 class="font-label-lg text-forest-deep group-hover:text-moringa-leaf">Capsules vs powder</h5></div>
</a>
<a class="group flex gap-4 items-center" href="/blog/moringa-quality-test-shade-dried-vs-retail-australia-2026">
<div class="w-20 h-20 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
<img alt="" class="w-full h-full object-cover" src="/assets/images/product_photos/moringa.jpeg" loading="lazy"/>
</div>
<div><h5 class="font-label-lg text-forest-deep group-hover:text-moringa-leaf">Retail quality test</h5></div>
</a>
</div>
</div>
</aside>
</div>
</main>
<div id="nt-footer"></div>
<script src="/shared/site-data.min.js"></script>
<script src="/scripts/global/cart.min.js"></script>
<script src="/shared/js/cart-v2-ui.min.js"></script>
<script src="/shared/js/footer-v2.min.js"></script>
<script src="/shared/js/author-bio.min.js"></script>
<script src="/shared/js/layout-v2.min.js"></script>
<script src="/shared/js/v2-site.min.js"></script>
</body>
</html>
`;

const out = path.join(ROOT, 'blog', `${SLUG}.html`);
fs.writeFileSync(out, html);
console.log('Wrote', out);
