"""Shared URL, HTML, and redirect helpers."""

from __future__ import annotations

import json
import re
from difflib import SequenceMatcher
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse

from bs4 import BeautifulSoup

from config import NOINDEX_CHECK_EXCLUDE_PREFIXES

INTERNAL_DOMAIN = "nutrithrive.com.au"
SKIP_HREF_PREFIXES = ("mailto:", "tel:", "javascript:", "#")

CRITICAL_FLAG_PREFIXES = (
    "noindex_without_redirect",
    "broken_internal_link",
    "missing_title",
    "missing_meta_description",
    "robots_blocked_in_sitemap",
    "googlebot_cloaking",
)


def normalize_url(url: str, base: str | None = None) -> str | None:
    if not url or url.startswith(SKIP_HREF_PREFIXES):
        return None
    absolute = urljoin(base or "", url.strip())
    parsed = urlparse(absolute)
    host = (parsed.hostname or "").lower()
    if host and host not in {INTERNAL_DOMAIN, f"www.{INTERNAL_DOMAIN}"}:
        return None
    path = parsed.path or "/"
    if path != "/":
        path = path.rstrip("/")
    normalized = urlunparse(
        (
            "https",
            INTERNAL_DOMAIN,
            path,
            "",
            parsed.query,
            "",
        )
    )
    return normalized


def normalize_path(url: str) -> str:
    parsed = urlparse(url)
    path = parsed.path or "/"
    if path != "/":
        path = path.rstrip("/")
    return path


def path_variants(path: str) -> set[str]:
    if path == "/":
        return {"/"}
    variants = {path}
    if path.endswith(".html"):
        variants.add(path[: -len(".html")])
    else:
        variants.add(f"{path}.html")
    return variants


def is_blog_post_url(url: str) -> bool:
    path = normalize_path(url)
    return path.startswith("/blog/") and path not in {"/blog", "/blog/"}


def is_thin_content_excluded(url: str, exclude_paths: set[str]) -> bool:
    path = normalize_path(url)
    if path in exclude_paths:
        return True
    for candidate in exclude_paths:
        if candidate.endswith("/") and path.startswith(candidate):
            return True
    return False


def parse_redirects_file(redirects_path: Path) -> dict[str, str]:
    """Return source path -> target path for active redirect rules."""
    mapping: dict[str, str] = {}
    if not redirects_path.exists():
        return mapping

    for raw_line in redirects_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split()
        if len(parts) < 2:
            continue
        source, target = parts[0], parts[1]
        if source.startswith("http"):
            source = normalize_path(source) or source
        if not source.startswith("/"):
            continue
        mapping[source.rstrip("/") or "/"] = target
        if source.endswith("/") and source != "/":
            mapping[source.rstrip("/")] = target
    return mapping


def has_redirect_rule(url: str, redirects: dict[str, str]) -> bool:
    path = normalize_path(url)
    for variant in path_variants(path):
        key = variant.rstrip("/") or "/"
        if key in redirects:
            return True
    return False


def extract_schema_types(html: str) -> list[str]:
    soup = BeautifulSoup(html, "lxml")
    types: list[str] = []
    for script in soup.find_all("script", attrs={"type": "application/ld+json"}):
        raw = script.string or script.get_text(strip=True)
        if not raw:
            continue
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            continue
        types.extend(_collect_schema_types(data))
    return types


def _collect_schema_types(node) -> list[str]:
    found: list[str] = []
    if isinstance(node, dict):
        node_type = node.get("@type")
        if isinstance(node_type, list):
            found.extend(str(item) for item in node_type)
        elif node_type:
            found.append(str(node_type))
        graph = node.get("@graph")
        if isinstance(graph, list):
            for item in graph:
                found.extend(_collect_schema_types(item))
        for value in node.values():
            if isinstance(value, (dict, list)):
                found.extend(_collect_schema_types(value))
    elif isinstance(node, list):
        for item in node:
            found.extend(_collect_schema_types(item))
    return found


def extract_aggregate_rating_counts(html: str) -> list[int]:
    soup = BeautifulSoup(html, "lxml")
    counts: list[int] = []
    for script in soup.find_all("script", attrs={"type": "application/ld+json"}):
        raw = script.string or script.get_text(strip=True)
        if not raw:
            continue
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            continue
        counts.extend(_collect_rating_counts(data))
    return counts


def _collect_rating_counts(node) -> list[int]:
    counts: list[int] = []
    if isinstance(node, dict):
        node_type = node.get("@type")
        types = node_type if isinstance(node_type, list) else [node_type]
        if any(t == "AggregateRating" for t in types if t):
            for key in ("ratingCount", "reviewCount"):
                value = node.get(key)
                if isinstance(value, (int, float)):
                    counts.append(int(value))
                elif isinstance(value, str) and value.isdigit():
                    counts.append(int(value))
        for value in node.values():
            if isinstance(value, (dict, list)):
                counts.extend(_collect_rating_counts(value))
    elif isinstance(node, list):
        for item in node:
            counts.extend(_collect_rating_counts(item))
    return counts


def extract_main_text(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    for selector in ("main", "article", "[role='main']", ".content", "#content"):
        node = soup.select_one(selector)
        if node:
            for remove in node.select("nav, footer, header, .site-header, .site-footer"):
                remove.decompose()
            text = node.get_text(" ", strip=True)
            if text:
                return text
    body = soup.body
    if not body:
        return soup.get_text(" ", strip=True)
    for remove in body.select("nav, footer, header, .site-header, .site-footer"):
        remove.decompose()
    return body.get_text(" ", strip=True)


def word_count(text: str) -> int:
    words = re.findall(r"\b[\w'-]+\b", text, flags=re.UNICODE)
    return len(words)


def heading_hierarchy_issues(soup: BeautifulSoup) -> list[str]:
    headings = []
    for level in range(1, 7):
        for tag in soup.find_all(f"h{level}"):
            headings.append((level, tag.get_text(" ", strip=True)))
    if not headings:
        return ["no_headings_found"]

    issues: list[str] = []
    prev_level = headings[0][0]
    if prev_level != 1:
        issues.append(f"first_heading_is_h{prev_level}_not_h1")
    for level, _ in headings[1:]:
        if level > prev_level + 1:
            issues.append(f"skipped_heading_level_h{prev_level}_to_h{level}")
        prev_level = level
    return issues


def text_similarity(a: str, b: str) -> float:
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def parse_meta_robots(content: str | None) -> str:
    if not content:
        return "index,follow"
    return content.strip().lower().replace(" ", "")


def is_noindex(robots_value: str) -> bool:
    return "noindex" in parse_meta_robots(robots_value)


def is_noindex_excluded(url: str) -> bool:
    path = normalize_path(url)
    for prefix in NOINDEX_CHECK_EXCLUDE_PREFIXES:
        normalized_prefix = prefix.rstrip("/") or "/"
        if path == normalized_prefix or path.startswith(prefix):
            return True
    return False


def is_critical_flag(flag: str) -> bool:
    return any(flag == prefix or flag.startswith(prefix) for prefix in CRITICAL_FLAG_PREFIXES)
