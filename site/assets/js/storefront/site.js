const CART_KEY = "nt-storefront-cart";
const VIEWED_KEY = "nt-storefront-viewed";
const ASSET_VERSION = "20260831-2";

function freshAsset(url) {
  if (!url || !url.startsWith("/assets/") || url.includes("?v=")) return url;
  return `${url}?v=${ASSET_VERSION}`;
}

const icons = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.2-3.2"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 7h15l-1.4 8.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.6L6 7Z"/><path d="M6 7 5 4H2"/><circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
};

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

function readCart() {
  if (window.Cart?.get) {
    const cart = window.Cart.get() || { items: [] };
    return (cart.items || []).map((item) => ({ ...item, qty: Number(item.quantity || 1) }));
  }
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function emitCartChange() {
  window.dispatchEvent(new CustomEvent("nt-cart-change"));
}

function writeCart(items) {
  if (window.Cart?.get && window.Cart?.add) {
    const current = window.Cart.get()?.items || [];
    const nextIds = new Set(items.map((item) => item.id));
    current.forEach((item) => {
      if (!nextIds.has(item.id)) window.Cart.remove(item.id);
    });
    items.forEach((item) => {
      const qty = Number(item.qty || item.quantity || 1);
      const existing = (window.Cart.get()?.items || []).find((row) => row.id === item.id);
      if (existing) window.Cart.updateQuantity(item.id, qty);
      else {
        window.Cart.add({
          ...item,
          quantity: qty,
          weight: Number(item.weight || 0),
        });
      }
    });
    updateCartCount();
    emitCartChange();
    return;
  }
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartCount();
  emitCartChange();
}

function cartCount() {
  if (window.Cart?.getItemCount) return Number(window.Cart.getItemCount()) || 0;
  return readCart().reduce((n, i) => n + (i.qty || 1), 0);
}

function adoptPreviewCart() {
  if (!window.Cart?.get || !window.Cart?.add) return;
  let preview = [];
  try {
    preview = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    preview = [];
  }
  localStorage.removeItem(CART_KEY);
  if (!Array.isArray(preview) || !preview.length) return;
  const liveItems = window.Cart.get()?.items || [];
  if (liveItems.length) return;
  preview.forEach((item) => {
    window.Cart.add({
      ...item,
      quantity: Number(item.qty || item.quantity || 1),
      weight: Number(item.weight || 0),
    });
  });
}

function updateCartCount() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    const n = cartCount();
    el.textContent = String(n);
    el.setAttribute("data-empty", n === 0 ? "true" : "false");
  });
}

window.NT = {
  money,
  readCart,
  writeCart,
  addToCart(product, qty = 1) {
    product = { ...product, image: freshAsset(product.image) };
    if (window.Cart?.add) {
      window.Cart.add({
        ...product,
        quantity: qty,
        weight: Number(product.weight || 0),
        variant: product.variant || "",
        href: product.href || "",
      });
      updateCartCount();
      emitCartChange();
      announce(`${product.name} added to cart`);
      return;
    }
    const items = readCart();
    const found = items.find((i) => i.id === product.id);
    if (found) found.qty += qty;
    else items.push({ ...product, qty });
    writeCart(items);
    announce(`${product.name} added to cart`);
  },
  setQty(id, qty) {
    if (window.Cart?.updateQuantity) {
      window.Cart.updateQuantity(id, Math.max(1, qty));
      updateCartCount();
      emitCartChange();
      return;
    }
    const items = readCart()
      .map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
      .filter((i) => i.qty > 0);
    writeCart(items);
  },
  remove(id) {
    if (window.Cart?.remove) {
      window.Cart.remove(id);
      updateCartCount();
      emitCartChange();
      return;
    }
    writeCart(readCart().filter((i) => i.id !== id));
  },
  subtotal() {
    return readCart().reduce((n, i) => n + i.price * i.qty, 0);
  },
};

