#!/usr/bin/env node
/**
 * One-off generator: blog posts 9–20 from parent transcript content.
 * Run: node scripts/generate-blogs-9-20.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(REPO, 'blog');
const TRANSCRIPT = path.join(
  process.env.HOME,
  '.cursor/projects/Users-neervasa-Desktop-Website/agent-transcripts/49ff2f0b-bac9-4b0b-a408-426257982d85/49ff2f0b-bac9-4b0b-a408-426257982d85.jsonl',
);

const BASE = 'https://nutrithrive.com.au';
const DATE = '27 Jun 2026';
const DATE_ISO = '2026-06-27';

const POSTS = {
  9: { category: 'Health', readMin: 5, product: 'moringa' },
  10: { category: 'Health', readMin: 6, product: 'moringa' },
  11: { category: 'Health', readMin: 5, product: 'moringa' },
  12: { category: 'Health', readMin: 6, product: 'moringa' },
  13: { category: 'Health', readMin: 5, product: 'moringa' },
  14: { category: 'Guides', readMin: 6, product: 'curry' },
  15: { category: 'Recipes', readMin: 5, product: 'curry' },
  16: { category: 'Tea', readMin: 6, product: 'tea' },
  17: { category: 'Tea', readMin: 5, product: 'tea' },
  18: { category: 'Health', readMin: 6, product: 'moringa' },
  19: { category: 'Recipes', readMin: 7, product: 'curry' },
  20: { category: 'Health', readMin: 5, product: 'moringa' },
};

const RELATED = {
  moringa: [
    { href: '/blog/how-to-add-moringa-to-diet', label: 'How to add moringa to your diet' },
    { href: '/blog/moringa-side-effects-what-happens-take-too-much-2026', label: 'Moringa side effects' },
    { href: '/blog/how-to-make-moringa-tea-recipes-2026', label: 'How to make moringa tea' },
    { href: '/products/moringa-powder/', label: 'Shop moringa powder' },
  ],
  curry: [
    { href: '/blog/curry-leaves-health-benefits-what-the-evidence-says-2026', label: 'Curry leaves health benefits' },
    { href: '/blog/how-to-store-curry-leaves-fresh-dried-australia-2026', label: 'How to store curry leaves' },
    { href: '/blog/can-you-use-dried-curry-leaves-for-hair-2026', label: 'Curry leaves for hair' },
    { href: '/products/curry-leaves/', label: 'Shop dried curry leaves' },
  ],
  tea: [
    { href: '/blog/darjeeling-black-tea-australia-first-flush-second-flush-guide-2026', label: 'Darjeeling first flush guide' },
    { href: '/blog/how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026', label: 'Darjeeling caffeine guide' },
    { href: '/blog/darjeeling-tea-health-benefits-research-2026', label: 'Darjeeling health benefits' },
    { href: '/products/black-tea/', label: 'Shop Darjeeling tea' },
  ],
};

const PRODUCT = {
  moringa: {
    hero: '/assets/images/homepage/product-showcase/Moringa.webp',
    og: '/assets/images/og/moringa-article-1200.jpg',
    sidebarImg: '/assets/images/product_photos/moringa.webp',
    sidebarTitle: 'Moringa Powder (100g)',
    sidebarDesc: 'Shade-dried, lab-tested, packed in Melbourne.',
    sidebarPrice: '$11.00',
    sidebarUnit: '/100g',
    shopHref: '/products/moringa-powder/',
    shopLabel: 'Shop Moringa',
    ctaProduct: '100% pure moringa powder',
  },
  curry: {
    hero: '/assets/images/homepage/product-showcase/Curry.webp',
    og: '/assets/images/homepage/product-showcase/Curry.webp',
    sidebarImg: '/assets/images/homepage/product-showcase/Curry.webp',
    sidebarTitle: 'Dried Curry Leaves (20g)',
    sidebarDesc: 'Shade-dried · whole-leaf · foil pouch',
    sidebarPrice: '$5.50',
    sidebarUnit: '/20g',
    shopHref: '/products/curry-leaves/',
    shopLabel: 'Shop Curry Leaves',
    ctaProduct: 'shade-dried curry leaves',
  },
  tea: {
    hero: '/assets/images/homepage/product-showcase/hero640/BlackTea.webp',
    og: '/assets/images/og/black-tea-social-1200.jpg',
    sidebarImg: '/assets/images/product_photos/blacktea.jpeg',
    sidebarTitle: 'Darjeeling Black Tea',
    sidebarDesc: 'First flush · loose leaf · packed in Melbourne',
    sidebarPrice: '$7.50',
    sidebarUnit: '/100g',
    shopHref: '/products/black-tea/',
    shopLabel: 'Shop Darjeeling Tea',
    ctaProduct: 'loose-leaf Darjeeling tea',
  },
};

function loadTranscriptText() {
  const line = fs.readFileSync(TRANSCRIPT, 'utf8').split('\n')[0];
  return JSON.parse(line).message.content[0].text;
}

function extractBlog(n, text) {
  const startRe = new RegExp(`# BLOG ${n} of 20`);
  const nextRe = new RegExp(`# BLOG ${n + 1} of 20`);
  const start = text.search(startRe);
  if (start < 0) throw new Error(`Blog ${n} not found`);
  const next = n < 20 ? text.search(nextRe) : text.length;
  const chunk = text.slice(start, next > start ? next : text.length);

  const title = chunk.match(/title: (.+)/)?.[1];
  const meta = chunk.match(/meta-description: (.+)/)?.[1];
  const slugPath = chunk.match(/canonical-slug: (.+)/)?.[1];
  if (!title || !meta || !slugPath) throw new Error(`Missing meta for blog ${n}`);

  const navStart = chunk.indexOf('\n---\n\n<nav');
  let raw = chunk.slice(navStart + 5).trim();
  // Trim publishing schedule appendix accidentally included in blog 20
  const cutMarkers = ['\n---\n---\n---\n\n# NutriThrive', '\n# NutriThrive — 20 New Blog'];
  for (const m of cutMarkers) {
    const idx = raw.indexOf(m);
    if (idx > 0) raw = raw.slice(0, idx).trim();
  }

  const faqMatch = raw.match(/<script type="application\/ld\+json">\s*(\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?\})\s*<\/script>/);
  const breadcrumbMatch = raw.match(/<script type="application\/ld\+json">\s*(\{"@context":"https:\/\/schema\.org","@type":"BreadcrumbList"[\s\S]*?\})\s*<\/script>/);

  const mdStart = raw.search(/^# /m);
  const markdown = raw.slice(mdStart).trim();

  const slug = slugPath.replace(/^\/blog\//, '');
  return { title, meta, slug, faqJson: faqMatch?.[1], breadcrumbJson: breadcrumbMatch?.[1], markdown };
}

function escHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineMd(text) {
  let s = text;
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/nutrithrive\.com\.au)?([^)]+)\)/g, (_, label, _host, href) => {
    const path = href.startsWith('/') ? href : `/${href}`;
    return `<a href="${path}">${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  s = s.replace(/ — /g, ' &#8212; ');
  s = s.replace(/ – /g, ' &#8211; ');
  s = s.replace(/'/g, '&#8217;');
  return s;
}

function markdownToHtml(md) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;
  let inFaq = false;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith('# ')) {
      i += 1;
      continue;
    }
    if (/^\*[^*]+·\s*\d+\s*min read\*$/.test(trimmed)) {
      i += 1;
      continue;
    }
    if (trimmed === '---') {
      i += 1;
      while (i < lines.length && !lines[i].trim()) i += 1;
      if (lines[i]?.trim().startsWith('*Written by')) {
        const written = lines[i].trim().replace(/\*Written by Goose Vasavada/, '*Written by Neer Vasa');
        out.push(`<p style="margin-top:2rem; font-style:italic; color:#555;"><em>${inlineMd(written.replace(/^\*|\*$/g, ''))}</em></p>`);
        i += 1;
      }
      if (lines[i]?.trim().startsWith('[')) {
        out.push(`<p>${inlineMd(lines[i].trim())}</p>`);
        i += 1;
      }
      if (lines[i]?.trim().startsWith('These statements')) {
        out.push(`<p class="nt-disclaimer"><em>${escHtml(lines[i].trim())}</em></p>`);
        i += 1;
      }
      continue;
    }

    if (trimmed.startsWith('## ')) {
      const heading = trimmed.slice(3);
      if (heading.toLowerCase() === 'faq') inFaq = true;
      else inFaq = false;
      out.push(`<h2>${inlineMd(heading)}</h2>`);
      i += 1;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      out.push(`<h3>${inlineMd(trimmed.slice(4))}</h3>`);
      i += 1;
      continue;
    }

    if (inFaq && trimmed.startsWith('**') && trimmed.includes('**')) {
      const qEnd = trimmed.indexOf('**', 2);
      const question = trimmed.slice(2, qEnd);
      const answer = trimmed.slice(qEnd + 2).replace(/^\s*/, '');
      out.push(`<h3>${inlineMd(question)}</h3>`);
      out.push(`<p>${inlineMd(answer)}</p>`);
      i += 1;
      continue;
    }

    out.push(`<p>${inlineMd(trimmed)}</p>`);
    i += 1;
  }

  return out.join('\n\n');
}

