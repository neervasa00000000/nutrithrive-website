"""URL discovery, robots.txt checks, and HTTP fetching."""

from __future__ import annotations

import time
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from urllib.parse import urljoin
from urllib.robotparser import RobotFileParser

import requests
from bs4 import BeautifulSoup

from config import (
    BROWSER_UA,
    CRAWL_MAX_DEPTH,
    GOOGLEBOT_UA,
    REQUEST_DELAY_SECONDS,
)
from utils import INTERNAL_DOMAIN, normalize_url


@dataclass
class FetchResult:
    url: str
    status_code: int
    final_url: str
    html: str
    redirect_chain: list[tuple[str, int]] = field(default_factory=list)
    error: str | None = None


@dataclass
class RobotsReport:
    blog_disallowed: bool
    disallowed_blog_paths: list[str]
    blocked_sitemap_urls: list[str]
    raw_text: str


class SiteCrawler:
    def __init__(self, base_url: str, delay: float = REQUEST_DELAY_SECONDS):
        self.base_url = base_url.rstrip("/") or "https://nutrithrive.com.au"
        self.delay = delay
        self.session = requests.Session()
        self.session.headers.update({"Accept": "text/html,application/xhtml+xml"})
        self.robots = RobotFileParser()
        self.robots_report: RobotsReport | None = None

    def _sleep(self) -> None:
        time.sleep(self.delay)

    def fetch(
        self,
        url: str,
        user_agent: str,
        *,
        allow_redirects: bool = True,
        track_chain: bool = False,
    ) -> FetchResult:
        headers = {"User-Agent": user_agent}
        chain: list[tuple[str, int]] = []
        current = url
        html = ""
        status = 0
        error = None

        try:
            for _ in range(12):
                self._sleep()
                response = self.session.get(
                    current,
                    headers=headers,
                    timeout=30,
                    allow_redirects=False,
                )
                status = response.status_code
                if track_chain:
                    chain.append((current, status))

                if allow_redirects and status in {301, 302, 303, 307, 308}:
                    location = response.headers.get("Location")
                    if not location:
                        break
                    current = urljoin(current, location)
                    continue

                html = response.text if "text/html" in response.headers.get("Content-Type", "") else ""
                final_url = normalize_url(response.url, current) or normalize_url(current) or current
                return FetchResult(
                    url=url,
                    status_code=status,
                    final_url=final_url,
                    html=html,
                    redirect_chain=chain,
                    error=error,
                )
        except requests.RequestException as exc:
            error = str(exc)
            return FetchResult(
                url=url,
                status_code=0,
                final_url=url,
                html="",
                redirect_chain=chain,
                error=error,
            )

        final_url = normalize_url(current) or current
        return FetchResult(
            url=url,
            status_code=status,
            final_url=final_url,
            html=html,
            redirect_chain=chain,
            error=error,
        )

    def load_robots(self) -> RobotsReport:
        robots_url = f"{self.base_url}/robots.txt"
        self._sleep()
        response = self.session.get(robots_url, headers={"User-Agent": BROWSER_UA}, timeout=30)
        raw = response.text
        self.robots.parse(raw.splitlines())

        blog_disallowed = not self.robots.can_fetch(GOOGLEBOT_UA, f"{self.base_url}/blog/")
        disallowed_blog_paths: list[str] = []
        for sample in (
            "/blog/",
            "/blog/how-to-add-moringa-to-diet",
            "/blog/is-moringa-banned-in-australia",
        ):
            if not self.robots.can_fetch(GOOGLEBOT_UA, f"{self.base_url}{sample}"):
                disallowed_blog_paths.append(sample)

        report = RobotsReport(
            blog_disallowed=blog_disallowed,
            disallowed_blog_paths=disallowed_blog_paths,
            blocked_sitemap_urls=[],
            raw_text=raw,
        )
        self.robots_report = report
        return report

    def parse_sitemap(self) -> set[str]:
        sitemap_url = f"{self.base_url}/sitemap.xml"
        self._sleep()
        response = self.session.get(sitemap_url, headers={"User-Agent": BROWSER_UA}, timeout=30)
        response.raise_for_status()
        root = ET.fromstring(response.content)
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        urls: set[str] = set()
        for loc in root.findall(".//sm:loc", ns):
            if loc.text:
                normalized = normalize_url(loc.text.strip())
                if normalized:
                    urls.add(normalized)
        if not urls:
            for loc in root.findall(".//loc"):
                if loc.text:
                    normalized = normalize_url(loc.text.strip())
                    if normalized:
                        urls.add(normalized)
        return urls

    def crawl_links(self, seeds: list[str]) -> set[str]:
        discovered: set[str] = set()
        queue: list[tuple[str, int]] = [(normalize_url(seed, self.base_url) or seed, 0) for seed in seeds]
        seen: set[str] = set()

        while queue:
            url, depth = queue.pop(0)
            if not url or url in seen:
                continue
            seen.add(url)
            discovered.add(url)
            if depth >= CRAWL_MAX_DEPTH:
                continue

            result = self.fetch(url, BROWSER_UA, allow_redirects=True)
            if result.error or result.status_code >= 400 or not result.html:
                continue

            soup = BeautifulSoup(result.html, "lxml")
            for anchor in soup.find_all("a", href=True):
                href = anchor["href"]
                normalized = normalize_url(href, result.final_url)
                if not normalized:
                    continue
                if normalized not in seen:
                    queue.append((normalized, depth + 1))

        return discovered

    def discover_urls(self) -> tuple[set[str], set[str], set[str], set[str]]:
        sitemap_urls = self.parse_sitemap()
        crawl_urls = self.crawl_links([self.base_url, f"{self.base_url}/blog/"])
        only_sitemap = sorted(sitemap_urls - crawl_urls)
        only_crawl = sorted(crawl_urls - sitemap_urls)
        all_urls = sorted(sitemap_urls | crawl_urls)
        return set(all_urls), set(only_sitemap), set(only_crawl), sitemap_urls

    def mark_robots_blocked_sitemap(self, sitemap_urls: set[str]) -> list[str]:
        blocked: list[str] = []
        for url in sorted(sitemap_urls):
            if not self.robots.can_fetch(GOOGLEBOT_UA, url):
                blocked.append(url)
        if self.robots_report:
            self.robots_report.blocked_sitemap_urls = blocked
        return blocked

    def fetch_dual(self, url: str) -> tuple[FetchResult, FetchResult]:
        browser = self.fetch(url, BROWSER_UA, allow_redirects=True)
        googlebot = self.fetch(url, GOOGLEBOT_UA, allow_redirects=True)
        return browser, googlebot

    def fetch_redirect_chain(self, url: str) -> list[tuple[str, int]]:
        result = self.fetch(url, GOOGLEBOT_UA, allow_redirects=False, track_chain=True)
        return result.redirect_chain
