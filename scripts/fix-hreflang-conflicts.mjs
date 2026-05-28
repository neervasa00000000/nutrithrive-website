#!/usr/bin/env node
/**
 * Remove duplicate hreflang tags and re-inject self-referencing en-AU + x-default (and any extra langs) after canonical.
 * Run: node scripts/fix-hreflang-conflicts.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function getCanonical(html) {
  let m = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  if (m) return m[1];
  m = html.match(/<link\s+href="([^"]+)"\s+rel="canonical"/i);
  return m ? m[1] : null;
}

function fixHreflang(html) {
  const canonRaw = getCanonical(html);
  if (!canonRaw) return html;

  const canon = canonRaw.replace(/\.html$/, '');

  const langs = new Map();
  const tagRe = /<link[^>]*hreflang="([^"]+)"[^>]*>/gi;
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    langs.set(m[1], canon);
  }

  langs.set('en-AU', canon);
  langs.set('x-default', canon);

  html = html.replace(/<link[^>]*hreflang="[^"]+"[^>]*>\s*\n?/gi, '');

  const block = [...langs.entries()]
    .map(([lang, href]) => `<link rel="alternate" hreflang="${lang}" href="${href}"/>`)
    .join('\n');

  if (/<link\s+rel="canonical"/i.test(html)) {
    return html.replace(
      /(<link\s+rel="canonical"\s+href="[^"]+"\s*\/?>)/i,
      `$1\n${block}`
    );
  }
  return html.replace(
    /(<link\s+href="[^"]+"\s+rel="canonical"\s*\/?>)/i,
    `$1\n${block}`
  );
}

const targets = [];
const blogDir = path.join(ROOT, 'blog');
for (const f of fs.readdirSync(blogDir)) {
  if (f.endsWith('.html')) targets.push(path.join(blogDir, f));
}
for (const rel of [
  'pages/homepage/melbourne.html',
  'pages/contact/contact.html',
  'blog/index.html',
]) {
  const fp = path.join(ROOT, rel);
  if (fs.existsSync(fp)) targets.push(fp);
}

let n = 0;
for (const fp of targets) {
  const before = fs.readFileSync(fp, 'utf8');
  const after = fixHreflang(before);
  if (after !== before) {
    fs.writeFileSync(fp, after);
    n++;
    console.log('fixed', path.relative(ROOT, fp));
  }
}
console.log(`Done. Updated ${n} files.`);
