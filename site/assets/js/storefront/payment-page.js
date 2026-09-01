(function () {
function getCart() {
  return window.Cart && window.Cart.get ? window.Cart.get() : { items: [] };
}

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

function computeSubtotal(items) {
  return Number(
    (items || [])
      .reduce((sum, item) => {
        const qty = Number.parseInt(item.quantity || 1, 10);
        const price = Number.parseFloat(item.price);
        if (!Number.isFinite(qty) || qty <= 0) return sum;
        if (!Number.isFinite(price) || price < 0) return sum;
        return sum + qty * price;
      }, 0)
      .toFixed(2)
  );
}

function getSelectedCountryCode() {
  const select = document.getElementById("shipping-country");
  return select && select.value ? select.value.toUpperCase() : "AU";
}

function setStatus(message, isError) {
  const status = document.getElementById("pay-status");
  if (!status) return;
  status.textContent = message || "";
  status.classList.toggle("is-error", Boolean(isError && message));
}

function trackBeginCheckout() {
  if (window._ntBeginCheckoutSent) return;
  const cart = getCart();
  if (!cart.items || cart.items.length === 0) return;
  if (window.NT && typeof window.NT.trackEcommerce === "function") {
    if (window.NT.trackEcommerce("begin_checkout", cart.items)) {
      window._ntBeginCheckoutSent = true;
    }
    return;
  }
  if (typeof gtag !== "function") return;
  gtag("event", "begin_checkout", {
    currency: "AUD",
    value: computeSubtotal(cart.items),
    items: cart.items,
  });
  window._ntBeginCheckoutSent = true;
}

const trackedShippingCountries = new Set();

function trackShippingInfo() {
  const country = getSelectedCountryCode();
  if (!country || trackedShippingCountries.has(country)) return;
  const cart = getCart();
  if (!cart.items || !cart.items.length) return;
  const subtotal = computeSubtotal(cart.items);
  const shipping = window.ShippingRates?.calculate(country, cart.items, subtotal);
  if (window.NT?.trackEcommerce?.("add_shipping_info", cart.items, {
    shipping_tier: country === "AU" ? "Australia standard" : "International standard",
    shipping_cost: Number(shipping || 0),
  })) {
    trackedShippingCountries.add(country);
  }
}

function trackPaymentInfo(items) {
  if (window._ntPaymentInfoSent) return;
  if (window.NT?.trackEcommerce?.("add_payment_info", items, { payment_type: "PayPal" })) {
    window._ntPaymentInfoSent = true;
  }
}

function paypalSdkParams() {
  return {
    currency: "AUD",
    locale: "en_AU",
    components: "buttons,funding-eligibility",
  };
}

function loadPayPalSdkForCheckout() {
  if (typeof window.ntLoadPayPalSdk !== "function") {
    return Promise.reject(new Error("PayPal SDK loader is missing"));
  }
  return window.ntLoadPayPalSdk(paypalSdkParams());
}

function populateCountryDropdown() {
  const select = document.getElementById("shipping-country");
  if (!select || !window.ShippingRates || !window.ShippingRates.getCountryList) return;
  const countries = window.ShippingRates.getCountryList();
  const previous = select.value;
  select.innerHTML = "";
  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.code;
    option.textContent = country.name;
    select.appendChild(option);
  });
  const saved =
    localStorage.getItem("nutrithrive_shipping_country") ||
    localStorage.getItem("nutrithrive_country") ||
    previous ||
    "AU";
  if ([...select.options].some((option) => option.value === saved)) {
    select.value = saved;
  } else if ([...select.options].some((option) => option.value === "AU")) {
    select.value = "AU";
  }
  localStorage.setItem("nutrithrive_shipping_country", select.value);
  localStorage.setItem("nutrithrive_country", select.value);
}

function setEmpty(empty) {
  document.getElementById("pay-layout")?.classList.toggle("is-empty", empty);
  const form = document.getElementById("pay-form");
  const summary = document.getElementById("pay-summary");
  if (form) form.hidden = empty;
  if (summary) summary.hidden = empty;
}

function renderOrderReview() {
  const cart = getCart();
  const wrap = document.getElementById("order-items");
  const empty = document.getElementById("pay-empty");
  if (!wrap) return;
  if (!cart.items || cart.items.length === 0) {
    setEmpty(true);
    if (empty) empty.hidden = false;
    wrap.replaceChildren();
    const subtotal = document.getElementById("subtotal");
    const total = document.getElementById("total");
    const shipping = document.getElementById("shipping");
    if (subtotal) subtotal.textContent = "$0.00";
    if (total) total.textContent = "$0.00";
    if (shipping) shipping.textContent = "Select country";
    return;
  }

  setEmpty(false);
  if (empty) empty.hidden = true;
  wrap.replaceChildren();
  cart.items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "summary-row";
    const left = document.createElement("span");
    const qty = parseInt(item.quantity || 1, 10) || 1;
    const variant = item.variant ? ` · ${item.variant}` : "";
    left.textContent = `${String(item.name || "").slice(0, 80)}${variant} × ${qty}`;
    const right = document.createElement("span");
    right.textContent = money((parseFloat(item.price) || 0) * qty);
    row.append(left, right);
    wrap.appendChild(row);
  });
  const subtotal = computeSubtotal(cart.items);
  const subtotalEl = document.getElementById("subtotal");
  if (subtotalEl) subtotalEl.textContent = money(subtotal);
}

