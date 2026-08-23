/**
 * Reddit Ads Pixel — pixel_id: a2_ihc1rio99viy
 * Loaded after first user interaction so crawlers (Googlebot) do not fetch
 * alb.reddit.com/rp.gif (blocked by Reddit robots.txt — shows as GSC resource warning).
 */
(function () {
  var loaded = false;

  function isCrawler() {
    try {
      return /bot|crawl|spider|googlebot|bingbot|yandex|duckduckbot/i.test(
        navigator.userAgent || ""
      );
    } catch (e) {
      return false;
    }
  }

  function boot() {
    if (loaded || isCrawler()) return;
    loaded = true;
    !function (w, d) {
      if (!w.rdt) {
        var p = (w.rdt = function () {
          p.sendEvent ? p.sendEvent.apply(p, arguments) : p.callQueue.push(arguments);
        });
        p.callQueue = [];
        var t = d.createElement("script");
        t.src = "https://www.redditstatic.com/ads/pixel.js?pixel_id=a2_ihc1rio99viy";
        t.async = true;
        var s = d.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(t, s);
      }
    })(window, document);
    window.rdt("init", "a2_ihc1rio99viy");
    window.rdt("track", "PageVisit");
  }

  function deferUntilInteraction(fn) {
    if (window.DeferLoader && typeof window.DeferLoader.deferUntilInteraction === "function") {
      window.DeferLoader.deferUntilInteraction(fn, { once: true, passive: true });
      return;
    }
    var events = ["scroll", "touchstart", "mousemove", "keydown", "click"];
    var run = function () {
      fn();
      events.forEach(function (ev) {
        document.removeEventListener(ev, run, true);
        window.removeEventListener(ev, run, true);
      });
    };
    events.forEach(function (ev) {
      document.addEventListener(ev, run, { passive: true, capture: true });
      window.addEventListener(ev, run, { passive: true, capture: true });
    });
  }

  if (isCrawler()) return;

  if (window.DeferLoader) {
    deferUntilInteraction(boot);
  } else {
    document.addEventListener(
      "DOMContentLoaded",
      function () {
        deferUntilInteraction(boot);
      },
      { once: true }
    );
  }
})();
