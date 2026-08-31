/**
 * Sticky table of contents for long blog articles (mobile-first).
 * Adds scroll-spy highlighting; CSS in blog-v2-prose.css handles sticky positioning.
 */
(function () {
  function initStickyToc() {
    var toc = document.querySelector('.nt-sticky-toc');
    if (!toc) return;

    var links = toc.querySelectorAll('a[href^="#"]');
    if (!links.length) return;

    var sections = [];
    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      if (!id) return;
      var el = document.getElementById(id);
      if (el) sections.push({ id: id, el: el, link: link });
    });
    if (!sections.length) return;

    var offset = window.matchMedia('(max-width: 640px)').matches ? 152 : 120;

    function setActive(id) {
      sections.forEach(function (s) {
        s.link.classList.toggle('toc-active', s.id === id);
      });
    }

    function onScroll() {
      var scrollY = window.scrollY || window.pageYOffset;
      var current = sections[0].id;
      sections.forEach(function (s) {
        var top = s.el.getBoundingClientRect().top + scrollY;
        if (scrollY >= top - offset) current = s.id;
      });
      setActive(current);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickyToc);
  } else {
    initStickyToc();
  }
})();
