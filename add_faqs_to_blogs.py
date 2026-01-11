#!/usr/bin/env python3
"""
Script to add FAQs to all blog HTML files.
Distributes FAQs evenly across all blogs, avoiding duplicates.
"""

import os
import re
import random
from pathlib import Path

# All 57 FAQs (40 new + 17 previous)
ALL_FAQS = [
    # New FAQs (1-40)
    ("What does moringa taste like?", "Moringa tastes earthy, grassy, slightly bitter, like strong green tea or spinach."),
    ("What is the best time of day to take moringa?", "Best is morning or lunchtime for energy support."),
    ("Should I take moringa on an empty stomach?", "You can, but many people tolerate it better with food to avoid nausea."),
    ("How much moringa should a beginner take?", "Start with ½–1 teaspoon daily (or 1 capsule). <a href=\"/products/product-detail.html\" style=\"color: #2d5a3d; font-weight: 600; text-decoration: none;\">Shop premium moringa powder</a>"),
    ("What is a normal daily dose of moringa powder?", "Common dose is 1–2 teaspoons per day (around 2–5g)."),
    ("How long does moringa take to work?", "Some feel benefits in 3–7 days, but full results can take 2–4 weeks."),
    ("Can moringa help with bloating?", "It may help some people by improving digestion, but for others it can cause gas at first."),
    ("Can moringa help with constipation?", "Yes, mild laxative effect may help gentle bowel movement."),
    ("Can moringa cause diarrhea?", "Yes — especially if you take too much too fast."),
    ("Does moringa help with acid reflux?", "It might help digestion, but some people find it worsens reflux due to bitterness."),
    ("Can moringa increase appetite?", "Sometimes yes (better digestion), but it's not a strong appetite booster."),
    ("Does moringa suppress appetite?", "It can slightly reduce hunger due to fiber + nutrients, but results vary."),
    ("Can moringa help with metabolism?", "It may support metabolism indirectly by improving blood sugar + inflammation."),
    ("Can moringa help with energy and fatigue?", "Yes, many people report improved energy due to iron + vitamins + antioxidants."),
    ("Can moringa help with sleep or insomnia?", "It's not a sleep supplement. If it boosts energy for you, avoid taking it at night."),
    ("Does moringa have caffeine?", "No — moringa is caffeine-free."),
    ("Can moringa reduce stress or anxiety?", "It may support calm indirectly through antioxidants + nutrient support, but it's not a medication."),
    ("Does moringa help with brain fog or focus?", "Some users feel better clarity due to improved energy and micronutrients."),
    ("Can moringa help with immunity?", "Yes — it's rich in vitamin C, vitamin A, antioxidants that support immune health."),
    ("Can moringa help with inflammation?", "Yes — moringa contains natural anti-inflammatory plant compounds."),
    ("Can moringa help with joint pain or arthritis?", "It may support reduced inflammation, but it's not a cure. Best as a supportive supplement."),
    ("Can moringa help with skin glow?", "Yes — antioxidants may support healthier skin over time."),
    ("Can moringa help with acne?", "Possibly. Some people see improvement (less inflammation), others may break out from detox-like changes."),
    ("Can moringa help with eczema or psoriasis?", "It might help inflammation, but results are mixed and highly individual."),
    ("Can moringa help with hair growth?", "It can support hair health via iron, zinc, amino acids, but won't regrow hair magically."),
    ("Can moringa reduce hair fall?", "If hair fall is caused by nutrient deficiency, moringa may help over time."),
    ("Can moringa help with iron deficiency?", "Yes — moringa leaf contains iron, but absorption differs person to person."),
    ("Can moringa help with anemia?", "It may help mild anemia (nutritional support), but severe anemia needs medical treatment."),
    ("Is moringa safe for kids?", "Small food-level amounts may be okay, but supplements for kids should be doctor-approved."),
    ("Is moringa safe for older adults?", "Yes, usually safe at low doses, but they must monitor if on medications (BP, diabetes)."),
    ("Is moringa safe while breastfeeding?", "Some use it traditionally to support milk supply, but safety data is limited — ask a doctor first."),
    ("Can moringa affect fertility?", "No clear human proof. Some animal studies show effects, but nothing confirmed in humans."),
    ("Can moringa affect hormones?", "It might influence hormones indirectly through blood sugar and inflammation, but research is limited."),
    ("Can moringa affect the thyroid?", "Possibly — it may interfere with thyroid medication timing (especially levothyroxine)."),
    ("Can moringa interact with antidepressants?", "Not strongly proven, but caution is advised with all supplements — consult your pharmacist/doctor."),
    ("Can moringa interact with blood thinners?", "Potentially yes — because moringa contains vitamin K and other compounds. Seek medical advice first."),
    ("Can moringa cause allergic reactions?", "Rare, but possible. Symptoms: itching, rash, swelling, breathing issues (seek medical help)."),
    ("How should moringa powder be stored?", "Keep it in an airtight container, cool dark place, away from heat and moisture."),
    ("How do I know if moringa powder is fresh or expired?", "Fresh moringa is bright green and smells grassy. Old moringa turns dull/brownish and smells stale."),
    ("What's the difference between moringa powder, capsules, and tea?", "Powder: strongest + versatile<br>Capsules: easiest/no taste<br>Tea: mildest, lighter effect"),
    
    # Previous FAQs (41-57)
    ("What is moringa?", "Moringa (Moringa oleifera) is a fast-growing tree from South Asia. Its leaves are highly nutritious and are used fresh or dried into powder as a supplement. <a href=\"/products/product-detail.html\" style=\"color: #2d5a3d; font-weight: 600; text-decoration: none;\">Shop premium moringa powder</a>"),
    ("What happens if you take moringa every day?", "In moderate amounts it's usually safe and may boost nutrients, energy, digestion, and immunity. Start small (1–2 tsp/day) to avoid stomach upset."),
    ("Does moringa help get rid of belly fat?", "There's no human proof it targets belly fat. It may support weight management, but fat loss still depends on diet + exercise."),
    ("What are the benefits of moringa?", "Nutrient-rich (vitamins, minerals, protein), high antioxidants, may support blood sugar control, may support heart health, anti-inflammatory properties."),
    ("What are the side effects of moringa?", "Usually mild: stomach upset or diarrhea (high doses), taste can be strong, can lower blood sugar/BP (important for some people)."),
    ("Who should not consume moringa?", "Pregnant women (especially avoid root/bark/flower), people on diabetes/BP/thyroid medication (without doctor advice), those with very low blood sugar or low BP."),
    ("What medications should not be taken with moringa?", "Be careful with: diabetes meds (risk low blood sugar), blood pressure meds (risk low BP), thyroid meds like levothyroxine (may affect absorption)."),
    ("Can I take moringa if I'm on blood pressure medicine?", "Only with caution. It may lower BP further and cause dizziness. Start small + monitor BP, ideally with doctor approval."),
    ("When should I avoid moringa?", "Avoid during: pregnancy, 2 weeks before surgery, if you get side effects, when starting new diabetes/BP meds (until stable)."),
    ("What diseases can be treated with moringa?", "Moringa is not a medical treatment, but may support conditions like: high blood sugar, high cholesterol, inflammation, malnutrition/anemia (nutritional support)."),
    ("Is moringa allowed in Australia?", "Yes, but it's treated as a novel food, so it's often sold as a supplement rather than a regular food product."),
    ("Does Woolworths sell moringa?", "Yes — mainly online (often via health-product partners). For fresher, higher-quality moringa powder, consider <a href=\"/products/product-detail.html\" style=\"color: #2d5a3d; font-weight: 600; text-decoration: none;\">buying directly from NutriThrive</a> who ships fresh from Melbourne."),
    ("Does Coles sell moringa powder?", "Yes — usually online and sometimes in larger stores. For the freshest, highest-quality moringa powder, consider buying directly from <a href=\"/products/product-detail.html\" style=\"color: #2d5a3d; font-weight: 600; text-decoration: none;\">NutriThrive</a> who ship from local Melbourne warehouses."),
    ("Can I buy moringa at Chemist Warehouse?", "Yes — usually capsules and some moringa supplement products (often online exclusive). However, for the freshest, highest-quality moringa powder, consider buying directly from Australian suppliers like <a href=\"/products/product-detail.html\" style=\"color: #2d5a3d; font-weight: 600; text-decoration: none;\">NutriThrive</a> who ship from local warehouses."),
    ("Is moringa powder available in Australia?", "Yes — available via supermarkets online, pharmacies, health stores, and Australian wellness websites. <a href=\"/products/product-detail.html\" style=\"color: #2d5a3d; font-weight: 600; text-decoration: none;\">NutriThrive ships fresh moringa powder from Melbourne</a> across Australia."),
    ("Is moringa powder banned in any country?", "Some countries restrict it — Brazil is known for strong restrictions due to safety-evaluation rules."),
    ("Can I grow moringa in Australia?", "Yes. It grows best in warm/tropical areas (QLD/NT/WA north). In cooler places like Melbourne, grow it in a pot and protect from frost."),
]

