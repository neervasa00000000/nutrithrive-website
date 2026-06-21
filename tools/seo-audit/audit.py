#!/usr/bin/env python3
"""NutriThrive site crawl and SEO audit tool."""

from __future__ import annotations

import argparse
import sys
from datetime import date
from pathlib import Path

from config import DEFAULT_REDIRECTS_FILE, REQUEST_DELAY_SECONDS
from crawler import SiteCrawler
from cross_checks import (
    compute_inbound_links,
    find_duplicate_descriptions,
    find_duplicate_titles,
    find_inconsistent_aggregate_ratings,
    find_noindex_without_redirect,
    find_orphan_pages,
    find_redirect_chains,
    find_similar_descriptions,
)
from page_checks import PageAudit, apply_link_checks, audit_page
from report import default_output_paths, write_csv, write_summary_markdown
from utils import is_noindex, normalize_url, parse_redirects_file


def run_audit(
    base_url: str,
    *,
    redirects_file: Path,
    delay: float,
    skip_dual_fetch: bool = False,
) -> tuple[int, int, int, Path, Path]:
    crawler = SiteCrawler(base_url, delay=delay)
    robots_report = crawler.load_robots()
    all_urls, only_sitemap, only_crawl, sitemap_urls = crawler.discover_urls()
    robots_blocked = crawler.mark_robots_blocked_sitemap(sitemap_urls)

    redirects = parse_redirects_file(redirects_file)
    pages: dict[str, PageAudit] = {}
    url_status: dict[str, int] = {}
    redirect_chains_raw: dict[str, list[tuple[str, int]]] = {}

    print(f"Discovered {len(all_urls)} URLs ({len(only_sitemap)} sitemap-only, {len(only_crawl)} crawl-only)")

    for index, url in enumerate(sorted(all_urls), start=1):
        print(f"[{index}/{len(all_urls)}] {url}")
        browser_result, googlebot_result = crawler.fetch_dual(url)
        primary = browser_result if browser_result.status_code else googlebot_result
        if primary.status_code in {301, 302, 303, 307, 308} or (
            browser_result.redirect_chain and len([h for h in browser_result.redirect_chain if h[1] in {301, 302, 303, 307, 308}]) > 0
        ):
            chain = crawler.fetch_redirect_chain(url)
            redirect_chains_raw[url] = chain

        final_url = normalize_url(primary.final_url) or url
        page = audit_page(
            final_url,
            primary.html,
            primary.status_code,
            browser_html=browser_result.html,
            googlebot_html=googlebot_result.html,
            browser_status=browser_result.status_code,
            googlebot_status=googlebot_result.status_code,
        )
        pages[final_url] = page
        url_status[final_url] = page.status_code

        if robots_report and final_url in robots_blocked:
            page.flags.append("robots_blocked_in_sitemap")

    inbound = compute_inbound_links(pages)
    for url, count in inbound.items():
        if url in pages:
            pages[url].inbound_link_count = count

    noindex_urls = {url for url, page in pages.items() if is_noindex(page.meta_robots)}
    apply_link_checks(pages, url_status, noindex_urls)

    duplicate_titles = find_duplicate_titles(pages)
    duplicate_descriptions = find_duplicate_descriptions(pages)
    similar_descriptions = find_similar_descriptions(pages)
    orphan_pages = find_orphan_pages(pages, inbound)
    redirect_chains = find_redirect_chains(redirect_chains_raw)
    noindex_without_redirect = find_noindex_without_redirect(pages, redirects)
    inconsistent_ratings = find_inconsistent_aggregate_ratings(pages)

    for url in noindex_without_redirect:
        if url in pages:
            pages[url].flags.append("noindex_without_redirect")

    for title, urls in duplicate_titles.items():
        for url in urls:
            pages[url].flags.append(f"duplicate_title:{len(urls)}_pages")

    for desc, urls in duplicate_descriptions.items():
        for url in urls:
            pages[url].flags.append(f"duplicate_meta_description:{len(urls)}_pages")

    for url_a, url_b, score in similar_descriptions:
        pages[url_a].flags.append(f"similar_meta_description:{score:.0%}_with:{url_b}")
        pages[url_b].flags.append(f"similar_meta_description:{score:.0%}_with:{url_a}")

    for url in orphan_pages:
        pages[url].flags.append("orphan_page")

    for url in only_sitemap:
        if url in pages:
            pages[url].flags.append("sitemap_not_in_crawl")
        else:
            pages[url] = audit_page(url, "", 0)
            pages[url].flags.append("sitemap_not_in_crawl")

    for url in only_crawl:
        if url in pages:
            pages[url].flags.append("missing_from_sitemap")

    if inconsistent_ratings:
        for item in inconsistent_ratings:
            url = item.split(":", 1)[0]
            if url in pages:
                pages[url].flags.append("inconsistent_aggregate_rating")

    csv_path, md_path = default_output_paths()
    write_csv(pages, csv_path)
    critical, warnings = write_summary_markdown(
        pages=pages,
        output_path=md_path,
        only_sitemap=only_sitemap,
        only_crawl=only_crawl,
        robots_blocked=robots_blocked,
        duplicate_titles=duplicate_titles,
        duplicate_descriptions=duplicate_descriptions,
        similar_descriptions=similar_descriptions,
        orphan_pages=orphan_pages,
        redirect_chains=redirect_chains,
        noindex_without_redirect=noindex_without_redirect,
        inconsistent_ratings=inconsistent_ratings,
        robots_blog_disallowed=robots_report.blog_disallowed if robots_report else False,
        robots_disallowed_blog_paths=robots_report.disallowed_blog_paths if robots_report else [],
    )
    return len(pages), critical, warnings, csv_path, md_path


def main() -> int:
    parser = argparse.ArgumentParser(description="NutriThrive SEO audit crawler")
    parser.add_argument(
        "--base-url",
        default="https://nutrithrive.com.au",
        help="Site origin to audit (default: https://nutrithrive.com.au)",
    )
    parser.add_argument(
        "--redirects-file",
        type=Path,
        default=DEFAULT_REDIRECTS_FILE,
        help="Path to Netlify _redirects file for zombie redirect checks",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=REQUEST_DELAY_SECONDS,
        help="Delay between HTTP requests in seconds",
    )
    args = parser.parse_args()

    try:
        page_count, critical, warnings, csv_path, md_path = run_audit(
            args.base_url.rstrip("/"),
            redirects_file=args.redirects_file,
            delay=args.delay,
        )
    except KeyboardInterrupt:
        print("\nAudit interrupted.")
        return 130
    except Exception as exc:  # pragma: no cover - CLI guard
        print(f"Audit failed: {exc}", file=sys.stderr)
        return 1

    print(
        f"Crawled {page_count} pages. {critical} critical issues, {warnings} warnings. "
        f"Report: {csv_path.relative_to(Path(__file__).resolve().parent)}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
