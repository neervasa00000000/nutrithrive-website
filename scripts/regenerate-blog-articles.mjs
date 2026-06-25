#!/usr/bin/env node
/** Regenerate shared/js/blog-articles.js from live (non-noindex) blog posts. */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
spawnSync(process.execPath, [path.join(dir, 'build-live-v2.mjs')], {
  stdio: 'inherit',
  cwd: path.join(dir, '..'),
});
