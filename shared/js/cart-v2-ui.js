/**
 * Live cart UI layer — wraps shared/js/cart.js with shipping estimates for v2 checkout pages.
 */
(function () {
  if (window.CartV2) return;

  const COUNTRY_KEY = 'nutrithrive_shipping_country';
  const LEGACY_COUNTRY_KEY = 'nutrithrive_country';

  function getCart() {
    return window.Cart?.get?.() || null;
  }

  function getShippingCountry() {
    try {
      return (
        localStorage.getItem(COUNTRY_KEY) ||
        localStorage.getItem(LEGACY_COUNTRY_KEY) ||
        'AU'
      ).toUpperCase();
    } catch {
      return 'AU';
    }
  }

  function setShippingCountry(code) {
    const cc = String(code || 'AU').toUpperCase();
    try {
      localStorage.setItem(COUNTRY_KEY, cc);
      localStorage.setItem(LEGACY_COUNTRY_KEY, cc);
    } catch {
      /* ignore */
    }
    document.dispatchEvent(new CustomEvent('nt-ship-country-changed', { detail: { countryCode: cc } }));
  }

  function itemsForShipping(items) {
    const data = window.NT_SITE_DATA;
    return (items || []).map((item) => {
      const p = data?.getProduct?.(item.id);
      return {
        id: item.id,
        name: item.name || p?.name || '',
        price: item.price,
        quantity: item.quantity,
        weight: parseFloat(item.weight) || p?.weight || 0,
      };
    });
  }

  function cartWeightGrams(items) {
    return itemsForShipping(items).reduce((sum, item) => {
      const w = parseFloat(item.weight) || 0;
      const q = parseInt(item.quantity, 10) || 1;
      return sum + w * q;
    }, 0);
  }

  function freeShippingThreshold(countryCode) {
    const d = window.NT_SITE_DATA?.shipping;
    const cc = (countryCode || getShippingCountry()).toUpperCase();
    if (cc === 'AU') return d?.freeAuThreshold ?? 80;
    return d?.freeWorldThreshold ?? 90;
  }

  function weightTierLabel(grams) {
    if (grams <= 250) return 'Up to 250g';
    if (grams <= 500) return '251g–500g';
    if (grams <= 1000) return '501g–1kg';
    if (grams <= 1500) return '1.001kg–1.5kg';
    return '1.501kg–2kg';
  }

  function estimateShippingDetails(cartOrSubtotal, countryCode) {
    const cart =
      typeof cartOrSubtotal === 'object' && cartOrSubtotal !== null
        ? cartOrSubtotal
        : getCart() || { items: [], total: 0 };
    const subtotal =
      typeof cartOrSubtotal === 'number' ? cartOrSubtotal : cart.total ?? 0;
    const cc = (countryCode || getShippingCountry()).toUpperCase();
    const items = itemsForShipping(cart.items);
    const weightGrams = cartWeightGrams(cart.items);

    if (!items.length) {
      return { cost: 0, weightGrams: 0, countryCode: cc, tierLabel: null };
    }

    if (window.ShippingRates?.calculate) {
      const cost = window.ShippingRates.calculate(cc, items, subtotal);
      if (cost !== null && cost !== undefined) {
        return {
          cost: Number(cost),
          weightGrams,
          countryCode: cc,
          tierLabel: weightTierLabel(weightGrams),
        };
      }
    }

    const threshold = freeShippingThreshold(cc);
    if (subtotal >= threshold) {
      return { cost: 0, weightGrams, countryCode: cc, tierLabel: weightTierLabel(weightGrams) };
    }
    const fallback = window.NT_SITE_DATA?.shipping?.defaultAuRate ?? 8.73;
    return { cost: fallback, weightGrams, countryCode: cc, tierLabel: weightTierLabel(weightGrams) };
  }

  function estimateShipping(cartOrSubtotal, countryCode) {
    return estimateShippingDetails(cartOrSubtotal, countryCode).cost;
  }

  window.CartV2 = {
    add: (...args) => window.Cart.add(...args),
    remove: (...args) => window.Cart.remove(...args),
    updateQuantity: (...args) => window.Cart.updateQuantity(...args),
    clear: (...args) => window.Cart.clear(...args),
    get: getCart,
    getItemCount: () => window.Cart.getItemCount(),
    getTotal: () => window.Cart.getTotal(),
    estimateShipping,
    estimateShippingDetails,
    getShippingCountry,
    setShippingCountry,
    itemsForShipping,
    cartWeightGrams,
    freeShippingThreshold,
    updateUI: () => window.Cart.updateUI(),
  };

  function refreshCartBadge() {
    if (!window.Cart?.getItemCount) return;
    const n = window.Cart.getItemCount();
    document.querySelectorAll('[data-cart-count]').forEach((badge) => {
      badge.textContent = String(n);
      if (n > 0) badge.classList.remove('hidden');
      else badge.classList.add('hidden');
    });
  }

  document.addEventListener('DOMContentLoaded', refreshCartBadge);
  document.addEventListener('nt-cart-updated', refreshCartBadge);
})();
