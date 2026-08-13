/** Fill .nt-ad-slot placeholders with random NutriThrive product promos (curry leaves / moringa soap). */
(function (global) {
  function money(n) {
    return '$' + Number(n).toFixed(2).replace(/\.00$/, '');
  }

  function esc(s) {
    return String(s != null ? s : '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  function imageUrl(path) {
    var d = global.NT_SITE_DATA;
    if (d && typeof d.productImageUrl === 'function') return d.productImageUrl(path);
    return path;
  }

  function promos() {
    var d = global.NT_SITE_DATA;
    var cfg = d && d.blogAdPromo;
    if (cfg && cfg.products && cfg.products.length) return cfg.products;

    return [
      {
        id: 'curry-leaves-30g',
        headline: '30g Dried Curry Leaves',
        tagline: 'Pantry staple for tadka',
        price: 7,
        unit: '30g',
        image: '/assets/images/product_photos/driedcurry.jpeg',
        href: '/products/curry-leaves/',
        cta: 'Shop →',
      },
      {
        id: 'moringa-soap',
        headline: 'Moringa Soap 95g',
        tagline: 'Natural bar, Melbourne packed',
        price: 7,
        unit: '95g',
        image: '/assets/images/product_photos/soap.jpeg',
        href: '/products/moringa-soap/',
        cta: 'Shop →',
      },
    ];
  }

  function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function buildPromo(promo, variant) {
    var img = esc(imageUrl(promo.image));
    var alt = esc(promo.headline + ' — NutriThrive');
    var href = esc(promo.href);
    var title = esc(promo.headline + ' — ' + money(promo.price));
    var tagline = esc(promo.tagline);
    var cta = esc(promo.cta || 'Shop →');

    if (variant === 'sidebar') {
      return (
        '<a class="nt-ad-promo nt-ad-promo--sidebar" href="' +
        href +
        '">' +
        '<div class="nt-ad-promo__media">' +
        '<img src="' +
        img +
        '" alt="' +
        alt +
        '" loading="lazy" decoding="async" width="400" height="400"/>' +
        '</div>' +
        '<div class="nt-ad-promo__body">' +
        '<span class="nt-ad-promo__eyebrow">NutriThrive</span>' +
        '<p class="nt-ad-promo__title">' +
        title +
        '</p>' +
        '<p class="nt-ad-promo__tagline">' +
        tagline +
        '</p>' +
        '<span class="nt-ad-promo__cta">' +
        cta +
        '</span>' +
        '</div>' +
        '</a>'
      );
    }

    return (
      '<a class="nt-ad-promo nt-ad-promo--inline" href="' +
      href +
      '">' +
      '<div class="nt-ad-promo__media">' +
      '<img src="' +
      img +
      '" alt="' +
      alt +
      '" loading="lazy" decoding="async" width="120" height="120"/>' +
      '</div>' +
      '<div class="nt-ad-promo__body">' +
      '<span class="nt-ad-promo__eyebrow">NutriThrive</span>' +
      '<p class="nt-ad-promo__title">' +
      title +
      '</p>' +
      '<p class="nt-ad-promo__tagline">' +
      tagline +
      '</p>' +
      '<span class="nt-ad-promo__cta">' +
      cta +
      '</span>' +
      '</div>' +
      '</a>'
    );
  }

  function fillSlot(slot, list) {
    if (slot.getAttribute('data-nt-ad-filled') === 'true') return;

    var variant = slot.classList.contains('nt-ad-slot--sidebar') ? 'sidebar' : 'inline';
    var promo = pickRandom(list);

    slot.innerHTML = buildPromo(promo, variant);
    slot.classList.add('nt-ad-slot--filled');
    slot.removeAttribute('aria-hidden');
    slot.setAttribute('data-nt-ad-filled', 'true');
    slot.setAttribute('data-nt-ad-product', promo.id || '');
  }

  function init() {
    var slots = document.querySelectorAll('.nt-ad-slot:not([data-nt-ad-filled])');
    if (!slots.length) return;

    var list = promos();
    if (!list.length) return;

    slots.forEach(function (slot) {
      fillSlot(slot, list);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.NT_initBlogAdPromo = init;
})(typeof window !== 'undefined' ? window : global);
