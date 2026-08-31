/** Inject Buy 3 Get 1 Free moringa bundle card into blog article sidebars. */
(function (global) {
  function money(n) {
    return '$' + Number(n).toFixed(2);
  }

  function esc(s) {
    return String(s != null ? s : '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  function blogSlug() {
    var path = location.pathname.replace(/\/$/, '');
    var slug = path.split('/blog/')[1] || '';
    return slug.replace(/\.html$/, '');
  }

  function buildCard(promo) {
    var save = promo.compareAt > promo.price ? promo.compareAt - promo.price : 0;
    var saveHtml =
      save > 0
        ? '<p class="text-body-sm text-on-surface-variant mb-6">' +
          esc(money(promo.compareAt)) +
          ' as four singles — save ' +
          esc(money(save)) +
          '</p>'
        : '';

    var card = document.createElement('div');
    card.className =
      'bg-pure-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden';
    card.setAttribute('data-nt-b3g1-promo', '');
    card.innerHTML =
      '<div class="aspect-square bg-surface-container relative">' +
      '<img alt="' +
      esc(promo.headline + ' — ' + promo.badge) +
      '" class="w-full h-full object-cover" src="' +
      esc(promo.image) +
      '" loading="lazy" decoding="async"/>' +
      '<div class="absolute top-4 right-4 bg-moringa-leaf text-pure-white px-3 py-1 rounded-lg text-label-sm font-label-sm">' +
      esc(promo.badge) +
      '</div>' +
      '</div>' +
      '<div class="p-6">' +
      '<h4 class="font-headline-md text-headline-md text-forest-deep mb-2">' +
      esc(promo.headline) +
      '</h4>' +
      '<p class="text-on-surface-variant font-body-md text-body-md mb-4">' +
      esc(promo.description) +
      '</p>' +
      '<div class="nt-blog-sidebar-price flex items-baseline gap-1 mb-2">' +
      '<span class="text-2xl font-bold text-moringa-leaf">' +
      esc(money(promo.price)) +
      '</span>' +
      '<span class="text-sm text-on-surface-variant">' +
      esc(promo.unit) +
      '</span>' +
      '</div>' +
      saveHtml +
      '<a class="block w-full text-center bg-moringa-leaf text-pure-white py-4 rounded-lg font-label-lg text-label-lg hover:scale-[1.02] transition-transform" href="' +
      esc(promo.href) +
      '">' +
      esc(promo.cta) +
      '</a>' +
      '</div>';
    return card;
  }

  function init() {
    if (document.querySelector('[data-nt-b3g1-promo], .nt-blog-sidebar-promo')) return;

    var aside = document.querySelector('aside.lg\\:col-span-4, aside[class*="col-span-4"]');
    if (!aside) return;

    var d = global.NT_SITE_DATA;
    var cfg = d && d.blogSidebarPromo;
    var promo = cfg && cfg.moringa400g;
    if (!promo) return;

    var slug = blogSlug();
    if ((cfg.excludeSlugs || []).indexOf(slug) >= 0) return;

    var card = buildCard(promo);
    if (aside.firstElementChild) {
      aside.firstElementChild.insertAdjacentElement('afterend', card);
    } else {
      aside.appendChild(card);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.NT_initBlogSidebarPromo = init;
})(typeof window !== 'undefined' ? window : global);
