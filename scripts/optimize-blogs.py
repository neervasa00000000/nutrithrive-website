#!/usr/bin/env python3
"""
Blog speed optimization for NutriThrive — applies safe performance fixes
to all 49 blog posts without any UI changes:
  1. Remove duplicate bare <link rel="icon"> tags
  2. Remove duplicate <meta name="viewport"> tags
  3. Make author-bio.min.css non-blocking (media=print pattern)
  4. Add defer to known scripts (defer-loader, reddit-pixel, body scripts)
  5. Add preconnect for Google Tag Manager where missing
  6. Add dns-prefetch for Reddit pixel where missing
"""

import os
import re

BLOG_DIR = '/Users/neervasa/Desktop/Website/blog'

# Scripts that should have defer attribute
DEFER_SCRIPTS = [
    '/scripts/global/defer-loader.min.js',
    '/scripts/global/reddit-pixel.min.js',
    '/shared/site-data.min.js',
    '/scripts/global/cart.min.js',
    '/shared/js/cart-v2-ui.min.js',
    '/shared/js/footer-v2.min.js',
    '/shared/js/author-bio.min.js',
    '/shared/js/layout-v2.min.js',
    '/shared/js/v2-site.min.js',
]


def add_defer_to_script(content, script_src):
    """Add defer attribute to a script tag if not already present."""
    escaped = re.escape(script_src)
    pattern = r'(<script\b(?:[^>]*?\s)?src=["\']' + escaped + r'["\'][^>]*)(\s*>)'

    def replacer(m):
        tag_attrs = m.group(1)
        close = m.group(2)
        # Check for defer as a standalone HTML attribute (not part of "defer-loader")
        if re.search(r'(?<![a-zA-Z0-9_-])defer(?![a-zA-Z0-9_-])', tag_attrs):
            return m.group(0)
        return tag_attrs + ' defer' + close

    return re.sub(pattern, replacer, content)


