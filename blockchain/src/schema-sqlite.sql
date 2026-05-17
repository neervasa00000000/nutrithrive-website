CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payment_id TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    phone TEXT NOT NULL,
    order_details TEXT,
    amount_aud REAL NOT NULL,
    crypto_type TEXT,
    crypto_amount REAL,
    tx_hash TEXT,
    payment_status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    paid_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_payment_id ON orders(payment_id);
CREATE INDEX IF NOT EXISTS idx_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_created ON orders(created_at);
