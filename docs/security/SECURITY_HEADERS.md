# Security Headers Guide — NutriThrive (Netlify)

This site is **static HTML on Netlify**, not Next.js. Configure headers in **`netlify.toml`**, not `next.config.js`.

---

## Required headers (OWASP / securityheaders.com)

| Header | Purpose | Recommended value |
|--------|---------|-------------------|
| `Strict-Transport-Security` | Force HTTPS | `max-age=31536000; includeSubDomains; preload` |
| `X-Frame-Options` | Clickjacking | `DENY` |
| `X-Content-Type-Options` | MIME sniffing | `nosniff` |
| `Referrer-Policy` | Leakage control | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Browser feature lockdown | `camera=(), microphone=(), geolocation=(), payment=(self)` |
| `Content-Security-Policy` | XSS / injection mitigation | See below |

---

## Drop-in `netlify.toml` block

Add **after** existing `[[headers]]` sections:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=(), payment=(self)"
    Content-Security-Policy = """
      default-src 'self';
      script-src 'self' https://www.paypal.com https://www.paypalobjects.com https://www.googletagmanager.com https://www.google-analytics.com 'unsafe-inline';
      style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
      font-src 'self' https://fonts.gstatic.com data:;
      img-src 'self' data: https: blob:;
      connect-src 'self' https://www.paypal.com https://api-m.paypal.com https://api-m.sandbox.paypal.com https://www.google-analytics.com https://region1.google-analytics.com https://ipapi.co https://ip-api.com;
      frame-src https://www.paypal.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self' https://formsubmit.co;
      upgrade-insecure-requests;
    """
```

**Note:** CSP uses `'unsafe-inline'` because many pages inline GA bootstrap scripts. Long-term: move to nonce-based CSP.

---

## Stricter CSP (target state)

After refactoring inline scripts to external files + nonces:

```
script-src 'self' https://www.paypal.com https://www.googletagmanager.com 'nonce-{RANDOM}';
```

Netlify does not support dynamic nonces in static HTML without Edge Functions — phase this in later.

---

## PayPal-specific requirements

PayPal Smart Buttons need:

- `script-src`: `https://www.paypal.com`, `https://www.paypalobjects.com`
- `frame-src`: `https://www.paypal.com`
- `connect-src`: `https://www.paypal.com`, `https://api-m.paypal.com`

Test checkout after every CSP change.

---

## Google Analytics

Allow:

- `script-src`: `https://www.googletagmanager.com`
- `connect-src`: `https://www.google-analytics.com`, `https://region1.google-analytics.com`

---

## Geo IP (country selector)

`shared/js/country-selector.js` calls:

- `https://ipapi.co/json/`
- `https://ip-api.com/json/`

Include both in `connect-src` or remove geo lookup.

---

## Verification

### CLI

```bash
curl -sI https://nutrithrive.com.au | grep -Ei 'strict-transport|x-frame|content-security|x-content-type|referrer-policy|permissions-policy'
```

### Browser

1. Deploy to Netlify preview.  
2. Open DevTools → Console — fix any CSP violations.  
3. Run full PayPal sandbox payment.  
4. Submit contact form.  
5. Scan at https://securityheaders.com/?q=https://nutrithrive.com.au

### CI gate (optional)

```yaml
- name: Check security headers
  run: |
    H=$(curl -sI https://nutrithrive.com.au)
    echo "$H" | grep -qi "x-frame-options: deny" || exit 1
    echo "$H" | grep -qi "strict-transport-security" || exit 1
```

---

## What you already have

Current `netlify.toml` only sets:

- `Cache-Control` on minified assets  
- `X-Robots-Tag: noindex` on `/shared/components/*` and `/nutrithrive_labs/*`

HTTPS enforcement is handled in `_redirects` (301 to apex HTTPS) — **HSTS header is still needed** for browser preload list and first-hit protection.

---

## Cloudflare (optional layer)

If you add Cloudflare in front of Netlify:

- Enable **Always Use HTTPS**  
- **Security Level:** Medium  
- **Bot Fight Mode** on `/.netlify/functions/*`  
- Do not duplicate conflicting CSP at both Cloudflare and Netlify — pick one source of truth
