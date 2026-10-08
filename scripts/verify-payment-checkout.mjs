#!/usr/bin/env node
// Run after the storefront and asset builds. No PayPal account or network calls.
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { handler as createOrder } from '../netlify/functions/paypal-create-order.js';
import { handler as captureOrder } from '../netlify/functions/paypal-capture-order.js';
import { getClientIp, isRateLimited } from '../netlify/functions/checkout-request.js';
import {
  mergeOrderDetails,
  parseCaptureForEmail,
} from '../netlify/functions/order-email.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const source = read('storefront/js/payment-page.js');
const built = read('site/assets/js/storefront/payment-page.js');
const minified = read('site/assets/js/storefront/payment-page.min.js');
const page = read('site/pages/shop/payment.html');

assert.equal(built, source, 'deployed payment source must match its storefront source');
for (const code of [built, minified]) {
  assert.match(code, /enable-funding/, 'card funding must remain enabled');
  assert.match(code, /paypal-create-order/, 'create-order call must remain available');
  assert.match(code, /paypal-capture-order/, 'capture-order call must remain available');
  assert.match(code, /applepay/, 'Apple Pay SDK component must remain enabled');
  assert.match(code, /paypal\.Applepay/, 'Apple Pay button path must remain wired');
}
assert.match(source, /paypal\.FUNDING\.CARD/, 'card button must still be mounted');
assert.match(page, /id="paypal-card-container"/, 'card button mount must exist');
assert.match(page, /id="applepay-container"/, 'Apple Pay button mount must exist');
assert.match(source, /apple-pay-sdk\.js/, 'Apple Pay JS SDK must load');
assert.match(page, /applepay\.cdn-apple\.com\/jsapi/, 'payment page must preload Apple Pay JS SDK');
assert.match(source, /requireShipping:\s*true/, 'Apple Pay must require a delivery address');
assert.match(source, /mapAppleShippingContact/, 'Apple Pay must map wallet shipping contacts');
for (const asset of [
  'runtime-paypal-client-config.min.js',
  'runtime-paypal-sdk-loader.min.js',
  'runtime-shipping-rates.min.js',
  'payment-page.min.js',
]) {
  assert.match(page, new RegExp(`/assets/js/storefront/${asset.replaceAll('.', '\\.')}\\?v=`));
  assert.ok(fs.existsSync(path.join(root, 'site/assets/js/storefront', asset)), `${asset} must exist`);
}

assert.equal(getClientIp({ headers: {
  'x-nf-client-connection-ip': '203.0.113.1',
  'x-forwarded-for': '198.51.100.2',
} }), '203.0.113.1');
for (let attempt = 0; attempt < 20; attempt++) {
  assert.equal(isRateLimited('payment-verification-test'), false);
}
assert.equal(isRateLimited('payment-verification-test'), true);
for (const handler of [createOrder, captureOrder]) {
  assert.equal((await handler({ httpMethod: 'POST', headers: { origin: 'https://bad.invalid' } })).statusCode, 403);
  assert.equal((await handler({ httpMethod: 'GET', headers: { origin: 'https://nutrithrive.com.au' } })).statusCode, 405);
  assert.equal((await handler({ httpMethod: 'OPTIONS', headers: { origin: 'https://nutrithrive.com.au' } })).statusCode, 200);
}

const originalFetch = globalThis.fetch;
const previousEnv = Object.fromEntries(
  [
    'PAYPAL_BASE', 'PAYPAL_CLIENT_ID', 'PAYPAL_CLIENT_SECRET',
    'SMTP_USER', 'SMTP_PASS', 'WEB3FORMS_ACCESS_KEY',
  ].map((key) => [key, process.env[key]]),
);
process.env.PAYPAL_BASE = 'https://paypal-test.invalid';
process.env.PAYPAL_CLIENT_ID = 'test-client';
process.env.PAYPAL_CLIENT_SECRET = 'test-secret';
delete process.env.SMTP_USER;
delete process.env.SMTP_PASS;
delete process.env.WEB3FORMS_ACCESS_KEY;

let orderCount = 0;
globalThis.fetch = async (url, options) => {
  if (String(url).endsWith('/v1/oauth2/token')) {
    return { ok: true, json: async () => ({ access_token: 'test-token' }) };
  }
  assert.ok(String(url).endsWith('/v2/checkout/orders'), `unexpected request: ${url}`);
  assert.equal(options.method, 'POST');
  assert.equal(options.headers.Authorization, 'Bearer test-token');
  const order = JSON.parse(options.body);
  assert.equal(order.intent, 'CAPTURE');
  assert.ok(!Object.hasOwn(order, 'payment_source'), 'server must let the SDK choose PayPal or card');
  assert.ok(
    order.application_context.shipping_preference === 'GET_FROM_FILE' ||
      order.application_context.shipping_preference === 'SET_PROVIDED_ADDRESS',
    'shipping preference must be wallet or provided address',
  );
  return {
    ok: true,
    json: async () => ({ id: `TESTORDER${++orderCount}` }),
    request: order,
  };
};

