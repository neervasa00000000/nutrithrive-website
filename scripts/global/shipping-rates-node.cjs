/**
 * Node/CommonJS loader for shipping-rates.js (browser script without ESM exports).
 * Used by Netlify PayPal functions for authoritative server-side shipping.
 */
const { readFileSync } = require("fs");
const { join } = require("path");

const src = readFileSync(join(__dirname, "shipping-rates.js"), "utf8");
const sandbox = { module: { exports: {} }, window: undefined, console };
require("vm").runInNewContext(src, sandbox);

module.exports = sandbox.module.exports;
