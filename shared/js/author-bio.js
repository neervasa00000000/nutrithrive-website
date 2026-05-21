/** Inject author bio + global disclaimer on v2 blog articles. */
(function (global) {
  var BIO_URL = '/shared/components/author-bio.html';
  var DISCLAIMER_HTML =
    '<div class="nt-global-disclaimer" role="note" data-nt-global-disclaimer>' +
    '<p><strong>Legal disclaimer:</strong> I\'m Neer, founder of NutriThrive. I\'m not a doctor, nutritionist, or health professional. This article is general information and our own operational experience—not medical advice.</p>' +
    '<p><strong>These statements have not been evaluated by the TGA.</strong> Moringa powder is sold as a food supplement and is not intended to diagnose, treat, cure, or prevent any disease. If you are pregnant, breastfeeding, or on medication, speak with your GP before use.</p>' +
    '</div>';

  function insertBio(prose, html) {
    if (!prose || prose.querySelector('[data-nt-author-bio]')) return;
    var featured = prose.querySelector('.featured-snippet-box');
    var wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    var bio = wrapper.firstElementChild;
    if (!bio) return;
    if (featured && featured.nextSibling) {
      prose.insertBefore(bio, featured.nextSibling);
    } else {
      prose.insertBefore(bio, prose.firstChild);
    }
  }

  function insertDisclaimer(prose) {
    if (!prose || prose.querySelector('[data-nt-global-disclaimer]')) return;
    var anchor =
      prose.querySelector('.nt-related-links-block') ||
      prose.querySelector('p.sources') ||
      prose.querySelector('a[href="/blog/"]');
    var wrap = document.createElement('div');
    wrap.innerHTML = DISCLAIMER_HTML;
    var el = wrap.firstElementChild;
    if (!el) return;
    if (anchor && anchor.parentNode === prose) {
      prose.insertBefore(el, anchor);
    } else {
      prose.appendChild(el);
    }
  }

  function init() {
    var prose = document.querySelector('article .blog-v2-prose, main .blog-v2-prose');
    if (!prose) return;

    insertDisclaimer(prose);

    if (prose.querySelector('[data-nt-author-bio]')) return;

    fetch(BIO_URL, { credentials: 'same-origin' })
      .then(function (r) {
        if (!r.ok) throw new Error('bio fetch failed');
        return r.text();
      })
      .then(function (html) {
        insertBio(prose, html);
      })
      .catch(function () {
        insertBio(
          prose,
          '<div class="nt-author-bio" data-nt-author-bio><div class="nt-author-bio-inner">' +
            '<div class="nt-author-bio-body"><h2 class="nt-author-bio-name">Written by Neer</h2>' +
            '<p class="nt-author-bio-text">Founder of NutriThrive, Truganina VIC. Not a health professional—see disclaimer below.</p></div></div></div>'
        );
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.NT_initAuthorBio = init;
})(typeof window !== 'undefined' ? window : global);
