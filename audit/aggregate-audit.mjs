#!/usr/bin/env node
/**
 * One-off: aggregate firecrawl map + scrapes into audit markdown files.
 * Run: node audit/aggregate-audit.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mapPath = path.join(root, ".firecrawl", "nutrithrive-map.json");
const scrapesDir = path.join(root, ".firecrawl", "scrapes-50");
const site = "https://nutrithrive.com.au";
const siteHost = "nutrithrive.com.au";

function stripTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
}

function textNodesBetween(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  const out = [];
  let m;
  while ((m = re.exec(html))) {
    out.push(stripTags(m[1]).replace(/\s+/g, " ").trim());
  }
  return out;
}

function pick(m, ...keys) {
  for (const k of keys) {
    if (m[k] != null && m[k] !== "") return m[k];
  }
  return "";
}

function getCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i) || html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (!m) {
    const m2 = html.match(/rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
    return m2 ? m2[1] : "";
  }
  const href = m[0].match(/href=["']([^"']+)["']/i);
  return href ? href[1] : "";
}

function getSchemaTypes(html) {
  const types = new Set();
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    const raw = m[1].trim();
    try {
      const o = JSON.parse(raw);
      const walk = (x) => {
        if (!x) return;
        if (Array.isArray(x)) {
          x.forEach(walk);
          return;
        }
        if (typeof x === "object") {
          if (x["@graph"]) walk(x["@graph"]);
          if (x["@type"]) {
            const t = x["@type"];
            if (Array.isArray(t)) t.forEach((a) => types.add(a));
            else types.add(t);
          }
        }
      };
      walk(o);
    } catch {
      // ignore bad JSON
    }
  }
  return [...types].sort();
}

function isInternal(href) {
  if (!href) return false;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  if (href.startsWith("/") && !href.startsWith("//")) return true;
  return href.includes(siteHost);
}

function groupUrl(u) {
  const p = u.replace(/\/$/, "");
  if (p === site || p === site.replace(/https?:\/\//, "")) return "Homepage";
  if (p.includes("/blog/") || p.endsWith("/blog")) return "Blog posts & tools";
  if (p.includes("/products")) return "Product / shop";
  if (p.includes("privacy") || p.includes("legal") || p.includes("shipping-returns") || p.includes("shipping/")) return "Legal / policy";
  if (p.includes("/contact") || p.includes("newsletter") || p.includes("pages/contact")) return "Contact / lead capture";
  if (p.includes("/about") || p.includes("/melbourne") || p.match(/\/(faq)($|\/)/)) return "About / local / support";
  if (p.includes("/nutrithrive_labs") || p.includes("size-converter") || p.includes("calendar")) return "Labs / tools";
  if (p.includes("/pages/") || p.includes("/cart")) return "Site pages (cart, guides)";
  if (p.includes("sitemap")) return "Technical / sitemap";
  return "Other";
}

// --- site map
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
const links = map.data?.links || [];
const rows = links
  .map((L) => (typeof L === "string" ? { url: L } : L))
  .filter((x) => x.url);
const byGroup = {};
for (const r of rows) {
  const g = groupUrl(r.url);
  if (!byGroup[g]) byGroup[g] = [];
  byGroup[g].push(r);
}

let md1 = `# Site map — ${site}\n\n**Discovered (Firecrawl map, limit 500):** ${rows.length} URLs  \n**Sitemap also lists:** [${site}/sitemap.xml](${site}/sitemap.xml)\n\n## URLs by type\n\n`;
const order = [
  "Homepage",
  "Product / shop",
  "Blog posts & tools",
  "About / local / support",
  "Contact / lead capture",
  "Legal / policy",
  "Labs / tools",
  "Site pages (cart, guides)",
  "Technical / sitemap",
  "Other",
];
for (const g of order) {
  if (!byGroup[g]?.length) continue;
  md1 += `### ${g} (${byGroup[g].length})\n\n`;
  for (const r of byGroup[g].sort((a, b) => a.url.localeCompare(b.url))) {
    const t = r.title ? ` — *${r.title}*` : "";
    md1 += `- [${r.url}](${r.url})${t}\n`;
  }
  md1 += "\n";
}
md1 += `## Every URL (flat list)\n\n`;
for (const r of rows.sort((a, b) => a.url.localeCompare(b.url))) {
  md1 += `- ${r.url}\n`;
}
fs.writeFileSync(path.join(root, "audit", "01_site_map.md"), md1);

// --- process scrapes
const files = fs
  .readdirSync(scrapesDir)
  .filter((f) => /^\d{2}\.json$/.test(f))
  .sort();
const pages = [];
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(path.join(scrapesDir, f), "utf8"));
  const m = j.metadata || {};
  const html = j.html || "";
  const allLinks = j.links || [];
  const h1s = textNodesBetween(html, "h1");
  const h2s = textNodesBetween(html, "h2");
  const h3s = textNodesBetween(html, "h3");
  const imgRe = /<img[^>]+>/gi;
  const images = [];
  let im;
  while ((im = imgRe.exec(html))) {
    const tag = im[0];
    const srcM = tag.match(/src=["']([^"']+)["']/i);
    const altM = tag.match(/alt=["']([^"']*)["']/i);
    const src = srcM ? srcM[1] : "";
    const alt = altM ? altM[1] : null;
    const hasAlt = /alt=/.test(tag);
    images.push({ src, alt, hasAlt, loadingLazy: /loading=["']lazy["']/i.test(tag) });
  }
  const bodyText = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const wc = bodyText
    ? stripTags(bodyText[1])
        .replace(/\s+/g, " ")
        .trim()
        .split(/\s+/).length
    : 0;
  const internal = [...new Set(allLinks.filter(isInternal))];
  const page = {
    sourceFile: f,
    url: m.url || m.sourceURL || allLinks[0] || "",
    finalStatus: m.statusCode,
    title: pick(m, "title", "ogTitle", "og:title"),
    metaDescription: pick(m, "description", "ogDescription", "og:description"),
    h1: h1s[0] || "(none)",
    h1Count: h1s.length,
    h2s,
    h3s: h3s.slice(0, 25), // cap for md size
    h3sTruncated: h3s.length > 25,
    wordCount: wc,
    internalLinks: internal,
    imagesSample: images.slice(0, 30),
    imagesTotal: images.length,
    imagesMissingAlt: images.filter((i) => i.hasAlt && (i.alt == null || i.alt === "")).length,
    imagesNoAltAttr: images.filter((i) => !i.hasAlt).length,
    canonical: getCanonical(html) || m.ogUrl || m["og:url"] || "",
    schemaTypes: getSchemaTypes(html),
  };
  pages.push(page);
}

let md2 = `# Raw page extractions (50 pages scraped)\n\n**Target domain:** ${site}  \n**Method:** Firecrawl ` + "`scrape`" + ` (html + links) per URL; headings / images / word count / schema parsed locally.\n\n`;
for (const p of pages) {
  md2 += `---\n\n## ${p.url}\n\n- **Scrape file:** \`${p.sourceFile}\`\n`;
  md2 += `- **HTTP status:** ${p.finalStatus}\n`;
  md2 += `- **Title (document):** ${p.title || "(empty)"} (${(p.title || "").length} chars)\n`;
  md2 += `- **Meta description:** ${p.metaDescription || "(empty)"} (${(p.metaDescription || "").length} chars)\n`;
  md2 += `- **Canonical (from HTML or og:url):** ${p.canonical || "(not found)"}\n`;
  md2 += `- **H1:** ${p.h1} — **H1 count:** ${p.h1Count}\n`;
  md2 += `- **H2s (${p.h2s.length}):** ${p.h2s.slice(0, 15).join(" | ")}${p.h2s.length > 15 ? " …" : ""}\n`;
  md2 += `- **H3s (first 25, total ${p.h3s.length + (p.h3sTruncated ? "+" : "")}):** ${p.h3s.join(" | ")}${p.h3sTruncated ? " …" : ""}\n`;
  md2 += `- **Word count (body text, approximate):** ${p.wordCount}\n`;
  md2 += `- **Internal links (unique, same site):** ${p.internalLinks.length} — ${p.internalLinks.slice(0, 20).join(", ")}${p.internalLinks.length > 20 ? " …" : ""}\n`;
  md2 += `- **Images:** ${p.imagesTotal} — missing \`alt\` or empty alt: ${p.imagesMissingAlt + p.imagesNoAltAttr} (incl. no alt attr: ${p.imagesNoAltAttr})\n`;
  if (p.imagesSample.length) {
    for (const im of p.imagesSample.slice(0, 8)) {
      const alt = im.hasAlt ? JSON.stringify(im.alt) : "(no alt attribute)";
      const lazy = im.loadingLazy ? "lazy" : "not marked lazy";
      md2 += `  - \`${im.src?.slice(0, 100)}${im.src?.length > 100 ? "…" : ""}\` — alt: ${alt} — ${lazy}\n`;
    }
  }
  md2 += `- **JSON-LD @types found:** ${p.schemaTypes.length ? p.schemaTypes.join(", ") : "(none)"}\n\n`;
}
fs.writeFileSync(path.join(root, "audit", "02_raw_pages.md"), md2);

// --- load titles/desc for duplicate analysis across 50
const titleCount = {};
const descCount = {};
for (const p of pages) {
  const t = (p.title || "").trim();
  if (t) titleCount[t] = (titleCount[t] || 0) + 1;
  const d = (p.metaDescription || "").trim();
  if (d) descCount[d] = (descCount[d] || 0) + 1;
}

// --- technical SEO 03 (rules from instructions)
const issues = { titles: [], meta: [], headings: [], images: [], links: [], content: [], urls: [], schema: [] };

for (const p of pages) {
  const u = p.url;
  if (!p.title) issues.titles.push({ u, msg: "Missing or empty document title" });
  if (p.title && p.title.length > 60) issues.titles.push({ u, msg: `Title ${p.title.length} chars (often truncated in SERPs; aim ≤60)` });
  if (p.title && p.title.length < 30 && p.title.length) issues.titles.push({ u, msg: `Title only ${p.title.length} chars (may be weak for CTR)` });
  if (!p.metaDescription) issues.meta.push({ u, msg: "Missing meta description" });
  if (p.metaDescription && p.metaDescription.length > 160) issues.meta.push({ u, msg: `Meta description ${p.metaDescription.length} chars (likely truncated; aim ~150–160 max)` });
  if (p.metaDescription && p.metaDescription.length < 70 && p.metaDescription.length) issues.meta.push({ u, msg: `Meta description only ${p.metaDescription.length} chars (opportunity to expand with benefit-led copy)` });
  if (p.h1Count === 0) issues.headings.push({ u, msg: "No H1" });
  if (p.h1Count > 1) issues.headings.push({ u, msg: `Multiple H1 elements (${p.h1Count})` });
  for (let i = 0; i < p.h2s.length; i++) {
    if (p.h2s[i].length < 3) continue;
  }
  if (p.wordCount < 300 && !u.includes("cart") && !u.includes("password") && !u.includes("pomodoro") && !u.includes("time-converter") && !u.includes("dedup-lines") && !u.includes("sitemap-generator") && !u.includes("universal-size") && !u.includes("natural-language")) {
    // thin content - still flag some tools differently
    if (u.includes("nutrithrive_labs") || u.includes("newsletter") || (u.includes("/contact") && p.wordCount < 300)) {
      if (p.wordCount < 150) issues.content.push({ u, msg: `Thin main content ~${p.wordCount} words` });
    } else {
      issues.content.push({ u, msg: `Body word count ${p.wordCount} (under 300 — thin for commercial/blog unless intentional)` });
    }
  }
  if (p.imagesMissingAlt + p.imagesNoAltAttr > 0 && p.imagesTotal > 0) {
    issues.images.push({ u, msg: `${p.imagesMissingAlt + p.imagesNoAltAttr} image(s) without useful alt` });
  }
  if (p.internalLinks.length < 2 && p.wordCount > 200 && !u.includes("cart") && !u.includes("pomodoro") && !u.includes("password")) {
    issues.links.push({ u, msg: `Only ${p.internalLinks.length} internal outlinks — risk of low crawl paths` });
  }
  if (!p.schemaTypes.length) issues.schema.push({ u, msg: "No JSON-LD detected in HTML" });
  if (p.canonical) {
    const c = p.canonical;
    if (c.includes("_") && c.includes("nutrithrive")) {
      if ((c.match(/_/g) || []).length) issues.urls.push({ u, msg: `Canonical uses underscores: ${c}` });
    }
  }
  if (/[A-Z]/.test(new URL(p.url).pathname) && p.url === p.url) {
    if (p.url !== p.url.toLowerCase()) issues.urls.push({ u, msg: "URL path contains uppercase letters" });
  }
  const pathlen = new URL(p.url).pathname.length;
  if (pathlen > 75) issues.urls.push({ u, msg: `URL path length ${pathlen} (often cited comfort zone under ~75 path chars for readability)` });
}

// duplicate titles
for (const [t, c] of Object.entries(titleCount)) {
  if (c > 1) issues.titles.push({ u: "(multiple pages)", msg: `Duplicate title (${c}×): "${t.slice(0, 80)}${t.length > 80 ? "…" : ""}"` });
}
for (const [d, c] of Object.entries(descCount)) {
  if (c > 1) issues.meta.push({ u: "(multiple pages)", msg: `Duplicate meta description (${c}×): "${d.slice(0, 60)}${d.length > 60 ? "…" : ""}"` });
}

// Specific known problems from data
const productsPage = pages.find((x) => x.url.replace(/\/$/, "").endsWith("/products"));
if (productsPage) {
  const can = (productsPage.canonical || "").replace(/\/$/, "");
  if (can && !can.includes("/products") && (can.endsWith("nutrithrive.com.au") || can.endsWith("/")))
    issues.headings.push({ u: productsPage.url, msg: "Canonical on /products/ points to homepage — duplicate-content risk vs shop page" });
}

// Orphan risk: from map, count inbound (only from 50-scrape)
const inCount = Object.fromEntries(pages.map((p) => [p.url.replace(/\/$/, ""), 0]));
const norm = (s) => s.replace(/\/$/, "");
for (const p of pages) {
  for (const l of p.internalLinks) {
    try {
      const n = norm(l.split("#")[0]);
      if (inCount.hasOwnProperty(n) || inCount.hasOwnProperty(n + "/")) {
        inCount[n] = (inCount[n] || 0) + 1;
        inCount[n + "/"] = (inCount[n + "/"] || 0) + 1;
      }
    } catch {
      /* */
    }
  }
}

