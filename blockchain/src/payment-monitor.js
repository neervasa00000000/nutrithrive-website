const config = require('./config');
const db = require('./db');
const { verifyPayment } = require('./checkers');
const { sendConfirmationEmail, sendAdminNotification } = require('./email');

async function processOrder(order) {
  const { paymentFound, txHash } = await verifyPayment(order);
  if (!paymentFound || !txHash) return false;

  const updated = await db.getOrderByPaymentId(order.payment_id);
  if (!updated || updated.payment_status !== 'pending') return false;

  await db.confirmOrder(order.payment_id, txHash);

  const confirmed = { ...updated, tx_hash: txHash, payment_status: 'confirmed' };
  console.log(`Payment confirmed: ${order.payment_id} (${txHash})`);

  try {
    await sendConfirmationEmail(confirmed);
    await sendAdminNotification(confirmed);
  } catch (err) {
    console.error(`Email failed for ${order.payment_id}:`, err.message);
  }

  return true;
}

async function tick() {
  try {
    const pending = await db.getPendingOrders();
    if (pending.length) {
      console.log(`Checking ${pending.length} pending order(s)...`);
    }
    for (const order of pending) {
      await processOrder(order);
    }
  } catch (err) {
    console.error('Monitor tick error:', err);
  }
}

async function main() {
  console.log(`Payment monitor started (interval ${config.monitorIntervalMs}ms)`);
  await tick();
  setInterval(tick, config.monitorIntervalMs);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
