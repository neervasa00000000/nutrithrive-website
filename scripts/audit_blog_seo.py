#!/usr/bin/env python3
"""
Audit all blog HTML files against SEO length + structure targets.

Outputs:
  - audit/blog_seo_report.csv
  - audit/blog_seo_duplicates.txt

Scope:
  - blog/*.html excluding blog/index.html
  - Attempts to extract: title tag, meta description, H1/H2, slug (filename),
    og:title/og:description, twitter:title/twitter:description, schema headline,
    word count, internal link count, H2 count, H3-per-H2 (max).
"""

from __future__ import annotations

import csv
import json
import re
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

from bs4 import BeautifulSoup


REPO = Path(__file__).resolve().parents[1]
BLOG_DIR = REPO / "blog"
AUDIT_DIR = REPO / "audit"

SITE_HOST = "nutrithrive.com.au"
SITE_ORIGIN = f"https://{SITE_HOST}"


@dataclass(frozen=True)
class Bounds:
    min: int | None = None
    sweet_min: int | None = None
    sweet_max: int | None = None
    max: int | None = None
    unique: bool = False


TARGETS: dict[str, Bounds] = {
    "title": Bounds(min=30, sweet_min=50, sweet_max=60, max=60, unique=True),
    "meta_description": Bounds(min=120, sweet_min=140, sweet_max=155, max=160, unique=True),
    "h1": Bounds(min=20, sweet_min=40, sweet_max=65, max=70, unique=True),
    "h2": Bounds(min=15, sweet_min=20, sweet_max=60, max=70, unique=False),
    "slug": Bounds(min=10, sweet_min=40, sweet_max=65, max=75, unique=True),
    "og_title": Bounds(min=30, sweet_min=60, sweet_max=90, max=90, unique=True),
    "og_description": Bounds(min=80, sweet_min=100, sweet_max=200, max=200, unique=True),
    "twitter_title": Bounds(min=20, sweet_min=60, sweet_max=70, max=70, unique=True),
    "twitter_description": Bounds(min=60, sweet_min=100, sweet_max=150, max=150, unique=True),
    "schema_headline": Bounds(min=10, sweet_min=50, sweet_max=90, max=110, unique=True),
    "word_count": Bounds(min=700, sweet_min=800, sweet_max=1000, max=1000, unique=False),
    "internal_links": Bounds(min=3, sweet_min=3, sweet_max=3, max=3, unique=False),
    "h2_count": Bounds(min=3, sweet_min=4, sweet_max=5, max=6, unique=False),
    "h3_per_h2_max": Bounds(min=0, sweet_min=1, sweet_max=2, max=3, unique=False),
}


def _norm_space(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "").strip())


def _get_meta(soup: BeautifulSoup, *, name: str | None = None, prop: str | None = None) -> str:
    if name:
        el = soup.find("meta", attrs={"name": name})
        if el and el.get("content"):
            return _norm_space(el["content"])
        # Some pages use property="twitter:*" for twitter tags
        el = soup.find("meta", attrs={"property": name})
        if el and el.get("content"):
            return _norm_space(el["content"])
    if prop:
        el = soup.find("meta", attrs={"property": prop})
        if el and el.get("content"):
            return _norm_space(el["content"])
    return ""


def _extract_schema_headline(soup: BeautifulSoup) -> str:
    scripts = soup.find_all("script", attrs={"type": "application/ld+json"})
    for sc in scripts:
        raw = (sc.string or sc.get_text() or "").strip()
        if not raw:
            continue
        try:
            data = json.loads(raw)
        except Exception:
            continue

        def walk(x: Any) -> Iterable[dict[str, Any]]:
            if isinstance(x, dict):
                yield x
                for v in x.values():
                    yield from walk(v)
            elif isinstance(x, list):
                for i in x:
                    yield from walk(i)

        for obj in walk(data):
            t = obj.get("@type")
            if isinstance(t, list):
                types = {str(z) for z in t}
            elif t:
                types = {str(t)}
            else:
                types = set()
            if types.intersection({"Article", "BlogPosting", "NewsArticle"}):
                headline = obj.get("headline")
                if isinstance(headline, str) and headline.strip():
                    return _norm_space(headline)
    return ""


