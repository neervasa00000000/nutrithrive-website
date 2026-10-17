import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { PRODUCTS, auSoloShippingRate } from '../storefront/js/data.js';
const read = (p) => fs.readFileSync(p, 'utf8');
const powder = read('site/products/moringa-powder/index.html');
assert.equal((powder.match(/Buy moringa powder online in Australia/g) || []).length, 1);
for (const value of ['From $11', '$20.69', '$31.69', '$51.12', 'data-pending="fsanz-approval" hidden']) assert.ok(powder.includes(value), value);
const ctx = { module: { exports: {} }, console: { log() {}, warn() {} } };
vm.runInNewContext(read('scripts/global/shipping-rates.js'), ctx);
for (const id of ['moringa-powder', 'moringa-200g', 'moringa-400g']) {
  const item = PRODUCTS.find(p => p.id === id);
  assert.equal(ctx.module.exports.calculate('AU', [{...item, quantity: 1}], item.price), auSoloShippingRate(item.weight));
}
for (const page of ['site/index.html', 'site/products/curry-leaves/index.html', 'site/blog/moringa-patches-australia-review-do-they-work.html', 'site/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025.html']) {
  const html = read(page);
  for (const slug of ['diwali-hampers-australia', 'gifts-for-tea-lovers-australia', 'diwali-gifts-for-friends-curry-leaf-snacks']) assert.ok(html.includes(`href="/blog/${slug}"`), `${page}: ${slug}`);
}
assert.match(read('site/blog/diwali-gift-guide-curry-leaves-tea-australia.html'), /rel="canonical" href="https:\/\/nutrithrive.com.au\/blog\/diwali-gift-guide-curry-leaves-tea-australia"/);
assert.doesNotMatch(read('site/index.html'), /v=20261013/);
assert.doesNotMatch(read('site/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025.html'), /See the live/);
for (const url of ['/products/diwali-gift-box/', '/products/gift-pack/', '/blog/diwali-hampers-australia', '/blog/diwali-gift-guide-curry-leaves-tea-australia', '/blog/gifts-for-tea-lovers-australia', '/blog/diwali-gifts-for-friends-curry-leaf-snacks']) assert.ok(read('site/sitemap.xml').includes(`<loc>https://nutrithrive.com.au${url}</loc>`), url);
// Frozen baseline before the growth pass; do not compare to a moving HEAD.
const baseline = '24e8edb5';
const paths = execFileSync('git', ['diff', '--name-only', baseline], {encoding:'utf8'}).trim().split('\n');
for (const file of paths.filter(p => p.endsWith('.html'))) {
  const before = execFileSync('git', ['show', `${baseline}:${file}`], {encoding:'utf8'});
  const after = read(file);
  assert.deepEqual(after.match(/<title>.*?<\/title>/gs), before.match(/<title>.*?<\/title>/gs), `${file}: title frozen`);
  assert.deepEqual(after.match(/<h1\b[^>]*>.*?<\/h1>/gs), before.match(/<h1\b[^>]*>.*?<\/h1>/gs), `${file}: H1 frozen`);
  if (['site/index.html', 'site/products/moringa-powder/index.html'].includes(file)) assert.deepEqual(after.match(/<meta name="description"[^>]*>/g), before.match(/<meta name="description"[^>]*>/g));
  if (/site\/blog\//.test(file) && /health|pregnan|children|kids|dogs?|medical|blood|thyroid|cholesterol|pcos|menopause|anxiety|stress|gut|weight|sleep|iron|vitamin|magnesium|cortisol|berberine|inflamm|workout|pre-workout/i.test(file)) assert.equal(after, before, `${file}: HOLD`);
}
console.log('Growth content, metadata, shipping and HOLD checks passed.');
