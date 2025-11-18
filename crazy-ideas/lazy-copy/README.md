# Lazy Copy - P2P Encrypted Clipboard Sync

Real-time clipboard synchronization between devices using WebRTC. All data is end-to-end encrypted.

## Quick Setup (5 minutes)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   node server.js
   ```
   Server runs on `http://localhost:3000`

3. **Open in browser:**
   - Open `http://localhost:3000/index.html` in your browser
   - Or open `index.html` directly (server URL will default to `ws://localhost:3000`)

## How to Use

### Device A (Sender):
1. Click "Connect" to connect to the WebSocket server
2. Click "Create Room" - a room ID and link will be generated
3. Copy the room link and share it with Device B
4. Type text in the textarea - it will auto-sync to Device B
5. Or click "Monitor Clipboard" to auto-send clipboard changes

### Device B (Receiver):
1. Open the room link shared by Device A
2. Click "Connect" (if not already connected)
3. Click "Join" - you'll automatically connect to Device A
4. Text from Device A will appear automatically in the textarea
5. Optionally enable "Monitor Clipboard" to auto-copy received text

## Features

- ✅ Real-time bidirectional sync
- ✅ End-to-end encryption (ECDH + AES-GCM)
- ✅ No accounts or server storage
- ✅ Clipboard monitoring
- ✅ History of sent/received items
- ✅ Works across different devices/networks

## Technical Details

- **Signaling Server**: Express + WebSocket (for WebRTC handshake)
- **P2P Connection**: WebRTC Data Channels
- **Encryption**: ECDH key exchange + AES-GCM encryption
- **Storage**: IndexedDB for local history

## Notes

- The server only facilitates WebRTC signaling - it doesn't see your data
- All clipboard data is encrypted before transmission
- Works best when both devices are on the same network or have good NAT traversal

