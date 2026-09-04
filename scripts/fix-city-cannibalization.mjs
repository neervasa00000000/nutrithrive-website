#!/usr/bin/env node
/**
 * Part 1: reduce multi-city keyword cannibalization — one contextual link per mention.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'site');

const REPLACEMENTS = [
  {
    file: 'pages/homepage/melbourne.html',
    from: 'Lab-tested moringa powder shipped Australia-wide from Melbourne. Same-day dispatch before 2pm. Free shipping over $49. Sydney, Brisbane, Perth &amp; all states.',
    to: 'Lab-tested moringa powder from our Truganina warehouse. Same-day dispatch before 2pm on business days. Free shipping over $49 Australia-wide.',
  },
  {
    file: 'index.html',
    from: '<p class="hero-desc hero-desc--local">Local guides: <a href="/melbourne">Moringa in Melbourne</a>, <a href="/moringa-sydney/">Sydney</a>, <a href="/moringa-brisbane/">Brisbane</a>, <a href="/moringa-perth/">Perth</a>, <a href="/moringa-adelaide/">Adelaide</a>.</p>',
    to: '<p class="hero-desc hero-desc--local">Ships Australia-wide from Melbourne. <a href="/melbourne/">Melbourne delivery guide</a> · <a href="/shipping">Shipping &amp; delivery times</a></p>',
  },
  {
    file: 'blog/how-to-choose-moringa-powder-australia-2026.html',
    from: ' <li>Fast delivery: <a href="/melbourne/">Melbourne</a>, <a href="/moringa-sydney/">Sydney</a>, <a href="/moringa-brisbane/">Brisbane</a>, <a href="/moringa-perth/">Perth</a>, <a href="/moringa-adelaide/">Adelaide</a></li>',
    to: ' <li>Fast delivery: <a href="/melbourne/">Melbourne metro guide</a> (same-day dispatch from Truganina) · <a href="/shipping">Australia-wide shipping times</a></li>',
  },
  {
    file: 'blog/moringa-powder-victoria-seniors-joint-health.html',
    from: 'Our products are available for fast delivery to Melbourne, Sydney, and across Australia.',
    to: 'Our products ship Australia-wide from Truganina, Melbourne. See our <a href="/melbourne/" style="color:#0f6b4d;font-weight:600;">Melbourne delivery guide</a> for local dispatch times.',
  },
  {
    file: 'blog/moringa-powder-victoria-seniors-joint-health.html',
    from: 'Get the freshest <a href="/products/moringa-powder/" style="color:#0f6b4d;font-weight:600;">Moringa in Victoria, Melbourne, Sydney, and across Australia</a>, delivered from our door in Truganina, Melbourne to yours. Fast shipping available to all major cities including Melbourne CBD, Sydney, and regional areas throughout Australia.',
    to: 'Get the freshest <a href="/products/moringa-powder/" style="color:#0f6b4d;font-weight:600;">moringa powder in Victoria</a>, packed in Truganina and shipped Australia-wide. See <a href="/melbourne/" style="color:#0f6b4d;font-weight:600;">Melbourne delivery times</a> or our <a href="/shipping" style="color:#0f6b4d;font-weight:600;">shipping page</a> for other states.',
  },
  {
    file: 'buy-moringa-powder-australia/index.html',
    from: '15 Europe Street, Truganina. Sydney and Brisbane usually 2–4 days; Perth 3–5.',
    to: '15 Europe Street, Truganina. Metro delivery is usually a few business days — see our <a href="/shipping">shipping page</a> or your <a href="/melbourne/">local delivery guide</a>.',
  },
  {
    file: 'pages/shipping/shipping-returns.html',
    from: 'Typical delivery: 3–4 days to metro/suburban areas in Melbourne, Sydney, Brisbane, and major cities; up to 10 days for rural areas across Australia.',
    to: 'Typical delivery: 3–4 days to most metro and suburban areas; up to 10 days for some rural locations across Australia. City-specific estimates: <a href="/melbourne/">Melbourne</a>, <a href="/moringa-sydney/">Sydney</a>, <a href="/moringa-brisbane/">Brisbane</a>, <a href="/moringa-perth/">Perth</a>, <a href="/moringa-adelaide/">Adelaide</a>.',
    note: 'shipping page keeps city links as hub to dedicated pages — intentional',
  },
];

// shipping page - actually plan says DON'T list all cities. Revert that replacement.
const SKIP_SHIPPING = true;

let changed = 0;
for (const { file, from, to, note } of REPLACEMENTS) {
  if (SKIP_SHIPPING && file.includes('shipping')) continue;
  const fp = path.join(ROOT, file);
  if (!fs.existsSync(fp)) {
    console.warn('Skip missing:', file);
    continue;
  }
  let html = fs.readFileSync(fp, 'utf8');
  if (!html.includes(from)) {
    console.warn('Pattern not found:', file);
    continue;
  }
  html = html.replace(from, to);
  fs.writeFileSync(fp, html);
  changed++;
  console.log('Updated:', file, note || '');
}

// shipping: replace multi-city with general + link to melbourne hub
const shipFile = path.join(SITE, 'pages/shipping/shipping-returns.html');
if (fs.existsSync(shipFile)) {
  let html = fs.readFileSync(shipFile, 'utf8');
  const old =
    'Typical delivery: 3–4 days to metro/suburban areas in Melbourne, Sydney, Brisbane, and major cities; up to 10 days for rural areas across Australia.';
  const neu =
    'Typical delivery: 3–4 days to most metro and suburban areas; up to 10 days for some rural locations. See city delivery guides: <a href="/melbourne/">Melbourne</a>, <a href="/moringa-sydney/">Sydney</a>, <a href="/moringa-brisbane/">Brisbane</a>, <a href="/moringa-perth/">Perth</a>, <a href="/moringa-adelaide/">Adelaide</a>.';
  if (html.includes(old)) {
    html = html.replaceAll(old, neu);
    fs.writeFileSync(shipFile, html);
    changed++;
    console.log('Updated: pages/shipping/shipping-returns.html (FAQ hub links)');
  }
  const old2 =
    'standard delivery is usually about three to four days to metro and suburban areas such as Melbourne, Sydney, and Brisbane, and can take up to around ten days for some rural locations.';
  const neu2 =
    'standard delivery is usually about three to four days to most metro and suburban areas, and can take up to around ten days for some rural locations. Check your <a href="/melbourne/">city delivery guide</a> for a closer estimate.';
  if (html.includes(old2)) {
    html = html.replaceAll(old2, neu2);
    fs.writeFileSync(shipFile, html);
    console.log('Updated: shipping second FAQ');
  }
}

// nutrithrive-dried-curry-leaves — online first, one city link max in FAQ
const curryBlog = path.join(SITE, 'blog/nutrithrive-dried-curry-leaves-tradition-health.html');
if (fs.existsSync(curryBlog)) {
  let html = fs.readFileSync(curryBlog, 'utf8');
  const old =
    'In Melbourne, Sydney, and Perth, fresh curry leaves can sometimes be found at major supermarkets';
  const neu =
    'In some Australian cities, fresh curry leaves can sometimes be found at major supermarkets';
  if (html.includes(old)) {
    html = html.replace(old, neu);
    fs.writeFileSync(curryBlog, html);
    changed++;
    console.log('Updated: nutrithrive-dried-curry-leaves');
  }
}

// grow-moringa footer
const grow = path.join(SITE, 'blog/grow-moringa-tree-australia.html');
if (fs.existsSync(grow)) {
  let html = fs.readFileSync(grow, 'utf8');
  const old =
    'Fast Shipping Australia-wide -Melbourne, Sydney, Brisbane + all states.<br>Worldwide Shipping Available 🌍';
  const neu =
    'Fast shipping Australia-wide from Melbourne.<br>Worldwide shipping available 🌍';
  if (html.includes(old)) {
    html = html.replace(old, neu);
    fs.writeFileSync(grow, html);
    changed++;
    console.log('Updated: grow-moringa-tree-australia');
  }
}

// shipping FAQ visible text — one hub link, not five cities in one sentence
if (fs.existsSync(shipFile)) {
  let html = fs.readFileSync(shipFile, 'utf8');
  const oldFaq =
    'Typical delivery: 3–4 days to most metro and suburban areas; up to 10 days for some rural locations. See city delivery guides: <a href="/melbourne/">Melbourne</a>, <a href="/moringa-sydney/">Sydney</a>, <a href="/moringa-brisbane/">Brisbane</a>, <a href="/moringa-perth/">Perth</a>, <a href="/moringa-adelaide/">Adelaide</a>.';
  const neuFaq =
    'Typical delivery: 3–4 days to most metro and suburban areas; up to 10 days for some rural locations. See your <a href="/melbourne/">city delivery guide</a> for postcode-level estimates.';
  if (html.includes(oldFaq)) {
    html = html.replace(oldFaq, neuFaq);
    fs.writeFileSync(shipFile, html);
    changed++;
    console.log('Updated: shipping FAQ visible (single hub link)');
  }
  html = fs.readFileSync(shipFile, 'utf8');
  const oldLd =
    'Typical delivery: 3-4 days to metro/suburban areas in Melbourne, Sydney, Brisbane, and major cities; up to 10 days for rural areas across Australia.';
  const neuLd =
    'Typical delivery: 3-4 days to most metro and suburban areas; up to 10 days for rural areas across Australia.';
  if (html.includes(oldLd)) {
    html = html.replace(oldLd, neuLd);
    fs.writeFileSync(shipFile, html);
    changed++;
    console.log('Updated: shipping FAQ JSON-LD');
  }
}

// FAQ page + site-data
const faqReplacements = [
  {
    file: 'pages/faq/faq.html',
    pairs: [
      [
        'How fast is shipping from Melbourne to Sydney/Brisbane?',
        'How fast is Australia-wide shipping from Melbourne?',
      ],
      [
        'Typical delivery: 3–4 days to metro/suburban areas like Sydney and Brisbane; up to 10 days for rural areas. Fast shipping from our Melbourne warehouse.',
        'Typical delivery: 3–4 days to most metro and suburban areas; up to 10 days for rural areas. See our <a href="/shipping">shipping page</a> or your <a href="/melbourne/">city delivery guide</a>.',
      ],
    ],
  },
  {
    file: 'shared/site-data.js',
    pairs: [
      [
        "How fast is shipping from Melbourne to Sydney/Brisbane?",
        'How fast is Australia-wide shipping from Melbourne?',
      ],
      [
        'Dispatch within 2 business days (no Sunday dispatch). Metro delivery typically 3–4 days; rural up to 10 days from our Truganina warehouse.',
        'Dispatch within 2 business days (no Sunday dispatch). Metro delivery typically 3–4 days; rural up to 10 days. See /shipping or /melbourne/ for estimates.',
      ],
    ],
  },
];

for (const { file, pairs } of faqReplacements) {
  const fp = path.join(ROOT, file);
  if (!fs.existsSync(fp)) continue;
  let html = fs.readFileSync(fp, 'utf8');
  let touched = false;
  for (const [from, to] of pairs) {
    if (html.includes(from)) {
      html = html.replaceAll(from, to);
      touched = true;
    }
  }
  if (touched) {
    fs.writeFileSync(fp, html);
    changed++;
    console.log('Updated:', file);
  }
}

// grow-moringa hub card text
if (fs.existsSync(grow)) {
  let html = fs.readFileSync(grow, 'utf8');
  const old =
    'Month-by-month tasks for every Australian state. Melbourne, Sydney, Brisbane, Perth &amp; Darwin. Perfect if you searched for a moringa growing calendar.';
  const neu =
    'Month-by-month tasks for every Australian climate zone. Perfect if you searched for a moringa growing calendar.';
  if (html.includes(old)) {
    html = html.replace(old, neu);
    fs.writeFileSync(grow, html);
    changed++;
    console.log('Updated: grow-moringa hub card');
  }
}

// curry leaves FAQ body + JSON-LD
if (fs.existsSync(curryBlog)) {
  let html = fs.readFileSync(curryBlog, 'utf8');
  const old =
    'We also stock at select Melbourne, Sydney, and Perth health-food stores.';
  const neu = 'We also stock at select health-food stores in some Australian cities.';
  if (html.includes(old)) {
    html = html.replaceAll(old, neu);
    fs.writeFileSync(curryBlog, html);
    changed++;
    console.log('Updated: curry leaves FAQ (body + schema)');
  }
}

// blog hub grow card
const blogIndex = path.join(SITE, 'blog/index.html');
if (fs.existsSync(blogIndex)) {
  let html = fs.readFileSync(blogIndex, 'utf8');
  const old = 'Frost, pots, soil and harvest from Melbourne to Brisbane and beyond.';
  const neu = 'Frost, pots, soil and harvest across Australian climates.';
  if (html.includes(old)) {
    html = html.replace(old, neu);
    fs.writeFileSync(blogIndex, html);
    changed++;
    console.log('Updated: blog/index grow card');
  }
}

// where-to-buy retail paragraph
const whereBuy = path.join(SITE, 'blog/where-to-buy-moringa-in-australia-online-vs-stores-2026-guide.html');
if (fs.existsSync(whereBuy)) {
  let html = fs.readFileSync(whereBuy, 'utf8');
  const old =
    'Local health food stores in Melbourne, Sydney, and Brisbane are your best retail bet for pure moringa powder.';
  const neu =
    'Local health food stores in major Australian cities are your best retail bet for pure moringa powder. See our <a href="/moringa-sydney/">Sydney buying guide</a> for metro-specific tips.';
  if (html.includes(old)) {
    html = html.replace(old, neu);
    fs.writeFileSync(whereBuy, html);
    changed++;
    console.log('Updated: where-to-buy retail paragraph');
  }
}

console.log(`Done. ${changed} file(s) updated.`);
