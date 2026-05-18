#!/usr/bin/env node
/**
 * Perf patch for live index.html + products/index.html.
 * Run: node scripts/patch-v2-perf-live.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildPerfHeadBlock, dedupeTailwindConfig } from './lib/v2-head-perf.mjs';
import { patchShopGridBody } from './lib/shop-static-html.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(file) {
  return fs.readFileSync(path.join(REPO, file), 'utf8');
}

function write(file, html) {
  fs.writeFileSync(path.join(REPO, file), html);
}

function insertPerfHead(html, { shop = false } = {}) {
  const block = buildPerfHeadBlock({ shop });
  let out = html;
  if (!out.includes('/shared/css/critical.css')) {
    out = out.replace(
      /(<meta name="viewport" content="width=device-width, initial-scale=1\.0"\s*\/?>)/i,
      `$1\n${block}`
    );
  }
  const lcpHref = shop
    ? '/assets/images/product_photos/webp/moringa.webp'
    : '/assets/images/blog/GC.webp';
  if (!out.includes(`rel="preload" as="image" href="${lcpHref}"`)) {
    out = out.replace(
      /(<link rel="stylesheet" href="\/shared\/css\/critical\.css">)/i,
      `$1\n<link rel="preload" as="image" href="${lcpHref}" fetchpriority="high">`
    );
  }
  return out;
}

function removeDupViewport(html) {
  let n = 0;
  return html.replace(/<meta[^>]*name="viewport"[^>]*>/gi, (m) => {
    n += 1;
    return n === 1 ? m : '';
  });
}

function removeHomepageJsPreload(html) {
  return html
    .replace(/<link[^>]*rel="preload"[^>]*homepage\.js[^>]*>\s*/gi, '')
    .replace(/<!-- Preload critical resources -->[\s\S]*?(?=<link rel="icon"|<script id="tailwind-config")/gi, '');
}

function dedupeIconLinks(html) {
  let seen = false;
  return html.replace(/<link rel="icon" href="\/assets\/images\/logo\/LOGO\.webp"\s*\/?>\s*/gi, (m) => {
    if (seen) return '';
    seen = true;
    return m;
  });
}

function deferGtag(html) {
  if (html.includes("addEventListener('load'") && html.includes('googletagmanager.com/gtag/js')) {
    return html.replace(
      /<script defer src="https:\/\/www\.googletagmanager\.com\/gtag\/js[^>]*><\/script>\s*<script>[\s\S]*?gtag\('config'[^<]*<\/script>/,
      ''
    );
  }
  const deferBlock = `<script>
  window.addEventListener('load', function() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-WH21SW75WP';
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-WH21SW75WP', { anonymize_ip: true, allow_google_signals: false });
  });
</script>`;
  if (html.includes(deferBlock.trim().slice(0, 40))) return html;
  return html.replace(/<meta charset="utf-8"\s*\/?>/i, `$&\n${deferBlock}`);
}

function deferAnalyticsScripts(html) {
  return html
    .replace(
      /<script src="\/scripts\/global\/defer-loader\.js"><\/script>/g,
      '<script src="/scripts/global/defer-loader.js" defer></script>'
    )
    .replace(
      /<script src="\/scripts\/global\/reddit-pixel\.js"><\/script>/g,
      '<script src="/scripts/global/reddit-pixel.js" defer></script>'
    );
}

function patchHero(html) {
  let out = html.replace(
    /<section class="relative min-h-\[85vh\] flex items-center overflow-hidden bg-parchment-base">/,
    '<section class="nt-hero-lcp relative min-h-[85vh] flex items-center overflow-hidden bg-parchment-base">'
  );
  out = out.replace(
    /<link[^>]*rel="preload"[^>]*GC\.webp[^>]*>\s*/gi,
    ''
  );
  out = out.replace(
    /<img alt="Nutri Thrive Moringa Powder[^"]*" class="w-full h-auto drop-shadow-2xl rounded-2xl[^"]*" src="\/assets\/images\/blog\/GC\.webp"\/>/,
    '<img alt="NutriThrive moringa powder in a traditional stone mortar" class="nt-hero-img w-full h-auto drop-shadow-2xl rounded-2xl transform md:rotate-2" src="/assets/images/blog/GC.webp" width="1063" height="1063" fetchpriority="high" loading="eager" decoding="async"/>'
  );
  return out;
}

function patchFile(file, opts) {
  let html = read(file);
  html = dedupeTailwindConfig(html);
  html = removeDupViewport(html);
  html = removeHomepageJsPreload(html);
  html = insertPerfHead(html, opts);
  html = deferGtag(html);
  if (opts.home) html = patchHero(html);
  if (opts.shop) {
    const bodyStart = html.indexOf('<body');
    const bodyEnd = html.lastIndexOf('</body>');
    let body = html.slice(bodyStart, bodyEnd);
    body = patchShopGridBody(body);
    body = body.replace(/<main class="pt-28/, '<main class="nt-shop-lcp pt-28');
    html = html.slice(0, bodyStart) + body + html.slice(bodyEnd);
  }
  html = deferAnalyticsScripts(html);
  html = dedupeIconLinks(html);
  html = dedupeTailwindConfig(html);
  write(file, html);
  const count = (html.match(/id="tailwind-config"/g) || []).length;
  console.log(`Patched ${file} (tailwind-config blocks: ${count})`);
}

patchFile('index.html', { home: true });
patchFile('products/index.html', { shop: true });
