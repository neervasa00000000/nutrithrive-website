#!/usr/bin/env python3
"""Write <name>-<width>.webp variants next to source images in site/.

Usage: python3 scripts/make-responsive-images.py 480,800,1200 /assets/images/og/moringa-article-1200.jpg ...
Widths larger than the source are skipped. Existing variants newer than the source are kept.
"""
import os
import sys

from PIL import Image

SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "site")
QUALITY = 72


def variant_path(src, width):
    base, _ext = os.path.splitext(src)
    return f"{base}-{width}.webp"


def main():
    widths = [int(w) for w in sys.argv[1].split(",")]
    for public in sys.argv[2:]:
        src = os.path.join(SITE, public.lstrip("/").split("?")[0])
        if not os.path.exists(src):
            print(f"missing {public}")
            continue
        with Image.open(src) as img:
            img = img.convert("RGBA") if img.mode in ("P", "LA") else img
            # A source narrower than the largest size still gets a full-width WebP candidate.
            targets = [w for w in widths if w <= img.width]
            if img.width < max(widths) and img.width not in targets:
                targets.append(img.width)
            for width in targets:
                if width > img.width:
                    continue
                out = variant_path(src, width)
                if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(src):
                    continue
                height = round(img.height * width / img.width)
                resized = img.resize((width, height), Image.LANCZOS)
                if resized.mode not in ("RGB", "RGBA"):
                    resized = resized.convert("RGB")
                resized.save(out, "WEBP", quality=QUALITY, method=6)
                print(f"{os.path.relpath(out, SITE)} {os.path.getsize(out) // 1024}KB")


if __name__ == "__main__":
    main()
