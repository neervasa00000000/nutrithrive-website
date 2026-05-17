const config = require('../config');
const { amountMatches, isWithinHours } = require('./utils');

const ETHERSCAN_BASE = 'https://api.etherscan.io/api';

async function etherscanRequest(params) {
  const url = new URL(ETHERSCAN_BASE);
  Object.entries({ ...params, apikey: config.etherscanApiKey }).forEach(([k, v]) => {
    url.searchParams.set(k, v);
  });
  const response = await fetch(url);
  const data = await response.json();
  if (data.status !== '1' || !Array.isArray(data.result)) {
    return [];
  }
  return data.result;
}

function orderCreatedAfter(order, txTimestampSec) {
  const created = new Date(order.created_at).getTime();
  return txTimestampSec * 1000 >= created - 60_000;
}

async function checkEthereumPayment(order) {
  const address = config.wallets.eth;
  if (!address || !config.etherscanApiKey) {
    return { paymentFound: false, txHash: null };
  }

  const txs = await etherscanRequest({
    module: 'account',
    action: 'txlist',
    address,
    startblock: 0,
    endblock: 99999999,
    sort: 'desc',
  });

  const expected = parseFloat(order.crypto_amount);

  for (const tx of txs) {
    const txTime = parseInt(tx.timeStamp, 10) * 1000;
    if (!isWithinHours(txTime) || !orderCreatedAfter(order, parseInt(tx.timeStamp, 10))) {
      continue;
    }
    if (tx.to?.toLowerCase() !== address.toLowerCase()) continue;

    const amount = parseInt(tx.value, 10) / 1e18;
    if (amountMatches(amount, expected)) {
      return { paymentFound: true, txHash: tx.hash };
    }
  }

  return { paymentFound: false, txHash: null };
}

async function checkTokenPayment(order) {
  const address = config.wallets.eth;
  const tokenSymbol = order.crypto_type;
  if (!address || !config.etherscanApiKey) {
    return { paymentFound: false, txHash: null };
  }

  const txs = await etherscanRequest({
    module: 'account',
    action: 'tokentx',
    address,
    startblock: 0,
    endblock: 99999999,
    sort: 'desc',
  });

  const expected = parseFloat(order.crypto_amount);

  for (const tx of txs) {
    const txTime = parseInt(tx.timeStamp, 10) * 1000;
    if (!isWithinHours(txTime) || !orderCreatedAfter(order, parseInt(tx.timeStamp, 10))) {
      continue;
    }
    if (tx.tokenSymbol?.toUpperCase() !== tokenSymbol) continue;
    if (tx.to?.toLowerCase() !== address.toLowerCase()) continue;

    const decimals = parseInt(tx.tokenDecimal, 10) || 6;
    const amount = parseInt(tx.value, 10) / 10 ** decimals;

    if (amountMatches(amount, expected)) {
      return { paymentFound: true, txHash: tx.hash };
    }
  }

  return { paymentFound: false, txHash: null };
}

module.exports = {
  checkEthereumPayment,
  checkTokenPayment,
};
