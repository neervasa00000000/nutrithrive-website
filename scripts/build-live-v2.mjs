#!/usr/bin/env node
/**
 * Applies v2 UI shells from scripts/templates/v2/*-test.html to the live site.
 * Preserves SEO meta, canonical, JSON-LD, and analytics from each existing live page.
 *
 * Templates are build-time only — production must not reference scripts/templates/ at runtime.
 * See scripts/templates/v2/README.md
 *
 * Run: node scripts/build-live-v2.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { transformLiveLinks } from './lib/live-link-transform.mjs';
import {
  buildPerfHeadBlock,
  dedupeTailwindConfig,
  stripPerfDuplicatesFromPreserved,
} from './lib/v2-head-perf.mjs';
import { patchShopGridBody } from './lib/shop-static-html.mjs';
import { optimizeProductsPageHtml } from './lib/shop-page-perf.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const TEST_PAGES = path.join(REPO, 'scripts/templates/v2/pages');
const TEST_BLOG = path.join(REPO, 'scripts/templates/v2/blog');

const PAGE_MAP = [
  { test: 'home-test.html', live: 'index.html', blogArticles: false, cart: false },
  { test: 'shop-test.html', live: 'products/index.html', blogArticles: false, cart: false },
  { test: 'about-test.html', live: 'pages/about/about.html', blogArticles: false, cart: false },
  { test: 'contact-test.html', live: 'pages/contact/contact.html', blogArticles: false, cart: false },
  { test: 'faq-test.html', live: 'pages/faq/faq.html', blogArticles: false, cart: false },
  { test: 'shipping-test.html', live: 'pages/shipping/shipping-returns.html', blogArticles: false, cart: false },
  { test: 'cart-test.html', live: 'pages/shop/cart.html', blogArticles: false, cart: true },
  { test: 'privacy-test.html', live: 'pages/legal/privacy-policy.html', blogArticles: false, cart: false },
  { test: 'blog-test.html', live: 'blog/index.html', blogArticles: true, cart: false },
  { test: 'order-thank-you-test.html', live: 'pages/shop/thank-you.html', blogArticles: false, cart: false, footScripts: 'orderThankYou' },
  { test: 'contact-thank-you-test.html', live: 'pages/contact/thank-you.html', blogArticles: false, cart: false },
  { test: 'newsletter-test.html', live: 'pages/newsletter/index.html', blogArticles: false, cart: false, newsletterLive: true },
  { test: 'newsletter-thank-you-test.html', live: 'pages/newsletter/thank-you.html', blogArticles: false, cart: false },
  // Melbourne pages use the legacy design-system layout (pages/homepage/melbourne.html) — not v2 shell.
];

const REDIRECT_STUB_PAGES = [
  { live: 'pages/contact/index.html', target: '/contact', label: 'contact page' },
  { live: 'pages/homepage/index.html', target: '/', label: 'homepage' },
  { live: 'pages/products/index.html', target: '/products/', label: 'shop' },
  { live: 'pages/benefits/moringa-benefits.html', target: '/blog/how-to-add-moringa-to-diet.html', label: 'moringa benefits guide' },
];

const PRODUCT_SLUGS = [
  'moringa-powder',
  'curry-leaves',
  'black-tea',
  'combo-pack',
  'moringa-soap',
];

function read(file) {
  return fs.readFileSync(path.join(REPO, file), 'utf8');
}

function write(file, html) {
  const full = path.join(REPO, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
}

function extractTailwindBlock(testHtml) {
  const style = testHtml.match(/<style>[\s\S]*?<\/style>/i)?.[0] || '';
  const config = testHtml.match(/<script id="tailwind-config">[\s\S]*?<\/script>/i)?.[0] || '';
  return [style, config].filter(Boolean).join('\n');
}

function extractPreservedHead(liveHtml) {
  const m = liveHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!m) return '';
  let head = m[1];
  head = head.replace(/<link[^>]*\/styles\/[^>]*>/gi, '');
  head = head.replace(/<link[^>]*design-system[^>]*>/gi, '');
  head = head.replace(/<noscript>[\s\S]*?\/styles\/[\s\S]*?<\/noscript>/gi, '');
  head = head.replace(/<meta charset="[^"]*"\s*\/?>/gi, '');
  head = head.replace(/<meta name="viewport"[^>]*>/gi, '');
  head = head.replace(/<title>[\s\S]*?<\/title>/gi, '');
  head = head.replace(/<script src="https:\/\/cdn\.tailwindcss\.com[^>]*><\/script>/gi, '');
  head = head.replace(/<link[^>]*Literata[^>]*>/gi, '');
  head = head.replace(/<link[^>]*Material\+Symbols[^>]*>/gi, '');
  head = head.replace(/<link[^>]*v2-extra\.css[^>]*>/gi, '');
  head = head.replace(/<style>[\s\S]*?<\/style>/gi, '');
  head = head.replace(/<script[^>]*defer-loader\.js[^>]*><\/script>/gi, '');
  head = head.replace(/<script[^>]*reddit-pixel\.js[^>]*><\/script>/gi, '');
  head = head.replace(/<!-- Reddit Pixel[\s\S]*?<\/script>\s*/gi, '');
  head = head.replace(/<script id="tailwind-config">[\s\S]*?<\/script>\s*/gi, '');
  return stripPerfDuplicatesFromPreserved(head);
}

