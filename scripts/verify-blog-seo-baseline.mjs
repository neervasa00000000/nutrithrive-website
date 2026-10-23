#!/usr/bin/env node
/**
 * The 16 Oct 2026 answer boxes must survive a storefront rebuild.
 * Fails if any of the seven posts loses its answer box, if the curry-leaf
 * substitute post loses its FAQPage, or if a JSON-LD headline differs from the H1.
 */
import fs from "node:fs";
import path from "node:path";
import { SITE_ROOT } from "./lib/paths.mjs";

const SLUGS = [
  "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025",
  "rosabella-moringa-reviews-legit-or-overhyped-2026",
  "grow-moringa-tree-australia",
  "moringa-vs-coffee-melbourne-energy-hack",
  "science-shade-drying-vs-sun-drying-moringa",
  "curry-leaves-substitute-what-to-use-2026",
  "moringa-patches-australia-review-do-they-work",
];

function decode(value) {
  return String(value)
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

const errors = [];
for (const slug of SLUGS) {
  const file = path.join(SITE_ROOT, "blog", `${slug}.html`);
  const html = fs.readFileSync(file, "utf8");
  if (!/class="answer-box"|id="gsc-answer"/.test(html)) {
    errors.push(`${slug}: missing answer box`);
  }
  if (slug === "curry-leaves-substitute-what-to-use-2026" && !/"@type"\s*:\s*"FAQPage"/.test(html)) {
    errors.push(`${slug}: missing FAQPage`);
  }
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const h1 = decode(h1Match?.[1] || "");
  if (!h1) errors.push(`${slug}: missing H1`);
  let headlines = 0;
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try {
      data = JSON.parse(match[1]);
    } catch {
      errors.push(`${slug}: unparseable JSON-LD`);
      continue;
    }
    const blocks = Array.isArray(data) ? data : [data];
    for (const block of blocks) {
      if (!block || (block["@type"] !== "Article" && block["@type"] !== "BlogPosting")) continue;
      headlines += 1;
      if (decode(block.headline) !== h1) {
        errors.push(`${slug}: JSON-LD headline "${block.headline}" differs from H1 "${h1}"`);
      }
    }
  }
  if (!headlines) errors.push(`${slug}: no Article headline`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`blog SEO baseline ok (${SLUGS.length} posts)`);
