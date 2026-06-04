#!/usr/bin/env node
/**
 * Phase 2 SEO fixes — run: node scripts/seo-phase2-fix.mjs
 * Dry run: node scripts/seo-phase2-fix.mjs --dry-run
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry-run');
const BASE = 'https://nutrithrive.com.au';

const blogDir = path.join(ROOT, 'blog');
const slugs = fs
  .readdirSync(blogDir)
  .filter((f) => f.endsWith('.html') && f !== 'index.html')
  .map((f) => f.replace(/\.html$/, ''));

/** H1 overrides where title === h1 (slug → new h1) */
const H1_OVERRIDES = {
  'best-greens-powder-australia-2026': 'I Compared Greens Powders in Australia — What I’d Buy Again',
  'best-superfoods-australia-comparison-health-conscious-adults':
    'Best Superfoods in Australia 2026: Moringa, Curry Leaves & Black Tea',
  'chronic-fatigue-what-actually-fixed-it-2026':
    'What Helped My Energy After Years of Feeling Flat',
  'cortisol-belly-fat-couldnt-lose-stomach-melbourne-2026':
    'Cortisol, Belly Fat, and What Changed for Me in Melbourne',
  'cystic-acne-gut-healing-what-actually-cleared-skin-2026':
    'Cystic Acne, Gut Health, and What Helped My Skin',
  'green-superfood-smoothie-recipes-australia-2026':
    'Green Smoothie Recipes That Don’t Taste Like Lawn Clippings',
  'how-to-add-moringa-to-diet': 'How I Actually Get Moringa Into Meals (Without Gagging)',
  'moringa-30-day-challenge-honest-results': '30 Days of Moringa — Honest Results From Truganina',
  'moringa-melbourne-complete-guide-2026': 'Moringa in Melbourne: What I Tell Every Local Buyer',
  'moringa-quality-test-shade-dried-vs-retail-australia-2026':
    'Shade-Dried vs Shelf Moringa — What We See in the Warehouse',
  'moringa-vs-spirulina-vs-matcha-comparison-australia':
    'Moringa vs Spirulina vs Matcha — Side-by-Side in Australia',
  'science-shade-drying-vs-sun-drying-moringa':
    'Shade-Dried vs Sun-Dried Moringa — Why Colour Matters',
  'verify-moringa-quality-premium-buyers-checklist-2026':
    'How I Check Moringa Quality Before We Pack a Batch',
  'what-to-eat-when-too-tired-melbourne-2026':
    'Too Tired to Cook in Melbourne? Food That Actually Helps',
  '10-dollar-superfood-replaced-200-supplement-stack-australia-2026':
    'How a $10 Moringa Habit Replaced My $200 Supplement Stack',
  'cant-lose-weight-broken-gut-what-actually-worked-2026':
    'Weight and Gut Health: What Finally Shifted for Me',
  'does-moringa-have-caffeine-truth-about-energy-focus-side-effects-2026':
    'Does Moringa Have Caffeine? What I Felt on Energy and Focus',
  'high-protein-moringa-recipes-australia-2026':
    'High-Protein Moringa Meals I Actually Cook in Australia',
  'how-to-use-moringa-powder-daily-without-the-bad-taste-2026':
    'Using Moringa Daily Without the Grassy Taste Problem',
};