def extract_existing_faqs(content):
    """Extract existing FAQ questions from HTML content."""
    existing = set()
    # Pattern to match FAQ questions in various formats
    patterns = [
        r'<span>([^<]+)</span>',  # In button spans
        r'<h3>Q:\s*([^<]+)</h3>',  # In Q: format
        r'<h3>([^<]+)</h3>',  # In h3 tags
        r'itemprop="name"[^>]*>([^<]+)</h3>',  # In schema markup
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        for match in matches:
            # Clean up the question
            q = match.strip()
            if q and len(q) > 10:  # Filter out very short matches
                existing.add(q.lower())
    
    return existing

def create_faq_html(question, answer):
    """Create HTML for a collapsible FAQ item."""
    return f'''                    <div class="faq-item" style="margin-bottom: 1.5rem; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background: white;">
                        <button class="faq-question" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'; this.querySelector('.faq-icon').textContent = this.nextElementSibling.style.display === 'none' ? '+' : '−';" style="width: 100%; padding: 1.25rem 1.5rem; background: #f8f9fa; border: none; text-align: left; cursor: pointer; font-size: 1.1rem; font-weight: 600; color: #2d5a3d; display: flex; justify-content: space-between; align-items: center;">
                            <span>{question}</span>
                            <span class="faq-icon" style="font-size: 1.5rem; font-weight: bold;">+</span>
                        </button>
                        <div class="faq-answer" style="padding: 1.5rem; background: white; display: none; line-height: 1.7; color: #555;">
                            <p>{answer}</p>
                        </div>
                    </div>'''

def find_faq_insertion_point(content):
    """Find where to insert new FAQs in the HTML."""
    # Look for common FAQ section endings
    patterns = [
        r'(</div>\s*</div>\s*</div>\s*<!--\s*End.*FAQ|Frequently Asked)',
        r'(</div>\s*</div>\s*</div>\s*</div>\s*<!--\s*Newsletter)',
        r'(</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*<!--\s*Newsletter)',
        r'(<div class="faq-section"[^>]*>.*?</div>\s*</div>\s*</div>)',
    ]
    
    # Try to find the last FAQ item closing tag before the section closes
    faq_section_end = re.search(r'(<div class="faq-item"[^>]*>.*?</div>\s*</div>\s*</div>\s*</div>)', content, re.DOTALL)
    if faq_section_end:
        return faq_section_end.end() - len('</div>')
    
    # Fallback: find FAQ section and add before closing
    faq_section = re.search(r'(<div class="faq-section"[^>]*>.*?)(</div>\s*</div>\s*</div>)', content, re.DOTALL)
    if faq_section:
        return faq_section.end() - len('</div></div></div>')
    
    # Last resort: find "Frequently Asked Questions" and add after existing FAQs
    faq_header = re.search(r'(Frequently Asked Questions[^<]*</h2>.*?)(</div>\s*</div>\s*</div>)', content, re.DOTALL | re.IGNORECASE)
    if faq_header:
        return faq_header.end() - len('</div></div></div>')
    
    return None

def process_blog_file(filepath):
    """Process a single blog file to add FAQs."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract existing FAQs
        existing_faqs = extract_existing_faqs(content)
        
        # Filter out FAQs that already exist
        available_faqs = [
            (q, a) for q, a in ALL_FAQS 
            if q.lower() not in existing_faqs and 
            not any(existing_q in q.lower() or q.lower() in existing_q for existing_q in existing_faqs if len(existing_q) > 15)
        ]
        
        if not available_faqs:
            print(f"  No new FAQs to add (all already exist)")
            return False
        
        # Randomly select 4-5 FAQs
        num_to_add = min(random.randint(4, 5), len(available_faqs))
        selected_faqs = random.sample(available_faqs, num_to_add)
        
        # Create FAQ HTML
        new_faqs_html = '\n'.join([create_faq_html(q, a) for q, a in selected_faqs])
        
        # Find insertion point
        insert_pos = find_faq_insertion_point(content)
        
        if insert_pos is None:
            print(f"  Could not find FAQ insertion point")
            return False
        
        # Insert new FAQs
        content = content[:insert_pos] + '\n' + new_faqs_html + '\n                    ' + content[insert_pos:]
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"  Added {num_to_add} new FAQs")
        return True
        
    except Exception as e:
        print(f"  Error: {e}")
        return False

def main():
    """Main function to process all blog files."""
    blog_dir = Path('blog')
    blog_files = list(blog_dir.glob('*.html'))
    blog_files = [f for f in blog_files if f.name != 'index.html']
    
    print(f"Found {len(blog_files)} blog files to process")
    
    # Shuffle for random distribution
    random.shuffle(blog_files)
    
    success_count = 0
    for blog_file in blog_files:
        print(f"Processing {blog_file.name}...")
        if process_blog_file(blog_file):
            success_count += 1
    
    print(f"\nCompleted: {success_count}/{len(blog_files)} files processed successfully")

if __name__ == '__main__':
    main()
