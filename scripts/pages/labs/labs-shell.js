(() => {
  "use strict";

  function initMobileNav() {
    document.querySelectorAll(".topbar-inner").forEach((inner) => {
      const nav = inner.querySelector(".nav, .labs-nav-menu");
      if (!nav || inner.querySelector(".nav-toggle")) return;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-toggle";
      btn.setAttribute("aria-label", "Toggle menu");
      btn.setAttribute("aria-expanded", "false");
      btn.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';

      btn.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });

      document.addEventListener("click", (e) => {
        if (!inner.contains(e.target)) {
          nav.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
        }
      });

      inner.appendChild(btn);
    });
  }

  function initToolSearch() {
    const search = document.getElementById("labsSearch");
    const grid = document.getElementById("labsGrid");
    if (!search || !grid) return;

    const posters = [...grid.querySelectorAll(".poster, .labs-poster")];
    const filters = [...document.querySelectorAll(".labs-filter")];
    let activeCategory = "all";

    function applyFilters() {
      const q = search.value.trim().toLowerCase();
      let visible = 0;

      posters.forEach((card) => {
        const cat = (card.dataset.category || "").toLowerCase();
        const text = card.textContent.toLowerCase();
        const matchCat = activeCategory === "all" || cat === activeCategory;
        const matchQ = !q || text.includes(q);
        const show = matchCat && matchQ;
        card.classList.toggle("is-hidden", !show);
        if (show) visible++;
      });

      const meta = document.getElementById("labsCount");
      if (meta) {
        meta.textContent =
          visible === posters.length
            ? `${posters.length} tools available. All run in your browser with no sign-up.`
            : `Showing ${visible} of ${posters.length} tools.`;
      }
    }

    search.addEventListener("input", applyFilters);

    filters.forEach((chip) => {
      chip.addEventListener("click", () => {
        filters.forEach((f) => f.classList.remove("is-active"));
        chip.classList.add("is-active");
        activeCategory = chip.dataset.filter || "all";
        applyFilters();
      });
    });
  }

  function init() {
    initMobileNav();
    initToolSearch();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
