#!/usr/bin/env python3
"""Apply moringa SEO rewrites for blog posts 3–5 (capsules, brands, price)."""
from __future__ import annotations

import importlib.util
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
BASE = "https://nutrithrive.com.au"
DATE_MODIFIED = "2026-10-06"

_spec = importlib.util.spec_from_file_location(
    "rw13", ROOT / "scripts/apply_blog_rewrites_1_3_2026_10_05.py"
)
rw = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(rw)

faq_entity = rw.faq_entity
build_toc = rw.build_toc
load_prose = rw.load_prose
SCHEMA_ORG = rw.SCHEMA_ORG
AUTHOR = rw.AUTHOR


def schema_blocks(article: dict) -> str:
    blog = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": f"{BASE}/blog/{article['slug']}#article",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": f"{BASE}/blog/{article['slug']}",
        },
        "headline": article["schema_headline"],
        "description": article["schema_description"],
        "image": [f"{BASE}{article['hero_image']}"],
        "author": AUTHOR,
        "publisher": {"@type": "Organization", **SCHEMA_ORG},
        "datePublished": article["date_published"],
        "dateModified": DATE_MODIFIED,
        "articleSection": "Moringa",
        "inLanguage": "en-AU",
        "keywords": article["keywords"],
    }
    faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": article["faq_schema"],
    }
    crumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE}/"},
            {"@type": "ListItem", "position": 2, "name": "Blog", "item": f"{BASE}/blog/"},
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Moringa guides",
                "item": f"{BASE}/blog/category/moringa-guides/",
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": article["breadcrumb_title"],
                "item": f"{BASE}/blog/{article['slug']}",
            },
        ],
    }
    return (
        f'<script type="application/ld+json">{json.dumps(blog, ensure_ascii=False)}</script>\n  '
        f'<script type="application/ld+json">{json.dumps(faq, ensure_ascii=False)}</script>\n  '
        f'<script type="application/ld+json">{json.dumps(crumbs, ensure_ascii=False)}</script>'
    )


