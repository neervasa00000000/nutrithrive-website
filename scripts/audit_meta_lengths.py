#!/usr/bin/env python3
"""List HTML files where meta description length (raw attribute) exceeds limit."""
import re
from pathlib import Path

LIMIT = 155
rows = []
for p in Path(".").rglob("*.html"):
    s = str(p)
    if "node_modules" in s or "/.git/" in s:
        continue
    try:
        t = p.read_text(encoding="utf-8", errors="replace")
    except OSError:
        continue
    if 'name="description"' not in t and "name='description'" not in t:
        continue
    for m in re.finditer(
        r'<meta\s+[^>]*name=["\']description["\'][^>]*>', t, re.I
    ):
        tag = m.group(0)
        cm = re.search(r'content=["\']([^"\']*)["\']', tag, re.I)
        if not cm:
            continue
        raw = cm.group(1)
        n = len(raw)
        if n > LIMIT:
            rows.append((n, p, raw))

rows.sort(key=lambda x: -x[0])
for n, p, raw in rows:
    print(f"{n:3d}  {p}")
    print(f"     {raw[:180]}{'...' if len(raw) > 180 else ''}")

print(f"\nTotal over {LIMIT} chars: {len(rows)}")
