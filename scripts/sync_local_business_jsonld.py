#!/usr/bin/env python3
"""Replace nutri-thrive-local-business-jsonld blocks sitewide with batch_local_seo.LOCAL_JSON_LD."""
from __future__ import annotations

import re
import sys
from pathlib import Path

_SCRIPTS = Path(__file__).resolve().parent
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))

import batch_local_seo as _bls

LOCAL_JSON_LD = _bls.LOCAL_JSON_LD
MARKER = _bls.MARKER
should_process = _bls.should_process

ROOT = Path(__file__).resolve().parents[1]

BLOCK_RE = re.compile(
    r"(?:<!--\s*Nutri Thrive LocalBusiness[^>]*-->\s*)?"
    r'<script type="application/ld\+json"\s+id="' + re.escape(MARKER) + r'"[\s\S]*?</script>',
    re.IGNORECASE,
)


def main() -> None:
    changed = []
    for path in sorted(ROOT.rglob("*.html")):
        if not should_process(path):
            continue
        raw = path.read_text(encoding="utf-8", errors="replace")
        if MARKER not in raw:
            continue
        new = BLOCK_RE.sub(LOCAL_JSON_LD, raw, count=1)
        if new != raw:
            path.write_text(new, encoding="utf-8")
            changed.append(path.relative_to(ROOT))
    print(f"Updated {len(changed)} files with LocalBusiness JSON-LD")
    for p in changed[:30]:
        print(" ", p)
    if len(changed) > 30:
        print(f" ... and {len(changed) - 30} more")


if __name__ == "__main__":
    main()
