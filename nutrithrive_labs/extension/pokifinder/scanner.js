/**
 * Heuristics to detect Pokémon TCG-related pages and extract buyable product signals.
 * Listing/grid pages are not trusted for stock — PDP verification is required for accuracy.
 */

const POKEMON_TERMS = [
  "pokemon",
  "pokémon",
  "tcg",
  "trading card",
  "booster box",
  "booster pack",
  "elite trainer",
  " etb",
  "tin ",
  "blister",
  "charizard",
  "pikachu",
  "vmax",
  "v-star",
  "vstar",
  " gx",
  " ex ",
  "illustration rare",
  "sleeved",
  "build & battle",
];

const BUY_PHRASES = [
  "add to cart",
  "add to bag",
  "buy now",
  "purchase",
  "in stock",
  "only ",
  " left",
  "available",
  "pre-order",
  "preorder",
];

const OUT_PHRASES = [
  "sold out",
  "out of stock",
  "unavailable",
  "notify me",
  "notify when",
  "coming soon",
  "no longer available",
  "currently unavailable",
  "not sold online",
  "can't be shipped",
  "cannot be shipped",
  "pick up only",
  "in store only",
  "in-store only",
];

const PDP_NOTIFY_LABEL_RE =
  /notify\s*(me|when)|email\s*when|(?:sold|currently)\s*out|out\s*of\s*stock|unavailable|no\s*longer\s*available/i;

const PRICE_RE = /\$\s?\d{1,4}(?:[.,]\d{2})?|\b(?:aud|usd|gbp|eur)\s?\d{1,4}\b/i;

/** Same-origin full URL without hash, lowercased host + path for map keys */
export function urlSnapshotKey(url) {
  try {
    const u = new URL(url);
    u.hash = "";
    return `${u.origin}${u.pathname}`.toLowerCase() + u.search.toLowerCase();
  } catch {
    return (url || "").toLowerCase();
  }
}

function norm(s) {
  return (s || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200)
    .toLowerCase();
}

export function scorePokemonRelevance(lowerText) {
  let score = 0;
  for (const t of POKEMON_TERMS) {
    if (lowerText.includes(t.toLowerCase())) score += 1;
  }
  return score;
}

export function looksLikeProductDetailUrl(url) {
  try {
    const u = new URL(url);
    const path = u.pathname.toLowerCase();
    if (path.includes("/product/")) return true;
    if (path.includes("/p/")) return true;
    if (/\/dp\/[a-z0-9]+/i.test(path)) return true;
    if (path.includes("/item/")) return true;
    return false;
  } catch {
    return false;
  }
}

function availabilityFromSchema(url) {
  if (!url) return "unknown";
  const u = url.toLowerCase();
  if (u.includes("instock") || u.includes("in_stock")) return "in_stock";
  if (u.includes("outofstock") || u.includes("soldout") || u.includes("discontinued"))
    return "out_of_stock";
  if (u.includes("preorder") || u.includes("presale")) return "preorder";
  if (u.includes("backorder")) return "preorder";
  return "unknown";
}

function extractJsonLdProducts(doc, pageUrl) {
  const products = [];
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  for (const script of scripts) {
    let data;
    try {
      data = JSON.parse(script.textContent);
    } catch {
      continue;
    }
    const nodes = Array.isArray(data) ? data : [data];
    for (const node of nodes) {
      collectLdProducts(node, products, pageUrl);
    }
  }
  return products;
}

function collectLdProducts(node, out, pageUrl) {
  if (!node || typeof node !== "object") return;
  if (node["@graph"] && Array.isArray(node["@graph"])) {
    for (const g of node["@graph"]) collectLdProducts(g, out, pageUrl);
    return;
  }
  const type = node["@type"];
  const types = Array.isArray(type) ? type : type ? [type] : [];
  if (types.some((t) => t === "Product" || t === "IndividualProduct")) {
    const name = node.name || node.title || "";
    const offers = node.offers;
    const offerList = offers
      ? Array.isArray(offers)
        ? offers
        : [offers]
      : [];
    let avail = "unknown";
    let price = "";
    for (const o of offerList) {
      if (o.availability) avail = availabilityFromSchema(o.availability);
      if (o.price) price = String(o.price);
    }
    let href = node.url || "";
    try {
      href = href ? new URL(href, pageUrl).href : "";
    } catch {
      href = "";
    }
    href = href ? href.split("#")[0] : "";
    if (name) {
      out.push({
        key: norm(`${href}|${name}`),
        canonicalUrl: href || "",
        title: String(name).slice(0, 180),
        availability: avail,
        priceHint: price,
        source: "json-ld",
      });
    }
  }
}

