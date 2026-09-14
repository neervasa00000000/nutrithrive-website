(() => {
  const LAST_ORDER_KEY = "nt-last-order";
  const THRESHOLD_EVENT_KEY = "nt-ship-threshold-fired";
  const GOOGLE_REVIEW_URL = "https://maps.app.goo.gl/9VQVEUQSeGm4XfGB7";
  const SUPPORT = {
    email: "nutrithrive0@gmail.com",
    phone: "+61 438 201 419",
    phoneHref: "tel:+61438201419",
    contactPath: "/contact",
    shippingPath: "/shipping",
  };

  // Complementary SKUs only. Do not invent products. Do not force moringa powder
  // onto every tea/curry/soap basket.
  const COMPLEMENTS = {
    "curry-leaves": ["black-tea", "gift-pack"],
    "black-tea": ["curry-leaves", "gift-pack"],
    "moringa-soap": ["gift-pack", "black-tea"],
    "combo-pack": ["black-tea", "moringa-soap"],
    "gift-pack": ["curry-leaves", "black-tea"],
    "moringa-powder": ["curry-leaves", "black-tea", "moringa-soap"],
    "moringa-200g": ["curry-leaves", "black-tea", "moringa-soap"],
    "moringa-400g": ["curry-leaves", "black-tea", "moringa-soap"],
  };

  const FAMILY = {
    "curry-leaves": "curry-leaves",
    "black-tea": "black-tea",
    "moringa-soap": "moringa-soap",
    "combo-pack": "combo-pack",
    "gift-pack": "gift-pack",
    "moringa-powder": "moringa-powder",
    "moringa-200g": "moringa-powder",
    "moringa-400g": "moringa-powder",
  };

  const GUIDES = {
    "curry-leaves": {
      heading: "Using your dried curry leaves",
      intro: "Keep the pouch sealed and dry. Whole dried leaves go into hot oil or ghee at the start of the pan.",
      links: [
        { href: "/blog/how-to-store-curry-leaves-fresh-dried-australia-2026", label: "How to store curry leaves" },
        { href: "/blog/curry-leaves-in-australian-cooking-how-to-use-2026", label: "Cooking with dried curry leaves" },
        { href: "/blog/curry-leaves-dahl-recipe-30-minutes-australia-2026", label: "30-minute dahl recipe" },
      ],
    },
    "black-tea": {
      heading: "Brewing your Darjeeling tea",
      intro: "Use water at 85 to 90°C, not a rolling boil. 1 to 2 teaspoons, 3 to 5 minutes. Boiling water makes it bitter.",
      links: [
        { href: "/blog/how-to-brew-darjeeling-tea-perfectly-2026", label: "How to brew Darjeeling" },
        { href: "/blog/darjeeling-black-tea-australia-first-flush-second-flush-guide-2026", label: "First flush vs second flush" },
        { href: "/blog/cold-brew-darjeeling-australian-spring-2026", label: "Cold-brew Darjeeling" },
      ],
    },
    "moringa-soap": {
      heading: "Looking after your soap bar",
      intro: "Keep the bar dry between uses so it lasts. Patch-test if you have very sensitive skin. External use only.",
      links: [
        { href: "/products/moringa-soap/", label: "Soap product notes" },
        { href: "/blog/moringa-soap-benefits-skin-guide", label: "Soap guide" },
      ],
    },
    "moringa-powder": {
      heading: "Your moringa powder pack",
      intro: "Store the pouch sealed and dry, away from humidity. If the pack or colour is not what you expected, contact us with your order reference.",
      links: [
        { href: "/products/moringa-powder/", label: "Product page" },
        { href: "/blog/how-long-does-moringa-powder-last-storage-shelf-life-2026", label: "Storage and shelf life" },
      ],
      legalReview: true,
    },
    "combo-pack": {
      heading: "Your combo pack",
      intro: "Keep both pouches sealed and dry, away from humidity. Dried curry leaves go into hot oil or ghee at the start of the pan.",
      links: [
        { href: "/blog/how-to-store-curry-leaves-fresh-dried-australia-2026", label: "Curry leaf storage" },
        { href: "/blog/how-long-does-moringa-powder-last-storage-shelf-life-2026", label: "Powder storage" },
      ],
      legalReview: true,
    },
    "gift-pack": {
      heading: "Your gift pack",
      intro: "Four products, four simple jobs: keep powder and curry leaves dry, brew tea below boiling, and let the soap dry between uses.",
      links: [
        { href: "/blog/how-to-brew-darjeeling-tea-perfectly-2026", label: "Brew the tea" },
        { href: "/blog/how-to-store-curry-leaves-fresh-dried-australia-2026", label: "Store the curry leaves" },
        { href: "/products/gift-pack/", label: "What's in the pack" },
      ],
    },
  };

  // Initial timing assumptions only — not measured reorder behaviour.
  const REORDER_ASSUMPTION_DAYS = {
    "curry-leaves": 45,
    "black-tea": 40,
    "moringa-soap": 30,
    "moringa-powder": 30,
    "moringa-200g": 45,
    "moringa-400g": 60,
    "combo-pack": 40,
    "gift-pack": 45,
  };

  function catalog() {
    return Array.isArray(window.NT_PRODUCTS) ? window.NT_PRODUCTS : [];
  }

  function productById(id) {
    return catalog().find((item) => item.id === id) || null;
  }

  function familyFor(id) {
    return FAMILY[id] || null;
  }

  function auThreshold() {
    const fromRates = window.ShippingRates?.getAuFreeShippingProgressTarget?.();
    const n = Number(fromRates);
    return Number.isFinite(n) && n > 0 ? n : 79;
  }

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  function esc(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function track(name, params = {}) {
    if (window.NT?.trackEvent) {
      window.NT.trackEvent(name, params);
      return;
    }
    if (typeof window.gtag === "function") window.gtag("event", name, params);
  }

  function readLastOrder() {
    try {
      const raw = JSON.parse(localStorage.getItem(LAST_ORDER_KEY) || "null");
      if (!raw || raw.v !== 1 || !Array.isArray(raw.items)) return null;
      const items = raw.items
        .map((row) => ({
          id: String(row.id || ""),
          qty: Math.max(1, Number.parseInt(row.qty, 10) || 1),
        }))
        .filter((row) => row.id);
      if (!items.length) return null;
      return {
        orderId: String(raw.orderId || ""),
        purchasedAt: String(raw.purchasedAt || ""),
        items,
      };
    } catch {
      return null;
    }
  }

  function saveLastOrder({ orderId, items, purchasedAt }) {
    const rows = (Array.isArray(items) ? items : [])
      .map((item) => ({
        id: String(item.id || item.sku || ""),
        qty: Math.max(1, Number.parseInt(item.qty || item.quantity, 10) || 1),
      }))
      .filter((item) => item.id);
    if (!rows.length) return null;
    const record = {
      v: 1,
      orderId: String(orderId || "").slice(0, 64),
      purchasedAt: purchasedAt || new Date().toISOString(),
      items: rows,
    };
    try {
      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(record));
    } catch {
      return null;
    }
    return record;
  }

  function resolveLastOrder(order) {
    const source = order || readLastOrder();
    if (!source) return { available: [], missing: [], purchasedAt: "", orderId: "" };
    const available = [];
    const missing = [];
    source.items.forEach((row) => {
      const product = productById(row.id);
      if (!product) {
        missing.push(row);
        return;
      }
      available.push({ ...product, qty: row.qty });
    });
    return {
      available,
      missing,
      purchasedAt: source.purchasedAt,
      orderId: source.orderId,
    };
  }

  function complementsFor(ids, limit = 3) {
    const inSet = new Set(ids);
    const ranked = [];
    const seen = new Set();
    ids.forEach((id) => {
      (COMPLEMENTS[id] || []).forEach((cid) => {
        if (inSet.has(cid) || seen.has(cid)) return;
        const product = productById(cid);
        if (!product) return;
        seen.add(cid);
        ranked.push(product);
      });
    });
    return ranked.slice(0, limit);
  }

  function guidesForIds(ids) {
    const families = [...new Set(ids.map(familyFor).filter(Boolean))];
    return families.map((family) => GUIDES[family]).filter(Boolean);
  }

  function shippingProgress(subtotal, opts = {}) {
    const threshold = auThreshold();
    const sub = Number(subtotal) || 0;
    const remaining = Math.max(0, threshold - sub);
    const unlocked = sub >= threshold && sub > 0;
    if (opts.track && unlocked && !sessionStorage.getItem(THRESHOLD_EVENT_KEY)) {
      try {
        sessionStorage.setItem(THRESHOLD_EVENT_KEY, "1");
      } catch {
        /* ignore */
      }
      track("shipping_threshold_reached", { value: Number(sub.toFixed(2)), currency: "AUD" });
    }
    return {
      threshold,
      subtotal: sub,
      remaining,
      unlocked,
      percent: Math.min(100, Math.max(0, (sub / threshold) * 100)),
      message: !sub
        ? `Free Australian shipping from ${money(threshold)}`
        : unlocked
          ? "You've unlocked free Australian shipping"
          : `${money(remaining)} away from free Australian shipping`,
    };
  }

  function progressHtml(subtotal, opts = {}) {
    const progress = shippingProgress(subtotal, opts);
    return `<div class="shipping-progress ${progress.unlocked ? "is-complete" : ""}">
      <div class="shipping-progress__copy"><strong>${esc(progress.message)}</strong><span>${money(progress.threshold)} target</span></div>
      <div class="shipping-progress__track" role="progressbar" aria-label="Progress towards free Australian shipping" aria-valuemin="0" aria-valuemax="${progress.threshold}" aria-valuenow="${Math.min(progress.threshold, Number(progress.subtotal.toFixed(2)))}" aria-valuetext="${esc(progress.message)}">
        <span style="width:${progress.percent.toFixed(2)}%"></span>
      </div>
    </div>`;
  }

  function addCurrentProduct(product, qty = 1) {
    if (!product) return false;
    const count = Math.max(1, Number.parseInt(qty, 10) || 1);
    if (window.NT?.addToCart) {
      window.NT.addToCart(product, count);
      return true;
    }
    return false;
  }

  function reorderAvailable(available, source) {
    const added = [];
    available.forEach((product) => {
      if (addCurrentProduct(product, product.qty)) added.push(product);
    });
    track(source === "buy-again" ? "buy_again_click" : "reorder_click", {
      item_count: added.length,
      currency: "AUD",
    });
    return added;
  }

  function bindGuideClicks(root) {
    root?.querySelectorAll("[data-retention-guide]").forEach((link) => {
      link.addEventListener("click", () => {
        track("post_purchase_guide_click", { link_url: link.getAttribute("href") || "" });
      });
    });
  }

  function bindReviewClicks(root) {
    root?.querySelectorAll("[data-retention-review]").forEach((link) => {
      link.addEventListener("click", () => {
        track("review_request_click", { link_url: GOOGLE_REVIEW_URL });
      });
    });
  }

  function reviewBlock(opts = {}) {
    const delayed = Boolean(opts.delayed);
    return `<section class="retention-block" aria-labelledby="${esc(opts.headingId || "retention-review")}">
      <h2 id="${esc(opts.headingId || "retention-review")}">How was your NutriThrive order?</h2>
      <p>${delayed ? "After the parcel has arrived and you've used it, your feedback helps us improve." : "Your feedback helps us improve."}</p>
      <p><a class="btn btn-secondary" data-retention-review href="${GOOGLE_REVIEW_URL}" target="_blank" rel="noopener noreferrer">Leave Google feedback</a></p>
    </section>`;
  }

  function supportBlock() {
    return `<section class="retention-block" aria-labelledby="retention-support">
      <h2 id="retention-support">Need help with this order?</h2>
      <p>If something is missing, damaged, or not what you expected, tell us. Include your order reference if you have it.</p>
      <p><a href="${SUPPORT.contactPath}">Contact form</a> · <a href="mailto:${SUPPORT.email}">${SUPPORT.email}</a> · <a href="${SUPPORT.phoneHref}">${SUPPORT.phone}</a></p>
      <p><a href="${SUPPORT.shippingPath}">Shipping and returns</a></p>
    </section>`;
  }

  function guideBlocks(ids) {
    const guides = guidesForIds(ids);
    if (!guides.length) return "";
    return guides
      .map(
        (guide) => `<section class="retention-block">
        <h2>${esc(guide.heading)}</h2>
        <p>${esc(guide.intro)}</p>
        <ul class="retention-links">${guide.links
          .map((link) => `<li><a data-retention-guide href="${esc(link.href)}">${esc(link.label)}</a></li>`)
          .join("")}</ul>
      </section>`
      )
      .join("");
  }

  function productCard(product, opts = {}) {
    const qty = Number(opts.qty || 1);
    const showQty = Boolean(opts.showQty);
    return `<article class="retention-card" data-product-id="${esc(product.id)}">
      <a class="retention-card__media" href="${esc(product.href)}"><img src="${esc(product.image)}" alt="" width="96" height="96"></a>
      <div class="retention-card__body">
        <h3><a href="${esc(product.href)}">${esc(product.name)}</a></h3>
        <p>${esc(product.variant || "")} · ${money(product.price)}</p>
        ${showQty ? `<label class="retention-qty">Qty <input type="number" min="1" max="20" value="${qty}" inputmode="numeric" data-buy-qty="${esc(product.id)}"></label>` : ""}
        <div class="retention-card__actions">
          <button class="btn btn-primary" type="button" data-buy-again="${esc(product.id)}">Add to cart</button>
          <a href="${esc(product.href)}">View product</a>
        </div>
      </div>
    </article>`;
  }

  function bindBuyButtons(root, source) {
    root?.querySelectorAll("[data-buy-again]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-buy-again");
        const product = productById(id);
        if (!product) return;
        const qtyInput = root.querySelector(`[data-buy-qty="${CSS.escape(id)}"]`);
        const qty = qtyInput ? Math.max(1, Number.parseInt(qtyInput.value, 10) || 1) : 1;
        addCurrentProduct(product, qty);
        if (source !== "cross-sell") {
          track("buy_again_click", { item_id: id, currency: "AUD" });
        }
        btn.textContent = "Added";
        setTimeout(() => {
          btn.textContent = "Add to cart";
        }, 1400);
      });
    });
    const reorderBtn = root?.querySelector("[data-reorder-last]");
    reorderBtn?.addEventListener("click", () => {
      const resolved = resolveLastOrder();
      reorderAvailable(resolved.available, source || "reorder");
      window.location.href = document.documentElement.dataset.ntLive === "1" ? "/cart" : "/cart/";
    });
  }

  function renderBuyAgain(target, opts = {}) {
    if (!target) return;
    const resolved = resolveLastOrder();
    if (!resolved.available.length && !resolved.missing.length) {
      if (opts.emptyHtml) target.innerHTML = opts.emptyHtml;
      else target.innerHTML = "";
      return;
    }
    const dateLabel = resolved.purchasedAt
      ? new Date(resolved.purchasedAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })
      : "";
    const missingHtml = resolved.missing.length
      ? `<p class="retention-note">We could not match ${resolved.missing.length === 1 ? "one previous item" : `${resolved.missing.length} previous items`} to a current product. Nothing was substituted.</p>`
      : "";
    target.innerHTML = `<section class="retention-block" aria-labelledby="buy-again-heading">
      <h2 id="buy-again-heading">${esc(opts.heading || "Buy again")}</h2>
      ${dateLabel ? `<p class="retention-note">Last order in this browser${resolved.orderId ? ` · ${esc(resolved.orderId)}` : ""} · ${esc(dateLabel)}</p>` : ""}
      <div class="retention-card-list">${resolved.available.map((product) => productCard(product, { qty: product.qty, showQty: true })).join("")}</div>
      ${missingHtml}
      ${resolved.available.length ? `<p><button class="btn btn-secondary" type="button" data-reorder-last>Reorder last order</button></p>` : ""}
    </section>`;
    bindBuyButtons(target, opts.source || "buy-again");
  }

  function renderComplements(target, ids) {
    if (!target) return;
    const recs = complementsFor(ids);
    if (!recs.length) {
      target.innerHTML = "";
      return;
    }
    target.innerHTML = `<section class="retention-block" aria-labelledby="retention-complements">
      <h2 id="retention-complements">Add to your next order</h2>
      <div class="retention-card-list">${recs.map((product) => productCard(product)).join("")}</div>
    </section>`;
    bindBuyButtons(target, "cross-sell");
  }

  window.NTRetention = {
    GOOGLE_REVIEW_URL,
    SUPPORT,
    REORDER_ASSUMPTION_DAYS,
    auThreshold,
    money,
    catalog,
    productById,
    familyFor,
    complementsFor,
    guidesForIds,
    shippingProgress,
    progressHtml,
    readLastOrder,
    saveLastOrder,
    resolveLastOrder,
    reorderAvailable,
    addCurrentProduct,
    track,
    reviewBlock,
    supportBlock,
    guideBlocks,
    renderBuyAgain,
    renderComplements,
    bindGuideClicks,
    bindReviewClicks,
  };
})();
