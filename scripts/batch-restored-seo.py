#!/usr/bin/env python3
"""Apply SEO updates to restored + remaining audit blog posts."""
import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

# Load update_blog_file from batch2
spec = importlib.util.spec_from_file_location("batch2", ROOT / "scripts" / "batch2-seo-update.py")
batch2 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(batch2)

RESTORED = {
    "verify-moringa-quality-premium-buyers-checklist-2026.html": {
        "title": "How to Verify Moringa Quality: 5-Point Buyer Checklist",
        "meta": "5 things to check before buying moringa powder in Australia — colour, smell, batch dates, and lab testing red flags.",
        "h1": "Moringa Quality Checklist: 5 Things to Check",
    },
    "how-to-read-moringa-batch-codes-freshness.html": {
        "title": "How to Read Moringa Batch Codes for Freshness",
        "meta": "Every NutriThrive pack has a batch code — here's exactly how to read it to check freshness before you buy or use it.",
        "h1": "How to Read Your Moringa Batch Code",
    },
    "why-premium-moringa-costs-11-not-25-value-vs-markup-2026.html": {
        "title": "Why Premium Moringa Costs $11, Not $25 (Value Explained)",
        "meta": "Why does premium moringa range from $11 to $25? Here's an honest breakdown of what actually drives the price difference.",
        "h1": "Moringa Pricing: Why $11 vs $25? (Value Explained)",
    },
    "moringa-oil-benefits-skin-hair-health-2026.html": {
        "title": "Moringa Oil for Skin & Hair: Real Benefits (2026)",
        "meta": "Moringa oil (not powder) for skin and hair — what makes it different, real benefits, and how to use it safely.",
        "h1": "Moringa Oil for Skin & Hair: What's Different",
    },
    "high-protein-moringa-recipes-australia-2026.html": {
        "title": "10 High-Protein Moringa Recipes (15-40g Per Serve)",
        "meta": "10 tested high-protein recipes using moringa powder, from 15g to 40g protein per serve — faster and cheaper than whey.",
        "h1": "10 High-Protein Moringa Recipes (Tested)",
    },
    "chronic-fatigue-what-actually-fixed-it-2026.html": {
        "title": "Chronic Fatigue: What Actually Fixed It (My Story)",
        "meta": "I struggled with chronic fatigue for years — here's what actually helped, and what turned out to be a waste of money.",
        "h1": "Chronic Fatigue: What Actually Fixed It",
    },
    "cystic-acne-gut-healing-what-actually-cleared-skin-2026.html": {
        "title": "Cystic Acne & Gut Health: What Actually Cleared My Skin",
        "meta": "My honest experience linking gut health to cystic acne — what actually helped, with the caveat that everyone's skin is different.",
        "h1": "Cystic Acne and Gut Health: My Real Experience",
    },
    "natural-pre-workout-moringa-australia-2026.html": {
        "title": "Moringa as a Natural Pre-Workout: Does It Work?",
        "meta": "Can moringa replace your pre-workout supplement? Here's an honest look at the energy and performance evidence.",
        "h1": "Moringa as a Natural Pre-Workout: The Evidence",
    },
}

blog_dir = ROOT / "blog"
for fname, data in RESTORED.items():
    path = blog_dir / fname
    if path.exists():
        batch2.update_blog_file(path, data)
        print(f"SEO: {fname}")
