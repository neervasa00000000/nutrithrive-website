#!/usr/bin/env python3
"""Generate blog/afl-finals-snacks-curry-leaf-tadka.html."""
from __future__ import annotations

import json
import re
from pathlib import Path

import mistune

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "blog/afl-finals-snacks-curry-leaf-tadka.html"

SLUG = "afl-finals-snacks-curry-leaf-tadka"
URL = f"https://nutrithrive.com.au/blog/{SLUG}"
TITLE = "AFL Finals Snacks: Curry-Leaf Tadka, Not Party Pies"
H1 = "AFL Finals Snacks: Curry-Leaf Tadka, Packed in Truganina"
META = (
    "Wildcard weekend is done. Week 2 starts Thursday. "
    "I fry dried kari leaf in ghee over nuts or popcorn. 30g, Truganina, $7."
)
DATE = "2026-08-30"
DATE_DISPLAY = "30 Aug 2026"
HERO = "/assets/images/blog/AFL.webp"
OG = "https://nutrithrive.com.au/assets/images/blog/AFL.webp"
CATEGORY = "Recipes"
CATEGORY_HREF = "https://nutrithrive.com.au/blog/category/recipes/"
MIN_READ = "13 min read"

assert len(TITLE) == 51, len(TITLE)
assert len(H1) == 56, len(H1)
assert len(META) == 121, len(META)

FAQS = [
    (
        "When does AFL finals Week 2 start in 2026?",
        "Thursday 3 September 2026. AFL.com.au locked Fremantle v Hawthorn at Optus Stadium, "
        "8.10pm AEST. Friday is Geelong v Carlton at the MCG. Saturday is Sydney v Brisbane at the SCG, "
        "then Adelaide v Western Bulldogs at Adelaide Oval.",
    ),
    (
        "Will a $7 curry-leaf bag arrive before Thursday night's Freo game?",
        "Not as a promise. I do not dispatch on Sunday. A Sunday 30 August order packs Monday 31 August "
        "if it is in before 2pm. Perth metro is typically 3–5 business days. That band can land Thursday 3 "
        "through Monday 7 September. The slow end misses Thursday. Pickup in Truganina is the only doorstep "
        "I control.",
    ),
    (
        "What does posted 30g curry leaves cost?",
        "The bag is $7. Under $49, default AU shipping is $9.69. Landed $16.69. Pickup by arrangement is $7. "
        "Free shipping at $49+.",
    ),
    (
        "Is this curry powder?",
        "No. Whole dried kari leaf, Murraya koenigii. Curry powder is a ground spice mix. They are not substitutes.",
    ),
    (
        "Is this a health snack or a TGA product?",
        "No. It is a cooking leaf. I do not sell it to treat disease. No heart, cholesterol, immunity, or "
        "skin-treatment story on this page.",
    ),
    (
        "Fresh or dried for tadka over snacks?",
        "Dried, for this method. Fresh leaf spatters more and wilts in days. Dried crackles in ghee and sits "
        "in the pantry. Use more dried leaf than a fresh recipe would.",
    ),
    (
        "How much of a 30g bag is one game?",
        "A snack tadka uses a small handful, about 2–4 g. A 30g bag is several games, not one bowl.",
    ),
    (
        "Can I pick up in Truganina?",
        "Yes, by arrangement. 15 Europe Street, Truganina VIC 3029. Cash for pickup only. Call +61 438 201 419 "
        "or email nutrithrive0@gmail.com first.",
    ),
    (
        "Do you dispatch on Sunday?",
        "No. Same-day dispatch is before 2pm on business days. A Saturday or Sunday order waits for Monday.",
    ),
]

