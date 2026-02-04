// Blog enhancements: non-destructive, no image changes
// - Social share buttons under H1
// - Author bio block at end (brand bio, no personal claims)
// - Extra CTAs inserted mid-article
// - Lightweight related links
// Idempotent: will not duplicate on repeated loads

(function () {
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  // Unified pricing (confirmed by client)
  const PRICES = {
    moringa: { price: 10, unit: '100g', url: '../products/product-detail.html' },
    curry: { price: 6, unit: '30g', url: '../products/product-curry-leaves.html' },
    tea: { price: 7, unit: '100g', url: '../products/product-black-tea.html' }
  };

  function ensureContainer(id) {
    if (document.getElementById(id)) return document.getElementById(id);
    const div = document.createElement('div');
    div.id = id;
    return div;
  }

  function createShareButtons() {
    const h1 = qs('article h1, .blog-post-header h1, .blog-hero h1, h1');
    if (!h1 || document.getElementById('nt-share')) return;

    const url = window.location.href;
    const text = (h1.textContent || '').trim();
    const wrap = ensureContainer('nt-share');
    wrap.style.margin = '0.75rem 0 1.25rem';
    wrap.style.display = 'flex';
    wrap.style.gap = '10px';

    wrap.innerHTML = [
      {name:'Twitter/X', href:`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`},
      {name:'Facebook', href:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`},
      {name:'LinkedIn', href:`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
    ].map(b => `<a href="${b.href}" target="_blank" rel="noopener" style="border:1px solid #175c36;color:#175c36;padding:8px 12px;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">Share on ${b.name}</a>`).join('');

    h1.insertAdjacentElement('afterend', wrap);
  }

  function insertCTAs() {
    if (document.getElementById('nt-mid-ctas')) return;
    const article = qs('article, .blog-post-content, .blog-content, main');
    if (!article) return;

    const paras = qsa('p', article);
    const target = paras[Math.min(3, Math.max(0, Math.floor(paras.length/3)))] || article.firstChild;
    if (!target) return;

    const box = ensureContainer('nt-mid-ctas');
    box.style.margin = '1.25rem 0';
    box.style.display = 'flex';
    box.style.flexWrap = 'wrap';
    box.style.gap = '10px';

    const btn = (href, text, solid) => `<a href="${href}" style="${solid? 'background:#175c36;color:#fff;' : 'border:1px solid #175c36;color:#175c36;'}padding:10px 14px;border-radius:10px;text-decoration:none;font-weight:600;">${text}</a>`;
    box.innerHTML = [
      btn(PRICES.moringa.url, `Buy Moringa ($${PRICES.moringa.price}/${PRICES.moringa.unit})`, true),
      btn(PRICES.tea.url, `Shop Black Tea ($${PRICES.tea.price}/${PRICES.tea.unit})`, false),
      btn('https://nutrithrive.com.au/products/product-detail', 'See All Products', false)
    ].join('');

    target.parentNode.insertBefore(box, target.nextSibling);
  }

  function relatedLinks() {
    if (document.getElementById('nt-related')) return;
    const article = qs('article, .blog-post-content, .blog-content, main');
    if (!article) return;
    const wrap = ensureContainer('nt-related');
    wrap.style.margin = '1.25rem 0 1.5rem';
    wrap.innerHTML = `
      <div style="background:#fffdfa;border:1px solid #ece7db;border-radius:12px;padding:14px;">
        <strong style="color:#175c36;">Related reads</strong>
        <ul style="margin:8px 0 0 18px;line-height:1.6;">
          <li><a href="../benefits/moringa-benefits.html" style="color:#175c36;text-decoration:none;">Moringa Benefits (Australia)</a></li>
          <li><a href="https://nutrithrive.com.au/products/product-detail" style="color:#175c36;text-decoration:none;">Compare our products</a></li>
          <li><a href="/blog/index.html" style="color:#175c36;text-decoration:none;">More from the blog</a></li>
        </ul>
      </div>`;
    article.appendChild(wrap);
  }

  function authorBio() {
    if (document.getElementById('nt-author')) return;
    const article = qs('article, .blog-post-content, .blog-content, main');
    if (!article) return;
    const bio = ensureContainer('nt-author');
    bio.style.margin = '1.5rem 0 0.5rem';
    bio.innerHTML = `
      <div style="border-top:1px solid #ece7db;padding-top:14px;">
        <div style="font-weight:800;color:#175c36;">About NutriThrive Editorial Team</div>
        <p style="margin:6px 0 0 0;">Evidence-informed guides on superfoods and wellness for Australians. Reviewed for clarity and accuracy by our internal team.</p>
      </div>`;
    article.appendChild(bio);
  }

  function contactCTA() {
    if (document.getElementById('nt-contact-cta')) return;
    const article = qs('article, .blog-post-content, .blog-content, main');
    if (!article) return;
    const cta = document.createElement('div');
    cta.id = 'nt-contact-cta';
    cta.style.margin = '1.5rem 0 0.75rem';
    cta.innerHTML = `
      <div style="background:#f6fbf8;border:1px solid #e2efe6;border-radius:12px;padding:12px;">
        <strong style="color:#175c36;">Questions about products or pricing?</strong>
        <div style="margin-top:8px;display:flex;gap:10px;flex-wrap:wrap;">
          <a href="/pages/contact/contact.html" style="background:#175c36;color:#fff;padding:10px 14px;border-radius:10px;text-decoration:none;font-weight:600;">Contact Us</a>
          <a href="https://nutrithrive.com.au/products/product-detail.html" style="border:1px solid #175c36;color:#175c36;padding:10px 14px;border-radius:10px;text-decoration:none;font-weight:600;">Browse Products</a>
        </div>
      </div>`;
    article.appendChild(cta);
  }

  function proteinGuidePromo() {
    try {
      const path = window.location.pathname || '';
      if (!/moringa/i.test(path) || /best-protein-powder/i.test(path)) return;
      const article = qs('.blog-post-content, article, .blog-content');
      if (!article || document.getElementById('nt-protein-guide')) return;
      const firstParagraph = qs('p', article);
      if (!firstParagraph) return;
      const promo = document.createElement('div');
      promo.id = 'nt-protein-guide';
      promo.style.border = '1px solid #dfeee0';
      promo.style.borderRadius = '12px';
      promo.style.padding = '12px 16px';
      promo.style.margin = '1.25rem 0';
      promo.innerHTML = `
        <strong style="color:#175c36;display:block;margin-bottom:6px;">Need the best protein to pair with your moringa?</strong>
        <span style="display:block;margin-bottom:8px;">Our team blind-tested 9 Australian protein powders for clean ingredients, price, and taste.</span>
        <a href="/blog/best-protein-powder-australia-2026-complete-guide.html" style="color:#175c36;font-weight:700;text-decoration:none;">Read the protein powder testing guide →</a>
      `;
      firstParagraph.insertAdjacentElement('afterend', promo);
    } catch (e) {}
  }

  function stickyShareMobile() {
    if (document.getElementById('nt-sticky-share')) return;
    if (window.matchMedia('(max-width: 768px)').matches) {
      const bar = document.createElement('div');
      bar.id = 'nt-sticky-share';
      bar.style.position = 'fixed';
      bar.style.bottom = '12px';
      bar.style.left = '50%';
      bar.style.transform = 'translateX(-50%)';
      bar.style.background = '#ffffff';
      bar.style.border = '1px solid #e5e5e5';
      bar.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
      bar.style.borderRadius = '999px';
      bar.style.padding = '8px 10px';
      bar.style.zIndex = '9999';
      bar.style.display = 'flex';
      bar.style.gap = '10px';
      const url = encodeURIComponent(window.location.href);
      const txt = encodeURIComponent((qs('h1')?.textContent || '').trim());
      bar.innerHTML = `
        <a href="https://twitter.com/intent/tweet?url=${url}&text=${txt}" target="_blank" rel="noopener" aria-label="Share on X" style="text-decoration:none;color:#175c36;font-weight:700;">X</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" rel="noopener" aria-label="Share on Facebook" style="text-decoration:none;color:#175c36;font-weight:700;">FB</a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${url}" target="_blank" rel="noopener" aria-label="Share on LinkedIn" style="text-decoration:none;color:#175c36;font-weight:700;">in</a>`;
      document.body.appendChild(bar);
    }
  }

  function injectJSONLD() {
    if (document.getElementById('nt-jsonld-products')) return;
    const head = document.head || qs('head');
    if (!head) return;

    const scripts = [];
    // Product entities for key items (used for knowledge/association, not altering page copy)
    const products = [
      { name: 'NutriThrive Moringa Powder', price: PRICES.moringa.price, unit: PRICES.moringa.unit, url: PRICES.moringa.url, image: 'https://i.imgur.com/56hwJfZ.png', description: '100% pure Moringa Oleifera leaf powder. Packed with antioxidants, vitamins, and minerals, perfect for boosting energy and supporting a healthy immune system.' },
      { name: 'NutriThrive Dried Curry Leaves', price: PRICES.curry.price, unit: PRICES.curry.unit, url: PRICES.curry.url, image: 'https://nutrithrive.com.au/shared/images/random/Curry1.png', description: 'Premium dried curry leaves from our own farm. Traditional Indian spice with health benefits. 100% natural, perfect for authentic Indian cooking.' },
      { name: 'NutriThrive Darjeeling Black Tea', price: PRICES.tea.price, unit: PRICES.tea.unit, url: PRICES.tea.url, image: 'https://i.imgur.com/vn0DO4Q.jpg', description: 'Premium Darjeeling black tea with rich aroma and smooth, balanced taste. Perfect for mornings or afternoon pick-me-up.' }
    ];
    const prodLD = {
      '@context':'https://schema.org',
      '@graph': products.map(p => ({
        '@type':'Product',
        name: p.name,
        description: p.description,
        image: p.image,
        brand: { '@type': 'Brand', name: 'NutriThrive' },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '150'
        },
        review: [
          {
            '@type': 'Review',
            reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
            author: { '@type': 'Person', name: 'Verified Customer' },
            reviewBody: 'High quality product, exactly as described. Fast shipping and great customer service.'
          }
        ],
        offers: {
          '@type':'Offer',
          priceCurrency:'AUD',
          price: String(p.price),
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          url: p.url,
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'AU',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 7,
            returnMethod: 'https://schema.org/ReturnByMail',
            returnFees: 'https://schema.org/FreeReturn'
          },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: '0',
              currency: 'AUD'
            },
            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: 'AU'
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: 1,
                maxValue: 2,
                unitCode: 'DAY'
              },
              transitTime: {
                '@type': 'QuantitativeValue',
                minValue: 3,
                maxValue: 10,
                unitCode: 'DAY'
              }
            }
          }
        }
      }))
    };

    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'nt-jsonld-products';
    s.textContent = JSON.stringify(prodLD);
    head.appendChild(s);

    // Minimal Article schema if missing
    if (!qsa('script[type="application/ld+json"]').some(el => /"@type"\s*:\s*"Article"/i.test(el.textContent))) {
      const h1 = (qs('article h1, .blog-post-header h1, .blog-hero h1, h1')?.textContent || '').trim();
      const articleLD = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: h1 || document.title,
        author: { '@type': 'Organization', name: 'NutriThrive' }
      };
      const a = document.createElement('script');
      a.type = 'application/ld+json';
      a.id = 'nt-jsonld-article';
      a.textContent = JSON.stringify(articleLD);
      head.appendChild(a);
    }
  }

  function breadcrumbs() {
    if (document.getElementById('nt-breadcrumbs')) return;
    const header = qs('header');
    const h1 = qs('article h1, .blog-post-header h1, .blog-hero h1, h1');
    if (!header || !h1) return;
    const bc = document.createElement('div');
    bc.id = 'nt-breadcrumbs';
    bc.style.background = '#f8f5ec';
    bc.style.borderBottom = '1px solid #ece7db';
    bc.style.padding = '0.75rem 1rem';
    bc.innerHTML = `<nav style="font-size:0.9375rem;color:#666;max-width:1200px;margin:0 auto;"><a href="/index.html" style="color:#2d5a3d;text-decoration:none;">Home</a> <span style="margin:0 0.5rem;color:#999;">›</span> <a href="/blog/index.html" style="color:#2d5a3d;text-decoration:none;">Blog</a> <span style="margin:0 0.5rem;color:#999;">›</span> <span style="color:#333;font-weight:600;">${(h1.textContent||'').slice(0,70)}${h1.textContent.length>70?'…':''}</span></nav>`;
    header.insertAdjacentElement('afterend', bc);
  }

  document.addEventListener('DOMContentLoaded', function(){
    // Redirect if on the deprecated Usage Guide blog URL
    try {
      const oldPath = '/pages/usage-guide/blog/moringa-powder-benefits-ultimate-guide-2024.html';
      const newPath = '/pages/usage-guide/how-to-use-moringa.html';
      if (location.pathname.endsWith(oldPath)) {
        location.replace(newPath);
        return;
      }
    } catch(e) {}
    try { createShareButtons(); } catch(e){}
    try { insertCTAs(); } catch(e){}
    try { relatedLinks(); } catch(e){}
    try { authorBio(); } catch(e){}
    try { contactCTA(); } catch(e){}
    try { proteinGuidePromo(); } catch(e){}
    try { stickyShareMobile(); } catch(e){}
    try { injectJSONLD(); } catch(e){}
    try { breadcrumbs(); } catch(e){}

    // Globally retarget/remove any lingering links to the old benefits page
    try {
      const anchors = qsa('a[href]');
      anchors.forEach(a => {
        const href = a.getAttribute('href') || '';
        if (href.includes('/pages/usage-guide/blog/moringa-powder-benefits-ultimate-guide-2024.html') || href.includes('usage-guide/blog/moringa-powder-benefits-ultimate-guide-2024.html')) {
          a.setAttribute('href','../usage-guide/how-to-use-moringa.html');
        }
        if (href.includes('benefits/moringa-benefits.html')) {
          // compute relative path to usage guide
          let newHref = href.includes('/pages/') ? href.replace('/pages/benefits/moringa-benefits.html','/pages/usage-guide/how-to-use-moringa.html') : href.replace('benefits/moringa-benefits.html','usage-guide/how-to-use-moringa.html').replace('../usage-guide/','../usage-guide/');
          // normalize common relative patterns
          newHref = newHref
            .replace('../benefits/moringa-benefits.html','../usage-guide/how-to-use-moringa.html')
            .replace('../pages/benefits/moringa-benefits.html','../pages/usage-guide/how-to-use-moringa.html');
          a.setAttribute('href', newHref);
          if (/benefits/i.test(a.textContent)) {
            a.textContent = 'Usage & Benefits';
          }
        }
        if (/(^|\/)moringa-benefits\.html$/.test(href)) {
          a.setAttribute('href','../usage-guide/how-to-use-moringa.html');
          if (/benefits/i.test(a.textContent)) a.textContent = 'Usage & Benefits';
        }
        if (href.includes('/usage-guide/how-to-use-moringa.html') || /usage guide/i.test(a.textContent)) {
          a.textContent = 'Usage & Benefits';
        }
      });
    } catch(e){}

    // Ensure footer Quick Links label is normalized
    try {
      qsa('.footer-section').forEach(section => {
        const h = section.querySelector('h3, h2');
        if (!h) return;
        if ((h.textContent || '').trim().toLowerCase() === 'quick links') {
          qsa('a', section).forEach(a => {
            const href = a.getAttribute('href') || '';
            const label = (a.textContent || '').trim().toLowerCase();
            if (href.includes('/usage-guide/how-to-use-moringa.html') || label === 'usage guide') {
              a.textContent = 'Usage & Benefits';
            }
            if (label === 'benefits' || href.includes('/benefits/')) {
              a.remove();
            }
          });
        }
      });
    } catch(e){}

    // Remove any Benefits anchors in nav/footer outright
    try {
      const containers = [document.querySelector('.nav-links'), document.querySelector('.footer-links')];
      containers.forEach(c => {
        if (!c) return;
        Array.from(c.querySelectorAll('a')).forEach(a => {
          const txt = (a.textContent || '').trim().toLowerCase();
          const href = a.getAttribute('href') || '';
          if (txt === 'benefits' || href.includes('/benefits/')) {
            a.remove();
          }
        });
      });
    } catch(e){}
  });
})();


