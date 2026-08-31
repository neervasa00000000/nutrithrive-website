const CART_KEY = "nt-ds-v1-cart";
const VIEWED_KEY = "nt-ds-v1-viewed";

const PAIRS = {
  "moringa-powder": ["curry-leaves", "black-tea", "moringa-soap", "combo-pack"],
  "moringa-200g": ["curry-leaves", "black-tea", "moringa-soap"],
  "moringa-400g": ["curry-leaves", "black-tea", "moringa-soap"],
  "curry-leaves": ["moringa-powder", "black-tea", "combo-pack"],
  "black-tea": ["moringa-powder", "curry-leaves", "moringa-soap"],
  "moringa-soap": ["moringa-powder", "black-tea", "gift-pack"],
  "combo-pack": ["black-tea", "moringa-soap"],
  "gift-pack": ["moringa-200g"],
};

const POPULAR = ["moringa-powder", "curry-leaves", "black-tea", "moringa-soap"];

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function isLiveSite() {
  return document.documentElement.dataset.ntLive === "1";
}

function shopPath() {
  return isLiveSite() ? "/products/" : "/shop/";
}

function checkoutPath() {
  return isLiveSite() ? "/payment" : "/checkout/";
}

function readCart() {
  if (window.NT?.readCart) return window.NT.readCart();
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeCart(items) {
  if (window.NT?.writeCart) {
    window.NT.writeCart(items);
    return;
  }
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("nt-cart-change"));
}

function viewedIds() {
  try {
    return JSON.parse(localStorage.getItem(VIEWED_KEY) || "[]");
  } catch {
    return [];
  }
}

function catalog() {
  return window.NT_PRODUCTS || [];
}

function shippingFor(items, subtotal) {
  if (subtotal >= 80) return 0;
  if (!items.length || subtotal === 0) return 0;
  if (window.ShippingRates?.calculate) {
    const payload = items.map((item) => ({
      name: item.name,
      weight: Number(item.weight || 0),
      quantity: Number(item.qty || item.quantity || 1),
    }));
    const cost = window.ShippingRates.calculate("AU", payload, subtotal);
    if (typeof cost === "number" && !Number.isNaN(cost)) return cost;
  }
  return 9.69;
}

function pickRecs(cartItems, subtotal) {
  const inCart = new Set(cartItems.map((i) => i.id));
  const seen = viewedIds();
  const score = new Map();
  const bump = (id, n) => {
    if (!id || inCart.has(id)) return;
    score.set(id, (score.get(id) || 0) + n);
  };
  seen.forEach((id, i) => bump(id, 50 - i * 5));
  cartItems.forEach((item) => {
    (PAIRS[item.id] || []).forEach((id, i) => bump(id, 40 - i * 4));
  });
  POPULAR.forEach((id, i) => bump(id, 8 - i));
  const remaining = Math.max(0, 80 - subtotal);
  return [...score.entries()]
    .map(([id, s]) => {
      const p = catalog().find((x) => x.id === id);
      if (!p) return null;
      let extra = 0;
      let note = cartItems.length ? "Often added with what is already in the cart" : "A good place to start";
      if (seen.includes(id)) note = "You looked at this";
      if (cartItems.length && remaining > 0 && p.price >= remaining) {
        extra += 30;
        note = "Adds free Australian shipping";
      }
      return { ...p, score: s + extra, note };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

function recHeading(cartItems, recs) {
  const seen = viewedIds();
  if (!cartItems.length && recs.some((r) => seen.includes(r.id))) return "You looked at these";
  if (!cartItems.length) return "A few to start with";
  if (recs.some((r) => r.note === "Adds free Australian shipping")) return "Add these to reach free shipping";
  return "Goes well with your cart";
}

function renderRecs(cartItems, subtotal) {
  const root = document.getElementById("cart-recs");
  if (!root) return;
  const recs = pickRecs(cartItems, subtotal);
  if (!recs.length) {
    root.innerHTML = "";
    return;
  }
  root.innerHTML = `
    <section class="cart-recs" aria-label="Recommended products">
      <h2>${esc(recHeading(cartItems, recs))}</h2>
      <div class="cart-recs-grid">
        ${recs
          .map(
            (p) => `<article class="cart-rec">
              <a class="cart-rec-media" href="${esc(p.href)}">
                <img src="${esc(p.image)}" alt="" width="120" height="120">
              </a>
              <div>
                <h3><a href="${esc(p.href)}">${esc(p.name)}</a></h3>
                <p class="cart-rec-meta">${esc(p.variant)} · ${money(p.price)}</p>
                <p class="cart-rec-note">${esc(p.note)}</p>
                <button class="btn btn-secondary" type="button" data-rec-add="${esc(p.id)}">Add</button>
              </div>
            </article>`
          )
          .join("")}
      </div>
    </section>`;
  root.querySelectorAll("[data-rec-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = catalog().find((p) => p.id === btn.getAttribute("data-rec-add"));
      if (!product) return;
      if (window.NT?.addToCart) window.NT.addToCart(product, 1);
      else {
        const items = readCart();
        const found = items.find((i) => i.id === product.id);
        if (found) found.qty += 1;
        else items.push({ ...product, qty: 1 });
        writeCart(items);
      }
    });
  });
}

