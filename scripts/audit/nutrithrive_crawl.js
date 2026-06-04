import { FirecrawlAppV1 as FirecrawlApp } from 'firecrawl';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.join(ROOT, 'audit', 'crawl_results.json');

const app = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

async function crawlSite() {
  console.log('Starting crawl of nutrithrive.com.au...');

  const crawlResult = await app.crawlUrl('https://nutrithrive.com.au', {
    limit: 200,
    scrapeOptions: {
      formats: ['markdown', 'html'],
      onlyMainContent: false,
      includeTags: [
        'title', 'meta', 'h1', 'h2', 'h3',
        'a', 'img', 'link', 'script', 'canonical',
      ],
    },
  });

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(crawlResult, null, 2));

  console.log(`Crawled ${crawlResult.data?.length || 0} pages`);
  console.log(`Results saved to ${OUT}`);
  return crawlResult;
}

crawlSite().catch(console.error);
