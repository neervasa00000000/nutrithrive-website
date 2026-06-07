#!/usr/bin/env bash
# Exit 0 only if sitemap.xml matches generator output
# (same check as GitHub Actions "Sitemap" workflow). Run from repo root:
#   bash scripts/verify-sitemap.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export TZ="${TZ:-Australia/Melbourne}"
node scripts/build-sitemap.cjs
if ! git diff --quiet -- sitemap.xml; then
  echo "" >&2
  echo "sitemap.xml does not match the generator; CI will fail." >&2
  echo "Fix: commit the output after edit, e.g." >&2
  echo "  git add sitemap.xml && git commit -m \"chore: regenerate sitemap\" && git push" >&2
  echo "" >&2
  git diff -- sitemap.xml >&2 || true
  exit 1
fi
echo "OK: sitemap.xml matches committed file."
