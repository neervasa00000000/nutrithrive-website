#!/usr/bin/env python3
"""Apply blog rewrites posts 4–10 (keep slugs; update body, schema, links, images)."""
from __future__ import annotations

import importlib.util
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
BASE = "https://nutrithrive.com.au"

# Reuse build helpers from posts 1–3 script
_spec = importlib.util.spec_from_file_location(
    "rw13", ROOT / "scripts/apply_blog_rewrites_1_3_2026_10_05.py"
)
rw = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(rw)

faq_entity = rw.faq_entity
build_html = rw.build_html


POST4_FAQ = [
    faq_entity(
        "What is the best loose leaf black tea?",
        "It depends on how you drink it. For milky, strong mugs choose English Breakfast or Assam. For a lighter, aromatic cup you can drink black, choose Darjeeling. Ceylon is a bright all-rounder.",
    ),
    faq_entity(
        "Is Darjeeling the same as English Breakfast?",
        "No. Darjeeling is tea from one region in India with a light, floral flavour. English Breakfast is a strong blend, usually Assam-led, made to take milk.",
    ),
    faq_entity(
        "Can you put milk in Darjeeling tea?",
        "Yes, a splash. Try it black first, then add a little milk if you like. Fuller summer-harvest Darjeelings take milk better than light spring ones.",
    ),
    faq_entity(
        "Which has more caffeine, Darjeeling or English Breakfast?",
        "Both contain caffeine, and the amount varies with leaf, dose and steep time. Strong breakfast blends brewed hot and long often extract a little more. Our Darjeeling has about 40 to 50mg per cup.",
    ),
    faq_entity(
        "How much loose leaf tea per cup?",
        "About 2 to 2.5g, or a heaped teaspoon, per 200ml cup. Use a little more for a large mug.",
    ),
    faq_entity(
        "Do you sell English Breakfast tea?",
        "No. We sell Darjeeling loose leaf black tea in 100g pouches for $7.50.",
    ),
]

POST5_FAQ = [
    faq_entity(
        "What temperature water for Darjeeling tea?",
        "About 85 to 90°C. Boil the kettle and let it stand for about a minute. Boiling water can make Darjeeling taste harsh.",
    ),
    faq_entity(
        "How long should I steep Darjeeling?",
        "3 to 4 minutes for loose leaf and 2 to 3 minutes for a tea bag. Taste at the shorter time and adjust next time.",
    ),
    faq_entity(
        "How much Darjeeling loose leaf per cup?",
        "About 2 to 2.5g, or a heaped teaspoon, per 200ml cup. Use 2.5 to 3g for a large mug.",
    ),
    faq_entity(
        "Can you make Darjeeling milk tea?",
        "Yes. Use a little more leaf or the full 4-minute steep, then add a small splash of milk. Fuller summer-harvest Darjeelings take milk best.",
    ),
    faq_entity(
        "Are Darjeeling tea bags as good as loose leaf?",
        "Bags are convenient and can make a good cup. Loose leaf gives the leaves room to open, lets you adjust the strength, and lets you see what you're buying.",
    ),
    faq_entity(
        "Can I re-steep Darjeeling loose leaf?",
        "Good loose leaf usually gives a second, shorter steep. Use fresh water at the same temperature and taste after 2 to 3 minutes.",
    ),
]

POST6_FAQ = [
    faq_entity(
        "What can I use instead of fresh curry leaves?",
        "Dried curry leaves are the best swap because they're the same leaf. Use about 2 to 3 times the volume. Makrut lime leaf is the next closest, and lemon zest works for citrus only.",
    ),
    faq_entity(
        "How many dried curry leaves equal fresh?",
        "About two to three times the volume. For 10 fresh leaves, start with 20 to 30 dried leaves and adjust by smell.",
    ),
    faq_entity(
        "Can I use curry powder instead of curry leaves?",
        "No. Curry powder is a ground spice blend that normally contains no curry leaves. It changes the dish rather than replacing the leaf.",
    ),
    faq_entity(
        "Can I freeze fresh curry leaves?",
        "Yes. Strip the leaves, pat them dry, freeze them flat in a bag and add them to hot oil straight from the freezer.",
    ),
    faq_entity(
        "Does Coles sell fresh curry leaves?",
        "Sometimes, as a fresh herb punnet. Stock varies by store and week.",
    ),
    faq_entity(
        "Do I need to soak dried curry leaves?",
        "Not for a tempering. Add them dry to hot oil. Soak them only if you're blending them into a chutney or paste.",
    ),
]

POST7_FAQ = [
    faq_entity(
        "What is curry patta called in English?",
        "Curry leaves. Curry patta and kadi patta are Hindi names for the leaves of the curry tree, Murraya koenigii.",
    ),
    faq_entity(
        "What is kadi patta in English?",
        "Kadi patta is also curry leaves in English. In other languages it's karipatta, karuveppilai (Tamil) or karapincha (Sinhala).",
    ),
    faq_entity(
        "Is curry patta the same as curry powder?",
        "No. Curry patta is a whole leaf you fry in oil for aroma. Curry powder is a ground spice blend that normally contains no curry leaves.",
    ),
    faq_entity(
        "How do I know if dried curry leaves are good?",
        "Look for olive-green, mostly whole leaves that smell green and citrusy when you crush one. Grey-brown, dusty or scentless leaves won't add much flavour.",
    ),
    faq_entity(
        "How many dried curry leaves should I use instead of fresh?",
        "About two to three times the volume a recipe gives for fresh, then adjust by smell next time.",
    ),
    faq_entity(
        "Do I need to soak dried curry leaves before cooking?",
        "No. For a tempering, add them dry to hot oil. Wet leaves make the oil spit.",
    ),
]

