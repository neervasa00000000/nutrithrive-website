import fs from 'fs';
import path from 'path';
import Beasties from 'beasties';

const STYLESHEET_RE = /<link rel="stylesheet" href="(\/assets\/css\/storefront-system[^"]*)">/;
// Checkout pages keep a plain blocking stylesheet so payment rendering never changes.
const EXCLUDED = /^(?:pages\/shop\/(?:cart|payment|thank-you|checkout)|cart|payment|checkout|thank-you)(?:[./]|$)/;
const BELOW_FOLD_MARKERS = ['<section class="prose-block"', '<div class="prose">'];
const MAX_INLINE_BYTES = 14 * 1024;

function listHtml(dir, root = dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) listHtml(file, root, out);
    else if (name.endsWith('.html')) out.push(path.relative(root, file));
  }
  return out;
}

/** Only the first screen is analysed, so the inlined block covers header, hero, article top and PDP buy box. */
function aboveFoldDocument(html) {
  const mainStart = html.indexOf('<main id="main">');
  if (mainStart === -1) return null;
  let cut = -1;
  for (const marker of BELOW_FOLD_MARKERS) {
    const at = html.indexOf(marker, mainStart);
    if (at !== -1 && (cut === -1 || at < cut)) cut = at;
  }
  if (cut === -1) {
    const sections = [...html.slice(mainStart).matchAll(/<section\b/g)];
    cut = sections.length > 2 ? mainStart + sections[2].index : html.indexOf('</main>', mainStart);
  }
  if (cut === -1) return null;
  // The search panel and mobile menu start hidden; the full stylesheet is loaded before anyone opens them.
  const firstScreen = html.slice(0, cut)
    .replace(/<nav class="nav-mobile[\s\S]*?<\/nav>/, '')
    .replace(/<div class="search-panel"[\s\S]*?<main id="main">/, '<main id="main">');
  return `${firstScreen}</main></body></html>`;
}

export async function inlineCriticalCss(siteRoot) {
  const beasties = new Beasties({
    path: siteRoot,
    publicPath: '/',
    preload: 'media',
    pruneSource: false,
    inlineFonts: false,
    compress: true,
    logLevel: 'silent',
  });
  const report = { processed: 0, skipped: 0, oversized: [] };
  for (const rel of listHtml(siteRoot)) {
    if (EXCLUDED.test(rel)) continue;
    const file = path.join(siteRoot, rel);
    const html = fs.readFileSync(file, 'utf8');
    const link = html.match(STYLESHEET_RE);
    if (!link) {
      report.skipped += 1;
      continue;
    }
    const analysed = aboveFoldDocument(html);
    if (!analysed) continue;
    const out = await beasties.process(analysed);
    const css = out.match(/<style>([\s\S]*?)<\/style>/)?.[1] || '';
    if (!css) continue;
    if (Buffer.byteLength(css) > MAX_INLINE_BYTES) report.oversized.push(`${rel} ${Buffer.byteLength(css)}B`);
    const href = link[1];
    const replacement = `<style data-critical>${css}</style><link rel="stylesheet" href="${href}" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="${href}"></noscript>`;
    fs.writeFileSync(file, html.replace(link[0], replacement));
    report.processed += 1;
  }
  return report;
}
