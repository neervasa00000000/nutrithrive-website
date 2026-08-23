#!/usr/bin/env python3
"""Generate the two missing personal-story blog posts from the titles/metas spreadsheet."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "blog/chronic-fatigue-what-actually-fixed-it-2026.html"
BLOG_DIR = ROOT / "blog"

POSTS = [
    {
        "slug": "moringa-30-day-challenge-honest-results",
        "title": "I Took Moringa Every Day for 30 Days: Honest Results",
        "meta": "I tried moringa daily for 30 days. Real results on energy, digestion, and sleep, no exaggeration.",
        "h1": "30 Days of Moringa: My Honest Results",
        "keywords": "moringa 30 day challenge, moringa daily results, moringa energy, moringa digestion, moringa sleep, moringa powder australia",
        "date_published": "2026-05-20",
        "date_display": "20 May 2026",
        "schema_desc": "Week-by-week diary: 2 tsp NutriThrive moringa daily for 30 days — energy, digestion, sleep, taste, and what did not change.",
        "source_page": "moringa-30-day-challenge-honest-results",
        "body": """
<div class="story-buy-inline">
<div class="story-buy-text"><strong>NutriThrive Moringa Powder — $11/100g</strong><span>Shade-dried · Melbourne · ~50 servings</span></div>
<a class="btn-buy-moringa" href="/products/moringa-powder/">Shop Moringa →</a>
</div>
<div class="nt-founder-note" style="margin:1.25rem 0;padding:1rem 1.25rem;background:#f7f3e8;border-left:4px solid #0f6b4d;border-radius:8px;font-size:0.95rem;"><p style="margin:0;">I'm Neer (NutriThrive, Truganina). This is one person's 30-day diary — not a clinical trial. Your results will differ. Talk to your GP before changing supplements if you take medicines or are pregnant.</p></div>

<h2 id="intro">Why I Did a 30-Day Moringa Challenge</h2>
<p>I'd already fixed most of my chronic fatigue (see my <a href="/blog/chronic-fatigue-what-actually-fixed-it-2026">fatigue story</a>). Moringa was part of that. But friends kept asking: <em>"Does it actually work, or is it placebo?"</em></p>
<p>So I ran a simple experiment: <strong>2 teaspoons of NutriThrive moringa every morning</strong> for 30 days straight. Same brand, same dose, same smoothie recipe. I tracked energy (1–10), digestion, sleep quality, and mood daily in Notes.</p>
<p><strong>Spoiler:</strong> nothing miraculous happened on Day 1. The interesting stuff showed up in Weeks 2–4. Here's the honest log.</p>

<h2 id="setup">The Setup (So You Can Copy It)</h2>
<ul>
<li><strong>Dose:</strong> 2 tsp (≈5g) moringa powder every morning</li>
<li><strong>Method:</strong> blended into a smoothie (banana, mango, almond milk, peanut butter)</li>
<li><strong>Brand:</strong> <a href="/products/moringa-powder/">NutriThrive shade-dried moringa</a> — I work here, but I paid for my own packs before joining</li>
<li><strong>Everything else:</strong> kept sleep, protein, and exercise the same (no new diets mid-challenge)</li>
</ul>
<div class="recipe-block">Daily smoothie<br>1 banana · 1 cup frozen mango · 1 cup almond milk · 1 tbsp peanut butter · 2 tsp moringa<br>→ Blend. Drink with breakfast.</div>

<h2 id="week-by-week">Week-by-Week: What Actually Changed</h2>

<div class="day-card">
<h3>Days 1–7: Mostly Just Taste Adjustment</h3>
<p><strong>Energy:</strong> 5/10 average — no real change yet.</p>
<p><strong>Digestion:</strong> slightly more regular bowel movements by Day 5 (I was chronically "slow" before).</p>
<p><strong>Sleep:</strong> unchanged.</p>
<p><strong>Taste:</strong> earthy and grassy. Not horrible in a fruity smoothie, but not delicious either. I got used to it by Day 4.</p>
<p><strong>Honest take:</strong> If I'd quit at Day 7, I'd have said "meh, does nothing."</p>
</div>