def build_html(article: dict, template_path: Path) -> str:
    tpl = template_path.read_text(encoding="utf-8")
    slug = article["slug"]
    url = f"{BASE}/blog/{slug}"
    prose = load_prose(article["prose_file"])

    html = tpl
    html = re.sub(r"<title>[^<]*</title>", f"<title>{article['title']}</title>", html, count=1)
    html = re.sub(
        r'<meta name="description" content="[^"]*">',
        f'<meta name="description" content="{article["meta"]}">',
        html,
        count=1,
    )
    html = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{url}">', html, count=1)
    html = re.sub(
        r'<meta property="og:url" content="[^"]*">',
        f'<meta property="og:url" content="{url}">',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta property="og:title" content="[^"]*">',
        f'<meta property="og:title" content="{article["og_title"]}">',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta property="og:description" content="[^"]*">',
        f'<meta property="og:description" content="{article["og_description"]}">',
        html,
        count=1,
    )
    hero = article["hero_image"]
    html = re.sub(
        r'<meta property="og:image" content="[^"]*">',
        f'<meta property="og:image" content="{BASE}{hero}">',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta property="og:image:secure_url" content="[^"]*">',
        f'<meta property="og:image:secure_url" content="{BASE}{hero}">',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta property="og:image:alt" content="[^"]*">',
        f'<meta property="og:image:alt" content="{article["hero_alt"]}">',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta name="twitter:title" content="[^"]*">',
        f'<meta name="twitter:title" content="{article["og_title"]}">',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta name="twitter:description" content="[^"]*">',
        f'<meta name="twitter:description" content="{article["og_description"]}">',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta name="twitter:image" content="[^"]*">',
        f'<meta name="twitter:image" content="{BASE}{hero}">',
        html,
        count=1,
    )
    html = re.sub(
        r'<link rel="alternate" hreflang="en-AU" href="[^"]*">',
        f'<link rel="alternate" hreflang="en-AU" href="{url}">',
        html,
        count=1,
    )
    html = re.sub(
        r'<link rel="alternate" hreflang="x-default" href="[^"]*">',
        f'<link rel="alternate" hreflang="x-default" href="{url}">',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta property="article:section" content="[^"]*">',
        '<meta property="article:section" content="Moringa">',
        html,
        count=1,
    )

    old_schema = re.search(
        r'<script type="application/ld\+json">\{"@context":"https://schema.org","@type":"(?:Article|BlogPosting)"[\s\S]*?</script>\s*'
        r'(?:<script type="application/ld\+json">\{"@context":"https://schema.org","@type":"FAQPage"[\s\S]*?</script>\s*)?'
        r'<script type="application/ld\+json">\{"@context":"https://schema.org","@type":"BreadcrumbList"[\s\S]*?</script>',
        html,
    )
    if not old_schema:
        raise SystemExit(f"Could not find schema block for {slug}")
    html = html[: old_schema.start()] + schema_blocks(article) + html[old_schema.end() :]

    crumb_span = article["breadcrumb_title"].replace("&", "&amp;")
    html = re.sub(
        r'<nav class="wrap crumbs" aria-label="Breadcrumb">[\s\S]*?</nav>',
        f'''<nav class="wrap crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> / <a href="/blog/">Blog</a> / <a href="/blog/category/moringa-guides/">Moringa guides</a> / <span>{crumb_span}</span>
      </nav>''',
        html,
        count=1,
    )

    html = re.sub(r'data-article-slug="[^"]*"', f'data-article-slug="{slug}"', html, count=1)
    html = re.sub(
        r'<p class="meta-line">[\s\S]*?</p>',
        f'<p class="meta-line">{article["meta_line"]}</p>',
        html,
        count=1,
    )
    html = re.sub(r"<h1>[\s\S]*?</h1>", f"<h1>{article['h1']}</h1>", html, count=1)
    html = re.sub(r'<p class="lede">[\s\S]*?</p>', f'<p class="lede">{article["lede"]}</p>', html, count=1)
    html = re.sub(
        r'(<div class="article-hero"><img src=")[^"]+(" alt=")[^"]+(" width="1200" height="675" fetchpriority="high"></div>)',
        rf"\1{hero}?v=20260915-1\2{article['hero_alt']}\3",
        html,
        count=1,
    )

    qp_label, qp_product, qp_cta, qp_kicker = article["quick_product"]
    html = re.sub(
        r'<aside class="article-quick-product"[\s\S]*?</aside>',
        f'''<aside class="article-quick-product" aria-label="Related NutriThrive product">
            <div><span>{qp_kicker}</span><strong>{qp_label}</strong></div>
            <a href="/products/{qp_product}/" data-funnel-event="article_early_product_click" data-article="{slug}" data-product="moringa-powder">{qp_cta}</a>
          </aside>''',
        html,
        count=1,
    )

    html = re.sub(
        r'<nav class="article-toc"[\s\S]*?</nav>',
        build_toc(slug, article["toc"]),
        html,
        count=1,
    )

    conv = article["conversion"]
    related_lis = "".join(f'<li><a href="{h}">{t}</a></li>' for h, t in article["related"])
    sb_title, sb_text, sb_price, sb_product, sb_cta = article["sidebar"]

    prose_block = f'<div class="prose">\n{prose}\n</div>'
    html = re.sub(
        r'<div class="prose">[\s\S]*?</div>\s*(?=<section class="article-conversion")',
        prose_block + "\n          ",
        html,
        count=1,
    )

    html = re.sub(
        r'<section class="article-conversion"[\s\S]*?</section>',
        f'''<section class="article-conversion" aria-labelledby="article-product-{slug}">
            <img src="{conv["img"]}?v=20260915-1" alt="{conv["alt"]}" width="240" height="300" loading="lazy">
            <div>
              <p class="kicker">{conv["kicker"]}</p>
              <h2 id="article-product-{slug}">{conv["h2"]}</h2>
              <p>{conv["text"]}</p>
              <p class="price">{conv["price"]}</p>
              <div class="btn-row">
                <a class="btn btn-primary" href="/products/{conv["product"]}/" data-funnel-event="article_product_click" data-article="{slug}" data-product="moringa-powder">{conv["cta"]}</a>
                <a class="btn btn-secondary" href="/shipping" data-funnel-event="article_shipping_click">Delivery &amp; returns</a>
              </div>
              {conv.get("context_links", "")}
            </div>
          </section>''',
        html,
        count=1,
    )

    html = re.sub(
        r'(<nav class="article-related"[\s\S]*?<h2[^>]*>[\s\S]*?</h2>\s*)<ul>[\s\S]*?</ul>',
        rf"\1<ul>{related_lis}</ul>",
        html,
        count=1,
    )

    html = re.sub(
        r'(<aside class="article-sidebar">[\s\S]*?<h2>)[^<]*(</h2>\s*<p>)[^<]*(</p>\s*<p class="price"[^>]*>)[^<]*(</p>\s*<a class="btn btn-primary btn-block" href="/products/)[^/]+(/"[^>]*>)[^<]*(</a>)',
        rf"\1{sb_title}\2{sb_text}\3{sb_price}\4{sb_product}\5{sb_cta}\6",
        html,
        count=1,
    )
    return html


