#!/usr/bin/env python3
"""
Blog diagnostic audit (static HTML): technical SEO + commercial + internal links.

Usage (from repo root):
  python3 scripts/blog_diagnostic_audit.py
  python3 scripts/blog_diagnostic_audit.py --json audit/blog_diagnostic_report.json

Outputs CSV to audit/blog_diagnostic_report.csv by default.
"""

from __future__ import annotations

import argparse
import csv
import html as html_lib
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

REPO_ROOT = Path(__file__).resolve().parent.parent
BLOG_DIR = REPO_ROOT / "blog"
AUDIT_DIR = REPO_ROOT / "audit"
REDIRECTS = REPO_ROOT / "_redirects"
BASE = "https://nutrithrive.com.au"

# Commercial paths (href normalized to lowercase path-ish string)
_COMMERCIAL_SUBSTRINGS = (
    "/products/",
    "/product/",
    "/shop/",
    "/cart",
    "add-to-cart",
    "/collections/",
    "myshopify.com",
)


def _strip_tags(html: str) -> str:
    text = re.sub(r"<(?!!)[^>]+>", " ", html)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _main_fragment(html: str) -> str:
    lower = html.lower()
    for needle in ("<main", "<article"):
        i = lower.find(needle)
        if i != -1:
            return html[i:]
    m = re.search(r"<h1\b", html, re.I)
    if m:
        return html[m.start() :]
    bi = lower.find("<body")
    return html[bi:] if bi != -1 else html


def _scrub_scripts_styles(fragment: str) -> str:
    fragment = re.sub(r"<script\b[^>]*>.*?</script>", " ", fragment, flags=re.I | re.S)
    fragment = re.sub(r"<style\b[^>]*>.*?</style>", " ", fragment, flags=re.I | re.S)
    fragment = re.sub(r"<noscript\b[^>]*>.*?</noscript>", " ", fragment, flags=re.I | re.S)
    return fragment


def _normalize_href(href: str) -> str:
    href = href.strip()
    if not href or href.startswith("#") or href.lower().startswith("javascript:"):
        return ""
    return href


def _is_commercial_href(href: str) -> bool:
    h = _normalize_href(href)
    if not h:
        return False
    low = h.lower()
    for s in _COMMERCIAL_SUBSTRINGS:
        if s in low:
            return True
    if "nutrithrive.com.au" in low:
        path = urlparse(low).path
        return any(s.strip("/") in path for s in ("/shop", "/products", "/cart"))
    if low.startswith("/") or low.startswith("../"):
        p = low.split("?", 1)[0].lower()
        return any(
            x in p
            for x in (
                "/products/",
                "/product/",
                "/shop/",
                "/cart",
                "add-to-cart",
                "/collections/",
            )
        )
    return False


def _is_internal_blog_href(href: str) -> bool:
    h = _normalize_href(href).lower()
    if "/blog/" in h and "nutrithrive" in h:
        return True
    if re.search(r"\.\./blog/|/blog/", h):
        return True
    return False


def _extract_head_field(html: str, pattern: str) -> str | None:
    m = re.search(pattern, html, flags=re.I | re.S)
    return m.group(1).strip() if m else None


def _canonical_url(html: str) -> str | None:
    return _extract_head_field(
        html,
        r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']',
    ) or _extract_head_field(
        html,
        r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']canonical["\']',
    )


def _title_text(html: str) -> str | None:
    m = re.search(r"<title[^>]*>(.*?)</title>", html, flags=re.I | re.S)
    return html_lib.unescape(m.group(1).strip()) if m else None


def _meta_description(html: str) -> str | None:
    m = re.search(
        r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)["\']',
        html,
        flags=re.I,
    )
    if not m:
        m = re.search(
            r'<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']description["\']',
            html,
            flags=re.I,
        )
    return html_lib.unescape(m.group(1).strip()) if m else None


def _h1_blocks(html: str) -> list[str]:
    """Inner HTML of each h1 (may contain markup)."""
    return re.findall(r"<h1\b[^>]*>(.*?)</h1>", html, flags=re.I | re.S)


