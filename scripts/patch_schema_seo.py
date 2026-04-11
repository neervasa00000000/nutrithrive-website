#!/usr/bin/env python3
"""One-off fixes: dedupe index.html head schemas; enrich @graph offers; sync LocalBusiness."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"

# From scripts/global/shipping-rates.js — Australia Post table (GREEN), zone 1 (metro VIC example)
AUD_SHIPPING_BY_SKU_HINT = {
    "NT-MOR-400G": "13.73",  # 501g–1kg band
    "NT-MOR-200G": "10.04",  # 251g–500g
    "NT-COMBO-MS-195G": "10.04",
}
AUD_SHIPPING_DEFAULT = "8.73"  # up to 250 g zone 1

RETURN_POLICY = """          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "AU",
            "returnPolicyCountry": "AU",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays": 7,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn",
            "returnPolicyUrl": "https://nutrithrive.com.au/pages/shipping/shipping-returns"
          },"""

DELIVERY_BLOCK = """            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 2, "unitCode": "DAY" },
              "transitTime": { "@type": "QuantitativeValue", "minValue": 3, "maxValue": 10, "unitCode": "DAY" }
            }"""

WW_DELIVERY_BLOCK = """            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 2, "unitCode": "DAY" },
              "transitTime": { "@type": "QuantitativeValue", "minValue": 5, "maxValue": 21, "unitCode": "DAY" }
            }"""


def aud_rate_for_offer(block: str) -> str:
    m = re.search(r'"sku"\s*:\s*"([^"]+)"', block)
    if m:
        sku = m.group(1)
        return AUD_SHIPPING_BY_SKU_HINT.get(sku, AUD_SHIPPING_DEFAULT)
    return AUD_SHIPPING_DEFAULT


def inject_offer_fixes(graph: str) -> str:
    """Add return policy, shippingRate on AU rows, fix unitCode d->DAY, add free-shipping AU row."""
    graph = graph.replace('"unitCode": "d"', '"unitCode": "DAY"')

    parts = re.split(r'(\{\s*"@type"\s*:\s*"Offer"\s*,)', graph)
    out = [parts[0]]
    i = 1
    while i < len(parts):
        sep = parts[i]
        rest = parts[i + 1] if i + 1 < len(parts) else ""
        chunk = sep + rest
        if '"@type": "Offer"' in sep and '"priceCurrency": "AUD"' in chunk:
            sku_rate = aud_rate_for_offer(chunk)
            if "hasMerchantReturnPolicy" not in chunk:
                chunk = re.sub(
                    r'(\n\s*"shippingDetails"\s*:)',
                    f'\n{RETURN_POLICY}\n\\1',
                    chunk,
                    count=1,
                )
            if '"shippingDetails"' in chunk and "shippingRate" not in chunk:
                au_details = (
                    f'\n          "shippingDetails": [\n'
                    f'            {{\n'
                    f'              "@type": "OfferShippingDetails",\n'
                    f'              "name": "Australia — from published rate table (example zone 1); free standard shipping on orders AUD 80+",\n'
                    f'              "shippingRate": {{ "@type": "MonetaryAmount", "value": "{sku_rate}", "currency": "AUD" }},\n'
                    f'              "shippingDestination": {{ "@type": "DefinedRegion", "addressCountry": "AU" }},\n'
                    f"{DELIVERY_BLOCK}\n"
                    f"            }},\n"
                    f"            {{\n"
                    f'              "@type": "OfferShippingDetails",\n'
                    f'              "name": "Australia — free standard shipping when order total is AUD 80 or more",\n'
                    f'              "shippingRate": {{ "@type": "MonetaryAmount", "value": "0", "currency": "AUD" }},\n'
                    f'              "shippingDestination": {{ "@type": "DefinedRegion", "addressCountry": "AU" }},\n'
                    f"{DELIVERY_BLOCK}\n"
                    f"            }},\n"
                    f"            {{\n"
                    f'              "@type": "OfferShippingDetails",\n'
                    f'              "name": "International — from published rate table (varies by country/weight)",\n'
                    f'              "shippingRate": {{ "@type": "MonetaryAmount", "value": "15.49", "currency": "AUD" }},\n'
                    f'              "shippingDestination": {{ "@type": "DefinedRegion", "name": "Worldwide" }},\n'
                    f"{WW_DELIVERY_BLOCK}\n"
                    f"            }}\n"
                    f"          ]"
                )
                chunk = re.sub(
                    r'\n\s*"shippingDetails"\s*:\s*\[[\s\S]*?\]\s*',
                    au_details + "\n",
                    chunk,
                    count=1,
                )
        out.append(chunk)
        i += 2
    return "".join(out)


def _matching_bracket_end(s: str, open_bracket_at: int) -> int:
    """Index of matching `]` for `[` at open_bracket_at; respects JSON strings."""
    depth = 0
    i = open_bracket_at
    in_str = False
    esc = False
    while i < len(s):
        c = s[i]
        if in_str:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == '"':
                in_str = False
            i += 1
            continue
        if c == '"':
            in_str = True
            i += 1
            continue
        if c == "[":
            depth += 1
        elif c == "]":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return -1


def patch_index_graph(text: str) -> str:
    m = re.search(
        r'(<script type="application/ld\+json">\s*\{\s*"@context": "https://schema.org",\s*"@graph": \[)',
        text,
    )
    if not m:
        return text
    start = m.end() - 1
    end = _matching_bracket_end(text, start)
    if end < 0:
        return text
    graph_inner = text[start : end + 1]
    graph_inner = inject_offer_fixes(graph_inner)

    graph_inner = graph_inner.replace(
        '"opens": "00:00",\n          "closes": "24:00"',
        '"opens": "09:00",\n          "closes": "23:00"',
    )
    graph_inner = graph_inner.replace(
        '"email": "support@nutrithrive.com.au"',
        '"email": "nutrithrive0@gmail.com"',
    )

    lb = re.search(
        r'(\{\s*"@type": "LocalBusiness"[\s\S]*?"areaServed": \[[^\]]+\]\s*)',
        graph_inner,
    )
    if lb and '"hasMap"' not in graph_inner:
        insert = (
            ',\n      "identifier": {\n'
            '        "@type": "PropertyValue",\n'
            '        "propertyID": "ABN",\n'
            '        "value": "32 639 442 616"\n'
            "      },\n"
            '      "email": "nutrithrive0@gmail.com",\n'
            '      "hasMap": "https://www.google.com/maps/search/?api=1&query=Ridley+Place%2C+Truganina+VIC+3029%2C+Australia"'
        )
        graph_inner = graph_inner[: lb.end(1)] + insert + graph_inner[lb.end(1) :]

    return text[:start] + graph_inner + text[end + 1 :]


def remove_index_duplicate_schemas(text: str) -> str:
    """Remove second LocalBusiness, Organization, Product blocks before </head>."""
    pattern = re.compile(
        r"\n<!-- Local Business Schema -->\s*<script type=\"application/ld\+json\"[\s\S]*?"
        r"</script>\s*<!-- Organization Schema \(Site name / Logo / E-E-A-T\) -->\s*<script type=\"application/ld\+json\"[\s\S]*?"
        r"</script>\s*<!-- Product Schema with Star Rating & Merchant Listing -->\s*<script type=\"application/ld\+json\"[\s\S]*?</script>",
        re.MULTILINE,
    )
    return pattern.sub("", text, count=1)


def main() -> None:
    raw = INDEX.read_text(encoding="utf-8")
    orig = raw
    raw = patch_index_graph(raw)
    raw = remove_index_duplicate_schemas(raw)
    if raw != orig:
        INDEX.write_text(raw, encoding="utf-8")
        print("Patched index.html")
    else:
        print("No changes to index.html")


if __name__ == "__main__":
    main()