def _pick_content_root(soup: BeautifulSoup) -> BeautifulSoup:
    # Prefer article content, then main, then body.
    for sel in ["article", "main", "body"]:
        el = soup.select_one(sel)
        if el:
            return el
    return soup


def _word_count(root: BeautifulSoup) -> int:
    # Remove non-content.
    for tag in root.select("script, style, noscript"):
        tag.decompose()
    text = root.get_text(" ", strip=True)
    # Count "words" using unicode-aware-ish grouping (letters/digits/underscore).
    # This will undercount for CJK; we still report what we can consistently.
    return len(re.findall(r"\b\w+\b", text, flags=re.UNICODE))


def _internal_links_count(root: BeautifulSoup) -> int:
    n = 0
    for a in root.find_all("a", href=True):
        href = (a.get("href") or "").strip()
        if not href:
            continue
        if href.startswith("#") or href.startswith("mailto:") or href.startswith("tel:"):
            continue
        if href.startswith("/"):
            n += 1
            continue
        if href.startswith(SITE_ORIGIN) or (href.startswith("https://") and SITE_HOST in href):
            n += 1
            continue
    return n


def _headings(soup: BeautifulSoup, root: BeautifulSoup) -> tuple[str, list[str], list[str], int, int]:
    # H1 is a page-level element and is sometimes outside <article>.
    h1_el = soup.find("h1")
    h1 = _norm_space(h1_el.get_text(" ", strip=True)) if h1_el else ""

    h2s: list[str] = []
    h3s: list[str] = []
    for h in root.find_all(["h2", "h3"]):
        txt = _norm_space(h.get_text(" ", strip=True))
        if h.name == "h2":
            h2s.append(txt)
        elif h.name == "h3":
            h3s.append(txt)

    # H3 per H2 (max between H2 boundaries), based on order inside root.
    h3_per_h2_max = 0
    current_h3 = 0
    seen_any_h2 = False
    for h in root.find_all(["h2", "h3"]):
        if h.name == "h2":
            if seen_any_h2:
                h3_per_h2_max = max(h3_per_h2_max, current_h3)
            seen_any_h2 = True
            current_h3 = 0
        elif h.name == "h3" and seen_any_h2:
            current_h3 += 1
    if seen_any_h2:
        h3_per_h2_max = max(h3_per_h2_max, current_h3)
    return h1, h2s, h3s, len(h2s), h3_per_h2_max


def _len_ok(field: str, value: str, n: int) -> tuple[bool, bool, bool]:
    b = TARGETS[field]
    hard_ok = True
    sweet_ok = True
    if b.min is not None and n < b.min:
        hard_ok = False
    if b.max is not None and n > b.max:
        hard_ok = False
    if b.sweet_min is not None and n < b.sweet_min:
        sweet_ok = False
    if b.sweet_max is not None and n > b.sweet_max:
        sweet_ok = False
    present_ok = bool(value.strip()) if field not in {"word_count", "internal_links", "h2_count", "h3_per_h2_max"} else True
    return present_ok, hard_ok, sweet_ok


