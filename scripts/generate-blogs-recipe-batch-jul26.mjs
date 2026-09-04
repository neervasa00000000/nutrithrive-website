#!/usr/bin/env node
/**
 * Generate 5 sales-driven recipe blogs (paired 2/day with health batch Jul 26–30).
 * Run: node scripts/generate-blogs-recipe-batch-jul26.mjs
 * Defaults to noindex, follow (launch schedule flips live).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const SITE = path.join(REPO, 'site');
const BLOG_DIR = path.join(SITE, 'blog');
const BASE = 'https://nutrithrive.com.au';
const AUTHOR_SCHEMA = 'Neer';
const AUTHOR_BYLINE = 'Neer, NutriThrive Truganina';
const START_NOINDEX = !process.argv.includes('--index');

const PRODUCTS = {
  moringa: {
    hero: '/assets/images/blog/moringa-blog-hero-800.jpg',
    og: '/assets/images/og/moringa-article-1200.jpg',
    sidebarImg: '/assets/images/product_photos/moringa.webp',
    sidebarTitle: 'Moringa Powder (100g)',
    sidebarDesc: 'Shade-dried, lab-tested, packed in Melbourne.',
    sidebarPrice: '$11.00',
    sidebarUnit: '/100g',
    shopHref: '/products/moringa-powder/',
    shopLabel: 'Shop Moringa',
    ctaHeading: 'Get NutriThrive Moringa',
    ctaBtn: 'Shop Moringa Powder — $11/100g',
    ctaProduct: 'lab-tested moringa powder',
    badge: true,
  },
  curry: {
    hero: '/assets/images/blog/CURRY3.png',
    og: '/assets/images/og/moringa-article-1200.jpg',
    sidebarImg: '/assets/images/product_photos/driedcurry.jpeg',
    sidebarTitle: 'Dried Curry Leaves',
    sidebarDesc: 'Shade-dried, packed in Melbourne. Perfect for tempering.',
    sidebarPrice: 'From $8',
    sidebarUnit: '',
    shopHref: '/products/curry-leaves/',
    shopLabel: 'Shop Curry Leaves',
    ctaHeading: 'Get NutriThrive Dried Curry Leaves',
    ctaBtn: 'Shop Dried Curry Leaves',
    ctaProduct: 'dried curry leaves',
    badge: false,
  },
  tea: {
    hero: '/assets/images/og/black-tea-social-1200.jpg',
    og: '/assets/images/og/black-tea-social-1200.jpg',
    sidebarImg: '/assets/images/product_photos/blacktea.jpeg',
    sidebarTitle: 'Darjeeling Black Tea',
    sidebarDesc: 'First-flush character, packed in Melbourne.',
    sidebarPrice: 'From $7.50',
    sidebarUnit: '',
    shopHref: '/products/black-tea/',
    shopLabel: 'Shop Darjeeling Tea',
    ctaHeading: 'Get NutriThrive Darjeeling Tea',
    ctaBtn: 'Shop Darjeeling Tea',
    ctaProduct: 'Darjeeling loose leaf tea',
    badge: false,
  },
};

const POSTS = [
  {
    slug: 'moringa-wellness-shot-recipe-winter-2026',
    title: 'Moringa Wellness Shot: The 2-Minute Winter Morning Ritual',
    h1: 'Moringa Wellness Shot: The 2-Minute Winter Morning Ritual (2026)',
    meta: 'One moringa wellness shot takes 2 minutes and replaces three separate supplements. The recipe, the why, and what to expect after a week of daily use.',
    dateDisplay: '26 Jul 2026',
    dateIso: '2026-07-26',
    readMin: 3,
    productKey: 'moringa',
    imgAlt: 'Small glass of green moringa wellness shot with lemon and ginger on a wooden bench in an Australian kitchen, winter morning',
    quickAnswer:
      'Mix ½ tsp moringa, juice of half a lemon, grated ginger, a pinch of turmeric, and 60ml warm water. Stir 20 to 30 seconds and drink. Two minutes, one glass, iron plus vitamin C for better absorption.',
    keyTakeaways: [
      'A moringa wellness shot pairs plant iron with lemon vitamin C, which improves iron absorption.',
      'Ginger and turmeric add anti-inflammatory support without a long prep.',
      'Use warm water, not boiling, so vitamin C stays intact.',
      'Make a liquid base ahead; stir moringa fresh each morning.',
      'Quality powder matters in a shot with no banana or peanut butter to hide bitterness.',
    ],
    recipe: {
      name: 'Moringa Winter Wellness Shot',
      description:
        'A 2-minute morning shot combining moringa, lemon, ginger, and turmeric for daily nutrition and immune support during winter',
      prepTime: 'PT2M',
      cookTime: 'PT0M',
      totalTime: 'PT2M',
      recipeYield: '1 shot (60ml)',
      recipeIngredient: [
        '½ teaspoon NutriThrive moringa powder',
        'Juice of ½ lemon (about 20ml)',
        '1cm piece fresh ginger, grated or sliced',
        'Pinch of turmeric',
        '60ml warm water (not boiling)',
        'Optional: pinch of black pepper (improves turmeric absorption)',
      ],
      recipeInstructions: [
        'Add warm water, lemon juice, and grated ginger to a small glass or shot glass',
        'Add moringa powder and turmeric. Stir firmly for 20-30 seconds until fully dissolved',
        'Add black pepper if using. Drink immediately',
      ],
    },
    sections: [
      {
        h2: 'Why this shot actually works',
        body: [
          'It is winter. You want something that works, takes under 2 minutes, and actually delivers. Most $8 cafe wellness shots are mostly apple juice with a token drop of ginger.',
          '<strong>Moringa</strong> covers iron, vitamin A, antioxidants, and magnesium in a small serve. <strong>Lemon</strong> provides vitamin C that improves how much iron your body absorbs from the moringa. That pairing is one of the best-established nutrition combinations in food science. <strong>Ginger</strong> supports digestion and has anti-inflammatory properties. <strong>Turmeric</strong> (with black pepper) adds curcumin. <strong>Warm water</strong>, not boiling, ties it together without destroying vitamin C.',
          'Four meaningful nutritional inputs in a two-minute glass. In winter, when mornings feel heavy, it is the kind of small habit that stacks up over weeks.',
        ],
      },
      {
        h2: 'The Recipe: Moringa Winter Wellness Shot',
        body: [
          '<strong>Makes:</strong> 1 shot (60ml)<br><strong>Time:</strong> 2 minutes<br><strong>Difficulty:</strong> Cannot be easier',
          '<h3>What you need</h3><ul><li>½ tsp NutriThrive moringa powder</li><li>Juice of ½ lemon (fresh, not bottled)</li><li>1cm piece fresh ginger, grated or sliced thin</li><li>Pinch of turmeric</li><li>60ml warm water (let boiling water sit 2 minutes first)</li><li>Optional: pinch of black pepper (activates turmeric)</li></ul>',
          '<h3>How to make it</h3><ol><li>Add warm water and lemon juice to a small glass</li><li>Add grated ginger</li><li>Add moringa powder and turmeric</li><li>Stir firmly for 20 to 30 seconds until the moringa is fully dissolved (keep going; it will not dissolve instantly)</li><li>Add black pepper if using</li><li>Drink immediately</li></ol>',
          '<h3>Make-ahead version</h3><p>Mix 5 to 7 shots in a sealed glass jar without the moringa. Each morning, pour one serve into a glass and stir in the moringa fresh. Keeps in the fridge for 3 days.</p>',
        ],
      },
      {
        h2: 'What to expect',
        body: [
          '<strong>Day 1 to 3:</strong> Nothing dramatic. This is nutrition, not caffeine. Some people notice slightly better digestion by the end of the first week from the ginger and fibre.',
          '<strong>Week 2 onwards:</strong> People who notice the most are often those running low on iron: more consistent energy, less mid-morning slump. Iron correction through food is cumulative and takes weeks, not days.',
          '<strong>The real benefit</strong> is consistency. A habit you keep for three months beats the perfect supplement you take twice.',
        ],
      },
      {
        h2: 'Why NutriThrive moringa specifically',
        body: [
          'For a shot like this, concentrated, with no banana or peanut butter to cover flavour, powder quality matters. Cheap, sun-dried, old-stock powder tastes harsh and bitter. That is what puts most people off moringa entirely.',
          'Shade-dried leaf powder ground fine is milder and earthy, even in a small volume of water. Ours is shade-dried from a single origin, NMI government lab-tested for nutrient content and contaminants, and packed in Melbourne. From $11 for 100g, about 33 cents per daily shot.',
        ],
      },
    ],
    faq: [
      {
        q: 'What does a moringa wellness shot do?',
        a: 'In one small daily shot you get plant-based iron, vitamin C from lemon (which improves iron absorption), vitamin A from moringa, and anti-inflammatory compounds from ginger and turmeric. It is not a medicine. It is a consistent daily nutrient habit in 2 minutes.',
      },
      {
        q: 'When should I take a moringa shot?',
        a: 'Morning is best, before coffee if you can. The vitamin C from the lemon works alongside the moringa iron in the same shot, so you get better iron absorption.',
      },
      {
        q: 'Can I make moringa shots in bulk?',
        a: 'Yes. Make 5 to 7 at once, store the liquid base in a sealed glass jar in the fridge, and drink within 3 days. Add moringa fresh each morning. Squeeze fresh lemon for each batch.',
      },
    ],
    inlineLinks: [
      { href: '/products/moringa-powder/', label: 'Get NutriThrive Moringa — $11/100g' },
      { href: '/blog/moringa-with-vitamin-c-iron-absorption-guide-2026', label: 'Moringa with vitamin C' },
    ],
    related: [
      { href: '/products/moringa-powder/', label: 'Shop moringa powder' },
      { href: '/blog/moringa-smoothie-recipes-australia-easy-2026', label: 'Moringa smoothie recipes' },
      { href: '/blog/moringa-with-vitamin-c-iron-absorption-guide-2026', label: 'Moringa and vitamin C for iron' },
      { href: '/blog/how-to-strengthen-immune-system-naturally-australia-2026', label: 'Strengthen immunity naturally' },
    ],
    ctaExtra: 'Lab-tested, shade-dried, packed in Melbourne. Free shipping over $49.',
  },
  {
    slug: 'curry-leaves-dahl-recipe-30-minutes-australia-2026',
    title: '30-Minute Curry Leaves Dahl: The Easiest Healthy Dinner',
    h1: '30-Minute Curry Leaves Dahl: The Easiest Healthy Dinner (2026)',
    meta: 'A proper South Indian-style dahl using dried curry leaves — done in 30 minutes, one pot, freezer-friendly. Why this meal is one of the most nutritious things an Australian can cook.',
    dateDisplay: '27 Jul 2026',
    dateIso: '2026-07-27',
    readMin: 4,
    productKey: 'curry',
    imgAlt:
      'Bowl of golden lentil dahl with curry leaves tempered in oil poured on top, on a dark wooden board with naan bread, photographed in natural light',
    quickAnswer:
      'Sauté onion, garlic, and spices, simmer red lentils with coconut milk and tomatoes for 20 minutes, then temper mustard seeds and dried curry leaves in hot oil and pour over. One pot, 30 minutes, serves four.',
    keyTakeaways: [
      'Red lentil dahl is high in plant protein and fibre, and cheap per serve.',
      'The curry leaves tempering is the flavour step that makes it taste South Indian.',
      'Dried curry leaves work well: use a few extra for intensity.',
      'Freezes for up to 3 months; remake tempering when reheating for best flavour.',
      'One of the most nutritious winter dinners you can cook in Australia for under $3 per person.',
    ],
    recipe: {
      name: '30-Minute Curry Leaves Dahl',
      description:
        'A simple, one-pot South Indian-style red lentil dahl with curry leaves tempered in oil — nutritious, freezer-friendly, done in 30 minutes',
      prepTime: 'PT5M',
      cookTime: 'PT25M',
      totalTime: 'PT30M',
      recipeYield: '4 servings',
      recipeIngredient: [
        '1 cup red lentils, rinsed',
        '1 can (400ml) coconut milk',
        '1.5 cups water',
        '1 medium onion, diced',
        '3 garlic cloves, minced',
        '1 tsp fresh ginger, grated',
        '1 can (400g) diced tomatoes',
        '1.5 tsp turmeric',
        '1 tsp cumin',
        '½ tsp ground coriander',
        'Salt to taste',
        '2 tbsp coconut or vegetable oil (for tempering)',
        '12-15 dried curry leaves',
        '1 tsp mustard seeds',
        'Juice of ½ lemon',
      ],
      recipeInstructions: [
        'Sauté onion in 1 tbsp oil over medium heat for 5 minutes until softened. Add garlic and ginger, cook 1 minute.',
        'Add turmeric, cumin, and coriander. Stir 30 seconds.',
        'Add rinsed lentils, coconut milk, water, and tinned tomatoes. Stir to combine. Bring to a gentle boil, then reduce to a simmer for 20 minutes, stirring occasionally, until lentils are fully soft.',
        'Season with salt and stir in lemon juice.',
        'Tempering: In a small pan, heat 1 tbsp oil over high heat. Add mustard seeds and wait until they pop (10-15 seconds). Add curry leaves — they will sizzle loudly. Fry 30 seconds until fragrant. Pour the entire contents of the small pan over the dahl.',
        'Stir once to distribute, serve immediately with rice or naan.',
      ],
    },
    sections: [
      {
        h2: 'Why dahl is such a good meal',
        body: [
          'If there is one meal to add to your rotation this winter, it is this. Red lentil dahl with a curry leaves tempering is one of the most nutritionally complete, cheapest, and fastest dinners you can make. It has been a staple in South Indian homes for generations, and it works on a cold July night in Melbourne or anywhere in Australia.',
          'One pot. 30 minutes. Serves four. Freezes perfectly.',
          'Red lentils deliver roughly 18g protein and 8g fibre per cooked cup. They are among the most consistent longevity foods across populations studied, and cost about $3 for enough to serve four. The curry leaves tempering is not decoration. Frying the leaves in hot oil releases aromatic compounds that define South Indian cooking: citrusy, smoky, deeply savoury. Sixty seconds, enormous difference.',
        ],
      },
      {
        h2: 'The Recipe: 30-Minute Curry Leaves Dahl',
        body: [
          '<strong>Serves:</strong> 4<br><strong>Time:</strong> 30 minutes<br><strong>One pot</strong> (plus a tiny second pan for tempering)',
          '<h3>Ingredients</h3><p><strong>For the dahl:</strong></p><ul><li>1 cup red lentils, rinsed well</li><li>1 can (400ml) coconut milk</li><li>1.5 cups water</li><li>1 medium onion, diced</li><li>3 garlic cloves, minced</li><li>1 tsp fresh ginger, grated</li><li>1 can (400g) diced tomatoes</li><li>1.5 tsp turmeric</li><li>1 tsp cumin</li><li>½ tsp ground coriander</li><li>Salt to taste</li><li>Juice of ½ lemon</li><li>1 tbsp oil for the base</li></ul><p><strong>For the curry leaves tempering:</strong></p><ul><li>1 tbsp coconut oil or vegetable oil</li><li>12 to 15 NutriThrive dried curry leaves (or 18 to 20 for more intensity)</li><li>1 tsp mustard seeds</li></ul><p><strong>To serve:</strong> Basmati rice, wholegrain naan, or crusty bread. Fresh coriander if you have it.</p>',
          '<h3>Method</h3><p><strong>Step 1 — Base (5 min).</strong> Heat 1 tbsp oil in a large pot over medium heat. Add onion and cook 5 minutes until softened. Add garlic and ginger, stir 1 minute.</p><p><strong>Step 2 — Spices (1 min).</strong> Add turmeric, cumin, and coriander. Stir constantly for 30 to 60 seconds until they bloom.</p><p><strong>Step 3 — Build and simmer (20 min).</strong> Add rinsed lentils, coconut milk, water, and tinned tomatoes. Stir. Bring to a gentle boil, then simmer 20 minutes, stirring every few minutes, until lentils are soft and the dahl has thickened. Add a splash of water if too thick.</p><p><strong>Step 4 — Season.</strong> Stir in lemon juice and salt to taste.</p><p><strong>Step 5 — Tempering (60 seconds, do not skip).</strong> In a small pan, heat 1 tbsp oil over high heat. Add mustard seeds; in 10 to 15 seconds they pop. Immediately add the curry leaves. They will sizzle loudly. Fry 30 seconds until fragrant and slightly crisp. Pour the entire contents over the dahl.</p><p><strong>Step 6 — Serve.</strong> Stir once to distribute. Serve over rice or with naan.</p>',
        ],
      },
      {
        h2: 'The nutritional quick-hit',
        body: [
          'Per serving with rice: roughly 520 calories, 24g protein, 12g fibre, plus iron, magnesium, folate, and antioxidant compounds from the curry leaves. Genuinely one of the most nutritionally complete cheap meals available to Australians.',
          '<strong>Variations:</strong> Use vegetable stock instead of water for more depth. Add ½ tsp chilli flakes with the spices for heat. Pressure cooker: 8 minutes high pressure, then temper and serve. Stir in a tin of chickpeas at the end for extra protein.',
        ],
      },
    ],
    faq: [
      {
        q: 'What do curry leaves do in dahl?',
        a: 'Curry leaves are fried in hot oil in the tempering step, releasing volatile aromatic oils that perfume the entire dish. They add a distinctive citrusy-smoky flavour that is uniquely South Indian and hard to replicate with any substitution.',
      },
      {
        q: 'Can I use dried curry leaves instead of fresh?',
        a: 'Yes. Dried curry leaves work well in this recipe. Add them to the hot oil the same way. Flavour is slightly milder than fresh, so use slightly more (18 to 20 dried leaves instead of 12 to 15).',
      },
      {
        q: 'Can I freeze this dahl?',
        a: 'Yes. Freeze in portions for up to 3 months. Reheat with a splash of water to loosen. Make the tempering fresh when serving after freezing for best flavour.',
      },
    ],
    inlineLinks: [
      { href: '/products/curry-leaves/', label: 'Get NutriThrive Dried Curry Leaves' },
      { href: '/blog/fresh-vs-dried-curry-leaves-cooking-comparison-2026', label: 'How to use dried curry leaves' },
      { href: '/blog/curry-leaves-health-benefits-what-the-evidence-says-2026', label: 'Curry leaves health benefits' },
    ],
    related: [
      { href: '/products/curry-leaves/', label: 'Shop dried curry leaves' },
      { href: '/blog/fresh-vs-dried-curry-leaves-cooking-comparison-2026', label: 'Fresh vs dried curry leaves' },
      { href: '/blog/curry-leaves-health-benefits-what-the-evidence-says-2026', label: 'Curry leaves health benefits' },
      { href: '/blog/curry-leaves-substitute-what-to-use-2026', label: 'Curry leaves substitutes' },
    ],
    ctaExtra: 'Shade-dried, packed in Melbourne. Free shipping over $49.',
  },
  {
    slug: 'darjeeling-chai-latte-recipe-winter-coffee-alternative-2026',
    title: 'Darjeeling Chai Latte Recipe: The Winter Coffee Alternative',
    h1: 'Darjeeling Chai Latte Recipe: The Winter Coffee Alternative (2026)',
    meta: 'Darjeeling chai latte: all the warmth of your morning coffee at half the caffeine. A 5-minute recipe that\'s better than anything from a cafe, and why Australians are making the switch this winter.',
    dateDisplay: '28 Jul 2026',
    dateIso: '2026-07-28',
    readMin: 4,
    productKey: 'tea',
    imgAlt:
      'Steaming cup of golden Darjeeling chai latte with cinnamon stick and star anise on a white saucer, winter morning Australian kitchen',
    quickAnswer:
      'Steep 1.5 tsp Darjeeling in 100ml water at about 90°C for 3 minutes. Warm oat milk with cinnamon, cardamom, cloves, and ginger. Strain tea, strain spiced milk over it, stir in honey. About 7 minutes, half the caffeine of coffee.',
    keyTakeaways: [
      'Darjeeling chai tastes more like tea than standard Assam-based cafe chai.',
      'Roughly 40 to 50mg caffeine per mug: about half a coffee.',
      'Home cost is around $0.60 per cup versus $7 to $9 at a cafe.',
      'Make a spiced milk concentrate for 3 days; brew Darjeeling fresh each morning.',
      'Steep exactly 3 minutes: longer gets bitter.',
    ],
    recipe: {
      name: 'Darjeeling Chai Latte',
      description:
        'A warming, spiced Darjeeling tea latte made at home in 5 minutes — half the caffeine of coffee, all the warmth',
      prepTime: 'PT2M',
      cookTime: 'PT5M',
      totalTime: 'PT7M',
      recipeYield: '1 mug',
      recipeIngredient: [
        '1.5 tsp NutriThrive Darjeeling loose leaf tea',
        '200ml oat milk (or regular milk)',
        '100ml water',
        '1 cinnamon stick (or ¼ tsp ground cinnamon)',
        '3 cardamom pods, lightly crushed',
        '2 cloves',
        '1 slice fresh ginger',
        '1 tsp honey',
      ],
      recipeInstructions: [
        'Bring water to 90°C (let boiled water sit 60 seconds). Add Darjeeling tea and steep 3 minutes.',
        'While tea steeps, add oat milk, cinnamon, cardamom, cloves, and ginger to a small saucepan. Warm gently over medium-low heat for 3-4 minutes — don\'t boil.',
        'Strain the brewed tea into your mug. Strain the spiced milk over the top.',
        'Stir in honey. Serve immediately.',
      ],
    },
    sections: [
      {
        h2: 'Why Darjeeling works here where Assam doesn\'t',
        body: [
          'Most Australians who want to reduce coffee stop trying because the alternatives do not feel like an upgrade. Herbal tea is pleasant but not the same. Green tea is fine but not warming enough for winter mornings.',
          'Darjeeling chai latte is different. It is warming, spiced, has enough caffeine to start the morning (about half a coffee), and with good Darjeeling it beats most $8 cafe chai lattes. It takes about 7 minutes.',
          'Standard chai uses Assam or CTC tea: strong and malty, built to punch through milk and spice. Darjeeling\'s muscatel and floral notes complement cardamom and cinnamon instead of disappearing under them. The result tastes more like tea and less like spiced milk with brown colour.',
        ],
      },
      {
        h2: 'The Recipe: Darjeeling Chai Latte',
        body: [
          '<strong>Makes:</strong> 1 large mug<br><strong>Time:</strong> 7 minutes',
          '<h3>Ingredients</h3><ul><li>1.5 tsp NutriThrive Darjeeling loose leaf tea</li><li>200ml oat milk (or regular whole milk)</li><li>100ml water</li><li>1 cinnamon stick (or ¼ tsp ground cinnamon)</li><li>3 cardamom pods, lightly crushed</li><li>2 cloves</li><li>1 thin slice fresh ginger</li><li>1 tsp honey (or to taste)</li></ul>',
          '<h3>Method</h3><p><strong>Step 1 — Brew the Darjeeling.</strong> Let boiled water sit 60 seconds (about 90°C). Pour 100ml over 1.5 tsp Darjeeling. Steep exactly 3 minutes. Strain into your mug.</p><p><strong>Step 2 — Make spiced milk.</strong> While tea steeps, warm oat milk with cinnamon, cardamom, cloves, and ginger over medium-low heat for 3 to 4 minutes. Steam, do not boil.</p><p><strong>Step 3 — Combine.</strong> Strain warm spiced milk over the Darjeeling. Stir in honey.</p><p><strong>Step 4 — Optional.</strong> Froth the milk before straining for a cafe-style texture.</p>',
        ],
      },
      {
        h2: 'Why make this at home rather than buy it',
        body: [
          'Cafe chai latte: $7 to $9, often made with syrup concentrate and instant tea powder. This at home: about $0.60 per cup using NutriThrive Darjeeling. Better taste, whole spices, less sugar.',
          'Over a month of daily use: roughly $18 at home versus $210 at the cafe.',
          '<strong>Variations:</strong> Stronger chai: 2 tsp Darjeeling, steep 4 minutes. Iced: brew stronger, pour over ice, add cold frothed oat milk. Lower-caffeine evening version: steep 30 seconds, discard, re-steep 3 minutes (most caffeine extracts early).',
        ],
      },
    ],
    faq: [
      {
        q: 'What makes Darjeeling chai different from regular chai latte?',
        a: 'Most chai lattes use strong Assam or CTC tea: bold, malty, and designed to be masked by spice and milk. Darjeeling brings muscatel and floral notes that work with the chai spices rather than disappearing under them, giving a more complex, less bitter base.',
      },
      {
        q: 'How much caffeine is in a Darjeeling chai latte?',
        a: 'Roughly 40 to 50mg, about half a standard coffee. The spices add no caffeine. A good choice if you want to reduce coffee without going caffeine-free.',
      },
      {
        q: 'Can I make a large batch of Darjeeling chai?',
        a: 'Yes. Make a spiced milk concentrate by simmering milk with spices for 10 minutes and refrigerating. Each morning, brew fresh Darjeeling and add warm concentrate. Keeps 3 days in the fridge.',
      },
    ],
    inlineLinks: [
      { href: '/products/black-tea/', label: 'Get NutriThrive Darjeeling Tea' },
      { href: '/blog/how-to-brew-darjeeling-tea-perfectly-2026', label: 'How to brew Darjeeling perfectly' },
      { href: '/blog/darjeeling-tea-vs-english-breakfast-comparison-2026', label: 'Darjeeling vs English Breakfast' },
    ],
    related: [
      { href: '/products/black-tea/', label: 'Shop Darjeeling tea' },
      { href: '/blog/how-to-brew-darjeeling-tea-perfectly-2026', label: 'Brew Darjeeling perfectly' },
      { href: '/blog/darjeeling-tea-coffee-replacement-honest-assessment-2026', label: 'Darjeeling as coffee replacement' },
      { href: '/blog/how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026', label: 'Darjeeling caffeine levels' },
    ],
    ctaExtra: 'First-flush character, packed in Melbourne. From $7.50.',
  },
  {
    slug: 'moringa-energy-bites-kids-lunchbox-recipe-australia-2026',
    title: 'Moringa Energy Bites for Kids: No-Bake Lunchbox Recipe',
    h1: 'Moringa Energy Bites for Kids: No-Bake Lunchbox Recipe (2026)',
    meta: 'Three ingredients, no baking, 15 minutes. These no-bake moringa energy bites are the lunchbox snack Australian parents are making instead of buying processed muesli bars.',
    dateDisplay: '29 Jul 2026',
    dateIso: '2026-07-29',
    readMin: 4,
    productKey: 'moringa',
    imgAlt:
      'Six green moringa energy bites rolled in coconut on a wooden board with a lunchbox in the background, Australian kitchen setting',
    quickAnswer:
      'Mix oats, nut butter (or sunflower seed butter for school), honey, 1 tsp moringa, chia, and coconut. Chill 15 minutes, roll into bites. Fridge for a week or freeze for 3 months. Kids usually cannot taste the moringa.',
    keyTakeaways: [
      'No-bake, about 15 minutes active time, batch for the week.',
      'Use sunflower seed butter for nut-free school lunchboxes.',
      'About 1/16 tsp moringa per bite: a food-level amount for kids 5+.',
      'Peanut butter and honey mask the earthy moringa flavour.',
      'One batch costs about $4 versus $1.20 to $1.80 per store bar.',
    ],
    recipe: {
      name: 'Moringa Energy Bites — No-Bake Lunchbox Snack',
      description:
        'No-bake oat energy bites with moringa powder — ready in 15 minutes, kid-friendly, school lunchbox safe',
      prepTime: 'PT10M',
      cookTime: 'PT0M',
      totalTime: 'PT25M',
      recipeYield: '14-16 bites',
      recipeIngredient: [
        '1 cup rolled oats',
        '½ cup natural peanut butter or almond butter (nut-free: sunflower seed butter)',
        '3 tbsp honey or maple syrup',
        '1 tsp NutriThrive moringa powder',
        '2 tbsp chia seeds',
        '1 tbsp shredded coconut (plus extra for rolling)',
        'Optional: 2 tbsp mini dark chocolate chips',
      ],
      recipeInstructions: [
        'Mix all ingredients together in a bowl until fully combined. The mixture should hold together when pressed — if too dry, add a teaspoon more nut butter; if too wet, add a tablespoon more oats.',
        'Refrigerate the mixture for 15 minutes — this makes rolling easier.',
        'Roll into balls roughly the size of a 50-cent coin (about 1 tablespoon of mixture each). Roll in extra coconut if desired.',
        'Store in an airtight container in the fridge for up to a week, or freeze for up to 3 months.',
      ],
    },
    sections: [
      {
        h2: 'What\'s actually in these (and why it matters)',
        body: [
          'Most packaged muesli bars say "oat" on the front and hide 14g of sugar per bar. These no-bake moringa energy bites take 15 minutes, use real ingredients, and you control what goes in. The moringa is nearly invisible in taste (peanut butter dominates), but the iron and vitamin A are there.',
          'Batch-make on Sunday. Done for the week.',
          '<strong>Rolled oats</strong> for fibre and slow energy. <strong>Peanut butter or sunflower seed butter</strong> for protein and fat. <strong>Honey</strong> for sweetness without glucose syrup. <strong>Moringa</strong> for iron and vitamin A. <strong>Chia</strong> for fibre and omega-3. <strong>Coconut</strong> for texture.',
          'One store bar: about $1.20 to $1.80. One batch of 14 to 16 bites: about $4 total.',
        ],
      },
      {
        h2: 'The Recipe: Moringa Energy Bites',
        body: [
          '<strong>Makes:</strong> 14 to 16 bites<br><strong>Time:</strong> 15 minutes + 15 min chill<br><strong>Keeps:</strong> 1 week fridge, 3 months freezer',
          '<h3>Ingredients</h3><ul><li>1 cup rolled oats</li><li>½ cup natural peanut butter or almond butter</li><li>3 tbsp honey or maple syrup</li><li>1 tsp NutriThrive moringa powder</li><li>2 tbsp chia seeds</li><li>1 tbsp shredded coconut + extra for rolling</li><li>Optional: 2 tbsp mini dark chocolate chips</li></ul><p><strong>Nut-free school version:</strong> Use sunflower seed butter instead of peanut butter.</p>',
          '<h3>Method</h3><p><strong>Step 1 — Mix.</strong> Combine all ingredients until fully combined. Should stick when pressed. Too dry? Add a teaspoon more nut butter. Too wet? Add a tablespoon more oats.</p><p><strong>Step 2 — Chill.</strong> Refrigerate 15 minutes so rolling is easier.</p><p><strong>Step 3 — Roll.</strong> Scoop a tablespoon and roll into a ball (about a 50-cent coin size). Roll in extra coconut if you like.</p><p><strong>Step 4 — Store.</strong> Airtight container in the fridge up to a week, or freeze up to 3 months.</p>',
        ],
      },
      {
        h2: 'The moringa question most parents ask',
        body: [
          '<strong>Will my kids taste it?</strong> No. One teaspoon across 14 to 16 bites is masked by peanut butter and honey. Add dark chocolate chips and it is entirely undetectable for most kids.',
          '<strong>Is it safe for kids?</strong> At this concentration (about 1/16 tsp per bite), moringa leaf is a food-safe amount for children over 5. If your child has a health condition or is on medication, confirm with their GP, same as with any new food. See our <a href="/blog/is-moringa-safe-for-children-kids-dosage-2026">children\'s moringa safety guide</a> for dosage detail.',
          '<strong>Make it yours:</strong> Chocolate version with 1 tbsp cacao plus chips. Tropical with crushed freeze-dried mango for rolling. Higher protein with 1 tbsp hemp seeds.',
        ],
      },
    ],
    faq: [
      {
        q: 'Are these energy bites safe for school lunchboxes?',
        a: 'The base recipe uses nut butter, which some Australian schools do not allow. Substitute sunflower seed butter for a nut-free version. The moringa, oats, honey, and chia seeds are school-safe.',
      },
      {
        q: 'Will kids taste the moringa in these bites?',
        a: 'No. Peanut butter, honey, and oats mask the earthy flavour. These taste like regular oat energy balls. Add dark chocolate chips and it is indistinguishable for most kids.',
      },
      {
        q: 'How much moringa do kids get per bite?',
        a: 'About 1/16th of a teaspoon per bite. Two bites gives roughly 1/8 teaspoon: a sensible, food-level amount for ages 5 and up.',
      },
    ],
    inlineLinks: [
      { href: '/products/moringa-powder/', label: 'Get NutriThrive Moringa — $11/100g' },
      { href: '/blog/is-moringa-safe-for-children-kids-dosage-2026', label: 'Can children have moringa?' },
      { href: '/blog/moringa-smoothie-recipes-australia-easy-2026', label: 'More moringa recipes' },
    ],
    related: [
      { href: '/products/moringa-powder/', label: 'Shop moringa powder' },
      { href: '/blog/is-moringa-safe-for-children-kids-dosage-2026', label: 'Is moringa safe for children?' },
      { href: '/blog/moringa-smoothie-recipes-australia-easy-2026', label: 'Moringa smoothie recipes' },
      { href: '/blog/moringa-avocado-toast-recipe-anti-inflammatory-breakfast-2026', label: 'Moringa avocado toast' },
    ],
    ctaExtra: 'One tub makes about 30 batches of these bites. Lab-tested, shade-dried, packed in Melbourne.',
  },
  {
    slug: 'moringa-avocado-toast-recipe-anti-inflammatory-breakfast-2026',
    title: 'Moringa Avocado Toast: The Anti-Inflammatory Breakfast (2026)',
    h1: 'Moringa Avocado Toast: The Anti-Inflammatory Breakfast (2026)',
    meta: 'Avocado toast upgraded: moringa stirred into the smash adds iron, vitamin A, and antioxidants. A 3-minute recipe that looks great, tastes better, and actually does something.',
    dateDisplay: '30 Jul 2026',
    dateIso: '2026-07-30',
    readMin: 3,
    productKey: 'moringa',
    imgAlt:
      'Moringa avocado toast on wholegrain sourdough with poached egg, chilli flakes, and microgreens on a white plate, modern Australian breakfast',
    quickAnswer:
      'Mash ripe avocado with ½ tsp moringa, lemon juice, and salt. Spread on toasted wholegrain sourdough. Optional: poached egg, chilli flakes, microgreens. Three minutes. Lemon vitamin C improves iron absorption from the moringa.',
    keyTakeaways: [
      'Half a teaspoon of moringa deepens the green and adds iron plus vitamin A.',
      'Lemon with moringa meaningfully improves iron absorption.',
      'About 11 cents of moringa upgrades a standard avocado toast.',
      'Taste stays mostly avocado: mild earthy depth, not grassy.',
      'Add eggs or seeds to turn it into a complete meal.',
    ],
    recipe: {
      name: 'Moringa Avocado Toast',
      description:
        'Avocado toast upgraded with moringa powder for iron, vitamin A, and antioxidants — ready in 3 minutes, genuinely anti-inflammatory',
      prepTime: 'PT3M',
      cookTime: 'PT0M',
      totalTime: 'PT3M',
      recipeYield: '1 serving',
      recipeIngredient: [
        '2 slices wholegrain sourdough or wholegrain bread',
        '1 ripe avocado',
        '½ tsp NutriThrive moringa powder',
        'Juice of ¼ lemon',
        'Pinch of flaky sea salt',
        'Pinch of chilli flakes or black pepper',
        'Optional: 1-2 poached or soft-boiled eggs',
        'Optional toppings: microgreens, pumpkin seeds, cherry tomatoes, dukkah',
      ],
      recipeInstructions: [
        'Toast the bread until golden.',
        'Scoop avocado into a small bowl. Add moringa powder, lemon juice, and salt. Mash with a fork until combined — the avocado turns a deeper green. Taste and adjust seasoning.',
        'Spread the moringa avocado smash onto the toast. Add preferred toppings.',
        'Serve immediately.',
      ],
    },
    sections: [
      {
        h2: 'What moringa adds to avocado (and why lemon matters)',
        body: [
          'Avocado toast does not need reinventing. But it can be upgraded. Half a teaspoon of moringa stirred into the smash adds iron, vitamin A, and antioxidant compounds that support an anti-inflammatory breakfast in the genuine, evidence-backed sense.',
          'It takes three minutes. It looks better. Most people cannot really taste a big difference.',
          'Avocado already brings monounsaturated fat, vitamin E, fibre, and potassium. Moringa adds iron, vitamin A (as beta-carotene), and polyphenols such as quercetin and chlorogenic acid. The lemon you already squeeze over toast? That vitamin C improves how much iron you absorb from the moringa. One of the best-evidenced nutrition pairings in food science.',
        ],
      },
      {
        h2: 'The Recipe: Moringa Avocado Toast',
        body: [
          '<strong>Serves:</strong> 1<br><strong>Time:</strong> 3 minutes',
          '<h3>Ingredients</h3><ul><li>2 slices wholegrain sourdough</li><li>1 ripe avocado</li><li>½ tsp NutriThrive moringa powder</li><li>Juice of ¼ lemon (fresh)</li><li>Pinch of flaky sea salt</li><li>Pinch of chilli flakes or cracked black pepper</li></ul><p><strong>Optional toppings:</strong> 1 to 2 poached eggs, microgreens or rocket, pumpkin seeds, cherry tomatoes, dukkah.</p>',
          '<h3>Method</h3><p><strong>Step 1 — Toast.</strong> Toast until golden and firm enough to hold the smash.</p><p><strong>Step 2 — Make the moringa smash.</strong> Scoop avocado into a bowl. Add moringa, lemon, and salt. Mash until combined. The colour deepens. Taste and adjust.</p><p><strong>Step 3 — Assemble.</strong> Spread onto toast. Add toppings. Eat immediately.</p>',
        ],
      },
      {
        h2: 'Why this is better than plain avocado toast',
        body: [
          '<strong>Nutritionally:</strong> iron and vitamin A added, with lemon improving iron absorption.',
          '<strong>Visually:</strong> moringa deepens the green, which looks more vibrant on the plate.',
          '<strong>Cost:</strong> about 11 cents of moringa on a $3 breakfast. Cheap nutrition upgrade.',
          '<strong>Best combinations:</strong> Classic with two poached eggs, chilli, microgreens. Seed version with pumpkin and sesame seeds. Simple weekday: smash, salt, pepper only.',
        ],
      },
    ],
    faq: [
      {
        q: 'Does moringa change the taste of avocado toast?',
        a: 'Barely. Half a teaspoon in a full avocado produces a slightly more earthy, green flavour that most people find adds depth. Lemon and salt dominate. If you are new to moringa, this is one of the most approachable ways to try it.',
      },
      {
        q: 'Why is this called anti-inflammatory?',
        a: 'Avocado provides monounsaturated fat and vitamin E. Moringa adds quercetin and chlorogenic acid, polyphenols with documented anti-inflammatory activity. Wholegrain bread provides fibre. Lemon adds vitamin C. These are evidence-backed food components, not marketing labels.',
      },
      {
        q: 'Does the moringa-lemon combination do anything specific?',
        a: 'Yes. Vitamin C from lemon significantly improves how much iron your body absorbs from moringa. You get meaningfully more iron from the moringa by including lemon than you would without it.',
      },
    ],
    inlineLinks: [
      { href: '/products/moringa-powder/', label: 'Get NutriThrive Moringa — $11/100g' },
      { href: '/blog/moringa-with-vitamin-c-iron-absorption-guide-2026', label: 'Moringa with vitamin C' },
      { href: '/blog/best-anti-inflammatory-foods-australia-daily-guide-2026', label: 'Anti-inflammatory foods guide' },
    ],
    related: [
      { href: '/products/moringa-powder/', label: 'Shop moringa powder' },
      { href: '/blog/moringa-with-vitamin-c-iron-absorption-guide-2026', label: 'Moringa and vitamin C' },
      { href: '/blog/best-anti-inflammatory-foods-australia-daily-guide-2026', label: 'Anti-inflammatory foods' },
      { href: '/blog/moringa-smoothie-recipes-australia-easy-2026', label: 'More moringa recipes' },
    ],
    ctaExtra: 'From 33 cents per day. Lab-tested, shade-dried, packed in Melbourne. Free shipping over $49.',
  },
];

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function articleSchema(post, ogImage) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.h1,
    description: post.meta,
    author: { '@type': 'Person', '@id': `${BASE}/#person-neer`, name: AUTHOR_SCHEMA },
    publisher: {
      '@type': 'Organization',
      name: 'NutriThrive',
      logo: { '@type': 'ImageObject', url: `${BASE}/assets/images/logo/logo-112.png` },
    },
    datePublished: post.dateIso,
    dateModified: post.dateIso,
    image: ogImage,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/blog/${post.slug}` },
  });
}

function breadcrumbJson(post) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: `${BASE}/blog/` },
      { '@type': 'ListItem', position: 3, name: 'Recipes', item: `${BASE}/blog/category/recipes/` },
      {
        '@type': 'ListItem',
        position: 4,
        name: post.title,
        item: `${BASE}/blog/${post.slug}`,
      },
    ],
  });
}

function buildFaqJson(faq) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a.replace(/<[^>]+>/g, '') },
    })),
  });
}

function buildRecipeJson(recipe) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: recipe.description,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    totalTime: recipe.totalTime,
    recipeYield: recipe.recipeYield,
    recipeIngredient: recipe.recipeIngredient,
    recipeInstructions: recipe.recipeInstructions.map((text) => ({
      '@type': 'HowToStep',
      text,
    })),
  });
}

function buildQuickAnswerBlock(post) {
  const takes = post.keyTakeaways.map((t) => `<li>${t}</li>`).join('\n');
  return `<div class="nt-quick-answer" style="background:#f4f7f5;border-left:4px solid #0f6b4d;padding:1.25rem 1.5rem;margin:0 0 2rem;border-radius:0 8px 8px 0;">
<h2>Quick Answer</h2>
<p>${post.quickAnswer}</p>
</div>
<div class="nt-key-takeaways" style="margin:0 0 2rem;">
<strong style="display:block; margin-bottom:0.5rem;">Key Takeaways</strong>
<ul>
${takes}
</ul>
</div>`;
}

function buildSectionsHtml(sections) {
  return sections
    .map((sec) => {
      const paras = sec.body.map((b) => (b.startsWith('<h3') || b.startsWith('<ol') || b.startsWith('<ul') || b.startsWith('<p') || b.startsWith('<strong>Makes') || b.startsWith('<strong>Serves') ? b : `<p>${b}</p>`)).join('\n');
      return `<h2>${escHtml(sec.h2)}</h2>\n${paras}`;
    })
    .join('\n\n');
}

function buildFaqHtml(faq) {
  const items = faq
    .map(
      (item) =>
        `<h3>${escHtml(item.q)}</h3>\n<p>${item.a}</p>`,
    )
    .join('\n');
  return `<h2>FAQ</h2>\n${items}`;
}

function buildHtml(post) {
  const prod = PRODUCTS[post.productKey];
  const canonical = `${BASE}/blog/${post.slug}`;
  const ogImage = `${BASE}${prod.og}`;
  const bodyHtml =
    buildQuickAnswerBlock(post) +
    '\n\n' +
    buildSectionsHtml(post.sections) +
    '\n\n' +
    buildFaqHtml(post.faq);
  const relatedHtml = post.related
    .map((r) => `    <li><a href="${r.href}">${escHtml(r.label)}</a></li>`)
    .join('\n');
  const inlineLinksHtml = post.inlineLinks
    .map((l) => `<a href="${l.href}">${escHtml(l.label)}</a>`)
    .join(' · ');
  const imgAlt = post.imgAlt || post.h1;

  return `<!DOCTYPE html>
<html class="scroll-smooth" lang="en-AU">
<head>
<script src="/scripts/global/defer-loader.min.js" defer></script>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${escHtml(post.title)}</title>
<script>
 window.dataLayer = window.dataLayer || [];
 function gtag(){dataLayer.push(arguments);}
 if (window.DeferLoader) {
 window.DeferLoader.deferUntilInteraction(function() {
 window.DeferLoader.loadScript('https://www.googletagmanager.com/gtag/js?id=G-WH21SW75WP', {
 async: true, crossorigin: 'anonymous'
 }).then(function() {
 gtag('js', new Date());
 gtag('config', 'G-WH21SW75WP', {'anonymize_ip': true, 'allow_google_signals': false});
 }).catch(function(err) { console.warn('[GA] Failed to load:', err); });
 }, { once: true, passive: true });
 } else {
 window.addEventListener('load', function() {
 var s = document.createElement('script');
 s.async = true;
 s.src = 'https://www.googletagmanager.com/gtag/js?id=G-WH21SW75WP';
 s.crossOrigin = 'anonymous';
 document.head.appendChild(s);
 gtag('js', new Date());
 gtag('config', 'G-WH21SW75WP', {'anonymize_ip': true, 'allow_google_signals': false});
 });
 }
</script>
<meta name="robots" content="${START_NOINDEX ? 'noindex, follow' : 'index, follow'}"/>
<link rel="canonical" href="${canonical}"/>
<link rel="alternate" type="text/plain" href="${BASE}/llms.txt" title="LLMs.txt">
<link rel="alternate" hreflang="en-AU" href="${canonical}"/>
<link rel="alternate" hreflang="x-default" href="${canonical}"/>
<meta name="description" content="${escHtml(post.meta)}"/>
<meta name="author" content="NutriThrive Australia"/>
<meta property="og:type" content="article"/>
<meta property="og:url" content="${canonical}"/>
<meta property="og:title" content="${escHtml(post.title)}"/>
<meta property="og:description" content="${escHtml(post.meta)}"/>
<meta property="og:image" content="${ogImage}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:site_name" content="NutriThrive Australia"/>
<meta property="og:locale" content="en_AU"/>
<meta property="article:published_time" content="${post.dateIso}T00:00:00+10:00"/>
<meta property="article:modified_time" content="${post.dateIso}T00:00:00+10:00"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:url" content="${canonical}"/>
<meta name="twitter:title" content="${escHtml(post.title)}"/>
<meta name="twitter:description" content="${escHtml(post.meta)}"/>
<meta name="twitter:image" content="${ogImage}"/>
<script type="application/ld+json">${articleSchema(post, ogImage)}</script>
<script type="application/ld+json">${breadcrumbJson(post)}</script>
<script type="application/ld+json">${buildRecipeJson(post.recipe)}</script>
<script type="application/ld+json">${buildFaqJson(post.faq)}</script>
<link rel="icon" type="image/png" sizes="48x48" href="/assets/images/logo/favicon-48.png">
<link rel="icon" href="/assets/images/logo/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="96x96" href="/assets/images/logo/favicon-96.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/images/logo/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileImage" content="/assets/images/logo/apple-touch-icon.png">
<meta name="msapplication-TileColor" content="#0f6b4d">
<meta name="theme-color" content="#0f6b4d"/>
<link rel="preconnect" href="https://www.googletagmanager.com"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link rel="dns-prefetch" href="https://www.redditstatic.com"/>
<link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400..700&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&amp;display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="/assets/css/design-system.min.css"/>
<link rel="stylesheet" href="/styles/global/style.min.css"/>
<link rel="stylesheet" href="/assets/css/tailwind-v2.min.css"/>
<link rel="stylesheet" href="/blog/blog-v2-prose.min.css"/>
<link rel="stylesheet" href="/shared/css/v2-extra.min.css"/>
<link rel="stylesheet" href="/shared/css/author-bio.min.css" media="print" onload="this.media='all'"/><noscript><link rel="stylesheet" href="/shared/css/author-bio.min.css"/></noscript>
</head>
<body class="bg-background text-on-background font-body-md overflow-x-hidden nt-blog-article">
<div class="nt-sticky-top">
<div class="nt-promo-bar">&#x23F0; Order before 2pm for same-day Melbourne dispatch &#x2022; &#x1F69A; Free shipping over $49</div>
<header id="nt-header" class="nt-v2-header"></header>
</div>
<nav class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-4 pb-2 text-label-sm" aria-label="Breadcrumb">
<ol class="flex flex-wrap items-center gap-1 list-none m-0 p-0"><li><a class="text-moringa-leaf hover:underline" href="/">Home</a></li><li class="text-on-surface-variant" aria-hidden="true">&#x203A;</li><li><a class="text-moringa-leaf hover:underline" href="/blog/">Journal</a></li><li class="text-on-surface-variant" aria-hidden="true">&#x203A;</li><li><a class="text-moringa-leaf hover:underline" href="/blog/category/recipes/">Recipes</a></li><li class="text-on-surface-variant" aria-hidden="true">&#x203A;</li><li class="text-on-surface" aria-current="page">${escHtml(post.title)}</li></ol>
</nav>
<main class="pt-6 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop nt-blog-main">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
<article class="lg:col-span-8">
<header class="mb-12">
<div class="flex flex-wrap items-center gap-2 mb-4">
<span class="bg-primary-fixed/30 text-moringa-leaf px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider font-bold">Recipes</span>
<span class="text-on-surface-variant text-label-lg font-body-md">${post.dateDisplay}</span>
<span class="text-on-surface-variant text-label-lg font-body-md">&#183; ${post.readMin} min read</span>
</div>
<h1 class="font-display text-headline-lg md:text-display text-forest-deep mb-4 leading-tight">${escHtml(post.h1)}</h1>
<p class="text-on-surface-variant text-body-md mb-8"><strong>By ${AUTHOR_BYLINE}</strong> &#183; Last updated: ${post.dateDisplay}</p>
<div class="w-full aspect-[16/9] rounded-xl overflow-hidden mb-12 shadow-sm bg-surface-container">
<img alt="${escHtml(imgAlt)}" class="w-full h-full object-cover" src="${prod.hero}" width="1200" height="630" loading="eager" decoding="async" fetchpriority="high"/>
</div>
</header>
<div class="blog-v2-prose max-w-none">

${bodyHtml}

<p style="margin-top:2rem; font-style:italic; color:#555;"><em>Written by Neer. NutriThrive Australia.</em></p>

<p>${inlineLinksHtml}</p>

<p class="nt-disclaimer"><em>These statements have not been evaluated by the TGA. This content is general information only, not medical advice. Food products are not intended to diagnose, treat, cure, or prevent any disease.</em></p>

<div class="nt-article-cta">
<h3>${prod.ctaHeading}</h3>
<p>${escHtml(post.ctaExtra || '')} Shop our <a href="${prod.shopHref}">${prod.ctaProduct}</a>.</p>
<div class="btn-row">
<a class="btn-solid" href="${prod.shopHref}">${prod.ctaBtn}</a>
<a class="btn-outline" href="/shipping">Shipping &amp; returns</a>
</div>
</div>
<p style="margin-top: 1rem;"><a href="/blog/">&larr; Back to all articles</a></p>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul><li><strong>${post.dateDisplay}:</strong> Recipe published.</li></ul>
</div>
<section class="nt-related-links-block">
 <h2>Related guides</h2>
 <ul>
${relatedHtml}
 </ul>
</section>
</div>
</article>
<aside class="lg:col-span-4 space-y-12">
<div class="bg-pure-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
<div class="aspect-square bg-surface-container relative">
<img alt="${escHtml(prod.sidebarTitle)}" class="w-full h-full object-cover" src="${prod.sidebarImg}" loading="lazy"/>
${prod.badge ? '<div class="absolute top-4 right-4 bg-terracotta-clay text-pure-white px-3 py-1 rounded-lg text-label-sm font-label-sm">Best Seller</div>' : ''}
</div>
<div class="p-6">
<h4 class="font-headline-md text-headline-md text-forest-deep mb-2">${escHtml(prod.sidebarTitle)}</h4>
<p class="text-on-surface-variant font-body-md text-body-md mb-6">${escHtml(prod.sidebarDesc)}</p>
<div class="nt-blog-sidebar-price flex items-baseline gap-1 mb-6">
<span class="text-2xl font-bold text-moringa-leaf">${prod.sidebarPrice}</span>
<span class="text-sm text-on-surface-variant">${prod.sidebarUnit}</span>
</div>
<a class="block w-full text-center bg-terracotta-clay text-pure-white py-4 rounded-lg font-label-lg text-label-lg hover:scale-[1.02] transition-transform" href="${prod.shopHref}">${prod.shopLabel}</a>
</div>
</div>
</aside>
</div>
</main>
<div id="nt-footer"></div>
<script src="/scripts/global/reddit-pixel.min.js" defer></script>
<script src="/shared/site-data.min.js" defer></script>
<script src="/scripts/global/cart.min.js" defer></script>
<script src="/shared/js/cart-v2-ui.min.js" defer></script>
<script src="/shared/js/footer-v2.min.js" defer></script>
<script src="/shared/js/author-bio.min.js" defer></script>
<script src="/shared/js/layout-v2.min.js" defer></script>
<script src="/shared/js/v2-site.min.js" defer></script>
</body>
</html>
`;
}

function appendRedirects(posts) {
  const redirectsPath = path.join(SITE, '_redirects');
  let content = fs.readFileSync(redirectsPath, 'utf8');
  const marker = '\n# === recipe sales batch (Jul 2026) ===';
  if (!content.includes(marker)) {
    content += marker;
  }
  const beforeMarker = content.split(marker)[0];
  const existingAfter = content.includes(marker) ? content.split(marker)[1] : '';
  const existingSlugs = new Set(
    [...existingAfter.matchAll(/\/blog\/([a-z0-9-]+)\.html/g)].map((m) => m[1]),
  );
  const newBlocks = posts
    .filter((p) => !existingSlugs.has(p.slug))
    .map((p) => {
      const short = p.title.replace(/ \(2026\)$/, '').slice(0, 60);
      return `\n# ${short} (recipe sales jul 2026)\n/blog/${p.slug}.html /blog/${p.slug} 301!\n/blog/${p.slug} /blog/${p.slug}.html 200`;
    });
  if (!content.includes('/blog/category/recipes')) {
    content =
      beforeMarker +
      '\n/blog/category/recipes /blog/category/recipes/index.html 200\n/blog/category/recipes/ /blog/category/recipes/index.html 200' +
      marker +
      existingAfter;
  } else {
    content = beforeMarker + marker + existingAfter;
  }
  // Re-read split after possible category insert
  const parts = content.split(marker);
  const final =
    parts[0] + marker + (parts[1] || '') + newBlocks.join('') + '\n';
  fs.writeFileSync(redirectsPath, final);
  console.log(`Updated _redirects (+${newBlocks.length} entries)`);
}

function writeRecipesCategory(posts) {
  const catDir = path.join(BLOG_DIR, 'category/recipes');
  fs.mkdirSync(catDir, { recursive: true });
  const items = posts
    .map(
      (p) =>
        `<li><a class="text-moringa-leaf hover:underline" href="/blog/${p.slug}">${escHtml(p.title)}</a></li>`,
    )
    .join('\n');
  const html = `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Recipes | NutriThrive Journal</title>
<meta name="description" content="Practical NutriThrive recipes: moringa shots, dahl with curry leaves, Darjeeling chai, lunchbox bites, and breakfast upgrades."/>
<link rel="canonical" href="https://nutrithrive.com.au/blog/category/recipes/"/>
<meta name="robots" content="index, follow"/>
<link rel="stylesheet" href="/assets/css/design-system.min.css"/>
<link rel="stylesheet" href="/styles/global/style.min.css"/>
<link rel="stylesheet" href="/assets/css/tailwind-v2.min.css"/>
<link rel="stylesheet" href="/shared/css/v2-extra.min.css"/>
<link rel="icon" type="image/png" sizes="48x48" href="/assets/images/logo/favicon-48.png">
<link rel="icon" href="/assets/images/logo/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="96x96" href="/assets/images/logo/favicon-96.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/images/logo/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileImage" content="/assets/images/logo/apple-touch-icon.png">
<meta name="msapplication-TileColor" content="#0f6b4d">
</head>
<body class="bg-background text-on-background font-body-md overflow-x-hidden">
<div class="nt-sticky-top"><header id="nt-header"></header></div>
<main class="pt-32 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
<nav class="text-label-sm mb-6" aria-label="Breadcrumb">
<ol class="flex flex-wrap items-center gap-1 list-none m-0 p-0">
<li><a class="text-moringa-leaf hover:underline" href="/">Home</a></li>
<li class="text-on-surface-variant" aria-hidden="true">›</li>
<li><a class="text-moringa-leaf hover:underline" href="/blog/">Journal</a></li>
<li class="text-on-surface-variant" aria-hidden="true">›</li>
<li class="text-on-surface" aria-current="page">Recipes</li>
</ol>
</nav>
<header class="mb-10">
<h1 class="font-display text-headline-lg text-forest-deep mb-3">Recipes</h1>
<p class="text-on-surface-variant max-w-2xl">Short, practical recipes using NutriThrive moringa, curry leaves, and Darjeeling tea.</p>
</header>
<ul class="grid gap-3 list-none m-0 p-0">
${items}
<li><a class="text-moringa-leaf hover:underline" href="/blog/moringa-smoothie-recipes-australia-easy-2026">5 Moringa Smoothie Recipes That Don't Taste Like Grass (2026)</a></li>
</ul>
<p class="mt-10"><a class="text-moringa-leaf hover:underline" href="/blog/">← All journal articles</a></p>
</main>
<div id="nt-footer"></div>
<script src="/shared/site-data.min.js" defer></script>
<script src="/scripts/global/cart.min.js" defer></script>
<script src="/shared/js/footer-v2.min.js" defer></script>
<script src="/shared/js/layout-v2.min.js" defer></script>
<script src="/shared/js/v2-site.min.js" defer></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(catDir, 'index.html'), html);
  console.log('Wrote blog/category/recipes/index.html');
}

function main() {
  const created = [];
  for (const post of POSTS) {
    const outPath = path.join(BLOG_DIR, `${post.slug}.html`);
    if (fs.existsSync(outPath)) {
      console.warn(`SKIP (exists): ${post.slug}.html`);
      continue;
    }
    fs.writeFileSync(outPath, buildHtml(post));
    created.push(post);
    console.log(`Created ${post.slug}.html`);
  }
  // Always refresh category + redirects for full POSTS list (even if some existed)
  writeRecipesCategory(POSTS);
  appendRedirects(created.length ? created : POSTS);
  console.log(`\nDone: ${created.length} recipe posts${START_NOINDEX ? ' (noindex)' : ''}`);
  for (const p of created.length ? created : POSTS) {
    console.log(`  - ${p.slug} (${p.dateIso})`);
  }
}

main();
