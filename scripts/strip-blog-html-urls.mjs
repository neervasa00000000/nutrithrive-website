#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['node_modules', '.git', 'audit']);

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    if (SKIP.has(f)) continue;
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.(html|js|mjs)$/.test(f)) {
      let c = fs.readFileSync(p, 'utf8');
      const n = c
        .replace(
          /https:\/\/nutrithrive\.com\.au\/blog\/([a-z0-9-]+)\.html/gi,
          'https://nutrithrive.com.au/blog/$1'
        )
        .replace(/href="(\/blog\/[^"#?]+)\.html"/g, 'href="$1"');
      if (n !== c) {
        fs.writeFileSync(p, n);
        console.log(path.relative(ROOT, p));
      }
    }
  }
}

walk(ROOT);
