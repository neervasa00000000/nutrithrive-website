/**
 * /products/ PageSpeed: non-blocking Tailwind, static LCP grid, deferred trackers.
 */
import {
  dedupeTailwindConfig,
  buildPerfHeadBlock,
  stripPerfDuplicatesFromPreserved,
} from './v2-head-perf.mjs';
import { patchShopGridBody } from './shop-static-html.mjs';

const NONBLOCK_FONT =
  (href) =>
    `<link rel="preload" as="style" href="${href}">\n<link href="${href}" rel="stylesheet" media="print" onload="this.media='all'">\n<noscript><link href="${href}" rel="stylesheet"></noscript>`;

const LITERATA_FONTS =
  'https://fonts.googleapis.com/css2?family=Literata:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap';
const MATERIAL_FONTS =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';

export function optimizeProductsPageHtml(html) {
  let out = html;

  // Strip duplicate perf / tailwind blocks from preserved SEO head
  const headEnd = out.indexOf('</head>');
  if (headEnd > 0) {
    const head = out.slice(0, headEnd);
    const rest = out.slice(headEnd);
    const preservedEnd = head.indexOf('<link rel="icon"');
    if (preservedEnd > 0) {
      const before = head.slice(0, preservedEnd);
      const after = head.slice(preservedEnd);
      out = stripPerfDuplicatesFromPreserved(before) + after + rest;
    } else {
      out = stripPerfDuplicatesFromPreserved(head) + rest;
    }
  }

  out = dedupeTailwindConfig(out);

  // Legacy Inter/Lato block (not used on v2 shop)
  out = out.replace(
    /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\s*<link rel="preload" as="style" href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter[\s\S]*?<\/noscript>\s*/gi,
    ''
  );

  // GSAP not needed on catalog page
  out = out.replace(/<script[^>]*gsap[^>]*><\/script>\s*/gi, '');

  // Early paint + LCP discovery
  if (!out.includes('/shared/css/critical.css')) {
    out = out.replace(
      /(<meta name="viewport"[^>]*>)/i,
      `$1\n${buildPerfHeadBlock({ shop: true })}`
    );
  }

  // Non-blocking v2 fonts
  out = out.replace(
    /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Literata[^"]+" rel="stylesheet"\/?>/gi,
    NONBLOCK_FONT(LITERATA_FONTS)
  );
  out = out.replace(
    /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Material\+Symbols[^"]+" rel="stylesheet"\/?>/gi,
    NONBLOCK_FONT(MATERIAL_FONTS)
  );

  // Static product grid in HTML for LCP + CLS
  const bodyMatch = out.match(/<body[\s\S]*<\/body>/i);
  if (bodyMatch) {
    const patchedBody = patchShopGridBody(
      bodyMatch[0].replace(/<body/, '<body data-static-shop="1"')
    );
    if (!bodyMatch[0].includes('data-static-shop')) {
      out = out.replace(bodyMatch[0], patchedBody);
    } else {
      out = out.replace(bodyMatch[0], patchShopGridBody(bodyMatch[0]));
    }
  }

  // Defer non-critical global scripts
  out = out.replace(
    /<script src="\/scripts\/global\/defer-loader\.js"><\/script>/,
    '<script defer src="/scripts/global/defer-loader.js"></script>'
  );
  out = out.replace(
    /<script src="\/scripts\/global\/reddit-pixel\.js"><\/script>/,
    '<script defer src="/scripts/global/reddit-pixel.js"></script>'
  );

  return out;
}
