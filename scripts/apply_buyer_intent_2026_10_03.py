#!/usr/bin/env python3
"""Apply buyer-intent title/lede/meta fixes from Gork_bot prompt file to site/blog."""

from __future__ import annotations

import html as html_lib
import re
from pathlib import Path

PROMPT = Path(__file__).resolve().parents[1] / "Gork_bot/blog-fix-prompts-buyer-2026-10-03.md"
SITE_BLOG = Path(__file__).resolve().parents[1] / "site/blog"

PRODUCT_META = {
    "moringa-powder": {
        "label": "NutriThrive moringa powder",
        "strong": "100g $11 · 200g $21.50 · 400g $35",
        "cta": "Shop moringa powder",
        "data": "moringa-powder",
    },
    "black-tea": {
        "label": "NutriThrive Darjeeling black tea",
        "strong": "$7.50",
        "cta": "Shop Darjeeling tea",
        "data": "black-tea",
    },
    "curry-leaves": {
        "label": "NutriThrive dried curry leaves",
        "strong": "$7",
        "cta": "Shop curry leaves",
        "data": "curry-leaves",
    },
    "moringa-soap": {
        "label": "NutriThrive moringa soap",
        "strong": "$7",
        "cta": "Shop moringa soap",
        "data": "moringa-soap",
    },
    "gift-pack": {
        "label": "NutriThrive gift pack",
        "strong": "$35",
        "cta": "Shop gift pack",
        "data": "gift-pack",
    },
}


def shorter_meta(lede: str) -> str:
    lede_no_url = re.sub(r"\s*https://nutrithrive\.com\.au/\S+", "", lede).strip()
    sentences = re.split(r"(?<=[.!?])\s+", lede_no_url)
    meta = sentences[0]
    if len(meta) < 90 and len(sentences) > 1:
        candidate = f"{meta} {sentences[1]}"
        if len(candidate) <= 160:
            meta = candidate
    if len(meta) > 160:
        meta = meta[:157].rsplit(" ", 1)[0] + "…"
    return meta


def make_lede_html(lede: str, product_path: str) -> str:
    abs_base = f"https://nutrithrive.com.au{product_path}".rstrip("/")
    display = abs_base.replace("https://", "")
    link = f'<a href="{product_path}">{display}</a>'
    out = re.sub(re.escape(abs_base) + r"/?", link, lede, count=1)
    if link not in out:
        out = f"{lede.rstrip()} {link}"
    return out


def json_escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def parse_prompts() -> list[dict]:
    text = PROMPT.read_text()
    blocks = re.split(r"\n## \d+\. ", text)[1:]
    rows = []
    for i, block in enumerate(blocks, 1):
        url = re.search(r"^URL: (.+)$", block, re.M).group(1).strip()
        slug = url.rstrip("/").split("/")[-1]
        new_title = re.search(
            r"New title \(use the same string[^)]*\):\s*(.+)$", block, re.M
        ).group(1).strip()
        new_lede = re.search(
            r"New lede \(replace the current lede only[^)]*\):\s*(.+)$", block, re.M
        ).group(1).strip()
        prod_m = re.search(
            r"https://nutrithrive\.com\.au(/products/[a-z0-9\-]+)/?", new_lede
        )
        if not prod_m:
            prod_m = re.search(
                r"https://nutrithrive\.com\.au(/products/[a-z0-9\-]+)/?", block
            )
        product_path = prod_m.group(1).rstrip("/") + "/"
        rows.append(
            {
                "n": i,
                "slug": slug,
                "title": new_title,
                "lede": new_lede,
                "product_path": product_path,
                "product_key": product_path.strip("/").split("/")[-1],
                "meta": shorter_meta(new_lede),
            }
        )
    return rows


