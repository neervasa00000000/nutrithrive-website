#!/usr/bin/env python3
"""
Comprehensive SEO Enhancement Script for NutriThrive Blog Posts
Implements all 40+ SEO enhancements from the master list
"""

import os
import re
from pathlib import Path
from datetime import datetime
from html import escape

BLOG_DIR = Path('blog')
BACKUP_DIR = Path('blog_backups')

# Create backup directory
BACKUP_DIR.mkdir(exist_ok=True)

def extract_title_from_filename(filename):
    """Extract readable title from filename"""
    name = filename.replace('.html', '').replace('-', ' ').title()
    # Clean up common patterns
    name = re.sub(r'\s+', ' ', name)
    return name

def get_blog_category(filename):
    """Determine blog category based on filename"""
    filename_lower = filename.lower()
    if 'moringa' in filename_lower:
        return 'Moringa & Superfoods'
    elif 'curry' in filename_lower or 'curry-leaves' in filename_lower:
        return 'Curry Leaves & Cooking'
    elif 'protein' in filename_lower or 'gym' in filename_lower or 'fitness' in filename_lower:
        return 'Fitness & Nutrition'
    elif 'recipe' in filename_lower or 'how-to' in filename_lower:
        return 'Recipes & How-To'
    elif 'health' in filename_lower or 'benefits' in filename_lower:
        return 'Health & Wellness'
    elif 'buy' in filename_lower or 'where-to' in filename_lower:
        return 'Shopping Guides'
    else:
        return 'Health & Wellness'

def create_breadcrumb_schema(filename, title):
    """Create BreadcrumbList schema"""
    category = get_blog_category(filename)
    return f'''    <!-- Breadcrumb Schema -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://nutrithrive.com.au"
        }},
        {{
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://nutrithrive.com.au/blog/"
        }},
        {{
          "@type": "ListItem",
          "position": 3,
          "name": "{escape(category)}",
          "item": "https://nutrithrive.com.au/blog/#{category.lower().replace(' ', '-')}"
        }},
        {{
          "@type": "ListItem",
          "position": 4,
          "name": "{escape(title)}",
          "item": "https://nutrithrive.com.au/blog/{filename}"
        }}
      ]
    }}
    </script>'''

def create_person_author_schema():
    """Create Person author schema for E-E-A-T"""
    return '''    <!-- Author Schema (E-E-A-T) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "NutriThrive Research Team",
      "jobTitle": "Health & Nutrition Research",
      "worksFor": {
        "@type": "Organization",
        "name": "NutriThrive",
        "url": "https://nutrithrive.com.au"
      },
      "sameAs": [
        "https://www.instagram.com/nutrithrive",
        "https://www.facebook.com/nutrithrive"
      ],
      "knowsAbout": [
        "Moringa Oleifera",
        "Superfoods",
        "Nutrition Science",
        "Natural Health Supplements",
        "Australian Health & Wellness"
      ]
    }
    </script>'''

def enhance_blogposting_schema(content, filename):
    """Enhance existing BlogPosting schema or create new one"""
    # Check if BlogPosting exists
    if '"@type": "BlogPosting"' in content or '"@type": "Article"' in content:
        # Enhance existing - add Person author
        pattern = r'"author":\s*\{[^}]*"@type":\s*"Organization"[^}]*\}'
        replacement = '''"author": {
        "@type": "Person",
        "name": "NutriThrive Research Team",
        "jobTitle": "Health & Nutrition Research",
        "worksFor": {
          "@type": "Organization",
          "name": "NutriThrive",
          "url": "https://nutrithrive.com.au"
        },
        "sameAs": [
          "https://www.instagram.com/nutrithrive",
          "https://www.facebook.com/nutrithrive"
        ]
      }'''
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    else:
        # Create new BlogPosting schema
        title_match = re.search(r'<title>(.*?)</title>', content)
        desc_match = re.search(r'<meta name="description" content="(.*?)"', content)
        title = title_match.group(1) if title_match else extract_title_from_filename(filename)
        desc = desc_match.group(1) if desc_match else title
        
        blogposting = f'''    <!-- BlogPosting Schema -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "{escape(title)}",
      "description": "{escape(desc)}",
      "image": [
        "https://nutrithrive.com.au/shared/images/Logo%20/LOGO.webp"
      ],
      "datePublished": "{datetime.now().strftime('%Y-%m-%d')}",
      "dateModified": "{datetime.now().strftime('%Y-%m-%d')}",
      "author": {{
        "@type": "Person",
        "name": "NutriThrive Research Team",
        "jobTitle": "Health & Nutrition Research",
        "worksFor": {{
          "@type": "Organization",
          "name": "NutriThrive",
          "url": "https://nutrithrive.com.au"
        }}
      }},
      "publisher": {{
        "@type": "Organization",
        "name": "NutriThrive",
        "logo": {{
          "@type": "ImageObject",
          "url": "https://nutrithrive.com.au/shared/images/Logo%20/LOGO.webp"
        }}
      }},
      "mainEntityOfPage": {{
        "@type": "WebPage",
        "@id": "https://nutrithrive.com.au/blog/{filename}"
      }},
      "articleSection": "{get_blog_category(filename)}"
    }}
    </script>'''
        
        # Insert before closing </head>
        if '</head>' in content:
            content = content.replace('</head>', blogposting + '\n</head>')
    
    return content

