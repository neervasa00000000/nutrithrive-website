#!/usr/bin/env node
/**
 * Humanize remaining blog posts: founder note, intro touch-up, update log, TGA, author-bio.
 * Run: node scripts/humanize-remaining-blogs.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const blogDir = path.join(root, 'blog');

const SKIP_DEEP = new Set([
  'is-moringa-banned-australia-truth-2026.html',
  'moringa-benefits-for-women-comprehensive-2026.html',
  'how-much-moringa-powder-per-day-dosage-guide-2026.html',
  'moringa-side-effects-what-happens-take-too-much-2026.html',
  'what-does-moringa-do-for-your-body-complete-guide-2026.html',
  'verify-moringa-quality-premium-buyers-checklist-2026.html',
  'moringa-capsules-vs-powder-which-is-better-2026.html',
  'where-to-buy-moringa-in-australia-online-vs-stores-2026-guide.html',
  'how-to-choose-moringa-powder-australia-2026.html',
  'moringa-melbourne-complete-guide-2026.html',
  'cystic-acne-gut-healing-what-actually-cleared-skin-2026.html',
  'moringa-powder-victoria-seniors-joint-health.html',
  'cant-lose-weight-broken-gut-what-actually-worked-2026.html',
  'chronic-fatigue-what-actually-fixed-it-2026.html',
  'nutrithrive-dried-curry-leaves-tradition-health.html',
  'cortisol-belly-fat-couldnt-lose-stomach-melbourne-2026.html',
  'best-superfoods-australia-comparison-health-conscious-adults.html',
]);

const cssTag = '<link rel="stylesheet" href="/shared/css/author-bio.css"/>';
const jsTag = '<script src="/shared/js/author-bio.js"></script>';

const UPDATE_LOG = `<div class="nt-update-log">
  <p><strong>Last updated:</strong> 21 May 2026</p>
  <details>
    <summary>Update history</summary>
    <ul>
      <li><strong>May 2026:</strong> Compliance and clarity pass (Neer).</li>
    </ul>
  </details>
</div>`;

const FOUNDER_NOTES = {
  '10-dollar-superfood-replaced-200-supplement-stack-australia-2026.html':
    '<p style="margin:0 0 0.75rem 0;">I\'m Neer — NutriThrive runs out of Truganina. This is a straight cost comparison between one food powder and a typical supplement stack, not a promise you\'ll ditch every pill.</p><p style="margin:0 0 0.75rem 0;">Moringa is a food supplement in Australia. It does not replace medicines or treat deficiency your GP should manage.</p><p style="margin:0;">If you take prescription meds or have a diagnosed condition, check changes with your doctor first.</p>',
  'affordable-superfoods-organic-tax-marketplace-wellness-vic-nsw-qld-2026.html':
    '<p style="margin:0 0 0.75rem 0;">Neer here — I pack orders in Truganina and watch what Aussies actually pay for "wellness" powders across Vic, NSW, and QLD.</p><p style="margin:0 0 0.75rem 0;">This article is about price and labels, not treating illness. Superfoods are foods first; therapeutic claims belong on registered medicines only.</p><p style="margin:0;">Medical questions — iron, diabetes, pregnancy — go to your GP, not a blog.</p>',
  'best-greens-powder-australia-2026.html':
    '<p style="margin:0 0 0.75rem 0;">I\'m Neer (NutriThrive, Truganina). I compared greens tubs you can buy in Australia — taste, price, ingredients — not as a dietitian ranking cures.</p><p style="margin:0 0 0.75rem 0;">Powders supplement meals; they don\'t replace vegetables or medical care.</p><p style="margin:0;">If you need help with fatigue, gut issues, or immunity, start with your GP and Eat for Health guidance.</p>',
  'buy-moringa-powder-melbourne-victoria-chinese-guide.html':
    '<p style="margin:0 0 0.75rem 0;">我是 Neer，在墨尔本 Truganina 仓库发货。这篇是购买与品质说明，不是医疗建议。</p><p style="margin:0 0 0.75rem 0;">Moringa / 辣木粉在澳洲属于食品补充剂，不能宣称治疗疾病。有病史或服药请先咨询医生。</p><p style="margin:0;">English: food supplement only — see your GP for medical questions.</p>',
  'does-moringa-have-caffeine-truth-about-energy-focus-side-effects-2026.html':
    '<p style="margin:0 0 0.75rem 0;">Neer, NutriThrive — Truganina warehouse. People ask us daily if moringa is "like coffee." It isn\'t; leaf powder has no caffeine.</p><p style="margin:0 0 0.75rem 0;">Feeling more alert can come from nutrition in your diet — not from a stimulant. That\'s food support, not a treatment for sleep disorders or ADHD.</p><p style="margin:0;">On medication or pregnant? Ask your GP before adding any new powder.</p>',
  'fresh-moringa-leaves-vs-powder-nutrients-2026.html':
    '<p style="margin:0 0 0.75rem 0;">I\'m Neer — we shade-dry leaf in batches and ship from Melbourne. Fresh leaves vs powder is a kitchen and storage question, not a disease guide.</p><p style="margin:0 0 0.75rem 0;">Nutrient numbers vary by season and drying; we don\'t promise clinical outcomes from either form.</p><p style="margin:0;">Food supplement only — GP for anything medical.</p>',
  'green-superfood-smoothie-recipes-australia-2026.html':
    '<p style="margin:0 0 0.75rem 0;">Neer here — recipes tested with Australian supermarket ingredients, packed from Truganina.</p><p style="margin:0 0 0.75rem 0;">Smoothies are meals, not medicines. Moringa adds nutrients to food; it doesn\'t treat conditions.</p><p style="margin:0;">Allergies, diabetes, or pregnancy? Check with your clinician before new ingredients.</p>',
  'high-protein-moringa-recipes-australia-2026.html':
    '<p style="margin:0 0 0.75rem 0;">I\'m Neer — these are real kitchen recipes from Melbourne, not a protein supplement advert.</p><p style="margin:0 0 0.75rem 0;">Moringa is not a high-protein food on its own; pair it with eggs, fish, or legumes as we show below.</p><p style="margin:0;">Food only — see your GP for medical nutrition needs.</p>',
  'how-to-add-moringa-to-diet.html':
    '<p style="margin:0 0 0.75rem 0;">Neer, NutriThrive Truganina. This is practical meal ideas — how to stir powder into food you already eat.</p><p style="margin:0 0 0.75rem 0;">Australian law treats moringa as food. We don\'t claim it treats fatigue, diabetes, or skin disease.</p><p style="margin:0;">Medication or medical diet? Ask your GP first.</p>',
  'how-to-choose-greens-powder-australia-2026.html':
    '<p style="margin:0 0 0.75rem 0;">I\'m Neer — buyer\'s guide written from warehouse QC and label reading, not affiliate hype.</p><p style="margin:0 0 0.75rem 0;">Choose powders for ingredient lists and batch freshness, not "detox" or "cure" claims on the tub.</p><p style="margin:0;">Clinical nutrition needs belong with your GP.</p>',
  'how-to-grow-moringa-in-australia-complete-guide-2026.html':
    '<p style="margin:0 0 0.75rem 0;">Neer here — I grow and dry moringa for NutriThrive; this is horticulture for Aussie backyards and pots.</p><p style="margin:0 0 0.75rem 0;">Growing trees doesn\'t make leaf powder a medicine. Harvest for food use only unless you\'re a registered manufacturer.</p><p style="margin:0;">Check local council rules for planting in your suburb.</p>',
  'how-to-read-moringa-batch-codes-freshness.html':
    '<p style="margin:0 0 0.75rem 0;">I\'m Neer — we print batch codes on every bag from Truganina so you can judge freshness, not trust marketing adjectives.</p><p style="margin:0 0 0.75rem 0;">Fresh powder should look bright green and smell grassy — brown dust is old leaf, whatever the label says.</p><p style="margin:0;">This is quality buying advice, not medical testing.</p>',
  'how-to-use-moringa-powder-daily-without-the-bad-taste-2026.html':
    '<p style="margin:0 0 0.75rem 0;">Neer — bad taste is usually stale or coarse powder, not "you\'re doing it wrong." We fix that at the drying step.</p><p style="margin:0 0 0.75rem 0;">Tips below are food prep — smoothies, tea, baking — not dose advice for treating illness.</p><p style="margin:0;">Dosage and medicines: see our <a href="/blog/how-much-moringa-powder-per-day-dosage-guide-2026.html">daily amount guide</a> and your GP.</p>',
  'moringa-30-day-challenge-honest-results.html':
    '<p style="margin:0 0 0.75rem 0;">I\'m Neer — this is one structured food trial (my own and early customers\'), not a clinical study with guaranteed outcomes.</p><p style="margin:0 0 0.75rem 0;">No invented names, no "cured my X" claims. Track how you feel; see a GP if symptoms persist.</p><p style="margin:0;">Moringa is a food supplement — not a replacement for sleep, iron therapy, or prescribed treatment.</p>',
  'moringa-melbourne-complete-growers-report-2026.html':
    '<p style="margin:0 0 0.75rem 0;">Neer — field notes from Melbourne-area growers and our Truganina packing line.</p><p style="margin:0 0 0.75rem 0;">Supply and seasonality affect colour and price; we don\'t promise therapeutic results from any batch.</p><p style="margin:0;">Buying for health conditions? Use food framing and talk to your GP.</p>',
  'moringa-oil-benefits-skin-hair-health-2026.html':
    '<p style="margin:0 0 0.75rem 0;">I\'m Neer — moringa seed oil is a cosmetic ingredient for many people; we sell leaf powder, but the questions overlap.</p><p style="margin:0 0 0.75rem 0;">Topical oil is not a drug for acne, eczema, or hair loss. Severe skin issues need a dermatologist.</p><p style="margin:0;">Food leaf powder ≠ medicine — GP for diagnosis and treatment.</p>',
  'moringa-quality-test-shade-dried-vs-retail-australia-2026.html':
    '<p style="margin:0 0 0.75rem 0;">Neer here — we bought retail tubs and compared them to our shade-dried batches under the same light in Truganina.</p><p style="margin:0 0 0.75rem 0;">Lab-style home tests (colour, smell, solubility) — not a promise your blood markers will change.</p><p style="margin:0;">Food supplement only; medical questions to your GP.</p>',
  'moringa-tea-benefits-how-to-brew-2026-guide.html':
    '<p style="margin:0 0 0.75rem 0;">Neer — I drink moringa tea most weekdays; we pack the leaf powder in Melbourne.</p><p style="margin:0 0 0.75rem 0;">Tea is a gentle way to try the leaf — lower dose per cup than a smoothie. Not a treatment for any disease.</p><p style="margin:0;">Pregnant, on blood thinners, or managing a condition? Check with your GP first.</p>',
  'moringa-vs-coffee-melbourne-energy-hack.html':
    '<p style="margin:0 0 0.75rem 0;">I\'m Neer — Melbourne caffeine culture vs a caffeine-free leaf. This is a swap experiment for morning routine, not medical energy treatment.</p><p style="margin:0 0 0.75rem 0;">Some people feel steadier; others notice nothing. No guaranteed kg or "fixed fatigue."</p><p style="margin:0;">Persistent tiredness? GP and bloods before blaming coffee alone.</p>',
  'moringa-vs-spirulina-vs-matcha-comparison-australia.html':
    '<p style="margin:0 0 0.75rem 0;">Neer here — side-by-side food powders available in Australia, judged on nutrition labels and kitchen use.</p><p style="margin:0 0 0.75rem 0;">None of these "cure" anything; pick based on diet gaps and taste, not disease claims on Instagram.</p><p style="margin:0;">Medical nutrition — dietitian or GP, not a comparison blog.</p>',
  'quit-sugar-90-days-honest-diary-melbourne-2026.html':
    '<p style="margin:0 0 0.75rem 0;">I\'m Neer — personal diary of cutting added sugar in Melbourne, not diabetes treatment advice.</p><p style="margin:0 0 0.75rem 0;">Moringa helped me replace sweet afternoon habits with tea — food habit, not a drug for blood sugar disease.</p><p style="margin:0;">Diabetes or insulin use? Only change diet with your care team.</p>',
  'science-shade-drying-vs-sun-drying-moringa.html':
    '<p style="margin:0 0 0.75rem 0;">Neer — we shade-dry ~7–8 days under mesh in Truganina; this article explains why we don\'t sun-blast leaf.</p><p style="margin:0 0 0.75rem 0;">Processing affects colour and nutrients in food — not a claim that powder treats illness.</p><p style="margin:0;">Research citations are background; your GP handles health decisions.</p>',
  'what-to-eat-when-too-tired-melbourne-2026.html':
    '<p style="margin:0 0 0.75rem 0;">I\'m Neer — Melbourne meal ideas when you\'re knackered after work, not a fatigue clinic guide.</p><p style="margin:0 0 0.75rem 0;">Food supports energy as part of sleep, iron, and stress management — moringa is one ingredient, not a cure.</p><p style="margin:0;">Exhaustion for months? See your GP; don\'t self-treat serious conditions.</p>',
  'why-i-built-nutrithrive-moringa-real-story-finest-moringa-powder.html':
    '<p style="margin:0 0 0.75rem 0;">I\'m Neer — this is the founder story from our Truganina warehouse: why I stopped trusting brown "premium" moringa on shelves.</p><p style="margin:0 0 0.75rem 0;">NutriThrive sells food-grade leaf powder. I won\'t claim it treats disease — that\'s illegal and dishonest.</p><p style="margin:0;">Questions about your health? Your GP, not me.</p>',
  'why-premium-moringa-costs-11-not-25-value-vs-markup-2026.html':
    '<p style="margin:0 0 0.75rem 0;">Neer — transparent costing from import to Truganina pack, not a "cheap = bad" lecture.</p><p style="margin:0 0 0.75rem 0;">Price reflects drying time and testing, not miracle potency. Still a food supplement under Australian rules.</p><p style="margin:0;">Pay for freshness and lab tests, not disease promises on the label.</p>',
};

const INTRO_REPLACEMENTS = [
  // best-greens
  [
    '<p>Greens powders are <strong>concentrated superfood supplements</strong> made from dried vegetables, fruits, algae, grasses, and herbs — all ground into a fine powder you mix with water or smoothies.</p>',
    '<p>Greens powders are <strong>dried vegetable and algae blends</strong> you stir into water or a smoothie — a quick way to add plants to a day when you barely hit two serves of veg.</p>',
  ],
  [
    '<p>We tested and compared <strong>20+ greens powders</strong> available in Australia based on ingredient quality, nutritional value, price per serve, taste, mixability, and 500+ customer reviews.</p>',
    '<p>We lined up <strong>20+ tubs</strong> you can actually buy in Australia — ingredient lists, price per serve, taste, and how they mix — without affiliate kickbacks.</p>',
  ],
  // does-moringa caffeine
  [
    '<p>One of the most common questions people ask is: <strong>“Does moringa have caffeine?”</strong> Here’s the truth about energy, focus, and what to expect when you start.</p>',
    '<p>The question we get most: <strong>does moringa have caffeine?</strong> Short answer: no. Here\'s what that means for your morning cuppa, focus, and side effects — in plain Australian English.</p>',
  ],
  [
    ' If you feel more energy, it’s typically because moringa supports nutrition and helps reduce fatigue, not because it stimulates your nervous system. ',
    ' If you feel more alert, it\'s usually from nutrients in the leaf as part of your diet — not a caffeine-style jolt. ',
  ],
  [
    '<p>Moringa boosts energy differently. Instead of creating a quick stimulant “spike,” it can help support steady energy by addressing common root causes of fatigue.</p>',
    '<p>Moringa works differently from coffee. There\'s no stimulant spike — some people feel steadier when leaf nutrients sit alongside normal meals and sleep.</p>',
  ],
  [
    '<p>Iron helps your blood carry oxygen. If your iron status is low, fatigue is common—improving nutrition can support more consistent energy.</p>',
    '<p>Iron in food supports normal energy metabolism. If your GP says you\'re low, food sources (including leafy powders) may help alongside their advice — not instead of it.</p>',
  ],
  [
    '<p>Some people notice fewer “midday crashes” because moringa may support blood sugar balance.</p>',
    '<p>Some people pair moringa with meals and notice fewer afternoon slumps — individual, and not a diabetes treatment.</p>',
  ],
  // moringa tea
  [
    '<p>Moringa tea is one of the easiest ways to try the &quot;miracle tree&quot; without committing to a full smoothie routine. Australians often ask whether tea is as good as powder in food — and whether it tastes like grass or green tea. This guide covers the real benefits, a simple recipe from powder, taste tips, and when tea beats (or loses to) a teaspoon in your morning blend.</p>',
    '<p>Moringa tea is the gentlest way to try the leaf — one cup, hot water, no blender commitment. Aussies usually ask two things: is tea as good as powder in food, and will it taste like lawn clippings? Below: how to brew from powder, what to expect in the mug, and when tea beats a full smoothie dose.</p>',
  ],
  // high-protein - intro already good, light touch first para only if needed
  [
    '<p>Most moringa recipe articles give you the same tired green smoothie in three slightly different colours. This one doesn\'t. Below are 10 recipes I actually use — breakfasts, lunches, dinners, and one late-night snack — tested in a real Melbourne kitchen with real Australian ingredients you can find at Coles, Woolworths, or any decent greengrocer.</p>',
    '<p>Most moringa recipe round-ups recycle the same green smoothie three ways. These ten are what I cook at home in Melbourne — breakfast through dinner, plus a late-night snack — with ingredients from Coles, Woolworths, or a decent greengrocer.</p>',
  ],
  // best-greens TGA line
  [
    '<p>B vitamins support energy metabolism, iron prevents fatigue (especially important for women), and magnesium supports cellular energy production. 67% of users report increased energy within 1–2 weeks. Best for energy: moringa (iron + B vitamins).</p>',
    '<p>B vitamins and magnesium contribute to normal energy metabolism; iron in food supports that pathway (many women look at intake here). Some customers tell us they feel more alert in a week or two — individual, not guaranteed. For iron + B vitamins in one leaf, moringa is often the pick.</p>',
  ],
  [
    '<li><strong>Support immunity</strong> with vitamins, minerals, and antioxidants</li>',
    '<li><strong>Add antioxidants and vitamins</strong> to meals as part of normal nutrition</li>',
  ],
  [
    '<li><strong>Honest reviews</strong> from verified Australian customers</li>',
    '<li><strong>Practical notes</strong> from Australian buyers (not paid endorsements)</li>',
  ],
];

function founderNoteHtml(topicHtml) {
  return `<div class="nt-founder-note" style="margin:1.25rem 0;padding:1rem 1.25rem;background:#f7f3e8;border-left:4px solid #0f6b4d;border-radius:8px;font-size:0.95rem;">${topicHtml}</div>`;
}

function injectAuthorBio(html) {
  let changed = false;
  if (!html.includes('author-bio.css')) {
    const anchor = html.includes('/blog/blog-v2-prose.css')
      ? '/blog/blog-v2-prose.css'
      : html.includes('/shared/css/author-bio.css')
        ? null
        : 'blog-v2-prose.css';
    if (anchor) {
      const idx = html.lastIndexOf(anchor);
      if (idx !== -1) {
        const end = html.indexOf('>', idx) + 1;
        html = html.slice(0, end) + '\n' + cssTag + html.slice(end);
        changed = true;
      }
    }
  }
  if (!html.includes('author-bio.js')) {
    if (html.includes('footer-v2.js')) {
      html = html.replace(
        '<script src="/shared/js/footer-v2.js"></script>',
        '<script src="/shared/js/footer-v2.js"></script>\n' + jsTag
      );
      changed = true;
    } else if (html.includes('</body>')) {
      html = html.replace('</body>', jsTag + '\n</body>');
      changed = true;
    }
  }
  return { html, changed };
}

function insertFounderNote(html, noteInner) {
  if (html.includes('nt-founder-note')) return html;
  const note = founderNoteHtml(noteInner);
  const markers = [
    /(<div class="featured-snippet-box"[\s\S]*?<\/div>\s*)/,
    /(<\/div>\s*<nav class="article-toc"[\s\S]*?<\/nav>\s*)/,
    /(<div class="story-buy-inline"[\s\S]*?<\/div>\s*)/,
    /(<div class="quick-nav">[\s\S]*?<\/div>\s*)/,
    /(<div class="blog-v2-prose[^"]*"[^>]*>\s*)/,
  ];
  for (const re of markers) {
    const m = html.match(re);
    if (m) {
      const idx = html.indexOf(m[0]) + m[0].length;
      return html.slice(0, idx) + note + html.slice(idx);
    }
  }
  return html;
}

function insertUpdateLog(html) {
  if (html.includes('nt-update-log')) return html;
  const anchors = [
    '<section class="nt-related-links-block">',
    '<p style="margin-top: 1rem;"><a href="/blog/">← Back to all articles</a></p>',
    '<p style="margin-top:1rem;"><a href="/blog/">← Back to all articles</a></p>',
    '<a href="/blog/" class="back-to-blog',
    '<p><a href="/blog/">← Back to Blog</a></p>',
  ];
  for (const a of anchors) {
    if (html.includes(a)) {
      return html.replace(a, UPDATE_LOG + '\n' + a);
    }
  }
  // before closing prose div
  const close = '</div>\n</article>';
  if (html.includes(close)) {
    return html.replace(close, UPDATE_LOG + '\n' + close);
  }
  return html;
}

function removeDuplicateDisclaimer(html) {
  return html.replace(
    /<p class="sources" style="margin-top:2rem;font-size:0.9rem;color:#666;"><em>Disclaimer: General information only, not medical advice\. Consult your healthcare provider before starting any supplement, especially if pregnant, breastfeeding, or on medication\.<\/em><\/p>\s*/g,
    ''
  );
}

