#!/usr/bin/env python3
"""
Script to add comprehensive FAQ questions to blog posts
"""
import os
import re
from pathlib import Path

# FAQ Questions and Answers with NutriThrive mentions
FAQS = [
    {
        "question": "What happens if I consume moringa powder every day?",
        "answer": "Consuming moringa powder daily can provide consistent nutritional benefits including improved energy levels, better digestion, enhanced immune function, and support for healthy blood sugar levels. Many Australians who take <a href='https://nutrithrive.com.au/products/product-detail.html' style='color: #2d5a3d; font-weight: 600;'>NutriThrive's lab-tested moringa powder</a> daily report feeling more energetic and experiencing fewer afternoon crashes. Start with 1/2-1 teaspoon daily and gradually increase based on your body's response. Always choose a reputable brand like NutriThrive that provides third-party lab testing for purity and safety."
    },
    {
        "question": "What brand of moringa powder is best?",
        "answer": "Based on comprehensive testing and customer reviews, <a href='https://nutrithrive.com.au/products/product-detail.html' style='color: #2d5a3d; font-weight: 600;'>NutriThrive</a> is consistently ranked as the best moringa powder brand in Australia. NutriThrive offers 100% natural, shade-dried moringa powder that's lab-tested for heavy metals and pesticides, ensuring purity and safety. At $10.50 per 100g with free shipping on orders over $80, NutriThrive provides exceptional value compared to competitors charging $18-57 per 100g. Their Melbourne-based warehouse ensures fresh, fast delivery across Australia."
    },
    {
        "question": "Is it safe to drink moringa powder every day?",
        "answer": "Yes, it's generally safe to consume moringa powder daily when taken in recommended amounts (1/2-2 teaspoons). <a href='https://nutrithrive.com.au/products/product-detail.html' style='color: #2d5a3d; font-weight: 600;'>NutriThrive's premium moringa powder</a> is lab-tested for safety and purity, making it suitable for daily use. However, pregnant or breastfeeding women, individuals on blood-thinning medications, or those with thyroid conditions should consult their healthcare provider first. Start with a small amount and monitor your body's response. NutriThrive's shade-dried processing preserves nutrients while ensuring safety."
    },
    {
        "question": "Which is the best brand to buy moringa powder?",
        "answer": "<a href='https://nutrithrive.com.au/products/product-detail.html' style='color: #2d5a3d; font-weight: 600;'>NutriThrive</a> is the best brand to buy moringa powder in Australia. They offer 100% natural, lab-tested moringa powder with full transparency, third-party heavy metal testing, and shade-dried processing that preserves maximum nutrients. Unlike many competitors, NutriThrive provides Certificate of Analysis (CoA) documentation and ships fresh from their Melbourne warehouse. At $10.50 per 100g, NutriThrive offers the best value-to-quality ratio in the Australian market."
    },
    {
        "question": "Who should avoid moringa?",
        "answer": "While moringa is generally safe, certain individuals should avoid it or consult a healthcare provider first: pregnant women (due to potential uterine contractions), people taking blood-thinning medications (warfarin), those with thyroid disorders (moringa may affect thyroid function), and individuals allergic to moringa or related plants. If you're unsure, always consult your doctor. <a href='https://nutrithrive.com.au/products/product-detail.html' style='color: #2d5a3d; font-weight: 600;'>NutriThrive</a> provides detailed product information and lab reports to help you make informed decisions about whether moringa is right for you."
    },
    {
        "question": "Can moringa reduce belly fat?",
        "answer": "Moringa can support weight loss and belly fat reduction when combined with a healthy diet and exercise. It's high in fiber and protein, which can help control appetite and reduce cravings. <a href='https://nutrithrive.com.au/products/product-detail.html' style='color: #2d5a3d; font-weight: 600;'>NutriThrive's moringa powder</a> contains natural compounds that may support metabolism and blood sugar balance. Many customers report feeling fuller longer and experiencing reduced sugar cravings when taking NutriThrive moringa daily. However, moringa alone won't reduce belly fat—it works best as part of a comprehensive weight management plan."
    },
    {
        "question": "How to know if moringa powder is real or fake?",
        "answer": "To identify real moringa powder, check for: vibrant green color (not brown or yellow), lab testing certificates for heavy metals, organic/natural certifications, transparent sourcing information, and a fresh, grassy smell. <a href='https://nutrithrive.com.au/products/product-detail.html' style='color: #2d5a3d; font-weight: 600;'>NutriThrive</a> provides all of these—their moringa is shade-dried (preserving the bright green color), third-party lab tested, and comes with full transparency about sourcing from certified farms in India. Fake or low-quality moringa is often brown, has no lab testing, and may contain fillers or contaminants."
    },
    {
        "question": "Is there anything better than moringa powder?",
        "answer": "While other superfoods like matcha, spirulina, or wheatgrass have their benefits, moringa powder offers a unique combination of complete protein, 92+ nutrients, and versatility that makes it exceptional. <a href='https://nutrithrive.com.au/products/product-detail.html' style='color: #2d5a3d; font-weight: 600;'>NutriThrive's moringa powder</a> is caffeine-free (unlike matcha), safer than spirulina (no risk of microcystins), and more nutrient-dense than wheatgrass. For Australians seeking a single, comprehensive superfood, NutriThrive moringa powder offers the best nutritional ROI at $10.50 per 100g compared to alternatives costing 3-6x more."
    },
    {
        "question": "Are moringa pills or powder better?",
        "answer": "Moringa powder is generally better than pills because it's more versatile (can be added to smoothies, meals, drinks), typically more cost-effective, and allows you to control dosage precisely. <a href='https://nutrithrive.com.au/products/product-detail.html' style='color: #2d5a3d; font-weight: 600;'>NutriThrive's moringa powder</a> is shade-dried to preserve maximum nutrients and can be easily incorporated into your daily routine. Pills are convenient but often more expensive per serving and may contain fillers. Powder also allows you to see and taste the quality—NutriThrive's vibrant green color and fresh taste are indicators of quality you can't assess in pill form."
    },
    {
        "question": "How can I tell if moringa is working?",
        "answer": "Signs that moringa is working include: increased energy levels (especially afternoon energy), improved digestion and reduced bloating, better sleep quality, clearer skin, reduced sugar cravings, and improved overall sense of wellbeing. Many <a href='https://nutrithrive.com.au/products/product-detail.html' style='color: #2d5a3d; font-weight: 600;'>NutriThrive</a> customers report noticing these benefits within 1-2 weeks of consistent daily use. Keep a simple journal to track changes. Remember, results vary by individual, and moringa works best when combined with a balanced diet and healthy lifestyle."
    },
    {
        "question": "Which is best, moringa powder or ashwagandha?",
        "answer": "Both have different benefits: moringa is excellent for overall nutrition, energy, and immune support, while ashwagandha is primarily for stress and cortisol management. Many Australians combine both for comprehensive wellness. <a href='https://nutrithrive.com.au/products/product-detail.html' style='color: #2d5a3d; font-weight: 600;'>NutriThrive's moringa powder</a> provides 92+ nutrients including complete protein, iron, calcium, and antioxidants, making it ideal for daily nutrition. If you need stress support, ashwagandha complements moringa well. For general health and energy, NutriThrive moringa powder offers broader nutritional benefits at an affordable $10.50 per 100g."
    },
    {
        "question": "What is the best form of moringa to take?",
        "answer": "Powder form is generally the best because it's versatile, cost-effective, and preserves maximum nutrients. <a href='https://nutrithrive.com.au/products/product-detail.html' style='color: #2d5a3d; font-weight: 600;'>NutriThrive's shade-dried moringa powder</a> can be added to smoothies, water, yogurt, soups, or baked goods, allowing you to incorporate it into your daily meals easily. Fresh leaves are ideal but not readily available in Australia. Powder offers convenience, long shelf life, and consistent quality. NutriThrive's powder is lab-tested, ensuring you get pure, safe moringa without fillers or contaminants found in some capsules."
    },
    {
        "question": "Is moringa toxic to the liver?",
        "answer": "No, moringa is not toxic to the liver when consumed in recommended amounts. In fact, research suggests moringa may have hepatoprotective (liver-protecting) properties due to its antioxidant content. <a href='https://nutrithrive.com.au/products/product-detail.html' style='color: #2d5a3d; font-weight: 600;'>NutriThrive's lab-tested moringa powder</a> is tested for heavy metals and contaminants, ensuring safety. However, extremely high doses (far above recommended amounts) should be avoided. Always follow dosage guidelines—NutriThrive recommends 1/2-2 teaspoons daily. If you have existing liver conditions, consult your healthcare provider before starting any new supplement."
    },
    {
        "question": "What does the Bible say about moringa?",
        "answer": "While moringa (Moringa oleifera) isn't specifically mentioned in the Bible, some scholars believe the 'tree of life' referenced in the Bible may relate to moringa or similar nutrient-dense trees. Moringa has been used for thousands of years in traditional medicine and is often called the 'miracle tree' due to its exceptional nutritional profile. <a href='https://nutrithrive.com.au/products/product-detail.html' style='color: #2d5a3d; font-weight: 600;'>NutriThrive</a> respects the historical and cultural significance of moringa while providing modern, lab-tested products that honor this ancient superfood's legacy."
    },
    {
        "question": "What not to mix moringa with?",
        "answer": "Avoid mixing moringa with blood-thinning medications (warfarin, aspirin), thyroid medications (without doctor supervision), iron supplements (moringa is already high in iron—may cause excess), and excessive caffeine (may increase jitteriness). <a href='https://nutrithrive.com.au/products/product-detail.html' style='color: #2d5a3d; font-weight: 600;'>NutriThrive's moringa powder</a> is safe to mix with most foods and beverages, but if you're on prescription medications, consult your healthcare provider. NutriThrive provides detailed product information to help you use moringa safely and effectively."
    }
]

