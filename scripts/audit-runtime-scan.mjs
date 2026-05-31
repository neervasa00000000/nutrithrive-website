#!/usr/bin/env node
/**
 * Runtime site audit — writes NDJSON to debug log for CI/local scans.
 * Run: node scripts/audit-runtime-scan.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOG = path.join(ROOT, '.cursor/debug-53c37e.log');
const SESSION = '53c37e';
const BASE = 'https://nutrithrive.com.au';

function log(hypothesisId, message, data = {}) {
  const line = JSON.stringify({
    sessionId: SESSION,
    hypothesisId,
    location: 'scripts/audit-runtime-scan.mjs',
    message,
    data,
    timestamp: Date.now(),
    runId: process.env.AUDIT_RUN_ID || 'scan',
  });
  fs.appendFileSync(LOG, line + '\n');
}

function walkHtml(dir, out = [], skip = new Set(['node_modules', '.git', '.netlify-publish', 'scripts/templates', 'audit', '.firecrawl'])) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (skip.has(ent.name) || ent.name.startsWith('.')) continue;
      walkHtml(full, out, skip);
    } else if (ent.name.endsWith('.html')) out.push(full);
  }
  return out;
}

async function head(url) {
  try {
    const r = await fetch(url, { redirect: 'manual' });
    return { url, status: r.status, location: r.headers.get('location') || '' };
  } catch (e) {
    return { url, status: 0, error: e.message };
  }
}

async function main() {
  fs.mkdirSync(path.dirname(LOG), { recursive: true });

  // H-A: malformed internal links in HTML
  const badPatterns = [];
  for (const fp of walkHtml(ROOT)) {
    const rel = path.relative(ROOT, fp);
    const html = fs.readFileSync(fp, 'utf8');
    if (html.includes('/https://')) badPatterns.push({ file: rel, issue: 'malformed-/https://' });
    if (html.includes('${blog.url}')) badPatterns.push({ file: rel, issue: 'unresolved-template' });
    if (/src="\.\.\/scripts\//.test(html) || /href="\.\.\/scripts\//.test(html)) {
      badPatterns.push({ file: rel, issue: 'relative-scripts-path' });
    }
  }
  log('A', 'malformed patterns in HTML', { count: badPatterns.length, samples: badPatterns.slice(0, 20) });

  // H-B: live sitemap URLs
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const liveBad = [];
  for (const u of urls) {
    const h = await head(u);
    if (h.status >= 400 || (h.status >= 300 && h.status < 400 && !h.location)) {
      liveBad.push(h);
    }
  }
  log('B', 'live sitemap HTTP check', { total: urls.length, bad: liveBad.length, samples: liveBad.slice(0, 10) });

  // H-C: dev paths should 404 on live
  const devPaths = ['/tools/check-paypal-buttons.html', '/scripts/templates/', '/.firecrawl/audit', '/pages/homepage/'];
  const devChecks = await Promise.all(devPaths.map(async (p) => ({ path: p, ...(await head(BASE + p)) })));
  log('C', 'dev paths on production', { checks: devChecks });

  // H-D: relative script paths on key GA pages
  const keyPages = ['/', '/products/', '/blog/is-moringa-banned-australia-truth-2026', '/contact'];
  const assetChecks = [];
  for (const p of keyPages) {
    const r = await fetch(BASE + p);
    const html = await r.text();
    const relScripts = (html.match(/src="\.\.\/[^"]+\.js"/g) || []).length;
    const absScripts = (html.match(/src="\/[^"]+\.js"/g) || []).length;
    assetChecks.push({ page: p, status: r.status, relScripts, absScripts });
  }
  log('D', 'script path mix on top pages', { pages: assetChecks });

  // H-E: build + sitemap CI
  const verify = spawnSync('node', ['scripts/verify-sitemap-locs.mjs'], { cwd: ROOT, encoding: 'utf8' });
  log('E', 'sitemap verify', { ok: verify.status === 0, code: verify.status, stderr: (verify.stderr || '').slice(0, 200) });

  console.log('Audit complete. Issues:', badPatterns.length, 'pattern hits;', liveBad.length, 'live URL failures');
  console.log('Log:', LOG);
}

main().catch((e) => {
  log('ERR', 'audit crashed', { error: e.message });
  console.error(e);
  process.exit(1);
});
