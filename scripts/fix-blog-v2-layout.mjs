#!/usr/bin/env node
/**
 * Fix v2 blog shell: stylesheets, navbar CSS deps, main padding, extra </div> before newsletter.
 */
import fs from 'node:fs';
import path from 'node:path';

const blogDir = path.join(process.cwd(), 'blog');
const files = fs
  .readdirSync(blogDir)
  .filter((f) => f.endsWith('.html'))
  .map((f) => path.join(blogDir, f));

const STANDARD_ARTICLE_STYLES = `<!-- NutriThrive v2 blog shell -->
<link rel="stylesheet" href="/assets/css/design-system.min.css"/>
<link rel="stylesheet" href="/styles/global/style.min.css"/>
<link rel="stylesheet" href="/assets/css/tailwind-v2.min.css"/>
<link rel="stylesheet" href="/blog/blog-v2-prose.min.css"/>
<link rel="stylesheet" href="/shared/css/v2-extra.min.css"/>
<link rel="stylesheet" href="/shared/css/author-bio.min.css"/>
`;

const STYLE_LINK_RE =
  /<link[^>]+href="\/(?:assets\/css\/design-system|styles\/global\/style|assets\/css\/tailwind-v2|blog\/blog-v2-prose|shared\/css\/v2-extra|shared\/css\/author-bio)[^"]*\.css"[^>]*>\s*/gi;

function normalizeArticleStyles(html) {
  if (!html.includes('nt-blog-article')) return html;

  const marker = '<!-- NutriThrive v2 blog shell -->';
  const headEnd = html.indexOf('</head>');
  if (headEnd === -1) return html;

  let head = html.slice(0, headEnd);
  const tail = html.slice(headEnd);

  head = head.replace(STYLE_LINK_RE, '');
  head = head.replace(/<link[^>]+href="\.\.\/blog\/blog-v2-prose[^"]*"[^>]*>\s*/gi, '');
  head = head.replace(/<!-- Nutri Thrive v2 blog shell -->\s*/gi, '');
  head = head.replace(/<!-- NutriThrive v2 blog shell -->\s*/gi, '');

  if (!head.includes('design-system.min.css')) {
    return head + STANDARD_ARTICLE_STYLES + tail;
  }

  if (!head.includes('style.min.css')) {
    head = head.replace(
      'design-system.min.css"/>',
      'design-system.min.css"/>\n<link rel="stylesheet" href="/styles/global/style.min.css"/>'
    );
  }

  if (head.includes('v2-extra.min.css') && head.indexOf('tailwind-v2.min.css') > head.indexOf('v2-extra.min.css')) {
    head = head.replace(STYLE_LINK_RE, '');
    return head + STANDARD_ARTICLE_STYLES + tail;
  }

  return head + tail;
}

let changed = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const orig = html;

  html = normalizeArticleStyles(html);

  /* Keep pt-28 — pt-6 caused article titles to sit under sticky site chrome on mobile */

  html = html.replace(
    /<\/section>\n<\/div>\n<\/div>\n<section class="mt-20/g,
    '</section>\n</div>\n<section class="mt-20'
  );

  if (html !== orig) {
    fs.writeFileSync(file, html);
    changed++;
    console.log('fixed:', path.basename(file));
  }
}

console.log(`Done. ${changed} file(s) updated.`);
