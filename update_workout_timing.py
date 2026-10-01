import re

with open('site/blog/moringa-before-after-workout-timing-guide-2026.html', 'r') as f:
    content = f.read()

# Replace any link to "moringa-vs-coffee" or "natural-pre-workout" to point to CANON coffee page for daily energy
# Wait, let's just make sure "natural-pre-workout-moringa-australia-2026" is completely removed.
content = re.sub(r'<li><a href="/blog/natural-pre-workout-moringa-australia-2026">.*?</a></li>', '', content)
content = re.sub(r'<a href="/blog/natural-pre-workout-moringa-australia-2026">.*?</a>', '', content)

# Absorb dose/timing tips if not already on page
# Let's insert it before the first <h2
absorbed_tip = """
<div class="nt-callout">
<p><strong>Dose tip for training:</strong> Mix moringa into food you already eat — smoothie, yoghurt, or warm oats — so taste and stomach stay comfortable before or after a workout. This is a kitchen habit, not a scoop ritual. Start around &frac14; to &frac12; teaspoon. Skip plain water shots if the grassy note puts you off. For daily (non-gym) energy habits, see <a href="/blog/moringa-vs-coffee-melbourne-energy-hack">Moringa vs Coffee</a>.</p>
</div>
"""
# Find first <h2 and insert before it
content = re.sub(r'(<h2[^>]*>)', absorbed_tip + r'\1', content, count=1)

# Ensure CTA is exactly Shop moringa powder
content = re.sub(r'>Shop Moringa Powder<', '>Shop moringa powder<', content, flags=re.IGNORECASE)
content = re.sub(r'>Buy moringa powder<', '>Shop moringa powder<', content, flags=re.IGNORECASE)
content = re.sub(r'>View powder<', '>Shop moringa powder<', content, flags=re.IGNORECASE)

with open('site/blog/moringa-before-after-workout-timing-guide-2026.html', 'w') as f:
    f.write(content)
