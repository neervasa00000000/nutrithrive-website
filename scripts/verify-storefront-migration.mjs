#!/usr/bin/env node
/**
 * Fail-the-build checks after STOREFRONT_PRODUCTION publishes the new UI onto production paths.
 * Does not deploy. Ranking URLs, cart/PayPal wiring, and noindex rules must hold.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { REPO_ROOT, SITE_ROOT } from "./lib/paths.mjs";
import {
  looksTruncatedMeta,
  metaContent,
  naiveMetaContent,
  normalizeMetaText,
  sameSeoText,
  visibleLength,
} from "./lib/seo-meta.mjs";

const ROOT = REPO_ROOT;
const LIVE = "https://nutrithrive.com.au";
const errors = [];
const notes = [];
const approvedSeoChanges = {
  "blog/stress-weight-gain-cortisol-mechanism-what-to-do-2026.html": {
    title: "Guide moved | NutriThrive",
    description: "This guide has moved to a clearer, consolidated NutriThrive article.",
    canonical: "https://nutrithrive.com.au/blog/moringa-calm-mind-stress-brain-fog-cortisol-science-2026",
  },
  "blog/fathers-day-gift-under-40.html": {
    title: "Last-Minute Father's Day Gift Pack $35 From Melbourne",
    description: "Last-minute Father&#39;s Day gift under $40 from Melbourne: $35 gift pack with honest shipping maths and same-day weekday dispatch from Truganina.",
  },
  "blog/curry-leaves-substitute-what-to-use-2026.html": {
    title: "Curry Leaf Substitute: 7 Best Swaps for Australian Kitchens",
    description: "No curry leaves? Compare dried curry leaves, makrut lime leaves, citrus zest and four other substitutes, with practical swap ratios for Australian cooks.",
  },
  "blog/is-moringa-safe-for-dogs-benefits-dosage-australia-2026.html": {
    title: "Is Moringa Powder Safe for Dogs? AU Dose Checklist",
    description: "Is moringa safe for dogs in Australia? Usually in moderation. Dosage by weight, mixing tips, a simple vet checklist, and when to skip leaf powder.",
  },
  "blog/moringa-vs-spirulina-vs-matcha-comparison-australia.html": {
    title: "Best Greens Powder Australia? Moringa vs Spirulina vs Matcha",
    description: "Moringa vs spirulina vs matcha for Australians: price, taste, and everyday results compared — which greens powder actually earns a spot in the pantry?",
  },
  "blog/moringa-side-effects-what-happens-take-too-much-2026.html": {
    title: "Moringa Side Effects in Australia: Start-Small Guide",
    description: "Moringa powder side effects in Australia: digestive upset, nausea, loose stools — who should avoid it, how to start small, and what the safety research says.",
  },
  "blog/moringa-powder-victoria-seniors-joint-health.html": {
    title: "How Victorian Seniors Add Moringa Powder to Everyday Meals",
    description: "How Victorian seniors add moringa powder to everyday meals: gentle food-level doses, joint-health context, and what to expect from Melbourne-packed leaf.",
  },
  "blog/ag1-alternative-australia-moringa-comparison-2026.html": {
    title: "AG1 Alternative Australia: Compare Cost, Ingredients &amp; Taste",
    description: "AG1 alternative in Australia: $150+/month vs shade-dried moringa leaf powder — cost, ingredients, taste, and when a simple pouch beats a stack.",
  },
  "blog/moringa-vs-coffee-melbourne-energy-hack.html": {
    title: "Does Moringa Have Caffeine? Moringa vs Coffee",
    description: "Moringa contains no caffeine and is not a stimulant. Compare it with coffee, learn whether they can be mixed, and choose the right option for your routine.",
  },
  "blog/science-shade-drying-vs-sun-drying-moringa.html": {
    title: "Shade vs Sun-Dried Moringa: Which Keeps Nutrients?",
  },
  "blog/moringa-brands-comparison-australia-2026.html": {
    title: "Best Moringa Brands Australia 2026: Lab Tests, Dose &amp; $/100g",
  },
  "blog/how-to-choose-moringa-powder-australia-2026.html": {
    title: "How to Choose Moringa Powder Australia — Lab Guide",
    description: "How to choose moringa powder in Australia: bright green colour, single-ingredient labels, shade-dried leaf, lab tests, price traps, and clear red flags.",
  },
  "blog/fresh-vs-dried-curry-leaves-cooking-comparison-2026.html": {
    title: "Fresh vs Dried Curry Leaves Australia: Which Wins in the Pan?",
  },
  "blog/how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026.html": {
    title: "How Much Caffeine in Darjeeling Tea vs Coffee (Australia)",
  },
  "blog/darjeeling-tea-vs-english-breakfast-comparison-2026.html": {
    title: "Darjeeling vs English Breakfast Tea: Flavour, Strength &amp; Caffeine",
  },
  "blog/moringa-before-after-workout-timing-guide-2026.html": {
    title: "Moringa Before or After Workout? Timing Guide (Australia)",
  },
  "blog/moringa-vs-whey-protein-comparison-2026.html": {
    title: "Moringa vs Whey Protein: Cost, Protein &amp; Everyday Use (AU)",
  },
  "blog/moringa-vs-ashwagandha-comparison-2026.html": {
    title: "Moringa vs Ashwagandha: Key Differences Explained",
    description: "Compare moringa and ashwagandha, including what they are, common uses, evidence limits, side effects and when to speak with a health professional.",
  },
  "blog/moringa-soap-benefits-skin-guide.html": {
    title: "Moringa Soap Benefits: Real vs Marketing (AU 2026)",
    description: "Moringa soap for skin in Australia: what&#39;s genuinely useful vs marketing hype, who it suits, and how a Melbourne-made bar compares to regular soap.",
  },
  "blog/curry-leaves-tea-how-to-make-benefits-2026.html": {
    title: "How to Make Curry Leaf Tea with Dried Leaves",
    description: "Learn how to make curry leaf tea with dried leaves, including a simple recipe, flavour tips, storage guidance and realistic evidence on health claims.",
  },
  "blog/moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026.html": {
    title: "Moringa Heavy Metals Lab Testing Australia: How to Read a CoA",
  },
  "blog/moringa-for-breastfeeding-milk-supply-2026.html": {
    title: "Moringa While Breastfeeding: What Evidence Says (Australia)",
  },
  "blog/how-long-does-moringa-powder-last-storage-shelf-life-2026.html": {
    title: "How Long Does Moringa Powder Last in Australia? (Opened + Sealed)",
    description: "How long does moringa powder last in Australia? Unopened 12–24 months; opened ~18 months if sealed and cool, spring heat, fridge mistakes, Truganina pack dates.",
  },
  "blog/is-moringa-safe-for-children-kids-dosage-2026.html": {
    title: "Is Moringa Safe for Kids in Australia? Dosage by Age",
    description: "Is moringa safe for kids in Australia? Age-by-age powder doses, babies vs children, GP checkpoints, and food-level leaf use — with free AU shipping at $49.50.",
  },
  "blog/how-to-add-moringa-to-diet.html": {
    title: "How to Add Moringa Powder to Food Without Bitterness",
    description: "How to add moringa powder to smoothies and meals without bitterness — 5 AU kitchen methods, taste fixes, and when to buy shade-dried leaf from $11/100g.",
  },
  "blog/moringa-and-berberine-australia-what-science-says-2026.html": {
    description: "Moringa and berberine in Australia: what the science says on patches vs oral leaf powder, interaction risk, TGA context, and when to ask your GP.",
  },
  "blog/rosabella-moringa-reviews-legit-or-overhyped-2026.html": {
    title: "Rosabella Moringa Reviews 2026: Lab Gaps &amp; Dose Maths",
    description: "Rosabella moringa reviews (AU 2026): lab transparency gap, $/gram vs powder, Salmonella recall notes, dose maths, and when pure leaf powder is the better buy.",
  },
  "blog/afl-finals-snacks-curry-leaf-tadka.html": {
    description: "AFL finals snacks without party pies: curry-leaf tadka over nuts or popcorn. Dried kari leaf 30g from Truganina at $7, ready before Week 2 Thursday.",
  },
  "blog/chemist-warehouse-greens-vs-moringa-powder-2026.html": {
    description: "Chemist Warehouse Vital Organic Greens vs $11 moringa: label walk-through, $/100g maths, and when one shade-dried leaf from Truganina is enough.",
  },
  "blog/moringa-avocado-toast-recipe-anti-inflammatory-breakfast-2026.html": {
    description: "Moringa avocado toast recipe for Australia: an easy anti-inflammatory breakfast in about 5 minutes, with shade-dried leaf powder tips from Melbourne.",
  },
  "blog/cold-brew-darjeeling-australian-spring-2026.html": {
    description: "Cold-brew Darjeeling tea for Australian spring: fridge method, brew ratios, Melbourne tap tips, and why hot-brew-then-ice goes bitter ($7.50/100g).",
  },
  "blog/high-protein-moringa-recipes-australia-2026.html": {
    description: "Ten high-protein moringa recipes (15–40g protein per serve) for Australia — tested shakes, bowls, and meals using shade-dried leaf powder daily.",
  },
  "blog/nutrithrive-dried-curry-leaves-tradition-health.html": {
    title: "Dried Curry Leaves: Health Benefits &amp; Uses in Australia",
    description: "Dried curry leaves for Australian cooks: tradition, everyday uses, storage tips, and what to expect from shade-dried leaves packed in Melbourne (2026).",
  },
  "blog/grow-moringa-tree-australia.html": {
    title: "Grow a Moringa Tree in Australia: Pots &amp; Climate Guide",
    description: "Learn how to grow moringa in Australia, including pot size, germination, winter dormancy and climate tips for Melbourne, Perth and warmer regions.",
  },
};

function resolveFile(rel) {
  if (rel.startsWith("netlify/") || rel.startsWith("scripts/")) {
    return path.join(ROOT, rel);
  }
  const siteFile = path.join(SITE_ROOT, rel);
  if (fs.existsSync(siteFile)) return siteFile;
  return path.join(ROOT, rel);
}

function read(rel) {
  const file = resolveFile(rel);
  if (!fs.existsSync(file)) {
    errors.push(`missing file ${rel}`);
    return "";
  }
  return fs.readFileSync(file, "utf8");
}

function mustInclude(rel, needle, label = needle) {
  const html = read(rel);
  if (html && !html.includes(needle)) errors.push(`${rel}: missing ${label}`);
}

function mustNotInclude(rel, needle, label = needle) {
  const html = read(rel);
  if (html && html.includes(needle)) errors.push(`${rel}: unexpected ${label}`);
}

function attr(html, re, field) {
  const match = html.match(re);
  return match?.[1] || "";
}

function original(rel) {
  for (const spec of [`HEAD:site/${rel}`, `HEAD:${rel}`]) {
    try {
      return execFileSync("git", ["show", spec], {
        cwd: ROOT,
        encoding: "utf8",
        maxBuffer: 20 * 1024 * 1024,
        stdio: ["ignore", "pipe", "ignore"],
      });
    } catch {
      // Try pre- and post-site/ git paths.
    }
  }
  return "";
}

function seoFields(html) {
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] || "";
  return {
    title: normalizeMetaText(title),
    description: normalizeMetaText(metaContent(html, "description") || ""),
    canonical: attr(html, /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)/i)
      || attr(html, /<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i),
  };
}

// Changing local folders is harmless to Google; changing established public
// article metadata is not. Compare every tracked article against the pre-migration
// commit and fail if its title, description, or canonical moved.
let trackedBlogs = [];
try {
  for (const prefix of ["site/blog", "blog"]) {
    const listed = execFileSync("git", ["ls-tree", "-r", "--name-only", "HEAD", prefix], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim().split("\n").filter((rel) => rel.endsWith(".html") && !rel.includes("/category/") && !rel.includes("/partials/"));
    if (listed.length) {
      trackedBlogs = listed.map((rel) => rel.replace(/^site\//, ""));
      break;
    }
  }
} catch (error) {
  errors.push(`could not read the SEO baseline from git: ${error.message}`);
}
for (const rel of trackedBlogs) {
  const before = seoFields(original(rel));
  const after = seoFields(read(rel));
  for (const field of ["title", "description", "canonical"]) {
    if (sameSeoText(before[field], after[field])) continue;
    const approvedValue = approvedSeoChanges[rel]?.[field];
    if (approvedValue != null && sameSeoText(approvedValue, after[field])) continue;
    const renamedJournal =
      field === "title" &&
      String(before[field] || "").replace(/Journal/g, "Blog") === String(after[field] || "");
    if (renamedJournal) continue;
    if (field === "description") {
      const originalHtml = original(rel);
      const naiveBefore = normalizeMetaText(naiveMetaContent(originalHtml));
      const repaired =
        (looksTruncatedMeta(before[field]) || looksTruncatedMeta(naiveBefore) || naiveBefore !== normalizeMetaText(before[field])) &&
        !looksTruncatedMeta(after[field]) &&
        visibleLength(after[field]) >= 120 &&
        visibleLength(after[field]) <= 160;
      if (repaired) continue;
    }
    errors.push(`${rel}: ${field} changed during migration`);
  }
}

const generatedHtml = [
  "index.html",
  "products/index.html",
  "404.html",
  "pages/about/about.html",
  "pages/contact/contact.html",
  "pages/faq/faq.html",
  "pages/shipping/shipping-returns.html",
  "pages/legal/privacy-policy.html",
  "pages/shop/cart.html",
  "pages/shop/payment.html",
  "pages/shop/thank-you.html",
  "pages/newsletter/index.html",
  ...trackedBlogs.filter((rel) => !rel.includes("/partials/")),
];
for (const rel of generatedHtml) {
  const html = read(rel);
  if (!html) continue;
  for (const match of html.matchAll(/<(?:img|script|link)\b[^>]*\s(?:src|href)=["'](\/assets\/[^"'?#]+)[^"']*["'][^>]*>/gi)) {
    if (!fs.existsSync(path.join(SITE_ROOT, match[1].slice(1)))) errors.push(`${rel}: broken asset ${match[1]}`);
  }
  for (const match of html.matchAll(/<script type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1]); } catch { errors.push(`${rel}: invalid JSON-LD`); }
  }
  if (rel !== "404.html" && !html.includes('rel="icon"')) errors.push(`${rel}: missing favicon`);
  if (/<img\b(?![^>]*\balt=)[^>]*>/i.test(html)) errors.push(`${rel}: image missing alt text`);
  if (/(?:free (?:AU |Australian )?shipping)[^<\n]{0,45}(?:\$|AUD\s*)80|(?:under|clear(?:s|ing)?)\s+(?:AU)?\$80/i.test(html)) {
    errors.push(`${rel}: stale $80 free-shipping threshold`);
  }
  if (/^blog\/[^/]+\.html$/.test(rel) && rel !== "blog/index.html" && /content="index,\s*follow"/i.test(html)) {
    if (!html.includes("article-quick-product")) errors.push(`${rel}: missing early article-to-product path`);
    if (!html.includes("article-conversion")) errors.push(`${rel}: missing article product conversion section`);
    if (!html.includes("article-related")) errors.push(`${rel}: missing related article navigation`);
  }
}

const home = read("index.html");
if (home) {
  const title = attr(home, /<title>([^<]*)<\/title>/i);
  if (title !== "NutriThrive: Moringa Powder, Curry Leaves &amp; Tea | Melbourne") {
    errors.push(`homepage title changed: "${title}"`);
  }
  if (!/content="index,\s*follow"/i.test(home)) errors.push("homepage is not index,follow");
  mustInclude("index.html", 'rel="canonical" href="https://nutrithrive.com.au/"', "homepage canonical");
  mustInclude("index.html", "/assets/images/og/nutrithrive-share-1200x630.jpg", "share image");
  mustInclude("index.html", "/assets/css/storefront-system", "new UI CSS");
  mustInclude("index.html", "/assets/js/storefront/runtime-cart", "production cart");
  mustInclude("index.html", 'data-nt-live="1"', "live flag");
  mustNotInclude("index.html", "This is a design preview", "preview footer");
  mustNotInclude("index.html", 'href="/checkout/"', "preview checkout link");
  mustNotInclude("index.html", 'href="/journal/"', "homepage still linking to /journal/");
  if (!home.includes('href="/blog/">Blog')) errors.push("homepage missing Blog nav link to /blog/");
}

const startHere = [
  ["blog/curry-leaves-substitute-what-to-use-2026.html", "Curry Leaf Substitute: 7 Best Swaps for Australian Kitchens", "$49.50"],
  ["blog/is-moringa-safe-for-dogs-benefits-dosage-australia-2026.html", "Is Moringa Powder Safe for Dogs? AU Dose Checklist", null],
  ["blog/moringa-vs-spirulina-vs-matcha-comparison-australia.html", "Best Greens Powder Australia? Moringa vs Spirulina vs Matcha", "$49.50"],
  ["blog/moringa-side-effects-what-happens-take-too-much-2026.html", "Moringa Side Effects in Australia: Start-Small Guide", null],
  ["blog/moringa-powder-victoria-seniors-joint-health.html", "How Victorian Seniors Add Moringa Powder to Everyday Meals", "$49.50"],
  ["blog/ag1-alternative-australia-moringa-comparison-2026.html", "AG1 Alternative Australia: Compare Cost, Ingredients & Taste", "$49.50"],
];
for (const [rel, expected, postage] of startHere) {
  const html = read(rel);
  if (!html) continue;
  const h1 = html.match(/<h1[^>]*>([^<]*)<\/h1>/i)?.[1]?.replaceAll("&amp;", "&");
  if (h1 !== expected) errors.push(`${rel}: H1 is "${h1}"`);
  if (postage && !html.includes(postage)) errors.push(`${rel}: missing ${postage}`);
}
const teaHtml = read("products/black-tea/index.html");
if (teaHtml && !teaHtml.includes("<title>Darjeeling Black Tea Australia — First Flush | $7.50 | NutriThrive</title>")) {
  errors.push("products/black-tea/index.html: title not updated");
}
const curryHtml = read("products/curry-leaves/index.html");
if (curryHtml && !curryHtml.includes("<title>Dried Curry Leaves Australia — Shade-Dried Kari Leaf | $7</title>")) {
  errors.push("products/curry-leaves/index.html: title not updated");
}

const articleRel = "blog/how-to-add-moringa-to-diet.html";
const article = read(articleRel);
if (article) {
  const canonical = attr(article, /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)
    || attr(article, /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  if (canonical !== `${LIVE}/blog/how-to-add-moringa-to-diet`) {
    errors.push(`${articleRel}: canonical is "${canonical}"`);
  }
  const title = normalizeMetaText(attr(article, /<title>([^<]*)<\/title>/i));
  if (title !== "How to Add Moringa Powder to Food Without Bitterness") {
    errors.push(`${articleRel}: title changed to "${title}"`);
  }
  if (!/content="index,\s*follow"/i.test(article)) errors.push(`${articleRel}: not index,follow`);
  mustInclude(articleRel, "/assets/css/storefront-system", "article new UI");
  mustNotInclude(articleRel, 'href="/journal/how-to-add-moringa-to-diet/', "journal slug link on ranking article");
  if (!article.includes("Melbourne Morning Smoothie") && !article.includes("Quick Answer")) {
    errors.push(`${articleRel}: article body looks truncated; original prose is missing`);
  }
}

const blogIndex = read("blog/index.html");
if (blogIndex) {
  mustInclude("blog/index.html", 'rel="canonical" href="https://nutrithrive.com.au/blog/"', "blog index canonical");
  if (!blogIndex.includes('href="/blog/">Blog') && !blogIndex.includes("aria-current=\"page\">Blog")) {
    errors.push("blog index missing Blog nav label");
  }
  mustNotInclude("blog/index.html", 'href="/journal/"', "blog index still linking to /journal/");
  const blogH1 = blogIndex.match(/<h1>([^<]*)<\/h1>/i)?.[1];
  if (blogH1 !== "Blog") errors.push(`blog/index.html H1 is "${blogH1}"`);
  mustInclude("blog/index.html", "journal-grid--preview", "blog index topic previews");
  mustInclude("blog/index.html", "Explore all", "blog index explore-more links");
  mustInclude("blog/index.html", "data-journal-extra hidden", "extra blog cards stay collapsed");
}

const moringaGuides = read("blog/category/moringa-guides/index.html");
if (moringaGuides) {
  mustInclude("blog/category/moringa-guides/index.html", "<h1>Moringa guides</h1>", "moringa guides category heading");
  mustInclude("blog/category/moringa-guides/index.html", 'rel="canonical" href="https://nutrithrive.com.au/blog/category/moringa-guides/"', "moringa guides canonical");
}

const pdp = read("products/moringa-powder/index.html");
if (pdp) {
  mustInclude("products/moringa-powder/index.html", 'rel="canonical" href="https://nutrithrive.com.au/products/moringa-powder/"', "PDP canonical");
  mustInclude("products/moringa-powder/index.html", "&quot;id&quot;:&quot;moringa-powder&quot;", "PayPal catalog id");
  mustInclude("products/moringa-powder/index.html", "data-add=", "add to cart");
  mustInclude("products/moringa-powder/index.html", "data-buy-now=", "buy now");
  if (pdp.includes("&quot;id&quot;:&quot;moringa-powder-100g&quot;")) {
    errors.push("products/moringa-powder/index.html: unexpected preview-only product id");
  }
}

const cart = read("pages/shop/cart.html");
if (cart) {
  if (!/noindex/i.test(cart)) errors.push("cart page must stay noindex");
  mustInclude("pages/shop/cart.html", "/assets/js/storefront/cart-page", "new cart UI script");
  mustInclude("pages/shop/cart.html", "/assets/js/storefront/runtime-cart", "production cart");
  mustNotInclude("pages/shop/cart.html", 'href="/checkout/"', "preview checkout on live cart");
}

const newsletter = read("pages/newsletter/index.html");
if (newsletter) {
  mustInclude("pages/newsletter/index.html", "/assets/css/storefront-system", "newsletter new UI CSS");
  mustInclude("pages/newsletter/index.html", 'data-nt-live="1"', "live flag");
  mustInclude("pages/newsletter/index.html", 'name="newsletter"', "Netlify newsletter form");
  mustNotInclude("pages/newsletter/index.html", "design-system.min.css", "old design system CSS");
  mustNotInclude("pages/newsletter/index.html", "Join thousands", "old newsletter pitch");
}

const payment = read("pages/shop/payment.html");
if (payment) {
  if (!/noindex/i.test(payment)) errors.push("payment page must stay noindex");
  mustInclude("pages/shop/payment.html", "/assets/css/storefront-system", "new UI CSS");
  mustInclude("pages/shop/payment.html", 'data-nt-live="1"', "live flag");
  mustInclude("pages/shop/payment.html", "/assets/js/storefront/runtime-cart", "production cart");
  mustInclude("pages/shop/payment.html", "paypal-client-config", "PayPal client config");
  mustInclude("pages/shop/payment.html", "paypal-sdk-loader", "PayPal SDK loader");
  mustInclude("pages/shop/payment.html", "/assets/js/storefront/payment-page", "new payment UI script");
  mustInclude("pages/shop/payment.html", 'id="paypal-button-container"', "PayPal buttons mount");
  mustInclude("pages/shop/payment.html", 'id="shipping-country"', "shipping country select");
  mustNotInclude("pages/shop/payment.html", "design-system.min.css", "old design system CSS");
  mustNotInclude("pages/shop/payment.html", "footer-v2", "old footer");
  mustNotInclude("pages/shop/payment.html", 'href="/checkout/"', "preview checkout on payment");
}
const paymentJs = read("assets/js/storefront/payment-page.js");
if (paymentJs) {
  if (!paymentJs.includes("paypal-create-order")) errors.push("payment page script lost PayPal create-order");
  if (!paymentJs.includes("paypal-capture-order")) errors.push("payment page script lost PayPal capture-order");
  if (!paymentJs.includes("ntLoadPayPalSdk")) errors.push("payment page script lost PayPal SDK loader");
  for (const eventName of ["begin_checkout", "add_shipping_info", "add_payment_info"]) {
    if (!paymentJs.includes(eventName)) errors.push(`payment page script lost GA ${eventName} event`);
  }
}

const thanks = read("pages/shop/thank-you.html");
if (thanks) {
  if (!/noindex/i.test(thanks)) errors.push("order thank-you page must stay noindex");
  mustInclude("pages/shop/thank-you.html", "/assets/css/storefront-system", "new UI CSS");
  mustInclude("pages/shop/thank-you.html", 'data-nt-live="1"', "live flag");
  mustInclude("pages/shop/thank-you.html", "/assets/js/storefront/thank-you-page", "order thank-you script");
  mustInclude("pages/shop/thank-you.html", 'id="order-id"', "order reference");
  mustNotInclude("pages/shop/thank-you.html", "googletagmanager.com/gtag", "inline analytics tag");
  mustNotInclude("pages/shop/thank-you.html", "design-system.min.css", "old design system CSS");
  mustNotInclude("pages/shop/thank-you.html", "footer-v2", "old footer");
  mustNotInclude("pages/shop/thank-you.html", "thank-you-icon", "old checkmark block");
}
const thanksJs = read("assets/js/storefront/thank-you-page.js");
if (thanksJs) {
  if (!thanksJs.includes('gtag("event", "purchase"') && !thanksJs.includes("gtag('event', 'purchase'")) {
    errors.push("thank-you page script lost GA purchase event");
  }
  if (!thanksJs.includes('track", "Purchase') && !thanksJs.includes("track', 'Purchase")) {
    errors.push("thank-you page script lost Reddit Purchase event");
  }
}

const redirects = read("_redirects");
if (redirects) {
  if (!redirects.includes("/shop /products/ 301")) errors.push("_redirects missing /shop → /products/");
  if (!redirects.includes("/journal/:slug /blog/:slug 301")) errors.push("_redirects missing /journal/:slug → /blog/:slug");
  if (!redirects.includes("/journal /blog/ 301")) errors.push("_redirects missing /journal → /blog/");
  if (!redirects.includes("/journal/ /blog/ 301")) errors.push("_redirects missing /journal/ → /blog/");
  if (redirects.includes("/journal /journal/index.html 200")) errors.push("_redirects still serve /journal as a duplicate index");
  if (redirects.includes("/blog/ /journal/")) errors.push("_redirects must not send /blog/ to /journal/");
  if (!redirects.includes("/cart /pages/shop/cart.html 200")) errors.push("_redirects lost /cart rewrite");
  if (!redirects.includes("/payment /pages/shop/payment.html 200")) errors.push("_redirects lost /payment rewrite");
  if (!redirects.includes("/thank-you.html /pages/shop/thank-you.html 200")) errors.push("_redirects lost /thank-you.html rewrite");
  if (!redirects.includes("/newsletter /pages/newsletter/ 301")) errors.push("_redirects missing /newsletter → /pages/newsletter/");
  if (redirects.includes("/shipping /shipping 200")) errors.push("_redirects /shipping is a self-loop 404");
  if (!redirects.includes("/shipping /pages/shipping/shipping-returns.html 200")) {
    errors.push("_redirects lost /shipping rewrite");
  }
  if (redirects.includes("/privacy /privacy-policy 301")) errors.push("_redirects still 301 /privacy to /privacy-policy");
  if (redirects.includes("/privacy-policy /privacy 301")) errors.push("_redirects must not 301 /privacy-policy to /privacy");
  if (!redirects.includes("/privacy /pages/legal/privacy-policy.html 200")) {
    errors.push("_redirects lost /privacy rewrite");
  }
  if (!redirects.includes("/privacy-policy /404.html 404")) errors.push("_redirects lost /privacy-policy 404");
  const privacyHtml = read("pages/legal/privacy-policy.html");
  if (privacyHtml) {
    const privacyCanon = attr(privacyHtml, /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)
      || attr(privacyHtml, /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
    if (privacyCanon !== `${LIVE}/privacy`) errors.push(`privacy canonical is "${privacyCanon}"`);
    if (!privacyHtml.includes('property="og:url" content="https://nutrithrive.com.au/privacy"')) {
      errors.push("privacy og:url is not /privacy");
    }
    if (privacyHtml.includes("/privacy-policy")) errors.push("privacy page still references /privacy-policy");
  }
  if (!redirects.includes("/blog/moringa-powder-complete-buyers-guide-australia-2026 /products/moringa-powder/ 301")) {
    errors.push("_redirects missing D1 buyers-guide → powder PDP");
  }
  if (!redirects.includes("/products/darjeeling-tea/ /products/black-tea/ 301")) errors.push("_redirects missing D4 darjeeling-tea → black-tea");
  if (!redirects.includes("/checkout /payment 301")) errors.push("_redirects missing D5 /checkout → /payment");
  if (!redirects.includes("/blog/nutri-thrive-clean-moringa-protein-2026-guide /blog/moringa-vs-whey-protein-comparison-2026 301")) {
    errors.push("_redirects missing D6 protein guide → whey compare");
  }
  if (!redirects.includes("/blog/gut-health-meal-plan-australia-7-day-guide-2026 /blog/how-to-add-moringa-to-diet 301")) {
    errors.push("_redirects missing D7 gut-plan → how-to-add");
  }
  if (!redirects.includes("/blog/is-moringa-banned-australia-truth-2026 /404.html 410")) {
    errors.push("_redirects lost D2 banned-truth 410 HOLD");
  }
  if (!redirects.includes("/blog/is-moringa-banned-in-australia /404.html 410")) {
    errors.push("_redirects lost D3 banned-in-australia 410 HOLD");
  }
  if (!redirects.includes("/blog/moringa-eyesight-better-than-carrots /404.html 410")) {
    errors.push("_redirects lost eyesight 410");
  }
  if (redirects.includes("/products/patches/") && /\/products\/patches\/\s+\S+\s+301/.test(redirects)) {
    errors.push("_redirects must not 301 /products/patches/");
  }
  if (/edible-beauty[^\n]*301/.test(redirects)) errors.push("_redirects must not 301 edible-beauty");
}

for (const asset of [
  "assets/css/storefront-system.css",
  "assets/js/storefront/site.js",
  "assets/js/storefront/catalog.js",
  "assets/js/storefront/search-index.js",
  "assets/js/storefront/cart-page.js",
  "assets/js/storefront/payment-page.js",
  "assets/js/storefront/thank-you-page.js",
  "assets/js/storefront/runtime-cart.js",
  "assets/js/storefront/runtime-paypal-client-config.js",
  "assets/js/storefront/runtime-paypal-sdk-loader.js",
  "netlify/functions/paypal-create-order.js",
  "netlify/functions/paypal-capture-order.js",
]) {
  if (!fs.existsSync(resolveFile(asset))) errors.push(`missing ${asset}`);
}

const catalog = read("assets/js/storefront/catalog.js");
const paypalIds = [
  "moringa-powder",
  "moringa-200g",
  "moringa-400g",
  "curry-leaves",
  "black-tea",
  "moringa-soap",
  "combo-pack",
  "gift-pack",
];
for (const id of paypalIds) {
  if (catalog && !catalog.includes(`"id":"${id}"`)) errors.push(`catalog missing PayPal id ${id}`);
}

const storefrontSiteJs = read("assets/js/storefront/site.js");
if (!storefrontSiteJs.includes("G-WH21SW75WP") || !storefrontSiteJs.includes("loadGoogleAnalytics")) {
  errors.push("GA loader is missing from storefront site script");
}
if (storefrontSiteJs.includes("bindCookieChoices") || storefrontSiteJs.includes("applyOptionalConsent")) {
  errors.push("cookie consent gate is still in the storefront site script");
}
if (!storefrontSiteJs.includes("googletagmanager.com/gtag/js")) {
  errors.push("storefront site script no longer loads the Google tag");
}
for (const eventName of ["view_item_list", "select_item", "view_item", "add_to_cart", "remove_from_cart"]) {
  if (!storefrontSiteJs.includes(eventName)) errors.push(`storefront site script lost GA ${eventName} event`);
}
const cartJs = read("assets/js/storefront/cart-page.js");
if (!cartJs.includes("view_cart")) errors.push("cart page script lost GA view_cart event");
if (!cartJs.includes("shipping-progress")) errors.push("cart page script lost free-shipping progress indicator");
mustNotInclude("index.html", "googletagmanager.com/gtag", "inline analytics tag");
mustNotInclude("index.html", "data-cookie-banner", "cookie banner");
mustNotInclude("index.html", "data-cookie-settings", "cookie settings");
mustNotInclude("pages/shop/payment.html", "storefront-checkout", "preview checkout on payment");
mustNotInclude("pages/shop/payment.html", "PayPal may open a new tab", "frozen PayPal handoff copy");

if (fs.existsSync(path.join(SITE_ROOT, "journal/how-to-add-moringa-to-diet/index.html"))) {
  notes.push("preview journal article folders still exist under /journal/; Netlify ignore should keep storefront unpublished, and /journal/:slug 301s to /blog/:slug");
}

for (const rel of trackedBlogs) {
  if (!/^blog\/[^/]+\.html$/.test(rel) || rel === "blog/index.html") continue;
  const html = read(rel);
  if (!html || /http-equiv=["']refresh["']/i.test(html) || /content=["']noindex/i.test(html)) continue;
  const description = normalizeMetaText(metaContent(html, "description") || "");
  const naive = normalizeMetaText(naiveMetaContent(html));
  if (looksTruncatedMeta(description) || naive !== description) {
    errors.push(`${rel}: meta description still truncates at an apostrophe or mid-sentence ("${naive || description}")`);
  }
  const length = visibleLength(description);
  if (length && (length < 120 || length > 160)) {
    errors.push(`${rel}: description length ${length}`);
  }
}

if (errors.length) {
  console.error(`storefront live verify failed (${errors.length}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`storefront migration verify: ${trackedBlogs.length} ranking article metadata records preserved; assets, structured data, cart and PayPal wiring look intact.`);
for (const note of notes) console.log(`note: ${note}`);
