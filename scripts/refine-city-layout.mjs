#!/usr/bin/env node
/**
 * Tighten city page structure: wrap hero, merge guide sections, add mobile bar.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'site');

const CITY_SLUGS = ['moringa-sydney', 'moringa-brisbane', 'moringa-perth', 'moringa-adelaide'];

const MOBILE_BAR = `<div class="city-mobile-bar" role="complementary" aria-label="Quick shop">
  <div class="city-mobile-bar__price">From $11 / 100g<span>Free shipping over $49</span></div>
  <a href="/products/moringa-powder/" class="city-cta-btn">Shop now</a>
</div>`;

function refine(html) {
  if (!html.includes('class="city-hero"')) {
    html = html.replace(
      /<header class="city-hero-header">/,
      '<section class="city-hero">\n<header class="city-hero-header">'
    );
    html = html.replace(
      /(<\/div>\s*<\/div>\s*)(\n<section class="city-section">)/,
      '$1</section>\n\n<div class="city-content">$2'
    );
    if (!html.includes('class="city-content"')) {
      html = html.replace(
        /(<\/div>\s*\n)(<section class="city-section">)/,
        '$1</section>\n\n<div class="city-content">\n$2'
      );
    }
  }

  if (html.includes('class="city-content"') && !html.includes('</div>\n\n<div class="city-bottom-cta"')) {
    html = html.replace(
      /\n\n<div class="city-bottom-cta">/,
      '\n</div>\n\n<div class="city-bottom-cta">'
    );
  }

  const guideLinksMatch = html.match(
    /<section class="city-section city-guide-links"[\s\S]*?<\/section>\s*/
  );
  if (guideLinksMatch) {
    const links = [...guideLinksMatch[0].matchAll(/<li><a href="([^"]*)">([^<]*)<\/a><\/li>/g)];
    if (links.length) {
      const items = links
        .map((m) => `<li><a href="${m[1]}">${m[2]}</a></li>`)
        .join('\n    ');
      if (html.includes('class="city-guides-list"')) {
        html = html.replace(
          /(<ul class="city-guides-list">[\s\S]*?)(<\/ul>)/,
          (full, open, close) => {
            let merged = open;
            for (const m of links) {
              const href = m[1];
              if (!merged.includes(href)) {
                merged += `\n    <li><a href="${href}">${m[2]}</a></li>`;
              }
            }
            return merged + close;
          }
        );
      }
    }
    html = html.replace(guideLinksMatch[0], '');
  }

  if (!html.includes('city-mobile-bar')) {
    html = html.replace('</body>', `${MOBILE_BAR}\n</body>`);
  }

  html = html.replace(/\n{3,}/g, '\n\n');

  return html;
}

for (const slug of CITY_SLUGS) {
  const fp = path.join(ROOT, slug, 'index.html');
  let html = fs.readFileSync(fp, 'utf8');
  html = refine(html);
  fs.writeFileSync(fp, html);
  console.log('Refined:', slug);
}

const melb = path.join(SITE, 'pages/homepage/melbourne.html');
if (fs.existsSync(melb)) {
  let html = fs.readFileSync(melb, 'utf8');
  if (!html.includes('city-mobile-bar')) {
    html = html.replace('</body>', `${MOBILE_BAR}\n</body>`);
  }
  fs.writeFileSync(melb, html);
  console.log('Refined: melbourne');
}

console.log('Done.');
