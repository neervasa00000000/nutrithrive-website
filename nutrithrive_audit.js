import fs from 'fs';

const data = JSON.parse(fs.readFileSync('crawl_results.json', 'utf8'));
const pages = data.data || [];

const issues = {
  critical: [],
  high: [],
  medium: [],
  good: []
};

const allTitles = [];
const allDescriptions = [];
const allH1s = [];

pages.forEach(page => {
  const url = page.metadata?.sourceURL || page.url || 'unknown';
  const html = page.html || '';
  const md = page.markdown || '';
  
  // Extract meta data
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i);
  const imgMatches = [...html.matchAll(/<img[^>]*>/gi)];
  const h2Matches = [...html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi)];
  
  const title = titleMatch ? titleMatch[1].trim() : null;
  const description = descMatch ? descMatch[1].trim() : null;
  const h1 = h1Match ? h1Match[1].trim() : null;
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : null;
  const robots = robotsMatch ? robotsMatch[1].trim() : 'index, follow';
  
  const wordCount = md.split(/\s+/).filter(w => w.length > 0).length;
  
  // Track for duplicates
  if (title) allTitles.push({ url, title });
  if (description) allDescriptions.push({ url, description });
  if (h1) allH1s.push({ url, h1 });
  
  const pageIssues = { url, critical: [], high: [], medium: [], good: [] };
  
  // TITLE CHECKS
  if (!title) {
    pageIssues.critical.push('MISSING TITLE TAG');
  } else if (title.length > 60) {
    pageIssues.high.push(`TITLE TOO LONG (${title.length} chars): "${title}"`);
  } else if (title.length < 30) {
    pageIssues.medium.push(`TITLE TOO SHORT (${title.length} chars): "${title}"`);
  } else {
    pageIssues.good.push(`Title OK (${title.length} chars): "${title}"`);
  }
  
  // META DESCRIPTION CHECKS
  if (!description) {
    pageIssues.high.push('MISSING META DESCRIPTION');
  } else if (description.length > 160) {
    pageIssues.medium.push(`META DESCRIPTION TOO LONG (${description.length} chars)`);
  } else if (description.length < 120) {
    pageIssues.medium.push(`META DESCRIPTION TOO SHORT (${description.length} chars)`);
  } else {
    pageIssues.good.push(`Meta description OK (${description.length} chars)`);
  }
  
  // H1 CHECKS
  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
  if (h1Count === 0) {
    pageIssues.critical.push('MISSING H1 TAG');
  } else if (h1Count > 1) {
    pageIssues.high.push(`MULTIPLE H1 TAGS (${h1Count} found) — should be exactly 1`);
  } else {
    pageIssues.good.push(`Single H1: "${h1}"`);
  }
  
  // CANONICAL CHECK
  if (!canonical) {
    pageIssues.medium.push('MISSING CANONICAL TAG');
  } else if (!canonical.startsWith('https://nutrithrive.com.au')) {
    pageIssues.critical.push(`CANONICAL POINTS ELSEWHERE: ${canonical}`);
  } else {
    pageIssues.good.push(`Canonical OK: ${canonical}`);
  }
  
  // ROBOTS CHECK
  if (robots.includes('noindex')) {
    if (url.includes('/blog/') || url === 'https://nutrithrive.com.au/') {
      pageIssues.critical.push(`IMPORTANT PAGE IS NOINDEXED: ${robots}`);
    } else {
      pageIssues.good.push(`Noindexed (intentional): ${robots}`);
    }
  }
  
  // IMAGE ALT TEXT CHECK
  let missingAlt = 0;
  imgMatches.forEach(match => {
    if (!match[0].includes('alt=') || match[0].includes('alt=""')) {
      missingAlt++;
    }
  });
  if (missingAlt > 0) {
    pageIssues.high.push(`${missingAlt} images missing alt text`);
  }
  
  // WORD COUNT CHECK
  if (wordCount < 300 && url.includes('/blog/')) {
    pageIssues.high.push(`THIN CONTENT: only ${wordCount} words on a blog page`);
  } else if (wordCount < 100) {
    pageIssues.medium.push(`Very thin content: ${wordCount} words`);
  } else {
    pageIssues.good.push(`Word count OK: ${wordCount} words`);
  }
  
  // SCHEMA CHECK
  const hasSchema = html.includes('application/ld+json');
  if (!hasSchema) {
    if (url.includes('/blog/') || url.includes('/products/')) {
      pageIssues.medium.push('NO SCHEMA MARKUP — add Article or Product schema');
    }
  } else {
    pageIssues.good.push('Schema markup present');
  }
  
  // H2 COUNT
  if (h2Matches.length === 0 && wordCount > 300) {
    pageIssues.medium.push('No H2 subheadings — add keyword-rich H2s');
  }
  
  // INTERNAL LINKS TO PRODUCT PAGE
  const linksToProduct = html.includes('/products/moringa-powder/');
  if (url.includes('/blog/') && !linksToProduct) {
    pageIssues.high.push('NO LINK TO PRODUCT PAGE — add buy button');
  }
  
  // OFF-TOPIC CHECK
  const offTopicKeywords = [
    'gym', 'chrome', 'ram', 'browser', 'hiking', 
    'school', 'schooling', 'calendar', 'size converter',
    'soap encyclopedia', 'time zone', 'sydney time'
  ];
  const titleLower = (title || '').toLowerCase();
  const urlLower = url.toLowerCase();
  offTopicKeywords.forEach(kw => {
    if (titleLower.includes(kw) || urlLower.includes(kw.replace(' ', '-'))) {
      pageIssues.critical.push(`OFF-TOPIC PAGE — noindex immediately: "${title}"`);
    }
  });
  
  // Add page issues to main issues object
  if (pageIssues.critical.length > 0) issues.critical.push(pageIssues);
  if (pageIssues.high.length > 0) issues.high.push(pageIssues);
  if (pageIssues.medium.length > 0) issues.medium.push(pageIssues);
  if (pageIssues.good.length > 0 && 
      pageIssues.critical.length === 0 && 
      pageIssues.high.length === 0) {
    issues.good.push(pageIssues);
  }
});

