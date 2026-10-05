#!/usr/bin/env python3
"""Rewrite three blog articles per 2026-10-03 buyer-intent spec."""
from pathlib import Path
import re

SITE = Path("/Users/neervasa/Desktop/Website/site/blog")
DATE_MOD = "2026-10-03"
DATE_HUMAN = "3 Oct 2026"

def patch_head(html: str, replacements: dict) -> str:
    for old, new in replacements.items():
        html = html.replace(old, new)
    html = re.sub(
        r'"dateModified":"[^"]+"',
        f'"dateModified":"{DATE_MOD}"',
        html,
        count=1,
    )
    return html

def replace_prose(html: str, start_marker: str, end_marker: str, new_prose: str) -> str:
    i = html.find(start_marker)
    j = html.find(end_marker, i)
    if i == -1 or j == -1:
        raise ValueError(f"markers not found: {start_marker!r} {end_marker!r}")
    return html[:i] + new_prose + html[j:]

# --- FILE 1 ---
f1 = (SITE / "what-does-moringa-powder-taste-like-honest-guide-2026.html").read_text(encoding="utf-8")

f1_meta = {
    '<meta name="description" content="Honest taste: earthy and a bit bitter in plain water, easier in food you already eat. To mix it yourself, NutriThrive powder is 100g $11, 200g $21.50, 400g $35.">':
    '<meta name="description" content="What does moringa powder taste like? Earthy and a touch bitter in plain water; milder in smoothies and savoury food. NutriThrive powder: 100g $11, 200g $21.50, 400g $35.">',
    '<meta property="og:description" content="Honest taste: earthy and a bit bitter in plain water, easier in food you already eat. To mix it yourself, NutriThrive powder is 100g $11, 200g $21.50, 400g $35.">':
    '<meta property="og:description" content="What does moringa powder taste like? Earthy and a touch bitter in plain water; milder in smoothies and savoury food. NutriThrive powder: 100g $11, 200g $21.50, 400g $35.">',
    '<meta name="twitter:description" content="Honest taste: earthy and a bit bitter in plain water, easier in food you already eat. To mix it yourself, NutriThrive powder is 100g $11, 200g $21.50, 400g $35.">':
    '<meta name="twitter:description" content="What does moringa powder taste like? Earthy and a touch bitter in plain water; milder in smoothies and savoury food. NutriThrive powder: 100g $11, 200g $21.50, 400g $35.">',
    '"description":"Honest taste: earthy and a bit bitter in plain water, easier in food you already eat. To mix it yourself, NutriThrive powder is 100g $11, 200g $21.50, 400g $35."':
    '"description":"What does moringa powder taste like? Earthy and a touch bitter in plain water; milder in smoothies and savoury food. NutriThrive powder: 100g $11, 200g $21.50, 400g $35."',
    '· Updated <time datetime="2026-09-24">24 Sept 2026</time>':
    f'· Updated <time datetime="{DATE_MOD}">{DATE_HUMAN}</time>',
    '<p class="lede">Honest taste: earthy and a bit bitter in plain water, easier in food you already eat. To mix it yourself, NutriThrive powder is 100g $11, 200g $21.50, 400g $35. Free AU shipping at $79: <a href="/products/moringa-powder/">nutrithrive.com.au/products/moringa-powder</a></p>':
    '<p class="lede">Moringa powder tastes earthy and a little bitter stirred into plain water, but most people find it easy to hide in food they already eat. NutriThrive powder is 100g $11, 200g $21.50, 400g $35. Free AU shipping at $79: <a href="/products/moringa-powder/">nutrithrive.com.au/products/moringa-powder</a></p>',
}
f1 = patch_head(f1, f1_meta)

