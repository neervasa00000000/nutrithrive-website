/**
 * Rewrites v2 preview / test URLs to production paths (no website2.0 at runtime).
 * Used by scripts/build-live-v2.mjs and scripts/fix-live-test-links.mjs.
 */

const PRODUCT_ID_TO_SLUG = {
  'moringa-powder': 'moringa-powder',
  'moringa-powder-100g': 'moringa-powder',
  'moringa-powder-200g': 'moringa-powder',
  'moringa-400g': 'moringa-powder',
  'curry-leaves': 'curry-leaves',
  'curry-leaves-30g': 'curry-leaves',
  'black-tea': 'black-tea',
  'combo-pack': 'combo-pack',
  'moringa-soap': 'moringa-soap',
  'moringa-soap-combo': 'moringa-soap',
};

export function productTestHref(id) {
  const slug = PRODUCT_ID_TO_SLUG[id] || (id.startsWith('moringa') ? 'moringa-powder' : id);
  return `/products/${slug}/`;
}

/** @param {string} html */
export function transformLiveLinks(html) {
  let out = html;

  out = out.replace(/href="\/pages\/product-test\.html\?id=([^"#?]+)"/gi, (_, id) =>
    `href="${productTestHref(id.trim())}"`
  );
  out = out.replace(/href='\/pages\/product-test\.html\?id=([^'#?]+)'/gi, (_, id) =>
    `href='${productTestHref(id.trim())}'`
  );

  const simple = [
    [/href="\/pages\/home-test\.html"/gi, 'href="/"'],
    [/href='\/pages\/home-test\.html'/gi, "href='/'"],
    [/href="\/pages\/shop-test\.html"/gi, 'href="/products/"'],
    [/href='\/pages\/shop-test\.html'/gi, "href='/products/'"],
    [/href="\/pages\/cart-test\.html"/gi, 'href="/cart"'],
    [/href="\/pages\/payment-test\.html"/gi, 'href="/payment"'],
    [/href="\/pages\/about-test\.html"/gi, 'href="/about"'],
    [/href="\/pages\/contact-test\.html"/gi, 'href="/contact"'],
    [/href="\/pages\/faq-test\.html"/gi, 'href="/faq"'],
    [/href="\/pages\/shipping-test\.html"/gi, 'href="/pages/shipping/shipping-returns.html"'],
    [/href="\/pages\/privacy-test\.html"/gi, 'href="/privacy-policy"'],
    [/href="\/pages\/blog-test\.html"/gi, 'href="/blog/"'],
    [/href="\/pages\/newsletter-test\.html"/gi, 'href="/pages/newsletter/"'],
    [/href="\/pages\/products-test\.html"/gi, 'href="/products/"'],
    [/href="home-test\.html"/g, 'href="/"'],
    [/href="shop-test\.html"/g, 'href="/products/"'],
    [/href="cart-test\.html"/g, 'href="/cart"'],
    [/href="about-test\.html"/g, 'href="/about"'],
    [/href="contact-test\.html"/g, 'href="/contact"'],
    [/href="faq-test\.html"/g, 'href="/faq"'],
    [/href="shipping-test\.html"/g, 'href="/pages/shipping/shipping-returns.html"'],
    [/href="payment-test\.html"/g, 'href="/payment"'],
    [/href="privacy-test\.html"/g, 'href="/privacy-policy"'],
    [/href="blog-test\.html"/g, 'href="/blog/"'],
    [/href="product-test\.html\?id=([^"]+)"/g, (_, id) => `href="${productTestHref(id)}"`],
    [/src="\.\.\/\.\.\/assets\//g, 'src="/assets/'],
    [/href="\.\.\/\.\.\/assets\//g, 'href="/assets/'],
    [/src="\.\.\/assets\//g, 'src="/assets/'],
    [/href="\.\.\/assets\//g, 'href="/assets/'],
    [/src="\.\.\/\.\.\/documents\//g, 'src="/documents/'],
    [/href="\.\.\/\.\.\/documents\//g, 'href="/documents/'],
    [/href="\/pages\/shop\/cart\.html"/g, 'href="/cart"'],
    [/href="\/pages\/about\/about\.html"/g, 'href="/about"'],
    [/href="\/pages\/contact\/contact\.html"/g, 'href="/contact"'],
    [/href="\/pages\/faq\/faq\.html"/g, 'href="/faq"'],
    [/website2\.0\//g, ''],
  ];

  for (const [re, rep] of simple) out = out.replace(re, rep);

  return out;
}
