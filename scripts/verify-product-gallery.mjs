import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../storefront/js/data.js';
const source = fs.readFileSync('storefront/js/site.js','utf8');
const fn = source.slice(source.indexOf('function bindProductGallery()'), source.indexOf('function pdpMoney('));
function node(dataset={}) {
 return {dataset,attrs:{},events:{},src:'',alt:'',textContent:'',setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]},addEventListener(k,fn){this.events[k]=fn}};
}
const photos=[['/pack.webp?v=1','Pack'],['/texture.webp?v=1','Texture'],['/detail.webp?v=1','Detail']];
const thumbs=photos.map(([src,alt])=>node({src,alt}));
const image=node();image.src='https://preview.example/pack.webp?v=1';image.attrs.srcset='old.jpg 900w';
const open=node();const close=node();const prev=node();const next=node();const enlarged=node();const count=node();const position=node();
const dialog=node();dialog.open=false;dialog.showModal=()=>dialog.open=true;dialog.close=()=>dialog.open=false;
const inside={'[data-gallery-enlarged]':enlarged,'[data-gallery-dialog-count]':count,'[data-gallery-close]':close,'[data-gallery-prev]':prev,'[data-gallery-next]':next};
dialog.querySelector=s=>inside[s];
const nodes={'[data-pdp-image]':image,'[data-gallery-dialog]':dialog,'[data-gallery-open]':open,'[data-gallery-position]':position};
const events={};const document={querySelector:s=>nodes[s],querySelectorAll:()=>thumbs,addEventListener:(k,fn)=>events[k]=fn};
vm.runInNewContext(fn+'\nbindProductGallery();',{document,location:{href:'https://preview.example/products/moringa-powder/'},URL});
thumbs[1].events.click();assert.equal(image.src,'/texture.webp?v=1');assert.equal(enlarged.alt,'Texture');assert.equal(thumbs[1].attrs['aria-pressed'],'true');assert.equal(thumbs[0].attrs['aria-pressed'],'false');assert.equal(image.attrs.srcset,undefined);assert.equal(position.textContent,'2 / 3');
open.events.click();assert.equal(dialog.open,true);assert.equal(count.textContent,'2 / 3');
dialog.events.keydown({key:'ArrowRight',preventDefault(){}});assert.equal(image.src,'/detail.webp?v=1');
next.events.click();assert.equal(image.src,'/pack.webp?v=1');prev.events.click();assert.equal(image.src,'/detail.webp?v=1');
close.events.click();assert.equal(dialog.open,false);
events['nt-gallery-select']({detail:{src:'/texture.webp'}});assert.equal(image.src,'/texture.webp?v=1');assert.equal(position.textContent,'2 / 3');
open.events.click();dialog.events.click({target:dialog});assert.equal(dialog.open,false);
vm.runInNewContext(fn+'\nbindProductGallery();',{document:{querySelector:()=>null,querySelectorAll:()=>[]}});
console.log('Gallery: thumbnail selection, responsive-image reset, modal, arrow navigation, wraparound, variant sync and non-product pages pass.');

for (const product of PRODUCTS) {
  assert.ok(product.image.startsWith('/assets/images/product_webp/'), `Product image folder: ${product.id}`);
  assert.ok(fs.existsSync(`site${product.image}`), `Missing product image: ${product.id}`);
}
for (const dir of fs.readdirSync('site/products', {withFileTypes: true}).filter(entry => entry.isDirectory())) {
  const path = `site/products/${dir.name}/index.html`;
  if (!fs.existsSync(path)) continue;
  const html = fs.readFileSync(path, 'utf8');
  for (const match of html.matchAll(/(?:src|data-src)="(\/assets\/images\/[^"?]+)(?:\?[^\"]*)?"/g)) {
    if (match[1].includes('/logo/')) continue;
    assert.ok(match[1].startsWith('/assets/images/product_webp/'), `${path}: ${match[1]}`);
  }
}
console.log('All product images are present and restricted to product_webp.');
