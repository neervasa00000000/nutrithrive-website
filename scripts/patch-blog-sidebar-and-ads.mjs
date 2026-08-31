#!/usr/bin/env node
/**
 * Patch blog posts: B3G1 sidebar (shared partial) + standardized ad slot markup.
 * Run: node scripts/patch-blog-sidebar-and-ads.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'site');
const BLOG_DIR = path.join(SITE, 'blog');
const SIDEBAR = fs
  .readFileSync(path.join(BLOG_DIR, 'partials/blog-sidebar.html'), 'utf8')
  .trim();

const AD_SLOT_INLINE = `<!-- Product promo slot (blog-ad-promo.js) -->
<div class="nt-ad-slot" data-ad-slot="SLOT" data-nt-ad-promo></div>`;

const AD_SLOT_MAP = [
  {
    pattern:
      /<!-- \[AD SLOT — in-content, after intro\] -->\s*<p class="nt-ad-slot"[^>]*>\[AD SLOT — in-content, after intro\]<\/p>/g,
    replacement: AD_SLOT_INLINE.replace('SLOT', 'in-content-after-intro'),
  },
  {
    pattern:
      /<!-- \[AD SLOT — in-content, after recipes\] -->\s*<p class="nt-ad-slot"[^>]*>\[AD SLOT — in-content, after recipes\]<\/p>/g,
    replacement: AD_SLOT_INLINE.replace('SLOT', 'in-content-after-recipes'),
  },
  {
    pattern:
      /<!-- \[AD SLOT — end of post, before footer\] -->\s*<p class="nt-ad-slot"[^>]*>\[AD SLOT — end of post, before footer\]<\/p>/g,
    replacement: AD_SLOT_INLINE.replace('SLOT', 'end-of-post'),
  },
  {
    pattern:
      /<!-- AD SLOT: in-content, after intro -->\s*<div class="nt-ad-slot" data-ad-slot="in-content-after-intro"[^>]*>\s*<span class="nt-ad-slot__label">Advertisement<\/span>\s*<\/div>/g,
    replacement: AD_SLOT_INLINE.replace('SLOT', 'in-content-after-intro'),
  },
  {
    pattern:
      /<!-- AD SLOT: in-content, after recipes -->\s*<div class="nt-ad-slot" data-ad-slot="in-content-after-recipes"[^>]*>\s*<span class="nt-ad-slot__label">Advertisement<\/span>\s*<\/div>/g,
    replacement: AD_SLOT_INLINE.replace('SLOT', 'in-content-after-recipes'),
  },
  {
    pattern:
      /<!-- AD SLOT: end of post, before footer -->\s*<div class="nt-ad-slot" data-ad-slot="end-of-post"[^>]*>\s*<span class="nt-ad-slot__label">Advertisement<\/span>\s*<\/div>/g,
    replacement: AD_SLOT_INLINE.replace('SLOT', 'end-of-post'),
  },
  {
    pattern:
      /<!-- AD SLOT: sidebar -->\s*<div class="nt-ad-slot nt-ad-slot--sidebar" data-ad-slot="sidebar"[^>]*>\s*<span class="nt-ad-slot__label">Advertisement<\/span>\s*<\/div>/g,
    replacement: `<!-- Product promo slot: curry leaves or moringa soap (blog-ad-promo.js) -->
<div class="nt-ad-slot nt-ad-slot--sidebar" data-ad-slot="sidebar" data-nt-ad-promo></div>`,
  },
];

const ASIDE_RE = /<aside class="lg:col-span-4[^"]*"[\s\S]*?<\/aside>/;

function patchAdSlots(html) {
  let changed = false;
  for (const { pattern, replacement } of AD_SLOT_MAP) {
    if (pattern.test(html)) {
      html = html.replace(pattern, replacement);
      changed = true;
    }
    pattern.lastIndex = 0;
  }
  return { html, changed };
}

function patchFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const adPatch = patchAdSlots(html);
  html = adPatch.html;
  changed = adPatch.changed;

  if (ASIDE_RE.test(html)) {
    const next = html.replace(ASIDE_RE, SIDEBAR);
    if (next !== html) {
      html = next;
      changed = true;
    }
  } else if (
    html.includes('nt-blog-article') &&
    html.includes('lg:grid-cols-12') &&
    html.includes('</article>')
  ) {
    const inserted = html.replace(/<\/article>\s*(<\/div>\s*<\/main>)/, `</article>\n${SIDEBAR}\n$1`);
    if (inserted !== html) {
      html = inserted;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, html);
  }
  return changed;
}

const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.html') && f !== 'index.html');
let patched = 0;
for (const f of files) {
  if (patchFile(path.join(BLOG_DIR, f))) patched += 1;
}
console.log(`Patched ${patched} blog HTML files.`);
