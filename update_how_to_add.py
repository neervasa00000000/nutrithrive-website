import re

with open('site/blog/how-to-add-moringa-to-diet.html', 'r') as f:
    content = f.read()

# Replace the "Best everyday mixes" section to strip full recipes and add morning steps
new_everyday_mixes = """<section id="everyday-mixes">
<h2 id="best-everyday-mixes">Best everyday mixes</h2>
<p>Taste honesty first: in plain water, most people dislike it. In food, the same powder is easy. These are the mixes that stick.</p>

<h3>Morning routine steps</h3>
<ul>
<li><strong>Hydrate first:</strong> Drink water before coffee. If you want a quick hit, mix a <a href="/blog/moringa-wellness-shot-recipe-winter-2026">moringa wellness shot</a>.</li>
<li><strong>Protein breakfast:</strong> Add ½ tsp to your <a href="/blog/moringa-smoothie-recipes-australia-2026">morning smoothie</a> or stir it into your <a href="/blog/high-protein-moringa-recipes-australia-2026">protein shake</a>.</li>
<li><strong>Savoury breakfast:</strong> Whisk ½ tsp into scrambled eggs or mash it into <a href="/blog/moringa-avocado-toast-recipe-anti-inflammatory-breakfast-2026">moringa avocado toast</a>.</li>
<li><strong>Morning brew:</strong> Swap a coffee for a hot <a href="/blog/how-to-make-moringa-tea-recipes-2026">moringa tea</a> while getting morning light.</li>
</ul>
</section>"""

content = re.sub(r'<section id="everyday-mixes">.*?</section>', new_everyday_mixes, content, flags=re.DOTALL)

# Update the Related guides in the hub-links
new_hub_links = """<div class="hub-links">
<h3>Related guides</h3>
<ul>
<li><a href="/blog/moringa-smoothie-recipes-australia-2026">Moringa smoothie recipes</a></li>
<li><a href="/blog/moringa-avocado-toast-recipe-anti-inflammatory-breakfast-2026">Moringa avocado toast recipe</a></li>
<li><a href="/blog/how-to-make-moringa-tea-recipes-2026">How to make moringa tea</a></li>
<li><a href="/blog/moringa-wellness-shot-recipe-winter-2026">Moringa wellness shot recipe</a></li>
<li><a href="/blog/high-protein-moringa-recipes-australia-2026">High-protein moringa recipes</a></li>
<li><a href="/blog/how-to-choose-moringa-powder-australia-2026">How to choose moringa powder in Australia</a></li>
<li><a href="/blog/what-does-moringa-powder-taste-like-honest-guide-2026">What does moringa powder taste like?</a></li>
<li><a href="/products/moringa-powder/">Shop moringa powder</a></li>
</ul>
</div>"""

content = re.sub(r'<div class="hub-links">.*?</div>', new_hub_links, content, flags=re.DOTALL)

# Update the CTA at the bottom
new_cta = """<div class="nt-article-cta">
<h3>NutriThrive Moringa Powder</h3>
<p><a href="/products/moringa-powder/">Shop moringa powder</a> &middot; from $11/100g &middot; Free AU shipping at $79.</p>
<div class="btn-row">
<a class="btn-solid" href="/products/moringa-powder/">Shop moringa powder</a>
<a class="btn-outline" href="/shipping">Shipping &amp; returns</a>
</div>
</div>"""

content = re.sub(r'<div class="nt-article-cta">.*?</div>', new_cta, content, flags=re.DOTALL)

with open('site/blog/how-to-add-moringa-to-diet.html', 'w') as f:
    f.write(content)