BODY_MD = r"""
I'm Neer. I pack NutriThrive orders at 15 Europe Street, Truganina VIC 3029. Wildcard weekend is finished. [AFL.com.au](https://www.afl.com.au/news/1597385/finals-fixture-ticket-details-schedule-confirmed-for-week-two-of-the-2026-finals-series) has Week 2 locked: it starts **Thursday 3 September 2026**. I fry dried kari leaf in ghee and pour it over nuts or popcorn. The bag I sell is **30 g**, SKU **NT-CL-30G**, **$7**. Posted it is **$7 + $9.69** unless you pick up or the cart clears **$49**.

## Week 2 is Thursday. The calendar does not care about your oven

Today is Sunday 30 August. The first bag I can hand to Australia Post is **Monday 31 August**, and only if the order is in before 2pm. I do not dispatch on Sunday. Australia Post does not run a standard parcel on Sunday either. That is the same rule I used on the [Father's Day gift cutoff](/blog/fathers-day-gift-under-40). Different product. Same warehouse clock.

[AFL.com.au's Week 2 fixture](https://www.afl.com.au/news/1597385/finals-fixture-ticket-details-schedule-confirmed-for-week-two-of-the-2026-finals-series) (confirmed after the second wildcard on Saturday night) is:

| Night | Match | Venue | Start |
| --- | --- | --- | --- |
| Thu 3 Sep | Fremantle v Hawthorn (qualifying) | Optus Stadium | 8.10pm AEST / 6.10pm AWST |
| Fri 4 Sep | Geelong v Carlton (elimination) | MCG | 7.40pm AEST |
| Sat 5 Sep | Sydney v Brisbane (qualifying) | SCG | 3.15pm AEST |
| Sat 5 Sep | Adelaide v Western Bulldogs (elimination) | Adelaide Oval | 7.35pm AEST / 7.05pm ACST |

I am not a tipper. I am not selling jumpers. I am telling you when people will actually be on a couch with a bowl.

If you are in Melbourne and you want the bag in your hands before Friday night at the G, **pickup by arrangement** this week is the honest path. If you are posting to Perth for Thursday night at Optus, read the shipping table and do not treat a blog as a courier guarantee. Sydney or Adelaide for Saturday has more air. Still not a promise.

Monday on this site is a Chemist Warehouse greens comparison. Different URL. This page is the snack.

## Party pies are the default. I am not competing with a freezer tray

A party pie is a frozen pastry with mince. It is the national default for September nights. I am not inventing a Woolworths SKU I did not audit this morning. You already know what a pie tray costs, and that it needs an oven you will ignore when the bounce is on.

I am not calling pies unhealthy. I am not calling tadka a "better-for-you footy snack." That sentence is a health claim in a tracksuit. This page does not do heart, cholesterol, blood pressure, immunity, metabolism, antioxidant, or "anti-inflammatory snack" copy. The evidence URL for curry leaves and heart markers is a different page. Do not import it.

What I am selling is a flavour job: **crackle, citrus-leaf, ghee**. One small pan. No 180°C wait. If you want pies, buy pies. If you want a bowl that smells like a South Indian kitchen for the second quarter, keep reading. Nuts and popcorn are not a moral upgrade. They are what the tadka sits on.

## Kari leaf is not curry powder

The leaf is *Murraya koenigii*. In Tamil kitchens it is kari leaf. In Australian shops the bag often says "curry leaves." The powder in the spice rack labelled curry is usually turmeric, coriander, cumin, chilli, and filler. [They are not the same ingredient](/blog/curry-leaves-vs-curry-powder-difference-explained-2026). If you dump curry powder on popcorn you get yellow dust and a different night.

Fresh curry leaf from a suburban tree is excellent in a tadka for dal. It also wilts, blackens, and occupies the crisper. [Fresh vs dried](/blog/fresh-vs-dried-curry-leaves-cooking-comparison-2026) is a real cooking choice. For a finals week where you might cook Sunday, Thursday, Friday, and Saturday, **dried leaf in a 30 g bag** is the pantry version. It does not need a second Woolworths run on Thursday arvo.

If you have never done a tadka: the window is 20–40 seconds. Past that they go bitter. Under-leaf it and you taste only ghee. I pack whole dried leaf. Not powder. Not a "seasoning blend." SKU **NT-CL-30G**. [Dried Curry Leaves, $7 / 30 g](/products/curry-leaves/). Shade-dried. Packed here. Not certified organic.

## The method: one pan, ghee, leaf, pour

This is a tadka. In a dal you pour it over lentils. For a game you pour it over something crunchy. Same heat, same noise, different landing zone.

**You need**

- 1–2 teaspoons ghee (or a neutral oil if you do not keep ghee; ghee is the one I use)
- A small handful of dried kari leaf, about 2–4 g, stems flicked off if they bother you
- Optional: ½ teaspoon mustard seeds, or a pinch of chilli flakes if your couch can handle it
- 2–3 cups salted roasted peanuts, mixed nuts, or popped corn, already in the serving bowl
- A small pan you can pick up with one hand

**Do this**

1. Put the nuts or popcorn in a wide bowl. Have it next to the stove. Tadka waits for nobody.
2. Heat the ghee over medium-high until it looks loose and smells nutty, not smoking.
3. If you are using mustard seeds, add them first. They should pop in about ten seconds. If they sit silent, the pan is cold. If they burn black in three seconds, it was too hot. Start again with a teaspoon of ghee. You have 30 g of leaf. You do not have infinite ghee patience if you scorch the first attempt, but you can still eat the nuts.
4. Add the dried leaves. They will hiss. Stir 20–40 seconds until they darken a shade and smell loud. Not 3 minutes. Not "until crispy like a chip." Past that they go bitter.
5. Pull the pan. Pour leaves, ghee, and seeds over the bowl. Toss. Eat. Do not plate it like a restaurant. It is a finals bowl.

If you want a written dal version of the same tempering, that is already here: [30-minute curry leaf dal](/blog/curry-leaves-dahl-recipe-30-minutes-australia-2026). Different meal. Same leaf. This page is the snack.

Pop the corn first, salt it, then tadka. A microwave bag is fine. Roasted salted peanuts from the supermarket are fine. Raw peanuts taste underdone unless you roasted them first. I pack leaf, not peanuts.

## How far 30 g actually goes

A 30 g bag is not a single serve. At about 3 g a pan, that is several games. Week 2 is four matches. The bag outlasts it.

That is why $7 is the unit. You are not buying a one-night garnish. You are buying a pantry tin that still works in October for dal. [Store dried curry leaves](/blog/how-to-store-curry-leaves-fresh-dried-australia-2026) airtight, dark, dry. Not the fridge. Not next to the kettle.

## Posted $7 is not $7 at the door

Locked 30 August 2026: curry leaves **30 g = $7**. Default AU shipping under $49 is **$9.69**. Landed **$16.69**. Pickup by arrangement is **$7**. Free Australia-wide shipping at **AU$49 and above**. Full policy: [Shipping & Returns](/pages/shipping/shipping-returns).

I will not hide the postage. A $7 bag on its own does not clear $49. People get angry when a "cheap snack" becomes $16.69. The maths is on the shipping page. I am repeating it here so you do not have to hunt.

| Cart | Sum | Shipping | Landed |
| --- | ---: | ---: | ---: |
| Curry leaves 30 g, posted | $7.00 | $9.69 | **$16.69** |
| Pickup, curry leaves 30 g | $7.00 | $0 | **$7.00** |
| Curry 30 g + soap 95 g | $14.00 | $9.69 | $23.69 |
| Curry 30 g + Darjeeling 100 g | $14.50 | $9.69 | $24.19 |
| Curry 30 g + 100 g moringa | $18.00 | $9.69 | $27.69 |
| Curry 30 g + 400 g moringa | $42.00 | $9.69 | $51.69 |
| Gift pack only | $35.00 | $9.69 | $44.69 |
| Gift pack + curry 30 g | $42.00 | $9.69 | $51.69 |
| Gift pack + 400 g moringa | $70.00 | $9.69 | $79.69 |
| Gift pack + 400 g + curry 30 g | $77.00 | $9.69 | $86.69 |
| Gift pack + 400 g + 100 g moringa | $81.00 | $0 | **$81.00** |
| Gift pack + 400 g + curry + soap | $84.00 | $0 | **$84.00** |

Gift pack + 400 g + curry is **$77**, so it now qualifies for free Australian shipping. If you only want the leaf, standard shipping applies or pickup is available by arrangement.

Locked singles today: moringa **100 g $11**, **200 g $21.50**, **400 g $35**; curry **30 g $7**; Darjeeling **100 g $7.50**; soap **95 g $7**; gift pack **$35**. Ignore cached $5.50/20 g curry. That size is not the live bag.

## Will it arrive before the match you actually care about

I pack at **15 Europe Street, Truganina VIC 3029**. Dispatch **within 2 business days**. **No Sunday dispatch.** Same-day is **before 2pm on business days**. Typical: **3–4 days** metro and suburban; **up to 10 days** some rural. City pages add local colour. I still do not promise a doorstep date.

A Sunday 30 August order: first possible dispatch **Monday 31 August before 2pm**.

| If you need it for | What I can say | Source |
| --- | --- | --- |
| Pickup, Truganina, before Friday MCG | Call. We set a time. $7. Cash accepted for pickup only. | [Melbourne](/melbourne/) + [FAQ](/faq) |
| Melbourne metro, Friday night | Often 1–3 business days after Monday dispatch. Roughly Tue 1 – Thu 3 Sep. | [Melbourne](/melbourne/) |
| Sydney metro, Saturday SCG | Most postcodes 2–4 business days. Roughly Wed 2 – Fri 4 Sep. | [Sydney](/moringa-sydney/) |
| Brisbane / Gold Coast, Saturday | Usually 2–4 business days. | [Brisbane](/moringa-brisbane/) |
| Adelaide metro, Saturday night | Same 3–4 day shipping-page band. Do not cut it to Friday. | [Shipping](/pages/shipping/shipping-returns) |
| Perth metro, Thursday Optus | Typically 3–5 business days. Regional WA 6–9. Thursday 3 Sep is the optimistic end of that band, not a booking. | [Perth](/moringa-perth/) |
| Rural AU | Up to 10 days. Do not use this bag as a Thursday surprise. | Shipping page |

Thursday Freo from a Sunday click is the tight one. I would rather you read that now than email me at 7pm AWST on Thursday. Friday MCG from Melbourne pickup is easy if you call. Saturday games have more room if Monday dispatch actually happens. Rural and regional WA: watch the match, cook later, or buy leaf locally if you have a shop that still has it.

Returns: **7 days**, unopened packs. Original shipping is not refunded. Visa, Mastercard, PayPal, bank transfer; **cash for Truganina pickup only**.

## Who this is for, and who should open a packet of pies

**For:** someone already watching at home with a bowl. A household that will eat peanuts or popcorn anyway. A cook who has wanted dried kari leaf and kept not ordering it. Melbourne pickup this week. Interstate, if a tracked food parcel arriving mid-week is enough and you are not treating Thursday Optus as a guaranteed delivery window.

**Not for:** anyone who needs a certified-organic logo. I do not have one. **Not for:** a medical "heart-healthy finals platter." Food leaf. Not TGA-listed. I am not a health professional. **Not for:** people who wanted curry powder. **Not for:** a packed MCG bag search. They will confiscate your tadka pan. Eat at home. **Not for:** rural WA if it must be in the house before Thursday. Use the 10-day rural figure and pick a later match, or pickup if you can get to Truganina.

If the brief is "something for dad on Sunday 6 September," that is the [gift pack post](/blog/fathers-day-gift-under-40), not this snack. Father's Day and Week 2 overlap on the calendar. They are different SKUs.

## What this snack is not

Not party pies. Not a $159 hamper. Not beer. Not a TGA medicine. Not an immunity, metabolism, antioxidant, "boost," cholesterol, or skin-treatment product. Not a Chemist Warehouse greens tin. That piece is Monday's job.

What it is: 30 g dried kari leaf, packed by me, Neer, ABN **32 639 442 616**, **15 Europe Street, Truganina VIC 3029**. Whole leaf. Shade-dried. [$7](/products/curry-leaves/). Who I am: [About](/about).

## How to use it beyond one Thursday

You do not have to wait for a bounce. The same bag is the tempering on [dal](/blog/curry-leaves-dahl-recipe-30-minutes-australia-2026), potatoes, scrambled eggs, and fried fish. [How to use dried curry leaves in Australian cooking](/blog/curry-leaves-in-australian-cooking-how-to-use-2026) is the longer kitchen page. [The buy/store/use guide](/blog/dried-curry-leaves-australia-guide) is the pantry page. This URL is the September timing.

If the leaves smell like dust, they are tired. If they smell like a citrus hedge in ghee, they are still working. Mustard seeds and chilli are optional. Neutral oil works if you do not keep ghee. Butter browns too fast for a first attempt at 8.05pm. The sound is the teacher: leaves should shout, then quiet. If the pan is smoking, dump the fat and restart. A 30 g bag can absorb one mistake, not five.

## FAQ

**When does AFL finals Week 2 start in 2026?**
Thursday 3 September 2026. AFL.com.au: Fremantle v Hawthorn at Optus Stadium, 8.10pm AEST. Friday Geelong v Carlton at the MCG, 7.40pm. Saturday Sydney v Brisbane at the SCG, 3.15pm, then Adelaide v Western Bulldogs at Adelaide Oval, 7.35pm AEST.

**If I order today (Sunday), will it arrive for Thursday night in Perth?**
No Sunday dispatch. Monday 31 August before 2pm is the first pack. Perth metro typically 3–5 business days. That can be Thursday 3 through Monday 7 September. Thursday night is the optimistic edge. I do not invent a guaranteed date. Pickup in Melbourne is the date I can actually keep.

**Will it arrive in time for Friday at the MCG if I live in Melbourne?**
Often yes if Monday dispatch happens, on the Melbourne page's 1–3 business day band. Pickup is cleaner. Call.

**What is in the bag?**
30 g whole dried kari leaf (*Murraya koenigii*). SKU NT-CL-30G. $7. [Product page](/products/curry-leaves/).

**Is it organic?**
No.

**Is it a medicine?**
No. Cooking leaf. Statements have not been evaluated by the TGA. I do not sell it to treat disease. This page does not make heart-health claims.

**Is it curry powder?**
No.

**Can I pick up in Truganina?**
Yes, **by arrangement**. 15 Europe Street, Truganina VIC 3029. Cash for pickup only. Call [+61 438 201 419](tel:+61438201419) or email [nutrithrive0@gmail.com](mailto:nutrithrive0@gmail.com) first.

**What does it cost with shipping?**
$7 + $9.69 = **$16.69** if the order is under $49. Free shipping at **$49+**. Pickup is $7.

**What is the return policy?**
7 days from delivery, unopened packs. Original shipping is not refunded. Policy: [Shipping & Returns](/pages/shipping/shipping-returns).

**Do you dispatch on Sunday?**
No. Same-day dispatch is before 2pm on business days. A Saturday or Sunday order waits for Monday.

## Order the leaf, or call me

[Dried curry leaves, 30 g, $7](/products/curry-leaves/). I pack it in Truganina. Phone **[+61 438 201 419](tel:+61438201419)**. Email **[nutrithrive0@gmail.com](mailto:nutrithrive0@gmail.com)**. If you are in Melbourne and you want it before Friday night, do not hope a courier invents a shortcut. Call. We set a pickup time.

Pies are still pies. This is a pan of leaf and ghee. Week 2 starts Thursday. The bag is on the shelf here today.
"""

