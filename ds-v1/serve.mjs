import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = __dirname;
const REPO = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT || 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  if (clean === "/llms.txt") return path.join(REPO, "llms.txt");
  if (clean.startsWith("/assets/") || clean.startsWith("/documents/")) {
    return path.join(REPO, clean);
  }
  let local = path.join(SITE, clean);
  if (clean.endsWith("/")) local = path.join(local, "index.html");
  else if (!path.extname(clean) && fs.existsSync(local) && fs.statSync(local).isDirectory()) {
    local = path.join(local, "index.html");
  } else if (!path.extname(clean) && fs.existsSync(local + "/index.html")) {
    local = path.join(local, "index.html");
  }
  return local;
}

const server = http.createServer((req, res) => {
  const file = resolve(req.url || "/");
  const allowed =
    file.startsWith(SITE) ||
    file.startsWith(path.join(REPO, "assets")) ||
    file.startsWith(path.join(REPO, "documents")) ||
    file === path.join(REPO, "llms.txt");
  if (!allowed) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      fs.readFile(path.join(SITE, "404.html"), (notFoundError, notFoundPage) => {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
        res.end(notFoundError ? "Not found" : notFoundPage);
      });
      return;
    }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(data);
  });
});

function lanAddresses() {
  const out = [];
  for (const addrs of Object.values(os.networkInterfaces())) {
    for (const a of addrs || []) {
      if (a.family === "IPv4" && !a.internal) out.push(a.address);
    }
  }
  return out;
}

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Computer:  http://localhost:${PORT}/`);
  for (const ip of lanAddresses()) {
    console.log(`Phone:     http://${ip}:${PORT}/`);
  }
  console.log("Phone and computer must be on the same Wi-Fi.");
});
