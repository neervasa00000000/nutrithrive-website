const mysql = require('mysql2/promise');
const config = require('./config');

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...config.db,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

async function getOrderByPaymentId(paymentId) {
  const rows = await query('SELECT * FROM orders WHERE payment_id = ? LIMIT 1', [paymentId]);
  return rows[0] || null;
}

async function getPendingOrders() {
  return query(
    `SELECT * FROM orders
     WHERE payment_status = 'pending'
       AND crypto_type IS NOT NULL
       AND crypto_amount IS NOT NULL
     ORDER BY created_at ASC`
  );
}

async function confirmOrder(paymentId, txHash) {
  await query(
    `UPDATE orders
     SET payment_status = 'confirmed', tx_hash = ?, paid_at = NOW()
     WHERE payment_id = ? AND payment_status = 'pending'`,
    [txHash, paymentId]
  );
}

module.exports = {
  getPool,
  query,
  getOrderByPaymentId,
  getPendingOrders,
  confirmOrder,
};
