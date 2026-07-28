#!/usr/bin/env node
/**
 * Lighthouse mobile spot-check for blog posts.
 * Usage: node scripts/blog-lighthouse-spotcheck.mjs [baseUrl]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const baseUrl = process.argv[2] || 'http://127.0.0.1:8765';
const samples = [
  'moringa-for-anxiety-stress-evidence-2026',
  'how-to-choose-moringa-powder-australia-2026',
  'darjeeling-tea-health-benefits-research-2026',
  'best-anti-inflammatory-foods-australia-daily-guide-2026',
  'moringa-for-sleep-quality-insomnia-2026',
  'curry-leaves-vs-curry-powder-difference-explained-2026',
  'ag1-alternative-australia-moringa-comparison-2026',
  'how-to-brew-darjeeling-tea-perfectly-2026',
  'moringa-brands-comparison-australia-2026',
  'fibre-deficiency-australia-bowel-cancer-risk-2026',
  'moringa-for-weight-loss-evidence-2026',
  'stop-eating-ultra-processed-food-30-days-what-happens-2026',
  'moringa-vs-spirulina-vs-matcha-comparison-australia',
  'moringa-for-breastfeeding-milk-supply-2026',
];

const outDir = '/tmp/lh-spotcheck';
fs.mkdirSync(outDir, { recursive: true });

const results = [];

for (const slug of samples) {
  const url = `${baseUrl}/blog/${slug}.html`;
  const out = path.join(outDir, `${slug}.json`);
  process.stderr.write(`Testing ${slug}...\n`);
  try {
    execSync(
      `npx --yes lighthouse "${url}" --preset=perf --form-factor=mobile --screenEmulation.mobile=true --throttling-method=simulate --output=json --output-path="${out}" --quiet --chrome-flags="--headless --no-sandbox --disable-gpu"`,
      { stdio: 'pipe' }
    );
    const d = JSON.parse(fs.readFileSync(out, 'utf8'));
    const lcp = d.audits['largest-contentful-paint'].numericValue / 1000;
    const cls = d.audits['cumulative-layout-shift'].numericValue;
    const perf = d.categories.performance.score * 100;
    results.push({ slug, perf, lcp, cls });
  } catch (err) {
    results.push({ slug, error: err.message?.slice(0, 80) });
  }
}

console.log('\nBlog mobile Lighthouse spot-check\n');
console.log('Slug | Perf | LCP | CLS | Flags');
console.log('-----|------|-----|-----|------');
for (const r of results) {
  if (r.error) {
    console.log(`${r.slug} | ERROR | | | ${r.error}`);
    continue;
  }
  const flags = [];
  if (r.lcp > 2.5) flags.push('LCP');
  if (r.cls > 0.1) flags.push('CLS');
  console.log(
    `${r.slug} | ${r.perf.toFixed(0)} | ${r.lcp.toFixed(2)}s | ${r.cls.toFixed(3)} | ${flags.join(', ') || 'OK'}`
  );
}

const lcpFails = results.filter((r) => r.lcp > 2.5);
const clsFails = results.filter((r) => r.cls > 0.1);
console.log(`\nSummary: ${results.length} posts checked, ${lcpFails.length} LCP fails, ${clsFails.length} CLS fails`);
