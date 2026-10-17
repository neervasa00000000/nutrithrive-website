import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { PRODUCTS, REVIEWS, auSoloShippingRate, costNote, shippingCostNote } from "./js/data.js";

const PAYMENT_LINE = "PayPal or card online · pickup: cash, bank or PayID";
const PAYMENT_LINE_LONG =
  "Online: PayPal or card. Phone / Truganina pickup by arrangement: bank transfer, PayID or cash.";
const ADDRESS_LINE = "Ridley Place, Truganina VIC 3029";
const FREE_SHIP_ANNOUNCE = "Free AU shipping from $49 · Packed in Truganina, VIC";
const SHIPPING_BAND_LIST =
  "Australia standard shipping for orders under $49, by parcel weight: up to 250 g $9.69 · 251 to 500 g $11.12 · 501 g to 1 kg $15.20 · 1 to 3 kg $19.24 · 3 to 5 kg $23.23.";
import {
  decodeEntities,
  escapeAttr,
  extractQuotedAttr,
  fitMetaDescription,
  metaContent,
  pickSeoDescription,
} from "../scripts/lib/seo-meta.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE = path.join(ROOT, "site");
const OUT = __dirname;
const ASSET_VERSION = "20261018-gallery-2";
const PAYMENT_ASSET_VERSION = "20261017-1";
const CSS_ASSET_VERSION = "20261018-gallery-3";
const CART_CSS_ASSET_VERSION = "20261018-gallery-3";
const LIVE_MODE = process.env.STOREFRONT_PRODUCTION === "1";
const DESK_SEO = JSON.parse(fs.readFileSync(path.join(__dirname, "seo-desk-2026-10-15.json"), "utf8"));
function deskSeo(urlPath) {
  if (!urlPath) return {};
  return DESK_SEO[urlPath] || DESK_SEO[urlPath.endsWith("/") ? urlPath.slice(0, -1) : `${urlPath}/`] || {};
}
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
const RETENTION_SRC = LIVE_MODE ? "/assets/js/storefront/retention.js" : "/js/retention.js";
const RETENTION_PAGES_SRC = LIVE_MODE ? "/assets/js/storefront/retention-pages.js" : "/js/retention-pages.js";

function retentionFoot(extra = "") {
  const rates = LIVE_MODE
    ? `<script src="/assets/js/storefront/runtime-shipping-rates.js?v=${ASSET_VERSION}" defer></script>`
    : "";
  return `${rates}<script src="${RETENTION_SRC}?v=${ASSET_VERSION}" defer></script>${extra}`;
}

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
    privacy: "/privacy",
    shipping: "/shipping",
    article: (slug) => `/blog/${slug}`,
    articleAbs: (slug) => `${LIVE}/blog/${slug}`,
  };
}

