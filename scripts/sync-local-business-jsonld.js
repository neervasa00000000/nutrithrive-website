#!/usr/bin/env node
/**
 * Single source of truth for standalone LocalBusiness JSON-LD (id=nutri-thrive-local-business-jsonld).
 * Edit: shared/schema/nutrithrive-local-business.json
 * Run:  node scripts/sync-local-business-jsonld.js
 *
 * Replaces the comment + script block in every HTML file that already contains that id
 * (inline JSON-LD so crawlers do not depend on external script src).
 */

const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..");
const SCHEMA = path.join(
  REPO,
  "shared/schema/nutrithrive-local-business.json",
);

const BLOCK_RE =
  /(?:<!--\s*Nutri Thrive LocalBusiness[\s\S]*?-->\s*)?<script type="application\/ld\+json" id="nutri-thrive-local-business-jsonld">[\s\S]*?<\/script>/g;

const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
]);

function buildReplacement() {
  const raw = fs.readFileSync(SCHEMA, "utf8");
  const obj = JSON.parse(raw);
  const pretty = JSON.stringify(obj, null, 2);
  return (
    `<!-- Nutri Thrive LocalBusiness — source: shared/schema/nutrithrive-local-business.json (sync: node scripts/sync-local-business-jsonld.js) -->\n` +
    `<script type="application/ld+json" id="nutri-thrive-local-business-jsonld">\n${pretty}\n</script>`
  );
}

function walkHtml(dir, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (IGNORE_DIRS.has(e.name)) continue;
      walkHtml(full, out);
    } else if (e.isFile() && e.name.endsWith(".html")) {
      out.push(full);
    }
  }
}

function main() {
  const replacement = buildReplacement();
  const files = [];
  walkHtml(REPO, files);

  let changed = 0;
  let touched = 0;
  for (const abs of files) {
    let s = fs.readFileSync(abs, "utf8");
    if (!s.includes('id="nutri-thrive-local-business-jsonld"')) continue;
    const next = s.replace(BLOCK_RE, replacement);
    if (next === s) continue;
    fs.writeFileSync(abs, next, "utf8");
    changed++;
    touched++;
  }

  console.log(
    `Synced LocalBusiness JSON-LD from ${path.relative(REPO, SCHEMA)} into ${changed} file(s).`,
  );
  if (touched === 0) {
    console.log(
      "No files needed updates (all blocks already match, or id not found).",
    );
  }
}

main();
