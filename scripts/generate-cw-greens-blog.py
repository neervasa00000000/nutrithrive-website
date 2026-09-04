#!/usr/bin/env python3
"""Generate blog/chemist-warehouse-greens-vs-moringa-powder-2026.html."""
from __future__ import annotations

import json
import re
from pathlib import Path

import mistune

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "blog/chemist-warehouse-greens-vs-moringa-powder-2026.html"
MD_PATH = ROOT / "Gork_bot/2026-08-31-chemist-warehouse-greens-vs-moringa-powder-2026.md"

SLUG = "chemist-warehouse-greens-vs-moringa-powder-2026"
URL = f"https://nutrithrive.com.au/blog/{SLUG}"
TITLE = "Chemist Warehouse Greens vs $11 Moringa, Australia"
H1 = "Chemist Warehouse Greens vs $11 Moringa, Packed in Truganina"
META = (
    "Vital Organic Greens is $22.99/200g at CW. I pack one shade-dried leaf at "
    "$11/100g with an NMI PDF. Label walk-through, not a cure pitch."
)
DATE = "2026-08-31"
DATE_DISPLAY = "31 Aug 2026"
HERO = "/assets/images/product_photos/moringa-powder-australia-lab-tested.jpg"
OG = f"https://nutrithrive.com.au{HERO}"
CATEGORY = "Comparison"
CATEGORY_HREF = "https://nutrithrive.com.au/blog/category/guides/"
MIN_READ = "12 min read"
SIDEBAR_IMG = "/assets/images/product_photos/moringa.jpeg"

FAQS = [
    (
        "Is this about Chemist Warehouse moringa capsules?",
        "No. Capsule brands are on the Chemist Warehouse moringa vs NutriThrive page. "
        "This post is Vital Organic Greens, a blended greens tub, versus my leaf powder.",
    ),
    (
        "What is in Vital Organic Greens?",
        "Per the CW page on 31 August 2026: spirulina 24.8%, kale, broccoli, barley grass "
        "and wheat grass 17.4% each, chlorella 5%, plus stevia, monk fruit, and thaumatin "
        "under 1% each. Plant powders marked organic.",
    ),
    (
        "How much is Vital Organic Greens at Chemist Warehouse?",
        "$22.99 for 200 g on the live CW listing I opened 31 August 2026. Other retailers "
        "may differ. Check the price on the day you buy.",
    ),
    (
        "How much is NutriThrive moringa?",
        "$11.00 / 100 g, $21.50 / 200 g, $35.00 / 400 g bundle. Free AU shipping from $49.",
    ),
    (
        "Is NutriThrive certified organic?",
        "No. Vital Organic Greens is. I publish an NMI heavy-metals and pesticide summary "
        "instead of an organic logo.",
    ),
    (
        "Do greens powders replace vegetables?",
        "No. Dietitians quoted by ABC in July 2025 say a scoop is not a vegetable serve. "
        "Eat food. Use powder as optional leaf if you want.",
    ),
    (
        "Is moringa a medicine?",
        "No. I sell it as food. No TGA disease claims from me. Talk to your GP about "
        "medications, pregnancy, or kids before you add any powder.",
    ),
    (
        "What does the NMI PDF cover?",
        "Heavy metals and pesticide residues on a named batch. Food-quality screen. "
        "Not a medical claim.",
    ),
    (
        "Will it taste sweet like Vital?",
        "No. Vital includes stevia, monk fruit, and thaumatin. Mine is unsweetened leaf. Grassy.",
    ),
    (
        "If I order today, when does it leave Truganina?",
        "Monday 31 August before 2pm can go same-day when I turn the run around. After 2pm, "
        "next business day. Typical 3–4 days metro after dispatch.",
    ),
    (
        "What does 100g cost posted?",
        "$11.00 plus about $9.69 zone-1 example equals $20.69 under $49. 200 g: $21.50 plus "
        "about $10.04 equals $31.54. Pickup by arrangement is goods only, cash. Free shipping at $49+.",
    ),
    (
        "Can I pick up in Truganina?",
        "Yes, by arrangement. 15 Europe Street, Truganina VIC 3029. Cash for pickup only. "
        "Call +61 438 201 419 or email nutrithrive0@gmail.com first.",
    ),
]