def _commercial_link_in_first_n_words(fragment: str, n_words: int = 200) -> bool:
    """True if some commercial <a href> appears before we've seen n_words of text in document order."""
    frag = _scrub_scripts_styles(fragment)
    word_count = 0
    i = 0
    while i < len(frag):
        lower = frag.lower()
        j = lower.find("<a", i)
        if j == -1:
            break
        # Count words in text segment [i, j)
        segment = frag[i:j]
        word_count += len(_strip_tags(segment).split())
        if word_count >= n_words:
            return False
        m = re.search(
            r"<a\b[^>]*\bhref\s*=\s*(['\"])([^'\"]*)\1",
            frag[j : j + 500],
            flags=re.I,
        )
        if not m:
            i = j + 3
            continue
        href = m.group(2)
        if _is_commercial_href(href):
            return True
        # skip past this tag
        end = frag.find(">", j)
        i = (end + 1) if end != -1 else j + 3
    return False


def _count_commercial_anchors(fragment: str) -> int:
    frag = _scrub_scripts_styles(fragment)
    n = 0
    for m in re.finditer(
        r"<a\b[^>]*\bhref\s*=\s*(['\"])([^'\"]*)\1", frag, flags=re.I
    ):
        if _is_commercial_href(m.group(2)):
            n += 1
    return n


def _count_internal_blog_anchors(fragment: str) -> int:
    frag = _scrub_scripts_styles(fragment)
    n = 0
    for m in re.finditer(
        r"<a\b[^>]*\bhref\s*=\s*(['\"])([^'\"]*)\1", frag, flags=re.I
    ):
        if _is_internal_blog_href(m.group(2)):
            n += 1
    return n


def _imgs_missing_alt(fragment: str) -> int:
    frag = _scrub_scripts_styles(fragment)
    missing = 0
    for m in re.finditer(r"<img\b[^>]*>", frag, flags=re.I):
        tag = m.group(0)
        if not re.search(r"\balt\s*=", tag, flags=re.I):
            missing += 1
            continue
        am = re.search(r"\balt\s*=\s*(['\"])(.*?)\1", tag, flags=re.I | re.S)
        if am and not am.group(2).strip():
            missing += 1
    return missing


def _load_blog_404_paths() -> set[str]:
    """Paths in _redirects that 404 and look like /blog/..."""
    out: set[str] = set()
    if not REDIRECTS.is_file():
        return out
    for line in REDIRECTS.read_text(encoding="utf-8", errors="replace").splitlines():
        line = line.split("#", 1)[0].strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split()
        if len(parts) < 3:
            continue
        if parts[-1] != "404":
            continue
        src = parts[0].strip()
        if "/blog/" in src:
            out.add(src)
    return out


