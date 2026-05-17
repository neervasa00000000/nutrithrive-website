const config = require('../config');
const { amountMatches, isWithinHours } = require('./utils');

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

async function rpc(method, params) {
  const response = await fetch(SOLANA_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

async function checkSolanaPayment(order) {
  const address = config.wallets.sol;
  if (!address) return { paymentFound: false, txHash: null };

  const expected = parseFloat(order.crypto_amount);
  const orderCreated = new Date(order.created_at).getTime();

  const signatures = await rpc('getSignaturesForAddress', [
    address,
    { limit: 25 },
  ]);

  if (!signatures?.length) return { paymentFound: false, txHash: null };

  for (const sig of signatures) {
    if (sig.err) continue;
    const blockTime = (sig.blockTime || 0) * 1000;
    if (!isWithinHours(blockTime) || blockTime < orderCreated - 60_000) continue;

    const tx = await rpc('getTransaction', [
      sig.signature,
      { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 },
    ]);

    if (!tx?.meta || tx.meta.err) continue;

    const pre = tx.meta.preBalances || [];
    const post = tx.meta.postBalances || [];
    const accountKeys = tx.transaction?.message?.accountKeys || [];

    let recipientIndex = -1;
    accountKeys.forEach((key, i) => {
      const pubkey = typeof key === 'string' ? key : key.pubkey;
      if (pubkey === address) recipientIndex = i;
    });

    if (recipientIndex < 0) continue;

    const lamportsReceived = (post[recipientIndex] || 0) - (pre[recipientIndex] || 0);
    if (lamportsReceived <= 0) continue;

    const solReceived = lamportsReceived / 1e9;
    if (amountMatches(solReceived, expected)) {
      return { paymentFound: true, txHash: sig.signature };
    }
  }

  return { paymentFound: false, txHash: null };
}

module.exports = { checkSolanaPayment };
