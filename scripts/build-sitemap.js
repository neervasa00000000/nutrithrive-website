#!/usr/bin/env node
/**
 * Regenerates /sitemap.xml from the repo filesystem.
 * Run from repo root: node scripts/build-sitemap.js
 *
 * lastmod uses the last git commit date per file (fallback: mtime) so CI matches local
 * runs — runner checkout mtimes are not stable.
 *
 * Excludes: noindex pages (set INCLUDE_NOINDEX=1 to list them anyway), blocklisted paths,
 * thank-you flows. Run: node scripts/build-sitemap.js
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const BASE = "https://nutrithrive.com.au";

/** Paths that must never appear in the sitemap (relative to repo root, posix). */
const PATH_BLOCKLIST = new Set([
  "tools/check-paypal-buttons.html",
  "scripts/moringa-melbourne-report-head.inc.html",
  "pages/shop/cart.html",
  "pages/contact/thank-you.html",
  "pages/newsletter/thank-you.html",
  "pages/shop/thank-you.html",
  "pages/contact/index.html",
  "pages/products/index.html",
  "pages/homepage/index.html",
  "pages/benefits/moringa-benefits.html",
  "pages/melbourne-page.html",
]);

const REDIRECT_SOURCE_BLOCKLIST = new Set([]);

const INCLUDE_NOINDEX = process.env.INCLUDE_NOINDEX === "1" || process.argv.includes("--include-noindex");

