#!/usr/bin/env node
/**
 * Copy public files from site/ into .netlify-publish/ (flattened to the deploy root).
 * Live URLs stay /blog/..., /products/..., /robots.txt — not /site/...
 * Run: node scripts/prepare-netlify-publish.mjs && netlify deploy --dir=.netlify-publish --prod
 */
import fs from 'fs';
import path from 'path';
import { SITE_ROOT, REPO_ROOT } from './lib/paths.mjs';

const OUT = path.join(REPO_ROOT, '.netlify-publish');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    if (name === '.DS_Store') continue;
    const from = path.join(src, name);
    const to = path.join(dest, name);
    const st = fs.statSync(from);
    if (st.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

if (!fs.existsSync(SITE_ROOT)) {
  console.error('Missing site/ — public website files live there.');
  process.exit(1);
}

if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
copyDir(SITE_ROOT, OUT);
// A small number of preserved ranking pages still use the legacy shared
// storefront scripts. They live outside site/ because they are also build
// inputs, so explicitly publish the browser-ready global bundle they reference.
const GLOBAL_SCRIPTS = path.join(REPO_ROOT, 'scripts', 'global');
if (fs.existsSync(GLOBAL_SCRIPTS)) {
  copyDir(GLOBAL_SCRIPTS, path.join(OUT, 'scripts', 'global'));
}
console.log('Prepared', OUT, 'from', SITE_ROOT);
