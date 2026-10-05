#!/usr/bin/env python3
"""
Oct 2026 compliance + SEO fixes:
1. noindex moringa-powder PDP in storefront/journal + site/blog
2. Remove "Moringa powder" nav item sitewide (storefront only — 158 HTML files)
3. Remove "Moringa powder" footer link sitewide (storefront)
4. Update /products/ page (site/products/index.html): title + remove powder cards
5. Update /shop/ page (storefront/shop/index.html): title + remove powder cards
6. CW blog: update title + noindex in site/blog copy
7. Heavy metals blog: new title, new description, remove moringa-powder CTAs (both copies)
8. Rosabella blog: new title, H1, description; swap powder CTAs → soap CTA (both copies)
"""

import re
import os
import glob

BASE = "/Users/neervasa/Desktop/Website"

def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def write(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def sub(c, pattern, repl, flags=re.DOTALL, label=""):
    new = re.sub(pattern, repl, c, flags=flags)
    if new != c and label:
        print(f"  ✓ {label}")
    elif new == c and label:
        print(f"  – no match: {label}")
    return new

# ============================================================
# 1. noindex moringa-powder PDP
# ============================================================
print("\n[1] noindex moringa-powder PDP")
pdp_paths = [
    f"{BASE}/storefront/products/moringa-powder/index.html",
    f"{BASE}/site/products/moringa-powder/index.html",
]
for p in pdp_paths:
    if not os.path.exists(p):
        print(f"  SKIP: {p}")
        continue
    c = read(p)
    # If already noindex, skip
    if "noindex" in c:
        print(f"  Already noindex: {p}")
        continue
    # Add noindex
    new_c = re.sub(
        r'<meta name="robots" content="[^"]*">',
        '<meta name="robots" content="noindex, nofollow">',
        c
    )
    if new_c == c:
        # Insert after charset
        new_c = re.sub(
            r'(<meta charset="utf-8">)',
            r'\1\n  <meta name="robots" content="noindex, nofollow">',
            c
        )
    if new_c != c:
        write(p, new_c)
        print(f"  ✓ noindex added: {os.path.relpath(p, BASE)}")
    else:
        print(f"  WARN: could not insert noindex in {p}")

# Also add X-Robots-Tag noindex via netlify.toml header
toml_path = f"{BASE}/netlify.toml"
toml = read(toml_path)
NOINDEX_HEADER = """
[[headers]]
  for = "/products/moringa-powder/*"
  [headers.values]
    X-Robots-Tag = "noindex, nofollow"
"""
if "moringa-powder/*" not in toml:
    # Insert before the first [[headers]] block
    toml = toml.replace("[[headers]]", NOINDEX_HEADER + "\n[[headers]]", 1)
    write(toml_path, toml)
    print("  ✓ netlify.toml: X-Robots-Tag noindex for /products/moringa-powder/*")
else:
    print("  Already in netlify.toml")

# ============================================================
# 2 & 3. Remove "Moringa powder" from nav + footer in storefront sitewide
# ============================================================
print("\n[2+3] Remove 'Moringa powder' from nav + footer sitewide")

NAV_ITEM = r'<li><a href="/products/moringa-powder/">Moringa powder</a></li>'
NAV_ITEM_CURRENT = r'<li><a href="/products/moringa-powder/" aria-current="page">Moringa powder</a></li>'

# Also the /shop/ storefront version uses a slightly different pattern - match all variants
NAV_PATTERN = r'<li><a href="/products/moringa-powder/"[^>]*>Moringa powder</a></li>'
# Footer also links there
FOOTER_PATTERN = r'<li><a href="/products/moringa-powder/">Moringa powder</a></li>'

# Find all storefront HTML files
storefront_html = glob.glob(f"{BASE}/storefront/**/*.html", recursive=True)
site_html = glob.glob(f"{BASE}/site/**/*.html", recursive=True)
all_html = storefront_html + site_html

nav_changed = 0
footer_changed = 0

for fpath in all_html:
    # Skip the moringa-powder PDP itself (keep it, just noindex it)
    if "moringa-powder" in fpath and "index.html" in fpath:
        continue
    c = read(fpath)
    if "/products/moringa-powder/" not in c:
        continue
    new_c = c

    # Remove nav items (both desktop and mobile navs are the same pattern)
    new_c = re.sub(NAV_PATTERN, '', new_c)

    # Remove footer link
    new_c = re.sub(FOOTER_PATTERN, '', new_c)

    # Remove "Shop moringa powder" CTA buttons and links that are sitewide CTAs
    # (only in nav/footer-style contexts; don't touch article bodies here)

    if new_c != c:
        write(fpath, new_c)
        nav_changed += 1

print(f"  ✓ Nav/footer 'Moringa powder' removed from {nav_changed} files")

# ============================================================
# 4. /products/ page (site/products/index.html) — title + remove powder cards
# ============================================================
print("\n[4] /products/ page update")
PRODUCTS_INDEX = f"{BASE}/site/products/index.html"
c = read(PRODUCTS_INDEX)

# New title
c = sub(c,
    r'<title>Moringa Powder, Curry Leaves, Darjeeling Tea &amp; Moringa Soap \| NutriThrive</title>',
    '<title>Curry Leaves, Darjeeling Tea, Soap &amp; Gift Boxes | NutriThrive</title>',
    label="title updated")

# Update meta description
c = sub(c,
    r'<meta name="description" content="[^"]*">',
    '<meta name="description" content="Shop NutriThrive: dried curry leaves, Darjeeling black tea, moringa lavender soap, and gift boxes. Packed in Truganina, Melbourne. Free AU shipping at $79.">',
    label="meta description updated")

# Update OG/twitter titles
c = sub(c,
    r'(<meta property="og:title" content=")[^"]*(")',
    r'\1Curry Leaves, Darjeeling Tea, Soap & Gift Boxes | NutriThrive\2',
    label="og:title updated")
c = sub(c,
    r'(<meta name="twitter:title" content=")[^"]*(")',
    r'\1Curry Leaves, Darjeeling Tea, Soap & Gift Boxes | NutriThrive\2',
    label="twitter:title updated")

# Remove moringa powder product cards from the product grid
# Cards are <article class="product-card"> ... </article> — need to match full blocks
# The grid runs as a dense inline block; remove all 3 moringa powder cards
# Strategy: remove article blocks containing href="/products/moringa-powder/
c = sub(c,
    r'<article class="product-card">[\s\S]*?moringa-powder[\s\S]*?</article>',
    '',
    label="powder product cards removed (may need multiple passes)")
# Run again in case there are multiple
c = re.sub(
    r'<article class="product-card">[\s\S]*?moringa-powder[\s\S]*?</article>',
    '', c)

# Update JSON-LD ItemList to remove moringa powder entries
import json
def fix_jsonld_remove_powder(m):
    raw = m.group(1)
    try:
        data = json.loads(raw)
    except:
        return m.group(0)
    def remove_powder(obj):
        if isinstance(obj, dict):
            if "itemListElement" in obj:
                orig = len(obj["itemListElement"])
                obj["itemListElement"] = [
                    el for el in obj["itemListElement"]
                    if "moringa-powder" not in el.get("url", "")
                ]
                new_len = len(obj["itemListElement"])
                if "numberOfItems" in obj:
                    obj["numberOfItems"] = new_len
                for i, el in enumerate(obj["itemListElement"], 1):
                    el["position"] = i
                if new_len != orig:
                    print(f"  ✓ JSON-LD: {orig}→{new_len} items")
            for v in obj.values():
                remove_powder(v)
        elif isinstance(obj, list):
            for item in obj:
                remove_powder(item)
    remove_powder(data)
    return f'<script type="application/ld+json">{json.dumps(data, ensure_ascii=False, separators=(",",":"))}</script>'

c = re.sub(
    r'<script type="application/ld\+json">(.*?)</script>',
    fix_jsonld_remove_powder, c, flags=re.DOTALL)

write(PRODUCTS_INDEX, c)
print(f"  ✓ Written: site/products/index.html")

# ============================================================
# 5. /shop/ page (storefront/shop/index.html) — same treatment
# ============================================================
print("\n[5] /shop/ page update")
SHOP_INDEX = f"{BASE}/storefront/shop/index.html"
c = read(SHOP_INDEX)

c = sub(c,
    r'<title>[^<]*</title>',
    '<title>Curry Leaves, Darjeeling Tea, Soap &amp; Gift Boxes | NutriThrive</title>',
    label="title updated")

c = sub(c,
    r'<meta name="description" content="[^"]*">',
    '<meta name="description" content="Shop NutriThrive: dried curry leaves, Darjeeling black tea, moringa lavender soap, and gift boxes. Packed in Truganina, Melbourne. Free AU shipping at $79.">',
    label="meta description updated")

# Remove moringa powder articles from product grid
c = re.sub(
    r'<article class="product-card">[\s\S]*?moringa-powder[\s\S]*?</article>',
    '', c)
# Run again for second pass
c = re.sub(
    r'<article class="product-card">[\s\S]*?moringa-powder[\s\S]*?</article>',
    '', c)
print("  ✓ Powder cards removed from /shop/")

# Fix JSON-LD
c = re.sub(
    r'<script type="application/ld\+json">(.*?)</script>',
    fix_jsonld_remove_powder, c, flags=re.DOTALL)

write(SHOP_INDEX, c)
print(f"  ✓ Written: storefront/shop/index.html")

# ============================================================
# 6. CW blog — update title + noindex site/blog copy
# ============================================================
print("\n[6] CW blog updates")
CW_STOREFRONT = f"{BASE}/storefront/journal/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025/index.html"
CW_SITE = f"{BASE}/site/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025.html"

NEW_CW_TITLE = "Chemist Warehouse Moringa: Powder vs Capsules vs Tablets"

for fpath in [CW_STOREFRONT, CW_SITE]:
    if not os.path.exists(fpath):
        print(f"  SKIP: {fpath}")
        continue
    c = read(fpath)
    # Update title
    c = sub(c,
        r'<title>[^<]*</title>',
        f'<title>{NEW_CW_TITLE}</title>',
        label=f"title: {os.path.basename(os.path.dirname(fpath))}")
    c = sub(c,
        r'(<meta property="og:title" content=")[^"]*(")',
        r'\g<1>' + NEW_CW_TITLE + r'\2',
        label="og:title")
    c = sub(c,
        r'(<meta name="twitter:title" content=")[^"]*(")',
        r'\g<1>' + NEW_CW_TITLE + r'\2',
        label="twitter:title")
    # Update H1 if it contains old title
    c = sub(c,
        r'(<h1[^>]*>)Chemist Warehouse Moringa[^<]*(</h1>)',
        r'\g<1>' + NEW_CW_TITLE + r'\2',
        label="H1")
    # noindex on site/blog copy
    if "site/blog" in fpath:
        c = sub(c,
            r'<meta name="robots" content="[^"]*">',
            '<meta name="robots" content="noindex, follow">',
            label="noindex site/blog")
    write(fpath, c)

# ============================================================
# 7. Heavy metals blog — title, description, remove powder CTAs
# ============================================================
print("\n[7] Heavy metals blog")
HM_STOREFRONT = f"{BASE}/storefront/journal/moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026/index.html"
HM_SITE = f"{BASE}/site/blog/moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026.html"

NEW_HM_TITLE = "Moringa Heavy Metals Testing: What a CoA Should Show"
NEW_HM_DESC = "How to read a moringa certificate of analysis (CoA) for heavy metals, microbes and pesticides. What to check before you buy any brand."

for fpath in [HM_STOREFRONT, HM_SITE]:
    if not os.path.exists(fpath):
        print(f"  SKIP: {fpath}")
        continue
    c = read(fpath)
    c = sub(c, r'<title>[^<]*</title>', f'<title>{NEW_HM_TITLE}</title>', label="title")
    c = sub(c, r'(<meta name="description" content=")[^"]*(")', r'\g<1>' + NEW_HM_DESC + r'\2', label="meta desc")
    c = sub(c, r'(<meta property="og:title" content=")[^"]*(")', r'\g<1>' + NEW_HM_TITLE + r'\2', label="og:title")
    c = sub(c, r'(<meta name="twitter:title" content=")[^"]*(")', r'\g<1>' + NEW_HM_TITLE + r'\2', label="twitter:title")
    c = sub(c, r'(<meta property="og:description" content=")[^"]*(")', r'\g<1>' + NEW_HM_DESC + r'\2', label="og:desc")
    c = sub(c, r'(<meta name="twitter:description" content=")[^"]*(")', r'\g<1>' + NEW_HM_DESC + r'\2', label="twitter:desc")
    # Update H1 if present
    c = sub(c, r'<h1>Moringa Heavy Metals[^<]*</h1>', f'<h1>{NEW_HM_TITLE}</h1>', label="H1")

    # Remove powder CTAs — all of these:
    # 1. Lede paragraph CTA: "then the powder we sell..."
    c = sub(c,
        r', then the powder we sell: 100g \$11, 200g \$21\.50, 400g \$35\. Free AU shipping at \$79: <a href="/products/moringa-powder/">[^<]+</a>',
        '.',
        label="lede powder CTA")
    # 2. Early CTA button block (article_early_product_click)
    c = sub(c,
        r'<a href="/products/moringa-powder/"[^>]*data-funnel-event="article_early_product_click"[^>]*>[^<]+</a>',
        '<a href="/products/moringa-soap/">Shop moringa soap</a>',
        label="early CTA → soap")
    # 3. "Shop our 100% pure moringa powder" paragraph + btn-row
    c = sub(c,
        r'<p>Shop our <a href="/products/moringa-powder/">[^<]+</a>[^<]*</p>\s*<div class="btn-row">\s*<a class="btn-solid" href="/products/moringa-powder/">[^<]+</a>\s*<a class="btn-outline" href="/shipping/">[^<]+</a>\s*</div>',
        '<p>See our <a href="/products/moringa-soap/">moringa lavender soap</a> or <a href="/products/curry-leaves/">dried curry leaves</a> from NutriThrive.</p>',
        label="bottom prose + btn-row → soap/curry")
    # 4. "Shop moringa powder" li in related section
    c = sub(c,
        r'<li><a href="/products/moringa-powder/"[^>]*>Shop[^<]*moringa powder[^<]*</a></li>',
        '<li><a href="/products/moringa-soap/">Shop moringa soap</a></li>',
        label="related li → soap")
    # 5. Sidebar/bottom btn btn-primary
    c = sub(c,
        r'<a class="btn btn-primary" href="/products/moringa-powder/"[^>]*>Shop moringa powder</a>',
        '<a class="btn btn-primary" href="/products/moringa-soap/">Shop moringa soap</a>',
        label="btn-primary → soap")
    # noindex on site/blog
    if "site/blog" in fpath:
        c = sub(c,
            r'<meta name="robots" content="[^"]*">',
            '<meta name="robots" content="noindex, follow">',
            label="noindex site/blog")
    write(fpath, c)

# ============================================================
# 8. Rosabella blog — title, H1, description; swap powder CTAs → soap
# ============================================================
print("\n[8] Rosabella blog")
ROSA_STOREFRONT = f"{BASE}/storefront/journal/rosabella-moringa-reviews-legit-or-overhyped-2026/index.html"
ROSA_SITE = f"{BASE}/site/blog/rosabella-moringa-reviews-legit-or-overhyped-2026.html"

NEW_ROSA_TITLE = "Rosabella Moringa Reviews Australia: Legit or Hype?"
NEW_ROSA_DESC = "An Australian look at Rosabella moringa: what the reviews say, what the recall was about, and what to check on any moringa product before buying."
NEW_ROSA_H1 = "Rosabella Moringa Reviews Australia: Legit or Hype?"
NEW_ROSA_LEDE = "An Australian look at Rosabella moringa. We do not sell Rosabella and we do not sell capsules. If you want a non-food moringa product from NutriThrive, see our <a href=\"/products/moringa-soap/\">moringa lavender soap</a>."

for fpath in [ROSA_STOREFRONT, ROSA_SITE]:
    if not os.path.exists(fpath):
        print(f"  SKIP: {fpath}")
        continue
    c = read(fpath)
    c = sub(c, r'<title>[^<]*</title>', f'<title>{NEW_ROSA_TITLE}</title>', label="title")
    c = sub(c, r'(<meta name="description" content=")[^"]*(")', r'\g<1>' + NEW_ROSA_DESC + r'\2', label="meta desc")
    c = sub(c, r'(<meta property="og:title" content=")[^"]*(")', r'\g<1>' + NEW_ROSA_TITLE + r'\2', label="og:title")
    c = sub(c, r'(<meta name="twitter:title" content=")[^"]*(")', r'\g<1>' + NEW_ROSA_TITLE + r'\2', label="twitter:title")
    c = sub(c, r'(<meta property="og:description" content=")[^"]*(")', r'\g<1>' + NEW_ROSA_DESC + r'\2', label="og:desc")
    c = sub(c, r'(<meta name="twitter:description" content=")[^"]*(")', r'\g<1>' + NEW_ROSA_DESC + r'\2', label="twitter:desc")

    # H1
    c = sub(c,
        r'<h1>Rosabella Moringa Reviews Australia 2026 — We Sell Powder, Not Rosabella</h1>',
        f'<h1>{NEW_ROSA_H1}</h1>',
        label="H1")
    # Lede paragraph (replace the powder pitch)
    c = sub(c,
        r'<p class="lede">An Australian look at Rosabella moringa\. We do not sell Rosabella and we do not sell capsules\. If you want single-ingredient leaf powder instead,[^<]*<a href="/products/moringa-powder/">[^<]+</a></p>',
        f'<p class="lede">{NEW_ROSA_LEDE}</p>',
        label="lede → soap")
    # Early CTA button
    c = sub(c,
        r'<a href="/products/moringa-powder/"[^>]*data-funnel-event="article_early_product_click"[^>]*>[^<]+</a>',
        '<a href="/products/moringa-soap/">Shop moringa soap</a>',
        label="early CTA → soap")
    # Middle btn-row: "Shop NutriThrive Moringa Powder →"
    c = sub(c,
        r'<div class="btn-row"[^>]*>\s*<a class="btn-solid" href="/products/moringa-powder/[^"]*">[^<]+</a>\s*</div>',
        '<div class="btn-row"><a class="btn-solid" href="/products/moringa-soap/">Shop moringa soap →</a></div>',
        label="mid btn-row → soap")
    # "see NutriThrive's moringa powder" inline link
    c = sub(c,
        r'<a href="/products/moringa-powder/">[^<]*moringa powder[^<]*</a>',
        '<a href="/products/moringa-soap/">moringa lavender soap</a>',
        label="inline powder links → soap (multi)")
    # "The straightforward option: NutriThrive Moringa Powder" paragraph
    c = sub(c,
        r'<p><strong>The straightforward option:</strong>[^<]*<a href="/products/moringa-powder/">[^<]+</a>[^<]*</p>',
        '<p>From NutriThrive: <a href="/products/moringa-soap/">moringa lavender soap</a> or <a href="/products/gift-pack/">gift pack</a>.</p>',
        label="straightforward paragraph → soap")
    # "Shop moringa powder" bottom CTA
    c = sub(c,
        r'<a href="/products/moringa-powder/"[^>]*>\s*Shop moringa powder\s*</a>',
        '<a href="/products/moringa-soap/">Shop moringa soap</a>',
        label="bottom CTA → soap")
    # "Shop NutriThrive moringa powder" li
    c = sub(c,
        r'<li><a href="/products/moringa-powder/"[^>]*>Shop NutriThrive moringa powder[^<]*</a></li>',
        '<li><a href="/products/moringa-soap/">Shop moringa soap</a></li>',
        label="related li → soap")
    # Bottom shop paragraph + btn-row
    c = sub(c,
        r'<p>Shop our <a href="/products/moringa-powder/">[^<]+</a>[^<]*</p>\s*<div class="btn-row">\s*<a class="btn-solid" href="/products/moringa-powder/">[^<]+</a>',
        '<p>From NutriThrive: <a href="/products/moringa-soap/">moringa lavender soap</a>.</p>\n<div class="btn-row">\n<a class="btn-solid" href="/products/moringa-soap/">Shop moringa soap</a>',
        label="footer prose+btn → soap")
    # noindex on site/blog
    if "site/blog" in fpath:
        c = sub(c,
            r'<meta name="robots" content="[^"]*">',
            '<meta name="robots" content="noindex, follow">',
            label="noindex site/blog")
    write(fpath, c)

print("\n✓ All done")
