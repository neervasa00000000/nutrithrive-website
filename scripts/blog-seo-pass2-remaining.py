#!/usr/bin/env python3
"""Pass 2: only remaining fixes from the 66-page plan — skip already-rewritten posts."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / "blog"
REDIRECTS = ROOT / "_redirects"

# Already rewritten in pass 1 — do not touch titles/body
SKIP_SLUGS = {
    "moringa-patches-australia-review-do-they-work",
    "moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025",
    "moringa-and-berberine-australia-what-science-says-2026",
    "grow-moringa-tree-australia",
    "rosabella-moringa-reviews-legit-or-overhyped-2026",
    "curry-leaves-substitute-what-to-use-2026",
    "how-long-does-moringa-powder-last-storage-shelf-life-2026",
    "moringa-vs-coffee-melbourne-energy-hack",
    "science-shade-drying-vs-sun-drying-moringa",
    "how-to-choose-moringa-powder-australia-2026",
    "where-to-buy-moringa-in-australia-online-vs-stores-2026-guide",
    # title already set in pass 1; we only add gut H2
}


def set_title_meta_h1(html: str, title: str, meta: str, h1: str | None = None) -> str:
    html = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", html, count=1, flags=re.S)
    html = re.sub(r'(<meta name="description" content=")[^"]*(")', rf"\g<1>{meta}\2", html, count=1)
    for prop in ("og:title", "twitter:title"):
        html = re.sub(
            rf'(<meta (?:property|name)="{prop}" content=")[^"]*(")',
            rf"\g<1>{title}\2",
            html,
            count=1,
        )
    for prop in ("og:description", "twitter:description"):
        html = re.sub(
            rf'(<meta (?:property|name)="{prop}" content=")[^"]*(")',
            rf"\g<1>{meta}\2",
            html,
            count=1,
        )
    if h1:
        html = re.sub(r"(<h1\b[^>]*>).*?(</h1>)", rf"\g<1>{h1}\2", html, count=1, flags=re.S)
    return html


def ensure_answer_first(html: str, answer_html: str) -> str:
    """Insert a one-line answer box after H1 area if not already present."""
    if 'class="nt-direct-answer"' in html or "nt-direct-answer" in html:
        return html
    block = (
        f'<p class="nt-direct-answer" style="margin:0 0 1.25rem;padding:0.85rem 1rem;'
        f'background:#f0fdf4;border:1px solid #86efac;border-radius:10px;font-size:0.98rem;'
        f'line-height:1.55;">{answer_html}</p>\n'
    )
    # After header closing / before first answer-box or prose content
    if '<div class="answer-box">' in html:
        return html.replace('<div class="answer-box">', block + '<div class="answer-box">', 1)
    if '<div class="blog-v2-prose' in html:
        return re.sub(
            r'(<div class="blog-v2-prose[^"]*">\s*)',
            rf"\1{block}",
            html,
            count=1,
        )
    return html


UPDATES = [
    # Cluster 3 — condition pages (titles ≤60, answer-first)
    {
        "slug": "is-moringa-safe-for-children-kids-dosage-2026",
        "title": "Is Moringa Safe for Kids? Dosage Guide for Parents 2026",
        "meta": "Yes — food-level leaf powder doses can be fine for kids. Age-by-age amounts, research notes, and when to ask a GP first.",
        "h1": "Is Moringa Safe for Kids? Dosage Guide for Parents (2026)",
        "answer": "<strong>Quick answer:</strong> Yes at small food-level leaf-powder doses for most children. Use age-appropriate amounts below and ask a GP if your child has a medical condition or takes medicine.",
    },
    {
        "slug": "is-moringa-safe-for-dogs-benefits-dosage-australia-2026",
        "title": "Moringa for Dogs: Safe Dosage &amp; Benefits (Vet-Informed)",
        "meta": "Moringa leaf can be fine for dogs in small amounts. Dosage by weight, mixing tips, and when to skip it — Australia-focused.",
        "h1": "Moringa for Dogs: Safe Dosage &amp; Benefits (Vet-Informed)",
        "answer": "<strong>Quick answer:</strong> Usually yes in small amounts for healthy dogs. Dose by weight, introduce slowly, and ask your vet first if your dog has kidney disease or takes medication.",
    },
    {
        "slug": "moringa-thyroid-hashimotos-hypothyroidism-2026",
        "title": "Moringa and Thyroid: Safe for Hashimoto's? What to Know",
        "meta": "Moringa and thyroid conditions: what is known, the goitrogen question, and when to check with your doctor before using leaf powder.",
        "h1": "Moringa and Thyroid: Safe for Hashimoto's? What to Know",
        "answer": "<strong>Quick answer:</strong> Caution — evidence is limited. Food-level leaf powder is often discussed as lower risk than root/seed, but thyroid medication timing and monitoring belong with your doctor.",
    },
    {
        "slug": "moringa-for-pcos-polycystic-ovary-syndrome-2026",
        "title": "Moringa for PCOS: What the Research Actually Shows",
        "meta": "Moringa and PCOS: what early research suggests, what is unproven in humans, and how it fits a food-first approach — not a cure claim.",
        "h1": "Moringa for PCOS: What the Research Actually Shows",
        "answer": "<strong>Quick answer:</strong> Early research is interesting but not definitive. Moringa is not a PCOS treatment; it may support nutrient intake inside a clinician-guided plan.",
    },
    {
        "slug": "moringa-for-breastfeeding-milk-supply-2026",
        "title": "Moringa for Breastfeeding: Does It Boost Milk Supply?",
        "meta": "Does moringa increase breast milk supply? What studies suggest, typical food-level doses, and when to check with your midwife or GP.",
        "h1": "Moringa for Breastfeeding: Does It Boost Milk Supply?",
        "answer": "<strong>Quick answer:</strong> Some studies and traditional use suggest leaf powder may support milk supply for some people, but results vary. Confirm with your midwife or GP before using it as a galactagogue.",
    },
    {
        "slug": "moringa-pregnancy-safe-australia-trimester-guide-2026",
        "title": "Is Moringa Safe During Pregnancy? The Honest Answer",
        "meta": "Leaf powder in food amounts is often treated cautiously differently from root/seed. Trimester notes for Australia — ask your GP, not TikTok.",
        "h1": "Is Moringa Safe During Pregnancy? The Honest Answer",
        "answer": "<strong>Quick answer:</strong> Caution. Leaf powder in food amounts is discussed differently from root and seed, which are not appropriate. Confirm with your GP or midwife before using any moringa product in pregnancy.",
    },
    {
        "slug": "moringa-for-period-pain-pms-menstrual-health-2026",
        "title": "Moringa for Period Pain &amp; PMS: Does It Help?",
        "meta": "Can moringa ease period pain or PMS? Iron and magnesium context is real; “hormone balancing” claims are overstated. Honest 2026 guide.",
        "h1": "Moringa for Period Pain &amp; PMS: Does It Help?",
        "answer": "<strong>Quick answer:</strong> It may help some people via nutrients like iron and magnesium, but it is not proven period-pain medicine. See a GP for severe pain.",
    },
    {
        "slug": "moringa-side-effects-what-happens-take-too-much-2026",
        "title": "Moringa Side Effects: What Happens If You Take Too Much",
        "meta": "Moringa side effects are usually mild at food doses — nausea or loose stools if you overdo it. Safe ranges, interactions, and when to stop.",
        "h1": "Moringa Side Effects: What Happens If You Take Too Much",
        "answer": "<strong>Quick answer:</strong> At food-level doses most people tolerate leaf powder well. Too much can cause digestive upset. Root/seed and high extracts are a different risk profile — avoid those without clinical guidance.",
    },
    # Cluster 2 — comparisons still live (not redirected)
    {
        "slug": "moringa-vs-ashwagandha-comparison-2026",
        "title": "Moringa vs Ashwagandha: Which Should You Take?",
        "meta": "Moringa is a nutrient-dense leaf; ashwagandha is an adaptogen for stress. Different jobs — when to pick each, and when both can fit.",
        "h1": "Moringa vs Ashwagandha: Which Should You Take?",
    },
    {
        "slug": "moringa-vs-whey-protein-comparison-2026",
        "title": "Moringa vs Whey Protein: Which Wins for Aussies?",
        "meta": "Moringa has less protein per serve than whey but zero dairy and no bloat for many people. Gram-for-gram comparison for Australian gym-goers.",
        "h1": "Moringa vs Whey Protein: Which Wins for Aussies?",
    },
    {
        "slug": "ag1-alternative-australia-moringa-comparison-2026",
        "title": "AG1 Alternative Australia: Is Moringa Worth It vs AG1?",
        "meta": "AG1 can run ~$99+/month in Australia. Here's the price-per-serve gap vs moringa leaf powder — what you gain and what you lose switching.",
        "h1": "AG1 Alternative Australia: Is Moringa Worth It vs AG1?",
    },
    # Cluster 4
    {
        "slug": "moringa-calm-mind-stress-brain-fog-cortisol-science-2026",
        "title": "Moringa for Stress &amp; Brain Fog: What the Science Says",
        "meta": "Can moringa help stress and brain fog? What research actually shows on cortisol and focus — separated from wellness-trend hype.",
        "h1": "Moringa for Stress &amp; Brain Fog: What the Science Says",
    },
    # Cluster 5
    {
        "slug": "moringa-before-after-workout-timing-guide-2026",
        "title": "Moringa Before or After Workout? The Timing Guide",
        "meta": "Best time to take moringa around training: iron and antioxidant context, what timing actually changes, and what it will not do as a stim.",
        "h1": "Moringa Before or After Workout? The Timing Guide",
    },
    {
        "slug": "natural-pre-workout-moringa-australia-2026",
        "title": "Natural Pre-Workout Australia: Why Moringa Beats Stims",
        "meta": "Looking for a natural pre-workout in Australia? How caffeine-free moringa compares to stim stacks — and when coffee still wins.",
        "h1": "Natural Pre-Workout Australia: Why Moringa Beats Stims",
    },
    # Cluster 6
    {
        "slug": "fresh-vs-dried-curry-leaves-cooking-comparison-2026",
        "title": "Fresh vs Dried Curry Leaves: What Actually Changes",
        "meta": "Fresh or dried curry leaves — flavour, shelf life, and when each wins in Australian kitchens. Swap ratios included.",
        "h1": "Fresh vs Dried Curry Leaves: What Actually Changes",
    },
    {
        "slug": "curry-leaves-heart-health-cholesterol-evidence-2026",
        "title": "Curry Leaves for Heart Health &amp; Cholesterol: Evidence",
        "meta": "Curry leaves and heart markers: what studies show on cholesterol and triglycerides — and what cooking with leaves can realistically do.",
        "h1": "Curry Leaves for Heart Health &amp; Cholesterol: The Evidence",
    },
    {
        "slug": "curry-leaves-tea-how-to-make-benefits-2026",
        "title": "How to Make Curry Leaf Tea (+ Real Benefits)",
        "meta": "How to make curry leaf tea with fresh or dried leaves — and what’s known vs assumed about digestion and everyday use.",
        "h1": "How to Make Curry Leaf Tea (+ Real Benefits)",
    },
    # Cluster 7
    {
        "slug": "darjeeling-tea-vs-english-breakfast-comparison-2026",
        "title": "Darjeeling vs English Breakfast Tea: What's Different",
        "meta": "Darjeeling vs English Breakfast: both black teas, very different cups. Flavour, strength, caffeine, and when to drink each.",
        "h1": "Darjeeling vs English Breakfast Tea: What's the Difference",
    },
    {
        "slug": "how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026",
        "title": "How Much Caffeine in Darjeeling Tea? (~50mg Guide)",
        "meta": "Darjeeling black tea is roughly 45–55mg caffeine per cup — about half of coffee (~90–95mg). Exact comparison vs coffee and green tea.",
        "h1": "How Much Caffeine Is in Darjeeling Tea? (vs Coffee &amp; Green Tea)",
        "answer": "<strong>Quick answer:</strong> About <strong>45–55mg caffeine per 8oz cup</strong> of Darjeeling black tea, versus roughly <strong>90–95mg</strong> for brewed coffee and typically less for many green teas.",
    },
    {
        "slug": "how-to-brew-darjeeling-tea-perfectly-2026",
        "title": "How to Brew Darjeeling Tea Perfectly (90–95°C, 3–4 min)",
        "meta": "Brew Darjeeling at 90–95°C for 3–4 minutes. Water temperature, steep time, and the mistake that turns a first flush bitter.",
        "h1": "How to Brew Darjeeling Tea Perfectly (Temperature &amp; Time)",
        "answer": "<strong>Quick answer:</strong> Heat water to about <strong>90–95°C</strong> (not a rolling boil for delicate first flush) and steep <strong>3–4 minutes</strong>. Taste at 3 minutes; oversteeping turns it astringent.",
    },
    # High CTR-gap extras still live
    {
        "slug": "how-to-add-moringa-to-diet",
        "title": "5 Easy Ways to Add Moringa to Your Diet (2026)",
        "meta": "Five simple ways to add moringa powder daily without the grassy taste — smoothies, meals, and easy swaps for Australian kitchens.",
        "h1": "5 Easy Ways to Add Moringa to Your Diet",
    },
    {
        "slug": "what-does-moringa-powder-taste-like-honest-guide-2026",
        "title": "What Does Moringa Powder Taste Like? Honest Answer",
        "meta": "Moringa tastes earthy — like warm hay or split peas, not a sweet green smoothie. What to expect and four ways to mask it.",
        "h1": "What Does Moringa Powder Taste Like? Honest Answer",
        "answer": "<strong>Quick answer:</strong> Earthy and slightly bitter — closer to warm hay or split peas than matcha sweetness. Most people mask it in smoothies, yoghurt, or sauces.",
    },
]


def update_redirects() -> None:
    text = REDIRECTS.read_text()
    block = """
