#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function walkHtml(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.name.startsWith(".") || name.name === "node_modules") continue;
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walkHtml(p, out);
    else if (name.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const ALL_POSTS = /all-posts\.html/;

let touched = 0;
for (const f of walkHtml(ROOT)) {
  if (f.includes("node_modules")) continue;
  let s = fs.readFileSync(f, "utf8");
  if (!ALL_POSTS.test(s)) continue;
  // Remove: <li>…all-posts…All articles (A–Z)…</li> (entire list item, any whitespace)
  s = s.replace(/\s*<li><a [^>]*all-posts\.html[^>]*>[^<]*<\/a><\/li>\n?/g, "\n");
  s = s.replace(
    /\n?<p class="nt-all-posts-inlink"[^>]*>[\s\S]*?all-posts\.html[^<]*<\/a>[^<]*<\/p>\n?/g,
    "\n"
  );
  // Melbourne footer: "Back … · All articles" → Back only
  s = s.replace(
    /(<a href="https:\/\/nutrithrive\.com\.au\/blog\/"[^>]*>← Back to NutriThrive Blog<\/a>) · <a href="https:\/\/nutrithrive\.com\.au\/blog\/all-posts\.html"[^>]*>All articles \(A–Z\)<\/a>/g,
    "$1"
  );
  // moringa-calm: remove all-posts related card (opening tag through closing </a> of the span)
  s = s.replace(
    /<a class="related-article-card" href="https:\/\/nutrithrive\.com\.au\/blog\/all-posts\.html"[^>]*>[\s\S]*?<\/a>\n?/g,
    ""
  );
  // "All blog articles" in related-guides (exact href)
  s = s.replace(
    /\s*<li><a href="https:\/\/nutrithrive\.com\.au\/blog\/all-posts\.html">All blog articles \(A–Z\)<\/a><\/li>\n?/g,
    "\n"
  );
  // Tidy double newlines in ul
  s = s.replace(/(<ul[^>]*>)\n\n+/g, "$1\n");
  fs.writeFileSync(f, s);
  touched++;
  console.log(path.relative(ROOT, f));
}
console.log("Processed", touched, "files with all-posts refs");