function articleSchema(title, meta, slug) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: meta,
    author: { '@type': 'Person', '@id': `${BASE}/#person-neer`, name: 'Neer Vasa' },
    publisher: {
      '@type': 'Organization',
      name: 'NutriThrive',
      logo: { '@type': 'ImageObject', url: `${BASE}/assets/images/logo/LOGO.webp` },
    },
    datePublished: DATE_ISO,
    dateModified: DATE_ISO,
    image: `${BASE}/assets/images/og/moringa-article-1200.jpg`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/blog/${slug}` },
    wordCount: 2500,
  });
}

function shellBreadcrumbJson(title, slug) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE}/blog/` },
      { '@type': 'ListItem', position: 3, name: title, item: `${BASE}/blog/${slug}` },
    ],
  });
}

function buildHtml(blog, cfg) {
  const { title, meta, slug, faqJson, markdown } = blog;
  const prod = PRODUCT[cfg.product];
  const canonical = `${BASE}/blog/${slug}`;
  const bodyHtml = markdownToHtml(markdown);
  const relatedHtml = RELATED[cfg.product]
    .map((r) => `    <li><a href="${r.href}">${escHtml(r.label)}</a></li>`)
    .join('\n');

  const ctaHeading = cfg.product === 'moringa' ? 'Ready to Try Moringa?' : cfg.product === 'curry' ? 'Shop Dried Curry Leaves' : 'Shop Darjeeling Tea';
  const ctaBtn = cfg.product === 'moringa' ? 'Shop Moringa Powder' : cfg.product === 'curry' ? 'Shop Curry Leaves' : 'Shop Darjeeling Tea';

  const ogImage = prod.og.startsWith('http') ? prod.og : `${BASE}${prod.og}`;

  return `<!DOCTYPE html>
<html class="scroll-smooth" lang="en-AU">
<head>
<script src="/scripts/global/defer-loader.min.js" defer></script>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${escHtml(title)}</title>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  if (window.DeferLoader) {
    window.DeferLoader.deferUntilInteraction(function() {
      window.DeferLoader.loadScript('https://www.googletagmanager.com/gtag/js?id=G-WH21SW75WP', {
        async: true, crossorigin: 'anonymous'
      }).then(function() {
        gtag('js', new Date());
        gtag('config', 'G-WH21SW75WP', {'anonymize_ip': true, 'allow_google_signals': false});
      }).catch(function(err) { console.warn('[GA] Failed to load:', err); });
    }, { once: true, passive: true });
  } else {
    window.addEventListener('load', function() {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=G-WH21SW75WP';
      s.crossOrigin = 'anonymous';
      document.head.appendChild(s);
      gtag('js', new Date());
      gtag('config', 'G-WH21SW75WP', {'anonymize_ip': true, 'allow_google_signals': false});
    });
  }
</script>
<meta name="robots" content="noindex, follow"/>
<link rel="canonical" href="${canonical}"/>
<link rel="alternate" type="text/plain" href="${BASE}/llms.txt" title="LLMs.txt">
<link rel="alternate" hreflang="en-AU" href="${canonical}"/>
<link rel="alternate" hreflang="x-default" href="${canonical}"/>
<meta name="description" content="${escHtml(meta)}"/>
<meta name="author" content="Neer Vasa, NutriThrive"/>
<meta property="og:type" content="article"/>
<meta property="og:url" content="${canonical}"/>
<meta property="og:title" content="${escHtml(title)}"/>
<meta property="og:description" content="${escHtml(meta)}"/>
<meta property="og:image" content="${ogImage}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:site_name" content="NutriThrive Australia"/>
<meta property="og:locale" content="en_AU"/>
<meta property="article:published_time" content="${DATE_ISO}T00:00:00+10:00"/>
<meta property="article:modified_time" content="${DATE_ISO}T00:00:00+10:00"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:url" content="${canonical}"/>
<meta name="twitter:title" content="${escHtml(title)}"/>
<meta name="twitter:description" content="${escHtml(meta)}"/>
<meta name="twitter:image" content="${ogImage}"/>
<script type="application/ld+json">${articleSchema(title, meta, slug)}</script>
${faqJson ? `<script type="application/ld+json">${faqJson}</script>` : ''}
<script type="application/ld+json">${shellBreadcrumbJson(title, slug)}</script>
<link rel="icon" type="image/png" href="/assets/images/logo/LOGO.webp" sizes="32x32"/>
<link rel="apple-touch-icon" sizes="180x180" href="/assets/images/logo/LOGO.webp"/>
<meta name="theme-color" content="#0f6b4d"/>
<link rel="preconnect" href="https://www.googletagmanager.com"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link rel="dns-prefetch" href="https://www.redditstatic.com"/>
<link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400..700&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&amp;display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="/assets/css/design-system.min.css"/>
<link rel="stylesheet" href="/styles/global/style.min.css"/>
<link rel="stylesheet" href="/assets/css/tailwind-v2.min.css"/>
<link rel="stylesheet" href="/blog/blog-v2-prose.min.css"/>
<link rel="stylesheet" href="/shared/css/v2-extra.min.css"/>
<link rel="stylesheet" href="/shared/css/author-bio.min.css" media="print" onload="this.media='all'"/><noscript><link rel="stylesheet" href="/shared/css/author-bio.min.css"/></noscript>
</head>
<body class="bg-background text-on-background font-body-md overflow-x-hidden nt-blog-article">
<div class="nt-sticky-top">
<div class="nt-promo-bar">&#x23F0; Order before 2pm for same-day Melbourne dispatch &#x2022; &#x1F69A; Free shipping over $80</div>
<header id="nt-header" class="nt-v2-header"></header>
</div>
<nav class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-4 pb-2 text-label-sm" aria-label="Breadcrumb">
<ol class="flex flex-wrap items-center gap-1 list-none m-0 p-0"><li><a class="text-moringa-leaf hover:underline" href="/">Home</a></li><li class="text-on-surface-variant" aria-hidden="true">&#x203A;</li><li><a class="text-moringa-leaf hover:underline" href="/blog/">Blog</a></li><li class="text-on-surface-variant" aria-hidden="true">&#x203A;</li><li class="text-on-surface" aria-current="page">${escHtml(title)}</li></ol>
</nav>
<main class="pt-6 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop nt-blog-main">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
<article class="lg:col-span-8">
<header class="mb-12">
<div class="flex flex-wrap items-center gap-2 mb-4">
<span class="bg-primary-fixed/30 text-moringa-leaf px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider font-bold">${escHtml(cfg.category)}</span>
<span class="text-on-surface-variant text-label-lg font-body-md">${DATE}</span>
<span class="text-on-surface-variant text-label-lg font-body-md">&#183; ${cfg.readMin} min read</span>
</div>
<h1 class="font-display text-headline-lg md:text-display text-forest-deep mb-4 leading-tight">${escHtml(title)}</h1>
<p class="text-on-surface-variant text-body-md mb-8"><strong>By Neer Vasa, NutriThrive Truganina</strong> &#183; Last updated: ${DATE}</p>
<div class="w-full aspect-[16/9] rounded-xl overflow-hidden mb-12 shadow-sm bg-surface-container">
<img alt="${escHtml(title)}" class="w-full h-full object-cover" src="${prod.hero}" width="1200" height="630" loading="eager" decoding="async" fetchpriority="high"/>
</div>
</header>
<div class="blog-v2-prose max-w-none">

${bodyHtml}

<div class="nt-article-cta">
<h3>${ctaHeading}</h3>
<p>Shop our <a href="${prod.shopHref}">${prod.ctaProduct}</a> — packed fresh in Melbourne. Same-day dispatch.</p>
<div class="btn-row">
<a class="btn-solid" href="${prod.shopHref}">${ctaBtn}</a>
<a class="btn-outline" href="/pages/shipping/shipping-returns.html">Shipping &amp; returns</a>
</div>
</div>
<p style="margin-top: 1rem;"><a href="/blog/">&larr; Back to all articles</a></p>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul><li><strong>${DATE}:</strong> Article created (staged for weekly publishing).</li></ul>
</div>
<section class="nt-related-links-block">
  <h2>Related guides</h2>
  <ul>
${relatedHtml}
  </ul>
</section>
</div>
</article>
<aside class="lg:col-span-4 space-y-12">
<div class="bg-pure-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
<div class="aspect-square bg-surface-container relative">
<img alt="${escHtml(prod.sidebarTitle)}" class="w-full h-full object-cover" src="${prod.sidebarImg}" loading="lazy"/>
${cfg.product === 'moringa' ? '<div class="absolute top-4 right-4 bg-terracotta-clay text-pure-white px-3 py-1 rounded-lg text-label-sm font-label-sm">Best Seller</div>' : ''}
</div>
<div class="p-6">
<h4 class="font-headline-md text-headline-md text-forest-deep mb-2">${escHtml(prod.sidebarTitle)}</h4>
<p class="text-on-surface-variant font-body-md text-body-md mb-6">${escHtml(prod.sidebarDesc)}</p>
<div class="nt-blog-sidebar-price flex items-baseline gap-1 mb-6">
<span class="text-2xl font-bold text-moringa-leaf">${prod.sidebarPrice}</span>
<span class="text-sm text-on-surface-variant">${prod.sidebarUnit}</span>
</div>
<a class="block w-full text-center bg-terracotta-clay text-pure-white py-4 rounded-lg font-label-lg text-label-lg hover:scale-[1.02] transition-transform" href="${prod.shopHref}">${prod.shopLabel}</a>
</div>
</div>
</aside>
</div>
</main>
<div id="nt-footer"></div>
<script src="/scripts/global/reddit-pixel.min.js" defer></script>
<script src="/shared/site-data.min.js" defer></script>
<script src="/scripts/global/cart.min.js" defer></script>
<script src="/shared/js/cart-v2-ui.min.js" defer></script>
<script src="/shared/js/footer-v2.min.js" defer></script>
<script src="/shared/js/author-bio.min.js" defer></script>
<script src="/shared/js/layout-v2.min.js" defer></script>
<script src="/shared/js/v2-site.min.js" defer></script>
</body>
</html>
`;
}

function main() {
  const text = loadTranscriptText();
  const created = [];
  for (let n = 9; n <= 20; n++) {
    const blog = extractBlog(n, text);
    const cfg = POSTS[n];
    const html = buildHtml(blog, cfg);
    const outPath = path.join(BLOG_DIR, `${blog.slug}.html`);
    fs.writeFileSync(outPath, html);
    created.push(blog.slug);
    console.log(`Created ${blog.slug}.html`);
  }
  console.log(`\nDone: ${created.length} posts`);
}

main();
