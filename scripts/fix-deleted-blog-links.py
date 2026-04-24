#!/usr/bin/env python3
"""One-off: rewrite internal hrefs after blog post removals (matches _redirects 2026-04-24)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# (fragment to find, replacement) — order: longer filenames first where needed
REPLACEMENTS = [
    # Bucket 2 → pillars
    ("australian-superfood-revolution-moringa-precision-nutrition-2026.html", "moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html"),
    ("best-moringa-powder-australia-2026-how-to-choose-top-superfoods-compare-brands-boost-wellness.html", "moringa-brands-comparison-australia-2026.html"),
    ("best-moringa-powder-australia-2026-what-to-look-for-before-you-buy.html", "moringa-brands-comparison-australia-2026.html"),
    ("best-rated-moringa-capsules-powders-australia-2026-ultimate-guide.html", "moringa-brands-comparison-australia-2026.html"),
    ("curry-leaves-health-benefits-science-research-australia-2026.html", "dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html"),
    ("dried-curry-leaves-karipatta-benefits-melbourne-guide.html", "dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html"),
    ("dried-curry-leaves-melbourne-buy-online-health-benefits-recipes-2026.html", "dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html"),
    ("dried-curry-leaves-melbourne-premium-buyers-guide-benefits-recipes-free-delivery-2026.html", "dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html"),
    ("dried-curry-leaves-uses-benefits-how-to-cook-melbourne-2026.html", "dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html"),
    ("how-to-store-dried-curry-leaves-freshness-tips-melbourne-kitchens.html", "dried-curry-leaves-australia-uses-storage-health-benefits-cooking-guide-2026.html"),
    ("moringa-adaptogen-stress-relief-cortisol-balance.html", "moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html"),
    ("moringa-at-chemist-warehouse-australia-worth-it-2026.html", "where-to-buy-moringa-in-australia-online-vs-stores-2026-guide.html"),
    ("moringa-benefits-what-happens-when-you-take-it-every-day-2026.html", "moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html"),
    ("moringa-brands-reviewed-australia-2025-verdict.html", "moringa-brands-comparison-australia-2026.html"),
    ("moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025.html", "where-to-buy-moringa-in-australia-online-vs-stores-2026-guide.html"),
    ("moringa-miracle-tree-digestion-energy-health-adults-2026.html", "moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html"),
    ("moringa-powder-australia-honest-buyers-guide-before-you-buy.html", "moringa-brands-comparison-australia-2026.html"),
    ("moringa-powder-benefits-2026-guide-real-reason-daily-routine.html", "moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html"),
    ("moringa-powder-benefits-uses-how-to-choose-best-one-australia-2026.html", "moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html"),
    ("moringa-vs-matcha-australia-2025.html", "moringa-vs-spirulina-vs-matcha-comparison-australia.html"),
    ("moringa-vs-matcha-energy-metabolism-2026.html", "moringa-vs-spirulina-vs-matcha-comparison-australia.html"),
    ("spirulina-vs-moringa-vs-matcha-gut-health-2026-scientific-review.html", "moringa-vs-spirulina-vs-matcha-comparison-australia.html"),
    ("top-moringa-companies-australia-2026.html", "moringa-brands-comparison-australia-2026.html"),
    ("ultimate-guide-moringa-curry-leaves-australia-2026.html", "moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html"),
    ("where-to-buy-moringa-australia-chemist-warehouse-woolworths-nutrithrive-2025.html", "where-to-buy-moringa-in-australia-online-vs-stores-2026-guide.html"),
    ("why-stopped-buying-moringa-chemist-warehouse-2026.html", "where-to-buy-moringa-in-australia-online-vs-stores-2026-guide.html"),
    ("best-moringa-powder-australia-2026.html", "moringa-brands-comparison-australia-2026.html"),
    # deleted protein guide URLs → this site’s replacement article
    ("best-protein-powder-australia-2026-complete-guide.html", "best-clean-protein-powders-moringa-products-australia-2026.html"),
    ("https://nutrithrive.com.au/blog/best-protein-powder-australia-2026-complete-guide.html", "https://nutrithrive.com.au/blog/best-clean-protein-powders-moringa-products-australia-2026.html"),
]

# Bucket 3 → homepage path
HOME = "/"
BUCKET3 = [
    "australia-summer-2026-trends-travel-shopping-wellness-guide.html",
    "australian-health-consumer-2026-behavioral-psychographics-wellness.html",
    "best-gyms-melbourne-cbd-2026-complete-comparison-guide.html",
    "best-protein-brands-australia-seniors-over-70-2026-strength-vitality-guide.html",
    "best-protein-energy-bars-australia-2026-supermarket-guide.html",
    "darjeeling-black-tea-melbourne-muscatel-marvel.html",
    "definitive-encyclopedia-handcrafted-soap-for-sidney-2026.html",
    "high-protein-snacks-australia-25-options-under-150-calories-2025.html",
    "melbourne-outdoor-gyms-longevity-training-2026-guide.html",
    "moringa-soap-skin-science-australia-2026.html",
    "musashi-protein-powder-australia-comprehensive-guide-2026.html",
    "natural-language-calendar-scheduler.html",
    "sydney-time-guide-moringa-nutrithrive-2026.html",
    "sydney-wellness-reset-2026-strategic-blueprint.html",
    "top-20-hiking-destinations-victoria-australia-ultimate-guide-2026.html",
    "universal-size-converter.html",
]

GLOBS = ["blog/*.html", "products/*/index.html", "index.html"]


def main():
    files = set()
    for g in GLOBS:
        files.update(ROOT.glob(g))
    changed = 0
    for path in sorted(files):
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            continue
        orig = text
        for old, new in REPLACEMENTS:
            text = text.replace(old, new)
        for name in BUCKET3:
            text = text.replace(f'href="{name}"', 'href="/"')
            text = text.replace(f"href='{name}'", "href='/'")
            text = text.replace(f'href="/blog/{name}"', 'href="/"')
            text = text.replace(
                f"https://nutrithrive.com.au/blog/{name}",
                "https://nutrithrive.com.au/",
            )
        if text != orig:
            path.write_text(text, encoding="utf-8")
            changed += 1
            print("updated:", path.relative_to(ROOT))
    print(f"Done. Files changed: {changed}")


if __name__ == "__main__":
    main()
