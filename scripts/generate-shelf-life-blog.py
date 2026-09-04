#!/usr/bin/env python3
"""Refresh the live shelf-life URL from the Gork_bot draft.

Keeps /blog/how-long-does-moringa-powder-last-storage-shelf-life-2026.
Does not publish a new slug.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

import mistune

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
MD_PATH = ROOT / "Gork_bot/2026-09-03-how-long-does-moringa-powder-last-storage-shelf-life-2026.md"
OUT = SITE / "blog/how-long-does-moringa-powder-last-storage-shelf-life-2026.html"

SLUG = "how-long-does-moringa-powder-last-storage-shelf-life-2026"
URL = f"https://nutrithrive.com.au/blog/{SLUG}"
TITLE = "How Long Does Moringa Powder Last in Australia?"
H1 = "How Long Does Moringa Powder Last After Opening?"
META = (
    "Unopened 12–24 months; opened use within 18 months if sealed, cool and dry. "
    "Spring heat, fridge mistakes, and Truganina pack dates."
)
DATE = "2026-09-03"
CATEGORY = "Guides"
HERO = "/assets/images/og/moringa-article-1200.jpg"

assert len(TITLE) == 47, len(TITLE)
assert len(H1) == 48, len(H1)
assert len(META) == 131, len(META)

FAQS = [
    (
        "How long does moringa powder last?",
        "Unopened in a cool, dark, dry place: 12–24 months from pack date. Opened and resealed: follow use within 18 months on our live product page; best colour and taste often sit in the first 6–12 months if you keep heat and moisture out.",
    ),
    (
        "Does moringa powder expire?",
        "Best-before is mainly a quality guide for dry leaf powder. Replace sooner if the powder is brown, musty, clumped hard, or mouldy.",
    ),
    (
        "How long does it last after opening?",
        "Up to 18 months if sealed and dry, per our live PDP. Peak green usually fades earlier if the bag sits warm or open. Write the open date on the pouch.",
    ),
    (
        "Should I refrigerate moringa powder?",
        "No. Condensation clumps powder and can invite mould. Dark pantry at room temperature is correct for Australian homes.",
    ),
    (
        "Does freezing help?",
        "Only for sealed bulk you will not open for months. For a 100 g pouch you use in weeks, the pantry is simpler.",
    ),
    (
        "How do I know if it has gone bad?",
        "Dull brown-yellow colour, musty or mouldy smell, damp hard clumps, or visible mould. Harsh stale bitterness versus the day you opened it is a quality warning even without mould.",
    ),
    (
        "How long does a 100 g bag last at a teaspoon a day?",
        "About a month at ~3 g per day. Daily users rarely hit the upper shelf-life limit.",
    ),
    (
        "What does NutriThrive put on the pack / PDP for storage?",
        "Store sealed, dry, away from humidity. Use within 18 months after opening. Live sizes today: $11 / 100 g, $21.50 / 200 g, $35 / 400 g.",
    ),
    (
        "Where is it packed?",
        "Truganina / Melbourne. Grown on our farm; shade-dried as part of production; Australian testing information linked on the product page.",
    ),
    (
        "When is shipping free?",
        "Free Australia-wide standard shipping on orders $49 and over, per the live site today.",
    ),
    (
        "Is NutriThrive certified organic?",
        "No. We publish Australian testing information and a single-ingredient leaf powder. Organic certification is a separate claim some pharmacy brands carry.",
    ),
    (
        "Capsule vs powder for storage?",
        "Capsules are pre-portioned bottles with their own label rules. Loose powder needs a sealed pouch and a dry spoon.",
    ),
]

QUICK_HTML = (
    "<strong>Unopened,</strong> cool, dark and dry: <strong>12–24 months</strong> from pack date. "
    "<strong>Opened</strong> and resealed: <strong>use within 18 months</strong> (live PDP). "
    "Best colour and taste often sit in the first <strong>6–12 months</strong>. "
    "<strong>Do not refrigerate</strong> — condensation clumps powder. "
    "A 100 g pouch at about a teaspoon a day lasts roughly a month."
)

RELATED_NAV = (
    "<ul>"
    '<li><a href="/blog/how-to-choose-moringa-powder-australia-2026">How to Choose Moringa Powder in Australia: Buyer’s Guide</a></li>'
    '<li><a href="/blog/how-to-read-moringa-batch-codes-freshness">How to Read a Moringa Batch Code</a></li>'
    '<li><a href="/blog/what-does-moringa-powder-taste-like-honest-guide-2026">Does Moringa Powder Taste Bad? What It Actually Tastes Like</a></li>'
    "</ul>"
)

BODY_TAIL = """
<p class="nt-disclaimer"><em>These statements have not been evaluated by the TGA. This content is general food-storage information only, not medical advice. Food products are not intended to diagnose, treat, cure, or prevent any disease. Guidance dated 3 September 2026; re-check the live product page. NutriThrive ABN 32 639 442 616 · 15 Europe Street, Truganina VIC 3029 · nutrithrive0@gmail.com · +61 438 201 419.</em></p>

