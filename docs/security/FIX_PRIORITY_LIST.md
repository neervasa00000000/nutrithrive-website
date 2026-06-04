# Security Fix Priority List — NutriThrive

Ordered by **risk × effort**. Do Phase 1 before next marketing push.

---

## Phase 1 — This week (high impact, low–medium effort)

| # | Fix | Severity | Files | Effort |
|---|-----|----------|-------|--------|
| 1 | Add global security headers in `netlify.toml` | High | `netlify.toml` | 1–2 h |
| 2 | Fix v2 newsletter — wire to `send-form` | High | `shared/js/v2-site.js`, `blog/index.html`, city pages | 1 h |
| 3 | Upgrade `nodemailer` to 8.x + retest email | High | `package.json`, `send-form.js` | 30 min |
| 4 | Generic error messages in all Netlify functions | Medium | `netlify/functions/*.js` | 30 min |
| 5 | Add `npm audit --audit-level=high` to CI | High | `.github/workflows/ci.yml` | 15 min |

---

## Phase 2 — Next 2 weeks

| # | Fix | Severity | Files | Effort |
|---|-----|----------|-------|--------|
| 6 | CAPTCHA (Cloudflare Turnstile) on `send-form` | Medium | `send-form.js`, form HTML/JS | 3–4 h |
| 7 | Honeypot field on JSON form API | Medium | `send-form.js`, `form-handler.js` | 1 h |
| 8 | Remove `_captcha=false` from blog FormSubmit forms | Medium | `blog/*.html` | 1 h |
| 9 | Allowlist `_next` redirects in `form-handler.js` | Low | `form-handler.js` | 30 min |
| 10 | Expand `.netlifyignore` (crawl artifacts, issues/) | Medium | `.netlifyignore` | 15 min |
| 11 | Fix v2 contact form to use `send-form` | Low | `shared/js/v2-site.js` | 1 h |

---

## Phase 3 — Hardening (ongoing)

| # | Fix | Severity | Files | Effort |
|---|-----|----------|-------|--------|
| 12 | Distributed rate limiting (Upstash / Cloudflare WAF) | Medium | infra + functions | 4–8 h |
| 13 | Install `git-secrets` + pre-commit hook | Medium | `.github/workflows/ci.yml` | 1 h |
| 14 | OWASP ZAP baseline in CI against staging | — | new workflow | 2 h |
| 15 | PayPal domain restriction audit in PayPal dashboard | Info | external | 15 min |
| 16 | Migrate all FormSubmit embeds → `send-form` | Medium | blog templates | 2–4 h |
| 17 | DOMPurify in labs converter (if labs ever re-enabled) | Medium | `converter.js` | 2 h |
| 18 | Cloudflare in front of Netlify (DDoS + WAF) | Medium | DNS | 1–2 h |

---

## Do not change (already secure)

- Server-side PayPal pricing (`PRODUCT_CATALOG`) — keep as source of truth  
- HMAC capture token — keep  
- CORS origin allowlist — keep; do not widen to `*`  
- `_redirects` blocking `/scripts/*`, `/tools/*`, `/nutrithrive_labs/*` — keep  

---

## Verification checklist (after Phase 1)

- [ ] https://securityheaders.com → grade A or A+  
- [ ] `npm audit` → 0 high/critical  
- [ ] Blog newsletter POST hits `/.netlify/functions/send-form`  
- [ ] PayPal test checkout still completes  
- [ ] `curl -I https://nutrithrive.com.au` shows HSTS + CSP  
- [ ] `/crawl_results.json` returns 404 on production  
