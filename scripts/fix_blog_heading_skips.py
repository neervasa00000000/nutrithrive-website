#!/usr/bin/env python3
"""
After the article <h1>...</h1>, any <h3>...</h3> before the first <h2> is an
outline skip (audit: H1 then H3 without H2). Rewrite those to h2/h2 only inside
the first <article>...</article> block. Does not use an HTML tree builder
(avoid mass reformatting).
"""
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
BLOG = REPO / "blog"
EXCLUDE = {"index.html"}


def fix_article(raw: str) -> tuple[str, int]:
    m = re.search(r'(<article\b[^>]*>)([\s\S]*?)(</article>)', raw, re.I)
    if not m:
        return raw, 0
    art_open, inner, art_close = m.group(1), m.group(2), m.group(3)
    h1_closes = list(re.finditer(r"</h1\s*>", inner, re.I))
    if not h1_closes:
        return raw, 0
    pos_after_h1 = h1_closes[0].end()
    rest = inner[pos_after_h1:]
    h2_open = re.search(r"<h2\b", rest, re.I)
    if h2_open:
        pre = rest[: h2_open.start()]
        post = rest[h2_open.start() :]
    else:
        pre = rest
        post = ""
    n = len(re.findall(r"<h3\b", pre, re.I))
    if not n:
        return raw, 0
    pre_fix = re.sub(r"<h3\b", "<h2", pre, flags=re.I)
    pre_fix = re.sub(r"</h3\s*>", "</h2>", pre_fix, flags=re.I)
    new_inner = inner[:pos_after_h1] + pre_fix + post
    new_raw = raw[: m.start()] + art_open + new_inner + art_close + raw[m.end() :]
    return new_raw, n


def main() -> None:
    total = 0
    for p in sorted(BLOG.glob("*.html")):
        if p.name in EXCLUDE:
            continue
        raw = p.read_text(encoding="utf-8", errors="replace")
        new, n = fix_article(raw)
        if n and new != raw:
            p.write_text(new, encoding="utf-8")
            print(f"{p.name}: {n} h3→h2 (before first h2)")
            total += n
    print(f"Total: {total} tag pairs adjusted")


if __name__ == "__main__":
    main()
