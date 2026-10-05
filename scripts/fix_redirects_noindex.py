#!/usr/bin/env python3
"""
Part 2 of the deleted-posts fix:
1. Update site/_redirects: replace moringa deleted-post 301s with 410s, update tea targets
2. Add noindex to site/blog/ copies of the 10 "noindex" pages
3. Add noindex meta to site/blog/ copies of the 13 deleted storefront/journal posts
"""
import re, os

BASE = "/Users/neervasa/Desktop/Website"

def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def write(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

# ===========================================================================
# STEP A: Update site/_redirects
# ===========================================================================
redirects_path = f"{BASE}/site/_redirects"
r = read(redirects_path)

# The user's desired rules (override existing moringa 301→410 and tea targets).
# Netlify uses first-match wins, so we prepend the new rules before the existing ones.

NEW_RULES = """
# === Deleted posts: correct redirects (Oct 2026 crawl fix) ===
# Tea posts → closest live post (301)
/blog/can-you-drink-darjeeling-tea-every-day-2026  /blog/how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026  301!
/blog/darjeeling-tea-coffee-replacement-honest-assessment-2026  /blog/how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026  301!
/blog/cold-brew-darjeeling-australian-spring-2026  /blog/how-to-brew-darjeeling-tea-perfectly-2026  301!
/blog/darjeeling-chai-latte-recipe-winter-coffee-alternative-2026  /blog/how-to-brew-darjeeling-tea-perfectly-2026  301!
/blog/darjeeling-black-tea-australia-first-flush-second-flush-guide-2026  /blog/darjeeling-black-tea-australia-guide  301!
/blog/darjeeling-tea-health-benefits-research-2026  /blog/darjeeling-black-tea-australia-guide  301!
# Soap
/blog/moringa-face-mask-australia-glow-ritual  /blog/handmade-soap-australia-melt-and-pour-guide  301!
# Misc 301
/blog/morning-routine-health-tips-australia-2026  /blog/how-to-add-moringa-to-diet  301!
# Moringa retired posts: redirect relevant guides; use 410 for removed topics
/blog/moringa-30-day-challenge-honest-results  /404.html  410!
/blog/moringa-30-day-challenge-honest-results.html  /404.html  410!
/blog/is-moringa-worth-it-cost-value-australia-2026  /blog/why-premium-moringa-costs-11-not-25-value-vs-markup-2026  301!
/blog/is-moringa-worth-it-cost-value-australia-2026.html  /blog/why-premium-moringa-costs-11-not-25-value-vs-markup-2026  301!
/blog/moringa-energy-what-happens-week-by-week-2026  /404.html  410!
/blog/moringa-energy-what-happens-week-by-week-2026.html  /404.html  410!
/blog/natural-pre-workout-moringa-australia-2026  /404.html  410!
/blog/natural-pre-workout-moringa-australia-2026.html  /404.html  410!
/blog/moringa-energy-bites-kids-lunchbox-recipe-australia-2026  /404.html  410!
/blog/moringa-energy-bites-kids-lunchbox-recipe-australia-2026.html  /404.html  410!
/blog/is-moringa-legit-what-science-and-real-users-say-2026  /404.html  410!
/blog/is-moringa-legit-what-science-and-real-users-say-2026.html  /404.html  410!
"""

# Prepend new rules after the very first line (which is usually a comment or blank)
lines = r.split("\n")
# Find first blank line or after first comment block to insert
insert_after = 0
for i, line in enumerate(lines):
    if line.strip() == "" and i > 0:
        insert_after = i
        break

lines_before = lines[:insert_after]
lines_after = lines[insert_after:]
new_content = "\n".join(lines_before) + "\n" + NEW_RULES + "\n".join(lines_after)
write(redirects_path, new_content)
print(f"✓ Updated {redirects_path}")

# ===========================================================================
# STEP B: Add noindex to site/blog/ copies of the 10 "noindex" pages
# ===========================================================================
NOINDEX_SLUGS = [
    "moringa-vs-spirulina-vs-matcha-comparison-australia",
    "ag1-alternative-australia-moringa-comparison-2026",
    "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025",  # "CW greens" page
    "moringa-for-men-testosterone-energy-prostate-2026",
    "is-moringa-safe-for-children-kids-dosage-2026",
    "is-moringa-safe-for-dogs-benefits-dosage-australia-2026",
    "longevity-foods-australia-what-to-eat-live-longer-2026",
    "chronic-fatigue-what-actually-fixed-it-2026",
    "cant-lose-weight-broken-gut-what-actually-worked-2026",
    "moringa-avocado-toast-recipe-anti-inflammatory-breakfast-2026",
]

for slug in NOINDEX_SLUGS:
    fpath = f"{BASE}/site/blog/{slug}.html"
    if not os.path.exists(fpath):
        print(f"  SKIP (no site/blog copy): {slug}")
        continue
    c = read(fpath)
    # Replace 'content="index, follow"' with 'content="noindex, follow"'
    new_c = re.sub(
        r'(<meta name="robots" content=")index,\s*follow(")',
        r'\1noindex, follow\2',
        c
    )
    if new_c == c:
        # Check if noindex already present
        if "noindex" in c:
            print(f"  Already noindex: {slug}")
        else:
            # Insert noindex meta after <meta charset> line
            new_c = re.sub(
                r'(<meta charset="utf-8">)',
                r'\1\n  <meta name="robots" content="noindex, follow">',
                c
            )
            if new_c != c:
                write(fpath, new_c)
                print(f"  + Inserted noindex: {slug}")
            else:
                print(f"  WARN – could not insert noindex: {slug}")
    else:
        write(fpath, new_c)
        print(f"  ✓ noindex set: {slug}")

# Also the "chemist warehouse" page has a different filename check
cw_alt = f"{BASE}/site/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025.html"
if os.path.exists(cw_alt):
    c = read(cw_alt)
    if "noindex" not in c:
        new_c = re.sub(
            r'(<meta name="robots" content=")index,\s*follow(")',
            r'\1noindex, follow\2', c)
        if new_c != c:
            write(cw_alt, new_c)
            print("  ✓ noindex set: moringa-chemist-warehouse")

print("\n✓ Steps A & B done")
