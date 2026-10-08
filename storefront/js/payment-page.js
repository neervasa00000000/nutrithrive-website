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

function trackPaymentInfo(items, paymentType) {
  if (window._ntPaymentInfoSent) return;
  if (window.NT?.trackEcommerce?.("add_payment_info", items, { payment_type: paymentType || "PayPal" })) {
    window._ntPaymentInfoSent = true;
  }
}

function paypalSdkParams() {
  return {
    currency: "AUD",
    locale: "en_AU",
    components: "buttons,funding-eligibility,applepay",
    "enable-funding": "paylater,card,applepay",
  };
}

function loadApplePaySdk() {
  if (window.ApplePaySession) return Promise.resolve();
  const existing = document.querySelector('script[data-nt-apple-pay-sdk]');
  if (existing) {
    return new Promise(function (resolve, reject) {
      if (window.ApplePaySession) {
        resolve();
        return;
      }
      existing.addEventListener("load", function () {
        resolve();
      });
      existing.addEventListener("error", function () {
        reject(new Error("Apple Pay SDK failed to load"));
      });
    });
  }
  return new Promise(function (resolve, reject) {
    const script = document.createElement("script");
    script.src = "https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js";
    script.async = true;
    script.setAttribute("data-nt-apple-pay-sdk", "1");
    script.crossOrigin = "anonymous";
    script.onload = function () {
      resolve();
    };
    script.onerror = function () {
      reject(new Error("Failed to load Apple Pay SDK"));
    };
    (document.head || document.documentElement).appendChild(script);
  });
}

function loadPayPalSdkForCheckout() {
  if (typeof window.ntLoadPayPalSdk !== "function") {
    return Promise.reject(new Error("PayPal SDK loader is missing"));
  }
  return window.ntLoadPayPalSdk(paypalSdkParams());
}

function buildOrderItems(cart) {
  return (cart.items || [])
    .map(function (item) {
      const id = String(item.id || "").trim();
      const quantity = parseInt(item.quantity || 1, 10);
      if (!id || !Number.isFinite(quantity) || quantity < 1) return null;
      return { id: id, quantity: quantity };
    })
    .filter(Boolean);
}

function currentCheckoutTotal(cart) {
  const items = cart.items || [];
  let orderValue = computeSubtotal(items);
  const totalText = document.getElementById("total");
  if (totalText && totalText.textContent) {
    const parsedTotal = parseFloat(String(totalText.textContent).replace(/[^0-9.]/g, ""));
    if (Number.isFinite(parsedTotal) && parsedTotal > 0) {
      orderValue = parsedTotal;
    }
  }
  return orderValue;
}

function formatApplePayAmount(cart) {
  return Number(currentCheckoutTotal(cart)).toFixed(2);
}

function mapAppleShippingContact(contact) {
  if (!contact) return null;
  const nameParts = [contact.givenName, contact.familyName].filter(Boolean);
  const lines = Array.isArray(contact.addressLines) ? contact.addressLines : [];
  const mapped = {
    fullName: nameParts.join(" ").trim() || String(contact.phoneticGivenName || "").trim(),
    addressLine1: String(lines[0] || "").trim(),
    addressLine2: String(lines[1] || "").trim(),
    city: String(contact.locality || "").trim(),
    state: String(contact.administrativeArea || "").trim(),
    postalCode: String(contact.postalCode || "").trim(),
    countryCode: String(contact.countryCode || "").toUpperCase(),
    email: String(contact.emailAddress || "").trim(),
    phone: String(contact.phoneNumber || "").trim(),
  };
  if (
    !mapped.fullName ||
    !mapped.addressLine1 ||
    !mapped.city ||
    !mapped.postalCode ||
    !/^[A-Z]{2}$/.test(mapped.countryCode)
  ) {
    return null;
  }
  return mapped;
}

function createPayPalOrder(options) {
  options = options || {};
  const liveCart = getCart();
  const liveCountry = options.countryCode || getSelectedCountryCode();
  const orderItems = buildOrderItems(liveCart);
  if (!orderItems.length) {
    return Promise.reject(new Error("Your cart is empty."));
  }
  if (!liveCountry) {
    return Promise.reject(new Error("Select a shipping country to continue."));
  }
  trackPaymentInfo(liveCart.items, options.paymentType || "PayPal");
  const body = {
    countryCode: liveCountry,
    items: orderItems,
  };
  if (options.shipping) body.shipping = options.shipping;
  if (options.email) body.email = options.email;
  if (options.requireShipping) body.requireShipping = true;
  return fetch("/.netlify/functions/paypal-create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then(function (res) {
      return res.json().then(function (data) {
        return { ok: res.ok, data: data };
      });
    })
    .then(function (result) {
      if (!result.ok) throw new Error(result.data.error || "Failed to create order");
      return {
        orderID: result.data.orderID || result.data.id,
        captureToken: result.data.captureToken,
        cart: liveCart,
      };
    });
}

