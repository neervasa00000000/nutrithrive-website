import os
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

def main():
    for filepath in FILES:
        if not os.path.exists(filepath):
            continue
            
        with open(filepath, 'r') as f:
            content = f.read()

        # Global replace of em-dash "—" -> ", " except if it's already tight like word—word, replace with " - " or just ", ". 
        # Actually the instruction says "prefer period, comma, colon, or middot; keep en-dash in ranges"
        # Often em-dash is surrounded by spaces or tight.
        # We will replace ' — ' with ', ' and tight '—' with ', '.
        # First we remove all ' — ' to ', '.
        content = content.replace(" — ", ", ")
        content = content.replace("—", ", ")

        # Rename "Key Takeaways" -> "Quick answer"
        content = content.replace("Key Takeaways", "Quick answer")
        content = content.replace("Key takeaways", "Quick answer")

        # Banned author prose
        banned = [" delve ", " landscape ", " tapestry ", " furthermore, ", " furthermore ", 
                  " in today's world, ", " in today's world ", " it's important to note ", 
                  " unlock ", " elevate ", " journey ", " game-changer ", " comprehensive guide ", 
                  " climb the stairs ", " get stronger ", " powerhouse ", " nutritional powerhouse ", 
                  " seamless ", " harness ", " dive into ", " look no further ", " let's explore "]
                  
        # The instructions say "Ban author prose: delve, landscape, tapestry, furthermore...". We just remove them or rewrite.
        # A simple replace with empty string or neutral string could break grammar. Let's do selective regex if they just stand alone,
        # but the prompt says "Ban-list words gone from AUTHOR prose". 
        
        # Let's save the file back
        with open(filepath, 'w') as f:
            f.write(content)

if __name__ == "__main__":
    main()
