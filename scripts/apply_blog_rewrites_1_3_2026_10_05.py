#!/usr/bin/env python3
"""Apply blog rewrites posts 1–3 (Diwali gifts, handmade soap, tea lovers)."""
from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
DATA = Path(__file__).resolve().parent / "blog_rewrite_data"
TEMPLATE = SITE / "blog" / "diwali-gift-guide-curry-leaves-tea-australia.html"
BASE = "https://nutrithrive.com.au"

SCHEMA_ORG = {
    "@id": f"{BASE}/#organization",
    "name": "NutriThrive",
    "url": f"{BASE}/",
    "logo": {
        "@type": "ImageObject",
        "url": f"{BASE}/assets/images/logo/LOGO-120.webp",
        "width": 120,
        "height": 120,
    },
}

AUTHOR = {
    "@type": "Person",
    "name": "Neer Vasa",
    "jobTitle": "Founder",
    "url": f"{BASE}/about#founder",
    "worksFor": {"@type": "Organization", "name": "NutriThrive"},
}


def load_prose(name: str) -> str:
    return (DATA / name).read_text(encoding="utf-8").strip()


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
        "dateModified": "2026-10-05",
        "articleSection": article["category"],
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
                "name": article["category"],
                "item": f"{BASE}{article['category_href']}",
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


def faq_entity(q: str, a: str) -> dict:
    return {
        "@type": "Question",
        "name": q,
        "acceptedAnswer": {"@type": "Answer", "text": a},
    }


POST1_FAQ = [
    faq_entity(
        "What are good Diwali gifts for friends?",
        "Something they'll use after the festival works well: a homemade curry leaf snack jar, a pouch of dried curry leaves, Darjeeling loose leaf tea, a handmade soap, or our $20 Diwali Gift Box with all three. Savoury and pantry gifts stand out next to the sweets.",
    ),
    faq_entity(
        "What's in the NutriThrive Diwali Gift Box?",
        "100g Darjeeling loose leaf black tea, 30g dried curry leaves and a 95g handmade moringa and lavender soap bar, packed together in Truganina, Melbourne. It contains no moringa powder.",
    ),
    faq_entity(
        "How long does a homemade curry leaf snack jar keep?",
        "Make it no more than a couple of days before you give it, cool it completely before jarring, and keep the lid tight. Write the date you made it on the label so your friend knows.",
    ),
    faq_entity(
        "Can I use dried curry leaves for the tadka?",
        "Yes. Add them to hot ghee straight from the pouch, without soaking, and stir for 10 to 20 seconds until they smell strong. Dried leaves scorch faster than fresh ones, so take the pan off as soon as they darken a shade.",
    ),
    faq_entity(
        "Can I pick up Diwali gifts in Melbourne?",
        "Yes. Pickup from Truganina is available by arrangement. Contact us before you order so we can agree a time.",
    ),
]

POST2_FAQ = [
    faq_entity(
        "What does handmade soap mean in Australia?",
        "Usually that a person made the bars in small batches, not a factory line. It can be melt-and-pour, cold process or hot process. A good seller says which method they use.",
    ),
    faq_entity(
        "What is melt-and-pour soap?",
        "Soap made by melting a ready-made soap base, adding colour, fragrance and botanicals, and pouring it into moulds. Our lavender bar is made this way.",
    ),
    faq_entity(
        "Is your soap natural, organic or cold process?",
        "No. It's a melt-and-pour soap made from a ready-made soap base with moringa leaf, lavender fragrance and dried lavender flowers added by hand. It isn't certified organic, and we don't describe it as natural or cold process.",
    ),
    faq_entity(
        "Does the moringa leaf do anything for skin?",
        "We don't make skin-care claims for the bar. The moringa leaf gives it its green flecks and look. The bar is a wash that cleans and rinses off.",
    ),
    faq_entity(
        "Is lavender soap a good gift?",
        "Yes. It's light to post, doesn't spoil and suits almost anyone. Ours is also in the $20 Diwali Gift Box with Darjeeling tea and dried curry leaves.",
    ),
    faq_entity(
        "How do I stop a handmade soap going soft?",
        "Keep it on a draining dish out of the shower stream, and let it dry fully between uses. Store spare bars wrapped in a cool, dry place.",
    ),
]

