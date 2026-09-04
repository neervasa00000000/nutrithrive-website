#!/usr/bin/env python3
"""Generate site/blog/cold-brew-darjeeling-australian-spring-2026.html from the Gork_bot draft."""
from __future__ import annotations

import json
import re
from pathlib import Path

import mistune

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "site/blog/cold-brew-darjeeling-australian-spring-2026.html"
MD_PATH = ROOT / "Gork_bot/2026-09-01-cold-brew-darjeeling-australian-spring-2026.md"

SLUG = "cold-brew-darjeeling-australian-spring-2026"
URL = f"https://nutrithrive.com.au/blog/{SLUG}"
TITLE = "Cold-Brew Darjeeling Tea for Australian Spring 2026"
H1 = "Cold-Brew Darjeeling for Australian Spring, From Truganina"
META = (
    "Wattle Day fridge method for first-flush Darjeeling. Ratios, Melbourne tap, "
    "why hot-brew-then-ice goes bitter, $7.50/100g from Truganina."
)
DATE = "2026-09-01"
DATE_DISPLAY = "1 Sep 2026"
HERO = "/assets/images/og/black-tea-social-1200.jpg"
OG = f"https://nutrithrive.com.au{HERO}"
CATEGORY = "Tea"
CATEGORY_HREF = "https://nutrithrive.com.au/blog/category/tea/"
MIN_READ = "10 min read"
SIDEBAR_IMG = "/assets/images/product_webp/darjeeling-black-tea-100g-main.webp"

assert len(TITLE) == 51, len(TITLE)
assert len(H1) == 58, len(H1)
assert len(META) == 137, len(META)

FAQS = [
    (
        "What is cold brew Darjeeling?",
        "Loose Darjeeling steeped in cold water in the fridge for hours, then strained. "
        "No hot water. Different from hot tea poured over ice.",
    ),
    (
        "What leaf-to-water ratio do you use?",
        "About 2 level tsp (~3–4 g) per 500 ml, or 4 tsp per litre. Taste at 8 hours. Adjust next batch.",
    ),
    (
        "Can I use Melbourne tap water?",
        "Yes, that is what I use. If cold tap tastes of chlorine at your place, filter it. "
        "Cold brew sits long enough that water flavour shows.",
    ),
    (
        "Why does hot-brewed iced Darjeeling taste bitter?",
        "Heat pulls tannins. Ice does not remove them. Use 85–90°C if you hot-brew, "
        "or skip heat and cold-brew overnight.",
    ),
    (
        "How long in the fridge?",
        "8–12 hours for the way I brew first flush. Overnight is fine. Strain when it tastes right.",
    ),
    (
        "How long does strained cold brew keep?",
        "About 3–4 days covered in the fridge. When in doubt, tip it out and brew fresh.",
    ),
    (
        "Does it still have caffeine?",
        "Yes. Hot cup on our pages is about 40–50 mg. Cold brew is often lighter, but it is still "
        "caffeinated tea. FSANZ daily guide for healthy adults is around 400 mg.",
    ),
    (
        "Is this the same as the winter chai latte post?",
        "No. The chai latte is hot, spiced, milky. This is cold, plain leaf, fridge.",
    ),
    (
        "How much is NutriThrive Darjeeling?",
        "$7.50 for 100 g, SKU NT-BT-100G, live 1 September 2026. Product page: /products/black-tea/.",
    ),
    (
        "What does 100 g cost posted?",
        "About $7.50 + ~$9.69 zone-1 example ≈ $17.19 under the $49 free-ship line. Free shipping at $49+.",
    ),
    (
        "If I order today, when does it leave Truganina?",
        "Before 2pm business days can be same-day Melbourne dispatch when I turn it around. "
        "After 2pm, next business day. No Sunday. Typical metro after dispatch is a few days.",
    ),
    (
        "Can I gift this for Father's Day?",
        "Yes, if he drinks tea. Bag alone, or the $35 gift pack. Father's Day is Sunday 6 September 2026. "
        "Do not leave interstate to Saturday.",
    ),
]

QUICK_HTML = (
    "Fridge method for first-flush Darjeeling on Wattle Day: about "
    "<strong>2 tsp leaf per 500 ml</strong> cold water, <strong>8–12 hours</strong>, then strain. "
    "Hot-brew-then-ice pulls tannins and tastes bitter. The bag I pack is "
    "<strong>$7.50 / 100 g</strong> from Truganina, SKU NT-BT-100G."
)

