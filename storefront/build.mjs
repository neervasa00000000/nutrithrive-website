import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { PRODUCTS, REVIEWS, costNote } from "./js/data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE = path.join(ROOT, "site");
const OUT = __dirname;
const ASSET_VERSION = "20260902-2";
const LIVE_MODE = process.env.STOREFRONT_PRODUCTION === "1";
const PAYMENT_ONLY = process.env.STOREFRONT_PAYMENT_ONLY === "1";
const LIVE_PAGES = new Set(
  (process.env.STOREFRONT_PAGES || (PAYMENT_ONLY ? "payment" : ""))
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
);
const LIVE_ARTICLE = (process.env.STOREFRONT_ARTICLE || "").trim();
const CSS_HREF = LIVE_MODE ? "/assets/css/storefront-system.css" : "/css/system.css";
const CATALOG_SRC = LIVE_MODE ? "/assets/js/storefront/catalog.js" : "/js/catalog.js";
const SEARCH_SRC = LIVE_MODE ? "/assets/js/storefront/search-index.js" : "/js/search-index.js";
const SITE_SRC = LIVE_MODE ? "/assets/js/storefront/site.js" : "/js/site.js";
const CART_PAGE_SRC = LIVE_MODE ? "/assets/js/storefront/cart-page.js" : "/js/cart-page.js";
const PAYMENT_PAGE_SRC = LIVE_MODE ? "/assets/js/storefront/payment-page.js" : "/js/payment-page.js";
const THANK_YOU_PAGE_SRC = LIVE_MODE ? "/assets/js/storefront/thank-you-page.js" : "/js/thank-you-page.js";

const CONTRACT = `<!--
THESIS: A calm Australian wellness storefront that proves lab-tested moringa with published evidence, refusing marketplace clutter and decorative green wash.
OWN-WORLD: White and stone-green fields, Inter at a short scale, 8-point rhythm, 12px buttons, 16px cards, 1px #E4E7E2 borders, almost no shadow.
STORY: The visitor understands NutriThrive sells shade-dried moringa from Melbourne, trusts the lab story, and shops or reads a guide.
FIRST VIEWPORT: Sticky 76px header; left column 48px H1 “Pure moringa. Nothing unnecessary.” with 20px supporting line and two 52px CTAs; right a 1:1 product photograph on #EAF2E9.
FORM: User-pinned NutriThrive Design System v1.0 (Apple HIG as principles). Seed: production-storefront.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

function routes() {
  if (!LIVE_MODE) {
    return {
      shop: "/shop/",
      about: "/about/",
      contact: "/contact/",
      faq: "/faq/",
      journal: "/journal/",
      cart: "/cart/",
      privacy: "/privacy/",
      shipping: "/shipping/",
      article: (slug) => `/journal/${slug}/`,
      articleAbs: (slug) => `${LIVE}/journal/${slug}`,
    };
  }
  return {
    shop: "/products/",
    about: "/about",
    contact: "/contact",
    faq: "/faq",
    journal: "/blog/",
    cart: "/cart",
    privacy: "/privacy-policy",
    shipping: "/shipping",
    article: (slug) => `/blog/${slug}`,
    articleAbs: (slug) => `${LIVE}/blog/${slug}`,
  };
}

function navItems() {
  const r = routes();
  return [
    { href: r.shop, label: "Shop" },
    { href: "/products/moringa-powder/", label: "Moringa" },
    { href: "/products/black-tea/", label: "Tea" },
    { href: "/products/curry-leaves/", label: "Curry Leaves" },
    { href: r.about, label: "About" },
    { href: r.journal, label: "Blog" },
  ];
}

// Search Console, 1–28 Aug 2026. Keep ranking URLs stable and lead with pages
// Google is already rewarding instead of the former alphabetical feed.
const JOURNAL_PRIORITY = [
  "moringa-patches-australia-review-do-they-work",
  "how-long-does-moringa-powder-last-storage-shelf-life-2026",
  "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025",
  "is-moringa-safe-for-children-kids-dosage-2026",
  "moringa-and-berberine-australia-what-science-says-2026",
  "grow-moringa-tree-australia",
  "rosabella-moringa-reviews-legit-or-overhyped-2026",
  "science-shade-drying-vs-sun-drying-moringa",
  "moringa-vs-coffee-melbourne-energy-hack",
  "how-to-add-moringa-to-diet",
  "moringa-smoothie-recipes-australia-2026",
  "high-protein-moringa-recipes-australia-2026",
  "best-time-to-take-moringa-powder-morning-or-night-2026",
  "how-to-make-moringa-tea-recipes-2026",
  "moringa-brands-comparison-australia-2026",
  "moringa-vs-spirulina-vs-matcha-comparison-australia",
  "how-to-choose-moringa-powder-australia-2026",
  "moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026",
  "dried-curry-leaves-australia-guide",
  "fresh-vs-dried-curry-leaves-cooking-comparison-2026",
  "cold-brew-darjeeling-australian-spring-2026",
  "darjeeling-tea-vs-english-breakfast-comparison-2026",
  "how-to-brew-darjeeling-tea-perfectly-2026",
  "moringa-soap-benefits-skin-guide",
  "moringa-soap-vs-regular-soap-comparison-2026",
  "how-to-read-a-soap-ingredient-label",
];

const JOURNAL_REDIRECTS = {
  "is-moringa-safe-during-pregnancy-2026": "moringa-pregnancy-safe-australia-trimester-guide-2026",
  "moringa-smoothie-recipes-australia-easy-2026": "moringa-smoothie-recipes-australia-2026",
  "vitamin-d-deficiency-australia-sunny-country-paradox-2026": "vitamin-d-deficiency-australia-abs-sunny-country-2026",
  "iron-deficiency-australian-women-abs-real-numbers-2026": "iron-deficiency-australian-women-symptoms-plant-based-sources-2026",
  "moringa-soap-benefits-for-skin-2026": "moringa-soap-benefits-skin-guide",
};

const CURATED_RELATED = {
  "moringa-patches-australia-review-do-they-work": [
    "moringa-and-berberine-australia-what-science-says-2026",
    "moringa-brands-comparison-australia-2026",
    "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025",
  ],
  "how-long-does-moringa-powder-last-storage-shelf-life-2026": [
    "how-to-choose-moringa-powder-australia-2026",
    "how-to-read-moringa-batch-codes-freshness",
    "what-does-moringa-powder-taste-like-honest-guide-2026",
  ],
  "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025": [
    "chemist-warehouse-greens-vs-moringa-powder-2026",
    "moringa-capsules-vs-powder-which-is-better-2026",
    "how-to-choose-moringa-powder-australia-2026",
  ],
  "is-moringa-safe-for-children-kids-dosage-2026": [
    "moringa-side-effects-what-happens-take-too-much-2026",
    "moringa-energy-bites-kids-lunchbox-recipe-australia-2026",
    "how-to-add-moringa-to-diet",
  ],
  "moringa-and-berberine-australia-what-science-says-2026": [
    "moringa-patches-australia-review-do-they-work",
    "moringa-and-blood-sugar-diabetes-research-2026",
    "moringa-side-effects-what-happens-take-too-much-2026",
  ],
  "grow-moringa-tree-australia": [
    "science-shade-drying-vs-sun-drying-moringa",
    "how-to-read-moringa-batch-codes-freshness",
    "how-to-choose-moringa-powder-australia-2026",
  ],
  "cold-brew-darjeeling-australian-spring-2026": [
    "how-to-brew-darjeeling-tea-perfectly-2026",
    "darjeeling-chai-latte-recipe-winter-coffee-alternative-2026",
    "how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026",
  ],
};

function journalTopic(article) {
  const value = `${article.slug} ${article.title} ${article.category}`.toLowerCase();
  if (/curry|karipatta|tadka|dahl|diwali/.test(value)) return "Curry leaves";
  if (/darjeeling|black-tea|chai/.test(value) || (/caffeine/.test(value) && !/moringa/.test(value))) return "Darjeeling tea";
  if (/soap|face-mask|moringa-oil/.test(value)) return "Soap & skin";
  if (/recipe|smoothie|meal|diet|breakfast|protein/.test(value)) return "Ways to use it";
  return "Moringa guides";
}

const JOURNAL_TOPICS = [
  { name: "Moringa guides", slug: "moringa-guides" },
  { name: "Ways to use it", slug: "ways-to-use-it" },
  { name: "Curry leaves", slug: "curry-leaves" },
  { name: "Darjeeling tea", slug: "tea" },
  { name: "Soap & skin", slug: "soap-skin" },
];
const JOURNAL_PREVIEW_LIMIT = 6;

function topicHref(slug) {
  return LIVE_MODE ? `/blog/category/${slug}/` : `/journal/category/${slug}/`;
}

function topicAnchor(name) {
  return name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
}

function journalProduct(article) {
  if (article.slug === "fathers-day-gift-under-40") return PRODUCTS.find((p) => p.id === "gift-pack");
  const topic = journalTopic(article);
  if (topic === "Curry leaves") return PRODUCTS.find((p) => p.id === "curry-leaves");
  if (topic === "Darjeeling tea") return PRODUCTS.find((p) => p.id === "black-tea");
  if (topic === "Soap & skin") return PRODUCTS.find((p) => p.id === "moringa-soap");
  return PRODUCTS.find((p) => p.id === "moringa-powder");
}

function journalCta(article, product) {
  if (article.slug === "fathers-day-gift-under-40") return "Shop Gift Pack, $35";
  const topic = journalTopic(article);
  if (topic === "Curry leaves") return "Get curry leaves";
  if (topic === "Darjeeling tea") return "Try Darjeeling tea";
  if (topic === "Soap & skin") return "See handmade soap";
  if (/recipe|smoothie|diet|how-to-add/.test(article.slug)) return "Get moringa for this guide";
  if (/comparison|brands|chemist|rosabella|patches/.test(article.slug)) return "Compare our moringa";
  return "Shop moringa powder";
}

const PRODUCT_GUIDES = {
  "moringa-powder": [
    ["How to choose moringa powder", "how-to-choose-moringa-powder-australia-2026"],
    ["How to take moringa powder", "how-to-add-moringa-to-diet"],
    ["What moringa powder tastes like", "what-does-moringa-powder-taste-like-honest-guide-2026"],
    ["How to store moringa powder", "how-long-does-moringa-powder-last-storage-shelf-life-2026"],
  ],
  "curry-leaves": [
    ["Dried curry leaves buying and use guide", "dried-curry-leaves-australia-guide"],
    ["Fresh versus dried curry leaves", "fresh-vs-dried-curry-leaves-cooking-comparison-2026"],
    ["30-minute curry leaf dal recipe", "curry-leaves-dahl-recipe-30-minutes-australia-2026"],
  ],
  "black-tea": [
    ["How to brew Darjeeling tea", "how-to-brew-darjeeling-tea-perfectly-2026"],
    ["Darjeeling versus English Breakfast", "darjeeling-tea-vs-english-breakfast-comparison-2026"],
    ["Can you drink Darjeeling tea every day?", "can-you-drink-darjeeling-tea-every-day-2026"],
  ],
  "moringa-soap": [
    ["Moringa soap benefits and limitations", "moringa-soap-benefits-skin-guide"],
    ["Moringa soap versus regular soap", "moringa-soap-vs-regular-soap-comparison-2026"],
    ["How to read a soap ingredient label", "how-to-read-a-soap-ingredient-label"],
  ],
};

function productGuideLinks(slug) {
  const r = routes();
  const guides = PRODUCT_GUIDES[slug] || PRODUCT_GUIDES["moringa-powder"];
  return guides.map(([label, articleSlug]) => `<li><a href="${r.article(articleSlug)}">${esc(label)}</a></li>`).join("");
}

function faqDetails(faqs) {
  return faqs
    .map(([q, a]) => {
      const body = a && typeof a === "object" && a.html ? a.html : esc(a);
      return `<details><summary>${esc(q)}</summary><p>${body}</p></details>`;
    })
    .join("");
}

const MORINGA_FEATURED_REVIEW_NAMES = [
  "Jay Turakhia",
  "buket",
  "reetysha ramjee",
  "Siv Mey",
  "chizaram olanma",
  "Jay Rohit Sharma",
  "Priyankari Nath",
];

function moringaEducationHtml() {
  const r = routes();
  const taste = r.article("what-does-moringa-powder-taste-like-honest-guide-2026");
  const use = r.article("how-to-add-moringa-to-diet");
  const choose = r.article("how-to-choose-moringa-powder-australia-2026");
  const store = r.article("how-long-does-moringa-powder-last-storage-shelf-life-2026");
  return `
          <section class="pdp-overview" aria-labelledby="why-nutrithrive-moringa">
            <div class="pdp-section-heading">
              <p class="kicker">Farm to pouch</p>
              <h2 id="why-nutrithrive-moringa">Why choose NutriThrive moringa powder?</h2>
            </div>
            <div class="pdp-why">
              <div>
                <h3>Farm grown</h3>
                <p>Our moringa is grown on our own farm and processed by NutriThrive from leaf to finished powder.</p>
              </div>
              <div>
                <h3>Shade-dried</h3>
                <p>The leaves are shade-dried as part of our production process before being milled into powder.</p>
              </div>
              <div>
                <h3>Australian lab tested</h3>
                <p>Our moringa is tested in Australia. <a href="/documents/nutrithrive-lab-report-summary.pdf">Read the available lab summary (PDF)</a>.</p>
              </div>
              <div>
                <h3>Nothing unnecessary</h3>
                <p>The product contains moringa leaf powder without unnecessary fillers or additives.</p>
              </div>
              <div>
                <h3>Packed in Melbourne</h3>
                <p>Orders are packed in Truganina, Victoria, with Australia-wide delivery.</p>
              </div>
            </div>
          </section>
          <section class="pdp-guide-section" aria-labelledby="moringa-guidance">
            <div class="pdp-section-heading">
              <p class="kicker">Quick answers</p>
              <h2 id="moringa-guidance">Using and choosing moringa powder</h2>
            </div>
            <div class="pdp-guide-grid">
              <details class="pdp-guide">
                <summary><span id="how-to-use-moringa">How to use moringa powder</span><small>Simple everyday ideas</small></summary>
                <div class="pdp-guide-body">
                  <p>Moringa powder has a naturally earthy, leafy flavour. Start with a small amount and adjust it to your taste.</p>
                  <p>Try adding it to:</p>
                  <ul>
                    <li>smoothies</li>
                    <li>juice or water</li>
                    <li>yoghurt</li>
                    <li>soups</li>
                    <li>savoury meals</li>
                  </ul>
                  <p><a href="${use}">See how to add moringa to your diet</a>.</p>
                </div>
              </details>
              <details class="pdp-guide">
                <summary><span id="moringa-taste">What does moringa powder taste like?</span><small>Flavour and pairing</small></summary>
                <div class="pdp-guide-body">
                  <p>Moringa has an earthy, green and slightly bitter flavour. Some people enjoy it simply mixed into drinks, while others prefer combining it with stronger flavours such as fruit, yoghurt or smoothies.</p>
                  <p><a href="${taste}">Read our complete guide to what moringa powder tastes like →</a></p>
                </div>
              </details>
              <details class="pdp-guide">
                <summary><span id="buy-moringa-australia">Where to buy moringa powder in Australia</span><small>Ordering and dispatch</small></summary>
                <div class="pdp-guide-body">
                  <p>NutriThrive moringa powder can be ordered directly online in Australia. Our moringa is grown on our farm, Australian lab tested and packed in Truganina, Victoria.</p>
                  <p>Orders are available for Australia-wide delivery, with same-day weekday dispatch for eligible orders placed before 2pm.</p>
                  <p><a href="#pdp-buy">Choose your size →</a></p>
                </div>
              </details>
              <details class="pdp-guide">
                <summary><span id="choose-moringa">What to look for when choosing moringa powder</span><small>Ingredients and transparency</small></summary>
                <div class="pdp-guide-body">
                  <p>A useful starting point is the ingredient list: look for a single ingredient rather than a blend with fillers. Testing information, drying method, origin and how the seller packs and stores the powder all help you judge freshness and transparency.</p>
                  <p><a href="${choose}">Read our guide to choosing moringa powder in Australia →</a> For storage after opening, see our <a href="${store}">shelf-life guide</a>.</p>
                </div>
              </details>
            </div>
          </section>`;
}

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function humanCopy(s) {
  return String(s)
    .replace(/(\d)\s*[–—]\s*(\d)/g, "$1 to $2")
    .replace(/([^\s<])\s+[—–]\s+/g, "$1, ")
    .replace(/[—–]/g, ", ")
    .replace(/ -- /g, ", ");
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

function stars() {
  return `<span class="stars">${'<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 3.6 14.5 9l6 .6-4.6 4 1.4 5.9L12 16.8 6.7 19.5 8.1 13.6 3.5 9.6l6-.6L12 3.6Z"/></svg>'.repeat(5)} 4.9</span>`;
}

function check() {
  return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12.5 9.5 17 19 7"/></svg>`;
}

function productPayload(p) {
  return esc(
    JSON.stringify({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      href: p.href,
      variant: p.variant,
      weight: p.weight || 0,
    })
  );
}

function shopHref(p) {
  if (["moringa-powder", "moringa-200g", "moringa-400g"].includes(p.id)) {
    return `/products/moringa-powder/?v=${encodeURIComponent(p.id)}`;
  }
  return p.href;
}

function productCard(p, priority = false, opts = {}) {
  const was =
    !opts.hideWas && p.was && p.was > p.price ? ` <s>${money(p.was)}</s>` : "";
  const href = shopHref(p);
  return `<article class="product-card">
    <a class="product-card-media" href="${href}" aria-label="${esc(p.name)} ${esc(p.variant)}">
      <img src="${p.image}" alt="${esc(p.name)} ${esc(p.variant)} product" width="1254" height="1254" ${priority ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}>
    </a>
    <div class="product-card-body">
      <h3><a href="${href}" style="color:inherit;text-decoration:none">${esc(p.name)}</a></h3>
      <p class="benefit">${esc(p.benefit)}</p>
      <p class="price">${money(p.price)}${p.unit ? ` <span style="font-weight:400;color:var(--color-text-secondary);font-size:14px">${esc(p.unit)}</span>` : ""}${was}</p>
      <button class="btn btn-primary" type="button" data-add="${productPayload(p)}" data-label="Add to cart">Add to cart</button>
    </div>
  </article>`;
}

const LIVE = "https://nutrithrive.com.au";
const OG_IMAGE = `${LIVE}/assets/images/og/nutrithrive-share-1200x630.jpg`;

const ORG_SCHEMA = JSON.parse(
  fs.readFileSync(path.join(SITE, "shared/schema/nutrithrive-local-business.json"), "utf8")
);
if (ORG_SCHEMA.aggregateRating) ORG_SCHEMA.aggregateRating.reviewCount = 12;
ORG_SCHEMA.description =
  "NutriThrive is a farmer and manufacturer. We grow moringa and curry leaves on our own farm, source tea from a Darjeeling family farm, handmake moringa soap in Australia, and pack orders in Truganina, Melbourne.";

function absUrl(p) {
  if (!p) return OG_IMAGE;
  if (p.startsWith("http")) return p;
  return `${LIVE}${p.startsWith("/") ? p : `/${p}`}`;
}

function trimAtWord(text, limit) {
  if (text.length <= limit) return text;
  const shortened = text.slice(0, limit + 1).replace(/\s+\S*$/, "").trim();
  return shortened.replace(/[,:;\-–—]+$/, "").trim();
}