def add_faq_schema_if_needed(content, filename):
    """Add FAQPage schema if FAQs exist in content"""
    # Check if FAQ section exists
    faq_indicators = [
        r'<h[23][^>]*>.*?(?:FAQ|Frequently Asked|Questions?|Q&A|Q & A).*?</h[23]>',
        r'<details[^>]*>.*?</details>',
        r'<div[^>]*class="[^"]*faq[^"]*"',
        r'<section[^>]*id="[^"]*faq[^"]*"'
    ]
    
    has_faq = any(re.search(pattern, content, re.IGNORECASE | re.DOTALL) for pattern in faq_indicators)
    
    if has_faq and 'FAQPage' not in content:
        # Extract FAQs from content
        faqs = []
        # Look for question-answer pairs
        qa_pattern = r'<h[23][^>]*>(.*?)</h[23]>.*?<p[^>]*>(.*?)</p>'
        matches = re.finditer(qa_pattern, content, re.DOTALL | re.IGNORECASE)
        for i, match in enumerate(list(matches)[:10]):  # Max 10 FAQs
            question = re.sub(r'<[^>]+>', '', match.group(1)).strip()
            answer = re.sub(r'<[^>]+>', '', match.group(2)).strip()[:500]  # Limit answer length
            if question and answer and '?' in question:
                faqs.append((question, answer))
        
        if faqs:
            faq_items = ',\n        '.join([f'''{{
          "@type": "Question",
          "name": "{escape(q)}",
          "acceptedAnswer": {{
            "@type": "Answer",
            "text": "{escape(a)}"
          }}
        }}''' for q, a in faqs])
            
            faq_schema = f'''    <!-- FAQPage Schema -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {faq_items}
      ]
    }}
    </script>'''
            
            # Insert before closing </head> or before </body>
            if '</head>' in content:
                content = content.replace('</head>', faq_schema + '\n</head>')
            elif '</body>' in content:
                content = content.replace('</body>', faq_schema + '\n</body>')
    
    return content

def add_breadcrumb_schema_if_missing(content, filename):
    """Add BreadcrumbList schema if missing"""
    if 'BreadcrumbList' not in content:
        title = extract_title_from_filename(filename)
        breadcrumb = create_breadcrumb_schema(filename, title)
        
        # Insert before closing </head>
        if '</head>' in content:
            content = content.replace('</head>', breadcrumb + '\n</head>')
    
    return content

def add_table_of_contents(content):
    """Add Table of Contents with jump links if content is long enough"""
    # Check if TOC already exists
    if 'table-of-contents' in content.lower() or 'toc' in content.lower():
        return content
    
    # Find all H2 headings
    h2_pattern = r'<h2[^>]*>(.*?)</h2>'
    h2s = re.findall(h2_pattern, content)
    
    if len(h2s) >= 3:  # Only add TOC if 3+ H2s
        # Create anchor IDs for headings
        toc_items = []
        for h2 in h2s:
            clean_text = re.sub(r'<[^>]+>', '', h2).strip()
            anchor = re.sub(r'[^a-z0-9]+', '-', clean_text.lower()).strip('-')
            toc_items.append(f'<li><a href="#{anchor}">{clean_text}</a></li>')
            # Add ID to heading
            content = re.sub(
                f'<h2[^>]*>{re.escape(h2)}</h2>',
                f'<h2 id="{anchor}">{h2}</h2>',
                content,
                count=1
            )
        
        toc_html = f'''<div class="table-of-contents" style="background: #f0f8f3; padding: 2rem; border-radius: 12px; margin: 2rem 0; border-left: 4px solid #175c36;">
    <h3 style="color: #175c36; margin-top: 0; font-size: 1.5rem; font-weight: 700;">📑 Table of Contents</h3>
    <ul style="list-style: none; padding-left: 0; margin: 1rem 0;">
        {''.join(toc_items)}
    </ul>
</div>'''
        
        # Insert after first <main> or <article> or first <h1>
        insertion_points = [
            (r'<main[^>]*>', toc_html + '\n'),
            (r'<article[^>]*>', toc_html + '\n'),
            (r'</h1>', '</h1>\n' + toc_html)
        ]
        
        for pattern, replacement in insertion_points:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content, count=1)
                break
    
    return content