function recordViewed(product) {
  if (!product?.id) return;
  let ids = [];
  try {
    ids = JSON.parse(localStorage.getItem(VIEWED_KEY) || "[]");
  } catch {
    ids = [];
  }
  ids = [product.id, ...ids.filter((id) => id !== product.id)].slice(0, 8);
  localStorage.setItem(VIEWED_KEY, JSON.stringify(ids));
}

function announce(text) {
  const live = document.getElementById("nt-live");
  if (!live) return;
  live.textContent = "";
  requestAnimationFrame(() => {
    live.textContent = text;
  });
}

function bindHeader() {
  const menuBtn = document.querySelector("[data-menu]");
  const mobile = document.getElementById("nav-mobile");
  if (menuBtn && mobile) {
    menuBtn.addEventListener("click", () => {
      const open = mobile.hidden;
      mobile.hidden = !open;
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menuBtn.innerHTML = open ? icons.close : icons.menu;
    });
  }

  const searchBtn = document.querySelector("[data-search]");
  const panel = document.getElementById("search-panel");
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  if (searchBtn && panel) {
    const sheet = panel.querySelector(".search-sheet");
    let previouslyFocused = null;
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const close = () => {
      if (panel.hidden) return;
      panel.hidden = true;
      searchBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("dialog-open");
      (previouslyFocused || searchBtn).focus();
    };
    searchBtn.addEventListener("click", () => {
      if (!panel.hidden) {
        close();
        return;
      }
      previouslyFocused = document.activeElement;
      panel.hidden = false;
      searchBtn.setAttribute("aria-expanded", "true");
      document.body.classList.add("dialog-open");
      input?.focus();
    });
    panel.addEventListener("click", (e) => {
      if (e.target === panel) close();
    });
    panel.querySelector("[data-search-close]")?.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || panel.hidden || !sheet) return;
      const focusable = [...sheet.querySelectorAll(focusableSelector)].filter(
        (el) => !el.hidden && el.getAttribute("aria-hidden") !== "true"
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
    input?.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if (!results) return;
      if (q.length < 2) {
        results.innerHTML = "";
        return;
      }
      const hits = (window.NT_SEARCH || []).filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.blurb || "").toLowerCase().includes(q)
      );
      results.replaceChildren();
      if (hits.length) {
        hits.slice(0, 8).forEach((item) => {
          const link = document.createElement("a");
          link.href = item.href;
          const title = document.createElement("strong");
          title.textContent = item.title;
          const kind = document.createElement("span");
          kind.textContent = item.kind;
          link.append(title, kind);
          results.append(link);
        });
      } else {
        const message = document.createElement("p");
        message.textContent = `No matches for “${input.value}”.`;
        results.append(message);
      }
    });
  }

  document.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const raw = btn.getAttribute("data-add");
      if (!raw) return;
      try {
        const product = JSON.parse(raw);
        const qtyEl = document.querySelector("input[data-qty]");
        const qty = qtyEl ? Math.max(1, parseInt(qtyEl.value, 10) || 1) : 1;
        window.NT.addToCart(product, qty);
        recordViewed(product);
        btn.textContent = "Added";
        setTimeout(() => {
          btn.textContent = btn.getAttribute("data-label") || "Add to cart";
        }, 1400);
      } catch (err) {
        console.error("Could not add to cart", err);
      }
    });
  });

  document.querySelectorAll("[data-buy-now]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const raw = btn.getAttribute("data-buy-now");
      if (!raw) return;
      try {
        const product = JSON.parse(raw);
        const qtyEl = document.querySelector("input[data-qty]");
        const qty = qtyEl ? Math.max(1, parseInt(qtyEl.value, 10) || 1) : 1;
        window.NT.addToCart(product, qty);
        location.href = document.documentElement.dataset.ntLive === "1" ? "/payment" : "/cart";
      } catch (err) {
        console.error("Could not buy now", err);
      }
    });
  });

  const mainGalleryImage = document.querySelector("[data-pdp-image]");
  document.querySelectorAll("[data-gallery-thumb]").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const src = thumb.getAttribute("data-src");
      const alt = thumb.getAttribute("data-alt") || "Product photograph";
      if (mainGalleryImage && src) {
        mainGalleryImage.src = src;
        mainGalleryImage.alt = alt;
      }
      document.querySelectorAll("[data-gallery-thumb]").forEach((item) =>
        item.removeAttribute("aria-current")
      );
      thumb.setAttribute("aria-current", "true");
    });
  });

  document.querySelectorAll("[data-qty-minus]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const inputEl = document.querySelector("input[data-qty]");
      if (!inputEl) return;
      inputEl.value = String(Math.max(1, (parseInt(inputEl.value, 10) || 1) - 1));
    });
  });
  document.querySelectorAll("[data-qty-plus]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const inputEl = document.querySelector("input[data-qty]");
      if (!inputEl) return;
      inputEl.value = String(Math.min(20, (parseInt(inputEl.value, 10) || 1) + 1));
    });
  });

  adoptPreviewCart();
  updateCartCount();
  emitCartChange();

  if (location.pathname.includes("/products/")) {
    const addBtn = document.querySelector("[data-add]");
    if (addBtn) {
      try {
        recordViewed(JSON.parse(addBtn.getAttribute("data-add")));
      } catch {
        /* ignore */
      }
    }
  }
}