function fitSeoTitle(value) {
  let title = humanCopy(stripTags(value))
    .replace(/\s*\|\s*NutriThrive Journal$/i, " | NutriThrive")
    .replace(/\s+/g, " ")
    .trim();
  if (title.length <= 60) return title;

  // Long editorial titles are clearer without a brand suffix in the snippet.
  title = title.replace(/\s*\|\s*NutriThrive(?:, Melbourne)?$/i, "");
  title = title.replace(/\s*\((?:Australia\s*)?202[0-9](?:\s+Guide|\s+Review)?\)$/i, "");
  if (title.length <= 60) return title;

  // Prefer a complete first clause to an abruptly chopped phrase.
  const clause = title.match(/^(.{32,60}?[?:.!])(?:\s|$)/)?.[1];
  const fitted = clause || trimAtWord(title, 60);
  const branded = `${fitted.replace(/[.:]$/, "")} | NutriThrive`;
  return fitted.length < 40 && branded.length <= 60 ? branded : fitted;
}

function fitMetaDescription(value) {
  let description = humanCopy(stripTags(value))
    .replace(/\s+/g, " ")
    .replace(/\.['’]?t\s+(?:know|share|eat|re|s)\b.*$/i, ".")
    .trim();
  if (description.length < 120) {
    const lower = description.toLowerCase();
    const topicSuffix = lower.includes("curry")
      ? " Practical preparation, storage and cooking guidance from NutriThrive."
      : lower.includes("tea") || lower.includes("darjeeling") || lower.includes("caffeine")
        ? " Practical guidance for choosing, brewing and enjoying tea from NutriThrive."
        : lower.includes("soap") || lower.includes("skin")
          ? " Clear guidance on ingredients, everyday use and important limitations."
          : lower.includes("moringa")
            ? " Evidence-aware guidance, practical use and important safety considerations."
            : " Evidence-aware, practical Australian guidance from NutriThrive.";
    const candidates = [
      topicSuffix,
      " Practical Australian guidance from NutriThrive.",
      " Read the practical NutriThrive guide.",
    ];
    const addition = candidates.find((suffix) => description.length + suffix.length <= 160);
    if (addition) description = `${description.replace(/\.$/, "")}.${addition}`;
  }
  if (description.length <= 160) return description;

  const sentence = description.slice(0, 161).match(/^(.{90,160}[.!?])(?:\s|$)/)?.[1];
  if (sentence) return sentence;
  const shortened = trimAtWord(description, 157);
  return `${shortened.replace(/[.!?]+$/, "")}.`;
}

function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${LIVE}/#website`,
    url: `${LIVE}/`,
    name: "NutriThrive",
    inLanguage: "en-AU",
    publisher: { "@id": `${LIVE}/#localbusiness` },
  };
}

function itemListSchema(name, url, items) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

function decodeEntities(value) {
  return String(value || "")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'");
}