f1_prose = r'''          <div class="prose">

<p>If you typed <em>what does moringa taste like</em> or <em>what does it taste like</em> into a search bar, you probably want the straight answer before you spend money on a pouch. Here it is: green, grassy, slightly bitter, closer to vegetable stock than a sweet smoothie. In water alone, that flavour is hard to miss. In a banana smoothie, yoghurt, or dal, most people barely notice it.</p>

<div class="answer-box" >
<h2  id="quick-answer">Quick Answer</h2>
<p ><strong>Taste:</strong> earthy and grassy, like warm hay and cooked split peas, with a faint peppery finish.</p>
<p ><strong>In plain water:</strong> obvious and often off-putting on the first sip.</p>
<p ><strong>In food:</strong> mango, banana, cacao, oat milk, yoghurt, soup, and eggs usually tame it.</p>
</div>

<p>New to buying leaf powder? Our <a href="/blog/how-to-choose-moringa-powder-australia-2026">guide to choosing moringa powder in Australia</a> covers colour, drying, and what to check on the label. This page stays on flavour only, not a full mixing tutorial.</p>

<h2 id="does-moringa-powder-taste-bad">Does moringa powder taste bad?</h2>

<p>Judged in a glass of water: for many people, yes. The powder is not rotten or chemical. It is a dried leaf with a strong green note, and water does not soften it.</p>

<p>Judged in food: usually fine. Frozen mango or banana covers the hay character. Peanut butter and cacao balance bitterness. Oat milk with a little honey turns it into a drinkable morning habit. Stirred through soup, pesto, or scrambled eggs, the leaf rides along without dominating.</p>

<h2 id="what-it-actually-tastes-like">What it actually tastes like</h2>

<p>Fresh, shade-dried moringa powder reads as <strong>warm hay plus split peas</strong>, greener and drier than spinach, less sweet than matcha, more savoury than a wellness latte. The smell is pleasant, like cut grass after rain. The surprise is expecting sweetness when you sip it in water.</p>

<p>Colour is a clue: bright emerald often means careful drying; dull khaki can mean age or sun exposure. Bitterness that coats the tongue for minutes may be stale or overheated powder, not “normal” moringa. Buying checks live in <a href="/blog/how-to-choose-moringa-powder-australia-2026">how to choose moringa powder</a>.</p>

<h2 id="what-makes-it-worse">What makes it worse</h2>

<p><strong>Boiling water.</strong> Heat pulls bitter notes forward. For tea, use water around 75°C; see <a href="/blog/how-to-make-moringa-tea-recipes-2026">moringa tea recipes</a>.</p>
<p><strong>Too much at once.</strong> Start with half a teaspoon, not a heaped tablespoon.</p>
<p><strong>Cow’s milk.</strong> Can taste odd or separate; oat or almond milk usually blends more cleanly.</p>
<p><strong>Water only on day one.</strong> If you want daily ideas beyond taste, <a href="/blog/how-to-add-moringa-to-diet">how to add moringa to your diet</a> is the longer guide. This page is the flavour preview.</p>

<h2 id="what-makes-it-disappear">What makes it disappear</h2>

<p><strong>Frozen mango or banana.</strong> Sweet fruit masks the hay note. Amounts for smoothies are in our <a href="/blog/moringa-smoothie-recipes-australia-2026">moringa smoothie recipes</a>.</p>
<p><strong>Cacao and peanut butter.</strong> Bitter-on-bitter can cancel in a blender.</p>
<p><strong>Oat milk latte with honey.</strong> Fat and sweetness integrate the green flavour.</p>
<p><strong>Savoury stir-through.</strong> Soup, dal, pesto, or eggs: earthiness belongs there.</p>

<h2 id="how-to-use-moringa-powder-without-the-bad-taste">How to use moringa powder without the bad taste</h2>

<p>Think leafy green, not flavoured drink mix.</p>
<ol>
<li>Start with about ½ teaspoon until you know your tolerance.</li>
<li>Blend into a smoothie before you try plain water again.</li>
<li>Stir into thick yoghurt or overnight oats.</li>
<li>Fold into savoury dishes where green notes already fit.</li>
<li>Store the pouch sealed and dry so flavour stays fresh, not cardboard.</li>
</ol>
<p>When you are ready to buy: <a href="/products/moringa-powder/">Shop moringa powder</a> (100g $11, 200g $21.50, 400g $35).</p>

<h2 id="how-to-eat-moringa-powder">How to eat moringa powder</h2>

<p>Food first, plain water second. Half to one teaspoon in a berry smoothie, Greek yoghurt with honey, or soup off the boil is a low-risk start. You dose by the teaspoon and adjust once you know how your palate reacts.</p>

<h2 id="what-to-mix-moringa-powder-with">What to mix moringa powder with</h2>

<p>Strong cover: banana or mango smoothie, chocolate protein shake, peanut butter blend, tomato soup, pesto, overnight oats.</p>
<p>Coffee: a tiny pinch in an iced coffee or coffee smoothie can work; flavour is louder than in fruit blends, so go small. For habit context (not a caffeine swap), see <a href="/blog/moringa-vs-coffee-melbourne-energy-hack">moringa vs coffee</a>.</p>

<h2 id="if-you-already-tried-it-and-hated-it">If you already tried it and hated it</h2>

<p>Try a quarter teaspoon in a mango smoothie before you bin the jar. Check whether the powder looked brownish or smelled flat. Check whether you used boiling water. Many “I hate moringa” stories are freshness or technique, not a universal verdict on the leaf.</p>

<p>Also useful: <a href="/blog/verify-moringa-quality-premium-buyers-checklist-2026">quality checklist</a> · <a href="/blog/science-shade-drying-vs-sun-drying-moringa">shade vs sun drying</a>.</p>

<h2 id="faq">FAQ</h2>

<h3>What does moringa powder taste like?</h3>
<p>Earthy, grassy, slightly bitter, faintly peppery. Like warm hay and split peas, not a sweet green juice.</p>

<h3>What does moringa taste like?</h3>
<p>Same as the powder: green leaf, mild bitterness, savoury rather than sweet. Format changes intensity, not the core flavour.</p>

<h3>Does moringa powder taste bad?</h3>
<p>In water alone, many people dislike it. In a smoothie, latte, yoghurt, or savoury food, most people tolerate or enjoy it.</p>

<h3>Is moringa powder bitter?</h3>
<p>Mild to moderate bitterness is normal. Harsh, lingering bitterness often points to old or poorly dried powder.</p>

<h3>Does moringa taste like matcha?</h3>
<p>Same broad category (green powder), but moringa is more intensely vegetal and less sweet. They are not interchangeable in recipes.</p>

<h3>Why does moringa taste awful to me?</h3>
<p>Common causes: stale powder, too much at once, boiling water, or judging it only in plain water. Fresh powder in fruit or oat milk often tastes completely different.</p>

<h3>How do I make moringa powder taste better?</h3>
<p>Blend with frozen banana or mango, mix into yoghurt with honey, stir into oat milk, or fold into pesto or soup. Start with a quarter teaspoon.</p>

<h3>How to use moringa powder without the bad taste?</h3>
<p>Treat it like a strong leafy green: small dose, blender or thick food, savoury dishes welcome. Keep the jar sealed. <a href="/products/moringa-powder/">Shop moringa powder</a> when you want to try a fresh pouch.</p>

<h3>Does moringa powder have caffeine?</h3>
<p>Moringa leaf powder is not a coffee-style caffeine drink. Introduce any new powder slowly with food. Training timing habits are in our <a href="/blog/moringa-before-after-workout-timing-guide-2026">before/after workout guide</a> (no miracle claims).</p>

<h3>How to take moringa powder?</h3>
<p>Mix ½ to 1 teaspoon into food or a smoothie once daily to start. Prefer food over plain water. For fuller mixing paths, see <a href="/blog/how-to-add-moringa-to-diet">how to add moringa to your diet</a>. Powder: <a href="/products/moringa-powder/">Shop moringa powder</a>.</p>

<p ><em>Written by Neer. NutriThrive Australia.</em></p>

<div class="nt-article-cta">
<h3>Ready to Try Moringa?</h3>
<p><a href="/products/moringa-powder/">Shop moringa powder</a>, packed fresh in Melbourne. Same-day dispatch on weekday orders before 2pm.</p>
<div class="btn-row">
<a class="btn-solid" href="/products/moringa-powder/">Shop moringa powder</a>
<a class="btn-outline" href="/shipping">Shipping &amp; returns</a>
</div>
</div>
<p ><a href="/blog/">&larr; Back to all articles</a></p>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul><li><strong>3 Oct 2026:</strong> Full taste-focused rewrite; meta and FAQ aligned to “what does moringa taste like” queries; date refreshed.</li>
<li><strong>24 Sep 2026:</strong> Title and meta revised for mix/eat queries; added how-to-use, how-to-eat, and what-to-mix body sections plus caffeine and how-to-take FAQs.</li>
<li><strong>30 Aug 2026:</strong> Title, opening answer, and internal links rewritten around “does it taste bad?” queries.</li>
<li><strong>29 Jun 2026:</strong> Article published.</li></ul>
</div>
<section class="nt-related-links-block">
 <h2 id="keep-going">Keep going</h2>
 <ul>
  <li><strong>Cluster hub:</strong> <a href="/blog/how-to-choose-moringa-powder-australia-2026">How to choose moringa powder in Australia</a></li>
  <li><a href="/blog/how-to-add-moringa-to-diet">How to add moringa to your diet (without tasting it)</a></li>
  <li><a href="/blog/how-to-make-moringa-tea-recipes-2026">How to make moringa tea</a></li>
  <li><a href="/blog/moringa-smoothie-recipes-australia-2026">Moringa smoothie recipes</a></li>
  <li><a href="/products/moringa-powder/">Shop moringa powder</a></li>
 </ul>
</section>
</div>
          
'''

