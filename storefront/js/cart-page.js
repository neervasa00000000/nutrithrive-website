(() => {
const CART_KEY = "nt-storefront-cart";
const LIVE_CART_KEY = "nutrithrive_cart";
const VIEWED_KEY = "nt-storefront-viewed";

const PAIRS = {
  "moringa-powder": ["moringa-400g", "curry-leaves", "black-tea", "moringa-soap", "combo-pack"],
  "moringa-200g": ["moringa-400g", "curry-leaves", "black-tea", "moringa-soap"],
  "moringa-400g": ["curry-leaves", "black-tea", "moringa-soap"],
  "curry-leaves": ["moringa-powder", "black-tea", "combo-pack"],
  "black-tea": ["moringa-powder", "curry-leaves", "moringa-soap"],
  "moringa-soap": ["moringa-powder", "black-tea", "gift-pack"],
  "combo-pack": ["moringa-400g", "black-tea", "moringa-soap"],
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

function mapCartItems(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => {
      if (!item || !item.id) return null;
      const qty = Number(item.qty || item.quantity || 1);
      if (!Number.isFinite(qty) || qty <= 0) return null;
      const catalogItem = catalog().find((product) => product.id === item.id);
      return {
        ...item,
        qty,
        price: Number(item.price || catalogItem?.price || 0),
        image: item.image || catalogItem?.image || "",
        name: item.name || catalogItem?.name || "NutriThrive product",
        variant: item.variant || catalogItem?.variant || "",
      };
    })
    .filter(Boolean);
}

function readCart() {
  try {
    const liveRaw = localStorage.getItem(LIVE_CART_KEY);
    if (liveRaw) {
      const data = JSON.parse(liveRaw);
      const mapped = mapCartItems(Array.isArray(data) ? data : data?.items);
      if (mapped.length) return mapped;
    }
    if (window.Cart?.get) {
      const mapped = mapCartItems((window.Cart.get() || {}).items);
      if (mapped.length) return mapped;
    }
    if (window.NT?.readCart) {
      const mapped = mapCartItems(window.NT.readCart());
      if (mapped.length) return mapped;
    }
    return mapCartItems(JSON.parse(localStorage.getItem(CART_KEY) || "[]"));
  } catch (err) {
    console.error("Cart read failed", err);
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
  if (subtotal >= 49) return 0;
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
  const remaining = Math.max(0, 49 - subtotal);
  const recs = [...score.entries()]
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
  const comboInCart = cartItems.some((item) => item.id === "combo-pack");
  if (comboInCart) {
    const bundleAt = recs.findIndex((item) => item.id === "moringa-400g");
    if (bundleAt > 0) {
      const [bundle] = recs.splice(bundleAt, 1);
      recs.unshift(bundle);
    }
  }
  return recs;
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
  try {
    const items = readCart();
    const sub = items.reduce((n, i) => n + Number(i.price || 0) * Number(i.qty || 1), 0);
    if (!items.length) {
      setLayout(true);
      lines.innerHTML = `<div class="empty-state"><h2>Your cart is empty</h2><p>Moringa, tea, curry leaves and soap, all packed in Truganina.</p><a class="btn btn-primary" href="${shopPath()}">Shop the range</a></div>`;
      summary.innerHTML = "";
      renderRecs([], 0);
      return;
    }
    setLayout(false);
    lines.innerHTML = items
      .map((item) => {
        const qty = Number(item.qty || 1);
        return `<article class="cart-line">
        <a class="cart-line__media" href="${esc(item.href || shopPath())}" aria-label="View ${esc(item.name)}">
          <img src="${esc(item.image)}" alt="" width="112" height="112">
        </a>
        <div class="cart-line__content">
          <div class="cart-line__heading">
            <h2>${esc(item.name)}</h2>
            <strong class="line-price">${money(item.price * qty)}</strong>
          </div>
          ${item.variant ? `<p class="cart-line__variant">${esc(item.variant)}</p>` : ""}
          <div class="cart-line__actions">
            <div class="qty-ctrl" aria-label="Quantity for ${esc(item.name)}">
            <button type="button" data-set="${esc(item.id)}" data-qty="${qty - 1}" aria-label="Decrease ${esc(item.name)} quantity">−</button>
            <input value="${qty}" readonly aria-label="${esc(item.name)} quantity">
            <button type="button" data-set="${esc(item.id)}" data-qty="${qty + 1}" aria-label="Increase ${esc(item.name)} quantity">+</button>
            </div>
            <button class="remove-btn" type="button" data-remove="${esc(item.id)}">Remove</button>
          </div>
        </div>
      </article>`;
      })
      .join("");
    const ship = shippingFor(items, sub);
    const freeShippingPercent = Math.min(100, Math.max(0, (sub / 49) * 100));
    const freeShippingMessage = sub >= 49
      ? "Free Australian shipping unlocked"
      : `${money(49 - sub)} away from free Australian shipping`;
    const freeShipPathNote = sub >= 17 && sub <= 46
      ? `<p class="purchase-note shipping-path">To unlock free AU shipping: 400g bundle $35 + curry $7 + tea $7.50 = $49.50. Combo $17 needs the 400g bundle ($52).</p>`
      : "";
    summary.innerHTML = `
    <h2>Order summary</h2>
    <div class="summary-row"><span>Subtotal</span><span>${money(sub)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${ship === 0 ? "Free" : money(ship)}</span></div>
    <div class="summary-row total"><span>Estimated total</span><span>${money(sub + ship)}</span></div>
    <div class="shipping-progress ${sub >= 49 ? "is-complete" : ""}">
      <div class="shipping-progress__copy"><strong>${freeShippingMessage}</strong><span>$49 target</span></div>
      <div class="shipping-progress__track" role="progressbar" aria-label="Progress towards free Australian shipping" aria-valuemin="0" aria-valuemax="49" aria-valuenow="${Math.min(49, Number(sub.toFixed(2)))}" aria-valuetext="${freeShippingMessage}">
        <span style="width:${freeShippingPercent.toFixed(2)}%"></span>
      </div>
    </div>
    ${freeShipPathNote}
    ${isLiveSite() ? '<p class="hint cart-checkout-note">Final shipping and total are confirmed at checkout.</p>' : ""}
    <a class="btn btn-primary btn-block cart-checkout" href="${checkoutPath()}">Continue to secure checkout <span aria-hidden="true">→</span></a>
    <ul class="cart-assurances" aria-label="Checkout information">
      <li>Secure PayPal and card payment</li>
      <li>Seven-day returns on unopened products</li>
      <li>Weekday dispatch before 2pm</li>
    </ul>
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
  } catch (err) {
    console.error("Cart render failed", err);
    setLayout(true);
    lines.innerHTML = `<div class="empty-state"><h2>We could not load your cart</h2><p>Refresh the page. If that does not work, open the shop and add the items again.</p><a class="btn btn-primary" href="${shopPath()}">Shop the range</a></div>`;
  }
}

function trackCartView() {
  const items = readCart();
  if (!items.length || window._ntViewCartSent) return;
  if (window.NT?.trackEcommerce?.("view_cart", items)) {
    window._ntViewCartSent = true;
  }
}

function bootCartPage() {
  renderCart();
  trackCartView();
}

window.NT = window.NT || {};
window.NT.renderCart = renderCart;
window.addEventListener("nt-cart-change", renderCart);
window.addEventListener("nt-analytics-ready", trackCartView);
window.addEventListener("pageshow", renderCart);
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootCartPage);
} else {
  bootCartPage();
}
setTimeout(bootCartPage, 0);
})();
