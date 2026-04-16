#!/usr/bin/env python3
"""Parse Firecrawl crawl JSON and emit audit-oriented summaries."""
from __future__ import annotations

import json
import re
import sys
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlparse


def norm_url(u: str) -> str:
    p = urlparse(u)
    path = (p.path or "/").rstrip("/") or "/"
    return f"{p.scheme}://{p.netloc}{path}"


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
    # ![alt](url)
    return re.findall(r"!\[([^\]]*)\]\(([^)]+)\)", md)


def word_count(md: str) -> int:
    text = re.sub(r"!\[[^\]]*\]\([^)]+\)", " ", md)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"[#*_`>|\\-]", " ", text)
    return len([w for w in re.split(r"\s+", text.strip()) if w])


def internal_links(links: list[str] | None, domain: str = "nutrithrive.com.au") -> list[str]:
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
        if host.endswith(domain) or host == domain:
            out.append(L)
    return sorted(set(out))


def classify_path(path: str) -> str:
    p = path.lower()
    if p in ("", "/"):
        return "homepage"
    if "/blog/" in p or p.rstrip("/").endswith("/blog"):
        return "blog"
    if "/products/" in p or p.rstrip("/").endswith("/products"):
        return "product"
    if "/nutrithrive_labs" in p:
        return "tools / labs"
    if any(x in p for x in ("/contact", "/about", "/melbourne")):
        return "about / contact / local"
    if any(x in p for x in ("/privacy", "/legal", "/shipping", "/faq", "/newsletter", "/usage-guide")):
        return "legal / support / policies"
    if "/cart" in p:
        return "cart / checkout"
    if "/pages/" in p:
        return "landing / utility pages"
    return "other"


def main() -> int:
    crawl_path = Path(__file__).resolve().parents[1] / ".firecrawl" / "crawl-sitemap-25.json"
    raw = json.loads(crawl_path.read_text(encoding="utf-8"))
    pages = raw.get("data") or []

    rows = []
    for item in pages:
        md = item.get("markdown") or ""
        meta = item.get("metadata") or {}
        links = item.get("links") or []
        url = meta.get("sourceURL") or meta.get("url") or ""
        title = meta.get("title") or ""
        desc = meta.get("description") or ""
        h1, h2, h3 = extract_headings(md)
        imgs = extract_images(md)
        missing_alt = sum(1 for alt, _ in imgs if not alt.strip())
        rows.append(
            {
                "url": url,
                "title": title,
                "title_len": len(title),
                "desc": desc,
                "desc_len": len(desc),
                "h1": h1,
                "h2": h2[:25],
                "h2_count": len(h2),
                "h3_count": len(h3),
                "words": word_count(md),
                "internal": internal_links(links),
                "images_total": len(imgs),
                "images_missing_alt": missing_alt,
                "sample_alts": [a[:80] for a, _ in imgs[:5]],
            }
        )

    # Dedupe titles/descriptions
    by_title = defaultdict(list)
    by_desc = defaultdict(list)
    for r in rows:
        by_title[r["title"]].append(r["url"])
        by_desc[r["desc"]].append(r["url"])

    out_path = Path(__file__).resolve().parents[1] / "audit" / "_parsed_summary.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")

    # Print duplicate report to stdout for quick check
    dup_t = {k: v for k, v in by_title.items() if k and len(v) > 1}
    dup_d = {k: v for k, v in by_desc.items() if k and len(v) > 1}
    print("DUPLICATE TITLES:", json.dumps(dup_t, indent=2)[:4000])
    print("DUPLICATE DESC:", json.dumps(dup_d, indent=2)[:4000])
    print("Wrote", out_path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