f1 = replace_prose(f1, '          <div class="prose">', '          <section class="article-conversion"', f1_prose)

# --- FILE 2 ---
f2 = (SITE / "curry-leaves-recipes-beyond-dal.html").read_text(encoding="utf-8")
OLD_TITLE = "5 Curry Leaf Recipes Beyond Dal — Dried Leaves $7"
NEW_TITLE = "5 Curry Leaf Recipes Beyond Dal: Dried Leaves $7"
f2 = f2.replace(OLD_TITLE, NEW_TITLE)
f2 = patch_head(f2, {
    '<meta name="description" content="Five recipes that need dried curry leaves, not curry powder. The leaves are $7.">':
    '<meta name="description" content="Five curry leaf recipes beyond dal: tadka lemon rice, chutney, eggs, potatoes, and finishing oil. Use dried leaves, not curry powder. $7 pouch. Free AU shipping at $79.">',
    '<meta property="og:description" content="Five recipes that need dried curry leaves, not curry powder. The leaves are $7.">':
    '<meta property="og:description" content="Five curry leaf recipes beyond dal: tadka lemon rice, chutney, eggs, potatoes, and finishing oil. Use dried leaves, not curry powder. $7 pouch. Free AU shipping at $79.">',
    '<meta name="twitter:description" content="Five recipes that need dried curry leaves, not curry powder. The leaves are $7.">':
    '<meta name="twitter:description" content="Five curry leaf recipes beyond dal: tadka lemon rice, chutney, eggs, potatoes, and finishing oil. Use dried leaves, not curry powder. $7 pouch. Free AU shipping at $79.">',
    '"description":"Five recipes that need dried curry leaves, not curry powder. The leaves are $7."':
    '"description":"Five curry leaf recipes beyond dal: tadka lemon rice, chutney, eggs, potatoes, and finishing oil. Use dried leaves, not curry powder. $7 pouch. Free AU shipping at $79."',
    '<p class="meta-line">Curry leaves · Published <time datetime="2026-08-09">9 Aug 2026</time> · By':
    f'<p class="meta-line">Curry leaves · Published <time datetime="2026-08-09">9 Aug 2026</time> · Updated <time datetime="{DATE_MOD}">{DATE_HUMAN}</time> · By',
    '<p class="lede">Five recipes that need dried curry leaves, not curry powder. The leaves are $7. Free AU shipping at $79: <a href="/products/curry-leaves/">nutrithrive.com.au/products/curry-leaves</a></p>':
    '<p class="lede">These five dishes need dried curry leaves for tadka and aroma, not curry powder from the spice aisle. A 30g pouch is $7. Free AU shipping at $79: <a href="/products/curry-leaves/">nutrithrive.com.au/products/curry-leaves</a></p>',
})

