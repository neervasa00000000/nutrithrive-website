#!/usr/bin/env python3
"""Generate how-to-choose-good-face-wash-skin-type-australia-2026.html"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "blog/how-to-choose-good-face-wash-skin-type-australia-2026.html"

SLUG = "how-to-choose-good-face-wash-skin-type-australia-2026"
URL = f"https://nutrithrive.com.au/blog/{SLUG}"
TITLE = "How to Choose a Good Face Wash for Your Skin Type"
META = "Salicylic acid, sensitive skin, oily vs dry — here's how to actually choose the right face wash, plus an honest look at natural soap."
H1 = "How to Choose a Good Face Wash for Your Skin Type"
DATE = "2026-08-23"
DATE_DISPLAY = "23 Aug 2026"

QUICK_ANSWER = (
    "The right face wash depends on your skin type, not the highest-rated product online. "
    "Oily/acne-prone skin generally does better with salicylic acid or a foaming cleanser; "
    "dry or sensitive skin does better with a gentle, low-foam, fragrance-light formula. "
    "Bar soap — including natural options — can work well for normal to combination skin, "
    "but isn't usually the first choice for very sensitive or acne-prone skin, since most bar "
    "soaps sit at a higher pH than dedicated facial cleansers."
)

FAQS = [
    (
        "What's the difference between a face wash and a cleanser?",
        "In everyday use the terms overlap. 'Face wash' usually means a rinse-off product that foams or lathers. 'Cleanser' is broader and can include cream, gel, oil, or micellar formulas. What matters is texture, pH, and whether it matches your skin type — not the word on the label.",
    ),
    (
        "Do you need a different face wash for morning and night?",
        "Not necessarily. Many people use one gentle cleanser twice daily. If you wear sunscreen or makeup, a second cleanse at night (or an oil-based cleanser first) can help. Morning is often fine with a lighter wash or even just water if your skin is dry or sensitive.",
    ),
    (
        "Is bar soap bad for your face?",
        "It can be for some people. Most traditional bar soap is alkaline (higher pH than skin's natural ~4.5–5.5), which may disrupt the barrier with daily facial use — especially on sensitive or acne-prone skin. Many people with normal or combination skin use natural bars successfully; patch-test if unsure.",
    ),
    (
        "What is salicylic acid and who should use it?",
        "Salicylic acid is a beta-hydroxy acid (BHA) that exfoliates inside pores and helps with oily, congested, or acne-prone skin. It's often found at 0.5–2% in face washes. Use caution if you have very dry, eczema-prone, or easily irritated skin, or if you're already using strong retinoids — start slowly.",
    ),
    (
        "Can you use body wash on your face?",
        "Generally no. Body washes often have stronger surfactants, higher fragrance load, and a pH less suited to facial skin. They can strip or irritate the face even if they feel fine on your body. Use a product formulated for facial skin instead.",
    ),
    (
        "How do you know if a face wash is too harsh?",
        "Signs include tight, squeaky skin right after rinsing, stinging, increased redness, new breakouts, or flaking. A good cleanser should leave skin clean but comfortable — not stripped.",
    ),
    (
        "What ingredients should sensitive skin avoid in a face wash?",
        "Common triggers include synthetic fragrance ('Parfum'), strong sulfates (SLS in some gels), high alcohol content, and heavy essential-oil blends. Look for short ingredient lists, 'fragrance-free' labelling, and patch-test new products on your jawline for 48 hours.",
    ),
    (
        "What is antifungal face wash?",
        "Antifungal face washes contain medicated ingredients (such as ketoconazole or zinc pyrithione) used for specific conditions like seborrheic dermatitis or fungal acne — they are not general-purpose cleansers. If you suspect a fungal or persistent skin issue, see a GP or dermatologist rather than self-diagnosing from search trends.",
    ),
    (
        "Are vegan face washes better for your skin?",
        "Vegan means no animal-derived ingredients — it's an ethics/formulation choice, not automatically a skin-type benefit. Many vegan formulas are excellent; check whether they're also fragrance-free and suited to your skin type.",
    ),
    (
        "What about travel-size or mini face wash?",
        "Travel-size tubes are fine for short trips — choose the same formula you already tolerate at home. Decanting into unlabelled containers makes it harder to track ingredients if you react.",
    ),
]

faq_ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
        for q, a in FAQS
    ],
}

blog_posting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": TITLE,
    "description": META,
    "author": {"@type": "Person", "@id": "https://nutrithrive.com.au/#person-neer", "name": "Neer"},
    "publisher": {
        "@type": "Organization",
        "name": "NutriThrive",
        "logo": {"@type": "ImageObject", "url": "https://nutrithrive.com.au/assets/images/logo/logo-112.png"},
    },
    "datePublished": DATE,
    "dateModified": DATE,
    "image": "https://nutrithrive.com.au/assets/images/homepage/product-showcase/moringa_soap.webp",
    "mainEntityOfPage": {"@type": "WebPage", "@id": URL},
}

breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://nutrithrive.com.au/"},
        {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://nutrithrive.com.au/blog/"},
        {"@type": "ListItem", "position": 3, "name": "Guides", "item": "https://nutrithrive.com.au/blog/category/guides/"},
        {"@type": "ListItem", "position": 4, "name": TITLE, "item": URL},
    ],
}

BODY = """
<div class="answer-box">
<h2>Quick Answer</h2>
<p style="margin:0;">""" + QUICK_ANSWER + """</p>
</div>