def audit_file(path: Path) -> dict:
    rel = path.relative_to(REPO_ROOT).as_posix()
    html = path.read_text(encoding="utf-8", errors="replace")
    fname = path.name
    expected = f"{BASE}/blog/{fname}"

    canonical = _canonical_url(html) or ""
    canonical_ok = canonical.rstrip("/") == expected.rstrip("/")

    title = _title_text(html) or ""
    title_len = len(title)
    title_band_ok = 50 <= title_len <= 60

    desc = _meta_description(html) or ""
    desc_len = len(desc)
    desc_band_ok = 150 <= desc_len <= 160

    h1s = _h1_blocks(html)
    h1_count = len(h1s)
    h1_plain = html_lib.unescape(_strip_tags(h1s[0])) if h1s else ""
    h1_preview = h1_plain[:120]

    main_f = _main_fragment(html)
    main_clean = _scrub_scripts_styles(main_f)

    early_shop = _commercial_link_in_first_n_words(main_clean, 200)
    commercial_total = _count_commercial_anchors(main_clean)
    blog_internal = _count_internal_blog_anchors(main_clean)
    imgs_no_alt = _imgs_missing_alt(main_clean)

    robots = _extract_head_field(
        html, r'<meta[^>]+name=["\']robots["\'][^>]+content=["\']([^"\']+)["\']'
    )
    if not robots:
        robots = _extract_head_field(
            html,
            r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']robots["\']',
        )
    robots = (robots or "").lower()
    noindex = "noindex" in robots

    year_hint = "2026" in title or "2026" in desc or ("2026" in main_clean[:8000])

    notes: list[str] = []
    if h1_count != 1:
        notes.append(f"h1_count={h1_count}")
    if not canonical_ok:
        notes.append("canonical_mismatch")
    if not title_band_ok:
        notes.append(f"title_len={title_len}")
    if not desc_band_ok:
        notes.append(f"meta_len={desc_len}")
    if not early_shop:
        notes.append("no_shop_link_first_200_words")
    if commercial_total < 3:
        notes.append(f"commercial_links={commercial_total}")
    if blog_internal < 3:
        notes.append(f"internal_blog_links={blog_internal}")
    if imgs_no_alt > 0:
        notes.append(f"img_missing_alt={imgs_no_alt}")
    if noindex:
        notes.append("noindex")
    if not year_hint:
        notes.append("no_2026_near_top")

    url_path = f"/blog/{fname}"
    redirect_404 = url_path in _load_blog_404_paths() or f"/blog/{fname.replace('.html', '')}" in _load_blog_404_paths()

    return {
        "file": rel,
        "expected_canonical": expected,
        "canonical": canonical,
        "canonical_ok": canonical_ok,
        "title_len": title_len,
        "title_band_50_60": title_band_ok,
        "meta_desc_len": desc_len,
        "meta_band_150_160": desc_band_ok,
        "h1_count": h1_count,
        "h1_preview": h1_preview,
        "shop_link_first_200w": early_shop,
        "commercial_links_main": commercial_total,
        "internal_blog_links_main": blog_internal,
        "img_missing_alt_main": imgs_no_alt,
        "noindex": noindex,
        "year_2026_hint": year_hint,
        "redirects_file_marks_404": redirect_404,
        "notes": "; ".join(notes),
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--csv",
        type=Path,
        default=AUDIT_DIR / "blog_diagnostic_report.csv",
        help="Output CSV path",
    )
    ap.add_argument("--json", type=Path, default=None, help="Optional JSON output")
    args = ap.parse_args()

    if not BLOG_DIR.is_dir():
        print("blog/ not found", file=sys.stderr)
        return 1

    AUDIT_DIR.mkdir(parents=True, exist_ok=True)

    posts = sorted(p for p in BLOG_DIR.glob("*.html") if p.name != "index.html")
    rows = [audit_file(p) for p in posts]

    fieldnames = [
        "file",
        "canonical_ok",
        "title_len",
        "title_band_50_60",
        "meta_desc_len",
        "meta_band_150_160",
        "h1_count",
        "shop_link_first_200w",
        "commercial_links_main",
        "internal_blog_links_main",
        "img_missing_alt_main",
        "noindex",
        "year_2026_hint",
        "redirects_file_marks_404",
        "h1_preview",
        "canonical",
        "notes",
    ]

    args.csv.parent.mkdir(parents=True, exist_ok=True)
    with args.csv.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow(r)

    if args.json:
        args.json.parent.mkdir(parents=True, exist_ok=True)
        args.json.write_text(json.dumps(rows, indent=2), encoding="utf-8")

    # Summary counts
    n = len(rows)
    ok_canon = sum(1 for r in rows if r["canonical_ok"])
    ok_early = sum(1 for r in rows if r["shop_link_first_200w"])
    ok_comm3 = sum(1 for r in rows if r["commercial_links_main"] >= 3)
    ok_blog3 = sum(1 for r in rows if r["internal_blog_links_main"] >= 3)
    bad_redirect = [r["file"] for r in rows if r["redirects_file_marks_404"]]

    print(f"Wrote {args.csv} ({n} posts)")
    if args.json:
        print(f"Wrote {args.json}")
    print(
        f"Summary: canonical_ok {ok_canon}/{n}, shop_in_first_200w {ok_early}/{n}, "
        f"commercial_links>=3 {ok_comm3}/{n}, internal_blog>=3 {ok_blog3}/{n}"
    )
    if bad_redirect:
        print(
            "WARNING: _redirects marks 404 for URLs matching these files:",
            ", ".join(bad_redirect),
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
