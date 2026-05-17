#!/usr/bin/env node
/**
 * Per-blog cleanup: remove duplicate v2 shell, optimize images, responsive heroes.
 */
import fs from "fs";
import path from "path";

const BLOG = path.join(process.cwd(), "blog");
const HEROES = JSON.parse(
  fs.readFileSync(path.join(BLOG, "blog-v2-heroes.json"), "utf8")
);
const RELATED_THUMB = "/assets/images/homepage/product-showcase/thumbs/Moringa.webp";

function heroForFile(filename, html) {
  if (HEROES[filename]) return HEROES[filename];
  const og = html.match(/property="og:image"\s+content="([^"]+)"/i);
  if (og && /moringa-social/i.test(og[1])) return HEROES.social;
  return HEROES.default;
}

function dedupeShell(html) {
  const footerIdx = html.indexOf('<footer class="bg-forest-deep');
  if (footerIdx === -1) return html;
  let head = html.slice(0, footerIdx);
  const tail = html.slice(footerIdx);

  while ((head.match(/Stay Vitalized/g) || []).length > 1) {
    head = head.replace(
      /<section class="mt-20 p-8 md:p-12 bg-parchment-base[\s\S]*?<\/aside>\s*<\/div>\s*<\/main>\s*/i,
      ""
    );
  }

  const mainCloses = [...head.matchAll(/<\/main>/g)];
  if (mainCloses.length > 1) {
    const last = mainCloses[mainCloses.length - 1].index;
    const first = mainCloses[0].index;
    head = head.slice(0, first) + head.slice(last);
  }

  head = head.replace(
    /(<div class="blog-v2-prose prose prose-lg max-w-none">\s*)+/g,
    '<div class="blog-v2-prose prose prose-lg max-w-none">\n'
  );
  head = head.replace(/<\/div>\s*<\/motion>\s*(?=<section class="mt-20)/g, "</div>\n");

  head = head.replace(
    /<\/header>\s*(?=<!-- What You'll Learn|<section|<h2|<div class="table-of-contents")/i,
    ""
  );
  head = head.replace(/&amp;amp;/g, "&amp;");

  return head + tail;
}

function optimizeHero(html, filename) {
  const cfg = heroForFile(filename, html);
  const webp = cfg.hero || HEROES.default.hero;
  const jpg = cfg.heroFallback || HEROES.default.heroFallback || webp;
  const w = cfg.width || 800;
  const h = cfg.height || 450;

  const heroBlock = `<div class="w-full aspect-[16/9] rounded-xl overflow-hidden mb-12 shadow-sm bg-surface-container">
<picture>
<source type="image/webp" srcset="/assets/images/blog/hero-moringa-400.webp 400w, ${webp} 800w" sizes="(max-width: 768px) 100vw, 800px"/>
<img alt="" class="w-full h-full object-cover" src="${jpg}" width="${w}" height="${h}" loading="eager" decoding="async" fetchpriority="high" sizes="(max-width: 768px) 100vw, 800px"/>
</picture>
</div>`;

  return html.replace(
    /<div class="w-full aspect-\[16\/9\][\s\S]*?<\/div>\s*<\/header>/i,
    `${heroBlock}\n</header>`
  );
}

function optimizeSidebarImages(html) {
  return html
    .replace(/src="\/assets\/images\/og\/moringa-article-1200\.jpg"/g, `src="${RELATED_THUMB}"`)
    .replace(
      /src="https:\/\/nutrithrive\.com\.au\/assets\/images\/og\/moringa-article-1200\.jpg"/g,
      `src="${RELATED_THUMB}"`
    )
    .replace(
      /src="https:\/\/nutrithrive\.com\.au\/assets\/images\/og\/moringa-social-1200\.png"/g,
      `src="${RELATED_THUMB}"`
    );
}

function optimizeBodyImages(html) {
  const seen = new Set();
  return html.replace(/<img\b([^>]*)>/gi, (full, attrs) => {
    if (
      /LOGO\.webp|group-hover|product-showcase\/Moringa|fetchpriority="high"/i.test(
        full
      )
    ) {
      return full;
    }
    const srcM = attrs.match(/\bsrc="([^"]+)"/i);
    if (!srcM) return full;
    const src = srcM[1];
    if (seen.has(src)) return "";
    seen.add(src);

    let a = attrs.replace(/\sstyle="[^"]*"/gi, "");
    a = a.replace(/\s(width|height)="[^"]*"/gi, "");
    if (!/loading=/i.test(a)) a += ' loading="lazy"';
    if (!/decoding=/i.test(a)) a += ' decoding="async"';
    if (!/class=/i.test(a)) {
      a += ' class="blog-v2-content-img"';
    } else if (!/blog-v2-content-img/.test(a)) {
      a = a.replace(/class="([^"]*)"/, 'class="$1 blog-v2-content-img"');
    }
    let outSrc = src;
    if (/\/general\/m\.webp/i.test(src)) {
      outSrc = "/assets/images/blog/moringa-seniors-720.jpg";
    } else if (/\/general\/vic\.webp/i.test(src)) {
      outSrc = "/assets/images/blog/vic-seniors-720.jpg";
    }
    a = a.replace(/\bsrc="[^"]+"/, `src="${outSrc}"`);
    const dims = ' width="720" height="480"';
    return `<img${a}${dims}>`;
  });
}

function processFile(filename) {
  const filePath = path.join(BLOG, filename);
  let html = fs.readFileSync(filePath, "utf8");
  const before = html.length;

  html = dedupeShell(html);
  html = optimizeHero(html, filename);
  html = optimizeSidebarImages(html);
  html = optimizeBodyImages(html);

  fs.writeFileSync(filePath, html);
  return { before, after: html.length, saved: before - html.length };
}

const files = fs.readdirSync(BLOG).filter((f) => f.endsWith(".html") && f !== "index.html");
let totalSaved = 0;
for (const f of files) {
  const r = processFile(f);
  totalSaved += r.saved;
  if (r.saved > 500 || r.before > 70000) {
    console.log(
      `${f}: ${(r.before / 1024).toFixed(0)}KB → ${(r.after / 1024).toFixed(0)}KB (−${(r.saved / 1024).toFixed(0)}KB)`
    );
  }
}
console.log(`Optimized ${files.length} posts, saved ${(totalSaved / 1024).toFixed(0)}KB total`);
