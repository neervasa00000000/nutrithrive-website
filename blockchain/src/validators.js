const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAYMENT_ID_RE = /^PAY-[A-F0-9]{12}$/;
const POSTCODE_RE = /^[A-Za-z0-9][A-Za-z0-9\s-]{2,11}$/;

function trim(str, max) {
  const s = String(str || '').trim();
  return max ? s.slice(0, max) : s;
}

function formatBillingAddress(b) {
  const lines = [
    `${b.first_name} ${b.last_name}`.trim(),
    b.address_line_1,
    b.address_line_2,
    b.city,
    b.county,
    b.postcode,
    b.country_name || b.country_code,
    `${b.phone_dial} ${b.phone}`.trim(),
  ].filter(Boolean);
  return lines.join('\n');
}

function validateCreateOrder(body) {
  const errors = [];
  const billing = {
    country_code: trim(body.country_code, 2).toUpperCase(),
    first_name: trim(body.first_name, 100),
    last_name: trim(body.last_name, 100),
    address_line_1: trim(body.address_line_1, 200),
    address_line_2: trim(body.address_line_2, 200),
    city: trim(body.city, 100),
    county: trim(body.county, 100),
    postcode: trim(body.postcode, 20),
    phone_dial: trim(body.phone_dial, 6) || '+44',
    phone: trim(body.phone, 30),
  };

  const customer_email = trim(body.customer_email, 255);
  const items = Array.isArray(body.items) ? body.items : [];

  if (!billing.country_code || billing.country_code.length !== 2) {
    errors.push('country is required');
  }
  if (!billing.first_name) errors.push('first name is required');
  if (!billing.last_name) errors.push('last name is required');
  if (!billing.address_line_1) errors.push('address line 1 is required');
  if (!billing.city) errors.push('town/city is required');
  if (!billing.postcode || !POSTCODE_RE.test(billing.postcode)) {
    errors.push('valid postcode is required');
  }
  if (!billing.phone) errors.push('mobile number is required');
  if (!customer_email || !EMAIL_RE.test(customer_email)) {
    errors.push('valid email is required');
  }
  if (items.length === 0) errors.push('cart items are required');

  if (errors.length) return { ok: false, errors };

  const customer_name = `${billing.first_name} ${billing.last_name}`.trim();
  const phone = `${billing.phone_dial} ${billing.phone}`.trim();

  return {
    ok: true,
    data: {
      customer_name,
      customer_email,
      phone,
      billing,
      items,
      formatBillingAddress: () => formatBillingAddress({ ...billing, country_name: body.country_name }),
    },
  };
}

function validateUpdateCrypto(body) {
  const errors = [];
  const payment_id = trim(body.payment_id, 20);
  const crypto_type = trim(body.crypto_type, 10).toUpperCase();
  const crypto_amount = parseFloat(body.crypto_amount);
  const allowed = ['ETH', 'USDC', 'USDT', 'SOL', 'BTC'];

  if (!payment_id || !PAYMENT_ID_RE.test(payment_id)) errors.push('invalid payment_id');
  if (!allowed.includes(crypto_type)) errors.push('invalid crypto_type');
  if (!Number.isFinite(crypto_amount) || crypto_amount <= 0) errors.push('invalid crypto_amount');

  if (errors.length) return { ok: false, errors };
  return { ok: true, data: { payment_id, crypto_type, crypto_amount } };
}

module.exports = {
  validateCreateOrder,
  validateUpdateCrypto,
  formatBillingAddress,
  PAYMENT_ID_RE,
};
