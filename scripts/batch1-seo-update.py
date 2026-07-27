#!/usr/bin/env python3
"""Batch 1 SEO metadata updates for zero-click audit."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODIFIED = "2026-07-27T00:00:00+10:00"
MODIFIED_SHORT = "2026-07-27"

BLOG_UPDATES = {
    "curry-leaves-substitute-what-to-use-2026.html": {
        "title": "Curry Leaves Substitute: 7 Options Ranked (2026)",
        "meta": "No curry leaves? Here are 7 real substitutes ranked by how close they taste, plus what NOT to use. Tested for Australian kitchens.",
        "h1": "Curry Leaves Substitute: What Actually Works (Ranked)",
    },
    "moringa-vs-spirulina-vs-matcha-comparison-australia.html": {
        "title": "Moringa vs Spirulina vs Matcha: 2026 Comparison",
        "meta": "Moringa vs spirulina vs matcha compared on price, taste, and results for Australians. Which superfood actually wins? See the breakdown.",
        "h1": "Moringa vs Spirulina vs Matcha: Which Wins?",
    },
    "what-does-moringa-powder-taste-like-honest-guide-2026.html": {
        "title": "What Does Moringa Powder Taste Like? Honest Answer",
        "meta": 'Moringa tastes earthy and grassy, not "green smoothie" sweet. Here\'s exactly what to expect and 4 ways to mask it if you don\'t love it.',
        "h1": "What Does Moringa Actually Taste Like?",
    },
    "moringa-for-breastfeeding-milk-supply-2026.html": {
        "title": "Moringa for Breastfeeding: Does It Boost Milk Supply?",
        "meta": "Does moringa really increase breast milk supply? Here's what the actual research says, safe dosage, and when to check with your doctor.",
        "h1": "Moringa for Breastfeeding: What the Research Says",
    },
    "curry-leaves-vs-curry-powder-difference-explained-2026.html": {
        "title": "Curry Leaves vs Curry Powder: What's the Difference?",
        "meta": "Curry leaves and curry powder are not the same thing — here's the real difference in flavour, use, and why recipes specify one or the other.",
        "h1": "Curry Leaves vs Curry Powder: Not the Same Thing",
    },
    "moringa-powder-victoria-seniors-joint-health.html": {
        "title": "Moringa for Seniors: Joint Health Guide (Victoria)",
        "meta": "Can moringa help with joint health as you age? A guide for Victorian seniors on dosage, benefits, and what to expect.",
        "h1": "Moringa for Seniors: A Joint Health Guide",
    },
    "fresh-vs-dried-curry-leaves-cooking-comparison-2026.html": {
        "title": "Fresh vs Dried Curry Leaves: Which Should You Cook With?",
        "meta": "Fresh or dried curry leaves — which actually works better in your cooking? Flavour, shelf life, and when each one wins.",
        "h1": "Fresh vs Dried Curry Leaves: Which Wins?",
    },
    "how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026.html": {
        "title": "Darjeeling Tea Caffeine vs Coffee & Green Tea (2026)",
        "meta": "How much caffeine is really in Darjeeling tea compared to coffee and green tea? Here's the direct comparison in mg.",
        "h1": "Darjeeling Tea Caffeine: vs Coffee & Green Tea",
    },
    "moringa-with-vitamin-c-iron-absorption-guide-2026.html": {
        "title": "Moringa, Vitamin C & Iron Absorption: How It Works",
        "meta": "Moringa is high in vitamin C, which helps iron absorb better. Here's how to pair it with iron-rich foods for maximum benefit.",
        "h1": "How Moringa's Vitamin C Boosts Iron Absorption",
    },
    "moringa-for-sleep-quality-insomnia-2026.html": {
        "title": "Moringa for Sleep: Does It Actually Help? (2026)",
        "meta": "Can moringa improve sleep quality? Here's the real evidence, best time to take it, and what it won't do for insomnia.",
        "h1": "Does Moringa Help You Sleep Better?",
    },
    "moringa-for-weight-loss-evidence-2026.html": {
        "title": "Moringa for Weight Loss: What Evidence Actually Shows",
        "meta": "Does moringa help with weight loss? Real evidence, not hype — what it can and can't do, and how to use it if you're trying.",
        "h1": "Moringa for Weight Loss: The Honest Evidence",
    },
    "darjeeling-tea-health-benefits-research-2026.html": {
        "title": "Darjeeling Tea Health Benefits: What Research Shows",
        "meta": "Darjeeling tea's real health benefits, backed by research — antioxidants, heart health, and how it compares to green tea.",
        "h1": "Darjeeling Tea Health Benefits: The Research",
    },
}


def html_escape(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def update_blog_file(path: Path, data: dict) -> None:
    content = path.read_text(encoding="utf-8")
    title = data["title"]
    meta = data["meta"]
    h1 = data["h1"]
    esc_title = html_escape(title)
    esc_meta = html_escape(meta)
    esc_h1 = html_escape(h1)

    content = re.sub(r"<title>[^<]*</title>", f"<title>{esc_title}</title>", content, count=1)
    content = re.sub(
        r'<meta name="description" content="[^"]*"',
        f'<meta name="description" content="{esc_meta}"',
        content,
        count=1,
    )

    for pattern in (
        r'<meta property="og:title" content="[^"]*"',
        r'<meta content="[^"]*" property="og:title"',
        r'<meta name="twitter:title" content="[^"]*"',
        r'<meta content="[^"]*" property="twitter:title"',
    ):
        if "og:title" in pattern:
            repl = f'<meta property="og:title" content="{esc_title}"'
            content = re.sub(r'<meta property="og:title" content="[^"]*"', repl, content, count=1)
            content = re.sub(
                r'<meta content="[^"]*" property="og:title"',
                f'<meta content="{esc_title}" property="og:title"',
                content,
                count=1,
            )
        if "twitter:title" in pattern:
            content = re.sub(
                r'<meta content="[^"]*" property="twitter:title"',
                f'<meta content="{esc_title}" property="twitter:title"',
                content,
                count=1,
            )
            content = re.sub(
                r'<meta name="twitter:title" content="[^"]*"',
                f'<meta name="twitter:title" content="{esc_title}"',
                content,
                count=1,
            )

    content = re.sub(
        r'<meta property="og:description" content="[^"]*"',
        f'<meta property="og:description" content="{esc_meta}"',
        content,
        count=1,
    )
    content = re.sub(
        r'<meta content="[^"]*" property="og:description"',
        f'<meta content="{esc_meta}" property="og:description"',
        content,
        count=1,
    )
    content = re.sub(
        r'<meta content="[^"]*" property="twitter:description"',
        f'<meta content="{esc_meta}" property="twitter:description"',
        content,
        count=1,
    )
    content = re.sub(
        r'<meta name="twitter:description" content="[^"]*"',
        f'<meta name="twitter:description" content="{esc_meta}"',
        content,
        count=1,
    )

    content = re.sub(
        r'(<h1 class="font-display[^"]*"[^>]*>)([^<]*)(</h1>)',
        lambda m: f"{m.group(1)}{esc_h1}{m.group(3)}",
        content,
        count=1,
    )

    def patch_ld_json(match: re.Match) -> str:
        raw = match.group(1)
        try:
            obj = json.loads(raw)
        except json.JSONDecodeError:
            return match.group(0)
        if obj.get("@type") in ("BlogPosting", "Article"):
            obj["headline"] = title
            obj["description"] = meta
            if "dateModified" in obj:
                obj["dateModified"] = MODIFIED_SHORT
            return (
                '<script type="application/ld+json">'
                + json.dumps(obj, ensure_ascii=False, separators=(",", ":"))
                + "</script>"
            )
        return match.group(0)

    content = re.sub(
        r'<script type="application/ld\+json">(\{.*?\})</script>',
        patch_ld_json,
        content,
        flags=re.DOTALL,
    )

    content = re.sub(
        r'<meta property="article:modified_time" content="[^"]*"',
        f'<meta property="article:modified_time" content="{MODIFIED}"',
        content,
        count=1,
    )
    content = re.sub(
        r'<meta content="2026-[^"]*" name="last-modified"',
        f'<meta content="{MODIFIED_SHORT}" name="last-modified"',
        content,
        count=1,
    )

    path.write_text(content, encoding="utf-8")
    print(f"Updated {path.name}")


def main() -> None:
    blog_dir = ROOT / "blog"
    for filename, data in BLOG_UPDATES.items():
        path = blog_dir / filename
        if not path.exists():
            print(f"MISSING: {filename}")
            continue
        update_blog_file(path, data)


if __name__ == "__main__":
    main()