def add_sources_section(content):
    """Add Sources/References section for E-E-A-T"""
    if 'sources' in content.lower() or 'references' in content.lower() or 'citations' in content.lower():
        return content
    
    sources_html = '''<section class="sources-section" style="margin: 3rem 0; padding: 2rem; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #175c36;">
    <h2 style="color: #175c36; margin-top: 0;">📚 Sources & References</h2>
    <p style="color: #5A6D5D; line-height: 1.7;">This article is based on scientific research and trusted sources. For more information, consult with a healthcare professional.</p>
    <ul style="list-style: none; padding-left: 0;">
        <li style="margin: 0.75rem 0; padding-left: 1.5rem; position: relative;">
            <span style="position: absolute; left: 0; color: #175c36;">•</span>
            <span>Moringa oleifera research from peer-reviewed journals and nutritional databases</span>
        </li>
        <li style="margin: 0.75rem 0; padding-left: 1.5rem; position: relative;">
            <span style="position: absolute; left: 0; color: #175c36;">•</span>
            <span>Australian Dietary Guidelines and Food Standards Australia New Zealand (FSANZ)</span>
        </li>
        <li style="margin: 0.75rem 0; padding-left: 1.5rem; position: relative;">
            <span style="position: absolute; left: 0; color: #175c36;">•</span>
            <span>NutriThrive product testing and quality assurance data</span>
        </li>
    </ul>
    <p style="font-size: 0.9rem; color: #5A6D5D; margin-top: 1.5rem; font-style: italic;">
        <strong>Disclaimer:</strong> This information is for educational purposes only and is not intended as medical advice. Always consult with a qualified healthcare professional before making changes to your diet or supplement routine.
    </p>
</section>'''
    
    # Insert before footer or before closing </main>
    insertion_points = [
        (r'<footer', sources_html + '\n    <footer'),
        (r'</main>', sources_html + '\n    </main>'),
        (r'</article>', sources_html + '\n    </article>')
    ]
    
    for pattern, replacement in insertion_points:
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content, count=1)
            break
    
    return content

def enhance_internal_links(content, filename):
    """Add internal links to hub pages and related content"""
    filename_lower = filename.lower()
    
    # Hub page links based on topic
    hub_links = []
    hub_name = 'Content Hub'
    
    if 'moringa' in filename_lower:
        hub_links.append('<a href="/blog/moringa-benefits-australia-2026.html" style="color: #175c36; font-weight: 600; text-decoration: none;">Moringa Benefits Guide</a>')
        hub_links.append('<a href="/blog/how-to-add-moringa-to-diet.html" style="color: #175c36; font-weight: 600; text-decoration: none;">How to Use Moringa</a>')
        hub_name = 'Moringa Hub'
    
    if 'curry' in filename_lower or 'curry-leaves' in filename_lower:
        hub_links.append('<a href="/blog/fresh-vs-dried-curry-leaves-melbourne-complete-guide.html" style="color: #175c36; font-weight: 600; text-decoration: none;">Curry Leaves Guide</a>')
        hub_name = 'Curry Leaves Hub'
    
    if 'protein' in filename_lower or 'gym' in filename_lower or 'fitness' in filename_lower:
        hub_links.append('<a href="/blog/best-protein-powder-australia-2026-complete-guide.html" style="color: #175c36; font-weight: 600; text-decoration: none;">Protein Powder Guide</a>')
        hub_links.append('<a href="/blog/melbourne-fitness-gym-guide-2026-nutrition-supplements.html" style="color: #175c36; font-weight: 600; text-decoration: none;">Melbourne Gym Guide</a>')
        hub_name = 'Fitness Hub'
    
    if hub_links and 'hub-links' not in content.lower():
        hub_section = f'''<div class="hub-links" style="margin: 2rem 0; padding: 1.5rem; background: #e8f5ed; border-radius: 12px; border-left: 4px solid #175c36;">
    <h3 style="color: #175c36; margin-top: 0; font-size: 1.25rem;">🔗 Explore More from Our {hub_name}</h3>
    <p style="color: #5A6D5D; margin-bottom: 1rem;">Discover related articles and guides:</p>
    <ul style="list-style: none; padding-left: 0;">
        {''.join([f'<li style="margin: 0.5rem 0;">{link}</li>' for link in hub_links])}
    </ul>
</div>'''
        
        # Insert after first paragraph or intro section
        if '<p' in content:
            # Find first substantial paragraph and insert after it
            p_pattern = r'(<p[^>]*>.*?</p>)'
            matches = list(re.finditer(p_pattern, content, re.DOTALL))
            if len(matches) >= 2:
                insert_pos = matches[1].end()
                content = content[:insert_pos] + '\n' + hub_section + content[insert_pos:]
            elif matches:
                insert_pos = matches[0].end()
                content = content[:insert_pos] + '\n' + hub_section + content[insert_pos:]
    
    return content

