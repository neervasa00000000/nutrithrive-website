#!/usr/bin/env node
/**
 * Adds author-bio.css + author-bio.js to blog articles with blog-v2-prose.
 * Run: node scripts/inject-author-bio.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const blogDir = path.join(root, 'blog');
const cssTag = '<link rel="stylesheet" href="/shared/css/author-bio.css"/>';
const jsTag = '<script src="/shared/js/author-bio.js"></script>';

const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.html') && f !== 'index.html');

let updated = 0;
for (const file of files) {
  const fp = path.join(blogDir, file);
  let html = fs.readFileSync(fp, 'utf8');
  if (!html.includes('blog-v2-prose')) continue;

  let changed = false;
  if (!html.includes('author-bio.css')) {
    const anchor = html.includes('/blog/blog-v2-prose.css')
      ? '/blog/blog-v2-prose.css'
      : 'blog-v2-prose.css';
    const idx = html.lastIndexOf(anchor);
    if (idx !== -1) {
      const end = html.indexOf('>', idx) + 1;
      html = html.slice(0, end) + '\n' + cssTag + html.slice(end);
      changed = true;
    }
  }
  if (!html.includes('author-bio.js')) {
    if (html.includes('footer-v2.js')) {
      html = html.replace(
        '<script src="/shared/js/footer-v2.js"></script>',
        '<script src="/shared/js/footer-v2.js"></script>\n' + jsTag
      );
      changed = true;
    } else if (html.includes('</body>')) {
      html = html.replace('</body>', jsTag + '\n</body>');
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(fp, html);
    updated++;
    console.log('updated', file);
  }
}
console.log(`Done. ${updated} files updated.`);