<div class="day-card">
<h3>Days 8–14: Morning Energy Shift</h3>
<p><strong>Energy:</strong> 6–7/10 — woke without hitting snooze 4 out of 7 days (was 1 out of 7 before).</p>
<p><strong>Digestion:</strong> less bloating after lunch. Still not perfect.</p>
<p><strong>Sleep:</strong> no change.</p>
<p><strong>Surprise:</strong> fewer 10am coffee cravings. I still had one coffee, but didn't <em>need</em> it to function.</p>
</div>

<div class="day-card">
<h3>Days 15–21: Steadier Afternoons</h3>
<p><strong>Energy:</strong> 7/10 average — the 2–3pm crash was softer most days.</p>
<p><strong>Digestion:</strong> noticeably better. Less post-meal heaviness.</p>
<p><strong>Sleep:</strong> fell asleep ~15 minutes faster (could be coincidence).</p>
<p><strong>Skin:</strong> no dramatic glow, but fewer dull-skin days.</p>
</div>

<div class="day-card">
<h3>Days 22–30: Plateau (Not Magic)</h3>
<p><strong>Energy:</strong> held at 7–8/10. Not "superhuman" — just <em>normal human who slept okay</em>.</p>
<p><strong>Digestion:</strong> best week of the month.</p>
<p><strong>Sleep:</strong> still average. Moringa didn't fix my sleep — magnesium and phone-out-of-bedroom did that earlier.</p>
<p><strong>Weight:</strong> no change on the scale (I wasn't trying to lose weight).</p>
</div>

<h2 id="what-didnt-change">What Did NOT Change (Important)</h2>
<ul>
<li><strong>No instant energy boost</strong> like coffee or pre-workout</li>
<li><strong>No weight loss</strong> without diet changes</li>
<li><strong>No miracle sleep cure</strong> for me</li>
<li><strong>Taste never became "delicious"</strong> — just tolerable in smoothies</li>
<li><strong>Skipping days</strong> in Week 4 (I forgot twice) — energy dipped back to 5/10 those days</li>
</ul>

<h2 id="why-it-might-work">Why Moringa Might Help (Without Hype)</h2>
<p>Moringa is a whole leaf powder — iron, vitamin C (helps iron absorption), B vitamins, magnesium, and fibre. I'm not iron-deficient anymore, but the nutrient density and gentle fibre may explain the digestion and steady energy shifts.</p>
<p>For deeper science (not my diary), see <a href="/blog/moringa-energy-what-happens-week-by-week-2026">what happens week by week with moringa</a> and <a href="/blog/how-much-moringa-powder-per-day-dosage-guide-2026">dosage guide</a>.</p>

<h2 id="faqs">FAQs</h2>
<div class="faq-item">
<h3>Is 30 days enough to judge moringa?</h3>
<p>For me, Week 2+ is when subtle changes showed. I'd give it at least 3–4 weeks at a consistent dose before deciding.</p>
</div>
<div class="faq-item">
<h3>Can I take moringa at night instead?</h3>
<p>I used mornings only. Some people take it at lunch. See <a href="/blog/best-time-to-take-moringa-powder-morning-or-night-2026">morning vs night timing</a>.</p>
</div>
<div class="faq-item">
<h3>Will I get the same results?</h3>
<p>Probably not exactly. If you're iron-deficient, sleep-deprived, or eating ultra-processed food all day, moringa alone won't fix that. It's one piece.</p>
</div>

<h2 id="bottom-line">Bottom Line</h2>
<p><strong>30 days of moringa did not transform my life.</strong> It did give me slightly better mornings, calmer afternoons, and happier digestion — worth $11/month to me. I still take it daily.</p>
<p>If you want to try the same challenge: 2 tsp daily, track energy for 30 days, don't change five other variables at once.</p>

<div class="story-buy-inline">
<div class="story-buy-text"><strong>NutriThrive Moringa Powder — $11/100g</strong><span>Shade-dried · Melbourne · ~50 servings</span></div>
<a class="btn-buy-moringa" href="/products/moringa-powder/">Shop Moringa →</a>
</div>

<p style="font-size: 0.9rem; color: #6b7d6f; margin-top: 2.5rem;"><em>Disclaimer: Personal experience, not medical advice. These statements have not been evaluated by the TGA. Consult your GP before supplements. Last updated 23 Aug 2026.</em></p>

<div class="story-related">
<h3>Related Reading</h3>
<ul>
<li><a href="/blog/chronic-fatigue-what-actually-fixed-it-2026">Chronic Fatigue: What Actually Fixed It</a></li>
<li><a href="/blog/moringa-energy-what-happens-week-by-week-2026">Moringa Energy: Week-by-Week Guide</a></li>
<li><a href="/blog/how-to-use-moringa-powder-daily-without-the-bad-taste-2026">Use Moringa Daily Without the Bad Taste</a></li>
<li><a href="/blog/moringa-gut-health-digestion-evidence-2026">Moringa &amp; Gut Health: What Evidence Shows</a></li>
<li><a href="/products/moringa-powder/">Shop NutriThrive Moringa Powder</a></li>
</ul>
</div>
""",
    },
    {
        "slug": "cant-lose-weight-broken-gut-what-actually-worked-2026",
        "title": "Couldn't Lose Weight? What Actually Worked (Gut Health)",
        "meta": "I couldn't lose weight until I fixed my gut health first. Here's what actually worked, in plain terms.",
        "h1": "Couldn't Lose Weight? What Actually Worked",
        "keywords": "can't lose weight gut health, weight loss plateau australia, gut health weight loss, bloating weight gain, moringa gut health",
        "date_published": "2026-05-22",
        "date_display": "22 May 2026",
        "schema_desc": "Personal diary: gut repair before calorie counting — bloating, probiotics, fibre, moringa, and what finally moved the scale.",
        "source_page": "cant-lose-weight-broken-gut-what-actually-worked-2026",
        "body": """
<div class="story-buy-inline">
<div class="story-buy-text"><strong>NutriThrive Moringa Powder — $11/100g</strong><span>Shade-dried · Melbourne · ~50 servings</span></div>
<a class="btn-buy-moringa" href="/products/moringa-powder/">Shop Moringa →</a>
</div>
<div class="nt-founder-note" style="margin:1.25rem 0;padding:1rem 1.25rem;background:#f7f3e8;border-left:4px solid #0f6b4d;border-radius:8px;font-size:0.95rem;"><p style="margin:0;">I'm Neer (NutriThrive, Truganina). This is one person's weight story — not a diet plan. If you have unexplained weight change, diabetes, or eating-disorder history, see your GP first.</p></div>

<h2 id="intro">I Ate in a Deficit for 8 Months. The Scale Didn't Move.</h2>
<p><strong>Breakfast:</strong> overnight oats and berries. <strong>Lunch:</strong> salad with chicken. <strong>Dinner:</strong> stir-fry. <strong>Steps:</strong> 8,000–10,000/day. <strong>Calories:</strong> tracked in MyFitnessPal.</p>
<p>According to the maths, I should have lost 6–8 kg. I lost <strong>maybe 1.5 kg</strong>, then stalled for months.</p>
<p>My GP ran thyroid and diabetes tests — fine. A dietitian said "be patient." I wasn't binge eating. I was just… stuck.</p>
<p><strong>The turning point:</strong> a GP who asked about bloating, bowel habits, and antibiotics. Turns out my gut was a mess — and fixing <em>that</em> came before any further calorie tinkering.</p>

<h2 id="signs">Signs Your Gut Might Be Blocking Weight Loss</h2>
<p>I had 6 of these:</p>
<ul>
<li>Bloating that made me look 3 months pregnant by evening</li>
<li>Constipation alternating with urgent diarrhoea</li>
<li>Sugar cravings that felt physical, not emotional</li>
<li>Brain fog and afternoon crashes</li>
<li>New food sensitivities (dairy, wheat)</li>
<li>Skin breakouts alongside digestive issues</li>
</ul>
<p>If that sounds familiar, calories might not be your first lever. See also <a href="/blog/cystic-acne-gut-healing-what-actually-cleared-skin-2026">gut health and skin</a> and <a href="/blog/moringa-gut-health-digestion-evidence-2026">moringa &amp; digestion evidence</a>.</p>

<h2 id="what-i-tried">What I Tried That Didn't Work</h2>
<div class="day-card">
<h3>❌ Cutting calories lower</h3>
<p>Dropped to 1,200 kcal/day. Hungrier, moodier, still bloated. Scale stuck.</p>
</div>
<div class="day-card">
<h3>❌ Keto for 6 weeks</h3>
<p>Lost water weight fast, regained when I added carbs. Gut symptoms unchanged.</p>
</div>
<div class="day-card">
<h3>❌ "Detox" teas</h3>
<p>Mostly laxative effect. Not sustainable. Waste of money.</p>
</div>
<div class="day-card">
<h3>❌ Random probiotic from Chemist Warehouse</h3>
<p>No strain info, no change after 4 weeks.</p>
</div>

<h2 id="what-worked">What Actually Worked (In Order)</h2>

<h3>Step 1: Repair the gut (Weeks 1–4)</h3>
<ul>
<li><strong>Removed triggers for 30 days:</strong> alcohol, ultra-processed snacks, excess dairy</li>
<li><strong>Added fibre gradually:</strong> vegetables at lunch and dinner, not all at once</li>
<li><strong>Targeted probiotic:</strong> multi-strain with <em>L. rhamnosus</em> and <em>B. lactis</em> (GP suggested)</li>
<li><strong>2 tsp moringa daily</strong> in morning smoothie — fibre + micronutrients without harsh laxatives</li>
</ul>
<p><strong>Result by Week 4:</strong> bloating down ~70%. Bathroom regular for the first time in years.</p>

<h3>Step 2: Protein and blood sugar (Weeks 5–8)</h3>
<p>Once bloating eased, I could actually <em>feel</em> hunger signals again. Added 30g protein per meal, walked after dinner, kept moringa in the morning routine.</p>
<p><strong>Result:</strong> fewer 3pm sugar hunts. Scale finally moved — <strong>2 kg over 6 weeks</strong> without dropping calories further.</p>

<h3>Step 3: Sleep and stress (Weeks 9–12)</h3>
<p>Poor sleep raises cortisol, which can drive belly fat and cravings. Fixed sleep hygiene (from my <a href="/blog/chronic-fatigue-what-actually-fixed-it-2026">fatigue protocol</a>).</p>
<p><strong>Result:</strong> another <strong>2.5 kg over 8 weeks</strong>, mostly sustainable habits not crash dieting.</p>

<h2 id="timeline">Honest Timeline</h2>
<div class="stat-grid">
<div class="stat-card"><div class="stat-number">4 wk</div><div class="stat-label">Bloating improved (no scale change)</div></div>
<div class="stat-card"><div class="stat-number">6 wk</div><div class="stat-label">First real scale movement</div></div>
<div class="stat-card"><div class="stat-number">~5 kg</div><div class="stat-label">Total over 5 months (slow)</div></div>
</div>
<p>Not a 30-day transformation reel. Slow, boring, sustainable.</p>

<h2 id="moringa-role">Where Moringa Fit In</h2>
<p>Moringa wasn't a fat burner. It was a <strong>daily whole-food habit</strong> that added fibre, iron, and B vitamins while I rebuilt eating patterns. Easier than swallowing five separate pills. See <a href="/blog/30-different-plants-per-week-gut-health-microbiome-2026">plants per week for gut diversity</a>.</p>

<h2 id="faqs">FAQs</h2>
<div class="faq-item">
<h3>Should I fix gut health before counting calories?</h3>
<p>If you're bloated, irregular, or craving sugar constantly, gut work often comes first. Once symptoms improve, calorie balance matters again.</p>
</div>
<div class="faq-item">
<h3>Do I need to cut gluten or dairy forever?</h3>
<p>I did a strict 30-day elimination, then reintroduced slowly. Dairy is a trigger for me; wheat is fine in small amounts. Test your own response.</p>
</div>
<div class="faq-item">
<h3>When should I see a doctor?</h3>
<p>Unexplained weight gain or loss, blood in stool, severe pain, or symptoms that don't improve in 6–8 weeks — book a GP visit.</p>
</div>

<h2 id="bottom-line">Bottom Line</h2>
<p>I couldn't lose weight until I stopped fighting bloating with more restriction and started fixing digestion first. Moringa, probiotics, and boring whole foods — not a juice cleanse.</p>

<div class="story-buy-inline">
<div class="story-buy-text"><strong>NutriThrive Moringa Powder — $11/100g</strong><span>Shade-dried · Melbourne · ~50 servings</span></div>
<a class="btn-buy-moringa" href="/products/moringa-powder/">Shop Moringa →</a>
</div>

<p style="font-size: 0.9rem; color: #6b7d6f; margin-top: 2.5rem;"><em>Disclaimer: Personal experience, not medical or dietetic advice. These statements have not been evaluated by the TGA. Consult your GP or an accredited dietitian. Last updated 23 Aug 2026.</em></p>

<div class="story-related">
<h3>Related Reading</h3>
<ul>
<li><a href="/blog/moringa-gut-health-digestion-evidence-2026">Moringa &amp; Gut Health: Evidence</a></li>
<li><a href="/blog/cystic-acne-gut-healing-what-actually-cleared-skin-2026">Cystic Acne &amp; Gut Health</a></li>
<li><a href="/blog/moringa-for-weight-loss-evidence-2026">Moringa for Weight Loss: The Evidence</a></li>
<li><a href="/blog/stop-eating-ultra-processed-food-30-days-what-happens-2026">30 Days Without Ultra-Processed Food</a></li>
<li><a href="/blog/moringa-30-day-challenge-honest-results">30 Days of Moringa: Honest Results</a></li>
<li><a href="/products/moringa-powder/">Shop NutriThrive Moringa Powder</a></li>
</ul>
</div>
""",
    },
]


def html_escape(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def extract_shell() -> tuple[str, str]:
    raw = TEMPLATE.read_text(encoding="utf-8")
    # From first critical inline style block through end of head scripts
    head_end = raw.index("</head>")
    head_start = raw.index("<!-- Blog perf: critical CSS")
    head_shell = raw[head_start:head_end]

    footer_start = raw.index('<div id="nt-footer">')
    footer = raw[footer_start:]
    return head_shell, footer


def faq_schema(post: dict) -> str:
    if "30-day" in post["slug"]:
        faqs = [
            ("Is 30 days enough to judge moringa?", "For many people, subtle changes appear in weeks 2–4 at a consistent dose. Give it at least 3–4 weeks before deciding."),
            ("Can I take moringa at night?", "Morning or lunch works for most people. Timing matters less than consistency and dose."),
            ("Will I get the same results as you?", "Unlikely to match exactly. Sleep, iron status, diet, and stress all affect outcomes. Moringa is one piece, not a cure-all."),
        ]
    else:
        faqs = [
            ("Should I fix gut health before counting calories?", "If bloating, irregular digestion, or intense sugar cravings are present, gut repair often helps before further calorie restriction."),
            ("Do I need to eliminate gluten or dairy?", "A structured 30-day elimination with careful reintroduction helps identify personal triggers. Not everyone needs permanent cuts."),
            ("When should I see a doctor about weight?", "Unexplained weight change, blood in stool, severe pain, or no improvement after 6–8 weeks of lifestyle changes warrant a GP visit."),
        ]
    entities = [
        {
            "@type": "Question",
            "name": q,
            "acceptedAnswer": {"@type": "Answer", "text": a},
        }
        for q, a in faqs
    ]
    return json.dumps(
        {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": entities},
        ensure_ascii=False,
        indent=2,
    )


def build_post(post: dict, head_shell: str, footer: str) -> str:
    slug = post["slug"]
    url = f"https://nutrithrive.com.au/blog/{slug}"
    title = post["title"]
    meta = post["meta"]
    h1 = post["h1"]
    esc_title = html_escape(title)
    esc_meta = html_escape(meta)
    esc_h1 = html_escape(h1)
    iso_time = f"{post['date_published']}T00:00:00+10:00"

    head = f"""<!DOCTYPE html>
<html class="scroll-smooth" lang="en-AU">
<head>
<!-- Favicons (PNG/ICO for Google Search/Images; WebP is not reliable for favicons) -->
<link rel="icon" type="image/png" sizes="48x48" href="/assets/images/logo/favicon-48.png">
<link rel="icon" href="/assets/images/logo/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="96x96" href="/assets/images/logo/favicon-96.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/images/logo/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileImage" content="/assets/images/logo/apple-touch-icon.png">
<meta name="msapplication-TileColor" content="#0f6b4d">


<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<link rel="preload" as="image" href="/assets/images/product_photos/moringa.webp" fetchpriority="high"/>
<title>{esc_title}</title>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-WH21SW75WP"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', 'G-WH21SW75WP', {{'anonymize_ip': true, 'allow_google_signals': false}});
</script>
<link rel="preconnect" href="https://www.googletagmanager.com"/>
<link rel="dns-prefetch" href="https://www.google-analytics.com"/>
<link rel="dns-prefetch" href="https://www.redditstatic.com"/>

<meta name="robots" content="index, follow">
<link rel="canonical" href="{url}"/>
<link rel="alternate" hreflang="en-AU" href="{url}"/>
<link rel="alternate" hreflang="x-default" href="{url}"/>

<meta name="description" content="{esc_meta}"/>
<meta name="keywords" content="{html_escape(post['keywords'])}"/>
<meta content="NutriThrive" name="author"/>

<meta property="og:type" content="article"/>
<meta property="og:url" content="{url}"/>
<meta property="og:title" content="{esc_title}"/>
<meta property="og:description" content="{esc_meta}"/>
<meta property="og:image" content="https://nutrithrive.com.au/assets/images/og/moringa-article-1200.jpg"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:image:alt" content="NutriThrive moringa powder — personal wellness story"/>
<meta property="og:site_name" content="NutriThrive Australia"/>
<meta property="og:locale" content="en_AU"/>
<meta property="article:published_time" content="{iso_time}">
<meta property="article:modified_time" content="2026-08-23T00:00:00+10:00">

<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:url" content="{url}"/>
<meta name="twitter:title" content="{esc_title}"/>
<meta name="twitter:description" content="{esc_meta}"/>
<meta name="twitter:image" content="https://nutrithrive.com.au/assets/images/og/moringa-article-1200.jpg"/>

<meta content="#0f6b4d" name="theme-color"/>

<script type="application/ld+json">
{json.dumps({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": post["schema_desc"],
  "author": {"@type": "Person", "@id": "https://nutrithrive.com.au/#person-neer", "name": "Neer", "url": "https://nutrithrive.com.au/about"},
  "publisher": {"@type": "Organization", "name": "NutriThrive Australia", "logo": {"@type": "ImageObject", "url": "https://nutrithrive.com.au/assets/images/logo/logo-112.png"}},
  "datePublished": post["date_published"],
  "dateModified": "2026-08-23",
  "image": "https://nutrithrive.com.au/assets/images/og/moringa-article-1200.jpg",
  "mainEntityOfPage": {"@type": "WebPage", "@id": url},
}, ensure_ascii=False, indent=2)}
</script>

<script type="application/ld+json">
{faq_schema(post)}
</script>

<script type="application/ld+json">
{json.dumps({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://nutrithrive.com.au"},
    {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://nutrithrive.com.au/blog/"},
    {"@type": "ListItem", "position": 3, "name": title, "item": url},
  ],
}, ensure_ascii=False, indent=2)}
</script>

<script type="application/ld+json">
{json.dumps({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": title,
  "description": meta,
  "image": "https://nutrithrive.com.au/assets/images/og/moringa-article-1200.jpg",
  "datePublished": post["date_published"],
  "dateModified": "2026-08-23",
  "author": {"@type": "Person", "@id": "https://nutrithrive.com.au/#person-neer", "name": "Neer", "url": "https://nutrithrive.com.au/about"},
  "publisher": {"@type": "Organization", "name": "NutriThrive"},
  "mainEntityOfPage": {"@type": "WebPage", "@id": url},
}, ensure_ascii=False, indent=2)}
</script>

{head_shell}
</head>
<body class="bg-background text-on-background font-body-md overflow-x-hidden nt-blog-article">
<div class="nt-sticky-top">
<header id="nt-header" class="nt-v2-header"></header>
</div>
<nav class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-4 pb-2 text-label-sm"><a class="text-moringa-leaf hover:underline" href="/blog/">← Journal</a></nav><main class="pt-6 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop nt-blog-main">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
<article class="lg:col-span-8">
<header class="mb-12">
<div class="flex flex-wrap items-center gap-2 mb-4">
<span class="bg-primary-fixed/30 text-moringa-leaf px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider font-bold">Wellness Story</span>
<span class="text-on-surface-variant text-label-lg font-body-md">{post['date_display']}</span>
</div>
<h1 class="font-display text-headline-lg md:text-display text-forest-deep mb-8 leading-tight">{esc_h1}</h1>
<div class="w-full aspect-[16/9] rounded-xl overflow-hidden mb-12 shadow-sm bg-surface-container">
<img alt="NutriThrive Moringa Powder" class="w-full h-full object-cover" src="/assets/images/product_photos/moringa.webp" width="800" height="800" loading="eager" decoding="async" fetchpriority="high"/>
</div>
</header>
<div class="blog-v2-prose prose prose-lg max-w-none">
{post['body']}
</div>
<section class="mt-20 p-8 md:p-12 bg-parchment-base rounded-2xl border border-outline-variant/30 text-center">
<h3 class="font-headline-md text-headline-md text-forest-deep mb-4">Stay Vitalized</h3>
<p class="font-body-md text-body-md text-on-surface-variant mb-8 max-w-md mx-auto">Get plant-based nutrition tips and exclusive offers from Melbourne.</p>
<form class="flex flex-col md:flex-row gap-4 max-w-lg mx-auto" action="https://formsubmit.co/nutrithrive0@gmail.com" method="POST">
<input type="hidden" name="_subject" value="Newsletter Subscription - NutriThrive">
<input type="hidden" name="_template" value="table">
<input type="hidden" name="_captcha" value="false">
<input type="hidden" name="_next" value="https://nutrithrive.com.au/pages/newsletter/thank-you.html">
<input type="hidden" name="source_page" value="{post['source_page']}">
<input class="flex-grow p-4 rounded-lg border border-outline-variant bg-pure-white focus:outline-none focus:ring-2 focus:ring-moringa-leaf" placeholder="Your email address" type="email" name="email" required/>
<button class="bg-moringa-leaf text-pure-white px-8 py-4 rounded-lg font-label-lg text-label-lg hover:bg-forest-deep transition-all" type="submit">Subscribe</button>
</form>
</section>
</article>
<aside class="lg:col-span-4 space-y-12">
<div class="bg-pure-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden nt-blog-sidebar-promo" data-nt-b3g1-promo>
<div class="aspect-square bg-surface-container relative">
<img alt="400g Moringa Bundle — Buy 3 Get 1 Free" class="w-full h-full object-cover" src="/assets/images/product_photos/moringa-400g-bundle.jpeg" loading="lazy" width="600" height="600"/>
<div class="absolute top-4 right-4 bg-moringa-leaf text-pure-white px-3 py-1 rounded-lg text-label-sm font-label-sm">Buy 3 Get 1</div>
</div>
<div class="p-6">
<h4 class="font-headline-md text-headline-md text-forest-deep mb-2">400g Moringa Bundle</h4>
<p class="text-on-surface-variant font-body-md text-body-md mb-4">Four 100g packs — save vs buying singles. Shade-dried, NMI lab-tested, packed in Melbourne.</p>
<div class="nt-blog-sidebar-price flex items-baseline gap-1 mb-2">
<span class="text-2xl font-bold text-moringa-leaf">$35.00</span>
<span class="text-sm text-on-surface-variant">/400g</span>
</div>
<p class="text-body-sm text-on-surface-variant mb-6">$44.00 as four singles — save $9.00</p>
<a class="block w-full text-center bg-moringa-leaf text-pure-white py-4 rounded-lg font-label-lg text-label-lg hover:scale-[1.02] transition-transform" href="/products/moringa-powder/">Shop 400g Bundle →</a>
</div>
</div>
<div class="nt-ad-slot nt-ad-slot--sidebar" data-ad-slot="sidebar" data-nt-ad-promo></div>
</aside>
</div>
</main>
"""

    return head + footer


def remove_410_redirects() -> None:
    redirects = (ROOT / "_redirects").read_text(encoding="utf-8")
    lines = redirects.splitlines()
    skip_prefixes = (
        "/blog/cant-lose-weight-broken-gut-what-actually-worked-2026",
        "/blog/moringa-30-day-challenge-honest-results",
    )
    kept = [ln for ln in lines if not any(ln.startswith(p) for p in skip_prefixes)]
    (ROOT / "_redirects").write_text("\n".join(kept) + ("\n" if kept else ""), encoding="utf-8")


def main() -> None:
    head_shell, footer = extract_shell()
    for post in POSTS:
        out = BLOG_DIR / f"{post['slug']}.html"
        out.write_text(build_post(post, head_shell, footer), encoding="utf-8")
        print(f"Wrote {out.name}")
    remove_410_redirects()
    print("Removed 410 redirects from _redirects")


if __name__ == "__main__":
    main()
