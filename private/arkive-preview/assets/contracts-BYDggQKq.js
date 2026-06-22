import{ac as g,ad as h,a7 as w,ae as y,af as C,ag as m,r as u}from"./index-BxvNabUl.js";function b(e,r={}){return{async queryFn({queryKey:t}){const o=r.abi;if(!o)throw new Error("abi is required");const{functionName:n,scopeKey:a,...c}=t[1],i=(()=>{const s=t[1];if(s.address)return{address:s.address};if(s.code)return{code:s.code};throw new Error("address or code is required")})();if(!n)throw new Error("functionName is required");return g(e,{abi:o,functionName:n,args:c.args,...i,...c})},queryKey:p(r)}}function p(e={}){const{abi:r,...t}=e;return["readContract",h(t)]}function A(e={}){const{abi:r,address:t,functionName:o,query:n={}}=e,a=e.code,c=w(e),i=y({config:c}),s=b(c,{...e,chainId:e.chainId??i}),d=!!((t||a)&&r&&o&&(n.enabled??!0));return C({...n,...s,enabled:d,structuralSharing:n.structuralSharing??m})}/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),l=(...e)=>e.filter((r,t,o)=>!!r&&o.indexOf(r)===t).join(" ");/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var E={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=u.forwardRef(({color:e="currentColor",size:r=24,strokeWidth:t=2,absoluteStrokeWidth:o,className:n="",children:a,iconNode:c,...i},s)=>u.createElement("svg",{ref:s,...E,width:r,height:r,stroke:e,strokeWidth:o?Number(t)*24/Number(r):t,className:l("lucide",n),...i},[...c.map(([d,f])=>u.createElement(d,f)),...Array.isArray(a)?a:[a]]));/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=(e,r)=>{const t=u.forwardRef(({className:o,...n},a)=>u.createElement(R,{ref:a,iconNode:r,className:l(`lucide-${x(e)}`,o),...n}));return t.displayName=`${e}`,t},N={PointsSystem:"0x0000000000000000000000000000000000000000",UserRegistry:"0x0000000000000000000000000000000000000000",PostRegistry:"0x0000000000000000000000000000000000000000",VaultRegistry:"0x0000000000000000000000000000000000000000",deployedAt:null,network:"baseSepolia",chainId:84532};export{N as C,I as c,A as u};
