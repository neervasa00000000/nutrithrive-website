#!/usr/bin/env node
/**
 * Point all product image refs at assets/images/product_photos/webp/
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Order: longest / most specific first */
const REPLACEMENTS = [
  ['product_photos/moringa-400g-bundle.jpeg', 'product_photos/webp/3+1.webp'],
  ['product_photos/moringasoapcombo.jpeg', 'product_photos/webp/moringasoapcombo.webp'],
  ['product_photos/driedcurry.jpeg', 'product_photos/webp/driedcurry.webp'],
  ['product_photos/blacktea.jpeg', 'product_photos/webp/blacktea.webp'],
  ['product_photos/moringa.jpeg', 'product_photos/webp/moringa.webp'],
  ['product_photos/combo.jpeg', 'product_photos/webp/combo.webp'],
  ['product_photos/soap.jpeg', 'product_photos/webp/soap.webp'],
  ['product_photos/200g.png', 'product_photos/webp/200g.webp'],
  ['product_photos/GodPack.jpeg', 'product_photos/webp/3+1.webp'],
  // legacy showcase → webp (skip if already product_photos/jpeg)
  ['homepage/product-showcase/thumbs/new3+1.webp', 'product_photos/webp/3+1.webp'],
  ['homepage/product-showcase/new3+1.webp', 'product_photos/webp/3+1.webp'],
  ['homepage/product-showcase/thumbs/moringasoap_combo.webp', 'product_photos/webp/moringasoapcombo.webp'],
  ['homepage/product-showcase/moringasoap_combo.webp', 'product_photos/webp/moringasoapcombo.webp'],
  ['homepage/product-showcase/thumbs/moringa_soap.webp', 'product_photos/webp/soap.webp'],
  ['homepage/product-showcase/moringa_soap.webp', 'product_photos/webp/soap.webp'],
  ['homepage/product-showcase/thumbs/Bundleoffer.webp', 'product_photos/webp/3+1.webp'],
  ['homepage/product-showcase/Bundleoffer.webp', 'product_photos/webp/3+1.webp'],
  ['homepage/product-showcase/thumbs/BlackTea.webp', 'product_photos/webp/blacktea.webp'],
  ['homepage/product-showcase/BlackTea.webp', 'product_photos/webp/blacktea.webp'],
  ['homepage/product-showcase/thumbs/Curry.webp', 'product_photos/webp/driedcurry.webp'],
  ['homepage/product-showcase/Curry.webp', 'product_photos/webp/driedcurry.webp'],
  ['homepage/product-showcase/thumbs/combo.webp', 'product_photos/webp/combo.webp'],
  ['homepage/product-showcase/combo.webp', 'product_photos/webp/combo.webp'],
  ['homepage/product-showcase/thumbs/Moringa.webp', 'product_photos/webp/moringa.webp'],
  ['homepage/product-showcase/Moringa.webp', 'product_photos/webp/moringa.webp'],
];

const EXT = new Set(['.html', '.js', '.json', '.mjs', '.css', '.htaccess']);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.name === 'node_modules' || name.name === '.git') continue;
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walk(p, out);
    else if (EXT.has(path.extname(name.name)) || name.name === '.htaccess' || name.name === '_redirects')
      out.push(p);
  }
  return out;
}

let filesUpdated = 0;
let totalReplacements = 0;

for (const file of walk(ROOT)) {
  if (file.includes('migrate-product-photos')) continue;
  let text = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [from, to] of REPLACEMENTS) {
    for (const prefix of ['/assets/images/', 'assets/images/']) {
      const pat = `${prefix}${from}`;
      const next = `${prefix}${to}`;
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