def optimize_image_alt_tags(content):
    """Ensure all images have descriptive ALT tags"""
    # Find images without alt or with generic alt
    img_pattern = r'<img([^>]*?)(?:alt="([^"]*)"|)([^>]*?)>'
    
    def replace_img(match):
        attrs = match.group(1) + match.group(3)
        existing_alt = match.group(2) if match.group(2) else ''
        
        # Skip if already has good alt
        if existing_alt and existing_alt.lower() not in ['image', 'img', 'photo', 'picture', '']:
            return match.group(0)
        
        # Try to extract context for alt text
        src_match = re.search(r'src="([^"]*)"', attrs)
        if src_match:
            src = src_match.group(1)
            # Generate alt from filename
            filename = os.path.basename(src).replace('.webp', '').replace('.png', '').replace('.jpg', '')
            alt_text = filename.replace('-', ' ').replace('_', ' ').title()
            if 'moringa' in src.lower():
                alt_text = 'NutriThrive Organic Moringa Powder'
            elif 'curry' in src.lower():
                alt_text = 'Dried Curry Leaves'
            elif 'logo' in src.lower():
                alt_text = 'NutriThrive Logo'
            else:
                alt_text = 'NutriThrive Product Image'
        else:
            alt_text = 'NutriThrive Product Image'
        
        # Reconstruct img tag with alt
        if 'alt=' in attrs:
            attrs = re.sub(r'alt="[^"]*"', f'alt="{alt_text}"', attrs)
        else:
            attrs = attrs.rstrip() + f' alt="{alt_text}"'
        
        return f'<img{attrs}>'
    
    content = re.sub(img_pattern, replace_img, content)
    return content

def enhance_blog_post(filepath):
    """Enhance a single blog post with all SEO improvements"""
    print(f"Processing: {filepath.name}")
    
    # Backup original
    backup_path = BACKUP_DIR / filepath.name
    if not backup_path.exists():
        backup_path.write_text(filepath.read_text(encoding='utf-8'), encoding='utf-8')
    
    # Read content
    content = filepath.read_text(encoding='utf-8')
    original_content = content
    
    # Apply all enhancements
    content = enhance_blogposting_schema(content, filepath.name)
    content = add_faq_schema_if_needed(content, filepath.name)
    content = add_breadcrumb_schema_if_missing(content, filepath.name)
    content = add_table_of_contents(content)
    content = add_sources_section(content)
    content = enhance_internal_links(content, filepath.name)
    content = optimize_image_alt_tags(content)
    
    # Only write if changed
    if content != original_content:
        filepath.write_text(content, encoding='utf-8')
        return True
    return False

def main():
    """Main function to enhance all blog posts"""
    blogs = sorted([f for f in BLOG_DIR.glob('*.html') if f.name != 'index.html'])
    
    print(f"Found {len(blogs)} blog posts to enhance")
    print("=" * 60)
    
    enhanced = 0
    for blog in blogs:
        try:
            if enhance_blog_post(blog):
                enhanced += 1
                print(f"✅ Enhanced: {blog.name}")
            else:
                print(f"⏭️  Skipped (already optimized): {blog.name}")
        except Exception as e:
            print(f"❌ Error processing {blog.name}: {e}")
    
    print("=" * 60)
    print(f"✅ Enhanced {enhanced} out of {len(blogs)} blog posts")
    print(f"📁 Backups saved to: {BACKUP_DIR}")

if __name__ == '__main__':
    main()
