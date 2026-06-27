#!/usr/bin/env node
/**
 * Scan blog/*.html for duplicate article body copy (>70% similarity).
 * Excludes footer boilerplate: CTA, related links, update log, disclaimer.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.resolve(__dirname, '../blog');
const THRESHOLD = 0.7;

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[#\w]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractBetweenDiv(html, classPattern) {
  const openRe = new RegExp(`<div class="${classPattern}"[^>]*>`, 'i');
  const open = openRe.exec(html);
  if (!open) return null;
  const start = open.index + open[0].length;
  let depth = 1;
  let i = start;
  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf('<div', i);
    const nextClose = html.indexOf('</div>', i);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) return html.slice(start, nextClose);
      i = nextClose + 6;
    }
  }
  return null;
}

function extractBody(raw) {
  let body =
    extractBetweenDiv(raw, 'blog-v2-prose[^"]*') ||
    extractBetweenDiv(raw, 'blog-post-content') ||
    null;

  if (!body) {
    const articleMatch = raw.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) {
      body = articleMatch[1]
        .replace(/<header[\s\S]*?<\/header>/gi, ' ')
        .replace(/<aside[\s\S]*?<\/aside>/gi, ' ');
    }
  }
  if (!body) return null;

  // Remove boilerplate blocks (shared footer / CTA — not article substance)
  const removePatterns = [
    /<div class="nt-article-cta"[\s\S]*?<\/div>/gi,
    /<section class="nt-related-links-block"[\s\S]*?<\/section>/gi,
    /<div class="nt-update-log"[\s\S]*?<\/div>/gi,
    /<p class="nt-disclaimer"[\s\S]*?<\/p>/gi,
    /<p style="margin-top:\s*1rem;"><a href="\/blog\/">[\s\S]*?<\/p>/gi,
    /<div class="nt-shop-cta"[\s\S]*?<\/div>/gi,
    /<aside[\s\S]*?<\/aside>/gi,
  ];
  for (const re of removePatterns) {
    body = body.replace(re, ' ');
  }

  return stripHtml(body);
}

function words(text) {
  return text.toLowerCase().match(/[a-z0-9']+/g) || [];
}

function shingles(text, n = 5) {
  const w = words(text);
  const set = new Set();
  for (let i = 0; i <= w.length - n; i++) {
    set.add(w.slice(i, i + n).join(' '));
  }
  return set;
}

function jaccard(a, b) {
  if (!a.size && !b.size) return 1;
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

function paragraphOverlap(a, b) {
  const parasA = a.split(/(?<=[.!?])\s+/).filter((p) => p.length > 60);
  const parasB = new Set(
    b.split(/(?<=[.!?])\s+/).filter((p) => p.length > 60).map((p) => p.toLowerCase().slice(0, 120))
  );
  if (!parasA.length) return 0;
  let dup = 0;
  for (const p of parasA) {
    const key = p.toLowerCase().slice(0, 120);
    if (parasB.has(key)) dup++;
  }
  return dup / parasA.length;
}

function combinedSimilarity(textA, textB) {
  const shA = shingles(textA);
  const shB = shingles(textB);
  const shingleSim = jaccard(shA, shB);
  const paraSim = paragraphOverlap(textA, textB);
  // Weight shingles higher; paragraph dup catches copy-paste
  return shingleSim * 0.65 + paraSim * 0.35;
}

function main() {
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.html') && f !== 'index.html' && !f.includes('.partial.'))
    .sort();

  const bodies = {};
  for (const f of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, f), 'utf8');
    const body = extractBody(raw);
    if (!body || body.length < 200) {
      console.warn(`SKIP (no/short body): ${f}`);
      continue;
    }
    bodies[f.replace(/\.html$/, '')] = { body, wordCount: words(body).length };
  }

  const slugs = Object.keys(bodies);
  const pairs = [];

  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      const a = slugs[i];
      const b = slugs[j];
      const sim = combinedSimilarity(bodies[a].body, bodies[b].body);
      if (sim >= THRESHOLD) {
        pairs.push({ a, b, sim: Math.round(sim * 1000) / 10, wcA: bodies[a].wordCount, wcB: bodies[b].wordCount });
      }
    }
  }

  pairs.sort((x, y) => y.sim - x.sim);

  console.log(`\n=== Duplicate pairs >= ${THRESHOLD * 100}% (${pairs.length} found) ===\n`);
  for (const p of pairs) {
    console.log(`${p.sim}%  ${p.a}  <->  ${p.b}  (${p.wcA}w / ${p.wcB}w)`);
  }

  // Flag likely footer-only similarity among moringa template posts
  const moringaTemplate = pairs.filter(
    (p) =>
      p.sim >= 70 &&
      p.sim < 85 &&
      (p.a.includes('moringa') || p.b.includes('moringa'))
  );
  if (moringaTemplate.length) {
    console.log(`\n--- Possible footer-boilerplate noise (${moringaTemplate.length}) ---`);
    for (const p of moringaTemplate.slice(0, 5)) {
      console.log(`${p.sim}%  ${p.a}  <->  ${p.b}`);
    }
  }

  if (pairs.length > 0) {
    console.error(`\nDuplicate blog body copy detected (>= ${THRESHOLD * 100}%). Fix or differentiate posts before commit.`);
    process.exit(1);
  }
}

main();
