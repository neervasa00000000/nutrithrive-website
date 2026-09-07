#!/usr/bin/env node
/**
 * One-shot: rewrite blog meta/og/twitter descriptions through the apostrophe-safe
 * escape pipeline, repair smashed leftover joins, and apply known overrides.
 * Does not rebuild article bodies.
 */
import fs from "node:fs";
import path from "node:path";
import {
  META_OVERRIDES,
  looksTruncatedMeta,
  metaContent,
  naiveMetaContent,
  normalizeMetaText,
  pickSeoDescription,
  sameSeoText,
  setMetaContent,
  visibleLength,
} from "./lib/seo-meta.mjs";
import { REPO_ROOT, SITE_ROOT } from "./lib/paths.mjs";

const BLOG_DIR = path.join(SITE_ROOT, "blog");
const CATALOG_SRC = path.join(SITE_ROOT, "shared/js/blog-articles.js");
const CATALOG_MIN = path.join(SITE_ROOT, "shared/js/blog-articles.min.js");
const PRIORITY = [
  "cant-lose-weight-broken-gut-what-actually-worked-2026",
  "moringa-for-anxiety-stress-evidence-2026",
  "moringa-vs-coffee-melbourne-energy-hack",
  "fathers-day-gift-under-40",
  "morning-routine-health-tips-australia-2026",
];

function loadCatalog() {
  const src = fs.readFileSync(CATALOG_SRC, "utf8");
  const json = src.replace(/^[\s\S]*?window\.NT_BLOG_ARTICLES = /, "").replace(/;\s*$/, "");
  return JSON.parse(json);
}

function writeCatalog(articles) {
  const header = `/** Auto-generated — ${articles.length} blog articles. Run: node scripts/apply-blog-launch-schedule.mjs */\n`;
  fs.writeFileSync(CATALOG_SRC, `${header}window.NT_BLOG_ARTICLES = ${JSON.stringify(articles, null, 2)};\n`);
  fs.writeFileSync(CATALOG_MIN, `window.NT_BLOG_ARTICLES=${JSON.stringify(articles)};\n`);
}

function isStub(html) {
  return /http-equiv=["']refresh["']/i.test(html) || /content=["']noindex/i.test(html);
}

function patchJsonLdArticleDescription(html, description) {
  return html.replace(
    /<script type="application\/ld\+json">(\{[\s\S]*?"@type":"Article"[\s\S]*?\})<\/script>/,
    (full, raw) => {
      try {
        const data = JSON.parse(raw);
        if (data["@type"] !== "Article") return full;
        data.description = description;
        return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
      } catch {
        return full;
      }
    }
  );
}

function encodeTitleAttrs(html) {
  for (const name of ["og:title", "twitter:title", "og:image:alt"]) {
    const current = metaContent(html, name);
    if (!current) continue;
    const decoded = normalizeMetaText(current);
    if (decoded.includes("'") && current.includes("'")) {
      html = setMetaContent(html, name, decoded);
    }
  }
  return html;
}

const catalog = loadCatalog();
const bySlug = new Map(catalog.map((article) => [article.slug, article]));
const files = fs.readdirSync(BLOG_DIR).filter((name) => name.endsWith(".html") && name !== "index.html");

const changed = [];
const truncatedAfter = [];
let catalogChanged = 0;

for (const name of files) {
  const slug = name.replace(/\.html$/, "");
  const file = path.join(BLOG_DIR, name);
  const html = fs.readFileSync(file, "utf8");
  if (isStub(html)) continue;

  const article = bySlug.get(slug);
  const next = pickSeoDescription({
    file: metaContent(html, "description"),
    catalog: article?.description,
    slug,
  });
  if (!next) continue;

  if (article && (looksTruncatedMeta(article.description) || META_OVERRIDES[slug])) {
    if (!sameSeoText(article.description, next)) {
      article.description = next;
      catalogChanged += 1;
    }
  }

  const current = normalizeMetaText(metaContent(html, "description") || "");
  const encodedNeeded = (metaContent(html, "description") || "").includes("'")
    || (metaContent(html, "og:description") || "").includes("'")
    || (metaContent(html, "twitter:description") || "").includes("'")
    || /&rsquo;/i.test(metaContent(html, "description") || "");
  if (sameSeoText(current, next) && !encodedNeeded) continue;

  let out = html;
  out = setMetaContent(out, "description", next);
  out = setMetaContent(out, "og:description", next);
  out = setMetaContent(out, "twitter:description", next);
  out = encodeTitleAttrs(out);
  out = patchJsonLdArticleDescription(out, next);
  if (out !== html) {
    fs.writeFileSync(file, out);
    changed.push({
      slug,
      length: visibleLength(next),
      from: current,
      to: next,
      copyChanged: !sameSeoText(current, next),
    });
  }
}

for (const article of catalog) {
  if (!looksTruncatedMeta(article.description)) continue;
  const next = pickSeoDescription({ catalog: article.description, slug: article.slug });
  if (next && !sameSeoText(article.description, next)) {
    article.description = next;
    catalogChanged += 1;
  }
}

if (catalogChanged) writeCatalog(catalog);

for (const name of files) {
  const slug = name.replace(/\.html$/, "");
  const html = fs.readFileSync(path.join(BLOG_DIR, name), "utf8");
  if (isStub(html)) continue;
  const proper = normalizeMetaText(metaContent(html, "description") || "");
  const naive = normalizeMetaText(naiveMetaContent(html));
  if (looksTruncatedMeta(proper) || naive !== proper) {
    truncatedAfter.push({ slug, naive, proper, length: proper.length });
  }
}

const report = [];
report.push(`rewrote ${changed.length} blog HTML files; catalog description repairs: ${catalogChanged}`);
report.push("");
report.push("priority samples:");
for (const slug of PRIORITY) {
  const html = fs.readFileSync(path.join(BLOG_DIR, `${slug}.html`), "utf8");
  const raw = metaContent(html, "description") || "";
  const text = normalizeMetaText(raw);
  const naive = normalizeMetaText(naiveMetaContent(html));
  report.push(`- /blog/${slug}`);
  report.push(`  ${text.length} chars | naive==proper ${naive === text} | rawHasApos ${raw.includes("'")}`);
  report.push(`  ${text}`);
}
report.push("");
const copyChanges = changed.filter((row) => row.copyChanged);
report.push(`copy changed (${copyChanges.length}):`);
for (const row of copyChanges) {
  report.push(`- ${row.slug} (${row.length})`);
  report.push(`  WAS: ${row.from}`);
  report.push(`  NOW: ${row.to}`);
}
if (truncatedAfter.length) {
  report.push("");
  report.push(`STILL TRUNCATED (${truncatedAfter.length}):`);
  for (const row of truncatedAfter) report.push(`- ${row.slug}: ${row.proper}`);
} else {
  report.push("");
  report.push("spot-check: no couldn/isn/doesn naive cutoffs remaining on ranking blogs.");
}

const outPath = path.join(REPO_ROOT, "scripts/truncated-blog-metas-report.txt");
fs.writeFileSync(outPath, `${report.join("\n")}\n`);
console.log(report.join("\n"));
console.log(`\nWrote ${path.relative(REPO_ROOT, outPath)}`);
