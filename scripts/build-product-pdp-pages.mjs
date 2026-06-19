#!/usr/bin/env node
/** Regenerate <main> on single-SKU product pages from shared PDP template. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const TRUST_SVG = {
  lab: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>',
  ship: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  free: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>',
};

function trustItem(icon, label) {
  return `<span class="nt-pdp-trust-item">${TRUST_SVG[icon] || ''}${label}</span>`;
}

function feature(iconPath, title, text) {
  return `<div class="nt-pdp-feature">
<svg class="nt-pdp-feature__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${iconPath}</svg>
<h3>${title}</h3><p>${text}</p></div>`;
}

function review(stars, quote, initials, name, meta) {
  const s = '★'.repeat(stars);
  return `<article class="nt-pdp-review">
<div class="nt-pdp-review__stars" aria-label="${stars} out of 5 stars">${s}</div>
<blockquote>${quote}</blockquote>
<div class="nt-pdp-review__author"><span class="nt-pdp-avatar">${initials}</span><div>
<div class="nt-pdp-review__name">${name}</div><div class="nt-pdp-review__meta">${meta}</div></div></div></article>`;
}

function faq(summary, body) {
  return `<details><summary>${summary}</summary><p>${body}</p></details>`;
}

function buybox(p) {
  const perDay = p.perDay ? `<p class="nt-pdp-perday">${p.perDay}</p>` : '';
  const packLine = p.packLine ? `<p class="nt-pdp-perday">${p.packLine}</p>` : perDay;
  const trust = (p.trust || ['Melbourne Packed', 'Same Day Dispatch', 'Free Shipping Over $80'])
    .map((t, i) => trustItem(['lab', 'ship', 'free'][i] || 'lab', t)).join('\n');
  return `
                <div class="nt-pdp-buybox">
                    <h1>${p.h1}</h1>
                    <div class="nt-pdp-pricing">
                        <span class="nt-pdp-price">$${p.price.toFixed(2)}</span>
                        <span class="nt-pdp-was">$${p.was.toFixed(2)}</span>
                        <span class="nt-pdp-save">Save $${(p.was - p.price).toFixed(2)}</span>
                    </div>
                    ${packLine}
                    <div class="nt-pdp-trust-row">${trust}</div>
                    <div class="nt-pdp-actions">
                        <div class="nt-pdp-qty" aria-label="Quantity">
                            <button type="button" id="qty-minus" aria-label="Decrease quantity">−</button>
                            <input type="number" id="product-quantity" value="1" min="1" max="10" aria-label="Quantity">
                            <button type="button" id="qty-plus" aria-label="Increase quantity">+</button>
                        </div>
                        <button type="button" onclick="${p.addFn}()" class="add-to-cart-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                            Add to Cart
                        </button>
                    </div>
                    <button type="button" onclick="${p.buyFn}()" class="nt-pdp-buy-now">Buy now — go to checkout</button>
                    <div class="nt-pdp-guarantees">
                        <span>🛡️ 7-day guarantee</span>
                        <span>📦 Melbourne dispatch before 2pm</span>
                    </div>
                </div>`;
}

function buildMain(p) {
  const badgeSeller = p.badgeSeller ? `<span class="nt-pdp-badge nt-pdp-badge--seller">${p.badgeSeller}</span>` : '';
  const discountPct = Math.round((1 - p.price / p.was) * 100);
  const sideCard = p.sideCard
    ? `<aside class="nt-pdp-lab-card"><h3>${p.sideCard.title}</h3><p>${p.sideCard.body}</p>${p.sideCard.link ? `<a href="${p.sideCard.link.href}" class="lab-report-btn"${p.sideCard.link.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${p.sideCard.link.label}</a>` : ''}${p.sideCard.note ? `<span class="lab-report-note">${p.sideCard.note}</span>` : ''}</aside>`
    : '';

  return `<main class="product-main">
        <nav aria-label="Breadcrumb" class="nt-pdp-crumb">
            <a href="/">Home</a><span class="sep" aria-hidden="true">›</span>
            <a href="/products/">Products</a><span class="sep" aria-hidden="true">›</span>
            <span aria-current="page">${p.crumb}</span>
        </nav>

        <section class="nt-pdp-hero" aria-label="Product details">
            <div class="nt-pdp-hero__grid">
                <div class="nt-pdp-gallery">
                    <div class="nt-pdp-badges">${badgeSeller}<span class="nt-pdp-badge nt-pdp-badge--sale">${discountPct}% off</span></div>
                    <div class="nt-pdp-gallery__frame">
                        <img id="main-product-image" src="${p.image}" alt="${p.imageAlt}" width="600" height="600" loading="eager" decoding="async" fetchpriority="high">
                    </div>
                </div>
                ${buybox(p)}
            </div>
        </section>

        <section class="nt-pdp-features" aria-label="Product highlights">
            <div class="nt-pdp-features__grid">${p.features.map(f => feature(f.icon, f.title, f.text)).join('\n')}</div>
        </section>

        <section class="nt-pdp-about" aria-label="About this product">
            <div class="nt-pdp-about__grid">
                ${sideCard}
                <div class="nt-pdp-about__content">
                    <h2>${p.aboutTitle}</h2>
                    ${p.aboutParas.map(x => `<p>${x}</p>`).join('\n')}
                    <dl class="nt-pdp-meta">${p.meta.map(m => `<div><dt>${m.dt}</dt><dd>${m.dd}</dd></div>`).join('\n')}</dl>
                </div>
            </div>
        </section>

        <section class="nt-pdp-how" aria-label="How to use">
            <div class="nt-pdp-how__inner">
                <h2>${p.howTitle}</h2>
                <p class="nt-pdp-how__sub">${p.howSub}</p>
                <div class="nt-pdp-how__cards">${p.howCards.map((c, i) => `<article class="nt-pdp-how-card"><span class="nt-pdp-how-card__num">0${i + 1}</span><h3>${c.title}</h3><p>${c.text}</p></article>`).join('\n')}</div>
            </div>
        </section>

        <section class="nt-pdp-reviews" aria-label="Customer reviews">
            <div class="nt-pdp-reviews__head"><div><h2>Customer Reviews</h2><p class="nt-pdp-reviews__rating"><span class="nt-pdp-stars" aria-hidden="true">★★★★★</span> ${p.reviewsRating}</p></div></div>
            <div class="nt-pdp-reviews__grid">${p.reviews.map(r => review(r.stars, r.quote, r.initials, r.name, r.meta)).join('\n')}</div>
            <p class="nt-pdp-reviews__note">${p.reviewsNote}</p>
        </section>

        <section class="nt-pdp-guides" aria-label="Related guides">
            <h2>Guides &amp; related products</h2>
            <ul>${p.guides.map(g => `<li><a href="${g.href}">${g.label}</a></li>`).join('\n')}</ul>
        </section>

        <section class="nt-pdp-faq" aria-label="Frequently asked questions">
            <h2>Frequently Asked Questions</h2>
            <div class="nt-pdp-faq__list">${p.faqs.map(f => faq(f.q, f.a)).join('\n')}</div>
        </section>

        <div class="nt-pdp-disclaimer">${p.disclaimer.map(x => `<p>${x}</p>`).join('\n')}</div>
    </main>`;
}

const ICONS = {
  leaf: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  check: '<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M9 12l2 2 4-4"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  cup: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>',
  box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  soap: '<path d="M9 12l2 2 4-4"/><rect x="3" y="8" width="18" height="12" rx="2"/>',
};

const products = [
  {
    file: 'products/curry-leaves/index.html',
    crumb: 'Dried Curry Leaves',
    h1: 'Dried Curry Leaves Australia — Kari Leaf, Shade-Dried',
    price: 7, was: 8.49,
    packLine: '30g pack · high potency · Murraya koenigii',
    badgeSeller: 'Pantry staple',
    image: '/assets/images/homepage/product-showcase/Curry.webp',
    imageAlt: 'Dried kari leaf curry leaves — NutriThrive Melbourne',
    addFn: 'addCurryLeavesToCart', buyFn: 'buyCurryLeavesNow',
    trust: ['Shade-Dried Leaves', 'Same Day Dispatch', 'Free Shipping Over $80'],
    features: [
      { icon: ICONS.leaf, title: 'Shade-Dried', text: 'Gentle drying keeps colour and citrus-nut aroma.' },
      { icon: ICONS.check, title: 'True Kari Leaf', text: 'Murraya koenigii — not curry powder or curry plant.' },
      { icon: ICONS.doc, title: 'Batch Checked', text: 'Aroma and appearance checked before packing.' },
      { icon: ICONS.clock, title: 'Melbourne Packed', text: 'Small batches from Truganina, ships AU-wide.' },
    ],
    sideCard: { title: 'What you receive', body: '30g pouch of whole dried kari leaf pieces. Seal after opening and use within six months for best aroma.', note: 'Food ingredient · not a medicine' },
    aboutTitle: 'About Dried Kari Leaf',
    aboutParas: [
      'Kari leaf grows on the <em>Murraya koenigii</em> tree — a staple in South Asian and Indian cooking. Fry leaves in hot oil or ghee (tadka) to release their scent in dals, sambars, and curries.',
      'Dried leaf is easier to store than fresh. Use about two to three times the amount of dried vs fresh for a similar finish. Read our <a href="/blog/nutrithrive-dried-curry-leaves-tradition-health">curry leaves guide</a> for recipe ideas.',
    ],
    meta: [
      { dt: 'Aroma', dd: 'Citrusy, nutty — nothing like blended curry powder.' },
      { dt: 'Origin', dd: 'Shade-dried, packed in Truganina, Melbourne.' },
    ],
    howTitle: 'How to Use',
    howSub: 'Classic tadka in three steps.',
    howCards: [
      { title: 'Measure', text: 'Use 8–12 dried leaves per dish (about 2–3× fresh leaf amount).' },
      { title: 'Temper', text: 'Fry in hot oil or ghee 30–60 seconds until crisp and fragrant.' },
      { title: 'Build', text: 'Add onions, spices, or wet ingredients — infused oil carries the aroma through.' },
    ],
    reviewsRating: '4.9/5 from verified buyers',
    reviews: [
      { stars: 5, quote: '"The dried curry leaves actually smell like something when you fry them. Dhal tasted right for the first time in ages."', initials: 'PM', name: 'Priya M.', meta: 'Melbourne, VIC' },
      { stars: 5, quote: '"Curry leaves for tadka smell like home. Same quality every bag."', initials: 'AD', name: 'Anjali D.', meta: 'Perth, WA' },
      { stars: 5, quote: '"Excellent quality — aroma when I fry them in ghee is incredible. Fast delivery from Melbourne."', initials: 'VR', name: 'Vikram P.', meta: 'Adelaide, SA' },
    ],
    reviewsNote: 'Individual experiences only. Food use only. Email us if you want a quote removed.',
    guides: [
      { href: '/blog/nutrithrive-dried-curry-leaves-tradition-health', label: 'Dried curry leaves guide' },
      { href: '/products/moringa-powder/', label: 'Moringa powder' },
      { href: '/products/combo-pack/', label: 'Combo pack (moringa + curry leaves + tea)' },
      { href: '/products/black-tea/', label: 'Darjeeling black tea' },
    ],
    faqs: [
      { q: 'Is kari leaf the same as curry powder?', a: 'No. Kari leaf is a whole herb from the curry leaf tree. Curry powder is a ground spice blend. They are used differently.' },
      { q: 'How do dried leaves compare to fresh?', a: 'Dried leaves store and ship easily. Use about two to three times the dried amount compared with fresh for a similar aroma.' },
      { q: 'What dishes work best?', a: 'Tadka for dal, sambar, rasam, lemon rice, potato curry, and coconut gravies — any recipe calling for curry leaf.' },
      { q: 'How should I store them?', a: 'Keep the pouch sealed in a cool cupboard away from the stove. Flavour stays strong six months or longer when stored airtight.' },
    ],
    disclaimer: [
      '<strong>Legal disclaimer:</strong> NutriThrive is operated from Truganina, VIC (ABN 32 639 442 616). We are not doctors or health practitioners.',
      '<strong>These statements have not been evaluated by the TGA.</strong> Dried curry leaves are a food ingredient, not intended to diagnose, treat, cure, or prevent any disease.',
    ],
  },
  {
    file: 'products/black-tea/index.html',
    crumb: 'Darjeeling Black Tea',
    h1: 'Darjeeling Black Tea Australia — Premium First Flush',
    price: 7.5, was: 10,
    packLine: '100g pack · premium grade · loose leaf',
    badgeSeller: 'Tea lovers',
    image: '/assets/images/homepage/product-showcase/BlackTea.webp',
    imageAlt: 'Darjeeling black tea — NutriThrive Melbourne',
    addFn: 'addBlackTeaToCart', buyFn: 'buyBlackTeaNow',
    features: [
      { icon: ICONS.cup, title: 'Muscatel Notes', text: 'Delicate floral-fruity aroma — the champagne of teas.' },
      { icon: ICONS.leaf, title: 'Loose Leaf', text: 'Whole leaves — better flavour than dusty tea bags.' },
      { icon: ICONS.check, title: 'Moderate Caffeine', text: 'About 40–50 mg per cup — gentler than coffee.' },
      { icon: ICONS.clock, title: 'Melbourne Packed', text: 'Packed fresh in Truganina, ships Australia-wide.' },
    ],
    sideCard: { title: 'Brewing at a glance', body: '1–2 tsp per cup · 85–90°C water (not boiling) · steep 3–5 minutes. Enjoy plain or with a splash of milk.', note: '100g ≈ 50 cups at 2 tsp per pot' },
    aboutTitle: 'About Our Darjeeling',
    aboutParas: [
      'Darjeeling black tea comes from high-altitude gardens in the Himalayas. Ours is selected for muscatel aroma and a smooth finish — good for morning cups or an afternoon break.',
      'Packed in Melbourne with fast AU-wide delivery. Pair with <a href="/products/moringa-powder/">moringa powder</a> if you want a caffeine-free option on alternate days — see our <a href="/blog/moringa-vs-coffee-melbourne-energy-hack">moringa vs coffee guide</a>.',
    ],
    meta: [
      { dt: 'Taste profile', dd: 'Floral, fruity muscatel — smooth, not bitter when brewed correctly.' },
      { dt: 'Origin', dd: 'Darjeeling gardens · packed in Truganina, Melbourne.' },
    ],
    howTitle: 'How to Brew',
    howSub: 'Temperature matters — boiling water can make Darjeeling bitter.',
    howCards: [
      { title: 'Measure', text: '1–2 teaspoons of loose leaf per cup (or per small pot).' },
      { title: 'Steep', text: 'Heat water to 85–90°C. Steep 3–5 minutes for optimal flavour.' },
      { title: 'Enjoy', text: 'Drink plain to taste nuance, or add milk and honey for a breakfast-style cup.' },
    ],
    reviewsRating: '4.5/5 from verified buyers',
    reviews: [
      { stars: 5, quote: '"Darjeeling brews clean at 90°C. Nice afternoon cup without the jitters."', initials: 'HW', name: 'Helen W.', meta: 'Melbourne, VIC' },
      { stars: 5, quote: '"Smooth, aromatic, perfectly balanced — became my go-to morning tea."', initials: 'MT', name: 'Mark T.', meta: 'Sydney, NSW' },
      { stars: 5, quote: '"Rich aroma without bitterness. One of the best Darjeeling brands I\'ve tried in Australia."', initials: 'DK', name: 'David K.', meta: 'Brisbane, QLD' },
    ],
    reviewsNote: 'Individual experiences only. Not medical advice.',
    guides: [
      { href: '/blog/moringa-vs-coffee-melbourne-energy-hack', label: 'Moringa vs coffee for energy' },
      { href: '/products/combo-pack/', label: 'Combo pack (tea + moringa + curry leaves)' },
      { href: '/products/moringa-powder/', label: 'Moringa powder' },
    ],
    faqs: [
      { q: 'What makes Darjeeling special?', a: 'High-altitude Himalayan gardens give a unique muscatel flavour — often called the champagne of teas.' },
      { q: 'How much caffeine?', a: 'About 40–50 mg per cup — a gentle lift without the coffee crash for most people.' },
      { q: 'Can I add milk?', a: 'Yes. Darjeeling works plain or with milk as a breakfast-style cup.' },
      { q: 'Payments & shipping?', a: 'Visa, bank transfer, cash, and PayPal. Free AU shipping on orders $80+. Dispatch within 2 business days.' },
    ],
    disclaimer: [
      '<strong>Legal disclaimer:</strong> NutriThrive is operated from Truganina, VIC (ABN 32 639 442 616).',
      '<strong>These statements have not been evaluated by the TGA.</strong> Black tea is a food beverage. Consult your GP if you are sensitive to caffeine.',
    ],
  },
  {
    file: 'products/combo-pack/index.html',
    crumb: 'Premium Combo Pack',
    h1: 'Premium Combo Pack — Moringa, Tea & Curry Leaves',
    price: 17, was: 22.49,
    packLine: 'Best value · save $5.49 vs buying separately',
    badgeSeller: 'Best value',
    image: '/assets/images/homepage/product-showcase/combo.webp',
    imageAlt: 'NutriThrive premium combo pack — moringa, tea, curry leaves',
    addFn: 'addComboPackToCart', buyFn: 'buyComboPackNow',
    features: [
      { icon: ICONS.box, title: 'Three Pantry Staples', text: '100g moringa, 100g Darjeeling tea, 30g curry leaves.' },
      { icon: ICONS.check, title: 'Lab-Tested Moringa', text: 'Shade-dried moringa with NMI summary on file.' },
      { icon: ICONS.leaf, title: 'Real Kari Leaf', text: 'Aromatic dried curry leaves for tadka and dals.' },
      { icon: ICONS.cup, title: 'Premium Tea', text: 'Loose-leaf Darjeeling for daily cups.' },
    ],
    sideCard: { title: "What's in the box", body: '<strong>100g</strong> moringa powder · <strong>100g</strong> Darjeeling black tea · <strong>30g</strong> dried curry leaves. One shipment, three staples.', note: 'Bundle price $17.00 (RRP $22.49)' },
    aboutTitle: 'About the Combo Pack',
    aboutParas: [
      'Morning smoothie moringa, afternoon Darjeeling, evening tadka with kari leaf — one box covers the basics without three separate orders.',
      'Moringa is NMI lab-tested; tea and curry leaves are packed in the same Truganina warehouse. See <a href="/blog/high-protein-moringa-recipes-australia-2026">moringa recipes</a> and our <a href="/blog/nutrithrive-dried-curry-leaves-tradition-health">curry leaf guide</a> to get started.',
    ],
    meta: [
      { dt: 'Best for', dd: 'New customers sampling the range, or gifts for health-conscious cooks.' },
      { dt: 'Dispatch', dd: 'Same-day Melbourne dispatch before 2pm on business days.' },
    ],
    howTitle: 'How to Use the Pack',
    howSub: 'A simple weekly rhythm most customers follow.',
    howCards: [
      { title: 'Morning', text: '½–1 tsp moringa in a smoothie or juice.' },
      { title: 'Afternoon', text: 'Steep Darjeeling at 85–90°C for a muscatel cup.' },
      { title: 'Evening', text: 'Fry curry leaves in ghee for dal, rice, or vegetable dishes.' },
    ],
    reviewsRating: '5/5 from verified buyers',
    reviews: [
      { stars: 5, quote: '"Fantastic value — all my NutriThrive staples in one box. Fast shipping to Perth."', initials: 'OC', name: 'Olivia C.', meta: 'Perth, WA' },
      { stars: 5, quote: '"Bought as a gift — quality of each product is top-notch. Great introduction to the range."', initials: 'DH', name: 'Daniel H.', meta: 'Brisbane, QLD' },
      { stars: 5, quote: '"Amazing value for reordering essentials. Everything arrived fresh and well-packaged."', initials: 'SK', name: 'Sophie K.', meta: 'Adelaide, SA' },
    ],
    reviewsNote: 'Individual experiences only. Not medical advice.',
    guides: [
      { href: '/blog/high-protein-moringa-recipes-australia-2026', label: 'High-protein moringa recipes' },
      { href: '/blog/nutrithrive-dried-curry-leaves-tradition-health', label: 'Curry leaves guide' },
      { href: '/products/moringa-powder/', label: 'Moringa powder (single)' },
      { href: '/products/black-tea/', label: 'Darjeeling tea (single)' },
    ],
    faqs: [
      { q: 'What is included?', a: '100g moringa powder, 100g Darjeeling black tea, and 30g dried curry leaves.' },
      { q: 'How much do I save?', a: '$5.49 vs buying each item at listed RRP ($22.49 → $17.00).' },
      { q: 'Is the moringa lab-tested?', a: 'Yes — NMI heavy-metal summary available on the moringa product page and PDF.' },
      { q: 'Payments & shipping?', a: 'Free AU shipping on orders $80+. Dispatch within 2 business days from Melbourne.' },
    ],
    disclaimer: [
      '<strong>Legal disclaimer:</strong> NutriThrive is operated from Truganina, VIC (ABN 32 639 442 616).',
      '<strong>These statements have not been evaluated by the TGA.</strong> Products are food ingredients, not intended to treat disease.',
    ],
  },
  {
    file: 'products/moringa-soap/index.html',
    crumb: 'Moringa Soap',
    h1: 'Moringa Soap Australia — Handmade 95g Bar',
    price: 7, was: 9.49,
    packLine: '95g bar · natural · small-batch handmade',
    badgeSeller: 'Skincare',
    image: '/assets/images/homepage/product-showcase/moringa_soap.webp',
    imageAlt: 'NutriThrive moringa soap bar — Melbourne handmade',
    addFn: 'addSoapToCart', buyFn: 'buySoapNow',
    features: [
      { icon: ICONS.soap, title: 'Handmade', text: 'Small-batch cold-process bar made in Australia.' },
      { icon: ICONS.leaf, title: 'Moringa in the Mix', text: 'Same moringa leaf we sell as powder — in soap form.' },
      { icon: ICONS.check, title: 'Gentle Formula', text: 'No parabens or synthetic fragrance — suits most skin types.' },
      { icon: ICONS.clock, title: 'Melbourne Packed', text: 'Ships from Truganina with fast AU-wide delivery.' },
    ],
    sideCard: { title: 'Bar care', body: 'Let the bar dry between uses on a draining dish — typically lasts 4–6 weeks with daily use. Keep out of direct shower spray when not in use.', note: '95g net · vegan · cruelty-free' },
    aboutTitle: 'About Moringa Soap',
    aboutParas: [
      'A straightforward 95g bar with moringa leaf in the recipe. Cleanses without the stripped, tight feeling some commercial soaps leave.',
      'Pair with <a href="/products/moringa-powder/">moringa powder</a> for inside-out routine, or try the <a href="/products/moringa-powder/">moringa + soap combo</a> on the moringa page.',
    ],
    meta: [
      { dt: 'Skin feel', dd: 'Mild lather, light natural scent — not perfumed.' },
      { dt: 'Made in', dd: 'Handmade in Australia · packed in Melbourne.' },
    ],
    howTitle: 'How to Use',
    howSub: 'Simple daily wash — face or body.',
    howCards: [
      { title: 'Lather', text: 'Wet skin and bar. Work into hands or directly on body.' },
      { title: 'Cleanse', text: 'Massage gently, then rinse thoroughly.' },
      { title: 'Store', text: 'Keep on a draining dish so the bar dries between uses.' },
    ],
    reviewsRating: '4.9/5 from verified buyers',
    reviews: [
      { stars: 5, quote: '"Sensitive skin — no sting, no tight feeling after a shower. Mild smell, bar lasts if you let it dry."', initials: 'MT', name: 'Michael T.', meta: 'Sydney, NSW' },
      { stars: 5, quote: '"Skin feels soft and clean. Love that it\'s natural and doesn\'t dry me out like other soaps."', initials: 'SL', name: 'Sarah L.', meta: 'Melbourne, VIC' },
      { stars: 5, quote: '"Best natural soap I\'ve used — you can tell it\'s handmade. Kids with sensitive skin use it too."', initials: 'ER', name: 'Emma R.', meta: 'Brisbane, QLD' },
    ],
    reviewsNote: 'Cosmetic product — individual experiences only.',
    guides: [
      { href: '/products/moringa-powder/', label: 'Moringa powder' },
      { href: '/products/combo-pack/', label: 'Combo pack' },
      { href: '/blog/how-to-add-moringa-to-diet', label: 'How to add moringa to your diet' },
    ],
    faqs: [
      { q: 'Is it suitable for sensitive skin?', a: 'Formulated to be gentle — no harsh chemicals or synthetic fragrance. Patch-test if you have very reactive skin.' },
      { q: 'Can I use it on my face?', a: 'Yes — many customers use it as a daily face and body wash.' },
      { q: 'How long does one bar last?', a: 'About 4–6 weeks with daily use if kept dry between showers.' },
      { q: 'Is it vegan?', a: 'Yes — 100% vegan and cruelty-free.' },
    ],
    disclaimer: [
      '<strong>Legal disclaimer:</strong> NutriThrive is operated from Truganina, VIC (ABN 32 639 442 616).',
      '<strong>These statements have not been evaluated by the TGA.</strong> Moringa soap is a cosmetic wash, not intended to diagnose, treat, cure, or prevent disease.',
    ],
  },
];

for (const p of products) {
  const filePath = path.join(ROOT, p.file);
  let html = fs.readFileSync(filePath, 'utf8');
  const mainRe = /<main class="product-main">[\s\S]*?<\/main>/;
  if (!mainRe.test(html)) {
    console.warn('Skip (no main):', p.file);
    continue;
  }
  html = html.replace(mainRe, buildMain(p));
  if (!html.includes('product-pdp-ui')) {
    html = html.replace(
      '<script src="/scripts/global/script.min.js"',
      '<script src="/shared/js/product-pdp-ui.min.js"></script>\n    <script src="/scripts/global/script.min.js"'
    );
  }
  fs.writeFileSync(filePath, html);
  console.log('Updated', p.file);
}

console.log('Done.');
