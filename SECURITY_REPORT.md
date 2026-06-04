# NutriThrive Security Audit Report

**Date:** 4 June 2026  
**Site:** https://nutrithrive.com.au  
**Auditor role:** Senior penetration tester / web security engineer  
**Scope:** Full repository + production architecture (static site on Netlify)

---

## Executive summary

NutriThrive is a **static HTML e-commerce marketing site** with **three Netlify serverless functions** (PayPal checkout + contact email). There is **no database, no user login, and no admin panel**. Payment security is **stronger than average** for small sites because prices are recalculated server-side and PayPal capture uses an HMAC token.

The biggest real risks are:

1. **Missing HTTP security headers** (no CSP, HSTS, X-Frame-Options globally)
2. **Form/API spam** (rate limits exist but are in-memory only; no CAPTCHA on JSON endpoints)
3. **Broken newsletter on v2 pages** (users redirected to thank-you without submitting — data integrity issue)
4. **Outdated `nodemailer`** (npm audit: high severity)
5. **Error detail leakage** from PayPal/email functions in 500 responses

No hardcoded **secret** API keys were found in tracked source. PayPal **client ID** in frontend is expected (public identifier).

---

## What this site uses (inventory)

| Category | Technology | Files / location |
|----------|------------|------------------|
| Frontend | Static HTML, Tailwind CSS, vanilla JS | `index.html`, `blog/`, `products/`, `shared/js/` |
| Build | esbuild + clean-css + Tailwind | `scripts/build-assets.mjs`, `package.json` |
| Hosting | Netlify (static + functions) | `netlify.toml`, `_redirects` |
| Payments | PayPal REST (create + capture) | `netlify/functions/paypal-*.js`, `pages/shop/payment.html` |
| Email | Web3Forms **or** SMTP (nodemailer) **or** Netlify Forms fallback | `netlify/functions/send-form.js`, `forms.html` |
| Forms (legacy) | FormSubmit.co on some blog embeds | `blog/*.html` |
| Analytics | Google Analytics `G-WH21SW75WP`, Reddit pixel | page `<head>` scripts |
| Cart | `localStorage` client-side | `scripts/global/cart.js`, `shared/js/cart-v2-ui.js` |
| Shipping | Client + server shared rates | `scripts/global/shipping-rates.js` |
| Auth | **None** (no accounts) | — |
| Database | **None** (no SQL) | — |
| Firebase / Supabase / AWS | **Not used** | — |
| JWT / sessions | **Not used** | — |
| File uploads (public) | Client-only PDF tools in `nutrithrive_labs/` | Blocked in prod via `_redirects` → 404 |
| CI/CD | GitHub Actions → Netlify | `.github/workflows/ci.yml` |
| Secrets storage | Netlify env vars (documented, not in repo) | See `SAFE_ENV_EXAMPLE.md` |

**Not Next.js.** Security header examples in your prompt target Next.js; this site needs **`netlify.toml` `[[headers]]`** blocks instead.

---

## Tests performed

| Test | Command / method | Result |
|------|------------------|--------|
| Dependency audit | `npm audit` | **1 high** (`nodemailer`) |
| Outdated packages | `npm outdated` | Several dev deps behind (non-critical) |
| Unused deps | `npx depcheck` | Missing `react` for `blog/StickyTableOfContents.jsx` (dev artifact) |
| Production build | `npm run build` | **Pass** (66 JS + 41 CSS minified; no source maps emitted) |
| Secret scan | ripgrep for `sk-`, `AKIA`, `AIza`, JWT secrets, `.env` | **No secrets in source** |
| git-secrets | `git secrets --scan` | **Not installed** on this machine — install and run in CI |
| Source maps | ripgrep `sourceMappingURL` | **None found** |
| Manual code review | Netlify functions, forms, cart, payment, CORS, innerHTML | See findings below |
| OWASP ZAP / Burp | Not run in this session | Recommended against staging URL |

---

## Findings

Severity scale: **Critical** → **High** → **Medium** → **Low** → **Info**

---

### FINDING-01 — Missing global security headers

| Field | Detail |
|-------|--------|
| **Severity** | **High** |
| **Category** | Missing security headers |
| **Files** | `netlify.toml` (only cache + `X-Robots-Tag` today) |

**Vulnerability**  
Responses do not set `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy` globally.

**Exploit**  
- **Clickjacking:** Attacker iframes your checkout/contact page.  
- **MIME sniffing:** Legacy browsers may misinterpret uploaded content types.  
- **No HSTS:** First visit over HTTP (before redirect) can be downgraded on hostile networks.  
- **Weak CSP:** Any XSS becomes more dangerous without script restrictions.

