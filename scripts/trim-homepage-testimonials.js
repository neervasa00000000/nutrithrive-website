#!/usr/bin/env node
/**
 * One-off: replace homepage testimonial carousel with 12 diverse quotes, duplicated
 * once for seamless scroll. Run: node scripts/trim-homepage-testimonials.js
 */
const fs = require("fs");
const path = require("path");

const INDEX = path.join(__dirname, "..", "index.html");

const cards = [
  [
    "I'm enjoying it a lot and using it in my protein shakes.",
    "Savira",
  ],
  [
    "The product is amazing. Love the natural taste.",
    "Sharita",
  ],
  [
    "Definitely feeling healthy and more energetic after consuming it on a daily basis.",
    "Siv",
  ],
  [
    "The product is super good and healthy. I would definitely like to buy more and again! Thanks for the amazing product, it helped me.",
    "Jay Sharma",
  ],
  [
    "The Moringa powder is 100% better, quality is good and keep up with the quality.",
    "Pierre",
  ],
  ["It's good 👍 the real deal", "Ayodeji"],
  [
    "The dried curry leaves are so aromatic! My dhal has never tasted better. Fresh quality and fast shipping from Melbourne.",
    "Priya M.",
  ],
  [
    "Moringa powder has completely transformed my energy levels. No more afternoon crashes, and my digestion is so much better!",
    "Michael T.",
  ],
  [
    "Best curry leaves I've found in Australia! The flavor is authentic and they stay fresh for months. Highly recommend!",
    "Ravi K.",
  ],
  [
    "I've tried many moringa brands, but NutriThrive is by far the best. Bright green color, fresh taste, and I feel the difference!",
    "James H.",
  ],
  [
    "Moringa has helped with my bloating issues. I add it to my meals and feel so much lighter. Great product from a local Melbourne supplier!",
    "Emma B.",
  ],
  [
    "These dried curry leaves are a game changer! The aroma when I add them to hot oil is incredible. Authentic taste every time.",
    "Meera S.",
  ],
];

function cardHtml([text, author]) {
  return `<div class="testimonial-card">
<p class="testimonial-text">"${text.replace(/"/g, "&quot;")}"</p>
<p class="testimonial-author">- ${author}</p>
</div>`;
}

const inner = cards.map(cardHtml).join("\n");
const block = `${inner}\n<!-- Duplicated for seamless scroll -->\n${inner}\n`;

const newSection = `<section class="testimonials">
<h2 class="testimonials-title">What Our Customers Say</h2>
<div class="testimonial-carousel">
${block}</div>
</section>`;

const s0 = fs.readFileSync(INDEX, "utf8");
const re = /<section class="testimonials">[\s\S]*?<\/section>/;
if (!re.test(s0)) {
  console.error("testimonials section not found");
  process.exit(1);
}
const s1 = s0.replace(re, newSection);
if (s1 === s0) process.exit(1);
fs.writeFileSync(INDEX, s1, "utf8");
console.log("Updated", path.relative(path.join(__dirname, ".."), INDEX));
