#!/usr/bin/env python3
"""Batch 2 SEO metadata updates from zero-click audit spreadsheet."""
import json
import re
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
XLSX = ROOT / "untitled folder 2" / "NutriThrive_ZeroClick_DeepAudit_AllLinks.xlsx"
BLOG_DIR = ROOT / "blog"
MODIFIED = "2026-07-27T00:00:00+10:00"
MODIFIED_SHORT = "2026-07-27"

BATCH1_SLUGS = {
    "curry-leaves-substitute-what-to-use-2026",
    "moringa-vs-spirulina-vs-matcha-comparison-australia",
    "what-does-moringa-powder-taste-like-honest-guide-2026",
    "moringa-for-breastfeeding-milk-supply-2026",
    "curry-leaves-vs-curry-powder-difference-explained-2026",
    "moringa-powder-victoria-seniors-joint-health",
    "fresh-vs-dried-curry-leaves-cooking-comparison-2026",
    "how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026",
    "moringa-with-vitamin-c-iron-absorption-guide-2026",
    "moringa-for-sleep-quality-insomnia-2026",
    "moringa-for-weight-loss-evidence-2026",
    "darjeeling-tea-health-benefits-research-2026",
}
BATCH3_SLUGS = {
    "moringa-for-breastfeeding-milk-supply-2026",
    "moringa-pregnancy-safe-australia-trimester-guide-2026",
    "moringa-for-high-blood-pressure-hypertension-2026",
    "moringa-and-blood-sugar-diabetes-research-2026",
    "moringa-for-sleep-quality-insomnia-2026",
    "moringa-for-weight-loss-evidence-2026",
    "moringa-for-hair-growth-eating-evidence-2026",
    "moringa-for-skin-eating-benefits-glow-2026",
    "moringa-for-men-testosterone-energy-prostate-2026",
}
LOW_PRIORITY = {
    "how-much-water-per-day-australians-honest-guide-2026",
    "how-to-eat-more-vegetables-practical-guide-australia-2026",
    "best-anti-inflammatory-foods-australia-daily-guide-2026",
    "how-much-protein-australian-women-need-honest-guide-2026",
    "melbourne-cbd-gyms-moringa-recovery-2026",
    "morning-routine-health-tips-australia-2026",
    "state-of-australian-schooling-2026-comprehensive-analysis",
}
SKIP_ACTION_PREFIXES = ("MERGE", "REDIRECT", "DELETE", "LOW PRIORITY", "CHECK", "REVIEW", "ON-PAGE")


def html_escape(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def resolve_blog_path(slug: str) -> Path | None:
    for name in (f"{slug}.html", slug):
        path = BLOG_DIR / name
        if path.is_file():
            return path
    return None


def load_batch2_updates() -> dict[str, dict[str, str]]:
    df = pd.read_excel(XLSX, sheet_name="All 90 Links - Full Detail")
    blog_df = df[df["URL"].str.contains("/blog/", na=False)]
    updates: dict[str, dict[str, str]] = {}
    for _, row in blog_df.iterrows():
        slug = row["URL"].replace("https://nutrithrive.com.au/blog/", "").rstrip("/")
        if slug in BATCH1_SLUGS or slug in BATCH3_SLUGS or slug in LOW_PRIORITY:
            continue
        action = str(row["Recommended Action"])
        if any(action.upper().startswith(x) or x in action.upper() for x in SKIP_ACTION_PREFIXES):
            continue
        title = row["New Title (≤60 char)"]
        if pd.isna(title) or str(title).startswith("N/A"):
            continue
        path = resolve_blog_path(slug)
        if not path:
            continue
        updates[path.name] = {
            "title": str(title),
            "meta": str(row["New Meta Description (≤155 char)"]),
            "h1": str(row["New H1"]),
        }
    return updates


def update_blog_file(path: Path, data: dict[str, str]) -> None:
    content = path.read_text(encoding="utf-8")
    title, meta, h1 = data["title"], data["meta"], data["h1"]
    esc_title, esc_meta, esc_h1 = map(html_escape, (title, meta, h1))

    content = re.sub(r"<title>[^<]*</title>", f"<title>{esc_title}</title>", content, count=1)
    content = re.sub(
        r'<meta name="description" content="[^"]*"',
        f'<meta name="description" content="{esc_meta}"',
        content,
        count=1,
    )

    content = re.sub(
        r'<meta property="og:title" content="[^"]*"',
        f'<meta property="og:title" content="{esc_title}"',
        content,
        count=1,
    )
    content = re.sub(
        r'<meta content="[^"]*" property="og:title"',
        f'<meta content="{esc_title}" property="og:title"',
        content,
        count=1,
    )
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
    # Fallback h1 without font-display class
    if esc_h1 not in content:
        content = re.sub(
            r"(<h1[^>]*>)([^<]*)(</h1>)",
            lambda m: f"{m.group(1)}{esc_h1}{m.group(3)}",
            content,
            count=1,
        )

    def patch_ld_json(match: re.Match) -> str:
        try:
            obj = json.loads(match.group(1))
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


def main() -> None:
    updates = load_batch2_updates()
    print(f"Updating {len(updates)} Batch 2 posts...")
    for filename, data in sorted(updates.items()):
        path = BLOG_DIR / filename
        update_blog_file(path, data)
        print(f"  {filename}")


if __name__ == "__main__":
    main()
