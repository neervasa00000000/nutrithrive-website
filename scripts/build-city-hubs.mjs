#!/usr/bin/env node
/**
 * Build quiet-luxury city hub pages (Verdant-style).
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
    h1: 'Moringa powder for <em>Sydney</em>',
    lead:
      'NMI lab-tested leaf, packed in Truganina. <strong>Order by 2pm</strong> for same-day dispatch — most Sydney metro addresses in <strong>2–4 business days</strong>.',
    floatTitle: 'Visible quality',
    floatText: 'Loose powder you can see and smell — not opaque capsules.',
    tipTitle: 'Why order direct in Sydney',
    tipBody:
      'Most Sydney retailers stock capsules only. NutriThrive is shade-dried leaf with a batch lab summary on every lot — from $11/100g.',
    faqs: [
      {
        q: 'How long to Sydney?',
        a: 'Same-day dispatch from Melbourne before 2pm on business days. Most Sydney metro postcodes: 2–4 business days.',
      },
      {
        q: 'Shop in Sydney?',
        a: 'No retail store — we pack at 15 Europe Street, Truganina VIC and ship Australia-wide.',
      },
      {
        q: 'Best value?',
        a: 'The 3+1 bundle ($35, 400g) ships free — about $0.26/day. Under $80, shipping is $8.73.',
      },
      {
        q: '2026 recall?',
        a: 'Not affected. That recall was Rosabella capsules. We sell leaf powder with NMI screening.',
      },
    ],
    review: {
      quote:
        "I've been using this Moringa powder for a month now, and I can honestly feel the difference! My energy levels have improved.",
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
    h1: 'Moringa powder for <em>Brisbane</em>',
    lead:
      'Packed in Melbourne, delivered across SEQ. <strong>Order by 2pm</strong> — Brisbane metro typically <strong>2–4 business days</strong>. Free shipping over $80.',
    floatTitle: 'Humid-climate ready',
    floatText: 'Seal tight after opening — QLD wet season tips below.',
    tipTitle: 'Storage tip for humid QLD',
    tipBody:
      'Once open, keep the pouch sealed away from the stove. Refrigerate in wet season (Nov–Mar). <a href="/blog/how-long-does-moringa-powder-last-storage-shelf-life-2026">Full storage guide</a>.',
    faqs: [
      {
        q: 'How long to Brisbane?',
        a: 'Same-day Melbourne dispatch before 2pm. Brisbane metro, Gold Coast and Sunshine Coast: usually 2–4 business days.',
      },
      {
        q: 'Shop in Brisbane?',
        a: 'No — we ship from Truganina, Melbourne to all QLD postcodes. No Brisbane pickup.',
      },
      {
        q: 'Cheapest way to order?',
        a: '3+1 bundle ($35, 400g) ships free. Single 100g is $11 + $8.73 if under $80.',
      },
      {
        q: 'Why is powder clumping?',
        a: 'Humidity moisture, not a defect. Seal tightly and refrigerate in wet season. Warm the bag before opening.',
      },
    ],
    review: {
      quote:
        'Tried Moringa powder daily for 30 days. Helps with bloating and slight increase in stamina. good natural supplement.',
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
    h1: 'Moringa powder for <em>Perth</em>',
    lead:
      'Furthest capital from our warehouse — still tracked Australia Post. <strong>Order by 2pm</strong> for same-day dispatch. Perth metro: <strong>3–5 business days</strong>.',
    floatTitle: 'Ship smarter',
    floatText: '3+1 bundle ships free — skip repeat $8.73 freight.',
    tipTitle: 'Why Perth buyers order the bundle',
    tipBody:
      'Loose powder is scarce in WA retail. The 3+1 ($35, 400g) ships free and lasts ~4 months at 1 tsp/day — fewer cross-country parcels. Store sealed and cool in summer heat.',
    faqs: [
      {
        q: 'How long to Perth?',
        a: '3–5 business days to most Perth metro postcodes. Regional WA: 6–9 days. Express Post available at checkout.',
      },
      {
        q: 'Shop in Perth?',
        a: 'No WA store. All orders pack at 15 Europe Street, Truganina VIC.',
      },
      {
        q: 'Why slower than the east coast?',
        a: 'Perth is ~2,700 km from our Melbourne warehouse — Australia Post standard times reflect that.',
      },
      {
        q: 'Best value for Perth?',
        a: '3+1 bundle ($35) ships free — best way to avoid paying freight on every reorder.',
      },
    ],
    review: {
      quote:
        'The powder from Nutri-Thrive is the greenest in color and tastes way better than other moringa. Pricing is reasonable and shipping was quick!!',
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
    h1: 'Moringa powder for <em>Adelaide</em>',
    lead:
      'Clear pricing, batch lab summaries, shade-dried leaf. <strong>Order by 2pm</strong> — Adelaide metro usually <strong>2–4 business days</strong> from Melbourne.',
    floatTitle: 'Lab-backed',
    floatText: 'NMI screening on every batch — PDF on the product page.',
    tipTitle: 'Quality you can assess',
    tipBody:
      'Adelaide shops mostly sell capsules. Our powder is vivid green, leaf-only, and priced from $11/100g with batch summaries online before you reorder.',
    faqs: [
      {
        q: 'How long to Adelaide?',
        a: 'Same-day Melbourne dispatch before 2pm. Adelaide metro: 2–4 business days. Regional SA may add a day or two.',
      },
      {
        q: 'Shop in Adelaide?',
        a: 'Online only — packed in Truganina VIC. We ship to all SA postcodes.',
      },
      {
        q: 'Cheapest order?',
        a: '3+1 bundle ($35, 400g) ships free. Otherwise $11/100g + $8.73 under $80.',
      },
      {
        q: 'Chemist Warehouse vs direct?',
        a: 'CW stocks Rosabella capsules. We sell loose powder with visible quality and NMI testing.',
      },
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
  const items = [
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
    .join('\n');
  return `<nav class="city-loc" aria-label="Deliver to">
  <span class="city-loc__label">Deliver to</span>
  <ul class="city-loc__list">${items}</ul>
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

function pricing(c) {
  const bundle = c.highlightBundle
    ? `<tr class="is-best"><td>3+1 Bundle 400g</td><td class="amt">$35</td><td>Free</td></tr>`
    : `<tr><td>3+1 Bundle 400g</td><td class="amt">$35</td><td>Free</td></tr>`;
  return `<section class="city-hub-section">
  <div class="city-hub-section__head">
    <p class="city-hub-kicker">Pricing</p>
    <h2>Delivered to <em>${c.city}</em></h2>
  </div>
  <table class="city-hub-table">
    <thead><tr><th>Size</th><th>Price</th><th>Shipping</th></tr></thead>
    <tbody>
      <tr><td>100g</td><td class="amt">$11</td><td>$8.73*</td></tr>
      <tr><td>200g</td><td class="amt">$21.50</td><td>$8.73*</td></tr>
      ${bundle}
    </tbody>
  </table>
  <p class="city-hub-note">*Free shipping on orders $80+. Bundle always free.</p>
</section>`;
}

function pageHtml(c, headInner) {
  const faqs = c.faqs
    .map(
      (f) => `<details>
      <summary>${f.q}</summary>
      <p>${f.a}</p>
    </details>`
    )
    .join('\n');
  const guides = c.guides.map((g) => `<li><a href="${g.href}">${g.label}</a></li>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
${headInner}
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

<main class="city-hub">
${locNav(c.slug)}

<section class="city-hub-hero">
  <div>
    <p class="city-hub-eyebrow">${c.city} · ${c.state}</p>
    <h1 class="city-hub-title">${c.h1}</h1>
    <p class="city-hub-lead">${c.lead}</p>
    <div class="city-hub-actions">
      <a class="city-btn city-btn--solid" href="/products/moringa-powder/">Shop moringa</a>
      <a class="city-btn city-btn--ghost" href="#pricing">See pricing</a>
    </div>
  </div>
  <div class="city-hub-media">
    <img src="/assets/images/homepage/product-showcase/Moringa.webp" alt="NutriThrive moringa powder for ${c.city}" loading="eager" width="460" height="460">
    <aside class="city-hub-float">
      <p class="city-hub-float__kicker">${c.delivery}</p>
      <p class="city-hub-float__title">${c.floatTitle}</p>
      <p class="city-hub-float__text">${c.floatText}</p>
    </aside>
  </div>
</section>

<section class="city-hub-section">
  <div class="city-hub-section__head">
    <p class="city-hub-kicker">From our warehouse</p>
    <h2>Ships from <em>Truganina</em></h2>
  </div>
  <div class="city-hub-split">
    <div class="city-hub-split__photo">
      <img src="/assets/images/homepage/product-showcase/Moringa.webp" alt="" loading="lazy">
      <div class="city-hub-split__caption">
        <strong>Order by 2pm</strong>
        <span>Same-day dispatch · Australia Post tracked</span>
      </div>
    </div>
    <div class="city-hub-split__stat">
      <p class="stat-num">$11</p>
      <p class="stat-label">Per 100g from</p>
      <p>NMI government lab screening on every batch. Shade-dried leaf only — no blends, no fillers.</p>
    </div>
  </div>
  <div class="city-hub-icons">
    <div class="city-hub-icon">
      <div class="city-hub-icon__mark" aria-hidden="true">✓</div>
      <h3>Lab-tested</h3>
      <p>Batch summary PDF on the product page for heavy metals and pesticides.</p>
    </div>
    <div class="city-hub-icon">
      <div class="city-hub-icon__mark" aria-hidden="true">→</div>
      <h3>${c.city} delivery</h3>
      <p>Typical metro arrival: ${c.delivery}. Free shipping over $80.</p>
    </div>
    <div class="city-hub-icon">
      <div class="city-hub-icon__mark" aria-hidden="true">◎</div>
      <h3>Australian packed</h3>
      <p>15 Europe Street, Truganina VIC — not an overseas marketplace seller.</p>
    </div>
  </div>
</section>

<div id="pricing">${pricing(c)}</div>

<aside class="city-hub-tip">
  <h2>${c.tipTitle}</h2>
  <p>${c.tipBody}</p>
</aside>

<section class="city-hub-review" aria-label="Customer review">
  <p class="city-hub-review__label">What customers say</p>
  <blockquote>“${c.review.quote}”</blockquote>
  <cite>— ${c.review.name} · <a href="https://maps.app.goo.gl/9VQVEUQSeGm4XfGB7" rel="noopener" target="_blank">Google Reviews</a></cite>
</section>

<section class="city-hub-section">
  <div class="city-hub-section__head">
    <p class="city-hub-kicker">${c.city} buyers</p>
    <h2>Common <em>questions</em></h2>
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
  const faq = faqSchema(c.faqs);
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
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${c.title}</title>
<meta name="description" content="${c.description}">
<link rel="canonical" href="https://nutrithrive.com.au/${c.slug}/">
<link rel="alternate" type="text/plain" href="https://nutrithrive.com.au/llms.txt" title="LLMs.txt">
<meta name="robots" content="index, follow">
<meta name="geo.region" content="${c.stateCode}">
<meta name="geo.placename" content="${c.geo.placename}">
<meta name="geo.position" content="${c.geo.pos}">
<meta name="ICBM" content="${c.geo.icbm}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://nutrithrive.com.au/${c.slug}/">
<meta property="og:title" content="${c.title}">
<meta property="og:description" content="${c.description}">
<meta property="og:image" content="https://nutrithrive.com.au/assets/images/homepage/product-showcase/Moringa.webp">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="NutriThrive Australia">
<meta property="og:locale" content="en_AU">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${c.title}">
<meta name="twitter:description" content="${c.description}">
<meta name="twitter:image" content="https://nutrithrive.com.au/assets/images/homepage/product-showcase/Moringa.webp">
<link rel="icon" type="image/png" href="/assets/images/logo/LOGO.webp" sizes="32x32">
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
${faq}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HealthFoodStore"],
  "@id": "https://nutrithrive.com.au/#localbusiness-${c.slug}",
  "name": "NutriThrive",
  "url": "https://nutrithrive.com.au/",
  "telephone": "+61438201419",
  "email": "nutrithrive0@gmail.com",
  "image": "https://nutrithrive.com.au/assets/images/logo/LOGO.webp",
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
    {"@type": "AdministrativeArea", "name": "${c.state}"},
    {"@type": "Country", "name": "Australia"}
  ],
  "description": "NMI lab-tested moringa powder shipped from Truganina to ${c.city}. Typical metro delivery ${c.delivery}."
}
</script>`;
}

for (const c of CITIES) {
  const html = pageHtml(c, buildHead(c));
  const dir = path.join(ROOT, c.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('Built', c.slug);
}

console.log('Done.');
