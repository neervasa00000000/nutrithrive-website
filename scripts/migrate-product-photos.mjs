#!/usr/bin/env node
/**
 * Point all product image refs at assets/images/product_photos/
 * Leaves about/contact page art and blog heroes under product-showcase.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const PRODUCT_REPLACEMENTS = [
  ['homepage/product-showcase/thumbs/new3+1.webp', 'product_photos/3+1.jpeg'],
  ['homepage/product-showcase/thumbs/moringasoap_combo.webp', 'product_photos/moringasoapcombo.jpeg'],
  ['homepage/product-showcase/moringasoap_combo.webp', 'product_photos/moringasoapcombo.jpeg'],
  ['homepage/product-showcase/thumbs/moringa_soap.webp', 'product_photos/soap.jpeg'],
  ['homepage/product-showcase/moringa_soap.webp', 'product_photos/soap.jpeg'],
  ['homepage/product-showcase/thumbs/Bundleoffer.webp', 'product_photos/GodPack.jpeg'],
  ['homepage/product-showcase/Bundleoffer.webp', 'product_photos/GodPack.jpeg'],
  ['homepage/product-showcase/thumbs/BlackTea.webp', 'product_photos/blacktea.jpeg'],
  ['homepage/product-showcase/BlackTea.webp', 'product_photos/blacktea.jpeg'],
  ['homepage/product-showcase/thumbs/Curry.webp', 'product_photos/driedcurry.jpeg'],
  ['homepage/product-showcase/Curry.webp', 'product_photos/driedcurry.jpeg'],
  ['homepage/product-showcase/thumbs/combo.webp', 'product_photos/combo.jpeg'],
  ['homepage/product-showcase/combo.webp', 'product_photos/combo.jpeg'],
  ['homepage/product-showcase/thumbs/Moringa.webp', 'product_photos/moringa.jpeg'],
  ['homepage/product-showcase/Moringa.webp', 'product_photos/moringa.jpeg'],
  // legacy products folder (if any refs appear later)
  ['images/products/thumbs/new3+1.webp', 'product_photos/3+1.jpeg'],
  ['images/products/new3+1.webp', 'product_photos/3+1.jpeg'],
  ['images/products/moringa_soap.webp', 'product_photos/soap.jpeg'],
  ['images/products/Moringa.webp', 'product_photos/moringa.jpeg'],
];

const EXT = new Set(['.html', '.js', '.json', '.mjs', '.css', '.htaccess']);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.name === 'node_modules' || name.name === '.git') continue;
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walk(p, out);
    else if (EXT.has(path.extname(name.name)) || name.name === '.htaccess') out.push(p);
  }
  return out;
}

let filesUpdated = 0;
let totalReplacements = 0;

for (const file of walk(ROOT)) {
  if (file.includes('migrate-product-photos.mjs')) continue;
  let text = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [from, to] of PRODUCT_REPLACEMENTS) {
    const patterns = [
      `/assets/images/${from}`,
      `assets/images/${from}`,
    ];
    for (const pat of patterns) {
      const next = to.startsWith('/') ? `/assets/images/${to.replace(/^\/+/, '')}` : `/assets/images/${to}`;
      if (text.includes(pat)) {
        const count = text.split(pat).length - 1;
        text = text.split(pat).join(next);
        totalReplacements += count;
        changed = true;
      }
    }
  }
  if (changed) {
    fs.writeFileSync(file, text);
    filesUpdated++;
  }
}

console.log(JSON.stringify({ filesUpdated, totalReplacements }, null, 2));
