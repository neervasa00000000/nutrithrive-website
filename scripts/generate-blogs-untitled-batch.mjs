#!/usr/bin/env node
/**
 * Generate blog posts 1–20 from untitled folder markdown drafts.
 * Run: node scripts/generate-blogs-untitled-batch.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(REPO, 'blog');
const DRAFT_DIR = path.join(REPO, 'untitled folder');
const DRAFT_FILES = [
  'new-batch-A-posts-1to5.md',
  'new-batch-B-posts-6to10.md',
  'new-batch-C-posts-11to15.md',
  'new-batch-D-posts-16to20.md',
];

const BASE = 'https://nutrithrive.com.au';
const DATE = '29 Jun 2026';
const DATE_ISO = '2026-06-29';
const AUTHOR_SCHEMA = 'Neer';
const AUTHOR_BYLINE = 'Neer, NutriThrive Truganina';

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
    ctaHeading: 'Ready to Try Moringa?',
    ctaBtn: 'Shop Moringa Powder',
    ctaProduct: '100% pure moringa powder',
    badge: true,
    related: [
      { href: '/blog/how-to-add-moringa-to-diet', label: 'How to add moringa to your diet' },
      { href: '/blog/how-to-make-moringa-tea-recipes-2026', label: 'How to make moringa tea' },
      { href: '/blog/moringa-side-effects-what-happens-take-too-much-2026', label: 'Moringa side effects' },
      { href: '/products/moringa-powder/', label: 'Shop moringa powder' },
    ],
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
    ctaHeading: 'Shop Dried Curry Leaves',
    ctaBtn: 'Shop Curry Leaves',
    ctaProduct: 'shade-dried curry leaves',
    badge: false,
    related: [
      { href: '/blog/curry-leaves-health-benefits-what-the-evidence-says-2026', label: 'Curry leaves health benefits' },
      { href: '/blog/how-to-store-curry-leaves-fresh-dried-australia-2026', label: 'How to store curry leaves' },
      { href: '/blog/can-you-use-dried-curry-leaves-for-hair-2026', label: 'Curry leaves for hair' },
      { href: '/products/curry-leaves/', label: 'Shop dried curry leaves' },
    ],
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
    ctaHeading: 'Shop Darjeeling Tea',
    ctaBtn: 'Shop Darjeeling Tea',
    ctaProduct: 'loose-leaf Darjeeling tea',
    badge: false,
    related: [
      { href: '/blog/darjeeling-black-tea-australia-first-flush-second-flush-guide-2026', label: 'Darjeeling first flush guide' },
      { href: '/blog/how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026', label: 'Darjeeling caffeine guide' },
      { href: '/blog/darjeeling-tea-health-benefits-research-2026', label: 'Darjeeling health benefits' },
      { href: '/products/black-tea/', label: 'Shop Darjeeling tea' },
    ],
  },
  soap: {
    hero: '/assets/images/homepage/product-showcase/hero640/moringa_soap.webp',
    og: '/assets/images/homepage/product-showcase/moringa_soap.webp',
    sidebarImg: '/assets/images/homepage/product-showcase/hero640/moringa_soap.webp',
    sidebarTitle: 'Moringa Soap (95g)',
    sidebarDesc: 'Handmade · cold-process · packed in Melbourne',
    sidebarPrice: '$7.00',
    sidebarUnit: '/95g',
    shopHref: '/products/moringa-soap/',
    shopLabel: 'Shop Moringa Soap',
    ctaHeading: 'Shop Moringa Soap',
    ctaBtn: 'Shop Moringa Soap',
    ctaProduct: 'handmade moringa soap',
    badge: false,
    related: [
      { href: '/blog/moringa-soap-benefits-for-skin-2026', label: 'Moringa soap benefits for skin' },
      { href: '/blog/moringa-for-skin-eating-benefits-glow-2026', label: 'Moringa for skin from eating it' },
      { href: '/products/moringa-soap/', label: 'Shop moringa soap' },
      { href: '/products/moringa-powder/', label: 'Shop moringa powder' },
    ],
  },
};

function productForSlug(slug) {
  if (slug.includes('curry-leaves') || slug.includes('curry-leaf')) return 'curry';
  if (slug.includes('darjeeling')) return 'tea';
  if (slug.includes('moringa-soap')) return 'soap';
  return 'moringa';
}

function categoryLabel(raw) {
  const m = raw.match(/\*([^·*]+)/);
  if (!m) return 'Wellness';
  const c = m[1].trim();
  if (c === 'Tea') return 'Tea Guide';
  return c;
}

function readMin(raw) {
  const m = raw.match(/(\d+)\s*min read/);
  return m ? Number(m[1]) : 5;
}

function loadAllDrafts() {
  return DRAFT_FILES.map((f) => fs.readFileSync(path.join(DRAFT_DIR, f), 'utf8')).join('\n');
}

function extractPost(n, text) {
  const startRe = new RegExp(`# POST ${n} of 20`);
  const nextRe = new RegExp(`# POST ${n + 1} of 20`);
  const start = text.search(startRe);
  if (start < 0) throw new Error(`Post ${n} not found`);
  const next = n < 20 ? text.search(nextRe) : text.length;
  const chunk = text.slice(start, next > start ? next : text.length);

  const title = chunk.match(/^title: (.+)$/m)?.[1];
  const meta = chunk.match(/^meta-description: (.+)$/m)?.[1];
  const slugPath = chunk.match(/^canonical-slug: (.+)$/m)?.[1];
  if (!title || !meta || !slugPath) throw new Error(`Missing meta for post ${n}`);

  const fmClose = chunk.match(/^# POST \d+ of 20\n---\n[\s\S]*?\n---\n\n/);
  if (!fmClose) throw new Error(`Front matter not found for post ${n}`);
  let raw = chunk.slice(fmClose[0].length).trim();

  const faqMatch = raw.match(
    /<script type="application\/ld\+json">\s*(\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?\})\s*<\/script>/,
  );
  const breadcrumbMatch = raw.match(
    /<script type="application\/ld\+json">\s*(\{"@context":"https:\/\/schema\.org","@type":"BreadcrumbList"[\s\S]*?\})\s*<\/script>/,
  );

  const mdStart = raw.search(/^# /m);
  const markdown = raw.slice(mdStart).trim();
  const slug = slugPath.replace(/^\/blog\//, '');

  return {
    n,
    title,
    meta,
    slug,
    faqJson: faqMatch?.[1],
    breadcrumbJson: breadcrumbMatch?.[1],
    markdown,
    category: categoryLabel(markdown),
    readMin: readMin(markdown),
    product: productForSlug(slug),
  };
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
    const p = href.startsWith('/') ? href : `/${href}`;
    return `<a href="${p}">${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  s = s.replace(/ — /g, ' &#8212; ');
  s = s.replace(/ – /g, ' &#8211; ');
  s = s.replace(/'/g, '&#8217;');
  return s;
}

function tableToHtml(lines) {
  const rows = lines.filter((l) => l.trim().startsWith('|'));
  if (rows.length < 2) return '';
  const parse = (row) =>
    row
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());
  const header = parse(rows[0]);
  const bodyRows = rows.slice(2).map(parse);
  let html = '<table class="nt-comparison-table" style="width:100%; border-collapse:collapse; margin:1.5rem 0; font-size:0.95rem;">';
  html += '<thead><tr>';
  for (const h of header) {
    html += `<th style="border:1px solid #e6efe9; padding:0.6rem 0.75rem; background:#f9fcfa; text-align:left;">${inlineMd(h)}</th>`;
  }
  html += '</tr></thead><tbody>';
  for (const row of bodyRows) {
    html += '<tr>';
    for (const cell of row) {
      html += `<td style="border:1px solid #e6efe9; padding:0.6rem 0.75rem;">${inlineMd(cell)}</td>`;
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  return html;
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

    if (trimmed.startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i += 1;
      }
      const tableHtml = tableToHtml(tableLines);
      if (tableHtml) out.push(tableHtml);
      continue;
    }

    if (trimmed === '---') {
      i += 1;
      while (i < lines.length && !lines[i].trim()) i += 1;
      if (lines[i]?.trim().startsWith('*Written by')) {
        const written = lines[i]
          .trim()
          .replace(/^\*|\*$/g, '')
          .replace(/Goose Vasavada/g, AUTHOR_SCHEMA)
          .replace(/Founder, NutriThrive Australia\.?/, 'NutriThrive Australia.');
        out.push(`<p style="margin-top:2rem; font-style:italic; color:#555;"><em>${inlineMd(written)}</em></p>`);
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
      inFaq = heading.toLowerCase() === 'faq';
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

function articleSchema(title, meta, slug, ogImage) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: meta,
    author: { '@type': 'Person', '@id': `${BASE}/#person-neer`, name: AUTHOR_SCHEMA },
    publisher: {
      '@type': 'Organization',
      name: 'NutriThrive',
      logo: { '@type': 'ImageObject', url: `${BASE}/assets/images/logo/LOGO.webp` },
    },
    datePublished: DATE_ISO,
    dateModified: DATE_ISO,
    image: ogImage,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/blog/${slug}` },
  });
}

function buildHtml(post) {
  const { title, meta, slug, faqJson, breadcrumbJson, markdown, category, readMin, product: prodKey } = post;
  const prod = PRODUCT[prodKey];
  const canonical = `${BASE}/blog/${slug}`;
  const bodyHtml = markdownToHtml(markdown);
  const ogImage = prod.og.startsWith('http') ? prod.og : `${BASE}${prod.og}`;
  const relatedHtml = prod.related
    .map((r) => `    <li><a href="${r.href}">${escHtml(r.label)}</a></li>`)
    .join('\n');

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
<meta name="robots" content="index, follow"/>
<link rel="canonical" href="${canonical}"/>
<link rel="alternate" type="text/plain" href="${BASE}/llms.txt" title="LLMs.txt">
<link rel="alternate" hreflang="en-AU" href="${canonical}"/>
<link rel="alternate" hreflang="x-default" href="${canonical}"/>
<meta name="description" content="${escHtml(meta)}"/>
<meta name="author" content="NutriThrive Australia"/>
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
<script type="application/ld+json">${articleSchema(title, meta, slug, ogImage)}</script>
${breadcrumbJson ? `<script type="application/ld+json">${breadcrumbJson}</script>\n` : ''}${faqJson ? `<script type="application/ld+json">${faqJson}</script>` : ''}
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
<span class="bg-primary-fixed/30 text-moringa-leaf px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider font-bold">${escHtml(category)}</span>
<span class="text-on-surface-variant text-label-lg font-body-md">${DATE}</span>
<span class="text-on-surface-variant text-label-lg font-body-md">&#183; ${readMin} min read</span>
</div>
<h1 class="font-display text-headline-lg md:text-display text-forest-deep mb-4 leading-tight">${escHtml(title)}</h1>
<p class="text-on-surface-variant text-body-md mb-8"><strong>By ${AUTHOR_BYLINE}</strong> &#183; Last updated: ${DATE}</p>
<div class="w-full aspect-[16/9] rounded-xl overflow-hidden mb-12 shadow-sm bg-surface-container">
<img alt="${escHtml(title)}" class="w-full h-full object-cover" src="${prod.hero}" width="1200" height="630" loading="eager" decoding="async" fetchpriority="high"/>
</div>
</header>
<div class="blog-v2-prose max-w-none">

${bodyHtml}

<div class="nt-article-cta">
<h3>${prod.ctaHeading}</h3>
<p>Shop our <a href="${prod.shopHref}">${prod.ctaProduct}</a> — packed fresh in Melbourne. Same-day dispatch.</p>
<div class="btn-row">
<a class="btn-solid" href="${prod.shopHref}">${prod.ctaBtn}</a>
<a class="btn-outline" href="/pages/shipping/shipping-returns.html">Shipping &amp; returns</a>
</div>
</div>
<p style="margin-top: 1rem;"><a href="/blog/">&larr; Back to all articles</a></p>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul><li><strong>${DATE}:</strong> Article published.</li></ul>
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
${prod.badge ? '<div class="absolute top-4 right-4 bg-terracotta-clay text-pure-white px-3 py-1 rounded-lg text-label-sm font-label-sm">Best Seller</div>' : ''}
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

function generateBlogArticlesJs() {
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.html') && f !== 'index.html' && !f.includes('.partial.'))
    .sort();

  const articles = files
    .filter((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
      return !/meta\s+name="robots"\s+content="noindex/i.test(raw);
    })
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
      const slug = file.replace(/\.html$/, '');
      let title = slug.replace(/-/g, ' ');
      const titleTag = raw.match(/<title>([^<]*)<\/title>/i);
      if (titleTag) title = titleTag[1].replace(/\s*\|.*$/i, '').trim();
      const h1 =
        raw.match(/<article[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i) || raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (h1) title = h1[1].replace(/<[^>]+>/g, '').trim();
      let description = '';
      const desc = raw.match(/meta\s+name="description"\s+content="([^"]*)"/i);
      if (desc) description = desc[1];
      let category = 'Wellness';
      const cat = raw.match(/rounded-full[^>]*font-label-sm[^>]*uppercase[^>]*>([^<]+)</i);
      if (cat) category = cat[1].trim();
      return { slug, title, description, category, href: `/blog/${slug}` };
    });

  const js = `/** Auto-generated — ${articles.length} blog articles. Run: node scripts/build-live-v2.mjs */\nwindow.NT_BLOG_ARTICLES = ${JSON.stringify(articles, null, 2)};\n`;
  fs.writeFileSync(path.join(REPO, 'shared/js/blog-articles.js'), js);
  console.log(`Wrote shared/js/blog-articles.js (${articles.length} articles)`);
}

function appendRedirects(posts) {
  const redirectsPath = path.join(REPO, '_redirects');
  let content = fs.readFileSync(redirectsPath, 'utf8');
  const blocks = posts.map((p) => {
    const short = p.title.replace(/ \(2026\)$/, '').slice(0, 60);
    return `\n# ${short} (new June 2026)\n/blog/${p.slug}.html /blog/${p.slug} 301!\n/blog/${p.slug} /blog/${p.slug}.html 200`;
  });
  const marker = '\n# === untitled batch posts ===';
  if (!content.includes(marker)) {
    content += marker;
  }
  const beforeMarker = content.split(marker)[0];
  const newContent = beforeMarker + marker + blocks.join('') + '\n';
  fs.writeFileSync(redirectsPath, newContent);
  console.log(`Updated _redirects (+${posts.length} entries)`);
}

