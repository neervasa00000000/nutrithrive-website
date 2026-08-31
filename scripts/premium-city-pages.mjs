#!/usr/bin/env node
/**
 * Apply premium layout classes + location switcher to city landing pages.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'site');

const LOCATIONS = [
  { slug: 'melbourne', href: '/melbourne/', label: 'Melbourne', eyebrow: 'Melbourne · Victoria' },
  { slug: 'moringa-sydney', href: '/moringa-sydney/', label: 'Sydney', eyebrow: 'Sydney · New South Wales' },
  { slug: 'moringa-brisbane', href: '/moringa-brisbane/', label: 'Brisbane', eyebrow: 'Brisbane · Queensland' },
  { slug: 'moringa-perth', href: '/moringa-perth/', label: 'Perth', eyebrow: 'Perth · Western Australia' },
  { slug: 'moringa-adelaide', href: '/moringa-adelaide/', label: 'Adelaide', eyebrow: 'Adelaide · South Australia' },
];

function locationNav(activeSlug) {
  const items = LOCATIONS.map(
    (l) =>
      `<li><a href="${l.href}" class="city-locations__link${l.slug === activeSlug ? ' is-active' : ''}"${l.slug === activeSlug ? ' aria-current="page"' : ''}>${l.label}</a></li>`
  ).join('\n');
  return `<nav class="city-locations" aria-label="Deliver to">
  <span class="city-locations__label">Deliver to</span>
  <ul class="city-locations__list">${items}
  </ul>
</nav>`;
}

function transformCityHtml(html, slug, eyebrow) {
  if (!html.includes('city-locations')) {
    html = html.replace(
      /<nav class="city-crumb"[^>]*>[\s\S]*?<\/nav>\s*/,
      (m) => `${m}\n${locationNav(slug)}\n`
    );
  }

  if (!html.includes('city-hero-header')) {
    html = html.replace(
      /(<nav class="city-locations"[\s\S]*?<\/nav>\s*)\n*<h1>/,
      `$1\n<header class="city-hero-header">\n<p class="city-eyebrow">${eyebrow}</p>\n<h1>`
    );
    html = html.replace(
      /(<\/h1>\s*)\n*(\s*<div class="city-delivery-strip")/,
      `$1\n<div class="city-hero-meta">\n$2`
    );
    html = html.replace(
      /(<span class="city-trust-badge"[^>]*>[\s\S]*?<\/span>)\s*\n*<\/header>?/,
      `$1\n</div>\n</header>`
    );
    if (!html.includes('</header>')) {
      html = html.replace(
        /(<span class="city-trust-badge"[^>]*>[\s\S]*?<\/span>)\s*\n*(<p class="lead">)/,
        `$1\n</div>\n</header>\n\n$2`
      );
    }
  }

  html = html.replace(
    /<div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin:2rem 0;background:#f0f9f4;border-radius:10px;padding:2rem;">\s*<div>\s*<img([^>]*) style="width:100%;border-radius:8px;"([^>]*)>\s*<\/div>\s*<div>\s*((?:<p style="margin:0\.35rem 0;font-size:1rem;">[^<]*<\/p>\s*)+)/g,
    (match, imgA, imgB, checklist) => {
      const items = [...checklist.matchAll(/<p[^>]*>([^<]*)<\/p>/g)]
        .map((m) => m[1].replace(/^✅\s*/, '').trim())
        .map((t) => `<li>${t}</li>`)
        .join('\n');
      return `<div class="city-hero-grid">
  <div class="city-hero-grid__media">
    <img${imgA}${imgB}>
  </div>
  <div class="city-hero-grid__body">
    <ul class="city-hero-checklist">
${items}
    </ul>`;
    }
  );

  html = html.replace(
    /<div style="margin:1\.25rem 0;">\s*<p style="font-size:1\.5rem;font-weight:800;color:#1a5c36;margin:0;">([^<]*)<\/p>\s*<p style="color:#666;font-size:0\.95rem;margin:0\.25rem 0 0;">([^<]*)<\/p>\s*<\/div>/g,
    `<p class="city-hero-price">$1</p>\n    <p class="city-hero-perday">$2</p>`
  );

  html = html.replace(
    /<a href="\/products\/moringa-powder\/" style="display:block;background:#1a5c36;color:#fff;text-align:center;padding:0\.85rem 1\.5rem;border-radius:6px;font-weight:700;font-size:1\.05rem;text-decoration:none;margin-bottom:0\.75rem;">([^<]*)<\/a>/g,
    `<a href="/products/moringa-powder/" class="city-cta-btn">$1</a>`
  );

  html = html.replace(
    /<p style="font-size:0\.9rem;color:#555;margin:0;">([^<]*)<\/p>\s*<\/div>\s*<\/div>/g,
    `<p class="city-hero-note">$1</p>\n  </div>\n</div>`
  );

  html = html.replace(
    /<div style="background:#fff9e6;border:1px solid #e6c853;border-radius:8px;padding:1rem 1\.25rem;margin:1rem 0 2rem;">/g,
    `<div class="city-callout">`
  );

  html = html.replace(/<section style="margin:2\.5rem 0;">/g, '<section class="city-section">');
  html = html.replace(/<h2 style="font-size:1\.35rem;margin-bottom:0\.75rem;">/g, '<h2>');

  html = html.replace(
    /<table style="width:100%;border-collapse:collapse;font-size:0\.95rem;">([\s\S]*?)<\/table>/g,
    (m, inner) => {
      let body = inner
        .replace(/<thead>\s*<tr style="background:#1a5c36;color:#fff;">/g, '<thead><tr>')
        .replace(/<th style="padding:0\.7rem 1rem;text-align:left;border-radius:6px 0 0 0;">/g, '<th>')
        .replace(/<th style="padding:0\.7rem 1rem;text-align:center;border-radius:0 6px 0 0;">/g, '<th>')
        .replace(/<th style="padding:0\.7rem 1rem;text-align:center;">/g, '<th>')
        .replace(/<tr style="background:#fff;border:2px solid #1a5c36;">/g, '<tr class="is-highlight">')
        .replace(/<tr style="background:#fff;">/g, '<tr>')
        .replace(/<tr style="background:#f9fdf9;">/g, '<tr>')
        .replace(/<td style="padding:0\.65rem 1rem;border-bottom:1px solid #e8f5ee;font-weight:700;color:#1a5c36;">/g, '<td class="price-cell price-cell--accent">')
        .replace(/<td style="padding:0\.65rem 1rem;text-align:center;border-bottom:1px solid #e8f5ee;font-weight:700;">/g, '<td class="price-cell">')
        .replace(/<td style="padding:0\.65rem 1rem;text-align:center;border-bottom:1px solid #e8f5ee;font-weight:700;color:#1a5c36;">/g, '<td class="price-cell price-cell--accent">')
        .replace(/<td style="padding:0\.65rem 1rem;border-bottom:1px solid #e8f5ee;">/g, '<td>')
        .replace(/<td style="padding:0\.65rem 1rem;text-align:center;border-bottom:1px solid #e8f5ee;">/g, '<td>')
        .replace(/<td style="padding:0\.65rem 1rem;text-align:center;border-bottom:1px solid #e8f5ee;font-weight:700;color:#1a5c36;">/g, '<td class="price-cell price-cell--accent">')
        .replace(/<td style="padding:0\.65rem 1rem;">/g, '<td>')
        .replace(/<td style="padding:0\.65rem 1rem;text-align:center;font-weight:700;">/g, '<td class="price-cell">')
        .replace(/<td style="padding:0\.65rem 1rem;text-align:center;">/g, '<td>');
      return `<div class="city-table-wrap"><table class="city-pricing-table">${body}</table></div>`;
    }
  );

  html = html.replace(
    /<div style="display:grid;grid-template-columns:repeat\(auto-fit,minmax\(200px,1fr\)\);gap:1rem;margin-top:1rem;">([\s\S]*?)<\/div>/g,
    (m, inner) => {
      const cards = inner.replace(
        /<div style="background:#f0f9f4;border-radius:8px;padding:1\.25rem;">\s*<strong>([^<]*)<\/strong>\s*<p style="font-size:0\.9rem;margin:0\.5rem 0 0\.75rem;color:#444;">([^<]*)<\/p>\s*<a href="([^"]*)" style="color:#1a5c36;font-weight:600;font-size:0\.9rem;">([^<]*)<\/a>\s*<\/div>/g,
        `<article class="city-product-card"><strong>$1</strong><p>$2</p><a href="$3">$4</a></article>`
      );
      return `<div class="city-products-grid">${cards}</div>`;
    }
  );

  html = html.replace(/<ul style="line-height:2;">/g, '<ul>');
  html = html.replace(/<ul style="line-height:2\.2;">/g, '<ul class="city-guides-list">');

  html = html.replace(
    /<li><a href="([^"]*)" style="color:#1a5c36;">([^<]*)<\/a>([^<]*)<\/li>/g,
    '<li><a href="$1">$2$3</a></li>'
  );

  html = html.replace(/<a href="([^"]*)" style="color:#1a5c36;">/g, '<a href="$1">');

  html = html.replace(
    /<section class="city-section">\s*<h2>([^<]*FAQ[^<]*)<\/h2>\s*((?:<h3[\s\S]*?)+)<\/section>/g,
    (m, title, faqBody) => {
      const items = [];
      const re = /<h3[^>]*>([^<]*)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/g;
      let match;
      while ((match = re.exec(faqBody)) !== null) {
        items.push(`<article class="city-faq-item"><h3 class="city-faq-q">${match[1]}</h3><p class="city-faq-a">${match[2]}</p></article>`);
      }
      return `<section class="city-section city-faq-section"><h2>${title}</h2><div class="city-faq">${items.join('\n')}</div></section>`;
    }
  );

  html = html.replace(
    /<div style="background:#1a5c36;color:#fff;border-radius:10px;padding:2rem;text-align:center;margin:2\.5rem 0;">\s*<p style="font-size:1\.2rem;font-weight:700;margin:0 0 0\.5rem;">([^<]*)<\/p>\s*<p style="margin:0 0 1\.25rem;opacity:0\.9;">([^<]*)<\/p>\s*<a href="\/products\/moringa-powder\/" style="display:inline-block;background:#fff;color:#1a5c36;font-weight:800;padding:0\.85rem 2rem;border-radius:6px;text-decoration:none;font-size:1\.05rem;">([^<]*)<\/a>\s*<\/div>/g,
    `<div class="city-bottom-cta"><p class="city-bottom-cta__title">$1</p><p class="city-bottom-cta__sub">$2</p><a href="/products/moringa-powder/" class="city-bottom-cta__btn">$3</a></div>`
  );

  html = html.replace(
    /<\/main>\s*\n<section class="city-section city-guide-links"/,
    '\n<section class="city-section city-guide-links"'
  );
  html = html.replace(
    /(<section class="city-section city-guide-links"[\s\S]*?<\/section>)\s*\n<div id="nt-footer">/,
    '$1\n</main>\n\n<div id="nt-footer">'
  );

  html = html.replace(/<a href="\/" style="color:#1a5c36;">/g, '<a href="/">');

  return fixPostTransform(html);
}

