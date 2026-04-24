#!/usr/bin/env python3
"""Parse Firecrawl crawl JSON into per-page records (run from Website root)."""
import json
import re
import html as htmlmod
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CRAWL = ROOT / ".firecrawl" / "crawl-50-nutrithrive.json"

HEADING_MD = re.compile(r"^(#{1,3})\s+(.+)$", re.M)


def strip_tags(s: str) -> str:
    if not s:
        return ""
    s = re.sub(r"<script[^>]*>.*?</script>", " ", s, flags=re.S | re.I)
    s = re.sub(r"<style[^>]*>.*?</style>", " ", s, flags=re.S | re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", htmlmod.unescape(s)).strip()


def from_html_body(h: str) -> dict:
    if not h:
        return {}
    h1 = re.findall(r"<h1[^>]*>(.*?)</h1>", h, re.S | re.I)
    h1 = [strip_tags(x) for x in h1]
    h2 = re.findall(r"<h2[^>]*>(.*?)</h2>", h, re.S | re.I)
    h2 = [strip_tags(x) for x in h2[:35]]
    h3 = re.findall(r"<h3[^>]*>(.*?)</h3>", h, re.S | re.I)
    h3 = [strip_tags(x) for x in h3[:45]]
    imgs = re.findall(r"<img[^>]+>", h, re.I)
    img_info = []
    for tag in imgs[:100]:
        src_m = re.search(r'src=["\']([^"\']+)["\']', tag, re.I)
        alt_m = re.search(r'alt=["\']([^"\']*)["\']', tag, re.I)
        loading_m = re.search(r'loading=["\']([^"\']*)["\']', tag, re.I)
        src = src_m.group(1) if src_m else ""
        alt = alt_m.group(1) if alt_m else None
        img_info.append(
            {
                "src": src[:140],
                "alt": alt,
                "missing_alt": alt is None,
                "empty_alt": alt == "",
                "loading": loading_m.group(1) if loading_m else None,
            }
        )
    intlinks = re.findall(
        r'href=["\'](https://nutrithrive\.com\.au[^"\']*)["\']', h, re.I
    )
    intlinks = list(dict.fromkeys(intlinks))[:80]
    ld = re.findall(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        h,
        re.S | re.I,
    )
    schema_types: list = []
    for block in ld[:20]:
        block = block.strip()
        if not block:
            continue
        try:
            j = json.loads(block)
            objs = j if isinstance(j, list) else [j]
            for o in objs:
                if isinstance(o, dict) and "@type" in o:
                    t = o["@type"]
                    schema_types.append(t if isinstance(t, str) else str(t))
        except json.JSONDecodeError:
            pass
    wc = len(strip_tags(h).split())
    return {
        "h1_html": h1,
        "h2_html": h2,
        "h3_html": h3,
        "word_count_html": wc,
        "images": img_info,
        "image_tags_count": len(imgs),
        "internal_links": intlinks,
        "json_ld_types": list(dict.fromkeys(schema_types)),
    }


def from_markdown(md: str) -> dict:
    h1, h2, h3 = [], [], []
    for m in HEADING_MD.finditer(md or ""):
        level, text = m.group(1), m.group(2).strip()
        if level == "#":
            h1.append(text)
        elif level == "##":
            h2.append(text)
        elif level == "###":
            h3.append(text)
    plain = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", md or "")
    plain = re.sub(r"[`#*>\-\|]", " ", plain)
    wc = len(plain.split())
    return {"h1_md": h1, "h2_md": h2, "h3_md": h3, "word_count_md": wc}


def main() -> list[dict]:
    data = json.loads(CRAWL.read_text(encoding="utf-8"))
    items = data.get("data", [])
    out: list[dict] = []
    for it in items:
        m = it.get("metadata") or {}
        url = m.get("url") or m.get("sourceURL") or ""
        title = (m.get("title") or "").strip()
        desc = (m.get("description") or "").strip()
        og = (m.get("ogUrl") or m.get("og:url") or "").strip()
        tw = (m.get("twitter:url") or "").strip()
        html_part = it.get("html") or ""
        md = it.get("markdown") or ""
        ex = from_html_body(html_part)
        mdx = from_markdown(md)
        h1 = ex.get("h1_html") or mdx.get("h1_md") or []
        h2 = ex.get("h2_html") or mdx.get("h2_md") or []
        h3 = ex.get("h3_html") or mdx.get("h3_md") or []
        canonical = og or tw or (url.rstrip("/") if url else "")
        out.append(
            {
                "url": url,
                "title": title,
                "meta_description": desc,
                "canonical_suggested": canonical,
                "h1": h1,
                "h2": h2[:25],
                "h3": h3[:20],
                "h1_count": len(h1),
                "word_count": max(
                    ex.get("word_count_html") or 0, mdx.get("word_count_md") or 0
                ),
                "word_count_html": ex.get("word_count_html", 0),
                "word_count_md": mdx.get("word_count_md", 0),
                "images": ex.get("images", []),
                "image_tags_count": ex.get("image_tags_count", 0),
                "images_missing_alt": sum(
                    1 for i in ex.get("images", []) if i.get("missing_alt")
                ),
                "internal_links": ex.get("internal_links", []),
                "json_ld_types": ex.get("json_ld_types", []),
            }
        )
    return out


if __name__ == "__main__":
    r = main()
    print(json.dumps(r[:2], indent=2)[:2000])
    print("… total", len(r))
