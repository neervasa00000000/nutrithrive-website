(() => {
  const R = () => window.NTRetention;

  function bootOrderHelp() {
    const root = document.getElementById("order-help-app");
    if (!root || !R()) return;
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("product") || "";
    const last = R().readLastOrder();
    const ids = requested
      ? [requested]
      : (last?.items || []).map((item) => item.id);
    const help = document.getElementById("order-help-blocks");
    const complements = document.getElementById("order-help-complements");
    const review = document.getElementById("order-help-review");
    const buy = document.getElementById("order-help-buy-again");
    if (help) {
      help.innerHTML = ids.length
        ? R().guideBlocks(ids)
        : `<section class="retention-block"><h2>Help for what you ordered</h2><p>Open this page from your confirmation email, or choose a product below.</p>
          <ul class="retention-links">
            <li><a href="/order-help/?product=curry-leaves">Dried curry leaves</a></li>
            <li><a href="/order-help/?product=black-tea">Darjeeling tea</a></li>
            <li><a href="/order-help/?product=moringa-soap">Moringa soap</a></li>
            <li><a href="/order-help/?product=moringa-powder">Moringa powder</a></li>
          </ul></section>`;
      R().bindGuideClicks(help);
    }
    if (review) {
      review.innerHTML = R().reviewBlock({ delayed: false });
      R().bindReviewClicks(review);
    }
    if (complements) R().renderComplements(complements, ids);
    if (buy) R().renderBuyAgain(buy, { source: "order-help" });
  }

  function bootReorder() {
    const root = document.getElementById("reorder-app");
    if (!root || !R()) return;
    const resolved = R().resolveLastOrder();
    const empty = document.getElementById("reorder-empty");
    const filled = document.getElementById("reorder-filled");
    const list = document.getElementById("reorder-buy-again");
    const complements = document.getElementById("reorder-complements");
    const progress = document.getElementById("reorder-progress");
    if (!resolved.available.length && !resolved.missing.length) {
      if (empty) empty.hidden = false;
      if (filled) filled.hidden = true;
      return;
    }
    if (empty) empty.hidden = true;
    if (filled) filled.hidden = false;
    if (list) R().renderBuyAgain(list, { heading: "Your last order", source: "reorder" });
    if (complements) R().renderComplements(complements, resolved.available.map((item) => item.id));
    if (progress) {
      const subtotal = resolved.available.reduce((sum, item) => sum + Number(item.price) * Number(item.qty || 1), 0);
      progress.innerHTML = R().progressHtml(subtotal);
    }
  }

  function boot() {
    bootOrderHelp();
    bootReorder();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