async function checkCart(items, expectedTotal, expectedShipping, expectedDiscount = '0.00') {
  let sentOrder;
  const fetchMock = globalThis.fetch;
  globalThis.fetch = async (...args) => {
    const response = await fetchMock(...args);
    if (response.request) sentOrder = response.request;
    return response;
  };
  const originalLog = console.log;
  console.log = () => {};
  try {
    const response = await createOrder({
      httpMethod: 'POST',
      headers: { origin: 'https://nutrithrive.com.au', 'x-nf-client-connection-ip': `test-${orderCount}` },
      body: JSON.stringify({ countryCode: 'AU', items }),
    });
    assert.equal(response.statusCode, 200, response.body);
    assert.ok(JSON.parse(response.body).captureToken);
    const amount = sentOrder.purchase_units[0].amount;
    if (expectedTotal !== null) assert.equal(amount.value, expectedTotal);
    if (expectedShipping !== null) assert.equal(amount.breakdown.shipping.value, expectedShipping);
    assert.equal(amount.breakdown.discount?.value || '0.00', expectedDiscount);
    assert.equal(amount.breakdown.item_total.currency_code, 'AUD');
    return amount.breakdown.item_total.value;
  } finally {
    console.log = originalLog;
    globalThis.fetch = fetchMock;
  }
}

