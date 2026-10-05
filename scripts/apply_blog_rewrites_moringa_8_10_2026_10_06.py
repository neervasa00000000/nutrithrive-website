#!/usr/bin/env python3
"""Apply moringa blog rewrites posts 8–10 (SEO spec, Oct 2026)."""
from __future__ import annotations

import importlib.util
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
BASE = "https://nutrithrive.com.au"
TEMPLATE = SITE / "blog" / "diwali-gift-guide-curry-leaves-tea-australia.html"
DATE_MODIFIED = "2026-10-06"

_spec = importlib.util.spec_from_file_location(
    "rw13", ROOT / "scripts" / "apply_blog_rewrites_1_3_2026_10_05.py"
)
rw = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(rw)

faq_entity = rw.faq_entity
load_prose = rw.load_prose
build_toc = rw.build_toc
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


POST8_FAQ = [
    faq_entity(
        "How much moringa powder do I put in a smoothie?",
        "½ teaspoon to 1 level teaspoon per serve. Start with ½ tsp; more than 1 tsp usually tastes too grassy.",
    ),
    faq_entity(
        "What fruit hides the taste of moringa best?",
        "Frozen mango and ripe banana are the most effective. Pineapple works well too.",
    ),
    faq_entity(
        "Can I put moringa in a smoothie every day?",
        "Many people stir ½–1 tsp into food or drinks daily as a kitchen habit. This is food use only.",
    ),
    faq_entity(
        "Is NutriThrive moringa organic?",
        "No. We grow moringa on our own farm and describe it as farm-grown and shade-dried. We are not certified organic.",
    ),
]

POST9_FAQ = [
    faq_entity(
        "What does moringa powder taste like?",
        "Earthy, grassy, slightly bitter, faintly peppery — like warm hay and split peas, not a sweet green juice.",
    ),
    faq_entity(
        "Does moringa powder taste bad?",
        "In water alone, many people dislike it. In a smoothie, latte, yoghurt, or savoury food, most people tolerate or enjoy it.",
    ),
    faq_entity(
        "Is moringa powder bitter?",
        "Mild to moderate bitterness is normal. Harsh, lingering bitterness often points to old or poorly dried powder.",
    ),
    faq_entity(
        "Does moringa taste like matcha?",
        "Same broad category (green powder), but moringa is more vegetal and less sweet. They are not interchangeable in recipes.",
    ),
    faq_entity(
        "How do I make moringa powder taste better?",
        "Blend with frozen banana or mango, mix into yoghurt with honey, stir into oat milk, or fold into pesto or soup. Start with a quarter teaspoon.",
    ),
    faq_entity(
        "Is NutriThrive moringa organic?",
        "No. We sell farm-grown, shade-dried leaf powder. We are not certified organic.",
    ),
]

POST10_FAQ = [
    faq_entity(
        "What is the best way to eat moringa powder?",
        "In food you already eat: smoothie, yoghurt, oats, soup, or eggs. Start at ½ tsp. Food use only.",
    ),
    faq_entity(
        "How do you use moringa powder daily?",
        "Pick one daily meal and stir ½ to 1 tsp into it for a week before changing the method.",
    ),
    faq_entity(
        "Can I mix moringa powder with milk?",
        "Yes. Warm milk with a little honey is usually easier than cold milk alone.",
    ),
    faq_entity(
        "Is NutriThrive moringa organic?",
        "No. We grow and shade-dry moringa on our farm. We are not certified organic.",
    ),
]

MORINGA_CONVERSION = {
    "product": "moringa-powder",
    "img": "/assets/images/product_webp/moringa-powder-400g-bundle-main.webp",
    "alt": "NutriThrive moringa powder 400g bundle",
    "kicker": "Farm-grown leaf powder",
    "h2": "NutriThrive moringa powder",
    "text": "Shade-dried, farm-grown leaf powder for food and drinks. NMI lab-tested in Australia, packed in Truganina. 100g $14, 200g $21.50, 400g $35.",
    "price": "From $14.00 / 100g",
    "cta": "Shop moringa powder",
}

MORINGA_SIDEBAR = (
    "Moringa powder",
    "Farm-grown, shade-dried leaf. Food use.",
    "From $14.00 / 100g",
    "moringa-powder",
    "Shop moringa powder",
)

