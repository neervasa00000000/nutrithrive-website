const CART_KEY = "nt-storefront-cart";

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function shippingFor(subtotal) {
  if (subtotal >= 49) return 0;
  if (subtotal === 0) return 0;
  return 9.69;
}

const summary = document.getElementById("checkout-summary");
const items = readCart();
const sub = items.reduce((n, i) => n + i.price * i.qty, 0);
const ship = shippingFor(sub);

function renderSummary() {
if (summary) {
  if (!items.length) {
    summary.innerHTML = `<p>Your cart is empty.</p><a href="/shop/">Shop</a>`;
  } else {
    summary.innerHTML = `
      <h2>Order</h2>
      ${items.map((i) => `<div class="summary-row"><span>${i.name} × ${i.qty}</span><span>${money(i.price * i.qty)}</span></div>`).join("")}
      <div class="summary-row"><span>Shipping</span><span>${ship === 0 ? "Free" : money(ship)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${money(sub + ship)}</span></div>
      <p style="font-size:14px;color:var(--color-text-secondary);margin-top:16px">Preview only.</p>
    `;
  }
}
}

renderSummary();
