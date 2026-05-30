#!/usr/bin/env node
/**
 * Repairs known-broken internal links across live site HTML (not v2 test templates).
 * Run: node scripts/fix-broken-site-links.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const SCAN_DIRS = ['blog', 'pages', 'products', 'buy-moringa-powder-australia'];
const SCAN_FILES = ['index.html'];

/** Global string replacements (order matters — longer patterns first). */
const REPLACEMENTS = [
  [
    'https://nutrithrive.com.au/blog/moringa-brands-comparison-australia-2026',
    'https://nutrithrive.com.au/blog/best-superfoods-australia-comparison-health-conscious-adults',
  ],
  [
    '/blog/moringa-brands-comparison-australia-2026',
    '/blog/best-superfoods-australia-comparison-health-conscious-adults',
  ],
  [
    '/blog/is-moringa-legit-what-science-and-real-users-say-2026',
    '/blog/moringa-honest-truth-science-australia-2026',
  ],
  [
    '/blog/nutrithrive-delivers-across-victoria-is-your-town-eligible-hint-yes',
    '/pages/shipping/shipping-returns',
  ],
  [
    '/assets/images/product_photos/webp/thumbs/moringa.jpg',
    '/assets/images/product_photos/moringa.jpeg',
  ],
  [
    'href="/blog/verify-moringa-quality-premium-buyers-checklist-2026">Chemist Warehouse moringa vs NutriThrive: lab report',
    'href="/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025">Chemist Warehouse moringa vs NutriThrive: lab report',
  ],
  [
    'href="/blog/verify-moringa-quality-premium-buyers-checklist-2026">Chemist Warehouse comparison piece',
    'href="/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025">Chemist Warehouse comparison piece',
  ],
  [
    'href="/blog/verify-moringa-quality-premium-buyers-checklist-2026">See our comparison →',
    'href="/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025">See our Chemist Warehouse comparison →',
  ],
  [
    'href="/blog/verify-moringa-quality-premium-buyers-checklist-2026">Read retail vs NutriThrive comparison',
    'href="/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025">Read Chemist Warehouse vs NutriThrive comparison',
  ],
  [
    'href="/blog/verify-moringa-quality-premium-buyers-checklist-2026">Chemist Warehouse Moringa vs NutriThrive: Lab Report',
    'href="/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025">Chemist Warehouse Moringa vs NutriThrive: Lab Report',
  ],
  [
    'href="/blog/verify-moringa-quality-premium-buyers-checklist-2026" style="color:#1a5c36;">Chemist Warehouse moringa vs NutriThrive — lab test results',
    'href="/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025" style="color:#1a5c36;">Chemist Warehouse moringa vs NutriThrive — lab test results',
  ],
];

function walkHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name.startsWith('.') || ent.name === 'node_modules') continue;
      walkHtml(full, out);
    } else if (ent.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

const files = [];
for (const d of SCAN_DIRS) walkHtml(path.join(ROOT, d), files);
for (const f of SCAN_FILES) {
  const p = path.join(ROOT, f);
  if (fs.existsSync(p)) files.push(p);
}

let changed = 0;
for (const fp of files) {
  let html = fs.readFileSync(fp, 'utf8');
  const before = html;
  for (const [from, to] of REPLACEMENTS) {
    html = html.split(from).join(to);
  }
  if (html !== before) {
    fs.writeFileSync(fp, html);
    changed++;
    console.log('fixed:', path.relative(ROOT, fp));
  }
}

console.log(`\nDone. Updated ${changed} file(s).`);
