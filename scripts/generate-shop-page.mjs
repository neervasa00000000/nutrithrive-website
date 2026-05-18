#!/usr/bin/env node
/**
 * Fast /products/ page — static HTML grid, no Tailwind CDN.
 * Run: node scripts/generate-shop-page.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const OUT = path.join(REPO, 'products/index.html');

function loadSiteData() {
  const src = fs.readFileSync(path.join(REPO, 'shared/site-data.js'), 'utf8');
  globalThis.window = globalThis;
  const fn = new Function('globalThis', `${src}\n;return globalThis.NT_SITE_DATA;`);
  return fn(globalThis);
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

function imgUrl(pathname) {
  if (!pathname) return '';
  if (/^https?:\/\//i.test(pathname)) return pathname;
  return pathname
    .split('/')
    .map((seg) => (seg ? encodeURIComponent(decodeURIComponent(seg)) : seg))
    .join('/');
}

function productCard(p, { lcp = false } = {}) {
  const href = p.href || `/products/${p.id}/`;
  const title = p.shortName || p.name;
  const cartName = p.cartName || title;
  const thumb = imgUrl(p.thumb || p.image);
  const fullImg = imgUrl(p.image);
  const was =
    p.was != null ? `<span class="nt-shop-was">${money(p.was)}</span>` : '';
  const imgAttrs = lcp
    ? 'loading="eager" fetchpriority="high" decoding="sync"'
    : 'loading="lazy" decoding="async"';
  const cartIcon =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6h14l-1.5 9h-11L6 6z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 6L5 3H2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="19" r="1.25" fill="currentColor"/><circle cx="17" cy="19" r="1.25" fill="currentColor"/><path d="M12 9v5M9.5 11.5H14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

  return `<li class="nt-shop-card" id="${esc(p.id)}">
  <a href="${esc(href)}" class="nt-shop-card-media">
    <img class="nt-shop-card-img" src="${esc(thumb)}" alt="${esc(title)}" width="280" height="280" ${imgAttrs} sizes="(max-width: 640px) 45vw, 220px"/>
    <span class="nt-shop-badge">${esc(p.badge || 'New')}</span>
  </a>
  <div class="nt-shop-card-body">
    <h3 class="nt-shop-card-title"><a href="${esc(href)}">${esc(title)}</a></h3>
    <p class="nt-shop-card-tag">${esc(p.tag || '')}</p>
    <div class="nt-shop-card-footer">
      <div>
        <span class="nt-shop-price">${money(p.price)}</span>
        ${was}
      </div>
      <button type="button" class="nt-add-cart-btn" data-add-cart="${esc(p.id)}" data-name="${esc(cartName)}" data-price="${p.price}" data-was="${p.was ?? ''}" data-image="${esc(fullImg)}" data-weight="${p.weight ?? ''}" aria-label="Add ${esc(title)} to cart">${cartIcon}</button>
    </div>
  </div>
</li>`;
}

function extractJsonLd(liveHtml) {
  const m = liveHtml.match(
    /<script type="application\/ld\+json" id="nutri-thrive-local-business-jsonld">[\s\S]*?<\/script>/i
  );
  return m ? m[0] : '';
}

function extractMetaBlock(liveHtml) {
  const parts = [];
  const canonical = liveHtml.match(/<link rel="canonical"[^>]*>/i)?.[0];
  if (canonical) parts.push(canonical);
  const desc = liveHtml.match(/<meta name="description"[^>]*>/i)?.[0];
  if (desc) parts.push(desc);
  const robots = liveHtml.match(/<meta name="robots"[^>]*>/i)?.[0];
  if (robots) parts.push(robots);
  for (const m of liveHtml.matchAll(/<meta property="og:[^"]+"[^>]*>/gi)) parts.push(m[0]);
  for (const m of liveHtml.matchAll(/<meta property="twitter:[^"]+"[^>]*>/gi)) parts.push(m[0]);
  for (const m of liveHtml.matchAll(/<link rel="alternate"[^>]*>/gi)) parts.push(m[0]);
  return parts.join('\n    ');
}

function footerHtml(d) {
  const cols = (d.footerNav || [])
    .map(
      (col) => `<div>
        <h3>${esc(col.title)}</h3>
        <ul>${col.links
          .map((link) => {
            const href =
              link.file.startsWith('http') || link.file.startsWith('/')
                ? link.file
                : `/${link.file}`;
            return `<li><a href="${esc(href)}">${esc(link.label)}</a></li>`;
          })
          .join('')}</ul>
      </div>`
    )
    .join('');
  const year = new Date().getFullYear();
  return `<footer class="nt-shop-footer">
  <div class="nt-shop-footer-inner">
    <div>
      <a class="nt-shop-footer-brand" href="/">${esc(d.brand)}</a>
      <p class="nt-shop-footer-tagline">${esc(d.footerTagline || d.tagline || '')}</p>
    </div>
    ${cols}
    <div>
      <h3>Contact</h3>
      <ul>
        <li><a href="mailto:${esc(d.contact.email)}">${esc(d.contact.email)}</a></li>
        <li><a href="tel:${esc(d.contact.phoneTel)}">${esc(d.contact.phone)}</a></li>
      </ul>
    </div>
  </div>
  <p class="nt-shop-footer-copy">© ${year} ${esc(d.brand)}</p>
</footer>`;
}

export function generateShopPage() {
  const data = loadSiteData();
  const products = data.getCatalogProducts();
  if (!products.length) throw new Error('No catalog products');

  const liveHtml = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  const title =
    liveHtml.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ||
    'Shop Moringa, Curry Leaves & Black Tea | Melbourne AU';
  const meta = extractMetaBlock(liveHtml);
  const jsonLd = extractJsonLd(liveHtml);
  const lcpThumb = imgUrl(products[0].thumb || products[0].image);
  const cards = products.map((p, i) => productCard(p, { lcp: i === 0 })).join('');

  let html = `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(title)}</title>
    ${meta}
${jsonLd}
<link rel="preload" as="image" href="${esc(lcpThumb)}" fetchpriority="high"/>
<link rel="stylesheet" href="/shared/css/shop-page.css"/>
<link rel="icon" href="/assets/images/logo/LOGO.webp" type="image/webp"/>
</head>
<body class="nt-shop">
<div class="nt-sticky-top">
  <div class="nt-promo-bar">⏰ Order before 2pm for same-day Melbourne dispatch • 🚚 Free shipping over $80 • 📦 Small batches—fresh stock guaranteed</div>
  <header class="nt-shop-header">
    <nav class="nt-shop-nav" aria-label="Main">
      <a class="nt-shop-brand" href="/">${esc(data.brand)}</a>
      <ul class="nt-shop-links">
        <li><a class="is-active" href="/products/">Shop</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/blog/">Blog</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
      <div class="nt-shop-actions">
        <a class="nt-shop-faq" href="/faq">FAQ</a>
        <a class="nt-cart-link" href="/cart" aria-label="Cart">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6h15l-1.5 9h-12L6 6z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 6L5 3H2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="19" r="1.25" fill="currentColor"/><circle cx="17" cy="19" r="1.25" fill="currentColor"/></svg>
          <span class="nt-cart-badge" data-cart-count hidden>0</span>
        </a>
        <button type="button" class="nt-menu-btn" id="nt-menu-btn" aria-label="Open menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>
      </div>
    </nav>
    <div class="nt-mobile-drawer" id="nt-mobile-drawer">
      <a href="/products/">Shop</a>
      <a href="/about">About</a>
      <a href="/blog/">Blog</a>
      <a href="/contact">Contact</a>
      <a href="/faq">FAQ</a>
    </div>
  </header>
</div>
<main class="nt-shop-main">
  <h1>Shop Premium Wellness</h1>
  <p class="nt-shop-intro">Sourced for purity — moringa, curry leaves, tea, combo packs and natural soap. Lab-tested batches, packed in Truganina, Melbourne.</p>
  <h2>Our products</h2>
  <ul id="nt-shop-grid" class="nt-shop-grid" data-static-shop="1">
    ${cards}
  </ul>
  <p class="nt-shop-note">Tracked delivery Australia-wide. Free standard shipping on orders $80+.</p>
</main>
${footerHtml(data)}
<script defer src="/scripts/global/cart.js"></script>
<script defer src="/shared/js/shop-page.js"></script>
<script>
(function(){var ri=function(){var s=document.createElement('script');s.src='/scripts/global/reddit-pixel.js';s.defer=true;document.body.appendChild(s);};if(typeof requestIdleCallback==='function')requestIdleCallback(ri,{timeout:3000});else setTimeout(ri,2500);})();
window.addEventListener('load',function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-WH21SW75WP';document.head.appendChild(s);window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-WH21SW75WP');});
</script>
</body>
</html>`;

  fs.writeFileSync(OUT, html);
  console.log('Wrote', OUT, `(${products.length} products, static HTML)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateShopPage();
}
