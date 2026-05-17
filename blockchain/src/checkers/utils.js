const config = require('../config');

function amountMatches(received, expected, tolerance = config.amountTolerance) {
  if (!expected || expected <= 0) return false;
  return Math.abs(received - expected) / expected <= tolerance;
}

function isWithinHours(timestampMs, hours = 48) {
  return timestampMs > Date.now() - hours * 60 * 60 * 1000;
}

function hexContainsPaymentId(hexInput, paymentId) {
  if (!hexInput || hexInput === '0x' || !paymentId) return false;
  try {
    const normalized = hexInput.startsWith('0x') ? hexInput.slice(2) : hexInput;
    const decoded = Buffer.from(normalized, 'hex').toString('utf8');
    return decoded.includes(paymentId);
  } catch {
    return false;
  }
}

function textContainsPaymentId(text, paymentId) {
  if (!text || !paymentId) return false;
  return String(text).includes(paymentId);
}

module.exports = {
  amountMatches,
  isWithinHours,
  hexContainsPaymentId,
  textContainsPaymentId,
};
