filepath = "storefront/journal/moringa-brands-comparison-australia-2026/index.html"
with open(filepath, 'r') as f:
    c = f.read()

old_text = """<em>Moringa oleifera</em> (often called the &quot;miracle tree&quot; or simply <strong>the moringa tree</strong>)"""
new_text = """<em>Moringa oleifera</em> (the moringa tree)"""
c = c.replace(old_text, new_text)

with open(filepath, 'w') as f:
    f.write(c)