POST3_FAQ = [
    faq_entity(
        "Which is better, moringa powder or capsules?",
        "Neither is automatically better — it is a format choice. Powder for flexible serves and lower cost per gram; capsules for taste avoidance and travel. NutriThrive sells powder only.",
    ),
    faq_entity(
        "Do you sell moringa capsules?",
        "No. Current powder sizes: 100g $14, 200g $21.50, 400g $35.",
    ),
    faq_entity(
        "How many capsules equal one teaspoon of powder?",
        "Often roughly 5 to 7 standard capsules, depending on mg per capsule. Read the label instead of guessing.",
    ),
    faq_entity(
        "Does Chemist Warehouse sell moringa powder?",
        "Most Chemist Warehouse listings are capsules or tablets, not loose powder. See our Chemist Warehouse moringa guide for what the aisle usually stocks.",
    ),
    faq_entity(
        "Where is NutriThrive lab testing published?",
        "On the moringa powder product page and in the NMI lab summary PDF.",
    ),
]

POST4_FAQ = [
    faq_entity(
        "How should I compare moringa brands in Australia?",
        "Use lab paperwork, a single-ingredient label, colour and processing claims, pack date, and price per 100g. Apply the same scorecard to every brand, including NutriThrive.",
    ),
    faq_entity(
        "Is NutriThrive moringa organic?",
        "No. We describe it as farm-grown moringa leaf. We are not ACO-certified organic.",
    ),
    faq_entity(
        "What was Costco Mai Greens priced at in October 2026?",
        "We recorded $22.99 for 500g on an in-warehouse sign on 5 Oct 2026 (about $4.60 per 100g). Confirm in your warehouse before you buy.",
    ),
    faq_entity(
        "Where do I read NutriThrive lab results?",
        "On the moringa powder product page and in the NMI lab summary PDF.",
    ),
]

POST5_FAQ = [
    faq_entity(
        "What is a fair moringa powder price in Australia?",
        "Compare price per 100g on dated list prices, then check label, dates, and lab paperwork. Bulk warehouse bags can be a few dollars per 100g; small boutique pouches can be $12–$25 per 100g depending on channel.",
    ),
    faq_entity(
        "Why is pharmacy moringa more expensive per 100g?",
        "Retail pharmacy listings often include distribution and shelf costs in the consumer price. That is a channel difference, not proof the leaf inside cost more to produce.",
    ),
    faq_entity(
        "What are NutriThrive’s current powder prices?",
        "100g $14, 200g $21.50, 400g $35 as of 6 Oct 2026 on nutrithrive.com.au.",
    ),
    faq_entity(
        "Where can I read NutriThrive lab paperwork?",
        "On the moringa powder product page and in the NMI lab summary PDF.",
    ),
    faq_entity(
        "Does a higher price mean better moringa?",
        "Not automatically. Compare price per 100g, then verify ingredient, dates, and any published test summary for the lot you might buy.",
    ),
]

COMMON_QP = (
    "Moringa Powder · 100g $14 · 200g $21.50 · 400g $35",
    "moringa-powder",
    "Shop moringa powder",
    "Related product",
)

