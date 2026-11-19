// Apply only loading-attribute changes to preserved storefront HTML. In
// particular, article copy, structured data and metadata remain untouched.
export const PERFORMANCE_VERSION = '20261026-performance-2';
export function optimizeStorefrontLoading(html) {
  if (!html.includes('/assets/css/storefront-system') || !html.includes('class="storefront-refined"')) return html;
  let out = html;
  const searchTag = /<script\b[^>]*\bsrc="(\/assets\/js\/storefront\/search-index(?:\.min)?\.js)(?:\?[^\"]*)?"[^>]*><\/script>\s*/g;
  if (searchTag.test(out)) {
    searchTag.lastIndex = 0;
    out = out.replace(searchTag, '');
  }
  out = out.replace(/(<div\b[^>]*\bid="search-panel"[^>]*\bdata-search-index=")[^"]*(")/, `$1/assets/js/storefront/search-index.min.js?v=${PERFORMANCE_VERSION}$2`);
  out = out.replace(/(<div\b[^>]*\bid="search-panel")(?![^>]*data-search-index=)([^>]*>)/, `$1 data-search-index="/assets/js/storefront/search-index.min.js?v=${PERFORMANCE_VERSION}"$2`);
  out = out.replace(/(src="\/assets\/js\/storefront\/site(?:\.min)?\.js)\?[^\"]*"/g, `$1?v=${PERFORMANCE_VERSION}"`);
  return out;
}
