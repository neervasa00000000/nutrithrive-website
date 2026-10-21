import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync('scripts/global/cart.js', 'utf8');
assert.equal(fs.readFileSync('site/assets/js/storefront/runtime-cart.js', 'utf8'), source, 'published cart must match its source');
function load(raw, { blockedRead = false, blockedWrite = false } = {}) {
  let saved = raw;
  const element = () => ({style:{setProperty(){}},remove(){}});
  const context = {
    window: {}, console: { log(){}, warn(){}, error(){} }, setTimeout(){},
    document: { readyState:'loading', addEventListener(){}, querySelectorAll:()=>[], createElement:element, head:{appendChild(){}}, body:{appendChild(){}} },
    localStorage: {
      getItem(){ if (blockedRead) throw new Error('SecurityError'); return saved; },
      setItem(key,value){ if (blockedWrite) throw new Error('QuotaExceededError'); saved=value; },
    },
  };
  vm.runInNewContext(source, context);
  return {cart:context.window.Cart, context};
}
const product = {id:'moringa-powder',name:'Moringa',price:11,weight:100,quantity:1};
for (const raw of ['{}','[]','null','{"items":{}}','{"items":[null,{},42]}','broken JSON']) {
  const {cart} = load(raw);
  cart.add(product);
  assert.equal(cart.getItemCount(),1,`add recovers from ${raw}`);
  assert.equal(cart.getTotal(),11);
  cart.updateQuantity(product.id,2);
  assert.equal(cart.getTotal(),22);
  cart.remove(product.id);
  assert.equal(cart.getItemCount(),0);
}
const {cart}=load(JSON.stringify({items:[product,{...product,id:'bad',quantity:-1},{...product,id:'nan',price:'bad'}],total:999,itemCount:80}));
assert.equal(cart.getItemCount(),1,'discard corrupt rows and stale totals');
assert.equal(cart.getTotal(),11);
for (const qty of [NaN,Infinity,1.5,100,'2cats']) {
  cart.updateQuantity(product.id,qty);
  assert.equal(cart.getItemCount(),1,'invalid updates leave the valid cart intact');
  cart.add({...product,quantity:qty});
  assert.equal(cart.getItemCount(),1,'invalid additions leave the valid cart intact');
}
cart.add({...product,quantity:99,price:12});
assert.equal(cart.getItemCount(),99,'keep quantity within checkout limit');
assert.equal(cart.getTotal(),1188,'refresh a previously saved price when adding again');
cart.updateQuantity(product.id,0);
assert.equal(cart.getItemCount(),0,'zero quantity removes a row');
for (const options of [{blockedRead:true},{blockedWrite:true}]) {
  const {cart}=load(null,options);
  cart.add(product); cart.updateQuantity(product.id,3);
  assert.equal(cart.getTotal(),33,'storage failure must not lose this page session');
  cart.clear(); assert.equal(cart.getItemCount(),0);
}
const site=fs.readFileSync('storefront/js/site.js','utf8');
const viewed=site.slice(site.indexOf('function recordViewed('),site.indexOf('function announce('));
for (const raw of ['{}','null','42','broken']) {
  vm.runInNewContext(viewed+';recordViewed({id:"moringa-powder"});',{localStorage:{getItem:()=>raw,setItem(){throw new Error('blocked');}}});
}
console.log('Cart recovery, invalid quantities, stale totals/prices, storage failure and optional history checks passed.');
