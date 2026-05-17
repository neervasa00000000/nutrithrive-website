const CART_KEY = 'nutrithrive_cart';
const PRICE_REFRESH_MS = 15_000;

let cartItems = [];
let wallets = {};
let currentPaymentId = null;
let selectedCrypto = null;
let orderData = null;
let paymentPollTimer = null;
let priceRefreshTimer = null;
let quote = null;
let orderTotalAud = 0;
let latestCrypto = null;

const $ = (id) => document.getElementById(id);
const formError = $('form-error');

/** Local dev :3000, production via Netlify /api/crypto/* */
function api(path) {
  let p = path.startsWith('/') ? path : `/${path}`;
  if (!p.startsWith('/api/')) p = `/api${p}`;
  if (
    (location.hostname === 'localhost' || location.hostname === '127.0.0.1') &&
    location.port === '3000'
  ) {
    return p;
  }
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    return `http://localhost:3000${p}`;
  }
  return `/api/crypto${p.slice(4)}`;
}

function showError(msg) {
  formError.textContent = msg;
  formError.style.display = 'block';
}

function clearError() {
  formError.textContent = '';
  formError.style.display = 'none';
}

function money(n) {
  return `$${Number(n).toFixed(2)} AUD`;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function readCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const cart = JSON.parse(raw);
    return (cart.items || []).map((item) => ({
      id: item.id,
      quantity: parseInt(item.quantity || 1, 10),
    }));
  } catch {
    return [];
  }
}

function readCartFromUrl() {
  const param = new URLSearchParams(window.location.search).get('items');
  if (!param) return [];
  try {
    const decoded = JSON.parse(atob(param));
    return Array.isArray(decoded) ? decoded : [];
  } catch {
    return [];
  }
}

function loadCart() {
  cartItems = readCartFromStorage();
  if (cartItems.length === 0) cartItems = readCartFromUrl();
}

const DIAL_BY_COUNTRY = { GB: '+44', IE: '+353', AU: '+61', NZ: '+64', US: '+1', CA: '+1' };

function updateDialForCountry(code) {
  $('phone-dial').value = DIAL_BY_COUNTRY[code] || '+44';
}

async function loadCountries() {
  const res = await fetch(api('/api/countries'));
  const data = await res.json();
  const select = $('country');
  select.innerHTML = '';
  const urlCountry = new URLSearchParams(window.location.search).get('country');
  const savedCountry = (() => {
    if (urlCountry && urlCountry.length === 2) return urlCountry.toUpperCase();
    try {
      return localStorage.getItem('nutrithrive_shipping_country') || 'GB';
    } catch {
      return 'GB';
    }
  })();
  const sorted = [...(data.countries || [])].sort((a, b) => {
    if (a.code === savedCountry) return -1;
    if (b.code === savedCountry) return 1;
    return a.name.localeCompare(b.name);
  });
  for (const c of sorted) {
    const opt = document.createElement('option');
    opt.value = c.code;
    opt.textContent = c.name;
    if (c.code === savedCountry) opt.selected = true;
    select.appendChild(opt);
  }
  updateDialForCountry(savedCountry);
}

async function loadWallets() {
  const res = await fetch(api('/api/payment-config'));
  const data = await res.json();
  wallets = data.wallets || {};
}

function summaryRow(label, value, extraClass = '') {
  return `<motion class="summary-row ${extraClass}"><span>${label}</span><span>${value}</span></motion>`.replace(
    /motion/g,
    'div'
  );
}