/** Title shorten (slug → new title) for >60 chars */
const TITLE_SHORTEN = {
  'chronic-fatigue-what-actually-fixed-it-2026': 'Chronic Fatigue: What Helped My Energy (2026)',
  'cortisol-belly-fat-couldnt-lose-stomach-melbourne-2026':
    'Cortisol Belly Fat: What Worked for Me (2026)',
  'quit-sugar-90-days-honest-diary-melbourne-2026':
    '90-Day Sugar-Free Diary: Honest Results (2026)',
  'how-to-choose-greens-powder-australia-2026':
    'How to Choose Greens Powder in Australia (2026)',
  'how-to-choose-moringa-powder-australia-2026':
    'Choose Moringa Powder in Australia — Buyer Guide 2026',
  'how-to-grow-moringa-in-australia-complete-guide-2026':
    'Grow Moringa in Australia — Complete Guide 2026',
  'how-to-read-moringa-batch-codes-freshness':
    'Read Moringa Batch Codes & Check Freshness (2026)',
  'verify-moringa-quality-premium-buyers-checklist-2026':
    'Verify Moringa Quality: 8-Point Checklist (2026)',
  'fresh-moringa-leaves-vs-powder-nutrients-2026':
    'Fresh Moringa Leaves vs Powder — Nutrients (2026)',
  'how-much-moringa-powder-per-day-dosage-guide-2026':
    'Moringa Dosage Per Day — Australia Guide (2026)',
  'is-moringa-banned-australia-truth-2026':
    'Is Moringa Banned in Australia? The Truth (2026)',
  'moringa-side-effects-what-happens-take-too-much-2026':
    'Moringa Side Effects: Too Much? (2026) | NutriThrive',
  'moringa-capsules-vs-powder-which-is-better-2026':
    'Moringa Capsules vs Powder (2026) | NutriThrive',
  'moringa-oil-benefits-skin-hair-health-2026':
    'Moringa Oil: Skin, Hair & Health (2026) | NutriThrive',
  'moringa-tea-benefits-how-to-brew-2026-guide':
    'Moringa Tea Benefits & Brew Guide (2026)',
  'what-does-moringa-do-for-your-body-complete-guide-2026':
    'What Moringa Does For Your Body (2026 Guide)',
  'what-to-eat-when-too-tired-melbourne-2026':
    'What to Eat When Too Tired (Melbourne)',
  'why-premium-moringa-costs-11-not-25-value-vs-markup-2026':
    'Why Premium Moringa Costs $11, Not $25 (2026)',
  'science-shade-drying-vs-sun-drying-moringa':
    'Shade- vs Sun-Dried Moringa: Quality Guide (2026)',
};

function writeFile(rel, content) {
  const fp = path.join(ROOT, rel);
  if (DRY) {
    console.log('[dry-run] would write', rel);
    return;
  }
  fs.writeFileSync(fp, content);
}

function patchBlogHtml(slug) {
  const rel = `blog/${slug}.html`;
  const fp = path.join(ROOT, rel);
  let html = fs.readFileSync(fp, 'utf8');
  const canonExt = `${BASE}/blog/${slug}.html`;
  const canonClean = `${BASE}/blog/${slug}`;

  // Canonical → extensionless
  html = html.replace(
    new RegExp(`<link rel="canonical" href="${canonExt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*/?>`, 'i'),
    `<link rel="canonical" href="${canonClean}"/>`
  );

  // hreflang: single-language — point all to canonical clean URL
  html = html.replace(
    /<link rel="alternate" hreflang="[^"]+" href="[^"]*"\s*\/?>/gi,
    (match) => {
      const lang = match.match(/hreflang="([^"]+)"/i)?.[1] || 'en-AU';
      return `<link rel="alternate" hreflang="${lang}" href="${canonClean}"/>`;
    }
  );

  // og:url if present
  html = html.replace(
    new RegExp(`(property="og:url" content=")${canonExt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'),
    `$1${canonClean}`
  );

  // Internal blog links .html → extensionless (same host paths only)
  html = html.replace(/href="(\/blog\/[^"?#]+)\.html"/g, 'href="$1"');

  // H1 override
  if (H1_OVERRIDES[slug]) {
    const h1 = H1_OVERRIDES[slug].replace(/&/g, '&amp;');
    html = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, (m) => {
      const cls = m.match(/class="([^"]*)"/)?.[1];
      const classAttr = cls ? ` class="${cls}"` : '';
      return `<h1${classAttr}>${h1}</h1>`;
    });
  }

  // Title shorten
  if (TITLE_SHORTEN[slug]) {
    const t = TITLE_SHORTEN[slug].replace(/&/g, '&amp;');
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${t}</title>`);
    html = html.replace(
      /property="og:title" content="[^"]*"/i,
      `property="og:title" content="${t}"`
    );
  }

  if (!DRY) fs.writeFileSync(fp, html);
  return rel;
}

