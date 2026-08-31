#!/usr/bin/env node
/**
 * Strip legacy inline CSS/JS from single-SKU product pages so they match
 * the moringa PDP shell (global style + moringa-powder-new + product-pdp-ui).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'site');
const PDP_CSS = '/styles/products/moringa-powder-new.min.css?v=7';

const FILES = [
  'products/curry-leaves/index.html',
  'products/black-tea/index.html',
  'products/combo-pack/index.html',
  'products/gift-pack/index.html',
  'products/moringa-soap/index.html',
];

function stripInlineStyles(html) {
  return html.replace(/<style>[\s\S]*?<\/style>\s*/gi, (block) => {
    if (
      /accordion-content|html:not\(\.loaded\)|Mobile navigation|benefits-accordion|product-gallery,\s*\.main-image/i.test(
        block
      )
    ) {
      return '';
    }
    return block;
  });
}

function stripFoucScript(html) {
  return html.replace(
    /<!-- Mark page as loaded once CSS is ready -->[\s\S]*?<\/script>\s*/i,
    ''
  );
}

function stripDuplicateHamburger(html) {
  return html.replace(
    /<script>\s*\(function\(\)\s*\{\s*function setupHamburger\(\)[\s\S]*?\}\)\(\);\s*<\/script>\s*/gi,
    ''
  );
}

function normalizeStylesheet(html) {
  let out = html.replace(
    /<link rel="stylesheet" href="\/styles\/products\/moringa-powder-new\.min\.css[^"]*">/gi,
    `<link rel="stylesheet" href="${PDP_CSS}">`
  );
  if (!out.includes(PDP_CSS)) {
    out = out.replace(
      '<link rel="stylesheet" href="/styles/global/style.min.css">',
      `<link rel="stylesheet" href="/styles/global/style.min.css">\n    <link rel="stylesheet" href="${PDP_CSS}">`
    );
  }
  return out;
}

function normalizeScriptBlock(html) {
  const block = `    <script src="/scripts/global/cart.min.js"></script>
    <script src="/scripts/global/recently-viewed.min.js"></script>
    <script src="/scripts/global/cart-header.min.js"></script>
    <script src="/shared/js/product-pdp-ui.min.js"></script>
    <script src="/scripts/global/script.min.js"></script>`;

  return html.replace(
    /<script src="\/scripts\/global\/cart\.min\.js"><\/script>[\s\S]*?<script src="\/scripts\/global\/script\.min\.js"[^>]*><\/script>/i,
    block
  );
}

for (const rel of FILES) {
  const filePath = path.join(SITE, rel);
  let html = fs.readFileSync(filePath, 'utf8');
  html = stripFoucScript(html);
  html = stripInlineStyles(html);
  html = stripDuplicateHamburger(html);
  html = normalizeStylesheet(html);
  html = normalizeScriptBlock(html);
  fs.writeFileSync(filePath, html);
  console.log('Normalized', rel);
}

console.log('Done.');
