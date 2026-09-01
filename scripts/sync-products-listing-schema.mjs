#!/usr/bin/env node
/**
 * Inject Product + CollectionPage JSON-LD into products/index.html from
 * shared/schema/products-listing.json
 *
 * Run: node scripts/sync-products-listing-schema.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'site');
const SCHEMA_PATH = path.join(SITE, 'shared/schema/products-listing.json');
const HTML_PATH = path.join(SITE, 'products/index.html');

const RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'AU',
  returnPolicyCountry: 'AU',
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 7,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/FreeReturn',
  returnPolicyUrl: 'https://nutrithrive.com.au/pages/shipping/shipping-returns',
};

const AU_SHIPPING = {
  '@type': 'OfferShippingDetails',
  name: 'Australia — standard shipping from published rate table; free on orders AUD 49+',
  shippingRate: { '@type': 'MonetaryAmount', value: 9.69, currency: 'AUD' },
  shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'AU' },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 2, unitCode: 'DAY' },
    transitTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 10, unitCode: 'DAY' },
  },
};

function buildProduct(p) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': p['@id'],
    name: p.name,
    sku: p.sku,
    url: p.url,
    image: [p.image],
    description: p.description,
    brand: { '@type': 'Brand', name: 'NutriThrive', url: 'https://nutrithrive.com.au/' },
    offers: {
      '@type': 'Offer',
      url: p.url,
      sku: p.sku,
      priceCurrency: 'AUD',
      price: p.price,
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'NutriThrive', url: 'https://nutrithrive.com.au' },
      hasMerchantReturnPolicy: RETURN_POLICY,
      shippingDetails: AU_SHIPPING,
    },
  };
}

function scriptBlock(obj) {
  return `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;
}

function buildSchemaBlock() {
  const { collectionPage, products } = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
  const parts = [
    '<!-- Products listing schema — source: shared/schema/products-listing.json (sync: node scripts/sync-products-listing-schema.mjs) -->',
    ...products.map((p) => scriptBlock(buildProduct(p))),
    scriptBlock(collectionPage),
  ];
  return parts.join('\n');
}

const LEGACY_BOTTOM_RE =
  /[\s]*<!-- CollectionPage Schema -->[\s\S]*?<script type="application\/ld\+json">[\s\S]*?"@type":\s*"CollectionPage"[\s\S]*?<\/script>[\s]*/;

const LEGACY_INLINE_CART_RE =
  /<script>\s*\/\/ Product weights mapping[\s\S]*?function addProductToCart[\s\S]*?<\/script>\s*/;

const EXISTING_BLOCK_RE =
  /<!-- Products listing schema[\s\S]*?<script type="application\/ld\+json">\s*\{[\s\S]*?"@type":\s*"CollectionPage"[\s\S]*?<\/script>\s*/;

function main() {
  let html = fs.readFileSync(HTML_PATH, 'utf8');
  const replacement = buildSchemaBlock();

  html = html.replace(LEGACY_BOTTOM_RE, '\n');
  html = html.replace(LEGACY_INLINE_CART_RE, '\n');

  if (html.includes('<!-- Products listing schema')) {
    html = html.replace(EXISTING_BLOCK_RE, `${replacement}\n`);
  } else {
    html = html.replace('\n</head>', `\n${replacement}\n</head>`);
  }

  if (!html.includes('products-listing.min.js')) {
    html = html.replace(
      '<script src="/scripts/global/script.min.js" defer></script>',
      '<script src="/scripts/global/script.min.js" defer></script>\n    <script src="/scripts/pages/products-listing.min.js" defer></script>',
    );
  }

  fs.writeFileSync(HTML_PATH, html, 'utf8');
  console.log(`Synced products listing schema into ${path.relative(ROOT, HTML_PATH)}`);
}

main();
