/** NutriThrive v2 header & footer (production). */
(function () {
  const d = window.NT_SITE_DATA;
  if (!d) return;

  const path = location.pathname.split('/').pop() || 'index.html';
  const inProducts = /\/products\//.test(location.pathname);

  function navClass(href) {
    const target = href.split('?')[0].replace(/\/$/, '') || '/';
    let current = location.pathname.replace(/\/$/, '') || '/';
    if (current.endsWith('index.html')) current = current.replace(/\/index\.html$/, '/') || '/';
    if (target === '/products' && inProducts) return active;
    if (target === current || (target !== '/' && current.endsWith(target))) return active;
    if (href === '/blog/' && /\/blog\/?$/.test(location.pathname)) return active;
    return idle;
  }

  const active =
    'font-label-lg text-label-lg text-moringa-leaf border-b-2 border-moringa-leaf font-semibold';
  const idle = 'font-label-lg text-label-lg text-forest-deep/80 hover:text-moringa-leaf transition-colors';

  const header = document.getElementById('nt-header');
  if (header) {
    header.innerHTML = `
<nav class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex items-center justify-between h-20">
  <div class="flex items-center gap-4 md:gap-12">
    <button type="button" id="nt-menu-btn" class="md:hidden text-forest-deep p-2" aria-label="Menu">
      <span class="material-symbols-outlined">menu</span>
    </button>
    <a class="font-display text-headline-md text-moringa-leaf" href="/">${d.brand}</a>
    <div id="nt-mobile-nav" class="hidden md:flex items-center gap-8">
      <a class="${navClass('/products/')}" href="/products/">Shop</a>
      <a class="${navClass('/about')}" href="/about">About</a>
      <a class="${navClass('/blog/')}" href="/blog/">Blog</a>
      <a class="${navClass('/contact')}" href="/contact">Contact</a>
    </div>
  </div>
  <div class="flex items-center gap-4">
    <a class="hidden sm:inline font-label-lg text-moringa-leaf hover:underline" href="/faq">FAQ</a>
    <a class="relative text-forest-deep p-2 hover:bg-primary-fixed/10 rounded-full transition-all" href="/cart" aria-label="Cart">
      <span class="material-symbols-outlined">shopping_bag</span>
      <span data-cart-count class="absolute top-1 right-1 bg-terracotta-clay text-pure-white text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-bold hidden">0</span>
    </a>
  </div>
</nav>
<div id="nt-mobile-drawer" class="hidden md:hidden border-t border-outline-variant/20 bg-surface px-margin-mobile py-4 flex flex-col gap-3">
  <a class="${navClass('/products/')}" href="/products/">Shop</a>
  <a class="${navClass('/about')}" href="/about">About</a>
  <a class="${navClass('/blog/')}" href="/blog/">Blog</a>
  <a class="${navClass('/contact')}" href="/contact">Contact</a>
  <a class="${navClass('/faq')}" href="/faq">FAQ</a>
</div>`;

    const btn = document.getElementById('nt-menu-btn');
    const drawer = document.getElementById('nt-mobile-drawer');
    btn?.addEventListener('click', () => drawer?.classList.toggle('hidden'));
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
