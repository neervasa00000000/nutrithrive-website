#!/usr/bin/env node
/**
 * Apply staged blog launch schedule from scripts/blog-launch-schedule.json.
 * - Sets robots meta (index vs noindex) per launch date
 * - Regenerates blog-articles.js/.min.js, blog ItemList, sitemap.xml, llms.txt
 *
 * Run: node scripts/apply-blog-launch-schedule.mjs
 * Optional: BLOG_LAUNCH_DATE=2026-07-04 node scripts/apply-blog-launch-schedule.mjs
 */
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import esbuild from 'esbuild';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const SCHEDULE_PATH = path.join(__dirname, 'blog-launch-schedule.json');
const BLOG_DIR = path.join(REPO, 'blog');
const LLMS_PATH = path.join(REPO, 'llms.txt');
const BASE = 'https://nutrithrive.com.au';
const TZ = 'Australia/Melbourne';

const LAUNCHED_SECTION = '## Untitled batch (June 2026)';
const SCHEDULED_SECTION = '## Untitled batch — scheduled';

function todayInMelbourne() {
  if (process.env.BLOG_LAUNCH_DATE) return process.env.BLOG_LAUNCH_DATE;
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
}

function formatDisplayDate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: TZ,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(dt);
}

function isLaunched(launchDate, today) {
  return launchDate <= today;
}

function loadSchedule() {
  const raw = fs.readFileSync(SCHEDULE_PATH, 'utf8');
  return JSON.parse(raw);
}

function setRobotsMeta(html, live) {
  const content = live ? 'index, follow' : 'noindex, follow';
  const tag = `<meta name="robots" content="${content}"/>`;
  if (/<meta\s+name="robots"/i.test(html)) {
    return html.replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i, tag);
  }
  return html.replace(
    /(<meta\s+name="viewport"[^>]*\/?>)/i,
    `$1\n${tag}`,
  );
}

function extractArticleMeta(raw, slug) {
  let title = slug.replace(/-/g, ' ');
  const titleTag = raw.match(/<title>([^<]*)<\/title>/i);
  if (titleTag) title = titleTag[1].replace(/\s*\|.*$/i, '').trim();
  const h1 =
    raw.match(/<article[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i) || raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) title = h1[1].replace(/<[^>]+>/g, '').trim();
  let description = '';
  const desc = raw.match(/meta\s+name="description"\s+content="([^"]*)"/i);
  if (desc) description = desc[1];
  let category = 'Wellness';
  const cat = raw.match(/rounded-full[^>]*font-label-sm[^>]*uppercase[^>]*>([^<]+)</i);
  if (cat) category = cat[1].trim();
  return { slug, title, description, category, href: `/blog/${slug}` };
}

function applyRobotsToPosts(schedule, today) {
  let launched = 0;
  let held = 0;
  for (const post of schedule.posts) {
    const filePath = path.join(BLOG_DIR, `${post.slug}.html`);
    if (!fs.existsSync(filePath)) {
      console.warn(`Missing blog file: blog/${post.slug}.html`);
      continue;
    }
    const live = isLaunched(post.launchDate, today);
    const raw = fs.readFileSync(filePath, 'utf8');
    const updated = setRobotsMeta(raw, live);
    if (updated !== raw) {
      fs.writeFileSync(filePath, updated);
    }
    if (live) launched++;
    else held++;
  }
  console.log(`Robots meta: ${launched} live, ${held} noindex (as of ${today})`);
}

