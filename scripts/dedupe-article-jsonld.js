#!/usr/bin/env node
/**
 * Removes duplicate <script type="application/ld+json"> blocks in HTML files
 * when the *entire* script inner text is byte-identical to an earlier one.
 * Run: node scripts/dedupe-article-jsonld.js [file.html ...]
 * Or with no args: all blog/*.html
 */

const fs = require("fs");
const path = require("path");

const REPO = path.resolve(__dirname, "..");

function dedupeFile(absPath) {
  let s = fs.readFileSync(absPath, "utf8");
  const before = s;

  // Match script blocks: non-greedy inner until </script>
  const re = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  const seen = new Set();
  s = s.replace(re, (full, inner) => {
    const key = inner.trim();
    if (seen.has(key)) {
      return "";
    }
    seen.add(key);
    return full;
  });

  if (s !== before) {
    fs.writeFileSync(absPath, s, "utf8");
    return { changed: true, path: absPath };
  }
  return { changed: false, path: absPath };
}

function main() {
  const args = process.argv.slice(2);
  let files;
  if (args.length) {
    files = args.map((f) => path.resolve(REPO, f));
  } else {
    const blog = path.join(REPO, "blog");
    files = fs
      .readdirSync(blog)
      .filter((n) => n.endsWith(".html"))
      .map((n) => path.join(blog, n));
  }

  const changed = [];
  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const r = dedupeFile(f);
    if (r.changed) changed.push(r.path);
  }

  console.log(
    `Processed ${files.length} file(s). Removed duplicate identical JSON-LD blocks in ${changed.length} file(s).`,
  );
  changed.forEach((p) => console.log("  -", path.relative(REPO, p)));
}

main();
