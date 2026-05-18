#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function patch(html) {
  if (!html.includes('id="tailwind-config"') || /"maxWidth"\s*:/.test(html)) return html;
  return html.replace(
    /"spacing"\s*:\s*\{/,
    `"maxWidth": {
                      "container-max": "1280px"
              },
              "spacing": {`
  );
}

let n = 0;
for (const f of walk(REPO)) {
  const html = fs.readFileSync(f, 'utf8');
  const next = patch(html);
  if (next !== html) {
    fs.writeFileSync(f, next);
    n++;
  }
}
console.log(`Patched maxWidth in ${n} HTML files`);