<div class="takeaways-box">
<strong style="display:block; margin-bottom:0.5rem;">Key Takeaways</strong>
<ul>
<li>Match cleanser type to skin type — oily, dry, sensitive, and combination skin need different formulas.</li>
<li>Salicylic acid helps many oily/acne-prone users but is not for everyone; start low and slow.</li>
<li>Bar soap can work for normal/combination skin; dedicated low-pH cleansers are usually safer for sensitive or active acne.</li>
<li>Pharmacy brands (CeraVe, Cetaphil, La Roche-Posay) dominate Australian search — compare ingredients, not hype.</li>
</ul>
</div>

<p>Australians are searching hard for face wash right now — "best face wash", salicylic acid cleansers, sensitive-skin formulas, and whether bar soap belongs on your face at all. This guide answers those queries directly, without pretending one product works for everyone.</p>
<p><em>General skincare information, not medical advice. Persistent acne, rashes, or suspected fungal skin issues need a GP or dermatologist.</em></p>

<h2 id="by-skin-type">Face Wash by Skin Type</h2>
<p>This is the highest-volume question cluster in Australian search data. Here is what to look for in plain terms.</p>

<h3 id="oily-skin">Oily skin</h3>
<p><strong>Look for:</strong> gel or foaming cleansers, oil-control language, and optionally <strong>salicylic acid (BHA)</strong> at 0.5–2%. These help cut through excess sebum and keep pores clearer.</p>
<p><strong>Avoid overdoing it:</strong> stripping oily skin with harsh surfactants often triggers <em>more</em> oil production. If your skin feels tight after every wash, step down to something gentler.</p>
<p><strong>Where Australians shop:</strong> Chemist Warehouse, Priceline, and Woolworths all stock mainstream options (Neutrogena, Garnier, CeraVe). Compare the active ingredients, not just the front label.</p>

<h3 id="dry-skin">Dry skin</h3>
<p><strong>Look for:</strong> cream or lotion cleansers, "hydrating" or "gentle" on the label, low foam, and fragrance-free if you react easily. Ingredients like glycerin and ceramides support barrier comfort.</p>
<p><strong>Avoid:</strong> high-foam gels with strong sulfates and alcohol-heavy formulas that leave skin squeaky.</p>

