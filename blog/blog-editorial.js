/**
 * Lightweight enhancements for editorial components (checklists, print hint).
 */
(function () {
  'use strict';

  document.querySelectorAll('.blog-interactive-checklist').forEach(function (box) {
    var key = 'nt-checklist-' + (document.location.pathname || 'blog').replace(/\W+/g, '-').slice(0, 80);
    try {
      var saved = JSON.parse(sessionStorage.getItem(key) || '{}');
      box.querySelectorAll('input[type="checkbox"]').forEach(function (cb, i) {
        var id = cb.id || key + '-item-' + i;
        if (!cb.id) cb.id = id;
        if (saved[id]) cb.checked = true;
        cb.addEventListener('change', function () {
          try {
            var next = JSON.parse(sessionStorage.getItem(key) || '{}');
            next[id] = cb.checked;
            sessionStorage.setItem(key, JSON.stringify(next));
          } catch (e) { /* ignore */ }
        });
      });
    } catch (e) { /* ignore */ }
  });
})();
