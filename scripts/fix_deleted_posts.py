#!/usr/bin/env python3
"""
Fix all issues from deleted posts:
1. Remove article cards for 14 deleted posts from blog index + category pages
2. Remove / repair in-body broken links in specific pages
3. Add noindex headers to 10 specific pages via netlify.toml
"""

import re
import os

BASE = "/Users/neervasa/Desktop/Website"

# ===========================================================================
# DELETED POST SLUGS
# ===========================================================================
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

# Regex to match a complete article-card anchor tag for a deleted slug
# Cards sit on a single line, between </a> boundaries  
def make_card_pattern(slug):
    # Matches: <a class="article-card" href="/journal/SLUG/" ...>...</a>
    # The card can be preceded by </a> and we need to remove the whole <a...>...</a>
    escaped = re.escape(slug)
    return re.compile(
        r'<a\s[^>]*?href="/journal/' + escaped + r'/"[^>]*>.*?</a>',
        re.DOTALL
    )

# ===========================================================================
# HELPER
# ===========================================================================
def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def write(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def remove_cards(content, slugs):
    """Remove article-card anchors for deleted slugs."""
    for slug in slugs:
        pattern = make_card_pattern(slug)
        before = len(content)
        content = pattern.sub("", content)
        after = len(content)
        if before != after:
            print(f"  Removed card: {slug}")
    return content

# ===========================================================================
# STEP 1: Remove cards from index and category pages
# ===========================================================================
INDEX_FILES = [
    f"{BASE}/storefront/journal/index.html",
    f"{BASE}/storefront/journal/category/moringa-guides/index.html",
    f"{BASE}/storefront/journal/category/tea/index.html",
    f"{BASE}/storefront/journal/category/ways-to-use-it/index.html",
    f"{BASE}/storefront/journal/category/soap-skin/index.html",
]

for fpath in INDEX_FILES:
    if not os.path.exists(fpath):
        print(f"SKIP (not found): {fpath}")
        continue
    print(f"\n[INDEX] {fpath}")
    content = read(fpath)
    content = remove_cards(content, DELETED_SLUGS)
    write(fpath, content)

# ===========================================================================
# STEP 2: Remove / repair in-body broken links in specific pages
# ===========================================================================

def sub(content, pattern, replacement, flags=0):
    new = re.sub(pattern, replacement, content, flags=flags)
    if new != content:
        print(f"  Fixed: {pattern[:60]}...")
    return new

# ----- darjeeling-black-tea-australia-guide --------------------------------
print("\n[BODY] darjeeling-black-tea-australia-guide")
f = f"{BASE}/storefront/journal/darjeeling-black-tea-australia-guide/index.html"
c = read(f)

# In-prose link to first-flush guide (deleted) → remove the link, keep text
c = sub(c,
    r'For a deeper flush comparison aimed at Australian buyers, see our <a href="/journal/darjeeling-black-tea-australia-first-flush-second-flush-guide-2026/">[^<]+</a>\.',
    'For a deeper flush comparison, the main Darjeeling guide above covers first and second flush in full.')

# TOC li: first flush vs second flush (deleted link) → keep as plain text
c = sub(c,
    r'<li><a href="/journal/darjeeling-black-tea-australia-first-flush-second-flush-guide-2026/">First flush vs second flush</a></li>',
    '<li>First flush vs second flush (covered above)</li>')

# Related articles widget: remove "can-you-drink" entry from the 3-item list
c = sub(c,
    r'<li><a href="/journal/can-you-drink-darjeeling-tea-every-day-2026/">[^<]+</a></li>',
    '')

write(f, c)

# ----- how-to-brew-darjeeling-tea-perfectly-2026 ---------------------------
print("\n[BODY] how-to-brew-darjeeling-tea-perfectly-2026")
f = f"{BASE}/storefront/journal/how-to-brew-darjeeling-tea-perfectly-2026/index.html"
c = read(f)

# In-prose CTA line: "· First flush vs second flush guide →"
c = sub(c,
    r'\s*·\s*<a href="/journal/darjeeling-black-tea-australia-first-flush-second-flush-guide-2026/">[^<]+</a>',
    '')

# Cluster hub link + list items
c = sub(c,
    r'<li><strong>Cluster hub:</strong> <a href="/journal/darjeeling-black-tea-australia-first-flush-second-flush-guide-2026/">[^<]+</a></li>',
    '<li><strong>Cluster hub:</strong> <a href="/journal/darjeeling-black-tea-australia-guide/">Darjeeling Tea Australia Guide</a></li>')
c = sub(c,
    r'<li><a href="/journal/darjeeling-black-tea-australia-first-flush-second-flush-guide-2026/">[^<]+</a></li>',
    '')
c = sub(c,
    r'<li><a href="/journal/cold-brew-darjeeling-australian-spring-2026/">[^<]+</a></li>',
    '')
c = sub(c,
    r'<li><a href="/journal/darjeeling-tea-health-benefits-research-2026/">[^<]+</a></li>',
    '')

write(f, c)

# ----- darjeeling-tea-vs-english-breakfast-comparison-2026 -----------------
print("\n[BODY] darjeeling-tea-vs-english-breakfast-comparison-2026")
f = f"{BASE}/storefront/journal/darjeeling-tea-vs-english-breakfast-comparison-2026/index.html"
c = read(f)

c = sub(c,
    r'<li><strong>Cluster hub:</strong> <a href="/journal/darjeeling-black-tea-australia-first-flush-second-flush-guide-2026/">[^<]+</a></li>',
    '<li><strong>Cluster hub:</strong> <a href="/journal/darjeeling-black-tea-australia-guide/">Darjeeling Tea Australia Guide</a></li>')
c = sub(c,
    r'<li><a href="/journal/darjeeling-black-tea-australia-first-flush-second-flush-guide-2026/">[^<]+</a></li>',
    '')
c = sub(c,
    r'<li><a href="/journal/darjeeling-tea-health-benefits-research-2026/">[^<]+</a></li>',
    '')
# Related widget: remove "cold-brew" entry  
c = sub(c,
    r'<li><a href="/journal/cold-brew-darjeeling-australian-spring-2026/">[^<]+</a></li>',
    '')

write(f, c)

# ----- how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026 --------
print("\n[BODY] how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026")
f = f"{BASE}/storefront/journal/how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026/index.html"
c = read(f)

# In-prose: "see Darjeeling tea health benefits" → remove whole link, keep text
c = sub(c,
    r', or see <a href="/journal/darjeeling-tea-health-benefits-research-2026/">[^<]+</a> for the wider research picture',
    '')

# In-prose: flush guide link → update target to guide
c = sub(c,
    r'<a href="/journal/darjeeling-black-tea-australia-first-flush-second-flush-guide-2026/">([^<]+)</a>',
    r'<a href="/journal/darjeeling-black-tea-australia-guide/">\1</a>')

# Inline CTA: "· Darjeeling first flush vs second flush: the full guide →"
c = sub(c,
    r'\s*·\s*<a href="/journal/darjeeling-black-tea-australia-first-flush-second-flush-guide-2026/">[^<]+</a>',
    '')

# List items
c = sub(c,
    r'<li><a href="/journal/darjeeling-black-tea-australia-first-flush-second-flush-guide-2026/">[^<]+</a></li>',
    '')
c = sub(c,
    r'<li><a href="/journal/darjeeling-tea-health-benefits-research-2026/">[^<]+</a></li>',
    '')

write(f, c)

# ----- how-much-caffeine-safe-per-day-australia-fsanz-2026 -----------------
print("\n[BODY] how-much-caffeine-safe-per-day-australia-fsanz-2026")
f = f"{BASE}/storefront/journal/how-much-caffeine-safe-per-day-australia-fsanz-2026/index.html"
c = read(f)

# Related widget: remove cold-brew and can-you-drink entries
c = sub(c,
    r'<li><a href="/journal/cold-brew-darjeeling-australian-spring-2026/">[^<]+</a></li>',
    '')
c = sub(c,
    r'<li><a href="/journal/can-you-drink-darjeeling-tea-every-day-2026/">[^<]+</a></li>',
    '')

write(f, c)

# ----- moringa-soap-benefits-skin-guide ------------------------------------
print("\n[BODY] moringa-soap-benefits-skin-guide")
f = f"{BASE}/storefront/journal/moringa-soap-benefits-skin-guide/index.html"
c = read(f)

# Drop face mask li from the related list
c = sub(c,
    r'<li><a href="/journal/moringa-face-mask-australia-glow-ritual/">[^<]+</a></li>',
    '')

write(f, c)

# ----- moringa-oil-benefits-skin-hair-health-2026 --------------------------
print("\n[BODY] moringa-oil-benefits-skin-hair-health-2026")
f = f"{BASE}/storefront/journal/moringa-oil-benefits-skin-hair-health-2026/index.html"
if os.path.exists(f):
    c = read(f)
    c = sub(c,
        r'<li><a href="/journal/moringa-face-mask-australia-glow-ritual/">[^<]+</a></li>',
        '')
    write(f, c)

# ----- musashi-protein-powder page -----------------------------------------
print("\n[BODY] musashi-protein-powder-australia-comprehensive-guide-2026")
f = f"{BASE}/storefront/journal/musashi-protein-powder-australia-comprehensive-guide-2026/index.html"
c = read(f)

# Remove "is moringa legit" btn link
c = sub(c,
    r'\s*<a class="btn-outline" href="/journal/is-moringa-legit-what-science-and-real-users-say-2026/">[^<]+</a>',
    '')
# Remove surrounding &nbsp;· if now dangling
c = sub(c,
    r'\s*&nbsp;·&nbsp;\s*</p>',
    '</p>')

write(f, c)

# ----- Pages that link to moringa-30-day / is-moringa-worth / moringa-energy-what -
# Comprehensive grep across remaining affected live posts
BODY_LINK_REMOVALS = [
    ("moringa-30-day-challenge-honest-results", None),  # remove li
    ("is-moringa-worth-it-cost-value-australia-2026", None),  # remove li
    ("moringa-energy-what-happens-week-by-week-2026", None),  # remove li
    ("natural-pre-workout-moringa-australia-2026", None),  # remove li
    ("moringa-energy-bites-kids-lunchbox-recipe-australia-2026", None),  # remove li
    ("morning-routine-health-tips-australia-2026", None),  # remove li
]

# Pages that are NOT deleted but link to deleted posts
LIVE_PAGES_WITH_BODY_LINKS = [
    f"{BASE}/storefront/journal/moringa-with-vitamin-c-iron-absorption-guide-2026/index.html",
    f"{BASE}/storefront/journal/best-time-to-take-moringa-powder-morning-or-night-2026/index.html",
    f"{BASE}/storefront/journal/is-moringa-safe-for-children-kids-dosage-2026/index.html",
    f"{BASE}/storefront/journal/how-much-water-per-day-australians-honest-guide-2026/index.html",
    f"{BASE}/storefront/journal/longevity-foods-australia-what-to-eat-live-longer-2026/index.html",
    f"{BASE}/storefront/journal/moringa-for-men-testosterone-energy-prostate-2026/index.html",
    f"{BASE}/storefront/journal/moringa-vs-spirulina-vs-matcha-comparison-australia/index.html",
    f"{BASE}/storefront/journal/how-to-choose-moringa-powder-australia-2026/index.html",
    f"{BASE}/storefront/journal/cant-lose-weight-broken-gut-what-actually-worked-2026/index.html",
    f"{BASE}/storefront/journal/moringa-avocado-toast-recipe-anti-inflammatory-breakfast-2026/index.html",
    f"{BASE}/storefront/journal/is-moringa-safe-for-dogs-benefits-dosage-australia-2026/index.html",
    f"{BASE}/storefront/journal/vitamin-d-deficiency-australia-abs-sunny-country-2026/index.html",
    f"{BASE}/storefront/journal/moringa-detox-what-is-real-2026/index.html",
    f"{BASE}/storefront/journal/moringa-soap-vs-regular-soap-comparison-2026/index.html",
    f"{BASE}/storefront/journal/moringa-before-after-workout-timing-guide-2026/index.html",
    f"{BASE}/storefront/journal/how-to-read-a-soap-ingredient-label/index.html",
    f"{BASE}/storefront/journal/how-to-make-moringa-tea-recipes-2026/index.html",
    f"{BASE}/storefront/journal/best-anti-inflammatory-foods-australia-daily-guide-2026/index.html",
    f"{BASE}/storefront/journal/chronic-fatigue-what-actually-fixed-it-2026/index.html",
    f"{BASE}/storefront/journal/signs-magnesium-deficiency-australia-what-to-eat-2026/index.html",
    f"{BASE}/storefront/journal/chemist-warehouse-greens-vs-moringa-powder-2026/index.html",
]

for fpath in LIVE_PAGES_WITH_BODY_LINKS:
    if not os.path.exists(fpath):
        continue
    c = read(fpath)
    changed = False
    for slug, _ in BODY_LINK_REMOVALS:
        # Remove <li><a href="/journal/SLUG/">...</a></li>
        pattern = r'<li><a href="/journal/' + re.escape(slug) + r'/">[^<]+</a></li>'
        new_c = re.sub(pattern, '', c)
        if new_c != c:
            print(f"  [{os.path.basename(os.path.dirname(fpath))}] Removed li link: {slug}")
            c = new_c
            changed = True
        # Also remove inline <a href="..."> links (not in li) — replace with plain text
        pattern2 = r'(<a href="/journal/' + re.escape(slug) + r'/">)([^<]+)(</a>)'
        new_c = re.sub(pattern2, r'\2', c)
        if new_c != c:
            print(f"  [{os.path.basename(os.path.dirname(fpath))}] De-linked inline: {slug}")
            c = new_c
            changed = True
    # Also clear out deleted tea-related links
    for tea_slug in [
        "can-you-drink-darjeeling-tea-every-day-2026",
        "cold-brew-darjeeling-australian-spring-2026",
        "darjeeling-black-tea-australia-first-flush-second-flush-guide-2026",
        "darjeeling-chai-latte-recipe-winter-coffee-alternative-2026",
        "darjeeling-tea-coffee-replacement-honest-assessment-2026",
        "darjeeling-tea-health-benefits-research-2026",
    ]:
        pattern = r'<li><a href="/journal/' + re.escape(tea_slug) + r'/">[^<]+</a></li>'
        new_c = re.sub(pattern, '', c)
        if new_c != c:
            print(f"  [{os.path.basename(os.path.dirname(fpath))}] Removed tea li link: {tea_slug}")
            c = new_c
            changed = True
        # Update cluster-hub li links to first-flush → darjeeling guide
        pattern3 = r'(<a href="/journal/)' + re.escape(tea_slug) + r'(/")'
        if "darjeeling-black-tea-australia-first" in tea_slug:
            new_c = re.sub(pattern3, r'\1darjeeling-black-tea-australia-guide\2', c)
            if new_c != c:
                print(f"  [{os.path.basename(os.path.dirname(fpath))}] Updated first-flush link → guide")
                c = new_c
                changed = True
    if changed:
        write(fpath, c)

print("\n✓ Steps 1 & 2 done")