f2_prose = r'''          <div class="prose">

<div class="nt-quick-answer" >
<h2 id="quick-answer">Quick Answer</h2>
<p>Fry dried curry leaves in hot oil for 30 to 60 seconds (tadka), then build lemon rice, a fast chutney, scrambled eggs, crispy potatoes, or a jar of finishing oil. Use about double to triple the volume you would use of fresh leaves.</p>
</div>

<p>Dal is the obvious home for curry leaves, but the same tempering trick lifts weekday cooking across the board. You are not sprinkling ground masala: whole karipatta in shimmering oil releases a citrusy, nutty aroma that curry powder cannot copy.</p>

<h2 id="the-technique">The one technique behind all five recipes</h2>
<p>Heat 1 to 2 tablespoons of oil or ghee until it shimmers. Add 8 to 12 dried curry leaves; they will crackle. Fry 30 to 60 seconds until fragrant and just crisp at the edges. That infused oil is the flavour base for every recipe below.</p>

<h2 id="lemon-rice">1. South Indian lemon rice</h2>
<p>After the leaf tadka, add mustard seeds, a dried red chilli, and a pinch of turmeric. Fold through cooked rice, lemon juice, salt, and a spoon of roasted peanuts or fried chana dal for crunch. Lunchbox-friendly and ready in under 15 minutes.</p>

<h2 id="chutney">2. Quick curry leaf chutney</h2>
<p>Soak a generous handful of dried leaves in warm water for five minutes, then blend with grated coconut, green chilli, ginger, and tamarind or lime. Temper the finished chutney with mustard seeds and extra leaves in oil. Keeps about a week refrigerated.</p>

<h2 id="tempered-eggs">3. Curry leaf tempered eggs</h2>
<p>Fry curry leaves with sliced onion in oil until the onion softens. Pour in beaten eggs and scramble. The leaves crisp at the edges and add texture as well as aroma, a simple breakfast that feels different from plain eggs.</p>

<h2 id="roasted-potatoes">4. Roasted potatoes with curry leaf oil</h2>
<p>Roast or pan-fry potatoes until golden. Meanwhile, fry extra leaves in neutral oil, strain if you like, and toss the potatoes with that oil, mustard seeds, and a pinch of chilli powder just before serving. Works beside dal, grilled fish, or a simple salad.</p>

<h2 id="finishing-oil">5. Curry leaf finishing oil (keep on hand for everything else)</h2>
<p>Fry a large handful of dried leaves in oil until crisp, cool, and store in a sealed jar in the fridge for up to two weeks. Spoon over soup, plain rice, roasted vegetables, or dal when you want instant aroma without starting a full tadka.</p>

<h2 id="dried-vs-fresh">A note on dried vs fresh</h2>
<p>Fresh bunches wilt within days and are hit-and-miss outside Indian grocers in most Australian cities. Dried leaf keeps for months, fries straight into oil for tadka, and rehydrates well for chutney. Plan on two to three times the volume of dried versus fresh for a similar hit of aroma.</p>
<p>Stocking the pantry? <a href="/products/curry-leaves/">Shop NutriThrive dried curry leaves</a> ($7 / 30g), shade-dried and packed in Melbourne. Cooking several of these in a week? The <a href="/products/combo-pack/">combo pack</a> pairs curry leaves with Darjeeling tea for $17 if you want one order that covers rice nights and afternoon cups.</p>

<h2 id="faq">FAQ</h2>
<h3>Can I use dried curry leaves without rehydrating them?</h3>
<p>Yes for tadka in hot oil. Soak only when you are blending leaves into a paste, as in chutney.</p>
<h3>How long does curry leaf oil keep?</h3>
<p>About two weeks refrigerated in a sealed jar.</p>
<h3>Do dried curry leaves taste as good as fresh?</h3>
<p>Close. Slightly softer aroma, which is why many cooks use a bit more dried leaf by volume.</p>
<h3>What can I substitute if I run out mid-recipe?</h3>
<p>There is no perfect swap. Lime zest or kaffir lime leaf can hint at the citrus note in a pinch. For a full ranked list, see our <a href="/blog/curry-leaves-substitute-what-to-use-2026">curry leaf substitute guide</a>.</p>

<p ><em>Written by Neer, Founder, NutriThrive Australia.</em></p>

<p><strong>Further reading:</strong> <a href="/blog/curry-leaves-substitute-what-to-use-2026">Curry leaf substitute: what to use</a> · <a href="/products/curry-leaves/">Shop dried curry leaves</a> · <a href="/blog/how-to-store-curry-leaves-fresh-dried-australia-2026">How to store curry leaves</a></p>

<div class="nt-article-cta">
<h3>Shop Dried Curry Leaves</h3>
<p>Shade-dried whole leaf for tadka, rice, eggs, and finishing oil. Packed in Melbourne. <a href="/products/curry-leaves/">Browse dried curry leaves</a>.</p>
<div class="btn-row">
<a class="btn-solid" href="/products/curry-leaves/">Shop Curry Leaves</a>
<a class="btn-outline" href="/shipping">Shipping &amp; returns</a>
</div>
</div>
<p ><a href="/blog/">&larr; Back to all articles</a></p>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul><li><strong>3 Oct 2026:</strong> Full recipe rewrite; title colon style; removed summary box; combo mention added; meta refreshed.</li><li><strong>09 Aug 2026:</strong> Article published.</li></ul>
</div>
<section class="nt-related-links-block">
 <h2 id="related-guides">Related guides</h2>
 <ul>
  <li><strong>Cluster hub:</strong> <a href="/blog/nutrithrive-dried-curry-leaves-tradition-health">Natural Curry Leaves Australia: NutriThrive Farm Story &amp; Premium Sourcing</a></li>
  <li><a href="/blog/curry-leaves-dahl-recipe-30-minutes-australia-2026">30-minute curry leaves dahl</a></li>
  <li><a href="/blog/fresh-vs-dried-curry-leaves-substitute-guide">Fresh vs dried curry leaves</a></li>
  <li><a href="/blog/curry-leaves-substitute-what-to-use-2026">Curry leaves substitute</a></li>
  <li><a href="/blog/how-to-store-curry-leaves-fresh-dried-australia-2026">How to store curry leaves</a></li>
  <li><a href="/products/curry-leaves/">Shop dried curry leaves</a></li>
 </ul>
</section>
</div>
          
'''

