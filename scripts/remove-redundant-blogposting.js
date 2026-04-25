#!/usr/bin/env node
/**
 * In blog HTML: if a page has both Article and BlogPosting JSON-LD with the same
 * mainEntityOfPage @id as the page canonical, remove the redundant BlogPosting.
 * Aligns Article datePublished/dateModified with og:article times when present
 * (parses JSON; safe for nested author objects).
 *
 * Run: node scripts/remove-redundant-blogposting.js
 */

const fs = require("fs");
const path = require("path");

const REPO = path.resolve(__dirname, "..");
const BLOG = path.join(REPO, "blog");

const CANON = /<link\s+rel="canonical"\s+href="([^"]+)"/i;
const PUB = /<meta\s+property="article:published_time"\s+content="([^"]+)"/i;
const MOD = /<meta\s+property="article:modified_time"\s+content="([^"]+)"/i;

const PUBLISHER = {
  "@type": "Organization",
  name: "NutriThrive",
  logo: {
    "@type": "ImageObject",
    url: "https://nutrithrive.com.au/assets/images/logo/LOGO.webp",
  },
};

function parseJsonLdBlocks(html) {
  const re =
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    const inner = m[1].trim();
    if (!inner) continue;
    try {
      out.push({ raw: m[0], obj: JSON.parse(inner) });
    } catch {
      // skip unparseable
    }
  }
  return out;
}

function hasArticleForUrl(blocks, pageId) {
  return blocks.some(
    (b) =>
      b.obj &&
      b.obj["@type"] === "Article" &&
      b.obj.mainEntityOfPage &&
      b.obj.mainEntityOfPage["@id"] === pageId,
  );
}

function shouldRemoveBlogPosting(block, canonical, blocks) {
  if (!block.obj || block.obj["@type"] !== "BlogPosting") return false;
  const mep = block.obj.mainEntityOfPage;
  const id = mep && mep["@id"];
  if (!id || id !== canonical) return false;
  return hasArticleForUrl(blocks, canonical);
}

/**
 * For the Article whose mainEntityOfPage matches canonical, set dates from og
 * and ensure publisher.
 */
function rewriteArticleJsonLd(html, canonical, datePub, dateMod) {
  if (!datePub) return html;
  const mod = dateMod || datePub;
  return html.replace(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    (full, inner) => {
      const t = inner.trim();
      if (!t) return full;
      let o;
      try {
        o = JSON.parse(t);
      } catch {
        return full;
      }
      if (o["@type"] !== "Article") return full;
      if (!o.mainEntityOfPage || o.mainEntityOfPage["@id"] !== canonical) {
        return full;
      }
      o.datePublished = datePub;
      o.dateModified = mod;
      if (!o.publisher) o.publisher = PUBLISHER;
      const open = full.match(/^<script type="application\/ld\+json"[^>]*>/i);
      const tag = open ? open[0] : '<script type="application/ld+json">';
      return `${tag}${JSON.stringify(o)}</script>`;
    },
  );
}

function processFile(absPath) {
  let s = fs.readFileSync(absPath, "utf8");
  const before = s;

  const canonM = s.match(CANON);
  if (!canonM) return { changed: false, path: absPath };

  const canonical = canonM[1];
  const pubM = s.match(PUB);
  const modM = s.match(MOD);
  const datePub = pubM ? pubM[1] : null;
  const dateMod = modM ? modM[1] : null;

  const blocks = parseJsonLdBlocks(s);
  if (!hasArticleForUrl(blocks, canonical)) {
    return { changed: false, path: absPath };
  }

  for (const b of blocks) {
    if (shouldRemoveBlogPosting(b, canonical, blocks)) {
      s = s.split(b.raw).join("");
    }
  }

  if (datePub) {
    s = rewriteArticleJsonLd(s, canonical, datePub, dateMod);
  }

  if (s !== before) {
    fs.writeFileSync(absPath, s, "utf8");
    return { changed: true, path: absPath };
  }
  return { changed: false, path: absPath };
}

function main() {
  const files = fs
    .readdirSync(BLOG)
    .filter((n) => n.endsWith(".html"))
    .map((n) => path.join(BLOG, n));

  const changed = [];
  for (const f of files) {
    const r = processFile(f);
    if (r.changed) changed.push(r.path);
  }

  console.log(
    `Updated ${changed.length} file(s) (removed redundant BlogPosting / aligned Article).`,
  );
  changed.forEach((p) => console.log("  -", path.relative(REPO, p)));
}

main();
