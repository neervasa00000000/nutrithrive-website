#!/usr/bin/env node
/**
 * Replace legacy static footers with v2 footer placeholder + scripts.
 * Does not touch blog v2 shell pages (already have #nt-footer).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const LEGACY_FILES = [
  'index.html',
  'products/index.html',
  'products/moringa-powder/index.html',
  'products/curry-leaves/index.html',
  'products/black-tea/index.html',
  'products/combo-pack/index.html',
  'products/moringa-soap/index.html',
  'pages/about/about.html',
  'pages/contact/contact.html',
  'pages/faq/faq.html',
  'pages/shop/cart.html',
  'pages/shop/payment.html',
  'pages/shop/thank-you.html',
  'pages/shipping/shipping-returns.html',
  'pages/newsletter/index.html',
  'pages/newsletter/thank-you.html',
  'pages/legal/privacy-policy.html',
  'pages/homepage/melbourne.html',
  'pages/melbourne-page.html',
  'buy-moringa-powder-australia/index.html',
  'pages/contact/thank-you.html',
];

const SCRIPTS = `<script src="/shared/site-data.js"></script>
<script src="/shared/js/footer-v2.js"></script>`;

const footerRe = /<footer[^>]*>[\s\S]*?<\/footer>/i;

let updated = 0;
let skipped = 0;

for (const rel of LEGACY_FILES) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    console.warn('skip missing:', rel);
    skipped++;
    continue;
  }
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('id="nt-footer"') && !footerRe.test(html)) {
    console.log('already v2 footer:', rel);
    skipped++;
    continue;
  }

  const hadFooter = footerRe.test(html);
  if (hadFooter) {
    html = html.replace(footerRe, '<div id="nt-footer"></div>');
  } else if (!html.includes('id="nt-footer"')) {
    // thank-you style pages: inject before </body>
    html = html.replace(/<\/body>/i, '<div id="nt-footer"></div>\n</body>');
  }

  if (!html.includes('shared/site-data.js')) {
    html = html.replace(/<\/body>/i, `${SCRIPTS}\n</body>`);
  } else if (!html.includes('footer-v2.js')) {
    html = html.replace(
      /<script[^>]*src="\/shared\/site-data\.js"[^>]*><\/script>/i,
      `$&\n<script src="/shared/js/footer-v2.js"></script>`
    );
  }

  fs.writeFileSync(file, html);
  console.log('updated:', rel);
  updated++;
}

// Blog: ensure footer-v2.js loads before layout-v2.js
const blogDir = path.join(root, 'blog');
const blogFiles = fs.readdirSync(blogDir).filter((f) => f.endsWith('.html'));
let blogUpdated = 0;
for (const f of blogFiles) {
  const file = path.join(blogDir, f);
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('layout-v2.js')) continue;
  if (html.includes('footer-v2.js')) continue;
  html = html.replace(
    /<script src="\/shared\/js\/layout-v2\.js"><\/script>/,
    '<script src="/shared/js/footer-v2.js"></script>\n<script src="/shared/js/layout-v2.js"></script>'
  );
  fs.writeFileSync(file, html);
  blogUpdated++;
}
console.log(`\nLegacy updated: ${updated}, skipped: ${skipped}, blog scripts: ${blogUpdated}`);
