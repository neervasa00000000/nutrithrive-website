#!/usr/bin/env python3
"""Refresh the live Chemist Warehouse capsules URL from the Gork_bot draft.

Keeps /blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025.
Does not publish a new slug.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

import mistune

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
MD_PATH = ROOT / "Gork_bot/2026-09-02-moringa-chemist-warehouse-vs-nutrithrive-powder.md"
OUT = SITE / "blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025.html"

SLUG = "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025"
URL = f"https://nutrithrive.com.au/blog/{SLUG}"
TITLE = "Moringa Chemist Warehouse: Capsules vs Powder 2026"
H1 = "Moringa Chemist Warehouse: Capsules vs Truganina Powder"
META = (
    "Searching moringa chemist warehouse? CW lists Forest Super Foods 120 caps "
    "at $79. I pack shade-dried powder from $11/100g with an NMI PDF in Truganina."
)
DATE = "2026-09-02"
DATE_DISPLAY = "2 Sep 2026"
CATEGORY = "Comparison"
HERO = "/assets/images/blog/moringa-chemist-warehouse-vs-nutrithrive-hero.jpg"

assert len(TITLE) == 50, len(TITLE)
assert len(H1) == 55, len(H1)
assert len(META) == 151, len(META)

FAQS = [
    (
        "Does Chemist Warehouse sell moringa?",
        "Yes. The live online listing I opened on 2 Sep 2026 is Forest Super Foods Pure Organic Moringa 120 Capsules at $79. In-store ranges can differ by location. Loose bulk powder is uncommon on CW shelves.",
    ),
    (
        "How much is Chemist Warehouse moringa right now?",
        "$79.00 for that 120-capsule Forest Super Foods listing (verified morning of 2 Sep 2026). Forest Super Foods is the seller. Re-check the live page and checkout postage.",
    ),
    (
        "Is Chemist Warehouse moringa powder or capsules?",
        "Capsules on the listing I verified. Each capsule is 500 mg leaf; serve is 4 capsules / 2000 mg. If you want loose powder, you are usually shopping online specialists, including NutriThrive.",
    ),
    (
        "Forest Super Foods vs NutriThrive — what's the real difference?",
        "Format and channel first. They sell organic-certified capsules via the CW marketplace page. I sell non-organic-certified loose powder packed in Truganina with a public lab summary PDF. Per 100 g, powder is far cheaper; capsules win on convenience and their organic claim.",
    ),
    (
        "What's in NutriThrive moringa powder?",
        "100% moringa leaf powder. No fillers or blends. Grown on our farm, shade-dried as part of our production process, Australian lab tested, packed in Truganina.",
    ),
    (
        "Is NutriThrive certified organic?",
        "No. We don't claim certified organic. If that badge is required, buy a certified product (Forest Super Foods lists organic on the CW page) and skip us.",
    ),
    (
        "How much is NutriThrive free shipping?",
        "Free standard Australia-wide shipping from $49. Worldwide free from $90. A single $11 pouch sits under the threshold unless you add more or pick up.",
    ),
    (
        "If I order today, when does it leave Truganina?",
        "Order before 2pm Monday–Friday for same-day Melbourne dispatch when I can turn it around. After 2pm or on weekends: next business day. No Sunday dispatch. Typical metro after dispatch: Melbourne 1–3 days; other metro 3–4; some rural up to 10.",
    ),
    (
        "Does Chemist Warehouse sell loose moringa powder?",
        "Rarely as a reliable national loose-powder staple. Capsule SKUs dominate the CW moringa search path. For powder, compare online sellers with public testing info.",
    ),
    (
        "Capsules or powder — which is better value?",
        "On $/gram of leaf, powder usually wins. On convenience and no taste, capsules win. Run your own maths with pack price divided by grams in the bottle. For my sizes: $11 / 100 g, $21.50 / 200 g, $35 / 400 g.",
    ),
    (
        "What does the NMI PDF cover?",
        "A customer-facing summary of Australian testing for a named batch (example NT042024 / RN1453596). Food-quality information — not a medicine claim.",
    ),
]

QUICK_HTML = (
    "<strong>Does Chemist Warehouse sell moringa?</strong> Yes — mainly as "
    "<strong>capsules</strong>, not bulk loose powder. The live listing I opened "
    "this morning (2 Sep 2026) is Forest Super Foods Pure Organic Moringa "
    "<strong>120 capsules at $79.00</strong> (4 caps / 2000 mg, about 30 serves). "
    "I pack shade-dried <strong>100% leaf powder from $11 / 100 g</strong> in "
    "Truganina with an NMI PDF. Free AU shipping from <strong>$49</strong>."
)

BODY_TAIL = """
<p ><em>Written by Neer. NutriThrive Australia.</em></p>
<p class="nt-disclaimer"><em>These statements have not been evaluated by the TGA. This content is general information only, not medical advice. Food products are not intended to diagnose, treat, cure, or prevent any disease. Prices and stock checked 2 September 2026; re-verify live pages before purchase. NutriThrive ABN 32 639 442 616 · 15 Europe Street, Truganina VIC 3029 · nutrithrive0@gmail.com · +61 438 201 419.</em></p>

