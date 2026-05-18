#!/usr/bin/env node
/**
 * Normalize v2 test templates: tailwind-config before CDN, strip main header offsets, maxWidth in theme.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const V2 = path.join(REPO, 'scripts/templates/v2');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function patchTailwindConfig(html) {
  if (!html.includes('id="tailwind-config"') || /"maxWidth"\s*:/.test(html)) return html;
  return html.replace(
    /"spacing"\s*:\s*\{/,
    `"maxWidth": {
                      "container-max": "1280px"
              },
              "spacing": {`
  );
}

function ensureMainBelowHeader(html) {
  return html.replace(/<main\b([^>]*)>/gi, (tag, attrs) => {
    const clsMatch = attrs.match(/\bclass=(["'])([\s\S]*?)\1/i);
    if (!clsMatch) return '<main class="nt-main-below-header">';
    const quote = clsMatch[1];
    let classes = clsMatch[2]
      .replace(/\bpt-(24|28|32|40)\b/g, '')
      .replace(/\bmt-20\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!/\bnt-main-below-header\b/.test(classes)) {
      classes = classes ? `nt-main-below-header ${classes}` : 'nt-main-below-header';
    }
    let nextAttrs = attrs.replace(clsMatch[0], `class=${quote}${classes}${quote}`);
    nextAttrs = nextAttrs.replace(/\s+/g, ' ').trim();
    return nextAttrs ? `<main ${nextAttrs}>` : '<main class="nt-main-below-header">';
  });
}

function fixHeadOrder(html) {
  const cdnRe = /<script src="https:\/\/cdn\.tailwindcss\.com[^>]*><\/script>\s*/i;
  const configRe = /(<script id="tailwind-config">[\s\S]*?<\/script>)\s*/i;
  if (!cdnRe.test(html) || !configRe.test(html)) return html;
  const cdnIdx = html.search(cdnRe);
  const configIdx = html.search(configRe);
  if (configIdx < cdnIdx) return html;
  const cdn = html.match(cdnRe)[0];
  const config = html.match(configRe)[1];
  let out = html.replace(cdnRe, '');
  out = out.replace(configRe, `${config}\n${cdn}`);
  return out;
}

let n = 0;
for (const file of walk(V2)) {
  let html = fs.readFileSync(file, 'utf8');
  const orig = html;
  html = patchTailwindConfig(html);
  html = ensureMainBelowHeader(html);
  html = fixHeadOrder(html);
  if (html !== orig) {
    fs.writeFileSync(file, html);
    n++;
  }
}
console.log(`Updated ${n} v2 test template(s)`);