BODY_TAIL = """
<p style="margin-top:2rem; font-style:italic; color:#555;"><em>Written by Neer. NutriThrive Australia.</em></p>
<p class="nt-disclaimer"><em>These statements have not been evaluated by the TGA. This content is general information only, not medical advice. Food products are not intended to diagnose, treat, cure, or prevent any disease.</em></p>

<div class="nt-article-cta">
<h3>Order dried curry leaves — $7 / 30g</h3>
<p>Whole kari leaf, packed in Truganina. Posted $7 + $9.69 under $49, or pickup by arrangement. Same-day dispatch before 2pm on business days.</p>
<div class="btn-row">
<a class="btn-solid" href="/products/curry-leaves/">Shop curry leaves — $7</a>
<a class="btn-outline" href="/pages/shipping/shipping-returns">Shipping &amp; returns</a>
</div>
</div>

<p style="margin-top: 1rem;"><a href="/blog/">&larr; Back to all articles</a></p>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul><li><strong>30 Aug 2026:</strong> Published for AFL finals Week 2 2026 (from Thu 3 Sep).</li></ul>
</div>
<section class="nt-related-links-block">
<h2>Related guides</h2>
<ul>
<li><a href="/products/curry-leaves/">Shop dried curry leaves</a></li>
<li><a href="/blog/curry-leaves-dahl-recipe-30-minutes-australia-2026">30-minute curry leaf dal</a></li>
<li><a href="/blog/dried-curry-leaves-australia-guide">Dried curry leaves buy &amp; store guide</a></li>
<li><a href="/blog/fresh-vs-dried-curry-leaves-cooking-comparison-2026">Fresh vs dried curry leaves</a></li>
<li><a href="/blog/fathers-day-gift-under-40">Father's Day gift under $40</a></li>
<li><a href="/melbourne/">Melbourne delivery &amp; pickup</a></li>
</ul>
</section>
"""


