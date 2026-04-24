#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SNIPPET = `
<p class="nt-all-posts-inlink" style="text-align:center;font-size:0.9rem;margin:0.75rem 0 0"><a href="https://nutrithrive.com.au/blog/all-posts.html">All blog articles (A–Z)</a> — every guide with canonical URLs for search</p>`;

const files = `affordable-superfoods-organic-tax-marketplace-wellness-vic-nsw-qld-2026.html
best-superfoods-australia-comparison-health-conscious-adults.html
buy-moringa-powder-melbourne-victoria-chinese-guide.html
growing-moringa-australia-honest-frost-pots-2026.html
healthy-snack-melbourne-why-everyone-switching-to-moringa-2026.html
high-protein-moringa-recipes-australia-2026.html
how-to-read-moringa-batch-codes-freshness.html
melbourne-body-burden-report-2026.html
melbourne-food-as-medicine-map-cafes-organic-stores-healthspan-eating-2026.html
moringa-calm-mind-stress-brain-fog-cortisol-science-2026.html
moringa-melbourne-complete-growers-report-2026.html
moringa-powder-guide-benefits-how-to-use-daily-where-to-buy-australia-2026.html
nutrithrive-delivers-across-victoria-is-your-town-eligible-hint-yes.html
science-shade-drying-vs-sun-drying-moringa.html`
  .trim()
  .split("\n");

let n = 0;
for (const name of files) {
  const f = path.join(ROOT, "blog", name);
  if (!fs.existsSync(f)) {
    console.warn("missing", f);
    continue;
  }
  let s = fs.readFileSync(f, "utf8");
  if (s.includes("blog/all-posts.html")) {
    console.log("skip (has link)", name);
    continue;
  }
  const idx = s.lastIndexOf("</footer>");
  if (idx === -1) {
    console.warn("no footer", name);
    continue;
  }
  s = s.slice(0, idx) + SNIPPET + "\n" + s.slice(idx);
  fs.writeFileSync(f, s);
  n++;
  console.log("patched", name);
}
console.log("Patched", n, "files");
