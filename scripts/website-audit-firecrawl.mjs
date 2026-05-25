#!/usr/bin/env node
/**
 * Full website audit via Firecrawl scrape + analysis.
 * Run: node scripts/website-audit-firecrawl.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FC_DIR = path.join(ROOT, '.firecrawl', 'audit-2026-05-21');
const AUDIT_DIR = path.join(ROOT, 'audit');
const BASE = 'https://nutrithrive.com.au';
const MAX_SCRAPE = 50;

fs.mkdirSync(FC_DIR, { recursive: true });

function slugify(u) {
  return u.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').slice(0, 80);
}

function parseSitemapUrls() {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function parseMapUrls() {
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, '.firecrawl/nutrithrive-map.json'), 'utf8'));
  return raw.data.links.map((l) => l.url.replace(/\/$/, '') === BASE ? `${BASE}/` : l.url);
}

function pickScrapeUrls(sitemap, mapped) {
  const skip = (u) =>
    u.includes('.pdf') ||
    u.includes('/shared/') ||
    u.includes('/nutrithrive_labs') ||
    u.includes('product-detail.html') ||
    u.includes('/index.html');

  const canon = sitemap.filter((u) => !skip(u));
  const priority = [
    `${BASE}/`,
    `${BASE}/about`,
    `${BASE}/contact`,
    `${BASE}/faq`,
    `${BASE}/products`,
    `${BASE}/products/moringa-powder`,
    `${BASE}/products/curry-leaves`,
    `${BASE}/products/black-tea`,
    `${BASE}/products/moringa-soap`,
    `${BASE}/products/combo-pack`,
    `${BASE}/melbourne`,
    `${BASE}/pages/shipping/shipping-returns`,
    `${BASE}/privacy-policy`,
    `${BASE}/blog/`,
    `${BASE}/pages/newsletter`,
  ];
  const ordered = [];
  for (const p of priority) {
    const match = canon.find((u) => u === p || u === p.replace(/\/$/, ''));
    if (match && !ordered.includes(match)) ordered.push(match);
  }
  for (const u of canon) {
    if (!ordered.includes(u)) ordered.push(u);
  }
  // Add mapped-only URLs not in sitemap (limit extras)
  for (const u of mapped) {
    if (ordered.length >= MAX_SCRAPE) break;
    if (!skip(u) && !ordered.includes(u) && u.startsWith(BASE)) ordered.push(u);
  }
  return ordered.slice(0, MAX_SCRAPE);
}

function extractFromHtml(html, url) {
  const pick = (re) => (html.match(re) || [])[1]?.trim() || null;
  const pickAll = (re) => [...html.matchAll(re)].map((m) => m[1].trim());

  const title = pick(/<title[^>]*>([^<]*)<\/title>/i);
  const metaDesc = pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
    || pick(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const canonical = pick(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)
    || pick(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  const robots = pick(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
  const h1s = pickAll(/<h1[^>]*>([^<]*(?:<[^/h][^>]*>[^<]*)*)<\/h1>/gi).map((s) =>
    s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim()
  );
  const h2s = pickAll(/<h2[^>]*>([^<]*(?:<[^/h][^>]*>[^<]*)*)<\/h2>/gi).map((s) =>
    s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim()
  ).slice(0, 8);
  const h3s = pickAll(/<h3[^>]*>([^<]*(?:<[^/h][^>]*>[^<]*)*)<\/h3>/gi).map((s) =>
    s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim()
  ).slice(0, 6);

  const mainMatch = html.match(/<main[\s\S]*?<\/main>/i) || html.match(/<article[\s\S]*?<\/article>/i);
  const mainText = (mainMatch ? mainMatch[0] : html)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = mainText ? mainText.split(/\s+/).filter(Boolean).length : 0;

  const imgs = [...html.matchAll(/<img[^>]*>/gi)].map((m) => {
    const tag = m[0];
    const src = (tag.match(/\ssrc=["']([^"']+)["']/i) || [])[1] || '';
    const altM = tag.match(/\salt=["']([^"']*)["']/i);
    const alt = altM ? altM[1] : null;
    const loading = (tag.match(/\sloading=["']([^"']+)["']/i) || [])[1] || null;
    return { src, alt, loading, missingAlt: alt === null || alt === '' };
  });

  const internalLinks = [...html.matchAll(/href=["'](\/[^"'#?][^"']*)["']/gi)]
    .map((m) => m[1])
    .filter((h) => !h.startsWith('//') && !h.match(/\.(css|js|webp|jpg|png|pdf)$/i));

  const schemaTypes = [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
  const hreflang = pickAll(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["']/gi);

  return {
    url,
    title,
    titleLen: title?.length || 0,
    metaDesc,
    metaDescLen: metaDesc?.length || 0,
    canonical,
    robots,
    h1s,
    h2s,
    h3s,
    wordCount,
    images: imgs.length,
    imagesMissingAlt: imgs.filter((i) => i.missingAlt).length,
    imageSample: imgs.slice(0, 5),
    internalLinkCount: new Set(internalLinks).size,
    internalLinksSample: [...new Set(internalLinks)].slice(0, 12),
    schemaTypes: [...new Set(schemaTypes)],
    hreflang,
    status: 'ok',
  };
}

function scrapeUrl(url) {
  const out = path.join(FC_DIR, `${slugify(url)}.html`);
  if (fs.existsSync(out) && fs.statSync(out).size > 500) {
    return fs.readFileSync(out, 'utf8');
  }
  try {
    execSync(`firecrawl scrape "${url}" --html -o "${out}"`, {
      cwd: ROOT,
      stdio: 'pipe',
      timeout: 90000,
    });
    return fs.readFileSync(out, 'utf8');
  } catch (e) {
    return null;
  }
}

function classifyUrl(u) {
  if (u === `${BASE}/` || u === BASE) return 'homepage';
  if (u.includes('/blog/')) return 'blog';
  if (u.includes('/products/')) return 'product';
  if (u.includes('/melbourne')) return 'landing';
  if (u.match(/\/(about|contact|faq|newsletter|shipping)/)) return 'about-contact';
  if (u.includes('privacy')) return 'legal';
  return 'other';
}

function groupByType(urls) {
  const g = {};
  for (const u of urls) {
    const t = classifyUrl(u);
    (g[t] ||= []).push(u);
  }
  return g;
}

// --- Run ---
const sitemap = parseSitemapUrls();
const mapped = parseMapUrls();
const scrapeUrls = pickScrapeUrls(sitemap, mapped);
const allMapped = [...new Set(mapped.map((u) => u.replace(/\/$/, '') === BASE ? `${BASE}/` : u))];

console.log(`Scraping ${scrapeUrls.length} pages...`);
const pages = [];
for (let i = 0; i < scrapeUrls.length; i++) {
  const url = scrapeUrls[i];
  process.stdout.write(`[${i + 1}/${scrapeUrls.length}] ${url}\n`);
  const html = scrapeUrl(url);
  if (!html) {
    pages.push({ url, status: 'scrape_failed' });
    continue;
  }
  pages.push(extractFromHtml(html, url));
}

fs.writeFileSync(path.join(FC_DIR, 'pages.json'), JSON.stringify(pages, null, 2));

// --- Analysis ---
const ok = pages.filter((p) => p.status === 'ok');
const titles = ok.map((p) => p.title).filter(Boolean);
const titleCounts = {};
titles.forEach((t) => { titleCounts[t] = (titleCounts[t] || 0) + 1; });
const dupTitles = Object.entries(titleCounts).filter(([, c]) => c > 1);

const metaCounts = {};
ok.forEach((p) => { if (p.metaDesc) metaCounts[p.metaDesc] = (metaCounts[p.metaDesc] || 0) + 1; });
const dupMeta = Object.entries(metaCounts).filter(([, c]) => c > 1);

const issues = {
  missingTitle: ok.filter((p) => !p.title),
  titleLong: ok.filter((p) => p.titleLen > 60),
  titleShort: ok.filter((p) => p.titleLen > 0 && p.titleLen < 30),
  missingMeta: ok.filter((p) => !p.metaDesc),
  metaLong: ok.filter((p) => p.metaDescLen > 160),
  metaShort: ok.filter((p) => p.metaDescLen > 0 && p.metaDescLen < 70),
  noH1: ok.filter((p) => !p.h1s.length),
  multiH1: ok.filter((p) => p.h1s.length > 1),
  thin: ok.filter((p) => p.wordCount < 300),
  missingAlt: ok.filter((p) => p.imagesMissingAlt > 0),
  noSchema: ok.filter((p) => !p.schemaTypes.length),
  dupTitles,
  dupMeta,
};

fs.writeFileSync(path.join(FC_DIR, 'issues.json'), JSON.stringify(issues, null, 2));
console.log('Done. Pages:', ok.length, 'Issues saved.');

export { pages, issues, allMapped, sitemap, scrapeUrls, groupByType, classifyUrl, AUDIT_DIR, FC_DIR, BASE };