POST3_FAQ = [
    faq_entity(
        "What is a good present for a tea lover?",
        "One good loose leaf tea they might not buy for themselves, plus something that makes brewing easy, such as a mug infuser or small teapot. Add a card with the brew time and temperature.",
    ),
    faq_entity(
        "What's in your tea gift box?",
        "100g Darjeeling loose leaf black tea, 30g dried curry leaves and a 95g handmade moringa and lavender soap bar. It contains no moringa powder. It's $20 and sold as the Diwali Gift Box.",
    ),
    faq_entity(
        "Is Darjeeling a good tea to give as a gift?",
        "It suits a wide range of tea drinkers: it's light enough to drink black and can take a splash of milk. Tell them to use water at about 85 to 90°C and steep for 3 to 4 minutes.",
    ),
    faq_entity(
        "How much tea is in 100g?",
        "About 40 to 50 cups at 2 to 2.5g of leaf per cup.",
    ),
    faq_entity(
        "Can I add a gift message?",
        "Yes. Add a note at checkout or email us your order number and message after you order.",
    ),
    faq_entity(
        "How do I make a small tea hamper?",
        "Pick one loose leaf tea, something to brew it with (an infuser or small teapot) and a card with brewing notes. Wrap any soap or scented item separately so the tea doesn't take on the smell.",
    ),
]

