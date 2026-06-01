/** NutriThrive v2 header & footer (production). Blog uses legacy nav to match homepage/products. */
(function () {
  const d = window.NT_SITE_DATA;
  if (!d) return;

  const inProducts = /\/products\//.test(location.pathname);

  function navClass(href) {
    const target = href.split('?')[0].replace(/\/$/, '') || '/';
    let current = location.pathname.replace(/\/$/, '') || '/';
    if (current.endsWith('index.html')) current = current.replace(/\/index\.html$/, '/') || '/';
    if (target === '/products' && inProducts) return 'active';
    if (target === current || (target !== '/' && current.endsWith(target))) return 'active';
    if (href === '/blog/' && /\/blog\/?$/.test(location.pathname)) return 'active';
    return '';
  }

  function loadScriptOnce(src) {
    if (document.querySelector('script[src="' + src + '"]')) return;
    const s = document.createElement('script');
    s.src = src;
    s.defer = true;
    document.body.appendChild(s);
  }

  const header = document.getElementById('nt-header');
  if (header) {
    header.closest('.nt-sticky-top')?.querySelector('.nt-promo-bar')?.remove();
    header.classList.remove('nt-v2-header');

    header.innerHTML =
      '<div class="urgency-banner">' +
      '<div class="urgency-content">' +
      '⏰ <strong>Order before 2pm for same-day Melbourne dispatch</strong>' +
      '<span class="separator">•</span>' +
      '🚚 Free shipping over $80' +
      '<span class="separator">•</span>' +
      '🔬 NMI Government lab-tested' +
      '</div></div>' +
      '<div class="navbar">' +
      '<a class="logo" href="/">' +
      '<img alt="NutriThrive Logo" decoding="async" fetchpriority="high" height="50" loading="eager" src="/assets/images/logo/LOGO.webp" style="height: 1.8rem; width: auto; margin-right: 0.5rem;" width="50"/>' +
      d.brand +
      '</a>' +
      '<nav class="nav-links">' +
      '<a href="/" class="' +
      navClass('/') +
      '">Home</a>' +
      '<a href="/products/" class="' +
      navClass('/products/') +
      '">Products</a>' +
      '<a href="/about" class="' +
      navClass('/about') +
      '">About</a>' +
      '<a href="/contact" class="' +
      navClass('/contact') +
      '">Contact</a>' +
      '<a href="/blog/" class="' +
      navClass('/blog/') +
      '">Blog</a>' +
      '</nav>' +
      '<button type="button" class="hamburger" aria-label="Toggle navigation menu" onclick="window.ntToggleMenu &amp;&amp; window.ntToggleMenu()">' +
      '<div class="line1"></div><div class="line2"></div><div class="line3"></div>' +
      '</button></div>';

    loadScriptOnce('/scripts/global/script.min.js');
    loadScriptOnce('/scripts/global/cart-header.min.js');
  }

  const footer = document.getElementById('nt-footer');
  if (footer && typeof window.NT_renderFooter === 'function') {
    footer.dataset.ntFooterReady = '1';
    window.NT_renderFooter(footer, d);
  }

  if (window.Cart) {
    const n = window.Cart.getItemCount();
    const badge = document.querySelector('[data-cart-count]');
    if (badge) {
      badge.textContent = String(n);
      if (n > 0) badge.classList.remove('hidden');
      else badge.classList.add('hidden');
    }
  }
})();