// CHECK FOR DUPLICATE TITLES
const titleMap = {};
allTitles.forEach(({url, title}) => {
  if (!titleMap[title]) titleMap[title] = [];
  titleMap[title].push(url);
});
const dupTitles = Object.entries(titleMap).filter(([,urls]) => urls.length > 1);

// CHECK FOR DUPLICATE DESCRIPTIONS  
const descMap = {};
allDescriptions.forEach(({url, description}) => {
  const key = description.substring(0, 80);
  if (!descMap[key]) descMap[key] = [];
  descMap[key].push(url);
});
const dupDescs = Object.entries(descMap).filter(([,urls]) => urls.length > 1);

// GENERATE REPORT
let report = `
═══════════════════════════════════════════════════════════
NUTRITHRIVE.COM.AU — COMPLETE SEO AUDIT REPORT
Generated: ${new Date().toISOString()}
Total pages crawled: ${pages.length}
═══════════════════════════════════════════════════════════

SUMMARY:
Critical issues: ${issues.critical.length} pages
High priority: ${issues.high.length} pages  
Medium priority: ${issues.medium.length} pages
Healthy pages: ${issues.good.length} pages

`;

// DUPLICATE TITLES
if (dupTitles.length > 0) {
  report += `\n═══ DUPLICATE TITLE TAGS (${dupTitles.length} groups) ═══\n`;
  dupTitles.forEach(([title, urls]) => {
    report += `\nTitle: "${title}"\nFound on:\n`;
    urls.forEach(u => report += `  - ${u}\n`);
  });
}

// DUPLICATE DESCRIPTIONS
if (dupDescs.length > 0) {
  report += `\n═══ DUPLICATE/NEAR-DUPLICATE META DESCRIPTIONS (${dupDescs.length} groups) ═══\n`;
  dupDescs.slice(0, 10).forEach(([desc, urls]) => {
    report += `\nDescription starts: "${desc}..."\nFound on:\n`;
    urls.forEach(u => report += `  - ${u}\n`);
  });
}

// CRITICAL ISSUES
report += `\n═══ CRITICAL ISSUES — FIX IMMEDIATELY (${issues.critical.length} pages) ═══\n`;
issues.critical.forEach(page => {
  report += `\nURL: ${page.url}\n`;
  page.critical.forEach(i => report += `  ❌ ${i}\n`);
});

// HIGH PRIORITY
report += `\n═══ HIGH PRIORITY ISSUES (${issues.high.length} pages) ═══\n`;
issues.high.forEach(page => {
  report += `\nURL: ${page.url}\n`;
  page.high.forEach(i => report += `  ⚠️ ${i}\n`);
});

// MEDIUM PRIORITY
report += `\n═══ MEDIUM PRIORITY ISSUES (${issues.medium.length} pages) ═══\n`;
issues.medium.slice(0, 20).forEach(page => {
  report += `\nURL: ${page.url}\n`;
  page.medium.forEach(i => report += `  💡 ${i}\n`);
});

// HEALTHY PAGES
report += `\n═══ HEALTHY PAGES (${issues.good.length} pages) ═══\n`;
issues.good.slice(0, 10).forEach(page => {
  report += `${page.url}\n`;
});

fs.writeFileSync('seo_audit_report.txt', report);
console.log(report);
console.log('\nFull report saved to seo_audit_report.txt');
