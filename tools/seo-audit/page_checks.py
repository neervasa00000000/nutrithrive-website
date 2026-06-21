"""Per-page SEO extraction and rule evaluation."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from config import (
    DESC_MAX,
    DESC_MIN,
    FRESHNESS_DAYS,
    MIN_WORD_COUNT,
    THIN_CONTENT_EXCLUDE,
    TITLE_MAX,
    TITLE_MIN,
)
from utils import (
    INTERNAL_DOMAIN,
    extract_aggregate_rating_counts,
    extract_main_text,
    extract_schema_types,
    heading_hierarchy_issues,
    is_blog_post_url,
    is_noindex,
    is_noindex_excluded,
    is_thin_content_excluded,
    normalize_path,
    normalize_url,
    parse_meta_robots,
    word_count,
)


@dataclass
class PageAudit:
    url: str
    status_code: int
    title: str = ""
    title_length: int = 0
    meta_description: str = ""
    meta_desc_length: int = 0
    canonical: str = ""
    meta_robots: str = "index,follow"
    h1_count: int = 0
    word_count: int = 0
    schema_types: list[str] = field(default_factory=list)
    image_count: int = 0
    external_image_count: int = 0
    internal_link_count: int = 0
    inbound_link_count: int = 0
    last_modified: str = ""
    flags: list[str] = field(default_factory=list)
    internal_links: list[tuple[str, str]] = field(default_factory=list)
    aggregate_rating_counts: list[int] = field(default_factory=list)
    redirect_chain: list[tuple[str, int]] = field(default_factory=list)
    browser_html: str = ""
    googlebot_html: str = ""


def _meta_content(soup: BeautifulSoup, *, name: str | None = None, prop: str | None = None) -> str:
    if name:
        tag = soup.find("meta", attrs={"name": name})
        if not tag:
            tag = soup.find("meta", attrs={"property": name})
    else:
        tag = soup.find("meta", attrs={"property": prop})
    if tag and tag.get("content"):
        return tag["content"].strip()
    return ""


def _parse_date(value: str) -> datetime | None:
    if not value:
        return None
    value = value.strip()
    for fmt in (
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d",
    ):
        try:
            dt = datetime.strptime(value.replace("+10:00", "+1000").replace("+11:00", "+1100"), fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except ValueError:
            continue
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def compare_user_agents(browser_html: str, googlebot_html: str, browser_status: int, googlebot_status: int) -> list[str]:
    flags: list[str] = []
    if browser_status != googlebot_status:
        flags.append(f"googlebot_cloaking:status_{browser_status}_vs_{googlebot_status}")

    if not browser_html or not googlebot_html:
        if browser_status == googlebot_status and browser_status == 200:
            flags.append("googlebot_cloaking:missing_html_for_comparison")
        return flags

    browser_soup = BeautifulSoup(browser_html, "lxml")
    googlebot_soup = BeautifulSoup(googlebot_html, "lxml")
    browser_title = (browser_soup.title.string or "").strip() if browser_soup.title else ""
    googlebot_title = (googlebot_soup.title.string or "").strip() if googlebot_soup.title else ""
    if browser_title != googlebot_title:
        flags.append("googlebot_cloaking:title_mismatch")

    browser_text = extract_main_text(browser_html)
    googlebot_text = extract_main_text(googlebot_html)
    if browser_text and googlebot_text:
        ratio = min(len(browser_text), len(googlebot_text)) / max(len(browser_text), len(googlebot_text))
        if ratio < 0.85:
            flags.append("googlebot_cloaking:content_length_mismatch")
        elif browser_text[:500] != googlebot_text[:500]:
            flags.append("googlebot_cloaking:content_mismatch")
    return flags


def audit_page(
    url: str,
    html: str,
    status_code: int,
    *,
    browser_html: str = "",
    googlebot_html: str = "",
    browser_status: int = 0,
    googlebot_status: int = 0,
) -> PageAudit:
    audit = PageAudit(url=url, status_code=status_code, browser_html=browser_html, googlebot_html=googlebot_html)
    if status_code != 200 or not html:
        if status_code == 0:
            audit.flags.append("fetch_error")
        elif status_code >= 400:
            audit.flags.append(f"http_{status_code}")
        return audit

    soup = BeautifulSoup(html, "lxml")
    audit.title = (soup.title.string or "").strip() if soup.title else ""
    audit.title_length = len(audit.title)
    audit.meta_description = _meta_content(soup, name="description")
    audit.meta_desc_length = len(audit.meta_description)
    audit.canonical = ""
    canonical_tag = soup.find("link", rel=lambda value: value and "canonical" in value.lower())
    if canonical_tag and canonical_tag.get("href"):
        audit.canonical = canonical_tag["href"].strip()
    audit.meta_robots = parse_meta_robots(_meta_content(soup, name="robots"))

    if not audit.title:
        audit.flags.append("missing_title")
    elif audit.title_length < TITLE_MIN:
        audit.flags.append(f"title_too_short:{audit.title_length}")
    elif audit.title_length > TITLE_MAX:
        audit.flags.append(f"title_too_long:{audit.title_length}")

    if not audit.meta_description:
        audit.flags.append("missing_meta_description")
    elif audit.meta_desc_length < DESC_MIN:
        audit.flags.append(f"meta_description_too_short:{audit.meta_desc_length}")
    elif audit.meta_desc_length > DESC_MAX:
        audit.flags.append(f"meta_description_too_long:{audit.meta_desc_length}")

    if _meta_content(soup, name="keywords"):
        audit.flags.append("meta_keywords_present")

    if not audit.canonical:
        audit.flags.append("missing_canonical")
    else:
        canonical_norm = normalize_url(audit.canonical, url) or audit.canonical
        page_norm = normalize_url(url) or url
        if canonical_norm != page_norm:
            audit.flags.append(f"non_self_canonical:{canonical_norm}")

    audit.h1_count = len(soup.find_all("h1"))
    if audit.h1_count != 1:
        audit.flags.append(f"h1_count_{audit.h1_count}")

    heading_issues = heading_hierarchy_issues(soup)
    audit.flags.extend(heading_issues)

    main_text = extract_main_text(html)
    audit.word_count = word_count(main_text)
    if audit.word_count < MIN_WORD_COUNT and not is_thin_content_excluded(url, THIN_CONTENT_EXCLUDE):
        audit.flags.append(f"thin_content:{audit.word_count}_words")

    images = soup.find_all("img")
    audit.image_count = len(images)
    for img in images:
        src = img.get("src") or img.get("data-src") or ""
        if not src:
            continue
        absolute = urljoin(url, src)
        host = normalize_url(absolute)
        parsed_host = absolute.split("/")[2] if "://" in absolute else INTERNAL_DOMAIN
        if INTERNAL_DOMAIN not in parsed_host.lower():
            audit.external_image_count += 1
            audit.flags.append(f"external_image:{parsed_host}")
        alt = (img.get("alt") or "").strip()
        if alt == "":
            audit.flags.append(f"missing_img_alt:{src[:80]}")
        if "logo.webp" in src.lower() and "LOGO.webp" not in src:
            audit.flags.append("logo_path_casing_logo.webp")

    for anchor in soup.find_all("a", href=True):
        href = anchor["href"]
        normalized = normalize_url(href, url)
        if not normalized:
            continue
        anchor_text = anchor.get_text(" ", strip=True) or href
        audit.internal_links.append((normalized, anchor_text))
        audit.internal_link_count += 1

    audit.schema_types = extract_schema_types(html)
    if not audit.schema_types:
        audit.flags.append("missing_schema")
    if is_blog_post_url(url) and "BreadcrumbList" not in audit.schema_types:
        audit.flags.append("blog_missing_breadcrumb_schema")

    audit.aggregate_rating_counts = extract_aggregate_rating_counts(html)

    modified = _meta_content(soup, prop="article:modified_time") or _meta_content(soup, name="last-modified")
    if not modified:
        for script in soup.find_all("script", attrs={"type": "application/ld+json"}):
            raw = script.string or script.get_text(strip=True)
            if not raw:
                continue
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                continue
            modified = _find_json_date(data, ("dateModified", "datePublished"))
            if modified:
                break
    audit.last_modified = modified
    modified_dt = _parse_date(modified)
    if modified_dt:
        cutoff = datetime.now(timezone.utc) - timedelta(days=FRESHNESS_DAYS)
        if modified_dt.astimezone(timezone.utc) < cutoff:
            audit.flags.append(f"stale_content:{modified[:10]}")

    og_title = _meta_content(soup, prop="og:title")
    og_description = _meta_content(soup, prop="og:description")
    og_image = _meta_content(soup, prop="og:image")
    og_url = _meta_content(soup, prop="og:url")
    twitter_card = _meta_content(soup, name="twitter:card")
    missing_og = []
    if not og_title:
        missing_og.append("og:title")
    if not og_description:
        missing_og.append("og:description")
    if not og_image:
        missing_og.append("og:image")
    if not twitter_card:
        missing_og.append("twitter:card")
    if missing_og:
        audit.flags.append("missing_social_tags:" + ",".join(missing_og))

    if og_url:
        og_norm = normalize_url(og_url, url) or og_url
        canonical_norm = normalize_url(audit.canonical, url) if audit.canonical else normalize_url(url)
        if canonical_norm and og_norm != canonical_norm:
            audit.flags.append(f"og_url_canonical_mismatch:{og_norm}")

    if browser_html or googlebot_html:
        audit.flags.extend(
            compare_user_agents(
                browser_html or html,
                googlebot_html or html,
                browser_status or status_code,
                googlebot_status or status_code,
            )
        )

    return audit


def _find_json_date(node, keys: tuple[str, ...]) -> str:
    if isinstance(node, dict):
        for key in keys:
            value = node.get(key)
            if isinstance(value, str) and value:
                return value
        for value in node.values():
            found = _find_json_date(value, keys)
            if found:
                return found
    elif isinstance(node, list):
        for item in node:
            found = _find_json_date(item, keys)
            if found:
                return found
    return ""


def apply_link_checks(
    pages: dict[str, PageAudit],
    url_status: dict[str, int],
    noindex_urls: set[str],
) -> None:
    for page in pages.values():
        for target, _anchor in page.internal_links:
            status = url_status.get(target)
            if status is None:
                continue
            if status != 200:
                page.flags.append(f"broken_internal_link:{target}({status})")
            if target in noindex_urls and not is_noindex_excluded(target):
                page.flags.append(f"links_to_noindex:{target}")
