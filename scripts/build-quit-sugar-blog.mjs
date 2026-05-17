import fs from "fs";
import path from "path";

const slug = "quit-sugar-90-days-honest-diary-melbourne-2026";
const url = `https://nutrithrive.com.au/blog/${slug}.html`;
const blogDir = path.join(process.cwd(), "blog");


const articleBody = fs.readFileSync(path.join(process.cwd(), "scripts/quit-sugar-article-body.html"), "utf8");

let html = fs.readFileSync(path.join(blogDir, slug + ".html"), "utf8");

const reps = [
  [/cortisol-belly-fat-couldnt-lose-stomach-melbourne-2026/g, slug],
  [
    /<title>.*?<\/title>/,
    "<title>I Quit Sugar for 90 Days: Honest Diary (Including the Tim Tam Meltdown) (2026)</title>",
  ],
  [
    /<meta name="description" content="[^"]*"\/>/,
    `<meta name="description" content="90 days without added sugar — Melbourne honest diary: hell week days 3-7, withdrawal, 8.1kg lost, moringa smoothie, hidden sugars list, and what actually worked."/>`,
  ],
  [
    /<meta name="keywords" content="[^"]*"\/>/,
    `<meta name="keywords" content="quit sugar australia, 90 day no sugar, sugar withdrawal symptoms, how to quit sugar melbourne, sugar addiction, moringa blood sugar, no sugar diary, hidden sugar foods"/>`,
  ],
  [
    /<meta property="og:title" content="[^"]*"\/>/,
    `<meta property="og:title" content="I Quit Sugar for 90 Days: My Honest Diary (Melbourne 2026)"/>`,
  ],
  [
    /<meta property="og:description" content="[^"]*"\/>/,
    `<meta property="og:description" content="Days 3-7 are hell. Week 4 cravings vanish. Full 90-day diary: rules, timeline, hidden sugars, moringa smoothie, FAQs — lost 8.1kg."/>`,
  ],
  [
    /<meta property="og:image:alt" content="[^"]*"\/>/,
    `<meta property="og:image:alt" content="Morning moringa smoothie for stable energy without added sugar"/>`,
  ],
  [
    /<meta name="twitter:title" content="[^"]*"\/>/,
    `<meta name="twitter:title" content="I Quit Sugar for 90 Days: Honest Diary (2026)"/>`,
  ],
  [
    /<meta name="twitter:description" content="[^"]*"\/>/,
    `<meta name="twitter:description" content="Unfiltered 90-day sugar quit diary from Melbourne: Tim Tam tears, hell week, 8.1kg lost, moringa habit, hidden sugars."/>`,
  ],
  [
    /"headline": "I Couldn't Lose My Belly Fat[^"]*"/g,
    `"headline": "I Quit Sugar for 90 Days: Honest Diary (Including the Tim Tam Meltdown) (2026)"`,
  ],
  [
    /"description": "Melbourne woman fixes cortisol belly[^"]*"/,
    `"description": "Melbourne woman's unfiltered 90-day no-sugar diary: addiction signs, hell week withdrawal, transformation timeline, gut bacteria science, moringa smoothie, and FAQs."`,
  ],
  [
    /"description": "Cortisol belly guide[^"]*"/,
    `"description": "Quit sugar 90-day diary: rules, day-by-day timeline, hidden sugars, what helped, starter checklist, FAQs."`,
  ],
  [
    /"name": "I Couldn't Lose My Belly Fat[^"]*"/g,
    `"name": "I Quit Sugar for 90 Days: Honest Diary (2026)"`,
  ],
  [
    /<li><a href="#cortisol-test">[\s\S]*?<\/ul>\s*<\/div>\s*<\/aside>/,
    `<li><a href="#why-quit">Why I Quit</a></li>
<li><a href="#rules">My Rules</a></li>
<li><a href="#days-1-2">Days 1–2</a> <span class="toc-phase">Easy</span></li>
<li><a href="#hell-week">Days 3–7: Hell Week</a> <span class="toc-phase">Brutal</span></li>
<li><a href="#weeks-2-8">Weeks 2–8</a> <span class="toc-phase">Turning point</span></li>
<li><a href="#day-90">Day 90</a></li>
<li><a href="#science">Gut &amp; Cravings Science</a></li>
<li><a href="#what-helped">What Actually Helped</a></li>
<li><a href="#hidden-sugars">Hidden Sugars List</a></li>
<li><a href="#starting-today">Starting Today</a></li>
<li><a href="#faqs">FAQs</a></li>
</ul>
</div>
</aside>`,
  ],
];

for (const [re, rep] of reps) {
  html = html.replace(re, rep);
}

const faqSchema = `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I eat fruit when quitting sugar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Whole fruit has fiber that slows sugar absorption. Limit to 1-2 pieces per day in the first month, then eat as desired. Dried fruit counts as added sugar for most quit-sugar protocols."
      }
    },
    {
      "@type": "Question",
      "name": "How bad is sugar withdrawal days 3-7?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Many people experience flu-like symptoms: headache, fatigue, irritability, and intense cravings. This is normal withdrawal as gut bacteria and brain chemistry adjust. Symptoms usually ease after day 7."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use honey or maple syrup instead of sugar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No for a full sugar reset. Honey, maple syrup, agave, and coconut sugar still spike blood sugar and keep sweet cravings alive during the first 90 days."
      }
    },
    {
      "@type": "Question",
      "name": "How much weight can you lose quitting sugar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Results vary. People eating 100g+ added sugar daily often lose 3-7kg in the first month, then 0.5-1kg per week, without changing exercise. This diary reports 8.1kg in 90 days."
      }
    },
    {
      "@type": "Question",
      "name": "Does moringa help when quitting sugar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Many people use moringa in morning smoothies for blood-sugar support, prebiotic fiber, and stable energy. It is not a substitute for cutting added sugar but can support the transition alongside protein-rich meals."
      }
    }
  ]
}`;

html = html.replace(
  /<!-- FAQPage Schema -->[\s\S]*?<\/script>\s*\n\n<!-- BreadcrumbList Schema -->/,
  `<!-- FAQPage Schema -->\n<script type="application/ld+json">\n${faqSchema}\n</script>\n\n<!-- BreadcrumbList Schema -->`
);

const a0 = html.indexOf('<article class="blog-post">');
const a1 = html.indexOf("</article>", a0);
html = html.slice(0, a0) + '<article class="blog-post">\n' + articleBody + "\n</article>" + html.slice(a1 + 10);

fs.writeFileSync(path.join(blogDir, slug + ".html"), html);
console.log("Built", slug + ".html");
