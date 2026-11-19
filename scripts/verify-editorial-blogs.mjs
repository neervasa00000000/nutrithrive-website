import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { normalizeMetaText, metaContent } from './lib/seo-meta.mjs';

const config = JSON.parse(fs.readFileSync('storefront/content/new-blogs.json', 'utf8'));
const plain = html => normalizeMetaText(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' '));
for (const [slug, post] of Object.entries(config)) {
  const html = fs.readFileSync(`site/blog/${slug}.html`, 'utf8');
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1] || '';
  assert.equal(plain(html.match(/<title>(.*?)<\/title>/s)?.[1] || ''), post.title, `${slug}: title`);
  assert.equal(plain(article.match(/<h1>(.*?)<\/h1>/s)?.[1] || ''), post.h1, `${slug}: H1`);
  assert.equal(metaContent(html, 'description'), post.description, `${slug}: description`);
  assert.ok(post.description.length <= 200, `${slug}: oversized description`);
  assert.equal((article.match(/<h1\b/g) || []).length, 1, `${slug}: one H1`);
  assert.equal((article.match(/class="answer-box"/g) || []).length, 1, `${slug}: one answer`);
  assert.doesNotMatch(article, /GSC,|0 clicks|\$44|allow 2 to 3 months of daily use/i, `${slug}: editorial debris`);
  assert.ok(html.includes(`href="https://nutrithrive.com.au/blog/${slug}"`), `${slug}: canonical`);
  assert.doesNotMatch(metaContent(html, 'robots'), /noindex/, `${slug}: indexable`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${slug}: unique IDs`);
  for (const match of article.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `${slug}: broken anchor ${match[1]}`);
  for (const match of html.matchAll(/<img\b[^>]*src="(\/[^"?]+)/g)) assert.ok(fs.existsSync(path.join('site', match[1])), `${slug}: missing image ${match[1]}`);
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  const articles = blocks.filter(b => ['Article', 'BlogPosting'].includes(b['@type']));
  assert.equal(articles.length, 1, `${slug}: article schema`);
  assert.equal(articles[0].datePublished, post.published, `${slug}: publication date`);
  const faqs = blocks.filter(b => b['@type'] === 'FAQPage');
  assert.equal(faqs.length, 1, `${slug}: FAQ schema`);
  assert.equal(faqs[0].mainEntity.length, post.faqs.length, `${slug}: FAQ count`);
  for (const [question, answer] of post.faqs) {
    assert.ok(plain(article).includes(normalizeMetaText(question)), `${slug}: visible question`);
    assert.ok(plain(article).includes(normalizeMetaText(answer)), `${slug}: FAQ matches visible answer`);
  }
}
console.log(`Editorial launch checks passed for ${Object.keys(config).length} blogs.`);
