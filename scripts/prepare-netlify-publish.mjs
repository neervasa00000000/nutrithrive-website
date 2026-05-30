#!/usr/bin/env node
/**
 * Copy site to .netlify-publish/ excluding paths in .netlifyignore (for CLI deploy).
 * Run: node scripts/prepare-netlify-publish.mjs && netlify deploy --dir=.netlify-publish --prod
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '.netlify-publish');

const IGNORE = new Set([
  '.git',
  '.netlify-publish',
  'node_modules',
  '.firecrawl',
  '.build',
  'audit',
  'tools',
]);

function shouldIgnore(rel) {
  if (!rel) return false;
  const parts = rel.split('/');
  if (IGNORE.has(parts[0])) return true;
  if (parts[0] === 'scripts' && parts[1] === 'templates') return true;
  return false;
}

function copyDir(src, dest, rel = '') {
  for (const name of fs.readdirSync(src)) {
    const relChild = rel ? `${rel}/${name}` : name;
    if (shouldIgnore(relChild)) continue;
    const from = path.join(src, name);
    const to = path.join(dest, name);
    const st = fs.statSync(from);
    if (st.isDirectory()) {
      fs.mkdirSync(to, { recursive: true });
      copyDir(from, to, relChild);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
copyDir(ROOT, OUT);
console.log('Prepared', OUT);
