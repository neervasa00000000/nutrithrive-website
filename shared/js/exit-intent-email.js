/**
 * Soft exit-intent email capture on product pages.
 * Stores dismissals in sessionStorage so it does not loop.
 */
(function () {
  if (window.__NT_EXIT_INTENT__) return;
  window.__NT_EXIT_INTENT__ = true;

  var STORAGE_KEY = 'nt_exit_intent_dismissed';
  var shown = false;

  function alreadyDismissed() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function markDismissed() {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {}
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.documentElement.classList.remove('nt-exit-open');
    markDismissed();
  }

  function openModal(modal) {
    if (!modal || shown || alreadyDismissed()) return;
    shown = true;
    modal.removeAttribute('hidden');
    document.documentElement.classList.add('nt-exit-open');
    var email = modal.querySelector('input[type="email"]');
    if (email) {
      setTimeout(function () {
        try {
          email.focus();
        } catch (e) {}
      }, 50);
    }
  }

  function buildModal() {
    var existing = document.getElementById('nt-exit-intent');
    if (existing) return existing;

    var modal = document.createElement('div');
    modal.id = 'nt-exit-intent';
    modal.className = 'nt-exit-intent';
    modal.setAttribute('hidden', '');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'nt-exit-title');
    modal.innerHTML =
      '<div class="nt-exit-intent__backdrop" data-nt-exit-close></div>' +
      '<div class="nt-exit-intent__panel">' +
      '<button type="button" class="nt-exit-intent__close" data-nt-exit-close aria-label="Close">×</button>' +
      '<h2 id="nt-exit-title">Want batch updates and offers?</h2>' +
      '<p>Leave your email and we will send the occasional offer from NutriThrive (Truganina). No spam.</p>' +
      '<form class="nt-exit-intent__form" name="newsletter" method="POST" data-netlify="true" data-nt-form-type="newsletter" action="/pages/newsletter/thank-you.html">' +
      '<input type="hidden" name="form-name" value="newsletter">' +
      '<label class="sr-only" for="nt-exit-email">Email</label>' +
      '<input id="nt-exit-email" type="email" name="email" required placeholder="you@email.com" autocomplete="email">' +
      '<button type="submit">Keep me posted</button>' +
      '</form>' +
      '<p class="nt-exit-intent__fine">You can unsubscribe any time.</p>' +
      '</div>';

    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) {
      if (e.target && e.target.hasAttribute('data-nt-exit-close')) {
        closeModal(modal);
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal(modal);
    });
    return modal;
  }

  function init() {
    if (alreadyDismissed()) return;
    var modal = buildModal();
    var armed = false;

    // Avoid firing immediately on load / mobile scroll bounce.
    setTimeout(function () {
      armed = true;
    }, 12000);

    document.addEventListener(
      'mouseout',
      function (e) {
        if (!armed || shown) return;
        if (e.clientY > 12) return;
        if (e.relatedTarget || e.toElement) return;
        openModal(modal);
      },
      { passive: true }
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
