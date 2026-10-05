import re

FILES = [
    "storefront/journal/grow-moringa-tree-australia/index.html",
    "storefront/journal/moringa-brands-comparison-australia-2026/index.html",
    "storefront/journal/moringa-vs-whey-protein-comparison-2026/index.html",
    "storefront/journal/rosabella-moringa-reviews-legit-or-overhyped-2026/index.html",
    "storefront/journal/moringa-soap-benefits-skin-guide/index.html",
    "storefront/journal/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025/index.html",
    "storefront/journal/how-long-does-moringa-powder-last-storage-shelf-life-2026/index.html",
    "storefront/journal/moringa-vs-coffee-melbourne-energy-hack/index.html",
    "storefront/journal/moringa-before-after-workout-timing-guide-2026/index.html",
    "storefront/journal/science-shade-drying-vs-sun-drying-moringa/index.html",
    "storefront/journal/moringa-wellness-shot-recipe-winter-2026/index.html",
    "storefront/journal/ag1-alternative-australia-moringa-comparison-2026/index.html",
    "storefront/journal/how-to-add-moringa-to-diet/index.html",
    "storefront/journal/how-to-choose-moringa-powder-australia-2026/index.html",
    "storefront/journal/what-does-moringa-powder-taste-like-honest-guide-2026/index.html",
    "storefront/journal/moringa-smoothie-recipes-australia-2026/index.html",
    "storefront/journal/moringa-patches-australia-review-do-they-work/index.html"
]

emoji_pattern = re.compile(r'[\U00010000-\U0010ffff\u2600-\u27ff]')
for filepath in FILES:
    try:
        with open(filepath, 'r') as f:
            c = f.read()
        headers = re.findall(r'<h[1-6].*?>(.*?)</h[1-6]>', c)
        for h in headers:
            if emoji_pattern.search(h):
                print(f"Emoji found in {filepath}: {h}")
    except FileNotFoundError:
        pass
