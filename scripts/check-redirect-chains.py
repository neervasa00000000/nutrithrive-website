#!/usr/bin/env python3
"""Detect redirect chains in _redirects and .netlify/netlify.toml."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REDIRECTS_FILE = ROOT / "_redirects"
NETLIFY_TOML = ROOT / ".netlify" / "netlify.toml"

REDIRECT_STATUSES = {301, 302, 303, 307, 308, 410}


def parse_redirects_file(path: Path) -> dict[str, tuple[str, int, bool, str]]:
    rules: dict[str, tuple[str, int, bool, str]] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        raw = line.strip()
        if not raw or raw.startswith("#"):
            continue
        parts = raw.split()
        if len(parts) < 3:
            continue
        src, dst, status_s = parts[0], parts[1], parts[2]
        force = status_s.endswith("!")
        code = int(status_s.rstrip("!"))
        rules[src] = (dst, code, force, "_redirects")
    return rules


def parse_netlify_toml(path: Path) -> dict[str, tuple[str, int, bool, str]]:
    rules: dict[str, tuple[str, int, bool, str]] = {}
    text = path.read_text(encoding="utf-8")
    blocks = re.split(r"\[\[redirects\]\]", text)[1:]
    for block in blocks:
        fm = re.search(r'from\s*=\s*"([^"]+)"', block)
        tm = re.search(r'to\s*=\s*"([^"]+)"', block)
        sm = re.search(r"status\s*=\s*([\d.]+)", block)
        force_m = re.search(r"force\s*=\s*(true|false)", block)
        if not (fm and tm and sm):
            continue
        src, dst = fm.group(1), tm.group(1)
        code = int(float(sm.group(1)))
        force = force_m.group(1) == "true" if force_m else False
        rules[src] = (dst, code, force, "netlify.toml")
    return rules


def merge_rules(*maps: dict) -> dict[str, tuple[str, int, bool, str]]:
    merged: dict[str, tuple[str, int, bool, str]] = {}
    for m in maps:
        merged.update(m)
    return merged


def is_redirect_hop(code: int) -> bool:
    return code in REDIRECT_STATUSES


def normalize_path(p: str) -> str:
    return p if p.startswith("/") else f"/{p}"


def find_chains(rules: dict[str, tuple[str, int, bool, str]]) -> list[list[str]]:
    redirect_only = {
        src: (dst, code, src_tag)
        for src, (dst, code, _force, src_tag) in rules.items()
        if is_redirect_hop(code)
    }
    chains: list[list[str]] = []
    seen_chain_keys: set[tuple[str, ...]] = set()

    for start in sorted(redirect_only):
        path = [start]
        current = start
        visited: set[str] = set()
        while current in redirect_only:
            if current in visited:
                cycle = path[path.index(current) :] + [current]
                key = tuple(cycle)
                if key not in seen_chain_keys:
                    seen_chain_keys.add(key)
                    chains.append(cycle)
                break
            visited.add(current)
            dst, code, _tag = redirect_only[current]
            dst = normalize_path(dst)
            if dst in redirect_only and dst != current:
                path.append(dst)
                current = dst
            else:
                break
        if len(path) > 1:
            key = tuple(path)
            if key not in seen_chain_keys:
                seen_chain_keys.add(key)
                chains.append(path)

    return chains


def final_destination(rules: dict, start: str) -> tuple[str, list[str]]:
    hops = [start]
    current = start
    visited: set[str] = set()
    while current in rules:
        dst, code, _force, _tag = rules[current]
        if not is_redirect_hop(code):
            break
        if current in visited:
            break
        visited.add(current)
        dst = normalize_path(dst)
        if dst == current:
            break
        hops.append(dst)
        current = dst
    return current, hops


def main() -> int:
    r1 = parse_redirects_file(REDIRECTS_FILE)
    r2 = parse_netlify_toml(NETLIFY_TOML)
    merged = merge_rules(r1, r2)  # toml overrides redirects on conflict

    print("=" * 72)
    print("REDIRECT CHAIN CHECK")
    print("=" * 72)
    print(f"_redirects rules:     {len(r1)}")
    print(f"netlify.toml rules:   {len(r2)}")
    print(f"Merged (toml wins):   {len(merged)}")
    print()

    chains = find_chains(merged)
    if chains:
        print(f"CHAINS FOUND: {len(chains)}")
        print("-" * 72)
        for chain in chains:
            print(" -> ".join(chain))
        print()
    else:
        print("CHAINS FOUND: 0")
        print("-" * 72)
        print("No redirect chains detected (A→B→C where B is also a redirect source).")
        print()

  # multi-hop analysis for all redirect sources
    multi_hop: list[tuple[str, list[str]]] = []
    for src in sorted(merged):
        dst, code, _f, _t = merged[src]
        if not is_redirect_hop(code):
            continue
        end, hops = final_destination(merged, src)
        if len(hops) > 2:
            multi_hop.append((src, hops))

    if multi_hop:
        print(f"MULTI-HOP PATHS (>2 hops): {len(multi_hop)}")
        for src, hops in multi_hop[:30]:
            print(f"  {' -> '.join(hops)}")
        if len(multi_hop) > 30:
            print(f"  ... and {len(multi_hop) - 30} more")
        print()
    else:
        print("MULTI-HOP PATHS (>2 hops): 0")
        print()

    # conflicts between files
    conflicts = [k for k in r1 if k in r2 and r1[k][:3] != r2[k][:3]]
    if conflicts:
        print(f"CONFLICTS (_redirects vs netlify.toml): {len(conflicts)}")
        for k in conflicts[:10]:
            print(f"  {k}")
            print(f"    _redirects: {r1[k]}")
            print(f"    netlify:    {r2[k]}")
        print()
    else:
        print("CONFLICTS (_redirects vs netlify.toml): 0")
        print()

    print("=" * 72)
    if chains or multi_hop:
        print("RESULT: FAIL — fix chains before commit")
        return 1
    print("RESULT: PASS — zero redirect chains")
    return 0


if __name__ == "__main__":
    sys.exit(main())