ARTICLES = [
    {
        "slug": "moringa-smoothie-recipes-australia-2026",
        "title": "Moringa Powder Smoothie Recipes (Australia)",
        "meta": "Five moringa smoothie recipes with exact tsp amounts for Australia — mango banana, peanut butter cacao, and three more. Farm-grown shade-dried powder from $14.",
        "h1": "Moringa Powder Smoothie Recipes (Australia)",
        "lede": "Five blender recipes with exact teaspoon amounts so moringa stays in the background — plus how much powder to use and which fruit masks the taste.",
        "og_title": "Moringa Powder Smoothie Recipes (Australia)",
        "og_description": "Exact ½–1 tsp amounts for five moringa smoothies. Farm-grown shade-dried powder: 100g $14, 200g $21.50, 400g $35.",
        "hero_image": "/assets/images/product_webp/moringa-powder-200g-lifestyle-desktop.webp",
        "hero_alt": "Moringa powder blended into a green smoothie in a glass",
        "breadcrumb_title": "Moringa Powder Smoothie Recipes (Australia)",
        "meta_line": f'Moringa guides · Published <time datetime="2026-06-27">27 June 2026</time> · Updated <time datetime="{DATE_MODIFIED}">6 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-06-27",
        "schema_headline": "Moringa Powder Smoothie Recipes (Australia)",
        "schema_description": "Five moringa smoothie recipes with exact tsp amounts for Australia. Farm-grown shade-dried moringa powder from $14.",
        "keywords": "moringa smoothie recipes australia, moringa powder smoothie, how much moringa in smoothie, moringa smoothie recipe",
        "faq_schema": POST8_FAQ,
        "prose_file": "post8_moringa_smoothie_prose.html",
        "quick_product": ("Moringa powder · from $14.00 / 100g", "moringa-powder", "Shop moringa powder", "For these recipes"),
        "conversion": MORINGA_CONVERSION,
        "sidebar": MORINGA_SIDEBAR,
        "related": [
            ("/blog/what-does-moringa-powder-taste-like-honest-guide-2026", "What does moringa powder taste like?"),
            ("/blog/how-to-add-moringa-to-diet", "How to add moringa to everyday food"),
            ("/blog/how-to-choose-moringa-powder-australia-2026", "How to choose moringa powder in Australia"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("how-much-moringa-powder-in-a-smoothie", "How much moringa in a smoothie?"),
            ("1-mango-banana-the-easiest", "1. Mango banana"),
            ("2-peanut-butter-chocolate", "2. Peanut butter chocolate"),
            ("3-pineapple-ginger-lime", "3. Pineapple ginger lime"),
            ("4-avocado-mint", "4. Avocado mint"),
            ("5-tropical-protein", "5. Tropical protein"),
            ("taste-fixes-that-actually-work", "Taste fixes"),
            ("make-ahead-vs-blend-fresh", "Make-ahead vs fresh"),
            ("which-powder-to-use", "Which powder to use"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "what-does-moringa-powder-taste-like-honest-guide-2026",
        "title": "What Does Moringa Powder Taste Like?",
        "meta": "What does moringa powder taste like? Earthy and grassy in water; milder in smoothies and savoury food. Honest guide plus NutriThrive sizes: 100g $14, 200g $21.50, 400g $35.",
        "h1": "What Does Moringa Powder Taste Like?",
        "lede": "Earthy, grassy, and slightly bitter in plain water — usually milder in smoothies, yoghurt, and savoury food. Honest taste notes before you buy a pouch.",
        "og_title": "What Does Moringa Powder Taste Like?",
        "og_description": "Honest moringa taste guide: hay-like in water, easy to hide in food. Farm-grown shade-dried powder from $14.",
        "hero_image": "/assets/images/photos/compressed/moringa-powder-detail-light.webp",
        "hero_alt": "Bright green NutriThrive moringa leaf powder in a bowl",
        "breadcrumb_title": "What Does Moringa Powder Taste Like?",
        "meta_line": f'Moringa guides · Published <time datetime="2026-06-29">29 June 2026</time> · Updated <time datetime="{DATE_MODIFIED}">6 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-06-29",
        "schema_headline": "What Does Moringa Powder Taste Like?",
        "schema_description": "What does moringa powder taste like? Earthy in water, milder in food. Farm-grown shade-dried NutriThrive powder from $14.",
        "keywords": "what does moringa taste like, what does moringa powder taste like, does moringa taste bad, moringa powder bitter",
        "faq_schema": POST9_FAQ,
        "prose_file": "post9_moringa_taste_prose.html",
        "quick_product": ("Moringa powder · from $14.00 / 100g", "moringa-powder", "Shop moringa powder", "Try a fresh pouch"),
        "conversion": MORINGA_CONVERSION,
        "sidebar": MORINGA_SIDEBAR,
        "related": [
            ("/blog/moringa-smoothie-recipes-australia-2026", "Moringa smoothie recipes (Australia)"),
            ("/blog/how-to-add-moringa-to-diet", "How to add moringa to everyday food"),
            ("/blog/how-to-choose-moringa-powder-australia-2026", "How to choose moringa powder in Australia"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("does-moringa-powder-taste-bad", "Does it taste bad?"),
            ("what-it-actually-tastes-like", "What it tastes like"),
            ("what-makes-it-worse", "What makes it worse"),
            ("what-makes-it-disappear", "What hides the taste"),
            ("how-to-use-without-bad-taste", "Use without the bad taste"),
            ("if-you-hated-it", "If you hated it"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "how-to-add-moringa-to-diet",
        "title": "How to Use Moringa Powder in Everyday Food (AU)",
        "meta": "How to add moringa powder to food you already eat in Australia. Start with ½ tsp in smoothies, yoghurt, or soup. Farm-grown shade-dried powder: 100g $14, 200g $21.50, 400g $35.",
        "h1": "How to Add Moringa Powder to Everyday Food",
        "lede": "Everyday ways to eat farm-grown shade-dried moringa in meals you already make — amounts, food ideas, and sizes from $14.",
        "og_title": "How to Use Moringa Powder in Everyday Food (AU)",
        "og_description": "Add ½–1 tsp to smoothies, yoghurt, soup, or eggs. Food use only. NutriThrive powder from $14, packed in Truganina.",
        "hero_image": "/assets/images/photos/compressed/moringa-powder-200g-editorial-desktop.webp",
        "hero_alt": "NutriThrive moringa powder pouch with a bowl of leaf powder",
        "breadcrumb_title": "How to Use Moringa Powder in Everyday Food (AU)",
        "meta_line": f'Moringa guides · Published <time datetime="2026-06-15">15 June 2026</time> · Updated <time datetime="{DATE_MODIFIED}">6 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-06-15",
        "schema_headline": "How to Add Moringa Powder to Everyday Food",
        "schema_description": "How to add moringa powder to everyday food in Australia. Food use, ½–1 tsp amounts. Farm-grown shade-dried powder from $14.",
        "keywords": "how to use moringa powder, how to add moringa to diet, how to eat moringa powder, moringa powder in food australia",
        "faq_schema": POST10_FAQ,
        "prose_file": "post10_moringa_diet_prose.html",
        "quick_product": ("Moringa powder · from $14.00 / 100g", "moringa-powder", "Shop moringa powder", "For everyday food"),
        "conversion": MORINGA_CONVERSION,
        "sidebar": MORINGA_SIDEBAR,
        "related": [
            ("/blog/moringa-smoothie-recipes-australia-2026", "Moringa smoothie recipes (Australia)"),
            ("/blog/what-does-moringa-powder-taste-like-honest-guide-2026", "What does moringa powder taste like?"),
            ("/blog/high-protein-moringa-recipes-australia-2026", "High-protein moringa recipes"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("best-way-to-eat", "Best way to eat moringa"),
            ("how-to-add", "How to add it to your diet"),
            ("food-vehicles", "Food that works"),
            ("with-milk-or-water", "With milk or water"),
            ("taste-mistakes", "Common mistakes"),
            ("sizes-and-shipping", "Sizes and shipping"),
            ("faq", "FAQ"),
        ],
    },
]


def build_html(article: dict) -> str:
    tpl = TEMPLATE.read_text(encoding="utf-8")
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
        r'<script type="application/ld\+json">\{"@context": "https://schema.org", "@type": "BlogPosting"[\s\S]*?'
        r'<script type="application/ld\+json">\{"@context": "https://schema.org", "@type": "BreadcrumbList"[\s\S]*?</script>',
        html,
    )
    if not old_schema:
        sys.exit(f"Could not find schema block for {slug}")
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
    html = re.sub(r'<p class="meta-line">[\s\S]*?</p>', f'<p class="meta-line">{article["meta_line"]}</p>', html, count=1)
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
            <a href="/products/{qp_product}/" data-funnel-event="article_early_product_click" data-article="{slug}" data-product="{qp_product}">{qp_cta}</a>
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
    related_lis = "".join(f"<li><a href=\"{h}\">{t}</a></li>" for h, t in article["related"])
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
              <p class="price">{conv["price"]} </p>
              <div class="btn-row">
                <a class="btn btn-primary" href="/products/{conv["product"]}/" data-funnel-event="article_product_click" data-article="{slug}" data-product="{conv["product"]}">{conv["cta"]}</a>
                <a class="btn btn-secondary" href="/shipping" data-funnel-event="article_shipping_click">Delivery &amp; returns</a>
              </div>
            </div>
          </section>''',
        html,
        count=1,
    )

    html = re.sub(
        r'(<nav class="article-related"[\s\S]*?<h2[^>]*>)[^<]*(</h2>\s*)<ul>[\s\S]*?</ul>',
        rf"\1Related moringa guides\2<ul>{related_lis}</ul>",
        html,
        count=1,
    )

    html = re.sub(
        r'(<aside class="article-sidebar">[\s\S]*?<h2>)[^<]*(</h2>\s*<p>)[^<]*(</p>\s*<p class="price"[^>]*>)[^<]*(</p>\s*<a class="btn btn-primary btn-block" href="/products/)[^/]+(/"[^>]*>)[^<]*(</a>)',
        rf"\1{sb_title}\2{sb_text}\3{sb_price}\4{sb_product}\5{sb_cta}\6",
        html,
        count=1,
    )
    html = re.sub(
        rf'data-article="{slug}" data-product="[^"]+"',
        f'data-article="{slug}" data-product="{sb_product}"',
        html,
    )

    return html


def main() -> None:
    for article in ARTICLES:
        out = SITE / "blog" / f"{article['slug']}.html"
        out.write_text(build_html(article), encoding="utf-8")
        print(f"wrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
