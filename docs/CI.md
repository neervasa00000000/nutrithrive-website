# CI (validate-and-deploy)

GitHub Actions workflow: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) — job name **validate-and-deploy**.

## What runs on every push to `main`

1. `npm ci`
2. `npm audit --audit-level=high`
3. `npm run build:minify`
4. `node scripts/verify-sitemap-locs.mjs` — committed `sitemap.xml` must match `scripts/build-sitemap.cjs`
5. `node scripts/verify-blog-itemlist.mjs` — `blog/index.html` ItemList must match live posts
6. `node scripts/blog-duplicate-scan.mjs` — no two posts with ≥70% similar body copy
7. `node scripts/prepare-netlify-publish.mjs`
8. Netlify production deploy (when `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` secrets are set)

## Run the same checks locally

```bash
npm ci
npm run ci
```

## After adding or editing blog posts

```bash
node scripts/build-sitemap.cjs && git add sitemap.xml
node scripts/regenerate-blog-itemlist.mjs && git add blog/index.html
npm run ci
```

## Optional pre-commit hook

Install once per clone (runs sitemap + ItemList + duplicate scan when `blog/`, `sitemap.xml`, or `_redirects` change):

```bash
npm run hooks:install
```

## Common failure causes

| Step | Typical fix |
|------|-------------|
| Sitemap verify | Regenerate sitemap; remove stale URLs (e.g. old `gas-guardian/.next` paths) |
| ItemList verify | `node scripts/regenerate-blog-itemlist.mjs` |
| Duplicate scan | Differentiate article bodies or retire duplicate posts |
| `npm audit` | Update vulnerable dependencies in `package.json` / lockfile |
