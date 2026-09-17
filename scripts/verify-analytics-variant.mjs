import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Exercise both DOM-ready paths without loading tags or sending GA requests.
for (const file of ['storefront/js/site.js', 'site/assets/js/storefront/site.js']) {
  const source = readFileSync(file, 'utf8');
  const variantBinding = source.slice(source.indexOf('function bindPdpVariant()'), source.indexOf('const OFFER_KEY'));
  const startup = source.slice(source.lastIndexOf('if (document.readyState === "loading")'));
  for (const readyState of ['loading', 'complete']) {
    for (const requested of [null, 'moringa-powder', 'moringa-200g', 'moringa-400g', 'unknown']) {
      let product = 'moringa-powder';
      const views = [];
      const select = {
        value: product,
        options: ['moringa-powder', 'moringa-200g', 'moringa-400g'].map(value => ({ value })),
        addEventListener() {},
      };
      const context = {
        URLSearchParams,
        location: { search: requested ? `?v=${requested}` : '' },
        document: {
          readyState,
          getElementById: () => select,
          addEventListener: (_name, callback) => callback(),
        },
        applyPdpVariant: id => { product = id; },
        bindHeader: () => views.push(product),
        bindGrowthFeatures() {}, bindJournalSearch() {}, bindArticleReadingDepth() {},
        emitCartChange() {}, setTimeout() {},
      };
      vm.runInNewContext(variantBinding + startup, context);
      const expected = select.options.some(option => option.value === requested) ? requested : 'moringa-powder';
      assert.deepEqual(views, [expected], `${file}: ${readyState}, ${requested}`);
    }
  }
}
console.log('Analytics variant startup: 20 cases passed; requested size precedes product-view tracking.');