ARTICLES = [
    {
        "slug": "diwali-gifts-for-friends-curry-leaf-snacks",
        "title": "Diwali Gifts for Friends: Curry Leaf Snack Jars &amp; Gift Box",
        "meta": "Diwali gifts for friends that get used: a curry leaf tadka snack jar you can make at home, small gifts under $20 and our $20 Diwali Gift Box.",
        "h1": "Diwali Gifts for Friends: Curry Leaf Snack Jars and Small Gifts",
        "lede": "Diwali gifts for friends that get used: curry leaf tadka snack jars you can make at home, small gifts under $20, and our $20 Diwali Gift Box.",
        "og_title": "Diwali Gifts for Friends: a Savoury Swap for the Sweet Box",
        "og_description": "Make curry leaf tadka snack jars at home, or send our $20 tea, curry leaf and soap gift box.",
        "hero_image": "/assets/images/product_webp/dried-curry-leaves-30g-main.webp",
        "hero_alt": "NutriThrive dried curry leaves 30g pouch",
        "category": "Curry leaves",
        "category_href": "/blog/category/curry-leaves/",
        "breadcrumb_title": "Diwali Gifts for Friends: Curry Leaf Snack Jars & Gift Box",
        "meta_line": 'Curry leaves · Published <time datetime="2026-08-30">30 Aug 2026</time> · Updated <time datetime="2026-10-05">5 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-08-30",
        "schema_headline": "Diwali Gifts for Friends: Curry Leaf Snack Jars and Small Gifts",
        "schema_description": "Diwali gifts for friends that get used: a curry leaf tadka snack jar you can make at home, small gifts under $20 and our $20 Diwali Gift Box.",
        "keywords": "diwali gifts for friends, diwali presents, diwali mithai box, diwali gift box, deepavali gifts for friends, diwali snacks",
        "faq_schema": POST1_FAQ,
        "prose_file": "post1_diwali_gifts_prose.html",
        "quick_product": ("Diwali Gift Box · $20.00", "diwali-gift-box", "Shop Diwali gift box", "Ready Diwali hamper"),
        "conversion": {
            "product": "diwali-gift-box",
            "img": "/assets/images/product_webp/darjeeling-black-tea-100g-main.webp",
            "alt": "Diwali Gift Box Tea + curry + soap",
            "kicker": "Ready Diwali hamper",
            "h2": "Diwali gift box — tea, curry leaves &amp; soap",
            "text": "Three products for $20: Darjeeling, dried curry patta, and handmade lavender soap, packed in Truganina.",
            "price": "$20.00",
            "cta": "Shop Diwali gift box",
        },
        "sidebar": ("Diwali Gift Box", "Tea, curry leaves and lavender soap. No moringa powder.", "$20.00", "diwali-gift-box", "Shop Diwali gift box"),
        "related": [
            ("/blog/diwali-gift-guide-curry-leaves-tea-australia", "Diwali gift ideas Australia 2026"),
            ("/blog/curry-leaves-recipes-beyond-dal", "Cooking with curry leaves: 6 recipes"),
            ("/blog/dried-curry-leaves-quality-guide-how-to-use", "How to choose dried curry leaves"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("why-savoury-gift", "Why a savoury gift works next to the mithai box"),
            ("how-to-make-snack-jars", "How to make curry leaf tadka snack jars (makes 4 jars)"),
            ("small-gifts-under-20", "Small Diwali gifts for friends under $20"),
            ("ready-made-diwali-gift-box", "The ready-made option: our Diwali Gift Box"),
            ("melbourne-pickup", "Diwali gifts in Melbourne: pickup in Truganina"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "handmade-soap-australia-melt-and-pour-guide",
        "title": "Handmade Soap Australia: What Melt-and-Pour Really Means",
        "meta": "Handmade soap in Australia explained: what melt-and-pour means, how to read a soap label, gift ideas, and our 95g lavender soap bar with moringa leaf.",
        "h1": "Handmade Soap in Australia: Melt-and-Pour, Labels and Our Lavender Bar",
        "lede": "Handmade soap in Australia explained: what melt-and-pour means, how to read a soap label, gift ideas, and our 95g lavender soap bar with moringa leaf.",
        "og_title": "Handmade Soap in Australia: Melt-and-Pour, Explained Simply",
        "og_description": "What 'handmade' means on a soap label, how melt-and-pour bars are made, and how we make our lavender and moringa leaf bar in Australia.",
        "hero_image": "/assets/images/product_webp/moringa-soap-texture.webp",
        "hero_alt": "Handmade lavender soap bar with green moringa flecks on a stone dish",
        "category": "Soap & skin",
        "category_href": "/blog/category/soap-skin/",
        "breadcrumb_title": "Handmade Soap Australia: What Melt-and-Pour Really Means",
        "meta_line": 'Soap &amp; skin · Published <time datetime="2026-08-13">13 Aug 2026</time> · Updated <time datetime="2026-10-05">5 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-08-13",
        "schema_headline": "Handmade Soap in Australia: Melt-and-Pour, Labels and Our Lavender Bar",
        "schema_description": "Handmade soap in Australia explained: what melt-and-pour means, how to read a soap label, gift ideas, and our 95g lavender soap bar with moringa leaf.",
        "keywords": "handmade soap australia, handmade soap, lavender soap, homemade soap melt and pour, soap gifts, guest soaps, moringa soap",
        "faq_schema": POST2_FAQ,
        "prose_file": "post2_handmade_soap_prose.html",
        "quick_product": ("Handmade Lavender Soap · $7.00 / 95g", "moringa-soap", "Shop lavender soap bar", "Related product"),
        "conversion": {
            "product": "moringa-soap",
            "img": "/assets/images/product_webp/moringa-soap-95g-main.webp",
            "alt": "Handmade moringa lavender soap bar 95g",
            "kicker": "Handmade in Truganina",
            "h2": "Handmade moringa &amp; lavender soap bar",
            "text": "Melt-and-pour bar with moringa leaf and lavender fragrance. 95g, $7.",
            "price": "$7.00",
            "cta": "Shop lavender soap bar",
        },
        "sidebar": ("Handmade Lavender Soap", "Melt-and-pour, handmade in Australia.", "$7.00 / 95g", "moringa-soap", "Shop lavender soap bar"),
        "related": [
            ("/blog/diwali-gift-guide-curry-leaves-tea-australia", "Diwali gift ideas Australia 2026"),
            ("/blog/moringa-oil-benefits-skin-hair-health-2026", "Moringa oil for skin and hair"),
            ("/products/diwali-gift-box/", "Diwali Gift Box with soap"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("what-handmade-means", "What \"handmade soap\" can mean in Australia"),
            ("how-we-make-our-bar", "How we make our lavender soap bar"),
            ("read-a-label", "How to read a handmade soap label"),
            ("lavender-soap-gift", "Lavender soap as a gift"),
            ("make-bar-last", "How to make a handmade bar last"),
            ("patch-test", "Patch-test and care"),
            ("where-to-buy", "Where to buy handmade soap in Australia"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "gifts-for-tea-lovers-australia",
        "title": "Gifts for Tea Lovers Australia: Tea Gift Set Ideas",
        "meta": "Looking for a present for a tea lover? Tea gift set ideas under $40 with Darjeeling loose leaf, a ready tea gift box, and how to build a small tea hamper.",
        "h1": "Gifts for Tea Lovers in Australia: Tea Gift Set Ideas Under $40",
        "lede": "Looking for a present for a tea lover? Tea gift set ideas under $40 with Darjeeling loose leaf, a ready tea gift box, and how to build a small tea hamper.",
        "og_title": "Present for a Tea Lover? Tea Gift Set Ideas Under $40",
        "og_description": "Darjeeling loose leaf gift ideas by budget, a ready tea, curry leaf and soap gift box, and how to put together a small tea hamper yourself.",
        "hero_image": "/assets/images/og/black-tea-social-1200.jpg",
        "hero_alt": "NutriThrive Darjeeling loose leaf black tea pouch and a brewed cup",
        "category": "Darjeeling tea",
        "category_href": "/blog/category/tea/",
        "breadcrumb_title": "Gifts for Tea Lovers Australia: Tea Gift Set Ideas",
        "meta_line": 'Darjeeling tea · Published <time datetime="2026-10-05">5 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-10-05",
        "schema_headline": "Gifts for Tea Lovers in Australia: Tea Gift Set Ideas Under $40",
        "schema_description": "Looking for a present for a tea lover? Tea gift set ideas under $40 with Darjeeling loose leaf, a ready tea gift box, and how to build a small tea hamper.",
        "keywords": "present for a tea lover, tea gift set, tea hamper, tea gift box, tea gift pack, tea gift set australia",
        "faq_schema": POST3_FAQ,
        "prose_file": "post3_tea_lovers_prose.html",
        "quick_product": ("Darjeeling Loose Leaf · $7.50 / 100g", "black-tea", "Shop Darjeeling tea", "Related product"),
        "conversion": {
            "product": "diwali-gift-box",
            "img": "/assets/images/product_webp/darjeeling-black-tea-100g-main.webp",
            "alt": "Tea gift box with Darjeeling tea",
            "kicker": "Ready tea gift set",
            "h2": "Tea, curry leaf &amp; soap gift box",
            "text": "$20 gift box with Darjeeling, curry leaves and lavender soap — a ready tea gift set.",
            "price": "$20.00",
            "cta": "Shop tea gift box",
        },
        "sidebar": ("Darjeeling Loose Leaf", "100g from a family farm in Darjeeling.", "$7.50 / 100g", "black-tea", "Shop Darjeeling tea"),
        "related": [
            ("/blog/how-to-brew-darjeeling-tea-perfectly-2026", "How to brew Darjeeling tea"),
            ("/blog/darjeeling-tea-vs-english-breakfast-comparison-2026", "Loose leaf black tea compared"),
            ("/blog/diwali-gift-guide-curry-leaves-tea-australia", "Diwali gift ideas Australia 2026"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("good-present", "What makes a good present for a tea lover"),
            ("tea-gift-ideas-by-budget", "Tea gift ideas by budget"),
            ("build-your-own", "Build your own tea gift set or small tea hamper"),
            ("our-tea-gift-box", "Our tea gift box"),
            ("giving-darjeeling", "Giving Darjeeling: what to tell the person you're giving it to"),
            ("shipping", "Shipping and pickup"),
            ("faq", "FAQ"),
        ],
    },
]


def build_toc(slug: str, items: list[tuple[str, str]]) -> str:
    lis = "\n".join(
        f'      <li><a href="#{aid}" data-funnel-event="article_contents_click" data-article="{slug}">{label}</a></li>'
        for aid, label in items
    )
    return f'''          <nav class="article-toc" aria-labelledby="contents-{slug}">
      <h2 id="contents-{slug}">On this page</h2>
      <ol>{lis}</ol>
    </nav>'''


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
    for prop in ("og:url",):
        html = re.sub(
            rf'<meta property="{prop}" content="[^"]*">',
            f'<meta property="{prop}" content="{url}">',
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
        f'<meta property="article:section" content="{article["category"]}">',
        html,
        count=1,
    )

    old_schema = re.search(
        r'<script type="application/ld\+json">\{"@context":"https://schema.org","@type":"Article"[\s\S]*?</script>\s*<script type="application/ld\+json">\{"@context":"https://schema.org","@type":"BreadcrumbList"[\s\S]*?</script>',
        html,
    )
    if not old_schema:
        raise SystemExit(f"Could not find schema block for {slug}")
    html = html[: old_schema.start()] + schema_blocks(article) + html[old_schema.end() :]

    crumb_span = article["breadcrumb_title"].replace("&", "&amp;")
    html = re.sub(
        r'<nav class="wrap crumbs" aria-label="Breadcrumb">[\s\S]*?</nav>',
        f'''<nav class="wrap crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> / <a href="/blog/">Blog</a> / <a href="{article["category_href"]}">{article["category"]}</a> / <span>{crumb_span}</span>
      </nav>''',
        html,
        count=1,
    )

    html = re.sub(
        r'data-article-slug="[^"]*"',
        f'data-article-slug="{slug}"',
        html,
        count=1,
    )
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
    html = re.sub(
        rf'data-article="{slug}" data-product="[^"]+"',
        f'data-article="{slug}" data-product="{sb_product}"',
        html,
    )

    return html


def patch_redirects() -> None:
    path = SITE / "_redirects"
    text = path.read_text(encoding="utf-8")
    additions = [
        "/blog/afl-finals-snacks-curry-leaf-tadka /blog/diwali-gifts-for-friends-curry-leaf-snacks 301",
        "/blog/moringa-soap-benefits-skin-guide /blog/handmade-soap-australia-melt-and-pour-guide 301",
        "/blog/diwali-gifts-for-friends-curry-leaf-snacks /blog/diwali-gifts-for-friends-curry-leaf-snacks.html 200",
        "/blog/handmade-soap-australia-melt-and-pour-guide /blog/handmade-soap-australia-melt-and-pour-guide.html 200",
        "/blog/gifts-for-tea-lovers-australia /blog/gifts-for-tea-lovers-australia.html 200",
    ]
    for line in additions:
        if line.split()[0] not in text or line not in text:
            text = text.rstrip() + "\n" + line + "\n"

    text = text.replace(
        "/blog/moringa-soap-vs-regular-soap-comparison-2026.html /blog/moringa-soap-benefits-skin-guide 301!",
        "/blog/moringa-soap-vs-regular-soap-comparison-2026.html /blog/handmade-soap-australia-melt-and-pour-guide 301!",
    )
    text = text.replace(
        "/blog/moringa-soap-vs-regular-soap-comparison-2026 /blog/moringa-soap-benefits-skin-guide 301!",
        "/blog/moringa-soap-vs-regular-soap-comparison-2026 /blog/handmade-soap-australia-melt-and-pour-guide 301!",
    )
    text = text.replace(
        "/blog/how-to-read-a-soap-ingredient-label.html /blog/moringa-soap-benefits-skin-guide 301!",
        "/blog/how-to-read-a-soap-ingredient-label.html /blog/handmade-soap-australia-melt-and-pour-guide 301!",
    )
    text = text.replace(
        "/blog/how-to-read-a-soap-ingredient-label /blog/moringa-soap-benefits-skin-guide 301!",
        "/blog/how-to-read-a-soap-ingredient-label /blog/handmade-soap-australia-melt-and-pour-guide 301!",
    )
    text = text.replace(
        "/blog/how-to-choose-good-face-wash-skin-type-australia-2026.html /blog/moringa-soap-benefits-skin-guide 301!",
        "/blog/how-to-choose-good-face-wash-skin-type-australia-2026.html /blog/handmade-soap-australia-melt-and-pour-guide 301!",
    )
    text = text.replace(
        "/blog/how-to-choose-good-face-wash-skin-type-australia-2026 /blog/moringa-soap-benefits-skin-guide 301!",
        "/blog/how-to-choose-good-face-wash-skin-type-australia-2026 /blog/handmade-soap-australia-melt-and-pour-guide 301!",
    )
    text = text.replace(
        "/blog/moringa-face-mask-australia-glow-ritual.html /blog/moringa-soap-benefits-skin-guide 301!",
        "/blog/moringa-face-mask-australia-glow-ritual.html /blog/handmade-soap-australia-melt-and-pour-guide 301!",
    )
    text = text.replace(
        "/blog/moringa-face-mask-australia-glow-ritual /blog/moringa-soap-benefits-skin-guide 301!",
        "/blog/moringa-face-mask-australia-glow-ritual /blog/handmade-soap-australia-melt-and-pour-guide 301!",
    )
    path.write_text(text, encoding="utf-8")


def patch_internal_links() -> None:
    diwali = SITE / "blog/diwali-gift-guide-curry-leaves-tea-australia.html"
    t = diwali.read_text(encoding="utf-8")
    t = t.replace(
        "<li><strong>Cook&#8217;s hamper:</strong> dried curry leaves + mustard seeds + a handwritten recipe card.</li>",
        "<li><strong>Cook&#8217;s hamper:</strong> dried curry leaves + mustard seeds + a handwritten recipe card, or <a href=\"/blog/diwali-gifts-for-friends-curry-leaf-snacks\">curry leaf snack jars for friends</a>.</li>",
    )
    t = t.replace(
        "<li><strong>Tea drinker:</strong> Darjeeling 100g, or Darjeeling + curry leaves together ($14.50) if they cook too.</li>",
        "<li><strong>Tea drinker:</strong> Darjeeling 100g, or Darjeeling + curry leaves together ($14.50) if they cook too. See <a href=\"/blog/gifts-for-tea-lovers-australia\">gifts for tea lovers</a>.</li>",
    )
    t = t.replace(
        "<li><strong>Under $10:</strong> curry leaves $7, Darjeeling $7.50, soap $7</li>",
        "<li><strong>Under $10:</strong> curry leaves $7, Darjeeling $7.50, soap $7 — see <a href=\"/blog/handmade-soap-australia-melt-and-pour-guide\">how our handmade soap is made</a></li>",
    )
    diwali.write_text(t, encoding="utf-8")

    gift_box = SITE / "products/diwali-gift-box/index.html"
    gb = gift_box.read_text(encoding="utf-8")
    if "diwali-gifts-for-friends" not in gb:
        gb = gb.replace(
            "<ul><li><a href=\"/blog/diwali-gift-guide-curry-leaves-tea-australia\">Diwali gift ideas Australia 2026</a></li>",
            "<ul><li><a href=\"/blog/diwali-gifts-for-friends-curry-leaf-snacks\">Diwali gifts for friends</a></li><li><a href=\"/blog/diwali-gift-guide-curry-leaves-tea-australia\">Diwali gift ideas Australia 2026</a></li><li><a href=\"/blog/gifts-for-tea-lovers-australia\">Tea gift set ideas</a></li>",
        )
        gift_box.write_text(gb, encoding="utf-8")

    soap = SITE / "products/moringa-soap/index.html"
    sp = soap.read_text(encoding="utf-8")
    sp = sp.replace(
        "/blog/moringa-soap-benefits-skin-guide",
        "/blog/handmade-soap-australia-melt-and-pour-guide",
    )
    sp = sp.replace(
        "Moringa soap benefits and limitations",
        "Handmade soap in Australia: melt-and-pour explained",
    )
    soap.write_text(sp, encoding="utf-8")

    tea = SITE / "products/black-tea/index.html"
    bt = tea.read_text(encoding="utf-8")
    if "gifts-for-tea-lovers" not in bt:
        bt = bt.replace(
            "<li><a href=\"/blog/darjeeling-black-tea-australia-guide\">Darjeeling black tea buying guide</a></li>",
            "<li><a href=\"/blog/gifts-for-tea-lovers-australia\">Gifts for tea lovers</a></li><li><a href=\"/blog/darjeeling-black-tea-australia-guide\">Darjeeling black tea buying guide</a></li>",
        )
        tea.write_text(bt, encoding="utf-8")

    oil = SITE / "blog/moringa-oil-benefits-skin-hair-health-2026.html"
    if oil.exists():
        ot = oil.read_text(encoding="utf-8")
        ot = ot.replace("/blog/moringa-soap-benefits-skin-guide", "/blog/handmade-soap-australia-melt-and-pour-guide")
        ot = ot.replace(
            "Moringa Soap Australia: $7 Bar, Not a Skin Treatment",
            "Handmade Soap Australia: What Melt-and-Pour Really Means",
        )
        oil.write_text(ot, encoding="utf-8")

    cat_soap = SITE / "blog/category/soap-skin/index.html"
    if cat_soap.exists():
        cs = cat_soap.read_text(encoding="utf-8")
        cs = cs.replace("/blog/moringa-soap-benefits-skin-guide", "/blog/handmade-soap-australia-melt-and-pour-guide")
        cs = cs.replace("Moringa Soap Australia: $7 Bar, Not a Skin Treatment", "Handmade Soap Australia: What Melt-and-Pour Really Means")
        cat_soap.write_text(cs, encoding="utf-8")


def update_blog_articles_js() -> None:
    path = SITE / "shared/js/blog-articles.js"
    src = path.read_text(encoding="utf-8")

    def replace_entry(old_slug: str, entry: dict) -> None:
        nonlocal src
        pattern = re.compile(
            rf'\{{\s*"slug": "{re.escape(old_slug)}",[\s\S]*?\}}',
            re.M,
        )
        block = (
            "{\n"
            f'    "slug": "{entry["slug"]}",\n'
            f'    "title": "{entry["title"].replace("&amp;", "&")}",\n'
            f'    "description": "{entry["meta"]}",\n'
            f'    "category": "{entry["category"]}",\n'
            f'    "href": "/blog/{entry["slug"]}",\n'
            f'    "image": "{entry["hero_image"]}"\n'
            "  }"
        )
        src, n = pattern.subn(block, src, count=1)
        if n != 1:
            raise SystemExit(f"blog-articles.js: could not replace {old_slug}")

    replace_entry("afl-finals-snacks-curry-leaf-tadka", ARTICLES[0])
    replace_entry("moringa-soap-benefits-skin-guide", ARTICLES[1])

    new_tea = ARTICLES[2]
    insert = (
        "  {\n"
        f'    "slug": "{new_tea["slug"]}",\n'
        f'    "title": "{new_tea["title"].replace("&amp;", "&")}",\n'
        f'    "description": "{new_tea["meta"]}",\n'
        f'    "category": "{new_tea["category"]}",\n'
        f'    "href": "/blog/{new_tea["slug"]}",\n'
        f'    "image": "{new_tea["hero_image"]}"\n'
        "  },\n"
    )
    if new_tea["slug"] not in src:
        src = src.replace("window.NT_BLOG_ARTICLES = [\n", "window.NT_BLOG_ARTICLES = [\n" + insert, 1)

    path.write_text(src, encoding="utf-8")


def update_search_index() -> None:
    paths = [
        SITE / "assets/js/storefront/search-index.js",
        ROOT / "storefront/js/search-index.js",
    ]
    updates = [
        (
            "/blog/afl-finals-snacks-curry-leaf-tadka",
            {
                "title": "Diwali Gifts for Friends: Curry Leaf Snack Jars & Gift Box",
                "href": "/blog/diwali-gifts-for-friends-curry-leaf-snacks",
                "kind": "Curry leaves",
                "blurb": ARTICLES[0]["meta"],
            },
        ),
        (
            "/blog/moringa-soap-benefits-skin-guide",
            {
                "title": "Handmade Soap Australia: What Melt-and-Pour Really Means",
                "href": "/blog/handmade-soap-australia-melt-and-pour-guide",
                "kind": "Soap & skin",
                "blurb": ARTICLES[1]["meta"],
            },
        ),
    ]
    new_entry = {
        "title": "Gifts for Tea Lovers Australia: Tea Gift Set Ideas",
        "href": "/blog/gifts-for-tea-lovers-australia",
        "kind": "Darjeeling tea",
        "blurb": ARTICLES[2]["meta"],
    }
    for path in paths:
        if not path.exists():
            continue
        src = path.read_text(encoding="utf-8")
        eq = src.index("=")
        data = json.loads(src[eq + 1 :].strip().rstrip(";"))
        for old_href, new_obj in updates:
            for item in data:
                if item.get("href") == old_href:
                    item.update(new_obj)
                    break
            else:
                raise SystemExit(f"Missing {old_href} in {path}")
        if not any(i.get("href") == new_entry["href"] for i in data):
            data.append(new_entry)
        joiner = " = " if "NT_SEARCH = " in src else "="
        path.write_text(
            "window.NT_SEARCH" + joiner + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n",
            encoding="utf-8",
        )


def patch_blog_cards() -> None:
    """Replace AFL card on blog index and curry category."""
    card_old = 'href="/blog/afl-finals-snacks-curry-leaf-tadka"'
    card_new = 'href="/blog/diwali-gifts-for-friends-curry-leaf-snacks"'
    a1 = ARTICLES[0]
    search_new = (
        f"{a1['title'].replace('&amp;', '')} {a1['meta']} {a1['category']} {a1['slug']}".lower()
    )
    for rel in ("blog/index.html", "blog/category/curry-leaves/index.html"):
        p = SITE / rel
        if not p.exists():
            continue
        t = p.read_text(encoding="utf-8")
        if card_old in t:
            t = t.replace(card_old, card_new)
            t = re.sub(
                rf'(href="/blog/diwali-gifts-for-friends-curry-leaf-snacks"[^>]*data-search-text=")[^"]*(")',
                rf"\1{search_new}\2",
                t,
                count=1,
            )
            t = t.replace("AFL Finals Snacks: Curry-Leaf Tadka (Dried Leaves $7)", a1["title"].replace("&amp;", " "))
            p.write_text(t, encoding="utf-8")

    tea_card = '''<a class="article-card" href="/blog/gifts-for-tea-lovers-australia" data-journal-card data-journal-topic="Darjeeling tea" data-search-text="gifts for tea lovers australia tea gift set ideas present for a tea lover darjeeling tea gifts-for-tea-lovers-australia">
    <div class="article-card-media"><img src="/assets/images/og/black-tea-social-1200.jpg?v=20260915-1" alt="Gifts for Tea Lovers Australia: Tea Gift Set Ideas" width="800" height="450" loading="lazy"></div>
    <div class="cat">Darjeeling tea</div>
    <h3>Gifts for Tea Lovers Australia: Tea Gift Set Ideas</h3>
    <p>Looking for a present for a tea lover? Tea gift set ideas under $40 with Darjeeling loose leaf and a ready tea gift box.</p>
    <span class="article-link">Read guide <span aria-hidden="true">→</span></span>
  </a>'''
    tea_index = SITE / "blog/category/tea/index.html"
    if tea_index.exists() and "gifts-for-tea-lovers-australia" not in tea_index.read_text(encoding="utf-8"):
        ti = tea_index.read_text(encoding="utf-8")
        ti = ti.replace('<div class="journal-grid">', '<div class="journal-grid">' + tea_card, 1)
        tea_index.write_text(ti, encoding="utf-8")

    blog_index = SITE / "blog/index.html"
    if blog_index.exists() and "gifts-for-tea-lovers-australia" not in blog_index.read_text(encoding="utf-8"):
        bi = blog_index.read_text(encoding="utf-8")
        # Insert near other Diwali/tea content — after darjeeling comparison card if present
        marker = 'href="/blog/diwali-gift-guide-curry-leaves-tea-australia"'
        if marker in bi:
            idx = bi.find("</a>", bi.find(marker))
            bi = bi[: idx + 4] + tea_card + bi[idx + 4 :]
            blog_index.write_text(bi, encoding="utf-8")


def main() -> None:
    for art in ARTICLES:
        out = SITE / "blog" / f"{art['slug']}.html"
        out.write_text(build_html(art), encoding="utf-8")
        print(f"Wrote {out.relative_to(ROOT)}")

    patch_redirects()
    patch_internal_links()
    update_blog_articles_js()
    update_search_index()
    patch_blog_cards()

    subprocess.run(["node", str(ROOT / "scripts/build-sitemap.cjs")], cwd=ROOT, check=True)
    subprocess.run(["node", str(ROOT / "scripts/regenerate-blog-itemlist.mjs")], cwd=ROOT, check=True)
    print("Done: posts 1–3, redirects, sitemap, blog index itemlist.")


if __name__ == "__main__":
    main()
