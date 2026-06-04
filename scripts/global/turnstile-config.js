/**
 * Cloudflare Turnstile site key (public). Leave empty until configured.
 * Set the same value in Netlify as TURNSTILE_SECRET_KEY (server-only).
 * https://dash.cloudflare.com → Turnstile
 */
(function (w) {
    if (!w) return;
    if (!w.NT_TURNSTILE_SITE_KEY) w.NT_TURNSTILE_SITE_KEY = "";
})(typeof window !== "undefined" ? window : globalThis);