function updateShippingAndTotal() {
  const cart = getCart();
  const country = getSelectedCountryCode();
  if (country) {
    localStorage.setItem("nutrithrive_shipping_country", country);
    localStorage.setItem("nutrithrive_country", country);
  }
  const subtotal = computeSubtotal(cart.items);
  const shipping =
    country && window.ShippingRates
      ? window.ShippingRates.calculate(country, cart.items, subtotal)
      : null;
  const shippingValue = shipping === null ? null : Number.parseFloat(shipping) || 0;
  const shippingEl = document.getElementById("shipping");
  const totalEl = document.getElementById("total");
  if (shippingEl) {
    shippingEl.textContent =
      shippingValue === null ? "Select country" : shippingValue === 0 ? "Free" : money(shippingValue);
  }
  if (totalEl) totalEl.textContent = money(subtotal + (shippingValue || 0));
  schedulePayPalInit();
}

let paypalMountSeq = 0;
let paypalInstances = [];
let paypalInitTimer = 0;
let lastPayPalMountKey = "";

function paypalMountKey() {
  const cart = getCart();
  const items = (cart.items || [])
    .map(function (item) {
      return String(item.id || "") + ":" + String(item.quantity || 1);
    })
    .join(",");
  return getSelectedCountryCode() + "|" + items;
}

function closePayPalButtons() {
  paypalInstances.forEach(function (instance) {
    try {
      if (instance && typeof instance.close === "function") instance.close();
    } catch (err) {
      /* ignore */
    }
  });
  paypalInstances = [];
}

function schedulePayPalInit() {
  window.clearTimeout(paypalInitTimer);
  paypalInitTimer = window.setTimeout(function () {
    loadPayPalSdkForCheckout()
      .then(initPayPal)
      .catch(function (err) {
        console.error("PayPal SDK load failed:", err);
        initPayPal();
      });
  }, 50);
}