def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    changes = []

    # ──────────────────────────────────────────
    # 1. Remove duplicate bare icon tags
    # Bare form: <link rel="icon" href="/assets/images/logo/LOGO.webp"/>
    # (no type=, no sizes=, no ?v=3 query string)
    # ──────────────────────────────────────────
    bare_icon_re = re.compile(
        r'[ \t]*<link\s+rel="icon"\s+href="/assets/images/logo/LOGO\.webp"/>\n?'
    )
    has_proper_block = bool(re.search(
        r'<link[^>]*LOGO\.webp\?v=3[^>]*/>', content
    ))
    bare_icons = bare_icon_re.findall(content)

    if has_proper_block and bare_icons:
        content = bare_icon_re.sub('', content)
        changes.append(f'Removed {len(bare_icons)} bare icon tag(s) (proper favicon block exists)')
    elif len(bare_icons) > 1:
        # Keep the first one, remove the rest
        first_found = False

        def keep_first(m):
            nonlocal first_found
            if not first_found:
                first_found = True
                return m.group(0)
            return ''

        content = bare_icon_re.sub(keep_first, content)
        changes.append(f'Removed {len(bare_icons) - 1} duplicate bare icon tag(s)')

    # ──────────────────────────────────────────
    # 2. Remove duplicate <meta name="viewport"> tags
    # ──────────────────────────────────────────
    viewport_re = re.compile(
        r'[ \t]*<meta\b[^>]*\bname=["\']viewport["\'][^>]*/>\n?',
        re.IGNORECASE
    )
    viewport_matches = viewport_re.findall(content)
    if len(viewport_matches) > 1:
        first_found = False

        def keep_first_vp(m):
            nonlocal first_found
            if not first_found:
                first_found = True
                return m.group(0)
            return ''

        content = viewport_re.sub(keep_first_vp, content)
        changes.append(f'Removed {len(viewport_matches) - 1} duplicate viewport meta tag(s)')

    # ──────────────────────────────────────────
    # 3. Make author-bio.min.css non-blocking
    # ──────────────────────────────────────────
    author_blocking = '<link rel="stylesheet" href="/shared/css/author-bio.min.css"/>'
    author_nonblocking = (
        '<link rel="stylesheet" href="/shared/css/author-bio.min.css"'
        ' media="print" onload="this.media=\'all\'"/>'
        '<noscript><link rel="stylesheet" href="/shared/css/author-bio.min.css"/></noscript>'
    )
    # Only apply if not already non-blocking — the blocking form also lives inside
    # the <noscript> fallback, so guard on media="print" not being present yet
    if author_blocking in content and 'author-bio.min.css" media="print"' not in content:
        content = content.replace(author_blocking, author_nonblocking)
        changes.append('Made author-bio.min.css non-blocking')

    # ──────────────────────────────────────────
    # 4. Add defer to all known scripts
    # ──────────────────────────────────────────
    for script_src in DEFER_SCRIPTS:
        new_content = add_defer_to_script(content, script_src)
        if new_content != content:
            changes.append(f'Added defer to {os.path.basename(script_src)}')
            content = new_content

    # ──────────────────────────────────────────
    # 5. Add preconnect for Google Tag Manager
    # ──────────────────────────────────────────
    if 'googletagmanager.com' in content and 'preconnect' not in content:
        # No preconnect at all — add a small block after the inline GA script
        ga_script_end = content.find('</script>', content.find('window.dataLayer'))
        if ga_script_end > 0:
            insert_at = ga_script_end + len('</script>')
            hints = (
                '\n<link rel="preconnect" href="https://www.googletagmanager.com"/>'
                '\n<link rel="dns-prefetch" href="https://www.google-analytics.com"/>'
                '\n<link rel="dns-prefetch" href="https://www.redditstatic.com"/>'
            )
            content = content[:insert_at] + hints + content[insert_at:]
            changes.append('Added preconnect/dns-prefetch hints (GTM, GA, Reddit)')
    elif 'googletagmanager.com' in content and 'preconnect' in content:
        # Already has some preconnect — add GTM preconnect if specifically missing
        if 'preconnect" href="https://www.googletagmanager.com"' not in content and \
           'preconnect" href="https://www.googletagmanager.com/' not in content:
            # Insert GTM preconnect before first existing preconnect
            first_preconnect = content.find('<link rel="preconnect"')
            if first_preconnect > 0:
                gtm_hint = '<link rel="preconnect" href="https://www.googletagmanager.com"/>\n'
                content = content[:first_preconnect] + gtm_hint + content[first_preconnect:]
                changes.append('Added GTM preconnect hint')

    # ──────────────────────────────────────────
    # 6. Add dns-prefetch for Reddit pixel if missing
    # ──────────────────────────────────────────
    if 'redditstatic.com' not in content and 'reddit-pixel' in content:
        reddit_hint = '<link rel="dns-prefetch" href="https://www.redditstatic.com"/>\n'
        # Add after last existing resource hint, or before first <link rel="stylesheet">
        last_hint = max(
            content.rfind('<link rel="preconnect"'),
            content.rfind('<link rel="dns-prefetch"'),
        )
        if last_hint > 0:
            end_of_hint_line = content.find('\n', last_hint) + 1
            content = content[:end_of_hint_line] + reddit_hint + content[end_of_hint_line:]
            changes.append('Added dns-prefetch for Reddit pixel')

    # ──────────────────────────────────────────
    # Write if changed
    # ──────────────────────────────────────────
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return changes
    return []


def main():
    files = sorted(
        f for f in os.listdir(BLOG_DIR)
        if f.endswith('.html') and f != 'index.html'
    )

    total_files = 0
    total_changes = 0

    for filename in files:
        filepath = os.path.join(BLOG_DIR, filename)
        changes = fix_file(filepath)
        if changes:
            total_files += 1
            total_changes += len(changes)
            print(f'{filename}:')
            for c in changes:
                print(f'  ✓ {c}')

    print(f'\n── Summary ──────────────────')
    print(f'{total_files} files modified, {total_changes} total changes applied')


if __name__ == '__main__':
    main()
