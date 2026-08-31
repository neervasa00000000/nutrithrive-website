const path = require("node:path");

const REPO_ROOT = path.resolve(__dirname, "../..");
const SITE_ROOT = path.join(REPO_ROOT, "site");

module.exports = { REPO_ROOT, SITE_ROOT };
