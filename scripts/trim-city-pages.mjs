#!/usr/bin/env node
/**
 * Trim city landing pages to essential conversion content only.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const LOCATIONS_NAV = `<nav class="city-locations" aria-label="Deliver to">
  <span class="city-locations__label">Deliver to</span>
  <ul class="city-locations__list">
    <li><a href="/melbourne/" class="city-locations__link">Melbourne</a></li>
    <li><a href="/moringa-sydney/" class="city-locations__link">Sydney</a></li>
    <li><a href="/moringa-brisbane/" class="city-locations__link">Brisbane</a></li>
    <li><a href="/moringa-perth/" class="city-locations__link">Perth</a></li>
    <li><a href="/moringa-adelaide/" class="city-locations__link">Adelaide</a></li>
  </ul>
</nav>`;

const CITIES = [
  {
    slug: 'moringa-sydney',
    crumb: 'Moringa Powder Sydney',
    eyebrow: 'Sydney · NSW',
    h1: 'Moringa Powder Sydney',
    delivery: '2–4 business days',
    deliverySchema:
      'Order before 2pm for same-day dispatch from Truganina, Melbourne. Most Sydney metro postcodes arrive in 2–4 business days via Australia Post.',
    imgAlt: 'NutriThrive moringa powder delivered to Sydney',
    callout: '',
    localTitle: 'Why order direct instead of Chemist Warehouse?',
    localBody:
      'Most Sydney shops sell capsules—you can\'t see or smell the powder inside. NutriThrive is loose shade-dried leaf with NMI batch testing on every lot, from $11/100g.',
    faqs: [
      {
        q: 'How long does delivery take to Sydney?',
        a: 'Same-day dispatch from Melbourne when you order before 2pm (business days). Most Sydney metro areas: 2–4 business days.',
      },
      {
        q: 'Do you have a shop in Sydney?',
        a: 'No physical store—we pack at 15 Europe Street, Truganina VIC and ship Australia-wide. <a href="/pages/shipping/shipping-returns.html">Shipping details</a>.',
      },
      {
        q: 'What\'s the best value for Sydney buyers?',
        a: 'The 400g bundle is $35. Free shipping on orders $80+; under $80, shipping is $8.73.',
      },
      {
        q: 'Is NutriThrive affected by the 2026 moringa recall?',
        a: 'No. The recall was Rosabella capsules only. We sell leaf powder with NMI screening. <a href="/blog/rosabella-moringa-reviews-legit-or-overhyped-2026">Details</a>.',
      },
    ],
    review: {
      quote:
        "I've been using this Moringa powder for a month now, and I can honestly feel the difference! My energy levels have improved, and I love adding it to my morning smoothies.",
      name: 'chizaram olanma',
    },
    guides: [
      { href: '/blog/how-to-choose-moringa-powder-australia-2026', label: 'How to choose moringa powder' },
      { href: '/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025', label: 'Chemist Warehouse vs NutriThrive' },
    ],
  },
  {
    slug: 'moringa-brisbane',
    crumb: 'Moringa Powder Brisbane',
    eyebrow: 'Brisbane · QLD',
    h1: 'Moringa Powder Brisbane',
    delivery: '2–4 business days',
    deliverySchema:
      'Order before 2pm for same-day dispatch from Truganina, Melbourne. Brisbane metro usually 2–4 business days; Gold Coast and Sunshine Coast similar.',
    imgAlt: 'NutriThrive moringa powder delivered to Brisbane',
    callout: '',
    localTitle: 'Storage tip for humid QLD weather',
    localBody:
      'Brisbane humidity can cause clumping once the bag is open. Keep it sealed, store away from the stove, and refrigerate during wet season (Nov–Mar). <a href="/blog/how-long-does-moringa-powder-last-storage-shelf-life-2026">Full storage guide</a>.',
    faqs: [
      {
        q: 'How long does delivery take to Brisbane?',
        a: 'Same-day dispatch from Melbourne when you order before 2pm (business days). Brisbane metro: 2–4 business days. Gold Coast and Sunshine Coast: usually the same.',
      },
      {
        q: 'Do you have a shop in Brisbane?',
        a: 'No—we ship from our Truganina warehouse in Melbourne to all QLD postcodes. No pickup in Brisbane.',
      },
      {
        q: 'What\'s the cheapest way to order?',
        a: 'The 400g bundle is $35. Single 100g is $11 + $8.73 shipping if your order is under $80. Free shipping from $80.',
      },
      {
        q: 'Why is my powder clumping?',
        a: 'Moisture from humidity, not a defect. Seal tightly and refrigerate in wet season. Let the bag warm up before opening to avoid condensation.',
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
  },
  {
    slug: 'moringa-perth',
    crumb: 'Moringa Powder Perth',
    eyebrow: 'Perth · WA',
    h1: 'Moringa Powder Perth',
    delivery: '3–5 business days',
    deliverySchema:
      'Order before 2pm for same-day dispatch from Truganina, Melbourne. Perth metro typically 3–5 business days—the longest domestic route from our warehouse.',
    imgAlt: 'NutriThrive moringa powder delivered to Perth',
    callout:
      '<div class="city-callout"><strong>Perth tip:</strong> The 400g bundle is $35. Free shipping from $80 — useful if you want fewer Melbourne freight runs.</div>',
    localTitle: 'Why Perth buyers order from Melbourne',
    localBody:
      'Loose moringa powder is hard to find in WA retail. We ship the same NMI-tested batches as east-coast customers. In summer heat, store sealed in a cool cupboard or fridge after opening.',
    faqs: [
      {
        q: 'How long does delivery take to Perth?',
        a: '3–5 business days to most Perth metro postcodes. Regional WA can take 6–9 days. Express Post is faster at checkout if you need it sooner.',
      },
      {
        q: 'Do you have a shop in Perth?',
        a: 'No physical store in WA. All orders pack and dispatch from Truganina, Melbourne (15 Europe Street).',
      },
      {
        q: 'Why is Perth slower than Sydney or Brisbane?',
        a: 'Perth is ~2,700 km from our warehouse—Australia Post standard times reflect that distance.',
      },
      {
        q: 'Best value for regular Perth orders?',
        a: 'The 400g bundle is $35 — about 4 months at 1 tsp/day. Free shipping starts at $80.',
      },
    ],
    review: {
      quote:
        'I have used various brands of moringa powder but the powder from Nutri-Thrive is the greenest in color and tastes way better than the other moringa powder in the market. The pricing is very reasonable and the shipping was also very quick!!',
      name: 'Jay Turakhia',
    },
    guides: [
      { href: '/blog/how-to-choose-moringa-powder-australia-2026', label: 'How to choose moringa powder' },
      { href: '/pages/shipping/shipping-returns.html', label: 'Shipping times & free shipping $80+' },
    ],
    bundleHighlight: true,
  },
  {
    slug: 'moringa-adelaide',
    crumb: 'Moringa Powder Adelaide',
    eyebrow: 'Adelaide · SA',
    h1: 'Moringa Powder Adelaide',
    delivery: '2–4 business days',
    deliverySchema:
      'Order before 2pm for same-day dispatch from Truganina, Melbourne. Adelaide metro usually 2–4 business days.',
    imgAlt: 'NutriThrive moringa powder delivered to Adelaide',
    callout: '',
    localTitle: 'Quality you can see before you dose',
    localBody:
      'Adelaide shops mostly stock capsules. Our shade-dried powder is vivid green, lab-tested each batch, and priced from $11/100g with batch summaries on the product page.',
    faqs: [
      {
        q: 'How long does delivery take to Adelaide?',
        a: 'Same-day dispatch from Melbourne before 2pm (business days). Adelaide metro: 2–4 business days. Regional SA may add 1–2 days.',
      },
      {
        q: 'Do you have a store in Adelaide?',
        a: 'No—we\'re online-only, packed in Truganina VIC. We ship to all SA postcodes via Australia Post.',
      },
      {
        q: 'Cheapest way to order to Adelaide?',
        a: 'The 400g bundle is $35. Free shipping on orders $80+; under $80 shipping is $8.73. Otherwise $11/100g + $8.73 under $80.',
      },
      {
        q: 'Chemist Warehouse vs ordering direct?',
        a: 'CW stocks Rosabella capsules. We sell loose powder with visible quality and NMI testing. <a href="/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025">Compare</a>.',
      },
    ],
    review: {
      quote: 'This product is healthy, of excellent quality, and very affordable. Highly recommend!',
      name: 'reetysha ramjee',
    },
    guides: [
      { href: '/blog/how-to-choose-moringa-powder-australia-2026', label: "Moringa buyer's guide" },
      { href: '/blog/moringa-brands-comparison-australia-2026', label: 'Moringa brands compared (2026)' },
    ],
  },
];

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

function pricingRows(cityName, highlight) {
  const bundleRow = highlight
    ? `<tr class="is-highlight"><td>400g Moringa Bundle</td><td class="price-cell price-cell--accent">$35.00</td><td>From $8.73*</td></tr>`
    : `<tr><td>400g Moringa Bundle</td><td class="price-cell price-cell--accent">$35.00</td><td>From $8.73*</td></tr>`;
  return `<section class="city-section">
  <h2>Prices delivered to ${cityName}</h2>
  <div class="city-table-wrap"><table class="city-pricing-table">
    <thead><tr><th>Size</th><th>Price</th><th>Shipping</th></tr></thead>
    <tbody>
      <tr><td>100g</td><td class="price-cell">$11.00</td><td>$8.73*</td></tr>
      <tr><td>200g</td><td class="price-cell">$21.50</td><td>$8.73*</td></tr>
      ${bundleRow}
    </tbody>
  </table></div>
  <p class="city-table-note">*Free shipping on orders $80+. Under $80, Australia shipping from $8.73.</p>
</section>`;
}

function faqHtml(faqs) {
  const items = faqs
    .map(
      (f) =>
        `<article class="city-faq-item"><h3 class="city-faq-q">${f.q}</h3><p class="city-faq-a">${f.a}</p></article>`
    )
    .join('\n');
  return `<section class="city-section city-faq-section">
  <h2>FAQ</h2>
  <div class="city-faq">${items}</div>
</section>`;
}

function guidesHtml(guides) {
  const items = guides.map((g) => `<li><a href="${g.href}">${g.label}</a></li>`).join('\n');
  return `<section class="city-section city-section--compact">
  <h2>Learn more</h2>
  <ul class="city-guides-list">${items}</ul>
</section>`;
}

function buildMain(c) {
  const cityName = c.h1.replace('Moringa Powder ', '');
  const activeNav = LOCATIONS_NAV.replace(
    `href="/${c.slug}/" class="city-locations__link"`,
    `href="/${c.slug}/" class="city-locations__link is-active" aria-current="page"`
  );

  return `<main class="city-landing">
<nav class="city-crumb" aria-label="Breadcrumb">
<a href="/">Home</a> › ${c.crumb}
</nav>

${activeNav}

<section class="city-hero">
<header class="city-hero-header">
<p class="city-eyebrow">${c.eyebrow}</p>
<h1>${c.h1}</h1>
<div class="city-hero-meta">
<div class="city-delivery-strip" role="status">
  <span class="city-delivery-strip__icon" aria-hidden="true">🚚</span>
  <div>
    <strong>Order by 2pm</strong> → same-day dispatch from Melbourne
    <span class="city-delivery-strip__time">${cityName}: ${c.delivery}</span>
  </div>
</div>
<span class="city-trust-badge" aria-label="Ships from Australia">🇦🇺 Ships from Melbourne</span>
</div>
</header>

${c.callout}

<div class="city-hero-grid">
  <div class="city-hero-grid__media">
    <img src="/assets/images/homepage/product-showcase/Moringa.webp" alt="${c.imgAlt}" loading="lazy">
  </div>
  <div class="city-hero-grid__body">
    <ul class="city-hero-checklist">
      <li>NMI lab-tested · batch summary online</li>
      <li>Shade-dried leaf only — no fillers</li>
      <li>Free shipping over $80 Australia-wide</li>
    </ul>
    <p class="city-hero-price">From $11.00 / 100g</p>
    <p class="city-hero-perday">~33 servings at 1 tsp/day</p>
    <a href="/products/moringa-powder/" class="city-cta-btn">Shop moringa powder</a>
  </div>
</div>
</section>

<div class="city-content">
${pricingRows(cityName, c.bundleHighlight)}

<section class="city-section">
  <h2>${c.localTitle}</h2>
  <p>${c.localBody}</p>
</section>

<section class="city-review" aria-label="Customer review">
  <h2>What customers say</h2>
  <blockquote>"${c.review.quote}"</blockquote>
  <cite>— ${c.review.name} · <a href="https://maps.app.goo.gl/9VQVEUQSeGm4XfGB7" rel="noopener" target="_blank">Google Reviews</a></cite>
</section>

${faqHtml(c.faqs)}
${guidesHtml(c.guides)}
</div>

<div class="city-bottom-cta">
  <p class="city-bottom-cta__title">Order moringa to ${cityName}</p>
  <p class="city-bottom-cta__sub">From $11/100g · NMI-tested · Free shipping $80+</p>
  <a href="/products/moringa-powder/" class="city-bottom-cta__btn">Shop now</a>
</div>

</main>`;
}

for (const c of CITIES) {
  const fp = path.join(ROOT, c.slug, 'index.html');
  let html = fs.readFileSync(fp, 'utf8');

  html = html.replace(
    /<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema.org",\s*"@type": "FAQPage"[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${faqSchema(c.faqs)}\n</script>`
  );

  html = html.replace(/<main class="city-landing">[\s\S]*?<\/main>/, buildMain(c));

  fs.writeFileSync(fp, html);
  console.log('Trimmed:', c.slug);
}

console.log('Done.');
