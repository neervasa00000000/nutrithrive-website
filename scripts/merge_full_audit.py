#!/usr/bin/env python3
"""Concatenate audit phases into FULL_AUDIT_REPORT.md with TOC."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUDIT = ROOT / "audit"
FILES = [
    "01_site_map.md",
    "02_raw_pages.md",
    "03_technical_seo.md",
    "04_content_ux.md",
    "05_quick_wins.md",
    "06_executive_summary.md",
]

header = """# Nutri Thrive — Full website audit report

**Live site:** https://nutrithrive.com.au  
**Audit date:** 15 April 2026 (re-audit: sitemap-only scope, 25 URLs)  
**Data collection:** Firecrawl MCP (map with sitemap-only, crawl with sitemap-only, scrape spot checks) and live HTTP checks.

---

## Table of contents

1. [Phase 1 — Site map](#1-phase-1--site-map-sitemapxml-structure)
2. [Phase 2 — Raw page data](#2-phase-2--raw-page-data-firecrawl-crawl)
3. [Phase 3 — Technical SEO](#3-phase-3--technical-seo-audit)
4. [Phase 4 — Content & UX](#4-phase-4--content--ux-audit)
5. [Phase 5 — Quick wins](#5-phase-5--quick-wins-top-15)
6. [Phase 6 — Executive summary](#6-phase-6--executive-summary)

---

"""

def main() -> None:
    parts = [header]
    for i, name in enumerate(FILES, start=1):
        body = (AUDIT / name).read_text(encoding="utf-8")
        body = body.replace("# Phase ", f"# {i}. Phase ", 1)
        parts.append(body)
        parts.append("\n\n---\n\n")
    out = "".join(parts).rstrip() + "\n"
    (AUDIT / "FULL_AUDIT_REPORT.md").write_text(out, encoding="utf-8")
    print("Wrote FULL_AUDIT_REPORT.md")


if __name__ == "__main__":
    main()
