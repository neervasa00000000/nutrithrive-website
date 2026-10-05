import re

filepath = "storefront/journal/grow-moringa-tree-australia/index.html"
with open(filepath, 'r') as f:
    c = f.read()

# 1. Replace "nutritional powerhouse / perfect for Australia's diverse climates / 7x vitamin C…" with climate-honest pot-vs-ground copy.
old_intro = """<p>The <strong>moringa tree</strong> (Moringa oleifera) is a nutritional powerhouse and perfect for Australian moringa growing. Native to tropical regions, it's well-suited to Australia's diverse climates. With leaves containing <strong>7x more vitamin C than oranges</strong>, <strong>3x more iron than spinach</strong>, and <strong>complete protein with all 9 essential amino acids</strong>: see our <a href="/journal/moringa-vs-spirulina-vs-matcha-comparison-australia/" >moringa vs spirulina vs matcha comparison</a>: growing your own moringa means:</p>"""
new_intro = """<p>The <strong>moringa tree</strong> (Moringa oleifera) is native to tropical regions. In Northern Australia, it thrives in the ground. In Melbourne, Sydney, or anywhere that gets frost, you will need to grow it in a pot and protect it over winter. Growing your own moringa means:</p>"""
c = c.replace(old_intro, new_intro)

# 2. Kill "💪 Nutritional Powerhouse"
c = c.replace("<h3>💪 Nutritional Powerhouse</h3>", "<h3>Nutritional Profile</h3>")

# 3. Kill "Harvesting Your Moringa Superfood"
c = c.replace("<h3>4. Harvesting Your Moringa Superfood</h3>", "<h3>4. Harvesting Leaves</h3>")

# 4. "Optimal soil" -> "Soil about 25–30°C"
# Because the em-dash was replaced by comma, it's "Optimal soil temperature:" now? No, wait.
c = re.sub(r'<strong>Optimal soil temperature:</strong> 25 to 30°C', r'<strong>Soil about 25-30°C</strong>', c)

# Save
with open(filepath, 'w') as f:
    f.write(c)