function navItems() {
  const r = routes();
  return [
    { href: r.shop, label: "Shop" },
    { href: "/products/moringa-powder/", label: "Moringa powder" },
    { href: "/products/black-tea/", label: "Tea" },
    { href: "/products/curry-leaves/", label: "Curry Leaves" },
    { href: "/products/moringa-soap/", label: "Soap" },
    { href: "/products/gift-pack/", label: "Gifts" },
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
  "how-to-make-moringa-tea-recipes-2026",
  "moringa-brands-comparison-australia-2026",
  "moringa-vs-spirulina-vs-matcha-comparison-australia",
  "how-to-choose-moringa-powder-australia-2026",
  "moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026",
  "dried-curry-leaves-australia-guide",
  "cold-brew-darjeeling-australian-spring-2026",
  "darjeeling-tea-vs-english-breakfast-comparison-2026",
  "how-to-brew-darjeeling-tea-perfectly-2026",
  "moringa-soap-benefits-skin-guide",
];

// Search Console opportunity updates approved after reviewing the 7 September
// exports. Keep this explicit so every other ranking article continues to use
// its committed title, description and H1 during storefront migrations.
/** Moringa cluster posts with hand-tuned prose in site/blog — rebuild must keep SEO + JSON-LD. */
const MORINGA_CLUSTER_SEO_SLUGS = new Set([
  "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025",
  "how-to-choose-moringa-powder-australia-2026",
  "moringa-capsules-vs-powder-which-is-better-2026",
  "moringa-brands-comparison-australia-2026",
  "why-premium-moringa-costs-11-not-25-value-vs-markup-2026",
  "how-to-make-moringa-tea-recipes-2026",
  "verify-moringa-quality-premium-buyers-checklist-2026",
  "moringa-smoothie-recipes-australia-2026",
  "what-does-moringa-powder-taste-like-honest-guide-2026",
  "how-to-add-moringa-to-diet",
  "chemist-warehouse-greens-vs-moringa-powder-2026",
  "ag1-alternative-australia-moringa-comparison-2026",
  "rosabella-moringa-reviews-legit-or-overhyped-2026",
  "moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026",
  "moringa-patches-australia-review-do-they-work",
  "science-shade-drying-vs-sun-drying-moringa",
  "moringa-vs-spirulina-vs-matcha-comparison-australia",
  "where-to-buy-moringa-leaves-australia",
  "moringa-vs-curry-leaves-difference-australia",
]);

const ARTICLE_SEO_OVERRIDES = {
  "how-much-moringa-powder-per-day-dosage-guide": {
    title: "How Much Moringa Powder Per Day? Dose, Timing & Recipes",
    description: "Most adults need 1 to 2 level teaspoons of moringa powder a day. When to take it, how to start, taste tips and 3 easy recipes from a Melbourne grower.",
    h1: "How Much Moringa Should I Take a Day? A Teaspoon-by-Teaspoon Guide",
    ogTitle: "How Much Moringa Powder Per Day? Dose, Timing & Recipes",
    ogDescription: "Most adults need 1 to 2 level teaspoons of moringa powder a day. When to take it, how to start, taste tips and 3 easy recipes from a Melbourne grower.",
    articleSection: "Moringa",
    heroAlt: "Close-up of round green moringa leaves with water droplets on a thin stem",
    heroCaptionHtml: `<p class="article-hero-credit"><em>Photo: <a href="https://www.pexels.com/photo/healthy-fresh-green-leaves-of-drumstick-tree-with-morning-dew-in-lush-garden-4884816/" rel="noopener noreferrer" target="_blank">Nothing Ahead / Pexels</a></em></p>`,
    heroImage: "/assets/images/blog/hero-moringa-powder-per-day.webp",
    heroWidth: 1600,
    heroHeight: 900,
    ogImage: "/assets/images/blog/hero-moringa-powder-per-day.jpg",
    ogImageWidth: 1600,
    ogImageHeight: 900,
  },
  "waking-up-at-3am-every-night-australia-2026": {
    title: "Why Do I Wake Up at 3am and Can't Get Back to Sleep?",
    description: "Wake at 3am every night? Why early-morning waking is so common, the habits that make it worse, and what gets you back to sleep.",
    h1: "Waking Up at 3am Every Night? What's Going On and What Helps",
    ogTitle: "Why Do I Wake Up at 3am and Can't Get Back to Sleep?",
    ogDescription: "Why early-morning waking is so common in Australia, the habits that make it worse, and what actually helps you get back to sleep.",
    articleSection: "Sleep",
    ledeHtml: "You fall asleep fine, then your eyes snap open at 3am and your brain starts on tomorrow's to-do list. Here's why the early hours are the most common time to wake, the everyday habits that make it worse, and what actually gets you back to sleep.",
    heroAlt: "A bedside table at night with a lamp and a digital clock glowing in the early hours.",
    heroCaptionHtml: `<p class="article-hero-credit"><em>Photo: <a href="https://www.pexels.com/photo/a-lamp-shade-and-a-clock-on-the-bedside-table-6943418/" rel="noopener noreferrer" target="_blank">cottonbro studio / Pexels</a></em></p>`,
  },
  "diwali-hampers-australia": {
    title: "Diwali Hampers Australia 2026: Under $50, Delivered",
    description: "Diwali hampers from $20, posted Australia-wide. Compare hamper types and prices, a buying checklist, and order-by dates for Diwali on Sun 8 Nov 2026.",
    h1: "Diwali Hampers in Australia: Under-$50 Options, Prices and Order-By Dates",
    ogTitle: "Diwali Hampers in Australia: Under $50, Posted AU-Wide",
    ogDescription: "Hamper types, real price ranges, a $20 tea, curry leaf and soap box, and order-by dates so your Diwali hamper arrives before Sun 8 Nov.",
    articleSection: "Curry leaves",
    ledeHtml: "A buyer's guide to Diwali hampers in Australia: the main hamper types, what they cost, what to check before you pay, and when to order for Sunday 8 November.",
    heroAlt: "NutriThrive Diwali Gift Box items: Darjeeling black tea, dried curry leaves and moringa lavender soap",
    heroImage: "/assets/images/blog/diwali-hampers-australia-hero.webp",
    ogImage: "/assets/images/og/diwali-hampers-australia-1200.jpg",
  },
  "can-you-eat-green-sprouting-potatoes-australia-2026": {
    title: "Can You Eat Green or Sprouting Potatoes? The Safe Rule",
    description: "Green tinge or sprouts on your potatoes? When to peel and cut, when to bin, why cooking doesn't help, and how to store potatoes. Australian guide.",
    h1: "Can You Eat Green or Sprouting Potatoes? Here's the Safe Rule",
    ogTitle: "Is It Safe to Eat Green Potatoes If You Peel Them?",
    ogDescription: "Small green patch or a few sprouts? Cut away generously. Green all over or bitter? Bin it. Why cooking won't fix it, and how to store potatoes.",
    articleSection: "Wellness",
    ledeHtml: "You reach into the pantry and the potatoes have grown little shoots, or there's a green tinge under the skin. Do you peel, cut or bin them? Here's what the green actually means, how much is too much, and a simple rule for the bag in your cupboard.",
    heroAlt: "A woven basket piled high with unwashed potatoes",
    heroImage: "/assets/images/blog/green-potatoes-safe-to-eat-hero-1200.webp",
    ogImage: "/assets/images/og/green-potatoes-safe-to-eat-og-1200.jpg",
    heroCaptionHtml: `<p class="article-hero-credit"><em>Photo: Ellie Burgin / Pexels</em></p>`,
  },
  "eye-twitching-causes-magnesium-australia-2026": {
    title: "Why Does My Eye Keep Twitching? It's Probably Not Magnesium",
    description: "Eyelid twitching for days? Two studies found no magnesium link. What usually triggers it, what helps it settle, and when to see a GP in Australia.",
    h1: "Why Does My Eye Keep Twitching? It's Probably Not Magnesium",
    ogTitle: "Eye Twitching for Days? What Causes It and When to Worry",
    ogDescription: "It's probably not magnesium. Common triggers like sleep, screens and caffeine, what helps an eyelid twitch settle, and the signs worth a GP visit.",
    articleSection: "Wellness",
    ledeHtml: "Your eyelid has been flickering for days and the internet says you're low on magnesium. Two clinic studies checked, and the twitchers' blood levels were normal. Here's what usually sets it off, what calms it, and when to see a doctor.",
    heroAlt: "A man rubbing his eyes while sitting at a desk with a laptop",
    heroImage: "/assets/images/blog/eye-twitching-magnesium-hero-1200.webp",
    ogImage: "/assets/images/og/eye-twitching-magnesium-og-1200.jpg",
    heroCaptionHtml: `<p class="article-hero-credit"><em>Photo: Pexels</em></p>`,
  },
  "dried-curry-leaves-australia-guide": {
    title: "Curry Leaves at Woolworths, Coles & Aldi: Where to Buy",
    description: "Can you buy curry leaves at Woolworths, Coles or Aldi? What each listed in Oct 2026 (fresh punnets, dried packs), Indian grocers, online and storage tips.",
    h1: "Where to Buy Curry Leaves in Australia: Woolworths, Coles, Aldi and Online",
  },
  "darjeeling-black-tea-australia-guide": {
    title: "Where to Buy Darjeeling Tea in Australia (2026 Guide)",
    description: "Where to buy Darjeeling tea in Australia: Twinings at Coles and Woolworths, T2, specialist loose leaf and our 100g pouch, with prices per 100g (Oct 2026).",
    h1: "Where to Buy Darjeeling Tea in Australia (2026 Guide)",
  },
  "diwali-gift-guide-curry-leaves-tea-australia": {
    title: "Diwali Gift Ideas Australia 2026: Tea, Spice & Soap Gifts",
    description: "Diwali is Sun 8 Nov 2026. Tea, curry leaf and soap gift ideas, a ready Diwali gift box, small hampers and order-by dates for every state.",
    h1: "Diwali Gift Ideas Australia 2026: Tea, Spice & Soap Gifts",
  },
  "moringa-patches-australia-review-do-they-work": {
    title: "Glorenda & Healrize Moringa Patches: AU Reviews Checked",
    description: "Glorenda and Healrize moringa patch reviews checked: what the listings say and how a patch differs from leaf powder. We sell powder only, packed in Truganina.",
    h1: "Moringa Patches Australia (Then Leaf Powder)",
    ogTitle: "Glorenda & Healrize Moringa Patches: AU Reviews Checked",
    ogDescription: "Patch formats vs NutriThrive leaf powder for food and drinks — farm-grown, packed in Truganina.",
    articleSection: "Moringa",
  },
  "chemist-warehouse-greens-vs-moringa-powder-2026": {
    title: "Chemist Warehouse Greens vs Moringa Powder (Australia)",
    description: "Chemist Warehouse greens powders compared with plain moringa leaf powder: ingredients, format and cost, and when a single-ingredient pouch makes sense.",
    h1: "Chemist Warehouse Greens vs Moringa Powder",
    ogTitle: "Chemist Warehouse Greens vs Moringa Powder (Australia)",
    ogDescription: "Chemist Warehouse greens powders compared with plain moringa leaf powder: ingredients, format and cost, and when a single-ingredient pouch makes sense.",
    articleSection: "Moringa",
  },
  "curry-leaves-substitute-what-to-use-2026": {
    title: "Curry Leaf Substitute: What to Use in Australia",
    description: "Curry leaf substitute options in Australia: kaffir lime leaf, lemon zest, and when dried leaves beat every swap. Dried pouch $7. Free AU shipping from $49.",
    h1: "Curry Leaf Substitute Australia: When to Buy Dried Leaves Instead",
    ogTitle: "Curry Leaf Substitute: What to Use in Australia",
  },
  "curry-leaves-tea-how-to-make-benefits-2026": {
    title: "Curry Leaf Tea: How to Make It with Dried Leaves",
    description: "Make curry leaf tea from dried leaves: how many to use, steep time, pairings (ginger, lemon, honey) and how to store the pouch so it stays fragrant.",
    h1: "Curry Leaf Tea: How to Make It with Dried Leaves",
  },
  "grow-moringa-tree-australia": {
    title: "Grow or Buy a Moringa Tree in Australia (Perth, Melbourne)",
    description: "Where to buy a moringa tree or plant in Australia and how to grow it: in the ground in Perth or Brisbane, in a pot in Melbourne. We don't sell trees or seeds.",
    h1: "Grow or Buy a Moringa Tree in Australia: Perth, Melbourne and Pots",
  },
  "moringa-and-berberine-australia-what-science-says-2026": {
    title: "Moringa and Berberine Together (Australia 2026)",
    description: "Moringa leaf powder and berberine in Australia: what published science covers, product forms, and TGA food context, not medical advice. Ask your GP.",
    h1: "Moringa and Berberine Together (Australia 2026)",
  },
  "moringa-vs-ashwagandha-comparison-2026": {
    title: "Moringa vs Ashwagandha: Key Differences Explained",
    description: "Compare moringa and ashwagandha, including what they are, common uses, evidence limits, side effects and when to speak with a health professional.",
    h1: "Moringa vs Ashwagandha: Key Differences Explained",
  },
  "dried-curry-leaves-quality-guide-how-to-use": {
    title: "Dried Curry Leaves: How to Judge Quality & Get Real Flavour",
    description: "Dried curry leaves tasting of nothing? How to spot a good pack by colour and aroma, how many to use, how to bloom them in oil and store them in Australia.",
    h1: "Dried Curry Leaves That Actually Taste of Something: A Buyer's Guide",
  },
  "ag1-alternative-australia-moringa-comparison-2026": {
    title: "AG1 Alternative Australia: Moringa Powder vs AG1",
    description: "AG1 is a multi-ingredient greens scoop. NutriThrive is plain farm-grown moringa leaf powder: compare purpose and format, then buy the pouch that fits.",
    h1: "AG1 Alternative Australia: Plain Moringa vs AG1",
    ogTitle: "AG1 Alternative Australia: Moringa Powder vs AG1",
    ogDescription: "AG1 is a blend scoop. NutriThrive is single-ingredient moringa leaf powder: honest format comparison from Truganina.",
    articleSection: "Moringa",
  },
  "moringa-vs-curry-leaves-difference-australia": {
    title: "Moringa vs Curry Leaves: Not the Same Leaf (AU Cook's Guide)",
    description:
      "Moringa (drumstick, murungai keerai, malunggay) and curry leaves (kadi patta) are different plants. How to tell them apart and which one your recipe needs.",
    h1: "Moringa vs Curry Leaves: Two Different Leaves, and Which One Your Recipe Needs",
    ogTitle: "Moringa vs Curry Leaves: Not the Same Leaf (AU Cook's Guide)",
    ogDescription:
      "Moringa (drumstick, murungai keerai, malunggay) and curry leaves (kadi patta) are different plants. How to tell them apart and which one your recipe needs.",
    articleSection: "Moringa",
    ledeHtml:
      "Moringa leaves and curry leaves both turn up in South Indian, Sri Lankan and Filipino cooking, and both get called by several names, but they come from different plants and do different jobs in the pan. Here is how to tell them apart, a name decoder for both, and what to buy in Australia when you can't get fresh.",
    heroAlt:
      "NutriThrive 100g moringa powder beside a 30g pouch of dried curry leaves, each with a bowl of the ingredient in front",
    heroImage: "/assets/images/product_webp/moringa-curry-leaves-combo-main.webp",
    ogImage: "/assets/images/product_webp/moringa-curry-leaves-combo-main.webp",
  },
  "what-does-moringa-powder-taste-like-honest-guide-2026": {
    title: "What Does Moringa Powder Taste Like? (Honest AU Guide)",
    description: "Honest moringa powder taste notes: grassy leaf flavour, how to soften it in food and drinks, and 100g trial pouches from Truganina.",
    h1: "What Does Moringa Powder Taste Like?",
    ogTitle: "What Does Moringa Powder Taste Like?",
    ogDescription: "Grassy, green leaf powder — how it tastes plain, in smoothies and in savoury food, plus pouch sizes from Melbourne.",
    articleSection: "Moringa",
  },
  "how-to-add-moringa-to-diet": {
    title: "How to Use Moringa Powder in Everyday Food (AU)",
    description: "Add moringa leaf powder to dal, eggs, yoghurt, soups and dough with small spoon amounts. Pouch sizes packed in Truganina.",
    h1: "How to Add Moringa Powder to Everyday Food",
    ogTitle: "How to Use Moringa Powder in Everyday Food",
    ogDescription: "Practical kitchen uses for moringa leaf powder, with NutriThrive pouch sizes from Melbourne.",
    articleSection: "Moringa",
  },
  "moringa-smoothie-recipes-australia-2026": {
    title: "Moringa Powder Smoothie Recipes Australia (5 Easy Blends)",
    description: "Five moringa powder smoothie recipes with metric amounts, AU seasonal fruit and taste fixes. Farm-grown moringa from $11, shipped Australia-wide.",
    h1: "Moringa Powder Smoothie Recipes (Australia): 5 Easy Blends",
    ogTitle: "Moringa Powder Smoothie Recipes Australia (5 Easy Blends)",
    ogDescription: "Five moringa powder smoothie recipes with metric amounts, AU seasonal fruit and taste fixes. Farm-grown moringa from $11, shipped Australia-wide.",
    articleSection: "Moringa",
    ledeHtml: "Five moringa powder smoothie recipes with metric amounts, AU seasonal fruit and taste fixes. Farm-grown moringa from $11, shipped Australia-wide.",
    heroAlt: "Stone mortar filled with green moringa powder, for a moringa smoothie",
  },
  "moringa-avocado-toast-recipe-anti-inflammatory-breakfast-2026": {
    title: "Moringa Avocado Toast: A 5-Minute Breakfast Recipe",
    description: "Smashed avocado on toast with half a teaspoon of moringa leaf powder, lemon and salt. Ready in five minutes, with tips to keep the flavour mild.",
    h1: "Moringa Avocado Toast Recipe Australia — 5 Minutes",
    ogTitle: "Moringa Avocado Toast: A 5-Minute Breakfast Recipe",
  },
  "how-to-read-moringa-batch-codes-freshness": {
    title: "How to Read Moringa Batch Codes: A Freshness Check",
    description: "How to find the lot stamp on a moringa pouch, match it to the seller's lab paperwork, and spot the freshness red flags before you open it.",
    h1: "How to Read Moringa Batch Codes — Freshness Check AU",
    ogTitle: "How to Read Moringa Batch Codes: A Freshness Check",
  },
  "why-premium-moringa-costs-11-not-25-value-vs-markup-2026": {
    title: "Moringa Powder Price Australia (Dated $/100g)",
    description: "NutriThrive moringa powder prices as of 13 Oct 2026: 100g $11, 200g $22, 400g $40, with price per 100g. Free AU shipping from $49.",
    h1: "Moringa Powder Price in Australia (Dated List Prices)",
    ogTitle: "Moringa Powder Price Australia: Dated List Prices",
    ogDescription: "NutriThrive moringa powder prices as of 13 Oct 2026: 100g $11, 200g $22, 400g $40, with price per 100g. Free AU shipping from $49.",
    articleSection: "Moringa",
  },
  "high-protein-moringa-recipes-australia-2026": {
    title: "High-Protein Moringa Recipes Australia (Leaf Powder)",
    description: "High-protein moringa recipes Australia: ten meals and shakes with exact tsp leaf powder and 15–40g protein per serve.",
    h1: "High-Protein Moringa Recipes Australia (Leaf Powder)",
  },
  "science-shade-drying-vs-sun-drying-moringa": {
    title: "Shade-Dried vs Sun-Dried Moringa Powder (What to Check)",
    description: "How drying method shows up on labels and product pages. NutriThrive sun-dries leaf powder and packs in Truganina.",
    h1: "Shade-Dried vs Sun-Dried Moringa Powder",
    ogTitle: "Shade-Dried vs Sun-Dried Moringa Powder (What to Check)",
    ogDescription: "What sun-dried means for moringa leaf powder, what to ask any seller, and NutriThrive’s Truganina pack facts.",
    articleSection: "Moringa",
  },
  "natural-pre-workout-moringa-australia-2026": {
    title: "Moringa as a Natural Pre-Workout in Australia (2026)",
    description: "Natural pre-workout habit for Australia: moringa has no caffeine, kitchen mixes before training, start small with food. Soft powder CTA from Truganina.",
    h1: "Moringa as a Natural Pre-Workout in Australia (2026)",
  },
  "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025": {
    title: "Chemist Warehouse Moringa: Capsule Price per 100g vs Powder",
    description: "What Chemist Warehouse moringa costs per 100g of leaf, capsules vs tablets vs powder, dated Oct 2026. Leaf powder from $11/100g. Free AU shipping from $49.",
    h1: "Moringa at Chemist Warehouse: What's on the Shelf and What It Costs per 100g",
    ogTitle: "Chemist Warehouse Moringa: Capsule Price per 100g vs Powder",
    ogDescription: "What Chemist Warehouse moringa costs per 100g of leaf, capsules vs tablets vs powder, dated Oct 2026. Leaf powder from $11/100g. Free AU shipping from $49.",
    ledeHtml: "Chemist Warehouse mostly lists moringa as capsules and tablets, not loose powder. Here is what those bottles hold in grams of leaf, what that works out to per 100g, and where to buy leaf powder if you'd rather use a teaspoon.",
    articleSection: "Moringa",
  },
  "moringa-brands-comparison-australia-2026": {
    title: "Best Moringa Powder in Australia? How to Compare Brands",
    description: "No paid rankings. Compare moringa powder brands on ingredients, pack date, lab paperwork and price per 100g, plus what to check on iHerb and Amazon AU.",
    h1: "Best Moringa Powder Australia? (Facts-Only)",
    ogTitle: "Best Moringa Powder Australia: Facts-Only Brand Check",
    ogDescription: "Facts-only moringa brand scorecard for Australia, with iHerb and Amazon AU checks and NutriThrive pouch facts.",
    ledeHtml: "Compare AU moringa powders with a facts-only scorecard: ingredients, organic marks, CoA, pack location, plus iHerb and Amazon notes.",
    articleSection: "Moringa",
  },
  "moringa-capsules-vs-powder-which-is-better-2026": {
    title: "Moringa Capsules vs Powder in Australia: Cost & Format",
    description: "Capsules or loose leaf powder? A side-by-side format table, how to work out price per 100g, and when a 100g pouch of leaf powder ($11) suits you better.",
    h1: "Moringa Powder vs Capsules in Australia",
    ogTitle: "Moringa Powder vs Capsules Australia",
    ogDescription: "Capsules vs leaf powder as a shopping choice, with NutriThrive pouch sizes packed in Melbourne.",
    ledeHtml: "Moringa capsules vs leaf powder in Australia: format table, price-per-100g method, and NutriThrive pouch sizes from Truganina.",
    articleSection: "Moringa",
  },
  "rosabella-moringa-reviews-legit-or-overhyped-2026": {
    title: "Rosabella Moringa Reviews Australia: Powder Buy Path",
    description: "We do not sell Rosabella. Honest read on brand search intent, then NutriThrive farm-grown leaf powder sizes packed in Truganina.",
    h1: "Rosabella Moringa Reviews Australia (We Sell Powder)",
    ogTitle: "Rosabella Moringa Reviews Australia: Powder Buy Path",
    ogDescription: "Facts-only Rosabella search intent, then NutriThrive farm-grown moringa leaf powder from Truganina.",
    articleSection: "Moringa",
  },
  "how-to-brew-darjeeling-tea-perfectly-2026": {
    title: "How to Brew Darjeeling Tea: Temp, Time & Ratio (Loose Leaf)",
    description: "Brew Darjeeling loose leaf right: 85–95°C water, 3–4 min, 2–2.5 g per cup. Milk or not, iced and pot ratios, and where to buy in Australia.",
    h1: "How to Brew Darjeeling Tea: Temp, Time & Ratio (Loose Leaf)",
  },
  "moringa-vs-coffee-melbourne-energy-hack": {
    title: "Does Moringa Have Caffeine? Moringa vs Coffee Australia",
    description: "Does moringa leaf powder contain caffeine? No. Here's why it feels different from coffee, and how to stir a little into your morning cup without clumps.",
    h1: "Does Moringa Have Caffeine? Moringa vs Coffee Australia",
  },
  "how-to-choose-moringa-powder-australia-2026": {
    title: "Moringa Powder at Woolworths, Coles or Aldi? (Oct 2026)",
    description: "We checked Woolworths, Coles and Aldi for moringa powder. What's listed, what to read on the label, and where to order a 100g pouch online for $11.",
    h1: "How to Choose Moringa Powder in Australia (Woolworths, Coles & Online)",
    ogTitle: "Choose Moringa Powder in Australia: Woolworths, Coles, Online",
    ogDescription: "What Woolworths, Coles and Aldi show for moringa powder, plus online pouch sizes packed in Melbourne.",
    ledeHtml: "Woolworths, Coles and Aldi moringa powder checks, label tips, and farm-grown pouches from Truganina. Sizes 100g, 200g, 400g.",
    articleSection: "Moringa",
  },
  "where-to-buy-moringa-leaves-australia": {
    title: "Where to Buy Moringa Leaves in Australia (Fresh & Dried)",
    description: "Moringa leaves = drumstick leaves = malunggay. Where to find fresh, frozen and dried leaves in Australia, what Woolworths lists, and the easy powder swap.",
    h1: "Where to Buy Moringa Leaves in Australia: Fresh, Frozen, Dried or Powder",
    ogTitle: "Moringa (Drumstick) Leaves in Australia: Where to Buy",
    ogDescription: "Fresh, frozen, dried or powder: where Australians find moringa leaves, a names table (malunggay, murungai, sahjan) and a powder swap guide.",
    ledeHtml: "Drumstick leaves, malunggay, murungai, sahjan: same leaf, many names. Where each format turns up in Australia, and how to swap powder into the dishes you already cook.",
    articleSection: "Moringa",
  },
  "verify-moringa-quality-premium-buyers-checklist-2026": {
    title: "Farm-Grown vs Certified Moringa Powder: What to Check",
    description: "What a certification label does and doesn't tell you, and how to check farm-grown moringa leaf powder: origin, drying, batch date and lab paperwork.",
    h1: "Organic vs Farm-Grown Moringa Powder in Australia",
    ogTitle: "Farm-Grown vs Certified Moringa Powder: What to Check",
    ogDescription: "What a certification label does and doesn't tell you, and how to check farm-grown moringa leaf powder: origin, drying, batch date and lab paperwork.",
    articleSection: "Moringa",
  },
  "how-to-make-moringa-tea-recipes-2026": {
    title: "How to Make Moringa Tea from Powder (AU Guide)",
    description: "Make moringa tea from leaf powder: basic cup, iced jar and warm milk methods, plus pouch sizes packed in Truganina, Melbourne.",
    h1: "How to Make Moringa Tea from Powder (Australia)",
    ogTitle: "How to Make Moringa Tea from Powder",
    ogDescription: "DIY moringa tea methods using leaf powder, with NutriThrive pouch sizes from Melbourne.",
    articleSection: "Moringa",
  },
  "moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026": {
    title: "Moringa Heavy Metals Lab Testing Australia (CoA Guide)",
    description: "What to ask before you buy moringa powder: heavy metals, batch CoA, and how NutriThrive links an NMI lab summary from Truganina packing.",
    h1: "Moringa Heavy Metals & Lab Testing in Australia",
    ogTitle: "Moringa Heavy Metals Lab Testing Australia (CoA Guide)",
    ogDescription: "CoA checklist for moringa powder in Australia, plus NutriThrive’s NMI lab summary from Truganina packing.",
    articleSection: "Moringa",
  },
  "is-moringa-worth-it-cost-value-australia-2026": {
    title: "Is Moringa Worth It? Cost-Per-Nutrient Breakdown for Australians",
  },
  "moringa-soap-benefits-skin-guide": {
    title: "Moringa Soap Australia: $7 Bar, Not a Skin Treatment",
    description: "Moringa soap, $7 for a 95g bar. Moringa soap benefits for skin mean a plain wash, not a treatment. Free AU shipping from $49.",
    h1: "Moringa Soap Australia: $7 Bar, Not a Skin Treatment",
  },
  "how-long-does-moringa-powder-last-storage-shelf-life-2026": {
    title: "Does Moringa Powder Expire? Shelf Life and Storage",
    description: "Does moringa powder expire? Shelf life, storage tips for Australia, signs it has gone off, and when to restock from $11.",
    h1: "Does Moringa Powder Expire? Shelf Life, Storage, and When to Buy",
    ogTitle: "Does Moringa Powder Expire? Shelf Life and Storage",
  },
  "darjeeling-tea-vs-english-breakfast-comparison-2026": {
    title: "Darjeeling vs English Breakfast Tea: Taste, Caffeine, Price",
    description: "Darjeeling vs English Breakfast: flavour, strength, caffeine, milk or not, and cost per cup. Plus where to buy Darjeeling loose leaf in Australia.",
    h1: "Darjeeling vs English Breakfast Tea: Taste, Caffeine, Price",
  },
  "moringa-vs-whey-protein-comparison-2026": {
    title: "Moringa vs Whey Protein Australia: Not a Whey Substitute",
    description: "Moringa leaf powder is not a whey replacement. Compare protein per serve, then see how a teaspoon fits into a shake you already make at home.",
    h1: "Moringa vs Whey Protein Australia: Not a Whey Substitute",
  },
  "moringa-before-after-workout-timing-guide-2026": {
    title: "Moringa Before or After Workout? Timing Guide (AU)",
    description: "Moringa before or after workout? Timing is habit, not performance. Leaf powder 100g $11, 200g $22, 400g $40. Free AU shipping from $49.",
    h1: "Moringa Before or After Workout? Timing Guide (AU)",
  },
  "how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026": {
    title: "Darjeeling Tea Caffeine: mg per Cup vs Coffee & Green Tea",
    description: "How much caffeine is in Darjeeling tea? Per-cup ranges vs coffee, green and English Breakfast, FSANZ daily guidance, and how to brew a lighter cup.",
    h1: "Darjeeling Tea Caffeine: mg per Cup vs Coffee & Green Tea",
  },
  "curry-leaves-recipes-beyond-dal": {
    title: "How to Use Dried Curry Leaves: 6 Recipes Beyond Dal",
    description: "How to cook with dried curry leaves: tadka basics, how many to use, and 6 recipes from lemon rice to curry leaf oil. Dried 30g pouch, packed in Melbourne.",
    h1: "How to Use Dried Curry Leaves: 6 Recipes Beyond Dal",
  },
  "moringa-vs-spirulina-vs-matcha-comparison-australia": {
    title: "Moringa vs Spirulina vs Matcha Powder (Australia)",
    description: "Three green powders side by side: taste, typical use, and when single-ingredient moringa leaf powder fits. Farm-grown NutriThrive from Melbourne.",
    h1: "Moringa vs Spirulina vs Matcha (Australia)",
    ogTitle: "Moringa vs Spirulina vs Matcha Powder (Australia)",
    ogDescription: "Taste and kitchen-use comparison of moringa, spirulina and matcha — NutriThrive sells moringa leaf powder only.",
    articleSection: "Moringa",
  },
  "curry-leaves-vs-curry-powder-difference-explained-2026": {
    title: "Curry Leaves vs Curry Powder: Different Things, Not Swaps",
    description: "Curry leaves and curry powder aren't interchangeable. What each is, when to use them, how many dried leaves equal fresh, and where to buy in Australia.",
    h1: "Curry Leaves vs Curry Powder: Different Things, Not Swaps",
  },
  "moringa-wellness-shot-recipe-winter-2026": {
    title: "Moringa Shot Recipe: A Small Drink You Mix at Home",
    description: "A short recipe for a small moringa drink you mix at home with lemon and ginger. We sell the leaf powder only: 100g, 200g or 400g pouches.",
    h1: "Moringa Shot Recipe Australia: Powder You Mix, Not a Shot We Sell",
    ogTitle: "Moringa Shot Recipe: A Small Drink You Mix at Home",
  },
  "what-does-aust-l-mean-supplement-label-australia-2026": {
    title: "What Does AUST L Mean? Food Powder vs Listed Medicines (AU)",
    description: "AUST L marks a listed medicine on the ARTG, not a quality stamp. Here's what it means, what it doesn't, and how food powders are labelled differently.",
    h1: "What Does AUST L Mean? Food Powder vs Listed Medicines (AU)",
  },
  "fibre-deficiency-australia-bowel-cancer-risk-2026": {
    title: "Fibre Deficiency in Australia and Bowel Cancer Risk",
    ogTitle: "Fibre Deficiency in Australia and Bowel Cancer Risk",
  },
  "gut-brain-connection-digestion-mood-mental-health-2026": {
    title: "The Gut-Brain Connection: How Digestion Affects Mood",
    ogTitle: "The Gut-Brain Connection: How Digestion Affects Mood",
  },
  "how-to-age-well-in-your-40s-healthy-ageing-australia-2026": {
    title: "How to Age Well in Your 40s: Habits for Your 60s",
    ogTitle: "How to Age Well in Your 40s: Habits for Your 60s",
  },
  "how-to-build-balanced-plate-no-calorie-counting-2026": {
    title: "Build a Balanced Plate Without Counting Calories",
    ogTitle: "Build a Balanced Plate Without Counting Calories",
  },
  "longevity-foods-australia-what-to-eat-live-longer-2026": {
    title: "Longevity Foods: What Australians Should Eat Daily",
    ogTitle: "Longevity Foods: What Australians Should Eat Daily",
  },
  "omega-3-deficiency-australia-inflammation-food-sources-2026": {
    title: "Omega-3 Deficiency in Australia: Signs and Food Sources",
    ogTitle: "Omega-3 Deficiency in Australia: Signs and Food Sources",
  },
  "is-moringa-safe-for-children-kids-dosage-2026": {
    description: "Is moringa safe for kids in Australia? Age-by-age powder doses, babies vs children, GP checkpoints, and food-level leaf use, with free AU shipping from $49.",
  },
  "moringa-with-vitamin-c-iron-absorption-guide-2026": {
    description: "How to pair moringa leaf powder with vitamin-C foods for plant iron absorption in Australian kitchens. Food guidance, then Shop moringa powder.",
  },
};

const JOURNAL_REDIRECTS = {
  "is-moringa-safe-during-pregnancy-2026": "moringa-pregnancy-safe-australia-trimester-guide-2026",
  "moringa-smoothie-recipes-australia-easy-2026": "moringa-smoothie-recipes-australia-2026",
  "stress-weight-gain-cortisol-mechanism-what-to-do-2026": "moringa-calm-mind-stress-brain-fog-cortisol-science-2026",
  "vitamin-d-deficiency-australia-sunny-country-paradox-2026": "vitamin-d-deficiency-australia-abs-sunny-country-2026",
  "iron-deficiency-australian-women-abs-real-numbers-2026": "iron-deficiency-australian-women-symptoms-plant-based-sources-2026",
  "moringa-soap-benefits-for-skin-2026": "moringa-soap-benefits-skin-guide",
  "curry-leaves-in-australian-cooking-how-to-use-2026": "curry-leaves-recipes-beyond-dal",
  "fresh-vs-dried-curry-leaves-cooking-comparison-2026": "dried-curry-leaves-australia-guide",
  "moringa-soap-vs-regular-soap-comparison-2026": "moringa-soap-benefits-skin-guide",
  "how-to-read-a-soap-ingredient-label": "moringa-soap-benefits-skin-guide",
  "moringa-for-anxiety-stress-evidence-2026": "moringa-calm-mind-stress-brain-fog-cortisol-science-2026",
  "cortisol-cocktail-trend-explained-moringa-2026": "moringa-calm-mind-stress-brain-fog-cortisol-science-2026",
  "best-time-to-take-moringa-powder-morning-or-night-2026": "moringa-before-after-workout-timing-guide-2026",
  "how-much-caffeine-safe-per-day-australia-fsanz-2026": "how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026",
  "curry-leaves-heart-health-cholesterol-evidence-2026": "curry-leaves-health-benefits-what-the-evidence-says-2026",
  "darjeeling-black-tea-australia-first-flush-second-flush-guide-2026": "darjeeling-black-tea-australia-guide",
  "cold-brew-darjeeling-australian-spring-2026": "darjeeling-black-tea-australia-guide",
  "darjeeling-chai-latte-recipe-winter-coffee-alternative-2026": "darjeeling-black-tea-australia-guide",
  "darjeeling-tea-coffee-replacement-honest-assessment-2026": "darjeeling-black-tea-australia-guide",
  "darjeeling-tea-health-benefits-research-2026": "darjeeling-black-tea-australia-guide",
  "can-you-drink-darjeeling-tea-every-day-2026": "darjeeling-black-tea-australia-guide",
  "is-moringa-worth-it-cost-value-australia-2026": "why-premium-moringa-costs-11-not-25-value-vs-markup-2026",
  "moringa-30-day-challenge-honest-results": "how-to-add-moringa-to-diet",
  "moringa-energy-bites-kids-lunchbox-recipe-australia-2026": "moringa-smoothie-recipes-australia-2026",
  "moringa-energy-what-happens-week-by-week-2026": "how-to-add-moringa-to-diet",
  "moringa-face-mask-australia-glow-ritual": "moringa-soap-benefits-skin-guide",
  "natural-pre-workout-moringa-australia-2026": "moringa-before-after-workout-timing-guide-2026",
  "morning-routine-health-tips-australia-2026": "how-to-add-moringa-to-diet",
};

// Retired seasonal articles that now lead directly to a product rather than
// another article. Keep them out of blog feeds, search and ItemList schema.
const JOURNAL_EXTERNAL_REDIRECTS = {
  "fathers-day-gift-under-40": "/products/gift-pack/",
};

const REDIRECTED_JOURNAL_SLUGS = new Set(
  [...fs.readFileSync(path.join(SITE, "_redirects"), "utf8").matchAll(/^\/blog\/([^\s/*.]+)\s+\S+\s+30[1278]!?(?:\s|$)/gm)]
    .map((match) => match[1])
);

const CURATED_RELATED = {
  "eye-twitching-causes-magnesium-australia-2026": [
    "why-always-tired-nutritional-deficiencies-australia-2026",
    "waking-up-at-3am-every-night-australia-2026",
    "how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026",
  ],
  "waking-up-at-3am-every-night-australia-2026": [
    "moringa-for-sleep-quality-insomnia-2026",
    "why-always-tired-nutritional-deficiencies-australia-2026",
    "signs-magnesium-deficiency-australia-what-to-eat-2026",
  ],
  "moringa-patches-australia-review-do-they-work": [
    "moringa-brands-comparison-australia-2026",
    "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025",
    "rosabella-moringa-reviews-legit-or-overhyped-2026",
  ],
  "verify-moringa-quality-premium-buyers-checklist-2026": [
    "how-to-choose-moringa-powder-australia-2026",
    "science-shade-drying-vs-sun-drying-moringa",
    "how-to-read-moringa-batch-codes-freshness",
  ],
  "why-premium-moringa-costs-11-not-25-value-vs-markup-2026": [
    "moringa-capsules-vs-powder-which-is-better-2026",
    "moringa-brands-comparison-australia-2026",
    "verify-moringa-quality-premium-buyers-checklist-2026",
  ],
  "rosabella-moringa-reviews-legit-or-overhyped-2026": [
    "moringa-brands-comparison-australia-2026",
    "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025",
    "verify-moringa-quality-premium-buyers-checklist-2026",
  ],
  "moringa-brands-comparison-australia-2026": [
    "how-to-choose-moringa-powder-australia-2026",
    "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025",
    "verify-moringa-quality-premium-buyers-checklist-2026",
  ],
  "how-to-add-moringa-to-diet": [
    "moringa-smoothie-recipes-australia-2026",
    "what-does-moringa-powder-taste-like-honest-guide-2026",
    "high-protein-moringa-recipes-australia-2026",
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
  "what-does-moringa-powder-taste-like-honest-guide-2026": [
    "how-to-add-moringa-to-diet",
    "moringa-smoothie-recipes-australia-2026",
    "how-to-choose-moringa-powder-australia-2026",
  ],
  "moringa-capsules-vs-powder-which-is-better-2026": [
    "how-to-choose-moringa-powder-australia-2026",
    "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025",
    "how-to-add-moringa-to-diet",
  ],
  "how-to-choose-moringa-powder-australia-2026": [
    "verify-moringa-quality-premium-buyers-checklist-2026",
    "science-shade-drying-vs-sun-drying-moringa",
    "moringa-capsules-vs-powder-which-is-better-2026",
  ],
  "where-to-buy-moringa-leaves-australia": [
    "how-to-choose-moringa-powder-australia-2026",
    "grow-moringa-tree-australia",
    "what-does-moringa-powder-taste-like-honest-guide-2026",
  ],
  "moringa-vs-curry-leaves-difference-australia": [
    "where-to-buy-moringa-leaves-australia",
    "curry-leaves-vs-curry-powder-difference-explained-2026",
    "curry-leaves-substitute-what-to-use-2026",
  ],
  "moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026": [
    "verify-moringa-quality-premium-buyers-checklist-2026",
    "how-to-choose-moringa-powder-australia-2026",
    "moringa-brands-comparison-australia-2026",
  ],
  "moringa-smoothie-recipes-australia-2026": [
    "what-does-moringa-powder-taste-like-honest-guide-2026",
    "how-to-add-moringa-to-diet",
    "how-long-does-moringa-powder-last-storage-shelf-life-2026",
  ],
  "natural-pre-workout-moringa-australia-2026": [
    "moringa-before-after-workout-timing-guide-2026",
    "how-to-add-moringa-to-diet",
    "moringa-vs-coffee-melbourne-energy-hack",
  ],
  "dried-curry-leaves-australia-guide": [
    "dried-curry-leaves-quality-guide-how-to-use",
    "curry-leaves-recipes-beyond-dal",
    "curry-leaves-substitute-what-to-use-2026",
  ],
  "dried-curry-leaves-quality-guide-how-to-use": [
    "dried-curry-leaves-australia-guide",
    "curry-leaves-recipes-beyond-dal",
    "curry-leaves-substitute-what-to-use-2026",
  ],
  "how-to-brew-darjeeling-tea-perfectly-2026": [
    "darjeeling-black-tea-australia-guide",
    "darjeeling-tea-vs-english-breakfast-comparison-2026",
    "how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026",
  ],
  "darjeeling-black-tea-australia-guide": [
    "how-to-brew-darjeeling-tea-perfectly-2026",
    "darjeeling-tea-vs-english-breakfast-comparison-2026",
    "how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026",
  ],
  "moringa-soap-benefits-skin-guide": [
    "how-to-choose-moringa-powder-australia-2026",
    "what-does-moringa-powder-taste-like-honest-guide-2026",
  ],
};

// Conversion paths for the ten pages already earning meaningful Search Console
// clicks. These keep the next step aligned with the reader's query instead of
// repeating one generic sales message across every guide.
// Moringa blog → PDP conversion (13 Oct 2026). Prices read from PRODUCTS; never hardcode.
const shortMoney = (n) => `$${Number.isInteger(Number(n)) ? Number(n) : Number(n).toFixed(2)}`;
const MORINGA_PRICES = (() => {
  const p = (id) => PRODUCTS.find((x) => x.id === id)?.price;
  const p100 = p("moringa-powder");
  const p200 = p("moringa-200g");
  const p400 = p("moringa-400g");
  const curry = p("curry-leaves");
  const tea = p("black-tea");
  return {
    p100: shortMoney(p100),
    p200: shortMoney(p200),
    p400: shortMoney(p400),
    per100In200: shortMoney(p200 / 2),
    per100In400: shortMoney(p400 / 4),
    twoBy400: shortMoney(p400 * 2),
    curry: shortMoney(curry),
    tea: shortMoney(tea),
    exampleBasket: shortMoney(p400 * 2 + p100),
  };
})();
const MORINGA_SALES_SLUGS = new Set([
  "moringa-patches-australia-review-do-they-work",
  "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025",
  "moringa-brands-comparison-australia-2026",
  "rosabella-moringa-reviews-legit-or-overhyped-2026",
  "how-to-choose-moringa-powder-australia-2026",
  "ag1-alternative-australia-moringa-comparison-2026",
  "how-long-does-moringa-powder-last-storage-shelf-life-2026",
  "moringa-vs-coffee-melbourne-energy-hack",
  "science-shade-drying-vs-sun-drying-moringa",
  "moringa-vs-whey-protein-comparison-2026",
  "moringa-capsules-vs-powder-which-is-better-2026",
  "what-does-moringa-powder-taste-like-honest-guide-2026",
  "how-to-add-moringa-to-diet",
  "moringa-smoothie-recipes-australia-2026",
  "high-protein-moringa-recipes-australia-2026",
  "how-to-make-moringa-tea-recipes-2026",
  "moringa-wellness-shot-recipe-winter-2026",
]);
const LAB_PDF = "/documents/nutrithrive-lab-report-summary.pdf";
const CALC_SLUGS = new Set([
  "moringa-capsules-vs-powder-which-is-better-2026",
  "why-premium-moringa-costs-11-not-25-value-vs-markup-2026",
  "rosabella-moringa-reviews-legit-or-overhyped-2026",
  "moringa-brands-comparison-australia-2026",
  "ag1-alternative-australia-moringa-comparison-2026",
  "how-to-choose-moringa-powder-australia-2026",
]);
function per100Calculator(slug) {
  const id = `nt-calc-${slug}`;
  return `<aside class="article-calc" aria-label="Price per 100g calculator">
  <p class="kicker">Check any pack in 10 seconds</p>
  <p><strong>What does your current pack cost per 100g?</strong> Type the shelf price and the leaf grams from the label. For capsules, enter mg per capsule and the capsule count instead of grams.</p>
  <form id="${id}" onsubmit="return false">
    <label>Price ($) <input name="price" type="number" min="0" step="0.01" inputmode="decimal"></label>
    <label>Grams of leaf <input name="grams" type="number" min="0" step="1" inputmode="decimal"></label>
    <label>or mg per capsule <input name="mg" type="number" min="0" step="1" inputmode="decimal"></label>
    <label>× capsules <input name="caps" type="number" min="0" step="1" inputmode="decimal"></label>
    <output aria-live="polite"></output>
  </form>
  <p class="calc-ours">Ours: ${MORINGA_PRICES.p100} per 100g (100g pouch) · ${MORINGA_PRICES.per100In400} per 100g in the 400g pouch. <a href="/products/moringa-powder/" data-funnel-event="article_calc_product_click" data-article="${esc(slug)}">Compare sizes</a></p>
  <script>(function(){var f=document.getElementById(${JSON.stringify(id)});if(!f)return;var o=f.querySelector("output");function n(x){var v=parseFloat(x.value);return v>0?v:0;}function u(){var p=n(f.price),g=n(f.grams);if(!g&&n(f.mg)&&n(f.caps)){g=n(f.mg)*n(f.caps)/1000;}o.textContent=p&&g?"That pack: $"+(p/g*100).toFixed(2)+" per 100g of leaf ("+g.toFixed(0)+"g).":"";if(p&&g&&window.gtag){window.gtag("event","article_calc_used",{article:${JSON.stringify(slug)}});}}f.addEventListener("change",u);f.addEventListener("input",u);})();</script>
</aside>`;
}
const OBJECTION_BLOCKS = {
  trust: `<p><strong>Who packs your pouch.</strong> NutriThrive is a small Melbourne family business run by founder Neer Vasa. Our moringa leaf is farm-grown and sun-dried, then packed in Truganina, VIC. We publish an <a href="${LAB_PDF}">NMI lab summary (PDF)</a>. We are not certified, and we say so.</p>`,
  price: `<p><strong>Compare on price per 100g of leaf.</strong> Capsule labels list the leaf weight per capsule. Multiply it by the capsule count to get grams, then work out the price per 100g. Our leaf powder is ${MORINGA_PRICES.p100} per 100g, ${MORINGA_PRICES.per100In200} per 100g in the 200g pouch and ${MORINGA_PRICES.per100In400} per 100g in the 400g pouch.</p>`,
  taste: `<p><strong>What it tastes like, honestly.</strong> Earthy and green, a bit like spinach, with a slightly bitter finish. Most people don't drink it with plain water. Stir ½ to 1 tsp into a smoothie, dal, soup or scrambled eggs and the taste blends into the food. Not sure yet? <a href="/products/moringa-powder/100g/">Start with the 100g pouch for ${MORINGA_PRICES.p100}</a>.</p>`,
  use: `<p><strong>Three easy ways to use it.</strong></p><ol><li>Blend ½ tsp into a banana smoothie.</li><li>Stir it into dal or soup at the end of cooking.</li><li>Whisk ½ tsp into warm milk with a little honey.</li></ol>`,
  stock: `<p><strong>Stock up for the week.</strong> 400g moringa ${MORINGA_PRICES.p400} plus <a href="/products/curry-leaves/">dried curry leaves ${MORINGA_PRICES.curry}</a> for dal and tadka. Trying moringa first? <a href="/products/moringa-powder/100g/">100g is ${MORINGA_PRICES.p100}</a>.</p>`,
  fresh: `<p><strong>How to check it's fresh.</strong> Look for a bright olive-green colour, a fresh grassy smell and a pack or batch date on the label. Store it sealed, cool and dark. <a href="/blog/how-to-read-moringa-batch-codes-freshness">How to read our batch codes</a>.</p>`,
};
const MORINGA_OBJECTIONS = {
  "moringa-patches-australia-review-do-they-work": ["trust"],
  "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025": ["price", "trust"],
  "moringa-brands-comparison-australia-2026": ["trust"],
  "rosabella-moringa-reviews-legit-or-overhyped-2026": ["trust"],
  "how-to-choose-moringa-powder-australia-2026": ["fresh", "trust"],
  "ag1-alternative-australia-moringa-comparison-2026": ["price", "use"],
  "how-long-does-moringa-powder-last-storage-shelf-life-2026": ["fresh", "trust"],
  "moringa-vs-coffee-melbourne-energy-hack": ["taste", "use"],
  "science-shade-drying-vs-sun-drying-moringa": ["trust", "fresh"],
  "moringa-vs-whey-protein-comparison-2026": ["price", "use"],
  "moringa-capsules-vs-powder-which-is-better-2026": ["price"],
  "what-does-moringa-powder-taste-like-honest-guide-2026": ["taste"],
  "how-to-add-moringa-to-diet": ["use"],
  "moringa-smoothie-recipes-australia-2026": ["stock", "trust"],
  "high-protein-moringa-recipes-australia-2026": ["stock", "trust"],
  "how-to-make-moringa-tea-recipes-2026": ["taste", "stock"],
  "moringa-wellness-shot-recipe-winter-2026": ["stock", "trust"],
};
function moringaMidCta(slug) {
  return `<aside class="article-mid-cta" aria-label="Shop moringa powder"><p><strong>Ready to try it?</strong> Leaf powder 100g ${MORINGA_PRICES.p100} · 200g ${MORINGA_PRICES.p200} · 400g ${MORINGA_PRICES.p400} (best value, ${MORINGA_PRICES.per100In400}/100g). Farm-grown, sun-dried, NMI lab summary, packed in Truganina. Free AU shipping from $49.</p><p class="btn-row"><a class="btn btn-primary" href="/products/moringa-powder/" data-funnel-event="article_mid_product_click" data-article="${esc(slug)}" data-product="moringa-400g">Choose your pouch</a> <a class="btn btn-secondary" href="/products/moringa-powder/100g/" data-funnel-event="article_mid_trial_click" data-article="${esc(slug)}" data-product="moringa-powder">Try 100g for ${MORINGA_PRICES.p100}</a></p></aside>`;
}
function stripMidCtas(html) {
  return String(html).replace(/<aside class="article-mid-cta"[\s\S]*?<\/aside>/g, "");
}
function withMidCta(html, block) {
  let n = 0;
  let placed = false;
  const out = stripMidCtas(html).replace(/<h2\b/g, (m) => {
    n += 1;
    if (n === 2 && !placed) {
      placed = true;
      return `${block}${m}`;
    }
    return m;
  });
  return placed ? out : `${stripMidCtas(html)}${block}`;
}
const ARTICLE_CONVERSION_PATHS = {
  "eye-twitching-causes-magnesium-australia-2026": {
    kicker: "A practical next step",
    title: "Farm-grown moringa leaf powder",
    body: "NutriThrive products are foods, not treatments for eye twitching. If leaf powder already belongs in your kitchen, pouch sizes start at $11 with free AU shipping from $49.",
    cta: "View moringa powder",
    links: [
      ["Why am I always tired? Nutritional causes", "why-always-tired-nutritional-deficiencies-australia-2026"],
      ["Waking up at 3am every night", "waking-up-at-3am-every-night-australia-2026"],
    ],
  },
  "waking-up-at-3am-every-night-australia-2026": {
    kicker: "If nutrition is part of the picture",
    title: "Magnesium-rich leaf powder for everyday meals",
    body: "Moringa is not a sleep tablet. Some people use it as a food source of magnesium and iron when deficiency is part of their fatigue or sleep story. Read the sleep evidence first, then decide whether a food-level powder fits.",
    cta: "View moringa powder",
    links: [
      ["Moringa for sleep: what the evidence shows", "moringa-for-sleep-quality-insomnia-2026"],
      ["Signs of magnesium deficiency", "signs-magnesium-deficiency-australia-what-to-eat-2026"],
    ],
  },
  "moringa-patches-australia-review-do-they-work": {
    kicker: "After the patch comparison",
    title: "Compare with single-ingredient moringa powder",
    body: "Check the ingredient, Australian testing summary, pouch sizes and current price before deciding which format suits you.",
    cta: "View powder and testing",
    links: [["Compare capsule prices per 100g", "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025"]],
    methodology: true,
  },
  "how-long-does-moringa-powder-last-storage-shelf-life-2026": {
    kicker: "Choose for your routine",
    title: "Choose a pouch size you can keep fresh",
    body: "Compare 100g, 200g and 400g options, then store the pouch sealed in a cool, dry place away from humidity.",
    cta: "Compare moringa sizes",
    links: [["How to read a NutriThrive batch code", "how-to-read-moringa-batch-codes-freshness"]],
  },
  "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025": {
    kicker: "A Chemist Warehouse alternative",
    title: "Plain moringa leaf powder, priced per 100g",
    body: "Farm-grown leaf powder, sun-dried, NMI lab summary on the product page, packed in Truganina.",
    cta: "View moringa powder",
    links: [
      ["Woolworths and Coles moringa powder", "how-to-choose-moringa-powder-australia-2026"],
      ["Moringa powder vs capsules", "moringa-capsules-vs-powder-which-is-better-2026"],
    ],
  },
  "is-moringa-safe-for-children-kids-dosage-2026": {
    kicker: "Safety before shopping",
    title: "Check the product details with your health professional",
    body: "Read the ingredient, testing and safety information first. Ask a GP or paediatrician before giving a concentrated powder to a child.",
    cta: "View product details",
    links: [["Read moringa side effects and cautions", "moringa-side-effects-what-happens-take-too-much-2026"]],
  },
  "grow-moringa-tree-australia": {
    kicker: "While your tree grows",
    title: "Use farm-grown moringa leaf powder",
    body: "A moringa tree takes time to establish. Our powder is grown on our farm, sun-dried and packed in Truganina.",
    cta: "See farm-grown moringa",
    links: [["How sun-drying affects moringa", "science-shade-drying-vs-sun-drying-moringa"]],
  },
  "moringa-and-berberine-australia-what-science-says-2026": {
    kicker: "Check interactions first",
    title: "Review the single-ingredient product information",
    body: "NutriThrive moringa powder does not contain berberine. Check the ingredient and testing information, and speak with your pharmacist or GP about interactions.",
    cta: "View product details",
    links: [["Read moringa side effects and cautions", "moringa-side-effects-what-happens-take-too-much-2026"]],
  },
  "rosabella-moringa-reviews-legit-or-overhyped-2026": {
    kicker: "Compare before buying",
    title: "Compare with a single-ingredient powder",
    body: "Check NutriThrive's ingredient, cost per 100g, pouch sizes and Australian testing summary alongside the review evidence.",
    cta: "Shop moringa powder",
    links: [["Powder versus capsules explained", "moringa-capsules-vs-powder-which-is-better-2026"]],
    methodology: true,
  },
  "moringa-brands-comparison-australia-2026": {
    kicker: "Compare our product",
    title: "See exactly what is in the NutriThrive pouch",
    body: "Review the ingredient, origin, current price, available testing summary and sizes without relying on a brand claim alone.",
    cta: "View powder and testing",
    links: [["Use the moringa quality checklist", "verify-moringa-quality-premium-buyers-checklist-2026"]],
    methodology: true,
  },
  "science-shade-drying-vs-sun-drying-moringa": {
    kicker: "See the finished product",
    title: "Try our sun-dried moringa powder",
    body: "Our moringa is grown on our family farm in Gujarat, sun-dried to keep its colour, then ground and packed in Truganina.",
    cta: "See sun-dried moringa",
    links: [["What to check when choosing moringa", "how-to-choose-moringa-powder-australia-2026"]],
  },
  "how-to-add-moringa-to-diet": {
    kicker: "Use it in these mixes",
    title: "NutriThrive Moringa Powder",
    body: "Leaf powder grown on our family farm in Gujarat and packed in Truganina for everyday food mixing. Free AU shipping from $49.",
    cta: "Shop moringa powder",
    links: [
      ["What does moringa powder taste like?", "what-does-moringa-powder-taste-like-honest-guide-2026"],
      ["High-protein moringa recipes Australia", "high-protein-moringa-recipes-australia-2026"],
    ],
  },
  "how-to-make-moringa-tea-recipes-2026": {
    kicker: "For these cups",
    title: "Shop moringa powder for tea and lattes",
    body: "Sun-dried leaf powder for lemon tea, ginger cups, and the paste-first latte. Packed in Truganina. Free AU shipping from $49.",
    cta: "Shop moringa powder",
    links: [
      ["What moringa powder tastes like", "what-does-moringa-powder-taste-like-honest-guide-2026"],
      ["How to add moringa to your diet", "how-to-add-moringa-to-diet"],
    ],
  },
  "what-does-moringa-powder-taste-like-honest-guide-2026": {
    kicker: "Ready to try it",
    title: "See current sizes and pricing",
    body: "If the taste tips sound workable, compare the 100g, 200g and 400g pouches packed in Truganina.",
    cta: "View current sizes and pricing",
    links: [["How to mix moringa into food", "how-to-add-moringa-to-diet"]],
  },
  "moringa-capsules-vs-powder-which-is-better-2026": {
    kicker: "Prefer powder?",
    title: "Compare our leaf powder sizes",
    body: "NutriThrive sells single-ingredient leaf powder, not capsules. Check sizes, price and the Australian lab summary.",
    cta: "See the moringa powder sizes",
    links: [["How to choose moringa powder in Australia", "how-to-choose-moringa-powder-australia-2026"]],
  },
  "diwali-hampers-australia": {
    kicker: "A practical next step",
    title: "Diwali Gift Box",
    body: "Sending a few? Three boxes come to $60 and ship free Australia-wide.",
    cta: "Choose your Diwali Gift Boxes",
  },
  "how-to-choose-moringa-powder-australia-2026": {
    kicker: "Apply the checklist",
    title: "Our farm-grown moringa powder",
    body: "Grown on our farm, sun-dried, NMI lab-tested in Australia and packed in Truganina. Start at $11 for 100g.",
    cta: "our moringa powder",
    links: [["Use the eight-point quality checklist", "verify-moringa-quality-premium-buyers-checklist-2026"]],
    methodology: true,
  },
  "where-to-buy-moringa-leaves-australia": {
    kicker: "Prefer powder to hunting for leaves?",
    title: "Our moringa leaf powder",
    body: "Grown on our farm, sun-dried, NMI lab-tested in Australia and packed in Truganina. Start at $11 for 100g.",
    cta: "Shop moringa powder",
    links: [["Ways to use moringa powder in everyday food", "how-to-add-moringa-to-diet"]],
    methodology: true,
  },
  "moringa-vs-curry-leaves-difference-australia": {
    kicker: "Keep both in the pantry",
    title: "Moringa powder, from $11",
    body: "Sun-dried leaf powder packed in Truganina. Dried curry leaves are $7, or both come together in the $17 combo.",
    cta: "Shop moringa powder",
    links: [
      ["Where to buy moringa leaves in Australia", "where-to-buy-moringa-leaves-australia"],
      ["Curry leaf substitute guide", "curry-leaves-substitute-what-to-use-2026"],
    ],
  },
  "moringa-smoothie-recipes-australia-2026": {
    kicker: "For these recipes",
    title: "NutriThrive Moringa Powder",
    body: "Leaf powder grown on our family farm in Gujarat and packed in Truganina for the smoothies above. Stock the pouch.",
    cta: "Shop moringa powder",
    links: [["What moringa powder tastes like", "what-does-moringa-powder-taste-like-honest-guide-2026"]],
  },
  "natural-pre-workout-moringa-australia-2026": {
    kicker: "Soft next step",
    title: "Shop moringa powder",
    body: "Sun-dried leaf for kitchen mixes before training. Free AU shipping from $49. Packed in Truganina.",
    cta: "Shop moringa powder",
    links: [
      ["How to add moringa to your diet", "how-to-add-moringa-to-diet"],
      ["Before or after workout timing", "moringa-before-after-workout-timing-guide-2026"],
    ],
  },
  "dried-curry-leaves-australia-guide": {
    kicker: "Ready for the pantry",
    title: "Dried curry leaves from our farm",
    body: "Keep a pouch in the pantry. 30g of whole dried curry leaves for $7. Add Darjeeling tea or a handmade soap to reach free shipping from $49.",
    cta: "Get dried curry leaves",
    links: [["Curry leaf recipes beyond dal", "curry-leaves-recipes-beyond-dal"]],
  },
  "dried-curry-leaves-quality-guide-how-to-use": {
    kicker: "After the crush test",
    title: "Dried curry leaves from our farm",
    body: "Whole leaflets, dried and packed in small batches in Truganina. Crush-test a leaf when your pack arrives.",
    cta: "Shop dried curry leaves",
    links: [["Dried curry leaves buy and store guide", "dried-curry-leaves-australia-guide"]],
  },
  "how-to-brew-darjeeling-tea-perfectly-2026": {
    kicker: "Brew what you buy",
    title: "Darjeeling loose leaf from a family farm",
    body: "100g of Darjeeling black tea, packed in Truganina. Use the brew times from this guide with the pouch you order.",
    cta: "Shop Darjeeling black tea",
    links: [["Darjeeling buying and brewing guide", "darjeeling-black-tea-australia-guide"]],
  },
  "darjeeling-black-tea-australia-guide": {
    kicker: "Shop the tea",
    title: "Order Darjeeling black tea in Australia",
    body: "Try a lighter, floral cup. 100g of Darjeeling loose leaf makes about 50 cups for $7.50.",
    cta: "Shop Darjeeling tea",
    links: [["How to brew Darjeeling tea", "how-to-brew-darjeeling-tea-perfectly-2026"]],
  },
  "moringa-soap-benefits-skin-guide": {
    kicker: "See the bar",
    title: "Handmade moringa soap from Truganina",
    body: "A $7 handmade lavender soap bar made by us in Australia. Read the ingredient list and compare it with regular soap before you buy.",
    cta: "Shop handmade soap",
    links: [["Moringa oil for skin and hair", "moringa-oil-benefits-skin-hair-health-2026"]],
  },
  "moringa-oil-benefits-skin-hair-health-2026": {
    kicker: "Prefer a bar wash?",
    title: "Handmade lavender soap bar from Truganina",
    body: "A $7 handmade soap with moringa leaf and lavender. Separate from oil — this is a rinse-off bar, packed in Melbourne.",
    cta: "Shop handmade soap",
    links: [["Handmade soap Australia guide", "handmade-soap-australia-melt-and-pour-guide"]],
  },
  "diwali-gift-guide-curry-leaves-tea-australia": {
    kicker: "Ready Diwali hamper",
    title: "Diwali gift box — tea, curry leaves & soap",
    body: "Darjeeling tea, dried curry leaves from our farm and a handmade moringa soap, packed together in Truganina. Ready to give for Diwali.",
    cta: "Shop Diwali gift box",
    links: [
      ["Where to buy dried curry leaves", "dried-curry-leaves-australia-guide"],
      ["How to brew Darjeeling tea", "how-to-brew-darjeeling-tea-perfectly-2026"],
    ],
  },
};

function journalTopic(article) {
  if (article.slug === "moringa-vs-curry-leaves-difference-australia") return "Moringa guides";
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
  if (article.slug === "diwali-gift-guide-curry-leaves-tea-australia" || article.slug === "diwali-hampers-australia") {
    return PRODUCTS.find((p) => p.id === "diwali-gift-box");
  }
  const topic = journalTopic(article);
  if (topic === "Curry leaves") return PRODUCTS.find((p) => p.id === "curry-leaves");
  if (topic === "Darjeeling tea") return PRODUCTS.find((p) => p.id === "black-tea");
  if (topic === "Soap & skin") return PRODUCTS.find((p) => p.id === "moringa-soap");
  // Powder articles deep-link the main 400g offer URL, not the 100g size path.
  return PRODUCTS.find((p) => p.id === "moringa-400g");
}

function journalCta(article, product) {
  if (article.slug === "fathers-day-gift-under-40") return "Shop Gift Pack, $35";
  if (article.slug === "diwali-gift-guide-curry-leaves-tea-australia" || article.slug === "diwali-hampers-australia") return "Shop Diwali gift box";
  if (article.slug === "curry-leaves-substitute-what-to-use-2026") return "Shop dried curry leaves";
  if (article.slug === "dried-curry-leaves-quality-guide-how-to-use") return "Shop dried curry leaves";
  if (article.slug === "how-to-brew-darjeeling-tea-perfectly-2026") return "Shop Darjeeling black tea";
  if (article.slug === "moringa-soap-benefits-skin-guide") return "Shop moringa lavender soap bar";
  const topic = journalTopic(article);
  if (topic === "Curry leaves") return "Get curry leaves";
  if (topic === "Darjeeling tea") return "Try Darjeeling tea";
  if (topic === "Soap & skin") return "Shop moringa lavender soap bar";
  // Powder articles use one stable, purchase-clear CTA. Several manual SEO/CRO
  // fixes were previously lost because rebuilds regenerated weaker labels.
  if (product?.id === "moringa-powder" || product?.id === "moringa-200g" || product?.id === "moringa-400g") {
    return "Shop moringa powder";
  }
  return "Shop moringa powder";
}

const PRODUCT_GUIDES = {
  "moringa-powder": [
    ["How to choose moringa powder", "how-to-choose-moringa-powder-australia-2026"],
    ["How shade-drying compares with sun-drying", "science-shade-drying-vs-sun-drying-moringa"],
    ["Eight checks before you buy", "verify-moringa-quality-premium-buyers-checklist-2026"],
    ["Moringa capsules versus powder", "moringa-capsules-vs-powder-which-is-better-2026"],
    ["Chemist Warehouse moringa versus NutriThrive powder", "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025"],
    ["How to take moringa powder", "how-to-add-moringa-to-diet"],
    ["What moringa powder tastes like", "what-does-moringa-powder-taste-like-honest-guide-2026"],
    ["How to store moringa powder", "how-long-does-moringa-powder-last-storage-shelf-life-2026"],
    ["Moringa vs curry leaves", "moringa-vs-curry-leaves-difference-australia"],
  ],
  "curry-leaves": [
    ["Where to buy curry leaves in Australia", "dried-curry-leaves-australia-guide"],
    ["How to judge dried curry leaf quality", "dried-curry-leaves-quality-guide-how-to-use"],
    ["Curry leaf substitutes in Australia", "curry-leaves-substitute-what-to-use-2026"],
    ["Curry leaf recipes beyond dal", "curry-leaves-recipes-beyond-dal"],
    ["30-minute curry leaf dal recipe", "curry-leaves-dahl-recipe-30-minutes-australia-2026"],
    ["Moringa vs curry leaves", "moringa-vs-curry-leaves-difference-australia"],
  ],
  "black-tea": [
    ["Darjeeling black tea buying guide", "darjeeling-black-tea-australia-guide"],
    ["How to brew Darjeeling tea", "how-to-brew-darjeeling-tea-perfectly-2026"],
    ["Darjeeling versus English Breakfast", "darjeeling-tea-vs-english-breakfast-comparison-2026"],
    ["Darjeeling caffeine vs coffee", "how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026"],
    ["Diwali gift ideas Australia 2026", "diwali-gift-guide-curry-leaves-tea-australia"],
  ],
  "moringa-soap": [
    ["Handmade soap Australia guide", "handmade-soap-australia-melt-and-pour-guide"],
    ["Moringa oil for skin and hair", "moringa-oil-benefits-skin-hair-health-2026"],
    ["Diwali gift ideas Australia 2026", "diwali-gift-guide-curry-leaves-tea-australia"],
  ],
  "moringa-soap-combo": [
    ["Handmade soap Australia guide", "handmade-soap-australia-melt-and-pour-guide"],
    ["How to choose moringa powder", "how-to-choose-moringa-powder-australia-2026"],
    ["How to take moringa powder", "how-to-add-moringa-to-diet"],
    ["Diwali gift ideas Australia 2026", "diwali-gift-guide-curry-leaves-tea-australia"],
  ],
  "gift-pack": [
    ["Diwali gift ideas Australia 2026", "diwali-gift-guide-curry-leaves-tea-australia"],
    ["How to brew Darjeeling tea", "how-to-brew-darjeeling-tea-perfectly-2026"],
    ["Curry leaf recipes beyond dal", "curry-leaves-recipes-beyond-dal"],
    ["Darjeeling buying guide", "darjeeling-black-tea-australia-guide"],
  ],
  "diwali-gift-box": [
    ["Diwali gift ideas Australia 2026", "diwali-gift-guide-curry-leaves-tea-australia"],
    ["Diwali hampers in Australia", "diwali-hampers-australia"],
    ["Where to buy dried curry leaves", "dried-curry-leaves-australia-guide"],
    ["Darjeeling buying guide", "darjeeling-black-tea-australia-guide"],
    ["How to brew Darjeeling tea", "how-to-brew-darjeeling-tea-perfectly-2026"],
  ],
  "combo-pack": [
    ["How to choose moringa powder", "how-to-choose-moringa-powder-australia-2026"],
    ["How shade-drying compares with sun-drying", "science-shade-drying-vs-sun-drying-moringa"],
    ["Eight checks before you buy", "verify-moringa-quality-premium-buyers-checklist-2026"],
    ["Moringa capsules versus powder", "moringa-capsules-vs-powder-which-is-better-2026"],
    ["How to take moringa powder", "how-to-add-moringa-to-diet"],
    ["What moringa powder tastes like", "what-does-moringa-powder-taste-like-honest-guide-2026"],
    ["How to store moringa powder", "how-long-does-moringa-powder-last-storage-shelf-life-2026"],
    ["Moringa vs curry leaves", "moringa-vs-curry-leaves-difference-australia"],
  ],
};

function productGuideLinks(slug) {
  const r = routes();
  const guides = PRODUCT_GUIDES[slug] || PRODUCT_GUIDES["moringa-powder"];
  return guides.map(([label, articleSlug]) => `<li><a href="${r.article(articleSlug)}">${esc(label)}</a></li>`).join("");
}

function growthProductBody(slug) {
  return {"curry-leaves": "<section><h2>Dried kadi patta vs fresh curry leaves</h2><p>Our 30g pack contains dried whole curry leaves. Fresh supermarket punnets are smaller and contain water, so compare the format as well as the pack weight.</p></section><details><summary>Do you sell curry leaf powder?</summary><p>We sell whole dried leaves only, not curry leaf powder.</p></details><p>Shopping for Diwali (Sunday 8 November)? See our <a href=\"/blog/diwali-hampers-australia\">Diwali hampers in Australia</a>, <a href=\"/blog/gifts-for-tea-lovers-australia\">gifts for tea lovers under $20</a>, <a href=\"/blog/diwali-gifts-for-friends-curry-leaf-snacks\">Diwali gifts for friends</a> and the <a href=\"/products/diwali-gift-box/\">Diwali gift box</a>. Order by late October for delivery before Diwali.</p>", "diwali-gift-box": "<section><h2>Diwali gifts Australia: what's in the box</h2><p>Darjeeling loose leaf tea 100g, whole dried curry leaves 30g and a handmade lavender soap bar 95g, packed in Truganina for $20.</p></section><details><summary>Do you ship Diwali gift boxes Australia-wide?</summary><p>Yes. We ship Australia-wide, with free shipping on orders from $49. Order by late October for Diwali; delivery timing depends on your postcode.</p></details><details><summary>Is this a good Indian gift box for friends?</summary><p>It brings together Darjeeling tea, curry leaves from our family farm in Gujarat and soap handmade in Australia. Check your friend’s preferences before choosing.</p></details>", "gift-pack": "<section><h2>Tea gift set Australia</h2><p>Our $35 gift pack includes 100g Darjeeling tea, 30g dried curry leaves, a 95g handmade soap bar and 100g moringa powder.</p></section><details><summary>Is there a Darjeeling tea gift box?</summary><p>Yes. Choose this four-product gift pack or the $20 Diwali Gift Box with tea, curry leaves and soap.</p></details><section><h2>Handmade soap gift set</h2><p>Each gift pack includes a moringa and lavender soap bar we handmake in Australia.</p></section>", "black-tea": "<section><h2>Loose leaf tea Melbourne (Truganina pickup by arrangement)</h2><p>Our Darjeeling black tea comes in a 100g pack. Order online for delivery or contact us to arrange pickup from Ridley Place, Truganina VIC 3029.</p></section>", "moringa-soap": "<section><h2>Handmade soap Melbourne</h2><p>We handmake our moringa and lavender soap in Australia and pack orders in Truganina. Arrange local pickup or order for delivery.</p></section>"}[slug] || "";
}

function faqDetails(faqs) {
  return faqs
    .map(([q, a]) => {
      const body = a && typeof a === "object" && a.html ? a.html : esc(a);
      return `<details><summary>${esc(q)}</summary><p>${body}</p></details>`;
    })
    .join("");
}

const DIWALI_GROWTH_LINKS = "<p>Shopping for Diwali (Sunday 8 November)? See our <a href=\"/blog/diwali-hampers-australia\">Diwali hampers in Australia</a>, <a href=\"/blog/gifts-for-tea-lovers-australia\">gifts for tea lovers under $20</a>, <a href=\"/blog/diwali-gifts-for-friends-curry-leaf-snacks\">Diwali gifts for friends</a> and the <a href=\"/products/diwali-gift-box/\">Diwali gift box</a>. Order by late October for delivery before Diwali.</p>";
const FSANZ_PENDING = "<div data-pending=\"fsanz-approval\" hidden><p>In November 2025 FSANZ decided moringa leaf and powder are not permitted as a food or food ingredient for retail sale in Australia. Read the <a href=\"https://www.foodstandards.gov.au/food-standards-code/applications/application-a1294-moringa-oleifera-novel-food\" rel=\"noopener\">FSANZ notice</a>.</p></div>";

const TEA_REVIEW_NAME = "Mai Anh Trần Thúy";
const MORINGA_FEATURED_REVIEW_NAMES = [
  "Siv Mey",
  "Priyankari Nath",
];

function moringaEducationHtml() {
  return `<section class="pdp-overview" aria-labelledby="why-nutrithrive-moringa">
    <h2 id="why-nutrithrive-moringa">What's in the pouch, and where it's from</h2>
    <p>100% moringa leaf, grown on our family farm in Gujarat and sun-dried. No fillers or blends. Packed in Truganina, VIC.</p>
  </section>`;
}

function esc(s) {
  return escapeAttr(s);
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

function googleReviewsSection() {
  const starIcons = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 3.6 14.5 9l6 .6-4.6 4 1.4 5.9L12 16.8 6.7 19.5 8.1 13.6 3.5 9.6l6-.6L12 3.6Z"/></svg>'.repeat(5);
  const reviews = REVIEWS.filter((review) => review.name !== TEA_REVIEW_NAME).slice(0, 2);
  return `<section class="section" id="reviews">
  <div class="wrap">
    <div class="reviews-head">
      <span class="stars">${starIcons}</span>
      <span class="reviews-score">4.9 · Google reviews</span>
    </div>
    <div class="review-grid review-scroll" aria-label="Google reviews">
      ${reviews.map(
        (r) => `<blockquote class="review-card"><p title="${esc(r.text)}">“${esc(r.text)}”</p><div class="review-meta"><strong>${esc(r.name)}</strong>Verified Google review</div></blockquote>`
      ).join("")}
    </div>
    <p class="review-disclosure">From our Google Business Profile.</p>
    <p style="margin-top:16px"><a href="https://maps.app.goo.gl/9VQVEUQSeGm4XfGB7">See all reviews</a></p>
  </div>
</section>`;
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
  if (p.id === "moringa-powder") return "/products/moringa-powder/100g/";
  if (p.id === "moringa-200g") return "/products/moringa-powder/200g/";
  if (p.id === "moringa-400g") return "/products/moringa-powder/";
  return p.href;
}

const MORINGA_SIZE_PAGES = {
  "100g": {
    variantId: "moringa-powder",
    title: "Moringa Powder 100g Australia | $11 | NutriThrive",
    description:
      "Buy NutriThrive moringa powder 100g for $11. Sun-dried, NMI lab tested, packed in Truganina. Free AU shipping from $49.",
    h1: "Moringa Powder 100g",
  },
  "200g": {
    variantId: "moringa-200g",
    title: "Moringa Powder 200g Australia | $22 | NutriThrive",
    description:
      "Buy NutriThrive moringa powder 200g for $22. Sun-dried, NMI lab tested, packed in Truganina. Free AU shipping from $49.",
    h1: "Moringa Powder 200g",
  },
};

function powderSizePageData(sizeSlug) {
  const size = MORINGA_SIZE_PAGES[sizeSlug];
  if (!size) return null;
  const base = PDP["moringa-powder"];
  const variant = PRODUCTS.find((item) => item.id === size.variantId);
  const gallery = [
    [variant.image, `${variant.name} ${variant.variant}`],
    ...base.gallery.filter(([src]) => src !== variant.image),
  ];
  return {
    ...base,
    title: size.title,
    description: size.description,
    h1: size.h1,
    forceSeo: true,
    defaultVariantId: size.variantId,
    canonicalPath: `/products/moringa-powder/${sizeSlug}/`,
    seoCanonicalPath: "/products/moringa-powder/",
    gallery,
  };
}

function productCard(p, priority = false, opts = {}) {
  const was =
    !opts.hideWas && p.was && p.was > p.price ? ` <s>${money(p.was)}</s>` : "";
  const href = shopHref(p);
  const cardImage = {
    "/assets/images/photos/compressed/moringa-powder-200g-main-square.webp": "/assets/images/photos/compressed/moringa-powder-200g-main-square-card-640.webp",
    "/assets/images/product_webp/moringa-powder-400g-bundle-main.webp": "/assets/images/product_webp/moringa-powder-400g-bundle-main-card-640.webp",
    "/assets/images/product_webp/dried-curry-leaves-30g-main.webp": "/assets/images/product_webp/dried-curry-leaves-30g-main-card-640.webp",
  }[p.image];
  const responsive = cardImage
    ? `srcset="${cardImage} 640w, ${cardImage.replace("-card-640", "-card-960")} 960w, ${p.image} 1254w" sizes="(max-width: 760px) 70vw, 25vw"`
    : "";
  return `<article class="product-card">
    <a class="product-card-media" href="${href}" aria-label="${esc(p.name)} ${esc(p.variant)}">
      <img src="${p.image}" ${responsive ? `${responsive} ` : ""}alt="${esc(p.name)} ${esc(p.variant)} product" width="1254" height="1254" ${priority ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}>
    </a>
    <div class="product-card-body">
      <h3><a href="${href}" style="color:inherit;text-decoration:none">${esc(opts.title || p.name)}</a></h3>
      ${opts.showVariant ? `<p class="product-card-variant">${esc(p.variant)}</p>` : ""}
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
ORG_SCHEMA.description =
  "NutriThrive is a farmer and manufacturer. We grow moringa and curry leaves on our own farm, source tea from a Darjeeling family farm, handmake moringa soap in Australia, and pack orders in Truganina, Melbourne.";

function absUrl(p) {
  if (!p) return OG_IMAGE;
  if (p.startsWith("http")) return p;
  return `${LIVE}${p.startsWith("/") ? p : `/${p}`}`;
}

const gitDateCache = new Map();
function gitFileDates(rel) {
  if (gitDateCache.has(rel)) return gitDateCache.get(rel);
  let published = "";
  let modified = "";
  try {
    const added = execFileSync("git", ["log", "--diff-filter=A", "--format=%as", "--", rel], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim().split("\n").filter(Boolean);
    published = added.at(-1) || "";
    modified = execFileSync("git", ["log", "-1", "--format=%as", "--", rel], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    published = "";
    modified = "";
  }
  const value = { published, modified };
  gitDateCache.set(rel, value);
  return value;
}

function sourcePageDateModified() {
  return gitFileDates("storefront/build.mjs").modified;
}

function pageDateFields() {
  const dateModified = sourcePageDateModified();
  return dateModified ? { dateModified } : {};
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

function fitPageDescription(value) {
  return fitMetaDescription(humanCopy(stripTags(value)));
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

function extractSeo(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const html = fs.readFileSync(filePath, "utf8");
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1];
  const description = metaContent(html, "description");
  const robotsTag = html.match(/<meta[^>]*name=["']robots["'][^>]*>/i)?.[0] || "";
  const robots = extractQuotedAttr(robotsTag, "content");
  const canonicalTag = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i)?.[0]
    || html.match(/<link[^>]*href=["'][^"']+["'][^>]*rel=["']canonical["'][^>]*>/i)?.[0]
    || "";
  const canonical = extractQuotedAttr(canonicalTag, "href");
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
  const description = metaContent(html, "description");
  const canonicalTag = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i)?.[0]
    || html.match(/<link[^>]*href=["'][^"']+["'][^>]*rel=["']canonical["'][^>]*>/i)?.[0]
    || "";
  const canonical = extractQuotedAttr(canonicalTag, "href");
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
  seoCanonicalPath,
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
  ogTitle,
  ogDescription,
}) {
  const r = routes();
  const refined = !/^\/(blog|journal)(\/|$)/.test(canonicalPath);
  const canonical = `${LIVE}${canonicalPath}`;
  const seoCanonical = `${LIVE}${seoCanonicalPath || canonicalPath}`;
  const image = ogImage ? absUrl(ogImage) : OG_IMAGE;
  const seoTitle = preserveTitle ? title : fitSeoTitle(title);
  const seoDescription = preserveDescription ? description : fitPageDescription(description);
  const ogTitleFinal = ogTitle || seoTitle;
  const ogDescriptionFinal = ogDescription || seoDescription;
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
  const footerNote = LIVE_MODE
    ? `<a href="${r.privacy}">Privacy policy</a>`
    : `<a href="${r.privacy}">Privacy policy</a>. This is a design preview, not the live store.`;

  return `<!DOCTYPE html>
<html lang="en-AU"${LIVE_MODE ? ' data-nt-live="1"' : ""}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(seoTitle)}</title>
  <meta name="description" content="${esc(seoDescription)}">
  <meta name="robots" content="${esc(robotsContent)}">
  <link rel="canonical" href="${esc(seoCanonical)}">
  <meta name="geo.region" content="AU-VIC">
  <meta name="geo.placename" content="Truganina, Melbourne VIC">
  <meta name="geo.position" content="-37.8323773;144.7187983">
  <meta name="ICBM" content="-37.8323773, 144.7187983">
  <meta property="og:type" content="${esc(ogType)}">
  <meta property="og:url" content="${esc(seoCanonical)}">
  <meta property="og:title" content="${esc(ogTitleFinal)}">
  <meta property="og:description" content="${esc(ogDescriptionFinal)}">
  <meta property="og:image" content="${esc(image)}">
  <meta property="og:image:secure_url" content="${esc(image)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="${canonicalPath === "/blog/how-much-moringa-powder-per-day-dosage-guide" ? ogImageWidth : 1200}">
  <meta property="og:image:height" content="${canonicalPath === "/blog/how-much-moringa-powder-per-day-dosage-guide" ? ogImageHeight : 630}">
  <meta property="og:image:alt" content="${esc(seoTitle)}">
  <meta property="og:locale" content="en_AU">
  <meta property="og:site_name" content="NutriThrive Australia">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(ogTitleFinal)}">
  <meta name="twitter:description" content="${esc(ogDescriptionFinal)}">
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
<body${refined ? ' class="storefront-refined"' : ""}>
<a class="skip-link" href="#main">Skip to content</a>
${refined ? `<div class="announce">Free AU shipping from $49 · Packed in Truganina</div>` : `<div class="announce"><span class="announce-full"><a href="/products/diwali-gift-box/">Diwali Gift Box $20</a>: tea, curry leaves and soap · <a href="/blog/diwali-gift-guide-curry-leaves-tea-australia">Gift guide</a> · ${FREE_SHIP_ANNOUNCE}</span><span class="announce-short"><a href="/products/diwali-gift-box/">Diwali Gift Box $20</a> · Free AU shipping from $49</span></div>`}
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
        <li><a href="/products/moringa-soap/">Handmade soap</a></li>
        <li><a href="/products/diwali-gift-box/">Diwali Gift Box</a></li>
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
${refined ? "" : `<div class="footer-newsletter">${newsletterBlock}</div>`}
  </div>
  <div class="wrap footer-base">
    <span>ABN 32 639 442 616 · ${ADDRESS_LINE}</span>
    <span>${footerNote}</span>
  </div>
</footer>
${welcomeOffer}
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
  if (process.env.STOREFRONT_PAGES_ONLY === "1" && /^(blog|journal)\//.test(rel)) return;
  // Preserve existing HOLD articles during the October growth pass.
  if (/^(?:blog|journal)\//.test(rel) && /health|pregnan|children|kids|dogs?|medical|blood|thyroid|cholesterol|pcos|menopause|anxiety|stress|gut|weight|sleep|iron|vitamin|magnesium|cortisol|berberine|inflamm|workout|pre-workout|side-effects|safe-for|diabet|allerg|medicat|liver|kidney|breast|detox|fertil|hormone|immune|dosage|powder-per-day|benefits-for-women|deficien/i.test(rel) && fs.existsSync(path.join(destRoot, rel))) return;
  html = applyLivePaths(html);
  const file = path.join(destRoot, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const cacheBusted = html.replace(
    /(src|href)="(\/assets\/[^"?#]+)(?:\?[^"#]*)?"/g,
    (_match, attribute, assetPath) => {
      const version = assetPath.includes("/assets/css/storefront-system")
        ? (rel === "pages/shop/cart.html" ? CART_CSS_ASSET_VERSION : CSS_ASSET_VERSION)
        : assetPath === "/assets/js/storefront/payment-page.js" ||
            assetPath === "/assets/js/storefront/payment-page.min.js"
          ? PAYMENT_ASSET_VERSION
        : ASSET_VERSION;
      return `${attribute}="${assetPath}?v=${version}"`;
    }
  );
  fs.writeFileSync(file, cacheBusted);
}

function homepage() {
  const featured = ["moringa-powder", "curry-leaves", "black-tea", "moringa-soap"].map(id => PRODUCTS.find(p => p.id === id));
  const liveSeo = LIVE_MODE ? extractSeo(path.join(SITE, "index.html")) : null;
  const desk = deskSeo("/");
  return layout({
    title: desk.title || liveSeo?.title || "NutriThrive: Lab-tested moringa from Melbourne",
    description:
      desk.description ||
      liveSeo?.description ||
      "Sun-dried moringa leaf powder, tested in Australia and packed in Truganina. From $11/100g. Same-day Melbourne dispatch.",
    canonicalPath: "/",
    current: "",
    preserveTitle: Boolean(desk.title || liveSeo?.title),
    preserveDescription: Boolean(desk.description || liveSeo?.description),
    robots: liveSeo?.robots || undefined,
    extraHead: `<link rel="preload" as="image" href="/assets/images/product_webp/moringa-powder-100g-main.webp" fetchpriority="high">
  ${jsonLd(websiteSchema())}
  ${jsonLd({ "@context": "https://schema.org", "@type": "WebPage", "@id": `${LIVE}/#webpage`, url: `${LIVE}/`, name: "NutriThrive", isPartOf: { "@id": `${LIVE}/#website` }, ...pageDateFields() })}`,
    main: `
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <p class="kicker">The NutriThrive collection</p>
      <h1>${esc(deskSeo("/").h1 || "Pure moringa. Nothing unnecessary.")}</h1>
      <p class="lede">Farm-grown moringa and curry leaves. Darjeeling tea. Handmade soap. Thoughtful gifts. Packed with care in Truganina, Melbourne.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="/products/">Shop the collection</a>
        <a class="text-link" href="/products/moringa-powder/">Explore moringa →</a>
      </div>
      <p class="purchase-note">Moringa from $11 · Curry leaves $7 · Tea $7.50 · Soap $7</p>
    </div>
    <div class="hero-collection" aria-label="Explore NutriThrive products">
      ${featured.map((product, index) => `<a class="hero-collection-item" href="${product.href}"><img src="${product.image}" alt="${esc(product.name)}" width="600" height="600" ${index === 0 ? 'fetchpriority="high"' : 'loading="eager"'}><span>${esc(product.name)} <small>${index === 0 ? "From " : ""}${money(product.price).replace(/\.00$/, "")}</small></span></a>`).join("")}
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="section-head">
      <div>
        <h2>Shop everyday favourites</h2>
      </div>
      <a href="/shop/">Shop all</a>
    </div>
    <div class="product-grid product-scroll" aria-label="Featured product range">${featured.map((product, index) => productCard(product, index === 0, { title: product.id === "moringa-powder" ? "Moringa Powder 100g" : product.id === "moringa-200g" ? "Moringa Powder 200g" : "" })).join("")}</div>

  </div>
</section>
<section class="section home-feature"><div class="wrap home-feature-grid">
  <a class="home-feature-image" href="/products/gift-pack/"><img src="/assets/images/product_webp/nutrithrive-four-product-gift-pack-main.webp" alt="NutriThrive gift pack with moringa, tea, curry leaves and soap" width="900" height="900" loading="lazy"></a>
  <div><p class="kicker">Made to share</p><h2>A good gift, beautifully simple.</h2><p>Tea, curry leaves, handmade soap and moringa, brought together in our $35 gift pack. For Diwali, choose the tea, curry leaf and soap box for $20.</p><div class="hero-actions"><a class="btn btn-primary" href="/products/gift-pack/">Explore gift packs</a><a href="/products/diwali-gift-box/">Diwali Gift Box →</a></div><details class="gift-guide-disclosure"><summary>Diwali gift guides and delivery</summary>${DIWALI_GROWTH_LINKS}<p><a href="/blog/diwali-gift-guide-curry-leaves-tea-australia">Diwali gift guide</a></p></details></div>
</div></section>
<section class="section origin-note"><div class="wrap"><p class="kicker">A small team. A direct connection.</p><h2>From our family farm to Truganina.</h2><p>We grow the moringa and curry leaves on our family farm in Gujarat, source tea from a Darjeeling family farm and handmake our soap in Australia. Every order is packed by us in Melbourne.</p><a href="/about/">Meet NutriThrive →</a></div></section>
${googleReviewsSection()}
<section class="section buying-guide-link"><div class="wrap"><a href="${routes().article("how-to-choose-moringa-powder-australia-2026")}">Choosing moringa? Read our buyer’s guide →</a></div></section>`,
  });
}

function shopPage() {
  const shopPath = LIVE_MODE ? "/products/" : "/shop";
  const desk = deskSeo("/products/");
  const moringaIds = new Set(["moringa-powder", "moringa-200g", "moringa-400g"]);
  const moringaProducts = PRODUCTS.filter((p) => moringaIds.has(p.id));
  const otherProducts = PRODUCTS.filter((p) => !moringaIds.has(p.id));
  return layout({
    title: desk.title || "Shop Curry Leaves, Darjeeling Tea, Soap & Moringa",
    description: desk.description || "Farm-grown curry leaves $7, Darjeeling tea $7.50, handmade soap $7, moringa from $11, $20 Diwali Gift Box. Packed in Truganina. Free AU shipping from $49.",
    canonicalPath: shopPath,
    current: "Shop",
    preserveTitle: true,
    preserveDescription: true,
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
      ) +
      jsonLd({
        "@context": "https://schema.org",
        "@type": "WebPage",
        url: `${LIVE}${shopPath}`,
        name: "Shop",
        ...pageDateFields(),
      }),
    main: `
      <section class="page-intro shop-intro wrap">
        <p class="kicker">Farm grown · Australian packed</p>
        <h1>${esc(deskSeo("/products/").h1 || "Shop NutriThrive")}</h1>
        <p>Start with our farm-grown moringa powder, from $11, then add curry leaves, tea, soap and gift packs.</p>
      </section>
      <section class="section shop-catalog" style="padding-top:0" aria-labelledby="shop-moringa">
        <div class="wrap">
          <div class="section-head">
            <div>
              <p class="kicker">Core product</p>
              <h2 id="shop-moringa">Moringa powder</h2>
              <p>Sun-dried leaf powder. Packed in Truganina. Free AU shipping from $49.</p>
            </div>
          </div>
          <div class="product-grid shop-product-grid shop-moringa-grid">${moringaProducts.map((product, index) => productCard(product, index === 0, { showVariant: true })).join("")}</div>
        </div>
      </section>
      <section class="section shop-catalog" style="padding-top:0" aria-labelledby="shop-products">
        <div class="wrap">
          <div class="section-head">
            <div>
              <p class="kicker">Also from NutriThrive</p>
              <h2 id="shop-products">Tea, curry leaves, soap &amp; gifts</h2>
            </div>
          </div>
          <div class="product-grid shop-product-grid">${otherProducts.map((product) => productCard(product, false, { showVariant: true })).join("")}</div>
        </div>
      </section>
      ${googleReviewsSection()}`,
  });
}

const PDP = {
  "moringa-powder": {
    title: "Buy Moringa Powder Australia | Leaf Powder from $11",
    description:
      "Farm-grown moringa leaf powder, sun-dried and NMI lab-tested in Australia. 100g $11, 200g $22, 400g $40. Free AU shipping from $49.",
    forceSeo: true,
    current: "Moringa",
    h1: "Moringa Powder Australia",
    product: PRODUCTS[0],
    defaultVariantId: "moringa-400g",
    variants: PRODUCTS.filter((p) =>
      ["moringa-powder", "moringa-200g", "moringa-400g", "combo-pack", "moringa-soap-combo"].includes(p.id)
    ),
    variantLabels: {
      "moringa-powder": "100g · $11 · A good first pouch",
      "moringa-200g": "200g · $22",
      "moringa-400g": "400g · $40 · $10 per 100g",
      "combo-pack": "Combo pack · $17 · Moringa + curry leaves",
      "moringa-soap-combo": "Powder + soap · $17 · 100g moringa + 95g bar",
    },
    variantHint: "400g is $10 per 100g.",
    intro:
      "Moringa leaf powder from our family farm in Gujarat, India. Sun-dried, tested by NMI in Australia, and packed by us in Truganina, Melbourne.",
    freezeHeroCopy: true,
    proofs: [
      "100% moringa leaf. Nothing added.",
      { html: `<a href="/documents/nutrithrive-lab-report-summary.pdf">Australian lab tested</a>` },
      "Grown on our farm",
      "Packed in Truganina, VIC",
      PAYMENT_LINE,
    ],
    reviews: REVIEWS.filter((review) => MORINGA_FEATURED_REVIEW_NAMES.includes(review.name)),
    gallery: [
      ["/assets/images/product_webp/moringa-powder-400g-bundle-main.webp", "Four NutriThrive 100g moringa powder pouches in the 400g bundle"],
      ["/assets/images/product_webp/moringa-powder-100g-main.webp", "NutriThrive 100g moringa powder pouch with a bowl of green powder"],
      ["/assets/images/photos/compressed/moringa-powder-200g-main-square.webp", "NutriThrive 200g moringa powder pouch with a bowl of green powder"],
      ["/assets/images/photos/compressed/moringa-powder-200g-editorial-desktop.webp", "NutriThrive 200g moringa powder pouch in warm botanical light"],
      ["/assets/images/photos/compressed/moringa-powder-200g-lifestyle-desktop.webp", "NutriThrive 200g moringa powder pouch with a wooden bowl and measuring spoon"],
      ["/assets/images/photos/compressed/moringa-powder-detail-light.webp", "Finely milled moringa leaf powder in a ceramic bowl and wooden spoon"],
      ["/assets/images/product_webp/moringa-powder-texture.webp", "Finely milled green moringa leaf powder in a ceramic bowl"],
    ],
    detailImage: "/assets/images/photos/compressed/moringa-powder-detail-light.webp",
    detailAlt: "Finely milled green moringa leaf powder in a ceramic bowl with a wooden spoon",
    detailCaption: "A closer look at the fine texture and natural green colour of the powder.",
    ingredients: "100% moringa (Moringa oleifera) leaf powder. No fillers or blends.",
    origin: "Grown on our own farm. Packed in Truganina, Melbourne.",
    process: "We grow, harvest, sun-dry and mill the leaves, arrange testing in Australia, then pack in small runs in Truganina.",
    storage: "Keep it sealed, somewhere cool and dry. Lasts 1 year once opened.",
    safety: "Start with a small amount. If you are pregnant, breastfeeding, taking prescription medication or managing a health condition, ask your healthcare professional before regular use.",
    what: "Bright green powder with a mild, spinach-like smell when you open it. We sun-dry the leaves and publish the NMI nutrition summary for batch NT042024.",
    use: "Add 1 teaspoon (about 3 to 5 grams) to smoothies, juice, or water. Works in soups and salads. Straight in water, most people dislike the flavour. Mixed into food, most people barely notice it.",
    faqs: [
      [
        "Where is NutriThrive moringa powder shipped from?",
        "Orders are packed and shipped from Truganina, Melbourne. Local pickup from Truganina by arrangement. Online orders ship across Australia.",
      ],
      [
        "What does moringa powder taste like?",
        "Moringa powder has an earthy, leafy and slightly bitter flavour. Many people mix it into smoothies, yoghurt, juice or meals to combine it with other flavours.",
      ],
      [
        "How should I store moringa powder?",
        "Keep it sealed, somewhere cool and dry. Lasts 1 year once opened.",
      ],
      [
        "Is NutriThrive moringa powder tested in Australia?",
        {
          html: `Yes. Our moringa powder is NMI lab-tested in Australia. <a href="/documents/nutrithrive-lab-report-summary.pdf">Read the lab summary PDF</a> on this page. Packed in Truganina, VIC.`,
        },
      ],
      [
        "Why isn’t NutriThrive the cheapest moringa powder?",
        {
          html: `We publish an <strong>NMI lab summary</strong>, sun-dry the leaf, and pack in Truganina. Best value is <strong>400g at $40</strong> ($10/100g). Free AU shipping at <strong>$49</strong>.`,
        },
      ],
      [
        "Does Chemist Warehouse sell moringa powder?",
        {
          html: `CW mainly lists <strong>capsules</strong>. For teaspoon dosing, buy loose powder. See our <a href="/blog/moringa-capsules-vs-powder-which-is-better-2026">powder vs capsules guide</a>.`,
        },
      ],
      [
        "Are you certified organic?",
        "We're not certified. Our leaf is farm-grown and tested by NMI. If certification matters to you, buy a certified brand and compare the price per 100g and the lab paperwork.",
      ],
      [
        "Does NutriThrive offer free shipping?",
        "Free Australian shipping starts at $49. Moringa powder sizes are 100g for $11, 200g for $22 and 400g for $40; curry leaves or Darjeeling tea can be added to reach the threshold.",
      ],
    ],
  },
  "curry-leaves": {
    title: "Buy Dried Curry Leaves Online Australia | 30g $7",
    description:
      "Buy dried curry leaves online: whole leaves (karipatta, curry patta, kadi patta), 30g for $7. Grown on our Gujarat farm, packed in Truganina, VIC.",
    forceSeo: true,
    h1: "Dried Curry Leaves: Buy Online in Australia",
    current: "Curry Leaves",
    product: PRODUCTS.find((p) => p.id === "curry-leaves"),
    intro:
      "Buy dried curry leaves online from the people who grow them. Our whole curry leaves (also called karipatta, curry patta or kadi patta) are grown on our family farm in Gujarat, dried, and packed in 30g pouches in Truganina, Melbourne. They're made for tadka: drop a small handful into hot oil or ghee with mustard seeds and the aroma carries through dal, sambar, rasam, lemon rice and curries. Drying softens the aroma, so use a little more dried leaf than you would fresh, fry it briefly in hot oil, and taste as you go. $7 for 30g, posted Australia-wide.",
    proofs: [
      "Grown on our farm in Gujarat",
      "Packed in Truganina, VIC",
      "Australia-wide delivery",
      PAYMENT_LINE,
    ],
    gallery: [
      ["/assets/images/product_webp/dried-curry-leaves-30g-main.webp", "NutriThrive dried curry leaves 30g pouch with whole leaves"],
      ["/assets/images/product_webp/dried-curry-leaves-texture.webp", "Whole dried curry leaves (karipatta) in a ceramic bowl"],
      ["/assets/images/homepage/product-showcase/Curry.webp", "Dried curry leaves product showcase"],
      ["/assets/images/product_photos/driedcurry.jpeg", "Close-up of whole dried curry leaves"],
      ["/assets/images/general/CURRY3.png", "Aromatic dried curry leaves ready for tempering"],
    ],
    detailImage: "/assets/images/product_webp/dried-curry-leaves-texture.webp",
    detailAlt: "Whole dried curry leaves (karipatta) in a ceramic bowl",
    detailCaption: "Whole dried leaves with their naturally curled, pantry-ready texture.",
    ingredients: "100% dried curry leaves (curry patta / kadi patta / karipatta). Nothing added.",
    origin: "Grown on NutriThrive’s farm in Gujarat, India. Packed in Truganina, Melbourne.",
    process: "We pick the leaves on our family farm in Gujarat and sun-dry them there to keep their colour. Then I pack them in Truganina.",
    storage:
      "Keep the pouch sealed in a cool, dry, dark cupboard, away from the stove. Dried leaves don't spoil quickly when kept dry, but their aroma fades, and a pouch lasts 1 year once opened. Check the best-before date on the pouch.",
    safety: "If a pouch ever smells musty or looks damp, don't use it, and let me know.",
    what: "Whole dried leaves of the curry tree (Murraya koenigii), the leaf used for tempering across South Indian, Sri Lankan and Gujarati cooking. It isn't curry powder and doesn't taste like it. The leaf has its own warm, citrusy aroma that comes alive in hot fat. Each pouch holds whole leaves, not crushed powder.",
    useHtml: `<ol>
              <li>Heat 1 to 2 tbsp oil or ghee until a mustard seed sizzles straight away.</li>
              <li>Add mustard or cumin seeds and let them pop.</li>
              <li>Add 8 to 15 dried curry leaves for a pot of dal for 3 to 4. They should sizzle and darken within 10 to 20 seconds.</li>
              <li>Pour the whole tadka over dal, sambar, rasam, vegies or rice. Recipe written for fresh leaves? Use a little more dried leaf and taste as you go. Avoid cold oil and long frying, which turns them bitter.</li>
            </ol>
            <p>New to dried leaves? Try our <a href="/blog/curry-leaf-podi-recipe-dried-curry-leaves">curry leaf podi recipe</a>.</p>`,
    faqs: [
      [
        "How many dried curry leaves equal fresh?",
        "There's no exact swap. Drying softens the aroma, so use a little more dried leaf than you would fresh, fry it briefly in hot oil, and taste as you go.",
      ],
      [
        "Are curry leaves the same as curry powder?",
        "No. Curry powder is a spice blend (turmeric, coriander, cumin, chilli) and normally contains no curry leaves.",
      ],
      [
        "Are curry patta, kadi patta and karipatta the same?",
        "Yes. They're the same leaf in different Indian languages: kadi patta in Hindi, karipatta and karuveppilai in the South, and karapincha in Sinhala.",
      ],
      [
        "Do Woolworths and Coles sell curry leaves?",
        {
          html: `On 5 Oct 2026, Coles listed a 10g fresh punnet, and Woolworths a 5g fresh punnet and a 5g dried pack. Stock varies. See <a href="/blog/dried-curry-leaves-australia-guide">Where to buy curry leaves in Australia</a>.`,
        },
      ],
      [
        "How should I store dried curry leaves?",
        "Sealed, in a cool, dark cupboard away from steam. Lasts 1 year once opened.",
      ],
    ],
  },
  "black-tea": {
    title: "Darjeeling Loose Leaf Black Tea Australia | 100g $7.50",
    description:
      "Darjeeling loose leaf black tea, 100g for $7.50 (about 50 cups). From a family farm in Darjeeling, India, packed in Truganina, VIC and posted Australia-wide.",
    forceSeo: true,
    h1: "Darjeeling Loose Leaf Black Tea",
    current: "Tea",
    product: PRODUCTS.find((p) => p.id === "black-tea"),
    intro:
      "This is Darjeeling loose leaf black tea from a family farm in the Darjeeling district of India, packed in 100g pouches in Truganina, Melbourne. Brewed at 85 to 90°C, it makes a bright amber cup with floral, muscatel notes, lighter and less malty than an English Breakfast blend. A 100g pouch makes about 50 cups at roughly 2g a cup. Drink it plain, or add a splash of milk. Because it's loose leaf, you'll need an infuser, strainer or teapot. $7.50 for 100g, posted Australia-wide.",
    proofs: [
      "Family-farm Darjeeling",
      "Packed in Truganina, VIC",
      "Australia-wide delivery",
      PAYMENT_LINE,
    ],
    gallery: [
      ["/assets/images/product_webp/darjeeling-black-tea-100g-main.webp", "NutriThrive 100g Darjeeling black tea pouch with brewed tea"],
      ["/assets/images/product_webp/darjeeling-black-tea-brewed.webp", "Amber Darjeeling black tea with loose leaves in a wooden spoon"],
      ["/assets/images/homepage/product-showcase/BlackTea.webp", "Darjeeling black tea product showcase"],
      ["/assets/images/product_photos/blacktea.jpeg", "Loose-leaf Darjeeling tea from family farm"],
      ["/assets/images/products/BlackTea.webp", "NutriThrive Darjeeling black tea pouch"],
    ],
    detailImage: "/assets/images/product_webp/darjeeling-black-tea-brewed.webp",
    detailAlt: "Amber Darjeeling black tea with loose tea leaves in a wooden spoon",
    detailCaption: "Loose Darjeeling leaves and the warm amber colour of a gently brewed cup.",
    ingredients: "100% loose leaf Darjeeling black tea.",
    origin: "Sourced from a family farm in Darjeeling, India. Packed in Truganina, Melbourne.",
    process:
      "Darjeeling is picked in several harvests, or flushes: a light spring first flush, a fuller summer second flush and a darker autumn flush. Packed in small runs in Truganina.",
    storage:
      "Keep it sealed, away from the spice rack. Lasts 1 year once opened.",
    safety: "Contains caffeine, about 40 to 50 mg a cup.",
    what: "100% loose leaf Darjeeling black tea, grown in the hill district of Darjeeling, West Bengal. Expect a lighter body than Assam-based breakfast teas, a floral aroma and the grape-like muscatel note Darjeeling is known for, especially brewed below boiling.",
    useHeading: "How to brew",
    useHtml: `<ul>
              <li><strong>One cup:</strong> 2g, 85–90°C, 3–4 min</li>
              <li><strong>Teapot (1L):</strong> 8g, 85–90°C, 3–5 min</li>
              <li><strong>With milk:</strong> 3g, 90–95°C, 4–5 min</li>
              <li><strong>Iced:</strong> 4g in 150ml hot water, 4 min, then pour over ice</li>
            </ul>
            <p>Boiling water makes Darjeeling harsh. Good leaf gives a second, shorter steep. Read <a href="/blog/darjeeling-black-tea-australia-guide#first-flush-vs-second-flush">first flush vs second flush</a>.</p>
            <p>The full method is in our <a href="/blog/how-to-brew-darjeeling-tea-perfectly-2026">how to brew Darjeeling</a> guide.</p>`,
    faqs: [
      ["How many cups does 100g make?", "About 50."],
      ["Can I add milk?", "Yes. Use a little more tea and 90–95°C water."],
      [
        "Caffeine?",
        "About 40 to 50 mg a cup. Most coffee has more.",
      ],
      [
        "Darjeeling vs English Breakfast?",
        "English Breakfast is an Assam-led blend for a strong cup with milk. Darjeeling is single-region, lighter and more aromatic.",
      ],
      ["Loose leaf or bags?", "Loose leaf only."],
    ],
  },
  "moringa-soap": {
    title: "Handmade Lavender Soap Bar with Moringa | 95g $7",
    description:
      "Moringa and lavender soap bar, 95g, $7. Or powder + soap bundle $17. Handmade in Australia, packed in Truganina.",
    forceSeo: true,
    h1: "Handmade Moringa & Lavender Soap Bar",
    current: "Shop",
    product: PRODUCTS.find((p) => p.id === "moringa-soap"),
    defaultVariantId: "moringa-soap",
    variants: PRODUCTS.filter((p) => ["moringa-soap", "moringa-soap-combo"].includes(p.id)),
    variantLabels: {
      "moringa-soap": "Soap bar only · $7 · 95g",
      "moringa-soap-combo": "Powder + soap · $17 · 100g powder + 95g bar",
    },
    variantHint: "The powder + soap bundle is $17.",
    intro:
      "Our moringa soap is a handmade lavender soap bar, made by us in small batches in Australia. Each 95g bar starts with a melt-and-pour soap base. We add moringa leaf, lavender fragrance and dried lavender flowers, then pour and finish the bars by hand and pack them in Truganina, Melbourne. It's an everyday hand and body bar that smells of lavender. $7 a bar, posted Australia-wide.",
    proofs: [
      "Handmade in Australia",
      "Packed in Truganina, VIC",
      "Australia-wide delivery",
      PAYMENT_LINE,
    ],
    gallery: [
      ["/assets/images/product_webp/moringa-soap-95g-main.webp", "NutriThrive handmade 95g moringa soap with lavender flowers"],
      ["/assets/images/product_photos/moringasoapcombo.jpeg", "NutriThrive 100g moringa powder and 95g soap bundle"],
      ["/assets/images/product_webp/moringa-soap-texture.webp", "Handmade moringa soap on a stone dish with lavender and foam"],
      ["/assets/images/homepage/product-showcase/moringa_soap.webp", "Moringa soap product showcase"],
      ["/assets/images/product_photos/soap.jpeg", "Handmade moringa lavender soap bar"],
      ["/assets/images/products/moringa_soap.webp", "NutriThrive handmade moringa lavender soap"],
    ],
    detailImage: "/assets/images/product_webp/moringa-soap-texture.webp",
    detailAlt: "Handmade moringa soap bar with lavender flowers and soft foam on a stone dish",
    detailCaption: "A closer look at the handmade bar, lavender flowers and lather.",
    ingredients:
      "Melt-and-pour soap base, moringa leaf, lavender fragrance (parfum), dried lavender flowers.",
    origin: "Handmade by NutriThrive in Australia and packed in Truganina, Melbourne.",
    process:
      "We start with a melt-and-pour soap base, add moringa leaf, lavender fragrance and dried lavender flowers, then pour and finish the bars by hand in small batches in Australia.",
    storage: "Let it dry on a draining dish between uses and it'll last longer.",
    safety: "",
    what: "A 95g handmade soap bar for hands and body. It's a melt-and-pour soap: we start with a ready-made soap base and add moringa leaf for colour and flecks, lavender fragrance, and dried lavender flowers on top. It's a wash. It cleans and rinses off, and we don't make skin-care claims for it.",
    use: "Lather with wet hands, wash and rinse. Let it dry on a draining dish between uses. External use only; avoid eyes. Patch-test if you have sensitive skin.",
    faqs: [
      [
        "What's it made from?",
        "A melt-and-pour soap base, moringa leaf, lavender fragrance and dried lavender flowers.",
      ],
      [
        "Is it natural, organic or cold process?",
        "No. It's melt-and-pour, not certified organic, and we don't call it natural or cold process.",
      ],
      ["What does it smell like?", "Gentle lavender."],
      ["Sensitive skin?", "Patch-test first; stop if irritation occurs."],
      ["How long does a bar last?", "Longer on a draining dish, out of the shower stream."],
      [
        "What is in the powder + soap option?",
        "100g farm-grown sun-dried moringa powder and one 95g handmade soap bar for $17.",
      ],
      [
        "Good gift?",
        {
          html: `Yes. It's also in the <a href="/products/diwali-gift-box/">Diwali Gift Box</a>.`,
        },
      ],
    ],
  },
  "combo-pack": {
    title: "Combo Pack $17: 100g Moringa + 30g Curry Leaves",
    description:
      "One 100g pouch of farm-grown moringa leaf powder and 30g of whole dried curry leaves for $17. Packed in Truganina, Melbourne. Free AU shipping from $49.",
    forceSeo: true,
    current: "Shop",
    product: PRODUCTS.find((p) => p.id === "combo-pack"),
    intro: "100g moringa powder and 30g dried curry leaves. Grown on our family farm in Gujarat, India, and packed in Truganina, Melbourne. Morning smoothie and evening tadka from one box.",
    proofs: [
      { html: `Includes <a href="/documents/nutrithrive-lab-report-summary.pdf">NMI-tested moringa</a>` },
      "Farm-grown curry leaves",
      "Packed in Truganina, VIC",
      PAYMENT_LINE,
    ],
    gallery: [
      ["/assets/images/product_webp/moringa-curry-leaves-combo-main.webp", "NutriThrive 100g moringa powder and 30g dried curry leaves combo"],
      ["/assets/images/homepage/product-showcase/combo.webp", "Moringa and curry leaves combo pack showcase"],
      ["/assets/images/product_photos/combo.jpeg", "Combo pack with moringa powder and dried curry leaves"],
      ["/assets/images/product_webp/moringa-powder-100g-main.webp", "100g moringa powder included in combo"],
      ["/assets/images/product_webp/dried-curry-leaves-30g-main.webp", "30g dried curry leaves included in combo"],
    ],
    ingredients: "100% moringa leaf powder and 100% dried curry leaves. Nothing added.",
    origin: "Both products are grown on our own farm in Gujarat and packed in Truganina.",
    process: "We grow and process both products, arrange Australian testing for the moringa, and pack the combination in Truganina.",
    storage: "Keep both sealed and dry. Lasts 1 year once opened.",
    safety: "Follow the individual product directions. Seek professional advice before regular moringa use if you are pregnant, breastfeeding, taking medication or managing a health condition.",
    what: "Moringa for whatever you blend or stir in; curry leaves for dals and curries. Both packed in Truganina.",
    use: "Each item is also available separately.",
    faqs: [
      ["What is in the combo?", "100g moringa powder and 30g dried curry leaves (karipatta), both from our farm."],
      ["Can I buy them separately?", "Yes. Each item is also available individually in our shop."],
    ],
  },
  "diwali-gift-box": {
    title: "Diwali Gift Box: Darjeeling Tea, Curry Leaves & Soap | $20",
    description:
      "Diwali gift box with Darjeeling loose leaf tea 100g, dried curry leaves 30g and a handmade lavender soap. No moringa powder. Packed in Truganina, VIC.",
    forceSeo: true,
    h1: "Diwali Gift Box: Darjeeling Tea, Curry Leaves and Lavender Soap",
    current: "Shop",
    product: PRODUCTS.find((p) => p.id === "diwali-gift-box"),
    intro:
      "Our Diwali gift box brings together three things people use long after the sweets are gone: 100g of Darjeeling loose leaf black tea from a family farm in Darjeeling, 30g of whole dried curry leaves from our farm in Gujarat, and a 95g moringa and lavender soap bar we handmake in Australia. There's no moringa powder in this box. We pack it in Truganina, Melbourne, ready to give to family, hosts, neighbours or colleagues this Diwali, Sunday 8 November 2026. Order before 2pm on a weekday for same-day dispatch, posted Australia-wide or picked up in Truganina by arrangement.",
    proofs: [
      "No moringa powder",
      "Handmade soap",
      "Family-farm tea",
      "Packed in Truganina, VIC",
      PAYMENT_LINE,
    ],
    gallery: [
      ["/assets/images/product_webp/darjeeling-black-tea-100g-main.webp", "Darjeeling tea included in the Diwali gift box"],
      ["/assets/images/product_webp/dried-curry-leaves-30g-main.webp", "Dried curry leaves included in the Diwali gift box"],
      ["/assets/images/product_webp/moringa-soap-95g-main.webp", "Handmade lavender soap included in the Diwali gift box"],
      ["/assets/images/product_webp/darjeeling-black-tea-brewed.webp", "Brewed Darjeeling from the Diwali gift box"],
    ],
    seasonalNotes: {
      until: "2026-11-08",
      lines: [
        "Diwali orders open until Sunday 8 November.",
        "Rural addresses can take up to 10 business days, so order early.",
      ],
    },
    whatHeading: "What's in the box",
    ingredients:
      "Includes Darjeeling black tea, dried curry leaves (curry patta / kadi patta), and soap made with melt-and-pour soap base, moringa leaf, lavender fragrance and dried lavender flowers.",
    origin: "Family-farm tea from Darjeeling, farm-grown curry leaves, and soap handmade by us in Australia. Packed in Truganina, Melbourne.",
    process:
      "We pack all three in one box, with the soap wrapped separately so the tea doesn't take on its scent. Packed in Truganina. No moringa powder included.",
    storage: "Keep the tea and curry leaves sealed and dry, and the soap on a draining dish.",
    safety: "Soap is for external use only; patch-test if your skin is sensitive. Tea contains caffeine. Follow each product’s directions.",
    whatHtml: `<ul>
              <li><strong>Darjeeling loose leaf black tea, 100g:</strong> About 50 cups. Floral, muscatel notes at 85 to 90°C. Contains caffeine, about 40 to 50 mg a cup.</li>
              <li><strong>Dried curry leaves, 30g:</strong> whole leaves for tadka. Use a little more than you would fresh, and taste as you go.</li>
              <li><strong>Handmade moringa &amp; lavender soap, 95g:</strong> melt-and-pour base, moringa leaf, lavender fragrance, dried lavender flowers.</li>
            </ul>
            <p>Who it's for: relatives you're visiting, a host who has plenty of mithai, neighbours, teachers and colleagues. For bulk orders, contact us.</p>`,
    use: "Give the three products as a pantry gift. Each item is also sold separately. Prefer a version with moringa powder? See the four-item gift pack.",
    faqs: [
      ["What's inside?", "Tea, curry leaves and soap."],
      [
        "Does it contain moringa powder?",
        {
          html: `No. The only moringa is the leaf in the soap. For powder, see the <a href="/products/gift-pack/">four-item gift pack</a>.`,
        },
      ],
      ["Pickup?", "Yes, from Truganina by arrangement."],
      ["Gift message?", "Add a note at checkout or email us after you order."],
      ["Bulk?", "Yes, ideally by Fri 23 Oct. Contact us with numbers, postcodes and dates."],
    ],
  },
  "gift-pack": {
    title: "Tea, Curry Leaf, Soap & Moringa Gift Pack | $35",
    description:
      "Gift pack: Darjeeling tea 100g, dried curry leaves 30g, handmade lavender soap 95g and moringa powder 100g, $35. Want it without moringa? See our gift box.",
    forceSeo: true,
    h1: "Gift Pack: Darjeeling Tea, Curry Leaves, Soap and Moringa Powder",
    current: "Shop",
    product: PRODUCTS.find((p) => p.id === "gift-pack"),
    intro:
      "This gift pack puts four NutriThrive products in one parcel: 100g Darjeeling loose leaf black tea, 30g dried curry leaves, a 95g handmade moringa and lavender soap bar, and 100g moringa leaf powder. It's packed in Truganina, Melbourne and posted Australia-wide, ready to hand over as a Diwali gift pack, a housewarming present or a thank-you. If you'd like a gift without moringa powder, choose our Diwali Gift Box. $35. Each product is also sold on its own.",
    proofs: [
      "Four products, one parcel",
      "Handmade soap",
      "Family-farm tea",
      "Packed in Truganina, VIC",
      PAYMENT_LINE,
    ],
    gallery: [
      ["/assets/images/product_webp/nutrithrive-four-product-gift-pack-main.webp", "NutriThrive gift pack with moringa powder, curry leaves, Darjeeling tea and moringa soap"],
      ["/assets/images/product_webp/moringa-powder-100g-main.webp", "100g moringa powder included in gift pack"],
      ["/assets/images/product_webp/darjeeling-black-tea-100g-main.webp", "100g Darjeeling tea included in gift pack"],
      ["/assets/images/product_webp/dried-curry-leaves-30g-main.webp", "30g dried curry leaves included in gift pack"],
      ["/assets/images/product_webp/moringa-soap-95g-main.webp", "95g moringa soap included in gift pack"],
    ],
    seasonalNotes: {
      until: "2026-11-08",
      lines: [
        "Diwali orders open until Sunday 8 November.",
        "Rural addresses can take up to 10 business days, so order early.",
      ],
    },
    ingredients:
      "Includes moringa leaf powder, Darjeeling black tea, dried curry leaves, and soap made with melt-and-pour soap base, moringa leaf, lavender fragrance and dried lavender flowers.",
    origin: "Farm-grown moringa and curry leaves, family-farm tea from Darjeeling, and moringa soap handmade by us in Australia.",
    process: "We pack each gift in Truganina: curry leaves and moringa from our farm, tea from a family farm in Darjeeling, and soap we make here.",
    storage: "Keep everything dry. Lasts 1 year once opened.",
    safety: "The tea contains caffeine. The soap is for hands and body only.",
    what: "A four-product gift pack: Darjeeling tea, curry leaves, handmade lavender soap, and moringa powder. Packed in Truganina for Diwali, housewarmings and thank-yous.",
    use: "Each product is also available individually.",
    faqs: [
      [
        "What's inside?",
        "Tea 100g, curry leaves 30g, soap 95g and moringa powder 100g.",
      ],
      [
        "Is there a version without moringa?",
        {
          html: `Yes, the <a href="/products/diwali-gift-box/">Diwali Gift Box</a>.`,
        },
      ],
      [
        "Until when can I order for Diwali?",
        "Diwali orders open until Sunday 8 November. Delivery times vary by location, and rural areas can take up to 10 business days.",
      ],
      ["Gift message?", "Add a note at checkout or email us after you order."],
      ["Bulk orders?", "Contact us with numbers, postcodes and dates."],
    ],
  },
};

function pdpPage(slug, d) {
  const p = d.product;
  const canonicalPath = d.canonicalPath || `/products/${slug}/`;
  const mainPowder = canonicalPath === "/products/moringa-powder/";
  const liveSeo = LIVE_MODE && !d.forceSeo ? extractSeo(path.join(SITE, "products", slug, "index.html")) : null;
  const buildDate = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);
  const seasonalLines =
    d.seasonalNotes?.until && buildDate <= d.seasonalNotes.until
      ? d.seasonalNotes.lines || []
      : [];
  const seasonalHtml = seasonalLines
    .map((line) => `<p class="purchase-note" data-seasonal-note>${esc(line)}</p>`)
    .join("");
  const buyProduct =
    (d.defaultVariantId && d.variants?.find((item) => item.id === d.defaultVariantId)) || p;
  const shipNote = shippingCostNote(buyProduct);
  const shippingHtml = `<p class="purchase-note" data-pdp-ship>${esc(shipNote)}</p>`;
  const galleryCandidates = [[buyProduct.image, `${buyProduct.name} ${buyProduct.variant}`], ...(d.gallery || []).filter(([src]) => /\/(?:product_webp|photos\/compressed)\//.test(src)), ...(d.variants || []).map(v => [v.image, `${v.name} ${v.variant}`]), ...(d.detailImage ? [[d.detailImage, d.detailAlt]] : [])];
  const gallery = galleryCandidates.filter(([src], index, items) => fs.existsSync(path.join(SITE, src)) && items.findIndex(([other]) => other === src) === index);
  const related = ["black-tea", "curry-leaves", "moringa-soap", "diwali-gift-box"]
    .map((id) => PRODUCTS.find((item) => item.id === id))
    .filter((item) => item && item.id !== p.id && item.href !== p.href);
  const reviews = (d.reviews || REVIEWS).filter((review) => slug === "black-tea" || review.name !== TEA_REVIEW_NAME);
  const freezeHero = Boolean(d.freezeHeroCopy);
  const selectedVariantId = buyProduct.id;
  const variantSelect = d.variants
    ? `<label class="field" for="variant">Size
        <select class="variant-select" id="variant">${d.variants
          .map((v) => {
            const label = d.variantLabels?.[v.id] || `${v.name} ${v.variant}, ${money(v.price)}`;
            return `<option value="${v.id}" ${v.id === selectedVariantId ? "selected" : ""}>${esc(label)}</option>`;
          })
          .join("")}</select>
      </label>`
    : "";
  const variantHint = d.variantHint
    ? `<p class="pdp-variant-hint">${esc(d.variantHint)}${slug === "moringa-powder" ? ` <span class="pdp-value-flag pdp-buybox-value-flag" data-best-value-badge hidden>Best value</span>` : ""}</p>`
    : "";
  const powder100 = PRODUCTS.find((item) => item.id === "moringa-powder");
  const powder200 = PRODUCTS.find((item) => item.id === "moringa-200g");
  const powder400 = PRODUCTS.find((item) => item.id === "moringa-400g");
  const under49Rate = auSoloShippingRate(powder100?.weight || 100);
  if (mainPowder && (powder100?.price !== 11 || powder200?.price !== 22 || powder400?.price !== 40 || under49Rate !== 9.69)) {
    throw new Error(`Moringa powder prices or the under-$49 shipping rate differ from $11 / $22 / $40 / $9.69. Stopped without changing prices. Got ${powder100?.price}, ${powder200?.price}, ${powder400?.price}, ${under49Rate}.`);
  }
  const buyOnline = mainPowder ? `<section class="pdp-buy-online" aria-labelledby="buy-moringa-online">
    <h2 id="buy-moringa-online">Buy moringa powder online in Australia</h2>
    <ul>${[powder100, powder200, powder400].map((item) => `<li>${item.weight === 400 ? "400g (4 × 100g pouches)" : `${item.weight}g pouch`}: $${item.price} (with postage ${money(item.price + auSoloShippingRate(item.weight))}${item.weight === 400 ? `, best value at $${item.price / 4} per 100g` : ""})</li>`).join("")}
    <li>400g $${powder400.price} + 100g $${powder100.price} = $${powder400.price + powder100.price}, and it ships free</li>
    <li>Free Australia-wide shipping on orders from $49. 7-day refund or replacement.</li></ul>
  </section>` : "";
  const education =
    slug === "moringa-powder"
      ? moringaEducationHtml()
      : `${d.whatHtml ? `<h2>${esc(d.whatHeading || "What it is")}</h2>${d.whatHtml}` : d.what ? `<h2>What it is</h2><p>${esc(d.what)}</p>` : ""}
          ${d.useHtml ? `<h2>${esc(d.useHeading || "How to use")}</h2>${d.useHtml}` : d.use ? `<h2>How to use</h2><p>${esc(d.use)}</p>` : ""}
          ${p.lab ? `<h2>Testing</h2><p>Our moringa is tested in Australia. <a href="/documents/nutrithrive-lab-report-summary.pdf">Read the NMI summary for batch NT042024 (PDF, January 2025)</a>.</p>` : ""}`;
  const offerUrl = `${LIVE}${canonicalPath}`;
  const faqHeading = slug === "moringa-powder" ? "Moringa powder FAQs" : "Frequently asked questions";
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: slug === "moringa-powder" ? "Moringa Powder" : p.name,
    description: d.description,
    image: gallery.map(([src]) => absUrl(src)),
    brand: { "@type": "Brand", name: "NutriThrive" },
  };
  if (slug === "moringa-powder") {
    productSchema.sku = buyProduct.sku;
    productSchema.offers = {
      "@type": "Offer",
      name: buyProduct.variant,
      sku: buyProduct.sku,
      url: offerUrl,
      priceCurrency: "AUD",
      price: String(buyProduct.price),
      availability: "https://schema.org/InStock",
      seller: { "@id": `${LIVE}/#localbusiness` },
      ...(mainPowder ? {
        shippingDetails: [
          {
            "@type": "OfferShippingDetails",
            shippingDestination: { "@type": "DefinedRegion", addressCountry: "AU" },
            shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "AUD" },
            eligibleTransactionVolume: { "@type": "PriceSpecification", minPrice: 49, priceCurrency: "AUD" },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
              transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 10, unitCode: "DAY" },
            },
          },
          {
            "@type": "OfferShippingDetails",
            shippingDestination: { "@type": "DefinedRegion", addressCountry: "AU" },
            shippingRate: { "@type": "MonetaryAmount", value: under49Rate, currency: "AUD" },
            eligibleTransactionVolume: { "@type": "PriceSpecification", maxPrice: 48.99, priceCurrency: "AUD" },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
              transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 10, unitCode: "DAY" },
            },
          },
        ],
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "AU",
          returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: 7,
          returnMethod: "https://schema.org/ReturnByMail",
        },
      } : {}),
    };
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
  const crumbTrail = [
    { name: "Home", item: `${LIVE}/` },
    { name: "Shop", item: `${LIVE}${LIVE_MODE ? "/products/" : "/shop"}` },
    { name: "Moringa Powder", item: `${LIVE}/products/moringa-powder/` },
  ];
  if (slug === "moringa-powder" && d.canonicalPath && d.canonicalPath !== "/products/moringa-powder/") {
    crumbTrail.push({ name: buyProduct.variant, item: offerUrl });
  } else if (slug !== "moringa-powder") {
    crumbTrail.splice(2, 1, { name: p.name, item: offerUrl });
  }
  const desk = deskSeo(canonicalPath);
  if (desk.title) d = { ...d, title: desk.title, forceSeo: true };
  if (desk.description) d = { ...d, description: desk.description, forceSeo: true };
  if (desk.h1) d = { ...d, h1: desk.h1 };
  return layout({
    title: d.forceSeo ? d.title : liveSeo?.title || d.title,
    description: d.forceSeo ? d.description : liveSeo?.description || d.description,
    canonicalPath,
    seoCanonicalPath: d.seoCanonicalPath,
    current: d.current,
    preserveTitle: d.forceSeo ? true : Boolean(liveSeo?.title),
    preserveDescription: d.forceSeo ? true : Boolean(liveSeo?.description),
    ogType: "product",
    ogImage: buyProduct.image,
    ogImageWidth: 900,
    ogImageHeight: 900,
    extraHead: `<link rel="preload" as="image" href="${gallery[0][0]}" fetchpriority="high">` +
      jsonLd(productSchema) +
      jsonLd({
        "@context": "https://schema.org",
        "@type": "WebPage",
        url: offerUrl,
        name: p.name,
        ...pageDateFields(),
      }) +
      (d.faqs?.length
        ? jsonLd({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: d.faqs.map(([question, answer]) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: {
                "@type": "Answer",
                text: stripTags(answer && typeof answer === "object" ? answer.html : answer),
              },
            })),
          })
        : "") +
      jsonLd(breadcrumbSchema(crumbTrail)),
    main: `
      <nav class="wrap crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> / <a href="/shop/">Shop</a> / <span data-pdp-crumb>${esc(p.name)}</span>
      </nav>
      <section class="wrap pdp">
        <div class="pdp-gallery-wrap">
          <div class="pdp-gallery">
            <button class="pdp-gallery-open" type="button" data-gallery-open aria-label="Enlarge product photograph">
              <img src="${gallery[0][0]}" alt="${esc(gallery[0][1])}" width="900" height="900" fetchpriority="high" data-pdp-image>
              <span class="gallery-zoom-label">View larger ↗</span>
            </button>
          </div>
          <div class="pdp-thumbnails" role="group" aria-label="Product photographs">
            ${gallery.map(([src, alt], index) => `<button type="button" data-gallery-thumb data-src="${src}" data-alt="${esc(alt)}" aria-label="View photo ${index + 1}: ${esc(alt)}" aria-pressed="${index === 0}"><img src="${src}" alt="" width="80" height="80" loading="lazy"></button>`).join("")}
          </div>
          <p class="gallery-position" data-gallery-position aria-live="polite">1 / ${gallery.length}</p>
          <dialog class="product-lightbox" data-gallery-dialog aria-label="Product photographs">
            <div class="lightbox-toolbar"><span data-gallery-dialog-count>1 / ${gallery.length}</span><button type="button" class="lightbox-close" data-gallery-close aria-label="Close enlarged photograph">Close ×</button></div>
            <img data-gallery-enlarged src="${gallery[0][0]}" alt="${esc(gallery[0][1])}" width="900" height="900" loading="lazy">
            <div class="lightbox-controls"><button type="button" data-gallery-prev aria-label="Previous photograph">← Previous</button><button type="button" data-gallery-next aria-label="Next photograph">Next →</button></div>
          </dialog>
        </div>
        <div class="pdp-buy" id="pdp-buy">
          <h1${freezeHero ? "" : " data-pdp-title"}>${esc(d.h1 || p.name)}</h1>${mainPowder ? `
          <p class="pdp-intro">Farm-grown, sun-dried moringa leaf. Nothing added. Packed in Truganina. <a href="/documents/nutrithrive-lab-report-summary.pdf">See the NMI summary for batch NT042024</a>.</p>` : ""}
          <p class="stock-status"><span aria-hidden="true"></span> In stock · ready to dispatch</p>
          <p class="pdp-price" data-pdp-price>${money(buyProduct.price)}${buyProduct.was && buyProduct.was > buyProduct.price ? ` <s>${money(buyProduct.was)}</s>` : ""}</p>
          <div class="pdp-proof-strip" aria-label="Proof and reviews">
            <a class="pdp-proof-rating" href="#reviews">${stars()}<span>12 Google reviews</span></a>
            <a class="pdp-proof-see-all" href="https://maps.app.goo.gl/9VQVEUQSeGm4XfGB7">See all</a>
          </div>
          ${slug === "moringa-powder" ? "" : `<p class="pdp-intro"${freezeHero ? "" : " data-pdp-intro"}>${esc(p.detail || p.benefit)}</p>`}
          ${slug === "moringa-powder" ? `<p class="pdp-from-price">From $${powder100.price}</p>` : ""}
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
              <button class="btn btn-primary btn-block" type="button" data-add="${productPayload(buyProduct)}" data-label="Add to cart">Add to cart</button>
              <button class="btn btn-secondary btn-block" type="button" data-buy-now="${productPayload(buyProduct)}">Buy now</button>
            </div>
            <p class="purchase-note"><a href="/shipping#returns">7-day guarantee: not happy? Contact us within 7 days of delivery for a refund or replacement.</a></p>

            ${shippingHtml}

            ${d.underCartNote ? `<p class="purchase-note">${esc(d.underCartNote)}</p>` : ""}
            ${seasonalHtml}
          </div>
          ${slug === "moringa-powder" && !mainPowder ? `<p class="pdp-intro"${freezeHero ? "" : " data-pdp-intro"}>${esc(d.intro)}</p>` : ""}

        </div>
      </section>
      <div class="pdp-sticky-atc" data-pdp-sticky-atc hidden role="region" aria-label="Quick add to cart">
        <div class="pdp-sticky-atc__info">
          <span class="pdp-sticky-atc__name" data-pdp-sticky-name>${esc(buyProduct.name)}</span>
          <strong class="pdp-sticky-atc__price" data-pdp-sticky-price>${money(buyProduct.price)}</strong>
        </div>
        <button class="btn btn-primary" type="button" data-pdp-sticky-add>Add to cart</button>
      </div>
      <section class="prose-block">
        <div class="wrap pdp-content">
          ${buyOnline}
          <div class="pdp-information"><div class="pdp-description">${education}${growthProductBody(slug)}</div><div class="pdp-specifications">

          ${slug === "moringa-powder" ? "" : `<details class="pdp-detail-disclosure"><summary>Ingredients, origin and storage</summary><div class="product-facts">
            <section><h2>Ingredients</h2><p>${esc(d.ingredients)}</p></section>
            <section><h2>Origin</h2><p>${esc(d.origin)}</p></section>
            <section><h2>How we make it</h2><p>${esc(d.process)}</p></section>
            <section><h2>Storage and shelf life</h2><p>${esc(d.storage)}</p></section>
          </div></details>`}
          <div class="pdp-support-grid">
            ${d.safety ? `<details class="pdp-support-card safety-note"><summary>Safety information</summary><div><p>${esc(d.safety)}</p></div></details>` : ""}
            <details class="pdp-support-card delivery-card"><summary>Delivery and returns</summary><div>
              <ul>
                <li><strong>Melbourne metro:</strong> usually 1 to 3 business days</li>
                <li><strong>Other metro areas:</strong> usually 3 to 4 business days</li>
                <li><strong>Rural and regional areas:</strong> up to 10 business days</li>
                <li>Occasional carrier delays may add up to 2 business days</li>
                ${slug === "moringa-powder" ? "" : "<li>7-day refund or replacement</li>"}
                <li>Local pickup from Truganina by arrangement.</li>
              </ul>
            </div></details>
          </div>
          <section class="pdp-faq" id="${slug === "moringa-powder" ? "moringa-powder-faq" : `${slug}-faq`}">
            <h2>${esc(faqHeading)}</h2>
            <div class="faq-list">
              ${faqDetails(d.faqs)}
              ${slug === "moringa-powder" ? FSANZ_PENDING + `<div data-pending="guest-card-test" hidden><details><summary>Do I need a PayPal account?</summary><p>No. Choose 'Debit or Credit Card' at checkout.</p></details></div>` : ""}
            </div>
          </section>
          </div></div>
          <section class="pdp-reviews" id="reviews">
            <div class="reviews-head"><h2>Google reviews of NutriThrive</h2>${stars()} <span>from 12 Google reviews</span></div>
            <div class="review-grid review-scroll" aria-label="Google reviews of NutriThrive">${reviews.slice(0, 2).map((review) => `<blockquote class="review-card"><p title="${esc(review.text)}">“${esc(review.text)}”</p><div class="review-meta"><strong>${esc(review.name)}</strong>Verified Google review</div></blockquote>`).join("")}</div>
            <p class="review-disclosure">Reviews of NutriThrive (the business, not this product) from our Google Business Profile.</p>
            <p><a href="https://maps.app.goo.gl/9VQVEUQSeGm4XfGB7">See all Google reviews</a></p>
          </section>
          <section class="product-guides" aria-labelledby="product-guides-${esc(slug)}">
            <div>
              <p class="kicker">Make an informed choice</p>
              <h2 id="product-guides-${esc(slug)}">${slug === "combo-pack" ? "Guides for both" : `Helpful ${esc(p.name.toLowerCase())} guides`}</h2>
            </div>
            <ul>${productGuideLinks(slug)}</ul>
          </section>
          <section class="related-products">
            <div class="section-head"><div><h2>You may also like</h2><p>Also from our farm and kitchen</p></div><a href="/shop/">Shop all</a></div>
            <div class="product-grid" style="--related-columns:${related.length}">${related.map((item) => productCard(item, false, { hideWas: true })).join("")}</div>
          </section>
        </div>
      </section>`,
  });
}

function aboutPage() {
  const liveSeo = LIVE_MODE ? extractSeo(path.join(SITE, "pages/about/about.html")) : null;
  const desk = deskSeo("/about");
  return layout({
    title: desk.title || liveSeo?.title || "Our Farm and Purpose | About NutriThrive",
    description:
      desk.description ||
      liveSeo?.description ||
      "NutriThrive grows and manufactures farm-sourced wellness products, with a mission to make quality health foods affordable and accessible.",
    canonicalPath: "/about",
    current: "About",
    preserveTitle: Boolean(desk.title || liveSeo?.title),
    preserveDescription: Boolean(desk.description || liveSeo?.description),
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
        ...pageDateFields(),
      }),
    main: `
      <section class="page-intro wrap">
        <h1>${esc(deskSeo("/about").h1 || "From our farm to your family.")}</h1>
        <p class="lede">We grow our own moringa and curry leaves. We're not a reseller. Our moringa and curry leaves begin on our own farm in Gujarat and are made with care from harvest through to the finished pack. We source tea from a Darjeeling family farm and handmake our moringa soap in Australia. I pack every order in Truganina and answer the emails myself.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="/products/moringa-powder/">Shop moringa powder</a>
          <a class="btn btn-secondary" href="/documents/nutrithrive-lab-report-summary.pdf">View lab summary</a>
        </div>
        <p style="font-size:14px;color:var(--color-text-secondary)">Farm grown · Manufacturer direct · Australian testing information · Packed in Truganina</p>
      </section>
      <section class="section band" id="founder">
        <div class="wrap split-2">
          <div>
            <h2>Why we started NutriThrive</h2>
            <p>I started NutriThrive in 2023 so people here could buy moringa and curry leaves from our family farm, packed by me in Truganina, at a price that fits an ordinary week.</p>
            <ul>
              <li>Farm-to-customer production with fewer unnecessary markups</li>
              <li>Simple products made without unnecessary fillers</li>
              <li>Clear sizes, ingredients and prices</li>
            </ul>
          </div>
          <div>
            <h2>We grow it. We make it.</h2>
            <p>Our moringa and curry leaves begin on our own farm in Gujarat, India. We oversee growing, harvesting, sun-drying and manufacturing, then arrange Australian testing and pack in small runs in Truganina.</p>
            <ol>
              <li>Grown and harvested on our farm</li>
              <li>Sun-dried on our family farm in Gujarat to keep their colour, then ground and packed.</li>
              <li>Manufactured without unnecessary dilution</li>
              <li>The NMI lab summary for batch NT042024 is online.</li>
            </ol>
          </div>
        </div>
      </section>
      <section class="section farm-story" id="our-farm">
        <div class="wrap">
          <h2>Our farm in Gujarat</h2>
          <p>I'm Neer Vasa, and I started NutriThrive in 2023. Our moringa and curry leaves are grown on our family farm in Gujarat, India.</p>
          <p>The leaves are picked on the farm and sun-dried to keep their colour. The moringa is then ground into powder, and everything is packed by me in Truganina, Melbourne, before it's posted to you.</p>
        </div>
      </section>
      <section class="section">
        <div class="wrap split-2">
          <div>
            <h2>Quality should not be out of reach</h2>
            <p>NutriThrive moringa starts at $11 per 100g. Selling direct is how we keep it at that price.</p>
          </div>
          <div>
            <h2>Testing and transparency</h2>
            <p>Our moringa powder is tested in Australia and we publish the available readable summary. It shows the nutrition results for batch NT042024, tested by the National Measurement Institute in January 2025, so you can see exactly what's in it.</p>
            <h2>Visit or contact us</h2>
            <p>${ADDRESS_LINE}. Call before you arrive: <a href="tel:+61438201419">+61 438 201 419</a>.</p>
            <p>Daily 9:00 AM to 11:00 PM Melbourne time.</p>
          </div>
        </div>
      </section>`,
  });
}

function contactPage() {
  const desk = deskSeo("/contact");
  return layout({
    title: desk.title || "Contact NutriThrive in Truganina, Melbourne",
    description: desk.description || "Contact NutriThrive by email or phone, or arrange a visit to our Truganina location. Ask us about products, batches, orders or local pickup.",
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
        ...pageDateFields(),
        name: "Contact NutriThrive",
        url: `${LIVE}/contact`,
      }),
    main: `
      <section class="page-intro wrap">
        <h1>${esc(deskSeo("/contact").h1 || "Contact")}</h1>
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
            <p>Ridley Place<br>Truganina VIC 3029<br>Melbourne, Australia</p>
            <p>Daily 9:00 AM to 11:00 PM Melbourne time. Call before visiting.</p>
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
          a: "It is 100% Moringa oleifera leaf powder from our own farm, with no fillers. We grow, harvest, sun-dry and manufacture it, arrange testing in Australia, and pack it in Truganina.",
        },
        {
          q: "How much should I take daily?",
          a: "Start with half a teaspoon a day for a week. Most adults then use 1 teaspoon (about 2 to 3 grams) once or twice a day if it sits well. Take it with food.",
        },
        {
          q: "Any safety notes?",
          a: "Leaf powder is widely eaten as food. Skip it if you are on blood thinners unless your GP agrees. If you are pregnant, breastfeeding, or on prescription medication, ask your healthcare provider first. I'm not a doctor, so please check with yours.",
        },
        {
          q: "What does it taste like?",
          a: "Earthy and a bit like spinach. In plain water most people dislike it. Mixed into food, most people barely notice it.",
        },
        {
          q: "Is it lab tested?",
          a: "Yes. Our moringa powder is NMI lab-tested in Australia. Lab summary PDF is on the moringa powder product page.",
        },
      ],
    },
    {
      title: "Dried curry leaves",
      items: [
        {
          q: "What are NutriThrive dried curry leaves?",
          a: "Karipatta grown on our family farm in Gujarat and packed in Truganina, VIC. Use it in tadka for curries, dals and South Indian cooking.",
        },
        {
          q: "How do I use dried curry leaves?",
          a: "Drying softens the aroma, so use a little more than you would fresh and taste as you go. Fry them in hot oil or ghee at the start of the pan. That is when the smell comes through.",
        },
        {
          q: "How should I store them?",
          a: "Airtight container, away from heat and light. Keep it cool and dry. Lasts 1 year once opened.",
        },
      ],
    },
    {
      title: "Darjeeling tea",
      items: [
        {
          q: "What is NutriThrive Darjeeling black tea?",
          a: "Loose-leaf tea sourced from a family farm in Darjeeling, with a floral, muscatel character. We pack it in Truganina, VIC and send it Australia-wide.",
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
          a: "Free standard shipping on Australian orders of $49 or more. Free shipping is applied automatically in the cart once you reach the threshold. International postage is calculated from the parcel weight.",
        },
        {
          q: "How fast is shipping from Melbourne?",
          a: "Order before 2pm Monday to Friday and we usually dispatch the same day. Melbourne metro usually 1 to 3 business days. Other metro areas usually 3 to 4 business days. Rural and regional areas up to 10 business days.",
        },
        {
          q: "What is your 7-day guarantee?",
          a: "Contact us within 7 days of delivery and we'll refund or replace your order. Change-of-mind returns must be unopened, and you pay the return postage. Full details are on our shipping and returns page.",
        },
        {
          q: "Which payment methods do you accept?",
          a: PAYMENT_LINE_LONG,
        },
        {
          q: "Can I place an order by phone?",
          a: "Yes. Call +61 438 201 419 if you need help placing an order.",
        },
      ],
    },
    {
      title: "The business",
      items: [
        {
          q: "Who runs NutriThrive?",
          a: `Me, Neer Vasa. I started NutriThrive in 2023 and pack every order at Ridley Place, Truganina. Our leaves are grown on our family farm in Gujarat.`,
        },
        {
          q: "What is the ABN?",
          a: "32 639 442 616.",
        },
        {
          q: "Can I visit?",
          a: "Call first on +61 438 201 419. Hours are daily 9:00 AM to 11:00 PM Melbourne time. Email nutrithrive0@gmail.com.",
        },
      ],
    },
    {
      title: "Privacy",
      items: [
        {
          q: "Where is the privacy policy?",
          a: "On our privacy policy page. We use your contact and order details to fulfil orders and answer questions.",
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
    ...pageDateFields(),
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
    title: deskSeo("/faq").title || "Moringa Questions and Answers | NutriThrive Australia",
    description:
      deskSeo("/faq").description ||
      "Straight answers on moringa, curry leaves, tea, shipping, returns, privacy and the Truganina business. From Neer in Melbourne.",
    canonicalPath: "/faq",
    preserveTitle: Boolean(deskSeo("/faq").title),
    preserveDescription: Boolean(deskSeo("/faq").description),
    extraHead: `${jsonLd(faqSchema)}
  ${jsonLd(crumbs)}`,
    current: "",
    main: `
      <nav class="wrap-narrow crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> / <span>FAQ</span>
      </nav>
      <section class="page-intro wrap-narrow">
        <h1>${esc(deskSeo("/faq").h1 || "Questions we get asked")}</h1>
        <p class="lede">I'm Neer. These are the questions I get most. If yours isn't here, email or call me.</p>
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
            <p>${ADDRESS_LINE}, Melbourne</p>
            <p>Daily 9:00 AM to 11:00 PM Melbourne time · <a href="tel:+61438201419">+61 438 201 419</a></p>
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
  const shippingFaqs = [
    [
      "Where do you ship moringa powder from?",
      "We pack and dispatch from Truganina, Melbourne. Australia-wide tracked shipping.",
    ],
    [
      "How do I get free shipping?",
      {
        html: `Free Australia-wide shipping on orders of <strong>$49</strong> or more. Free shipping is applied automatically in the cart. Under <strong>$49</strong> in Australia, standard rates start from <strong>$9.69</strong> by parcel weight. International postage is calculated from the parcel weight.`,
        text: "Free Australia-wide shipping on orders of $49 or more. Free shipping is applied automatically in the cart. Under $49 in Australia, standard rates start from $9.69 by parcel weight. International postage is calculated from the parcel weight.",
      },
    ],
    [
      "Can I buy / pick up in Melbourne?",
      {
        html: `Online 24/7. Local pickup from Truganina by arrangement. See our <a href="/melbourne/">Melbourne page</a>.`,
        text: "Online 24/7. Local pickup from Truganina by arrangement. See our Melbourne page.",
      },
    ],
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...pageDateFields(),
    mainEntity: shippingFaqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: typeof a === "object" ? a.text : a },
    })),
  };
  return layout({
    title: deskSeo("/shipping").title || "Shipping & Free Delivery Australia | Over $49 | NutriThrive",
    description: deskSeo("/shipping").description || "See NutriThrive delivery prices, dispatch times, tracking, free Australian shipping from $49 and our seven-day returns information.",
    preserveTitle: Boolean(deskSeo("/shipping").title),
    preserveDescription: Boolean(deskSeo("/shipping").description),
    preserveTitle: true,
    canonicalPath: "/shipping",
    extraHead: jsonLd(faqSchema) + jsonLd(
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
        <h1>${esc(deskSeo("/shipping").h1 || "Shipping and returns")}</h1>
        <p class="lede">Orders leave Truganina. Free on Australian orders of <strong>$49</strong> or more. Under $49 in Australia, shipping is by parcel weight.</p>
        <p>${esc(SHIPPING_BAND_LIST)}</p>
        <h2>Dispatch</h2>
        <p>Order before 2pm Monday to Friday for same-day Melbourne dispatch. Free shipping is applied automatically in the cart once your Australian order reaches $49. International postage is calculated from the parcel weight.</p>
        <h2>Timing after dispatch</h2>
        <p>Melbourne metro usually 1 to 3 business days. Other metro areas usually 3 to 4 business days. Rural and regional areas up to 10 business days.</p>
        <h2>Tracking</h2>
        <p>When the parcel leaves Truganina you should get a confirmation email with tracking, if the carrier provides it. If nothing arrives within a couple of business days after dispatch, check spam or email us with your order details.</p>
        <h2 id="returns">7-day guarantee</h2>
        <p>Contact us within 7 days of delivery and we'll refund or replace your order. If something arrived damaged or faulty, send us a photo of the item and packaging, and we'll sort it at no cost to you. Change-of-mind returns must be unopened, and you pay the return postage. Original shipping isn't refunded. Please contact us before you send anything back.</p>
        <h2>Payments</h2>
        <p>${esc(PAYMENT_LINE_LONG)}</p>
        <h2>Shipping FAQ</h2>
        <div class="faq-list">${faqDetails(shippingFaqs)}</div>
        <p><a href="/privacy">Privacy policy</a> · <a href="/faq">FAQ</a> · <a href="/contact">Contact</a></p>
      </section>`,
  });
}

function privacyPage() {
  const desk = deskSeo("/privacy");
  return layout({
    title: desk.title || "Privacy Policy and Website Terms | NutriThrive",
    description:
      desk.description ||
      "NutriThrive privacy policy. How we use your data, orders, and refunds for our Melbourne-based superfoods store with Australia-wide delivery.",
    preserveTitle: Boolean(desk.title),
    preserveDescription: Boolean(desk.description),
    canonicalPath: "/privacy",
    extraHead: jsonLd(
      breadcrumbSchema([
        { name: "Home", item: `${LIVE}/` },
        { name: "Privacy policy", item: `${LIVE}/privacy` },
      ])
    ) + jsonLd({
      "@context": "https://schema.org",
      "@type": "WebPage",
      url: `${LIVE}/privacy`,
      name: "Privacy Policy and Website Terms",
      ...pageDateFields(),
    }),
    current: "",
    main: `
      <nav class="wrap-narrow crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> / <span>Privacy policy</span>
      </nav>
      <article class="page-intro wrap-narrow policy-doc">
        <h1>${esc(deskSeo("/privacy").h1 || "Privacy Policy, Terms and Conditions")}</h1>
        <p class="updated">Last updated 6 September 2026</p>

        <h2>Privacy Policy</h2>
        <h3>1. Introduction</h3>
        <p>NutriThrive ("we," "us," or "our") is committed to protecting your personal information in accordance with the Privacy Act 1988 (Cth). This policy outlines how we handle your data.</p>
        <p><strong>Legal entity:</strong> NutriThrive</p>
        <p><strong>ABN:</strong> 32 639 442 616</p>
        <p><strong>Address:</strong> ${ADDRESS_LINE}, Australia</p>
        <p><strong>Contact:</strong> <a href="mailto:nutrithrive0@gmail.com">nutrithrive0@gmail.com</a> | <a href="tel:+61438201419">0438 201 419</a></p>

        <h3>2. Information we collect</h3>
        <p>We collect information reasonably necessary for our business functions:</p>
        <ul>
          <li><strong>Identity and contact:</strong> Name, email, mobile number, and shipping address.</li>
          <li><strong>Technical data:</strong> Browser storage for your cart, IP address, browser type, and Google Analytics usage data.</li>
          <li><strong>Marketing preferences:</strong> Your email address, consent choice, signup source, and the date and time you subscribed.</li>
          <li><strong>Payment data:</strong> We do not store credit card details. All payments are processed via PayPal. We only receive transaction confirmation.</li>
        </ul>

        <h3>3. How we use your information</h3>
        <ul>
          <li><strong>Order fulfilment:</strong> Delivering products via Australia Post or Sendle.</li>
          <li><strong>Marketing:</strong> Sending newsletters and offers via email or SMS (only with your consent).</li>
          <li><strong>Improvement:</strong> Analyzing website usage to improve our service.</li>
        </ul>

        <h3>4. Browser storage and analytics</h3>
        <p>Your cart is stored in your browser on this device so items stay while you shop. We use Google Analytics to measure visits, page views, and checkout steps. Google may set its own analytics cookies. We do not show a cookie banner and we do not use advertising pixels. You can block analytics cookies in your browser settings if you prefer.</p>

        <h3>5. Sharing your data</h3>
        <p>We do not sell your data. We share necessary data with:</p>
        <ul>
          <li><strong>Shipping partners:</strong> Sendle, Australia Post, and international couriers for delivery.</li>
          <li><strong>Payment gateways:</strong> PayPal.</li>
          <li><strong>Analytics:</strong> Google Analytics, to understand how the website is used.</li>
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
          <li><strong>Refund processing:</strong> Once received and inspected, we refund to your original payment method. Full returns details are on our <a href="/shipping#returns">shipping and returns page</a>.</li>
        </ul>
        <p>Nothing in this policy excludes, restricts, or modifies any rights you have under the Australian Consumer Law that cannot be excluded.</p>

        <h3>2. Shipping and location liability</h3>
        <p><strong>Customer responsibility:</strong> It is your sole responsibility to select the correct country and enter the correct address at checkout.</p>
        <p><strong>Wrong location selection:</strong> If you select the wrong country (for example, selecting "Australia" for a US address) to bypass shipping costs or by error, NutriThrive is not responsible for the order. We reserve the right to cancel the order or refuse delivery. We are not liable for lost goods due to incorrect address details provided by the customer.</p>

        <h2>Terms of Service and Disclaimer</h2>
        <h3>1. Product nature (not certified organic)</h3>
        <p><strong>Natural product:</strong> NutriThrive products are sold as "Natural" products derived from natural ingredients.</p>
        <p><strong>Not certified organic:</strong> We explicitly state that our products are NOT "Certified Organic". We do not hold organic certification.</p>
        <p><strong>Waiver of claims:</strong> NutriThrive makes no representations or warranties of organic certification. By purchasing, you acknowledge the product is not certified organic and agree to release NutriThrive from any liability, claims, or disputes asserting otherwise.</p>

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
  const shop = LIVE_MODE ? "/products/" : "/shop/";
  return layout({
    title: "Review Your NutriThrive Shopping Cart | NutriThrive",
    description: LIVE_MODE
      ? "Review products, quantities and your NutriThrive order subtotal before continuing to secure checkout with PayPal or card."
      : "Review products, quantities, delivery estimates and your NutriThrive order subtotal before continuing to the local preview checkout.",
    canonicalPath: "/cart",
    preserveDescription: true,
    current: "",
    extraFoot: `${retentionFoot(`<script src="${CART_PAGE_SRC}?v=${ASSET_VERSION}" defer></script>`)}
<script defer>document.addEventListener("DOMContentLoaded",function(){if(window.NT&&typeof window.NT.renderCart==="function")window.NT.renderCart();});</script>`,
    robots: "noindex, nofollow",
    main: `
      <section class="page-intro wrap cart-intro">
        <div>
          <p class="eyebrow">Your order</p>
          <h1>Shopping cart</h1>
        </div>
        <a class="cart-continue" href="${shop}">Continue shopping <span aria-hidden="true">→</span></a>
      </section>
      <section class="wrap cart-layout" id="cart-layout">
        <div class="cart-main">
          <div id="cart-lines"><div class="empty-state" data-cart-placeholder><h2>Your cart is empty</h2><p>Free Australian shipping on orders from $49.</p><a class="btn btn-primary" href="${shop}moringa-powder/">Shop moringa powder</a> <a class="btn btn-secondary" href="${shop}">Shop the range</a></div></div>
          <div id="cart-buy-again"></div>
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
    preserveDescription: true,
    extraFoot: `<script src="https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js" crossorigin="anonymous" data-nt-apple-pay-sdk="1" onload="this.dataset.ntLoaded='1'" onerror="this.dataset.ntError='1'" defer></script>${paypalScripts}${LIVE_MODE ? `<script src="/assets/js/storefront/runtime-shipping-rates.js?v=${ASSET_VERSION}" defer></script>` : ""}<script src="${PAYMENT_PAGE_SRC}?v=${PAYMENT_ASSET_VERSION}" defer></script>`,
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
            <p>Add something from the shop, then return here to pay with PayPal or card.</p>
            <a class="btn btn-primary" href="${r.shop}">Continue shopping</a>
          </div>
          <div id="pay-form" class="pay-form">
            <p class="pay-copy">All transactions are secure and encrypted.</p>
            <p class="pay-copy">Review the <strong>name, email and full delivery address</strong> shown before approving your payment. We ship to the address attached to your order.</p>
            <p class="pay-copy">Apple Pay is available on eligible devices and browsers. If it does not open here, try Safari on your Apple device, or use PayPal or card below.</p>
            <div class="field">
              <label for="shipping-country">Shipping country</label>
              <select id="shipping-country">
                <option value="AU" selected>Australia</option>
              </select>
            </div>
            <div class="pay-box">
              <h2>Choose your payment method</h2>
              <div id="applepay-container" hidden></div>
              <p class="pay-copy" id="applepay-availability" hidden></p>
              <div id="paypal-button-container"></div>
              <div id="paypal-card-container"></div>
              <p class="pay-powered">Powered by PayPal</p>
              <p class="pay-copy" data-pending="guest-card-test" hidden>No PayPal account needed: choose Debit or Credit Card.</p>
              <p class="pay-status" id="pay-status" role="status"></p>
            </div>
          </div>
        </div>
        <aside class="summary" id="pay-summary">
          <h2>Order summary</h2>
          <div id="order-items"></div>
          <div class="summary-row"><span>Subtotal</span><span id="subtotal">$0.00</span></div>
          <div class="summary-row" id="bundle-discount-row" hidden><span>400g bundle offer</span><span id="bundle-discount">−$0.00</span></div>
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
    robots: LIVE_MODE ? "noindex, follow" : "noindex, nofollow",
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
  const nextSteps = `<section class="retention-block retention-next" aria-labelledby="order-next">
        <h2 id="order-next">What happens next</h2>
        <ol>
          <li>We've received your payment.</li>
          <li>We pack orders in Truganina, Melbourne.</li>
          <li>Orders placed before 2pm Monday to Friday are eligible for same-day dispatch.</li>
          <li>Check your email for confirmation, then tracking once the parcel leaves if the carrier provides it.</li>
        </ol>
        <p>Typical metro times after dispatch are on our <a href="${r.shipping}">shipping page</a>.</p>
      </section>`;
  const support = `<section class="retention-block" aria-labelledby="order-support">
        <h2 id="order-support">Need help?</h2>
        <p>If something looks wrong, contact us with your order reference. Call <a href="tel:+61438201419">+61 438 201 419</a> or email <a href="mailto:nutrithrive0@gmail.com">nutrithrive0@gmail.com</a>.</p>
        <p><a href="${r.contact}">Contact form</a> · <a href="${r.shipping}">Shipping and returns</a> · <a href="/order-help/">Order help</a></p>
      </section>`;
  const extraFoot = retentionFoot(`<script src="${THANK_YOU_PAGE_SRC}?v=${ASSET_VERSION}" defer></script>`);
  if (!LIVE_MODE) {
    return layout({
      title: "Preview Order Confirmation | NutriThrive",
      description: "View the local NutriThrive confirmation-page design after testing the preview checkout. No payment is taken and no real order is created.",
      canonicalPath: "/thank-you",
      current: "",
      robots: "noindex, nofollow",
      extraFoot,
      main: `<section class="page-intro wrap-narrow order-thanks">
      <h1>Received in this preview</h1>
      <p class="lede">Nothing was charged. To place a real order, use nutrithrive.com.au or call +61 438 201 419.</p>
      <dl class="order-thanks-list" id="order-facts" hidden>
        <div class="order-thanks-row" id="order-id-row" hidden><dt>Order reference</dt><dd id="order-id"></dd></div>
        <div class="order-thanks-row" id="order-item-row" hidden><dt>Item</dt><dd id="order-item"></dd></div>
        <div class="order-thanks-row" id="order-total-row" hidden><dt>Paid</dt><dd id="order-total"></dd></div>
      </dl>
      <div class="retention-stack">
        ${nextSteps}
        <div id="order-help-blocks"></div>
        ${support}
        <div id="order-review"></div>
        <div id="order-complements"></div>
        <div id="order-buy-again"></div>
      </div>
      <div class="order-thanks-actions"><a class="btn btn-primary" href="/shop/">Back to shop</a></div>
    </section>`,
    });
  }
  return layout({
    title: "Order confirmed | NutriThrive Australia",
    description: "View your NutriThrive order reference and delivery information after payment.",
    canonicalPath: "/thank-you.html",
    current: "",
    preserveTitle: true,
    preserveDescription: true,
    robots: "noindex, follow",
    extraFoot,
    main: `<section class="page-intro wrap-narrow order-thanks">
      <h1>Order confirmed</h1>
      <p class="lede">Thank you. We've received your payment. Keep your order reference below.</p>
      <dl class="order-thanks-list" id="order-facts" hidden>
        <div class="order-thanks-row" id="order-id-row" hidden><dt>Order reference</dt><dd id="order-id"></dd></div>
        <div class="order-thanks-row" id="order-item-row" hidden><dt>Item</dt><dd id="order-item"></dd></div>
        <div class="order-thanks-row" id="order-total-row" hidden><dt>Paid</dt><dd id="order-total"></dd></div>
      </dl>
      <div class="retention-stack">
        ${nextSteps}
        <div id="order-help-blocks"></div>
        ${support}
        <div id="order-review"></div>
        <div id="order-complements"></div>
        <div id="order-buy-again"></div>
      </div>
      <div class="order-thanks-actions">
        <a class="btn btn-primary" href="${r.shop}">Continue shopping</a>
        <a class="btn btn-secondary" href="/reorder/">Buy again</a>
      </div>
    </section>`,
  });
}

function orderHelpPage() {
  const r = routes();
  return layout({
    title: "Order help | NutriThrive Australia",
    description: "Storage, brewing and packing notes for your NutriThrive order, plus a way to contact us if something is not right.",
    canonicalPath: "/order-help/",
    current: "",
    robots: "noindex, follow",
    extraFoot: retentionFoot(`<script src="${RETENTION_PAGES_SRC}?v=${ASSET_VERSION}" defer></script>`),
    main: `<section class="page-intro wrap-narrow order-thanks" id="order-help-app">
      <h1>Help with your order</h1>
      <p class="lede">Use this page after delivery. It is for storage, brewing, packing notes, and getting in touch, not a medical or treatment guide.</p>
      <div class="retention-stack">
        <div id="order-help-blocks"></div>
        <section class="retention-block" aria-labelledby="order-help-support">
          <h2 id="order-help-support">If something is wrong</h2>
          <p>Call <a href="tel:+61438201419">+61 438 201 419</a>, email <a href="mailto:nutrithrive0@gmail.com">nutrithrive0@gmail.com</a>, or use the <a href="${r.contact}">contact form</a>. Include your order reference if you have it.</p>
          <p><a href="${r.shipping}">Shipping and returns</a></p>
        </section>
        <div id="order-help-review"></div>
        <div id="order-help-buy-again"></div>
        <div id="order-help-complements"></div>
      </div>
    </section>`,
  });
}

function reorderPage() {
  const r = routes();
  return layout({
    title: "Buy again | NutriThrive Australia",
    description: "Reorder products from a previous NutriThrive order in this browser, using current prices.",
    canonicalPath: "/reorder/",
    current: "",
    robots: "noindex, follow",
    extraFoot: retentionFoot(`<script src="${RETENTION_PAGES_SRC}?v=${ASSET_VERSION}" defer></script>`),
    main: `<section class="page-intro wrap-narrow order-thanks" id="reorder-app">
      <h1>Buy again</h1>
      <p class="lede">This page can refill your cart with products from the last order placed in this browser. Prices are always the current store prices. You still review the cart before paying.</p>
      <div id="reorder-empty" hidden>
        <p>We can only show a previous order on the same browser you used at checkout. There is no customer account, so we do not look up orders by email.</p>
        <p><a class="btn btn-primary" href="${r.shop}">Shop the range</a></p>
      </div>
      <div id="reorder-filled" hidden>
        <div id="reorder-buy-again"></div>
        <div id="reorder-progress"></div>
        <div id="reorder-complements"></div>
        <p><a class="btn btn-primary" href="${r.cart}">Review cart</a></p>
      </div>
    </section>`,
  });
}

function emitCityLandings() {
  emit("melbourne/index.html", melbournePage(), "pages/homepage/melbourne.html");
  emit("moringa-sydney/index.html", cityPage("Sydney", "sydney"));
  emit("moringa-brisbane/index.html", cityPage("Brisbane", "brisbane"));
  emit("moringa-perth/index.html", cityPage("Perth", "perth"));
  emit("moringa-adelaide/index.html", cityPage("Adelaide", "adelaide"));
}

function melbournePage() {
  const r = routes();
  const curryHref = "/products/curry-leaves/";
  const teaHref = "/products/black-tea/";
  const soapHref = "/products/moringa-soap/";
  const diwaliHref = "/products/diwali-gift-box/";
  const faqs = [
    [
      "Where can I buy curry leaves in Melbourne?",
      "Fresh punnets are at some Woolworths, Coles and Indian grocers. For dried, we pack 30g pouches in Truganina and deliver across Melbourne.",
    ],
    ["Do you sell fresh curry leaves?", "No, only dried."],
    ["Can I pick up?", "Yes, from Truganina by arrangement."],
    ["How long is delivery?", "Usually 1 to 3 business days after dispatch."],
    ["When do I order for Diwali?", "Diwali orders open until Sunday 8 November."],
    ["Do you have handmade soap in Melbourne?", "Yes, $7 for a 95g bar."],
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...pageDateFields(),
    mainEntity: faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  const cityLinks = [
    ["Melbourne", "/melbourne/"],
    ["Sydney", "/moringa-sydney/"],
    ["Brisbane", "/moringa-brisbane/"],
    ["Perth", "/moringa-perth/"],
    ["Adelaide", "/moringa-adelaide/"],
  ]
    .map(([name, href]) =>
      name === "Melbourne"
        ? `<li><span class="city-switcher__current" aria-current="page">${name}<small>Current</small></span></li>`
        : `<li><a href="${href}">${name}</a></li>`
    )
    .join("");
  const desk = deskSeo("/melbourne/");
  return layout({
    title: "Curry Leaves, Darjeeling Tea & Soap Melbourne | NutriThrive",
    description:
      desk.description ||
      "Dried curry leaves, Darjeeling loose leaf tea, handmade lavender soap and a Diwali gift box, packed in Truganina. Melbourne metro in 1 to 3 business days.",
    preserveTitle: true,
    preserveDescription: true,
    canonicalPath: "/melbourne/",
    extraHead:
      jsonLd(
        breadcrumbSchema([
          { name: "Home", item: `${LIVE}/` },
          { name: "Melbourne", item: `${LIVE}/melbourne/` },
        ])
      ) + jsonLd(faqSchema),
    current: "",
    main: `
      <div class="city-page" data-city="melbourne">

        <section class="city-local-hero">
          <div class="wrap city-local-hero__grid">
            <div class="city-local-hero__copy">
              <p class="city-local-kicker">Packed in Truganina · Melbourne west</p>
              <h1>${esc(desk.h1 || "Curry leaves, tea and soap delivered in Melbourne")}</h1>
              <p class="city-local-lead">Dried curry leaves from $7, Darjeeling tea and handmade soap. Packed in Truganina. Melbourne metro delivery usually takes 1 to 3 business days, with pickup by arrangement.</p>
              <div class="city-local-actions">
                <a class="btn btn-primary" href="${curryHref}">Shop dried curry leaves</a>
                <a class="btn btn-secondary" href="${diwaliHref}">Diwali Gift Box $20</a>
              </div>
              <ul class="city-local-proof" aria-label="Melbourne delivery highlights">
                <li><strong>Truganina</strong><span>packed in VIC</span></li>
                <li><strong>1 to 3 days</strong><span>Melbourne metro</span></li>
                <li><strong>Pickup</strong><span>by arrangement</span></li>
              </ul>
            </div>
            <figure class="city-local-visual">
              <div class="city-local-visual__image">
                <img src="/assets/images/product_webp/dried-curry-leaves-30g-main.webp" alt="NutriThrive 30g dried curry leaves pouch packed in Truganina for Melbourne" width="1254" height="1254" fetchpriority="high">
              </div>
              <figcaption>
                <span>Typical metro transit</span>
                <strong>1 to 3 business days after dispatch</strong>
                <small>Dispatched from Truganina with tracking</small>
              </figcaption>
            </figure>
          </div>
        </section>

        <section class="city-local-section" id="what-we-pack" aria-labelledby="what-we-pack-heading">
          <div class="wrap">
            <div class="city-local-section__head">
              <div><p class="city-local-kicker">From Truganina</p><h2 id="what-we-pack-heading">What we pack in Truganina</h2></div>
            </div>
            <div class="city-info-grid">
              <article class="city-info-card city-info-card--accent">
                <span class="city-info-card__number">01</span>
                <h3>Where to buy curry leaves in Melbourne</h3><p><strong>30g dried whole leaves · $7</strong></p>
                <p>Whole leaves (karipatta / kadi patta) from our farm in Gujarat for tadka, dal, sambar and curries.</p>
                <a href="${curryHref}">Shop dried curry leaves <span aria-hidden="true">→</span></a>
              </article>
              <article class="city-info-card">
                <span class="city-info-card__number">02</span>
                <h3>Loose leaf tea Melbourne</h3><p><strong>Darjeeling 100g · $7.50</strong></p>
                <p>From a family farm in Darjeeling, about 50 cups a pouch. Brew at 85–90°C for 3–5 minutes.</p>
                <a href="${teaHref}">Shop Darjeeling tea <span aria-hidden="true">→</span></a>
              </article>
              <article class="city-info-card">
                <span class="city-info-card__number">03</span>
                <h3>Handmade moringa &amp; lavender soap · 95g · $7</h3>
                <p>Handmade by us in small batches from a melt-and-pour soap base with moringa leaf, lavender fragrance and dried lavender flowers.</p>
                <a href="${soapHref}">Shop handmade soap <span aria-hidden="true">→</span></a>
              </article>
            </div>
          </div>
        </section>

        <section class="city-local-section" id="diwali-melbourne" aria-labelledby="diwali-melbourne-heading">
          <div class="wrap">
            <div class="city-local-section__head">
              <div><p class="city-local-kicker">Festival gifts</p><h2 id="diwali-melbourne-heading">Diwali gifts in Melbourne</h2></div>
            </div>
            <p>Diwali is Sunday 8 November 2026. Our Diwali Gift Box has 100g Darjeeling loose leaf tea, 30g dried curry leaves and a handmade moringa and lavender soap bar, with no moringa powder, for $20. Diwali orders open until Sunday 8 November. Prefer to collect? Message us to arrange a pickup from Truganina. Buying for a team, temple or community group? Contact us with numbers and dates.</p>
            <p style="margin-top:16px"><a class="btn btn-primary" href="${diwaliHref}">Shop the Diwali Gift Box</a></p>
          </div>
        </section>

        <section class="city-local-section city-local-section--delivery" id="delivery-melbourne" aria-labelledby="delivery-heading-melbourne">
          <div class="wrap">
            <div class="city-local-section__head">
              <div><p class="city-local-kicker">Your Melbourne order</p><h2 id="delivery-heading-melbourne">Delivery to Melbourne and pickup</h2></div>
            </div>
            <p>Orders before 2pm Monday to Friday usually leave Truganina the same day. Melbourne metro is usually 1 to 3 business days after dispatch. Free shipping on orders from $49; otherwise postage is calculated by weight. Pickup from Truganina by arrangement; we don't have a shopfront.</p>
          </div>
        </section>

        <section class="city-local-section city-local-section--faq" aria-labelledby="faq-heading-melbourne">
          <div class="wrap city-faq-layout">
            <div class="city-faq-intro">
              <p class="city-local-kicker">Quick answers</p>
              <h2 id="faq-heading-melbourne">Melbourne FAQs</h2>
            </div>
            <div class="faq-list city-faq-list">${faqDetails(faqs)}</div>
          </div>
        </section>


        <nav class="city-switcher" aria-label="Choose delivery city">
          <div class="wrap city-switcher__inner">
            <p>Delivery guides</p>
            <ul>${cityLinks}</ul>
          </div>
        </nav>
        <p class="wrap purchase-note"><a href="https://maps.app.goo.gl/9VQVEUQSeGm4XfGB7">Read NutriThrive’s Google reviews →</a></p>
      </div>`,
  });
}

function cityPage(city, slug) {
  const r = routes();
  const powderHref = "/products/moringa-powder/";
  const giftHref = "/products/gift-pack/";
  const curryHref = "/products/curry-leaves/";
  const teaHref = "/products/black-tea/";
  const soapHref = "/products/moringa-soap/";
  const diwaliHref = "/products/diwali-gift-box/";
  const diwaliGuideHref = r.article("diwali-gift-guide-curry-leaves-tea-australia");
  const curryGuideHref = r.article("dried-curry-leaves-australia-guide");
  const storeHref = r.article("how-long-does-moringa-powder-last-storage-shelf-life-2026");
  const addHref = r.article("how-to-add-moringa-to-diet");
  const tasteHref = r.article("what-does-moringa-powder-taste-like-honest-guide-2026");
  const chooseHref = r.article("how-to-choose-moringa-powder-australia-2026");
  const coffeeHref = r.article("moringa-vs-coffee-melbourne-energy-hack");
  const treeHref = r.article("grow-moringa-tree-australia");
  const verifyHref = r.article("verify-moringa-quality-premium-buyers-checklist-2026");
  const shadeHref = r.article("science-shade-drying-vs-sun-drying-moringa");
  const capsHref = r.article("moringa-capsules-vs-powder-which-is-better-2026");
  const citySeo = {
    Melbourne: {
      title: "Curry Leaves, Darjeeling Tea & Soap Melbourne | NutriThrive",
      h1: "Curry Leaves, Darjeeling Tea & Soap in Melbourne",
      description: "Buy dried curry leaves, Darjeeling loose leaf tea and handmade lavender soap in Melbourne. Packed in Truganina. Free AU shipping from $49.",
    },
    Sydney: {
      title: "Moringa Powder Sydney: Posted from Melbourne, $11",
      h1: "Moringa Powder for Sydney",
      description: "Order moringa powder to Sydney from $11/100g. NMI lab-tested, sun-dried, packed in Truganina Melbourne. Free AU shipping from $49.",
    },
    Perth: {
      title: "Moringa Powder Perth: Posted from Melbourne, $11",
      h1: "Moringa Powder Perth",
      description: "Order moringa powder to Perth from $11/100g. NMI lab-tested, sun-dried, packed in Truganina Melbourne. Free AU shipping from $49.",
    },
    Brisbane: {
      title: "Moringa Powder Brisbane: Posted from Melbourne, $11",
      h1: "Moringa Powder for Brisbane",
      description: "Order moringa powder to Brisbane from $11/100g. NMI lab-tested, sun-dried, packed in Truganina Melbourne. Free AU shipping from $49.",
    },
    Adelaide: {
      title: "Moringa Powder Adelaide: Posted from Melbourne, $11",
      h1: "Moringa Powder for Adelaide",
      description: "Order moringa powder to Adelaide from $11/100g. NMI lab-tested, sun-dried, packed in Truganina Melbourne. Free AU shipping from $49.",
    },
  }[city];
  const transitLine = {
    Melbourne: "Melbourne metro usually 1 to 3 business days after dispatch.",
    Sydney: "Sydney usually 3 to 4 business days after dispatch.",
    Brisbane: "Brisbane usually 3 to 4 business days after dispatch.",
    Adelaide: "Adelaide usually 3 to 4 business days after dispatch.",
    Perth: "Perth usually 3 to 4 business days after dispatch.",
  }[city];
  const transitLabel = {
    Melbourne: "1 to 3 business days",
    Sydney: "3 to 4 business days",
    Brisbane: "3 to 4 business days",
    Adelaide: "3 to 4 business days",
    Perth: "3 to 4 business days",
  }[city];
  const uniqueLine = {
    Melbourne: "Packed here in Truganina, fastest metro transit on our list (1 to 3 business days).",
    Sydney: "Same pouch as Melbourne; Sydney is usually 3 to 4 business days after dispatch.",
    Perth: "Same pouch as Melbourne; Perth is usually 3 to 4 business days after dispatch, tracked.",
    Brisbane: `Same pouch as Melbourne; Brisbane is usually 3 to 4 business days after dispatch. For heat/humidity storage tips see the <a href="${storeHref}">shelf-life guide</a>.`,
    Adelaide: "Same pouch as Melbourne; Adelaide is usually 3 to 4 business days after dispatch.",
  }[city];
  const pouchLine = city === "Melbourne"
    ? "Melbourne customers get the same pouch we ship Australia-wide, not a different contract pack."
    : `${city} customers get the same pouch as Melbourne, not a different contract pack.`;
  const faqs = [
    [
      `How long does shipping take to ${city}?`,
      {
        html: `${esc(transitLine)} Dispatch is before 2pm Monday–Friday Melbourne time, with tracking on every order. See <a href="${r.shipping}">shipping times</a>.`,
        text: `${transitLine} Dispatch is before 2pm Monday–Friday Melbourne time, with tracking on every order.`,
      },
    ],
    ["When is shipping free?", "Free AU shipping from $49."],
    ["Where is it packed?", "Truganina, Melbourne VIC."],
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...pageDateFields(),
    mainEntity: faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: typeof a === "object" ? a.text : a,
      },
    })),
  };
  const melbourneGuides = city === "Melbourne"
    ? `<li><a href="${verifyHref}"><span>Quality</span>Verify checklist</a></li>
            <li><a href="${shadeHref}"><span>Drying</span>Sun-dried leaf</a></li>
            <li><a href="${capsHref}"><span>Format</span>Powder vs capsules</a></li>
            <li><a href="${coffeeHref}"><span>Comparison</span>Moringa vs coffee in Melbourne</a></li>
            <li><a href="${treeHref}"><span>Growing</span>Grow a moringa tree in Australia</a></li>`
    : "";
  const melbourneQuality = city === "Melbourne"
    ? `<p>Melbourne buyers comparing quality: <a href="${verifyHref}">verify checklist</a> · <a href="${shadeHref}">sun-dried leaf</a> · <a href="${capsHref}">powder vs capsules</a>. Pickup by arrangement from Truganina. Free AU shipping from $49.</p>`
    : "";
  const melbourneCurrySection = city === "Melbourne"
    ? `<section class="city-local-section" id="curry-leaves-melbourne" aria-labelledby="curry-leaves-melbourne-heading">
          <div class="wrap">
            <div class="city-local-section__head">
              <div><p class="city-local-kicker">Melbourne pantry staples</p><h2 id="curry-leaves-melbourne-heading">Dried curry leaves in Melbourne</h2></div>
              <p>Farm-grown curry patta / kadi patta, packed in Truganina for metro Melbourne cooks who want dried leaves on hand between Woolworths or Coles fresh punnets.</p>
            </div>
            <div class="city-info-grid">
              <article class="city-info-card city-info-card--accent">
                <span class="city-info-card__number">01</span>
                <h3>Dried curry leaves · $7 / 30g</h3>
                <p>Whole sun-dried leaflets for tadka. Also called karipatta, curry patta and kadi patta. Pickup from Truganina by arrangement, or tracked metro delivery in 1–2 days.</p>
                <a href="${curryHref}">Shop dried curry leaves <span aria-hidden="true">→</span></a>
              </article>
              <article class="city-info-card">
                <span class="city-info-card__number">02</span>
                <h3>Darjeeling tea &amp; handmade soap</h3>
                <p>Family-farm Darjeeling loose leaf ($7.50 / 100g) and a handmade moringa and lavender soap bar with moringa ($7 / 95g), packed with the same Truganina dispatch window.</p>
                <a href="${teaHref}">Shop Darjeeling tea <span aria-hidden="true">→</span></a>
              </article>
              <article class="city-info-card">
                <span class="city-info-card__number">03</span>
                <h3>Diwali gift box · $20</h3>
                <p>Tea, curry leaves and soap with no moringa powder. Truganina pickup or Australia-wide shipping. Order-by dates are in the Diwali gift guide. Pick up a <a href="${diwaliHref}">Diwali Gift Box</a> from Truganina by arrangement.</p>
                <a href="${diwaliHref}">Shop the Diwali gift box <span aria-hidden="true">→</span></a>
              </article>
            </div>
            <p style="margin-top:20px"><a href="${curryGuideHref}">Where to buy dried curry leaves in Australia</a> · <a href="${diwaliGuideHref}">Diwali gifts in Melbourne</a> · <a href="${soapHref}">Handmade soap</a></p>
          </div>
        </section>`
    : "";
  const melbourneHeroLead = city === "Melbourne"
    ? "Dried curry leaves, Darjeeling loose leaf tea and handmade moringa and lavender soap packed in Truganina. Metro Melbourne delivery is usually 1–2 days after dispatch; local pickup by arrangement."
    : `Farm-grown, sun-dried moringa leaf powder packed in Truganina and sent directly to ${city}. Choose 100g, 200g or our best-value 400g option.`;
  const melbourneHeroActions = city === "Melbourne"
    ? `<a class="btn btn-primary" href="${curryHref}">Shop dried curry leaves</a>
                <a class="btn btn-secondary" href="${diwaliHref}">Diwali Gift Box $20</a>
                <a class="btn btn-secondary" href="#curry-leaves-melbourne">Melbourne pantry staples</a>`
    : `<a class="btn btn-primary" href="${powderHref}">Shop moringa powder</a>
                <a class="btn btn-secondary" href="#delivery-${slug}">See ${city} delivery</a>`;
  const melbourneProof = city === "Melbourne"
    ? `<li><strong>$7</strong><span>curry leaves 30g</span></li>
                <li><strong>$7.50</strong><span>Darjeeling 100g</span></li>
                <li><strong>$20</strong><span>Diwali gift box</span></li>`
    : `<li><strong>100%</strong><span>moringa leaf</span></li>
                <li><strong>From $11</strong><span>three sizes</span></li>
                <li><strong>Tracked</strong><span>Australia-wide</span></li>`;
  const melbourneHeroImage = city === "Melbourne"
    ? { src: "/assets/images/product_webp/dried-curry-leaves-30g-main.webp", alt: "NutriThrive 30g dried curry leaves pouch packed in Truganina for Melbourne" }
    : { src: "/assets/images/product_webp/moringa-powder-100g-main.webp", alt: `NutriThrive 100g moringa powder pouch available for delivery to ${city}` };
  const melbourneCta = city === "Melbourne"
    ? `<div><p class="city-local-kicker">Ready when you are</p><h2 id="city-cta-${slug}">Curry leaves, tea and soap from Truganina</h2><p>Shop dried curry leaves, Darjeeling tea, handmade soap, or the $20 Diwali gift box. Free AU shipping from $49.</p></div>
            <div><a class="btn btn-primary" href="${curryHref}">Shop dried curry leaves</a><a class="btn btn-secondary" href="${diwaliHref}">Diwali Gift Box $20</a><a class="btn btn-secondary" href="${giftHref}">Gift pack $35</a></div>`
    : `<div><p class="city-local-kicker">Ready when you are</p><h2 id="city-cta-${slug}">Moringa powder delivered to ${city}</h2><p>Start with 100g for $11 or compare larger sizes before adding to cart.</p></div>
            <div><a class="btn btn-primary" href="${powderHref}">Shop moringa powder</a><a class="btn btn-secondary" href="${giftHref}">See the gift pack</a></div>`;
  const canonicalPath = slug === "melbourne" ? "/melbourne/" : `/moringa-${slug}/`;
  const cityLinks = [
    ["Melbourne", "/melbourne/"],
    ["Sydney", "/moringa-sydney/"],
    ["Brisbane", "/moringa-brisbane/"],
    ["Perth", "/moringa-perth/"],
    ["Adelaide", "/moringa-adelaide/"],
  ];
  const orderedCityLinks = [
    ...cityLinks.filter(([name]) => name === city),
    ...cityLinks.filter(([name]) => name !== city),
  ];
  const citySwitcher = orderedCityLinks.map(([name, href]) => name === city
    ? `<li><span class="city-switcher__current" aria-current="page">${name}<small>Current</small></span></li>`
    : `<li><a href="${href}">${name}</a></li>`).join("");
  const cityDesk = deskSeo(canonicalPath);
  if (cityDesk.title) citySeo.title = cityDesk.title;
  if (cityDesk.description) citySeo.description = cityDesk.description;
  if (cityDesk.h1) citySeo.h1 = cityDesk.h1;
  return layout({
    title: citySeo.title,
    description: citySeo.description,
    preserveTitle: true,
    preserveDescription: true,
    canonicalPath,
    extraHead: jsonLd(
      breadcrumbSchema([
        { name: "Home", item: `${LIVE}/` },
        { name: city, item: `${LIVE}${canonicalPath}` },
      ])
    ) + jsonLd(faqSchema),
    current: "",
    main: `
      <div class="city-page" data-city="${slug}">

        <section class="city-local-hero">
          <div class="wrap city-local-hero__grid">
            <div class="city-local-hero__copy">
              <p class="city-local-kicker">Packed in Truganina, VIC · delivered to ${city}</p>
              <h1>${citySeo.h1}</h1>
              <p class="city-local-lead">${melbourneHeroLead}</p>
              <div class="city-local-actions">
                ${melbourneHeroActions}
              </div>
              <ul class="city-local-proof" aria-label="Product highlights">
                ${melbourneProof}
              </ul>
            </div>
            <figure class="city-local-visual">
              <div class="city-local-visual__image">
                <img src="${melbourneHeroImage.src}" alt="${esc(melbourneHeroImage.alt)}" width="1254" height="1254" fetchpriority="high">
              </div>
              <figcaption>
                <span>Typical metro transit</span>
                <strong>${transitLabel} after dispatch</strong>
                <small>Dispatched from Truganina with tracking</small>
              </figcaption>
            </figure>
          </div>
        </section>

        <section class="city-local-section city-local-section--delivery" id="delivery-${slug}" aria-labelledby="delivery-heading-${slug}">
          <div class="wrap">
            <div class="city-local-section__head">
              <div><p class="city-local-kicker">Your ${city} order</p><h2 id="delivery-heading-${slug}">Shipping to ${city}</h2></div>
              <p>${uniqueLine}</p>
            </div>
            <div class="city-info-grid">
              <article class="city-info-card city-info-card--accent">
                <span class="city-info-card__number">01</span>
                <h3>Delivery to ${city}</h3>
                <p>${esc(transitLine)} Orders placed before 2pm Monday–Friday are eligible for same-day dispatch. Every order includes tracking.</p>
                <a href="${r.shipping}">View full shipping information <span aria-hidden="true">→</span></a>
              </article>
              <article class="city-info-card">
                <span class="city-info-card__number">02</span>
                <h3>One ingredient</h3>
                <p>A resealable pouch of 100% moringa leaf powder with no fillers. We grow, sun-dry and manufacture it, then pack it in Truganina.</p>
                <a href="${powderHref}">See product and lab information <span aria-hidden="true">→</span></a>
              </article>
              <article class="city-info-card">
                <span class="city-info-card__number">03</span>
                <h3>Clear value</h3>
                <p>100g $11 · 200g $22 · 400g $40. Free AU shipping starts at $49.</p>
                <a href="${powderHref}">Compare all three sizes <span aria-hidden="true">→</span></a>
              </article>
            </div>
          </div>
        </section>

        ${melbourneCurrySection}

        <section class="city-local-section city-local-section--faq" aria-labelledby="faq-heading-${slug}">
          <div class="wrap city-faq-layout">
            <div class="city-faq-intro">
              <p class="city-local-kicker">Quick answers</p>
              <h2 id="faq-heading-${slug}">Ordering moringa in ${city}</h2>
              <p>Everything most customers need before choosing a pouch. For anything else, see our complete shipping information.</p>
            </div>
            <div class="faq-list city-faq-list">${faqDetails(faqs)}</div>
          </div>
        </section>


        <nav class="city-switcher" aria-label="Choose delivery city">
          <div class="wrap city-switcher__inner">
            <p>Delivery guides</p>
            <ul>${citySwitcher}</ul>
          </div>
        </nav>
        <p class="wrap purchase-note"><a href="https://maps.app.goo.gl/9VQVEUQSeGm4XfGB7">Read NutriThrive’s Google reviews →</a></p>
      </div>`,
  });
}

function journalIndex(articles, opts = {}) {
  const topicFilter = opts.topic || null;
  const bySlug = new Map(articles.map((article) => [article.slug, article]));
  const ordered = [
    ...JOURNAL_PRIORITY.map((slug) => bySlug.get(slug)).filter(Boolean),
    ...articles.filter((article) => !JOURNAL_PRIORITY.includes(article.slug)),
  ].filter((article) => !JOURNAL_REDIRECTS[article.slug] && !JOURNAL_EXTERNAL_REDIRECTS[article.slug] && !REDIRECTED_JOURNAL_SLUGS.has(article.slug));
  const featured = topicFilter ? null : ordered[0];
  const visible = topicFilter
    ? ordered.filter((article) => journalTopic(article) === topicFilter.name)
    : ordered.slice(1);
  const groups = topicFilter ? [topicFilter] : JOURNAL_TOPICS;
  const groupCards = (topic) => visible.filter((article) => journalTopic(article) === topic.name);
  const liveSeo = opts.seoFile ? extractSeo(opts.seoFile) : null;
  const r = routes();
  const canonicalPath = opts.canonicalPath || (LIVE_MODE ? "/blog/" : "/journal");
  const desk = deskSeo(canonicalPath);
  const listArticles = topicFilter
    ? visible
    : articles.filter((article) => !JOURNAL_REDIRECTS[article.slug] && !JOURNAL_EXTERNAL_REDIRECTS[article.slug] && !REDIRECTED_JOURNAL_SLUGS.has(article.slug));
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
    title: desk.title || (topicFilter
      ? `${topicFilter.name} | NutriThrive Blog`
      : liveSeo?.title || "Moringa, Curry Leaves & Tea Blog | NutriThrive"),
    description: desk.description || (topicFilter
      ? `All ${topicFilter.name.toLowerCase()} guides from NutriThrive — practical Australian notes on choosing, using and storing what we grow and pack.`
      : liveSeo?.description || "Practical Australian guides to choosing and using moringa, curry leaves and Darjeeling tea, from the NutriThrive farming and manufacturing team."),
    canonicalPath,
    current: "Blog",
    preserveTitle: Boolean(desk.title || (!topicFilter && liveSeo?.title)),
    preserveDescription: Boolean(desk.description || (!topicFilter && liveSeo?.description)),
    extraHead:
      jsonLd(breadcrumbSchema(crumbs)) +
      jsonLd({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: desk.title || (topicFilter ? `${topicFilter.name} | NutriThrive Blog` : liveSeo?.title || "NutriThrive Blog"),
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
        <h1>${esc(desk.h1 || (topicFilter ? topicFilter.name : "Blog"))}</h1>
        <p class="lede">${topicFilter
          ? `Every ${esc(topicFilter.name.toLowerCase())} guide, in one place.`
          : "Clear answers about choosing, using and storing our products—from the team that grows and manufactures our moringa and curry leaves."}</p>
        ${topicFilter ? "" : `<p class="purchase-note">Diwali 2026 (Sun 8 Nov): <a href="/products/diwali-gift-box/">$20 Diwali gift box</a> · <a href="${r.article("diwali-gift-guide-curry-leaves-tea-australia")}">Diwali gift guide</a>.</p>`}
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
      .replaceAll('href="/privacy-policy"', 'href="/privacy"')
      .replaceAll('href="/shipping"', 'href="/shipping"')
      .replaceAll('href="/shipping"', 'href="/shipping"');
    const replacements = {
      ...JOURNAL_REDIRECTS,
      "how-to-use-moringa-powder-daily-without-the-bad-taste-2026": "what-does-moringa-powder-taste-like-honest-guide-2026",
      "best-greens-powder-australia-2026": "moringa-vs-spirulina-vs-matcha-comparison-australia",
      "caffeine-cutoff-time-sleep-black-tea-2026": "how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026",
    };
    for (const [fromSlug, toSlug] of Object.entries(replacements)) {
      out = out.replaceAll(`/blog/${fromSlug}`, `/blog/${toSlug}`);
    }
    for (const [fromSlug, destination] of Object.entries(JOURNAL_EXTERNAL_REDIRECTS)) {
      out = out
        .replaceAll(`/blog/${fromSlug}.html`, destination)
        .replaceAll(`/blog/${fromSlug}`, destination);
    }
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
      .replaceAll('href="/privacy"', 'href="/privacy/"')
      .replaceAll('href="/shipping"', 'href="/shipping/"')
      .replaceAll('href="/shipping"', 'href="/shipping/"');
  }
  out = out.replaceAll("NMI lab-tested", "NMI_LAB_TESTED_KEEP");
  return out
    .replaceAll(/style="[^"]*"/g, "")
    .replaceAll(/NMI(?: Australian Government| Government)? lab-tested/gi, "tested in Australia")
    .replaceAll("NMI_LAB_TESTED_KEEP", "NMI lab-tested")
    .replaceAll(/NMI tested per batch/gi, "supported by an available Australian lab summary")
    .replaceAll(/NMI lab tested/gi, "tested in Australia")
    .replaceAll(/NMI Australian Gov(?:ernment)?(?: lab)?/gi, "Australian laboratory")
    .replaceAll(/metal and microbial results for each production batch/gi, "available testing information")
    .replaceAll(/every batch is tested by third-party Australian laboratories[^.]*\./gi, "NutriThrive publishes testing information when it is available.")
    .replaceAll(/Certificate of Analysis \(CoA\) (?:is )?available for every batch/gi, "Our moringa is tested by the National Measurement Institute. The summary for batch NT042024 is online.")
    .replaceAll(/provides Certificate of Analysis \(CoA\) for every batch/gi, "publishes testing information when available")
    .replaceAll(/every batch screened in Australian labs \(NMI\)/gi, "Australian testing information published when available")
    .replaceAll(/from partner farms in India/gi, "from our own farm")
    .replaceAll(/every batch(?: is)? lab-tested/gi, "testing information is published when available")
    .replaceAll(/lab-tested every batch/gi, "testing information published when available")
    .replaceAll(/we grow and process moringa powder in Truganina,? Melbourne/gi, "we grow and manufacture moringa on our own farm, and pack it in Truganina, Melbourne")
    .replaceAll(/grown and processed in Truganina,? Melbourne/gi, "grown and manufactured on our own farm, then packed in Truganina, Melbourne")
    .replace(/<h1(\s[^>]*)?>/gi, "<h2$1>")
    .replace(/<\/h1>/gi, "</h2>")
    // Only add the responsive wrapper when the source table is not already
    // wrapped. This keeps repeated production builds idempotent.
    .replace(/(?<!<div class="table-scroll">)<table(\s[^>]*)?>/gi, '<div class="table-scroll"><table$1>')
    .replace(/<\/table>(?!<\/div>)/gi, "</table></div>");
}

function extractArticleStructuredData(slug) {
  const file = path.join(SITE, "blog", `${slug}.html`);
  if (!fs.existsSync(file)) return "";
  const html = fs.readFileSync(file, "utf8");
  const blocks = [];
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const raw = match[1].trim();
    if (/"@type"\s*:\s*"(?:BlogPosting|Article|FAQPage)"/.test(raw)) {
      blocks.push(`<script type="application/ld+json">${raw}</script>`);
    } else if (/"@type"\s*:\s*"BreadcrumbList"/.test(raw) && /moringa-guides/.test(raw)) {
      blocks.push(`<script type="application/ld+json">${raw}</script>`);
    } else if (/"@type"\s*:\s*"ItemList"/.test(raw)) {
      blocks.push(`<script type="application/ld+json">${raw}</script>`);
    }
  }
  return blocks.join("\n  ");
}

function extractArticleProse(slug, fallbackHtml) {
  const file = path.join(SITE, "blog", `${slug}.html`);
  let html = "";
  // Prefer intentional working-tree edits. Git HEAD remains a fallback for a
  // migration where the production article does not exist in the worktree.
  if (fs.existsSync(file)) html = fs.readFileSync(file, "utf8");
  if (!html && LIVE_MODE) html = gitShowHead(`blog/${slug}.html`);
  if (!html) return fallbackHtml;
  // Production articles are already wrapped in `.prose`. Use the balanced
  // extractor for that wrapper too; the old non-greedy fallback stopped at
  // the first nested </div> and could collapse a long article to its lede.
  for (const cls of ["blog-v2-prose", "main-content", "blog-post-content", "content-wrapper", "prose"]) {
    const extracted = extractInnerByClass(html, cls);
    if (extracted.trim().length > 200) return rewriteLinks(extracted);
  }
  const migrated = html.match(/<div class="prose">([\s\S]*?)<\/div>\s*(?:<aside class="article-safety"|<section class="article-conversion")/);
  if (migrated && migrated[1].trim().length > 400) return rewriteLinks(migrated[1]);
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

const skippedArticleDates = [];
const ARTICLE_MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function articleDates(prose) {
  const records = [...String(prose).matchAll(/<strong>\s*(\d{1,2})\s+([A-Z][a-z]{2})\s+(20\d{2}):\s*<\/strong>\s*([^<]{0,140})/g)]
    .map((match) => {
      const month = ARTICLE_MONTHS[match[2].toLowerCase()];
      if (month === undefined) return null;
      const value = new Date(Date.UTC(Number(match[3]), month, Number(match[1])));
      return Number.isNaN(value.getTime()) ? null : { value, note: match[4].trim() };
    })
    .filter(Boolean)
    .sort((a, b) => a.value - b.value);
  const originalPublished = String(prose).match(/<time\b[^>]*datetime=["'](20\d{2}-\d{2}-\d{2})["'][^>]*>\s*Published\b/i)?.[1] || "";
  const originalUpdated = String(prose).match(/\bUpdated\s+(\d{1,2})\s+([A-Z][a-z]{2})\s+(20\d{2})\b/i);
  const published = records.find((record) => /\b(publish|published|created)\b/i.test(record.note))?.value
    || (originalPublished ? new Date(`${originalPublished}T00:00:00Z`) : null);
  const modified = records.at(-1)?.value
    || (originalUpdated && ARTICLE_MONTHS[originalUpdated[2].toLowerCase()] !== undefined
      ? new Date(Date.UTC(Number(originalUpdated[3]), ARTICLE_MONTHS[originalUpdated[2].toLowerCase()], Number(originalUpdated[1])))
      : null)
    || published;
  const iso = (date) => date.toISOString().slice(0, 10);
  const display = (date) => new Intl.DateTimeFormat("en-AU", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  }).format(date);
  return {
    publishedIso: published ? iso(published) : "",
    modifiedIso: modified ? iso(modified) : "",
    publishedLabel: published ? display(published) : "",
    modifiedLabel: modified ? display(modified) : "",
  };
}

function articleProseWithContents(prose, slug) {
  const used = new Set();
  const headings = [];
  const html = String(prose).replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs, inner) => {
    const label = decodeEntities(stripTags(inner)).replace(/\s+/g, " ").trim();
    if (!label) return match;
    const existing = attrs.match(/\bid=["']([^"']+)["']/i)?.[1];
    const base = (existing || label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section").slice(0, 72);
    let id = base;
    let suffix = 2;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    headings.push({ id, label });
    return `<h2${existing ? attrs : `${attrs} id="${esc(id)}"`}>${inner}</h2>`;
  });
  if (headings.length < 4) return { html, contents: "" };
  const visibleHeadings = headings.slice(0, 8);
  return {
    html,
    contents: `<nav class="article-toc" aria-labelledby="contents-${esc(slug)}">
      <h2 id="contents-${esc(slug)}">On this page</h2>
      <ol>${visibleHeadings.map(({ id, label }) => `<li><a href="#${esc(id)}" data-funnel-event="article_contents_click" data-article="${esc(slug)}">${esc(label)}</a></li>`).join("")}${headings.length > visibleHeadings.length ? `<li class="article-toc-more">${headings.length - visibleHeadings.length} more sections follow</li>` : ""}</ol>
    </nav>`,
  };
}

function dosageGuideHead(url, breadcrumbItems) {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many teaspoons of moringa powder should I take a day?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most adults do well on 1 to 2 level teaspoons a day, about 2.5 to 5 g. Start with half a teaspoon for the first week. In a 2025 study, people taking three teaspoons (about 7 g) reported more stomach symptoms than those taking one.",
        },
      },
      {
        "@type": "Question",
        name: "Is it better to take moringa in the morning or at night?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No study shows a best time. Take it with food at whatever meal you'll remember. Morning works for most people. Moringa leaf has no caffeine, so night is fine too.",
        },
      },
      {
        "@type": "Question",
        name: "Can I take moringa on an empty stomach?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can, but it's the most common cause of a queasy or unsettled stomach. Having it with food, even a piece of fruit or some yoghurt, usually avoids that.",
        },
      },
      {
        "@type": "Question",
        name: "How long does a 100 g pouch of moringa powder last?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "About 40 level teaspoons, so roughly 5 to 6 weeks at one teaspoon a day, or 3 weeks at two. Once opened, use it within a year and keep it sealed, cool and dark.",
        },
      },
      {
        "@type": "Question",
        name: "Can I put moringa powder in hot tea or coffee?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can stir it into warm drinks, but let them cool for a minute first rather than pouring on boiling water. Keep it away from coffee and black tea if iron is one of your reasons for taking it, since both can reduce iron absorption.",
        },
      },
    ],
  };
  const posting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    headline: "How Much Moringa Should I Take a Day? A Teaspoon-by-Teaspoon Guide",
    description: "Most adults need 1 to 2 level teaspoons of moringa powder a day. When to take it, how to start, taste tips and 3 easy recipes from a Melbourne grower.",
    image: [`${LIVE}/assets/images/blog/hero-moringa-powder-per-day.jpg`],
    author: {
      "@type": "Person",
      name: "Neer Vasa",
      jobTitle: "Founder",
      url: `${LIVE}/about#founder`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${LIVE}/#organization`,
      name: "NutriThrive",
      url: `${LIVE}/`,
      logo: { "@type": "ImageObject", url: `${LIVE}/assets/images/logo/logo-112.png` },
    },
    datePublished: "2026-10-15",
    dateModified: "2026-10-15",
    inLanguage: "en-AU",
    keywords: "how much moringa powder per day, how much moringa powder should i take daily, how much moringa per day, moringa powder how to use, moringa powder when to take, moringa powder morning or night",
  };
  return `${jsonLd(posting)}\n  ${jsonLd(faq)}\n  ${jsonLd(breadcrumbSchema(breadcrumbItems))}`;
}

function articlePage(meta, prose, allArticles, liveSeo = null) {
  const shop = journalProduct(meta) || PRODUCTS[0];
  const seoOverride = ARTICLE_SEO_OVERRIDES[meta.slug];
  const catalogTitle = humanCopy(stripTags(meta.seoTitle || meta.title));
  const desk = deskSeo(`/blog/${meta.slug}`);
  const title = liveSeo?.title || desk.title || seoOverride?.title || catalogTitle;
  const displayH1 = liveSeo?.h1 || desk.h1 || seoOverride?.h1 || articleDisplayH1(meta, liveSeo, title);
  const description = desk.description || seoOverride?.description || pickSeoDescription({
      file: liveSeo?.description,
      catalog: meta.description,
      slug: meta.slug,
    });
  const ledeHtml = seoOverride?.ledeHtml ? (/<[a-z][\s\S]*>/i.test(seoOverride.ledeHtml) ? seoOverride.ledeHtml : esc(seoOverride.ledeHtml)) : esc(description);
  const r = routes();
  const url = r.articleAbs(meta.slug);
  const heroSrc = seoOverride?.heroImage || meta.image;
  const socialImage = seoOverride?.ogImage || meta.image;
  const image = absUrl(socialImage);
  const category = seoOverride?.articleSection || humanCopy(meta.category);
  const topic = journalTopic(meta);
  const moringaCluster = MORINGA_CLUSTER_SEO_SLUGS.has(meta.slug) || topic === "Moringa guides";
  const preservedStructuredData = moringaCluster ? extractArticleStructuredData(meta.slug) : "";
  const cta = journalCta(meta, shop);
  const productHref = shopHref(shop);
  const quickProductLabel = meta.slug === "fathers-day-gift-under-40"
    ? "Gift Pack · $35"
    : `${shop.name} · ${money(shop.price)} ${shop.unit || ""}`;
  const isHealth = /health|pregnan|children|dog|blood|thyroid|cholesterol|pcos|menopause|anxiety|stress|gut|weight|sleep|iron|vitamin|magnesium|cortisol|berberine|inflamm|workout|pre-workout/i.test(`${meta.slug} ${category}`);
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
  const relatedArticles = [...curatedRelated, priorityArticle,...nextArticles,...globalRelated,...neighboringArticles]
    .filter((article, index, list) => article && article.slug !== meta.slug && list.findIndex((item) => item?.slug === article.slug) === index)
    .slice(0, 3);
  const dates = articleDates(prose);
  const gitDates = !dates.publishedIso || !dates.modifiedIso ? gitFileDates(`site/blog/${meta.slug}.html`) : { published: "", modified: "" };
  const schemaPublished = dates.publishedIso || gitDates.published;
  const schemaModified = dates.modifiedIso || gitDates.modified || schemaPublished;
  if (!schemaPublished) skippedArticleDates.push(meta.slug);
  const structuredWithModified = preservedStructuredData
    ? preservedStructuredData.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (match, raw) => {
        try {
          const data = JSON.parse(raw);
          if (data["@type"] === "Article" || data["@type"] === "BlogPosting") {
            const previousTitle = seoOverride?.title || liveSeo?.title || catalogTitle;
            const refreshSchema = new Set([
              "moringa-brands-comparison-australia-2026",
              "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025",
              "moringa-patches-australia-review-do-they-work",
              "rosabella-moringa-reviews-legit-or-overhyped-2026",
              "moringa-vs-coffee-melbourne-energy-hack",
              "how-long-does-moringa-powder-last-storage-shelf-life-2026",
              "grow-moringa-tree-australia",
              "moringa-and-berberine-australia-what-science-says-2026",
              "dried-curry-leaves-quality-guide-how-to-use",
            ]);
            if (desk.title && (data.headline === previousTitle || data.headline === desk.old_title || refreshSchema.has(meta.slug))) data.headline = desk.title;
            if (desk.title && (data.name === previousTitle || data.name === desk.old_title || refreshSchema.has(meta.slug))) data.name = desk.title;
            if (refreshSchema.has(meta.slug) && desk.description) data.description = desk.description;
            if (!data.datePublished && schemaPublished) data.datePublished = schemaPublished;
            if ((!data.dateModified && schemaModified) || (refreshSchema.has(meta.slug) && schemaModified)) data.dateModified = schemaModified;
            return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
          }
        } catch {
          /* leave unparseable blocks untouched */
        }
        return match;
      })
    : preservedStructuredData;
  const needsBlogPosting = Boolean(preservedStructuredData) && !/"@type"\s*:\s*"(?:Article|BlogPosting)"/.test(structuredWithModified || "");
  const blogPostingData = needsBlogPosting ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title.slice(0, 110),
    description,
    image,
    ...(schemaPublished ? { datePublished: schemaPublished } : {}),
    ...(schemaModified ? { dateModified: schemaModified } : {}),
    author: { "@type": "Person", name: "Neer Vasa", url: `${LIVE}/about` },
    publisher: {
      "@type": "Organization",
      name: "NutriThrive",
      logo: { "@type": "ImageObject", url: ORG_SCHEMA.image || `${LIVE}/assets/images/logo/logo-112.png` },
    },
    mainEntityOfPage: url,
  } : null;
  const enhancedProse = articleProseWithContents(prose, meta.slug);
  const conversionPath = ARTICLE_CONVERSION_PATHS[meta.slug] || {};
  const isMoringaPowder = ["moringa-powder", "moringa-200g", "moringa-400g"].includes(shop.id);
  const isMoringaSales = isMoringaPowder && !isHealth && MORINGA_SALES_SLUGS.has(meta.slug);
  const objectionHtml = isMoringaSales && MORINGA_OBJECTIONS[meta.slug]
    ? `<aside class="article-objections" aria-label="Before you buy">${MORINGA_OBJECTIONS[meta.slug].map((key) => OBJECTION_BLOCKS[key]).join("")}</aside>`
    : "";
  const conversionCta = conversionPath.cta || cta;
  const conversionLinks = (conversionPath.links || [])
    .map(([label, slug]) => `<li><a href="${r.article(slug)}" data-funnel-event="article_context_link_click" data-article="${esc(meta.slug)}">${esc(label)}</a></li>`)
    .join("");
  const crumbLabel = meta.slug === "how-much-moringa-powder-per-day-dosage-guide" ? "How Much Moringa Per Day?" : displayH1;
  const breadcrumbItems = moringaCluster
    ? [
        { name: "Home", item: `${LIVE}/` },
        { name: "Blog", item: `${LIVE}/blog/` },
        { name: "Moringa", item: `${LIVE}/blog/category/moringa-guides/` },
        { name: crumbLabel, item: url },
      ]
    : [
        { name: "Home", item: `${LIVE}/` },
        { name: "Blog", item: `${LIVE}/blog` },
        { name: title, item: url },
      ];
  const defaultStructuredData = preservedStructuredData
    ? ""
    : `${jsonLd({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        image: [image],
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: { "@type": "Person", name: "Neer Vasa", url: `${LIVE}/about#founder` },
        publisher: { "@id": `${LIVE}/#localbusiness` },
        ...(schemaPublished ? { datePublished: schemaPublished } : {}),
        ...(schemaModified ? { dateModified: schemaModified } : {}),
        articleSection: category,
        inLanguage: "en-AU",
      })}
  ${jsonLd(breadcrumbSchema(breadcrumbItems))}`;
  const underH1 = meta.slug === "moringa-brands-comparison-australia-2026"
    ? `
          <div class="quick-verdict">
            <h2>Our verdict: the best moringa powder in Australia for 2026</h2>
            <p><strong>Best overall for value and freshness: NutriThrive moringa leaf powder.</strong> It is farm-grown on our family farm in Gujarat, sun-dried, lab-tested by NMI in Australia and packed in Truganina, VIC. It costs $11 per 100g, or $10 per 100g in the 400g pouch, and shipping is free across Australia on orders from $49.</p>
            <p><strong>Best if you want capsules:</strong> a pharmacy capsule brand, such as those on the Chemist Warehouse shelf. They are easy to carry, but you pay far more per gram of leaf.</p>
            <p><strong>Best if certification is your priority:</strong> a certified brand from a specialist moringa seller. Check the certificate number on the pack.</p>
            <p>Yes, we sell one of these. That is why every brand below is judged on the same label facts, and why you can check each one yourself.</p>
            <p><a href="/products/moringa-powder/">Buy NutriThrive moringa powder</a></p>
          </div>`
    : meta.slug === "moringa-patches-australia-review-do-they-work"
    ? `
          <div class="quick-verdict">
            <h2>Quick verdict</h2>
            <ul>
              <li>We found no published human trial showing that moringa from Glorenda or Healrize patches gets into the body through the skin.</li>
              <li>Many buyer reviews describe small patches, slow shipping and hard-to-get refunds.</li>
              <li>Chemist Warehouse did not list moringa patches when we checked in October 2026.</li>
              <li>If you want moringa, the simple option is leaf powder you can measure by the teaspoon.</li>
            </ul>
            <p><a href="/products/moringa-powder/">See our farm-grown moringa powder</a></p>
          </div>`
    : "";
  const dosageSchemas = meta.slug === "how-much-moringa-powder-per-day-dosage-guide"
    ? dosageGuideHead(url, breadcrumbItems)
    : "";
  return layout({
    title,
    description,
    canonicalPath: LIVE_MODE ? `/blog/${meta.slug}` : `/journal/${meta.slug}`,
    current: "Blog",
    preserveTitle: Boolean(seoOverride?.title || liveSeo?.title),
    preserveDescription: true,
    ogType: "article",
    ogImage: socialImage,
    ogImageWidth: seoOverride?.ogImageWidth || 1200,
    ogImageHeight: seoOverride?.ogImageHeight || 630,
    ogTitle: desk.title || seoOverride?.ogTitle,
    ogDescription: desk.description || seoOverride?.ogDescription,
    extraHead: `<meta name="author" content="Neer Vasa">
  <meta property="article:author" content="Neer Vasa">
  <meta property="article:section" content="${esc(category)}">
  ${dosageSchemas || structuredWithModified || defaultStructuredData}
  ${blogPostingData ? jsonLd(blogPostingData) : ""}`,
    main: `
      <nav class="wrap crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> / <a href="${r.journal}">Blog</a>${moringaCluster ? ` / <a href="/blog/category/moringa-guides/">Moringa</a>` : ""} / <span>${esc(crumbLabel)}</span>
      </nav>
      <section class="wrap article-layout">
        <article data-article-slug="${esc(meta.slug)}">
          <p class="meta-line">${esc(topic)}${dates.publishedIso ? ` · Published <time datetime="${dates.publishedIso}">${dates.publishedLabel}</time>` : ""}${dates.modifiedIso && dates.modifiedIso !== dates.publishedIso ? ` · Updated <time datetime="${dates.modifiedIso}">${dates.modifiedLabel}</time>` : ""} · By <a href="${r.about}#founder" rel="author">Neer Vasa</a></p>
          <h1>${esc(displayH1)}</h1>${underH1}
          <p class="lede">${ledeHtml}</p>
          <div class="article-hero"><img src="${heroSrc}" alt="${esc(seoOverride?.heroAlt || title)}" width="${seoOverride?.heroWidth || 1200}" height="${seoOverride?.heroHeight || 675}" fetchpriority="high"></div>
          ${seoOverride?.heroCaptionHtml || ""}
          <aside class="article-quick-product" aria-label="Related NutriThrive product">
            <div><span>Related product</span><strong>${esc(quickProductLabel)}</strong>${isMoringaPowder && !isHealth ? `<small class="article-quick-facts">100g ${MORINGA_PRICES.p100} · 400g ${MORINGA_PRICES.p400} (${MORINGA_PRICES.per100In400}/100g) · Free AU shipping from $49 · <a href="${LAB_PDF}" data-funnel-event="article_lab_click" data-article="${esc(meta.slug)}">NMI lab report</a></small>` : ""}</div>
            <a href="${productHref}" data-funnel-event="article_early_product_click" data-article="${esc(meta.slug)}" data-product="${esc(shop.id)}">${esc(cta)}</a>
          </aside>
          ${enhancedProse.contents}
          ${conversionPath.methodology ? `<aside class="article-methodology" aria-labelledby="method-${esc(meta.slug)}">
            <h2 id="method-${esc(meta.slug)}">How we made this comparison</h2>
            <p>${meta.slug === "how-to-choose-moringa-powder-australia-2026" ? "We sell moringa leaf powder, so read this as a seller's guide and check our sources. The short version: look for one ingredient, a bright green colour, a readable batch date and lab paperwork you can open. Our powder is grown on our family farm in Gujarat, sun-dried and packed in Truganina, Melbourne." : "We checked public product information, available labels, prices and cited evidence. NutriThrive sells moringa powder, so we have a commercial interest in this comparison. Use the linked sources and product details to check our conclusions."}</p>
          </aside>
          ` : ""}<div class="prose">${isMoringaSales ? withMidCta(enhancedProse.html, moringaMidCta(meta.slug)) : stripMidCtas(enhancedProse.html)}</div>
          ${isHealth ? `<aside class="article-safety"><p>This is general food information. If you're pregnant, breastfeeding, on medication or managing a health condition, check with your GP first.</p></aside>` : ""}
          ${isMoringaPowder && !isHealth && CALC_SLUGS.has(meta.slug) ? per100Calculator(meta.slug) : ""}
          ${objectionHtml}
          <section class="article-conversion" aria-labelledby="article-product-${esc(meta.slug)}">
            <img src="${shop.image}" alt="${esc(shop.name)} ${esc(shop.variant)}" width="240" height="300" loading="lazy">
            <div>
              <p class="kicker">${esc(conversionPath.kicker || "A practical next step")}</p>
              <h2 id="article-product-${esc(meta.slug)}">${esc(conversionPath.title || shop.name)}</h2>
              <p>${esc(conversionPath.body || shop.detail || shop.benefit)}</p>
              <p class="price">${money(shop.price)} ${esc(shop.unit || "")}</p>${isMoringaPowder && !isHealth ? `
              <p class="ship-note">${MORINGA_PRICES.per100In400} per 100g in the 400g pouch · Free AU shipping on orders from $49 · Packed in Truganina, VIC · <a href="${LAB_PDF}">NMI lab summary</a></p>` : ""}
              <div class="btn-row">
                <a class="btn btn-primary" href="${productHref}" data-funnel-event="article_product_click" data-article="${esc(meta.slug)}" data-product="${esc(shop.id)}">${esc(conversionCta)}</a>
                <a class="btn btn-secondary" href="/shipping/" data-funnel-event="article_shipping_click">Delivery & returns</a>
              </div>${conversionLinks ? `
              <ul class="article-context-links">${conversionLinks}</ul>` : ""}
            </div>
          </section>
          ${["moringa-patches-australia-review-do-they-work", "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025"].includes(meta.slug) ? DIWALI_GROWTH_LINKS : ""}
          ${relatedArticles.length ? `<nav class="article-related" aria-labelledby="related-${esc(meta.slug)}">
            <p class="kicker">Continue with</p>
            <h2 id="related-${esc(meta.slug)}">Related ${esc(topic.toLowerCase())}</h2>
            <ul>${relatedArticles.map((article) => `<li><a href="${r.article(article.slug)}">${esc(["moringa-patches-australia-review-do-they-work", "rosabella-moringa-reviews-legit-or-overhyped-2026"].includes(meta.slug) && article.slug === "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025" ? "Moringa at Chemist Warehouse: capsules vs powder" : humanCopy(stripTags(article.title)))}</a></li>`).join("")}</ul>
          </nav>` : ""}
          <aside class="article-author">
            <p class="kicker">About the author</p>
            <h2><a href="${r.about}#founder" rel="author">Neer Vasa, NutriThrive founder</a></h2>
            <p>Neer Vasa started NutriThrive in 2023. Our moringa and curry leaves are grown on our family farm in Gujarat, India, and sun-dried to keep their colour. Neer packs every order in Truganina, Melbourne.</p>
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

