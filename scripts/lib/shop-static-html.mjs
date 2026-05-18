/** Static catalog cards for /products/ LCP (matches NT_SITE_DATA catalog). */
const CATALOG = [
  {
    id: 'moringa-powder-100g',
    title: 'Moringa Powder',
    tag: '100g Pack • 30 Servings',
    badge: '100g',
    price: 11,
    was: 14,
    href: '/products/moringa-powder/',
    img: '/assets/images/product_photos/webp/moringa.webp',
    lcp: true,
  },
  {
    id: 'curry-leaves-30g',
    title: 'Dried Curry Leaves',
    tag: '30g Pack • High Potency',
    badge: 'Pantry',
    price: 7,
    was: 8.49,
    href: '/products/curry-leaves/',
    img: '/assets/images/product_photos/webp/driedcurry.webp',
  },
  {
    id: 'black-tea',
    title: 'Darjeeling Black Tea',
    tag: '100g Pack • Premium Grade',
    badge: 'Tea',
    price: 7.5,
    was: 10,
    href: '/products/black-tea/',
    img: '/assets/images/product_photos/webp/blacktea.webp',
  },
  {
    id: 'combo-pack',
    title: 'Premium Combo Pack',
    tag: 'Various Pack Sizes • Best Value',
    badge: 'Combo',
    price: 17,
    was: 22.49,
    href: '/products/combo-pack/',
    img: '/assets/images/product_photos/webp/combo.webp',
  },
  {
    id: 'moringa-soap',
    title: 'Moringa Soap',
    tag: '95g Pack • Natural Soap',
    badge: 'Soap',
    price: 7,
    was: 9.49,
    href: '/products/moringa-soap/',
    img: '/assets/images/product_photos/webp/soap.webp',
  },
];

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

function card(p) {
  const imgAttrs = p.lcp
    ? 'fetchpriority="high" loading="eager" width="400" height="500"'
    : 'loading="lazy" width="400" height="500"';
  const was = p.was
    ? `<span class="text-on-surface-variant/60 line-through text-sm">${money(p.was)}</span>`
    : '';
  return `<article id="${p.id}" class="group bg-pure-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col nt-shop-static-card">
  <a href="${p.href}" class="nt-shop-media block relative aspect-[4/5] overflow-hidden bg-surface-variant/20">
    <img alt="${p.title}" class="w-full h-full object-cover" src="${p.img}" decoding="async" ${imgAttrs}/>
    <span class="nt-shop-badge absolute top-4 left-4 bg-moringa-leaf text-pure-white text-[12px] px-3 py-1 rounded-full font-bold uppercase">${p.badge}</span>
  </a>
  <div class="nt-shop-card-body p-6 flex flex-col flex-grow">
    <h3 class="font-display text-headline-md text-forest-deep mb-2"><a href="${p.href}" class="hover:text-moringa-leaf">${p.title}</a></h3>
    <p class="nt-shop-card-tag font-label-sm text-label-sm text-on-surface-variant mb-4">${p.tag}</p>
    <div class="nt-shop-card-footer mt-auto flex items-center justify-between pt-4 border-t border-outline-variant/10">
      <div class="flex flex-col">
        <span class="nt-shop-price text-terracotta-clay font-bold text-lg">${money(p.price)}</span>
        ${was}
      </div>
      <button type="button" data-add-cart="${p.id}" data-name="${p.title.replace(/"/g, '&quot;')}" data-price="${p.price}" data-was="${p.was ?? ''}" data-image="${p.img}" data-tag="${p.tag.replace(/"/g, '&quot;')}" class="nt-add-cart-btn bg-terracotta-clay text-pure-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-moringa-leaf transition-colors relative z-20 cursor-pointer" aria-label="Add to cart">
        <span class="material-symbols-outlined text-[20px] pointer-events-none">add_shopping_cart</span>
      </button>
    </div>
  </div>
</article>`;
}

export function shopStaticGridHtml() {
  return CATALOG.map(card).join('\n');
}

const EMPTY_GRID =
  '<div id="nt-shop-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter"></div>';

export function patchShopGridBody(body) {
  if (body.includes('nt-shop-media')) return body;
  const gridInner = shopStaticGridHtml();
  const filledGrid = `<div id="nt-shop-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter nt-shop-static-grid" data-nt-shop-ready="1">\n${gridInner}\n  </div>`;
  if (body.includes('data-nt-shop-ready="1"')) {
    return body.replace(
      /<div id="nt-shop-grid"[^>]*data-nt-shop-ready="1"[^>]*>[\s\S]*?<\/div>\s*(?=\s*<p class="mt-12)/,
      `${filledGrid}\n  `
    );
  }
  if (body.includes(EMPTY_GRID)) return body.replace(EMPTY_GRID, filledGrid);
  return body.replace(/<div id="nt-shop-grid"[^>]*>\s*<\/div>/, filledGrid);
}
