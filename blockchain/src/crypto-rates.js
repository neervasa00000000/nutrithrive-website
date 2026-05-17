/** Live AUD crypto rates via CoinGecko (cached briefly). */

const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,solana,bitcoin,usd-coin,tether&vs_currencies=aud';

const CACHE_MS = 12_000;

const DECIMALS = {
  eth: 6,
  sol: 6,
  btc: 8,
  usdc: 2,
  usdt: 2,
};

let cache = { fetchedAt: 0, ratesAud: null };

async function fetchRatesAud() {
  const now = Date.now();
  if (cache.ratesAud && now - cache.fetchedAt < CACHE_MS) {
    return { ratesAud: cache.ratesAud, fetchedAt: cache.fetchedAt, cached: true };
  }

  const response = await fetch(COINGECKO_URL, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Rate provider returned ${response.status}`);
  }

  const data = await response.json();
  const ratesAud = {
    eth: data.ethereum?.aud,
    sol: data.solana?.aud,
    btc: data.bitcoin?.aud,
    usdc: data['usd-coin']?.aud,
    usdt: data.tether?.aud,
  };

  for (const [key, price] of Object.entries(ratesAud)) {
    if (!price || price <= 0) {
      throw new Error(`Missing live price for ${key}`);
    }
  }

  cache = { fetchedAt: now, ratesAud };
  return { ratesAud, fetchedAt: now, cached: false };
}

function formatCryptoAmount(value, crypto) {
  const decimals = DECIMALS[crypto] ?? 6;
  return Number(value).toFixed(decimals);
}

function audToCryptoAmount(audTotal, crypto, ratesAud) {
  const priceAud = ratesAud[crypto];
  const raw = audTotal / priceAud;
  return {
    crypto,
    amount: formatCryptoAmount(raw, crypto),
    amountNumber: raw,
    rateAud: priceAud,
  };
}

async function getCryptoAmounts(audTotal) {
  const aud = parseFloat(audTotal);
  if (!Number.isFinite(aud) || aud <= 0) {
    return { ok: false, error: 'Invalid AUD amount' };
  }

  const { ratesAud, fetchedAt } = await fetchRatesAud();
  const amounts = {};
  const rates = {};

  for (const crypto of ['eth', 'sol', 'btc', 'usdc', 'usdt']) {
    const converted = audToCryptoAmount(aud, crypto, ratesAud);
    amounts[crypto] = converted.amount;
    rates[crypto] = converted.rateAud;
  }

  return {
    ok: true,
    aud,
    amounts,
    ratesAud: rates,
    updatedAt: new Date(fetchedAt).toISOString(),
    refreshSeconds: Math.ceil(CACHE_MS / 1000),
  };
}

module.exports = {
  getCryptoAmounts,
  fetchRatesAud,
  DECIMALS,
};
