#!/usr/bin/env node
/**
 * Site-wide conversational tone pass for blog HTML.
 * Preserves <script> and <style> blocks verbatim (incl. JSON-LD).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.join(__dirname, "..", "blog");

function slugHash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick(arr, salt) {
  return arr[slugHash(String(salt)) % arr.length];
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Extract script + style blocks */
function shieldBlocks(html) {
  const tokens = [];
  let idx = 0;
  const out = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, (m) => {
    const key = `__NT_BLOCK_${idx++}__`;
    tokens.push({ key, raw: m });
    return key;
  });
  return { text: out, tokens };
}

function unshieldBlocks(text, tokens) {
  let out = text;
  for (const { key, raw } of tokens) {
    out = out.split(key).join(raw);
  }
  return out;
}

function applyPhraseVariants(segment, basename) {
  let s = segment;
  let matchCounter = 0;

  /**
   * @param {string} literal
   * @param {string[]} variants
   */
  const replaceAllLiterals = (literal, variants) => {
    const rx = new RegExp(escapeRe(literal), "g");
    s = s.replace(rx, () => pick(variants, basename + ":" + literal + ":" + matchCounter++));
  };

  replaceAllLiterals("Furthermore,", [
    "Plus,",
    "And",
    "What’s more,",
    "On top of that,",
    "Also,",
    "Honestly,",
  ]);
  replaceAllLiterals("Moreover,", [
    "Also,",
    "Besides,",
    "Another point:",
    "On top of that,",
    "And",
  ]);
  replaceAllLiterals("Additionally,", [
    "Also,",
    "Plus,",
    "Alongside that,",
    "Another thing:",
    "And",
  ]);
  replaceAllLiterals("Subsequently,", ["After that,", "Next,", "Then,", "From there,"]);
  replaceAllLiterals("In this article, ", [
    "Here, ",
    "In this guide, ",
    "Below, ",
    "On this page, ",
  ]);
  replaceAllLiterals("In this article ", [
    "Here ",
    "In this guide ",
    "Below ",
    "On this page ",
  ]);
  replaceAllLiterals("Let's take a look at ", [
    "Let’s peek at ",
    "Quick look at ",
    "Here’s ",
    "Skim ",
  ]);
  replaceAllLiterals("Let's explore ", [
    "Let’s unpack ",
    "Quick tour of ",
    "Here’s ",
  ]);
  replaceAllLiterals("key takeaways", [
    "main points",
    "bits worth remembering",
    "headlines",
    "what to remember",
  ]);
  replaceAllLiterals("Key takeaways", [
    "Main points",
    "Bits worth remembering",
    "Headlines",
    "What to remember",
  ]);
  replaceAllLiterals("In conclusion,", [
    "Bottom line:",
    "So,",
    "Long story short,",
    "Wrapping up,",
    "In short,",
  ]);
  replaceAllLiterals("To summarize,", [
    "Quick recap:",
    "So,",
    "In short,",
    "Bottom line:",
    "TL;DR:",
  ]);
  replaceAllLiterals("It is important to note that ", [
    "Worth knowing: ",
    "Quick reality check: ",
    "Keep in mind that ",
    "One thing to remember: ",
    "Honestly, ",
  ]);
  replaceAllLiterals("It is worth noting that ", [
    "Worth a mention: ",
    "For the record, ",
    "One detail: ",
    "Also, ",
  ]);
  replaceAllLiterals("It is important to remember that ", [
    "Remember: ",
    "Don’t forget that ",
    "Easy to forget: ",
  ]);
  replaceAllLiterals("It should be noted that ", [
    "Fair note: ",
    "FYI, ",
    "One caveat: ",
    "Just so you know, ",
  ]);
  replaceAllLiterals("delve into", [
    "dig into",
    "get into",
    "unpack",
    "take a closer look at",
  ]);
  replaceAllLiterals("Delve into", [
    "Dig into",
    "Get into",
    "Unpack",
    "Take a closer look at",
  ]);
  replaceAllLiterals(" utilize ", [" use ", " lean on ", " rely on "]);
  replaceAllLiterals("Utilize ", ["Use ", "Lean on ", "Rely on "]);
  replaceAllLiterals(" leveraging ", [
    " using ",
    " tapping into ",
    " putting to work ",
  ]);
  replaceAllLiterals("Leveraging ", [
    "Using ",
    "Tapping into ",
    "Putting to work ",
  ]);
  replaceAllLiterals(" in order to ", [" to ", " so you can ", " just to "]);
  replaceAllLiterals("In order to ", ["To ", "So you can ", "Just to "]);
  replaceAllLiterals("a wide range of ", [
    "plenty of ",
    "lots of ",
    "all kinds of ",
    "a solid mix of ",
  ]);
  replaceAllLiterals("A wide range of ", [
    "Plenty of ",
    "Lots of ",
    "All kinds of ",
    "A solid mix of ",
  ]);
  replaceAllLiterals(" numerous ", [" many ", " loads of ", " a heap of "]);
  replaceAllLiterals("Numerous ", ["Many ", "Loads of ", "A heap of "]);
  replaceAllLiterals("Individuals who ", [
    "People who ",
    "Folks who ",
    "Anyone who ",
  ]);
  replaceAllLiterals("individuals who ", [
    "people who ",
    "folks who ",
    "anyone who ",
  ]);
  replaceAllLiterals("plays a crucial role", [
    "matters a lot",
    "really counts",
    "is a big deal",
    "gets overlooked but counts",
  ]);
  replaceAllLiterals("plays an important role", [
    "matters",
    "helps a lot",
    "does plenty of the heavy lifting",
    "is worth caring about",
  ]);
  replaceAllLiterals("game-changer", [
    "serious upgrade",
    "real shift",
    "proper step-change",
    "genuine difference",
  ]);
  replaceAllLiterals("Game-changer", [
    "Serious upgrade",
    "Real shift",
    "Proper step-change",
    "Genuine difference",
  ]);
  replaceAllLiterals("unlock ", [
    "open up ",
    "get ",
    "tap into ",
    "access ",
  ]);
  replaceAllLiterals("Unlock ", [
    "Open up ",
    "Get ",
    "Tap into ",
    "Access ",
  ]);
  replaceAllLiterals("In today's fast-paced", [
    "In today’s hectic",
    "In a busy",
    "These days, in a",
    "When life feels",
  ]);
  replaceAllLiterals("In today's ", [
    "These days, ",
    "Right now, ",
    "Nowadays, ",
    "Today, ",
  ]);
  replaceAllLiterals(" cutting-edge ", [
    " up-to-date ",
    " current ",
    " no-nonsense ",
  ]);
  replaceAllLiterals("cutting-edge ", [
    "up-to-date ",
    "current ",
    "no-nonsense ",
  ]);
  replaceAllLiterals(" comprehensive overview", [
    " solid walkthrough",
    " straight explainer",
    " plain-English tour",
    " full rundown",
  ]);
  replaceAllLiterals("Comprehensive overview", [
    "Solid walkthrough",
    "Straight explainer",
    "Plain-English tour",
    "Full rundown",
  ]);
  replaceAllLiterals(" optimal ", [
    " best-fit ",
    " smartest ",
    " most sensible ",
  ]);
  replaceAllLiterals("Optimal ", [
    "Best-fit ",
    "Smartest ",
    "Most sensible ",
  ]);
  replaceAllLiterals(" facilitates ", [
    " helps ",
    " makes it easier to ",
    " smooths out ",
  ]);
  replaceAllLiterals("Facilitates ", [
    "Helps ",
    "Makes it easier to ",
    "Smooths out ",
  ]);
  replaceAllLiterals(" robust ", [" solid ", " reliable ", " hard-wearing "]);
  replaceAllLiterals("Robust ", ["Solid ", "Reliable ", "Hard-wearing "]);

  // Related-reading heading (less samey across the site)
  const relatedHeadings = [
    "More reads worth your time",
    "Keep digging — related guides",
    "If you liked this, try these",
    "Other articles we’d bump up your list",
    "Still curious? Start here next",
    "Related guides from the blog",
  ];
  s = s.replace(
    />More Blog Posts to Explore</gi,
    () => `>${pick(relatedHeadings, basename + ":related:" + matchCounter++)}<`
  );
  s = s.replace(
    />Discover more health and wellness insights:/gi,
    () =>
      `>${pick(
        [
          "A few more rabbit holes:",
          "More practical reads:",
          "Dig deeper with:",
          "While you’re here:",
        ],
        basename + ":disc:" + matchCounter++
      )}<`
  );

  // Light space tidy after sentence end only (avoid nuking intentional padding in attributes)
  s = s.replace(/([.!?])\s{2,}/g, "$1 ");

  return s;
}

function processFile(fp, basename) {
  const html = fs.readFileSync(fp, "utf8");
  const { text, tokens } = shieldBlocks(html);
  const human = applyPhraseVariants(text, basename);
  return unshieldBlocks(human, tokens);
}

let changed = 0;
for (const name of fs.readdirSync(blogDir)) {
  if (!name.endsWith(".html")) continue;
  const fp = path.join(blogDir, name);
  const next = processFile(fp, name);
  const prev = fs.readFileSync(fp, "utf8");
  if (next !== prev) {
    fs.writeFileSync(fp, next, "utf8");
    changed++;
  }
}

console.log(`blog-humanize-tone: updated ${changed} HTML files.`);
