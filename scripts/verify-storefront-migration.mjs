#!/usr/bin/env node
/**
 * Fail-the-build checks after STOREFRONT_PRODUCTION publishes the new UI onto production paths.
 * Does not deploy. Ranking URLs, cart/PayPal wiring, and noindex rules must hold.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { REPO_ROOT, SITE_ROOT } from "./lib/paths.mjs";

const ROOT = REPO_ROOT;
const LIVE = "https://nutrithrive.com.au";
const errors = [];
const notes = [];

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
  return {
    title: attr(html, /<title>([^<]*)<\/title>/i),
    description: attr(html, /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)/i),
    canonical: attr(html, /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)/i),
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
    if (before[field] !== after[field]) {
      const renamedJournal =
        field === "title" &&
        String(before[field] || "").replace(/Journal/g, "Blog") === String(after[field] || "");
      if (!renamedJournal) errors.push(`${rel}: ${field} changed during migration`);
    }
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

const articleRel = "blog/how-to-add-moringa-to-diet.html";
const article = read(articleRel);
if (article) {
  const canonical = attr(article, /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)
    || attr(article, /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  if (canonical !== `${LIVE}/blog/how-to-add-moringa-to-diet`) {
    errors.push(`${articleRel}: canonical is "${canonical}"`);
  }
  const title = attr(article, /<title>([^<]*)<\/title>/i);
  if (title !== "5 Easy Ways to Add Moringa to Your Diet") {
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
}

const thanks = read("pages/shop/thank-you.html");
if (thanks) {
  if (!/noindex/i.test(thanks)) errors.push("order thank-you page must stay noindex");
  mustInclude("pages/shop/thank-you.html", "/assets/css/storefront-system", "new UI CSS");
  mustInclude("pages/shop/thank-you.html", 'data-nt-live="1"', "live flag");
  mustInclude("pages/shop/thank-you.html", "/assets/js/storefront/thank-you-page", "order thank-you script");
  mustInclude("pages/shop/thank-you.html", 'id="order-id"', "order reference");
  mustInclude("pages/shop/thank-you.html", "G-WH21SW75WP", "GA");
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

mustInclude("index.html", "G-WH21SW75WP", "GA");
mustNotInclude("pages/shop/payment.html", "storefront-checkout", "preview checkout on payment");

if (fs.existsSync(path.join(SITE_ROOT, "journal/how-to-add-moringa-to-diet/index.html"))) {
  notes.push("preview journal article folders still exist under /journal/; Netlify ignore should keep storefront unpublished, and /journal/:slug 301s to /blog/:slug");
}

if (errors.length) {
  console.error(`storefront live verify failed (${errors.length}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`storefront migration verify: ${trackedBlogs.length} ranking article metadata records preserved; assets, structured data, cart and PayPal wiring look intact.`);
for (const note of notes) console.log(`note: ${note}`);