<div class="nt-article-cta">
<h3>Order shade-dried moringa — $11 / 100g</h3>
<p>One leaf, packed in Truganina. Free AU shipping from $49, or pickup by arrangement. Same-day weekday dispatch before 2pm. NMI summary on the product page.</p>
<div class="btn-row">
<a class="btn-solid" href="/products/moringa-powder/">Shop moringa powder — $11</a>
<a class="btn-outline" href="/shipping">Shipping &amp; returns</a>
</div>
</div>

<p ><a href="/blog/">&larr; Back to all articles</a></p>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul>
<li><strong>2 Sep 2026:</strong> Capsule vs powder refresh on this same URL. Live Forest Super Foods 120-cap Chemist Warehouse listing at $79. NutriThrive powder from $11/100g. Free AU shipping from $49.</li>
<li><strong>Earlier 2026:</strong> This URL previously covered in-store Rosabella and Indus Farms capsule checks. Those brands can still appear on shelves; the <a href="/blog/rosabella-moringa-reviews-legit-or-overhyped-2026">Rosabella review</a> stays the deep dive.</li>
</ul>
</div>
<section class="nt-related-links-block">
<h2>Keep going</h2>
<ul>
<li><strong>This is not:</strong> <a href="/blog/chemist-warehouse-greens-vs-moringa-powder-2026">Chemist Warehouse greens vs $11 moringa</a></li>
<li><a href="/blog/moringa-capsules-vs-powder-which-is-better-2026">Powder vs capsules, format guide</a></li>
<li><a href="/blog/how-to-choose-moringa-powder-australia-2026">How to choose moringa powder in Australia</a></li>
<li><a href="/blog/what-does-moringa-powder-taste-like-honest-guide-2026">Does moringa powder taste bad?</a></li>
<li><a href="/blog/moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026">How to read a moringa lab report</a></li>
<li><a href="/blog/rosabella-moringa-reviews-legit-or-overhyped-2026">Rosabella review (older CW shelf brand)</a></li>
<li><a href="/products/moringa-powder/">Shop moringa powder</a></li>
</ul>
</section>
"""

RELATED_NAV = (
    "<ul>"
    '<li><a href="/blog/chemist-warehouse-greens-vs-moringa-powder-2026">Chemist Warehouse Greens vs $11 Moringa, Australia</a></li>'
    '<li><a href="/blog/moringa-capsules-vs-powder-which-is-better-2026">Moringa Powder vs Capsules: Which Should You Buy?</a></li>'
    '<li><a href="/blog/how-to-choose-moringa-powder-australia-2026">How to Choose Moringa Powder in Australia: Buyer’s Guide</a></li>'
    "</ul>"
)


def load_body_md() -> str:
    raw = MD_PATH.read_text(encoding="utf-8")
    if raw.startswith("---"):
        raw = raw.split("---", 2)[2]
    raw = re.sub(r"^# .+\n+", "", raw.strip() + "\n", count=1)
    # Answer box is rendered separately.
    raw = re.sub(
        r"## Quick answer \(first screen\)\n\n.*?(?=\n## )",
        "",
        raw,
        count=1,
        flags=re.S,
    )
    # Live check: Forest Super Foods seller copy currently claims AusPost Express /
    # free shipping. Don't assert a mystery extra fee.
    raw = raw.replace(
        "Sold and delivered by Forest Super Foods; separate delivery may apply; listed as online-only",
        "Sold and delivered by Forest Super Foods; listed as online-only; their seller copy currently advertises AusPost Express",
    )
    raw = raw.replace(
        "CW's Forest Super Foods listing notes separate delivery may apply for that seller. Factor that into any \"pharmacy feels free\" assumption.",
        "CW's Forest Super Foods listing is sold and delivered by that seller, not picked up from a CW aisle. Their copy currently advertises AusPost Express and claims free shipping — re-check the live checkout, because marketplace postage can change. This is not the same as grabbing a bottle at a pharmacy counter.",
    )
    raw = raw.replace(
        "Separate seller delivery charges may apply. Always re-check the live page.",
        "Forest Super Foods is the seller. Their listing currently claims free AusPost Express — always re-check the live page and checkout.",
    )
    raw = raw.replace(
        "(noting this SKU is sold/delivered by Forest Super Foods online)",
        "(noting this SKU is sold and delivered by Forest Super Foods online, not from a CW warehouse shelf)",
    )
    if "## FAQ" in raw:
        head, faq = raw.split("## FAQ", 1)
        faq = re.sub(r"\*\*(.+?)\*\*\n", r"### \1\n", faq)
        raw = head + "## FAQ" + faq
    return raw


def md_to_html(md: str) -> str:
    html = mistune.html(md.strip() + "\n")
    html = html.replace("https://nutrithrive.com.au", "")
    html = html.replace("<table>", '<div class="table-scroll"><table class="nt-comparison-table">')
    html = html.replace(
        "<p>From the live <a href=\"/products/moringa-powder/\">moringa powder PDP</a> today:</p>",
        """<p>From the live <a href="/products/moringa-powder/">moringa powder PDP</a> today. Live sizes:</p>
