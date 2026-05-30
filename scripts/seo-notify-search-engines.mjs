#!/usr/bin/env node
/**
 * Notify search engines of sitemap + priority URLs (IndexNow for Bing/Yandex).
 * Google sitemap removal / URL inspection in GSC still requires manual UI or Indexing API credentials.
 *
 * Run: node scripts/seo-notify-search-engines.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOG_PATH = path.join(ROOT, '.cursor/debug-53c37e.log');
const SITE = 'https://nutrithrive.com.au';
const SITEMAP = `${SITE}/sitemap.xml`;

const PRIORITY_URLS = [
  `${SITE}/blog/moringa-honest-truth-science-australia-2026`,
  `${SITE}/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025`,
  `${SITE}/blog/how-much-moringa-powder-per-day-dosage-guide-2026`,
  `${SITE}/`,
  `${SITE}/blog/`,
];

function agentLog(message, data, hypothesisId = 'SEO') {
  const line = JSON.stringify({
    sessionId: '53c37e',
    hypothesisId,
    location: 'scripts/seo-notify-search-engines.mjs',
    message,
    data,
    timestamp: Date.now(),
    runId: 'seo-notify',
  });
  try {
    fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
    fs.appendFileSync(LOG_PATH, `${line}\n`);
  } catch {
    /* ignore */
  }
}

async function ping(url, label) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    const text = (await res.text()).slice(0, 200);
    return { label, ok: res.ok, status: res.status, snippet: text };
  } catch (err) {
    return { label, ok: false, error: err.message };
  }
}

function getOrCreateIndexNowKey() {
  const keyFile = path.join(ROOT, '.indexnow-key');
  if (fs.existsSync(keyFile)) return fs.readFileSync(keyFile, 'utf8').trim();
  const key = crypto.randomBytes(16).toString('hex');
  fs.writeFileSync(keyFile, key);
  return key;
}

async function indexNowSubmit(key, urls) {
  const host = new URL(SITE).host;
  const keyUrl = `${SITE}/${key}.txt`;
  const keyPath = path.join(ROOT, `${key}.txt`);
  fs.writeFileSync(keyPath, key);

  const payload = {
    host,
    key,
    keyLocation: keyUrl,
    urlList: urls,
  };

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ];

  const results = [];
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });
      results.push({ endpoint, status: res.status, ok: res.ok || res.status === 202 });
    } catch (err) {
      results.push({ endpoint, ok: false, error: err.message });
    }
  }
  return { key, keyPath, keyUrl, results };
}

async function main() {
  const pings = await Promise.all([
    ping(`https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`, 'google-sitemap-ping'),
    ping(`https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`, 'bing-sitemap-ping'),
  ]);

  const key = getOrCreateIndexNowKey();
  const indexNow = await indexNowSubmit(key, PRIORITY_URLS);

  const summary = { pings, indexNow, priorityUrls: PRIORITY_URLS.length, sitemap: SITEMAP };
  agentLog('search engine notifications sent', summary);
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  agentLog('search engine notify failed', { error: err.message });
  console.error(err);
  process.exit(1);
});
