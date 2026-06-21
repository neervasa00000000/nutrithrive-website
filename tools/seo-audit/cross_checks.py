"""Cross-page SEO analysis."""

from __future__ import annotations

from itertools import combinations

from config import SIMILAR_DESC_THRESHOLD
from page_checks import PageAudit
from utils import has_redirect_rule, is_noindex, is_noindex_excluded, text_similarity


def find_duplicate_titles(pages: dict[str, PageAudit]) -> dict[str, list[str]]:
    groups: dict[str, list[str]] = {}
    for url, page in pages.items():
        if not page.title:
            continue
        groups.setdefault(page.title, []).append(url)
    return {title: urls for title, urls in groups.items() if len(urls) > 1}


def find_duplicate_descriptions(pages: dict[str, PageAudit]) -> dict[str, list[str]]:
    groups: dict[str, list[str]] = {}
    for url, page in pages.items():
        if not page.meta_description:
            continue
        groups.setdefault(page.meta_description, []).append(url)
    return {desc: urls for desc, urls in groups.items() if len(urls) > 1}


def find_similar_descriptions(pages: dict[str, PageAudit]) -> list[tuple[str, str, float]]:
    pairs: list[tuple[str, str, float]] = []
    items = [(url, page.meta_description) for url, page in pages.items() if page.meta_description]
    for (url_a, desc_a), (url_b, desc_b) in combinations(items, 2):
        if desc_a == desc_b:
            continue
        score = text_similarity(desc_a, desc_b)
        if score >= SIMILAR_DESC_THRESHOLD:
            pairs.append((url_a, url_b, score))
    return sorted(pairs, key=lambda item: item[2], reverse=True)


def find_orphan_pages(pages: dict[str, PageAudit], inbound_counts: dict[str, int]) -> list[str]:
    orphans: list[str] = []
    for url, page in pages.items():
        if page.status_code != 200:
            continue
        if is_noindex(page.meta_robots):
            continue
        if inbound_counts.get(url, 0) == 0 and url not in {"https://nutrithrive.com.au/"}:
            orphans.append(url)
    return sorted(orphans)


def find_redirect_chains(chains: dict[str, list[tuple[str, int]]]) -> dict[str, list[tuple[str, int]]]:
    long_chains: dict[str, list[tuple[str, int]]] = {}
    for url, chain in chains.items():
        hops = [hop for hop in chain if hop[1] in {301, 302, 303, 307, 308}]
        if len(hops) > 1:
            long_chains[url] = chain
    return long_chains


def find_noindex_without_redirect(pages: dict[str, PageAudit], redirects: dict[str, str]) -> list[str]:
    zombies: list[str] = []
    for url, page in pages.items():
        if page.status_code != 200:
            continue
        if not is_noindex(page.meta_robots):
            continue
        if is_noindex_excluded(url):
            continue
        if not has_redirect_rule(url, redirects):
            zombies.append(url)
    return sorted(zombies)


def find_inconsistent_aggregate_ratings(pages: dict[str, PageAudit]) -> list[str]:
    values: set[int] = set()
    flagged: list[str] = []
    for url, page in pages.items():
        for count in page.aggregate_rating_counts:
            values.add(count)
            flagged.append(f"{url}:{count}")
    if len(values) > 1:
        return flagged
    return []


def compute_inbound_links(pages: dict[str, PageAudit]) -> dict[str, int]:
    inbound: dict[str, int] = {}
    for page in pages.values():
        seen_targets = set()
        for target, _text in page.internal_links:
            if target in seen_targets:
                continue
            seen_targets.add(target)
            inbound[target] = inbound.get(target, 0) + 1
    return inbound
