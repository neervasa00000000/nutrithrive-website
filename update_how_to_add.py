import re

with open('site/blog/how-to-add-moringa-to-diet.html', 'r') as f:
    html = f.read()

# ADD A: BLUF (top, after H1)
bluf = """
<p class="lede">How to add moringa powder to your diet in Australia: start ½ tsp in food you already eat, build to 1 tsp once taste is fine, buy weighable single-ingredient powder (from $11/100g), and clear free AU shipping at $79 with powder + curry leaves + Darjeeling tea when ready. <a href="/products/moringa-powder/">Shop moringa powder</a> for live sizes.</p>
"""
# Replace the existing lede
html = re.sub(r'<p class="lede">.*?</p>', bluf, html, flags=re.DOTALL)

# Add B, C, D, E
new_sections = """
<h2 id="daily-use-table">Daily use table</h2>
<div class="table-scroll">
<table>
<thead>
<tr><th>When</th><th>Amount</th><th>How</th></tr>
</thead>
<tbody>
<tr><td>Morning</td><td>½–1 tsp</td><td>Smoothie, yoghurt, oats</td></tr>
<tr><td>Lunch</td><td>½ tsp</td><td>Soup, dal, eggs, avocado toast</td></tr>
<tr><td>Pre-train</td><td>½–1 tsp</td><td>Shake (see <a href="/blog/moringa-before-after-workout-timing-guide-2026">workout timing</a>)</td></tr>
</tbody>
</table>
</div>
<p>Max practical: say 1–2 tsp/day unless label differs — no disease dosing.</p>

<h2 id="five-food-vehicles">5 food vehicles</h2>
<p><strong>Smoothie:</strong> The most reliable way to hide the grassy flavour. Start with ½ tsp blended into banana, oat milk, or berries. <a href="/blog/moringa-smoothie-recipes-australia-2026">Moringa smoothie recipes</a>.</p>
<p><strong>Breakfast toast:</strong> Best for savoury breakfasts. Mash ½ tsp into avocado with salt, pepper, and lemon juice. <a href="/blog/moringa-avocado-toast-recipe-anti-inflammatory-breakfast-2026">Moringa avocado toast recipe</a>.</p>
<p><strong>Tea:</strong> If you prefer a hot drink, whisk ½ tsp into hot (not boiling) water. Add honey and lemon to cut the bitterness. <a href="/blog/how-to-make-moringa-tea-recipes-2026">How to make moringa tea</a>.</p>
<p><strong>Wellness shot:</strong> For a quick morning hit without a full meal. Shake ½ tsp with water and lemon juice, then down it quickly. <a href="/blog/moringa-wellness-shot-recipe-winter-2026">Moringa wellness shot recipe</a>.</p>
<p><strong>High-protein meals:</strong> Stir ½ tsp into a protein shake, eggs, or dal. It adds greens without replacing your protein math. <a href="/blog/high-protein-moringa-recipes-australia-2026">High-protein moringa recipes</a>.</p>

<h2 id="taste-and-mistakes">Taste and common mistakes</h2>
<p>Taste honesty: earthy and grassy. See the <a href="/blog/what-does-moringa-powder-taste-like-honest-guide-2026">taste guide</a> for realistic expectations.</p>
<p><strong>Common mistakes:</strong> dumping it into plain water only (hardest on taste); starting at 1 tablespoon (stomach upset); buying capsules when you wanted powder for food mixing; skipping fat or acid (like lemon or yoghurt) to balance the flavour.</p>
<p>For buying checks, see <a href="/blog/how-to-choose-moringa-powder-australia-2026">how to choose moringa powder in Australia</a>.</p>

<h2 id="checkout-maths">Checkout maths</h2>
<p>Free AU shipping starts at $79. Powder sizes range from $11/100g, $21.50/200g, to $35/400g.</p>
<p>A common clear path: 400g powder ($35) + dried curry leaves + Darjeeling black tea to clear shipping. Or start with 100g to test the taste, then add curry and tea later.</p>
<p><a class="btn-solid" href="/products/moringa-powder/">Shop moringa powder</a></p>
"""

# Replace the inner body (everything between <div class="answer-box"> and <h2 id="faq">FAQ</h2>)
html = re.sub(r'<div class="answer-box">.*?<h2 id="faq">FAQ</h2>', '<div class="prose">\n' + new_sections + '\n<h2 id="faq">FAQ</h2>', html, flags=re.DOTALL)

# Add F: FAQ append (Q: How much moringa powder per day to start?, Powder, capsules, or tea first?, How do I hit $79 free shipping without wasting powder?)
faq_append = """
<h3>How much moringa powder per day to start?</h3>
<p>Most people start at ½ tsp in food once daily, then 1 tsp if taste is fine. <a href="/products/moringa-powder/">Shop moringa powder</a> for pack sizes.</p>

<h3>Powder, capsules, or tea first?</h3>
<p>This guide is for leaf powder you can weigh into food. Capsules skip the food path; tea is a different use — see the tea recipe link above. <a href="/products/moringa-powder/">Shop moringa powder</a> when you want the oral powder format.</p>

<h3>How do I hit $79 free shipping without wasting powder?</h3>
<p>Free AU shipping starts at $79. One practical basket is 400g ($35) plus curry leaves and Darjeeling tea. <a href="/products/moringa-powder/">Shop moringa powder</a> for live prices.</p>
"""
# Find the end of the FAQ section and append
html = re.sub(r'(<h3>How to take moringa powder\?</h3>.*?</div>)', r'\1' + '\n' + faq_append, html, flags=re.DOTALL)

# Add G: Closing CTA module
closing_cta = """
<div class="nt-article-cta">
<h3>NutriThrive Moringa Powder</h3>
<p><a href="/products/moringa-powder/">Shop moringa powder</a> &middot; 7-day guarantee &middot; from $11/100g &middot; Free AU shipping at $79.</p>
<div class="btn-row">
<a class="btn-solid" href="/products/moringa-powder/">Shop moringa powder</a>
</div>
</div>
"""
# Replace the existing CTA
html = re.sub(r'<div class="nt-article-cta">.*?</div>\n</div>', closing_cta + '\n</div>', html, flags=re.DOTALL)

# Normalize any Shop Moringa Powder / View powder CTAs to exact: Shop moringa powder
html = re.sub(r'>Shop Moringa Powder<', '>Shop moringa powder<', html, flags=re.IGNORECASE)
html = re.sub(r'>Buy moringa powder<', '>Shop moringa powder<', html, flags=re.IGNORECASE)
html = re.sub(r'>View powder<', '>Shop moringa powder<', html, flags=re.IGNORECASE)
html = re.sub(r'>Buy Moringa Powder<', '>Shop moringa powder<', html, flags=re.IGNORECASE)


with open('site/blog/how-to-add-moringa-to-diet.html', 'w') as f:
    f.write(html)