<h3 id="sensitive-skin">Sensitive skin</h3>
<p><strong>Look for:</strong> short ingredient lists, "fragrance-free", patch-test friendly formulas. Rising search interest (+70% for "sensitive face wash") reflects real demand — many mainstream products still use heavy fragrance.</p>
<p><strong>Patch-test:</strong> apply a small amount along the jawline for 48 hours before full-face use.</p>
<p><strong>Ingredients to watch:</strong> see <a href="#faq-7">sensitive-skin ingredients FAQ</a> below.</p>

<h3 id="combination-skin">Combination skin</h3>
<p>This is the hardest to generalise — oily T-zone, normal or dry cheeks is common. Honest approach:</p>
<ul>
<li>Use a <strong>moderate gel or gentle foam</strong> overall, or</li>
<li>Use a lighter wash on the full face and a salicylic cleanser only on the oily zones, or</li>
<li>Try a single gentle cream cleanser if your cheeks feel tight with foaming products.</li>
</ul>
<p>There is no one "combination skin" magic label — experiment with one variable at a time.</p>

<div style="overflow-x:auto;">
<table class="nt-comparison-table" style="width:100%; border-collapse:collapse; margin:1.5rem 0;">
<thead><tr style="background:#0f6b4d; color:#fff;"><th style="padding:0.75rem; text-align:left;">Skin type</th><th style="padding:0.75rem; text-align:left;">Best format</th><th style="padding:0.75rem; text-align:left;">Helpful actives</th><th style="padding:0.75rem; text-align:left;">Watch out for</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #e6e2d7;"><td style="padding:0.75rem;"><strong>Oily / acne-prone</strong></td><td style="padding:0.75rem;">Gel, foaming wash</td><td style="padding:0.75rem;">Salicylic acid, niacinamide</td><td style="padding:0.75rem;">Over-stripping, fragrance if reactive</td></tr>
<tr style="border-bottom:1px solid #e6e2d7;"><td style="padding:0.75rem;"><strong>Dry</strong></td><td style="padding:0.75rem;">Cream, milk cleanser</td><td style="padding:0.75rem;">Glycerin, ceramides</td><td style="padding:0.75rem;">SLS, high alcohol, heavy foam</td></tr>
<tr style="border-bottom:1px solid #e6e2d7;"><td style="padding:0.75rem;"><strong>Sensitive</strong></td><td style="padding:0.75rem;">Fragrance-free gel or cream</td><td style="padding:0.75rem;">Minimal actives at first</td><td style="padding:0.75rem;">Parfum, essential oils, acids until tolerated</td></tr>
<tr><td style="padding:0.75rem;"><strong>Combination</strong></td><td style="padding:0.75rem;">Gentle gel or zone-specific routine</td><td style="padding:0.75rem;">Light BHA on T-zone only (optional)</td><td style="padding:0.75rem;">One harsh product on the whole face</td></tr>
</tbody>
</table>
</div>

<h2 id="salicylic-acid">What Is Salicylic Acid — and Do You Actually Need It?</h2>
<p>Salicylic acid is a <strong>beta-hydroxy acid (BHA)</strong>. It is oil-soluble, so it can penetrate into pores and help loosen dead skin cells and sebum — which is why it appears in so many "acne face wash" and "oily skin" products.</p>
<p><strong>Who it tends to suit:</strong> oily, congested, or mild acne-prone skin looking for a rinse-off exfoliating step.</p>
<p><strong>Who should be cautious:</strong></p>
<ul>
<li>Very dry, eczema-prone, or rosacea-prone skin</li>
<li>People already using prescription retinoids or strong leave-on acids (risk of irritation)</li>
<li>Anyone who stings or flakes after the first week — reduce frequency or switch formulas</li>
</ul>
<p>Salicylic acid face wash is a major trending term in Australia (+50% interest). It is useful — but it is not a default for every skin type. If you do not have oil or congestion issues, you probably do not need it.</p>