POST8_FAQ = [
    faq_entity(
        "Is curry powder made from curry leaves?",
        "Usually not. Curry powder is a blend of ground spices such as turmeric, coriander, cumin and chilli, and it normally contains no curry leaves.",
    ),
    faq_entity(
        "What is curry leaves powder?",
        "Dried curry leaves ground into a powder, sometimes after a quick dry-roast. It's also called curry patta powder and is often part of South Indian podi.",
    ),
    faq_entity(
        "How do I make curry leaf powder at home?",
        "Dry-roast whole dried curry leaves in a pan over low heat for 1 to 2 minutes until crisp, cool them, then grind. Store in an airtight jar and use within a few weeks.",
    ),
    faq_entity(
        "Can I use curry powder instead of curry leaves?",
        "No. They do different jobs: curry leaves add aroma when fried in oil, while curry powder adds colour and spice. Swapping changes the dish.",
    ),
    faq_entity(
        "Should I use curry leaf powder or whole leaves for tadka?",
        "Whole leaves. Powder burns almost instantly in hot oil. Save the powder for podi, eggs, buttermilk and roasted vegetables.",
    ),
]

POST9_FAQ = [
    faq_entity(
        "How do you cook with curry leaves?",
        "Fry them briefly in hot oil or ghee, usually after mustard seeds, then pour the tempering over the dish or keep cooking in the same pan. This is called tadka, and it releases the leaves' aroma into the oil.",
    ),
    faq_entity(
        "Can I use dried curry leaves without soaking them?",
        "Yes, for tadka. Add them dry to hot oil. Soak them only when you're blending them into a paste, as in chutney.",
    ),
    faq_entity(
        "How many dried curry leaves should I use?",
        "About 10 to 15 for a tadka serving three to four people. For recipes written for fresh leaves, use roughly two to three times the volume in dried.",
    ),
    faq_entity(
        "Do you eat curry leaves or take them out?",
        "Either is fine. In South Indian cooking they usually stay in the dish. Crisp fried leaves are pleasant to eat, and anyone who doesn't like the texture can set them aside.",
    ),
    faq_entity(
        "How long does curry leaf oil keep?",
        "Store it in a sealed jar in the fridge and use it within about a week.",
    ),
    faq_entity(
        "What can I use if I run out of curry leaves?",
        "There's no perfect swap. Makrut lime leaf or lemon zest can add a citrus note. See our curry leaf substitute guide for ratios.",
    ),
]

POST10_FAQ = [
    faq_entity(
        "What do curry leaves add to dal?",
        "Aroma. Fried in hot oil in the tadka, they release a citrusy, savoury fragrance that carries through the dal when you pour the oil over.",
    ),
    faq_entity(
        "How many dried curry leaves for dal?",
        "About 15 to 25 dried leaves for a pot serving four, or 10 to 12 fresh leaves. Dried leaves are milder until fried, so use a few more.",
    ),
    faq_entity(
        "Can I use dried curry leaves instead of fresh in dal?",
        "Yes. Add them dry to the hot oil and stir for 20 to 30 seconds. Don't soak them first.",
    ),
    faq_entity(
        "Can I freeze curry leaf dal?",
        "Yes. Freeze it in portions, reheat with a splash of water, and make a fresh tadka when serving for the best flavour.",
    ),
    faq_entity(
        "Is dal the same as dahl?",
        "Yes. Dal, dahl and daal are different spellings of the same lentil dish.",
    ),
]

TEA_CONV = {
    "product": "black-tea",
    "img": "/assets/images/product_webp/darjeeling-black-tea-100g-main.webp",
    "alt": "Darjeeling loose leaf black tea 100g",
    "kicker": "Shop the tea",
    "h2": "Darjeeling Loose Leaf Black Tea",
    "text": "100g from a family farm in Darjeeling, packed in Truganina.",
    "price": "$7.50 / 100g",
    "cta": "Shop Darjeeling tea",
}
TEA_SIDE = (
    "Darjeeling Loose Leaf",
    "100g from a family farm in Darjeeling.",
    "$7.50 / 100g",
    "black-tea",
    "Shop Darjeeling tea",
)
TEA_QP = ("Darjeeling Loose Leaf · $7.50 / 100g", "black-tea", "Shop Darjeeling tea", "Related product")

CURRY_CONV = {
    "product": "curry-leaves",
    "img": "/assets/images/product_webp/dried-curry-leaves-30g-main.webp",
    "alt": "Dried Curry Leaves 30g",
    "kicker": "Pantry staple",
    "h2": "Dried Curry Leaves",
    "text": "Whole dried curry leaves grown on our farm in Gujarat, packed in Truganina.",
    "price": "$7.00 / 30g",
    "cta": "Shop curry leaves",
}
CURRY_SIDE = (
    "Dried Curry Leaves",
    "Farm-grown karipatta from our own farm.",
    "$7.00 / 30g",
    "curry-leaves",
    "Shop curry leaves",
)
CURRY_QP = ("Dried Curry Leaves · $7.00 / 30g", "curry-leaves", "Shop curry leaves", "Related product")