function extractLinkProducts(doc, pageUrl) {
  const out = [];
  const origin = (() => {
    try {
      return new URL(pageUrl).origin;
    } catch {
      return "";
    }
  })();
  const anchors = doc.querySelectorAll(
    'a[href*="/product/"], a[href*="/p/"], a[href*="/dp/"], a[href*="/item/"], a[href*="/shop/"], a[href*="/collections/"]'
  );
  const seen = new Set();
  for (const a of anchors) {
    let href = a.getAttribute("href") || "";
    try {
      href = new URL(href, pageUrl).href;
    } catch {
      continue;
    }
    href = href.split("#")[0];
    if (origin && !href.startsWith(origin)) continue;
    const title = norm(a.textContent);
    if (title.length < 6 && !looksLikeProductDetailUrl(href)) continue;
    const row = a.closest("li, article, .product, [class*='product'], tr, .grid-item, div[class*='tile']");
    const ctx = row ? norm(row.innerText) : title;
    const lower = ctx.toLowerCase();
    const hrefLower = href.toLowerCase();
    const looksPokemon =
      scorePokemonRelevance(lower) >= 1 ||
      scorePokemonRelevance(title) >= 1 ||
      /pokemon|pokémon|\/tcg|charizard|pikachu/i.test(hrefLower);
    if (!looksPokemon) continue;
    /** Never trust PLP/card copy for stock — Kmart & others lie on grids */
    const key = urlSnapshotKey(href);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      key,
      canonicalUrl: href,
      title: (title.length >= 6 ? title : href.split("/").filter(Boolean).pop() || "Product")
        .slice(0, 180)
        .replace(/-/g, " "),
      availability: "unknown",
      priceHint: "",
      source: "link",
    });
  }
  return out;
}

function textBlobSignals(lower) {
  const hasBuy =
    BUY_PHRASES.some((p) => lower.includes(p)) || PRICE_RE.test(lower);
  const hasOut = OUT_PHRASES.some((p) => lower.includes(p));
  return { hasBuy, hasOut };
}

/**
 * Strict product detail analysis — call on PDP HTML only (or listing URL if it is a PDP).
 * Button / schema truth wins over generic page copy.
 */
export function analyzeProductDetail(html, productUrl) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const ldProducts = extractJsonLdProducts(doc, productUrl);
  let fromSchema = "unknown";
  let title = "";
  let priceHint = "";
  const primaryLd = ldProducts[0];
  if (primaryLd) {
    fromSchema = primaryLd.availability;
    title = primaryLd.title;
    priceHint = primaryLd.priceHint;
  }

  const candidates = doc.querySelectorAll(
    'button[data-testid="product-button"], button.product-button, button[id*="add-to-cart"], button[class*="add-to-cart"], button[class*="addToCart"]'
  );

  let buttonVerdict = "unknown";
  for (const btn of candidates) {
    const label = (btn.textContent || "").trim();
    const lowerLabel = label.toLowerCase();
    const disabled =
      btn.hasAttribute("disabled") ||
      btn.getAttribute("aria-disabled") === "true" ||
      btn.closest("[aria-disabled='true']") != null ||
      /\bMui-disabled\b/.test(btn.className) ||
      /\bdisabled\b/.test(btn.className);

    if (PDP_NOTIFY_LABEL_RE.test(lowerLabel)) {
      buttonVerdict = "out_of_stock";
      break;
    }
    if (disabled) {
      buttonVerdict = "out_of_stock";
      break;
    }
    if (/add to (bag|cart)/i.test(lowerLabel)) {
      buttonVerdict = "in_stock";
      break;
    }
  }

  /** Buy-box only — avoids "not available for OnePass…" footer noise */
  let buyBoxOut = false;
  const buyMount =
    doc.querySelector("[data-testid='product-button']")?.closest("div[class*='product'], form, section") ||
    doc.querySelector(".product-button-container")?.parentElement;
  if (buyMount) {
    const t = buyMount.innerText.toLowerCase().slice(0, 2500);
    const hasExplicitOos =
      /\bsold\s*out\b|\bout\s*of\s*stock\b|\bunavailable\b|notify\s*when|notify\s*me|\bin[\s-]*store[\s-]*only\b/i.test(
        t
      );
    const hasAdd = /add\s*to\s*(bag|cart)/i.test(t);
    if (hasExplicitOos && !hasAdd) buyBoxOut = true;
  }

  let availability = "unknown";
  if (buttonVerdict === "out_of_stock" || buyBoxOut) availability = "out_of_stock";
  else if (buttonVerdict === "in_stock") {
    if (fromSchema === "out_of_stock") availability = "out_of_stock";
    else availability = fromSchema === "preorder" ? "preorder" : "in_stock";
  } else {
    if (fromSchema !== "unknown") availability = fromSchema;
    if (buyBoxOut) availability = "out_of_stock";
  }

  if (!title) {
    const og = doc.querySelector('meta[property="og:title"]');
    title = (og?.getAttribute("content") || doc.title || "").slice(0, 180);
  }

  return {
    availability,
    title: title || "Product",
    priceHint,
    canonicalUrl: productUrl.split("#")[0],
  };
}

/**
 * @param {string} html
 * @param {string} pageUrl
 */
