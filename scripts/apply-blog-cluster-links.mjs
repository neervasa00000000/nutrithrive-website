#!/usr/bin/env node
/**
 * Phase 2: ensure spoke posts link up to their pillar, and pillars list spokes.
 * Does not delete or redirect posts — linking only.
 *
 * Usage: node scripts/apply-blog-cluster-links.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(__dirname, '..');
const clusters = JSON.parse(
  fs.readFileSync(path.join(REPO, 'seo/blog-clusters.json'), 'utf8')
);

const titleCache = new Map();

function blogPath(slug) {
  return path.join(REPO, 'blog', `${slug}.html`);
}

function extractTitle(html, slug) {
  if (titleCache.has(slug)) return titleCache.get(slug);
  const m =
    html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
    html.match(/<title>([^|<]+)/i);
  let t = m ? m[1].replace(/<[^>]+>/g, '').trim() : slug;
  t = t
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'");
  t = t.replace(/\s+/g, ' ').slice(0, 90);
  titleCache.set(slug, t);
  return t;
}

function ensurePillarLink(html, pillarSlug, pillarTitle) {
  const pillarHref = `/blog/${pillarSlug}`;
  if (html.includes('Cluster hub:')) {
    return { html, changed: false, reason: 'already-hub-label' };
  }

  const hubLi = ` <li><strong>Cluster hub:</strong> <a href="${pillarHref}">${escapeHtml(pillarTitle)}</a></li>\n`;

  if (/<section class="nt-related-links-block"[\s\S]*?<ul>/i.test(html)) {
    const next = html.replace(
      /(<section class="nt-related-links-block"[\s\S]*?<ul>\s*)/i,
      `$1${hubLi}`
    );
    return { html: next, changed: next !== html, reason: 'related-ul' };
  }

  // Inline "Related guides" without section class
  if (/<h2[^>]*>Related guides<\/h2>\s*<ul>/i.test(html)) {
    const next = html.replace(
      /(<h2[^>]*>Related guides<\/h2>\s*<ul>\s*)/i,
      `$1${hubLi}`
    );
    return { html: next, changed: next !== html, reason: 'h2-ul' };
  }

  // Inject a small related block before footer
  const block = `
<section class="nt-related-links-block" style="margin:2rem 0;padding:1rem 1.25rem;border:1px solid #e6efe9;border-radius:12px;background:#f9fcfa;">
 <h2 style="font-size:1.2rem;margin:0 0 0.75rem;color:#0f6b4d;">Related guides</h2>
 <ul>
${hubLi} <li><a href="/blog/">All guides</a></li>
 </ul>
</section>
`;
  if (html.includes('id="nt-footer"')) {
    const next = html.replace('<div id="nt-footer"></div>', `${block}<div id="nt-footer"></div>`);
    return { html: next, changed: true, reason: 'injected-footer' };
  }
  if (html.includes('</article>')) {
    const next = html.replace('</article>', `${block}</article>`);
    return { html: next, changed: true, reason: 'injected-article' };
  }
  return { html, changed: false, reason: 'no-slot' };
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHubSpokeList(pillar, spokeSlugs) {
  const items = spokeSlugs
    .filter((s) => fs.existsSync(blogPath(s)))
    .map((s) => {
      const html = fs.readFileSync(blogPath(s), 'utf8');
      const title = extractTitle(html, s);
      return ` <li><a href="/blog/${s}">${escapeHtml(title)}</a></li>`;
    });
  if (pillar.product) {
    items.push(
      ` <li><a href="${pillar.product}">Shop related product</a></li>`
    );
  }
  return items.join('\n');
}

function upsertPillarHubSection(html, pillar, spokeSlugs) {
  const list = buildHubSpokeList(pillar, spokeSlugs);
  const section = `
<section class="nt-cluster-hub" id="cluster-guides" style="margin:2.5rem 0;padding:1.25rem 1.5rem;border:1px solid #e6efe9;border-radius:12px;background:#f9fcfa;">
 <h2 style="font-size:1.35rem;margin:0 0 0.5rem;color:#0f6b4d;">Guides in this cluster</h2>
 <p style="margin:0 0 1rem;color:#3f4943;font-size:0.95rem;line-height:1.6;">These articles stay live on their own URLs. This page is the hub — start here, then dig into any topic below.</p>
 <ul style="margin:0;padding-left:1.25rem;line-height:1.7;">
${list}
 </ul>
</section>
`;

  if (html.includes('id="cluster-guides"') || html.includes('class="nt-cluster-hub"')) {
    const next = html.replace(
      /<section class="nt-cluster-hub"[\s\S]*?<\/section>/i,
      section.trim()
    );
    return { html: next, changed: next !== html };
  }

  // Prefer before existing related links
  if (/<section class="nt-related-links-block"/i.test(html)) {
    const next = html.replace(
      /<section class="nt-related-links-block"/i,
      `${section}<section class="nt-related-links-block"`
    );
    return { html: next, changed: true };
  }
  if (/<h2[^>]*>Related guides<\/h2>/i.test(html)) {
    const next = html.replace(
      /<h2[^>]*>Related guides<\/h2>/i,
      `${section}<h2>Related guides</h2>`
    );
    return { html: next, changed: true };
  }
  if (html.includes('id="nt-footer"')) {
    return {
      html: html.replace('<div id="nt-footer"></div>', `${section}<div id="nt-footer"></div>`),
      changed: true,
    };
  }
  return { html, changed: false };
}

let spokeUpdated = 0;
let spokeSkipped = 0;
let pillarUpdated = 0;
const missing = [];

for (const pillar of clusters.pillars) {
  const pillarFile = blogPath(pillar.slug);
  if (!fs.existsSync(pillarFile)) {
    missing.push(`pillar:${pillar.slug}`);
    continue;
  }

  let pillarHtml = fs.readFileSync(pillarFile, 'utf8');
  const pillarTitle = extractTitle(pillarHtml, pillar.slug);

  // Update spokes → pillar
  for (const spoke of pillar.spokes) {
    const f = blogPath(spoke);
    if (!fs.existsSync(f)) {
      missing.push(`spoke:${spoke}`);
      continue;
    }
    let html = fs.readFileSync(f, 'utf8');
    const res = ensurePillarLink(html, pillar.slug, pillarTitle);
    if (res.changed) {
      fs.writeFileSync(f, res.html);
      spokeUpdated++;
    } else {
      spokeSkipped++;
    }
  }

  // Update pillar hub list
  const hubRes = upsertPillarHubSection(pillarHtml, pillar, pillar.spokes);
  if (hubRes.changed) {
    fs.writeFileSync(pillarFile, hubRes.html);
    pillarUpdated++;
  }
}

console.log(
  JSON.stringify(
    { spokeUpdated, spokeSkipped, pillarUpdated, missing },
    null,
    2
  )
);
