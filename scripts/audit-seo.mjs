#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.join(repo, "site");
const sitemap = fs.readFileSync(path.join(site, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>(https:\/\/nutrithrive\.com\.au[^<]+)<\/loc>/g)].map((m) => m[1]);
const redirectLines = fs.readFileSync(path.join(site, "_redirects"), "utf8").split(/\r?\n/);
const redirectSources = new Map();
for (const line of redirectLines) {
  const clean = line.replace(/#.*/, "").trim();
  if (!clean) continue;
  const [from, to, rawStatus = "301"] = clean.split(/\s+/);
  const status = Number.parseInt(rawStatus, 10);
  if (from?.startsWith("/") && !from.includes("*") && status >= 300 && status < 400) {
    redirectSources.set(from, { to, status });
  }
}

function decode(value = "") {
  return value
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function pageFile(url) {
  const pathname = new URL(url).pathname;
  if (pathname === "/") return path.join(site, "index.html");
  const bare = pathname.replace(/^\/+|\/+$/g, "");
  const rewrites = {
    about: "pages/about/about.html",
    contact: "pages/contact/contact.html",
    faq: "pages/faq/faq.html",
    melbourne: "pages/homepage/melbourne.html",
    shipping: "pages/shipping/shipping-returns.html",
    "privacy-policy": "pages/legal/privacy-policy.html",
  };
  if (rewrites[bare]) return path.join(site, rewrites[bare]);
  const direct = path.join(site, `${bare}.html`);
  if (fs.existsSync(direct)) return direct;
  return path.join(site, bare, "index.html");
}

function meta(html, name) {
  const tag = html.match(new RegExp(`<meta\\s+[^>]*name=["']${name}["'][^>]*>`, "i"))?.[0] || "";
  return decode(tag.match(/content=["']([^"']*)["']/i)?.[1] || "").trim();
}

const issues = [];
const seenTitles = new Map();
const seenDescriptions = new Map();

function add(url, kind, detail) {
  issues.push({ url: new URL(url).pathname, kind, detail });
}

for (const url of urls) {
  const file = pageFile(url);
  if (!fs.existsSync(file)) {
    add(url, "missing-sitemap-file", path.relative(repo, file));
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "").trim();
  const description = meta(html, "description");
  const robots = meta(html, "robots").toLowerCase();
  const canonical = decode(html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i)?.[0].match(/href=["']([^"']+)/i)?.[1] || "");
  const h1Count = (html.match(/<h1\b/gi) || []).length;

  if (!title) add(url, "missing-title", "");
  if (!description) add(url, "missing-description", "");
  if (!canonical) add(url, "missing-canonical", "");
  else if (canonical.replace(/\/$/, "") !== url.replace(/\/$/, "")) add(url, "canonical-mismatch", canonical);
  if (robots.includes("noindex")) add(url, "sitemap-noindex", robots);
  if (h1Count !== 1) add(url, "h1-count", String(h1Count));
  if (/\.['’](?:t|s|re|ve|ll)\b/i.test(`${title} ${description}`)) add(url, "corrupt-copy", description);

  if (title) {
    const key = title.toLowerCase();
    if (seenTitles.has(key)) add(url, "duplicate-title", seenTitles.get(key));
    else seenTitles.set(key, new URL(url).pathname);
  }
  if (description) {
    const key = description.toLowerCase();
    if (seenDescriptions.has(key)) add(url, "duplicate-description", seenDescriptions.get(key));
    else seenDescriptions.set(key, new URL(url).pathname);
  }

  for (const match of html.matchAll(/<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      add(url, "invalid-json-ld", error.message);
    }
  }

  for (const match of html.matchAll(/<(?:img|source)\b[^>]*(?:src|srcset)=["']([^"']+)["']/gi)) {
    for (const asset of match[1].split(",").map((part) => part.trim().split(/\s+/)[0])) {
      if (!asset.startsWith("/") || asset.startsWith("//")) continue;
      const clean = asset.split(/[?#]/)[0];
      if (!fs.existsSync(path.join(site, clean))) add(url, "missing-image", clean);
    }
  }

  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["']/gi)) {
    const href = decode(match[1]);
    let pathname;
    try {
      const parsed = new URL(href, "https://nutrithrive.com.au");
      if (parsed.hostname !== "nutrithrive.com.au") continue;
      pathname = parsed.pathname;
    } catch {
      continue;
    }
    const rule = redirectSources.get(pathname);
    if (rule) add(url, "internal-link-to-redirect", `${pathname} → ${rule.to}`);
  }
}

const grouped = issues.reduce((out, issue) => {
  (out[issue.kind] ||= []).push(issue);
  return out;
}, {});

console.log(`Audited ${urls.length} sitemap URLs.`);
for (const kind of Object.keys(grouped).sort()) {
  console.log(`\n${kind}: ${grouped[kind].length}`);
  for (const issue of grouped[kind].slice(0, 30)) console.log(`- ${issue.url}${issue.detail ? ` — ${issue.detail}` : ""}`);
  if (grouped[kind].length > 30) console.log(`- … ${grouped[kind].length - 30} more`);
}
if (!issues.length) console.log("No structural SEO errors found in sitemap pages.");
process.exitCode = issues.length ? 1 : 0;
