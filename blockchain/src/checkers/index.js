const { checkEthereumPayment, checkTokenPayment } = require('./ethereum');
const { checkSolanaPayment } = require('./solana');
const { checkBitcoinPayment } = require('./bitcoin');

async function verifyPayment(order) {
  const type = (order.crypto_type || '').toUpperCase();

  switch (type) {
    case 'ETH':
      return checkEthereumPayment(order);
    case 'USDC':
    case 'USDT':
      return checkTokenPayment(order);
    case 'SOL':
      return checkSolanaPayment(order);
    case 'BTC':
      return checkBitcoinPayment(order);
    default:
      return { paymentFound: false, txHash: null };
  }
}

module.exports = { verifyPayment };
