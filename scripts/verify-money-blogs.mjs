import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const config = JSON.parse(fs.readFileSync('storefront/content/money-blogs.json', 'utf8'));
const plain = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const attr = (html, name) => html.match(new RegExp(`<meta name="${name}" content="([^"]*)"`))?.[1];
const keywordTerms = [
  ['how-long', ['moringa', 'powder', 'last']], ['is-moringa-safe', ['moringa', 'children']],
  ['rosabella', ['rosabella', 'moringa']], ['how-to-choose', ['moringa', 'powder', 'coles']],
  ['moringa-capsules', ['moringa', 'capsules', 'powder']], ['what-does', ['moringa', 'powder', 'taste']],
  ['moringa-vs-ashwagandha', ['moringa', 'ashwagandha']],
];
const results = [];
for (const [slug, edit] of Object.entries(config)) {
  const html = fs.readFileSync(`site/blog/${slug}.html`, 'utf8');
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1];
  assert.ok(article, `${slug}: missing article`);
  const title = plain(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
  const h1 = plain(article.match(/<h1>([\s\S]*?)<\/h1>/)?.[1] || '');
  const text = plain(article);
  assert.equal(title, edit.title, `${slug}: title`);
  assert.equal(h1, edit.h1, `${slug}: H1`);
  assert.equal(plain(attr(html, 'description') || ''), edit.description, `${slug}: description`);
  assert.equal((article.match(/<h1\b/g) || []).length, 1, `${slug}: duplicate H1`);
  assert.equal((text.match(/Short answer:/gi) || []).length, 1, `${slug}: short answer count`);
  const headings = [...article.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map(h=>plain(h[1])).join(" ");
  assert.doesNotMatch(headings, /Quick answer|The short answer on kids/i, `${slug}: duplicate answer heading`);
  assert.ok((text.match(/\$11/g) || []).length <= 10, `${slug}: too many $11 mentions`);
  assert.ok((text.match(/Try a 100g pouch, \$11/gi) || []).length <= 1, `${slug}: repeated trial CTA`);
  assert.doesNotMatch(html, /\$44|400g[^.\n]{0,65}\bbundle\b|\bbundle\b[^.\n]{0,65}400g/i, `${slug}: stale price or terminology`);
  assert.match(article, /href="\/products\/moringa-powder\/"[^>]*>(?:moringa powder \$11|Shop moringa powder)<\/a>/, `${slug}: body product link`);
  assert.match(article, /href="\/blog\/moringa-brands-comparison-australia-2026"/, `${slug}: brands link`);
  const terms = keywordTerms.find(([prefix]) => slug.startsWith(prefix))[1];
  for (const field of [title, h1, edit.description, text.split(' ').slice(0,100).join(' ')]) {
    for (const term of terms) assert.ok(field.toLowerCase().includes(term), `${slug}: keyword ${term} missing`);
  }
  for (const table of article.matchAll(/<table\b[^>]*>[\s\S]*?<\/table>/g)) {
    assert.doesNotMatch(plain(table[0]), /Price per 100g of leaf|Price per 100g/, `${slug}: duplicated price comparison table`);
  }
  for (const image of html.matchAll(/<img\b[^>]*src="([^"?]+)[^>]*>/g)) {
    if (image[1].startsWith('/')) assert.ok(fs.existsSync(path.join('site',image[1])), `${slug}: broken image ${image[1]}`);
  }
  for (const block of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) JSON.parse(block[1]);
  if (slug.startsWith('how-long')) {
    for (const id of ['how-long','signs-expired','fridge-or-cupboard','store-au','does-moringa-powder-expire']) assert.ok(html.includes(`id="${id}"`), `lost anchor ${id}`);
    assert.equal((text.match(/Fresh batch, NMI lab-tested, try 100g for \$11/gi) || []).length,1);
  }
  if (slug.startsWith('is-moringa-safe')) {
    const tables=[...article.matchAll(/<table\b[^>]*>[\s\S]*?<\/table>/g)].filter(t=>plain(t[0]).includes('Age group'));
    assert.equal(tables.length,1,'kids: one dosage table');
    assert.equal(plain(tables[0][0]),edit.dosageTableText,'kids: dosage amounts unchanged');
    assert.ok(article.indexOf('nt-disclaimer') < article.indexOf('Short answer:'),'kids: GP disclaimer at top');
    assert.match(article,/money-blog-cta[^]*?talk to your GP/);
    assert.doesNotMatch(article,/nt-article-cta|nt-blog-product-card/,'kids: redundant sales blocks removed');
  }
  if (slug.startsWith('what-does')) {
    assert.equal((article.match(/href="\/products\/moringa-powder\/"/g)||[]).length,1,'taste: one product link');
    assert.equal((article.match(/href="\/blog\/moringa-capsules-vs-powder-which-is-better-2026"/g)||[]).length,1,'taste: one capsules link');
    assert.ok(text.split(' ').length <= edit.originalWordCount,'taste: must not get longer');
  }
  results.push({slug,mentions11:(text.match(/\$11/g)||[]).length,words:text.split(' ').length});
}
const baselineArg = process.argv.indexOf('--baseline');
if (baselineArg !== -1) {
  const baseline=JSON.parse(fs.readFileSync(process.argv[baselineArg+1],'utf8'));
  const allowed = new Set(Object.keys(config).map(slug=>`site/blog/${slug}.html`));
  for (const [file,hash] of Object.entries(baseline)) {
    if (!allowed.has(file)) assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),hash,`protected file changed: ${file}`);
  }
}
console.log(JSON.stringify(results,null,2));
console.log('Seven-blog checks passed: metadata, one answer, links, price wording, dosage preservation, anchors and assets.');