export function analyzePage(html, pageUrl) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = doc.body;
  const lower = (body?.innerText || "").toLowerCase().slice(0, 250000);
  const score = scorePokemonRelevance(lower);
  const { hasBuy, hasOut } = textBlobSignals(lower);

  const fromLd = extractJsonLdProducts(doc, pageUrl);
  const fromLinks = extractLinkProducts(doc, pageUrl);
  const merged = new Map();
  for (const p of [...fromLd, ...fromLinks]) {
    const key = p.canonicalUrl ? urlSnapshotKey(p.canonicalUrl) : p.key;
    const next = { ...p, key };
    const cur = merged.get(key);
    if (!cur) merged.set(key, next);
    else {
      merged.set(key, {
        ...cur,
        ...next,
        key,
        title:
          (next.title || "").length > (cur.title || "").length ? next.title : cur.title,
        canonicalUrl: cur.canonicalUrl || next.canonicalUrl,
        availability:
          next.availability !== "unknown" ? next.availability : cur.availability,
        source: cur.source === "json-ld" || next.source === "json-ld" ? "json-ld" : next.source,
      });
    }
  }
  let products = [...merged.values()].filter(
    (p) =>
      scorePokemonRelevance(p.title.toLowerCase()) >= 1 || p.source === "json-ld"
  );

  const isPdp = looksLikeProductDetailUrl(pageUrl);
  if (isPdp && products.length <= 2) {
    const detail = analyzeProductDetail(html, pageUrl);
    if (products.length === 1) {
      products[0] = {
        ...products[0],
        availability: detail.availability,
        title: detail.title || products[0].title,
        priceHint: detail.priceHint || products[0].priceHint,
        source: products[0].source === "json-ld" ? "json-ld+pdp" : "pdp",
      };
    } else if (products.length === 0 && score >= 1) {
      products = [
        {
          key: urlSnapshotKey(pageUrl),
          canonicalUrl: pageUrl.split("#")[0],
          title: detail.title,
          availability: detail.availability,
          priceHint: detail.priceHint,
          source: "pdp",
        },
      ];
    }
  }

  if (products.length === 0 && score >= 2) {
    products = [
      {
        key: `${urlSnapshotKey(pageUrl)}|page`,
        canonicalUrl: pageUrl.split("#")[0],
        title: "Page inventory (could not split items)",
        availability: hasOut && !hasBuy ? "out_of_stock" : "unknown",
        priceHint: "",
        source: "page",
      },
    ];
  }

  return {
    pageRelevanceScore: score,
    likelyPokemonStore: score >= 2 || products.length > 0,
    buySignals:
      hasBuy ||
      products.some((p) => p.availability === "in_stock" || p.availability === "preorder"),
    products,
    pageTextSample: lower.slice(0, 2000),
  };
}

/**
 * @param {ReturnType<typeof analyzePage>["products"]} products
 * @param {Map<string, ReturnType<typeof analyzeProductDetail>>} pdpMap snapshot key -> detail
 */
export function applyPdpVerification(products, pdpMap) {
  return products.map((p) => {
    if (!p.canonicalUrl || !looksLikeProductDetailUrl(p.canonicalUrl)) return p;
    const detail = pdpMap.get(urlSnapshotKey(p.canonicalUrl));
    if (!detail) return p;
    return {
      ...p,
      availability: detail.availability,
      title: detail.title && detail.title.length > 3 ? detail.title : p.title,
      priceHint: detail.priceHint || p.priceHint,
      source: p.source === "json-ld" ? "json-ld+pdp" : "pdp",
    };
  });
}

/**
 * Collect same-origin PDP URLs to verify (listing + product rows).
 */
export function collectPdpUrlsToVerify(listUrl, products, max = 30) {
  const origin = (() => {
    try {
      return new URL(listUrl).origin;
    } catch {
      return "";
    }
  })();
  const urls = [];
  const seen = new Set();
  const push = (u) => {
    if (!u || !looksLikeProductDetailUrl(u)) return;
    try {
      if (origin && new URL(u).origin !== origin) return;
    } catch {
      return;
    }
    const k = urlSnapshotKey(u);
    if (seen.has(k)) return;
    seen.add(k);
    urls.push(u.split("#")[0]);
  };

  push(listUrl);
  for (const p of products) {
    if (p.canonicalUrl) push(p.canonicalUrl);
    if (urls.length >= max) break;
  }
  return urls.slice(0, max);
}

/**
 * @param {ReturnType<typeof analyzePage>["products"]} prev
 * @param {ReturnType<typeof analyzePage>["products"]} next
 */
export function diffSnapshots(prev, next) {
  const prevMap = new Map(prev.map((p) => [p.key, p]));
  const events = [];
  for (const p of next) {
    const old = prevMap.get(p.key);
    if (!old) {
      if (p.availability === "in_stock" || p.availability === "preorder") {
        events.push({ type: "new_listing", product: p });
      } else if (p.source !== "page") {
        events.push({ type: "new_product", product: p });
      }
      continue;
    }
    const wasOut =
      old.availability === "out_of_stock" || old.availability === "unknown";
    const nowIn = p.availability === "in_stock" || p.availability === "preorder";
    if (wasOut && nowIn) {
      events.push({ type: "restock", product: p, previous: old });
    }
    if (
      old.availability === "out_of_stock" &&
      (p.availability === "in_stock" || p.availability === "preorder")
    ) {
      /* already emitted as restock */
    }
  }
  return events;
}
