#!/usr/bin/env node
/**
 * Fix preview/test URLs in live HTML (blog, pages, products, index).
 * Safe to run without website2.0 present. Does not touch website2.0/.
 *
 *   node scripts/fix-live-test-links.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { transformLiveLinks } from './lib/live-link-transform.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function walkHtml(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walkHtml(full, acc);
    else if (name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

const targets = [
  path.join(REPO, 'index.html'),
  ...walkHtml(path.join(REPO, 'blog')),
  ...walkHtml(path.join(REPO, 'pages')),
  ...walkHtml(path.join(REPO, 'products')),
];

let changed = 0;
for (const file of targets) {
  const before = fs.readFileSync(file, 'utf8');
  const after = transformLiveLinks(before);
  if (after !== before) {
    fs.writeFileSync(file, after);
    changed++;
    console.log('Fixed:', path.relative(REPO, file));
  }
}

console.log(`\nDone. ${changed} file(s) updated.`);
