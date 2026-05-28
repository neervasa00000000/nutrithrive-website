#!/usr/bin/env node
/**
 * Migrates blog/*.html posts to Nutri Thrive v2 Tailwind article layout.
 * Preserves SEO head (meta, schema, analytics) and article body content.
 */
import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd());
const BLOG = path.join(ROOT, "blog");
const RELATED = JSON.parse(
  fs.readFileSync(path.join(BLOG, "blog-v2-related.json"), "utf8")
);

const V2_HEAD = `<!-- Nutri Thrive v2 blog shell -->
<link rel="stylesheet" href="/assets/css/tailwind-v2.min.css"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="/blog/blog-v2-prose.css" rel="stylesheet"/>
<link rel="stylesheet" href="/shared/css/v2-extra.css"/>
<style>
.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
body { background-color: #FDF9EE; color: #1C1C15; -webkit-font-smoothing: antialiased; }
</style>`;

function stripHtml(s) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cleanHead(head) {
  let h = head;
  h = h.replace(/<style[\s\S]*?<\/style>/gi, "");
  h = h.replace(/<link[^>]*(?:style\.css|blog\.css|blog-story|newsletter-popup|design-system)[^>]*\/?>/gi, "");
  h = h.replace(/<link[^>]*Inter[^>]*\/?>/gi, "");
  h = h.replace(/<noscript>[\s\S]*?<\/noscript>/gi, "");
  if (!h.includes("blog-v2-prose.css")) {
    h = h + "\n" + V2_HEAD;
  }
  return h.trim();
}

function extractBodyMain(html) {
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!body) return "";
  let b = body[1];
  b = b.replace(/^[\s\S]*?<\/header>/i, "");
  b = b.replace(/<footer[\s\S]*/i, "");
  b = b.replace(/<script[\s\S]*/i, "");
  return b.trim();
}

function extractArticle(html) {
  const tries = [
    /<article class="blog-post-content"[^>]*>([\s\S]*?)<\/article>/i,
    /<main class="story-main"[^>]*>([\s\S]*?)<\/main>/i,
    /<main class="blog-post"[^>]*>([\s\S]*?)<\/main>/i,
    /<article class="blog-post"[^>]*>([\s\S]*?)<\/article>/i,
  ];
  for (const re of tries) {
    const m = html.match(re);
    if (m && m[1].trim().length > 200) return m[1].trim();
  }
  const wrap = html.match(/<div class="article-wrap"[^>]*>([\s\S]*)/i);
  if (wrap) {
    const chunk = wrap[1].replace(/<\/div>\s*<\/div>\s*<script[\s\S]*/i, "").trim();
    if (chunk.length > 200) return chunk;
  }
  const content = html.match(/<div class="content"[^>]*>([\s\S]*?)<\/div>\s*<footer/i);
  if (content && content[1].trim().length > 200) return content[1].trim();
  const fallback = extractBodyMain(html);
  return fallback.length > 200 ? fallback : "";
}

