#!/usr/bin/env python3
"""Batch 3 H1 + title updates for medical-sensitive posts."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / "blog"

UPDATES = {
    "moringa-pregnancy-safe-australia-trimester-guide-2026.html": {
        "title": "Is Moringa Safe in Pregnancy? Trimester-by-Trimester",
        "meta": "Is moringa safe during pregnancy? Here's what's known by trimester, and why most experts advise caution — talk to your OB first.",
        "h1": "Moringa and Pregnancy: A Trimester Guide",
    },
    "moringa-for-high-blood-pressure-hypertension-2026.html": {
        "title": "Moringa and Blood Pressure: What the Research Shows",
        "meta": "Can moringa help lower blood pressure? Here's what studies actually show, and why you should talk to your doctor before combining with BP medication.",
        "h1": "Moringa and Blood Pressure: The Evidence",
    },
    "moringa-and-blood-sugar-diabetes-research-2026.html": {
        "title": "Moringa and Blood Sugar: What Diabetes Research Shows",
        "meta": "Does moringa help manage blood sugar? Real research on moringa and diabetes, dosage notes, and medication interaction warnings.",
        "h1": "Moringa and Blood Sugar: What the Research Shows",
    },
    "moringa-for-hair-growth-eating-evidence-2026.html": {
        "title": "Moringa for Hair Growth: Does Eating It Help? (2026)",
        "meta": "Can eating moringa powder support hair growth? Real evidence on biotin, iron, and zinc content — plus how to actually use it.",
        "h1": "Moringa for Hair Growth: What the Evidence Shows",
    },
    "moringa-for-skin-eating-benefits-glow-2026.html": {
        "title": "Moringa for Skin: Does Eating It Give You a Glow?",
        "meta": "Does eating moringa powder actually improve skin? Antioxidant and vitamin content explained, plus realistic timeframes.",
        "h1": 'Moringa for Skin: The Real Story on the "Glow"',
    },
    "moringa-for-men-testosterone-energy-prostate-2026.html": {
        "title": "Moringa for Men: Testosterone, Energy & Prostate Health",
        "meta": "Does moringa affect testosterone or prostate health in men? Here's what the research actually says, separated from the marketing hype.",
        "h1": "Moringa for Men: Separating Evidence From Hype",
    },
}


def esc(t):
    return t.replace("&", "&amp;").replace('"', "&quot;")


for fname, d in UPDATES.items():
    p = BLOG / fname
    if not p.exists():
        print("MISSING", fname)
        continue
    c = p.read_text(encoding="utf-8")
    c = re.sub(r"<title>[^<]*</title>", f"<title>{esc(d['title'])}</title>", c, count=1)
    c = re.sub(
        r'<meta name="description" content="[^"]*"',
        f'<meta name="description" content="{esc(d["meta"])}"',
        c,
        count=1,
    )
    c = re.sub(
        r'(<h1 class="font-display[^"]*"[^>]*>)([^<]*)(</h1>)',
        lambda m: f"{m.group(1)}{esc(d['h1'])}{m.group(3)}",
        c,
        count=1,
    )
    c = re.sub(
        r'<meta property="article:modified_time" content="[^"]*"',
        '<meta property="article:modified_time" content="2026-07-27T00:00:00+10:00"',
        c,
        count=1,
    )
    p.write_text(c, encoding="utf-8")
    print("Updated", fname)
