/** Load shared header/footer and init mobile nav + active link (matches homepage script.js) */
(function () {
  function ntCloseMenu(nav, ham) {
    if (!nav || !ham) return;
    nav.classList.remove('nav-active');
    ham.classList.remove('toggle', 'active');
    ham.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    nav.style.display = '';
  }

  function ntOpenMenu(nav, ham) {
    nav.classList.add('nav-active');
    ham.classList.add('toggle');
    ham.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    nav.style.display = 'flex';
  }

  function ntToggleMenuImpl() {
    var nav = document.querySelector('#site-header .nav-links');
    var ham = document.querySelector('#site-header .hamburger');
    if (!nav || !ham) return;
    if (nav.classList.contains('nav-active')) {
      ntCloseMenu(nav, ham);
    } else {
      ntOpenMenu(nav, ham);
    }
  }

  function ntBindMobileNav() {
    var nav = document.querySelector('#site-header .nav-links');
    var ham = document.querySelector('#site-header .hamburger');
    if (!nav || !ham || ham.dataset.ntBound === '1') return;
    ham.dataset.ntBound = '1';

    function toggleMenu(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      ntToggleMenuImpl();
    }

    window.ntToggleMenu = toggleMenu;

    ham.addEventListener('click', toggleMenu);
    ham.addEventListener('touchend', toggleMenu, { passive: false });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') ntCloseMenu(nav, ham);
    });

    document.addEventListener('click', function (e) {
      if (
        nav.classList.contains('nav-active') &&
        !nav.contains(e.target) &&
        !ham.contains(e.target)
      ) {
        ntCloseMenu(nav, ham);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-active')) {
        ntCloseMenu(nav, ham);
      }
    });
  }

  function ntInitSiteChrome() {
    if (window.__ntChromeInit) return;
    window.__ntChromeInit = true;

    var path = (location.pathname || '/').replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
    document.querySelectorAll('#site-header .nav-links a').forEach(function (a) {
      try {
        var href = (a.getAttribute('href') || '/')
          .replace(/^https?:\/\/[^/]+/, '')
          .replace(/\/index\.html$/, '/')
          .replace(/\/$/, '') || '/';
        if (href === path || (href !== '/' && path.indexOf(href) === 0)) {
          a.classList.add('active');
        }
        if (href === '/products' && /\/products\//.test(path)) {
          a.classList.add('active');
        }
        if (href === '/blog' && /\/blog\/?$/.test(location.pathname)) {
          a.classList.add('active');
        }
      } catch (e) { /* ignore */ }
    });

    ntBindMobileNav();
  }

  window.ntInitSiteChrome = ntInitSiteChrome;

  var headerEl = document.getElementById('site-header');
  var footerEl = document.getElementById('site-footer');

  if (headerEl) {
    fetch('/assets/includes/header.html')
      .then(function (r) { return r.text(); })
      .then(function (h) {
        headerEl.innerHTML = h;
        ntInitSiteChrome();
      })
      .catch(function () { /* silent */ });
  }

  if (footerEl) {
    fetch('/assets/includes/footer.html')
      .then(function (r) { return r.text(); })
      .then(function (h) {
        footerEl.innerHTML = h;
      })
      .catch(function () { /* silent */ });
  }
})();
