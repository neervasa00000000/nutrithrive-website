import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import fg from 'fast-glob';
import esbuild from 'esbuild';
import CleanCSS from 'clean-css';
import { REPO_ROOT, SITE_ROOT } from './paths.mjs';

export const ROOT = REPO_ROOT;
export const SITE = SITE_ROOT;

export const TAILWIND_BUILT_HREF = '/assets/css/tailwind-v2.min.css';
export const TAILWIND_LINK_TAG = `<link rel="stylesheet" href="${TAILWIND_BUILT_HREF}"/>`;

const SITE_JS_GLOBS = [
  'assets/js/storefront/**/*.js',
  'shared/js/**/*.js',
  'shared/site-data.js',
  'pages/**/*.js',
  'blog/*.js',
  'nutrithrive_labs/**/*.js',
];

const ROOT_JS_GLOBS = [
  'scripts/global/**/*.js',
  'scripts/pages/**/*.js',
];

const SITE_CSS_GLOBS = [
  'assets/css/**/*.css',
  'shared/css/**/*.css',
  'styles/**/*.css',
  'pages/**/*.css',
  'blog/*.css',
  'nutrithrive_labs/**/*.css',
];

const SKIP_JS = [
  '**/*.min.js',
  '**/node_modules/**',
  'scripts/**/*.mjs',
];

const SKIP_CSS = [
  '**/*.min.css',
  '**/tailwind-v2-source.css',
  '**/tailwind-v2.min.css',
  '**/node_modules/**',
];

export function minPath(file) {
  const ext = path.extname(file);
  const base = file.slice(0, -ext.length);
  return `${base}.min${ext}`;
}

/** Repo-relative path → public URL path (site/ is stripped at deploy). */
function publicUrl(repoRel) {
  const posix = repoRel.replace(/\\/g, '/');
  if (posix.startsWith('site/')) return `/${posix.slice(5)}`;
  return `/${posix}`;
}

export async function buildTailwind() {
  execSync(
    'npx tailwindcss -i ./site/assets/css/tailwind-v2-source.css -o ./site/assets/css/tailwind-v2.min.css --minify',
    { cwd: ROOT, stdio: 'inherit' }
  );
}

async function minifyJsIn(cwd, globs) {
  const files = await fg(globs, {
    cwd,
    ignore: SKIP_JS,
    onlyFiles: true,
  });
  const out = [];
  for (const rel of files) {
    const src = path.join(cwd, rel);
    const destRel = minPath(rel);
    const dest = path.join(cwd, destRel);
    await esbuild.build({
      entryPoints: [src],
      outfile: dest,
      minify: true,
      legalComments: 'none',
      target: ['es2018'],
      bundle: false,
    });
    out.push({
      from: path.relative(ROOT, src).replace(/\\/g, '/'),
      to: path.relative(ROOT, dest).replace(/\\/g, '/'),
    });
  }
  return out;
}

export async function minifyJsFiles() {
  return [
    ...(await minifyJsIn(SITE, SITE_JS_GLOBS)),
    ...(await minifyJsIn(ROOT, ROOT_JS_GLOBS)),
  ];
}

export async function minifyCssFiles() {
  const cleaner = new CleanCSS({ level: 2 });
  const files = await fg(SITE_CSS_GLOBS, {
    cwd: SITE,
    ignore: SKIP_CSS,
    onlyFiles: true,
  });
  const out = [];
  for (const rel of files) {
    const src = path.join(SITE, rel);
    const destRel = minPath(rel);
    const dest = path.join(SITE, destRel);
    const { styles, errors } = cleaner.minify(fs.readFileSync(src, 'utf8'));
    if (errors?.length) {
      console.warn('[css]', rel, errors.join('; '));
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, styles);
    out.push({
      from: path.relative(ROOT, src).replace(/\\/g, '/'),
      to: path.relative(ROOT, dest).replace(/\\/g, '/'),
    });
  }
  return out;
}

export function replaceTailwindCdn(html) {
  const hadCdn = /cdn\.tailwindcss\.com/i.test(html);
  let out = html;
  out = out.replace(/<script src="https:\/\/cdn\.tailwindcss\.com[^"]*"[^>]*><\/script>\s*/gi, '');
  out = out.replace(/<script id="tailwind-config">[\s\S]*?<\/script>\s*/gi, '');
  out = out.replace(/<link[^>]*preconnect[^>]*cdn\.tailwindcss\.com[^>]*>\s*/gi, '');
  if (hadCdn && !out.includes(TAILWIND_BUILT_HREF)) {
    if (/<link rel="stylesheet" href="\/shared\/css\/v2-extra\.css"/i.test(out)) {
      out = out.replace(
        /(<link rel="stylesheet" href="\/shared\/css\/v2-extra\.css"[^>]*>)/i,
        `$1\n${TAILWIND_LINK_TAG}`
      );
    } else if (/<link rel="stylesheet" href="\/assets\/css\/design-system\.css"/i.test(out)) {
      out = out.replace(
        /(<link rel="stylesheet" href="\/assets\/css\/design-system\.css"[^>]*>)/i,
        `$1\n${TAILWIND_LINK_TAG}`
      );
    } else {
      out = out.replace(/<\/head>/i, `${TAILWIND_LINK_TAG}\n</head>`);
    }
  }
  return out;
}

export function patchAssetRefs(html, manifestEntries) {
  let out = html;
  for (const { from, to } of manifestEntries) {
    const fromUrl = publicUrl(from);
    const toUrl = publicUrl(to);
    if (fromUrl === toUrl) continue;
    const esc = fromUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(esc, 'g'), toUrl);
  }
  return out;
}

export async function patchHtmlFiles(manifestEntries) {
  const htmlFiles = await fg(['**/*.html'], {
    cwd: SITE,
    ignore: ['**/node_modules/**'],
    onlyFiles: true,
  });
  let changed = 0;
  for (const rel of htmlFiles) {
    const fp = path.join(SITE, rel);
    const before = fs.readFileSync(fp, 'utf8');
    let after = replaceTailwindCdn(before);
    after = patchAssetRefs(after, manifestEntries);
    if (after !== before) {
      fs.writeFileSync(fp, after);
      changed += 1;
    }
  }
  return changed;
}