function pdpMoney(p) {
  const unit = p.unit
    ? ` <span style="font-weight:400;color:var(--color-text-secondary);font-size:14px">${p.unit}</span>`
    : "";
  const strike = p.was && p.was > p.price ? ` <s>${money(p.was)}</s>` : "";
  return `${money(p.price)}${unit}${strike}`;
}

function applyPdpVariant(id, writeUrl) {
  const p = (window.NT_PRODUCTS || []).find((item) => item.id === id);
  if (!p) return;
  const img = document.querySelector("[data-pdp-image]");
  const title = document.querySelector("[data-pdp-title]");
  const price = document.querySelector("[data-pdp-price]");
  const intro = document.querySelector("[data-pdp-intro]");
  const cost = document.querySelector("[data-pdp-cost]");
  const crumb = document.querySelector("[data-pdp-crumb]");
  const addBtn = document.querySelector(".pdp [data-add]");
  const buyBtn = document.querySelector(".pdp [data-buy-now]");
  const gallery = document.querySelector(".pdp-gallery");
  if (img) {
    img.src = p.image;
    img.alt = `${p.name} ${p.variant}`;
  }
  if (title) title.textContent = p.name;
  if (price) price.innerHTML = pdpMoney(p);
  if (intro) intro.textContent = p.detail || p.benefit;
  if (cost) cost.textContent = p.costNote || "";
  if (crumb) crumb.textContent = p.name;
  if (gallery) {
    gallery.classList.toggle("is-wide", id === "moringa-400g" || id === "combo-pack");
  }
  if (addBtn) {
    addBtn.setAttribute(
      "data-add",
      JSON.stringify({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        href: p.href,
        variant: p.variant,
        weight: p.weight || 0,
      })
    );
  }
  if (buyBtn) {
    buyBtn.setAttribute(
      "data-buy-now",
      JSON.stringify({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        href: p.href,
        variant: p.variant,
        weight: p.weight || 0,
      })
    );
  }
  if (writeUrl) {
    const url = new URL(location.href);
    url.searchParams.set("v", p.id);
    history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }
}

function bindPdpVariant() {
  const select = document.getElementById("variant");
  if (!select) return;
  const requested = new URLSearchParams(location.search).get("v");
  if (requested && [...select.options].some((opt) => opt.value === requested)) {
    select.value = requested;
  }
  select.addEventListener("change", () => {
    applyPdpVariant(select.value, true);
    const addBtn = document.querySelector(".pdp [data-add]");
    if (addBtn) {
      try {
        recordViewed(JSON.parse(addBtn.getAttribute("data-add")));
      } catch {
        /* ignore */
      }
    }
  });
  applyPdpVariant(select.value, false);
}

const CONSENT_KEY = "nt-storefront-cookie-consent";
const OFFER_KEY = "nt-storefront-welcome-offer";
const SIGNUP_KEY = "nt-storefront-newsletter-signup";

