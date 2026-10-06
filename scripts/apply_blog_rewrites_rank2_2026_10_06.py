#!/usr/bin/env python3
"""Apply Rank-2 commercial intercept blog rewrites (8 existing URLs, Oct 2026)."""
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
DATA = Path(__file__).resolve().parent / "blog_rewrite_data"

_spec = importlib.util.spec_from_file_location(
    "rw13", ROOT / "scripts" / "apply_blog_rewrites_1_3_2026_10_05.py"
)
rw = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(rw)

faq_entity = rw.faq_entity
build_toc = rw.build_toc
SCHEMA_ORG = rw.SCHEMA_ORG
AUTHOR = rw.AUTHOR


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
                "name": "Moringa",
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


GREENS_FAQ = [
    faq_entity(
        "What is the difference between CW greens and moringa powder?",
        "Chemist Warehouse greens products are usually multi-ingredient blends. NutriThrive moringa is single-ingredient leaf powder for food and drinks.",
    ),
    faq_entity(
        "Is NutriThrive moringa organic?",
        "No. It is farm-grown and not ACO-certified organic. If you need certified organic, choose a certified brand.",
    ),
    faq_entity(
        "Does Chemist Warehouse sell moringa capsules?",
        "CW often stocks capsule formats for moringa. See our Chemist Warehouse moringa powder vs capsules guide for format notes.",
    ),
    faq_entity(
        "What sizes does NutriThrive sell?",
        "See live prices on the moringa powder product page — currently 100g, 200g and 400g pouches packed in Truganina.",
    ),
]

AG1_FAQ = [
    faq_entity(
        "Is NutriThrive an AG1 alternative that replaces AG1?",
        "No. We sell plain moringa leaf powder. We do not claim to clone or replace AG1.",
    ),
    faq_entity(
        "Is NutriThrive organic?",
        "No. Farm-grown, not ACO-certified organic.",
    ),
    faq_entity(
        "Where do I see current NutriThrive prices?",
        "On the moringa powder product page.",
    ),
]

ROSABELLA_FAQ = [
    faq_entity("Do you sell Rosabella?", "No."),
    faq_entity(
        "Is NutriThrive organic?",
        "No — farm-grown, not ACO-certified organic.",
    ),
    faq_entity(
        "Where should I buy NutriThrive powder?",
        "Shop moringa powder on the product page for live sizes and prices.",
    ),
]

HEAVY_FAQ = [
    faq_entity(
        "What should I ask a moringa seller about heavy metals?",
        "Ask for a recent, batch-linked CoA or lab summary that lists heavy metals with units and limits.",
    ),
    faq_entity(
        "Does organic certification replace metals testing?",
        "No. Ask for both if both matter to you.",
    ),
    faq_entity(
        "Where is NutriThrive’s lab summary?",
        "On the product page and in the NMI lab report summary PDF.",
    ),
]

PATCHES_FAQ = [
    faq_entity(
        "Do moringa patches work?",
        "We sell food-use powder, not patches, and do not make medical claims about patch products. Evaluate patch brands on their own evidence and labels.",
    ),
    faq_entity("Do you sell Glorenda or Healrize?", "No."),
    faq_entity(
        "Where do I buy NutriThrive powder?",
        "Shop moringa powder — live sizes and prices on the product page. Free AU shipping from $79.",
    ),
]

BRANDS_FAQ = [
    faq_entity(
        "What is the best moringa powder in Australia?",
        "There is no single best brand for every shopper. Compare ingredients, paperwork, pack location and $/100g on dated prices.",
    ),
    faq_entity(
        "Is NutriThrive organic?",
        "No. Farm-grown, not ACO-certified organic.",
    ),
    faq_entity(
        "Should I buy on iHerb or Amazon instead?",
        "You can — run the same label and freight checks. Direct from us if you want our farm-grown pouch and NMI summary.",
    ),
]

SHADE_FAQ = [
    faq_entity(
        "Is shade-dried always better than sun-dried?",
        "Not automatically. Ask how the leaf was processed, then check ingredients, dates and lab paperwork.",
    ),
    faq_entity(
        "Does NutriThrive sun-dry its powder?",
        "We shade-dry leaf for the powder we pack in Truganina.",
    ),
    faq_entity(
        "Where are live prices?",
        "On the moringa powder product page.",
    ),
]

