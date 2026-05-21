#!/usr/bin/env node
/**
 * Phase 1 SEO diagnostic — detect only, no fixes.
 * Run: node scripts/seo-diagnostic-phase1.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_JSON = path.join(ROOT, 'audit', 'seo-diagnostic-phase1-data.json');

const SKIP_DIRS = new Set(['node_modules', '.git', 'scripts/templates', 'nutrithrive_labs', 'audit']);

function walkHtml(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name) || ent.name.startsWith('.')) continue;
      walkHtml(p, acc);
    } else if (ent.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMainText(html) {
  const m = html.match(/<(?:main|article)[^>]*>([\s\S]*?)<\/(?:main|article)>/i);
  return stripTags(m ? m[1] : html);
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function normUrl(href) {
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return null;
  if (href.startsWith('http') && !href.includes('nutrithrive')) return null;
  let u = href.split('?')[0].split('#')[0];
  if (u.startsWith('../')) u = u.replace(/^(\.\.\/)+/, '/');
  if (!u.startsWith('/')) u = '/' + u;
  return u;
}

function parseSitemap() {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
    try {
      return new URL(m[1]).pathname;
    } catch {
      return m[1];
    }
  });
  return new Set(locs);
}

function parseRedirects() {
  const text = fs.readFileSync(path.join(ROOT, '_redirects'), 'utf8');
  const rules = [];
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const parts = t.split(/\s+/);
    if (parts.length >= 2) rules.push({ from: parts[0], to: parts[1], code: parts[2] || '301' });
  }
  return rules;
}

function fileExistsForUrl(urlPath) {
  if (urlPath === '/') return fs.existsSync(path.join(ROOT, 'index.html'));
  const clean = urlPath.replace(/\/$/, '');
  const candidates = [
    path.join(ROOT, clean.slice(1)),
    path.join(ROOT, clean.slice(1) + '.html'),
    path.join(ROOT, clean.slice(1), 'index.html'),
  ];
  return candidates.some((c) => fs.existsSync(c) && fs.statSync(c).isFile());
}

const htmlFiles = [
  ...walkHtml(ROOT),
  ...walkHtml(path.join(ROOT, 'blog')),
  ...walkHtml(path.join(ROOT, 'pages')),
  ...walkHtml(path.join(ROOT, 'products')),
].filter((p, i, a) => a.indexOf(p) === i);

const sitemapPaths = parseSitemap();
const redirects = parseRedirects();
const redirectFrom = new Map(redirects.map((r) => [r.from, r]));

// Blog duplicates
const blogFiles = fs.readdirSync(path.join(ROOT, 'blog')).filter((f) => f.endsWith('.html') && f !== 'index.html');
const blogSlugs = blogFiles.map((f) => f.replace(/\.html$/, ''));
const duplicatePairs = blogSlugs.map((slug) => ({
  slug,
  withHtml: `/blog/${slug}.html`,
  withoutHtml: `/blog/${slug}`,
  file: `/blog/${slug}.html`,
  inSitemapHtml: sitemapPaths.has(`/blog/${slug}.html`),
  inSitemapNoHtml: sitemapPaths.has(`/blog/${slug}`),
  redirectNoHtmlToHtml: redirectFrom.get(`/blog/${slug}`)?.to === `/blog/${slug}.html`,
}));

// Per-page extraction
const pages = [];
const incomingLinks = new Map();
const badAnchors = [];
const hreflangPages = [];
const jsonLdIssues = [];
const h1TitleDupes = [];
const longTitles = [];
const lowRatio = [];
const lowWords = [];
const brokenImg = [];
const allLinks = [];

const BAD_ANCHOR = /^(click here|read more|learn more|here|more|→|»)$/i;

for (const fp of htmlFiles) {
  const rel = path.relative(ROOT, fp).replace(/\\/g, '/');
  let urlPath = '/' + rel;
  if (rel === 'index.html') urlPath = '/';
  else if (rel.endsWith('/index.html')) urlPath = '/' + rel.replace(/\/index\.html$/, '/');
  else if (rel.endsWith('.html')) urlPath = '/' + rel;

  const html = fs.readFileSync(fp, 'utf8');
  const titleM = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleM ? titleM[1].trim() : '';
  const h1M = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1M ? stripTags(h1M[1]).trim() : '';
  const canonicalM = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const canonical = canonicalM ? canonicalM[1] : null;

  const hreflangs = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["']/gi)];
  if (hreflangs.length) {
    hreflangPages.push({ urlPath, rel, hreflangs: hreflangs.map((m) => ({ lang: m[1], href: m[2] })), canonical });
  }

  if (title && h1 && title.toLowerCase() === h1.toLowerCase()) {
    h1TitleDupes.push({ urlPath, title, len: title.length });
  }
  if (title.length > 60) longTitles.push({ urlPath, title, len: title.length });

  const mainText = extractMainText(html);
  const wc = wordCount(mainText);
  const htmlBytes = Buffer.byteLength(html, 'utf8');
  const textBytes = Buffer.byteLength(mainText, 'utf8');
  const ratio = htmlBytes ? (textBytes / htmlBytes) * 100 : 0;
  if (ratio < 15 && wc > 50) lowRatio.push({ urlPath, wc, htmlBytes, ratio: ratio.toFixed(1) });
  if (wc < 300 && wc > 0 && (rel.startsWith('blog/') || rel.startsWith('pages/'))) {
    lowWords.push({ urlPath, wc });
  }

  const robotsM = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
  pages.push({ urlPath, rel, title, h1, wc, robots: robotsM?.[1], inSitemap: sitemapPaths.has(urlPath) });

  // JSON-LD basic checks
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const b of blocks) {
    try {
      const data = JSON.parse(b[1]);
      const items = Array.isArray(data) ? data : data['@graph'] ? data['@graph'] : [data];
      for (const item of items) {
        const type = item['@type'];
        if (type === 'Product' && !item.offers && !item.aggregateRating) {
          jsonLdIssues.push({ urlPath, type, error: 'Product missing offers or aggregateRating' });
        }
        if (type === 'Article' && !item.author) {
          jsonLdIssues.push({ urlPath, type, error: 'Article missing author' });
        }
        if (type === 'FAQPage' && !item.mainEntity) {
          jsonLdIssues.push({ urlPath, type, error: 'FAQPage missing mainEntity' });
        }
      }
    } catch (e) {
      jsonLdIssues.push({ urlPath, type: 'JSON-LD', error: 'Invalid JSON: ' + e.message });
    }
  }

  // Images
  for (const im of html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
    let src = im[1];
    if (src.startsWith('http')) continue;
    if (src.startsWith('../')) src = '/' + src.replace(/^(\.\.\/)+/, '');
    if (!src.startsWith('/')) src = '/' + src;
    const imgPath = path.join(ROOT, src.slice(1));
    if (!fs.existsSync(imgPath)) {
      brokenImg.push({ urlPath, src, page: rel });
    }
  }

  // Links
  for (const a of html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = a[1];
    const text = stripTags(a[2]).trim();
    const nu = normUrl(href);
    if (nu) {
      allLinks.push({ from: urlPath, to: nu, text });
      incomingLinks.set(nu, (incomingLinks.get(nu) || 0) + 1);
      if (!fileExistsForUrl(nu) && !redirectFrom.has(nu)) {
        // check redirect target exists
        const red = redirectFrom.get(nu.replace(/\.html$/, ''));
        if (!red && !nu.includes('nutrithrive')) {
          /* external ok */
        }
      }
    }
    if (BAD_ANCHOR.test(text)) badAnchors.push({ from: urlPath, to: href, text });
  }
}