try {
  await checkCart([{ id: 'moringa-powder', quantity: 1 }], '20.69', '9.69');
  await checkCart([
    { id: 'moringa-400g', quantity: 2 },
    { id: 'moringa-powder', quantity: 1 },
  ], '81.00', '0.00');
  await checkCart([{ id: 'moringa-variation-1', quantity: 4 }], '105.00', '0.00', '35.00');
  {
    let sentOrder;
    const fetchMock = globalThis.fetch;
    globalThis.fetch = async (...args) => {
      const response = await fetchMock(...args);
      if (response.request) sentOrder = response.request;
      return response;
    };
    const response = await createOrder({
      httpMethod: 'POST',
      headers: { origin: 'https://nutrithrive.com.au', 'x-nf-client-connection-ip': 'apple-pay-ship' },
      body: JSON.stringify({
        countryCode: 'AU',
        items: [{ id: 'moringa-powder', quantity: 1 }],
        email: 'alex@example.com',
        requireShipping: true,
        shipping: {
          fullName: 'Alex Buyer',
          addressLine1: '1 Ridley Place',
          city: 'Truganina',
          state: 'VIC',
          postalCode: '3029',
          countryCode: 'AU',
          email: 'alex@example.com',
          phone: '0438201419',
        },
      }),
    });
    globalThis.fetch = fetchMock;
    assert.equal(response.statusCode, 200, response.body);
    assert.equal(sentOrder.application_context.shipping_preference, 'SET_PROVIDED_ADDRESS');
    assert.equal(sentOrder.payer.email_address, 'alex@example.com');
    assert.equal(sentOrder.purchase_units[0].shipping.name.full_name, 'Alex Buyer');
    assert.equal(sentOrder.purchase_units[0].shipping.address.postal_code, '3029');
    assert.equal(sentOrder.purchase_units[0].shipping.email_address, 'alex@example.com');
    assert.equal(sentOrder.purchase_units[0].items[0].name, '100g Moringa');
    assert.ok(sentOrder.purchase_units[0].invoice_id.startsWith('NT-'));
  }
  {
    const missingShip = await createOrder({
      httpMethod: 'POST',
      headers: { origin: 'https://nutrithrive.com.au', 'x-nf-client-connection-ip': 'apple-pay-missing-ship' },
      body: JSON.stringify({
        countryCode: 'AU',
        items: [{ id: 'moringa-powder', quantity: 1 }],
        requireShipping: true,
      }),
    });
    assert.equal(missingShip.statusCode, 400);
    assert.match(missingShip.body, /delivery name and address/i);
  }

  {
    const sparseCapture = {
      id: 'APPLEPAYORDER1',
      status: 'COMPLETED',
      payment_source: { apple_pay: { email_address: 'wallet@example.com' } },
      purchase_units: [{
        amount: { currency_code: 'AUD', value: '20.69' },
        payments: { captures: [{ amount: { currency_code: 'AUD', value: '20.69' } }] },
      }],
    };
    const fullOrder = {
      id: 'APPLEPAYORDER1',
      payer: { name: { given_name: 'Alex', surname: 'Buyer' } },
      purchase_units: [{
        invoice_id: 'NT-APPLE-1',
        items: [{ name: '100g Moringa', quantity: '1', unit_amount: { currency_code: 'AUD', value: '11.00' } }],
        amount: {
          currency_code: 'AUD',
          value: '20.69',
          breakdown: {
            item_total: { currency_code: 'AUD', value: '11.00' },
            shipping: { currency_code: 'AUD', value: '9.69' },
          },
        },
        shipping: {
          name: { full_name: 'Alex Buyer' },
          email_address: 'alex@example.com',
          address: {
            address_line_1: '1 Ridley Place',
            admin_area_2: 'Truganina',
            admin_area_1: 'VIC',
            postal_code: '3029',
            country_code: 'AU',
          },
        },
      }],
    };
    const merged = mergeOrderDetails(sparseCapture, fullOrder);
    const details = parseCaptureForEmail(merged, 'APPLEPAYORDER1');
    assert.equal(details.orderId, 'APPLEPAYORDER1');
    assert.equal(details.invoiceId, 'NT-APPLE-1');
    assert.equal(details.hasItems, true);
    assert.equal(details.items[0].name, '100g Moringa');
    assert.equal(details.hasShippingAddress, true);
    assert.match(details.shippingAddress, /Ridley Place/);
    assert.equal(details.customerEmail, 'alex@example.com');
    assert.equal(details.customerName, 'Alex Buyer');
    assert.equal(details.totalValue, '20.69');
  }
  // Client prices are duplicated in the server catalog; catch drift before deploy.
  const catalogContext = { window: {} };
  vm.runInNewContext(read('storefront/js/catalog.js'), catalogContext);
  for (const product of catalogContext.window.NT_PRODUCTS) {
    const price = Number(product.price).toFixed(2);
    const subtotal = await checkCart([{ id: product.id, quantity: 1 }], null, null);
    assert.equal(subtotal, price, `${product.id} differs between client and PayPal server`);
  }
  const orderID = 'TESTORDER12345';
  const captureToken = createHmac('sha256', 'test-secret').update(orderID).digest('hex');
  const invalidToken = await captureOrder({
    httpMethod: 'POST',
    headers: { origin: 'https://nutrithrive.com.au', 'x-nf-client-connection-ip': 'capture-invalid' },
    body: JSON.stringify({ orderID, captureToken: '0'.repeat(64) }),
  });
  assert.equal(invalidToken.statusCode, 403);
  let sawCapturePrefer = false;
  let sawOrderGet = false;
  globalThis.fetch = async (url, options = {}) => {
    if (String(url).endsWith('/v1/oauth2/token')) {
      return { ok: true, json: async () => ({ access_token: 'test-token' }) };
    }
    if (String(url).endsWith(`/v2/checkout/orders/${orderID}/capture`)) {
      sawCapturePrefer = options.headers?.Prefer === 'return=representation';
      return {
        ok: true,
        json: async () => ({
          id: orderID,
          status: 'COMPLETED',
          // Sparse capture (historical Apple Pay failure mode): payment only, no items/address/email.
          purchase_units: [{
            amount: { currency_code: 'AUD', value: '20.69' },
            payments: { captures: [{ amount: { currency_code: 'AUD', value: '20.69' } }] },
          }],
        }),
      };
    }
    if (String(url).endsWith(`/v2/checkout/orders/${orderID}`)) {
      sawOrderGet = true;
      assert.equal(options.headers?.Prefer, 'return=representation');
      return {
        ok: true,
        json: async () => ({
          id: orderID,
          payer: { email_address: 'buyer@example.com', name: { given_name: 'Sam', surname: 'Lee' } },
          purchase_units: [{
            invoice_id: 'NT-TEST-1',
            items: [{ name: '100g Moringa', quantity: '1', unit_amount: { currency_code: 'AUD', value: '11.00' } }],
            amount: {
              currency_code: 'AUD',
              value: '20.69',
              breakdown: {
                item_total: { currency_code: 'AUD', value: '11.00' },
                shipping: { currency_code: 'AUD', value: '9.69' },
              },
            },
            shipping: {
              name: { full_name: 'Sam Lee' },
              address: {
                address_line_1: '1 Ridley Place',
                admin_area_2: 'Truganina',
                admin_area_1: 'VIC',
                postal_code: '3029',
                country_code: 'AU',
              },
            },
          }],
        }),
      };
    }
    throw new Error(`unexpected request: ${url}`);
  };
  const originalError = console.error;
  const originalWarn = console.warn;
  console.error = () => {};
  console.warn = () => {};
  try {
    const capture = await captureOrder({
      httpMethod: 'POST',
      headers: { origin: 'https://nutrithrive.com.au', 'x-nf-client-connection-ip': 'capture-valid' },
      body: JSON.stringify({ orderID, captureToken }),
    });
    assert.equal(capture.statusCode, 200, capture.body);
    const body = JSON.parse(capture.body);
    assert.equal(body.status, 'COMPLETED');
    assert.equal(sawCapturePrefer, true, 'capture must request full representation');
    assert.equal(sawOrderGet, true, 'sparse capture must GET full order for email fields');
    assert.equal(body.purchase_units[0].items[0].name, '100g Moringa');
    assert.equal(body.purchase_units[0].shipping.address.postal_code, '3029');
    assert.equal(body.payer.email_address, 'buyer@example.com');
  } finally {
    console.error = originalError;
    console.warn = originalWarn;
  }
  console.log('Payment checkout verification passed (assets, Apple Pay shipping/email, pricing, capture enrichment).');
} finally {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(previousEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}