function fixPostTransform(html) {
  html = html.replace(
    /(<span class="city-trust-badge"[^>]*>[\s\S]*?<\/span>)\s*\n\s*<p class="lead">/,
    '$1\n</div>\n</header>\n\n<p class="lead">'
  );

  html = html.replace(
    /<div style="background:#f0f9f4;border-radius:8px;padding:1\.25rem;">\s*<strong>([^<]*)<\/strong>\s*<p style="font-size:0\.9rem;margin:0\.5rem 0 0\.75rem;color:#444;">([^<]*)<\/p>\s*<a href="([^"]*)" style="color:#1a5c36;font-weight:600;font-size:0\.9rem;">([^<]*)<\/a>\s*<\/div>/g,
    '<article class="city-product-card"><strong>$1</strong><p>$2</p><a href="$3">$4</a></article>'
  );

  html = html.replace(
    /<section class="city-section city-faq-section"><h2>([^<]*)<\/h2><div class="city-faq">/g,
    '<section class="city-section city-faq-section">\n  <h2>$1</h2>\n  <div class="city-faq">'
  );

  html = html.replace(/<\/article><\/div><\/section>/g, '</article>\n  </div>\n</section>');

  html = html.replace(
    /<div class="city-bottom-cta">/g,
    '\n<div class="city-bottom-cta">'
  );

  return html;
}

for (const loc of LOCATIONS.filter((l) => l.slug !== 'melbourne')) {
  const fp = path.join(ROOT, loc.slug, 'index.html');
  let html = fs.readFileSync(fp, 'utf8');
  if (!html.includes('city-locations')) {
    html = transformCityHtml(html, loc.slug, loc.eyebrow);
  } else {
    html = fixPostTransform(html);
  }
  fs.writeFileSync(fp, html);
  console.log('Premium layout:', loc.slug);
}

const melb = path.join(SITE, 'pages/homepage/melbourne.html');
if (fs.existsSync(melb)) {
  let html = fs.readFileSync(melb, 'utf8');
  if (!html.includes('city-locations')) {
    html = html.replace(
      /<main class="melb-page">\s*/,
      `<main class="melb-page">\n${locationNav('melbourne')}\n`
    );
  }
  fs.writeFileSync(melb, html);
  console.log('Premium layout: melbourne');
}

console.log('Done.');
