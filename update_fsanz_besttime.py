import re

# Update FSANZ
with open('site/blog/how-much-caffeine-safe-per-day-australia-fsanz-2026.html', 'r') as f:
    fsanz = f.read()

# Add link to coffee canon
fsanz = fsanz.replace('</ul>\n</div>\n          \n          <section class="article-conversion"', 
                      '<li><a href="/blog/moringa-vs-coffee-melbourne-energy-hack">Moringa vs coffee: caffeine comparison</a></li>\n</ul>\n</div>\n          \n          <section class="article-conversion"')

# Add link to related guides
fsanz = fsanz.replace('<li><a href="/blog/can-you-drink-darjeeling-tea-every-day-2026">Can You Drink Darjeeling Tea Every Day?</a></li></ul>', 
                      '<li><a href="/blog/can-you-drink-darjeeling-tea-every-day-2026">Can You Drink Darjeeling Tea Every Day?</a></li><li><a href="/blog/moringa-vs-coffee-melbourne-energy-hack">Moringa vs Coffee</a></li></ul>')

# Normalise CTAs if they exist for moringa (even though it's a tea page)
fsanz = re.sub(r'>Shop Moringa Powder<', '>Shop moringa powder<', fsanz, flags=re.IGNORECASE)

with open('site/blog/how-much-caffeine-safe-per-day-australia-fsanz-2026.html', 'w') as f:
    f.write(fsanz)


# Update best-time
with open('site/blog/best-time-to-take-moringa-powder-morning-or-night-2026.html', 'r') as f:
    besttime = f.read()

old_faq = """<details>
<summary>Does moringa give you energy like coffee?</summary>
<div>
<p>No. It contains no caffeine. Any energy benefit comes from nutrient repletion over time (iron and B vitamins are the usual suspects), not an immediate stimulant effect. You won't get a jolt; you might notice less afternoon drag after a few weeks of consistent use.</p>
</div>
</details>"""

new_faq = """<details>
<summary>Does moringa give you energy like coffee?</summary>
<div>
<p>No. It contains no caffeine. For a detailed comparison of moringa vs caffeine, see <a href="/blog/moringa-vs-coffee-melbourne-energy-hack">moringa vs coffee for daily energy</a>.</p>
</div>
</details>"""

besttime = besttime.replace(old_faq, new_faq)

# Ensure Shop moringa powder CTA is exact
besttime = re.sub(r'>Shop Moringa Powder<', '>Shop moringa powder<', besttime, flags=re.IGNORECASE)

with open('site/blog/best-time-to-take-moringa-powder-morning-or-night-2026.html', 'w') as f:
    f.write(besttime)

