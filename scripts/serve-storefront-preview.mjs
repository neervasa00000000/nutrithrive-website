#!/usr/bin/env node
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", ".netlify-publish");
const PORT = Number(process.env.PORT || 4174);
const rewrites = new Map([
  ["/about", "pages/about/about.html"],
  ["/contact", "pages/contact/contact.html"],
  ["/faq", "pages/faq/faq.html"],
  ["/cart", "pages/shop/cart.html"],
  ["/payment", "pages/shop/payment.html"],
  ["/privacy-policy", "pages/legal/privacy-policy.html"],
  ["/pages/shipping/shipping-returns", "pages/shipping/shipping-returns.html"],
  ["/thank-you.html", "pages/shop/thank-you.html"],
]);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

function resolveRequest(urlPath) {
  const clean = decodeURIComponent(urlPath).replace(/\/+$/, "") || "/";
  let rel = rewrites.get(clean);
  if (!rel && clean.startsWith("/blog/") && !path.extname(clean)) rel = `${clean.slice(1)}.html`;
  if (!rel) rel = clean === "/" ? "index.html" : clean.slice(1);
  let file = path.resolve(ROOT, rel);
  if (!file.startsWith(`${ROOT}${path.sep}`) && file !== path.join(ROOT, "index.html")) return null;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file) && !path.extname(file) && fs.existsSync(`${file}.html`)) file = `${file}.html`;
  return file;
}

http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  let file = resolveRequest(url.pathname);
  let status = 200;
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    file = path.join(ROOT, "404.html");
    status = 404;
  }
  res.writeHead(status, {
    "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-store",
  });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, "127.0.0.1", () => {
  console.log(`NutriThrive migration preview: http://localhost:${PORT}/`);
});