<h2 id="bar-soap">Is Bar Soap Bad for Your Face?</h2>
<p>This is the question natural-soap and "vegan face wash" searchers are really asking — and it deserves a straight answer.</p>
<p><strong>The pH issue:</strong> Healthy skin sits around <strong>pH 4.5–5.5</strong> (slightly acidic). Most traditional bar soap is more alkaline. Used on the face daily, that can disrupt the acid mantle for some people — leading to dryness, irritation, or worsened sensitivity.</p>
<p><strong>But it is not universal:</strong> plenty of people with <strong>normal to combination skin</strong> use natural bar soap on their face without problems, especially if the bar retains glycerin (cold-process soap) and skips harsh synthetic fragrance.</p>
<p><strong>Body wash on the face?</strong> Usually a bad idea — stronger surfactants and fragrance levels than facial products. See FAQ below.</p>

<h3 id="natural-bar-option">Where a natural bar (like moringa soap) fits — honestly</h3>
<p>If you are curious about a <strong>vegan, short-ingredient bar</strong> instead of a liquid face wash, a handmade cold-process bar can be a reasonable option for <strong>normal or combination skin</strong> — not a replacement for medicated salicylic acid cleansers if you have active acne.</p>
<p><strong>NutriThrive moringa soap</strong> (full disclosure: we make this): 95g cold-process bar with moringa leaf in the recipe, no parabens or synthetic fragrance, vegan and cruelty-free. We use it on body daily; some customers use it on the face — but if you have known sensitivity or active breakouts, patch-test first or stick with a dedicated facial cleanser.</p>
<p>It is a cleanse-and-rinse product, not a treatment. Do not expect salicylic-acid-level pore action from a natural bar.</p>
<p><a href="/products/moringa-soap/">See moringa soap ingredients and details →</a> · <a href="/blog/how-to-read-a-soap-ingredient-label">How to read a soap label →</a> · <a href="/blog/moringa-soap-vs-regular-soap-comparison-2026">Moringa soap vs regular soap →</a></p>

<h2 id="shopping-australia">Buying Face Wash in Australia (Chemist Warehouse, Priceline, Woolworths)</h2>
<p>Brand searches (CeraVe, La Roche-Posay, Cetaphil, Neutrogena) dominate — Australians compare pharmacy lines before buying. Practical tips:</p>
<ul>
<li>Flip to the ingredient list; ignore front-of-pack "dermatologist tested" without context.</li>
<li>Travel-size / mini face wash is fine for trips — buy the same formula you already tolerate.</li>
<li>Korean face wash interest is rising (+30%) — often gentle, low-pH gel formulas; still check fragrance and actives.</li>
<li>Vitamin C face wash exists but leave-on vitamin C serums usually deliver more consistent results; don't chase the keyword alone.</li>
</ul>

<h2 id="faqs">Quick Answers (FAQ)</h2>
"""

for i, (q, a) in enumerate(FAQS):
    BODY += f'\n<h3 id="faq-{i + 1}">{q}</h3>\n<p>{a}</p>\n'

BODY += """
<p style="margin-top:2rem; font-style:italic; color:#555;"><em>Written by Neer. NutriThrive Australia.</em></p>
<p class="nt-disclaimer"><em>General consumer information, not medical or dermatological advice. For persistent acne, eczema, or suspected fungal skin conditions, see your GP or dermatologist.</em></p>

<div class="nt-article-cta">
<h3>Curious about a natural bar option?</h3>
<p>If you want a short-ingredient, vegan bar for face or body — not a salicylic-acid replacement — see our <a href="/products/moringa-soap/">handmade moringa soap</a>. Packed in Melbourne from $7.</p>
<div class="btn-row">
<a class="btn-solid" href="/products/moringa-soap/">Shop Moringa Soap</a>
<a class="btn-outline" href="/blog/moringa-soap-vs-regular-soap-comparison-2026">Soap comparison guide</a>
</div>
</div>

