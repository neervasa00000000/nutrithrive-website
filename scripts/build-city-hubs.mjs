#!/usr/bin/env node
/**
 * Build city hubs using Verdant-structure layout (NutriThrive brand).
 * Unique local angle per city — no multi-city body lists.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const CITIES = [
  {
    slug: 'moringa-sydney',
    city: 'Sydney',
    state: 'NSW',
    stateCode: 'AU-NSW',
    geo: { placename: 'Sydney NSW', pos: '-33.8688;151.2093', icbm: '-33.8688, 151.2093' },
    title: 'Moringa Powder Sydney | Lab-Tested | NutriThrive',
    description:
      'Shade-dried moringa from $11/100g, NMI tested. Ships from Melbourne to Sydney metro in 2–4 days. Free shipping $80+.',
    delivery: '2–4 business days',
    util: 'Order before 2pm · Sydney metro usually 2–4 days · Free shipping over $80',
    eyebrow: 'Sydney · Ships from Truganina',
    h1: 'Moringa powder<br>for <em>Sydney</em>',
    lead:
      'NMI lab-tested leaf, packed in Melbourne. <strong>Order by 2pm</strong> for same-day dispatch — most Sydney metro addresses in <strong>2–4 business days</strong>.',
    floatKicker: 'Visible quality',
    floatTitle: 'Loose leaf',
    floatText: 'Powder you can see and smell — not opaque capsules.',
    tipTitle: 'Why order direct in Sydney',
    tipBody:
      'Most Sydney retailers stock capsules only. NutriThrive is shade-dried leaf with a batch lab summary on every lot — from $11/100g.',
    faqs: [
      { q: 'How long to Sydney?', a: 'Same-day dispatch from Melbourne before 2pm on business days. Most Sydney metro postcodes: 2–4 business days.' },
      { q: 'Shop in Sydney?', a: 'No retail store — we pack at 15 Europe Street, Truganina VIC and ship Australia-wide.' },
      { q: 'Best value?', a: 'The 3+1 bundle ($35, 400g) ships free — about $0.26/day. Under $80, shipping is $9.69.' },
      { q: 'Any safety tip for capsules?', a: 'If you buy any capsule brand, always check the lot number against current recall notices before use, and ask the seller for a batch lab summary when available. We sell leaf powder with NMI screening.' },
    ],
    review: {
      quote: "I've been using this Moringa powder for a month now, and I can honestly feel the difference! My energy levels have improved.",
      name: 'chizaram olanma',
    },
    guides: [
      { href: '/blog/how-to-choose-moringa-powder-australia-2026', label: 'How to choose moringa powder' },
      { href: '/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025', label: 'Chemist Warehouse vs NutriThrive' },
    ],
    highlightBundle: false,
  },
  {
    slug: 'moringa-brisbane',
    city: 'Brisbane',
    state: 'QLD',
    stateCode: 'AU-QLD',
    geo: { placename: 'Brisbane QLD', pos: '-27.4705;153.0260', icbm: '-27.4705, 153.0260' },
    title: 'Moringa Powder Brisbane | Shade-Dried | NutriThrive',
    description:
      'Shade-dried moringa from $11/100g, NMI tested. Brisbane metro usually 2–4 days from Melbourne. Free shipping $80+.',
    delivery: '2–4 business days',
    util: 'Order before 2pm · Brisbane metro usually 2–4 days · Free shipping over $80',
    eyebrow: 'Brisbane · Ships from Truganina',
    h1: 'Moringa powder<br>for <em>Brisbane</em>',
    lead:
      'Packed in Melbourne, delivered across SEQ. <strong>Order by 2pm</strong> — Brisbane metro typically <strong>2–4 business days</strong>. Free shipping over $80.',
    floatKicker: 'QLD climate',
    floatTitle: 'Seal tight',
    floatText: 'Humid kitchens: keep the pouch sealed after opening.',
    tipTitle: 'Storage tip for humid QLD',
    tipBody:
      'Once open, keep the pouch sealed away from the stove. Refrigerate in wet season (Nov–Mar). <a href="/blog/how-long-does-moringa-powder-last-storage-shelf-life-2026">Full storage guide</a>.',
    faqs: [
      { q: 'How long to Brisbane?', a: 'Same-day Melbourne dispatch before 2pm. Brisbane metro, Gold Coast and Sunshine Coast: usually 2–4 business days.' },
      { q: 'Shop in Brisbane?', a: 'No — we ship from Truganina, Melbourne to all QLD postcodes. No Brisbane pickup.' },
      { q: 'Cheapest way to order?', a: '3+1 bundle ($35, 400g) ships free. Single 100g is $11 + $9.69 if under $80.' },
      { q: 'Why is powder clumping?', a: 'Humidity moisture, not a defect. Seal tightly and refrigerate in wet season. Warm the bag before opening.' },
    ],
    review: {
      quote: 'Tried Moringa powder daily for 30 days. Helps with bloating and slight increase in stamina. good natural supplement.',
      name: 'Bindu',
    },
    guides: [
      { href: '/blog/how-long-does-moringa-powder-last-storage-shelf-life-2026', label: 'Storage in humid climates' },
      { href: '/blog/grow-moringa-tree-australia', label: 'Growing moringa in QLD' },
    ],
    highlightBundle: false,
  },
  {
    slug: 'moringa-perth',
    city: 'Perth',
    state: 'WA',
    stateCode: 'AU-WA',
    geo: { placename: 'Perth WA', pos: '-31.9505;115.8605', icbm: '-31.9505, 115.8605' },
    title: 'Moringa Powder Perth | Ships from Melbourne | NutriThrive',
    description:
      'NMI-tested moringa from $11/100g. Perth metro typically 3–5 days from Melbourne. Free shipping on the 3+1 bundle.',
    delivery: '3–5 business days',
    util: 'Order before 2pm · Perth metro usually 3–5 days · Bundle ships free',
    eyebrow: 'Perth · Ships from Truganina',
    h1: 'Moringa powder<br>for <em>Perth</em>',
    lead:
      'Furthest capital from our warehouse — still tracked Australia Post. <strong>Order by 2pm</strong> for same-day dispatch. Perth metro: <strong>3–5 business days</strong>.',
    floatKicker: 'Ship smarter',
    floatTitle: 'Bundle free',
    floatText: '3+1 at $35 ships free — skip repeat freight.',
    tipTitle: 'Why Perth buyers order the bundle',
    tipBody:
      'Loose powder is scarce in WA retail. The 3+1 ($35, 400g) ships free and lasts ~4 months at 1 tsp/day — fewer cross-country parcels.',
    faqs: [
      { q: 'How long to Perth?', a: '3–5 business days to most Perth metro postcodes. Regional WA: 6–9 days. Express Post available at checkout.' },
      { q: 'Shop in Perth?', a: 'No WA store. All orders pack at 15 Europe Street, Truganina VIC.' },
      { q: 'Why slower than the east coast?', a: 'Perth is ~2,700 km from our Melbourne warehouse — Australia Post standard times reflect that.' },
      { q: 'Best value for Perth?', a: '3+1 bundle ($35) ships free — best way to avoid paying freight on every reorder.' },
    ],
    review: {
      quote: 'The powder from Nutri-Thrive is the greenest in color and tastes way better than other moringa. Pricing is reasonable and shipping was quick!!',
      name: 'Jay Turakhia',
    },
    guides: [
      { href: '/blog/how-to-choose-moringa-powder-australia-2026', label: 'How to choose quality moringa' },
      { href: '/pages/shipping/shipping-returns.html', label: 'Shipping times & free shipping' },
    ],
    highlightBundle: true,
  },
  {
    slug: 'moringa-adelaide',
    city: 'Adelaide',
    state: 'SA',
    stateCode: 'AU-SA',
    geo: { placename: 'Adelaide SA', pos: '-34.9285;138.6007', icbm: '-34.9285, 138.6007' },
    title: 'Moringa Powder Adelaide | Lab-Tested | NutriThrive',
    description:
      'Shade-dried moringa from $11/100g with NMI batch tests. Adelaide metro usually 2–4 days. Free shipping $80+.',
    delivery: '2–4 business days',
    util: 'Order before 2pm · Adelaide metro usually 2–4 days · Free shipping over $80',
    eyebrow: 'Adelaide · Ships from Truganina',
    h1: 'Moringa powder<br>for <em>Adelaide</em>',
    lead:
      'Clear pricing, batch lab summaries, shade-dried leaf. <strong>Order by 2pm</strong> — Adelaide metro usually <strong>2–4 business days</strong> from Melbourne.',
    floatKicker: 'Lab-backed',
    floatTitle: 'Batch PDF',
    floatText: 'NMI screening on every lot — summary on the product page.',
    tipTitle: 'Quality you can assess',
    tipBody:
      'Adelaide shops mostly sell capsules. Our powder is vivid green, leaf-only, and priced from $11/100g with batch summaries online.',
    faqs: [
      { q: 'How long to Adelaide?', a: 'Same-day Melbourne dispatch before 2pm. Adelaide metro: 2–4 business days. Regional SA may add a day or two.' },
      { q: 'Shop in Adelaide?', a: 'Online only — packed in Truganina VIC. We ship to all SA postcodes.' },
      { q: 'Cheapest order?', a: '3+1 bundle ($35, 400g) ships free. Otherwise $11/100g + $9.69 under $80.' },
      { q: 'How do Adelaide orders ship?', a: 'We pack in Truganina, Melbourne and ship Australia Post to Adelaide. Metro is usually 2–4 business days when you order before 2pm for same-day dispatch. Free shipping on Australian orders $80+.' },
    ],
    review: {
      quote: 'This product is healthy, of excellent quality, and very affordable. Highly recommend!',
      name: 'reetysha ramjee',
    },
    guides: [
      { href: '/blog/how-to-choose-moringa-powder-australia-2026', label: "Moringa buyer's guide" },
      { href: '/blog/moringa-brands-comparison-australia-2026', label: 'Moringa brands compared' },
    ],
    highlightBundle: false,
  },
];

function locNav(active) {
  return `<nav class="city-loc" aria-label="Deliver to">
  <span class="city-loc__label">Deliver to</span>
  <ul class="city-loc__list">
    ${[
      ['melbourne', '/melbourne/', 'Melbourne'],
      ['moringa-sydney', '/moringa-sydney/', 'Sydney'],
      ['moringa-brisbane', '/moringa-brisbane/', 'Brisbane'],
      ['moringa-perth', '/moringa-perth/', 'Perth'],
      ['moringa-adelaide', '/moringa-adelaide/', 'Adelaide'],
    ]
      .map(([id, href, label]) => {
        const on = id === active;
        return `<li><a href="${href}" class="city-loc__link${on ? ' is-active' : ''}"${on ? ' aria-current="page"' : ''}>${label}</a></li>`;
      })
      .join('\n    ')}
  </ul>
</nav>`;
}

function faqSchema(faqs) {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') },
      })),
    },
    null,
    2
  );
}

function pageHtml(c, head) {
  const faqs = c.faqs
    .map(
      (f, i) => `<details${i === 0 ? ' open' : ''}>
      <summary>${f.q}</summary>
      <p>${f.a}</p>
    </details>`
    )
    .join('\n');
  const guides = c.guides.map((g) => `<li><a href="${g.href}">${g.label}</a></li>`).join('\n');
  const bundleRow = c.highlightBundle
    ? `<tr><td>3+1 Bundle 400g</td><td class="amt">$35</td><td>Free</td></tr>`
    : `<tr><td>3+1 Bundle 400g</td><td class="amt">$35</td><td>Free</td></tr>`;

  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
${head}
</head>
<body class="non-sticky-header city-hub-body">
<header>
<div class="navbar">
<a class="logo" href="/">
<img alt="NutriThrive Logo" decoding="async" loading="lazy" src="/assets/images/logo/LOGO-120.webp" style="max-width:50px;max-height:50px;width:auto;height:auto;object-fit:contain;">
NutriThrive
</a>
<nav class="nav-links">
<a href="/">Home</a>
<a href="/products/">Products</a>
<a href="/about">About</a>
<a href="/contact">Contact</a>
<a href="/blog/">Blog</a>
</nav>
</div>
</header>

<div class="city-util" role="status"><p>${c.util}</p></div>

<main class="city-hub">
${locNav(c.slug)}

<header class="city-hub-hero">
  <div>
    <p class="city-hub-eyebrow">${c.eyebrow}</p>
    <h1 class="city-hub-title">${c.h1}</h1>
    <p class="city-hub-lead">${c.lead}</p>
    <div class="city-hub-actions">
      <a class="city-btn city-btn--solid" href="/products/moringa-powder/">Shop moringa</a>
      <a class="city-btn city-btn--ghost" href="#pricing">See pricing</a>
    </div>
  </div>
  <div class="city-hub-media">
    <div class="city-hub-media__frame">
      <img src="/assets/images/homepage/product-showcase/Moringa.webp" alt="NutriThrive moringa powder for ${c.city}" width="440" height="550" loading="eager">
    </div>
    <aside class="city-hub-float">
      <p class="city-hub-float__kicker">${c.floatKicker}</p>
      <p class="city-hub-float__title">${c.floatTitle}</p>
      <p class="city-hub-float__text">${c.floatText}</p>
    </aside>
  </div>
</header>

<section class="city-hub-section city-hub-section--flush">
  <div class="city-hub-section__head">
    <h2>Sourcing excellence</h2>
    <p class="city-hub-kicker" style="margin-top:1rem">Ships from our Truganina warehouse</p>
  </div>
  <div class="city-bento">
    <div class="city-bento__lg">
      <div>
        <span class="city-hub-kicker city-hub-kicker--terracotta">01. ${c.city} delivery</span>
        <h3>Typical arrival: ${c.delivery}</h3>
        <p>Order by 2pm for same-day Melbourne dispatch. Free shipping over $80. Tracked Australia Post.</p>
      </div>
      <img src="/assets/images/homepage/product-showcase/Moringa.webp" alt="" loading="lazy">
    </div>
    <div class="city-bento__sm">
      <span class="city-hub-kicker">Lab analysis</span>
      <div class="city-bento__stat"><p class="num">NMI</p><p class="lbl">Government lab batch screening</p></div>
      <hr>
      <div class="city-bento__stat"><p class="num">$11</p><p class="lbl">From / 100g shade-dried leaf</p></div>
      <a href="/documents/nutrithrive-lab-report-summary.pdf" target="_blank" rel="noopener">Latest lab PDF →</a>
    </div>
    <div class="city-bento__third">
      <span class="ico" aria-hidden="true">◈</span>
      <h4>Leaf-only</h4>
      <p>Shade-dried moringa leaf. No fillers, no blends.</p>
    </div>
    <div class="city-bento__third">
      <span class="ico" aria-hidden="true">→</span>
      <h4>${c.city} shipping</h4>
      <p>Metro usually ${c.delivery}. Bundle always ships free.</p>
    </div>
    <div class="city-bento__third">
      <span class="ico" aria-hidden="true">◎</span>
      <h4>AU packed</h4>
      <p>15 Europe Street, Truganina VIC — not an overseas marketplace seller.</p>
    </div>
  </div>
</section>

<section class="city-hub-section" id="pricing">
  <div class="city-hub-section__head">
    <p class="city-hub-kicker city-hub-kicker--terracotta">Pricing</p>
    <h2>Delivered to <em>${c.city}</em></h2>
  </div>
  <table class="city-hub-table">
    <thead><tr><th>Size</th><th>Price</th><th>Shipping</th></tr></thead>
    <tbody>
      <tr><td>100g</td><td class="amt">$11</td><td>$9.69*</td></tr>
      <tr><td>200g</td><td class="amt">$21.50</td><td>$9.69*</td></tr>
      ${bundleRow}
    </tbody>
  </table>
  <p class="city-hub-note">*Free shipping on orders $80+. Bundle always free.</p>
</section>

<aside class="city-hub-tip">
  <h2>${c.tipTitle}</h2>
  <p>${c.tipBody}</p>
</aside>

<section class="city-hub-review" aria-label="Customer review">
  <p class="city-hub-review__label">What customers say</p>
  <blockquote>“${c.review.quote}”</blockquote>
  <cite>— ${c.review.name} · <a href="https://maps.app.goo.gl/9VQVEUQSeGm4XfGB7" rel="noopener" target="_blank">Google Reviews</a></cite>
</section>

<section class="city-hub-section city-hub-section--soft">
  <div class="city-hub-section__head">
    <h2>${c.city} questions</h2>
  </div>
  <div class="city-hub-faq">${faqs}</div>
</section>

<section class="city-hub-section">
  <div class="city-hub-section__head">
    <p class="city-hub-kicker">Guides</p>
    <h2>Learn <em>more</em></h2>
  </div>
  <ul class="city-hub-guides">${guides}</ul>
</section>

<div class="city-hub-cta">
  <h2>Order to ${c.city}</h2>
  <p>From $11/100g · NMI-tested · Free shipping $80+</p>
  <a class="city-btn city-btn--solid" href="/products/moringa-powder/">Shop now</a>
</div>
</main>

<div id="nt-footer"></div>
<script src="/shared/site-data.min.js"></script>
<script src="/scripts/global/cart.min.js"></script>
<script src="/shared/js/cart-v2-ui.min.js"></script>
<script src="/shared/js/footer-v2.min.js"></script>
<script src="/shared/js/layout-v2.min.js"></script>
<script src="/shared/js/v2-site.min.js"></script>
<div class="city-mobile-bar" role="complementary" aria-label="Quick shop">
  <div class="city-mobile-bar__price">From $11 / 100g<span>Free shipping over $80</span></div>
  <a href="/products/moringa-powder/" class="city-btn city-btn--solid">Shop</a>
</div>
</body>
</html>`;
}

function buildHead(c) {
  return `<link rel="stylesheet" href="/assets/css/design-system.min.css"/>
<link rel="preload" href="/styles/global/style.min.css" as="style">
<script src="/scripts/global/defer-loader.min.js" defer></script>
<script src="/scripts/global/reddit-pixel.min.js" defer></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-WH21SW75WP"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-WH21SW75WP', {'anonymize_ip': true, 'allow_google_signals': false});
</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${c.title}</title>
<meta name="description" content="${c.description}">
<link rel="canonical" href="https://nutrithrive.com.au/${c.slug}/">
<meta name="robots" content="index, follow">
<meta name="geo.region" content="${c.stateCode}">
<meta name="geo.placename" content="${c.geo.placename}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://nutrithrive.com.au/${c.slug}/">
<meta property="og:title" content="${c.title}">
<meta property="og:description" content="${c.description}">
<meta property="og:image" content="https://nutrithrive.com.au/assets/images/homepage/product-showcase/Moringa.webp">
<meta property="og:locale" content="en_AU">
<link rel="icon" type="image/png" sizes="48x48" href="/assets/images/logo/favicon-48.png">
<link rel="icon" href="/assets/images/logo/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="96x96" href="/assets/images/logo/favicon-96.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/images/logo/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileImage" content="/assets/images/logo/apple-touch-icon.png">
<meta name="msapplication-TileColor" content="#0f6b4d">
<link href="/styles/global/style.min.css" rel="stylesheet">
<link href="/styles/pages/city-landing.min.css" rel="stylesheet">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://nutrithrive.com.au/"},
    {"@type": "ListItem", "position": 2, "name": "Moringa Powder ${c.city}", "item": "https://nutrithrive.com.au/${c.slug}/"}
  ]
}
</script>
<script type="application/ld+json">
${faqSchema(c.faqs)}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HealthFoodStore"],
  "@id": "https://nutrithrive.com.au/#localbusiness-${c.slug}",
  "name": "NutriThrive",
  "url": "https://nutrithrive.com.au/",
  "telephone": "+61438201419",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "15 Europe Street",
    "addressLocality": "Truganina",
    "addressRegion": "VIC",
    "postalCode": "3029",
    "addressCountry": "AU"
  },
  "areaServed": [
    {"@type": "City", "name": "${c.city}", "addressRegion": "${c.state}", "addressCountry": "AU"},
    {"@type": "Country", "name": "Australia"}
  ],
  "description": "NMI lab-tested moringa powder shipped from Truganina to ${c.city}. Typical metro delivery ${c.delivery}."
}
</script>`;
}

for (const c of CITIES) {
  fs.writeFileSync(path.join(ROOT, c.slug, 'index.html'), pageHtml(c, buildHead(c)));
  console.log('Built', c.slug);
}
console.log('Done.');
