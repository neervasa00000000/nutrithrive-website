#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "./lib/paths.mjs";

const key = fs.readFileSync(path.join(REPO_ROOT, ".indexnow-key"), "utf8").trim();
if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error("Invalid IndexNow key.");

const host = "nutrithrive.com.au";
const urlList = [
  `https://${host}/`,
  `https://${host}/products/moringa-powder/`,
  `https://${host}/blog/moringa-patches-australia-review-do-they-work`,
];
const body = {
  host,
  key,
  keyLocation: `https://${host}/${key}.txt`,
  urlList,
};

if (process.argv.includes("--dry-run")) {
  console.log(`IndexNow payload valid for ${urlList.length} URLs.`);
  process.exit(0);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});
if (!response.ok) {
  const detail = await response.text();
  throw new Error(`IndexNow submission failed (${response.status})${detail ? `: ${detail}` : ""}`);
}
console.log(`IndexNow accepted ${urlList.length} URLs (${response.status}).`);
