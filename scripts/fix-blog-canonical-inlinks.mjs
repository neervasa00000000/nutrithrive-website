#!/usr/bin/env node
/**
 * blog/index.html: relative post hrefs -> absolute https://nutrithrive.com.au/blog/...html
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

// Relative slug.html in blog list (not ../ not http, not /)
const REL_POST = /href="([a-z0-9][a-z0-9-]*\.html)"/g;

const idx = fs.readFileSync(INDEX, "utf8");
const before = (idx.match(REL_POST) || []).length;
const out = idx.replace(REL_POST, (m, slug) => `href="${BASE}/blog/${slug}"`);
fs.writeFileSync(INDEX, out);
console.log("blog/index.html: replaced", before, "relative post hrefs with absolute");