function finishApprovedPayment(data, captureToken, liveCart, options) {
  options = options || {};
  return fetch("/.netlify/functions/paypal-capture-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderID: data.orderID || data.id, captureToken: captureToken }),
  })
    .then(function (res) {
      return res.json().then(function (payload) {
        return { ok: res.ok, payload: payload };
      });
    })
    .then(function (result) {
      if (!result.ok) throw new Error(result.payload.error || "Payment failed");
      const items = (liveCart && liveCart.items) || [];
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
        sessionStorage.setItem(
          "nt-purchase-snapshot",
          JSON.stringify({
            transactionId: transactionId,
            currency: "AUD",
            value: orderValue,
            shipping: shippingValue,
            items: items,
            savedAt: new Date().toISOString(),
          })
        );
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
      const thankYouUrl = "/thank-you.html?" + thankYouParams.toString();
      if (options.deferRedirect) {
        return thankYouUrl;
      }
      window.location.href = thankYouUrl;
      return thankYouUrl;
    });
}

function hideApplePayButton() {
  const appleContainer = document.getElementById("applepay-container");
  if (!appleContainer) return;
  appleContainer.hidden = true;
  appleContainer.replaceChildren();
}

function setupApplePay(seq) {
  const appleContainer = document.getElementById("applepay-container");
  if (!appleContainer) return Promise.resolve(false);
  hideApplePayButton();
  if (typeof paypal === "undefined" || typeof paypal.Applepay !== "function") {
    console.info("[Apple Pay] PayPal Applepay component not available on this SDK load.");
    return Promise.resolve(false);
  }

  // Load Apple's SDK first — ApplePaySession is missing until then on non-Safari browsers.
  return loadApplePaySdk()
    .then(function () {
      if (seq !== paypalMountSeq) return false;
      if (!window.ApplePaySession) {
        console.info("[Apple Pay] ApplePaySession missing (use Safari on iPhone/Mac with Wallet set up).");
        return false;
      }
      if (typeof ApplePaySession.supportsVersion === "function" && !ApplePaySession.supportsVersion(4)) {
        console.info("[Apple Pay] This browser does not support Apple Pay JS version 4.");
        return false;
      }
      if (!ApplePaySession.canMakePayments()) {
        console.info("[Apple Pay] Device cannot make Apple Pay payments (Wallet/Safari required).");
        return false;
      }

      const applepay = paypal.Applepay();
      return applepay.config().then(function (applepayConfig) {
        if (seq !== paypalMountSeq) return false;
        if (!applepayConfig || !applepayConfig.isEligible) {
          console.info("[Apple Pay] PayPal reports merchant/buyer not eligible.", applepayConfig || {});
          return false;
        }

        appleContainer.hidden = false;
        appleContainer.innerHTML =
          '<apple-pay-button id="btn-apple-pay" buttonstyle="black" type="buy" locale="en-AU"></apple-pay-button>';
        const button = document.getElementById("btn-apple-pay");
        if (!button) return false;

        button.addEventListener("click", function () {
          const cart = getCart();
          if (!cart.items || !cart.items.length) {
            setStatus("Your cart is empty.", true);
            return;
          }
          const countryCode = getSelectedCountryCode();
          if (!countryCode) {
            setStatus("Select a shipping country to continue.", true);
            return;
          }

          const paymentRequest = {
            countryCode: applepayConfig.countryCode || "AU",
            currencyCode: "AUD",
            merchantCapabilities: applepayConfig.merchantCapabilities,
            supportedNetworks: applepayConfig.supportedNetworks,
            requiredBillingContactFields: ["name", "postalAddress"],
            requiredShippingContactFields: ["name", "phone", "email", "postalAddress"],
            total: {
              label: "NutriThrive",
              type: "final",
              amount: formatApplePayAmount(cart),
            },
          };

          let session;
          try {
            session = new ApplePaySession(4, paymentRequest);
          } catch (err) {
            console.error("Apple Pay session error:", err);
            setStatus("Apple Pay could not start on this device.", true);
            return;
          }

          session.onvalidatemerchant = function (event) {
            applepay
              .validateMerchant({
                validationUrl: event.validationURL,
                displayName: "NutriThrive",
              })
              .then(function (validateResult) {
                session.completeMerchantValidation(validateResult.merchantSession);
              })
              .catch(function (validateError) {
                console.error("Apple Pay merchant validation failed:", validateError);
                session.abort();
                setStatus("Apple Pay could not be verified for this domain.", true);
              });
          };

          session.onpaymentmethodselected = function () {
            session.completePaymentMethodSelection({
              newTotal: paymentRequest.total,
            });
          };

          session.onshippingcontactselected = function (event) {
            const contactCountry = String(
              (event.shippingContact && event.shippingContact.countryCode) || countryCode
            ).toUpperCase();
            const liveCart = getCart();
            const subtotal = computeSubtotal(liveCart.items);
            let shippingCost = 0;
            if (window.ShippingRates && typeof window.ShippingRates.calculate === "function") {
              const raw = window.ShippingRates.calculate(contactCountry, liveCart.items, subtotal);
              shippingCost = raw === null || raw === undefined ? 0 : Number(raw) || 0;
            }
            const amount = Number((subtotal + shippingCost).toFixed(2)).toFixed(2);
            paymentRequest.total = {
              label: "NutriThrive",
              type: "final",
              amount: amount,
            };
            session.completeShippingContactSelection({
              newTotal: paymentRequest.total,
            });
          };

          session.onpaymentauthorized = function (event) {
            const shipping = mapAppleShippingContact(event.payment && event.payment.shippingContact);
            if (!shipping) {
              console.error("Apple Pay shipping contact incomplete:", event.payment && event.payment.shippingContact);
              try {
                session.completePayment(ApplePaySession.STATUS_FAILURE);
              } catch (completeErr) {
                /* ignore */
              }
              setStatus(
                "Apple Pay needs your full delivery name, street, suburb, postcode and country. Update the address in the Apple Pay sheet and try again.",
                true
              );
              return;
            }
            if (!shipping.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) {
              try {
                session.completePayment(ApplePaySession.STATUS_FAILURE);
              } catch (completeErr) {
                /* ignore */
              }
              setStatus(
                "Apple Pay needs an email address so we can send your order confirmation. Add email in the Apple Pay sheet and try again.",
                true
              );
              return;
            }

            const orderCountry = shipping.countryCode || getSelectedCountryCode() || countryCode;

            createPayPalOrder({
              countryCode: orderCountry,
              shipping: shipping,
              email: shipping.email,
              requireShipping: true,
              paymentType: "Apple Pay",
            })
              .then(function (created) {
                if (!created.orderID) {
                  throw new Error("PayPal did not return an order ID.");
                }
                return applepay
                  .confirmOrder({
                    orderId: created.orderID,
                    token: event.payment.token,
                    billingContact: event.payment.billingContact,
                    shippingContact: event.payment.shippingContact,
                  })
                  .then(function () {
                    return finishApprovedPayment(
                      { orderID: created.orderID },
                      created.captureToken,
                      created.cart,
                      { deferRedirect: true }
                    );
                  });
              })
              .then(function (thankYouUrl) {
                session.completePayment(ApplePaySession.STATUS_SUCCESS);
                window.location.href = thankYouUrl;
              })
              .catch(function (err) {
                console.error("Apple Pay payment failed:", err);
                try {
                  session.completePayment(ApplePaySession.STATUS_FAILURE);
                } catch (completeErr) {
                  /* ignore */
                }
                setStatus("Apple Pay error: " + (err.message || "Unknown error"), true);
              });
          };

          session.oncancel = function () {
            setStatus("");
          };

          session.begin();
        });

        return true;
      });
    })
    .catch(function (err) {
      console.warn("Apple Pay unavailable:", err && err.message);
      hideApplePayButton();
      return false;
    });
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
  hideApplePayButton();
  let captureToken = null;
  const config = {
    createOrder: function () {
      return createPayPalOrder({
        countryCode: getSelectedCountryCode() || countryCode,
        paymentType: "PayPal",
      }).then(function (created) {
        captureToken = created.captureToken;
        return created.orderID;
      });
    },
    onApprove: function (data) {
      return finishApprovedPayment(data, captureToken, getCart()).catch(function (err) {
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
    setupApplePay(seq),
    renderFunding(paypal.FUNDING.PAYPAL, "#paypal-button-container"),
    cardContainer ? renderFunding(paypal.FUNDING.CARD, "#paypal-card-container") : Promise.resolve(false),
  ]).then(function (results) {
    if (seq !== paypalMountSeq) return;
    const appleReady = results[0];
    const paypalReady = results[1];
    const cardReady = results[2];
    const anyRendered = appleReady || paypalReady || cardReady;
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
