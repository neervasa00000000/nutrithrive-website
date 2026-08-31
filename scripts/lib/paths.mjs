import path from "node:path";
import { fileURLToPath } from "node:url";

/** Repo root (package.json, netlify.toml, scripts/). */
export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** Public website files. Netlify publish copies this folder to the deploy root. */
export const SITE_ROOT = path.join(REPO_ROOT, "site");
