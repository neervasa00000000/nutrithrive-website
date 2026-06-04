# Rate Limiting Guide — NutriThrive

Current protection lives in **Netlify Functions** with **in-memory counters**. This document explains what you have, gaps, and how to harden.

---

## Current implementation

### `send-form.js`

| Setting | Value |
|---------|-------|
| Window | 60 seconds |
| Max requests | 15 per IP |
| Key | `send-form:{clientIp}` |
| Storage | `Map()` in function memory |

### `paypal-create-order.js` / `paypal-capture-order.js`

| Setting | Value |
|---------|-------|
| Window | 60 seconds |
| Max requests | 20 per IP |
| Keys | `paypal-create:{ip}`, `paypal-capture:{ip}` |

### CORS gate (not rate limiting)

All three functions reject requests unless:

```
Origin: https://nutrithrive.com.au
     or https://www.nutrithrive.com.au
```

This blocks random websites from calling your API in browsers — **does not stop curl/server bots**.

---

## Weaknesses

1. **Cold starts** — new Lambda instance = fresh `Map`, quota resets.  
2. **IP spoofing** — `X-Forwarded-For` first hop trusted; hard to spoof through Netlify but botnets rotate real IPs.  
3. **No global cap** — 1000 IPs × 15 emails/min = 15,000 emails/min possible.  
4. **No CAPTCHA** — automated abuse still succeeds within limits.  
5. **PayPal cost** — create-order calls PayPal OAuth each time; spam wastes API quota.

---

## Layer 1 — Keep and improve function limits

### Tighten defaults

```javascript
// send-form.js — suggested production values
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 5;        // was 15
const RATE_LIMIT_BURST_EMAIL = 3; // per email address / hour (add second key)
```

Add email-based limiting:

```javascript
const emailKey = `send-form:email:${email.toLowerCase()}`;
if (isRateLimited(emailKey, 3, 60 * 60 * 1000)) {
  return { statusCode: 429, headers, body: JSON.stringify({ error: "Too many requests" }) };
}
```

### Distributed store (recommended)

Replace `Map` with Upstash Redis:

```javascript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"),
});

const { success } = await ratelimit.limit(`send-form:${clientIp}`);
if (!success) return { statusCode: 429, ... };
```

Env vars: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

---

## Layer 2 — CAPTCHA (highest ROI for forms)

### Cloudflare Turnstile

1. Create Turnstile site key at Cloudflare dashboard.  
2. Add widget to forms (`form-handler.js` + HTML).  
3. Verify in `send-form.js` before sending email:

```javascript
async function verifyTurnstile(token, ip) {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: ip,
    }),
  });
  const data = await res.json();
  return data.success === true;
}
```

Reject if `!token || !(await verifyTurnstile(token, clientIp))`.

**Env:**

```bash
TURNSTILE_SITE_KEY=...      # frontend (public)
TURNSTILE_SECRET_KEY=...    # server only
```

---

## Layer 3 — Honeypot (cheap bot filter)

HTML (hidden via CSS, not `display:none` for accessibility use `tabindex="-1"` off-screen):

```html
<input type="text" name="website" autocomplete="off" tabindex="-1" aria-hidden="true" />
```

Server:

```javascript
if (payload.website) {
  return { statusCode: 200, body: JSON.stringify({ ok: true }) }; // silent fail for bots
}
```

---

## Layer 4 — Edge / WAF (Cloudflare)

Free plan rules:

| Rule | Action |
|------|--------|
| URI Path contains `/.netlify/functions/send-form` | Rate limit 10 req/min/IP |
| URI Path contains `paypal-create-order` | Rate limit 30 req/min/IP |
| Known bad ASNs / Bot score > 30 | Challenge |

Cloudflare sits **in front of** Netlify DNS — blocks traffic before functions run.

---

## Layer 5 — Netlify Forms fallback

When `send-form` returns 503, `form-handler.js` falls back to Netlify Forms. Netlify has its own spam filtering — ensure **Akismet** or Netlify spam plugins enabled in dashboard.

---

## Layer 6 — FormSubmit.co (legacy blog forms)

Blog posts still POST to `formsubmit.co` with `_captcha=false` — **bypasses your function limits entirely**.

**Action:** Migrate to `send-form` + Turnstile; remove FormSubmit actions.

---

## Monitoring

1. **Netlify Functions log drain** → watch 429 rate, 500 spikes.  
2. **Alert** if `send-form` invocations > 500/hour.  
3. **Gmail** filter rules for burst identical subjects.  
4. **PayPal dashboard** — unusual create-order volume.

---

## Automated tests

### Rate limit unit test (pseudo)

```javascript
import { handler } from "../netlify/functions/send-form.js";

for (let i = 0; i < 20; i++) {
  const res = await handler(mockPost({ email: `test${i}@example.com` }));
  if (i >= 15) assert.equal(res.statusCode, 429);
}
```

### Integration (staging)

```bash
for i in $(seq 1 20); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST https://nutrithrive.com.au/.netlify/functions/send-form \
    -H "Origin: https://nutrithrive.com.au" \
    -H "Content-Type: application/json" \
    -d '{"formType":"newsletter","email":"spam'$i'@test.com"}'
done
# Expect 200s then 429s
```

---

## Priority order

1. Fix v2 newsletter to actually hit `send-form` (see `SECURITY_REPORT.md` FINDING-03).  
2. Add Turnstile to `send-form`.  
3. Lower in-memory limits + email-based key.  
4. Cloudflare rate rules on function paths.  
5. Upstash for distributed limits when traffic grows.