f2 = replace_prose(f2, '          <div class="prose">', '          <section class="article-conversion"', f2_prose)
# Fix related link if wrong path
f2 = f2.replace(
    'Curry Leaf Substitute Australia, 7 Swaps (+ When to Buy Dried)',
    'Curry Leaf Substitute Australia: When to Buy Dried Leaves Instead',
)

# --- FILE 3 ---
f3 = (SITE / "curry-leaves-substitute-what-to-use-2026.html").read_text(encoding="utf-8")
OLD_T3 = "Curry Leaf Substitute Australia — When to Buy Dried Leaves Instead"
NEW_T3 = "Curry Leaf Substitute Australia: When to Buy Dried Leaves Instead"
f3 = f3.replace(OLD_T3, NEW_T3)
f3 = patch_head(f3, {
    '<meta name="description" content="Seven swaps when a recipe calls for curry leaves, and when the swap is worse than buying dried leaves.">':
    '<meta name="description" content="Curry leaf substitute options in Australia: kaffir lime leaf, lemon zest, and when dried leaves beat every swap. Dried pouch $7. Free AU shipping at $79.">',
    '<meta property="og:description" content="Seven swaps when a recipe calls for curry leaves, and when the swap is worse than buying dried leaves.">':
    '<meta property="og:description" content="Curry leaf substitute options in Australia: kaffir lime leaf, lemon zest, and when dried leaves beat every swap. Dried pouch $7. Free AU shipping at $79.">',
    '<meta name="twitter:description" content="Seven swaps when a recipe calls for curry leaves, and when the swap is worse than buying dried leaves.">':
    '<meta name="twitter:description" content="Curry leaf substitute options in Australia: kaffir lime leaf, lemon zest, and when dried leaves beat every swap. Dried pouch $7. Free AU shipping at $79.">',
    '"description":"Seven swaps when a recipe calls for curry leaves, and when the swap is worse than buying dried leaves."':
    '"description":"Curry leaf substitute options in Australia: kaffir lime leaf, lemon zest, and when dried leaves beat every swap. Dried pouch $7. Free AU shipping at $79."',
    '· Updated <time datetime="2026-09-30">30 Sept 2026</time>':
    f'· Updated <time datetime="{DATE_MOD}">{DATE_HUMAN}</time>',
    '<p class="lede">Seven swaps when a recipe calls for curry leaves, and when the swap is worse than buying dried leaves. Dried curry leaves are $7. Free AU shipping at $79: <a href="/products/curry-leaves/">nutrithrive.com.au/products/curry-leaves</a></p>':
    '<p class="lede">Mid-recipe with no curry leaves? These swaps cover Australian pantries, plus when a substitute is worse than buying dried leaves for $7. Free AU shipping at $79: <a href="/products/curry-leaves/">nutrithrive.com.au/products/curry-leaves</a></p>',
    'alt="Curry Leaf Substitute Australia — 7 Swaps (+ When to Buy Dried)"':
    'alt="Curry leaf substitute Australia: when to buy dried leaves"',
})

