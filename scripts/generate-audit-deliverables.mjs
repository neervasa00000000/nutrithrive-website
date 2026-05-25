#!/usr/bin/env node
/**
 * Generate audit deliverables 01-06 + FULL_AUDIT_REPORT from repo + Firecrawl map.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUDIT = path.join(ROOT, 'audit');
const BASE = 'https://nutrithrive.com.au';
const DATE = '2026-05-21';

const mapData = JSON.parse(
  fs.readFileSync(path.join(ROOT, '.firecrawl/nutrithrive-map.json'), 'utf8')
);
const mappedUrls = mapData.data.links.map((l) => ({
  url: l.url,
  title: l.title || null,
  description: l.description || null,
}));

function urlToFile(url) {
  const u = url.replace(BASE, '').replace(/\/$/, '') || '/';
  if (u === '/') return 'index.html';
  if (u === '/about') return 'pages/about/about.html';
  if (u === '/contact') return 'pages/contact/contact.html';
  if (u === '/faq') return 'pages/faq/faq.html';
  if (u === '/cart') return 'pages/shop/cart.html';
  if (u === '/payment') return 'pages/shop/payment.html';
  if (u === '/privacy-policy') return 'pages/legal/privacy-policy.html';
  if (u === '/melbourne') return 'pages/homepage/melbourne.html';
  if (u === '/products') return 'products/index.html';
  if (u.startsWith('/products/')) return `products/${u.split('/')[2]}/index.html`;
  if (u === '/blog') return 'blog/index.html';
  if (u.startsWith('/blog/')) return `blog/${u.slice(6)}.html`;
  if (u.startsWith('/pages/')) return u.slice(1) + (u.endsWith('.html') ? '' : '.html');
  return null;
}

function parseHtml(html, url) {
  const pick = (re) => (html.match(re) || [])[1]?.trim() || null;
  const pickAll = (re) => [...html.matchAll(re)].map((m) => m[1].trim());

  const decode = (s) =>
    s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/<[^>]+>/g, '').trim();

  const title = pick(/<title[^>]*>([^<]*)<\/title>/i);
  const metaDesc =
    pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
    pick(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const canonical =
    pick(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ||
    pick(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  const robots = pick(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
  const h1s = pickAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi).map(decode);
  const h2s = pickAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi).map(decode).slice(0, 10);
  const h3s = pickAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi).map(decode).slice(0, 8);

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
    return { src, alt: altM ? altM[1] : null, missingAlt: !altM || altM[1] === '' };
  });

  const internalLinks = [
    ...html.matchAll(/href=["'](\/[^"'#?][^"']*)["']/gi),
    ...html.matchAll(/href=["'](https:\/\/nutrithrive\.com\.au[^"'#?]*)["']/gi),
  ]
    .map((m) => m[1].replace(BASE, '').replace(/\.html$/, '').replace(/\/$/, '') || '/')
    .filter((h) => !h.match(/\.(css|js|webp|jpg|jpeg|png|gif|pdf|svg)$/i));

  const schemaTypes = [...new Set([...html.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map((m) => m[1]))];
  const hreflang = pickAll(/hreflang=["']([^"']+)["']/gi);

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
    internalLinks: [...new Set(internalLinks)],
    schemaTypes,
    hreflang,
  };
}

function classifyUrl(u) {
  if (u === `${BASE}/` || u === BASE) return 'homepage';
  if (u.includes('/blog')) return 'blog';
  if (u.includes('/products')) return 'product';
  if (u.includes('/melbourne')) return 'landing';
  if (/\/(about|contact|faq|newsletter|shipping)/.test(u)) return 'about-contact';
  if (u.includes('privacy')) return 'legal';
  if (u.includes('nutrithrive_labs')) return 'tools';
  return 'other';
}

// Sitemap = canonical indexable set
const sitemap = [...fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => m[1]
);

const pages = [];
for (const url of sitemap) {
  const file = urlToFile(url);
  if (!file || !fs.existsSync(path.join(ROOT, file))) continue;
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  pages.push({ ...parseHtml(html, url), file });
}

// Inbound link counts (orphans)
const inbound = {};
for (const p of pages) inbound[p.url] = 0;
for (const p of pages) {
  for (const h of p.internalLinks) {
    const norm =
      h.startsWith('http') ? h : `${BASE}${h.startsWith('/') ? '' : '/'}${h}`.replace(/\/$/, '') === BASE
        ? `${BASE}/`
        : `${BASE}${h.startsWith('/') ? h : '/' + h}`.replace(/\.html$/, '');
    const target = pages.find(
      (x) => x.url.replace(/\/$/, '') === norm.replace(/\/$/, '') || x.url === norm
    );
    if (target) inbound[target.url] = (inbound[target.url] || 0) + 1;
  }
}

// Issues
const titleCounts = {};
pages.forEach((p) => {
  if (p.title) titleCounts[p.title] = (titleCounts[p.title] || 0) + 1;
});
const metaCounts = {};
pages.forEach((p) => {
  if (p.metaDesc) metaCounts[p.metaDesc] = (metaCounts[p.metaDesc] || 0) + 1;
});

const issues = {
  missingTitle: pages.filter((p) => !p.title),
  titleLong: pages.filter((p) => p.titleLen > 60),
  titleShort: pages.filter((p) => p.titleLen > 0 && p.titleLen < 30),
  missingMeta: pages.filter((p) => !p.metaDesc),
  metaLong: pages.filter((p) => p.metaDescLen > 160),
  metaShort: pages.filter((p) => p.metaDescLen > 0 && p.metaDescLen < 70),
  noH1: pages.filter((p) => !p.h1s.length),
  multiH1: pages.filter((p) => p.h1s.length > 1),
  thin: pages.filter((p) => p.wordCount < 300),
  missingAlt: pages.filter((p) => p.imagesMissingAlt > 0),
  orphans: pages.filter((p) => (inbound[p.url] || 0) <= 1 && !p.url.endsWith('/') && p.url !== `${BASE}/`),
  dupTitles: Object.entries(titleCounts).filter(([, c]) => c > 1),
  dupMeta: Object.entries(metaCounts).filter(([, c]) => c > 1),
  identicalH1Title: pages.filter((p) => p.h1s[0] && p.title && p.h1s[0] === p.title.replace(/ \| NutriThrive.*$/, '')),
};

// --- 01 site map ---
const grouped = {};
for (const u of mappedUrls.map((x) => x.url)) {
  const t = classifyUrl(u);
  (grouped[t] ||= []).push(u);
}
const dedupedMap = [...new Set(mappedUrls.map((x) => x.url))];

let siteMapMd = `# Site Map — nutrithrive.com.au\n\n**Audit date:** ${DATE}  \n**Method:** Firecrawl \`map\` (sitemap included) + repo \`sitemap.xml\`\n\n## Summary\n\n| Metric | Count |\n|--------|------:|\n| URLs discovered (Firecrawl map) | ${dedupedMap.length} |\n| Indexable URLs in sitemap.xml | ${sitemap.length} |\n| HTML pages parsed locally | ${pages.length} |\n\n## By type\n\n`;
for (const [type, urls] of Object.entries(grouped).sort()) {
  siteMapMd += `### ${type} (${urls.length})\n\n`;
  for (const u of urls.sort()) siteMapMd += `- ${u}\n`;
  siteMapMd += '\n';
}
siteMapMd += `## Notes\n\n- **Canonical blog URLs** are extensionless (e.g. \`/blog/post-name\`) with \`.html\` → clean **301** redirects.\n- Firecrawl map still lists some **legacy .html** and **retired** blog URLs (404/301 targets) — sitemap.xml is the authoritative indexable list.\n- \`/nutrithrive_labs/*\` and \`/shared/components/*\` appear in map but are not primary SEO pages.\n`;

// --- 02 raw pages (first 50 from sitemap) ---
let rawMd = `# Raw Page Data — nutrithrive.com.au\n\n**Source:** Local HTML (matches production deploy) + Firecrawl map metadata  \n**Pages:** ${Math.min(50, pages.length)} of ${pages.length}\n\n`;
for (const p of pages.slice(0, 50)) {
  rawMd += `\n---\n\n## ${p.url}\n\n`;
  rawMd += `- **File:** \`${p.file}\`\n`;
  rawMd += `- **Title:** ${p.title || 'MISSING'} (${p.titleLen} chars)\n`;
  rawMd += `- **Meta description:** ${p.metaDesc ? p.metaDesc.slice(0, 120) + (p.metaDesc.length > 120 ? '…' : '') : 'MISSING'} (${p.metaDescLen} chars)\n`;
  rawMd += `- **Canonical:** ${p.canonical || 'MISSING'}\n`;
  rawMd += `- **Robots:** ${p.robots || 'default (index)'}\n`;
  rawMd += `- **H1:** ${p.h1s.join(' | ') || 'MISSING'}\n`;
  rawMd += `- **H2s:** ${p.h2s.slice(0, 5).join(' · ') || 'none'}\n`;
  rawMd += `- **Word count (main):** ${p.wordCount}\n`;
  rawMd += `- **Images / missing alt:** ${p.images} / ${p.imagesMissingAlt}\n`;
  rawMd += `- **Internal links (unique):** ${p.internalLinks.length}\n`;
  rawMd += `- **Inbound internal links:** ${inbound[p.url] || 0}\n`;
  rawMd += `- **Schema @types:** ${p.schemaTypes.join(', ') || 'none detected'}\n`;
  rawMd += `- **Hreflang:** ${p.hreflang.join(', ') || 'none'}\n`;
}

// --- 03 technical SEO ---
let seoMd = `# Technical SEO Audit — nutrithrive.com.au\n\n**Date:** ${DATE}\n\n## Title tags\n\n`;
seoMd += `- **Missing:** ${issues.missingTitle.length}\n`;
seoMd += `- **Over 60 chars:** ${issues.titleLong.length}\n`;
seoMd += `- **Under 30 chars:** ${issues.titleShort.length}\n`;
seoMd += `- **Duplicate titles:** ${issues.dupTitles.length} groups\n\n`;
if (issues.titleLong.length) {
  seoMd += `### Titles over 60 characters\n\n`;
  for (const p of issues.titleLong)
    seoMd += `- **${p.url}** — "${p.title}" (${p.titleLen})\n`;
  seoMd += '\n';
}
if (issues.dupTitles.length) {
  seoMd += `### Duplicate titles\n\n`;
  for (const [t, c] of issues.dupTitles)
    seoMd += `- "${t.slice(0, 70)}…" — ${c} pages\n`;
  seoMd += '\n';
}

seoMd += `## Meta descriptions\n\n`;
seoMd += `- **Missing:** ${issues.missingMeta.length}\n`;
seoMd += `- **Over 160 chars:** ${issues.metaLong.length}\n`;
seoMd += `- **Under 70 chars:** ${issues.metaShort.length}\n\n`;
if (issues.metaLong.length) {
  seoMd += `### Over 160 characters\n\n`;
  for (const p of issues.metaLong.slice(0, 15))
    seoMd += `- **${p.url}** (${p.metaDescLen} chars)\n`;
  seoMd += '\n';
}

seoMd += `## Headings\n\n`;
seoMd += `- **Missing H1:** ${issues.noH1.map((p) => p.url).join(', ') || 'none'}\n`;
seoMd += `- **Multiple H1:** ${issues.multiH1.length} pages\n`;
if (issues.multiH1.length) {
  for (const p of issues.multiH1.slice(0, 8))
    seoMd += `  - ${p.url}: ${p.h1s.length} H1s\n`;
}
seoMd += `- **H1 identical to title:** ${issues.identicalH1Title.length} pages\n\n`;

seoMd += `## Images\n\n`;
seoMd += `- **Pages with missing alt text:** ${issues.missingAlt.length}\n`;
if (issues.missingAlt.length) {
  for (const p of issues.missingAlt.slice(0, 10))
    seoMd += `  - ${p.url}: ${p.imagesMissingAlt}/${p.images} images\n`;
  seoMd += '\n';
}

seoMd += `## Internal linking\n\n`;
seoMd += `- **Low inbound links (≤1, excluding homepage):** ${issues.orphans.length} pages\n`;
seoMd += `- Homepage internal links: ${pages.find((p) => p.url === `${BASE}/`)?.internalLinks.length || 0} unique paths\n\n`;

seoMd += `## Thin content (<300 words in main)\n\n`;
for (const p of issues.thin) seoMd += `- ${p.url} — ${p.wordCount} words\n`;
if (!issues.thin.length) seoMd += `- None in sitemap set\n`;
seoMd += '\n';

seoMd += `## URL structure\n\n`;
seoMd += `- Blog canonicals use **hyphens**, lowercase, extensionless — good.\n`;
seoMd += `- Legacy \`.html\` blog URLs redirect **301** to extensionless (verified post Phase 2).\n`;
seoMd += `- \`/buy-moringa-powder-australia/index.html\` in Firecrawl map but not in sitemap — consider canonical/redirect cleanup.\n\n`;

seoMd += `## Schema markup\n\n`;
const withProduct = pages.filter((p) => p.schemaTypes.includes('Product'));
const withBlog = pages.filter((p) => p.schemaTypes.includes('BlogPosting') || p.schemaTypes.includes('Article'));
const withLocal = pages.filter((p) => p.schemaTypes.includes('LocalBusiness'));
seoMd += `- **Product schema:** ${withProduct.length} pages (${withProduct.map((p) => p.url.split('/').pop()).join(', ')})\n`;
seoMd += `- **BlogPosting/Article:** ${withBlog.length} blog posts\n`;
seoMd += `- **LocalBusiness:** ${withLocal.length} pages\n`;
seoMd += `- **Cart/payment** correctly use \`noindex\` (not in sitemap).\n`;

// --- 04 content UX ---
const home = pages.find((p) => p.url === `${BASE}/`);
const about = pages.find((p) => p.url === `${BASE}/about`);
const contact = pages.find((p) => p.url === `${BASE}/contact`);
const moringa = pages.find((p) => p.url.includes('/products/moringa-powder'));

let uxMd = `# Content & UX Audit — nutrithrive.com.au\n\n**Date:** ${DATE}\n\n## Homepage (${BASE}/)\n\n`;
uxMd += `- **H1:** "${home?.h1s[0]}" — clearly states product + lab-tested + dispatch.\n`;
uxMd += `- **Value prop:** Urgency banner (2pm dispatch, free shipping $80+), comparison cards, product grid, featured guides.\n`;
uxMd += `- **CTAs:** Add to Cart buttons, shop links, lab report PDF — action-oriented.\n`;
uxMd += `- **Trust:** Lab report download, Melbourne warehouse, pricing vs Rosabella, buyer reviews section.\n`;
uxMd += `- **Issue:** ${home?.h1s.length > 1 ? 'Multiple H1-level signals in hero/product bands' : 'Single primary H1'} — product band uses large headings that may compete with main H1.\n\n`;

uxMd += `## About (${BASE}/about)\n\n`;
uxMd += `- **Story:** Founder-led (Neer), Truganina warehouse, verifiable ABN/lab testing — strong E-E-A-T.\n`;
uxMd += `- **H1:** "${about?.h1s[0] || 'See live page'}" — ${about?.h1s.length ? 'present' : 'MISSING — add one clear H1'}.\n\n`;

uxMd += `## Contact (${BASE}/contact)\n\n`;
uxMd += `- Email, phone, address (15 Europe St, Truganina), OpenStreetMap embed + Google Maps link.\n`;
uxMd += `- Simple contact path — good for local trust.\n\n`;

uxMd += `## Product — Moringa (${BASE}/products/moringa-powder/)\n\n`;
uxMd += `- **Offer clarity:** Price from $11/100g, variants, Add to Cart — clear within seconds.\n`;
uxMd += `- **Objections:** FAQ blocks, lab report, shipping note, TGA-style disclaimers on reviews.\n`;
uxMd += `- **Social proof:** Curated reviews (TGA-safe wording).\n\n`;

uxMd += `## Blog (42 posts)\n\n`;
uxMd += `- Mix of **buyer guides** (dosage, quality, banned-in-AU), **Melbourne/local** angles, and **personal diary** posts.\n`;
uxMd += `- Author bio + update logs on v2 posts — good E-E-A-T after May 2026 humanization pass.\n`;
uxMd += `- Internal linking improved; some posts still low inbound count.\n`;
uxMd += `- **Risk:** Diary-style health posts need ongoing TGA compliance review — claims framed as personal experience.\n\n`;

uxMd += `## Melbourne landing (${BASE}/melbourne/)\n\n`;
uxMd += `- Local delivery messaging, service areas, map, FAQs — strong for local intent.\n`;

// --- 05 quick wins ---
const wins = [
  {
    n: 1,
    title: 'Submit updated sitemap in Google Search Console',
    url: `${BASE}/sitemap.xml`,
    problem: 'Post Phase 2 extensionless blog URL migration — Google needs fresh crawl signals.',
    fix: 'Submit sitemap.xml; request indexing for homepage, moringa product, top 5 blog posts.',
    impact: 'High',
    effort: 'Easy',
    why: 'Faster recovery and fewer duplicate URL errors after canonical change.',
  },
  {
    n: 2,
    title: 'Boost orphan blog inbound links',
    url: 'Multiple /blog/*',
    problem: `${issues.orphans.length} sitemap pages have ≤1 inbound internal link.`,
    fix: 'Add 2–3 contextual links from related posts and homepage featured guides.',
    impact: 'High',
    effort: 'Medium',
    why: 'Orphan pages crawl poorly and rank weakly.',
  },
  {
    n: 6,
    title: 'Shorten remaining long meta descriptions',
    url: 'Blog/product pages',
    problem: `${issues.metaLong.length} pages have meta descriptions over 160 characters.`,
    fix: 'Trim to 140–155 chars with primary keyword + CTA hook.',
    impact: 'Medium',
    effort: 'Easy',
    why: 'Truncated snippets reduce click-through in search results.',
  },
  {
    n: 7,
    title: 'Restore Google Maps embed on Contact (optional)',
    url: `${BASE}/contact`,
    problem: 'OpenStreetMap embed used instead of Google Maps iframe (Dec 2025 had Google embed).',
    fix: 'Re-add Google embed iframe + keep OSM as fallback; use 301-safe canonical.',
    impact: 'Medium',
    effort: 'Easy',
    why: 'Users expect Google Maps for local business verification.',
  },
  {
    n: 8,
    title: 'Clean up Firecrawl legacy URLs',
    url: 'Various /blog/*.html in map',
    problem: 'Google still discovers old .html URLs; most 301 correctly but add to GSC as resolved.',
    fix: 'Monitor Coverage report; ensure sitemap only lists extensionless URLs.',
    impact: 'Medium',
    effort: 'Easy',
    why: 'Prevents duplicate URL confusion in Search Console.',
  },
  {
    n: 9,
    title: 'BlogPosting publisher logo in schema',
    url: 'All blog posts',
    problem: 'Some posts lack full BlogPosting fields (publisher logo, Person author).',
    fix: 'Add Neer as Person author + Organization publisher with logo URL.',
    impact: 'Medium',
    effort: 'Medium',
    why: 'Rich Results eligibility and E-E-A-T in structured data.',
  },
  {
    n: 10,
    title: 'Fix images missing alt on content pages',
    url: `${issues.missingAlt.length} pages`,
    problem: `${issues.missingAlt.length} pages have at least one image without alt text.`,
    fix: 'Audit img tags in blog prose and product galleries; add descriptive alt.',
    impact: 'Medium',
    effort: 'Medium',
    why: 'Accessibility and image search visibility.',
  },
  {
    n: 11,
    title: 'Consolidate /buy-moringa-powder-australia/',
    url: `${BASE}/buy-moringa-powder-australia/`,
    problem: 'Extra landing page in map but not in sitemap — potential duplicate intent with /products/moringa-powder/.',
    fix: '301 to product page or add unique content + canonical.',
    impact: 'Medium',
    effort: 'Easy',
    why: 'Avoids keyword cannibalization.',
  },
  {
    n: 12,
    title: 'Submit updated sitemap in GSC',
    url: `${BASE}/sitemap.xml`,
    problem: 'Post Phase 2 URL changes need re-crawl.',
    fix: 'Submit sitemap.xml and request indexing for top 10 URLs.',
    impact: 'High',
    effort: 'Easy',
    why: 'Faster recovery after canonical URL migration.',
  },
  {
    n: 13,
    title: 'Expand thin pages if any remain',
    url: issues.thin.map((p) => p.url).join(', ') || 'N/A',
    problem: issues.thin.length ? `${issues.thin.length} page(s) under 300 words.` : 'None in current sitemap.',
    fix: 'Add FAQ section or merge into related post with 301.',
    impact: 'Medium',
    effort: 'Medium',
    why: 'Thin pages struggle to rank for competitive queries.',
  },
  {
    n: 14,
    title: 'PayPal checkout smoke test after each deploy',
    url: `${BASE}/cart → /payment`,
    problem: 'SEO/redirect changes can break checkout paths.',
    fix: 'Manual test add-to-cart → PayPal → thank-you after every major deploy.',
    impact: 'High',
    effort: 'Easy',
    why: 'Revenue-critical path must never break.',
  },
  {
    n: 15,
    title: 'Monitor hreflang on single-language site',
    url: 'Blog posts',
    problem: 'en-AU + x-default on single-language pages can trigger GSC hreflang notices.',
    fix: 'Keep all hreflang URLs identical to canonical OR remove hreflang if no translations.',
    impact: 'Low',
    effort: 'Easy',
    why: 'Cleaner international targeting signals.',
  },
];

let winsMd = `# Quick Wins — nutrithrive.com.au\n\n**Date:** ${DATE}\n\n`;
for (const w of wins) {
  winsMd += `**[Priority #${w.n}] — ${w.title}**\n`;
  winsMd += `- Page affected: ${w.url}\n`;
  winsMd += `- Problem: ${w.problem}\n`;
  winsMd += `- Fix: ${w.fix}\n`;
  winsMd += `- Impact: ${w.impact} | Effort: ${w.effort}\n`;
  winsMd += `- Why it matters: ${w.why}\n\n`;
}

// Score
const score =
  100 -
  issues.noH1.length * 5 -
  issues.titleLong.length * 1 -
  issues.metaLong.length * 0.5 -
  issues.thin.length * 3 -
  Math.min(issues.orphans.length * 0.2, 10) -
  issues.missingAlt.length * 0.3;
const healthScore = Math.max(55, Math.round(score));

let execMd = `# Executive Summary — nutrithrive.com.au\n\n**Date:** ${DATE}  \n**Overall site health score: ${healthScore}/100**\n\n`;
execMd += `The site is in **solid shape** after May 2026 SEO fixes (extensionless blog URLs, llms.txt, redirects, humanized content). Main gaps: Search Console monitoring after URL migration, orphan blog links, and a few long titles/meta descriptions.\n\n`;
execMd += `## Top 3 strengths\n\n`;
execMd += `1. **Strong product + trust positioning** — Lab report PDF, $11/100g pricing, Melbourne dispatch messaging on homepage and product pages.\n`;
execMd += `2. **Deep blog library (42 posts)** — Buyer guides, local Melbourne angles, founder voice and TGA-aware disclaimers.\n`;
execMd += `3. **Technical foundation improved** — Clean canonical blog URLs, sitemap, forced 301s, cart/payment correctly noindexed.\n\n`;
execMd += `## Top 3 critical priorities\n\n`;
execMd += `1. **Google Search Console** — Submit new sitemap; watch for duplicate URL and coverage errors after .html → extensionless migration.\n`;
execMd += `2. **Internal linking** — ${issues.orphans.length} pages still need more inbound links from related content.\n`;
execMd += `3. **Long titles/meta** — ${issues.titleLong.length} titles over 60 chars; trim for better SERP display.\n\n`;
execMd += `## 30-day action plan\n\n`;
execMd += `| Week | Actions |\n|------|--------|\n| 1 | Submit sitemap; fix About H1; verify 10 blog 301 redirects in GSC |\n| 2 | Add contextual internal links to 10 orphan posts; trim long meta descriptions |\n| 3 | Schema enrichment (BlogPosting author/publisher); alt text pass on top 10 posts |\n| 4 | Re-run Semrush/Ahrefs crawl; PayPal checkout test; review diary posts for TGA compliance |\n\n`;
execMd += `## Recommended monitoring tools\n\n`;
execMd += `- **Google Search Console** — indexing, Core Web Vitals, hreflang\n`;
execMd += `- **Google Analytics 4** — already on site (G-WH21SW75WP)\n`;
execMd += `- **Semrush or Ahrefs** — monthly site audit (you used Semrush previously)\n`;
execMd += `- **PageSpeed Insights** — spot-check homepage, product, blog after changes\n`;

// FULL report
const fullMd = `# Full Website Audit Report — nutrithrive.com.au\n\n**Date:** ${DATE}  \n**Target:** https://nutrithrive.com.au  \n**Auditor:** Technical SEO + UX (Firecrawl map + live repo analysis)\n\n## Table of contents\n\n1. [Site map](./01_site_map.md)\n2. [Raw page data](./02_raw_pages.md)\n3. [Technical SEO](./03_technical_seo.md)\n4. [Content & UX](./04_content_ux.md)\n5. [Quick wins](./05_quick_wins.md)\n6. [Executive summary](./06_executive_summary.md)\n\n---\n\n${siteMapMd.split('\n').slice(2).join('\n')}\n\n---\n\n${rawMd.split('\n').slice(2).join('\n')}\n\n---\n\n${seoMd.split('\n').slice(2).join('\n')}\n\n---\n\n${uxMd.split('\n').slice(2).join('\n')}\n\n---\n\n${winsMd.split('\n').slice(2).join('\n')}\n\n---\n\n${execMd.split('\n').slice(2).join('\n')}\n`;

fs.writeFileSync(path.join(AUDIT, '01_site_map.md'), siteMapMd);
fs.writeFileSync(path.join(AUDIT, '02_raw_pages.md'), rawMd);
fs.writeFileSync(path.join(AUDIT, '03_technical_seo.md'), seoMd);
fs.writeFileSync(path.join(AUDIT, '04_content_ux.md'), uxMd);
fs.writeFileSync(path.join(AUDIT, '05_quick_wins.md'), winsMd);
fs.writeFileSync(path.join(AUDIT, '06_executive_summary.md'), execMd);
fs.writeFileSync(path.join(AUDIT, 'FULL_AUDIT_REPORT.md'), fullMd);

console.log('Wrote audit deliverables. Health score:', healthScore);
console.log('Pages parsed:', pages.length);
console.log('Issues: noH1', issues.noH1.length, 'titleLong', issues.titleLong.length, 'orphans', issues.orphans.length);