def main() -> None:
    AUDIT_DIR.mkdir(parents=True, exist_ok=True)

    files = sorted([p for p in BLOG_DIR.glob("*.html") if p.name != "index.html"])
    rows: list[dict[str, Any]] = []

    unique_fields = [k for k, b in TARGETS.items() if b.unique]
    seen: dict[str, dict[str, list[str]]] = {f: defaultdict(list) for f in unique_fields}

    for p in files:
        html = p.read_text(encoding="utf-8", errors="replace")
        soup = BeautifulSoup(html, "html.parser")
        root = _pick_content_root(soup)

        title = _norm_space((soup.title.string if soup.title and soup.title.string else ""))
        meta_desc = _get_meta(soup, name="description")
        og_title = _get_meta(soup, prop="og:title")
        og_desc = _get_meta(soup, prop="og:description")
        tw_title = _get_meta(soup, name="twitter:title") or _get_meta(soup, prop="twitter:title")
        tw_desc = _get_meta(soup, name="twitter:description") or _get_meta(soup, prop="twitter:description")
        schema_headline = _extract_schema_headline(soup)

        h1, h2s, _h3s, h2_count, h3_per_h2_max = _headings(soup, root)

        slug = p.stem
        wc = _word_count(root)
        ilinks = _internal_links_count(root)

        values: dict[str, Any] = {
            "file": str(p.relative_to(REPO)),
            "slug": slug,
            "title": title,
            "meta_description": meta_desc,
            "h1": h1,
            "h2_first": h2s[0] if h2s else "",
            "og_title": og_title,
            "og_description": og_desc,
            "twitter_title": tw_title,
            "twitter_description": tw_desc,
            "schema_headline": schema_headline,
            "word_count": wc,
            "internal_links": ilinks,
            "h2_count": h2_count,
            "h3_per_h2_max": h3_per_h2_max,
        }

        # Length metrics
        for field in [
            "title",
            "meta_description",
            "h1",
            "h2",
            "slug",
            "og_title",
            "og_description",
            "twitter_title",
            "twitter_description",
            "schema_headline",
        ]:
            if field == "h2":
                v = values["h2_first"]
            else:
                v = values.get(field, "")
            values[f"{field}_len"] = len(v or "")

        # Pass flags
        for field in [
            "title",
            "meta_description",
            "h1",
            "slug",
            "og_title",
            "og_description",
            "twitter_title",
            "twitter_description",
            "schema_headline",
        ]:
            v = str(values.get(field, "") or "")
            n = int(values.get(f"{field}_len", len(v)))
            present_ok, hard_ok, sweet_ok = _len_ok(field, v, n)
            values[f"{field}_present_ok"] = present_ok
            values[f"{field}_hard_ok"] = hard_ok
            values[f"{field}_sweet_ok"] = sweet_ok

        # H2 (using first H2)
        h2v = str(values.get("h2_first", "") or "")
        present_ok, hard_ok, sweet_ok = _len_ok("h2", h2v, len(h2v))
        values["h2_present_ok"] = present_ok
        values["h2_hard_ok"] = hard_ok
        values["h2_sweet_ok"] = sweet_ok

        # Numeric bounds (word_count / internal_links / counts)
        for field, v in [
            ("word_count", wc),
            ("internal_links", ilinks),
            ("h2_count", h2_count),
            ("h3_per_h2_max", h3_per_h2_max),
        ]:
            b = TARGETS[field]
            hard_ok = True
            sweet_ok = True
            if b.min is not None and v < b.min:
                hard_ok = False
            if b.max is not None and v > b.max:
                hard_ok = False
            if b.sweet_min is not None and v < b.sweet_min:
                sweet_ok = False
            if b.sweet_max is not None and v > b.sweet_max:
                sweet_ok = False
            values[f"{field}_hard_ok"] = hard_ok
            values[f"{field}_sweet_ok"] = sweet_ok

        # Uniqueness collection (normalize whitespace; case-sensitive collisions still matter,
        # but we treat "same but different spaces" as duplicate).
        for field in unique_fields:
            v = str(values.get(field, "") or "")
            key = _norm_space(v)
            if key:
                seen[field][key].append(values["file"])

        rows.append(values)

    # Write CSV
    out_csv = AUDIT_DIR / "blog_seo_report.csv"
    fieldnames = sorted({k for r in rows for k in r.keys()})
    with out_csv.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for r in rows:
            w.writerow(r)

    # Duplicates report
    out_dups = AUDIT_DIR / "blog_seo_duplicates.txt"
    lines: list[str] = []
    for field in unique_fields:
        dups = [(k, v) for k, v in seen[field].items() if len(v) > 1]
        dups.sort(key=lambda x: (-len(x[1]), x[0]))
        lines.append(f"=== {field}: {len(dups)} duplicate groups ===")
        for k, files_for_key in dups[:200]:
            preview = k if len(k) <= 180 else (k[:177] + "…")
            lines.append(f"- {len(files_for_key)}x: {', '.join(files_for_key)}")
            lines.append(f"  key: {preview}")
        lines.append("")
    out_dups.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")

    # Console summary
    print(f"Audited {len(rows)} blog posts")
    print(f"Wrote {out_csv.relative_to(REPO)}")
    print(f"Wrote {out_dups.relative_to(REPO)}")


if __name__ == "__main__":
    main()

