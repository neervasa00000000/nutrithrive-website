/**
 * Pokifinder live stock pill on retail pages (all sites over HTTPS/HTTP).
 * Uses rendered DOM + aria-labels + JSON-LD Product when present.
 */
(function () {
  const ATTR = "data-pokifinder-stock-badge";
  const FLOAT_ID = "pokifinder-float-stock";
  const PDP_NOTIFY_RE =
    /notify\s*(me|when)|email\s*when|(?:sold|currently)\s*out|out\s*of\s*stock|unavailable|no\s*longer\s*available/i;

  const ANCHOR_SEL = [
    '[data-testid="product-price"]',
    '[itemprop="price"]',
    "#productPrice",
    "#ProductPrice",
    ".product__price",
    ".product-price",
    ".woocommerce-Price-amount.amount",
    ".price-item--sale",
    ".price-item--regular",
    ".grid-product__price",
    ".product-single__price",
    "#corePrice_feature_div .a-price",
    ".a-price:not(.a-text-price)",
  ].join(", ");

  function signalsFromRoot(root) {
    if (!root) return "";
    const chunks = [(root.innerText || "").toLowerCase()];
    root.querySelectorAll("[aria-label]").forEach((n) => {
      const v = (n.getAttribute("aria-label") || "").trim();
      if (v) chunks.push(v.toLowerCase());
    });
    return chunks.join("\n");
  }

  function isVisible(el) {
    if (!el?.getBoundingClientRect) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 1 && r.height < 1) return false;
    const st = getComputedStyle(el);
    if (st.visibility === "hidden" || st.display === "none" || st.opacity === "0") return false;
    return true;
  }

  function looksLikeMoneyEl(el) {
    const t = (el.textContent || "").replace(/\s+/g, " ").trim();
    if (t.length > 56) return false;
    if (el.getAttribute("data-testid") === "product-price") return true;
    return /(\$|€|£|¥|usd|aud|gbp|eur)\s*[\d,.]+|[\d,.]+\s*(usd|aud|eur|gbp)|\d+[\d,.]*\s*(ea|each)/i.test(
      t
    );
  }

  function dedupeContained(nodes) {
    const arr = [...nodes].filter(Boolean);
    return arr.filter((n) => !arr.some((o) => o !== n && o.contains(n)));
  }

  function findPriceCandidates(root = document) {
    const sels = [
      '[data-testid="product-price"]',
      '[itemprop="price"]',
      "#productPrice",
      "#ProductPrice",
      ".product__price",
      ".product-price",
      '[class*="product-price"]',
      ".grid-product__price",
      ".price-item--sale",
      ".price-item--regular",
      ".woocommerce-Price-amount.amount",
      ".product-single__price",
      "#corePrice_feature_div .a-price",
      ".a-price:not(.a-text-price)",
    ];
    const raw = [];
    for (const sel of sels) {
      root.querySelectorAll(sel).forEach((el) => {
        if (!isVisible(el)) return;
        if (el.getAttribute("data-testid") === "product-price") {
          raw.push(el);
          return;
        }
        if (!looksLikeMoneyEl(el)) return;
        raw.push(el);
      });
    }
    return dedupeContained(raw);
  }

  function priceAnchorsIn(node) {
    if (!node?.querySelectorAll) return [];
    return dedupeContained([...node.querySelectorAll(ANCHOR_SEL)].filter(isVisible));
  }

  function findListingTileGeneric(priceEl) {
    let p = priceEl.parentElement;
    let best = p || priceEl;
    while (p && p !== document.body) {
      const anchors = priceAnchorsIn(p);
      const mine = anchors.find((a) => a === priceEl || a.contains(priceEl) || priceEl.contains(a));
      if (!mine || anchors.length > 1) break;
      best = p;
      p = p.parentElement;
    }
    return best;
  }

  function mapSchemaAvail(url) {
    if (!url) return "unknown";
    const u = String(url).toLowerCase();
    if (u.includes("instock") || u.includes("in_stock")) return "in_stock";
    if (u.includes("outofstock") || u.includes("soldout") || u.includes("discontinued"))
      return "out_of_stock";
    if (u.includes("preorder") || u.includes("presale") || u.includes("backorder")) return "preorder";
    return "unknown";
  }

  function schemaAvailability(doc) {
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
    for (const script of scripts) {
      let data;
      try {
        data = JSON.parse(script.textContent || "");
      } catch {
        continue;
      }
      const stack = Array.isArray(data) ? [...data] : [data];
      while (stack.length) {
        const node = stack.pop();
        if (!node || typeof node !== "object") continue;
        if (node["@graph"]) node["@graph"].forEach((g) => stack.push(g));
        const types = [].concat(node["@type"] || []);
        if (types.some((t) => t === "Product" || t === "IndividualProduct")) {
          const offers = [].concat(node.offers || []);
          for (const o of offers) {
            if (o && o.availability) return mapSchemaAvail(o.availability);
          }
        }
      }
    }
    return "unknown";
  }

  function hasProductJsonLd(doc) {
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
    for (const s of scripts) {
      if (/Product|IndividualProduct|"offers"/i.test(s.textContent || "")) return true;
    }
    return false;
  }

  function shouldTouchPage() {
    if (!document.body) return false;
    const path = location.pathname.toLowerCase();
    const sniff = (document.body.innerText || "").toLowerCase().slice(0, 14000);
    if (/\b(add to cart|add to bag|add to basket|buy now|purchase)\b/.test(sniff)) return true;
    if (document.querySelector('[itemprop="price"], [itemprop="offers"], [itemtype*="Product" i]'))
      return true;
    if (document.querySelector(ANCHOR_SEL)) return true;
    if (hasProductJsonLd(document)) return true;
    if (
      /\/(product|products|shop|store|catalog|collection|collections|item|\bp\/|\/dp\/|sku)/i.test(path)
    )
      return true;
    return false;
  }

  function isLikelyPdpPath() {
    const path = location.pathname.toLowerCase();
    if (/\/(product|products|item|dp|p)\b/i.test(path)) return true;
    if (/\/[^/]+\/\d{4,}\/?$/i.test(path)) return true;
    return false;
  }

  function findGenericBuyControl(doc) {
    const tryBtn = (btn) => {
      if (!btn || !isVisible(btn)) return null;
      const t = (btn.textContent || "").toLowerCase();
      if (/wishlist|share|notify me when back/i.test(t)) return null;
      return btn;
    };

    const kmart = doc.querySelector('[data-testid="product-button"], button.product-button');
    if (kmart) return tryBtn(kmart);

    const ids = ["#add-to-cart", "#AddToCart", 'button[name="add"]', '[data-add-to-cart]'];
    for (const sel of ids) {
      const b = doc.querySelector(sel);
      if (tryBtn(b)) return b;
    }

    const submits = [...doc.querySelectorAll('button[type="submit"], input[type="submit"][class*="cart" i]')];
    for (const b of submits) {
      const t = (b.value || b.textContent || "").toLowerCase();
      if (/cart|bag|basket|checkout|buy/i.test(t)) return tryBtn(b);
    }

    const byClass = [...doc.querySelectorAll('button, [role="button"]')].find((b) =>
      /add-to-cart|addtocart|product-form__submit|btn-cart/i.test(b.className || "")
    );
    return tryBtn(byClass);
  }

  function detectPdpFromDom(doc) {
    const main = doc.querySelector('main, [role="main"], #__next') || doc.body;
    const buyBtn = findGenericBuyControl(doc);
    const buyArea =
      buyBtn?.closest("form, [class*='product'], section, article, div[class*='buy'], div[class*='purchase']") ||
      doc.querySelector(".product-form, [class*='product-details'], #product") ||
      main;

    const buyText = signalsFromRoot(buyArea);

    if (/\bin[\s-]*store[\s-]*only\b/.test(buyText)) {
      return { status: "not_online", detail: "In store only (not online)" };
    }

    if (buyBtn) {
      const label = (buyBtn.textContent || "").trim().toLowerCase();
      const dis =
        buyBtn.hasAttribute("disabled") ||
        buyBtn.getAttribute("aria-disabled") === "true" ||
        !!buyBtn.closest('[aria-disabled="true"]') ||
        /\bMui-disabled\b/.test(buyBtn.className);

      if (PDP_NOTIFY_RE.test(label)) {
        return { status: "not_online", detail: label.slice(0, 80) };
      }
      if (dis) {
        return { status: "not_online", detail: "Buy / add button disabled" };
      }
      if (/add to (bag|cart|basket)|buy now|purchase/.test(label)) {
        return { status: "online", detail: "Primary buy control is active" };
      }
    }

    const scoped = buyText.slice(0, 4500);
    if (/\bsold\s*out\b|\bout\s*of\s*stock\b/.test(scoped) && !/add to (bag|cart|basket)/.test(scoped)) {
      return { status: "not_online", detail: "Sold out / out of stock (page)" };
    }

    return { status: "unclear", detail: "No clear buy control found" };
  }

  function detectCard(tileEl) {
    const t = signalsFromRoot(tileEl);
    const inStoreOnly = /\bin[\s-]*store[\s-]*only\b/.test(t);
    const oos =
      /\bout\s*of\s*stock\b|\bsold\s*out\b|unavailable\s*online|not\s*available\s*online|currently\s*unavailable/i.test(
        t
      );

    if (oos && inStoreOnly) {
      return { status: "not_online", detail: "Out of stock · in store only" };
    }
    if (oos) {
      return { status: "not_online", detail: "Out of stock (grid)" };
    }
    if (inStoreOnly) {
      return { status: "not_online", detail: "In store only (not online)" };
    }
    if (/add to bag|add to cart|add to basket/.test(t)) {
      return { status: "online", detail: "Add-to-cart on grid" };
    }
    if (/online only|ships|delivery|free shipping/i.test(t) && !oos) {
      return { status: "online", detail: "Shipping cues on tile" };
    }
    return { status: "unclear", detail: "No stock hints on tile" };
  }

  function detectPageBuyability(doc, mode, tile) {
    if (mode === "tile" && tile) {
      return detectCard(tile);
    }

    const sch = schemaAvailability(doc);
    if (sch === "out_of_stock") {
      return { status: "not_online", detail: "Structured data: out of stock" };
    }
    if (sch === "preorder") {
      return { status: "online", detail: "Structured data: preorder" };
    }

    const dom = detectPdpFromDom(doc);
    if (dom.status !== "unclear") return dom;
    if (sch === "in_stock") {
      return { status: "online", detail: "Structured data: in stock" };
    }
    return dom;
  }

  function badgeHost(status, detail, compact) {
    const host = document.createElement("span");
    host.setAttribute(ATTR, "1");
    const root = host.attachShadow({ mode: "open" });
    const bg =
      status === "online" ? "#16a34a" : status === "not_online" ? "#dc2626" : "#6b7280";
    const label =
      status === "online"
        ? "Confirmed — online"
        : status === "not_online"
          ? "Not online"
          : "Unconfirmed";
    const safeTitle = detail.replace(/"/g, "&quot;").replace(/</g, "");
    root.innerHTML = `
      <style>
        .pill {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          font-size: ${compact ? "11px" : "12px"};
          font-weight: 600;
          line-height: 1.25;
          margin-left: ${compact ? "6px" : "10px"};
          margin-top: ${compact ? "4px" : "0"};
          padding: ${compact ? "3px 8px" : "4px 10px"};
          border-radius: 999px;
          color: #fff;
          background: ${bg};
          letter-spacing: 0.01em;
          vertical-align: middle;
          max-width: min(300px, 48vw);
        }
        .hint {
          font-weight: 500;
          font-size: 10px;
          opacity: 0.95;
          margin-top: 2px;
          color: #fff;
          white-space: normal;
        }
      </style>
      <span class="pill" title="${safeTitle}">
        Pokifinder · ${label}
        <span class="hint">${escapeHtml(detail).slice(0, 90)}</span>
      </span>
    `;
    return host;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function removeFloating() {
    document.getElementById(FLOAT_ID)?.remove();
  }

  function showFloatingPill(r) {
    removeFloating();
    const wrap = document.createElement("div");
    wrap.id = FLOAT_ID;
    wrap.style.cssText =
      "position:fixed;top:14px;right:14px;z-index:2147483647;pointer-events:none;";
    const host = badgeHost(r.status, r.detail, false);
    host.style.pointerEvents = "auto";
    wrap.appendChild(host);
    document.documentElement.appendChild(wrap);
  }

  function mountNearPrice(priceEl, status, detail, compact) {
    const p = priceEl.parentElement;
    if (!p || priceEl.closest(`[${ATTR}]`)) return;
    if (p.querySelector(`[${ATTR}]`)) return;
    const host = badgeHost(status, detail, compact);
    priceEl.insertAdjacentElement("afterend", host);
  }

  function run() {
    removeFloating();
    if (!shouldTouchPage()) return;

    const cands = dedupeContained(findPriceCandidates(document));
    const listingMode = cands.length > 1 || !isLikelyPdpPath();

    if (cands.length === 0) {
      if (isLikelyPdpPath() || hasProductJsonLd(document)) {
        const r = detectPageBuyability(document, "pdp", null);
        showFloatingPill(r);
      }
      return;
    }

    if (cands.length === 1) {
      const priceEl = cands[0];
      priceEl.parentElement?.querySelectorAll(`[${ATTR}]`).forEach((b) => b.remove());
      const tile = findListingTileGeneric(priceEl);
      const r = detectPageBuyability(document, listingMode ? "tile" : "pdp", listingMode ? tile : null);
      mountNearPrice(priceEl, r.status, r.detail, listingMode);
      return;
    }

    cands.forEach((priceEl) => {
      const tile = findListingTileGeneric(priceEl);
      priceEl.parentElement?.querySelectorAll(`[${ATTR}]`).forEach((b) => b.remove());
      const r = detectPageBuyability(document, "tile", tile);
      mountNearPrice(priceEl, r.status, r.detail, true);
    });
  }

  let timer;
  function debounced() {
    clearTimeout(timer);
    timer = setTimeout(run, 80);
  }

  run();
  const mo = new MutationObserver(debounced);
  mo.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["aria-label", "disabled", "aria-disabled", "class"],
  });
})();
