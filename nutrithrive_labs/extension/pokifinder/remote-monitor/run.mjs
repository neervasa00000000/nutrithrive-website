#!/usr/bin/env node
/**
 * Pokifinder remote monitor — runs anywhere Node runs (GitHub Actions, VPS, home Pi).
 * When your laptop is off, the *extension* cannot run; this job compares page fingerprints
 * and pings Telegram or Discord if a watched listing changes (new links, big HTML shift).
 *
 * Setup (pick one transport):
 *   WATCH_URLS           comma-separated listing URLs to poll
 *   TELEGRAM_BOT_TOKEN  + TELEGRAM_CHAT_ID  → Telegram message
 *   DISCORD_WEBHOOK_URL → Discord channel webhook
 *
 * First run per URL saves baseline only (no alert). Later runs alert on fingerprint change.
 *
 * Limits: many shops render stock in the browser only; server-side fetch may miss that,
 * same as the extension background worker. Use for listings that include links in raw HTML.
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.join(__dirname, ".state.json");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function loadState() {
  try {
    const raw = fs.readFileSync(STATE_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return { fingerprints: {}, updatedAt: null };
  }
}

function saveState(state) {
  state.updatedAt = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf8");
}

function fingerprintPage(html, pageUrl) {
  let origin = "";
  try {
    origin = new URL(pageUrl).origin;
  } catch {
    return null;
  }

  const productPaths = new Set();
  const absRe = /href=["'](https?:\/\/[^"'#]+\/(?:product|products|p|item)\/[^"'#?]+)/gi;
  let m;
  while ((m = absRe.exec(html))) {
    try {
      const u = new URL(m[1]);
      productPaths.add(u.pathname + u.search);
    } catch {
      /* skip */
    }
  }
  const relRe = /href=["'](\/(?:product|products|p|item)\/[^"'#?]+)/gi;
  while ((m = relRe.exec(html))) {
    try {
      productPaths.add(new URL(m[1], origin).pathname + new URL(m[1], origin).search);
    } catch {
      /* skip */
    }
  }

  const sorted = [...productPaths].sort();
  const lower = html.slice(0, 120000).toLowerCase();
  const stockBits = [
    lower.includes("in store only") ? "iso" : "",
    lower.includes("out of stock") ? "oos" : "",
    lower.includes("sold out") ? "so" : "",
    lower.includes("add to cart") ? "cart" : "",
    lower.includes("add to bag") ? "bag" : "",
  ]
    .filter(Boolean)
    .join(",");

  const payload = `${sorted.join("|")}\n${html.length}\n${stockBits}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function notifyTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chat,
      text,
      disable_web_page_preview: false,
    }),
  });
  if (!r.ok) {
    const err = await r.text();
    console.error("Telegram error:", err);
  }
}

async function notifyDiscord(text) {
  const hook = process.env.DISCORD_WEBHOOK_URL;
  if (!hook) return;
  const r = await fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: text.slice(0, 1900) }),
  });
  if (!r.ok) console.error("Discord error:", await r.text());
}

async function notifyAll(text) {
  console.log(text);
  await notifyTelegram(text);
  await notifyDiscord(text);
}

function readWatchList() {
  const fromEnv = process.env.WATCH_URLS;
  if (fromEnv?.trim()) {
    return fromEnv
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const cfgPath = path.join(__dirname, "config.json");
  if (fs.existsSync(cfgPath)) {
    try {
      const c = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
      if (Array.isArray(c.watchUrls)) return c.watchUrls.filter(Boolean);
    } catch {
      /* noop */
    }
  }
  return [];
}

async function main() {
  const urls = readWatchList();
  const hasSink =
    (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) ||
    process.env.DISCORD_WEBHOOK_URL;

  if (!urls.length) {
    console.log("No URLs: set WATCH_URLS or config.json watchUrls — exiting 0.");
    process.exit(0);
  }
  if (!hasSink) {
    console.log("No TELEGRAM_* or DISCORD_WEBHOOK_URL — will only log to stdout.");
  }

  const state = loadState();
  if (!state.fingerprints) state.fingerprints = {};

  for (const watchUrl of urls) {
    let html;
    try {
      html = await fetchHtml(watchUrl);
    } catch (e) {
      console.error(`Fetch failed ${watchUrl}:`, e.message);
      continue;
    }

    const fp = fingerprintPage(html, watchUrl);
    if (!fp) continue;

    const prev = state.fingerprints[watchUrl];
    if (prev == null) {
      state.fingerprints[watchUrl] = fp;
      console.log(`Baseline set for ${watchUrl}`);
      continue;
    }

    if (prev !== fp) {
      await notifyAll(
        `Pokifinder (cloud): page changed — open and check stock.\n${watchUrl}\n\n(Fingerprint update; may be new SKU, price, or layout.)`
      );
      state.fingerprints[watchUrl] = fp;
    } else {
      console.log(`No change: ${watchUrl}`);
    }
  }

  saveState(state);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