function applyTgaFixes(html) {
  let n = html;
  const fixes = [
    [/fix chronic fatigue/gi, 'support energy as food'],
    [/not a cure/gi, 'not a treatment'],
    [/Accutane/gi, 'prescription acne medication'],
    [/stop (your|taking) (medication|medications)/gi, 'change prescribed medicines without your GP'],
    [/guaranteed to lose \d+ ?kg/gi, 'individual weight changes vary'],
    [/treats diabetes/gi, 'claims to treat diabetes'],
    [/prevents COVID/gi, 'claims to prevent COVID'],
    [/comprehensive guides/gi, 'related guides'],
    [/premium quality guaranteed/gi, 'batch-tested before dispatch'],
  ];
  for (const [re, rep] of fixes) {
    n = n.replace(re, rep);
  }
  return n;
}

function applyIntroReplacements(html) {
  let n = html;
  for (const [oldStr, newStr] of INTRO_REPLACEMENTS) {
    if (n.includes(oldStr)) n = n.replace(oldStr, newStr);
  }
  return n;
}

const report = [];
const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.html') && f !== 'index.html').sort();

for (const file of files) {
  const fp = path.join(blogDir, file);
  let html = fs.readFileSync(fp, 'utf8');
  if (!html.includes('blog-v2-prose')) {
    report.push({ file, skip: 'no blog-v2-prose' });
    continue;
  }

  const deep = !SKIP_DEEP.has(file);
  const row = { file, founder: '-', intro: '-', tga: '-', updateLog: '-', authorBio: '-' };

  const ab = injectAuthorBio(html);
  if (ab.changed) {
    html = ab.html;
    row.authorBio = 'added';
  } else if (html.includes('author-bio.js')) {
    row.authorBio = 'ok';
  }

  html = removeDuplicateDisclaimer(html);
  const tgaBefore = html;
  html = applyTgaFixes(html);
  if (html !== tgaBefore) row.tga = 'fixed';

  if (deep) {
    const note = FOUNDER_NOTES[file];
    if (note) {
      const before = html;
      html = insertFounderNote(html, note);
      row.founder = html !== before ? 'added' : html.includes('nt-founder-note') ? 'ok' : 'fail';
    }
    const introBefore = html;
    html = applyIntroReplacements(html);
    if (html !== introBefore) row.intro = 'rewritten';
    else row.intro = 'ok/n/a';
  } else {
    row.skipped = 'deep rewrite skipped';
    if (!html.includes('nt-update-log')) row.updateLog = 'adding';
  }

  const ulBefore = html.includes('nt-update-log');
  html = insertUpdateLog(html);
  row.updateLog = html.includes('nt-update-log') ? (ulBefore ? 'ok' : 'added') : 'fail';

  fs.writeFileSync(fp, html);
  report.push(row);
}

console.log(JSON.stringify(report, null, 2));
