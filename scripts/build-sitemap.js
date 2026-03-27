/**
 * Regenerates sitemap.xml from HTML files under the repo root.
 * Run from repo root: node scripts/build-sitemap.js
 *
 * Skips internal helpers and paths that 301 to canonical URLs (see _redirects).
 * Injects clean URLs for /about, /contact, /cart, etc.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BASE = "https://nutrithrive.com.au";

const SKIP_REL = new Set([
  "blog/best-moringa-powder-australia-2026-how-to-choose-top-superfoods-compare-brands-boost-wellness.html",
  "tools/check-paypal-buttons.html",
  "pages/homepage/index.html",
  "pages/contact/index.html",
  "pages/products/index.html",
  "pages/melbourne-page.html",
  "pages/contact/contact.html",
  "pages/about/about.html",
  "pages/homepage/melbourne.html",
  "pages/shop/cart.html",
  "pages/faq/faq.html",
  "pages/legal/privacy-policy.html",
  "pages/shop/thank-you.html",
  "pages/shipping/shipping-returns.html",
  "pages/benefits/moringa-benefits.html",
]);

const CANONICAL_EXTRA = [
  { loc: `${BASE}/contact`, lastmodFile: "pages/contact/contact.html" },
  { loc: `${BASE}/about`, lastmodFile: "pages/about/about.html" },
  { loc: `${BASE}/melbourne/`, lastmodFile: "pages/homepage/melbourne.html" },
  { loc: `${BASE}/cart`, lastmodFile: "pages/shop/cart.html" },
  { loc: `${BASE}/faq`, lastmodFile: "pages/faq/faq.html" },
  { loc: `${BASE}/privacy-policy`, lastmodFile: "pages/legal/privacy-policy.html" },
  { loc: `${BASE}/thank-you.html`, lastmodFile: "pages/shop/thank-you.html" },
  { loc: `${BASE}/pages/shipping/shipping-returns`, lastmodFile: "pages/shipping/shipping-returns.html" },
];

function walkHtml(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walkHtml(full, acc);
    else if (name.endsWith(".html")) acc.push(full);
  }
  return acc;
}

function toUrl(absPath) {
  const rel = path.relative(ROOT, absPath).replace(/\\/g, "/");
  if (SKIP_REL.has(rel)) return null;

  if (rel === "index.html") return `${BASE}/`;

  const m = rel.match(/^(.*)\/index\.html$/);
  if (m) return `${BASE}/${m[1]}/`;

  if (rel.endsWith(".html")) return `${BASE}/${rel}`;
  return null;
}

function lastmodFromFile(relFile) {
  const abs = path.join(ROOT, relFile);
  const d = new Date(fs.statSync(abs).mtime);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function priorityAndFreq(urlPath) {
  if (urlPath === "/") return { priority: "1.0", changefreq: "weekly" };
  if (urlPath.startsWith("/products/")) return { priority: "0.9", changefreq: "weekly" };
  if (urlPath.startsWith("/blog/")) return { priority: "0.8", changefreq: "weekly" };
  if (urlPath.startsWith("/nutrithrive_labs/")) return { priority: "0.3", changefreq: "monthly" };
  if (urlPath.startsWith("/pages/shop/") || urlPath.includes("thank-you"))
    return { priority: "0.5", changefreq: "monthly" };
  return { priority: "0.6", changefreq: "monthly" };
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const files = walkHtml(ROOT);
const entries = [];

for (const f of files) {
  const u = toUrl(f);
  if (u) {
    const rel = path.relative(ROOT, f).replace(/\\/g, "/");
    entries.push({ loc: u, lastmod: lastmodFromFile(rel) });
  }
}

for (const { loc, lastmodFile } of CANONICAL_EXTRA) {
  entries.push({ loc, lastmod: lastmodFromFile(lastmodFile) });
}

const byLoc = new Map();
for (const e of entries) {
  if (!byLoc.has(e.loc)) byLoc.set(e.loc, e);
}
const sorted = [...byLoc.values()].sort((a, b) => a.loc.localeCompare(b.loc));

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
for (const { loc, lastmod: lm } of sorted) {
  const urlPath = new URL(loc).pathname;
  const { priority, changefreq } = priorityAndFreq(urlPath);
  xml += `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lm}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
}
xml += `</urlset>
`;

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml, "utf8");
console.log("Wrote sitemap.xml with", sorted.length, "URLs");
