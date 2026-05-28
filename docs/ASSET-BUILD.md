# Asset build (minify JS/CSS + Tailwind)

Semrush and Lighthouse flag unminified first-party assets. This repo compiles Tailwind locally and minifies JS/CSS before deploy.

## Commands

```bash
npm ci
npm run build          # Tailwind + minify + patch HTML
npm run build:minify   # Skip Tailwind recompile (faster)
```

## What it does

1. **`assets/css/tailwind-v2.min.css`** — Built from `tailwind.config.mjs` + all v2 HTML/JS class names. Replaces `cdn.tailwindcss.com` and inline `tailwind-config` on blog/v2 pages.
2. **`*.min.js` / `*.min.css`** — Siblings of source files (esbuild + clean-css).
3. **HTML** — `src`/`href` updated to `.min.js` / `.min.css` where outputs exist.

Manifest: `.build/asset-manifest.json`

## Netlify

`netlify.toml` runs `npm ci && npm run build` on deploy.

## After editing v2 templates

```bash
node scripts/build-live-v2.mjs   # optional shell regen
npm run build                    # minify + patch live HTML
```

## Source of truth for Tailwind theme

`tailwind.config.mjs` — update when adding new design tokens to the v2 shell.