<div class="table-scroll"><table class="nt-comparison-table">
<thead>
<tr>
  <th>Size</th>
  <th>Price</th>
  <th>Per 100 g</th>
</tr>
</thead>
<tbody>
<tr>
  <td>100 g</td>
  <td><strong>$11.00</strong></td>
  <td>$11.00</td>
</tr>
<tr>
  <td>200 g</td>
  <td><strong>$21.50</strong></td>
  <td>$10.75</td>
</tr>
<tr>
  <td>400 g</td>
  <td><strong>$35.00</strong></td>
  <td>$8.75</td>
</tr>
</tbody>
</table></div>
<p>In stock. Same-day weekday dispatch before <strong>2pm</strong>. Free Australia-wide standard shipping on orders <strong>$49 and over</strong>. NutriThrive is <strong>not</strong> certified organic.</p>""",
    )
    html = html.replace("</table>", "</table></div>")
    html = html.replace(
        '<p><strong>Mid CTA:</strong> <a href="/products/moringa-powder/">Shop NutriThrive moringa powder →</a></p>',
        '<div class="btn-row"><a class="btn-solid" href="/products/moringa-powder/">Shop NutriThrive moringa powder →</a></div>',
    )
    html = html.replace(
        '<p><strong>Final CTA:</strong> <a href="/products/moringa-powder/">Order moringa powder — packed in Truganina →</a></p>',
        '<div class="btn-row"><a class="btn-solid" href="/products/moringa-powder/">Order moringa powder — packed in Truganina →</a></div>',
    )
    # Drop the markdown footer; BODY_TAIL has the legal line.
    html = re.sub(
        r"<hr>\s*<p><em>General shopping information only.*?</em></p>\s*",
        "",
        html,
        flags=re.S,
    )
    return html


def wrap_answer_box(html: str) -> str:
    box = (
        '<div class="answer-box">\n'
        "<h2>Quick Answer</h2>\n"
        f'<p style="margin:0;">{QUICK_HTML}</p>\n'
        "</div>\n"
        '<p class="notice"><strong>Disclosure:</strong> I sell the $11 bag. '
        "Forest Super Foods sells the Chemist Warehouse capsule listing. "
        "This is a format and price walk-through, not a cure pitch.</p>\n"
    )
    return box + html


def faq_jsonld() -> str:
    data = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": a},
            }
            for q, a in FAQS
        ],
    }
    return json.dumps(data, ensure_ascii=False, separators=(",", ":"))


def article_jsonld() -> str:
    data = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": TITLE,
        "description": META,
        "image": [f"https://nutrithrive.com.au{HERO}"],
        "mainEntityOfPage": {"@type": "WebPage", "@id": URL},
        "author": {"@type": "Person", "name": "Neer Vasa"},
        "publisher": {"@id": "https://nutrithrive.com.au/#localbusiness"},
        "articleSection": CATEGORY,
        "inLanguage": "en-AU",
        "dateModified": DATE,
    }
    return json.dumps(data, ensure_ascii=False, separators=(",", ":"))


def breadcrumb_jsonld() -> str:
    data = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://nutrithrive.com.au/"},
            {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://nutrithrive.com.au/blog"},
            {"@type": "ListItem", "position": 3, "name": TITLE, "item": URL},
        ],
    }
    return json.dumps(data, ensure_ascii=False, separators=(",", ":"))


def replace_attr_content(html: str, attr: str, value: str, name: str) -> str:
    pattern = rf'(<meta[^>]*{attr}="{name}"[^>]*content=")([^"]*)(")'
    html, n = re.subn(pattern, rf"\1{re.escape(value).replace('\\', '\\\\')}\3", html, count=1)
    if n:
        return html
    pattern = rf'(<meta[^>]*content=")([^"]*)("[^>]*{attr}="{name}")'
    html, n = re.subn(pattern, rf"\1{value}\3", html, count=1)
    return html


def patch_article(html: str, prose: str) -> str:
    def sub_once(pattern: str, repl: str, flags: int = 0) -> None:
        nonlocal html
        html, n = re.subn(pattern, repl, html, count=1, flags=flags)
        if n != 1:
            raise SystemExit(f"Failed to patch once: {pattern[:80]!r} ({n})")

    sub_once(r"<title>[^<]*</title>", f"<title>{TITLE}</title>")
    sub_once(
        r'(<meta name="description" content=")[^"]*(")',
        rf"\1{META}\2",
    )
    for prop in ("og:title", "og:image:alt", "twitter:title"):
        html = re.sub(
            rf'(<meta[^>]*(?:property|name)="{prop}"[^>]*content=")[^"]*(")',
            rf"\1{TITLE}\2",
            html,
            count=1,
        )
    html = re.sub(
        r'(<meta property="og:description" content=")[^"]*(")',
        rf"\1{META}\2",
        html,
        count=1,
    )
    html = re.sub(
        r'(<meta name="twitter:description" content=")[^"]*(")',
        rf"\1{META}\2",
        html,
        count=1,
    )
    sub_once(
        r'(<meta property="article:section" content=")[^"]*(")',
        rf"\1{CATEGORY}\2",
    )
    html = re.sub(
        r'\n  <script type="application/ld\+json">\{"@context":"https://schema.org","@type":"FAQPage".*?</script>',
        "",
        html,
        count=1,
    )
    sub_once(
        r'<script type="application/ld\+json">\{"@context":"https://schema.org","@type":"Article".*?</script>',
        f'<script type="application/ld+json">{article_jsonld()}</script>',
    )
    sub_once(
        r'<script type="application/ld\+json">\{"@context":"https://schema.org","@type":"BreadcrumbList".*?</script>',
        f'<script type="application/ld+json">{breadcrumb_jsonld()}</script>\n  <script type="application/ld+json">{faq_jsonld()}</script>',
    )
    sub_once(
        r'(<nav class="wrap crumbs" aria-label="Breadcrumb">\s*<a href="/">Home</a> / <a href="/blog/">Blog</a> / <span>)[^<]*(</span>)',
        rf"\1{TITLE}\2",
    )
    sub_once(
        r'<p class="meta-line">[^<]*</p>',
        f'<p class="meta-line">Moringa guides · Reviewed Sep 2026 · By Neer Vasa</p>',
    )
    sub_once(r"<h1>[^<]*</h1>", f"<h1>{H1}</h1>")
    sub_once(
        r'<p class="lede">[^<]*</p>',
        f'<p class="lede">{META}</p>',
    )
    sub_once(
        r'(<div class="article-hero"><img src="[^"]+" alt=")[^"]*(")',
        rf"\1{H1}\2",
    )
    prose_match = re.search(
        r'<div class="prose">[\s\S]*?</div>\s*(?=<aside class="article-safety"|<section class="article-conversion")',
        html,
    )
    if not prose_match:
        raise SystemExit("Could not find .prose block")
    html = html[: prose_match.start()] + f'<div class="prose">\n{prose}\n</div>\n          ' + html[prose_match.end() :]
    html, n = re.subn(
        r'(<nav class="article-related"[^>]*>[\s\S]*?<h2[^>]*>[\s\S]*?</h2>\s*)<ul>[\s\S]*?</ul>',
        rf"\1{RELATED_NAV}",
        html,
        count=1,
    )
    if n != 1:
        raise SystemExit(f"Failed to patch related nav ({n})")
    return html


def update_blog_articles() -> None:
    path = SITE / "shared/js/blog-articles.js"
    src = path.read_text(encoding="utf-8")
    pattern = re.compile(
        r'\{\s*"slug": "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025",[\s\S]*?\}',
        re.M,
    )
    replacement = (
        "{\n"
        f'    "slug": "{SLUG}",\n'
        f'    "title": "{TITLE}",\n'
        f'    "h1": "{H1}",\n'
        f'    "description": "{META}",\n'
        f'    "category": "{CATEGORY}",\n'
        f'    "href": "/blog/{SLUG}",\n'
        f'    "image": "{HERO}"\n'
        "  }"
    )
    src, n = pattern.subn(replacement, src, count=1)
    if n != 1:
        raise SystemExit(f"blog-articles.js replace failed ({n})")
    path.write_text(src, encoding="utf-8")
    payload = re.sub(r"^/\*\*.*?\*/\s*", "", src, count=1, flags=re.S)
    payload = payload.replace("window.NT_BLOG_ARTICLES = ", "", 1).rstrip().rstrip(";")
    articles = json.loads(payload)
    min_path = SITE / "shared/js/blog-articles.min.js"
    min_path.write_text(
        "window.NT_BLOG_ARTICLES=" + json.dumps(articles, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )


def update_search_indexes() -> None:
    new_obj = {
        "title": TITLE,
        "href": f"/blog/{SLUG}",
        "kind": CATEGORY,
        "blurb": META,
    }
    paths = [
        SITE / "assets/js/storefront/search-index.js",
        SITE / "assets/js/storefront/search-index.min.js",
        ROOT / "storefront/js/search-index.js",
    ]
    for path in paths:
        if not path.exists():
            continue
        src = path.read_text(encoding="utf-8")
        prefix = "window.NT_SEARCH = "
        if not src.startswith(prefix) and not src.startswith("window.NT_SEARCH="):
            raise SystemExit(f"Unexpected search index: {path}")
        eq = src.index("=")
        data = json.loads(src[eq + 1 :].strip().rstrip(";"))
        found = False
        for item in data:
            if item.get("href") == f"/blog/{SLUG}":
                item.update(new_obj)
                found = True
                break
        if not found:
            raise SystemExit(f"Search index missing {SLUG}: {path}")
        joiner = " = " if "NT_SEARCH = " in src else "="
        path.write_text("window.NT_SEARCH" + joiner + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")


def update_cards(path: Path) -> None:
    html = path.read_text(encoding="utf-8")
    old_title = "Chemist Warehouse Moringa: Brands, Price &amp; Lab Reality (2026)"
    old_p = "Yes, CW stocks Rosabella &amp; Indus Farms capsules. 2026 prices, dose maths, recall check, and how lab-tested powder compares."
    old_p_alt = "Yes — CW stocks Rosabella &amp; Indus Farms capsules. 2026 prices, dose maths, recall check, and how lab-tested powder compares."
    html = html.replace(old_title, TITLE)
    html = html.replace(old_p, META.replace("&", "&amp;"))
    html = html.replace(old_p_alt, META.replace("&", "&amp;"))
    # data-search-text on the CW card
    search_text = f"{TITLE} {META} {CATEGORY} moringa guides {SLUG}".lower()
    html = re.sub(
        rf'(href="/blog/{SLUG}"[^>]*data-search-text=")[^"]*(")',
        rf"\1{search_text}\2",
        html,
        count=1,
    )
    html = html.replace(
        '"name":"Chemist Warehouse Moringa: Brands, Price & Lab Reality (2026)","url":"' + URL + '"',
        f'"name":"{TITLE}","url":"{URL}"',
    )
    path.write_text(html, encoding="utf-8")


def update_misc() -> None:
    llms = SITE / "llms.txt"
    txt = llms.read_text(encoding="utf-8")
    old = "- [Chemist Warehouse moringa vs NutriThrive](https://nutrithrive.com.au/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025): Side-by-side quality test."
    new = (
        "- [Moringa Chemist Warehouse: capsules vs powder](https://nutrithrive.com.au/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025): "
        "Forest Super Foods 120 caps at $79 vs shade-dried powder from $11/100g in Truganina."
    )
    if old not in txt:
        raise SystemExit("llms.txt line not found")
    llms.write_text(txt.replace(old, new, 1), encoding="utf-8")

    sitemap = SITE / "sitemap.xml"
    sm = sitemap.read_text(encoding="utf-8")
    sm, n = re.subn(
        rf"(<loc>{re.escape(URL)}</loc>\s*<lastmod>)[^<]+",
        rf"\g<1>{DATE}",
        sm,
        count=1,
    )
    if n != 1:
        raise SystemExit(f"sitemap lastmod replace failed ({n})")
    sitemap.write_text(sm, encoding="utf-8")

    build = ROOT / "storefront/build.mjs"
    b = build.read_text(encoding="utf-8")
    old_rel = """  "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025": [
    "rosabella-moringa-reviews-legit-or-overhyped-2026",
    "moringa-brands-comparison-australia-2026",
    "how-to-choose-moringa-powder-australia-2026",
  ],"""
    new_rel = """  "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025": [
    "chemist-warehouse-greens-vs-moringa-powder-2026",
    "moringa-capsules-vs-powder-which-is-better-2026",
    "how-to-choose-moringa-powder-australia-2026",
  ],"""
    if old_rel not in b:
        raise SystemExit("CURATED_RELATED block not found")
    build.write_text(b.replace(old_rel, new_rel, 1), encoding="utf-8")

    related_json = SITE / "blog/blog-v2-related.json"
    if related_json.exists():
        rj = related_json.read_text(encoding="utf-8")
        related_json.write_text(
            rj.replace(
                '"title": "Chemist Warehouse Moringa vs NutriThrive"',
                '"title": "Moringa Chemist Warehouse: Capsules vs Powder"',
            ),
            encoding="utf-8",
        )

    # Visible related-nav titles that still quote the old SEO title.
    old_anchor = "Chemist Warehouse Moringa: Brands, Price &amp; Lab Reality (2026)"
    for rel in (
        "blog/moringa-capsules-vs-powder-which-is-better-2026.html",
        "blog/moringa-calm-mind-stress-brain-fog-cortisol-science-2026.html",
    ):
        p = SITE / rel
        t = p.read_text(encoding="utf-8")
        if old_anchor in t:
            p.write_text(t.replace(old_anchor, TITLE), encoding="utf-8")


def main() -> None:
    body_md = load_body_md()
    words = len(re.findall(r"\b[\w']+\b", body_md))
    print(f"Body word count (sans quick-answer heading): {words}")
    print(f"Title {len(TITLE)} / H1 {len(H1)} / Meta {len(META)}")

    body_html = wrap_answer_box(md_to_html(body_md)) + BODY_TAIL
    full_words = len(re.findall(r"\b[\w']+\b", re.sub(r"<[^>]+>", " ", body_html)))
    print(f"Prose word count: {full_words}")

    html = OUT.read_text(encoding="utf-8")
    OUT.write_text(patch_article(html, body_html), encoding="utf-8")
    print(f"Wrote {OUT.relative_to(ROOT)}")

    update_blog_articles()
    update_search_indexes()
    update_cards(SITE / "blog/index.html")
    update_cards(SITE / "blog/category/moringa-guides/index.html")
    update_misc()
    print("Updated catalog, index, search, sitemap, related links.")


if __name__ == "__main__":
    main()
