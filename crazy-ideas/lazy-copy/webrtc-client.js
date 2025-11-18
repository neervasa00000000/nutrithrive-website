// WebRTC P2P Clipboard Sync - Client Code
// This file contains the WebRTC implementation adapted for Lazy Copy

(async function(){
  // Helper functions
  function $(id){ return document.getElementById(id); }
  function showBadge(message, type = 'success') {
    const statusBadge = $('statusBadge');
    if (!statusBadge) return;
    statusBadge.textContent = message;
    statusBadge.className = `badge ${type}`;
    statusBadge.style.display = "inline-flex";
    setTimeout(() => {
      if (statusBadge.textContent === message) {
        statusBadge.style.display = "none";
      }
    }, 3000);
  }

  // IndexedDB for history
  const dbName = 'lazy-copy-db', storeName='snippets';
  function openDb(){ return new Promise((res,rej)=>{
    const r = indexedDB.open(dbName,1);
    r.onupgradeneeded=function(){ r.result.createObjectStore(storeName,{keyPath:'id', autoIncrement:true}); };
    r.onsuccess=()=>res(r.result);
    r.onerror=()=>rej(r.error);
  });}
  async function addHistoryItem(text, meta={}){ const db=await openDb(); const tx=db.transaction(storeName,'readwrite'); tx.objectStore(storeName).add({text, meta, created:Date.now()}); return new Promise(r=>tx.oncomplete=()=>r()); }
  async function loadHistory(){ const db=await openDb(); return new Promise((res,rej)=>{
    const tx=db.transaction(storeName,'readonly'); const cur=tx.objectStore(storeName).openCursor(); const items=[];
    cur.onsuccess=e=>{ const c=e.target.result; if(!c) return res(items); items.push(c.value); c.continue(); };
    cur.onerror=e=>rej(e);
  });}
  async function clearHistory(){ const db=await openDb(); const tx=db.transaction(storeName,'readwrite'); tx.objectStore(storeName).clear(); return new Promise(r=>tx.oncomplete=()=>r()); }

  // Crypto helpers using WebCrypto
  const subtle = window.crypto.subtle;
  async function genKeyPair(){
    const keyPair = await subtle.generateKey({name:'ECDH', namedCurve:'P-256'}, true, ['deriveKey','deriveBits']);
    return keyPair;
  }
  async function exportPublicKey(key){
    const spki = await subtle.exportKey('raw', key);
    return arrayBufferToBase64(spki);
  }
  async function importPublicRaw(base64){
    const ab = base64ToArrayBuffer(base64);
    return subtle.importKey('raw', ab, {name:'ECDH', namedCurve:'P-256'}, true, []);
  }
  async function deriveSharedKey(privateKey, publicKey){
    const derived = await subtle.deriveKey({name:'ECDH', public: publicKey}, privateKey, {name:'AES-GCM', length:256}, false, ['encrypt','decrypt']);
    return derived;
  }
  async function aesEncrypt(key, plaintext){
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder().encode(plaintext);
    const ct = await subtle.encrypt({name:'AES-GCM', iv}, key, enc);
    return {iv: arrayBufferToBase64(iv.buffer), ct: arrayBufferToBase64(ct)};
  }
  async function aesDecrypt(key, iv_b64, ct_b64){
    const iv = base64ToArrayBuffer(iv_b64);
    const ct = base64ToArrayBuffer(ct_b64);
    const plain = await subtle.decrypt({name:'AES-GCM', iv:new Uint8Array(iv)}, key, ct);
    return new TextDecoder().decode(plain);
  }
  function arrayBufferToBase64(ab){ return btoa(String.fromCharCode(...new Uint8Array(ab))); }
  function base64ToArrayBuffer(b64){ const s = atob(b64); const arr = new Uint8Array(s.length); for (let i=0;i<s.length;i++) arr[i]=s.charCodeAt(i); return arr.buffer; }

  // WebRTC & signaling
  let ws = null;
  let roomId = '';
  let clientId = (crypto.getRandomValues(new Uint8Array(4)).reduce((a,b)=>a*256+b)).toString(36);
  let peers = {};
  let localKeyPair = await genKeyPair();
  let localPubB64 = await exportPublicKey(localKeyPair.publicKey);

  // UI elements
  const serverUrlEl = $('serverUrl'), connectBtn = $('connectBtn'), createRoomBtn = $('createRoomBtn'), connStatus = $('connStatus');
  const roomPanel = $('roomPanel'), roomIdInput = $('roomIdInput'), joinRoomBtn = $('joinRoomBtn'), roomLink = $('roomLink'), copyRoomLinkBtn = $('copyRoomLinkBtn'), peerStatus = $('peerStatus');
  const textarea = $('clipboardText'), sendBtn = $('sendBtn'), monitorBtn = $('monitorBtn'), stopMonitorBtn = $('stopMonitorBtn'), statusBadge = $('statusBadge'), historyList = $('historyList'), clearHistoryBtn = $('clearHistoryBtn'), clearBtn = $('clearBtn');

  // Connect to signaling server
  connectBtn.addEventListener('click', ()=>{ connectWS(serverUrlEl.value.trim()); });
  createRoomBtn.addEventListener('click', ()=>{ if(!ws) return showBadge('Connect to server first', 'info'); roomId = (crypto.getRandomValues(new Uint8Array(8)).reduce((a,b)=>a*256+b)).toString(36); roomIdInput.value = roomId; roomPanel.style.display='block'; updateRoomLink(); ws.send(JSON.stringify({type:'join', roomId, clientId}));});
  joinRoomBtn.addEventListener('click', ()=>{ if(!roomIdInput.value) return showBadge('Enter room id', 'info'); roomId = roomIdInput.value.trim(); if(ws) ws.send(JSON.stringify({type:'join', roomId, clientId})); roomPanel.style.display='block'; });

  function connectWS(url){
    try {
      ws = new WebSocket(url);
    } catch(e){ showBadge('Bad WebSocket URL', 'info'); return; }
    ws.onopen = ()=>{ connStatus.innerText='Connected'; roomPanel.style.display='block'; showBadge('Connected to server', 'success'); };
    ws.onclose = ()=>{ connStatus.innerText='Disconnected'; showBadge('Disconnected from server', 'info'); };
    ws.onerror = (e)=>{ connStatus.innerText='Error'; console.error(e); };
    ws.onmessage = async (ev)=>{ const msg = JSON.parse(ev.data); handleSignal(msg); };
  }

  function updateRoomLink(){
    const link = `${location.origin}${location.pathname}?room=${roomId}`;
    if (roomLink) {
      roomLink.value = link;
      $('roomLinkBox').style.display = 'block';
    }
  }

  copyRoomLinkBtn.addEventListener('click', async ()=>{
    if (!roomLink.value) return;
    try {
      await navigator.clipboard.writeText(roomLink.value);
      showBadge('Room link copied!', 'success');
    } catch (e) {
      roomLink.select();
      showBadge('Link selected - copy manually', 'info');
    }
  });

  async function handleSignal(msg){
    const { type, from, payload } = msg;
    if (type === 'peer-joined') {
      const peerId = msg.clientId || from;
      peerStatus.innerText = `Peer joined: ${peerId}`;
      showBadge('Peer joined! Creating connection...', 'success');
      // Create peer connection when someone joins
      await ensurePeer(peerId, true);
      // Send our public key
      ws.send(JSON.stringify({type:'pubkey', roomId, payload:{pub: localPubB64}}));
    }
    if (type === 'offer') {
      await ensurePeer(from, false);
      const pc = peers[from].pc;
      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      ws.send(JSON.stringify({type:'answer', roomId, target: from, payload:{sdp: pc.localDescription}}));
    } else if (type === 'answer') {
      const pc = (peers[from] && peers[from].pc);
      if (pc) pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
    } else if (type === 'ice') {
      const pc = (peers[from] && peers[from].pc);
      if (pc) pc.addIceCandidate(new RTCIceCandidate(payload.cand));
    } else if (type === 'pubkey') {
      if (!peers[from]) peers[from] = {};
      peers[from].remotePubKeyBase64 = payload.pub;
    }
  }

  async function ensurePeer(remoteId, initiator=true){
    if (peers[remoteId] && peers[remoteId].pc) return peers[remoteId];
    const pc = new RTCPeerConnection({iceServers: [{urls:['stun:stun.l.google.com:19302']}]});
    peers[remoteId] = { pc, dc: null, remotePubKeyBase64: null };
    if (initiator) {
      const dc = pc.createDataChannel('clip');
      setupDataChannel(remoteId, dc);
      peers[remoteId].dc = dc;
    } else {
      pc.ondatachannel = (ev)=>{ setupDataChannel(remoteId, ev.channel); peers[remoteId].dc = ev.channel; };
    }
    pc.onicecandidate = (ev)=>{ if(ev.candidate) ws.send(JSON.stringify({type:'ice', roomId, target: remoteId, payload:{cand: ev.candidate}})); };
    pc.onconnectionstatechange = ()=>{ 
      if(pc.connectionState === 'connected'){ 
        peerStatus.innerText = 'Connected to peer '+remoteId; 
        showBadge('Peer connected!', 'success');
      } 
    };
    if (initiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      ws.send(JSON.stringify({type:'offer', roomId, target: remoteId, payload:{sdp: pc.localDescription}}));
    }
    return peers[remoteId];
  }

  function setupDataChannel(remoteId, dc){
    dc.onopen = ()=>{ showBadge('Data channel open', 'success'); };
    dc.onclose = ()=>{ showBadge('Data channel closed', 'info'); };
    dc.onerror = (e)=>{ console.error(e); };
    dc.onmessage = async (ev)=>{
      try {
        const obj = JSON.parse(ev.data);
        if (obj.type === 'pubkey') {
          peers[remoteId].remotePubKeyBase64 = obj.pub;
        } else if (obj.type === 'enc') {
          const {iv, ct, meta, senderPub} = obj;
          const remotePubKey = await importPublicRaw(senderPub);
          const sharedKey = await deriveSharedKey(localKeyPair.privateKey, remotePubKey);
          const plain = await aesDecrypt(sharedKey, iv, ct);
          textarea.value = plain;
          await addHistoryItem(plain, meta||{});
          renderHistory();
          try { await navigator.clipboard.writeText(plain); } catch(e){}
          showBadge('Received and copied!', 'success');
        }
      } catch(e){ console.error(e); }
    };
  }

  async function sendPlainToAll(plain){
    for (const id of Object.keys(peers)){
      const p = peers[id];
      if (!p.dc || p.dc.readyState !== 'open') continue;
      if (!p.remotePubKeyBase64) {
        console.warn('no remote pub for', id);
        continue;
      }
      const remotePubKey = await importPublicRaw(p.remotePubKeyBase64);
      const sharedKey = await deriveSharedKey(localKeyPair.privateKey, remotePubKey);
      const {iv, ct} = await aesEncrypt(sharedKey, plain);
      const payload = { type:'enc', iv, ct, meta:{fromId: clientId, ts:Date.now()}, senderPub: localPubB64 };
      p.dc.send(JSON.stringify(payload));
    }
  }

  sendBtn.addEventListener('click', async ()=>{
    const text = textarea.value.trim();
    if (!text) return showBadge('Add some text first', 'info');
    await addHistoryItem(text, {sent:true});
    renderHistory();
    await sendPlainToAll(text);
    showBadge('Sent!', 'success');
  });

  let monitorInterval = null;
  monitorBtn.addEventListener('click', async ()=>{
    try {
      const t = await navigator.clipboard.readText().catch(()=>null);
      monitorBtn.style.display='none'; 
      stopMonitorBtn.style.display='inline-block';
      monitorInterval = setInterval(async ()=>{
        try {
          const val = await navigator.clipboard.readText();
          if (val && val.trim() && val !== textarea.value.trim()){
            textarea.value = val;
            await addHistoryItem(val, {autoSent:true});
            renderHistory();
            await sendPlainToAll(val);
            showBadge('Auto-sent!', 'success');
          }
        } catch(e){ }
      }, 1200);
    } catch(e){ showBadge('Clipboard read not permitted', 'info'); }
  });

  stopMonitorBtn.addEventListener('click', ()=>{ 
    if (monitorInterval) { 
      clearInterval(monitorInterval); 
      monitorInterval=null; 
      monitorBtn.style.display='inline-block'; 
      stopMonitorBtn.style.display='none'; 
    } 
  });

  clearBtn.addEventListener('click', ()=>{
    textarea.value = "";
    showBadge('Cleared', 'info');
  });

  async function renderHistory(){
    const items = await loadHistory();
    if (!historyList) return;
    historyList.innerHTML = '';
    items.reverse().forEach(it=>{
      const div = document.createElement('div'); 
      div.className='history-item';
      div.style.cssText = 'padding:12px; border-bottom:1px dashed var(--border-subtle); margin-bottom:8px;';
      div.innerHTML = `<div style="display:flex; gap:8px; justify-content:space-between"><div><strong>${new Date(it.created).toLocaleString()}</strong></div><div><button class="btn-ghost" onclick="navigator.clipboard.writeText(${JSON.stringify(it.text)}).then(()=>alert('Copied'))">Copy</button></div></div><div style="margin-top:6px; word-break:break-word;">${escapeHtml(it.text)}</div>`;
      historyList.appendChild(div);
    });
    if (items.length > 0) $('historyPanel').style.display = 'block';
  }

  clearHistoryBtn.addEventListener('click', async ()=>{
    if(confirm('Clear local history?')){ 
      await clearHistory(); 
      renderHistory(); 
      $('historyPanel').style.display = 'none';
    }
  });

  function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  setInterval(()=>{ if(ws && ws.readyState===1 && roomId) ws.send(JSON.stringify({type:'pubkey', roomId, payload:{pub: localPubB64}})); }, 3000);

  const params = new URLSearchParams(location.search);
  if (params.get('room')) { 
    roomIdInput.value = params.get('room'); 
    if (ws && ws.readyState === 1) {
      roomId = params.get('room');
      ws.send(JSON.stringify({type:'join', roomId, clientId}));
      roomPanel.style.display='block';
    }
  }
  
  // Don't auto-connect - let user click Connect button

  // Auto-sync text as user types (debounced) - P2P method
  let p2pSyncTimeout = null;
  textarea.addEventListener('input', (e) => {
    // P2P sync (if connected)
    if (p2pSyncTimeout) clearTimeout(p2pSyncTimeout);
    p2pSyncTimeout = setTimeout(async () => {
      const text = textarea.value.trim();
      if (text && Object.keys(peers).length > 0) {
        // Check if any peer has open data channel
        let hasOpenChannel = false;
        for (const id of Object.keys(peers)) {
          if (peers[id].dc && peers[id].dc.readyState === 'open') {
            hasOpenChannel = true;
            break;
          }
        }
        if (hasOpenChannel) {
          await sendPlainToAll(text);
        }
      }
    }, 1000);
  });

  // Simple URL-based sync (fallback method - works without server)
  const simpleShareLink = $('simpleShareLink');
  const copySimpleLinkBtn = $('copySimpleLinkBtn');
  let lastSimpleText = '';

  function encodeText(text) {
    try {
      return btoa(encodeURIComponent(text));
    } catch (e) {
      return '';
    }
  }

  function decodeText(encoded) {
    try {
      if (!encoded || encoded.length === 0) return '';
      return decodeURIComponent(atob(encoded));
    } catch (e) {
      return '';
    }
  }

  function updateSimpleShareLink(text) {
    if (!simpleShareLink) return;
    
    if (!text || text.trim() === '') {
      simpleShareLink.value = '';
      lastSimpleText = '';
      return;
    }

    try {
      const encoded = encodeText(text);
      if (!encoded) return;
      
      const link = `${location.origin}${location.pathname}?text=${encoded}`;
      simpleShareLink.value = link;
      // Don't auto-select - let user click copy button
      lastSimpleText = text;
    } catch (e) {
      console.error('Error updating simple share link:', e);
    }
  }

  copySimpleLinkBtn.addEventListener('click', async () => {
    if (!simpleShareLink || !simpleShareLink.value) return;
    try {
      await navigator.clipboard.writeText(simpleShareLink.value);
      showBadge('Link copied! Open it on another device', 'success');
    } catch (e) {
      simpleShareLink.select();
      showBadge('Link selected - copy manually', 'info');
    }
  });

  // Check for text in URL on load
  const urlParams = new URLSearchParams(location.search);
  const textParam = urlParams.get('text');
  if (textParam) {
    const decoded = decodeText(textParam);
    if (decoded) {
      textarea.value = decoded;
      showBadge('✅ Loaded text from link!', 'success');
      updateSimpleShareLink(decoded);
    }
  }

  // Auto-update simple share link as user types (debounced)
  let simpleSyncTimeout = null;
  textarea.addEventListener('input', (e) => {
    const text = e.target.value;
    if (simpleSyncTimeout) clearTimeout(simpleSyncTimeout);
    simpleSyncTimeout = setTimeout(() => {
      if (text !== lastSimpleText) {
        updateSimpleShareLink(text);
      }
    }, 500);
  });
  
  // Also update on initial load if textarea has content
  if (textarea && textarea.value) {
    updateSimpleShareLink(textarea.value);
  }

  renderHistory();
  textarea.focus();
})();