function generateBlogArticlesJs() {
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.html') && f !== 'index.html' && !f.includes('.partial.'))
    .sort();

  const articles = files
    .filter((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
      return !/meta\s+name="robots"\s+content="noindex/i.test(raw);
    })
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
      const slug = file.replace(/\.html$/, '');
      return extractArticleMeta(raw, slug);
    });

  const jsPath = path.join(REPO, 'shared/js/blog-articles.js');
  const js = `/** Auto-generated — ${articles.length} blog articles. Run: node scripts/apply-blog-launch-schedule.mjs */\nwindow.NT_BLOG_ARTICLES = ${JSON.stringify(articles, null, 2)};\n`;
  fs.writeFileSync(jsPath, js);
  console.log(`Wrote shared/js/blog-articles.js (${articles.length} articles)`);

  const minPath = path.join(REPO, 'shared/js/blog-articles.min.js');
  esbuild.buildSync({
    entryPoints: [jsPath],
    outfile: minPath,
    minify: true,
    legalComments: 'none',
    target: ['es2018'],
    bundle: false,
  });
  console.log('Wrote shared/js/blog-articles.min.js');
}

function llmsLineFromPost(post) {
  const filePath = path.join(BLOG_DIR, `${post.slug}.html`);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { title, description } = extractArticleMeta(raw, post.slug);
  const displayTitle = title.replace(/ \(2026\)$/, '');
  return `- [${displayTitle}](${BASE}/blog/${post.slug}): ${description}`;
}

function updateLlmsTxt(schedule, today) {
  let content = fs.readFileSync(LLMS_PATH, 'utf8');
  const nextSection = '\n## Optional';
  const launched = schedule.posts.filter((p) => isLaunched(p.launchDate, today));
  const upcoming = schedule.posts.filter((p) => !isLaunched(p.launchDate, today));

  const launchedLines = launched.map((p) => llmsLineFromPost(p)).join('\n');
  let scheduledBlock = '';
  if (upcoming.length) {
    const scheduledLines = upcoming
      .map((p) => `${llmsLineFromPost(p)} _(launches ${formatDisplayDate(p.launchDate)})_`)
      .join('\n');
    scheduledBlock = `\n\n${SCHEDULED_SECTION}\nPosts below are noindex until their launch date; URLs exist for preview only.\n${scheduledLines}`;
  }

  const replacement = `${LAUNCHED_SECTION}\n${launchedLines}${scheduledBlock}\n`;

  const launchedIdx = content.indexOf(LAUNCHED_SECTION);
  const optionalIdx = content.indexOf(nextSection);
  if (launchedIdx === -1 || optionalIdx === -1) {
    console.warn('llms.txt section markers not found; skipping llms.txt update');
    return;
  }
  content = content.slice(0, launchedIdx) + replacement + content.slice(optionalIdx);
  fs.writeFileSync(LLMS_PATH, content);
  console.log(`Updated llms.txt: ${launched.length} live, ${upcoming.length} scheduled`);
}

function runChild(scriptName) {
  const scriptPath = path.join(__dirname, scriptName);
  const result = spawnSync(process.execPath, [scriptPath], {
    stdio: 'inherit',
    cwd: REPO,
    env: { ...process.env, TZ },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function summarize(schedule, today) {
  const batches = new Map();
  for (const post of schedule.posts) {
    if (!batches.has(post.batch)) batches.set(post.batch, { launchDate: post.launchDate, slugs: [] });
    batches.get(post.batch).slugs.push(post.slug);
  }
  console.log('\nBatch summary:');
  for (const [batch, info] of [...batches.entries()].sort((a, b) => a[0] - b[0])) {
    const status = isLaunched(info.launchDate, today) ? 'LIVE' : 'scheduled';
    console.log(`  Batch ${batch} (${info.launchDate}, ${status}): ${info.slugs.length} posts`);
  }
}

function main() {
  const schedule = loadSchedule();
  const today = todayInMelbourne();
  console.log(`Applying blog launch schedule (today: ${today}, tz: ${TZ})\n`);

  applyRobotsToPosts(schedule, today);
  generateBlogArticlesJs();
  runChild('regenerate-blog-itemlist.mjs');
  runChild('build-sitemap.cjs');
  updateLlmsTxt(schedule, today);
  summarize(schedule, today);
  console.log('\nDone.');
}

main();
