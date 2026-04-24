#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parts = [
  "01_site_map.md",
  "02_raw_pages.md",
  "03_technical_seo.md",
  "04_content_ux.md",
  "05_quick_wins.md",
  "06_executive_summary.md",
];
let out = `# Nutri Thrive — Full website audit (master report)

**Target website:** [https://nutrithrive.com.au](https://nutrithrive.com.au)  
**Audit run:** 24 April 2026  
**Mapping:** Firecrawl \`map\` (73 URLs) · **Scraping:** Firecrawl \`scrape\` on 50 priority URLs (html + links), parsed locally for headings, images, word counts.

---

## Table of contents

1. [Site map (all discovered URLs)](#1-site-map-all-discovered-urls)
2. [Raw page data (50 scrapes)](#2-raw-page-data-50-scrapes)
3. [Technical SEO findings](#3-technical-seo-findings)
4. [Content and UX review](#4-content-and-ux-review)
5. [Top 15 quick wins](#5-top-15-quick-wins)
6. [Executive summary (plain language)](#6-executive-summary-plain-language)

---

`;
const titles = {
  "01_site_map.md": "1. Site map (all discovered URLs)",
  "02_raw_pages.md": "2. Raw page data (50 scrapes)",
  "03_technical_seo.md": "3. Technical SEO findings",
  "04_content_ux.md": "4. Content and UX review",
  "05_quick_wins.md": "5. Top 15 quick wins",
  "06_executive_summary.md": "6. Executive summary (plain language)",
};
for (const f of parts) {
  const body = fs.readFileSync(path.join(__dirname, f), "utf8");
  out += `<!-- source: ${f} -->\n\n`;
  out += `## ${titles[f]}\n\n`;
  out += body.replace(/^#\s+.+$/m, "").trim() + "\n\n---\n\n";
}
fs.writeFileSync(path.join(__dirname, "FULL_AUDIT_REPORT.md"), out);
console.log("Wrote FULL_AUDIT_REPORT.md");
