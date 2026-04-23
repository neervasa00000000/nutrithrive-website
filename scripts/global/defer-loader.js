/**
 * Defer Loader Utility
 * Delays non-critical JavaScript until user interaction or idle time
 * Improves PageSpeed by reducing render-blocking and main-thread JS
 */

if (window.__NT_DEFER_LOADER_INITIALIZED__) {
  if (window.console && console.log) {
    console.log('[DeferLoader] Already initialized, skipping duplicate load');
  }
} else {
window.__NT_DEFER_LOADER_INITIALIZED__ = true;
(function() {
  'use strict';

  const SITE_ORIGIN = 'https://nutrithrive.com.au';

  function ensureViewportMeta() {
    try {
      const desired = 'width=device-width, initial-scale=1';
      let meta = document.querySelector('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'viewport');
        document.head.appendChild(meta);
      }
      const current = (meta.getAttribute('content') || '').trim();
      if (current !== desired) {
        meta.setAttribute('content', desired);
      }
    } catch (e) {
      // noop
    }
  }

  function normalizeCanonicalPath(pathname) {
    // Always use leading slash.
    let path = pathname || '/';
    if (!path.startsWith('/')) path = `/${path}`;

    // Convert /index.html to /
    if (path.endsWith('/index.html')) path = path.slice(0, -'/index.html'.length) + '/';
    if (path === '/index.html') path = '/';

    // Ensure directory-style URLs have trailing slash.
    const lastSegment = path.split('/').filter(Boolean).pop() || '';
    const hasExtension = /\.[a-z0-9]+$/i.test(lastSegment);
    if (!hasExtension && !path.endsWith('/')) path += '/';

    // Ensure .html URLs do NOT have a trailing slash.
    if (path.endsWith('.html/')) path = path.slice(0, -1);

    // Collapse duplicate slashes (but preserve leading //? not applicable here).
    path = path.replace(/\/{2,}/g, '/');

    return path;
  }

  function ensureCanonicalLink() {
    try {
      const canonicalHref = `${SITE_ORIGIN}${normalizeCanonicalPath(window.location.pathname)}`;
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      const current = (link.getAttribute('href') || '').trim();
      if (current !== canonicalHref) {
        link.setAttribute('href', canonicalHref);
      }
    } catch (e) {
      // noop
    }
  }

  // Track loaded scripts to prevent duplicates
  const loadedScripts = new Set();
  const loadedInlines = new Set();
  let interactionTriggered = false;
  let idleTriggered = false;

  /**
   * Load an external script dynamically
   * @param {string} src - Script source URL
   * @param {Object} attrs - Additional attributes (async, defer, crossorigin, etc.)
   * @returns {Promise} Promise that resolves when script is loaded
   */
  function loadScript(src, attrs = {}) {
    // Prevent duplicate loads
    if (loadedScripts.has(src)) {
      return Promise.resolve();
    }
    loadedScripts.add(src);

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      
      // Apply attributes
      if (attrs.async !== false) script.async = true;
      if (attrs.defer) script.defer = true;
      if (attrs.crossorigin) script.crossOrigin = attrs.crossorigin;
      if (attrs.integrity) script.integrity = attrs.integrity;
      if (attrs.referrerpolicy) script.referrerPolicy = attrs.referrerpolicy;
      if (attrs.type) script.type = attrs.type;
      
      // Add any custom attributes
      if (attrs.attrs) {
        Object.keys(attrs.attrs).forEach(key => {
          script.setAttribute(key, attrs.attrs[key]);
        });
      }

      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      
      // Insert before first script or at end of head
      const firstScript = document.querySelector('script');
      if (firstScript) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    });
  }

  /**
   * Execute inline code/function
   * @param {Function|string} fn - Function to execute or code string
   * @returns {void}
   */
  function loadInline(fn) {
    const key = typeof fn === 'function' ? fn.toString() : fn;
    
    // Prevent duplicate execution
    if (loadedInlines.has(key)) {
      return;
    }
    loadedInlines.add(key);

    try {
      if (typeof fn === 'function') {
        fn();
      } else {
        // SECURITY: disallow string execution (eval-like) to prevent code injection.
        // This intentionally breaks any call sites that try to pass code strings.
        console.warn('[DeferLoader] loadInline rejected non-function input');
      }
    } catch (error) {
      console.error('[DeferLoader] Error executing inline code:', error);
    }
  }

  /**
   * Defer execution until first user interaction
   * @param {Function|string} fn - Function to execute or code string
   * @param {Object} options - Options (events, once, passive)
   * @returns {void}
   */
  function deferUntilInteraction(fn, options = {}) {
    if (interactionTriggered) {
      // Already triggered, execute immediately
      loadInline(fn);
      return;
    }

    const events = options.events || ['scroll', 'touchstart', 'mousemove', 'keydown', 'click'];
    const once = options.once !== false; // Default to true
    const passive = options.passive !== false; // Default to true

    const handler = () => {
      interactionTriggered = true;
      loadInline(fn);
      
      if (once) {
        // Remove all listeners after first trigger
        events.forEach(event => {
          document.removeEventListener(event, handler, { passive, capture: true });
          window.removeEventListener(event, handler, { passive, capture: true });
        });
      }
    };

    // Add listeners with passive:true for better performance
    events.forEach(event => {
      document.addEventListener(event, handler, { passive, capture: true });
      window.addEventListener(event, handler, { passive, capture: true });
    });
  }

  /**
   * Defer execution until browser is idle
   * @param {Function|string} fn - Function to execute or code string
   * @param {Object} options - Options (timeout, forceTimeout)
   * @returns {void}
   */
  function deferUntilIdle(fn, options = {}) {
    if (idleTriggered) {
      // Already triggered, execute immediately
      loadInline(fn);
      return;
    }

    const timeout = options.timeout || 2000; // Default 2s timeout
    const forceTimeout = options.forceTimeout !== false; // Default to true

    // Use requestIdleCallback with fallback
    if (window.requestIdleCallback) {
      const idleCallback = window.requestIdleCallback(
        (deadline) => {
          idleTriggered = true;
          loadInline(fn);
        },
        { timeout }
      );

      // Force execution after timeout if forceTimeout is true
      if (forceTimeout) {
        setTimeout(() => {
          if (!idleTriggered) {
            window.cancelIdleCallback(idleCallback);
            idleTriggered = true;
            loadInline(fn);
          }
        }, timeout);
      }
    } else {
      // Fallback for browsers without requestIdleCallback
      // Use setTimeout with a short delay
      setTimeout(() => {
        idleTriggered = true;
        loadInline(fn);
      }, Math.min(timeout, 100));
    }
  }

  /**
   * Defer execution until both interaction AND idle (most aggressive deferral)
   * @param {Function|string} fn - Function to execute or code string
   * @param {Object} options - Options
   * @returns {void}
   */
  function deferUntilInteractionAndIdle(fn, options = {}) {
    let interactionDone = false;
    let idleDone = false;

    const checkAndExecute = () => {
      if (interactionDone && idleDone) {
        loadInline(fn);
      }
    };

    deferUntilInteraction(() => {
      interactionDone = true;
      checkAndExecute();
    }, options);

    deferUntilIdle(() => {
      idleDone = true;
      checkAndExecute();
    }, options);
  }

  function titleToCrumb(title) {
    return (title || '')
      .replace(/\s*\|\s*NutriThrive.*$/i, '')
      .replace(/\s*–\s*NutriThrive.*$/i, '')
      .trim();
  }

  function ensureBreadcrumbs() {
    try {
      if (document.querySelector('nav[aria-label="Breadcrumb"]')) return;

      const path = normalizeCanonicalPath(window.location.pathname);
      const isBlog = path.startsWith('/blog/') && path !== '/blog/' && path !== '/blog/index.html';
      const isProduct = path.startsWith('/products/') && path !== '/products/' && path !== '/products/index.html';
      if (!isBlog && !isProduct) return;

      const header = document.querySelector('header');
      const main = document.querySelector('main');
      if (!header || !main) return;

      const nav = document.createElement('nav');
      nav.setAttribute('aria-label', 'Breadcrumb');
      nav.setAttribute(
        'style',
        'max-width:1200px;margin:1rem auto 0;padding:0 1.5rem;font-size:0.95rem;color:#4b5563;'
      );

      const sep = () => {
        const s = document.createElement('span');
        s.setAttribute('aria-hidden', 'true');
        s.setAttribute('style', 'padding:0 0.5rem;');
        s.textContent = '>';
        return s;
      };

      const link = (href, text) => {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        a.setAttribute('style', 'color:inherit;text-decoration:none;');
        return a;
      };

      nav.appendChild(link('/', 'Home'));
      nav.appendChild(sep());

      if (isBlog) {
        nav.appendChild(link('/blog/', 'Blog'));
        nav.appendChild(sep());
        const current = document.createElement('span');
        current.setAttribute('aria-current', 'page');
        current.setAttribute('style', 'color:#111827;font-weight:600;');
        current.textContent = titleToCrumb(document.title) || 'Article';
        nav.appendChild(current);
      } else if (isProduct) {
        nav.appendChild(link('/products/', 'Products'));
        nav.appendChild(sep());
        const current = document.createElement('span');
        current.setAttribute('aria-current', 'page');
        current.setAttribute('style', 'color:#111827;font-weight:600;');
        current.textContent = titleToCrumb(document.title) || 'Product';
        nav.appendChild(current);
      }

      main.insertBefore(nav, main.firstChild);
    } catch (e) {
      // noop
    }
  }

  function enforceBlogTitleBrand() {
    try {
      const path = normalizeCanonicalPath(window.location.pathname);
      if (!path.startsWith('/blog/')) return;
      // Skip blog index pages.
      if (path === '/blog/' || path === '/blog/index.html') return;

      const brand = 'NutriThrive';
      const current = (document.title || '').trim();
      if (!current) return;
      if (new RegExp(`\\|\\s*${brand}\\s*$`, 'i').test(current)) return;

      // If a brand suffix exists (e.g. "NutriThrive Australia"), replace it.
      const cleaned = current.replace(/\s*\|\s*NutriThrive(\s+Australia)?\s*$/i, '').trim();
      document.title = `${cleaned} | ${brand}`;
    } catch (e) {
      // noop
    }
  }

  // Expose API globally
  window.DeferLoader = {
    loadScript,
    loadInline,
    deferUntilInteraction,
    deferUntilIdle,
    deferUntilInteractionAndIdle,
    // Utility to check if already triggered
    hasInteracted: () => interactionTriggered,
    hasIdled: () => idleTriggered
  };

  // Technical SEO foundations (safe to run multiple times)
  ensureViewportMeta();
  ensureCanonicalLink();
  enforceBlogTitleBrand();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureBreadcrumbs, { once: true });
  } else {
    ensureBreadcrumbs();
  }

  // Log initialization (can be removed in production)
  if (window.console && console.log) {
    console.log('[DeferLoader] Initialized - ready to defer non-critical scripts');
  }
})();
}