// Broken internal links (target no file, no redirect)
const brokenLinks = [];
const KNOWN_404 = ['/llms.txt', '/blog/melbourne-food-as-medicine-map-cafes-organic-stores-healthspan-eating-2026.html'];

for (const { from, to, text } of allLinks) {
  if (!to || to.startsWith('http')) continue;
  const exists = fileExistsForUrl(to);
  const red = redirectFrom.get(to);
  const red2 = redirectFrom.get(to.replace(/\.html$/, ''));
  const target = red?.to || red2?.to;
  const targetOk = target ? fileExistsForUrl(target) || target === '/' : false;
  if (!exists && !targetOk) {
    brokenLinks.push({ from, to, text });
  }
}

// Dedupe broken links
const brokenUnique = [...new Map(brokenLinks.map((b) => [b.to, b])).values()];

// Orphans (in sitemap or blog, <=1 incoming)
const orphans = [];
for (const p of pages) {
  if (p.urlPath === '/' || p.urlPath === '/blog/') continue;
  const inc = incomingLinks.get(p.urlPath) || 0;
  const incAlt = incomingLinks.get(p.urlPath.replace(/\.html$/, '')) || 0;
  const total = inc + incAlt;
  if (total <= 1 && (p.urlPath.startsWith('/blog/') || p.inSitemap)) {
    orphans.push({ urlPath: p.urlPath, incoming: total });
  }
}

