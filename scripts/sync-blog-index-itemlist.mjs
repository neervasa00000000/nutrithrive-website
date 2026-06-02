#!/usr/bin/env node
/**
 * Regenerates ItemList JSON-LD in blog/index.html from live blog/*.html files.
 * Run: node scripts/sync-blog-index-itemlist.mjs
 */
import fs from 'fs';
import path from 'path';

const REPO = path.resolve(import.meta.dirname, '..');
const BLOG_INDEX = path.join(REPO, 'blog', 'index.html');
const BLOG_DIR = path.join(REPO, 'blog');
const BASE = 'https://nutrithrive.com.au';

/** Curated first — breakout SEO posts, then rest alphabetically. */
const PRIORITY = [
  'moringa-berberine-australia-2026.html',
  'moringa-benefits-for-women-comprehensive-2026.html',
  'is-moringa-banned-australia-truth-2026.html',
  'how-much-moringa-powder-per-day-dosage-guide-2026.html',
  'moringa-side-effects-what-happens-take-too-much-2026.html',
  'what-does-moringa-do-for-your-body-complete-guide-2026.html',
  'moringa-capsules-vs-powder-which-is-better-2026.html',
  'how-to-choose-moringa-powder-australia-2026.html',
  'verify-moringa-quality-premium-buyers-checklist-2026.html',
  'moringa-tea-benefits-how-to-brew-2026-guide.html',
  'how-to-grow-moringa-in-australia-complete-guide-2026.html',
  'fresh-moringa-leaves-vs-powder-nutrients-2026.html',
  'moringa-oil-benefits-skin-hair-health-2026.html',
];

function hasNoindex(html) {
  const head = html.slice(0, 12000).toLowerCase();
  return /name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(head);
}

const all = fs
  .readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith('.html') && f !== 'index.html' && !f.includes('.partial.'))
  .filter((f) => {
    const html = fs.readFileSync(path.join(BLOG_DIR, f), 'utf8');
    return !hasNoindex(html);
  });

const ordered = [
  ...PRIORITY.filter((f) => all.includes(f)),
  ...all.filter((f) => !PRIORITY.includes(f)).sort(),
];

const itemListElement = ordered.map((file, i) => ({
  '@type': 'ListItem',
  position: i + 1,
  url: `${BASE}/blog/${file.replace(/\.html$/, '')}`,
}));

const itemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'NutriThrive blog posts',
  numberOfItems: ordered.length,
  itemListElement,
};

const jsonBlock = `<script type="application/ld+json">\n${JSON.stringify(itemList, null, 2)}\n</script>`;

let html = fs.readFileSync(BLOG_INDEX, 'utf8');
const re = /<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "ItemList"[\s\S]*?<\/script>/;
if (!re.test(html)) {
  console.error('ItemList block not found in blog/index.html');
  process.exit(1);
}
html = html.replace(re, jsonBlock);
fs.writeFileSync(BLOG_INDEX, html);
console.log(`Updated ItemList: ${ordered.length} posts in blog/index.html`);