function patchBlogArticlesJs() {
  const fp = path.join(ROOT, 'shared/js/blog-articles.js');
  let js = fs.readFileSync(fp, 'utf8');
  js = js.replace(/"href": "\/blog\/([^"]+)\.html"/g, '"href": "/blog/$1"');
  writeFile('shared/js/blog-articles.js', js);
}

function patchBuildSitemap() {
  const fp = path.join(ROOT, 'scripts/build-sitemap.js');
  let s = fs.readFileSync(fp, 'utf8');
  const old = `  if (relPosix.startsWith("blog/") && relPosix.endsWith(".html")) {
    return \`\${BASE}/\${relPosix}\`;
  }`;
  const neu = `  if (relPosix.startsWith("blog/") && relPosix.endsWith(".html")) {
    const slug = relPosix.slice("blog/".length, -".html".length);
    return \`\${BASE}/blog/\${slug}\`;
  }`;
  if (!s.includes(neu)) {
    s = s.replace(old, neu);
    writeFile('scripts/build-sitemap.js', s);
  }
}

function injectRedirectsBlock() {
  const fp = path.join(ROOT, '_redirects');
  let text = fs.readFileSync(fp, 'utf8');

  // Remove same-slug extensionless → .html 301 (keep merger redirects)
  const mergerKeep = [];
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) {
      mergerKeep.push(line);
      continue;
    }
    const parts = t.split(/\s+/);
    if (parts.length >= 3 && parts[2] === '301') {
      const from = parts[0];
      const to = parts[1];
      const fromSlug = from.replace(/^\/blog\//, '').replace(/\.html$/, '');
      const toSlug = to.replace(/^\/blog\//, '').replace(/\.html$/, '');
      // Drop duplicate-pair rules (same slug, different extension)
      if (from.startsWith('/blog/') && to.startsWith('/blog/') && fromSlug === toSlug) {
        continue;
      }
      // Retarget .html destinations to extensionless
      if (to.endsWith('.html') && to.startsWith('/blog/')) {
        parts[1] = to.replace(/\.html$/, '');
        mergerKeep.push(parts.join(' '));
        continue;
      }
    }
    mergerKeep.push(line);
  }
  text = mergerKeep.join('\n');

  const block = [
    '',
    '# PHASE 2 — Canonical extensionless blog URLs (auto-generated)',
    '# .html → clean URL (301); clean URL serves .html file (200)',
    ...slugs.flatMap((slug) => [
      `/blog/${slug}.html /blog/${slug} 301!`,
      `/blog/${slug} /blog/${slug}.html 200`,
    ]),
    '',
  ].join('\n');

  // Remove legacy "extensionless → .html" pretty-URL block
  text = text.replace(
    /# Pretty blog URLs \(extensionless\)[\s\S]*?# Pretty blog URL → canonical \.html \(live post; do not 404\)\n\/blog\/best-protein-powder-australia \/blog\/best-protein-powder-australia\.html 301\n\n/g,
    ''
  );

  if (!text.includes('PHASE 2 — Canonical extensionless')) {
    text = text.trimEnd() + block;
  }
  writeFile('_redirects', text);
}

function createLlmsTxt() {
  const content = `# NutriThrive — Moringa & superfoods (Melbourne, Australia)

> Premium shade-dried moringa leaf powder. Packed in Truganina, VIC. Food supplement — not medical advice.

## About
NutriThrive sells lab-tested moringa powder and related products online across Australia. Founded 2020; customer-facing launch 2024.

## Founder
Neer — Melbourne west (Truganina warehouse). Not a doctor or TGA-registered health professional.

## Products
- Moringa leaf powder: https://nutrithrive.com.au/products/moringa-powder/
- Curry leaves, black tea, moringa soap, combo packs: https://nutrithrive.com.au/products/

## Key pages
- Home: https://nutrithrive.com.au/
- About: https://nutrithrive.com.au/about
- Blog: https://nutrithrive.com.au/blog/
- Contact: https://nutrithrive.com.au/contact

## Topics
Moringa dosage, quality testing, Australian buying guides, women's nutrition (food framing), TGA-compliant supplement information.

## Contact
Email: nutrithrive0@gmail.com
Address: 15 Europe Street, Truganina VIC 3029, Australia
ABN: 32 639 442 616
`;
  writeFile('llms.txt', content);
}

