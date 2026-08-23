#!/usr/bin/env python3
"""Regenerate favicon PNG/ICO assets from LOGO-120.webp for Google Search."""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets/images/logo/LOGO-120.webp"
OUT_DIR = ROOT / "assets/images/logo"
ICO_PATH = OUT_DIR / "favicon.ico"

SIZES = {
    "favicon-48.png": 48,
    "favicon-96.png": 96,
    "logo-112.png": 112,
    "apple-touch-icon.png": 180,
    "icon-192.png": 192,
}


def square_crop(img: Image.Image) -> Image.Image:
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    return img.crop((left, top, left + side, top + side))


def main() -> None:
    src = Image.open(SRC).convert("RGBA")
    src = square_crop(src)

    png_outputs = []
    for name, size in SIZES.items():
        out = OUT_DIR / name
        resized = src.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(out, format="PNG", optimize=True)
        png_outputs.append((size, resized))
        print(f"Wrote {out} ({size}x{size})")

    ico_sizes = [16, 32, 48]
    ico_images = [src.resize((s, s), Image.Resampling.LANCZOS) for s in ico_sizes]
    ico_images[0].save(
        ICO_PATH,
        format="ICO",
        sizes=[(s, s) for s in ico_sizes],
        append_images=ico_images[1:],
    )
    print(f"Wrote {ICO_PATH} ({', '.join(f'{s}x{s}' for s in ico_sizes)})")


if __name__ == "__main__":
    main()
