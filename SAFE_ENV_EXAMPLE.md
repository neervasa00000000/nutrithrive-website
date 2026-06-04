# Safe Environment Variables — NutriThrive

**Never commit real values.** Set these in **Netlify → Site configuration → Environment variables** (and GitHub Actions secrets for deploy only).

Copy this file to `.env.local` for local function testing — `.env` and `.env.local` are gitignored.

---

## Required for PayPal checkout (production)

```bash
# Public in frontend JS — must match scripts/global/paypal-client-config.js
PAYPAL_CLIENT_ID=your_paypal_rest_app_client_id

# SECRET — server only, never in frontend or git
PAYPAL_CLIENT_SECRET=your_paypal_rest_app_secret

# Optional: sandbox vs live
# PAYPAL_BASE=https://api-m.sandbox.paypal.com   # dev
PAYPAL_BASE=https://api-m.paypal.com             # production (default)
```

**Where used:** `netlify/functions/paypal-create-order.js`, `paypal-capture-order.js`

**Rotation:** PayPal Developer Dashboard → rotate secret → update Netlify → redeploy.

---

## Required for contact / newsletter email (pick ONE path)

### Option A — Web3Forms (recommended for simplicity)

```bash
WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
FORM_EMAIL_TO=nutrithrive0@gmail.com   # optional; default in code
```

### Option B — SMTP (Gmail app password)

```bash
SMTP_USER=nutrithrive0@gmail.com
SMTP_PASS=your_gmail_app_password_16_chars
SMTP_HOST=smtp.gmail.com               # optional
SMTP_PORT=465                          # optional
SMTP_SECURE=true                       # optional
FORM_EMAIL_TO=nutrithrive0@gmail.com   # optional
```

**Where used:** `netlify/functions/send-form.js`

**Never:** Put `SMTP_PASS` or `WEB3FORMS_ACCESS_KEY` in HTML, JS, or GitHub (except encrypted secrets).

---

## CI/CD only (GitHub Actions)

```bash
NETLIFY_AUTH_TOKEN=netlify_personal_access_token
NETLIFY_SITE_ID=your_netlify_site_uuid
```

**Where used:** `.github/workflows/ci.yml`

---

## Optional — Cloudflare Turnstile (bot protection on forms)

```bash
# Public site key — set in scripts/global/turnstile-config.js (same value)
TURNSTILE_SITE_KEY=your_turnstile_site_key

# Server-only — Netlify environment variable
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
```

When `TURNSTILE_SECRET_KEY` is set, `send-form` requires a valid `turnstileToken` in the JSON body. Until you wire the widget in `form-handler.js` and set the site key, **do not set the secret in production** or legitimate submissions will fail.

---

## Local / dev tooling (not deployed to Netlify)

```bash
# Only for nutrithrive_crawl.js — never expose in client bundle
FIRECRAWL_API_KEY=your_firecrawl_key
```

**Where used:** `nutrithrive_crawl.js`, `nutrithrive_crawl` npm script context

---

## Variables that must NEVER exist as `NEXT_PUBLIC_*` or in frontend

| Secret | Why |
|--------|-----|
| `PAYPAL_CLIENT_SECRET` | Full payment API access |
| `SMTP_PASS` | Send email as your account |
| `WEB3FORMS_ACCESS_KEY` | Spam gateway to your inbox |
| `NETLIFY_AUTH_TOKEN` | Deploy / site takeover |
| `FIRECRAWL_API_KEY` | Paid API abuse |
| OpenAI / Stripe secret keys | Not used today — do not add to frontend |

**Safe in frontend (by design):**

- `PAYPAL_CLIENT_ID` (via `paypal-client-config.js`)
- Google Analytics ID `G-WH21SW75WP`
- Public site URLs, product prices in HTML

---

## Example `.env.local` (local Netlify dev only)

```bash
# .env.local — DO NOT COMMIT

PAYPAL_CLIENT_ID=sb-xxxxxxxx
PAYPAL_CLIENT_SECRET=xxxxxxxx
PAYPAL_BASE=https://api-m.sandbox.paypal.com

WEB3FORMS_ACCESS_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
FORM_EMAIL_TO=you@example.com
```

Run functions locally:

```bash
netlify dev
```

---

## Secret scanning setup

```bash
# macOS
brew install git-secrets

cd /path/to/Website
git secrets --register-aws
git secrets --add 'PAYPAL_CLIENT_SECRET\s*=\s*.+'
git secrets --add 'SMTP_PASS\s*=\s*.+'
git secrets --add 'WEB3FORMS_ACCESS_KEY\s*=\s*.+'
git secrets --scan
```

Add to CI:

```yaml
- name: Scan for secrets
  run: |
    git secrets --scan || (echo "Install git-secrets in CI" && exit 1)
```

---

## Netlify deploy checklist

1. All secrets in Netlify UI only (Production + Deploy previews scoped separately).  
2. Redeploy after changing env vars.  
3. Confirm build log does not print env values.  
4. Restrict PayPal app to `https://nutrithrive.com.au` return URLs.  
5. Use Gmail **App Password**, not account password, for SMTP.