BODY_TAIL = """
<p style="margin-top:2rem; font-style:italic; color:#555;"><em>Written by Neer. NutriThrive Australia.</em></p>
<p class="nt-disclaimer"><em>These statements have not been evaluated by the TGA. This content is general information only, not medical advice. Food products are not intended to diagnose, treat, cure, or prevent any disease.</em></p>

<div class="nt-article-cta">
<h3>Order first-flush Darjeeling — $7.50 / 100g</h3>
<p>Loose leaf packed in Truganina. Posted $7.50 + $9.69 under $49, or pickup by arrangement. Same-day dispatch before 2pm on business days. This page is the fridge method, not the winter chai latte.</p>
<div class="btn-row">
<a class="btn-solid" href="/products/black-tea/">Shop Darjeeling tea — $7.50</a>
<a class="btn-outline" href="/shipping">Shipping &amp; returns</a>
</div>
</div>

<p style="margin-top: 1rem;"><a href="/blog/">&larr; Back to all articles</a></p>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul><li><strong>1 Sep 2026:</strong> Published for Wattle Day / meteorological spring. Fridge method for first-flush Darjeeling.</li></ul>
</div>
<section class="nt-related-links-block">
<h2>Keep going</h2>
<ul>
<li><strong>This is not:</strong> <a href="/blog/darjeeling-chai-latte-recipe-winter-coffee-alternative-2026">the winter Darjeeling chai latte</a></li>
<li><a href="/blog/how-to-brew-darjeeling-tea-perfectly-2026">How to brew Darjeeling hot</a></li>
<li><a href="/blog/how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026">Darjeeling caffeine vs coffee</a></li>
<li><a href="/blog/how-much-caffeine-safe-per-day-australia-fsanz-2026">FSANZ caffeine daily guide</a></li>
<li><a href="/blog/fathers-day-gift-under-40">Father's Day gift under $40</a></li>
<li><a href="/products/black-tea/">Shop Darjeeling tea</a></li>
</ul>
</section>
"""


def load_body_md() -> str:
    raw = MD_PATH.read_text(encoding="utf-8")
    if raw.startswith("---"):
        raw = raw.split("---", 2)[2]
    raw = re.sub(r"^# .+\n+", "", raw.strip() + "\n", count=1)
    raw = raw.replace("**Mid-article CTA:** ", "")
    return raw


def md_to_html(md: str) -> str:
    html = mistune.html(md.strip() + "\n")
    html = html.replace("https://nutrithrive.com.au", "")
    html = html.replace("<table>", '<table class="nt-comparison-table">')
    html = html.replace(
        "<p>If you already drink black tea and want a jug in the fridge this week, start with",
        '<p class="nt-mid-cta">If you already drink black tea and want a jug in the fridge this week, start with',
    )
    return html


def wrap_answer_box(html: str) -> str:
    box = (
        '<div class="answer-box">\n'
        "<h2>Quick Answer</h2>\n"
        f'<p style="margin:0;">{QUICK_HTML}</p>\n'
        "</div>\n"
    )
    return box + html


