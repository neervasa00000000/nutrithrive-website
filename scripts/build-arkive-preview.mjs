#!/usr/bin/env node
/**
 * Build ARKIVE frontend for private NutriThrive preview at /private/arkive-preview/
 * Requires arkive/frontend/.env with VITE_WALLETCONNECT_PROJECT_ID (and VITE_ARWEAVE_KEY for uploads).
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FRONTEND = path.join(ROOT, 'arkive', 'frontend');
const OUT = path.join(ROOT, 'private', 'arkive-preview');

execSync('npm run build', { cwd: FRONTEND, stdio: 'inherit' });

const dist = path.join(FRONTEND, 'dist');
if (!fs.existsSync(dist)) {
  console.error('Build failed: dist/ not found');
  process.exit(1);
}

if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.cpSync(dist, OUT, { recursive: true });
console.log('Copied ARKIVE build to', OUT);