**Fix** — add to `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    Permissions-Policy = "camera=(), microphone=(), geolocation=(), payment=(self)"
    Content-Security-Policy = "default-src 'self'; script-src 'self' https://www.paypal.com https://www.paypalobjects.com https://www.googletagmanager.com https://www.google-analytics.com 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://www.paypal.com https://api-m.paypal.com https://www.google-analytics.com https://ipapi.co https://ip-api.com; frame-src https://www.paypal.com; base-uri 'self'; form-action 'self' https://formsubmit.co; upgrade-insecure-requests"
```

Tune CSP after testing PayPal + GA in staging (see `SECURITY_HEADERS.md`).

**Best practice**  
Deploy headers on all routes; validate at https://securityheaders.com.

**Automated test**  
CI curl check: `curl -sI https://nutrithrive.com.au | grep -i x-frame-options`

---

### FINDING-02 — Vulnerable `nodemailer` dependency

| Field | Detail |
|-------|--------|
| **Severity** | **High** |
| **Category** | Insecure dependencies |
| **Files** | `package.json`, `package-lock.json`, `netlify/functions/send-form.js` |

**Vulnerability**  
`npm audit` reports high-severity issues in `nodemailer@6.10.1` (SMTP command injection, DoS in address parser, unintended domain routing).

**Exploit**  
If attacker-controlled strings reach nodemailer envelope/from fields without sanitization, SMTP injection or mail misdelivery is possible. Your `send-form.js` uses fixed `from` and validated `replyTo`, which **reduces** but does not eliminate library-level bugs.

**Fix**

```bash
npm install nodemailer@^8.0.10
npm audit
```

Re-test SMTP path after major version bump.

**Best practice**  
Run `npm audit` in CI; pin versions; prefer Web3Forms API over raw SMTP when possible.

**Automated test**  
`.github/workflows/ci.yml` → add `npm audit --audit-level=high` (fail on high+).

---

### FINDING-03 — Newsletter form on v2 pages never submits

| Field | Detail |
|-------|--------|
| **Severity** | **High** (integrity / abuse of user trust) |
| **Category** | Missing backend validation / broken business logic |
| **Files** | `shared/js/v2-site.js` (lines 744–752), `blog/index.html`, city landing pages |

**Vulnerability**  
`initNewsletterForm()` prevents default and redirects to thank-you **without** calling `send-form`, Netlify Forms, or FormSubmit.

```javascript
// VULNERABLE (current)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  window.location.href = '/pages/newsletter/thank-you.html';
});
```

**Exploit**  
Not a classic hack — users believe they subscribed; you lose leads. Attackers could also pollute analytics funnels with fake “conversions.”

**Fix**

```javascript
function initNewsletterForm() {
  const form = $('#nt-newsletter-form');
  if (!form || form.dataset.ntEmailBound) return;
  form.setAttribute('name', 'newsletter');
  form.classList.add('newsletter-form');
  form.setAttribute('data-nt-email-form', 'true');
  // form-handler.js (already on site) will bind and POST to send-form
}
```

Ensure `blog/index.html` loads `scripts/global/form-handler.min.js` **after** `v2-site.min.js`, or wire submit inside v2-site to the same `SEND_URL` payload as `form-handler.js`.

**Best practice**  
One canonical form pipeline; never redirect to success without server `200`.

**Automated test**  
Playwright: submit email → assert `POST /.netlify/functions/send-form` returns `{ ok: true }`.

---

### FINDING-04 — API spam / missing CAPTCHA on `send-form`

| Field | Detail |
|-------|--------|
| **Severity** | **Medium** (High if SMTP costs spike) |
| **Category** | Missing rate limits / DOS / API abuse |
| **Files** | `netlify/functions/send-form.js` |

**Vulnerability**  
Rate limit: 15 req/min/IP in **in-memory** `Map`. No CAPTCHA, no honeypot on JSON API, no global Netlify edge limit.

**Exploit**  
Botnet rotates IPs → floods contact/newsletter → inbox spam, Web3Forms quota exhaustion, SMTP blocks.

**Fix**  
- Add Cloudflare Turnstile or hCaptcha; verify server-side before send.  
- Add honeypot field rejected if filled.  
- Use Netlify Blobs / Upstash Redis for distributed rate limits.  
- See `RATE_LIMITING_GUIDE.md`.

**Best practice**  
Never rely on client-only validation; combine rate limit + CAPTCHA + honeypot.

**Automated test**  
Load test: 20 POSTs in 10s from one IP → expect `429`.

---

### FINDING-05 — Serverless rate limits reset on cold start

| Field | Detail |
|-------|--------|
| **Severity** | **Medium** |
| **Category** | Rate limit bypass / DOS |
| **Files** | `netlify/functions/send-form.js`, `paypal-create-order.js`, `paypal-capture-order.js` |

