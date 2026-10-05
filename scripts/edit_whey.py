filepath = "storefront/journal/moringa-vs-whey-protein-comparison-2026/index.html"
with open(filepath, 'r') as f:
    c = f.read()

old_text = """<p><strong>Blending them together.</strong> Practically speaking, moringa blends seamlessly into a protein shake: a teaspoon with a scoop of vanilla or chocolate protein, banana, and milk makes a nutritionally comprehensive shake that covers both bases without requiring two separate drink habits.</p>"""
new_text = """<p><strong>Blending them together.</strong> Practically speaking, stir ½-1 tsp of moringa into your whey shake. It does not replace your protein maths, but it adds green nutrition without requiring two separate drink habits.</p>"""
c = c.replace(old_text, new_text)

with open(filepath, 'w') as f:
    f.write(c)
