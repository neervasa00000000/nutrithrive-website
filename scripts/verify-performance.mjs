import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import fg from 'fast-glob';
import {optimizeStorefrontLoading} from './lib/storefront-performance.mjs';
const source = fs.readFileSync('storefront/js/site.js','utf8');
const lazy = source.slice(source.indexOf('let searchIndexPromise'),source.indexOf('function bindHeader()'));
const scripts=[];
const window={};
const context={window,Promise,Error,Array,document:{head:{appendChild(s){scripts.push(s)}},createElement(){return {remove(){}}}}};
vm.runInNewContext(lazy+';window.loadSearchIndex=loadSearchIndex;',context);
const panel={dataset:{searchIndex:'/search-index.js'}};
const first=window.loadSearchIndex(panel);
assert.equal(scripts.length,1);
assert.equal(window.loadSearchIndex(panel),first,'concurrent opens share one download');
window.NT_SEARCH=[];scripts[0].onload();await first;
await window.loadSearchIndex(panel);assert.equal(scripts.length,1,'loaded search is reused');
delete window.NT_SEARCH;
// Recreate a fresh page to exercise retry after a network failure.
const retryWindow={}; const retryScripts=[];
vm.runInNewContext(lazy+';window.loadSearchIndex=loadSearchIndex;',{window:retryWindow,Promise,Error,Array,document:{head:{appendChild(s){retryScripts.push(s)}},createElement(){return {remove(){}}}}});
const failed=retryWindow.loadSearchIndex(panel);retryScripts[0].onerror();await assert.rejects(failed);
const retry=retryWindow.loadSearchIndex(panel);assert.equal(retryScripts.length,2);retryWindow.NT_SEARCH=[];retryScripts[1].onload();await retry;
let checked=0;
for(const file of await fg('site/**/*.html')) {
 const html=fs.readFileSync(file,'utf8');
 if(!html.includes('/assets/css/storefront-system') || !html.includes('class="storefront-refined"')) continue;
 checked++;
 assert.equal(optimizeStorefrontLoading(html),html,`${file}: loading patch is idempotent`);
 assert.doesNotMatch(html,/<script\b[^>]*src="[^\"]*search-index/,'search must be on-demand');
 assert.match(html,/data-search-index="\/assets\/js\/storefront\/search-index.min.js\?v=20261026-performance-1"/);
 if(html.includes('class="storefront-refined"')) assert.doesNotMatch(html,/<link[^>]*rel="preload"[^>]*fraunces/);
 for(const tag of html.matchAll(/<(?:img|link)\b[^>]*(?:srcset|imagesrcset)="([^"]+)"[^>]*>/g)) {
  for(const candidate of tag[1].split(',')) {
   const src=candidate.trim().split(/\s+/)[0].split('?')[0];
   if(src.startsWith('/assets/')) assert.ok(fs.existsSync('site'+src),`${file}: missing ${src}`);
  }
 }
}
const home=fs.readFileSync('site/index.html','utf8');
assert.match(home,/imagesrcset="[^"]*-card-160.webp 160w/);
assert.match(home,/hero-collection-item[^]*?-card-320.webp 320w/);
console.log(`Performance checks passed for ${checked} pages: responsive assets, preload hints, deferred search, retry and font priority.`);