// CSS/JS assets referenced in HTML
const assetRefs = new Map();
for (const fp of htmlFiles) {
  const html = fs.readFileSync(fp, 'utf8');
  for (const m of html.matchAll(/(?:href|src)=["']([^"']+\.(?:css|js))["']/gi)) {
    let u = m[1];
    if (u.startsWith('http')) continue;
    if (!u.startsWith('/')) u = '/' + u.replace(/^\.\//, '');
    assetRefs.set(u, (assetRefs.get(u) || 0) + 1);
  }
}

const unminified = [];
for (const [u, count] of assetRefs) {
  const fp = path.join(ROOT, u.slice(1));
  if (!fs.existsSync(fp)) continue;
  const buf = fs.readFileSync(fp, 'utf8');
  const size = buf.length;
  const hasMin = u.includes('.min.') || size < 8000;
  const looksUnmin = (buf.includes('\n  ') || buf.includes('/*')) && size > 3000 && !hasMin;
  if (looksUnmin) unminified.push({ path: u, size, pages: count });
}
unminified.sort((a, b) => b.size - a.size);

// Cart/payment robots
const cartPayment = pages.filter((p) => /cart|payment|checkout/i.test(p.urlPath));

const report = {
  generated: new Date().toISOString(),
  pagesScanned: htmlFiles.length,
  duplicatePairs,
  duplicateCount: duplicatePairs.length,
  sitemapUsesHtml: duplicatePairs.filter((d) => d.inSitemapHtml).length,
  brokenUnique,
  known404: KNOWN_404,
  brokenImg: [...new Map(brokenImg.map((b) => [b.src, b])).values()],
  hreflangPages: hreflangPages.length,
  hreflangSample: hreflangPages.slice(0, 5),
  jsonLdIssues,
  h1TitleDupes,
  longTitles,
  lowRatio: lowRatio.sort((a, b) => a.ratio - b.ratio).slice(0, 20),
  lowWords,
  unminified: unminified.slice(0, 30),
  unminifiedTotalRefs: [...assetRefs.values()].reduce((a, b) => a + b, 0),
  orphans: orphans.sort((a, b) => a.incoming - b.incoming).slice(0, 40),
  badAnchors,
  cartPayment,
  llmsExists: fs.existsSync(path.join(ROOT, 'llms.txt')),
};

fs.mkdirSync(path.join(ROOT, 'audit'), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  pages: report.pagesScanned,
  duplicates: report.duplicateCount,
  brokenLinks: report.brokenUnique.length,
  brokenImages: report.brokenImg.length,
  h1TitleDupes: report.h1TitleDupes.length,
  longTitles: report.longTitles.length,
  hreflang: report.hreflangPages,
  jsonLd: report.jsonLdIssues.length,
  orphans: report.orphans.length,
  unminifiedFiles: report.unminified.length,
}, null, 2));
