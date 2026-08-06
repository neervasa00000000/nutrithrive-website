/**
 * Blog article head performance — critical CSS, deferred stylesheets, self-hosted fonts.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..', '..');

const DEFER_STYLESHEET = (href) =>
  `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'"/>\n<noscript><link rel="stylesheet" href="${href}"/></noscript>`;

let cachedCriticalCss = null;

export function readBlogCriticalCss() {
  if (cachedCriticalCss !== null) return cachedCriticalCss;
  const file = path.join(REPO, 'shared/css/blog-critical.min.css');
  cachedCriticalCss = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').trim() : '';
  return cachedCriticalCss;
}

export function buildBlogPerfHead(_criticalCss) {
  return `<!-- Blog perf: critical CSS + deferred styles + self-hosted fonts -->
<link rel="stylesheet" href="/shared/css/blog-critical.min.css"/>
<link rel="preload" href="/assets/fonts/plus-jakarta-sans-400.woff2" as="font" type="font/woff2" crossorigin/>
${DEFER_STYLESHEET('/shared/css/fonts-local.min.css')}
${DEFER_STYLESHEET('/assets/css/design-system.min.css')}
${DEFER_STYLESHEET('/styles/global/style.min.css')}
${DEFER_STYLESHEET('/assets/css/tailwind-v2.min.css')}
${DEFER_STYLESHEET('/blog/blog-v2-prose.min.css')}
${DEFER_STYLESHEET('/shared/css/v2-extra.min.css')}
<link rel="stylesheet" href="/shared/css/author-bio.min.css" media="print" onload="this.media='all'"/><noscript><link rel="stylesheet" href="/shared/css/author-bio.min.css"/></noscript>
<script>(function(){var b=document.body;if(!b||!b.classList.contains('nt-blog-article')&&!b.classList.contains('nt-blog-index'))return;var loaded=function(){b.classList.add('fonts-loaded')};if(!document.fonts||!document.fonts.load){loaded();return}Promise.all([document.fonts.load('400 1em \\"Plus Jakarta Sans\\"'),document.fonts.load('600 1em \\"Plus Jakarta Sans\\"')]).then(loaded).catch(loaded)})();</script>`;
}

export const LAYOUT_V2_DELAYED =
  `<script>(function(){function loadLayout(){var s=document.createElement('script');s.src='/shared/js/layout-v2.min.js';s.defer=true;document.body.appendChild(s)}if(document.readyState==='complete'){loadLayout()}else{window.addEventListener('load',loadLayout,{once:true})}})();</script>`;

const GOOGLE_FONTS_RE =
  /[ \t]*<link[^>]*fonts\.googleapis\.com[^>]*>\s*/gi;
const GOOGLE_FONTS_PRECONNECT_RE =
  /[ \t]*<link[^>]*(?:preconnect|dns-prefetch)[^>]*fonts\.(?:googleapis|gstatic)\.com[^>]*>\s*/gi;
const BLOCKING_BLOG_CSS_RE =
  /[ \t]*<link rel="stylesheet" href="\/(?:assets\/css\/design-system|styles\/global\/style|assets\/css\/tailwind-v2|blog\/blog-v2-prose|shared\/css\/v2-extra)\.min\.css"\/>\s*/gi;
const AUTHOR_BIO_CSS_RE =
  /[ \t]*<link rel="stylesheet" href="\/shared\/css\/author-bio\.min\.css"(?:[^>]*)>\s*(?:<noscript>[\s\S]*?<\/noscript>\s*)?/gi;
const EXISTING_PERF_BLOCK_RE =
  /<!-- Blog perf:[\s\S]*?<\/script>\s*/i;
const HERO_PRELOAD_RE =
  /[ \t]*<link rel="preload" as="image"[^>]*fetchpriority="high"[^>]*>\s*/gi;
const LAYOUT_V2_SCRIPT_RE =
  /<script src="\/shared\/js\/layout-v2\.min\.js" defer><\/script>\s*/gi;

/** Normalize author-bio to non-blocking if a bare blocking tag remains. */
export function normalizeAuthorBioCss(html) {
  return html.replace(
    /<link rel="stylesheet" href="\/shared\/css\/author-bio\.min\.css"\/>/g,
    '<link rel="stylesheet" href="/shared/css/author-bio.min.css" media="print" onload="this.media=\'all\'"/><noscript><link rel="stylesheet" href="/shared/css/author-bio.min.css"/></noscript>'
  );
}

export function deferLayoutV2(html) {
  if (html.includes('loadLayout') && html.includes('layout-v2.min.js')) {
    return html;
  }
  return html
    .replace(LAYOUT_V2_SCRIPT_RE, LAYOUT_V2_DELAYED)
    .replace(
      /<script src="\/shared\/js\/layout-v2\.min\.js"><\/script>\s*/gi,
      LAYOUT_V2_DELAYED
    );
}