BODY_TAIL = """
<p style="margin-top:2rem; font-style:italic; color:#555;"><em>Written by Neer. NutriThrive Australia.</em></p>
<p class="nt-disclaimer"><em>These statements have not been evaluated by the TGA. This content is general information only, not medical advice. Food products are not intended to diagnose, treat, cure, or prevent any disease.</em></p>

<div class="nt-article-cta">
<h3>Order shade-dried moringa — $11 / 100g</h3>
<p>One leaf, packed in Truganina. Posted $11 + $9.69 under $49, or pickup by arrangement. Same-day dispatch before 2pm on business days. NMI summary on the product page.</p>
<div class="btn-row">
<a class="btn-solid" href="/products/moringa-powder/">Shop moringa powder — $11</a>
<a class="btn-outline" href="/shipping">Shipping &amp; returns</a>
</div>
</div>

<p style="margin-top: 1rem;"><a href="/blog/">&larr; Back to all articles</a></p>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul><li><strong>31 Aug 2026:</strong> Published. Vital Organic Greens price and label from the live Chemist Warehouse listing the same day.</li></ul>
</div>
<section class="nt-related-links-block">
<h2>Keep going</h2>
<ul>
<li><strong>This is not:</strong> <a href="/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025">Chemist Warehouse moringa capsules vs my powder</a></li>
<li><a href="/blog/ag1-alternative-australia-moringa-comparison-2026">AG1 vs single-ingredient moringa</a></li>
<li><a href="/blog/how-to-choose-moringa-powder-australia-2026">How to choose moringa powder in Australia</a></li>
<li><a href="/blog/what-does-moringa-powder-taste-like-honest-guide-2026">Does moringa powder taste bad?</a></li>
<li><a href="/blog/moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026">How to read a moringa lab report</a></li>
<li><a href="/products/moringa-powder/">Shop moringa powder</a></li>
</ul>
</section>
"""


def load_body_md() -> str:
    raw = MD_PATH.read_text(encoding="utf-8")
    if raw.startswith("---"):
        raw = raw.split("---", 2)[2]
    raw = re.sub(r"^# .+\n+", "", raw.strip() + "\n", count=1)
    if "## FAQ" in raw:
        head, faq = raw.split("## FAQ", 1)
        faq = re.sub(r"\*\*(.+?)\*\*\n", r"### \1\n", faq)
        raw = head + "## FAQ" + faq
    return raw


def md_to_html(md: str) -> str:
    html = mistune.html(md.strip() + "\n")
    html = html.replace("https://nutrithrive.com.au", "")
    html = html.replace("<table>", '<table class="nt-comparison-table">')
    return html


QUICK_HTML = (
    "Vital Organic Greens is <strong>$22.99 / 200 g</strong> at Chemist Warehouse today: "
    "a sweetened six-plant blend. I pack one shade-dried moringa leaf at "
    "<strong>$11 / 100 g</strong> with an NMI PDF. This is not the CW capsules post. "
    "Label walk-through, not a cure pitch."
)