let md3 = `# Technical SEO audit — ${site}\n\n**Based on:** 50 live scrapes in \`02_raw_pages.md\` and full map (${rows.length} URLs).\n\n`;
md3 += `## Title tags\n\n`;
md3 += issues.titles.length
  ? issues.titles.map((i) => `- **${i.u}** — ${i.msg}`).join("\n")
  : "- No issues flagged in sample.";
md3 += `\n\n## Meta descriptions\n\n${issues.meta.map((i) => `- **${i.u}** — ${i.msg}`).join("\n") || "(none)"}`;
md3 += `\n\n## Heading structure\n\n${issues.headings.map((i) => `- **${i.u}** — ${i.msg}`).join("\n") || "(none)"}`;
md3 += `\n\n## Images & performance hints\n\n${issues.images.map((i) => `- **${i.u}** — ${i.msg}`).join("\n") || "(none)"}`;
md3 += `\n\n## Internal linking\n\n${issues.links.map((i) => `- **${i.u}** — ${i.msg}`).join("\n") || "(none)"}`;
md3 += `\n\n- **Orphan / low-discoverability note:** Map shows duplicate paths for the same content (e.g. \`moringa-melbourne-complete-growers-report-2026\` and \`.html\`). In-links should consolidate on one **canonical** URL.`;
md3 += `\n\n## URL structure\n\n${issues.urls.map((i) => `- **${i.u}** — ${i.msg}`).join("\n") || "No uppercase paths or long paths in the 50-scrape set beyond notes above."}`;
md3 += `\n\n- **Duplicate paths:** e.g. \`${site}/blog/…\` vs \`…html\` and \`/blog/how-to-add-moringa-to-diet\` (clean URL) — ensure 301/rel=canonical to one version.`;
md3 += `\n\n## Content quality (sample)\n\n${issues.content.map((i) => `- **${i.u}** — ${i.msg}`).join("\n") || "(none major)"}`;

