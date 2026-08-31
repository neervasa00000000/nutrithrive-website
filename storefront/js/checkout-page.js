const CART_KEY = "nt-storefront-cart";
const DISCOUNT_KEY = "nt-storefront-discount";

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
  if (subtotal >= 80) return 0;
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
    const applied = sessionStorage.getItem(DISCOUNT_KEY) === "WELCOME5";
    const discount = applied ? sub * 0.05 : 0;
    summary.innerHTML = `
      <h2>Order</h2>
      ${items.map((i) => `<div class="summary-row"><span>${i.name} × ${i.qty}</span><span>${money(i.price * i.qty)}</span></div>`).join("")}
      <form class="discount-form" id="discount-form" novalidate>
        <label for="discount-code">Discount code</label>
        <div><input id="discount-code" name="discountCode" autocomplete="off" value="${applied ? "WELCOME5" : ""}" placeholder="Enter code"><button class="btn btn-secondary" type="submit">Apply</button></div>
        <p id="discount-status" role="status">${applied ? "WELCOME5 applied — 5% off your first order." : ""}</p>
      </form>
      ${discount ? `<div class="summary-row discount"><span>Welcome discount (5%)</span><span>−${money(discount)}</span></div>` : ""}
      <div class="summary-row"><span>Shipping</span><span>${ship === 0 ? "Free" : money(ship)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${money(sub - discount + ship)}</span></div>
      <p style="font-size:14px;color:var(--color-text-secondary);margin-top:16px">Preview only. WELCOME5 is demonstrated locally; the live checkout must verify that the email belongs to a new customer.</p>
    `;
    document.getElementById("discount-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = document.getElementById("discount-code");
      const status = document.getElementById("discount-status");
      if (input.value.trim().toUpperCase() !== "WELCOME5") {
        status.textContent = "That code is not valid in this preview.";
        input.focus();
        return;
      }
      sessionStorage.setItem(DISCOUNT_KEY, "WELCOME5");
      renderSummary();
    });
  }
}
}

renderSummary();
