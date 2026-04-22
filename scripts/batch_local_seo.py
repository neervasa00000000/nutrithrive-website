#!/usr/bin/env python3
"""Inject local SEO: LocalBusiness JSON-LD, title suffix, meta tail, footer NAP."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

MARKER = "nutri-thrive-local-business-jsonld"
NAP_MARKER = "footer-nap-standard"

LOCAL_JSON_LD = f"""
<!-- Nutri Thrive LocalBusiness (same @id as sitewide graph; valid LocalBusiness fields only) -->
<script type="application/ld+json" id="{MARKER}">
{{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://nutrithrive.com.au/#localbusiness",
  "name": "Nutri Thrive",
  "image": "https://nutrithrive.com.au/assets/images/logo/LOGO.webp",
  "url": "https://nutrithrive.com.au/",
  "telephone": "+61438201419",
  "email": "nutrithrive0@gmail.com",
  "description": "Premium moringa powder, Darjeeling black tea, dried curry leaves and natural soaps from Truganina, Melbourne. Lab-tested, vegan-friendly. Local support for Truganina and greater Melbourne, plus Australia-wide shipping (free standard on orders AUD 80 and over) and international shipping from published rate tables at checkout.",
  "identifier": {{
    "@type": "PropertyValue",
    "propertyID": "ABN",
    "value": "32 639 442 616"
  }},
  "address": {{
    "@type": "PostalAddress",
    "streetAddress": "15 Europe Street",
    "addressLocality": "Truganina",
    "addressRegion": "VIC",
    "postalCode": "3029",
    "addressCountry": "AU"
  }},
  "geo": {{
    "@type": "GeoCoordinates",
    "latitude": -37.8323773,
    "longitude": 144.7187983
  }},
  "hasMap": "https://www.google.com/maps/search/?api=1&query=15+Europe+Street%2C+Truganina+VIC+3029%2C+Australia",
  "openingHoursSpecification": [{{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "09:00",
    "closes": "23:00"
  }}],
  "areaServed": [
    {{ "@type": "City", "name": "Truganina" }},
    {{ "@type": "City", "name": "Melbourne" }},
    {{ "@type": "AdministrativeArea", "name": "Victoria" }},
    {{ "@type": "Country", "name": "Australia" }},
    {{ "@type": "Place", "name": "Worldwide" }}
  ],
  "serviceArea": [
    {{ "@type": "City", "name": "Truganina" }},
    {{ "@type": "City", "name": "Melbourne" }},
    {{ "@type": "City", "name": "Werribee" }},
    {{ "@type": "City", "name": "Tarneit" }},
    {{ "@type": "City", "name": "Point Cook" }},
    {{ "@type": "City", "name": "Hoppers Crossing" }},
    {{ "@type": "City", "name": "Laverton" }},
    {{ "@type": "AdministrativeArea", "name": "Victoria" }}
  ],
  "sameAs": [
    "https://www.facebook.com/nutrithrive",
    "https://www.instagram.com/nutri__thrive/"
  ]
}}
</script>
""".strip()

NAP_LI = (
    '<li class="footer-nap-standard">Nutri Thrive<br>'
    "Truganina VIC 3029, Melbourne, Australia<br>"
    'Phone: <a href="tel:+61438201419">0438 201 419</a></li>'
)

NAP_SIMPLE = (
    '<p class="footer-nap-standard" style="margin:0 0 0.75rem;line-height:1.6">Nutri Thrive<br>'
    "Truganina VIC 3029, Melbourne, Australia<br>"
    'Phone: <a href="tel:+61438201419">0438 201 419</a></p>'
)

SKIP_NAMES = {"moringa-melbourne-report-head.inc.html"}

TITLE_SUFFIX = " | Nutri Thrive, Melbourne"
META_TAIL = " Nutri Thrive, Truganina Melbourne — premium moringa powder, shipped Australia-wide."


def has_local_title(title_inner: str) -> bool:
    t = title_inner.lower()
    if "melbourne" in t or "truganina" in t:
        return True
    if "\u58a8\u5c14\u672c" in title_inner:  # Melbourne in Chinese
        return True
    if "\u7ef4\u591a\u5229\u4e9a" in title_inner:  # Victoria in Chinese
        return True
    return False


def inject_before_head_close(html: str, fragment: str) -> str:
    idx = html.lower().rfind("</head>")
    if idx == -1:
        return html
    return html[:idx] + "\n" + fragment + "\n" + html[idx:]


def inject_schema(html: str) -> str:
    if MARKER in html:
        return html
    return inject_before_head_close(html, LOCAL_JSON_LD)


def fix_title(html: str) -> str:
    def repl(m: re.Match) -> str:
        inner = m.group(1)
        if has_local_title(inner):
            return m.group(0)
        if TITLE_SUFFIX.strip(" |") in inner:
            return m.group(0)
        return f"<title>{inner}{TITLE_SUFFIX}</title>"

    return re.sub(r"<title>([^<]*)</title>", repl, html, count=1, flags=re.IGNORECASE)


def fix_meta_description(html: str) -> str:
    def bump_content(content: str) -> str:
        c = content
        low = c.lower()
        if "truganina" in low and "melbourne" in low:
            return c
        if "melbourne" in low and "nutri" in low:
            return c
        if len(c) + len(META_TAIL) > 300:
            tail = " Nutri Thrive, Truganina Melbourne."
        else:
            tail = META_TAIL
        return (c + tail).strip()

    def repl_dq(m: re.Match) -> str:
        return f'<meta name="description" content="{bump_content(m.group(1))}">'

    def repl_sq(m: re.Match) -> str:
        return f"<meta name='description' content='{bump_content(m.group(1))}'>"

    out = html
    if re.search(r'<meta\s+name="description"\s+content="', out, re.I):
        out = re.sub(
            r'<meta\s+name="description"\s+content="([^"]*)"\s*/?>',
            repl_dq,
            out,
            count=1,
            flags=re.I,
        )
    elif re.search(r"<meta\s+name='description'\s+content='", out, re.I):
        out = re.sub(
            r"<meta\s+name='description'\s+content='([^']*)'\s*/?>",
            repl_sq,
            out,
            count=1,
            flags=re.I,
        )
    return out


def inject_footer_nap_business_info(html: str) -> str:
    if NAP_MARKER in html:
        return html
    pattern = re.compile(
        r'(<h3>\s*Business Info\s*</h3>\s*<ul\s+class="footer-links">\s*)',
        re.I,
    )
    if pattern.search(html):
        return pattern.sub(r"\1" + NAP_LI + "\n", html, count=1)
    return html


def inject_simple_footer_nap(html: str) -> str:
    if NAP_MARKER in html:
        return html
    if "Business Info" in html:
        return html
    pattern = re.compile(r"(<footer[^>]*>\s*)(<p[^>]*>\s*©)", re.I)
    if pattern.search(html):
        return pattern.sub(r"\1" + NAP_SIMPLE + "\n\2", html, count=1)
    return html


def should_process(path: Path) -> bool:
    if path.suffix.lower() != ".html":
        return False
    if path.name in SKIP_NAMES:
        return False
    parts = path.parts
    if "node_modules" in parts:
        return False
    return True


def main() -> None:
    changed = []
    for path in sorted(ROOT.rglob("*.html")):
        if not should_process(path):
            continue
        raw = path.read_text(encoding="utf-8", errors="replace")
        orig = raw
        raw = inject_schema(raw)
        raw = fix_title(raw)
        raw = fix_meta_description(raw)
        raw = inject_footer_nap_business_info(raw)
        raw = inject_simple_footer_nap(raw)
        if raw != orig:
            path.write_text(raw, encoding="utf-8")
            changed.append(path.relative_to(ROOT))
    print(f"Updated {len(changed)} files")
    for p in changed[:25]:
        print(" ", p)
    if len(changed) > 25:
        print(f" ... and {len(changed) - 25} more")


if __name__ == "__main__":
    main()
