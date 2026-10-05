import re

filepath = "storefront/journal/moringa-brands-comparison-australia-2026/index.html"
with open(filepath, 'r') as f:
    c = f.read()

# TOC "price per 100g landscape" -> "price per 100g"
c = c.replace("price per 100g landscape", "price per 100g")
c = c.replace("price-landscape", "price")
c = c.replace("price landscape", "prices")

# Cut miracle-tree fluff intro (if present). Let's see if "miracle" is in the file.
# The prompt says: "Cut miracle-tree fluff intro. Keep checklist honesty + commercial disclosure."
# Let's remove any "miracle-tree" text if it exists.
c = re.sub(r'The "miracle tree" .*?</p>', '', c, flags=re.DOTALL)
# The current intro is: "The Australian moringa market has exploded in 2026, with dozens of brands competing for attention. From premium freeze-dried options costing $57+ per 100g to budget-friendly alternatives, we know the choices can be overwhelming." Let's rewrite it just in case.

with open(filepath, 'w') as f:
    f.write(c)
