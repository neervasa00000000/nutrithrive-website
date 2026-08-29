#!/usr/bin/env python3
"""Generate blog/fathers-day-gift-under-40.html from Gork_bot draft."""
from __future__ import annotations

import json
import re
from pathlib import Path

import mistune

ROOT = Path(__file__).resolve().parents[1]
DRAFT = ROOT / "Gork_bot/2026-08-29-fathers-day-gift-under-40.md"
OUT = ROOT / "blog/fathers-day-gift-under-40.html"

SLUG = "fathers-day-gift-under-40"
URL = f"https://nutrithrive.com.au/blog/{SLUG}"
TITLE = "Last-Minute Father's Day Gift Under $40 From Melbourne"
H1 = "Last-Minute Father's Day Gift Under $40, Packed in Truganina"
META = (
    "Father's Day is Sunday 6 Sep 2026. This weekend is the interstate cutoff. "
    "I pack a $35 set in Truganina: moringa, Darjeeling, curry leaves, soap."
)
DATE = "2026-08-29"
DATE_DISPLAY = "29 Aug 2026"
HERO = "/assets/images/homepage/product-showcase/gift.webp"
OG = "https://nutrithrive.com.au/assets/images/homepage/product-showcase/gift.webp"

FAQS = [
    (
        "When is Father's Day in Australia in 2026?",
        "Sunday 6 September 2026. First Sunday in September, same as every year.",
    ),
    (
        "If I order this weekend, will it arrive in time for Perth?",
        "No Sunday dispatch. Weekend orders pack Monday 31 August if they are in before 2pm. "
        "Perth metro typically 3–5 business days, regional WA 6–9. Metro can land Thursday 3 "
        "through Monday 7 September. The slow end is after Father's Day. Regional WA will miss.",
    ),
    (
        "Will it arrive in time for Brisbane?",
        "Brisbane, Gold Coast and Sunshine Coast are usually 2–4 business days after Melbourne "
        "dispatch. Monday 31 August dispatch sits in the Wed 2 – Fri 4 September band for most "
        "of those postcodes. Rural Queensland is closer to up to 10 days.",
    ),
    (
        "What is in the box?",
        "100 g moringa powder, 100 g Darjeeling black tea, 30 g dried curry leaves, one 95 g "
        "moringa lavender soap. 325 g net. SKU NT-GIFT-325G. $35.",
    ),
    ("Is it organic?", "No. Not certified organic. I will not imply one."),
    (
        "Is it a medicine?",
        "No. Food ingredients and a soap bar. Statements have not been evaluated by the TGA. "
        "I do not sell it to treat disease.",
    ),
    (
        "Is it alcohol-free?",
        "Yes. No beer, no whisky, no wine. If that is the wrong gift for your dad, buy alcohol "
        "from someone who sells it.",
    ),
    (
        "Can I pick up in Truganina?",
        "Yes, by arrangement. 15 Europe Street, Truganina VIC 3029. Cash is accepted for pickup "
        "only. Call +61 438 201 419 or email nutrithrive0@gmail.com first.",
    ),
    (
        "What does it cost with shipping?",
        "$35 + $9.69 = $44.69 if the order is under $80. Free shipping at $80+. Pickup is $35.",
    ),
    (
        "What is the return policy?",
        "7 days from delivery, unopened packs. Original shipping is not refunded. "
        "Damaged-on-arrival: contact us within seven days with photos.",
    ),
    (
        "Do you dispatch on Sunday?",
        "No. Same-day dispatch is before 2pm on business days. A Saturday or Sunday order waits "
        "for Monday.",
    ),
]


def extract_body_md(text: str) -> str:
    # Drop YAML front matter and the first H1 (page already has H1).
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            text = text[end + 4 :].lstrip("\n")
    text = re.sub(r"^# .+\n+", "", text, count=1)
    # FAQ section is duplicated as HTML FAQ + schema; keep prose FAQ in body.
    return text.strip() + "\n"


def md_to_html(md: str) -> str:
    html = mistune.html(md)
    # Prefer relative internal links.
    html = html.replace("https://nutrithrive.com.au", "")
    # Tables need a class for blog CSS.
    html = html.replace("<table>", '<table class="nt-comparison-table">')
    return html


def wrap_answer_box(html: str) -> str:
    # Lead paragraphs before first H2 → Quick Answer style box from first para.
    m = re.search(r"<p>(.*?)</p>", html, re.S)
    if not m:
        return html
    first = m.group(0)
    rest = html[m.end() :]
    box = (
        '<div class="answer-box">\n'
        "<h2>Quick Answer</h2>\n"
        f'<p style="margin:0;">{m.group(1)}</p>\n'
        "</div>\n"
    )
    # Skip duplicating the first paragraph if it's already the opener.
    return box + rest


