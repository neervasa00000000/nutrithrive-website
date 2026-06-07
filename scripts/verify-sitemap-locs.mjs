#!/usr/bin/env node
/**
 * CI check: committed sitemap.xml must list the same URLs as build-sitemap.cjs output.
 * Ignores lastmod/changefreq/priority drift (those change with commit dates).
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].trim())
    .sort();
}

const committedPath = path.join(ROOT, "sitemap.xml");
const committed = fs.readFileSync(committedPath, "utf8");
const committedLocs = extractLocs(committed);

const gen = spawnSync("node", ["scripts/build-sitemap.cjs"], {
  cwd: ROOT,
  encoding: "utf8",
  env: { ...process.env, TZ: "Australia/Melbourne" },
});
if (gen.status !== 0) {
  console.error(gen.stderr || gen.stdout);
  process.exit(1);
}

const generated = fs.readFileSync(committedPath, "utf8");
const generatedLocs = extractLocs(generated);

// Restore committed file (generator overwrote it)
fs.writeFileSync(committedPath, committed, "utf8");

const onlyCommitted = committedLocs.filter((u) => !generatedLocs.includes(u));
const onlyGenerated = generatedLocs.filter((u) => !committedLocs.includes(u));

if (onlyCommitted.length || onlyGenerated.length) {
  console.error("sitemap.xml URL list does not match generator output.\n");
  if (onlyCommitted.length) {
    console.error("In committed sitemap only:");
    onlyCommitted.forEach((u) => console.error("  -", u));
  }
  if (onlyGenerated.length) {
    console.error("In generator output only (add these):");
    onlyGenerated.forEach((u) => console.error("  +", u));
  }
  console.error("\nFix: node scripts/build-sitemap.cjs && git add sitemap.xml");
  process.exit(1);
}

console.log(`OK: ${committedLocs.length} sitemap URLs match generator.`);
