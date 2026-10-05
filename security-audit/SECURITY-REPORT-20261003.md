# NutriThrive Security Audit Report

**Date:** Saturday, 3 October 2026  
**Target:** https://nutrithrive.com.au  
**Scanner:** Nuclei v3.11.1 + nuclei-templates v10.4.9 + manual checks  
**Scope:** SSL/TLS, security headers, misconfig/exposure, high/critical CVE templates

---

## Executive Summary

**Overall risk: Low.** No critical or high vulnerabilities were confirmed.

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Informational | 9 (hardening notes) |

Core protections are in place: HSTS, CSP (enforcing), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. Sensitive paths (`.env`, `.git`, backups, WordPress configs) return **404**.

Netlify edge protection rate-limited aggressive template runs (host marked unresponsive mid high/critical pass). That is expected for this host and reduces confidence that *every* CVE template completed — not evidence of a breach.

---

## Risk findings (actionable)

### 1. CSP allows `'unsafe-inline'` scripts — Info / accepted risk

**Nuclei:** `weak-csp-detect:unsafe-script-src`  
**Risk:** Inline script injection is harder to fully contain if an XSS sink appears.  
**Context:** Needed today for GA bootstrap / inline storefront JS with PayPal + analytics third parties.  
**Recommendation:** Keep as-is for now; longer-term move to nonces/hashes when checkout/analytics allow.

### 2. Optional Cross-Origin headers missing — Info

**Nuclei:** missing `Cross-Origin-Embedder-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, `X-Permitted-Cross-Domain-Policies`  
**Risk:** Low for a static ecommerce marketing site. COOP/COEP can break third-party embeds (PayPal, Cloudflare challenges).  
**Recommendation:** Do **not** enable COEP/COOP without a PayPal checkout regression test. Optional later: `Cross-Origin-Opener-Policy: same-origin-allow-popups` if checkout still works.

### 3. No `/.well-known/security.txt` — Info

**Manual:** `404 /.well-known/security.txt`  
**Risk:** None technically; researchers have no published contact.  
**Recommendation:** Add a simple security.txt with a contact email when ready.

---

## What passed

### Security headers

| Header | Status |
|--------|--------|
| Strict-Transport-Security | Present (`max-age=31536000; includeSubDomains; preload`) |
| Content-Security-Policy | Present (enforcing) |
| Content-Security-Policy-Report-Only | Also present (monitor) |
| X-Frame-Options | `DENY` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | camera/mic/geo off; payment for self + PayPal |

### Sensitive file exposure

| Path | HTTP |
|------|------|
| `/.env` | 404 |
| `/.git/config` | 404 |
| `/wp-config.php` | 404 |
| `/.htaccess` | 404 |
| `/config.php` | 404 |
| `/.DS_Store` | 404 |
| `/backup.sql` | 404 |
| `/robots.txt` | 200 (expected) |
| `/sitemap.xml` | 200 (expected) |

### SSL / TLS

- TLS 1.2 and 1.3 enabled  
- Issuer: Let's Encrypt  
- SAN: `nutrithrive.com.au`, `*.nutrithrive.com.au`  
- No weak-protocol / expired-cert findings in the SSL pass

### High / critical CVE templates

- **0 findings**  
- Note: after earlier passes, Netlify marked the host unresponsive (`mhe` skip). Treat as “no confirmed high/critical,” not a 100% exhaustive CVE sweep.

---

## Residual risk (site architecture)

| Area | Notes |
|------|--------|
| Static Netlify site | Small attack surface vs traditional CMS |
| Netlify Functions (PayPal, forms) | Not fully exercised by public Nuclei templates; rely on code review + auth/secrets hygiene |
| Third-party JS (PayPal, GA, Reddit, Cloudflare) | Supply-chain risk; CSP limits origins |
| Form endpoints | Spam/abuse more likely than RCE; rate limits / Turnstile remain useful |

---

## Artifacts

| File | Contents |
|------|----------|
| `manual-check-20261003-004342.txt` | Live headers + path probe |
| `nuclei-ssl-20261003-004342.txt` | SSL/TLS info findings |
| `nuclei-misconfig-20261003-004342.txt` | CSP / missing optional headers |
| `nuclei-vulns-20261003-004342.txt` | High/critical (empty) |
| `nuclei-tech-20261003-004342.txt` | Tech detect (empty / rate-limited) |

---

## Priority next steps (optional)

1. Add `/.well-known/security.txt` (trivial, no product risk).  
2. Keep CSP `'unsafe-inline'` until nonces are feasible.  
3. Skip COEP/COOP unless you are willing to re-test PayPal checkout thoroughly.  
4. Re-run Nuclei from a fresh IP / slower rate (`-rl 5`) if you want a fuller high/critical pass without Netlify skipping the host.