function bindNewsletterForms() {
  document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = form.querySelector('input[name="email"]');
      const consent = form.querySelector('input[name="marketingConsent"]');
      const status = form.querySelector("[data-newsletter-status]");
      if (!email?.checkValidity()) {
        if (status) status.textContent = "Enter a valid email address.";
        email?.focus();
        return;
      }
      if (!consent?.checked) {
        if (status) status.textContent = "Please confirm that you want to receive these emails.";
        consent?.focus();
        return;
      }
      const record = {
        email: email.value.trim(),
        marketingConsent: true,
        source: form.dataset.source || "website",
        consentVersion: "2026-08-31-v1",
        consentedAt: new Date().toISOString(),
        previewOnly: true,
      };
      localStorage.setItem(SIGNUP_KEY, JSON.stringify(record));
      localStorage.setItem(OFFER_KEY, JSON.stringify({ state: "joined", at: Date.now() }));
      if (status) status.innerHTML = `Thanks — your preview code is <strong>WELCOME5</strong>. Use it at checkout. No email is actually sent from this local preview.`;
      form.querySelector('button[type="submit"]')?.setAttribute("disabled", "");
      announce("Welcome code WELCOME5 is ready");
    });
  });
}

function bindUnsubscribeForm() {
  const form = document.querySelector("[data-unsubscribe-form]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = form.querySelector('input[name="email"]');
    const status = form.querySelector("[data-unsubscribe-status]");
    if (!email?.checkValidity()) {
      status.textContent = "Enter a valid email address.";
      email?.focus();
      return;
    }
    const existing = localStorage.getItem(SIGNUP_KEY);
    localStorage.removeItem(SIGNUP_KEY);
    localStorage.setItem("nt-storefront-unsubscribe", JSON.stringify({ email: email.value.trim(), requestedAt: new Date().toISOString(), previewOnly: true }));
    status.textContent = existing ? "Unsubscribed in this local preview. No further preview marketing consent is stored." : "Request recorded in this local preview. No live email system is connected.";
    announce("Unsubscribe request recorded");
  });
}

function bindWelcomeOffer() {
  const offer = document.querySelector("[data-welcome-offer]");
  if (!offer || localStorage.getItem(SIGNUP_KEY) || localStorage.getItem(OFFER_KEY)) return;
  let lastFocus = null;
  const close = () => {
    offer.hidden = true;
    document.body.classList.remove("modal-open");
    localStorage.setItem(OFFER_KEY, JSON.stringify({ state: "dismissed", at: Date.now() }));
    lastFocus?.focus?.();
  };
  offer.querySelectorAll("[data-offer-close]").forEach((button) => button.addEventListener("click", close));
  setTimeout(() => {
    if (localStorage.getItem(SIGNUP_KEY) || localStorage.getItem(OFFER_KEY)) return;
    lastFocus = document.activeElement;
    offer.hidden = false;
    document.body.classList.add("modal-open");
    offer.querySelector("input")?.focus();
  }, 7000);
}

function readConsent() {
  try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || "null"); } catch { return null; }
}

function bindCookieChoices() {
  const banner = document.querySelector("[data-cookie-banner]");
  const modal = document.querySelector("[data-cookie-modal]");
  if (!banner || !modal) return;
  const analytics = modal.querySelector("[data-cookie-analytics]");
  const marketing = modal.querySelector("[data-cookie-marketing]");
  let lastFocus = null;
  const save = (analyticsValue, marketingValue) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ necessary: true, analytics: analyticsValue, marketing: marketingValue, savedAt: new Date().toISOString(), version: 1 }));
    banner.hidden = true;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    announce("Cookie choices saved");
    lastFocus?.focus?.();
  };
  const open = (trigger) => {
    const current = readConsent();
    analytics.checked = Boolean(current?.analytics);
    marketing.checked = Boolean(current?.marketing);
    lastFocus = trigger || document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector("[data-cookie-save]")?.focus();
  };
  document.querySelectorAll("[data-cookie-settings]").forEach((button) => button.addEventListener("click", () => open(button)));
  banner.querySelector("[data-cookie-reject]")?.addEventListener("click", () => save(false, false));
  banner.querySelector("[data-cookie-accept]")?.addEventListener("click", () => save(true, true));
  banner.querySelector("[data-cookie-manage]")?.addEventListener("click", (event) => open(event.currentTarget));
  modal.querySelector("[data-cookie-save]")?.addEventListener("click", () => save(analytics.checked, marketing.checked));
  modal.querySelectorAll("[data-cookie-close]").forEach((button) => button.addEventListener("click", () => {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    lastFocus?.focus?.();
  }));
  if (!readConsent()) banner.hidden = false;
}

