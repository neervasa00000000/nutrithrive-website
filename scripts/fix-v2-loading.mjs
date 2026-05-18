#!/usr/bin/env node
/** Restore blocking Tailwind + sync v2 scripts on all live HTML pages. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === 'scripts/templates') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

const replacements = [
  [/<script defer src="https:\/\/cdn\.tailwindcss\.com/g, '<script src="https://cdn.tailwindcss.com'],
  [/<script defer src="\/shared\/site-data\.js"><\/script>/g, '<script src="/shared/site-data.js"></script>'],
  [/<script defer src="\/scripts\/global\/cart\.js"><\/script>/g, '<script src="/scripts/global/cart.js"></script>'],
  [/<script defer src="\/shared\/js\/cart-v2-ui\.js"><\/script>/g, '<script src="/shared/js/cart-v2-ui.js"></script>'],
  [/<script defer src="\/shared\/js\/layout-v2\.js"><\/script>/g, '<script src="/shared/js/layout-v2.js"></script>'],
  [/<script defer src="\/shared\/js\/v2-site\.js"><\/script>/g, '<script src="/shared/js/v2-site.js"></script>'],
  [/<script defer src="\/shared\/js\/blog-articles\.js"><\/script>/g, '<script src="/shared/js/blog-articles.js"></script>'],
  [
    /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Literata[^"]+" rel="stylesheet" media="print" onload="this\.media='all'"\/>/g,
    '<link href="https://fonts.googleapis.com/css2?family=Literata:wght@600;700&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>',
  ],
  [
    /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Material\+Symbols[^"]+" rel="stylesheet" media="print" onload="this\.media='all'"\/>/g,
    '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>',
  ],
];

let changed = 0;
for (const file of walk(REPO)) {
  if (file.includes(`${path.sep}products${path.sep}index.html`) && fs.readFileSync(file, 'utf8').includes('shop-page.css')) {
    continue;
  }
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  for (const [re, rep] of replacements) html = html.replace(re, rep);
  if (html !== before) {
    fs.writeFileSync(file, html);
    changed++;
  }
}
console.log(`Patched ${changed} HTML file(s) for v2 loading.`);
