/** Minimal shop page — cart + nav only (no v2-site / Tailwind CDN). */
(function () {
  'use strict';

  function updateBadge() {
    const cart = window.Cart?.get?.();
    const n = cart?.itemCount || 0;
    const badge = document.querySelector('[data-cart-count]');
    if (!badge) return;
    badge.textContent = String(n);
    badge.hidden = n < 1;
  }

  function addFromButton(btn) {
    const id = btn.getAttribute('data-add-cart');
    if (!id || !window.Cart?.add) return;
    window.Cart.add({
      id,
      name: btn.getAttribute('data-name') || '',
      price: parseFloat(btn.getAttribute('data-price') || '0'),
      image: btn.getAttribute('data-image') || '',
      weight: parseFloat(btn.getAttribute('data-weight') || '0'),
      quantity: 1,
    });
    updateBadge();
  }

  document.addEventListener(
    'click',
    (e) => {
      const btn = e.target.closest('[data-add-cart]');
      if (!btn) return;
      e.preventDefault();
      addFromButton(btn);
    },
    true
  );

  const menuBtn = document.getElementById('nt-menu-btn');
  const drawer = document.getElementById('nt-mobile-drawer');
  menuBtn?.addEventListener('click', () => drawer?.classList.toggle('is-open'));

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateBadge);
  } else {
    updateBadge();
  }
  document.addEventListener('nt-cart-updated', updateBadge);
})();