function initPayPal() {
  const container = document.getElementById("paypal-button-container");
  const cardContainer = document.getElementById("paypal-card-container");
  if (!container) return;
  const key = paypalMountKey();
  if (key === lastPayPalMountKey && container.childElementCount > 0 && typeof paypal !== "undefined") {
    return;
  }
  const seq = ++paypalMountSeq;
  closePayPalButtons();
  container.replaceChildren();
  if (cardContainer) cardContainer.replaceChildren();
  lastPayPalMountKey = "";
  const setPlaceholder = function (message) {
    container.replaceChildren();
    const p = document.createElement("p");
    p.className = "payment-placeholder";
    p.textContent = message;
    container.appendChild(p);
  };
  const showCheckoutError = function (err) {
    const message = err && err.message ? err.message : "Unable to load payment options right now.";
    console.error("Checkout initialization error:", err);
    setPlaceholder(message);
    setStatus(message, true);
  };

  if (typeof paypal === "undefined") {
    setPlaceholder("PayPal is unavailable right now. Refresh the page or try again shortly.");
    return;
  }

  const cart = getCart();
  if (!cart.items || cart.items.length === 0) {
    setPlaceholder("Your cart is empty.");
    return;
  }

  const countryCode = getSelectedCountryCode();
  if (!countryCode) {
    setPlaceholder("Select a shipping country to continue.");
    return;
  }

  setStatus("");
  let captureToken = null;
  const config = {
    createOrder: function () {
      const orderItems = cart.items
        .map(function (item) {
          const id = String(item.id || "").trim();
          const quantity = parseInt(item.quantity || 1, 10);
          if (!id || !Number.isFinite(quantity) || quantity < 1) return null;
          return { id: id, quantity: quantity };
        })
        .filter(Boolean);
      if (!orderItems.length) {
        return Promise.reject(new Error("Your cart is empty."));
      }
      trackPaymentInfo(cart.items);
      return fetch("/.netlify/functions/paypal-create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryCode: countryCode,
          items: orderItems,
        }),
      })
        .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
        .then((result) => {
          if (!result.ok) throw new Error(result.data.error || "Failed to create order");
          captureToken = result.data.captureToken;
          return result.data.orderID || result.data.id;
        });
    },
    onApprove: function (data) {
      return fetch("/.netlify/functions/paypal-capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: data.orderID || data.id, captureToken: captureToken }),
      })
        .then((res) => res.json().then((payload) => ({ ok: res.ok, payload })))
        .then((result) => {
          if (!result.ok) throw new Error(result.payload.error || "Payment failed");
          const items = cart.items || [];
          const qty =
            items.reduce(function (sum, item) {
              return sum + (parseInt(item.quantity || 1, 10) || 1);
            }, 0) || 1;
          const itemName =
            items.length === 1
              ? String(items[0].name || "NutriThrive Moringa Powder")
              : items
                  .map(function (i) {
                    return i.name;
                  })
                  .join(", ")
                  .slice(0, 120);
          let orderValue = computeSubtotal(items);
          const totalText = document.getElementById("total");
          if (totalText && totalText.textContent) {
            const parsedTotal = parseFloat(String(totalText.textContent).replace(/[^0-9.]/g, ""));
            if (Number.isFinite(parsedTotal) && parsedTotal > 0) {
              orderValue = parsedTotal;
            }
          }
          const capture = result.payload || {};
          let captureAmount =
            capture.purchase_units &&
            capture.purchase_units[0] &&
            capture.purchase_units[0].payments &&
            capture.purchase_units[0].payments.captures &&
            capture.purchase_units[0].payments.captures[0] &&
            capture.purchase_units[0].payments.captures[0].amount &&
            capture.purchase_units[0].payments.captures[0].amount.value;
          if (
            !captureAmount &&
            capture.purchase_units &&
            capture.purchase_units[0] &&
            capture.purchase_units[0].amount
          ) {
            captureAmount = capture.purchase_units[0].amount.value;
          }
          if (captureAmount) {
            orderValue = parseFloat(captureAmount) || orderValue;
          }
          const transactionId = String(data.orderID || data.id || "");
          const subtotalValue = computeSubtotal(items);
          const shippingValue = Math.max(0, Number((orderValue - subtotalValue).toFixed(2)));
          try {
            sessionStorage.setItem("nt-purchase-snapshot", JSON.stringify({
              transactionId: transactionId,
              currency: "AUD",
              value: orderValue,
              shipping: shippingValue,
              items: items,
              savedAt: new Date().toISOString(),
            }));
          } catch (err) {
            console.warn("Purchase analytics snapshot could not be stored", err);
          }
          window.Cart.clear();
          const thankYouParams = new URLSearchParams({
            orderId: transactionId,
            value: String(orderValue),
            item: itemName,
            qty: String(qty),
          });
          window.location.href = "/thank-you.html?" + thankYouParams.toString();
        })
        .catch((err) => {
          setStatus("Payment error: " + err.message, true);
        });
    },
    onError: function (err) {
      setStatus("Payment error: " + (err.message || "Unknown error"), true);
    },
  };

  function renderFunding(funding, selector) {
    try {
      const buttons = paypal.Buttons(Object.assign({ fundingSource: funding }, config));
      paypalInstances.push(buttons);
      if (typeof buttons.isEligible === "function" && !buttons.isEligible()) {
        return Promise.resolve(false);
      }
      return buttons
        .render(selector)
        .then(function () {
          if (seq !== paypalMountSeq) {
            try {
              buttons.close();
            } catch (err) {
              /* ignore */
            }
            return false;
          }
          return true;
        })
        .catch(function (err) {
          console.warn("PayPal funding render skipped:", funding, err && err.message);
          return false;
        });
    } catch (err) {
      console.warn("PayPal funding init skipped:", funding, err && err.message);
      return Promise.resolve(false);
    }
  }

  Promise.all([
    renderFunding(paypal.FUNDING.PAYPAL, "#paypal-button-container"),
    cardContainer ? renderFunding(paypal.FUNDING.CARD, "#paypal-card-container") : Promise.resolve(false),
  ]).then(function (results) {
    if (seq !== paypalMountSeq) return;
    const anyRendered = results.some(Boolean);
    if (anyRendered) {
      lastPayPalMountKey = key;
      return;
    }
    const fallback = paypal.Buttons(config);
    paypalInstances.push(fallback);
    fallback
      .render("#paypal-button-container")
      .then(function () {
        if (seq !== paypalMountSeq) {
          try {
            fallback.close();
          } catch (err) {
            /* ignore */
          }
          return;
        }
        lastPayPalMountKey = key;
      })
      .catch(showCheckoutError);
  });
}

function bootCheckout() {
  populateCountryDropdown();
  renderOrderReview();
  updateShippingAndTotal();
  trackShippingInfo();
  if (document.readyState === "complete" && typeof trackBeginCheckout === "function") {
    trackBeginCheckout();
  }
}

function startCheckout() {
  loadPayPalSdkForCheckout()
    .then(bootCheckout)
    .catch(function (err) {
      console.error("PayPal SDK failed to load:", err);
      bootCheckout();
    });
}

function bindPaymentPage() {
  document.getElementById("shipping-country")?.addEventListener("change", function () {
    updateShippingAndTotal();
    trackShippingInfo();
  });
  window.addEventListener("nt-analytics-ready", function () {
    trackBeginCheckout();
    trackShippingInfo();
  });
  window.addEventListener("nt-cart-change", function () {
    renderOrderReview();
    updateShippingAndTotal();
  });
  if (typeof window.ntLoadPayPalSdk !== "function") {
    console.error("PayPal SDK loader is missing (paypal-sdk-loader.js).");
    bootCheckout();
    return;
  }
  startCheckout();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bindPaymentPage);
} else {
  bindPaymentPage();
}
})();
