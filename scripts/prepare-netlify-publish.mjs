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
// IndexNow requires a public UTF-8 root file whose name and content match.
// Publishing the key does not submit URLs; submissions remain a separate step.
const indexNowKeyPath = path.join(REPO_ROOT, '.indexnow-key');
{
  // Prefer a local file for developer convenience; fall back to env var for CI/Netlify builds
  // because `.indexnow-key` is intentionally gitignored.
  const key =
    (fs.existsSync(indexNowKeyPath) ? fs.readFileSync(indexNowKeyPath, 'utf8') : '').trim() ||
    (process.env.INDEXNOW_KEY || '').trim();

  if (!key) {
    console.warn(
      'IndexNow key not found (missing .indexnow-key and INDEXNOW_KEY env var). Skipping publishing IndexNow verification files.',
    );
  } else {
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) {
    throw new Error('Invalid IndexNow key; refusing to publish a malformed verification file.');
  }
  // Option 1 (recommended by IndexNow): https://<host>/<key>.txt
  fs.writeFileSync(path.join(OUT, `${key}.txt`), key, 'utf8');

  // Option 2 (also valid): https://<host>/.well-known/indexnow-key.txt (body is the key only)
  const wellKnownDir = path.join(OUT, '.well-known');
  fs.mkdirSync(wellKnownDir, { recursive: true });
  fs.writeFileSync(path.join(wellKnownDir, 'indexnow-key.txt'), key, 'utf8');

  // Convenience URL: https://<host>/indexnow-key.txt (some tooling checks this)
  fs.writeFileSync(path.join(OUT, 'indexnow-key.txt'), key, 'utf8');
  }
}
// A small number of preserved ranking pages still use the legacy shared
// storefront scripts. They live outside site/ because they are also build
// inputs, so explicitly publish the browser-ready global bundle they reference.
const GLOBAL_SCRIPTS = path.join(REPO_ROOT, 'scripts', 'global');
if (fs.existsSync(GLOBAL_SCRIPTS)) {
  copyDir(GLOBAL_SCRIPTS, path.join(OUT, 'scripts', 'global'));
}
console.log('Prepared', OUT, 'from', SITE_ROOT);
