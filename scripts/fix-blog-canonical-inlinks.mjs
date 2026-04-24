#!/usr/bin/env node
/**
 * 1) blog/index.html: relative post hrefs -> absolute https://nutrithrive.com.au/blog/...html
 * 2) blog/all-posts.html: static HTML sitemap (same 38 URLs as ItemList) for internal links
 * Run: node scripts/fix-blog-canonical-inlinks.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BASE = "https://nutrithrive.com.au";
const BLOG_DIR = path.join(ROOT, "blog");
const INDEX = path.join(BLOG_DIR, "index.html");
const ALL_POSTS = path.join(BLOG_DIR, "all-posts.html");

// Relative slug.html in blog list (not ../ not http, not /)
const REL_POST = /href="([a-z0-9][a-z0-9-]*\.html)"/g;

function read(p) {
  return fs.readFileSync(p, "utf8");
}
function write(p, s) {
  fs.writeFileSync(p, s);
}

// --- 1) absolute URLs in blog index
let idx = read(INDEX);
const before = (idx.match(REL_POST) || []).length;
idx = idx.replace(REL_POST, (m, slug) => `href="${BASE}/blog/${slug}"`);
write(INDEX, idx);
console.log("blog/index.html: replaced", before, "relative post hrefs with absolute");

// --- 2) extract 38 URLs from ItemList
const jm = read(INDEX).match(/"itemListElement":\s*\[([\s\S]*?)\]\s*\}/);
if (!jm) {
  console.error("Could not find itemListElement in blog/index.html");
  process.exit(1);
}
const urls = [...read(INDEX).matchAll(/"url":\s*"(https:\/\/nutrithrive\.com\.au\/blog\/[^"]+\.html)"/g)].map((x) => x[1]);
const unique = [...new Set(urls)];
if (unique.length < 1) {
  console.error("No URLs in ItemList");
  process.exit(1);
}
console.log("ItemList URLs:", unique.length);

// Titles: optional — derive short label from slug
function labelFromUrl(u) {
  const slug = u.replace(BASE + "/blog/", "").replace(/\.html$/, "");
  return slug
    .split("-")
    .slice(0, 6)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const items = unique
  .map(
    (u) =>
      `  <li><a href="${u}">${labelFromUrl(u)}</a></li>`
  )
  .join("\n");

const allPostsHtml = `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="index, follow">
<title>All blog articles | Nutri Thrive</title>
<meta name="description" content="Every Nutri Thrive health and moringa article in one list — for readers and site navigation. Melbourne, Australia.">
<link rel="canonical" href="${BASE}/blog/all-posts.html">
<link rel="icon" type="image/png" href="../assets/images/logo/LOGO.webp" sizes="32x32">
<link rel="stylesheet" href="../styles/global/style.css">
</head>
<body class="all-posts-page" style="font-family: system-ui, sans-serif; line-height: 1.5; color: #1a2e22;">
<header style="padding: 1rem 1.5rem; border-bottom: 1px solid #e0e7ef;">
  <a href="/" style="font-weight: 700; color: #175c36; text-decoration: none;">Nutri Thrive</a>
  <nav style="display: inline; margin-left: 1.5rem;">
    <a href="/products/" style="margin-right: 1rem; color: #1a2e22;">Products</a>
    <a href="/blog/" style="color: #175c36; font-weight: 600;">Blog</a>
  </nav>
</header>
<main style="max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem 4rem;">
  <h1 style="font-size: 1.75rem; margin-bottom: 0.5rem;">All blog articles</h1>
  <p style="color: #5a6d5d; margin-bottom: 1.5rem;">Every post linked with the same <abbr title="preferred URL in search">canonical</abbr> URL the site uses for search engines (${unique.length} pages).</p>
  <ul style="list-style: disc; padding-left: 1.5rem; columns: 1; gap: 0.5rem;">${items}
  </ul>
  <p style="margin-top: 2rem;"><a href="/blog/">&larr; Back to blog home</a></p>
</main>
<footer style="padding: 2rem; border-top: 1px solid #e0e7ef; font-size: 0.9rem; color: #5a6d5d; text-align: center;">
  <p>&copy; 2026 Nutri Thrive</p>
</footer>
</body>
</html>
`;
write(ALL_POSTS, allPostsHtml);
console.log("Wrote blog/all-posts.html");
