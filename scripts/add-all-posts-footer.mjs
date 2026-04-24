#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ALL =
  'https://nutrithrive.com.au/blog/all-posts.html';
const BLOG_LI = '<li><a href="/blog/">Blog</a></li>';
const BLOG_LI_WITH_ALL = `<li><a href="/blog/">Blog</a></li>
<li><a href="${ALL}">All articles (A–Z)</a></li>`;

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.name.startsWith(".") || name.name === "node_modules") continue;
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walk(p, out);
    else if (name.name.endsWith(".html")) out.push(p);
  }
  return out;
}

let n = 0;
for (const f of walk(ROOT)) {
  let s = fs.readFileSync(f, "utf8");
  if (s.includes(ALL) || !s.includes(BLOG_LI)) continue;
  const count = s.split(BLOG_LI).length - 1;
  s = s.split(BLOG_LI).join(BLOG_LI_WITH_ALL);
  fs.writeFileSync(f, s);
  n++;
  console.log(path.relative(ROOT, f), "—", count, "Blog list item(s) expanded");
}
console.log("Updated", n, "files");
