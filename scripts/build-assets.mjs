#!/usr/bin/env node
/**
 * Production asset pipeline:
 * 1. Compile Tailwind v2 utilities (replaces cdn.tailwindcss.com)
 * 2. Minify first-party .js → .min.js and .css → .min.css
 * 3. Patch HTML to reference minified assets
 *
 * Run: npm run build
 */
import fs from 'fs';
import path from 'path';
import {
  ROOT,
  buildTailwind,
  minifyJsFiles,
  minifyCssFiles,
  patchHtmlFiles,
} from './lib/asset-minify.mjs';

const skipTailwind = process.argv.includes('--skip-tailwind');

async function main() {
  console.log('NutriThrive asset build\n');

  if (!skipTailwind) {
    console.log('→ Tailwind v2 CSS…');
    await buildTailwind();
  } else {
    console.log('→ Skipping Tailwind (--skip-tailwind)');
  }

  console.log('→ Minify JavaScript…');
  const js = await minifyJsFiles();
  console.log(`   ${js.length} files`);

  console.log('→ Minify CSS…');
  const css = await minifyCssFiles();
  console.log(`   ${css.length} files`);

  const manifest = {
    builtAt: new Date().toISOString(),
    js,
    css,
  };
  const manifestPath = path.join(ROOT, '.build/asset-manifest.json');
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  const manifestEntries = [...js, ...css];

  console.log('→ Patch HTML references…');
  const htmlChanged = await patchHtmlFiles(manifestEntries);
  console.log(`   ${htmlChanged} HTML files updated`);

  const twSize = fs.existsSync(path.join(ROOT, 'assets/css/tailwind-v2.min.css'))
    ? fs.statSync(path.join(ROOT, 'assets/css/tailwind-v2.min.css')).size
    : 0;
  console.log(`\nDone. tailwind-v2.min.css ${(twSize / 1024).toFixed(1)} KiB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