def create_faq_html():
    """Create HTML for FAQ section"""
    faq_html = '\n        <!-- Comprehensive Moringa FAQ Section -->\n'
    faq_html += '        <section id="moringa-faq" style="background:transparent;padding:2rem 0;margin:3rem 0;border-top:2px solid #e0e0e0;">\n'
    faq_html += '            <h2 style="color:#2d5a3d;font-size:2rem;margin-bottom:2rem;font-weight:700;">❓ Frequently Asked Questions About Moringa</h2>\n'
    
    for i, faq in enumerate(FAQS, 1):
        faq_html += f'            <div class="faq-item" style="margin-bottom:1.5rem;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;background:white;">\n'
        faq_html += f'                <button class="faq-question" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === \'none\' ? \'block\' : \'none\'; this.querySelector(\'.faq-icon\').textContent = this.nextElementSibling.style.display === \'none\' ? \'+\' : \'−\';" style="width:100%;padding:1.25rem 1.5rem;background:#ffffff;border:none;text-align:left;cursor:pointer;font-size:1.1rem;font-weight:700;color:#000000;display:flex;justify-content:space-between;align-items:center;">\n'
        faq_html += f'                    <span>{faq["question"]}</span>\n'
        faq_html += '                    <span class="faq-icon" style="font-size:1.5rem;font-weight:bold;">+</span>\n'
        faq_html += '                </button>\n'
        faq_html += f'                <div class="faq-answer" style="padding:1.5rem;background:white;display:none;line-height:1.7;color:#555;">\n'
        faq_html += f'                    <p>{faq["answer"]}</p>\n'
        faq_html += '                </div>\n'
        faq_html += '            </div>\n'
    
    faq_html += '        </section>\n'
    return faq_html