function extractSeo(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const html = fs.readFileSync(filePath, "utf8");
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1];
  const descTag = html.match(/<meta[^>]*name=["']description["'][^>]*>/i)?.[0]
    || html.match(/<meta[^>]*content=["'][^"']*["'][^>]*name=["']description["'][^>]*>/i)?.[0]
    || "";
  const description = descTag.match(/content=["']([^"']*)["']/i)?.[1];
  const robotsTag = html.match(/<meta[^>]*name=["']robots["'][^>]*>/i)?.[0] || "";
  const robots = robotsTag.match(/content=["']([^"']*)["']/i)?.[1];
  const canonical = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1]
    || html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)?.[1];
  return {
    title: title ? decodeEntities(title) : null,
    description: description ? decodeEntities(description) : null,
    robots: robots || null,
    canonical: canonical || null,
    h1: extractH1(html),
  };
}

function gitShowHead(relativePath) {
  const specs = relativePath.startsWith("site/")
    ? [`HEAD:${relativePath}`, `HEAD:${relativePath.slice(5)}`]
    : [`HEAD:site/${relativePath}`, `HEAD:${relativePath}`];
  for (const spec of specs) {
    try {
      return execFileSync("git", ["show", spec], {
        cwd: ROOT,
        encoding: "utf8",
        maxBuffer: 20 * 1024 * 1024,
        stdio: ["ignore", "pipe", "ignore"],
      });
    } catch {
      // Try the pre- and post-site/ git paths.
    }
  }
  return "";
}

function extractTrackedSeo(relativePath) {
  if (!LIVE_MODE) return null;
  const html = gitShowHead(relativePath);
  if (!html) return null;
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1];
  const descTag = html.match(/<meta[^>]*name=["']description["'][^>]*>/i)?.[0] || "";
  const description = descTag.match(/content=["']([^"']*)["']/i)?.[1];
  const canonical = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1]
    || html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)?.[1];
  return {
    title: title ? decodeEntities(title) : null,
    description: description ? decodeEntities(description) : null,
    canonical: canonical || null,
    h1: extractH1(html),
  };
}

function extractH1(html) {
  const scope = String(html).match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;
  const inner = scope.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  if (!inner) return null;
  const text = decodeEntities(inner.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
  return text || null;
}

function articleDisplayH1(meta, liveSeo, title) {
  const explicit = [meta?.h1, meta?.displayTitle, meta?.displayH1, liveSeo?.h1]
    .map((value) => decodeEntities(String(value || "").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim())
    .find(Boolean);
  return explicit || title;
}

function applyLivePaths(html) {
  if (!LIVE_MODE) return html;
  const r = routes();
  return html
    .replace(/https:\/\/nutrithrive\.com\.au\/journal\/([a-z0-9-]+)/g, `${LIVE}/blog/$1`)
    .replaceAll(`${LIVE}/journal"`, `${LIVE}/blog"`)
    .replaceAll(`${LIVE}/journal<`, `${LIVE}/blog<`)
    .replace(/href="\/journal\/([a-z0-9-]+)\/?(#[^"]*)?"/g, 'href="/blog/$1$2"')
    .replaceAll('href="/journal/"', 'href="/blog/"')
    .replaceAll('href="/journal"', 'href="/blog/"')
    .replaceAll('action="/journal/"', 'action="/blog/"')
    .replaceAll('action="/journal"', 'action="/blog/"')
    .replaceAll('href="/shop/"', `href="${r.shop}"`)
    .replaceAll('href="/shop"', `href="${r.shop}"`)
    .replaceAll('href="/about/"', `href="${r.about}"`)
    .replaceAll('href="/contact/"', `href="${r.contact}"`)
    .replaceAll('href="/faq/"', `href="${r.faq}"`)
    .replaceAll('href="/privacy/"', `href="${r.privacy}"`)
    .replaceAll('href="/shipping/"', `href="${r.shipping}"`)
    .replaceAll('href="/cart/"', `href="${r.cart}"`)
    .replaceAll(`"${LIVE}/shop"`, `"${LIVE}/products"`)
    .replaceAll(`"${LIVE}/shop/`, `"${LIVE}/products/`);
}

function layout({
  title,
  description,
  canonicalPath = "/",
  current,
  main,
  extraHead = "",
  extraFoot = "",
  ogType = "website",
  ogImage,
  ogImageWidth = 1200,
  ogImageHeight = 630,
  robots,
  preserveTitle = false,
  preserveDescription = false,
}) {
  const r = routes();
  const canonical = `${LIVE}${canonicalPath}`;
  const image = ogImage ? absUrl(ogImage) : OG_IMAGE;
  const seoTitle = preserveTitle ? title : fitSeoTitle(title);
  const seoDescription = preserveDescription ? description : fitMetaDescription(description);
  const robotsContent = robots || (LIVE_MODE ? "index, follow" : "noindex, nofollow");
  const nav = navItems().map((item) => {
    const on = current === item.label;
    return `<li><a href="${item.href}"${on ? ' aria-current="page"' : ""}>${item.label}</a></li>`;
  }).join("");
  const liveAnalytics = LIVE_MODE ? `
  <meta name="google-site-verification" content="Ei4OAxJbWPsT7qaeosUpRUONNj37_r_Xe1xFPI6R_M0">
  <link rel="alternate" hreflang="en-AU" href="${esc(canonical)}">
  <link rel="alternate" hreflang="x-default" href="${esc(canonical)}">` : "";
  const newsletterBlock = LIVE_MODE
    ? `<div class="footer-newsletter-copy"><p class="kicker">Farm notes</p><h2>Occasional updates, no daily drip</h2><p>Guides, dispatch notes and product news from Truganina. Unsubscribe any time.</p></div>
      <form class="newsletter-form newsletter-inline" name="newsletter" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" action="/pages/newsletter/thank-you.html">
        <input type="hidden" name="form-name" value="newsletter">
        <p class="visually-hidden"><label>Don’t fill this in <input name="bot-field"></label></p>
        <label for="footer-newsletter-email">Email address</label>
        <div class="newsletter-inline-row">
          <input id="footer-newsletter-email" name="email" type="email" autocomplete="email" required>
          <button class="btn btn-primary" type="submit">Join</button>
        </div>
        <p class="form-note">We do not sell your personal information. See our <a href="${r.privacy}">privacy policy</a>.</p>
      </form>`
    : `<div class="footer-newsletter-copy"><h2>Take 5% off your first order</h2><p>New customers can join for occasional farm notes, useful guides and product offers.</p></div>
      <form class="newsletter-inline" data-newsletter-form data-source="footer" novalidate>
        <label for="footer-newsletter-email">Email address</label>
        <div class="newsletter-inline-row">
          <input id="footer-newsletter-email" name="email" type="email" autocomplete="email" required>
          <button class="btn btn-primary" type="submit">Get 5% off</button>
        </div>
        <label class="consent-check"><input name="marketingConsent" type="checkbox" required> <span>Yes, email me this code and occasional NutriThrive news and offers. I can unsubscribe at any time.</span></label>
        <p class="form-note">We store your email and consent record to send these messages. We do not sell your personal information. See our <a href="${r.privacy}">privacy policy</a>.</p>
        <p class="form-status" data-newsletter-status role="status"></p>
      </form>`;
  const welcomeOffer = LIVE_MODE ? "" : `
<section class="welcome-offer" data-welcome-offer hidden>
  <button class="modal-backdrop" type="button" data-offer-close aria-label="Close welcome offer"></button>
  <div class="welcome-card" role="dialog" aria-modal="true" aria-labelledby="welcome-title" aria-describedby="welcome-copy">
    <button class="modal-close" type="button" data-offer-close aria-label="Close welcome offer">×</button>
    <p class="eyebrow">A welcome from our farm</p>
    <h2 id="welcome-title">Take 5% off your first order</h2>
    <p id="welcome-copy">New to NutriThrive? Join our occasional emails and we’ll give you the code for 5% off your first order.</p>
    <form data-newsletter-form data-source="welcome-popup" novalidate>
      <label class="field" for="welcome-email">Email address<input id="welcome-email" name="email" type="email" autocomplete="email" required></label>
      <label class="consent-check"><input name="marketingConsent" type="checkbox" required> <span>Yes, email me the code and occasional NutriThrive news and offers. I can unsubscribe at any time.</span></label>
      <p class="form-note">New customers only. We store your email and consent record; we do not sell your personal information. <a href="${r.privacy}">Privacy policy</a>.</p>
      <button class="btn btn-primary btn-block" type="submit">Email me 5% off</button>
      <p class="form-status" data-newsletter-status role="status"></p>
    </form>
    <button class="offer-decline" type="button" data-offer-close>No thanks, continue shopping</button>
  </div>
</section>`;
  const cookieNote = LIVE_MODE
    ? "Analytics and marketing tools run only with your permission."
    : "No optional analytics or marketing scripts are connected in this local preview.";
  const footerNote = LIVE_MODE
    ? `<a href="${r.privacy}">Privacy policy</a> · <button class="footer-text-button" type="button" data-cookie-settings>Cookie settings</button>`
    : `<a href="${r.privacy}">Privacy policy</a> · <button class="footer-text-button" type="button" data-cookie-settings>Cookie settings</button>. This is a design preview, not the live store.`;

  return `<!DOCTYPE html>
<html lang="en-AU"${LIVE_MODE ? ' data-nt-live="1"' : ""}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(seoTitle)}</title>
  <meta name="description" content="${esc(seoDescription)}">
  <meta name="robots" content="${esc(robotsContent)}">
  <link rel="canonical" href="${esc(canonical)}">
  <meta name="geo.region" content="AU-VIC">
  <meta name="geo.placename" content="Truganina, Melbourne VIC">
  <meta name="geo.position" content="-37.8323773;144.7187983">
  <meta name="ICBM" content="-37.8323773, 144.7187983">
  <meta property="og:type" content="${esc(ogType)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:title" content="${esc(seoTitle)}">
  <meta property="og:description" content="${esc(seoDescription)}">
  <meta property="og:image" content="${esc(image)}">
  <meta property="og:image:secure_url" content="${esc(image)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(seoTitle)}">
  <meta property="og:locale" content="en_AU">
  <meta property="og:site_name" content="NutriThrive Australia">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(seoTitle)}">
  <meta name="twitter:description" content="${esc(seoDescription)}">
  <meta name="twitter:image" content="${esc(image)}">
  <meta name="theme-color" content="#263F2C">
  <link rel="icon" href="/assets/images/logo/favicon.ico" sizes="any">
  <link rel="icon" type="image/png" href="/assets/images/logo/favicon-48.png" sizes="48x48">
  <link rel="icon" type="image/png" href="/assets/images/logo/favicon-96.png" sizes="96x96">
  <link rel="apple-touch-icon" href="/assets/images/logo/apple-touch-icon.png">
  <link rel="alternate" type="text/plain" href="${LIVE}/llms.txt" title="llms.txt">
  <link rel="preload" href="/assets/fonts/fraunces-latin-500-600.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/plus-jakarta-sans-400.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${CSS_HREF}">
  <script src="${CATALOG_SRC}?v=${ASSET_VERSION}" defer></script>
  <script type="application/ld+json" id="nutri-thrive-local-business-jsonld">${JSON.stringify(ORG_SCHEMA)}</script>
  ${liveAnalytics}
  ${extraHead}
</head>
<body>
${CONTRACT}
<a class="skip-link" href="#main">Skip to content</a>
<div class="announce"><span class="announce-full">Order before 2pm Monday–Friday for same-day dispatch · Free shipping over $49</span><span class="announce-short">Weekday dispatch before 2pm · Free over $49</span></div>
<header class="site-header">
  <div class="wrap header-bar">
    <a class="logo" href="/">
      <img src="/assets/images/logo/LOGO-120.webp" alt="NutriThrive" width="32" height="32">
      NutriThrive
    </a>
    <nav class="nav-primary" aria-label="Primary">
      <ul>${nav}</ul>
    </nav>
    <div class="header-tools">
      <button class="icon-btn" type="button" data-search aria-expanded="false" aria-controls="search-panel" aria-label="Search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.2-3.2"/></svg>
      </button>
      <a class="icon-btn" href="${r.cart}" aria-label="Cart">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 7h15l-1.4 8.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.6L6 7Z"/><path d="M6 7 5 4H2"/><circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/></svg>
        <span class="cart-count" data-cart-count data-empty="true">0</span>
      </a>
      <button class="icon-btn menu-btn" type="button" data-menu aria-expanded="false" aria-controls="nav-mobile" aria-label="Open menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </div>
  <nav class="nav-mobile wrap" id="nav-mobile" hidden aria-label="Mobile">
    <ul>${nav}
      <li><a href="${r.contact}">Contact</a></li>
      <li><a href="${r.faq}">FAQ</a></li>
    </ul>
  </nav>
</header>
<div class="search-panel" id="search-panel" hidden>
  <div class="search-sheet" role="dialog" aria-modal="true" aria-label="Search the site">
    <label class="field" for="search-input">Search
      <input id="search-input" type="search" placeholder="Moringa, tea, guides…" autocomplete="off">
    </label>
    <div class="search-results" id="search-results"></div>
    <button class="btn btn-secondary" type="button" data-search-close style="margin-top:16px">Close search</button>
  </div>
</div>
<main id="main">${main}</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <a class="logo" href="/" style="margin-bottom:16px">
        <img src="/assets/images/logo/LOGO-120.webp" alt="NutriThrive" width="32" height="32">
        NutriThrive
      </a>
      <p>Farmer and manufacturer. Moringa and curry leaves from our own farm, with Australian testing and packing in Truganina.</p>
      <a class="social-link" href="https://www.instagram.com/nutri__thrive/" target="_blank" rel="noopener noreferrer" aria-label="Follow NutriThrive on Instagram">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
        @nutri__thrive
      </a>
    </div>
    <div>
      <h2>Shop</h2>
      <ul>
        <li><a href="${r.shop}">All products</a></li>
        <li><a href="/products/moringa-powder/">Moringa powder</a></li>
        <li><a href="/products/black-tea/">Darjeeling tea</a></li>
        <li><a href="/products/curry-leaves/">Curry leaves</a></li>
        <li><a href="/products/gift-pack/">Gift pack</a></li>
      </ul>
    </div>
    <div>
      <h2>Help</h2>
      <ul>
        <li><a href="${r.about}">About</a></li>
        <li><a href="${r.journal}">Blog</a></li>
        <li><a href="${r.faq}">FAQ</a></li>
        <li><a href="${r.contact}">Contact</a></li>
        <li><a href="${r.shipping}">Shipping and returns</a></li>
        <li><a href="${r.privacy}">Privacy policy</a></li>
        <li><a href="${LIVE_MODE ? "/pages/newsletter/" : "/unsubscribe/"}">${LIVE_MODE ? "Newsletter" : "Unsubscribe"}</a></li>
      </ul>
    </div>
    <div>
      <h2>Deliver to</h2>
      <ul>
        <li><a href="/melbourne/">Melbourne</a></li>
        <li><a href="/moringa-sydney/">Sydney</a></li>
        <li><a href="/moringa-brisbane/">Brisbane</a></li>
        <li><a href="/moringa-perth/">Perth</a></li>
        <li><a href="/moringa-adelaide/">Adelaide</a></li>
      </ul>
    </div>
    <div class="footer-newsletter">
      ${newsletterBlock}
    </div>
  </div>
  <div class="wrap footer-base">
    <span>ABN 32 639 442 616 · 15 Europe Street, Truganina VIC 3029</span>
    <span>${footerNote}</span>
  </div>
</footer>
${welcomeOffer}
<section class="cookie-banner" data-cookie-banner hidden aria-label="Cookie preferences">
  <div><h2>Cookies</h2><p>Cart storage stays on. Optional analytics need your OK.</p></div>
  <div class="cookie-actions"><button class="btn btn-secondary" type="button" data-cookie-reject>Reject</button><button class="btn btn-secondary" type="button" data-cookie-manage>Manage</button><button class="btn btn-primary" type="button" data-cookie-accept>Accept</button></div>
</section>
<section class="cookie-modal" data-cookie-modal hidden>
  <button class="modal-backdrop" type="button" data-cookie-close aria-label="Close cookie settings"></button>
  <div class="cookie-card" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
    <button class="modal-close" type="button" data-cookie-close aria-label="Close cookie settings">×</button><h2 id="cookie-title">Cookie settings</h2>
    <p>Choose which optional technologies we may use. Your cart and basic preferences need essential browser storage and cannot be switched off.</p>
    <div class="cookie-choice"><span><strong>Necessary</strong><small>Cart, checkout and privacy preferences</small></span><strong>Always on</strong></div>
    <label class="cookie-choice"><span><strong>Analytics</strong><small>Helps us understand visits and improve pages</small></span><input type="checkbox" data-cookie-analytics></label>
    <label class="cookie-choice"><span><strong>Marketing</strong><small>Supports relevant offers and campaign measurement</small></span><input type="checkbox" data-cookie-marketing></label>
    <p class="form-note">${cookieNote}</p>
    <button class="btn btn-primary btn-block" type="button" data-cookie-save>Save my choices</button>
  </div>
</section>
<div id="nt-live" class="visually-hidden" aria-live="polite"></div>
<style>.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}</style>
${LIVE_MODE ? `<script src="/assets/js/storefront/runtime-cart.js?v=${ASSET_VERSION}" defer></script>` : ""}
<script src="${SEARCH_SRC}?v=${ASSET_VERSION}" defer></script>
<script src="${SITE_SRC}?v=${ASSET_VERSION}" defer></script>
${extraFoot}
</body>
</html>`;
}

function writePage(rel, html, destRoot = OUT) {
  html = applyLivePaths(html);
  const file = path.join(destRoot, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const cacheBusted = html.replace(/(src|href)="(\/assets\/[^"?#]+)(?:\?[^"#]*)?"/g, `$1="$2?v=${ASSET_VERSION}"`);
  fs.writeFileSync(file, cacheBusted);
}

function homepage() {
  const featured = PRODUCTS;
  const liveSeo = LIVE_MODE ? extractSeo(path.join(SITE, "index.html")) : null;
  return layout({
    title: liveSeo?.title || "NutriThrive: Lab-tested moringa from Melbourne",
    description:
      liveSeo?.description ||
      "Shade-dried moringa leaf powder, tested in Australia and packed in Truganina. From $11/100g. Same-day Melbourne dispatch.",
    canonicalPath: "/",
    current: "",
    preserveTitle: Boolean(liveSeo?.title),
    preserveDescription: Boolean(liveSeo?.description),
    robots: liveSeo?.robots || undefined,
    extraHead: `<link rel="preload" as="image" href="/assets/images/product_webp/moringa-powder-100g-main.webp" fetchpriority="high">
  ${jsonLd(websiteSchema())}`,
    main: `
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <p class="kicker">Our farm · Made by NutriThrive</p>
      <h1>Pure moringa. Nothing unnecessary.</h1>
      <p class="lede">Farm-grown, shade-dried and manufactured by us, with Australian testing information published when available. Packed in Truganina.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="/products/moringa-powder/">Shop moringa</a>
        <a class="btn btn-secondary" href="/products/gift-pack/">Shop Gift Pack $35</a>
        <a class="btn btn-secondary" href="/documents/nutrithrive-lab-report-summary.pdf">See our lab report</a>
      </div>
      ${stars()} <span style="font-size:14px;color:var(--color-text-secondary)">from Google reviews</span>
    </div>
    <div class="hero-photo">
      <img src="/assets/images/product_webp/moringa-powder-100g-main.webp" alt="NutriThrive 100g moringa powder pouch with moringa leaves and a bowl of powder" width="1254" height="1254" fetchpriority="high">
    </div>
  </div>
</section>
<div class="wrap">
  <div class="trust-row">
    <div class="trust-item">${check()}<div><strong>Australian testing</strong><span>Published information when available.</span></div></div>
    <div class="trust-item">${check()}<div><strong>Manufacturer-direct</strong><span>We grow it and make it.</span></div></div>
    <div class="trust-item">${check()}<div><strong>Single-ingredient</strong><span>Leaf powder. No fillers.</span></div></div>
    <div class="trust-item">${check()}<div><strong>Tracked shipping</strong><span>Australia-wide. Free over $49.</span></div></div>
  </div>
</div>
<section class="section">
  <div class="wrap">
    <div class="section-head">
      <div>
        <h2>Everyday products, fairly priced</h2>
      </div>
      <a href="/shop/">Shop all</a>
    </div>
    <div class="product-grid product-scroll" aria-label="Complete product range">${featured.map((product, index) => productCard(product, index === 0, { hideWas: true })).join("")}</div>
    <p class="purchase-note shipping-path" style="margin-top:16px">Free AU shipping from $49. Fastest cart: 400g moringa $35 + curry $7 + Darjeeling $7.50 = $49.50. Gift pack $35 needs the same add-on.</p>
  </div>
</section>
<section class="section band proof-story">
  <div class="wrap">
    <div class="proof-story-head">
      <div>
        <p class="kicker">Farmer and manufacturer</p>
        <h2>We know where it comes from.<br>Because we grow it.</h2>
      </div>
      <p>Our moringa and curry leaves are grown on our own farm. We oversee the process from harvest to manufacturing, then pack locally in Truganina. Fewer middlemen helps us keep everyday products fairly priced.</p>
    </div>
    <ol class="origin-steps" aria-label="From our farm to your order">
      <li><span>01</span><strong>Grown by us</strong><p>Our own farm, harvested by our team.</p></li>
      <li><span>02</span><strong>Made by us</strong><p>Harvested, shade-dried and manufactured by NutriThrive.</p></li>
      <li><span>03</span><strong>Checked in Australia</strong><p>Testing information is published when available.</p></li>
      <li><span>04</span><strong>Packed in Melbourne</strong><p>Prepared in Truganina and tracked Australia-wide.</p></li>
    </ol>
    <div class="proof-story-actions">
      <a class="btn btn-secondary" href="/about/">Our story</a>
      <a href="/documents/nutrithrive-lab-report-summary.pdf">Read the available lab summary</a>
    </div>
  </div>
</section>
<section class="section" id="reviews">
  <div class="wrap">
    <div class="reviews-head">
      <span class="reviews-score">4.9</span>
      ${stars()}
      <span style="color:var(--color-text-secondary)">Google reviews</span>
    </div>
    <div class="review-grid review-scroll" aria-label="Google reviews">
      ${REVIEWS.map(
        (r) => `<blockquote class="review-card"><p title="${esc(r.text)}">“${esc(r.text)}”</p><div class="review-meta"><strong>${esc(r.name)}</strong>Verified Google review</div></blockquote>`
      ).join("")}
    </div>
    <p class="review-disclosure">These are genuine reviews from our Google Business Profile. They describe individual customer experiences, not guaranteed outcomes or NutriThrive health claims. NutriThrive is not certified organic.</p>
    <p style="margin-top:16px"><a href="https://maps.app.goo.gl/9VQVEUQSeGm4XfGB7">See all reviews</a></p>
  </div>
</section>
<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="section-head">
      <div>
        <h2>Blog</h2>
        <p>Evidence, guides and practical information about moringa, tea and everyday nutrition.</p>
      </div>
      <a href="${routes().journal}">All articles</a>
    </div>
    <div class="journal-grid">
      <a class="article-card featured" href="${routes().article("what-does-moringa-powder-taste-like-honest-guide-2026")}">
        <div class="article-card-media"><img src="/assets/images/blog/hero-moringa-800.webp" alt="Moringa powder in a bowl" width="800" height="450" loading="lazy"></div>
        <div class="cat">Guides</div>
        <h3>What does moringa powder taste like?</h3>
        <p>Earthy and slightly bitter in water. Mixed into food, most people barely notice it.</p>
      </a>
      <a class="article-card" href="${routes().article("how-to-choose-moringa-powder-australia-2026")}">
        <div class="article-card-media"><img src="/assets/images/blog/moringa-honest-truth-science-australia-2026-hero.webp" alt="How to choose moringa powder in Australia" width="800" height="450" loading="lazy"></div>
        <div class="cat">Buyer’s guide</div>
        <h3>How to choose moringa powder in Australia</h3>
        <p>Colour, drying method, and whether a lab report is published.</p>
      </a>
      <a class="article-card" href="${routes().article("how-to-add-moringa-to-diet")}">
        <div class="article-card-media"><img src="/assets/images/blog/moringa-hero-1.webp" alt="How to add moringa to your diet" width="800" height="450" loading="lazy"></div>
        <div class="cat">How to</div>
        <h3>How to add moringa to your diet</h3>
        <p>One teaspoon, mixed into food. Not a glass of green water.</p>
      </a>
    </div>
  </div>
</section>
<section class="cta-band">
  <div class="wrap">
    <h2>Start with the 100g pouch</h2>
    <p>Lab-tested, shade-dried, packed in Truganina. $11.</p>
    <a class="btn btn-primary" href="/products/moringa-powder/">Shop moringa</a>
  </div>
</section>`,
  });
}

function shopPage() {
  const liveSeo = LIVE_MODE ? extractSeo(path.join(SITE, "products/index.html")) : null;
  const shopPath = LIVE_MODE ? "/products/" : "/shop";
  return layout({
    title: liveSeo?.title || "Shop Moringa, Tea & Curry Leaves | NutriThrive",
    description: liveSeo?.description || "Shop farm-grown moringa powder, dried curry leaves, Darjeeling tea, natural soap and affordable gift packs, packed in Truganina, Melbourne.",
    canonicalPath: shopPath,
    current: "Shop",
    preserveTitle: Boolean(liveSeo?.title),
    preserveDescription: Boolean(liveSeo?.description),
    extraHead:
      jsonLd(
        breadcrumbSchema([
          { name: "Home", item: `${LIVE}/` },
          { name: "Shop", item: `${LIVE}${shopPath}` },
        ])
      ) +
      jsonLd(
        itemListSchema(
          "NutriThrive shop",
          `${LIVE}${shopPath}`,
          PRODUCTS.map((p) => ({ name: `${p.name} ${p.variant}`, url: `${LIVE}${p.href}` }))
        )
      ),
    main: `
      <section class="page-intro wrap">
        <h1>Shop</h1>
        <p>Everything we pack in Truganina. Same card structure, same price placement, same add-to-cart language.</p>
      </section>
      <section class="section" style="padding-top:0">
        <div class="wrap product-grid">${PRODUCTS.map((product, index) => productCard(product, index === 0, { hideWas: true })).join("")}</div>
        <div class="wrap"><p class="purchase-note shipping-path" style="margin-top:16px">Free AU shipping from $49. Fastest cart: 400g $35 + curry $7 + tea $7.50 = $49.50.</p></div>
      </section>`,
  });
}

const PDP = {
  "moringa-powder": {
    title: "Moringa Powder Australia | From $11 | NutriThrive",
    description:
      "Shop NutriThrive moringa powder from $11/100g. Grown on our farm, shade-dried, Australian lab tested and packed in Melbourne. Australia-wide delivery.",
    forceSeo: true,
    current: "Moringa",
    product: PRODUCTS[0],
    variants: PRODUCTS.filter((p) =>
      ["moringa-powder", "moringa-200g", "moringa-400g", "combo-pack"].includes(p.id)
    ),
    variantLabels: {
      "moringa-powder": "100g — $11 · Good for trying NutriThrive",
      "moringa-200g": "200g — $21.50",
      "moringa-400g": "400g — $35 · BEST VALUE · $8.75 per 100g",
      "combo-pack": "Combo pack — $17 · Moringa + curry leaves",
    },
    variantHint: "The 400g option saves $9 compared with four 100g packs.",
    intro:
      "Pure moringa leaf powder grown on our farm, shade-dried as part of our production process, Australian lab tested and packed in Melbourne.",
    freezeHeroCopy: true,
    proofs: [
      "100% moringa leaf — no fillers",
      { html: `<a href="/documents/nutrithrive-lab-report-summary.pdf">Australian lab tested</a>` },
      "Grown on our farm",
      "Packed in Melbourne",
      "Same-day weekday dispatch before 2pm",
    ],
    reviews: REVIEWS.filter((review) => MORINGA_FEATURED_REVIEW_NAMES.includes(review.name)),
    gallery: [
      ["/assets/images/product_webp/moringa-powder-100g-main.webp", "NutriThrive 100g moringa powder pouch with a bowl of green powder"],
      ["/assets/images/photos/compressed/moringa-powder-200g-main-square.webp", "NutriThrive 200g moringa powder pouch with a bowl of green powder"],
      ["/assets/images/photos/compressed/moringa-powder-200g-editorial-desktop.webp", "NutriThrive 200g moringa powder pouch in warm botanical light"],
      ["/assets/images/photos/compressed/moringa-powder-200g-lifestyle-desktop.webp", "NutriThrive 200g moringa powder pouch with a wooden bowl and measuring spoon"],
      ["/assets/images/photos/compressed/moringa-powder-detail-light.webp", "Finely milled moringa leaf powder in a ceramic bowl and wooden spoon"],
      ["/assets/images/product_webp/moringa-powder-400g-bundle-main.webp", "Four NutriThrive 100g moringa powder pouches in the 400g bundle"],
      ["/assets/images/product_webp/moringa-powder-texture.webp", "Finely milled green moringa leaf powder in a ceramic bowl"],
    ],
    detailImage: "/assets/images/photos/compressed/moringa-powder-detail-light.webp",
    detailAlt: "Finely milled green moringa leaf powder in a ceramic bowl with a wooden spoon",
    detailCaption: "A closer look at the fine texture and natural green colour of the powder.",
    ingredients: "100% moringa (Moringa oleifera) leaf powder. No fillers or blends.",
    origin: "Grown on our own farm. Packed in Truganina, Melbourne.",
    process: "We grow, harvest, shade-dry and mill the leaves, arrange testing in Australia, then pack in small runs in Truganina.",
    storage: "Store sealed in a dry environment away from humidity. Use within 18 months after opening.",
    safety: "Start with a small amount. If you are pregnant, breastfeeding, taking prescription medication or managing a health condition, ask your healthcare professional before regular use.",
    what: "Bright green powder with a mild, spinach-like smell when you open it. We shade-dry the leaves and publish a lab summary for heavy metals and pesticides.",
    use: "Add 1 teaspoon (about 3 to 5 grams) to smoothies, juice, or water. Works in soups and salads. Straight in water, most people dislike the flavour. Mixed into food, most people barely notice it.",
    faqs: [
      [
        "Where can I buy moringa powder in Australia?",
        "NutriThrive moringa powder can be ordered directly through our Australian online store. It is grown on our farm, Australian lab tested and packed in Truganina, Victoria, with delivery available across Australia.",
      ],
      [
        "What is in NutriThrive moringa powder?",
        "NutriThrive Moringa Powder contains 100% moringa leaf powder with no unnecessary fillers or additives.",
      ],
      [
        "What does moringa powder taste like?",
        "Moringa powder has an earthy, leafy and slightly bitter flavour. Many people mix it into smoothies, yoghurt, juice or meals to combine it with other flavours.",
      ],
      [
        "How should I store moringa powder?",
        "Store sealed in a dry environment away from humidity. Use within 18 months after opening.",
      ],
      ["Where is NutriThrive moringa powder packed?", "NutriThrive moringa powder is packed in Truganina, Victoria."],
      [
        "Is NutriThrive moringa powder tested in Australia?",
        {
          html: `Yes. NutriThrive provides Australian testing information for its moringa. <a href="/documents/nutrithrive-lab-report-summary.pdf">Read the available lab summary (PDF)</a>.`,
        },
      ],
    ],
  },
  "curry-leaves": {
    title: "Farm-Grown Dried Curry Leaves | NutriThrive",
    description: "Buy aromatic dried curry leaves for tadka, curries and everyday cooking. Carefully prepared and packed in Truganina, Melbourne, from $7.",
    current: "Curry Leaves",
    product: PRODUCTS.find((p) => p.id === "curry-leaves"),
    intro: "Karipatta grown on our own farm. Aromatic, pantry-ready and packed in Melbourne. Use about 2 to 3 times as much as fresh in tadka.",
    gallery: [
      ["/assets/images/product_webp/dried-curry-leaves-30g-main.webp", "NutriThrive 30g dried curry leaves pouch with whole leaves"],
      ["/assets/images/product_webp/dried-curry-leaves-texture.webp", "Whole dried curry leaves in a ceramic bowl"],
    ],
    detailImage: "/assets/images/product_webp/dried-curry-leaves-texture.webp",
    detailAlt: "Whole dried curry leaves in a ceramic bowl",
    detailCaption: "Whole dried leaves with their naturally curled, pantry-ready texture.",
    ingredients: "100% dried curry leaves (karipatta). Nothing added.",
    origin: "Grown on our own farm. Packed in Truganina, Melbourne.",
    process: "We grow and harvest the leaves on our farm, dry them carefully, then pack them in Truganina.",
    storage: "Keep sealed in a dry environment away from humidity. Use within 18 months after opening.",
    safety: "For culinary use. Check the leaves before use and stop using the product if its aroma, colour or condition changes unexpectedly.",
    what: "Hot oil or ghee at the start of the pan. That is when the smell kicks in. Works in dals, sambar, and most South Indian dishes.",
    use: "Use about 2 to 3 times the amount of dried leaves compared to fresh. Keep sealed in a cool, dry place.",
    faqs: [
      ["How do I use dried vs fresh?", "Use about 2 to 3 times the amount of dried leaves compared to fresh."],
      ["How long do they keep?", "6 months or more in an airtight container in a cool, dry place."],
    ],
  },
  "black-tea": {
    title: "Darjeeling Family-Farm Black Tea | NutriThrive",
    description: "Shop loose-leaf Darjeeling black tea with a floral, muscatel character. Packed in Truganina and shipped across Australia from $7.50.",
    current: "Tea",
    product: PRODUCTS.find((p) => p.id === "black-tea"),
    intro: "Loose-leaf tea sourced from a family farm in Darjeeling, with muscatel and floral notes when brewed gently. Packed in Truganina and shipped Australia-wide.",
    gallery: [
      ["/assets/images/product_webp/darjeeling-black-tea-100g-main.webp", "NutriThrive 100g Darjeeling black tea pouch with brewed tea"],
      ["/assets/images/product_webp/darjeeling-black-tea-brewed.webp", "Amber Darjeeling black tea with loose leaves in a wooden spoon"],
    ],
    detailImage: "/assets/images/product_webp/darjeeling-black-tea-brewed.webp",
    detailAlt: "Amber Darjeeling black tea with loose tea leaves in a wooden spoon",
    detailCaption: "Loose Darjeeling leaves and the warm amber colour of a gently brewed cup.",
    ingredients: "100% loose-leaf Darjeeling black tea.",
    origin: "Sourced from a family farm in Darjeeling, India. Packed in Truganina, Melbourne.",
    process: "Produced by a Darjeeling family farm, selected by NutriThrive and packed in small runs in Truganina.",
    storage: "Keep sealed in a dry environment away from humidity and strong aromas. Use within 18 months after opening.",
    safety: "Contains caffeine. Consider your total daily caffeine intake and seek professional advice if you are pregnant, breastfeeding or sensitive to caffeine.",
    what: "Do not use boiling water. 85 to 90°C, 1 to 2 teaspoons, 3 to 5 minutes. Boiling water makes it bitter. Milk is optional.",
    use: "About 40 to 50 mg caffeine per cup. A moderate, steady lift.",
    faqs: [
      ["How do I brew it?", "85 to 90°C water, 3 to 5 minute steep. Avoid boiling water to prevent bitterness."],
      ["How much caffeine?", "About 40 to 50 mg per cup."],
    ],
  },
  "moringa-soap": {
    title: "Handmade Natural Moringa Soap 95g | NutriThrive",
    description: "Shop a naturally made 95g moringa soap bar for gentle everyday cleansing. Manufacturer-direct value, packed in Truganina, Melbourne, from $7.",
    current: "Shop",
    product: PRODUCTS.find((p) => p.id === "moringa-soap"),
    intro: "A 95g moringa soap bar handmade by us in Australia. Straightforward, small-batch production with moringa leaf in the mix.",
    gallery: [
      ["/assets/images/product_webp/moringa-soap-95g-main.webp", "NutriThrive handmade 95g moringa soap with lavender flowers"],
      ["/assets/images/product_webp/moringa-soap-texture.webp", "Handmade moringa soap on a stone dish with lavender and foam"],
    ],
    detailImage: "/assets/images/product_webp/moringa-soap-texture.webp",
    detailAlt: "Handmade moringa soap bar with lavender flowers and soft foam on a stone dish",
    detailCaption: "A closer look at the handmade bar, lavender flowers and lather.",
    ingredients: "Soap base, moringa, lavender fragrance and lavender flowers.",
    origin: "Handmade by NutriThrive in Australia and packed in Truganina, Melbourne.",
    process: "We combine the soap base with moringa, lavender fragrance and lavender flowers, then handmake the bars in small batches in Australia.",
    storage: "Keep in a dry, well-drained area away from humidity between uses. Continue using until the bar is finished.",
    safety: "For external use only. Avoid contact with eyes. Patch-test before use if you have sensitive skin and stop use if irritation occurs.",
    what: "Leaf powder plus oils. No long ingredient list. Let the bar dry between uses and it lasts well.",
    use: "Patch-test if you have very sensitive skin.",
    faqs: [
      ["What size is the bar?", "95g. Compact enough for travel, lasts well with proper drainage."],
      ["Is it suitable for sensitive skin?", "Made with gentle, natural ingredients; patch-test if you have very sensitive skin."],
    ],
  },
  "combo-pack": {
    title: "Moringa + Curry Leaves Combo | NutriThrive",
    description: "100g moringa powder plus 30g dried curry leaves for $17. Packed in Truganina. AU postage still applies under $49.",
    current: "Shop",
    product: PRODUCTS.find((p) => p.id === "combo-pack"),
    intro: "100g moringa powder and 30g dried curry leaves. Morning smoothie and evening tadka from one box.",
    gallery: [
      ["/assets/images/product_webp/moringa-curry-leaves-combo-main.webp", "NutriThrive 100g moringa powder and 30g dried curry leaves combo"],
    ],
    ingredients: "100% moringa leaf powder and 100% dried curry leaves. Nothing added.",
    origin: "Both products are grown on our own farm and packed in Truganina.",
    process: "We grow and process both products, arrange Australian testing for the moringa, and pack the combination in Truganina.",
    storage: "Keep both packs sealed in a dry environment away from humidity. Use within 18 months after opening.",
    safety: "Follow the individual product directions. Seek professional advice before regular moringa use if you are pregnant, breastfeeding, taking medication or managing a health condition.",
    what: "Moringa for whatever you blend or stir in; curry leaves for dals and curries. Both packed in Truganina.",
    use: "Each item is also available separately.",
    faqs: [
      ["What is in the combo?", "100g moringa powder and 30g premium dried curry leaves (karipatta)."],
      ["Can I buy them separately?", "Yes. Each item is also available individually in our shop."],
    ],
  },
  "gift-pack": {
    title: "Natural Wellness Gift Pack | NutriThrive",
    description: "Give moringa powder, Darjeeling tea, dried curry leaves and natural soap in one practical wellness gift pack, prepared in Truganina for $35.",
    current: "Shop",
    product: PRODUCTS.find((p) => p.id === "gift-pack"),
    intro:
      "100g moringa powder, 100g Darjeeling black tea, 30g dried curry leaves, and 95g moringa lavender soap. Ready to gift.",
    gallery: [
      ["/assets/images/product_webp/nutrithrive-four-product-gift-pack-main.webp", "NutriThrive gift pack with moringa powder, curry leaves, Darjeeling tea and moringa soap"],
    ],
    ingredients: "Includes moringa leaf powder, Darjeeling black tea, dried curry leaves, and soap made with soap base, moringa, lavender fragrance and lavender flowers.",
    origin: "Farm-grown moringa and curry leaves, family-farm tea from Darjeeling, and moringa soap handmade by us in Australia.",
    process: "We bring together our farm-grown, family-farm and Australian handmade products, then prepare the gift pack in Truganina.",
    storage: "Keep every product in a dry environment away from humidity. Food products should be used within 18 months after opening; keep the soap dry between uses.",
    safety: "Follow the directions and safety information for each included product. Soap is for external use only and the tea contains caffeine.",
    what: "Powder, tea, curry leaves, and soap in one box. Packed in Truganina for birthdays, host gifts, and wellness baskets.",
    use: "Each product is also available individually.",
    faqs: [
      [
        "What is included?",
        "100g moringa powder, 100g Darjeeling black tea, 30g dried curry leaves, and one 95g moringa lavender soap.",
      ],
    ],
  },
};

function pdpPage(slug, d) {
  const p = d.product;
  const purchaseNotes = {
    "gift-pack":
      "Taxes included. This pack is $35, so Australian postage still applies. Add dried curry leaves ($7) and Darjeeling tea ($7.50) to reach $49.50 and get free AU shipping. Or add the $17 moringa + curry combo (cart $52). A single $11 powder bag only gets to $46 — still not free shipping.",
    "moringa-powder":
      "Taxes included. 100g ($11), 200g ($21.50) and 400g ($35) are all under $49, so AU postage still applies. Add dried curry leaves ($7) and Darjeeling tea ($7.50) to reach $49.50 free AU shipping.",
    "combo-pack":
      "Taxes included. Shipping calculated at checkout. This combo is $17, so Australian postage still applies. Fastest free-ship cart: add the 400g moringa bundle ($35) to reach $52.",
    "curry-leaves":
      "Taxes included. Shipping calculated at checkout. This pack is $7, so AU postage still applies. Add 400g moringa ($35) and Darjeeling tea ($7.50) to reach $49.50 free AU shipping.",
    "black-tea":
      "Taxes included. Shipping calculated at checkout. This pack is $7.50, so AU postage still applies. Add 400g moringa ($35) and dried curry leaves ($7) to reach $49.50 free AU shipping.",
    "moringa-soap":
      "Taxes included. Shipping calculated at checkout. This bar is $7, so AU postage still applies. Add 400g moringa ($35) and Darjeeling tea ($7.50) to reach $49.50 free AU shipping.",
  };
  const purchaseNote = purchaseNotes[slug] || "Taxes included. Shipping calculated at checkout.";
  const shippingPath = Boolean(purchaseNotes[slug]);
  const liveSeo = LIVE_MODE && !d.forceSeo ? extractSeo(path.join(SITE, "products", slug, "index.html")) : null;
  const gallery = d.gallery?.length ? d.gallery : [[p.image, `${p.name} ${p.variant}`]];
  const related = PRODUCTS.filter(
    (item) => item.id !== p.id && item.href !== p.href
  ).slice(0, 3);
  const reviews = d.reviews || REVIEWS;
  const freezeHero = Boolean(d.freezeHeroCopy);
  const variantSelect = d.variants
    ? `<label class="field" for="variant">Size
        <select class="variant-select" id="variant">${d.variants
          .map((v) => {
            const label = d.variantLabels?.[v.id] || `${v.name} ${v.variant}, ${money(v.price)}`;
            return `<option value="${v.id}" ${v.id === p.id ? "selected" : ""}>${esc(label)}</option>`;
          })
          .join("")}</select>
      </label>`
    : "";
  const variantHint = d.variantHint
    ? `<p class="pdp-variant-hint">${esc(d.variantHint)}</p>`
    : "";
  const proofItems = d.proofs || [
    "Australian lab tested",
    "Packed in Melbourne",
    "Australia-wide delivery",
  ];
  const proofs = proofItems
    .map((t) => `<li>${check()} ${typeof t === "object" && t.html ? t.html : esc(t)}</li>`)
    .join("");
  const valueCompare =
    slug === "moringa-powder"
      ? `<section class="pdp-value" aria-labelledby="moringa-value">
            <h2 id="moringa-value">More moringa, lower cost</h2>
            <div class="pdp-value-rows">
              <div class="pdp-value-row">
                <p class="pdp-value-size">100g</p>
                <p class="pdp-value-price">$11</p>
                <p class="pdp-value-unit">$11.00 per 100g</p>
              </div>
              <div class="pdp-value-row is-best">
                <p class="pdp-value-size">400g</p>
                <p class="pdp-value-price">$35 <span class="pdp-value-flag">BEST VALUE</span></p>
                <p class="pdp-value-unit">$8.75 per 100g</p>
              </div>
            </div>
            <p class="pdp-value-note">The 400g option saves $9 compared with buying four 100g packs.</p>
          </section>`
      : "";
  const education =
    slug === "moringa-powder"
      ? moringaEducationHtml()
      : `<h2>What it is</h2><p>${esc(d.what)}</p>
          <h2>How to use</h2><p>${esc(d.use)}</p>
          ${p.lab ? `<h2>Testing</h2><p>Our moringa is tested in Australia. <a href="/documents/nutrithrive-lab-report-summary.pdf">Read the available lab summary (PDF)</a> or contact us for current testing details.</p>` : ""}`;
  const offerUrl = `${LIVE}/products/${slug}${slug === "moringa-powder" ? "/" : ""}`;
  const faqHeading = slug === "moringa-powder" ? "Moringa powder FAQs" : "Frequently asked questions";
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: d.description,
    image: gallery.map(([src]) => absUrl(src)),
    brand: { "@type": "Brand", name: "NutriThrive" },
  };
  if (slug === "moringa-powder") {
    productSchema.offers = PRODUCTS.filter((item) =>
      ["moringa-powder", "moringa-200g", "moringa-400g"].includes(item.id)
    ).map((item) => ({
      "@type": "Offer",
      name: item.variant,
      sku: item.sku,
      url: offerUrl,
      priceCurrency: "AUD",
      price: String(item.price),
      availability: "https://schema.org/InStock",
      seller: { "@id": `${LIVE}/#localbusiness` },
    }));
  } else {
    productSchema.sku = p.sku;
    productSchema.offers = {
      "@type": "Offer",
      url: offerUrl,
      priceCurrency: "AUD",
      price: String(p.price),
      availability: "https://schema.org/InStock",
      seller: { "@id": `${LIVE}/#localbusiness` },
    };
  }
  return layout({
    title: d.forceSeo ? d.title : liveSeo?.title || d.title,
    description: d.forceSeo ? d.description : liveSeo?.description || d.description,
    canonicalPath: `/products/${slug}/`,
    current: d.current,
    preserveTitle: d.forceSeo ? true : Boolean(liveSeo?.title),
    preserveDescription: d.forceSeo ? true : Boolean(liveSeo?.description),
    ogType: "product",
    ogImage: p.image,
    ogImageWidth: 900,
    ogImageHeight: 900,
    extraHead: `<link rel="preload" as="image" href="${gallery[0][0]}" fetchpriority="high">` +
      jsonLd(productSchema) +
      jsonLd(
        breadcrumbSchema([
          { name: "Home", item: `${LIVE}/` },
          { name: "Shop", item: `${LIVE}${LIVE_MODE ? "/products/" : "/shop"}` },
          { name: p.name, item: `${LIVE}/products/${slug}/` },
        ])
      ),
    main: `
      <nav class="wrap crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> / <a href="/shop/">Shop</a> / <span data-pdp-crumb>${esc(p.name)}</span>
      </nav>
      <section class="wrap pdp">
        <div class="pdp-gallery-wrap">
          <div class="pdp-gallery">
            <img src="${gallery[0][0]}" alt="${esc(gallery[0][1])}" width="900" height="900" fetchpriority="high" data-pdp-image>
          </div>
        </div>
        <div class="pdp-buy" id="pdp-buy">
          <p class="pdp-eyebrow">NutriThrive · farm to pouch</p>
          <h1${freezeHero ? "" : " data-pdp-title"}>${esc(p.name)}</h1>
          <p class="stock-status"><span aria-hidden="true"></span> In stock · ready to dispatch</p>
          <p class="pdp-price" data-pdp-price>${money(p.price)}${p.was && p.was > p.price ? ` <s>${money(p.was)}</s>` : ""}</p>
          <p class="cost-note" data-pdp-cost>${esc(costNote(p))}</p>
          <p class="pdp-intro"${freezeHero ? "" : " data-pdp-intro"}>${esc(d.intro)}</p>
          ${variantSelect}
          ${variantHint}
          <div class="purchase-panel">
            <div class="qty">
              <label for="qty">Quantity</label>
              <div class="qty-ctrl">
                <button type="button" data-qty-minus aria-label="Decrease quantity">−</button>
                <input id="qty" data-qty value="1" inputmode="numeric" aria-label="Quantity">
                <button type="button" data-qty-plus aria-label="Increase quantity">+</button>
              </div>
            </div>
            <div class="pdp-actions">
              <button class="btn btn-primary btn-block" type="button" data-add="${productPayload(p)}" data-label="Add to cart">Add to cart</button>
              <button class="btn btn-secondary btn-block" type="button" data-buy-now="${productPayload(p)}">Buy now</button>
            </div>
            <p class="purchase-note${shippingPath ? " shipping-path" : ""}">${esc(purchaseNote)}</p>
          </div>
          <ul class="pdp-proof">${proofs}</ul>
          <p class="pdp-service-note">Same-day dispatch before 2pm, Monday to Friday. Seven-day returns on unopened products.</p>
          <p class="pdp-payment-note">Visa · Mastercard · PayPal · Bank transfer · Cash for local pickup</p>
        </div>
      </section>
      <section class="prose-block">
        <div class="wrap pdp-content">
          ${valueCompare}
          ${education}
          <div class="product-facts">
            <section><h2>Ingredients</h2><p>${esc(d.ingredients)}</p></section>
            <section><h2>Origin</h2><p>${esc(d.origin)}</p></section>
            <section><h2>How we make it</h2><p>${esc(d.process)}</p></section>
            <section><h2>Storage and shelf life</h2><p>${esc(d.storage)}</p></section>
          </div>
          ${(slug === "moringa-powder" || d.detailImage) ? `<div class="pdp-media-story${slug === "moringa-powder" ? " has-editorial" : ""}">
            ${slug === "moringa-powder" ? `<picture class="pdp-editorial-photo">
              <source media="(max-width: 700px)" srcset="/assets/images/photos/compressed/moringa-powder-200g-editorial-mobile.webp" width="1122" height="1402">
              <img src="/assets/images/photos/compressed/moringa-powder-200g-editorial-desktop.webp" alt="NutriThrive 200g moringa powder pouch with a bowl of powder in warm botanical light" width="1536" height="1024" loading="lazy">
            </picture>` : ""}
            ${d.detailImage ? `<figure class="pdp-detail-photo">
              <img src="${d.detailImage}" alt="${esc(d.detailAlt)}" width="1254" height="1254" loading="lazy">
              <figcaption>${esc(d.detailCaption)}</figcaption>
            </figure>` : ""}
          </div>` : ""}
          <div class="pdp-support-grid">
            <details class="pdp-support-card safety-note"><summary>Safety information</summary><div><p>${esc(d.safety)}</p></div></details>
            <details class="pdp-support-card delivery-card"><summary>Delivery and returns</summary><div>
              <ul>
                <li><strong>Melbourne metro:</strong> usually 1–3 business days</li>
                <li><strong>Other Australian metro areas:</strong> usually 3–4 business days</li>
                <li><strong>Rural areas:</strong> allow up to 10 business days</li>
                <li>Occasional carrier delays may add up to 2 business days</li>
                <li>Seven-day returns on unopened products</li>
                <li>Local pickup available from Truganina by arrangement</li>
              </ul>
            </div></details>
          </div>
          <section class="pdp-faq">
            <h2>${esc(faqHeading)}</h2>
            <div class="faq-list">
              ${faqDetails(d.faqs)}
            </div>
          </section>
          <section class="pdp-reviews">
            <div class="reviews-head"><h2>What customers say</h2>${stars()} <span>from 12 Google reviews</span></div>
            <div class="review-grid review-scroll" aria-label="Google reviews">${reviews.map((review) => `<blockquote class="review-card"><p title="${esc(review.text)}">“${esc(review.text)}”</p><div class="review-meta"><strong>${esc(review.name)}</strong>Verified Google review</div></blockquote>`).join("")}</div>
            <p class="review-disclosure">These are genuine reviews from our Google Business Profile. They describe individual customer experiences, not guaranteed outcomes or NutriThrive health claims. NutriThrive is not certified organic.</p>
            <p><a href="https://maps.app.goo.gl/9VQVEUQSeGm4XfGB7">See all Google reviews</a></p>
          </section>
          <section class="product-guides" aria-labelledby="product-guides-${esc(slug)}">
            <div>
              <p class="kicker">Make an informed choice</p>
              <h2 id="product-guides-${esc(slug)}">Helpful ${esc(p.name.toLowerCase())} guides</h2>
              <p>Practical answers from NutriThrive about choosing, using and caring for this product.</p>
            </div>
            <ul>${productGuideLinks(slug)}</ul>
          </section>
          <section class="related-products">
            <div class="section-head"><div><h2>You may also like</h2><p>More products from the NutriThrive range.</p></div><a href="/shop/">Shop all</a></div>
            <div class="product-grid">${related.map(productCard).join("")}</div>
          </section>
        </div>
      </section>`,
  });
}

function aboutPage() {
  const liveSeo = LIVE_MODE ? extractSeo(path.join(SITE, "pages/about/about.html")) : null;
  return layout({
    title: liveSeo?.title || "Our Farm and Purpose | About NutriThrive",
    description:
      liveSeo?.description ||
      "NutriThrive grows and manufactures farm-sourced wellness products, with a mission to make quality health foods affordable and accessible.",
    canonicalPath: "/about",
    current: "About",
    preserveTitle: Boolean(liveSeo?.title),
    preserveDescription: Boolean(liveSeo?.description),
    extraHead:
      jsonLd(
        breadcrumbSchema([
          { name: "Home", item: `${LIVE}/` },
          { name: "About", item: `${LIVE}/about` },
        ])
      ) +
      jsonLd({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About NutriThrive",
        url: `${LIVE}/about`,
        isPartOf: { "@id": `${LIVE}/#website` },
      }),
    main: `
      <section class="page-intro wrap">
        <h1>From our farm to your family.</h1>
        <p class="lede">NutriThrive is a farmer and manufacturer, not a reseller. Our moringa and curry leaves begin on our own farm in Gujarat and are made with care from harvest through to the finished pack. We source tea from a Darjeeling family farm and handmake our moringa soap in Australia. From Truganina, we serve customers with clear information, dependable quality and honest prices.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="/products/moringa-powder/">Shop moringa powder</a>
          <a class="btn btn-secondary" href="/documents/nutrithrive-lab-report-summary.pdf">View lab summary</a>
        </div>
        <p style="font-size:14px;color:var(--color-text-secondary)">Farm grown · Manufacturer direct · Australian testing information · Packed in Truganina</p>
      </section>
      <section class="section band">
        <div class="wrap split-2">
          <div>
            <h2>Why we started NutriThrive</h2>
            <p>We believe nutritious food and thoughtfully made wellness products should be available to everyone, not treated as expensive luxuries. Our goal is simple: make quality products people can use every day and price them fairly enough to become part of everyday life.</p>
            <ul>
              <li>Farm-to-customer production with fewer unnecessary markups</li>
              <li>Simple products made without unnecessary fillers</li>
              <li>Clear sizes, ingredients and prices</li>
              <li>Quality that is practical for families and everyday routines</li>
            </ul>
          </div>
          <div>
            <h2>We grow it. We make it.</h2>
            <p>Our moringa and curry leaves begin on our own farm in Gujarat, India. We oversee growing, harvesting, shade-drying and manufacturing, then arrange Australian testing and pack in small runs in Truganina.</p>
            <ol>
              <li>Grown and harvested on our farm</li>
              <li>Carefully selected and shade-dried</li>
              <li>Manufactured without unnecessary dilution</li>
              <li>Australian testing information published when available; packed in Truganina</li>
            </ol>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="wrap split-2">
          <div>
            <h2>Quality should not be out of reach</h2>
            <p>NutriThrive moringa starts at $11 per 100g. Selling manufacturer-direct helps us keep the price fair while continuing to invest in careful production, appropriate Australian testing and responsible packing.</p>
            <p>We would rather earn long-term trust and become part of your routine than make health products feel exclusive.</p>
          </div>
          <div>
            <h2>Testing and transparency</h2>
            <p>Our moringa powder is tested in Australia and we publish the available readable summary. It includes nutrition information and screening results, so you can better understand what you are buying.</p>
            <h2>Visit or contact us</h2>
            <p>15 Europe Street, Truganina VIC 3029. Call before you arrive: <a href="tel:+61438201419">+61 438 201 419</a>.</p>
            <p>Daily 9:00 AM to 11:00 PM AEST.</p>
          </div>
        </div>
      </section>`,
  });
}

function contactPage() {
  return layout({
    title: "Contact NutriThrive in Truganina, Melbourne",
    description: "Contact NutriThrive by email or phone, or arrange a visit to our Truganina location. Ask us about products, batches, orders or local pickup.",
    canonicalPath: "/contact",
    current: "",
    extraHead:
      jsonLd(
        breadcrumbSchema([
          { name: "Home", item: `${LIVE}/` },
          { name: "Contact", item: `${LIVE}/contact` },
        ])
      ) +
      jsonLd({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact NutriThrive",
        url: `${LIVE}/contact`,
      }),
    main: `
      <section class="page-intro wrap">
        <h1>Contact</h1>
        <p class="lede">A real address, a phone number, and an inbox we read.</p>
      </section>
      <section class="section" style="padding-top:0">
        <div class="wrap split-2">
          <form class="form" name="contact" action="/pages/contact/thank-you.html" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
            <input type="hidden" name="form-name" value="contact">
            <p class="visually-hidden"><label>Don’t fill this in <input name="bot-field"></label></p>
            <div class="field">
              <label for="name">Name</label>
              <input id="name" name="name" autocomplete="name" required>
            </div>
            <div class="field">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" autocomplete="email" required>
            </div>
            <div class="field">
              <label for="message">Message</label>
              <textarea id="message" name="message" required></textarea>
              <span class="hint">We use these details only to answer your message. We usually reply within 1–2 business days.</span>
            </div>
            <button class="btn btn-primary" type="submit">Send message</button>
          </form>
          <div>
            <h2>Direct</h2>
            <p><a href="mailto:nutrithrive0@gmail.com">nutrithrive0@gmail.com</a><br>
            <a href="tel:+61438201419">+61 438 201 419</a></p>
            <p>15 Europe Street<br>Truganina VIC 3029<br>Melbourne, Australia</p>
            <p>Daily 9:00 AM to 11:00 PM AEST. Call before visiting.</p>
          </div>
        </div>
      </section>`,
  });
}

function faqPage() {
  const groups = [
    {
      title: "Moringa powder",
      items: [
        {
          q: "What is NutriThrive Moringa powder?",
          a: "It is 100% Moringa oleifera leaf powder from our own farm, with no fillers. We grow, harvest, shade-dry and manufacture it, arrange testing in Australia, and pack it in Truganina.",
        },
        {
          q: "How much should I take daily?",
          a: "Start with half a teaspoon a day for a week. Most adults then use 1 teaspoon (about 2 to 3 grams) once or twice a day if it sits well. Take it with food.",
        },
        {
          q: "Any safety notes?",
          a: "Leaf powder is widely eaten as food. Skip it if you are on blood thinners unless your GP agrees. If you are pregnant, breastfeeding, or on prescription medication, ask your healthcare provider first. Neer is not a doctor.",
        },
        {
          q: "What does it taste like?",
          a: "Earthy and a bit like spinach. In plain water most people dislike it. Mixed into food, most people barely notice it.",
        },
        {
          q: "Is it lab tested?",
          a: "Yes. Our moringa is tested in Australia. You can read the available summary PDF on the product page or contact us for testing details.",
        },
      ],
    },
    {
      title: "Dried curry leaves",
      items: [
        {
          q: "What are NutriThrive dried curry leaves?",
          a: "Karipatta grown on our own farm and packed in Melbourne. Use it in tadka for curries, dals and South Indian cooking.",
        },
        {
          q: "How do I use dried curry leaves?",
          a: "Use about 2 to 3 times the amount you would use fresh. Fry them in hot oil or ghee at the start of the pan. That is when the smell comes through.",
        },
        {
          q: "How should I store them?",
          a: "Airtight container, away from heat and light. They keep their flavour for 6 months or more in a cool, dry place.",
        },
      ],
    },
    {
      title: "Darjeeling tea",
      items: [
        {
          q: "What is NutriThrive Darjeeling black tea?",
          a: "Loose-leaf tea sourced from a family farm in Darjeeling, with a floral, muscatel character. We pack it in Melbourne and send it Australia-wide.",
        },
        {
          q: "How do I brew it?",
          a: "Use 1 to 2 teaspoons per cup. Water at 85 to 90°C, not a rolling boil. Steep 3 to 5 minutes. Plain, or with a splash of milk and honey.",
        },
        {
          q: "How much caffeine is in a cup?",
          a: "About 40 to 50 mg, similar to most black teas.",
        },
      ],
    },
    {
      title: "Shipping and returns",
      items: [
        {
          q: "What is the free shipping threshold?",
          a: "Free standard shipping on Australian orders of $49 and over, and worldwide on orders of $90 and over. If you think your order should qualify, call +61 438 201 419 and we can process it for you.",
        },
        {
          q: "How fast is shipping from Melbourne?",
          a: "Order before 2pm Monday to Friday and we usually dispatch the same day. Melbourne metro is often 1 to 3 business days after that. Other metro areas are around 3 to 4 days, while some rural addresses take up to 10 days.",
        },
        {
          q: "Do you offer returns?",
          a: "Yes. 7 days from delivery, unopened packs only. Original shipping is not refunded. Read the full policy on the shipping and returns page.",
        },
        {
          q: "Which payment methods do you accept?",
          a: "On the live site: Visa, Mastercard, PayPal, bank transfer, and cash for Truganina pickup. This local preview does not take payment.",
        },
        {
          q: "Can I place an order by phone?",
          a: "Yes. Call +61 438 201 419 if you need help placing an order or checking free shipping.",
        },
      ],
    },
    {
      title: "The business",
      items: [
        {
          q: "Who runs NutriThrive?",
          a: "Neer. The warehouse is at 15 Europe Street, Truganina VIC 3029, Melbourne. Started in 2020, selling to customers from 2024.",
        },
        {
          q: "What is the ABN?",
          a: "32 639 442 616.",
        },
        {
          q: "Can I visit?",
          a: "Call first on +61 438 201 419. Hours are daily 9:00 AM to 11:00 PM AEST. Email nutrithrive0@gmail.com.",
        },
      ],
    },
    {
      title: "Privacy",
      items: [
        {
          q: "Where is the privacy policy?",
          a: "On the privacy policy page. Last updated 19 January 2026 on the live site. We use your contact and order details to fulfil orders and answer questions.",
        },
        {
          q: "How do I ask about my data?",
          a: "Email nutrithrive0@gmail.com. That is the same inbox we use for orders.",
        },
      ],
    },
  ];

  const flat = groups.flatMap((g) => g.items);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: flat.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  const crumbs = breadcrumbSchema([
    { name: "Home", item: `${LIVE}/` },
    { name: "Frequently Asked Questions", item: `${LIVE}/faq` },
  ]);

  return layout({
    title: "Moringa Questions and Answers | NutriThrive Australia",
    description:
      "Straight answers on moringa, curry leaves, tea, shipping, returns, privacy and the Truganina business. From Neer in Melbourne.",
    canonicalPath: "/faq",
    extraHead: `${jsonLd(faqSchema)}
  ${jsonLd(crumbs)}`,
    current: "",
    main: `
      <nav class="wrap-narrow crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> / <span>FAQ</span>
      </nav>
      <section class="page-intro wrap-narrow">
        <h1>Questions we get asked</h1>
        <p class="lede">Straight answers on the powder, curry leaves, tea, shipping, returns, privacy, and who we are. I'm Neer. If yours is not here, email or call.</p>
      </section>
      <section class="section" style="padding-top:0">
        <div class="wrap-narrow">
          ${groups
            .map(
              (g) =>
                `<div class="faq-group"><h2>${esc(g.title)}</h2><div class="faq-list">${g.items
                  .map((item) => `<details><summary>${esc(item.q)}</summary><p>${esc(item.a)}</p></details>`)
                  .join("")}</div></div>`
            )
            .join("")}
          <div class="faq-business">
            <h2>Business details</h2>
            <p>NutriThrive · ABN 32 639 442 616</p>
            <p>15 Europe Street, Truganina VIC 3029, Melbourne</p>
            <p>Daily 9:00 AM to 11:00 PM AEST · <a href="tel:+61438201419">+61 438 201 419</a></p>
            <p><a href="mailto:nutrithrive0@gmail.com">nutrithrive0@gmail.com</a></p>
          </div>
          <div class="faq-stuck">
            <h2>Still stuck?</h2>
            <p>Call <a href="tel:+61438201419">0438 201 419</a> or use the contact form. I usually reply within 1 to 2 business days.</p>
          </div>
          <div class="faq-links">
            <a class="btn btn-primary" href="/shipping/">Shipping and returns</a>
            <a class="btn btn-secondary" href="/privacy/">Privacy policy</a>
            <a class="btn btn-secondary" href="/contact/">Contact</a>
          </div>
        </div>
      </section>`,
  });
}

function shippingPage() {
  return layout({
    title: "Shipping, Delivery and Returns | NutriThrive",
    description: "See NutriThrive delivery prices, dispatch times, tracking, free Australian shipping over $49 and our seven-day returns information.",
    canonicalPath: "/shipping",
    extraHead: jsonLd(
      breadcrumbSchema([
        { name: "Home", item: `${LIVE}/` },
        { name: "Shipping and returns", item: `${LIVE}/shipping` },
      ])
    ),
    current: "",
    main: `
      <nav class="wrap-narrow crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> / <span>Shipping and returns</span>
      </nav>
      <section class="page-intro wrap-narrow">
        <h1>Shipping and returns</h1>
        <p class="lede">Orders leave Truganina. Free standard shipping on Australian orders of $49 and over, and worldwide on $90 and over.</p>
        <h2>Dispatch</h2>
        <p>Order before 2pm Monday to Friday for same-day Melbourne dispatch. If you think your order should receive free shipping, call +61 438 201 419 and we can process it for you.</p>
        <h2>Timing after dispatch</h2>
        <p>Melbourne metro is often 1 to 3 business days. Other metro areas typically 3 to 4 days. Some rural locations take up to 10 days.</p>
        <h2>Tracking</h2>
        <p>When the parcel leaves the warehouse you should get a confirmation email with tracking, if the carrier provides it. If nothing arrives within a couple of business days after dispatch, check spam or email us with your order details.</p>
        <h2>Returns</h2>
        <p>7 days from delivery, unopened packs only. Original shipping costs are not refunded. If something arrives damaged, contact us within 7 days with photos of the packaging and the item.</p>
        <h2>Payments</h2>
        <p>Visa, Mastercard, PayPal, bank transfer, and cash for Truganina pickup.</p>
        <p><a href="/privacy/">Privacy policy</a> · <a href="/faq/">FAQ</a> · <a href="/contact/">Contact</a></p>
      </section>`,
  });
}

function privacyPage() {
  return layout({
    title: "Privacy Policy and Website Terms | NutriThrive",
    description:
      "NutriThrive privacy policy. How we use your data, cookies, orders, and refunds for our Melbourne-based superfoods store with Australia-wide delivery.",
    canonicalPath: "/privacy",
    extraHead: jsonLd(
      breadcrumbSchema([
        { name: "Home", item: `${LIVE}/` },
        { name: "Privacy policy", item: `${LIVE}/privacy` },
      ])
    ),
    current: "",
    main: `
      <nav class="wrap-narrow crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> / <span>Privacy policy</span>
      </nav>
      <article class="page-intro wrap-narrow policy-doc">
        <h1>Privacy Policy, Terms and Conditions</h1>
        <p class="updated">Last updated 31 August 2026</p>

        <h2>Privacy Policy</h2>
        <h3>1. Introduction</h3>
        <p>NutriThrive ("we," "us," or "our") is committed to protecting your personal information in accordance with the Privacy Act 1988 (Cth). This policy outlines how we handle your data.</p>
        <p><strong>Legal entity:</strong> NutriThrive</p>
        <p><strong>ABN:</strong> 32 639 442 616</p>
        <p><strong>Address:</strong> 15 Europe Street, Truganina VIC 3029, Australia</p>
        <p><strong>Contact:</strong> <a href="mailto:nutrithrive0@gmail.com">nutrithrive0@gmail.com</a> | <a href="tel:+61438201419">0438 201 419</a></p>

        <h3>2. Information we collect</h3>
        <p>We collect information reasonably necessary for our business functions:</p>
        <ul>
          <li><strong>Identity and contact:</strong> Name, email, mobile number, and shipping address.</li>
          <li><strong>Technical data:</strong> Cookies (for cart functionality), IP address, and browser type.</li>
          <li><strong>Marketing preferences:</strong> Your email address, consent choice, signup source, and the date and time you subscribed.</li>
          <li><strong>Payment data:</strong> We do not store credit card details. All payments are processed via PayPal. We only receive transaction confirmation.</li>
        </ul>

        <h3>3. How we use your information</h3>
        <ul>
          <li><strong>Order fulfilment:</strong> Delivering products via Australia Post or Sendle.</li>
          <li><strong>Marketing:</strong> Sending newsletters and offers via email or SMS (only with your consent).</li>
          <li><strong>Improvement:</strong> Analyzing website usage to improve our service.</li>
        </ul>

        <h3>4. Cookies and similar storage</h3>
        <p>Necessary browser storage remembers your cart and privacy choices. Optional analytics or marketing technologies are used only according to the choices you make in Cookie settings. You can change those choices at any time from the footer. Rejecting optional technologies does not prevent you from shopping.</p>

        <h3>5. Sharing your data</h3>
        <p>We do not sell your data. We share necessary data with:</p>
        <ul>
          <li><strong>Shipping partners:</strong> Sendle, Australia Post, and international couriers for delivery.</li>
          <li><strong>Payment gateways:</strong> PayPal.</li>
          <li><strong>Email service providers:</strong> Only to manage subscriptions, deliver messages, record consent, and process unsubscribes.</li>
        </ul>

        <h3>6. Marketing choices and unsubscribe</h3>
        <p>We send marketing only where we have the required consent. Marketing emails identify NutriThrive, include our contact details, and provide a clear unsubscribe option. You do not need to log in or create an account to unsubscribe. We action unsubscribe requests within five working days.</p>
        <p>You can withdraw marketing consent using the unsubscribe link in an email or by contacting us at <a href="mailto:nutrithrive0@gmail.com">nutrithrive0@gmail.com</a>.</p>

        <h3>7. Storage, security and retention</h3>
        <p>We keep personal information only for as long as reasonably required for orders, customer support, consent records, legal obligations, and dispute resolution. We use access controls and reputable service providers to protect it. No online system can be guaranteed completely secure.</p>

        <h3>8. Access, correction and deletion</h3>
        <p>You may ask to access or correct personal information we hold about you, withdraw marketing consent, or request deletion where we are not required to retain the information. Contact us using the details above and we may need to verify your identity.</p>

        <h3>9. International transfers</h3>
        <p>As we ship worldwide, your name and address will be transferred to logistics providers in your destination country to facilitate delivery.</p>

        <h3>10. Age restriction</h3>
        <p>You must be 18 years or older to purchase from this website. We do not knowingly collect data from minors.</p>

        <h2>Refund and Shipping Policy</h2>
        <h3>1. Returns policy (7 days)</h3>
        <p>We accept returns for "change of mind" strictly under the following conditions:</p>
        <ul>
          <li><strong>Timeframe:</strong> You must initiate the return within 7 days of delivery.</li>
          <li><strong>Condition:</strong> The item must be unopened, sealed, and in its original packaging.</li>
          <li><strong>Procedure:</strong> Contact <a href="mailto:nutrithrive0@gmail.com">nutrithrive0@gmail.com</a> to start the process.</li>
          <li><strong>Cost:</strong> The customer is responsible for all return shipping costs.</li>
          <li><strong>Refund processing:</strong> Once received and inspected, refunds are processed via PayPal within 5 to 7 business days.</li>
        </ul>
        <p>Nothing in this policy excludes, restricts, or modifies any rights you have under the Australian Consumer Law that cannot be excluded.</p>

        <h3>2. Shipping and location liability</h3>
        <p><strong>Customer responsibility:</strong> It is your sole responsibility to select the correct country and enter the correct address at checkout.</p>
        <p><strong>Wrong location selection:</strong> If you select the wrong country (for example, selecting "Australia" for a US address) to bypass shipping costs or by error, NutriThrive is not responsible for the order. We reserve the right to cancel the order or refuse delivery. We are not liable for lost goods due to incorrect address details provided by the customer.</p>

        <h2>Terms of Service and Disclaimer</h2>
        <h3>1. Product nature (natural vs organic)</h3>
        <p><strong>Natural product:</strong> NutriThrive products are sold as "Natural" products derived from natural ingredients.</p>
        <p><strong>Not certified organic:</strong> We explicitly state that our products are NOT "Certified Organic". We do not hold organic certification.</p>
        <p><strong>Waiver of claims:</strong> NutriThrive makes no representations or warranties that its products are "Organic." By purchasing, you acknowledge the product is sold strictly as "Natural" and agree to release NutriThrive from any liability, claims, or disputes asserting otherwise.</p>

        <h3>2. Limitation of liability</h3>
        <p>To the extent permitted by Australian law, NutriThrive is not liable for any indirect, incidental, or consequential damages arising from the use of our products.</p>

        <h3>3. Governing law</h3>
        <p>These terms are governed by the laws of Victoria, Australia.</p>

        <h2>Questions or concerns</h2>
        <p>If you have any questions about our Privacy Policy, Terms of Service, or Refund Policy, please contact us.</p>
        <p><strong>Email:</strong> <a href="mailto:nutrithrive0@gmail.com">nutrithrive0@gmail.com</a></p>
        <p><strong>Phone:</strong> <a href="tel:+61438201419">0438 201 419</a></p>
        <p><a href="/shipping/">Shipping and returns</a> · <a href="/faq/">FAQ</a> · <a href="/contact/">Contact</a></p>
      </article>`,
  });
}

function cartPage() {
  return layout({
    title: "Review Your NutriThrive Shopping Cart | NutriThrive",
    description: LIVE_MODE
      ? "Review products, quantities and your NutriThrive order subtotal before continuing to secure PayPal checkout."
      : "Review products, quantities, delivery estimates and your NutriThrive order subtotal before continuing to the local preview checkout.",
    canonicalPath: "/cart",
    current: "",
    extraFoot: `${LIVE_MODE ? `<script src="/assets/js/storefront/runtime-shipping-rates.js?v=${ASSET_VERSION}" defer></script>` : ""}<script src="${CART_PAGE_SRC}?v=${ASSET_VERSION}" defer></script>
<script defer>document.addEventListener("DOMContentLoaded",function(){if(window.NT&&typeof window.NT.renderCart==="function")window.NT.renderCart();});</script>`,
    robots: "noindex, nofollow",
    main: `
      <section class="page-intro wrap cart-intro">
        <div>
          <p class="eyebrow">Your order</p>
          <h1>Shopping cart</h1>
        </div>
        <a class="cart-continue" href="/shop/">Continue shopping <span aria-hidden="true">→</span></a>
      </section>
      <section class="wrap cart-layout" id="cart-layout">
        <div class="cart-main">
          <div id="cart-lines"><div class="empty-state" data-cart-placeholder><h2>Your cart is empty</h2><p>Moringa, tea, curry leaves and soap, all packed in Truganina.</p><a class="btn btn-primary" href="/shop/">Shop the range</a></div></div>
        </div>
        <aside class="summary" id="cart-summary" hidden></aside>
        <div id="cart-recs"></div>
      </section>`,
  });
}

function paymentPage() {
  const r = routes();
  const paypalScripts = LIVE_MODE
    ? `<script src="/assets/js/storefront/runtime-paypal-client-config.js?v=${ASSET_VERSION}" defer></script>
<script src="/assets/js/storefront/runtime-paypal-sdk-loader.js?v=${ASSET_VERSION}" defer></script>
`
    : "";
  return layout({
    title: "Payment | NutriThrive Australia",
    description: "Review your NutriThrive order, confirm shipping country, and complete checkout securely with PayPal or card.",
    canonicalPath: "/payment",
    current: "",
    preserveTitle: true,
    extraFoot: `${paypalScripts}${LIVE_MODE ? `<script src="/assets/js/storefront/runtime-shipping-rates.js?v=${ASSET_VERSION}" defer></script>` : ""}<script src="${PAYMENT_PAGE_SRC}?v=${ASSET_VERSION}" defer></script>`,
    robots: "noindex, follow",
    main: `
      <section class="page-intro wrap cart-intro">
        <h1>Payment</h1>
        <p><a href="${r.cart}">Back to cart</a></p>
      </section>
      <section class="wrap cart-layout" id="pay-layout">
        <div>
          <div class="empty-state" id="pay-empty" hidden>
            <h2>Your cart is empty</h2>
            <p>Add something from the shop, then return here to pay with PayPal.</p>
            <a class="btn btn-primary" href="${r.shop}">Continue shopping</a>
          </div>
          <div id="pay-form" class="pay-form">
            <p class="pay-copy">All transactions are secure and encrypted.</p>
            <p class="pay-copy">At checkout, PayPal will show the exact <strong>name, email and full shipping address</strong> stored in your wallet. Review those details carefully. We ship to the address you approve there.</p>
            <div class="field">
              <label for="shipping-country">Shipping country</label>
              <select id="shipping-country">
                <option value="AU" selected>Australia</option>
              </select>
            </div>
            <div class="pay-box">
              <h2>Choose your payment method</h2>
              <div id="paypal-button-container">
                <p class="payment-placeholder">Select a shipping country to continue.</p>
              </div>
              <div id="paypal-card-container"></div>
              <p class="pay-powered">Powered by PayPal</p>
              <p class="pay-status" id="pay-status" role="status"></p>
            </div>
          </div>
        </div>
        <aside class="summary" id="pay-summary">
          <h2>Order summary</h2>
          <div id="order-items"></div>
          <div class="summary-row"><span>Subtotal</span><span id="subtotal">$0.00</span></div>
          <div class="summary-row"><span>Shipping</span><span id="shipping">Select country</span></div>
          <div class="summary-row total"><span>Total</span><span id="total">$0.00</span></div>
        </aside>
      </section>`,
  });
}

function newsletterPage() {
  const r = routes();
  const liveForm = `<form class="form newsletter-page-form" name="newsletter" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" action="/pages/newsletter/thank-you.html">
        <input type="hidden" name="form-name" value="newsletter">
        <p class="visually-hidden"><label>Don’t fill this in <input name="bot-field"></label></p>
        <div class="field"><label for="newsletter-email">Email address</label><input id="newsletter-email" name="email" type="email" autocomplete="email" required></div>
        <p class="form-note">Guides, dispatch notes and product news. Unsubscribe any time. We do not sell your personal information. See our <a href="${r.privacy}">privacy policy</a>.</p>
        <button class="btn btn-primary" type="submit">Join the list</button>
      </form>`;
  const previewForm = `<form class="form newsletter-page-form" data-newsletter-form data-source="newsletter-page" novalidate>
        <div class="field"><label for="newsletter-email">Email address</label><input id="newsletter-email" name="email" type="email" autocomplete="email" required></div>
        <label class="consent-check"><input name="marketingConsent" type="checkbox" required> <span>Yes, email me my new-customer code and occasional NutriThrive farm notes, guides and offers. I can unsubscribe at any time.</span></label>
        <p class="form-note">We store your email and consent record to send these messages. We do not sell your personal information. New customers receive 5% off their first order. See our <a href="${r.privacy}">privacy policy</a>.</p>
        <button class="btn btn-primary" type="submit">Join and get 5% off</button>
        <p class="form-status" data-newsletter-status role="status"></p>
      </form>`;
  return layout({
    title: LIVE_MODE ? "Farm notes newsletter | NutriThrive Australia" : "NutriThrive Farm Notes and Product Newsletter",
    description: "Subscribe for occasional NutriThrive farm updates, product information, dispatch notes and new practical guides. No daily emails.",
    canonicalPath: LIVE_MODE ? "/pages/newsletter/" : "/newsletter",
    current: "",
    preserveTitle: Boolean(LIVE_MODE),
    robots: LIVE_MODE ? "index, follow" : "noindex, nofollow",
    main: `<section class="page-intro wrap-narrow newsletter-page">
      <h1>${LIVE_MODE ? "Farm notes" : "Notes from the warehouse"}</h1>
      <p class="lede">${LIVE_MODE ? "Occasional product and blog updates from Truganina. No daily drip." : "Occasional product and blog updates. No daily drip."}</p>
      ${LIVE_MODE ? liveForm : previewForm}
      <div class="newsletter-facts">
        <div><h2>What you get</h2><p>Tips for using moringa, curry leaves and tea at home, plus restock notes when something is back.</p></div>
        <div><h2>How often</h2><p>Most months, once or twice. We may send an extra note for a restock. Every email has an unsubscribe link.</p></div>
        <div><h2>Privacy</h2><p>We use your email only to send this list and to reply if you write to us about it. We do not sell mailing lists.</p></div>
      </div>
    </section>`,
  });
}

function newsletterThanksPage() {
  return layout({
    title: "You're on the NutriThrive list",
    description: "You're subscribed to occasional NutriThrive farm notes from Truganina. Unsubscribe any time from any email.",
    canonicalPath: "/pages/newsletter/thank-you.html",
    current: "",
    preserveTitle: true,
    robots: "noindex, follow",
    main: `<section class="page-intro wrap-narrow newsletter-page">
      <h1>You're on the list</h1>
      <p class="lede">We'll send occasional farm notes to that address. You can unsubscribe from any email.</p>
      <div class="not-found-actions"><a class="btn btn-primary" href="/products/">Shop the range</a><a class="btn btn-secondary" href="/">Back home</a></div>
    </section>`,
  });
}

function notFoundPage() {
  return layout({
    title: "Page Not Found | NutriThrive Australia",
    description: "The NutriThrive page you requested could not be found. Search our products and practical guides or return to the homepage.",
    canonicalPath: "/404",
    current: "",
    robots: "noindex, follow",
    main: `<section class="not-found wrap-narrow">
      <p class="eyebrow">404 · Lost leaf</p>
      <h1>This page has wandered off the farm.</h1>
      <p class="lede">The link may be old, or the page may have moved. Search NutriThrive or choose a useful place below.</p>
      <form class="not-found-search" action="${routes().journal}" method="get" role="search">
        <label for="not-found-query">Search our guides</label>
        <div><input id="not-found-query" name="q" type="search" placeholder="Moringa dosage, curry leaves, tea…"><button class="btn btn-primary" type="submit">Search</button></div>
      </form>
      <div class="not-found-actions"><a class="btn btn-primary" href="/">Go to homepage</a><a class="btn btn-secondary" href="${routes().shop}">Shop products</a><a class="btn btn-secondary" href="${routes().journal}">Browse every guide</a></div>
      <p class="form-note">Still stuck? <a href="/contact/">Contact NutriThrive</a> and tell us which link brought you here.</p>
    </section>`,
  });
}

function checkoutPage() {
  return layout({
    title: "NutriThrive Secure Checkout Design Preview",
    description: "Preview the NutriThrive delivery and order-summary experience locally. This design preview does not process cards, PayPal payments or real orders.",
    canonicalPath: "/checkout",
    current: "",
    extraHead: `<script src="/js/checkout-page.js" defer></script>`,
    robots: "noindex, nofollow",
    main: `
      <section class="page-intro wrap">
        <h1>Checkout</h1>
        <p class="notice">This is a local design preview. It does not charge a card or talk to PayPal. Use the live site to order.</p>
      </section>
      <section class="wrap cart-layout">
        <form class="form" action="/thank-you/" method="get">
          <h2>Delivery</h2>
          <div class="field"><label for="fullName">Full name</label><input id="fullName" name="fullName" autocomplete="name" required></div>
          <div class="field"><label for="email">Email</label><input id="email" type="email" name="email" autocomplete="email" required></div>
          <div class="field"><label for="phone">Phone</label><input id="phone" type="tel" name="phone" autocomplete="tel" required></div>
          <div class="field"><label for="address">Address</label><input id="address" name="address" autocomplete="street-address" required></div>
          <div class="field"><label for="suburb">Suburb</label><input id="suburb" name="suburb" required></div>
          <div class="field"><label for="postcode">Postcode</label><input id="postcode" name="postcode" inputmode="numeric" required></div>
          <button class="btn btn-primary" type="submit">Place preview order</button>
        </form>
        <aside class="summary" id="checkout-summary"></aside>
      </section>`,
  });
}

function thankYouPage() {
  const r = routes();
  if (!LIVE_MODE) {
    return layout({
      title: "Preview Order Confirmation | NutriThrive",
      description: "View the local NutriThrive confirmation-page design after testing the preview checkout. No payment is taken and no real order is created.",
      canonicalPath: "/thank-you",
      current: "",
      robots: "noindex, nofollow",
      extraFoot: `<script src="${THANK_YOU_PAGE_SRC}?v=${ASSET_VERSION}" defer></script>`,
      main: `<section class="page-intro wrap-narrow order-thanks">
      <h1>Received in this preview</h1>
      <p class="lede">Nothing was charged. To place a real order, use nutrithrive.com.au or call +61 438 201 419.</p>
      <dl class="order-thanks-list" id="order-facts" hidden>
        <div class="order-thanks-row" id="order-id-row" hidden><dt>Order reference</dt><dd id="order-id"></dd></div>
        <div class="order-thanks-row" id="order-item-row" hidden><dt>Item</dt><dd id="order-item"></dd></div>
        <div class="order-thanks-row" id="order-total-row" hidden><dt>Paid</dt><dd id="order-total"></dd></div>
      </dl>
      <div class="order-thanks-actions"><a class="btn btn-primary" href="/shop/">Back to shop</a></div>
    </section>`,
    });
  }
  return layout({
    title: "Order confirmed | NutriThrive Australia",
    description: "Thank you for your NutriThrive order. We are packing it in Truganina, Melbourne, and will email confirmation shortly.",
    canonicalPath: "/thank-you.html",
    current: "",
    preserveTitle: true,
    preserveDescription: true,
    robots: "noindex, follow",
    extraFoot: `<script src="${THANK_YOU_PAGE_SRC}?v=${ASSET_VERSION}" defer></script>`,
    main: `<section class="page-intro wrap-narrow order-thanks">
      <h1>Order confirmed</h1>
      <p class="lede">We've received your payment. A confirmation email is on the way.</p>
      <dl class="order-thanks-list" id="order-facts" hidden>
        <div class="order-thanks-row" id="order-id-row" hidden><dt>Order reference</dt><dd id="order-id"></dd></div>
        <div class="order-thanks-row" id="order-item-row" hidden><dt>Item</dt><dd id="order-item"></dd></div>
        <div class="order-thanks-row" id="order-total-row" hidden><dt>Paid</dt><dd id="order-total"></dd></div>
      </dl>
      <p class="order-thanks-note">We'll pack this in Truganina and ship as soon as we can. Questions? <a href="${r.contact}">Contact us</a> with your order reference.</p>
      <div class="order-thanks-actions">
        <a class="btn btn-primary" href="${r.shop}">Continue shopping</a>
        <a class="btn btn-secondary" href="/">Back home</a>
      </div>
    </section>`,
  });
}

function cityPage(city, slug) {
  const canonicalPath = slug === "melbourne" ? "/melbourne" : `/moringa-${slug}`;
  return layout({
    title: `Buy Moringa Powder in ${city} | NutriThrive`,
    description: `Buy farm-grown, lab-tested moringa powder delivered to ${city}. Shade-dried, packed in Truganina and shipped with tracking from $11 per 100g.`,
    canonicalPath,
    extraHead: jsonLd(
      breadcrumbSchema([
        { name: "Home", item: `${LIVE}/` },
        { name: city, item: `${LIVE}${canonicalPath}` },
      ])
    ),
    current: "",
    main: `
      <section class="city-hero wrap">
        <h1>Moringa for ${city}</h1>
        <p class="lede">Packed in Truganina, Melbourne, and sent with tracking. Same powder, same lab summary, same $11/100g.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="/products/moringa-powder/">Shop moringa</a>
          <a class="btn btn-secondary" href="/shipping/">Shipping times</a>
        </div>
      </section>
      <section class="section" style="padding-top:0">
        <div class="wrap-narrow">
          <h2>What arrives</h2>
          <p>Farm-grown, shade-dried moringa leaf powder manufactured by NutriThrive and tested in Australia. Order before 2pm Melbourne time Monday to Friday for same-day dispatch.</p>
          <h2>Why not a local warehouse?</h2>
          <p>One warehouse keeps batch records honest. ${city} customers get the same pouch as Melbourne, not a different contract pack.</p>
        </div>
      </section>`,
  });
}

function journalIndex(articles, opts = {}) {
  const topicFilter = opts.topic || null;
  const bySlug = new Map(articles.map((article) => [article.slug, article]));
  const ordered = [
    ...JOURNAL_PRIORITY.map((slug) => bySlug.get(slug)).filter(Boolean),
    ...articles.filter((article) => !JOURNAL_PRIORITY.includes(article.slug)),
  ].filter((article) => !JOURNAL_REDIRECTS[article.slug]);
  const featured = topicFilter ? null : ordered[0];
  const visible = topicFilter
    ? ordered.filter((article) => journalTopic(article) === topicFilter.name)
    : ordered.slice(1);
  const groups = topicFilter ? [topicFilter] : JOURNAL_TOPICS;
  const groupCards = (topic) => visible.filter((article) => journalTopic(article) === topic.name);
  const liveSeo = opts.seoFile ? extractSeo(opts.seoFile) : null;
  const r = routes();
  const canonicalPath = opts.canonicalPath || (LIVE_MODE ? "/blog/" : "/journal");
  const listArticles = topicFilter ? visible : articles.filter((article) => !JOURNAL_REDIRECTS[article.slug]);
  const articleCard = (article, extra = false) => `<a class="article-card" href="${r.article(article.slug)}" data-journal-card data-journal-topic="${esc(journalTopic(article))}"${extra ? " data-journal-extra hidden" : ""} data-search-text="${esc(`${stripTags(article.title)} ${stripTags(article.description)} ${article.category} ${journalTopic(article)} ${article.slug}`.toLowerCase())}">
    <div class="article-card-media"><img src="${article.image}" alt="${esc(humanCopy(stripTags(article.title)))}" width="800" height="450" loading="lazy"></div>
    <div class="cat">${esc(journalTopic(article))}</div>
    <h3>${esc(humanCopy(stripTags(article.title)))}</h3>
    <p>${esc(humanCopy(stripTags(article.description)))}</p>
    <span class="article-link">Read guide <span aria-hidden="true">→</span></span>
  </a>`;
  const crumbs = [{ name: "Home", item: `${LIVE}/` }, { name: "Blog", item: `${LIVE}/blog` }];
  if (topicFilter) crumbs.push({ name: topicFilter.name, item: `${LIVE}${canonicalPath.replace(/\/$/, "")}` });
  return layout({
    title: topicFilter
      ? `${topicFilter.name} | NutriThrive Blog`
      : liveSeo?.title || "Moringa, Curry Leaves & Tea Blog | NutriThrive",
    description: topicFilter
      ? `All ${topicFilter.name.toLowerCase()} guides from NutriThrive — practical Australian notes on choosing, using and storing what we grow and pack.`
      : liveSeo?.description || "Practical Australian guides to choosing and using moringa, curry leaves and Darjeeling tea, from the NutriThrive farming and manufacturing team.",
    canonicalPath,
    current: "Blog",
    preserveTitle: Boolean(!topicFilter && liveSeo?.title),
    preserveDescription: Boolean(!topicFilter && liveSeo?.description),
    extraHead:
      jsonLd(breadcrumbSchema(crumbs)) +
      jsonLd({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: topicFilter ? `${topicFilter.name} | NutriThrive Blog` : liveSeo?.title || "NutriThrive Blog",
        url: `${LIVE}${canonicalPath}`,
        isPartOf: { "@id": `${LIVE}/#website` },
        mainEntity: itemListSchema(
          topicFilter ? topicFilter.name : "Blog articles",
          `${LIVE}${canonicalPath}`,
          listArticles.map((a) => ({
            name: humanCopy(stripTags(a.title)),
            url: routes().articleAbs(a.slug),
          }))
        ),
      }),
    main: `
      <section class="page-intro wrap">
        <h1>${topicFilter ? esc(topicFilter.name) : "Blog"}</h1>
        <p class="lede">${topicFilter
          ? `Every ${esc(topicFilter.name.toLowerCase())} guide, in one place.`
          : "Clear answers about choosing, using and storing our products—from the team that grows and manufactures our moringa and curry leaves."}</p>
        <form class="journal-search" role="search" data-journal-search-form>
          <label for="journal-search">What would you like to know?</label>
          <div class="journal-search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.2-3.2"/></svg>
            <input id="journal-search" data-journal-search type="search" name="q" autocomplete="off" placeholder="For example: How much moringa should I take?">
            <button type="button" data-journal-search-clear hidden>Clear</button>
          </div>
          <p class="journal-search-status" data-journal-search-status role="status">Search ${topicFilter ? `these ${visible.length}` : `all ${articles.length}`} NutriThrive guides by question, topic or ingredient.</p>
        </form>
        <nav class="journal-topics" aria-label="Blog topics">
          ${JOURNAL_TOPICS.map((topic) => {
            const href = topicFilter ? topicHref(topic.slug) : `#${topicAnchor(topic.name)}`;
            const current = topicFilter && topic.slug === topicFilter.slug;
            return `<a href="${href}"${current ? ' aria-current="page"' : ""}>${esc(topic.name)}</a>`;
          }).join("")}
        </nav>
        <div class="journal-empty" data-journal-empty hidden>
          <h2>We could not find that answer yet.</h2>
          <p>Try fewer words, browse a topic below, or send us the question and we may turn it into a guide.</p>
          <div class="button-row"><button class="btn btn-secondary" type="button" data-journal-empty-clear>Show every guide</button><a class="btn btn-primary" href="/contact/">Ask NutriThrive</a></div>
        </div>
      </section>
      <section class="section" style="padding-top:0">
        <div class="wrap">
          ${featured ? `<a class="article-card featured journal-feature" href="${r.article(featured.slug)}" data-journal-feature data-search-text="${esc(`${stripTags(featured.title)} ${stripTags(featured.description)} ${featured.category} ${journalTopic(featured)} ${featured.slug}`.toLowerCase())}">
            <div class="article-card-media" style="margin:0"><img src="${featured.image}" alt="${esc(humanCopy(stripTags(featured.title)))}" width="1200" height="675"></div>
            <div>
              <div class="cat">${esc(humanCopy(featured.category))}</div>
              <h2>${esc(humanCopy(stripTags(featured.title)))}</h2>
              <p>${esc(humanCopy(stripTags(featured.description)))}</p>
              <span class="article-link">Read our most-visited guide <span aria-hidden="true">→</span></span>
            </div>
          </a>` : ""}
          ${groups.map((topic) => {
            const cards = groupCards(topic);
            if (!cards.length) return "";
            const id = topicAnchor(topic.name);
            const total = ordered.filter((article) => journalTopic(article) === topic.name).length;
            const preview = !topicFilter && cards.length > JOURNAL_PREVIEW_LIMIT;
            const shown = preview ? cards.slice(0, JOURNAL_PREVIEW_LIMIT) : cards;
            const extra = preview ? cards.slice(JOURNAL_PREVIEW_LIMIT) : [];
            const moreHref = topicHref(topic.slug);
            return `<section class="journal-section" aria-labelledby="${id}">
              <div class="section-head"><div><p class="kicker">${topicFilter ? "All guides" : "Browse by topic"}</p><h2 id="${id}">${esc(topic.name)}</h2></div>${preview ? `<a href="${moreHref}">Explore all ${total}</a>` : ""}</div>
              <div class="journal-grid${preview ? " journal-grid--preview" : ""}">${shown.map((article) => articleCard(article)).join("")}${extra.map((article) => articleCard(article, true)).join("")}</div>
              ${preview ? `<p class="journal-more"><a class="btn btn-secondary" href="${moreHref}">Explore all ${total} guides</a></p>` : ""}
            </section>`;
          }).join("")}
          <aside class="journal-principle">
            <div><p class="kicker">Our editorial promise</p><h2>Useful information, without miracle claims.</h2></div>
            <p>We distinguish food guidance from medical advice, correct mistakes, and explain where our products come from. Our moringa and curry leaves are grown on our own farm; orders are packed in Truganina, Melbourne.</p>
          </aside>
        </div>
      </section>`,
  });
}

function rewriteLinks(html) {
  let out = humanCopy(html)
    .replaceAll("/assets/images/products/moringa-powder/moringa-powder-product-100g.webp", "/assets/images/product_webp/moringa-powder-100g-main.webp")
    .replaceAll("/assets/images/product_photos/moringa-400g-bundle.jpeg", "/assets/images/product_webp/moringa-powder-400g-bundle-main.webp")
    .replaceAll("/assets/images/product_photos/driedcurry.jpeg", "/assets/images/product_webp/dried-curry-leaves-texture.webp");
  if (LIVE_MODE) {
    out = out
      .replaceAll('href="/shop/"', 'href="/products/"')
      .replaceAll('href="/shop"', 'href="/products/"')
      .replaceAll('href="/privacy-policy"', 'href="/privacy-policy"')
      .replaceAll('href="/shipping"', 'href="/shipping"')
      .replaceAll('href="/shipping"', 'href="/shipping"');
  } else {
    out = out
      .replaceAll(/href="\/blog\/([^"#]+?)(?:\.html)?(#[^"]*)?"/g, 'href="/journal/$1/$2"')
      .replaceAll('href="/blog/"', 'href="/journal/"')
      .replaceAll('href="/about"', 'href="/about/"')
      .replaceAll('href="/contact"', 'href="/contact/"')
      .replaceAll('href="/faq"', 'href="/faq/"')
      .replaceAll('href="/cart"', 'href="/cart/"')
      .replaceAll('href="/products/"', 'href="/shop/"')
      .replaceAll('href="/privacy-policy"', 'href="/privacy/"')
      .replaceAll('href="/shipping"', 'href="/shipping/"')
      .replaceAll('href="/shipping"', 'href="/shipping/"');
  }
  return out
    .replaceAll(/style="[^"]*"/g, "")
    .replaceAll(/NMI(?: Australian Government| Government)? lab-tested/gi, "tested in Australia")
    .replaceAll(/NMI tested per batch/gi, "supported by an available Australian lab summary")
    .replaceAll(/NMI lab tested/gi, "tested in Australia")
    .replaceAll(/NMI Australian Gov(?:ernment)?(?: lab)?/gi, "Australian laboratory")
    .replaceAll(/metal and microbial results for each production batch/gi, "available testing information")
    .replaceAll(/every batch is tested by third-party Australian laboratories[^.]*\./gi, "NutriThrive publishes testing information when it is available.")
    .replaceAll(/Certificate of Analysis \(CoA\) (?:is )?available for every batch/gi, "Testing information is published when available")
    .replaceAll(/provides Certificate of Analysis \(CoA\) for every batch/gi, "publishes testing information when available")
    .replaceAll(/every batch screened in Australian labs \(NMI\)/gi, "Australian testing information published when available")
    .replaceAll(/from partner farms in India/gi, "from our own farm")
    .replaceAll(/every batch(?: is)? lab-tested/gi, "testing information is published when available")
    .replaceAll(/lab-tested every batch/gi, "testing information published when available")
    .replaceAll(/we grow and process moringa powder in Truganina,? Melbourne/gi, "we grow and manufacture moringa on our own farm, and pack it in Truganina, Melbourne")
    .replaceAll(/grown and processed in Truganina,? Melbourne/gi, "grown and manufactured on our own farm, then packed in Truganina, Melbourne")
    .replaceAll(/ in Gujarat(?:, India)?/gi, "")
    .replaceAll(/ from Gujarat(?:, India)?/gi, "")
    .replaceAll(/Gujarat farm/gi, "own farm")
    .replace(/<h1(\s[^>]*)?>/gi, "<h2$1>")
    .replace(/<\/h1>/gi, "</h2>")
    .replace(/<table(\s[^>]*)?>/gi, '<div class="table-scroll"><table$1>')
    .replace(/<\/table>/gi, "</table></div>");
}

function extractArticleProse(slug, fallbackHtml) {
  const file = path.join(SITE, "blog", `${slug}.html`);
  let html = "";
  if (LIVE_MODE) {
    html = gitShowHead(`blog/${slug}.html`);
  }
  if (!html && fs.existsSync(file)) html = fs.readFileSync(file, "utf8");
  if (!html) return fallbackHtml;
  for (const cls of ["blog-v2-prose", "main-content", "blog-post-content", "content-wrapper"]) {
    const extracted = extractInnerByClass(html, cls);
    if (extracted.trim().length > 200) return rewriteLinks(extracted);
  }
  const migrated = html.match(/<div class="prose">([\s\S]*?)<\/div>\s*(?:<aside class="article-safety"|<section class="article-conversion")/);
  if (migrated && migrated[1].trim().length > 400) return migrated[1];
  return fallbackHtml;
}

function extractInnerByClass(html, className) {
  const re = new RegExp(`<(div|main|article|section)([^>]*class="[^"]*${className}[^"]*"[^>]*)>`, "i");
  const m = html.match(re);
  if (!m) return "";
  const tag = m[1].toLowerCase();
  const start = html.indexOf(m[0]) + m[0].length;
  const open = new RegExp(`<${tag}\\b`, "gi");
  const close = new RegExp(`</${tag}>`, "gi");
  let i = start;
  let depth = 1;
  while (i < html.length && depth > 0) {
    open.lastIndex = i;
    close.lastIndex = i;
    const nextOpen = open.exec(html);
    const nextClose = close.exec(html);
    if (!nextClose) break;
    if (nextOpen && nextOpen.index < nextClose.index) {
      depth += 1;
      i = nextOpen.index + nextOpen[0].length;
    } else {
      depth -= 1;
      if (depth === 0) return html.slice(start, nextClose.index);
      i = nextClose.index + nextClose[0].length;
    }
  }
  return html.slice(start);
}

function articlePage(meta, prose, allArticles, liveSeo = null) {
  const shop = journalProduct(meta) || PRODUCTS[0];
  const catalogTitle = humanCopy(stripTags(meta.seoTitle || meta.title));
  const title = liveSeo?.title || catalogTitle;
  const displayH1 = articleDisplayH1(meta, liveSeo, title);
  const description = liveSeo?.description || humanCopy(stripTags(meta.description));
  const r = routes();
  const url = r.articleAbs(meta.slug);
  const image = absUrl(meta.image);
  const category = humanCopy(meta.category);
  const topic = journalTopic(meta);
  const cta = journalCta(meta, shop);
  const productHref = shopHref(shop);
  const quickProductLabel = meta.slug === "fathers-day-gift-under-40"
    ? "Gift Pack · $35"
    : `${shop.name} · ${money(shop.price)} ${shop.unit || ""}`;
  const isHealth = /health|pregnan|children|dog|blood|thyroid|cholesterol|pcos|menopause|anxiety|stress|gut|weight|sleep|iron|vitamin|magnesium|cortisol|berberine|inflamm/i.test(`${meta.slug} ${category}`);
  const topicArticles = allArticles.filter((article) => journalTopic(article) === topic);
  const currentIndex = topicArticles.findIndex((article) => article.slug === meta.slug);
  const nextArticles = topicArticles.length > 1
    ? [topicArticles[(currentIndex + 1) % topicArticles.length], topicArticles[(currentIndex + 2) % topicArticles.length]]
    : [];
  const priorityArticle = JOURNAL_PRIORITY.map((slug) => topicArticles.find((article) => article.slug === slug))
    .find((article) => article && article.slug !== meta.slug);
  const curatedRelated = (CURATED_RELATED[meta.slug] || []).map((slug) => allArticles.find((article) => article.slug === slug)).filter(Boolean);
  const globalRelated = JOURNAL_PRIORITY.map((slug) => allArticles.find((article) => article.slug === slug)).filter(Boolean);
  const currentGlobalIndex = allArticles.findIndex((article) => article.slug === meta.slug);
  const neighboringArticles = allArticles.length > 1
    ? [allArticles[(currentGlobalIndex + 1) % allArticles.length], allArticles[(currentGlobalIndex + 2) % allArticles.length]]
    : [];
  const relatedArticles = [...curatedRelated, priorityArticle, ...nextArticles, ...globalRelated, ...neighboringArticles]
    .filter((article, index, list) => article && article.slug !== meta.slug && list.findIndex((item) => item?.slug === article.slug) === index)
    .slice(0, 3);
  return layout({
    title,
    description,
    canonicalPath: LIVE_MODE ? `/blog/${meta.slug}` : `/journal/${meta.slug}`,
    current: "Blog",
    preserveTitle: Boolean(liveSeo?.title),
    preserveDescription: Boolean(liveSeo?.description),
    ogType: "article",
    ogImage: meta.image,
    ogImageWidth: 1200,
    ogImageHeight: 675,
    extraHead: `<meta name="author" content="Neer Vasa">
  <meta property="article:author" content="Neer Vasa">
  <meta property="article:section" content="${esc(category)}">
  ${jsonLd({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: [image],
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Person", name: "Neer Vasa" },
    publisher: { "@id": `${LIVE}/#localbusiness` },
    articleSection: category,
    inLanguage: "en-AU",
  })}
  ${jsonLd(
    breadcrumbSchema([
      { name: "Home", item: `${LIVE}/` },
      { name: "Blog", item: `${LIVE}/blog` },
      { name: title, item: url },
    ])
  )}`,
    main: `
      <nav class="wrap crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> / <a href="${r.journal}">Blog</a> / <span>${esc(title)}</span>
      </nav>
      <section class="wrap article-layout">
        <article>
          <p class="meta-line">${esc(topic)} · Reviewed Aug 2026 · By Neer Vasa</p>
          <h1>${esc(displayH1)}</h1>
          <p class="lede">${esc(description)}</p>
          <div class="article-hero"><img src="${meta.image}" alt="${esc(title)}" width="1200" height="675" fetchpriority="high"></div>
          <aside class="article-quick-product" aria-label="Related NutriThrive product">
            <div><span>Related product</span><strong>${esc(quickProductLabel)}</strong></div>
            <a href="${productHref}" data-funnel-event="article_early_product_click" data-article="${esc(meta.slug)}" data-product="${esc(shop.id)}">${esc(cta)}</a>
          </aside>
          <div class="prose">${prose}</div>
          ${isHealth ? `<aside class="article-safety"><h2>Food guidance, not medical advice</h2><p>This article is general information. NutriThrive products are foods, not treatments. Speak with a qualified healthcare professional if you are pregnant, breastfeeding, managing a health condition or taking medication.</p></aside>` : ""}
          <section class="article-conversion" aria-labelledby="article-product-${esc(meta.slug)}">
            <img src="${shop.image}" alt="${esc(shop.name)} ${esc(shop.variant)}" width="240" height="300" loading="lazy">
            <div>
              <p class="kicker">A practical next step</p>
              <h2 id="article-product-${esc(meta.slug)}">${esc(shop.name)}</h2>
              <p>${esc(shop.detail || shop.benefit)}</p>
              <p class="price">${money(shop.price)} ${esc(shop.unit || "")}</p>
              <div class="btn-row">
                <a class="btn btn-primary" href="${productHref}" data-funnel-event="article_product_click" data-article="${esc(meta.slug)}" data-product="${esc(shop.id)}">${esc(cta)}</a>
                <a class="btn btn-secondary" href="/shipping/" data-funnel-event="article_shipping_click">Delivery & returns</a>
              </div>
            </div>
          </section>
          ${relatedArticles.length ? `<nav class="article-related" aria-labelledby="related-${esc(meta.slug)}">
            <p class="kicker">Continue with</p>
            <h2 id="related-${esc(meta.slug)}">Related ${esc(topic.toLowerCase())}</h2>
            <ul>${relatedArticles.map((article) => `<li><a href="${r.article(article.slug)}">${esc(humanCopy(stripTags(article.title)))}</a></li>`).join("")}</ul>
          </nav>` : ""}
          <aside class="article-author">
            <p class="kicker">About the author</p>
            <h2>Neer Vasa, NutriThrive founder</h2>
            <p>Neer works across NutriThrive’s farming, manufacturing and Melbourne fulfilment. NutriThrive grows moringa and curry leaves on its own farm, sources tea from a Darjeeling family farm, and handmakes moringa soap in Australia.</p>
          </aside>
        </article>
        <aside class="article-sidebar">
          <p class="kicker">From guide to product</p>
          <h2>${esc(shop.name)}</h2>
          <p>${esc(shop.benefit)}</p>
          <p class="price" style="font-weight:600;font-size:20px;margin:0 0 16px">${money(shop.price)} ${esc(shop.unit || "")}</p>
          <a class="btn btn-primary btn-block" href="${productHref}" data-funnel-event="article_sidebar_product_click" data-article="${esc(meta.slug)}" data-product="${esc(shop.id)}">${esc(cta)}</a>
          <ul class="article-trust-list">
            <li>Manufacturer direct</li>
            <li>Weekday dispatch before 2pm</li>
            <li>Australia-wide delivery</li>
          </ul>
        </aside>
      </section>`,
  });
}

function redirectPage(fromSlug, toSlug, seo = {}) {
  const destination = LIVE_MODE ? `/blog/${toSlug}` : `/journal/${toSlug}/`;
  const title = seo.title || "Guide moved | NutriThrive";
  const description = seo.description || "This guide has moved to a clearer, consolidated NutriThrive article.";
  const canonical = seo.canonical || `${LIVE}/blog/${toSlug}`;
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="noindex,follow"><link rel="canonical" href="${esc(canonical)}"><link rel="icon" href="/assets/images/logo/favicon.ico" sizes="any"><meta http-equiv="refresh" content="0;url=${destination}"></head><body><main><h1>This guide has moved</h1><p>We combined overlapping information into one clearer guide.</p><p><a href="${destination}">Read the updated guide</a></p></main></body></html>`;
}

function stripTags(s) {
  return String(s).replace(/<[^>]+>/g, "").replaceAll("&amp;", "&");
}

function loadArticles() {
  const src = fs.readFileSync(path.join(SITE, "shared/js/blog-articles.js"), "utf8");
  const json = src.replace(/^[\s\S]*?window\.NT_BLOG_ARTICLES = /, "").replace(/;\s*$/, "");
  const articles = JSON.parse(json);
  const known = new Set(articles.map((article) => article.slug));
  for (const name of fs.readdirSync(path.join(SITE, "blog"))) {
    if (!name.endsWith(".html") || name === "index.html" || name.includes(".partial.")) continue;
    const slug = name.replace(/\.html$/, "");
    if (known.has(slug)) continue;
    const html = fs.readFileSync(path.join(SITE, "blog", name), "utf8");
    if (/meta\s+name=["']robots["']\s+content=["']noindex/i.test(html)) continue;
    const seo = extractSeo(path.join(SITE, "blog", name));
    const image = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1]
      || "";
    articles.push({
      slug,
      title: seo.title || slug.replaceAll("-", " "),
      seoTitle: seo.title || "",
      description: seo.description || "Practical NutriThrive guide for Australian readers.",
      category: "Guide",
      image: image.replace(LIVE, ""),
      url: `${LIVE}/blog/${slug}`,
    });
  }
  return articles;
}

function articleImage(article) {
  const source = article.image || "";
  if (source.startsWith("/assets/") && fs.existsSync(path.join(SITE, source.slice(1)))) return source;
  if (source.startsWith("/storefront/") && fs.existsSync(path.join(ROOT, source.slice(1)))) return source.replace(/^\/storefront/, "");
  const topic = journalTopic(article);
  if (/gift/i.test(`${article.slug} ${article.title}`)) return "/assets/images/product_webp/nutrithrive-four-product-gift-pack-main.webp";
  if (topic === "Curry leaves") return "/assets/images/product_webp/dried-curry-leaves-texture.webp";
  if (topic === "Darjeeling tea") return "/assets/images/product_webp/darjeeling-black-tea-brewed.webp";
  if (topic === "Soap & skin") return "/assets/images/product_webp/moringa-soap-texture.webp";
  return "/assets/images/product_webp/moringa-powder-texture.webp";
}

function emit(rel, html, liveRel = rel) {
  writePage(LIVE_MODE ? liveRel : rel, html, LIVE_MODE ? SITE : OUT);
}

function writeGeneratedJs(search) {
  const catalog = `window.NT_PRODUCTS = ${JSON.stringify(
    PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      variant: p.variant,
      price: p.price,
      image: `${p.image}?v=${ASSET_VERSION}`,
      href: p.href,
      benefit: p.benefit,
      was: p.was || null,
      unit: p.unit || "",
      detail: p.detail || p.benefit,
      costNote: costNote(p),
      weight: p.weight || 0,
    }))
  )};\n`;
  const searchJs = `window.NT_SEARCH = ${JSON.stringify(search)};\n`;
  fs.writeFileSync(path.join(OUT, "js/search-index.js"), searchJs);
  fs.writeFileSync(path.join(OUT, "js/catalog.js"), catalog);
  if (LIVE_MODE) {
    fs.mkdirSync(path.join(SITE, "assets/js/storefront"), { recursive: true });
    fs.mkdirSync(path.join(SITE, "assets/css"), { recursive: true });
    fs.writeFileSync(path.join(SITE, "assets/js/storefront/search-index.js"), searchJs);
    fs.writeFileSync(path.join(SITE, "assets/js/storefront/catalog.js"), catalog);
    fs.copyFileSync(path.join(OUT, "css/system.css"), path.join(SITE, "assets/css/storefront-system.css"));
    fs.copyFileSync(path.join(OUT, "js/site.js"), path.join(SITE, "assets/js/storefront/site.js"));
    fs.copyFileSync(path.join(OUT, "js/cart-page.js"), path.join(SITE, "assets/js/storefront/cart-page.js"));
    fs.copyFileSync(path.join(OUT, "js/payment-page.js"), path.join(SITE, "assets/js/storefront/payment-page.js"));
    fs.copyFileSync(path.join(OUT, "js/thank-you-page.js"), path.join(SITE, "assets/js/storefront/thank-you-page.js"));
    fs.copyFileSync(path.join(ROOT, "scripts/global/cart.js"), path.join(SITE, "assets/js/storefront/runtime-cart.js"));
    fs.copyFileSync(path.join(ROOT, "scripts/global/shipping-rates.js"), path.join(SITE, "assets/js/storefront/runtime-shipping-rates.js"));
    fs.copyFileSync(path.join(ROOT, "scripts/global/paypal-client-config.js"), path.join(SITE, "assets/js/storefront/runtime-paypal-client-config.js"));
    fs.copyFileSync(path.join(ROOT, "scripts/global/paypal-sdk-loader.js"), path.join(SITE, "assets/js/storefront/runtime-paypal-sdk-loader.js"));
  }
}

function appendLiveRedirects() {
  const marker = "# === storefront production routes (keep ranking /blog URLs) ===";
  const block = `${marker}
/shop /products/ 301
/shop/ /products/ 301
/journal /blog/ 301
/journal/ /blog/ 301
/journal/index.html /blog/ 301
/journal/:slug /blog/:slug 301
/journal/:slug/ /blog/:slug 301
/blog/category/moringa-guides /blog/category/moringa-guides/index.html 200
/blog/category/moringa-guides/ /blog/category/moringa-guides/index.html 200
/blog/category/ways-to-use-it /blog/category/ways-to-use-it/index.html 200
/blog/category/ways-to-use-it/ /blog/category/ways-to-use-it/index.html 200
/blog/category/curry-leaves /blog/category/curry-leaves/index.html 200
/blog/category/curry-leaves/ /blog/category/curry-leaves/index.html 200
/blog/category/soap-skin /blog/category/soap-skin/index.html 200
/blog/category/soap-skin/ /blog/category/soap-skin/index.html 200
/shipping /shipping 200
/shipping/ /shipping 200
/privacy /privacy-policy 301
/newsletter /pages/newsletter/ 301
/newsletter/ /pages/newsletter/ 301
`;
  const file = path.join(SITE, "_redirects");
  const current = fs.readFileSync(file, "utf8");
  const idx = current.indexOf(marker);
  if (idx >= 0) {
    fs.writeFileSync(file, current.slice(0, idx) + block);
  } else {
    fs.appendFileSync(file, `\n${block}`);
  }
}

function copyLiveUiAssets() {
  fs.mkdirSync(path.join(SITE, "assets/js/storefront"), { recursive: true });
  fs.mkdirSync(path.join(SITE, "assets/css"), { recursive: true });
  fs.copyFileSync(path.join(OUT, "css/system.css"), path.join(SITE, "assets/css/storefront-system.css"));
  fs.copyFileSync(path.join(OUT, "js/site.js"), path.join(SITE, "assets/js/storefront/site.js"));
  fs.copyFileSync(path.join(OUT, "js/cart-page.js"), path.join(SITE, "assets/js/storefront/cart-page.js"));
  fs.copyFileSync(path.join(OUT, "js/payment-page.js"), path.join(SITE, "assets/js/storefront/payment-page.js"));
  fs.copyFileSync(path.join(OUT, "js/thank-you-page.js"), path.join(SITE, "assets/js/storefront/thank-you-page.js"));
  fs.copyFileSync(path.join(ROOT, "scripts/global/cart.js"), path.join(SITE, "assets/js/storefront/runtime-cart.js"));
  fs.copyFileSync(path.join(ROOT, "scripts/global/shipping-rates.js"), path.join(SITE, "assets/js/storefront/runtime-shipping-rates.js"));
  fs.copyFileSync(path.join(ROOT, "scripts/global/paypal-client-config.js"), path.join(SITE, "assets/js/storefront/runtime-paypal-client-config.js"));
  fs.copyFileSync(path.join(ROOT, "scripts/global/paypal-sdk-loader.js"), path.join(SITE, "assets/js/storefront/runtime-paypal-sdk-loader.js"));
}

function main() {
  if (LIVE_MODE && LIVE_PAGES.size) {
    copyLiveUiAssets();
    if (LIVE_PAGES.has("payment")) emit("payment/index.html", paymentPage(), "pages/shop/payment.html");
    if (LIVE_PAGES.has("thank-you")) emit("thank-you/index.html", thankYouPage(), "pages/shop/thank-you.html");
    if (LIVE_PAGES.has("cart")) emit("cart/index.html", cartPage(), "pages/shop/cart.html");
    if (LIVE_PAGES.has("newsletter")) {
      emit("newsletter/index.html", newsletterPage(), "pages/newsletter/index.html");
      emit("newsletter/thank-you.html", newsletterThanksPage(), "pages/newsletter/thank-you.html");
    }
    for (const slug of LIVE_PAGES) {
      if (PDP[slug]) {
        const html = pdpPage(slug, PDP[slug]);
        emit(`products/${slug}/index.html`, html);
        writePage(`products/${slug}/index.html`, html, OUT);
      }
    }
    console.log(`Wrote live storefront pages: ${[...LIVE_PAGES].join(", ")}.`);
    return;
  }

  const r = routes();
  const articles = loadArticles().map((article) => ({ ...article, image: articleImage(article) }));
  const activeArticles = LIVE_MODE ? articles : articles.filter((article) => !JOURNAL_REDIRECTS[article.slug]);
  const search = [
    ...PRODUCTS.map((p) => ({
      title: `${p.name} ${p.variant}`,
      href: shopHref(p),
      kind: "Product",
      blurb: p.benefit,
    })),
    ...activeArticles.map((a) => ({
      title: humanCopy(stripTags(a.title)),
      href: r.article(a.slug),
      kind: a.category,
      blurb: humanCopy(stripTags(a.description)),
    })),
  ];
  writeGeneratedJs(search);

  if (LIVE_MODE && LIVE_ARTICLE) {
    const meta = articles.find((article) => article.slug === LIVE_ARTICLE);
    if (!meta) {
      throw new Error(`STOREFRONT_ARTICLE not in blog-articles.js: ${LIVE_ARTICLE}`);
    }
    emit(
      "blog/index.html",
      journalIndex(activeArticles, {
        canonicalPath: "/blog/",
        seoFile: path.join(SITE, "blog/index.html"),
      }),
      "blog/index.html"
    );
    for (const topic of JOURNAL_TOPICS) {
      emit(
        `blog/category/${topic.slug}/index.html`,
        journalIndex(activeArticles, {
          topic,
          canonicalPath: `/blog/category/${topic.slug}/`,
        }),
        `blog/category/${topic.slug}/index.html`
      );
    }
    const file = path.join(SITE, "blog", `${meta.slug}.html`);
    const liveSeo = extractSeo(file);
    const prose = extractArticleProse(
      meta.slug,
      `<p>${esc(humanCopy(stripTags(meta.description)))}</p><p><a href="/products/black-tea/">Shop Darjeeling tea</a></p>`
    );
    emit(`blog/${meta.slug}.html`, articlePage(meta, prose, activeArticles, liveSeo), `blog/${meta.slug}.html`);
    console.log(`Wrote production article ${LIVE_ARTICLE} plus blog index and category pages.`);
    return;
  }

  if (LIVE_MODE) {
    emit("index.html", homepage());
    emit("shop/index.html", shopPage(), "products/index.html");
    for (const [slug, data] of Object.entries(PDP)) {
      emit(`products/${slug}/index.html`, pdpPage(slug, data));
    }
    emit("about/index.html", aboutPage(), "pages/about/about.html");
    emit("contact/index.html", contactPage(), "pages/contact/contact.html");
    emit("faq/index.html", faqPage(), "pages/faq/faq.html");
    emit("shipping/index.html", shippingPage(), "pages/shipping/shipping-returns.html");
    emit("privacy/index.html", privacyPage(), "pages/legal/privacy-policy.html");
    emit("cart/index.html", cartPage(), "pages/shop/cart.html");
    emit("payment/index.html", paymentPage(), "pages/shop/payment.html");
    emit("thank-you/index.html", thankYouPage(), "pages/shop/thank-you.html");
    emit("404.html", notFoundPage());
    emit("melbourne/index.html", cityPage("Melbourne", "melbourne"), "pages/homepage/melbourne.html");
    emit("moringa-sydney/index.html", cityPage("Sydney", "sydney"));
    emit("moringa-brisbane/index.html", cityPage("Brisbane", "brisbane"));
    emit("moringa-perth/index.html", cityPage("Perth", "perth"));
    emit("moringa-adelaide/index.html", cityPage("Adelaide", "adelaide"));
    emit("newsletter/index.html", newsletterPage(), "pages/newsletter/index.html");
    emit("newsletter/thank-you.html", newsletterThanksPage(), "pages/newsletter/thank-you.html");
    emit(
      "blog/index.html",
      journalIndex(activeArticles, {
        canonicalPath: "/blog/",
        seoFile: path.join(SITE, "blog/index.html"),
      }),
      "blog/index.html"
    );
    for (const topic of JOURNAL_TOPICS) {
      emit(
        `blog/category/${topic.slug}/index.html`,
        journalIndex(activeArticles, {
          topic,
          canonicalPath: `/blog/category/${topic.slug}/`,
        }),
        `blog/category/${topic.slug}/index.html`
      );
    }

    let wrapped = 0;
    for (const meta of articles) {
      const slug = meta.slug;
      const file = path.join(SITE, "blog", `${slug}.html`);
      const liveSeo = extractTrackedSeo(`blog/${slug}.html`) || extractSeo(file);
      if (JOURNAL_REDIRECTS[slug]) {
        emit(`blog/${slug}.html`, redirectPage(slug, JOURNAL_REDIRECTS[slug], liveSeo), `blog/${slug}.html`);
        wrapped += 1;
        continue;
      }
      const prose = extractArticleProse(
        slug,
        `<p>${esc(humanCopy(stripTags(meta.description)))}</p><p><a href="/products/">Shop the range</a></p>`
      );
      emit(`blog/${slug}.html`, articlePage(meta, prose, activeArticles, liveSeo), `blog/${slug}.html`);
      wrapped += 1;
    }
    appendLiveRedirects();
    console.log(`Wrote production storefront pages to site/ (${wrapped} ranking /blog articles), including PayPal /payment.`);
    return;
  }

  writePage("index.html", homepage());
  writePage("shop/index.html", shopPage());
  for (const [slug, data] of Object.entries(PDP)) {
    writePage(`products/${slug}/index.html`, pdpPage(slug, data));
  }
  writePage("about/index.html", aboutPage());
  writePage("contact/index.html", contactPage());
  writePage("faq/index.html", faqPage());
  writePage("shipping/index.html", shippingPage());
  writePage("privacy/index.html", privacyPage());
  writePage("cart/index.html", cartPage());
  writePage("payment/index.html", paymentPage());
  writePage("checkout/index.html", checkoutPage());
  writePage("thank-you/index.html", thankYouPage());
  writePage("404.html", notFoundPage());
  writePage("melbourne/index.html", cityPage("Melbourne", "melbourne"));
  writePage("moringa-sydney/index.html", cityPage("Sydney", "sydney"));
  writePage("moringa-brisbane/index.html", cityPage("Brisbane", "brisbane"));
  writePage("moringa-perth/index.html", cityPage("Perth", "perth"));
  writePage("moringa-adelaide/index.html", cityPage("Adelaide", "adelaide"));
  writePage("newsletter/index.html", newsletterPage());
  writePage("unsubscribe/index.html", layout({
    title: "Unsubscribe from NutriThrive Marketing Emails",
    description: "Stop NutriThrive marketing emails without signing in or creating an account. Submit the email address you previously subscribed with.",
    canonicalPath: "/unsubscribe",
    current: "",
    robots: "noindex, nofollow",
    main: `<section class="page-intro wrap-narrow">
      <h1>Unsubscribe from emails</h1>
      <p>You do not need an account. Enter the email address you subscribed with and we will stop marketing emails.</p>
      <form class="form" data-unsubscribe-form novalidate>
        <div class="field"><label for="unsubscribe-email">Email address</label><input id="unsubscribe-email" name="email" type="email" autocomplete="email" required></div>
        <button class="btn btn-primary" type="submit">Unsubscribe</button>
        <p class="form-status" data-unsubscribe-status role="status"></p>
      </form>
      <p class="form-note">Local preview only. On the live store this request must be sent to the email platform and completed within the required timeframe.</p>
    </section>`,
  }));

  writePage("journal/index.html", journalIndex(activeArticles));
  for (const topic of JOURNAL_TOPICS) {
    writePage(`journal/category/${topic.slug}/index.html`, journalIndex(activeArticles, {
      topic,
      canonicalPath: `/journal/category/${topic.slug}/`,
    }));
  }

  let wrapped = 0;
  for (const meta of articles) {
    const slug = meta.slug;
    const file = path.join(SITE, "blog", `${slug}.html`);
    const prose = extractArticleProse(
      slug,
      `<p>${esc(humanCopy(stripTags(meta.description)))}</p><p><a href="/shop/">Shop the range</a></p>`
    );
    writePage(`journal/${slug}/index.html`, articlePage(meta, prose, activeArticles));
    wrapped += 1;
  }
  for (const [fromSlug, toSlug] of Object.entries(JOURNAL_REDIRECTS)) {
    writePage(`journal/${fromSlug}/index.html`, redirectPage(fromSlug, toSlug));
  }

  fs.writeFileSync(
    path.join(OUT, "_redirects"),
    Object.entries(JOURNAL_REDIRECTS)
      .flatMap(([fromSlug, toSlug]) => [
        `/journal/${fromSlug}/ /journal/${toSlug}/ 301`,
        `/blog/${fromSlug} /journal/${toSlug}/ 301`,
        `/blog/${fromSlug}.html /journal/${toSlug}/ 301`,
      ])
      .join("\n") + "\n"
  );

  console.log(`Wrote core pages + ${wrapped} journal articles to storefront/`);
  scanSeo();
}

function scanSeo() {
  const issues = [];
  const seenTitles = new Map();
  const seenDescriptions = new Map();
  const seenCanonicals = new Map();
  const remember = (map, value, rel, label) => {
    if (!value) return;
    if (map.has(value)) issues.push(`${rel}: duplicate ${label} also used by ${map.get(value)}`);
    else map.set(value, rel);
  };
  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      if (name === "js" || name === "css" || name === "img" || name === "node_modules") continue;
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (name !== "index.html") continue;
      const html = fs.readFileSync(full, "utf8");
      if (html.includes('http-equiv="refresh"')) continue;
      const rel = path.relative(OUT, full);
      const title = html.match(/<title>([^<]*)<\/title>/);
      const desc = html.match(/<meta name="description" content="([^"]*)"/);
      const canonical = html.match(/<link rel="canonical" href="([^"]*)"/);
      const h1s = html.match(/<h1[\s>]/gi) || [];
      if (!title?.[1]) issues.push(`${rel}: missing title`);
      if (!desc?.[1]) issues.push(`${rel}: missing description`);
      if (!canonical) issues.push(`${rel}: missing canonical`);
      const titleLength = title?.[1]?.replace(/&amp;/g, "&").length || 0;
      const descriptionLength = desc?.[1]?.replace(/&amp;/g, "&").length || 0;
      if (titleLength && (titleLength < 30 || titleLength > 60)) issues.push(`${rel}: title length ${titleLength}`);
      if (descriptionLength && (descriptionLength < 120 || descriptionLength > 160)) issues.push(`${rel}: description length ${descriptionLength}`);
      remember(seenTitles, title?.[1], rel, "title");
      remember(seenDescriptions, desc?.[1], rel, "description");
      remember(seenCanonicals, canonical?.[1], rel, "canonical");
      if (h1s.length !== 1) issues.push(`${rel}: ${h1s.length} H1s`);
      if (!html.includes('name="viewport"')) issues.push(`${rel}: no viewport`);
      if (!html.includes("og:title")) issues.push(`${rel}: no og:title`);
      if (!html.includes("og:description")) issues.push(`${rel}: no og:description`);
      if (!html.includes("og:image")) issues.push(`${rel}: no og:image`);
      if (!html.includes('name="twitter:card"')) issues.push(`${rel}: no Twitter card`);
      if (!html.includes("application/ld+json")) issues.push(`${rel}: no JSON-LD`);
      for (const match of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
        try { JSON.parse(match[1]); } catch { issues.push(`${rel}: invalid JSON-LD`); }
      }
      if (/<img\b(?![^>]*\balt=)[^>]*>/i.test(html)) issues.push(`${rel}: image missing alt text`);
      for (const imageMatch of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/gi)) {
        const src = imageMatch[1];
        if (/^(?:https?:|data:)/.test(src)) continue;
        const clean = src.split(/[?#]/)[0];
        const localFile = clean.startsWith("/assets/")
          ? path.join(SITE, clean.slice(1))
          : clean.startsWith("/")
            ? path.join(OUT, clean.slice(1))
            : path.resolve(path.dirname(full), clean);
        if (!fs.existsSync(localFile)) issues.push(`${rel}: broken image ${src}`);
      }
      for (const altMatch of html.matchAll(/<img\b[^>]*\balt="([^"]*)"[^>]*>/gi)) {
        if (!altMatch[1].trim()) issues.push(`${rel}: empty image alt text`);
      }
      if (html.includes('name="keywords"')) issues.push(`${rel}: unexpected keywords meta`);
      if (!html.includes('id="main"')) issues.push(`${rel}: no main landmark`);
      if (!html.includes('aria-label="Primary"')) issues.push(`${rel}: no primary nav`);
      if (!html.includes('rel="icon"')) issues.push(`${rel}: no favicon link`);
    }
  }
  walk(OUT);
  if (issues.length) {
    console.log(`SEO scan issues (${issues.length}):`);
    for (const issue of issues.slice(0, 50)) console.log("  " + issue);
  } else {
    console.log("SEO scan: every page has unique, correctly sized metadata; canonical, one H1, viewport, social tags, valid JSON-LD, image alt text, and nav/main landmarks.");
  }
}

main();