<div class="nt-article-cta">
<h3>Fresh shade-dried powder — from $11 / 100g</h3>
<p>100% leaf, packed in Truganina. Use within 18 months after opening if you keep it sealed, cool and dry. Same-day weekday dispatch before 2pm. Free AU shipping from $49.</p>
<div class="btn-row">
<a class="btn-solid" href="/products/moringa-powder/">Shop moringa powder — $11</a>
<a class="btn-outline" href="/shipping">Shipping &amp; returns</a>
</div>
</div>

<p ><a href="/blog/">&larr; Back to all articles</a></p>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul>
<li><strong>3 Sep 2026:</strong> Shelf-life refresh on this same URL. Opened window aligned to the live PDP (use within 18 months). Australian spring heat, fridge condensation, pack dates from Truganina. Free AU shipping from $49.</li>
<li><strong>Earlier 2026:</strong> This URL previously used a 6–12 month opened window as the main number. Peak green still often sits in that first stretch; the pack rule is 18 months if sealed and dry.</li>
</ul>
</div>
<section class="nt-related-links-block">
<h2>Keep going</h2>
<ul>
<li><a href="/blog/how-to-choose-moringa-powder-australia-2026">How to choose moringa powder in Australia</a></li>
<li><a href="/blog/how-to-read-moringa-batch-codes-freshness">How to read a moringa batch code</a></li>
<li><a href="/blog/what-does-moringa-powder-taste-like-honest-guide-2026">What moringa powder tastes like</a></li>
<li><a href="/blog/science-shade-drying-vs-sun-drying-moringa">Shade-dried vs sun-dried</a></li>
<li><a href="/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025">Chemist Warehouse capsules vs Truganina powder</a></li>
<li><a href="/products/moringa-powder/">Shop moringa powder</a></li>
</ul>
</section>
"""

OLD_TITLES = [
    "How Long Does Moringa Powder Last? 12 to 24 Months Shelf Life Guide (2026)",
    "How Long Does Moringa Powder Last? 12–24 Months (Does It Expire?)",
    "How Long Does Moringa Powder Last? 12-24 Months (Does It Expire?)",
]
OLD_DESCS = [
    "Unopened: 12–24 months. Opened: 6–12 months if cool, dark, dry. Fridge tip, spoilage signs, and Australian heat storage advice.",
    "Unopened: 12 to 24 months. Opened: 6 to 12 months if cool, dark, dry. Fridge tip, spoilage signs, and Australian heat storage advice.",
]


def load_body_md() -> str:
    raw = MD_PATH.read_text(encoding="utf-8")
    if raw.startswith("---"):
        raw = raw.split("---", 2)[2]
    raw = re.sub(r"^# .+\n+", "", raw.strip() + "\n", count=1)
    raw = re.sub(
        r"## Quick answer\n\n.*?(?=\n## )",
        "",
        raw,
        count=1,
        flags=re.S,
    )
    raw = raw.replace(
        " (update of existing shelf-life URL; do not publish as a new slug)",
        "",
    )
    if "## FAQ" in raw:
        head, faq = raw.split("## FAQ", 1)
        faq = re.sub(r"\*\*(.+?)\*\*[ \t]*\n", r"### \1\n", faq)
        raw = head + "## FAQ" + faq
    raw = raw.replace("/blog/how-to-add-moringa-to-diet/", "/blog/how-to-add-moringa-to-diet")
    return raw


def md_to_html(md: str) -> str:
    html = mistune.html(md.strip() + "\n")
    html = html.replace("https://nutrithrive.com.au", "")
    html = html.replace("<table>", '<div class="table-scroll"><table class="nt-comparison-table">')
    html = html.replace("</table>", "</table></div>")
    html = html.replace(
        '<p><strong>Mid CTA:</strong> If your current pouch is dull, musty, or past its useful window, compare live sizes and pack dates on <a href="/products/moringa-powder/">NutriThrive Moringa Powder</a>.</p>',
        '<div class="btn-row"><a class="btn-solid" href="/products/moringa-powder/">Compare live sizes and pack dates →</a></div>',
    )
    html = re.sub(
        r"<h2>Final CTA</h2>\s*<p>If the bag at the back of the cupboard.*?</p>\s*",
        "",
        html,
        flags=re.S,
    )
    html = re.sub(r"<hr\s*/?>\s*", "", html, count=1)
    return html


def wrap_answer_box(html: str) -> str:
    box = (
        '<div class="answer-box" id="short-answer">\n'
        "<h2>Quick Answer</h2>\n"
        f'<p style="margin:0;">{QUICK_HTML}</p>\n'
        "</div>\n"
        '<p class="notice"><strong>Food storage, not medicine.</strong> '
        "This is pantry guidance from a Truganina packer. It is not medical advice.</p>\n"
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


def patch_article(html: str, prose: str) -> str:
    def sub_once(pattern: str, repl: str) -> None:
        nonlocal html
        html, n = re.subn(pattern, repl, html, count=1)
        if n != 1:
            raise SystemExit(f"Failed to patch once: {pattern[:90]!r} ({n})")

    sub_once(r"<title>[^<]*</title>", f"<title>{TITLE}</title>")
    sub_once(r'(<meta name="description" content=")[^"]*(")', rf"\1{META}\2")
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
        '<p class="meta-line">Moringa guides · Reviewed Sep 2026 · By Neer Vasa</p>',
    )
    sub_once(r"<h1>[^<]*</h1>", f"<h1>{H1}</h1>")
    sub_once(r'<p class="lede">[^<]*</p>', f'<p class="lede">{META}</p>')
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
        rf'\{{\s*"slug": "{SLUG}",[\s\S]*?\}}',
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
    min_path = SITE / "shared/js/blog-articles.min.js"
    min_src = min_path.read_text(encoding="utf-8")
    min_obj = (
        "{"
        f'slug:"{SLUG}",'
        f'title:"{TITLE}",'
        f'h1:"{H1}",'
        f'description:{json.dumps(META, ensure_ascii=False)},'
        f'category:"{CATEGORY}",'
        f'href:"/blog/{SLUG}",'
        f'image:"{HERO}"'
        "}"
    )
    min_pat = re.compile(rf'\{{slug:"{SLUG}",.*?\}}')
    min_src, n_min = min_pat.subn(min_obj, min_src, count=1)
    if n_min != 1:
        raise SystemExit(f"blog-articles.min.js replace failed ({n_min})")
    min_path.write_text(min_src, encoding="utf-8")


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
    quoted = json.dumps(new_obj, ensure_ascii=False, separators=(",", ":"))
    unquoted = (
        f'{{title:"{TITLE}",href:"/blog/{SLUG}",kind:"{CATEGORY}",blurb:"{META}"}}'
    )
    slug_re_q = re.compile(
        rf'\{{"title":"[^"]+","href":"/blog/{SLUG}","kind":"[^"]+","blurb":"[^"]*"\}}'
    )
    slug_re_u = re.compile(
        rf'\{{title:"[^"]*",href:"/blog/{SLUG}",kind:"[^"]*",blurb:"[^"]*"\}}'
    )
    for path in paths:
        src = path.read_text(encoding="utf-8")
        if '"href":"/blog/' + SLUG + '"' in src or "href:\"/blog/" + SLUG + '"' in src:
            if slug_re_q.search(src):
                src = slug_re_q.sub(quoted, src, count=1)
            elif slug_re_u.search(src):
                src = slug_re_u.sub(unquoted, src, count=1)
            else:
                raise SystemExit(f"Could not regex-replace search index {path}")
            path.write_text(src, encoding="utf-8")
        else:
            raise SystemExit(f"Search index missing {SLUG}: {path}")


def update_cards(path: Path) -> None:
    html = path.read_text(encoding="utf-8")
    for old in OLD_TITLES:
        html = html.replace(old.replace("&", "&amp;"), TITLE)
        html = html.replace(old, TITLE)
    for old in OLD_DESCS:
        html = html.replace(old.replace("&", "&amp;"), META)
        html = html.replace(old, META)
    search_text = f"{TITLE} {META} {CATEGORY} moringa guides {SLUG}".lower()
    html, n_st = re.subn(
        rf'(href="/blog/{SLUG}"[^>]*data-search-text=")[^"]*(")',
        rf"\1{search_text}\2",
        html,
        count=1,
    )
    if n_st != 1:
        raise SystemExit(f"search-text replace failed in {path} ({n_st})")
    for old in OLD_TITLES:
        html = html.replace(f'"name":"{old}","url":"{URL}"', f'"name":"{TITLE}","url":"{URL}"')
    path.write_text(html, encoding="utf-8")


def update_misc() -> None:
    llms = SITE / "llms.txt"
    txt = llms.read_text(encoding="utf-8")
    old = (
        "- [How long does moringa powder last?](https://nutrithrive.com.au/blog/"
        "how-long-does-moringa-powder-last-storage-shelf-life-2026): "
        "Shelf life, pantry storage, why not to refrigerate, and signs it's time to replace a bag."
    )
    new = (
        "- [How long does moringa powder last in Australia?](https://nutrithrive.com.au/blog/"
        "how-long-does-moringa-powder-last-storage-shelf-life-2026): "
        "Unopened 12–24 months; opened use within 18 months if sealed, cool and dry. "
        "Spring heat, fridge mistakes, Truganina pack dates."
    )
    if new not in txt:
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

    old_anchor = "How Long Does Moringa Powder Last? 12 to 24 Months Shelf Life Guide (2026)"
    for rel in (
        "blog/gut-brain-connection-digestion-mood-mental-health-2026.html",
        "blog/moringa-gut-health-digestion-evidence-2026.html",
        "blog/how-to-choose-moringa-powder-australia-2026.html",
        "blog/moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026.html",
    ):
        p = SITE / rel
        t = p.read_text(encoding="utf-8")
        if old_anchor in t:
            p.write_text(t.replace(old_anchor, TITLE), encoding="utf-8")


def main() -> None:
    body_md = load_body_md()
    words = len(re.findall(r"\b[\w']+\b", body_md))
    print(f"Body word count (sans quick-answer table): {words}")
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
