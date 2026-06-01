#!/usr/bin/env python3
"""Apply site-header/site-footer includes and global.css to production HTML files."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {
    ".git",
    ".netlify-publish",
    ".firecrawl",
    "node_modules",
    "scripts/templates",
    "nutrithrive_labs",
    "tools",
}
SKIP_FILES = {
    "index-directory.partial.html",
    "author-bio.html",
    "moringa-melbourne-report-head.inc.html",
    "quit-sugar-article-body.html",
}

GLOBAL_CSS = '<link rel="stylesheet" href="/assets/css/global.css"/>'
SITE_INCLUDES_SCRIPT = """<script src="/assets/js/site-includes.js" defer></script>"""

HEADER_PLACEHOLDER = '<div id="site-header"></div>'
FOOTER_PLACEHOLDER = '<div id="site-footer"></div>'

HEADER_PATTERNS = [
    re.compile(
        r"<div\s+class=[\"']nt-sticky-top[\"'][^>]*>\s*<header\s+id=[\"']nt-header[\"'][^>]*>\s*</header>\s*</div>",
        re.I | re.S,
    ),
    re.compile(r"<header\s+id=[\"']nt-header[\"'][^>]*>\s*</header>", re.I | re.S),
    re.compile(
        r"<header[^>]*>.*?</header>",
        re.I | re.S,
    ),
]

FOOTER_PATTERNS = [
    re.compile(r"<footer[^>]*>.*?</footer>", re.I | re.S),
    re.compile(r'<div\s+id="nt-footer"[^>]*>\s*</div>', re.I),
]

REMOVE_SCRIPTS = [
    "layout-v2.min.js",
    "layout-v2.js",
    "footer-v2.min.js",
    "footer-v2.js",
    "v2-site.min.js",
]


def should_process(path: Path) -> bool:
    if path.suffix.lower() != ".html":
        return False
    if path.name in SKIP_FILES:
        return False
    for part in path.parts:
        if part in SKIP_DIRS:
            return False
    return True


def add_global_css(html: str) -> str:
    if "global.css" in html:
        return html
    if "</head>" in html:
        return html.replace("</head>", f"  {GLOBAL_CSS}\n</head>", 1)
    return html


def replace_header(html: str) -> str:
    if 'id="site-header"' in html:
        # Remove duplicate old headers if site-header exists elsewhere
        pass
    for pat in HEADER_PATTERNS:
        m = pat.search(html)
        if m:
            block = m.group(0)
            # Skip in-article <header> (blog hero) — only replace site chrome headers
            if 'class="navbar"' in block or "urgency-banner" in block or 'id="nt-header"' in block or (
                "nav-links" in block and "hero-title" not in block
            ):
                html = html[: m.start()] + HEADER_PLACEHOLDER + html[m.end() :]
                return html
    # nt-header empty without wrapper
    if '<header id="nt-header"' in html and HEADER_PLACEHOLDER not in html:
        html = re.sub(
            r"<div\s+class=[\"']nt-sticky-top[\"'][^>]*>\s*",
            "",
            html,
            count=1,
            flags=re.I,
        )
        html = re.sub(r"<header\s+id=[\"']nt-header[\"'][^>]*>\s*</header>", HEADER_PLACEHOLDER, html, count=1, flags=re.I)
    return html


def replace_footer(html: str) -> str:
    html = re.sub(r'<div\s+id="nt-footer"[^>]*>\s*</div>', FOOTER_PLACEHOLDER, html, flags=re.I)
    for pat in FOOTER_PATTERNS:
        m = pat.search(html)
        if m and "site-footer" in m.group(0):
            continue
        if m and ("nt-footer" in m.group(0) or "footer-grid" in m.group(0) or "nt-v2-footer" in m.group(0)):
            html = html[: m.start()] + FOOTER_PLACEHOLDER + html[m.end() :]
            break
    if 'id="site-footer"' not in html and FOOTER_PLACEHOLDER not in html:
        if "</body>" in html:
            html = html.replace("</body>", f"\n{FOOTER_PLACEHOLDER}\n</body>", 1)
    return html


def strip_old_scripts(html: str) -> str:
    for name in REMOVE_SCRIPTS:
        html = re.sub(
            rf'\s*<script[^>]*src=["\'][^"\']*{re.escape(name)}["\'][^>]*>\s*</script>\s*',
            "\n",
            html,
            flags=re.I,
        )
    return html


def add_includes_script(html: str) -> str:
    if "site-includes.js" in html:
        return html
    if "</body>" in html:
        return html.replace("</body>", f"\n{SITE_INCLUDES_SCRIPT}\n</body>", 1)
    return html


def process_file(path: Path) -> bool:
    original = path.read_text(encoding="utf-8", errors="replace")
    html = original
    html = add_global_css(html)
    html = replace_header(html)
    html = replace_footer(html)
    html = strip_old_scripts(html)
    html = add_includes_script(html)
    if html != original:
        path.write_text(html, encoding="utf-8")
        return True
    return False


def main():
    updated = []
    for path in sorted(ROOT.rglob("*.html")):
        if not should_process(path):
            continue
        if process_file(path):
            updated.append(str(path.relative_to(ROOT)))
    print(f"Updated {len(updated)} files")
    for f in updated:
        print(f"  {f}")


if __name__ == "__main__":
    main()
