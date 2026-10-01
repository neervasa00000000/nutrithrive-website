import re

with open('site/blog/moringa-vs-coffee-melbourne-energy-hack.html', 'r') as f:
    content = f.read()

# 1. Absorb content
absorbed_content = """
<h2 id="week-by-week-timeline">What happens week by week (energy timeline)</h2>
<p>When people try a 30-day moringa habit, the most common report isn't a sudden burst of energy—it's simply not crashing at 3pm anymore.</p>
<p><strong>Week 1:</strong> Most people notice nothing. This is normal. The nutrition you consume this week is starting to correct what was depleted, but the effect isn't yet visible. Don't stop.</p>
<p><strong>Week 2:</strong> Some people begin to notice slightly better energy in the afternoon, slightly less severe energy dips after meals. These are small changes.</p>
<p><strong>Weeks 3-4:</strong> This is where most people notice something meaningful. The 3pm crash that defined daily life either reduces or disappears. Focus feels more consistent.</p>

<h2 id="keep-coffee-add-leaf-habit">When to keep coffee and add a leaf-powder habit anyway</h2>"""

content = content.replace('<h2 id="keep-coffee-add-leaf-habit">When to keep coffee and add a leaf-powder habit anyway</h2>', absorbed_content)

# 2. Update related links at the bottom (hub-links / article-related / links)
# Wait, let's just replace all instances of "natural-pre-workout-moringa-australia-2026" 
# to point to "moringa-before-after-workout-timing-guide-2026" 
# But wait, we are told to link: "workout timing KEEP · FSANZ caffeine · how-to-add · Shop moringa powder"
# So let's replace the related links block:
new_related = """<nav class="article-related" aria-labelledby="related-moringa-vs-coffee-melbourne-energy-hack">
            <p class="kicker">Continue with</p>
            <h2 id="related-moringa-vs-coffee-melbourne-energy-hack">Related guides</h2>
            <ul>
                <li><a href="/blog/moringa-before-after-workout-timing-guide-2026">Moringa before or after workout? Timing guide</a></li>
                <li><a href="/blog/how-much-caffeine-safe-per-day-australia-fsanz-2026">FSANZ safe caffeine limits Australia</a></li>
                <li><a href="/blog/how-to-add-moringa-to-diet">How to add moringa to your diet</a></li>
                <li><a href="/products/moringa-powder/">Shop moringa powder</a></li>
            </ul>
          </nav>"""
content = re.sub(r'<nav class="article-related".*?</nav>', new_related, content, flags=re.DOTALL)

# 3. Strip any inline mentions of natural-pre-workout
content = re.sub(r'For kitchen timing around training \(not a stimulant scoop\), see <a href="/blog/natural-pre-workout-moringa-australia-2026">natural pre-workout moringa Australia</a>\.', 'For workout timing honesty, see <a href="/blog/moringa-before-after-workout-timing-guide-2026">workout timing guide</a>.', content)

content = re.sub(r'Training-context mixes \(still not a stimulant\): <a href="/blog/natural-pre-workout-moringa-australia-2026">natural pre-workout moringa Australia</a>\.', '', content)

content = re.sub(r' · <a href="/blog/natural-pre-workout-moringa-australia-2026">Natural pre-workout</a>', '', content)

with open('site/blog/moringa-vs-coffee-melbourne-energy-hack.html', 'w') as f:
    f.write(content)
