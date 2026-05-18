/** NutriThrive Website 2.0 — product & site data from live site (schema, product pages, homepage). */
window.NT_SITE_DATA = {
  brand: 'NutriThrive',
  tagline: "Australia's freshest lab-tested moringa",
  contact: {
    email: 'nutrithrive0@gmail.com',
    phone: '+61 438 201 419',
    phoneTel: '+61438201419',
    address: '15 Europe Street, Truganina VIC 3029, Melbourne, Australia',
    hours: 'Daily 9:00 AM – 11:00 PM AEST',
    abn: '32 639 442 616',
  },
  shipping: {
    freeAuThreshold: 80,
    freeWorldThreshold: 90,
    /** Fallback only if shipping-rates.js fails to load */
    defaultAuRate: 8.73,
    dispatchNote: 'Order before 2pm for same-day Melbourne dispatch',
  },
  rating: { value: '4.9', count: 16 },
  social: {
    instagram: 'https://www.instagram.com/nutri__thrive/',
  },
  assets: {
    logo: '/assets/images/logo/LOGO.webp',
    hero: '/assets/images/blog/GC.webp',
    moringaHero: '/assets/images/product_photos/moringa.jpeg',
    aboutHero: '/assets/images/homepage/product-showcase/aboutpage.png',
    aboutFeature: '/assets/images/homepage/product-showcase/aboutpage2.png',
    aboutVisit: '/assets/images/homepage/product-showcase/aboutpage3.png',
    contactHero: '/assets/images/homepage/product-showcase/contact.png',
  },
  labReport: '/documents/nutrithrive-lab-report-summary.pdf',
  /** Encode path segments so filenames like 3+1.jpeg resolve reliably in img src and cart URLs. */
  productImageUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) {
      try {
        const u = new URL(path);
        u.pathname = u.pathname
          .split('/')
          .map((seg) => (seg ? encodeURIComponent(decodeURIComponent(seg)) : seg))
          .join('/');
        return u.href;
      } catch {
        return path;
      }
    }
    const segments = path.replace(/^\//, '').split('/');
    return `/${segments.map((seg) => encodeURIComponent(decodeURIComponent(seg))).join('/')}`;
  },
  products: [
    {
      id: 'moringa-powder-100g',
      sku: 'NT-MOR-100G',
      name: 'Moringa Powder — 100g',
      shortName: 'Moringa Powder',
      tag: '100G PACK • 30 SERVINGS',
      badge: '100g Pack',
      price: 11,
      was: 14,
      weight: 100,
      image: '/assets/images/product_photos/moringa.jpeg',
      href: '/products/moringa-powder/',
      description: '100% pure shade-dried moringa leaf powder. Lab-tested in Australia.',
      pdp: {
        headline: 'Premium Moringa Powder (100g)',
        intro: 'Shade-dried to lock in nutrients, lab-tested for purity, and packed fresh in Melbourne. No additives, no fillers—just 100% pure moringa powder.',
        features: [
          { icon: 'eco', text: '100% Pure Moringa' },
          { icon: 'wb_sunny', text: 'Shade-Dried' },
          { icon: 'science', text: 'Lab-Tested' },
          { icon: 'location_on', text: 'Melbourne Packed' },
        ],
        detailTitle: 'Purity You Can See',
        detailBody:
          'NutriThrive Moringa is shade-dried to preserve vitamins, minerals, and chlorophyll. Every batch is verified in an Australian laboratory for heavy metals and purity.',
        faqs: [
          { q: 'How do I use Moringa powder?', a: 'Add 1 teaspoon (3–5g) to smoothies, juice, or water. Works great in soups and salads.' },
          { q: 'Where is it shipped from?', a: 'Packed and shipped from our Truganina, Melbourne warehouse. Same-day dispatch before 2pm AEST.' },
        ],
        showLabBadge: true,
        variantPicker: true,
      },
    },
    {
      id: 'moringa-powder-200g',
      sku: 'NT-MOR-200G',
      name: 'Moringa Powder — 200g',
      shortName: '200g Moringa',
      tag: '200G PACK',
      badge: '200g',
      price: 21.5,
      was: 28,
      weight: 200,
      image: '/assets/images/product_photos/200g.png',
      href: '/products/moringa-powder/',
      pdp: {
        headline: 'Moringa Powder — 200g',
        intro: 'Double the daily ritual—200g of shade-dried, lab-tested moringa leaf powder packed in Melbourne.',
        features: [
          { icon: 'eco', text: '100% Pure Moringa' },
          { icon: 'science', text: 'Lab-Tested' },
          { icon: 'location_on', text: 'Melbourne Packed' },
          { icon: 'inventory_2', text: '200g Value Pack' },
        ],
        detailTitle: 'More servings, same purity',
        detailBody: 'Our 200g pack is ideal for daily users who want better value without compromising on freshness or lab-tested quality.',
        faqs: [
          { q: 'How long does 200g last?', a: 'At 1 tsp per day, roughly 60+ servings depending on your dose.' },
          { q: 'Is it the same powder as the 100g?', a: 'Yes—identical shade-dried leaf powder, batch-tested in Australia.' },
        ],
        showLabBadge: true,
        variantPicker: true,
      },
    },
    {
      id: 'moringa-400g',
      sku: 'NT-MOR-400G',
      name: '3 + 1 = 400g Moringa',
      tag: '4 PACK • BEST VALUE',
      badge: 'Best Value',
      price: 35,
      was: 56,
      weight: 400,
      image: '/assets/images/product_photos/moringa-400g-bundle.jpeg',
      href: '/products/moringa-powder/',
      pdp: {
        headline: '3 + 1 = 400g Moringa Bundle',
        intro: 'Our best-value bundle—four packs for the price of three. Fresh, lab-tested moringa for families or daily users.',
        features: [
          { icon: 'savings', text: 'Best Value' },
          { icon: 'eco', text: '100% Pure Moringa' },
          { icon: 'science', text: 'Lab-Tested' },
          { icon: 'location_on', text: 'Melbourne Packed' },
        ],
        detailTitle: 'Bulk savings without bulk quality loss',
        detailBody: 'Stock up on small-batch moringa. Each pouch is packed fresh in Melbourne with the same lab standards as our 100g pack.',
        faqs: [
          { q: 'What is included?', a: 'Four 100g equivalent packs (400g total) of shade-dried moringa leaf powder.' },
          { q: 'How should I store it?', a: 'Keep pouches sealed in a cool, dry place away from direct sunlight.' },
        ],
        showLabBadge: true,
        variantPicker: true,
      },
    },
    {
      id: 'moringa-soap',
      sku: 'NT-SOAP-95G',
      name: 'Moringa Soap',
      tag: '95G PACK • NATURAL SOAP',
      badge: 'Eco Friendly',
      price: 7,
      was: 9.49,
      weight: 95,
      image: '/assets/images/product_photos/soap.jpeg',
      href: '/products/moringa-soap/',
      pdp: {
        headline: 'Moringa Natural Soap',
        intro: 'Handcrafted soap with moringa—gentle on skin, packed with natural antioxidants. 95g bar, made in small batches.',
        features: [
          { icon: 'spa', text: 'Natural Ingredients' },
          { icon: 'eco', text: 'Moringa Infused' },
          { icon: 'location_on', text: 'Melbourne Packed' },
          { icon: 'favorite', text: 'Eco Friendly' },
        ],
        detailTitle: 'Skincare from the moringa tree',
        detailBody:
          'Our moringa soap combines nourishing oils with moringa leaf powder for a gentle cleanse—no harsh chemicals, ideal for daily use.',
        faqs: [
          { q: 'What size is the bar?', a: '95g—compact enough for travel, lasts well with proper drainage.' },
          { q: 'Is it suitable for sensitive skin?', a: 'Made with gentle, natural ingredients; patch-test if you have very sensitive skin.' },
        ],
        showLabBadge: false,
        variantPicker: false,
      },
    },
    {
      id: 'combo-pack',
      sku: 'NT-COMBO',
      name: 'Premium Combo Pack',
      tag: 'MORINGA 100G + CURRY 30G',
      badge: 'Combo',
      price: 17,
      was: 22.49,
      weight: 130,
      image: '/assets/images/product_photos/combo.jpeg',
      href: '/products/combo-pack/',
      pdp: {
        headline: 'Premium Combo Pack',
        intro: 'Moringa Powder 100g plus 30g dried curry leaves—pantry essentials for smoothies and South Indian cooking.',
        features: [
          { icon: 'inventory_2', text: '2 Products' },
          { icon: 'eco', text: 'Moringa + Curry' },
          { icon: 'science', text: 'Lab-Tested Moringa' },
          { icon: 'location_on', text: 'Melbourne Packed' },
        ],
        detailTitle: 'Wellness + flavour in one box',
        detailBody: 'Start your morning with moringa in a smoothie, then fry curry leaves in ghee for dinner—both packed fresh in Melbourne.',
        faqs: [
          { q: 'What is in the combo?', a: '100g moringa powder and 30g premium dried curry leaves (karipatta).' },
          { q: 'Can I buy them separately?', a: 'Yes—each item is also available individually in our shop.' },
        ],
        showLabBadge: true,
        variantPicker: true,
      },
    },
    {
      id: 'moringa-soap-combo',
      sku: 'NT-MOR-SOAP',
      name: 'Moringa 100g + Soap 95g',
      tag: '195 G NET • BUNDLE',
      badge: 'Bundle',
      price: 17,
      was: 23.39,
      weight: 195,
      image: '/assets/images/product_photos/moringasoapcombo.jpeg',
      href: '/products/moringa-soap/',
      pdp: {
        headline: 'Moringa 100g + Soap 95g Bundle',
        intro: 'Inside-out wellness—daily moringa powder plus a natural moringa soap bar. Save vs buying separately.',
        features: [
          { icon: 'inventory_2', text: 'Powder + Soap' },
          { icon: 'eco', text: 'Moringa Inside & Out' },
          { icon: 'science', text: 'Lab-Tested Powder' },
          { icon: 'spa', text: 'Natural Soap' },
        ],
        detailTitle: 'The complete moringa ritual',
        detailBody: 'Support your routine with edible moringa and a gentle cleansing bar—both from the same trusted Melbourne supplier.',
        faqs: [
          { q: 'What is included?', a: '100g moringa powder and one 95g moringa soap bar.' },
          { q: 'Is this a gift-friendly bundle?', a: 'Yes—popular for birthdays and wellness gifts shipped Australia-wide.' },
        ],
        showLabBadge: true,
        variantPicker: true,
      },
    },
    {
      id: 'curry-leaves-30g',
      sku: 'NT-CUR-30G',
      name: '30g Dried Curry Leaves',
      shortName: 'Dried Curry Leaves',
      tag: '30G • PREMIUM KARIPATTA',
      badge: 'Pantry',
      price: 7,
      was: 8.49,
      weight: 30,
      image: '/assets/images/product_photos/driedcurry.jpeg',
      href: '/products/curry-leaves/',
      pdp: {
        headline: '30g Dried Curry Leaves',
        intro: 'Premium karipatta from our farm—aromatic, pantry-ready, packed in Melbourne. Use 2–3× vs fresh in tadka.',
        features: [
          { icon: 'restaurant', text: 'Premium Karipatta' },
          { icon: 'grass', text: 'Farm Sourced' },
          { icon: 'location_on', text: 'Melbourne Packed' },
          { icon: 'kitchen', text: 'Pantry Ready' },
        ],
        detailTitle: 'Restaurant-quality aroma at home',
        detailBody:
          'Fry in hot oil or ghee at the start of cooking to release the signature curry-leaf fragrance—essential for dals, sambar, and curries.',
        faqs: [
          { q: 'How do I use dried vs fresh?', a: 'Use about 2–3 times the amount of dried leaves compared to fresh.' },
          { q: 'How long do they keep?', a: '6+ months in an airtight container in a cool, dry place.' },
        ],
        showLabBadge: false,
        variantPicker: true,
      },
    },
    {
      id: 'black-tea',
      sku: 'NT-TEA-DAR',
      name: 'Darjeeling Black Tea',
      tag: 'PREMIUM LOOSE LEAF',
      badge: 'Tea',
      price: 7.5,
      was: 10,
      weight: 100,
      image: '/assets/images/product_photos/blacktea.jpeg',
      href: '/products/black-tea/',
      pdp: {
        headline: 'Darjeeling Black Tea',
        intro: 'The "champagne of teas"—muscatel, floral and fruity notes. Premium loose leaf shipped from Melbourne.',
        features: [
          { icon: 'local_cafe', text: 'Loose Leaf' },
          { icon: 'terrain', text: 'Darjeeling Origin' },
          { icon: 'location_on', text: 'Melbourne Packed' },
          { icon: 'wb_twilight', text: '~40–50mg Caffeine' },
        ],
        detailTitle: 'Brew like a connoisseur',
        detailBody:
          'Use 1–2 tsp per cup with water at 85–90°C (not boiling). Steep 3–5 minutes for muscatel sweetness—enjoy plain or with a splash of milk.',
        faqs: [
          { q: 'How do I brew it?', a: '85–90°C water, 3–5 minute steep. Avoid boiling water to prevent bitterness.' },
          { q: 'How much caffeine?', a: 'About 40–50mg per cup—a moderate, steady lift.' },
        ],
        showLabBadge: false,
        variantPicker: false,
      },
    },
  ],
  moringaVariants: [
    { id: 'moringa-400g', label: '3 + 1 = 400g — $35.00 (was $56.00)', price: 35, was: 56, weight: 400 },
    { id: 'moringa-powder-100g', label: '100g Moringa — $11.00 (was $14.00)', price: 11, was: 14, weight: 100 },
    { id: 'combo-pack', label: 'Combo Moringa + Curry Leaves — $17.00 (was $22.49)', price: 17, was: 22.49, weight: 130 },
    { id: 'moringa-powder-200g', label: '200g Moringa — $21.50 (was $28.00)', price: 21.5, was: 28, weight: 200 },
    { id: 'curry-leaves-30g', label: '30g Dried Curry Leaves — $7.00 (was $8.49)', price: 7, was: 8.49, weight: 30 },
    { id: 'moringa-soap-combo', label: 'Moringa 100g + Soap 95g — $17.00 (was $23.39)', price: 17, was: 23.39, weight: 195 },
  ],
  testimonials: [
    { quote: 'I have tried many moringa brands, but NutriThrive is by far the best. Bright green colour, fresh taste, and I feel the difference.', author: 'James H.', meta: 'Verified Buyer', initials: 'JH', avatarBg: 'bg-primary-fixed' },
    { quote: 'The dried curry leaves are so aromatic! My dhal has never tasted better. Fast shipping from Melbourne.', author: 'Priya M.', meta: 'Melbourne, VIC', initials: 'PM', avatarBg: 'bg-tertiary-fixed' },
    { quote: 'Moringa powder has completely transformed my energy levels. No more afternoon crashes, and my digestion is so much better.', author: 'Emma B.', meta: 'Sydney, NSW', initials: 'EB', avatarBg: 'bg-secondary-fixed' },
    { quote: "I've been using NutriThrive Moringa for 3 months and the difference is incredible. My energy stays high all day, and I haven't had a cold since starting.", author: 'Sarah M.', meta: 'Melbourne, VIC', initials: 'SM', avatarBg: 'bg-primary-fixed' },
    { quote: "As someone who's tried multiple moringa brands, NutriThrive stands out. The freshness is noticeable — clearly not sitting on a shelf for months.", author: 'James T.', meta: 'Sydney, NSW', initials: 'JT', avatarBg: 'bg-surface-container-high' },
    { quote: 'I started taking moringa for my iron deficiency and it has been a game-changer. My doctor was impressed with my latest blood test results.', author: 'Emma L.', meta: 'Brisbane, QLD', initials: 'EL', avatarBg: 'bg-tertiary-fixed' },
    { quote: 'High quality moringa powder, exactly as described. Fast shipping and great customer service. The 7-day guarantee gave me confidence to try it!', author: 'Michael R.', meta: 'Adelaide, SA', initials: 'MR', avatarBg: 'bg-secondary-fixed' },
    { quote: 'Love this moringa! Clearer skin, more energy, and I feel healthier overall. The taste is mild and pleasant — highly recommend.', author: 'Lisa K.', meta: 'Perth, WA', initials: 'LK', avatarBg: 'bg-primary-fixed' },
    { quote: "Best moringa powder I've tried in Australia. You can taste the difference. Sustained energy without the jitters — ordering again!", author: 'David W.', meta: 'Gold Coast, QLD', initials: 'DW', avatarBg: 'bg-surface-container-high' },
    { quote: 'Premium Darjeeling tea with rich aroma and smooth taste. The muscatel flavour is perfectly balanced. Highly recommend!', author: 'Helen W.', meta: 'Melbourne, VIC', initials: 'HW', avatarBg: 'bg-tertiary-fixed' },
  ],
  blogGuides: [
    { category: 'Brand Comparison', title: 'Rosabella Moringa Review: Lab Results vs NutriThrive', readTime: '8 min read', href: '/blog/rosabella-moringa-reviews-legit-or-overhyped-2026.html' },
    { category: 'Lab Testing', title: 'Chemist Warehouse vs NutriThrive: Lab Report', readTime: '6 min read', href: '/blog/moringa-chemist-warehouse-vs-nutrithrive-quality-test-2025.html' },
    { category: "Buyer's Guide", title: '7 Moringa Brands Australia: Lab Tested & Ranked', readTime: '8 min read', href: '/blog/moringa-brands-comparison-australia-2026.html' },
    { category: 'Shopping', title: 'Where to Buy Moringa: Online vs Stores in AU', readTime: '5 min read', href: '/blog/where-to-buy-moringa-in-australia-online-vs-stores-2026-guide.html' },
  ],
  cartUrl: '/cart',
  paymentUrl: '/payment',
  orderThankYouUrl: '/thank-you.html',
  liveCartUrl: '/cart',
  livePaymentUrl: '/payment',
  faqCategories: [
    {
      id: 'moringa',
      title: 'Moringa Powder',
      icon: 'eco',
      items: [
        { q: 'What is NutriThrive Moringa powder?', a: 'A single-ingredient moringa leaf powder to add to smoothies, water, yoghurt or meals.', link: { text: 'Shop Moringa Powder', href: '/products/moringa-powder/' } },
        { q: 'How much Moringa powder should I take daily?', a: 'Start with 1/2 tsp per day for a week, then increase to 1 tsp (2–3g) as desired. Mix into smoothies, water, or yogurt.', link: { text: 'Shop Moringa Powder', href: '/products/moringa-powder/' } },
        { q: 'Any safety notes?', a: 'If you have low blood levels or thin blood, avoid use. If you are pregnant, nursing or on medication, seek advice from your healthcare provider.' },
        { q: 'What does Moringa powder taste like?', a: 'Mild, earthy, spinach-like flavour that blends well with smoothies, juices, and meals—not overpowering.', link: { text: 'Shop Moringa Powder', href: '/products/moringa-powder/' } },
        { q: 'Is it lab tested?', a: 'Yes. Every batch is tested in Australia for purity, heavy metals, and microbial safety.', link: { text: 'View lab report', href: '/documents/nutrithrive-lab-report-summary.pdf', external: true } },
        { q: 'How is the Moringa processed?', a: 'Shade-dried to lock in nutrients and keep the powder vibrant green. We avoid high-heat drying that destroys vitamins.' },
      ],
    },
    {
      id: 'curry',
      title: 'Dried Curry Leaves',
      icon: 'restaurant',
      items: [
        { q: 'What are NutriThrive Dried Curry Leaves?', a: 'Premium dried curry leaves (karipatta) from our own farm. Perfect for curries, dals, and South Indian dishes. Packed in Melbourne.', link: { text: 'Shop Curry Leaves', href: '/products/curry-leaves/' } },
        { q: 'How do I use dried curry leaves?', a: 'Use 2–3× the amount vs fresh. Fry in hot oil or ghee at the start (tadka) to release aroma—ideal for curries, dals, and sambar.', link: { text: 'Shop Curry Leaves', href: '/products/curry-leaves/' } },
        { q: 'How should I store dried curry leaves?', a: 'Keep in an airtight container away from heat and light. Stored properly, flavour lasts 6+ months in a cool, dry place.' },
      ],
    },
    {
      id: 'tea',
      title: 'Darjeeling Black Tea',
      icon: 'local_cafe',
      items: [
        { q: 'What is NutriThrive Darjeeling Black Tea?', a: 'Premium Darjeeling black tea—the "champagne of teas"—with muscatel, floral and fruity notes. Shipped from our Melbourne warehouse.' },
        { q: 'How do I brew Darjeeling black tea?', a: 'Use 1–2 tsp per cup. Heat water to 85–90°C (not boiling). Steep 3–5 minutes. Enjoy plain or with milk and honey.', link: { text: 'Shop Black Tea', href: '/products/black-tea/' } },
        { q: 'How much caffeine does Darjeeling tea contain?', a: 'About 40–50mg per cup—moderate caffeine for a gentle boost without jitters.' },
      ],
    },
    {
      id: 'orders',
      title: 'Orders & Shipping',
      icon: 'local_shipping',
      items: [
        { q: 'Which payment methods do you accept?', a: 'Visa, bank transfer, cash and PayPal.' },
        { q: 'Can I place an order by phone?', a: 'Yes. Call us on +61 438 201 419 if you need help placing an order or checking free shipping eligibility.' },
        { q: 'What is the free shipping threshold?', a: 'Free shipping Australia-wide on orders of AU$80+ and free worldwide shipping on orders of AU$90+.' },
        { q: 'How fast is shipping from Melbourne to Sydney/Brisbane?', a: 'Dispatch within 2 business days (no Sunday dispatch). Metro delivery typically 3–4 days; rural up to 10 days from our Truganina warehouse.' },
        { q: 'Do you offer a money-back guarantee?', a: 'Yes—7-day money-back guarantee. Shipping costs are not refunded.' },
        { q: 'Where is my order dispatched from?', a: 'All orders ship from our warehouse in Truganina, Melbourne—same-day dispatch for orders before 2pm.' },
      ],
    },
    {
      id: 'other',
      title: 'Other Products',
      icon: 'spa',
      items: [
        { q: 'What are the nutritional benefits of chia seeds?', a: 'Chia seeds provide omega-3s, fibre, protein and minerals—about 5g omega-3, 10g fibre, and 4g protein per 28g serving. Great for heart health and digestion.' },
      ],
    },
  ],
  footerTagline:
    'Dedicated to bringing you the finest natural wellness products for a healthier lifestyle. Purity in every leaf.',
  footerNav: [
    {
      title: 'Shopping',
      links: [
        { label: 'Home', file: '/' },
        { label: 'Shop', file: '/products/' },
        { label: 'Cart', file: '/cart' },
        { label: 'Payment', file: '/payment' },
        { label: 'Shipping & Returns', file: '/pages/shipping/shipping-returns.html' },
        { label: 'Melbourne delivery', file: '/melbourne' },
      ],
    },
    {
      title: 'Help & Info',
      links: [
        { label: 'About', file: '/about' },
        { label: 'Blog / Journal', file: '/blog/' },
        { label: 'FAQ', file: '/faq' },
        { label: 'Contact', file: '/contact' },
        { label: 'Newsletter', file: '/pages/newsletter/' },
        { label: 'Privacy Policy', file: '/privacy-policy' },
      ],
    },
  ],
  privacyPolicy: {
    lastUpdated: 'January 19, 2026',
    liveUrl: '/privacy-policy',
  },
  /** Flat list for hub index and tooling */
  pages: [
    { label: 'Home', file: '/', category: 'Shopping' },
    { label: 'Shop', file: '/products/', category: 'Shopping' },
    { label: 'Moringa powder', file: '/products/moringa-powder/', category: 'Products' },
    { label: 'Curry leaves', file: '/products/curry-leaves/', category: 'Products' },
    { label: 'Darjeeling tea', file: '/products/black-tea/', category: 'Products' },
    { label: 'Combo pack', file: '/products/combo-pack/', category: 'Products' },
    { label: 'Moringa soap', file: '/products/moringa-soap/', category: 'Products' },
    { label: 'Cart', file: '/cart', category: 'Checkout' },
    { label: 'Payment', file: '/payment', category: 'Checkout' },
    { label: 'Order thank you', file: '/thank-you.html', category: 'Checkout' },
    { label: 'Shipping & Returns', file: '/pages/shipping/shipping-returns.html', category: 'Shopping' },
    { label: 'Melbourne landing', file: '/melbourne', category: 'Shopping' },
    { label: 'About', file: '/about', category: 'Help & Info' },
    { label: 'Blog / Journal', file: '/blog/', category: 'Blog' },
    { label: 'FAQ', file: '/faq', category: 'Help & Info' },
    { label: 'Contact', file: '/contact', category: 'Help & Info' },
    { label: 'Contact thank you', file: '/pages/contact/thank-you.html', category: 'Help & Info' },
    { label: 'Newsletter', file: '/pages/newsletter/', category: 'Help & Info' },
    { label: 'Newsletter thank you', file: '/pages/newsletter/thank-you.html', category: 'Help & Info' },
    { label: 'Privacy Policy', file: '/privacy-policy', category: 'Legal' },
    { label: 'Moringa benefits', file: '/blog/how-to-add-moringa-to-diet.html', category: 'Help & Info' },
  ],
  /** Same five as live /products/ — shop grid & featured rows */
  catalogProductIds: [
    'moringa-powder-100g',
    'curry-leaves-30g',
    'black-tea',
    'combo-pack',
    'moringa-soap',
  ],
  catalogDisplay: {
    'moringa-powder-100g': {
      title: 'Moringa Powder',
      meta: '100g Pack • 30 Servings',
      badge: '100g',
    },
    'curry-leaves-30g': {
      title: 'Dried Curry Leaves',
      meta: '30g Pack • High Potency',
      badge: 'Pantry',
    },
    'black-tea': {
      title: 'Darjeeling Black Tea',
      meta: '100g Pack • Premium Grade',
      badge: 'Tea',
    },
    'combo-pack': {
      title: 'Premium Combo Pack',
      meta: 'Various Pack Sizes • Best Value',
      badge: 'Combo',
    },
    'moringa-soap': {
      title: 'Moringa Soap',
      meta: '95g Pack • Natural Soap',
      badge: 'Soap',
    },
  },
  getCatalogProducts() {
    return this.catalogProductIds
      .map((id) => {
        const p = this.getProduct(id);
        if (!p) return null;
        const d = this.catalogDisplay[id] || {};
        return {
          ...p,
          shortName: d.title || p.shortName || p.name,
          tag: d.meta || p.tag,
          badge: d.badge || p.badge,
          cartName: d.title || p.shortName || p.name,
        };
      })
      .filter(Boolean);
  },
  get pdpFeaturedProductIds() {
    return this.catalogProductIds;
  },
  getPdpFeaturedProducts() {
    return this.getCatalogProducts().map((p) => ({
      ...p,
      homeTitle: p.shortName,
    }));
  },
  getProduct(id) {
    const products = this.products ?? window.NT_TEST_DATA?.products ?? [];
    return products.find((p) => p.id === id) || null;
  },
  productPageUrl(id) {
    const slug = Object.entries(NT_SITE_DATA.productSlugToId).find(([, v]) => v === id)?.[0];
    return slug ? `/products/${slug}/` : `/products/${encodeURIComponent(id)}/`;
  },
  formatMoney(n) {
    return `$${Number(n).toFixed(2)}`;
  },
};

NT_SITE_DATA.productSlugToId = {
  'moringa-powder': 'moringa-powder-100g',
  'moringa-400g': 'moringa-400g',
  'curry-leaves': 'curry-leaves-30g',
  'black-tea': 'black-tea',
  'combo-pack': 'combo-pack',
  'moringa-soap': 'moringa-soap',
};
