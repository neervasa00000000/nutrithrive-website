#!/usr/bin/env python3
"""Merge raw report HTML with NutriThrive head; dedupe inline a.src per block (NutriThrive exempt).

Example (from repo root):
  python3 scripts/merge-moringa-melbourne-page.py incoming.html scripts/moringa-melbourne-report-head.inc.html blog/moringa-melbourne-complete-growers-report-2026.html
"""

from __future__ import annotations

import sys
from pathlib import Path

from bs4 import BeautifulSoup
from bs4.element import Tag

NT_HOST = "nutrithrive.com.au"
NT_CANON = "https://nutrithrive.com.au/blog/growing-moringa-australia-honest-frost-pots-2026.html"
OLD_NT_URLS = (
    "https://nutrithrive.com.au/blog/grow-moringa-tree-australia.html",
    "https://nutrithrive.com.au/pages/blog/grow-moringa-tree-australia.html",
)


def normalize_nutri_href(href: str) -> str:
    if not href:
        return href
    h = href.strip()
    for old in OLD_NT_URLS:
        if h == old:
            return NT_CANON
        if h.startswith(old + "#"):
            return NT_CANON + h[len(old) :]
    return h


def fix_all_nt_hrefs(soup: BeautifulSoup) -> None:
    for a in soup.find_all("a", href=True):
        a["href"] = normalize_nutri_href(a["href"])


def _has_src_class(classes) -> bool:
    if not classes:
        return False
    if isinstance(classes, str):
        return "src" in classes.split()
    return "src" in classes


def dedupe_src_in_element(el: Tag) -> None:
    seen: set[str] = set()
    for a in list(el.find_all("a", class_=_has_src_class)):
        href = normalize_nutri_href(a.get("href") or "")
        if NT_HOST in href:
            continue
        if href in seen:
            a.decompose()
        else:
            seen.add(href)


def dedupe_src_links(soup: BeautifulSoup) -> None:
    def skip(el: Tag) -> bool:
        return el.find_parent(class_="sources-panel") is not None

    for name in ("p", "li", "td", "th"):
        for el in soup.find_all(name):
            if not isinstance(el, Tag):
                continue
            if skip(el):
                continue
            if not el.find("a", class_=_has_src_class):
                continue
            dedupe_src_in_element(el)


def add_niir_source(soup: BeautifulSoup) -> None:
    panel = soup.select_one(".sources-panel ol")
    if not panel:
        return
    niir_href = "https://www.niir.org/blog/moringa-business-plan-a-complete-guide-for-entrepreneurs/"
    if panel.find("a", href=niir_href):
        return
    li = soup.new_tag("li")
    a = soup.new_tag("a", href=niir_href, target="_blank")
    a.string = "NIIR — Moringa Business Plan Guide"
    li.append(a)
    panel.append(li)


def add_bom_seasonal_archive(soup: BeautifulSoup) -> None:
    panel = soup.select_one(".sources-panel ol")
    if not panel:
        return
    href = "https://www.bom.gov.au/climate/current/season/vic/archive/202402.melbourne.shtml"
    if panel.find("a", href=href):
        return
    li = soup.new_tag("li")
    a = soup.new_tag("a", href=href, target="_blank")
    a.string = "Bureau of Meteorology — Greater Melbourne seasonal summary (archive)"
    li.append(a)
    panel.append(li)


def sync_footer_sources(soup: BeautifulSoup) -> None:
    footer = soup.select_one(".footer-sources")
    if not footer:
        return
    extra = (
        (
            "https://www.niir.org/blog/moringa-business-plan-a-complete-guide-for-entrepreneurs/",
            "NIIR — Business Plan",
        ),
        (
            "https://www.bom.gov.au/climate/current/season/vic/archive/202402.melbourne.shtml",
            "BOM — Melbourne seasonal archive",
        ),
    )
    for href, label in extra:
        if footer.find("a", href=href):
            continue
        a = soup.new_tag("a", href=href, target="_blank")
        a.string = label
        footer.append(a)


def bump_source_counts(html: str) -> str:
    return (
        html.replace("All 26 Sources", "All 28 Sources")
        .replace("26 sources cited inline", "28 sources cited inline")
        .replace("26 sources", "28 sources")
    )


def main() -> None:
    if len(sys.argv) < 4:
        print(
            "Usage: merge-moringa-melbourne-page.py <raw-report.html> <head-snippet.html> <out.html>",
            file=sys.stderr,
        )
        sys.exit(1)
    raw_path = Path(sys.argv[1])
    head_path = Path(sys.argv[2])
    out_path = Path(sys.argv[3])

    raw_html = bump_source_counts(raw_path.read_text(encoding="utf-8"))
    soup = BeautifulSoup(raw_html, "html.parser")

    add_niir_source(soup)
    add_bom_seasonal_archive(soup)
    fix_all_nt_hrefs(soup)
    dedupe_src_links(soup)
    sync_footer_sources(soup)

    style_tag = soup.find("style")
    body = soup.body
    if not style_tag or not body:
        print("Expected <style> and <body> in raw HTML", file=sys.stderr)
        sys.exit(1)

    inner_style = style_tag.decode_contents()
    body_inner = "".join(str(c) for c in body.contents)

    head_snippet = head_path.read_text(encoding="utf-8").rstrip()

    out = f"""<!DOCTYPE html>
<html lang="en-AU">
<head>
{head_snippet}
<style>
{inner_style}
</style>
</head>
<body>
{body_inner}
<p style="text-align:center;margin:0;padding:16px 24px 28px;font-family:Arial,sans-serif;font-size:13px;background:#fafaf8;"><a href="https://nutrithrive.com.au/blog/" style="color:#0f3d2e;">← Back to NutriThrive Blog</a></p>
</body>
</html>
"""
    out_path.write_text(out, encoding="utf-8")
    print("Wrote", out_path)


if __name__ == "__main__":
    main()
