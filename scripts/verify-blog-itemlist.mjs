#!/usr/bin/env node
/**
 * CI check: blog/index.html ItemList JSON-LD must list the same live post URLs
 * as indexable blog/*.html files (matches regenerate-blog-itemlist.mjs).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const REPO = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://nutrithrive.com.au";
const BLOG_INDEX = path.join(REPO, "blog/index.html");
const BLOG_DIR = path.join(REPO, "blog");

function isLivePost(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return !/meta\s+name="robots"\s+content="noindex/i.test(raw);
}

function expectedUrls() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".html") && f !== "index.html" && !f.includes(".partial."))
    .filter((f) => isLivePost(path.join(BLOG_DIR, f)))
    .map((f) => `${BASE}/blog/${f.replace(/\.html$/, "")}`)
    .sort();
}

function itemListUrls(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  for (const block of blocks) {
    let data;
    try {
      data = JSON.parse(block[1].trim());
    } catch {
      continue;
    }
    if (data["@type"] !== "ItemList") continue;
    return (data.itemListElement || [])
      .map((item) => item.url)
      .filter(Boolean)
      .sort();
  }
  console.error("ItemList JSON-LD block not found in blog/index.html");
  process.exit(1);
}

const html = fs.readFileSync(BLOG_INDEX, "utf8");
const expected = expectedUrls();
const listed = itemListUrls(html);

const onlyExpected = expected.filter((u) => !listed.includes(u));
const onlyListed = listed.filter((u) => !expected.includes(u));

if (onlyExpected.length || onlyListed.length) {
  console.error("blog/index.html ItemList does not match live blog posts.\n");
  if (onlyExpected.length) {
    console.error("Live posts missing from ItemList:");
    onlyExpected.forEach((u) => console.error("  +", u));
  }
  if (onlyListed.length) {
    console.error("ItemList entries with no live post:");
    onlyListed.forEach((u) => console.error("  -", u));
  }
  console.error("\nFix: node scripts/regenerate-blog-itemlist.mjs && git add blog/index.html");
  process.exit(1);
}

console.log(`OK: ItemList has ${listed.length} live blog URLs.`);
