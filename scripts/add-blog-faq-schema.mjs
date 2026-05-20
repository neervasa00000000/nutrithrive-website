#!/usr/bin/env node
/**
 * Adds FAQPage JSON-LD to blog posts that have FAQ content but no FAQPage schema.
 * Run: node scripts/add-blog-faq-schema.mjs
 */
import fs from 'fs';
import path from 'path';

const REPO = path.resolve(import.meta.dirname, '..');
const BLOG = path.join(REPO, 'blog');

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFromFaqItems(html) {
  const faqs = [];
  const blocks = html.split(/<div class="faq-item"/i);
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const qMatch = block.match(
      /<button class="faq-question"[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>\s*<span class="faq-icon"/i
    );
    const aMatch = block.match(/<div class="faq-answer"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);
    if (!qMatch) continue;
    const q = stripHtml(qMatch[1]);
    const a = aMatch ? stripHtml(aMatch[1]) : '';
    if (q && a && q.length < 300 && a.length < 2000) faqs.push([q, a]);
  }
  return faqs;
}

function extractFromH3Faq(html) {
  const faqs = [];
  const faqSection =
    html.match(/<h2[^>]*id="faq"[^>]*>[\s\S]*$/i)?.[0] ||
    html.match(/<h2[^>]*>[\s\S]*?FAQ[\s\S]*$/i)?.[0];
  if (!faqSection) return faqs;
  const re = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = re.exec(faqSection)) !== null) {
    const q = stripHtml(m[1]);
    const a = stripHtml(m[2]);
    if (q && a) faqs.push([q, a]);
  }
  return faqs;
}

function buildFaqJson(faqs) {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
    null,
    2
  );
}

const files = fs.readdirSync(BLOG).filter((f) => f.endsWith('.html') && f !== 'index.html');

let added = 0;
let skipped = 0;

for (const file of files) {
  const fp = path.join(BLOG, file);
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('"@type": "FAQPage"') || html.includes('"@type":"FAQPage"')) {
    skipped++;
    continue;
  }

  let faqs = extractFromFaqItems(html);
  if (faqs.length < 2) faqs = extractFromH3Faq(html);
  if (faqs.length < 2) {
    skipped++;
    continue;
  }

  const script = `<script type="application/ld+json">\n${buildFaqJson(faqs)}\n</script>\n`;
  if (!html.includes('</head>')) continue;
  html = html.replace('</head>', `${script}</head>`);
  fs.writeFileSync(fp, html);
  console.log(`FAQ schema: ${file} (${faqs.length} Q&As)`);
  added++;
}

console.log(`Done — added ${added}, skipped ${skipped}.`);
