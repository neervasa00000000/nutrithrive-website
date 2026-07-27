#!/usr/bin/env python3
"""Sync .netlify/netlify.toml [[redirects]] blocks from root _redirects."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REDIRECTS = ROOT / "_redirects"
TOML = ROOT / ".netlify" / "netlify.toml"


def parse_redirects() -> dict[str, tuple[str, int, bool]]:
    rules: dict[str, tuple[str, int, bool]] = {}
    for line in REDIRECTS.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split()
        if len(parts) < 3:
            continue
        src, dst, status = parts[0], parts[1], parts[2]
        force = status.endswith("!")
        code = int(status.rstrip("!"))
        rules[src] = (dst, code, force)
    return rules


def main() -> None:
    rules = parse_redirects()
    text = TOML.read_text(encoding="utf-8")
    pattern = re.compile(
        r'\[\[redirects\]\]\nfrom = "([^"]+)"\nto = "[^"]*"\nstatus = [^\n]+\nforce = (?:true|false)',
        re.MULTILINE,
    )
    updated = 0

    def repl(match: re.Match[str]) -> str:
        nonlocal updated
        src = match.group(1)
        if src not in rules:
            return match.group(0)
        dst, code, force = rules[src]
        updated += 1
        return (
            f'[[redirects]]\nfrom = "{src}"\nto = "{dst}"\nstatus = {float(code)}\nforce = {str(force).lower()}'
        )

    new_text = pattern.sub(repl, text)
    TOML.write_text(new_text, encoding="utf-8")
    print(f"Updated {updated} redirect blocks in netlify.toml")


if __name__ == "__main__":
    main()