function externalRedirectPage(destination) {
  const canonical = `${LIVE}${destination}`;
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page moved | NutriThrive</title><meta name="description" content="This seasonal page now leads to the current NutriThrive product."><meta name="robots" content="noindex,follow"><link rel="canonical" href="${canonical}"><link rel="icon" href="/assets/images/logo/favicon.ico" sizes="any"><meta http-equiv="refresh" content="0;url=${destination}"></head><body><main><h1>This page has moved</h1><p><a href="${destination}">View the current product</a></p></main></body></html>`;
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
    const image = metaContent(html, "og:image") || "";
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
  if (article.slug === "eye-twitching-causes-magnesium-australia-2026") {
    return "/assets/images/blog/eye-twitching-magnesium-hero-1200.webp";
  }
  if (article.slug === "diwali-hampers-australia") {
    return "/assets/images/blog/diwali-hampers-australia-hero.webp";
  }
  if (article.slug === "can-you-eat-green-sprouting-potatoes-australia-2026") {
    return "/assets/images/blog/green-potatoes-safe-to-eat-hero-1200.webp";
  }
  if (article.slug === "waking-up-at-3am-every-night-australia-2026") {
    return "/assets/images/blog/waking-up-at-3am-every-night-australia-2026.webp";
  }
  if (article.slug === "dried-curry-leaves-quality-guide-how-to-use") {
    return "/assets/images/blog/dried-curry-leaves-quality-guide-how-to-use-hero.webp";
  }
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
    fs.copyFileSync(path.join(OUT, "js/retention.js"), path.join(SITE, "assets/js/storefront/retention.js"));
    fs.copyFileSync(path.join(OUT, "js/retention-pages.js"), path.join(SITE, "assets/js/storefront/retention-pages.js"));
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
/shipping /pages/shipping/shipping-returns.html 200
/shipping/ /pages/shipping/shipping-returns.html 200
/order-help /pages/shop/order-help.html 200
/order-help/ /pages/shop/order-help.html 200
/reorder /pages/shop/reorder.html 200
/reorder/ /pages/shop/reorder.html 200
/privacy /pages/legal/privacy-policy.html 200
/privacy/ /pages/legal/privacy-policy.html 200
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
  fs.copyFileSync(path.join(OUT, "js/retention.js"), path.join(SITE, "assets/js/storefront/retention.js"));
  fs.copyFileSync(path.join(OUT, "js/retention-pages.js"), path.join(SITE, "assets/js/storefront/retention-pages.js"));
  fs.copyFileSync(path.join(ROOT, "scripts/global/cart.js"), path.join(SITE, "assets/js/storefront/runtime-cart.js"));
  fs.copyFileSync(path.join(ROOT, "scripts/global/shipping-rates.js"), path.join(SITE, "assets/js/storefront/runtime-shipping-rates.js"));
  fs.copyFileSync(path.join(ROOT, "scripts/global/paypal-client-config.js"), path.join(SITE, "assets/js/storefront/runtime-paypal-client-config.js"));
  fs.copyFileSync(path.join(ROOT, "scripts/global/paypal-sdk-loader.js"), path.join(SITE, "assets/js/storefront/runtime-paypal-sdk-loader.js"));
}

function main() {
  if (LIVE_PAGES.has("cities") || LIVE_PAGES.has("shipping")) {
    if (LIVE_PAGES.has("cities")) {
      emitCityLandings();
      console.log("Wrote city landing pages.");
    }
    if (LIVE_PAGES.has("shipping")) {
      emit("shipping/index.html", shippingPage(), "pages/shipping/shipping-returns.html");
      console.log("Wrote shipping page.");
    }
    const leftover = [...LIVE_PAGES].filter((p) => p !== "cities" && p !== "shipping");
    if (!leftover.length) return;
  }

  if (LIVE_MODE && LIVE_PAGES.size) {
    copyLiveUiAssets();
    if (LIVE_PAGES.has("home") || LIVE_PAGES.has("index") || LIVE_PAGES.has("homepage")) {
      emit("index.html", homepage());
    }
    if (LIVE_PAGES.has("shop") || LIVE_PAGES.has("products")) {
      emit("shop/index.html", shopPage(), "products/index.html");
    }
    if (LIVE_PAGES.has("journal")) {
      const articles = loadArticles().map((article) => ({...article, image: articleImage(article) }));
      const active = articles.filter(
        (article) => !JOURNAL_REDIRECTS[article.slug] && !JOURNAL_EXTERNAL_REDIRECTS[article.slug] && !REDIRECTED_JOURNAL_SLUGS.has(article.slug)
      );
      emit("blog/index.html", journalIndex(active, { canonicalPath: "/blog/", seoFile: path.join(SITE, "blog/index.html") }), "blog/index.html");
      for (const topic of JOURNAL_TOPICS) {
        emit(`blog/category/${topic.slug}/index.html`, journalIndex(active, { topic, canonicalPath: `/blog/category/${topic.slug}/` }), `blog/category/${topic.slug}/index.html`);
      }
    }
    if (LIVE_PAGES.has("payment")) emit("payment/index.html", paymentPage(), "pages/shop/payment.html");
    if (LIVE_PAGES.has("thank-you")) emit("thank-you/index.html", thankYouPage(), "pages/shop/thank-you.html");
    if (LIVE_PAGES.has("cart")) emit("cart/index.html", cartPage(), "pages/shop/cart.html");
    if (LIVE_PAGES.has("order-help")) emit("order-help/index.html", orderHelpPage(), "pages/shop/order-help.html");
    if (LIVE_PAGES.has("reorder")) emit("reorder/index.html", reorderPage(), "pages/shop/reorder.html");
    if (LIVE_PAGES.has("newsletter")) {
      emit("newsletter/index.html", newsletterPage(), "pages/newsletter/index.html");
      emit("newsletter/thank-you.html", newsletterThanksPage(), "pages/newsletter/thank-you.html");
    }
    if (LIVE_PAGES.has("shipping")) {
      emit("shipping/index.html", shippingPage(), "pages/shipping/shipping-returns.html");
    }
    for (const slug of LIVE_PAGES) {
      if (PDP[slug]) {
        const html = pdpPage(slug, PDP[slug]);
        emit(`products/${slug}/index.html`, html);
        writePage(`products/${slug}/index.html`, html, OUT);
        if (slug === "moringa-powder") {
          for (const sizeSlug of Object.keys(MORINGA_SIZE_PAGES)) {
            const sizeHtml = pdpPage(slug, powderSizePageData(sizeSlug));
            emit(`products/moringa-powder/${sizeSlug}/index.html`, sizeHtml);
            writePage(`products/moringa-powder/${sizeSlug}/index.html`, sizeHtml, OUT);
          }
        }
      }
    }
    console.log(`Wrote live storefront pages: ${[...LIVE_PAGES].join(", ")}.`);
    return;
  }

  const r = routes();
  const articles = loadArticles().map((article) => ({...article, image: articleImage(article) }));
  const activeArticles = articles.filter(
    (article) => !JOURNAL_REDIRECTS[article.slug] && !JOURNAL_EXTERNAL_REDIRECTS[article.slug] && !REDIRECTED_JOURNAL_SLUGS.has(article.slug)
  );
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
      if (slug === "moringa-powder") {
        for (const sizeSlug of Object.keys(MORINGA_SIZE_PAGES)) {
          emit(`products/moringa-powder/${sizeSlug}/index.html`, pdpPage(slug, powderSizePageData(sizeSlug)));
        }
      }
    }
    emit("about/index.html", aboutPage(), "pages/about/about.html");
    emit("contact/index.html", contactPage(), "pages/contact/contact.html");
    emit("faq/index.html", faqPage(), "pages/faq/faq.html");
    emit("shipping/index.html", shippingPage(), "pages/shipping/shipping-returns.html");
    emit("privacy/index.html", privacyPage(), "pages/legal/privacy-policy.html");
    emit("cart/index.html", cartPage(), "pages/shop/cart.html");
    emit("payment/index.html", paymentPage(), "pages/shop/payment.html");
    emit("thank-you/index.html", thankYouPage(), "pages/shop/thank-you.html");
    emit("order-help/index.html", orderHelpPage(), "pages/shop/order-help.html");
    emit("reorder/index.html", reorderPage(), "pages/shop/reorder.html");
    emit("404.html", notFoundPage());
    emitCityLandings();
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
      const fileSeo = extractSeo(file) || {};
      const trackedSeo = extractTrackedSeo(`blog/${slug}.html`) || {};
      const liveSeo = {
        ...trackedSeo,
        ...fileSeo,
        description: pickSeoDescription({
          file: fileSeo.description,
          live: trackedSeo.description,
          catalog: meta.description,
          slug,
        }),
      };
      if (JOURNAL_REDIRECTS[slug] || JOURNAL_EXTERNAL_REDIRECTS[slug]) {
        // Do not emit stub HTML. Netlify force-redirects (301!) in site/_redirects
        // own these URLs; a static file would shadow a soft redirect.
        const stubPath = path.join(SITE, "blog", `${slug}.html`);
        if (fs.existsSync(stubPath)) fs.unlinkSync(stubPath);
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
  writePage("order-help/index.html", orderHelpPage());
  writePage("reorder/index.html", reorderPage());
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
      const titleLength = decodeEntities(title?.[1] || "").length;
      const descriptionLength = decodeEntities(desc?.[1] || "").length;
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
  if (skippedArticleDates.length) {
    console.log(`Skipped datePublished (no visible date and no git add date): ${[...new Set(skippedArticleDates)].join(", ")}`);
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
