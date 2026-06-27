#!/usr/bin/env node
/**
 * Installs repo git hooks from scripts/git-hooks/ (idempotent).
 * Run manually: node scripts/install-git-hooks.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "scripts/git-hooks");
const DEST = path.join(ROOT, ".git/hooks");

if (!fs.existsSync(path.join(ROOT, ".git"))) {
  console.log("Not a git checkout; skipping hook install.");
  process.exit(0);
}

for (const name of fs.readdirSync(SRC)) {
  const from = path.join(SRC, name);
  if (!fs.statSync(from).isFile()) continue;
  const to = path.join(DEST, name);
  fs.copyFileSync(from, to);
  fs.chmodSync(to, 0o755);
  console.log(`Installed .git/hooks/${name}`);
}