ARTICLES = [
    {
        "slug": "darjeeling-tea-vs-english-breakfast-comparison-2026",
        "title": "Loose Leaf Black Tea: Darjeeling vs English Breakfast",
        "meta": "Choosing a loose leaf black tea? Darjeeling vs English Breakfast, Assam and Ceylon compared: flavour, strength, milk and brewing, plus where to buy in AU.",
        "h1": "Loose Leaf Black Tea: Darjeeling vs English Breakfast, Assam and Ceylon",
        "lede": "Choosing a loose leaf black tea? Darjeeling vs English Breakfast, Assam and Ceylon compared: flavour, strength, milk and brewing, plus where to buy in AU.",
        "og_title": "Which Loose Leaf Black Tea? Darjeeling vs English Breakfast",
        "og_description": "A plain-English comparison of four loose leaf black teas: flavour, strength, milk and brewing, so you can pick the right one.",
        "hero_image": "/assets/images/og/black-tea-social-1200.jpg",
        "hero_alt": "NutriThrive Darjeeling loose leaf black tea pouch and a brewed cup",
        "category": "Darjeeling tea",
        "category_href": "/blog/category/tea/",
        "breadcrumb_title": "Loose Leaf Black Tea: Darjeeling vs English Breakfast",
        "meta_line": 'Darjeeling tea · Published <time datetime="2026-10-04">4 Oct 2026</time> · Updated <time datetime="2026-10-05">5 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-10-04",
        "schema_headline": "Loose Leaf Black Tea: Darjeeling vs English Breakfast, Assam and Ceylon",
        "schema_description": "Choosing a loose leaf black tea? Darjeeling vs English Breakfast, Assam and Ceylon compared: flavour, strength, milk and brewing, plus where to buy in AU.",
        "keywords": "loose leaf black tea, loose leaf english breakfast tea, ceylon tea loose leaf, loose leaf assam black tea, darjeeling tea, black loose tea leaves",
        "faq_schema": POST4_FAQ,
        "prose_file": "post4_loose_leaf_black_tea_prose.html",
        "quick_product": TEA_QP,
        "conversion": TEA_CONV,
        "sidebar": TEA_SIDE,
        "related": [
            ("/blog/gifts-for-tea-lovers-australia", "Gifts for tea lovers"),
            ("/blog/how-to-brew-darjeeling-tea-perfectly-2026", "How to brew Darjeeling tea"),
            ("/blog/darjeeling-black-tea-australia-guide", "Where to buy Darjeeling in Australia"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("why-loose-leaf", "Why choose loose leaf black tea"),
            ("four-compared", "Four loose leaf black teas compared"),
            ("which-to-buy", "Which loose leaf black tea should you buy?"),
            ("how-to-brew", "How to brew loose leaf black tea"),
            ("our-darjeeling", "Our Darjeeling loose leaf black tea"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "how-to-brew-darjeeling-tea-perfectly-2026",
        "title": "How to Brew Darjeeling Tea: Bags vs Loose Leaf",
        "meta": "How to brew Darjeeling tea from bags or loose leaf: water temperature, steep time, leaf per cup, milk, iced tea and mug infusers, for Australian kitchens.",
        "h1": "How to Brew Darjeeling Tea: Tea Bags vs Loose Leaf, Temperature and Time",
        "lede": "How to brew Darjeeling tea from bags or loose leaf: water temperature, steep time, leaf per cup, milk, iced tea and mug infusers, for Australian kitchens.",
        "og_title": "How to Brew Darjeeling Tea (Tea Bags or Loose Leaf)",
        "og_description": "Temperature, time and leaf per cup for Darjeeling, plus milk tea, iced tea and the mistakes that make it taste harsh.",
        "hero_image": "/assets/images/og/black-tea-social-1200.jpg",
        "hero_alt": "NutriThrive Darjeeling loose leaf black tea pouch and a brewed cup",
        "category": "Darjeeling tea",
        "category_href": "/blog/category/tea/",
        "breadcrumb_title": "How to Brew Darjeeling Tea: Bags vs Loose Leaf",
        "meta_line": 'Darjeeling tea · Published <time datetime="2026-10-04">4 Oct 2026</time> · Updated <time datetime="2026-10-05">5 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-10-04",
        "schema_headline": "How to Brew Darjeeling Tea: Tea Bags vs Loose Leaf, Temperature and Time",
        "schema_description": "How to brew Darjeeling tea from bags or loose leaf: water temperature, steep time, leaf per cup, milk, iced tea and mug infusers, for Australian kitchens.",
        "keywords": "darjeeling tea bags, twinings darjeeling, darjeeling loose leaf tea, darjeeling milk tea, tea mug infuser, how to brew darjeeling tea",
        "faq_schema": POST5_FAQ,
        "prose_file": "post5_brew_darjeeling_prose.html",
        "quick_product": TEA_QP,
        "conversion": TEA_CONV,
        "sidebar": TEA_SIDE,
        "related": [
            ("/blog/darjeeling-tea-vs-english-breakfast-comparison-2026", "Loose leaf black tea compared"),
            ("/blog/gifts-for-tea-lovers-australia", "Gifts for tea lovers"),
            ("/blog/darjeeling-black-tea-australia-guide", "Where to buy Darjeeling in Australia"),
        ],
        "toc": [
            ("quick-brew", "Quick brew"),
            ("bags-vs-loose", "Darjeeling tea bags vs loose leaf"),
            ("brew-table", "Brew table by method"),
            ("mug-infusers", "Mug infusers, teapots and iced Darjeeling"),
            ("water-temp", "Getting the water temperature right"),
            ("milk-tea", "Darjeeling milk tea"),
            ("common-mistakes", "Common mistakes"),
            ("buy-darjeeling", "Buy Darjeeling loose leaf"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "curry-leaves-substitute-what-to-use-2026",
        "title": "No Fresh Curry Leaves? Best Substitutes and Dried Leaves",
        "meta": "Can't find fresh curry leaves? Use dried curry leaves (2–3× the volume), or makrut lime leaf or lemon zest. Ratios, what to avoid and where to buy.",
        "h1": "No Fresh Curry Leaves? The Best Curry Leaf Substitutes, and When to Use Dried",
        "lede": "Can't find fresh curry leaves? Use dried curry leaves (2–3× the volume), or makrut lime leaf or lemon zest. Ratios, what to avoid and where to buy.",
        "og_title": "No Fresh Curry Leaves? What to Use Instead",
        "og_description": "Swap ratios for dried curry leaves, makrut lime leaf and lemon zest, and the one swap you should never make.",
        "hero_image": "/assets/images/blog/dried-curry-leaves-quality-guide-how-to-use-hero.webp",
        "hero_alt": "NutriThrive dried curry leaves 30g pouch beside a plate of whole dried leaves",
        "category": "Curry leaves",
        "category_href": "/blog/category/curry-leaves/",
        "breadcrumb_title": "No Fresh Curry Leaves? Best Substitutes and Dried Leaves",
        "meta_line": 'Curry leaves · Published <time datetime="2026-06-29">29 Jun 2026</time> · Updated <time datetime="2026-10-05">5 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-06-29",
        "schema_headline": "No Fresh Curry Leaves? The Best Curry Leaf Substitutes, and When to Use Dried",
        "schema_description": "Can't find fresh curry leaves? Use dried curry leaves (2–3× the volume), or makrut lime leaf or lemon zest. Ratios, what to avoid and where to buy.",
        "keywords": "fresh curry leaves, curry leaves near me, frozen curry leaves, dried curry leaves coles, curry leaf substitute",
        "faq_schema": POST6_FAQ,
        "prose_file": "post6_fresh_substitutes_prose.html",
        "quick_product": CURRY_QP,
        "conversion": CURRY_CONV,
        "sidebar": CURRY_SIDE,
        "related": [
            ("/blog/dried-curry-leaves-quality-guide-how-to-use", "How to choose dried curry leaves"),
            ("/blog/curry-leaves-vs-curry-powder-difference-explained-2026", "Curry leaves vs curry powder"),
            ("/blog/curry-leaves-recipes-beyond-dal", "Cooking with curry leaves"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("why-hard-to-find", "Why fresh curry leaves are hard to find"),
            ("substitutes-compared", "Curry leaf substitutes compared"),
            ("swapping-fresh-for-dried", "Swapping fresh curry leaves for dried"),
            ("substitutes-pinch", "Substitutes that work in a pinch"),
            ("what-not-to-use", "What not to use instead of curry leaves"),
            ("keep-pouch", "Keep a pouch in the pantry"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "dried-curry-leaves-quality-guide-how-to-use",
        "title": "Curry Patta (Kadi Patta) in English: Buy Good Dried Leaves",
        "meta": "Curry patta, kadi patta and karipatta are curry leaves in English. How to choose good dried curry leaves by colour and aroma, how many to use and storage.",
        "h1": "Curry Patta, Kadi Patta, Karipatta: Curry Leaves in English, and How to Choose Dried Ones",
        "lede": "Curry patta, kadi patta and karipatta are curry leaves in English. How to choose good dried curry leaves by colour and aroma, how many to use and storage.",
        "og_title": "Curry Patta, Kadi Patta, Karipatta: Curry Leaves in English",
        "og_description": "Every name for curry leaves in one table, plus a 60-second checklist for choosing dried curry patta that still has flavour.",
        "hero_image": "/assets/images/blog/dried-curry-leaves-quality-guide-how-to-use-hero.webp",
        "hero_alt": "NutriThrive dried curry leaves 30g pouch beside a plate of whole dried leaves",
        "category": "Curry leaves",
        "category_href": "/blog/category/curry-leaves/",
        "breadcrumb_title": "Curry Patta (Kadi Patta) in English: Buy Good Dried Leaves",
        "meta_line": 'Curry leaves · Published <time datetime="2026-10-02">2 Oct 2026</time> · Updated <time datetime="2026-10-05">5 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-10-02",
        "schema_headline": "Curry Patta, Kadi Patta, Karipatta: Curry Leaves in English, and How to Choose Dried Ones",
        "schema_description": "Curry patta, kadi patta and karipatta are curry leaves in English. How to choose good dried curry leaves by colour and aroma, how many to use and storage.",
        "keywords": "curry patta, kadi patta in english, kadi patta, curry leaf in english, kari patta, dried curry leaves",
        "faq_schema": POST7_FAQ,
        "prose_file": "post7_curry_patta_prose.html",
        "quick_product": CURRY_QP,
        "conversion": CURRY_CONV,
        "sidebar": CURRY_SIDE,
        "related": [
            ("/blog/curry-leaves-substitute-what-to-use-2026", "No fresh curry leaves? Substitutes"),
            ("/blog/curry-leaves-vs-curry-powder-difference-explained-2026", "Curry leaves powder vs curry powder"),
            ("/blog/curry-leaves-recipes-beyond-dal", "Cooking with curry leaves"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("names-by-language", "Curry leaf names by language"),
            ("same-as-powder", "Is curry patta the same as curry powder?"),
            ("quality-checklist", "How to choose good dried curry patta"),
            ("how-many", "How many dried curry leaves to use"),
            ("bloom-in-oil", "How to bloom dried curry leaves in oil"),
            ("storing", "Storing dried curry leaves"),
            ("our-curry-patta", "Our curry patta"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "curry-leaves-vs-curry-powder-difference-explained-2026",
        "title": "Curry Leaves Powder vs Curry Powder: What's the Difference?",
        "meta": "Curry leaves powder is ground curry leaf; curry powder is a spice blend. How they differ, how to grind dried leaves at home, and when to use whole leaves.",
        "h1": "Curry Leaves Powder vs Curry Powder: What's the Difference?",
        "lede": "Curry leaves powder is ground curry leaf; curry powder is a spice blend. How they differ, how to grind dried leaves at home, and when to use whole leaves.",
        "og_title": "Curry Leaves Powder vs Curry Powder: Not the Same Thing",
        "og_description": "Why curry powder isn't made from curry leaves, how to grind your own curry leaf powder from whole dried leaves, and when whole leaves work better.",
        "hero_image": "/assets/images/product_webp/dried-curry-leaves-texture.webp",
        "hero_alt": "Whole dried curry leaves (karipatta) in a ceramic bowl",
        "category": "Curry leaves",
        "category_href": "/blog/category/curry-leaves/",
        "breadcrumb_title": "Curry Leaves Powder vs Curry Powder: What's the Difference?",
        "meta_line": 'Curry leaves · Published <time datetime="2026-06-20">20 Jun 2026</time> · Updated <time datetime="2026-10-05">5 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-06-20",
        "schema_headline": "Curry Leaves Powder vs Curry Powder: What's the Difference?",
        "schema_description": "Curry leaves powder is ground curry leaf; curry powder is a spice blend. How they differ, how to grind dried leaves at home, and when to use whole leaves.",
        "keywords": "curry leaves powder, curry patta powder, curry patta, dried curry leaves, curry leaves vs curry powder",
        "faq_schema": POST8_FAQ,
        "prose_file": "post8_powder_vs_powder_prose.html",
        "quick_product": CURRY_QP,
        "conversion": CURRY_CONV,
        "sidebar": CURRY_SIDE,
        "related": [
            ("/blog/dried-curry-leaves-quality-guide-how-to-use", "Curry patta in English"),
            ("/blog/curry-leaf-podi-recipe-dried-curry-leaves", "Curry leaf podi recipe"),
            ("/blog/curry-leaves-substitute-what-to-use-2026", "Curry leaf substitutes"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("at-a-glance", "Curry leaves, powder and curry powder at a glance"),
            ("what-leaves-powder", "What curry leaves powder is"),
            ("what-curry-powder", "What curry powder is"),
            ("how-to-make", "How to make curry leaf powder"),
            ("when-whole-beats", "When whole leaves beat powder"),
            ("can-you-swap", "Can you swap one for the other?"),
            ("where-to-buy", "Where to buy curry leaves in Australia"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "curry-leaves-recipes-beyond-dal",
        "title": "Cooking with Curry Leaves: 6 Easy Recipes Beyond Dal",
        "meta": "Cooking with curry leaves at home: the 60-second tadka, how many dried leaves to use, and 6 recipes from lemon rice to curry leaf oil and green beans.",
        "h1": "Cooking with Curry Leaves: The 60-Second Tadka and 6 Recipes Beyond Dal",
        "lede": "Cooking with curry leaves at home: the 60-second tadka, how many dried leaves to use, and 6 recipes from lemon rice to curry leaf oil and green beans.",
        "og_title": "Cooking with Curry Leaves: 6 Recipes Beyond Dal",
        "og_description": "Lemon rice, chutney, tempered eggs, potatoes, curry leaf oil and poriyal, all made with dried curry leaves and one 60-second tadka.",
        "hero_image": "/assets/images/blog/curry-leaves-recipes-beyond-dal-hero.webp",
        "hero_alt": "Curry leaves sizzling in hot oil in a steel pan for tadka",
        "category": "Curry leaves",
        "category_href": "/blog/category/curry-leaves/",
        "breadcrumb_title": "Cooking with Curry Leaves: 6 Easy Recipes Beyond Dal",
        "meta_line": 'Curry leaves · Published <time datetime="2026-08-09">9 Aug 2026</time> · Updated <time datetime="2026-10-05">5 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-08-09",
        "schema_headline": "Cooking with Curry Leaves: The 60-Second Tadka and 6 Recipes Beyond Dal",
        "schema_description": "Cooking with curry leaves at home: the 60-second tadka, how many dried leaves to use, and 6 recipes from lemon rice to curry leaf oil and green beans.",
        "keywords": "cooking curry leaves, curry leaf indian cuisine, dried curry leaves, buy curry leaves, curry leaves",
        "faq_schema": POST9_FAQ,
        "prose_file": "post9_cooking_recipes_prose.html",
        "quick_product": CURRY_QP,
        "conversion": CURRY_CONV,
        "sidebar": CURRY_SIDE,
        "related": [
            ("/blog/curry-leaves-dahl-recipe-30-minutes-australia-2026", "30-minute curry leaf dal"),
            ("/blog/diwali-gifts-for-friends-curry-leaf-snacks", "Curry leaf tadka snack jars"),
            ("/blog/curry-leaves-substitute-what-to-use-2026", "Curry leaf substitutes"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("sixty-second-tadka", "The 60-second curry leaf tadka"),
            ("six-recipes", "6 recipes with dried curry leaves"),
            ("how-many-per-dish", "How many dried curry leaves per dish"),
            ("fresh-or-dried", "Fresh or dried curry leaves for cooking?"),
            ("stock-pantry", "Stock the pantry"),
            ("faq", "FAQ"),
        ],
    },
    {
        "slug": "curry-leaves-dahl-recipe-30-minutes-australia-2026",
        "title": "Curry Leaf Dal Recipe: 30-Minute Tadka Dal (Dried Leaves)",
        "meta": "A 30-minute red lentil dal finished with a dried curry leaf and mustard seed tadka. Ingredients, step-by-step method, how many leaves to use and freezing.",
        "h1": "30-Minute Curry Leaf Dal with a Dried Curry Leaf Tadka",
        "lede": "A 30-minute red lentil dal finished with a dried curry leaf and mustard seed tadka. Ingredients, step-by-step method, how many leaves to use and freezing.",
        "og_title": "30-Minute Curry Leaf Dal with a Dried Curry Leaf Tadka",
        "og_description": "One pot of red lentil dal, one small pan of curry leaf tadka. Ingredients, method, variations and how to freeze it.",
        "hero_image": "/assets/images/product_webp/dried-curry-leaves-texture.webp",
        "hero_alt": "Whole dried curry leaves (karipatta) in a ceramic bowl",
        "category": "Curry leaves",
        "category_href": "/blog/category/curry-leaves/",
        "breadcrumb_title": "Curry Leaf Dal Recipe: 30-Minute Tadka Dal (Dried Leaves)",
        "meta_line": 'Curry leaves · Published <time datetime="2026-07-27">27 Jul 2026</time> · Updated <time datetime="2026-10-05">5 Oct 2026</time> · By <a href="/about#founder" rel="author">Neer Vasa</a>',
        "date_published": "2026-07-27",
        "schema_headline": "30-Minute Curry Leaf Dal with a Dried Curry Leaf Tadka",
        "schema_description": "A 30-minute red lentil dal finished with a dried curry leaf and mustard seed tadka. Ingredients, step-by-step method, how many leaves to use and freezing.",
        "keywords": "curry leaf dal recipe, curry leaves, dried curry leaves, curry leaves in cooking, kadi patta",
        "faq_schema": POST10_FAQ,
        "prose_file": "post10_dal_recipe_prose.html",
        "quick_product": CURRY_QP,
        "conversion": CURRY_CONV,
        "sidebar": CURRY_SIDE,
        "related": [
            ("/blog/curry-leaves-recipes-beyond-dal", "Cooking with curry leaves: 6 recipes"),
            ("/blog/dried-curry-leaves-quality-guide-how-to-use", "How to choose dried curry leaves"),
            ("/blog/curry-leaves-substitute-what-to-use-2026", "Curry leaf substitutes"),
        ],
        "toc": [
            ("quick-answer", "Quick answer"),
            ("why-tadka-matters", "Why the curry leaf tadka matters"),
            ("the-recipe", "The recipe: 30-minute curry leaf dal"),
            ("fresh-or-dried", "Fresh or dried curry leaves for dal"),
            ("variations", "Variations"),
            ("storing-freezing", "Storing and freezing"),
            ("get-curry-leaves", "Get the curry leaves"),
            ("faq", "FAQ"),
        ],
    },
]


def update_blog_articles_js() -> None:
    path = SITE / "shared/js/blog-articles.js"
    src = path.read_text(encoding="utf-8")
    for art in ARTICLES:
        pattern = re.compile(
            rf'\{{\s*"slug": "{re.escape(art["slug"])}",[\s\S]*?\}}',
            re.M,
        )
        title = art["title"].replace("&amp;", "&").replace("'", "\\u2019")
        # Keep titles simple for JSON
        title_json = art["title"].replace("&amp;", "&")
        block = (
            "{\n"
            f'    "slug": "{art["slug"]}",\n'
            f'    "title": {json.dumps(title_json)},\n'
            f'    "description": {json.dumps(art["meta"])},\n'
            f'    "category": {json.dumps(art["category"])},\n'
            f'    "href": "/blog/{art["slug"]}",\n'
            f'    "image": "{art["hero_image"]}"\n'
            "  }"
        )
        def _repl(_m, b=block):
            return b

        src, n = pattern.subn(_repl, src, count=1)
        if n != 1:
            raise SystemExit(f"blog-articles.js: could not replace {art['slug']}")
    path.write_text(src, encoding="utf-8")


def update_search_index() -> None:
    paths = [
        SITE / "assets/js/storefront/search-index.js",
        ROOT / "storefront/js/search-index.js",
    ]
    for path in paths:
        if not path.exists():
            continue
        src = path.read_text(encoding="utf-8")
        eq = src.index("=")
        data = json.loads(src[eq + 1 :].strip().rstrip(";"))
        by_href = {i.get("href"): i for i in data}
        for art in ARTICLES:
            href = f"/blog/{art['slug']}"
            obj = {
                "title": art["title"].replace("&amp;", "&"),
                "href": href,
                "kind": art["category"],
                "blurb": art["meta"],
            }
            if href in by_href:
                by_href[href].update(obj)
            else:
                data.append(obj)
                by_href[href] = obj
        joiner = " = " if "NT_SEARCH = " in src else "="
        path.write_text(
            "window.NT_SEARCH" + joiner + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n",
            encoding="utf-8",
        )


def patch_internal_links() -> None:
    # Black tea product guides
    tea = SITE / "products/black-tea/index.html"
    if tea.exists():
        t = tea.read_text(encoding="utf-8")
        if "Loose leaf black tea compared" not in t:
            t = t.replace(
                '<li><a href="/blog/darjeeling-tea-vs-english-breakfast-comparison-2026">Darjeeling versus English Breakfast</a></li>',
                '<li><a href="/blog/darjeeling-tea-vs-english-breakfast-comparison-2026">Loose leaf black tea compared</a></li>',
            )
        if 'how to brew Darjeeling tea' not in t and "How to brew Darjeeling tea" in t:
            t = t.replace(
                '<li><a href="/blog/how-to-brew-darjeeling-tea-perfectly-2026">How to brew Darjeeling tea</a></li>',
                '<li><a href="/blog/how-to-brew-darjeeling-tea-perfectly-2026">how to brew Darjeeling tea</a></li>',
            )
        tea.write_text(t, encoding="utf-8")

    # Curry leaves product
    curry = SITE / "products/curry-leaves/index.html"
    if curry.exists():
        c = curry.read_text(encoding="utf-8")
        for old, new in [
            (
                "dried-curry-leaves-quality-guide-how-to-use",
                None,  # keep
            ),
        ]:
            pass
        if "cooking with curry leaves: 6 recipes" not in c.lower() and "curry-leaves-recipes-beyond-dal" in c:
            c = c.replace(
                'href="/blog/curry-leaves-recipes-beyond-dal"',
                'href="/blog/curry-leaves-recipes-beyond-dal"',
            )
        if "curry leaf names by language" not in c and "dried-curry-leaves-quality-guide" in c:
            # Add anchor-style label if a names FAQ exists
            c = c.replace(
                ">Dried curry leaves quality guide<",
                ">curry leaf names by language<",
            )
        if "30-minute curry leaf dal recipe" not in c and "curry-leaves-dahl-recipe" in c:
            c = re.sub(
                r'(href="/blog/curry-leaves-dahl-recipe-30-minutes-australia-2026"[^>]*>)[^<]+',
                r"\g<1>30-minute curry leaf dal recipe",
                c,
                count=1,
            )
        if "curry leaves powder vs curry powder" not in c.lower():
            # ensure vs powder link wording if present
            c = re.sub(
                r'(href="/blog/curry-leaves-vs-curry-powder-difference-explained-2026"[^>]*>)[^<]+',
                r"\g<1>curry leaves powder vs curry powder",
                c,
                count=1,
            )
        if "cooking with curry leaves: 6 recipes" not in c.lower():
            c = re.sub(
                r'(href="/blog/curry-leaves-recipes-beyond-dal"[^>]*>)[^<]+',
                r"\g<1>cooking with curry leaves: 6 recipes",
                c,
                count=1,
            )
        curry.write_text(c, encoding="utf-8")

    # Diwali guide links
    diwali = SITE / "blog/diwali-gift-guide-curry-leaves-tea-australia.html"
    if diwali.exists():
        d = diwali.read_text(encoding="utf-8")
        d = d.replace(
            '<li><a href="/blog/curry-leaves-recipes-beyond-dal">How to use dried curry leaves: 6 recipes</a></li>',
            '<li><a href="/blog/curry-leaves-recipes-beyond-dal">how to use dried curry leaves</a></li>',
        )
        if "curry leaf dal recipe" not in d:
            d = d.replace(
                "dried curry leaves + mustard seeds + a handwritten recipe card, or <a href=\"/blog/diwali-gifts-for-friends-curry-leaf-snacks\">curry leaf snack jars for friends</a>.",
                "dried curry leaves + mustard seeds + a handwritten recipe card, or <a href=\"/blog/diwali-gifts-for-friends-curry-leaf-snacks\">curry leaf snack jars for friends</a>. Try our <a href=\"/blog/curry-leaves-dahl-recipe-30-minutes-australia-2026\">curry leaf dal recipe</a>.",
            )
        if "how to brew Darjeeling tea" not in d:
            d = d.replace(
                '<li><a href="/blog/how-to-brew-darjeeling-tea-perfectly-2026">How to brew Darjeeling tea</a></li>',
                '<li><a href="/blog/how-to-brew-darjeeling-tea-perfectly-2026">how to brew Darjeeling tea</a></li>',
            )
        diwali.write_text(d, encoding="utf-8")

    # Darjeeling guide: add first-flush id if heading exists
    guide = SITE / "blog/darjeeling-black-tea-australia-guide.html"
    if guide.exists():
        g = guide.read_text(encoding="utf-8")
        if 'id="first-flush-vs-second-flush"' not in g:
            g = re.sub(
                r"<h2([^>]*)>([^<]*[Ff]irst [Ff]lush[^<]*)</h2>",
                r'<h2\1 id="first-flush-vs-second-flush">\2</h2>',
                g,
                count=1,
            )
        if "loose leaf black tea comparison" not in g and "darjeeling-tea-vs-english-breakfast" in g:
            g = re.sub(
                r'(href="/blog/darjeeling-tea-vs-english-breakfast-comparison-2026"[^>]*>)[^<]+',
                r"\g<1>loose leaf black tea comparison",
                g,
                count=1,
            )
        if "Darjeeling as a gift for tea lovers" not in g and "gifts-for-tea-lovers" not in g:
            # add closing link if there's a natural spot
            g = g.replace(
                "</div>\n          \n          <section class=\"article-conversion\"",
                '<p>Looking for a present? See <a href="/blog/gifts-for-tea-lovers-australia">Darjeeling as a gift for tea lovers</a>.</p>\n</div>\n          \n          <section class="article-conversion"',
                1,
            )
        guide.write_text(g, encoding="utf-8")

    # Post 1 snack jars optional link already in related; ensure recipes post links snack jars
    recipes = SITE / "blog/curry-leaves-recipes-beyond-dal.html"
    # will be overwritten by build; cross-links are in related nav of ARTICLES

    # Australia guide fresh vs dried
    au = SITE / "blog/dried-curry-leaves-australia-guide.html"
    if au.exists():
        a = au.read_text(encoding="utf-8")
        if "no fresh curry leaves" not in a.lower() and "curry-leaves-substitute" in a:
            a = re.sub(
                r'(href="/blog/curry-leaves-substitute-what-to-use-2026"[^>]*>)[^<]+',
                r"\g<1>no fresh curry leaves? substitutes",
                a,
                count=1,
            )
        if "curry patta" not in a.lower() or "kadi patta" not in a.lower():
            if "dried-curry-leaves-quality-guide-how-to-use" in a:
                a = re.sub(
                    r'(href="/blog/dried-curry-leaves-quality-guide-how-to-use"[^>]*>)[^<]+',
                    r"\g<1>curry patta / kadi patta",
                    a,
                    count=1,
                )
        au.write_text(a, encoding="utf-8")


def patch_blog_cards() -> None:
    """Update titles/images on category and index cards for rewritten posts."""
    updates = {
        "darjeeling-tea-vs-english-breakfast-comparison-2026": (
            "Loose Leaf Black Tea: Darjeeling vs English Breakfast",
            "/assets/images/og/black-tea-social-1200.jpg",
            "Choosing a loose leaf black tea? Darjeeling vs English Breakfast, Assam and Ceylon compared.",
        ),
        "how-to-brew-darjeeling-tea-perfectly-2026": (
            "How to Brew Darjeeling Tea: Bags vs Loose Leaf",
            "/assets/images/og/black-tea-social-1200.jpg",
            "How to brew Darjeeling tea from bags or loose leaf: temperature, time, milk and iced tea.",
        ),
        "curry-leaves-substitute-what-to-use-2026": (
            "No Fresh Curry Leaves? Best Substitutes and Dried Leaves",
            "/assets/images/blog/dried-curry-leaves-quality-guide-how-to-use-hero.webp",
            "Can't find fresh curry leaves? Use dried curry leaves, makrut lime leaf or lemon zest.",
        ),
        "dried-curry-leaves-quality-guide-how-to-use": (
            "Curry Patta (Kadi Patta) in English: Buy Good Dried Leaves",
            "/assets/images/blog/dried-curry-leaves-quality-guide-how-to-use-hero.webp",
            "Curry patta, kadi patta and karipatta are curry leaves in English. How to choose good dried leaves.",
        ),
        "curry-leaves-vs-curry-powder-difference-explained-2026": (
            "Curry Leaves Powder vs Curry Powder: What's the Difference?",
            "/assets/images/product_webp/dried-curry-leaves-texture.webp",
            "Curry leaves powder is ground curry leaf; curry powder is a spice blend.",
        ),
        "curry-leaves-recipes-beyond-dal": (
            "Cooking with Curry Leaves: 6 Easy Recipes Beyond Dal",
            "/assets/images/blog/curry-leaves-recipes-beyond-dal-hero.webp",
            "The 60-second tadka and 6 recipes from lemon rice to curry leaf oil.",
        ),
        "curry-leaves-dahl-recipe-30-minutes-australia-2026": (
            "Curry Leaf Dal Recipe: 30-Minute Tadka Dal (Dried Leaves)",
            "/assets/images/product_webp/dried-curry-leaves-texture.webp",
            "A 30-minute red lentil dal finished with a dried curry leaf tadka.",
        ),
    }
    for rel in (
        "blog/index.html",
        "blog/category/tea/index.html",
        "blog/category/curry-leaves/index.html",
    ):
        p = SITE / rel
        if not p.exists():
            continue
        t = p.read_text(encoding="utf-8")
        for slug, (title, img, blurb) in updates.items():
            if f'href="/blog/{slug}"' not in t:
                continue
            # Update image src near this card
            t = re.sub(
                rf'(href="/blog/{re.escape(slug)}"[^>]*>[\s\S]*?<div class="article-card-media"><img src=")[^"]+',
                rf"\g<1>{img}?v=20260915-1",
                t,
                count=1,
            )
            t = re.sub(
                rf'(href="/blog/{re.escape(slug)}"[^>]*>[\s\S]*?<h3>)[^<]+(</h3>)',
                rf"\g<1>{title}\2",
                t,
                count=1,
            )
            t = re.sub(
                rf'(href="/blog/{re.escape(slug)}"[^>]*>[\s\S]*?<h3>[^<]+</h3>\s*<p>)[^<]+(</p>)',
                rf"\g<1>{blurb}\2",
                t,
                count=1,
            )
            search = f"{title} {blurb} {slug}".lower()
            t = re.sub(
                rf'(href="/blog/{re.escape(slug)}"[^>]*data-search-text=")[^"]*(")',
                rf"\1{search}\2",
                t,
                count=1,
            )
        p.write_text(t, encoding="utf-8")


def fix_curry_webp_elsewhere() -> None:
    """Swap misleading 100g Curry.webp on rewrite-related posts only (already handled in rebuild).
    Also fix can-you-use / australia-guide cards if they still point at Curry.webp for product truth —
    user said two curry posts; rebuild covers substitute + vs powder.
    """
    safe = "/assets/images/product_webp/dried-curry-leaves-texture.webp"
    for slug in (
        "curry-leaves-substitute-what-to-use-2026",
        "curry-leaves-vs-curry-powder-difference-explained-2026",
    ):
        # Already rebuilt; noop safety
        p = SITE / "blog" / f"{slug}.html"
        if not p.exists():
            continue
        t = p.read_text(encoding="utf-8")
        if "Curry.webp" in t:
            t = t.replace("/assets/images/homepage/product-showcase/Curry.webp", safe)
            p.write_text(t, encoding="utf-8")
            print(f"Swapped Curry.webp on {slug}")


def main() -> None:
    for art in ARTICLES:
        out = SITE / "blog" / f"{art['slug']}.html"
        out.write_text(build_html(art), encoding="utf-8")
        print(f"Wrote {out.relative_to(ROOT)}")

    update_blog_articles_js()
    update_search_index()
    patch_internal_links()
    patch_blog_cards()
    fix_curry_webp_elsewhere()

    subprocess.run(["node", str(ROOT / "scripts/build-sitemap.cjs")], cwd=ROOT, check=True)
    subprocess.run(["node", str(ROOT / "scripts/regenerate-blog-itemlist.mjs")], cwd=ROOT, check=True)
    print("Done: posts 4–10.")


if __name__ == "__main__":
    main()
