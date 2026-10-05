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

REPLACEMENTS = {
    # adjectives / descriptors to remove
    r'(?i)\bdelve into\b': 'discuss',
    r'(?i)\bdelve\b': 'look at',
    r'(?i)\blandscape\b': 'market',
    r'(?i)\brich tapestry\b': 'history',
    r'(?i)\btapestry\b': 'history',
    r'(?i)\bfurthermore,? ?\b': '',
    r'(?i)\bin today\'s world,? ?\b': '',
    r'(?i)\bit\'s important to note that\b': 'note that',
    r'(?i)\bit is important to note that\b': 'note that',
    r'(?i)\bit\'s important to note\b': '',
    r'(?i)\bwhether you\'re\b': 'whether you are',
    r'(?i)\bunlocks\b': 'releases',
    r'(?i)\bunlock\b': 'get',
    r'(?i)\belevate your\b': 'improve your',
    r'(?i)\belevate\b': 'improve',
    r'(?i)\byour wellness journey\b': 'your health',
    r'(?i)\bjourney\b': 'process',
    r'(?i)\bgame-changer\b': 'useful option',
    r'(?i)\ba comprehensive guide\b': 'a guide',
    r'(?i)\bcomprehensive guide\b': 'guide',
    r'(?i)\bclimb the stairs\b': 'use the stairs',
    r'(?i)\bget stronger\b': 'build strength',
    r'(?i)\bnutritional powerhouse\b': 'nutrient-dense option',
    r'(?i)\bpowerhouse\b': 'strong source',
    r'(?i)\bseamlessly\b': 'easily',
    r'(?i)\bseamless\b': 'smooth',
    r'(?i)\bharness the\b': 'use the',
    r'(?i)\bharness\b': 'use',
    r'(?i)\bdive into\b': 'discuss',
    r'(?i)\blook no further\b': 'here it is',
    r'(?i)\blet\'s explore\b': 'we explore',
    
    # Emojis in headers (just removing common ones like 💪, 🌱, 🔬, 🏆, 📊, ⭐)
    r'<h([1-6])[^>]*>\s*[\U00010000-\U0010ffff\u2600-\u27ff]\s*': r'<h\1>'
}

def main():
    for filepath in FILES:
        try:
            with open(filepath, 'r') as f:
                c = f.read()
            for pattern, repl in REPLACEMENTS.items():
                c = re.sub(pattern, repl, c)
            with open(filepath, 'w') as f:
                f.write(c)
        except FileNotFoundError:
            pass

if __name__ == "__main__":
    main()