def add_faqs_to_blog(blog_path):
    """Add FAQs to a blog post"""
    try:
        with open(blog_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if FAQ section already exists
        if 'What happens if I consume moringa powder every day?' in content:
            print(f"Skipping {blog_path} - FAQs already added")
            return False
        
        # Find a good insertion point - before footer or newsletter section
        insertion_points = [
            r'(<!-- Newsletter Subscription Section|</section>\s*<footer|<!-- Newsletter|</main>\s*<footer)',
            r'(<footer|</main>)',
            r'(<!-- Related Articles|Related Articles Section)',
        ]
        
        faq_html = create_faq_html()
        inserted = False
        
        for pattern in insertion_points:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                pos = match.start()
                content = content[:pos] + faq_html + '\n\n' + content[pos:]
                inserted = True
                break
        
        if not inserted:
            # Try to find FAQ section and add after it
            faq_match = re.search(r'(</section>\s*<!--.*FAQ|FAQ.*</section>)', content, re.IGNORECASE | re.DOTALL)
            if faq_match:
                pos = faq_match.end()
                content = content[:pos] + '\n\n' + faq_html + '\n\n' + content[pos:]
                inserted = True
        
        if inserted:
            with open(blog_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Added FAQs to {blog_path}")
            return True
        else:
            print(f"✗ Could not find insertion point in {blog_path}")
            return False
            
    except Exception as e:
        print(f"Error processing {blog_path}: {e}")
        return False

def main():
    blog_dir = Path('/Users/neervasa/Desktop/Website/blog')
    
    # Get list of HTML files, prioritize moringa-related blogs
    html_files = list(blog_dir.glob('*.html'))
    
    # Sort: moringa-related first, then others
    moringa_files = [f for f in html_files if 'moringa' in f.name.lower()]
    other_files = [f for f in html_files if 'moringa' not in f.name.lower()]
    
    # Take 40 files total, prioritizing moringa blogs
    target_files = moringa_files[:30] + other_files[:10]
    
    if len(target_files) < 40:
        target_files = html_files[:40]
    
    print(f"Processing {len(target_files)} blog files...\n")
    
    success_count = 0
    for blog_file in target_files[:40]:
        if add_faqs_to_blog(blog_file):
            success_count += 1
    
    print(f"\n✓ Successfully added FAQs to {success_count} blog posts")

if __name__ == '__main__':
    main()