# === Pass 2 remaining consolidations (Aug 2026 full 66-page plan) ===
/blog/everything-about-moringa-2025-faq.html /blog/how-to-choose-moringa-powder-australia-2026 301!
/blog/everything-about-moringa-2025-faq /blog/how-to-choose-moringa-powder-australia-2026 301!
/blog/moringa-powder-ultimate-superfood-guide-australian-health-2025.html /blog/how-to-choose-moringa-powder-australia-2026 301!
/blog/moringa-powder-ultimate-superfood-guide-australian-health-2025 /blog/how-to-choose-moringa-powder-australia-2026 301!
# Clean-protein dated URLs → whey comparison (protein stacking angle; protein pillar HTML already retired)
/blog/best-clean-protein-powders-moringa-products-australia-2025.html /blog/moringa-vs-whey-protein-comparison-2026 301!
/blog/best-clean-protein-powders-moringa-products-australia-2025 /blog/moringa-vs-whey-protein-comparison-2026 301!
"""
    if "Pass 2 remaining consolidations" not in text:
        text = text.rstrip() + "\n" + block + "\n"

    # Improve equity: vague 410s → 301 into 3-way comparison (already the consolidation home)
    swaps = [
        (
            "/blog/best-clean-protein-powders-moringa-products-australia-2026 /404.html 410\n"
            "/blog/best-clean-protein-powders-moringa-products-australia-2026.html /404.html 410",
            "/blog/best-clean-protein-powders-moringa-products-australia-2026.html /blog/moringa-vs-whey-protein-comparison-2026 301!\n"
            "/blog/best-clean-protein-powders-moringa-products-australia-2026 /blog/moringa-vs-whey-protein-comparison-2026 301!",
        ),
        (
            "/blog/plant-based-functional-foods-australia-wellness-nutrithrive-2026.html /404.html 410\n"
            "/blog/plant-based-functional-foods-australia-wellness-nutrithrive-2026 /404.html 410",
            "/blog/plant-based-functional-foods-australia-wellness-nutrithrive-2026.html /blog/moringa-vs-spirulina-vs-matcha-comparison-australia 301!\n"
            "/blog/plant-based-functional-foods-australia-wellness-nutrithrive-2026 /blog/moringa-vs-spirulina-vs-matcha-comparison-australia 301!",
        ),
        (
            "/blog/australian-superfood-revolution-moringa-precision-nutrition-2026.html /404.html 410\n"
            "/blog/australian-superfood-revolution-moringa-precision-nutrition-2026 /404.html 410",
            "/blog/australian-superfood-revolution-moringa-precision-nutrition-2026.html /blog/moringa-vs-spirulina-vs-matcha-comparison-australia 301!\n"
            "/blog/australian-superfood-revolution-moringa-precision-nutrition-2026 /blog/moringa-vs-spirulina-vs-matcha-comparison-australia 301!",
        ),
    ]
    for old, new in swaps:
        if old in text:
            text = text.replace(old, new, 1)
            print("Swapped 410→301:", old.split("\n")[0][:70])
        else:
            # try reversed order of the two lines
            print("Skip swap (not found):", old.split("\n")[0][:70])

    REDIRECTS.write_text(text if text.endswith("\n") else text + "\n")
    print("Redirects updated")


GUT_H2 = """
<h2 id="gut-health">Which Is Best for Gut Health?</h2>
<p>None of the three is a gut “cure.” For everyday gut support, fibre and polyphenols matter more than brand marketing. <strong>Moringa leaf</strong> contributes fibre and plant compounds studied mainly for metabolic and antioxidant endpoints. <strong>Spirulina</strong> is low-fibre and more of a micronutrient concentrate. <strong>Matcha</strong> brings catechins with a caffeine load. If gut comfort is the goal, start with overall diet fibre (vegetables, legumes, whole grains) and treat these powders as optional add-ons — not a replacement for food diversity. For a broader fibre context, see our gut-health guides on the blog.</p>
"""


def add_gut_h2() -> None:
    path = BLOG / "moringa-vs-spirulina-vs-matcha-comparison-australia.html"
    t = path.read_text()
    if 'id="gut-health"' in t:
        print("Gut H2 already present")
        return
    # Insert before FAQ if possible
    if "<h2>FAQ</h2>" in t:
        t = t.replace("<h2>FAQ</h2>", GUT_H2 + "\n<h2>FAQ</h2>", 1)
    elif re.search(r"<h2[^>]*>FAQ", t):
        t = re.sub(r"(<h2[^>]*>FAQ)", GUT_H2 + r"\n\1", t, count=1)
    else:
        t = t.replace("</div>\n</article>", GUT_H2 + "\n</div>\n</article>", 1)
    path.write_text(t)
    print("Added gut-health H2 to 3-way comparison")


def apply_updates() -> None:
    for u in UPDATES:
        slug = u["slug"]
        if slug in SKIP_SLUGS:
            print("SKIP (pass1)", slug)
            continue
        path = BLOG / f"{slug}.html"
        if not path.exists():
            print("MISSING", slug)
            continue
        html = path.read_text()
        plain = u["title"].replace("&amp;", "&")
        if len(plain) > 60:
            print(f"WARN title {len(plain)}: {slug}")
        if len(u["meta"]) > 155:
            print(f"WARN meta {len(u['meta'])}: {slug}")
        html = set_title_meta_h1(html, u["title"], u["meta"], u.get("h1"))
        if u.get("answer"):
            html = ensure_answer_first(html, u["answer"])
        # bump modified date lightly if present
        html = re.sub(
            r'(article:modified_time" content=")[^"]+',
            r"\g<1>2026-08-02T00:00:00+10:00",
            html,
            count=1,
        )
        path.write_text(html)
        print(f"OK {slug} T={len(plain)} M={len(u['meta'])}")


def main() -> None:
    update_redirects()
    apply_updates()
    add_gut_h2()
    print("PASS2 DONE")


if __name__ == "__main__":
    main()
