#!/usr/bin/env node
/**
 * Analyze blog HTML for duplicate meta descriptions, titles, FAQ hashes.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.join(__dirname, "..", "blog");
const files = fs
  .readdirSync(blogDir)
  .filter((f) => f.endsWith(".html") && f !== "index.html");

function extractMetaDescription(html) {
  const patterns = [
    /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i,
    /<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[1].trim();
  }
  return "";
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : "";
}

function walkJson(obj, fn) {
  if (!obj) return;
  if (Array.isArray(obj)) {
    obj.forEach((x) => walkJson(x, fn));
    return;
  }
  if (typeof obj === "object") {
    fn(obj);
    Object.values(obj).forEach((v) => walkJson(v, fn));
  }
}

function extractFaqHashes(html) {
  const hashes = [];
  const re = /<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    let j;
    try {
      j = JSON.parse(m[1].trim());
    } catch {
      continue;
    }
    walkJson(j, (o) => {
      if (o["@type"] === "FAQPage" && o.mainEntity) {
        hashes.push(JSON.stringify(o.mainEntity));
      }
    });
  }
  return hashes;
}

const byDesc = new Map();
const byTitle = new Map();
const byFaq = new Map();

for (const f of files) {
  const html = fs.readFileSync(path.join(blogDir, f), "utf8");
  const d = extractMetaDescription(html) || "(empty)";
  const t = extractTitle(html) || "(empty)";
  if (!byDesc.has(d)) byDesc.set(d, []);
  byDesc.get(d).push(f);
  if (!byTitle.has(t)) byTitle.set(t, []);
  byTitle.get(t).push(f);
  for (const h of extractFaqHashes(html)) {
    if (!byFaq.has(h)) byFaq.set(h, []);
    byFaq.get(h).push(f);
  }
}

function report(label, map) {
  const dups = [...map.entries()].filter(([, v]) => v.length > 1);
  console.log(`\n=== ${label}: ${dups.length} duplicate groups ===`);
  dups
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 30)
    .forEach(([k, v]) => {
      console.log(`  ${v.length}x: ${v.slice(0, 4).join(", ")}${v.length > 4 ? "…" : ""}`);
      if (k.length < 120) console.log(`     key: ${k}`);
      else console.log(`     key: ${k.slice(0, 100)}…`);
    });
}

report("Meta description", byDesc);
report("Title", byTitle);
report("FAQ mainEntity", byFaq);
