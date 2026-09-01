(() => {
  function text(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function show(id, on) {
    const el = document.getElementById(id);
    if (el) el.hidden = !on;
  }

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  const params = new URLSearchParams(window.location.search);
  const orderId = (params.get("orderId") || "").trim();
  const itemName = (params.get("item") || "").trim();
  const qty = Number.parseInt(params.get("qty"), 10);
  const value = Number.parseFloat(params.get("value"));
  const hasQty = Number.isFinite(qty) && qty > 0;
  const hasValue = Number.isFinite(value) && value > 0;
  const hasFacts = Boolean(orderId || itemName || hasQty || hasValue);

  if (orderId) text("order-id", orderId);
  show("order-id-row", Boolean(orderId));

  if (itemName) {
    text("order-item", hasQty ? `${itemName} × ${qty}` : itemName);
  }
  show("order-item-row", Boolean(itemName));

  if (hasValue) text("order-total", money(value));
  show("order-total-row", hasValue);
  show("order-facts", hasFacts);

  const live = document.getElementById("nt-live");
  if (live && orderId) {
    live.textContent = `Order confirmed. Reference ${orderId}.`;
  }

  if (!orderId) return;

  function readPurchaseSnapshot() {
    try {
      const snapshot = JSON.parse(sessionStorage.getItem("nt-purchase-snapshot") || "null");
      return snapshot?.transactionId === orderId ? snapshot : null;
    } catch {
      return null;
    }
  }

  function sendPurchase() {
    const dedupeKey = `nt-purchase-sent-${orderId}`;
    if (localStorage.getItem(dedupeKey)) return;
    const snapshot = readPurchaseSnapshot();
    const fallbackItems = [{
      id: "MORINGA",
      name: itemName || "NutriThrive Moringa Powder",
      price: hasValue && hasQty ? value / qty : hasValue ? value : 11,
      quantity: hasQty ? qty : 1,
      variant: "",
    }];
    const items = snapshot?.items?.length ? snapshot.items : fallbackItems;
    const purchaseValue = Number(snapshot?.value || (hasValue ? value : 11));
    const shippingValue = Number(snapshot?.shipping || 0);
    let analyticsSent = false;

    if (window.NT?.trackEcommerce) {
      analyticsSent = window.NT.trackEcommerce("purchase", items, {
        transaction_id: orderId,
        value: purchaseValue,
        tax: 0,
        shipping: shippingValue,
      });
    } else if (typeof window.gtag === "function") {
      window.gtag("event", "purchase", {
        transaction_id: orderId,
        value: purchaseValue,
        currency: "AUD",
        tax: 0,
        shipping: shippingValue,
        items: items,
      });
      analyticsSent = true;
    }

    if (typeof window.rdt === "function") {
      const conversionId = `purchase_${String(orderId).replace(/[^a-zA-Z0-9_-]/g, "")}`;
      window.rdt("track", "Purchase", { conversionId });
    }
    if (analyticsSent) localStorage.setItem(dedupeKey, new Date().toISOString());
  }

  sendPurchase();
  window.addEventListener("nt-analytics-ready", sendPurchase);
})();