ARTICLES = [
    {
        "slug": "moringa-capsules-vs-powder-which-is-better-2026",
        "template": SITE / "blog/moringa-capsules-vs-powder-which-is-better-2026.html",
        "title": "Moringa Powder vs Capsules Australia | We Sell Powder",
        "meta": "Moringa powder vs capsules in Australia: same leaf, different format. NutriThrive sells shade-dried farm-grown powder only — 100g $14, 200g $21.50, 400g $35.",
        "h1": "Moringa Powder vs Capsules in Australia",
        "lede": "Moringa powder vs capsules is a format choice, not a different plant. We sell farm-grown shade-dried leaf powder only: 100g $14, 200g $21.50, 400g $35.",
        "og_title": "Moringa Powder vs Capsules Australia | We Sell Powder",
        "og_description": "Same moringa leaf — powder or capsules. NutriThrive sells shade-dried powder only. Sizes from $14/100g.",
        "hero_image": "/assets/images/og/moringa-article-1200.jpg",
        "hero_alt": "Moringa powder vs capsules in Australia — NutriThrive sells leaf powder",
        "breadcrumb_title": "Moringa Powder vs Capsules Australia | We Sell Powder",
        "meta_line": 'Moringa guides · Published <time datetime="2026-06-29">29 June 2026</time> · Updated <time datetime="2026-10-06">6 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-06-29",
        "schema_headline": "Moringa Powder vs Capsules Australia | We Sell Powder",
        "schema_description": "Moringa powder vs capsules in Australia: same leaf, different format. NutriThrive sells shade-dried farm-grown powder only — 100g $14, 200g $21.50, 400g $35.",
        "keywords": "moringa powder vs capsules, moringa capsules australia, moringa powder australia, chemist warehouse moringa",
        "faq_schema": POST3_FAQ,
        "prose_file": "moringa_post3_capsules_prose.html",
        "quick_product": COMMON_QP,
        "conversion": {
            "product": "moringa-powder",
            "img": "/assets/images/product_webp/moringa-powder-400g-bundle-main.webp",
            "alt": "400g Moringa Bundle 4 × 100g",
            "kicker": "Prefer powder?",
            "h2": "Compare our leaf powder sizes",
            "text": "Single-ingredient farm-grown leaf powder, shade-dried and packed in Truganina. NMI lab summary on the product page.",
            "price": "From $14.00 / 100g",
            "cta": "See moringa powder sizes",
            "context_links": '<ul class="article-context-links"><li><a href="/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025" data-funnel-event="article_context_link_click" data-article="moringa-capsules-vs-powder-which-is-better-2026">Chemist Warehouse moringa guide</a></li></ul>',
        },
        "sidebar": (
            "Moringa Powder",
            "Farm-grown shade-dried leaf. Three pouch sizes.",
            "From $14.00 / 100g",
            "moringa-powder",
            "Shop moringa powder",
        ),
        "related": [
            ("/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025", "Chemist Warehouse moringa: powder vs capsules"),
            ("/blog/how-to-choose-moringa-powder-australia-2026", "How to choose moringa powder in Australia"),
            ("/blog/how-to-add-moringa-to-diet", "How to use moringa powder in food"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("same-ingredient", "Same ingredient"),
            ("real-differences", "Powder vs capsules"),
            ("when-capsules", "When capsules make sense"),
            ("when-powder", "When powder makes sense"),
            ("cost", "Compare cost fairly"),
            ("quality-checks", "What to check"),
            ("we-sell-powder", "We sell powder only"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "moringa-brands-comparison-australia-2026",
        "template": SITE / "blog/moringa-brands-comparison-australia-2026.html",
        "title": "Best Moringa Powder Australia? Facts-Only Brand Check",
        "meta": "Facts-only moringa brand comparison for Australia: dated $/100g list prices, five-point checklist, and NutriThrive farm-grown powder at 100g $14, 200g $21.50, 400g $35.",
        "h1": "Best Moringa Powder in Australia? A Facts-Only Brand Check",
        "lede": "Compare moringa brands on paperwork, label, dates, and $/100g — not hype. Dated list prices as of Oct 2026, then NutriThrive farm-grown shade-dried powder.",
        "og_title": "Best Moringa Powder Australia? Facts-Only Brand Check",
        "og_description": "Dated $/100g prices and a five-point checklist for Australian moringa brands, including NutriThrive farm-grown powder.",
        "hero_image": "/assets/images/og/moringa-article-1200.jpg",
        "hero_alt": "Best moringa powder in Australia — facts-only brand comparison",
        "breadcrumb_title": "Best Moringa Powder Australia? Facts-Only Brand Check",
        "meta_line": 'Moringa guides · Published <time datetime="2026-07-15">15 July 2026</time> · Updated <time datetime="2026-10-06">6 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-07-15",
        "schema_headline": "Best Moringa Powder Australia? Facts-Only Brand Check",
        "schema_description": "Facts-only moringa brand comparison for Australia: dated $/100g list prices, five-point checklist, and NutriThrive farm-grown powder.",
        "keywords": "best moringa powder australia, moringa brands australia, moringa powder comparison, costco moringa",
        "faq_schema": POST4_FAQ,
        "prose_file": "moringa_post4_brands_prose.html",
        "quick_product": COMMON_QP,
        "conversion": {
            "product": "moringa-powder",
            "img": "/assets/images/product_webp/moringa-powder-400g-bundle-main.webp",
            "alt": "400g Moringa Bundle 4 × 100g",
            "kicker": "Compare our product",
            "h2": "See what is in the NutriThrive pouch",
            "text": "Review ingredient, pack sizes, price and the NMI lab summary on the product page.",
            "price": "$35.00 / 400g",
            "cta": "View powder and testing",
            "context_links": '<ul class="article-context-links"><li><a href="/blog/verify-moringa-quality-premium-buyers-checklist-2026" data-funnel-event="article_context_link_click" data-article="moringa-brands-comparison-australia-2026">Moringa quality checklist</a></li></ul>',
        },
        "sidebar": (
            "400g Moringa Bundle",
            "Four pouches. Same batch standards.",
            "$35.00 / 400g",
            "moringa-powder",
            "Shop moringa powder",
        ),
        "related": [
            ("/blog/how-to-choose-moringa-powder-australia-2026", "How to choose moringa powder in Australia"),
            ("/blog/why-premium-moringa-costs-11-not-25-value-vs-markup-2026", "Moringa powder price in Australia (dated list prices)"),
            ("/blog/moringa-capsules-vs-powder-which-is-better-2026", "Moringa powder vs capsules"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("how-to-compare-brands", "How to compare brands"),
            ("checklist", "Five-point checklist"),
            ("other-brands", "Dated list prices"),
            ("price-comparison", "Compare $/100g fairly"),
            ("nutrithrive-powder", "NutriThrive powder"),
            ("verdict", "Verdict"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "why-premium-moringa-costs-11-not-25-value-vs-markup-2026",
        "template": SITE / "blog/why-premium-moringa-costs-11-not-25-value-vs-markup-2026.html",
        "title": "Moringa Powder Price Australia (Dated $/100g)",
        "meta": "Moringa powder price in Australia with dated $/100g list prices (Oct 2026), how to compare pouch and capsule maths, and NutriThrive at 100g $14, 200g $21.50, 400g $35.",
        "h1": "Moringa Powder Price in Australia (Dated List Prices)",
        "lede": "Dated moringa powder list prices per 100g in Australia, how to compare formats fairly, and what usually sits behind a higher or lower shelf tag.",
        "og_title": "Moringa Powder Price Australia (Dated $/100g)",
        "og_description": "Snapshot list prices per 100g for Australian moringa powder, plus how to compare pouch, bulk, and pharmacy listings.",
        "hero_image": "/assets/images/og/moringa-article-1200.jpg",
        "hero_alt": "Moringa powder price in Australia — dated list prices per 100g",
        "breadcrumb_title": "Moringa Powder Price Australia (Dated $/100g)",
        "meta_line": 'Moringa guides · Published <time datetime="2026-05-20">20 May 2026</time> · Updated <time datetime="2026-10-06">6 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-05-20",
        "schema_headline": "Moringa Powder Price Australia (Dated $/100g)",
        "schema_description": "Moringa powder price in Australia with dated $/100g list prices and how to compare formats before you buy.",
        "keywords": "moringa powder price australia, moringa price per 100g, how much is moringa powder",
        "faq_schema": POST5_FAQ,
        "prose_file": "moringa_post5_price_prose.html",
        "quick_product": COMMON_QP,
        "conversion": {
            "product": "moringa-powder",
            "img": "/assets/images/product_webp/moringa-powder-400g-bundle-main.webp",
            "alt": "400g Moringa Bundle 4 × 100g",
            "kicker": "Current SKUs",
            "h2": "NutriThrive moringa powder sizes",
            "text": "Farm-grown shade-dried leaf packed in Truganina. NMI lab summary linked from the product page.",
            "price": "100g $14 · 400g $35",
            "cta": "Shop moringa powder",
            "context_links": '<ul class="article-context-links"><li><a href="/blog/moringa-brands-comparison-australia-2026" data-funnel-event="article_context_link_click" data-article="why-premium-moringa-costs-11-not-25-value-vs-markup-2026">Facts-only brand comparison</a></li></ul>',
        },
        "sidebar": (
            "Moringa Powder",
            "100g, 200g and 400g pouches.",
            "From $14.00 / 100g",
            "moringa-powder",
            "Shop moringa powder",
        ),
        "related": [
            ("/blog/moringa-brands-comparison-australia-2026", "Best moringa powder? Facts-only brand check"),
            ("/blog/how-to-choose-moringa-powder-australia-2026", "How to choose moringa powder in Australia"),
            ("/blog/moringa-capsules-vs-powder-which-is-better-2026", "Moringa powder vs capsules"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("how-to-read-prices", "How to read prices"),
            ("dated-list-prices", "Dated list prices"),
            ("what-drives-price", "What drives price"),
            ("nutrithrive-pricing", "NutriThrive SKUs"),
            ("compare-brands", "Compare brands"),
            ("faq", "FAQ"),
        ],
    },
]


def main() -> None:
    for article in ARTICLES:
        out = SITE / "blog" / f"{article['slug']}.html"
        html = build_html(article, article["template"])
        out.write_text(html, encoding="utf-8")
        print(f"Wrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
