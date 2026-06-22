const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-CTClo9U4.js","assets/index-B-rKzsjH.js","assets/index-BxvNabUl.js","assets/index-BgiKNZMp.css","assets/nacl-fast-c_q891qH.js","assets/events-DLteHnzk.js","assets/polygon-BAM-LdF9.js","assets/v4-C5mrYoX2.js","assets/wallet-CTibB3rv.js","assets/sendTransaction-NydPTjak.js","assets/waitForCallsStatus-X6IvXzW1.js","assets/useWriteContract-BXHL_rXT.js"])))=>i.map(i=>d[i]);
import{c as s}from"./contracts-BYDggQKq.js";import{j as r,r as p,_ as v}from"./index-BxvNabUl.js";/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=s("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=s("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=s("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=s("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);function F({type:t="post"}){return r.jsxs("div",{className:"flex items-center gap-1.5",children:[r.jsxs("span",{className:"relative flex h-2 w-2",children:[r.jsx("span",{className:`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${t==="vault"?"bg-purple-400":"bg-cyan-400"}`}),r.jsx("span",{className:`relative inline-flex rounded-full h-2 w-2 ${t==="vault"?"bg-purple-500":"bg-cyan-400"}`})]}),r.jsx("span",{className:"text-xs font-mono text-muted",children:t==="vault"?"encrypted forever":"stored forever"})]})}function E(){const[t,c]=p.useState(!1),[u,l]=p.useState(0);async function f(e,n="application/json"){c(!0),l(0);try{const{TurboFactory:o}=await v(async()=>{const{TurboFactory:m}=await import("./index-CTClo9U4.js");return{TurboFactory:m}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11])),i=JSON.parse("{}");if(!i.kty&&!i.n)throw new Error("ARWEAVE_NOT_CONFIGURED");const y=o.authenticated({privateKey:i});let a;e instanceof File||e instanceof Blob?a=new Uint8Array(await e.arrayBuffer()):typeof e=="string"?a=new TextEncoder().encode(e):a=new Uint8Array(e),l(30);const h=await y.uploadFile({fileStreamFactory:()=>a,fileSizeFactory:()=>a.length,dataItemOpts:{tags:[{name:"Content-Type",value:n},{name:"App-Name",value:"ARKIVE"},{name:"App-Version",value:"0.1.0"}]}});return l(100),h.id}catch(o){throw console.error("Arweave upload failed:",o),o}finally{c(!1)}}async function d(e){const n=await fetch(`https://arweave.net/${e}`);if(!n.ok)throw new Error("Failed to fetch from Arweave");return n}return{uploadToArweave:f,fetchFromArweave:d,uploading:t,progress:u}}export{g as F,k as I,F as P,b as U,A as X,E as u};
