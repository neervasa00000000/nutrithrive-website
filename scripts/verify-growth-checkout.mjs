import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read = p => fs.readFileSync(p, 'utf8');
const rates = { module: { exports: {} }, console: { log() {}, warn() {} } };
vm.runInNewContext(read('scripts/global/shipping-rates.js'), rates);
const storage = new Map();
const sessionStorage = { getItem: k => storage.get(k) || null, setItem: (k,v) => storage.set(k,v), removeItem: k => storage.delete(k) };
let cart = [{id:'moringa-400g', price:40, qty:1, weight:400}];
let sent = [];
let allowAnalytics = true;
const nodes = new Map(['cart-lines','cart-summary','cart-layout'].map(id => [id, {innerHTML:'', hidden:false, classList:{toggle(){}}, querySelectorAll:()=>[]}]));
const events = {};
const context = {
 console, setTimeout(){}, sessionStorage, localStorage:{getItem:()=>null},
 document: {readyState:'loading', documentElement:{dataset:{ntLive:'1'}}, body:{classList:{toggle(){}}}, getElementById:id=>nodes.get(id), addEventListener:(name,fn)=>events[name]=fn},
 window: {ShippingRates: rates.module.exports, addEventListener(){}, NT_PRODUCTS:[], NT:{readCart:()=>cart, trackEcommerce:(name,items)=>{if(!allowAnalytics)return false;sent.push(name);return true;}}}
};
vm.runInNewContext(read('storefront/js/cart-page.js'), context);
const click = {target:{closest:()=>true}};
context.window.NT.renderCart();
assert.match(nodes.get('cart-summary').innerHTML,/Checkout · \$51.12/);
assert.equal((nodes.get('cart-summary').innerHTML.match(/href="\/payment"/g)||[]).length,2);
events.click(click); events.click(click);
assert.deepEqual(sent,['begin_checkout']);
assert.ok(storage.has('nt-begin-checkout'));
function paymentContext(items) {
 const state = { console, sessionStorage, Date, document:{readyState:'loading',addEventListener(){}}, window:{Cart:{get:()=>({items})},NT:{trackEcommerce:(name)=>{sent.push(name);return true;}},addEventListener(){}} };
 vm.runInNewContext(read('storefront/js/payment-page.js').replace(/\}\)\(\);\s*$/, '\nwindow.testTrackBeginCheckout = trackBeginCheckout;\n})();'),state);
 return state;
}
let pay=paymentContext([{id:'moringa-400g',price:40,quantity:1}]);
pay.window.testTrackBeginCheckout();pay.window.testTrackBeginCheckout();
assert.deepEqual(sent,['begin_checkout'],'navigation must not double count');
assert.equal(storage.has('nt-begin-checkout'),false);
pay=paymentContext([{id:'moringa-400g',price:40,quantity:1}]);pay.window.testTrackBeginCheckout();
assert.equal(sent.length,2,'direct payment visit still tracks');
storage.set('nt-begin-checkout',JSON.stringify({signature:JSON.stringify([['moringa-400g',1,40]]),at:Date.now()-400000}));
pay=paymentContext([{id:'moringa-400g',price:40,quantity:1}]);pay.window.testTrackBeginCheckout();assert.equal(sent.length,3,'stale marker does not suppress');
cart=[{id:'moringa-powder',price:11,qty:1,weight:100}];context.window.NT.renderCart();assert.match(nodes.get('cart-summary').innerHTML,/Checkout · \$20.69/);
cart.push({id:'moringa-400g',price:40,qty:1,weight:400});context.window.NT.renderCart();assert.match(nodes.get('cart-summary').innerHTML,/Checkout · \$51.00/);
cart=[];context.window.NT.renderCart();assert.equal(nodes.get('cart-summary').innerHTML,'');assert.equal(nodes.get('cart-summary').hidden,true);
cart=[{id:'moringa-powder',price:11,qty:1,weight:100}];context.window._ntBeginCheckoutSent=false;allowAnalytics=false;events.click(click);assert.equal(storage.has('nt-begin-checkout'),false,'no marker if tracking unavailable');
assert.match(read('storefront/css/system.css'),/@media \(max-width: 767px\)/);
assert.match(read('site/pages/shop/payment.html'),/data-pending="guest-card-test" hidden/);
console.log('Checkout totals, empty cart, click tracking, navigation deduplication and fallback checks passed.');