/** HTML paths included in the sitemap even when the page has noindex (strategic exceptions). */
const INCLUDE_DESPITE_NOINDEX = new Set(["blog/index.html"]);

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function walkHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name === ".git" || name.name === "node_modules") continue;
      walkHtml(full, out);
    } else if (name.isFile() && name.name.toLowerCase().endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

function hasNoindex(html) {
  const head = html.slice(0, 12000).toLowerCase();
  return (
    /name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(head) ||
    /content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["']/i.test(head)
  );
}

function fileToUrl(relPosix) {
  if (relPosix === "index.html") return `${BASE}/`;

  if (relPosix === "blog/index.html") return `${BASE}/blog/`;

  if (relPosix.startsWith("blog/") && relPosix.endsWith(".html")) {
    return `${BASE}/${relPosix}`;
  }

  if (relPosix === "products/index.html") return `${BASE}/products/`;

  const prodIdx = /^products\/([^/]+)\/index\.html$/.exec(relPosix);
  if (prodIdx) return `${BASE}/products/${prodIdx[1]}/`;

  if (relPosix === "pages/about/about.html") return `${BASE}/about`;
  if (relPosix === "pages/contact/contact.html") return `${BASE}/contact`;
  if (relPosix === "pages/faq/faq.html") return `${BASE}/faq`;
  if (relPosix === "pages/legal/privacy-policy.html") return `${BASE}/privacy-policy`;
  if (relPosix === "pages/shop/cart.html") return `${BASE}/cart`;
  if (relPosix === "pages/shipping/shipping-returns.html")
    return `${BASE}/pages/shipping/shipping-returns`;

  if (relPosix === "pages/usage-guide/how-to-use-moringa.html")
    return `${BASE}/pages/usage-guide/how-to-use-moringa.html`;

  if (relPosix === "pages/newsletter/index.html") return `${BASE}/pages/newsletter/`;

  if (relPosix === "pages/homepage/melbourne.html") return `${BASE}/melbourne/`;

  if (relPosix === "nutrithrive_labs/index.html") return `${BASE}/nutrithrive_labs/`;

  if (relPosix.startsWith("nutrithrive_labs/") && relPosix.endsWith(".html")) {
    return `${BASE}/${relPosix}`;
  }

  // Default: served under same path as in repo (e.g. pages/melbourne-page — blocklisted)
  return `${BASE}/${relPosix}`;
}

function priorityAndFreq(urlPath) {
  if (urlPath === `${BASE}/`) return { priority: "1.0", changefreq: "weekly" };
  if (urlPath.includes("/products/")) return { priority: "0.9", changefreq: "weekly" };
  if (urlPath.includes("/blog/")) return { priority: "0.8", changefreq: "weekly" };
  if (urlPath.includes("/nutrithrive_labs/")) return { priority: "0.3", changefreq: "monthly" };
  return { priority: "0.6", changefreq: "monthly" };
}

/** ISO date (YYYY-MM-DD) of last git commit touching relPosix, or null if unavailable. */
function lastmodFromGit(relPosix) {
  const r = spawnSync("git", ["log", "-1", "--format=%cs", "--", relPosix], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    maxBuffer: 1024 * 1024,
  });
  if (r.error || r.status !== 0) return null;
  const out = String(r.stdout || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
}

function lastmodFromMtime(fileAbs) {
  const st = fs.statSync(fileAbs);
  const d = new Date(st.mtimeMs);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Prefer git commit date so CI and local runs match the same tree (mtime differs on runners). */
function lastmodDate(fileAbs, relPosix) {
  return lastmodFromGit(relPosix) || lastmodFromMtime(fileAbs);
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function main() {
  const files = walkHtml(REPO_ROOT);
  const entries = [];
  const skippedNoindex = [];

  for (const abs of files) {
    const rel = toPosix(path.relative(REPO_ROOT, abs));
    if (PATH_BLOCKLIST.has(rel)) continue;
    if (REDIRECT_SOURCE_BLOCKLIST.has(rel)) continue;

    let html;
    try {
      html = fs.readFileSync(abs, "utf8");
    } catch {
      continue;
    }
    if (hasNoindex(html) && !INCLUDE_DESPITE_NOINDEX.has(rel)) {
      if (!INCLUDE_NOINDEX) {
        skippedNoindex.push(rel);
        continue;
      }
    }

    const loc = fileToUrl(rel);
    const { priority, changefreq } = priorityAndFreq(loc);
    entries.push({
      loc,
      lastmod: lastmodDate(abs, rel),
      priority,
      changefreq,
    });
  }

  const seen = new Set();
  const unique = [];
  for (const e of entries.sort((a, b) => a.loc.localeCompare(b.loc))) {
    if (seen.has(e.loc)) continue;
    seen.add(e.loc);
    unique.push(e);
  }

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    "<!-- Auto-generated by scripts/build-sitemap.js — run from repo root: node scripts/build-sitemap.js -->",
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const e of unique) {
    lines.push("  <url>");
    lines.push(`    <loc>${escapeXml(e.loc)}</loc>`);
    lines.push(`    <lastmod>${e.lastmod}</lastmod>`);
    lines.push(`    <changefreq>${e.changefreq}</changefreq>`);
    lines.push(`    <priority>${e.priority}</priority>`);
    lines.push("  </url>");
  }
  lines.push("</urlset>");
  lines.push("");

  const outPath = path.join(REPO_ROOT, "sitemap.xml");
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");
  console.log(`Wrote ${unique.length} URLs to sitemap.xml`);

  const urlListPath = path.join(REPO_ROOT, "audit", "sitemap-urls.txt");
  const urlList = [
    "# One URL per line — regenerated by scripts/build-sitemap.js (same order as sitemap.xml)",
    ...unique.map((e) => e.loc),
    "",
  ].join("\n");
  fs.writeFileSync(urlListPath, urlList, "utf8");
  console.log(`Wrote ${unique.length} lines to ${path.relative(REPO_ROOT, urlListPath)}`);
  if (skippedNoindex.length && !INCLUDE_NOINDEX) {
    console.log(
      `Skipped ${skippedNoindex.length} noindex file(s) (re-run with INCLUDE_NOINDEX=1 to include):`,
    );
    skippedNoindex.sort().forEach((r) => console.log(`  - ${r}`));
  }
  if (INCLUDE_NOINDEX) {
    console.log("Note: noindex URLs are included in the sitemap; crawlers will still respect page robots tags.");
  }
}

main();
