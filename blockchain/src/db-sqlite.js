const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const config = require('./config');

let db;

function getDb() {
  if (!db) {
    const dbPath = path.resolve(config.db.sqlitePath);
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    const schema = fs.readFileSync(path.join(__dirname, 'schema-sqlite.sql'), 'utf8');
    db.exec(schema);
  }
  return db;
}

function query(sql, params = []) {
  const database = getDb();
  const statement = sql.trim();
  if (/^(INSERT|UPDATE|DELETE)/i.test(statement)) {
    database.prepare(sql).run(...params);
    return [];
  }
  return database.prepare(sql).all(...params);
}

function getOrderByPaymentId(paymentId) {
  return getDb().prepare('SELECT * FROM orders WHERE payment_id = ? LIMIT 1').get(paymentId) || null;
}

function getPendingOrders() {
  return getDb()
    .prepare(
      `SELECT * FROM orders
       WHERE payment_status = 'pending'
         AND crypto_type IS NOT NULL
         AND crypto_amount IS NOT NULL
       ORDER BY created_at ASC`
    )
    .all();
}

function confirmOrder(paymentId, txHash) {
  return getDb()
    .prepare(
      `UPDATE orders
       SET payment_status = 'confirmed', tx_hash = ?, paid_at = datetime('now')
       WHERE payment_id = ? AND payment_status = 'pending'`
    )
    .run(txHash, paymentId);
}

module.exports = {
  getPool: () => getDb(),
  query: (sql, params) => Promise.resolve(query(sql, params)),
  getOrderByPaymentId: (id) => Promise.resolve(getOrderByPaymentId(id)),
  getPendingOrders: () => Promise.resolve(getPendingOrders()),
  confirmOrder: (paymentId, txHash) => Promise.resolve(confirmOrder(paymentId, txHash)),
};