function stripDuplicateHero(content) {
  let c = content;
  c = c.replace(/<!-- Breadcrumb Navigation -->[\s\S]*?(?=<(?:section|h2|div class="blog|article|p))/i, "");
  c = c.replace(/<nav[^>]*(?:Breadcrumb|breadcrumb)[\s\S]*?<\/nav>/gi, "");
  c = c.replace(/<header class="blog-post-header"[^>]*>[\s\S]*?<\/header>/i, "");
  c = c.replace(/<section class="hero"[^>]*>[\s\S]*?<\/section>/i, "");
  c = c.replace(/<div class="hero-section"[^>]*>[\s\S]*?<\/div>\s*(?=<)/i, "");
  c = c.replace(/<div class="cover"[^>]*>[\s\S]*?<\/div>\s*(?=<div class="content")/i, "");
  return c.trim();
}

function extractH1(content, html) {
  const m = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (m) return stripHtml(m[1]);
  const t = html.match(/<title>([^<]*)<\/title>/i);
  return t ? stripHtml(t[1].split("|")[0]) : "NutriThrive Journal";
}

function extractDate(html) {
  const pub = html.match(/article:published_time"\s+content="([^"]+)"/i);
  if (pub) {
    const d = new Date(pub[1]);
    if (!isNaN(d)) {
      return d.toLocaleDateString("en-AU", { month: "long", day: "numeric", year: "numeric" });
    }
  }
  const meta = html.match(/<p class="post-meta"[^>]*>([\s\S]*?)<\/p>/i);
  if (meta) {
    const plain = stripHtml(meta[1]);
    const dm = plain.match(/(?:Published|Updated)[^·]*?([A-Za-z]+ \d{1,2},? \d{4}|\d{1,2} [A-Za-z]+ \d{4}|[A-Za-z]+ – [A-Za-z]+ \d{4})/i);
    if (dm) return dm[1].replace(/•.*/, "").trim();
    return plain.split("•")[0].trim().slice(0, 40);
  }
  return "2026";
}

function extractHeroImage(html) {
  const og = html.match(/property="og:image"\s+content="([^"]+)"/i);
  if (og) return og[1];
  return "https://nutrithrive.com.au/assets/images/og/moringa-article-1200.jpg";
}

function categoryForSlug(slug) {
  if (/quit|fatigue|acne|weight|cortisol|sugar|diary/i.test(slug)) return "Wellness Story";
  if (/comparison|brands|ranked|vs-|best-|review/i.test(slug)) return "Research Guide";
  if (/recipe|smoothie|diet|eat/i.test(slug)) return "Recipes & Nutrition";
  if (/melbourne|victoria|australia|delivers/i.test(slug)) return "Local Guide";
  return "Wellness Journal";
}

function pickRelated(currentSlug) {
  return RELATED.filter((r) => r.slug !== currentSlug).slice(0, 3);
}

function trailingScripts(html) {
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!body) return "";
  const afterFooter = body[1].split(/<footer[\s\S]*?<\/footer>/i).pop() || "";
  const scripts = [];
  const re = /<script[\s\S]*?<\/script>/gi;
  let m;
  while ((m = re.exec(afterFooter))) {
    const s = m[0];
    if (s.includes("newsletter-popup") || s.includes("blog.js") || s.includes("blog-editorial")) {
      scripts.push(s);
    }
  }
  if (!scripts.some((s) => s.includes("newsletter-popup"))) {
    scripts.push('<script defer src="../scripts/global/newsletter-popup.js"></script>');
  }
  return scripts.join("\n");
}

function pageLang(html) {
  const m = html.match(/<html[^>]*\slang="([^"]+)"/i);
  return m ? m[1] : "en-AU";
}

function buildShell({ title, date, category, heroImage, content, related, slug, lang }) {
  const relatedHtml = related
    .map(
      (r) => `<a class="group flex gap-4 items-center" href="/blog/${r.slug}">
<div class="w-20 h-20 bg-surface-container rounded-lg flex-shrink-0 overflow-hidden">
<img alt="" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" src="${r.image}" loading="lazy" decoding="async"/>
</div>
<div>
<h5 class="font-label-lg text-label-lg text-forest-deep group-hover:text-moringa-leaf transition-colors">${escapeHtml(r.title)}</h5>
<p class="text-xs text-on-surface-variant opacity-70">${escapeHtml(r.read)}</p>
</div>
</a>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html class="light" lang="${lang}">
<head>
${""}
</head>
<body class="font-body-md text-body-md overflow-x-hidden">
<nav class="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20 shadow-sm">
<div class="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between">
<a class="flex items-center gap-base" href="/">
<img src="../assets/images/logo/LOGO.webp" alt="NutriThrive" width="40" height="40" class="h-9 w-auto" loading="eager"/>
<span class="font-display text-headline-md text-moringa-leaf">Nutri Thrive</span>
</a>
<div class="hidden md:flex items-center gap-gutter">
<a class="font-body-md text-label-lg text-forest-deep/80 hover:text-moringa-leaf transition-colors" href="/products/">Shop</a>
<a class="font-body-md text-label-lg text-forest-deep/80 hover:text-moringa-leaf transition-colors" href="/pages/about/about.html">About</a>
<a class="font-body-md text-label-lg text-moringa-leaf border-b-2 border-moringa-leaf font-semibold" href="/blog/">Blog</a>
<a class="font-body-md text-label-lg text-forest-deep/80 hover:text-moringa-leaf transition-colors" href="/contact">Contact</a>
</div>
<div class="flex items-center gap-2">
<a class="material-symbols-outlined text-forest-deep p-2 hover:bg-primary-fixed/10 rounded-full transition-all" href="/pages/shop/cart.html" aria-label="Cart">shopping_bag</a>
</div>
</div>
</nav>
<main class="pt-24 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
<article class="lg:col-span-8">
<header class="mb-12">
<div class="flex flex-wrap items-center gap-2 mb-4">
<span class="bg-primary-fixed/30 text-moringa-leaf px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider font-bold">${escapeHtml(category)}</span>
<span class="text-on-surface-variant text-label-lg font-body-md">${escapeHtml(date)}</span>
</div>
<h1 class="font-display text-headline-lg md:text-display text-forest-deep mb-8 leading-tight">${escapeHtml(title)}</h1>
<div class="w-full aspect-[16/9] rounded-xl overflow-hidden mb-12 shadow-sm bg-surface-container">
<img alt="" class="w-full h-full object-cover" src="${heroImage}" loading="eager" decoding="async"/>
</div>
</header>
<div class="blog-v2-prose prose prose-lg max-w-none">
${content}
</div>
<section class="mt-20 p-8 md:p-12 bg-parchment-base rounded-2xl border border-outline-variant/30 text-center">
<h3 class="font-headline-md text-headline-md text-forest-deep mb-4">Stay Vitalized</h3>
<p class="font-body-md text-body-md text-on-surface-variant mb-8 max-w-md mx-auto">Get plant-based nutrition tips and exclusive offers from Melbourne.</p>
<form class="flex flex-col md:flex-row gap-4 max-w-lg mx-auto" action="/pages/newsletter/" method="get">
<input class="flex-grow p-4 rounded-lg border border-outline-variant bg-pure-white focus:outline-none focus:ring-2 focus:ring-moringa-leaf" placeholder="Your email address" type="email" name="email" required/>
<button class="bg-moringa-leaf text-pure-white px-8 py-4 rounded-lg font-label-lg text-label-lg hover:bg-forest-deep transition-all" type="submit">Subscribe</button>
</form>
</section>
</article>
<aside class="lg:col-span-4 space-y-12">
<div class="bg-pure-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
<div class="aspect-square bg-surface-container relative">
<img alt="NutriThrive Premium Moringa" class="w-full h-full object-cover" src="/assets/images/homepage/product-showcase/Moringa.webp" loading="lazy"/>
<div class="absolute top-4 right-4 bg-terracotta-clay text-pure-white px-3 py-1 rounded-lg text-label-sm font-label-sm">Best Seller</div>
</div>
<div class="p-6">
<h4 class="font-headline-md text-headline-md text-forest-deep mb-2">Premium Indian Moringa</h4>
<p class="text-on-surface-variant font-body-md text-body-md mb-6">Shade-dried, lab-tested, packed in Victoria.</p>
<div class="flex items-center justify-between mb-6">
<span class="text-2xl font-bold text-moringa-leaf">$11.00</span>
<span class="text-label-sm text-on-surface-variant line-through opacity-60">/100g</span>
</div>
<a class="block w-full text-center bg-terracotta-clay text-pure-white py-4 rounded-lg font-label-lg text-label-lg hover:scale-[1.02] transition-transform" href="/products/moringa-powder/">Shop Moringa</a>
</div>
</div>
<div class="space-y-6">
<h3 class="font-headline-md text-headline-md text-forest-deep border-b-2 border-primary-fixed pb-2">Related Guides</h3>
<div class="space-y-4">${relatedHtml}</div>
</div>
<div class="bg-parchment-base/50 p-6 rounded-xl space-y-4">
<div class="flex items-center gap-3"><span class="material-symbols-outlined text-forest-deep/60">verified_user</span><span class="text-label-sm font-label-sm text-forest-deep/80 uppercase">Australian Lab-Tested</span></div>
<div class="flex items-center gap-3"><span class="material-symbols-outlined text-forest-deep/60">local_shipping</span><span class="text-label-sm font-label-sm text-forest-deep/80 uppercase">Express Melbourne Dispatch</span></div>
<div class="flex items-center gap-3"><span class="material-symbols-outlined text-forest-deep/60">eco</span><span class="text-label-sm font-label-sm text-forest-deep/80 uppercase">Lab-Tested &amp; Vegan</span></div>
</div>
</aside>
</div>
</main>
<footer class="bg-forest-deep text-pure-white w-full pt-section-gap pb-base">
<div class="grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
<div class="space-y-6">
<span class="font-display text-headline-md text-primary-fixed block">Nutri Thrive</span>
<p class="font-body-md text-surface-variant/70">Purity in every leaf. Melbourne, Australia.</p>
</div>
<div class="space-y-4">
<h6 class="font-label-lg text-label-lg text-pure-white uppercase tracking-widest">Shop</h6>
<ul class="space-y-2">
<li><a class="text-surface-variant/70 hover:text-pure-white transition-colors" href="/products/">Shop All</a></li>
<li><a class="text-surface-variant/70 hover:text-pure-white transition-colors" href="/products/moringa-powder/">Moringa Powder</a></li>
</ul>
</div>
<div class="space-y-4">
<h6 class="font-label-lg text-label-lg text-pure-white uppercase tracking-widest">Company</h6>
<ul class="space-y-2">
<li><a class="text-surface-variant/70 hover:text-pure-white transition-colors" href="/pages/about/about.html">About</a></li>
<li><a class="text-primary-fixed underline" href="/blog/">Journal</a></li>
<li><a class="text-surface-variant/70 hover:text-pure-white transition-colors" href="/contact">Contact</a></li>
<li><a class="text-surface-variant/70 hover:text-pure-white transition-colors" href="/pages/shipping/shipping-returns.html">Shipping &amp; Returns</a></li>
</ul>
</div>
<div class="space-y-4">
<h6 class="font-label-lg text-label-lg text-pure-white uppercase tracking-widest">Legal</h6>
<ul class="space-y-2">
<li><a class="text-surface-variant/70 hover:text-pure-white transition-colors" href="/pages/legal/privacy-policy.html">Privacy Policy</a></li>
</ul>
</div>
</div>
<div class="mt-12 border-t border-pure-white/10 pt-base text-center text-xs text-surface-variant/40 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
© ${new Date().getFullYear()} Nutri Thrive. All rights reserved.
</div>
</footer>
<script>
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var href = this.getAttribute('href');
    if (href && href.length > 1) {
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var y = target.getBoundingClientRect().top + window.pageYOffset - 88;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  });
});
</script>
</body>
</html>`;
}

function migrateFile(filename) {
  const slug = filename;
  const filePath = path.join(BLOG, filename);
  let html = fs.readFileSync(filePath, "utf8");

  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) {
    console.warn("skip (no head):", filename);
    return false;
  }

  let rawContent = extractArticle(html);
  if (!rawContent) {
    console.warn("skip (no article):", filename);
    return false;
  }

  const title = extractH1(rawContent, html);
  const date = extractDate(html);
  const category = categoryForSlug(slug);
  const heroImage = extractHeroImage(html);
  const content = stripDuplicateHero(rawContent);
  const related = pickRelated(slug);
  const head = cleanHead(headMatch[1]);
  const scripts = trailingScripts(html);

  const lang = pageLang(html);
  let out = buildShell({ title, date, category, heroImage, content, related, slug, lang });
  out = out.replace("<head>\n\n</head>", `<head>\n${head}\n</head>`);
  out = out.replace("</body>", `${scripts}\n</body>`);

  fs.writeFileSync(filePath, out);
  return true;
}

function migrateIndex() {
  const filePath = path.join(BLOG, "index.html");
  let html = fs.readFileSync(filePath, "utf8");
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!headMatch || !mainMatch) {
    console.warn("skip index");
    return;
  }
  const head = cleanHead(headMatch[1]).replace(
    "blog-v2-prose.css",
    "blog-v2-index.css"
  );
  if (!head.includes("blog-v2-index.css")) {
    head.replace; // noop
  }
  const indexHead = head.includes("blog-v2-index.css")
    ? head
    : head.replace(
        "blog-v2-prose.css",
        "blog-v2-prose.css\n<link href=\"../blog/blog-v2-index.css\" rel=\"stylesheet\"/>"
      );
  const listHtml = mainMatch[1].trim();
  const out = buildShell({
    title: "The Wellness Journal",
    date: "Updated 2026",
    category: "Nutri Thrive Blog",
    heroImage: "https://nutrithrive.com.au/assets/images/og/moringa-article-1200.jpg",
    content: `<div class="blog-v2-index">${listHtml}</div>`,
    related: RELATED.slice(0, 3),
    slug: "index.html",
    lang: "en-AU",
  })
    .replace("<head>\n\n</head>", `<head>\n${indexHead}\n</head>`)
    .replace(
      /<section class="mt-20[\s\S]*?<\/section>\s*<\/article>/,
      "</article>"
    );
  fs.writeFileSync(filePath, out);
  console.log("✓ index.html");
}

const files = fs.readdirSync(BLOG).filter((f) => f.endsWith(".html") && f !== "index.html");
let ok = 0;
let fail = 0;
for (const f of files) {
  if (migrateFile(f)) {
    ok++;
    console.log("✓", f);
  } else {
    fail++;
  }
}
console.log(`Done: ${ok} posts migrated, ${fail} skipped`);
console.log("Note: run scripts/migrate-blog-index-v2.mjs for blog/index.html");
