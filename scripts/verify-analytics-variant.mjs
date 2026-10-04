import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function variantIdFromPathFor(pathname) {
  const path = String(pathname || '').replace(/\/+$/, '');
  if (path.endsWith('/100g')) return 'moringa-powder';
  if (path.endsWith('/200g')) return 'moringa-200g';
  if (path.endsWith('/400g')) return 'moringa-400g';
  return null;
}

// Exercise both DOM-ready paths without loading tags or sending GA requests.
for (const file of ['storefront/js/site.js', 'site/assets/js/storefront/site.js']) {
  const source = readFileSync(file, 'utf8');
  const variantBinding = source.slice(source.indexOf('function bindPdpVariant()'), source.indexOf('const OFFER_KEY'));
  const startup = source.slice(source.lastIndexOf('if (document.readyState === "loading")'));
  const cases = [
    { pathname: '/products/moringa-powder/', search: '', hydrate: false },
    { pathname: '/products/moringa-powder/', search: '?v=moringa-powder', hydrate: true, expected: 'moringa-powder' },
    { pathname: '/products/moringa-powder/', search: '?v=moringa-200g', hydrate: true, expected: 'moringa-200g' },
    { pathname: '/products/moringa-powder/', search: '?v=moringa-400g', hydrate: true, expected: 'moringa-400g' },
    { pathname: '/products/moringa-powder/', search: '?v=unknown', hydrate: false },
    { pathname: '/products/moringa-powder/100g/', search: '', hydrate: false },
    { pathname: '/products/moringa-powder/200g/', search: '', hydrate: false },
  ];
  for (const readyState of ['loading', 'complete']) {
    for (const testCase of cases) {
      let product = 'moringa-powder';
      const views = [];
      const select = {
        value: product,
        options: ['moringa-powder', 'moringa-200g', 'moringa-400g'].map(value => ({ value })),
        addEventListener() {},
      };
      const context = {
        URLSearchParams,
        location: { pathname: testCase.pathname, search: testCase.search },
        document: {
          readyState,
          getElementById: () => select,
          addEventListener: (_name, callback) => callback(),
        },
        variantIdFromPath: () => variantIdFromPathFor(testCase.pathname),
        applyPdpVariant: id => { product = id; },
        bindHeader: () => views.push(product),
        bindGrowthFeatures() {}, bindJournalSearch() {}, bindArticleReadingDepth() {},
        emitCartChange() {}, setTimeout() {},
      };
      vm.runInNewContext(variantBinding + startup, context);
      // Clean size paths are server-rendered; only legacy ?v= hydrates before view tracking.
      const expected = testCase.hydrate ? testCase.expected : 'moringa-powder';
      assert.deepEqual(views, [expected], `${file}: ${readyState}, ${testCase.pathname}${testCase.search}`);
    }
  }
}
console.log('Analytics variant startup: path and query cases passed; requested size precedes product-view tracking.');