**Vulnerability**  
`requestBuckets = new Map()` is per Lambda instance. New instances reset counters.

**Exploit**  
Attacker triggers many concurrent requests → multiple warm instances → each gets full quota.

**Fix**  
Shared store (Redis, Netlify Edge, Cloudflare WAF rate rules).

**Best practice**  
Edge/WAF rate limiting before functions execute.

**Automated test**  
Burst 100 parallel requests; measure how many succeed vs `429`.

---

### FINDING-06 — Error information disclosure (PayPal functions)

| Field | Detail |
|-------|--------|
| **Severity** | **Medium** |
| **Category** | Logging / sensitive data exposure |
| **Files** | `netlify/functions/paypal-create-order.js` (lines 278–284), `paypal-capture-order.js` (156–161), `send-form.js` (229–237) |

**Vulnerability**  
500 responses include `String(err)` or `err.message`, which may contain PayPal API JSON, stack fragments, or config hints (`missing` env var names).

**Exploit**  
Reconnaissance: learn PayPal error shapes, internal paths, misconfiguration.

**Fix**

```javascript
} catch (err) {
  console.error("[paypal-create-order]", err);
  return {
    statusCode: 500,
    headers,
    body: JSON.stringify({ error: "Unable to create order. Please try again." }),
  };
}
```

**Best practice**  
Generic client errors; detailed logs server-side only.

**Automated test**  
POST invalid payload → response body must not match `/paypal|smtp|secret/i`.

---

### FINDING-07 — Blog forms disable FormSubmit CAPTCHA

| Field | Detail |
|-------|--------|
| **Severity** | **Medium** |
| **Category** | Missing rate limits / spam |
| **Files** | `blog/best-greens-powder-australia-2026.html`, `blog/green-superfood-smoothie-recipes-australia-2026.html`, others with `_captcha=false` |

**Vulnerability**  
`<input name="_captcha" type="hidden" value="false"/>` disables FormSubmit CAPTCHA.

**Exploit**  
Direct POST spam to FormSubmit endpoint tied to your email.

**Fix**  
Remove `_captcha=false`; migrate embeds to `form-handler.js` + `send-form` with Turnstile.

**Best practice**  
Centralize all forms on one backend with bot protection.

**Automated test**  
Grep CI: `rg '_captcha.*false' blog/` must return 0 matches.

---

### FINDING-08 — HTML→PDF sanitizer is custom (XSS risk in labs tool)

| Field | Detail |
|-------|--------|
| **Severity** | **Medium** (Low in prod — labs 404) |
| **Category** | XSS / unsafe HTML injection |
| **Files** | `scripts/pages/labs/converter.js` (`sanitizeUserHtmlForPdf`, `container.innerHTML`) |

**Vulnerability**  
Custom sanitizer may miss vectors (`<svg/onload>`, `<math>`, CSS exfiltration). Content is injected into DOM before `html2canvas`.

**Exploit**  
User pastes malicious HTML in converter → script runs in victim browser (self-XSS / if tool were public).

**Fix**  
Use DOMPurify with strict config; or keep labs blocked (current `_redirects` line 196).

**Best practice**  
Never roll your own HTML sanitizer for untrusted input.

**Automated test**  
Unit test: input `<img src=x onerror=alert(1)>` → output must not contain `onerror`.

---

### FINDING-09 — Client-side cart stores prices (display-only risk)

| Field | Detail |
|-------|--------|
| **Severity** | **Low** (mitigated server-side) |
| **Category** | Authorization / payment bypass attempt |
| **Files** | `scripts/global/cart.js`, `pages/shop/payment.html` |

**Vulnerability**  
Cart in `localStorage` includes `price`. UI shows client values.

**Exploit**  
User edits localStorage to `$0.01` — **PayPal order still uses server catalog** (good). Risk is UX confusion or analytics skew only.

**Fix**  
Already mitigated in `paypal-create-order.js` (`PRODUCT_CATALOG`). Optionally re-fetch prices from server on payment page load.