function fixBrokenLinks() {
  const fixes = [
    {
      file: 'blog/moringa-powder-victoria-seniors-joint-health.html',
      from: 'vic-seniors-720.jpg',
      to: 'moringa-seniors-720.jpg',
    },
    {
      file: 'blog/how-to-choose-greens-powder-australia-2026.html',
      from: '/blog/budget-greens-powder-australia-under-20-2026.html',
      to: '/blog/best-greens-powder-australia-2026',
    },
    {
      file: 'blog/moringa-melbourne-complete-growers-report-2026.html',
      from: '/https://nutrithrive.com.au/blog/how-to-grow-moringa-in-australia-complete-guide-2026',
      to: '/blog/how-to-grow-moringa-in-australia-complete-guide-2026',
    },
    {
      file: 'blog/affordable-superfoods-organic-tax-marketplace-wellness-vic-nsw-qld-2026.html',
      from: '/blog/melbourne-food-as-medicine-map-cafes-organic-stores-healthspan-eating-2026.html',
      to: '/blog/moringa-melbourne-complete-guide-2026',
    },
    {
      file: 'pages/homepage/melbourne.html',
      from: '/blog/melbourne-food-as-medicine-map-cafes-organic-stores-healthspan-eating-2026.html',
      to: '/blog/moringa-melbourne-complete-guide-2026',
    },
    {
      file: 'products/index.html',
      from: 'href="/curry-leaves/"',
      to: 'href="/products/curry-leaves/"',
    },
    {
      file: 'products/index.html',
      from: 'href="/black-tea/"',
      to: 'href="/products/black-tea/"',
    },
    {
      file: 'products/index.html',
      from: 'href="/combo-pack/"',
      to: 'href="/products/combo-pack/"',
    },
    {
      file: 'products/index.html',
      from: 'href="/moringa-soap/"',
      to: 'href="/products/moringa-soap/"',
    },
  ];

  for (const f of fixes) {
    const fp = path.join(ROOT, f.file);
    if (!fs.existsSync(fp)) continue;
    let c = fs.readFileSync(fp, 'utf8');
    if (c.includes(f.from)) {
      c = c.split(f.from).join(f.to);
      writeFile(f.file, c);
    }
  }
}

// melbourne-food redirect in _redirects — change 404 to 301 to melbourne guide
function fixMelbourneFoodRedirect() {
  const fp = path.join(ROOT, '_redirects');
  let text = fs.readFileSync(fp, 'utf8');
  text = text.replace(
    /\/blog\/melbourne-food-as-medicine-map-cafes-organic-stores-healthspan-eating-2026\.html \/blog\/melbourne-food-as-medicine-map-cafes-organic-stores-healthspan-eating-2026 404/g,
    '/blog/melbourne-food-as-medicine-map-cafes-organic-stores-healthspan-eating-2026 /blog/moringa-melbourne-complete-guide-2026 301\n/blog/melbourne-food-as-medicine-map-cafes-organic-stores-healthspan-eating-2026.html /blog/moringa-melbourne-complete-guide-2026 301'
  );
  text = text.replace(
    /\/blog\/melbourne-food-as-medicine-map-cafes-organic-stores-healthspan-eating-2026 \/blog\/melbourne-food-as-medicine-map-cafes-organic-stores-healthspan-eating-2026 404/g,
    '/blog/melbourne-food-as-medicine-map-cafes-organic-stores-healthspan-eating-2026 /blog/moringa-melbourne-complete-guide-2026 301'
  );
  writeFile('_redirects', text);
}

console.log('Phase 2 SEO fix', DRY ? '(dry-run)' : '');
patchBuildSitemap();
injectRedirectsBlock();
fixMelbourneFoodRedirect();
createLlmsTxt();
fixBrokenLinks();
patchBlogArticlesJs();
for (const slug of slugs) patchBlogHtml(slug);
console.log('Patched', slugs.length, 'blog posts');
console.log('Run: node scripts/build-sitemap.js');