md3 += `\n\n## Schema / structured data (JSON-LD)\n\n`;
const withSchema = pages.filter((p) => p.schemaTypes.length);
const withoutSchema = pages.filter((p) => !p.schemaTypes.length);
md3 += `**Pages in sample *with* JSON-LD:** ${withSchema.length} / 50\n\n`;
for (const p of withSchema.slice(0, 15)) {
  md3 += `- [${p.url}](${p.url}): ${p.schemaTypes.join(", ")}\n`;
}
if (withSchema.length > 15) md3 += `- … and ${withSchema.length - 15} more\n`;
md3 += `\n**Sample pages *without* JSON-LD in HTML:**\n`;
for (const p of withoutSchema) {
  md3 += `- ${p.url}\n`;
}
md3 += `\n**Recommendations:** Product pages use \`Product\` / \`Offer\` where present — good. Long-form **blog** should consistently ship \`Article\` or \`BlogPosting\` + \`BreadcrumbList\` + (where relevant) \`FAQPage\` / \`HowTo\`. **LocalBusiness** (or \`Store\` with \`hasPOS\` / \`location\`) on homepage/About if local SEO matters (address already in footer).`;

fs.writeFileSync(path.join(root, "audit", "03_technical_seo.md"), md3);
console.log("Wrote 01, 02, 03. Pages:", pages.length, "Map URLs:", rows.length);
