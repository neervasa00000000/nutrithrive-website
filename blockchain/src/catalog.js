/** Authoritative product catalog (AUD). Matches PayPal server pricing. */
const PRODUCTS = {
  'moringa-powder': { name: '100g Moringa', price: 11.0, weight: 100 },
  'moringa-200g': { name: '200g Moringa', price: 21.5, weight: 200 },
  'moringa-400g': { name: '3 + 1 = 400g Moringa', price: 35.0, weight: 400 },
  'moringa-soap': { name: 'Moringa Soap', price: 7.0, weight: 95 },
  'moringa-soap-combo': { name: 'Moringa 100g + Soap 95g', price: 17.0, weight: 195 },
  'curry-leaves': { name: 'Dried Curry Leaves', price: 7.0, weight: 30 },
  'black-tea': { name: 'Darjeeling Black Tea', price: 7.5, weight: 100 },
  'combo-pack': { name: 'Premium Combo Pack', price: 17.0, weight: 130 },
  'moringa-variation-1': { name: '3 + 1 = 400g Moringa', price: 35.0, weight: 400 },
  'moringa-variation-2': { name: '100g Moringa', price: 11.0, weight: 100 },
  'moringa-variation-3': { name: 'Combo Moringa + Dried Curry Leaves', price: 17.0, weight: 130 },
  'moringa-variation-4': { name: '200g Moringa', price: 21.5, weight: 200 },
  'moringa-variation-5': { name: '30g Dried Curry Leaves', price: 7.0, weight: 30 },
  'moringa-variation-6': { name: 'Moringa 100g + Soap 95g', price: 17.0, weight: 195 },
};

const ALIASES = {
  'moringa-powder-100g': 'moringa-powder',
  'moringa-powder-200g': 'moringa-200g',
  'curry-leaves-30g': 'curry-leaves',
};

function resolveProductId(id) {
  const key = String(id || '').trim();
  return ALIASES[key] || key;
}

function getProduct(id) {
  const resolved = resolveProductId(id);
  return PRODUCTS[resolved] ? { id: resolved, ...PRODUCTS[resolved] } : null;
}

module.exports = { PRODUCTS, getProduct, resolveProductId };