def main() -> None:
    body_md = load_body_md()
    words = len(re.findall(r"\b[\w']+\b", body_md))
    print(f"Body word count: {words}")
    print(f"Title {len(TITLE)} / H1 {len(H1)} / Meta {len(META)}")

    body_html = wrap_answer_box(md_to_html(body_md)) + BODY_TAIL

    faq_ld = {
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
    how_to = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "Cold-brew Darjeeling tea",
        "description": META,
        "totalTime": "PT8H",
        "supply": ["First-flush Darjeeling loose leaf", "Cold water", "Glass jar with lid", "Fine mesh strainer"],
        "step": [
            {"@type": "HowToStep", "text": "Add about 2 level teaspoons (3–4 g) of first-flush Darjeeling to a clean jar."},
            {"@type": "HowToStep", "text": "Pour 500 ml cold water over the leaf. Lid on and shake once."},
            {"@type": "HowToStep", "text": "Refrigerate 8–12 hours. Taste at 8 hours."},
            {"@type": "HowToStep", "text": "Strain, discard the wet leaf, and drink cold or over ice."},
        ],
    }
    blog_posting = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": TITLE,
        "description": META,
        "author": {
            "@type": "Person",
            "@id": "https://nutrithrive.com.au/#person-neer",
            "name": "Neer",
        },
        "publisher": {
            "@type": "Organization",
            "name": "NutriThrive",
            "logo": {
                "@type": "ImageObject",
                "url": "https://nutrithrive.com.au/assets/images/logo/logo-112.png",
            },
        },
        "datePublished": DATE,
        "dateModified": DATE,
        "image": OG,
        "mainEntityOfPage": {"@type": "WebPage", "@id": URL},
    }
    breadcrumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://nutrithrive.com.au/"},
            {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://nutrithrive.com.au/blog/"},
            {"@type": "ListItem", "position": 3, "name": "Darjeeling tea", "item": CATEGORY_HREF},
            {"@type": "ListItem", "position": 4, "name": TITLE, "item": URL},
        ],
    }

    html = f"""<!DOCTYPE html>
<html class="scroll-smooth" lang="en-AU">
<head>
<link rel="icon" type="image/png" sizes="48x48" href="/assets/images/logo/favicon-48.png">
<link rel="icon" href="/assets/images/logo/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="96x96" href="/assets/images/logo/favicon-96.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/images/logo/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<link rel="preload" as="image" href="{HERO}" fetchpriority="high"/>
<title>{TITLE}</title>
<meta name="robots" content="index, follow"/>
<link rel="canonical" href="{URL}"/>
<link rel="alternate" type="text/plain" href="https://nutrithrive.com.au/llms.txt" title="LLMs.txt">
<link rel="alternate" hreflang="en-AU" href="{URL}"/>
<link rel="alternate" hreflang="x-default" href="{URL}"/>
<meta name="description" content="{META}"/>
<meta name="author" content="Neer Vasa"/>
<meta property="og:type" content="article"/>
<meta property="og:url" content="{URL}"/>
<meta property="og:title" content="{TITLE}"/>
<meta property="og:description" content="{META}"/>
<meta property="og:image" content="{OG}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:site_name" content="NutriThrive Australia"/>
<meta property="og:locale" content="en_AU"/>
<meta property="article:published_time" content="{DATE}T00:00:00+10:00"/>
<meta property="article:modified_time" content="{DATE}T00:00:00+10:00"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:url" content="{URL}"/>
<meta name="twitter:title" content="{TITLE}"/>
<meta name="twitter:description" content="{META}"/>
<meta name="twitter:image" content="{OG}"/>
<script type="application/ld+json">{json.dumps(blog_posting, ensure_ascii=False, separators=(",", ":"))}</script>
<script type="application/ld+json">{json.dumps(breadcrumbs, ensure_ascii=False, separators=(",", ":"))}</script>
<script type="application/ld+json">{json.dumps(faq_ld, ensure_ascii=False, separators=(",", ":"))}</script>
<script type="application/ld+json">{json.dumps(how_to, ensure_ascii=False, separators=(",", ":"))}</script>
<meta name="theme-color" content="#0f6b4d"/>
<link rel="stylesheet" href="/shared/css/blog-critical.min.css"/>
<link rel="preload" href="/blog/blog-v2-prose.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
<noscript><link rel="stylesheet" href="/blog/blog-v2-prose.min.css"/></noscript>
</head>
<body class="bg-background text-on-background font-body-md overflow-x-hidden nt-blog-article">
<nav aria-label="Breadcrumb">
<ol><li><a href="/">Home</a></li><li><a href="/blog/">Blog</a></li><li aria-current="page">{TITLE}</li></ol>
</nav>
<main>
<article>
<header>
<span>{CATEGORY}</span>
<span>{DATE_DISPLAY}</span>
<span>{MIN_READ}</span>
<h1>{H1}</h1>
<p><strong>By Neer, NutriThrive Truganina</strong> · Last updated: {DATE_DISPLAY}</p>
<img alt="{H1}" src="{HERO}" width="1200" height="630" fetchpriority="high"/>
</header>
<div class="blog-v2-prose max-w-none">
{body_html}
</div>
</article>
<aside>
<img alt="NutriThrive Darjeeling black tea — $7.50 / 100g" src="{SIDEBAR_IMG}" width="600" height="600" loading="lazy"/>
<h4>Darjeeling tea — $7.50</h4>
<p>First-flush loose leaf. Packed in Truganina.</p>
<a href="/products/black-tea/">Shop Darjeeling tea →</a>
</aside>
</main>
</body>
</html>
"""
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html, encoding="utf-8")
    print(f"Wrote {OUT.relative_to(ROOT)} ({len(html):,} bytes)")


if __name__ == "__main__":
    main()