def md_to_html(md: str) -> str:
    html = mistune.html(md.strip() + "\n")
    html = html.replace("https://nutrithrive.com.au", "")
    html = html.replace("<table>", '<table class="nt-comparison-table">')
    return html


def wrap_answer_box(html: str) -> str:
    m = re.search(r"<p>(.*?)</p>", html, re.S)
    if not m:
        return html
    rest = html[m.end() :]
    box = (
        '<div class="answer-box">\n'
        "<h2>Quick Answer</h2>\n"
        f'<p style="margin:0;">{m.group(1)}</p>\n'
        "</div>\n"
    )
    return box + rest


def main() -> None:
    words = len(re.findall(r"\b[\w']+\b", BODY_MD))
    print(f"Body word count: {words}")
    print(f"Title {len(TITLE)} / H1 {len(H1)} / Meta {len(META)}")

    body_html = wrap_answer_box(md_to_html(BODY_MD)) + BODY_TAIL

    faq_ld = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": a},
            }
            for q, a in FAQS
        ],
    }
    blog_posting = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": TITLE,
        "description": META,
        "author": {
            "@type": "Person",
            "@id": "https://nutrithrive.com.au/#person-neer",
            "name": "Neer",
        },
        "publisher": {
            "@type": "Organization",
            "name": "NutriThrive",
            "logo": {
                "@type": "ImageObject",
                "url": "https://nutrithrive.com.au/assets/images/logo/logo-112.png",
            },
        },
        "datePublished": DATE,
        "dateModified": DATE,
        "image": OG,
        "mainEntityOfPage": {"@type": "WebPage", "@id": URL},
    }
    recipe_ld = {
        "@context": "https://schema.org",
        "@type": "Recipe",
        "name": "Curry-leaf tadka over nuts or popcorn",
        "description": "Dried kari leaf fried in ghee and poured over peanuts or popcorn. A finals-week snack from Truganina.",
        "author": {"@type": "Person", "name": "Neer"},
        "recipeYield": "1 bowl",
        "prepTime": "PT5M",
        "cookTime": "PT5M",
        "totalTime": "PT10M",
        "recipeIngredient": [
            "1–2 tsp ghee",
            "2–4 g dried kari leaf (Murraya koenigii)",
            "Optional: 1/2 tsp mustard seeds",
            "2–3 cups salted roasted peanuts, mixed nuts, or popped corn",
        ],
        "recipeInstructions": [
            {"@type": "HowToStep", "text": "Put nuts or popcorn in a wide serving bowl next to the stove."},
            {"@type": "HowToStep", "text": "Heat ghee over medium-high until loose and nutty, not smoking."},
            {"@type": "HowToStep", "text": "Optional: add mustard seeds and wait until they pop, about 10 seconds."},
            {"@type": "HowToStep", "text": "Add dried curry leaves. Stir 20–40 seconds until fragrant and a shade darker."},
            {"@type": "HowToStep", "text": "Pour leaves and ghee over the bowl. Toss and serve."},
        ],
    }
    breadcrumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://nutrithrive.com.au/"},
            {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://nutrithrive.com.au/blog/"},
            {"@type": "ListItem", "position": 3, "name": "Recipes", "item": CATEGORY_HREF},
            {"@type": "ListItem", "position": 4, "name": TITLE, "item": URL},
        ],
    }

    html = f"""<!DOCTYPE html>
<html class="scroll-smooth" lang="en-AU">
<head>
<link rel="icon" type="image/png" sizes="48x48" href="/assets/images/logo/favicon-48.png">
<link rel="icon" href="/assets/images/logo/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="96x96" href="/assets/images/logo/favicon-96.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/images/logo/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileImage" content="/assets/images/logo/apple-touch-icon.png">
<meta name="msapplication-TileColor" content="#0f6b4d">
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<link rel="preload" as="image" href="{HERO}" fetchpriority="high"/>
<title>{TITLE}</title>
<script>
 window.dataLayer = window.dataLayer || [];
 function gtag(){{dataLayer.push(arguments);}}
 if (window.DeferLoader) {{
 window.DeferLoader.deferUntilInteraction(function() {{
 window.DeferLoader.loadScript('https://www.googletagmanager.com/gtag/js?id=G-WH21SW75WP', {{
 async: true, crossorigin: 'anonymous'
 }}).then(function() {{
 gtag('js', new Date());
 gtag('config', 'G-WH21SW75WP', {{'anonymize_ip': true, 'allow_google_signals': false}});
 }}).catch(function(err) {{ console.warn('[GA] Failed to load:', err); }});
 }}, {{ once: true, passive: true }});
 }} else {{
 window.addEventListener('load', function() {{
 var s = document.createElement('script');
 s.async = true;
 s.src = 'https://www.googletagmanager.com/gtag/js?id=G-WH21SW75WP';
 s.crossOrigin = 'anonymous';
 document.head.appendChild(s);
 gtag('js', new Date());
 gtag('config', 'G-WH21SW75WP', {{'anonymize_ip': true, 'allow_google_signals': false}});
 }});
 }}
</script>
<meta name="robots" content="index, follow"/>
<link rel="canonical" href="{URL}"/>
<link rel="alternate" type="text/plain" href="https://nutrithrive.com.au/llms.txt" title="LLMs.txt">
<link rel="alternate" hreflang="en-AU" href="{URL}"/>
<link rel="alternate" hreflang="x-default" href="{URL}"/>
<meta name="description" content="{META}"/>
<meta name="author" content="NutriThrive Australia"/>
<meta property="og:type" content="article"/>
<meta property="og:url" content="{URL}"/>
<meta property="og:title" content="{TITLE}"/>
<meta property="og:description" content="{META}"/>
<meta property="og:image" content="{OG}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:site_name" content="NutriThrive Australia"/>
<meta property="og:locale" content="en_AU"/>
<meta property="article:published_time" content="{DATE}T00:00:00+10:00"/>
<meta property="article:modified_time" content="{DATE}T00:00:00+10:00"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:url" content="{URL}"/>
<meta name="twitter:title" content="{TITLE}"/>
<meta name="twitter:description" content="{META}"/>
<meta name="twitter:image" content="{OG}"/>
<script type="application/ld+json">{json.dumps(blog_posting, ensure_ascii=False, separators=(",", ":"))}</script>
<script type="application/ld+json">{json.dumps(breadcrumbs, ensure_ascii=False, separators=(",", ":"))}</script>
<script type="application/ld+json">{json.dumps(faq_ld, ensure_ascii=False, separators=(",", ":"))}</script>
<script type="application/ld+json">{json.dumps(recipe_ld, ensure_ascii=False, separators=(",", ":"))}</script>
<meta name="theme-color" content="#0f6b4d"/>
<link rel="preconnect" href="https://www.googletagmanager.com"/>
<link rel="dns-prefetch" href="https://www.redditstatic.com"/>
<link rel="stylesheet" href="/shared/css/blog-critical.min.css"/>
<link rel="preload" href="/assets/fonts/plus-jakarta-sans-400.woff2" as="font" type="font/woff2" crossorigin/>
<link rel="preload" href="/shared/css/fonts-local.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
<noscript><link rel="stylesheet" href="/shared/css/fonts-local.min.css"/></noscript>
<link rel="preload" href="/assets/css/design-system.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
<noscript><link rel="stylesheet" href="/assets/css/design-system.min.css"/></noscript>
<link rel="preload" href="/styles/global/style.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
<noscript><link rel="stylesheet" href="/styles/global/style.min.css"/></noscript>
<link rel="preload" href="/assets/css/tailwind-v2.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
<noscript><link rel="stylesheet" href="/assets/css/tailwind-v2.min.css"/></noscript>
<link rel="preload" href="/blog/blog-v2-prose.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
<noscript><link rel="stylesheet" href="/blog/blog-v2-prose.min.css"/></noscript>
<link rel="preload" href="/shared/css/v2-extra.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
<noscript><link rel="stylesheet" href="/shared/css/v2-extra.min.css"/></noscript>
<link rel="stylesheet" href="/shared/css/author-bio.min.css" media="print" onload="this.media='all'"/><noscript><link rel="stylesheet" href="/shared/css/author-bio.min.css"/></noscript>
<script>(function(){{var b=document.body;if(!b||!b.classList.contains('nt-blog-article')&&!b.classList.contains('nt-blog-index'))return;var loaded=function(){{b.classList.add('fonts-loaded')}};if(!document.fonts||!document.fonts.load){{loaded();return}}Promise.all([document.fonts.load('400 1em \\"Plus Jakarta Sans\\"'),document.fonts.load('600 1em \\"Plus Jakarta Sans\\"')]).then(loaded).catch(loaded)}})();</script>
</head>
<body class="bg-background text-on-background font-body-md overflow-x-hidden nt-blog-article">
<div class="nt-sticky-top">
<header id="nt-header" class="nt-v2-header"></header>
</div>
<nav class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-4 pb-2 text-label-sm" aria-label="Breadcrumb">
<ol class="flex flex-wrap items-center gap-1 list-none m-0 p-0"><li><a class="text-moringa-leaf hover:underline" href="/">Home</a></li><li class="text-on-surface-variant" aria-hidden="true">&#x203A;</li><li><a class="text-moringa-leaf hover:underline" href="/blog/">Blog</a></li><li class="text-on-surface-variant" aria-hidden="true">&#x203A;</li><li class="text-on-surface" aria-current="page">{TITLE}</li></ol>
</nav>
<main class="pt-6 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop nt-blog-main">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
<article class="lg:col-span-8">
<header class="mb-12">
<div class="flex flex-wrap items-center gap-2 mb-4">
<span class="bg-primary-fixed/30 text-moringa-leaf px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider font-bold">{CATEGORY}</span>
<span class="text-on-surface-variant text-label-lg font-body-md">{DATE_DISPLAY}</span>
<span class="text-on-surface-variant text-label-lg font-body-md">&#183; {MIN_READ}</span>
</div>
<h1 class="font-display text-headline-lg md:text-display text-forest-deep mb-4 leading-tight">{H1}</h1>
<p class="text-on-surface-variant text-body-md mb-8"><strong>By Neer, NutriThrive Truganina</strong> &#183; Last updated: {DATE_DISPLAY}</p>
<div class="w-full aspect-[16/9] rounded-xl overflow-hidden mb-12 shadow-sm bg-surface-container">
<img alt="Dried curry leaves (kari leaf) packed in Truganina — tadka over snacks for AFL finals" class="w-full h-full object-cover" src="{HERO}" width="1200" height="630" loading="eager" decoding="async" fetchpriority="high"/>
</div>
</header>
<div class="blog-v2-prose max-w-none">
{body_html}
</div>
</article>
<aside class="lg:col-span-4 space-y-12">
<div class="bg-pure-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden nt-blog-sidebar-promo">
<div class="aspect-square bg-surface-container relative">
<img alt="NutriThrive dried curry leaves — $7 / 30g" class="w-full h-full object-cover" src="{HERO}" loading="lazy" width="600" height="600"/>
<div class="absolute top-4 right-4 bg-moringa-leaf text-pure-white px-3 py-1 rounded-lg text-label-sm font-label-sm">AFL finals</div>
</div>
<div class="p-6">
<h4 class="font-headline-md text-headline-md text-forest-deep mb-2">Curry leaves — $7</h4>
<p class="text-on-surface-variant font-body-md text-body-md mb-4">30g whole dried kari leaf. Fry in ghee over nuts or popcorn. Packed in Truganina.</p>
<div class="nt-blog-sidebar-price flex items-baseline gap-1 mb-2">
<span class="text-2xl font-bold text-moringa-leaf">$7.00</span>
<span class="text-sm text-on-surface-variant">/30g</span>
</div>
<p class="text-body-sm text-on-surface-variant mb-6">Posted +$9.69 under $49 · Pickup $7</p>
<a class="block w-full text-center bg-moringa-leaf text-pure-white py-4 rounded-lg font-label-lg text-label-lg hover:scale-[1.02] transition-transform" href="/products/curry-leaves/">Shop curry leaves →</a>
</div>
</div>
<div class="nt-ad-slot nt-ad-slot--sidebar" data-ad-slot="sidebar" data-nt-ad-promo></div>
</aside>
</div>
</main>
<div id="nt-footer"></div>
<script src="/scripts/global/reddit-pixel.min.js" defer></script>
<script src="/shared/site-data.min.js" defer></script>
<script src="/scripts/global/cart.min.js" defer></script>
<script src="/shared/js/cart-v2-ui.min.js" defer></script>
<script src="/shared/js/footer-v2.min.js" defer></script>
<script src="/shared/js/author-bio.min.js" defer></script>
<script>(function(){{function loadLayout(){{var s=document.createElement('script');s.src='/shared/js/layout-v2.min.js';s.defer=true;document.body.appendChild(s)}}if(document.readyState==='complete'){{loadLayout()}}else{{window.addEventListener('load',loadLayout,{{once:true}})}}}})();</script><script src="/shared/js/v2-site.min.js" defer></script>
<script src="/scripts/global/defer-loader.min.js" defer></script>
</body>
</html>
"""
    OUT.write_text(html, encoding="utf-8")
    print(f"Wrote {OUT.name} ({len(html):,} bytes)")


if __name__ == "__main__":
    main()
