#!/usr/bin/env node
/**
 * Add shared city-landing CSS, delivery strip, GBP review, LocalBusiness schema.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'site');
const BASE = 'https://nutrithrive.com.au';

const CITIES = [
  {
    slug: 'moringa-sydney',
    city: 'Sydney',
    state: 'NSW',
    deliveryShort: '2–4 business days',
    review: {
      quote:
        "I've been using this Moringa powder for a month now, and I can honestly feel the difference! My energy levels have improved, and I love adding it to my morning smoothies.",
      name: 'chizaram olanma',
    },
    guideLinks: [
      { href: '/blog/how-to-choose-moringa-powder-australia-2026', label: 'How to choose moringa powder in Australia' },
      { href: '/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025', label: 'Chemist Warehouse vs NutriThrive' },
    ],
  },
  {
    slug: 'moringa-brisbane',
    city: 'Brisbane',
    state: 'QLD',
    deliveryShort: '2–4 business days',
    review: {
      quote: 'Tried Moringa powder daily for 30 days. Helps with bloating and slight increase in stamina. good natural supplement.',
      name: 'Bindu',
    },
    guideLinks: [
      { href: '/blog/how-long-does-moringa-powder-last-storage-shelf-life-2026', label: 'Storage & shelf life in humid climates' },
      { href: '/blog/grow-moringa-tree-australia', label: 'Growing moringa in subtropical QLD' },
    ],
  },
  {
    slug: 'moringa-perth',
    city: 'Perth',
    state: 'WA',
    deliveryShort: '3–5 business days',
    review: {
      quote:
        'I have used various brands of moringa powder but the powder from Nutri-Thrive is the greenest in color and tastes way better than the other moringa powder in the market. The pricing is very reasonable and the shipping was also very quick!!',
      name: 'Jay Turakhia',
    },
    guideLinks: [
      { href: '/blog/how-to-choose-moringa-powder-australia-2026', label: 'How to choose quality moringa powder' },
      { href: '/pages/shipping/shipping-returns.html', label: 'WA shipping times & free shipping over $49' },
    ],
  },
  {
    slug: 'moringa-adelaide',
    city: 'Adelaide',
    state: 'SA',
    deliveryShort: '2–4 business days',
    review: {
      quote: 'This product is healthy, of excellent quality, and very affordable. Highly recommend!',
      name: 'reetysha ramjee',
    },
    guideLinks: [
      { href: '/blog/how-to-choose-moringa-powder-australia-2026', label: "Moringa buyer's guide" },
      { href: '/blog/moringa-brands-comparison-australia-2026', label: 'Best moringa brands Australia (2026)' },
    ],
  },
];

function localBusinessJson(c) {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HealthFoodStore'],
    '@id': `${BASE}/#localbusiness-${c.slug}`,
    name: 'NutriThrive',
    url: `${BASE}/`,
    telephone: '+61438201419',
    email: 'nutrithrive0@gmail.com',
    image: `${BASE}/assets/images/logo/logo-112.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '15 Europe Street',
      addressLocality: 'Truganina',
      addressRegion: 'VIC',
      postalCode: '3029',
      addressCountry: 'AU',
    },
    areaServed: [
      { '@type': 'City', name: c.city, addressRegion: c.state, addressCountry: 'AU' },
      { '@type': 'AdministrativeArea', name: c.state },
      { '@type': 'Country', name: 'Australia' },
    ],
    description: `NMI lab-tested moringa powder shipped from Truganina, Melbourne to ${c.city}. Typical metro delivery ${c.deliveryShort}.`,
  };
}

function deliveryStrip(c) {
  return `<div class="city-delivery-strip" role="status">
  <span class="city-delivery-strip__icon" aria-hidden="true">🚚</span>
  <div>
    <strong>Order by 2pm</strong> → same-day dispatch from Truganina, Melbourne
    <span class="city-delivery-strip__time">Typical arrival in ${c.city}: ${c.deliveryShort}</span>
  </div>
</div>
<span class="city-trust-badge" aria-label="Ships from Australia">🇦🇺 Ships from Melbourne, Australia</span>`;
}

function reviewBlock(c) {
  return `<section class="city-review" aria-label="Customer review">
  <h2>What customers say</h2>
  <blockquote>"${c.review.quote}"</blockquote>
  <cite>— ${c.review.name} · via <a href="https://maps.app.goo.gl/9VQVEUQSeGm4XfGB7" rel="noopener" target="_blank">Google Reviews</a></cite>
</section>`;
}

function guideSection(c) {
  const items = c.guideLinks.map((g) => `<li><a href="${g.href}">${g.label}</a></li>`).join('\n');
  return `<section class="city-section city-guide-links" aria-label="Related guides">
  <h2>Related guides</h2>
  <ul>${items}</ul>
</section>`;
}

for (const c of CITIES) {
  const fp = path.join(SITE, c.slug, 'index.html');
  let html = fs.readFileSync(fp, 'utf8');

  if (!html.includes('city-landing.min.css')) {
    html = html.replace(
      '<link href="/styles/global/style.min.css" rel="stylesheet">',
      '<link href="/styles/global/style.min.css" rel="stylesheet">\n<link href="/styles/pages/city-landing.min.css" rel="stylesheet">'
    );
  }

  if (!html.includes(`#localbusiness-${c.slug}`)) {
    const lb = `<script type="application/ld+json">\n${JSON.stringify(localBusinessJson(c), null, 2)}\n</script>\n</head>`;
    html = html.replace('</head>', lb);
  }

  html = html.replace(/<main style="[^"]*">/, '<main class="city-landing">');
  html = html.replace(
    /<nav style="font-size:0\.9rem[^"]*">/,
    '<nav class="city-crumb" aria-label="Breadcrumb">'
  );

  if (!html.includes('city-delivery-strip')) {
    html = html.replace(/(<h1>[\s\S]*?<\/h1>\s*\n)(\s*<p)/, `$1\n${deliveryStrip(c)}\n\n$2`);
  }

  if (!html.includes('class="lead"')) {
    html = html.replace(/(<h1>[\s\S]*?<\/h1>[\s\S]*?<p)(>)/, '$1 class="lead"$2');
  }

  if (!html.includes('class="city-review"')) {
    const faqMarker = /<section style="margin:2\.5rem 0;">\s*\n\s*<h2[^>]*>[^<]*FAQ/i;
    if (faqMarker.test(html)) {
      html = html.replace(faqMarker, `${reviewBlock(c)}\n\n$&`);
    }
  }

  if (!html.includes('city-guide-links')) {
    html = html.replace(/<div id="nt-footer">/, `${guideSection(c)}\n\n<div id="nt-footer">`);
  }

  fs.writeFileSync(fp, html);
  console.log('Patched', c.slug);
}

const melb = path.join(SITE, 'pages/homepage/melbourne.html');
if (fs.existsSync(melb)) {
  let html = fs.readFileSync(melb, 'utf8');
  if (!html.includes('city-delivery-strip')) {
    const strip = `<div style="max-width:1200px;margin:0 auto;padding:0 1.5rem;"><div class="city-delivery-strip" role="status">
  <span class="city-delivery-strip__icon" aria-hidden="true">🚚</span>
  <div><strong>Order by 2pm</strong> → same-day dispatch from Truganina · Melbourne metro often next business day</div>
</div></div>`;
    html = html.replace('<section class="melb-hero"', `${strip}\n<section class="melb-hero"`);
  }
  if (!html.includes('city-landing.min.css')) {
    html = html.replace(
      '<link href="/styles/pages/melbourne.min.css" rel="stylesheet"/>',
      '<link href="/styles/pages/melbourne.min.css" rel="stylesheet"/>\n<link href="/styles/pages/city-landing.min.css" rel="stylesheet"/>'
    );
  }
  fs.writeFileSync(melb, html);
  console.log('Patched melbourne');
}

console.log('Done.');
