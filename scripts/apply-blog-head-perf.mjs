#!/usr/bin/env node
/**
 * Apply blog head performance pattern to all v2 blog HTML files.
 * Run: node scripts/apply-blog-head-perf.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  applyBlogHeadPerf,
  optimizeHeroImages,
  readBlogCriticalCss,
} from './lib/blog-head-perf.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'blog');
const criticalCss = readBlogCriticalCss();

const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.html'));
let changed = 0;

for (const file of files) {
  const full = path.join(BLOG_DIR, file);
  const original = fs.readFileSync(full, 'utf8');
  let html = optimizeHeroImages(original);
  html = applyBlogHeadPerf(html, { criticalCss });
  if (html !== original) {
    fs.writeFileSync(full, html);
    changed += 1;
    console.log(`updated ${file}`);
  }
}

console.log(`\n${changed} blog file(s) updated.`);
