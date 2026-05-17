#!/usr/bin/env node
import fs from "fs";
import path from "path";

const BLOG = path.join(process.cwd(), "blog");
const V2_HEAD = fs.readFileSync(
  path.join(process.cwd(), "scripts/migrate-blogs-v2-layout.mjs"),
  "utf8"
);

// Reuse cleanHead logic inline
function cleanHead(head) {
  let h = head;
  h = h.replace(/<style[\s\S]*?<\/style>/gi, "");
  h = h.replace(/<link[^>]*(?:style\.css|blog\.css|blog-story|newsletter-popup|design-system)[^>]*\/?>/gi, "");
  h = h.replace(/<link[^>]*Inter[^>]*\/?>/gi, "");
  h = h.replace(/<noscript>[\s\S]*?<\/noscript>/gi, "");
  const shellStart = h.indexOf("<!-- Nutri Thrive v2 blog shell -->");
  if (shellStart === -1) {
    const snippet = V2_HEAD.match(/const V2_HEAD = `([\s\S]*?)`;/);
    if (snippet) h += "\n" + snippet[1];
  }
  if (!h.includes("blog-v2-index.css")) {
    h += '\n<link href="../blog/blog-v2-index.css" rel="stylesheet"/>';
  }
  return h.trim();
}

function trailingScripts(html) {
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!body) return '<script defer src="../scripts/global/newsletter-popup.js"></script>';
  const afterFooter = body[1].split(/<footer[\s\S]*?<\/footer>/i).pop() || "";
  const scripts = [];
  const re = /<script[\s\S]*?<\/script>/gi;
  let m;
  while ((m = re.exec(afterFooter))) {
    if (m[0].includes("newsletter") || m[0].includes("searchBlogPosts")) scripts.push(m[0]);
  }
  if (!scripts.length) scripts.push('<script defer src="../scripts/global/newsletter-popup.js"></script>');
  return scripts.join("\n");
}

const html = fs.readFileSync(path.join(BLOG, "index.html"), "utf8");
const head = cleanHead(html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)[1]);
const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)[1].trim();
const scripts = trailingScripts(html);

const out = `<!DOCTYPE html>
<html class="light" lang="en-AU">
<head>
${head}
</head>
<body class="font-body-md text-body-md overflow-x-hidden">
<nav class="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20 shadow-sm">
<div class="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between">
<a class="flex items-center gap-base" href="/">
<img src="../assets/images/logo/LOGO.webp" alt="NutriThrive" width="40" height="40" class="h-9 w-auto"/>
<span class="font-display text-headline-md text-moringa-leaf">Nutri Thrive</span>
</a>
<div class="hidden md:flex items-center gap-gutter">
<a class="font-label-lg text-forest-deep/80 hover:text-moringa-leaf" href="/products/">Shop</a>
<a class="font-label-lg text-forest-deep/80 hover:text-moringa-leaf" href="/pages/about/about.html">About</a>
<a class="font-label-lg text-moringa-leaf border-b-2 border-moringa-leaf font-semibold" href="/blog/">Blog</a>
<a class="font-label-lg text-forest-deep/80 hover:text-moringa-leaf" href="/contact">Contact</a>
</div>
<a class="material-symbols-outlined text-forest-deep p-2 rounded-full" href="/pages/shop/cart.html">shopping_bag</a>
</motion>
</nav>
<main class="pt-24 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop blog-v2-index">
<section class="text-center mb-12">
<p class="font-label-sm uppercase tracking-wider text-moringa-leaf font-bold mb-3">Wellness Journal</p>
<h1 class="font-display text-headline-lg md:text-display text-forest-deep mb-4">Find and Explore Our Blogs</h1>
<p class="font-body-lg text-on-surface-variant max-w-2xl mx-auto">Moringa guides, Melbourne wellness stories, and evidence-led nutrition for Australia.</p>
</section>
${main}
</main>
<footer class="bg-forest-deep text-pure-white pt-section-gap pb-base mt-12">
<div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center text-sm opacity-80">
<span class="font-display text-headline-md text-primary-fixed block mb-2">Nutri Thrive</span>
<p>© ${new Date().getFullYear()} Nutri Thrive · Melbourne, Australia</p>
</div>
</footer>
${scripts}
</body>
</html>`;

fs.writeFileSync(path.join(BLOG, "index.html"), out.replace(/<\/motion>/g, "</div>"));
console.log("Migrated blog/index.html");