function renderOrderSummary() {
  const box = $('order-summary');
  const empty = $('cart-empty');

  if (!cartItems.length) {
    box.innerHTML = '';
    empty.style.display = 'block';
    $('submit-btn').disabled = true;
    return;
  }

  empty.style.display = 'none';
  $('submit-btn').disabled = false;

  if (!quote) {
    box.innerHTML = '<p class="muted">Calculating…</p>';
    return;
  }

  let html = quote.lineItems
    .map((i) => summaryRow(`${i.quantity}× ${escapeHtml(i.name)}`, money(i.lineTotal)))
    .join('');
  html += summaryRow('Subtotal', money(quote.subtotal));
  html += summaryRow('Shipping', quote.shipping === 0 ? 'Free' : money(quote.shipping));
  if (quote.cryptoFee > 0) {
    html += summaryRow(
      `Crypto payment fee (${quote.cryptoFeePercent}%)`,
      money(quote.cryptoFee)
    );
  }
  html += summaryRow('Total', money(quote.total), 'summary-total');
  html += '<p class="muted">Prices in AUD. Crypto fee included. Rates refresh every 15s.</p>';
  box.innerHTML = html;
}

async function recalculateQuote() {
  if (!cartItems.length) return;
  const countryCode = $('country').value;
  clearError();
  try {
    const res = await fetch(api('/api/calculate-order'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ countryCode, items: cartItems }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not calculate order');
    quote = data;
    renderOrderSummary();
  } catch (err) {
    showError(err.message);
    quote = null;
    renderOrderSummary();
  }
}

function formatRatesStatus(data) {
  const time = new Date(data.updatedAt).toLocaleTimeString();
  const ethRate = data.ratesAud?.eth ? `$${Number(data.ratesAud.eth).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '';
  return `Live rates · updated ${time} · ETH ${ethRate}/AUD · refreshes every ${data.refreshSeconds || 15}s`;
}

function applyCryptoAmounts(data) {
  latestCrypto = data;
  for (const crypto of ['eth', 'sol', 'btc', 'usdc', 'usdt']) {
    const el = $(`${crypto}-amount`);
    if (el && data.amounts[crypto]) {
      el.textContent = data.amounts[crypto];
      el.classList.add('rate-flash');
      setTimeout(() => el.classList.remove('rate-flash'), 600);
    }
  }
  const status = $('rates-status');
  if (status) {
    status.textContent = formatRatesStatus(data);
    status.classList.add('rate-flash');
    setTimeout(() => status.classList.remove('rate-flash'), 600);
  }
}

async function fetchLiveCryptoAmounts(audAmount) {
  const res = await fetch(api(`/api/crypto-amounts?aud=${encodeURIComponent(audAmount)}`));
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not load live crypto rates');
  applyCryptoAmounts(data);
  return data;
}

function stopPriceRefresh() {
  if (priceRefreshTimer) {
    clearInterval(priceRefreshTimer);
    priceRefreshTimer = null;
  }
}

function startPriceRefresh() {
  stopPriceRefresh();
  if (!orderTotalAud) return;

  const tick = async () => {
    try {
      await fetchLiveCryptoAmounts(orderTotalAud);
      if (selectedCrypto && $('payment-details').style.display === 'block') {
        await refreshSelectedPayment();
      }
    } catch (err) {
      const status = $('rates-status');
      if (status) status.textContent = `Rate update failed — retrying… (${err.message})`;
    }
  };

  priceRefreshTimer = setInterval(tick, PRICE_REFRESH_MS);
}

async function refreshSelectedPayment() {
  if (!selectedCrypto || !currentPaymentId) return;
  const amount = $(`${selectedCrypto}-amount`)?.textContent;
  if (!amount || amount === '…') return;

  const response = await fetch(api('/api/update-crypto'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      payment_id: currentPaymentId,
      crypto_type: selectedCrypto.toUpperCase(),
      crypto_amount: parseFloat(amount),
    }),
  });
  const result = await response.json();
  if (!response.ok) return;

  $('final-amount').textContent = `${amount} ${selectedCrypto.toUpperCase()}`;
  const address = wallets[selectedCrypto];
  const qrData =
    selectedCrypto === 'btc'
      ? `bitcoin:${address}?amount=${amount}&label=${currentPaymentId}`
      : address;
  $('payment-qr').src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=250x250`;
}

$('country').addEventListener('change', () => {
  const code = $('country').value;
  try {
    localStorage.setItem('nutrithrive_shipping_country', code);
  } catch {
    /* ignore */
  }
  updateDialForCountry(code);
  recalculateQuote();
});

$('order-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();
  if (!cartItems.length) {
    showError('Your cart is empty. Add products on the shop first.');
    return;
  }
  if (!quote) {
    showError('Could not calculate order total.');
    return;
  }

  const btn = $('submit-btn');
  btn.disabled = true;
  orderData = {
    country_code: $('country').value,
    first_name: $('first-name').value.trim(),
    last_name: $('last-name').value.trim(),
    address_line_1: $('address-line-1').value.trim(),
    address_line_2: $('address-line-2').value.trim(),
    city: $('city').value.trim(),
    county: $('county').value.trim(),
    postcode: $('postcode').value.trim(),
    phone_dial: $('phone-dial').value.trim(),
    phone: $('phone').value.trim(),
    customer_email: $('customer-email').value.trim(),
    items: cartItems,
  };

  try {
    const response = await fetch(api('/api/create-order'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Could not create order');

    currentPaymentId = result.payment_id;
    orderTotalAud = result.total;
    $('customer-form').style.display = 'none';
    $('payment-section').style.display = 'block';
    $('display-payment-id').textContent = currentPaymentId;

    await fetchLiveCryptoAmounts(orderTotalAud);
    startPriceRefresh();
  } catch (err) {
    showError(err.message);
    btn.disabled = false;
  }
});

document.querySelectorAll('.crypto-option').forEach((option) => {
  option.addEventListener('click', () => {
    document.querySelectorAll('.crypto-option').forEach((o) => o.classList.remove('selected'));
    option.classList.add('selected');
    selectedCrypto = option.getAttribute('data-crypto');
    showPaymentDetails();
  });
});

async function showPaymentDetails() {
  clearError();
  const amount = $(`${selectedCrypto}-amount`).textContent;
  const address = wallets[selectedCrypto];
  if (!address) {
    showError('Wallet not configured for this currency.');
    return;
  }

  const response = await fetch(api('/api/update-crypto'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      payment_id: currentPaymentId,
      crypto_type: selectedCrypto.toUpperCase(),
      crypto_amount: parseFloat(amount),
    }),
  });
  const result = await response.json();
  if (!response.ok) {
    showError(result.error || 'Could not save payment method');
    return;
  }

  $('payment-memo').textContent = currentPaymentId;
  $('memo-repeat').textContent = currentPaymentId;
  $('final-amount').textContent = `${amount} ${selectedCrypto.toUpperCase()}`;
  $('payment-address').textContent = address;
  $('confirm-email').textContent = orderData.customer_email;

  const qrData =
    selectedCrypto === 'btc'
      ? `bitcoin:${address}?amount=${amount}&label=${currentPaymentId}`
      : address;
  $('payment-qr').src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=250x250`;
  $('network-warning').style.display =
    selectedCrypto === 'usdc' || selectedCrypto === 'usdt' ? 'block' : 'none';
  $('payment-details').style.display = 'block';
  startPaymentMonitoring();
}

function startPaymentMonitoring() {
  if (paymentPollTimer) clearInterval(paymentPollTimer);
  paymentPollTimer = setInterval(async () => {
    const response = await fetch(api(`/api/check-payment/${currentPaymentId}`));
    const result = await response.json();
    if (result.status === 'confirmed') {
      clearInterval(paymentPollTimer);
      stopPriceRefresh();
      $('waiting-payment').style.display = 'none';
      $('payment-confirmed').style.display = 'block';
    }
  }, 10000);
}

async function init() {
  await Promise.all([loadCountries(), loadWallets()]);
  loadCart();
  await recalculateQuote();
}

init().catch((err) => showError(err.message));