f3_prose = r'''          <div class="prose">

<div class="answer-box">
<h2 id="best-curry-leaf-substitute-in-australia">Best curry leaf substitute in Australia (quick answer)</h2>
<p>No karipatta tonight? <strong>Dried curry leaves</strong> are the same ingredient (use about 2 to 3× fresh volume, then fry in hot oil). Among true substitutes, <strong>kaffir lime leaves</strong> are closest (about 1 lime leaf per 4 to 6 curry leaves). <strong>Lemon zest</strong> covers citrus only. Never use curry powder: it is a ground spice blend, not leaves.</p>
</div>

<p>You opened a recipe and the list says curry leaves. Your fruit bowl has no fresh bunch. This guide ranks what works in an Australian kitchen, when to stop improvising, and why a $7 dried pouch often beats another round of lime zest.</p>

<h2 id="curry-leaf-substitute-comparison">Curry leaf substitute comparison</h2>

<div class="table-scroll"><div class="table-scroll"><table class="nt-comparison-table" >
<thead><tr>
<th >Substitute</th>
<th >Swap ratio</th>
<th >Flavour match</th>
<th >Best for</th>
<th >Avoid when</th>
</tr></thead>
<tbody>
<tr><td ><strong>Kaffir lime leaves</strong></td><td >1 leaf per 4 to 6 curry leaves</td><td >High (citrus, aromatic)</td><td >South Indian tempering, Thai curries</td><td >You need earthy herbal note alone</td></tr>
<tr><td ><strong>Dried curry leaves</strong></td><td >About 2 to 3× fresh volume</td><td >Exact (same ingredient)</td><td >Any recipe calling for fresh leaves</td><td >Never: best option if you have them</td></tr>
<tr><td ><strong>Lemon or lime zest</strong></td><td >Zest of ½ lemon per 10 to 12 leaves</td><td >Partial (citrus only)</td><td >Quick weeknight dal or curry</td><td >Leaf-forward dishes (sambar, chutney)</td></tr>
<tr><td ><strong>Bay leaf</strong></td><td >1 bay leaf per 8 to 10 curry leaves</td><td >Low (minty, no citrus)</td><td >Mild lentil dishes</td><td >Sambar, rasam, coconut chutney</td></tr>
<tr><td ><strong>Fresh basil</strong></td><td >4 to 5 leaves per 10 curry leaves</td><td >Low (anise note)</td><td >Mild Thai-adjacent dishes</td><td >Traditional South Indian recipes</td></tr>
<tr><td ><strong>Fenugreek leaves (methi)</strong></td><td >1 tsp chopped per 8 to 10 leaves</td><td >Low (bitter, earthy)</td><td >North Indian dals with methi already</td><td >South Indian coconut dishes</td></tr>
<tr><td ><strong>Curry powder</strong></td><td >Never</td><td >None</td><td >Not applicable</td><td >Always: unrelated ingredient</td></tr>
</tbody>
</table></div></div>

<h2 id="what-you-re-trying-to-replace">What you&#8217;re trying to replace</h2>

<p>Curry leaves give a citrusy, slightly smoky herbal aroma when whole leaves hit hot oil. That release is hard to fake, which is why every substitute is a compromise on some dimension.</p>

<h2 id="substitutes-that-actually-work-for-curry-leaves">Substitutes that actually work for curry leaves</h2>

<p><strong>1. Kaffir lime leaves.</strong> Intense citrus aroma, used whole like curry leaves. One kaffir leaf replaces about 4 to 6 curry leaves. Find them fresh or frozen at Asian grocers.</p>

<p><strong>2. Dried curry leaves.</strong> Not a workaround: same leaf, longer shelf life. Use two to three times the volume of fresh, fry in oil at the tempering step, adjust by smell. Storage and cooking nuance: <a href="/blog/fresh-vs-dried-curry-leaves-cooking-comparison-2026">fresh vs dried curry leaves</a>.</p>

<p><strong>3. Lemon or lime zest.</strong> Captures citrus, not the earthy backbone. Zest of half a lemon per 10 to 12 leaves, added when the recipe would add leaves. Fine for a busy Tuesday, weak for signature South Indian dishes.</p>

<h2 id="substitutes-that-only-sort-of-work-in-a-pinch">Substitutes that only sort of work in a pinch</h2>

<p><strong>Bay leaves</strong> add a minty backdrop, not curry-leaf citrus. One bay leaf per 8 to 10 curry leaves in mild dal only.</p>

<p><strong>Fresh basil</strong> can hint at anise in very mild curries; wrong for sambar or rasam.</p>

<p><strong>Fenugreek leaves</strong> suit some North Indian dals where methi already belongs; do not drop them into coconut-heavy South Indian tempering.</p>

<h2 id="what-not-to-use-instead-of-curry-leaves">What not to use instead of curry leaves</h2>

<div class="warn-box">
<p ><strong>Never use curry powder as a curry leaf substitute.</strong> Curry powder is turmeric, coriander, cumin, and other ground spices. Curry leaves come from the Murraya koenigii tree. Swapping one for the other changes the dish entirely. For the naming confusion only, see <a href="/blog/curry-leaves-vs-curry-powder-difference-explained-2026">curry leaves vs curry powder</a>.</p>
</div>

<p>Also skip turmeric alone, plain ground coriander, or generic “curry spice” jars. None reproduce leaf aroma in oil.</p>

<h2 id="when-a-substitute-is-not-good-enough-buy-dried-curry-leaves">When a substitute is not good enough, buy dried curry leaves</h2>

<p>Substitutes are for one dinner. They fail when curry leaf aroma is the point of the dish.</p>

<ul>
<li><strong>Sambar, rasam, or coconut chutney:</strong> zest or bay skew the profile; dried leaves beat omitting.</li>
<li><strong>You cook this cuisine monthly or more:</strong> the substitute hunt becomes repetitive.</li>
<li><strong>Fresh bunches wilt before you use them:</strong> sealed dried leaf lasts months.</li>
<li><strong>Every swap tastes like lemon or bay:</strong> that is the signal to buy real leaves.</li>
</ul>

<p>Keep a 30g pouch in the pantry: same ingredient, ready for tadka. <a href="/products/curry-leaves/">Shop dried curry leaves</a> ($7 / 30g). Free AU shipping at $79 when you combine with tea or a gift pack.</p>

<h2 id="dried-curry-leaves-vs-fresh-pantry-reality">Dried curry leaves vs fresh, pantry reality</h2>
<p>Heat, oil, and volume differences: <a href="/blog/fresh-vs-dried-curry-leaves-cooking-comparison-2026">fresh vs dried curry leaves cooking comparison</a>.</p>
<p>Where to buy in Australia: <a href="/blog/dried-curry-leaves-australia-guide">dried curry leaves Australia guide</a>.</p>

<h2 id="curry-leaves-coles-and-supermarkets">Curry leaves at Coles, Woolworths, and grocers</h2>

<p>Fresh curry leaves appear inconsistently at major supermarkets; stock varies by store and week. Coles and Woolworths sometimes carry <strong>dried</strong> curry leaves in the international aisle, but availability is patchy. Indian and Sri Lankan grocers in Melbourne, Sydney, Brisbane, and Perth are the reliable source for fresh bunches when you need them tonight.</p>

<p>If you searched <em>curry leaves Coles</em> and came up empty, you are not alone. A mail-order $7 pouch removes the weekly supermarket lottery and stays usable for months sealed in the pantry. <a href="/products/curry-leaves/">Shop dried curry leaves</a> if you would rather cook than hunt aisles.</p>

<h2 id="who-this-helps-who-should-buy-dried-curry-leaves-instead">Who this helps</h2>

<p><strong>This guide helps if:</strong> you are mid-recipe without leaves, you want a one-off swap, or you are deciding whether to omit the ingredient.</p>

<p><strong>Buy dried instead of substituting if:</strong> authentic curry-leaf aroma matters to you more than once a year. That is when <a href="/products/curry-leaves/">dried curry leaves</a> beat another bay leaf experiment.</p>

<h2 id="common-mistakes-when-substituting-curry-leaves">Common mistakes when substituting curry leaves</h2>

<ul>
<li><strong>Using curry powder.</strong> Most common error. Different product entirely.</li>
<li><strong>Burning lemon zest.</strong> Add zest for 30 to 60 seconds in oil, same window as leaves.</li>
<li><strong>Too much bay leaf.</strong> One is enough in a small pot.</li>
<li><strong>Substituting in signature dishes.</strong> For sambar or chutney, omit or use dried leaves, not random herbs.</li>
<li><strong>Skipping the frying step.</strong> Aroma releases in hot oil, not when tossed raw at the end.</li>
<li><strong>Keeping stale dried leaf.</strong> Cardboard smell means replace, not double the quantity.</li>
</ul>

<p>Cook with <a href="/products/curry-leaves/">dried curry leaves</a>; free AU shipping over $79 when you add <a href="/products/black-tea/">Darjeeling tea</a> or the <a href="/products/gift-pack/">gift pack</a>.</p>

<h2 id="faq-curry-leaf-substitutes-for-australian-kitchens">FAQ: curry leaf substitutes for Australian kitchens</h2>

<h3>Best substitute for curry leaves?</h3>
<p>Dried curry leaves if you can get them. Kaffir lime leaves next. Lemon zest for citrus only.</p>

<h3>Can I use curry powder instead?</h3>
<p>No. See <a href="/blog/curry-leaves-vs-curry-powder-difference-explained-2026">curry leaves vs curry powder</a> for why the names confuse people.</p>

<h3>Can I skip them?</h3>
<p>Yes. Omit rather than force a poor swap in sambar, rasam, or coconut chutney.</p>

<h3>Dried vs fresh?</h3>
<p>Use about two to three times dried volume versus fresh; fry in oil the same way. Details in <a href="/blog/fresh-vs-dried-curry-leaves-cooking-comparison-2026">fresh vs dried curry leaves</a>.</p>

<h3>Do fenugreek leaves work?</h3>
<p>Only in specific North Indian dishes where methi already fits.</p>

<h3>Can bay leaves replace curry leaves?</h3>
<p>Partially in mild dishes: 1 bay leaf per 8 to 10 curry leaves.</p>

<h3>Can I get curry leaves at Coles?</h3>
<p>Sometimes dried in the international aisle; fresh is unreliable. Asian grocers are better for fresh bunches. If shelves are empty, <a href="/products/curry-leaves/">dried curry leaves online</a> ($7) skip the hunt.</p>

<h3>When should I just buy dried curry leaves?</h3>
<p>When you cook with curry leaves often or substitutes keep failing the dish. <a href="/products/curry-leaves/">Shop dried curry leaves</a>.</p>

<p ><em>Written by Neer. NutriThrive Australia.</em></p>

<p><a href="/products/curry-leaves/">Shop dried curry leaves</a> · <a href="/blog/curry-leaves-recipes-beyond-dal">Curry leaf recipes beyond dal</a> · <a href="/blog/how-to-store-curry-leaves-fresh-dried-australia-2026">How to store curry leaves</a></p>

<div class="nt-article-cta">
<h3>Skip the substitute next time</h3>
<p>Keeping <a href="/products/curry-leaves/">shade-dried curry leaves</a> in the pantry means you skip the mid-recipe scramble. Same leaf as fresh, months of shelf life, same tadka technique.</p>
<div class="btn-row">
<a class="btn-solid" href="/products/curry-leaves/">Shop dried curry leaves</a>
<a class="btn-outline" href="/shipping">Shipping &amp; returns</a>
</div>
</div>

<p ><a href="/blog/">&larr; Back to all articles</a></p>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul><li><strong>3 Oct 2026:</strong> Full substitute rewrite; Coles/supermarket section; title colon style; removed summary box; meta refreshed.</li><li><strong>30 Sep 2026:</strong> CTR title/meta; deepened buy-dried and dried-vs-fresh H2s; primary CTA Shop dried curry leaves.</li><li><strong>22 Jul 2026:</strong> Added quick answer, comparison table, expanded FAQs, and common mistakes section.</li><li><strong>29 Jun 2026:</strong> Article published.</li></ul>
</div>
<section class="nt-related-links-block">
 <h2 id="related-guides-on-dried-curry-leaves-in-australia">Related guides on dried curry leaves in Australia</h2>
 <ul>
  <li><strong>Cluster hub:</strong> <a href="/blog/nutrithrive-dried-curry-leaves-tradition-health">Natural Curry Leaves Australia: NutriThrive Farm Story &amp; Premium Sourcing</a></li>
 <li><a href="/blog/curry-leaves-recipes-beyond-dal">Five curry leaf recipes beyond dal</a></li>
 <li><a href="/blog/fresh-vs-dried-curry-leaves-cooking-comparison-2026">Fresh vs dried curry leaves</a></li>
 <li><a href="/blog/how-to-store-curry-leaves-fresh-dried-australia-2026">How to store curry leaves</a></li>
 <li><a href="/products/curry-leaves/">Shop dried curry leaves</a></li>
 </ul>
<p class="notice">Dried curry leaves $7/30g; free AU shipping from $79.</p>
</section>
</div>
          
'''

f3 = replace_prose(f3, '          <div class="prose">', '          <section class="article-conversion"', f3_prose)

# Update TOC for file 3 - add coles section? optional - user didn't require TOC update

for path, content in [
    (SITE / "what-does-moringa-powder-taste-like-honest-guide-2026.html", f1),
    (SITE / "curry-leaves-recipes-beyond-dal.html", f2),
    (SITE / "curry-leaves-substitute-what-to-use-2026.html", f3),
]:
    path.write_text(content, encoding="utf-8")
    print("Wrote", path.name)

BANNED = ["\u2014", "&#8212;", "Key Takeaways", "takeaways-box", "nt-key-takeaways", "powerhouse", "seamless"]
for name in [
    "what-does-moringa-powder-taste-like-honest-guide-2026.html",
    "curry-leaves-recipes-beyond-dal.html",
    "curry-leaves-substitute-what-to-use-2026.html",
]:
    text = (SITE / name).read_text(encoding="utf-8")
    for b in BANNED:
        if b in text:
            print(f"FAIL {name}: found {b!r}")
    if DATE_MOD not in text:
        print(f"WARN {name}: dateModified {DATE_MOD} missing")
    print(f"OK checks for {name}")