BODY_TAIL = """
<p style="margin-top:2rem; font-style:italic; color:#555;"><em>Written by Neer. NutriThrive Australia.</em></p>
<p class="nt-disclaimer"><em>These statements have not been evaluated by the TGA. This content is general information only, not medical advice. Food and soap products are not intended to diagnose, treat, cure, or prevent any disease.</em></p>

<div class="nt-article-cta">
<h3>Order the $35 Gift Pack</h3>
<p>Packed in Truganina: 100g moringa, 100g Darjeeling, 30g curry leaves, 95g soap. Same-day dispatch before 2pm on business days.</p>
<div class="btn-row">
<a class="btn-solid" href="/products/gift-pack/">Shop Gift Pack — $35</a>
<a class="btn-outline" href="/pages/shipping/shipping-returns">Shipping &amp; returns</a>
</div>
</div>

<p style="margin-top: 1rem;"><a href="/blog/">&larr; Back to all articles</a></p>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul><li><strong>29 Aug 2026:</strong> Article published for Father's Day 2026 (Sunday 6 Sep).</li></ul>
</div>
<section class="nt-related-links-block">
<h2>Related guides</h2>
<ul>
<li><a href="/products/gift-pack/">Shop gift pack</a></li>
<li><a href="/blog/diwali-gift-guide-curry-leaves-tea-australia">Diwali gift guide</a></li>
<li><a href="/blog/how-to-choose-moringa-powder-australia-2026">How to choose moringa powder</a></li>
<li><a href="/blog/darjeeling-tea-vs-english-breakfast-comparison-2026">Darjeeling vs English Breakfast</a></li>
<li><a href="/melbourne/">Melbourne delivery &amp; pickup</a></li>
</ul>
</section>
"""


def main() -> None:
    raw = DRAFT.read_text(encoding="utf-8")
    body_html = wrap_answer_box(md_to_html(extract_body_md(raw)))
    # Remove trailing markdown FAQ heading duplication before CTA if mistune left raw H2 FAQ —
    # keep FAQ section from draft (useful on-page). Append site tail after.
    body_html = body_html + BODY_TAIL

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
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Guides",
                "item": "https://nutrithrive.com.au/blog/category/guides/",
            },
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
<span class="bg-primary-fixed/30 text-moringa-leaf px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider font-bold">Guides</span>
<span class="text-on-surface-variant text-label-lg font-body-md">{DATE_DISPLAY}</span>
<span class="text-on-surface-variant text-label-lg font-body-md">&#183; 10 min read</span>
</div>
<h1 class="font-display text-headline-lg md:text-display text-forest-deep mb-4 leading-tight">{H1}</h1>
<p class="text-on-surface-variant text-body-md mb-8"><strong>By Neer, NutriThrive Truganina</strong> &#183; Last updated: {DATE_DISPLAY}</p>
<div class="w-full aspect-[16/9] rounded-xl overflow-hidden mb-12 shadow-sm bg-surface-container">
<img alt="NutriThrive $35 gift pack — moringa, Darjeeling tea, curry leaves and soap, packed in Truganina" class="w-full h-full object-cover" src="{HERO}" width="1200" height="630" loading="eager" decoding="async" fetchpriority="high"/>
</div>
</header>
<div class="blog-v2-prose max-w-none">
{body_html}
</div>
</article>
<aside class="lg:col-span-4 space-y-12">
<div class="bg-pure-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden nt-blog-sidebar-promo">
<div class="aspect-square bg-surface-container relative">
<img alt="NutriThrive Gift Pack — $35" class="w-full h-full object-cover" src="{HERO}" loading="lazy" width="600" height="600"/>
<div class="absolute top-4 right-4 bg-moringa-leaf text-pure-white px-3 py-1 rounded-lg text-label-sm font-label-sm">Father's Day</div>
</div>
<div class="p-6">
<h4 class="font-headline-md text-headline-md text-forest-deep mb-2">Gift Pack — $35</h4>
<p class="text-on-surface-variant font-body-md text-body-md mb-4">100g moringa + 100g Darjeeling + 30g curry leaves + 95g soap. Packed in Truganina.</p>
<div class="nt-blog-sidebar-price flex items-baseline gap-1 mb-2">
<span class="text-2xl font-bold text-moringa-leaf">$35.00</span>
<span class="text-sm text-on-surface-variant">/325g set</span>
</div>
<p class="text-body-sm text-on-surface-variant mb-6">Free shipping over $80 · Pickup by arrangement</p>
<a class="block w-full text-center bg-moringa-leaf text-pure-white py-4 rounded-lg font-label-lg text-label-lg hover:scale-[1.02] transition-transform" href="/products/gift-pack/">Shop Gift Pack →</a>
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
