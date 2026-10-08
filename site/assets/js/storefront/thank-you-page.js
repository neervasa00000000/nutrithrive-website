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

  function readPurchaseSnapshot() {
    try {
      const snapshot = JSON.parse(sessionStorage.getItem("nt-purchase-snapshot") || "null");
      return snapshot?.transactionId === orderId ? snapshot : null;
    } catch {
      return null;
    }
  }

  function snapshotItems(snapshot) {
    const rows = Array.isArray(snapshot?.items) ? snapshot.items : [];
    return rows
      .map((item) => ({
        id: String(item.id || item.sku || ""),
        name: item.name,
        price: Number(item.price || 0),
        quantity: Number(item.quantity || item.qty || 1),
        variant: item.variant || "",
      }))
      .filter((item) => item.id);
  }

  function renderRetention(items) {
    const R = window.NTRetention;
    if (!R) return;
    const ids = items.map((item) => item.id).filter(Boolean);
    const help = document.getElementById("order-help-blocks");
    const complements = document.getElementById("order-complements");
    const buyAgain = document.getElementById("order-buy-again");
    const review = document.getElementById("order-review");
    if (help) {
      help.innerHTML = ids.length
        ? R.guideBlocks(ids)
        : `<section class="retention-block"><h2>When your parcel arrives</h2><p>See <a href="/order-help/">order help</a> for storage, brewing and packing notes for what you bought.</p></section>`;
      R.bindGuideClicks(help);
    }
    if (review) {
      review.innerHTML = R.reviewBlock({ delayed: true, headingId: "order-review-heading" });
      R.bindReviewClicks(review);
    }
    if (complements) R.renderComplements(complements, ids);
    if (buyAgain) {
      R.renderBuyAgain(buyAgain, { heading: "Buy these again later", source: "thank-you" });
    }
  }

  function persistLastOrder(items) {
    if (!window.NTRetention || !items.length) return;
    window.NTRetention.saveLastOrder({
      orderId,
      items,
      purchasedAt: new Date().toISOString(),
    });
  }

  function sendPurchase() {
    if (!orderId) {
      renderRetention([]);
      return;
    }
    const dedupeKey = `nt-purchase-sent-${orderId}`;
    if (localStorage.getItem(dedupeKey)) {
      const snapshot = readPurchaseSnapshot();
      const items = snapshotItems(snapshot);
      persistLastOrder(items);
      renderRetention(items);
      return;
    }
    const snapshot = readPurchaseSnapshot();
    const items = snapshotItems(snapshot);
    persistLastOrder(items);
    renderRetention(items);

    const purchaseValue = Number(snapshot?.value || (hasValue ? value : 0));
    const shippingValue = Number(snapshot?.shipping || 0);
    let analyticsSent = false;

    if (items.length && window.NT?.trackEcommerce) {
      analyticsSent = window.NT.trackEcommerce("purchase", items, {
        transaction_id: orderId,
        value: purchaseValue,
        tax: 0,
        shipping: shippingValue,
      });
    } else if (typeof window.gtag === "function") {
      const payload = {
        transaction_id: orderId,
        currency: "AUD",
        tax: 0,
        shipping: shippingValue,
      };
      if (purchaseValue > 0) payload.value = purchaseValue;
      if (items.length) payload.items = items;
      window.gtag("event", "purchase", payload);
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