export function applyBlogHeadPerf(html, { criticalCss = readBlogCriticalCss() } = {}) {
  if (!html.includes('nt-blog-article') && !html.includes('nt-blog-index')) {
    return html;
  }

  let out = html;
  out = out.replace(EXISTING_PERF_BLOCK_RE, '');
  out = out.replace(GOOGLE_FONTS_RE, '');
  out = out.replace(GOOGLE_FONTS_PRECONNECT_RE, '');
  out = out.replace(BLOCKING_BLOG_CSS_RE, '');
  out = out.replace(AUTHOR_BIO_CSS_RE, '');
  out = out.replace(HERO_PRELOAD_RE, '');
  out = normalizeAuthorBioCss(out);
  out = deferLayoutV2(out);
  out = moveDeferLoaderToBody(out);

  const perfHead = buildBlogPerfHead(criticalCss);
  if (!out.includes('<!-- Blog perf:')) {
    out = out.replace(/<\/head>/i, `${perfHead}\n</head>`);
  } else {
    out = out.replace(/<!-- Blog perf:[\s\S]*?<\/script>\s*/i, `${perfHead}\n`);
  }

  out = ensureHeroPreload(out);
  return out;
}

export function heroPreloadTags(html) {
  const tags = [];
  const picture = html.match(
    /<picture>[\s\S]*?<source[^>]*media="\(max-width:\s*768px\)"[^>]*srcset="([^"]+)"[\s\S]*?<\/picture>/i
  );
  if (picture?.[1]) {
    tags.push(
      `<link rel="preload" as="image" href="${picture[1]}" media="(max-width: 768px)" fetchpriority="high"/>`
    );
    const desktop = html.match(/<picture>[\s\S]*?<source[^>]*media="\(min-width:\s*769px\)"[^>]*srcset="([^"]+)"/i);
    if (desktop?.[1]) {
      tags.push(
        `<link rel="preload" as="image" href="${desktop[1]}" media="(min-width: 769px)" fetchpriority="high"/>`
      );
    }
    return tags.join('\n');
  }

  const heroMatch = html.match(
    /<img[^>]*fetchpriority="high"[^>]*src="([^"]+)"|<img[^>]*src="([^"]+)"[^>]*fetchpriority="high"/i
  );
  const src = heroMatch?.[1] || heroMatch?.[2];
  if (src && !src.startsWith('http')) {
    return `<link rel="preload" as="image" href="${src}" fetchpriority="high"/>`;
  }
  return '';
}

/** Add hero image preload right after viewport for early discovery. */
export function ensureHeroPreload(html) {
  const tags = heroPreloadTags(html);
  if (!tags) return html;
  if (html.includes(tags.split('\n')[0])) return html;
  return html.replace(
    /(<meta name="viewport"[^>]*>)/i,
    `$1\n${tags}`
  );
}

/** Wrap large hero images in responsive picture elements. */
/** Move defer-loader out of the top of <head> so image preloads are discovered first. */
export function moveDeferLoaderToBody(html) {
  const tag = '<script src="/scripts/global/defer-loader.min.js" defer></script>';
  if (!html.includes(tag)) return html;
  let out = html.replace(new RegExp(`[ \\t]*${tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i'), '');
  if (!out.includes(tag)) {
    out = out.replace(/<\/body>/i, `${tag}\n</body>`);
  }
  return out;
}

export function optimizeHeroImages(html) {
  let out = html;

  out = out.replace(
    /<div class="w-full aspect-\[16\/9\][^"]*">\s*<img([^>]*?)src="\/assets\/images\/homepage\/product-showcase\/Curry\.webp"([^>]*?)>\s*<\/div>/gi,
    `<div class="w-full aspect-[16/9] rounded-xl overflow-hidden mb-12 shadow-sm bg-surface-container">
<picture>
<source media="(max-width: 768px)" srcset="/assets/images/homepage/product-showcase/hero640/Curry.webp"/>
<img$1src="/assets/images/homepage/product-showcase/Curry.webp"$2 decoding="sync">
</picture>
</div>`
  );

  out = out.replace(
    /<div class="w-full aspect-\[16\/9\][^"]*">\s*<img([^>]*?)src="\/assets\/images\/homepage\/product-showcase\/Moringa\.webp"([^>]*?)>\s*<\/div>/gi,
    `<div class="w-full aspect-[16/9] rounded-xl overflow-hidden mb-12 shadow-sm bg-surface-container nt-blog-hero-media">
<picture>
<source media="(max-width: 768px)" srcset="/assets/images/blog/moringa-blog-hero-480.jpg"/>
<source media="(min-width: 769px)" srcset="/assets/images/blog/moringa-blog-hero-800.jpg"/>
<img$1src="/assets/images/blog/moringa-blog-hero-800.jpg"$2 width="800" height="450" decoding="sync">
</picture>
</div>`
  );

  out = out.replace(
    /<div class="w-full aspect-\[16\/9\][^"]*">\s*<img([^>]*?)src="\/assets\/images\/og\/moringa-article-1200\.jpg"([^>]*?)>\s*<\/div>/gi,
    `<div class="w-full aspect-[16/9] rounded-xl overflow-hidden mb-12 shadow-sm bg-surface-container nt-blog-hero-media">
<picture>
<source media="(max-width: 768px)" srcset="/assets/images/blog/moringa-blog-hero-480.jpg"/>
<source media="(min-width: 769px)" srcset="/assets/images/blog/moringa-blog-hero-800.jpg"/>
<img$1src="/assets/images/blog/moringa-blog-hero-800.jpg"$2 width="800" height="450" decoding="sync">
</picture>
</div>`
  );

  return out;
}
