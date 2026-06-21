"""CSV and markdown report generation."""

from __future__ import annotations

import csv
from datetime import date
from pathlib import Path

from config import OUTPUT_DIR
from cross_checks import (
    find_duplicate_descriptions,
    find_duplicate_titles,
    find_inconsistent_aggregate_ratings,
    find_noindex_without_redirect,
    find_orphan_pages,
    find_redirect_chains,
    find_similar_descriptions,
)
from page_checks import PageAudit
from utils import is_critical_flag


def write_csv(pages: dict[str, PageAudit], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    rows = sorted(pages.values(), key=lambda page: page.url)
    fieldnames = [
        "URL",
        "status code",
        "title",
        "title length",
        "meta description",
        "meta desc length",
        "H1 count",
        "word count",
        "schema types present",
        "image count",
        "external image count",
        "internal link count",
        "inbound link count",
        "last modified date",
        "flags",
    ]
    with output_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for page in rows:
            writer.writerow(
                {
                    "URL": page.url,
                    "status code": page.status_code,
                    "title": page.title,
                    "title length": page.title_length,
                    "meta description": page.meta_description,
                    "meta desc length": page.meta_desc_length,
                    "H1 count": page.h1_count,
                    "word count": page.word_count,
                    "schema types present": ";".join(sorted(set(page.schema_types))),
                    "image count": page.image_count,
                    "external image count": page.external_image_count,
                    "internal link count": page.internal_link_count,
                    "inbound link count": page.inbound_link_count,
                    "last modified date": page.last_modified,
                    "flags": ";".join(page.flags),
                }
            )


def write_summary_markdown(
    *,
    pages: dict[str, PageAudit],
    output_path: Path,
    only_sitemap: set[str],
    only_crawl: set[str],
    robots_blocked: list[str],
    duplicate_titles: dict[str, list[str]],
    duplicate_descriptions: dict[str, list[str]],
    similar_descriptions: list[tuple[str, str, float]],
    orphan_pages: list[str],
    redirect_chains: dict[str, list[tuple[str, int]]],
    noindex_without_redirect: list[str],
    inconsistent_ratings: list[str],
    robots_blog_disallowed: bool,
    robots_disallowed_blog_paths: list[str],
) -> tuple[int, int]:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    critical = 0
    warnings = 0
    for page in pages.values():
        for flag in page.flags:
            if is_critical_flag(flag):
                critical += 1
            else:
                warnings += 1

    critical += len(noindex_without_redirect)
    critical += len(robots_blocked)
    if robots_blog_disallowed:
        critical += 1

    top_pages = sorted(pages.values(), key=lambda page: len(page.flags), reverse=True)[:10]

    lines = [
        f"# SEO Audit Summary — {date.today().isoformat()}",
        "",
        f"- **Pages crawled:** {len(pages)}",
        f"- **Critical issues:** {critical}",
        f"- **Warnings:** {warnings}",
        "",
        "## Critical patterns",
        "",
    ]

    if noindex_without_redirect:
        lines.append("### Noindex without redirect rule")
        for url in noindex_without_redirect:
            lines.append(f"- {url}")
        lines.append("")

    broken = sorted(
        {
            flag.split(":", 1)[1]
            for page in pages.values()
            for flag in page.flags
            if flag.startswith("broken_internal_link:")
        }
    )
    if broken:
        lines.append("### Broken internal links")
        for item in broken:
            lines.append(f"- {item}")
        lines.append("")

    missing_core = [
        page.url
        for page in pages.values()
        if any(flag in {"missing_title", "missing_meta_description"} for flag in page.flags)
    ]
    if missing_core:
        lines.append("### Missing title or meta description")
        for url in missing_core:
            lines.append(f"- {url}")
        lines.append("")

    lines.extend(["## Sitemap vs crawl mismatches", ""])
    if only_sitemap:
        lines.append("### In sitemap but not reachable by crawl")
        for url in sorted(only_sitemap):
            lines.append(f"- {url}")
        lines.append("")
    else:
        lines.append("- None")
        lines.append("")

    if only_crawl:
        lines.append("### Reachable by crawl but missing from sitemap")
        for url in sorted(only_crawl):
            lines.append(f"- {url}")
        lines.append("")
    else:
        lines.append("- None")
        lines.append("")

    if robots_blocked:
        lines.append("## Robots.txt contradictions")
        for url in robots_blocked:
            lines.append(f"- Blocked by robots.txt but listed in sitemap: {url}")
        lines.append("")

    if robots_blog_disallowed or robots_disallowed_blog_paths:
        lines.append("## Robots.txt blog checks")
        lines.append(f"- Blog disallowed for Googlebot: **{robots_blog_disallowed}**")
        for path in robots_disallowed_blog_paths:
            lines.append(f"- Disallowed blog path: `{path}`")
        lines.append("")

    if duplicate_titles:
        lines.append("## Duplicate title groups")
        for title, urls in duplicate_titles.items():
            lines.append(f"### {title}")
            for url in urls:
                lines.append(f"- {url}")
            lines.append("")

    if duplicate_descriptions:
        lines.append("## Duplicate meta description groups")
        for desc, urls in duplicate_descriptions.items():
            lines.append(f"### {desc[:120]}{'…' if len(desc) > 120 else ''}")
            for url in urls:
                lines.append(f"- {url}")
            lines.append("")

    if similar_descriptions:
        lines.append("## Near-duplicate meta descriptions (>80% similar)")
        for url_a, url_b, score in similar_descriptions[:25]:
            lines.append(f"- {score:.0%}: {url_a} ↔ {url_b}")
        lines.append("")

    if orphan_pages:
        lines.append("## Orphan pages (indexable, zero inbound internal links)")
        for url in orphan_pages:
            lines.append(f"- {url}")
        lines.append("")

    if redirect_chains:
        lines.append("## Redirect chains (>1 hop)")
        for url, chain in redirect_chains.items():
            chain_text = " → ".join(f"{hop[0]} ({hop[1]})" for hop in chain)
            lines.append(f"- {chain_text}")
        lines.append("")

    if inconsistent_ratings:
        lines.append("## Inconsistent AggregateRating counts")
        for item in inconsistent_ratings:
            lines.append(f"- {item}")
        lines.append("")

    lines.extend(["## Top 10 pages by flag count", ""])
    for page in top_pages:
        if not page.flags:
            continue
        lines.append(f"- **{len(page.flags)} flags** — {page.url}")
        for flag in page.flags[:8]:
            lines.append(f"  - {flag}")
        if len(page.flags) > 8:
            lines.append(f"  - …and {len(page.flags) - 8} more")
    lines.append("")

    output_path.write_text("\n".join(lines), encoding="utf-8")
    return critical, warnings


def default_output_paths(run_date: str | None = None) -> tuple[Path, Path]:
    stamp = run_date or date.today().isoformat()
    csv_path = OUTPUT_DIR / f"seo-audit-{stamp}.csv"
    md_path = OUTPUT_DIR / f"seo-audit-summary-{stamp}.md"
    return csv_path, md_path
