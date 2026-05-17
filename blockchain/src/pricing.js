const { getProduct } = require('./catalog');
const ShippingRates = require('./shipping');
const config = require('./config');

function buildOrderQuote(countryCode, items) {
  if (!countryCode || typeof countryCode !== 'string') {
    return { ok: false, error: 'Country is required' };
  }
  if (!Array.isArray(items) || items.length < 1) {
    return { ok: false, error: 'Cart is empty' };
  }

  const cc = countryCode.trim().toUpperCase();
  const lineItems = [];
  let subtotal = 0;

  for (const raw of items) {
    const id = String(raw?.id ?? '').trim();
    const quantity = parseInt(raw?.quantity ?? 1, 10);
    if (!id || !Number.isFinite(quantity) || quantity < 1 || quantity > 99) continue;

    const product = getProduct(id);
    if (!product) {
      return { ok: false, error: `Unknown product: ${id}` };
    }

    const lineTotal = product.price * quantity;
    subtotal += lineTotal;
    lineItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      weight: product.weight,
      quantity,
      lineTotal: parseFloat(lineTotal.toFixed(2)),
    });
  }

  if (lineItems.length === 0) {
    return { ok: false, error: 'No valid items in cart' };
  }

  subtotal = parseFloat(subtotal.toFixed(2));
  const cartForShipping = lineItems.map((item) => ({
    id: item.id,
    name: item.name,
    weight: item.weight,
    quantity: item.quantity,
  }));

  const shippingRaw = ShippingRates.calculate(cc, cartForShipping, subtotal);
  if (shippingRaw === null) {
    return { ok: false, error: 'Shipping not available for this country' };
  }

  const shipping = parseFloat(Number(shippingRaw).toFixed(2));
  const baseTotal = parseFloat((subtotal + shipping).toFixed(2));
  const feePercent = config.cryptoFeePercent;
  const cryptoFee = parseFloat((baseTotal * (feePercent / 100)).toFixed(2));
  const total = parseFloat((baseTotal + cryptoFee).toFixed(2));
  const countryName = ShippingRates.getCountryName(cc);

  return {
    ok: true,
    countryCode: cc,
    countryName,
    currency: 'AUD',
    lineItems,
    subtotal,
    shipping,
    shippingDisplay: shipping === 0 ? 'Free' : shipping,
    baseTotal,
    cryptoFee,
    cryptoFeePercent: feePercent,
    total,
    orderSummary: lineItems
      .map((i) => `${i.quantity}× ${i.name} — $${i.lineTotal.toFixed(2)}`)
      .join('\n'),
  };
}

module.exports = { buildOrderQuote };
