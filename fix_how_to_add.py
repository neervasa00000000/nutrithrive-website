import re

with open('site/blog/how-to-add-moringa-to-diet.html', 'r') as f:
    html = f.read()

# Fix double <div class="prose">
html = html.replace('<div class="prose">\n\n<div class="prose">', '<div class="prose">')
html = html.replace('<div class="prose">\n<div class="prose">', '<div class="prose">')
html = html.replace('<div class="prose">\n\n<h2', '<h2')

# Fix the FAQ append
# It wasn't appended because the regex failed
faq_append = """
<h3>How much moringa powder per day to start?</h3>
<p>Most people start at ½ tsp in food once daily, then 1 tsp if taste is fine. <a href="/products/moringa-powder/">Shop moringa powder</a> for pack sizes.</p>

<h3>Powder, capsules, or tea first?</h3>
<p>This guide is for leaf powder you can weigh into food. Capsules skip the food path; tea is a different use — see the tea recipe link above. <a href="/products/moringa-powder/">Shop moringa powder</a> when you want the oral powder format.</p>

<h3>How do I hit $79 free shipping without wasting powder?</h3>
<p>Free AU shipping starts at $79. One practical basket is 400g ($35) plus curry leaves and Darjeeling tea. <a href="/products/moringa-powder/">Shop moringa powder</a> for live prices.</p>
"""
# Insert before <div class="nt-article-cta">
html = html.replace('<div class="nt-article-cta">', faq_append + '\n<div class="nt-article-cta">')

with open('site/blog/how-to-add-moringa-to-diet.html', 'w') as f:
    f.write(html)