def wrap_answer_box(html: str) -> str:
    box = (
        '<div class="answer-box">\n'
        "<h2>Quick Answer</h2>\n"
        f'<p style="margin:0;">{QUICK_HTML}</p>\n'
        "</div>\n"
        '<p class="nt-disclosure" style="margin:1.25rem 0;padding:0.85rem 1rem;background:#f7f3e8;'
        "border-left:4px solid #0f6b4d;border-radius:8px;font-size:0.95rem;\">"
        "<strong>Disclosure:</strong> I sell the $11 bag. Chemist Warehouse sells Vital. "
        "This is a label and price walk-through, not a cure pitch.</p>\n"
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
            {"@type": "ListItem", "position": 3, "name": "Guides", "item": CATEGORY_HREF},
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
<meta name="msapplication-TileImage" content="/assets/images/logo/apple-touch-icon.png">
<meta name="msapplication-TileColor" content="#0f6b4d">
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<link rel="preload" as="image" href="{HERO}" fetchpriority="high"/>
<title>{TITLE}</title>
<script>
 window.dataLayer = window.dataLayer || [];
 function gtag(){{dataLayer.push(arguments);}}
 if (window.DeferLoader) {{
 window.DeferLoader.deferUntilInteraction(function() {{
 window.DeferLoader.loadScript('https://www.googletagmanager.com/gtag/js?id=G-WH21SW75WP', {{
 async: true, crossorigin: 'anonymous'
 }}).then(function() {{
 gtag('js', new Date());
 gtag('config', 'G-WH21SW75WP', {{'anonymize_ip': true, 'allow_google_signals': false}});
 }}).catch(function(err) {{ console.warn('[GA] Failed to load:', err); }});
 }}, {{ once: true, passive: true }});
 }} else {{
 window.addEventListener('load', function() {{
 var s = document.createElement('script');
 s.async = true;
 s.src = 'https://www.googletagmanager.com/gtag/js?id=G-WH21SW75WP';
 s.crossOrigin = 'anonymous';
 document.head.appendChild(s);
 gtag('js', new Date());
 gtag('config', 'G-WH21SW75WP', {{'anonymize_ip': true, 'allow_google_signals': false}});
 }});
 }}
</script>
<meta name="robots" content="index, follow"/>
<link rel="canonical" href="{URL}"/>
<link rel="alternate" type="text/plain" href="https://nutrithrive.com.au/llms.txt" title="LLMs.txt">
<link rel="alternate" hreflang="en-AU" href="{URL}"/>
<link rel="alternate" hreflang="x-default" href="{URL}"/>
<meta name="description" content="{META}"/>
<meta name="author" content="NutriThrive Australia"/>
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
<meta name="theme-color" content="#0f6b4d"/>
<link rel="preconnect" href="https://www.googletagmanager.com"/>
<link rel="dns-prefetch" href="https://www.redditstatic.com"/>
<link rel="stylesheet" href="/shared/css/blog-critical.min.css"/>
<link rel="preload" href="/assets/fonts/plus-jakarta-sans-400.woff2" as="font" type="font/woff2" crossorigin/>
<link rel="preload" href="/shared/css/fonts-local.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
<noscript><link rel="stylesheet" href="/shared/css/fonts-local.min.css"/></noscript>
<link rel="preload" href="/assets/css/design-system.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
<noscript><link rel="stylesheet" href="/assets/css/design-system.min.css"/></noscript>
<link rel="preload" href="/styles/global/style.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
<noscript><link rel="stylesheet" href="/styles/global/style.min.css"/></noscript>
<link rel="preload" href="/assets/css/tailwind-v2.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
<noscript><link rel="stylesheet" href="/assets/css/tailwind-v2.min.css"/></noscript>
<link rel="preload" href="/blog/blog-v2-prose.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
<noscript><link rel="stylesheet" href="/blog/blog-v2-prose.min.css"/></noscript>
<link rel="preload" href="/shared/css/v2-extra.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
<noscript><link rel="stylesheet" href="/shared/css/v2-extra.min.css"/></noscript>
<link rel="stylesheet" href="/shared/css/author-bio.min.css" media="print" onload="this.media='all'"/><noscript><link rel="stylesheet" href="/shared/css/author-bio.min.css"/></noscript>
<script>(function(){{var b=document.body;if(!b||!b.classList.contains('nt-blog-article')&&!b.classList.contains('nt-blog-index'))return;var loaded=function(){{b.classList.add('fonts-loaded')}};if(!document.fonts||!document.fonts.load){{loaded();return}}Promise.all([document.fonts.load('400 1em \\"Plus Jakarta Sans\\"'),document.fonts.load('600 1em \\"Plus Jakarta Sans\\"')]).then(loaded).catch(loaded)}})();</script>
</head>
<body class="bg-background text-on-background font-body-md overflow-x-hidden nt-blog-article">
<div class="nt-sticky-top">
<header id="nt-header" class="nt-v2-header"></header>
</div>
<nav class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-4 pb-2 text-label-sm" aria-label="Breadcrumb">
<ol class="flex flex-wrap items-center gap-1 list-none m-0 p-0"><li><a class="text-moringa-leaf hover:underline" href="/">Home</a></li><li class="text-on-surface-variant" aria-hidden="true">&#x203A;</li><li><a class="text-moringa-leaf hover:underline" href="/blog/">Blog</a></li><li class="text-on-surface-variant" aria-hidden="true">&#x203A;</li><li class="text-on-surface" aria-current="page">{TITLE}</li></ol>
</nav>
<main class="pt-6 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop nt-blog-main">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
<article class="lg:col-span-8">
<header class="mb-12">
<div class="flex flex-wrap items-center gap-2 mb-4">
<span class="bg-primary-fixed/30 text-moringa-leaf px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider font-bold">{CATEGORY}</span>
<span class="text-on-surface-variant text-label-lg font-body-md">{DATE_DISPLAY}</span>
<span class="text-on-surface-variant text-label-lg font-body-md">&#183; {MIN_READ}</span>
</div>
<h1 class="font-display text-headline-lg md:text-display text-forest-deep mb-4 leading-tight">{H1}</h1>
<p class="text-on-surface-variant text-body-md mb-8"><strong>By Neer, NutriThrive Truganina</strong> &#183; Last updated: {DATE_DISPLAY}</p>
<div class="w-full aspect-[16/9] rounded-xl overflow-hidden mb-12 shadow-sm bg-surface-container">
<img alt="Shade-dried moringa leaf powder packed in Truganina, compared with Chemist Warehouse greens" class="w-full h-full object-cover" src="{HERO}" width="1200" height="630" loading="eager" decoding="async" fetchpriority="high"/>
</div>
</header>
<div class="blog-v2-prose max-w-none">
{body_html}
</div>
</article>
<aside class="lg:col-span-4 space-y-12">
<div class="bg-pure-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden nt-blog-sidebar-promo">
<div class="aspect-square bg-surface-container relative">
<img alt="NutriThrive moringa powder — $11 / 100g" class="w-full h-full object-cover" src="{SIDEBAR_IMG}" loading="lazy" width="600" height="600"/>
<div class="absolute top-4 right-4 bg-moringa-leaf text-pure-white px-3 py-1 rounded-lg text-label-sm font-label-sm">$11 / 100g</div>
</div>
<div class="p-6">
<h4 class="font-headline-md text-headline-md text-forest-deep mb-2">Moringa powder — $11</h4>
<p class="text-on-surface-variant font-body-md text-body-md mb-4">One shade-dried leaf. No stevia. NMI summary on the product page. Packed in Truganina.</p>
<div class="nt-blog-sidebar-price flex items-baseline gap-1 mb-2">
<span class="text-2xl font-bold text-moringa-leaf">$11.00</span>
<span class="text-sm text-on-surface-variant">/100g</span>
</div>
<p class="text-body-sm text-on-surface-variant mb-6">Posted +$9.69 under $49 · Pickup $11</p>
<a class="block w-full text-center bg-moringa-leaf text-pure-white py-4 rounded-lg font-label-lg text-label-lg hover:scale-[1.02] transition-transform" href="/products/moringa-powder/">Shop moringa powder →</a>
</div>
</div>
<div class="nt-ad-slot nt-ad-slot--sidebar" data-ad-slot="sidebar" data-nt-ad-promo></div>
</aside>
</div>
</main>
<div id="nt-footer"></div>
<script src="/scripts/global/reddit-pixel.min.js" defer></script>
<script src="/shared/site-data.min.js" defer></script>
<script src="/scripts/global/cart.min.js" defer></script>
<script src="/shared/js/cart-v2-ui.min.js" defer></script>
<script src="/shared/js/footer-v2.min.js" defer></script>
<script src="/shared/js/author-bio.min.js" defer></script>
<script>(function(){{function loadLayout(){{var s=document.createElement('script');s.src='/shared/js/layout-v2.min.js';s.defer=true;document.body.appendChild(s)}}if(document.readyState==='complete'){{loadLayout()}}else{{window.addEventListener('load',loadLayout,{{once:true}})}}}})();</script><script src="/shared/js/v2-site.min.js" defer></script>
<script src="/scripts/global/defer-loader.min.js" defer></script>
</body>
</html>
"""
    OUT.write_text(html, encoding="utf-8")
    print(f"Wrote {OUT.name} ({len(html):,} bytes)")


if __name__ == "__main__":
    main()