<p style="margin-top: 1rem;"><a href="/blog/">&larr; Back to all articles</a></p>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul><li><strong>23 Aug 2026:</strong> Article published.</li></ul>
</div>
<section class="nt-related-links-block">
<h2>Related guides</h2>
<ul>
<li><a href="/blog/moringa-soap-vs-regular-soap-comparison-2026">Moringa soap vs regular soap</a></li>
<li><a href="/blog/how-to-read-a-soap-ingredient-label">How to read a soap ingredient label</a></li>
<li><a href="/blog/moringa-soap-benefits-for-skin-2026">Moringa soap benefits for skin</a></li>
<li><a href="/blog/cystic-acne-gut-healing-what-actually-cleared-skin-2026">Cystic acne &amp; gut health (personal story)</a></li>
<li><a href="/products/moringa-soap/">Shop moringa soap</a></li>
</ul>
</section>
"""

HTML = f"""<!DOCTYPE html>
<html class="scroll-smooth" lang="en-AU">
<head>
<link rel="icon" type="image/png" sizes="48x48" href="/assets/images/logo/favicon-48.png">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="96x96" href="/assets/images/logo/favicon-96.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/images/logo/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileImage" content="/assets/images/logo/apple-touch-icon.png">
<meta name="msapplication-TileColor" content="#0f6b4d">
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<link rel="preload" as="image" href="/assets/images/homepage/product-showcase/hero640/moringa_soap.webp" fetchpriority="high"/>
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
<meta property="og:image" content="https://nutrithrive.com.au/assets/images/homepage/product-showcase/moringa_soap.webp"/>
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
<meta name="twitter:image" content="https://nutrithrive.com.au/assets/images/homepage/product-showcase/moringa_soap.webp"/>
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
<span class="text-on-surface-variant text-label-lg font-body-md">&#183; 8 min read</span>
</div>
<h1 class="font-display text-headline-lg md:text-display text-forest-deep mb-4 leading-tight">{H1}</h1>
<p class="text-on-surface-variant text-body-md mb-8"><strong>By Neer, NutriThrive Truganina</strong> &#183; Last updated: {DATE_DISPLAY}</p>
<div class="w-full aspect-[16/9] rounded-xl overflow-hidden mb-12 shadow-sm bg-surface-container">
<img alt="Choosing a face wash for your skin type — gentle cleansing guide Australia 2026" class="w-full h-full object-cover" src="/assets/images/homepage/product-showcase/hero640/moringa_soap.webp" width="1200" height="630" loading="eager" decoding="async" fetchpriority="high"/>
</div>
</header>
<div class="blog-v2-prose max-w-none">
{BODY}
</div>
</article>
<aside class="lg:col-span-4 space-y-12">
<div class="bg-pure-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden nt-blog-sidebar-promo">
<div class="aspect-square bg-surface-container relative">
<img alt="NutriThrive Moringa Soap — natural bar cleanser" class="w-full h-full object-cover" src="/assets/images/homepage/product-showcase/moringa_soap.webp" loading="lazy" width="600" height="600"/>
<div class="absolute top-4 right-4 bg-moringa-leaf text-pure-white px-3 py-1 rounded-lg text-label-sm font-label-sm">Skincare</div>
</div>
<div class="p-6">
<h4 class="font-headline-md text-headline-md text-forest-deep mb-2">Moringa Soap</h4>
<p class="text-on-surface-variant font-body-md text-body-md mb-4">95g vegan bar · cold-process · no synthetic fragrance. A natural option for normal to combination skin.</p>
<div class="nt-blog-sidebar-price flex items-baseline gap-1 mb-2">
<span class="text-2xl font-bold text-moringa-leaf">$7.00</span>
<span class="text-sm text-on-surface-variant">/95g bar</span>
</div>
<p class="text-body-sm text-on-surface-variant mb-6">Handmade in Australia · Melbourne packed</p>
<a class="block w-full text-center bg-moringa-leaf text-pure-white py-4 rounded-lg font-label-lg text-label-lg hover:scale-[1.02] transition-transform" href="/products/moringa-soap/">Shop Moringa Soap →</a>
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

if __name__ == "__main__":
    OUT.write_text(HTML, encoding="utf-8")
    print(f"Wrote {OUT.name} ({len(HTML):,} bytes)")