function appendLlmsTxt(posts) {
  const llmsPath = path.join(REPO, 'llms.txt');
  let content = fs.readFileSync(llmsPath, 'utf8');
  const marker = '\n## Untitled batch (June 2026)\n';
  if (content.includes(marker)) {
    content = content.split(marker)[0].trimEnd() + '\n';
  }
  const lines = posts.map(
    (p) => `- [${p.title.replace(/ \(2026\)$/, '')}](${BASE}/blog/${p.slug}): ${p.meta}`,
  );
  const insertBefore = '\n## Optional\n';
  const idx = content.indexOf(insertBefore);
  if (idx < 0) throw new Error('llms.txt ## Optional section not found');
  content = content.slice(0, idx) + marker + lines.join('\n') + '\n' + content.slice(idx);
  fs.writeFileSync(llmsPath, content);
  console.log(`Updated llms.txt (+${posts.length} entries)`);
}

function main() {
  const text = loadAllDrafts();
  const posts = [];
  for (let n = 1; n <= 20; n++) {
    const post = extractPost(n, text);
    const html = buildHtml(post);
    const outPath = path.join(BLOG_DIR, `${post.slug}.html`);
    if (fs.existsSync(outPath)) {
      console.warn(`SKIP (exists): ${post.slug}.html`);
      continue;
    }
    fs.writeFileSync(outPath, html);
    posts.push(post);
    console.log(`Created ${post.slug}.html`);
  }
  if (posts.length === 0) {
    console.log('No new posts created.');
    return;
  }
  generateBlogArticlesJs();
  appendRedirects(posts);
  appendLlmsTxt(posts);
  console.log(`\nDone: ${posts.length} new posts`);
  console.log('Next: node scripts/build-sitemap.cjs && npm run build:minify && node scripts/regenerate-blog-itemlist.mjs');
}

main();