SPIRULINA_FAQ = [
    faq_entity(
        "Is moringa healthier than spirulina or matcha?",
        "We do not rank them medically. Choose by taste, caffeine needs and whether you want a single leaf powder for cooking.",
    ),
    faq_entity(
        "Does NutriThrive sell spirulina or matcha?",
        "No — moringa leaf powder only.",
    ),
    faq_entity(
        "Where are current prices?",
        "On the moringa powder product page.",
    ),
]

MORINGA_CONVERSION = {
    "product": "moringa-powder",
    "img": "/assets/images/product_webp/moringa-powder-400g-bundle-main.webp",
    "alt": "NutriThrive moringa powder 400g bundle",
    "kicker": "Farm-grown leaf powder",
    "h2": "NutriThrive moringa powder",
    "text": "Shade-dried, farm-grown leaf powder for food and drinks. NMI lab-tested in Australia, packed in Truganina. See live 100g, 200g and 400g prices on the product page.",
    "price": "From $11.00 / 100g",
    "cta": "Shop moringa powder",
}

MORINGA_SIDEBAR = (
    "Moringa powder",
    "Farm-grown, shade-dried leaf. Food use.",
    "From $11.00 / 100g",
    "moringa-powder",
    "Shop moringa powder",
)

ARTICLES = [
    {
        "slug": "chemist-warehouse-greens-vs-moringa-powder-2026",
        "title": "Chemist Warehouse Greens vs Moringa Powder (Australia)",
        "meta": "Compare Chemist Warehouse greens powders with plain moringa leaf powder: ingredients, format, and when a single-ingredient pouch fits. Farm-grown NutriThrive from Truganina.",
        "h1": "Chemist Warehouse Greens vs Moringa Powder",
        "lede": "Chemist Warehouse greens powders are usually blends. NutriThrive is one ingredient: farm-grown moringa leaf powder. Compare formats so you can pick a tub or a pouch.",
        "og_title": "CW Greens vs Moringa Powder Australia",
        "og_description": "Label comparison: blended greens at Chemist Warehouse versus single-ingredient moringa leaf powder.",
        "hero_image": "/assets/images/product_photos/moringa-powder-australia-lab-tested.jpg",
        "hero_alt": "NutriThrive moringa leaf powder pouch and lab-tested leaf powder",
        "breadcrumb_title": "Chemist Warehouse Greens vs Moringa Powder",
        "meta_line": f'Moringa guides · Published <time datetime="2026-08-31">31 Aug 2026</time> · Updated <time datetime="{DATE_MODIFIED}">6 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-08-31",
        "schema_headline": "Chemist Warehouse Greens vs Moringa Powder (Australia)",
        "schema_description": "Compare Chemist Warehouse greens powders with plain moringa leaf powder: ingredients, format, and when a single-ingredient pouch fits.",
        "keywords": "chemist warehouse greens, greens powder vs moringa, chemist warehouse greens vs moringa, moringa powder australia",
        "faq_schema": GREENS_FAQ,
        "prose_file": "rank2/greens_prose.html",
        "quick_product": ("Moringa powder · from $11.00 / 100g", "moringa-powder", "Shop moringa powder", "Single-ingredient pouch"),
        "related": [
            ("/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025", "Chemist Warehouse moringa: powder vs capsules"),
            ("/blog/ag1-alternative-australia-moringa-comparison-2026", "AG1 alternative: plain moringa vs AG1"),
            ("/blog/verify-moringa-quality-premium-buyers-checklist-2026", "Organic vs farm-grown moringa"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("what-cw-greens-usually-are", "What CW greens usually are"),
            ("what-moringa-leaf-powder-is", "What moringa leaf powder is"),
            ("side-by-side", "Side-by-side"),
            ("who-should-buy-greens", "Who should buy greens"),
            ("who-should-buy-leaf-powder", "Who should buy leaf powder"),
            ("organic-note", "Organic note"),
            ("where-to-buy", "Where to buy powder online"),
            ("related-cw-capsules", "Related CW capsules post"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "ag1-alternative-australia-moringa-comparison-2026",
        "title": "AG1 Alternative Australia: Moringa Powder vs AG1",
        "meta": "AG1 is a multi-ingredient greens scoop. NutriThrive is plain farm-grown moringa leaf powder — compare purpose and format, then buy the pouch that fits.",
        "h1": "AG1 Alternative Australia: Plain Moringa vs AG1",
        "lede": "We do not sell AG1 and do not claim to replace it. Compare a multi-ingredient greens scoop with plain farm-grown moringa leaf powder.",
        "og_title": "AG1 Alternative Australia: Moringa Powder vs AG1",
        "og_description": "AG1 is a blend scoop. NutriThrive is single-ingredient moringa leaf powder — honest format comparison from Truganina.",
        "hero_image": "/assets/images/blog/moringa-replaces-200-supplement-stack-australia-2026.webp",
        "hero_alt": "Moringa leaf powder pouch as a simple greens alternative",
        "breadcrumb_title": "AG1 Alternative Australia: Plain Moringa vs AG1",
        "meta_line": f'Moringa guides · Published <time datetime="2026-10-03">3 Oct 2026</time> · Updated <time datetime="{DATE_MODIFIED}">6 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-10-03",
        "schema_headline": "AG1 Alternative Australia: Moringa Powder vs AG1",
        "schema_description": "AG1 is a multi-ingredient greens scoop. NutriThrive is plain farm-grown moringa leaf powder — compare purpose and format.",
        "keywords": "ag1 alternative australia, ag1 vs moringa, moringa powder australia",
        "faq_schema": AG1_FAQ,
        "prose_file": "rank2/ag1_prose.html",
        "quick_product": ("Moringa powder · from $11.00 / 100g", "moringa-powder", "Shop moringa powder", "Plain leaf powder"),
        "related": [
            ("/blog/chemist-warehouse-greens-vs-moringa-powder-2026", "Chemist Warehouse greens vs moringa"),
            ("/blog/moringa-vs-spirulina-vs-matcha-comparison-australia", "Moringa vs spirulina vs matcha"),
            ("/blog/how-to-choose-moringa-powder-australia-2026", "How to choose moringa powder"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("what-ag1-is", "What AG1 is"),
            ("what-we-sell", "What we sell"),
            ("not-a-substitute", "Not a substitute checklist"),
            ("price-format", "Price and format"),
            ("who-buys-which", "Who buys which"),
            ("related", "Related posts"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "rosabella-moringa-reviews-legit-or-overhyped-2026",
        "title": "Rosabella Moringa Reviews Australia: Powder Buy Path",
        "meta": "We do not sell Rosabella. Honest read on brand search intent, then NutriThrive farm-grown leaf powder sizes packed in Truganina.",
        "h1": "Rosabella Moringa Reviews Australia (We Sell Powder)",
        "lede": "We do not sell Rosabella. Score any brand on label facts, then buy farm-grown leaf powder if a food pouch is what you want.",
        "og_title": "Rosabella Moringa Reviews Australia: Powder Buy Path",
        "og_description": "Facts-only Rosabella search intent, then NutriThrive farm-grown moringa leaf powder from Truganina.",
        "hero_image": "/assets/images/blog/moringa-chemist-warehouse-vs-nutrithrive-hero.jpg",
        "hero_alt": "NutriThrive moringa powder pouch for food use",
        "breadcrumb_title": "Rosabella Moringa Reviews Australia (We Sell Powder)",
        "meta_line": f'Moringa guides · Published <time datetime="2026-07-15">15 July 2026</time> · Updated <time datetime="{DATE_MODIFIED}">6 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-07-15",
        "schema_headline": "Rosabella Moringa Reviews Australia: Powder Buy Path",
        "schema_description": "We do not sell Rosabella. Honest brand-search guide, then NutriThrive farm-grown leaf powder from Truganina.",
        "keywords": "rosabella moringa reviews, rosabella moringa australia, moringa powder australia",
        "faq_schema": ROSABELLA_FAQ,
        "prose_file": "rank2/rosabella_prose.html",
        "quick_product": ("Moringa powder · from $11.00 / 100g", "moringa-powder", "Shop moringa powder", "Our powder buy path"),
        "related": [
            ("/blog/moringa-brands-comparison-australia-2026", "Best moringa powder Australia? Facts-only"),
            ("/blog/moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026", "Heavy metals / CoA guide"),
            ("/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025", "Chemist Warehouse moringa formats"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("what-people-search", "What people search"),
            ("what-we-sell", "What we do and don’t sell"),
            ("how-to-compare", "How to compare any brand"),
            ("our-pouch-facts", "Our pouch facts"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026",
        "title": "Moringa Heavy Metals Lab Testing Australia (CoA Guide)",
        "meta": "What to ask before you buy moringa powder: heavy metals, batch CoA, and how NutriThrive links an NMI lab summary from Truganina packing.",
        "h1": "Moringa Heavy Metals & Lab Testing in Australia",
        "lede": "Ask for batch-linked heavy metals paperwork before you buy leaf powder. Here is a CoA checklist, plus how we link an NMI summary from Truganina.",
        "og_title": "Moringa Heavy Metals Lab Testing Australia (CoA Guide)",
        "og_description": "CoA checklist for moringa powder in Australia, plus NutriThrive’s NMI lab summary from Truganina packing.",
        "hero_image": "/assets/images/og/moringa-article-1200.jpg",
        "hero_alt": "Moringa leaf powder and lab testing context",
        "breadcrumb_title": "Moringa Heavy Metals & Lab Testing in Australia",
        "meta_line": f'Moringa guides · Published <time datetime="2026-06-20">20 June 2026</time> · Updated <time datetime="{DATE_MODIFIED}">6 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-06-20",
        "schema_headline": "Moringa Heavy Metals Lab Testing Australia (CoA Guide)",
        "schema_description": "What to ask before you buy moringa powder: heavy metals, batch CoA, and NutriThrive’s NMI lab summary.",
        "keywords": "moringa heavy metals, moringa coa, moringa lab testing australia",
        "faq_schema": HEAVY_FAQ,
        "prose_file": "rank2/heavy_metals_prose.html",
        "quick_product": ("Moringa powder · from $11.00 / 100g", "moringa-powder", "Shop moringa powder", "NMI summary on PDP"),
        "related": [
            ("/blog/verify-moringa-quality-premium-buyers-checklist-2026", "Organic vs farm-grown"),
            ("/blog/moringa-brands-comparison-australia-2026", "Facts-only brand check"),
            ("/blog/how-to-choose-moringa-powder-australia-2026", "How to choose moringa powder"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("why-leaf-gets-tested", "Why leaf powder gets tested"),
            ("useful-coa", "What a useful CoA shows"),
            ("organic-not-metal-free", "Organic ≠ metal-free"),
            ("read-our-nmi", "How to read our NMI PDF"),
            ("buy-path", "Buy path"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "moringa-patches-australia-review-do-they-work",
        "title": "Moringa Patches Australia: Glorenda, Healrize & Powder",
        "meta": "What moringa patches claim vs buying leaf powder for food and drinks. NutriThrive sells powder only — farm-grown, packed in Truganina.",
        "h1": "Moringa Patches Australia (Then Leaf Powder)",
        "lede": "We sell food-use leaf powder, not Glorenda, Healrize, or any moringa patch. Compare formats, then buy powder if that is what you want.",
        "og_title": "Moringa Patches Australia: Glorenda, Healrize & Powder",
        "og_description": "Patch formats vs NutriThrive leaf powder for food and drinks — farm-grown, packed in Truganina.",
        "hero_image": "/assets/images/og/moringa-article-1200.jpg",
        "hero_alt": "NutriThrive moringa leaf powder for food use",
        "breadcrumb_title": "Moringa Patches Australia (Then Leaf Powder)",
        "meta_line": f'Moringa guides · Published <time datetime="2026-05-10">10 May 2026</time> · Updated <time datetime="{DATE_MODIFIED}">6 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-05-10",
        "schema_headline": "Moringa Patches Australia: Glorenda, Healrize & Powder",
        "schema_description": "What moringa patches claim vs buying leaf powder for food and drinks. NutriThrive sells powder only.",
        "keywords": "moringa patches australia, glorenda moringa, healrize moringa, moringa powder",
        "faq_schema": PATCHES_FAQ,
        "prose_file": "rank2/patches_prose.html",
        "quick_product": ("Moringa powder · from $11.00 / 100g", "moringa-powder", "Shop moringa powder", "Powder, not patches"),
        "related": [
            ("/blog/what-does-moringa-powder-taste-like-honest-guide-2026", "What moringa powder tastes like"),
            ("/blog/moringa-smoothie-recipes-australia-2026", "Moringa smoothie recipes"),
            ("/blog/how-to-choose-moringa-powder-australia-2026", "How to choose moringa powder"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("what-patches-are", "What patches are"),
            ("what-we-sell", "What we sell instead"),
            ("format-table", "Format table"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "moringa-brands-comparison-australia-2026",
        "title": "Best Moringa Powder Australia? Facts-Only Brand Check",
        "meta": "Compare AU moringa powders with a facts-only scorecard: ingredients, organic marks, CoA, pack location — plus iHerb and Amazon notes.",
        "h1": "Best Moringa Powder Australia? (Facts-Only)",
        "lede": "There is no honest universal #1. Use a facts-only scorecard, then check iHerb and Amazon AU listings the same way.",
        "og_title": "Best Moringa Powder Australia: Facts-Only Brand Check",
        "og_description": "Facts-only moringa brand scorecard for Australia, with iHerb and Amazon AU checks and NutriThrive pouch facts.",
        "hero_image": "/assets/images/og/moringa-article-1200.jpg",
        "hero_alt": "Moringa powder brand comparison for Australian shoppers",
        "breadcrumb_title": "Best Moringa Powder Australia? (Facts-Only)",
        "meta_line": f'Moringa guides · Published <time datetime="2026-06-01">1 June 2026</time> · Updated <time datetime="{DATE_MODIFIED}">6 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-06-01",
        "schema_headline": "Best Moringa Powder Australia? Facts-Only Brand Check",
        "schema_description": "Compare AU moringa powders with a facts-only scorecard, plus iHerb and Amazon notes.",
        "keywords": "best moringa powder australia, moringa iherb, amazon moringa powder, moringa brands australia",
        "faq_schema": BRANDS_FAQ,
        "prose_file": "rank2/brands_prose.html",
        "quick_product": ("Moringa powder · from $11.00 / 100g", "moringa-powder", "Shop moringa powder", "Direct from Truganina"),
        "related": [
            ("/blog/moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026", "Heavy metals / CoA guide"),
            ("/blog/science-shade-drying-vs-sun-drying-moringa", "Shade-dried vs sun-dried"),
            ("/blog/verify-moringa-quality-premium-buyers-checklist-2026", "Organic vs farm-grown"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("scorecard", "Facts-only scorecard"),
            ("iherb", "iHerb listings"),
            ("amazon-au", "Amazon AU"),
            ("direct-farm", "Direct from farm packer"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "science-shade-drying-vs-sun-drying-moringa",
        "title": "Shade-Dried vs Sun-Dried Moringa Powder (What to Check)",
        "meta": "How drying method shows up on labels and product pages. NutriThrive shade-dries leaf powder and packs in Truganina.",
        "h1": "Shade-Dried vs Sun-Dried Moringa Powder",
        "lede": "Shade-dried and sun-dried are process words. Ask how any seller dries leaf, then confirm pack facts and lab paperwork.",
        "og_title": "Shade-Dried vs Sun-Dried Moringa Powder (What to Check)",
        "og_description": "What shade-dried means for moringa leaf powder, what to ask any seller, and NutriThrive’s Truganina pack facts.",
        "hero_image": "/assets/images/og/moringa-article-1200.jpg",
        "hero_alt": "Shade-dried moringa leaf powder",
        "breadcrumb_title": "Shade-Dried vs Sun-Dried Moringa Powder",
        "meta_line": f'Moringa guides · Published <time datetime="2026-04-15">15 April 2026</time> · Updated <time datetime="{DATE_MODIFIED}">6 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-04-15",
        "schema_headline": "Shade-Dried vs Sun-Dried Moringa Powder (What to Check)",
        "schema_description": "How drying method shows up on moringa labels. NutriThrive shade-dries leaf powder and packs in Truganina.",
        "keywords": "shade dried moringa, sun dried moringa, shade-dried vs sun-dried moringa",
        "faq_schema": SHADE_FAQ,
        "prose_file": "rank2/shade_prose.html",
        "quick_product": ("Moringa powder · from $11.00 / 100g", "moringa-powder", "Shop moringa powder", "Shade-dried leaf"),
        "related": [
            ("/blog/moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026", "Heavy metals / CoA guide"),
            ("/blog/how-to-choose-moringa-powder-australia-2026", "How to choose moringa powder"),
            ("/blog/moringa-brands-comparison-australia-2026", "Facts-only brand check"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("what-shade-dried-means", "What shade-dried means here"),
            ("what-to-ask", "What to ask any seller"),
            ("lab-link", "Lab link"),
            ("buy-path", "Buy path"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "moringa-vs-spirulina-vs-matcha-comparison-australia",
        "title": "Moringa vs Spirulina vs Matcha Powder (Australia)",
        "meta": "Three green powders side by side: taste, typical use, and when single-ingredient moringa leaf powder fits. Farm-grown NutriThrive from Melbourne.",
        "h1": "Moringa vs Spirulina vs Matcha (Australia)",
        "lede": "Three green powders, three habits. Compare taste and use, then buy NutriThrive only if single-ingredient moringa leaf powder is what you want.",
        "og_title": "Moringa vs Spirulina vs Matcha Powder (Australia)",
        "og_description": "Taste and kitchen-use comparison of moringa, spirulina and matcha — NutriThrive sells moringa leaf powder only.",
        "hero_image": "/assets/images/og/moringa-article-1200.jpg",
        "hero_alt": "Green powders comparison: moringa leaf powder",
        "breadcrumb_title": "Moringa vs Spirulina vs Matcha (Australia)",
        "meta_line": f'Moringa guides · Published <time datetime="2026-05-01">1 May 2026</time> · Updated <time datetime="{DATE_MODIFIED}">6 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-05-01",
        "schema_headline": "Moringa vs Spirulina vs Matcha Powder (Australia)",
        "schema_description": "Three green powders side by side: taste, typical use, and when single-ingredient moringa leaf powder fits.",
        "keywords": "moringa vs spirulina, moringa vs matcha, spirulina vs matcha australia",
        "faq_schema": SPIRULINA_FAQ,
        "prose_file": "rank2/spirulina_prose.html",
        "quick_product": ("Moringa powder · from $11.00 / 100g", "moringa-powder", "Shop moringa powder", "We sell moringa only"),
        "related": [
            ("/blog/what-does-moringa-powder-taste-like-honest-guide-2026", "What moringa powder tastes like"),
            ("/blog/moringa-smoothie-recipes-australia-2026", "Moringa smoothie recipes"),
            ("/blog/how-to-make-moringa-tea-recipes-2026", "How to make moringa tea"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("taste-table", "Taste table"),
            ("kitchen-uses", "Kitchen uses"),
            ("what-nt-sells", "What NutriThrive sells"),
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

    # Replace Article/BlogPosting (+ optional FAQ) + BreadcrumbList only — keep LocalBusiness JSON-LD.
    old_schema = re.search(
        r'<script type="application/ld\+json">\{[^{]*"@type"\s*:\s*"(?:Article|BlogPosting)"[\s\S]*?</script>\s*'
        r'(?:<script type="application/ld\+json">\{[^{]*"@type"\s*:\s*"FAQPage"[\s\S]*?</script>\s*)?'
        r'<script type="application/ld\+json">\{[^{]*"@type"\s*:\s*"BreadcrumbList"[\s\S]*?</script>',
        html,
    )
    if not old_schema:
        sys.exit(f"Could not find article schema block for {slug}")
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

    conv = MORINGA_CONVERSION
    related_lis = "".join(f'<li><a href="{h}">{t}</a></li>' for h, t in article["related"])
    sb_title, sb_text, sb_price, sb_product, sb_cta = MORINGA_SIDEBAR

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
