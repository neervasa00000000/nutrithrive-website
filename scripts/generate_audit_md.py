#!/usr/bin/env python3
"""Generate audit/01_site_map.md and 02_raw_pages.md from sitemap.xml + Firecrawl crawl JSON."""
from __future__ import annotations

import json
import re
import xml.etree.ElementTree as ET
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
CRAWL = ROOT / ".firecrawl" / "crawl-sitemap-25.json"
SITEMAP_PATH = ROOT / "sitemap.xml"
AUDIT = ROOT / "audit"
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def parse_sitemap() -> list[dict[str, str]]:
    tree = ET.parse(SITEMAP_PATH)
    rows = []
    for url_el in tree.findall("sm:url", NS):
        loc = (url_el.findtext("sm:loc", default="", namespaces=NS) or "").strip()
        if not loc:
            continue
        rows.append(
            {
                "loc": loc,
                "lastmod": (url_el.findtext("sm:lastmod", default="", namespaces=NS) or "").strip(),
                "changefreq": (url_el.findtext("sm:changefreq", default="", namespaces=NS) or "").strip(),
                "priority": (url_el.findtext("sm:priority", default="", namespaces=NS) or "").strip(),
            }
        )
    return rows


def classify(u: str) -> str:
    p = urlparse(u).path.lower().rstrip("/")
    if p == "" or p == "/":
        return "Homepage"
    if "/blog" in p:
        return "Blog posts & hub"
    if "/products" in p:
        return "Product pages"
    if any(x in p for x in ("/about", "/contact", "/melbourne")):
        return "About / contact / local"
    if "/nutrithrive_labs" in p:
        return "Tools (NutriThrive Labs)"
    if "/cart" in p or "/shop/cart" in p:
        return "Cart"
    if any(x in p for x in ("privacy", "legal", "shipping", "faq", "newsletter", "usage-guide")):
        return "Legal / policies / support"
    return "Other"


def extract_headings(md: str) -> tuple[list[str], list[str], list[str]]:
    h1, h2, h3 = [], [], []
    for line in md.splitlines():
        s = line.strip()
        if s.startswith("# ") and not s.startswith("## "):
            h1.append(s[2:].strip())
        elif s.startswith("## ") and not s.startswith("### "):
            h2.append(s[3:].strip())
        elif s.startswith("### "):
            h3.append(s[4:].strip())
    return h1, h2, h3


def extract_images(md: str) -> list[tuple[str, str]]:
    return re.findall(r"!\[([^\]]*)\]\(([^)]+)\)", md)


def word_count(md: str) -> int:
    text = re.sub(r"!\[[^\]]*\]\([^)]+\)", " ", md)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"[#*_`>|\\-]", " ", text)
    return len([w for w in re.split(r"\s+", text.strip()) if w])


def internal_links(links: list[str] | None) -> list[str]:
    if not links:
        return []
    out = []
    for L in links:
        if L.startswith("mailto:") or L.startswith("tel:"):
            continue
        try:
            host = urlparse(L).netloc
        except Exception:
            continue
        if host.endswith("nutrithrive.com.au"):
            out.append(L)
    return sorted(set(out))


def site_map_md(rows: list[dict[str, str]]) -> str:
    lines = [
        "# Phase 1 — Site map (sitemap.xml structure)",
        "",
        "**Target:** https://nutrithrive.com.au",
        "",
        "**Source of truth:** `sitemap.xml` in this repository (synced with `https://nutrithrive.com.au/sitemap.xml`).",
        "",
        f"**Total URLs in sitemap:** {len(rows)}",
        "",
        "## Official sitemap entries",
        "",
        "| Priority | Change freq | Last modified | URL |",
        "|----------|-------------|---------------|-----|",
    ]
    def sort_key(r: dict[str, str]) -> tuple:
        try:
            pr = float(r["priority"] or 0)
        except ValueError:
            pr = 0.0
        return (-pr, r["loc"])

    for r in sorted(rows, key=sort_key):
        lines.append(
            f"| {r['priority']} | {r['changefreq']} | {r['lastmod']} | `{r['loc']}` |"
        )
    lines.extend(["", "## URLs grouped by type", ""])
    groups: dict[str, list[str]] = defaultdict(list)
    for r in rows:
        groups[classify(r["loc"])].append(r["loc"])
    for cat in sorted(groups.keys()):
        lines.append(f"### {cat}")
        lines.append("")
        for u in sorted(groups[cat]):
            lines.append(f"- {u}")
        lines.append("")
    lines.extend(
        [
            "## Discovery cross-check",
            "",
            "Firecrawl `firecrawl_map` with `sitemap: only` returned the same 25 URLs (ordering may differ).",
            "",
        ]
    )
    return "\n".join(lines)