**Best practice**  
Never trust client prices (you already don't at capture).

**Automated test**  
Tamper cart price → create order → PayPal amount must match catalog.

---

### FINDING-10 — PayPal Client ID hardcoded in frontend

| Field | Detail |
|-------|--------|
| **Severity** | **Info** (expected) |
| **Category** | Exposed API keys |
| **Files** | `scripts/global/paypal-client-config.js`, `shared/js/paypal-client-config.min.js` |

**Vulnerability**  
Public PayPal client ID is visible in JS. **This is normal** for PayPal JS SDK.

**Exploit**  
None by itself; secret must stay in `PAYPAL_CLIENT_SECRET` env only.

**Fix**  
No change required. Ensure PayPal app restricts domains to `nutrithrive.com.au`.

**Best practice**  
Rotate if leaked with secret; client ID alone is not a secret.

---

### FINDING-11 — Dev/audit files may publish if present at deploy

| Field | Detail |
|-------|--------|
| **Severity** | **Medium** |
| **Category** | Server-side code / data exposure |
| **Files** | `crawl_results.json`, `nutrithrive_crawl.js`, `package.json`, `issues/` |

**Vulnerability**  
`.netlifyignore` excludes `audit/`, `tools/`, `scripts/templates/` but **not** root crawl artifacts or `package.json`. If `crawl_results.json` exists during deploy, full site scrape could be public.

**Exploit**  
Attacker downloads `/crawl_results.json` for reconnaissance.

**Fix**  
Add to `.netlifyignore`:

```
crawl_results.json
nutrithrive_crawl.js
nutrithrive_audit.js
issues/
*.csv
```

**Best practice**  
Deploy only `.netlify-publish` output; never copy dev artifacts.

**Automated test**  
After deploy: `curl -o /dev/null -w '%{http_code}' https://nutrithrive.com.au/crawl_results.json` → expect `404`.

---

### FINDING-12 — Open redirect via `_next` (conditional)

| Field | Detail |
|-------|--------|
| **Severity** | **Low** |
| **Category** | Open redirects |
| **Files** | `scripts/global/form-handler.js` (`thankYouUrl`) |

**Vulnerability**  
If a form includes attacker-controlled `input[name=_next]`, redirect goes there after success.

**Exploit**  
Phishing: “You subscribed” → redirect to evil clone.

**Fix**

```javascript
function thankYouUrl(form) {
  const next = form.querySelector('input[name="_next"]')?.value || "";
  const allowed = [
    "/pages/newsletter/thank-you.html",
    "/pages/contact/thank-you.html",
  ];
  if (allowed.includes(next) || next.startsWith("https://nutrithrive.com.au/")) {
    return next;
  }
  return formTypeFrom(form) === "newsletter"
    ? "/pages/newsletter/thank-you.html"
    : "/pages/contact/thank-you.html";
}
```

**Best practice**  
Allowlist redirect targets.

---

### FINDING-13 — Google Sheet ID in repository

| Field | Detail |
|-------|--------|
| **Severity** | **Low** |
| **Category** | Information disclosure |
| **Files** | `scripts/pages/google-apps-script-code.js` |

**Vulnerability**  
Spreadsheet URL with ID in comments. If sheet permissions are wrong, data could leak.

**Fix**  
Move ID to env/docs outside repo; verify sheet is not “Anyone with link can edit.”

---

### FINDING-14 — Contact form on v2 homepage uses mailto-only fallback

| Field | Detail |
|-------|--------|
| **Severity** | **Low** |
| **Category** | Missing backend validation |
| **Files** | `shared/js/v2-site.js` (`initContactForm`) |

**Vulnerability**  
`#nt-contact-form` opens mailto then redirects to thank-you — no server record unless user sends email.

**Fix**  
Use same `send-form` pipeline as `pages/contact/contact.html`.

---

## Categories not applicable (passed)

| Check | Status | Notes |
|-------|--------|-------|
| SQL injection | **N/A** | No database |
| JWT weaknesses | **N/A** | No JWT auth |
| Firebase / Supabase | **N/A** | Not used |
| AWS / S3 exposure | **N/A** | Not used |
| Authentication bypass | **N/A** | No login system |
| Broken session handling | **N/A** | No sessions |
| Privilege escalation | **N/A** | No roles |
| Weak password storage | **N/A** | No passwords stored |
| SSRF in backend | **Not found** | Functions only call PayPal/Web3Forms |
| CORS misconfiguration | **Mostly good** | Allowlist `nutrithrive.com.au` + `www` |
| PayPal price tampering | **Mitigated** | Server-side `PRODUCT_CATALOG` |
| Capture arbitrary orders | **Mitigated** | HMAC `captureToken` + `timingSafeEqual` |
| Source map exposure | **Pass** | No `.map` in build output |
| Admin routes | **Pass** | None found; `/scripts/*` → 404 in prod |
| nutrithrive_labs public | **Mitigated** | `_redirects` → 404 for `/nutrithrive_labs/*` |

---

## Recommended external scans

1. **OWASP ZAP** — baseline scan against production  
2. **securityheaders.com** — after header deploy  
3. **Snyk** — `npx snyk test` in CI  
4. **Cloudflare** — WAF + bot fight mode on `/.netlify/functions/*`  
5. **git-secrets** — install and run on every push  

---

## Summary counts

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 3 |
| Medium | 7 |
| Low | 4 |
| Info | 1 |

**Overall posture:** Better than typical AI-generated shops on payments and secrets; needs headers, dependency updates, form hardening, and v2 newsletter fix.
