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
const SITE = path.join(REPO, 'site');
const BASE = 'https://nutrithrive.com.au';
const BLOG_INDEX = path.join(SITE, 'blog/index.html');
const BLOG_DIR = path.join(SITE, 'blog');

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

function pageTitle(slug) {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.html`), 'utf8');
  const h1 = raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || slug;
  return h1.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim();
}

function buildItemList(slugs) {
  const itemListElement = slugs.map((slug, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: pageTitle(slug),
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
  let found = false;
  html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (full, raw) => {
    try {
      const data = JSON.parse(raw);
      if (data['@type'] === 'ItemList') {
        found = true;
        return `<script type="application/ld+json">${JSON.stringify(itemList)}</script>`;
      }
      if (data['@type'] === 'CollectionPage' && data.mainEntity?.['@type'] === 'ItemList') {
        found = true;
        data.mainEntity = itemList;
        return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
      }
    } catch {}
    return full;
  });
  if (!found) {
    console.error('ItemList block not found in blog/index.html');
    process.exit(1);
  }
  fs.writeFileSync(BLOG_INDEX, html);
  console.log(`Updated blog/index.html ItemList: ${slugs.length} live posts`);
}

main();
