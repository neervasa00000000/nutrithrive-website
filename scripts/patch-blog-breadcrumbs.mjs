#!/usr/bin/env node
/**
 * Replaces ← Journal-only breadcrumb nav with full Home › Blog › … trail from JSON-LD.
 * Run: node scripts/patch-blog-breadcrumbs.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(REPO, 'blog');

const OLD_NAV_RE =
  /<nav class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-4 pb-2 text-label-sm" aria-label="Breadcrumb">\s*<a class="text-moringa-leaf hover:underline" href="\/blog\/">← Journal<\/a>\s*<\/nav>/g;

const LEGACY_NAV_RE =
  /<nav class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-4 pb-2 text-label-sm"><a class="text-moringa-leaf hover:underline" href="\/blog\/">← Journal<\/a><\/nav>/g;

function pathFromItemUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.pathname.replace(/\/$/, '') || '/';
  } catch {
    return url.startsWith('/') ? url : `/${url}`;
  }
}

function extractBreadcrumbList(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const m of blocks) {
    try {
      const data = JSON.parse(m[1]);
      if (data['@type'] === 'BreadcrumbList' && Array.isArray(data.itemListElement)) {
        return data.itemListElement;
      }
    } catch {
      /* skip */
    }
  }
  return null;
}

function buildNav(items) {
  const parts = items.map((item, idx) => {
    const name = item.name || '';
    const isLast = idx === items.length - 1;
    const href = pathFromItemUrl(item.item);
    if (isLast) {
      return `<li class="text-on-surface" aria-current="page">${escapeHtml(name)}</li>`;
    }
    return `<li><a class="text-moringa-leaf hover:underline" href="${escapeHtml(href)}">${escapeHtml(name)}</a></li>`;
  });
  const withSeparators = [];
  parts.forEach((li, i) => {
    if (i > 0) withSeparators.push('<li class="text-on-surface-variant" aria-hidden="true">›</li>');
    withSeparators.push(li);
  });
  return `<nav class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-4 pb-2 text-label-sm" aria-label="Breadcrumb">
<ol class="flex flex-wrap items-center gap-1 list-none m-0 p-0">${withSeparators.join('')}</ol>
</nav>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

function patchFile(file) {
  let html = fs.readFileSync(file, 'utf8');
  const items = extractBreadcrumbList(html);
  if (!items?.length) return false;
  const nav = buildNav(items);
  if (!OLD_NAV_RE.test(html) && !LEGACY_NAV_RE.test(html)) {
    if (html.includes('aria-label="Breadcrumb"') && html.includes('flex flex-wrap items-center gap-1')) {
      return false;
    }
    return false;
  }
  html = html.replace(OLD_NAV_RE, nav).replace(LEGACY_NAV_RE, nav);
  fs.writeFileSync(file, html);
  return true;
}

function main() {
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.html') && f !== 'index.html')
    .map((f) => path.join(BLOG_DIR, f));
  let n = 0;
  for (const file of files) {
    if (patchFile(file)) {
      n++;
      console.log('Patched:', path.basename(file));
    }
  }
  console.log(`Done: ${n} files updated`);
}

main();
