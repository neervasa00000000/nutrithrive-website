// Tiny signaling server (Express + ws) for WebRTC offers/answers and key exchange.
// Run: npm install express ws uuid
// Then: node server.js

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// Serve client file and static
app.use(express.static(path.join(__dirname, '/')));

// In-memory rooms map: roomId -> { sockets: Set(ws) }
// NOTE: This server is stateless regarding message contents; it only forwards.
const rooms = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (msgRaw) => {
    let msg;
    try { msg = JSON.parse(msgRaw); } catch (e) { return; }

    const { type, roomId, payload, target } = msg;

    // Join room
    if (type === 'join') {
      ws.roomId = roomId;
      ws.clientId = msg.clientId || uuidv4();
      if (!rooms.has(roomId)) rooms.set(roomId, new Set());
      rooms.get(roomId).add(ws);

      // notify others of new peer
      rooms.get(roomId).forEach(s => {
        if (s !== ws) {
          try { s.send(JSON.stringify({ type: 'peer-joined', clientId: ws.clientId })); } catch(e){}
        }
      });
      return;
    }

    // Leave room (optional)
    if (type === 'leave') {
      const r = rooms.get(roomId);
      if (r) r.delete(ws);
      return;
    }

    // Relay other types: offer, answer, ice, pubkey, signal
    if (type === 'signal' || type === 'offer' || type === 'answer' || type === 'ice' || type === 'pubkey') {
      // if target provided, forward only to that clientId
      const r = rooms.get(roomId);
      if (!r) return;

      r.forEach(s => {
        // forward to all except sender; if target present, only to that target
        if (s === ws) return;
        if (target && s.clientId !== target) return;
        try { s.send(JSON.stringify({ type, from: ws.clientId, payload })); } catch(e){}
      });
      return;
    }
  });

  ws.on('close', () => {
    if (ws.roomId) {
      const r = rooms.get(ws.roomId);
      if (r) {
        r.delete(ws);
        if (r.size === 0) rooms.delete(ws.roomId);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Signaling server running on http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT}/index.html in your browser`);
});

