/**
 * NutriThrive — redirect to crypto checkout with current cart items.
 * Set <meta name="nt-crypto-checkout-url" content="https://your-checkout-host"> on cart/payment pages.
 */
(function () {
  if (window.__NT_CRYPTO_CHECKOUT_INIT__) return;
  window.__NT_CRYPTO_CHECKOUT_INIT__ = true;

  const LOCAL_CHECKOUT = 'http://localhost:3000';
  const PROD_CHECKOUT = 'https://nutrithrive-crypto-checkout.onrender.com';

  function getCheckoutBaseUrl() {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return LOCAL_CHECKOUT;
    }
    const meta = document.querySelector('meta[name="nt-crypto-checkout-url"]');
    const fromMeta = meta && meta.getAttribute('content');
    if (fromMeta && fromMeta.trim()) {
      return fromMeta.trim().replace(/\/$/, '');
    }
    return PROD_CHECKOUT;
  }

  function getCartItems(cart) {
    const source = cart || (window.Cart && typeof window.Cart.get === 'function' && window.Cart.get());
    if (!source || !Array.isArray(source.items) || source.items.length === 0) {
      return null;
    }
    return source.items.map((item) => ({
      id: item.id,
      quantity: parseInt(item.quantity || 1, 10),
    }));
  }

  function encodeItemsParam(items) {
    return encodeURIComponent(btoa(JSON.stringify(items)));
  }

  function buildCheckoutUrl(cart) {
    const items = getCartItems(cart);
    if (!items) return null;
    const base = getCheckoutBaseUrl();
    let url = `${base}/?items=${encodeItemsParam(items)}`;
    try {
      const country = localStorage.getItem('nutrithrive_shipping_country');
      if (country) {
        url += `&country=${encodeURIComponent(country)}`;
      }
    } catch {
      /* ignore */
    }
    return url;
  }

  function goToCryptoCheckout(cart) {
    const url = buildCheckoutUrl(cart);
    if (!url) {
      window.alert('Your cart is empty. Add products before paying with crypto.');
      return false;
    }
    window.location.href = url;
    return true;
  }

  window.NutriThriveCryptoCheckout = {
    getCheckoutBaseUrl,
    buildCheckoutUrl,
    goToCryptoCheckout,
  };
})();
