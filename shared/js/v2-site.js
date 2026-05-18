/**
 * Website 2.0 — page interactions: cart UI, product PDP, shop, contact, checkout.
 */
(function () {

  function isHomePage() {
    const p = location.pathname.replace(/\/$/, '') || '/';
    return p === '/' || p.endsWith('/index.html');
  }
  function isShopPage() {
    const p = location.pathname.replace(/\/$/, '');
    return p === '/products' || /\/products\/index\.html$/.test(location.pathname);
  }
  function isBlogJournalPage() {
    const p = location.pathname;
    return /\/blog\/?$/.test(p) || /\/blog\/index\.html$/.test(p);
  }
  function isProductPdpPage() {
    const parts = location.pathname.split('/').filter(Boolean);
    const i = parts.indexOf('products');
    if (i < 0 || !parts[i + 1]) return false;
    const slug = parts[i + 1].replace(/\.html$/i, '');
    if (!slug || slug === 'index') return false;
    const rest = parts.slice(i + 2);
    if (!rest.length) return true;
    return rest.length === 1 && /^index\.html$/i.test(rest[0]);
  }

  const D = () => window.NT_SITE_DATA;
  const C = () => window.CartV2;
  function productImg(src) {
    const url = D()?.productImageUrl?.(src);
    return url || src || '';
  }
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (n) => `$${Number(n).toFixed(2)}`;
  const escAttr = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
  const page = () => {
    let name = location.pathname.split('/').pop() || 'index.html';
    if (!name.includes('.')) name += '.html';
    return name;
  };

  function resolveHref(path) {
    try {
      return new URL(path, window.location.href).href;
    } catch {
      return path;
    }
  }

  function productFromEl(el) {
    const id = el.dataset.addCart || el.dataset.productId;
    const p = D()?.getProduct?.(id);
    if (p) return { ...p, quantity: 1 };
    return {
      id,
      name: el.dataset.name,
      price: parseFloat(el.dataset.price),
      was: el.dataset.was ? parseFloat(el.dataset.was) : null,
      image: el.dataset.image,
      tag: el.dataset.tag || '',
      weight: parseFloat(el.dataset.weight || 0),
      quantity: 1,
    };
  }

  function normalizeAddCartButtons(root = document) {
    $$('[data-add-cart]', root).forEach((btn) => {
      btn.type = 'button';
      btn.classList.add('nt-add-cart-btn');
    });
  }

  function addToCartFromButton(btn) {
    if (typeof window.ntAddToCart === 'function') {
      window.ntAddToCart(btn, btn.dataset.redirectCart === 'true');
      return;
    }
    if (!window.CartV2) {
      console.error('[v2] Cart not loaded');
      return;
    }
    const pdpRoot = btn.closest('#nt-pdp-app');
    const qty = parseInt(
      pdpRoot?.querySelector('[data-nt-qty]')?.textContent || btn.dataset.qty || '1',
      10
    );
    const p = productFromEl(btn);
    const price = Number(p.price);
    if (!p.id || !p.name || Number.isNaN(price)) {
      console.error('[v2] Invalid product data', p);
      return;
    }
    p.quantity = qty;
    p.price = price;
    CartV2.add(p);
    C()?.updateUI?.();
    document.dispatchEvent(new CustomEvent('nt-cart-updated'));
  }

  function getPaymentUrl() {
    const raw = D()?.paymentUrl || '/payment';
    try {
      return new URL(raw, window.location.origin).pathname || '/payment';
    } catch {
      return '/payment';
    }
  }

  function hasCartItems() {
    const cart = C()?.get?.() ?? window.Cart?.get?.();
    return Boolean(cart?.items?.length);
  }

  function goToPayment() {
    window.location.assign(getPaymentUrl());
  }

  function completeCheckout() {
    if (!hasCartItems()) {
      alert('Your cart is empty. Add products from the shop first.');
      return;
    }
    goToPayment();
  }

  function completeLivePayment() {
    if (!hasCartItems()) {
      alert('Your cart is empty. Add products from the shop first.');
      return;
    }
    goToPayment();
  }

  /** Capture phase so add-to-cart runs before handlers that stop bubbling (carousel, PDP, etc.). */
  function bindAddToCartClicks() {
    if (document.documentElement.dataset.ntAddCartBound) return;
    document.documentElement.dataset.ntAddCartBound = '1';
    document.addEventListener(
      'click',
      (e) => {
        const addBtn = e.target.closest('[data-add-cart], .nt-add-cart-btn');
        if (!addBtn) return;
        e.preventDefault();
        addToCartFromButton(addBtn);
      },
      true
    );
  }

  function bindGlobalClicks() {
    document.addEventListener('click', (e) => {
      const rm = e.target.closest('[data-cart-remove]');
      if (rm) {
        e.preventDefault();
        C()?.remove?.(rm.dataset.cartRemove);
        renderCartPage();
        return;
      }

      const minus = e.target.closest('[data-qty-minus]');
      if (minus) {
        e.preventDefault();
        const id = minus.dataset.qtyMinus;
        const wrap = minus.closest('[data-cart-line]');
        const span = wrap?.querySelector('[data-line-qty]');
        const cur = parseInt(span?.textContent || '1', 10);
        C()?.updateQuantity?.(id, cur - 1);
        renderCartPage();
        return;
      }

      const plus = e.target.closest('[data-qty-plus]');
      if (plus) {
        e.preventDefault();
        const id = plus.dataset.qtyPlus;
        const wrap = plus.closest('[data-cart-line]');
        const span = wrap?.querySelector('[data-line-qty]');
        const cur = parseInt(span?.textContent || '1', 10);
        C()?.updateQuantity?.(id, cur + 1);
        renderCartPage();
        return;
      }

      const checkout = e.target.closest('[data-checkout]');
      if (checkout) {
        if (!hasCartItems()) {
          e.preventDefault();
          alert('Your cart is empty. Add products from the shop first.');
          return;
        }
        if (checkout.tagName === 'BUTTON') {
          e.preventDefault();
          goToPayment();
        }
        return;
      }
    });
  }

  function bindPdpQty(root) {
    if (!root || root.dataset.ntQtyBound) return;
    root.dataset.ntQtyBound = '1';
    root.addEventListener('click', (e) => {
      const minus = e.target.closest('[data-nt-qty-minus]');
      const plus = e.target.closest('[data-nt-qty-plus]');
      if (!minus && !plus) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const qtyEl = root.querySelector('[data-nt-qty]');
      if (!qtyEl) return;
      const cur = parseInt(qtyEl.textContent, 10) || 1;
      if (minus) qtyEl.textContent = String(Math.max(1, cur - 1));
      if (plus) qtyEl.textContent = String(Math.min(99, cur + 1));
    });
  }

  function bindPdpActions(root, data) {
    if (!root || !data) return;
    const labHref = resolveHref(data.labReport);
    const shipHref = resolveHref('/pages/shipping/shipping-returns.html');

    const labLink = root.querySelector('#nt-pdp-lab');
    if (labLink) {
      labLink.href = labHref;
      labLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(labHref, '_blank', 'noopener,noreferrer');
      });
    }

    const shipLink = root.querySelector('#nt-pdp-shipping');
    if (shipLink) {
      shipLink.href = shipHref;
      shipLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.assign(shipHref);
      });
    }
  }


  function getProductIdFromUrl() {
    const params = new URLSearchParams(location.search);
    if (params.get('id')) return params.get('id');
    const parts = location.pathname.split('/').filter(Boolean);
    const i = parts.indexOf('products');
    if (i >= 0 && parts[i + 1]) {
      const slug = parts[i + 1].replace(/\.html$/, '');
      return D()?.productSlugToId?.[slug] || slug;
    }
    return 'moringa-powder-100g';
  }

  function renderProductPage(productId) {
    const root = $('#nt-pdp-app');
    const data = D();
    if (!root || !data) return;

    const p = data.getProduct(productId);
    if (!p) {
      root.innerHTML = `<div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24 text-center">
        <h1 class="font-display text-headline-lg text-forest-deep mb-4">Product not found</h1>
        <a href="/products/" class="text-moringa-leaf font-semibold underline">Back to shop</a>
      </div>`;
      return;
    }

    const pdp = p.pdp || {};
    const features = pdp.features || [];
    const faqs = pdp.faqs || [];
    const savePct = p.was ? Math.round((1 - p.price / p.was) * 100) : 0;
    const variantHtml =
      pdp.variantPicker && data.moringaVariants?.length
        ? `<div class="mb-4">
            <label class="font-label-lg text-label-lg text-forest-deep block mb-2" for="nt-variant-select">Choose pack</label>
            <select id="nt-variant-select" class="w-full"></select>
          </div>`
        : '';

    const featuresHtml = features
      .map(
        (f) => `
      <div class="p-4 bg-pure-white rounded-lg border border-outline-variant/10 flex items-center gap-3">
        <span class="material-symbols-outlined text-moringa-leaf">${f.icon}</span>
        <span class="font-label-lg text-label-lg">${f.text}</span>
      </div>`
      )
      .join('');

    const faqsHtml = faqs
      .map(
        (item) => `
      <details class="group bg-pure-white rounded-lg border border-outline-variant/10">
        <summary class="flex items-center justify-between p-6 cursor-pointer list-none font-label-lg text-label-lg text-forest-deep">
          ${item.q}
          <span class="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
        </summary>
        <div class="px-6 pb-6 font-body-md text-body-md text-on-surface-variant">${item.a}</div>
      </details>`
      )
      .join('');

    const labBadge = pdp.showLabBadge
      ? `<div class="absolute top-6 left-6 bg-pure-white/90 backdrop-blur shadow-sm px-4 py-2 rounded-full flex items-center gap-2 border border-outline-variant/30">
          <span class="material-symbols-outlined text-moringa-leaf text-[20px]" style="font-variation-settings: 'FILL' 1;">verified</span>
          <span class="font-label-lg text-label-lg text-forest-deep">Lab-Tested Purity</span>
        </div>`
      : '';

    const labHref = resolveHref(data.labReport);
    const shipHref = resolveHref('/pages/shipping/shipping-returns.html');

    root.innerHTML = `
<nav class="mb-8 flex items-center gap-2 text-label-sm font-label-sm text-outline flex-wrap">
  <a class="hover:text-moringa-leaf" href="/">Home</a>
  <span class="material-symbols-outlined text-[14px]">chevron_right</span>
  <a class="hover:text-moringa-leaf" href="/products/">Products</a>
  <span class="material-symbols-outlined text-[14px]">chevron_right</span>
  <span class="text-forest-deep" id="nt-pdp-crumb">${p.shortName || p.name}</span>
</nav>
<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
  <div class="relative group">
    <div class="aspect-[4/5] rounded-xl overflow-hidden bg-white shadow-sm border border-forest-deep/5">
      <img id="nt-pdp-image" alt="${p.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="${productImg(p.image)}" loading="lazy"/>
    </div>
    ${labBadge}
  </div>
  <div class="flex flex-col gap-6">
    <div>
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed/30 text-moringa-leaf rounded-full mb-4">
        <span class="material-symbols-outlined text-[18px]">local_shipping</span>
        <span class="font-label-sm text-label-sm uppercase tracking-wider">In Stock — Melbourne Dispatch</span>
      </div>
      <h1 id="nt-pdp-title" class="font-display text-headline-lg md:text-display text-forest-deep mb-2">${pdp.headline || p.name}</h1>
      <div class="flex items-baseline gap-4 mb-4 flex-wrap">
        <span id="nt-pdp-price" class="font-display text-headline-lg text-moringa-leaf">${money(p.price)}</span>
        ${p.was ? `<span id="nt-pdp-was" class="font-body-md text-body-md text-outline line-through">${money(p.was)}</span>` : ''}
        ${savePct > 0 ? `<span id="nt-pdp-save" class="bg-terracotta-clay text-pure-white px-2 py-0.5 rounded font-label-sm text-label-sm">Save ${savePct}%</span>` : ''}
      </div>
      <p id="nt-pdp-intro" class="font-body-lg text-body-lg text-on-surface-variant max-w-prose">${pdp.intro || p.description || ''}</p>
      <p class="font-label-sm text-on-surface-variant mt-2">${p.tag || ''}</p>
    </div>
    <div class="grid grid-cols-2 gap-4">${featuresHtml}</div>
    <div class="space-y-4 pt-4">
      ${variantHtml}
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="nt-qty-control border border-outline bg-pure-white shrink-0">
          <button type="button" data-nt-qty-minus class="nt-qty-btn" aria-label="Decrease quantity"><span class="material-symbols-outlined">remove</span></button>
          <span class="nt-qty-value" data-nt-qty aria-live="polite">1</span>
          <button type="button" data-nt-qty-plus class="nt-qty-btn" aria-label="Increase quantity"><span class="material-symbols-outlined">add</span></button>
        </div>
        <button type="button" id="nt-pdp-add" data-add-cart="${p.id}" data-name="${escAttr(p.name)}" data-price="${p.price}" data-was="${p.was ?? ''}" data-image="${escAttr(productImg(p.image))}" data-tag="${escAttr(p.tag || '')}" data-weight="${p.weight ?? ''}" class="nt-add-cart-btn flex-1 bg-terracotta-clay text-pure-white font-bold py-4 rounded-lg hover:brightness-110 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer">
          <span class="material-symbols-outlined pointer-events-none">shopping_cart</span> Add to Cart
        </button>
      </div>
      <p class="text-label-sm font-label-sm text-center py-2 bg-surface-container-low rounded-lg text-on-surface-variant italic">Order before 2pm for same-day dispatch</p>
    </div>
    <div class="flex flex-col gap-3 border-t border-outline-variant/20 pt-6">
      <a id="nt-pdp-lab" class="flex items-center justify-between group p-3 rounded-lg hover:bg-pure-white transition-all cursor-pointer" href="${labHref}" target="_blank" rel="noopener noreferrer">
        <span class="flex items-center gap-3 font-label-lg text-label-lg text-forest-deep pointer-events-none">
          <span class="material-symbols-outlined text-moringa-leaf">description</span> View Lab Report Summary
        </span>
        <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform pointer-events-none">arrow_forward</span>
      </a>
      <a id="nt-pdp-shipping" class="flex items-center justify-between group p-3 rounded-lg hover:bg-pure-white transition-all cursor-pointer" href="${shipHref}">
        <span class="flex items-center gap-3 font-label-lg text-label-lg text-forest-deep pointer-events-none">
          <span class="material-symbols-outlined text-moringa-leaf">local_shipping</span> Shipping &amp; Delivery Details
        </span>
        <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform pointer-events-none">arrow_forward</span>
      </a>
    </div>
  </div>
</div>
<div class="mt-section-gap grid grid-cols-1 md:grid-cols-3 gap-gutter">
  <section class="md:col-span-2 space-y-12">
    <div>
      <h2 class="font-display text-headline-lg text-forest-deep mb-6">${pdp.detailTitle || 'Product details'}</h2>
      <div class="bg-pure-white rounded-xl p-8 border border-outline-variant/10 shadow-sm">
        <p class="font-body-lg text-body-lg text-on-surface-variant">${pdp.detailBody || p.description || ''}</p>
      </div>
    </div>
    ${faqs.length ? `<div><h2 class="font-display text-headline-lg text-forest-deep mb-6">Frequently Asked Questions</h2><div class="space-y-4">${faqsHtml}</div></div>` : ''}
  </section>
  <aside class="space-y-8">
    <div class="bg-forest-deep p-8 rounded-xl text-pure-white">
      <h3 class="font-display text-headline-md mb-6">Why NutriThrive?</h3>
      <ul class="space-y-6">
        <li class="flex gap-4"><span class="material-symbols-outlined text-primary-fixed">verified</span><div><p class="font-label-lg text-label-lg">Lab-Tested in Australia</p><p class="text-surface-variant/70 text-label-sm">Every batch verified for purity.</p></div></li>
        <li class="flex gap-4"><span class="material-symbols-outlined text-primary-fixed">local_shipping</span><div><p class="font-label-lg text-label-lg">Melbourne Warehouse</p><p class="text-surface-variant/70 text-label-sm">Fast delivery from Truganina.</p></div></li>
        <li class="flex gap-4"><span class="material-symbols-outlined text-primary-fixed">package_2</span><div><p class="font-label-lg text-label-lg">Small Batches Only</p><p class="text-surface-variant/70 text-label-sm">Fresh stock guaranteed.</p></div></li>
      </ul>
    </div>
    <div class="bg-primary-fixed/20 p-8 rounded-xl border border-moringa-leaf/10 relative overflow-hidden">
      <p class="font-body-md text-body-md text-forest-deep italic relative z-10 mb-4">"I've tried many moringa brands, but NutriThrive is by far the best. Bright green colour, fresh taste, and I feel the difference."</p>
      <p class="font-label-lg text-label-lg text-moringa-leaf relative z-10">— James H.</p>
    </div>
  </aside>
</div>
`;


    document.title = `${p.name} | NutriThrive`;

    if (pdp.variantPicker && data.moringaVariants) {
      const select = $('#nt-variant-select');
      if (select) {
        data.moringaVariants.forEach((v) => {
          const o = document.createElement('option');
          o.value = v.id;
          o.textContent = v.label;
          select.appendChild(o);
        });
        select.value = productId;
        select.addEventListener('change', () => {
          history.replaceState(null, '', data.productPageUrl(select.value));
          renderProductPage(select.value);
        });
      }
    }

    bindPdpActions(root, data);
    bindPdpQty(root);
    normalizeAddCartButtons(root);
  }

  function initProductPage() {
    const root = $('#nt-pdp-app');
    if (!root) return;
    if (!isProductPdpPage()) return;
    bindPdpQty(root);
    renderProductPage(getProductIdFromUrl());
  }

  function renderCartPage() {
    const root = $('#nt-cart-app');
    if (!root) return;

    const data = D();
    const cart = C().get() || { items: [], total: 0, itemCount: 0 };
    const countryCode = C().getShippingCountry?.() || 'AU';
    const ship = C().estimateShippingDetails?.(cart, countryCode) || {
      cost: C().estimateShipping(cart, countryCode),
      weightGrams: 0,
      countryCode,
      tierLabel: null,
    };
    const threshold = C().freeShippingThreshold?.(countryCode) ?? data.shipping.freeAuThreshold;
    const subtotal = cart.total;
    const shipping = ship.cost;
    const away = Math.max(0, threshold - subtotal);
    const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
    const total = subtotal + shipping;
    const countryName = window.ShippingRates?.getCountryName?.(countryCode) || countryCode;
    const shipLabel =
      countryCode === 'AU'
        ? 'Shipping (Australia est.)'
        : `Shipping (${countryName} est.)`;
    const freeShipNote =
      countryCode === 'AU'
        ? `Free AU shipping ${money(threshold)}+`
        : `Free worldwide shipping ${money(data.shipping.freeWorldThreshold ?? 90)}+`;
    const popularCountries = ['AU', 'NZ', 'US', 'GB', 'CA', 'SG', 'IN'];
    const countryList = window.ShippingRates?.getCountryList?.() || [];
    const countryOptions = (countryList.length ? countryList : popularCountries.map((code) => ({ code, name: code })))
      .filter((c, i, arr) => arr.findIndex((x) => x.code === c.code) === i)
      .map(
        (c) =>
          `<option value="${c.code}"${c.code === countryCode ? ' selected' : ''}>${c.name}</option>`
      )
      .join('');

    const crossSell = data.products
      .filter((p) => !cart.items.some((i) => i.id === p.id))
      .slice(0, 2);

    const lines =
      cart.items.length === 0
        ? `<div class="bg-pure-white p-12 rounded-xl text-center border border-outline-variant/10">
            <p class="font-body-lg text-on-surface-variant mb-6">Your cart is empty.</p>
            <a href="/products/" class="inline-block bg-moringa-leaf text-pure-white px-8 py-3 rounded-full font-label-lg">Shop products</a>
          </div>`
        : cart.items
            .map((item) => {
              const lineTotal = item.price * item.quantity;
              return `
          <div class="bg-pure-white p-8 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col md:flex-row gap-8" data-cart-line>
            <div class="w-40 h-40 bg-parchment-base rounded-lg flex items-center justify-center p-4 shrink-0">
              <img alt="${item.name}" class="w-full h-full object-contain" src="${item.image}" loading="lazy"/>
            </div>
            <div class="flex-grow space-y-4">
              <div class="flex justify-between items-start w-full">
                <div>
                  <h3 class="font-display text-headline-md text-forest-deep mb-1">${item.name}</h3>
                  <p class="text-on-surface-variant font-label-sm">${item.tag || ''}</p>
                </div>
                <button type="button" class="material-symbols-outlined text-outline hover:text-error" data-cart-remove="${item.id}" aria-label="Remove">delete</button>
              </div>
              <div class="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-outline-variant/10">
                <div class="flex items-center border border-outline-variant/40 rounded-full p-1 bg-surface">
                  <button type="button" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-outline-variant/20" data-qty-minus="${item.id}">−</button>
                  <span class="px-4 font-label-lg" data-line-qty>${item.quantity}</span>
                  <button type="button" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-outline-variant/20" data-qty-plus="${item.id}">+</button>
                </div>
                <div class="text-right">
                  ${item.was ? `<span class="text-on-surface-variant line-through text-label-sm">${money(item.was)}</span>` : ''}
                  <div class="font-display text-headline-md text-moringa-leaf">${money(lineTotal)}</div>
                </div>
              </div>
            </div>
          </div>`;
            })
            .join('');

    const crossHtml = crossSell
      .map(
        (p) => `
      <div class="bg-pure-white p-4 rounded-xl border border-outline-variant/10 flex items-center gap-4">
        <div class="w-20 h-20 bg-parchment-base rounded-lg shrink-0 p-2"><img src="${p.image}" alt="${p.name}" class="w-full h-full object-contain"/></div>
        <div>
          <h5 class="font-label-lg">${p.name}</h5>
          <p class="text-on-surface-variant text-label-sm mb-1">${money(p.price)}</p>
          <button type="button" class="nt-add-cart-btn text-moringa-leaf text-label-sm font-bold hover:underline cursor-pointer" data-add-cart="${p.id}" data-name="${p.name.replace(/"/g, '&quot;')}" data-price="${p.price}" data-was="${p.was || ''}" data-image="${p.image}" data-tag="${(p.tag || '').replace(/"/g, '&quot;')}" data-weight="${p.weight ?? ''}">Add to Cart +</button>
        </div>
      </div>`
      )
      .join('');

    root.innerHTML = `
      <header class="mb-12">
        <h1 class="font-display text-headline-lg md:text-display mb-2">Your Cart</h1>
        <p class="text-on-surface-variant font-body-md">${cart.itemCount} item${cart.itemCount === 1 ? '' : 's'} · ${money(subtotal)} subtotal</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        <div class="lg:col-span-8 space-y-6">
          ${
            cart.items.length
              ? `<div class="bg-pure-white p-6 rounded-xl border border-outline-variant/10">
            <div class="flex justify-between items-center mb-4 text-sm">
              <span class="font-label-lg flex items-center gap-2">
                <span class="material-symbols-outlined text-moringa-leaf">local_shipping</span>
                ${
                  away > 0
                    ? `You're <strong class="text-moringa-leaf">${money(away)}</strong> from free shipping`
                    : 'You qualify for free shipping!'
                }
              </span>
              <span class="text-on-surface-variant">${money(subtotal)} / ${money(threshold)}</span>
            </div>
            <div class="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
              <div class="bg-moringa-leaf h-full transition-all" style="width:${pct}%"></div>
            </div>
          </div>`
              : ''
          }
          ${lines}
          ${
            crossSell.length
              ? `<div class="pt-8"><h4 class="font-display text-headline-md mb-6">Complete your ritual</h4><div class="grid grid-cols-1 sm:grid-cols-2 gap-gutter">${crossHtml}</div></div>`
              : ''
          }
        </div>
        <aside class="lg:col-span-4 sticky top-36 space-y-6">
          <div class="bg-forest-deep text-pure-white p-8 rounded-xl shadow-xl">
            <h3 class="font-display text-headline-md mb-6 text-primary-fixed">Order Summary</h3>
            ${
              cart.items.length
                ? `<label class="block mb-4 text-left">
              <span class="block font-label-sm uppercase tracking-widest opacity-60 mb-2">Ship to</span>
              <select id="nt-ship-country" class="w-full rounded-lg border border-white/20 bg-white/10 text-pure-white px-3 py-2.5 font-body-md focus:ring-2 focus:ring-primary-fixed/40 focus:border-primary-fixed">
                ${countryOptions}
              </select>
            </label>`
                : ''
            }
            <div class="space-y-4 font-body-md border-b border-white/10 pb-6">
              <div class="flex justify-between opacity-80"><span>Subtotal</span><span>${money(subtotal)}</span></div>
              <div class="flex justify-between opacity-80 gap-4">
                <span class="shrink-0">${shipLabel}</span>
                <span class="text-right">${shipping === 0 ? 'FREE' : money(shipping)}</span>
              </div>
              ${
                cart.items.length && ship.weightGrams
                  ? `<p class="text-[11px] opacity-50 leading-snug">Based on ${ship.weightGrams}g total${ship.tierLabel ? ` · ${ship.tierLabel} rate band` : ''} · live Sendle/AusPost tables</p>`
                  : ''
              }
            </div>
            <div class="py-6 flex justify-between items-end">
              <div><span class="block font-label-sm uppercase tracking-widest opacity-60">Total</span>
              <span class="font-display text-display text-primary-fixed">${money(total)}</span></div>
              <span class="text-label-sm opacity-60">AUD</span>
            </div>
            <a href="${cart.items.length ? getPaymentUrl() : '#'}" data-checkout role="button" class="w-full bg-terracotta-clay text-pure-white font-label-lg py-5 rounded-full flex items-center justify-center gap-2 hover:brightness-110 transition-all no-underline ${cart.items.length ? '' : 'opacity-50 cursor-not-allowed pointer-events-none'}" ${cart.items.length ? '' : 'aria-disabled="true" tabindex="-1"'}>
              Proceed to payment <span class="material-symbols-outlined pointer-events-none">arrow_forward</span>
            </a>
            <p class="text-center text-[11px] opacity-40 mt-4">${freeShipNote}</p>
          </div>
        </aside>
      </div>`;

    C()?.updateUI?.();
    bindCartShipping(root);
    bindCartCheckout(root);
  }

  function bindCartCheckout(root) {
    const el = root?.querySelector('[data-checkout]');
    if (!el || el.dataset.ntCheckoutBound === '1') return;
    el.dataset.ntCheckoutBound = '1';
    el.addEventListener('click', (e) => {
      if (!hasCartItems()) {
        e.preventDefault();
        alert('Your cart is empty. Add products from the shop first.');
        return;
      }
      if (el.tagName === 'BUTTON') {
        e.preventDefault();
        goToPayment();
      }
    });
  }

  function renderPaymentPage() {
    if (
      document.getElementById('paypal-button-container') ||
      document.querySelector('main.nt-payment-live .checkout-wrap')
    ) {
      return;
    }
    const root = $('#nt-payment-app');
    if (!root) return;

    const data = D();
    const cart = C().get() || { items: [], total: 0, itemCount: 0 };
    const countryCode = C().getShippingCountry?.() || 'AU';
    const ship = C().estimateShippingDetails?.(cart, countryCode) || {
      cost: 0,
      weightGrams: 0,
      countryCode,
    };
    const subtotal = cart.total;
    const total = subtotal + ship.cost;
    const countryName = window.ShippingRates?.getCountryName?.(countryCode) || countryCode;

    if (!cart.items.length) {
      root.innerHTML = `
        <div class="bg-pure-white p-12 rounded-xl text-center border border-outline-variant/10 max-w-lg mx-auto">
          <p class="font-body-lg text-on-surface-variant mb-6">Your cart is empty.</p>
          <a href="/products/" class="inline-block bg-moringa-leaf text-pure-white px-8 py-3 rounded-full font-label-lg">Shop products</a>
        </div>`;
      return;
    }

    const lines = cart.items
      .map(
        (item) => `
      <div class="flex justify-between gap-4 py-3 border-b border-outline-variant/10 text-sm">
        <span class="text-on-surface-variant">${item.quantity}× ${item.name}</span>
        <span class="font-semibold text-forest-deep">${money(item.price * item.quantity)}</span>
      </div>`
      )
      .join('');

    root.innerHTML = `
      <header class="mb-10">
        <h1 class="font-display text-headline-lg md:text-display mb-2">Payment</h1>
        <p class="text-on-surface-variant font-body-md">Review your order, then continue to secure PayPal checkout (live site).</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        <div class="lg:col-span-7 space-y-6">
          <div class="bg-pure-white p-8 rounded-xl border border-outline-variant/10">
            <h2 class="font-display text-headline-md text-forest-deep mb-4">Order items</h2>
            ${lines}
          </div>
          <div class="bg-pure-white p-8 rounded-xl border border-outline-variant/10">
            <p class="font-body-md text-on-surface-variant leading-relaxed mb-4">
              PayPal or Apple Pay will show your wallet name, email, and shipping address. Confirm those details carefully before you pay.
            </p>
            <p class="text-label-sm text-on-surface-variant">Shipping country: <strong class="text-forest-deep">${countryName}</strong> · change on the <a class="text-moringa-leaf underline" href="/cart">cart page</a>.</p>
          </div>
        </div>
        <aside class="lg:col-span-5 sticky top-36">
          <div class="bg-forest-deep text-pure-white p-8 rounded-xl shadow-xl space-y-4">
            <h3 class="font-display text-headline-md text-primary-fixed">Order total</h3>
            <div class="flex justify-between opacity-80 text-sm"><span>Subtotal</span><span>${money(subtotal)}</span></div>
            <div class="flex justify-between opacity-80 text-sm"><span>Shipping (est.)</span><span>${ship.cost === 0 ? 'FREE' : money(ship.cost)}</span></div>
            <div class="flex justify-between items-end pt-4 border-t border-white/10">
              <span class="font-label-sm uppercase tracking-widest opacity-60">Total</span>
              <span class="font-display text-display text-primary-fixed">${money(total)}</span>
            </div>
            <button type="button" data-live-payment class="w-full bg-terracotta-clay text-pure-white font-label-lg py-5 rounded-full flex items-center justify-center gap-2 hover:brightness-110">
              Pay with PayPal (live) <span class="material-symbols-outlined">lock</span>
            </button>
            <a href="/cart" class="block text-center text-sm opacity-70 hover:opacity-100 underline">← Back to cart</a>
          </div>
        </aside>
      </div>`;

    root.querySelector('[data-live-payment]')?.addEventListener('click', (e) => {
      e.preventDefault();
      completeLivePayment();
    });
  }

  function bindCartShipping(root) {
    const select = root?.querySelector('#nt-ship-country');
    if (!select || select.dataset.ntShipBound) return;
    select.dataset.ntShipBound = '1';
    select.addEventListener('change', () => {
      C().setShippingCountry?.(select.value);
      renderCartPage();
    });
  }

  function initContactForm() {
    const form = $('#nt-contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const subject = encodeURIComponent(fd.get('subject') || 'NutriThrive inquiry');
      const body = encodeURIComponent(
        `Name: ${fd.get('name')}\nEmail: ${fd.get('email')}\n\n${fd.get('message')}`
      );
      try {
        window.location.href = `mailto:${D().contact.email}?subject=${subject}&body=${body}`;
      } catch {
        /* ignore */
      }
      setTimeout(() => {
        window.location.href = '/pages/contact/thank-you.html';
      }, 400);
    });
  }

  function initNewsletterForm() {
    const form = $('#nt-newsletter-form');
    if (!form) return;
    const action = (form.getAttribute('action') || '').toLowerCase();
    if (action.includes('formsubmit')) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = '/pages/newsletter/thank-you.html';
    });
  }

  const reviewStarsHtml =
    '<div class="flex gap-1 text-terracotta-clay mb-4" aria-hidden="true">' +
    Array(5)
      .fill('<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: \'FILL\' 1">star</span>')
      .join('') +
    '</div>';

  function reviewCardHtml(t) {
    const bg = t.avatarBg || 'bg-primary-fixed';
    const quote = String(t.quote).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    return `
<article class="nt-review-card bg-pure-white p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
  ${reviewStarsHtml}
  <p class="font-body-md text-body-md text-on-surface mb-6 italic line-clamp-5">"${quote}"</p>
  <div class="flex items-center gap-4">
    <div class="w-10 h-10 rounded-full ${bg} flex items-center justify-center font-bold text-moringa-leaf shrink-0">${t.initials}</div>
    <div>
      <p class="font-label-lg text-label-lg text-forest-deep">${t.author}</p>
      <p class="font-label-sm text-label-sm text-on-surface-variant">${t.meta}</p>
    </div>
  </div>
</article>`;
  }

  function initHomeReviews() {
    if (!isHomePage()) return;
    const items = D()?.testimonials || [];
    if (!items.length) return;

    const section = [...document.querySelectorAll('section')].find((s) =>
      s.querySelector('h2')?.textContent?.includes('Trusted by Aussies')
    );
    if (!section || section.dataset.ntReviewsReady) return;
    section.dataset.ntReviewsReady = '1';
    section.id = 'testimonials';

    const oldGrid = section.querySelector('.grid');
    if (!oldGrid) return;

    const cards = items.map(reviewCardHtml).join('');
    const wrap = document.createElement('div');
    wrap.className = 'nt-reviews-marquee mt-4';
    wrap.innerHTML = `
      <div class="nt-reviews-mask">
        <div class="nt-reviews-track" role="region" aria-label="Customer reviews scrolling">
          ${cards}${cards}
        </div>
      </div>`;
    oldGrid.replaceWith(wrap);
  }

  function shopProductCardHtml(p) {
    const href = p.href || D().productPageUrl(p.id);
    const title = p.shortName || p.name;
    const cartName = p.cartName || p.name;
    const tag = p.tag || '';
    const wasBlock = p.was
      ? `<span class="text-on-surface-variant/60 line-through text-sm">${money(p.was)}</span>`
      : '';
    return `
<article id="${p.id}" class="nt-shop-card group bg-pure-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col">
  <a href="${href}" class="nt-shop-card-media block relative">
    <img alt="${title}" class="nt-shop-card-img" src="${productImg(p.thumb || p.image)}" loading="lazy" width="400" height="400"/>
    <span class="absolute top-3 left-3 bg-moringa-leaf text-pure-white text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase">${p.badge || 'New'}</span>
  </a>
  <div class="nt-shop-card-body p-4 flex flex-col flex-grow">
    <h3 class="nt-shop-card-title font-display text-forest-deep mb-1"><a href="${href}" class="hover:text-moringa-leaf">${title}</a></h3>
    <p class="nt-shop-card-tag font-label-sm text-label-sm text-on-surface-variant mb-3">${tag}</p>
    <div class="nt-shop-card-footer mt-auto flex items-center justify-between pt-3 border-t border-outline-variant/10">
      <div class="flex flex-col">
        <span class="nt-shop-card-price text-terracotta-clay font-bold">${money(p.price)}</span>
        ${wasBlock}
      </div>
      <button type="button" data-add-cart="${p.id}" data-name="${cartName.replace(/"/g, '&quot;')}" data-price="${p.price}" data-was="${p.was ?? ''}" data-image="${productImg(p.image)}" data-tag="${tag.replace(/"/g, '&quot;')}" class="nt-add-cart-btn bg-terracotta-clay text-pure-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-moringa-leaf transition-colors relative z-20 cursor-pointer" aria-label="Add to cart">
        <span class="material-symbols-outlined text-[18px] pointer-events-none">add_shopping_cart</span>
      </button>
    </div>
  </div>
</article>`;
  }

  function initShopPage() {
    if (!isShopPage()) return;
    const grid = $('#nt-shop-grid');
    if (grid?.dataset.staticShop) return;
    const data = D();
    if (!grid || !data?.getCatalogProducts) return;
    if (grid.dataset.ntShopReady) return;
    const products = data.getCatalogProducts();
    if (!products.length) return;
    grid.dataset.ntShopReady = '1';
    grid.innerHTML = products.map((p) => shopProductCardHtml(p)).join('');
    normalizeAddCartButtons(grid);
  }

  function productCardHtml(p) {
    const href = p.href || D().productPageUrl(p.id);
    const wasLine = p.was
      ? `<span class="nt-card-was text-on-surface-variant/60 line-through text-sm">${money(p.was)}</span>`
      : '<span class="nt-card-was text-on-surface-variant/60 line-through text-sm invisible" aria-hidden="true">$0.00</span>';
    return `
<article class="nt-carousel-card group bg-pure-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
  <a href="${href}" class="nt-card-media block relative">
    <img alt="${p.name}" class="nt-card-img" src="${productImg(p.thumb || p.image)}" loading="lazy" width="320" height="320"/>
    <span class="absolute top-2.5 left-2.5 bg-moringa-leaf text-pure-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase z-[1]">${p.badge || 'New'}</span>
  </a>
  <div class="nt-card-body flex flex-col">
    <h3 class="nt-card-title font-display text-forest-deep line-clamp-2"><a href="${href}" class="hover:text-moringa-leaf">${p.shortName || p.name}</a></h3>
    <p class="nt-card-tag font-label-sm text-label-sm text-on-surface-variant line-clamp-2">${p.tag || '&nbsp;'}</p>
    <div class="nt-card-footer mt-auto flex items-end justify-between gap-2 border-t border-outline-variant/10">
      <div class="nt-card-price flex flex-col justify-end">
        <span class="nt-card-price-now text-terracotta-clay font-bold leading-tight">${money(p.price)}</span>
        ${wasLine}
      </div>
      <button type="button" data-add-cart="${p.id}" data-name="${p.name}" data-price="${p.price}" data-was="${p.was ?? ''}" data-image="${productImg(p.image)}" data-tag="${p.tag || ''}" class="nt-add-cart-btn nt-carousel-add-btn bg-terracotta-clay text-pure-white rounded-full flex items-center justify-center hover:bg-moringa-leaf transition-colors shrink-0 relative z-20 cursor-pointer" aria-label="Add ${p.name} to cart">
        <span class="material-symbols-outlined pointer-events-none">add_shopping_cart</span>
      </button>
    </div>
  </div>
</article>`;
  }

  function initHomePage() {
    if (!isHomePage()) return;
    const data = D();
    if (!data) return;

    const productsSection = $('#products');
    if (productsSection && !productsSection.dataset.ntProductsReady) {
      const viewAll = productsSection.querySelector('a[href="#"], a.group.flex.items-center');
      if (viewAll) viewAll.href = '/products/';

      const oldGrid = productsSection.querySelector('.grid');
      if (oldGrid && data.products?.length) {
        productsSection.dataset.ntProductsReady = '1';
        const cards = data.products.map((p) => productCardHtml(p)).join('');
        const wrap = document.createElement('div');
        wrap.className = 'nt-products-carousel-wrap';
        wrap.innerHTML = `
          <button type="button" class="nt-carousel-btn nt-carousel-prev" aria-label="Scroll products left">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <div class="nt-carousel-viewport">
            <div class="nt-carousel-track" id="nt-carousel-track" role="region" aria-label="All NutriThrive products">
              ${cards}
            </div>
          </div>
          <button type="button" class="nt-carousel-btn nt-carousel-next" aria-label="Scroll products right">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>`;
        oldGrid.replaceWith(wrap);

        const firstCarouselImg = wrap.querySelector('.nt-carousel-card img');
        if (firstCarouselImg) {
          firstCarouselImg.loading = 'eager';
          firstCarouselImg.setAttribute('fetchpriority', 'high');
          if (!firstCarouselImg.getAttribute('width')) {
            firstCarouselImg.setAttribute('width', '320');
            firstCarouselImg.setAttribute('height', '320');
          }
        }

        const track = wrap.querySelector('#nt-carousel-track');
        const scrollBy = (dir) => {
          if (!track) return;
          const amount = Math.min(216, track.clientWidth * 0.85) * dir;
          track.scrollBy({ left: amount, behavior: 'smooth' });
        };
        wrap.querySelector('.nt-carousel-prev')?.addEventListener('click', () => scrollBy(-1));
        wrap.querySelector('.nt-carousel-next')?.addEventListener('click', () => scrollBy(1));
      }
    }

    const guidesSection = document.querySelector('section.bg-surface-container');
    if (guidesSection && data.blogGuides) {
      const grid = guidesSection.querySelector('.grid');
      if (grid) {
        grid.innerHTML = data.blogGuides
          .map(
            (g) => `
<a class="nt-guide-card group bg-pure-white p-6 rounded-xl hover:shadow-lg transition-all border border-transparent hover:border-moringa-leaf/20" href="${g.href}">
  <div class="text-terracotta-clay mb-4 font-label-sm uppercase tracking-widest text-[10px] font-bold">${g.category}</div>
  <h4 class="font-display text-headline-md text-forest-deep group-hover:text-moringa-leaf transition-colors leading-snug">${g.title}</h4>
  <div class="flex items-center justify-between text-on-surface-variant/60 text-[12px] mt-4">
    <span>⏱ ${g.readTime}</span>
    <span class="material-symbols-outlined">arrow_forward</span>
  </div>
</a>`
          )
          .join('');
      }
      const viewGuides = guidesSection.querySelector('a[href="#"]');
      if (viewGuides) viewGuides.href = '/blog/';
    }

    normalizeAddCartButtons();

    initHomeReviews();
  }

  const BLOG_PER_PAGE = 9;

  function blogCardHtml(article) {
    const title = article.title || article.slug || 'Article';
    const desc = article.description
      ? `<p class="font-body-md text-on-surface-variant mb-4 line-clamp-3 flex-1">${article.description}</p>`
      : '';
    const cat = article.category || 'Article';
    return `
    <article class="group glass-card rounded-xl overflow-hidden hover:shadow-xl transition-all flex flex-col h-full">
      <a href="${article.href}" class="p-6 md:p-8 flex flex-col flex-1 no-underline text-inherit">
        <span class="inline-block self-start bg-primary-fixed/30 text-moringa-leaf px-3 py-1 rounded-full text-label-sm font-label-sm uppercase mb-3">${cat}</span>
        <h3 class="font-display text-headline-md text-forest-deep mb-3 group-hover:text-moringa-leaf transition-colors line-clamp-3">${title}</h3>
        ${desc}
        <span class="inline-flex items-center gap-2 text-moringa-leaf font-label-lg mt-auto pt-2">
          Read article
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </span>
      </a>
    </article>`;
  }

  function getBlogPageFromUrl() {
    const n = parseInt(new URLSearchParams(location.search).get('page') || '1', 10);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }

  function renderBlogPagination(pageNum, totalPages) {
    const nav = $('#nt-blog-pagination');
    if (!nav || totalPages <= 1) {
      if (nav) nav.innerHTML = '';
      return;
    }

    const prevDisabled = pageNum <= 1;
    const nextDisabled = pageNum >= totalPages;

    const pageButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      if (totalPages > 7 && Math.abs(i - pageNum) > 1 && i !== 1 && i !== totalPages) {
        if (i === 2 || i === totalPages - 1) pageButtons.push('<span class="px-1 text-on-surface-variant">…</span>');
        continue;
      }
      const active = i === pageNum ? ' nt-blog-pagination__num--active' : '';
      pageButtons.push(
        `<button type="button" data-blog-page="${i}" class="nt-blog-pagination__num${active}" aria-label="Page ${i}"${i === pageNum ? ' aria-current="page"' : ''}>${i}</button>`
      );
    }

    nav.innerHTML = `
      <button type="button" data-blog-page="${pageNum - 1}" class="nt-blog-pagination__btn" ${prevDisabled ? 'disabled' : ''} aria-label="Previous page">
        <span class="material-symbols-outlined text-[20px] align-middle">chevron_left</span> Previous
      </button>
      <div class="flex flex-wrap items-center justify-center gap-1">${pageButtons.join('')}</div>
      <button type="button" data-blog-page="${pageNum + 1}" class="nt-blog-pagination__btn" ${nextDisabled ? 'disabled' : ''} aria-label="Next page">
        Next <span class="material-symbols-outlined text-[20px] align-middle">chevron_right</span>
      </button>`;
  }

  function renderBlogListing(pageNum) {
    const grid = $('#nt-blog-grid');
    const articles = window.NT_BLOG_ARTICLES || [];
    if (!grid) return;

    if (!articles.length) {
      grid.innerHTML =
        '<p class="text-on-surface-variant col-span-full">Articles could not load. <a class="text-moringa-leaf underline" href="/blog/index-test.html">View article list</a>.</p>';
      return;
    }

    const totalPages = Math.max(1, Math.ceil(articles.length / BLOG_PER_PAGE));
    const page = Math.min(Math.max(1, pageNum), totalPages);
    const start = (page - 1) * BLOG_PER_PAGE;
    const slice = articles.slice(start, start + BLOG_PER_PAGE);

    const countEl = $('#nt-blog-count');
    if (countEl) {
      countEl.textContent =
        totalPages > 1
          ? `Showing ${start + 1}–${start + slice.length} of ${articles.length} articles (page ${page} of ${totalPages})`
          : `${articles.length} articles — lab tests, guides, and Melbourne wellness`;
    }

    grid.innerHTML = slice.map((a) => blogCardHtml(a)).join('');
    renderBlogPagination(page, totalPages);

    const url = new URL(location.href);
    if (page === 1) url.searchParams.delete('page');
    else url.searchParams.set('page', String(page));
    history.replaceState({ blogPage: page }, '', url);

    if (window.__ntBlogListingRendered) {
      const top = document.getElementById('nt-blog-count') || grid;
      top.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.__ntBlogListingRendered = true;
  }

  function initBlogPage() {
    if (!isBlogJournalPage()) return;
    const grid = $('#nt-blog-grid');
    if (!grid) return;

    if (!document.documentElement.dataset.ntBlogPaginationBound) {
      document.documentElement.dataset.ntBlogPaginationBound = '1';
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-blog-page]');
        if (!btn || !isBlogJournalPage() || btn.disabled) return;
        e.preventDefault();
        renderBlogListing(parseInt(btn.dataset.blogPage, 10));
      });
      window.addEventListener('popstate', () => {
        if (isBlogJournalPage()) renderBlogListing(getBlogPageFromUrl());
      });
    }

    renderBlogListing(getBlogPageFromUrl());
  }

  function initFaqPage() {
    const root = document.getElementById('nt-faq-app');
    if (!root) return;
    if (root.querySelector('section[id^="faq-"]')) return;

    const data = D();
    if (!data?.faqCategories?.length) {
      root.innerHTML =
        '<motion class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 text-center"><p class="text-on-surface-variant">FAQ could not load. <a class="text-moringa-leaf underline" href="/contact">Contact us</a>.</p></motion>'.replace(
          /<\/?motion>/g,
          (t) => (t.startsWith('</') ? '</div>' : '<div')
        );
      return;
    }

    const cats = data.faqCategories;
    const contact = data.contact;

    root.innerHTML = `
      <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
        <header class="text-center mb-12 md:mb-16">
          <h1 class="font-display text-headline-lg-mobile md:text-headline-lg text-forest-deep mb-4">Frequently Asked Questions</h1>
          <p class="font-body-lg text-on-surface-variant max-w-2xl mx-auto">Answers about moringa, curry leaves, tea, orders and shipping — same info as our live site.</p>
        </header>
        <div class="space-y-10">
          ${cats
            .map(
              (cat) => `
          <section id="faq-${cat.id}" class="bg-pure-white rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
            <div class="flex items-center gap-3 px-6 md:px-8 py-5 bg-surface border-b border-outline-variant/10">
              <span class="material-symbols-outlined text-moringa-leaf">${cat.icon}</span>
              <h2 class="font-display text-headline-md text-forest-deep">${cat.title}</h2>
            </div>
            <div class="divide-y divide-outline-variant/10">
              ${cat.items
                .map(
                  (item, i) => `
              <details class="group px-6 md:px-8 py-2" ${i === 0 && cat.id === 'moringa' ? 'open' : ''}>
                <summary class="flex items-center justify-between gap-4 py-4 cursor-pointer list-none font-label-lg text-forest-deep hover:text-moringa-leaf">
                  <span>${item.q}</span>
                  <span class="material-symbols-outlined expand-icon shrink-0 text-moringa-leaf transition-transform">expand_more</span>
                </summary>
                <div class="pb-5 text-on-surface-variant font-body-md leading-relaxed">
                  <p>${item.a}</p>
                  ${
                    item.link
                      ? `<p class="mt-3"><a class="text-moringa-leaf font-semibold hover:underline" href="${item.link.href}"${item.link.external ? ' target="_blank" rel="noopener"' : ''}>${item.link.text} →</a></p>`
                      : ''
                  }
                </div>
              </details>`
                )
                .join('')}
            </div>
          </section>`
            )
            .join('')}
        </div>
        <div class="mt-12 text-center bg-parchment-base rounded-2xl p-8 md:p-10">
          <p class="font-body-lg text-on-surface-variant mb-4">Still have questions?</p>
          <a href="/contact" class="inline-block bg-moringa-leaf text-pure-white px-8 py-3 rounded-full font-label-lg hover:brightness-110">Contact us</a>
          <p class="mt-4 text-sm text-on-surface-variant">Or call <a href="tel:${contact.phoneTel}" class="text-moringa-leaf font-semibold">${contact.phone}</a></p>
        </div>
      </div>`;

  }

  function init() {
    bindAddToCartClicks();
    bindGlobalClicks();
    try {
      initFaqPage();
    } catch (err) {
      console.error('[v2] initFaqPage', err);
    }
    try {
      initProductPage();
    } catch (err) {
      console.error('[v2] initProductPage', err);
    }
    try {
      renderCartPage();
    } catch (err) {
      console.error('[v2] renderCartPage', err);
    }
    try {
      renderPaymentPage();
    } catch (err) {
      console.error('[v2] renderPaymentPage', err);
    }
    try {
      initContactForm();
    } catch (err) {
      console.error('[v2] initContactForm', err);
    }
    try {
      initNewsletterForm();
    } catch (err) {
      console.error('[v2] initNewsletterForm', err);
    }
    try {
      initHomePage();
    } catch (err) {
      console.error('[v2] initHomePage', err);
    }
    try {
      initShopPage();
    } catch (err) {
      console.error('[v2] initShopPage', err);
    }
    try {
      initBlogPage();
    } catch (err) {
      console.error('[v2] initBlogPage', err);
    }
    document.addEventListener('nt-cart-updated', () => {
      renderCartPage();
      C()?.updateUI?.();
    });
    C()?.updateUI?.();
  }

  if (isShopPage()) {
    try {
      initShopPage();
    } catch (err) {
      console.error('[v2] initShopPage (early)', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