def raw_pages_md(data: list[dict]) -> str:
    n = len(data)
    parts = [
        "# Phase 2 — Raw page data (Firecrawl crawl)",
        "",
        "**Method:** Firecrawl `firecrawl_crawl` with **`sitemap: only`** so only URLs present in `sitemap.xml` were scraped.",
        "",
        f"**Pages:** {n} (full sitemap). Formats: markdown + links.",
        "",
        "Canonical tags are not always present in the trimmed HTML Firecrawl returns; verify in browser “View Source” for high-stakes URLs.",
        "",
    ]
    for item in data:
        md = item.get("markdown") or ""
        meta = item.get("metadata") or {}
        links = item.get("links") or []
        url = meta.get("sourceURL") or meta.get("url") or ""
        title = meta.get("title") or ""
        desc = meta.get("description") or ""
        robots = meta.get("robots") or ""
        h1, h2, h3 = extract_headings(md)
        imgs = extract_images(md)
        missing_alt = [(a, src) for a, src in imgs if not (a or "").strip()]
        parts.append("---")
        parts.append(f"## URL: {url}")
        parts.append(f"- **HTTP:** {meta.get('statusCode', '')}")
        parts.append(f"- **Robots meta (if present):** `{robots}`")
        parts.append(f"- **Title ({len(title)} chars):** {title}")
        parts.append(f"- **Meta description ({len(desc)} chars):** {desc}")
        parts.append(f"- **H1 ({len(h1)}):** {h1}")
        parts.append(f"- **H2 count:** {len(h2)} — sample: {h2[:8]}")
        parts.append(f"- **H3 count:** {len(h3)}")
        parts.append(f"- **Approx. word count (from markdown body):** {word_count(md)}")
        parts.append(f"- **Internal links found:** {len(internal_links(links))}")
        parts.append("  - " + "\n  - ".join(internal_links(links)[:40]) or "(none)")
        if len(internal_links(links)) > 40:
            parts.append(f"  - … +{len(internal_links(links)) - 40} more")
        parts.append(f"- **Images (markdown):** {len(imgs)} total; **missing/empty alt:** {len(missing_alt)}")
        if missing_alt[:5]:
            parts.append("  - Missing alt samples: " + "; ".join(src[:60] for _, src in missing_alt[:5]))
        parts.append("- **Canonical:** *(not extracted in this crawl output)*")
        parts.append(
            "- **Schema / JSON-LD:** *(not extracted in this crawl output; repo templates include BlogPosting, FAQPage, BreadcrumbList, LocalBusiness, Product.)*"
        )
        parts.append("")
    return "\n".join(parts)


def main() -> None:
    AUDIT.mkdir(parents=True, exist_ok=True)
    rows = parse_sitemap()
    (AUDIT / "01_site_map.md").write_text(site_map_md(rows), encoding="utf-8")

    raw = json.loads(CRAWL.read_text(encoding="utf-8"))
    data = raw.get("data") or []
    (AUDIT / "02_raw_pages.md").write_text(raw_pages_md(data), encoding="utf-8")
    print(f"Wrote 01_site_map.md ({len(rows)} sitemap URLs), 02_raw_pages.md ({len(data)} pages)")


if __name__ == "__main__":
    main()
