#!/usr/bin/env node
/**
 * Generate 5 AU government / ABS / FSANZ health blog posts (Aug 2026).
 * Run: node scripts/generate-blogs-au-gov-aug2026.mjs --index
 * Defaults to noindex, follow without --index.
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

const LAB_TESTING_HREF = '/blog/moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026';

const HEALTH_PRODUCT = {
  hero: '/assets/images/blog/superfoods-australia-hero-640.jpg',
  og: '/assets/images/og/moringa-article-1200.jpg',
  sidebarImg: '/assets/images/product_photos/moringa.webp',
  sidebarTitle: 'Moringa Powder (100g)',
  sidebarDesc: 'Shade-dried, lab-tested, packed in Melbourne.',
  sidebarPrice: '$11.00',
  sidebarUnit: '/100g',
  shopHref: '/products/moringa-powder/',
  shopLabel: 'Shop Moringa',
  ctaHeading: 'Ready to Try Moringa?',
  ctaBtn: 'Shop Moringa Powder',
  ctaProduct: '100% pure moringa powder',
  badge: true,
  soft: false,
};

const TEA_PRODUCT = {
  hero: '/assets/images/og/black-tea-social-1200.jpg',
  og: '/assets/images/og/black-tea-social-1200.jpg',
  sidebarImg: '/assets/images/product_photos/blacktea.jpeg',
  sidebarTitle: 'Darjeeling Black Tea',
  sidebarDesc: 'First-flush character, packed in Melbourne.',
  sidebarPrice: 'From $7.50',
  sidebarUnit: '',
  shopHref: '/products/black-tea/',
  shopLabel: 'Shop Darjeeling Tea',
  ctaHeading: 'Track Your Daily Caffeine?',
  ctaBtn: 'Shop Darjeeling Tea',
  ctaProduct: 'Darjeeling loose leaf tea',
  badge: false,
  soft: false,
};

const SOFT_QUALITY_PRODUCT = {
  hero: '/assets/images/blog/superfoods-australia-hero-640.jpg',
  og: '/assets/images/og/moringa-article-1200.jpg',
  sidebarImg: '/assets/images/blog/superfoods-australia-hero-640.jpg',
  sidebarTitle: 'Lab testing and transparency',
  sidebarDesc:
    'Third-party screening for heavy metals and microbes matters when you buy any leaf powder or supplement. Here is what we look for.',
  sidebarLink: LAB_TESTING_HREF,
  sidebarLinkLabel: 'Read our lab testing guide',
  ctaHeading: 'Questions about quality?',
  ctaText:
    'We publish what we test for and why. This is general information, not legal or medical advice.',
  ctaLink: LAB_TESTING_HREF,
  ctaLinkLabel: 'Lab testing guide',
  ctaLink2: '/pages/contact/',
  ctaLink2Label: 'Contact us',
  badge: false,
  soft: true,
};

const PRODUCTS = {
  health: HEALTH_PRODUCT,
  tea: TEA_PRODUCT,
  softQuality: SOFT_QUALITY_PRODUCT,
  softTrust: {
    ...SOFT_QUALITY_PRODUCT,
    ctaHeading: 'Verify before you buy',
    ctaText: 'Listed medicines and food products both benefit from batch transparency. Compare labels with lab reports where available.',
  },
};

const POSTS = [
  {
    slug: 'is-moringa-banned-australia-what-fsanz-says-2026',
    title: 'Is Moringa Banned in Australia? What FSANZ Actually Says (2026)',
    h1: 'Is Moringa Banned in Australia? What FSANZ Actually Says (2026)',
    meta: 'FSANZ rejected moringa\'s novel food application in Nov 2025. Here\'s exactly what that means, straight from the primary source. No spin.',
    dateDisplay: '1 Aug 2026',
    dateIso: '2026-08-01',
    readMin: 8,
    categoryBadge: 'Guides',
    productKey: 'softQuality',
    imgAlt:
      'Australian government food standards document concept with Moringa oleifera leaf and FSANZ novel food context, educational not promotional',
    quickAnswer:
      'On 12 November 2025, FSANZ rejected Application A1294 to permit Moringa oleifera leaf (fresh and dried), immature green pods, and seed oil as a food or food ingredient. FSANZ\'s novel food page states this means Moringa oleifera is not permitted as a food or food ingredient for retail sale. FSANZ develops standards but does not enforce them; enforcement sits with state/territory agencies and DAFF for imports. TGA regulates therapeutic products separately. This is not legal advice.',
    keyTakeaways: [
      'FSANZ rejected Application A1294 on 12 November 2025. Moringa oleifera is not permitted as a novel food for retail sale under current standards.',
      'The assessment cited insufficient evidence of safety and lack of long-term toxicity and carcinogenicity data as key concerns.',
      'FSANZ sets food standards. State and territory agencies, plus DAFF for imports, enforce them. TGA is a separate regulator for medicines.',
      'The February 2026 Rosabella Salmonella recall was a food safety incident on specific products. It is not the same legal question as novel food status.',
      'If you sell or buy moringa products, get qualified legal advice. Do not rely on blog summaries alone.',
    ],
    sections: [
      {
        h2: 'What FSANZ decided',
        body: [
          'On 12 November 2025, Food Standards Australia New Zealand (FSANZ) rejected <a href="https://www.foodstandards.gov.au/food-standards-code/applications/application-a1294-moringa-oleifera-novel-food" target="_blank" rel="noopener noreferrer">Application A1294</a>, which sought permission to add Moringa oleifera leaf (fresh and dried), immature green pods, and seed oil to the Food Standards Code as a novel food.',
          'FSANZ\'s dedicated <a href="https://www.foodstandards.gov.au/business/novel/moringa-oleifera-novel-food" target="_blank" rel="noopener noreferrer">Moringa oleifera novel food page</a> states plainly that, following this decision, Moringa oleifera is not permitted as a food or food ingredient for retail sale in Australia and New Zealand under the current Code.',
          'That wording matters. FSANZ is describing the standard as it stands after the rejection, not issuing a one-off media ban. Retailers, importers, and manufacturers need to understand which part of the supply chain they sit in and what rules apply to them.',
        ],
      },
      {
        h2: 'Why FSANZ rejected the application',
        body: [
          'Novel foods must meet Standard 1.5.1 and, where relevant, Schedule 25 of the Food Standards Code. FSANZ assesses whether there is sufficient evidence that a food is safe for the proposed uses and populations.',
          'For Application A1294, FSANZ concluded the evidence was insufficient to establish safety. Assessment documents highlight concerns about a lack of long-term toxicity data and limited evidence on carcinogenicity potential. Those are standard hurdles for novel foods without a long history of safe use in comparable markets.',
          'A rejection does not automatically mean moringa is toxic. It means the applicant did not meet the evidence bar FSANZ requires to add it to the permitted list. A future application with stronger data could theoretically succeed. Until then, the Code position stands.',
        ],
      },
      {
        h2: 'What novel food status means in practice',
        body: [
          'Under Standard 1.5.1, foods that are not traditional in Australia and New Zealand generally need pre-market assessment unless already listed. Schedule 25 lists permitted novel foods with conditions. Moringa oleifera is not on that list following the A1294 outcome.',
          'For consumers, this means products sold explicitly as moringa food or food ingredient for general retail face a regulatory question. For businesses, it means you cannot assume legality from overseas sales or social media trends.',
          'Home gardening for personal use, imported personal goods, and products marketed with different regulatory pathways (for example complementary medicines) sit in different boxes. Conflating them causes confusion online.',
        ],
      },
      {
        h2: 'Standards vs enforcement, and where TGA fits',
        body: [
          'FSANZ develops and maintains the Food Standards Code. It does not police shop shelves or prosecute breaches. Enforcement is handled by state and territory food agencies, and by the Department of Agriculture, Fisheries and Forestry (DAFF) at the import border.',
          'The Therapeutic Goods Administration (TGA) regulates complementary medicines and other therapeutic goods separately. A product can be a TGA-listed medicine, a food, or neither, depending on composition, claims, and presentation. Food vs medicine boundaries are strict in Australia.',
          'If you see "AUST L" on a label, that is TGA listed medicine territory, not FSANZ food approval. See our guide on <a href="/blog/what-does-aust-l-mean-supplement-label-australia-2026">what AUST L means on supplements</a> for how that system works.',
        ],
      },
      {
        h2: 'Rosabella Salmonella recall: a separate issue',
        body: [
          'In early 2026, specific Rosabella moringa capsule lots were recalled over Salmonella contamination. That was a microbiological food safety failure on named products, investigated through the food recall system.',
          'A Salmonella recall is not the same legal mechanism as a novel food rejection. One is about unsafe batches on the market now. The other is about whether the ingredient category is permitted at all under the Code.',
          'Our separate <a href="/blog/rosabella-moringa-reviews-legit-or-overhyped-2026">Rosabella recall timeline</a> covers that incident. This article focuses on FSANZ\'s November 2025 novel food decision and primary sources.',
        ],
      },
      {
        h2: 'What we are doing at NutriThrive',
        body: [
          'We sell food products and publish educational content. We monitor FSANZ, TGA, and recall notices and adjust our sourcing, lab testing, and customer communication when primary sources change.',
          'We invest in third-party lab panels and publish what we test for where we can. Read our <a href="/blog/moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026">heavy metals and lab testing guide</a> for the checklist we use internally.',
          'This article is general information based on public FSANZ documents. It is not legal advice. If you manufacture, import, or advertise moringa products commercially, speak with a food or regulatory lawyer qualified in Australian law.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is moringa banned in Australia after the FSANZ decision?',
        a: 'FSANZ rejected Application A1294 in November 2025. Its novel food page states Moringa oleifera is not permitted as a food or food ingredient for retail sale under the current Food Standards Code. That is a standards outcome, not a catchy headline ban. Enforcement and product classification depend on how a product is sold and labelled.',
      },
      {
        q: 'Does FSANZ enforce the ban on moringa?',
        a: 'No. FSANZ develops standards. State and territory food authorities enforce the Code domestically. DAFF handles import compliance. TGA regulates therapeutic goods separately. Which agency matters depends on the product.',
      },
      {
        q: 'Is the Rosabella recall the same as the FSANZ novel food rejection?',
        a: 'No. The Rosabella action was a Salmonella-related recall on specific capsule lots. The FSANZ decision was a novel food assessment under Standard 1.5.1. Both involve moringa in the news, but they are different regulatory processes.',
      },
      {
        q: 'Can FSANZ approve moringa in the future?',
        a: 'Yes, in principle. A new application with stronger safety evidence could be assessed again. Until the Code is amended to permit Moringa oleifera, the November 2025 outcome remains the reference point on FSANZ\'s website.',
      },
    ],
    inlineLinks: [
      { href: LAB_TESTING_HREF, label: 'Heavy metals and lab testing guide' },
      { href: '/blog/is-moringa-banned-in-australia', label: 'Rosabella recall timeline' },
      { href: '/pages/contact/', label: 'Contact NutriThrive' },
    ],
    related: [
      { href: '/blog/what-does-aust-l-mean-supplement-label-australia-2026', label: 'What AUST L means on supplements' },
      { href: '/blog/is-moringa-banned-in-australia', label: 'Rosabella recall explained' },
      { href: LAB_TESTING_HREF, label: 'Lab testing and heavy metals guide' },
      { href: '/blog/how-to-choose-moringa-powder-australia-2026', label: 'How to choose moringa powder' },
    ],
    guidesCategory: true,
  },
  {
    slug: 'vitamin-d-deficiency-australia-abs-sunny-country-2026',
    title: 'Vitamin D Deficiency in Australia: The Sunny Country Paradox',
    h1: 'Vitamin D Deficiency in Australia: Why the Sunny Country Numbers Don\'t Add Up (2026)',
    meta: '1 in 5 Australian adults is vitamin D deficient, worse for under-30s. Real ABS data on why, and what actually helps.',
    dateDisplay: '1 Aug 2026',
    dateIso: '2026-08-01',
    readMin: 7,
    categoryBadge: 'Health',
    productKey: 'health',
    imgAlt:
      'Australian winter sunlight through office window with person indoors, illustrating vitamin D deficiency paradox in sunny country',
    quickAnswer:
      'The latest Australian Bureau of Statistics National Health Measures Survey (2022 to 2024) found 20.6% of adults were vitamin D deficient, down from 23.8% in 2011 to 2012. Young adults 18 to 29 had the highest rate at 29.2%. Moringa is not a meaningful vitamin D source. Sensible sun, fortified foods, and GP-guided supplementation are the evidence-backed levers.',
    keyTakeaways: [
      'ABS NHMS 2022 to 2024: 20.6% of adults vitamin D deficient, improved from 23.8% in 2011 to 2012.',
      'Highest deficiency in 18 to 29 year olds (29.2%). 28.7% of children 12 to 17 were deficient in the latest release.',
      'Historical winter gaps were stark: 49% deficient in Vic/ACT and 43% in Tas vs 15% in Qld and 17% in NT (2011 to 2012).',
      'Only 7% of supplement users were deficient vs 23% of non-users in 2011 to 2012 NHMS data.',
      'Moringa leaf powder is not a reliable vitamin D source. Do not substitute it for sun, fortified dairy, or prescribed supplements.',
    ],
    sections: [
      {
        h2: 'What the latest ABS data shows',
        body: [
          'Australia markets itself as the sunburnt country, yet vitamin D deficiency remains common. The <a href="https://www.abs.gov.au/statistics/health/health-conditions-and-risks/national-health-measures-survey/latest-release" target="_blank" rel="noopener noreferrer">ABS National Health Measures Survey latest release</a> reports biomedical results from the 2022 to 2024 cycle.',
          'In that cycle, 20.6% of adults were vitamin D deficient. That is an improvement from 23.8% in the 2011 to 2012 survey, but it still means roughly one in five adults do not have adequate serum 25-hydroxyvitamin D.',
          'Detailed nutrient tables on the ABS <a href="https://www.abs.gov.au/statistics/health/health-conditions-and-risks/national-health-measures-survey/2022-2024-financial-year/biomedical-nutrients" target="_blank" rel="noopener noreferrer">biomedical nutrients page</a> break results down by age, sex, and state. The sunny country paradox is real in the data, not just wellness marketing.',
        ],
      },
      {
        h2: 'Who is most affected',
        body: [
          'Young adults carry the highest burden in recent data. People aged 18 to 29 recorded a 29.2% deficiency rate in the latest NHMS release. Among children and adolescents 12 to 17, 28.7% were deficient.',
          'Older ABS cycles show geography and season matter enormously. In 2011 to 2012, winter deficiency hit 49% in Victoria and the ACT and 43% in Tasmania, compared with 15% in Queensland and 17% in the Northern Territory.',
          'Office work, higher melanin pigmentation, covering clothing for cultural or sun protection reasons, and staying indoors in southern winters all reduce cutaneous vitamin D synthesis even when the national brand is "sunny".',
        ],
      },
      {
        h2: 'Supplements change the numbers',
        body: [
          'The same 2011 to 2012 NHMS found only 7% of people who took vitamin D supplements were deficient, compared with 23% of non-users. Supplements are not the only answer, but they clearly move population statistics when deficiency is confirmed.',
          'Apparent intake from the ABS Australian Health Survey estimated mean daily vitamin D intake around 162.5 to 184.1 micrograms from food plus supplements combined in older releases. Food alone rarely closes the gap in southern winter.',
          'A blood test with your GP beats guessing. If you supplement, use the dose your clinician recommends rather than megadosing based on social media charts.',
        ],
      },
      {
        h2: 'What actually helps',
        body: [
          '<strong>Sensible sun exposure:</strong> Short, regular outdoor time on arms and legs when UV index allows, balanced against skin cancer risk. Guidelines differ by skin type and latitude.',
          '<strong>Fortified foods:</strong> Many milks and some margarines are fortified in Australia. Fatty fish, egg yolks, and cod liver oil contribute smaller amounts.',
          '<strong>GP-guided supplements:</strong> Daily or weekly vitamin D3 is standard treatment when deficiency is confirmed. Follow-up testing shows whether dose is working.',
          '<strong>Do not rely on moringa:</strong> Moringa leaf is nutrient-dense for iron, magnesium, and vitamin C, but it is not a meaningful source of vitamin D. Marketing that suggests otherwise is misleading.',
        ],
      },
      {
        h2: 'Immune health and winter planning',
        body: [
          'Vitamin D receptors sit on immune cells. Low levels correlate with higher respiratory infection rates in population studies, especially where winter limits sun.',
          'If you are building a winter health plan, pair vitamin D testing with sleep, protein, zinc-rich foods, and vaccination where recommended. See our <a href="/blog/how-to-strengthen-immune-system-naturally-australia-2026">immune system guide</a> for the full picture.',
          'Southern cities like Melbourne and Hobart deserve a proactive winter plan even when summer felt endless.',
        ],
      },
    ],
    faq: [
      {
        q: 'How common is vitamin D deficiency in Australia?',
        a: 'ABS NHMS 2022 to 2024 found 20.6% of adults deficient, down from 23.8% in 2011 to 2012. Rates are higher in young adults and in southern states during winter.',
      },
      {
        q: 'Why are Australians deficient if it is sunny?',
        a: 'Indoor work, sunscreen, clothing, skin pigmentation, and latitude all limit UVB exposure needed for skin synthesis. Winter in Victoria, Tasmania, and the ACT produces far less vitamin D than Queensland summers.',
      },
      {
        q: 'Does moringa provide vitamin D?',
        a: 'No meaningful amount. Moringa is useful for other micronutrients but not vitamin D. Use sun, fortified foods, or supplements under medical guidance instead.',
      },
    ],
    inlineLinks: [
      { href: '/blog/how-to-strengthen-immune-system-naturally-australia-2026', label: 'Immune system guide' },
      { href: '/blog/signs-magnesium-deficiency-australia-what-to-eat-2026', label: 'Magnesium deficiency signs' },
    ],
    related: [
      { href: '/blog/how-to-strengthen-immune-system-naturally-australia-2026', label: 'Strengthen immunity naturally' },
      { href: '/blog/how-to-age-well-in-your-40s-healthy-ageing-australia-2026', label: 'Healthy ageing in your 40s' },
      { href: '/blog/signs-magnesium-deficiency-australia-what-to-eat-2026', label: 'Magnesium deficiency guide' },
    ],
    softCtaText: 'Moringa supports overall nutrition but is not a vitamin D source. Explore our health guides or ask your GP about testing.',
  },
  {
    slug: 'how-much-caffeine-safe-per-day-australia-fsanz-2026',
    title: 'How Much Caffeine Is Safe Per Day? FSANZ Guidelines',
    h1: 'How Much Caffeine Is Safe Per Day? FSANZ Guidelines (2026)',
    meta: 'FSANZ\'s official safe caffeine limit is 400mg/day for adults, 200mg for pregnant women. Here\'s what that looks like in real drinks.',
    dateDisplay: '1 Aug 2026',
    dateIso: '2026-08-01',
    readMin: 7,
    categoryBadge: 'Health',
    productKey: 'tea',
    imgAlt:
      'Comparison of coffee cup, tea cup, and energy drink with caffeine milligram labels for Australian FSANZ daily limit guide',
    quickAnswer:
      'FSANZ sets 400mg caffeine per day as a safe upper level for healthy adults, 200mg for pregnant women, and about 3mg per kg body weight for children. Average adult intake in Australia is roughly 175mg daily, but more than 25% exceed 230mg according to AIS summaries. One cup of coffee is typically 80 to 120mg; black tea is often 30 to 50mg per cup.',
    keyTakeaways: [
      'FSANZ safe limit: 400mg/day adults, 200mg/day pregnant women, ~3mg/kg for children.',
      'Average Australian adult intake ~175mg/day; 25%+ exceed 230mg (AIS citing FSANZ P1056).',
      'ABS apparent consumption estimates mean caffeine around 162.5 to 184.1mg/day from all sources.',
      'Coffee, tea, cola, energy drinks, and pre-workout powders all count toward the same daily total.',
      'Switching one coffee to Darjeeling tea can materially lower intake without giving up ritual.',
    ],
    sections: [
      {
        h2: 'FSANZ safe caffeine levels',
        body: [
          'Food Standards Australia New Zealand completed Proposal P1056 on caffeine, confirming familiar public health limits. FSANZ states up to 400mg per day is safe for healthy adults, up to 200mg for pregnant women, and up to about 3mg per kilogram body weight for children and adolescents.',
          'Industry coverage in <a href="https://www.foodnavigator-asia.com/Article/2023/03/08/Australia-and-New-Zealand-maintain-caffeine-limits-in-latest-regulatory-update" target="_blank" rel="noopener noreferrer">FoodNavigator-Asia</a> summarised the outcome: limits stay, labelling rules tighten for high-caffeine products.',
          'These are population-level safe upper levels, not targets. Sensitive people, anxiety disorders, insomnia, and certain medications mean lower personal limits.',
        ],
      },
      {
        h2: 'What Australians actually consume',
        body: [
          'The Australian Institute of Sport notes average caffeine intake among Australian adults is about 175mg per day, while more than 25% consume over 230mg daily, citing FSANZ assessment data in their <a href="https://www.ais.gov.au/nutrition/supplements/group_a/low_risk/caffeine" target="_blank" rel="noopener noreferrer">caffeine fact sheet</a>.',
          'ABS apparent consumption data place mean daily caffeine around 162.5 to 184.1mg depending on survey cycle and age group. Coffee dominates, then tea and cola.',
          'Athletes, shift workers, and students often stack coffee with energy drinks or pre-workout without counting cumulative milligrams.',
        ],
      },
      {
        h2: 'What 400mg looks like in cups',
        body: [
          'An espresso shot might be 60 to 80mg. A medium latte with two shots can land near 150 to 200mg. Instant coffee is often 60 to 80mg per teaspoon serve.',
          'Black tea is typically 30 to 50mg per cup depending on leaf, dose, and steep time. Green tea is often slightly lower. See our <a href="/blog/how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026">Darjeeling vs coffee caffeine comparison</a> for worked examples.',
          'A 500ml energy drink can carry 160mg or more on the label. Two coffees plus one energy drink can exceed 400mg before lunch.',
        ],
      },
      {
        h2: 'Pregnancy, sleep, and anxiety',
        body: [
          'The 200mg pregnancy limit exists because caffeine crosses the placenta and fetal metabolism is slower. Many clinicians advise less rather than more when in doubt.',
          'Caffeine half-life stretches during pregnancy and with some medications. Afternoon coffee that felt fine at 25 can disrupt sleep at 40.',
          'If hot flushes, palpitations, or anxiety spike after caffeine, treat that as personal data. FSANZ limits are not a challenge score.',
        ],
      },
      {
        h2: 'Practical swaps without quitting ritual',
        body: [
          'Half-caf, smaller cups, and stopping before 2pm help sleep more than willpower alone.',
          'Darjeeling black tea delivers flavour and ritual at roughly half the caffeine of a standard coffee. That is why many Australians switch their second cup to tea.',
          'Track honestly for one week: coffee, tea, cola, chocolate, and supplements. The total usually surprises people.',
        ],
      },
    ],
    faq: [
      {
        q: 'What is the safe caffeine limit in Australia?',
        a: 'FSANZ sets 400mg per day for healthy adults, 200mg for pregnant women, and about 3mg per kg for children. These are upper safe levels from Proposal P1056, not recommended intakes.',
      },
      {
        q: 'How much caffeine is in tea vs coffee?',
        a: 'Coffee is commonly 80 to 120mg per cup; black tea is often 30 to 50mg. Steep time, leaf amount, and brand all shift numbers. Check our Darjeeling comparison article for tables.',
      },
      {
        q: 'Do energy drinks count toward the 400mg limit?',
        a: 'Yes. All caffeine sources count: coffee, tea, cola, energy drinks, pre-workout, and some medications. Add labels together for your daily total.',
      },
    ],
    inlineLinks: [
      { href: '/blog/how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026', label: 'Darjeeling vs coffee caffeine' },
      { href: '/products/black-tea/', label: 'Shop Darjeeling tea' },
    ],
    related: [
      { href: '/blog/how-much-caffeine-in-darjeeling-tea-vs-coffee-green-tea-2026', label: 'Caffeine in Darjeeling vs coffee' },
      { href: '/blog/darjeeling-tea-health-benefits-research-2026', label: 'Darjeeling tea health benefits' },
      { href: '/products/black-tea/', label: 'Shop Darjeeling black tea' },
    ],
    ctaExtra: 'Lower your afternoon caffeine without losing ritual.',
  },
  {
    slug: 'iron-deficiency-australian-women-abs-real-numbers-2026',
    title: 'Iron Deficiency in Australian Women: The Real Numbers',
    h1: 'Iron Deficiency in Australian Women: The Real Numbers (2026)',
    meta: '1 in 4 Australian women don\'t get enough iron from food, 8x the rate for men. Real ABS data on why, and what helps.',
    dateDisplay: '1 Aug 2026',
    dateIso: '2026-08-01',
    readMin: 7,
    categoryBadge: 'Health',
    productKey: 'health',
    imgAlt:
      'Iron-rich plant foods with vitamin C sources on Australian kitchen bench, educational guide for women\'s iron intake',
    quickAnswer:
      'ABS Usual Nutrient Intakes from 2011 to 2012 found 23% of females and 3% of males did not meet their iron requirements from food alone. Symptoms include fatigue, reduced endurance, and impaired immune function. Pregnancy increases demand substantially. Plant iron absorbs better with vitamin C at the same meal. Moringa can contribute iron but is not a substitute for blood tests or prescribed iron therapy.',
    keyTakeaways: [
      '23% of Australian women vs 3% of men did not meet iron requirements from food (ABS UNI 2011 to 2012).',
      'Menstruation, pregnancy, and lower total food intake drive the gender gap.',
      'Fatigue and reduced physical performance are common when stores run low; confirm with ferritin and full blood count.',
      'Pair plant iron with vitamin C. Heme iron from meat absorbs more efficiently but plant sources still matter.',
      'Honest lab panels matter: know what is in your powder and do not overclaim absorption.',
    ],
    sections: [
      {
        h2: 'The ABS numbers women should know',
        body: [
          'Australian Bureau of Statistics Usual Nutrient Intakes from the 2011 to 2012 National Nutrition and Physical Activity Survey show a stark gender split: 23% of females did not meet their estimated average requirement for iron from food, compared with 3% of males.',
          'That is not a small gap. It reflects menstruation, pregnancy, breastfeeding, and on average lower total energy intake relative to need. Updated NHMS ferritin data should be checked on the ABS site, but the directional finding has held across cycles.',
          'Not meeting intake from food is not identical to clinical iron deficiency anaemia, but it signals who should pay attention before stores deplete.',
        ],
      },
      {
        h2: 'Symptoms when iron runs low',
        body: [
          'ABS and NHMS briefing material links low iron status with fatigue, reduced immune function, and impaired physical performance. Many women normalise breathlessness on stairs or heavy legs during runs.',
          'Restless legs, brittle nails, hair shedding, and craving ice (pagophagia) appear in clinical practice though not everyone gets classic signs.',
          'Heavy periods, recent pregnancy, vegetarian diets, and frequent blood donation increase risk. A GP can order ferritin, transferrin saturation, and full blood count.',
        ],
      },
      {
        h2: 'Pregnancy and higher needs',
        body: [
          'Iron demand rises sharply in pregnancy to support placental and fetal growth and expanded maternal blood volume. WHO and Australian clinical guidelines recommend monitoring and supplementation when indicated.',
          'A 2024 review in <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11223411/" target="_blank" rel="noopener noreferrer">PMC11223411</a> summarises updated thinking on oral iron dosing and tolerance in pregnancy. Obstetric care overrides generic blog advice: follow your midwife or doctor.',
          'Do not double-stack high-dose supplements without supervision. Iron overload is rare but constipation and nausea from blind dosing are common.',
        ],
      },
      {
        h2: 'Plant iron and the vitamin C pairing',
        body: [
          'Red meat and tinned sardines deliver haem iron, which absorbs efficiently. Plant sources include lentils, chickpeas, spinach, pumpkin seeds, and fortified cereals.',
          'Non-haem iron absorption improves when eaten with vitamin C in the same meal: lemon on lentils, capsicum in chickpea salad, or kiwi after porridge. Our <a href="/blog/moringa-with-vitamin-c-iron-absorption-guide-2026">moringa with vitamin C guide</a> walks through the mechanism.',
          'Moringa leaf powder contains iron, but concentration varies by batch. Treat it as one food contributor, not a clinical dose. See our earlier <a href="/blog/iron-deficiency-australian-women-symptoms-plant-based-sources-2026">iron deficiency symptoms and plant sources article</a> for symptom detail.',
        ],
      },
      {
        h2: 'Honest product claims',
        body: [
          'Any brand selling plant powders should publish or explain third-party lab results and avoid implying moringa replaces iron tablets when ferritin is low.',
          'We run heavy metal and nutrient screening on our batches and share what we test for in our <a href="/blog/moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026">lab testing guide</a>. Numbers on a label still need context from your blood work.',
          'If your GP prescribes ferrous sulfate or an IV course, food additions support recovery but do not replace treatment.',
        ],
      },
    ],
    faq: [
      {
        q: 'How common is low iron in Australian women?',
        a: 'ABS data from 2011 to 2012 found 23% of females did not meet iron requirements from food, compared with 3% of males. Clinical deficiency rates depend on ferritin cut-offs; ask your GP for testing if symptomatic.',
      },
      {
        q: 'Can moringa fix iron deficiency?',
        a: 'Moringa contributes non-haem iron and pairs well with vitamin C foods, but it is not a clinical iron supplement. Confirmed deficiency usually needs medical dosing and monitoring.',
      },
      {
        q: 'What foods help iron absorption?',
        a: 'Haem iron from meat and sardines absorbs well. For plants, pair iron-rich foods with vitamin C and avoid drinking tea with meals, which can inhibit absorption.',
      },
    ],
    inlineLinks: [
      { href: '/blog/moringa-with-vitamin-c-iron-absorption-guide-2026', label: 'Moringa with vitamin C guide' },
      { href: '/blog/iron-deficiency-australian-women-symptoms-plant-based-sources-2026', label: 'Iron deficiency symptoms guide' },
    ],
    related: [
      { href: '/blog/moringa-with-vitamin-c-iron-absorption-guide-2026', label: 'Moringa and vitamin C for iron' },
      { href: '/blog/iron-deficiency-australian-women-symptoms-plant-based-sources-2026', label: 'Iron deficiency symptoms' },
      { href: '/blog/best-plant-based-iron-foods-australia-absorption-guide-2026', label: 'Plant-based iron foods' },
      { href: '/products/moringa-powder/', label: 'Shop moringa powder' },
    ],
    ctaExtra: 'Pair plant iron with vitamin C at breakfast.',
  },
  {
    slug: 'what-does-aust-l-mean-supplement-label-australia-2026',
    title: 'What Does AUST L Mean on a Supplement? (Australian Guide)',
    h1: 'What Does AUST L Mean on a Supplement? (Australian Guide)',
    meta: 'AUST L vs AUST R: what\'s the real difference between listed and registered complementary medicines in Australia, and how to check the ARTG.',
    dateDisplay: '1 Aug 2026',
    dateIso: '2026-08-01',
    readMin: 6,
    categoryBadge: 'Guides',
    productKey: 'softTrust',
    imgAlt:
      'Australian supplement bottle label showing AUST L listed medicine number with TGA ARTG concept, educational guide',
    quickAnswer:
      'AUST L marks a listed complementary medicine on the Australian Register of Therapeutic Goods (ARTG). Listed products make low-level claims and the sponsor certifies quality and safety against TGA standards. AUST R marks registered medicines with higher-risk claims or ingredients, evaluated individually by the TGA. "Natural" does not mean safe. Food products follow FSANZ, not AUST L. Always search the ARTG number on the TGA website.',
    keyTakeaways: [
      'AUST L = listed complementary medicine; sponsor self-certifies against TGA standards for permitted low-level claims.',
      'AUST R = registered medicine; TGA evaluates efficacy and safety individually before approval.',
      'Food vs medicine boundaries matter: FSANZ food rules and TGA therapeutic goods rules are separate systems.',
      'TGA states natural origin does not automatically mean a product is safe or effective.',
      'Verify ARTG numbers on the TGA public search and read batch lab reports where brands publish them.',
    ],
    sections: [
      {
        h2: 'Listed vs registered: the core difference',
        body: [
          'The TGA divides many complementary medicines into listed (AUST L) and registered (AUST R) pathways. Listed medicines are on the ARTG after the sponsor certifies they meet quality and safety standards and only use permitted low-level indications.',
          'Registered medicines undergo individual TGA evaluation of quality, safety, and efficacy before approval. Higher-risk ingredients, serious claims, or novel combinations usually land here.',
          'The TGA\'s complementary medicines explainer on <a href="https://www.tga.gov.au/complementary-medicines" target="_blank" rel="noopener noreferrer">tga.gov.au</a> is the primary source. Marketing blogs should not replace reading the label and ARTG entry.',
        ],
      },
      {
        h2: 'What AUST L allows and does not allow',
        body: [
          'Listed products can carry traditional or low-level claims such as supporting general health maintenance. They cannot claim to treat serious diseases unless registered with evidence.',
          'Sponsors must hold evidence behind claims and report adverse events. Post-market review still happens. Listing is not a free pass.',
          'If a capsule promises dramatic weight loss, cancer treatment, or hormone replacement, check whether it is appropriately registered or whether claims breach advertising rules.',
        ],
      },
      {
        h2: 'Food, medicine, and the interface',
        body: [
          'A product is not both a generic food and a listed medicine in the same presentation. Packaging, claims, and ingredients determine classification.',
          'FSANZ sets food standards including novel food rules. The TGA regulates therapeutic goods. A powder sold as a cooking ingredient follows a different framework from capsules with therapeutic claims and an AUST L number.',
          'Recent FSANZ decisions on ingredients such as moringa sit in the food lane. See our <a href="/blog/how-to-choose-moringa-powder-australia-2026">FSANZ moringa explainer</a> for that separate question. An AUST L moringa capsule and a moringa leaf powder sachet are not regulated identically.',
        ],
      },
      {
        h2: '"Natural" does not mean safe',
        body: [
          'The TGA explicitly warns that natural origin does not guarantee safety or effectiveness. Complementary medicines can interact with prescriptions, affect surgery, or contain undeclared substances.',
          'Heavy metals, microbial contamination, and wrong plant species have all triggered recalls. Natural marketing is not a quality certificate.',
          'Read ingredients, check allergens, and ask your pharmacist if you take warfarin, SSRIs, blood pressure medicines, or are pregnant.',
        ],
      },
      {
        h2: 'How to check the ARTG',
        body: [
          'Every listed or registered product displays an AUST L or AUST R number. Search that number on the TGA ARTG public summary.',
          'Confirm the product name, sponsor, and intended use match what you hold in hand. Counterfeit labels happen online.',
          'For food powders, ask for batch-specific lab reports: heavy metals, microbes, and identity testing. Our <a href="/blog/moringa-heavy-metals-lab-testing-australia-what-to-look-for-2026">lab testing guide</a> lists the panels worth requesting.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is AUST L the same as TGA approval?',
        a: 'AUST L means the product is listed on the ARTG as a complementary medicine after sponsor certification against TGA standards for that pathway. It is not the same as full registered evaluation (AUST R), but it is a regulated category with obligations.',
      },
      {
        q: 'Are listed medicines safer than food supplements?',
        a: 'Not automatically. Listed medicines have TGA oversight appropriate to their risk class. Foods follow FSANZ. Uncategorised grey-market imports may have neither. Check which system applies and verify lab data.',
      },
      {
        q: 'Does AUST L mean a product is Australian made?',
        a: 'No. AUST L refers to ARTG listing in Australia. Manufacturing can occur offshore if GMP and labelling rules are met. Read the label for country of origin.',
      },
    ],
    inlineLinks: [
      { href: '/blog/is-moringa-banned-australia-what-fsanz-says-2026', label: 'FSANZ moringa status' },
      { href: LAB_TESTING_HREF, label: 'Batch lab testing guide' },
    ],
    related: [
      { href: '/blog/is-moringa-banned-australia-what-fsanz-says-2026', label: 'FSANZ and moringa status' },
      { href: LAB_TESTING_HREF, label: 'Lab testing checklist' },
      { href: '/blog/how-to-choose-moringa-powder-australia-2026', label: 'Choose moringa powder' },
      { href: '/blog/verify-moringa-quality-premium-buyers-checklist-2026', label: 'Verify moringa quality' },
    ],
    guidesCategory: true,
  },
];

function escHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sanitizeProse(s) {
  return s
    .replace(/\u2014/g, ' to ')
    .replace(/\u2013/g, ' to ')
    .replace(/ — /g, ' to ')
    .replace(/ – /g, ' to ')
    .replace(/--/g, ' to ')
    .replace(/'/g, '&#8217;');
}

function inlineMd(text) {
  let s = sanitizeProse(text);
  s = s.replace(/\[([^\]]+)\]\((\/[^)]+)\)/g, '<a href="$2">$1</a>');
  return s;
}

function buildSectionsHtml(sections) {
  return sections
    .map((sec) => {
      const h2 = `<h2>${inlineMd(sec.h2)}</h2>`;
      const paras = sec.body.map((p) => `<p>${inlineMd(p)}</p>`).join('\n\n');
      return `${h2}\n\n${paras}`;
    })
    .join('\n\n');
}

function buildFaqHtml(faq) {
  const h2 = '<h2>FAQ</h2>';
  const items = faq
    .map((item) => `<h3>${inlineMd(item.q)}</h3>\n\n<p>${inlineMd(item.a)}</p>`)
    .join('\n\n');
  return `${h2}\n\n${items}`;
}

function buildFaqJson(faq) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q.replace(/<[^>]+>/g, ''),
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a.replace(/<[^>]+>/g, ''),
      },
    })),
  });
}

function breadcrumbJson(post) {
  const shortName = post.title.replace(/ \(2026\)$/, '');
  const catName = post.guidesCategory ? 'Guides' : 'Health';
  const catHref = post.guidesCategory ? `${BASE}/blog/category/guides/` : `${BASE}/blog/category/health/`;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE}/blog/` },
      { '@type': 'ListItem', position: 3, name: catName, item: catHref },
      { '@type': 'ListItem', position: 4, name: shortName, item: `${BASE}/blog/${post.slug}` },
    ],
  });
}

function articleSchema(post, ogImage) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
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

function buildQuickAnswerBlock(post) {
  const takeaways = post.keyTakeaways.map((t) => `<li>${inlineMd(t)}</li>`).join('\n');
  return `<div class="answer-box">
<h2>Quick Answer</h2>
<p style="margin:0;">${inlineMd(post.quickAnswer)}</p>
</div>

<div class="takeaways-box">
<strong style="display:block; margin-bottom:0.5rem;">Key Takeaways</strong>
<ul>
${takeaways}
</ul>
</div>`;
}

function buildCtaBlock(post, prod) {
  if (prod.soft) {
    const link2 = prod.ctaLink2
      ? ` · <a href="${prod.ctaLink2}">${escHtml(prod.ctaLink2Label)}</a>`
      : '';
    return `<div class="nt-article-cta">
<h3>${escHtml(prod.ctaHeading)}</h3>
<p>${inlineMd(post.ctaText || prod.ctaText)} <a href="${prod.ctaLink}">${escHtml(prod.ctaLinkLabel)}</a>${link2}</p>
</div>`;
  }
  const extra = post.ctaExtra ? `${inlineMd(post.ctaExtra)} ` : '';
  const softText = post.softCtaText ? inlineMd(post.softCtaText) : `${extra}Shop our <a href="${prod.shopHref}">${prod.ctaProduct}</a>: packed fresh in Melbourne. Same-day dispatch.`;
  return `<div class="nt-article-cta">
<h3>${escHtml(prod.ctaHeading)}</h3>
<p>${softText}</p>
<div class="btn-row">
<a class="btn-solid" href="${prod.shopHref}">${prod.ctaBtn}</a>
<a class="btn-outline" href="/pages/shipping/shipping-returns.html">Shipping &amp; returns</a>
</div>
</div>`;
}

function buildSidebarHtml(prod) {
  if (prod.soft) {
    return `<aside class="lg:col-span-4 space-y-12">
<div class="bg-pure-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
<div class="aspect-square bg-surface-container relative">
<img alt="${escHtml(prod.sidebarTitle)}" class="w-full h-full object-cover" src="${prod.sidebarImg}" loading="lazy"/>
</div>
<div class="p-6">
<h4 class="font-headline-md text-headline-md text-forest-deep mb-2">${escHtml(prod.sidebarTitle)}</h4>
<p class="text-on-surface-variant font-body-md text-body-md mb-6">${escHtml(prod.sidebarDesc)}</p>
<a class="block w-full text-center bg-moringa-leaf text-pure-white py-4 rounded-lg font-label-lg text-label-lg hover:scale-[1.02] transition-transform" href="${prod.sidebarLink}">${escHtml(prod.sidebarLinkLabel)}</a>
</div>
</div>
</aside>`;
  }
  return `<aside class="lg:col-span-4 space-y-12">
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
</aside>`;
}

function buildHtml(post) {
  const prod = PRODUCTS[post.productKey];
  const canonical = `${BASE}/blog/${post.slug}`;
  const ogImage = `${BASE}${prod.og}`;
  const bodyHtml =
    buildQuickAnswerBlock(post) + '\n\n' + buildSectionsHtml(post.sections) + '\n\n' + buildFaqHtml(post.faq);
  const relatedHtml = post.related
    .map((r) => `    <li><a href="${r.href}">${escHtml(r.label)}</a></li>`)
    .join('\n');
  const inlineLinksHtml = post.inlineLinks
    .map((l) => `<a href="${l.href}">${escHtml(l.label)}</a>`)
    .join(' · ');
  const imgAlt = post.imgAlt || post.h1;
  const badge = post.categoryBadge || 'Health';

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
<ol class="flex flex-wrap items-center gap-1 list-none m-0 p-0"><li><a class="text-moringa-leaf hover:underline" href="/">Home</a></li><li class="text-on-surface-variant" aria-hidden="true">&#x203A;</li><li><a class="text-moringa-leaf hover:underline" href="/blog/">Blog</a></li><li class="text-on-surface-variant" aria-hidden="true">&#x203A;</li><li class="text-on-surface" aria-current="page">${escHtml(post.title)}</li></ol>
</nav>
<main class="pt-6 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop nt-blog-main">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
<article class="lg:col-span-8">
<header class="mb-12">
<div class="flex flex-wrap items-center gap-2 mb-4">
<span class="bg-primary-fixed/30 text-moringa-leaf px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider font-bold">${escHtml(badge)}</span>
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

<p class="nt-disclaimer"><em>These statements have not been evaluated by the TGA. This content is general information only, not medical advice.</em></p>

${buildCtaBlock(post, prod)}
<p style="margin-top: 1rem;"><a href="/blog/">&larr; Back to all articles</a></p>
<div class="nt-update-log" role="note">
<p><strong>Update log</strong></p>
<ul><li><strong>${post.dateDisplay}:</strong> Article published.</li></ul>
</div>
<section class="nt-related-links-block">
 <h2>Related guides</h2>
 <ul>
${relatedHtml}
 </ul>
</section>
</div>
</article>
${buildSidebarHtml(prod)}
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

  const fsanzSlug = 'is-moringa-banned-australia-what-fsanz-says-2026';
  content = content.replace(
    /\/blog\/is-moringa-banned-australia-truth-2026\.html \/blog\/is-moringa-banned-in-australia 301!/g,
    `/blog/is-moringa-banned-australia-truth-2026.html /blog/${fsanzSlug} 301!`,
  );
  content = content.replace(
    /\/blog\/is-moringa-banned-australia-truth-2026 \/blog\/is-moringa-banned-in-australia 301!/g,
    `/blog/is-moringa-banned-australia-truth-2026 /blog/${fsanzSlug} 301!`,
  );

  const marker = '\n# === au gov batch (Aug 2026) ===';
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
      return `\n# ${short} (au gov Aug 2026)\n/blog/${p.slug}.html /blog/${p.slug} 301!\n/blog/${p.slug} /blog/${p.slug}.html 200`;
    });

  const truthBlock = existingAfter.includes('is-moringa-banned-australia-truth-2026')
    ? ''
    : `\n# truth-2026 → FSANZ explainer (au gov Aug 2026)\n/blog/is-moringa-banned-australia-truth-2026.html /blog/${fsanzSlug} 301!\n/blog/is-moringa-banned-australia-truth-2026 /blog/${fsanzSlug} 301!`;

  fs.writeFileSync(redirectsPath, beforeMarker + marker + existingAfter + newBlocks.join('') + truthBlock + '\n');
  console.log(`Updated _redirects (+${newBlocks.length} post entries, truth-2026 redirect)`);
}

function updateCategoryIndex(cat, posts) {
  const catPath = path.join(BLOG_DIR, `category/${cat}/index.html`);
  if (!fs.existsSync(catPath)) return 0;
  let html = fs.readFileSync(catPath, 'utf8');
  const listMatch = html.match(/(<ul class="[^"]*">)([\s\S]*?)(<\/ul>)/);
  if (!listMatch) return 0;
  const existing = listMatch[2];
  const newItems = posts
    .filter((p) => !existing.includes(`/blog/${p.slug}`))
    .map(
      (p) =>
        `\n<li><a class="text-moringa-leaf hover:underline" href="/blog/${p.slug}">${escHtml(p.title)}</a></li>`,
    );
  if (newItems.length === 0) return 0;
  html = html.replace(listMatch[0], `${listMatch[1]}${newItems.join('')}${existing}${listMatch[3]}`);
  fs.writeFileSync(catPath, html);
  return newItems.length;
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
  if (created.length === 0) {
    console.log('No new posts created.');
    return;
  }
  appendRedirects(created);
  const healthPosts = created;
  const guidesPosts = created.filter((p) => p.guidesCategory);
  const healthN = updateCategoryIndex('health', healthPosts);
  const guidesN = updateCategoryIndex('guides', guidesPosts);
  console.log(`Updated health category (+${healthN} links)`);
  console.log(`Updated guides category (+${guidesN} links)`);
  console.log(`\nDone: ${created.length} au gov posts${START_NOINDEX ? ' (noindex)' : ' (index, follow)'}`);
  for (const p of created) {
    console.log(`  - ${p.slug}`);
  }
}

main();
