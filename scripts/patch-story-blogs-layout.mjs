import fs from "fs";
import path from "path";

const BUY = `<!-- Buy CTA -->
<div class="story-buy-inline">
<div class="story-buy-text"><strong>NutriThrive Moringa Powder — $11/100g</strong><span>Shade-dried · Melbourne · ~50 servings</span></div>
<a class="btn-buy-moringa" href="/products/moringa-powder/">Shop Moringa →</a>
</div>
`;

const BUY_STICKY = `
<div class="story-buy-sticky" aria-label="Shop moringa">
<div class="sticky-label">NutriThrive Moringa<span>$11 · Ships from Melbourne</span></div>
<a class="btn-buy-moringa" href="/products/moringa-powder/">Buy Now</a>
</div>
`;

const FILES = [
  {
    slug: "what-to-eat-when-too-tired-melbourne-2026",
    metaFix: {
      bad: 'content="Home from work and too tired to cook? Foods that help vs crash you harder — instant meals, Melbourne shops, moringa, 7-day plan."normal\\" blood tests? A Melbourne woman shares what actually fixed chronic fatigue: iron, sleep, nutrition, stress — and the $11 moringa habit that helped."/>',
      good: 'content="Home from work and too tired to cook? Foods that help vs crash you harder — instant meals, Melbourne shops, moringa, and a 7-day emergency meal plan."/>',
    },
    afterHeader: '<h2 id="intro">',
    midBuy: '<h2 id="moringa">',
  },
  {
    slug: "chronic-fatigue-what-actually-fixed-it-2026",
    afterHeader: '<h2 id="intro">',
    midBuy: '<h3>#1: NutriThrive Moringa Powder ($11)',
  },
  {
    slug: "cystic-acne-gut-healing-what-actually-cleared-skin-2026",
    metaFix: {
      bad: 'content="Exhausted for years with \\"normal\\" blood tests? A Melbourne woman shares what actually fixed chronic fatigue: iron, sleep, nutrition, stress — and the $11 moringa habit that helped."/>',
      good: 'content="Refused Accutane after 5 years of cystic acne. Gut healing, anti-inflammatory diet, moringa, and a 90-day plan that cleared her skin — Sydney 2026."/>',
    },
    afterHeader: '<h2 id="intro">',
    midBuy: '<h2 id="what-worked">',
  },
];

function insertBuyBefore(html, marker) {
  const i = html.indexOf(marker);
  if (i === -1) {
    console.warn("  marker missing:", marker.slice(0, 60));
    return html;
  }
  const chunk = html.slice(Math.max(0, i - 500), i);
  if (chunk.includes("story-buy-inline")) return html;
  return html.slice(0, i) + BUY + html.slice(i);
}

function validate(html) {
  const dupHeader = (html.match(/<header class="blog-post-header">/g) || []).length !== 1;
  const badTag = html.includes("</motion>") || html.includes("<motion>");
  const buyInStrong = html.includes("<strong>NutriThrive Moringa Powder — <header");
  return !(dupHeader || badTag || buyInStrong);
}

const blogDir = path.join(process.cwd(), "blog");

for (const cfg of FILES) {
  const file = path.join(blogDir, `${cfg.slug}.html`);
  let html = fs.readFileSync(file, "utf8");

  if (cfg.metaFix) html = html.replace(cfg.metaFix.bad, cfg.metaFix.good);

  const styleStart = html.indexOf("<style>");
  const styleEnd = html.indexOf("</style>", styleStart);
  if (styleStart !== -1 && styleEnd !== -1) {
    html = html.slice(0, styleStart) + html.slice(styleEnd + 8);
  }

  if (!html.includes("blog-story-article.css")) {
    html = html.replace(
      '<link href="../blog/blog.css" rel="stylesheet"/>',
      '<link href="../blog/blog.css" rel="stylesheet"/>\n<link href="../blog/blog-story-article.css" rel="stylesheet"/>'
    );
  }

  html = html.replace(
    '<body class="blog-post-page">',
    '<body class="blog-post-page blog-story-article">'
  );

  html = html.replace(
    '<motion class="table-of-contents" style="background: #f0f8f3; padding: 2rem; border-radius: 12px; margin: 2rem 0; border-left: 4px solid #175c36;">',
    '<div class="table-of-contents">'
  );
  html = html.replace(
    '<div class="table-of-contents" style="background: #f0f8f3; padding: 2rem; border-radius: 12px; margin: 2rem 0; border-left: 4px solid #175c36;">',
    '<div class="table-of-contents">'
  );
  html = html.replace(
    '<p class="toc-heading" style="color: #175c36; margin-top: 0; font-size: 1.5rem; font-weight: 700;">',
    '<p class="toc-heading">'
  );
  html = html.replace(
    '<ul style="list-style: none; padding-left: 0; margin: 1rem 0;">',
    '<ul class="toc-list">'
  );

  if (!html.includes("story-main")) {
    html = html.replace(
      "</header>\n\n<!-- Table of Contents -->",
      '</header>\n\n<main class="story-main">\n<div class="story-layout">\n<aside class="story-toc" aria-label="Table of contents">\n<!-- Table of Contents -->'
    );
    html = html.replace(
      "</ul>\n</div>\n\n<article class=\"blog-post\">",
      "</ul>\n</div>\n</aside>\n\n<article class=\"blog-post\">"
    );
    html = html.replace(
      "</article>\n\n<!-- Footer -->",
      `</article>\n</div>\n</main>${BUY_STICKY}\n\n<!-- Footer -->`
    );
  }

  const breadcrumbStart = html.indexOf("<!-- Breadcrumb -->");
  if (breadcrumbStart !== -1) {
    const afterBreadcrumb = html.indexOf("\n\n<h2 ", breadcrumbStart);
    if (afterBreadcrumb !== -1) {
      html = html.slice(0, breadcrumbStart) + html.slice(afterBreadcrumb + 2);
    }
  }

  html = insertBuyBefore(html, cfg.afterHeader);
  html = insertBuyBefore(html, cfg.midBuy);
  html = insertBuyBefore(html, '<div class="cta-banner">');

  const ctaLink =
    '<a class="cta-btn-white" href="/products/moringa-powder/">Shop NutriThrive Moringa — $11/100g</a>';
  const ctaEnhanced =
    ctaLink +
    ' <a class="btn-buy-moringa btn-buy-moringa--outline" href="/products/moringa-powder/">View product</a>';
  if (!html.includes("btn-buy-moringa--outline")) {
    html = html.replace(ctaLink, ctaEnhanced);
  }

  html = html.replace(
    '<!-- Related links -->\n<div style="background:#f6fbf8;border:1px solid #d4e8db;border-radius:12px;padding:1.5rem;margin:2.5rem 0;">\n<h3 style="color:#175c36;margin-top:0;">Related Reading</h3>\n<ul style="margin:0;padding-left:1.25rem;">',
    "<!-- Related links -->\n<div class=\"story-related\">\n<h3>Related Reading</h3>\n<ul>"
  );

  const ok = validate(html);
  fs.writeFileSync(file, html);
  const n = (html.match(/story-buy-inline/g) || []).length;
  console.log(cfg.slug, "buy:", n, ok ? "ok" : "CORRUPT");
  if (!ok) process.exitCode = 1;
}
