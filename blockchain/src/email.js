const nodemailer = require('nodemailer');
const config = require('./config');

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }
  return transporter;
}

async function sendConfirmationEmail(order) {
  if (!config.email.user || !config.email.from) {
    console.warn('Email not configured — skipping customer confirmation');
    return;
  }

  await getTransporter().sendMail({
    from: config.email.from,
    to: order.customer_email,
    subject: `Payment Confirmed - Order ${order.payment_id}`,
    html: `
      <h2>Payment Received!</h2>
      <p>Dear ${escapeHtml(order.customer_name)},</p>
      <p>We've confirmed your payment of <strong>${order.crypto_amount} ${order.crypto_type}</strong>.</p>
      <h3>Order Details</h3>
      <p><strong>Payment ID:</strong> ${escapeHtml(order.payment_id)}</p>
      <p><strong>Amount:</strong> $${order.amount_aud} AUD</p>
      <p><strong>Order:</strong> ${escapeHtml(order.order_details || '—')}</p>
      <h3>Delivery Address</h3>
      <p>${escapeHtml(order.delivery_address)}</p>
      <p>Your order will be processed and shipped within 24–48 hours.</p>
      <p>Transaction: ${escapeHtml(order.tx_hash || '—')}</p>
      <p>Thank you for your business!</p>
    `,
  });
}

async function sendAdminNotification(order) {
  if (!config.email.admin || !config.email.from) {
    console.warn('Admin email not configured — skipping admin notification');
    return;
  }

  await getTransporter().sendMail({
    from: config.email.from,
    to: config.email.admin,
    subject: `New Order Received - ${order.payment_id}`,
    html: `
      <h2>New Crypto Payment Received</h2>
      <h3>Customer</h3>
      <p><strong>Name:</strong> ${escapeHtml(order.customer_name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(order.customer_email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(order.phone)}</p>
      <h3>Order</h3>
      <p><strong>Payment ID:</strong> ${escapeHtml(order.payment_id)}</p>
      <p><strong>Amount:</strong> $${order.amount_aud} AUD (${order.crypto_amount} ${order.crypto_type})</p>
      <p><strong>Details:</strong> ${escapeHtml(order.order_details || '—')}</p>
      <h3>Delivery</h3>
      <p>${escapeHtml(order.delivery_address)}</p>
      <h3>Transaction</h3>
      <p>${escapeHtml(order.tx_hash || '—')}</p>
      <p><strong>Action:</strong> Process and ship this order.</p>
    `,
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = {
  sendConfirmationEmail,
  sendAdminNotification,
};
