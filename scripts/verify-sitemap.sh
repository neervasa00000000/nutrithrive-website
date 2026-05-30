#!/usr/bin/env bash
# Exit 0 only if sitemap.xml and audit/sitemap-urls.txt match generator output
# (same check as GitHub Actions "Sitemap" workflow). Run from repo root:
#   bash scripts/verify-sitemap.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export TZ="${TZ:-Australia/Melbourne}"
node scripts/build-sitemap.cjs
if ! git diff --quiet -- sitemap.xml audit/sitemap-urls.txt; then
  echo "" >&2
  echo "sitemap.xml or audit/sitemap-urls.txt does not match the generator; CI will fail." >&2
  echo "Fix: commit the outputs after edit, e.g." >&2
  echo "  git add sitemap.xml audit/sitemap-urls.txt && git commit -m \"chore: regenerate sitemap\" && git push" >&2
  echo "" >&2
  git diff -- sitemap.xml audit/sitemap-urls.txt >&2 || true
  exit 1
fi
echo "OK: sitemap outputs match committed files."
