/**
 * Defer Loader Utility
 * Delays non-critical JavaScript until user interaction or idle time
 * Improves PageSpeed by reducing render-blocking and main-thread JS
 */

(function() {
  'use strict';

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
      } else if (typeof fn === 'string') {
        // Execute as code string
        new Function(fn)();
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

  // Log initialization (can be removed in production)
  if (window.console && console.log) {
    console.log('[DeferLoader] Initialized - ready to defer non-critical scripts');
  }
})();
