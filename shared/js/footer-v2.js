/** NutriThrive v2 footer — single source for layout-v2.js and legacy pages. */
(function (global) {
  function resolveHref(file) {
    return file.startsWith('http') || file.startsWith('/') ? file : `/${file}`;
  }

  function renderFooter(container, d) {
    if (!container || !d) return;
    const year = new Date().getFullYear();
    const tagline = d.footerTagline || d.tagline || '';
    const navCols = (d.footerNav || [])
      .map(
        (col) => `
    <div class="nt-footer-col">
      <h3 class="nt-footer-col-title">${col.title}</h3>
      <ul class="nt-footer-links">
        ${col.links
          .map((link) => {
            const href = resolveHref(link.file);
            return `<li><a href="${href}">${link.label}</a></li>`;
          })
          .join('')}
      </ul>
    </div>`
      )
      .join('');

    container.innerHTML = `
<div class="nt-v2-footer">
  <div class="nt-footer-inner">
    <div class="nt-footer-grid">
      <div class="nt-footer-col nt-footer-brand">
        <a class="nt-footer-logo" href="/">${d.brand}</a>
        <p class="nt-footer-tagline">${tagline}</p>
        <div class="nt-footer-socials" aria-label="Social media">
          <a class="nt-footer-social" href="${d.social.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
      ${navCols}
      <div class="nt-footer-col">
        <h3 class="nt-footer-col-title">Contact Us</h3>
        <ul class="nt-footer-links">
          <li><a href="mailto:${d.contact.email}">${d.contact.email}</a></li>
          <li><a href="tel:${d.contact.phoneTel}">${d.contact.phone}</a></li>
        </ul>
      </div>
      <div class="nt-footer-col nt-footer-business">
        <h3 class="nt-footer-col-title">Business Info</h3>
        <ul class="nt-footer-links">
          <li><strong class="nt-footer-brand-name">${d.brand}</strong><br/>${d.contact.address}</li>
          <li>${d.contact.hours}</li>
          <li>ABN ${d.contact.abn}</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="nt-footer-bar">
    <p class="nt-footer-copy">© ${year} ${d.brand}</p>
  </div>
</div>`;
  }

  global.NT_renderFooter = renderFooter;

  function initLegacy() {
    const el = document.getElementById('nt-footer');
    if (el && global.NT_SITE_DATA && !el.dataset.ntFooterReady) {
      el.dataset.ntFooterReady = '1';
      renderFooter(el, global.NT_SITE_DATA);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLegacy);
  } else {
    initLegacy();
  }
})(typeof window !== 'undefined' ? window : global);
