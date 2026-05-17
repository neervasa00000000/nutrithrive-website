const path = require('path');
const crypto = require('crypto');
const express = require('express');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const db = require('./db');
const { validateCreateOrder, validateUpdateCrypto, formatBillingAddress } = require('./validators');
const { buildOrderQuote } = require('./pricing');
const { getCryptoAmounts } = require('./crypto-rates');
const ShippingRates = require('./shipping');

const app = express();

app.use(express.json({ limit: '32kb' }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

function generatePaymentId() {
  return `PAY-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
}

app.get('/api/products', (_req, res) => {
  const { PRODUCTS } = require('./catalog');
  res.json({
    products: Object.entries(PRODUCTS).map(([id, p]) => ({
      id,
      name: p.name,
      price: p.price,
      weight: p.weight,
    })),
  });
});

app.get('/api/countries', (_req, res) => {
  try {
    const countries = ShippingRates.getCountryList();
    res.json({ countries });
  } catch (err) {
    console.error('countries:', err);
    res.status(500).json({ error: 'Failed to load countries' });
  }
});

app.post('/api/calculate-order', (req, res) => {
  try {
    const { countryCode, items } = req.body || {};
    const quote = buildOrderQuote(countryCode, items);
    if (!quote.ok) return res.status(400).json({ error: quote.error });
    res.json(quote);
  } catch (err) {
    console.error('calculate-order:', err);
    res.status(500).json({ error: 'Failed to calculate order' });
  }
});

app.get('/api/crypto-amounts', async (req, res) => {
  try {
    const aud = parseFloat(req.query.aud);
    const result = await getCryptoAmounts(aud);
    if (!result.ok) return res.status(400).json({ error: result.error });
    res.json(result);
  } catch (err) {
    console.error('crypto-amounts:', err);
    res.status(502).json({ error: 'Could not fetch live crypto rates' });
  }
});

app.get('/api/payment-config', (_req, res) => {
  res.json({
    wallets: {
      eth: config.wallets.eth,
      usdc: config.wallets.usdc,
      usdt: config.wallets.usdt,
      sol: config.wallets.sol,
      btc: config.wallets.btc,
    },
  });
});

app.post('/api/create-order', async (req, res) => {
  try {
    const validation = validateCreateOrder(req.body);
    if (!validation.ok) {
      return res.status(400).json({ error: validation.errors.join(', ') });
    }

    const { customer_name, customer_email, phone, billing, items } = validation.data;
    const quote = buildOrderQuote(billing.country_code, items);
    if (!quote.ok) return res.status(400).json({ error: quote.error });

    const delivery_address = formatBillingAddress({
      ...billing,
      country_name: quote.countryName,
    });
    const order_details = JSON.stringify({
      items: quote.lineItems,
      subtotal: quote.subtotal,
      shipping: quote.shipping,
      baseTotal: quote.baseTotal,
      cryptoFee: quote.cryptoFee,
      cryptoFeePercent: quote.cryptoFeePercent,
      total: quote.total,
      countryCode: quote.countryCode,
      summary: quote.orderSummary,
    });

    const payment_id = generatePaymentId();

    await db.query(
      `INSERT INTO orders (
        payment_id, customer_name, customer_email, phone,
        delivery_address, order_details, amount_aud
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [payment_id, customer_name, customer_email, phone, delivery_address, order_details, quote.total]
    );

    res.json({
      payment_id,
      subtotal: quote.subtotal,
      shipping: quote.shipping,
      total: quote.total,
      currency: quote.currency,
    });
  } catch (err) {
    console.error('create-order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.post('/api/update-crypto', async (req, res) => {
  try {
    const validation = validateUpdateCrypto(req.body);
    if (!validation.ok) {
      return res.status(400).json({ error: validation.errors.join(', ') });
    }

    const { payment_id, crypto_type, crypto_amount } = validation.data;
    const order = await db.getOrderByPaymentId(payment_id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.payment_status !== 'pending') {
      return res.status(400).json({ error: 'Order is no longer pending' });
    }

    await db.query(
      'UPDATE orders SET crypto_type = ?, crypto_amount = ? WHERE payment_id = ?',
      [crypto_type, crypto_amount, payment_id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('update-crypto:', err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

app.get('/api/check-payment/:payment_id', async (req, res) => {
  try {
    const order = await db.getOrderByPaymentId(req.params.payment_id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ status: order.payment_status });
  } catch (err) {
    console.error('check-payment:', err);
    res.status(500).json({ error: 'Failed to check payment' });
  }
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(config.port, () => {
  console.log(`Crypto checkout API running on http://localhost:${config.port}`);
});
