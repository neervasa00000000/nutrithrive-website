#!/usr/bin/env python3
import os, re

def get_path(file_path, script):
    depth = str(file_path).count('/') - 1
    if depth == 0: return f'shared/js/{script}'
    elif depth == 1: return f'../shared/js/{script}'
    elif depth == 2: return f'../../shared/js/{script}'
    return f'../shared/js/{script}'

def optimize_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        original = content
        changes = []
        defer_path = get_path(file_path, 'defer-loader.js')
        
        if 'defer-loader.js' not in content:
            head = re.search(r'<head[^>]*>', content, re.I)
            if head:
                content = content[:head.end()] + f'\n<script src="{defer_path}"></script>\n' + content[head.end():]
                changes.append('Added defer-loader.js')
        
        # Check if GA needs optimization
        needs_ga_opt = False
        if 'deferUntilInteraction' not in content:
            if 'window.addEventListener' in content and 'gtag' in content:
                needs_ga_opt = True
            elif 'googletagmanager.com/gtag' in content and 'deferUntilInteraction' not in content:
                needs_ga_opt = True
            elif re.search(r'<!--\s*Google tag.*?-->\s*<script>', content, re.DOTALL | re.I) and 'deferUntilInteraction' not in content:
                needs_ga_opt = True
        
        if needs_ga_opt:
            ga_script = f'''<!-- Google Analytics - Deferred until user interaction -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  if (window.DeferLoader) {{
    window.DeferLoader.deferUntilInteraction(function() {{
      window.DeferLoader.loadScript('https://www.googletagmanager.com/gtag/js?id=G-WH21SW75WP', {{
        async: true, crossorigin: 'anonymous'
      }}).then(function() {{
        gtag('js', new Date());
        gtag('config', 'G-WH21SW75WP', {{'anonymize_ip': true, 'allow_google_signals': false}});
      }}).catch(function(err) {{ console.warn('[GA] Failed to load:', err); }});
    }}, {{ once: true, passive: true }});
  }} else {{
    window.addEventListener('load', function() {{
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=G-WH21SW75WP';
      s.crossOrigin = 'anonymous';
      document.head.appendChild(s);
      gtag('js', new Date());
      gtag('config', 'G-WH21SW75WP');
    }});
  }}
</script>'''
            
            # Pattern 1: Old window.addEventListener pattern
            old_ga = re.compile(r'window\.addEventListener\([\'"]load[\'"],\s*function\(\)\s*\{.*?gtag\([\'"]config[\'"],\s*[\'"]G-WH21SW75WP[\'"]\);\s*\}\s*\);', re.DOTALL)
            if old_ga.search(content):
                # Find position after defer-loader.js or in head
                defer_pos = content.find('defer-loader.js')
                if defer_pos > 0:
                    # Find end of script tag after defer-loader
                    script_end = content.find('</script>', defer_pos) + 9
                    content = content[:script_end] + '\n' + ga_script + '\n' + content[script_end:]
                else:
                    head = re.search(r'<head[^>]*>', content, re.I)
                    if head:
                        content = content[:head.end()] + '\n' + ga_script + '\n' + content[head.end():]
                content = old_ga.sub('', content)
                changes.append('Optimized GA')
            
            # Pattern 2: Empty GA script tag or comment only
            empty_ga = re.compile(r'<!--\s*Google tag.*?-->\s*<script>\s*//\s*Defer Google Analytics loading\s*</script>', re.DOTALL | re.I)
            if empty_ga.search(content):
                defer_pos = content.find('defer-loader.js')
                if defer_pos > 0:
                    script_end = content.find('</script>', defer_pos) + 9
                    content = content[:script_end] + '\n' + ga_script + '\n' + content[script_end:]
                    content = empty_ga.sub('', content)
                    changes.append('Optimized GA (empty pattern)')
            
            # Pattern 3: Script tag with async src
            async_ga = re.compile(r'<script\s+async\s+src=[\'"]https://www\.googletagmanager\.com/gtag/js\?id=G-WH21SW75WP[\'"]></script>', re.I)
            if async_ga.search(content):
                defer_pos = content.find('defer-loader.js')
                if defer_pos > 0:
                    script_end = content.find('</script>', defer_pos) + 9
                    content = content[:script_end] + '\n' + ga_script + '\n' + content[script_end:]
                content = async_ga.sub('', content)
                changes.append('Optimized GA (async script)')
        
        newsletter_path = get_path(file_path, 'newsletter.js')
        script_js_path = get_path(file_path, 'script.js')
        if f'src="{newsletter_path}"' in content and 'deferUntilIdle' not in content:
            pattern = re.compile(rf'<script\s+src=[\'"]{re.escape(newsletter_path)}[\'"]\s+defer\s*></script>', re.I)
            replacement = f'''    <script src="{script_js_path}" defer></script>
    <script>
        if (window.DeferLoader) {{
            window.DeferLoader.deferUntilIdle(function() {{
                var s = document.createElement('script');
                s.src = '{newsletter_path}';
                s.defer = true;
                document.body.appendChild(s);
            }}, {{ timeout: 1500 }});
        }} else {{
            var s = document.createElement('script');
            s.src = '{newsletter_path}';
            s.defer = true;
            document.body.appendChild(s);
        }}
    </script>'''
            content = pattern.sub(replacement, content)
            changes.append('Optimized newsletter.js')
        
        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, changes
        return False, []
    except Exception as e:
        return False, [f'Error: {e}']

def main():
    base = os.path.dirname(os.path.abspath(__file__))
    files = []
    for root, dirs, files_list in os.walk(base):
        dirs[:] = [d for d in dirs if d not in {'node_modules', '.git', '.vscode'}]
        for f in files_list:
            if f.endswith('.html'):
                files.append(os.path.join(root, f))
    
    to_opt = [f for f in files if 'defer-loader.js' not in open(f, encoding='utf-8').read() or 'deferUntilInteraction' not in open(f, encoding='utf-8').read()]
    
    print(f'Found {len(to_opt)} files to optimize')
    if not to_opt:
        print('All optimized!')
        return
    
    for f in to_opt[:5]:
        print(f'  - {os.path.relpath(f, base)}')
    if len(to_opt) > 5:
        print(f'  ... and {len(to_opt)-5} more')
    
    if input('\nProceed? (yes/no): ').lower() != 'yes':
        return
    
    opt_count = 0
    for f in to_opt:
        success, changes = optimize_file(f)
        if success:
            opt_count += 1
            print(f'✓ {os.path.relpath(f, base)}: {", ".join(changes)}')
    
    print(f'\nOptimized {opt_count} files')

if __name__ == '__main__':
    main()
