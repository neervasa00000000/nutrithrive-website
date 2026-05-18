#!/usr/bin/env node
/**
 * Apply /products/ PageSpeed optimizations (run after build-live-v2 or standalone).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { optimizeProductsPageHtml } from './lib/shop-page-perf.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const liveFile = path.join(REPO, 'products/index.html');

if (!fs.existsSync(liveFile)) {
  console.error('Missing products/index.html');
  process.exit(1);
}

const before = fs.readFileSync(liveFile, 'utf8');
const after = optimizeProductsPageHtml(before);
fs.writeFileSync(liveFile, after);
console.log('Optimized products/index.html');
console.log(
  '  static grid:',
  after.includes('data-nt-shop-ready="1"') ? 'yes' : 'no'
);
console.log(
  '  defer tailwind:',
  /defer src="https:\/\/cdn\.tailwindcss\.com/.test(after) ? 'yes' : 'no'
);