function isLiveSite() {
  return document.documentElement.dataset.ntLive === "1";
}

function bindGrowthFeatures() {
  if (!isLiveSite()) {
    bindNewsletterForms();
    bindUnsubscribeForm();
    bindWelcomeOffer();
  }
  bindCookieChoices();
}

function bindJournalSearch() {
  const input = document.querySelector("[data-journal-search]");
  if (!input) return;
  const form = document.querySelector("[data-journal-search-form]");
  const clear = document.querySelector("[data-journal-search-clear]");
  const status = document.querySelector("[data-journal-search-status]");
  const cards = [...document.querySelectorAll("[data-journal-card]")];
  const feature = document.querySelector("[data-journal-feature]");
  const empty = document.querySelector("[data-journal-empty]");
  const sections = [...document.querySelectorAll(".journal-section")];
  const stopWords = new Set(["a", "an", "and", "are", "can", "do", "does", "for", "how", "i", "in", "is", "it", "my", "of", "on", "the", "to", "what", "when", "where", "which", "with"]);
  const aliases = { dosage: "dose take amount serving", dose: "dosage take amount serving", expiry: "storage shelf life last", expire: "storage shelf life last", kids: "children child", tea: "brew drink caffeine darjeeling", skin: "soap face", buy: "choose brands comparison", safe: "safety side effects" };
  const termsFor = (query) => query.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((term) => term.length > 1 && !stopWords.has(term)).flatMap((term) => [term, ...(aliases[term] || "").split(" ").filter(Boolean)]);
  const update = () => {
    const query = input.value.trim();
    const terms = termsFor(query);
    const searching = query.length > 0;
    document.body.classList.toggle("journal-searching", searching);
    let count = 0;
    cards.forEach((card) => {
      const text = card.dataset.searchText || "";
      const extra = card.hasAttribute("data-journal-extra");
      const match = !terms.length || terms.some((term) => text.includes(term));
      const visible = searching ? match : !extra;
      card.hidden = !visible;
      if (visible) count += 1;
    });
    sections.forEach((section) => { section.hidden = searching && !section.querySelector("[data-journal-card]:not([hidden])"); });
    if (feature) feature.hidden = searching;
    if (empty) empty.hidden = !searching || count > 0;
    clear.hidden = !searching;
    status.textContent = searching ? `${count} ${count === 1 ? "guide" : "guides"} found for “${query}”.` : `Search all ${cards.length + (feature ? 1 : 0)} NutriThrive guides by question, topic or ingredient.`;
    const url = new URL(location.href);
    if (query) url.searchParams.set("q", query); else url.searchParams.delete("q");
    history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  };
  form?.addEventListener("submit", (event) => event.preventDefault());
  input.addEventListener("input", update);
  clear?.addEventListener("click", () => { input.value = ""; update(); input.focus(); });
  document.querySelector("[data-journal-empty-clear]")?.addEventListener("click", () => { input.value = ""; update(); input.focus(); });
  const initial = new URLSearchParams(location.search).get("q");
  if (initial) { input.value = initial; update(); }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    bindHeader();
    bindPdpVariant();
    bindGrowthFeatures();
    bindJournalSearch();
    setTimeout(() => emitCartChange(), 0);
  });
} else {
  bindHeader();
  bindPdpVariant();
  bindGrowthFeatures();
  bindJournalSearch();
  setTimeout(() => emitCartChange(), 0);
}
