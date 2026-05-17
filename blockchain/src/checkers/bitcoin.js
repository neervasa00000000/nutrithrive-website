const config = require('../config');
const { amountMatches, isWithinHours } = require('./utils');

async function checkBitcoinPayment(order) {
  const address = config.wallets.btc;
  if (!address) return { paymentFound: false, txHash: null };

  const response = await fetch(`https://blockchain.info/rawaddr/${address}?limit=25`);
  if (!response.ok) return { paymentFound: false, txHash: null };

  const data = await response.json();
  const expected = parseFloat(order.crypto_amount);
  const orderCreated = new Date(order.created_at).getTime();

  for (const tx of data.txs || []) {
    const txTime = (tx.time || 0) * 1000;
    if (!isWithinHours(txTime) || txTime < orderCreated - 60_000) continue;

    for (const output of tx.out || []) {
      if (output.addr !== address) continue;
      const amount = output.value / 1e8;
      if (amountMatches(amount, expected)) {
        return { paymentFound: true, txHash: tx.hash };
      }
    }
  }

  return { paymentFound: false, txHash: null };
}

module.exports = { checkBitcoinPayment };
