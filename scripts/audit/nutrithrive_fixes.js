import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CRAWL = path.join(ROOT, 'audit', 'crawl_results.json');
const FIXES = path.join(ROOT, 'audit', 'reports', 'auto_fixes.md');

const data = JSON.parse(fs.readFileSync(CRAWL, 'utf8'));
const pages = data.data || [];

let fixFile = `# NUTRITHRIVE AUTO-GENERATED FIX FILE
# Generated from live Firecrawl crawl
# Date: ${new Date().toISOString()}
# Pages analysed: ${pages.length}

`;

pages.forEach(page => {
  const url = page.metadata?.sourceURL || page.url || '';
  const html = page.html || '';
  
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  
  const title = titleMatch ? titleMatch[1].trim() : null;
  const desc = descMatch ? descMatch[1].trim() : null;
  const h1 = h1Match ? h1Match[1].trim() : null;
  
  const needsFix = (title && title.length > 60) || 
                   !desc || 
                   !h1 || 
                   !html.includes('/products/moringa-powder/');
  
  if (needsFix && url.includes('nutrithrive.com.au')) {
    const path = url.replace('https://nutrithrive.com.au', '');
    fixFile += `\n${'─'.repeat(60)}\n`;
    fixFile += `FILE: ${path}\nURL: ${url}\n\n`;
    
    if (title && title.length > 60) {
      fixFile += `PROBLEM: Title is ${title.length} chars (max 60)\n`;
      fixFile += `CURRENT: ${title}\n`;
      fixFile += `ACTION: Shorten to under 60 chars keeping main keyword\n\n`;
    }
    
    if (!desc) {
      fixFile += `PROBLEM: Missing meta description\n`;
      fixFile += `ACTION: Add meta description 140-160 chars with target keyword\n\n`;
    }
    
    if (!h1) {
      fixFile += `PROBLEM: Missing H1 tag\n`;
      fixFile += `ACTION: Add H1 with primary keyword for this page\n\n`;
    }
    
    if (url.includes('/blog/') && !html.includes('/products/moringa-powder/')) {
      fixFile += `PROBLEM: Blog has no link to product page\n`;
      fixFile += `ACTION: Add after first paragraph:\n`;
      fixFile += `<p><strong><a href="/products/moringa-powder/">Buy moringa powder Australia — $11/100g →</a></strong></p>\n\n`;
    }
  }
});

fs.mkdirSync(path.dirname(FIXES), { recursive: true });
fs.writeFileSync(FIXES, fixFile);
console.log(`Fix file saved to ${FIXES}`);
console.log(`Generated fixes for pages with issues`);
