#!/usr/bin/env node
/** Footer had Blog pointing to homepage — use /blog/ */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const WRONG = /<li><a href="https:\/\/nutrithrive\.com\.au\/">Blog<\/a><\/li>/g;
const BLOG_ONLY = '<li><a href="/blog/">Blog</a></li>';

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
  s = s.replace(WRONG, () => BLOG_ONLY);
  fs.writeFileSync(f, s);
  n += matches.length;
  console.log(path.relative(ROOT, f), matches.length, "fix(es)");
}
console.log("Total:", n);
