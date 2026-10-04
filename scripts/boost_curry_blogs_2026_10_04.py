#!/usr/bin/env python3
"""Expand/boost selected curry-leaf blog posts in place. 2026-10-04."""
from __future__ import annotations

import json
import re
from pathlib import Path

BLOG = Path("/Users/neervasa/Desktop/Website/site/blog")
DM = "2026-10-04"


def faq_ld(faqs: list[tuple[str, str]]) -> str:
    ents = [
        {
            "@type": "Question",
            "name": q,
            "acceptedAnswer": {"@type": "Answer", "text": a},
        }
        for q, a in faqs
    ]
    return json.dumps(
        {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": ents},
        ensure_ascii=False,
    )


def set_meta(html: str, title: str, meta: str) -> str:
    html = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", html, count=1)
    html = re.sub(
        r'<meta name="description" content="[^"]*">',
        f'<meta name="description" content="{meta}">',
        html,
        count=1,
    )
    html = re.sub(
        r'(<meta property="og:title" content=")[^"]*(">)', rf"\g<1>{title}\2", html
    )
    html = re.sub(
        r'(<meta property="og:description" content=")[^"]*(">)', rf"\g<1>{meta}\2", html
    )
    html = re.sub(
        r'(<meta property="og:image:alt" content=")[^"]*(">)', rf"\g<1>{title}\2", html
    )
    html = re.sub(
        r'(<meta name="twitter:title" content=")[^"]*(">)', rf"\g<1>{title}\2", html
    )
    html = re.sub(
        r'(<meta name="twitter:description" content=")[^"]*(">)',
        rf"\g<1>{meta}\2",
        html,
    )
    return html


def update_jsonld(
    html: str, headline: str, description: str, date_published: str | None = None
) -> str:
    def repl(m: re.Match) -> str:
        raw = m.group(1)
        try:
            obj = json.loads(raw)
        except json.JSONDecodeError:
            return m.group(0)
        t = obj.get("@type")
        if t == "Article":
            obj["headline"] = headline
            obj["description"] = description
            if date_published:
                obj["datePublished"] = date_published
            obj["dateModified"] = DM
            return f'<script type="application/ld+json">{json.dumps(obj, ensure_ascii=False)}</script>'
        if t == "BreadcrumbList":
            for item in obj.get("itemListElement", []):
                if item.get("position") == 3:
                    item["name"] = headline
            return f'<script type="application/ld+json">{json.dumps(obj, ensure_ascii=False)}</script>'
        return m.group(0)

    return re.sub(
        r'<script type="application/ld\+json">(\{.*?\})</script>',
        repl,
        html,
        flags=re.S,
    )


def insert_faq_jsonld(html: str, faqs: list[tuple[str, str]]) -> str:
    html = re.sub(
        r'\n?  <script type="application/ld\+json">\{"@context":"https://schema\.org","@type":"FAQPage".*?</script>',
        "",
        html,
        flags=re.S,
    )
    block = f'\n  <script type="application/ld+json">{faq_ld(faqs)}</script>'
    return html.replace("</head>", block + "\n</head>", 1)


def replace_between(html: str, start: str, end: str, new: str) -> str:
    i = html.find(start)
    j = html.find(end, i)
    if i < 0 or j < 0:
        raise ValueError(f"markers not found: {start!r} ... {end!r}")
    return html[:i] + new + html[j:]


def word_count_prose(html: str) -> int:
    m = re.search(r'<div class="prose">(.*?)</div>\s*\n\s*<section class="article-conversion"', html, re.S)
    if not m:
        return 0
    text = re.sub(r"<[^>]+>", " ", m.group(1))
    text = re.sub(r"&[a-zA-Z#0-9]+;", " ", text)
    return len(text.split())


# ---------------------------------------------------------------------------
# 1. vs curry powder
# ---------------------------------------------------------------------------
def boost_vs_powder():
    path = BLOG / "curry-leaves-vs-curry-powder-difference-explained-2026.html"
    html = path.read_text(encoding="utf-8")
    title = "Curry Leaves vs Curry Powder: Different Things, Not Swaps"
    meta = "Curry leaves and curry powder aren't interchangeable. What each is, when to use them, how many dried leaves equal fresh, and where to buy in Australia."
    faqs = [
        (
            "Are curry leaves and curry powder the same?",
            "No. Curry leaves are a whole aromatic leaf (Murraya koenigii). Curry powder is a ground spice blend that almost never contains curry leaves.",
        ),
        (
            "Can I substitute curry powder for curry leaves?",
            "No. They do different jobs: leaves temper in hot oil for aroma; powder seasons and colours a sauce. Use dried leaves when the recipe names the leaf.",
        ),
        (
            "How many dried curry leaves equal fresh?",
            "Use about 2 to 3 times the volume of dried leaves versus fresh for a similar aroma in tadka. Start with 10 to 12 dried leaves for a typical dal or rice tempering.",
        ),
        (
            "Are curry leaves the same as bay leaves or kaffir lime leaves?",
            "No. Bay is milder and more resinous; kaffir lime leaf is sharper and citrus-forward. Neither is a true swap for karipatta, though kaffir can hint at citrus in a pinch.",
        ),
        (
            "Where can I buy dried curry leaves in Australia?",
            "Indian grocers often stock fresh bunches; Coles and Woolworths rarely carry reliable dried whole leaf. Online pouches are the practical pantry option. You can buy dried curry leaves online from NutriThrive for $7 / 30g.",
        ),
    ]
    html = set_meta(html, title, meta)
    html = update_jsonld(html, title, meta, date_published="2026-06-20")
    html = insert_faq_jsonld(html, faqs)

    crumb = f'        <a href="/">Home</a> / <a href="/blog/">Blog</a> / <span>{title}</span>'
    html = re.sub(
        r'        <a href="/">Home</a> / <a href="/blog/">Blog</a> / <span>.*?</span>',
        crumb,
        html,
        count=1,
    )

    head_block = f"""          <p class="meta-line">Curry leaves · Published <time datetime="2026-06-20">20 June 2026</time> · Updated <time datetime="{DM}">4 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a></p>
          <h1>{title}</h1>
          <p class="lede">{meta}</p>
          <div class="article-hero"><img src="/assets/images/homepage/product-showcase/Curry.webp?v=20260915-1" alt="{title}" width="1200" height="675" fetchpriority="high"></div>
          <aside class="article-quick-product" aria-label="Related NutriThrive product">
            <div><span>Related product</span><strong>Dried Curry Leaves · $7.00 / 30g</strong></div>
            <a href="/products/curry-leaves/" data-funnel-event="article_early_product_click" data-article="curry-leaves-vs-curry-powder-difference-explained-2026" data-product="curry-leaves">Get curry leaves</a>
          </aside>
          <nav class="article-toc" aria-labelledby="contents-curry-leaves-vs-curry-powder-difference-explained-2026">
      <h2 id="contents-curry-leaves-vs-curry-powder-difference-explained-2026">On this page</h2>
      <ol><li><a href="#quick-answer" data-funnel-event="article_contents_click" data-article="curry-leaves-vs-curry-powder-difference-explained-2026">Quick answer</a></li><li><a href="#comparison-table" data-funnel-event="article_contents_click" data-article="curry-leaves-vs-curry-powder-difference-explained-2026">Leaves vs powder at a glance</a></li><li><a href="#what-leaves-are" data-funnel-event="article_contents_click" data-article="curry-leaves-vs-curry-powder-difference-explained-2026">What curry leaves are</a></li><li><a href="#what-powder-is" data-funnel-event="article_contents_click" data-article="curry-leaves-vs-curry-powder-difference-explained-2026">What curry powder is</a></li><li><a href="#why-not-swap" data-funnel-event="article_contents_click" data-article="curry-leaves-vs-curry-powder-difference-explained-2026">Why you cannot swap them</a></li><li><a href="#vs-bay-kaffir" data-funnel-event="article_contents_click" data-article="curry-leaves-vs-curry-powder-difference-explained-2026">Vs bay and kaffir lime leaf</a></li><li><a href="#dried-fresh" data-funnel-event="article_contents_click" data-article="curry-leaves-vs-curry-powder-difference-explained-2026">Dried vs fresh amounts</a></li><li><a href="#dishes-need-leaf" data-funnel-event="article_contents_click" data-article="curry-leaves-vs-curry-powder-difference-explained-2026">Dishes that need the leaf</a></li><li><a href="#buy-leaves" data-funnel-event="article_contents_click" data-article="curry-leaves-vs-curry-powder-difference-explained-2026">Where to buy in Australia</a></li><li><a href="#faq" data-funnel-event="article_contents_click" data-article="curry-leaves-vs-curry-powder-difference-explained-2026">FAQ</a></li></ol>
    </nav>
"""
    html = replace_between(
        html,
        '          <p class="meta-line">',
        '          <div class="prose">',
        head_block,
    )

    prose = r'''          <div class="prose">

<div class="answer-box">
<h2 id="quick-answer">Quick answer</h2>
<p>Curry leaves and curry powder are different ingredients that share a confusing English name. Curry leaves (karipatta) are whole aromatic leaves from <em>Murraya koenigii</em>, usually fried briefly in hot oil at the start of cooking. Curry powder is a ground spice blend — typically turmeric, cumin, coriander, and chilli — that almost never contains curry leaves. If a recipe says “curry leaves,” buy the leaf. Powder will not do the same job.</p>
</div>

<p>In Australian kitchens the mix-up is common: the jar labelled “curry powder” sits on the spice rack, while the leaf that South Indian and Sri Lankan recipes actually call for is missing. This guide separates the two, shows how dried leaf compares with fresh, and points to where you can stock a pouch without hunting every week.</p>

<h2 id="comparison-table">Leaves vs powder at a glance</h2>
<table>
<thead>
<tr><th>Feature</th><th>Curry leaves</th><th>Curry powder</th></tr>
</thead>
<tbody>
<tr><td>What it is</td><td>Whole leaf herb (karipatta)</td><td>Ground spice blend</td></tr>
<tr><td>Plant</td><td><em>Murraya koenigii</em></td><td>Mix of spices (not one plant)</td></tr>
<tr><td>How you use it</td><td>Temper in hot oil / ghee</td><td>Stir into sauces and marinades</td></tr>
<tr><td>Flavour role</td><td>Citrusy, smoky top note</td><td>Colour, body, ground heat</td></tr>
<tr><td>Contains the other?</td><td>No powder inside</td><td>Almost never contains leaves</td></tr>
<tr><td>Pantry form in AU</td><td>Fresh bunches or dried pouch</td><td>Jarred blend everywhere</td></tr>
</tbody>
</table>

<h2 id="what-leaves-are">What curry leaves are</h2>
<p>Curry leaves look a little like small bay leaves: slender, pointed, and glossy when fresh. You cook them as a herb, not as a ground seasoning. The classic move is tadka (tempering): heat oil or ghee until it shimmers, add whole leaves, and fry 30 to 60 seconds until they crackle and smell fragrant. That infused oil carries the aroma through dal, rice, vegetables, and eggs.</p>
<p>Fresh bunches show up at Indian and Sri Lankan grocers in most capital cities. Outside those suburbs — or between shop runs — dried whole leaves are the practical pantry version. Shade-dried leaf keeps its character for months when sealed away from light and steam. NutriThrive packs a 30g pouch of farm-grown dried curry leaves for <strong>$7</strong>, dispatched from Truganina in Melbourne’s west.</p>

<h2 id="what-powder-is">What curry powder is</h2>
<p>Curry powder is a British-era spice mix meant to approximate “curry” flavour in one jar. Recipes vary by brand, but turmeric usually dominates the colour, with cumin, coriander seed, fenugreek, and chilli for warmth. It is useful when you want a yellow sauce or a quick weekday “curry” flavour without building a spice list from scratch.</p>
<p>What it is not: powdered curry leaves. Opening a curry powder jar will not replace a tempering of whole karipatta. The leaf’s volatile oils release in hot fat; ground turmeric-forward blends do a different job entirely.</p>

<h2 id="why-not-swap">Why you cannot swap them</h2>
<p>Leaves give a citrusy, slightly nutty top note from whole-leaf tempering. Curry powder gives body, colour, and ground-spice heat. Swapping one for the other is like swapping bay leaves for paprika: both are kitchen staples, but they are not interchangeable.</p>
<p>If you are mid-recipe and truly out of leaves, do not tip in curry powder as a stand-in. A temporary citrus hint from lime zest or a strip of kaffir lime leaf can help until you restock — see our <a href="/blog/curry-leaves-substitute-what-to-use-2026">substitute guide</a> for ranked options. The lasting fix is a sealed pouch of dried leaf in the pantry.</p>

<h2 id="vs-bay-kaffir">Vs bay leaves and kaffir lime leaf</h2>
<p>Bay leaves and kaffir lime leaves are the two herbs people most often grab when they cannot find curry leaves. They are related in spirit (whole aromatic leaves) but not in flavour.</p>
<ul>
<li><strong>Bay leaf:</strong> Milder, more resinous and woody. Fine in stews; too quiet and wrong-shaped for South Indian tadka.</li>
<li><strong>Kaffir lime leaf:</strong> Sharp, bright citrus. Closer than bay for a top note, but still not karipatta. Use a small piece only if you need a temporary stand-in.</li>
<li><strong>Curry leaf:</strong> Distinct citrus-savoury aroma that blooms in hot oil. Nothing else on the spice rack copies it cleanly.</li>
</ul>
<p>Keep bay for European braises, kaffir for Thai and Malaysian dishes, and curry leaves for the temperings that name them.</p>

<h2 id="dried-fresh">Dried vs fresh: how many leaves to use</h2>
<p>Dried leaf is more concentrated by weight but a little softer in aroma than a just-picked bunch. A practical kitchen rule for Australian home cooks:</p>
<table>
<thead>
<tr><th>Use</th><th>Fresh leaves</th><th>Dried leaves (volume)</th></tr>
</thead>
<tbody>
<tr><td>Dal or sambar tadka</td><td>8–10 leaves</td><td>10–15 leaves (about 1 tbsp loosely packed)</td></tr>
<tr><td>Lemon rice / upma</td><td>10–12 leaves</td><td>12–18 leaves</td></tr>
<tr><td>Eggs or potatoes</td><td>6–8 leaves</td><td>8–12 leaves</td></tr>
<tr><td>Finishing oil (small jar)</td><td>Large handful</td><td>2–3 tbsp dried</td></tr>
</tbody>
</table>
<p>Rule of thumb: use about <strong>two to three times the volume</strong> of dried leaves versus fresh when you want a similar hit of aroma. You do not need to rehydrate dried leaves for tadka — fry them straight into hot oil. Soak only when blending into a paste or chutney.</p>

<h2 id="dishes-need-leaf">Dishes that need the leaf (not the powder)</h2>
<p>These classics call for curry leaves specifically. Curry powder will change the dish into something else:</p>
<ul>
<li>South Indian dal, sambar, and rasam temperings</li>
<li>Lemon rice, coconut rice, and many upma or pongal finishes</li>
<li>Fish or prawn curries that start with mustard seed and karipatta</li>
<li>Potato fry, cabbage thoran, and bean poriyal</li>
<li>Curry leaf chutney and infused finishing oils</li>
</ul>
<p>Powder belongs in Anglo-Indian style “curry” sauces, dry rubs, and recipes that already list a blended masala. When the ingredient line says curry leaves, buy the leaves.</p>

<h2 id="buy-leaves">Where to buy curry leaves in Australia</h2>
<p><strong>Coles and Woolworths:</strong> Fresh curry leaves appear occasionally in the herb section of larger stores, usually in capital-city suburbs with strong Indian grocery demand. Dried whole-leaf pouches are uncommon and quality varies. Do not assume the spice aisle’s curry powder is a substitute.</p>
<p><strong>Indian and Asian grocers:</strong> Best bet for fresh bunches. Buy what you will use within a few days, or strip and freeze leaves flat in a bag. Some grocers also stock dried leaf in plastic jars — check that leaves are still green-grey and fragrant, not brown dust.</p>
<p><strong>Online:</strong> The reliable pantry option if you cook tadka often. A sealed pouch of shade-dried leaf means you are never mid-recipe without the ingredient. You can <a href="/products/curry-leaves/">buy dried curry leaves online</a> from NutriThrive — $7 for 30g, packed in Melbourne, with free AU shipping from $79.</p>
<p>For storage and tempering technique, see our <a href="/blog/dried-curry-leaves-australia-guide">dried curry leaves Australia guide</a> and <a href="/blog/curry-leaves-recipes-beyond-dal">recipes beyond dal</a>.</p>

<h2 id="faq">FAQ</h2>
<details><summary>Are curry leaves and curry powder the same?</summary><div><p>No. Curry leaves are a whole aromatic leaf (Murraya koenigii). Curry powder is a ground spice blend that almost never contains curry leaves.</p></div></details>
<details><summary>Can I substitute curry powder for curry leaves?</summary><div><p>No. They do different jobs: leaves temper in hot oil for aroma; powder seasons and colours a sauce. Use dried leaves when the recipe names the leaf.</p></div></details>
<details><summary>How many dried curry leaves equal fresh?</summary><div><p>Use about 2 to 3 times the volume of dried leaves versus fresh for a similar aroma in tadka. Start with 10 to 12 dried leaves for a typical dal or rice tempering.</p></div></details>
<details><summary>Are curry leaves the same as bay leaves or kaffir lime leaves?</summary><div><p>No. Bay is milder and more resinous; kaffir lime leaf is sharper and citrus-forward. Neither is a true swap for karipatta, though kaffir can hint at citrus in a pinch.</p></div></details>
<details><summary>Where can I buy dried curry leaves in Australia?</summary><div><p>Indian grocers often stock fresh bunches; Coles and Woolworths rarely carry reliable dried whole leaf. Online pouches are the practical pantry option. You can <a href="/products/curry-leaves/">buy dried curry leaves online</a> from NutriThrive for $7 / 30g.</p></div></details>

<p><em>Written by Neer, founder, NutriThrive Australia.</em></p>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul>
<li><strong>4 Oct 2026:</strong> Expanded comparison table, dried/fresh amounts, bay/kaffir notes, and Australia buying section.</li>
<li><strong>20 Jun 2026:</strong> Article published.</li>
</ul>
</div>

</div>
'''
    html = replace_between(
        html,
        '          <div class="prose">',
        '\n          <section class="article-conversion"',
        prose,
    )
    path.write_text(html, encoding="utf-8")
    print(f"1 vs-powder words≈{word_count_prose(html)}")


# ---------------------------------------------------------------------------
# 2. tea
# ---------------------------------------------------------------------------
def boost_tea():
    path = BLOG / "curry-leaves-tea-how-to-make-benefits-2026.html"
    html = path.read_text(encoding="utf-8")
    title = "Curry Leaf Tea: How to Make It with Dried Leaves"
    meta = "Make curry leaf tea from dried leaves: how many to use, steep time, pairings (ginger, lemon, honey) and how to store the pouch so it stays fragrant."
    faqs = [
        (
            "Can you make tea from dried curry leaves?",
            "Yes. Dried leaves are what most Australians use, because fresh karipatta is not always in the shops. One tablespoon per 500 ml water is a solid starting point.",
        ),
        (
            "How long should you simmer curry leaf tea?",
            "Five to eight minutes at a gentle simmer for one tablespoon in 500 ml water. A hard rolling boil can flatten the flavour.",
        ),
        (
            "What goes well with curry leaf tea?",
            "Lemon, honey, and a thin slice of fresh ginger are the usual pairings. You can also add a pinch of Darjeeling for a light black-tea backbone.",
        ),
        (
            "How should I store dried curry leaves for tea?",
            "Keep the pouch sealed, cool, and away from steam and direct sun. Squeeze out air after each use. Well-stored shade-dried leaf stays fragrant for many months.",
        ),
        (
            "Is curry leaf tea caffeinated?",
            "No. Curry leaves are a herbal infusion. If you blend with Darjeeling, the caffeine comes only from the black tea.",
        ),
    ]
    html = set_meta(html, title, meta)
    html = update_jsonld(html, title, meta, date_published="2026-06-27")
    html = insert_faq_jsonld(html, faqs)
    html = re.sub(
        r'        <a href="/">Home</a> / <a href="/blog/">Blog</a> / <span>.*?</span>',
        f'        <a href="/">Home</a> / <a href="/blog/">Blog</a> / <span>{title}</span>',
        html,
        count=1,
    )

    head_block = f"""          <p class="meta-line">Curry leaves · Published <time datetime="2026-06-27">27 June 2026</time> · Updated <time datetime="{DM}">4 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a></p>
          <h1>{title}</h1>
          <p class="lede">{meta}</p>
          <div class="article-hero"><img src="/assets/images/homepage/product-showcase/Curry.webp?v=20260915-1" alt="{title}" width="1200" height="675" fetchpriority="high"></div>
          <aside class="article-quick-product" aria-label="Related NutriThrive product">
            <div><span>Related product</span><strong>Dried Curry Leaves · $7.00 / 30g</strong></div>
            <a href="/products/curry-leaves/" data-funnel-event="article_early_product_click" data-article="curry-leaves-tea-how-to-make-benefits-2026" data-product="curry-leaves">Get curry leaves</a>
          </aside>
          <nav class="article-toc" aria-labelledby="contents-curry-leaves-tea-how-to-make-benefits-2026">
      <h2 id="contents-curry-leaves-tea-how-to-make-benefits-2026">On this page</h2>
      <ol><li><a href="#quick-answer" data-funnel-event="article_contents_click" data-article="curry-leaves-tea-how-to-make-benefits-2026">Quick answer</a></li><li><a href="#how-much-leaf" data-funnel-event="article_contents_click" data-article="curry-leaves-tea-how-to-make-benefits-2026">How many leaves to use</a></li><li><a href="#recipe-plain" data-funnel-event="article_contents_click" data-article="curry-leaves-tea-how-to-make-benefits-2026">Recipe 1: Plain curry leaf tea</a></li><li><a href="#recipe-ginger-lemon" data-funnel-event="article_contents_click" data-article="curry-leaves-tea-how-to-make-benefits-2026">Recipe 2: Ginger-lemon</a></li><li><a href="#recipe-darjeeling" data-funnel-event="article_contents_click" data-article="curry-leaves-tea-how-to-make-benefits-2026">Recipe 3: With Darjeeling</a></li><li><a href="#taste" data-funnel-event="article_contents_click" data-article="curry-leaves-tea-how-to-make-benefits-2026">What it tastes like</a></li><li><a href="#storage" data-funnel-event="article_contents_click" data-article="curry-leaves-tea-how-to-make-benefits-2026">How to store the pouch</a></li><li><a href="#faq" data-funnel-event="article_contents_click" data-article="curry-leaves-tea-how-to-make-benefits-2026">FAQ</a></li><li><a href="#related-guides" data-funnel-event="article_contents_click" data-article="curry-leaves-tea-how-to-make-benefits-2026">Related guides</a></li></ol>
    </nav>
"""
    html = replace_between(
        html,
        '          <p class="meta-line">',
        '          <div class="prose">',
        head_block,
    )

    prose = r'''          <div class="prose">

<div class="answer-box">
<h2 id="quick-answer">Quick answer</h2>
<p>Use about 1 tablespoon of dried curry leaves in 500 ml water. Simmer gently for 5 to 8 minutes, strain, and drink warm. Lemon, honey, or ginger make the first cup easier. Keep the pouch sealed so the leaves stay fragrant between pots.</p>
</div>

<p>Curry leaf tea is a quiet habit in many South Indian kitchens: leaves and water, nothing fancy. If you live outside the suburbs where fresh karipatta shows up every week, dried leaves are the practical way to brew it. We grow and shade-dry curry leaves on our farm and pack them in Truganina; the pouch is <a href="/products/curry-leaves/">$7 for 30g</a>.</p>

<h2 id="how-much-leaf">How many leaves to use</h2>
<table>
<thead>
<tr><th>Strength</th><th>Dried leaves</th><th>Water</th><th>Simmer</th></tr>
</thead>
<tbody>
<tr><td>Light</td><td>2 tsp (about 1–1.5 g)</td><td>500 ml</td><td>5 minutes</td></tr>
<tr><td>Standard</td><td>1 tbsp (about 2–3 g)</td><td>500 ml</td><td>5–8 minutes</td></tr>
<tr><td>Strong</td><td>1 heaped tbsp</td><td>500 ml</td><td>8–10 minutes</td></tr>
<tr><td>Single mug</td><td>2 tsp</td><td>250 ml</td><td>5 minutes</td></tr>
</tbody>
</table>
<p>Dried leaf is concentrated compared with fresh, so you do not need a fistful. If the cup tastes bitter, use slightly less leaf or shorten the simmer. Prefer a softer cup? Pour just-boiled water over the leaves, cover, and steep 8 to 10 minutes instead of simmering.</p>

<h2 id="recipe-plain">Recipe 1: Plain curry leaf tea</h2>
<p><strong>You need:</strong> 1 tbsp dried curry leaves · 500 ml water</p>
<ol>
<li>Add leaves and water to a small saucepan.</li>
<li>Bring to a gentle simmer — small bubbles at the edge, not a hard rolling boil.</li>
<li>Simmer 5 to 8 minutes until the liquid turns pale yellow-green.</li>
<li>Strain into a mug. Compost or discard the spent leaves.</li>
</ol>
<p>That batch is one large mug or two smaller cups. The leaves do not infuse well a second time, so start fresh next round.</p>

<h2 id="recipe-ginger-lemon">Recipe 2: Ginger-lemon curry leaf tea</h2>
<p><strong>You need:</strong> 1 tbsp dried curry leaves · 500 ml water · 3–4 thin slices fresh ginger · half a lemon · honey to taste</p>
<ol>
<li>Add leaves, ginger, and water to the pan.</li>
<li>Simmer gently 6 to 8 minutes.</li>
<li>Strain into a mug. Squeeze in lemon juice; stir in honey while warm.</li>
</ol>
<p>Ginger adds warmth; lemon brightens the savoury leaf note. This is the cup most people prefer on the first try.</p>

<h2 id="recipe-darjeeling">Recipe 3: Curry leaf tea with Darjeeling</h2>
<p><strong>You need:</strong> 2 tsp dried curry leaves · 1 tsp <a href="/products/black-tea/">Darjeeling loose leaf</a> · 400 ml water · optional lemon</p>
<ol>
<li>Bring water to a simmer with the curry leaves for 4 minutes.</li>
<li>Add the Darjeeling; simmer or steep off-heat another 2 to 3 minutes (do not boil hard — Darjeeling turns harsh).</li>
<li>Strain. Lemon optional; skip milk if you want the leaf aroma to stay clear.</li>
</ol>
<p>You get a light black-tea backbone with a herbal edge. Caffeine comes only from the Darjeeling, not the curry leaves.</p>

<h2 id="taste">What it tastes like</h2>
<p>Mild, savoury, and a little citrusy underneath. It is not sweet on its own, and it is not like builder’s tea. The aroma you know from tadka is there, but quieter. Adjust expectations: this is an herbal cup first. Pairings (ginger, lemon, honey, or a pinch of Darjeeling) are how most Australian kitchens settle into the habit.</p>

<h2 id="storage">How to store the pouch so it stays fragrant</h2>
<ul>
<li>Reseal the pouch after every scoop; press out excess air.</li>
<li>Keep it cool, dry, and away from the kettle’s steam and direct sun.</li>
<li>Do not refrigerate — fridge moisture softens dried herbs.</li>
<li>If leaves smell flat or look brown and dusty, it is time for a new pouch.</li>
</ul>
<p>A well-sealed 30g pouch lasts through many pots of tea and plenty of weekday tadka. More detail: <a href="/blog/how-to-store-curry-leaves-fresh-dried-australia-2026">how to store curry leaves</a>.</p>

<h2 id="faq">FAQ</h2>
<details><summary>Can you make tea from dried curry leaves?</summary><div><p>Yes. Dried leaves are what most Australians use, because fresh karipatta is not always in the shops. One tablespoon per 500 ml water is a solid starting point.</p></div></details>
<details><summary>How long should you simmer curry leaf tea?</summary><div><p>Five to eight minutes at a gentle simmer for one tablespoon in 500 ml water. A hard rolling boil can flatten the flavour.</p></div></details>
<details><summary>What goes well with curry leaf tea?</summary><div><p>Lemon, honey, and a thin slice of fresh ginger are the usual pairings. You can also add a pinch of Darjeeling for a light black-tea backbone.</p></div></details>
<details><summary>How should I store dried curry leaves for tea?</summary><div><p>Keep the pouch sealed, cool, and away from steam and direct sun. Squeeze out air after each use. Well-stored shade-dried leaf stays fragrant for many months.</p></div></details>
<details><summary>Is curry leaf tea caffeinated?</summary><div><p>No. Curry leaves are a herbal infusion. If you blend with Darjeeling, the caffeine comes only from the black tea.</p></div></details>

<p><em>Written by Neer, founder, NutriThrive Australia.</em></p>

<div class="nt-article-cta">
<h3>Shop dried curry leaves</h3>
<p>Shade-dried on our farm, packed in Melbourne. Orders before 2pm Mon–Fri dispatch same day. Free AU shipping from $79.</p>
<div class="btn-row">
<a class="btn-solid" href="/products/curry-leaves/">Shop curry leaves ($7)</a>
<a class="btn-outline" href="/shipping">Shipping &amp; returns</a>
</div>
</div>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul>
<li><strong>4 Oct 2026:</strong> Added three recipes, leaves table, storage section, and FAQPage schema.</li>
<li><strong>3 Oct 2026:</strong> Rewrote for dried-leaf steeping only; removed health framing.</li>
<li><strong>27 Jun 2026:</strong> Article published.</li>
</ul>
</div>
<section class="nt-related-links-block">
 <h2 id="related-guides">Related guides</h2>
 <ul>
  <li><a href="/blog/dried-curry-leaves-australia-guide">Where to buy dried curry leaves in Australia</a></li>
  <li><a href="/blog/how-to-store-curry-leaves-fresh-dried-australia-2026">How to store curry leaves</a></li>
  <li><a href="/blog/curry-leaves-recipes-beyond-dal">Curry leaf recipes beyond dal</a></li>
  <li><a href="/blog/how-to-brew-darjeeling-tea-perfectly-2026">How to brew Darjeeling tea</a></li>
  <li><a href="/products/curry-leaves/">Shop dried curry leaves ($7)</a></li>
 </ul>
</section>
</div>
'''
    html = replace_between(
        html,
        '          <div class="prose">',
        '\n          <section class="article-conversion"',
        prose,
    )
    path.write_text(html, encoding="utf-8")
    print(f"2 tea words≈{word_count_prose(html)}")


# ---------------------------------------------------------------------------
# 3. recipes beyond dal
# ---------------------------------------------------------------------------
def boost_recipes():
    path = BLOG / "curry-leaves-recipes-beyond-dal.html"
    html = path.read_text(encoding="utf-8")
    title = "How to Use Dried Curry Leaves: 6 Recipes Beyond Dal"
    meta = "How to cook with dried curry leaves: tadka basics, how many to use, and 6 recipes from lemon rice to curry leaf oil. Shade-dried 30g pouch from Melbourne."
    faqs = [
        (
            "Can I use dried curry leaves without rehydrating them?",
            "Yes for tadka in hot oil. Soak only when you are blending leaves into a paste, as in chutney.",
        ),
        (
            "How long does a 30g pouch last?",
            "With weekday cooking, a 30g shade-dried pouch typically lasts one to two months. Reseal after each use and keep it away from steam.",
        ),
        (
            "How long does curry leaf oil keep?",
            "About two weeks refrigerated in a sealed jar.",
        ),
        (
            "Do dried curry leaves taste as good as fresh?",
            "Close. Slightly softer aroma, which is why many cooks use a bit more dried leaf by volume (about 2–3×).",
        ),
        (
            "What can I substitute if I run out mid-recipe?",
            "There is no perfect swap. Lime zest or kaffir lime leaf can hint at the citrus note in a pinch. See our curry leaf substitute guide for a ranked list.",
        ),
    ]
    html = set_meta(html, title, meta)
    html = update_jsonld(html, title, meta, date_published="2026-08-09")
    html = insert_faq_jsonld(html, faqs)
    html = re.sub(
        r'        <a href="/">Home</a> / <a href="/blog/">Blog</a> / <span>.*?</span>',
        f'        <a href="/">Home</a> / <a href="/blog/">Blog</a> / <span>{title}</span>',
        html,
        count=1,
    )

    head_block = f"""          <p class="meta-line">Curry leaves · Published <time datetime="2026-08-09">9 Aug 2026</time> · Updated <time datetime="{DM}">4 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a></p>
          <h1>{title}</h1>
          <p class="lede">{meta}</p>
          <div class="article-hero"><img src="/assets/images/blog/curry-leaves-recipes-beyond-dal-hero.webp?v=20260915-1" alt="{title}" width="1200" height="675" fetchpriority="high"></div>
          <aside class="article-quick-product" aria-label="Related NutriThrive product">
            <div><span>Related product</span><strong>Dried Curry Leaves · $7.00 / 30g</strong></div>
            <a href="/products/curry-leaves/" data-funnel-event="article_early_product_click" data-article="curry-leaves-recipes-beyond-dal" data-product="curry-leaves">Get curry leaves</a>
          </aside>
          <nav class="article-toc" aria-labelledby="contents-curry-leaves-recipes-beyond-dal">
      <h2 id="contents-curry-leaves-recipes-beyond-dal">On this page</h2>
      <ol><li><a href="#quick-answer" data-funnel-event="article_contents_click" data-article="curry-leaves-recipes-beyond-dal">Quick answer</a></li><li><a href="#tadka-60" data-funnel-event="article_contents_click" data-article="curry-leaves-recipes-beyond-dal">Tadka in 60 seconds</a></li><li><a href="#lemon-rice" data-funnel-event="article_contents_click" data-article="curry-leaves-recipes-beyond-dal">1. Lemon rice</a></li><li><a href="#chutney" data-funnel-event="article_contents_click" data-article="curry-leaves-recipes-beyond-dal">2. Curry leaf chutney</a></li><li><a href="#tempered-eggs" data-funnel-event="article_contents_click" data-article="curry-leaves-recipes-beyond-dal">3. Tempered eggs</a></li><li><a href="#roasted-potatoes" data-funnel-event="article_contents_click" data-article="curry-leaves-recipes-beyond-dal">4. Roasted potatoes</a></li><li><a href="#finishing-oil" data-funnel-event="article_contents_click" data-article="curry-leaves-recipes-beyond-dal">5. Finishing oil</a></li><li><a href="#coconut-beans" data-funnel-event="article_contents_click" data-article="curry-leaves-recipes-beyond-dal">6. Coconut green beans</a></li><li><a href="#pouch-lasts" data-funnel-event="article_contents_click" data-article="curry-leaves-recipes-beyond-dal">How long the pouch lasts</a></li><li><a href="#faq" data-funnel-event="article_contents_click" data-article="curry-leaves-recipes-beyond-dal">FAQ</a></li></ol>
    </nav>
"""
    html = replace_between(
        html,
        '          <p class="meta-line">',
        '          <div class="prose">',
        head_block,
    )

    prose = r'''          <div class="prose">

<div class="nt-quick-answer">
<h2 id="quick-answer">Quick answer</h2>
<p>Fry dried curry leaves in hot oil for 30 to 60 seconds (tadka), then build lemon rice, chutney, eggs, potatoes, finishing oil, or coconut green beans. Use about double to triple the volume you would use of fresh leaves. A shade-dried 30g pouch from Melbourne covers weeks of weekday cooking.</p>
</div>

<p>Dal is the obvious home for curry leaves, but the same tempering trick lifts weekday cooking across the board. You are not sprinkling ground masala: whole karipatta in shimmering oil releases a citrusy, nutty aroma that curry powder cannot copy. Below: the 60-second technique, then six recipes that use it.</p>

<div class="answer-box" id="tadka-60">
<h2>Tadka in 60 seconds</h2>
<ol>
<li>Heat 1–2 tbsp oil or ghee until it shimmers.</li>
<li>Add 8–12 dried curry leaves (they should crackle).</li>
<li>Optional: mustard seeds, a dried red chilli, or a pinch of asafoetida.</li>
<li>Fry 30–60 seconds until fragrant and just crisp at the edges.</li>
<li>Pour over dal/rice or keep cooking in the same pan.</li>
</ol>
<p>That infused oil is the flavour base for every recipe below. Do not walk away — leaves go from fragrant to bitter if they burn.</p>
</div>

<h2 id="lemon-rice">1. South Indian lemon rice</h2>
<p>After the leaf tadka, add mustard seeds, a dried red chilli, and a pinch of turmeric. Fold through cooked rice, lemon juice, salt, and a spoon of roasted peanuts or fried chana dal for crunch. Lunchbox-friendly and ready in under 15 minutes with leftover rice.</p>

<h2 id="chutney">2. Quick curry leaf chutney</h2>
<p>Soak a generous handful of dried leaves in warm water for five minutes, then blend with grated coconut, green chilli, ginger, and tamarind or lime. Temper the finished chutney with mustard seeds and extra leaves in oil. Keeps about a week refrigerated. Serve with dosa, idli, or toast.</p>

<h2 id="tempered-eggs">3. Curry leaf tempered eggs</h2>
<p>Fry curry leaves with sliced onion in oil until the onion softens. Pour in beaten eggs and scramble. The leaves crisp at the edges and add texture as well as aroma — a simple breakfast that feels different from plain eggs.</p>

<h2 id="roasted-potatoes">4. Roasted potatoes with curry leaf oil</h2>
<p>Roast or pan-fry potatoes until golden. Meanwhile, fry extra leaves in neutral oil, strain if you like, and toss the potatoes with that oil, mustard seeds, and a pinch of chilli powder just before serving. Works beside dal, grilled fish, or a simple salad.</p>

<h2 id="finishing-oil">5. Curry leaf finishing oil</h2>
<p>Fry a large handful of dried leaves in oil until crisp, cool, and store in a sealed jar in the fridge for up to two weeks. Spoon over soup, plain rice, roasted vegetables, or dal when you want instant aroma without starting a full tadka.</p>

<h2 id="coconut-beans">6. Coconut green beans (poriyal-style)</h2>
<p>Steam or boil green beans until just tender. Make a tadka with dried curry leaves, mustard seeds, and a dried chilli. Toss the beans with the tempering, a handful of grated coconut (fresh or desiccated, lightly toasted), salt, and a squeeze of lemon. Ten minutes, weeknight-friendly, and a clear reason to keep the pouch on the counter.</p>

<h2 id="pouch-lasts">How long the 30g pouch lasts</h2>
<p>A shade-dried <strong>30g pouch</strong> typically lasts <strong>one to two months</strong> of weekday tadka if you reseal it after each use. Tea drinkers who also cook from the same pouch may finish it sooner. Keep it cool, dry, and away from the stove’s steam. When leaves smell flat, replace them — aroma is the point.</p>
<p>Stocking the pantry? <a href="/products/curry-leaves/">Shop NutriThrive dried curry leaves</a> ($7 / 30g), shade-dried and packed in Melbourne. Want tea in the same order? The <a href="/products/combo-pack/">combo pack</a> pairs curry leaves with Darjeeling for $17.</p>

<h2 id="dried-vs-fresh">Dried vs fresh (quick note)</h2>
<p>Fresh bunches wilt within days and are hit-and-miss outside Indian grocers. Dried leaf keeps for months, fries straight into oil, and rehydrates well for chutney. Plan on two to three times the volume of dried versus fresh for a similar hit of aroma.</p>

<h2 id="faq">FAQ</h2>
<details><summary>Can I use dried curry leaves without rehydrating them?</summary><div><p>Yes for tadka in hot oil. Soak only when you are blending leaves into a paste, as in chutney.</p></div></details>
<details><summary>How long does a 30g pouch last?</summary><div><p>With weekday cooking, a 30g shade-dried pouch typically lasts one to two months. Reseal after each use and keep it away from steam.</p></div></details>
<details><summary>How long does curry leaf oil keep?</summary><div><p>About two weeks refrigerated in a sealed jar.</p></div></details>
<details><summary>Do dried curry leaves taste as good as fresh?</summary><div><p>Close. Slightly softer aroma, which is why many cooks use a bit more dried leaf by volume (about 2–3×).</p></div></details>
<details><summary>What can I substitute if I run out mid-recipe?</summary><div><p>There is no perfect swap. Lime zest or kaffir lime leaf can hint at the citrus note in a pinch. For a full ranked list, see our <a href="/blog/curry-leaves-substitute-what-to-use-2026">curry leaf substitute guide</a>.</p></div></details>

<p><em>Written by Neer, founder, NutriThrive Australia.</em></p>
<div class="nt-article-cta">
<h3>Shop dried curry leaves</h3>
<p>Shade-dried whole leaf for tadka, rice, eggs, and finishing oil. Packed in Melbourne.</p>
<div class="btn-row">
<a class="btn-solid" href="/products/curry-leaves/">Shop curry leaves</a>
<a class="btn-outline" href="/shipping">Shipping &amp; returns</a>
</div>
</div>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul>
<li><strong>4 Oct 2026:</strong> Added 6th recipe, 60-second tadka box, pouch-lasts section, FAQPage schema.</li>
<li><strong>3 Oct 2026:</strong> Full recipe rewrite; combo mention added.</li>
<li><strong>9 Aug 2026:</strong> Article published.</li>
</ul>
</div>
<section class="nt-related-links-block">
 <h2 id="related-guides">Related guides</h2>
 <ul>
  <li><a href="/blog/dried-curry-leaves-australia-guide">Where to buy dried curry leaves in Australia</a></li>
  <li><a href="/blog/curry-leaves-dahl-recipe-30-minutes-australia-2026">30-minute curry leaf dal</a></li>
  <li><a href="/blog/curry-leaves-tea-how-to-make-benefits-2026">Curry leaf tea from dried leaves</a></li>
  <li><a href="/blog/curry-leaves-substitute-what-to-use-2026">Curry leaf substitutes</a></li>
  <li><a href="/products/curry-leaves/">Shop dried curry leaves</a></li>
 </ul>
</section>
</div>
'''
    html = replace_between(
        html,
        '          <div class="prose">',
        '\n          <section class="article-conversion"',
        prose,
    )
    path.write_text(html, encoding="utf-8")
    print(f"3 recipes words≈{word_count_prose(html)}")


# ---------------------------------------------------------------------------
# 4. Diwali (urgent) — gift pack product boxes
# ---------------------------------------------------------------------------
def boost_diwali():
    path = BLOG / "diwali-gift-guide-curry-leaves-tea-australia.html"
    html = path.read_text(encoding="utf-8")
    title = "Diwali Gift Ideas Australia 2026: Tea, Spice &amp; Soap Gifts"
    title_plain = "Diwali Gift Ideas Australia 2026: Tea, Spice & Soap Gifts"
    meta = "Diwali is Sun 8 Nov 2026. Tea, curry leaf and handmade soap gift ideas under $40, posted from Melbourne. Order-by dates for every state."
    faqs = [
        (
            "When is Diwali in Australia in 2026?",
            "Diwali (Deepavali) falls on Sunday 8 November 2026. Dhanteras is Friday 6 November; Bhai Dooj is around 10–11 November depending on local observance.",
        ),
        (
            "What is in the NutriThrive gift pack?",
            "The $35 gift pack includes 100g moringa powder, 100g Darjeeling black tea, 30g dried curry leaves, and one 95g handmade moringa lavender soap — packed in Melbourne.",
        ),
        (
            "When should I order for Diwali delivery?",
            "Order by the state cut-off in this guide. We dispatch same day from Truganina before 2pm on business days. WA, TAS and NT need the longest buffer.",
        ),
        (
            "What Diwali gifts work under $20?",
            "Dried curry leaves ($7), Darjeeling tea ($7.50), handmade soap ($7), or the combo pack ($17) for tea plus curry leaves in one parcel.",
        ),
        (
            "Are pantry gifts suitable for coworkers?",
            "Yes. Small tea, spice, or soap gifts are practical for coworkers and neighbours without feeling overly personal.",
        ),
    ]
    html = set_meta(html, title, meta)
    # set_meta used entity in title for HTML title tag - fix plain in og via title with &amp; is fine for HTML
    html = update_jsonld(html, title_plain, meta, date_published="2026-08-09")
    html = insert_faq_jsonld(html, faqs)
    html = re.sub(
        r'        <a href="/">Home</a> / <a href="/blog/">Blog</a> / <span>.*?</span>',
        f'        <a href="/">Home</a> / <a href="/blog/">Blog</a> / <span>{title}</span>',
        html,
        count=1,
    )

    # Switch product boxes to gift-pack
    html = html.replace(
        """          <aside class="article-quick-product" aria-label="Related NutriThrive product">
            <div><span>Related product</span><strong>Dried Curry Leaves · $7.00 / 30g</strong></div>
            <a href="/products/curry-leaves/" data-funnel-event="article_early_product_click" data-article="diwali-gift-guide-curry-leaves-tea-australia" data-product="curry-leaves">Get curry leaves</a>
          </aside>""",
        """          <aside class="article-quick-product" aria-label="Related NutriThrive product">
            <div><span>Related product</span><strong>Gift Pack · $35.00</strong></div>
            <a href="/products/gift-pack/" data-funnel-event="article_early_product_click" data-article="diwali-gift-guide-curry-leaves-tea-australia" data-product="gift-pack">Shop gift pack</a>
          </aside>""",
    )
    html = html.replace(
        """          <section class="article-conversion" aria-labelledby="article-product-diwali-gift-guide-curry-leaves-tea-australia">
            <img src="/assets/images/product_webp/dried-curry-leaves-30g-main.webp?v=20260915-1" alt="Dried Curry Leaves 30g" width="240" height="300" loading="lazy">
            <div>
              <p class="kicker">A practical next step</p>
              <h2 id="article-product-diwali-gift-guide-curry-leaves-tea-australia">Dried Curry Leaves</h2>
              <p>Farm-grown karipatta from our own farm.</p>
              <p class="price">$7.00 / 30g</p>
              <div class="btn-row">
                <a class="btn btn-primary" href="/products/curry-leaves/" data-funnel-event="article_product_click" data-article="diwali-gift-guide-curry-leaves-tea-australia" data-product="curry-leaves">Get curry leaves</a>
                <a class="btn btn-secondary" href="/shipping" data-funnel-event="article_shipping_click">Delivery & returns</a>
              </div>
            </div>
          </section>""",
        """          <section class="article-conversion" aria-labelledby="article-product-diwali-gift-guide-curry-leaves-tea-australia">
            <img src="/assets/images/product_webp/nutrithrive-four-product-gift-pack-main.webp?v=20260915-1" alt="NutriThrive gift pack" width="240" height="300" loading="lazy">
            <div>
              <p class="kicker">A practical next step</p>
              <h2 id="article-product-diwali-gift-guide-curry-leaves-tea-australia">Gift Pack</h2>
              <p>Moringa powder, Darjeeling tea, curry leaves, and handmade soap — $35 from Melbourne.</p>
              <p class="price">$35.00</p>
              <div class="btn-row">
                <a class="btn btn-primary" href="/products/gift-pack/" data-funnel-event="article_product_click" data-article="diwali-gift-guide-curry-leaves-tea-australia" data-product="gift-pack">Shop gift pack</a>
                <a class="btn btn-secondary" href="/shipping" data-funnel-event="article_shipping_click">Delivery & returns</a>
              </div>
            </div>
          </section>""",
    )
    html = html.replace(
        """        <aside class="article-sidebar">
          <p class="kicker">From guide to product</p>
          <h2>Dried Curry Leaves</h2>
          <p>Farm-grown karipatta from our own farm.</p>
          <p class="price" style="font-weight:600;font-size:20px;margin:0 0 16px">$7.00 / 30g</p>
          <a class="btn btn-primary btn-block" href="/products/curry-leaves/" data-funnel-event="article_sidebar_product_click" data-article="diwali-gift-guide-curry-leaves-tea-australia" data-product="curry-leaves">Get curry leaves</a>""",
        """        <aside class="article-sidebar">
          <p class="kicker">From guide to product</p>
          <h2>Gift Pack</h2>
          <p>Moringa powder, Darjeeling tea, curry leaves, and handmade soap.</p>
          <p class="price" style="font-weight:600;font-size:20px;margin:0 0 16px">$35.00</p>
          <a class="btn btn-primary btn-block" href="/products/gift-pack/" data-funnel-event="article_sidebar_product_click" data-article="diwali-gift-guide-curry-leaves-tea-australia" data-product="gift-pack">Shop gift pack</a>""",
    )

    head_block = f"""          <p class="meta-line">Gifts · Published <time datetime="2026-08-09">9 Aug 2026</time> · Updated <time datetime="{DM}">4 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a></p>
          <h1>{title}</h1>
          <p class="lede">{meta}</p>
          <div class="article-hero"><img src="/assets/images/blog/diwali-gift-guide-curry-leaves-tea-australia-hero.webp?v=20260915-1" alt="{title_plain}" width="1200" height="675" fetchpriority="high"></div>
"""
    # Keep gift-pack quick product already replaced — rebuild from meta-line through toc
    # Find and replace from meta-line through end of toc (before prose)
    toc = """          <nav class="article-toc" aria-labelledby="contents-diwali-gift-guide-curry-leaves-tea-australia">
      <h2 id="contents-diwali-gift-guide-curry-leaves-tea-australia">On this page</h2>
      <ol><li><a href="#dates-2026" data-funnel-event="article_contents_click" data-article="diwali-gift-guide-curry-leaves-tea-australia">2026 festival dates</a></li><li><a href="#order-by" data-funnel-event="article_contents_click" data-article="diwali-gift-guide-curry-leaves-tea-australia">Order-by dates by state</a></li><li><a href="#by-budget" data-funnel-event="article_contents_click" data-article="diwali-gift-guide-curry-leaves-tea-australia">Gifts by budget</a></li><li><a href="#hampers" data-funnel-event="article_contents_click" data-article="diwali-gift-guide-curry-leaves-tea-australia">Hamper ideas</a></li><li><a href="#gift-pack" data-funnel-event="article_contents_click" data-article="diwali-gift-guide-curry-leaves-tea-australia">The $35 gift pack</a></li><li><a href="#faq" data-funnel-event="article_contents_click" data-article="diwali-gift-guide-curry-leaves-tea-australia">FAQ</a></li><li><a href="#further-reading" data-funnel-event="article_contents_click" data-article="diwali-gift-guide-curry-leaves-tea-australia">Further reading</a></li></ol>
    </nav>
"""
    # Replace from meta-line to prose, preserving the gift-pack aside we already set
    m = re.search(
        r'(          <p class="meta-line">.*?</aside>\n)(          <nav class="article-toc".*?</nav>\n)',
        html,
        re.S,
    )
    if not m:
        raise ValueError("diwali head/toc block not found")
    quick = """          <aside class="article-quick-product" aria-label="Related NutriThrive product">
            <div><span>Related product</span><strong>Gift Pack · $35.00</strong></div>
            <a href="/products/gift-pack/" data-funnel-event="article_early_product_click" data-article="diwali-gift-guide-curry-leaves-tea-australia" data-product="gift-pack">Shop gift pack</a>
          </aside>
"""
    html = (
        html[: m.start()]
        + head_block
        + quick
        + toc
        + html[m.end() :]
    )

    prose = r'''          <div class="prose">

<div class="answer-box" id="dates-2026">
<h2>2026 Diwali dates (Australia)</h2>
<ul>
<li><strong>Dhanteras:</strong> Friday 6 November 2026</li>
<li><strong>Diwali (Deepavali):</strong> Sunday 8 November 2026</li>
<li><strong>Bhai Dooj:</strong> Monday–Tuesday 10–11 November 2026 (local observance varies)</li>
</ul>
<p>Sweets are everywhere by mid-week. Tea, spice, and soap gifts get used after the festival ends — that is the bar for this guide.</p>
</div>

<p>We pack orders in Truganina, Melbourne, and ship Australia-wide. Same-day dispatch on orders before 2pm Monday–Friday. Free AU shipping from $79; under that, standard shipping applies (see <a href="/shipping">shipping</a>).</p>

<h2 id="order-by">Order-by dates by state (for Diwali Sun 8 Nov)</h2>
<p>Buffer for courier transit from Melbourne. Order earlier if you need the gift in hand for Dhanteras (6 Nov) or a Friday office swap.</p>
<table>
<thead>
<tr><th>State / territory</th><th>Order by (before 2pm)</th><th>Notes</th></tr>
</thead>
<tbody>
<tr><td>VIC</td><td>Thu 5 Nov 2026</td><td>Often arrives Fri; local Melbourne can stretch to Fri 6 Nov</td></tr>
<tr><td>NSW / ACT</td><td>Tue 3 Nov 2026</td><td>Allow 2–4 business days</td></tr>
<tr><td>QLD</td><td>Tue 3 Nov 2026</td><td>Regional QLD: order Mon 2 Nov</td></tr>
<tr><td>SA</td><td>Tue 3 Nov 2026</td><td>Adelaide metro usually 2–4 days</td></tr>
<tr><td>TAS</td><td>Mon 2 Nov 2026</td><td>Island transit needs buffer</td></tr>
<tr><td>WA</td><td>Fri 30 Oct 2026</td><td>Longest mainland transit</td></tr>
<tr><td>NT</td><td>Fri 30 Oct 2026</td><td>Order with WA buffer</td></tr>
</tbody>
</table>
<p>Public holidays and peak courier volume can add a day — if the gift is for a Saturday gathering, move your cut-off earlier by one business day.</p>

<h2 id="by-budget">Gifts by budget</h2>

<h3>Under $10</h3>
<ul>
<li><a href="/products/curry-leaves/">Dried curry leaves</a> — $7 / 30g, shade-dried for tadka</li>
<li><a href="/products/black-tea/">Darjeeling black tea</a> — $7.50 / 100g loose leaf</li>
<li><a href="/products/moringa-soap/">Handmade moringa soap</a> — $7 / 95g lavender bar</li>
</ul>
<p>Ideal for coworkers, neighbours, teachers, and “just a little something” for relatives who already have mithai.</p>

<h3>Under $20</h3>
<ul>
<li><a href="/products/combo-pack/">Combo pack</a> — $17 (curry leaves + Darjeeling in one parcel)</li>
<li>Tea + soap, or curry leaves + soap, as a small DIY pair</li>
</ul>

<h3>Under $40</h3>
<ul>
<li><a href="/products/gift-pack/">Gift pack</a> — <strong>$35</strong>, four products ready to hand over</li>
<li>Two combos, or tea + curry leaves + soap assembled yourself</li>
</ul>

<h2 id="hampers">Hamper ideas (DIY)</h2>
<ul>
<li><strong>Cook’s hamper:</strong> Curry leaves + a small jar of mustard seeds from your pantry + a handwritten lemon-rice note. Link them to <a href="/blog/curry-leaves-recipes-beyond-dal">recipes beyond dal</a>.</li>
<li><strong>Tea tray:</strong> Darjeeling + a simple mug or strainer you already own + a brew tip card (<a href="/blog/how-to-brew-darjeeling-tea-perfectly-2026">brew guide</a>).</li>
<li><strong>Wellness shelf:</strong> Gift pack as-is, or add a ribbon — moringa powder, tea, curry leaves, and soap cover kitchen and bathroom without guessing dessert preferences.</li>
</ul>
<p>Keep packaging dry. Avoid perfume-scented tissue near loose tea. Do not refrigerate dried leaves or tea before gifting.</p>

<h2 id="gift-pack">The $35 gift pack (includes moringa powder)</h2>
<p>The ready-to-give option is the <a href="/products/gift-pack/">NutriThrive gift pack at $35</a>. It includes:</p>
<ul>
<li>100g moringa powder</li>
<li>100g Darjeeling black tea</li>
<li>30g dried curry leaves</li>
<li>95g handmade moringa lavender soap</li>
</ul>
<p>Combined regular value is higher than $35; you get one clean parcel from Melbourne without assembling four checkouts. Best when you are buying for a household, a host, or anyone you want to cover cooking, tea, and a small soap gift in one go.</p>

<h2 id="why-pantry">Why pantry gifts beat leftover mithai</h2>
<p>Festival sweets are generous, and most households already have plenty by the second week. A pouch of dried curry leaves or a tin of Darjeeling disappears into real routines — tadka for dal, a mid-afternoon cup — instead of waiting for a special occasion that never comes. Pantry staples also travel well and do not melt in warm weather.</p>

<h2 id="faq">FAQ</h2>
<details><summary>When is Diwali in Australia in 2026?</summary><div><p>Diwali (Deepavali) falls on Sunday 8 November 2026. Dhanteras is Friday 6 November; Bhai Dooj is around 10–11 November depending on local observance.</p></div></details>
<details><summary>What is in the NutriThrive gift pack?</summary><div><p>The $35 gift pack includes 100g moringa powder, 100g Darjeeling black tea, 30g dried curry leaves, and one 95g handmade moringa lavender soap — packed in Melbourne.</p></div></details>
<details><summary>When should I order for Diwali delivery?</summary><div><p>Order by the state cut-off in this guide. We dispatch same day from Truganina before 2pm on business days. WA, TAS and NT need the longest buffer.</p></div></details>
<details><summary>What Diwali gifts work under $20?</summary><div><p>Dried curry leaves ($7), Darjeeling tea ($7.50), handmade soap ($7), or the combo pack ($17) for tea plus curry leaves in one parcel.</p></div></details>
<details><summary>Are pantry gifts suitable for coworkers?</summary><div><p>Yes. Small tea, spice, or soap gifts are practical for coworkers and neighbours without feeling overly personal.</p></div></details>

<p><em>Written by Neer, founder, NutriThrive Australia.</em></p>
<div class="nt-article-cta">
<h3>Gift something they’ll actually use</h3>
<p>Ready-wrapped spirit: the $35 gift pack with moringa powder, tea, curry leaves, and soap. Same-day dispatch before 2pm from Melbourne.</p>
<div class="btn-row">
<a class="btn-solid" href="/products/gift-pack/">Shop gift pack</a>
<a class="btn-outline" href="/shipping">Shipping &amp; returns</a>
</div>
</div>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul>
<li><strong>4 Oct 2026:</strong> 2026 dates, state order-by table, budget tiers, gift-pack focus, FAQPage schema.</li>
<li><strong>9 Aug 2026:</strong> Article published.</li>
</ul>
</div>
<section class="nt-related-links-block">
 <h2 id="further-reading">Further reading</h2>
 <ul>
  <li><a href="/blog/curry-leaves-recipes-beyond-dal">How to use dried curry leaves: 6 recipes</a></li>
  <li><a href="/blog/how-to-brew-darjeeling-tea-perfectly-2026">How to brew Darjeeling tea</a></li>
  <li><a href="/blog/dried-curry-leaves-australia-guide">Where to buy dried curry leaves</a></li>
  <li><a href="/products/gift-pack/">Shop the gift pack</a></li>
  <li><a href="/shipping">Shipping &amp; returns</a></li>
 </ul>
</section>
</div>
'''
    html = replace_between(
        html,
        '          <div class="prose">',
        '\n          <section class="article-conversion"',
        prose,
    )
    path.write_text(html, encoding="utf-8")
    print(f"4 diwali words≈{word_count_prose(html)}")


# ---------------------------------------------------------------------------
# 5. hair — no regrow/greying/cholesterol claims
# ---------------------------------------------------------------------------
def boost_hair():
    path = BLOG / "can-you-use-dried-curry-leaves-for-hair-2026.html"
    html = path.read_text(encoding="utf-8")
    title = "Dried Curry Leaves for Hair: How to Use Them (Oil &amp; Rinse)"
    title_plain = "Dried Curry Leaves for Hair: How to Use Them (Oil & Rinse)"
    meta = "Using dried curry leaves for hair: coconut-oil infusion, rinse and mask methods, how many leaves, patch-testing, and what the evidence really shows."
    faqs = [
        (
            "Can dried curry leaves be used for hair?",
            "Yes. Many traditional oil and rinse methods work with dried leaf. Rehydrate in warm oil or water; patch-test before first use.",
        ),
        (
            "Is there strong clinical proof curry leaves change hair outcomes?",
            "No. There is not strong peer-reviewed clinical evidence confirming specific hair outcomes from curry leaf oil or rinses. This is traditional and anecdotal use, not a clinically proven treatment.",
        ),
        (
            "How do I make curry leaf hair oil with dried leaves?",
            "Warm coconut or olive oil on low heat, add a generous handful of dried leaves, simmer gently 10–15 minutes, strain, cool, and massage into the scalp. Patch-test first.",
        ),
        (
            "How many dried leaves do I need?",
            "For one oil batch: about 2–3 tablespoons dried leaves per 100–150 ml oil. For a rinse: a small handful in 500 ml water.",
        ),
        (
            "Should I patch-test?",
            "Yes. Apply a little oil or rinse behind the ear or on the inner wrist, wait 24 hours, and only continue if there is no redness or irritation.",
        ),
    ]
    html = set_meta(html, title, meta)
    html = update_jsonld(html, title_plain, meta, date_published="2026-06-21")
    html = insert_faq_jsonld(html, faqs)
    html = re.sub(
        r'        <a href="/">Home</a> / <a href="/blog/">Blog</a> / <span>.*?</span>',
        f'        <a href="/">Home</a> / <a href="/blog/">Blog</a> / <span>{title}</span>',
        html,
        count=1,
    )

    head_block = f"""          <p class="meta-line">Curry leaves · Published <time datetime="2026-06-21">21 June 2026</time> · Updated <time datetime="{DM}">4 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a></p>
          <h1>{title}</h1>
          <p class="lede">{meta}</p>
          <div class="article-hero"><img src="/assets/images/homepage/product-showcase/Curry.webp?v=20260915-1" alt="{title_plain}" width="1200" height="675" fetchpriority="high"></div>
          <aside class="article-quick-product" aria-label="Related NutriThrive product">
            <div><span>Related product</span><strong>Dried Curry Leaves · $7.00 / 30g</strong></div>
            <a href="/products/curry-leaves/" data-funnel-event="article_early_product_click" data-article="can-you-use-dried-curry-leaves-for-hair-2026" data-product="curry-leaves">Get curry leaves</a>
          </aside>
          <nav class="article-toc" aria-labelledby="contents-can-you-use-dried-curry-leaves-for-hair-2026">
      <h2 id="contents-can-you-use-dried-curry-leaves-for-hair-2026">On this page</h2>
      <ol><li><a href="#quick-answer" data-funnel-event="article_contents_click" data-article="can-you-use-dried-curry-leaves-for-hair-2026">Quick answer</a></li><li><a href="#evidence" data-funnel-event="article_contents_click" data-article="can-you-use-dried-curry-leaves-for-hair-2026">What the evidence shows</a></li><li><a href="#patch-test" data-funnel-event="article_contents_click" data-article="can-you-use-dried-curry-leaves-for-hair-2026">Patch-test first</a></li><li><a href="#oil" data-funnel-event="article_contents_click" data-article="can-you-use-dried-curry-leaves-for-hair-2026">Coconut-oil infusion</a></li><li><a href="#rinse" data-funnel-event="article_contents_click" data-article="can-you-use-dried-curry-leaves-for-hair-2026">Leaf rinse</a></li><li><a href="#mask" data-funnel-event="article_contents_click" data-article="can-you-use-dried-curry-leaves-for-hair-2026">Mask / paste</a></li><li><a href="#how-many" data-funnel-event="article_contents_click" data-article="can-you-use-dried-curry-leaves-for-hair-2026">How many leaves</a></li><li><a href="#faq" data-funnel-event="article_contents_click" data-article="can-you-use-dried-curry-leaves-for-hair-2026">FAQ</a></li></ol>
    </nav>
"""
    html = replace_between(
        html,
        '          <p class="meta-line">',
        '          <div class="prose">',
        head_block,
    )

    prose = r'''          <div class="prose">

<div class="answer-box">
<h2 id="quick-answer">Quick answer</h2>
<p>Yes — you can use dried curry leaves for traditional hair oil, rinse, and mask methods. Expect a kitchen-herb ritual, not a clinical treatment. Patch-test first. This page covers how to do it with a pantry pouch, how many leaves to use, and what the evidence actually supports.</p>
</div>

<p><strong>Who wrote this:</strong> Neer, NutriThrive. We pack shade-dried curry leaves from Truganina, Melbourne. This is general traditional-use guidance, not medical or dermatological advice.</p>

<p>Nearly every guide insists on fresh leaves. If you already keep dried karipatta for cooking, you can use the same pouch. Drying softens some aroma, but oil infusions and rinses were never about the leaf being fresh at the exact moment of use — heat transfers compounds into oil or water either way.</p>

<h2 id="evidence">What the evidence really shows</h2>
<p>Worth being direct: there is <strong>not</strong> strong peer-reviewed clinical evidence confirming that curry leaf oil or rinses deliver specific hair outcomes in controlled trials. Traditional Ayurvedic and home use has a long history and plenty of anecdote. That is not the same as a randomised trial.</p>
<p>We will not claim that dried curry leaves will reverse thinning, change pigment, or treat a scalp condition. If you enjoy the ritual and your skin tolerates it, treat it like any other herbal oil or rinse: optional, consistent, and secondary to proven haircare and medical advice when something is wrong.</p>

<div class="warn-box" id="patch-test">
<h2>Patch-test first</h2>
<p><strong>Before any scalp use:</strong> Apply a small amount of your cooled oil or rinse behind your ear or on your inner wrist. Wait 24 hours. Only continue if there is no redness, itching, or irritation. Stop immediately if you react. People with sensitive skin, scalp conditions, or known plant allergies should ask a clinician before trying new topicals.</p>
</div>

<h2 id="oil">Method 1: Coconut-oil infusion</h2>
<p><strong>You need:</strong> 100–150 ml coconut oil (or olive oil) · 2–3 tbsp dried curry leaves</p>
<ol>
<li>Warm the oil on low heat — do not smoke it.</li>
<li>Add the dried leaves. Simmer gently 10 to 15 minutes until leaves crisp slightly and the oil takes a faint tint.</li>
<li>Cool, strain, and store in a clean jar.</li>
<li>Massage a small amount into the scalp; leave 30–60 minutes (or overnight if that suits your hair), then wash as usual.</li>
</ol>
<p>Once or twice weekly is the usual traditional pace. More is not better if it irritates your scalp or weighs hair down.</p>

<h2 id="rinse">Method 2: Curry leaf rinse</h2>
<p><strong>You need:</strong> A small handful of dried leaves · 500 ml water</p>
<ol>
<li>Simmer leaves in water about 10 minutes.</li>
<li>Cool completely, then strain.</li>
<li>After shampooing, pour as a final rinse; do not rinse out unless residue bothers you.</li>
</ol>
<p>Lowest-effort method and a reasonable way to start before committing to oil.</p>

<h2 id="mask">Method 3: Rehydrated leaf mask</h2>
<p>Soak 2–3 tbsp dried leaves in warm water 15 to 20 minutes. Blend with a spoon of yoghurt or coconut milk into a coarse paste. Apply to lengths (and scalp only if patch-test passed), leave 15–20 minutes, rinse. Texture will not match fresh-leaf paste, but it is workable from a dried pouch.</p>

<h2 id="how-many">How many dried leaves to use</h2>
<table>
<thead>
<tr><th>Method</th><th>Dried leaves</th><th>Liquid</th></tr>
</thead>
<tbody>
<tr><td>Oil infusion</td><td>2–3 tbsp</td><td>100–150 ml oil</td></tr>
<tr><td>Rinse</td><td>Small handful (~1–2 tbsp)</td><td>500 ml water</td></tr>
<tr><td>Mask / paste</td><td>2–3 tbsp (soaked)</td><td>Splash of water + yoghurt/coconut milk</td></tr>
</tbody>
</table>
<p>Cooking and haircare can share one pouch — just keep scoops dry and clean. Shop <a href="/products/curry-leaves/">dried curry leaves</a> ($7 / 30g) if you need a fresh pack; product boxes on this page stay on curry leaves only.</p>

<h2 id="consistency">Consistency over single treatments</h2>
<p>Traditional guidance points to regular use over weeks, not one dramatic session. If nothing changes, that is normal — this is not a guaranteed cosmetic result. Keep expectations aligned with the evidence section above.</p>

<h2 id="faq">FAQ</h2>
<details><summary>Can dried curry leaves be used for hair?</summary><div><p>Yes. Many traditional oil and rinse methods work with dried leaf. Rehydrate in warm oil or water; patch-test before first use.</p></div></details>
<details><summary>Is there strong clinical proof curry leaves change hair outcomes?</summary><div><p>No. There is not strong peer-reviewed clinical evidence confirming specific hair outcomes from curry leaf oil or rinses. This is traditional and anecdotal use, not a clinically proven treatment.</p></div></details>
<details><summary>How do I make curry leaf hair oil with dried leaves?</summary><div><p>Warm coconut or olive oil on low heat, add a generous handful of dried leaves, simmer gently 10–15 minutes, strain, cool, and massage into the scalp. Patch-test first.</p></div></details>
<details><summary>How many dried leaves do I need?</summary><div><p>For one oil batch: about 2–3 tablespoons dried leaves per 100–150 ml oil. For a rinse: a small handful in 500 ml water.</p></div></details>
<details><summary>Should I patch-test?</summary><div><p>Yes. Apply a little oil or rinse behind the ear or on the inner wrist, wait 24 hours, and only continue if there is no redness or irritation.</p></div></details>

<p><em>Written by Neer, founder, NutriThrive Australia. General information only — not medical advice.</em></p>
<div class="nt-article-cta">
<h3>Shade-dried curry leaves</h3>
<p>Whole-leaf pouch for cooking — and for traditional oil or rinse methods if you choose. $7 / 30g. Packed in Melbourne.</p>
<div class="btn-row">
<a class="btn-solid" href="/products/curry-leaves/">Shop curry leaves</a>
<a class="btn-outline" href="/shipping">Shipping &amp; returns</a>
</div>
</div>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul>
<li><strong>4 Oct 2026:</strong> Methods expanded; honest evidence; patch-test box; no outcome claims; FAQPage schema.</li>
<li><strong>21 Jun 2026:</strong> Article published.</li>
</ul>
</div>
<section class="nt-related-links-block">
 <h2 id="related-guides">Related guides</h2>
 <ul>
  <li><a href="/blog/dried-curry-leaves-australia-guide">Where to buy dried curry leaves</a></li>
  <li><a href="/blog/curry-leaves-tea-how-to-make-benefits-2026">Curry leaf tea from dried leaves</a></li>
  <li><a href="/blog/curry-leaves-recipes-beyond-dal">Recipes beyond dal</a></li>
  <li><a href="/products/curry-leaves/">Shop dried curry leaves</a></li>
 </ul>
</section>
</div>
'''
    html = replace_between(
        html,
        '          <div class="prose">',
        '\n          <section class="article-conversion"',
        prose,
    )
    # Prefer curry product image on hero if moringa og was used
    html = html.replace(
        "/assets/images/og/moringa-article-1200.jpg",
        "/assets/images/homepage/product-showcase/Curry.webp",
    )
    path.write_text(html, encoding="utf-8")
    print(f"5 hair words≈{word_count_prose(html)}")


def verify_australia_guide_title():
    path = BLOG / "dried-curry-leaves-australia-guide.html"
    html = path.read_text(encoding="utf-8")
    want = "Where to Buy Dried Curry Leaves in Australia: Coles vs Web"
    ok = want in html and f"<h1>{want}</h1>" in html
    print(f"6 australia-guide title ok={ok}")


def main():
    boost_vs_powder()
    boost_tea()
    boost_recipes()
    boost_diwali()
    boost_hair()
    verify_australia_guide_title()


if __name__ == "__main__":
    main()