function setLayout(empty) {
  document.getElementById("cart-layout")?.classList.toggle("is-empty", empty);
  const summary = document.getElementById("cart-summary");
  if (summary) summary.hidden = empty;
}

function renderCart() {
  const lines = document.getElementById("cart-lines");
  const summary = document.getElementById("cart-summary");
  if (!lines || !summary) return;
  const items = readCart();
  const sub = items.reduce((n, i) => n + i.price * i.qty, 0);
  if (!items.length) {
    setLayout(true);
    lines.innerHTML = `<div class="empty-state"><h2>Your cart is empty</h2><p>Moringa, tea, curry leaves and soap, all packed in Truganina.</p><a class="btn btn-primary" href="${shopPath()}">Shop the range</a></div>`;
    summary.innerHTML = "";
    renderRecs([], 0);
    return;
  }
  setLayout(false);
  lines.innerHTML = items
    .map(
      (item) => `<article class="cart-line">
        <img src="${esc(item.image)}" alt="" width="96" height="96">
        <div>
          <h2>${esc(item.name)}${item.variant ? ` · ${esc(item.variant)}` : ""}</h2>
          <div class="qty-ctrl">
            <button type="button" data-set="${esc(item.id)}" data-qty="${item.qty - 1}" aria-label="Decrease">−</button>
            <input value="${item.qty}" readonly aria-label="Quantity">
            <button type="button" data-set="${esc(item.id)}" data-qty="${item.qty + 1}" aria-label="Increase">+</button>
          </div>
          <button class="remove-btn" type="button" data-remove="${esc(item.id)}">Remove</button>
        </div>
        <div class="line-price">${money(item.price * item.qty)}</div>
      </article>`
    )
    .join("");
  const ship = shippingFor(items, sub);
  summary.innerHTML = `
    <h2>Summary</h2>
    <div class="summary-row"><span>Subtotal</span><span>${money(sub)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${ship === 0 ? "Free" : money(ship)}</span></div>
    <div class="summary-row total"><span>Total</span><span>${money(sub + ship)}</span></div>
    <p class="hint" style="font-size:14px;color:var(--color-text-secondary);margin:12px 0 20px">${sub >= 80 ? "Free Australian shipping applied." : `Add ${money(80 - sub)} for free Australian shipping.`}${isLiveSite() ? " Final shipping and total are calculated at PayPal checkout." : ""}</p>
    <a class="btn btn-primary btn-block" href="${checkoutPath()}">Checkout</a>
  `;
  lines.querySelectorAll("[data-set]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-set");
      const qty = parseInt(btn.getAttribute("data-qty"), 10);
      if (qty < 1) {
        if (window.NT?.remove) window.NT.remove(id);
        else writeCart(readCart().filter((i) => i.id !== id));
        return;
      }
      if (window.NT?.setQty) window.NT.setQty(id, qty);
      else {
        writeCart(readCart().map((i) => (i.id === id ? { ...i, qty } : i)));
      }
    });
  });
  lines.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-remove");
      if (window.NT?.remove) window.NT.remove(id);
      else writeCart(readCart().filter((i) => i.id !== id));
    });
  });
  renderRecs(items, sub);
}

function bootCartPage() {
  renderCart();
}

window.addEventListener("nt-cart-change", renderCart);
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootCartPage);
} else {
  bootCartPage();
}
