#!/usr/bin/env node
/** Writes blog/index-directory.partial.html from shared/js/blog-articles.js */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(ROOT, 'shared/js/blog-articles.js'), 'utf8');
const json = src.replace(/^[\s\S]*?=\s*/, '').replace(/;\s*$/, '');
const articles = JSON.parse(json);

const byCat = {};
for (const a of articles) {
  const cat = a.category.replace(/&amp;/g, '&');
  if (!byCat[cat]) byCat[cat] = [];
  byCat[cat].push(a);
}

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

let html = `<section class="blog-index-directory mb-12 border-t border-outline-variant/20 pt-12" aria-label="Complete guide library">
<h2 class="font-display text-headline-md text-forest-deep mb-4">Complete guide library</h2>
<p class="font-body-lg text-on-surface-variant max-w-3xl mb-4">Every article below is written for Australian shoppers: how to read labels, dose moringa safely, compare spirulina and matcha, and spot stale powder before you buy. Use this index if you are researching before your first order or comparing NutriThrive with pharmacy and marketplace brands.</p>
<p class="font-body-md text-on-surface-variant max-w-3xl mb-8">Topics include Melbourne and Victoria delivery, batch-code freshness checks, women’s health angles, recipes, honest wellness diaries, and lab-backed quality tests. New guides are added when we publish a fresh batch or answer a common customer question.</p>
`;

for (const [cat, items] of Object.entries(byCat).sort(([a], [b]) => a.localeCompare(b))) {
  html += `<div class="mb-8">
<h3 class="font-label-lg text-moringa-leaf uppercase tracking-widest mb-3">${esc(cat)}</h3>
<ul class="grid grid-cols-1 md:grid-cols-2 gap-2 font-body-md text-forest-deep list-none p-0 m-0">\n`;
  for (const a of items.sort((x, y) => x.title.localeCompare(y.title))) {
    const title = a.title.replace(/&amp;/g, '&');
    html += `<li class="py-1"><a class="text-moringa-leaf hover:underline font-semibold" href="${a.href}">${esc(title)}</a><span class="text-on-surface-variant"> — ${esc(a.description.slice(0, 120))}${a.description.length > 120 ? '…' : ''}</span></li>\n`;
  }
  html += `</ul></div>\n`;
}
html += `</section>\n`;

const out = path.join(ROOT, 'blog/index-directory.partial.html');
fs.writeFileSync(out, html);
console.log('Wrote', out, `(${articles.length} articles)`);
