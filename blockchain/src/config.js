require('dotenv').config();

const path = require('path');

module.exports = {
  port: parseInt(process.env.PORT || '3000', 10),
  db: {
    driver: (process.env.DB_DRIVER || 'sqlite').toLowerCase(),
    sqlitePath: process.env.SQLITE_PATH || path.join(__dirname, '..', 'data', 'orders.db'),
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'crypto_orders',
  },
  wallets: {
    eth: process.env.WALLET_ETH || '',
    usdc: process.env.WALLET_USDC || process.env.WALLET_ETH || '',
    usdt: process.env.WALLET_USDT || process.env.WALLET_ETH || '',
    sol: process.env.WALLET_SOL || '',
    btc: process.env.WALLET_BTC || '',
  },
  etherscanApiKey: process.env.ETHERSCAN_API_KEY || '',
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || process.env.SMTP_USER || '',
    admin: process.env.ADMIN_EMAIL || '',
  },
  monitorIntervalMs: parseInt(process.env.MONITOR_INTERVAL_MS || '30000', 10),
  amountTolerance: parseFloat(process.env.AMOUNT_TOLERANCE || '0.01'),
  cryptoFeePercent: parseFloat(process.env.CRYPTO_FEE_PERCENT || '3'),
};
