const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const requestBuckets = new Map();

export function getHeader(event, key) {
    const headers = event?.headers || {};
    if (headers[key] !== undefined) return headers[key];
    const lower = key.toLowerCase();
    const found = Object.keys(headers).find((name) => name.toLowerCase() === lower);
    return found ? headers[found] : undefined;
}

export function getClientIp(event) {
    // Netlify supplies this header; forwarded-for can be set by the caller.
    const netlifyIp = String(getHeader(event, "x-nf-client-connection-ip") || "").trim();
    const forwardedFor = String(getHeader(event, "x-forwarded-for") || "").split(",")[0].trim();
    const fallback = String(event?.requestContext?.identity?.sourceIp || "").trim();
    return netlifyIp || forwardedFor || fallback || "unknown";
}

export function isRateLimited(key, limit = RATE_LIMIT_MAX_REQUESTS, windowMs = RATE_LIMIT_WINDOW_MS) {
    const now = Date.now();
    const bucket = requestBuckets.get(key);
    if (!bucket || now - bucket.windowStart >= windowMs) {
        requestBuckets.set(key, { count: 1, windowStart: now });
        return false;
    }
    bucket.count += 1;
    return bucket.count > limit;
}
