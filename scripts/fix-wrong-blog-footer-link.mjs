#!/usr/bin/env node
/** Footer had Blog pointing to homepage — use /blog/ and add all-posts when missing. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ALL = "https://nutrithrive.com.au/blog/all-posts.html";
const WRONG = /<li><a href="https:\/\/nutrithrive\.com\.au\/">Blog<\/a><\/li>/g;
const BLOG_ONLY = '<li><a href="/blog/">Blog</a></li>';
const BLOG_AND_ALL = `<li><a href="/blog/">Blog</a></li>
<li><a href="${ALL}">All articles (A–Z)</a></li>`;

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.name.startsWith(".")) continue;
    const p = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name === "node_modules") continue;
      walk(p, out);
    } else if (name.name.endsWith(".html")) out.push(p);
  }
  return out;
}

let n = 0;
for (const f of walk(ROOT)) {
  let s = fs.readFileSync(f, "utf8");
  const matches = s.match(WRONG);
  if (!matches) continue;
  const hasAll = s.includes(ALL);
  s = s.replace(WRONG, () => (hasAll ? BLOG_ONLY : BLOG_AND_ALL));
  fs.writeFileSync(f, s);
  n += matches.length;
  console.log(path.relative(ROOT, f), matches.length, "fix(es)", hasAll ? "(blog only)" : "+ all-posts");
}
console.log("Total:", n);
