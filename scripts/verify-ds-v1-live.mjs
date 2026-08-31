#!/usr/bin/env node
/**
 * Fail-the-build checks after DS_V1_LIVE publishes the new UI onto production paths.
 * Does not deploy. Ranking URLs, cart/PayPal wiring, and noindex rules must hold.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LIVE = "https://nutrithrive.com.au";
const errors = [];
const notes = [];

function read(rel) {
  const file = path.join(ROOT, rel);
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

const home = read("index.html");
if (home) {
  const title = attr(home, /<title>([^<]*)<\/title>/i);
  if (title !== "NutriThrive: Moringa Powder, Curry Leaves &amp; Tea | Melbourne") {
    errors.push(`homepage title changed: "${title}"`);
  }
  if (!/content="index,\s*follow"/i.test(home)) errors.push("homepage is not index,follow");
  mustInclude("index.html", 'rel="canonical" href="https://nutrithrive.com.au/"', "homepage canonical");
  mustInclude("index.html", "/assets/css/ds-v1-system", "new UI CSS");
  mustInclude("index.html", "/scripts/global/cart.min.js", "production cart");
  mustInclude("index.html", 'data-nt-live="1"', "live flag");
  mustNotInclude("index.html", "This is a design preview", "preview footer");
  mustNotInclude("index.html", 'href="/checkout/"', "preview checkout link");
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
  mustInclude(articleRel, "/assets/css/ds-v1-system", "article new UI");
  mustNotInclude(articleRel, 'href="/journal/how-to-add-moringa-to-diet/', "journal slug link on ranking article");
  if (!article.includes("Melbourne Morning Smoothie") && !article.includes("Quick Answer")) {
    errors.push(`${articleRel}: article body looks truncated; original prose is missing`);
  }
}

const journal = read("journal/index.html");
if (journal) {
  if (!journal.includes('href="/blog/how-to-add-moringa-to-diet"') && !journal.includes('href="/blog/moringa-patches-australia-review-do-they-work"')) {
    errors.push("journal index does not link to /blog/ article URLs");
  }
  mustInclude("journal/index.html", 'rel="canonical" href="https://nutrithrive.com.au/journal"', "journal canonical");
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
  mustInclude("pages/shop/cart.html", "/scripts/global/ds-v1-cart-page", "new cart UI script");
  mustInclude("pages/shop/cart.html", "/scripts/global/cart.min.js", "production cart");
  mustNotInclude("pages/shop/cart.html", 'href="/checkout/"', "preview checkout on live cart");
}

const newsletter = read("pages/newsletter/index.html");
if (newsletter) {
  mustInclude("pages/newsletter/index.html", "/assets/css/ds-v1-system", "newsletter new UI CSS");
  mustInclude("pages/newsletter/index.html", 'data-nt-live="1"', "live flag");
  mustInclude("pages/newsletter/index.html", 'name="newsletter"', "Netlify newsletter form");
  mustNotInclude("pages/newsletter/index.html", "design-system.min.css", "old design system CSS");
  mustNotInclude("pages/newsletter/index.html", "Join thousands", "old newsletter pitch");
}

const payment = read("pages/shop/payment.html");
if (payment) {
  if (!/noindex/i.test(payment)) errors.push("payment page must stay noindex");
  mustInclude("pages/shop/payment.html", "/assets/css/ds-v1-system", "new UI CSS");
  mustInclude("pages/shop/payment.html", 'data-nt-live="1"', "live flag");
  mustInclude("pages/shop/payment.html", "/scripts/global/cart.min.js", "production cart");
  mustInclude("pages/shop/payment.html", "paypal-client-config", "PayPal client config");
  mustInclude("pages/shop/payment.html", "paypal-sdk-loader", "PayPal SDK loader");
  mustInclude("pages/shop/payment.html", "ds-v1-payment-page", "new payment UI script");
  mustInclude("pages/shop/payment.html", 'id="paypal-button-container"', "PayPal buttons mount");
  mustInclude("pages/shop/payment.html", 'id="shipping-country"', "shipping country select");
  mustNotInclude("pages/shop/payment.html", "design-system.min.css", "old design system CSS");
  mustNotInclude("pages/shop/payment.html", "footer-v2", "old footer");
  mustNotInclude("pages/shop/payment.html", 'href="/checkout/"', "preview checkout on payment");
}
const paymentJs = read("scripts/global/ds-v1-payment-page.js");
if (paymentJs) {
  if (!paymentJs.includes("paypal-create-order")) errors.push("payment page script lost PayPal create-order");
  if (!paymentJs.includes("paypal-capture-order")) errors.push("payment page script lost PayPal capture-order");
  if (!paymentJs.includes("ntLoadPayPalSdk")) errors.push("payment page script lost PayPal SDK loader");
}

const thanks = read("pages/shop/thank-you.html");
if (thanks) {
  if (!/noindex/i.test(thanks)) errors.push("order thank-you page must stay noindex");
  mustInclude("pages/shop/thank-you.html", "/assets/css/ds-v1-system", "new UI CSS");
  mustInclude("pages/shop/thank-you.html", 'data-nt-live="1"', "live flag");
  mustInclude("pages/shop/thank-you.html", "ds-v1-thank-you-page", "order thank-you script");
  mustInclude("pages/shop/thank-you.html", 'id="order-id"', "order reference");
  mustInclude("pages/shop/thank-you.html", "G-WH21SW75WP", "GA");
  mustNotInclude("pages/shop/thank-you.html", "design-system.min.css", "old design system CSS");
  mustNotInclude("pages/shop/thank-you.html", "footer-v2", "old footer");
  mustNotInclude("pages/shop/thank-you.html", "thank-you-icon", "old checkmark block");
}
const thanksJs = read("scripts/global/ds-v1-thank-you-page.js");
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
  if (redirects.includes("/blog/ /journal/")) errors.push("_redirects must not send /blog/ to /journal/");
  if (!redirects.includes("/cart /pages/shop/cart.html 200")) errors.push("_redirects lost /cart rewrite");
  if (!redirects.includes("/payment /pages/shop/payment.html 200")) errors.push("_redirects lost /payment rewrite");
  if (!redirects.includes("/thank-you.html /pages/shop/thank-you.html 200")) errors.push("_redirects lost /thank-you.html rewrite");
  if (!redirects.includes("/newsletter /pages/newsletter/ 301")) errors.push("_redirects missing /newsletter → /pages/newsletter/");
}

for (const asset of [
  "assets/css/ds-v1-system.css",
  "scripts/global/ds-v1-site.js",
  "scripts/global/ds-v1-catalog.js",
  "scripts/global/ds-v1-search-index.js",
  "scripts/global/ds-v1-cart-page.js",
  "scripts/global/ds-v1-payment-page.js",
  "scripts/global/ds-v1-thank-you-page.js",
  "scripts/global/cart.min.js",
  "scripts/global/paypal-client-config.min.js",
  "scripts/global/paypal-sdk-loader.min.js",
  "netlify/functions/paypal-create-order.js",
  "netlify/functions/paypal-capture-order.js",
]) {
  if (!fs.existsSync(path.join(ROOT, asset))) errors.push(`missing ${asset}`);
}

const catalog = read("scripts/global/ds-v1-catalog.js");
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
mustNotInclude("pages/shop/payment.html", "ds-v1-checkout", "preview checkout on payment");

if (fs.existsSync(path.join(ROOT, "journal/how-to-add-moringa-to-diet/index.html"))) {
  notes.push("preview journal article folders still exist under /journal/; Netlify ignore should keep ds-v1 unpublished, and /journal/:slug 301s to /blog/:slug");
}

if (errors.length) {
  console.error(`ds-v1 live verify failed (${errors.length}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log("ds-v1 live verify: ranking titles/canonicals, production cart/PayPal, and noindex rules look intact.");
for (const note of notes) console.log(`note: ${note}`);