function extractLiveTitle(liveHtml) {
  return liveHtml.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() || 'NutriThrive';
}

function extractV2Body(testHtml) {
  let html = testHtml;
  html = html.replace(/<div class="nt-test-banner">[\s\S]*?<\/div>\s*/i, '');
  html = html.replace(/has-test-banner/g, '');
  html = html.replace(/<meta name="robots" content="noindex, nofollow"\s*\/?>/gi, '');

  const m = html.match(
    /(<div class="nt-sticky-top">[\s\S]*?<header id="nt-header"[^>]*><\/header>\s*<\/div>)([\s\S]*?)(<div id="nt-footer"><\/div>)/i
  );
  if (!m) {
    const m2 = html.match(
      /(<div class="nt-sticky-top">[\s\S]*?<\/header>\s*<\/div>)([\s\S]*?)(<div id="nt-footer"><\/div>)/i
    );
    if (!m2) throw new Error('Could not extract v2 body from test HTML');
    return m2[1] + m2[2] + '<div id="nt-footer"></div>';
  }
  return m[1] + m[2] + '<div id="nt-footer"></div>';
}

function transformToLive(html, { isBlogArticle = false } = {}) {
  let out = html;
  out = out.replace(/<\/?motion>/gi, (t) => (t.startsWith('</') ? '</div>' : '<div'));

  const replacements = [
    [/href="home-test\.html"/g, 'href="/"'],
    [/href="shop-test\.html"/g, 'href="/products/"'],
    [/href="about-test\.html"/g, 'href="/about"'],
    [/href="contact-test\.html"/g, 'href="/contact"'],
    [/href="faq-test\.html"/g, 'href="/faq"'],
    [/href="shipping-test\.html"/g, 'href="/pages/shipping/shipping-returns.html"'],
    [/href="cart-test\.html"/g, 'href="/cart"'],
    [/href="payment-test\.html"/g, 'href="/payment"'],
    [/href="privacy-test\.html"/g, 'href="/privacy-policy"'],
    [/href="blog-test\.html"/g, 'href="/blog/"'],
    [/href="newsletter-test\.html"/g, 'href="/pages/newsletter/"'],
    [/href="newsletter-thank-you-test\.html"/g, 'href="/pages/newsletter/thank-you.html"'],
    [/href="contact-thank-you-test\.html"/g, 'href="/pages/contact/thank-you.html"'],
    [/href="order-thank-you-test\.html"/g, 'href="/thank-you.html"'],
    [/href="melbourne-test\.html"/g, 'href="/melbourne"'],
    [/href="payment-test\.html"/g, 'href="/payment"'],
    [/href="\.\.\/pages\/blog-test\.html"/g, 'href="/blog/"'],
    [/href="product-test\.html\?id=([^"]+)"/g, (_, id) => {
      const slug =
        Object.entries({
          'moringa-powder': 'moringa-powder-100g',
          'curry-leaves': 'curry-leaves-30g',
          'black-tea': 'black-tea',
          'combo-pack': 'combo-pack',
          'moringa-soap': 'moringa-soap',
        }).find(([, v]) => v === id)?.[0] ||
        (id.startsWith('moringa') ? 'moringa-powder' : id);
      return `href="/products/${slug}/"`;
    }],
    [/href="([^"]+)-test\.html"/g, (full, slug) => {
      if (slug.includes('/')) return full;
      return `href="/blog/${slug}.html"`;
    }],
    [/src="\.\.\/\.\.\/assets\//g, 'src="/assets/'],
    [/href="\.\.\/\.\.\/assets\//g, 'href="/assets/'],
    [/src="\.\.\/assets\//g, 'src="/assets/'],
    [/href="\.\.\/assets\//g, 'href="/assets/'],
    [/src="\.\.\/\.\.\/documents\//g, 'src="/documents/'],
    [/href="\.\.\/\.\.\/documents\//g, 'href="/documents/'],
    [/href="\.\.\/\.\.\/pages\//g, 'href="/pages/'],
    [/href="\.\.\/pages\//g, 'href="/pages/'],
    [/href="\.\.\/blog\//g, 'href="/blog/'],
    [/href="\/pages\/shop\/cart\.html"/g, 'href="/cart"'],
    [/href="\/pages\/about\/about\.html"/g, 'href="/about"'],
    [/href="\/pages\/contact\/contact\.html"/g, 'href="/contact"'],
    [/href="\/pages\/faq\/faq\.html"/g, 'href="/faq"'],
  ];

  for (const [re, rep] of replacements) out = out.replace(re, rep);

  if (isBlogArticle) {
    out = out.replace(/href="\/blog\/index\.html"/g, 'href="/blog/"');
    out = out.replace(
      /<nav class="max-w-container-max[^>]*>[\s\S]*?← Journal[\s\S]*?<\/nav>/i,
      '<nav class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-4 pb-2 text-label-sm"><a class="text-moringa-leaf hover:underline" href="/blog/">← Journal</a></nav>'
    );
  }

  return transformLiveLinks(out);
}

function liveScripts({ cart = false, blogArticles = false, payment = false }) {
  const lines = [
    '<script src="/scripts/global/defer-loader.js" defer></script>',
    '<script src="/scripts/global/reddit-pixel.js" defer></script>',
    '<script src="/shared/site-data.js"></script>',
  ];
  if (blogArticles) lines.push('<script src="/shared/js/blog-articles.js"></script>');
  if (payment) {
    lines.push(
      '<script src="/scripts/global/paypal-client-config.js"></script>',
      '<script src="/scripts/global/paypal-sdk-loader.js"></script>',
      '<script src="https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js"></script>'
    );
  }
  if (cart || payment) lines.push('<script src="/scripts/global/shipping-rates.js"></script>');
  lines.push(
    '<script src="/scripts/global/cart.js"></script>',
    '<script src="/shared/js/cart-v2-ui.js"></script>',
    '<script src="/shared/js/layout-v2.js"></script>',
    '<script src="/shared/js/v2-site.js"></script>'
  );
  return lines.join('\n');
}

const FOOT_SCRIPTS = {
  orderThankYou: `<script>
(function() {
  var params = new URLSearchParams(window.location.search);
  var orderId = params.get('orderId');
  var el = document.getElementById('order-id');
  var line = document.getElementById('order-id-line');
  if (orderId && el) {
    el.textContent = orderId;
  } else if (line) {
    line.style.display = 'none';
  }
  if (typeof window.rdt === 'function') {
    var conversionId = orderId && String(orderId).length
      ? 'purchase_' + String(orderId).replace(/[^a-zA-Z0-9_-]/g, '')
      : 'purchase_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 11);
    window.rdt('track', 'Purchase', { conversionId: conversionId });
  }
})();
</script>`,
};

function newsletterLiveFormHtml() {
  return `<form class="max-w-md mx-auto bg-pure-white p-8 rounded-2xl border border-outline-variant/10 shadow-sm space-y-4" action="https://formsubmit.co/nutrithrive0@gmail.com" method="POST">
    <input type="hidden" name="_subject" value="Newsletter Subscription - NutriThrive">
    <input type="hidden" name="_next" value="https://nutrithrive.com.au/pages/newsletter/thank-you.html">
    <input type="hidden" name="_template" value="table">
    <input type="hidden" name="_captcha" value="false">
    <label class="block text-left"><span class="font-label-lg text-on-surface-variant block mb-2">Your name</span>
      <input type="text" name="name" class="w-full rounded-lg border border-outline-variant/40 px-4 py-3" placeholder="Your name"/></label>
    <label class="block text-left"><span class="font-label-lg text-on-surface-variant block mb-2">Email</span>
      <input required type="email" name="email" class="w-full rounded-lg border border-outline-variant/40 px-4 py-3" placeholder="you@example.com"/></label>
    <button type="submit" class="w-full bg-moringa-leaf text-pure-white py-4 rounded-full font-label-lg hover:brightness-110">Subscribe</button>
    <p class="text-label-sm text-on-surface-variant text-center">We respect your privacy. Unsubscribe at any time. See our <a class="text-moringa-leaf underline" href="/privacy-policy">Privacy Policy</a>.</p>
  </form>`;
}

function patchNewsletterBody(body) {
  return body.replace(
    /<form id="nt-newsletter-form"[\s\S]*?<\/form>/i,
    newsletterLiveFormHtml()
  );
}

function patchOrderThankYouBody(body) {
  const extra = `
    <p class="font-body-md text-on-surface-variant mb-2" id="order-id-line">Order reference: <strong id="order-id" class="text-forest-deep"></strong></p>`;
  if (body.includes('id="order-id"')) return body;
  return body.replace(
    /(<p class="font-body-lg text-on-surface-variant">[^<]*<\/p>)/,
    `$1${extra}`
  );
}

function buildLivePage({ preservedHead, title, body, tailwind, opts, footScripts = '', isShop = false }) {
  const blogCss = opts.isBlogArticle
    ? '<link rel="stylesheet" href="/blog/blog-v2-prose.css"/>'
    : '';
  const bodyClass = opts.isBlogArticle
    ? 'bg-background text-on-background font-body-md overflow-x-hidden nt-blog-article'
    : 'bg-background text-on-background font-body-md overflow-x-hidden';

  return `<!DOCTYPE html>
<html class="scroll-smooth" lang="en-AU">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${title}</title>
${buildPerfHeadBlock({ shop: isShop })}
${preservedHead}
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Literata:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="/shared/css/v2-extra.css"/>
${blogCss}
<link rel="icon" href="/assets/images/logo/LOGO.webp"/>
${tailwind}
</head>
<body class="${bodyClass}">
${body}
${liveScripts(opts)}
${footScripts}
</body>
</html>`;
}

function v2ShellPrefix() {
  return `<div class="nt-sticky-top">
<div class="nt-promo-bar">⏰ Order before 2pm for same-day Melbourne dispatch • 🚚 Free shipping over $80 • 📦 Small batches—fresh stock guaranteed</div>
<header id="nt-header" class="nt-v2-header"></header>
</div>`;
}

function extractPaymentFromLive(liveHtml) {
  const mainIdx = liveHtml.indexOf('nt-payment-live');
  const searchFrom = mainIdx >= 0 ? mainIdx : 0;
  const styleMatch = liveHtml.slice(searchFrom).match(/<style>[\s\S]*?<\/style>/i);
  const start = liveHtml.indexOf('<div class="checkout-wrap">', searchFrom);
  const end = liveHtml.indexOf('<footer>', start);
  const checkout =
    start >= 0 && end > start ? liveHtml.slice(start, end).trim() : '';
  const scriptStart = liveHtml.indexOf('<script src="/scripts/global/paypal-client-config.js">');
  const scriptEnd = liveHtml.lastIndexOf('</script>', liveHtml.indexOf('</body>'));
  const checkoutScripts =
    scriptStart >= 0 && scriptEnd > scriptStart
      ? liveHtml.slice(scriptStart, scriptEnd + '</script>'.length).trim()
      : '';
  return { style: styleMatch?.[0] || '', checkout, checkoutScripts };
}

function sanitizePaymentStyles(styleHtml) {
  if (!styleHtml) return '';
  return styleHtml
    .replace(/body\s*\{[\s\S]*?\}/i, '')
    .replace(/\.checkout-wrap\s+\.checkout-wrap\s+header/g, '.checkout-wrap header')
    .replace(/(^|[\n{])\s*header\s*\{/g, '$1.checkout-wrap header {');
}

function paymentLiveBody(liveHtml) {
  const { style, checkout } = extractPaymentFromLive(liveHtml);
  return `${v2ShellPrefix()}
<main class="pt-32 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop nt-payment-live">
${sanitizePaymentStyles(style)}
${checkout}
</main>
<div id="nt-footer"></div>`;
}

function redirectStubBody(target, label) {
  const safeTarget = target.replace(/"/g, '&quot;');
  const safeLabel = label.replace(/</g, '&lt;');
  return `${v2ShellPrefix()}
<main class="pt-32 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
  <p class="font-body-lg text-on-surface-variant mb-6">Redirecting to the ${safeLabel}…</p>
  <a href="${safeTarget}" class="inline-block bg-moringa-leaf text-pure-white px-8 py-3 rounded-full font-label-lg">Continue</a>
</main>
<div id="nt-footer"></div>`;
}

function productPdpBody() {
  return `<div class="nt-sticky-top">
<div class="nt-promo-bar">⏰ Order before 2pm for same-day Melbourne dispatch • 🚚 Free shipping over $80 • 📦 Small batches—fresh stock guaranteed</div>
<header id="nt-header" class="nt-v2-header"></header>
</div>
<main id="nt-pdp-app" class="pt-32 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop"></main>
<div id="nt-footer"></div>`;
}

function generateBlogArticlesJs() {
  const blogDir = path.join(REPO, 'blog');
  const files = fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith('.html') && f !== 'index.html')
    .sort();

  const articles = files.map((file) => {
    const raw = read(path.join('blog', file));
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
    return { slug, title, description, category, href: `/blog/${file}` };
  });

  const js = `/** Auto-generated — ${articles.length} blog articles. Run: node scripts/build-live-v2.mjs */\nwindow.NT_BLOG_ARTICLES = ${JSON.stringify(articles, null, 2)};\n`;
  write('shared/js/blog-articles.js', js);
  console.log(`Wrote shared/js/blog-articles.js (${articles.length} articles)`);
}

function patchSiteData() {
  const file = path.join(REPO, 'shared/site-data.js');
  let js = fs.readFileSync(file, 'utf8');
  js = js.replace(/\.\.\/\.\.\/assets\//g, '/assets/');
  js = js.replace(/\.\.\/\.\.\/documents\//g, '/documents/');
  js = js.replace(/href: 'product\/products\/moringa-powder\/\?id=([^']+)'/g, (_, id) => {
    const slugMap = {
      'moringa-powder-100g': 'moringa-powder',
      'moringa-powder-200g': 'moringa-powder',
      'moringa-400g': 'moringa-powder',
      'curry-leaves-30g': 'curry-leaves',
      'black-tea': 'black-tea',
      'combo-pack': 'combo-pack',
      'moringa-soap': 'moringa-soap',
      'moringa-soap-combo': 'moringa-soap',
    };
    const slug = slugMap[id] || 'moringa-powder';
    return `href: '/products/${slug}/'`;
  });
  js = js.replace(/products-test\.html/g, '/products/');
  js = js.replace(/file: 'benefits-test\.html'/g, "file: '/blog/how-to-add-moringa-to-diet.html'");
  js = js.replace(/liveUrl: '\.\.\/\.\.\/pages\/legal\/privacy-policy\.html'/, "liveUrl: '/privacy-policy'");
  js = js.replace(/testCartUrl:[^\n]*\n/g, '');
  fs.writeFileSync(file, js);
  console.log('Patched shared/site-data.js paths');
}

function applyPage(entry) {
  const testFile = path.join(TEST_PAGES, entry.test);
  const liveFile = entry.live;
  if (!fs.existsSync(testFile)) {
    console.warn('Skip (missing test):', entry.test);
    return;
  }
  if (!fs.existsSync(path.join(REPO, liveFile))) {
    console.warn('Skip (missing live):', liveFile);
    return;
  }

  const testHtml = fs.readFileSync(testFile, 'utf8');
  const liveHtml = read(liveFile);
  const tailwind = extractTailwindBlock(testHtml);
  const preserved = extractPreservedHead(liveHtml);
  const title = extractLiveTitle(liveHtml);
  let body = transformToLive(extractV2Body(testHtml));
  if (liveFile === 'products/index.html') body = patchShopGridBody(body);
  if (entry.newsletterLive) body = patchNewsletterBody(body);
  if (entry.footScripts === 'orderThankYou') body = patchOrderThankYouBody(body);
  const footScripts = entry.footScripts ? FOOT_SCRIPTS[entry.footScripts] || '' : '';
  let html = buildLivePage({
    preservedHead: preserved,
    title,
    body,
    tailwind,
    footScripts,
    isShop: liveFile === 'products/index.html',
    opts: { cart: entry.cart, blogArticles: entry.blogArticles, isBlogArticle: false },
  });
  html = dedupeTailwindConfig(html);
  if (liveFile === 'products/index.html') html = optimizeProductsPageHtml(html);
  write(liveFile, html);
  console.log('Live ← test:', liveFile);
}

function applyPaymentPage() {
  const liveFile = 'pages/shop/payment.html';
  const testFile = path.join(TEST_PAGES, 'payment-test.html');
  if (!fs.existsSync(path.join(REPO, liveFile)) || !fs.existsSync(testFile)) {
    console.warn('Skip payment (missing files)');
    return;
  }
  const liveHtml = read(liveFile);
  const testHtml = fs.readFileSync(testFile, 'utf8');
  const { checkoutScripts } = extractPaymentFromLive(liveHtml);
  if (!checkoutScripts) {
    console.warn('Skip payment — could not extract PayPal checkout scripts from live page');
    return;
  }
  const tailwind = extractTailwindBlock(testHtml);
  const preserved = extractPreservedHead(liveHtml);
  const title = extractLiveTitle(liveHtml);
  const body = transformToLive(paymentLiveBody(liveHtml));
  const html = buildLivePage({
    preservedHead: preserved,
    title,
    body,
    tailwind,
    footScripts: checkoutScripts,
    opts: { cart: false, blogArticles: false, isBlogArticle: false, payment: true },
  });
  write(liveFile, html);
  console.log('Live payment (PayPal preserved):', liveFile);
}

function applyRedirectStub({ live, target, label }) {
  if (!fs.existsSync(path.join(REPO, live))) {
    console.warn('Skip redirect stub (missing):', live);
    return;
  }
  const homeTest = path.join(TEST_PAGES, 'home-test.html');
  if (!fs.existsSync(homeTest)) {
    console.warn('Skip redirect stub (no home-test.html):', live);
    return;
  }
  const liveHtml = read(live);
  const testHtml = fs.readFileSync(homeTest, 'utf8');
  const tailwind = extractTailwindBlock(testHtml);
  const preserved = extractPreservedHead(liveHtml);
  const title = extractLiveTitle(liveHtml);
  const body = transformToLive(redirectStubBody(target, label));
  const html = buildLivePage({
    preservedHead: preserved,
    title,
    body,
    tailwind,
    opts: { cart: false, blogArticles: false, isBlogArticle: false },
  });
  write(live, html);
  console.log('Live redirect stub:', live);
}

function applyProduct(slug) {
  const liveFile = `products/${slug}/index.html`;
  if (!fs.existsSync(path.join(REPO, liveFile))) {
    console.warn('Skip product:', liveFile);
    return;
  }
  const testHtml = fs.readFileSync(path.join(TEST_PAGES, 'product-test.html'), 'utf8');
  const liveHtml = read(liveFile);
  const tailwind = extractTailwindBlock(testHtml);
  const preserved = extractPreservedHead(liveHtml);
  const title = extractLiveTitle(liveHtml);
  const body = transformToLive(productPdpBody());
  const html = buildLivePage({
    preservedHead: preserved,
    title,
    body,
    tailwind,
    opts: { cart: false, blogArticles: false, isBlogArticle: false },
  });
  write(liveFile, html);
  console.log('Live PDP:', liveFile);
}

function applyBlogArticle(slug) {
  const testFile = path.join(TEST_BLOG, `${slug}-test.html`);
  const liveFile = `blog/${slug}.html`;
  if (!fs.existsSync(testFile) || !fs.existsSync(path.join(REPO, liveFile))) return false;

  const testHtml = fs.readFileSync(testFile, 'utf8');
  const liveHtml = read(liveFile);
  const tailwind = extractTailwindBlock(testHtml);
  const preserved = extractPreservedHead(liveHtml);
  const title = extractLiveTitle(liveHtml);
  let body = transformToLive(extractV2Body(testHtml), { isBlogArticle: true });
  const html = buildLivePage({
    preservedHead: preserved,
    title,
    body,
    tailwind,
    opts: { cart: false, blogArticles: false, isBlogArticle: true },
  });
  write(liveFile, html);
  return true;
}

patchSiteData();
generateBlogArticlesJs();

applyPaymentPage();
for (const entry of PAGE_MAP) applyPage(entry);
for (const stub of REDIRECT_STUB_PAGES) applyRedirectStub(stub);
for (const slug of PRODUCT_SLUGS) applyProduct(slug);

let blogCount = 0;
const blogFiles = fs
  .readdirSync(TEST_BLOG)
  .filter((f) => f.endsWith('-test.html') && f !== 'index-test.html' && f !== 'blog-test.html');
for (const f of blogFiles) {
  const slug = f.replace(/-test\.html$/, '');
  if (applyBlogArticle(slug)) blogCount++;
}
console.log(
  `\nDone. ${PAGE_MAP.length} mapped pages, payment + ${REDIRECT_STUB_PAGES.length} redirect stubs, ${PRODUCT_SLUGS.length} PDPs, ${blogCount} blog articles.`
);

console.log('\nNormalizing live test URLs in HTML…');
const { execSync } = await import('child_process');
execSync('node scripts/fix-live-test-links.mjs', { stdio: 'inherit', cwd: REPO });
