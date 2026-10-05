#!/usr/bin/env python3
"""
Remove deleted posts from JSON-LD ItemList in storefront/journal/index.html
and from the search-index.js storefront file.
"""
import re, json, os

BASE = "/Users/neervasa/Desktop/Website"

DELETED_SLUGS = [
    "can-you-drink-darjeeling-tea-every-day-2026",
    "cold-brew-darjeeling-australian-spring-2026",
    "darjeeling-black-tea-australia-first-flush-second-flush-guide-2026",
    "darjeeling-chai-latte-recipe-winter-coffee-alternative-2026",
    "darjeeling-tea-coffee-replacement-honest-assessment-2026",
    "darjeeling-tea-health-benefits-research-2026",
    "moringa-face-mask-australia-glow-ritual",
    "morning-routine-health-tips-australia-2026",
    "moringa-30-day-challenge-honest-results",
    "is-moringa-worth-it-cost-value-australia-2026",
    "moringa-energy-what-happens-week-by-week-2026",
    "natural-pre-workout-moringa-australia-2026",
    "moringa-energy-bites-kids-lunchbox-recipe-australia-2026",
    "is-moringa-legit-what-science-and-real-users-say-2026",
]

def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def write(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def slug_is_deleted(url):
    for slug in DELETED_SLUGS:
        if slug in url:
            return True
    return False

# ---- Clean JSON-LD ItemList in journal/index.html ----
INDEX = f"{BASE}/storefront/journal/index.html"
c = read(INDEX)

# Extract and modify the JSON-LD script block
def fix_jsonld(m):
    raw = m.group(1)
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return m.group(0)  # leave unchanged
    
    # Handle ItemList or BreadcrumbList with @graph
    if isinstance(data, list):
        items = data
    elif "@graph" in data:
        items = data["@graph"]
    else:
        items = [data]
    
    for item in items:
        if item.get("@type") == "ItemList" and "itemListElement" in item:
            original_count = len(item["itemListElement"])
            item["itemListElement"] = [
                el for el in item["itemListElement"]
                if not slug_is_deleted(el.get("url", ""))
            ]
            new_count = len(item["itemListElement"])
            # Renumber positions
            for i, el in enumerate(item["itemListElement"], 1):
                el["position"] = i
            print(f"  JSON-LD ItemList: {original_count} → {new_count} items")
    
    new_raw = json.dumps(data if not isinstance(data, list) else items,
                         ensure_ascii=False, separators=(',', ':'))
    return f'<script type="application/ld+json">{new_raw}</script>'

new_c = re.sub(
    r'<script type="application/ld\+json">(.*?)</script>',
    fix_jsonld,
    c,
    flags=re.DOTALL
)

if new_c != c:
    write(INDEX, new_c)
    print(f"✓ Updated JSON-LD in {INDEX}")
else:
    print("  No JSON-LD changes")

# ---- Clean storefront/js/search-index.js ----
search_js = f"{BASE}/storefront/js/search-index.js"
if os.path.exists(search_js):
    sj = read(search_js)
    changed = False
    for slug in DELETED_SLUGS:
        # Remove any object/entry containing this slug from the search index
        # Pattern: entries are separated by commas in a JSON array
        pattern = re.compile(
            r',?\s*\{[^}]*"' + re.escape(slug) + r'"[^}]*\}',
            re.DOTALL
        )
        new_sj = pattern.sub('', sj)
        if new_sj != sj:
            print(f"  search-index: removed {slug}")
            sj = new_sj
            changed = True
    if changed:
        write(search_js, sj)
        print(f"✓ Updated {search_js}")
    else:
        print("  search-index.js: no changes needed")

print("\n✓ JSON-LD and search-index cleanup done")
