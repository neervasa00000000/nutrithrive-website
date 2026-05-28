/**
 * V2 live-page head performance helpers (LCP, dedupe tailwind-config).
 */
export const V2_TAILWIND_BUILT = '<link rel="stylesheet" href="/assets/css/tailwind-v2.min.css"/>';

export const V2_PRECONNECTS = `<!-- Performance: early connections -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="/shared/css/critical.css">`;

export const HOME_LCP_PRELOAD = `<link rel="preload" as="image" href="/assets/images/blog/GC.webp" fetchpriority="high">`;

export const SHOP_LCP_PRELOAD = `<link rel="preload" as="image" href="/assets/images/product_photos/webp/moringa.webp" fetchpriority="high">`;

const TAILWIND_CONFIG_RE = /<script id="tailwind-config">[\s\S]*?<\/script>\s*/gi;
const TAILWIND_CDN_RE = /<script src="https:\/\/cdn\.tailwindcss\.com[^>]*><\/script>\s*/gi;

/** Prefer built CSS; strip duplicate inline config and CDN. */
export function dedupeTailwindConfig(html) {
  let out = html.replace(TAILWIND_CONFIG_RE, '');
  out = out.replace(TAILWIND_CDN_RE, '');
  if (!out.includes('/assets/css/tailwind-v2.min.css')) {
    out = out.replace(
      /(<link rel="stylesheet" href="\/shared\/css\/critical\.css">)/i,
      `$1\n${V2_TAILWIND_BUILT}`
    );
  }
  return out;
}

export function stripPerfDuplicatesFromPreserved(head) {
  let h = head;
  h = h.replace(/<!-- Performance: early connections -->[\s\S]*?<link rel="stylesheet" href="\/shared\/css\/critical\.css">\s*/gi, '');
  h = h.replace(/<link[^>]*rel="preload"[^>]*fetchpriority="high"[^>]*>\s*/gi, '');
  h = h.replace(/<link[^>]*rel="preload"[^>]*\/assets\/images\/blog\/GC\.webp[^>]*>\s*/gi, '');
  h = h.replace(/<link[^>]*rel="preload"[^>]*homepage\.js[^>]*>\s*/gi, '');
  h = h.replace(TAILWIND_CONFIG_RE, '');
  h = h.replace(/<link[^>]*critical\.css[^>]*>\s*/gi, '');
  return h.trim();
}

export function buildPerfHeadBlock({ shop = false } = {}) {
  const lcp = shop ? SHOP_LCP_PRELOAD : HOME_LCP_PRELOAD;
  return `${V2_PRECONNECTS}\n${lcp}`;
}