def patch_file(row: dict, path: Path, breadcrumb_path: str = "blog") -> str:
    if not path.exists():
        return "MISSING FILE"

    c = path.read_text()
    original = c
    title = row["title"]
    meta = row["meta"]
    lede = make_lede_html(row["lede"], row["product_path"])
    product_path = row["product_path"]
    slug = row["slug"]
    pm = PRODUCT_META.get(row["product_key"])

    def sub1(pattern: str, value: str) -> None:
        nonlocal c
        c = re.sub(pattern, lambda m: m.group(1) + value + m.group(3), c, count=1)

    sub1(r"(<title>)(.*?)(</title>)", html_lib.escape(title))
    sub1(
        r'(<meta name="description" content=")(.*?)(">)',
        html_lib.escape(meta, quote=True),
    )
    sub1(
        r'(<meta property="og:title" content=")(.*?)(">)',
        html_lib.escape(title, quote=True),
    )
    sub1(
        r'(<meta property="og:description" content=")(.*?)(">)',
        html_lib.escape(meta, quote=True),
    )
    sub1(
        r'(<meta name="twitter:title" content=")(.*?)(">)',
        html_lib.escape(title, quote=True),
    )
    sub1(
        r'(<meta name="twitter:description" content=")(.*?)(">)',
        html_lib.escape(meta, quote=True),
    )

    art_match = re.search(
        r'(<script type="application/ld\+json">\{"@context":"https://schema.org","@type":"Article".*?</script>)',
        c,
    )
    if art_match:
        art = art_match.group(1)
        art2 = re.sub(
            r'("headline":")([^"]*)(")',
            lambda m: m.group(1) + json_escape(title) + m.group(3),
            art,
            count=1,
        )
        art2 = re.sub(
            r'("description":")([^"]*)(")',
            lambda m: m.group(1) + json_escape(meta) + m.group(3),
            art2,
            count=1,
        )
        c = c.replace(art, art2, 1)

    bc_match = re.search(
        r'(<script type="application/ld\+json">\{"@context":"https://schema.org","@type":"BreadcrumbList".*?</script>)',
        c,
    )
    if bc_match:
        bc = bc_match.group(1)
        bc2 = re.sub(
            rf'("name":")([^"]*)(","item":"https://nutrithrive\.com\.au/(?:blog|journal)/{re.escape(slug)}")',
            lambda m: m.group(1) + json_escape(title) + m.group(3),
            bc,
            count=1,
        )
        c = c.replace(bc, bc2, 1)

    c = re.sub(
        r'(<nav class="wrap crumbs"[^>]*>[\s\S]*?<span>)(.*?)(</span>)',
        lambda m: m.group(1) + html_lib.escape(title) + m.group(3),
        c,
        count=1,
    )
    c = re.sub(
        r"(<h1>)(.*?)(</h1>)",
        lambda m: m.group(1) + html_lib.escape(title) + m.group(3),
        c,
        count=1,
        flags=re.S,
    )
    c = re.sub(
        r'(<p class="lede">)(.*?)(</p>)',
        lambda m: m.group(1) + lede + m.group(3),
        c,
        count=1,
        flags=re.S,
    )

    if pm:
        compact_strong = {
            "moringa-powder": "Moringa Powder · 100g $11 · 200g $21.50 · 400g $35",
            "black-tea": "Darjeeling Black Tea · $7.50",
            "curry-leaves": "Dried Curry Leaves · $7",
            "moringa-soap": "Moringa Soap · $7",
            "gift-pack": "Gift Pack · $35",
        }
        aside_m = re.search(
            r'[ \t]*<aside class="article-quick-product"[\s\S]*?</aside>', c
        )
        if aside_m:
            old_aside = aside_m.group(0)
            was_rich = (
                "Free AU shipping" in old_aside
                or 'aria-label="NutriThrive' in old_aside
                or "\n            <div>\n" in old_aside
            )
            if was_rich:
                new_aside = (
                    f'          <aside class="article-quick-product" aria-label="{pm["label"]} prices">\n'
                    f"            <div>\n"
                    f"              <span>{pm['label']}</span>\n"
                    f"              <strong>{pm['strong']}</strong>\n"
                    f"              <p>Free AU shipping starts at $79. Orders packed in Truganina, Melbourne.</p>\n"
                    f"            </div>\n"
                    f'            <a href="{product_path}" data-funnel-event="article_early_product_click" '
                    f'data-article="{slug}" data-product="{pm["data"]}">{pm["cta"]}</a>\n'
                    f"          </aside>"
                )
            else:
                new_aside = (
                    '          <aside class="article-quick-product" aria-label="Related NutriThrive product">\n'
                    f'            <div><span>Related product</span><strong>{compact_strong[row["product_key"]]}</strong></div>\n'
                    f'            <a href="{product_path}" data-funnel-event="article_early_product_click" '
                    f'data-article="{slug}" data-product="{pm["data"]}">{pm["cta"]}</a>\n'
                    f"          </aside>"
                )
            c = c[: aside_m.start()] + new_aside + c[aside_m.end() :]
        else:
            # Insert quick-product after lede when missing
            new_aside = (
                '          <aside class="article-quick-product" aria-label="Related NutriThrive product">\n'
                f'            <div><span>Related product</span><strong>{compact_strong[row["product_key"]]}</strong></div>\n'
                f'            <a href="{product_path}" data-funnel-event="article_early_product_click" '
                f'data-article="{slug}" data-product="{pm["data"]}">{pm["cta"]}</a>\n'
                f"          </aside>\n"
            )
            c = re.sub(
                r'(<p class="lede">.*?</p>\n)',
                lambda m: m.group(1) + new_aside,
                c,
                count=1,
                flags=re.S,
            )

    if c == original:
        return "NO CHANGE"
    path.write_text(c)
    return "OK"


STOREFRONT_JOURNAL = Path(__file__).resolve().parents[1] / "storefront/journal"


def main() -> None:
    rows = parse_prompts()
    results = []
    for row in rows:
        site_path = SITE_BLOG / f"{row['slug']}.html"
        sf_path = STOREFRONT_JOURNAL / row["slug"] / "index.html"
        site_status = patch_file(row, site_path, "blog")
        sf_status = patch_file(row, sf_path, "journal")
        results.append((row["n"], row["slug"], site_status, sf_status, row["title"]))

    site_ok = sum(1 for r in results if r[2] == "OK")
    sf_ok = sum(1 for r in results if r[3] == "OK")
    print(f"site updated {site_ok}/{len(results)}; storefront updated {sf_ok}/{len(results)}")
    for r in results:
        if r[2] not in ("OK", "NO CHANGE") or r[3] not in ("OK", "NO CHANGE"):
            print("!", r[0], r[1], "site="+r[2], "sf="+r[3])

    # Verify site fully matches
    from html import unescape

    fails = 0
    for row in rows:
        t = (SITE_BLOG / f"{row['slug']}.html").read_text()
        title = unescape(re.search(r"<title>(.*?)</title>", t).group(1))
        h1 = unescape(re.search(r"<h1>(.*?)</h1>", t, re.S).group(1))
        lede = re.search(r'<p class="lede">(.*?)</p>', t, re.S).group(1)
        exp = make_lede_html(row["lede"], row["product_path"])
        if title != row["title"] or h1 != row["title"] or lede != exp:
            fails += 1
            print("VERIFY FAIL", row["n"], row["slug"])
            print("  title", title)
            print("  expect", row["title"])
    print(f"site verify fails: {fails}/{len(rows)}")


if __name__ == "__main__":
    main()
