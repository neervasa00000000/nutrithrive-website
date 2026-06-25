#!/usr/bin/env node
/**
 * Regenerates blog/index.html ItemList JSON-LD from live (indexable) blog posts.
 * Run: node scripts/regenerate-blog-itemlist.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const BASE = 'https://nutrithrive.com.au';
const BLOG_INDEX = path.join(REPO, 'blog/index.html');
const BLOG_DIR = path.join(REPO, 'blog');

function isLivePost(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return !/meta\s+name="robots"\s+content="noindex/i.test(raw);
}

function collectLiveSlugs() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.html') && f !== 'index.html' && !f.includes('.partial.'))
    .filter((f) => isLivePost(path.join(BLOG_DIR, f)))
    .map((f) => f.replace(/\.html$/, ''))
    .sort();
}

function buildItemList(slugs) {
  const itemListElement = slugs.map((slug, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `${BASE}/blog/${slug}`,
  }));
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'NutriThrive blog posts',
    numberOfItems: slugs.length,
    itemListElement,
  };
}

function main() {
  const slugs = collectLiveSlugs();
  const itemList = buildItemList(slugs);
  let html = fs.readFileSync(BLOG_INDEX, 'utf8');
  const re = /<script type="application\/ld\+json">\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "ItemList"[\s\S]*?\}<\/script>/;
  const replacement = `<script type="application/ld+json">${JSON.stringify(itemList, null, 2)}</script>`;
  if (!re.test(html)) {
    console.error('ItemList block not found in blog/index.html');
    process.exit(1);
  }
  html = html.replace(re, replacement);
  fs.writeFileSync(BLOG_INDEX, html);
  console.log(`Updated blog/index.html ItemList: ${slugs.length} live posts`);
}

main();
